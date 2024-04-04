---
title: "My Notes about a Production-grade Ruby on Rails Deployment on Google Cloud Kubernetes Engine"
date: "2018-01-09T22:13:00.000Z"
tags: ["kubernetes", "rubyonrails", "linux", "nginx"]
years: "2018"
---

<p></p>
<p>I've been using Google Cloud with Kubernetes Engine for 2 months and change, from zero to production. Actually, it didn't take me a month to put it all together but it did take an extra month to figure out some nasty rough edges.</p>
<p>TL;DR: Google is actually doing a pretty good job being a counterbalancer so AWS doesn't slack off. If you already know everything about AWS, I'd encourage you to test out Google Cloud. Possibly because of muscle memory, I would still be more comfortable with AWS, but now that I forced myself to suffer the learning process, I am pretty confident with Google Cloud and Kubernetes for most of my scenarios.</p>
<p>Full disclaimer that I am not an expert, so take what I say with a grain of salt. This is one of those subjects that I am super eager to talk about but I'm also very reluctant on the proper choice of words so you don't get the wrong idea about the proposed solutions.</p>
<p>The goal of this exercise is mainly for me to store some snippets and thoughts for future reference. So keep in mind that this is also not a step-by-step tutorial. My first intention was to go that way, but then I realized that it would be almost like writing an entire book, so not this time.</p>
<p>To succeed with something like Google Cloud and Kubernetes you <strong>must</strong> be battle tested in infrastructure. If you never installed server-grade Linux boxes from scratch, if you never did server optimizations, if you're not comfortable with bare server-side components, do not attempt a real production deployment. Your safest bet is still something like Heroku.</p>
<p>You have to be that kinda person that likes to tinker (as you've probably read me doing in <a href="http://www.akitaonrails.com/linux">previous</a> blog posts).</p>
<p>I don't know everything, but I know enough. So I only had to figure out which of the pieces would closely fit my needs. You <strong>must</strong> outline your needs before attempting to write your first YAML file. Planning is crucial.</p>
<p></p>
<p></p>
<p>First things first, this is what I wanted/needed:</p>
<ul>
  <li>Scalable web application tier, where I could do both rolling updates (for <strong>zero downtime</strong> updates) and automatic and manual horizontal scaling of the servers.</li>
  <li>Mountable persistent storage <strong>with</strong> automatic snapshots/backups.</li>
  <li>Managed robust database (Postgresql) with automatic backups and <strong>easy replication</strong> to read-only instances.</li>
  <li>Managed solution to store secrets (such as Heroku's ENV support). Never store production configuration in the source code.</li>
  <li>Docker images support without me having to build custom infrastructure to deploy.</li>
  <li>Static external IP addresses for integrations that required a fixed IP.</li>
  <li>SSL termination so I could connect to CloudFlare (CDN is mandatory, but not enough, in 2018 we need some level of DDoS protection).</li>
  <li>Enough security by default, so everything is - in theory - lockdown unless I decide to open it.</li>
  <li>High-availability in different data center regions and zones.</li>
</ul>
<p>It's easy to deploy a simple demo web application. But I didn't want a demo, I wanted a production-grade solution for the long-run. Improvements to my implementation are super welcome, so feel free to comment down below.</p>
<p>Some of the problems for newcomers:</p>
<ul>
  <li>The documentation is <em>very</em> extensive, and you will find <em>almost</em> everything - if you know what you are looking for. Also bear in mind that Azure and AWS also implement Kubernetes with some differences, so some documentation doesn't apply to Google Cloud and vice-versa.</li>
  <li>There are many features in alpha, beta, and stable stages. The documentation kinda keeps up well, but most tutorials that are just a couple months old may not work as intended anymore (this one included - I am assuming Kubernetes 1.8.4-gke).</li>
  <li>There is a whole set of words that apply to concepts you already know but are called different. Getting used to the vocabulary may get in the way at first.</li>
  <li>It feels like you're playing with Lego. Lots of pieces that you can mix and match. It's easy to mess up. This means that you can build a configuration tailored to your needs. But if you just copy and paste from tutorials you <strong>will</strong> get stuck.</li>
  <li>You can do <em>almost</em> everything through YAML files and the command line, but it's not trivial to reuse the configuration (for production and staging environments, for example). There are 3rd party tools that deal with parameterizable and reusable YAML bits, but I'd do it all by hand first. Never, ever, try automated templates in infrastructure without knowing exactly what they are doing.</li>
  <li>You have 2 <em>fat</em> command line tools: <code>gcloud</code> and <code>kubectl</code>, and the confusing part is that they name some things different even though they are the same "things". At least, <code>kubectl</code> is close to <code>docker</code>, if you're familiar with that.</li>
</ul>
<p>Once again, this is <strong>NOT</strong> a step-by-step tutorial. I will annotate a few steps but not everything.</p>
<h3>Scalable Web-Tier (the Web App itself)</h3>
<p>The very first thing you must have is a fully 12-factors compliant web app.</p>
<p>Be it Ruby on Rails, Django, Laravel, Node.js or whatever. It must be a fully shared-nothing app, that does not depend on writing anything to the local filesystem. One that you can easily shutdown and startup instances independently. No old-style session in local memory or in local files (I prefer to avoid session affinity). No uploads to the local filesystem (if you must, you will have to mount an external persistent storage), always prefer to send binary streams to managed storage services.</p>
<p>You must have a proper <a href="https://tomanistor.com/blog/cache-bust-that-asset/">pipeline that outputs cache-busting through fingerprinting assets</a> (and like it or not, Rails still has the best out-of-the-box solution in its Asset Pipeline). You don't want to worry about manually busting caches in CDNs.</p>
<p>Instrument your app, add <a href="https://rpm.newrelic.com">New Relic RPM</a>, add <a href="https://rollbar.com">Rollbar</a>.</p>
<p>Again, this is 2018, you don't want to deploy naive code with SQL (or any other input) injection, no unchecked <code>eval</code> around your code, no room for CSRF or XSS, etc. Go ahead, buy the license for <a href="https://brakemanpro.com/">Brakeman Pro</a> and add it to your CI pipeline. I can wait ...</p>
<p>As this is not a tutorial, I will assume you're more than able to sign up to Google Cloud and find your way to set up a project, configure your region and zone.</p>
<p>It took me a while to wrap my head around the initial structure in Google Cloud:</p>
<ul>
  <li>You start with a <a href="https://cloud.google.com/resource-manager/docs/creating-managing-projects">Project</a>, which is the umbrella for everything your app needs.</li>
  <li>Then you create <a href="https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture">"clusters"</a>. You can have a production or staging cluster, for example. Or a web cluster and a separated services cluster for non-web stuff, and so on.</li>
  <li>A cluster has a <a href="https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#master">"cluster-master"</a>, which is the controller of everything else (the <code>gcloud</code> and <code>kubectl</code> commands talk to its APIs).</li>
  <li>A cluster has many <a href="https://cloud.google.com/kubernetes-engine/docs/concepts/cluster-architecture#nodes">"node instances"</a>, the proper "machines" (or, more accurately, VM instances).</li>
  <li>Each cluster also has at least one <a href="https://cloud.google.com/kubernetes-engine/docs/concepts/node-pools">"node pool"</a> (the "default-pool"), which is a set of node instances with the same configuration, the same <a href="https://cloud.google.com/compute/docs/machine-types">"machine-type"</a>.</li>
  <li>Finally, each node instance runs one or more "pods" which are lightweight containers like LXC. This is where your application actually is.</li>
</ul>
<p>This is an example of <a href="https://cloud.google.com/sdk/gcloud/reference/container/clusters/create">creating a cluster</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud container clusters create my-web-production \<tt>
</tt>--enable-cloud-logging \<tt>
</tt>--enable-cloud-monitoring \<tt>
</tt>--machine-type n1-standard-4 \<tt>
</tt>--enable-autoupgrade \<tt>
</tt>--enable-autoscaling --max-nodes=5 --min-nodes=2 \<tt>
</tt>--num-nodes 2<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As I mentioned, it also creates a <code>default-pool</code> with a <a href="https://cloud.google.com/compute/docs/machine-types">machine-type</a> of <code>n1-standard-4</code>. Choose what combination of CPU/RAM you will need for your particular app beforehand. The type I chose has 4 vCPUs and 15GB of RAM.</p>
<p>By default, it starts with 3 nodes, so I chose 2 at first but auto-scalable to 5 (you can update it later if you need to, but make sure you have room for initial growth). And you can keep adding extra node-pools for differently sized node instances, let's say, for Sidekiq workers to do heavy-duty background processing. Then you should create a separated Node Pool with a different machine-type for its set of node instances, for example:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud container node-pools create large-pool \<tt>
</tt>--cluster=my-web-production \<tt>
</tt>--node-labels=pool=large \<tt>
</tt>--machine-type=n1-highcpu-8 \<tt>
</tt>--num-nodes 1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This other pool controls 1 node of type <code>n1-highcpu-8</code> which has 8 vCPUs with 7.2 GB of RAM. More CPUs, less memory. You have a category of <code>highmem</code> which is less CPUs with a whole lot more memory. Again, know what you want beforehand.</p>
<p>The important bit here is the <code>--node-labels</code> this is how I will map the deployment to choose between Node Pools (in this case, between the <code>default-pool</code> and the <code>large-pool</code>).</p>
<p>Once you create a cluster, you must issue the following command to fetch its credentials:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud container clusters get-credentials my-web-production<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This sets the <code>kubectl</code> command as well. If you have more than one cluster (let's say, one <code>my-web-production</code> and <code>my-web-staging</code>), you must be very careful to always <code>get-credentials</code> for the correct cluster first, otherwise, you may end up running a staging deployment on the production cluster.</p>
<p>Because this is confusing, I modified my ZSH PROMPT to always show which cluster I am dealing with. I adapted from <a href="https://github.com/superbrothers/zsh-kubectl-prompt">zsh-kubectl-prompt</a>:</p>
<p><img src="https://github.com/superbrothers/zsh-kubectl-prompt/raw/master/images/screenshot001.png" srcset="https://github.com/superbrothers/zsh-kubectl-prompt/raw/master/images/screenshot001.png 2x" alt="zsh kubectl prompt"></p>
<p>As you will end up having multiple clusters in a big app, I highly recommend you add this PROMPT to your shell.</p>
<p>Now, how do you deploy your application to the pods within those fancy node instances?</p>
<p>You must have a <code>Dockerfile</code> in your application project repository to generate a Docker image. This is one example for a Ruby on Rails application:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">FROM ruby:2.4.3<tt>
</tt>ENV RAILS_ENV production<tt>
</tt>ENV SECRET_KEY_BASE xpto<tt>
</tt>RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -<tt>
</tt>RUN apt-get update &amp;&amp; apt-get install -y nodejs postgresql-client cron htop vim<tt>
</tt>ADD Gemfile* /app/<tt>
</tt>WORKDIR /app<tt>
</tt>RUN gem update bundler --pre<tt>
</tt>RUN bundle install --without development test<tt>
</tt>RUN npm install<tt>
</tt>ADD . /app<tt>
</tt>RUN cp config/database.yml.prod.example config/database.yml &amp;&amp; cp config/application.yml.example config/application.yml<tt>
</tt>RUN RAILS_GROUPS=assets bundle exec rake assets:precompile<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>From the Google Cloud Web Console, you will find a <a href="https://cloud.google.com/container-registry/">"Container Registry"</a>, which is a Private Docker Registry.</p>
<p>You must add the remote URL to your local config like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git remote add gcloud https://source.developers.google.com/p/my-project/r/my-app<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you can <code>git push gcloud master</code>. I recommend you also add <a href="https://cloud.google.com/container-builder/docs/running-builds/automate-builds">triggers</a> to tag your images. I add 2 triggers: one to tag it with <code>latest</code> and another to tag it with a random version number. You will need those later.</p>
<p>Once you add the registry repository as a remote on your git configuration (<code>git remote add</code>) and push to it, it should start building your Docker image with the proper tags you configured with the triggers.</p>
<p>Make sure your Ruby on Rails application doesn't have anything in the initializers that require a connection to the database, as it's not available. This is something you might get stuck with when your Docker build fails because of the <code>assets:precompile</code> task loaded an initializer that accidentally calls a Model - and that triggers <code>ActiveRecord::Base</code> to try to connect.</p>
<p>Also, make sure the Ruby version in the <code>Dockerfile</code> matches the one in <code>Gemfile</code>, otherwise it will also fail.</p>
<p>Notice the weird <code>config/application.yml</code> above? This is from <a href="https://github.com/laserlemon/figaro">figaro</a>. I also recommend you using something to make it easy to configure ENV variable in your system. I don't like Rails secrets, and it's not exactly friendly to most deployment systems after Heroku made ENV vars ubiquitous. Stick to ENV vars. Kubernetes will also thank you for that.</p>
<p>Now, you can override any ENV variable from the Kubernetes Deployment YAML file. Now it's a good time to show an example of that. You can name it <code>deploy/web.yml</code> or whatever suits your fancy and - of course - check it into your source code repository.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt>23<tt>
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt>29<tt>
</tt><strong>30</strong><tt>
</tt>31<tt>
</tt>32<tt>
</tt>33<tt>
</tt>34<tt>
</tt>35<tt>
</tt>36<tt>
</tt>37<tt>
</tt>38<tt>
</tt>39<tt>
</tt><strong>40</strong><tt>
</tt>41<tt>
</tt>42<tt>
</tt>43<tt>
</tt>44<tt>
</tt>45<tt>
</tt>46<tt>
</tt>47<tt>
</tt>48<tt>
</tt>49<tt>
</tt><strong>50</strong><tt>
</tt>51<tt>
</tt>52<tt>
</tt>53<tt>
</tt>54<tt>
</tt>55<tt>
</tt>56<tt>
</tt>57<tt>
</tt>58<tt>
</tt>59<tt>
</tt><strong>60</strong><tt>
</tt>61<tt>
</tt>62<tt>
</tt>63<tt>
</tt>64<tt>
</tt>65<tt>
</tt>66<tt>
</tt>67<tt>
</tt>68<tt>
</tt>69<tt>
</tt><strong>70</strong><tt>
</tt>71<tt>
</tt>72<tt>
</tt>73<tt>
</tt>74<tt>
</tt>75<tt>
</tt>76<tt>
</tt>77<tt>
</tt>78<tt>
</tt>79<tt>
</tt><strong>80</strong><tt>
</tt>81<tt>
</tt>82<tt>
</tt>83<tt>
</tt>84<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Deployment</span><tt>
</tt><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">apps/v1beta1</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">web</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">strategy</span>:<tt>
</tt>    <span style="color:#808">type</span>: <span style="background-color:#fff0f0;color:#D20">RollingUpdate</span><tt>
</tt>    <span style="color:#808">rollingUpdate</span>:<tt>
</tt>      <span style="color:#808">maxSurge</span>: <span style="background-color:#fff0f0;color:#D20">1</span><tt>
</tt>      <span style="color:#808">maxUnavailable</span>: <span style="background-color:#fff0f0;color:#D20">1</span><tt>
</tt>  <span style="color:#808">minReadySeconds</span>: <span style="background-color:#fff0f0;color:#D20">10</span><tt>
</tt>  <span style="color:#808">replicas</span>: <span style="background-color:#fff0f0;color:#D20">2</span><tt>
</tt>  <span style="color:#808">template</span>:<tt>
</tt>    <span style="color:#808">metadata</span>:<tt>
</tt>      <span style="color:#808">labels</span>:<tt>
</tt>        <span style="color:#808">app</span>: <span style="background-color:#fff0f0;color:#D20">web</span><tt>
</tt>    <span style="color:#808">spec</span>:<tt>
</tt>      <span style="color:#808">containers</span>:<tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">image: gcr.io/my-project/my-app:latest</span><tt>
</tt>          <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">my-app</span><tt>
</tt>          <span style="color:#808">imagePullPolicy</span>: <span style="background-color:#fff0f0;color:#D20">Always</span><tt>
</tt>          <span style="color:#808">ports</span>:<tt>
</tt>          - <span style="background-color:#fff0f0;color:#D20">containerPort: 4001</span><tt>
</tt>          <span style="color:#808">command</span>: <span style="background-color:#fff0f0;color:#D20">["passenger", "start", "-p", "4001", "-e", "production",</span><tt>
</tt>          <span style="color:#F00;background-color:#FAA">"--max-pool-size", "2", "--min-instances", "2", "--no-friendly-error-pages"</span><tt>
</tt>          <span style="color:#F00;background-color:#FAA">"--max-request-queue-time", "10", "--max-request-time", "10",</span><tt>
</tt>          <span style="color:#F00;background-color:#FAA">"--pool-idle-time", "0", "--memory-limit", "300"]</span><tt>
</tt>          <span style="color:#808">env</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "RAILS_LOG_TO_STDOUT"</span><tt>
</tt>              <span style="color:#808">value</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">true</span><span style="color:#710">"</span></span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "RAILS_ENV"</span><tt>
</tt>              <span style="color:#808">value</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">production</span><span style="color:#710">"</span></span><tt>
</tt>            <span style="color:#888"># ... obviously reduced the many ENV vars for brevity</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "REDIS_URL"</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">secretKeyRef</span>:<tt>
</tt>                  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">my-env</span><tt>
</tt>                  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">REDIS_URL</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "SMTP_USERNAME"</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">secretKeyRef</span>:<tt>
</tt>                  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">my-env</span><tt>
</tt>                  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">SMTP_USERNAME</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "SMTP_PASSWORD"</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">secretKeyRef</span>:<tt>
</tt>                  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">my-env</span><tt>
</tt>                  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">SMTP_PASSWORD</span><tt>
</tt>            <span style="color:#888"># ... this part below is mandatory for Cloud SQL</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: DB_HOST</span><tt>
</tt>              <span style="color:#808">value</span>: <span style="background-color:#fff0f0;color:#D20">127.0.0.1</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: DB_PASSWORD</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">secretKeyRef</span>:<tt>
</tt>                  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">cloudsql-db-credentials</span><tt>
</tt>                  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">password</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: DB_USER</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">secretKeyRef</span>:<tt>
</tt>                  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">cloudsql-db-credentials</span><tt>
</tt>                  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">username</span><tt>
</tt><tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">image: gcr.io/cloudsql-docker/gce-proxy:latest</span><tt>
</tt>          <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">cloudsql-proxy</span><tt>
</tt>          <span style="color:#808">command</span>: <span style="background-color:#fff0f0;color:#D20">["/cloud_sql_proxy", "--dir=/cloudsql",</span><span style="background-color:#fff0f0;color:#D20"><tt>
</tt>                    "-instances=my-project:us-west1:my-db=tcp:5432",<tt>
</tt>                    "-credential_file=/secrets/cloudsql/credentials.json"]</span><tt>
</tt>          <span style="color:#808">volumeMounts</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: cloudsql-instance-credentials</span><tt>
</tt>              <span style="color:#808">mountPath</span>: <span style="background-color:#fff0f0;color:#D20">/secrets/cloudsql</span><tt>
</tt>              <span style="color:#808">readOnly</span>: <span style="background-color:#fff0f0;color:#D20">true</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: ssl-certs</span><tt>
</tt>              <span style="color:#808">mountPath</span>: <span style="background-color:#fff0f0;color:#D20">/etc/ssl/certs</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: cloudsql</span><tt>
</tt>              <span style="color:#808">mountPath</span>: <span style="background-color:#fff0f0;color:#D20">/cloudsql</span><tt>
</tt>      <span style="color:#808">volumes</span>:<tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">name: cloudsql-instance-credentials</span><tt>
</tt>          <span style="color:#808">secret</span>:<tt>
</tt>            <span style="color:#808">secretName</span>: <span style="background-color:#fff0f0;color:#D20">cloudsql-instance-credentials</span><tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">name: ssl-certs</span><tt>
</tt>          <span style="color:#808">hostPath</span>:<tt>
</tt>            <span style="color:#808">path</span>: <span style="background-color:#fff0f0;color:#D20">/etc/ssl/certs</span><tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">name: cloudsql</span><tt>
</tt>          <span style="color:#808">emptyDir</span>:<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There is a lot going on here. So let me break it down a bit:</p>
<ul>
  <li>The <code>kind</code>, and <code>apiVersion</code> is important, you have to keep an eye on the documentation if those change. This is what is called a <a href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/">Deployment</a>. There used to be a Replication Controller (you will find those in old tutorials), but it's no longer in use. The recommendation is to use a <a href="https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/">ReplicaSet</a>.</li>
  <li>Name things correctly, here you have <code>metadata:name</code> with <code>web</code>. Also pay close attention to <code>spec:template:metadata:labels</code> where I am labeling every pod having a label of <code>app: web</code>, you will need this to be able to select those pods later in the Service section down below.</li>
  <li>Then I have <code>spec:strategy</code> where we configure the Rolling Update, so if you have 10 pods, it will terminate one, boot up the new one and keep doing that, without never bringing everything down at once.</li>
  <li><code>spec:replicas</code> declares how many Pods I want at once. You will have to manually calculate the machine-type of the node-pool then divide how many total CPUs/RAM you have by how much you need for each application instance.</li>
  <li>Remember the Docker image we generated above with the 'latest' tag? You refer to it in <code>spec:template:spec:containers:image</code></li>
  <li>I am using Passenger with production configuration (check out <a href="https://www.phusionpassenger.com/library/config/reference/">Phusion's documentation</a>, do not just copy this).</li>
  <li>In the <code>spec:template:spec:containers:env</code> section I can override the ENV vars with the real production secrets. And you will notice that I can hard-code values or use this strange contraption:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">- <span style="background-color:#fff0f0;color:#D20">name: "SMTP_USERNAME"</span><span style="background-color:#fff0f0;color:#D20"><tt>
</tt>  valueFrom:<tt>
</tt>    secretKeyRef:<tt>
</tt>      name: my-env<tt>
</tt>      key: SMTP_USERNAME</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, it's referencing a <a href="https://kubernetes.io/docs/concepts/configuration/secret/">"Secret"</a> storage that I named "my-env". And this is how you create your own:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl create secret generic my-env \<tt>
</tt>--from-literal=REDIS_URL=redis://foo.com:18821 \<tt>
</tt>--from-literal=SMTP_USERNAME=foobar<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Read the documentation as you can load text files instead of declaring everything from the command line.</p>
<p>As I said before, I'd rather use a managed service for a database. You can definitely load your own Docker image, but I really don't recommend it. Same goes for other database-like services such as Redis, Mongo. If you're from AWS, <a href="https://cloud.google.com/sql/docs/postgres/">Google Cloud SQL</a> is like RDS.</p>
<p>After you create your PostgreSQL instance you can't access it directly from the web application. At the end, you have a boilerplate for a second Docker image, a <a href="https://cloud.google.com/sql/docs/mysql/connect-kubernetes-engine">"CloudSQL Proxy"</a>.</p>
<p>For that to work you must first create a Service Account:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud sql users create proxyuser host --instance=my-db --password=abcd1234<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>After you create the PostgreSQL instance it will prompt you to download a JSON credential, so be careful and save it somewhere safe. I don't have to say that you must generate a strong secure password as well. Then you must create extra secrets:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl create secret generic cloudsql-instance-credentials \<tt>
</tt>--from-file=credentials.json=/home/myself/downloads/my-db-12345.json<tt>
</tt><tt>
</tt>kubectl create secret generic cloudsql-db-credentials \<tt>
</tt>--from-literal=username=proxyuser --from-literal=password=abcd1234<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>These are referenced in this part of the Deployment:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">- <span style="background-color:#fff0f0;color:#D20">image: gcr.io/cloudsql-docker/gce-proxy:latest</span><span style="background-color:#fff0f0;color:#D20"><tt>
</tt>  name: cloudsql-proxy<tt>
</tt>  command: ["/cloud_sql_proxy", "--dir=/cloudsql",<tt>
</tt>            "-instances=my-project:us-west1:my-db=tcp:5432",<tt>
</tt>            "-credential_file=/secrets/cloudsql/credentials.json"]<tt>
</tt>  volumeMounts:<tt>
</tt>    - name: cloudsql-instance-credentials<tt>
</tt>      mountPath: /secrets/cloudsql<tt>
</tt>      readOnly: true<tt>
</tt>    - name: ssl-certs<tt>
</tt>      mountPath: /etc/ssl/certs<tt>
</tt>    - name: cloudsql<tt>
</tt>      mountPath: /cloudsql</span><tt>
</tt><span style="color:#808">volumes</span>:<tt>
</tt>- <span style="background-color:#fff0f0;color:#D20">name: cloudsql-instance-credentials</span><tt>
</tt>  <span style="color:#808">secret</span>:<tt>
</tt>    <span style="color:#808">secretName</span>: <span style="background-color:#fff0f0;color:#D20">cloudsql-instance-credentials</span><tt>
</tt>- <span style="background-color:#fff0f0;color:#D20">name: ssl-certs</span><tt>
</tt>  <span style="color:#808">hostPath</span>:<tt>
</tt>    <span style="color:#808">path</span>: <span style="background-color:#fff0f0;color:#D20">/etc/ssl/certs</span><tt>
</tt>- <span style="background-color:#fff0f0;color:#D20">name: cloudsql</span><tt>
</tt>  <span style="color:#808">emptyDir</span>:<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>See that you must add the database name ("my-db" in this example) in the <code>-instance</code> clause in the command.</p>
<p>And by the way, the <code>gce-proxy:latest</code> refers to version 1.09 at the time when this post was published. But there already was a 1.11 version. That one gave me headaches, dropping connections and adding a super long timeout. So I went back to the 1.09 (latest) and everything worked as expected. So be aware! Not everything that is brand new is good. In infrastructure, you want to stick to stable.</p>
<p>You may also want the option to load a separated CloudSQL instance instead of having it in each pod, so the pods could connect to just one proxy. You may want to read <a href="https://github.com/GoogleCloudPlatform/cloudsql-proxy/issues/49">this thread</a> on the subject.</p>
<p>It seems that nothing is exposed to anything unless you say so. So we need to expose those pods through what's called a <a href="https://kubernetes.io/docs/concepts/services-networking/service/#type-nodeport">Node Port Service</a>. Let's create a <code>deploy/web-svc.yaml</code> file as well:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">v1</span><tt>
</tt><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Service</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">web-svc</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">sessionAffinity</span>: <span style="background-color:#fff0f0;color:#D20">None</span><tt>
</tt>  <span style="color:#808">ports</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">port: 80</span><tt>
</tt>    <span style="color:#808">targetPort</span>: <span style="background-color:#fff0f0;color:#D20">4001</span><tt>
</tt>    <span style="color:#808">protocol</span>: <span style="background-color:#fff0f0;color:#D20">TCP</span><tt>
</tt>  <span style="color:#808">type</span>: <span style="background-color:#fff0f0;color:#D20">NodePort</span><tt>
</tt>  <span style="color:#808">selector</span>:<tt>
</tt>    <span style="color:#808">app</span>: <span style="background-color:#fff0f0;color:#D20">web</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is why I highlighted the importance of the <code>spec:template:metadata:labels</code>, so we can use it here in the <code>spec:selector</code> to select the proper pods.</p>
<p>We can now deploy these 2 like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl create -f deploy/web.yml<tt>
</tt>kubectl create -f deploy/web-svc.yml<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you can see the pods being created with <code>kubectl get pods --watch</code>.</p>
<h2>The Load Balancer</h2>
<p>Many tutorials will expose those pods directly through a different Service, called <a href="https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/">Load Balancer</a>. I am not so sure how well this behaves under pressure and if it has SSL termination, etc. So I decided to go full blown with an <a href="https://kubernetes.io/docs/concepts/services-networking/ingress/">Ingress</a> Load Balancer using the <a href="https://www.nginx.com/products/nginx/kubernetes-ingress-controller/">NGINX Controller</a>, instead.</p>
<p>First of all, I decided to create a separated node-pool for it, for example, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud container node-pools create web-load-balancer \<tt>
</tt>--cluster=my-web-production \<tt>
</tt>--node-labels=role=load-balancer \<tt>
</tt>--machine-type=g1-small \<tt>
</tt>--num-nodes 1 \<tt>
</tt>--max-nodes 3 --min-nodes=1 \<tt>
</tt>--enable-autoscaling <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As when we created the example <code>large-pool</code> here you must take care of adding <code>--node-labels</code> to make the controller be installed here instead of the <code>default-pool</code>. You will need to know the node instance name, we can do it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ gcloud compute instances list<tt>
</tt>NAME                                             ZONE        MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP      STATUS<tt>
</tt>gke-my-web-production-default-pool-123-123       us-west1-a  n1-standard-4               10.128.0.1   123.123.123.12   RUNNING<tt>
</tt>gke-my-web-production-large-pool-123-123         us-west1-a  n1-highcpu-8                10.128.0.2   50.50.50.50      RUNNING<tt>
</tt>gke-my-web-production-web-load-balancer-123-123  us-west1-a  g1-small                    10.128.0.3   70.70.70.70      RUNNING<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Let's save it like this for now:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">export LB_INSTANCE_NAME=gke-my-web-production-web-load-balancer-123-123<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can manually reserve an external IP and give it a name like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud compute addresses create ip-web-production \<tt>
</tt>        --ip-version=IPV4 \<tt>
</tt>        --global<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>For the sake of the example, let's say that it generated a reserved IP "111.111.111.111". Then let's fetch it and save it for now like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">export LB_ADDRESS_IP=$(gcloud compute addresses list | grep "ip-web-production" | awk '{print $3}')<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, let's hook this address to the load balancer node instance:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">export LB_INSTANCE_NAT=$(gcloud compute instances describe $LB_INSTANCE_NAME | grep -A3 networkInterfaces: | tail -n1 | awk -F': ' '{print $2}')<tt>
</tt>gcloud compute instances delete-access-config $LB_INSTANCE_NAME \<tt>
</tt>    --access-config-name "$LB_INSTANCE_NAT"<tt>
</tt>gcloud compute instances add-access-config $LB_INSTANCE_NAME \<tt>
</tt>    --access-config-name "$LB_INSTANCE_NAT" --address $LB_ADDRESS_IP<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Once we do this, we can add the rest of the Ingress Deployment configuration. This will be kinda long but it's mostly boilerplate. Let's start by defining another web application that we will call <code>default-http-backend</code> that will be used to respond to HTTP requests in case our web pods are not available for some reason. Let's call it <code>deploy/default-web.yml</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt>23<tt>
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt>29<tt>
</tt><strong>30</strong><tt>
</tt>31<tt>
</tt>32<tt>
</tt>33<tt>
</tt>34<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">extensions/v1beta1</span><tt>
</tt><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Deployment</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">default-http-backend</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">replicas</span>: <span style="background-color:#fff0f0;color:#D20">1</span><tt>
</tt>  <span style="color:#808">template</span>:<tt>
</tt>    <span style="color:#808">metadata</span>:<tt>
</tt>      <span style="color:#808">labels</span>:<tt>
</tt>        <span style="color:#808">app</span>: <span style="background-color:#fff0f0;color:#D20">default-http-backend</span><tt>
</tt>    <span style="color:#808">spec</span>:<tt>
</tt>      <span style="color:#808">terminationGracePeriodSeconds</span>: <span style="background-color:#fff0f0;color:#D20">60</span><tt>
</tt>      <span style="color:#808">containers</span>:<tt>
</tt>      - <span style="background-color:#fff0f0;color:#D20">name: default-http-backend</span><tt>
</tt>        <span style="color:#888"># Any image is permissable as long as:</span><tt>
</tt>        <span style="color:#888"># 1. It serves a 404 page at /</span><tt>
</tt>        <span style="color:#888"># 2. It serves 200 on a /healthz endpoint</span><tt>
</tt>        <span style="color:#808">image</span>: <span style="background-color:#fff0f0;color:#D20">gcr.io/google_containers/defaultbackend:1.0</span><tt>
</tt>        <span style="color:#808">livenessProbe</span>:<tt>
</tt>          <span style="color:#808">httpGet</span>:<tt>
</tt>            <span style="color:#808">path</span>: <span style="background-color:#fff0f0;color:#D20">/healthz</span><tt>
</tt>            <span style="color:#808">port</span>: <span style="background-color:#fff0f0;color:#D20">8080</span><tt>
</tt>            <span style="color:#808">scheme</span>: <span style="background-color:#fff0f0;color:#D20">HTTP</span><tt>
</tt>          <span style="color:#808">initialDelaySeconds</span>: <span style="background-color:#fff0f0;color:#D20">30</span><tt>
</tt>          <span style="color:#808">timeoutSeconds</span>: <span style="background-color:#fff0f0;color:#D20">5</span><tt>
</tt>        <span style="color:#808">ports</span>:<tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">containerPort: 8080</span><tt>
</tt>        <span style="color:#808">resources</span>:<tt>
</tt>          <span style="color:#808">limits</span>:<tt>
</tt>            <span style="color:#808">cpu</span>: <span style="background-color:#fff0f0;color:#D20">10m</span><tt>
</tt>            <span style="color:#808">memory</span>: <span style="background-color:#fff0f0;color:#D20">20Mi</span><tt>
</tt>          <span style="color:#808">requests</span>:<tt>
</tt>            <span style="color:#808">cpu</span>: <span style="background-color:#fff0f0;color:#D20">10m</span><tt>
</tt>            <span style="color:#808">memory</span>: <span style="background-color:#fff0f0;color:#D20">20Mi</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No need to change anything here, and by now you may be familiar with the Deployment template. Again, you now know that you need to expose it through a NodePort, so let's add a <code>deploy/default-web-svc.yml</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Service</span><tt>
</tt><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">v1</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">default-http-backend</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">selector</span>:<tt>
</tt>    <span style="color:#808">app</span>: <span style="background-color:#fff0f0;color:#D20">default-http-backend</span><tt>
</tt>  <span style="color:#808">ports</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">protocol: TCP</span><tt>
</tt>      <span style="color:#808">port</span>: <span style="background-color:#fff0f0;color:#D20">80</span><tt>
</tt>      <span style="color:#808">targetPort</span>: <span style="background-color:#fff0f0;color:#D20">8080</span><tt>
</tt>  <span style="color:#808">type</span>: <span style="background-color:#fff0f0;color:#D20">NodePort</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, no need to change anything. The next 3 files are the important parts. First, we will create an NGINX Load Balancer, let's call it <code>deploy/nginx.yml</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt>23<tt>
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt>29<tt>
</tt><strong>30</strong><tt>
</tt>31<tt>
</tt>32<tt>
</tt>33<tt>
</tt>34<tt>
</tt>35<tt>
</tt>36<tt>
</tt>37<tt>
</tt>38<tt>
</tt>39<tt>
</tt><strong>40</strong><tt>
</tt>41<tt>
</tt>42<tt>
</tt>43<tt>
</tt>44<tt>
</tt>45<tt>
</tt>46<tt>
</tt>47<tt>
</tt>48<tt>
</tt>49<tt>
</tt><strong>50</strong><tt>
</tt>51<tt>
</tt>52<tt>
</tt>53<tt>
</tt>54<tt>
</tt>55<tt>
</tt>56<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">extensions/v1beta1</span><tt>
</tt><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Deployment</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">nginx-ingress-controller</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">replicas</span>: <span style="background-color:#fff0f0;color:#D20">1</span><tt>
</tt>  <span style="color:#808">template</span>:<tt>
</tt>    <span style="color:#808">metadata</span>:<tt>
</tt>      <span style="color:#808">labels</span>:<tt>
</tt>        <span style="color:#F00;background-color:#FAA">k8s-app</span>: <span style="color:#F00;background-color:#FAA">nginx-ingress-lb</span><tt>
</tt>    <span style="color:#808">spec</span>:<tt>
</tt>      <span style="color:#888"># hostNetwork makes it possible to use ipv6 and to preserve the source IP correctly regardless of docker configuration</span><tt>
</tt>      <span style="color:#888"># however, it is not a hard dependency of the nginx-ingress-controller itself and it may cause issues if port 10254 already is taken on the host</span><tt>
</tt>      <span style="color:#888"># that said, since hostPort is broken on CNI (https://github.com/kubernetes/kubernetes/issues/31307) we have to use hostNetwork where CNI is used</span><tt>
</tt>      <span style="color:#808">hostNetwork</span>: <span style="background-color:#fff0f0;color:#D20">true</span><tt>
</tt>      <span style="color:#808">terminationGracePeriodSeconds</span>: <span style="background-color:#fff0f0;color:#D20">60</span><tt>
</tt>      <span style="color:#808">nodeSelector</span>:<tt>
</tt>        <span style="color:#808">role</span>: <span style="background-color:#fff0f0;color:#D20">load-balancer</span><tt>
</tt>      <span style="color:#808">containers</span>:<tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">args:</span><span style="background-color:#fff0f0;color:#D20"><tt>
</tt>            - /nginx-ingress-controller<tt>
</tt>            - "--default-backend-service=$(POD_NAMESPACE)/default-http-backend"<tt>
</tt>            - "--default-ssl-certificate=$(POD_NAMESPACE)/cloudflare-secret"</span><tt>
</tt>          <span style="color:#808">env</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: POD_NAME</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">fieldRef</span>:<tt>
</tt>                  <span style="color:#808">fieldPath</span>: <span style="background-color:#fff0f0;color:#D20">metadata.name</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: POD_NAMESPACE</span><tt>
</tt>              <span style="color:#808">valueFrom</span>:<tt>
</tt>                <span style="color:#808">fieldRef</span>:<tt>
</tt>                  <span style="color:#808">fieldPath</span>: <span style="background-color:#fff0f0;color:#D20">metadata.namespace</span><tt>
</tt>          <span style="color:#808">image</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">gcr.io/google_containers/nginx-ingress-controller:0.9.0-beta.5</span><span style="color:#710">"</span></span><tt>
</tt>          <span style="color:#808">imagePullPolicy</span>: <span style="background-color:#fff0f0;color:#D20">Always</span><tt>
</tt>          <span style="color:#808">livenessProbe</span>:<tt>
</tt>            <span style="color:#808">httpGet</span>:<tt>
</tt>              <span style="color:#808">path</span>: <span style="background-color:#fff0f0;color:#D20">/healthz</span><tt>
</tt>              <span style="color:#808">port</span>: <span style="background-color:#fff0f0;color:#D20">10254</span><tt>
</tt>              <span style="color:#808">scheme</span>: <span style="background-color:#fff0f0;color:#D20">HTTP</span><tt>
</tt>            <span style="color:#808">initialDelaySeconds</span>: <span style="background-color:#fff0f0;color:#D20">10</span><tt>
</tt>            <span style="color:#808">timeoutSeconds</span>: <span style="background-color:#fff0f0;color:#D20">5</span><tt>
</tt>          <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">nginx-ingress-controller</span><tt>
</tt>          <span style="color:#808">ports</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">containerPort: 80</span><tt>
</tt>              <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">http</span><tt>
</tt>              <span style="color:#808">protocol</span>: <span style="background-color:#fff0f0;color:#D20">TCP</span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">containerPort: 443</span><tt>
</tt>              <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">https</span><tt>
</tt>              <span style="color:#808">protocol</span>: <span style="background-color:#fff0f0;color:#D20">TCP</span><tt>
</tt>          <span style="color:#808">volumeMounts</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">mountPath: /etc/nginx-ssl/dhparam</span><tt>
</tt>              <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">tls-dhparam-vol</span><tt>
</tt>      <span style="color:#808">volumes</span>:<tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">name: tls-dhparam-vol</span><tt>
</tt>          <span style="color:#808">secret</span>:<tt>
</tt>            <span style="color:#808">secretName</span>: <span style="background-color:#fff0f0;color:#D20">tls-dhparam</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice the <code>nodeSelector</code> to make the node label we added when we created the new node-pool.</p>
<p>You may want to tinker with the labels, the number of replicas if you need to. But here you will notice that it mounts a volume that I named as <code>tls-dhparam-vol</code>. This is a <a href="https://raymii.org/s/tutorials/Strong_SSL_Security_On_nginx.html#Forward_Secrecy_&amp;_Diffie_Hellman_Ephemeral_Parameters">Diffie Hellman Ephemeral Parameters</a>. This is how we generate it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo openssl dhparam -out ~/documents/dhparam.pem 2048<tt>
</tt><tt>
</tt>kubectl create secret generic tls-dhparam --from-file=/home/myself/documents/dhparam.pem<tt>
</tt><tt>
</tt>kubectl create secret generic tls-dhparam --from-file=/home/myself/documents/dhparam.pem<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Also, notice that I am using version "0.9.0-beta_5" for the controller image. It works well, no problems so far. But keep an eye on release notes for newer versions as well and do your own testing.</p>
<p>Again, let's expose this Ingress controller through the Load Balancer Service. Let's call it <code>deploy/nginx-svc.yml</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">v1</span><tt>
</tt><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Service</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">nginx-ingress</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">type</span>: <span style="background-color:#fff0f0;color:#D20">LoadBalancer</span><tt>
</tt>  <span style="color:#808">loadBalancerIP</span>: <span style="background-color:#fff0f0;color:#D20">111.111.111.111</span><tt>
</tt>  <span style="color:#808">ports</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">name: http</span><tt>
</tt>    <span style="color:#808">port</span>: <span style="background-color:#fff0f0;color:#D20">80</span><tt>
</tt>    <span style="color:#808">targetPort</span>: <span style="background-color:#fff0f0;color:#D20">http</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">name: https</span><tt>
</tt>    <span style="color:#808">port</span>: <span style="background-color:#fff0f0;color:#D20">443</span><tt>
</tt>    <span style="color:#808">targetPort</span>: <span style="background-color:#fff0f0;color:#D20">https</span><tt>
</tt>  <span style="color:#808">selector</span>:<tt>
</tt>    <span style="color:#F00;background-color:#FAA">k8s-app</span>: <span style="color:#F00;background-color:#FAA">nginx-ingress-lb</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remember the static external IP we have reserved above and saved in the <code>LB_INGRESS_IP</code> ENV var? This is the one we must put in the <code>spec:loadBalancerIP</code> section. This is also the IP that you will add as an "A record" in your DNS service (let's say, mapping your "www.my-app.com.br" on CloudFlare).</p>
<p>Finally, we can create the Ingress configuration itself, let's create a <code>deploy/ingress.yml</code> like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt>23<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">extensions/v1beta1</span><tt>
</tt><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">Ingress</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">ingress</span><tt>
</tt>  <span style="color:#808">annotations</span>:<tt>
</tt>    <span style="color:#F00;background-color:#FAA">kubernetes.io/ingress.class</span>: <span style="color:#F00;background-color:#FAA">"nginx"</span><tt>
</tt>    <span style="color:#F00;background-color:#FAA">nginx.org/ssl-services</span>: <span style="color:#F00;background-color:#FAA">"web-svc"</span><tt>
</tt>    <span style="color:#F00;background-color:#FAA">kubernetes.io/ingress.global-static-ip-name</span>: <span style="color:#F00;background-color:#FAA">ip-web-production</span><tt>
</tt>    <span style="color:#F00;background-color:#FAA">ingress.kubernetes.io/ssl-redirect</span>: <span style="color:#F00;background-color:#FAA">"true"</span><tt>
</tt>    <span style="color:#F00;background-color:#FAA">ingress.kubernetes.io/rewrite-target</span>: <span style="color:#F00;background-color:#FAA">/</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">tls</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">hosts:</span><tt>
</tt>      - <span style="background-color:#fff0f0;color:#D20">www.my-app.com.br</span><tt>
</tt>      <span style="color:#808">secretName</span>: <span style="background-color:#fff0f0;color:#D20">cloudflare-secret</span><tt>
</tt>  <span style="color:#808">rules</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">host: www.my-app.com.br</span><tt>
</tt>      <span style="color:#808">http</span>:<tt>
</tt>        <span style="color:#808">paths</span>:<tt>
</tt>        - <span style="background-color:#fff0f0;color:#D20">path: /</span><tt>
</tt>          <span style="color:#808">backend</span>:<tt>
</tt>            <span style="color:#808">serviceName</span>: <span style="background-color:#fff0f0;color:#D20">web-svc</span><tt>
</tt>            <span style="color:#808">servicePort</span>: <span style="background-color:#fff0f0;color:#D20">80</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Be careful with the annotations above that hooks everything up. It binds the NodePort service we created for the web pods with the nginx ingress controller and adds SSL termination through that <code>spec:tls:secretName</code>. How do you create that? First, you must purchase an SSL certificate - again, using CloudFlare as the example.</p>
<p>When you finish buying, the provider should give you the secret files to download (keep them safe! a public dropbox folder is not safe!). Then you have to add it to the infrastructure like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl create secret tls cloudflare-secret \<tt>
</tt>--key ~/downloads/private.pem \<tt>
</tt>--cert ~/downloads/fullchain.pem<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now that we edited a whole bunch of files, we can deploy the entire load balancer stack:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl create -f deploy/default-web.yml<tt>
</tt>kubectl create -f deploy/default-web-svc.yml<tt>
</tt>kubectl create -f deploy/nginx.yml<tt>
</tt>kubectl create -f deploy/nginx-svc.yml<tt>
</tt>kubectl create -f deploy/ingress.yml<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This NGINX Ingress configuration is based off of <a href="https://zihao.me/post/cheap-out-google-container-engine-load-balancer/">Zihao Zhang's blog post</a>. There is also examples in the <a href="https://github.com/kubernetes-incubator/external-dns/blob/master/docs/tutorials/nginx-ingress.md">kubernetes incubator repository</a>. You may want to check it out as well.</p>
<p>If you did everything right so far, <code>https://www.my-app-com.br</code> should load your web application. You may want to check for Time to First-Byte (TTFB). You can do it going through CloudFlare like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl -vso /dev/null -w "Connect: %{time_connect} \n TTFB: %{time_starttransfer} \n Total time: %{time_total} \n" https://www.my-app.com.br<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or, if you're having slow TTFB you can bypass CloudFlare doing this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl --resolve www.my-app.com.br:443:111.111.111.111 https://www.my-app.com.br -svo /dev/null -k -w "Connect: %{time_connect} \n TTFB: %{time_starttransfer} \n Total time: %{time_total} \n"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>TTFB should be in the neighborhood of 1 second or less. Anything far and above could mean a problem in your application. You must check your node instance machine types, the number of workers loaded per pod, the CloudSQL proxy version, the NGINX controller version and so on. This is a trial and error procedure as far as I know. Sign up to services such as <a href="https://loader.io">Loader</a> or even <a href="https://www.webpagetest.org">Web Page Test</a> for insight.</p>
<h2>Rolling Updates</h2>
<p>Now, that everything is up and running, how do we accomplish the Rolling Update I mentioned in the beginning? First you <code>git push</code> to the Container Registry repository and wait for the Docker image to build.</p>
<p>Remember that I said to let a trigger tag the image with a random version number? Let's use it (you can see it from the Build History list in the Container Registry, from the Google Cloud console):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl set image deployment web my-app=gcr.io/my-project/my-app:1238471234g123f534f543541gf5 --record<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You must use the same name and image that is declared in the <code>deploy/web.yml</code> from above. This will start rolling out the update by adding a new pod, then terminating one pod and so on and so forth until all of them are updated, without downtime for your users.</p>
<p>Rolling updates must be carried out carefully. For example, if your new deployment requires a database migration, then you must add a maintenance window (meaning: do it when there is little to no traffic, such as in the middle of the night). So you can run the migrate command like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl get pods # to get a pod name<tt>
</tt><tt>
</tt>kubectl exec -it my-web-12324-121312 /app/bin/rails db:migrate<tt>
</tt><tt>
</tt># you can also bash to a pod like this, but remember that this is an ephemeral container, so file you edit and write there disappear on the next restart:<tt>
</tt><tt>
</tt>kubectl exec -it my-web-12324-121312 bash<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>To redeploy everything without resorting to rolling update you must do this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl delete -f deploy/web.yml &amp;&amp; kubectl apply -f deploy/web.yml<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You will find a more thorough explanation in <a href="https://tachingchen.com/blog/Kubernetes-Rolling-Update-with-Deployment/">Ta-Ching's</a> blog post.</p>
<h2>Bonus: Auto Snapshots</h2>
<p>One item I had in my "I wanted/needed" list, in the beginning, is the ability to have persistent mountable storage with automatic backups/snapshots. Google Cloud provides half of that for the time being. You can create persistent disks to mount in your pods but it doesn't have a feature to automatically backup it. At least it does have APIs to manually snapshot it.</p>
<p>For this example, let's create a new SSD disk and format it first:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud compute disks create --size 500GB my-data --type pd-ssd<tt>
</tt><tt>
</tt>gcloud compute instances list<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The last command is so we can copy the name of a node instance. Let's say it's <code>gke-my-web-app-default-pool-123-123</code>. We will attach the <code>my-data</code> disk to it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud compute instances attach-disk gke-my-web-app-default-pool-123-123 --disk my-data --device-name my-data<tt>
</tt><tt>
</tt>gcloud compute ssh gke-my-web-app-default-pool-123-123<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The last command ssh's in the instance. We can list the attached disks with <code>sudo lsblk</code> and you will see the 500GB disk, probably, as <code>/dev/sdb</code>, but make sure that's correct because we will format it!</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo mkfs.ext4 -m 0 -F -E lazy_itable_init=0,lazy_journal_init=0,discard /dev/sdb<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now we can exit from the SSH session and detach the disk:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gcloud compute instances detach-disk gke-my-web-app-default-pool-123-123 --disk my-data<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can mount this disk in your pods by adding the following to your deployment yaml:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">spec:<tt>
</tt>  containers:<tt>
</tt>    - image: ...<tt>
</tt>      name: my-app<tt>
</tt>      volumeMounts:<tt>
</tt>        - name: my-data<tt>
</tt>          mountPath: /data<tt>
</tt>          # readOnly: true<tt>
</tt>   # ...<tt>
</tt>   volumes:<tt>
</tt>     - name: my-data<tt>
</tt>       gcePersistentDisk:<tt>
</tt>         pdName: my-data<tt>
</tt>         fsType: ext4<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, let's create a CronJob deployment file as <code>deploy/auto-snapshot.yml</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt>23<tt>
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">apiVersion</span>: <span style="background-color:#fff0f0;color:#D20">batch/v1beta1</span><tt>
</tt><span style="color:#808">kind</span>: <span style="background-color:#fff0f0;color:#D20">CronJob</span><tt>
</tt><span style="color:#808">metadata</span>:<tt>
</tt>  <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">auto-snapshot</span><tt>
</tt><span style="color:#808">spec</span>:<tt>
</tt>  <span style="color:#808">schedule</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">0 4 * * *</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#808">concurrencyPolicy</span>: <span style="background-color:#fff0f0;color:#D20">Forbid</span><tt>
</tt>  <span style="color:#808">jobTemplate</span>:<tt>
</tt>    <span style="color:#808">spec</span>:<tt>
</tt>      <span style="color:#808">template</span>:<tt>
</tt>        <span style="color:#808">spec</span>:<tt>
</tt>          <span style="color:#808">restartPolicy</span>: <span style="background-color:#fff0f0;color:#D20">OnFailure</span><tt>
</tt>          <span style="color:#808">containers</span>:<tt>
</tt>          - <span style="background-color:#fff0f0;color:#D20">name: auto-snapshot</span><tt>
</tt>            <span style="color:#808">image</span>: <span style="background-color:#fff0f0;color:#D20">grugnog/google-cloud-auto-snapshot</span><tt>
</tt>            <span style="color:#808">command</span>: <span style="background-color:#fff0f0;color:#D20">["/opt/entrypoint.sh"]</span><tt>
</tt>            <span style="color:#808">env</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "GOOGLE_CLOUD_PROJECT"</span><tt>
</tt>              <span style="color:#808">value</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">my-project</span><span style="color:#710">"</span></span><tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: "GOOGLE_APPLICATION_CREDENTIALS"</span><tt>
</tt>              <span style="color:#808">value</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/credential/credential.json</span><span style="color:#710">"</span></span><tt>
</tt>            <span style="color:#808">volumeMounts</span>:<tt>
</tt>              - <span style="background-color:#fff0f0;color:#D20">mountPath: /credential</span><tt>
</tt>                <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">editor-credential</span><tt>
</tt>          <span style="color:#808">volumes</span>:<tt>
</tt>            - <span style="background-color:#fff0f0;color:#D20">name: editor-credential</span><tt>
</tt>              <span style="color:#808">secret</span>:<tt>
</tt>                <span style="color:#808">secretName</span>: <span style="background-color:#fff0f0;color:#D20">editor-credential</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As we already did before, you will need to create another Service Account with editor permissions in the "IAM &amp; admin" section of the Google Cloud console, then download the JSON credential, and finally upload it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kubectl create secret generic editor-credential \<tt>
</tt>--from-file=credential.json=/home/myself/download/my-project-1212121.json<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Also notice that, as a normal cron job, there is a schedule parameter that you might want to change. In the example, "0 4 * * *" means that it will run the snapshot every day at 4 AM.</p>
<p>Check out the <a href="https://github.com/grugnog/google-cloud-auto-snapshot">original repository</a> of this solution for more details.</p>
<p>And this should be it for now!</p>
<p>As I said, in the beginning, this is not a complete procedure, just highlights of some of the important parts. If you're new to Kubernetes you just read about Deployment, Service, Ingress, but you have ReplicaSet, DaemonSet, and much more to play with.</p>
<p>I think this is also already too long to add a <a href="https://cloud.google.com/sql/docs/mysql/high-availability">multi-region High Availability</a> setup explanation, so let's leave it at that.</p>
<p>Any corrections or suggestions are more than welcome as I am still in the learning process, and there is a ton of things that I still don't know myself.</p>
<p></p>
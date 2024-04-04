---
title: "How NOT to zero out your Pusher development quota"
date: "2017-10-27T15:43:00.000Z"
tags: ["rubyonrails", "rails51", "pusher", "rspec"]
years: "2017"
---

<p></p>
<p>If you're doing development with WebSockets (real-time notifications, real-time chat, etc), one of the best SaaS options out there is still <a href="pusher.com"><strong>Pusher</strong></a>. It was always reliable.</p>
<p>For each application, you create it even offers you separated development, staging, production environments, with separated key/secret tokens.</p>
<p>One problem I stumbled upon these days is that I was quickly zero'ing out the free development environment message quota (200,000 messages a day). That's because all my team was using the same key and also the Continuous Integration server was doing live connections whenever it ran in the same environment. That can quickly consume all you have and block both your development and CI.</p>
<p>It's actually not a good practice to do live connections to external systems in testing situations. The tests can fail randomly for a number of reasons, so we should always mock those. But mocking a complex system (WebSockets and HTTP) like Pusher is not trivial.</p>
<p>Fortunately, I found this <a href="https://github.com/tristandunn/pusher-fake">Pusher Fake</a>. It basically implements all the necessary APIs and WebSocket endpoints to mimic Pusher and fool both server and js/client to communicate with it.</p>
<p>The idea is for your Rails app, in development mode, to fork a separated server process for the Pusher client to connect to. This gem is both a simple Pusher-clone server and a series of wrappers to load it up in your setup.</p>
<p></p>
<p></p>
<p>First things first.</p>
<p>In your application, you will have both a Ruby side Pusher client connection setup to push messages to a channel in the Pusher server. And a Javascript, client-side, Pusher instance mainly to subscribe to a channel in a WebSocket connection and receive messages.</p>
<p>First we need to setup the Ruby side. Usually it's in a <code>config/initializers/pusher.rb</code> configuration like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Pusher</span>.app_id = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_APP</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.key    = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_KEY</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.secret = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_SECRET</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.cluster = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_CLUSTER</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#888"># never set Pusher.host or Pusher.port</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice that I am using environment variables to hold the configuration. You should use something like the <a href="https://github.com/laserlemon/figaro">figaro gem</a> or the <a href="https://github.com/bkeepers/dotenv">dotenv-rails gem</a>. For example:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">PUSHER_APP</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">xpto</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_KEY</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">abcd1234</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_SECRET</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">abcd1234</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_CLUSTER</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">us2</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>At the very least you must have an application ID, a key, a secret, and a cluster name. All of these are provided by Pusher whenever you register a new application there.</p>
<p>Second, we need to setup the Javascript instance. Usually, you have something in the <code>assets/javascripts</code> directory like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">// .js.erb example</span><tt>
</tt>window.pusher = <span style="color:#080;font-weight:bold">new</span> Pusher(&lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_APP] %&gt;, {<tt>
</tt>  cluster: &lt;%= ENV[</span><span style="color:#710">'</span></span>PUSHER_KEY<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">] %&gt;,<tt>
</tt>  encrypted: &lt;%= ENV[</span><span style="color:#710">'</span></span>PUSHER_ENCRYPTED<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">] %&gt;})<tt>
</tt></span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In a Chrome Development Console, you can inspect this instance by typing:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Pusher.instances[0]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This way you can make it's picking up the correct configurations for the connection and also do debug problems.</p>
<p>The dependencies are the pusher gem in your <code>Gemfile</code> and the javascript client.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># Gemfile</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pusher</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In the case of the javascript file you can either add it to your project and rely on <a href="https://www.akitaonrails.com/2017/10/24/beginner-trying-out-rails-5-1-x">Webpacker</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">yarn add pusher<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then, in your ES6 javascript file, you can do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">const Pusher = require(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pusher-js</span><span style="color:#710">'</span></span>);<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or you can link it directly in your layout:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#070">&lt;script</span> <span style="color:#007">src</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://js.pusher.com/4.2/pusher.min.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>For more information on the Pusher-js client, read it's <a href="https://github.com/pusher/pusher-js">README file</a>.</p>
<h2>Adding Pusher Fake</h2>
<p>At this point, you should be able to connect to the real Pusher account and see the real-time magic happening.</p>
<p>You're also already consuming the free quota you have available in your development environment on Pusher. For most people, this should suffice.</p>
<p>But we want to NOT connect to Pusher over the internet and keep everything local for development and testing. Let's start by adding the <a href="https://github.com/tristandunn/pusher-fake">Pusher Fake</a> to our <code>Gemfile</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">group <span style="color:#A60">:development</span>, <span style="color:#A60">:test</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pusher-fake</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, this is where the Pusher Fake setup can get convoluted if you don't understand what's happening. As I said before, PusherFake must fork a new process to load a local server that mimics Pusher.</p>
<p>To load it up you must point to the local server. Remember our <code>config/initializers/pusher.rb</code> ? We just need to require a simple file like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Pusher</span>.app_id = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_APP</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.key    = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_KEY</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.secret = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_SECRET</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.cluster = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_CLUSTER</span><span style="color:#710">'</span></span>]<tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">Rails</span>.env.development?<tt>
</tt>  require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher-fake/support/base</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This alone presents a LOT of problems if you're not careful. This <code>require</code> will <strong>fork</strong> a new process. If you're using a single-process web server like Webrick or Thin, you should be ok. If you're using Puma, Unicorn, or Passenger with a maximum of just one process, you should also be good. But if you load a web server that itself forks new processes, you will have trouble.</p>
<p>In practice, I'd rather load the Pusher Fake server separately, in stand-alone more. Fortunately it provides a command line command to start it up. And it's good practice to setup that in a <code>Procfile.dev</code> file and use <a href="https://github.com/ddollar/foreman">foreman</a> to start everything for you. The <code>Procfile.dev</code> looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">web: bundle exec rails s -p 3000<tt>
</tt>db: postgres -D /usr/local/var/postgres<tt>
</tt>redis: redis-server /usr/local/etc/redis.conf<tt>
</tt>mailcatcher: mailcatcher -f<tt>
</tt>pusherfake: pusher-fake -i ${PUSHER_APP:-xpto} --socket-host 0.0.0.0 --socket-port ${PUSHER_WS_PORT:-45449} --web-host 0.0.0.0 --web-port ${PUSHER_PORT:-8888} -k ${PUSHER_KEY:-abcd1234} -s ${PUSHER_SECRET:-abcd1234}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As a bonus, look how I configure other services such as PostgreSQL, Redis, etc.</p>
<p>If you didn't know, you can use <code>${VARIABLE_NAME:-default_value}</code> to use an environment variable or have a default value in case the variable doesn't exist. This means that your environment variable configured with Figaro or Dotenv must have the same values.</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">PUSHER_APP</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">xpto</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_KEY</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">abcd1234</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_SECRET</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">abcd1234</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_CLUSTER</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">us2</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_HOST</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">127.0.0.1</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_PORT</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">8888</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_WS_HOST</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">127.0.0.1</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#808">PUSHER_WS_PORT</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">45449</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now your <code>config/initializers/pusher.rb</code> should be something like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Pusher</span>.app_id = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_APP</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.key    = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_KEY</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.secret = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_SECRET</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.cluster = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_CLUSTER</span><span style="color:#710">'</span></span>]<tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">Rails</span>.env.development?<tt>
</tt>  <span style="color:#036;font-weight:bold">Pusher</span>.host = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_HOST</span><span style="color:#710">'</span></span>]<tt>
</tt>  <span style="color:#036;font-weight:bold">Pusher</span>.port = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_PORT</span><span style="color:#710">'</span></span>]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And Pusher-js config somewhere in your <code>app/assets/javascripts/</code> directory will resemble something like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">&lt;% <span style="color:#080;font-weight:bold">if</span> defined?(PusherFake) %&gt;<tt>
</tt>    &lt;% <span style="color:#080;font-weight:bold">if</span> Rails.env.test? %&gt;<tt>
</tt>    <span style="color:#080;font-weight:bold">var</span> pusher = &lt;%= PusherFake.javascript(cluster: ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PUSHER_CLUSTER</span><span style="color:#710">"</span></span>]) %&gt;<tt>
</tt>    &lt;% <span style="color:#080;font-weight:bold">else</span> %&gt;<tt>
</tt>    window.pusher = <span style="color:#080;font-weight:bold">new</span> Pusher(&lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_KEY</span><span style="color:#710">'</span></span>] %&gt;, {<tt>
</tt>      <span style="color:#808">cluster</span>: &lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_CLUSTER</span><span style="color:#710">'</span></span>] %&gt;,<tt>
</tt>      <span style="color:#808">wsHost</span>: &lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_WS_HOST</span><span style="color:#710">'</span></span>] %&gt;,<tt>
</tt>      <span style="color:#808">wsPort</span>: &lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_WS_PORT</span><span style="color:#710">'</span></span>] %&gt;,<tt>
</tt>      <span style="color:#808">encrypted</span>: &lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_ENCRYPTED</span><span style="color:#710">'</span></span>] %&gt;})    <tt>
</tt>    &lt;% end %&gt;<tt>
</tt>&lt;% <span style="color:#080;font-weight:bold">else</span> %&gt;<tt>
</tt>    window.pusher = <span style="color:#080;font-weight:bold">new</span> Pusher(&lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_KEY</span><span style="color:#710">'</span></span>] %&gt;, {<tt>
</tt>      <span style="color:#808">cluster</span>: &lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_CLUSTER</span><span style="color:#710">'</span></span>] %&gt;,<tt>
</tt>      <span style="color:#808">encrypted</span>: &lt;%= ENV[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PUSHER_ENCRYPTED</span><span style="color:#710">'</span></span>] %&gt;})<tt>
</tt>&lt;% end %&gt;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remember that this is a Javascript+ERB file, so we can fetch the same environment variables for the configuration.</p>
<p>Now, whenever you <code>foreman start -f Procfile.dev -p 3000</code> it will load the Pusher Fake server with the proper development configurations and both your ruby server-side and javascript client-side should connect to it without any problems.</p>
<p>Also, notice the <code>if Rails.env.test?</code> bit. This is for your RSpec test suite. In the case of the testing environment, we won't load the fake server manually, instead, we will create something like <code>spec/support/pusher-fake.rb</code> with:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher-fake/support/rspec</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's it. The <code>PusherFake.javascript</code> will define default WebSocket connection configuration and the <code>require</code> above will both fork the fake server and set Rspec to clean the channels on each test run (through <code>PusherFake::Channel.reset</code>).</p>
<p>This way your testing environment will also avoid connecting to the external, real, Pusher server.</p>
<p>The key to all this are the environment variables. You must make sure that every piece is loading the same configuration, otherwise you will have the fake server binding to a different port than the Pusher-js is connecting to, and you will have errors. Debug with care.</p>
<p>Most importantly: if you did it all correctly, you are now independent of the real Pusher server for development and testing environments, you won't ever reach any quota limits, and your team and your CI will be able to work uninterruptedly, with a deterministic behavior.</p>
<p></p>
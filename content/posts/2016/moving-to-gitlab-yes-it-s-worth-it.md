---
title: "Moving to GitLab! Yes, it's worth it!"
date: "2016-08-03T17:49:00.000Z"
tags: []
years: "2016"
---

<p></p>
<p>I <a href="http://www.akitaonrails.com/2007/9/22/jogar-pedra-em-gato-morto-por-que-subversion-no-presta">started evangelizing Git in 2007</a>. It was a very tough sell to make at the time.</p>
<p>Outside of the kernel development almost no one wanted to learn it and we had very worthy competitors, from Subversion, to Mercurial, to Bazaar, to Darcs, to Perforce, and so on. But those of use that dug deeper knew that Git had the edge and it was a matter of time.</p>
<p>Then GitHub showed up in 2008 and the rest is history. For many years it was just "cool" to be in GitHub. The Ruby community drove GitHub up into the sky. Finally it became the status quo and the one real monopoly in information repositories - not just software source code, but everything.</p>
<p>I always knew that we should have a "local" option, which is why <a href="https://gitorious.org/gitorious/oboxodo-gitorious?p=gitorious:oboxodo-gitorious.git;a=search;h=9f6bdf5887c65a440bc3fdc43a14652f42ddf103;s=Fabio+Akita;st=committer">I tried to contribute to Gitorious</a> way back in 2009. Other options arose, but eventually GitLab appeared around 2011 and picked up steam in the last couple of years.</p>
<p></p>
<p></p>
<p>GitHub itself raised <a href="https://www.crunchbase.com/organization/github#/entity">USD 350 million in funding</a> and one of its required goals is to nail the Enterprise Edition for big corporations that don't want their data outside their closed gardens. Although GitHub hosts every single open source project out there, they are themselves closed-source.</p>
<p><a href="https://gitlab.com">GitLab Inc.</a> started differently with an open source-first approach with their Community Edition (CE) and having both a GitHub-like hosted option as well as a supported Enteprise Edition for fearsome corporations. They already raised <a href="https://www.crunchbase.com/organization/gitlab-com#/entity">USD 5.62 million in funding</a>, and they are the most promising alternative to GitHub so far.</p>
<p>Of course, there are other platforms such as Atlassian's Bitbucket. But I believe Atlassian's strategy is slower and they have a larger suite of enterprise products to sell first, such as Confluence and Jira. I don't think they ever posed much of a competition against GitHub.</p>
<p>GitLab really started accelerating in 2015 as this <a href="https://github.com/gitlabhq/gitlabhq/graphs/contributors?from=2015-03-14&amp;to=2016-08-02&amp;type=c">commit graph</a> shows:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/545/big_Contributors_to_gitlabhq_gitlabhq.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/545/Contributors_to_gitlabhq_gitlabhq.png 2x" alt="contributions"></p>
<p>It's been steadily growing since 2011, but they seem to have crossed the first tipping point around late 2014, from early adopters to the early majority. This became more important as GitHub <a href="https://github.com/blog/2164-introducing-unlimited-private-repositories">announced their pricing changes</a> in May.</p>
<p>They said they haven't committed to a dead line to enforce the change, so organizations can opt out of the new format for the time being. They are changing from "limited repositories and unlimited users" to "unlimited repositories and limited users".</p>
<h2>The Cost-Benefit Conundrum</h2>
<p>For example, if you have up to 8 developers in the USD 50/month (20 private repositories), the change won't affect you, as you will pay USD 25/month for 5 users and USD 9 for additional users (total of USD 52/month).</p>
<p>Now, if you have a big team of 100 developers currently in the Diamond Plan of USD 450/month (300 private repositories), you would have to pay USD 25/month + 95 times USD 9, which totals a staggering USD 880/month! <strong>Double the amount!</strong></p>
<p>This is an extra <strong>USD 10,560 per year</strong>!</p>
<p>And what does GitLab affords you instead?</p>
<p>You can have way more users and more repositories in a <strong>USD 40/month</strong> virtual box (4GB of RAM, 60GB SSD, 4TB transfer).</p>
<p>And it doesn't stop there. GitLab also has very functional <a href="https://gitlab.com/gitlab-org/gitlab-ci-multi-runner">GitLab Multi Runner</a> which you can install in a separate box (actually, at least 3 boxes - more on that below).</p>
<p>You can easily connect this runner to the build system over GitLab so every new git push trigger the runner to run the automated test suite in a Docker image of your choosing. So it's a fully functional, full featured Continuous Integration system nicely integrated in your GitLab project interface:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/546/big_Pipelines___cm42-archived___PremiosOnline___GitLab.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/546/Pipelines___cm42-archived___PremiosOnline___GitLab.png 2x" alt="Pipeline"></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/547/big_test___144____Builds___cm42-archived___PremiosOnline___GitLab.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/547/test___144____Builds___cm42-archived___PremiosOnline___GitLab.png 2x" alt="CI Runner"></p>
<p>Reminds of you anything? Yep, it's a fully functional alternative to Travis-CI, Semaphore, CircleCI or any other CI you're using with a very easy to install procedure. Let's say you're paying Travis-CI USD 489/month to have 10 concurrent jobs.</p>
<p>You can install GitLab Runner in 3 boxes of USD 10/month (1GB RAM, 1 Cores, 30GB SSD) and have way more concurrent jobs (20? 50? Auto-Scale!?) that runs <strong>faster</strong> (in a simple test, one build took 15 minutes over Travis took less than 8 minutes at Digital Ocean).</p>
<p>So let's make the math for a year's worth of service. First considering no GitHub plan change:</p>
<blockquote>
  <p>USD 5,400 (GitHub) + USD 5,868 (Travis) = USD 11,268 a year.</p>
</blockquote>
<p>Now, the GitLab + GitLab Runner + Digital Ocean for the same features and unlimited users, unlimited repositores, unlimited concurrent builds:</p>
<blockquote>
  <p>USD 480 (GitLab) + USD 840 (Runner box) = USD 1,320 a year.</p>
</blockquote>
<p>This is already almost 8.5x cheaper with almost no change in quality.</p>
<p>For the worst case scenario, compare it when GitHub decides to enforce the new plans:</p>
<blockquote>
  <p>USD 10,560 (GitHub new plans) + USD 5,868 (Travis) = USD 16,428</p>
</blockquote>
<p>Now the GitLab option is 11x cheaper! You're saving almost USD 15,000 a year! This is not something you can ignore in you cost sheet.</p>
<p>As I said, the calculations above are only significant in a scenario of a 100 developers. You must do your own math taking into account your team size and number of active projects (you can always archive unused projects).</p>
<p>Even if you don't have 100 developers. Let's consider the scenario for <strong>30 developers</strong> in the new GitHub per user plans and a smaller Travis configuration for 5 concurrent jobs:</p>
<blockquote>
  <p>USD 3,000 (GitHub new plan) + USD 3,000 (Travis) = USD 6,000</p>
</blockquote>
<p>It's 4.5x cheaper in the Digital Ocean + GitLab suite option.</p>
<p>Heck, let's consider the <strong>Current</strong> GitHub plan (the Platinum one, for up to 125 repositories):</p>
<blockquote>
  <p>USD 2,400 (GitHub current plan) + USD 3,000 (Travis) = USD 5,400</p>
</blockquote>
<p>Still at least <strong>4x more expensive</strong> than a GitLab-based solution!</p>
<p>And how long will it take for a single developer to figure out the set up and migrate everything from GitHub over to the new GitLab installation? I will say that you can reserve 1 week of work for the average programmer to do it following the official documentation and my tips and tricks below.</p>
<h2>Installing GitLab CE</h2>
<p>I will not bore you with what you can readily find over the Web. I highly recommend you start with the easiest solution first: <a href="https://www.digitalocean.com/features/one-click-apps/gitlab/">Digital Ocean's One-Click Automatic Install</a>. Install it in at least a 4GB RAM machine (you will want to keep it if you like it).</p>
<p>Of course, there is a number of different installation options, from AWS AMI images to Ubuntu packages you can install manually. Study the <a href="https://about.gitlab.com/installation/">documentation</a>.</p>
<p>It will cost you USD 40 for a month of trial. If you want to save as much as tens of thousands of dollar, this is a bargain.</p>
<p>GitLab has many customization options. You can lock down your private GitLab to allow only users with an official e-mail from your domain, for example. You can configure <a href="https://docs.gitlab.com/ee/integration/omniauth.html">OAuth2 providers</a> so your users can quickly sign in using their GitHub, Facebook, Google or other accounts.</p>
<h4>A Few Gotchas</h4>
<p>I've stumbled upon a few caveats in the configuration. Which is why I recommend that you plan ahead - study this entire article ahead of time! -, do a quick install that you can blow away, so you can "feel" the environment before trying to migrate all your repos over to your brand new GitLab. As a reference, this is a part of my <code>/etc/gitlab/gitlab.rb</code>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># register a domain for your server and place it here:</span><tt>
</tt>external_url <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://my-gitlab-server.com/</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># you will want to enable [LFS](https://git-lfs.github.com)</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">lfs_enabled</span><span style="color:#710">'</span></span>] = <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt><span style="color:#888"># register your emails</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">gitlab_email_from</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">no-reply@my-gitlab-server.com</span><span style="color:#710">"</span></span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">gitlab_support_email</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">contact@my-gitlab-server.com</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># add your email configuration (template for gmail)</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_enable</span><span style="color:#710">'</span></span>] = <span style="color:#038;font-weight:bold">true</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_address</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">smtp.gmail.com</span><span style="color:#710">"</span></span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_port</span><span style="color:#710">'</span></span>] = <span style="color:#00D;font-weight:bold">587</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_user_name</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- some no-reply email ---</span><span style="color:#710">"</span></span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_password</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- the password ---</span><span style="color:#710">"</span></span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_domain</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">my-gitlab-server.com</span><span style="color:#710">"</span></span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_authentication</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">login</span><span style="color:#710">"</span></span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_enable_starttls_auto</span><span style="color:#710">'</span></span>] = <span style="color:#038;font-weight:bold">true</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">smtp_openssl_verify_mode</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">peer</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># this is where you enable oauth2 integration</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">omniauth_enabled</span><span style="color:#710">'</span></span>] = <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt><span style="color:#888"># CAUTION!</span><tt>
</tt><span style="color:#888"># This allows users to login without having a user account first. Define the allowed providers</span><tt>
</tt><span style="color:#888"># using an array, e.g. ["saml", "twitter"], or as true/false to allow all providers or none.</span><tt>
</tt><span style="color:#888"># User accounts will be created automatically when authentication was successful.</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">omniauth_allow_single_sign_on</span><span style="color:#710">'</span></span>] = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">github</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">google_oauth2</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">bitbucket</span><span style="color:#710">'</span></span>]<tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">omniauth_block_auto_created_users</span><span style="color:#710">'</span></span>] = <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">omniauth_providers</span><span style="color:#710">'</span></span>] = [<tt>
</tt>  {<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">name</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">github</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_id</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- github app id --</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_secret</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- github secret --</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">url</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://github.com/</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">args</span><span style="color:#710">"</span></span> =&gt; { <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">scope</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">user:email</span><span style="color:#710">"</span></span> }<tt>
</tt>  },<tt>
</tt>  {<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">name</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">google_oauth2</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_id</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- google app id --</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_secret</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- google secret --</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">args</span><span style="color:#710">"</span></span> =&gt; { <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">access_type</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">offline</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">approval_prompt</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>, hd =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">codeminer42.com</span><span style="color:#710">'</span></span> }<tt>
</tt>  },<tt>
</tt>  {<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">name</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">bitbucket</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_id</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- bitbucket app id --</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_secret</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">-- bitbucket secret id --</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">url</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://bitbucket.org/</span><span style="color:#710">"</span></span><tt>
</tt>  }<tt>
</tt>]<tt>
</tt><tt>
</tt><span style="color:#888"># if you're importing repos from GitHub, Sidekiq workers can grow as high as 2.5GB of RAM and the default [Sidekiq Killer](https://docs.gitlab.com/ee/operations/sidekiq_memory_killer.html) config will cap it down to 1GB, so you want to either disable it by adding '0' or adding a higher limit</span><tt>
</tt>gitlab_rails[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">env</span><span style="color:#710">'</span></span>] = { <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">SIDEKIQ_MEMORY_KILLER_MAX_RSS</span><span style="color:#710">'</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">3000000</span><span style="color:#710">'</span></span> }<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There are <a href="https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/files/gitlab-cookbooks/gitlab/attributes/default.rb#L57">dozens of default variables</a> you can <a href="https://gitlab.com/gitlab-org/omnibus-gitlab/blob/master/doc/settings/environment-variables.md">override</a>, just be careful on your testings.</p>
<p>Every time you change a configuration, you can just run the following commands:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo gitlab-ctl reconfigure<tt>
</tt>sudo gitlab-ctl restart<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can open a Rails console to inspect production objects like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gitlab-rails console<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I had a lot of trouble importing big repos from GitHub, but after a few days debugging the problem with GitLab Core Team developers <a href="https://gitlab.com/u/dbalexandre">Douglas Alexandre</a>, <a href="https://gitlab.com/u/brodock">Gabriel Mazetto</a>, a few Merge Requests and some local patching and I was finally able to import relatively big projects (more than 5,000 commits, more than 1,000 issues, more than 1,200 pull requests with several comments worth of discussion threads). A project of this size can take a couple of hours to complete, mainly because <strong>it's damn slow to use GitHub's public APIs</strong> (they are slow and they have rate limits and abuse detection, so you can't fetch everything as fast as your bandwidth would allow).</p>
<p>(By the way, don't miss GitLab will be over at <a href="https://www.rubyconf.com.br/pt-BR/speakers#Gabriel%20Gon%C3%A7alves%20Nunes%20Mazetto">Rubyconf Brazil 2016</a>, on Sep 23-24)</p>
<p>Migrating all my GitHub projects took a couple of days, but they all went through smoothly and my team didn't have any trouble, just adjusting their git remote URLs and they're done.</p>
<p>The import procedure from GitHub is quite complete, it brings not only the git repo per se, but also all the metadata, from labels to comments and pull request history - which is the one that usually takes more time.</p>
<p>But I'd recommend waiting for at least version 8.11 (it's currently 8.10.3) before trying to import large GitHub projects.</p>
<p>If you're on Bitbucket, unfortunatelly there are less features in the importer. It will mostly just bring the source code. So be aware of that if you extensively depend on their pull request system and you want to preserve this history. More feature will come and you can even help them out, they are very resourceful and willing to make GitLab better.</p>
<h3>Side-track: Customizations for every Digital Ocean box</h3>
<p>Assume that you should run what's in this section for all new machines you create over Digital Ocean.</p>
<p>First of all, they come without a swap file. No matter how much RAM you have, the Linux OS is meant to work better by combining a swap file. You can <a href="https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04">read more about it</a> later, for now just run the following as root:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">fallocate -l 4G /swapfile<tt>
</tt>chmod 600 /swapfile<tt>
</tt>mkswap /swapfile<tt>
</tt>swapon /swapfile<tt>
</tt><tt>
</tt>sysctl vm.swappiness=10<tt>
</tt>sysctl vm.vfs_cache_pressure=50<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Edit the <code>/etc/fstab</code> file and add this line:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">/swapfile   none    swap    sw    0   0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, edit the <code>/etc/sysctl.conf</code> file and add these lines:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">vm.swappiness=10<tt>
</tt>vm.vfs_cache_pressure = 50<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Don't forget to set the <a href="https://askubuntu.com/questions/162391/how-do-i-fix-my-locale-issue">default locale</a> of your machine. Start by editing the <code>/etc/environment</code> file and adding:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">LC_ALL=en_US.UTF-8<tt>
</tt>LANG=en_US.UTF-8<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then run:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo locale-gen en_US en_US.UTF-8<tt>
</tt>sudo dpkg-reconfigure locales<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, you should have Ubuntu automatically install stable security patches for you. You don't want to forget machines online without the most current security fixes, so just run this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dpkg-reconfigure --priority=low unattended-upgrades<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Choose "yes" and you're done. And of course, for every fresh install, it's always good to run the good old:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get update &amp;&amp; sudo apt-get upgrade<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is the very basics, I believe it's easier to have an image with all this ready, but if you use the standard Digital Ocean images, these settings should do the trick for now.</p>
<h2>Installing the CI Runner</h2>
<p>Once you finish your GitLab installation, it's <a href="https://about.gitlab.com/2016/04/19/how-to-set-up-gitlab-runner-on-digitalocean/">super easy</a> to deploy the GitLab Runner. You can use the same machine but I recommend you install it in a separate machine.</p>
<p>If you don't know what a runner is, just imagine it like this: It's basically a server connected to the GitLab install. When it's available and online, whenever someone pushes a new commit, merge request, to a repository that has a <code>gitlab-ci-yml</code> file present, GitLab will push a command to the runner.</p>
<p>Depending on how you configured the runner, it will receive this command and spawn a new Docker container. Inside the container it will execute whatever you have defined in the <code>gitlab-ci.yml</code> file in the project. Usually it's fetching cached files (dependencies, for example), and run your test suite.</p>
<p>In the most basic setup, you will only have one Runner and any subsequent builds from other users will wait in line until they finish. If you've used external CI services such as Travis-CI or CircleCI, you know that they charge for some number of concurrent builds. And it's <strong>very expensive</strong>.</p>
<p>The less concurrent builds available, the more your users will have to wait for feedback on their changes, and less productive you will become. People may even start to avoid adding new tests, or completely ignore the tests, which will really hurt the quality of your project over time. If there is one thing you <strong>must not</strong> do is not having good automated test suites.</p>
<p>Gabriel Mazetto pointed me to a very important GitLab CI Runner feature: <a href="https://about.gitlab.com/2016/03/29/gitlab-runner-1-1-released/"><strong>auto-scaling</strong></a>. This is what they use in their hosted offering over at GitLab.com.</p>
<p>You can <strong>easily</strong> set up a runner that can use "docker-machine" and your IaaS provider APIs to spin up machines on the fly to run as many concurrent builds as you want, and it will be super cheap!</p>
<p>For example, on Digital Ocean you can be charged USD 0.06 (6 cents) per hour of usage of a 4GB machine. Over at AWS EC2 you can be charged USD 0.041 per hour for an m3.medium machine.</p>
<p>There is extensive documentation but I will try to summarize what you have to do. For more details I highly recommend you to study their <a href="https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/install/autoscaling.md#prepare-the-docker-registry-and-cache-server">official documentation</a>.</p>
<p>Start by creating 3 new machines at Digital Ocean, all in the same Region with private networking enabled! I will list a fake private IP address just for the sake of advancing in the configuration examples:</p>
<ul>
  <li>a 1GB machine called "docker-registry-mirror", (ex 10.0.0.1)</li>
  <li>a 1GB machine called "ci-cache", (ex 10.0.0.2)</li>
  <li>a 1GB machine called "ci-runner", (ex 10.0.0.3)</li>
</ul>
<p>Yeah, they can be small as very little will run on them. You can be conservative and choose the 2GB RAM options just to be on the safe side (and pricing will still be super cheap).</p>
<p>Don't forget to execute the basic configuration I mentioned above to enable a swapfile, auto security update and locale regeneration.</p>
<p>SSH in to "docker-registry-mirror" and just run:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">docker run -d -p 6000:5000 \<tt>
</tt>    -e REGISTRY_PROXY_REMOTEURL=https://registry-1.docker.io \<tt>
</tt>    --restart always \<tt>
</tt>    --name registry registry:2<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you wil have a local Docker images registry proxy and cache at <code>10.0.0.1:6000</code> (take note of the real private IP).</p>
<p>SSH in to "ci-cache" and run:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mkdir -p /export/runner<tt>
</tt><tt>
</tt>docker run -it --restart always -p 9005:9000 \<tt>
</tt>        -v /.minio:/root/.minio -v /export:/export \<tt>
</tt>        --name minio \<tt>
</tt>        minio/minio:latest /export<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you will have an AWS S3 clone called <a href="https://github.com/minio/minio">Minio</a> running. I didn't know this project even existed, but it is a nifty little service written in Go to clone the AWS S3 behavior and APIs. So now you can have your very own S3 inside your infrastructure!</p>
<p>After Docker spin ups, it will print out the Access Key and Secret keys, make notes. And this service will be running at <code>10.0.0.2:9005</code>.</p>
<p>You can even open a browser and see their web interface at <code>https://10.0.0.2:9005</code> and use the access and secret keys to login. Make sure you have a bucket named "runner". The files will be stored at the <code>/export/runner</code> directory.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/549/big_Minio_Browser.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/549/Minio_Browser.png 2x" alt="Minio Dashboard"></p>
<p>Make sure the <a href="https://docs.aws.amazon.com/AmazonS3/latest/dev/BucketRestrictions.html">bucket name is valid</a> (it must be a valid DNS naming, for example, DO NOT use underlines).</p>
<p>Open this URL from your freshly installed GitLab-CE: <code>https://yourgitlab.com/admin/runners</code> and take note of the Registration Token. Let's say it's <code>1aaaa_Z1AbB2CdefGhij</code></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/550/big_Admin_Area___GitLab.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/550/Admin_Area___GitLab.png 2x" alt="Admin Area for Runner Registration Token"></p>
<p>Finally, SSH in to "ci-runner" and run:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl -L https://github.com/docker/machine/releases/download/v0.7.0/docker-machine-`uname -s`-`uname -m` &gt; /usr/local/bin/docker-machine<tt>
</tt><tt>
</tt>chmod +x /usr/local/bin/docker-machine<tt>
</tt><tt>
</tt>curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-ci-multi-runner/script.deb.sh | sudo bash<tt>
</tt><tt>
</tt>sudo apt-get install gitlab-ci-multi-runner<tt>
</tt><tt>
</tt>rm -Rf ~/.docker # just to make sure<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you can register this new runner with your GitLab install, you will need the Registration Token mentioned above.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo gitlab-ci-multi-runner register<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You will be asked a few questions, and this is what you can answer:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Please enter the gitlab-ci coordinator URL (e.g. https://gitlab.com/ci )<tt>
</tt>https://yourgitlab.com/ci<tt>
</tt>Please enter the gitlab-ci token for this runner<tt>
</tt>1aaaa_Z1AbB2CdefGhij # as in the example above<tt>
</tt>Please enter the gitlab-ci description for this runner<tt>
</tt>my-autoscale-runner<tt>
</tt>INFO[0034] fcf5c619 Registering runner... succeeded<tt>
</tt>Please enter the executor: shell, docker, docker-ssh, docker+machine, docker-ssh+machine, ssh?<tt>
</tt>docker+machine<tt>
</tt>Please enter the Docker image (eg. ruby:2.1):<tt>
</tt>codeminer42/ci-ruby:2.3<tt>
</tt>INFO[0037] Runner registered successfully. Feel free to start it, but if it's<tt>
</tt>running already the config should be automatically reloaded!<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Let's make a copy of the original configuration, just to be safe:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cp /etc/gitlab-runner/config.toml /etc/gitlab-runner/config.bak<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Copy the first few lines of this file (you want the token), it will look like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">concurrent = 1<tt>
</tt>check_interval = 0<tt>
</tt><tt>
</tt>[[runners]]<tt>
</tt>  name = "my-autoscale-runner"<tt>
</tt>  url = "https://yourgitlab.com/ci"<tt>
</tt>  token = "--- generated runner token ---"<tt>
</tt>  executor = "docker+machine"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The important part here is the "token". You will want to take note of it. And now you also will want to create a <a href="https://cloud.digitalocean.com/settings/api/tokens">new API Token over at Digital Ocean</a>. Just Generate a New Token and take note.</p>
<p>You can now replace the entire <code>config.toml</code> file for this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">concurrent = 20<tt>
</tt>check_interval = 0<tt>
</tt><tt>
</tt>[[runners]]<tt>
</tt>  name = "my-autoscale-runner"<tt>
</tt>  url = "https://yourgitlab.com/ci"<tt>
</tt>  token = "--- generated runner token ---"<tt>
</tt>  executor = "docker+machine"<tt>
</tt>  limit = 15<tt>
</tt>  [runners.docker]<tt>
</tt>    tls_verify = false<tt>
</tt>    image = "codeminer42/ci-ruby:2.3"<tt>
</tt>    privileged = false<tt>
</tt>  [runners.machine]<tt>
</tt>    IdleCount = 2                   # There must be 2 machines in Idle state<tt>
</tt>    IdleTime = 1800                 # Each machine can be in Idle state up to 30 minutes (after this it will be removed)<tt>
</tt>    MaxBuilds = 100                 # Each machine can handle up to 100 builds in a row (after this it will be removed)<tt>
</tt>    MachineName = "ci-auto-scale-%s"   # Each machine will have a unique name ('%s' is required)<tt>
</tt>    MachineDriver = "digitalocean"  # Docker Machine is using the 'digitalocean' driver<tt>
</tt>    MachineOptions = [<tt>
</tt>        "digitalocean-image=coreos-beta",<tt>
</tt>        "digitalocean-ssh-user=core",<tt>
</tt>        "digitalocean-access-token=-- your new Digital Ocean API Token --",<tt>
</tt>        "digitalocean-region=nyc1",<tt>
</tt>        "digitalocean-size=4gb",<tt>
</tt>        "digitalocean-private-networking",<tt>
</tt>        "engine-registry-mirror=https://10.0.0.1:6000"<tt>
</tt>    ]<tt>
</tt>  [runners.cache]<tt>
</tt>    Type = "s3"   # The Runner is using a distributed cache with Amazon S3 service<tt>
</tt>    ServerAddress = "10.0.0.2:9005"  # minio<tt>
</tt>    AccessKey = "-- your minio access key --"<tt>
</tt>    SecretKey = "-- your minio secret key"<tt>
</tt>    BucketName = "runner"<tt>
</tt>    Insecure = true # Use Insecure only when using with Minio, without the TLS certificate enabled<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you can restart the runner to pick up the new configuration like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gitlab-ci-multi-runner restart<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As I said before, you will want to read the extensive <a href="https://gitlab.com/gitlab-org/gitlab-ci-multi-runner/blob/master/docs/configuration/autoscale.md">official documentation</a> (and every link within).</p>
<p>If you did everything right, changing the correct private IPs for the docker registry and cache, the correct tokens, and so forth, you can log in to your Digital Ocean dashboard and you will see something like this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/548/big_DigitalOcean_-_Droplets.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/548/DigitalOcean_-_Droplets.png 2x" alt="Digital Ocean CI Setup"></p>
<p>And from the <code>ci-runner</code> machine, you can list them like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># docker-machine ls<tt>
</tt><tt>
</tt>NAME                                                ACTIVE   DRIVER         STATE     URL                         SWARM   DOCKER    ERRORS<tt>
</tt>runner-xxxx-ci-auto-scale-xxxx-xxxx   -        digitalocean   Running   tcp://191.168.0.1:2376            v1.10.3<tt>
</tt>runner-xxxx-ci-auto-scale-xxxx-xxxx   -        digitalocean   Running   tcp://192.169.0.2:2376           v1.10.3<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>They should not list any errors, meaning that they are up and running, waiting for new builds to start.</p>
<p>There will be 2 new machines listed in your Digital Ocean dashboard, named "runner-xxxxx-ci-auto-scale-xxxxx". This is what <code>IdleCount = 2</code> does. If they stay idle for more than 30 minutes (<code>IdleTime = 1800</code>) they will be shut down so you don't get charged.</p>
<p>You can have several "runner" definitions, each with a <code>limit</code> of builds/machines that can be spawned in Digital Ocean. You can have other runner definitions for other providers, for example. But in this example we are limited to at most 15 machines, so 15 concurrent builds.</p>
<p>The <code>concurrent</code> limit is a global setting. So if I had 3 runner definitions, each with a <code>limit</code> of 15, they would still be globally limited to 20 as defined in the <code>concurrent</code> global variable.</p>
<p>You can use different providers for specific needs, for example, to run OS X builds or Rapsberry PI builds or other exotic kinds of builds. In the example I am keeping it simple and just setting many builds in the same provider (Digital Ocean).</p>
<p>And don't worry about the monthly fee for each machine. When used in this manner, you will be paying per hour.</p>
<p>Also, make sure you spinned up all your machines (docker-registry, minio cache, CI runner) all with <strong>private networking enabled</strong> (so they talk through the internal VLAN instead of having to go all the way through the public internet) and that they are all in the same region data center (NYC1 is New York 1 - New York has 3 sub-regions, for example). Don't start machines in different regions.</p>
<p>Because we have Docker proxy/cache and Minio/S3 cache, your builds will take take longer the first time (let's say, 5 minutes), and then subsequent build will fetch everything from the cache (taking, let's say, 1:30 minute). It's fast and it's convenient.</p>
<h3>Setting up each Project for the Runner</h3>
<p>The Runner is one of the newest pieces of the GitLab ecosystem so you might have some trouble at first to figure out a decent configuration. But once you have the whole infrastructure figured out as described in the previous section, now it's as easy as adding a <code>.gitlab-ci.yml</code> file to your root directory. Something like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># This file is a template, and might need editing before it works on your project.</span><tt>
</tt><span style="color:#808">image</span>: <span style="background-color:#fff0f0;color:#D20">codeminer42/ci-ruby:2.3</span><tt>
</tt><tt>
</tt><span style="color:#888"># Pick zero or more services to be used on all builds.</span><tt>
</tt><span style="color:#888"># Only needed when using a docker container to run your tests in.</span><tt>
</tt><span style="color:#888"># Check out: https://docs.gitlab.com/ce/ci/docker/using_docker_images.html#what-is-service</span><tt>
</tt><span style="color:#808">services</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">postgres:latest</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">redis:latest</span><tt>
</tt><tt>
</tt><span style="color:#808">cache</span>:<tt>
</tt>  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">your-project-name</span><tt>
</tt>  <span style="color:#808">untracked</span>: <span style="background-color:#fff0f0;color:#D20">true</span><tt>
</tt>  <span style="color:#808">paths</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">.ci_cache/</span><tt>
</tt><tt>
</tt><span style="color:#808">variables</span>:<tt>
</tt>  <span style="color:#808">RAILS_ENV</span>: <span style="background-color:#fff0f0;color:#D20">'test'</span><tt>
</tt>  <span style="color:#808">DATABASE_URL</span>: <span style="background-color:#fff0f0;color:#D20">postgresql://postgres:@postgres</span><tt>
</tt>  <span style="color:#808">CODECLIMATE_REPO_TOKEN</span>: <span style="background-color:#fff0f0;color:#D20">-- your codeclimate project token --</span><tt>
</tt><tt>
</tt><span style="color:#808">before_script</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">bundle install --without development production -j $(nproc) --path .ci_cache</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">cp .env.sample .env</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">cp config/database.yml.example config/database.yml</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">bundle exec rake db:create db:migrate</span><tt>
</tt><tt>
</tt><span style="color:#808">test</span>:<tt>
</tt>  <span style="color:#808">script</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">xvfb-run bundle exec rspec</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>My team at <a href="https://www.codeminer42.com">Codeminer 42</a> prepared a <a href="https://hub.docker.com/r/codeminer42/ci-ruby/">simple Docker image</a> with useful stuff pre-installed (such as the newest phantomjs, xvfb, etc), so it's now super easy to enable automated builds within GitLab by just adding this file to the repositories. (Thanks to Carlos Lopes, Danilo Resende and Paulo Diovanni - who will be talking <a href="https://www.rubyconf.com.br/pt-BR/speakers#Paulo%20Diovani%20Gon%C3%A7alves">about Docker at Rubyconf Brasil 2016</a>, by the way)</p>
<p>GitLab-CI even supports building a pending Merge Request, and you can enforce the request so it can only be merged if builds pass, just like in GitHub + Travis. And as Code Climate is agnostic to Repository host or CI runner, you can easily integrate it as well.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/551/big_Settings___Codeminer42___CM-Fulcrum___GitLab.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/551/Settings___Codeminer42___CM-Fulcrum___GitLab.png 2x" alt="Project Force Successful Build to Merge"></p>
<h2>Conclusion</h2>
<p>The math is hard to argue against: the GitLab + GitLab-CI + Digital Ocean combo is a big win. GitLab's interface is very familiar so users from GitHub or Bitbucket will feel quite at home in no time.</p>
<p>We can use all the <a href="https://about.gitlab.com/2014/09/29/gitlab-flow/">Git flows</a> we're used to.</p>
<p>GitLab-CE is stil a work in progress though, the team is increasing their pace but there are currently more than <a href="https://gitlab.com/gitlab-org/gitlab-ce/issues">4,200 open issues</a>. But as this is all Ruby on Rails and Ruby tooling, you can easily jump in and contribute. No contribution is too small. Just by reporting how to reproduce a bug is help enough to assist the developers to figure out how to improve faster.</p>
<p>But don't shy away because of the open issues, it's fully functional as of right now and I have not found any bugs that could be considered show stoppers.</p>
<p>They have many things right. First of all, it's a "simple" Ruby on Rails project. It's a no-thrills front-end with plain JQuery. The choice of HAML for the views is questionable but it doesn't hurt. They use good old Sidekiq+Redis for asynchronous jobs. No black magic here. A pure monolith that's not difficult to understand and to contribute.</p>
<p>The APIs are all written using Grape. They have the <a href="https://gitlab.com/gitlab-org/gitlab-ce">GitLab CE</a> project separated from other components, such as the <a href="https://gitlab.com/gitlab-org/gitlab-shell">GitLab-Shell</a> and <a href="https://gitlab.com/gitlab-org/gitlab-ci-multi-runner">GitLab-CI-Multi-Runner</a>.</p>
<p>They also forked <a href="https://gitlab.com/gitlab-org/omnibus-gitlab">Omnibus</a> in order to be able to package the CE Rails project as a ".deb". Everything is orchestrated with Docker. And when a new version is available, you only need to <code>apt-get update &amp;&amp; apt-get ugprade</code> and it will do all the work of backing up and migratind Postgresql, updating the code, bundling in new dependencies, restarting the services and so forth. It's super convenient and you should take a look at this project if you have complicated Rails deployments into your own infrastructure (out of Heroku, for example).</p>
<p>I am almost done moving hundreds of repositories from both BitBucket and GitHub to GitLab right now and the developers from my company are already using it in a daily basis without any problems. We are almost at the point where we can disengage from BitBucket, GitHub and external CIs.</p>
<p>You will be surprised how easy your company can do it too and save a couple thousand dollars in the process, while having fun doing it!</p>
<p></p>
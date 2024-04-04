---
title: "Is your Rails app ready for Production?"
date: "2016-03-22T18:11:00.000Z"
tags: ["rails", "heroku", "deployment", "optimization", "security", "performance"]
years: "2016"
---

<p></p>
<p>This is a checklist. You should follow these instructions if you want some peace of mind after deploying an application to production. If you're experienced, please contribute in the comments section below. But if you're a beginner, you should pay attention.</p>
<p></p>
<p></p>
<h3>Where to Deploy? TL;DR: Heroku</h3>
<p>Many people will first target the cheap choices. Usually EC2 micro instances or small Digital Ocean droplets. Unless you're aware that you <strong>must</strong> constantly monitor and upgrade those instances, <strong>DON'T</strong> do it.</p>
<p>Instead choose a PaaS solution such as Heroku. It's a no-brainer. Software in production is not a one-off thing. For security alone you should not do it by yourself unless you know how to harden a OS distribution. For example, most people doesn't even know what <a href="https://www.fail2ban.org/wiki/index.php/Main_Page">fail2ban</a> is. Don't assume that because you use SSH with keypairs you're secure. You're not.</p>
<p>For example, did you know that we just went through a <a href="https://blog.heroku.com/archives/2016/3/21/patching-glibc-security-hole">glibc security crisis</a>? If you don't and you didn't touch your production servers in some time to upgrade all your components, you're open, wide open. I had many clients that hired freelancers to implement their apps and deploy and then stayed without anyone checking. You're all unsafe.</p>
<p>Heroku is no guarantee either, because app libraries get old, vulnerabilities get discovered, and you should upgrade them. Rails has an <a href="https://groups.google.com/forum/#!forum/rubyonrails-security">active security team</a> releasing security patches all the time. If you haven't been upgrading, you're unsafe.</p>
<p>But 24x7 support is not cheap, if you have your own infrastructure or use an IaaS platform such as AWS EC2, you should have 24x7 personnel, this means at least 2 full-time system administrators/devops taking care of things. Or, you use a PaaS that at least keep those basic sanitations in check and a part-time developer to at least keep upgrading your apps.</p>
<p>If you don't, you're opening your business to serious liability. And if you're a developer, do the responsible thing: disclose this fact to your clients and let them make an informed choice. They can choose to stay in the cheap, but at least they know what this actually means.</p>
<h3>Which web server? TL;DR: Passenger or Puma</h3>
<p>Most Rails apps lack basic libraries that should be installed to make them work correctly.</p>
<p>I've seen people running production apps by just firing up <tt>rails server</tt> and nothing else! This is running the basic Webrick web server, in production! You must choose between Puma, Unicorn, Passenger. Unicorn actually does not protect your app against slow clients, so avoid it if you can.</p>
<p>If you're in doubt, <a href="https://www.phusionpassenger.com/library/walkthroughs/deploy/ruby/heroku/standalone/oss/deploy_app_main.html">install Passenger</a> and call it a day.</p>
<p>The most common choice nowadays is <a href="https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server">using Puma</a>. But if you're running under Heroku or using small instances, keep in mind your RAM usage. A normal Rails application consumes at least 150Mb to 200Mb or more depending on the size of your app. The smallest Heroku dyno has only 512Mb of RAM, that means you should not configure Puma or Unicorn to have more than 2 instances. I'd recommend going for the 2X Dyno (1GB) and have at most 3 instances (which means 3 possible concurrent requests being processed at once).</p>
<p>It's not uncommon for your app to keep increasing RAM usage over time and once every couple of days you see R14 happening, then your dyno reboots and it starts working better for a while until it reaches the ceiling again.</p>
<p>If you don't know why that it's happening, and it's infrequent, you can temporarily use <a href="https://github.com/schneems/puma_worker_killer">Puma Worker Killer</a> - if you're using Puma, of course - to keep monitoring your instances until they reach a certain lower ceiling and they automatically recycle before your users see the R14 errors.</p>
<p>You may also have heard of <a href="https://tmm1.net/ruby21-oobgc">Out-of-Band GC</a>. Just <a href="https://github.com/puma/puma/issues/450">be warned</a> that Puma in threaded mode won't work well with it. If you're using Unicorn, by all means do use it.</p>
<h3>Measure, Measure, Measure. TL;DR: New Relic</h3>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/535/big_heroku-metrics.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/535/heroku-metrics.png 2x" alt="Heroku Metrics"></p>
<p>You should <strong>always</strong> monitor your app. Be it with custom installed software such as Nagios, Munin, Zabbix, Zenoss, Ganglia, etc or at the very least the metrics that Heroku provides you, as in the image above.</p>
<p>If your instances are behaving strangely, you should take a look at the warnings. A frequent set of <a href="https://devcenter.heroku.com/articles/ruby-memory-use">R14</a> errors means that your app's memory consumption is growing overtime and blowing the maximum amount of RAM available in your instance (a probable memory leaking). At the very least this means that you should decrease the number of concurrency/workers in your Puma/Unicorn and also increase the number of dynos to compensate if you do have enough traffic to justify it. But this is one metrics-oriented action that you can take because you have the information to make an informed decision.</p>
<p>But you should also be storing and indexing your logs using custom installed software such as Greylog2 or Logstash or using a SaaS alternative such as <a href="https://elements.heroku.com/addons/papertrail">Papertrail</a>. There are many reasons why an app might be leaking, of why everything seems fine in the metrics but you're having random errors. Always query the logs for answers.</p>
<p>Better yet, <a href="https://docs.newrelic.com/docs/agents/ruby-agent/miscellaneous/ruby-agent-heroku">install New Relic APM</a>. You will have both the metrics, the automated alerts, the errors measurement and really deep diagnostics to see exactly what line in your source code is guilty for your poor performance or frequent errors or erratic behavior. If you're in doubt, just install it, the basic plan is free anyway.</p>
<h3>Some Rails Dependencies</h3>
<p>You should <strong>NOT</strong> be using Rails below version 4.0 by now. 3.2 is still widely used but it will stop being supported soon. Do not use Rails 5.0 right now unless you're experienced enough to know what to do. Anything from 4.0 to 4.2 should be ok, but be aware of the minor releases that fixes security vulnerabilities.</p>
<p>You should <strong>NOT</strong> be using Ruby below version 2.2 by now. Security upgrades for 2.0 ended this February 2016. 2.1 was not a good stable release, but 2.2 and 2.3 are very good and you should be using them.</p>
<p>So the combination of Ruby 2.3.0 and Rails 4.2.5.2 (by March 2016) is the optimal choice for best stability, security and ecosystem support.</p>
<p>You should have at least the following dependencies installed by default:</p>
<ul>
  <li><a href="https://github.com/heroku/rails_12factor">Rails 12 Factor gem</a></li>
  <li><a href="https://rtomayko.github.io/rack-cache/">Rack-Cache middleware</a>
    <ul>
      <li><a href="https://devcenter.heroku.com/articles/memcachier#rails-3-and-4">Dalli gem with Memcached or Memcachier</a> - even if you're not using fragment caching or AR caching, this is still useful at least for the <a href="https://devcenter.heroku.com/articles/rack-cache-memcached-rails31">Rack-Cache gem</a>.</li>
    </ul>
  </li>
  <li><a href="https://github.com/kickstarter/rack-attack">Rack-Attack</a> - read how to properly configure!</li>
  <li><a href="https://www.sinatrarb.com/rack-protection/">Rack-Protection</a> - read how to properly configure and what protections you want to activate, not everything, but at least CSRF and XSS.</li>
  <li><a href="https://www.schneems.com/blogs/2016-02-18-speeding-up-sprockets/">Sprockets 3.3+</a> - make sure you're using the Sprockets version that fixes the slow speeds and makes it reasonably faster</li>
</ul>
<h3>Which Database? TL;DR: use Postgresql</h3>
<p><strong>Do NOT</strong> choose MongoDB or similar unless you have a very strong reason to and you are confident that you're very good at what you're doing and you will be sticking around to maintain what you deploy. Otherwise stick to Postgresql and the "pg" gem, you won't regret it, nor will your client.</p>
<p>Do use small Redis instances (particularly SaaS options such as <a href="https://elements.heroku.com/addons/heroku-redis">Heroku Redis</a> ) with <a href="https://github.com/mperham/sidekiq/wiki/Deployment">Sidekiq</a>. You can choose to use the lighter Sucker Punch but be aware that it will increase the RAM usage of your instances considerably depending on the size of your queues and the serialized input data for the workers. It's now always trivial how many Sidekiq workers you should have, but <a href="https://manuel.manuelles.nl/sidekiq-heroku-redis-calc/">this calculator</a> could help.</p>
<p>There are at least 2 big mistakes most people make using Sidekiq:</p>
<ul>
  <li>Having heavy workers hitting your master database. For example a big analytics procedure fetching large sets of data while your main website also have heavy users usage writing data all the time. Definitely add a <a href="https://devcenter.heroku.com/articles/heroku-postgres-follower-databases">Follower database</a> and point the Sidekiq workers (read-only) there for analytics, reports and similar workloads.</li>
  <li>Fetching large datasets in-memory and blowing your worker dynos. If you do anything similar to "YourModel.all.each { |r| ... }" you're shooting yourself in the foot. Rails has easy ways to <a href="https://api.rubyonrails.org/classes/ActiveRecord/Batches.html">fetch small sets in batch</a> for you to process, use them.</li>
</ul>
<h3>Are you using a CDN? TL;DR: just do</h3>
<p>This is easy, use <a href="https://devcenter.heroku.com/articles/using-amazon-cloudfront-cdn">AWS CloudFront</a> or <a href="https://devcenter.heroku.com/articles/fastly">Fastly</a> or something else, but <strong>USE</strong> a CDN. It's a no-brainer.</p>
<p>Otherwise your assets will be served by your already small web dyno instances. And this is a heavy lifting that are better served from a much faster CDN. Your users will perceive orders of magnitude in usability by changing just a couple of configuration lines in your code.</p>
<p>If you implemented your Rails views, templates, stylesheets using the "image_tag", "asset_path" helpers, it's just automatic. Just do it already.</p>
<p>And while we're in the subject of assets, if you happen to have image uploading and you're using the simple way of posting a multipart form directly to your Rails app, you will have trouble because Heroku imposes - a correct - maximum of 30 seconds of timeout. If you have many users uploading many high-resolution and heavy sized images, they will see increasing amounts of timeouts.</p>
<p>Use the <a href="https://cloudinary.com/documentation/rails_additional_topics">Attachinary gem</a> to direct upload via Javascript, from the browser, to the Cloudinary service, completly bypassing your Rails app, which will just receive the ID once the upload finishes. Again, there is a very generous free plan and it's so simple to implement that you must do it right away.</p>
<h3>You laid off your developer, what to do? TL;DR: revoke accesses!</h3>
<p>This is something that happen a lot: a small company needs to cut costs and lay off developers.</p>
<p>Make sure you revoke accesses. In AWS it's a lot more convoluted if you don't know your way through their IAM authorization tool. Or worse: if they have the private keys (.pem files) to your EC2 instances!! You will have to create new keypairs, deactivate the old EC2 instances and create new ones. A royal PITA.</p>
<p>You must change passwords to your DNS service, Github/Bitbucket organization, remove SSH keys from the .ssh/authorized_keys files in all your servers, etc.</p>
<p>Make sure your company has good legal support and make every collaborator, employee or 3rd party, sign a non-disclosure agreement, non-compete or confidentiality agreements.</p>
<p>You <strong>MUST</strong> have at least one key person in the company that has control over the keys, passwords and access to every service your company depends on to run. Otherwise don't be surprised when your app goes offline.</p>
<p>And don't fool yourself into thinking that just because an app is online and running it will keep that way for long. Security vulnerabilities are on the wild, it's just a matter of time until some glitch put your service down and you better have someone to put it back online for you if you don't know how to do it.</p>
<h3>Big Site? Congratulations, what to do now?</h3>
<p>If your business is thriving, blooming, congratulations. You're in the very very small percentage that actually made it.</p>
<p>Soon your brand new app will become that ugly, dreaded <strong>Legacy</strong> system. Worse, it's probably one of those feared <strong>monoliths</strong> or even worse, you let a hipster developer create a spaghetti architecture full of unchecked <strong>microservices</strong>. You're doomed either way.</p>
<p>This situation requires you to be grounded: there is no silver bullet, just business as usual.</p>
<p>You must keep ahead of the game, and the monitoring part I mentioned plays a big part to steer you through the many possible directions you can go. For example, for a short period of time you can increase the plans of your SaaS services such as databases, caches, queues, and also add more parallel web dynos.</p>
<p>While that will hold for a while (your metrics can help you estimate for how long), now you need to come up with a plan to optimize what you have. And no, rewriting everything is that very last thing you want to do, unless you intend to not have a life for the next couple of years.</p>
<p>Trust Paretto: in real life, 80% of the main problems can be solved with 20% of the effort. The main big tip: open New Relic - now loaded with real production data - and check the Top worse performers and start from there. The first one you solve (be it an ugly N+1 query to your database, slow web service integration), will give you a lot of room to breath.</p>
<h3>Conclusion</h3>
<p>What I just said is nothing but the tip of the iceberg in terms of Rails performance optimization. And I can assure you that there is a lot of room to improve without having to resort to rewriting everything in the next hip language out there. I recommend you buy Nate Berkopec's <a href="https://www.railsspeed.com/">"The Complete Guide to Rails Performance"</a> to really learn your turf.</p>
<p>This is a very quick compilation that I just dumped out of my mind, but there is much more that we can consider. Shoot questions in the comments section and other important items that I may have overlooked.</p>
<p></p>
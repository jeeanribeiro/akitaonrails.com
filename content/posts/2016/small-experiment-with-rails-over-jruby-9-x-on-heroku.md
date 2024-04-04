---
title: "Small Experiment with Rails over JRuby 9.x on Heroku"
date: "2016-06-03T21:12:00.000Z"
tags: ["heroku"]
years: "2016"
---

<p></p>
<p>After playing around with languages different than Ruby (such as <a href="/elixir">Elixir</a> or <a href="/crystal">Crystal</a>), it was time to go back to Ruby and see how JRuby is performing nowadays.</p>
<p>JRuby always pursued the goal of being a competent MRI replacement. If you have not followed what's going on, JRuby changed version schemes when they switched from the 1.7 series to the 9.x series. You should read <a href="blog%20post">this blog post</a> that explains it.</p>
<p></p>
<p></p>
<p>In summary, if you want MRI 2.2 compatibility you must use JRuby 9.0.x and if you want MRI 2.3 compatibility you must use JRuby 9.1.x series. The most current release being 9.1.2.0. Anything prior to that you can refer to this <a href="https://devcenter.heroku.com/articles/ruby-support#ruby-versions">table of versions</a> from Heroku's documentation.</p>
<p>There are important recommendations as well:</p>
<ul>
  <li>
    <p>Ideally you should use Rails 4.2. Try to be at least above 4.0, and you can turn on <code>config.threadsafe!</code> by default in the "config/environments/production.rb" file. To understand this subject, refer to <a href="https://tenderlovemaking.com/2012/06/18/removing-config-threadsafe.html">Tenderlove's excellent explanation</a>.</p>
  </li>
  <li>
    <p>If you're deploying to Heroku, don't bother trying the free or 1X dyno, which only gives you 512Mb of RAM. While it is enough for most small Rails applications (even with 2 or 3 Puma concurrent workers), I found that even the smallest apps can easily go above that. So you must consider at least the 2X dyno. In any server configuration, always consider more than 1Gb of RAM.</p>
  </li>
</ul>
<h3>Gems</h3>
<p>There are several gems with C extensions that just won't work. Some of them have drop-in replacements, some don't. You should refer to <a href="https://github.com/jruby/jruby/wiki/C-Extension-Alternatives">their Wiki</a> for a list of cases.</p>
<p>In my small sample application - which is nothing more than a content website backed by a Postgresql database, ActiveAdmin to manage content, RMagick + Paperclip (yes, it's an old app) to handle image upload and resizing, there was not a lot to change. The important bits of my "Gemfile" end up looking like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">source <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">https://rubygems.org</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>ruby <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">2.3.0</span><span style="color:#710">'</span></span>, <span style="color:#A60">:engine</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">jruby</span><span style="color:#710">'</span></span>, <span style="color:#A60">:engine_version</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">9.1.1.0</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#888"># ruby '2.3.1'</span><tt>
</tt><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">~&gt; 4.2.6</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">devise</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">haml</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">puma</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-attack</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-timeout</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rakismet</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># Database</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pg</span><span style="color:#710">'</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:ruby</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">activerecord-jdbcpostgresql-adapter</span><span style="color:#710">'</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:jruby</span><tt>
</tt><tt>
</tt><span style="color:#888"># Cache</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">dalli</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">actionpack-action_caching</span><span style="color:#710">"</span></span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">rails/actionpack-action_caching</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># Admin</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">activeadmin</span><span style="color:#710">'</span></span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">activeadmin</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">active_skin</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># Assets</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">therubyracer</span><span style="color:#710">'</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:ruby</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">therubyrhino</span><span style="color:#710">'</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:jruby</span><tt>
</tt><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">asset_sync</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">jquery-ui-rails</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sass-rails</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">uglifier</span><span style="color:#710">'</span></span>,     <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">&gt;= 1.3.0</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">coffee-rails</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">~&gt; 4.0.0</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">compass-rails</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sprockets</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">~&gt;2.11.0</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># Image Processing</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">paperclip</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">fog</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rmagick</span><span style="color:#710">'</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:ruby</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rmagick4j</span><span style="color:#710">'</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:jruby</span><tt>
</tt><tt>
</tt>group <span style="color:#A60">:test</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">shoulda-matchers</span><span style="color:#710">'</span></span>, <span style="color:#808">require</span>: <span style="color:#038;font-weight:bold">false</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>group <span style="color:#A60">:test</span>, <span style="color:#A60">:development</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">sqlite3</span><span style="color:#710">"</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:ruby</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">activerecord-jdbcsqlite3-adapter</span><span style="color:#710">"</span></span>, <span style="color:#808">platforms</span>: <span style="color:#A60">:jruby</span><tt>
</tt><tt>
</tt>  <span style="color:#888"># Pretty printed test output</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">turn</span><span style="color:#710">'</span></span>, <span style="color:#808">require</span>: <span style="color:#038;font-weight:bold">false</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">jasmine</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pry-rails</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rspec</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rspec-rails</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">capybara</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">poltergeist</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">database_cleaner</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">&lt; 1.1.0</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">letter_opener</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">dotenv-rails</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>group <span style="color:#A60">:production</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails_12factor</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-cache</span><span style="color:#710">'</span></span>, <span style="color:#808">require</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack/cache</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">memcachier</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">newrelic_rpm</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice how I paired gems for the <code>:ruby</code> and <code>:jruby</code> platforms. After doing this change and <code>bundle install</code> everything, I ran my Rspec suite and - fortunatelly - they all passed on the first run without any further changes! Your mileage will vary depending on the complexity of your application, so have your tests ready.</p>
<h3>Puma</h3>
<p>In the case of Puma, the configuration is a bit trickier, mine looks like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">web_concurrency = Integer(<span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">WEB_CONCURRENCY</span><span style="color:#710">'</span></span>] || <span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt><span style="color:#080;font-weight:bold">if</span> web_concurrency &gt; <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>  workers web_concurrency<tt>
</tt>  preload_app!<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>threads_count = Integer(<span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">RAILS_MAX_THREADS</span><span style="color:#710">'</span></span>] || <span style="color:#00D;font-weight:bold">5</span>)<tt>
</tt>threads threads_count, threads_count<tt>
</tt><tt>
</tt>rackup      <span style="color:#036;font-weight:bold">DefaultRackup</span><tt>
</tt>port        <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PORT</span><span style="color:#710">'</span></span>]     || <span style="color:#00D;font-weight:bold">3000</span><tt>
</tt>environment <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">RACK_ENV</span><span style="color:#710">'</span></span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">development</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>on_worker_boot <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#888"># Worker specific setup for Rails 4.1+</span><tt>
</tt>  <span style="color:#888"># See: https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server#on-worker-boot</span><tt>
</tt>  <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.establish_connection<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's a bit different than you might find in other documentations. The important part is to turn off workers and preload_app when loading over JRuby. It will complain and crash. On my original MRI deploy I am using a small 1X dyno and I can leave <code>WEB_CONCURRENCY=2</code> and <code>RAILS_MAX_THREADS=5</code> but on the JRuby deploy I set it to <code>WEB_CONCURRENCY=1</code> (to turn off workers) and <code>RAILS_MAX_THREADS=16</code> (because I am assuming JRuby can handle more multithreading than MRI).</p>
<p>Another important bit, most people still assume that MRI can't take advantage of native parallel threads at all because of the dared GIL (Global Interpreter Lock), but this is not entirely true. MRI Ruby can parallelize threads on I/O waits. So, if a part of your app is waiting for database to process and return rows, for example, another thread can take over and do something else, in parallel. It's not totally multi-threaded, but it can do some concurrency so setting a small amount of threads for Puma might help a bit.</p>
<p>Do not forget to set the Pool size to at least the same number of <code>RAILS_MAX_THREADS</code>. You can either use the <code>config/database.yml</code> for Rails 4.1+ or add an initializer. Follow <a href="https://devcenter.heroku.com/articles/concurrency-and-database-connections#threaded-servers">Heroku's documentation</a> on how to do so.</p>
<h3>Initial Benchmarks</h3>
<p>So, I was able to successfully deploy a secondary JRuby version of my original MRI-based Rails app.</p>
<p>The original app is still in a Hobby Dyno, sized at 512Mb of RAM. The secondary app needed a Standard 1X Dyno, sized at 1Gb of RAM.</p>
<p>The app itself is super simple and as I'm using caching - <a href="https://www.akitaonrails.com/2015/05/20/dynamic-site-as-fast-as-a-static-generated-one-with-raptor">as you always should!</a> -, the response time is very low, on the tens of milliseconds.</p>
<p>I tried to use the <a href="https://github.com/rakyll/boom">Boom</a> tool to benchmark the requests. I did a lot of warming up on the JRuby version, running the benchmarks multiple times and even using Loader.io for added pressure.</p>
<p>I am running this test:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ boom -n 200 -c 50 https://foo-my-site/<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The MRI version performs like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Summary:<tt>
</tt>  Total:    16.4254 secs<tt>
</tt>  Slowest:  9.0785 secs<tt>
</tt>  Fastest:  0.8362 secs<tt>
</tt>  Average:  2.6551 secs<tt>
</tt>  Requests/sec: 12.1763<tt>
</tt>  Total data:   28837306 bytes<tt>
</tt>  Size/request: 144186 bytes<tt>
</tt><tt>
</tt>Status code distribution:<tt>
</tt>  [200] 200 responses<tt>
</tt><tt>
</tt>Response time histogram:<tt>
</tt>  0.836 [1] |<tt>
</tt>  1.660 [57]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  2.485 [57]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  3.309 [33]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  4.133 [22]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  4.957 [16]    |∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  5.782 [6] |∎∎∎∎<tt>
</tt>  6.606 [3] |∎∎<tt>
</tt>  7.430 [1] |<tt>
</tt>  8.254 [3] |∎∎<tt>
</tt>  9.079 [1] |<tt>
</tt><tt>
</tt>Latency distribution:<tt>
</tt>  10% in 1.2391 secs<tt>
</tt>  25% in 1.5910 secs<tt>
</tt>  50% in 2.1974 secs<tt>
</tt>  75% in 3.4327 secs<tt>
</tt>  90% in 4.5580 secs<tt>
</tt>  95% in 5.6727 secs<tt>
</tt>  99% in 8.1567 secs<tt>
</tt><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And the JRuby version performs like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Summary:<tt>
</tt>  Total:    15.5784 secs<tt>
</tt>  Slowest:  7.4106 secs<tt>
</tt>  Fastest:  0.5770 secs<tt>
</tt>  Average:  2.3224 secs<tt>
</tt>  Requests/sec: 12.8383<tt>
</tt>  Total data:   28848475 bytes<tt>
</tt>  Size/request: 144242 bytes<tt>
</tt><tt>
</tt>Status code distribution:<tt>
</tt>  [200] 200 responses<tt>
</tt><tt>
</tt>Response time histogram:<tt>
</tt>  0.577 [1] |<tt>
</tt>  1.260 [23]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  1.944 [62]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  2.627 [51]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  3.310 [24]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  3.994 [26]    |∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎∎<tt>
</tt>  4.677 [8] |∎∎∎∎∎<tt>
</tt>  5.361 [1] |<tt>
</tt>  6.044 [0] |<tt>
</tt>  6.727 [1] |<tt>
</tt>  7.411 [3] |∎<tt>
</tt><tt>
</tt>Latency distribution:<tt>
</tt>  10% in 1.1599 secs<tt>
</tt>  25% in 1.5154 secs<tt>
</tt>  50% in 2.0781 secs<tt>
</tt>  75% in 2.8909 secs<tt>
</tt>  90% in 3.7409 secs<tt>
</tt>  95% in 4.2556 secs<tt>
</tt>  99% in 6.7685 secs<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In general, I'd say that they are around the same. As this is not a particularly CPU-intensive processing, and most of the time is spent going through the Rails stack and hitting Memcachier to pull back the same content all the time, maybe it's only fair to expect similar results.</p>
<p>On the other hand, I'm not sure I'm using the tool in the best way possible. The log says something like this for every request:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">source=rack-timeout id=c8ad5f0c-b5c1-47ec-b88b-3fc597ab01dc wait=29ms timeout=20000ms state=ready<tt>
</tt>Started GET "/" for XXX.35.10.XXX at 2016-06-03 18:54:34 +0000<tt>
</tt>Processing by HomeController#home as HTML<tt>
</tt>Read fragment views/radiant-XXXX-XXXXX.herokuapp.com/en (6.0ms)<tt>
</tt>Completed 200 OK in 8ms (ActiveRecord: 0.0ms)<tt>
</tt>source=rack-timeout id=c8ad5f0c-b5c1-47ec-b88b-3fc597ab01dc wait=29ms timeout=20000ms service=19ms state=completed<tt>
</tt>source=rack-timeout id=a5389dc4-9a1a-46b7-a1e5-53f334ca0941 wait=35ms timeout=20000ms state=ready<tt>
</tt><tt>
</tt>Started GET "/" for XXX.35.10.XXX at 2016-06-03 18:54:36 +0000<tt>
</tt>Processing by HomeController#home as HTML<tt>
</tt>Read fragment views/radiant-XXXX-XXXXX.herokuapp.com/en (6.0ms)<tt>
</tt>Completed 200 OK in 9ms (ActiveRecord: 0.0ms)<tt>
</tt>source=rack-timeout id=a5389dc4-9a1a-46b7-a1e5-53f334ca0941 wait=35ms timeout=20000ms service=21ms state=completed<tt>
</tt>at=info method=GET path="/" host=radiant-XXXX-XXXXX.herokuapp.com request_id=a5389dc4-9a1a-46b7-a1e5-53f334ca0941 fwd="XXX.35.10.XXX" dyno=web.1 connect=1ms service=38ms status=200 bytes=144608<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The times reported by the Boom tool are much larger (2 seconds?) than the processing times in the logs (10ms?). Even considering some overhead for the router and so on, still it's a big difference, I wonder if it's being queued for too long because the app is not being able to respond more of the concurrent requests.</p>
<p>The amount of requests divided by the number of concurrent connections will bring the overall performance and throughput down if you increase it too much, I wasn't able to go too much above 14 rpm with this configuration, though.</p>
<p>If you have more experience with http benchmarking and you can spot something wrong I am doing here, please let me know in the comments section below.</p>
<h3>Conclusion</h3>
<p>JRuby continues to evolve, and you might benefit if you already have a large set of Dynos of large servers around. I wouldn't recommend it for small to medium applications.</p>
<p>I've seen many orders of magnitude improvements in specific use cases (I believe it was a very high traffic API endpoint). This particular case I tested is probably not its sweet spot and changing from MRI to JRuby didn't give me too much advantage, so in this case I would recommend sticking to MRI.</p>
<p>Startup time is still an issue. There is an entry in <a href="https://github.com/jruby/jruby/wiki/Improving-startup-time">their Wiki</a> giving some recommendations, but even in the Heroku deploy I ended up having R10 errors (Boot Timeout) every once in a while for this small app.</p>
<p>I didn't try increasing the dynos to the <a href="https://blog.heroku.com/archives/2015/8/20/introducing-improved-performance-dynos">Performance tier</a> introduced last year. I would bet that JRuby would be better at those and more able to leverage the extra power of having from 2.5GB up to 14GB if you have really big traffic (on the order of thousands or tens of thousands of requests per minute). With MRI the recommendation would be using small-ish dynos (2X or at most Performance-M dynos) and scale horizontally. With JRuby you could have less dynos with larger sizes (Performance-L, for example). Again, depends on your case.</p>
<p>Don't take the benchmarks above as "facts" to generalize everywhere, they are just there to give you a notion of an specific use case of mine. Your mileage will vary, so you must test it out yourself.</p>
<p>Another use case (that I did not test) is not to just "port" an MRI app to JRuby but leverage JRuby's unique strenghts as <a href="https://blog.heroku.com/archives/2016/5/24/reactive_ruby_building_real_time_apps_with_jruby_and_ratpack">this post</a> from Heroku explains, in the case of using JRuby with Ratpack, for example.</p>
<p>All in all, JRuby is still a great project to experiment. MRI itself came a long way as well and 2.3.1 is not bad at all. Most of the time it's down to your entire architecture choices, not just the language. If you didn't try it yet, you definitely should. It "just works".</p>
<p></p>
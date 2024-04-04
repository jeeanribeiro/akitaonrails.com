---
title: "Dynamic Site as fast as a Static Generated One with Raptor"
date: "2015-05-20T14:51:00.000Z"
tags: ["passenger", "rails", "english"]
years: "2015"
---

<p></p>
<p>If you ask what's the best way to do a fast content site, many people will point you to <a href="http://jekyllrb.com">Jekyll</a> or a similar tool.</p>
<p>The concept is simple: nothing will be faster than a statically generated website. But writing a complete website statically is not viable because you will be repeating HTML code for headers, footers, sidebars, and more across all pages. But current tools such as Markdown, SASS, Sprockets (or Gulp/Grunt tasks if you're using a Javascript clone of Jekyll) will make it a whole lot easier to properly structure, organize and separate concerns on what are reusable snippets and what is just content. Then it will "compile" the content and the snippets into complete HTML pages ready to just transfer to any web server.</p>
<p>Because it's already static files, the web server doesn't need to reverse proxy to an application server or have any other kind of dynamic processing, just serve the files as it would serve any other asset. And this is <strong>Fast</strong>.</p>
<p>If you're doing a personal blog, a simple and temporary hotsite, something that you know won't change too much, and if you're a developer, this is possibly the way to go: fire up Jekyll, write your content in Markdown, compile, copy assets to S3 or Github Pages, and you're up.</p>
<p>Problem is: what if I want more from my content web site? What if I don't want to have developer tools around to compile my pages and I just want a plain simple Administrative section to edit my content? What it I want to mix a static content section with my dynamic web application (an ecommerce, social network, etc)?</p>
<p>Then I have to use Rails and Rails is very slow compared to a static web site. Or is it?</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/493/static-vs-dynamic.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/493/static-vs-dynamic.png 2x" alt="Static vs Dynamic"></p>
<p></p>
<p></p>
<p>I've fired up <a href="https://www.blitz.io/">Blitz.io</a> to a small Heroku website (Free Plan, 1 dyno) with Heroku Postgresql and <a href="https://redislabs.com/memcached-cloud">Memcached Cloud</a>. The <a href="https://github.com/akitaonrails/static_site_demo">code for this test web</a> site is on my Github account and it's a plain Rails 4.2 project with Active Admin and all the perks of having a Rails based code structure.</p>
<p>So, the graphs on the left side of the image is Blitz.io hitting hard on the poor small Heroku dyno more than 7,000 times in 60 seconds and getting a response of 12ms in average for the <tt>404.html</tt> static page. This is quite good and it's the fastest you will get from a single 512Mb web dyno. More importantly: it keeps quite consistent even increasing the number of concurrent simulated users hitting the same page without ever timing out or erroring out.</p>
<p>Now, the surprise: the graphs on the right side is content generated in Rails and served through Raptor (Passenger 5). It's the same Blitz.io default configuration running almost 7,300 requests within 60 seconds, increasing from 1 up to 250 concurrent simulated users and receiving no timeouts or errors with an average response time of around <strong>20ms</strong>!</p>
<p>That's not too shabby! More importantly is the similarity between the 2 sets of graphs: it means that response time does not increase with the added concurrent users and more simultaneous requests over time, so it means that this setup scales!</p>
<p>Yes, Rails can Scale!</p>
<h2>How is it done?</h2>
<p>So, this is obviously a very specific situation: replacing a statically generated website with a dynamic web app that outputs static content. There are different moving parts to consider.</p>
<p>The very first trick to consider: generate proper Etags:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
<a href="#n8" name="n8">8</a>
<a href="#n9" name="n9">9</a>
<strong><a href="#n10" name="n10">10</a></strong>
<a href="#n11" name="n11">11</a>
<a href="#n12" name="n12">12</a>
<a href="#n13" name="n13">13</a>
<a href="#n14" name="n14">14</a>
<a href="#n15" name="n15">15</a>
<a href="#n16" name="n16">16</a>
<a href="#n17" name="n17">17</a>
<a href="#n18" name="n18">18</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PagesController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span>
    <span style="color:#33B">@pages</span> = fetch_resources
    <span style="color:#080;font-weight:bold">if</span> stale?(resources_etag(<span style="color:#33B">@pages</span>))
      respond_to <span style="color:#080;font-weight:bold">do</span> |wants|
        wants.html
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
    <span style="color:#33B">@page</span> = fetch_resource(params[<span style="color:#A60">:id</span>])
    fresh_when <span style="color:#606">last_modified</span>: <span style="color:#33B">@page</span>.updated_at.utc,
      <span style="color:#606">etag</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>deploy_id<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span><span style="color:#33B">@page</span>.cache_key<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>,
      <span style="color:#606">public</span>: <span style="color:#069">true</span>
  <span style="color:#080;font-weight:bold">end</span>
...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is what's done in the <tt>PagesController</tt>. <a href="https://guides.rubyonrails.org/caching_with_rails.html#conditional-get-support">Learn more</a> about the <tt>#stale?</tt> and <tt>#fresh_when</tt> methods that set proper <tt>Cache-Control</tt>, <tt>Last-Modified</tt>, <tt>Age</tt> and <tt>Etag</tt> HTTP headers.</p>
<p>The idea is simple: if the generated content does not change between requests, the application does not have to process all the views and helpers and models to output the very same HTML again. Instead, it will simply stop processing at that point and return a simple <tt>HTTP 304 Not Modified</tt> header to the browser.</p>
<p>Now, even if this works, each user will have to receive a complete HTTP 200 response with the generated HTML. So if 250 users connect, at least 250 HTML responses will have to be generated so the next request will get only the HTTP 304 response. That's where <tt>Passenger 5 (a.k.a. Raptor)</tt> kicks in!</p>
<p>It has an internal small cache to keep tabs on the content and cache control headers. So, after the 1st user requests the page, it gets cached. The next users and requests will get the stale content from the cache instead of having Rails regenerate it. In practice it's almost as if Passenger is serving a static file which is why performance and throughput behaviors are quite similar in the graphs.</p>
<p>There is another problem: to check if a content is fresh or not, it needs to check the source content itself: the database data. And fetching from the database to check it is slow and doesn't scale as well.</p>
<p>One workaround is to cache this information in a faster storage, such as Memcached:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
<a href="#n8" name="n8">8</a>
<a href="#n9" name="n9">9</a>
<strong><a href="#n10" name="n10">10</a></strong>
<a href="#n11" name="n11">11</a>
<a href="#n12" name="n12">12</a>
<a href="#n13" name="n13">13</a>
<a href="#n14" name="n14">14</a>
<a href="#n15" name="n15">15</a>
<a href="#n16" name="n16">16</a>
<a href="#n17" name="n17">17</a>
<a href="#n18" name="n18">18</a>
<a href="#n19" name="n19">19</a>
<strong><a href="#n20" name="n20">20</a></strong>
<a href="#n21" name="n21">21</a>
<a href="#n22" name="n22">22</a>
<a href="#n23" name="n23">23</a>
<a href="#n24" name="n24">24</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PagesController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span>
...
  private
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch_resources</span>
    cache_key = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>deploy_id<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/pages/limit/10</span><span style="color:#710">"</span></span>
    <span style="color:#036;font-weight:bold">Rails</span>.cache.fetch(cache_key, <span style="color:#606">expires_in</span>: <span style="color:#00D">1</span>.day) { 
          <span style="color:#036;font-weight:bold">Page</span>.recent.limit(<span style="color:#00D">10</span>)
        }
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">resources_etag</span>(pages)
    recent_updated_at = pages.pluck(<span style="color:#A60">:updated_at</span>).max || <span style="color:#036;font-weight:bold">Time</span>.current
    etag = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>deploy_id<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/pages_index/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>recent_updated_at.iso8601<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
    { <span style="color:#606">last_modified</span>: recent_updated_at.utc, <span style="color:#606">etag</span>: etag, <span style="color:#606">public</span>: <span style="color:#069">true</span> }
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch_resource</span>(id)
    cache_key = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>deploy_id<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/page/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>id<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
    <span style="color:#036;font-weight:bold">Rails</span>.cache.fetch(cache_key, <span style="color:#606">expires_in</span>: <span style="color:#00D">1</span>.hour) {
          <span style="color:#036;font-weight:bold">Page</span>.friendly.find(id)
        }
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is what those methods do in the <tt>PagesController</tt>. The <tt>index</tt> action is trickier as it's just a list of pages. I can cache the 10 most recent items. I can generate the etag based on the item that was most recently updated. I can combine those two. It depends on how often you change your content (most static web sites don't add new content all the time, if you're a heavily updated website you can decrease the expiration time for 1 hour instead of 1 day, and so on).</p>
<p>For the <tt>show</tt> action it's more straightforward as I can just cache the single resource for an hour or any range of time and that's it. Again, it depends on how often you change this kind of content.</p>
<p>Now, the controller won't hit the database all the time. It will hit Memcached instead. Because Memcached Cloud or Memcachier are external services, it's out of the Heroku dyno premises so it will have network overhead that can go all the way to 30ms or more. Your mileage may vary.</p>
<p>After the content is fetched from the cache, it generates the ETags to compare with what the client sent through the <tt>If-None-Match</tt> header. Notice that I'm customizing the etag with something called <tt>deploy_id</tt>. This is a method defined in the <tt>ApplicationController</tt> like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
<a href="#n8" name="n8">8</a>
<a href="#n9" name="n9">9</a>
<strong><a href="#n10" name="n10">10</a></strong>
<a href="#n11" name="n11">11</a>
<a href="#n12" name="n12">12</a>
<a href="#n13" name="n13">13</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">ApplicationController</span> &lt; <span style="color:#036;font-weight:bold">ActionController</span>::<span style="color:#036;font-weight:bold">Base</span>
  protect_from_forgery <span style="color:#606">with</span>: <span style="color:#A60">:exception</span>
  private
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">deploy_id</span>
      <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">Rails</span>.env.production?
        <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">DEPLOY_ID</span><span style="color:#710">'</span></span>] || <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">0</span><span style="color:#710">'</span></span>
      <span style="color:#080;font-weight:bold">else</span>
        rand
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's an environment variable. Because the Etag only checks if the content changed, what if I change my stylesheets or anything about the layout or HTML structure? Then the client won't receive this change. Because I only make those changes through a new deployment to Heroku I can also manually change it (or add a Capistrano task, or something similar for automation). Then all Etags will change at once, forcing Rails to generate the new pages and cache them again. This is the fastest way if you want to invalidate all the cache at once.</p>
<p>The important part is for Passenger to receive a <tt>Cache-Control: public</tt> to kick in its internal cache. Beware that you can't cache everything, only what's publicly visible. If you have authenticated areas, you don't want to cache those as the content will probably be different for different users. In that case you will need to know about Fragment Caching and other techniques to cache snippets within the logged in pages.</p>
<p>The best thing is that you can rely on Rails alone to serve both blazing fast public pages that don't need a separated pipeline to generate static files and the usual dynamic stuff you love to do.</p>
<h2>Extras</h2>
<p>I won't add details here because the code I made available on Github already shows how it's done but this is the extra stuff I'd like to highlight:</p>
<ul>
  <li><a href="https://activeadmin.info">ActiveAdmin</a> is the best administration engine out there for your projects, use it.</li>
  <li><a href="https://bourbon.io">Bourbon</a> together with Neat and Bitters is the best option to fast and clean stylesheets. Avoid Bootstrap if you can.</li>
  <li><a href="https://github.com/norman/friendly_id">FriendlyId</a> is still the best way to generate slugs for your resources, don't write yet another slug generator from scratch.</li>
  <li><a href="https://github.com/vmg/redcarpet">Redcarpet</a> is still the best Markdown processor.</li>
  <li><a href="https://github.com/jneen/rouge">Rouge</a> is the surprise: it's far better than the good old CodeRay or Python's Pygments for code syntax highlighting. It's compatible with Pygments CSS themes and it's easily pluggable with Redcarpet, making it a nice combo.</li>
</ul>
<h2>Conclusion</h2>
<p>Making a fast web site is a matter of understanding the basics of the HTTP protocol and taking advantage of web servers' ability to deliver cached content. The more you cache, the better!</p>
<p>There are more to come from the Passenger camp, <a href="https://blog.phusion.nl/2015/01/06/researching-http-caching-optimization/">they're researching</a> ways to cache content based on user's profiles. Serving speficic cached content for anonymous users and different content for Administrators, for example. You should check it out and contribute if you can.</p>
<p>You can also serve a generic cached page through this method and use Javascript to fetch small snippets to fill in specific user content as well, such as Notification badges or something similar, so you can still take advantage of a full page cache and have some user-specific dynamic content.</p>
<p>And before someone asks, yes I tried Puma with Rack::Cache in the Web App. In the Blitz.io test, it blows up fast, timing out and erroring out all request after a while as its request queue blow up. Seems like the time to fetch from Memcached over the network is too much for it's queues to hold and getting all the way down to Rack::Cache was not fast enough as well. I've replaced Puma for Raptor and took off Rack::Cache and the results were dramatically better in this particular scenario. But by all means, more tests and data would be welcome.</p>
<p>Now it's up to your creativity: once you get this concept you can bend it to your needs. Do you have any other suggestion or technique? Comment down below and share! And as the example site code is available I'll be more than happy to accept Pull Requests to improve it.</p>
<p></p>
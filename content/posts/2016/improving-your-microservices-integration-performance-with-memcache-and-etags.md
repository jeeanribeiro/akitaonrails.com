---
title: "Improving your Microservices Integration Performance with Memcache and ETAGs"
date: "2016-03-23T17:46:00.000Z"
tags: ["rails", "otimization", "performance", "heroku", "memcached"]
years: "2016"
---

<p></p>
<p>Everybody is into microservices. There is no way around it. In the Rails world we are well equipped to satisfy any trending Javascript Framework's crave for API consumption.</p>
<p>In summary, most people are just exposing their contents through simple JSON API endpoints and consuming them from other microservices through simple HTTP GETs. The more microservices they add to the chain, the longer the last endpoint takes to return. There are many techniques to improve this situation, but I want to show just a simple one that can solve many common situations without too much hassle.</p>
<p>First of all, if you're dealing with caching, never try to expire cache entries. The most important thing to learn about caching is how to generate proper cache keys. Do it right and most problems with caching are gone.</p>
<p>Second, if you're using HTTP, try to use everything you can from it, instead of reinventing the wheel.</p>
<p>The "TL;DR" version is: make your APIs return proper ETAGs and handle "If-None-Match" headers properly, return the correct 304 status code instead of full blown 200 with full content body in the responses everytime. And in the consumer end, cache the ETAG with the corresponding response body and use it from cache when you receive 304s. You will save at least expensive rendering time in the consumed end and slow bandwidth from the consumer end. In the end you should be able to at least be 100% faster, or more, with just a few tweaks.</p>
<p></p>
<p></p>
<h3>The Example Applications</h3>
<p>In a very very contrived example we could have a Rails API controller like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">## 1st application</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Api::ProductsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    <span style="color:#33B">@products</span> = <span style="color:#036;font-weight:bold">Product</span>.page (params[<span style="color:#A60">:page</span>] || <span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt>    render <span style="color:#808">json</span>: [<span style="color:#808">num_pages</span>: <span style="color:#33B">@products</span>.num_pages, <span style="color:#808">products</span>: <span style="color:#33B">@products</span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>For the purposes of this contrived post example, we load it up on localhost port <strong>3001</strong>. Now, whenever we call "https://localhost:3001/api/products?page=1" the API server dumps something like this in the log:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=1" for 127.0.0.1 at 2016-03-23 13:29:34 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"1"}<tt>
</tt>   (0.3ms)  SELECT COUNT(*) FROM "products"<tt>
</tt>  Product Load (0.9ms)  SELECT  "products".* FROM "products" LIMIT 100 OFFSET 0<tt>
</tt>Completed 200 OK in 26ms (Views: 23.0ms | ActiveRecord: 1.2ms)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In summary, it's taking around <strong>26ms</strong> to send back a JSON with the first page of products of this application. Not too bad.</p>
<p>Then we can create another Rails API application that consumes this first one. Something also very contrived and stupid like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># 2nd application</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Api::ProductsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    <span style="color:#888"># never, ever, hard code hostnames like this, use dotenv-rails or secrets.yml</span><tt>
</tt>    url = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://localhost:3001/api/products?page=?</span><span style="color:#710">"</span></span> % (params[<span style="color:#A60">:page</span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1</span><span style="color:#710">"</span></span>)<tt>
</tt>    json = <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>.get_response(URI(url)).body<tt>
</tt><tt>
</tt>    response.headers[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Content-Type</span><span style="color:#710">"</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">application/json</span><span style="color:#710">"</span></span><tt>
</tt>    render <span style="color:#808">plain</span>: json<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We load this other app in localhost port <strong>3000</strong> and when we call "https://localhost:3000/api/products?page=1" the server dumps the following log:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=1" for 127.0.0.1 at 2016-03-23 13:31:59 -0300<tt>
</tt>Processing by Api::ProductsController#index as HTML<tt>
</tt>  Parameters: {"page"=&gt;"1"}<tt>
</tt>  Rendered text template (0.0ms)<tt>
</tt>Completed 200 OK in 51ms (Views: 7.1ms | ActiveRecord: 0.0ms)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, this second application is taking twice the time compared to the first one. We can assume that part of those 51ms are the 26ms of the first application.</p>
<p>The more APIs we add on top of each other, the more time the entire flow will take. 26ms for the first, another 25ms for the second, and so on.</p>
<p>There are many things we could do. But I'd argue that we should start simple: by actually using a bit more of the HTTP protocol.</p>
<h3>Sending proper ETAGs and handling "If-None-Match"</h3>
<p>In a nutshell, we can tag any HTTP response with an ETAG, an identifier for the content of the response. If the ETAG is the same, we can assume the content hasn't changed. Web browsers receive the ETAGs and send them back if we choose to refresh the content as a "If-None-Match" header. When a web server receives this header it compares against the ETAG of the response and doesn't send back any content, just a "304 Not Modified" HTTP header, which is much, much lighter and faster to transport back.</p>
<p>An ETAG can be as complicated as an entire SHA256 hexdigest of the entire response content or as simple as just the "updated_at" timestamp if this indicates that the record has changed (in a "show" controller action, for example). It must be a digest that represents the content and it must change if the content changes.</p>
<p>Rails has support for ETAGs for a long time in the <a href="https://api.rubyonrails.org/classes/ActionController/ConditionalGet.html">ActionController::ConditionalGet</a> API.</p>
<p>In our contrived example, the 1st application on port 3001 fetches a page of ActiveRecord objects and send back an array represented in JSON format. If we choose to digest the final content we would have to let ActionView do it's job, but it is by far the most expensive operation so we want to avoid it.</p>
<p>One thing that we could do is just check the "updated_at" fields of all the records and see if they changed. If any one of them changed, we would need to re-render everything and send a new ETAG and a new response body. So the code could be like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Api::ProductsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  layout <span style="color:#038;font-weight:bold">false</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    <span style="color:#33B">@products</span> = <span style="color:#036;font-weight:bold">Product</span>.page (params[<span style="color:#A60">:page</span>] || <span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> stale?(freshness <span style="color:#33B">@products</span>)<tt>
</tt>      render <span style="color:#808">json</span>: [<span style="color:#808">num_pages</span>: <span style="color:#33B">@products</span>.num_pages, <span style="color:#808">products</span>: <span style="color:#33B">@products</span>]<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt>  private<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">freshness</span>(collection)<tt>
</tt>    dates = collection.map(&amp;<span style="color:#A60">:updated_at</span>).sort<tt>
</tt>    etag = dates.map(&amp;<span style="color:#A60">:to_i</span>).reduce(&amp;<span style="color:#A60">:+</span>)<tt>
</tt>    {<span style="color:#808">etag</span>: <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">MD5</span>.hexdigest(etag.to_s), <span style="color:#808">last_modified</span>: dates.last, <span style="color:#808">public</span>: <span style="color:#038;font-weight:bold">true</span>}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, when we try to "curl -I https://localhost:3001/api/products\?page\=1" we will see the following headers:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">HTTP/1.1 200 OK <tt>
</tt>X-Frame-Options: SAMEORIGIN<tt>
</tt>X-Xss-Protection: 1; mode=block<tt>
</tt>X-Content-Type-Options: nosniff<tt>
</tt>Etag: "ccf372c24cd259d0943fa3dc99830b10"<tt>
</tt>Last-Modified: Wed, 23 Mar 2016 16:25:53 GMT<tt>
</tt>Content-Type: application/json; charset=utf-8<tt>
</tt>Cache-Control: public<tt>
</tt>X-Request-Id: 601f22bc-72a9-4960-97cb-c30a0b56dbf4<tt>
</tt>X-Runtime: 0.053529<tt>
</tt>Server: WEBrick/1.3.1 (Ruby/2.3.0/2015-12-25)<tt>
</tt>Date: Wed, 23 Mar 2016 17:00:13 GMT<tt>
</tt>Content-Length: 0<tt>
</tt>Connection: Keep-Alive<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Great! We have an ETAG that uniquely represents this page of products. Now we can go one step further and add the following:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># Gemfile</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">dalli</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-cache</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># config/environments/[development|production].rb</span><tt>
</tt>...<tt>
</tt>config.cache_store = <span style="color:#A60">:dalli_store</span><tt>
</tt>client = <span style="color:#036;font-weight:bold">Dalli</span>::<span style="color:#036;font-weight:bold">Client</span>.new<tt>
</tt>config.action_dispatch.rack_cache = {<tt>
</tt>  <span style="color:#A60">:metastore</span>    =&gt; client,<tt>
</tt>  <span style="color:#A60">:entitystore</span>  =&gt; client<tt>
</tt>}<tt>
</tt>config.static_cache_control = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">public, max-age=2592000</span><span style="color:#710">"</span></span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This configuration is assuming that we have Memcached installed and running in the same localhost machine (our development environment), but in production you can follow this <a href="https://devcenter.heroku.com/articles/rack-cache-memcached-rails31">good documentation from Heroku</a>.</p>
<p>Now, our 1st application has an internal HTTP cache, with the same role as something more advanced such as Varnish in front of it. It will cache all HTTP 200 responses from the application, together with the ETAGs. Whenever a new call comes for the same URI, it will check the cache first, and if the application sends back the same ETAG, it will send the content back from the cache.</p>
<p>So if we call the above "curl" command multiple times, we will see this from the Rails server log:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=1" for 127.0.0.1 at 2016-03-23 14:05:16 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"1"}<tt>
</tt>  Product Load (0.8ms)  SELECT  "products".* FROM "products" LIMIT 100 OFFSET 0<tt>
</tt>  Couldn't find template for digesting: products/index<tt>
</tt>   (1.0ms)  SELECT COUNT(*) FROM "products"<tt>
</tt>Completed 200 OK in 31ms (Views: 16.3ms | ActiveRecord: 1.8ms)<tt>
</tt>cache: [HEAD /api/products?page=1] miss, store<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice the last line: it says that it tried to find the returning ETAG in the cache and it "missed", so it "stored" the new content. Now, if we run the came "curl" command again, we will see this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=1" for 127.0.0.1 at 2016-03-23 14:05:59 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"1"}<tt>
</tt>  Product Load (0.5ms)  SELECT  "products".* FROM "products" LIMIT 100 OFFSET 0<tt>
</tt>  Couldn't find template for digesting: products/index<tt>
</tt>Completed 304 Not Modified in 12ms (ActiveRecord: 0.5ms)<tt>
</tt>cache: [HEAD /api/products?page=1] stale, valid, store<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The simple curl command is not sending the "If-None-Match" header, so it expects to receive the full response body. But because we have Rack Cache it is adding the "If-None-Match" ETAG digest from the cache to the request before hitting the Rails app. The Rails app now compares the received "If-None-Match" digest through the "stale?" methods with the ETAG it just computed and because they match, it just send an empty body response with the status code of 304. Rack Cache receives the 304 and fetches the cached JSON from Memcached and changes the HTTP response from the 304 to a normal 200 with the full body, which is what Curl can receive.</p>
<p>Because we are skipping the expensive ActionView rendering, the response time went from the previous 26ms to around 12ms: we are now <strong>twice</strong> as fast!</p>
<h3>Consuming APIs with ETAGs</h3>
<p>But we can go one step further. If we change nothing about the 2nd application, it will keep receiving just HTTP 200 with full body responses from Rack Cache of the 1st application. Let's see the code again</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># 2nd application</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Api::ProductsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    <span style="color:#888"># never, ever, hard code hostnames like this, use dotenv-rails or secrets.yml</span><tt>
</tt>    url = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://localhost:3001/api/products?page=?</span><span style="color:#710">"</span></span> % (params[<span style="color:#A60">:page</span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1</span><span style="color:#710">"</span></span>)<tt>
</tt>    json = <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>.get_response(URI(url)).body<tt>
</tt><tt>
</tt>    response.headers[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Content-Type</span><span style="color:#710">"</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">application/json</span><span style="color:#710">"</span></span><tt>
</tt>    render <span style="color:#808">plain</span>: json<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We can do better. How about the following:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># 2nd application - upgrade!</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Api::ProductsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    page = params[<span style="color:#A60">:page</span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1</span><span style="color:#710">"</span></span><tt>
</tt>    url = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://localhost:3001/api/products?page=?</span><span style="color:#710">"</span></span> % page<tt>
</tt>    <span style="color:#888"># 1 - fetch the ETAG for the URL</span><tt>
</tt>    etag = <span style="color:#036;font-weight:bold">Rails</span>.cache.fetch(url)<tt>
</tt>    <span style="color:#888"># 2 - fetch from external API or fetch from internal cache</span><tt>
</tt>    json = fetch_with_etag(url, etag)<tt>
</tt><tt>
</tt>    response.headers[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Content-Type</span><span style="color:#710">"</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">application/json</span><span style="color:#710">"</span></span><tt>
</tt>    render <span style="color:#808">plain</span>: json<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt>  private<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch_with_etag</span>(url, etag)<tt>
</tt>    uri = URI(url)<tt>
</tt><tt>
</tt>    req = <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>::<span style="color:#036;font-weight:bold">Get</span>.new(uri)<tt>
</tt>    <span style="color:#888"># 3 - add the important If-None-Match header</span><tt>
</tt>    req[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">If-None-Match</span><span style="color:#710">'</span></span>] = etag <span style="color:#080;font-weight:bold">if</span> etag<tt>
</tt><tt>
</tt>    res = <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>.start(uri.hostname, uri.port) {|http|<tt>
</tt>      http.request(req)<tt>
</tt>    }<tt>
</tt><tt>
</tt>    etag = res[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">ETAG</span><span style="color:#710">'</span></span>]<tt>
</tt>    etag = etag[<span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">-2</span>] <span style="color:#080;font-weight:bold">if</span> etag.present?<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> res.is_a?(<span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTPNotModified</span>)<tt>
</tt>      <span style="color:#888"># 4 - if got a 304, then we already have the content in the internal cache</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rails</span>.cache.read(etag)<tt>
</tt>    <span style="color:#080;font-weight:bold">elsif</span> res.is_a?(<span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTPSuccess</span>)<tt>
</tt>      <span style="color:#888"># 5 - if we got a 200 it's new content to store in internal cache before returning</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rails</span>.cache.write(url, etag)<tt>
</tt>      <span style="color:#036;font-weight:bold">Rails</span>.cache.write(etag, res.body)<tt>
</tt>      res.body<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">{}</span><span style="color:#710">"</span></span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I know, feels overwhealming, but it's actually quite simple. Let's go over it step-by-step:</p>
<ol>
  <li>
    <p>First we see if we already have an ETAG associated to the URL we want to fetch (be aware of query parameters!)</p>
  </li>
  <li>
    <p>Now we call the separated "fetch_with_etag" method</p>
  </li>
  <li>
    <p>This is all boilerplate "Net::HTTP" setup, but the important piece is that we add the "If-None-Match" header if we found an ETAG for the URL in the cache.</p>
  </li>
  <li>
    <p>After we make the external call we can have 2 responses. The first being the very very short, body-less, header-only, "304 Not Modified". In this case, it means that we already have the full content in the internal cache and it is still valid, so we use it.</p>
  </li>
  <li>
    <p>In case we receive the normal HTTP "200" status code, we either didn't send any ETAG or the one we sent was invalidated and a new ETAG and content body was returned, so we must update them in our internal cache before exiting.</p>
  </li>
</ol>
<p>Now, the first time we call "curl https://localhost:3000/api/products\?page\=1" for the 2nd application endpoint we will see this log:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=1" for 127.0.0.1 at 2016-03-23 14:14:05 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"1"}<tt>
</tt>  Rendered text template (0.0ms)<tt>
</tt>Completed 200 OK in 62ms (Views: 5.6ms | ActiveRecord: 0.0ms)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Caches are cold, it is taking the same "around 50ms" like we had before, in this case, it's more like 62ms.</p>
<p>Just to recap, this call to the 2nd application made it call the 1st application API, which shows the following it its log:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=?" for 127.0.0.1 at 2016-03-23 14:14:05 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"?"}<tt>
</tt>/"32b82ebbd99854ea2ca0d49ff4a7c07c<tt>
</tt>  Product Load (0.9ms)  SELECT  "products".* FROM "products" LIMIT 100 OFFSET 0<tt>
</tt>  Couldn't find template for digesting: products/index<tt>
</tt>   (1.2ms)  SELECT COUNT(*) FROM "products"<tt>
</tt>Completed 200 OK in 37ms (Views: 21.5ms | ActiveRecord: 2.2ms)<tt>
</tt>cache: [GET /api/products?page=?] miss, store<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Cache miss, new content stored!</p>
<p>Now, we call "curl" against the same URL for the 2nd application again and we now see what we wanted in the log:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=1" for 127.0.0.1 at 2016-03-23 14:14:10 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"1"}<tt>
</tt>  Rendered text template (0.0ms)<tt>
</tt>Completed 200 OK in 24ms (Views: 0.3ms | ActiveRecord: 0.0ms)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Down from 62ms to 24ms!! And in the 1st application log we see:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started GET "/api/products?page=?" for 127.0.0.1 at 2016-03-23 14:14:10 -0300<tt>
</tt>Processing by Api::ProductsController#index as */*<tt>
</tt>  Parameters: {"page"=&gt;"?"}<tt>
</tt>"ccf372c24cd259d0943fa3dc99830b10", ccf372c24cd259d0943fa3dc99830b10<tt>
</tt>  Product Load (1.2ms)  SELECT  "products".* FROM "products" LIMIT 100 OFFSET 0<tt>
</tt>  Couldn't find template for digesting: products/index<tt>
</tt>Completed 304 Not Modified in 12ms (ActiveRecord: 1.2ms)<tt>
</tt>cache: [GET /api/products?page=?] stale, valid, store<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A cache hit! Content is stale and valid, so return just 304, the 2nd application acknowledges and fetch the still valid content from its own cache and return to Curl.</p>
<h3>Conclusion</h3>
<p>If you remove ETAGs from the 1st application, the 2nd one will not break and vice-versa, because it's optional. If "ETAG" and "If-None-Match" headers are present in received HTTP response, we can use, otherwise they will work as before.</p>
<p>If the 2nd application is itself another API you should also add ETAGs for it, and so on. In this example we didn't, just because I wanted to simplify the scenario. But instead of being just a simple one-to-one proxy, it could be one of those "porcelain" APIs that fetch data from several other smaller microservices, compile down in a single structure and return it. You should create ETAGs that could be the returning ETAGs from all the other microservices digested together in a single ETAG, for example. Because you're just receiving headers and fetching their content from an internal cache, it's quite cheap. Something like this pseudo-code:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>  url1 = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://somehost1.foo/some_endpoint/1</span><span style="color:#710">"</span></span><tt>
</tt>  url2 = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://somehost1.foo/some_endpoint/2</span><span style="color:#710">"</span></span><tt>
</tt>  etag1 = etag_from(url1)<tt>
</tt>  etag2 = etag_from(url2)<tt>
</tt>  etag = <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">MD5</span>.hexdigest(etag1 + etag2)<tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> stale?(<span style="color:#808">etag</span>: etag, <span style="color:#808">public</span>: <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt>    body1 = <span style="color:#036;font-weight:bold">JSON</span>.parse fetch_from(url1)<tt>
</tt>    body2 = <span style="color:#036;font-weight:bold">JSON</span>.parse fetch_from(url2)<tt>
</tt>    result = do_some_processing(body1, body2)<tt>
</tt>    render <span style="color:#808">json</span>: result.to_json<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Another thing: you can add any vanilla HTTP Cache between your microservices, to add authorization, security, or just plain extra caching, it's just HTTP with proper headers. But the more you exchange "304" between your services, the less processing and the less bandwidth you're spending. It should be noticeably efficient in most cases. But again, it's not always cheap or trivial to generate the cache keys/ETAGs to begin with, so this is the point to take more care.</p>
<p>And if you're creating heavy Javascript apps that also consume those APIs, I "believe" the Ajax calls properly cache HTTP content and send back the correct "If-None-Match" and in case they receive 304s, your application should get the normal "success" triggers. I didn't test this when I was writing this post but I think this is the case indeed. So you should automatically get better performance in your front-end application for free if you add proper ETAGs in your APIs.</p>
<p>This is particularly useful for APIs that return data that don't change too often. If it changes every second, or every minute, you should not see too much gains. But if it's something like this example: products lists that only change once every day or every week, or ZIP code lists, or Previous Orders in an e-commerce. Any data that change infrequently is a good candidate. And the larger the dataset, the larger the benefits you will see (if it's a megabyte long listing, for example). As usual, this is also no Silver Bullet, but in this case it is not so much work to add ETAGs and there are near to zero side-effects, so why not?</p>
<p>ETAG is just one of many other HTTP feature you should be using, CORS is another one (Research <a href="https://github.com/cyu/rack-cors">Rack Cors</a>).</p>
<p>If you're from Brazil, you should watch Nando Vieira's entire course on the broad subject of <a href="https://howtocode.com.br/cursos/rails-caching">Rails Caching</a>.</p>
<p>To be honest, I'm not sure how effective this technique can actually be in all kinds of scenarios so I am very interested in hearing your feedback in case you use something like this in your applications.</p>
<p></p>
---
title: "Ex Pusher Lite - Part 3 - A Complete Solution"
date: "2016-12-30T19:38:00.000Z"
tags: ["elixir", "phoenix", "websockets"]
years: "2016"
---

<p></p>
<p>It's been over a year since I wrote the 2 pieces about my "Ex Pusher Lite" concept. The code from a year ago is already obsolete as I was still just learning my way through both Elixir and Phoenix.</p>
<p>I've published an article about <a href="http://www.akitaonrails.com/2016/12/06/coherence-and-exadmin-devise-and-activeadmin-for-phoenix">ExAdmin and Coherence</a> and another on <a href="http://www.akitaonrails.com/2016/12/23/elixir-phoenix-app-deployed-into-a-load-balanced-digitalocean-setup">Deploying Elixir to DigitalOcean</a> this month.</p>
<p>The idea is very simple, it is a homage to <a href="https://pusher.com/">Pusher</a>. If you used Pusher before, this is very similar (albeit way less feature complete, of course).</p>
<p>I built an entire solution inspired by Pusher, using the Phoenix framework, deployed to Digital Ocean and you can test it out right now, just sign up at <a href="http://expusherlite.cm42.io">expusherlite.cm42.io</a>.</p>
<p>Once you sign up, you will have a secret token (don't disclose that, of course) and you will be below an Organization. Then you can go on and create Applications within that Organization. Each Application will have a unique token to identify it.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/576/expusherlite_cm42_io_registrations.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/576/expusherlite_cm42_io_registrations.png 2x" alt="dashboard"></p>
<p></p>
<p></p>
<p>Now, let's say you want to create a Rails application with a Chat feature. Any version of Rails, you don't need 5.0 and you don't need ActionCable.</p>
<p>First off, let's configure <code>config/secrets.yml</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">development:<tt>
</tt>  secret_key_base: b9a1...e7aa<tt>
</tt>  pusher_host: "expusherlite.cm42.io"<tt>
</tt>  org_id: acme-inc<tt>
</tt>  app_key: 0221...f193<tt>
</tt>  secret_token: 4036...f193<tt>
</tt>...<tt>
</tt>production:<tt>
</tt>  secret_key_base: &lt;%= ENV["SECRET_KEY_BASE"] %&gt;<tt>
</tt>  pusher_host: &lt;%= ENV['PUSHER_LITE_HOST'] %&gt;<tt>
</tt>  org_id: &lt;%= ENV['PUSHER_LITE_ORGANIZATION'] %&gt;<tt>
</tt>  app_key: &lt;%= ENV["PUSHER_LITE_APP_KEY"] %&gt;<tt>
</tt>  secret_token: &lt;%= ENV["PUSHER_LITE_SECRET_TOKEN"] %&gt;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Replace the <code>pusher_host</code>, <code>org_id</code>, <code>app_key</code>, and <code>secret_token</code> for the ones you created before.</p>
<p>Now I want to add a <code>PageController</code>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">net/http</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">uri</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PageController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    uri = <span style="color:#036;font-weight:bold">URI</span>.parse(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_host<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/api/sessions</span><span style="color:#710">"</span></span>)<tt>
</tt>    response = <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>.post_form(uri, {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">token</span><span style="color:#710">"</span></span> =&gt; <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.secret_token})<tt>
</tt>    <span style="color:#33B">@guardian_token</span> = <span style="color:#036;font-weight:bold">JSON</span>.parse(response.body)[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">jwt</span><span style="color:#710">"</span></span>]<tt>
</tt>    <span style="color:#036;font-weight:bold">Rails</span>.logger.info <span style="color:#33B">@guardian_token</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(If you're connecting to my online server, you must use SSL, so change the URL above for "https")</p>
<p>What this piece does is submit the secret token in the server-side, to my service, to get a JSON Web Token (JWT) back. Now you can pass this JWT to the front-end to enable authentication.</p>
<p>In the front-end we can have this simple <code>app/views/page/index.html.erb</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">&lt;h1&gt;Ex Pusher Lite - Rails Integration Example&lt;/h1&gt;<tt>
</tt><tt>
</tt>&lt;script type="text/javascript" charset="utf-8"&gt;<tt>
</tt>  window.guardian_token = "&lt;%= @guardian_token %&gt;";<tt>
</tt>  window.org_id = "&lt;%= Rails.application.secrets.org_id %&gt;"<tt>
</tt>  window.app_key = "&lt;%= Rails.application.secrets.app_key %&gt;";<tt>
</tt>  window.pusher_host = "&lt;%= Rails.application.secrets.pusher_host %&gt;";<tt>
</tt>&lt;/script&gt;<tt>
</tt><tt>
</tt>&lt;div id="chat" class="fixedContainer"&gt;<tt>
</tt>&lt;/div&gt;<tt>
</tt><tt>
</tt>&lt;input type="text" name="name" id="name" value="" placeholder="Name"/&gt;<tt>
</tt>&lt;input type="text" name="message" id="message" value="" placeholder="Message"/&gt;<tt>
</tt>&lt;input type="checkbox" name="channel" id="channel" value="api"/&gt;<tt>
</tt>&lt;label for="channel"&gt;send through API&lt;/label&gt;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Super simple, we can tweak the CSS (<code>app/assets/stylesheets/application.css</code>) just to make it look nicer:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt><span style="color:#B06;font-weight:bold">.fixedContainer</span> {<tt>
</tt>  <span style="color:#808">height</span>: <span style="color:#60E;font-weight:bold">250px</span>;<tt>
</tt>  <span style="color:#808">width</span>: <span style="color:#60E;font-weight:bold">100%</span>;<tt>
</tt>  <span style="color:#808">padding</span>:<span style="color:#60E;font-weight:bold">3px</span>;<tt>
</tt>  <span style="color:#808">border</span>: <span style="color:#60E;font-weight:bold">1px</span> <span style="color:#088">solid</span> <span style="color:#088">black</span>;<tt>
</tt>  <span style="color:#808">margin</span>: <span style="color:#60E;font-weight:bold">5px</span>;<tt>
</tt>  <span style="color:#808">overflow</span>: <span style="color:#088">auto</span>;<tt>
</tt>}<tt>
</tt><tt>
</tt><span style="color:#339;font-weight:bold">body</span> {<tt>
</tt>  <span style="color:#808">font-family</span>: <span style="color:#088">Helvetica</span>, <span style="color:#088">Arial</span><tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, we need to load the main Javascript from the ExPusherLite server, so edit the layout at <code>app/views/layouts/application.html.erb</code> and add this line right after the closing <code>&lt;/body&gt;</code> tag:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#070">&lt;script</span> <span style="color:#007">src</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://&lt;%= Rails.application.secrets.pusher_host %</span></span><span style="color:#F00;background-color:#FAA">&gt;</span>/js/pusher.js"<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/script&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we can now use this Javascript in the <code>app/assets/javascripts/application.js</code> to hook everything up. This is the relevant bit:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#369;font-weight:bold">$</span>(document).ready(<span style="color:#080;font-weight:bold">function</span>() {<tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> PusherLite = require(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_lite</span><span style="color:#710">"</span></span>).<span style="color:#080;font-weight:bold">default</span>;<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> pusher = <span style="color:#080;font-weight:bold">new</span> PusherLite(window.app_key, {<tt>
</tt>    <span style="color:#808">host</span>: window.pusher_host,<tt>
</tt>    <span style="color:#808">jwt</span>: window.guardian_token,<tt>
</tt>    <span style="color:#808">uniqueUserId</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">robot</span><span style="color:#710">"</span></span> })<tt>
</tt>    <span style="color:#888">// ssl: true - if you're connecting to my online server</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> publicChannel = pusher.subscribe(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">general</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt>  publicChannel.bind(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">new_message</span><span style="color:#710">"</span></span>, <span style="color:#080;font-weight:bold">function</span>(payload) {<tt>
</tt>    <span style="color:#080;font-weight:bold">var</span> chat = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#chat</span><span style="color:#710">"</span></span>)<tt>
</tt>    chat.append(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;p&gt;&lt;strong&gt;</span><span style="color:#710">"</span></span> + payload.name + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;/strong&gt; </span><span style="color:#710">"</span></span> + payload.message + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;/p&gt;</span><span style="color:#710">"</span></span>);<tt>
</tt>    chat.scrollTop(chat.prop(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">scrollHeight</span><span style="color:#710">"</span></span>));<tt>
</tt>  })<tt>
</tt><tt>
</tt>  pusher.joinAll();<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We can now continue in the same file with the Javascript that binds to the message input field, listening to the "Enter" key press event to send the messages:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">  <span style="color:#080;font-weight:bold">var</span> message_element = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#message</span><span style="color:#710">"</span></span>);<tt>
</tt>  message_element.on(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">keypress</span><span style="color:#710">'</span></span>, <span style="color:#080;font-weight:bold">function</span>(event) {<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> (event.keyCode != <span style="color:#00D;font-weight:bold">13</span>) { <span style="color:#080;font-weight:bold">return</span>; }<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">var</span> name_element    = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#name</span><span style="color:#710">"</span></span>);<tt>
</tt>    <span style="color:#080;font-weight:bold">var</span> check_element   = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#channel</span><span style="color:#710">"</span></span>);<tt>
</tt>    <span style="color:#080;font-weight:bold">var</span> payload = { <span style="color:#808">name</span>: name_element.val(), <span style="color:#808">message</span>: message_element.val() };<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span>(!check_element.prop(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">checked</span><span style="color:#710">"</span></span>)) {<tt>
</tt>      sendPusher(payload);<tt>
</tt>    } <span style="color:#080;font-weight:bold">else</span> {<tt>
</tt>      sendAPI(payload)<tt>
</tt>    }<tt>
</tt>    message_element.val(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>);<tt>
</tt>  });<tt>
</tt><tt>
</tt>  window.publicChannel = publicChannel;<tt>
</tt>})<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is how we send messages to ExPusherLite, either directly through the full-duplex WebSockets:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">sendPusher</span>(payload) {<tt>
</tt>  console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">sending through socket</span><span style="color:#710">"</span></span>)<tt>
</tt>  window.publicChannel.trigger(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">new_message</span><span style="color:#710">'</span></span>, payload );<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or Posting to the available API:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">function sendAPI(payload) {<tt>
</tt>  console.log("sending through API")<tt>
</tt>  $.ajax({<tt>
</tt>    type : 'POST',<tt>
</tt>    crossDomain: true,<tt>
</tt>    url : makeURL("new_message"),<tt>
</tt>    headers : { Authorization : 'Bearer ' + window.guardian_token },<tt>
</tt>    data : payload,<tt>
</tt>    success : function(response) {<tt>
</tt>      console.log(response);<tt>
</tt>      console.log("sent through API successfully");<tt>
</tt>    },<tt>
</tt>    error : function(xhr, status, error) {<tt>
</tt>      console.log(error);<tt>
</tt>    }<tt>
</tt>  });<tt>
</tt>}<tt>
</tt><tt>
</tt>function makeURL(event) {<tt>
</tt>  return "https://" + window.pusher_host + "/api/organizations/" + window.org_id + "/applications/" + window.app_key + "/event/" + event;<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>By the way, you can send messages using the API from the server-side if you want. Specifically from an ActiveJob process so you can keep your Rails web application fast, and you can use the opportunity to store the message in your database, or apply any filters.</p>
<p>And this is it! You now have a Rails application with WebSockets. You can have your lunch and eat it too.</p>
<p>If you want to see this example working, I published a demo app <a href="https://ex-pusher-lite-demo.herokuapp.com/">over at Heroku</a>. It's just a demo, it has no authentication, no cross-sripting sanitization, no nothing.</p>
<p><a href="https://ex-pusher-lite-demo.herokuapp.com/"><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/577/Screen_Shot_2016-12-30_at_17.42.22.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/577/Screen_Shot_2016-12-30_at_17.42.22.png 2x" alt="chat demo"></a></p>
<p>In summary: this is a Rails app (you could do it in Django, Laravel, ASP.NET MVC, it doesn't matter) talking through WebSocket + APIs to a Phoenix cluster.</p>
<h3>Next Steps</h3>
<p>Keep following my blog (or my Twitter at <a href="https://twitter.com/akitaonrails">@akitaonrails</a> ) for more posts to come.</p>
<p>I am still considering if I will open the ExPusherLite code as open source, so let me know if you're interested.</p>
<p>I am also considering if I will keep the current servers online as a cheap service. You can use it for free right now to play with it, but don't use for production-level apps yet. As I am still heavily coding it, I will keep updating the servers, so there is no SLA. Let me know if you're interested in such a service that keeps the code open source so you can trust it better.</p>
<p>There are important features still missing, such as proper SSL support, encrypted channels, better Presence tracking APIs and so on, but what's available right now already covers most use cases for WebSockets.</p>
<p>And better: because this is Phoenix, because this is Elixir, and because this is Erlang, we get distributed PubSub for "free". As I explained in my <a href="https://www.akitaonrails.com/2016/12/23/elixir-phoenix-app-deployed-into-a-load-balanced-digitalocean-setup">deployment</a> post, this is a setup with a server in New York and another in London, just to showcase the distributed nature of Erlang.</p>
<p>It's been very fun to play with Elixir for the past few days and how fast I was able to put together a full-featured solution like this. There were many puzzles that made me scratch my head, figuring out how to deal with cross origin issues, how to make the nodes find each other through the edeliver deployment, figuring out the missing bits in replacing exrm for distillery (which is a transition still taking place in the community), etc.</p>
<p>Now I am quite comfortable with the basics, from bootstrapping a project all the way to deploying in a cluster scenario. And I hope this service proves useful to more people.</p>
<p>As this is possibly my last post of the year: Happy New Year! And I will see you again in 2017!</p>
<p></p>
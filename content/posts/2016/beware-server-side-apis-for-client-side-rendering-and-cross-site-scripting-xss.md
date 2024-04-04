---
title: "Beware: Server-side APIs for Client-Side Rendering and Cross Site Scripting (XSS)"
date: "2016-02-22T16:27:00.000Z"
tags: ["rails", "security", "xss"]
years: "2016"
---

<p></p>
<p>Last year I did a mistake: I left an open vulnerability in a client's project. Fortunately it was a short lived project with no reported breaches, but this was such a stupid oversight that I might as well bang my head in a wall because of it.</p>
<p>So, let me explain the situation that might lead to this kind of vulnerability: a server-side API, serving tampered raw data to a client-side consumer that is assuming that the data is safe, and rendering it directly into the front-end.</p>
<p>First of all, for the uninitiated, a XSS or <a href="http://brakemanscanner.org/docs/warning_types/cross_site_scripting/">Cross Site Scripting</a> is when you allow user input to be rendered in your site without proper sanitization. For example, a simple comments section. You expect users to just fill in the usual rants, but someone pastes in a javascript and when you render this comment, it executes in all your users browsers. It can go from simple site defacing up to stealing your users private data. A nasty vulnerability.</p>
<p>To avoid this, by default, Rails sanitizes every string that you throw into the view templates. You have to manually declare your string as safe if you want to render its unfiltered raw content. There are many nuances to this as scripts can come from many sources that flag it as being safe when it's not. The official Rails Guide has an entire page for Security best practices and it includes several <a href="http://guides.rubyonrails.org/security.html#injection">injection vectors</a> that you need to know.</p>
<p></p>
<p>
</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PagesController</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span><tt>
</tt>    <span style="color:#33B">@page</span> = <span style="color:#036;font-weight:bold">Page</span>.find_by_slug(params[<span style="color:#A60">:id</span>])<tt>
</tt>    respond_to <span style="color:#080;font-weight:bold">do</span> |format|<tt>
</tt>      format.html<tt>
</tt>      format.json { render <span style="color:#808">json</span>: <span style="color:#33B">@page</span>.to_json(<span style="color:#808">only</span>: [<span style="color:#A60">:title</span>, <span style="color:#A60">:slug</span>, <span style="color:#A60">:body</span>]) }<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Simple one-liner to allow your Page URL to respond to <tt>"/pages/some-page.json"</tt> and now you can add a simple Javascript/Coffeescript to your page to load this JSON like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#369;font-weight:bold">$</span> -&gt;<tt>
</tt>  <span style="color:#369;font-weight:bold">$</span>.ajax<tt>
</tt>    url: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/pages/</span><span style="color:#710">"</span></span> + <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=page]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">id</span><span style="color:#710">"</span></span>) + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.json</span><span style="color:#710">"</span></span><tt>
</tt>    success: (data, textStatus, jqXHR) -&gt;<tt>
</tt>      body = data[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">body</span><span style="color:#710">'</span></span>]<tt>
</tt>      <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">.ajax_body</span><span style="color:#710">'</span></span>).append(body)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now, all hell breaks loose. If you allowed some outside user to save content with <tt>Page#create</tt> and you <strong>DID NOT</strong> manually sanitize the data your client is screwed, because different from Rails View Templates, the <tt>#to_json</tt> method does not sanitize the JSON it generates and the application is open to XSS attacks.</p>
<p>The main pattern is when you have a vanilla Rails app and you quickly convert it to be used by some fancy SPA (Single Page App) that loads data from your quickly built API endpoints and fail to sanitize the data before appending to the browser's DOM.</p>
<h2>Fix 1: Sanitize in the Server-Side rendering</h2>
<p>The easiest fix for this particular problem is to remember to sanitize whatever comes out of your app. The Rails View Templates takes care of this automatically and we are spoiled by it. So we forget what needs to be done to manually sanitize a user inputted text:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PagesController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  before_action <span style="color:#A60">:set_page</span>, <span style="color:#808">only</span>: [<span style="color:#A60">:show</span>, <span style="color:#A60">:edit</span>, <span style="color:#A60">:update</span>, <span style="color:#A60">:destroy</span>]<tt>
</tt>  include <span style="color:#036;font-weight:bold">ActionView</span>::<span style="color:#036;font-weight:bold">Helpers</span>::<span style="color:#036;font-weight:bold">SanitizeHelper</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">ActionView</span>::<span style="color:#036;font-weight:bold">Helpers</span>::<span style="color:#036;font-weight:bold">JavaScriptHelper</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span><tt>
</tt>    ...<tt>
</tt>    respond_to <span style="color:#080;font-weight:bold">do</span> |format|<tt>
</tt>      ...<tt>
</tt>      format.json <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        json_body = escape_javascript(sanitize(<span style="color:#33B">@page</span>.to_json(<span style="color:#808">only</span>: [<span style="color:#A60">:title</span>, <span style="color:#A60">:slug</span>, <span style="color:#A60">:body</span>])))<tt>
</tt>        render <span style="color:#808">json</span>: json_body<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, when you call the JSON URI "https://localhost:3000/pages/1.json", for example, you will receive this sanitized version:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">{\"title\":\"Hello World\",\"body\":\"\\u003cscript\\u003ealert(\'XSS\')\\u003c/script\\u003e\"}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Instead of the previously tampered raw body:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">{"title":"Hello World","body":"\u003cscript\u003ealert('XSS')\u003c/script\u003e"}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Fix 2: Always add a redundant XSS check in the Client-Side</h2>
<p>Even if you're given guarantees that the API you're consuming always provides safe data, you can't be too sure. Always assume that data that comes from outside of your domain <em>might</em> come compromised. It only takes one breach, one time.</p>
<p>So, in the client-side I believe one of the ways is to use the <a href="https://github.com/leizongmin/js-xss">"xss"</a> module. In a Rails app, the canonical way to add it is to use Rails Assets:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># in your Gemfile</span><tt>
</tt>source <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">https://rails-assets.org</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails-assets-xss</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">// in your app/assets/javascripts/application.js</span><tt>
</tt><span style="color:#888">//= require jquery</span><tt>
</tt><span style="color:#888">//= require jquery_ujs</span><tt>
</tt><span style="color:#888">//= require turbolinks</span><tt>
</tt><tt>
</tt><span style="color:#888">//= require xss</span><tt>
</tt><tt>
</tt><span style="color:#888">//= require_tree .</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now, in the previously vulnerable <tt>"pages.coffee"</tt>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ -&gt;<tt>
</tt>  $.ajax<tt>
</tt>    url: "/pages/" + $("meta[name=page]").attr("id") + ".json"<tt>
</tt>    success: (data, textStatus, jqXHR) -&gt;<tt>
</tt>      body = filterXSS(data['body'])<tt>
</tt>      $('.ajax_body').append(body)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Assume that all data that comes from Ajax endpoints could be tampered, so always filter against XSS, specially if you're going to append the result into your user browser's DOM.</p>
<p>I believe most modern SPA frameworks such as Ember already checks for that, but check the Model documentation of your favorite framework to be sure.</p>
<h2>Fix 3: Filter all User Input, regardless. Use Rack-Protection</h2>
<p>The usual workflow is for the Rails app to receive raw data from the user, store it in the Model table and when it needs to be rendered, let the View layer make the sanitization. Specially because if you need to parse the user data from the database, you would have to de-sanitize first.</p>
<p>But if you really don't care about the raw user input (you're not making a Content Management System) and you only really care about the plain text, then you should sanitize <strong>all</strong> user input by default.</p>
<p>One way to do it is to put the sanitization in the Rack Middleware layer directly, so your app only receives filtered data.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># in your Gemfile</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-protection</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then add this to your <tt>"config/application.rb"</tt> application block:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">config.middleware.use <span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Protection</span>::<span style="color:#036;font-weight:bold">EscapedParams</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's it!</p>
<p>Without this middleware, this is what a vanilla form would receive from the user when he posts a javascript into the controller:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started POST "/pages" for 127.0.0.1 at 2016-02-22 13:15:58 -0300<tt>
</tt>Processing by PagesController#create as HTML<tt>
</tt>  Parameters: {"utf8"=&gt;"✓", "authenticity_token"=&gt;"...", "page"=&gt;{"title"=&gt;"Hello 5", <tt>
</tt>  "body"=&gt;"&lt;script&gt;alert('XSS 5')&lt;/script&gt;"}, "commit"=&gt;"Create Page"}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can see the raw javascript that, if gone unchecked through an API, will execute in the user browser after an uncaring Ajax fetches it.</p>
<p>Now, with the Rack Protection middleware, your Rails app will not receive the raw javascript, instead it will come pre-escaped.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Started POST "/pages" for 127.0.0.1 at 2016-02-22 13:16:44 -0300<tt>
</tt>Processing by PagesController#create as HTML<tt>
</tt>  Parameters: {"utf8"=&gt;"✓", "authenticity_token"=&gt;"...", "page"=&gt;{"title"=&gt;"Hello 6", <tt>
</tt>  "body"=&gt;"&amp;lt;script&amp;gt;alert(&amp;#x27;XSS 6&amp;#x27;)&amp;lt;&amp;#x2F;script&amp;gt;"}, "commit"=&gt;"Create Page"}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I believe there are clever ways to try to fool the escape process by using some combination of special characters, but this should cover most cases.</p>
<h2>What about Brakeman and other security scanners?</h2>
<p>If you use Brakeman it will usually warn you if you try to inject user data into a View Template or SQL query without proper sanitization. But because this is a <strong>cross-app</strong> scenario, the server app will be flagged as "secure", and you will not notice it until too late.</p>
<p>So the recommendation is: do <strong>ALL</strong> 3 things I listed above.</p>
<ol>
  <li>Always manually sanitize your JSON APIs in the server-side.</li>
  <li>Always manually sanitize your Ajax fetches in the client-side.</li>
  <li>Always add <a href="https://github.com/sinatra/rack-protection">Rack Protection</a> (see the documentation for other protection other than the <tt>EscapedParams</tt> and also check the <a href="https://github.com/kickstarter/rack-attack">Rack-Attack</a> for further protection).</li>
</ol>
<p>Those are all easy to add security layers, and this is only one vector of attack, so better to cover all basis.</p>
<p>As a bonus: do not forget to install <a href="https://github.com/rubysec/bundler-audit">"Bundler Audit"</a> to check if you're not using vulnerable gems, many XSS and other vulnerabilities come from dependencies that you're not even aware of. So run Brakeman and Bundler Audit regularly against your application as well.</p>
<p>You can never be too safe. Security is not binary, you're vulnerable by default. There is no such as thing as "vulnerability-free" app, no matter how many audits you ran. There are only vulnerabilities that you didn not find yet, but they're there, be assured of that.</p>
<p></p>
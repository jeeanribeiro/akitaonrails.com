---
title: "Rails 5.1  Deployment Checklist for Heroku"
date: "2017-06-28T18:12:00.000Z"
tags: ["rails", "heroku", "postgresql", "letsencrypt", "cdn"]
years: "2017"
---

<p></p>
<p>I released <a href="http://www.theconf.club">THE CONF</a> yesterday. I hope you enjoy the conference program and take advantage of the limited early-bird discount!</p>
<p>Anyway, the website itself is super simple. A single page site. I chose to use Rails 5.1 as the site structure because it takes care of all the stuff I'd have to add manually in any other framework. Specially now that that it brings native Yarn and Webpack support it's a breeze to use by any competent front-end developer.</p>
<p>But even with the many built-in niceties, a full production setup still requires extra steps that most beginners will not know. So I decided to compile a small checklist of things you must take care of before deploying to production. It's not an extensive and complete list for all use cases, but this should be enough for most small cases.</p>
<ul>
  <li><a href="#setup">Setting up the project</a></li>
  <li><a href="#cdn">Adding a CDN and configuring CORS support</a> (to be able to load fonts for example)</li>
  <li><a href="#cache">Adding Memcached</a></li>
</ul>
<p></p>
<p></p>
<p><a name="setup"></a></p>
<h2>Setting up the project</h2>
<p>One thing that most people forget, even experienced developers is that the <code>rails new</code> command used to bootstrap the initial project structure accepts many option flags. Instead of having to manually tweak files later, you can start like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rails new your_project \<tt>
</tt>--database=postgresql \<tt>
</tt>--webpack=react \<tt>
</tt>--skip-action-cable \<tt>
</tt>--skip-coffee<tt>
</tt>--skip-turbolinks<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you're building with React or another full-featured javascript framework, you will probably want to skip Turbolinks. Otherwise, if it's a simple site, do use <a href="https://sevos.io/2017/02/27/turbolinks-lifecycle-explained.html">Turbolinks</a>.</p>
<p>Start using Postgresql from the get go, don't use Sqlite3.</p>
<p>Skip Action Cable. Prefer a real solution such as <a href="https://pusher.com/">Pusher.com</a>. If you really need something done in-house, consider something like my solution with Elixir, the <a href="https://expusherlite.cm42.io/">Ex Pusher Lite</a>. Take this recommendation with a grain of salt, of course, for small things Action Cable is more than enough. I may write another post just elaborating on this point if people indicate they want to in the comments section.</p>
<p>Anyway, I digress. Make sure you have 2 boot files, first the canonical <code>Procfile</code> to be used by Heroku in production:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">web: bin/rails server -p $PORT -b 0.0.0.0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Second, a <code>Procfile.dev</code> to be used only in your development environment:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">web: ./bin/rails server<tt>
</tt>webpacker: ./bin/webpack-dev-server<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how you fire up the webpack server that will compile your assets in real-time during development. You need to also remember to run these two dependency commands now:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">yarn install<tt>
</tt>bundle install<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Install javascript dependencies with <code>yarn add [package]</code> and that's it! In production you don't use the webpack server (which is why we don't add it to the production <code>Procfile</code>), instead Heroku automatically detects the <a href="https://github.com/rails/webpacker">webpacker</a> gem then it installs the nodejs buildpack, runs <code>yarn install</code> for you and when <code>rails assets:precompile</code> runs it will also execute <code>yarn run</code> which will pre-compile all the assets (javascript, stylesheets, images) with the proper fingerprinting for cache busting and everything else we are used to in the normal Rails Asset Pipeline.</p>
<p>So, for Heroku, you basically don't have to do anything. And in a custom deployment server you just need to remember to run the <code>assets:precompile</code> task and have it do everything for you.</p>
<p><a name="cdn"></a></p>
<h3>Adding a CDN and configuring CORS</h3>
<p>This is really super easy. There is no reason why anyone wouldn't add a CDN to any website. Please just do it.</p>
<p>Open your AWS Management Console and <a href="https://console.aws.amazon.com/cloudfront/">open CloudFront</a>. From there click on "Create Distribution" and just follow the defaults in the Wizard. The requirement is that you MUST know that domain and sub-domain you want to point to (for example "www.theconf.club") in the "Origin Domain Name" field.</p>
<p>The only customization you MUST do is to change the <a href="https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/header-caching.html#header-caching-web-cors">"Forward Headers"</a> option to "Whitelist" in the "Default Cache Behavior Settings". Then you need to add "Origin", "Access-Control-Request-Headers", and "Access-Control-Request-Method" to the Whitelist. And that's it, now your distribution is CORS enabled.</p>
<p>It will take some time to create (it has to configure many data centers around the world), but you will end up with a URL representing your distribution, something like <code>doz7rtw2u3wg4.cloudfront.net</code>. I recommend you add it as a Heroku environment variable like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">heroku config:set CDN_URL=doz7rtw2u3wg4.cloudfront.net<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, edit your <code>config/environments/production.rb</code> and add the following:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">config.action_controller.asset_host = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">CDN_URL</span><span style="color:#710">'</span></span>] <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">CDN_URL</span><span style="color:#710">'</span></span>]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>To actually use the CDN you must declare every asset you use across your view templates using Rails View Helpers such as <code>image_tag</code>, <code>asset_path</code>, <code>javascript_pack_tag</code>, <code>stylesheed_pack_tag</code>, <code>stylesheet_link_tag</code>, etc. The Rails bootstrap will already create layout template with such helpers, you just need to follow them.</p>
<p>When webpack runs, it will generate all static, optimized and pre-compiled assets in the <code>public/packs</code> with a manifest file declaring the full URL pointing to the CDN. For example, if I fetch the <code>/app/public/packs/manifest.json</code> from the Heroku dyno directly, I will get something like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">{<tt>
</tt>  "Roboto-Bold.woff": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Bold-eed9aab5449cc9c8430d7d258108f602.woff",<tt>
</tt>  "Roboto-Bold.woff2": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Bold-c0f1e4a4fdfb8048c72e86aadb2a247d.woff2",<tt>
</tt>  "Roboto-Light.woff": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Light-ea36cd9a0e9eee97012a67b8a4570d7b.woff",<tt>
</tt>  "Roboto-Light.woff2": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Light-3c37aa69cd77e6a53a067170fa8fe2e9.woff2",<tt>
</tt>  "Roboto-Medium.woff": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Medium-cf4d60bc0b1d4b2314085919a00e1724.woff",<tt>
</tt>  "Roboto-Medium.woff2": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Medium-1561b424aaef2f704bbd89155b3ce514.woff2",<tt>
</tt>  "Roboto-Regular.woff": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Regular-3cf6adf61054c328b1b0ddcd8f9ce24d.woff",<tt>
</tt>  "Roboto-Regular.woff2": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Regular-5136cbe62a63604402f2fedb97f246f8.woff2",<tt>
</tt>  "Roboto-Thin.woff": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Thin-44b78f142603eb69f593ed4002ed7a4a.woff",<tt>
</tt>  "Roboto-Thin.woff2": "//doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Thin-1f35e6a11d27d2e10d28946d42332dc5.woff2",<tt>
</tt>  "application.css": "//doz7rtw2u3wg4.cloudfront.net/packs/application-09b53ce9ca3dd595ee99.css",<tt>
</tt>  "application.css.map": "//doz7rtw2u3wg4.cloudfront.net/packs/application-09b53ce9ca3dd595ee99.css.map",<tt>
</tt>  "application.js": "//doz7rtw2u3wg4.cloudfront.net/packs/application-799300612ff6d6595198.js",<tt>
</tt>  "application.js.map": "//doz7rtw2u3wg4.cloudfront.net/packs/application-799300612ff6d6595198.js.map",<tt>
</tt>  "home_page.js": "//doz7rtw2u3wg4.cloudfront.net/packs/home_page-ff3b49407a1d01592ad5.js",<tt>
</tt>  "home_page.js.map": "//doz7rtw2u3wg4.cloudfront.net/packs/home_page-ff3b49407a1d01592ad5.js.map"<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So, if for some reason I had to create a new CDN distribution, you have to remember to update the <code>CDN_URL</code> variable on Heroku and redeploy your app so it regenerates the assets and this manifest file. It will just those URLs when rendering the final HTMLs.</p>
<p>When a user opens your site, it will receive the HTML with URLs pointing to the CDN. The very first time it won't have any cached assets, so it will ask your site for them. Your site must return the assets WITH the correct CORSs headers so the CDN caches them with the headers and forward those headers to the browser. The browser needs those headers because it will open from domain <code>www.theconf.club</code>, for example, but fonts are loading from <code>doz7rtw2u3wg4.cloudfront.net</code>, so it would raise a security warning and not load the fonts because they are in different domains. Hence the CORS headers the font provides indicating that they are safe to load.</p>
<p>For your Rails app to return the proper headers, you need to add the <code>rack-cors</code> gem to your Gemfile. Then you must add a new configuration file at <code>config/initializers/rack-cors.rb</code> with:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">if</span> <span style="color:#080;font-weight:bold">defined?</span> <span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Cors</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Rails</span>.configuration.middleware.insert_before <span style="color:#00D;font-weight:bold">0</span>, <span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Cors</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    allow <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      origins <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%w[</span><span style=""><tt>
</tt>        https://theconf.club<tt>
</tt>        https://theconf.club<tt>
</tt>        https://www.theconf.club<tt>
</tt>        https://www.theconf.club<tt>
</tt>        https://theconf.herokuapp.com<tt>
</tt>        https://theconf.herokuapp.com<tt>
</tt>      </span><span style="color:#710">]</span></span><tt>
</tt>      resource <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">/assets/*</span><span style="color:#710">'</span></span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>When you deploy, you know it's working correctly when you Curl an asset and it returns the Access-* headers like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ curl -I -s -X GET -H "Origin: www.theconf.club" https://www.theconf.club/packs/Roboto-Regular-5136cbe62a63604402f2fedb97f246f8.woff2<tt>
</tt>HTTP/1.1 200 OK<tt>
</tt>Server: Cowboy<tt>
</tt>Date: Wed, 28 Jun 2017 17:44:41 GMT<tt>
</tt>Connection: keep-alive<tt>
</tt>Access-Control-Allow-Origin: www.theconf.club<tt>
</tt>Access-Control-Allow-Methods: GET, POST, OPTIONS<tt>
</tt>Access-Control-Expose-Headers: <tt>
</tt>Access-Control-Max-Age: 1728000<tt>
</tt>Access-Control-Allow-Credentials: true<tt>
</tt>Last-Modified: Wed, 28 Jun 2017 17:06:03 GMT<tt>
</tt>Content-Type: application/font-woff2<tt>
</tt>Cache-Control: public, max-age=2592000<tt>
</tt>Vary: Origin<tt>
</tt>Content-Length: 64832<tt>
</tt>Via: 1.1 vegur<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And if everything above is already in place, you should be able to see the headers being forwarded through the CDN, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ curl -I -s -X GET -H "Origin: www.theconf.club" https://doz7rtw2u3wg4.cloudfront.net/packs/Roboto-Regular-5136cbe62a63604402f2fedb97f246f8.woff2<tt>
</tt>HTTP/1.1 200 OK<tt>
</tt>Content-Type: application/font-woff2<tt>
</tt>Content-Length: 64832<tt>
</tt>Connection: keep-alive<tt>
</tt>Server: Cowboy<tt>
</tt>Date: Wed, 28 Jun 2017 17:45:18 GMT<tt>
</tt>Access-Control-Allow-Origin: www.theconf.club<tt>
</tt>Access-Control-Allow-Methods: GET, POST, OPTIONS<tt>
</tt>Access-Control-Expose-Headers: <tt>
</tt>Access-Control-Max-Age: 1728000<tt>
</tt>Access-Control-Allow-Credentials: true<tt>
</tt>Last-Modified: Wed, 28 Jun 2017 17:06:03 GMT<tt>
</tt>Cache-Control: public, max-age=2592000<tt>
</tt>Via: 1.1 vegur, 1.1 86e9abdb4c15b9d3a542f9b93245e87e.cloudfront.net (CloudFront)<tt>
</tt>Vary: Origin<tt>
</tt>X-Cache: Miss from cloudfront<tt>
</tt>X-Amz-Cf-Id: tVkZ41RRr66iBT6atWTO_oeTY_jG0zCBFuXU8bKyClZDQ8kl-hDegA==<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A CDN is the secret sauce that allows any content-based website to scale way beyond what your server can provide. It's a huge cost-saving and it also makes for a way more smooth user experience for your users.</p>
<p>One last caveat. The many Rails View Helpers such as <code>image_tag</code> allows you to add the image file name without an extension in development and it will correctly find the image. But on the server it will fail to render the template this way. As a rule of thumb <strong>ALWAYS</strong> fill in the entire filename and extension, for example <code>image_tag("logo.png")</code> instead of just <code>image_tag("logo")</code>.</p>
<p>You can see how this fails if you open a console in Heroku and check out how it fails to derive the full image URL:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ heroku run rails c                                                                                                                  <tt>
</tt>Running rails c on ⬢ theconf... up, run.8271 (Hobby)<tt>
</tt>Loading production environment (Rails 5.1.2)<tt>
</tt><tt>
</tt>irb(main):001:0&gt; ActionController::Base.helpers.asset_path("icon-goals")<tt>
</tt>Sprockets::Rails::Helper::AssetNotFound: The asset "icon-goals" is not present in the asset pipeline.<tt>
</tt>    from (irb):1<tt>
</tt><tt>
</tt>irb(main):002:0&gt; ActionController::Base.helpers.asset_path("icon-goals.png")<tt>
</tt>=&gt; "//d134ipy19a646x.cloudfront.net/assets/icon-goals-b969b3b7325d33ad85a88dbb5b894832909ed738eea9964b9cf535646b93674b.png"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p><a name="cache"></a></p>
<h3>Adding Memcached</h3>
<p>Talking about cache is always a complicated thing. Which is the reason many people avoid even trying. Even though you can go really crazy with super granular configurations such as using <a href="https://edgeguides.rubyonrails.org/caching_with_rails.html#russian-doll-caching">Russian Doll Caching</a>, just adding cache in a few spots can greatly benefit you. And it's super easy to boot.</p>
<p>The first thing to do is add <a href="https://devcenter.heroku.com/articles/memcachier">Memcachier</a> to your Heroku application. It has a free-tier and for most small apps it should be enough.</p>
<p>Configuration is also trivial. Start by adding the following gems to your <code>Gemfile</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">group <span style="color:#A60">:production</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-cors</span><span style="color:#710">'</span></span>, <span style="color:#808">require</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack/cors</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rack-cache</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">dalli</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">kgio</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">memcachier</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you must edit your <code>config/environments/production.rb</code> like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">config.cache_store = <span style="color:#A60">:dalli_store</span><tt>
</tt><tt>
</tt>client = <span style="color:#036;font-weight:bold">Dalli</span>::<span style="color:#036;font-weight:bold">Client</span>.new((<span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">MEMCACHIER_SERVERS</span><span style="color:#710">"</span></span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span>).split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">,</span><span style="color:#710">"</span></span>),<tt>
</tt>                           <span style="color:#A60">:username</span> =&gt; <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">MEMCACHIER_USERNAME</span><span style="color:#710">"</span></span>],<tt>
</tt>                           <span style="color:#A60">:password</span> =&gt; <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">MEMCACHIER_PASSWORD</span><span style="color:#710">"</span></span>],<tt>
</tt>                           <span style="color:#A60">:failover</span> =&gt; <span style="color:#038;font-weight:bold">true</span>,<tt>
</tt>                           <span style="color:#A60">:socket_timeout</span> =&gt; <span style="color:#60E;font-weight:bold">1.5</span>,<tt>
</tt>                           <span style="color:#A60">:socket_failure_delay</span> =&gt; <span style="color:#60E;font-weight:bold">0.2</span>,<tt>
</tt>                           <span style="color:#A60">:value_max_bytes</span> =&gt; <span style="color:#00D;font-weight:bold">10485760</span>)<tt>
</tt>config.action_dispatch.rack_cache = {<tt>
</tt>  <span style="color:#A60">:metastore</span>    =&gt; client,<tt>
</tt>  <span style="color:#A60">:entitystore</span>  =&gt; client<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, let's say you have a block in your template that requires a bunch of records from your database. But you know that those records barely change. What can you do? One alternative is cache the ActiveRecord query entirely like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">HomePageController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span><tt>
</tt>    <span style="color:#33B">@selected_proposals</span> = <span style="color:#036;font-weight:bold">Rails</span>.cache.fetch(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">selected_proposals</span><span style="color:#710">'</span></span>, <span style="color:#808">expires_in</span>: <span style="color:#00D;font-weight:bold">1</span>.day) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Proposal</span>.includes(<span style="color:#A60">:authors</span>).where(<span style="color:#808">selected</span>: <span style="color:#038;font-weight:bold">true</span>).to_a<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <code>#to_a</code> is necessary because ActiveRecord queries are lazy. The <code>#to_a</code> forces it to fetch and it will be cached. Next time, it will not touch the database for an entire day!</p>
<p>I could also have added a <code>cache do ... end</code> block in the template itself. There are many options. Point is that it's not as difficult as most people would think.</p>
<p>What makes caching difficult is adding expiration logic. And the rule of thumb is: never try to manually expire any cache. Just change the lookup key for something else and let the old data just die (memcached will take care of getting rid of unused old data).</p>
<p>You really want to read the <a href="https://edgeguides.rubyonrails.org/caching_with_rails.html">Rails Guides on Caching</a>. It really is not as difficult as you think and you can cache only the few snippets where you know is performance-sensitive and leave the other parts that are highly dynamic and you're unsure how to properly cache.</p>
<p>But as it's super cheap, just use it right now.</p>
<p><a name="ssl"></a></p>
<h3>Adding SSL support</h3>
<p>If you have any security sensitive transaction going on (ex. purchases) you want to use SSL. Again, many people avoid it because it's usually difficult to even understand how to properly get a certificate.</p>
<p><a href="https://letsencrypt.org/">Let's Encrypt</a> made the process super trivial. Kudos to them! And even better: it's free! So, you don't have any excuses to not have SSL.</p>
<p>And over Heroku, it's <a href="https://devcenter.heroku.com/articles/automated-certificate-management">even easier</a>!</p>
<blockquote>
  <p>ACM (Automated Certificate Management) is enabled by default for all applications created after March 21, 2017 that are running on Hobby or Professional dynos. The following steps are for applications currently running on Free dynos, and for applications created before that date.</p>
</blockquote>
<p>On the Free Tier Dynos, this is what you do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">heroku certs:auto:enable<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Check status with <code>heroku certs:auto</code>.</p>
<p>Done, there is no step 2.</p>
<p>We used to have to use the complicated gem <a href="https://github.com/pixielabs/letsencrypt-rails-heroku">letsencrypt-rails-heroku</a>, but now it's just too easy.</p>
<h3>Conclusion</h3>
<p>I believe this cover the very basics of stuff you should be doing before deploying your small app to Heroku. For larger apps there are many more concerns that are beyond the scope of this post.</p>
<p>If you remember about more tips and tricks, please share in the comments section below.</p>
<p></p>
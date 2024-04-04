---
title: "Updating my Old Posts on Uploads"
date: "2016-07-28T14:56:00.000Z"
tags: ["carrierwave", "cdn", "cloudfront", "cloudinary", "heroku"]
years: "2016"
---

<p></p>
<p>Fortunately things usually change for the best, and practices that "worked ok" in the past might be obsolete by now.</p>
<p>That happens to old blog posts, including my own as I've been posting for several years.</p>
<p>In this post I will fix what I posted (in pt-BR):</p>
<ul>
  <li><a href="http://www.akitaonrails.com/2014/12/18/small-bites-direct-upload-para-s3-a-solucao-definitiva">Direct Upload para S3: a Solução Definitiva!</a></li>
  <li><a href="http://www.akitaonrails.com/2014/03/26/heroku-tips-s3-direct-upload-carrierwave-sidekiq">S3 Direct Upload + Carrierwave + Sidekiq</a></li>
  <li><a href="http://www.akitaonrails.com/2010/06/23/akita-responde-upload-de-arquivos">Upload de Arquivos</a></li>
  <li><a href="http://www.akitaonrails.com/2012/04/20/heroku-tips-enciclopedia-do-heroku">Enciclopédia do Heroku</a></li>
</ul>
<p>They are still good posts to understand the mechanics of what I will propose here, so you should read them if you're interested in how things work.</p>
<p><strong>TL;DR</strong> is: use Cloudinary (with Attachinary) and install a CDN (Cloudfront) right now as it's super trivial to do.</p>
<p></p>
<p></p>
<blockquote>
  <p>Uploading files is not a task to be taken lightly. It's one of those tasks that you must not consider that it "works" just because it works in your development machine, for a few trivial uploads. Production level behavior changes drastically and it can bring your entire project down depending on how heavy it depends on user generated content.</p>
</blockquote>
<p>There are a lot of moving parts to understand. But in the most basic solutions you just create an HTML multipart form with a file input field and submit it to some controller endpoint directly. This controller receives the blob binary and you save it to some local directory in the server.</p>
<p>This is the <strong>worst possible solution</strong> and unfortunatelly this is the one you will find the most through the web.</p>
<p>There are many problems to deal with this simple implementation:</p>
<ul>
  <li>We are in the era of 12+ megapixel cameras. Those are multi-megabyte sized files. Each upload will take a long time, specially if the user is trying to upload using unreliable or slow wireless networks.</li>
</ul>
<p>Once the user's browser connects to the web application it will hold that connection and block the entire process through the duration of the request-response cycle. Making this simple to understand, if you only have 1 single process in the server, it will be unable to respond to any other request until the upload finishes.</p>
<p>Fortunately most deployments will use NGINX at the front of the web application - as they should -, so this effect is minimized as NGINX will receive the entire blob before passing it to the web application process underneath, making it not so problematic in most cases.</p>
<p>But if you're on Heroku, the router layer has a <strong>30 seconds timeout</strong> limit. If the upload takes more than that (which is common with users in unreliable networks) this layer will cut the connection down before it finishes. Users will retry and this can cause your request queues to grow very fast.</p>
<p>Avoid uploading anything to Heroku. I consider this a <strong>feature</strong> as it forces application deployed on Heroku to use <strong>good practices</strong> as I will explain below.</p>
<ul>
  <li>You should also NOT save files to the local filesystem if you want to scale horizontaly, as one server will not be able to see what's in the other server unless you're in AWS EC2 or other IaaS, with shared mounted volumes, for example. In Heroku, you can't rely on anything in the filesystem as the machines are volatile and whenever a dyno restarts it loses whatever was not there during the deployment.</li>
</ul>
<p>So you must upload what you received to an external storage, such as AWS S3, and this is also slow if you receive lots of uploaded files. You can rely on NGINX or Heroku's router layer to handle the heavy receiving of the files but you will make the request-response cycle super slow if you synchronously process and upload the files to S3.</p>
<p>The next option you think of is to add Sidekiq or some other Async Job mechanism to do this other heavy lifting. Now you have to create front-end placeholders to show to the users while the background job is not finished sending the files to S3.</p>
<p>The last option, if you dig deeper, is browser-based <strong>direct uploads to S3</strong> and just posting the URLs to your web application. This is the ideal solution, but it's not easy to implement in your stack.</p>
<ul>
  <li>Once you nail everything above, you still do the mistake of putting the S3 URLs directly in the IMG tags in your HTML, which is not recommended by Amazon as S3 is recommended just for "storage" purposes. This is the easy part to fix, but most projects forget about that.</li>
</ul>
<h3>Cloudinary or Carrierwave Direct</h3>
<p>In my previous posts I explained each of the above issues in more detail and I offer some (complicated) solutions, such as using the Refile project. At that time the Carrierwave plugins for Direct Upload were not ready.</p>
<p>Nowadays the solution is actually super easy and this is what I recommend: go straight to <a href="https://cloudinary.com/documentation/rails_integration">Cloudinary</a>. This is a Software as a Service solution for proper direct uploads and dynamic image processing. You should definitelly explore the <a href="https://github.com/assembler/attachinary">Attachinary</a> gem to make the process easier.</p>
<p>If you have legacy Carrierwave, Paperclip, Shrine, Dragonfly, Refile or others, one jerry rigged - but reasonable - alternative is to just add Attachinary to the mix.</p>
<p>Let's say you have an old <code>user.avatar</code> uploader. You can just create a new <code>user.new_avatar</code> with Attachinary/Cloudinary. In the HTML form upload you start using just the Attachinary helpers. And in the HTML where you show the image itself, you can make a helper to check for <code>@user.new_avatar?</code> and show using <code>cl_image_tag(@user.avatar.path</code> instead, otherwise you show the old URLs.</p>
<p>You don't need to totally migrate everything to Cloudinary, just keep the old assets where they are and start putting the new assets in the Cloudinary configuration. It has a Free tier that can hold up to 75 thousand images and allow a traffic of up to 5GB. And with just USD 44 a month you have 10 times that. So it's really cheap if your application is serious about file uploading.</p>
<p>If you don't want to commit to an external service yet, and you're using Carrierwave, another option you must consider is testing out <a href="https://github.com/dwilkie/carrierwave_direct">CarrierwaveDirect</a> to test direct uploading to S3 from the browser. This will at least avoid the complexities of setting up async uploads from the web application to S3.</p>
<p>Update: <a href="https://github.com/janko-m">Janko Marohnić</a> posted a very good comment that I think is important to quote directly:</p>
<blockquote>
  <p>Great writeup, I wholeheartedly agree that we probably don't "just want something simple", especially concerning synchronous uploads and CDNs.</p>
  <p>Shrine actually has a <a href="https://github.com/janko-m/shrine-cloudinary">Cloudinary integration</a>, and it's pretty advanced too; it supports direct uploads, setting upload options, storing Cloudinary metadata (hello <a href="https://cloudinary.com/blog/introducing_intelligent_responsive_image_breakpoints_solutions">responsive breakpoints</a>) etc :). Also, the Cloudinary gem ships with a CarrierWave integration. I think it's beneficial to use Shrine or CarrierWave with Cloudinary, because then you get to keep your file attachments library, and just change the underlying storage service.</p>
  <p>As for CarrierwaveDirect, I don't think it's actually very useful, because backgrounding you need to do all by yourself anyway, so basically all it gives you is the ability to generate a direct-upload form to S3. But generating request parameters and URL to S3 is something that's already built in into the official <a href="https://github.com/aws/aws-sdk-ruby">aws-sdk</a> gem, CarrierwaveDirect just seems to be reimplementing th at logic. And the advantage of generating this through aws-sdk is that it's not HTML-specific, so you could setup an endpoint which returns this information as JSON, and now you have your multiple file uploads directly to S3 :)</p>
</blockquote>
<p>As a disclaimer I didn't test CarrierwaveDirect myself and I remember it being quite broken 2 years ago. And I've heard good things about Shrine along the way but never did a proper testing. I'd recommend giving it a try if you want to migrate away from Carrierwave.</p>
<h3>Don't serve assets from S3, use a CDN, any CDN</h3>
<p>If you're sticking to S3 uploading, at the very least avoid serving those files from S3. In my "Heroku Encyclopedia" post I recommend using "S3 Assets Sync". DO NOT DO IT: use a CDN instead, it's faster, easier and the correct solution</p>
<p>The first thing you want to do is sign up to AWS's Cloudfront CDN service. Always use a CDN for all your assets, not only the ones <a href="https://www.algonauti.com/posts/speed-up-ugc-with-cloudfront">internal to your web application</a> but also every user uploaded content. It's <a href="https://devcenter.heroku.com/articles/using-amazon-cloudfront-cdn">super simple</a> to create a new CDN endpoint pointing to your S3 bucket.</p>
<p>Carrierwave will default to the S3 bucket host, but once you have the Cloudfront endpoint you can <a href="https://dzone.com/articles/carrierwave-heroku-cloudfront">easily change</a> all the uploaded files URLs like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># ./config/initializers/carrierwave.rb</span><tt>
</tt><span style="color:#036;font-weight:bold">CarrierWave</span>.configure <span style="color:#080;font-weight:bold">do</span> |config|<tt>
</tt>  config.fog_credentials = {<tt>
</tt>    <span style="color:#A60">:provider</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">AWS</span><span style="color:#710">"</span></span>,<tt>
</tt>    <span style="color:#A60">:aws_access_key_id</span> =&gt; <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">AWS_ACCESS_KEY_ID</span><span style="color:#710">'</span></span>],<tt>
</tt>    <span style="color:#A60">:aws_secret_access_key</span> =&gt; <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">AWS_SECRET_ACCESS_KEY</span><span style="color:#710">'</span></span>],<tt>
</tt>  }<tt>
</tt>  config.fog_directory = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">S3_BUCKET</span><span style="color:#710">'</span></span>]<tt>
</tt><tt>
</tt>  <span style="color:#888"># use only one of the following 2 settings</span><tt>
</tt>  <span style="color:#888"># config.fog_host = "https://#{ENV['S3_BUCKET']}.s3.amazonaws.com"</span><tt>
</tt>  config.fog_host = <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">S3_CDN</span><span style="color:#710">'</span></span>] <span style="color:#888"># for cloudfront</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You must obviously configure the environment variable <code>S3_CDN</code> to point to the Cloudfront endpoint specific to the particular S3 bucket you're using.</p>
<p>The important part is: serve ALL ASSETS from a CDN, no matter what. Never directly from your web application, avoid directly serving from S3. It's almost trivial to implement and if you don't like AWS for any reason, you can choose Fastly, Cloudflare and many others.</p>
<p>They all work the same way. There is NO excuse to not use a CDN no matter the size of your application.</p>
<p></p>
---
title: "Ex Pusher Lite - Part 1: Phoenix Channels and Rails apps"
date: "2015-12-09T20:39:00.000Z"
tags: ["phoenix", "pusher", "english", "expusherlite"]
years: "2015"
---

<p></p>
<p>Finally, after a lengthy exercising period (and plenty of blogging!) I will start implementing the Elixir app I wanted from the very beginning.</p>
<p>As a Rails developer there are a few things we can't do in Rails. One of them is to deal with real-time messaging.</p>
<p>Rails 5 will bring <a href="https://github.com/rails/actioncable">Action Cable</a>, and it might be good enough for most cases. It uses <a href="https://github.com/faye/faye">Faye</a>, which in turn is based on Eventmachine. You can implement a good enough solution for Websockets using Faye in your Rails 4.2 app right now.</p>
<p>Another option is to avoid the trouble altogether and use a messaging service. One option I always recommend for zero friction is to use <a href="https://pusher.com/">Pusher.com</a>.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/533/big_Screenshot_from_2015-12-09_18_41_22.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/533/Screenshot_from_2015-12-09_18_41_22.png 2x" alt="Chat Example"></p>
<p></p>
<p></p>
<h3>The Basics</h3>
<p>You will want to clone from my <a href="https://github.com/akitaonrails/pusher_lite_demo/tree/v0.1">example repository</a>, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git clone https://github.com/akitaonrails/pusher_lite_demo<tt>
</tt>cd pusher_lite_demo<tt>
</tt>git checkout tags/v0.1 -b v0.1<tt>
</tt>bundle<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is a very very simple implementation of a real-time, websocket-based, chat using Pusher. The idea goes like this:</p>
<p>We start by having a front-end Form to send messages</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/home/index.html.erb --&gt;</span><tt>
</tt><span style="color:#888">&lt;%= form_for @event, url: events_path, remote: true, html: {class: "pure-form pure-form-stacked"} do |f| %&gt;</span><tt>
</tt>  <span style="color:#070">&lt;fieldset&gt;</span><tt>
</tt>    <span style="color:#070">&lt;legend&gt;</span>Send your message remotely<span style="color:#070">&lt;/legend&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= f.text_field :name, placeholder: "Name" %&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= f.text_field :message, placeholder: "Message" %&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= f.submit "Send message", class: "pure-button pure-button-primary" %&gt;</span><tt>
</tt>  <span style="color:#070">&lt;/fieldset&gt;</span><tt>
</tt><span style="color:#888">&lt;% end %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's using Rails built-in jQuery support for Ajax posting the form to the "EventsController#create" method:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/controllers/events_controller.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">EventsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span><tt>
</tt>    <span style="color:#036;font-weight:bold">SendEventsJob</span>.perform_later(event_params)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">event_params</span><tt>
</tt>    params.require(<span style="color:#A60">:pusher_event</span>).permit(<span style="color:#A60">:name</span>, <span style="color:#A60">:message</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Just to annotate the process, the "routes.rb" looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/routes.rb</span><tt>
</tt><span style="color:#036;font-weight:bold">Rails</span>.application.routes.draw <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  resources <span style="color:#A60">:events</span>, <span style="color:#808">only</span>: [<span style="color:#A60">:create</span>]<tt>
</tt><tt>
</tt>  root <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">home#index</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The HTML layout looks like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">&lt;!-- app/views/layout/application.html.erb --&gt;<tt>
</tt>&lt;!<span style="color:#036;font-weight:bold">DOCTYPE</span> html&gt;<tt>
</tt>&lt;html&gt;<tt>
</tt>&lt;head&gt;<tt>
</tt>  &lt;title&gt;<span style="color:#036;font-weight:bold">Pusher</span> <span style="color:#036;font-weight:bold">Lite</span> <span style="color:#036;font-weight:bold">Demo</span>&lt;<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">title&gt;<tt>
</tt>  &lt;meta name="viewport" content="width=device-width, initial-scale=1"&gt;<tt>
</tt>  &lt;meta name="pusher_key" content="&lt;%= Rails.application.secrets.pusher_key %&gt;"&gt;<tt>
</tt>  &lt;meta name="pusher_channel" content="&lt;%= Rails.application.secrets.pusher_channel %&gt;"&gt;<tt>
</tt>  &lt;%= stylesheet_link_tag    'application', media: 'all', 'data-turbolinks-track' =&gt; true %&gt;<tt>
</tt>  &lt;%= javascript_include_tag 'application', 'data-turbolinks-track' =&gt; true %&gt;<tt>
</tt>  &lt;script src="</span><span style="color:#404">/</span></span>/js.pusher.com/<span style="color:#60E;font-weight:bold">3.0</span>/pusher.min.js<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;&lt;/script&gt;<tt>
</tt>  &lt;%= csrf_meta_tags %&gt;<tt>
</tt>&lt;/head&gt;<tt>
</tt>&lt;body&gt;<tt>
</tt><tt>
</tt>&lt;div class=</span><span style="color:#710">"</span></span>pure-menu pure-menu-horizontal<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;<tt>
</tt>    &lt;span class=</span><span style="color:#710">"</span></span>pure-menu-heading<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;Pusher Client Demo&lt;/span&gt;<tt>
</tt>...<tt>
</tt>&lt;/div&gt;<tt>
</tt><tt>
</tt>&lt;div class=</span><span style="color:#710">"</span></span>pure-g-r<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;<tt>
</tt>  &lt;div class=</span><span style="color:#710">"</span></span>pure-u-<span style="color:#00D;font-weight:bold">1</span>-<span style="color:#00D;font-weight:bold">3</span> message-form<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;<tt>
</tt>    &lt;%= yield %&gt;<tt>
</tt>  &lt;/div&gt;<tt>
</tt>  <tt>
</tt>  &lt;div class=</span><span style="color:#710">"</span></span>pure-u-<span style="color:#00D;font-weight:bold">1</span>-<span style="color:#00D;font-weight:bold">3</span> message-receiver<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;<tt>
</tt>  &lt;/div&gt;<tt>
</tt>&lt;/div&gt;<tt>
</tt><tt>
</tt>&lt;/body&gt;<tt>
</tt>&lt;/html&gt;<tt>
</tt></span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This layout imports the default "application.js" which configures Pusher, establishes the Websocket connection and subscribes to messages on a specific topic with specific events:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">// app/assets/javascript/application.js</span><tt>
</tt><span style="color:#888">//= require jquery</span><tt>
</tt><span style="color:#888">//= require jquery_ujs</span><tt>
</tt><span style="color:#888">//= require turbolinks</span><tt>
</tt><span style="color:#888">//= require_tree .</span><tt>
</tt><tt>
</tt><span style="color:#369;font-weight:bold">$</span>(document).on(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">page:change</span><span style="color:#710">"</span></span>, <span style="color:#080;font-weight:bold">function</span>(){<tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> pusherKey = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_key]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>);<tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> pusher = <span style="color:#080;font-weight:bold">new</span> Pusher(pusherKey, { <span style="color:#808">encrypted</span>: <span style="color:#038;font-weight:bold">true</span> });<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> pusherChannel = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_channel]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>);<tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> channel = pusher.subscribe(pusherChannel);<tt>
</tt>  <tt>
</tt>  channel.bind(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">new_message</span><span style="color:#710">'</span></span>, <span style="color:#080;font-weight:bold">function</span>(data) {<tt>
</tt>    <span style="color:#080;font-weight:bold">var</span> new_line = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;p&gt;&lt;strong&gt;</span><span style="color:#710">"</span></span> + data.name + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;strong&gt;: </span><span style="color:#710">"</span></span> + data.message + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;/p&gt;</span><span style="color:#710">"</span></span>;<tt>
</tt>    <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.message-receiver</span><span style="color:#710">"</span></span>).append(new_line);<tt>
</tt>  });<tt>
</tt>});<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It gets the configuration metadata from the layout meta tags which grabs the values from "config/secrets.yml":</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">development</span>:<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="background-color:#fff0f0;color:#D20">ded7c4a2a298c1b620e462b50c9ca6ccb60130e27968357e76cab73de9858f14556a26df885c8aa5004d0a7ca79c0438e618557275bdb28ba67a0ffb0c268056</span><tt>
</tt>  <span style="color:#808">pusher_url</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_key</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_KEY'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_channel</span>: <span style="background-color:#fff0f0;color:#D20">test_chat_channel</span><tt>
</tt><tt>
</tt><span style="color:#808">test</span>:<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="background-color:#fff0f0;color:#D20">f51ff494801ff0f9e1711036ef6f2f6f1e13544b02326adc5629c6833ae90f1a476747fae94b792eba8a444305df8e7a5ad53f05ea4234692ac96cc44f372029</span><tt>
</tt>  <span style="color:#808">pusher_url</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_key</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_KEY'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_channel</span>: <span style="background-color:#fff0f0;color:#D20">test_chat_channel</span><tt>
</tt><tt>
</tt><span style="color:#888"># Do not keep production secrets in the repository,</span><tt>
</tt><span style="color:#888"># instead read values from the environment.</span><tt>
</tt><span style="color:#808">production</span>:<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV["SECRET_KEY_BASE"] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_url</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_key</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_KEY'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_channel</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_CHANNEL'] %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And as I'm using dotenv-rails, the ".env" looks like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">PUSHER_URL: "https://14e86e5fee3335fa88b0:2b94ff0f07ce9769567f@api.pusherapp.com/apps/159621"<tt>
</tt>PUSHER_KEY: "14e86e5fee3335fa88b0"<tt>
</tt>PUSHER_CHANNEL: "test_chat_channel"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pusher is configured in the server-side through this initializer:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/initializers/pusher.rb</span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pusher</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.url = <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_url<tt>
</tt><span style="color:#036;font-weight:bold">Pusher</span>.logger = <span style="color:#036;font-weight:bold">Rails</span>.logger<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, the "EventsController#create" actually do an async call to a <a href="https://github.com/brandonhilkert/sucker_punch">SuckerPunch</a> job:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">SendEventsJob</span> &lt; <span style="color:#036;font-weight:bold">ActiveJob</span>::<span style="color:#036;font-weight:bold">Base</span><tt>
</tt>  queue_as <span style="color:#A60">:default</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">perform</span>(event_params)<tt>
</tt>    <span style="color:#33B">@event</span> = <span style="color:#036;font-weight:bold">PusherEvent</span>.new(event_params)<tt>
</tt>    <span style="color:#33B">@event</span>.save<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>By the way, as a segway, <a href="https://github.com/brandonhilkert/sucker_punch">SuckerPunch</a> is a terrific solution for in-process asynchronous tasks. It's a better option to start with it without having to implement a separated system with Sidekiq workers.</p>
<p>Once you have larger job queues or jobs that are taking too long, then go to Sidekiq. If you use ActiveJob, the transition is as simple as changing the following configuration line in the "config/application.rb" file:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">config.active_job.queue_adapter = <span style="color:#A60">:sucker_punch</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This job just calls the "save" method in the fake-model "PusherEvent":</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PusherEvent</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">ActiveModel</span>::<span style="color:#036;font-weight:bold">Model</span><tt>
</tt><tt>
</tt>  attr_accessor <span style="color:#A60">:name</span>, <span style="color:#A60">:message</span><tt>
</tt>  validates <span style="color:#A60">:name</span>, <span style="color:#A60">:message</span>, <span style="color:#808">presence</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">save</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Pusher</span>.trigger(<span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_channel, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">new_message</span><span style="color:#710">'</span></span>, {<tt>
</tt>      <span style="color:#808">name</span>: name,<tt>
</tt>      <span style="color:#808">message</span>: message<tt>
</tt>    })<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As it's a very simple, the Gemfile is equally simple:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pusher</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">dotenv-rails</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">purecss-rails</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sucker_punch</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So what it does is very simple:</p>
<ol>
  <li>The application loads Pusher and the necessary configuration.</li>
  <li>When the user goes to "https://localhost:3000" he is presented with the message Form.</li>
  <li>When the user posts the message, it ends in "EventsController#create", which calls SuckerPunch's "SendEventsJob", instantiates a new "PusherEvent" model with the received form params and finally triggers the message to the Pusher server.</li>
  <li>The same form page also loads the Pusher javascript client and connects to the "test_chat_channel" topic and listens to the "new_message" event, which is the same thing the "Pusher.trigger" call sends together with the form message params.</li>
  <li>The Pusher server broadcasts the received trigger message to all subscribed Websocket clients.</li>
  <li>The Pusher javascript client in the user's browser receives the new message and just formats the message and appends to the "message-receiver" div HTML block in the same page.</li>
</ol>
<p>Pusher has support for authenticated users, private channels and more, but this is 80% of the usage for most cases. You can implement this as a chat system, a notification system, or anything like that.</p>
<p>Your Rails app sets up the front-end HTML/Javascript to connect to Pusher, listening to certain topics and events and the same Rails app triggers Pusher in the server-side, posting new messages. Pusher receives messages and broadcasts to the clients that subscribes to its topics. That's it.</p>
<h2>Ex Pusher Lite - Part 1: Initial Phoenix-based Pusher replacement</h2>
<p>My original idea was to make a drop-in replacement for the Pusher server, using the same Pusher client, but for now it was not easy to do so.</p>
<p>Instead, this Part 1 will focus on implementing an initial server ExPusherLite server that also receives events triggered by the same Rails server-side controller process and broadcasting to the same Rails front-end component through WebSockets.</p>
<p>I followed <a href="https://labs.opendoor.com/phoenix-on-rails-for-client-push-notifications">Daniel Neighman</a> tutorial. I had to do a few adjustments to have it working (and as this is still Part 1, it's not a complete solution yet!)</p>
<p>You can close the initial version from <a href="https://github.com/akitaonrails/ex_pusher_lite">my other Github repository</a> like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git clone https://github.com/akitaonrails/ex_pusher_lite<tt>
</tt>cd ex_pusher_lite<tt>
</tt>mix deps.get<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The tutorial implemented initial setup for <a href="https://github.com/hassox/guardian">Guardian</a> and <a href="https://github.com/bryanjos/joken">Joken</a> for JSON Web Tokens. I am still getting used to how <a href="https://www.phoenixframework.org/docs/channels">channels</a> are implemented in Phoenix.</p>
<p>It already comes pre-configured with a single socket handler that multiplexes connections. You start through the EndPoint OTP application:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># lib/ex_pusher_lite/endpoint.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Endpoint</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">Endpoint</span>, <span style="color:#808">otp_app</span>: <span style="color:#A60">:ex_pusher_lite</span><tt>
</tt><tt>
</tt>  socket <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/socket</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">UserSocket</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This application is started by the main supervisor in "lib/ex_pusher_lite.ex". It points the endpoint "/socket" to the socket handler "UserSocket":</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/channels/user_socket.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">UserSocket</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">Socket</span><tt>
</tt><tt>
</tt>  <span style="color:#888">## Channels</span><tt>
</tt>  channel <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">*</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">RoomChannel</span><tt>
</tt><tt>
</tt>  <span style="color:#888">## Transports</span><tt>
</tt>  transport <span style="color:#A60">:websocket</span>, <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">Transports</span>.<span style="color:#036;font-weight:bold">WebSocket</span><tt>
</tt>  <span style="color:#888"># transport :longpoll, Phoenix.Transports.LongPoll</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The "channel" function comes commented out, so I started by uncommenting it. You can pattern match the topic name like "public:*" to different Channel handlers. For this simple initial test I am sending everything to the "RoomChannel", which I had to create:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">RoomChannel</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">Channel</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Guardian</span>.<span style="color:#036;font-weight:bold">Channel</span><tt>
</tt><tt>
</tt>  <span style="color:#888"># no auth is needed for public topics</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">join</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">public:</span><span style="color:#710">"</span></span> &lt;&gt; _topic_id, _auth_msg, socket) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:ok</span>, socket}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">join</span>(topic, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style=""> claims: claims, resource: _resource </span><span style="color:#710">}</span></span>, socket) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> permitted_topic?(claims[<span style="color:#A60">:listen</span>], topic) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      { <span style="color:#A60">:ok</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style=""> message: "Joined" </span><span style="color:#710">}</span></span>, socket }<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      { <span style="color:#A60">:error</span>, <span style="color:#A60">:authentication_required</span> }<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">join</span>(_room, _payload, _socket) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    { <span style="color:#A60">:error</span>, <span style="color:#A60">:authentication_required</span> }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_in</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload, socket = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style=""> topic: "public:" &lt;&gt; _ </span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    broadcast socket, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload<tt>
</tt>    { <span style="color:#A60">:noreply</span>, socket }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_in</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload, socket) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    claims = <span style="color:#036;font-weight:bold">Guardian</span>.<span style="color:#036;font-weight:bold">Channel</span>.claims(socket)<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> permitted_topic?(claims[<span style="color:#A60">:publish</span>], socket.topic) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      broadcast socket, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload<tt>
</tt>      { <span style="color:#A60">:noreply</span>, socket }<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      { <span style="color:#A60">:reply</span>, <span style="color:#A60">:error</span>, socket }<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">permitted_topic?</span>(<span style="color:#038;font-weight:bold">nil</span>, _), <span style="color:#808">do</span>: <span style="color:#038;font-weight:bold">false</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">permitted_topic?</span>([], _), <span style="color:#808">do</span>: <span style="color:#038;font-weight:bold">false</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">permitted_topic?</span>(permitted_topics, topic) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    matches = fn permitted_topic -&gt;<tt>
</tt>      pattern = <span style="color:#036;font-weight:bold">String</span>.replace(permitted_topic, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">:*</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">:.*</span><span style="color:#710">"</span></span>)<tt>
</tt>      <span style="color:#036;font-weight:bold">Regex</span>.match?(~r/<span style="color:#F00;background-color:#FAA">\</span><span style="color:#036;font-weight:bold">A</span><span style="color:#888">#{pattern}\z/, topic)</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Enum</span>.any?(permitted_topics, matches)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is all straight from Daniel's original tutorial, the important bit for this example is the first "join" function, the others deal with permissions and authentication that came through a JWT claim. I will deal with this in Part 2.</p>
<p>To make this work, I had to add the dependencies in "mix.exs":</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># mix.exs</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Mixfile</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Mix</span>.<span style="color:#036;font-weight:bold">Project</span><tt>
</tt>  ...<tt>
</tt>  defp deps <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    [{<span style="color:#A60">:phoenix</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.0.3</span><span style="color:#710">"</span></span>},<tt>
</tt>     {<span style="color:#A60">:phoenix_ecto</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.1</span><span style="color:#710">"</span></span>},<tt>
</tt>     {<span style="color:#A60">:postgrex</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&gt;= 0.0.0</span><span style="color:#710">"</span></span>},<tt>
</tt>     {<span style="color:#A60">:phoenix_html</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 2.1</span><span style="color:#710">"</span></span>},<tt>
</tt>     {<span style="color:#A60">:phoenix_live_reload</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.0</span><span style="color:#710">"</span></span>, <span style="color:#808">only</span>: <span style="color:#A60">:dev</span>},<tt>
</tt>     {<span style="color:#A60">:cowboy</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.0</span><span style="color:#710">"</span></span>},<tt>
</tt>     {<span style="color:#A60">:joken</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.0.0</span><span style="color:#710">"</span></span>},<tt>
</tt>     {<span style="color:#A60">:guardian</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 0.7.0</span><span style="color:#710">"</span></span>}]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And add the configuration at "config.exs":</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/config.exs</span><tt>
</tt>...<tt>
</tt>config <span style="color:#A60">:joken</span>, <span style="color:#808">config_module</span>: <span style="color:#036;font-weight:bold">Guardian</span>.<span style="color:#036;font-weight:bold">JWT</span><tt>
</tt><tt>
</tt>config <span style="color:#A60">:guardian</span>, <span style="color:#036;font-weight:bold">Guardian</span>,<tt>
</tt>  <span style="color:#808">issuer</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ExPusherLite</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">ttl</span>: { <span style="color:#00D;font-weight:bold">30</span>, <span style="color:#A60">:days</span> },<tt>
</tt>  <span style="color:#808">verify_issuer</span>: <span style="color:#038;font-weight:bold">false</span>,<tt>
</tt>  <span style="color:#808">serializer</span>: <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">GuardianSerializer</span>,<tt>
</tt>  <span style="color:#808">atoms</span>: [<span style="color:#A60">:listen</span>, <span style="color:#A60">:publish</span>, <span style="color:#A60">:crews</span>, <span style="color:#A60">:email</span>, <span style="color:#A60">:name</span>, <span style="color:#A60">:id</span>]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now I have to add a normal HTTP POST endpoint, first adding it to the router:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/router.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Router</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:router</span><tt>
</tt><tt>
</tt>  pipeline <span style="color:#A60">:browser</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    plug <span style="color:#A60">:accepts</span>, [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">html</span><span style="color:#710">"</span></span>]<tt>
</tt>    plug <span style="color:#A60">:fetch_session</span><tt>
</tt>    plug <span style="color:#A60">:fetch_flash</span><tt>
</tt>    <span style="color:#888">#plug :protect_from_forgery</span><tt>
</tt>    plug <span style="color:#A60">:put_secure_browser_headers</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt>  scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">ExPusherLite</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    pipe_through <span style="color:#A60">:browser</span> <span style="color:#888"># Use the default browser stack</span><tt>
</tt><tt>
</tt>    get <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">PageController</span>, <span style="color:#A60">:index</span><tt>
</tt>    post <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/events</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">EventsController</span>, <span style="color:#A60">:create</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice that I totally disabled CSRF token verification in the pipeline because I am not sending back Phoenix CSRF token from the Rails controller. Now, the "EventsController" is also almost all from Daniel's tutorial:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/events_controller.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">EventsController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt><tt>
</tt>  plug <span style="color:#A60">:authenticate</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, params) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    topic = params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">topic</span><span style="color:#710">"</span></span>]<tt>
</tt>    event = params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">event</span><span style="color:#710">"</span></span>]<tt>
</tt>    message = (params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">payload</span><span style="color:#710">"</span></span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">{}</span><span style="color:#710">"</span></span>) |&gt; <span style="color:#036;font-weight:bold">Poison</span>.decode!<tt>
</tt>    <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Endpoint</span>.broadcast! topic, event, message<tt>
</tt>    json conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="color:#710">}</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp authenticate(conn, _) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    secret = <span style="color:#036;font-weight:bold">Application</span>.get_env(<span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#A60">:authentication</span>)[<span style="color:#A60">:secret</span>]<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Basic </span><span style="color:#710">"</span></span> &lt;&gt; auth_token = hd(get_req_header(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">authorization</span><span style="color:#710">"</span></span>))<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">Plug</span>.<span style="color:#036;font-weight:bold">Crypto</span>.secure_compare(auth_token, <span style="color:#036;font-weight:bold">Base</span>.encode64(secret)) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      conn<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      conn |&gt; send_resp(<span style="color:#00D;font-weight:bold">401</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span>) |&gt; halt<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I had to change the authenticate function a bit because either I didn't understood Daniel's implementation or it expected something different. But in this version I am just expecting a simple Basic HTTP Authentication "authorization" header which is a string with the format "Basic [base64 username:password]". Look how I am pattern matching the string, removing the Base64 and <a href="https://codahale.com/a-lesson-in-timing-attacks/">"secure comparing"</a> it (a constant-time binary compare to avoid timing attacks, this comes built-in with Phoenix).</p>
<p>This is a simple authentication technique for the Rails controller to POST the message trigger just the same as in the Pusher version.</p>
<p>And this is it, this is all it takes for this initial Phoenix-based Pusher replacement.</p>
<h2>Ex Pusher Lite - Part 2: Changing the Rails application</h2>
<p>Now that we have a bare bone Phoenix app that we can start through "mix phoenix.server" and make it available at "localhost:4000" we can start changing the Rails application.</p>
<p>As I said in the beginning, my original wish was to use the same Pusher javascript client but change the endpoint, turns out it's more difficult than I thought, so I will start by removing the following line from the application layout:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#070">&lt;script</span> <span style="color:#007">src</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">//js.pusher.com/3.0/pusher.min.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We can get rid of the Pusher gem in the Gemfile and the "pusher.rb" initializer as well.</p>
<p>Now, a replacement for the "pusher.min.js" is Phoenix own "phoenix.js" that comes bundled in "deps/phoenix/web/static/js/phoenix.js". The problem is that it is an ES6 javascript source that Phoenix passes through Brunch to be transpiled back to ES5 in every Phoenix application.</p>
<p>But I am copying this file directly to the Rails repository at "app/assets/javascripts/phoenix.es6". I could change it to ES5 but I decided to go the more difficult path and just add Babel support to Rails Asset Pipeline using <a href="https://nandovieira.com/using-es6-with-asset-pipeline-on-ruby-on-rails">Nando's very helpful tutorial</a> on the subject.</p>
<p>The gist goes like this, first we add the dependencies in the Gemfile:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># Use SCSS for stylesheets</span><tt>
</tt><span style="color:#888">#gem 'sass-rails', '~&gt; 5.0'</span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sass-rails</span><span style="color:#710">'</span></span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/sass-rails</span><span style="color:#710">'</span></span>, <span style="color:#808">branch</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">master</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sprockets-rails</span><span style="color:#710">'</span></span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/sprockets-rails</span><span style="color:#710">'</span></span>, <span style="color:#808">branch</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">master</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sprockets</span><span style="color:#710">'</span></span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/sprockets</span><span style="color:#710">'</span></span>, <span style="color:#808">branch</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">master</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">babel-transpiler</span><span style="color:#710">'</span></span><tt>
</tt>...<tt>
</tt>source <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">https://rails-assets.org</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails-assets-almond</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Babel needs some configuration:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/initializers/babel.rb</span><tt>
</tt><span style="color:#036;font-weight:bold">Rails</span>.application.config.assets.configure <span style="color:#080;font-weight:bold">do</span> |env|<tt>
</tt>  babel = <span style="color:#036;font-weight:bold">Sprockets</span>::<span style="color:#036;font-weight:bold">BabelProcessor</span>.new(<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">modules</span><span style="color:#710">'</span></span>    =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">amd</span><span style="color:#710">'</span></span>,<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">moduleIds</span><span style="color:#710">'</span></span>  =&gt; <span style="color:#038;font-weight:bold">true</span><tt>
</tt>  )<tt>
</tt>  env.register_transformer <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">application/ecmascript-6</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">application/javascript</span><span style="color:#710">'</span></span>, babel<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And for some reason I had to manually redeclare application.js and application.css in the assets initializer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/initializers/assets.rb</span><tt>
</tt>...<tt>
</tt><span style="color:#036;font-weight:bold">Rails</span>.application.config.assets.precompile += <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%w(</span><span style=""> application.css application.js </span><span style="color:#710">)</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We need Almond in order to be able to import the Socket module from the Phoenix javascript package. Now, we change the "application.js":</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">//= require almond</span><tt>
</tt><span style="color:#888">//= require jquery</span><tt>
</tt><span style="color:#888">//= require jquery_ujs</span><tt>
</tt><span style="color:#888">//= require turbolinks</span><tt>
</tt><span style="color:#888">//= require phoenix</span><tt>
</tt><span style="color:#888">//= require_tree .</span><tt>
</tt><tt>
</tt>require([<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">application/boot</span><span style="color:#710">'</span></span>]);<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It require an "app/assets/javascripts/application/boot.es6" file, this is straight from Nando's tutorial:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">import</span> <span style="color:#369;font-weight:bold">$</span> from <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">jquery</span><span style="color:#710">'</span></span>;<tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">runner</span>() {<tt>
</tt>  <span style="color:#888">// All scripts must live in app/assets/javascripts/application/pages/**/*.es6.</span><tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> path = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">body</span><span style="color:#710">'</span></span>).data(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">route</span><span style="color:#710">'</span></span>);<tt>
</tt><tt>
</tt>  <span style="color:#888">// Load script for this page.</span><tt>
</tt>  <span style="color:#888">// We should use System.import, but it's not worth the trouble, so</span><tt>
</tt>  <span style="color:#888">// let's use almond's require instead.</span><tt>
</tt>  <span style="color:#080;font-weight:bold">try</span> {<tt>
</tt>    require([path], onload, <span style="color:#038;font-weight:bold">null</span>, <span style="color:#038;font-weight:bold">true</span>);<tt>
</tt>  } <span style="color:#080;font-weight:bold">catch</span> (error) {<tt>
</tt>    handleError(error);<tt>
</tt>  }<tt>
</tt>}<tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">onload</span>(Page) {<tt>
</tt>  <span style="color:#888">// Instantiate the page, passing &lt;body&gt; as the root element.</span><tt>
</tt>  <span style="color:#080;font-weight:bold">var</span> page = <span style="color:#080;font-weight:bold">new</span> Page(<span style="color:#369;font-weight:bold">$</span>(document.body));<tt>
</tt><tt>
</tt>  <span style="color:#888">// Set up page and run scripts for it.</span><tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> (page.setup) {<tt>
</tt>    page.setup();<tt>
</tt>  }<tt>
</tt><tt>
</tt>  page.run();<tt>
</tt>}<tt>
</tt><tt>
</tt><span style="color:#888">// Handles exception.</span><tt>
</tt><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">handleError</span>(error) {<tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> (error.message.match(<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">undefined missing</span><span style="color:#404">/</span></span>)) {<tt>
</tt>    console.warn(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">missing module:</span><span style="color:#710">'</span></span>, error.message.split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style=""> </span><span style="color:#710">'</span></span>).pop());<tt>
</tt>  } <span style="color:#080;font-weight:bold">else</span> {<tt>
</tt>    <span style="color:#080;font-weight:bold">throw</span> error;<tt>
</tt>  }<tt>
</tt>}<tt>
</tt><tt>
</tt><span style="color:#369;font-weight:bold">$</span>(window)<tt>
</tt>  .ready(runner)<tt>
</tt>  .on(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">page:load</span><span style="color:#710">'</span></span>, runner);<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And it relies on attributes in the body tag, so we change our layout template:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/layouts/application.html.erb --&gt;</span><tt>
</tt>...<tt>
</tt><span style="color:#070">&lt;body</span> <span style="color:#007">data-route</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">application/pages/&lt;%= controller.controller_name %</span></span><span style="color:#F00;background-color:#FAA">&gt;</span>/<span style="color:#888">&lt;%= controller.action_name %&gt;</span>"<span style="color:#F00;background-color:#FAA">&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I didn't mention before but I also have a "HomeController" just to be the root path for the main HTML page, it has a single "index" method and "index.html.erb" template with the message form. So I will have the need for an "application/pages/home/index.es6" inside the "app/assets/javascripts" path:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">import</span> {Socket} from <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">phoenix</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">export</span> <span style="color:#080;font-weight:bold">default</span> <span style="color:#080;font-weight:bold">class</span> Index {<tt>
</tt>  constructor(root) {<tt>
</tt>    <span style="color:#963">this</span>.root = root;<tt>
</tt>  }<tt>
</tt><tt>
</tt>  setup() {<tt>
</tt>    <span style="color:#888">// add event listeners</span><tt>
</tt>    console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">-&gt; Setting up Pusher Lite socket</span><span style="color:#710">'</span></span>)<tt>
</tt><tt>
</tt>    let guardianToken = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=guardian-token]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt>    let csrfToken     = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=guardian-csrf]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt>    let pusherKey     = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_key]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt>    let pusherChannel = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_channel]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt>    let socket = <span style="color:#080;font-weight:bold">new</span> Socket(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ws://localhost:4000/socket</span><span style="color:#710">"</span></span>, {<tt>
</tt>      <span style="color:#808">params</span>: { <span style="color:#808">guardian_token</span>: guardianToken, <span style="color:#808">csrf_token</span>: csrfToken }<tt>
</tt>    })<tt>
</tt>    socket.connect()<tt>
</tt><tt>
</tt>    <span style="color:#888">// Now that you are connected, you can join channels with a topic:</span><tt>
</tt>    let channel = socket.channel(pusherChannel, {})<tt>
</tt>    channel.join()<tt>
</tt>      .receive(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ok</span><span style="color:#710">"</span></span>, resp =&gt; { console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Joined successfully</span><span style="color:#710">"</span></span>, resp) })<tt>
</tt>      .receive(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">error</span><span style="color:#710">"</span></span>, resp =&gt; { console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Unable to join</span><span style="color:#710">"</span></span>, resp) })<tt>
</tt><tt>
</tt>    channel.on(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, data =&gt; {<tt>
</tt>      let new_line = <span style="color:#F00;background-color:#FAA">`</span><span style="color:#070">&lt;p&gt;</span><span style="color:#070">&lt;strong&gt;</span>${data.name}<span style="color:#070">&lt;strong&gt;</span>: ${data.message}<span style="color:#070">&lt;/p&gt;</span><span style="color:#F00;background-color:#FAA">`</span><tt>
</tt>      <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.message-receiver</span><span style="color:#710">"</span></span>).append(new_line)<tt>
</tt>    })<tt>
</tt>  }<tt>
</tt><tt>
</tt>  run() {<tt>
</tt>    <span style="color:#888">// trigger initial action (e.g. perform http requests)</span><tt>
</tt>    console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">-&gt; perform initial actions</span><span style="color:#710">'</span></span>)<tt>
</tt>  }<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This bit is similar to the Pusher javascript handling, but we are getting a bit more information from the meta tags, the "guardian-token" and "guardian-csrf" tokens. Because I was following Daniel's tutorial I also changed the name of the event from "new_message" to just "msg" and the topics now need to have a "public:" prefix in order for the Phoenix's RoomChannel handler to match the public topic name correctly.</p>
<p>First things first. In order for this new javascript to have the correct tokens I had to add the following helper in the views layout:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>  <span style="color:#888">&lt;%= csrf_meta_tags %&gt;</span><tt>
</tt>  <span style="color:#888">&lt;%= guardian_token_tags %&gt;</span><tt>
</tt><span style="color:#070">&lt;/head&gt;</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this "guardian_token_tags" is again straight from Daniel's tutorial:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">GuardianHelper</span><tt>
</tt>  <span style="color:#036;font-weight:bold">ISSUER</span> = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pl-web-</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Rails</span>.env<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#036;font-weight:bold">DIGEST</span> = <span style="color:#036;font-weight:bold">OpenSSL</span>::<span style="color:#036;font-weight:bold">Digest</span>.new(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">sha256</span><span style="color:#710">'</span></span>)<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">guardian_token_tags</span><tt>
</tt>    token = <span style="color:#036;font-weight:bold">Base64</span>.urlsafe_encode64(<span style="color:#036;font-weight:bold">SecureRandom</span>.random_bytes(<span style="color:#00D;font-weight:bold">32</span>))<tt>
</tt>    [<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;meta content=</span><span style="color:#b0b">\"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>jwt(token)<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style=""> name=</span><span style="color:#b0b">\"</span><span style="">guardian-csrf</span><span style="color:#b0b">\"</span><span style=""> /&gt;</span><span style="color:#710">"</span></span>,<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;meta content=</span><span style="color:#b0b">\"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>token<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style=""> name=</span><span style="color:#b0b">\"</span><span style="">guardian-token</span><span style="color:#b0b">\"</span><span style=""> /&gt;</span><span style="color:#710">"</span></span>,<tt>
</tt>    ].shuffle.join.html_safe<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  private<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">jwt</span>(token)<tt>
</tt>    <span style="color:#036;font-weight:bold">JWT</span>.encode(jwt_claims(token), <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_key, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">HS256</span><span style="color:#710">'</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">jwt_claims</span>(token)<tt>
</tt>    {<tt>
</tt>      <span style="color:#808">aud</span>: <span style="color:#A60">:csrf</span>,<tt>
</tt>      <span style="color:#808">sub</span>: jwt_sub,<tt>
</tt>      <span style="color:#808">iss</span>: <span style="color:#036;font-weight:bold">ISSUER</span>,<tt>
</tt>      <span style="color:#808">iat</span>: <span style="color:#036;font-weight:bold">Time</span>.now.utc.to_i,<tt>
</tt>      <span style="color:#808">exp</span>: (<span style="color:#036;font-weight:bold">Time</span>.now + <span style="color:#00D;font-weight:bold">30</span>.days).utc.to_i,<tt>
</tt>      <span style="color:#808">s_csrf</span>: guardian_signed_token(token),<tt>
</tt>      <span style="color:#808">listen</span>: jwt_listens,<tt>
</tt>      <span style="color:#808">publish</span>: jwt_publish,<tt>
</tt>    }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">jwt_sub</span><tt>
</tt>    <span style="color:#080;font-weight:bold">return</span> {} <span style="color:#080;font-weight:bold">unless</span> current_human.present?<tt>
</tt>    {<tt>
</tt>      <span style="color:#808">id</span>: current_human.id,<tt>
</tt>      <span style="color:#808">name</span>: current_human.full_name,<tt>
</tt>      <span style="color:#808">email</span>: current_human.email,<tt>
</tt>      <span style="color:#808">crews</span>: current_human.crews.map(&amp;<span style="color:#A60">:identifier</span>),<tt>
</tt>    }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">jwt_listens</span><tt>
</tt>    listens = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">deploys:web</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">public:*</span><span style="color:#710">'</span></span>]<tt>
</tt>    listens.push(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">private:*</span><span style="color:#710">'</span></span>) <span style="color:#080;font-weight:bold">if</span> current_human.try(<span style="color:#A60">:in_crew?</span>, <span style="color:#A60">:admins</span>)<tt>
</tt>    listens<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">jwt_publish</span><tt>
</tt>    publish = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">public:*</span><span style="color:#710">'</span></span>]<tt>
</tt>    publish.push(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">private:*</span><span style="color:#710">'</span></span>) <span style="color:#080;font-weight:bold">if</span> current_human.try(<span style="color:#A60">:in_crew?</span>, <span style="color:#A60">:admins</span>)<tt>
</tt>    publish<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">guardian_signed_token</span>(token)<tt>
</tt>    key = <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_key<tt>
</tt>    signed_token = <span style="color:#036;font-weight:bold">OpenSSL</span>::<span style="color:#036;font-weight:bold">HMAC</span>.digest(<span style="color:#036;font-weight:bold">DIGEST</span>, key, token)<tt>
</tt>    <span style="color:#036;font-weight:bold">Base64</span>.urlsafe_encode64(signed_token).gsub(<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">={1,}$</span><span style="color:#404">/</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I had to tweak it a bit, specially to get the proper keys from the "secrets.yml" file which now looks like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">development</span>:<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="background-color:#fff0f0;color:#D20">ded7c4a2a298c1b620e462b50c9ca6ccb60130e27968357e76cab73de9858f14556a26df885c8aa5004d0a7ca79c0438e618557275bdb28ba67a0ffb0c268056</span><tt>
</tt>  <span style="color:#808">pusher_url</span>: <span style="background-color:#fff0f0;color:#D20">https://&lt;%= ENV['PUSHER_KEY'] %&gt;:&lt;%= ENV['PUSHER_SECRET'] %&gt;@&lt;%= ENV['PUSHER_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_key</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_KEY'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_secret</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_SECRET'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_channel</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">public:test_chat_channel</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#808">test</span>:<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="background-color:#fff0f0;color:#D20">f51ff494801ff0f9e1711036ef6f2f6f1e13544b02326adc5629c6833ae90f1a476747fae94b792eba8a444305df8e7a5ad53f05ea4234692ac96cc44f372029</span><tt>
</tt>  <span style="color:#808">pusher_url</span>: <span style="background-color:#fff0f0;color:#D20">https://&lt;%= ENV['PUSHER_KEY'] %&gt;:&lt;%= ENV['PUSHER_SECRET'] %&gt;@&lt;%= ENV['PUSHER_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_key</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_KEY'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_secret</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_SECRET'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_channel</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">public:test_chat_channel</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#888"># Do not keep production secrets in the repository,</span><tt>
</tt><span style="color:#888"># instead read values from the environment.</span><tt>
</tt><span style="color:#808">production</span>:<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV["SECRET_KEY_BASE"] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_url</span>: <span style="background-color:#fff0f0;color:#D20">https://&lt;%= ENV['PUSHER_KEY'] %&gt;:&lt;%= ENV['PUSHER_SECRET'] %&gt;@&lt;%= ENV['PUSHER_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_key</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_KEY'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_secret</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_SECRET'] %&gt;</span><tt>
</tt>  <span style="color:#808">pusher_channel</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['PUSHER_CHANNEL'] %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>My local ".env" file looks like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">PUSHER_URL: "localhost:4000"<tt>
</tt>PUSHER_KEY: "14e86e5fee3335fa88b0"<tt>
</tt>PUSHER_SECRET: "2b94ff0f07ce9769567f"<tt>
</tt>PUSHER_CHANNEL: "public:test_chat_channel" <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This bit needs more working, I know. I just copied Pusher's key and Pusher's password as KEY and SECRET. This is the bit I mentioned I tweaked in the RoomChannel's authenticate function in the Phoenix side.</p>
<p>Now that I have this in place, I have to change the "PusherEvent" model to trigger the message from the form to the Phoenix's EventsController, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/models/event.rb</span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">net/http</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">uri</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PusherEvent</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">ActiveModel</span>::<span style="color:#036;font-weight:bold">Model</span><tt>
</tt><tt>
</tt>  attr_accessor <span style="color:#A60">:name</span>, <span style="color:#A60">:message</span><tt>
</tt>  validates <span style="color:#A60">:name</span>, <span style="color:#A60">:message</span>, <span style="color:#808">presence</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">save</span><tt>
</tt>    uri = <span style="color:#036;font-weight:bold">URI</span>.parse(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_url<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/events</span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>.post_form(uri, {<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">topic</span><span style="color:#710">"</span></span> =&gt; <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_channel,<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">event</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>,<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">payload</span><span style="color:#710">"</span></span> =&gt; {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">name</span><span style="color:#710">"</span></span> =&gt; name, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">message</span><span style="color:#710">"</span></span> =&gt; message}.to_json<tt>
</tt>    })<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As I am doing this through SuckerPunch, I am using plain old "Net::HTTP.post()" to post the message to the Phoenix "/events" endpoint. Phoenix will properly authenticate because the "pusher_url" is sending the "PUSHER_KEY:PUSHER_SECRET" as HTTP Basic Auth. It will end up in the "authorization" header and Phoenix will properly authenticate the server side, then it will broadcast to the WebSocket connections subscribed to the topic.</p>
<p>The new javascript will subscribe to the "public:test_chat_channel" topic and listen to the "msg" event. Once it receives the payload, it just formats the message and, again, appends to the same place in the "message-receiver" div tag.</p>
<h3>Conclusion: Further Work</h3>
<p>So, with this we have exactly the same behavior than the Pusher version, but now it's under my control.</p>
<p>The idea is for the Phoenix app to have apps, a real authentication for different apps. Then every Rails app I do can just connect to this same Phoenix service.</p>
<p>The next steps include properly implementing the Guardian/JWT pieces, then I can jump to private channels support and add HTTP APIs to list channels in apps and users online in channels.</p>
<p>I will then create a second companion Rails app as an administration dashboard to consume those APIs and be able to create or revoke apps and basic maintenance and reporting. This should be a good enough replacement for a Pusher-like messaging solution that is really fast.</p>
<p></p>
---
title: "Fixing DHH's Rails 5 Chat Demo"
date: "2015-12-28T18:11:00.000Z"
tags: ["rails5", "actioncable", "websocket"]
years: "2015"
---

<p></p>
<p>So, Rails 5.0.0 Beta 1 has <a href="http://weblog.rubyonrails.org/2015/12/18/Rails-5-0-beta1/">just been released</a> and the main new feature is <a href="https://github.com/rails/rails/tree/master/actioncable">Action Cable</a>.</p>
<p>It's basically a complete solution on top of vanilla Rails so you can implement WebSocket based applications (the usual real time chats and notifications) with full access to your Rails assets (models, view templates, etc). For small to medium apps, this is a terrific solution that you might want to use instead of having to go to Node.js.</p>
<p>In summary you control Cable Channels that can receive messages sent through a WebSocket client wiring. The new Channel generator takes care of the boilerplate and you just have to fill in the blanks for what kinds of messages you want to send from the client, what you want to broadcast from the server, and to what channels that your clients are subscribed to.</p>
<p>For a more in-depth introduction, DHH himself published a bare bone <a href="https://www.youtube.com/watch?v=n0WUjGkDFS0">Action Cable screencast</a> that you should watch just to get a feeling of what the fuzz is all about. If you watched it already and have experience in programming, you may have spotted the problem I mention in the title, so just jump to <a href="#the-problem">"The Problem"</a> section below for a TL;DR.</p>
<p>In the end you will end up with a code base like the one I reproduced in my Github repository up until the <a href="https://github.com/akitaonrails/rails5-actioncable-demo/tree/end_of_dhh">tag "end_of_dhh"</a>. You will have a (very) bare bone single-room real time chat app for you to play with the main components.</p>
<p></p>
<p></p>
<p>Let's just list the main components here. First, you will have the ActionCable server mounted in the "routes.rb" file:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/routes.rb</span><tt>
</tt><span style="color:#036;font-weight:bold">Rails</span>.application.routes.draw <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  root <span style="color:#808">to</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rooms#show</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>  <span style="color:#888"># Serve websocket cable requests in-process</span><tt>
</tt>  mount <span style="color:#036;font-weight:bold">ActionCable</span>.server =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">/cable</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is the main server component, the channel:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/channels/room_channel.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">RoomChannel</span> &lt; <span style="color:#036;font-weight:bold">ApplicationCable</span>::<span style="color:#036;font-weight:bold">Channel</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">subscribed</span><tt>
</tt>    stream_from <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">room_channel</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">unsubscribed</span><tt>
</tt>    <span style="color:#888"># Any cleanup needed when channel is unsubscribed</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">speak</span>(data)<tt>
</tt>    <span style="color:#036;font-weight:bold">Message</span>.create! <span style="color:#808">content</span>: data[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">message</span><span style="color:#710">'</span></span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then you have the boilerplace Javascript:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/assets/javascripts/cable.coffee</span><tt>
</tt><span style="color:#888">#= require action_cable</span><tt>
</tt><span style="color:#888">#= require_self</span><tt>
</tt><span style="color:#888">#= require_tree ./channels</span><tt>
</tt><span style="color:#888">#</span><tt>
</tt><span style="color:#33B">@App</span> ||= {}<tt>
</tt><span style="color:#036;font-weight:bold">App</span>.cable = <span style="color:#036;font-weight:bold">ActionCable</span>.createConsumer()<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And the main client-side Websocket hooks:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/assets/javascripts/channels/room.coffee</span><tt>
</tt><span style="color:#036;font-weight:bold">App</span>.room = <span style="color:#036;font-weight:bold">App</span>.cable.subscriptions.create <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">RoomChannel</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">connected</span>: -&gt;<tt>
</tt>    <span style="color:#888"># Called when the subscription is ready for use on the server</span><tt>
</tt><tt>
</tt>  <span style="color:#808">disconnected</span>: -&gt;<tt>
</tt>    <span style="color:#888"># Called when the subscription has been terminated by the server</span><tt>
</tt><tt>
</tt>  <span style="color:#808">received</span>: (data) -&gt;<tt>
</tt>    <span style="color:#F00;background-color:#FAA">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">#messages</span><span style="color:#710">'</span></span>).append data[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">message</span><span style="color:#710">'</span></span>]<tt>
</tt><tt>
</tt>  <span style="color:#808">speak</span>: (message) -&gt;<tt>
</tt>    <span style="color:#33B">@perform</span> <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">speak</span><span style="color:#710">'</span></span>, <span style="color:#808">message</span>: message<tt>
</tt><tt>
</tt><span style="color:#F00;background-color:#FAA">$</span>(document).on <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">keypress</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">[data-behavior~=room_speaker]</span><span style="color:#710">"</span></span>, (event) -&gt;<tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> event.keyCode is <span style="color:#00D;font-weight:bold">13</span><tt>
</tt>    <span style="color:#036;font-weight:bold">App</span>.room.speak event.target.value<tt>
</tt>    event.target.value = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span><tt>
</tt>    event.preventDefault()<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The view template is a bare bone HTML just to hook a simple form and div to list the messages:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/rooms/show.html.erb --&gt;</span><tt>
</tt><span style="color:#070">&lt;h1&gt;</span>Chat room<span style="color:#070">&lt;/h1&gt;</span><tt>
</tt><tt>
</tt><span style="color:#070">&lt;div</span> <span style="color:#007">id</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">messages</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>  <span style="color:#888">&lt;%= render @messages %&gt;</span><tt>
</tt><span style="color:#070">&lt;/div&gt;</span><tt>
</tt><tt>
</tt><span style="color:#070">&lt;form&gt;</span><tt>
</tt>  <span style="color:#070">&lt;label&gt;</span>Say something:<span style="color:#070">&lt;/label&gt;</span><span style="color:#070">&lt;br&gt;</span><tt>
</tt>  <span style="color:#070">&lt;input</span> <span style="color:#007">type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">text</span><span style="color:#710">"</span></span> <span style="color:#007">data-behavior</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">room_speaker</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt><span style="color:#070">&lt;/form&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p><a name="the-problem"></a></p>
<h3>The Problem</h3>
<p>In the "RoomChannel", you have the "<tt>speak</tt>" method that saves a message to the database. This is already a red flag for a WebSocket action that is supposed to have very short lived, light processing. Saving to the database is to be considered heavyweight, specially under load. If this is processed inside EventMachine's reactor loop, it will block the loop and avoid other concurrent processing to take place until the database releases the lock.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/channels/room_channel.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">RoomChannel</span> &lt; <span style="color:#036;font-weight:bold">ApplicationCable</span>::<span style="color:#036;font-weight:bold">Channel</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">speak</span>(data)<tt>
</tt>    <span style="color:#036;font-weight:bold">Message</span>.create! <span style="color:#808">content</span>: data[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">message</span><span style="color:#710">'</span></span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I would say that anything that goes inside the channel should be asynchronous!</p>
<p>To add harm to injury, this is what you have in the "Message" model itself:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Message</span> &lt; <span style="color:#036;font-weight:bold">ApplicationRecord</span><tt>
</tt>  after_create_commit { <span style="color:#036;font-weight:bold">MessageBroadcastJob</span>.perform_later <span style="color:#038;font-weight:bold">self</span> }<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A model callback (avoid those as the plague!!) to broadcast the received messsage to the subscribed Websocket clients as an ActiveJob that looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">MessageBroadcastJob</span> &lt; <span style="color:#036;font-weight:bold">ApplicationJob</span><tt>
</tt>  queue_as <span style="color:#A60">:default</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">perform</span>(message)<tt>
</tt>    <span style="color:#036;font-weight:bold">ActionCable</span>.server.broadcast  <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">room_channel</span><span style="color:#710">'</span></span>, <span style="color:#808">message</span>: render_message(message)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  private<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">render_message</span>(message)<tt>
</tt>    <span style="color:#036;font-weight:bold">ApplicationController</span>.renderer.render(<span style="color:#808">partial</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">messages/message</span><span style="color:#710">'</span></span>, <span style="color:#808">locals</span>: { <span style="color:#808">message</span>: message })<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It renders the HTML snippet to send back for the Websocket clients to append to their browser DOMs.</p>
<p>DHH even goes on to say <em>"I'd like to show it because this is how most apps will end up."</em></p>
<p>Indeed, the <strong>problem</strong> is that most people will just follow this pattern and it's a big trap. So, what's the solution instead?</p>
<h3>The Proper Solution</h3>
<p>For just the purposes of a simple screencast, let's make a quick fix.</p>
<p>First of all, if at all possible you want your channel code to block as little as possible. Waiting for a blocking operation in the database (writing) is definitely not one of them. The Job is underused, it should be called straight from the channel "speak" method, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/channels/room_channel.rb</span><tt>
</tt> <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">RoomChannel</span> &lt; <span style="color:#036;font-weight:bold">ApplicationCable</span>::<span style="color:#036;font-weight:bold">Channel</span><tt>
</tt>   ...<tt>
</tt>   <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">speak</span>(data)<tt>
</tt>-    <span style="color:#036;font-weight:bold">Message</span>.create! <span style="color:#808">content</span>: data[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">message</span><span style="color:#710">'</span></span>]<tt>
</tt>+    <span style="color:#036;font-weight:bold">MessageBroadcastJob</span>.perform_later data[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">message</span><span style="color:#710">'</span></span>]<tt>
</tt>   <span style="color:#080;font-weight:bold">end</span><tt>
</tt> <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then, we move the model writing to the Job itself:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/jobs/message_broadcast_job.rb</span><tt>
</tt> <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">MessageBroadcastJob</span> &lt; <span style="color:#036;font-weight:bold">ApplicationJob</span><tt>
</tt>   queue_as <span style="color:#A60">:default</span><tt>
</tt><tt>
</tt>-  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">perform</span>(message)<tt>
</tt>-    <span style="color:#036;font-weight:bold">ActionCable</span>.server.broadcast  <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">room_channel</span><span style="color:#710">'</span></span>, <span style="color:#808">message</span>: render_message(message)<tt>
</tt>+  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">perform</span>(data)<tt>
</tt>+    message = <span style="color:#036;font-weight:bold">Message</span>.create! <span style="color:#808">content</span>: data<tt>
</tt>+    <span style="color:#036;font-weight:bold">ActionCable</span>.server.broadcast <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">room_channel</span><span style="color:#710">'</span></span>, <span style="color:#808">message</span>: render_message(message)<tt>
</tt>   <span style="color:#080;font-weight:bold">end</span><tt>
</tt>   ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And finally, we remove that horrible callback from the model and make it bare-bone again:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/models/message.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Message</span> &lt; <span style="color:#036;font-weight:bold">ApplicationRecord</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This returns quickly, defer processing to a background job and should sustain more concurrency out-of-the-box. The previous, DHH solution, have a built-in bottleneck in the speak method and will choke as soon as the database becomes the bottleneck.</p>
<p>It's by no means a perfect solution yet, but it's less terrible for a very quick demo and the code ends up being simpler as well. You can check out this code in <a href="https://github.com/akitaonrails/rails5-actioncable-demo/commit/0aaaaecc46ed14e98086bac5ce087df08d557456">my Github repo commit</a>.</p>
<p>I may be wrong in the conclusion that the channel will block or if this is indeed harmful for the concurrency. I didn't measure both solutions, it's just a gut feeling from older wounds. If you have more insight into the implementation of Action Cable, leave a comment down below.</p>
<p>By the way, be careful before considering migrating your Rails 4.2 app to Rails 5 just yet. Because of the hard coded dependencies on Faye, Eventmachine, Rails 5 right now rules out Unicorn (even Thin seems to be having problem booting up). It also rules out JRuby and MRI on Windows as well because of Eventmachine.</p>
<p>If you want the capabilities of Action Cable without having to migrate, you can use solutions such as <a href="https://developers.planningcenteronline.com/2014/09/23/live-updating-rails-with-react.js-and-pusher.html">"Pusher.com"</a>, or if you want your own in-house solution, follow my evolution on the subject with my <a href="https://www.akitaonrails.com/pusher">mini-Pusher clone</a> written in Elixir.</p>
<p></p>
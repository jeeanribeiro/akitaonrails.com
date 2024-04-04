---
title: "ExMessenger Exercise: Understanding Nodes in Elixir"
date: "2015-11-25T15:19:00.000Z"
tags: ["beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p>I was exercising through this <a href="http://drew.kerrigan.io/ditributed-elixir/">2014's old blog post</a> by Drew Kerrigan where he builds a bare bones, command line-based, chat application, with a client that send messages and commands to a server.</p>
<p>This is Elixir pre-1.0, and because it's an exercise I refactored the original code and merged the server (ex_messenger) and client (ex_messenger_client) projects into an <a href="http://elixir-lang.org/getting-started/mix-otp/dependencies-and-umbrella-apps.html">Elixir Umbrella</a> project and you can find my code on <a href="https://github.com/akitaonrails/ex_messenger_exercise/blob/master/apps/ex_messenger_client/lib/ex_messenger_client.ex">Github here</a>.</p>
<p>If you have multiple applications that work together and share the same dependencies you can use the Umbrella convention to have them all in the same code base. If you <tt>mix compile</tt> from the umbrella root, it compiles all the apps (which are independent Elixir mix projects as well), it's just a way to have related apps in the same place instead of in multiple different repositories.</p>
<p>The code shown here is in <a href="https://github.com/akitaonrails/ex_messenger_exercise">my personal Github repository</a> if you want to clone it.</p>
<p></p>
<p></p>
<h3>Nodes 101</h3>
<p>Before we check out the exercise, there is one more concept I need to clear out. In the previous article I explained about how you can start processes and exchange messages and how you can use the OTP GenServer and Supervisor to create more robust and fault tolerant processes.</p>
<p>But this is just the beginning of the story. You probably heard how Erlang is great for distributed computing as well. Each Erlang VM (or BEAM) is network enabled.</p>
<p>Again, this is one more concept I am still just beginning to properly learn, and you will want to read Elixir's website documentation on <a href="https://elixir-lang.org/getting-started/mix-otp/distributed-tasks-and-configuration.html">Distributed tasks and configuration</a>, that does an excellent job explaining how all this works.</p>
<p>But just to get started you can simply start 2 IEx sessions. From one terminal you can do:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex --sname fabio --cookie chat<tt>
</tt><tt>
</tt>Erlang/OTP 18 [erts-7.1] [source] [64-bit] [smp:4:4] [async-threads:10] [kernel-poll:false]<tt>
</tt><tt>
</tt>Interactive Elixir (1.1.1) - press Ctrl+C to exit (type h() ENTER for help)<tt>
</tt>iex(fabio@Hal9000u)1&gt; <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And from a different terminal you can do:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex --sname akita --cookie chat<tt>
</tt><tt>
</tt>Erlang/OTP 18 [erts-7.1] [source] [64-bit] [smp:4:4] [async-threads:10] [kernel-poll:false]<tt>
</tt><tt>
</tt>Interactive Elixir (1.1.1) - press Ctrl+C to exit (type h() ENTER for help)<tt>
</tt>iex(akita@Hal9000u)1&gt; <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice how the IEx shell shows different Node names for each instance: "fabio@Hal9000u" and "akita@Hal9000u". It's the sname concatenated with your machine name. From one instance you can ping the other, for example:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(akita@Hal9000u)2&gt; Node.ping(:"fabio@Hal9000u")<tt>
</tt>:pong<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If the name is correct and the other instance is indeed up, it responds the ping with a <tt>:pong</tt>. This is correct just for nodes in the same machine, but what if I need to connect to an instance in a remote machine?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(akita@Hal9000u)3&gt; Node.ping(:"fabio@192.168.1.13")<tt>
</tt><tt>
</tt>11:02:46.152 [error] ** System NOT running to use fully qualified hostnames **<tt>
</tt>** Hostname 192.168.1.13 is illegal **<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <tt>--sname</tt> option sets a name only reachable within the same subnet, for a fully qualified domain name you need to use the <tt>--name</tt>, for example, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex  --name fabio@192.168.1.13 --cookie chat<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And for the other node:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex --name akita@192.168.1.13 --cookie chat<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And from this second terminal you can ping the other node the same way as before:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(akita@192.168.1.13)1&gt; Node.ping(:"fabio@192.168.1.13")<tt>
</tt>:pong<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you might be wondering, what is this "<tt>--cookie</tt>" thing? Just spin up a third terminal with another client name, but without the cookie, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex --name john@192.168.1.13<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And if you try to ping one of the first two nodes you won't get a <tt>:pong</tt> back:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(john@192.168.1.13)1&gt; Node.ping(:"fabio@192.168.1.13")<tt>
</tt>:pang<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The cookie is just an atom to identify relationship between nodes. In a pool of several servers you can make sure you're not trying to connect different applications between each other. And as a result you get a <tt>:pang</tt>. Instead of an IP address you can use a fully qualified domain name instead.</p>
<p>And just by having the node "akita@" pinging "fabio@" we can see that they are aware of each other:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(fabio@192.168.1.13)2&gt; Node.list<tt>
</tt>[:"akita@192.168.1.13"]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(akita@192.168.1.13)2&gt; Node.list<tt>
</tt>[:"fabio@192.168.1.13"]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If one of the node crashes or quits, the Node list is automatically refreshed to reflect only nodes that are actually alive and responding.</p>
<p>You can check the official API Reference for the <a href="https://elixir-lang.org/docs/stable/elixir/Node.html#summary">Node</a> for more information. But this should give you a hint for the next section.</p>
<h3>Creating a Chat Client</h3>
<p>Back to the exercise, the ExMessenger server has "ExMessenger.Server", which is a GenServer and the "ExMessenger.Supervisor" that starts it up. The ExMessenger.Server is globally registered as <tt>:message_server</tt>, started and supervised by the "ExMessenger.Supervisor".</p>
<p>The "ExMessengerClient" starts up the unsupervised "ExMessengerClient.MessageHandler", which is also a GenServer, and globally registered as <tt>:message_handler</tt>.</p>
<p>The Tree for both apps look roughly like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">ExMessenger<tt>
</tt>- ExMessenger.Supervisor<tt>
</tt>    + ExMessenger.Server<tt>
</tt>ExMessengerClient<tt>
</tt>- ExMessengerClient.MessageHandler<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We start them separately, first the message server:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cd apps/ex_messenger<tt>
</tt>iex --sname server --cookie chocolate-chip -S mix run<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice that for this example we are starting with a simple name "server", for the local subnet, and a cookie. If will respond as "server@Hal9000u" (Hal9000u being my local machine's name).</p>
<p>Then, we can start the client app:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cd apps/ex_messenger_client<tt>
</tt>server=server@Hal9000u nick=john elixir --sname client -S mix run<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Here we are setting 2 environment variables (that we can retrieve inside the app using <tt>System.get_env/1</tt>) and also setting a local node name "client". You can spin up more client nodes using a different "sname" and a different "nick" from another terminal, as many as you want, linking to the same "server@Hal9000u" message server.</p>
<p>I'm starting up like this instead of a command line escript like I did in the ExMangaDownloadr because I didn't find any way to set the <tt>--sname</tt> or <tt>--name</tt> the same way I can set <tt>--cookie</tt> using <tt>Node.set_cookie</tt>. If anyone knows how to set it up differently, let me know in the comments section down below.</p>
<p>Notice that I said "linking" and not "connecting". From the "ExMessengerClient" we start like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMessengerClient</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Application</span><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">CLI</span><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">ServerProcotol</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start</span>(_type, _args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    get_env<tt>
</tt>      |&gt; connect<tt>
</tt>      |&gt; start_message_handler<tt>
</tt>      |&gt; join_chatroom<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">CLI</span>.input_loop<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <tt>get_env</tt> private function is just a wrapper to treat the environment variable "server" and "nick" that we passed:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp get_env <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  server = <span style="color:#036;font-weight:bold">System</span>.get_env(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">server</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">String</span>.rstrip<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">String</span>.to_atom<tt>
</tt>  nick = <span style="color:#036;font-weight:bold">System</span>.get_env(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">nick</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">String</span>.rstrip<tt>
</tt>  {server, nick}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, we try to connect to the remote server:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp connect({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Connecting to </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>server<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> from </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Node</span>.self<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> ...</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#036;font-weight:bold">Node</span>.set_cookie(<span style="color:#036;font-weight:bold">Node</span>.self, <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">chocolate-chip</span><span style="color:#630">"</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">Node</span>.connect(server) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#038;font-weight:bold">true</span> -&gt; <span style="color:#A60">:ok</span><tt>
</tt>    reason -&gt;<tt>
</tt>      <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Could not connect to server, reason: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>reason<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>      <span style="color:#036;font-weight:bold">System</span>.halt(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  {server, nick}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The important piece here is that we are setting the client's instance cookie with <tt>Node.set_cookie/1</tt> (notice that we didn't pass it in the command line options like we did with the server instance). Without setting the cookie the next line with <tt>Node.connect(server)</tt> would fail to connect, as I explained in the previous section.</p>
<p>Then, we start the "ExMessengerClient.MessageHandler" GenServer, linking with the Message Server instance:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp start_message_handler({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">MessageHandler</span>.start_link(server)<tt>
</tt>  <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Connected</span><span style="color:#710">"</span></span><tt>
</tt>  {server, nick}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The Message Handler GenServer itself is very simple, it just sets the server as the state and handle incoming messages from the server and prints out in the client's terminal:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">MessageHandler</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">GenServer</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start_link</span>(server) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#A60">:gen_server</span>.start_link({ <span style="color:#A60">:local</span>, <span style="color:#A60">:message_handler</span> }, __MODULE__, server, [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>(server) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    { <span style="color:#A60">:ok</span>, server }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_cast</span>({ <span style="color:#A60">:message</span>, nick, message }, server) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    message = message |&gt; <span style="color:#036;font-weight:bold">String</span>.rstrip<tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>server<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">&gt; </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>nick<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.write <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Node</span>.self<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">&gt; </span><span style="color:#710">"</span></span><tt>
</tt>    {<span style="color:#A60">:noreply</span>, server}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Going back to the main "ExMessengerClient" module, after starting the (unsupervised) GenServer that receives incoming messages, we proceed to join the pseudo-chatroom in the server:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp join_chatroom({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">ServerProcotol</span>.connect({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:ok</span>, users} -&gt;<tt>
</tt>      <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">* Joined the chatroom *</span><span style="color:#710">"</span></span><tt>
</tt>      <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">* Users in the room: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>users<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> *</span><span style="color:#710">"</span></span><tt>
</tt>      <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">* Type /help for options *</span><span style="color:#710">"</span></span><tt>
</tt>    reason -&gt;<tt>
</tt>      <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Could not join chatroom, reason: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>reason<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>      <span style="color:#036;font-weight:bold">System</span>.halt(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  {server, nick}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I defined this "ServerProcotol" module which is just a convenience wrapper for <tt>GenServer.call/3</tt> and <tt>GenServer.cast/2</tt> calls, to send messages for the remote GenServer called <tt>:message_server</tt>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">ServerProcotol</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">connect</span>({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    server |&gt; call({<span style="color:#A60">:connect</span>, nick})<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">disconnect</span>({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    server |&gt; call({<span style="color:#A60">:disconnect</span>, nick})<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">list_users</span>({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    server |&gt; cast({<span style="color:#A60">:list_users</span>, nick})<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">private_message</span>({server, nick}, to, message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    server |&gt; cast({<span style="color:#A60">:private_message</span>, nick, to, message})<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">say</span>({server, nick}, message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    server |&gt; cast({<span style="color:#A60">:say</span>, nick, message})<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp call(server, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">GenServer</span>.call({<span style="color:#A60">:message_server</span>, server}, args)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp cast(server, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">GenServer</span>.cast({<span style="color:#A60">:message_server</span>, server}, args)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pretty straight forward. Then, the main ExMessengerClient calls the recursive <tt>input_loop/1</tt> function from the CLI module, which just receives user input and handles the proper commands using pattern matching, like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">CLI</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMessengerClient</span>.<span style="color:#036;font-weight:bold">ServerProcotol</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">input_loop</span>({server, nick}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.write <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Node</span>.self<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">&gt; </span><span style="color:#710">"</span></span><tt>
</tt>    line = <span style="color:#036;font-weight:bold">IO</span>.read(<span style="color:#A60">:line</span>)<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">String</span>.rstrip<tt>
</tt>    handle_command line, {server, nick}<tt>
</tt>    input_loop {server, nick}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/help</span><span style="color:#710">"</span></span>, _args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""><tt>
</tt>    Available commands:<tt>
</tt>      /leave<tt>
</tt>      /join<tt>
</tt>      /users<tt>
</tt>      /pm &lt;to nick&gt; &lt;message&gt;<tt>
</tt>      or just type a message to send<tt>
</tt>    </span><span style="color:#710">"</span></span><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/leave</span><span style="color:#710">"</span></span>, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ServerProcotol</span>.disconnect(args)<tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">You have exited the chatroom, you can rejoin with /join or quit with /quit</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/quit</span><span style="color:#710">"</span></span>, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ServerProcotol</span>.disconnect(args)<tt>
</tt>    <span style="color:#036;font-weight:bold">System</span>.halt(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/join</span><span style="color:#710">"</span></span>, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ServerProcotol</span>.connect(args)<tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Joined the chatroom</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/users</span><span style="color:#710">"</span></span>, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ServerProcotol</span>.list_users(args)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span>, _args), <span style="color:#808">do</span>: <span style="color:#A60">:ok</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(<span style="color:#038;font-weight:bold">nil</span>, _args), <span style="color:#808">do</span>: <span style="color:#A60">:ok</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_command</span>(message, args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">String</span>.contains?(message, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/pm</span><span style="color:#710">"</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      {to, message} = parse_private_recipient(message)<tt>
</tt>      <span style="color:#036;font-weight:bold">ServerProcotol</span>.private_message(args, to, message)<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      <span style="color:#036;font-weight:bold">ServerProcotol</span>.say(args, message)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp parse_private_recipient(message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    [to|message] = message<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">String</span>.slice(<span style="color:#00D;font-weight:bold">4</span>..<span style="color:#00D;font-weight:bold">-1</span>)<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">String</span>.split<tt>
</tt>    message = message<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">List</span>.foldl(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span>, fn(x, acc) -&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>acc<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>x<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">String</span>.lstrip<tt>
</tt>    {to, message}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this wraps up the Client.</p>
<h3>Creating a Chat Server</h3>
<p>The Chat Client sends GenServer messages to a remote <tt>{:message_server, server}</tt>, and in the example, <tt>server</tt> is just the sname "server@Hal9000u" atom.</p>
<p>Now, we need this <tt>:message_server</tt> and this is the "ExMessenger.Server" GenServer:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMessenger</span>.<span style="color:#036;font-weight:bold">Server</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">GenServer</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">Logger</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start_link</span>([]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#A60">:gen_server</span>.start_link({ <span style="color:#A60">:local</span>, <span style="color:#A60">:message_server</span> }, __MODULE__, [], [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>([]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    { <span style="color:#A60">:ok</span>, <span style="color:#036;font-weight:bold">HashDict</span>.new }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is it, when the "ExMessenger.Supervisor" starts this GenServer it register globally in this instance as <tt>:message_server</tt>. And this how we address messages from what we called "clients" (the ExMessengerClient application).</p>
<p>When the ExMessengerClient calls the <tt>ServerProtocol.connect/1</tt>, it sends the <tt>{:connect, nick}</tt> message to the server. In the Server we handle it like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({ <span style="color:#A60">:connect</span>, nick }, {from, _} , users) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  cond <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    nick == <span style="color:#A60">:server</span> <span style="color:#080;font-weight:bold">or</span> nick == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">server</span><span style="color:#710">"</span></span> -&gt;<tt>
</tt>      {<span style="color:#A60">:reply</span>, <span style="color:#A60">:nick_not_allowed</span>, users}<tt>
</tt>    <span style="color:#036;font-weight:bold">HashDict</span>.has_key?(users, nick) -&gt;<tt>
</tt>      {<span style="color:#A60">:reply</span>, <span style="color:#A60">:nick_in_use</span>, users}<tt>
</tt>    <span style="color:#038;font-weight:bold">true</span> -&gt;<tt>
</tt>      new_users = users |&gt; <span style="color:#036;font-weight:bold">HashDict</span>.put(nick, node(from))<tt>
</tt>      user_list = log(new_users, nick, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">has joined</span><span style="color:#710">"</span></span>)<tt>
</tt>      {<span style="color:#A60">:reply</span>, { <span style="color:#A60">:ok</span>, user_list }, new_users}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>First, it checks if the nick is "server" and disallows it. Second, it checks if the nickname already exists in the internal <a href="https://elixir-lang.org/docs/stable/elixir/HashDict.html">HashDict</a> (a key/value dictionary) and refuses if it already exists. Finally, in third, it puts the pair of nickname and node name (like "client@Hal9000u") in the HashDict and broadcasts through the <tt>log/3</tt> private function to all other nodes in the HashDict dictionary.</p>
<p>The <tt>log/3</tt> is just to create a log message concatenating the nick names of all clients and printing it out, then broadcasting this to the Message Handler of all the clients listed in the HashDict:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp log(users, nick, message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  user_list = users |&gt; <span style="color:#036;font-weight:bold">HashDict</span>.keys |&gt; <span style="color:#036;font-weight:bold">Enum</span>.join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">:</span><span style="color:#710">"</span></span>)<tt>
</tt>  <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>nick<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">, user_list: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>user_list<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>  say(nick, message)<tt>
</tt>  user_list<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">say</span>(nick, message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">GenServer</span>.cast(<span style="color:#A60">:message_server</span>, { <span style="color:#A60">:say</span>, nick, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">* </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>nick<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> *</span><span style="color:#710">"</span></span> })<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_cast</span>({ <span style="color:#A60">:say</span>, nick, message }, users) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ears = <span style="color:#036;font-weight:bold">HashDict</span>.delete(users, nick)<tt>
</tt>  <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>nick<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> said </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>  broadcast(ears, nick, message)<tt>
</tt>  {<span style="color:#A60">:noreply</span>, users}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Up to this point it just casts a message to itself, the <tt>{:say, nick, message}</tt> tuple, that is handled by the GenServer and calling the <tt>broadcast/3</tt> function defined like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp broadcast(users, nick, message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Enum</span>.map(users, fn {_, node} -&gt;<tt>
</tt>    <span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt;<tt>
</tt>      send_message_to_client(node, nick, message)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.await/<span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>defp send_message_to_client(client_node, nick, message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">GenServer</span>.cast({ <span style="color:#A60">:message_handler</span>, client_node }, { <span style="color:#A60">:message</span>, nick, message })<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It maps the list of users and fire up an asynchronous Elixir <tt>Task</tt> (that is itself just a GenServer as I explained before in the Ex Manga Downloader series). Because it's a broadcast it makes sense to make all of them parallel.</p>
<p>The important bit is the <tt>send_message_to_client/3</tt> which casts a message to the tuple <tt>{ :message_handler, client_node }</tt> where "client_node" is just "client@Hal9000u" or any other "--sname" you used to start up each client node.</p>
<p>Now, this is how the clients send GenServer message calls/casts to <tt>{:message_server, server}</tt> and it send messages back to <tt>{:message_handler, client</tt>.</p>
<h3>This is not your traditional TCP Client/Server example!</h3>
<p>Now, we are calling the "ExMessenger.Server" a Chat "Server" and the "ExMessengerClient" a Chat "Client". Although we have been calling them as "Server" and "Client" they don't refer to the usual "TCP Server" and "TCP Client" examples you may be familiar with!</p>
<p>The ExMessenger.Server is indeed a Server (an OTP GenServer) but the ExMessengerClient.MessageHandler is also a Server (another OTP GenServer)! But because they <strong>both</strong> have Node behavior, it's more like they are 2 peer-to-peer nodes instead of your old school, simple client-&gt;server relationship. They can have client behavior (the Server sends messages to the MessageHandler) and server behavior (the Server receiving messages from ExMessengerClient).</p>
<p>Let this concept sink in for a moment, built-in with the language you get a full blown, easy to use, peer-to-peer network distribution model. You don't need to have one single node to be elected as the sole "node", you could have all nodes in a ring to coordinate between them, avoiding single points of failure.</p>
<p>I believe this is maybe how Erlang based services such as <a href="https://manpages.ubuntu.com/manpages/hardy/man8/ejabberd.8.html">ejabberd</a> and <a href="https://www.rabbitmq.com/clustering.html">RabbitMQ</a> work.</p>
<p>In the <a href="https://github.com/processone/ejabberd/blob/master/src/ejabberd_cluster.erl">case of ejabberd</a>, I can see that it keeps the state of the cluster in Mnesia tables (Mnesia being one other component of OTP, it's a distributed NoSQL database built-in!) and it indeed use the Node facilities to coordinate distributed nodes:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>join(Node) -&gt;<tt>
</tt>    case {node(), net_adm:ping(Node)} of<tt>
</tt>        {Node, _} -&gt;<tt>
</tt>            {error, {not_master, Node}};<tt>
</tt>        {_, pong} -&gt;<tt>
</tt>            application:stop(ejabberd),<tt>
</tt>            application:stop(mnesia),<tt>
</tt>            mnesia:delete_schema([node()]),<tt>
</tt>            application:start(mnesia),<tt>
</tt>            mnesia:change_config(extra_db_nodes, [Node]),<tt>
</tt>            mnesia:change_table_copy_type(schema, node(), disc_copies),<tt>
</tt>            spawn(fun()  -&gt;<tt>
</tt>                lists:foreach(fun(Table) -&gt;<tt>
</tt>                            Type = call(Node, mnesia, table_info, [Table, storage_type]),<tt>
</tt>                            mnesia:add_table_copy(Table, node(), Type)<tt>
</tt>                    end, mnesia:system_info(tables)--[schema])<tt>
</tt>                end),<tt>
</tt>            application:start(ejabberd);<tt>
</tt>        _ -&gt;<tt>
</tt>            {error, {no_ping, Node}}<tt>
</tt>    end.<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how a snippet of pure Erlang source code looks like, by the way. You should have enough Elixir in your head right now to be able to abstract away the ugly Erlang syntax and see that it's a <tt>case</tt> pattern matching on the <tt>{_, :pong}</tt> tupple, using Node's ping facilities to assert the connectiviness of the node and updating the Mnesia table and other setups.</p>
<p>Also in the <a href="https://github.com/rabbitmq/rabbitmq-server/blob/6f70dcbe05dbba35f7d950674d293a4c7d867d44/src/rabbit_control_main.erl">source code of the RabbitMQ-Server</a> you will find a similar thing:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">become(BecomeNode) -&gt;<tt>
</tt>    error_logger:tty(false),<tt>
</tt>    ok = net_kernel:stop(),<tt>
</tt>    case net_adm:ping(BecomeNode) of<tt>
</tt>        pong -&gt; exit({node_running, BecomeNode});<tt>
</tt>        pang -&gt; io:format("  * Impersonating node: ~s...", [BecomeNode]),<tt>
</tt>                {ok, _} = rabbit_cli:start_distribution(BecomeNode),<tt>
</tt>                io:format(" done~n", []),<tt>
</tt>                Dir = mnesia:system_info(directory),<tt>
</tt>                io:format("  * Mnesia directory  : ~s~n", [Dir])<tt>
</tt>    end.<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, pinging nodes, using Mnesia for the server state. Erlang's syntax is uncommon for most of us: variables start with a capitalized letter (we intuitively think it's a constant instead), statements end with a dot, instead of the dot-notation to call function from a module it uses a colon ":", different from Elixir the parenthesis are not optional, and so on. Trying to read code like this show the value of having Elixir to unleash Erlang's hidden powers.</p>
<p>So, up to this point, you know how internally processes are spawn, how they are orchestrated within the OTP framework, and now how they can interact remotely through the <strong>Node</strong> peer-to-peer abstraction. And again, this is all built-in to the language. No other language come even close.</p>
<p></p>
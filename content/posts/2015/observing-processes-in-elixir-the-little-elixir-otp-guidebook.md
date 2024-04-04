---
title: "Observing Processes in Elixir - The Little Elixir & OTP Guidebook"
date: "2015-11-22T16:57:00.000Z"
tags: ["beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p>In my journey to really understand how a proper Elixir application should be written I am exercising through Benjamin Tan Wei Hao's excelent <a href="https://www.manning.com/books/the-little-elixir-and-otp-guidebook">The Little Elixir &amp; OTP Guidebook</a>. If you're just getting started, this is a no-brainer: buy and study this guidebook. Yes, it will help if you already read Dave Thomas' <a href="https://pragprog.com/book/elixir/programming-elixir">Programming Elixir</a> book first.</p>
<p>In my <a href="http://www.akitaonrails.com/2015/11/19/ex-manga-downloadr-part-2-poolboy-to-the-rescue">Ex Manga Downloadr Part 2</a> article I explored adding better process pool control using the excelent and robust Poolboy library. One of the guidebook main exercises is to build a simpler version of Poolboy in pure Elixir (Poolboy is written in good, old, Erlang).</p>
<p>This main goal of this article is to introduce what <strong>Fault Tolerance</strong> in Erlang/Elixir mean and it is also an excuse for me to show off Erlang's observer:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/528/big_observer-kill.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/528/observer-kill.png 2x" alt="Observer"></p>
<p></p>
<p></p>
<p>Yes, Erlang allows us to not just see what's going on inside its runtime environment but we can even take action on individual Processes running inside it! How cool is that?</p>
<p>But before we can show Fault Tolerancy and the Observer I need to explain what Processes are, and why they matter. You <strong>must</strong> understand the following concepts to successfully understand Elixir programming:</p>
<ol>
  <li>You don't have "objects", which are runtime instances of classes (or prototipical objects, which are copies of other objects). Instead of "Classes" you have collections of functions organized in modules, without dependency in internal state. And instead of "objects" we have, roughly speaking, "processes". For example:</li>
</ol>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">MyProcess</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    accepting_messages(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">accepting_messages</span>(state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    receive <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      {<span style="color:#A60">:hello</span>, message} -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Hello, </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>        accepting_messages(state)<tt>
</tt>      {<span style="color:#A60">:counter</span>} -&gt;<tt>
</tt>        new_state = state + <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>        <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">New state is </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>new_state<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>        accepting_messages(new_state)<tt>
</tt>      _ -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">What?</span><span style="color:#710">"</span></span><tt>
</tt>        accepting_messages(state)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<ol>
  <li>We can execute a function inside another process. This is how we can spawn a brand new, concurrent, lightweight process:</li>
</ol>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">2</span>)&gt; pid = spawn fn -&gt; <span style="color:#036;font-weight:bold">MyProcess</span>.start <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888">#PID&lt;0.87.0&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>When the <tt>accepting_messages/1</tt> is called, it stops at the <tt>receive/0</tt> block, waiting to receive a new message. Then we can send messages like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">3</span>)&gt; send pid, {<span style="color:#A60">:hello</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">world</span><span style="color:#710">"</span></span>}<tt>
</tt><span style="color:#036;font-weight:bold">Hello</span>, world<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It receives the <tt>{:hello, "world"}</tt> atom message, it pattern matches the value <tt>"world"</tt> into the <tt>message</tt> variable, and concatenates the <tt>"Hello, world"</tt> string, which it prints out with <tt>IO.puts/1</tt> and recurse to itself again. We call the <tt>receive/0</tt> block again, and block, waiting for further messages:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">4</span>)&gt; send pid, {<span style="color:#A60">:counter</span>}<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>{<span style="color:#A60">:counter</span>}<tt>
</tt>iex(<span style="color:#00D;font-weight:bold">5</span>)&gt; send pid, {<span style="color:#A60">:counter</span>}<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">2</span><tt>
</tt>{<span style="color:#A60">:counter</span>}<tt>
</tt>iex(<span style="color:#00D;font-weight:bold">6</span>)&gt; send pid, {<span style="color:#A60">:counter</span>}<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">3</span><tt>
</tt>{<span style="color:#A60">:counter</span>}<tt>
</tt>iex(<span style="color:#00D;font-weight:bold">7</span>)&gt; send pid, {<span style="color:#A60">:counter</span>}<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">4</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We send the <tt>{:counter}</tt> message to the same process pid again and when it receive this message, it gets the <tt>state</tt> value from the function argument, increments it by 1, prints out the new state, and calls itself again passing the new state as the new argument. It blocks again, waiting for further messages, and for each time it receives the <tt>{:counter}</tt> message, it increases the previous state by one again and recurses.</p>
<p>This is basically how we can maintain state in Elixir. If we kill this process and spawn a new one, it restarts with zero (which is what the <tt>start/0</tt>) function does.</p>
<ol>
  <li>
    <p>So, while you don't have "objects" you do, however, have Processes. Superficially, a process behaves like an "object". Careful not to think that a Process is like a heavyweight Thread though. Erlang has its own internal scheduler that controls the concurrency of parallels and you can load as many as 16 billion lightweight processes if your hardware allows it. Threads are super heavy, Erlang processes are super light.</p>
  </li>
  <li>
    <p>As we saw in the example, each process has its own internal mechanism to receive messages from other processes. Those messages accumulate in an internal "mailbox" and you can choose to <tt>receive</tt> and pattern match through those messages, recursing to itself again in order to receive new messages if you want.</p>
  </li>
  <li>
    <p>Processes can be linked to or monitor other processes, for example, within an IEx shell, we are within an Elixir process, so we could do:</p>
  </li>
</ol>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">1</span>)&gt; <span style="color:#038;font-weight:bold">self</span><tt>
</tt><span style="color:#888">#PID&lt;0.98.0&gt;</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">2</span>)&gt; pid = spawn fn -&gt; <span style="color:#036;font-weight:bold">MyProcess</span>.start <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888">#PID&lt;0.105.0&gt;</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">3</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.alive?(pid)<tt>
</tt><span style="color:#038;font-weight:bold">true</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">4</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.link(pid)<tt>
</tt><span style="color:#038;font-weight:bold">true</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>With <tt>self</tt> we can see that the current process id for the IEx shell is "0.98.0". Then we spawn a process that calls <tt>Myprocess.start/0</tt> again, it will block in the receive call. This new process has a different id, "0.105.0".</p>
<p>We can assert that the new process is indeed alive and we can link the IEx shell with the "0.105.0" pid process. Now, whatever happens to this process will cascade to the shell.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">5</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.exit(pid, <span style="color:#A60">:kill</span>)<tt>
</tt>** (<span style="color:#036;font-weight:bold">EXIT</span> from <span style="color:#888">#PID&lt;0.98.0&gt;) killed</span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Interactive</span> <span style="color:#036;font-weight:bold">Elixir</span> (<span style="color:#60E;font-weight:bold">1.1</span>.<span style="color:#00D;font-weight:bold">1</span>) - press <span style="color:#036;font-weight:bold">Ctrl</span>+<span style="color:#036;font-weight:bold">C</span> to exit (type h() <span style="color:#036;font-weight:bold">ENTER</span> <span style="color:#080;font-weight:bold">for</span> help)<tt>
</tt><span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">home</span><span style="color:#404">/</span></span>akitaonrails/.iex.exs:<span style="color:#00D;font-weight:bold">1</span>: <span style="color:#808">warning</span>: redefining <span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">R</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">1</span>)&gt; <span style="color:#038;font-weight:bold">self</span><tt>
</tt><span style="color:#888">#PID&lt;0.109.0&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And indeed, if we forcefully send a kill message to the "0.105.0" process, the IEx shell is also killed in the process. IEx restarts and its new pid is "0.109.0" instead of the old "0.98.0". By the way this is one way a process is different from a normal object. It behaves more like an operating system process where a crash in a process does not affect the whole system as it does not hold external shared state that can corrupt the system's state.</p>
<p>The important concept is that we now have a mechanism to define a Parent Process (IEx in this example) and Children processes linked to it.</p>
<ol>
  <li>Parent processes don't need to stupidly suicide itself because their children screwed up. Instead, they can trap exits and decide what to do later:</li>
</ol>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">2</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.flag(<span style="color:#A60">:trap_exit</span>, <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt><span style="color:#038;font-weight:bold">false</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">3</span>)&gt; pid = spawn_link fn -&gt; <span style="color:#036;font-weight:bold">MyProcess</span>.start <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888">#PID&lt;0.118.0&gt;</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">4</span>)&gt; send pid, {<span style="color:#A60">:counter</span>}<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>{<span style="color:#A60">:counter</span>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>First, we declare that the IEx shell will trap exists and not just die. Then we spawn a new process and link it. The <tt>spawn_link/1</tt> function has the same effect of <tt>spawn/1</tt> and then <tt>Process.link/1</tt>. We can send a message to the new pid and check that it is indeed still working.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">5</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.exit(pid, <span style="color:#A60">:kill</span>)<tt>
</tt><span style="color:#038;font-weight:bold">true</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">6</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.alive?(pid)<tt>
</tt><span style="color:#038;font-weight:bold">false</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">7</span>)&gt; flush<tt>
</tt>{<span style="color:#A60">:EXIT</span>, <span style="color:#888">#PID&lt;0.118.0&gt;, :killed}</span><tt>
</tt><span style="color:#A60">:ok</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now we forcefully kill the new process again, but IEx does not crash this time, as it is explicitly trapping those errors. If we check the killed pid, we can assert that it is indeed dead. But now we can also inspect IEx's own process mailbox (in this case, just flushing whats queued in the inbox) and see that it just received a message saying that its child was killed.</p>
<p>From here we could make IEx process treat this message and decide to just mourn for its deceased child and commit suicide itself, or move on and spawn_link a new now. We have <strong>choice</strong> in the face of disaster.</p>
<h3>OTP Workers</h3>
<p>Letting aside the grim metaphor, we learned that we have Parent and Child processes, but more importantly they can fit the roles of Supervisors and Workers that are supervised, respectivelly.</p>
<p>Workers is where we put our code. This code can have bugs, it can depend on external stuff that can make our code crash for unexpected reasons. In a normal language we would start using the dreaded <tt>try/catch</tt> blocks, which are just ugly and <strong>wrong</strong>! Don't catch errors in Elixir, just let it crash!!</p>
<p>As I explained in my previous article, everything in Elixir ends up being a so called "OTP application". The example above is just a very simple contraption that we can expand upon. Let's rewrite the same thing as an OTP GenServer:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">MyFancyProcess</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">GenServer</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start_link</span>(_) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">GenServer</span>.start_link(__MODULE__, <span style="color:#00D;font-weight:bold">0</span>, <span style="color:#808">name</span>: __MODULE__)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#888">## Public API</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hello</span>(message) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">GenServer</span>.call(__MODULE__, {<span style="color:#A60">:hello</span>, message})<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">counter</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">GenServer</span>.call(__MODULE__, <span style="color:#A60">:counter</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#888">## GenServer callbacks</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>(start_counter) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:ok</span>, start_counter}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({<span style="color:#A60">:hello</span>, message}, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Hello, </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>    {<span style="color:#A60">:reply</span>, <span style="color:#A60">:noproc</span>, state}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>(<span style="color:#A60">:counter</span>, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    new_state = state + <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">New state is </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>new_state<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>    {<span style="color:#A60">:reply</span>, <span style="color:#A60">:noproc</span>, new_state}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This new <tt>MyFancyProcess</tt> is essentially the same as <tt>MyProcess</tt> but with OTP GenServer on top of it. There are Public API functions and GenServer callbacks.</p>
<p>Benjamin's book go to great lenghts to detail every bit of what I just implemented. But for now just understand some basics:</p>
<ol>
  <li>
    <p>The module does "<tt>use GenServer</tt>" to import all the necessary GenServer bits for your convenience. In essence one of the things it will do is create that <tt>receive</tt> block we did in the first version to wait for messages.</p>
  </li>
  <li>
    <p>The <tt>start_link/1</tt> function will create the instance of this GenServer and return the linked process. Internally it will call back to the <tt>init/1</tt> function to set the initial state of this worker. This is a flexible language, we have multiple ways of doing the same thing, and this is good, having just a single way of writing code is boring.</p>
  </li>
  <li>
    <p>The convention is to have one public function that calls the internal <tt>handle_call/3</tt> (for synchronous calls), <tt>handle_cast/2</tt> (for asynchronous calls), and <tt>handle_info/2</tt>. You could just call <tt>handle_call</tt> from the outside, but it's just ugly, so you will find this convention everywhere.</p>
  </li>
</ol>
<p>Once we have this in place, we can start calling it directly:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">11</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.start_link(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>{<span style="color:#A60">:ok</span>, <span style="color:#888">#PID&lt;0.261.0&gt;}</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">12</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.hello(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">world</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#036;font-weight:bold">Hello</span>, world<tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">13</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.counter<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">1</span><tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">14</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.counter<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">2</span><tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">15</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.counter<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">3</span><tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is much cleaner than the version where we manually <tt>spawn_link</tt> and <tt>send</tt> messages to a pid. This is all handled nicely by the GenServer underneath it. And as I said, the results are the same as the initial crude <tt>MyProcess</tt> example.</p>
<p>In fact, this convention does make us type a lot of boilerplate many times over. There is a library called <a href="https://github.com/sasa1977/exactor">ExActor</a> that grealy simplifies a GenServer implementation, making our previous code become something like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">MyFancyProcess</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExActor</span>.<span style="color:#036;font-weight:bold">GenServer</span>, <span style="color:#808">initial_state</span>: <span style="color:#00D;font-weight:bold">0</span><tt>
</tt><tt>
</tt>  defcall hello(message), state <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Hello, </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>message<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>    noreply<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defcall counter, state <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    new_counter = state + <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">New state is </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>new_counter<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>    new_state(new_counter)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is way cleaner, but as we are just using IEx, I'm not using this version for the next section, stick with the longer version of <tt>MyFancyProcess</tt> listed in the beginning of this section!</p>
<h2>OTP Supervisor</h2>
<p>Now that we have a worker, we can create a Supervisor to supervise it:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">MyFancySupervisor</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Supervisor</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start_link</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Supervisor</span>.start_link(__MODULE__, [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>(_) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    children = [<tt>
</tt>      worker(<span style="color:#036;font-weight:bold">MyFancyProcess</span>, [<span style="color:#00D;font-weight:bold">0</span>])<tt>
</tt>    ]<tt>
</tt><tt>
</tt>    opts = [<span style="color:#808">strategy</span>: <span style="color:#A60">:one_for_one</span>]<tt>
</tt><tt>
</tt>    supervise(children, opts)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is just a simple boilerplace that most Supervisors will have. There are many details you must learn, but for this article's purposes the important bits are, first, the definition of the <tt>children</tt> specification, saying that this Supervisor should start the <tt>MyFancyProcess</tt> GenServer instead of us having to <tt>MyFancyProcess.start_link</tt> manually. And the second important bit is the <tt>opts</tt> list which defines the strategy of <tt>:one_for_one</tt>, meaning that if the Supervisor detects that the child has died, it should restart it.</p>
<p>From a clean IEx, we can copy and paste both the <tt>MyFancyProcess</tt> and <tt>MyFancySupervisor</tt> above and start playing with it in the IEx shell:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">3</span>)&gt; {<span style="color:#A60">:ok</span>, sup_pid} = <span style="color:#036;font-weight:bold">MyFancySupervisor</span>.start_link   <tt>
</tt>{<span style="color:#A60">:ok</span>, <span style="color:#888">#PID&lt;0.124.0&gt;}</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">4</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.hello(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">foo</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#036;font-weight:bold">Hello</span>, foo<tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">5</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.counter     <tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">1</span><tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">6</span>)&gt; <span style="color:#036;font-weight:bold">MyFancyProcess</span>.counter<tt>
</tt><span style="color:#036;font-weight:bold">New</span> state is <span style="color:#00D;font-weight:bold">2</span><tt>
</tt><span style="color:#A60">:noproc</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how we start the Supervisor and you can see that right away we can start sending messages to the <tt>MyFancyProcess</tt> GenServer because the Supervisor successfully started it for us.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">7</span>)&gt; <span style="color:#036;font-weight:bold">Supervisor</span>.count_children(sup_pid)<tt>
</tt><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">active: 1, specs: 1, supervisors: 0, workers: 1</span><span style="color:#710">}</span></span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">8</span>)&gt; <span style="color:#036;font-weight:bold">Supervisor</span>.which_children(sup_pid)<tt>
</tt>[{<span style="color:#036;font-weight:bold">MyFancyProcess</span>, <span style="color:#888">#PID&lt;0.125.0&gt;, :worker, [MyFancyProcess]}]</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Using the Supervisor PID that we captured right when we started it, we can ask it to count how many children it is monitoring (1, in this example) and we can ask the details of each children as well. We can see that the <tt>MyFancyProcess</tt> started with the pid of "0.125.0"</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(<span style="color:#00D;font-weight:bold">9</span>)&gt; [{_, worker_pid, _, _}] = <span style="color:#036;font-weight:bold">Supervisor</span>.which_children(sup_pid)<tt>
</tt>[{<span style="color:#036;font-weight:bold">MyFancyProcess</span>, <span style="color:#888">#PID&lt;0.125.0&gt;, :worker, [MyFancyProcess]}]</span><tt>
</tt>iex(<span style="color:#00D;font-weight:bold">14</span>)&gt; <span style="color:#036;font-weight:bold">Process</span>.exit(worker_pid, <span style="color:#A60">:kill</span>)<tt>
</tt><span style="color:#038;font-weight:bold">true</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, we can grab the Worker pid and manually force it to crash as we did before. We should be screwed, right? Nope:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(15)&gt; Supervisor.which_children(sup_pid)                          <tt>
</tt>[{MyFancyProcess, #PID&lt;0.139.0&gt;, :worker, [MyFancyProcess]}]<tt>
</tt><tt>
</tt>iex(16)&gt; MyFancyProcess.counter<tt>
</tt>New state is 1<tt>
</tt>:noproc<tt>
</tt>iex(17)&gt; MyFancyProcess.counter<tt>
</tt>New state is 2<tt>
</tt>:noproc<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If we ask the Supervisor again for the list of its children, we will see that the old "0.125.0" process did indeed vanish but a new one, "0.139.0" was spawned in its place by the Supervisor strategy of <tt>:one_for_one</tt> as we defined before.</p>
<p>We can continue making calls do the <tt>MyFancyProcess</tt> but you will see that the previous state was lost and it restarts from zero. We can add state management in the GenServer using a number of different persistent storages such as the built-in <a href="https://elixir-lang.org/getting-started/mix-otp/ets.html">ETS</a> (think of ETS as a built-in Memcache service), but I think you get the idea by now.</p>
<h3>Graphically visualizing Processes</h3>
<p>This entire article was motivated by just this simple thing in Benjamin's book: by the end of page 139 of the book you will have built a very simple pool system that is able to start 5 process in the pool, guarded by a supervisor. And from there he goes on to show off the Observer.</p>
<p>Erlang has a built-in inspector tool called Observer. You can use the Supervisor built-in functions to inspect processes as I demonstrated before, but it's much cooler to see it visually. Assuming you installed Erlang Solutions propertly, in Ubuntu you have to:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb &amp;&amp; sudo dpkg -i erlang-solutions_1.0_all.deb<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Only then, you can start the observer directly from the IEx shell like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">:observer.start<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And a graphical window will show up with some stats first.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/530/big_observer-system.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/530/observer-system.png 2x" alt="Observer"></p>
<p>This is <strong>very</strong> powerful becuase you have insight and control over the entire Erlang runtime! See that this status window even show you "uptime", it's line a UNIX system: it is made to stay up no matter what. Processes have its own garbage collector and they all behave nicely towards the entire system.</p>
<p>You can hook a remote Observer to remote Erlang runtimes as well, if you were wondering. Now you can jump to the Applications tab to see how the "Pooly" exercise looks like with 5 children under its pool:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/527/big_observer-pooly.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/527/observer-pooly.png 2x" alt="Pooly"></p>
<p>Because those children are supervised with proper restart strategies, we can visually kill one of them, the one with the pid labeled "0.389.0":</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/528/big_observer-kill.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/528/observer-kill.png 2x" alt="Kill process"></p>
<p>And as the Observer immediatelly shows, the Supervisor took action, spawned a new child and added it to its pool, bringing the count back to 5:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/529/big_observer-restart.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/529/observer-restart.png 2x" alt="Respawn"></p>
<p>This is what <strong>Fault Tolerance</strong> with proper controls mean by using OTP!</p>
<p>With the bits I explained in this article you should have enough concepts to finally grasp what the Erlang's high reliabiliby fuzz is all about. The basic concepts are very simple, to hook your application to OTP is also a no-brainer, what OTP has implemented under the hood is what makes your application much more reliable.</p>
<p>There are clear guidelines on how to design your application. Who supervises what. What should happen to the application state if workers are restarted? How you divide responsabilities between different groups of Supervisor/Children?</p>
<p>Your application is supposed to look like a Tree, a <strong>Supervision Tree</strong>, where failure in one leaf does not bring the other branches down and everything knows how to behave and how to recover, elegantly. It's really like a UNIX operating system: when you <tt>kill -9</tt> one process, it doesn't bring your system down, and if it's <tt>initd</tt> monitored service, it gets respawned.</p>
<p>Most important: this is not an optional feature, a 3rd party library, that you choose too use. It's built-in in Erlang, you must use it if you want to play. There is no other choice and this is the best choice. Any such pattern that is not implemented in a concurrent language, to me, represents a big failure of the language. This is Elixir's strength.</p>
<p>This is high level control you won't find anywhere else. And we still didn't even talk about how OTP applications can exchange messages across the wire in really distributed systems, and how the Erlang runtime can reload code while an application is running, with zero downtime, akin of what IEx itself is capable of and how Phoenix allow development mode with code reloading! OTP gives all this for free, so it's well worth learning all the details.</p>
<p>We went through processes, pids, send a kill message to a process, trap exits, parent having child processes. Feels very similar to how UNIX works. If you know UNIX, you can easily grasp how all this fit together, including Elixir pipe operator "|&gt;" compared to UNIX's own pipe "|", it's similar.</p>
<p>Finally, The Little Elixir &amp; OTP Guidebook is a very easy to read, very hands-on small book. You can read it all in a couple of days and grasp everything I quickly summarized here and much more. I highly encourage you to buy it right now.</p>
<p></p>
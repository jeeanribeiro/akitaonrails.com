---
title: "Ex Manga Downloadr - Part 2: Poolboy to the rescue!"
date: "2015-11-19T16:35:00.000Z"
tags: ["beginner", "elixir", "english", "exmangadownloadr"]
years: "2015"
---

<p></p>
<p>If you read my <a href="http://www.akitaonrails.com/2015/11/18/ex-manga-downloader-an-exercise-with-elixir">previous article</a> I briefly described my exercise building a MangaReader downloader. If you didn't read it yet, I recommend you do so before continuing.</p>
<p>In the mid-section of the article I described how I was still puzzled on what would be the best way to handle several HTTP requests to an unstable external source where I can't control timeout or other network problems.</p>
<p>A big Manga such as Naruto or Bleach have dozens of chapters with dozens of pages each, accounting for thousands of necessary HTTP requests. Elixir/Erlang do allow me to fire up as many parallel HTTP requests as I want. But doing that makes the HTTP requests timeout very quickly (it's like doing a distributed denial of service attack against MangaReader).</p>
<p>By trial and error I found that firing up less than a 100 HTTP requests at once allows me to finish. I capped it down to 80 to be sure, but it really depends on your environment.</p>
<p></p>
<p></p>
<p>Then I had to manually chunk my list of pages to 80 elements and process them in parallel, finally reducing the resulting lists into a larger list again to pass it through to the next steps in the Workflow. The code gets convoluted like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">images_sources</span>(pages_list) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pages_list<tt>
</tt>    |&gt; chunk(<span style="color:#33B">@maximum_fetches</span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn pages_chunk, acc -&gt;<tt>
</tt>      result = pages_chunk<tt>
</tt>        |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt; <span style="color:#036;font-weight:bold">Page</span>.image(&amp;<span style="color:#00D;font-weight:bold">1</span>) <span style="color:#080;font-weight:bold">end</span>)))<tt>
</tt>        |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@http_timeout</span>)))<tt>
</tt>        |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="color:#A60">:ok</span>, image} -&gt; image <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>      acc ++ result<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now I was able to reimplement this aspect and the same code now looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">images_sources</span>(pages_list) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pages_list<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Worker</span>.page_image/<span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@await_timeout_ms</span>))<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="color:#A60">:ok</span>, image} -&gt; image <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Wow! Now this is a big improvement and it's way more obvious what it is doing.</p>
<p>Best of all: downloading a Manga the size of Akira (around 2,200 pages long) took less than <strong>50 seconds</strong>. And this is not because Elixir is super fast, it's because MangaReader can't keep up if I extend the Pool size. It's hitting at a constant rate of 50 concurrent connections!</p>
<p>This just makes my 4 cores machine, sitting down over a connection of 40Mbs use less than 40% ~ 30% of CPU and using no more than around 3,5 Mbs. If MangaReader could keep up we could easily fetch all pages 2 or 3 times faster without breaking a sweat.</p>
<p>It was fast with the previous strategy, but I guess it got at least twice as fast as a bonus. But how did I accomplish that?</p>
<h3>Open Telecom Platform</h3>
<p>In the previous article I also said that I didn't want to dive into "OTP and GenServers" just yet. But if you're a beginner like me you probably didn't understand what this means.</p>
<p>OTP is what makes Erlang (and consequently, Elixir) different from pretty much every other language platform but, maybe, Java.</p>
<p>Many new languages today make it do many tasks in parallel through convoluted Reactor patterns (Node.js, EventMachine/Ruby, Tornado/Twisted/Python, etc) or through (cleaner) green threads (Scala, Go).</p>
<p>But none of this matters. It's not difficult to launch millions of lightweight processes, but it is not trivial to actually <strong>CONTROL</strong> them all. It doesn't matter how fast you can exhaust your hardware if you can't control it. Then you end up with millions of dumb minions wreaking havoc without an adult to coordinate them.</p>
<p>Erlang solved this problem decades ago through the development of OTP, initially called Open Systems, within Ericsson in 1995. By itself OTP is a subject that can easilly fill an entire fat book and you will still not be able to call yourself an expert.</p>
<p>Just so I don't get too boring here:</p>
<ul>
  <li>Start with <a href="https://learnyousomeerlang.com/what-is-otp">this very brief summary</a>;</li>
  <li>Then read <a href="https://elixir-lang.org/getting-started/mix-otp/supervisor-and-application.html">Elixir's tutorial on Supervisors</a> and the page on <a href="https://elixir-lang.org/getting-started/processes.html">Processes</a> first if you haven't already;</li>
  <li>Finally, you can go further with <a href="https://www.manning.com/books/the-little-elixir-and-otp-guidebook">The Elixir &amp; OTP Guidebook</a> from Manning Publications.</li>
</ul>
<p>Now, below is my personal point of view. As I am a beginner myself, let me know in the comments section below if I got some concept wrong.</p>
<p>OTP is a collection of technologies and frameworks. The part that interests us the most is to understand that this is a sophisticated collection of patterns to achieve the Nirvana of highly reliable, highly scalable, distributed systems. You know? That thing every new platform promises you but fails to actually deliver.</p>
<p>For our very simple intents and purposes, let's pick up what I said before: it's trivial to fire up millions of small processes. We call them "workers". OTP provides the means to control them: Supervisors. And then it also provides the concept of Supervisor Trees (Supervisors that supervise other Supervisor). This is the gist of it.</p>
<p>Supervisors are responsible for starting up the workers and also to recover from exceptions coming from the workers (which is why in Erlang/Elixir we don't do ugly try/catch stuff: let the error be raised and caught by the Supervisor). Then we can configure the Supervisor to deal with faulty worker by, for example, restarting them.</p>
<p>We already touched this OTP stuff before. An Elixir <a href="https://github.com/elixir-lang/elixir/blob/master/lib/elixir/lib/task.ex">Task</a> is just a high level abstraction. It internally starts its own <a href="https://github.com/elixir-lang/elixir/blob/master/lib/elixir/lib/task/supervisor.ex">supervisor</a> and supervised to monitor over asynchronous tasks.</p>
<p>There are so many subjects and details that it's difficult to even get started. One concept that is important to know is about <strong>state</strong>. There is no global state! (Yay, no Javascript globals nightmare.) Each function has its own state and that's it. There is no concept of an "object" that holds state and then methods that can modify that state.</p>
<p>But there is the concept of Erlang processes. Now, a process do have state, it's a lightweight piece of state that exists only in runtime. To execute a function in a separated, parallel process, you can just do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex&gt; spawn fn -&gt; <span style="color:#00D;font-weight:bold">1</span> + <span style="color:#00D;font-weight:bold">2</span> <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888">#PID&lt;0.43.0&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Different from an object, a process does not have a set of methods that access its inner "this" or "self" states. Instead each process has a <strong>mailbox</strong>. When you start (or "spawn" in Erlang lingo) a new process, it returns a pid (process ID). You can now send messages to the process through its pid. Each process has a mailbox and you can choose to respond to incoming messages and send responses back to the pid that sent the message. This is how you can send a message to the IEx console and receive the messages in its mailbox:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex&gt; send <span style="color:#038;font-weight:bold">self</span>(), {<span style="color:#A60">:hello</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">world</span><span style="color:#710">"</span></span>}<tt>
</tt>{<span style="color:#A60">:hello</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">world</span><span style="color:#710">"</span></span>}<tt>
</tt>iex&gt; receive <span style="color:#080;font-weight:bold">do</span><tt>
</tt>...&gt;   {<span style="color:#A60">:hello</span>, msg} -&gt; msg<tt>
</tt>...&gt;   {<span style="color:#A60">:world</span>, msg} -&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">won't match</span><span style="color:#710">"</span></span><tt>
</tt>...&gt; <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">world</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In essence, it's almost like an "object" that holds state. Each process has its own garbage collector, so when it dies it's individually collected. And each process is isolated from other processes, they don't bleed state out, which makes them much easier to reason about.</p>
<p>The <a href="https://elixir-lang.org/getting-started/processes.html">Getting Started page on Processes</a> from the Elixir website show examples of what I just explained and I recommend you follow it throughly.</p>
<p>In summary, a process can hold internal state by locking indefinitely waiting for an incoming message in its mailbox and then recursing to itself! This is a mindblowing concept at first.</p>
<p>But, just a simple process is just too dawn weak. This is where you get <a href="https://elixir-lang.org/getting-started/mix-otp/genserver.html">OTP's GenServer</a>, which is a much more accomplished process. OTP exposes Behaviours for you to implement in order to add your own code but it takes care of the dirty infrastructure stuff so you don't have to.</p>
<h3>Deferring the Heavy Workflow calls to a Worker</h3>
<p>All that having being said, we know that in the Workflow we implemented before, we have trouble with the <tt>Page.image/1</tt> and <tt>Workflow.download_image/2</tt> functions. This is why we made them asynchronous processes and we wait for batches of 80 calls every time.</p>
<p>Now, let's start by moving away this logic to a GenServer Worker, for example, in the <tt>ex_manga_downloadr/pool_management/worker.ex</tt> file:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Worker</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">GenServer</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span><tt>
</tt><tt>
</tt>  <span style="color:#33B">@timeout_ms</span> <span style="color:#00D;font-weight:bold">1_000_000</span><tt>
</tt>  <span style="color:#33B">@transaction_timeout_ms</span> <span style="color:#00D;font-weight:bold">1_000_000</span> <span style="color:#888"># larger just to be safe</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start_link</span>(_) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">GenServer</span>.start_link(__MODULE__, <span style="color:#038;font-weight:bold">nil</span>, [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({<span style="color:#A60">:page_image</span>, page_link}, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:reply</span>, <span style="color:#036;font-weight:bold">Page</span>.image(page_link), state}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({<span style="color:#A60">:page_download_image</span>, image_data, directory}, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:reply</span>, <span style="color:#036;font-weight:bold">Page</span>.download_image(image_data, directory), state}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I first moved the <tt>Workflow.download_image/2</tt> to <tt>Page.download_image/2</tt> just for consistency's sake. But this is a GenServer in a nutshell. We have some setup in the <tt>start_link/1</tt> function and then we have to implement <tt>handle_call/3</tt> functions to handle each kind of arguments it might receive. We separate them through pattern matching the arguments.</p>
<p>As a convention, we can add public functions that are just prettier versions that call each <tt>handle_call/3</tt>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">page_image</span>(page_link) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Task</span>.async fn -&gt; <tt>
</tt>      <span style="color:#A60">:poolboy</span>.transaction <span style="color:#A60">:worker_pool</span>, fn(server) -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">GenServer</span>.call(server, {<span style="color:#A60">:page_image</span>, page_link}, <span style="color:#33B">@timeout_ms</span>)<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span>, <span style="color:#33B">@transaction_timeout_ms</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">page_download_image</span>(image_data, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Task</span>.async fn -&gt; <tt>
</tt>      <span style="color:#A60">:poolboy</span>.transaction <span style="color:#A60">:worker_pool</span>, fn(server) -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">GenServer</span>.call(server, {<span style="color:#A60">:page_download_image</span>, image_data, directory}, <span style="color:#33B">@timeout_ms</span>)<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span>, <span style="color:#33B">@transaction_timeout_ms</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But we are not just calling the previous <tt>handle_call/3</tt> functions. First there is the <tt>Task.async/1</tt> we were already using in the Workflow functions to make the parallel batches. But inside the Task calls there is this other strange thing: <tt>:poolboy</tt>.</p>
<h3>Controlling Pools of Processes through Poolboy</h3>
<p>The entire OTP ordeal I wrote here was just an introduction so I could show off <a href="https://github.com/devinus/poolboy">Poolboy</a>.</p>
<p>Repeating myself again: its trivial to fire up millions of processes. OTP is how we control failures to those processes. But there is another problem: the computation within each process may be so heavy we can either bring down the machine or, in our case, do a Distributed Denial of Service (DDoS) against poor MangaReader website.</p>
<p>My initial idea was to just do parallel requests in batches. But the logic is convoluted.</p>
<p>Instead, we can use a process pool! It queues up our requests for new processes. Whenever a process finishes it is returned to the pool and a new computation can take over the available process. This is how pools work (you probably have an intuition of how it works from traditional database connection pools). Pools and queues are useful software constructs to deal with limited resources.</p>
<p>By doing this we can remove the chunking of the large list into batches and do it like we would process every element of the large list in parallel at once, repeating again the initial version:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pages_list<tt>
</tt>  |&gt; chunk(<span style="color:#33B">@maximum_fetches</span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn pages_chunk, acc -&gt;<tt>
</tt>    result = pages_chunk<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt; <span style="color:#036;font-weight:bold">Page</span>.image(&amp;<span style="color:#00D;font-weight:bold">1</span>) <span style="color:#080;font-weight:bold">end</span>)))<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@http_timeout</span>)))<tt>
</tt>      |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="color:#A60">:ok</span>, image} -&gt; image <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>    acc ++ result<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, removing the chunking and reducing logic:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pages_list<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt; <span style="color:#036;font-weight:bold">Page</span>.image(&amp;<span style="color:#00D;font-weight:bold">1</span>) <span style="color:#080;font-weight:bold">end</span>)))<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@http_timeout</span>)))<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="color:#A60">:ok</span>, image} -&gt; image <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And finally, replacing the direct <tt>Task.async/1</tt> call for the GenServer worker we just implemented above:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pages_list<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Worker</span>.page_image/<span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@await_timeout_ms</span>))<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="color:#A60">:ok</span>, image} -&gt; image <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, Poolboy requires will require a Supervisor that monitors our Worker. Let's put it under <tt>ex_manga_downloadr/pool_management/supervisor.ex</tt>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Supervisor</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Supervisor</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start_link</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Supervisor</span>.start_link(__MODULE__, [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>([]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    pool_options = [<tt>
</tt>      <span style="color:#808">name</span>: {<span style="color:#A60">:local</span>, <span style="color:#A60">:worker_pool</span>},<tt>
</tt>      <span style="color:#808">worker_module</span>: <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Worker</span>,<tt>
</tt>      <span style="color:#808">size</span>: <span style="color:#00D;font-weight:bold">50</span>,<tt>
</tt>      <span style="color:#808">max_overflow</span>: <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>    ]<tt>
</tt><tt>
</tt>    children = [<tt>
</tt>      <span style="color:#A60">:poolboy</span>.child_spec(<span style="color:#A60">:worker_pool</span>, pool_options, [])<tt>
</tt>    ]<tt>
</tt><tt>
</tt>    supervise(children, <span style="color:#808">strategy</span>: <span style="color:#A60">:one_for_one</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>More OTP goodness here. We had a rogue Worker, now we have a responsible Supervisor deferring responsability to Poolboy. We start with a pool that can hold a maximum of 50 process within (without overflowing). This number comes from trial and error again. And the Supervisor will use a strategy of <tt>:one_for_one</tt>, which means that if the Worker dies it restarts it.</p>
<p>Now, we must add Poolboy to the <tt>mix.exs</tt> as a dependency and run <tt>mix deps.get</tt> to fetch it:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp deps <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  [<tt>
</tt>    ...<tt>
</tt>    {<span style="color:#A60">:poolboy</span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">devinus/poolboy</span><span style="color:#710">"</span></span>, <span style="color:#808">tag</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1.5.1</span><span style="color:#710">"</span></span>},<tt>
</tt>    ...<tt>
</tt>  ]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In the same <tt>mix.exs</tt> we make the main Application (surprise: which is <a href="https://github.com/elixir-lang/elixir/blob/master/lib/elixir/lib/application.ex">already a supervised OTP application</a>) start the PoolManagement.Supervisor for us:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">application</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  [<span style="color:#808">applications</span>: [<span style="color:#A60">:logger</span>, <span style="color:#A60">:httpotion</span>, <span style="color:#A60">:porcelain</span>],<tt>
</tt>   <span style="color:#808">mod</span>: {<span style="color:#036;font-weight:bold">PoolManagement</span>, []}]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But we also need to have this <tt>PoolManagement</tt> module for it to call. We may call it <tt>pool_management.ex</tt>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">PoolManagement</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Application</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start</span>(_type, _args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Supervisor</span>.start_link<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Summary</h3>
<p>Let's summarize:</p>
<ol>
  <li>the <tt>ExMangaDownloadr</tt> application will start up and fire up the <tt>PoolManagement</tt> application;</li>
  <li>the <tt>PoolManagement</tt> application fires up the <tt>PoolManagement.Supervisor</tt>;</li>
  <li>the <tt>PoolManagement.Supervisor</tt> fires up Poolboy and assigns <tt>PoolManagement.Worker</tt> to it, configuring it's pool size to 50 and responding to the pool name <tt>:worker_pool</tt></li>
  <li>now we start to fetch and parse through the Manga's chapters and pages until the <tt>ExMangaDownloadr.Workflow.images_sources/1</tt> is called;</li>
  <li>it will call the <tt>PoolManagement.Worker.page_image/1</tt> function which in turn fires up a <tt>Task.async/1</tt>, calling <tt>:poolboy.transaction(:worker_pool, fn -&gt; ... end)</tt>;</li>
  <li>if a process is available in Poolboy's pool it starts right away, otherwise it awaits for a process to become available, it will wait until the <tt>@transaction_timeout_ms</tt> timeout configuration.</li>
  <li>the process maps the entire <tt>pages_list</tt>, creating one async Task for each page in the list, we end up with a ginourmous list of Task pids, then we <tt>Task.await/2</tt> for them all to return.</li>
</ol>
<p>Now, this application is much more reliable and faster as it fires up a new HTTP connection as soon as the first one responds and it return the process back to the pool. Instead of firing up 80 connections at a time, in batches, we start with 50 at the same time and then we fire up one at a time for each process returned to the pool.</p>
<p>Through trial and error I set the <tt>@http_timeout</tt> to wait at most 60 seconds. I also set the <tt>timeout_ms</tt> which is the time to wait for the GenServer worker call handle to return and <tt>transaction_timeout_ms</tt> which is the time Poolboy awaits for a new process in the pool, both to around 16 minutes (1,000,000 ms).</p>
<p>This is putting 25 years of Erlang experience in the Telecom industry to good use!</p>
<p>And to make it crystal clear: OTP is the thing that sets Erlang/Elixir apart from all the rest. It's not the same thing, but it's like if the standard would be to write everything in Java as an EJB, ready to run inside a JEE Container. What comes to mind is: heavy.</p>
<p>In Erlang, an OTP application is lightweight, you can just build and use it ad hoc, without bureacracy, without having to set up complicated servers. As in our case, it's a very simple command line tool, and within it, the entire power of a JEE Container! Think about it.</p>
<p></p>
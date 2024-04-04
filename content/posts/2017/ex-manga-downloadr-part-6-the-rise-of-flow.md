---
title: "Ex Manga Downloadr - Part 6: The Rise of FLOW"
date: "2017-06-13T18:59:00.000Z"
tags: ["learning", "elixir", "english", "exmangadownloadr"]
years: "2017"
---

<p></p>
<p>It's been way more than a year since I posted about my pet project <a href="https://github.com/akitaonrails/ex_manga_downloadr">Ex Manga Downloadr</a>. Since then I just did small updates to keep up with the current Elixir and libraries versions.</p>
<p>As a quick recap, the exercise is that I want to web scrap from MangaReader.net, a bunch of images, organized in pages and chapters, and in the end it should compile organized PDFs so I can load them on a Kindle device.</p>
<p>Web scrapping, is a simple loop of HTTP GETs over a ton of URLs, scrapping the HTML, and fetching more URLs to download.</p>
<p>In many simple languages, people usually solve this naively in 2 ways:</p>
<ul>
  <li>A simple nested loop. One single thread, sequencial fetches. So if you have 5,000 links and each links takes 10 seconds to fetch, it's basically 10 * 5,000 = 50,000 seconds, which is a stupid long time.</li>
  <li>A simple spawn of processes, fibers, threads or parallel I/O in a reactor, all at once. An attempt to paralelize all fetches at once.</li>
</ul>
<p>Everybody probably agree that the first option is stupid. Now, the second one is tricky.</p>
<p>The tricky part is <strong>CONTROL</strong>.</p>
<p></p>
<p></p>
<p>Anyone in Go would say <em>"oh, this is easy, just put a loop and spawn a bunch of goroutines"</em> or anyone in Node.js would say <em>"oh, this is easy, just put a loop, make the fetch - they all will run asynchronously - and add callbacks, a basic async/await."</em></p>
<p>They're not wrong, but this is still too naive an implementation. It's trivial to trigger hundreds or thousands of parallel requests. Now, what happens if one fails and you have to retry? What happens if the MangaReader has a throttling system that will either start cutting down connections or timing them out? Or if your internet bandwidth is just not enough, and after a certain amount of requests you start having diminishing returns and time outs?</p>
<p>The message is: it's damn trivial to spawn parallel stuff. it's damn complicated to control paralle stuff.</p>
<p>This is why, in my first implementation in Elixir, I introduced a complicated implementation using a combination of a custom GenServer, Elixir's own Task infrastructure for async/await pattern, and <a href="https://github.com/devinus/poolboy">Poolboy</a> to control the rate of the parallelism. This is how you control the bottleneck out to slow resources: using pools and queues (which is why every good database has a connection pool, remember <a href="https://sourceforge.net/projects/c3p0/">C3P0</a>?)</p>
<p>This is one snippet of my older implementation:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">chapter_page</span>([chapter_link, source]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Task</span>.<span style="color:#036;font-weight:bold">Supervisor</span>.async(<span style="color:#036;font-weight:bold">Fetcher</span>.<span style="color:#036;font-weight:bold">TaskSupervisor</span>, fn -&gt;<tt>
</tt>    <span style="color:#A60">:poolboy</span>.transaction <span style="color:#A60">:worker_pool</span>, fn(server) -&gt;<tt>
</tt>      <span style="color:#036;font-weight:bold">GenServer</span>.call(server, {<span style="color:#A60">:chapter_page</span>, chapter_link, source}, <span style="color:#33B">@genserver_call_timeout</span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span>, <span style="color:#33B">@task_async_timeout</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Yes, it's very ugly, and there are boilerplates for the GenServer, the custom Supervisor to initialize Poolboy and so on. And the higher level workflow code looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>({chapter_list, source}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>   pages_list = chapter_list<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Worker</span>.chapter_page([&amp;<span style="color:#00D;font-weight:bold">1</span>, source]))<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@await_timeout_ms</span>))<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn {<span style="color:#A60">:ok</span>, list}, acc -&gt; acc ++ list <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>   {pages_list, source}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So, inside the <code>Worker</code> module each public method wraps the GenServer internal calls into a <code>Task async</code> and in the collection iteration we add <code>Task.await</code> to actually wait for all parallel calls to finish, so we can finally reduce the results.</p>
<p>Elixir now comes with this very interesting <a href="https://elixir-lang.org/blog/2016/07/14/announcing-genstage/"><code>GenStage</code></a> infrastructure that promises to replace <code>GenEvent</code> and the use case is when you have a producer-consumer situation with back-pressure. Basically when you have slow endpoints and you would end up having to control bottlenecks.</p>
<p>Then, <a href="https://github.com/elixir-lang/flow">Flow</a> is an easier high abstraction that you can use almost the same way you would use <code>Enum</code> in your collections, but instead of sequential mapping, it takes care of parallel traversing and control of batches. So the code is very similiar but without you having to control the parallelization controls manually.</p>
<p>This is the <a href="https://github.com/akitaonrails/ex_manga_downloadr/commit/b117f5236098f6d37e332633acb787be46a09d84">full commit</a> where I could remove Poolboy, remove my custom GenServer, reimplement the Worker as simple module of functions and then the workflow could get rid off the async/await pattern and use Flow instead:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>({chapter_list, source}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>   pages_list = chapter_list<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Flow</span>.from_enumerable(<span style="color:#808">max_demand</span>: <span style="color:#33B">@max_demand</span>)<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Flow</span>.map(&amp;<span style="color:#036;font-weight:bold">MangaWrapper</span>.chapter_page([&amp;<span style="color:#00D;font-weight:bold">1</span>, source]))<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Flow</span>.partition()<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Flow</span>.reduce(fn -&gt; [] <span style="color:#080;font-weight:bold">end</span>, fn {<span style="color:#A60">:ok</span>, list}, acc -&gt; acc ++ list <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.to_list()<tt>
</tt>   {pages_list, source}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The only boilerplate left is the <code>Flow.from_enumerable()</code> and <code>Flow.partition()</code> wrapping the <code>Flow.map</code>, and that's it!</p>
<p>Notice I configured <code>@max_demand</code> to be 60. You must tweak it to be larger or smaller depending on your internet connection, you have to experiment it. By default, Flow will trigger 500 processes in parallel, which is way too much for a web scrapping on a normal home internet connection and you will suffer diminishing returns. That's what I had to do previously with Poolboy, by initiating a pool of around 60 transactions at most.</p>
<p>Unfortunately not everything is as straight forward as it seems. Running this new version on the test mode I get this result:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">58,85s user 13,93s system 37% cpu 3:13,78 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So a total time of more than 3 minutes, using around 37% of the available CPU.</p>
<p>My immediate previous version using all the shenanigans of Poolboy, Task.Supervisor, GenServer, etc still gives me this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">100,67s user 20,83s system 152% cpu 1:19,92 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Less than <strong>HALF</strong> the time, albeit using all my CPU cores. So my custom implementation still uses my resources to the maximum. There is still something in the Flow implementation I didn't quite get right. I already tried to bump up the <code>max_demand</code> from 60 up to 100 but that didn't improve anything. Leaving it to the default 500 slows everything down to more than 7 minutes.</p>
<p>All in all, at least it makes the implementation far easier on the eyes (hence, way easier to maintain), but either the Flow implementation has bottlenecks or I am using it wrong at this point. If you know what it is, let me know in the comments section below.</p>
<p></p>
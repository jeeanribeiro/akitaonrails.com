---
title: "Ex Manga Downloadr - Part 7: Properly dealing with large Collections"
date: "2017-06-16T18:10:00.000Z"
tags: ["learning", "elixir", "english", "exmangadownloadr"]
years: "2017"
---

<p></p>
<p>In my <a href="http://www.akitaonrails.com/2017/06/13/ex-manga-downloadr-part-6-the-rise-of-flow">previous post</a> I was able to simplify a lot of the original code through the use of <a href="https://github.com/elixir-lang/flow">Flow</a>. But the downside is that the running time actually increased a lot.</p>
<p>José Valim kindly stepped in and posted a <a href="http://www.akitaonrails.com/2017/06/13/ex-manga-downloadr-part-6-the-rise-of-flow#comment-3360301947">valuable comment</a>, which I will paste here:</p>
<blockquote>
  <p>Have you tried reducing the <code>@max_demand</code> instead? <code>@max_demand</code> is how much data you exchange between stages. If you set it to 60, it means you are sending 60 items to one stage, 60 items to the other and so on. That gives you poor balancing for small collections as there is a chance all items end-up in the same stage. You actually want to reduce <code>max_demand</code> to 1 or 2 so each stage gets small batches and request more than needed. Another parameter you usually tune is the <code>stages: ...</code> option, you should set that to the amount of connections you had in poolboy in the past.</p>
  <p>However, I believe you don't need to use Flow at all. Elixir v1.4 has something called <a href="https://hexdocs.pm/elixir/Task.html#async_stream/5"><code>Task.async_stream</code></a> which is a mixture of poolboy + task async, which is a definitely better replacement to what you had. We have added it to Elixir after implementing Flow as we realized you can get a lot of mileage out of <code>Task.async_stream</code> without needing to jump to a full solution like Flow. If using <code>Task.async_stream</code>, the <code>max_concurrency</code> option controls your pool size.</p>
</blockquote>
<p></p>
<p></p>
<p>And, obviously, he is right. I misunderstood how Flow works. It's meant to be used when you have a bazillion items to process in parallel. Particularly processing units that can have high variance and, hence, a lot of back-pressure not only because there is a lot of items to process, but because their running times can vary dramatically. So, it's one of those cases of having a canon, but I only have a fly to kill.</p>
<p>What I wasn't aware is the existence of <code>Task.async_stream</code> and it's companion <a href="https://hexdocs.pm/elixir/Task.Supervisor.html#async_stream/4"><code>Task.Supervisor.async_stream</code></a> if I need to add more control.</p>
<p>Let's backtrack a bit.</p>
<h3>Dealing with collections in Elixir</h3>
<p>Erlang is a beast. It provides all the building blocks of a real-time, highly-concurrent, operating system! Really, what it provides out of the box is way more than any other language/platform/virtual machine, ever. You don't get that much for free on Java, or .NET or anything. You have to assemble the pieces manually, spend hundreds of hours tweaking, and still pray a lot to have everything working seamlessly.</p>
<p>So, you have distributed systems to build? There is no other option, really. Do Erlang, or suffer in hell.</p>
<p>Then, Elixir steps this up a notch creating a very reasonable and simple to use standard library that makes the coding part actually enjoyable. This is a killer combo. You need to do the next Whatsapp? You need to do the next Waze? You need to rebuild Cassandra from scratch? You need to create stuff like Apache Spark? Do Elixir.</p>
<p>In Erlang, you need to solve everything using GenServer. It's a neat abstraction from OTP. You are <a href="https://www.akitaonrails.com/2015/11/22/observing-processes-in-elixir-the-little-elixir-otp-guidebook">required to understand OTP</a> intimately. There is no shortcut here. There is no Erlang without OTP.</p>
<p>That said, you can start simple and scale without so much hassle.</p>
<p>Usually, everything starts with Collections, or more correctly, some kind of <a href="https://hexdocs.pm/elixir/Enum.html#content">Enumeration</a>.</p>
<p>Just like my simple <code>Workflow.pages/1</code> function which iterates through a list of chapter links, fetch each link, parse the returning HTML and extracts the collection of page links within that chapter, reducing the sub-lists into a full list of page links.</p>
<p>If I know the collection is small (less than 100 items, for example) I would just do this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>({chapter_list, source}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>   pages_list = chapter_list<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Worker</span>.chapter_page([&amp;<span style="color:#00D;font-weight:bold">1</span>, source]))<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn {<span style="color:#A60">:ok</span>, list}, acc -&gt; acc ++ list <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>   {pages_list, source}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's it. This is linear. It will sequentially process just one link at a time. The more chapter links, the longer it will take. Usually I want to process this in parallel. But I can't fire a parallel process for each chapter link, because if I receive 1,000 chapter links and fire them all, it will be a Denial of Service and I will certainly receive hundreds of time outs.</p>
<p>You can run into 2 main problems when you need to iterate through a big collection.</p>
<ul>
  <li>
    <p>If your collection is humongous (imagine a gigabyte long text file that you need to iterate line by line). For that you use <a href="https://hexdocs.pm/elixir/Stream.html#content"><code>Stream</code></a> instead of <code>Enum</code>. All functions look almost exactly the same, but you will not have to load the entire collection into memory and you will not keep duplicating it.</p>
  </li>
  <li>
    <p>If your processing unit takes a long time. Now that you solved not blowing off your memory usage, what if you have slow jobs while iterating through each item in the collection? That's our case, where the collection is rather small, but the processing time is long as it's fetching from an external source on the internet. It can take milisseconds, it can take a few seconds.</p>
  </li>
</ul>
<p>One way to control this is through the use of "batches", something along these lines:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>({chapter_list, source}) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pages_list = chapter_list<tt>
</tt>        |&gt; <span style="color:#036;font-weight:bold">Enum</span>.chunk(<span style="color:#00D;font-weight:bold">60</span>)<tt>
</tt>        |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;pages_download(&amp;<span style="color:#00D;font-weight:bold">1</span>, source))<tt>
</tt>        |&gt; <span style="color:#036;font-weight:bold">Enum</span>.concat<tt>
</tt>  {pages_list, source}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages_download</span>(chapter_list, source)<tt>
</tt>   results = chapter_list<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt; <span style="color:#036;font-weight:bold">Worker</span>.chapter_page([&amp;<span style="color:#00D;font-weight:bold">1</span>, source]) <span style="color:#080;font-weight:bold">end</span>))<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.await/<span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt>     |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn {<span style="color:#A60">:ok</span>, list}, acc -&gt; acc ++ list <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>   {pages_list, source}, results        <tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is just for the example, I have not compiled this snippet to see if it works, but you get the idea of chunking the big list and processing each chunk through <code>Task.async</code> and <code>Task.await</code>.</p>
<p>Again, for small lists, this should be ok (thousands) and where each item does not take too much to process.</p>
<p>Now, this is not very good. Because each chunk must finish before the next chunk begins. Witch is why the ideal solution is to keep a constant amount of jobs running at any given time. To that end, we need a Pool, which is what I explained in <a href="https://www.akitaonrails.com/2015/11/19/ex-manga-downloadr-part-2-poolboy-to-the-rescue">Part 2: Poolboy to the rescue!</a>.</p>
<p>But implementing the proper way to keep the pool entirely filled requires some boring juggling between Poolboy transactions and <code>Task.Supervisor.async</code>. Which is why I was interested in the new <code>Flow</code> usage.</p>
<p>The code does come clean, but as I explained before, this is not the proper use case for Flow. It's better you have to iterate over tens of thousands of items or even infinite (you have a incoming traffic of requests in need of parallel processing, for example).</p>
<p>So, finally, there is a compromise. The solution between the simple <code>Task.async</code> and <code>Flow</code> is <code>Task.async_stream</code> which works like a pool implementation, where it keeps a <code>max_concurrency</code> of jobs running in a stream. The final code becomes way more elegant like this:</p>
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
</tt>  pages_list = chapter_list<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Task</span>.async_stream(<span style="color:#036;font-weight:bold">MangaWrapper</span>, <span style="color:#A60">:chapter_page</span>, [source], <span style="color:#808">max_concurrency</span>: <span style="color:#33B">@max_demand</span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.to_list()<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn {<span style="color:#A60">:ok</span>, {<span style="color:#A60">:ok</span>, list}}, acc -&gt; acc ++ list <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  {pages_list, source}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is the <a href="https://github.com/akitaonrails/ex_manga_downloadr/commit/517183261e998ab40f6e5bc793b4db9adcf899e3">final commit</a> with the aforementioned changes.</p>
<h3>Conclusion</h3>
<p>The implementation with <code>Task.async_stream</code> is super simple and the times finally became the same as before.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">84,16s user 20,80s system 138% cpu 1:15,94 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Way better than the more than 3 minutes it was taking with Flow. And this is not because Flow is slow, it's because I was not using it correctly, probably shooting a big chunk into a single GenStage and creating a bottleneck. Again, only use Flow if you have enough items to put hundreds of them into several parallel GenStages. We are talking about collections with tens of thousands of items, not my meager pages list.</p>
<p>There is a small tweak though. To fetch all chapter and page links I am using a <code>max_concurrency</code> of 100. Timeout is the default at 5000 (5 seconds). That works because the returning HTML is not so big and we can parallelize that much on a high bandwidth connection.</p>
<p>But the images downloading procedure at <code>Workflow.process_downloads</code> I had to cut <code>max_concurrency</code> in half and increase the <code>timeout</code> up to 30 seconds to make sure it wouldn't crash.</p>
<p>Because this is a simple implementation there is no crash recovery and no retry routine. I would have to replace this implementation with <code>Task.Supervisor.async_stream</code> to regain some control. My original implementation was more cumbersome but I had places to add retry mechanisms. So again, it's a compromise between ease of use and control, always. The more control you have, the worse the code becomes.</p>
<p>This is a simple example exercise, so I will keep it at that for the time being.</p>
<p></p>
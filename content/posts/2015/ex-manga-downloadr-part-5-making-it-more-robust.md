---
title: "Ex Manga Downloadr - Part 5: Making it more robust!"
date: "2015-12-06T21:20:00.000Z"
tags: ["beginner", "elixir", "english", "exmangadownloadr"]
years: "2015"
---

<p></p>
<p>And there I go again. I know some of you may be bored by this tool already, but as a playground project, I still want to make this a good code. But there are 2 big problems right now.</p>
<p>When I was testing only with MangaReader.net as a source, everything worked almost flawlessly. But adding MangaFox in <a href="http://www.akitaonrails.com/2015/12/02/ex-manga-downloadr-part-3-mangafox-support">Part 3</a>, with its more restrictive rules towards scrapper tools like mine (timing out more frequently, not allowing too many connections from the same place, etc), the process just kept crashing and I had to manually restart it (the resuming features I added in <a href="http://www.akitaonrails.com/2015/12/03/ex-manga-downloadr-part-4-learning-through-refactoring">Part 4</a> payed off, but it's not a reliable tool anymore).</p>
<p></p>
<p></p>
<p>To recap, the Workflow just organizes each step of the process. It's functions are similar to this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">process_downloads</span>(images_list, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  images_list<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Worker</span>.page_download_image(&amp;<span style="color:#00D;font-weight:bold">1</span>, directory))<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@await_timeout_ms</span>))<tt>
</tt>  directory<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It deals with a large list, maps over each element sending it to a Worker function to run, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">page_download_image</span>(image_data, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt;<tt>
</tt>    <span style="color:#A60">:poolboy</span>.transaction <span style="color:#A60">:worker_pool</span>, fn(server) -&gt;<tt>
</tt>      <span style="color:#036;font-weight:bold">GenServer</span>.call(server, {<span style="color:#A60">:page_download_image</span>, image_data, directory}, <span style="color:#33B">@genserver_call_timeout</span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span>, <span style="color:#33B">@task_async_timeout</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It returns an asynchronous Task waiting for 2 things: for Poolboy to release a free process to use, and for the Worker/GenServer function to finish running inside that process. As I explained in <a href="https://www.akitaonrails.com/2015/11/19/ex-manga-downloadr-part-2-poolboy-to-the-rescue">Part 2</a> this is so we can limit the maximum number of connections to the external source. If we didn't have this restriction, sending tens of thousands of asynchronous requests at once, the external source would just fail them all.</p>
<p>First thing to bear in mind is that a "<tt>Task.async/2</tt>" links itself to the caller process, so if something goes wrong, the parent process dies as well.</p>
<p>The correct thing to do is to add a <a href="https://elixir-lang.org/docs/stable/elixir/Task.Supervisor.html">Task.Supervisor</a> and make it deal with each Task child. To do that, we can just add the Supervisor in our supervised tree at "pool_management/supervisor.ex":</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Supervisor</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Supervisor</span><tt>
</tt>  ...<tt>
</tt>  children = [<tt>
</tt>    supervisor(<span style="color:#036;font-weight:bold">Task</span>.<span style="color:#036;font-weight:bold">Supervisor</span>, [[<span style="color:#808">name</span>: <span style="color:#036;font-weight:bold">Fetcher</span>.<span style="color:#036;font-weight:bold">TaskSupervisor</span>]]),<tt>
</tt>    <span style="color:#A60">:poolboy</span>.child_spec(<span style="color:#A60">:worker_pool</span>, pool_options, [])<tt>
</tt>  ]<tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we can replace the "<tt>Task.async/2</tt>" calls to "<tt>Task.Supervisor.async(Fetcher.TaskSupervisor, ...)</tt>" like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">page_download_image</span>(image_data, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Task</span>.<span style="color:#036;font-weight:bold">Supervisor</span>.async(<span style="color:#036;font-weight:bold">Fetcher</span>.<span style="color:#036;font-weight:bold">TaskSupervisor</span>, fn -&gt;<tt>
</tt>    <span style="color:#A60">:poolboy</span>.transaction <span style="color:#A60">:worker_pool</span>, fn(server) -&gt;<tt>
</tt>      <span style="color:#036;font-weight:bold">GenServer</span>.call(server, {<span style="color:#A60">:page_download_image</span>, image_data, directory}, <span style="color:#33B">@genserver_call_timeout</span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span>, <span style="color:#33B">@task_async_timeout</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This still creates Tasks that we need to await on, and as before, if the function inside crashes, it still brings down the main process. Now my refactoring found a dead end.</p>
<p>This is the 2nd problem I mentioned in the beginning of the article: a <strong>flaw in my design</strong>.</p>
<p>Instead of just mapping through each element of a large list, I should have created an Agent based GenServer to keep the list as the state and make the the entire Workflow system a new supervised GenServer. If fetching one URL crashed the GenServer, its supervisor would restart it and pick up the next element in list.</p>
<p>But, as I am in no mood for this refactoring right now (it's Sunday afternoon) I will concentrate on a quick fix (yes, jerry-rigged patch), just so the function in the async call does not raise exceptions.</p>
<h3>OMG! It's a Try/Catch block!</h3>
<p>Turns out that everything I run inside the Poolboy processes are HTTP get requests through HTTPotion. Fortunately I had already refactored every HTTPotion get call into a neat macro:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmacro fetch(link, <span style="color:#808">do</span>: expression) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Fetching from </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>unquote(link)<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.get(unquote(link), <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.http_headers) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: body, <span style="color:#808">headers</span>: headers, <span style="color:#808">status_code</span>: <span style="color:#00D;font-weight:bold">200</span> } -&gt;<tt>
</tt>        { <span style="color:#A60">:ok</span>, body |&gt; <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.gunzip(headers) |&gt; unquote(expression) }<tt>
</tt>      _ -&gt;<tt>
</tt>        { <span style="color:#A60">:err</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">not found</span><span style="color:#710">"</span></span>}<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now I only need to replace 1 line in this macro:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">-    <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.get(unquote(link), <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.http_headers) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>+    <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.retryable_http_get(unquote(link)) <span style="color:#080;font-weight:bold">do</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And define this new retryable logic in the main module:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">Logger</span><tt>
</tt><tt>
</tt>  <span style="color:#888"># will retry failed fetches over 50 times, sleeping 1 second between each retry</span><tt>
</tt>  <span style="color:#33B">@max_retries</span>  <span style="color:#00D;font-weight:bold">50</span><tt>
</tt>  <span style="color:#33B">@time_to_wait_to_fetch_again</span> <span style="color:#00D;font-weight:bold">1_000</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">retryable_http_get</span>(url, <span style="color:#00D;font-weight:bold">0</span>), <span style="color:#808">do</span>: raise <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Failed to fetch from </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>url<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> after </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#33B">@max_retries</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> retries.</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">retryable_http_get</span>(url, retries <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#33B">@max_retries</span>) <span style="color:#080;font-weight:bold">when</span> retries &gt; <span style="color:#00D;font-weight:bold">0</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    try <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Fetching from </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>url<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> for the </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#33B">@max_retries</span> - retries<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> time.</span><span style="color:#710">"</span></span>)<tt>
</tt>      response = <span style="color:#036;font-weight:bold">HTTPotion</span>.get(url, <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.http_headers)<tt>
</tt>      <span style="color:#080;font-weight:bold">case</span> response <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: _, <span style="color:#808">headers</span>: _, <span style="color:#808">status_code</span>: status } <span style="color:#080;font-weight:bold">when</span> status &gt; <span style="color:#00D;font-weight:bold">499</span> -&gt;<tt>
</tt>          raise %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">HTTPError</span>{<span style="color:#808">message</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">req_timedout</span><span style="color:#710">"</span></span>}<tt>
</tt>        _ -&gt;<tt>
</tt>          response<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">rescue</span><tt>
</tt>      error <span style="color:#080;font-weight:bold">in</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">HTTPError</span> -&gt;<tt>
</tt>        <span style="color:#080;font-weight:bold">case</span> error <span style="color:#080;font-weight:bold">do</span><tt>
</tt>          %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">HTTPError</span>{<span style="color:#808">message</span>: message} <span style="color:#080;font-weight:bold">when</span> message <span style="color:#080;font-weight:bold">in</span> <span style="color:#33B">@http_errors</span> -&gt;<tt>
</tt>            <span style="color:#A60">:timer</span>.sleep(<span style="color:#33B">@time_to_wait_to_fetch_again</span>)<tt>
</tt>            retryable_http_get(url, retries - <span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt>          _ -&gt; raise error<tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I strongly <a href="https://www.akitaonrails.com/2015/12/01/the-obligatory-why-elixir-personal-take">stated</a> that in Elixir we should <strong>not</strong> use "try/catch" blocks, but there you have it.</p>
<p>This is the consequence of the flaw in my initial Workflow design. If I had coded the Workflow module to be a GenServer, with each list managed by an Agent, each failed HTTPotion call would allow the supervisor to restart it and try again. Without resorting to the ugly "try/catch" code.</p>
<p>Maybe this will force me to write Part 6 as being the code to remove this ugly try/catch later, so consider this a <strong>Technical Debt</strong> to make everything work now so we can refactor later and pay the debt back.</p>
<p>"<tt>HTTPotion.get/2</tt>" calls can raise "HTTPotion.HTTPError" exceptions. I am catching those errors for the time being, matching the messages against a list of errors I had already, sleeping for a certain amount of time (just a heuristic to see if the external sources respond better that way) and I recurse to itself through a limited number of "retries", until it reaches zero, in which case it may even be the case that the internet connection is down or some other severe error that we would not be able to recover soon.</p>
<p>With this code in place, now even fetching from MangaFox, without tweaking down the POOL_SIZE, will run until the end, and this solves my needs for now. If anyone is interested in suggesting a better, GenServer based Workflow design, I would really appreciate a Pull Request.</p>
<p>Cheers.</p>
<p></p>
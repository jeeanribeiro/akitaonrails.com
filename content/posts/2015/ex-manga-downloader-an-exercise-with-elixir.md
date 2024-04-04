---
title: "Ex Manga Downloader, an exercise with Elixir"
date: "2015-11-18T19:26:00.000Z"
tags: ["learning", "elixir", "english", "exmangadownloadr"]
years: "2015"
---

<p></p>
<p><strong>Update 11/19/15:</strong> In this article I mention a few doubts I had, so read this and then follow through <a href="http://www.akitaonrails.com/2015/11/19/ex-manga-downloadr-part-2-poolboy-to-the-rescue">Part 2</a> to see how I solved it.</p>
<p>As an exercise (and also because I'm obviously an <a href="https://en.wikipedia.org/wiki/Otaku">Otaku</a>) I <a href="https://github.com/akitaonrails/ex_manga_downloadr/blob/master/lib/ex_manga_downloadr/mangareader/index_page.ex">implemented</a> a simple Elixir based scrapper for the great <a href="http://www.mangareader.net/">MangaReader</a> website. One can argue if it's ok to scrap their website, and one might also argue if they providing those mangas are ok in the first place, so let's not go down this path.</p>
<p>I had an older version <a href="https://github.com/akitaonrails/manga-downloadr">written in Ruby</a>. It still works but it's in sore need of a good refactoring (sorry about that). The purpose of that version was to see if I could actually do parallel fetching and retry connections using Typhoeus.</p>
<p></p>
<p></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/525/big_ex_manga_downloadr.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/525/ex_manga_downloadr.png 2x" alt="OnePunch Man downloaded"></p>
<p>As I've been evolving in my studies of Elixir that tool felt like a great candidate to test my current knowledge of the platform. It would make me test:</p>
<ol>
  <li>Fetch and parse ad hoc content through HTTP (<a href="https://github.com/myfreeweb/httpotion">HTTPotion</a> and <a href="https://github.com/philss/floki">Floki</a>).</li>
  <li>Test parallel/asynchronous downloads (Elixir's built-in <a href="https://elixir-lang.org/docs/stable/elixir/Task.html">Task</a> module).</li>
  <li>The build-in command line and <a href="https://elixir-lang.org/docs/stable/elixir/OptionParser.html">option parser</a> support.</li>
  <li>Basic testing through ExUnit and mocking the workflow (<a href="https://github.com/jjh42/mock">Mock</a>).</li>
</ol>
<p>The exercise was very interesting, and a scrapper is also an ideal candidate for TDD. The initial steps had to go like this:</p>
<ol>
  <li>Parse the main manga page to fetch all the chapter links.</li>
  <li>Parse each chapter page to fetch all the individual pages.</li>
  <li>Parse each page to parse the main embedded image (the actual manga page).</li>
</ol>
<p>For each of those initial steps I did a simple unit test and the <tt>IndexPage</tt>, <tt>ChapterPage</tt> and <tt>Page</tt> modules. They have roughly the same structure, this is one example:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">IndexPage</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">chapters</span>(manga_root_url) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.get(manga_root_url, [<span style="color:#808">timeout</span>: <span style="color:#00D;font-weight:bold">30_000</span>]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: body, <span style="color:#808">headers</span>: _headers, <span style="color:#808">status_code</span>: <span style="color:#00D;font-weight:bold">200</span> } -&gt;<tt>
</tt>        {<span style="color:#A60">:ok</span>, fetch_manga_title(body), fetch_chapters(body) }<tt>
</tt>      _ -&gt;<tt>
</tt>        {<span style="color:#A60">:err</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">not found</span><span style="color:#710">"</span></span>}<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp fetch_manga_title(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#mangaproperties h1</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">h1</span><span style="color:#710">"</span></span>, [], [title]} -&gt; title <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.at(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp fetch_chapters(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#listing a</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">a</span><span style="color:#710">"</span></span>, [{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>, url}], _} -&gt; url <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Here I am already exercising some of Elixir's awesome features such as pattern matching the result of the <tt>HTTPotion.get/2</tt> function to extract the body from the returning record.</p>
<p>Then I pass the HTML body to 2 different functions: <tt>fetch_manga_title</tt> and <tt>fetch_chapters</tt>. They both use the Floki package which can use CSS selectors to return a List. Then I need to walk through the list (using <tt>Enum.map/2</tt> for example) and pattern match on it to extract the values I need.</p>
<p><a href="https://elixir-lang.org/getting-started/pattern-matching.html">Pattern Matching</a> is one of the most important concepts to learn about Elixir/Erlang. It's different from simply assigning a value to a variable, it can be used to dismount a structure into its components and get their individual parts.</p>
<p>Then I just went through building the skeleton for the command line interface. This is already explained in other tutorials such as <a href="https://asquera.de/blog/2015-04-10/writing-a-commandline-app-in-elixir/">this</a> and <a href="https://speakerdeck.com/st23am/writing-command-line-applications-in-elixir">this</a>, so I won't waste time explaining it again. At the core I needed to have the following workflow:</p>
<ol>
  <li>Starting from the Manga main URL at MangaReader, extract the chapters</li>
  <li>Then loop through the chapters and fetch all the pages</li>
  <li>Then loop through the pages and fetch all the image sources</li>
  <li>Then loop through the images and download them all to a temporary directory</li>
  <li>Then sort through files in the directory and move them to sub-directories of 250 images each (I think it is a good size for each volume)</li>
  <li>Finally, resize and convert all the images of each sub-directory into a PDF file for my Kindle to consume.</li>
</ol>
<p>This workflow is defined like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp process(manga_name, url, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">File</span>.mkdir_p!(directory)<tt>
</tt><tt>
</tt>  url<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.chapters<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.pages<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.images_sources<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.process_downloads(directory)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.optimize_images<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.compile_pdfs(manga_name)<tt>
</tt>    |&gt; finish_process<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is one place where the pipeline notation from Elixir really shines. It's much better than having to write this equivalent:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Workflow</span>.compile_pdfs(<span style="color:#036;font-weight:bold">Workflow</span>.optimize_images(directory))<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This notation is just syntatic sugar where the returning value of the previous statement is used as the first argument of the following function. Combine that with other syntatic sugars such as parenthesis being optional (just like beloved Ruby) and you have a clear exposure of "transforming from a URL into compiled PDFs".</p>
<p>I separated the Workflow into its own module and each step is very similar, each taking a list and walking through it. This the simplest of them:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>(chapter_list) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  chapter_list<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt; <span style="color:#036;font-weight:bold">ChapterPage</span>.pages(&amp;<span style="color:#00D;font-weight:bold">1</span>) <span style="color:#080;font-weight:bold">end</span>)))<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(&amp;(<span style="color:#036;font-weight:bold">Task</span>.await(&amp;<span style="color:#00D;font-weight:bold">1</span>, <span style="color:#33B">@http_timeout</span>)))<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reduce([], fn {<span style="color:#A60">:ok</span>, list}, acc -&gt; acc ++ list <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you're new to Elixir here you will find another oddity, this <tt>"&amp;(x(&amp;1))"</tt>, this is just a shortcut macro to this other similar statement:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Enum</span>.map(fn (list) -&gt;<tt>
</tt>  <span style="color:#036;font-weight:bold">Task</span>.async(fn -&gt;<tt>
</tt>    <span style="color:#036;font-weight:bold">ChapterPage</span>.pages(list)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p><a href="https://elixir-lang.org/docs/stable/elixir/Enum.html">Enum</a> is one of the most useful modules you need to master. If you come from Ruby it feels like home, you must learn all of its functions. You're usually having to transform one collection into another, so it's important to study it throughly.</p>
<h3>A few problems understanding parallel HTTP processing (W.I.P.)</h3>
<p>Then there is this <tt>Task.async/await</tt> deal. If you're from a language that have Threads, it's quite similar: you start several different Threads and await for all of them to return before continuing. But a Task in Elixir is not a real thread, it's <a href="https://en.wikipedia.org/wiki/Green_threads#Green_threads_in_other_languages">"green thread"</a> or, in Erlang lingo, a very lightweight "process". Erlang uses processes for everything, thus does Elixir. Under the hood, the "Task" module encapsulates the entire OTP framework for supervisors/workers. But instead of having to deal right now with <a href="https://elixir-lang.org/getting-started/mix-otp/genserver.html">OTP GenServer</a> I decided to go the simpler route for now, and the "Task" module accomplishes just that.</p>
<p>Then, I ended up with a problem. If I just kept going like this, spawning hundreds of async HTTP calls, I quickly end up with this exception:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">17:10:55.882 [error] Task #PID&lt;0.2217.0&gt; started from #PID&lt;0.69.0&gt; terminating<tt>
</tt>** (HTTPotion.HTTPError) req_timedout<tt>
</tt>    (httpotion) lib/httpotion.ex:209: HTTPotion.handle_response/1<tt>
</tt>    (ex_manga_downloadr) lib/ex_manga_downloadr/mangareader/page.ex:6: ExMangaDownloadr.MangaReader.Page.image/1<tt>
</tt>    (elixir) lib/task/supervised.ex:74: Task.Supervised.do_apply/2<tt>
</tt>    (elixir) lib/task/supervised.ex:19: Task.Supervised.async/3<tt>
</tt>    (stdlib) proc_lib.erl:240: :proc_lib.init_p_do_apply/3<tt>
</tt>Function: #Function&lt;12.106612505/0 in ExMangaDownloadr.Workflow.images_sources/1&gt;<tt>
</tt>    Args: []<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That's why there is <tt>@maximum_fetches 80</tt> at the top of the <tt>Workflow</tt> module, together with this other odd construction:</p>
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
<p>This gets a huge list (such as all the pages of a very long manga like Naruto), breaks it down to smaller 80 elements list and then proceed to fire up the asynchronous Tasks, reducing the results back to a plain List. The <tt>chunk/2</tt> private function just get the smaller size between the list length and the maximum fetches value.</p>
<p>Sometimes it breaks down if the maximum is larger, sometimes it doesn't, so my guess is my code not dealing with network instabilities (with some retry logic) or even the MangaReader site queueing up above my designated timeout (which I set to 30 seconds). Either way, keeping the maximum value lower than 100 seem to be a good balance without crashing the workflow down.</p>
<p>This is one part I am not entirely sure what to do to deal with uncertainties in the external website not responding or network falling down for a little while. HTTPotion has support for asynchronous calls, but I don't know what's the difference between using that or just making synchronous calls within parallel processes with Task, the way I'm doing. And in either case, they are supervised workers, how do I handle the exceptions, how should I implement logic to retry the call once it fails? If anyone has more knowledge about this, a comment below will be really appreciated.</p>
<p>Finally, there is one dirty trick under the reason of why I like to use MangaReader: it's very friendly to scrappers because on each page of the manga the image is annotated with an "alt" attribute with the format "[manga name] [chapter number] - [page number]". So I just had to reformat it a bit, adding a pad of zeroes before the chapter and page number so a simple sort of the downloaded files will give me the correct order. MangaFox is not so friendly. This is how to reformat it:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp normalize_metadata(image_src, image_alt) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  extension      = <span style="color:#036;font-weight:bold">String</span>.split(image_src, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.</span><span style="color:#710">"</span></span>) |&gt; <span style="color:#036;font-weight:bold">Enum</span>.at(<span style="color:#00D;font-weight:bold">-1</span>)<tt>
</tt>  list           = <span style="color:#036;font-weight:bold">String</span>.split(image_alt)      |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reverse<tt>
</tt>  title_name     = <span style="color:#036;font-weight:bold">Enum</span>.slice(list, <span style="color:#00D;font-weight:bold">4</span>, <span style="color:#036;font-weight:bold">Enum</span>.count(list) - <span style="color:#00D;font-weight:bold">1</span>) |&gt; <span style="color:#036;font-weight:bold">Enum</span>.join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""> </span><span style="color:#710">"</span></span>)<tt>
</tt>  chapter_number = <span style="color:#036;font-weight:bold">Enum</span>.at(list, <span style="color:#00D;font-weight:bold">3</span>) |&gt; <span style="color:#036;font-weight:bold">String</span>.rjust(<span style="color:#00D;font-weight:bold">5</span>, <span style="color:#00D;font-weight:bold">?0</span>)<tt>
</tt>  page_number    = <span style="color:#036;font-weight:bold">Enum</span>.at(list, <span style="color:#00D;font-weight:bold">0</span>) |&gt; <span style="color:#036;font-weight:bold">String</span>.rjust(<span style="color:#00D;font-weight:bold">5</span>, <span style="color:#00D;font-weight:bold">?0</span>)<tt>
</tt>  {image_src, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>title_name<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>chapter_number<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> - Page </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>page_number<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>extension<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Once I have all the images, I spawn another external process using <a href="https://github.com/alco/porcelain">Porcelain</a> to deal with shelling out to run ImageMagick's Mogrify and Convert tools to resize all the images down to 600x800 pixels (Kindle Voyage resolution) and pack them together into a PDF file. This results in PDF files with 250 pages and around 20Mb in size. Now it is just a matter of copying the files to my Kindle through USB.</p>
<p>The ImageMagick code is quite boring, I just generate the commands in the following format for Mogrify:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">"mogrify -resize #{@image_dimensions} #{directory}/*.jpg"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And compile the PDFs with this other command:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">"convert #{volume_directory}/*.jpg #{volume_file}"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(By the way, notice the Ruby-like String interpolation we're used to.)</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/526/big_11249911_10153742264949837_7817568172948440418_n.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/526/11249911_10153742264949837_7817568172948440418_n.jpg 2x" alt="OnePunch Man in Kindle"></p>
<p>Technically I could copy the MangaReader module files into a new MangaFox module and repurpose the same Workflow logic once I tweak the parsers to deal with MangaFox page format. But I leave that as an exercise to the reader.</p>
<p>The MangaReader module tests do real calls to their website. I left it that way on purpose because if the test fails it means that they changed the website format and the parser needs tweaking to conform. But after a few years I never saw they changing enough to break my old Ruby parser.</p>
<p>Just as a final exercise I imported the Mock package, to control how some inner pieces of the Workflow implementation returns. It's called Mock but it's more like stubbing particular functions of a module. I can declare a block where I override the <tt>File.rename/1</tt> so it doesn't actually try to move a file that doesn't exist in the test environment. This makes the test more brittle because it depends on a particular implementation, which is never good, but when we are dealing with external I/O, this might be the only option to isolate. This is how the Workflow test was done. Again, if there is a better way I am eager to learn how, please comment down below.</p>
<p>This is how a unit test with Mock looks like, stubbing both the HTTPotion and File modules:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">workflow tries to download the images</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  with_mock <span style="color:#036;font-weight:bold">HTTPotion</span>, [<span style="color:#808">get</span>: fn(_url, _options) -&gt; %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: <span style="color:#038;font-weight:bold">nil</span>, <span style="color:#808">headers</span>: <span style="color:#038;font-weight:bold">nil</span>, <span style="color:#808">status_code</span>: <span style="color:#00D;font-weight:bold">200</span> } <span style="color:#080;font-weight:bold">end</span>] <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    with_mock <span style="color:#036;font-weight:bold">File</span>, [<span style="color:#808">write!</span>: fn(_filename, _body) -&gt; <span style="color:#038;font-weight:bold">nil</span> <span style="color:#080;font-weight:bold">end</span>] <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      assert <span style="color:#036;font-weight:bold">Workflow</span>.process_downloads([{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://src_foo</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">filename_foo</span><span style="color:#710">"</span></span>}], <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/tmp</span><span style="color:#710">"</span></span>) == [{<span style="color:#A60">:ok</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://src_foo</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/tmp/filename_foo</span><span style="color:#710">"</span></span>}]<tt>
</tt>      assert called <span style="color:#036;font-weight:bold">HTTPotion</span>.get(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://src_foo</span><span style="color:#710">"</span></span>, [<span style="color:#808">timeout</span>: <span style="color:#00D;font-weight:bold">30_000</span>])<tt>
</tt>      assert called <span style="color:#036;font-weight:bold">File</span>.write!(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/tmp/filename_foo</span><span style="color:#710">"</span></span>, <span style="color:#038;font-weight:bold">nil</span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Conclusion</h3>
<p>This has been a very fun experience, albeit very short, and good enough to iron out what I have learned so far. Code like this make me smile:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[destination_file|_rest] = <span style="color:#036;font-weight:bold">String</span>.split(file, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>) |&gt; <span style="color:#036;font-weight:bold">Enum</span>.reverse<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The way I can pattern match to extract the head of a list is a different way of thinking. Then there is the other most important way of thinking: everything is a transformation chain, an application is a way to start from some input argument (such as a URL) and go step by step to "transform" it into a collection of PDF files, for example.</p>
<p>Instead of thinking on how to architect classes and objects, we start thinking about what is the initial arguments and what is the result I want to achieve, and go from there, one small transformation function at a time.</p>
<p>The Workflow module is an example. I actually started writing everything in a single large function in the CLI module. Then I refactored into smaller function and chained them together to create the Workflow. Finally, I just moved all the functions into the Workflow module and called that from the CLI module.</p>
<p>Because of no global state, thinking in smaller and isolated small functions, both refactoring and test-driven development are much smoother than in OOP languages. This way of thinking is admitedly slow to get a grip, but then it starts to feel very natural and it quickly steers your way of programming into leaner code.</p>
<p>And the dynamic aspects of both Erlang and Elixir make me feel right at home, just like having an "improved Ruby".</p>
<p>The code of the downloader is all on <a href="https://github.com/akitaonrails/ex_manga_downloadr/blob/master/lib/ex_manga_downloadr/mangareader/index_page.ex">Github, please fork it</a>.</p>
<p>I am eager to exercise more. I hope this motivates you to learn Elixir. And if you're already an advanced programmer in Elixir or Erlang, don't forget to comment below and even send me a Pull Request to improve this small exercise. I am still a beginner and there is a lot of room to learn more. All contributions are greatly appreciated.</p>
<p></p>
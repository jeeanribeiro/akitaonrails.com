---
title: "Ex Manga Downloadr - Part 3: Mangafox Support!"
date: "2015-12-02T18:27:00.000Z"
tags: ["learning", "beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p>I thought <a href="http://www.akitaonrails.com/2015/11/19/ex-manga-downloadr-part-2-poolboy-to-the-rescue">Part 2</a> would be my last article about this tool, but turns out its just too much fun to let it go easily. As usual, all the source code is on my <a href="https://github.com/akitaonrails/ex_manga_downloadr">Github repository</a>. And the gist of the post is that now you can do this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git pull<tt>
</tt>mix escript.build<tt>
</tt>./ex_manga_downloadr -n onepunch -u http://mangafox.me/manga/onepunch_man/ -d /tmp/onepunch -s mangafox<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And there you go: download from Mangafox built-in! \o/</p>
<p></p>
<p></p>
<p>It starts when I wanted to download manga that is not available at MangaReader but exists under Mangafox.</p>
<p>So, the initial endeavor was to copy the MangaReader parser modules (IndexPage, ChapterPage, and Page) and paste them at a specific "lib/ex_manga_downloadr/mangafox" folder. Same thing done to the unit tests folder. Just a matter of copying and pasting the files and change the "MangaReader" module name to "Mangafox".</p>
<p>Of course the URL formats are different, the Floki CSS selectors are a bit different, so that's what have to change in the parser. For example, this is how I parse the chapter links from the main page at MangaReader:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp fetch_chapters(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#listing a</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">a</span><span style="color:#710">"</span></span>, [{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>, url}], _} -&gt; url <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is the same thing but for Mangafox:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp fetch_chapters(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  html<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Floki</span>.find(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.chlist a[class='tips']</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">a</span><span style="color:#710">"</span></span>, [{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>, url}, {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">title</span><span style="color:#710">"</span></span>, _}, {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">class</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">tips</span><span style="color:#710">"</span></span>}], _} -&gt; url <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Exactly the same logic but the pattern matching structure is different because the returning HTML DOM nodes are different.</p>
<p>Another difference is that MangaReader returns everything in plain text by default, but Mangafox returns everything Gzipped regardless if I send the "Accept-Encoding" HTTP header (curiously, if I retry several times it changes behavior and sometimes send plain text).</p>
<p>What I did different was to check if the returned <tt>%HTTPotion.Response{}</tt> structure had a "Content-Encoding" header set to "gzip" and if so, gunzip it using the built-in Erlang "zlib" package (nothing to import!):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">gunzip</span>(body, headers) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> headers[<span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">Content-Encoding</span><span style="color:#630">"</span></span>] == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">gzip</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#A60">:zlib</span>.gunzip(body)<tt>
</tt>  <span style="color:#080;font-weight:bold">else</span><tt>
</tt>    body<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I would've preferred if HTTPotion did that out of the box for me (#OpportunityToContribute!), but this was easy enough.</p>
<p>Once the unit tests were passing correctly after tuning the scrapper (HTTPotion requests) and parser (Floki selectors) it was time to make my Worker aware of the existence of this new set of modules.</p>
<p>The Workflow module just call the Worker, which in turn does the heavy lifting of fetching pages and downloading images. The Worker called the MangaReader module directly, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Worker</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">GenServer</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">Logger</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">chapter_page</span>(chapter_link) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Task</span>.async fn -&gt; <tt>
</tt>      <span style="color:#A60">:poolboy</span>.transaction <span style="color:#A60">:worker_pool</span>, fn(server) -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">GenServer</span>.call(server, {<span style="color:#A60">:chapter_page</span>, chapter_link}, <span style="color:#33B">@timeout_ms</span>)<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span>, <span style="color:#33B">@transaction_timeout_ms</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({<span style="color:#A60">:chapter_page</span>, chapter_link}, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:reply</span>, <span style="color:#036;font-weight:bold">ChapterPages</span>.pages(chapter_link), state}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That "<tt>use ExMangaDownloadr.MangaReader</tt>" statement up above is just a macro that will alias the corresponding modules:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  defmacro __using__(_opts) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">IndexPage</span><tt>
</tt>      <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">ChapterPage</span><tt>
</tt>      <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">Page</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So when I call "<tt>ChapterPages.pages(chapter_link)</tt>" it's a shortcut to use the fully qualified module name like this: "<tt>ExMangaDownloadr.MangaReader.ChapterPages.pages(chapter_link)</tt>".</p>
<p>An Elixir module namespace is just an Atom. Nested module names have the full, dot-separated name, prefixed with it's parent. For example:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Foo</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  defmodule <span style="color:#036;font-weight:bold">Bar</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    defmodule <span style="color:#036;font-weight:bold">Xyz</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>       <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">teste</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>       <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can just call "<tt>Foo.Bar.Xyz.teste()</tt>" and that's it. But there is a small trick. Elixir also transparently prefixes the full module name with "Elixir". So in reality, the full module name is "Elixir.Foo.Bar.Xyz", in order to make sure no Elixir module ever conflicts with an existing Erlang module.</p>
<p>This is important because of this new function I added to the Worker module first:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">manga_source</span>(source, <span style="color:#080;font-weight:bold">module</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> source <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">mangareader</span><span style="color:#710">"</span></span> -&gt; <span style="color:#036;font-weight:bold">String</span>.to_atom(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Elixir.ExMangaDownloadr.MangaReader.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#080;font-weight:bold">module</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">mangafox</span><span style="color:#710">"</span></span>    -&gt; <span style="color:#036;font-weight:bold">String</span>.to_atom(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Elixir.ExMangaDownloadr.Mangafox.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#080;font-weight:bold">module</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how I map from "mangafox" to the new "ExMangaDownloadr.Mangafox." namespace. And because of the dynamic, message passing nature of Elixir, I can replace this code:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({<span style="color:#A60">:chapter_page</span>, chapter_link}, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  {<span style="color:#A60">:reply</span>, <span style="color:#036;font-weight:bold">ChapterPages</span>.pages(chapter_link), state}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>With this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_call</span>({<span style="color:#A60">:chapter_page</span>, chapter_link, source}, _from, state) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  links = source<tt>
</tt>    |&gt; manga_source(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ChapterPage</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; apply(<span style="color:#A60">:pages</span>, [chapter_link])<tt>
</tt>  {<span style="color:#A60">:reply</span>, links, state}<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I can now choose between the "Elixir.ExMangaDownloadr.Mangafox.ChapterPage" or "Elixir.ExMangaDownloadr.MangaReader.ChapterPage" modules, call the <tt>pages/1</tt> function and send the same argument as before. I just have to make sure I can receive a "source" string from the command line now, so I change the CLI module like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp parse_args(args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  parse = <span style="color:#036;font-weight:bold">OptionParser</span>.parse(args,<tt>
</tt>    <span style="color:#808">switches</span>: [<span style="color:#808">name</span>: <span style="color:#A60">:string</span>, <span style="color:#808">url</span>: <span style="color:#A60">:string</span>, <span style="color:#808">directory</span>: <span style="color:#A60">:string</span>, <span style="color:#808">source</span>: <span style="color:#A60">:string</span>],<tt>
</tt>    <span style="color:#808">aliases</span>: [<span style="color:#808">n</span>: <span style="color:#A60">:name</span>, <span style="color:#808">u</span>: <span style="color:#A60">:url</span>, <span style="color:#808">d</span>: <span style="color:#A60">:directory</span>, <span style="color:#808">s</span>: <span style="color:#A60">:source</span>]<tt>
</tt>  )<tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> parse <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {[<span style="color:#808">name</span>: manga_name, <span style="color:#808">url</span>: url, <span style="color:#808">directory</span>: directory, <span style="color:#808">source</span>: source], _, _} -&gt; process(manga_name, url, directory, source)<tt>
</tt>    {[<span style="color:#808">name</span>: manga_name, <span style="color:#808">directory</span>: directory], _, _} -&gt; process(manga_name, directory)<tt>
</tt>    {_, _, _ } -&gt; process(<span style="color:#A60">:help</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Compared to the previous version I just added the "<tt>:source</tt>" string argument to the OptionParser and passed the captured value to <tt>process/4</tt>. I should add some validation here to avoid strings different than "mangareader" or "mangafox", but I will leave that to another time.</p>
<p>And in the Workflow module, instead of starting from just the manga URL, now I have to start with both the URL and the manga source:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[url, source]<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.chapters<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.pages<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.images_sources<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Which means that each of the above functions have to not only return the new URL lists but also pass through the source:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">chapters</span>([url, source]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  {<span style="color:#A60">:ok</span>, _manga_title, chapter_list} = source<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Worker</span>.manga_source(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">IndexPage</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; apply(<span style="color:#A60">:chapters</span>, [url])<tt>
</tt>  [chapter_list, source]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This was the only function in the Workflow module hardcoded to MangaReader so I also make it dynamic using the same <tt>manga_source/2</tt> function from the Worker, and notice the return value being "<tt>[chapter_list, source]</tt>" instead of just "<tt>chapter_list</tt>".</p>
<p>And now, I can finally test with "<tt>mix test</tt>" and create the new executable command line binary with "<tt>mix escript.build</tt>" and run the new version like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">./ex_manga_downloadr -n onepunch -u https://mangafox.me/manga/onepunch_man/ -d /tmp/onepunch -s mangafox<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The Mangafox site is very unreliable to several concurrent connections and it quickly timeout sometimes, dumping ugly errors like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">15:58:46.637 [error] Task #PID&lt;0.2367.0&gt; started from #PID&lt;0.124.0&gt; terminating<tt>
</tt>** (stop) exited in: GenServer.call(#PID&lt;0.90.0&gt;, {:page_download_image, {"https://z.mfcdn.net/store/manga/11362/TBD-053.2/compressed/h006.jpg", "Onepunch-Man 53.2: 53rd Punch [Fighting Spirit] (2) at MangaFox.me-h006.jpg"}, "/tmp/onepunch"}, 1000000)<tt>
</tt>    ** (EXIT) an exception was raised:<tt>
</tt>        ** (HTTPotion.HTTPError) connection_closing<tt>
</tt>            (httpotion) lib/httpotion.ex:209: HTTPotion.handle_response/1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I did not figure out how to retry HTTPotion requests properly yet. But one small thing I did was add an availability check in the Worker module. So you can just re-run the same command line and it will resume downloading only the remaining files:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp download_image({image_src, image_filename}, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  filename = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>directory<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>image_filename<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">File</span>.exists?(filename) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Image </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>filename<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> already downloaded, skipping.</span><span style="color:#710">"</span></span>)<tt>
</tt>    {<span style="color:#A60">:ok</span>, image_src, filename}<tt>
</tt>  <span style="color:#080;font-weight:bold">else</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Downloading image </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>image_src<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> to </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>filename<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.get(image_src,<tt>
</tt>      [<span style="color:#808">headers</span>: [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">User-Agent</span><span style="color:#710">"</span></span>: <span style="color:#33B">@user_agent</span>], <span style="color:#808">timeout</span>: <span style="color:#33B">@http_timeout</span>]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: body, <span style="color:#808">headers</span>: _headers, <span style="color:#808">status_code</span>: <span style="color:#00D;font-weight:bold">200</span> } -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">File</span>.write!(filename, body)<tt>
</tt>        {<span style="color:#A60">:ok</span>, image_src, filename}<tt>
</tt>      _ -&gt;<tt>
</tt>        {<span style="color:#A60">:err</span>, image_src}<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should at least reduce rework. Another thing I am still working on is this other bit at the main "CLI.process" function:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp process(manga_name, url, directory, source) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">File</span>.mkdir_p!(directory)<tt>
</tt>  dump_file = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>directory<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/images_list.dump</span><span style="color:#710">"</span></span><tt>
</tt>  images_list = <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">File</span>.exists?(dump_file) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>                  <span style="color:#A60">:erlang</span>.binary_to_term(<span style="color:#036;font-weight:bold">File</span>.read(dump_file))<tt>
</tt>                <span style="color:#080;font-weight:bold">else</span><tt>
</tt>                  list = [url, source]<tt>
</tt>                    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.chapters<tt>
</tt>                    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.pages<tt>
</tt>                    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.images_sources<tt>
</tt>                  <span style="color:#036;font-weight:bold">File</span>.write(dump_file, <span style="color:#A60">:erlang</span>.term_to_binary(list))<tt>
</tt>                  list<tt>
</tt>                <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  images_list<tt>
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
<p>As you can see the idea is to serialize the final images URL links to a file using the built-in serializer "<tt>:erlang.binary_to_term/1</tt>" and check if that dump file exists, and deserialize with "<tt>:erlang.term_to_binary/1</tt>" before fetching all pages all over again. Now the process can resume directly from the <tt>process_downloads/2</tt> function after.</p>
<p>Mangafox is terribly unreliable and I will need to figure out a better way to retry timed out connections without having to crash and manually restart from the command line. It's either a bad site or a clever one that shuts down scrappers like me, although I am guessing it's just a bad infrastructure on their side.</p>
<p>If I downgrade from 50 process to 5 in the pool, it seems to be able to handle it better (but the process slows down, of course):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">    pool_options = [<tt>
</tt>      <span style="color:#808">name</span>: {<span style="color:#A60">:local</span>, <span style="color:#A60">:worker_pool</span>},<tt>
</tt>      <span style="color:#808">worker_module</span>: <span style="color:#036;font-weight:bold">PoolManagement</span>.<span style="color:#036;font-weight:bold">Worker</span>,<tt>
</tt>      <span style="color:#808">size</span>: <span style="color:#00D;font-weight:bold">5</span>,<tt>
</tt>      <span style="color:#808">max_overflow</span>: <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>    ]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you see time out errors, change this parameter. MangaReader still supports 50 or more for concurrency.</p>
<p>And now you know how to add support for more manga sources. Feel free to send me a Pull Request! :-)</p>
<p></p>
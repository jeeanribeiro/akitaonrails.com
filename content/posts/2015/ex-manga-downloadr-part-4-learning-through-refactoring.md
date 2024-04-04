---
title: "Ex Manga Downloadr - Part 4: Learning through Refactoring"
date: "2015-12-03T19:40:00.000Z"
tags: ["learning", "beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p><a href="http://www.akitaonrails.com/2015/12/02/ex-manga-downloadr-part-3-mangafox-support">Yesterday I added Mangafox support</a> to my downloader tool and it also added a bit of dirty code into my already not-so-good coding. It's time for some serious cleanup.</p>
<p>You can see everything I did since yesterday to clean things up through <a href="https://github.com/akitaonrails/ex_manga_downloadr/compare/59694565592f8a3bea95115b858dd2ddfdc89873...3ae7dd98a8fd7bae47ffd7a24c0c42a2c3777fad">Github's awesome compare page</a></p>
<p>First things first: now the choice to have added a reasonable amount of tests will pay off. In this refactoring I changed function signatures, response formats, moved a fair amount of code around, and without the tests this endeavor would have taken me the entire day or more, rendering the refactor efforts questionable to begin with.</p>
<p>At each step of the refactoring I could run "<tt>mix test</tt>" and work until I ended up with the green status:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Finished in 13.5 seconds (0.1s on load, 13.4s on tests)<tt>
</tt>12 tests, 0 failures<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The tests are taking long because I made a choice for the MangaReader and Mangafox unit tests to actually go online and fetch from the sites. It takes longer to run the suite but I know that if it breaks and I didn't touch that code, the source websites changed their formats and I need to change the parser. I could have added fixtures to make the tests run faster, but the point in my parser is for them to be correct.</p>
<p></p>
<p></p>
<h3>Macros to the Rescue!</h3>
<p>Each source module has 3 sub-modules: ChapterPage, IndexPage and Page. All of them have a main function that resembles this piece of code:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">Mangafox</span>.<span style="color:#036;font-weight:bold">ChapterPage</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">Logger</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>(chapter_link) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Fetching pages from chapter </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>chapter_link<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.get(chapter_link, [<span style="color:#808">headers</span>: [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">User-Agent</span><span style="color:#710">"</span></span>: <span style="color:#33B">@user_agent</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Accept-encoding</span><span style="color:#710">"</span></span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">gzip</span><span style="color:#710">"</span></span>], <span style="color:#808">timeout</span>: <span style="color:#00D;font-weight:bold">30_000</span>]) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: body, <span style="color:#808">headers</span>: headers, <span style="color:#808">status_code</span>: <span style="color:#00D;font-weight:bold">200</span> } -&gt;<tt>
</tt>        body = <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">Mangafox</span>.gunzip(body, headers)<tt>
</tt>        { <span style="color:#A60">:ok</span>, fetch_pages(chapter_link, body) }<tt>
</tt>      _ -&gt;<tt>
</tt>        { <span style="color:#A60">:err</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">not found</span><span style="color:#710">"</span></span>}<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(Listing 1.1)</p>
<p>It calls "<tt>HTTPotion.get/2</tt>" sending a bunch of HTTP options and receives a "<tt>%HTTPotion.Response</tt>" struct that is then decomposed to get the body and headers. It gunzips the body if necessary and goes to parse the HTML itself.</p>
<p>Similar code exists in 6 different modules, with different links and different parser functions. It's a lot of repetition, but what about making the above code look like the snippet below?</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">Mangafox</span>.<span style="color:#036;font-weight:bold">ChapterPage</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">Logger</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">ExMangaDownloadr</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pages</span>(chapter_link) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.fetch chapter_link, <span style="color:#808">do</span>: fetch_pages(chapter_link)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(Listing 1.2)</p>
<p>Changed 9 lines to just 1. And by the way, this same line can be written like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.fetch chapter_link <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  fetch_pages(chapter_link)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Seems familiar? It's like every block in the Elixir language, you can write it in the "do/end" block format or the way it really is under the covers: a keyword list with a key named ":do". And the way this macro is defined is like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  defmacro fetch(link, <span style="color:#808">do</span>: expression) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Logger</span>.debug(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Fetching from </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>unquote(link)<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>      <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">HTTPotion</span>.get(unquote(link), <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.http_headers) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        %<span style="color:#036;font-weight:bold">HTTPotion</span>.<span style="color:#036;font-weight:bold">Response</span>{ <span style="color:#808">body</span>: body, <span style="color:#808">headers</span>: headers, <span style="color:#808">status_code</span>: <span style="color:#00D;font-weight:bold">200</span> } -&gt;<tt>
</tt>          { <span style="color:#A60">:ok</span>, body |&gt; <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.gunzip(headers) |&gt; unquote(expression) }<tt>
</tt>        _ -&gt;<tt>
</tt>          { <span style="color:#A60">:err</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">not found</span><span style="color:#710">"</span></span>}<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(Listing 1.3)</p>
<p>There is a lot of details to consider when writing a macro and I recommend reading the documentation on <a href="https://elixir-lang.org/getting-started/meta/macros.html">Macros</a>. The code is basically copying the function body from the "<tt>ChapterPage.pages/1</tt>" (Listing 1.1) and pasting into the "<tt>quote do .. end</tt>" block (Listing 1.3).</p>
<p>Inside that code we have "<tt>unquote(link)</tt>" and "<tt>unquote(expression)</tt>". You also must read the documentation on <a href="https://elixir-lang.org/getting-started/meta/quote-and-unquote.html">"Quote and Unquote"</a>. It just expands this "external" code inside the macro code to defer execution until the macro quote code is actually executed, instead of running it at that exact moment. I know, tricky to wrap your head around this the first time.</p>
<p>The bottom line is: whatever code is inside the "quote" block will be "inserted" where we called "<tt>ExMangaDownloadr.fetch/2</tt>" in the "pages/1" function in Listing 1.2, together with the unquoted code you passed as a parameter.</p>
<p>The resulting code will resemble the original code in Listing 1.1.</p>
<p>To make it simpler, if you were in Javascript this would be a similar code:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">fetch</span>(url) {<tt>
</tt>    eval(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">doSomething('</span><span style="color:#710">"</span></span> + url + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">')</span><span style="color:#710">"</span></span>);<tt>
</tt>}<tt>
</tt><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">pages</span>(page_link) {<tt>
</tt>    fetch(page_link);<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>"Quote" would be like the string body in an eval and "unquote" just concatenating the value you passed inside the code being eval-ed. This is a crude metaphor as "quote/unquote" is <strong>way</strong> more powerful and cleaner than ugly "eval" (you shouldn't be using, by the way!) But this metaphor should do to make you understand the code above.</p>
<p>Another place I used a macro was to save the images list in a dump file and load it later if the tool crashes for some reason, in order not to have to start over from scratch. The original code was like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">dump_file = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>directory<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/images_list.dump</span><span style="color:#710">"</span></span><tt>
</tt>images_list = <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">File</span>.exists?(dump_file) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>                <span style="color:#A60">:erlang</span>.binary_to_term(<span style="color:#036;font-weight:bold">File</span>.read!(dump_file))<tt>
</tt>              <span style="color:#080;font-weight:bold">else</span><tt>
</tt>                list = [url, source]<tt>
</tt>                  |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.chapters<tt>
</tt>                  |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.pages<tt>
</tt>                  |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.images_sources<tt>
</tt>                <span style="color:#036;font-weight:bold">File</span>.write(dump_file, <span style="color:#A60">:erlang</span>.term_to_binary(list))<tt>
</tt>                list<tt>
</tt>              <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(Listing 1.4)</p>
<p>And now that you understand macros, you will understand what I did here:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  defmacro managed_dump(directory, <span style="color:#808">do</span>: expression) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      dump_file = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>unquote(directory)<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/images_list.dump</span><span style="color:#710">"</span></span><tt>
</tt>      images_list = <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">File</span>.exists?(dump_file) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>          <span style="color:#A60">:erlang</span>.binary_to_term(<span style="color:#036;font-weight:bold">File</span>.read!(dump_file))<tt>
</tt>        <span style="color:#080;font-weight:bold">else</span><tt>
</tt>          list = unquote(expression)<tt>
</tt>          <span style="color:#036;font-weight:bold">File</span>.write(dump_file, <span style="color:#A60">:erlang</span>.term_to_binary(list))<tt>
</tt>          list<tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">CLI</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">Workflow</span><tt>
</tt>  require <span style="color:#036;font-weight:bold">ExMangaDownloadr</span><tt>
</tt>  ...<tt>
</tt>  defp process(manga_name, directory, {_url, _source} = manga_site) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">File</span>.mkdir_p!(directory)<tt>
</tt><tt>
</tt>    images_list = <tt>
</tt>      <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.managed_dump directory <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        manga_site<tt>
</tt>          |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.chapters<tt>
</tt>          |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.pages<tt>
</tt>          |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.images_sources <tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    ...<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And there you have it! And now you see how "do .. end" blocks are implemented. It just passes the expression as the value in the keyword list of the macro definition. Let's define a dumb macro:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Foo</span><tt>
</tt>  defmacro foo(<span style="color:#808">do</span>: expression) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>     quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>       unquote(expression)<tt>
</tt>     <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And not the following calls are all equivalent:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="color:#036;font-weight:bold">Foo</span><tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.foo <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.foo <span style="color:#808">do</span>: <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.foo(<span style="color:#808">do</span>: <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="color:#00D;font-weight:bold">1</span>))<tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.foo([<span style="color:#808">do</span>: <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="color:#00D;font-weight:bold">1</span>)])<tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.foo([{<span style="color:#A60">:do</span>, <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="color:#00D;font-weight:bold">1</span>)}])<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is macros combined with <a href="https://elixir-lang.org/getting-started/maps-and-dicts.html">Keyword Lists</a> which I explained in previous articles and it's simply a List with tuples where each tuple has an atom key and a value.</p>
<h3>More Macros</h3>
<p>Another opportunity to refactor were the "mangareader.ex" and "mangafox.ex" modules that were just used in the unit tests "mangareader_test.ex" and "mangafox_test.ex". This is the old "mangareader.ex" code:</p>
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
</tt><span style="color:#080;font-weight:bold">end</span> <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is how it was used in "mangareader_test.ex":</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReaderTest</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExUnit</span>.<span style="color:#036;font-weight:bold">Case</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It was just a shortcut to alias the modules in order to use them directly inside the tests. I just moved the entire module as a macro in "ex_manga_downloadr.ex" module:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">mangareader</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">IndexPage</span><tt>
</tt>      <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">ChapterPage</span><tt>
</tt>      <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#036;font-weight:bold">Page</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">mangafox</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    ...<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defmacro __using__(which) <span style="color:#080;font-weight:bold">when</span> is_atom(which) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    apply(__MODULE__, which, [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now I can use it like this in the test file:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReaderTest</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExUnit</span>.<span style="color:#036;font-weight:bold">Case</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>, <span style="color:#A60">:mangareader</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The special "<strong>using</strong>" macro is called when I "use" a module, and I can even pass arguments to it. The implementation then uses "apply/3" to dynamically call the correct macro. This exactly how Phoenix imports the proper behaviors for Models, Views, Controllers, Router, for example:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">PageController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The macros are open in a Phoenix file and available in the "web/web.ex" module, so I just copied the same behavior. And now I have 2 less files to worry about.</p>
<h3>Tiny refactorings</h3>
<p>In the previous code I used the "<tt>String.to_atom/1</tt>" to convert the string of the module name to an atom, to be later used in "apply/3" calls:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp manga_source(source, <span style="color:#080;font-weight:bold">module</span>) <span style="color:#080;font-weight:bold">do</span><tt>
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
<p>I changed it to this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">mangareader</span><span style="color:#710">"</span></span> -&gt; <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">Elixir.ExMangaDownloadr.MangaReader.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#080;font-weight:bold">module</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#630">"</span></span><tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">mangafox</span><span style="color:#710">"</span></span>    -&gt; <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">Elixir.ExMangaDownloadr.Mangafox.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#080;font-weight:bold">module</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#630">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's just a shortcut to do the same thing.</p>
<p>In the parser I was also not using <a href="https://github.com/philss/floki">Floki</a> correctly. So take a look at this piece of old code:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp fetch_manga_title(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#mangaproperties h1</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">h1</span><span style="color:#710">"</span></span>, [], [title]} -&gt; title <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.at(<span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>defp fetch_chapters(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#listing a</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">a</span><span style="color:#710">"</span></span>, [{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>, url}], _} -&gt; url <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now using the better helper functions that Floki provides:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp fetch_manga_title(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  html<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Floki</span>.find(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#mangaproperties h1</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Floki</span>.text<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>defp fetch_chapters(html) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  html<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Floki</span>.find(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#listing a</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Floki</span>.attribute(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This was a case of not reading the documentation as I should have. Much cleaner!</p>
<p>I did other bits of cleanup but I think this should cover the major changes. And finally, I bumped up the version to "1.0.0" as well!</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">project</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>     [<span style="color:#808">app</span>: <span style="color:#A60">:ex_manga_downloadr</span>,<tt>
</tt>-     <span style="color:#808">version</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">0.0.1</span><span style="color:#710">"</span></span>,<tt>
</tt>+     <span style="color:#808">version</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1.0.0</span><span style="color:#710">"</span></span>,<tt>
</tt>      <span style="color:#808">elixir</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.1</span><span style="color:#710">"</span></span>,<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And speaking of versions, I'm using Elixir 1.1 but pay attention as <a href="https://github.com/elixir-lang/elixir/blob/ef5ba3af059f76489631dc26b52ecaeff09af3fe/CHANGELOG.md">Elixir 1.2</a> is just around the corner and it brings some niceties. For example, that macro that aliased a few modules could be written this way now:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">mangareader</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExMangaDownloadr</span>.<span style="color:#036;font-weight:bold">MangaReader</span>.<span style="color:#F00;background-color:#FAA">{</span><span style="color:#036;font-weight:bold">IndexPage</span>, <span style="color:#036;font-weight:bold">ChapterPage</span>, <span style="color:#036;font-weight:bold">Page</span>}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is just 1 feature between many other syntax improvements and support for the newest <a href="https://www.erlang.org/news/88">Erlang R18</a>. Keep an eye on both!</p>
<p></p>
---
title: "[Manga-Downloadr] Improving the Crystal/Ruby from bursts to pool stream"
date: "2016-06-07T20:13:00.000Z"
tags: ["crystal", "jruby"]
years: "2016"
---

<p></p>
<p>Yesterday <a href="http://www.akitaonrails.com/2016/06/06/manga-downloadr-porting-from-crystal-to-ruby-and-a-bit-of-jruby">I posted</a> how I build a new implementation of the Manga Reader Downloader in Crystal, ported to Ruby, tested on JRuby and compared against Elixir. Just to recap, these were the results to fetch chapters, pages and image links of a sample manga:</p>
<ul>
  <li>MRI Ruby 2.3.1: 57 seconds</li>
  <li>JRuby 9.1.1.0: 45 seconds</li>
  <li>Crystal 0.17.0: 59 seconds</li>
  <li>Elixir: 14 seconds</li>
</ul>
<p>I also said how it was an unfair comparison as the Elixir version uses a different - and obviously more efficient - algorithm.</p>
<p></p>
<p></p>
<p>It was the "first-version-that-worked" so I decided to go ahead and improve the implementations. In the Ruby/JRuby version I added the <a href="https://github.com/meh/ruby-thread">thread</a> gem to have a good enough implementation of a Thread pool that works for Ruby and JRuby. I probably should have used Concurrent-Ruby but I was having some trouble to make FixedThreadPool to work.</p>
<p>Anyway, now all versions will have a constant pool of requests running and we can make a better comparison.</p>
<p>Another thing that may have skewed the results against Crystal is that it seems to have a <a href="https://github.com/crystal-lang/crystal/issues/2660">faulty DNS resolver</a> implementation, so for now I just added the Manga Reader IP address directly to my <code>/etc/hosts</code> file to avoid <code>getaddrinfo: Name or service not known</code> exceptions.</p>
<p>To begin, let's test the same Elixir implementation, and as expected the result is still the same:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">11,49s user 0,82s system 77% cpu 15,827 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, the MRI Ruby with the "batch burst" algorithm was taking 57 seconds and this new implementation using a ThreadPool runs much better:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">12,67s user 0,92s system 50% cpu 27,149 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In Crystal, it's a bit more complicated as there is no way to implement the equivalent of a "Fiber Pool". What we have to do is do an infinite loop until the last process signals a loop break. Within the loop we create a maximum number of fibers, wait for each one to signal that it finished through an individual channel and loop again to create a new fiber, and so on. Compared to yesterday's 59 seconds, this is much better:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">5,29s user 0,33s system 26% cpu 21,166 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The JRuby version is not so fast though. Still better than yesterday's 45 seconds but now it's losing even to MRI:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">49,24s user 1,41s system 146% cpu 34,602 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I tried to use the <code>--dev</code> flag for <a href="https://github.com/jruby/jruby/wiki/Improving-startup-time">faster start up time</a> and it does improve a bit, getting it closer to MRI:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">22,26s user 0,99s system 76% cpu 30,320 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Not sure if it can be improved more though, any tips are welcome - don't forget to comment below.</p>
<p>So, Elixir is still at least twice as fast than Crystal at this point. But this also demonstrates how a different algorithm does make a huge difference where it matters. I can probably tweak it a bit more but this should suffice for now.</p>
<h3>Changing the Ruby implementation to use ThreadPool</h3>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">thread/pool</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">MangaDownloadr</span><tt>
</tt>  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Concurrency</span><tt>
</tt>    ...<tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(collection, &amp;block)<tt>
</tt>      pool    = <span style="color:#036;font-weight:bold">Thread</span>.pool(<span style="color:#33B">@config</span>.download_batch_size)<tt>
</tt>      mutex   = <span style="color:#036;font-weight:bold">Mutex</span>.new<tt>
</tt>      results = []<tt>
</tt><tt>
</tt>      collection.each <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>        pool.process {<tt>
</tt>          engine  = <span style="color:#33B">@turn_on_engine</span> ? <span style="color:#33B">@engine_klass</span>.new(<span style="color:#33B">@config</span>.domain) : <span style="color:#038;font-weight:bold">nil</span><tt>
</tt>          reply = block.call(item, engine)&amp;.flatten<tt>
</tt>          mutex.synchronize <span style="color:#080;font-weight:bold">do</span><tt>
</tt>            results += ( reply || [] )<tt>
</tt>          <span style="color:#080;font-weight:bold">end</span><tt>
</tt>        }<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      pool.shutdown<tt>
</tt><tt>
</tt>      results<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The idea is that we will have a fixed number of spawn native threads (in this case, determined by <code>@config.download_batch_size</code>). As one thread finishes it will pop a new link from the <code>collection</code> Array, essentially working as a "queue" to be depleted.</p>
<p>The results are accumulated in the <code>results</code> Array. Because many threads may want to modify it at once we have to synchronize access through a Mutex.</p>
<p>This way we always have a fixed amount of workers performing requests constantly instead of slicing the <code>collection</code> Array and doing bursts as in the previous version.</p>
<h3>Changing the Crystal implementation to simulate a Fibers Pool</h3>
<p>The Crystal version became a bit more complicated as I didn't find a pool library to pull. I found a rough implementation of a pool in <a href="https://stackoverflow.com/a/30854065/1529907">this stackoverflow post</a> and I was able to implement an improved version into a new shard so you can take advantage of it in your projects. Check out the source code at <a href="https://github.com/akitaonrails/fiberpool">akitaonrails/fiberpool</a>. This is how I added it to my project:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">dependencies</span>:<tt>
</tt>  <span style="color:#F00;background-color:#FAA">...</span><tt>
</tt>  <span style="color:#808">fiberpool</span>:<tt>
</tt>    <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20">akitaonrails/fiberpool</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is how I used it. Notice that the logic itself is very close to the MRI Ruby version, but using a "Fiber Pool" instead of a Thread Pool.</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">fiberpool</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">CrMangaDownloadr</span><tt>
</tt>  struct <span style="color:#036;font-weight:bold">Concurrency</span><tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(<span style="color:#33B">@config</span> : <span style="color:#036;font-weight:bold">Config</span>, <span style="color:#33B">@turn_on_engine</span> = <span style="color:#038;font-weight:bold">true</span>); <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(collection : Array(<span style="color:#036;font-weight:bold">A</span>)?, engine_class : <span style="color:#036;font-weight:bold">E</span>.class, &amp;block : <span style="color:#036;font-weight:bold">A</span>, E? -&gt; Array(<span style="color:#036;font-weight:bold">B</span>)?) : Array(<span style="color:#036;font-weight:bold">B</span>)<tt>
</tt>      results = [] of <span style="color:#036;font-weight:bold">B</span><tt>
</tt>      <span style="color:#080;font-weight:bold">if</span> collection<tt>
</tt>        pool = <span style="color:#036;font-weight:bold">Fiberpool</span>.new(collection, <span style="color:#33B">@config</span>.download_batch_size)<tt>
</tt>        pool.run <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>          engine = <span style="color:#080;font-weight:bold">if</span> <span style="color:#33B">@turn_on_engine</span><tt>
</tt>                     engine_class.new(<span style="color:#33B">@config</span>.domain, <span style="color:#33B">@config</span>.cache_http)<tt>
</tt>                   <span style="color:#080;font-weight:bold">end</span><tt>
</tt>          <span style="color:#080;font-weight:bold">if</span> reply = block.call(item, engine)<tt>
</tt>            results.concat(reply)<tt>
</tt>          <span style="color:#080;font-weight:bold">end</span><tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      results<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But again, this is very I/O intensive and both the Ruby and Crystal versions take advantage of the fact that they can do more work while waiting for one HTTP request to finish.</p>
<p><a name="reproducing-tests"> </a></p>
<h3>Reproducing the Tests</h3>
<p>I implemented a "Test Mode" in all 3 implementations. You can clone from my repositories:</p>
<ul>
  <li><a href="https://github.com/akitaonrails/cr_manga_downloadr">Crystal version</a></li>
  <li><a href="https://github.com/akitaonrails/manga-downloadr">Ruby/JRuby version</a></li>
  <li><a href="https://github.com/akitaonrails/ex_manga_downloadr">Elixir version</a></li>
</ul>
<p>And you can run the test mode like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># crystal:<tt>
</tt>time ./cr_manga_downloadr --test<tt>
</tt><tt>
</tt># MRI:<tt>
</tt>time bin/manga-downloadr --test<tt>
</tt><tt>
</tt># JRuby (you have to edit Gemfile to uncomment the JRuby engine):<tt>
</tt>time jruby --dev -S bin/manga-downloadr --test<tt>
</tt><tt>
</tt># Elixir:<tt>
</tt>time ./ex_manga_downloadr --test<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This will run only the fetching of chapters, pages and image links, skipping the actual downloading of the images, optimization through mogrify and PDF compilation. Those skipped parts take too long and don't say anything about the tested languages.</p>
<p>And if you want to test just the CPU intensive parts and avoid all networking interference altogether, you can turn on HTTP Cache mode and run the tests twice so the first run will cache everything first, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># crystal:<tt>
</tt>time ./cr_manga_downloadr --test --cache<tt>
</tt><tt>
</tt># MRI:<tt>
</tt>time bin/manga-downloadr --test --cache<tt>
</tt><tt>
</tt># JRuby (you have to edit Gemfile to uncomment the JRuby engine):<tt>
</tt>time jruby --dev -S bin/manga-downloadr --test --cache<tt>
</tt><tt>
</tt># Elixir:<tt>
</tt>time CACHE_HTTP=true ./ex_manga_downloadr --test<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So, <strong>with all requests already cached</strong> these are the results:</p>
<p>Elixir:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">7,13s user 0,24s system 331% cpu 2,227 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>MRI Ruby:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">5.590000   0.180000   5.770000 (  5.678714)<tt>
</tt>5,87s user 0,21s system 101% cpu 5,996 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>JRuby:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">10.580000   0.180000  10.760000 (  3.184472)<tt>
</tt>14,54s user 0,44s system 262% cpu 5,716 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Crystal:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">1.610000   0.050000   1.660000 (  1.344123)<tt>
</tt>1,62s user 0,06s system 124% cpu 1,350 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The Ruby/JRuby/Crystal versions have internal benchmarks to take away startup time (this is why they have 2 lines of times).</p>
<p>So, Elixir is very fast. It takes roughly 2 seconds to parse all the 1,900 HTML files to find the links.</p>
<p>Ruby is the slowest, obviously. It takes almost 6 seconds.</p>
<p>The JRuby version also takes almost 6 seconds but internally it processes in 3 seconds, the rest is startup time and warming up of the JVM underneath.</p>
<p>And Crystal is the fastest, as you would expect because it's a super otimized binary doing CPU bound operations, clocking in at a bit more than 1 second.</p>
<h3>Conclusion</h3>
<p>Even though the algorithms are roughly similar, Elixir is still winning by a very large margin in the total process (with the external HTTP requests).</p>
<p>There is more than just interpreter/compiler speeds, there is more than single-thread, multi-thread, fibers infrastructure.</p>
<p>We also have the maturity of the respective standard libraries (including TCP stack, HTTP client libraries, String/Array/Regex operations, etc) and 3d party libraries (libXML, Nokogiri, etc). So there is a lot that can interfere to the tests. I'd guess that Crystal's standard library, specially the networking parts, are not battle tested enough at this point (pre 1.0!).</p>
<p>So, the summary with the new results is this:</p>
<ul>
  <li>MRI Ruby 2.3.1: 27 seconds</li>
  <li>JRuby 9.1.1.0: 30 seconds</li>
  <li>Crystal 0.17.0: 21 seconds</li>
  <li>Elixir: 15 seconds</li>
</ul>
<p>Let me know if you have ideas to make them even faster!</p>
<p></p>
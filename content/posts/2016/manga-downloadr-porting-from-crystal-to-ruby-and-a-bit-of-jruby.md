---
title: "[Manga-Downloadr] Porting from Crystal to Ruby (and a bit of JRuby)"
date: "2016-06-06T21:06:00.000Z"
tags: ["crystal", "jruby"]
years: "2016"
---

<p></p>
<p>I have this old pet project of mine called <a href="http://www.akitaonrails.com/2014/12/17/small-bites-downloader-para-mangareader-kindle-edition">Manga Downloadr</a> that I published in 2014. It was a very rough version. I was experimenting with Typhoeus asynchronous requests and in the end the code ended up becoming super messed up.</p>
<p>The nature of the original Manga Downloader is no different from a web crawler, it fetches HTML pages, parses them in order to find collections of links and keeps fetching until a set of images are downloaded. Then I organize them in volumes, optimize them to fit the Kindle screen resolution, and compile them down into PDF files. This makes this project an interesting exercise in trying to make concurrent HTTP requests and process the results.</p>
<p>A year later I was learning Elixir. The Manga Downloadr was a nice candidate for me to figure out how to implement the same thing in a different language. You can follow my learning process in <a href="http://www.akitaonrails.com/exmangadownloadr">this series of posts</a>.</p>
<p>Finally, I've been learning more about Crystal, a Ruby-inspired platform that can compile Ruby-like source code into LLVM-optimized native binaries. And as a bonus it features a Go-like CSP channels and fibers to allow for concurrent code.</p>
<p></p>
<p></p>
<p>So I adapted my Elixir version to Crystal and the result is this code you can find over Github as <a href="https://github.com/akitaonrails/cr_manga_downloadr">akitaonrails/cr_manga_downloadr</a>.</p>
<p>It works very well and performs really fast, limited mainly by how many requests MangaReader can respond concurently and the speed/reliability of the Internet connection. So, as my original Ruby version was terrible code, it was a good time to rewrite it. And as Crystal is surprisingly close to Ruby I decided to port it over.</p>
<blockquote>
  <p>The port was almost too trivial</p>
</blockquote>
<p>It was mostly copying and pasting the Crystal code without the Type annotations. And I had to replace the lightweight Fibers and Channel implementation for concurrency over to traditional Ruby Threads.</p>
<p>The new version 2.0 for the Ruby version of the tool can be found in this Github repository: <a href="https://github.com/akitaonrails/manga-downloadr">akitaonrails/manga-downloadr</a>.</p>
<h3>Ruby, Ruby everywhere!</h3>
<p>Moving between Ruby and Crystal is not so difficult. The Crystal team did a fantastic job implementing a very solid Standard Library (stdlib) that very closely resembles MRI Ruby's.</p>
<p>For example, let's compare a snippet from my Crystal version first:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(page_link : <span style="color:#036;font-weight:bold">String</span>)<tt>
</tt>  get page_link <span style="color:#080;font-weight:bold">do</span> |html|<tt>
</tt>    images = html.xpath(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">//img[contains(@id, 'img')]</span><span style="color:#710">"</span></span>).as(<span style="color:#036;font-weight:bold">XML</span>::<span style="color:#036;font-weight:bold">NodeSet</span>)<tt>
</tt>    image_alt = images[<span style="color:#00D;font-weight:bold">0</span>][<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">alt</span><span style="color:#710">"</span></span>]<tt>
</tt>    image_src = images[<span style="color:#00D;font-weight:bold">0</span>][<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">src</span><span style="color:#710">"</span></span>]<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> image_alt &amp;&amp; image_src<tt>
</tt>      extension      = image_src.split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.</span><span style="color:#710">"</span></span>).last<tt>
</tt>      list           = image_alt.split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""> </span><span style="color:#710">"</span></span>).reverse<tt>
</tt>      title_name     = list[<span style="color:#00D;font-weight:bold">4</span>..<span style="color:#00D;font-weight:bold">-1</span>].join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""> </span><span style="color:#710">"</span></span>)<tt>
</tt>      chapter_number = list[<span style="color:#00D;font-weight:bold">3</span>].rjust(<span style="color:#00D;font-weight:bold">5</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">0</span><span style="color:#710">'</span></span>)<tt>
</tt>      page_number    = list[<span style="color:#00D;font-weight:bold">0</span>].rjust(<span style="color:#00D;font-weight:bold">5</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">0</span><span style="color:#710">'</span></span>)<tt>
</tt>      uri = <span style="color:#036;font-weight:bold">URI</span>.parse(image_src)<tt>
</tt>      <span style="color:#036;font-weight:bold">CrMangaDownloadr</span>::<span style="color:#036;font-weight:bold">Image</span>.new(uri.host as <span style="color:#036;font-weight:bold">String</span>, uri.path as <span style="color:#036;font-weight:bold">String</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>title_name<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">-Chap-</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>chapter_number<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">-Pg-</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>page_number<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>extension<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      raise <span style="color:#036;font-weight:bold">Exception</span>.new(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Couldn't find proper metadata alt in the image tag</span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now let's check the ported Ruby version:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(page_link)<tt>
</tt>  get page_link <span style="color:#080;font-weight:bold">do</span> |html|<tt>
</tt>    images = html.css(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">#img</span><span style="color:#710">'</span></span>)<tt>
</tt><tt>
</tt>    image_alt = images[<span style="color:#00D;font-weight:bold">0</span>][<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">alt</span><span style="color:#710">"</span></span>]<tt>
</tt>    image_src = images[<span style="color:#00D;font-weight:bold">0</span>][<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">src</span><span style="color:#710">"</span></span>]<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> image_alt &amp;&amp; image_src<tt>
</tt>      extension      = image_src.split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.</span><span style="color:#710">"</span></span>).last<tt>
</tt>      list           = image_alt.split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""> </span><span style="color:#710">"</span></span>).reverse<tt>
</tt>      title_name     = list[<span style="color:#00D;font-weight:bold">4</span>..<span style="color:#00D;font-weight:bold">-1</span>].join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""> </span><span style="color:#710">"</span></span>)<tt>
</tt>      chapter_number = list[<span style="color:#00D;font-weight:bold">3</span>].rjust(<span style="color:#00D;font-weight:bold">5</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">0</span><span style="color:#710">'</span></span>)<tt>
</tt>      page_number    = list[<span style="color:#00D;font-weight:bold">0</span>].rjust(<span style="color:#00D;font-weight:bold">5</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">0</span><span style="color:#710">'</span></span>)<tt>
</tt><tt>
</tt>      uri = <span style="color:#036;font-weight:bold">URI</span>.parse(image_src)<tt>
</tt>      <span style="color:#036;font-weight:bold">Image</span>.new(uri.host, uri.path, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>title_name<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">-Chap-</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>chapter_number<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">-Pg-</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>page_number<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">.</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>extension<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      raise <span style="color:#036;font-weight:bold">Exception</span>.new(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Couldn't find proper metadata alt in the image tag</span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's uncanny how similar they are, down to stdlib calls such as <code>URI.parse</code> or Array methods such as <code>split</code>.</p>
<blockquote>
  <p>Once you remove the Type annotations from the Crystal version, it's 99% Ruby.</p>
</blockquote>
<p>Ruby doesn't care if you're trying to call a method in a Nil object - at source code compiling time. Crystal does compile-time checkings and if it feels like the method call will be over Nil, it won't even compile. So this is one big win to avoid subtle bugs.</p>
<p>In Rails we are used to the dared <code>#try</code> method. Ruby 2.3 introduced the <a href="https://mitrev.net/ruby/2015/11/13/the-operator-in-ruby/">safe navigation operator</a>.</p>
<p>So, in Ruby 2.3 with Rails, both of the following lines are valid:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">obj.try(<span style="color:#A60">:something</span>).try(<span style="color:#A60">:something2</span>)<tt>
</tt>obj&amp;.something&amp;.something2<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In Crystal we can do the following:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">obj.try(&amp;.something).try(&amp;.something2)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So, it's close. Use with care.</p>
<p>As I mentioned before, Crystal is close to Ruby but it's not meant to be compatible, so we can't just load Rubygems without porting. In this example I don't have Nokogiri to parse the HTML. But this is where the stdlib shines: Crystal comes with a good enough XML/HTML and JSON parsers. So we can parse HTML as XML and use plain XPath instead.</p>
<p>Instead of Ruby's <code>Net::HTTP</code> we have <code>HTTP::Client</code> (but their methods and semantics are surprisingly similar).</p>
<p>There are other differences, for example, this is the main file that requires all the others in Ruby:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt><span style="color:#d70;font-weight:bold">$LOAD_PATH</span>.unshift <span style="color:#036;font-weight:bold">File</span>.join(<span style="color:#036;font-weight:bold">File</span>.dirname(<span style="color:#038;font-weight:bold">__FILE__</span>), <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">lib</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/records.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/downloadr_client.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/concurrency.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/chapters.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/pages.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/page_image.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/image_downloader.rb</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">manga-downloadr/workflow.rb</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is the Crystal version of the same manifest:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">./cr_manga_downloadr/*</span><span style="color:#710">"</span></span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>On the other hand, we need to be a bit more explicit in each Crystal source code file, and declare the specific dependencies where needed. For example, in the <code>pages.cr</code> file it starts like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">./downloadr_client</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">xml</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">CrMangaDownloadr</span><tt>
</tt>  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pages</span> &lt; DownloadrClient(Array(<span style="color:#036;font-weight:bold">String</span>))<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Crystal has less room for "magic" but it's able to maintain a high level of abstraction anyway.</p>
<h3>A Word about Types</h3>
<blockquote>
  <p>We can spend the next decade masturbating over all there is about Types, and it will be extremelly boring.</p>
</blockquote>
<p>The only thing you must understand: the compiler must know the method signature of classes before you can use them. There is no Runtime component that can introspect objects on the fly, like in Ruby and other dynamic languages (even Objective-C/Swift can do more dynamic stuff than Crystal).</p>
<p>Most of the time the Crystal compiler will be smart enough to infer the types for you, so you don't need to be absolutely explicit. You should follow the compiler's lead to know when to use Type Annotations.</p>
<p>What may really scare you at first is the need for Type Annotations, to understand Generics and so forth. The compiler will print out every scary error dumps that you will need to get used to. Most scary errors will usually be a Type Annotation missing or you trying to call a method over a possible Nil object.</p>
<p>For example, if I change the following line in the <code>page_image_spec.cr</code> test file:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># line 8:</span><tt>
</tt>image = <span style="color:#036;font-weight:bold">CrMangaDownloadr</span>::<span style="color:#036;font-weight:bold">PageImage</span>.new(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">www.mangareader.net</span><span style="color:#710">"</span></span>).fetch(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/naruto/662/2</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt><span style="color:#888"># line 10:</span><tt>
</tt><span style="color:#888"># image.try(&amp;.host).should eq("i8.mangareader.net")</span><tt>
</tt>image.host.should eq(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">i8.mangareader.net</span><span style="color:#710">"</span></span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The commented out line recognizes that the <code>image</code> instance might come as Nil, so we add an explicit <code>#try</code> call in the spec.</p>
<p>If we try to compile without this recognition, this is the error the compiler will dump on you:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ crystal spec                                                        [<tt>
</tt>Error in ./spec/cr_manga_downloadr/page_image_spec.cr:10: undefined method 'host' for Nil (compile-time type is CrMangaDownloadr::Image?)<tt>
</tt><tt>
</tt>    image.host.should eq("i8.mangareader.net")<tt>
</tt>          ^~~~<tt>
</tt><tt>
</tt>=============================================================================<tt>
</tt><tt>
</tt>Nil trace:<tt>
</tt><tt>
</tt>  ./spec/cr_manga_downloadr/page_image_spec.cr:8<tt>
</tt><tt>
</tt>        image = CrMangaDownloadr::PageImage.new("www.mangareader.net").fetch("/naruto/662/2")<tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There is a large stacktrace dump after that snippet above, but you only need to pay attention to the first few lines that already says what's wrong: "undefined method 'host' for Nil (compile-time type is CrMangaDownloadr::Image?)". If you know how to read, you shouldn't have any problems most of the time.</p>
<p>Now, the <code>Chapters</code>, <code>Pages</code>, <code>PageImage</code> (all subclasses of <code>DownloadrClient</code>) are basically the same thing: they do <code>HTTP::Client</code> requests.</p>
<p>This is how the <code>Pages</code> class is implemented:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">CrMangaDownloadr</span><tt>
</tt>  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pages</span> &lt; DownloadrClient(Array(<span style="color:#036;font-weight:bold">String</span>))<tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(chapter_link : <span style="color:#036;font-weight:bold">String</span>)<tt>
</tt>      get chapter_link <span style="color:#080;font-weight:bold">do</span> |html|<tt>
</tt>        nodes = html.xpath_nodes(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">//div[@id='selectpage']//select[@id='pageMenu']//option</span><span style="color:#710">"</span></span>)<tt>
</tt>        nodes.map { |node| [chapter_link, node.text as <span style="color:#036;font-weight:bold">String</span>].join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>) }<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p><code>#get</code> is a method from the <code>DownloadrClient</code> superclass that receives a String <code>chapter_link</code> and a block. The block receives a parsed <code>html</code> collection of nodes and we can play with it, return an Array of Strings.</p>
<p>That's why we have the <code>(Array(String))</code> when inheriting from <code>DownloadrClient</code>. Let's see how the <code>DownloadrClient</code> superclass is implemented.</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">CrMangaDownloadr</span><tt>
</tt>  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">DownloadrClient</span>(<span style="color:#036;font-weight:bold">T</span>)<tt>
</tt>    ...<tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">get</span>(uri : <span style="color:#036;font-weight:bold">String</span>, &amp;block : <span style="color:#036;font-weight:bold">XML</span>::<span style="color:#036;font-weight:bold">Node</span> -&gt; <span style="color:#036;font-weight:bold">T</span>)<tt>
</tt>      response = <span style="color:#33B">@http_client</span>.get(uri)<tt>
</tt>      <span style="color:#080;font-weight:bold">case</span> response.status_code<tt>
</tt>      <span style="color:#080;font-weight:bold">when</span> <span style="color:#00D;font-weight:bold">301</span><tt>
</tt>        get response.headers[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Location</span><span style="color:#710">"</span></span>], &amp;block<tt>
</tt>      <span style="color:#080;font-weight:bold">when</span> <span style="color:#00D;font-weight:bold">200</span><tt>
</tt>        parsed = <span style="color:#036;font-weight:bold">XML</span>.parse_html(response.body)<tt>
</tt>        block.call(parsed)<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      ...<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can see that this class receives a Generic Type and it uses it as the return type for the yielded block in the <code>#get</code> method. The <code>XML::Node -&gt; T</code> is the declaration of the signature for the block, sending <code>XML::Node</code> and receiving whatever the type <code>T</code> is. At compile time, imagine this <code>T</code> being replaced by <code>Array(String)</code>. That's how you can create classes that can deal with any number of different Types without having to overloading for polymorphism.</p>
<p>If you come from Java, C#, Go or any other modern static typed language, you probably already know what a Generic is.</p>
<p>You can go very far with Generics, check out how our <code>Concurrency.cr</code> begins:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Concurrency</span>(<span style="color:#036;font-weight:bold">A</span>, <span style="color:#036;font-weight:bold">B</span>, <span style="color:#036;font-weight:bold">C</span>)<tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(collection : Array(<span style="color:#036;font-weight:bold">A</span>)?, &amp;block : <span style="color:#036;font-weight:bold">A</span>, C? -&gt; Array(<span style="color:#036;font-weight:bold">B</span>)?) : Array(<span style="color:#036;font-weight:bold">B</span>)?<tt>
</tt>    results = [] of <span style="color:#036;font-weight:bold">B</span><tt>
</tt>    collection.try &amp;.each_slice(<span style="color:#33B">@config</span>.download_batch_size) <span style="color:#080;font-weight:bold">do</span> |batch|<tt>
</tt>      engine  = <span style="color:#080;font-weight:bold">if</span> <span style="color:#33B">@turn_on_engine</span><tt>
</tt>                  <span style="color:#036;font-weight:bold">C</span>.new(<span style="color:#33B">@config</span>.domain)<tt>
</tt>                <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      channel = Channel(Array(<span style="color:#036;font-weight:bold">B</span>)?).new<tt>
</tt>      batch.each <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>      ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is how we use it in the <code>workflow.cr</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">private <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch_pages</span>(chapters : Array(<span style="color:#036;font-weight:bold">String</span>)?)<tt>
</tt>  puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Fetching pages from all chapters ...</span><span style="color:#710">"</span></span><tt>
</tt>  reactor = Concurrency(<span style="color:#036;font-weight:bold">String</span>, <span style="color:#036;font-weight:bold">String</span>, <span style="color:#036;font-weight:bold">Pages</span>).new(<span style="color:#33B">@config</span>)<tt>
</tt>  reactor.fetch(chapters) <span style="color:#080;font-weight:bold">do</span> |link, engine|<tt>
</tt>    engine.try( &amp;.fetch(link) )<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In this example, imagine <code>A</code> being replaced by <code>String</code>, <code>B</code> also being replaced by <code>String</code> and C being replaced by <code>Pages</code> in the <code>Concurrency</code> class.</p>
<p>This is the "first-version-that-worked" so it's probably not very idiomatic. Either this could be solved with less Generics exercizing or maybe I could simplify it with the use of Macros. But it's working quite ok as it is.</p>
<p>The pure Ruby version ends up just like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Concurrency</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(engine_klass = <span style="color:#038;font-weight:bold">nil</span>, config = <span style="color:#036;font-weight:bold">Config</span>.new, turn_on_engine = <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt>    ...<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(collection, &amp;block)<tt>
</tt>    results = []<tt>
</tt>    collection&amp;.each_slice(<span style="color:#33B">@config</span>.download_batch_size) <span style="color:#080;font-weight:bold">do</span> |batch|<tt>
</tt>      mutex   = <span style="color:#036;font-weight:bold">Mutex</span>.new<tt>
</tt>      threads = batch.map <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>      ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This version is much "simpler" in terms of source code density. But on the other hand we would have to test this Ruby version a lot more because it has many different permutations (we even inject classes through <code>engine_klass</code>) that we must make sure responds correctly. In practice we should add tests for all combinations of the initializer's arguments.</p>
<p>In the Crystal version, because all types have been checked at compile-time, it was more demanding in terms of annotations; but we can be pretty sure that if it compiles, it will run as expected.</p>
<blockquote>
  <p>I'm not saying that Crystal doesn't need any specs.</p>
</blockquote>
<p>Compilers can only go so far. But how much is "so far"? Whenever you're "forced" to add Type Annotations, I will state that those parts are either trying to be too smart or they are intrinsically complex. Those are parts that would require extra levels of tests in Ruby and, if we can add the annotations properly, we can have less tests (we don't need to cover most permutations) in the Crystal version (exponencial complexity of permutations could go down to a linear complexity, I think).</p>
<h3>A Word about Ruby Threads</h3>
<p>The main concepts you must understand about concurrency in Ruby is this:</p>
<ul>
  <li>MRI Ruby has a GIL, a Global Interpreter Lock, that forbids code to run concurrently.</li>
  <li>MRI Ruby does have access and exposes native Threads since version 1.9. But even if you fire up multiple Threads, they will run sequentially because only one thread han hold the Lock at a time.</li>
  <li>I/O operations are the exception: they do release the Lock for other threads to run while the operation is waiting to complete. The OS will signal the program through OS level poll.</li>
</ul>
<p>This means that if your app is <strong>I/O intensive</strong> (HTTP requests, File reads or writes, socket operations, etc), you will have <em>some</em> concurrency. A web server, such as Puma for example, can take some advantage of Threads because a a big part of the operations are involve receiving HTTP requests and sending HTTP responses over the wire, which would make the Ruby process idle while waiting.</p>
<p>If your app is CPU intensive (heavy algorithms, data crunching, stuff that really make the CPU hot) then you can't take advantage of native Threads, only one will run at a time. If you have multiple cores in your CPU, you can Fork your process to the number of cores available.</p>
<p>You should check out <a href="https://github.com/grosser/parallel">grosser/parallel</a> to make it easy.</p>
<p>This is why Puma also has a "worker" mode. "Worker" is the name we usually give to forked children of processes.</p>
<p>In the case of this downloader process, it will perform thousands of HTTP requests to scrap the needed metadata from the MangaReader pages. So it's definitely much more I/O intensive than CPU intensive (the CPU intensive parts are the HTML parsing and later the image resizing and PDF compiling).</p>
<p>A sequential version of what has to be done, in Ruby, looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch_sequential</span>(collection, &amp;block)<tt>
</tt>  results = []<tt>
</tt>  engine  = <span style="color:#33B">@turn_on_engine</span> ? <span style="color:#33B">@engine_klass</span>.new(<span style="color:#33B">@config</span>.domain) : <span style="color:#038;font-weight:bold">nil</span><tt>
</tt>  collection&amp;.each_slice(<span style="color:#33B">@config</span>.download_batch_size) <span style="color:#080;font-weight:bold">do</span> |batch|<tt>
</tt>    batch.each <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>      batch_results = block.call(item, engine)&amp;.flatten<tt>
</tt>      results += ( batch_results || [])<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  results<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If we have 10,000 links in the <code>collection</code>, we first slice it to what <code>@config.download_batch_size</code> and we iterate over those smaller slices, calling some block and accumulating the results. This is naive algorithm, as you will find out in the next section, but bear with me.</p>
<p>In Elixir you can fire up micro-processes to make the HTTP requests in parallel. In Crystal you can fire up Fibers and wait for the HTTP requests to complete and signal the results through Channels.</p>
<p>Both are lightweight ways and you can have hundreds or even thousands running in parallel. Manga Reader will probably complain if you try that many at once, so the limit is not in the code, but in the external service.</p>
<p>To transform the sequential version in a concurrent one, this is what we can do in Crystal:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(collection : Array(<span style="color:#036;font-weight:bold">A</span>)?, &amp;block : <span style="color:#036;font-weight:bold">A</span>, C? -&gt; Array(<span style="color:#036;font-weight:bold">B</span>)?) : Array(<span style="color:#036;font-weight:bold">B</span>)?<tt>
</tt>  results = [] of <span style="color:#036;font-weight:bold">B</span><tt>
</tt>  collection.try &amp;.each_slice(<span style="color:#33B">@config</span>.download_batch_size) <span style="color:#080;font-weight:bold">do</span> |batch|<tt>
</tt>    channel = Channel(Array(<span style="color:#036;font-weight:bold">B</span>)?).new<tt>
</tt>    batch.each <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>      spawn {<tt>
</tt>        engine  = <span style="color:#080;font-weight:bold">if</span> <span style="color:#33B">@turn_on_engine</span><tt>
</tt>                    <span style="color:#036;font-weight:bold">C</span>.new(<span style="color:#33B">@config</span>.domain)<tt>
</tt>                  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>        reply = block.call(item, engine)<tt>
</tt>        channel.send(reply)<tt>
</tt>        engine.try &amp;.close<tt>
</tt>      }<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    batch.size.times <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      reply = channel.receive<tt>
</tt>      <span style="color:#080;font-weight:bold">if</span> reply<tt>
</tt>        results.concat(reply.flatten)<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    channel.close<tt>
</tt>    puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Processed so far: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>results.try &amp;.size<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  results<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Fetching a huge collection and slicing it in smaller 'batches' is easy. Now we have a smaller <code>batch</code> collection. For each item (usually an URI) we <code>spawn</code> a Fiber and call a block that will request and process the results. Once it's finished processing it sends the results over a <code>channel</code>.</p>
<p>Once we finish iterating over the batch and spawning that many Fibers we can "wait" for them by doing <code>channel.receive</code>, which will start receiving results as soon as the Fibers finish requesting/processing each URI.</p>
<p>We accumulate the results and go over the next batch of the collection until finished. The amount of concurrency is determined by the size of the batch (it's like <a href="https://www.akitaonrails.com/2015/11/19/ex-manga-downloadr-part-2-poolboy-to-the-rescue">what I did with 'poolboy' over Elixir</a> where we start a fixed number of processes to run in parallel and avoid doing a Denial of Service to Manga Reader).</p>
<p>By the way, this Crystal implementation is similar to what you would do if you were in Go, using Channels.</p>
<p>In the Ruby version you can fire up native Threads - which has a lot of overhead to spawn! - and assume the HTTP requests will run almost all in parallel. Because it's I/O intensive, you can have them all in parallel. This is what it looks like:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fetch</span>(collection, &amp;block)<tt>
</tt>  results = []<tt>
</tt>  collection&amp;.each_slice(<span style="color:#33B">@config</span>.download_batch_size) <span style="color:#080;font-weight:bold">do</span> |batch|<tt>
</tt>    mutex   = <span style="color:#036;font-weight:bold">Mutex</span>.new<tt>
</tt>    threads = batch.map <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>      <span style="color:#036;font-weight:bold">Thread</span>.new {<tt>
</tt>        engine  = <span style="color:#33B">@turn_on_engine</span> ? <span style="color:#33B">@engine_klass</span>.new(<span style="color:#33B">@config</span>.domain) : <span style="color:#038;font-weight:bold">nil</span><tt>
</tt>        <span style="color:#036;font-weight:bold">Thread</span>.current[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">results</span><span style="color:#710">"</span></span>] = block.call(item, engine)&amp;.flatten<tt>
</tt>        mutex.synchronize <span style="color:#080;font-weight:bold">do</span><tt>
</tt>          results += ( <span style="color:#036;font-weight:bold">Thread</span>.current[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">results</span><span style="color:#710">"</span></span>] || [] )<tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      }<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    threads.each(&amp;<span style="color:#A60">:join</span>)<tt>
</tt>    puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Processed so far: </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>results&amp;.size<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  results<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Threads are all initialized in a "paused" state. Once we instantiate those many Threads, we can <code>#join</code> on each of them and await for them all to finish.</p>
<p>Once each Thread finishes the same URI request/process, the results must be accumulated in a global storage, in this case a simple array called <code>results</code>. But because we might have the chance of 2 or more threads trying to update the same array, we might as well synchronize the access (I'm not sure if Ruby's Array access is already synchronized, but I guess not). To synchronize access we use a Mutex, which is a fine-grained lock, to make sure only 1 thread can modify the global array at once.</p>
<p>To prove that Ruby can support concurrent I/O operations, I have added 2 methods to the <code>Concurrent</code> class, the first is just <code>#fetch</code> and it's the Thread implementation above. The second is called <code>#fetch_sequential</code> and it is the sequential version also shown at the beginning of this section. And I added the following spec:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">it <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">should check that the fetch implementation runs in less time than the sequential version</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  reactor = <span style="color:#036;font-weight:bold">MangaDownloadr</span>::<span style="color:#036;font-weight:bold">Concurrency</span>.new(<span style="color:#036;font-weight:bold">MangaDownloadr</span>::<span style="color:#036;font-weight:bold">Pages</span>, config, <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt>  collection = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/onepunch-man/96</span><span style="color:#710">"</span></span>] * <span style="color:#00D;font-weight:bold">10</span><tt>
</tt>  <span style="color:#036;font-weight:bold">WebMock</span>.allow_net_connect!<tt>
</tt>  <span style="color:#080;font-weight:bold">begin</span><tt>
</tt>    concurrent_measurement = <span style="color:#036;font-weight:bold">Benchmark</span>.measure {<tt>
</tt>      results = reactor.fetch(collection) { |link, engine| engine&amp;.fetch(link) }<tt>
</tt>    }<tt>
</tt>    sequential_measurement = <span style="color:#036;font-weight:bold">Benchmark</span>.measure {<tt>
</tt>      results = reactor.send(<span style="color:#A60">:fetch_sequential</span>, collection) { |link, engine| engine&amp;.fetch(link) }<tt>
</tt>    }<tt>
</tt>    <span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#04D">\(</span><span style="color:#808">(.*?)</span><span style="color:#04D">\)</span><span style="color:#808">$</span><span style="color:#404">/</span></span>.match(concurrent_measurement.to_s) <span style="color:#080;font-weight:bold">do</span> |cm|<tt>
</tt>      <span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#04D">\(</span><span style="color:#808">(.*?)</span><span style="color:#04D">\)</span><span style="color:#404">/</span></span>.match(sequential_measurement.to_s) <span style="color:#080;font-weight:bold">do</span> |sm|<tt>
</tt>        <span style="color:#888"># expected for the concurrent version to be close to 10 times faster than sequential</span><tt>
</tt>        expect(sm[<span style="color:#00D;font-weight:bold">1</span>].to_f).to be &gt; ( cm[<span style="color:#00D;font-weight:bold">1</span>].to_f * <span style="color:#00D;font-weight:bold">9</span> )<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">ensure</span><tt>
</tt>    <span style="color:#036;font-weight:bold">WebMock</span>.disable_net_connect!<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Because it uses WebMock, I first disable it during this spec. I create a fake collection of 10 real links to MangaReader. And then I benchmark the Thread-based concurrent version and the plain sequential version. Because we have 10 links and they are all the same you can assume that the sequential version will be almost <strong>10 times slower</strong> than the Thread-based version. And this is exactly what this spec compares and proves (the spec fails if the concurrent version is not at least 9x faster).</p>
<p>To compare all versions of the Manga Downloadrs I let download an compile an entire manga collection, in this case one "One-Man Punch", which has almost <strong>1,900 pages/images</strong>. I am just measuring the fetching and scrapping processes and skipping the actual image downloading, image resizing and PDF generation as they take the majority of the time and the resizing and PDF part are all done by ImageMagick's mogrify and convert tools.</p>
<p>This is how long this new Ruby version takes to fetch and scrap almost 1,900 pages (using MRI Ruby 2.3.1):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">12,42s user 1,33s system 23% cpu 57,675 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how long the Crystal version takes:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">4,03s user 0,40s system 7% cpu 59,207 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Just for fun I tried to run the Ruby version under JRuby 9.1.1.0. To run with JRuby just add the following line in the <code>Gemfile</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">ruby <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">2.3.0</span><span style="color:#710">"</span></span>, <span style="color:#A60">:engine</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">jruby</span><span style="color:#710">'</span></span>, <span style="color:#A60">:engine_version</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">9.1.1.0</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Bundle install, run normally, and this is the result:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">47,80s user 1,99s system 108% cpu 45,967 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is how long the Elixir version takes:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">11,38s user 1,04s system 85% cpu 14,590 total<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Reality Check!</h3>
<p>If you just look at the times above you might get to the wrong conclusions.</p>
<p>First of all, it's an <strong>unfair comparison</strong>. The Elixir version uses a very different algorithm than the Ruby and Crystal versions.</p>
<p>In Elixir I boot up a pool of processes, around 50 of them. Then I start 50 HTTP requests at once. Once each process finishes, it releases itself back to the pool and I can fire up another HTTP request from the queue of links. So it's a <strong>constant stream</strong> of at most 50 HTTP requests, constantly.</p>
<p>The Crystal and Ruby/JRuby versions slice the 1,900 links into batches of 40 links and then I fire up 40 requests at once. This implementation waits all 40 to finish and they fire up another 40. So it's never a constant stream, it's bursts of 40 requests. So each batch is slowed down by the slowest request in the batch, not giving a chance for other requests to go through.</p>
<p>It's a difference in architecture. Elixir makes it much easier to do streams and Crystal, with it's CSP style, makes it easier to do bursts. A better approach would be to queue up the 1,900 links and use something like Sidekiq.cr to go over one link at a time (spawning 40 fibers to serve as a "pool", for example).</p>
<p>The Elixir version has a better efficient architecture, which is why it takes no more than 15 seconds to fetch all the image links while the Crystal version takes almost a full minute to finish (the accumulation of the slowest requests in each batch).</p>
<p>Now, you will be surprised that the Crystal version is actually a bit slower than the Ruby version! And you won't be too surprised to see JRuby being faster at 45 seconds!</p>
<p>This is another evidence that you should not dismiss Ruby (and that you should try JRuby more often). As I explained before, it does support concurrency in I/O operations and the applications I tested are all I/O heavy.</p>
<p>The difference is probably in the maturity of Ruby's <code>Net::HTTP</code> library against Crystal's <code>HTTP::Client</code>. I tried many tweaks in the Crystal version but I couldn't get much faster. I tried to do larger batches, but for some reason the applications just hangs, pauses, and never releases. I have to Ctrl-C out of it and retry until it finally goes through. If someone knows what I am doing wrong, please don't forget to write in the comments section below.</p>
<p>Some of this is probably due to MangaReader's unreliable servers, they probably have some kind of DoS preventions, throttling connections or something like this.</p>
<p>Anyway, when they go through, because the Ruby and Crystal algorithm are essentially the same, they take roughtly the same time to complete. So what's missing is for me to evolve this algorith to either use something like Sidekiq or implement an internal queue/pool of workers scheme.</p>
<h3>Conclusion</h3>
<p>The goal of this experiment was to learn more of Crystal's ability and how easy would it be to go back and forth with Ruby.</p>
<p>As you can see, there are many differences, but it's not so difficult. I may be missing something, but I stumbled upon some difficulties when pushing <code>HTTP::Client</code> + Fibers too hard, as I explained above. If you know what I am doing wrong, please let me know.</p>
<p>The difference between the Elixir vs Ruby/Crystal algorithms shows not just language performance differences, but also the importance of architecture and algorithms in the overall performance. This test was not conclusive, just a hint that my naive Fibers implementation needs some more work, and that Elixir's natural handling of parallel processes make it easier to achieve higher levels of parallelism.</p>
<p>This serves as a taste of what Crystal can do, and also that Ruby is still in the game. But also that Elixir surely is something to look close.</p>
<p></p>
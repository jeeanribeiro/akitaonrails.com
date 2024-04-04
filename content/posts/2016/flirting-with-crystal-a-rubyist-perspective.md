---
title: "Flirting with Crystal, a Rubyist Perspective"
date: "2016-05-31T21:21:00.000Z"
tags: []
years: "2016"
---

<p></p>
<p>If you're following me you will see that I have been sidetracking to <a href="/elixir">Elixir</a> recently. I will write a big introduction before diving into Crystal, so bear with me.</p>
<p></p>
<p></p>
<p>I'll say that the Erlang OTP and it's internals do intrigue me more than just the novelty of the language syntax. I believe that if you want to build highly distributed and also highly reliable systems you will either use Erlang (through Elixir) or you will end up replicating most of what Erlang already has with OTP.</p>
<p>This is true if you see that there are many Java/Scala-based distributed systems such as Hadoop, Spark, Cassandra, and they all could have benefitted from Erlang's OTP architecture. On the other hand, if you follow Cassandra you will see that even Java still has a hard time competing with C++ if you compare the clone called <a href="https://www.scylladb.com/">ScyllaDB</a>.</p>
<p>I believe Elixir (perhaps with HiPE) can compete in the same league as Java for distributed systems avoiding people to leave the Erlang platform for C or Java as <a href="https://www.infoq.com/news/2012/01/Katz-CouchDB-Couchbase-Server">has happened with CouchDB</a> back in 2012 because of lack of interest and exotic syntax. And because Java already has a big ecosystem, Clojure is in the game primarily because it can interface directly with it.</p>
<p>I think Go is also a Java contender but for other use cases, particularly in the systems tools space where you have lots of C/C++ and also glue code in Perl and Python. An obvious example being Docker orchestration. Yes, you can do microservices, crawlers and other stuff but I am not so keen to build big "applications" in it, althought there is nothing preventing it. Again, it's just a personal opinion.</p>
<p>Rust is a big contender to low-level systems development. I think it can replace C in many use cases and be used to implement libraries and components to be used by other languages, with the added benefits of a modern language that tries to avoid security hazards such as the recent <a href="https://tonyarcieri.com/would-rust-have-prevented-heartbleed-another-look">Heartbleed debacle</a>. But because of it's "Borrow system" I find it extremely bureacratic, specially if you're coming from highly dynamic languages such as Ruby, Python or even Swift or Elixir. I'm not saying it's a bad thing, just something that take way more time to become comfortable with than I expected.</p>
<p>Crystal is something between Rust and Go. LLVM is something you must have in your radar, because of <a href="https://appleinsider.com/articles/08/06/20/apples_other_open_secret_the_llvm_complier">Apple's support</a> towards Swift it's better than ever. Crystal is <em>similar</em> to RubyMotion in terms of both being similar to Ruby but not fully compatible and both being front-end parsers to LLVM. RubyMotion, on the other hand, is closer to Ruby and can even use some Ruby libraries almost without changes.</p>
<p>You do have to take your hats off to Ary Borenszweig and his contributors. It's very impressive how far they got in such a short period of time and without having deep pockets from Mozilla, Apple or Google.</p>
<h3>Limitations</h3>
<p>Crystal borrows heavily from Ruby but it's not a goal to reach any level of compatibility. It's a strong and static type language with Type Inference. It does not have any runtime component such as RubyMotion or Swift, so it has no notion of introspection or reflection over objects.</p>
<p>Mainly, you have neither "#eval" nor "#send". The lack of runtime evaluation is not so bad as you do have compilation-time AST manipulation through a good enough system of Macros (more on that later).</p>
<p>But the lack of "#send" does hurt a bit. It's the one thing that makes Crystal farther away from Ruby dynamic object flexibility. But it's also understandable why it's not a priority to have it.</p>
<p>As of version 0.17.0, Crystal has one huge limitation: it's using a <a href="https://crystal-lang.org/2013/12/05/garbage-collector.html">Boehm-Demers-Weiser conservative garbage collector</a>.</p>
<blockquote class="twitter-tweet" data-lang="en">
  <p lang="en" dir="ltr"><a href="https://twitter.com/asterite">@asterite</a> <a href="https://twitter.com/headius">@headius</a> I assumed as much... the Boehm GC, although handy for starting a new language, will only get you so far</p>— Jason Frey (@Fryguy9) <a href="https://twitter.com/Fryguy9/status/736990644082757632">May 29, 2016</a>
</blockquote>
<p>The language is currently implemented as a single-threaded process. This means that you <em>probably</em> can't max out all CPUs of your machine with just a single process. Although I may be wrong here, it's just my first impressions.</p>
<p>Charles Nutter (from JRuby fame) gives a warn about this:</p>
<blockquote class="twitter-tweet" data-lang="en">
  <p lang="en" dir="ltr"><a href="https://twitter.com/Fryguy9">@fryguy9</a> From their site: <a href="https://t.co/uOjIT0c8ji">https://t.co/uOjIT0c8ji</a> It does say something about "when" parallelism happens. Risky to start single-threaded.</p>— Charles Nutter (@headius) <a href="https://twitter.com/headius/status/736982955239870464">May 29, 2016</a>
</blockquote>
<p>It's a double-edged sword. Using a "generic" plug-and-play GC such as Boehm - which is not a bad thing in itself, but it's possibly not nearly as powerful as the JVM's own set of high performance GC such as the brand new G1GC.</p>
<p>Making the language be single-threaded by default also means that the entire standard library and all the ecosystem is built assuming there is no parallelism. So there are no race-conditions and hence, no usage of proper synchronization anywhere. If one day they decide to add multi-threading, all existing code will not be thread-safe. This is probably the meaning of Charles' warning.</p>
<p>I don't think it's a pressing problem though. You probably won't have a highly parallel system built with Crystal but maybe it's not the use case. In that case you should be using Elixir + OTP, Scala + Akka, for example.</p>
<h3>Concurrency</h3>
<p>Not having access to native Threads doesn't mean that you can't have Concurrency. <a href="https://blog.golang.org/concurrency-is-not-parallelism">Concurrency is not Parallelism</a>. Since <a href="https://crystal-lang.org/2015/04/30/crystal-0.7.0-released.html">version 0.7.0</a> they have added support for non-blocking I/O and also Fibers and Channels.</p>
<p>In a nutshell, a Fiber is a special kind of coroutine. It's a "piece of execution" that can "pause" itself and yield control of the execution back to its caller. It can pause itself but it can't be paused from the outside like Erlang's Scheduler can pause its running processes, for example.</p>
<p>In this case we can have a "Fiber Scheduler" of sorts, that can "resume" other Fibers. It is currently single-threaded, of course. And it works as an Event Loop. Whenever you have a non-blocking I/O operation waiting for file reading, network packet sending and stuff like that, it can yield control back to other fibers to resume work.</p>
<p>This makes it work more or less like Node.js. Javascript is also a single-threaded language and Node.js is basically an implementation of an event loop. Functions declare other anonymous functions as callbacks and it works based on the I/O triggers to callback those functions on every tick of the reactor.</p>
<p>On top of that you can add <a href="https://github.com/crystal-lang/crystal/issues/1967">"Channels"</a> as popularized by Google's Go language. You can start as many channels as you like. Then you can spawn Fibers in the Scheduler. Fibers can execute and keep sending messages through the Channels. Execution control is yielded to whoever is expecting to receive from the same Channels. Once one of them receives and executes, control is sent back to the Scheduler to allow other spawned Fibers to execute, and they can keep "pinging" and "ponging" like this.</p>
<p>Speaking of ping-pong, you have <a href="https://gobyexample.com/channel-directions">this snippet in the "Go by Example"</a> site:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">package main<tt>
</tt>import "fmt"<tt>
</tt>func ping(pings chan&lt;- string, msg string) {<tt>
</tt>    pings &lt;- msg<tt>
</tt>}<tt>
</tt>func pong(pings &lt;-chan string, pongs chan&lt;- string) {<tt>
</tt>    msg := &lt;-pings<tt>
</tt>    pongs &lt;- msg<tt>
</tt>}<tt>
</tt>func main() {<tt>
</tt>    pings := make(chan string, 1)<tt>
</tt>    pongs := make(chan string, 1)<tt>
</tt>    ping(pings, "passed message")<tt>
</tt>    pong(pings, pongs)<tt>
</tt>    fmt.Println(&lt;-pongs)<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is mostly the same thing but implemented in Crystal:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">ping</span>(pings, message)<tt>
</tt>  pings.send message<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pong</span>(pings, pongs)<tt>
</tt>  message = pings.receive<tt>
</tt>  pongs.send message<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>pings = Channel(<span style="color:#036;font-weight:bold">String</span>).new<tt>
</tt>pongs = Channel(<span style="color:#036;font-weight:bold">String</span>).new<tt>
</tt>spawn ping pings, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">passed message</span><span style="color:#710">"</span></span><tt>
</tt>spawn pong pings, pongs<tt>
</tt>puts pongs.receive<tt>
</tt><span style="color:#888"># =&gt; "passed message"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Same thing, but more pleasant to my eyes, again a personal opinion - which is expected if you're also a Rubyist.</p>
<p>So Crystal has Node.js/Javascript-like Event Loop in the form of a Fiber Scheduler and a Go-like Channel/CSP mechanism to coordinate concurrent processing. It's a "cooperative multitasking" mechanism. It's not good if you have CPU intensive processing, such as heavy number crunching, data processing. It works best for I/O intensive processing.</p>
<p>If you have a Fiber doing super heavy processing, it will block the Scheduler, as is also true for Node.js. The current implementation of the Scheduler is bound to a single native thread so it can't use other available native threads of the system for now.</p>
<p>Because the Channel implementation is quite new, it's not used throughout the standard library. But the standard implementation for <code>HTTP::Server</code> uses Fibers. And because it is compiled down to a native binary it's <strong>way faster</strong> than Javascript, as this <a href="https://github.com/sdogruyol/fast-http-server">"fast-http-server"</a> shows:</p>
<ul>
  <li>fast-http-server (Crystal) 18348.47rpm at 8.67ms avg. response time</li>
  <li>http-server (Node.js) 2105.55rpm at 47.92ms avg. response time</li>
  <li>SimpleHTTPServer (Python) 785.14rpm at 1.91ms avg. response time</li>
</ul>
<p>We're talking about an order of magnitude of 8 times faster than Node.js and more than 20 times faster than Python.</p>
<p>As usual, you shouldn't blindly trust <a href="https://github.com/kostya/benchmarks">synthetic benchmarks</a> but depending on which kind of processing you decide to compare against, you will see Crystal being pretty on par with Rust, Go, Swift, D.</p>
<h3>Type Inference</h3>
<p>Crystal is a statically typed language. But it won't require you to declare every single type beforehand. It's quite smart in its Type Inference so if you just type:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">a = <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>b = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">HELO</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It will know that "a" is an "Int32" and that "b" is a "String". By the way, contrary to Ruby, all Strings must be double-quoted. But it becomes particularly more complicated when you're dealing with complicated data structures such as JSON.</p>
<p>In Ruby I can just parse a JSON String and immediatelly explore its structure like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">parsed_json = <span style="color:#036;font-weight:bold">JSON</span>.parse(response.body)[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">files</span><span style="color:#710">"</span></span>].first[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">id</span><span style="color:#710">"</span></span>]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I can't do this in Crystal, instead the <a href="https://crystal-lang.org/api/JSON.html#mapping%28properties%2Cstrict%3Dfalse%29-macro">recommended approach</a> is to declare a schema-like structure like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">FilesResponse</span><tt>
</tt>  <span style="color:#036;font-weight:bold">JSON</span>.mapping({<tt>
</tt>    <span style="color:#808">ok</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">Bool</span>},<tt>
</tt>    <span style="color:#808">files</span>: {<span style="color:#808">type</span>: Array(<span style="color:#036;font-weight:bold">FilesItemResponse</span>)}<tt>
</tt>  })<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">FilesItemResponse</span><tt>
</tt>  <span style="color:#036;font-weight:bold">JSON</span>.mapping({<tt>
</tt>    <span style="color:#808">id</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">String</span>},<tt>
</tt>    <span style="color:#808">name</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">String</span>},<tt>
</tt>    <span style="color:#808">filetype</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">String</span>},<tt>
</tt>    <span style="color:#808">created</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">Time</span>, <span style="color:#808">converter</span>: <span style="color:#036;font-weight:bold">Time</span>::<span style="color:#036;font-weight:bold">EpochConverter</span>}<tt>
</tt>    <span style="color:#808">timestamp</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">Time</span>, <span style="color:#808">converter</span>: <span style="color:#036;font-weight:bold">Time</span>::<span style="color:#036;font-weight:bold">EpochConverter</span>}<tt>
</tt>    <span style="color:#808">permalink</span>: {<span style="color:#808">type</span>: <span style="color:#036;font-weight:bold">String</span>}<tt>
</tt>  })<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt><span style="color:#888"># parsed_json = JSON.parse(response.body)["files"].first["id"]</span><tt>
</tt>parsed_json = <span style="color:#036;font-weight:bold">FilesResponse</span>.from_json(<span style="color:#33B">@body</span>).files.first.id<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am very used to Ruby's duck typing and the ability to query objects in runtime. It's just not the same in Crystal and it can become quite tedious to change your mindset to think about types beforehand. The compiler will scream a hell of a lot during your development cycle until you become acquainted with this concept.</p>
<p>I did an experiment with JSON parsing and the result is a project I called <a href="https://github.com/akitaonrails/cr_slack_cleanup">"cr_slack_cleanup"</a> which showcases both this idea of JSON Schemas as well as Fibers and Channels as I explained in the previous section.</p>
<p>Update: after I posted this article @LuisLavena stepped in to correct me: you can do it like Ruby, without schemas:</p>
<blockquote class="twitter-tweet" data-partner="tweetdeck">
  <p lang="en" dir="ltr"><a href="https://twitter.com/AkitaOnRails">@AkitaOnRails</a> <a href="https://twitter.com/CrystalLanguage">@CrystalLanguage</a> re: JSON, you can parse it kinda-like Ruby, see JSON::Any: <a href="https://t.co/MD7PYy5AVH">https://t.co/MD7PYy5AVH</a></p>— Luis Lavena (@luislavena) <a href="https://twitter.com/luislavena/status/738005493189316608">June 1, 2016</a>
</blockquote>
<p>And it will be like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">json</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt>data = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">&lt;&lt;-JSON</span></span><span style="background-color:#fff0f0;color:#D20"><span style=""><tt>
</tt>  {<tt>
</tt>    "files": [<tt>
</tt>        {<tt>
</tt>          "id": 1,<tt>
</tt>          "name": "photo.jpg"<tt>
</tt>        },<tt>
</tt>        {<tt>
</tt>          "id": 99,<tt>
</tt>          "name": "another.jpg"<tt>
</tt>        }<tt>
</tt>    ]<tt>
</tt>  }</span><span style="color:#710"><tt>
</tt>  JSON</span></span><tt>
</tt><tt>
</tt>obj = <span style="color:#036;font-weight:bold">JSON</span>.parse(data)<tt>
</tt><tt>
</tt>obj[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">files</span><span style="color:#710">"</span></span>].each <span style="color:#080;font-weight:bold">do</span> |item|<tt>
</tt>  puts item[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">id</span><span style="color:#710">"</span></span>].as_i<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So yeah, JSON parsing can be almost identical to what you would do with Ruby, although he also recommends Schemas as it's a bit faster anyway.</p>
<h3>Macros</h3>
<p>The last important feature worth mentioning is the presence of Macros. As you don't have control over your code in runtime, you don't have "eval", you don't have "send", then you would not have any way to do proper metaprogramming.</p>
<p>Macros bring back some of Ruby's metaprogramming. For example, in Ruby, when you include a Module to a Class, there is the "included?" hook in the Module where you can add some metaprogramming such as "class_eval" stuff.</p>
<p>In Crystal, a Module does have an "included" hook but now it's a Macro. You can do something like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Foo</span><tt>
</tt>  macro included<tt>
</tt>    {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">% </span><span style="">if</span><span style="color:#710"> </span></span><span style="color:#33B">@type</span>.name == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Bar</span><span style="color:#710">"</span></span> %}<tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">hello</span><tt>
</tt>      puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Bar</span><span style="color:#710">"</span></span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">% </span><span style="">else</span><span style="color:#710"> </span></span>%}<tt>
</tt>    <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">hello</span><tt>
</tt>      puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">HELLO</span><span style="color:#710">"</span></span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">% </span><span style="">end</span><span style="color:#710"> </span></span>%}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Bar</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Foo</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Something</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Foo</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Bar</span>.hello <span style="color:#888"># =&gt; "Bar"</span><tt>
</tt><span style="color:#036;font-weight:bold">Something</span>.hello <span style="color:#888"># =&gt; "HELLO"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It feels like having "ERB" templates but for code. A macro is code building code in compile time. In the resulting AST it's as if you wrote the boring repetitive code yourself. The compiled native binary doesn't care. If you're from C it's like pre-processing but having control of an AST tree of Nodes instead of just manipulating the source code. You can even have something akin to the venerable "#method_missing".</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Foo</span><tt>
</tt>  macro method_missing(name, args, block)<tt>
</tt>    {{pp name}}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.new.hello_world<tt>
</tt><span style="color:#888"># =&gt; name = "hello_world"</span><tt>
</tt><span style="color:#036;font-weight:bold">Foo</span>.new.bla_bla(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">bla</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#888"># =&gt; name = "bla_bla"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Any macro function can receive an AST as the argument and you can manipulate this AST in any way as you see fit. For example:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">module Foo<tt>
</tt>  macro teste(ast)<tt>
</tt>    puts {{ast.stringify}}<tt>
</tt>  end<tt>
</tt>end<tt>
</tt><tt>
</tt>Foo.teste "Hello World".split(" ").join(" - ")<tt>
</tt># =&gt; ("Hello World".split(" ")).join(" - ")<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In this example you just get a normalized version of the code you passed as argument. And the code won't be "executed" at that location.</p>
<p>So, you can define new methods and call different versions of methods depending on the combination of elements that you get from the AST. One example of what is possible is this experiment from developer Oleksii that I bundles in this small project I called <a href="https://github.com/akitaonrails/cr_chainable_methods">"cr_chainable_methods"</a> and we can build code that is very different from either Crystal or Ruby:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">result = pipe <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Hello World</span><span style="color:#710">"</span></span><tt>
</tt>  .&gt;&gt; <span style="color:#036;font-weight:bold">Foo</span>.split_words<tt>
</tt>  .&gt;&gt; <span style="color:#036;font-weight:bold">Foo</span>.append_message(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Bar</span><span style="color:#710">"</span></span>)<tt>
</tt>  .&gt;&gt; <span style="color:#036;font-weight:bold">Bar</span>.add_something<tt>
</tt>  .&gt;&gt; <span style="color:#036;font-weight:bold">Foo</span>.join<tt>
</tt>  .&gt;&gt; unwrap<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(Yes, a subset of what a real Elixir Pipe can do.)</p>
<h3>Crystal Shards</h3>
<p>Finally, one aspect I like about Crystal is that it has task management and dependency management already figured out. No pointless discussions on which implementation of packages and dependencies we "should" be using.</p>
<p>You can just write a simple script into a file such as "test.cr" and run this file like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">crystal test.cr<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or, you can build and compile to a native binary before executing like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">crystal build test.cr --release<tt>
</tt>./test<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you can also start in a proper project structure and development lifecycle like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">crystal init app test<tt>
</tt>cd test<tt>
</tt>crystal build src/test.cr --release<tt>
</tt>./test<tt>
</tt>git add .<tt>
</tt>git commit -m "initial commit"<tt>
</tt>git push -u origin master<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It sets up a proper project directory structure, a Git repository is pre-initialized for you (why would you be programming without Git!?) with proper ".gitignore" file.</p>
<p>You will also find a "shard.yml" file where you can declare your application or library name, version, author, and also its dependencies like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20">kemal</span><tt>
</tt><span style="color:#808">version</span>: <span style="background-color:#fff0f0;color:#D20">0.12.0</span><tt>
</tt><tt>
</tt><span style="color:#808">dependencies</span>:<tt>
</tt>  <span style="color:#808">radix</span>:<tt>
</tt>    <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20">luislavena/radix</span><tt>
</tt>    <span style="color:#808">version</span>: <span style="background-color:#fff0f0;color:#D20">0.3.0</span><tt>
</tt>  <span style="color:#808">kilt</span>:<tt>
</tt>    <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20">jeromegn/kilt</span><tt>
</tt>    <span style="color:#808">version</span>: <span style="background-color:#fff0f0;color:#D20">0.3.3</span><tt>
</tt><span style="color:#808">author</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">Serdar Dogruyol &lt;dogruyolserdar@gmail.com&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This example is from the <a href="https://github.com/sdogruyol/kemal">Kemal web framework</a> by Serdar. It depends on the Radix and Kilt libraries. You must run <code>crystal deps</code> and it will fetch from Github before you can compile.</p>
<p>More than that: every project receives a proper "spec" directory where you can write Rspec-like tests and you can run them using <code>crystal spec</code>. And the spec runner results will look like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ crystal spec<tt>
</tt>........................................................<tt>
</tt><tt>
</tt>Finished in 8.28 milliseconds<tt>
</tt>56 examples, 0 failures, 0 errors, 0 pending<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>All built-in, no external libraries needed.</p>
<p>And 8 milliseconds to run the entire test suite of a micro web framework? Not too shabby. If you add up start up time for the executable, it still is around 1 second of total running time. Pretty impressive.</p>
<h3>Conclusion</h3>
<p>Crystal is not meant to be a Ruby replacement like JRuby. So it will never run existing and complicated Ruby projects such as Ruby on Rails or even Sinatra for that matter.</p>
<p>To me Crystal fills a gap in some use cases where I would use Rust or Go. It has the raw performance of an LLVM-optimized native binary, a reasonably fast Go-like concurrency system (and much faster and less resource intensive than Node.js), and the added benefit of a much more enjoyable Ruby-like syntax set.</p>
<p>You can even start experimenting with Crystal to build Ruby native extensions without the need of FFI and without having to write C. There is an attempt <a href="https://github.com/startram/activesupport.cr">port of ActiveSupport</a> as a native extension to MRI Ruby, written as a proof of concept in Crystal.</p>
<p>If you're a Rubyist you will find yourself pretty much at home with most of the standard library. You will miss a thing or two but most of the time it will feel like Ruby. The <a href="https://crystal-lang.org/docs">official Guide</a> is good enough to get started and there is a comprehensive <a href="https://crystal-lang.org/api">API documentation</a> just to check if that favorite Ruby API is there or not, and if not what the replacements are. Most of the time you will think <em>"hmm, in Ruby I would use Enumerator#each ... and yes, sure enough, there is Enumerator#each as expected."</em> The API documentation could use some more love, so if you want to contribute this is a good place to start.</p>
<p>If you want to check out a curated list of Crystal libraries and application, go straight to <a href="https://awesome-crystal.com/">"Awesome Crystal"</a>. You can also see the more dynamic <a href="https://github.com/trending/crystal">"Trending Projects in Github"</a>.</p>
<p>For the most part, your proficiency in Ruby will payoff to build small systems where raw performance and concurrency are really necessary. This is exactly the use case for Mike Perham's port of <a href="https://github.com/mperham/sidekiq.cr">Sidekick.cr</a>. Say you have gigabytes of files to crunch. Or you have thousands of external websites to crawl, parse and organize. Or you have petabytes of data in your database waiting to be number crunched. Those are tasks that MRI Ruby won't help but Crystal may well be the quick answer.</p>
<p>You can even get one of the many micro web frameworks such as Kemal and deploy your HTTP API providers <a href="https://crystal-lang.org/2016/05/26/heroku-buildpack.html">directly to Heroku</a> now. This will give you Go-levels of performance, and this is <strong>very</strong> compelling for me as I really also dislike Go's archaic smelling syntax.</p>
<p>So, Rust, Go, Javascript, all very fast, but with very questionable syntaxes and not so enjoyable. They are way more mature, and their ecosystems are much larger. But unless I really need to, I'd rather choose Crystal for the use cases I described above, and I think you will find some good use for it too.</p>
<p>Update: after I posted, the creator of Crystal, @Asterite had a few things to add as well:</p>
<blockquote class="twitter-tweet" data-partner="tweetdeck">
  <p lang="en" dir="ltr"><a href="https://twitter.com/AkitaOnRails">@AkitaOnRails</a> <a href="https://twitter.com/waj">@waj</a> so it's likely that we'll have something similar. We aren't there yet because we are not Google, Mozilla nor Apple</p>— Ary Borenszweig (@asterite) <a href="https://twitter.com/asterite/status/737778080085868545">May 31, 2016</a>
</blockquote>
<script async="" src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
<p></p>
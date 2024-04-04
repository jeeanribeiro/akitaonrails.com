---
title: "The Obligatory \"Flame War\" Phoenix vs Node.js"
date: "2015-12-03T14:01:00.000Z"
tags: ["beginner", "elixir", "phoenix", "node", "english"]
years: "2015"
---

<p></p>
<p>I’ll warn you upfront: this will be a very unfair post, not only I am biased for disliking Javascript and Node.js, at this moment I am very excited and fascinated by Elixir and Erlang.</p>
<p>Comparisons are always unfair. There is no such a thing as a “fair” synthetic benchmark comparison, the author is <strong>always</strong> biased towards some targetted result. It’s the old pseudo-science case of having a conclusion and picking and choosing data that backs those conclusions. There are just too many different variables. People think it’s fair when you run it in the same machine against 2 “similar” kinds of applications, but it is not. Don’t trust me on this as well, do your own tests.</p>
<p>All that having being said, let’s have some fun, shall we?</p>
<p></p>
<p></p>
<h3>The Obligatory “Hello World” warm up</h3>
<p>For this very short post, I just created a Node.js + Express “hello world” and I will point to it’s root endpoint, which is Express rendering a super simple <span class="caps">HTML</span> template with one title and one paragraph, and that’s it.</p>
<p>For Elixir, I just bootstrapped a bare bone Phoenix project and added one extra endpoint called “/teste” in the Router which will call the PageController, then the “teste” function and render a <span class="caps">EEX</span> template with the same title and paragraph as in the Express example.</p>
<p>Simple enough. Phoenix does more than Express, but this is not supposed to be a fair trial anyway. I chose <a href="https://www.joedog.org/siege-home/">Siege</a> as the testing tool for no particular reason, you can pick the testing tool you like the most. And I am running this over my 2013 Macbook Pro with 8 cores and 16GB of <span class="caps">RAM</span>, so this benchmark will never max out my machine.</p>
<p>The first test is a simple run of 200 concurrent connections (the number of CPUs I have) firing just 8 requests each, for a total of 1,600 requests. First, the Node.js + Express results:</p>
<div id="player1"></div>
<p><a href="https://s3.amazonaws.com/videos-akitaonrails/Elixir/Node+8+x+200.mp4">Video download link</a></p>
<p>The first run already broke a few connections, but the 2nd run picked up and finished all 1,600 requests. And this is the Phoenix results:</p>
<div id="player2"></div>
<p><a href="https://s3.amazonaws.com/videos-akitaonrails/Elixir/Phoenix+8+x+200.mp4">Video download link</a></p>
<p>As you can see, Node.js has the upper hand in terms of total time spent. One single Node.js process can only run one single real OS thread. Therefore it had to use just a single <span class="caps">CPU</span> core (although I had 7 other cores to spare). On the other hand, Elixir can reach all 8 cores of my machine, each running a Scheduler in a single real OS thread. So, if this test was <span class="caps">CPU</span> bound, it should have run 8 times faster than the Node.js version. As the test is largely a case of I/O bound operations, the clever async construction of Node.js does the job just fine.</p>
<p>This is not an impressive test by any stretch of the imagination. But we’re just warming up.</p>
<p>Oh, and by the way, notice how Phoenix logs show the request processing times in MICROseconds instead of Miliseconds!</p>
<h3>The Real Fun</h3>
<p>Now comes the real fun. In this second run, I added a blocking “sleep” call to both projects, so each request will sleep for 1 full second, and this is not absurd, many programmers will do poor code that blocks for that ammount of time, procesing too much data from the database, rendering templates that are too complex, and so on. Never trust a programmer to do the right best practices all the time.</p>
<p>And then I fire up Siege with 10 concurrent connections and just 1 request each, for starters.</p>
<div id="player3"></div>
<p><a href="https://s3.amazonaws.com/videos-akitaonrails/Elixir/Node+1+x+10+Sleep.mp4">Video download link</a></p>
<p>And this is why in my <a href="https://www.akitaonrails.com/2015/12/01/the-obligatory-why-elixir-personal-take">previous article of ‘Why Elixir?’</a> I repeated many times how <b>“rudimentary”</b> a Reactor pattern based solution is. It is super easy to block a single threaded event loop.</p>
<p>If you didn’t know that already, how does Node.js work? In summary it is a simple infinite loop. When a Javascript function runs it blocks that event loop. The function has to explicitly yield control back to the loop for another function to have a chance to run. I/O calls take time and just sits back idly waiting for a response, so it can yield control back and wait for a callback to continue running. Which is why you end up with the dreaded <em>“callback pyramid hell”</em>.</p>
<p>Now, with what I explained in all my previous articles, you may already know how Elixir + Phoenix will perform:</p>
<div id="player4"></div>
<p><a href="https://s3.amazonaws.com/videos-akitaonrails/Elixir/Phoenix+2+x+400+-+Sleep.mp4">Video download link</a></p>
<p>As expected, this is a walk in the park for Phoenix. It not only doesn’t have a rudimentary single thread loop waiting for the running functions to willingly yield control back. The Schedulers can forcefully suspend running coroutines/processes if it thinks they are taking too much time (the 2,000 reductions count, and priority configurations), so every running process has a fair share of resources to run.</p>
<p>Because of that I can keep increasing the number of requests and concurrent connections and it’s still <strong>fast</strong>.</p>
<p>In Node.js, if a function takes 1 second to run, it blocks the loop. When it finally returns, now the next 1 second function can run, and that’s why if I have 10 requests taking 1 second each to run, the entire process will linearly take 10 entire seconds!</p>
<p>Which obviously <strong>does not scale</strong>! If you “do it right” you do can scale. But why bother?</p>
<h3>“Node” done right</h3>
<p>As a side note, I find it very ironic that “Node” is called “Node”. I would assume that it should be easy to connect multiple Nodes that communicate between each other. And as a matter of fact, <a href="https://www.sitepoint.com/how-to-create-a-node-js-cluster-for-speeding-up-your-apps/">it is not</a>.</p>
<p>If I had spinned up 5 Node process, instead of 10 seconds, everything would take 2 seconds as 5 request would block the 5 Node processes for 1 second, and when returned, the next 5 requests would block again. This is similar to what we need to do with Ruby or Python, that have the dreaded big Global Interpreter Locks (<span class="caps">GIL</span>) and that in reality can only run one blocking computation at a time. (Ruby with Eventmachine and Python with Tornado or Twisted are similar to Node.js implementation of a reactor event loop).</p>
<p>Elixir can do much better in terms of actually coordinating different nodes, and it is the Erlang underpinnings that allow highly distributed systems such as <a href="https://www.ejabberd.im/">ejabberd</a> or <a href="https://www.rabbitmq.com/">RabbitMQ</a> to do their thing as efficiently as they can.</p>
<p>Check out how simple it is for one Elixir Node to notice the presence of other Elixir nodes and make them send and receive messages between each other:</p>
<div id="player5"></div>
<p><a href="https://s3.amazonaws.com/videos-akitaonrails/Elixir/7+-+Nodes.mp4">Video download link</a></p>
<p>Yep, it is this simple. We do Remote Procedure Calls (<span class="caps">RPC</span>) for decades, this is not something new. Erlang has this implemented for years and it is built-in and available for easy usage out-of-the-box.</p>
<p>In their websites, ejabbed calls itself “Robust, Scalable and Extensible <span class="caps">XMPP</span> Server”, and RabbitMQ calls itself “Robust messaging for applications”. Now we know they deserve the labels of “Robust” and “Scalable”.</p>
<p>So, we are struggling to do things that are already polished and ready for years. Elixir is the key to unlock all this Erlang goodness right now, let’s just use it and stop shrugging.</p>
<script type="text/javascript">
  jwplayer('player3').setup({
    file: 'https://s3.amazonaws.com/videos-akitaonrails/Elixir/Node+1+x+10+Sleep.mp4',
    title: 'Node.js (sleep) x Siege -r 1 -c 10',
    width: '100%',
    aspectratio: '4:3'
  });
  jwplayer('player1').setup({
    file: 'https://s3.amazonaws.com/videos-akitaonrails/Elixir/Node+8+x+200.mp4',
    title: 'Node.js x Siege -r 8 -c 200',
    width: '100%',
    aspectratio: '4:3'
  });
  jwplayer('player4').setup({
    file: 'https://s3.amazonaws.com/videos-akitaonrails/Elixir/Phoenix+2+x+400+-+Sleep.mp4',
    title: 'Phoenix (sleep) x Siege -r 2 -c 400',
    width: '100%',
    aspectratio: '4:3'
  });
  jwplayer('player2').setup({
    file: 'https://s3.amazonaws.com/videos-akitaonrails/Elixir/Phoenix+8+x+200.mp4',
    title: 'Phoenix x Siege -r 8 -c 200',
    width: '100%',
    aspectratio: '4:3'
  });
  jwplayer('player5').setup({
    file: 'https://s3.amazonaws.com/videos-akitaonrails/Elixir/7+-+Nodes.mp4',
    title: 'Node done right in Elixir',
    width: '100%',
    aspectratio: '4:3'
  });
</script>
<p></p>
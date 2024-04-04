---
title: "Phoenix Experiment: Holding 2 Million Websocket clients!"
date: "2015-10-29T13:28:00.000Z"
tags: ["elixir", "phoenix", "english"]
years: "2015"
---

<p></p>
<p><strong>Update: 11/04/15</strong> As I said in the article below, Gary Rennie, one of the people doing the experiment finally posted a very detailed account of how they were able to achieve this incredible milestone. Read all about it <a href="http://www.phoenixframework.org/v1.0.0/blog/the-road-to-2-million-websocket-connections">here</a></p>
<p>If you still don't follow the Phoenix Framework (Web framework written in Elixir) creator, <a href="http://twitter.com/chris_mccord">Chris McCord</a>, you should. In the last week he has been experimenting how far Phoenix can go. He was able to set up a commodity Rackspace server with 40 cores and 128GB of RAM (although it seems he only needed less than 90GB) and 45 other servers to create an astounding 2 million clients with long running Websocket connections and broadcasting messages to all of them at once!</p>
<p>The thread is very interesting so I decided to compile the most interesting bits directly from his Twitter feed. Take a close look!</p>
<p>Chris or someone from the team will probably <a href="http://www.phoenixframework.org/v1.0.0/blog/the-road-to-2-million-websocket-connections">report the details</a> about this experiment soon, but because of those testings and benchmarks Phoenix master already got some bottleneck fixes and it is pretty ready for prime time! If you were not aware he is writing a book about Phoenix for The Pragmatic Programmer and I recommend you <a href="https://pragprog.com/book/phoenix/programming-phoenix">buy the beta</a> as well.</p>
<p>To give some perspective, Websocket connections will probably sit idle and no real app will broadcast to all users at once all the time, this experiment is trying to exercise the most out of the metal. One comparison would be this <a href="http://www.jayway.com/2015/04/13/600k-concurrent-websocket-connections-on-aws-using-node-js/">Node.js experiment</a> holding 600k connections in a small machine but CPU load going up faster. Apples to Oranges comparison, but just to keep perspective.</p>
<p></p>
<p></p>
<h3>10/20/15</h3>
<p>josevalim: 128k users connected. @chris_mccord broadcasts a message to all in the channel, @TheGazler receives it immediately on the other side.</p>
<p>chris_mccord: @j2h @josevalim @TheGazler yep! 4 cores, 16 gb memory. Single machine</p>
<h3>10/21/15</h3>
<p>chris_mccord: Heres what a Phoenix app &amp; server look like with 128000 users in the same chatroom. Each msg goes out to 128k users!</p>
<iframe width="420" height="315" src="https://www.youtube.com/embed/vZYG79VqXlM" frameborder="0" allowfullscreen=""></iframe>
<h3>10/22/15</h3>
<p>chris_mccord: @andrewbrown @josevalim it’s basically this app with some optimizations on <a href="https://github.com/Gazler/phoenix_chat_example/tree/bench">phx master</a></p>
<h3>10/23/15</h3>
<p>chris_mccord: We just hit 300k channel clients on our commodity 4core 16gb @Rackspace instance. 10gb mem usage, cpu during active run &lt; 40% #elixirlang</p>
<p>chris_mccord: @chantastic @bcardarella +1 to prag book. My <a href="https://www.chrismccord.com/blog/2014/05/27/all-aboard-the-elixir-express/">RailsConf Elixir workshop</a> also might be a nice companion to the book</p>
<h3>10/24/15</h3>
<p>chris_mccord: @SkinnyGeek1010 these are 300k individual ws connections (joining a single channel)</p>
<p>chris_mccord: Calling it quits trying to max Channels– at 333k clients. It took maxed ports on 8 servers to push that, 40% mem left. We’re out of servers!</p>
<p>chris_mccord: @bratschecody 300k on a single server, with connections pushed from 8 servers</p>
<p>chris_mccord: To be clear, it was a single 4core server, 16gb. Traffic was pushed from 8 servers to open 333k conns. Out of ports, need more servers</p>
<p>chris_mccord: @perishabledave 30-40% under active load. Once 333k established, idle.</p>
<h3>10/25/15</h3>
<p>chris_mccord: @eqdw I’m sold on EEx. But Phoenix has template engines with 3rd party <a href="https://github.com/chrismccord/phoenix_haml">haml</a>/<a href="https://github.com/doomspork/phoenix_slim">slim</a> options</p>
<h3>10/26/15</h3>
<p>bratschecody: Whenever @chris_mccord speaks it's how they've increased clients a single Phoenix server is handling. 128k, 300k, 330k, 450k. DON'T STOP MAN</p>
<p>chris_mccord: @gabiz we also improved our arrival rate by 10x, now reliably establishing conns at 10k conn/s . Next up is reducing conn size</p>
<p>chris_mccord: Consider what this kind of performance in a framework enables. With Pusher you pay $399/mo for 10k conns. This box is $390/mo for 450k conns</p>
<p>chris_mccord: I’m sure comparable hardware on AWS is even cheaper</p>
<h3>10/27/15</h3>
<p>chris_mccord: On a bigger @Rackspace box we just 1 million phoenix channel clients on a single server! Quick screencast in action:</p>
<iframe width="420" height="315" src="https://www.youtube.com/embed/N4Duii6Yog0" frameborder="0" allowfullscreen=""></iframe>
<p>chris_mccord: @AstonJ accordingly to recent tests, ~ 2 million uses 58GB</p>
<p>chris_mccord: @perishabledave 40core / 128 gb. These runs consumed 38gb, cpu was very under-utilized. Ran out of ports, so spinning up more boxes</p>
<p>chris_mccord: Thanks to @mobileoverlord and @LiveHelpNow , they are spinning up 30 more servers to help us try for 2 million channel clients on one server</p>
<p>chris_mccord: @AstonJ just standard box with ulimit and file descriptors set higher</p>
<p>chris_mccord: @cbjones1 @Rackspace we are, but we using 45 separate servers to open the connections :)</p>
<p>chris_mccord: @cbjones1 @Rackspace 65k ports per remote ip right?</p>
<h3>10/28/15</h3>
<p>chris_mccord: Final results from Phoenix channel benchmarks on 40core/128gb box. 2 million clients, limited by ulimit</p>
<p><img src="https://pbs.twimg.com/media/CSbEsTiW0AARBzf.png" srcset="https://pbs.twimg.com/media/CSbEsTiW0AARBzf.png 2x" alt="2 Mi conn"></p>
<p>chris_mccord: The chat app had 2M clients joined to one topic. We sharded pubsub &amp; broadcasts go out in 1-3s. The app is totally snappy at these levels!</p>
<p>chris_mccord: @ashneyderman will publish writeup soon. Only knobs were about a dozen sysctrl/ulimit max files/ports. Stock ubuntu 15.10 otherwise</p>
<p>chris_mccord: One surprising thing with the benchmarks is how well stock ubuntu + dozen max limit options supports millions of conns. No kernel hack req’d</p>
<p>joeerl: @chris_mccord So now you understand why WhatsApp used Erlang :-) - obvious really.</p>
<p>chris_mccord: @lhoguin @felixgallo @joeerl @rvirding I accidentally forgot to set the ulimit higher than 2M, and we’re out of time on the servers now</p>
<p>chris_mccord: @lhoguin @felixgallo @joeerl @rvirding we had 45 tsung clients with capacity to send 2.5M. Every indication says it would’ve been just fine</p>
<p>chris_mccord: @felixgallo @lhoguin @joeerl @rvirding now that we know the gotchas, pretty quick turnaround (few hours with svr setup, coordinating nodes)?</p>
<p>chris_mccord: @felixgallo @lhoguin @joeerl @rvirding @ErlangSolutions devil is in the details tho. We find a bottleneck at 2.25M &amp; spend 48 hours+ fixing</p>
<p>chris_mccord: @mentisdominus it’s a different story when we broadcast to 2M subscribers</p>
<p><img src="https://pbs.twimg.com/media/CSdaaHtWcAAMhdJ.png:large" srcset="https://pbs.twimg.com/media/CSdaaHtWcAAMhdJ.png:large 2x" alt="2M"></p>
<p></p>
---
title: "My first week learning Elixir"
date: "2015-11-03T13:07:00.000Z"
tags: ["learning", "elixir", "english"]
years: "2015"
---

<p></p>
<p>I set myself to try to learn enough Elixir to be comfortable tackling some small projects. After 1 entire week studying close to 6 hours a day (around 42 hours) I'm still not entirely comfortable but I think the main concepts were able to sink in and I can fully appreciate what Elixir has to offer.</p>
<p>This is not my first time touching Erlang though. I was fortunate enough to be able to participate in a small workshop at QCon San Francisco 2009 with no other than <a href="http://www.oreilly.com/pub/au/3373">Francesco Cesarini</a>. Thanks to him I was able to understand some of Erlang's exquisite syntax, the correct concept of Erlang processes, how immutability and pattern matching governs their programming flow. It was very enlightening. Unfortunately I couldn't see myself doing Erlang full time. I just hoped those mechanisms were available in a language such as Ruby ...</p>
<p></p>
<p></p>
<p>Between 2007 and 2009 Erlang had a new renaissance between the languages aficionados because of the <a href="https://pragprog.com/book/jaerlang/programming-erlang">"Programming Erlang"</a> book released by The Pragmatic Programmers, written by no other than Joe Armstrong himself, the Erlang's creator. Dave Thomas <a href="https://pragdave.me/blog/2007/04/15/a-first-erlang-program/">tried to push Erlang</a> a lot in 2007, but even he wasn't able to sell Erlang's powerful engine because of the strange presentation of the syntax.</p>
<p>After 2009, José Valim had a long run to release the controversial Rails 3.0 big rewrite (which was fortunately a success) and he decided to step aside and try something else. His own research led him to Erlang for the reasons I mentioned above, but he decided that he could solve the "quirk syntax" problem. You can see some of this very first talks about Elixir in the Rubyconf Brasil <a href="https://www.eventials.com/locaweb/jose-valim-vamos-falar-sobre-concorrencia/">2012</a> and <a href="https://www.eventials.com/locaweb/elixir-uma-aproximacao-pragmatica-e-concorrente-a-programacao/">2013</a> recordings. The very early beta was released in 2012 and he finally released the stable 1.0 in 2015. Chris McCord was able to release Phoenix stable soon after.</p>
<p>When I first heard about this, Elixir found its place under my radar. I didn't jump right in though, between 2009 and 2015 we had a surge in "functional programming" interest because of the Javascript renaissance, the release of Scala, Go Lang, Clojure, the promise of Rust, and so on. So I waited, carefully following every one of them.</p>
<p>Then, 2014 came and suddenly everybody else found out about Erlang, with their spartan infrastructure that enabled Whatsapp to serve half a billion users with absurdly low costs and made Facebook buy them for a hefty USD 19 billion! We all knew about the Whatsapp case since at least 2011 but it was not until 2014 that everybody noticed. But not even this was able to steer Erlang to the fore front just yet.</p>
<p>When Elixir stable was released this year, followed by Phoenix stable, I knew it was time for me to start investing some quality time with it. Erlang's core sell itself: everybody else is doing concurrency by means of immutability and lightweight threads (or green threads, NxM strategy between green threads and real threads). It is actually quite trivial to max out the machine just shooting up millions of light processes nowadays. What makes it difficult is to create a system that has the potential to actually achieve <a href="https://stackoverflow.com/questions/8426897/erlangs-99-9999999-nine-nines-reliability">99.9999999% reliability</a>. Spawning processes is easy, how do you coordinate them in the same machine? How do do you coordinate them between different machines? How do you update a living system without bringing it down? How do you handle failures? How to you supervise everything?</p>
<p>These are the questions that Erlang solved decades ago (<a href="https://www.erlang.org/download/armstrong_thesis_2003.pdf">20 years ago</a>) with the now famous OTP, Ericsson's Open Telecom Platform. Something that was created to meet the performance and reliability needs of telecommunications in large scales. When we say it like this it feels that it will be a royal pain to learn, something akin to the JEE (Java Enterprise Edition), but worse.</p>
<p>And I can tell you that to learn enough OTP to be productive is actually <strong>very</strong> easy (you won't achieve the legendary 99.9999999% reliability out of the blue, but you'll be able to build something reliable enough). Think of it as a collection of half a dozen modules, with a couple of function interfaces to implement, a few words of configuration and you're basically done. It's so easy and lightweight that in fact many small libraries are written with OTP in mind and it's easy to just "plug and play". It's not a heavyweight server-side only thing.</p>
<p>To harness that power you will need to learn Elixir, unofficially, a language that has an uncanny resemblance to Ruby, built to spill out Erlang bytecode for its BEAM virtual machine. You can't find a better combination.</p>
<h3>One Week</h3>
<p>Having said all that, let's cut to the chase. You definitely want to get acquainted with the Functional Programming concepts such as immutability, higher order functions, pattern matching. I made a list of links for those concepts in <a href="https://www.akitaonrails.com/2015/10/28/personal-thoughts-on-the-current-functional-programming-bandwagon">my previous post</a>, I recommend you read it.</p>
<p>Assuming you're already a programmer in a dynamic language (Ruby, Python, Javascript, etc) and you want the fast crash course. Start buying <a href="https://pragprog.com/book/elixir/programming-elixir">"Programming Elixir"</a> by Dave Thomas and actually do each piece of code and the exercises in order. It's a book so easy to read that you will be able to finish it in less than a week. I did it in 3 days. The Elixir-Lang official website has a <a href="https://elixir-lang.org/getting-started/introduction.html">very good documentation</a> as well and they link many <a href="https://elixir-lang.org/learning.html">good books</a> you want to read later.</p>
<p>Then subscribe to Josh Adam's <a href="https://elixirsips.com">Elixir Sips</a>. If you're a Rubyist, it's like watching Ryan Bates Railscasts from the beginning all over again. Although it's more akin to Avdi Grimm's RubyTapas show, with very short episodes just for you to have your weekly fix on Elixir.</p>
<p>You can watch some of the episodes for free in low resolution, but I highly recommend you subscribe and watch the HD versions. It's well worth it. But about the episodes, there are more than 200 episodes. I've watched more than 130 in 12 hours :-) So I figure I would take another 2 days to watch everything.</p>
<p>You should definitely watch everything if you can, but if you can't, let me list the ones I think are the essentials. First of all, keep in mind that Josh has been doing this for quite a while, when he started Elixir was version 0.13 or below and Erlang was version 17 or below.</p>
<p>For example, episode <a href="https://elixirsips.dpdcart.com/subscriber/post?id=815">171 - Erlang 18 and time</a> highlights the new Time API. You must know about this. Episode <a href="https://elixirsips.dpdcart.com/subscriber/post?id=460">056 - Migrating Records to Maps</a> shows a new feature in Erlang 17 and Elixir where it makes Maps more preferable than the previous Records. Maps are explained in episodes <a href="https://elixirsips.dpdcart.com/subscriber/post?id=453">054</a> and <a href="https://elixirsips.dpdcart.com/subscriber/post?id=454">055</a>. If you learn the Phoenix web framework, it used the ORM Ecto underneath and Ecto models are Maps, so you must know this.</p>
<p>It means that the first 180 episodes, at least, are using previous versions of Erlang, Elixir, Phoenix, etc and you must keep in mind that new versions will have different APIs. This was one of the reasons I waited for the stable releases, because it was only natural that projects evolve and take time to have stable APIs and chasing several moving targets is really difficult for the uninitiated.</p>
<p>Having said that, watch this list first:</p>
<ul>
  <li>001 - Introduction and Installing Elixir.mp4</li>
  <li>002 - Basic Elixir.mp4</li>
  <li>003 - Pattern Matching.mp4</li>
  <li>004 - Functions.mp4</li>
  <li>005 - Mix and Modules.mp4</li>
  <li>006 - Unit Testing.mp4</li>
  <li>010 - List Comprehensions.mp4</li>
  <li>011 - Records.mp4</li>
  <li>012 - Processes.mp4</li>
  <li>013 - Processes, Part 2.mp4</li>
  <li>014 - OTP Part 1_ Servers.mp4</li>
  <li>015 - OTP Part 2_ Finite State Machines.mp4</li>
  <li>016 - Pipe Operator.mp4</li>
  <li>017 - Enum, Part 1.mp4</li>
  <li>018 - Enum, Part 2.mp4</li>
  <li>019 - Enum, Part 3.mp4</li>
  <li>020 - OTP, Part 3 - GenEvent.mp4</li>
  <li>022 - OTP, Part 4_ Supervisors.mp4</li>
  <li>023 - OTP, Part 5_ Supervisors and Persistent State.mp4</li>
  <li>024 - Ecto, Part 1.mp4</li>
  <li>025 - Ecto, Part 2_ Dwitter.mp4</li>
  <li>026 - Dict, Part 1.mp4</li>
  <li>027 - Dict, Part 2.mp4</li>
  <li>028 - Parsing XML.mp4</li>
  <li>031 - TCP Servers.mp4</li>
  <li>032 - Command Line Scripts.mp4</li>
  <li>033 - Pry.mp4</li>
  <li>041 - File, Part 1.mp4</li>
  <li>042 - File, Part 2.mp4</li>
  <li>044 - Distribution</li>
  <li>045 - Distribution, Part 2</li>
  <li>054 - Maps, Part 1.mp4</li>
  <li>055 - Maps, Part 2_ Structs.mp4</li>
  <li>056 - Migrating Records To Maps.mp4</li>
  <li>059 - Custom Mix Tasks.mp4</li>
  <li>060 - New Style Comprehensions.mp4</li>
  <li>061 - Plug.mp4</li>
  <li>063 - Tracing.mp4</li>
  <li>065 - SSH.mp4</li>
  <li>066 - Plug.Static.mp4</li>
  <li>067 - Deploying to Heroku.mp4</li>
  <li>068 - Port.mp4</li>
  <li>069 - Observer.mp4</li>
  <li>070 - Hex.mp4</li>
  <li>073 - Process Dictionaries.mp4</li>
  <li>074 - ETS.mp4</li>
  <li>075 - DETS.mp4</li>
  <li>076 - Streams.mp4</li>
  <li>077 - Exceptions and Errors.mp4</li>
  <li>078 - Agents.mp4</li>
  <li>079 - Tasks.mp4</li>
  <li>081 - EEx.mp4</li>
  <li>082 - Protocols.mp4</li>
  <li>083 - pg2.mp4</li>
  <li>086 - put_in and get_in.mp4</li>
  <li>090 - Websockets Terminal.mp4</li>
  <li>091 - Test Coverage.mp4</li>
  <li>106 - Text Parsing.mp4</li>
  <li>109 - Socket.mp4</li>
  <li>112 - Benchfella.mp4</li>
  <li>113 - Monitoring Network Traffic.mp4</li>
  <li>124 - Typespecs.mp4</li>
  <li>125 - Dialyzer.mp4</li>
  <li>126 - Piping Into Elixir.mp4</li>
  <li>127 - SSH Client Commands.mp4</li>
  <li>131 - ExProf.mp4</li>
  <li>132 - Randomness in the Erlang VM.mp4</li>
  <li>135 - Benchwarmer.mp4</li>
  <li>138 - Monitors and Links.mp4</li>
  <li>139 - hexdocs.mp4</li>
  <li>141 - Set.mp4</li>
  <li>142 - escript.mp4</li>
  <li>144 - Erlang's <code>calendar</code> module.mp4</li>
  <li>145 - good_times.mp4</li>
  <li>153 - Phoenix APIs and CORS.mp4</li>
  <li>155 - OAuth2_ Code Spelunking.mp4</li>
  <li>156 - Interacting with Amazon's APIs with erlcloud.mp4</li>
  <li>157 - Playing with the Code Module Part 1 - eval_string.mp4</li>
  <li>159 - Simple One for One Supervisors.mp4</li>
  <li>160 - MultiDef.mp4</li>
  <li>171 - Erlang 18 and Time.mp4</li>
  <li>172 - Arc File Uploads.mp4</li>
  <li>174 - ElixirFriends_ Saving Tweets with Streams and Filters.mp4</li>
  <li>175 - Pagination with Ecto and Phoenix using Scrivener.mp4</li>
  <li>176 - Prettying Up ElixirFriends.mp4</li>
  <li>178 - Memory Leaks.mp4</li>
  <li>179 - Rules Engine.mp4</li>
  <li>180 - Collectable.mp4</li>
  <li>182 - Phoenix API.mp4</li>
  <li>183 - React with Phoenix.mp4</li>
  <li>184 - React with Phoenix Channels.mp4</li>
  <li>185 - Mix Archives.mp4</li>
  <li>186 - Automatically Connecting Nodes.mp4</li>
  <li>187 - Compiling a Custom AST Into Elixir Functions.mp4</li>
  <li>190 - Testing Phoenix Channels.mp4</li>
  <li>193 - Linting with Dogma.mp4</li>
  <li>194 - Interoperability_ Ports.mp4</li>
  <li>196 - Crashing the BEAM.mp4</li>
  <li>200 - Custom Types in Ecto.mp4</li>
  <li>201 - Tracing and Debugging with erlyberly.mp4</li>
  <li>202 - Exception Monitoring with Honeybadger.io.mp4</li>
  <li>203 - plug_auth.mp4</li>
  <li>204 - Behaviours.mp4</li>
</ul>
<p>This is roughly half of what's available in Elixir Sips. All the other episodes are also interesting, but if you're just getting started, this list should be enough to wet your fingers in the language.</p>
<p>Railers will enjoy Phoenix and the ecosystem that is growing around it. You can already authenticate through <a href="https://github.com/scrogson/oauth2">OAuth2</a>, do pagination will_paginate style with <a href="https://github.com/drewolson/scrivener">Scrivener</a>, file uploads carrierwave style with <a href="https://github.com/stavro/arc">Arc</a>, deploy to <a href="https://wsmoak.net/2015/07/05/phoenix-on-heroku.html">Heroku</a>.</p>
<p>For more exercises, you can easily connect to HTTP endpoints using <a href="https://github.com/edgurgel/httpoison">HTTPoison</a>, parse HTML with <a href="https://github.com/philss/floki">Floki</a>, parse JSON with <a href="https://github.com/devinus/poison">Poison</a>. For more libraries, you can follow this Github page called <a href="https://github.com/h4cc/awesome-elixir">Awesome Elixir</a> which lists many new Elixir packages that you can use. But make sure you walk yourself through the basic concepts first. Elixir has a Rake-like task management system with built-in Mix, you can add dependencies in a Gemfile-like file called Mix.exs, which every projects has. You can add dependencies through Github urls or from <a href="https://hex.pm">Hex.pm</a> which is like Rubygems.org.</p>
<p>In this learning process, the concepts that I find more important to learn first are:</p>
<ul>
  <li>Elixir basic syntax and concepts (pattern matching, loops through recursion, immutable state, primitive types including Maps, the pipe operator)</li>
  <li>The concept of processes, nodes, and intercommunication between processes and nodes, including Monitors and Links.</li>
  <li>OTP Basics, learn what GenServer, GenEvent, GenFSM are.</li>
</ul>
<p>After you learn that you can figure out how to build OTP applications and do something practical for the Web using Phoenix, particularly you will want to learn everything about Phoenix's Channels, the infrastructure for robust, fast and <a href="https://www.akitaonrails.com/2015/10/29/phoenix-experiment-holding-2-million-websocket-clients">highly concurrent</a> WebSockets.</p>
<p>This is it. This is my first week learning Elixir, and my next step is to train myself by doing more exercises and also learning more about Phoenix. Even though Phoenix is inspired by Rails, it is not a clone, it has its own set of unique concepts to learn and this is definitely going to be a very interesting ride.</p>
<p>If you have more tips and tricks for beginners, feel free to comment below.</p>
<p></p>
---
title: "The Economics of Software Development"
date: "2017-06-22T13:56:00.000Z"
tags: ["agile", "lean", "methodologies", "startup"]
years: "2017"
---

<p></p>
<p>The software development community is boiling nowadays with so many options all at once. You have dozens of active and very good languages such as Go, <a href="/elixir">Elixir</a>, Clojure. Dozens of very good frameworks, both in the back-end and front-end including React, Elm. Dozens of sound methodologies from good old Agile stuff all the way to Continuous Deployment with microservices.</p>
<p>Now, you're a small tech startup or even a small team in a big corporation. How to even start?</p>
<p>And the recommendation is: do the smallest thing that works first. Always. Of course, avoid "quick and dirty" as much as you can. But don't get paranoid and over-engineer too much.</p>
<p>Over-engineering is as expensive as doing things "dirty".</p>
<p></p>
<p></p>
<h3>Add "Time" to your equation</h3>
<p>What most people do very wrong is disregarding the variable of "Time".</p>
<p>Everybody goes to tech conferences or read fancy blog posts or watch flashy screencasts. Their wrong conclusion is: <em>"Netflix uses it, therefore it should be good for me, because I want to become Netflix"</em>.</p>
<p>The wrong assumption is that Neflix - or Google, or Facebook, or Spotify - is a static system and they always functioned the way they advertise it.</p>
<p>People forget that every unicorn company had a <strong>day-1</strong>. And on day-1 they did not use microservices. They did not had React.js. They did not have Go or Elixir. Some of them didn't even have good programmers to begin with. Netflix started as a VHS renting service, remember that? Google started off in a dorm-room with off-the-shelf hardware components assembled in a <a href="https://www.complex.com/pop-culture/2013/02/50-things-you-didnt-know-about-google/lego-server-rack">Lego-based rack</a>.</p>
<p>You are a fan of some celebrity. That celebrity has a Lamborghini car. So you want to be like that celebrity one day. What do you do? Do you buy the same Lamborghini he has?</p>
<p>If you are that stupid, the only thing you will end up with is a HUGE debt to pay.</p>
<p>Stop envying the rich guy's Lamborghini.</p>
<h3>(Technical) Debt</h3>
<p>This is neither a new term nor a new theme. Every decision you make in programming is a <strong>compromise</strong> between what the "future-ideal" should be and what you can actually do right now. Loan to buy the equivalent Lamborghini too soon, and you will have to deal with an unpayable (Technical) Debt. And you will stale, you will stop, you will do nothing BUT pay that debt from now on.</p>
<p>You want to "code faster" therefore you skip writing automated tests, because you assume it will slow you down. And you're right. Test-driven development is not about making you fast at first. It's about protecting your future self from your present self. It's about not accumulating Technical Debt.</p>
<p>Again, you forget the "Time" variable.</p>
<p>You write and deliver fast for the 1st month. After the first version is deployed, now you will abliged to start paying the debt. Your productivity will slow down. Regression bugs will show up. Every new feature you try to add breaks something in unexpected ways. Because you don't have automated tests, you will keep fixing the same things many times over. Debt will catch up, and you will pay. One way or the other.</p>
<p>Minimal test suites are like <strong>Insurance</strong>. You don't need it right now, on day-1. But on day-100 you will be so glad you have it.</p>
<p>Doing too much microservices on day-1 is debt. It feels great that you're doing that fancy thing you read in a blog post. On day-100, with your 3 people team and a dozen microservices, from now on you will do nothing but pay the accumulated debt, with <strong>Interest</strong>. Every new microservices deployment breaks your system. And of course you didn't add monitoring, you didn't add integrated tests. So every time you code something, something else unexpectedly breaks.</p>
<p>Enjoying that early Lamborghini now?</p>
<h3>The Mythical Man-Month</h3>
<p>Philip Calçado writes very good posts and presents about microservices in the right way. If you're serious about that subject I strongly recommend that you read his posts, such as his <a href="https://philcalcado.com/2017/06/11/calcados_microservices_prerequisites.html">"Prerequisites"</a> post or his <a href="https://www.infoq.com/news/2017/05/economics-microservices">"Economics"</a> presentation.</p>
<p>He correctly remembers Fred Brooks' <strong>The Mythical Man-Month</strong>. I urge developers to read this small book. It's uncanny how the entire industry is still repeating the very same mistakes Brooks reports in his book from projects in the 60's!</p>
<p>To me, microservices is a by-product of tech companies with too many developers. Once you break through the 5-developers team a "monolithic" system with poor organization and few automated tests can become cumbersome to deal with. So the consequence is the desire to break it down. You make 2 teams and 2 microservices and coordinate. And the teams start to isolate, and play the finger-pointing sessions when new bugs are reported (<em>"it's the other team's microservice's fault"</em>).</p>
<p>That's <a href="https://www.melconway.com/Home/Conways_Law.html">Conway's Law</a> if you do it wrong:</p>
<blockquote>
  <p>Any organization that designs a system (defined broadly) will produce a design whose structure is a copy of the organization's communication structure.</p>
</blockquote>
<p>Also in play is another chapter in Brooks book: The <a href="https://wiki.c2.com/?SecondSystemEffect">Second System Effect</a>. Every developer, tech startup, has to assume that the first version of anything is not the best design. And the second system (the first big rewrite) is <strong>the most dangerous</strong> system you will write. As Brooks state, it goes like this:</p>
<blockquote>
  <p>An architect’s first work is apt to be spare and clean. He knows he doesn’t know what he’s doing, so he does it carefully and with great restraint.</p>
  <p>As he designs the first work, frill after frill and embellishment after embellishment occur to him. These get stored away to be used “next time.” Sooner or later the first system is finished, and the architect, with firm confidence and a demonstrated mastery of that class of systems, is ready to build a second system.</p>
  <p>This second is the most dangerous system a man ever designs. When he does his third and later ones, his prior experiences will confirm each other as to the general characteristics of such systems, and their differences will identify those parts of his experience that are particular and not generalizable.</p>
  <p>The general tendency is to over-design the second system, using all the ideas and frills that were cautiously sidetracked on the first one. The result, as Ovid says, is a “big pile.”</p>
</blockquote>
<p>Then, what happens? The CEO, the board, the investors, or whatever, start doing the wrong thing: hiring more and more people. Loan more and more. Instead of paying the debts they end up making more debt. They fell for what Brooks reported in the first chapter and what gives the name to the book: The Mythical Man-Month.</p>
<blockquote>
  <p>Adding manpower to a late software project makes it later.</p>
  <p>Complex programming projects cannot be perfectly partitioned into discrete tasks that can be worked on without communication between the workers and without establishing a set of complex interrelationships between tasks and the workers performing them.</p>
  <p>Therefore, assigning more programmers to a project running behind schedule will make it even later. This is because the time required for the new programmers to learn about the project and the increased communication overhead will consume an ever increasing quantity of the calendar time available.</p>
</blockquote>
<p>Again, it's foregoing the sense of the "Time" variable. And confusing "debt" for "investment".</p>
<p>First of all, do yourself a favor and <a href="https://amzn.to/2sFbkWq">read the goddawn book</a> already, twice.</p>
<h3>Do Agile right! And no, it's not Kanban!</h3>
<p>If there is one good thing the whole Lean noise generated is the notion of "Most Viable Product" or MVP. People call it "prototype". Some call it "launching Beta" or simply "version 1.0". Doesn't matter. It's the realization that you don't know much at the beginning so overengineering on the first version is a waste of time. Lean is about controlling "waste", so we do the minimal that work, gauge results and work from there.</p>
<p>The cynical will say that any prototype that reaches production will never die. And they're not wrong.</p>
<p>The balance is to not do the "quick and dirty" version. That's why we have Agile techniques for. Do the minimal, organize the minimal. That's why we have object-oriented design patterns, from GoF to DDD. You don't need to do EVERY pattern - that's what "overenginnering" means. But you can do the minimal monolith that will allow you to evolve later.</p>
<p>People criticize Ruby on Rails for not being organized "enough". <a href="https://apotonick.wordpress.com/2015/09/05/the-only-alternative-to-a-rails-monolith-are-micro-services-bullshit/">Nick Sutterer</a>, the creator of the high-level <a href="https://github.com/trailblazer/trailblazer">Trailblazer</a> has a good point.</p>
<p>Rails done wrong is bad. The conclusion should NOT be: <em>"let's do microservices"</em> though. That jump in faith is idiotic and makes no sense for all the reasons I mentioned above.</p>
<p><em>"Let's do proper Agile stuff and proper object-oriented stuff"</em> should be the initial answer.</p>
<p>And by "Agile" forget about idiotic post-its, idiotic numerology-based estimation equations (this is a whole post in itself, because story points and velocity are useful, but adding Montecarlo and other Gaussian-based stuff are not). The only "Agile" things you should be concerned about are the <a href="https://www.extremeprogramming.org/">Extreme Programming (XP) techniques</a>, <strong>including</strong> Iteration-based timeboxes.</p>
<p>You <strong>MUST</strong> do timeboxes. Stop, re-assess, change directions, and then keep going. The model of "Pull" is only reasonable when your directions is very, very clear, written in stone and unchangeable - like in a factory production line! (Where the concept of Pull - and Lean -- was actually born!)</p>
<p>Iterations, like automated tests, are like Insurance. You can never avoid all waste, but you can minimize it. You can afford to throw away an Iteration-worth of work. After the iteration you measure the results, and throw it way if necessary - changing direction in the process. Throwing useless stuff away is as important as adding new stuff. If you just add, you have a <a href="https://en.wikipedia.org/wiki/Compulsive_hoarding">hoarding disorder</a>!</p>
<p>If in doubt, do XP. Yes, it feels more "difficult", and Kanban is "simpler" to explain. Now, is that a good reason?</p>
<h3>Forget about Raw Performance when you DON'T need it!</h3>
<p>Another problem is choosing languages or framework because of performance.</p>
<p>If you're in the web development business, this is a huge WASTE.</p>
<p>Understand this truth: your servers will IDLE most of the time. And if you feel like using your web app is slow, it's not because of the language used, it's because of the POOR programming you did. And no good language will rescue a bad programmer. I always say that if performance was that important, we should all be doing C.</p>
<p>Most of what you serve in an HTTP-based apps, be it user-readable content, be it API GET results, can be <strong>CACHED</strong>! If you're not using a <a href="https://www.akitaonrails.com/2015/08/25/small-bites-adicionando-um-cdn-ao-seu-site-a-forma-facil">CDN</a>, you're doing it wrong.</p>
<p>Yeah, yeah, yeah, you think you're building the next Spotify. You're not, at least not 99% of you. And the 1% doing custom engineering, with custom techniques and custom stack, successfully, you're the 1%. Actually I'd say you're a fraction of the 1%. Do not assume that what you do is good for the rest of the population.</p>
<p>90% of what most small companies and solo web developers need is just a Shopify account and a vanilla Wordpress installation. And that's it.</p>
<blockquote>
  <p>Are you doing infrastructure development like building custom components to Docker, Kubernetes, Terraform? Command-line tools? Daemons? Then choose GO.</p>
  <p>Are you doing embedded libraries? Maybe the next generation OpenSSL? Drivers? Then choose RUST.</p>
  <p>Are you doing mobile development? Then don't have a lot of choice, do Swift for iOS, do Kotlin/Java for Android. Or do React Native for simpler apps.</p>
  <p>Are you really doing the next Whatsapp? The next Waze? The next Snap? You have hundreds or thousands of users in need of long-lived connections over unreliable network doing broadcasts of messages? Or you're building the next evolution of distributed NoSQL databases? Or anything that actually has the proper meaning of "Distributed" in it's definition? Then choose ELIXIR.</p>
  <p>Are you doing a CRUD based web application? Go RAILS and never look back.</p>
  <p>Are you doing all of the above? Use all the alternatives then. And I hope you have the budget, because you need a big team.</p>
</blockquote>
<h3>Conclusion</h3>
<p>The Economics only makes sense when you consider the day-1. Do not forget the "Time" variable. It makes all the difference.</p>
<p>You will always get Debt to pay. So be smart in which kind of debt you choose. Because you will have to pay it back eventually.</p>
<p>Again, read Brooks. He said it decades ago: <a href="https://worrydream.com/refs/Brooks-NoSilverBullet.pdf">THERE IS NO SILVER BULLET</a>. Don't bullshit yourself. A new language, a new framework, a new architecture. None of those will save you.</p>
<p>In any tech endeavor, code is not the only thing to worry about. I would go as far as to say that in a tech startup, code is only 20% of the problem. A tech startup is just a company, like any other. If you're the founder or CEO, you have to deal with all the remaining 80%: marketing, accounting, human resources, legal, etc. It's already difficult enough without your tech team getting you unwanted Technical Debt - the unneeded Lamborghini - that you won't be able to pay.</p>
<p>You can start humble on day-1. Keep evolving, continuously - this is the core of any Agile or Lean process: <a href="https://www.graphicproducts.com/articles/what-is-kaizen/">KAIZEN</a>. Choose smart debts, pay them a small bit at a time, continuously. It's the same reasoning as getting a loan in the bank.</p>
<blockquote>
  <p>Netflix day-7,200 is NOT your day-1.</p>
  <p>Facebook day-4,800 is NOT your day-1.</p>
  <p>Goodle day-6,8090 is NOT your day-1.</p>
  <p>Be humble. Deliver fast. Pay your Debts. Keep evolving continuouly. Stop believing in fairy tales and silver bullets.</p>
</blockquote>
<p></p>
---
title: "Personal Thoughts on the Current Functional Programming Bandwagon"
date: "2015-10-28T19:14:00.000Z"
tags: ["career", "elixir", "english"]
years: "2015"
---

<p></p>
<p>Today, Git is unanimously the only best way to manage source code. Back in 2009, when it was still gaining traction, there were some detractors. Some would say that they wouldn't use Git because it was written in C, instead of C++. To that, Linus Torvalds famously <a href="http://article.gmane.org/gmane.comp.version-control.git/57918">retorted</a>:</p>
<blockquote>
  *YOU* are full of bullshit.
</blockquote>
<blockquote>
  C++ is a horrible language. It's made more horrible by the fact that a lot
  of substandard programmers use it, to the point where it's much much
  easier to generate total and utter crap with it. Quite frankly, even if
  the choice of C were to do *nothing* but keep the C++ programmers out,
  that in itself would be a huge reason to use C.
</blockquote>
<p></p>
<p></p>
<p>To this day, <a href="https://insights.dice.com/2015/03/10/linus-torvalds-was-sorta-wrong-about-c/?CMPID=AF_SD_UP_JS_AV_OG_DNA_">many still try to reason against Linus' arguments</a>. I am of the opinion that one of the reasons Git and the Linux kernel are good is exactly because of the choice of C (and, for better or worse, the bullying culture of their benefactor dictator, Linus).</p>
<p>Languages have features, they have ancestors, they are imbued with some sense of philosophy and purpose. Because of that it's easy to see why young people choose languages in an attempt to fit in to some group. It's not so much because a language has some style of syntax or because it's insanely fast or because it's elegantly implemented.</p>
<p>Some people like Google and feel more compelled to justify their choice of Go. Some people like Apple and feel more compelled to justify their choice of Swift or Objective-C. Some people are naturally more academic, and don't feel so much the need to justify their choice of Haskell - which, by the way, has an <a href="https://www.quora.com/Why-dont-more-programmers-use-Haskell">unofficial motto</a> of <em>"Avoid success at any costs."</em></p>
<p>In particular, young programmers feel the need to justify their choices using some sort of logical reasoning. Trying to explain language choices because of features is a <strong>fallacy</strong>. You don't need to explain why you listen to Bruno Mars, if you like him just do. You don't need to explain why you eat Thai food, if you like it just do.</p>
<p>Which is why, most blog posts and articles trying to justify the choice of a language or tool are very unreliable: because they can't escape being biased. There is no logical reasoning that can unambiguously define one language as the winner over other languages. Any language that is in use today has applications, some more than others, of course.</p>
<p>Easier said then done, I know. Bear with me.</p>
<p>Each new generation struggles to find <strong>identity</strong>, they have the need to not just follow what the previous generation left behind.</p>
<p>And we, programmers, are naturally averse to "legacy" anyway. It's in our DNA to try to rewrite history every time. It's easy to write new stuff, it's very difficult to make something that lasts. Because of that, many of us go back to the longer past in order to justify our new choices as "rediscoveries". It may be one reason the Lisp people are so persistent.</p>
<h2>The Hype</h2>
<ol>
  <li>
    <p>You don't only have a dozen languages to fight against if you're a language extremist. You have <a href="https://en.wikipedia.org/wiki/List_of_programming_languages">hundreds</a>.</p>
  </li>
  <li>
    <p>There are not only imperative, object-oriented, funcional paradigms in programming. There are <a href="https://en.wikipedia.org/wiki/Comparison_of_programming_paradigms">many more paradigms</a>.</p>
  </li>
  <li>
    <p>It's rare to have a language that implements only one paradigm, most languages are multi-paradigm.</p>
  </li>
  <li>
    <p>Functional paradigm - the current new kid on the block - is not the best. It's just another paradigm. Electing one over the other is denying a long history of computer science research and achievements.</p>
  </li>
</ol>
<p>Why the current trend in functional languages? Because it is a departure from the previous generation, very compelling for new folk trying to make a dent in history.</p>
<p>It makes you feel special to be able to discuss about <a href="https://en.wikipedia.org/wiki/Purely_functional">functional purity</a>, <a href="https://lambda-the-ultimate.org/node/1180">monad vs unique type</a>, and other oddities. That's all there is to most of the discussions.</p>
<ul>
  <li>You have the credibility track of a <a href="https://www.paulgraham.com/lisp.html">Paul Graham's essays</a>.</li>
  <li>You have the coincidental choice of Javascript gaining sudden traction and having some <a href="https://www.sitepoint.com/introduction-functional-javascript/">functional aspects</a>.</li>
  <li>You start realizing that managing mutable state generates a lot of hassles and make parallel programming difficult and then realize that some functional languages offer <a href="https://miles.no/blogg/why-care-about-functional-programming-part-1-immutability">immutable state</a> and that triggers an epiphany.</li>
  <li>You hear stories, <a href="https://www.quora.com/What-languages-and-frameworks-is-Simple-built-with">Bank Simple using some Clojure</a>, a Clojure-based machine learning startup, <a href="https://www.crunchbase.com/organization/prismatic#/entity">Prismatic, getting a hefty Series A</a>, or the amazing story of the small Erlang-based startup, <a href="https://highscalability.com/blog/2014/2/26/the-whatsapp-architecture-facebook-bought-for-19-billion.html">Whatsapp, being bought by USD 19 billion</a>. How can you not pay attention?</li>
</ul>
<h2>Some Benefits</h2>
<p>The functional style of programming, of dealing with the transformation pipeline of immutable things without shared state, do actually improve our way of thinking about problem resolutions. But so does any other programming paradigm. Declarative programming, for example, where you define computation logic without defining a detailed control flow leading to SQL, regular expressions.</p>
<p>There are indeed benefits of so many discussions around functional programming. At the very least the new generation is getting the chance to grasp <strong>old</strong> and really useful concepts such as:</p>
<ul>
  <li><a href="https://c2.com/cgi/wiki?FirstClass">First Class Functions</a> - when there is no restrictions on how a function can be created and used.</li>
  <li><a href="https://c2.com/cgi/wiki?HigherOrderFunction">Higher Order Functions</a> - a function that can take a function as an argument and return functions.</li>
  <li><a href="https://c2.com/cgi/wiki?LexicalClosure">Lexical Closures</a> or just Closures - the definition is bit difficult but it's usually there when you can define a function within a function.</li>
  <li>Single Assignment (from which you can have Immutability) - when a variable is assigned once, at most.</li>
  <li><a href="https://en.wikipedia.org/wiki/Lazy_evaluation">Lazy Evaluation</a> - when execution is deferred until really necessary.</li>
  <li><a href="https://c2.com/cgi/wiki?TailCallOptimization">Tail Call Optimization</a> (Tail Recursion) - in practice, if the last expression of a recursive function is itself, it can just jump back to the beginning instead of creating a new stack frame overhead.</li>
  <li><a href="https://c2.com/cgi/wiki?ListComprehension">List Comprehensions</a> - creating lists based on existing lists. Python programmers are more acquainted with the term, at least.</li>
  <li><a href="https://c2.com/cgi/wiki?TypeInference">Type Inference</a> (Hindley-Milner Type System) - in practice it allow you to write code without having to declare static types all the time and leave it to the compiler to infer the correct types. Gives the best of both dynamic and static world.</li>
  <li><a href="https://c2.com/cgi/wiki?PatternMatching">Pattern Matching</a> - dispatching mechanism to choose between variants of a function (which is also important for Logic Programming and to differentiate between declarative and imperative paradigms)</li>
  <li><a href="https://bit.ly/1WjbXuS">Monadic Effects</a> - now, this is one of the most difficult concepts to really understand.</li>
</ul>
<p>Dynamic languages such as Ruby, Python, Javascript already made us comfortable with the notions of first class functions, higher order functions, closures, list comprehensions. Existing languages such as Java and C# have been deploying some of those features such as closures, comprehensions.</p>
<p>Type Inference has been quickly gaining adoption since at least 2004 when Scala, Groovy, F# brought it to mainstream discussion. Then C# 3.0+ adopted it, now Rust, Swift were designed with it in mind.</p>
<p>We are used to String Patterns because of Regular Expressions, but the Pattern Matching paradigm feels alien at first. Erlang is probably the most recognizable language that uses it, and now Elixir and Rust sport this feature and you should start to paying attention.</p>
<p>There are many more concepts but the list above should be a fair enough list. But out of all of them the most difficult to wrap one's head around is Monads. A Monad can be defined as a functional design pattern to describe a computation as a sequence of steps.</p>
<p>Pure functional languages are supposed to not have <a href="https://bit.ly/1N8LeAU">side-effects</a>. This simple statement can spur quite a lot of <a href="https://programmers.stackexchange.com/questions/179982/misconceptions-about-purely-functional-languages">heated discussions</a>. You will come into contact with other concepts such as <a href="https://en.wikipedia.org/w/index.php?title=Referential_transparency&amp;redirect=no">referential transparency</a> (where you can safely replace an expression with its value). You will probably hear about how purely functional languages wrap side-effects such as I/O consequences using Monads, and that there are several <a href="https://functionaljavascript.blogspot.in/2013/07/monads.html">different kinds of Monads</a> (Identity, Array, State, Continuation, etc).</p>
<p>Regardless of Haskell Monads and the intricasies of the mathematics behind it, you have probably already bumped into Monads one way or the other. One could argue that <a href="https://functionaljavascript.blogspot.com.br/2013/04/the-promise-monad-in-javascript.html">Javascript Promises is a kind of Monad</a>. And you also have <a href="https://en.wikipedia.org/wiki/Option_type">ML inspired Option Types</a> which are of the same family of Haskell's Maybe Monads.</p>
<p>Rust is all built around the <a href="https://hoverbear.org/2014/08/12/option-monads-in-rust/">Option Monad</a> (also known as Maybe Monad, from Haskell, but the ML language came before and named this pattern as 'Option'). Even Java 8 recently obtained this new feature and named it <a href="https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html">Optional</a>. In Swift it's also named <a href="https://developer.apple.com/library/ios/documentation/Swift/Conceptual/Swift_Programming_Language/OptionalChaining.html">Optional</a>. It's the best way we know today to deal with errors, vastly superior than dealing with returning error codes, or (argh), raising exceptions or dealing with Null.</p>
<p>Ruby is known as a multi-paradigm object-oriented and functional language, an amalgam between Smalltalk and Lisp, and the next version 3.0 will probably see the official inclusion of an <a href="https://bugs.ruby-lang.org/issues/11537">optional operand</a> inspired by the <a href="https://apidock.com/rails/v4.2.1/Object/try">#try method</a> we already use for safe method chaining. And we might also see <a href="https://bugs.ruby-lang.org/issues/11473">immutable strings</a>, making it easier to write more functional constructs while being more efficient for the garbage collector to boot.</p>
<h2>Conclusion</h2>
<p>Functional programming is not the end game for programming paradigms. It's a hell of a good one, and the current needs fit in nicely with the aforementioned techniques. But don't be fooled, we have been scaling very large applications that lasted years with no functional language features. C, C++, COBOL, ADA, have been driving very large systems for decades. Functional is great to have, but it's not utterly necessary if we didn't.</p>
<p>We are in need of transforming large amounts of data points into more useful aggregates, we are in need to reason about those transformations a bit better and be able to execute volumes of small transformations in parallel and in distributed infrastructures. Functional techniques reasoning do help.</p>
<p>Haskell is widely acclaimed as the language that represents the functional programming ideals. But it is meant to be an academic language, a compilation of the best research in the field. It's supposed to not be mainstream, but to give an implementation for those more inclined to dive deeper into the rabbit hole. There were many older languages that preceded it and you could be interested such as <a href="https://en.wikipedia.org/wiki/ISWIM">ISWIM</a>, <a href="https://bit.ly/1Gxvnuq">Miranda</a>, <a href="https://bit.ly/1kSM4GO">ML</a>, <a href="https://bit.ly/1jRZd2R">Hope</a>, <a href="https://bit.ly/1MUmAzw">Clean</a>. Haskell kind of compiles the best of them in one place.</p>
<p>Clojure is <a href="https://stackoverflow.com/questions/6008313/clojure-vs-other-lisps">trying to bring those functional concepts</a> to the Java world. The Java legacy integration is one of its strength but also the source of its <a href="https://www.quora.com/What-are-the-downsides-of-Clojure">weaknesses</a>. It stil remains to be seen how far it can go.</p>
<p>Elixir is my personal bet as it drives the industrial strength battle tested Erlang to the forefront. It's undeniably a Ruby for the functional world. It's actor model is what inspired what you have today in <a href="https://www.quora.com/Go-programming-language/How-are-Akka-actors-are-different-than-Goroutines-and-Channels">Scala/Akka</a>. Go's goroutines and channels are a close match.</p>
<p>Many other languages are receiving the functional sugar coating these days. Javascript and Ruby have some of the functional features mentioned above. <a href="https://www.infoq.com/articles/How-Functional-is-Java-8">Java</a> and <a href="https://functionalcsharp.codeplex.com">C#</a> didn't have functional influences in their inceptions so they are receiving a few features just to remain competitive. But even without being a pure functional language, many of those features have been adapted and implemented in one way or another.</p>
<p>In the near future we will probably have more <strong>hybrid</strong> languages leading the pack. Go, Swift and Rust are good examples of modern and <strong>very young</strong> languages that get inspiration in many different paradigms. They avoid pureness in order to be actually accessible to more developers. Pureness ends up alienating most people. We will find the more mainstream languages somewhere in the middle.</p>
<p>In the meantime, by all means, do dive deeper into the functional programming concepts, they are quite interesting and finally today we can have more practical applications instead of just academic experimentation. But don't try to make a cult out of this, this is not a religion, it's just one small aspect of the computer science field and you will benefit if you incorporate this with other aspects to have a better picture of our field.</p>
<p></p>
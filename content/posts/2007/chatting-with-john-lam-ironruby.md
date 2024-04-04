---
title: "Chatting with John Lam (IronRuby)"
date: "2007-11-12T20:37:00.000Z"
tags: ["english"]
years: "2007"
---

<p></p>
<div style="float: left; margin: 5px"><a href="http://www.iunknown.com/"><img src="http://s3.amazonaws.com/akitaonrails/assets/2007/11/12/n685772348_7884.jpg" srcset="http://s3.amazonaws.com/akitaonrails/assets/2007/11/12/n685772348_7884.jpg 2x" alt=""></a></div>
<p>It’s been a while since my last international interview, and I am back with no other than one of the responsibles for Ruby being enabled in the .<span class="caps">NET</span> platform. That’s correct, I’ve covering a lot about JRuby and Rubinius but we can’t neglect that one of the biggest platforms out there in the market is receiving the Ruby treatment as well. So I invited <a href="http://www.iunknown.com/">John Lam</a> , who kindly answered several questions regarding this endeavor.</p>
<p>Remembering that <a href="http://www.ironruby.net/">IronRuby</a> – named after <a href="http://www.ironpython.com/">IronPython</a>, the first of the main open source dynamic languages built on top of .<span class="caps">NET</span> – is a <a href="http://www.opensource.org/node/207">true open source</a> project, and also has a 3rd party addon for Visual Studio.<span class="caps">NET</span>, so programmers used to the VS.<span class="caps">NET</span> workflow can get onboard with a lower learning curve ahead of them.</p>
<p>Despite of opinions against Microsoft just for the sake of arguing, the fact remains that Java and .<span class="caps">NET</span> represent the biggest corporate development market today. And this is also a fact that the Ruby meme is spreading in a very fast way. Being built to run on top of both the <span class="caps">JVM</span> and the <span class="caps">CLR</span> represents Ruby being enabled for market niches that it wouldn’t reach otherwise, and this is huge win. I talked a little bit about this in my article (in portuguese): <a href="/2007/10/23/para-eu-ganhar-o-outro-precisa-perder">For myself to win, the other one has to lose</a>. There are very intelligent people at Microsoft, John Lam being one of them.</p>
<p></p>
<p></p>
<p>That said, let’s get started:</p>
<p><strong>AkitaOnRails:</strong> First of all, I always ask my guests about their careers: what was you path up until now? Meaning, how did you get yourself involved in computing, what drives you into it?</p>
<p><strong>John Lam:</strong> I wrote a lot of software before I graduated from High School in 1986. I shipped a bunch of commercial software for the Commodore ‘platform’ (aka <span class="caps">PET</span>, <span class="caps">VIC</span>-20, C-64/128) back in the day. In 1986 I decided that there was no future in computing (which shows why folks shouldn’t take my opinions seriously :)) and decided to study the physical sciences in University. I graduated in 1995 with my doctorate in Organic Chemistry and decided that there was no future in chemistry (which, if you look at how the reverse engineering of life today is based a lot on cross-discipline interaction with other branches of life sciences, shows why folks shouldn’t take my opinions seriously :)).</p>
<p>Once I decided to work in computing again, I took up an obscure new development platform called Delphi which shipped in 1.0 form around the time that I re-entered the field. I spent a bunch of time working on integrating Delphi with <span class="caps">COM</span>, which is where I originally hung my hat. The dark side of <span class="caps">COM</span> pulled me into its orbit and I’ve been working on Microsoft related stuff since then.</p>
<p><strong>AkitaOnRails:</strong> I see that you’re at Microsoft since January 2007, is that correct? How did you get in there, were you hired with the IronRuby project in mind? Is this your main assignment today?</p>
<p><strong>John Lam:</strong> Yes, I started in January. Before joining the company, I worked on an open source bridge between Ruby and the <span class="caps">CLR</span> called RubyCLR. When I decided to start promoting that work at conferences, I crossed paths with the <span class="caps">DLR</span> team at Microsoft. Mahesh Prakriya graciously donated half of his talk at Tech Ed in 2006 so that I could talk about RubyCLR. After much hand-wringing/mind-conditioning I wound up accepting their offer to work full time on a Ruby implementation on top of the <span class="caps">DLR</span> and we (my wife, two kids and dog) arrived in Redmond in January.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/166261351_2b04ab1086.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/166261351_2b04ab1086.jpg 2x" alt=""></p>
<p><strong>AkitaOnRails:</strong> What was the motivations behind starting IronRuby? How did it start? Was you the original and sole developer of a .<span class="caps">NET</span><br>
  implementation of Ruby?</p>
<p><strong>John Lam:</strong> We want to demonstrate that the <span class="caps">DLR</span> is truly a multi-language dynamic language runtime, so we had to build a number of languages on top of it. Ruby certainly fit the criteria: dynamic, strong user community, lots of attention, so it made sense to implement it. IronRuby has definitely forced a lot of design changes to the <span class="caps">DLR</span>, making it less ‘Pythonic’ which is a good thing for other folks who are interested in building a dynamic language on top of our platform.</p>
<p>I’m definitely not the sole developer on IronRuby. We have two great devs working on the project: Tomas Matousek and John Messerly and they’re doing awesome work. Our tester, Haibo Luo, is doing great work to make sure that we ship a high quality implementation. Haibo’s work will be released along with IronRuby, which means that the community can also benefit from his test suite.</p>
<p><strong>AkitaOnRails:</strong> Not many people here is familiar with the <span class="caps">DLR</span> and Silverlight, can you briefly describe them for non-starters? What makes a ‘<span class="caps">DLR</span>’ different from a ‘<span class="caps">CLR</span>’ besides jumping from “C” to “D”? :-)</p>
<p><strong>John Lam:</strong> The <span class="caps">DLR</span> is a platform that layers on top of the <span class="caps">CLR</span>. This means that we can run anywhere that the <span class="caps">CLR</span> can run, which of course includes Silverlight. Silverlight is our cross-platform browser-based platform that runs on Windows, Mac and Linux (via the Moonlight project). We ship a cross-platform version of the <span class="caps">CLR</span> which means that you’ll be able to run <span class="caps">DLR</span>-based languages with just a 5MB initial download into your web browser.</p>
<p><strong>AkitaOnRails:</strong> This is delicate: I once read Ola Bini and Charles Nutter criticizing the “Microsoft Way”, meaning that it would be extremelly hard – if not impossible – for you to write a 100% complete Ruby 1.8 implementation on top of .<span class="caps">NET</span> without being able to peek into the source code. The reason being the company policy toward open source licenses. Was that the case?</p>
<p><strong>John Lam:</strong> I think that IronPython is the existence proof that you can build a compatible implementation of a dynamic language without looking at the original source code. In our work with IronRuby, I can tell you that not being able to look at the source code hasn’t prevented us from figuring out how Ruby accomplishes some feature – it’s all about designing the right experiments.</p>
<p><strong>AkitaOnRails:</strong> I also saw that IronRuby is going to be released under open source-compatible license from Microsoft, making it probably the first trueopen source project ever from Microsoft, meaning that you would not only allow people to take a look at the source code but also to contribute back to it. How far is this?</p>
<p><strong>John Lam:</strong> The Microsoft Public License was officially sanctioned by the <span class="caps">OSI</span> in early October. IronRuby, IronPython and the <span class="caps">DLR</span> are all released under this license.</p>
<p>We’ve already accepted contributions back in from the community, and are continuing to accept more contributions from the community.</p>
<p>We’re actually not the first Open Source project at Microsoft that accepts contributions back from the community. That honor belongs to the <span class="caps">ASP</span>.<span class="caps">NET</span> <a href="https://www.asp.net/ajax/ajaxcontroltoolkit/samples/"><span class="caps">AJAX</span> control toolkit</a> which is an enormously successful project with &gt; 1M downloads to date.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/166261286_d084c57e46.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/166261286_d084c57e46.jpg 2x" alt=""></p>
<p><strong>AkitaOnRails:</strong> The <span class="caps">DLR</span> was originally conceived as an experimental way to run Python on top of .<span class="caps">NET</span>. Did this make it easier for a Ruby implementation or do you feel that Python and Ruby were different enough to guarantee lots of tweaks into the <span class="caps">DLR</span> to make it feasible?</p>
<p><strong>John Lam:</strong> It’s fair to call the original version of the <span class="caps">DLR</span> the “Python Language Runtime”. Adding Ruby to the mix forced a lot of additional changes to the <span class="caps">DLR</span>, the most significant being the refactoring of the runtime to migrate all of the Python specific idioms (which were thought to be general but turned out not to be the case) into IronPython.dll. What remains is a core which our the 4 languages developed by <span class="caps">MSFT</span> (IronRuby, IronPython, Managed JScript and VB) continue to use effectively today.</p>
<p><strong>AkitaOnRails:</strong> Is it a goal to be 100% compatible with <span class="caps">MRI</span> 1.8? Or you’re going toward a sub-set of the Ruby implementation? This would make it possible to write .<span class="caps">NET</span> programs in Ruby, using the full set of .<span class="caps">NET</span> libraries and frameworks as <span class="caps">ASP</span>.<span class="caps">NET</span>, Windows.Form, <span class="caps">LINQ</span>, etc. Or are you planning on a full blown <span class="caps">MRI</span> compatible implementation, enough to be able to run an entire Rails application?</p>
<p><strong>John Lam:</strong> Our #1 priority is being as compatible as possible with <span class="caps">MRI</span> 1.8.×. The one feature that we will not support is continuations, which is consistent with JRuby. Other than that (and in the absence of a Ruby spec), compatibility will be judged by whether we can run real Ruby applications and community developed Ruby test suites. Obviously Rails is an extremely important Ruby application, which we will absolutely run on top of IronRuby.</p>
<p>.<span class="caps">NET</span> interop is our #2 priority. We will integrate with the .<span class="caps">NET</span> platform, and allow you to write Ruby applications using the rich set of .<span class="caps">NET</span> libraries. Obviously things like Silverlight, <span class="caps">WPF</span>, <span class="caps">LINQ</span>, WinForms, and <span class="caps">ASP</span>.<span class="caps">NET</span> will be supported.</p>
<p><strong>AkitaOnRails:</strong> Ruby grew as a collective and low profile effort that really exploded 3 years ago because of Rails. That’s one reason no one ever bothered to write a formal specification and test suite. You have Alioth, you have the current <span class="caps">YARV</span> test suite. Did you had a hard time because of this lack of formal specs? Are you in contact with people like Charles from JRuby, Koichi Sasada from <span class="caps">YARV</span> or Evan Phoenix from Rubinius? What do you think of all these efforts going on in parallel? Are any way in that you can contribute with one another?</p>
<p><strong>John Lam:</strong> We’re using the Rubinius spec suite today, and plan on shipping it along with our sources to ensure that we catch compat bugs early in the process. I’m guilty of not participating as much as I would like to in talking more with Charlie, Evan and Koichi about collaborating on specs. We’re focused on getting the core language up and running today, and have like a lot of other fast-moving projects, been neglecting to document the things we have learned. Once the pace of the project slows down a bit, I’ll be able to spend more time engaging with the other implementers.</p>
<p><strong>AkitaOnRails:</strong> Ruby has a lot of known deficiencies. Koichi is trying to improve on some of them for Ruby 1.9. How are you tackling problems like lack of native threading, simple mark and sweep garbage collector, no virtual machine and thus no byte-code compilation, performance issues, lack of native internationalization (Unicode), lots of C-based extensions.</p>
<p><strong>John Lam:</strong> We get a lot of things for ‘free’ by running on top of the <span class="caps">CLR</span>. Native threading is supported in IronRuby. We use the <span class="caps">CLR</span> garbage collector, which is a world-class GC. We compile natively to IL, and our IL can be GC’d as well which is goodness for long-running server based applications. We will obviously support <span class="caps">CLR</span> strings, which are Unicode strings and we will also support Ruby mutable strings which are based on byte arrays. We will not support C-based extensions at all, instead we will be porting the existing C-based libraries in the Ruby Standard Libraryto C# (or Ruby).</p>
<p><strong>AkitaOnRails:</strong> Are there any benchmarks comparing IronRuby with the <span class="caps">MRI</span>? Do you think you’re already outperforming it? Are there any issues today around Ruby performance over the <span class="caps">DLR</span>? Or more interestingly: is there any comparison between Ruby on <span class="caps">DRL</span> and C# our VB.<span class="caps">NET</span> over the <span class="caps">CLR</span>?</p>
<p><strong>John Lam:</strong> We are faster than <span class="caps">MRI</span> in the <span class="caps">YARV</span> benchmarks, but that number changes daily. One great thing about our team is that we have a performance regression test suite that we regularly run across all of our code. This makes it trivial to pinpoint a build that causes a regression in performance, even if we postpone that work for a while.</p>
<p>We have done zero performance tuning so far; we’re just using features that exist in the <span class="caps">DLR</span> today, like polymorphic inline caches for efficient call-site method caching. As our implementation matures, we will tune IronRuby to perform well on application-level benchmarks (not just microbenchmarks which are useful to us but not so interesting to real customers). The <span class="caps">DLR</span> (and <span class="caps">CLR</span>) is becoming faster all the time, and any dynamic language that is built on top of the <span class="caps">DLR</span> will benefit from these improvements.</p>
<p>Obviously, languages like C# and VB.<span class="caps">NET</span> are faster than Ruby today. But we are confident that we can significantly narrow that gap over time.</p>
<p><strong>AkitaOnRails:</strong> What about tooling? I saw you tweaked your Visual Studio.<span class="caps">NET</span> to have the Vibrant Ink that we – TextMate users – are used to, and it looks nice. I even saw a screenshot of code folding of Ruby inside of Visual Studio. How is its support for Ruby?</p>
<p><strong>John Lam:</strong> Right now our team isn’t involved in VS integration. However, the good folks at <a href="https://www.sapphiresteel.com/IronRuby-Visual-Designer">Sapphire in Steel</a> are doing great work at integrating IronRuby into VS.</p>
<p style="text-align: center"><a href="https://www.sapphiresteel.com/IronRuby-Visual-Designer"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/editing_small.gif" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/editing_small.gif 2x" alt=""></a></p>
<p><strong>AkitaOnRails:</strong> You mentioned in a interview about a possibility of Ruby running on top of Silverlight. How feasible this is today?</p>
<p><strong>John Lam:</strong> We demonstrated IronRuby running on top of Silverlight at RubyConf. The talk should be posted soon. We’re planning on rendezvousing with Silverlight in time for their next <span class="caps">CTP</span> (late this year / early next year). At that time, you will be able to code in Ruby that runs in your browser.</p>
<p><strong>AkitaOnRails:</strong> Microsoft is learning on how to deal with the open source community. Do you think the adoption of technologies as Python and Ruby are helping the company to understand the open source way? What do you think still have to improve? Meaning, if you could, what would you change?</p>
<p><strong>John Lam:</strong> Microsoft is a big company and we’re working very hard on working together with the Open Source community. IronRuby is one of the most visible Open Source projects in the company, and we’re helping to pave the way for other teams that want to engage with the Open Source community. Change happens incrementally at big companies and it’s been fun being a part of that change!</p>
<p><strong>AkitaOnRails:</strong> Silverlight was released over an open source license as well, so that the Mono guys were able to run it very quickly over Mono. Are you close to Miguel De Icaza? What do you think about Mono? An IronRuby running on top of it means a multi-platform Ruby that can run over Linux. If you ever get 100% compatibility with <span class="caps">MRI</span> and Rails, this means running over Apache+mod_mono on Linux and over <span class="caps">IIS</span> on Windows, everything developed under Orcas. Are there any plans for this kind of integration and end-to-end solution?</p>
<p><strong>John Lam:</strong> Actually, Silverlight is not released under an Open Source license. The <span class="caps">DLR</span>, IronPython and IronRuby are all released under the Microsoft Public License, which makes it possible for Miguel and his band of merry men to just ship it on top of their Moonlight implementation.</p>
<p>I love how pragmatic Miguel is. We showed IronRuby running on top of Mono at RubyConf and that was largely due to the Mono team fixing a bunch of bugs at the last minute so that we could demo (thanks!). <span class="caps">DLR</span> + Iron* tends to push the C# and the <span class="caps">CLR</span> pretty hard. We’ve uncovered bugs in the Microsoft C# compiler, and we’ve uncovered bugs in gmcs under Mono as well. But thankfully, both the C# team and the Mono team have been great at fixing those bugs to unblock us.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/481182714_62e1d07f7c.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/11/12/481182714_62e1d07f7c.jpg 2x" alt=""></p>
<p><strong>AkitaOnRails:</strong> I think, that’s it for today. Any closing remarks for the Brazilian audience?</p>
<p><strong>John Lam:</strong> Thanks for sending along a great set of questions! Good luck with your Ruby adventures and I hope you’ll have a chance to check out IronRuby in the future.</p>
<p></p>
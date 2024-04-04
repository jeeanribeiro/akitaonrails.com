---
title: "Trying to match C-based Fast Blank with Crystal"
date: "2016-07-06T20:10:00.000Z"
tags: []
years: "2016"
---

<p></p>
<p>In my eyes, Crystal may become the ideal solution to make our beloved Ruby gems faster. Up until now we have been using C-based extensions to accelerate CPU-bound code in Ruby. Nokogiri, for example, is a wrapper to provide a nice API on top of libxml, which is a huge library in C.</p>
<p>But there are many opportunities to accelerate Rails applications as well. For example, we just saw the release of the <a href="https://github.com/danielpclark/faster_path">gem "faster_path"</a>, this time written in Rust and bridged through FFI (Foreign Function Interface). The author's claim is that Sprockets has to compute lots of paths and making this library, natively compiled and optimized with Rust, added a huge improvement in the asset pipeline task.</p>
<p></p>
<p></p>
<p>Sam Saffrom, from Discourse, also built a very small gem called <a href="https://github.com/SamSaffron/fast_blank">"fast_blank"</a> which is a tiny library written in C that reimplements ActiveSupport's <code>String#blank?</code> method to be up to 9x faster. Because Rails digests volumes of strings, checking if they are blank everytime, this adds some performance (depends on your app, of course).</p>
<p>The Holy Grail to native-level performance is to be able to write close-to-Ruby code instead of having to hack low-level C or having the high learning curve of a language such as Rust. More than that, I'd like to avoid having to use FFI. I am not an expert in FFI but I remember understanding that it adds overhead to make the bindings.</p>
<p>By the way, it's important to disclose right now: I am not a C expert by any means of the imagination, far from that. So I have very little experience dealing with hard core C development. Which is again, why this possibility of writing in Crystal is even more appealing to me. So if you are a C expert and you spot something silly I am saying about it, please let me know in the comments section below.</p>
<p>My exercise is to rewrite the C-based Fast Blank gem in Crystal, add it to the same Gem to compile under Crystal if it's available or fallback to C, and make the specs pass so it's a seamless transition for the user.</p>
<p>To achieve that I had to:</p>
<ul>
  <li>Extend the Gem's extconf.rb to generate different Makefiles (for C and Crystal) that are able to compile under OS X or Linux (Ubuntu at least) - OK</li>
  <li>Make the specs pass in the Crystal version - Almost (it's ok for all intents and purposes but an edge case)</li>
  <li>Make the performance be faster than Ruby and close to C - Not so much yet (under OS X the performance is quite good, but under Ubuntu it doesn't scale so well for large string)</li>
</ul>
<p>You can check out the results so far on <a href="https://github.com/akitaonrails/fast_blank/tree/crystal_version">my fork over Github</a> and follow the <a href="https://github.com/SamSaffron/fast_blank/pull/20">Pull Request discussion as well</a>.</p>
<h3>Comparing C and Crystal</h3>
<p>Just to have us started, let's check out a snippet of Sam's original C version:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#088;font-weight:bold">static</span> VALUE<tt>
</tt>rb_str_blank(VALUE str)<tt>
</tt>{<tt>
</tt>  rb_encoding *enc;<tt>
</tt>  <span style="color:#074;font-weight:bold">char</span> *s, *e;<tt>
</tt><tt>
</tt>  enc = STR_ENC_GET(str);<tt>
</tt>  s = RSTRING_PTR(str);<tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> (!s || RSTRING_LEN(str) == <span style="color:#00D;font-weight:bold">0</span>) <span style="color:#080;font-weight:bold">return</span> Qtrue;<tt>
</tt><tt>
</tt>  e = RSTRING_END(str);<tt>
</tt>  <span style="color:#080;font-weight:bold">while</span> (s &lt; e) {<tt>
</tt>    <span style="color:#074;font-weight:bold">int</span> n;<tt>
</tt>    <span style="color:#074;font-weight:bold">unsigned</span> <span style="color:#074;font-weight:bold">int</span> cc = rb_enc_codepoint_len(s, e, &amp;n, enc);<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> (!rb_isspace(cc) &amp;&amp; cc != <span style="color:#00D;font-weight:bold">0</span>) <span style="color:#080;font-weight:bold">return</span> Qfalse;<tt>
</tt>    s += n;<tt>
</tt>  }<tt>
</tt>  <span style="color:#080;font-weight:bold">return</span> Qtrue;<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Yeah, quite scary, I know. Now let's see the Crystal version:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">struct <span style="color:#036;font-weight:bold">Char</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#888"># same way C Ruby implements it</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">is_blank</span><tt>
</tt>    <span style="color:#038;font-weight:bold">self</span> == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style=""> </span><span style="color:#710">'</span></span> || (<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">\t</span><span style="color:#710">'</span></span> &lt;= <span style="color:#038;font-weight:bold">self</span> &lt;= <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">\r</span><span style="color:#710">'</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">String</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">blank?</span><tt>
</tt>    <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">true</span> <span style="color:#080;font-weight:bold">if</span> <span style="color:#038;font-weight:bold">self</span>.nil? || <span style="color:#038;font-weight:bold">self</span>.size == <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>    each_char { |char| <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">false</span> <span style="color:#080;font-weight:bold">if</span> !char.is_blank }<tt>
</tt>    <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">true</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Hell yeah! If you're a rubyist I bet you can understand a 100% of the snippet above. It's not "exactly" the same thing (as the specs are not fully passing yet), but it's damn close.</p>
<h3>The Quest for a Makefile to Crystal</h3>
<p>I've researched many <a href="https://github.com/akitaonrails/ruby_ext_in_crystal_math">experimental Github repos</a> and Gists out there. But I didn't find one that has it all so I decided to tweak what I found until I got to this version:</p>
<p>Obs: again, I am not a C expert. If you have experience with Makefiles I know this one can be refactored to something nicer than this. Let me know in the comments below.</p>
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
</tt>36<tt>
</tt>37<tt>
</tt>38<tt>
</tt>39<tt>
</tt><strong>40</strong><tt>
</tt>41<tt>
</tt>42<tt>
</tt>43<tt>
</tt>44<tt>
</tt>45<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">ifeq <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">$(PLATFORM)</span><span style="color:#710">"</span></span> <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span><tt>
</tt>PLATFORM := $(shell uname)<tt>
</tt>endif<tt>
</tt><tt>
</tt>ifeq <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">$(PLATFORM)</span><span style="color:#710">"</span></span> <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Linux</span><span style="color:#710">"</span></span><tt>
</tt>UNAME = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">$(shell llvm-config --host-target)</span><span style="color:#710">"</span></span><tt>
</tt>CRYSTAL_BIN = $(shell readlink -f <span style="color:#F00;background-color:#FAA">`</span>which crystal<span style="color:#F00;background-color:#FAA">`</span>)<tt>
</tt>LIBRARY_PATH = $(shell dirname $(CRYSTAL_BIN))/../embedded/lib<tt>
</tt>LIBCRYSTAL = $(shell dirname $(CRYSTAL_BIN) )/../src/ext/libcrystal.a<tt>
</tt>LIBRUBY = $(shell ruby -e <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">puts RbConfig::CONFIG['libdir']</span><span style="color:#710">"</span></span>)<tt>
</tt>LIBS = -lpcre -lgc -lpthread -levent -lrt -ldl<tt>
</tt>LDFLAGS = -rdynamic<tt>
</tt><tt>
</tt>install: all<tt>
</tt><tt>
</tt>all: fast_blank.so<tt>
</tt><tt>
</tt>fast_blank.so: fast_blank.o<tt>
</tt>  $(CC) -shared $^ -o $<span style="color:#F00;background-color:#FAA">@</span> $(LIBCRYSTAL) $(LDFLAGS) $(LIBS) -L$(LIBRARY_PATH) -L$(LIBRUBY)<tt>
</tt><tt>
</tt>fast_blank.o: ../../../../ext/src/fast_blank.cr<tt>
</tt>  crystal build --cross-compile --release --target $(UNAME) $&lt;<tt>
</tt><tt>
</tt>.PHONY: clean<tt>
</tt>clean:<tt>
</tt>  rm -f bc_flags<tt>
</tt>  rm -f *.o<tt>
</tt>  rm -f *.so<tt>
</tt>endif<tt>
</tt><tt>
</tt>ifeq <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">$(PLATFORM)</span><span style="color:#710">"</span></span> <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Darwin</span><span style="color:#710">"</span></span><tt>
</tt>CRYSTAL_FLAGS = -dynamic -bundle -Wl,-undefined,dynamic_lookup<tt>
</tt><tt>
</tt>install: all<tt>
</tt><tt>
</tt>all: fast_blank.bundle<tt>
</tt><tt>
</tt>fast_blank.bundle: ../../../../ext/src/fast_blank.cr<tt>
</tt>  crystal $^ --release --link-flags <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">$(CRYSTAL_FLAGS)</span><span style="color:#710">"</span></span> -o $<span style="color:#F00;background-color:#FAA">@</span><tt>
</tt><tt>
</tt>clean:<tt>
</tt>  rm -f *.log<tt>
</tt>  rm -f *.o<tt>
</tt>  rm -f *.bundle<tt>
</tt>endif<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Most people using Crystal are on OS X, including the creators of Crystal. LLVM is under Apple's umbrella and their entire ecosystem relies heavily on LLVM. They spent many years migrating the C front-end first, then the C back-end away from GNU's standard GCC to Clang. And they were able to make their both Objective-C and Swift compile down to LLVM's IR and that's how both can interact back and forth natively.</p>
<p>Then, they improved the ARM backend support and that's how they can have an entire iOS "Simulator" (not a dog slow emulator like Android) where the iOS apps are natively compiled to run over Intel's x86_64 processor while in development and then quickly recompile to ARM when ready to package to the App Store.</p>
<p>This way you can run natively, test quickly, without the slowness of an emulated environment. By the way, I will say this once: Google's biggest mistake is not supporting LLVM as they should and reinventing the wheel. If they had, Go could already be used to implement for Android and Chromebooks as well as x86 based servers and they could put away all the Java/Oracle debacle.</p>
<p>But I digress.</p>
<p>In OS X you can pass a "<code>-bundle</code>" link-flag to crystal and it will probably use clang underneath to generate the binary bundle.</p>
<p>On Ubuntu crystal just compiles down to an object file (.o) and you have to manually invoke GCC with the "<code>-shared</code>" option to create a shared-object. To do that we have to use the <a href="https://crystal-lang.org/docs/syntax_and_semantics/cross-compilation.html">"--cross-compile"</a> and pass an LLVM target triplet so it generates the .o (this requires the <code>llvm-config</code> tool).</p>
<p>Shared Libraries (.so) and Loadable Modules (.bundle) are different beasts, check <a href="https://docstore.mik.ua/orelly/unix3/mac/ch05_03.htm">this documentation</a> out for more details.</p>
<p>Keep in mind that benchmarking binaries built with different compilers can make a difference. I am not an expert but out of pure anecdote I believe Ruby under RVM on OS X is compiled using OS X's default Clang. On Ubuntu it's compiled under GCC. This seems to make Ruby on OS X "so slightly" inneficient in synthetic benchmarks.</p>
<p>On the other hand, Crystal binaries linked with GCC feels "so slightly" inneficient on Ubuntu, while Ruby on Ubuntu feels a bit faster, having been compiled and linked with GCC.</p>
<p>So when we compare Fast Blank/OS X/bit faster with Ruby/OS X/slower against Fast Blank/Ubuntu/bit slower with Ruby/Ubuntu/bit faster, it seems to give a wider advantage to the OS X benchmark comparison against the Ubuntu benchmark, even though individual computation times are not so far from each other.</p>
<p>I will come back to this point in the benchmarks section.</p>
<p>Finally, everytime you have a rubygem with a native extension, you will find this bit in their gemspec files:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Gem</span>::<span style="color:#036;font-weight:bold">Specification</span>.new <span style="color:#080;font-weight:bold">do</span> |s|<tt>
</tt>  s.name = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">fast_blank</span><span style="color:#710">'</span></span><tt>
</tt>  ...<tt>
</tt>  s.extensions = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">ext/fast_blank/extconf.rb</span><span style="color:#710">'</span></span>]<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>When the gem is installed through <code>gem install</code> or <code>bundle install</code> it will run this script to generate a proper <code>Makefile</code>. In a pure C extension it will use the built-in "mkmf" library to generate it.</p>
<p>In our case, if we have Crystal installed, we want to use the Crystal version, so I tweaked the <code>extconf.rb</code> to be like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">mkmf</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">VERSION</span><span style="color:#710">'</span></span>] != <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">C</span><span style="color:#710">"</span></span> &amp;&amp; find_executable(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">crystal</span><span style="color:#710">'</span></span>) &amp;&amp; find_executable(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">llvm-config</span><span style="color:#710">'</span></span>)<tt>
</tt>  <span style="color:#888"># Very dirty patching</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create_makefile</span>(target, srcprefix = <span style="color:#038;font-weight:bold">nil</span>)<tt>
</tt>    mfile = open(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Makefile</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">wb</span><span style="color:#710">"</span></span>)<tt>
</tt>    cr_makefile = <span style="color:#036;font-weight:bold">File</span>.join(<span style="color:#036;font-weight:bold">File</span>.dirname(<span style="color:#038;font-weight:bold">__FILE__</span>), <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">../src/Makefile</span><span style="color:#710">"</span></span>)<tt>
</tt>    mfile.print <span style="color:#036;font-weight:bold">File</span>.read(cr_makefile)<tt>
</tt>  <span style="color:#080;font-weight:bold">ensure</span><tt>
</tt>    mfile.close <span style="color:#080;font-weight:bold">if</span> mfile<tt>
</tt>    puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Crystal version of the Makefile copied</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>create_makefile <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">fast_blank</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So, if it finds <code>crystal</code> and <code>llvm-config</code> (which in OS X you have to add the proper path like this: <code>export PATH=$(brew --prefix llvm)/bin:$PATH</code>).</p>
<p>The <code>Rakefile</code> in this project declares the standard <code>:compile</code> task as the first one to run, and it will execute the <code>extconf.rb</code>, which will generate the proper <code>Makefile</code> and run the <code>make</code> command to compile and link the proper library in the proper <code>lib/</code> path.</p>
<p>So we will end up with <code>lib/fast_blank.bundle</code> on OS X and <code>lib/fast_blank.so</code> on Ubuntu. From there we can just have <code>require "fast_blank"</code> from any Ruby file in the gem and it will have access to the publicly exported C function mappings from the Crystal library.</p>
<h3>Mapping C-Ruby to Crystal</h3>
<p>Now, any direct C extension - without FFI, fiddle or other "bridges" - will ALWAYS have a much better advantage.</p>
<p>The reason is that you literally have to "copy" data from C-Ruby to Crystal/Rust/Go or whatever other language you're binding. While with a C-based extension you can operate directly in the memory space with the data without having to move it or copy it away.</p>
<p>For example. First, you have to bind the C functions from C-Ruby to Crystal. And we accomplish that with <a href="https://github.com/phoffer/crystalized_ruby/blob/master/src/lib_ruby.cr">Paul Hoffer's Crystalized Ruby</a> mappings. It's an experimental repository that I helped a bit to clean up in order for him to later extract this mapping library into its own Shard (shards are the same as gems for Crystal). For now I had to simply copy the file over to my Fast Blank.</p>
<p>Some of the relevant bits are like this:</p>
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
</tt>36<tt>
</tt>37<tt>
</tt>38<tt>
</tt>39<tt>
</tt><strong>40</strong><tt>
</tt>41<tt>
</tt>42<tt>
</tt>43<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">lib <span style="color:#036;font-weight:bold">LibRuby</span><tt>
</tt>  type <span style="color:#036;font-weight:bold">VALUE</span> = <span style="color:#036;font-weight:bold">Void</span>*<tt>
</tt>  type <span style="color:#036;font-weight:bold">METHOD_FUNC</span> = <span style="color:#036;font-weight:bold">VALUE</span> -&gt; <span style="color:#036;font-weight:bold">VALUE</span><tt>
</tt>  type <span style="color:#036;font-weight:bold">ID</span> = <span style="color:#036;font-weight:bold">Void</span>*<tt>
</tt>  ...<tt>
</tt><tt>
</tt>  <span style="color:#888"># strings</span><tt>
</tt>  fun rb_str_to_str(value : <span style="color:#036;font-weight:bold">VALUE</span>) : <span style="color:#036;font-weight:bold">VALUE</span><tt>
</tt>  fun rb_string_value_cstr(value_ptr : <span style="color:#036;font-weight:bold">VALUE</span>*) : <span style="color:#036;font-weight:bold">UInt8</span>*<tt>
</tt>  fun rb_str_new_cstr(str : <span style="color:#036;font-weight:bold">UInt8</span>*) : <span style="color:#036;font-weight:bold">VALUE</span><tt>
</tt>  fun rb_utf8_encoding() : <span style="color:#036;font-weight:bold">VALUE</span><tt>
</tt>  fun rb_enc_str_new_cstr(str : <span style="color:#036;font-weight:bold">UInt8</span>*, enc : <span style="color:#036;font-weight:bold">VALUE</span>) : <span style="color:#036;font-weight:bold">VALUE</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#888"># exception handling</span><tt>
</tt>  fun rb_rescue(func : <span style="color:#036;font-weight:bold">VALUE</span> -&gt; <span style="color:#036;font-weight:bold">UInt8</span>*, args : <span style="color:#036;font-weight:bold">VALUE</span>, <span style="color:#808">callback</span>: <span style="color:#036;font-weight:bold">VALUE</span> -&gt; <span style="color:#036;font-weight:bold">UInt8</span>*, <span style="color:#808">value</span>: <span style="color:#036;font-weight:bold">VALUE</span>) : <span style="color:#036;font-weight:bold">UInt8</span>*<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">String</span><tt>
</tt>  <span style="color:#036;font-weight:bold">RUBY_UTF</span> = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_utf8_encoding<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">to_ruby</span><tt>
</tt>    <span style="color:#036;font-weight:bold">LibRuby</span>.rb_enc_str_new_cstr(<span style="color:#038;font-weight:bold">self</span>, <span style="color:#036;font-weight:bold">RUBY_UTF</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">from_ruby</span>(str : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>    c_str = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_rescue(-&gt;<span style="color:#036;font-weight:bold">String</span>.cr_str_from_rb_cstr, str, -&gt;<span style="color:#036;font-weight:bold">String</span>.return_empty_string, <span style="color:#00D;font-weight:bold">0</span>.to_ruby)<tt>
</tt>    <span style="color:#888"># FIXME there is still an unhandled problem: then we receive \u0000 from Ruby it raises "string contains null bytes"</span><tt>
</tt>    <span style="color:#888"># so we catch it with rb_rescue, but then we can't generate a Pointer(UInt8) that represents the unicode 0, instead we return a plain blank string</span><tt>
</tt>    <span style="color:#888"># but then the specs fail</span><tt>
</tt>    new(c_str)<tt>
</tt>  <span style="color:#080;font-weight:bold">ensure</span><tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">cr_str_from_rb_cstr</span>(str : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>    rb_str = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_str_to_str(str)<tt>
</tt>    c_str  = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_string_value_cstr(pointerof(rb_str))<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">return_empty_string</span>(arg : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>    a = <span style="color:#00D;font-weight:bold">0</span>_u8<tt>
</tt>    pointerof(a)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then I can use these mappings and helpers to build a "Wrapper" class in Crystal:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">./lib_ruby</span><span style="color:#710">"</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">./string_extension</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">StringExtensionWrapper</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">blank?</span>(<span style="color:#038;font-weight:bold">self</span> : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">true</span>.to_ruby <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">LibRuby</span>.rb_str_length(<span style="color:#038;font-weight:bold">self</span>) == <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>    str = <span style="color:#036;font-weight:bold">String</span>.from_ruby(<span style="color:#038;font-weight:bold">self</span>)<tt>
</tt>    str.blank?.to_ruby<tt>
</tt>  <span style="color:#080;font-weight:bold">rescue</span><tt>
</tt>    <span style="color:#038;font-weight:bold">true</span>.to_ruby<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">blank_as?</span>(<span style="color:#038;font-weight:bold">self</span> : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">true</span>.to_ruby <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">LibRuby</span>.rb_str_length(<span style="color:#038;font-weight:bold">self</span>) == <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>    str = <span style="color:#036;font-weight:bold">String</span>.from_ruby(<span style="color:#038;font-weight:bold">self</span>)<tt>
</tt>    str.blank_as?.to_ruby<tt>
</tt>  <span style="color:#080;font-weight:bold">rescue</span><tt>
</tt>    <span style="color:#038;font-weight:bold">true</span>.to_ruby<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">crystal_value</span>(<span style="color:#038;font-weight:bold">self</span> : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>    str = <span style="color:#036;font-weight:bold">String</span>.from_ruby(<span style="color:#038;font-weight:bold">self</span>)<tt>
</tt>    str.to_ruby<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this "Wrapper" depends on the "pure" Crystal library itself like with the snippets for the Char struct and String class extensions I showed in the first section of the article above.</p>
<p>Finally, I have a main "fast_blank.cr" file that externs those Wrapper functions so C-Ruby can see them as plain String methods:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">./string_extension_wrapper.cr</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt>fun init = <span style="color:#036;font-weight:bold">Init_fast_blank</span><tt>
</tt>  <span style="color:#036;font-weight:bold">GC</span>.init<tt>
</tt>  <span style="color:#036;font-weight:bold">LibCrystalMain</span>.__crystal_main(<span style="color:#00D;font-weight:bold">0</span>, Pointer(Pointer(<span style="color:#036;font-weight:bold">UInt8</span>)).null)<tt>
</tt><tt>
</tt>  string = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_define_class(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">String</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">LibRuby</span>.rb_cObject)<tt>
</tt>  <span style="color:#036;font-weight:bold">LibRuby</span>.rb_define_method(string, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">blank?</span><span style="color:#710">"</span></span>, -&gt;<span style="color:#036;font-weight:bold">StringExtensionWrapper</span>.blank?, <span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  <span style="color:#036;font-weight:bold">LibRuby</span>.rb_define_method(string, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">blank_as?</span><span style="color:#710">"</span></span>, -&gt;<span style="color:#036;font-weight:bold">StringExtensionWrapper</span>.blank_as?, <span style="color:#00D;font-weight:bold">0</span>)<tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is mostly boilerplate. But now check out what I am having to do in the wrapper, in this particular snippet:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">blank?</span>(<span style="color:#038;font-weight:bold">self</span> : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">true</span>.to_ruby <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">LibRuby</span>.rb_str_length(<span style="color:#038;font-weight:bold">self</span>) == <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>  str = <span style="color:#036;font-weight:bold">String</span>.from_ruby(<span style="color:#038;font-weight:bold">self</span>)<tt>
</tt>  str.blank?.to_ruby<tt>
</tt><span style="color:#080;font-weight:bold">rescue</span><tt>
</tt>  <span style="color:#038;font-weight:bold">true</span>.to_ruby<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am receiving a C-Ruby String casted as a pointer (VALUE) then I go through the lib_ruby.cr mappings to get the C-Ruby string data and copy it over into a new instance of Crystal's internal String representation. So at any given time I have 2 copies of the same string, one in the C-Ruby memory space and another in the Crystal memory space.</p>
<p>This happens with all FFI-like extensions but it doesn't happen to the pure C implementation. In Sam Saffrom's C implementation it directly works with the same address in C-Ruby's memory space:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#088;font-weight:bold">static</span> VALUE<tt>
</tt>rb_str_blank(VALUE str)<tt>
</tt>{<tt>
</tt>  rb_encoding *enc;<tt>
</tt>  <span style="color:#074;font-weight:bold">char</span> *s, *e;<tt>
</tt><tt>
</tt>  enc = STR_ENC_GET(str);<tt>
</tt>  s = RSTRING_PTR(str);<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It receives a pointer (direct memory address) and goes. And this is huge advantage for the C version. When you have a big volume of medium to large sized strings being copied over from C-Ruby to Crystal, it adds a noticeable overhead that can't be removed.</p>
<h3>String mapping Caveat</h3>
<p>I still have a problem though. There is one edge case I was not able to overcome yet (help is most welcome). When C-Ruby passes a unicode <code>"\u0000"</code> I am unable to create the same character in Crystal and I end up passing just an empty string ("") which is not the same thing.</p>
<p>The way to deal with it is to receive a Ruby String (VALUE) and get the C-String from it this way:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rb_str = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_str_to_str(str)<tt>
</tt>c_str  = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_string_value_cstr(pointerof(rb_str))<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If the "str" is the "\u0000" (under Ruby 2.2.5 at least) C-Ruby raises a "string contains null bytes" exception. Which is why I rescue from this exception like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">c_str = <span style="color:#036;font-weight:bold">LibRuby</span>.rb_rescue(-&gt;<span style="color:#036;font-weight:bold">String</span>.cr_str_from_rb_cstr, str, -&gt;<span style="color:#036;font-weight:bold">String</span>.return_empty_string, <span style="color:#00D;font-weight:bold">0</span>.to_ruby)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>When an exception is triggered I have to pass the pointer to another function to rescue from it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">return_empty_string</span>(arg : <span style="color:#036;font-weight:bold">LibRuby</span>::<span style="color:#036;font-weight:bold">VALUE</span>)<tt>
</tt>  a = <span style="color:#00D;font-weight:bold">0</span>_u8<tt>
</tt>  pointerof(a)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But this is not correct, I am just passing the pointer to a "0" character, which is "empty". Therefore, specs are not passing correctly:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Failures:<tt>
</tt><tt>
</tt>  1) String provides a parity with active support function<tt>
</tt>     Failure/Error: expect("#{i.to_s(16)} #{c.blank_as?}").to eq("#{i.to_s(16)} #{c.blank2?}")<tt>
</tt><tt>
</tt>       expected: "0 false"<tt>
</tt>            got: "0 true"<tt>
</tt><tt>
</tt>       (compared using ==)<tt>
</tt>     # ./spec/fast_blank_spec.rb:22:in `block (3 levels) in &lt;top (required)&gt;'<tt>
</tt>     # ./spec/fast_blank_spec.rb:19:in `times'<tt>
</tt>     # ./spec/fast_blank_spec.rb:19:in `block (2 levels) in &lt;top (required)&gt;'<tt>
</tt><tt>
</tt>  2) String treats  correctly<tt>
</tt>     Failure/Error: expect("\u0000".blank_as?).to be_falsey<tt>
</tt>       expected: falsey value<tt>
</tt>            got: true<tt>
</tt>     # ./spec/fast_blank_spec.rb:47:in `block (2 levels) in &lt;top (required)&gt;'<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ary gave a simple tip later, I will add it to the conclusion below.</p>
<h3>The Synthetic Benchmarks (careful on how you interpret them!)</h3>
<p>The <a href="https://github.com/rails/rails/blob/2a371368c91789a4d689d6a84eb20b238c37678a/activesupport/lib/active_support/core_ext/object/blank.rb#L101">original Rails ActiveSupport implementation of String#blank?</a> looks like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">String</span><tt>
</tt>  <span style="color:#888"># 0x3000: fullwidth whitespace</span><tt>
</tt>  <span style="color:#036;font-weight:bold">NON_WHITESPACE_REGEXP</span> = <span style="background-color:#fff0ff"><span style="color:#404">%r!</span><span style="color:#808">[^</span><span style="color:#04D">\s</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>[<span style="color:#00D;font-weight:bold">0x3000</span>].pack(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">U</span><span style="color:#710">"</span></span>)<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#808">]</span><span style="color:#404">!</span></span><tt>
</tt><tt>
</tt>  <span style="color:#888"># A string is blank if it's empty or contains whitespaces only:</span><tt>
</tt>  <span style="color:#888">#</span><tt>
</tt>  <span style="color:#888">#   "".blank?                 # =&gt; true</span><tt>
</tt>  <span style="color:#888">#   "   ".blank?              # =&gt; true</span><tt>
</tt>  <span style="color:#888">#   "　".blank?               # =&gt; true</span><tt>
</tt>  <span style="color:#888">#   " something here ".blank? # =&gt; false</span><tt>
</tt>  <span style="color:#888">#</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">blank?</span><tt>
</tt>    <span style="color:#888"># 1.8 does not takes [:space:] properly</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> encoding_aware?<tt>
</tt>      <span style="color:#038;font-weight:bold">self</span> !~ <span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">[^[:space:]]</span><span style="color:#404">/</span></span><tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      <span style="color:#038;font-weight:bold">self</span> !~ <span style="color:#036;font-weight:bold">NON_WHITESPACE_REGEXP</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's mainly a regular expression comparison, which can be a bit slow. Sam's version is a more straight forward loop through the string to compare each character with what's considered "blank". There are many unicode codepoints that are considered blank, some are not, which is why the C and Crystal versions are similar, but they are different from Rails' version.</p>
<p>In the Fast Blank gem there is a <code>benchmark</code> Ruby script to compare the C-extension against Rails' Regex based implementation.</p>
<p>The Regex implementation is called <strong>"Slow Blank"</strong>. It's particularly slow if you pass a real empty String, so in the benchmark Sam added a <strong>"New Slow Blank"</strong> that checks through <code>String#empty?</code> first, and this version is faster in this edge case.</p>
<p>The fast C version is called <strong>"Fast Blank"</strong> but although you can consider ir "correct" it's not compatible with all the edge cases from Rails. So he implemented a <code>String#blank_as?</code> which is compatible with Rails. Sam calls it <strong>"Fast Activesupport"</strong>.</p>
<p>In my Crystal version I did the same, having both <code>String#blank?</code> and <code>String#blank_as?</code>.</p>
<p>So, without further ado, here is the <strong>C Version over OS X</strong> benchmark for empty strings, and we exercise each function many times within a few seconds to have more accurate results (check out Evan Phoenix's <a href="https://github.com/evanphx/benchmark-ips">"benchmark/ips"</a> to understand the "iteration per second" methodology).</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">================== Test String Length: 0 ==================<tt>
</tt>Warming up _______________________________________<tt>
</tt>          Fast Blank   191.708k i/100ms<tt>
</tt>  Fast ActiveSupport   209.628k i/100ms<tt>
</tt>          Slow Blank    61.487k i/100ms<tt>
</tt>      New Slow Blank   203.165k i/100ms<tt>
</tt>Calculating _______________________________________<tt>
</tt>          Fast Blank     20.479M (± 9.3%) i/s -    101.414M in   5.001177s<tt>
</tt>  Fast ActiveSupport     21.883M (± 9.4%) i/s -    108.378M in   5.004350s<tt>
</tt>          Slow Blank      1.060M (± 4.7%) i/s -      5.288M in   5.001365s<tt>
</tt>      New Slow Blank     18.883M (± 6.9%) i/s -     94.065M in   5.008899s<tt>
</tt><tt>
</tt>Comparison:<tt>
</tt>  Fast ActiveSupport: 21882711.5 i/s<tt>
</tt>          Fast Blank: 20478961.5 i/s - same-ish: difference falls within error<tt>
</tt>      New Slow Blank: 18883442.2 i/s - same-ish: difference falls within error<tt>
</tt>          Slow Blank:  1059692.6 i/s - 20.65x slower<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's super fast. Rails' version is 20x slower on my machine.</p>
<p>Now, <strong>Crystal version over OS X</strong></p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">================== Test String Length: 0 ==================<tt>
</tt>Warming up _______________________________________<tt>
</tt>          Fast Blank   174.349k i/100ms<tt>
</tt>  Fast ActiveSupport   174.035k i/100ms<tt>
</tt>          Slow Blank    64.684k i/100ms<tt>
</tt>      New Slow Blank   215.164k i/100ms<tt>
</tt>Calculating _______________________________________<tt>
</tt>          Fast Blank      8.647M (± 1.6%) i/s -     43.239M in   5.001530s<tt>
</tt>  Fast ActiveSupport      8.580M (± 1.3%) i/s -     42.987M in   5.010759s<tt>
</tt>          Slow Blank      1.047M (± 3.7%) i/s -      5.239M in   5.008907s<tt>
</tt>      New Slow Blank     19.090M (± 9.3%) i/s -     94.672M in   5.009057s<tt>
</tt><tt>
</tt>Comparison:<tt>
</tt>      New Slow Blank: 19090034.8 i/s<tt>
</tt>          Fast Blank:  8647459.7 i/s - 2.21x slower<tt>
</tt>  Fast ActiveSupport:  8580487.9 i/s - 2.22x slower<tt>
</tt>          Slow Blank:  1047465.3 i/s - 18.22x slower<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As I explained before, even checking empty strings, the Crystal version is slower than the Ruby check for <code>String#empty?</code> (New Slow Blank) because I have the string copying routine of the Wrapper mappings. This adds overhead that is perceptible over many iterations. It's still 18x faster than Rails, but it loses to C-Ruby.</p>
<p>Finally, <strong> Crystal version over Ubuntu</strong></p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">================== Test String Length: 0 ==================<tt>
</tt>Warming up _______________________________________<tt>
</tt>          Fast Blank   255.883k i/100ms<tt>
</tt>  Fast ActiveSupport   260.915k i/100ms<tt>
</tt>          Slow Blank   105.424k i/100ms<tt>
</tt>      New Slow Blank   284.670k i/100ms<tt>
</tt>Calculating _______________________________________<tt>
</tt>          Fast Blank      8.895M (± 9.8%) i/s -     44.268M in   5.037761s<tt>
</tt>  Fast ActiveSupport      8.647M (± 8.2%) i/s -     43.051M in   5.020125s<tt>
</tt>          Slow Blank      1.736M (± 3.9%) i/s -      8.750M in   5.048253s<tt>
</tt>      New Slow Blank     22.170M (± 6.2%) i/s -    110.452M in   5.004909s<tt>
</tt><tt>
</tt>Comparison:<tt>
</tt>      New Slow Blank: 22170031.0 i/s<tt>
</tt>          Fast Blank:  8895113.3 i/s - 2.49x slower<tt>
</tt>  Fast ActiveSupport:  8646940.8 i/s - 2.56x slower<tt>
</tt>          Slow Blank:  1736071.0 i/s - 12.77x slower<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice that it's around the same ballpark, but the Rails version on Ubuntu runs almost twice as fast compared to its counterpart in OS X, which makes the comparison against the Crystal library go down from 18x to 12x.</p>
<p>The benchmark keeps comparing agains strings of larger and larger sizes, from 6, to 14, to 24, up to 136 characters in length.</p>
<p>Let's get just the last test case of 136 characters. First with <strong>C version on OS X</strong>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">================== Test String Length: 136 ==================<tt>
</tt>Warming up _______________________________________<tt>
</tt>          Fast Blank   177.521k i/100ms<tt>
</tt>  Fast ActiveSupport   193.559k i/100ms<tt>
</tt>          Slow Blank    89.378k i/100ms<tt>
</tt>      New Slow Blank    60.639k i/100ms<tt>
</tt>Calculating _______________________________________<tt>
</tt>          Fast Blank     10.727M (± 8.7%) i/s -     53.256M in   5.006538s<tt>
</tt>  Fast ActiveSupport     11.600M (± 8.3%) i/s -     57.681M in   5.009692s<tt>
</tt>          Slow Blank      1.872M (± 5.7%) i/s -      9.385M in   5.029243s<tt>
</tt>      New Slow Blank      1.017M (± 5.3%) i/s -      5.094M in   5.022994s<tt>
</tt><tt>
</tt>Comparison:<tt>
</tt>  Fast ActiveSupport: 11600112.2 i/s<tt>
</tt>          Fast Blank: 10726792.8 i/s - same-ish: difference falls within error<tt>
</tt>          Slow Blank:  1872262.5 i/s - 6.20x slower<tt>
</tt>      New Slow Blank:  1016926.7 i/s - 11.41x slower<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The C-version is consistently much faster in all test cases and in the 136 characters it's still 11x faster than Rails in pure Ruby.</p>
<p>Now the <strong>Crystal version over OS X</strong>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">================== Test String Length: 136 ==================<tt>
</tt>Warming up _______________________________________<tt>
</tt>          Fast Blank   127.749k i/100ms<tt>
</tt>  Fast ActiveSupport   126.538k i/100ms<tt>
</tt>          Slow Blank    94.390k i/100ms<tt>
</tt>      New Slow Blank    60.594k i/100ms<tt>
</tt>Calculating _______________________________________<tt>
</tt>          Fast Blank      3.283M (± 1.8%) i/s -     16.480M in   5.021364s<tt>
</tt>  Fast ActiveSupport      3.235M (± 1.3%) i/s -     16.197M in   5.008315s<tt>
</tt>          Slow Blank      1.888M (± 4.4%) i/s -      9.439M in   5.009458s<tt>
</tt>      New Slow Blank    967.950k (± 4.7%) i/s -      4.848M in   5.018946s<tt>
</tt><tt>
</tt>Comparison:<tt>
</tt>          Fast Blank:  3283025.1 i/s<tt>
</tt>  Fast ActiveSupport:  3234586.5 i/s - same-ish: difference falls within error<tt>
</tt>          Slow Blank:  1887800.5 i/s - 1.74x slower<tt>
</tt>      New Slow Blank:   967950.2 i/s - 3.39x slower<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's also faster, but just by 2 to 3 times compared to pure Ruby, a far cry from 11x. But my hypothesis is that the mapping and copying of so many string over adds a large overhead that the C version does not have.</p>
<p>And the <strong>Crystal version over OS X</strong>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">================== Test String Length: 136 ==================<tt>
</tt>Warming up _______________________________________<tt>
</tt>          Fast Blank   186.810k i/100ms<tt>
</tt>  Fast ActiveSupport   187.306k i/100ms<tt>
</tt>          Slow Blank   143.439k i/100ms<tt>
</tt>      New Slow Blank    98.308k i/100ms<tt>
</tt>Calculating _______________________________________<tt>
</tt>          Fast Blank      3.517M (± 3.9%) i/s -     17.560M in   5.000791s<tt>
</tt>  Fast ActiveSupport      3.485M (± 3.8%) i/s -     17.419M in   5.006427s<tt>
</tt>          Slow Blank      2.755M (± 4.2%) i/s -     13.770M in   5.008490s<tt>
</tt>      New Slow Blank      1.551M (± 4.3%) i/s -      7.766M in   5.017853s<tt>
</tt><tt>
</tt>Comparison:<tt>
</tt>          Fast Blank:  3516960.7 i/s<tt>
</tt>  Fast ActiveSupport:  3484575.5 i/s - same-ish: difference falls within error<tt>
</tt>          Slow Blank:  2754669.0 i/s - 1.28x slower<tt>
</tt>      New Slow Blank:  1550815.2 i/s - 2.27x slower<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, the Ubuntu versions of both Crystal library but also the Ruby binary runs faster and the comparison shows no more than twice as much faster. And the pure Ruby's <code>String#empty?</code> is in the same ballpark as Crystal's version.</p>
<h3>Conclusion</h3>
<p>The most obvious conclusion is that I probably did a mistake in choosing Fast Blank as my first proof of concept. The algorithm is too trivial and a simple check for <code>String#empty?</code> in pure Ruby is orders of magnitude faster than the added overhead of mapping and string copying to Crystal.</p>
<p>Also, any use case where you have a huge amount of small bits of data being transferred from C-Ruby to Crystal or any FFI-based extension will have the overhead of data copying, which a pure C-version will not have. Which is why Fast Blank is better done in C.</p>
<p>Any other use case where you have less amounts of data, or data that can be transferred in bulk (less calls from C-Ruby to the extension, with arguments with a larger size, and with more costly processing) are better candidates to benefit from extensions.</p>
<p>Again, not everything gets automatically faster, we always have to figure out the use case scenarios first. But because it's so much easier to write in Crystal and benchmark, we can make faster proofs of concepts and scrap the idea if the measurements prove that we won't benefit as much.</p>
<p>The Crystal documentation recently received a <a href="https://crystal-lang.org/docs/guides/performance.html">"Performance Guide"</a>. It's very useful for you to avoid common pitfalls that harms overall performance. Even though LLVM is quite competent in heavy optimization, it can't do everything. So read it through to improve your general Crystal skills.</p>
<p>That being said, I still believe that this exercise was well worth it. I will probabaly do some more. I'd really want to thank Ary (Crystal creator) and Paul Hoffer for the patience in helping me out through many of quircks I found along the way.</p>
<p>While I was finishing this post, <a href="https://github.com/SamSaffron/fast_blank/pull/20#issuecomment-230875300">Ary pointed out</a> that I could probably ditch Strings altogether and work directly with an array of bytes, which is a good idea and I will probably try that. I think I made it clear by now that the whole String copying adds a very perceptible overhead as we saw in the benchmarks above. Let me know if someone is interested in contributing as well. With a few more tweaks I believe we can have a Crystal version that can at least compete against the C version while also being more readable and maintainable for most Rubyists, which is my goal.</p>
<p>I hope the codes I published here will serve as boilerplate examples for more Crystal-based Ruby extensions in the future!</p>
<p></p>
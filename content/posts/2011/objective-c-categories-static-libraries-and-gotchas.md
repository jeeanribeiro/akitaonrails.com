---
title: "[Objective-C] Categories, Static Libraries and Gotchas"
date: "2011-04-24T02:44:00.000Z"
tags: ["beginner", "apple", "objective-c", "english"]
years: "2011"
---

<p></p>
<p>As some of you may know, I have this small pet project called <a href="https://github.com/akitaonrails/ObjC_Rubyfication">ObjC Rubyfication</a>, a personal exercise in writing some Ruby-like syntax within Objective-C. Most of this project uses the fact that we can reopen Objective-C standard classes – very much like Ruby, unlike Java – and insert our own code – through <a href="http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjectiveC/Chapters/ocCategories.html%23//apple_ref/doc/uid/TP30001163-CH20">Categories</a>, similar to Ruby’s modules.</p>
<p>The idea of this pet project is to be a Static Library that I can easily add to any other project and have all of its features. In this article I’d like to present how I am organizing its many subprojects within one project (and I am accepting any suggestions and tips to make it better as I am just learning how to organize things within Obj-C projects) and talk about a gotcha that took me hours to figure out and might help someone else.</p>
<p></p>
<p></p>
<p>To make this exercise even more fun, I also added a separated target for my unit testing suite (and see how XCode supports tests), then another target for the <a href="https://kiwi-lib.info/">Kiwi</a> <span class="caps">BDD</span> testing framework for Obj-C, and another one for <a href="https://limechat.net/cocoaoniguruma/">CocoaOniguruma</a> as I have just explained in my <a href="https://www.akitaonrails.com/2011/04/23/objective-c-it's-a-unix-system-i-know-this">previous article</a>.</p>
<p>I’ve been playing with ways of reorganizing my project and I realized that I was doing it wrong. I was adding all the source files from my “Rubyfication” target into my Specs target. So everything was compiling fine, the specs were all passing, but the way I defined dependencies was wrong. It is kind of complicated to understand at first, but it should be something like this:</p>
<ul>
  <li>CocoaOniguruma Target: should be a static library, with no target dependencies and no binary libraries to link against, just a dependency to the standard Foundation framework. It exposes the OnigRegexp.h, OnigRegexpUtility.h and oniguruma.h as public headers.</li>
  <li>Kiwi Target: should be another static library, with no target dependencies and no binary libraries to link against, just having the Foundation and UIKit framework dependencies.</li>
  <li>Rubyfication: should be another static library, with CocoaOniguruma as a target dependency, linking against the libCocoaOniguruma.a binary and depending on the Foundation framework as well. It exposes all of its <tt>.h</tt> files as public headers.</li>
  <li>RubyficationTests: should be a Bundle which were created together with the Rubyfication target (you can specify whether you want a unit test target when you create new targets), with both Kiwi and Rubyfication targets as dependencies, linking against the libKiwi.a and libRubyfication.a binaries, and the Foundation and UIKit frameworks as well.</li>
</ul>
<p>If you keep creating new targets manually, XCode 4 will also create a bunch of Schemes that you don’t really need. I keep mine clean with just the Rubyfication scheme. You can access the “Product” menu and the “Edit Scheme” option. Then my Scheme looks like this:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2011.26.25%20PM_original.png?1303611943" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2011.26.25%20PM_original.png?1303611943 2x" alt=""></p>
<p>I usually configure all my build settings to use “<span class="caps">LLVM</span> Compiler 2.0” for the Debug settings and “<span class="caps">LLVM</span> <span class="caps">GCC</span> 4.2” for the Release settings (actually, I do that for precaution as I am not aware if people are actually deploying binaries in production compiled from <span class="caps">LLVM</span>).</p>
<p>I also set the <tt>“Targeted Device Family”</tt> to “iPhone/iPad” and I try to make the <tt>“iOS Deployment Target”</tt> to “iOS 3.0” whenever possible. People usually leave the default one which will be the latest release – now at 4.3. Be aware that your project may not run on older devices that way.</p>
<p>Finally I also make sure that the <tt>“Framework Search Paths”</tt> are pointing to these options:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>"$(SDKROOT)/Developer/Library/Frameworks"
"${DEVELOPER_LIBRARY_DIR}/Frameworks"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Everything compiles just fine that way. Then I can press “Command-U” (or go to the “Product” menu, “Test” option) to build the “RubyficationTests” target. It builds all the target dependencies, links everything together and runs the final script to execute the tests (you must make sure that you are selecting the “Rubyfication – iPhone 4.3 Simulator” in the Scheme Menu). It will fire up the Simulator so it can run the specs.</p>
<p>But then I was receiving:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
</pre>
      </td>
      <td class="code"><pre>Test Suite '/Users/akitaonrails/Library/Developer/Xcode/DerivedData/Rubyfication-gfqxbgyxicfpxugauehktilpmwzv/Build/Products/Debug-iphonesimulator/RubyficationTests.octest(Tests)' started at 2011-04-24 02:16:27 +0000
Test Suite 'CollectionSpec' started at 2011-04-24 02:16:27 +0000
Test Case '-[CollectionSpec runSpec]' started.
2011-04-23 23:16:27.506 otest[40298:903] -[__NSArrayI each:]: unrecognized selector sent to instance 0xe51a30
2011-04-23 23:16:27.508 otest[40298:903] *** Terminating app due to uncaught exception 'NSInvalidArgumentException', reason: '-[__NSArrayI each:]: unrecognized selector sent to instance 0xe51a30'
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It says that an instance of <tt>NSArray</tt> is not recognizing the selector <tt>each:</tt> sent to it in the <tt>CollectionSpec</tt> file. It is probably this snippet:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
<a href="#n8" name="n8">8</a>
<a href="#n9" name="n9">9</a>
<strong><a href="#n10" name="n10">10</a></strong>
<a href="#n11" name="n11">11</a>
<a href="#n12" name="n12">12</a>
<a href="#n13" name="n13">13</a>
<a href="#n14" name="n14">14</a>
<a href="#n15" name="n15">15</a>
<a href="#n16" name="n16">16</a>
<a href="#n17" name="n17">17</a>
<a href="#n18" name="n18">18</a>
<a href="#n19" name="n19">19</a>
<strong><a href="#n20" name="n20">20</a></strong>
<a href="#n21" name="n21">21</a>
<a href="#n22" name="n22">22</a>
<a href="#n23" name="n23">23</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Kiwi.h</span><span style="color:#710">"</span></span>
<span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">NSArray+functional.h</span><span style="color:#710">"</span></span>
<span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">NSArray+helpers.h</span><span style="color:#710">"</span></span>
<span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">NSArray+activesupport.h</span><span style="color:#710">"</span></span>
SPEC_BEGIN(CollectionSpec)
describe(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">NSArray</span><span style="color:#710">"</span></span>, ^{
  __block NSArray* list = nil;
  context(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Functional</span><span style="color:#710">"</span></span>, ^{
      beforeEach(^{
          list = [NSArray arrayWithObjects:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a</span><span style="color:#710">"</span></span>, <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">b</span><span style="color:#710">"</span></span>, <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">c</span><span style="color:#710">"</span></span>, nil];
      });
      it(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should iterate sequentially through the entire collection of items</span><span style="color:#710">"</span></span>, ^{
          NSMutableArray* output = [[NSMutableArray alloc] init];
          [list each:^(id item) {
              [output addObject:item];
          }];
          [[theValue([output count]) should] equal:theValue([list count])];
      });
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reference: <a href="https://github.com/akitaonrails/ObjC_Rubyfication/blob/master/RubyficationTests/CollectionSpec.m#L1-22">CollectionSpec.m</a></p>
<p>Notice that at Line 3 there is the correct import statement where the <tt>NSArray(Helpers)</tt> category is defined with the correct <tt>each:</tt> method declared. The error is happening at the spec in line 18 in the above snippet.</p>
<p>Now, this was not a compile time error, it was a runtime error. So the import statement is finding the correct file and compiling but something in the linking phase is not going correctly and at runtime the <tt>NSArray(Helpers)</tt> category, and probably other categories, are not available.</p>
<p>It took me a few hours of research but I finally figured out one simple flag that changed everything, the <a href="https://developer.apple.com/library/mac/#qa/qa1490/_index.html">-all_load</a> linker flag. As the documentation states:</p>
<blockquote>
  <p><strong>Important:</strong> For 64-bit and iPhone OS applications, there is a linker bug that prevents <tt>-ObjC</tt> from loading objects files from static libraries that contain only categories and no classes. The workaround is to use the <tt>-all_load</tt> or <tt>-force_load</tt> flags.</p>
  <p><tt>-all_load</tt> forces the linker to load all object files from every archive it sees, even those without Objective-C code. <tt>-force_load</tt> is available in Xcode 3.2 and later. It allows finer grain control of archive loading. Each <tt>-force_load</tt> option must be followed by a path to an archive, and every object file in that archive will be loaded.</p>
</blockquote>
<p>So every target that depends on external static libraries that loads Categories has to add this <tt>-all_load</tt> flag in the “Other Linker Flags”, under the “Linking” category on the “Build Settings” of the target, like this:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2011.41.27%20PM_original.png?1303613619" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2011.41.27%20PM_original.png?1303613619 2x" alt=""></p>
<p>So both my <tt>RubyficationTests</tt> and <tt>Rubyfication</tt> targets had to receive this new flag. And not the Tests all pass flawlessly!</p>
<p></p>
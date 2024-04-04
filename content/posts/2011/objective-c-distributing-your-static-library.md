---
title: "[Objective-C] Distributing your Static Library"
date: "2011-04-24T03:46:00.000Z"
tags: ["beginner", "apple", "objective-c", "english"]
years: "2011"
---

<p></p>
<p>If you didn’t read my <a href="http://www.akitaonrails.com/2011/04/23/objective-c-it's-a-unix-system-i-know-this">last</a> <a href="http://www.akitaonrails.com/2011/04/23/objective-c-categories-static-libraries-and-gotchas">two article</a> I recommend you do so before going any further because I am using the same pet project, <a href="http://www.akitaonrails.com/2011/04/23/objective-c-it's-a-unix-system-i-know-this">ObjC Rubyfication</a> as an example for this article. The point is: you are writing reusable code that you want in more than one project.</p>
<p>Most of this was based on <a href="http://www.cocoanetics.com/2010/04/universal-static-libraries/">Cocoanetics</a> article about universal static libraries. So, if you’ve payed attention to my <a href="http://www.akitaonrails.com/2011/04/23/objective-c-categories-static-libraries-and-gotchas">previous article</a>, you saw this screenshot:</p>
<p style="text-align: center"><img src="http://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2011.41.27%20PM_original.png?1303613619" srcset="http://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2011.41.27%20PM_original.png?1303613619 2x" alt=""></p>
<p></p>
<p></p>
<p>I said that I only had these targets configured: CocoaOniguruma, Kiwi, Rubyfication and RubyficationTests. But there are 3 others: CocoaOniguruma <span class="caps">SIM</span>, Rubyfication <span class="caps">SIM</span>, and Build &amp; Merge Libraries. The reason is simple:</p>
<ul>
  <li>The “CocoaOniguruma” Target builds the <tt>libCocoaOniguruma.a</tt> binary that’s compatible with the <span class="caps">ARM</span> processor for iOS</li>
  <li>The “CocoaOniguruma <span class="caps">SIM</span>” Target builds the <tt>libCocoaOnigurumaSimulator.a</tt> binary that’s compatible with the i386 processor for the local iPhone Simulator</li>
  <li>The “Rubyfication” Target builds the <tt>libRubyfication.a</tt> binary that’s compatible with the <span class="caps">ARM</span> processor for iOS</li>
  <li>The “Rubyfication <span class="caps">SIM</span>” Target builds the <tt>libRubyficationSimulator.a</tt> binary that’s compatible with the i386 processor for the local iPhone Simulator</li>
  <li>The “Build &amp; Merge Libraries” Target merges the corresponding particular binaries of each target into a single Universal (Fat) Binary that we can easily distribute and reuse.</li>
</ul>
<h2>Concepts and History</h2>
<p>Some explanation is in order. When you’re developing iOS applications, you can test it directly in your iPhone device or within the Simulator. Now, Apple was very clever: any other vendor in the market will try to first create an <span class="caps">ARM</span> processor emulator to run on top of your i386 processor. Then it will get all the binaries for <span class="caps">ARM</span> and run within this emulator. The OS itself will remain compiled for <span class="caps">ARM</span> processors and run within the emulator.</p>
<p>Now, this is dead slow, impractical. Anyone that experimented an emulation environment like this knows how ridiculous it is. Don’t confuse it for VMWare or Parallels solutions, which are fast because they are an emulated environment for <strong>the same processor</strong>, so you can run Windows on top of your Mac because the processors and operating systems now support VT-x, which means you mostly don’t have to emulate the processor. Now, every smartphone and tablet on the market uses an <span class="caps">ARM</span> processor, which has nothing to do with i386.</p>
<p>So, how did Apple delivered a super-fast iPhone/iPad emulator that runs at real-time speed on your Mac? Simple, it didn’t. It is called “Simulator” and not “Emulator” for a reason: everything that runs within the Simulator is compiled for i386, not for <span class="caps">ARM</span>. So what you’re running is an actual binary that runs natively over your Mac! No emulation required. The iOS is very portable. The same way Mac OS X was able to transition from the Power PC to Intel back in 2005, the iOS can do the same trick as they are basically the very same operating system.</p>
<p>When you choose the iPhone scheme in XCode, it compiles for <span class="caps">ARM</span> and uploads the bits to your iPhone device to run the application. When you choose the Simulator scheme in XCode, it compiles for i386, upload the bits in your Simulator and runs natively as any other application in your Mac.</p>
<p>Now, going back to the main issue: when I distribute a binary of my Static Library, I have to remember that the developer will be linking against my library to deploy for both the <span class="caps">ARM</span> device (iPhone/iPad) and the Simulator (i386). So I would have to deliver at least 2 binary files. But Apple is even smarter than that. Actually, NeXT was. When they first transitioned the NeXTStep operating system from Motorola to Intel processors back in the late 80’s, they created <a href="https://en.wikipedia.org/wiki/Fat_binary">Fat Binaries</a>, which is essentially one binary that contains both processor-specific bits in one single package. When Apple transitione from the Power PC to Intel they renamed it to <a href="https://en.wikipedia.org/wiki/Universal_binary">Universal Binaries</a>. And that’s essentially what we need to build now.</p>
<h2>Operations</h2>
<p>We now understand what a Universal Binary is. To make it easier, I right-clicked over the “Rubyfication” and “CocoaOniguruma” targets and duplicated them. They will be created as “Rubyfication copy” and “CocoaOniguruma copy”. We can change the “Product Name” in the build settings of each for a more reasonable name:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.21.02%20AM_original.png?1303615270" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.21.02%20AM_original.png?1303615270 2x" alt=""></p>
<p>In my case I renamed them to “RubyficationSimulator” and “CocoaOnigurumaSimulator”. That will give me both “libRubyficationSimulator.a” and “libCocoaOnigurumaSimulator.a”. As you can see in the Products group:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.23.16%20AM_original.png?1303615348" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.23.16%20AM_original.png?1303615348 2x" alt=""></p>
<p><strong>Important:</strong> remember that the Rubyfication target had CocoaOniguruma as a target dependency. You will need to change the “Rubyfication <span class="caps">SIM</span>” target to point to the new “CocoaOniguruma <span class="caps">SIM</span>” target! The other thing is that you will need to force both new targets to compile to “Latest Mac OS X” in the <tt>“Base <span class="caps">SDK</span>”</tt> option in the Build Settings of each, and “32-bit Intel” in the <tt>“Architectures”</tt> build option. This will make them compile for i386 processors. The original targets should have their <tt>“Base <span class="caps">SDK</span>”</tt> to “Latest iOS” and <tt>“Architectures”</tt> to “Standard (armv6 armv7)”.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.54.21%20AM_original.png?1303617223" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.54.21%20AM_original.png?1303617223 2x" alt=""></p>
<p>Now, we need to create a new target of the kind “Aggregate” :</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.24.00%20AM_original.png?1303615407" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.24.00%20AM_original.png?1303615407 2x" alt=""></p>
<p>I named it “Build &amp; Merge Libraries”. In the “Build Phases” tab you will start with just the “Target Dependencies” phase. You just need to add the new “Rubyfication <span class="caps">SIM</span>” and “CocoaOniguruma <span class="caps">SIM</span>” targets. Then you need to add 3 more phases, one for “Run Script”, another to “Copy Files” and a last “Run Script”.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.25.13%20AM_original.png?1303615678" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.25.13%20AM_original.png?1303615678 2x" alt=""></p>
<p>In the “Copy Files” phase I have just added all the public headers that I want to distribute together with the universal binary library. This is because the other developers will need to add those header files into their projects in order to be able to compile against my library. Now notice that I am copying them to an “Absolute Path” that states <tt>${TARGET_BUILD_DIR}/../Rubyfication</tt>.</p>
<p>That’s where we come to the previous “Run Script” phase that should have the following code:</p>
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
      <td class="code"><pre># make a new output folder
mkdir -p ${TARGET_BUILD_DIR}/../Rubyfication
# combine lib files for various platforms into one
lipo -create "${TARGET_BUILD_DIR}/../Debug-iphoneos/libRubyfication.a" "${TARGET_BUILD_DIR}/../Debug-iphonesimulator/libRubyfication.a" -output "${TARGET_BUILD_DIR}/../Rubyfication/libRubyfication-${BUILD_STYLE}.a"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The first thing it does it create this new “Rubyfication” directory. The second command uses the <a href="https://developer.apple.com/library/mac/#documentation/Darwin/Reference/ManPages/man1/lipo.1.html">lipo</a> command that merges 2 processor-dependent binaries into a universal binary. Pay attention to the PATHs if you’re reusing this script somewhere else. At least with XCode 4 that’s where it creates the binaries of each target:</p>
<ul>
  <li>${TARGET_BUILD_DIR}/../Debug-iphoneos/libRubyfication.a – the <span class="caps">ARM</span> version</li>
  <li>${TARGET_BUILD_DIR}/../Debug-iphonesimulator/libRubyfication.a – the i386 version</li>
  <li>${TARGET_BUILD_DIR}/../Rubyfication/libRubyfication-Debug.a – the resulting universal binary we created</li>
</ul>
<p>Finally, the last “Run Script”, after the “Copy Files” phase described above, requires the following script:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>ditto -c -k --keepParent "${TARGET_BUILD_DIR}/../Rubyfication" "${TARGET_BUILD_DIR}/../Rubyfication.zip"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It just creates a <span class="caps">ZIP</span> file with the universal binary library and its companion public header files. Any other developer can get this zip file, unzip it and add the files to their own projects now. If you want to find where this <span class="caps">ZIP</span> file is, the easiest way is to go to the project viewer (the left side pane) in XCode, open the “Products” group, right-click over the “libRubyfication.a” file (or any other resulting file) and choose “Show in Finder”. Then you can navigate one folder up in the hierarchy (to the “Products” folder) and you will see something like this:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.39.02%20AM_original.png?1303616300" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.39.02%20AM_original.png?1303616300 2x" alt=""></p>
<p>And there you go: there’s your <span class="caps">ZIP</span> file with your brand new redistributable universal binary!</p>
<h2>Using the Universal Binary</h2>
<p>In order to demonstrate how to use this distributable <span class="caps">ZIP</span> file. I have created a very simple, bare-bone iOS project called <a href="https://github.com/akitaonrails/ObjC_OnigurumaDemo">ObjC_OnigurumaDemo</a> that you can download from Github and run in your own iOS device.</p>
<p>As you can see in the screenshot below, I just unzipped the <span class="caps">ZIP</span> within a “Dependencies” folder in my iOS project and added the universal binary “libRubyfication-Debug.a” within the Library Linking Build Phase:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.42.09%20AM_original.png?1303616506" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.42.09%20AM_original.png?1303616506 2x" alt=""></p>
<p>This allows me to just use anything from this library in my project, in particular a piece of code that uses the Oniguruma regular expressions:</p>
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
</pre>
      </td>
      <td class="code"><pre>- (IBAction)runRegex:(id)sender {
    OnigRegexp* regex = [OnigRegexp compile:[regexPattern text]];
    OnigResult* res = [regex match:[initialText text]];
    NSMutableString* tmpResult = [NSMutableString stringWithString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>];
    <span style="color:#080;font-weight:bold">for</span>(<span style="color:#0a5;font-weight:bold">int</span> i = <span style="color:#00D">0</span>; i &lt; [res count]; i++) {
        [tmpResult appendString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">(</span><span style="color:#710">"</span></span>];
        [tmpResult appendString:[res stringAt:i]];
        [tmpResult appendString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span><span style="color:#710">"</span></span>];
    }
    [result setText:tmpResult];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This demonstration application has a text-field called “initialText”, where you can type any string. Then you can prepare a Regular Expression in the “regexPattern” text-field and when you hit the “Run” button, it will trigget the action above that will run the Regular Expression againt the initial text and write the matches within parenthesis in the “result” text view. The applications looks like this:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.46.19%20AM_original.png?1303616748" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/24/Screen%20shot%202011-04-24%20at%2012.46.19%20AM_original.png?1303616748 2x" alt=""></p>
<p>And, <em>voilá</em>! Ruby 1.9-like Regular Expression, directly from Oniguruma, within an iOS Application!</p>
<p></p>
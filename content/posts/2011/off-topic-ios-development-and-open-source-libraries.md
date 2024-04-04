---
title: "[Off-Topic] iOS Development and Open Source Libraries"
date: "2011-03-26T18:59:00.000Z"
tags: ["beginner", "apple", "objective-c", "english"]
years: "2011"
---

<p></p>
<p>I’ve been following the evolution of iOS development and I have to say that is becoming increasingly easier to assemble a quality application these days. Apple just released iOS 4.3.1 and Xcode 4.0.1. Great releases, and the new Xcode is a great step forward. I think this is the first big <span class="caps">IDE</span> to fully support Git as a first class citizen in the development workflow. Every serious <span class="caps">IDE</span> should do it and any serious developer should be comfortable with Git by now.</p>
<p>The new <span class="caps">LLVM</span> Compiler 2.0 is very impressive, it helps a lot in making memory leak free applications. By the way, I don’t buy the <em>“it is too difficult doing memory management”</em>, this is just saying <em>“I’m too lazy and cheap”</em>. Come on, there are thousands of quality apps both for OS X and iOS. Memory management is a little bit more difficult than having a full features generational garbage collector, but it’s nowhere near as difficult as some people claim it to be. Any reasonable developer should be able to accomplish this with minimum effort.</p>
<p>And to help even more, the community has been releasing more and more great libraries that further increase productivity. Let me list a few of my favorites:</p>
<p></p>
<p></p>
<ul>
  <li><a href="https://www.flurry.com/">Flurry</a> – it is the equivalent of Google Analytics for iOS. Everything is trackable nowadays and information such as who’s using your app, how they are using it, what are the most used and least used features, in what regions, are all important. You can use this data to further refine your app and make it even greater. It gives you SDK’s for Java ME, Blackberry, Android, Windows Phone and iOS. You have to sign up to have access to the libraries. You will register your application, and that will give it a unique application key that you have to hard code into your app and that’s it. It is literally as easy as doing:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
</pre>
      </td>
      <td class="code"><pre>#import "FlurryAPI.h"
...
- (void) applicationDidFinishLaunching:(NSNotification*) notice {
  [FlurryAPI startSession:@"your_unique_app_key"];
  ...
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And there are several other methods for you to count certain events in your app, to log page views, to log exceptions and errors, and even location. Definitely mandatory for every app.</p>
<ul>
  <li><a href="https://allseeing-i.com/ASIHTTPRequest/">ASIHTTPRequest</a> – most apps these days integrate with some web based back-end. Twitter, Facebook, LinkedIn, everything logs in into some cloud service out there to grab information and collaborate. Cocoa Touch as a rich set of networking capabilities but they are lower level than most would like it to be. It is boring to make connections in the background, track it’s success or error, trigger events and loading cues for the user and so on. Enter ASIHTTPRequest, it makes it strikingly easy to make reliable connections to any web endpoint. The documentation is good enough and the code is even easier:</li>
</ul>
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
      <td class="code"><pre>- (IBAction)grabURLInTheBackground:(id)sender
{
   if (![self queue]) {
      [self setQueue:[[[NSOperationQueue alloc] init] autorelease]];
   }
   NSURL *url = [NSURL URLWithString:@"https://allseeing-i.com"];
   ASIHTTPRequest *request = [ASIHTTPRequest requestWithURL:url];
   [request setDelegate:self];
   [request setDidFinishSelector:@selector(requestDone:)];
   [request setDidFailSelector:@selector(requestWentWrong:)];
   [[self queue] addOperation:request]; //queue is an NSOperationQueue
}
- (void)requestDone:(ASIHTTPRequest *)request
{
   NSString *response = [request responseString];
}
- (void)requestWentWrong:(ASIHTTPRequest *)request
{
   NSError *error = [request error];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This library creates network queues and you can trigger as many connection requests as you want and it will manage the queue for you in the background. There are use case example in the <a href="https://allseeing-i.com/ASIHTTPRequest/How-to-use">documentation</a>. With this library there is no need to use the low level base classes and you should delegate all <span class="caps">HTTP</span> requests to this library. Highly recommended.</p>
<ul>
  <li><a href="https://github.com/TouchCode/TouchJSON">TouchJSON</a> – if you are consuming online <span class="caps">HTTP</span> data, you will probably receive a <span class="caps">JSON</span> formatted payload (another trend these days). Now you have to parse it into meaningful Objective-C objects. It helps a lot that Objective-C is very dynamic and flexible in its type system so you are able to easily convert anything. It is a very boring process, though, so this library will help a lot. You will want to use ASIHTTPRequest to handle connecting to the server and once it returns, you can parse the response blob like this:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
</pre>
      </td>
      <td class="code"><pre>- (void)requestDone:(ASIHTTPRequest *)request
{
   NSString *response = [request responseString];
   NSError *theError = NULL;
   NSDictionary *theDictionary = [NSDictionary dictionaryWithJSONString:response error:&amp;theError];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Super easy. It supports deserializing a <span class="caps">JSON</span> string into a graph of Objective-C objects and it also supports the way back to convert objects into a <span class="caps">JSON</span> representation so you can <span class="caps">POST</span> it somewhere or just record it into a local file.</p>
<ul>
  <li><a href="https://www.getsharekit.com/">ShareKit</a> – it is a trend that every application content should shared. Whenever your user share something with his friends, it makes your app more well known, and is great marketing. You definitely want to make your app able to share content through email, Twitter, Facebook and other social networks. The <a href="https://www.getsharekit.com/docs/">documentation</a> is good, the views are all customizable, and it takes responsability for all the boring details of logging in each online service and making connections and everything. And it is extensible, making it easy to add any new online service that comes up in the future. To add it into your app, follow the <a href="https://www.getsharekit.com/install/">installation instructions</a>, but in the end it comes down to you adding a UIBarButtonItem like this:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>[[UIBarButtonItem alloc] initWithBarButtonSystemItem:UIBarButtonSystemItemAction
 target:self
 action:@selector(share)]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And adding the event handler code:</p>
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
</pre>
      </td>
      <td class="code"><pre>- (void)myButtonHandlerAction
{
        // Create the item to share (in this example, a url)
        NSURL *url = [NSURL URLWithString:@"https://getsharekit.com"];
        SHKItem *item = [SHKItem URL:url title:@"ShareKit is Awesome!"];
        // Get the ShareKit action sheet
        SHKActionSheet *actionSheet = [SHKActionSheet actionSheetForItem:item];
        // Display the action sheet
        [actionSheet showFromToolbar:navigationController.toolbar];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Can’t get easier than that.</p>
<ul>
  <li><a href="https://code.google.com/p/simple-iphone-image-processing/">simple-iphone-image-processing</a> – another very important feature is to deal with images. Every new smartphone has a camera these days and it is important to leverage this capability. But just taking pictures and recording its image file is not enough. You will want to further process the image to take out meaningful information. Want to be inspired? Take a look at this <a href="https://www.youtube.com/watch?v=oImMJ6p6mKE">Sudoku application demo</a> that uses this image processing library and you will understand what I mean. You can take a picture from any sudoku game printed in the newspaper, for example, and the application will parse the image, detect the information, and create a fully functional digital representation that can now be solved through well known algorithms. How cool is that? Now, problem is that this library is very old (last commit from 2009), so I am not sure how well it behaves in current iOS releases, and the documentation is close to none, so you will have to dig through its source code. I didn’t try it myself, I’m just adding it here as a note for myself to make further experiments.</li>
</ul>
<ul>
  <li><a href="https://cocos2d.org/">cocos2d</a> – now, making simple list based applications is boring. You should consider adding a little bit of animation and interactivity into your app. You can use Apple’s standard Core Graphics and Core Animation APIs or you can go craze with cocos2d. It is an OpenGL accelerated 2D <span class="caps">API</span> so you can easily create great effects. You will have cross platform wrappers so you can leverage this knowledge in many platforms. There are several tutorials in the internet such as <a href="https://maniacdev.com/2011/02/tool-easily-gather-data-for-box2d-and-generate-cocos2d-code/">this</a>, and <a href="https://maniacdev.com/2011/02/cross-platform-cocos2d-game-engine-using-cpp/">this</a> and <a href="https://bit.ly/eKHOqw">more</a>. Definitely worth studying.</li>
</ul>
<ul>
  <li><a href="https://www.iphonear.org/">iPhone AR Kit</a> – this is still now entirely mature yet – I guess – but many applications are using it and this should evolve fast in the future. The idea is to turn on the camera, process the image frames and add 2d or 3d animation on top of it, making the digital objects sort of “interact” with the real time captured background. If you use the device’s movement sensors (compass, gyroscope, accelerometer, etc) you can make really impressive applications. Definitely study this.</li>
</ul>
<ul>
  <li><a href="https://github.com/allending/Kiwi">Kiwi</a> and <a href="https://gabriel.github.com/gh-unit/_installing.html">Gh-Unit</a> – unfortunatelly testing is not something well understood and practiced in the Objective-C community. Many rubyists that are also developing in Objective-C are trying to adopt the same practices we take for granted in the Ruby community so I hope this helps. Cocoa and Xcode do come with basic unit testing tools such as SentestingKit. There is close to zero documentation about this subject, you can look at Apple’s official <a href="https://developer.apple.com/library/ios/#documentation/Xcode/Conceptual/iphone_development/135-Unit_Testing_Applications/unit_testing_applications.html%23//apple_ref/doc/uid/TP40007959-CH20-SW9">logic testing</a> article and this other <a href="https://www.grokkingcocoa.com/how_to_debug_iphone_unit_te.html">blog post</a> about it. The default tools are a bit basic though, so you will want to check out other testing frameworks such as Gh-Unit and Kiwi. In particular, Kiwi looks very impressive trying to follow a RSpec-like syntax:</li>
</ul>
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
</pre>
      </td>
      <td class="code"><pre>describe(@"Team", ^{
    context(@"when newly created", ^{
        it(@"should have a name", ^{
            id team = [Team team];
            [[team.name should] equal:@"Black Hawks"];
        });
        it(@"should have 11 players", ^{
            id team = [Team team];
            [[[team should] have:11] players];
        });
    });
});
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Both are definitely worth checking out. And we should strive to add more technology and techniques for testing in Objective-C development. We did in the Ruby-land, there’s no reason we can’t do the same in Objective-C.</p>
<p>And this is it for now. There are many more great libraries and tools available and iOS is evolving fast, so this is all very exciting to follow and practice. I hope to be able to contribute back as soon as possible.</p>
<p></p>
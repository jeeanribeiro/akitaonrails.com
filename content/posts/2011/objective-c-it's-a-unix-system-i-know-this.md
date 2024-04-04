---
title: "[Objective-C] It's a Unix System! I know this!"
date: "2011-04-24T01:47:00.000Z"
tags: ["beginner", "apple", "objective-c", "english"]
years: "2011"
---

<p></p>
<p>While experimenting with ways of using Objective-C a little bit closer to how I code Ruby, there were two things that annoyed me a bit. First, Date Formatting and, second, Regular Expressions.</p>
<p>The Cocoa framework has both implemented as <a href="http://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/DataFormatting/Articles/dfDateFormatting10_4.html%23//apple_ref/doc/uid/TP40002369-SW1">NSDateFormatter</a> and <a href="http://developer.apple.com/library/iOS/#documentation/Foundation/Reference/NSRegularExpression_Class/Reference/Reference.html">NSRegularExpression</a> that also happen to be available for iOS development.</p>
<p>You can format dates like this:</p>
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
</pre>
      </td>
      <td class="code"><pre>NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
[dateFormatter setDateStyle:NSDateFormatterMediumStyle];
[dateFormatter setTimeStyle:NSDateFormatterNoStyle];
NSDate *date = [NSDate dateWithTimeIntervalSinceReferenceDate:<span style="color:#00D">162000</span>];
NSString *formattedDateString = [dateFormatter stringFromDate:date];
NSLog(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">formattedDateString: %@</span><span style="color:#710">"</span></span>, formattedDateString);
<span style="color:#777">// Output for locale en_US: "formattedDateString: Jan 2, 2001"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you can use Regular Expressions like this:</p>
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
</pre>
      </td>
      <td class="code"><pre>NSError *error = <span style="color:#069">NULL</span>;
NSRegularExpression *regex = [NSRegularExpression regularExpressionWithPattern:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\\</span><span style="color:#D20">b(a|b)(c|d)</span><span style="color:#b0b">\\</span><span style="color:#D20">b</span><span style="color:#710">"</span></span> 
                                                                       options:NSRegularExpressionCaseInsensitive
                                                                         error:&amp;error];
NSUInteger numberOfMatches = [regex numberOfMatchesInString:string
                                                    options:<span style="color:#00D">0</span>
                                                      range:NSMakeRange(<span style="color:#00D">0</span>, [string length])];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But I have issues with both of these. The Ruby equivalent for the date formatting example would be:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activesupport</span><span style="color:#710">'</span></span>
date = <span style="color:#036;font-weight:bold">Time</span>.parse(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">2001-01-01</span><span style="color:#710">"</span></span>) + <span style="color:#00D">162000</span>.seconds
date.strftime(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">%b %d, %Y</span><span style="color:#710">"</span></span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And the regular expression example would be like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>number_of_matches = <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#D20">\W</span><span style="color:#808">*[a|b][c|d]</span><span style="color:#D20">\W</span><span style="color:#808">*</span><span style="color:#404">/</span></span>.match(string).size
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There are 2 specific things that annoys me:</p>
<ul>
  <li>that the Obj-C versions feels unnecessarily verbose. Now, I do understand that they are lower level and they will probably allow for more flexibility, but I think they should have higher “porcelain” versions, that are more straightforward.</li>
  <li>that in Obj-C, the Date Formatting uses the <a href="http://unicode.org/reports/tr35/tr35-10.html#Date_Format_Patterns">Unicode TR-35</a> formatting standard and that Regular Expressions uses the <a href="http://userguide.icu-project.org/strings/regexp"><span class="caps">ICU</span></a> standard that is inspired by Perl Regular Expression with support for Unicode and loosely based on <span class="caps">JDK</span> 1.4 java.util.regex.</li>
</ul>
<p>So, the ideal solution for me would be:</p>
<ul>
  <li>to have higher level versions of those features;</li>
  <li>to have C-compatible strftime date formatting and Ruby 1.9’s Oniguruma level regular expressions.</li>
</ul>
<p></p>
<p></p>
<h2>It’s a Unix System!</h2>
<p>That’s when the obvious thing came to me: Objective-C is nothing more than a superset of C, so anything that is compatible with C is automatically compatible with Objective-C. More than that, the <strong>iOS is a Unix System</strong>! Meaning that it has all the goodies of Posix support.</p>
<div class="embed-container">
  <p><iframe src="https://www.youtube.com/embed/dFUlAQZB9Ng" frameborder="0" allowfullscreen="" style="width: 480px; margin: auto"></iframe></p>
</div>
<p>So, how do I get <a href="https://www.cplusplus.com/reference/clibrary/ctime/strftime/">C-compatible</a> strftime? Easy:</p>
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
      <td class="code"><pre><span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">time.h</span><span style="color:#710">"</span></span>
...
- (NSString*) toFormattedString:(NSString*)format {
    time_t unixTime = (time_t) [self timeIntervalSince1970];
    <span style="color:#080;font-weight:bold">struct</span> tm timeStruct;
    localtime_r(&amp;unixTime, &amp;timeStruct);
    <span style="color:#0a5;font-weight:bold">char</span> buffer[<span style="color:#00D">30</span>];
    strftime(buffer, <span style="color:#00D">30</span>, [[NSDate formatter:format] cStringUsingEncoding:[NSString defaultCStringEncoding]], &amp;timeStruct);
    NSString* output = [NSString stringWithCString:buffer encoding:[NSString defaultCStringEncoding]]; 
    <span style="color:#080;font-weight:bold">return</span> output;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reference: <a href="https://github.com/akitaonrails/ObjC_Rubyfication/blob/master/Rubyfication/NSDate+helpers.m#L71-80">NSDate+helpers.m</a></p>
<p>Now follow each line to understand it:</p>
<ul>
  <li>At line 4 it is returning the current time represented as the number of seconds since 1970. That method actually returns a <tt>NSTimeInterval</tt> which is a number that is essentially the same as the C-equivalent <tt>time_t</tt></li>
  <li>At line 6 the C function <tt>localtime_r</tt> converts the <tt>unitTime</tt> number into the C-structure <tt>timeStruct</tt></li>
  <li>At line 9 we call a custom method I created called <tt>formatter</tt> that just returns a <tt>strftime</tt> compatible string format. The Obj-C string (when we create using the “@” symbol) is an object that we must convert to an array of chars using the <tt>cStringUsingEncoding:</tt>. C functions don’t understand Obj-C string, hence the conversion. Then we finally call the <tt>strftime</tt> itself that will store the result in the <tt>buffer</tt> array of char that we declared before.</li>
  <li>At line 10 we now do the reverse and convert the resulting C-string (array of chars) back into an Obj-C String.</li>
</ul>
<p>Now this is too nice. I have added a few other helper methods that now allows me to use it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>it(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should convert the date to the rfc822 format</span><span style="color:#710">"</span></span>, ^{
    [[[ref toFormattedString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rfc822</span><span style="color:#710">"</span></span>] should] equal:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fri, 01 Jan 2010 10:15:30</span><span style="color:#710">"</span></span>];
});
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reference: <a href="https://github.com/akitaonrails/ObjC_Rubyfication/blob/master/RubyficationTests/DateSpec.m#L69">DateSpec.m</a></p>
<p>And the <tt>“rfc822”</tt> string will just be internally converted to <tt>@"%a, %d %b %Y %H:%M:%S"</tt> by the <a href="https://github.com/akitaonrails/ObjC_Rubyfication/blob/master/Rubyfication/NSDate+helpers.m#L82-100"><tt>formatter:</tt></a> selector in the <tt>NSDate</tt> class.</p>
<p>Now, to add Ruby 1.9-level regular expression you can go straight to the source and use the original C-based <a href="https://www.geocities.jp/kosako3/oniguruma/">Oniguruma</a> itself, exactly what Ruby does. There several ways to integrate a C library into your Cocoa project, but someone already did all the hard work. Satoshi Nakagawa wrote an Obj-C wrapper called <a href="https://limechat.net/cocoaoniguruma/">CocoaOniguruma</a> that makes it dead easy to integrate into your project.</p>
<p>There are several ways to integrate an external library into your project, the easier way (albeit, not exactly the best) that I am showing here is by creating a new Static Library Target within my project, called <em>CocoaOniguruma</em>:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2010.33.47%20PM_original.png?1303608817" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2010.33.47%20PM_original.png?1303608817 2x" alt=""></p>
<p>It will create a new Group called <em>CocoaOniguruma</em> in your project. Than you just add all the files from <a href="https://github.com/psychs/cocoaoniguruma/tree/master/framework/core">CocoaOniguruma’s core folder</a> to that group, select the new target and all the source files and headers will be properly added to the project, like this:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2010.37.19%20PM_original.png?1303608987" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2010.37.19%20PM_original.png?1303608987 2x" alt=""></p>
<p>Finally, you need to go to the original main target of your application and add both the new target to the target dependencies and the binary <tt>.a</tt> file to the binary linking section, like this:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2010.39.07%20PM_original.png?1303609098" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/23/Screen%20shot%202011-04-23%20at%2010.39.07%20PM_original.png?1303609098 2x" alt=""></p>
<p>With all this set, I recommend you to explore the <tt>OnigRegexp.m</tt> and <tt>OnigRegexpUtility.m</tt>, that are Obj-C wrappers to the Oniguruma library. The author already did some very Ruby-like syntax for you to use.</p>
<p>I have wrapped those helpers in my own classes like this:</p>
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
</pre>
      </td>
      <td class="code"><pre>- (NSString*) gsub:(NSString*)pattern with:(id)replacement {
    <span style="color:#080;font-weight:bold">if</span> ([replacement isKindOfClass:[NSString class]]) {
        <span style="color:#080;font-weight:bold">return</span> [self replaceAllByRegexp:pattern with:replacement];        
    } <span style="color:#080;font-weight:bold">else</span> <span style="color:#080;font-weight:bold">if</span> ([replacement isKindOfClass:[NSArray class]]) {
        __block <span style="color:#0a5;font-weight:bold">int</span> i = -<span style="color:#00D">1</span>;
        <span style="color:#080;font-weight:bold">return</span> [self replaceAllByRegexp:pattern withBlock:^(OnigResult* obj) {
            <span style="color:#080;font-weight:bold">return</span> (NSString*)[replacement objectAtIndex:(++i)];
        }];        
    }
    <span style="color:#080;font-weight:bold">return</span> nil;
}
- (NSString*) gsub:(NSString*)pattern withBlock:(NSString* (^)(OnigResult*))replacement {
    <span style="color:#080;font-weight:bold">return</span> [self replaceAllByRegexp:pattern withBlock:replacement];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reference: <a href="https://github.com/akitaonrails/ObjC_Rubyfication/blob/master/Rubyfication/NSString+helpers.m#L176-190">NSString+helpers.m</a></p>
<p>Which now allows me to use this nicer syntax:</p>
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
</pre>
      </td>
      <td class="code"><pre>context(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Regular Expressions</span><span style="color:#710">"</span></span>, ^{
    it(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should replace all substrings that match the pattern</span><span style="color:#710">"</span></span>, ^{
        [[[<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello world, heyho!</span><span style="color:#710">"</span></span> gsub:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">h</span><span style="color:#b0b">\\</span><span style="color:#D20">w+</span><span style="color:#710">"</span></span> with:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hi</span><span style="color:#710">"</span></span>] should] equal:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hi world, hi!</span><span style="color:#710">"</span></span>];
    });
    it(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should replace each substrings with one corresponding replacement in the array</span><span style="color:#710">"</span></span>, ^{
        NSArray* replacements = [NSArray arrayWithObjects:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hi</span><span style="color:#710">"</span></span>, <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">everybody</span><span style="color:#710">"</span></span>, nil];
        [[[<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello world, heyho!</span><span style="color:#710">"</span></span> gsub:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">h</span><span style="color:#b0b">\\</span><span style="color:#D20">w+</span><span style="color:#710">"</span></span> with:replacements] should] equal:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hi world, everybody!</span><span style="color:#710">"</span></span>];
    });
    it(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should replace each substring with the return of the block</span><span style="color:#710">"</span></span>, ^{
        [[[<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello world, heyho!</span><span style="color:#710">"</span></span> gsub:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">h</span><span style="color:#b0b">\\</span><span style="color:#D20">w+</span><span style="color:#710">"</span></span> withBlock:^(OnigResult* obj) {
            <span style="color:#080;font-weight:bold">return</span> <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>;
        }] should] equal:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo world, foo!</span><span style="color:#710">"</span></span>];
    });
});
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reference: <a href="https://github.com/akitaonrails/ObjC_Rubyfication/blob/master/RubyficationTests/StringSpec.m#L86-102">StringSpec.m</a></p>
<p>If you’re thinking that it is strange for a snippet of Objective-C code to have keyword such as <tt>context</tt> or <tt>it</tt>, they come from <a href="https://www.kiwi-lib.info/">Kiwi</a>, which builds an RSpec-like <span class="caps">BDD</span> testing framework on top of SenTesting Kit for Objective-C development that you should definitely check out. But the code above should be easy enough to understand without even knowing about Kiwi. If you’re a Ruby developer, you will probably notice that the syntax bears some resemblance to what you’re used to already.</p>
<p>So, linking to existing standard C libraries or even third-party open source C libraries is a piece of cake for those simple cases, without having to resort to any “Native Interface” tunneling between virtual machines or any other plumbing. If you want C, they’re there for you to easily integrate and use.</p>
<p></p>
---
title: "Elixir Pipe Operator for Ruby: Chainable Methods"
date: "2016-02-18T18:28:00.000Z"
tags: ["elixir"]
years: "2016"
---

<p></p>
<p>There has been <a href="http://blog.molawson.com/elixir-pipes-in-ruby/">recent</a> <a href="https://gist.github.com/pcreux/2f87847e5e4aad37db02">discussions</a> about how nice it would be to have something like the awesome Elixir Pipe Operator for Ruby.</p>
<p>If you don't know what the "Pipe Operator" is in Elixir, take the following code:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Enum</span>.sum(<span style="color:#036;font-weight:bold">Enum</span>.filter(<span style="color:#036;font-weight:bold">Enum</span>.map(<span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">100_000</span>, &amp;(&amp;<span style="color:#00D;font-weight:bold">1</span> * <span style="color:#00D;font-weight:bold">3</span>)), odd?))<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's ugly, we all know that. In an Object Oriented language like Ruby we would do something like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">(<span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">100_000</span>).<tt>
</tt>  map { |i| i * <span style="color:#00D;font-weight:bold">3</span> }.<tt>
</tt>  select(&amp;<span style="color:#A60">:odd?</span>).<tt>
</tt>  reduce(&amp;<span style="color:#A60">:+</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>But Elixir does not have objects, only functions, so how can we code more elegantly? The solution came up in the form of the so called "Pipe Operator" which takes the last returning value and pass it through as the first argument of the next function call, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">100_000</span><tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Stream</span>.map(&amp;(&amp;<span style="color:#00D;font-weight:bold">1</span> * <span style="color:#00D;font-weight:bold">3</span>))<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Stream</span>.filter(odd?)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.sum<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So Ruby and Elixir "feels" the same when we are able to "chain" methods. In the Ruby world we don't have the "need" for an operator like that. But it would be nice to have a mechanism that we could use to make our codes more expressive, or more testable, or more readable. For example, what if we would write something like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">(<span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">100_000</span>).<tt>
</tt>  multiple_each_element_by_three.<tt>
</tt>  filter_out_odd_elements.<tt>
</tt>  give_the_sum_of_all_elements<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Of course, this is a very constrained example with really bad method naming. But if we get Mo Lawson's article I linked above, it becomes more interesting:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">keywords<tt>
</tt>  .map { |kw| kw.gsub(<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">(^[^[:alpha:]]+|[^[:alpha:]]+$)</span><span style="color:#404">/</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>) }<tt>
</tt>  .map { |kw| <span style="color:#036;font-weight:bold">LegacySpanishCorrector</span>.new.correct(kw) }<tt>
</tt>  .map { |kw| kw.gsub(<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">[^[:alpha:]</span><span style="color:#04D">\d</span><span style="color:#808">'_</span><span style="color:#04D">\-</span><span style="color:#04D">\/</span><span style="color:#808">]</span><span style="color:#404">/</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>) }<tt>
</tt>  .reject { |kw| <span style="color:#036;font-weight:bold">STOP_WORDS</span>.include?(kw) }<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ruby allows us to chain Enumerable methods one after the other, transforming the initial keywords list into "something" that is very difficult to infer just by looking at this code.</p>
<p>What about this other version?</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">KeywordNormalizer</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">call</span>(keywords)<tt>
</tt>    <span style="color:#036;font-weight:bold">Collection</span>.new(keywords)<tt>
</tt>      .strip_outer_punctuation<tt>
</tt>      .fix_spanish<tt>
</tt>      .clean_inner_punctuation<tt>
</tt>      .remove_stop_words<tt>
</tt>      .to_a<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#888"># ...</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is where we gets by the end of his article: much more readable and each new isolated method is unit testable, resulting in more robust code.</p>
<p>The whole idea of this post is to present you to my new little gem <a href="https://rubygems.org/gems/chainable_methods">"Chainable Methods"</a>. The <a href="https://github.com/akitaonrails/chainable_methods">source code</a> is on Github, as usual, so please contribute.</p>
<p>My gem will allow you to write the Lawson's last code like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">KeywordNormalizer</span><tt>
</tt>  .chain_from(keywords)<tt>
</tt>  .strip_outer_punctuation<tt>
</tt>  .fix_spanish<tt>
</tt>  .clean_inner_punctuation<tt>
</tt>  .remove_stop_words<tt>
</tt>  .to_a<tt>
</tt>  .unwrap<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You add the <tt>chainable_methods</tt> to your Gemfile as usual (you know the drill), then you can write Lawson's module like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">KeywordNormalizer</span><tt>
</tt>  extend <span style="color:#036;font-weight:bold">ChainableMethods</span><tt>
</tt>  <tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">strip_outer_punctuation</span>(array)<tt>
</tt>    array.map { |el| el.gsub(<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">(^[^[:alpha:]]+|[^[:alpha:]]+$)</span><span style="color:#404">/</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>) }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">fix_spanish</span>(array)<tt>
</tt>    array.map { |el| <span style="color:#036;font-weight:bold">LegacySpanishCorrector</span>.new.correct(el) }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">clean_inner_punctuation</span>(array)<tt>
</tt>    array.map { |el| el.gsub(<span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">[^[:alpha:]</span><span style="color:#04D">\d</span><span style="color:#808">'_</span><span style="color:#04D">\-</span><span style="color:#04D">\/</span><span style="color:#808">]</span><span style="color:#404">/</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#710">'</span></span>) }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">remove_stop_words</span>(array)<tt>
</tt>    array.reject { |el| <span style="color:#036;font-weight:bold">STOP_WORDS</span>.include?(el) }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's it, now you can chain everything like I showed previously. The pattern is:</p>
<p>1) Write a Module with class-level methods that receive at least one argument and extend the 'ChainableMethods' module:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">MyModule</span><tt>
</tt>  extend <span style="color:#036;font-weight:bold">ChainableMethods</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">method_a</span>(argument1)<tt>
</tt>    <span style="color:#888"># ...</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">method_b</span>(argument1, argument2)<tt>
</tt>    <span style="color:#888"># ...</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">method_c</span>(argument1)<tt>
</tt>    <span style="color:#888"># yield a block passing the received argument</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>2) Wrap an initial state that will be passed to the first method as it's first argument:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">some_initial_state = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Hello World</span><span style="color:#710">"</span></span><tt>
</tt><span style="color:#036;font-weight:bold">MyModule</span><tt>
</tt>  .chain_from(some_initial_state)<tt>
</tt>  <span style="color:#888"># ...</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>3) Chain as many methods from the module or methods that the returning state recognizes:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">MyModule</span><tt>
</tt>  .chain_from(some_initial_state)<tt>
</tt>  .upcase<tt>
</tt>  .method_a<tt>
</tt>  .method_b(argument2)<tt>
</tt>  .method_c { |foo| foo }<tt>
</tt>  .split(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""> </span><span style="color:#710">"</span></span>)<tt>
</tt>  .join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">, </span><span style="color:#710">"</span></span>)<tt>
</tt>  .unwrap<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice that we do not need to pass the first argument to the methods within the 'MyModule' module, it will get the result from the last call automatically.</p>
<p>4) Do not forget to call <tt>#unwrap</tt> as the last call to get the last result from the chain.</p>
<h3>An Experiment</h3>
<p>And that's it! I isolated this behavior only into modules that explicitly extend the 'ChainableMethods' module instead of automagically enabling it in the BasicObject level as many would initially think because we don't want a global 'method_missing' dangling around unchecked.</p>
<p>This behavior makes use of 'method_missing' so it's not going to be fast in a synthetic benchmark against a direct method call, for obvious reasons. The purpose is not to be fast, just expressive. So keep that in mind.</p>
<p>The use case is: whenever you have some kind of transformation, you will want a chain of unit testable, isolated, functions, and this is how you can get it without too much hassle.</p>
<p>This is an experiment. Because I'm using 'method_missing' there may be side-effects I am not seeing right now, so please let me know in the <a href="https://github.com/akitaonrails/chainable_methods/issues">Github Issues</a> and send feedback if it helped you out in some project.</p>
<p>Pull Requests are most welcome!</p>
<p></p>
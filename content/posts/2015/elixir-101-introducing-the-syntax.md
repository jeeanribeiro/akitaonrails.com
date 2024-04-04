---
title: "Elixir 101 - Introducing the Syntax"
date: "2015-11-25T19:25:00.000Z"
tags: ["beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p>I've been posting a lot of articles in the last few weeks, check out the <a href="http://www.akitaonrails.com/elixir">"Elixir" tag</a> to read all of them.</p>
<p>Many tutorial series start introducing a new language by its syntax. I subverted the order. Elixir is not interesting because of its syntax. Erlang is interesting all by itself, because of its very mature, highly reliable, highly concurrent, distributed nature. But its syntax is not for the faint of heart. It's not "ugly", it's just too different for us - from the C school - to easily digest. It derives from Prolog, and this is one small example of a Prolog exercise:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">% P03 (*): Find the K'th element of a list.<tt>
</tt>%     The first element in the list is number 1.<tt>
</tt>%     Example:<tt>
</tt>%     ?- element_at(X,[a,b,c,d,e],3).<tt>
</tt>%     X = c<tt>
</tt><tt>
</tt>% The first element in the list is number 1.<tt>
</tt><tt>
</tt>% element_at(X,L,K) :- X is the K'th element of the list L<tt>
</tt>%    (element,list,integer) (?,?,+)<tt>
</tt><tt>
</tt>% Note: nth1(?Index, ?List, ?Elem) is predefined<tt>
</tt><tt>
</tt>element_at(X,[X|_],1).<tt>
</tt>element_at(X,[_|L],K) :- K &gt; 1, K1 is K - 1, element_at(X,L,K1).<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Erlang has a similar syntax, with the idea of phrases divided by commas and ending with a dot.</p>
<p></p>
<p></p>
<p>José Valim played very smart: he chose the best of the available mature platforms and coated it with a layer of modern syntax and easier to use standard libraries. This is the same problem implemented in Elixir:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Exercise</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">element_at</span>([found|_], <span style="color:#00D;font-weight:bold">1</span>), <span style="color:#808">do</span>: found<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">element_at</span>([_|rest], position) <span style="color:#080;font-weight:bold">when</span> position &gt; <span style="color:#00D;font-weight:bold">1</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    element_at(rest, position - <span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If I copy and paste the code above in an IEx shell I can test it out like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(7)&gt; Exercise.element_at(["a", "b", "c", "d", "e"], 3)<tt>
</tt>"c"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This simple exercise shows us some of the powerful bits of Erlang that Elixir capitalizes upon, such as pattern matching and recursion.</p>
<p>First of all, every function <strong>must</strong> be defined inside a module, which you name with the <tt>defmodule My.Module do .. end</tt>. Internally it becomes the atom "Elixir.My.Process". Nesting modules is just a larger name concatenated with dots.</p>
<p>Then you can define public function with the <tt>def my_function(args) do .. end</tt> block which is just a macro to the same <tt>def my_function(args), do: ...</tt> construct. Private methods are declared with <tt>defp</tt>.</p>
<p>A function is actually identified by the pair of its name and its arity. So above we have <tt>element_at/2</tt> which means it accepts 2 arguments. But we have 2 functions with the same arity: the difference is the <strong>pattern matching</strong>.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">element_at</span>([found|_], <span style="color:#00D;font-weight:bold">1</span>), <span style="color:#808">do</span>: found<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Here we are saying: the first argument will be an array, decompose it. The first element of the array will be stored in the "found" variable, the rest "_" will be ignored. And the second argument must be the number "1". This is the description of the so called "pattern", it should "match" the input arguments received. This is <strong>"call-by-pattern"</strong> semantics.</p>
<p>But what if we want to pass a position different than "1"? That's why we have this second definition:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">def element_at([_|rest], position) when position &gt; 1 do<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, the first argument again <strong>need</strong> to be an array, but this time we don't care about the first element, just the rest of the array without the first element. And any position different than "1" will be stored in the "position" variable.</p>
<p>But this function is special, it is <strong>guarded</strong> to only allow a <tt>position</tt> that is larger than 1. What if we try a negative position?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(8)&gt; Exercise.element_at(["a", "b", "c", "d", "e"], -3)<tt>
</tt>** (FunctionClauseError) no function clause matching in Exercise.element_at/2<tt>
</tt>    iex:7: Exercise.element_at(["a", "b", "c", "d", "e"], -3)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It says that none of the clause we passed doesn't match any of the defined ones above. We could have added a third definition just to catch those cases:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">element_at</span>(_list, _position), <span style="color:#808">do</span>: <span style="color:#038;font-weight:bold">nil</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Adding the underscore "_" before the variable name is the same as having just the underscore but we are naming it just to make it more readable. But any arguments passed will just be ignored. And this is the more generic case if the previous 2 don't match.</p>
<p>The previous line is the same as writing:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">def element_at(_list, _position) do<tt>
</tt>  nil<tt>
</tt>end<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I won't dive into macros for now, just know that there is more than one way of doing things in Elixir and you can define those different ways using Erlang's built-in support for macros, dynamic code that is compiled in runtime. It's the way of doing metaprogramming with Elixir.</p>
<p>Now, going back to the implementation, the first function still can look weird, let's review it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">element_at</span>([_|rest], position) <span style="color:#080;font-weight:bold">when</span> position &gt; <span style="color:#00D;font-weight:bold">1</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  element_at(rest, position - <span style="color:#00D;font-weight:bold">1</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>What happens is: when we call <tt>Exercise.element_at(["a", "b", "c", "d", "e"], 3)</tt> the first argument will pattern match with <tt>[_|rest]</tt>. The first element "a" is disposed and the new list <tt>["b", "c", "d", "e"]</tt> is stored as "<tt>rest</tt>".</p>
<p>Finally, we recurse the call decrementing from the "<tt>position</tt>" variable. So it becomes <tt>element_at(["b", "c", "d", "e"], 2)</tt>. And it repeats until position becomes "1", in which case the pattern matching falls to the second function defined as:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">def element_at([found|_], 1), do: found<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In this case the rest of the array is pattern matched and the first element, "c" is stored in the "<tt>found</tt>" variable, the rest of the array is discarded. It only got here because the position matched as "1", and so it just returns the variable "found", which contains the 3rd element of the original array, "c".</p>
<p>This is all nice and fancy, but in Elixir we could just have done this other version:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Exercise</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">element_at</span>(list, position), <span style="color:#808">do</span>: <span style="color:#036;font-weight:bold">Enum</span>.at(list, position)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we are done! Several tutorials will talk about how recursion and pattern matching to decompose lists solve a lot of problems, but Elixir gives us the convenience of treating lists as Enumerables and provide us a rich <a href="https://elixir-lang.org/docs/stable/elixir/Enum.html">Enum</a> module with very useful functions such as <tt>at/2</tt>, <tt>each/2</tt>, <tt>take/2</tt>, and so on. Just pick what you need and you're managing lists like a boss.</p>
<p>Oh, and by the way, there is something called a <a href="https://elixir-lang.org/getting-started/sigils.html">Sigil</a> in Elixir. Instead of writing the List of String explicitly, we could have done it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(8)&gt; ~w(a b c d e f)<tt>
</tt>["a", "b", "c", "d", "e", "f"]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or, if we wanted a List of Atoms, we could do it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(9)&gt; ~w(a b c d e f)a<tt>
</tt>[:a, :b, :c, :d, :e, :f]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Lists, Tuples and Keyword Lists</h3>
<p>Well, this was too simple. You really need the idea of pattern matching and basic type in your mind to make it flow. Let's get another snippet from the <a href="https://www.akitaonrails.com/2015/11/18/ex-manga-downloader-an-exercise-with-elixir">Ex Manga Downloadr</a>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp parse_args(args) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  parse = <span style="color:#036;font-weight:bold">OptionParser</span>.parse(args,<tt>
</tt>    <span style="color:#808">switches</span>: [<span style="color:#808">name</span>: <span style="color:#A60">:string</span>, <span style="color:#808">url</span>: <span style="color:#A60">:string</span>, <span style="color:#808">directory</span>: <span style="color:#A60">:string</span>],<tt>
</tt>    <span style="color:#808">aliases</span>: [<span style="color:#808">n</span>: <span style="color:#A60">:name</span>, <span style="color:#808">u</span>: <span style="color:#A60">:url</span>, <span style="color:#808">d</span>: <span style="color:#A60">:directory</span>]<tt>
</tt>  )<tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> parse <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {[<span style="color:#808">name</span>: manga_name, <span style="color:#808">url</span>: url, <span style="color:#808">directory</span>: directory], _, _} -&gt; process(manga_name, url, directory)<tt>
</tt>    {[<span style="color:#808">name</span>: manga_name, <span style="color:#808">directory</span>: directory], _, _} -&gt; process(manga_name, directory)<tt>
</tt>    {_, _, _ } -&gt; process(<span style="color:#A60">:help</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The first part may puzzle you:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">OptionParser</span>.parse(args,<tt>
</tt>    <span style="color:#808">switches</span>: [<span style="color:#808">name</span>: <span style="color:#A60">:string</span>, <span style="color:#808">url</span>: <span style="color:#A60">:string</span>, <span style="color:#808">directory</span>: <span style="color:#A60">:string</span>],<tt>
</tt>    <span style="color:#808">aliases</span>: [<span style="color:#808">n</span>: <span style="color:#A60">:name</span>, <span style="color:#808">u</span>: <span style="color:#A60">:url</span>, <span style="color:#808">d</span>: <span style="color:#A60">:directory</span>]<tt>
</tt>  )<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <tt>OptionParser.parse/2</tt> receives just 2 arguments: 2 arrays. If you come from Ruby it feels like it's a Hash with optional brackets, translating to something similar to this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># this is wrong</span><tt>
</tt><span style="color:#036;font-weight:bold">OptionParser</span>.parse(args,<tt>
</tt>    { <span style="color:#808">switches</span>: {<span style="color:#808">name</span>: <span style="color:#A60">:string</span>, <span style="color:#808">url</span>: <span style="color:#A60">:string</span>, <span style="color:#808">directory</span>: <span style="color:#A60">:string</span>},<tt>
</tt>      <span style="color:#808">aliases</span>: {<span style="color:#808">n</span>: <span style="color:#A60">:name</span>, <span style="color:#808">u</span>: <span style="color:#A60">:url</span>, <span style="color:#808">d</span>: <span style="color:#A60">:directory</span>} }<tt>
</tt>  )<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This works in Ruby but it is not the case in Elixir, there are optional brackets but not where you think they are:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># this is the correct, more explicit version</span><tt>
</tt><span style="color:#036;font-weight:bold">OptionParser</span>.parse(args,<tt>
</tt>    [<tt>
</tt>      {<tt>
</tt>        <span style="color:#A60">:switches</span>,<tt>
</tt>        [<tt>
</tt>          {<span style="color:#A60">:name</span>, <span style="color:#A60">:string</span>}, {<span style="color:#A60">:url</span>, <span style="color:#A60">:string</span>}, {<span style="color:#A60">:directory</span>, <span style="color:#A60">:string</span>}<tt>
</tt>        ]<tt>
</tt>      },<tt>
</tt>      {<tt>
</tt>        aliases:<tt>
</tt>        [<tt>
</tt>          {<span style="color:#A60">:n</span>, <span style="color:#A60">:name</span>}, {<span style="color:#A60">:u</span>, <span style="color:#A60">:url</span>}, {<span style="color:#A60">:d</span>, <span style="color:#A60">:directory</span>}<tt>
</tt>        ]<tt>
</tt>      }<tt>
</tt>    ]<tt>
</tt>  )<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>WHAT!?!?</p>
<p>Yep, the second argument is actually an array with elements that are <strong>Tuples</strong> paired with an atom key and value, and some of the values are themselves arrays with tuples.</p>
<ol>
  <li>
    <p>in Elixir, Lists are what we usually call an Array, a Linked-List of elements. Linked-Lists, as you know from your Computer Science classes, are easy to insert new elements and remove elements.</p>
  </li>
  <li>
    <p>in Elixir, Tuples are immutable fixed lists with fixed positions, with elements delimited by the brackets "{}"</p>
  </li>
</ol>
<p>If the previous example was just too much, let's step back a little:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Teste</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">teste</span>(opts) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    [{<span style="color:#A60">:hello</span>, world}, {<span style="color:#A60">:foo</span>, bar}] = opts<tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>world<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>bar<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now we can call it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(13)&gt; Teste.teste hello: "world", foo: "bar"<tt>
</tt>world bar<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Which is the same as calling like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(14)&gt; Teste.teste([{:hello, "world"}, {:foo, "bar"}])<tt>
</tt>world bar<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This may confuse you, but it's very intuitive. You can just think of this combination of Lists ("[]") with Tuple elements containing a pair of atom and value ("{:key, value}") to behave almost like Ruby Hashes being used for optional named arguments.</p>
<p>Then, we have the Pattern Match section in both previous examples:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">case</span> parse <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  {[<span style="color:#808">name</span>: manga_name, <span style="color:#808">url</span>: url, <span style="color:#808">directory</span>: directory], _, _} -&gt;<tt>
</tt>    process(manga_name, url, directory)<tt>
</tt>  {[<span style="color:#808">name</span>: manga_name, <span style="color:#808">directory</span>: directory], _, _} -&gt;<tt>
</tt>    process(manga_name, directory)<tt>
</tt>  {_, _, _ } -&gt;<tt>
</tt>    process(<span style="color:#A60">:help</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[{<span style="color:#A60">:hello</span>, world}, {<span style="color:#A60">:foo</span>, bar}] = opts<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The last example is just decomposition. The previous example is pattern match and decomposition. You match based on the atoms and positions within the tuples within the list. You match from the more narrow case to the more generic case. And in the process, the variables in the pattern are available for you to use in the matching case clause.</p>
<p>Let's understand the meaning of this line:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">{[<span style="color:#808">name</span>: manga_name, <span style="color:#808">url</span>: url, <span style="color:#808">directory</span>: directory], _, _} -&gt; process(manga_name, url, directory)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It is saying: given the results of the <tt>OptionParser.parse/2</tt> function, it must be a tuple with 3 elements. The second and third elements don't matter. But the first element must be a List with at least 3 tuples. And the keys of each tuples must be the atoms <tt>:name</tt>, <tt>:url</tt>, and <tt>:directory</tt>. If they're there, store the values of each tuples in the variables <tt>manga_name</tt>, <tt>url</tt>, and <tt>directory</tt>, respectivelly.</p>
<p>This may really confuse you in the beginning, but this combination of a List of Tuples is what's called a <a href="https://elixir-lang.org/getting-started/maps-and-dicts.html#keyword-lists"><strong>Keyword List</strong></a> and you will find this pattern many times, so get used to it.</p>
<p>Keyword List feel like a Map, but a Map has a different syntax:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">list = [<span style="color:#808">a</span>: <span style="color:#00D;font-weight:bold">1</span>, <span style="color:#808">b</span>: <span style="color:#00D;font-weight:bold">2</span>, <span style="color:#808">c</span>: <span style="color:#00D;font-weight:bold">3</span>]<tt>
</tt>map = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">:a =&gt; 1, :b =&gt; 2, :c =&gt; 3</span><span style="color:#710">}</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should summarize it:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(1)&gt; list = [a: 1, b: 2, c: 3]<tt>
</tt>[a: 1, b: 2, c: 3]<tt>
</tt>iex(2)&gt; map = %{:a =&gt; 1, :b =&gt; 2, :c =&gt; 3}<tt>
</tt>%{a: 1, b: 2, c: 3}<tt>
</tt><tt>
</tt>iex(3)&gt; list[:a]<tt>
</tt>1<tt>
</tt>iex(4)&gt; map[:a]<tt>
</tt>1<tt>
</tt><tt>
</tt>iex(5)&gt; list.a<tt>
</tt>** (ArgumentError) argument error<tt>
</tt>    :erlang.apply([a: 1, b: 2, c: 3], :a, [])<tt>
</tt>iex(5)&gt; map.a<tt>
</tt>1<tt>
</tt><tt>
</tt>iex(6)&gt; list2 = [{:a, 1}, {:b, 2}, {:c, 3}]<tt>
</tt>[a: 1, b: 2, c: 3]<tt>
</tt>iex(7)&gt; list = list2<tt>
</tt>[a: 1, b: 2, c: 3]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Keyword Lists are convenient as function arguments or return values. But if you want to process a collection of key-value pairs, use a dictionary-like structure, in this case, a Map. Specifically if you need to search the collection using the key. They look similar but the internal structures are not the same, a Keyword List is not a Map, it's just a convenience for a static list of tuples.</p>
<p>Finally, if this pattern matches the <tt>parse</tt> variable passed in the <tt>case</tt> block, it executes the statement <tt>process(manga_name, url, directory)</tt>, passing the 3 variables captured in the match. Otherwise it proceeds to try the next pattern in the <tt>case</tt> block.</p>
<p>The idea is that the "=" operator is not an "assignment", it's a matcher, you match one side with the other. Read the error message when a pattern is not matched:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(15)&gt; [a, b, c] = 1<tt>
</tt>** (MatchError) no match of right hand side value: 1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is a matching error, not an assignment error. But if it succeeds this is what we have:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">iex(15)&gt; [a, b, c] = [1, 2, 3]<tt>
</tt>[1, 2, 3]<tt>
</tt>iex(16)&gt; a<tt>
</tt>1<tt>
</tt>iex(17)&gt; c<tt>
</tt>3<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is a List decomposition. It so happens that in the simple case, it feels like a variable assignment, but it's much more complex than that.</p>
<h3>Pipelines</h3>
<p>We use exactly those concepts of pattern matching on the returning elements from the HTML parsed by Floki in my Manga Downloadr:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#listing a</span><span style="color:#710">"</span></span>)<tt>
</tt>|&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">a</span><span style="color:#710">"</span></span>, [{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>, url}], _} -&gt; url <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <tt>find/2</tt> gets a HTML string from the fetched page and matches against the CSS selectors in the second argument. The result is a List of Tuples representing the structure of each HTML Node found, in this case, this pattern: <tt>{"a", [{"href", url}], _}</tt></p>
<p>We can then <tt>Enum.map/2</tt>. A map is a function that receives each element of a list and returns a new list with new elements. The first argument is the original list and the second argument is a function that receives each element and returns a new one.</p>
<p>One of the main features of the Elixir language that most languages don't have is the <strong>Pipe</strong> operator ("|&gt;"). It behaves almost like UNIX's pipe operator "|" in any shell.</p>
<p>In UNIX we usually do stuff like "<tt>ps -ef | grep PROCESS | grep -v grep | awk '{print $2}' | xargs kill -9</tt>"</p>
<p>This is essentially the same as doing:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">ps -ef &gt; /tmp/ps.txt<tt>
</tt>grep mix /tmp/ps.txt &gt; /tmp/grep.txt<tt>
</tt>grep -v grep /tmp/grep.txt &gt; /tmp/grep2.txt<tt>
</tt>awk '{print $2}' /tmp/grep2.txt &gt; /tmp/awk.txt<tt>
</tt>xargs kill -9 &lt; /tmp/awk.txt<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Each UNIX process can receive something from the standard input (STDIN) and output something to the standard output (STDOUT). We can redirect the output using "&gt;". But instead of doing all those extra steps, creating all those extra garbage temporary files, we can simply "pipe" the STDOUT of one command to the STDIN of the next command.</p>
<p>Elixir uses the same principles: we can simply use the returning value of a function as the <strong>first argument</strong> of the next function. So the first example of this section is the same as doing this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">results = <span style="color:#036;font-weight:bold">Floki</span>.find(html, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#listing a</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#036;font-weight:bold">Enum</span>.map(results, fn {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">a</span><span style="color:#710">"</span></span>, [{<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">href</span><span style="color:#710">"</span></span>, url}], _} -&gt; url <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In the same ExMangaDownloadr project we have this snippet:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp process(manga_name, url, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">File</span>.mkdir_p!(directory)<tt>
</tt>  url<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.chapters<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.pages<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.images_sources<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.process_downloads(directory)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.optimize_images<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Workflow</span>.compile_pdfs(manga_name)<tt>
</tt>    |&gt; finish_process<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we just learned that it's the equivalent of doing the followng (I'm cheating a bit because the 3 final functions of the workflow are not transforming the input "directory", just passing it through):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">  defp process(manga_name, url, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">File</span>.mkdir_p!(directory)<tt>
</tt><tt>
</tt>    chapters  = <span style="color:#036;font-weight:bold">Workflow</span>.chapters(url)<tt>
</tt>    pages     = <span style="color:#036;font-weight:bold">Workflow</span>.pages(chapters)<tt>
</tt>    sources   = <span style="color:#036;font-weight:bold">Workflow</span>.images_sources(pages)<tt>
</tt>    <span style="color:#036;font-weight:bold">Workflow</span>.process_downloads(sources, directory)<tt>
</tt>    <span style="color:#036;font-weight:bold">Workflow</span>.optimize_images(directory)<tt>
</tt>    <span style="color:#036;font-weight:bold">Workflow</span>.compile_pdfs(directory, manga_name)<tt>
</tt>    finish_process(directory)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or this much uglier version that we must read in reverse:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp process(manga_name, url, directory) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">File</span>.mkdir_p!(directory)<tt>
</tt>  finish_process(<tt>
</tt>    <span style="color:#036;font-weight:bold">Workflow</span>.compile_pdfs(<tt>
</tt>      <span style="color:#036;font-weight:bold">Workflow</span>.optimize_images(<tt>
</tt>        <span style="color:#036;font-weight:bold">Workflow</span>.images_sources(<tt>
</tt>          <span style="color:#036;font-weight:bold">Workflow</span>.pages(<tt>
</tt>            <span style="color:#036;font-weight:bold">Workflow</span>.chapters(url)<tt>
</tt>          )<tt>
</tt>        )<tt>
</tt>      ), manga_name<tt>
</tt>    )<tt>
</tt>  )<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We can easily see how the Pipe Operator "|&gt;" makes any transformation pipeline much easier to read. Anytime you are starting from a value, passing the results through a <strong>chain of transformation</strong>, you will use this operator.</p>
<h3>Next Steps</h3>
<p>The concepts presented in this article are the ones I think most people will find the most challenging upon first glance. If you understand Pattern Matching, Keyword Lists, you will understand all the rest.</p>
<p>The official website offers a great <a href="https://elixir-lang.org/getting-started/introduction.html">Getting Started</a> that you must read entirely.</p>
<p>From intuition you know most things already. You have "do .. end" blocks but you still don't know that they are just convenience macros to pass a list of statements as an argument inside a Keyword List. The following blocks are equivalent:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">if</span> <span style="color:#038;font-weight:bold">true</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  a = <span style="color:#00D;font-weight:bold">1</span> + <span style="color:#00D;font-weight:bold">2</span><tt>
</tt>  a + <span style="color:#00D;font-weight:bold">10</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">if</span> <span style="color:#038;font-weight:bold">true</span>, <span style="color:#808">do</span>: (<tt>
</tt>  a = <span style="color:#00D;font-weight:bold">1</span> + <span style="color:#00D;font-weight:bold">2</span><tt>
</tt>  a + <span style="color:#00D;font-weight:bold">10</span><tt>
</tt>)<tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">if</span> <span style="color:#038;font-weight:bold">true</span>, [{<span style="color:#A60">:do</span>, (<tt>
</tt>  a = <span style="color:#00D;font-weight:bold">1</span> + <span style="color:#00D;font-weight:bold">2</span><tt>
</tt>  a + <span style="color:#00D;font-weight:bold">10</span><tt>
</tt>)}]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Mind blowing, huh? There are many macros that add syntactic sugar using the primitives behind it.</p>
<p>On the most part, Valim made the powerful Erlang primitives more accessible (Lists, Atoms, Maps, etc) and added higher abstractions using macros (do .. end blocks, the pipe operator, keyword lists, shortcuts for anonymous functions, etc). This precise combination is what makes Elixir very enjoyable to learn. It's like peeling an onion: you start with the higher abstractions and discover macros of simpler structures underneath. You see a Keyword List first and discover Lists of Tuples. You see a block and discover another Keyword List disguised with a macro. And so on.</p>
<p>So you have a low curve of entry and you can go as deep as you want in the rabbit hole, until the point you're extending the language.</p>
<p>Elixir provides a very clever language design on top of the 25 year old mature Erlang core. This is not just clever, it's the intelligent choice. Keep learning!</p>
<p></p>
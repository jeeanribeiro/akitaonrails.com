---
title: "Erlang's Ping Pong (tut15) in Clojure and Elixir"
date: "2015-12-09T16:42:00.000Z"
tags: ["beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p>This is a very short post just because I thought it was fun. I was reading <a href="http://blog.paralleluniverse.co/2013/05/02/quasar-pulsar/">this very enlightening article</a> on Clojure's Quasar/Pulsar compared to Erlang and how they are trying to plug the holes on the JVM shortcomings.</p>
<p>When you're learning Erlang through its official documentation, the first thing you build in the <a href="http://www.erlang.org/doc/getting_started/conc_prog.html#id67347">chapters on Processes</a> is a very simple Ping Pong code that looks like this:</p>
<p></p>
<p>
</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">-module(tut15).<tt>
</tt><tt>
</tt>-export([start/0, ping/2, pong/0]).<tt>
</tt><tt>
</tt>ping(0, Pong_PID) -&gt;<tt>
</tt>    Pong_PID ! finished,<tt>
</tt>    io:format("ping finished~n", []);<tt>
</tt><tt>
</tt>ping(N, Pong_PID) -&gt;<tt>
</tt>    Pong_PID ! {ping, self()},<tt>
</tt>    receive<tt>
</tt>        pong -&gt;<tt>
</tt>            io:format("Ping received pong~n", [])<tt>
</tt>    end,<tt>
</tt>    ping(N - 1, Pong_PID).<tt>
</tt><tt>
</tt>pong() -&gt;<tt>
</tt>    receive<tt>
</tt>        finished -&gt;<tt>
</tt>            io:format("Pong finished~n", []);<tt>
</tt>        {ping, Ping_PID} -&gt;<tt>
</tt>            io:format("Pong received ping~n", []),<tt>
</tt>            Ping_PID ! pong,<tt>
</tt>            pong()<tt>
</tt>    end.<tt>
</tt><tt>
</tt>start() -&gt;<tt>
</tt>    Pong_PID = spawn(tut15, pong, []),<tt>
</tt>    spawn(tut15, ping, [3, Pong_PID]).<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's not pretty, it's Prolog-ish. The Clojure article claims how close they got with lightweight threads (true green threads) and this is the same exercise done in Clojure:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">(defsfn pong []<tt>
</tt> (if (== n 0)<tt>
</tt>    (do<tt>
</tt>      (! :pong :finished)<tt>
</tt>      (println "ping finished"))<tt>
</tt>    (do<tt>
</tt>      (! :pong [:ping @self])<tt>
</tt>      (receive<tt>
</tt>       :pong (println "Ping received pong"))<tt>
</tt>      (recur (dec n)))))<tt>
</tt><tt>
</tt>(defsfn pong []<tt>
</tt>  (receive<tt>
</tt>   :finished (println "Pong finished")<tt>
</tt>   [:ping ping] (do<tt>
</tt>                  (println "Pong received ping")<tt>
</tt>                  (! ping :pong)<tt>
</tt>                  (recur))))<tt>
</tt><tt>
</tt>(defn -main []<tt>
</tt>  (register :pong (spawn pong))<tt>
</tt>  (spawn ping 3)<tt>
</tt>  :ok)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>People that like the Lisp-y aesthetics of programming directly in the AST representation through the structure of parenthesis based blocks will find this very pretty.</p>
<p>I personally spent years looking into code like this (Common Lisp, Elisp, Scheme, etc) and I still can't get used to it. Once you have a competent editor such as Emacs, that can deal with the proper parenthesis handling, it's easier, yes, but I still can't find the joy in doing this kind of hackish syntax.</p>
<p>Elixir is not just a new syntax on top of Erlang, as the great book <a href="https://pragprog.com/book/cmelixir/metaprogramming-elixir">Metaprogramming Elixir</a> will teach you, it opens up the entire Erlang BEAM AST through the usage of the <a href="https://elixir-lang.org/getting-started/meta/quote-and-unquote.html">quote/unquote</a> mechanics, making programming directly into the AST through <a href="https://elixir-lang.org/getting-started/meta/macros.html">"Hygienic Macros"</a> a breeze. It's really the best of both worlds of having a modern, good looking, joyful syntax and the same power a Lisp-y language gives you in terms of well behaved macros.</p>
<p>Now, this is the same example as above, in Elixir:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">ExPingPongTut15</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">ping</span>(<span style="color:#00D;font-weight:bold">0</span>, pong_pid) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    send pong_pid, <span style="color:#A60">:finished</span><tt>
</tt>    <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ping finished</span><span style="color:#710">"</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">ping</span>(n, pong_pid) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    send pong_pid, {<span style="color:#A60">:ping</span>, <span style="color:#038;font-weight:bold">self</span>}<tt>
</tt>    receive <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#A60">:pong</span> -&gt; <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Ping received pong</span><span style="color:#710">"</span></span>)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    ping(n - <span style="color:#00D;font-weight:bold">1</span>, pong_pid)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pong</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    receive <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#A60">:finished</span> -&gt; <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Pong finished</span><span style="color:#710">"</span></span>)<tt>
</tt>      {<span style="color:#A60">:ping</span>, ping_pid} -&gt;<tt>
</tt>        <span style="color:#036;font-weight:bold">IO</span>.puts(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Pong received ping</span><span style="color:#710">"</span></span>)<tt>
</tt>        send ping_pid, <span style="color:#A60">:pong</span><tt>
</tt>        pong()<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">start</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    pong_pid = spawn(fn -&gt; pong <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>    spawn(fn -&gt; ping(<span style="color:#00D;font-weight:bold">3</span>, pong_pid) <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Because of the power of pattern matching in the functions arguments signature, you can define 2 separated functions, avoiding the "if" as in the Clojure example. Of course, because it's Clojure and it has a complete macro system, and because it's <a href="https://github.com/clojure/core.match">core.match</a> has the proper pattern matching mechanisms, you can emulate the same thing through external libraries such as <a href="https://github.com/killme2008/defun">defun</a> though.</p>
<p>This was just a simple exercise, I hope it shed some light on the basic similarities between these 3 languages. And as "ugly" as Erlang may feel, I still feel more comfortable with its quirks then nested parenthesis.</p>
<p></p>
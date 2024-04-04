---
title: "Tradução: Lisp em Ruby"
date: "2008-01-27T07:42:00.000Z"
tags: ["beginner", "ruby", "lisp"]
years: "2008"
---

<p></p>
<p>Cá estou eu, trabalhando no meio da madrugada, quando apareceu <a href="http://onestepback.org/index.cgi/Tech/Ruby/LispInRuby.red">este post</a> de ninguém menos que Jim Weirich. Ele literalmente implementou um pequeno interpretador de Lisp … em Ruby!! Achei o feito tão interessante que resolvi traduzir o post para os interessados. Vamos lá:</p>
<h3>Manual do Programador de Lisp 1.5</h3>
<p>Eu esbarrei <a href="http://bc.tech.coop/blog/080101.html">nisto</a> no blog do Bill Clementson e lembrei de usar o manual do programador de Lisp 1.5 na época da faculdade. Tenho fortes memórias dessa página em particular no manual e eu tentando entender suas nuances.</p>
<p>Se você nunca leu o Manual do Programador de Lisp 1.5, a página 13 é a entranha de um interpretador Lisp, as funções “eval” e “apply”. É escrito em Lisp, embora a notação usada seja um pouco estranha. O interpretador inteiro (menos duas funções utilitárias) é apresentado em uma única página do livro. Isso que é definição concisa de linguagem!</p>
<h3>Em Ruby?</h3>
<p>Eu frequentemente penso sobre implementar um interpretador Lisp, mas antigamente, o pensamento de implementar um garbage collector e todo o runtime era um pouco demais. Isso foi numa época antes do C, então minha linguagem de implementação teria sido assembler … eca.</p>
<p>Mas enquanto eu revia a página, percebi que com as linguagens modernas de hoje eu provavelmente poderia simplesmente converter as estranhas Expressões-M usadas na página 13 diretamente em código. Então … por que não?</p>
<p></p>
<p></p>
<h3>O Código</h3>
<p>Aqui vai o código fonte completo em Ruby do interpretador Lisp da página 13 do manual do programador de Lisp:</p>
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
<a href="#n24" name="n24">24</a>
<a href="#n25" name="n25">25</a>
<a href="#n26" name="n26">26</a>
<a href="#n27" name="n27">27</a>
<a href="#n28" name="n28">28</a>
<a href="#n29" name="n29">29</a>
<strong><a href="#n30" name="n30">30</a></strong>
<a href="#n31" name="n31">31</a>
<a href="#n32" name="n32">32</a>
<a href="#n33" name="n33">33</a>
<a href="#n34" name="n34">34</a>
<a href="#n35" name="n35">35</a>
<a href="#n36" name="n36">36</a>
<a href="#n37" name="n37">37</a>
<a href="#n38" name="n38">38</a>
<a href="#n39" name="n39">39</a>
<strong><a href="#n40" name="n40">40</a></strong>
<a href="#n41" name="n41">41</a>
<a href="#n42" name="n42">42</a>
<a href="#n43" name="n43">43</a>
<a href="#n44" name="n44">44</a>
<a href="#n45" name="n45">45</a>
<a href="#n46" name="n46">46</a>
<a href="#n47" name="n47">47</a>
<a href="#n48" name="n48">48</a>
<a href="#n49" name="n49">49</a>
<strong><a href="#n50" name="n50">50</a></strong>
<a href="#n51" name="n51">51</a>
<a href="#n52" name="n52">52</a>
<a href="#n53" name="n53">53</a>
<a href="#n54" name="n54">54</a>
<a href="#n55" name="n55">55</a>
<a href="#n56" name="n56">56</a>
<a href="#n57" name="n57">57</a>
<a href="#n58" name="n58">58</a>
<a href="#n59" name="n59">59</a>
<strong><a href="#n60" name="n60">60</a></strong>
<a href="#n61" name="n61">61</a>
<a href="#n62" name="n62">62</a>
<a href="#n63" name="n63">63</a>
<a href="#n64" name="n64">64</a>
<a href="#n65" name="n65">65</a>
<a href="#n66" name="n66">66</a>
<a href="#n67" name="n67">67</a>
<a href="#n68" name="n68">68</a>
<a href="#n69" name="n69">69</a>
<strong><a href="#n70" name="n70">70</a></strong>
<a href="#n71" name="n71">71</a>
<a href="#n72" name="n72">72</a>
<a href="#n73" name="n73">73</a>
<a href="#n74" name="n74">74</a>
<a href="#n75" name="n75">75</a>
<a href="#n76" name="n76">76</a>
<a href="#n77" name="n77">77</a>
<a href="#n78" name="n78">78</a>
<a href="#n79" name="n79">79</a>
<strong><a href="#n80" name="n80">80</a></strong>
<a href="#n81" name="n81">81</a>
<a href="#n82" name="n82">82</a>
<a href="#n83" name="n83">83</a>
<a href="#n84" name="n84">84</a>
<a href="#n85" name="n85">85</a>
<a href="#n86" name="n86">86</a>
<a href="#n87" name="n87">87</a>
<a href="#n88" name="n88">88</a>
<a href="#n89" name="n89">89</a>
<strong><a href="#n90" name="n90">90</a></strong>
<a href="#n91" name="n91">91</a>
<a href="#n92" name="n92">92</a>
<a href="#n93" name="n93">93</a>
<a href="#n94" name="n94">94</a>
<a href="#n95" name="n95">95</a>
<a href="#n96" name="n96">96</a>
<a href="#n97" name="n97">97</a>
<a href="#n98" name="n98">98</a>
<a href="#n99" name="n99">99</a>
<strong><a href="#n100" name="n100">100</a></strong>
<a href="#n101" name="n101">101</a>
<a href="#n102" name="n102">102</a>
<a href="#n103" name="n103">103</a>
<a href="#n104" name="n104">104</a>
<a href="#n105" name="n105">105</a>
<a href="#n106" name="n106">106</a>
<a href="#n107" name="n107">107</a>
<a href="#n108" name="n108">108</a>
<a href="#n109" name="n109">109</a>
<strong><a href="#n110" name="n110">110</a></strong>
<a href="#n111" name="n111">111</a>
<a href="#n112" name="n112">112</a>
<a href="#n113" name="n113">113</a>
<a href="#n114" name="n114">114</a>
<a href="#n115" name="n115">115</a>
<a href="#n116" name="n116">116</a>
<a href="#n117" name="n117">117</a>
<a href="#n118" name="n118">118</a>
<a href="#n119" name="n119">119</a>
<strong><a href="#n120" name="n120">120</a></strong>
<a href="#n121" name="n121">121</a>
<a href="#n122" name="n122">122</a>
<a href="#n123" name="n123">123</a>
<a href="#n124" name="n124">124</a>
<a href="#n125" name="n125">125</a>
<a href="#n126" name="n126">126</a>
<a href="#n127" name="n127">127</a>
<a href="#n128" name="n128">128</a>
<a href="#n129" name="n129">129</a>
<strong><a href="#n130" name="n130">130</a></strong>
<a href="#n131" name="n131">131</a>
<a href="#n132" name="n132">132</a>
<a href="#n133" name="n133">133</a>
<a href="#n134" name="n134">134</a>
<a href="#n135" name="n135">135</a>
<a href="#n136" name="n136">136</a>
<a href="#n137" name="n137">137</a>
<a href="#n138" name="n138">138</a>
<a href="#n139" name="n139">139</a>
<strong><a href="#n140" name="n140">140</a></strong>
<a href="#n141" name="n141">141</a>
<a href="#n142" name="n142">142</a>
<a href="#n143" name="n143">143</a>
<a href="#n144" name="n144">144</a>
<a href="#n145" name="n145">145</a>
<a href="#n146" name="n146">146</a>
<a href="#n147" name="n147">147</a>
<a href="#n148" name="n148">148</a>
<a href="#n149" name="n149">149</a>
<strong><a href="#n150" name="n150">150</a></strong>
<a href="#n151" name="n151">151</a>
<a href="#n152" name="n152">152</a>
<a href="#n153" name="n153">153</a>
<a href="#n154" name="n154">154</a>
<a href="#n155" name="n155">155</a>
<a href="#n156" name="n156">156</a>
<a href="#n157" name="n157">157</a>
<a href="#n158" name="n158">158</a>
<a href="#n159" name="n159">159</a>
<strong><a href="#n160" name="n160">160</a></strong>
<a href="#n161" name="n161">161</a>
<a href="#n162" name="n162">162</a>
<a href="#n163" name="n163">163</a>
<a href="#n164" name="n164">164</a>
<a href="#n165" name="n165">165</a>
<a href="#n166" name="n166">166</a>
<a href="#n167" name="n167">167</a>
<a href="#n168" name="n168">168</a>
<a href="#n169" name="n169">169</a>
<strong><a href="#n170" name="n170">170</a></strong>
<a href="#n171" name="n171">171</a>
<a href="#n172" name="n172">172</a>
<a href="#n173" name="n173">173</a>
<a href="#n174" name="n174">174</a>
<a href="#n175" name="n175">175</a>
<a href="#n176" name="n176">176</a>
<a href="#n177" name="n177">177</a>
<a href="#n178" name="n178">178</a>
<a href="#n179" name="n179">179</a>
<strong><a href="#n180" name="n180">180</a></strong>
<a href="#n181" name="n181">181</a>
<a href="#n182" name="n182">182</a>
<a href="#n183" name="n183">183</a>
<a href="#n184" name="n184">184</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Object</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">lisp_string</span>
    to_s
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">NilClass</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">lisp_string</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nil</span><span style="color:#710">"</span></span> 
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Array</span>
  <span style="color:#777"># Convert an Array into an S-expression </span>
  <span style="color:#777"># (i.e. linked list).</span>
  <span style="color:#777"># Subarrays are converted as well.</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">sexp</span>
    result = <span style="color:#069">nil</span>
    reverse.each <span style="color:#080;font-weight:bold">do</span> |item|
      item = item.sexp <span style="color:#080;font-weight:bold">if</span> item.respond_to?(<span style="color:#A60">:sexp</span>)
      result = cons(item, result)
    <span style="color:#080;font-weight:bold">end</span>
    result
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># The Basic Lisp Cons cell data structures.  </span>
<span style="color:#777"># Cons cells consist of a head and a tail.</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Cons</span>
  attr_reader <span style="color:#A60">:head</span>, <span style="color:#A60">:tail</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(head, tail)
    <span style="color:#33B">@head</span>, <span style="color:#33B">@tail</span> = head, tail
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> (other)
    <span style="color:#080;font-weight:bold">return</span> <span style="color:#069">false</span> <span style="color:#080;font-weight:bold">unless</span> other.class  <span style="color:#036;font-weight:bold">Cons</span>
    <span style="color:#080;font-weight:bold">return</span> <span style="color:#069">true</span> <span style="color:#080;font-weight:bold">if</span> <span style="color:#069">self</span>.object_id  other.object_id
    <span style="color:#080;font-weight:bold">return</span> car(<span style="color:#069">self</span>)  car(other) &amp;&amp; cdr(<span style="color:#069">self</span>) == cdr(other)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#777"># Convert the lisp expression to a string.</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">lisp_string</span>
    e = <span style="color:#069">self</span>
    result = <span style="color:#F00;background-color:#FAA">“</span>(<span style="color:#F00;background-color:#FAA">”</span> 
    <span style="color:#080;font-weight:bold">while</span> e
      <span style="color:#080;font-weight:bold">if</span> e.class != <span style="color:#036;font-weight:bold">Cons</span>
        result &lt;&lt; <span style="color:#F00;background-color:#FAA">”</span>. <span style="color:#F00;background-color:#FAA">”</span> &lt;&lt; e.lisp_string
        e = <span style="color:#069">nil</span>
      <span style="color:#080;font-weight:bold">else</span>
        result &lt;&lt; car(e).lisp_string
        e = cdr(e)
        result &lt;&lt; <span style="color:#F00;background-color:#FAA">”</span> <span style="color:#F00;background-color:#FAA">”</span> <span style="color:#080;font-weight:bold">if</span> e
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
    result &lt;&lt; <span style="color:#F00;background-color:#FAA">“</span>)<span style="color:#F00;background-color:#FAA">”</span> 
    result
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Lisp Primitive Functions.</span>
<span style="color:#777"># It is an atom if it is not a cons cell.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">atom?</span>(a)
  a.class != <span style="color:#036;font-weight:bold">Cons</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Get the head of a list.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">car</span>(e)
  e.head
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Get the tail of a list.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">cdr</span>(e)
  e.tail
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Construct a new list from a head and a tail.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">cons</span>(h,t)
  <span style="color:#036;font-weight:bold">Cons</span>.new(h,t)
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Here is the guts of the Lisp interpreter. </span>
<span style="color:#777">#  Apply and eval work together to interpret </span>
<span style="color:#777"># the S-expression.  These definitions are taken</span>
<span style="color:#777"># directly from page 13 of the Lisp 1.5 </span>
<span style="color:#777"># Programmer’s Manual.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">apply</span>(fn, x, a)
  <span style="color:#080;font-weight:bold">if</span> atom?(fn)
    <span style="color:#080;font-weight:bold">case</span> fn
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:car</span> <span style="color:#080;font-weight:bold">then</span> caar(x)
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:cdr</span> <span style="color:#080;font-weight:bold">then</span> cdar(x)
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:cons</span> <span style="color:#080;font-weight:bold">then</span> cons(car(x), cadr(x))
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:atom</span> <span style="color:#080;font-weight:bold">then</span> atom?(car(x))
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:eq</span> <span style="color:#080;font-weight:bold">then</span> car(x)  cadr(x)
    <span style="color:#080;font-weight:bold">else</span>
      apply(eval(fn,a), x, a)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">elsif</span> car(fn)  <span style="color:#A60">:lambda</span>
    eval(caddr(fn), pairlis(cadr(fn), x, a))
  <span style="color:#080;font-weight:bold">elsif</span> car(fn)  <span style="color:#A60">:label</span>
    apply(caddr(fn), x, 
      cons(cons(cadr(fn), caddr(fn)), a))
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">eval</span>(e,a)
  <span style="color:#080;font-weight:bold">if</span> atom?(e)
    cdr(assoc(e,a))
  <span style="color:#080;font-weight:bold">elsif</span> atom?(car(e))
    <span style="color:#080;font-weight:bold">if</span> car(e)  <span style="color:#A60">:quote</span>
      cadr(e)
    <span style="color:#080;font-weight:bold">elsif</span> car(e)  <span style="color:#A60">:cond</span>
      evcon(cdr(e),a)
    <span style="color:#080;font-weight:bold">else</span>
      apply(car(e), evlis(cdr(e), a), a)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">else</span>
    apply(car(e), evlis(cdr(e), a), a)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># And now some utility functions used </span>
<span style="color:#777"># by apply and eval.  These are</span>
<span style="color:#777"># also given in the Lisp 1.5</span>
<span style="color:#777"># Programmer's Manual.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">evcon</span>(c,a)
  <span style="color:#080;font-weight:bold">if</span> eval(caar(c), a)
    eval(cadar(c), a)
  <span style="color:#080;font-weight:bold">else</span>
    evcon(cdr(c), a)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">evlis</span>(m, a)
  <span style="color:#080;font-weight:bold">if</span> m.nil?
    <span style="color:#069">nil</span>
  <span style="color:#080;font-weight:bold">else</span>
    cons(eval(car(m),a), evlis(cdr(m), a))
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">assoc</span>(a, e)
  <span style="color:#080;font-weight:bold">if</span> e.nil?
    fail <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>a.inspect<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> not bound</span><span style="color:#710">"</span></span> 
  <span style="color:#080;font-weight:bold">elsif</span> a  caar(e)
    car(e)
  <span style="color:#080;font-weight:bold">else</span>
    assoc(a, cdr(e))
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">pairlis</span>(vars, vals, a)
  <span style="color:#080;font-weight:bold">while</span> vars &amp;&amp; vals
    a = cons(cons(car(vars), car(vals)), a)
    vars = cdr(vars)
    vals = cdr(vals)
  <span style="color:#080;font-weight:bold">end</span>
  a
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Handy lisp utility functions built on car and cdr.</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">caar</span>(e)
  car(car(e))
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">cadr</span>(e)
  car(cdr(e))
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">caddr</span>(e)
  car(cdr(cdr(e)))
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">cdar</span>(e)
  cdr(car(e))
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">cadar</span>(e)
  car(cdr(car(e)))
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>O Exemplo</h3>
<p>E para provar, aqui vai um exemplo de programa em Lisp. Eu não me incomodei em escrever um parser de Lisp, então preciso escrever as listas em notação de Array padrão de Ruby (que é convertido em uma lista ligada via o método ‘sexp’).</p>
<p>Aqui vai o programa ruby usando o interpretador Lisp. O sistema Lisp é muito primitivo. A única maneira de definir uma função necessária é colocá-la em uma estrutura de ambiente, que é simplesmente uma lista de associação de chaves e valores.</p>
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
<a href="#n24" name="n24">24</a>
<a href="#n25" name="n25">25</a>
<a href="#n26" name="n26">26</a>
<a href="#n27" name="n27">27</a>
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">lisp</span><span style="color:#710">'</span></span>
<span style="color:#777"># Create an environment where </span>
<span style="color:#777"># the reverse, rev_shift and null</span>
<span style="color:#777"># functions are bound to an </span>
<span style="color:#777"># appropriate identifier.</span>
env = [
  cons(<span style="color:#A60">:rev_shift</span>,
    [<span style="color:#A60">:lambda</span>, [<span style="color:#A60">:list</span>, <span style="color:#A60">:result</span>],
      [<span style="color:#A60">:cond</span>,
        [[<span style="color:#A60">:null</span>, <span style="color:#A60">:list</span>], <span style="color:#A60">:result</span>],
        [<span style="color:#A60">:t</span>, [<span style="color:#A60">:rev_shift</span>, [<span style="color:#A60">:cdr</span>, <span style="color:#A60">:list</span>],
            [<span style="color:#A60">:cons</span>, [<span style="color:#A60">:car</span>, <span style="color:#A60">:list</span>], <span style="color:#A60">:result</span>]]]]].sexp),
  cons(<span style="color:#A60">:reverse</span>,
    [<span style="color:#A60">:lambda</span>, [<span style="color:#A60">:list</span>], [<span style="color:#A60">:rev_shift</span>, <span style="color:#A60">:list</span>, <span style="color:#069">nil</span>]].sexp),
  cons(<span style="color:#A60">:null</span>, [<span style="color:#A60">:lambda</span>, [<span style="color:#A60">:e</span>], [<span style="color:#A60">:eq</span>, <span style="color:#A60">:e</span>, <span style="color:#069">nil</span>]].sexp),
  cons(<span style="color:#A60">:t</span>, <span style="color:#069">true</span>), 
  cons(<span style="color:#069">nil</span>, <span style="color:#069">nil</span>)
].sexp
<span style="color:#777"># Evaluate an S-Expression and print the result</span>
exp = [<span style="color:#A60">:reverse</span>, [<span style="color:#A60">:quote</span>, [<span style="color:#A60">:a</span>, <span style="color:#A60">:b</span>, <span style="color:#A60">:c</span>, <span style="color:#A60">:d</span>, <span style="color:#A60">:e</span>]]].sexp
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">EVAL: </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>exp.lisp_string<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span> 
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">  =&gt;  </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>eval(exp,env).lisp_string<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O programa imprime:</p>
<macro:code>
  <p>$ ruby reverse.rb<br>
    <span class="caps">EVAL</span>: (reverse (quote (a b c d e)))<br>
    =&gt; (e d c b a)
  </p>
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
</pre>
        </td>
        <td class="code"><pre>Tudo que preciso fazer é escrever um parser Lisp e um REPL, e pronto!
h3. O Exemplo em Notação Padrão Lisp
Se achou o código Lisp "rubizado" difícil de ler, aqui vai a função reversa escrita em uma maneira mais "lispeira":
--- lisp
(defun reverse (list)
  (rev-shift list nil))
(defun rev-shift (list result)
  (cond ((null list) result)
        (t (rev-shift (cdr list) (cons (car list) result))) ))
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p></p>
  <h4>tags: <span class="label label-important"><a href="/learning">learning</a></span> <span class="label label-important"><a href="/beginner">beginner</a></span> <span class="label label-important"><a href="/ruby">ruby</a></span> <span class="label label-important"><a href="/lisp">lisp</a></span></h4>
</macro:code>
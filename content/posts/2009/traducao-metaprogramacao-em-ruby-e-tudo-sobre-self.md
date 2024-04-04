---
title: "[Tradução] Metaprogramação em Ruby: é tudo sobre Self"
date: "2009-11-16T16:56:00.000Z"
tags: ["ruby", "translation", "beginner"]
years: "2009"
---

<p></p>
<p>Hoje o <a href="http://yehudakatz.com/2009/11/15/metaprogramming-in-ruby-its-all-about-the-self/">Yehuda Katz</a> publicou um artigo muito didático sobre metaprogramação em Ruby que achei legal traduzir. Aí vai:</p>
<p>Depois de escrever <a href="http://yehudakatz.com/2009/11/12/better-ruby-idioms/">meu último post</a> sobre idiomas de plugins Rails, eu percebi que metaprogramação Ruby, no fundo, é na realidade bem simples.</p>
<p></p>
<p></p>
<p>Tem a ver com o fato de que todo código Ruby é executado – não há separação entre fases de compilação e runtime, cada linha de código é executado contra um <em>self</em> particular. Considere os próximos 5 trechos de código:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">species</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">self</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">species</span>
      <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">species</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Person</span>.instance_eval <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">species</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#036;font-weight:bold">Person</span>.<span style="color:#06B;font-weight:bold">species</span>
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Todos os 5 trechos definem um <code>Person.species</code> que retornam <code>Homo Sapiens</code>. Agora considere outro conjunto de trechos:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">name</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Matz</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Person</span>.class_eval <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">name</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Matz</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Todos esses trechos definem um método chamado <code>name</code> na classe Person. Então <code>Person.new</code> retornará “Matz”. Para aqueles familiarizados com Ruby, isso não é novidade. Quando se aprende sobre metaprogramação, cada um desses trechos é apresentado de forma isolada: outro mecanismo para colocar métodos onde eles “pertencem”. Na verdade, entretanto, existe uma única explicação unificada de porque todos esses trechos de cóigo funcionam da forma como funcionam.</p>
<p>Primeiro, é importante entender como a metaclasse de Ruby funciona. Quando você aprende Ruby, você aprende sobre o conceito de classe, e que cada objeto de Ruby tem um:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Person</span>.class <span style="color:#777">#=&gt; Class</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Class</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">loud_name</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>name.upcase<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">!</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Person</span>.loud_name <span style="color:#777">#=&gt; "PERSON!"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><code>Person</code> é uma instância de <code>Class</code>, então qualquer método adicionado a <code>Class</code> está disponível em <code>Person</code> também. O que não lhes é dito, entretanto, é que cada objeto em Ruby também tem seu próprio <strong>metaclass</strong>, uma <code>Class</code> que pode ter métodos, mas está anexado apenas ao objeto.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>matz = <span style="color:#036;font-weight:bold">Object</span>.new
<span style="color:#080;font-weight:bold">def</span> matz.<span style="color:#06B;font-weight:bold">speak</span>
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Place your burden to machine's shoulders</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que está acontecendo é que estamos adicionando o método <code>speak</code> à <strong>metaclass</strong> de <code>matz</code>, e o objeto <code>matz</code> herda de sua <strong>metaclass</strong> e depois de <code>Object</code>. A razão de porque isso não é tão claro é porque o metaclass é invisível em Ruby:</p>
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
      <td class="code"><pre>matz = <span style="color:#036;font-weight:bold">Object</span>.new
<span style="color:#080;font-weight:bold">def</span> matz.<span style="color:#06B;font-weight:bold">speak</span>
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Place your burden to machine's shoulders</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
matz.class <span style="color:#777">#=&gt; Object</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Na verdade, a “classe” de <code>matz</code> é sua metaclass invisível. Podemos ter acesso a essa metaclass assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>metaclass = <span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">matz</span>; <span style="color:#069">self</span>; <span style="color:#080;font-weight:bold">end</span>
metaclass.instance_methods.grep(<span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">speak</span><span style="color:#404">/</span></span>) <span style="color:#777">#=&gt; ["speak"]</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Até este ponto, você provavelmente está tendo que se esforçar para ter tantos detalhes na cabeça; parece que existem regras demais. E que diabos é isso de <code>class &lt;&lt; matz</code>?</p>
<p>Acontece que todas essas regras esquisitas se resumem em um conceito simples: controle sobre o <code>self</code> em uma determinada parte do código. Vamos retornar à um dos trechos que já vimos antes:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">name</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Matz</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#069">self</span>.name <span style="color:#777">#=&gt; "Person"</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui, estamos adicionando o método <code>nome</code> à classe <code>Person</code>. Quando dizemos <code>class Person</code>, o <code>self</code> até o fim do bloco é a própria classe <code>Person</code>.</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Person</span>.class_eval <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">name</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Matz</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#069">self</span>.name <span style="color:#777">#=&gt; "Person"</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui, estamos fazendo exatamente a mesma coisa: adicionando o método <code>name</code> a instâncias da classe Person. Neste caso, <code>class_eval</code> deixa o <code>self</code> ser o <code>Person</code> até o fim do bloco. Isso é perfeitamento direto quando se lida com classes, e igualmente direto quando se lida com metaclasses:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#036;font-weight:bold">Person</span>.<span style="color:#06B;font-weight:bold">species</span>
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Person</span>.name <span style="color:#777">#=&gt; "Person"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como no exemplo do <code>matz</code> anteriormente, estamos definindo o método <code>species</code> à metaclass de <code>Person</code>. Nós não manipulamos <code>self</code>, mas você pode ver o uso de <code>def</code> num objeto anexa o método à metaclass desse objeto.</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">species</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#069">self</span>.name <span style="color:#777">#=&gt; "Person"</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui, abrimos a classe <code>Person</code>, fazendo o <code>self</code> ser <code>Person</code> pela duração do bloco, como no exemplo acima. Entretanto, estamos definindo um método à metaclasse de <code>Person</code> aqui, já que estamos definindo o método em um objeto (<code>self</code>). Você também pode ver que <code>self.name</code> enquanto dentro da classe Person é idêntico a <code>Person.name</code> enquanto fora dela.</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">species</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#069">self</span>.name <span style="color:#777">#=&gt; ""</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ruby dá uma sintaxe para acessar a metaclass de um objeto diretamente. Fazendo <code>class &lt;&lt; Person</code>, estamos fazendo o <code>self</code> ser a metaclass de <code>Person</code> pela duração do bloco. Como resultado, o método <code>species</code> é adicionado à metaclass de <code>Person</code>, em vez da classe propriamente dita.</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>
  <span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">self</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">species</span>
      <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#069">self</span>.name <span style="color:#777">#=&gt; ""</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui, combinamos diversas técnicas. Primeiro, abrimos <code>Person</code>, tornando <code>self</code> igual à classe <code>Person</code>. Em seguida, fazemos <code>class &lt;&lt; self</code>, tornando <code>self</code> igual à metaclass de <code>Person</code>. Quando definimos o método <code>species</code>, ela é definida na metaclass de <code>Person</code>.</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Person</span>.instance_eval <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">species</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Homo Sapien</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#069">self</span>.name <span style="color:#777">#=&gt; "Person"</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O último caso, <code>instance_eval</code> na realidade faz algo interessante. Ela quebra o <code>self</code> no <code>self</code> que é usado para executar métodos e o <code>self</code> que é usado quando novos métodos são definidos. Quando <code>instance_eval</code> é usado, novos métodos são definidos na <strong>metaclass</strong>, mas o <code>self</code> é o próprio objeto.</p>
<p>Em alguns desses casos, as múltiplas formas de atingir a mesma coisa sai naturalmente da semântica de Ruby. Depois desta explicação, deve ficar claro que <code>def Person.species</code>, <code>class &lt;&lt; Person; def species,</code> e <code>class Person; class &lt;&lt; self; def species</code> não são três maneiras de fazer a mesma coisa que nasceram juntas, mas elas acabam saindo da própria flexibilidade do Ruby em relação a o que o <code>self</code> é em determinado ponto do seu programa.</p>
<p>Por outro lado, <code>class_eval</code> é um pouco diferente. Porque ele recebe um bloco, em vez de agir como uma palavra-reservada, ela captura as variáveis locais ao redor dela. Isso fornece a possibilidade poderosas capacidades de DSLs, em adição a controlar o <code>self</code> usado em um bloco de código. Mas além disso, ele é idêntico às outras construções aqui.</p>
<p>Finalmente, <code>instance_eval</code> quebra o <code>self</code> em duas partes, ao mesmo tempo que dá acesso a variáveis definidas fora dela.<br>
  Na tabela a seguir, <em>define um novo escopo</em> significa que código dentro do bloco <strong>não</strong> tem acesso a variáveis locais fora do bloco.</p>
<table>
  <tbody>
    <tr>
      <td> <strong>mecanismo</strong> </td>
      <td> <strong>método de resolução</strong> </td>
      <td> <strong>definição de método</strong> </td>
      <td> <strong>novo escopo?</strong> </td>
    </tr>
    <tr>
      <td> <strong>class Person</strong> </td>
      <td> Person </td>
      <td> mesmo </td>
      <td> sim </td>
    </tr>
    <tr>
      <td> <strong>class &lt;&lt; Person</strong> </td>
      <td> metaclass do Person </td>
      <td> mesmo </td>
      <td> sim </td>
    </tr>
    <tr>
      <td> <strong>Person.class_eval</strong> </td>
      <td> Person </td>
      <td> mesmo </td>
      <td> não </td>
    </tr>
    <tr>
      <td> <strong>Person.instance_eval</strong> </td>
      <td> Person </td>
      <td> metaclass do Person </td>
      <td> não </td>
    </tr>
  </tbody>
</table>
<p>Também note que <code>class_eval</code> está apenas disponível a <code>Modules</code> (note que Class herda de Module) e é um sinônimo para <code>module_eval</code>. Além disso, <code>instance_exec</code>, que foi adicionado ao Ruby 1.8.7, funciona exatamente como <code>instance_eval</code>, exceto que ele também lhe permite enviar variáveis a um bloco.</p>
<p></p>
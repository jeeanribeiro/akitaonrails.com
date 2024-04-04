---
title: "Ruby 1.9 e Tail Call Optimization"
date: "2013-04-11T03:25:00.000Z"
tags: ["ruby"]
years: "2013"
---

<p></p>
<p>Se você sabe o que é <a href="http://c2.com/cgi/wiki?TailCallOptimization">Tail Call Optimization</a> (TCO), provavelmente também já deve ter ouvido falar que Ruby não suporta TCO. Se você não sabe o que é <a href="http://stackoverflow.com/questions/310974/what-is-tail-call-optimization">'tail call'</a> vale definir:</p>
<blockquote>
  <p>Em ciência da computação, um 'tail call' é uma sub-rotina que acontece dentro de uma procedure como sua ação final; ela pode produzir um retorno que é então imediatamente retornada pela procedure que a chamou.</p>
</blockquote>
<p><img src="http://s3.amazonaws.com/akitaonrails/assets/image_asset/image/332/busted.jpg" srcset="http://s3.amazonaws.com/akitaonrails/assets/image_asset/image/332/busted.jpg 2x" alt="Mito Detonado"></p>
<p></p>
<p></p>
<p>TCO também é chamado às vezes de <a href="https://stackoverflow.com/questions/1240539/what-is-tail-recursion-elimination">Tail Recursion Elimination</a>, que é uma parte de TCO na verdade. Esse nome é mais simples de entender. Todo programador sabe o que é uma <a href="https://bit.ly/154TwUO">recursão</a> - uma função que chama ela mesma em algum ponto - e como isso deve ser evitado sempre que possível por uma versão iterativa, para fugir do perigo de estourar a pilha pois recursão tem limite.</p>
<p>O equivalente <em>"hello world"</em> de recursão é o bom e velho <a href="https://en.wikipedia.org/wiki/Factorial">fatorial</a> que, em Ruby, poderíamos escrever desta forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fact</span>(n)
  n == <span style="color:#00D">0</span> ? <span style="color:#00D">1</span> : n * fact(n-<span style="color:#00D">1</span>)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Dependendo da versão do Ruby que estiver usando ela vai estourar num número n não muito alto. No meu Macbook Pro, com Ruby 1.9.3-p392, essa execução recursiva estoura com <tt>stack level too deep (SystemStackError)</tt> no n = 8180.</p>
<p>Quem estudou Algoritmos e Estruturas de Dados aprendeu a tentar buscar a versão não-recursiva. No caso do Ruby temos a sorte dela ser expressiva para poder ser escrita da seguinte forma com a ajuda de closures:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fact</span>(n)
  sum = <span style="color:#00D">1</span>
  sum.upto(n) { |i| sum *= i }
  sum
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esta versão vai aguentar valores muito mais altos que o vergonhoso 8180 da versão recursiva. Uma discussão que vi hoje o <a href="https://twitter.com/rafaelrosafu/status/322144896217669633">Rafael Rosa e o Henrique Bastos</a> twitando fala sobre porque <a href="https://neopythonic.blogspot.com.br/2009/04/tail-recursion-elimination.html">Python não suporta TCO</a>. Então, curioso, resolvi investigar o que eu achava que sabia: de que Ruby também não tem TCO. Mas acabei encontrando <a href="https://bugs.ruby-lang.org/issues/6602">esta issue de 5 meses atrás no Ruby Core</a> sobre habilitar TCO que <strong>já existe no MRI 1.9</strong> mas não é ativada por padrão.</p>
<p>Para possibilitar essa otimização, precisamos modificar a versão recursiva que mostrei antes para que ela não precise de um <a href="https://en.wikipedia.org/wiki/Call_stack">call stack</a>, e para isso a última ação precisa ser direto a chamada recursiva. Então a nova versão (ainda recursiva) fica assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">fact</span>(n, m = <span style="color:#00D">1</span>)
  n &lt; <span style="color:#00D">2</span> ? m : fact(n-<span style="color:#00D">1</span>, m*n)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No Ruby 1.9 você pode ativar o TCO e executar o código com tail call desta forma:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">RubyVM</span>::<span style="color:#036;font-weight:bold">InstructionSequence</span>.compile_option = {
  <span style="color:#A60">:tailcall_optimization</span> =&gt; <span style="color:#069">true</span>,
  <span style="color:#A60">:trace_instruction</span> =&gt; <span style="color:#069">false</span>
}
<span style="color:#036;font-weight:bold">RubyVM</span>::<span style="color:#036;font-weight:bold">InstructionSequence</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">&lt;&lt;-EOF</span></span>).eval<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">
  # código com tail call</span><span style="color:#710">
EOF</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vamos fazer um teste com o seguinte código:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">benchmark</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Test</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">fact_recursive</span>(n)
    n == <span style="color:#00D">0</span> ? <span style="color:#00D">1</span> : n * fact_recursive(n-<span style="color:#00D">1</span>)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">fact_tail_call</span>(n, m = <span style="color:#00D">1</span>)
    n &lt; <span style="color:#00D">2</span> ? m : fact_tail_call(n-<span style="color:#00D">1</span>, m*n)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">fact_iterative</span>(n)
    sum = <span style="color:#00D">1</span>
    sum.upto(n) { |i| sum *= i }
    sum
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fact1</span>(n)
  <span style="color:#036;font-weight:bold">Benchmark</span>.bm <span style="color:#080;font-weight:bold">do</span> |x|
    x.report { <span style="color:#036;font-weight:bold">Test</span>.fact_iterative(n) }
    x.report { <span style="color:#036;font-weight:bold">Test</span>.fact_tail_call(n) }
    x.report { <span style="color:#036;font-weight:bold">Test</span>.fact_recursive(n) }
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
fact1(<span style="color:#00D">8180</span>)
fact1(<span style="color:#00D">10000</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notem que vamos iniciar com o TCO <strong>desligado</strong> <tt>:tailcall_optimization =&gt; false</tt> e o resultado é o seguinte:</p>
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
      <td class="code"><pre>$ ruby factorial.rb
    user     system      total        real
0.030000   0.000000   0.030000 (  0.030289)
0.040000   0.010000   0.050000 (  0.056056)
0.030000   0.010000   0.040000 (  0.043861)
    user     system      total        real
0.050000   0.000000   0.050000 (  0.042917)
factorial.rb:14: stack level too deep (SystemStackError)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vejam que rodando até o limite de 8180 temos pouca diferença entre as versões iterativa não-recursiva, recursiva com tail call e recursiva normal. Mas com o valor mais alto de 10000 as versões recursivas estouram como esperado.</p>
<p>Agora vamos ativar o TCO:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">RubyVM</span>::<span style="color:#036;font-weight:bold">InstructionSequence</span>.compile_option = {
  <span style="color:#A60">:tailcall_optimization</span> =&gt; <span style="color:#069">true</span>,
  <span style="color:#A60">:trace_instruction</span> =&gt; <span style="color:#069">false</span>
}
<span style="color:#036;font-weight:bold">RubyVM</span>::<span style="color:#036;font-weight:bold">InstructionSequence</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">&lt;&lt;-EOF</span></span>).eval<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">
  require 'benchmark'
  module Test
    def self.fact_recursive(n)
      n == 0 ? 1 : n * fact_recursive(n-1)
    end
    def self.fact_tail_call(n, m = 1)
      n &lt; 2 ? m : fact_tail_call(n-1, m*n)
    end
    def self.fact_iterative(n)
      sum = 1
      sum.upto(n) { |i| sum *= i }
      sum
    end
  end
  def fact1(n)
    Benchmark.bm do |x|
      x.report { Test.fact_iterative(n) }
      x.report { Test.fact_tail_call(n) }
      x.report { Test.fact_recursive(n) }
    end
  end</span><span style="color:#710">
EOF</span></span>
fact1(<span style="color:#00D">8180</span>)
fact1(<span style="color:#00D">10000</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora temos o seguinte resultado:</p>
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
      <td class="code"><pre>$ ruby factorial.rb
    user     system      total        real
0.030000   0.000000   0.030000 (  0.030832)
0.030000   0.000000   0.030000 (  0.033130)
0.030000   0.000000   0.030000 (  0.029922)
    user     system      total        real
0.040000   0.000000   0.040000 (  0.043725)
0.050000   0.000000   0.050000 (  0.046619)
&lt;compiled&gt;:4: stack level too deep (SystemStackError)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Desta vez a versão com tail call sobrevive ao valor acima do meu limite de 8180 e a recursiva que não tem tail call estoura por causa da sequência de call stacks que ele é obrigado a fazer.</p>
<p>E podemos ir mais longe e chamar um valor bem maior como <tt>fact1(100_000)</tt>:</p>
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
      <td class="code"><pre>$ ruby factorial.rb
    user     system      total        real
5.190000   1.290000   6.480000 (  6.474756)
5.650000   2.010000   7.660000 (  7.676733)
&lt;compiled&gt;:4: stack level too deep (SystemStackError)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, podemos ver que a versão com recursão e tail call performance só um pouco pior que a versão iterativa não-recursiva.</p>
<p>Portanto, detonamos o mito de que Ruby não suporta Tail Call Optimization. Não sei ainda se existe algum efeito colateral mas pelo menos temos a opção de ativá-la e executá-la somente dentro da instância de <tt>RubyVM::InstructionSequence</tt>. Não consigo imaginar um caso de uso prático, então se souber de algum não deixe de comentar.</p>
<p></p>
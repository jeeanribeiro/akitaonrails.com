---
title: "Swift para Rubistas, Rápida Introdução"
date: "2014-06-03T20:01:00.000Z"
tags: ["beginner", "apple", "swift", "objective-c"]
years: "2014"
---

<p></p>
<p>Como vocês devem ter assistido no keynote de abertura da <a href="http://startupi.com.br/2014/apple-esta-retornando-suas-formas-jobs-ficaria-orgulhoso/">WWDC 2014</a>, a Apple lançou uma nova linguagem, mais moderna, para substituir o Objective-C como linguagem padrão para desenvolvimento de aplicações tanto OS X quanto iOS. Não se trata de uma nova "camada" mas uma linguagem que tecnicamente compila para o mesmo tipo de binário que o próprio Objective-C e mesmo C. Graças ao compilador que é implementado sobre LLVM isso se torna possível.</p>
<p>A linguagem Swift é um Objective-C com funcionalidades mais modernas e uma sintaxe mais elegante e menos verbosa. Já havia <a href="http://www.akitaonrails.com/Objective-C">publicado neste blog</a> anos atrás como o Objective-C e Ruby tem conceitos muito similares. E isso se deve à herança comum da linguagem Smalltalk.</p>
<p>Antes que algum afobado comece a trolar: o artigo não tem como objetivo dizer que Swift tem inspiração em Ruby ou que Ruby tem algum tipo de relação com Swift. Apenas aproveitando o fato de terem origens similares e funcionalidades que fazem sua programação ser próxima, quero usar o artigo para mostrar a rubistas algumas nuances do Swift.</p>
<p>Todos os exemplos de código foram extraídos do eBook <a href="https://itun.es/us/jEUH0.l">“The Swift Programming Language.”</a> que é uma boa introdução à linguagem. Mas para realmente tirar proveito é melhor conhecer a fundo Objective-C, C e obviamente, toda a documentação de APIs dos frameworks para iOS e OS X.</p>
<p></p>
<p></p>
<h2>Exemplos de Sintaxe</h2>
<p>Do ponto de vista da sintaxe, a linguagem está bem mais atraente. Vejamos um trecho muito simples em Swift:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> let actualNumber = possibleNumber.toInt() {
    println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span></span><span style="color:#F00;background-color:#FAA">\</span>(possibleNumber) has an integer value of <span style="color:#F00;background-color:#FAA">\</span>(actualNumber)<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
} <span style="color:#080;font-weight:bold">else</span> {
    println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span></span><span style="color:#F00;background-color:#FAA">\</span>(possibleNumber) could not be converted to an integer<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
}
<span style="color:#777">// prints "123 has an integer value of 123”</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E em Ruby:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> actual_number = possible_number &amp;&amp; possible_number.to_i
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>possible_number<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> has an integer value of </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>actual_number<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">else</span>
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>possible_number<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> could not be converted to an integer</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># prints "123 has an integer value of 123”</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Statements como "if" ou "for" não tem parênteses como em C, embora cada seção ainda seja separado por chaves "{}". Visualmente falando a diferença é bem pequena. Interpolação em strings tem uma sintaxe um pouco diferente mas no geral é muito semelhante.</p>
<p>As convenções de nomenclatura são diferentes: no Ruby usamos tudo em caixa baixa separado por underline e Swift ainda tem a herança de Objective-C de camel casing. Além disso Swift identa código com 4 espaços e Ruby com 2.</p>
<p>Vejamos outro exemplo em Swift:</p>
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
      <td class="code"><pre>func alignRight(var string: String, count: Int, pad: Character) -&gt; String {
    let amountToPad = count - countElements(string)
    <span style="color:#080;font-weight:bold">for</span> _ in <span style="color:#60E">1</span>...amountToPad {
        string = pad + string
    }
    <span style="color:#080;font-weight:bold">return</span> string
}
let originalString = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello</span><span style="color:#710">"</span></span>
let paddedString = alignRight(originalString, <span style="color:#00D">10</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">-</span><span style="color:#710">"</span></span>)
<span style="color:#777">// paddedString is equal to "-----hello"</span>
<span style="color:#777">// originalString is still equal to "hello”</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E o equivalente em Ruby seria:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">align_right</span>(string, count, pad)
  amount_to_pad = count - string.size
  (<span style="color:#00D">1</span>..amount_to_pad).each <span style="color:#080;font-weight:bold">do</span>
    string = pad + string
  <span style="color:#080;font-weight:bold">end</span>
  string
<span style="color:#080;font-weight:bold">end</span>
original_string = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello</span><span style="color:#710">"</span></span>
padded_string = align_right(original_string, <span style="color:#00D">10</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">-</span><span style="color:#710">"</span></span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A primeira semelhança é que Swift possui "Ranges" como em Ruby embora a notação seja oposta. Usamos ".." em Ruby para um range que inclui ambos os números extremos e "..." (3 pontos) para não incluir o último número. Em Swift é o contrário.</p>
<p>Em Swift, o correto é declarar os tipos dos argumentos e do valor de retorno e o "return" é explícito. No Ruby não tempos tipos pré-declarados e o retorno padrão é sempre o valor da última coisa executada. E falando em Ranges, tanto em Ruby quanto Swift podemos ter pattern matching de valores em intervalos:</p>
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
</pre>
      </td>
      <td class="code"><pre>let count = <span style="color:#00D">3</span>_000_000_000_000
let countedThings = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stars in the Milky Way</span><span style="color:#710">"</span></span>
var naturalCount: String
<span style="color:#080;font-weight:bold">switch</span> count {
<span style="color:#080;font-weight:bold">case</span> <span style="color:#00D">0</span>:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">no</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">case</span> <span style="color:#60E">1</span>..<span style="color:#60E">.3</span>:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a few</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">case</span> <span style="color:#60E">4</span>..<span style="color:#60E">.9</span>:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">several</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">case</span> <span style="color:#00D">1</span><span style="color:#60E">0</span>..<span style="color:#60E">.99</span>:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">tens of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">case</span> <span style="color:#00D">10</span><span style="color:#60E">0</span>..<span style="color:#60E">.999</span>:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hundreds of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">case</span> <span style="color:#00D">100</span><span style="color:#60E">0</span>..<span style="color:#60E">.999</span>_999:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">thousands of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">default</span>:
    naturalCount = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">millions and millions of</span><span style="color:#710">"</span></span>
}
println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">There are </span></span><span style="color:#F00;background-color:#FAA">\</span>(naturalCount) <span style="color:#F00;background-color:#FAA">\</span>(countedThings).<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby é praticamente a mesma coisa:</p>
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
      <td class="code"><pre>count = <span style="color:#00D">3_000_000_000_000</span>
counted_things = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stars in the Milky Way</span><span style="color:#710">"</span></span>
natural_count = <span style="color:#080;font-weight:bold">case</span> count
<span style="color:#080;font-weight:bold">when</span> <span style="color:#00D">0</span> <span style="color:#080;font-weight:bold">then</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">no</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> <span style="color:#00D">1</span>..<span style="color:#00D">3</span> <span style="color:#080;font-weight:bold">then</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a few</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> <span style="color:#00D">4</span>..<span style="color:#00D">9</span> <span style="color:#080;font-weight:bold">then</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">several</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> <span style="color:#00D">10</span>..<span style="color:#00D">99</span> <span style="color:#080;font-weight:bold">then</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">tens of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> <span style="color:#00D">100</span>..<span style="color:#00D">999</span> <span style="color:#080;font-weight:bold">then</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hundreds of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> <span style="color:#00D">1000</span>..<span style="color:#00D">999_999</span> <span style="color:#080;font-weight:bold">then</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">thousands of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">else</span>
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">millions and millions of</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">There are </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>natural_count<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>counted_things<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">.</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Swift e Ruby não precisam de "break" porque ele não cai para o próximo match. Ambos tem capacidade de comparar não só valores mas intervalos ou outros elementos. No caso, como Ruby tem return por default, não precisamos repetir a variável "natural_count" em cada ítem e o resultado geral do "case" vai para a única atribuição no topo.</p>
<p>Este outro trecho também é curioso:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> let roomCount = john.residence?.numberOfRooms {
    println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">John's residence has </span></span><span style="color:#F00;background-color:#FAA">\</span>(roomCount) room(s).<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
} <span style="color:#080;font-weight:bold">else</span> {
    println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Unable to retrieve the number of rooms.</span><span style="color:#710">"</span></span>)
}
<span style="color:#777">// prints "Unable to retrieve the number of rooms.”</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O "equivalente" em Ruby (se estivermos no Rails) seria:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> room_count = john.residence.try(<span style="color:#A60">:number_of_rooms</span>)
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">John's residence has </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>room_count<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> room(s).</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">else</span>
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Unable to retrieve the number of rooms.</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não é exatamente a mesma coisa. No Swift o "?" denota uma propriedade opcional e enviar uma mensagem a um objeto opcional devolve "nil". Na prática é quase a mesma coisa que o método <a href="https://guides.rubyonrails.org/active_support_core_extensions.html#try">#try</a> do ActiveSupport do Rails.</p>
<p>E falando em ActiveSupport o Swift herda <a href="https://code.tutsplus.com/tutorials/objective-c-succinctly-categories-and-extensions--mobile-22016">Categories</a> de Objective-C com o nome de Extensions, que é uma forma de estender a funcionalidade de uma classe que já existe:</p>
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
      <td class="code"><pre>extension Double {
    var km: Double { <span style="color:#080;font-weight:bold">return</span> self * <span style="color:#00D">1</span>_000<span style="color:#60E">.0</span> }
    var m: Double { <span style="color:#080;font-weight:bold">return</span> self }
    var cm: Double { <span style="color:#080;font-weight:bold">return</span> self / <span style="color:#00D">10</span><span style="color:#60E">0</span><span style="color:#60E">.0</span> }
    var mm: Double { <span style="color:#080;font-weight:bold">return</span> self / <span style="color:#00D">1</span>_000<span style="color:#60E">.0</span> }
    var ft: Double { <span style="color:#080;font-weight:bold">return</span> self / <span style="color:#60E">3</span><span style="color:#60E">.28084</span> }
}
let oneInch = <span style="color:#00D">2</span><span style="color:#60E">5</span><span style="color:#60E">.4</span>.mm
println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">One inch is </span></span><span style="color:#F00;background-color:#FAA">\</span>(oneInch) meters<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
<span style="color:#777">// prints "One inch is 0.0254 meters"</span>
let threeFeet = <span style="color:#60E">3</span>.ft
println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Three feet is </span></span><span style="color:#F00;background-color:#FAA">\</span>(threeFeet) meters<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
<span style="color:#777">// prints "Three feet is 0.914399970739201 meters”</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby podemos facilmente fazer a mesma coisa diretamente porque classes são sempre abertas:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Numeric</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">km</span>; <span style="color:#069">self</span> * <span style="color:#60E">1_000.0</span>; <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">m</span>; <span style="color:#069">self</span>; <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">cm</span>; <span style="color:#069">self</span> / <span style="color:#60E">100.0</span>; <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">mm</span>; <span style="color:#069">self</span> / <span style="color:#60E">1_000.0</span>; <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">ft</span>; <span style="color:#069">self</span> / <span style="color:#60E">3.28084</span>; <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
one_inch = <span style="color:#60E">25.4</span>.mm
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">One inch is </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>one_inch<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> meters</span><span style="color:#710">"</span></span>
three_feet = <span style="color:#00D">3</span>.ft
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Three feet is </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>three_feet<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> meters</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, o resultado é similar mas os princípios são diferentes. A começar que no caso do Ruby estou abrindo a classe que é pai de todos os números, não só dos Floats (Doubles), caso contrário o segundo exemplo que é um Integer não funciona ("3.ft", teria que ser explicitamente "3.0.ft").</p>
<p>Além disso no Swift ele declara uma variável de processamento dinâmico. Nas semelhanças veja que tanto Swift quanto Ruby usam "self" para se referir ao objeto interno. Ambos permitem usar a notação de underline para delimitar milhares ("1_000", por exemplo).</p>
<p>Um outro exemplo mais prático em Swift seria este:</p>
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
      <td class="code"><pre>extension Int {
    func repetitions(task: () -&gt; ()) {
        <span style="color:#080;font-weight:bold">for</span> i in <span style="color:#60E">0</span>..self {
            task()
        }
    }
}
<span style="color:#60E">3</span>.repetitions({
    println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello!</span><span style="color:#710">"</span></span>)
    })
<span style="color:#777">// Hello!</span>
<span style="color:#777">// Hello!</span>
<span style="color:#777">// Hello!</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E em Ruby já temos o equivalente ao método "repetitions" desta extension já implementada:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#00D">3</span>.times <span style="color:#080;font-weight:bold">do</span>
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello!</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em particular veja que o Swift define um método que recebe uma função anônima, um bloco propriamente dito. Ele passa esse bloco entre chaves como parâmetro do método. É o equivalente no Ruby que passamos o bloco também entre chaves ou entre "do; end".</p>
<p>Outras coisas que lembram muito Ruby é como ele trata tipos de coleções:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>var shoppingList = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Eggs</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Milk</span><span style="color:#710">"</span></span>]
shoppingList += [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Chocolate Spread</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Cheese</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Butter</span><span style="color:#710">"</span></span>]
shoppingList[<span style="color:#60E">4</span>..<span style="color:#60E">.6</span>] = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Bananas</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Apples</span><span style="color:#710">"</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse trecho quase que inteiramente se converte em como Ruby lida com arrays:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>shopping_list = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Eggs</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Milk</span><span style="color:#710">"</span></span>]
shopping_list += [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Chocolate Spread</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Cheese</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Butter</span><span style="color:#710">"</span></span>]
shopping_list[<span style="color:#00D">4</span>...<span style="color:#00D">6</span>] = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Bananas</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Apples</span><span style="color:#710">"</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O mesmo pode-se dizer de dicionários do Swift que são semelhantes a Hash no Ruby:</p>
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
      <td class="code"><pre>var airports = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">TYO</span><span style="color:#710">"</span></span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Tokyo</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">DUB</span><span style="color:#710">"</span></span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Dublin</span><span style="color:#710">"</span></span>]
airports[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">LHR</span><span style="color:#710">"</span></span>] = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">London</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">for</span> (airportCode, airportName) in airports {
    println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span></span><span style="color:#F00;background-color:#FAA">\</span>(airportCode): <span style="color:#F00;background-color:#FAA">\</span>(airportName)<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby seria:</p>
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
      <td class="code"><pre>airports = {<span style="color:#036;font-weight:bold">TYO</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Tokyo</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">DUB</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Dublin</span><span style="color:#710">"</span></span>}
airports[<span style="color:#A60">:LHR</span>] = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">London</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">for</span> airport_code, airport_name <span style="color:#080;font-weight:bold">in</span> airports
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>airport_code<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">: </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>airport_name<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em particular este último trecho, em Ruby, seria mais comumente escrito como:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>airports.each <span style="color:#080;font-weight:bold">do</span> |airport_code, airport_name|
  puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>airport_code<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">: </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>airport_name<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A diferença é que Swift inicializa dicionários com a mesma sintaxe de arrays, com colchetes. Em Ruby diferenciamos arrays com colchetes e hashes com chaves. Além disso é comum usar chaves como strings em Swift e Objective-C pois eles são imutáveis por padrão. Em Ruby strings são tecnicamente mutáveis e o equivalente a uma "string imutável" em Ruby são symbols. Ao ser interpolado dentro de uma string, um symbol automaticamente se converte em string.</p>
<p>Já um tipo que Swift e outras linguagens como Python tem, e Ruby não tem, são Tuples. De forma simplificada, se trata de uma lista heterogênea (como um array) de constantes. Em Ruby usamos um Array para o mesmo fim. E temos, novamente, usos similares:</p>
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
      <td class="code"><pre>let http404Error = (<span style="color:#00D">404</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Not Found</span><span style="color:#710">"</span></span>)
let (statusCode, statusMessage) = http404Error
println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">The status code is </span></span><span style="color:#F00;background-color:#FAA">\</span>(statusCode)<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
<span style="color:#777">// prints "The status code is 404"</span>
println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">The status message is </span></span><span style="color:#F00;background-color:#FAA">\</span>(statusMessage)<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">)</span></span><span style="color:#F00;background-color:#FAA"></span>
<span style="color:#777">// prints "The status message is Not Found”</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja que podemos decompor um Tuple de volta em variáveis de maneira similar em Ruby:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>http_404_error = [<span style="color:#00D">404</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Not Found</span><span style="color:#710">"</span></span>]
status_code, status_message = http_404_error
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">The status code is </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>status_code<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">The status message is </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>status_message<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Conclusão</h2>
<p>Isso foi apenas um rápido "tour" sobre as partes mais superficiais da linguagem. Swift ainda tem:</p>
<ul>
  <li>tipos Enum (diferente de funcionalidades de Enumeration do Ruby, não confundir)</li>
  <li>propriedades (getter, setter, weak references, etc)</li>
  <li>inicialização, deinicialização, ARC (procedimentos para automatic reference counting)</li>
  <li>tipos (type casting, nested types, generics, extensions, protocols)</li>
</ul>
<p>Diferente de linguagens como Go ou Scala, ela não tem diretamente na linguagem nenhuma construção para abstrair atores ou outras coisas de concorrência. Isso porque no Objective-C e no Swift vamos subir para o nível dos frameworks, em particular para o <a href="https://developer.apple.com/library/mac/documentation/performance/reference/gcd_libdispatch_ref/Reference/reference.html">Grand Central Dispatch</a> que basicamente funciona como um sistema de filas de processamento.</p>
<p>Como podem ver, Swift em si é uma linguagem bem minimalista. Sua intenção é ser um "sugar coating" sobre a cansada sintaxe do Objective-C, a cansativa rotina de lidar com arquivos de header e implementação, declaração estática de tipos em todos os lugares. Mas o que a linguagem não tem como "consertar" é a extensiva quantidade de APIs do Cocoa. Não se engane, é tudo muito bem organizado e consistente, diferente de outras plataformas.</p>
<p>Por exemplo, hoje (1 dia depois do anúncio da linguagem, para verem como a sintaxe é trivial de simples) já saiu um pequeno demo que é basicamente um <a href="https://github.com/fullstackio/FlappySwift">clone do famigerado Flappy Bird</a>, usando o SpriteKit como fundação. E veja um trecho mais realista:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#777">// skyline</span>
var skyTexture = SKTexture(imageNamed: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sky</span><span style="color:#710">"</span></span>)
skyTexture.filteringMode = SKTextureFilteringMode.Nearest
var moveSkySprite = SKAction.moveByX(-skyTexture.size().width * <span style="color:#60E">2</span><span style="color:#60E">.0</span>, y: <span style="color:#00D">0</span>, duration: NSTimeInterval(<span style="color:#60E">0</span><span style="color:#60E">.1</span> * skyTexture.size().width * <span style="color:#60E">2</span><span style="color:#60E">.0</span>))
var resetSkySprite = SKAction.moveByX(skyTexture.size().width * <span style="color:#60E">2</span><span style="color:#60E">.0</span>, y: <span style="color:#00D">0</span>, duration: <span style="color:#60E">0</span><span style="color:#60E">.0</span>)
var moveSkySpritesForever = SKAction.repeatActionForever(SKAction.sequence([moveSkySprite,resetSkySprite]))
<span style="color:#080;font-weight:bold">for</span> var i:CGFloat = <span style="color:#00D">0</span>; i &lt; <span style="color:#60E">2</span><span style="color:#60E">.0</span> + self.frame.size.width / ( skyTexture.size().width * <span style="color:#60E">2</span><span style="color:#60E">.0</span> ); ++i {
    var sprite = SKSpriteNode(texture: skyTexture)
    sprite.setScale(<span style="color:#60E">2</span><span style="color:#60E">.0</span>)
    sprite.zPosition = -<span style="color:#00D">20</span>;
    sprite.position = CGPointMake(i * sprite.size.width, sprite.size.height / <span style="color:#60E">2</span><span style="color:#60E">.0</span> + groundTexture.size().height * <span style="color:#60E">2</span><span style="color:#60E">.0</span>)
    sprite.runAction(moveSkySpritesForever)
    self.addChild(sprite)
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não é nada do outro mundo, só precisa se acostumar com as APIs. A documentação da Apple é muito bem feita e fácil de usar.</p>
<p></p>
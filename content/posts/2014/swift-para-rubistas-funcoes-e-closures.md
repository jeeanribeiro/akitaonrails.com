---
title: "Swift para Rubistas, Funções e Closures"
date: "2014-06-07T15:38:00.000Z"
tags: ["beginner", "apple", "swift", "objective-c"]
years: "2014"
---

<p></p>
<p>Se tem uma coisa que nós rubistas estamos muito acostumados e gostamos bastante são closures, blocos ou fechamentos. Expliquei esse mecanismo pela primeira vez em 2007 aqui no blog, então se ainda não conhece bem o conceito, releia <a href="http://www.akitaonrails.com/2007/11/30/anatomia-de-ruby-blocks-closures#.U5MdTBYduzA">meu post</a>.</p>
<p>Em 2010 a Apple adicionou a funcionalidade de closures ao Objective-C também e modificou muitas de suas APIs para aproveitar esse recurso. Também postei sobre isso 3 anos atrás, então releia <a href="http://www.akitaonrails.com/2010/11/28/objective-c-brincando-com-categorias-e-blocos#.U5MdhxYduzA">meu post</a> para aprender sobre isso.</p>
<p>Finalmente, Swift é basicamente Objective-C melhorado então temos o mesmo recurso.</p>
<p></p>
<p></p>
<h2>Entendendo Funções e Blocos</h2>
<p>A idéia é poder criar funções "customizáveis", ou seja, um pedaço de código que espera outro pedaço de código. Existem duas formas de se fazer isso. No mundo C podemos passar diretamente uma função como parâmetro para ser executada dentro de outra função. Isso não é uma closure, é o que chamamos de "callback". Em Objective-C e Swift, podemos passar uma função como parâmetro ou mesmo fazer uma função retornar uma função.</p>
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
      <td class="code"><pre>func soma(x: Int, y: Int) -&gt; Int {
    <span style="color:#080;font-weight:bold">return</span> x + y
}
func calculadora(calculo: (Int, Int) -&gt; (Int), a: Int, b: Int) {
    let resultado = calculo(a, b)
    println(resultado)
}
calculadora(soma, <span style="color:#00D">10</span>, <span style="color:#00D">20</span>)
<span style="color:#777">// "30"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja o código acima, definimos uma função de soma, que recebe dois inteiros como parâmetro e retorna um inteiro. Depois definimos uma função genérica chamada "calculadora" que recebe como parâmetro uma função com a assinatura <tt>(Int, Int) -&gt; Int</tt> que significa "uma função que receba dois inteiros e retorne um inteiro" e depois dois parâmetros inteiros.</p>
<p>Ao executar <tt>calculadora(soma, 10, 20)</tt>, passamos a função soma, os números 10 e 20 e internamente atribuímos a função soma a uma variável chamada "calculo" e executamos passando os dois inteiros, que, obviamente, serão somados. E a resposta no final será 30.</p>
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
      <td class="code"><pre>func multiplicacao(x: Int, y: Int) -&gt; Int {
    <span style="color:#080;font-weight:bold">return</span> x * y
}
calculadora(multiplicacao, <span style="color:#00D">3</span>, <span style="color:#00D">5</span>)
<span style="color:#777">// "15"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Podemos agora criar quaisquer funções com a mesma assinatura e depois mandar para a calculadora. Em Ruby não temos a mesma funcionalidade:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">soma</span>(x, y)
  x + y
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calculadora</span>(calculo, a, b)
  puts calculo(a, b)
<span style="color:#080;font-weight:bold">end</span>
calculadora(soma, <span style="color:#00D">10</span>, <span style="color:#00D">20</span>)
<span style="color:#777"># ArgumentError: wrong number of arguments (0 for 2)</span>
<span style="color:#777">#         from (irb):1:in `soma'</span>
<span style="color:#777">#         from (irb):9</span>
<span style="color:#777">#         from /usr/bin/irb:12:in `&lt;main&gt;'</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby, parênteses são opcionais e ao tentar passar o método "soma" como parâmetro, na verdade ele está já tentando executar o método. Existe uma forma, não ortodoxa, que podemos ter um efeito similar, mas não é a mesma coisa, seria assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calculadora</span>(calculo, a, b)
  puts send(calculo, a, b)
<span style="color:#080;font-weight:bold">end</span>
calculadora(<span style="color:#A60">:soma</span>, <span style="color:#00D">10</span>, <span style="color:#00D">20</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método <a href="https://ruby-doc.org/core-2.1.1/Object.html#method-i-send"><tt>send</tt></a> é uma das formas de se enviar mensagens a objetos (Objective-C também tem isso, na forma de seletores e do método <tt>performSelector</tt> que expliquei <a href="https://www.akitaonrails.com/2010/12/06/objective-c-method-missing#.U5MhaRYduzA">neste outro post</a>). Então, em vez de passar diretamente o método, passamos apenas o nome dele como um symbol e internamente executamos o método passando os parâmetros. Isso é só "similar" porque na prática o método em si nunca foi passado como parâmetro.</p>
<p>O que podemos fazer em Ruby é não usar métodos, mas blocos:</p>
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
      <td class="code"><pre>soma = lambda <span style="color:#080;font-weight:bold">do</span> |x, y|
  x + y
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calculadora</span>(calculo, a, b)
  puts calculo.(a, b)
<span style="color:#080;font-weight:bold">end</span>
calculadora(soma, <span style="color:#00D">10</span>, <span style="color:#00D">20</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui a semântica é diferente. Primeiro criamos um bloco, literalmente o que seria o "corpo de um método" usando <tt>lambda</tt>. Depois passamos o bloco com parâmetro ao método <tt>calculadora</tt>. E dentro dela executamos o bloco com um "ponto" antes dos parênteses, que é a forma curta de se fazer <tt>soma.call(a, b)</tt></p>
<p>Um bloco, em Ruby, é diferente de uma método ou função. Isso porque ele também é um fechamento do estado ao redor do bloco. Blocos não são métodos. Em Ruby, o método está associado ("binding") à classe que a define (mesmo sem definir um <tt>class</tt>, estamos dentro sempre dentro de um objeto, diferente de Swift ou Objective-C ou mesmo outra linguagem). Um bloco está associado à uma variável e por isso podemos mais facilmente repassá-la para outros métodos.</p>
<p>Em Swift também podemos devolver funções ou ter "Nested Functions", por exemplo:</p>
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
      <td class="code"><pre>func calculo(tipo: String) -&gt; (Int, Int) -&gt; Int {
    func soma(x: Int, y: Int) -&gt; Int {
        <span style="color:#080;font-weight:bold">return</span> x + y
    }
    func multiplicacao(x: Int, y: Int) -&gt; Int {
        <span style="color:#080;font-weight:bold">return</span> x * y
    }
    <span style="color:#080;font-weight:bold">if</span> tipo == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">soma</span><span style="color:#710">"</span></span> {
        <span style="color:#080;font-weight:bold">return</span> soma
    } <span style="color:#080;font-weight:bold">else</span> {
        <span style="color:#080;font-weight:bold">return</span> multiplicacao
    }
}
func calculadora(calculo: (Int, Int) -&gt; Int, a: Int, b: Int) {
    println(calculo(a, b))
}
calculadora(calculo(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">soma</span><span style="color:#710">"</span></span>), <span style="color:#00D">10</span>, <span style="color:#00D">20</span>)
<span style="color:#777">// 30</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby, o mais próximo, usando blocos, seria:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calculo</span>(tipo)
  soma = lambda { |x, y| x + y }
  multiplicacao = lambda { |x, y| x * y }
  <span style="color:#080;font-weight:bold">if</span> tipo == <span style="color:#A60">:soma</span>
    soma
  <span style="color:#080;font-weight:bold">else</span>
    multiplicacao
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calculadora</span>(c, a, b)
  puts c.(a, b)
<span style="color:#080;font-weight:bold">end</span>
calculadora(calculo(<span style="color:#A60">:soma</span>), <span style="color:#00D">10</span>, <span style="color:#00D">20</span>)
<span style="color:#777"># 30</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Entendendo Blocos em Swift</h2>
<p>Sabendo dessa base podemos prosseguir para o próximo passo, blocos em Swift.</p>
<p>Primeiro, vejamos o uso mais comum de blocos em Ruby:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">numero</span>(bla)
  <span style="color:#080;font-weight:bold">yield</span>(bla) <span style="color:#080;font-weight:bold">if</span> block_given?
<span style="color:#080;font-weight:bold">end</span>
numero <span style="color:#00D">20</span> <span style="color:#080;font-weight:bold">do</span> |x|
  x * <span style="color:#00D">10</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># 200</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Definimos um método chamado <tt>numero</tt> que recebe um parâmetro "bla". Internamente chamamos <tt>yield</tt> que pega o bloco passado como último parâmetro do método e repassa o parâmetro "bla" a ele. Fora, executamos o método frase, passando 20 como parâmetro e um bloco (delimitado por "do..end") que recebe uma variável x e apenas multiplica ela por 10.</p>
<p>Podemos reescrever o mesmo código da seguinte forma:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">numero</span>(bla, &amp;bloco)
  bloco.(bla) <span style="color:#080;font-weight:bold">if</span> bloco
<span style="color:#080;font-weight:bold">end</span>
numero(<span style="color:#00D">20</span>) { |x| x * <span style="color:#00D">10</span> }
<span style="color:#777"># 200</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É exatamente o mesmo código mas agora o bloco está definido como parâmetro mais explicitamente. O "&amp;" diz que vamos passar o bloco fora dos parênteses do método. Executamos o bloco dentro com o "ponto" (no lugar de "call", como explicamos antes). E ao executar o método, desta vez deixei os parênteses opcionais e no lugar de "do..end" usei "{}", que é a mesma coisa. Por convenção, em Ruby, usamos "{}" quando um bloco tem somente uma linha de implementação e usamos "do..end" quando tem múltiplas linhas.</p>
<p>Obs, o <a href="https://twitter.com/josevalim">@josevalim</a> me explicou que há outra sintaxe que podemos usar e são equivalentes (embora pareça que só funcione em one-lines):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>numero.map { (var x: Int) -&gt; Int in <span style="color:#080;font-weight:bold">return</span> x * <span style="color:#00D">10</span> }
numero.map { $<span style="color:#00D">0</span> * <span style="color:#00D">10</span> } <span style="color:#777">// equivalente ao de cima</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Confinuando, podemos fazer a mesma coisa em Swift, assim:</p>
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
      <td class="code"><pre>func numero(bla: Int, bloco: (Int) -&gt; Int) {
    println(bloco(bla))
}
numero(<span style="color:#00D">20</span>, { (x: Int) -&gt; Int in <span style="color:#080;font-weight:bold">return</span> x * <span style="color:#00D">10</span> } )
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Por causa da necessidade de definir o seletor/assinatura, com parâmetros e tipo de retorno, a execução da closure em Swift é bem mais verbosa do que em Ruby. A sintaxe é semelhante, usando chaves "{}" para delimitar o bloco, a assinatura para delimitar a função anônima e o corpo do bloco depois de "in". Na prática é quase a mesma coisa.</p>
<p>Do livro oficial da Apple temos o seguinte exemplo que pode demonstrar um pouco melhor (eu mudei o exemplo pois no livro ele usa um Dictionary para "digitNames" mas as chaves são exatamente a posição num Array, então achei melhor usar diretamente um Array):</p>
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
      <td class="code"><pre>let digitNames = [
        <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Zero</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">One</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Two</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Three</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Four</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Five</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Six</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Seven</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Eight</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Nine</span><span style="color:#710">"</span></span>
]
let numbers = [<span style="color:#00D">16</span>, <span style="color:#00D">58</span>, <span style="color:#00D">510</span>]
let strings = numbers.map {
    (var number) -&gt; String in
    var output = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">while</span> number &gt; <span style="color:#00D">0</span> {
        output = digitNames[number % <span style="color:#00D">10</span>] + output
        number /= <span style="color:#00D">10</span>
    }
    <span style="color:#080;font-weight:bold">return</span> output
}
<span style="color:#777">// strings is inferred to be of type String[]</span>
<span style="color:#777">// its value is ["OneSix", "FiveEight", "FiveOneZero"]</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A mesma coisa em Ruby ficaria assim:</p>
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
      <td class="code"><pre>digit_names = [
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Zero</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">One</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Two</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Three</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Four</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Five</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Six</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Seven</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Eight</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Nine</span><span style="color:#710">"</span></span>
]
numbers = [<span style="color:#00D">16</span>, <span style="color:#00D">58</span>, <span style="color:#00D">510</span>]
strings = numbers.map <span style="color:#080;font-weight:bold">do</span> |number|
  output = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">while</span> number &gt; <span style="color:#00D">0</span> 
    output = digit_names[number % <span style="color:#00D">10</span>] + output
    number = number / <span style="color:#00D">10</span>
  <span style="color:#080;font-weight:bold">end</span>
  output
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># ["OneSix", "FiveEight", "FiveOneZero"]</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja como a lógica em si é bastante semelhante, se ignorar a definição mais exata de tipos do Swift, os dois códigos são praticamente idênticos.</p>
<p>No <a href="https://www.akitaonrails.com/2010/12/06/objective-c-method-missing#.U5MhaRYduzA">meu post de 2010</a> sobre como implementar o equivalente a "method_missing" em Objective-C eu parti deste exemplo comum de DSL do mundo Ruby:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">builder</span><span style="color:#710">'</span></span>
x = <span style="color:#036;font-weight:bold">Builder</span>::<span style="color:#036;font-weight:bold">XmlMarkup</span>.new(<span style="color:#A60">:target</span> =&gt; <span style="color:#d70">$stdout</span>, <span style="color:#A60">:indent</span> =&gt; <span style="color:#00D">1</span>)
x.html <span style="color:#080;font-weight:bold">do</span> |h|
  h.body <span style="color:#080;font-weight:bold">do</span> |b|
    b.h1 <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>
    b.p <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">This is a paragraph.</span><span style="color:#710">"</span></span>
    b.table <span style="color:#080;font-weight:bold">do</span> |t|
      t.tr <span style="color:#080;font-weight:bold">do</span> |tr|
        tr.td <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">column</span><span style="color:#710">"</span></span>
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E cheguei neste equivalente em Objective-C:</p>
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
      <td class="code"><pre>XmlBuilder* xml = [[XmlBuilder alloc] init];
[xml htmlBlock:^(XmlBuilder* h) {
    [h bodyBlock:^(XmlBuilder* b) {
        [b h1:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>];
        [b p:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">This is a paragraph.</span><span style="color:#710">"</span></span>];
        [b tableBlock:^(XmlBuilder* t) {
            [t trBlock:^(XmlBuilder* tr) {
                [tr td:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">column</span><span style="color:#710">"</span></span>];
            }];
        }];            
    }];
}];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Absolutamente verborrágico! Não era divertido usar blocos em Objective-C pela quantidade de delimitadores com chaves, parênteses, colchetes. Em Ruby é bem mais simples porque parênteses são todos opcionais e blocos são delimitados quase como métodos.</p>
<p>Ainda não reimplementei esse experimento que fiz em Objective-C para Swift (fica como lição de casa). Farei isso num próximo artigo sobre metaprogramação e seletores em Swift. Mas se tivéssemos reescrito, provavelmente o código ficaria mais ou menos assim:</p>
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
      <td class="code"><pre><span style="color:#777">// Swift:                            // Ruby:</span>
xml = XmlBuilder()                   <span style="color:#777">// x = Builder::XmlMarkup.new</span>
xml.html({ (var h) -&gt; Void in        <span style="color:#777">// x.html do |h|</span>
    h.body({ (var b) -&gt; Void in      <span style="color:#777">//   h.body do |b|</span>
        b.h1(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>)          <span style="color:#777">//     b.h1 "Hello World"</span>
        b.p(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">This is a paragraph</span><span style="color:#710">"</span></span>)   <span style="color:#777">//     b.p "This is a paragraph."</span>
        b.table({ (var t) -&gt; Void in <span style="color:#777">//     b.table do |t|</span>
            t.tr({ (var tr) -&gt; Void  <span style="color:#777">//       t.tr do |tr|</span>
                tr.td(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">column</span><span style="color:#710">"</span></span>)      <span style="color:#777">//         tr.td "column"</span>
            })                       <span style="color:#777">//       end</span>
        })                           <span style="color:#777">//     end</span>
    })                               <span style="color:#777">//   end</span>
})                                   <span style="color:#777">// end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja que comparado à versão em Objective-C é "muito" melhor. Mesmo assim, se comparado ao que fazemos em Ruby, continua sendo mais verboso do que gostaríamos por causa dos parênteses obrigatórios e declaração de tipos das funções, mas agora sim fica muito mais prático ver que podemos fazer DSLs em Swift também.</p>
<p>Isso deve dar uma luz sobre como a nova sintaxe do Swift é de fato um real ganho de legibilidade e produtividade para programadores acostumados a Objective-C e como nós, de Ruby, podemos rapidamente nos adaptar a essa nova linguagem para produzir bibliotecas e frameworks. Uma vantagem do Swift é que ele é imediatamente compatível com toda a API escrita em Objective-C, portanto onde antes era chato escrever as closures, agora fica imediatamente mais simples.</p>
<p></p>
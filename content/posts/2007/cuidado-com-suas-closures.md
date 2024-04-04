---
title: "Cuidado com suas Closures"
date: "2007-12-21T16:52:00.000Z"
tags: ["beginner", "ruby"]
years: "2007"
---

<p></p>
<p>Recentemente eu <a href="http://www.akitaonrails.com/2007/11/30/anatomia-de-ruby-blocks-closures">escrevi um artigo</a> explicando como funcionam os blocos/fechamentos em Ruby. É um recurso muito poderoso de algumas linguagens dinâmicas como Ruby.</p>
<p>Porém todo recurso poderoso deve ser usado com algum cuidado. E nesse caso é a utilização excessiva em casos que podem levar a alguns problemas. Mas não se preocupem, não é algo que deve afetar a grande maioria das aplicações. De qualquer forma vale a pena entender a mecânica de blocos conforme explicado por <a href="http://ola-bini.blogspot.com/2007/12/ruby-closures-and-memory-usage.html">Ola Bini</a> que, aliás, recomendo muito a leitura de seu blog que trás muitos <em>behind-the-scenes</em> das mecânicas de Ruby.</p>
<p>Vamos à tradução:</p>
<p></p>
<p></p>
<p>Você já deve ter visto a tendência – venho gastando tempo olhando para uso de memória em situações com grandes aplicações. Em especial, as coisas que tenho olhado são na maioria sobre instalações onde um grande número de runtimes JRuby são necessários – mas não deixe isso o assustar. Essa informação é exatamente válida para Ruby normal quanto JRuby.</p>
<p>Uma das coisas que podem realmente causar alto uso de memória de forma não intencional em programas Ruby são blocos que vivem demais e que fecham sobre coisas que você não pretendia. Lembre-se, um fechamento (closure) de fato precisa fechar sobre todas as variáveis, os blocos ao redor e também o self no momento.</p>
<p>Digamos que você tenha um objeto de algum tupo que tem um método que retorna um Proc. Esse proc será salvo em algum lugar e viverá por um longo período – talvez até se tornando um método com o define_method:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Factory</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create_something</span>
    proc { puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span> }
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
block = <span style="color:#036;font-weight:bold">Factory</span>.new.create_something
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note que este bloco não se importa com o ambiente em que é criado. Mas enquanto a variável do bloco estiver viva, ou alguma outra coisa apontar para a mesma instância de Proc, a instância de Factory continuará viva. Pense numa situação onde você tem uma instância ActiveRecord de algum tipo que retorna um Proc. Não é uma situação incomum em aplicações médias ou grandes. Mas um efeito colateral será que todas as variáveis de instância (e objetos ActiveRecord costumam ter alguns) e variáveis locais nunca desaparecerão. Não importa o que você faça no bloco. Agora, da forma como eu vejo, existem três diferentes tipos de blocos em código Ruby:</p>
<ol>
  <li>Blocos que processam alguma coisa sem necessidade de acessar variáveis externas. (Coisas como [1,2,3,4,5].select {|n| n%2 == 0} não precisam de fechamento nenhum)</li>
</ol>
<ol>
  <li>Blocos que processam ou fazem alguma coisa baseadas em variáveis vivas.</li>
</ol>
<ol>
  <li>Blocos que precisam modificar variáveis externas.</li>
</ol>
<p>O interessante é que 1 e 2 são muito mais comuns do que 3. Eu imaginaria que isso é porque 3 é realmente um design ruim em muitos casos. Existem situações em que isso é realmente útil, mas dá para ir bem longe apenas com as duas primeiras alternativas.</p>
<p>Então, se você está se vendo usando blocos que vivem demais e que podem vazar memória (memory leak), considere isolar a criação delas no menor escopo possível. A melhor maneira de fazer isso é algo assim:</p>
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
      <td class="code"><pre>o = <span style="color:#036;font-weight:bold">Object</span>.new
<span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">o</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create_something</span>
    proc { puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span> }
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
block = o.create_something
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Obviamente, isso é demais se você não sabe se o bloco vai viver muito ou não e se vai capturar coisas que não deveria. A maneira que isso funciona é simples – apenas defina uma instância nova e limpa de Object, defina um método singleton nessa instância, e use esse método singleton para criar o bloco. A únicas coisa que será capturada é a instância “o”. Já que “o” não tem nenhuma variável de instância isso funciona, e a única variável local capturada será aquela no escopo do método create_something – que nesse caso não tem nenhuma.</p>
<p>Claro, se você realmente precisa de valores de fora, pode ser seletivo e apenas colocar no escopo os valores que precisa – a menos que precise modificá-las, claro:</p>
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
      <td class="code"><pre>o = <span style="color:#036;font-weight:bold">Object</span>.new
<span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">o</span>
 <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create_something</span>(v, v2)
   proc { puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>v<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>v2<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span> }
 <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
v = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello</span><span style="color:#710">"</span></span>
v2 = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">world</span><span style="color:#710">"</span></span>
v3 = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foobar</span><span style="color:#710">"</span></span> <span style="color:#777"># não será capturada pelo bloco</span>
block = o.create_something(v, v2)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nesse caso, somente “v” e “v2” estarão disponíveis para o bloco, através do uso de argumentos regulares de método.</p>
<p>Esse jeito de definir blocos é meio barra pesada, mas absolutamente necessária em alguns casos. Também é a melhor maneira de conseguir uma amarração de campo limpo, se precisar. De fato, para conseguir um campo limpo, você também precisa remover todos os métodos do Object da instância “o”, e o ActiveSupport tem uma biblioteca para campos limpos. Mas essa é a idéia por trás disso.</p>
<p>Pode parecer estupidez se preocupar com memória nos nossos dias, mas uso alto de memória é um dos preços que pagamos por linguagens com maior nível de abstração. Mas é perda de tempo ir muito longe disso.</p>
<p></p>
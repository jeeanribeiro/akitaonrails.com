---
title: "class Ruby; include Smalltalk; end"
date: "2007-12-02T17:15:00.000Z"
tags: ["beginner", "ruby", "smalltalk"]
years: "2007"
---

<p></p>
<p></p>
<p>Não, não! Não é mais um daqueles artigos “Ruby vs Smalltalk”. Estava hoje lendo um fórum e caí nesse dilema novamente. Quando se fala que Smalltalk é <em>mais</em> orientado a objetos que Ruby o exemplo mais usado é que em Ruby fazemos condicionais de maneira imperativa (uma das maneiras):</p>
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
      <td class="code"><pre>a = <span style="color:#080;font-weight:bold">if</span> expression
  <span style="color:#00D">1</span>
<span style="color:#080;font-weight:bold">else</span>
  <span style="color:#00D">2</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E em Smalltalk se faz passando mensagens ao objeto True ou False:</p>
<macro:code>
  <p>expression ifTrue:[ a := 1 ] ifFalse:[ a := 2 ]</p>
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
        <td class="code"><pre>Onde ifTrue e ifFalse são representados como se fossem 'envio de mensagens' ao objeto true ou false. A primeira diferença é que se o objeto não for true ou false isso normalmente pode dar uma exception do tipo MustBeBoolean. Em Ruby tudo é true e apenas os objetos 'nil' e 'false' são considerados 'não-true'.
Outra coisa é que em Smalltalk podemos enviar várias mensagens ao mesmo objeto de uma só vez, em Ruby o método precisa devolver a si mesmo para encadear mensagens, mas fica parecido. 
Então, e se em Ruby pudéssemos fazer assim:
--- ruby
expression.if_true { a = 1 }.if_false { a = 2 }
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Hm, acontece que podemos! Vejamos como ficaria isso:</p>
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
        <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Object</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">if_true</span>(&amp;block)
    block.call <span style="color:#080;font-weight:bold">if</span> <span style="color:#069">self</span>
    <span style="color:#069">self</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">if_false</span>(&amp;block)
    block.call <span style="color:#080;font-weight:bold">unless</span> <span style="color:#069">self</span>
    <span style="color:#069">self</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Podemos fazer isso graças aos blocos, que expliquei em detalhes no <a href="https://www.akitaonrails.com/2007/11/30/anatomia-de-ruby-blocks-closures">artigo anterior</a>. Além disso já sabemos que todas as classes no Ruby são abertas, em especial a Object que é a pai de todas. Nesse caso todas as classes do Ruby passam a ter esta funcionalidade, não apenas TrueClass ou FalseClass.</p>
  <p>Vejamos como ficaria com a notação de do..end em vez de chaves:</p>
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
        <td class="code"><pre>expression.if_true <span style="color:#080;font-weight:bold">do</span>
  a = <span style="color:#00D">1</span>
<span style="color:#080;font-weight:bold">end</span>.if_false <span style="color:#080;font-weight:bold">do</span>
  a = <span style="color:#00D">2</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Feinha. </p>
  <p>Isso é apenas um exercício de metaprogramação no Ruby porque esta implementação não tem absolutamente nenhuma vantagem sobre a notação nativa de if; else; end. Como apontado em inúmeras discussões a respeito como <a href="https://www.sagewire.org/ruby-programming/If-like-smalltalk-201523.aspx">esta</a> a notação imperativa atual do Ruby não é ambígua e o interpretador não precisa trabalhar dispatch de métodos. Em <a href="https://talklikeaduck.denhaven2.com/articles/2006/10/10/boolean-implementations-ruby-smalltak-and-self">algumas</a> implementações de Smalltalk ifTrue;ifFalse é mais um syntatic sugar porque internamente eles também não fazem dispatching de métodos e fazem o branch condicional normal. Motivo: performance.</p>
  <p>Existe outra diferença, em Ruby e Smalltalk podemos enviar múltiplos blocos a um mesmo método, mas Smalltalk tem uma sintaxe mais simples para isso, como é o caso do próprio ifTrue;ifFalse. No fundo o efeito é o mesmo. Se eu quiser muito mesmo posso não usar o ‘if’ imperativo do Ruby, mas não há nenhum ganho ao fazer isso. O Ruby poderia colocar um ‘syntatic sugar’ semelhante que permitisse usar a notação ‘puramente de objetos’ mas que internamente reconvertesse num if imperativo para não impactar a performance.</p>
  <p>Outra coisa que Ruby faz de maneira ‘imperativa’: herança de classes. Em Ruby fazemos assim:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
        </td>
        <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Carro</span> &lt; <span style="color:#036;font-weight:bold">Veiculo</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Em Smalltalk (sem usar a <span class="caps">IDE</span>) se faz:</p>
  <macro:code>
    <p>Veiculo subclass: #Carro</p>
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
          <td class="code"><pre>Ok, ok, se realmente quisermos fazer assim em Ruby podemos usar mais metaprogramação:
--- ruby
class Object
  def self.subclass name
    eval "class #{name} &lt; #{self}; end"
  end
end
Veiculo.subclass :Carro
</pre>
          </td>
        </tr>
      </tbody>
    </table>
    <p>Pronto, conceitualmente parecido novamente. As características de metaprogramação de Ruby nos permitem criar praticamente qualquer nova sintaxe e é o motivo dele ser uma linguagem tão poderoda para Domain Specific Languages (<span class="caps">DSL</span>). E nunca se esqueçam da maior diferença: Smalltalk não é apenas uma linguagem, é um ambiente, coisa que Ruby não é e não planeja ser. Então não se trata apenas de sintaxe, são filosofias completamente diferente de programação que vai além de simples ‘ser <span class="caps">OOP</span>’ ou não.</p>
    <p>No fundo, tanto faz, pessoalmente prefiro algo pragmático do que apenas ‘intelectualmente puro’, e nesse caso tanto Ruby quanto Smalltalk se encaixam, pois ambos fazem compromissos em alguma das etapas. Existem mais alguns <a href="https://c2.com/cgi/wiki?RubyIsSmalltalkMinusMinus">Ruby vs Smalltalk</a> interessantes, mas não os leve muito a sério a menos que você pretenda se engajar na tarefa de ajudar a codificar o compilador do Ruby. Caso contrário <em>whatever</em>.</p>
    <p><strong>Update:</strong> Na realidade, para ficar um pouco mais parecido com o jeito Smalltalk de passar dois blocos ne mesma mensagem, a versão Ruby deveria ser parecida com esta:</p>
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
          <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Object</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">if</span>(true_block = <span style="color:#069">nil</span>, false_block = <span style="color:#069">nil</span>)
    <span style="color:#080;font-weight:bold">if</span> <span style="color:#069">self</span>
      true_block.call <span style="color:#080;font-weight:bold">if</span> true_block
    <span style="color:#080;font-weight:bold">else</span>
      false_block.call <span style="color:#080;font-weight:bold">if</span> false_block
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
n = <span style="color:#00D">10</span>
puts ( n &gt; <span style="color:#00D">1</span> ).if( proc { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">true</span><span style="color:#710">"</span></span> }, proc { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">false</span><span style="color:#710">"</span></span> } )
</pre>
          </td>
        </tr>
      </tbody>
    </table>
    <p>Novamente, a performance decai. Comparei os tempos de 500 mil operações, na primeira vez com ‘if’ condicional e nesta versão via passagem de método e a diferença foi de 2 a 4 vezes mais devagar passando como métodos, portanto não se atenham a essas versões exóticas além de apenas servir como curiosidade acadêmica.</p>
    <p></p>
    <h4>tags: <span class="label label-important"><a href="/learning">learning</a></span> <span class="label label-important"><a href="/beginner">beginner</a></span> <span class="label label-important"><a href="/ruby">ruby</a></span> <span class="label label-important"><a href="/smalltalk">smalltalk</a></span></h4>
  </macro:code>
</macro:code>
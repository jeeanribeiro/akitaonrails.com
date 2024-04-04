---
title: "Ruby Symbols"
date: "2007-11-26T13:33:00.000Z"
tags: ["beginner", "ruby"]
years: "2007"
---

<p></p>
<p>Meu amigo Satish Talim me convidou para escrever um artigo no seu site <a href="http://rubylearning.com">Ruby Learning</a>. O tema desta vez foi <a href="http://rubylearning.com/blog/2007/11/26/akitaonrails-on-ruby-symbols/">Ruby Symbols</a>. Portanto escrevi um artigo tentando desmistificar o que é um símbolo e para que servem.</p>
<p>O artigo original foi em inglês, abaixo segue a tradução em português:</p>
<p></p>
<p></p>
<p>Ruby é muito similar a muitas outras linguagens orientadas a objeto. Podemos encontrar construções similares em linguagens não-dinâmicas como Java ou C#. Por outro lado, para começar a tocar nas possibilidades de Ruby é necessário investir tempo aprendendo o que chamamos de “Rubismos”. Um exemplo disso são <strong>Símbolos</strong>.</p>
<p>Isso é mais óbvio quando se começa a aprender Ruby através de Rails. Muito do poder de Rails vem do fato dele usar muitos rubismos. Vejamos um exemplo:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Transact</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  validates_presence_of <span style="color:#A60">:when</span>
  validates_presence_of <span style="color:#A60">:category</span>, <span style="color:#A60">:account</span>
  validates_presence_of <span style="color:#A60">:value</span>
  validates_numericality_of <span style="color:#A60">:value</span>
  belongs_to <span style="color:#A60">:category</span>
  belongs_to <span style="color:#A60">:account</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>‘class’ é fácil, afinal, todas as grandes linguagens são ‘orientadas-a-objeto’. Mas o que são os “dois-pontos” por todo o código? Eles denotam Símbolos. Mais importante, esses dois-pontos representam inicializadores da classe Symbol.</p>
<p>Isso pode ser bem confuso considerando que o jeito normal de inicializar um objeto é:</p>
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
</pre>
      </td>
      <td class="code"><pre>A chamada 'new' pede pelo método padrão 'initialize' definido dentro da classe. Acontece que esse método é privado na classe Symbol, a idéia sendo que todo símbolo deve ser instanciado com a notação de dois-pontos.
Símbolos são usados como identificadores. Outras linguagens poderiam simplesmente usar Strings em vez de Símbolos. Em Ruby, ficaria parecido com isso:
--- ruby
class Transact &lt; ActiveRecord::Base
  validates_presence_of "when"
  validates_presence_of "category", "account"
  validates_presence_of "value"
  validates_numericality_of "value"
  belongs_to "category"
  belongs_to "account"
end
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Visualmente não ficou tão diferente: nos livramos dos dois-pontos e voltamos às confortáveis aspas. Parece a mesma coisa mas o comportamenteo é diferente. Como Símbolos em Ruby, Strings também tem um construtor especial. Em vez de fazer:</p>
<hr>
rubyString.new(“category”)<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>Apenas fazemos:
--- ruby"category"</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Alguém poderia chamar esse tipo de atalho de “enfeite”, mas a linguagem seria bem chata sem eles. Usamos Strings o tempo todo, e seria muito doloroso instanciar novos Strings sem esse construtor especial: simplesmente escrevendo entre aspas.</p>
<p>O problema é, como Strings são fáceis de escrever, nós abusamos mais do que deveríamos. Existe um efeito colateral: cada nova construção instancia um novo objeto em memória, mesmo tendo o mesmo conteúdo. Por exemplo:</p>
<pre>&gt;&gt; "category".object_id
=&gt; 2953810
&gt;&gt; "category".object_id
=&gt; 2951340
</pre>
<p>Aqui instanciamos 2 strings com o mesmo conteúdo. Cada objeto em memória tem um ID único de forma que cada string acima usa um pedaço separado de memória e tem IDs separados. Agora imagine que os mesmos strings acima apareçam centenas de vezes em diferentes lugares pelo seu projeto. Definitivamente estamos usando mais memória do que necessário.</p>
<p>Mas, isso não é um problema novo. Para isso, temos outra construção na maioria das linguagens chamada ‘constantes’, incluindo Ruby. Temos que planejar e pré-definir diversas constantes de ante-mão, de forma consciente. Então, nosso exemplo anterior, com uso de constantes ficaria assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Transact</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  <span style="color:#036;font-weight:bold">ACCOUNT</span> = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">account</span><span style="color:#710">"</span></span>
  <span style="color:#036;font-weight:bold">CATEGORY</span> = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">category</span><span style="color:#710">"</span></span>
  <span style="color:#036;font-weight:bold">VALUE</span> = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">value</span><span style="color:#710">"</span></span>
  <span style="color:#036;font-weight:bold">WHEN</span> = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">when</span><span style="color:#710">"</span></span>
  validates_presence_of <span style="color:#036;font-weight:bold">WHEN</span>
  validates_presence_of <span style="color:#036;font-weight:bold">CATEGORY</span>, <span style="color:#036;font-weight:bold">ACCOUNT</span>
  validates_presence_of <span style="color:#036;font-weight:bold">VALUE</span>
  validates_numericality_of <span style="color:#036;font-weight:bold">VALUE</span>
  belongs_to <span style="color:#036;font-weight:bold">CATEGORY</span>
  belongs_to <span style="color:#036;font-weight:bold">ACCOUNT</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso funciona, mas não é nem de perto mais legal. Primeiro, é preciso pré-definir tudo antecipadamente, seja na mesma classe ou em um módulo separado apenas para constantes. Segundo, o código é menos elegante, menos legível, portanto, de mais difícil manutenção.</p>
<p>Então, voltamos ao propósito de Símbolos: ser tão eficientes em consumo de memória quanto constantes mas tão agradáveis aos olhos como strings. Notação de aspas já é de Strings, palavras em maiúsculo para constantes, cifrão para variáveis globais e assim por diante. Então, dois-pontos foi um bom candidato.</p>
<p>Vejamos o que isso significa:</p>
<pre>&gt;&gt; "string".object_id
=&gt; 3001850
&gt;&gt; "string".object_id
=&gt; 2999540
&gt;&gt; :string.object_id
=&gt; 69618
&gt;&gt; :string.object_id
=&gt; 69618
</pre>
<p>Como explicamos antes, os primeiros 2 strings têm o mesmo conteúdo e parecem similar, mas ocupam espaços diferentes de memória, permitindo duplicação desnecessária.</p>
<p>Os últimos 2 símbolos são exatamente a mesma coisa. Então posso chamar identificadores como símbolos por todo meu código sem me preocupar com duplicação em memória. Eles são fáceis de inicializar e fáceis de gerenciar.</p>
<p>Podemos também transformar um String em um Símbolo e vice-versa:</p>
<pre>&gt;&gt; "string".to_sym
=&gt; :string
&gt;&gt; :symbol.to_s
=&gt; "symbol"
</pre>
<p>Um lugar onde isso é usado muito bem é dentro do pacote ActiveSupport do Rails. Esse pacote foi feito para estender a linguagem Ruby e uma dessas extensões foi feita na comum classe Hash. Vejamos um exemplo:</p>
<pre>&gt;&gt; params = { "id" =&gt; 1, "action" =&gt; "show" }
=&gt; {"action"=&gt;"show", "id"=&gt;1}
&gt;&gt; params["id"]
=&gt; 1
&gt;&gt; params.symbolize_keys!
=&gt; {:id=&gt;1, :action=&gt;"show"}
&gt;&gt; params[:id]
=&gt; 1
</pre>
<p>O primeiro comando linha instancia e popula um Hash (e temos mais uma notação especial de inicialização). O segundo comando pede pelo valor identificado pela chave “id”, que é uma string.</p>
<p>Em vez de fazer dessa maneira, podemos chamar o método symbolize_keys! para transformar todas as chaves string em chaves símbolo. Agora, no último comando podemos usar a notação mais comum em Rails de símbolos como chaves dentro de um Hash. Quando o Rails recebe um post de um formulário <span class="caps">HTML</span>, ele apenas recebe strings, portanto é seu trabalho converter tudo em objetos que façam sentido. Se você esteve no mundo Rails, já viu esse uso em controllers.</p>
<p>Então, isso é tuod que pode ser dito sobre Símbolos: construções muito simples que tornam o código mais legível e mais eficiente ao mesmo tempo, o que é compatível com a filosofia Ruby.</p>
<p></p>
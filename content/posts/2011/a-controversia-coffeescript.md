---
title: "A Controvérsia CoffeeScript"
date: "2011-04-16T21:31:00.000Z"
tags: ["fud"]
years: "2011"
---

<p></p>
<p>Para quem não está acompanhando, esta semana rolou uma pequena controvérsia acerca de uma nova decisão na linha de desenvolvimento para o futuro Rails 3.1 (atualmente estamos na 3.0.6). A partir dessa versão, o framework trará como dependência as bibliotecas CoffeeScript, <span class="caps">SASS</span> e Sprockets, além da mudança que já havia sido anunciada antes de trocar a instalação padrão do framework Javascript, Prototype + Scriptaculous, por <a href="http://twitter.com/#!/dhh/statuses/45923430608023552">jQuery</a>.</p>
<p>A maioria dessas mudanças foram bem recebidas e até em alguns casos, aplaudida, no estilo <em>“já não era sem tempo!”</em> (caso do jQuery).</p>
<p>Porém, a <a href="http://twitter.com/#!/dhh/status/58207700672200704">escolha</a> de colocar o CoffeeScript como padrão causou um grande <a href="http://twitter.com/#!/dhh/status/58288725247012864">furor</a>, diversas trocas de hostilidades, piadas de humor negro, <a href="http://doihavetousecoffeescriptinrails.com/">sarcasmo</a> e também muita gente que simplesmente gosta de fazer barulho sem motivo algum (tem tempo sobrando, eu diria).</p>
<p>O pessoal do Rails Core Team acha que é a melhor decisão. Uma parcela barulhenta da comunidade acha que foi uma grande bobagem. E agora, o que isso significa?</p>
<p></p>
<p></p>
<h2>Introdução: Pré-processadores</h2>
<p>Existem muitas coisas que são difíceis mudar. Quem lida com montagem de interfaces <span class="caps">HTML</span>/<span class="caps">CSS</span> multi-browser sabe a dor de cabeça. Especificar algo como <span class="caps">HTML</span> e <span class="caps">CSS</span> é muito difícil. Como eu sempre digo, leia as <a href="https://www.w3.org/Style/CSS/current-work.en.html">especificações</a>. À primeira vista parece bem completo. Mas não é! Cada navegador tem muitas diferenças de implementação.</p>
<p>Frameworks como jQuery para Javascript ajudam a aliviar muitas dessas diferenças, abstraindo as implementações em algo menos complicado. No caso do Javascript é possível criar frameworks assim porque ele é uma real linguagem de programação genérica – e uma bastante completa, diga-se de passagem.</p>
<p>Já um <span class="caps">HTML</span> e <span class="caps">CSS</span> <strong>não</strong> são linguagens de programação (quem ainda chama <span class="caps">HTML</span> e <span class="caps">CSS</span> de <em>“linguagem de programação”</em> merece apanhar, sério. E quando eu pergunto, <em>“em que linguagens sabe programar?”</em> e o cidadão responde <em>“ah, sei <span class="caps">HTML</span>”</em>, esse merece ser jogado da janela do prédio!). <span class="caps">HTML</span> e <span class="caps">CSS</span> são <em>“linguagens de marcação”</em>. Tem gente que não sabe nem o que significa <span class="caps">HTML</span>: “HyperText <strong>Markup</strong> Language”. Está no próprio nome!</p>
<p>O quero dizer é que é impossível programar um framework <span class="caps">HTML</span> ou <span class="caps">CSS</span> escrito em <span class="caps">HTML</span> ou <span class="caps">CSS</span>, algo parecido com o efeito de um jQuery. Ou seja, podemos refatorar e reescrever quanto quisermos, mas nunca conseguiremos extrair uma “biblioteca” parametrizável e reusável escrito em <span class="caps">CSS</span> que seja capaz de gerar mais <span class="caps">CSS</span>.</p>
<p>Sabemos o benefício que existe em usar frameworks que abstraem muitas das repetições e coisas específicas de cada navegador numa linguagem mais genérica. Por exemplo, no caso do Javascript, em vez de fazer:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">var</span> elm = <span style="color:#069">null</span>;
<span style="color:#080;font-weight:bold">if</span> (document.getElementById)
{
  <span style="color:#777">// browser implements part of W3C DOM HTML</span>
  <span style="color:#777">// Gecko, Internet Explorer 5+, Opera 5+</span>
  elm = document.getElementById(id);
}
<span style="color:#080;font-weight:bold">else</span> <span style="color:#080;font-weight:bold">if</span> (document.all)
{
  <span style="color:#777">// Internet Explorer 4 or Opera with IE user agent</span>
  elm = document.all[id];
}
<span style="color:#080;font-weight:bold">else</span> <span style="color:#080;font-weight:bold">if</span> (document.layers)
{
  <span style="color:#777">// Navigator 4</span>
  elm = document.layers[id];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Hoje podemos simplesmente fazer, com jQuery:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">var</span> elm = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#</span><span style="color:#710">"</span></span> + id);
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Outra alternativa seria mudar a especificação do <span class="caps">HTML</span> e <span class="caps">CSS</span> para serem mais enxutas e mais flexíveis. Mas isso seria praticamente impossível pois todos os navegadores do planeta precisaram ser atualizados para a mesma versão para que valesse a pena. É o dilema do <span class="caps">HTML</span> 5 vs Internet Explorer 6. Enquanto existir um cidadão usando o famigerado IE 6, vamos ter que criar código que trata versões e dá “fallback”, ou seja, escolhe uma versão não <span class="caps">HTML</span> 5.</p>
<p>Agora, nós conhecemos técnicas que podem facilitar a vida do desenvolvedor. Quem programa em C conhece <a href="https://en.wikipedia.org/wiki/C_preprocessor">pré-processadores</a>. Ele permite escrever macros, que podem ser reusados por todo seu código. Daí antes de compilar em código nativo de máquina, o compilador do C vai fazer o equivalente a um grande “procurar e substituir”, trocando as macros por código, por exemplo:</p>
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
      <td class="code"><pre><span style="color:#579">#define</span> MYCASE(item,id) \
<span style="color:#080;font-weight:bold">case</span> id: \
  item<span style="color:#579">#</span><span style="color:#579">#_</span><span style="color:#579">#</span><span style="color:#579">#id</span> = id;\
<span style="color:#080;font-weight:bold">break</span>
<span style="color:#080;font-weight:bold">switch</span>(x) {
    MYCASE(widget,<span style="color:#00D">23</span>);
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quando o pré-processador do C passar por esse código, ele será “reescrito” como:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">switch</span>(x) {
  <span style="color:#080;font-weight:bold">case</span> <span style="color:#00D">23</span>:
    widget_23 = <span style="color:#00D">23</span>;
  <span style="color:#080;font-weight:bold">break</span>;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Com esse recurso podemos praticamente criar uma sintaxe completamente nova que você nem perceberia mais que está lidanco com C. Não é exatamente recomendável fazer isso, mas as macros estão ali para justamente tentar abstrair mais do código e torná-la mais fácil de ler e dar manutenção. No final o código binário gerado seria o mesmo, mas para o desenvolvedor a vida pode ser mais fácil.</p>
<p>Pois bem, no mundo Ruby, sabendo que <span class="caps">HTML</span> e <span class="caps">CSS</span> não podem ser modificados e não podem gerar a si mesmos, recaímos em Ruby mesmo para criar o equivalente a pré-processadores. São formas de escrever <span class="caps">HTML</span> e <span class="caps">CSS</span> em uma sintaxe mais simples e com mais abstrações, de maneira a tentar evitar escrever tantas duplicações e a tornar a manutenção futura até mais simples.</p>
<p><span class="caps">CSS</span> em particular é um monstro complicado porque diferente de <span class="caps">HTML</span> ela não define estrutura, define estilo a ser aplicado à estrutura. O <span class="caps">HTML</span> é razoavelmente “simples” e linear. Não há valores, não há reusos triviais, ela é uma hierarquia simples. Já <span class="caps">CSS</span> tem valores, tem reuso desses valores, tem conceitos de herança e prioridade dos estilos, tem valores derivados de outros valores. Mas ela não dá nenhum recurso para tornar isso fácil, então você é obrigado a repetir e repetir sem parar. E quando tem uma mudança drástica, é obrigado a reescrever muita coisa.</p>
<p>Entra <span class="caps">SASS</span>. Ele é como um pré-processador de <span class="caps">CSS</span>, que adiciona diversas funcionalidades que muitos acreditam que já deveriam ter sido criadas desde o começo. Por exemplo, veja o seguinte código em <span class="caps">SASS</span>:</p>
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
      <td class="code"><pre><span style="color:#777">/* style.scss */</span>
<span style="color:#F00;background-color:#FAA">$</span><span style="color:#339;font-weight:bold">main-color</span>: <span style="color:#036;font-weight:bold">#ce4dd6</span>;
<span style="color:#F00;background-color:#FAA">$</span><span style="color:#339;font-weight:bold">style</span>: <span style="color:#339;font-weight:bold">solid</span>;
<span style="color:#036;font-weight:bold">#navbar</span> {
  <span style="color:#606">border-bottom</span>: {
    <span style="color:#606">color</span>: <span style="color:#F00;background-color:#FAA">$</span><span style="color:#088">main-color</span>;
    <span style="color:#606">style</span>: <span style="color:#F00;background-color:#FAA">$</span><span style="color:#088">style</span>;
  }
}
<span style="color:#339;font-weight:bold">a</span> {
  <span style="color:#606">color</span>: <span style="color:#F00;background-color:#FAA">$</span><span style="color:#088">main-color</span>;
  <span style="color:#F00;background-color:#FAA">&amp;</span>:<span style="color:#088">hover</span> { <span style="color:#606">border-bottom</span>: <span style="color:#F00;background-color:#FAA">$</span><span style="color:#088">style</span> <span style="color:#60E">1px</span>; }
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É transformado no seguinte <span class="caps">CSS</span>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#777">/* style.css */</span>
<span style="color:#036;font-weight:bold">#navbar</span> {
  <span style="color:#606">border-bottom-color</span>: <span style="color:#0A0">#ce4dd6</span>;
  <span style="color:#606">border-bottom-style</span>: <span style="color:#088">solid</span>; }
<span style="color:#339;font-weight:bold">a</span> {
  <span style="color:#606">color</span>: <span style="color:#0A0">#ce4dd6</span>; }
  <span style="color:#339;font-weight:bold">a</span><span style="color:#00C;font-weight:bold">:hover</span> {
    <span style="color:#606">border-bottom</span>: <span style="color:#088">solid</span> <span style="color:#60E">1px</span>; }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notem que aqui o objetivo sequer é escrever “menos linhas de código”. Se o objetivo fosse apenas esse, o <span class="caps">SASS</span> seria inútil. Mas o principal é a forma de escrever estilos como blocos dentro de blocos, usar variáveis e muito mais. No exemplo, digamos que você tivesse que mudar a cor principal (main-color). Teria que fazer um processo manual de “procurar e trocar” por todo seu código e ainda assim não teria nenhuma certeza se trocou tudo certo. Aqui basta trocar uma variável. Esse é apenas um dos benefícios. <span class="caps">SASS</span> tem muitos outros recursos que permitem organizar seu <span class="caps">CSS</span> de maneira nunca antes possíveis.</p>
<p>O autor do <span class="caps">SASS</span> é o grande Hampton Caitlin, que é contribuidor na comunidade Ruby há muitos anos. Antes do <span class="caps">SASS</span>, porém, ele havia criado outro tipo de pré-processador, mas para <span class="caps">HTML</span> chamado <a href="haml-lang.com/"><span class="caps">HAML</span></a>. Vejamos o exemplo que ele mostra no site. Primeiro o código escrito em <span class="caps">HAML</span>:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">#profile</span>
  <span style="color:#B06;font-weight:bold">.left</span><span style="color:#B06;font-weight:bold">.column</span>
    <span style="color:#036;font-weight:bold">#date</span>= <span style="color:#339;font-weight:bold">print_date</span>
    <span style="color:#036;font-weight:bold">#address</span>= <span style="color:#339;font-weight:bold">current_user</span><span style="color:#B06;font-weight:bold">.address</span>
  <span style="color:#B06;font-weight:bold">.right</span><span style="color:#B06;font-weight:bold">.column</span>
    <span style="color:#036;font-weight:bold">#email</span>= <span style="color:#339;font-weight:bold">current_user</span><span style="color:#B06;font-weight:bold">.email</span>
    <span style="color:#036;font-weight:bold">#bio</span>= <span style="color:#339;font-weight:bold">current_user</span><span style="color:#B06;font-weight:bold">.bio</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse <span class="caps">HAML</span> será transformado no seguinte <span class="caps">HTML</span>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;div</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">profile</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">left column</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#070">&lt;div</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">date</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= print_date %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
    <span style="color:#070">&lt;div</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">address</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= current_user.address %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">right column</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#070">&lt;div</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">email</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= current_user.email %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
    <span style="color:#070">&lt;div</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bio</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= current_user.bio %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
<span style="color:#070">&lt;/div&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A idéia principal do <span class="caps">HAML</span> é estética. Não funcionalidades. Segundo o próprio website, eis a definição de porque <span class="caps">HAML</span> existe:</p>
<blockquote>
  <p>“Haml é baseado em um princípio primário. Marcação deve ser muito bonita.”</p>
</blockquote>
<p>E eis o que eu acredito ser o principal problema do <span class="caps">HAML</span>: “ser bonito” ou “ser feio” é completamente uma questão não-absoluta de gosto pessoal. Quem acha <span class="caps">HAML</span> bonito vai criticar totalmente <span class="caps">HTML</span>. Mas quem acha <span class="caps">HTML</span> bonito o suficiente, vai achar <span class="caps">HAML</span> muito feio. E contra isso não há nenhum tipo de argumento.</p>
<p>No caso, a maioria do Rails Core Team, não viu valor na mudança estética de <span class="caps">HTML</span> para <span class="caps">HAML</span>. Eu pessoalmente também não vejo. Por outro lado não desgosto de <span class="caps">HAML</span>, se eu pegar um código que usa <span class="caps">HAML</span> provavelmente vou usá-lo sem problemas, mas se começar um projeto do zero, não sei se eu usaria. Provavelmente seria relutante.</p>
<p>O problema é o objetivo do <span class="caps">HAML</span>: se ele me acrescentasse funcionalidades que me permitissem simplificar a organização das views, criar estruturas reusáveis ou algo assim, seria muito interessante. Mas um arquivo <span class="caps">HAML</span> é um para um equivalente a um arquivo <span class="caps">HTML</span> (diferente do <span class="caps">SASS</span> que oferece mixins e imports). Um bloco <span class="caps">HAML</span> é um para um equivalente a um bloco de <span class="caps">HTML</span> (diferente do <span class="caps">SASS</span> que introduz nesting). E assim por diante.</p>
<p>Ou seja, estou literamente trocando seis por meia dúzia em troca de “estética”. Sendo que essa estética não tem explicação lógica, apenas gosto pessoal. Ou seja, qual é mais “bonito” aos seus olhos, este <span class="caps">HAML</span>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#F00;background-color:#FAA">%</span><span style="color:#339;font-weight:bold">strong</span><span style="color:#B06;font-weight:bold">.code</span><span style="color:#036;font-weight:bold">#message</span> <span style="color:#339;font-weight:bold">Hello</span>, <span style="color:#339;font-weight:bold">World</span><span style="color:#F00;background-color:#FAA">!</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou este <span class="caps">HTML</span>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;strong</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">code</span><span style="color:#710">"</span></span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">message</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Hello, World!<span style="color:#070">&lt;/strong&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pois é, eu pessoalmente prefiro o <span class="caps">HTML</span>. O que não invalida quem prefere <span class="caps">HAML</span>. Portanto, dado que a escolha é puramente estética, entendo perfeitamente porque o Rails Core Team preferiu deixar o <span class="caps">HAML</span> de fora e só trazer o <span class="caps">SASS</span>. O <span class="caps">SASS</span> traz benefícios reais de produtividade e mantenabilidade do código. O <span class="caps">HAML</span> é puramente estético e é difícil de defender alguma coisa simplesmente por “parecer” esteticamente melhor.</p>
<h2>CoffeeScript – melhor ou apenas mais estética?</h2>
<p>E aí caímos na controvérsia do <a href="https://jashkenas.github.com/coffee-script/">CoffeeScript</a>. Há um ano eu <a href="https://akitaonrails.com/2010/03/27/brincando-com-coffee-script">já havia escrito</a> uma introdução a ele, portanto recomendo que leiam meu antigo artigo primeiro antes de continuar.</p>
<p>E como no caso do <span class="caps">HAML</span>, eu critico seu objetivo de existir. Do próprio website oficial, eu destaco este trecho:</p>
<blockquote>
  <p>Javascript sempre teve um excelente modelo de objetos em seu interior. CoffeeScript é uma tentativa de expôr as boas partes do Javascript de maneira simples.</p>
  <p>A regra de outro do CoffeeScript é: “É somente Javascript”. O código compila um-para-um no JS equivalente, e não há nenhuma interpretação em tempo de execução.</p>
</blockquote>
<p>Assim como <span class="caps">HAML</span>, CoffeeScript tem exatamente o mesmo objetivo: ser um-para-um mais “esteticamente” bonito do que o original. E essa é a razão da discussão, porque quem acha CoffeeScript esteticamente mais bonito vai defendê-lo (caso do Rails Core Team) e quem não acha essa estética tão bonita assim vai questionar, criticar.</p>
<p>Repito: é uma questão <strong>puramente estética</strong>! Não há nenhum argumento técnico, lógico e objetivo para declarar que CoffeeScript é melhor ou pior. E não se trata simplesmente de escrever menos código (em muitos casos no <span class="caps">SASS</span> você pode acabar com mais linhas de código, só que com maior mantenabilidade), portanto ser mais “curto” pra escrever é interessante mas dificilmente é um argumento definitivo.</p>
<p>Além disso, uma linguagem de marcação como <span class="caps">HTML</span> é bem mais fácil de entender se você mantiver a estrutura mas só mudar a forma de escrever. Já uma linguagem de programação completa e complexa como Javascript, se você mudar a sintaxe, para quem nunca viu CoffeeScript, a curva de aprendizado <del>será considerável</del> não é zero e pode ser grande dependendo de quem vai pegar esse código para dar manutenção depois. Quem já sabe obviamente dirá <em>“mas é muito simples”</em> mas para quem não conhece e não está vendo nenhum valor extra sendo adicionado, naturalmente irá questionar: <em>“e o que eu ganho com isso?”</em> E ele também está certo, porque se para ele a estética é irrelevante, de fato ele não está levando absolutamente nenhum benefício em termos de programação ou organização.</p>
<p>Também usamos o argumento que Ruby é mais elegante ou esteticamente mais bonito do que outras. Mas Ruby efetivamente traz técnicas e paradigmas de programação novos como closures, classes abertas, metaprogramação, mixin de módulos, e muito mais. Não é apenas estética.</p>
<p>Mas não pensem que CoffeeScript é ruim por causa disso. De jeito nenhum, de fato Javascript tem uma sintaxe que está ficando velha muito rápido. O Coffee tem diversas ajudas de sintaxe que tornam mesmo muitas coisas menos complicado. Vejam alguns exemplos, primeiro em Coffee:</p>
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
</pre>
      </td>
      <td class="code"><pre>switch day
  <span style="color:#080;font-weight:bold">when</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Mon</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">then</span> go work
  <span style="color:#080;font-weight:bold">when</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Tue</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">then</span> go relax
  <span style="color:#080;font-weight:bold">when</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Thu</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">then</span> go iceFishing
  <span style="color:#080;font-weight:bold">when</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fri</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Sat</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">if</span> day is bingoDay
      go bingo
      go dancing
  <span style="color:#080;font-weight:bold">when</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Sun</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">then</span> go church
  <span style="color:#080;font-weight:bold">else</span> go work
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora em Javascript:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">switch</span> (day) {
  <span style="color:#080;font-weight:bold">case</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Mon</span><span style="color:#710">"</span></span>:
    go(work);
    <span style="color:#080;font-weight:bold">break</span>;
  <span style="color:#080;font-weight:bold">case</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Tue</span><span style="color:#710">"</span></span>:
    go(relax);
    <span style="color:#080;font-weight:bold">break</span>;
  <span style="color:#080;font-weight:bold">case</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Thu</span><span style="color:#710">"</span></span>:
    go(iceFishing);
    <span style="color:#080;font-weight:bold">break</span>;
  <span style="color:#080;font-weight:bold">case</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fri</span><span style="color:#710">"</span></span>:
  <span style="color:#080;font-weight:bold">case</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Sat</span><span style="color:#710">"</span></span>:
    <span style="color:#080;font-weight:bold">if</span> (day === bingoDay) {
      go(bingo);
      go(dancing);
    }
    <span style="color:#080;font-weight:bold">break</span>;
  <span style="color:#080;font-weight:bold">case</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Sun</span><span style="color:#710">"</span></span>:
    go(church);
    <span style="color:#080;font-weight:bold">break</span>;
  <span style="color:#080;font-weight:bold">default</span>:
    go(work);
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no final nem é tão complicado assim aprender Coffee. Basicamente entre no <a href="https://jashkenas.github.com/coffee-script/">site oficial</a> deles e leia essa primeira página. Ela tem tudo que você precisa saber para começar. Eu diria que você precisa, em média de 1 a 2 horas para saber como ler e escrever em Coffee. Mais do que isso e significa que você tem pouca prática com programação, o que não é ruim, mas só para constatar que é só isso que um bom programador deveria levar.</p>
<h2>Conclusão</h2>
<p>Isso tudo dito, eu consigo entende o valor estético do CoffeeScript e não acho ruim usá-lo. Não sinto ele tão valioso quanto um <span class="caps">SASS</span>. Também entendo manter o <span class="caps">HAML</span> fora do Rails por enquanto, até que seja mais fácil convencer os outros do seu valor.</p>
<p>O problema maior é que o Rails está começando a ficar mais complexo. É natural e até que ele conseguiu se manter bem nos últimos 5 anos sem virar um novo J2EE. Está longe disso. Mas agora temos um passo de pré-processamento que os programadores precisam ter consciência. Os arquivos <tt>.scss</tt> ou <tt>.coffee</tt> primeiro precisam passar por um processo de pré-processamento/compilação para se tornarem <tt>.css</tt> e <tt>.js</tt>. Pior ainda, se usar o <a href="https://github.com/sstephenson/sprockets">Sprockets</a> (ou equivalente <a href="https://github.com/sbecker/asset_packager">Asset Packager</a>), múltiplos arquivos <span class="caps">CSS</span> e JS serão compilados em um único minificado para melhorar velocidade de transferência.</p>
<p>Vários problemas podem acontecer: alguém editar o <span class="caps">CSS</span> final em vez do <span class="caps">SCSS</span> que o gerou, sem perceber. Esquecer de executar o passo que transforma o <span class="caps">SCSS</span> em <span class="caps">CSS</span> antes de atualizar uma versão em produção. Dar erro no navegador do cliente e a partir daí ficar difícil de determinar qual era o arquivo original em <span class="caps">SCSS</span> que gerou aquele <span class="caps">CSS</span>, e assim por diante. Nenhum desses problema é crítico ou incontornável uma vez que você sabe o que fazer. Mas é um passo extra na curva de aprendizado para quem está começando.</p>
<p>Todos esses pacotes são opcionais. Basta entrar na <tt>Gemfile</tt> que o Rails 3.1 irá gerar e retirar as dependências que não lhe interessam e adicionar as escolhas que prefere. Nesse sentido o Rails permanecerá modular, de forma a facilitar novas escolhas, por isso ninguém deveria estar preocupado.</p>
<p>No geral acredito que todas as mudanças mencionadas são positivas e aumenta o valor agregado do Ruby on Rails. E se você realmente gosta da prática de programação, aprender <span class="caps">HAML</span>, <span class="caps">SASS</span>, CoffeeScript, Sprockets, etc não deveria ser um sacrifício e sim um prazer. Se alguém está considerando aprender coisas novas um “sacrifício”, deveria rever sua carreira de programação.</p>
<p></p>
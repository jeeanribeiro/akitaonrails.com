---
title: "Algumas Dicas da Linguagem Ruby"
date: "2012-06-29T21:35:00.000Z"
tags: ["beginner", "ruby", "tutorial"]
years: "2012"
---

<p></p>
<p>A linguagem Ruby permite escrever código que faz coisas semelhantes de maneiras diferentes. É um dos fatores que comumente se atribui ao famoso <a href="http://www.artima.com/intv/ruby4.html">Principle of Least Surprise</a>. Ruby permite que se escreva código de forma semelhantes ao que um programador que vem de Java ou Python estaria acostumado, algumas dessas formas não são consideradas “rubismos”.</p>
<p>Por outro lado, muito da inspiração vem de Perl, permitindo alguns <a href="http://en.wikipedia.org/wiki/One-liner_program">one-liners</a> que surpreendem e outros que até assustam.</p>
<p>Vamos dar uma olhada em alguns exemplos, dos mais triviais até alguns mais estranhos.</p>
<p></p>
<p></p>
<h2>Variáveis</h2>
<p>Alguma vez você já teve que trocar os valores de duas variáveis? Não é difícil encontrar código assim:</p>
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
      <td class="code"><pre>sobrenome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
nome      = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
temporario = nome
nome       = sobrenome
sobrenome  = temporario
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>sobrenome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
<span style="color:#777">#=&gt; Fabio Akita</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ruby permite simplificar a mesma coisa da seguinte forma:</p>
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
      <td class="code"><pre>sobrenome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
nome      = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
nome, sobrenome = sobrenome, nome
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>sobrenome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
<span style="color:#777">#=&gt; Fabio Akita</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Strings</h2>
<p>Aliás, quem está iniciando pode não entender a última linha dos exemplos anteriores. Como exemplo, digamos que temos duas variáveis e queremos concatená-las. Em algumas linguagens, o seguinte seria normal:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>nome, sobenome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
puts nome + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span> + sobrenome
<span style="color:#777">#=&gt; Fabio Akita</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Porém em Ruby, preferimos usar interpolação de strings:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>nome, sobrenome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>sobrenome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou quem vem de linguagens como C pode querer <a href="https://ruby-doc.org/core-1.9.3/String.html#method-i-25">strings formatadas</a>, nesse caso podemos fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>produto, valor = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Livro</span><span style="color:#710">"</span></span>, <span style="color:#60E">35.99</span>
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">O %s custa R$ %0.2f</span><span style="color:#710">"</span></span> % [produto, valor]
<span style="color:#777">#=&gt; O Livro custa R$ 35.99</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Falando em interpolação, você precisa usar necesariamente aspas duplas. Agora quando se tem aspas duplas dentro da string, precisa “escapar”, por exemplo:</p>
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
      <td class="code"><pre>id, method, action, length, size = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">search</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">get</span><span style="color:#710">"</span></span>, <span style="color:#00D">140</span>, <span style="color:#00D">28</span>
<span style="color:#F00;background-color:#FAA"> </span>html = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;div id=</span><span style="color:#b0b">\"</span><span style="color:#D20">hsearch</span><span style="color:#b0b">\"</span><span style="color:#D20">&gt; 
  &lt;form id=</span><span style="color:#b0b">\"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>search<span style="font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style="color:#D20"> action=</span><span style="color:#b0b">\"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>action<span style="font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style="color:#D20"> method=</span><span style="color:#b0b">\"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>method<span style="font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style="color:#D20"> 
    autocomplete=</span><span style="color:#b0b">\"</span><span style="color:#D20">off</span><span style="color:#b0b">\"</span><span style="color:#D20">&gt; 
    &lt;div&gt;
       &lt;input autocomplete=</span><span style="color:#b0b">\"</span><span style="color:#D20">off</span><span style="color:#b0b">\"</span><span style="color:#D20"> name=</span><span style="color:#b0b">\"</span><span style="color:#D20">q</span><span style="color:#b0b">\"</span><span style="color:#D20"> class=</span><span style="color:#b0b">\"</span><span style="color:#D20">textbox</span><span style="color:#b0b">\"</span><span style="color:#D20"> 
       placeholder=</span><span style="color:#b0b">\"</span><span style="color:#D20">search</span><span style="color:#b0b">\"</span><span style="color:#D20"> tabindex=</span><span style="color:#b0b">\"</span><span style="color:#D20">1</span><span style="color:#b0b">\"</span><span style="color:#D20"> type=</span><span style="color:#b0b">\"</span><span style="color:#D20">text</span><span style="color:#b0b">\"</span><span style="color:#D20"> 
       maxlength=</span><span style="color:#b0b">\"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>length<span style="font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style="color:#D20"> size=</span><span style="color:#b0b">\"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>size<span style="font-weight:bold;color:#666">}</span></span><span style="color:#b0b">\"</span><span style="color:#D20"> value=</span><span style="color:#b0b">\"</span><span style="color:#b0b">\"</span><span style="color:#D20">&gt;
     &lt;/div&gt;
   &lt;/form&gt;
 &lt;/div&gt;</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso é muito feio. Existe a opção de <a href="https://blog.jayfields.com/2006/12/ruby-multiline-strings-here-doc-or.html">heredocs</a> mas outra forma melhor simplesmente assim:</p>
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
      <td class="code"><pre>id, method, action, length, size = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">search get 140 28</span><span style="color:#710">)</span></span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>
html = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20"> &lt;div id="hsearch"&gt;  
  &lt;form id="</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>id<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" action="</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>action<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" method="</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>method<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" 
    autocomplete="off"&gt;       
    &lt;div&gt;           
      &lt;input autocomplete="off" name="q" class="textbox" 
      placeholder="search" tabindex="1" type="text" 
      maxlength="</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>length<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" size="</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>size<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" value=""&gt;       
    &lt;/div&gt;       
  &lt;/form&gt;   
&lt;/div&gt; </span><span style="color:#710">}</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Usar “%” com praticamente qualquer outro operador como “[]” ou “{}” costuma funcionar da mesma forma. Aproveitando, para quem não sabia, na primeira linha desse exemplo está outro jeito alternativo de declarar Arrays de strings, usando “%w()”. O exemplo abaixo, as duas linguas são equivalentes:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>array = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bar</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">world</span><span style="color:#710">"</span></span>]
array = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">foo bar hello world</span><span style="color:#710">)</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Especialmente se forem muitos elementos diferentes pra inicializar, a segunda forma é bem mais legível.</p>
<h2>Condicionais</h2>
<p>O exemplo a seguir deve ser fácil de entender pra qualquer programador:</p>
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
      <td class="code"><pre>dinheiro = <span style="color:#00D">600</span>
<span style="color:#F00;background-color:#FAA"> </span>imposto = <span style="color:#00D">0</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">if</span> dinheiro &gt; <span style="color:#00D">10000</span><span style="color:#F00;background-color:#FAA"> </span>
  imposto = <span style="color:#00D">100</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">elsif</span> dinheiro &lt;= <span style="color:#00D">10000</span> <span style="color:#080;font-weight:bold">and</span> dinheiro &gt; <span style="color:#00D">500</span><span style="color:#F00;background-color:#FAA"> </span>
  imposto = <span style="color:#00D">10</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">else</span>
  imposto = <span style="color:#00D">1</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; 10</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Assumo que independente de qual linguagem você veio, esse trecho não deve ter nenhuma dúvida. Agora, algumas coisas que podemos fazer diferente. Primeiro uma dica simples. Números em Ruby podem ser delimitador no campo de milhar com “_”. As linhas seguintes são equivalentes:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>a = <span style="color:#00D">1000000000000</span>
b = <span style="color:#00D">1_000_000_000_000</span>
a == b
<span style="color:#777">#=&gt; true</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Mas vocês vão concordar que a segunda forma é bem mais legível. Então já podemos melhorar o exemplo anterior assim:</p>
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
      <td class="code"><pre>dinheiro = <span style="color:#00D">600</span>
<span style="color:#F00;background-color:#FAA"> </span>
imposto =  <span style="color:#080;font-weight:bold">if</span> dinheiro &gt; <span style="color:#00D">10_000</span><span style="color:#F00;background-color:#FAA"> </span>
  <span style="color:#00D">100</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">elsif</span> dinheiro &lt;= <span style="color:#00D">10_000</span> <span style="color:#080;font-weight:bold">and</span> dinheiro &gt; <span style="color:#00D">500</span><span style="color:#F00;background-color:#FAA"> </span>
  <span style="color:#00D">10</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">else</span>
  <span style="color:#00D">1</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; 10</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note outra diferença: normalmente dentro do resultados de uma condicional você atribui alguma valor à uma variável. Se o objetivo do bloco “if” e suas condicionais for preencher a mesma variável, podemos utilizar o fato que todas as construções de bloco no Ruby, como “if”, “while”, “case”, “for” e outros sempre devolvem o valor da última expressão executada. Então o “if” todo vai devolver um valor e podemos atribuí-la à variável que queremos. Lembrem também que em Ruby não precisamos usar “return” ao sair de métodos, pois também todo método sempre retorna o valor da última expressão executada. Assim, o exemplo acima equivale ao primeiro desta seção.</p>
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
      <td class="code"><pre>dinheiro = <span style="color:#00D">600</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>imposto = <span style="color:#080;font-weight:bold">case</span> dinheiro
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">when</span> (<span style="color:#00D">0</span>..<span style="color:#00D">500</span>) <span style="color:#080;font-weight:bold">then</span> <span style="color:#00D">1</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">when</span> (<span style="color:#00D">500</span>..<span style="color:#00D">10_000</span>) <span style="color:#080;font-weight:bold">then</span> <span style="color:#00D">10</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">else</span> <span style="color:#00D">100</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">end</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; 10 </span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, 3 coisas. Primeiro, trocamos o “if” por um “case”, que nesse caso é bem melhor. Segundo, usamos o mesmo fato de “case” também devolver um resultado e atribuir à variável “imposto”. Finalmente, resolvi usar um “Range” para a comparação.</p>
<p>Falando sobre o “case”, os dois exemplos a seguir não são equivalentes, apesar do efeito ser o mesmo:</p>
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
      <td class="code"><pre><span style="color:#777"># exemplo 1</span>
<span style="color:#080;font-weight:bold">if</span> a == b
 ...
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># exemplo 2</span>
<span style="color:#080;font-weight:bold">case</span> a
<span style="color:#080;font-weight:bold">when</span> b <span style="color:#080;font-weight:bold">then</span> ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O “when” na realidade não executa “==” mas sim “===”. No caso original, quando fazemos <tt>case dinheiro; when (0..500)</tt> o método “===” na realidade está fazendo <tt>(0..500).include?(dinheiro)</tt>. O exemplo a seguir ilustra essa funcionalidade mas deixo a cargo do leitor descobrir como esse código funciona:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">multiplo_de</span>(x)
  <span style="color:#036;font-weight:bold">Proc</span>.new { |produto| produto.modulo(x).zero? }  
<span style="color:#080;font-weight:bold">end</span>
numero = <span style="color:#00D">10</span>
<span style="color:#080;font-weight:bold">case</span> numero
<span style="color:#080;font-weight:bold">when</span> multiplo_de(<span style="color:#00D">3</span>) <span style="color:#080;font-weight:bold">then</span> puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">múltiplo de 3</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> multiplo_de(<span style="color:#00D">5</span>) <span style="color:#080;font-weight:bold">then</span> puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">múltiplo de 5</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">when</span> multiplo_de(<span style="color:#00D">7</span>) <span style="color:#080;font-weight:bold">then</span> puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">múltiplo de 7</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777">#=&gt; múltiplo de 5</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Caso tenha dado nó na cabeça, a dica pra entender é que as chamadas a seguir são equivalentes:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>multiplo_de(<span style="color:#00D">10</span>).call(<span style="color:#00D">10</span>)
multiplo_de(<span style="color:#00D">10</span>).===(<span style="color:#00D">10</span>)
multiplo_de(<span style="color:#00D">10</span>) === <span style="color:#00D">10</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Ranges e Enumerators</h2>
<p>Divaguei um pouco em relação ao exemplo original da seção anterior. Lembrem que mencionei vagamente sobre <a href="https://ruby-doc.org/core-1.9.3/Range.html">Range</a>. Para quem não sabe, um Range é uma classe que representa um intervalo. Veja a documentação, pois um Range não precisa ser um intervalo apenas numérico, pode ser intervalo entre strings ou entre quaisquer objetos que implementem o protocolo com os métodos <tt>&lt;=&gt;</tt> e <tt>succ</tt>.</p>
<p>Vejamos alguns exemplos:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">for</span> i <span style="color:#080;font-weight:bold">in</span> (<span style="color:#00D">5</span>..<span style="color:#00D">100</span>)
  ...
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#00D">5</span>.upto(<span style="color:#00D">100</span>) <span style="color:#080;font-weight:bold">do</span> |i|
 ...
<span style="color:#080;font-weight:bold">end</span>
(<span style="color:#00D">5</span>..<span style="color:#00D">100</span>).each <span style="color:#080;font-weight:bold">do</span> |i|
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Os três exemplos acima são equivalentes. No caso do método <tt>upto</tt>, lembrar que existe o oposto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#00D">100</span>.downto(<span style="color:#00D">5</span>) <span style="color:#080;font-weight:bold">do</span> |i|
 ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, podemos expandir um Range em um Array. Duas formas para isso:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>array = (<span style="color:#00D">5</span>..<span style="color:#00D">100</span>).to_a
array = [*(<span style="color:#00D">5</span>..<span style="color:#00D">100</span>)]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O segundo exemplo é uma coerção usando splat, vamos ver splats mais abaixo.</p>
<p>Como exercício, podemos ver um exemplo onde queremos somar todos os números entre 5 e 100. Todos os exemplos abaixo são equivalentes:</p>
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
      <td class="code"><pre><span style="color:#777"># iniciantes fazem algo assim:</span>
total = <span style="color:#00D">0</span>
<span style="color:#080;font-weight:bold">for</span> i <span style="color:#080;font-weight:bold">in</span> (<span style="color:#00D">5</span>..<span style="color:#00D">100</span>)
  total += i
<span style="color:#080;font-weight:bold">end</span>
puts total
<span style="color:#777">#=&gt; 5040</span>
<span style="color:#777"># quem aprendeu um pouco mais de métodos de Enumerator, faz assim:</span>
total = <span style="color:#00D">0</span>
(<span style="color:#00D">5</span>..<span style="color:#00D">100</span>).each <span style="color:#080;font-weight:bold">do</span> |i|
  total += i
<span style="color:#080;font-weight:bold">end</span>
total
<span style="color:#777">#=&gt; 5040</span>
<span style="color:#777"># o ideal é aprender sobre #reduce e #inject (que são a mesma coisa):</span>
(<span style="color:#00D">5</span>..<span style="color:#00D">100</span>).reduce(<span style="color:#00D">0</span>) { |total, i| total += i }
<span style="color:#777">#=&gt; 5040</span>
<span style="color:#777"># e o jeito melhor ainda de #reduce, se for só um método pra reduzir</span>
(<span style="color:#00D">5</span>..<span style="color:#00D">100</span>).reduce(<span style="color:#00D">0</span>, <span style="color:#A60">:+</span>)
<span style="color:#777">#=&gt; 5040</span>
<span style="color:#777"># se o valor inicial for zero mesmo, o seguinte é a mesma coisa:</span>
(<span style="color:#00D">5</span>..<span style="color:#00D">100</span>).reduce(<span style="color:#A60">:+</span>)
<span style="color:#777">#=&gt; 5040</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Hashes</h2>
<p>Uma das estruturas de dados mais úteis do Ruby depois dos Arrays é sem dúvida o Hash. Ele é basicamente um dicionário, uma coleção de pares de chaves (key) ligando a valores. Ele pode ser inicializado de várias formas, mas as mais conhecidas são:</p>
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
      <td class="code"><pre><span style="color:#777"># versões 1.8 e 1.9</span>
hash = { <span style="color:#A60">:chave_a</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor a</span><span style="color:#710">"</span></span>, <span style="color:#A60">:chave_b</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor b</span><span style="color:#710">"</span></span> }
<span style="color:#777"># somente versão 1.9 e superior</span>
hash = { chave_a: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor a</span><span style="color:#710">"</span></span>, chave_b: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor b</span><span style="color:#710">"</span></span> }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Uma coisa que normalmente não é tão lembrado é que posso utilizar um Array para popular um Hash, sendo que o Array contém elementos intercalados de chave e valor, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>array = [<span style="color:#A60">:chave_a</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor a</span><span style="color:#710">"</span></span>, <span style="color:#A60">:chave_b</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor b</span><span style="color:#710">"</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, podemos usar o <a href="https://www.jacopretorius.net/2012/01/splat-operator-in-ruby.html">operador splat</a> com o método <tt>[]</tt> da class Hash:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>hash = <span style="color:#036;font-weight:bold">Hash</span>[*array]
<span style="color:#777">#=&gt; {:chave_a=&gt;"valor a", :chave_b=&gt;"valor b"}</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja o artigo no link para mais exemplos de como usar o operador splat. Mas voltando ao assunto, vemos como é simples pegar um Array interpolado de chaves e valores e gerar um Hash. Não é tão comum, por outro lado, ter arrays nesse formato. Normalmente temos pelo menos dois arrays de mesma quantidade de elementos, um com chaves e outro com valores, e digamos que queremos gerar um Hash a partir delas. Eis alguns exemplos:</p>
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
      <td class="code"><pre>chaves  = [<span style="color:#A60">:chave_a</span>, <span style="color:#A60">:chave_b</span>]
valores = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor a</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor b</span><span style="color:#710">"</span></span>]
<span style="color:#777"># jeito que a maioria começa fazendo: (feio)</span>
hash = {}
<span style="color:#080;font-weight:bold">for</span> i <span style="color:#080;font-weight:bold">in</span> (<span style="color:#00D">1</span>..chaves.size)
  hash[chaves[i - <span style="color:#00D">1</span>]] = valores[i - <span style="color:#00D">1</span>]
<span style="color:#080;font-weight:bold">end</span>
hash
<span style="color:#777">#=&gt; {:chave_a=&gt;"valor a", :chave_b=&gt;"valor b"}</span>
<span style="color:#777"># melhor:</span>
hash = <span style="color:#036;font-weight:bold">Hash</span>[chaves.zip(valores)]
<span style="color:#777">#=&gt; {:chave_a=&gt;"valor a", :chave_b=&gt;"valor b"}</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para lembrar da utilidade do método <tt>zip</tt>, literalmente pensem num zíper de uma jaqueta. Além disso, falamos um pouco de coerção via operador splat, o oposto da operação que fizemos acima é o seguinte:</p>
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
      <td class="code"><pre>hash = { chave_a: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor a</span><span style="color:#710">"</span></span>, chave_b: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">valor b</span><span style="color:#710">"</span></span> }
array = *hash
<span style="color:#777">#=&gt; [[:chave_a, "valor a"], [:chave_b, "valor b"]]</span>
array.flatten
<span style="color:#777">#=&gt; [:chave_a, "valor a", :chave_b, "valor b"]</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Arrays e Splat</h2>
<p>Recapitulando, vamos esquentar vendo formas diferentes de inicializar o mesmo tipo de Array:</p>
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
      <td class="code"><pre>lista = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>]<span style="color:#F00;background-color:#FAA"> </span>
lista = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">foo foo foo foo foo</span><span style="color:#710">)</span></span><span style="color:#F00;background-color:#FAA"> </span>
lista = <span style="color:#036;font-weight:bold">Array</span>.new(<span style="color:#00D">5</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>)<span style="color:#F00;background-color:#FAA"> </span>
lista = <span style="color:#036;font-weight:bold">Array</span>.new(<span style="color:#00D">5</span>) { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span> }<span style="color:#F00;background-color:#FAA"> </span>
lista = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>] * <span style="color:#00D">5</span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777">#=&gt; ["foo", "foo", "foo", "foo", "foo"]</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Todos já estiveram numa situação onde cortaram uma string em diversos “tokens” e tiveram que atribuir cada token a uma variável diferente, certo? Vejamos primeiro o exemplo mais ingenuo disso:</p>
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
</pre>
      </td>
      <td class="code"><pre>texto = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">2012 Agosto 26 Hello World</span><span style="color:#710">"</span></span><span style="color:#F00;background-color:#FAA"> </span>
palavras = texto.split(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span>)<span style="color:#F00;background-color:#FAA"> </span> <span style="color:#777"># cortando por espaço</span>
<span style="color:#777"># atribuindo por posiçao no array</span>
ano = palavras[<span style="color:#00D">0</span>]<span style="color:#F00;background-color:#FAA"> </span>
mes = palavras[<span style="color:#00D">1</span>]<span style="color:#F00;background-color:#FAA"> </span>
dia = palavras[<span style="color:#00D">2</span>]<span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777"># acumulador, uma variável que vai conter todo o "restante"</span>
lixo = []<span style="color:#F00;background-color:#FAA"> </span>
i = <span style="color:#00D">3</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#080;font-weight:bold">while</span> i &lt; palavras.size<span style="color:#F00;background-color:#FAA"> </span>
  lixo &lt;&lt; palavras[i]<span style="color:#F00;background-color:#FAA"> </span>
  i += <span style="color:#00D">1</span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#F00;background-color:#FAA"> </span>puts lixo.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">, </span><span style="color:#710">"</span></span>)
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; "Hello, World"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, quem veio de outras linguagens provavelmente não achará nada estranho nesse trecho. Vejamos como poderíamos rubificá-lo:</p>
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
      <td class="code"><pre>texto = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">2012 Agosto 26 Hello World</span><span style="color:#710">"</span></span><span style="color:#F00;background-color:#FAA"> </span>
palavras = texto.split(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span>)<span style="color:#F00;background-color:#FAA"> </span>
ano, mes, dia, *lixo = palavras<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>
puts lixo.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">, </span><span style="color:#710">"</span></span>)<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777">#=&gt; "Hello, World"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pois é, já tínhamos visto que podemos atribuir múltiplas variáveis ao mesmo tempo usando um Array, mas além disso usando um splat podemos pegar aquele “resto do Array” como gostaríamos, tudo de uma só vez.</p>
<p>Outro exemplo para explorar isso, vejamos o seguinte:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">formatar_data</span>(dia, mes, ano)
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>dia<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>mes<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>ano<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>args = [<span style="color:#00D">27</span>, <span style="color:#00D">8</span>, <span style="color:#00D">2012</span>]
<span style="color:#F00;background-color:#FAA"> </span>formatar_data(args[<span style="color:#00D">0</span>], args[<span style="color:#00D">1</span>], args[<span style="color:#00D">2</span>])
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; 27/8/2012</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Temos uma função que recebe 3 parâmetros. Por acaso temos os 3 parâmetros num Array. Em outras linguagens, podemos atribuir parâmetro a parâmetro usando posição do Array. Ou podemos usar o splat para expandir o Array nos parâmetros do método diretamente, assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>args = [<span style="color:#00D">27</span>, <span style="color:#00D">8</span>, <span style="color:#00D">2012</span>]<span style="color:#F00;background-color:#FAA"> </span>
formatar_data(*args)<span style="color:#F00;background-color:#FAA"> </span><span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777">#=&gt; 27/8/2012</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No link sobre splats que passei acima, esse e outros exemplos estão explicados em mais detalhes.</p>
<p>Existe uma situação que muitos já devem ter visto, vejamos:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">algum_metodo</span>(foo, bar, args)
  args = [args] <span style="color:#080;font-weight:bold">unless</span> args.is_a? <span style="color:#036;font-weight:bold">Array</span>
  args.each <span style="color:#080;font-weight:bold">do</span> |elem|
    ...
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não é o melhor exemplo, mas digamos que você acabe com uma variável que possa ser tanto uma string quanto um array e a sequência assume um array (por exemplo, vai iterar nela, como no exemplo), então se só tiver um elemento, primeiro precisa convertar ela num array. Ou podemos usar o splat assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">algum_metodo</span>(foo, bar, args)
  [*args].each <span style="color:#080;font-weight:bold">do</span> |elem|
    ...
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se for um elemento só a coerção resulta nele mesmo. Se for um Array, em vez de acabar com um Array dentro de outro Array, a coerção vai expandir os elementos do array <tt>args</tt> dentro do novo array, ou seja, vai dar no mesmo. E o mesmo código vale pra ambos.</p>
<h2>Miscelânea</h2>
<p>Já precisaram juntar todos os elementos de um Array num String? Fácil, método <tt>join</tt>, certo? Vejamos:</p>
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
      <td class="code"><pre>[<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">4</span>, <span style="color:#00D">5</span>].join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">, </span><span style="color:#710">"</span></span>)
<span style="color:#777">#= "1, 2, 3, 4, 5"</span>
[<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">4</span>, <span style="color:#00D">5</span>] * <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">, </span><span style="color:#710">"</span></span>
<span style="color:#777">#= "1, 2, 3, 4, 5"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finalmente, a última dica, uma coisa que eu eventualmente me esqueço e me lembro de novo:</p>
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
      <td class="code"><pre><span style="color:#777"># numero aleatório, esse é simples</span>
numero = rand(<span style="color:#00D">10_000_000_000</span>)<span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777">#=&gt; 9773914651 </span>
<span style="color:#777"># transformar um inteiro base 10 em base 2</span>
<span style="color:#F00;background-color:#FAA"> </span>numero.to_s(<span style="color:#00D">2</span>)<span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777">#=&gt; "1001000110100100100001101000011011" </span>
<span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777"># transformar um inteiro base 10 em base 8</span>
numero.to_s(<span style="color:#00D">8</span>)
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; "110644415033" </span>
<span style="color:#F00;background-color:#FAA"> </span>
<span style="color:#777"># transformar um inteiro base 10 em base 36</span>
numero.to_s(<span style="color:#00D">36</span>)
<span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; "4hn4wt7"  </span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E esta é a volta:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># transformar da base 36 na base 10 de novo</span>
<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">4hn4wt7</span><span style="color:#710">"</span></span>.to_i(<span style="color:#00D">36</span>)<span style="color:#F00;background-color:#FAA"> </span><span style="color:#777">#=&gt; 9773914651</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Gostaram das dicas? Evitei aqueles mais cabeludos que chegam a ser ilegíveis e mais parecidos com one-liners de Perl :-) Se lembrarem de outros truques de Ruby diferentes, não deixem de colocar nos comentários.</p>
<p></p>
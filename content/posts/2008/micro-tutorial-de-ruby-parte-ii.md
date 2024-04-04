---
title: "Micro-Tutorial de Ruby - Parte II"
date: "2008-11-10T03:42:00.000Z"
tags: ["beginner", "ruby", "tutorial"]
years: "2008"
---

<p></p>
<p>Vamos continuar de onde paramos. Leia a <a href="/2008/11/10/micro-tutorial-de-ruby-parte-i">Parte I</a> antes de continuar. Mas antes, mais algumas dicas:</p>
<p>Para quem quer aprender Ruby com material em português tem três opções: <a href="http://aprendaaprogramar.rubyonrails.pro.br/">Aprenda a Programar</a> que foi um esforço de tradução da comunidade Brasileira, é um livro bem mais básico para quem sequer tem treinamento em programação. Também tem o <a href="http://github.com/carlosbrando/poignant-br/tree/master">Why’s Poignant Guide to Ruby</a> que é outro esforço coletivo de tradução da nossa comunidade, liderada pelo Carlos Brando. O livro do Why é um grande clássico da literatura de Ruby. O TaQ também tem um <span class="caps">PDF</span> disponível para <a href="http://eustaquiorangel.com/downloads/tutorialruby.pdf">download</a>.</p>
<p></p>
<p></p>
<h2>Métodos vs Mensagens</h2>
<p>Na seção anterior vimos como podemos organizar nosso código em módulos e durante os exemplos usamos um método estranho, o “send”. Vamos ver para que ele serve de fato.</p>
<p>Outra noção que precisamos mudar aqui: <em>“nós chamamos métodos dos objetos.”</em> Em orientação a objetos, na realidade deveria ser <em>“nós enviamos mensagens aos objetos.”</em> Por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>.hello
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">hello' for "teste":String
        from (irb):1
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O pensamento comum seria: <em>“tentamos chamar o método ‘hello’ que não existe em String.”</em> Mas devemos pensar assim: <em>“tentamos enviar a mensagem ‘hello’ ao objeto e sua resposta padrão é que ele não sabe responder a essa mensagem.”</em></p>
<p>Podemos reescrever o mesmo comportamento acima da seguinte forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>.send(<span style="color:#A60">:hello</span>)
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">hello' for "teste":String
        from (irb):22:in </span><span style="color:#161">`</span></span>send<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">
        from (irb):22
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Outro exemplo de ‘envio de mensagens’:</p>
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
      <td class="code"><pre>&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>.diga(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>)
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">diga' for "teste":String
        from (irb):24
&gt;&gt; "teste".send(:diga, "Fabio")
NoMethodError: undefined method </span><span style="color:#161">`</span></span>diga<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20"> for "teste":String
        from (irb):25:in `send</span><span style="color:#710">'</span></span>
        from (irb):<span style="color:#00D">25</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Está entendendo o padrão? O equivalente a <em>‘chamar um método’</em> é como se estivéssemos chamando o método ‘send’ onde o primeiro parâmetro é o ‘nome do método’ e a seguir uma lista (de tamanho arbitrário) de parâmetros. Numa linguagem tradicional, uma vez que a classe é definida, o contrato está fechado. Mas como vimos antes, em Ruby, nada é fechado. No caso, tentamos enviar uma mensagem chamada :diga e :hello que o String “teste” não sabe como responder. A resposta padrão é enviar uma exceção ‘NoMethodError’ indicando o erro.</p>
<p>Podemos resolver esse problema de duas formas: 1) reabrindo a classe String e definindo um método chamado ‘hello’ ou ‘diga’ ou 2) fazer com que a String receba qualquer mensagem, independente se existe um método para responder a ela ou não.</p>
<p>Nesse segundo caso, poderíamos fazer o seguinte:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">String</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">method_missing</span>(metodo, *args)
    puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Nao conheco o metodo </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>metodo<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">. Os argumentos foram:</span><span style="color:#710">"</span></span>
    args.each { |arg| puts arg }
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Antes de explicar, vejamos agora como o String “teste” vai se comportar:</p>
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
      <td class="code"><pre>&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>.hello
<span style="color:#036;font-weight:bold">Nao</span> conheco o metodo hello. Os argumentos foram:
=&gt; []
&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>.diga(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>)
<span style="color:#036;font-weight:bold">Nao</span> conheco o metodo diga. Os argumentos foram:
<span style="color:#036;font-weight:bold">Fabio</span>
=&gt; [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>]
&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>.blabla(<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>)
<span style="color:#036;font-weight:bold">Nao</span> conheco o metodo blabla. Os argumentos foram:
<span style="color:#00D">1</span>
<span style="color:#00D">2</span>
<span style="color:#00D">3</span>
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se você pensar em <em>“chamar métodos”</em> o que estamos fazendo acima parece muito estranho pois estaríamos <em>“chamando métodos que não existem”</em>. Mas se mudar o ponto de vista para <em>“enviar mensagens a objetos”</em> agora temos <em>“objetos que respondem a qualquer mensagem”</em>.</p>
<p>Outra coisa que é meio polêmico são métodos privados. Em Ruby podemos fazer assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Teste</span>
  private
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">alo</span>
     <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">alo</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; <span style="color:#036;font-weight:bold">Teste</span>.new.alo
<span style="color:#036;font-weight:bold">NoMethodError</span>: private method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">alo' called for #&lt;Teste:0x17d3b3c&gt;
        from (irb):47
&gt;&gt; Teste.new.send(:alo)
=&gt; "alo"
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Essa classe ‘Foo’ tem um método privado (tudo que vem depois de ‘private’). A primeira tentativa de chamar o método “alo” falha, obviamente, por ser um método privado. Mas a segunda tentativa, usando “send” é bem sucedido! Na realidade “private” serve para indicar que não deveríamos estar acessando determinado método, mas Ruby não nos força a não conseguir. Se nós realmente quisermos, temos que explicitamente usar “send”, mas aí nós estamos conscientemente fazendo algo que “não deveríamos”. Ruby não é paternalista: é feita para quem sabe o que está fazendo.</p>
<p>Por isso no artigo anterior usamos Pessoa.send(:include, MeusPatches), porque “include” é um método privado que só deveria ser usado dentro da própria classe. Mas esse “pattern” costuma funcionar.</p>
<p>Talvez o melhor exemplo para demonstrar esta funcionalidade dinâmica é mostrando o <span class="caps">XML</span> Builder. Primeiro, instale a gem:</p>
<macro:code>
  <p>gem install builder</p>
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
</pre>
        </td>
        <td class="code"><pre>Agora podemos usar no IRB:
--- ruby
&gt;&gt; require 'rubygems'
&gt;&gt; require 'builder'
=&gt; false
&gt;&gt; x = Builder::XmlMarkup.new(:target =&gt; $stdout, :indent =&gt; 1)
&lt;inspect/&gt;
=&gt; #&lt;IO:0x12b7cc&gt;
&gt;&gt; x.instruct!
&lt;?xml version="1.0" encoding="UTF-8"?&gt;
=&gt; #&lt;IO:0x12b7cc&gt;
&gt;&gt; x.pessoa do |p|
?&gt;     p.nome "Fabio Akita"
&gt;&gt;     p.email "fabioakita@gmail.com"
&gt;&gt;     p.telefones do |t|
?&gt;       t.casa "6666-8888"
&gt;&gt;       t.trabalho "2222-3333"
&gt;&gt;     end
&gt;&gt;   end
&lt;pessoa&gt;
 &lt;nome&gt;Fabio Akita&lt;/nome&gt;
 &lt;email&gt;fabioakita@gmail.com&lt;/email&gt;
 &lt;telefones&gt;
  &lt;casa&gt;6666-8888&lt;/casa&gt;
  &lt;trabalho&gt;2222-3333&lt;/trabalho&gt;
 &lt;/telefones&gt;
&lt;/pessoa&gt;
=&gt; #&lt;IO:0x12b7cc&gt;
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Como podem ver, instanciamos a classe XmlMarkup na variável “x”. Daí passamos a enviar mensagens como “pessoa” ou “email” e ele gera os tags <span class="caps">XML</span> adequadamente. Muito diferente do que teríamos que fazer do jeito tradicional:</p>
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
        <td class="code"><pre><span style="color:#080;font-weight:bold">import</span> <span style="color:#B44;font-weight:bold">org.w3c.dom</span>.*;
<span style="color:#080;font-weight:bold">import</span> <span style="color:#B44;font-weight:bold">javax.xml.parsers</span>.*; 
<span style="color:#080;font-weight:bold">import</span> <span style="color:#B44;font-weight:bold">javax.xml.transform</span>.*; 
<span style="color:#339;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">CreateDomXml</span> 
{
  <span style="color:#088;font-weight:bold">public</span> <span style="color:#088;font-weight:bold">static</span> <span style="color:#339;font-weight:bold">void</span> main(<span style="color:#0a5;font-weight:bold">String</span><span style="color:#339;font-weight:bold">[]</span> args) 
  {
    <span style="color:#080;font-weight:bold">try</span>{
      <span style="color:#0a5;font-weight:bold">DocumentBuilderFactory</span> factory = <span style="color:#0a5;font-weight:bold">DocumentBuilderFactory</span>.newInstance();
      <span style="color:#0a5;font-weight:bold">DocumentBuilder</span> docBuilder = factory.newDocumentBuilder();
      <span style="color:#0a5;font-weight:bold">Document</span> doc = docBuilder.newDocument();
      <span style="color:#0a5;font-weight:bold">Element</span> root = doc.createElement(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">pessoa</span><span style="color:#710">"</span></span>);
      doc.appendChild(root);
      <span style="color:#0a5;font-weight:bold">Element</span> childElement = doc.createElement(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nome</span><span style="color:#710">"</span></span>);
      childElement.setValue(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio Akita</span><span style="color:#710">"</span></span>);
      root.appendChild(childElement);
      childElement = doc.createElement(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">email</span><span style="color:#710">"</span></span>);
      childElement.setValue(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabioakita@gmail.com</span><span style="color:#710">"</span></span>);
      root.appendChild(childElement);
      .....
    } <span style="color:#080;font-weight:bold">catch</span>(<span style="color:#C00;font-weight:bold">Exception</span> e) {
      <span style="color:#0a5;font-weight:bold">System</span>.out.println(e.getMessage());
    }
  }
}
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Note que este código sequer está completo pois seria comprido demais para mostrar aqui. A idéia toda de usar os conceitos de <strong>meta-programação</strong>, de redefinição dinâmica de comportamento do objeto, é de permitir que você nunca precise fazer mais código do que realmente necessário. Na versão Ruby, temos no máximo a mesma quantidade de linhas que o <span class="caps">XML</span> resultante, graças à capacidade de ter um método ‘method_missing’ que consegue definir dinamicamente o que fazer com cada nova mensagem inesperada.</p>
  <h2>Higher Order Functions e Blocos</h2>
  <p>Vejamos o Design Pattern chamado Command:</p>
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
        <td class="code"><pre>interface <span style="color:#036;font-weight:bold">Command</span> {
  public void execute();
}
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Button</span> {
  <span style="color:#036;font-weight:bold">Command</span> action;
  public void setCommand(<span style="color:#036;font-weight:bold">Command</span> action) {
    this.action = action;
  }
  public void click() {
    this.action.execute();        
  }
}
<span style="color:#036;font-weight:bold">Button</span> myButton = new Button();
myButton.setCommand(new Command() {
  public void execute() {
    <span style="color:#036;font-weight:bold">System</span>.out.println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Clicked!!</span><span style="color:#710">"</span></span>);
  }
});
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O que está acontecendo aqui é o seguinte: Criamos uma interface com um único método chamado ‘execute’. Daí criamos uma classe ‘Button’ onde podemos configurar que ação cada instância dele executará ao ser clicado. Essa ação é uma instância de um objeto que implementa Command. No final, criamos uma instância de Button e uma classe anônima (sem nome) com a implementação do método ‘execute’ para aquela instância.</p>
  <p>Vejamos o mesmo exemplo do Design Pattern Command em Ruby (um dos vários jeitos de implementar):</p>
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
        <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Button</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(&amp;block)
    <span style="color:#33B">@block</span> = block
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">click</span>
    <span style="color:#33B">@block</span>.call
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
my_button = <span style="color:#036;font-weight:bold">Button</span>.new { puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Clicked!!</span><span style="color:#710">"</span></span> }
my_button.click
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Primeiro, claro, bem mais curto, mas o mais importante: não precisamos encapsular uma ação como método de uma classe. Em linguagens tradicionais que não tem o conceito de “funções como cidadãos de primeira classe”, precisamos encapsular qualquer coisa em classes, mesmo que sejam classes anônimas.</p>
  <p>No Ruby, temos o conceito de “código como objeto”. Na realidade encapsulamos o código diretamente em um objeto. No exemplo acima, o construtor ‘initialize’ captura qualquer bloco de código que passarmos a ele dentro da variável ‘block’ (para isso serve o “&amp;”). Daí quando instanciamos o parâmetro que passamos entre chaves {} é o bloco de código capturado como objeto e associado à variável ‘block’.</p>
  <p>A partir daí ele fica armazenado como uma variável de instância “@block” e no método ‘click’ podemos executar esse bloco de código enviando a mensagem ‘call’ (afinal, ele é um objeto e, portanto, responde a métodos).</p>
  <p>Vejamos um exemplo mais simples:</p>
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
        <td class="code"><pre>&gt;&gt; <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">diga_algo</span>(nome)
&gt;&gt;   <span style="color:#080;font-weight:bold">yield</span>(nome)
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; diga_algo(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>) { |nome| puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello, </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span> }
<span style="color:#036;font-weight:bold">Hello</span>, <span style="color:#036;font-weight:bold">Fabio</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; diga_algo(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>) { |nome| puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello, </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span> }
<span style="color:#036;font-weight:bold">Hello</span>, <span style="color:#036;font-weight:bold">Akita</span>
=&gt; <span style="color:#069">nil</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Agora complicou: primeiro definimos um método chamado ‘diga_algo’ que recebe apenas um parâmetro. Dentro do método chamamos o comando especial ‘yield’, passando o parâmetro recebido a ele. Esse comando ‘yield’ executa qualquer bloco que foi passado como último parâmetro à chamada do método. É como se o método ‘diga_algo’ tivesse um segundo parâmetro implícito – digamos, ‘&amp;b’ – e ‘yield(nome)’ fosse a mesma coisa que chamar ‘b.call(nome)’.</p>
  <p>Preste atenção neste trecho:</p>
  <hr>
  ruby{ |nome| puts “Hello, #{nome}” }<table class="CodeRay">
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
        <td class="code"><pre>Pense nisso como se fosse uma função anônima: o que está entre pipes "||" são parâmetros dessa função. O 'yield' irá executar esse bloco de código. Por acaso, ele passará o parâmetro 'nome' para dentro do bloco Vejamos outro exemplo:
--- ruby
&gt;&gt; soma = lambda { |a, b| a + b }
=&gt; #&lt;Proc:0x012d4898@(irb):46&gt;
&gt;&gt; soma.call(1,2)
=&gt; 3
&gt;&gt; soma.call(4,4)
=&gt; 8
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O comando ‘lambda’ serve para capturar o bloco de código numa instância da classe Proc. No exemplo, esse bloco aceita dois parâmetros, “a” e “b” e faz a soma deles. Depois podemos pegar o objeto ‘soma’ e chamar o método ‘call’ passando os dois parâmetros que ele requer.</p>
  <p>No Ruby 1.8, um bloco também é uma <strong>Closure</strong> (“Fechamento”). Ou seja, o bloco de código engloba o ambiente ao seu redor, incluindo variáveis fora do bloco. Por exemplo:</p>
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
        <td class="code"><pre>&gt;&gt; <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">criar_bloco</span>(nome)
&gt;&gt;   lambda { puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>}
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; 
<span style="color:#00D">?&gt;</span> fabio = criar_bloco(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>)
=&gt; <span style="color:#777">#&lt;Proc:0x0124aae4@(irb):59&gt;</span>
&gt;&gt; akita = criar_bloco(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>)
=&gt; <span style="color:#777">#&lt;Proc:0x0124aae4@(irb):59&gt;</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O método ‘criar_bloco’ retorna um novo bloco de código. Note que o método recebe o parâmetro ‘nome’ e daí criamos o novo lambda usando esse ‘nome’ dentro dele. Finalmente chamamos o método duas vezes, criando dois lambdas diferentes, passando dois parâmetros diferentes a ‘nome’.</p>
  <p>Agora vamos executar esses blocos:</p>
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
        <td class="code"><pre>&gt;&gt; fabio.call
<span style="color:#036;font-weight:bold">Hello</span> <span style="color:#036;font-weight:bold">Fabio</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; akita.call
<span style="color:#036;font-weight:bold">Hello</span> <span style="color:#036;font-weight:bold">Akita</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; fabio.call
<span style="color:#036;font-weight:bold">Hello</span> <span style="color:#036;font-weight:bold">Fabio</span>
=&gt; <span style="color:#069">nil</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Veja que o bloco <strong>reteve</strong> o conteúdo do parâmetro ‘nome’ que foi passado como argumento ao método ‘criar_bloco’. Cada um dos blocos reteve o parâmetro, e como os configuramos com conteúdos diferentes, ao serem executados eles tem comportamentos diferentes. Esse conceito de <strong>Fechamento</strong> é um pouco complicado da primeira vez, por isso se você pelo menos entendeu que existem blocos e que eles são encapsulados em objetos anônimos que chamamos de <strong>lambdas</strong>, por enquanto é o suficiente.</p>
  <p>Mas mais do que isso, você viu como métodos Ruby conseguem receber blocos de código e devolver blocos de código. É a isso que chamamos de <a href="https://en.wikipedia.org/wiki/Higher-order_function">Higher Order Functions</a>, ou seja, uma ‘função’ (que chamamos de ‘bloco de código’) pode ser recebido ou repassado como se fosse uma variável qualquer. Isso é muito importante para categorizar Ruby como uma linguagem ‘inspirada em linguagens funcionais’, como Lisp. No caso, lambdas de Ruby não são livres de efeitos-colaterais, por isso ela não pode ser considerada puramente funcional. Mas isso já auxilia em muitas operações e é uma maneira bem mais eficiente inclusive de encapsular funcionalidades.</p>
  <p>Vejamos outro exemplo de código para ler arquivos, começando por Java:</p>
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
        <td class="code"><pre><span style="color:#0a5;font-weight:bold">StringBuilder</span> contents = <span style="color:#080;font-weight:bold">new</span> <span style="color:#0a5;font-weight:bold">StringBuilder</span>();
<span style="color:#080;font-weight:bold">try</span> {
  <span style="color:#0a5;font-weight:bold">BufferedReader</span> input =  <span style="color:#080;font-weight:bold">new</span> <span style="color:#0a5;font-weight:bold">BufferedReader</span>(
    <span style="color:#080;font-weight:bold">new</span> <span style="color:#0a5;font-weight:bold">FileReader</span>(aFile));
  <span style="color:#080;font-weight:bold">try</span> {
    <span style="color:#0a5;font-weight:bold">String</span> line = <span style="color:#069">null</span>; 
    <span style="color:#080;font-weight:bold">while</span> (( line = input.readLine()) != <span style="color:#069">null</span>){
      contents.append(line);
      contents.append(
        <span style="color:#0a5;font-weight:bold">System</span>.getProperty(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">line.separator</span><span style="color:#710">"</span></span>));
    }
  }
  <span style="color:#080;font-weight:bold">finally</span> {
    input.close();
  }
}
<span style="color:#080;font-weight:bold">catch</span> (<span style="color:#C00;font-weight:bold">IOException</span> ex){
  ex.printStackTrace();
}
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Algo parecido, de forma literal, em Ruby, ficaria assim:</p>
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
        <td class="code"><pre>contents = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">begin</span>
  input = <span style="color:#036;font-weight:bold">File</span>.open(aFile, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">r</span><span style="color:#710">"</span></span>)
  <span style="color:#080;font-weight:bold">begin</span>
    <span style="color:#080;font-weight:bold">while</span> line = input.gets
      contents &lt;&lt; line
      contents &lt;&lt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">ensure</span>
    input.close
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">rescue</span> e
  puts e
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Nada muito diferente, sequer em número de linhas. Porém, se considerarmos o caso de uso <em>“abrir um arquivo e processar seu conteúdo”</em>, todo esse código lida com o fato de abrir o arquivo, garantir que ele seja fechado, tratar exceções. O trecho específico de <em>“processar o conteúdo”</em> é nada mais do que as 4 linhas do bloco ‘while’. Podemos tornar isso mais <em>Rubista</em> criando um novo método ‘open’, que usa o recurso de ‘yield’ que mostramos acima.</p>
  <p>Felizmente o Ruby já implementa o método ‘open’ da classe ‘File’ dessa forma, por isso podemos re-escrever o trecho de código acima assim:</p>
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
        <td class="code"><pre>contents = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
<span style="color:#036;font-weight:bold">File</span>.open(aFile, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">r</span><span style="color:#710">"</span></span>) <span style="color:#080;font-weight:bold">do</span> |input|
  <span style="color:#080;font-weight:bold">while</span> line = input.gets
    contents &lt;&lt; line
    contents &lt;&lt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Um pouco melhor, bem mais encapsulado, expondo apenas o que é realmente essencial ao que queremos fazer. Olhando para este trecho sabemos exatamente que queremos abrir um arquivo e processar linha a linha de seu conteúdo, armazenando o resultado na variável ‘contents’. Todo o resto do <em>encanamento</em> está escondido dentro do método ‘open’. Podemos passar apenas o bloco do ‘while’ como um lambda e ele será executado no meio da implementação desse método. Se fôssemos reimplementar o método ‘open’ da classe ‘File’ para agir dessa forma, poderíamos fazer assim:</p>
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
        <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">File</span> 
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#036;font-weight:bold">File</span>.<span style="color:#06B;font-weight:bold">open</span>(*args) 
    result = f = <span style="color:#036;font-weight:bold">File</span>.new(*args) 
    <span style="color:#080;font-weight:bold">if</span> block_given? 
      <span style="color:#080;font-weight:bold">begin</span> 
        result = <span style="color:#080;font-weight:bold">yield</span> f 
      <span style="color:#080;font-weight:bold">ensure</span> 
        f.close 
      <span style="color:#080;font-weight:bold">end</span> 
    <span style="color:#080;font-weight:bold">end</span> 
    <span style="color:#080;font-weight:bold">return</span> result 
  <span style="color:#080;font-weight:bold">end</span> 
<span style="color:#080;font-weight:bold">end</span> 
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Aqui, simulamos a reabertura da classe ‘File’ e a reimplementação do método ‘open’. Note que primeiro checamos se foi passado um bloco (‘block_given?’) e daí usamos ‘yield’ para executar o lambda passado a ele, daí repassamos o arquivo ‘f’ recém-aberto. Quando seja lá o que ‘yield’ executar terminar, daí fechamos o arquivo e retornamos.</p>
  <p>Aliás, é exatamente assim que os <strong>iteradores</strong> funcionam em Ruby. Um iterador serve para navegar pelos vários elementos de uma lista (ou outro objeto que se comporte como uma lista), sem se incomodar com os detalhes da implementação dessa lista (se é um array, uma lista ligada, uma sequência de bytes de um arquivo, etc).</p>
  <p>Um pouco acima falei em reescrever de um jeito “um pouco mais Rubista”, mas vejamos um jeito mais Rubista ainda:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
        </td>
        <td class="code"><pre>contents = <span style="color:#036;font-weight:bold">File</span>.open(aFile).readlines.inject(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>) <span style="color:#080;font-weight:bold">do</span> |buf, line| 
  buf += line
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O método ‘readlines’ devolve um Array, onde cada elemento é uma linha do arquivo texto. O método “inject” é um <strong>Redutor</strong>: ele pega linha a linha do Array e repassa ao bloco, como primeiro parâmetro. O segundo parâmetro, ‘buf’, é um totalizador que é iniciado com o primeiro parâmetro que passamos no método ‘inject’, no caso a string vazia "". Ele repassa sempre esse objeto como segundo parâmetro do bloco. Dentro do bloco podemos fazer o que quiser, mas normalmente queremos que seja um totalizador por isso usamos o operador “+=” que significa “buf = buf + line”.</p>
  <p>Em Ruby é muito comum utilizar essa maneira de pensar: em vez de pensar em <em>“como vamos iterar elemento a elemento”</em>, partimos do princípio que isso é trivial e daí pensamos <em>“como queremos filtrar elemento a elemento”</em>. Linhas como a seguinte são bastante comuns:</p>
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
        <td class="code"><pre>&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>,<span style="color:#00D">5</span>].map { |elem| elem * elem }
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">4</span>, <span style="color:#00D">9</span>, <span style="color:#00D">16</span>, <span style="color:#00D">25</span>]
&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>,<span style="color:#00D">5</span>].select { |elem| elem % <span style="color:#00D">2</span> == <span style="color:#00D">0</span> }
=&gt; [<span style="color:#00D">2</span>, <span style="color:#00D">4</span>]
&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>,<span style="color:#00D">5</span>].inject(<span style="color:#00D">0</span>) { |total, elem| total += elem }
=&gt; <span style="color:#00D">15</span>
&gt;&gt; total = <span style="color:#00D">0</span>
=&gt; <span style="color:#00D">0</span>
&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>,<span style="color:#00D">5</span>].each { |elem| total += elem }
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">4</span>, <span style="color:#00D">5</span>]
&gt;&gt; total
=&gt; <span style="color:#00D">15</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O primeiro exemplo – “map” – substitui elemento a elemento pelo resultado do bloco. O segundo – “select” – devolve o resultado do filtro que é passado como bloco. O terceiro – “inject” – é o redutor que já vimos acima e o quarto – “each” – é a mesma coisa que o “inject” mas menos encapsulado e usando código extra para chegar ao mesmo efeito.</p>
  <p>Para completar, blocos podem ser passados como parâmetro a um método usando duas sintaxes: chaves (“{}”) ou “do..end”, por exemplo:</p>
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
        <td class="code"><pre>[<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>].each { |elem| puts elem }
[<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>].each <span style="color:#080;font-weight:bold">do</span> |elem|
  puts elem
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Ambas as formas acima fazem a mesma coisa. A diferença é que costumamos usar chaves para blocos curtos, de uma única linha. Já o do..end é mais usado quando temos múltiplas linhas. Em ambos os casos os parâmetros do bloco vão entre pipes (“||”). Na realidade existem mais diferenças, mas para começar até aqui está bom.</p>
  <h2>Tipos Básicos</h2>
  <p>Invertendo a ordem das coisas, finalmente vamos falar um pouco mais sobre os tipos básicos do Ruby. Nós já vimos muitos deles então vamos apenas passar por eles rapidamente.</p>
  <h3>Arrays</h3>
  <p>Arrays são listas simples de elementos, a sintaxe mais básica é a seguinte:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
        </td>
        <td class="code"><pre>&gt;&gt; lista = [<span style="color:#00D">100</span>,<span style="color:#00D">200</span>,<span style="color:#00D">300</span>,<span style="color:#00D">400</span>]
=&gt; [<span style="color:#00D">100</span>, <span style="color:#00D">200</span>, <span style="color:#00D">300</span>, <span style="color:#00D">400</span>]
&gt;&gt; lista[<span style="color:#00D">2</span>]
=&gt; <span style="color:#00D">300</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Até aqui nada de novo, porém o Ruby tem alguns facilitadores, por exemplo:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
        </td>
        <td class="code"><pre><span style="color:#00D">?&gt;</span> lista.first
=&gt; <span style="color:#00D">100</span>
&gt;&gt; lista.last
=&gt; <span style="color:#00D">400</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Também já vimos que ele tem vários métodos que aceitam blocos para processar elemento a elemento, como “each”, “map”, “select”, “inject”. Já vimos anteriormente como operadores em Ruby nada mais são do que métodos. Vejamos como os Arrays se comportam:</p>
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
        <td class="code"><pre>&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>] + [<span style="color:#00D">5</span>,<span style="color:#00D">6</span>,<span style="color:#00D">7</span>,<span style="color:#00D">8</span>]
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">4</span>, <span style="color:#00D">5</span>, <span style="color:#00D">6</span>, <span style="color:#00D">7</span>, <span style="color:#00D">8</span>]
&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>,<span style="color:#00D">5</span>] - [<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>]
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">5</span>]
&gt;&gt; [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>] * <span style="color:#00D">2</span>
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>]
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Como na maioria das linguagens a notação de colchetes (“[]”) deve ser familiar, para encontrar o elemento através do seu índice. Mas em Ruby, os colchetes também são operadores! Vamos fazer uma brincadeira:</p>
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
</pre>
        </td>
        <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Array</span>
  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#A60">:seletor_antigo</span> <span style="color:#A60">:[]</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">[]</span>(indice)
    <span style="color:#080;font-weight:bold">return</span> seletor_antigo(indice) <span style="color:#080;font-weight:bold">if</span> indice.is_a? <span style="color:#036;font-weight:bold">Fixnum</span>
    <span style="color:#080;font-weight:bold">return</span> <span style="color:#069">self</span>.send(indice) <span style="color:#080;font-weight:bold">if</span> indice.is_a? <span style="color:#036;font-weight:bold">Symbol</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Nada encontrado para </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>indice<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; lista = [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>]
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">4</span>]
&gt;&gt; lista[<span style="color:#00D">2</span>]
=&gt; <span style="color:#00D">3</span>
&gt;&gt; lista[<span style="color:#A60">:first</span>]
=&gt; <span style="color:#00D">1</span>
&gt;&gt; lista[<span style="color:#A60">:last</span>]
=&gt; <span style="color:#00D">4</span>
&gt;&gt; lista[<span style="color:#A60">:size</span>]
=&gt; <span style="color:#00D">4</span>
&gt;&gt; lista[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla bla</span><span style="color:#710">"</span></span>]
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Nada encontrado para bla bla</span><span style="color:#710">"</span></span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Viram o que aconteceu? Usamos “alias” novamente para criar um novo atalho à antiga implementação de [], daí reimplementamos []. Ele se comporta assim: se o parâmetro passado entre colchetes for um inteiro, é para se comportar como antes, portanto chamando o atalho “seletor_antigo”. Se for um símbolo (vamos explicar isso depois mas por enquanto entenda que é uma palavra com dois pontos antes, como “:first”), ele deve enviar a mensagem ao objeto usando “send”, ou seja, deve executar como se fosse um método. Dessa forma “lista[:first]” deve se comportar igual a “lista.first”. Finalmente, se for qualquer outra coisa (como um String), apenas mostre uma mensagem dizendo que nada foi encontrado.</p>
  <p>Como podemos ver, mais do que o Array em si, o operador “[]” pode ser muito útil em vários cenários. Enfim, na maior parte dos casos um Array em Ruby se comporta muito parecido com um Array em qualquer outra linguagem.</p>
  <h3>Hashes</h3>
  <p>Um Hash, em outras linguagens, também é chamado de Dicionário, ou seja, é uma lista onde a ordem de inserção não é importante, e cada elemento é um par que liga uma chave a um valor. Por exemplo:</p>
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
        <td class="code"><pre>&gt;&gt; dic = { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">car</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">carro</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">table</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mesa</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mouse</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rato</span><span style="color:#710">"</span></span> }
=&gt; {<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mouse</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rato</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">table</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mesa</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">car</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">carro</span><span style="color:#710">"</span></span>}
&gt;&gt; dic[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">car</span><span style="color:#710">"</span></span>]
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">carro</span><span style="color:#710">"</span></span>
&gt;&gt; dic[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mouse</span><span style="color:#710">"</span></span>]
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rato</span><span style="color:#710">"</span></span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Novamente, é um comportamento parecido com um Array, mas em vez de passar índices numéricos ao operador “[]”, passamos uma chave e esperamos encontrar o valor correspondente. Para acrescentar mais elementos à lista, podemos fazer assim:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
        </td>
        <td class="code"><pre>&gt;&gt; dic.merge!( {<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">book</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">livro</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">perna</span><span style="color:#710">"</span></span>} )
=&gt; {<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">perna</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mouse</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rato</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">table</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mesa</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">book</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">livro</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">car</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">carro</span><span style="color:#710">"</span></span>}
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Mais uma peculiaridade de Ruby. Um Hash tem dois métodos para mesclar novos elementos a uma lista já existente: “merge” e “merge!”. A diferença de um para outro é que o primeiro é um método não-destrutivo e o segundo é um método destrutivo, ou seja, o primeiro retorna a lista mesclada mas a original continua como antes, já o segundo método mescla os novos elementos diretamente na lista original. Ou seja, a linha anterior seria equivalente a fazer isso:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
        </td>
        <td class="code"><pre>dic = dic.merge( {<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">book</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">livro</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">perna</span><span style="color:#710">"</span></span>} )
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O resultado do merge é atribuído à mesma variável, ignorando a lista original, que é o que fazemos normalmente. Você também pode ter Hashes dentro de Hashes, assim:</p>
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
        <td class="code"><pre>&gt;&gt; fabio = { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">emails</span><span style="color:#710">"</span></span> =&gt; 
<span style="color:#00D">?&gt;</span>           { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">trabalho</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabio.akita@locaweb.com.br</span><span style="color:#710">"</span></span>,
<span style="color:#00D">?&gt;</span>              <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">normal</span><span style="color:#710">"</span></span>   =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabioakita@gmail.com</span><span style="color:#710">"</span></span> } }
=&gt; {<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">emails</span><span style="color:#710">"</span></span>=&gt;{<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">normal</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabioakita@gmail.com</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">trabalho</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabio.akita@locaweb.com.br</span><span style="color:#710">"</span></span>}}
<span style="color:#00D">?&gt;</span> fabio[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">emails</span><span style="color:#710">"</span></span>][<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">normal</span><span style="color:#710">"</span></span>]
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabioakita@gmail.com</span><span style="color:#710">"</span></span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Finalmente, podemos explorar o conteúdo de um Hash da seguinte maneira:</p>
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
        <td class="code"><pre>&gt;&gt; dic.keys
=&gt; [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mouse</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">table</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">book</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">car</span><span style="color:#710">"</span></span>]
&gt;&gt; dic.values
=&gt; [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">perna</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rato</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mesa</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">livro</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">carro</span><span style="color:#710">"</span></span>]
&gt;&gt; dic.keys.each <span style="color:#080;font-weight:bold">do</span> |chave|
<span style="color:#00D">?&gt;</span>   puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>chave<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> = </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>dic[chave]<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
leg = perna
mouse = rato
table = mesa
book = livro
car = carro
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Se você entendeu blocos nas seções anteriores, este código deve ser bastante trivial de entender. Se não, retome a leitura do começo.</p>
  <p>Hash é um dos tipos mais importantes e vamos retornar a ele em outra seção para ver como esse tipo é usado por todo tipo de codificação Ruby. Inclusive o Ruby on Rails utiliza Hashes o tempo todo em lugares onde a maioria nem imagina.</p>
  <p>Continue lendo a <a href="/2008/11/10/micro-tutorial-de-ruby-parte-iii">Parte <span class="caps">III</span></a></p>
  <p></p>
  <h4>tags: <span class="label label-important"><a href="/learning">learning</a></span> <span class="label label-important"><a href="/beginner">beginner</a></span> <span class="label label-important"><a href="/ruby">ruby</a></span> <span class="label label-important"><a href="/tutorial">tutorial</a></span></h4>
</macro:code>
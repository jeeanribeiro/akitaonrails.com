---
title: "A Controvérsia Test::Unit vs RSpec/Cucumber"
date: "2011-04-17T18:26:00.000Z"
tags: ["rspec", "ruby"]
years: "2011"
---

<p></p>
<p>Alguns dias atrás, o bom e velho <a href="http://www.twitter.com/dhh">@dhh</a> começou uma controvérsia na comunidade. Eu diria até que foi uma discussão saudável. Leia a cobertura do acontecido na <a href="http://www.rubyinside.com/dhh-offended-by-rspec-debate-4610.html">RubyInside</a> mas em resumo ele fez a seguinte sequência de tweets:</p>
<blockquote>
  <p>“Pergunta: que framework de teste vocês usam na 37signals? Resposta: Test::Unit com uso ocasional do mocha. (Isso é tudo que você precisa para bons testes.)”</p>
</blockquote>
<blockquote>
  <p>“Eu respeito os caras por trás disso e sou totalmente a favor de experimentação, mas a proliferação de rSpec e Cucumber me deixa triste.”</p>
</blockquote>
<blockquote>
  <p>“RSpec me ofende esteticamente com nenhum benefício discernível pela sua complexidade adicionada sobre Test::Unit.”</p>
</blockquote>
<blockquote>
  <p>“Cucumber não faz sentido a menos que você tenha clientes lendo os testes. Por que você construiria um parser específico de testes para inglês?”</p>
</blockquote>
<blockquote>
  <p>“A coisa importante, é claro, é que consigamos fazer as pessoas testarem, então ferramentas não deveriam importar muito. Mas a complexidade extra ainda me chateia.”</p>
</blockquote>
<p>Sendo sincero, eu também compartilho da mesma opinião do @dhh. E não, não é <a href="http://akitaonrails.com/2008/12/16/off-topic-m-todo-cient-fico-vs-cargo-cult">cargo cult</a>, antes que algum engraçadinho faça o comentário: lembro de 1 ou 2 anos atrás onde eu e o Carlos Brando estávamos conversando justamente como voltar pra Test::Unit era até um alívio. Também lembro de discutir o assunto do Cucumber com o Daniel V. Lopes, que pelo menos na época preferia Steak justamente porque nenhum cliente iria ler os testes escritos em inglês e portanto isso era redundante.</p>
<p>Só para adiantar a conclusão: se alguém estava levando a discussão para o nível de qual sintaxe é “melhor”, ou qual é mais “elegante”, ou qual é mais “suscinta”, você está indo na direção errada e vai tirar conclusões sem nenhum fundamento também. Então vamos com calma que, pra variar, a leitura será longa.</p>
<p></p>
<p></p>
<h2>Introdução</h2>
<p>É importante que as pessoas primeiro coloquem a imagem dos códigos na cabeça antes de continuarmos a discussão. Este é um exemplo pequeno de um teste unitário escrito com RSpec:</p>
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
      <td class="code"><pre>describe <span style="color:#036;font-weight:bold">Cart</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">.sub_total</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
  before(<span style="color:#A60">:each</span>) <span style="color:#080;font-weight:bold">do</span>
    <span style="color:#33B">@cart</span> = Factory(<span style="color:#A60">:cart_with_two_5_dollar_items</span>)
  <span style="color:#080;font-weight:bold">end</span>
  it <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should calculate subtotal correctly</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
    <span style="color:#33B">@cart</span>.sub_total.should == <span style="color:#60E">10.00</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
--- 
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este é um pequeno trecho de um teste do arquivo <tt>cart_spec.rb</tt> do projeto <a href="https://github.com/drhenner/ror_ecommerce">ror_ecommerce</a>. O que uma <span class="caps">DSL</span> como RSpec fornece é uma descrição suscinta em “quase-inglês” que poderíamos ler assim:</p>
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
      <td class="code"><pre>describe <span style="color:#036;font-weight:bold">Cart</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">.sub_total</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>                     <span style="color:#777"># descrevendo o sub total de um Cart</span>
  before(<span style="color:#A60">:each</span>) <span style="color:#080;font-weight:bold">do</span>                                 <span style="color:#777">#   antes de cada teste execute:</span>
    <span style="color:#33B">@cart</span> = Factory(<span style="color:#A60">:cart_with_two_5_dollar_items</span>) <span style="color:#777">#     faça @cart ser o resultado da Fábrica com 2 ítens de $5</span>
  <span style="color:#080;font-weight:bold">end</span>
  it <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should calculate subtotal correctly</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>      <span style="color:#777">#   o cart deve calcular o subtotal corretamente</span>
    <span style="color:#33B">@cart</span>.sub_total.should == <span style="color:#60E">10.00</span>                <span style="color:#777">#     sub total do @cart deve ser igual a 10.00</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora vejamos um trecho de cucumber:</p>
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
      <td class="code"><pre>Feature: adding a comment
  As a Ruby developer
  I would like to comment on a gem
  So that I can help the community track which gems work with Ruby 1.9
  Scenario: adding a comment
    Given an initialised database  
    And a gem called "rubynuts"
    When I visit the page for "rubynuts"
    Then I see the comment form
    When I add a comment
    And I press "submit comment"
    Then I see my comment on the page
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este trecho foi retirado do projeto <a href="https://isitruby19.com/">isitruby19</a>. Acho que não preciso traduzir, com certeza todos vocês consegue ler o que está escrito, certo??</p>
<p>Mas este arquivo de Cucumber, sozinho, não faz tudo. Ele precisa necessariamente de outro código que faz par com ele por baixo dos panos, este sim, escrito em Ruby:</p>
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
<a href="#n35" name="n35">35</a>
<a href="#n36" name="n36">36</a>
<a href="#n37" name="n37">37</a>
<a href="#n38" name="n38">38</a>
<a href="#n39" name="n39">39</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># general_steps.rb</span>
<span style="color:#036;font-weight:bold">Given</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^an initialised database$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#036;font-weight:bold">Platform</span>.load_defaults
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># code_steps.rb</span>
<span style="color:#036;font-weight:bold">Given</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^a gem called "(.*)"$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span> | name |
  code = <span style="color:#036;font-weight:bold">Code</span>.find_by_name name
  code.destroy <span style="color:#080;font-weight:bold">unless</span> code.nil?  
  code = a_saved <span style="color:#036;font-weight:bold">Code</span>, <span style="color:#A60">:name</span> =&gt; name
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">When</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^I visit the page for "(.*)"$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span> | name | 
  visit <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>name<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># comment_steps.rb</span>
<span style="color:#036;font-weight:bold">Then</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^I see the comment form$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span>
  response.should have_tag(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">div#new-comment-form</span><span style="color:#710">'</span></span>)
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">When</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^I add a comment$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span>
  fill_in <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Name</span><span style="color:#710">"</span></span>, <span style="color:#A60">:with</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Henry the Tester</span><span style="color:#710">'</span></span>
  fill_in <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Email</span><span style="color:#710">"</span></span>, <span style="color:#A60">:with</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">henry@testing.com</span><span style="color:#710">'</span></span>
  choose <span style="color:#A60">:comment_works_for_me_true</span>
  fill_in <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Version</span><span style="color:#710">"</span></span>, <span style="color:#A60">:with</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">1.0</span><span style="color:#710">'</span></span>
  select <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Mac OSX</span><span style="color:#710">'</span></span>, <span style="color:#A60">:from</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Platform</span><span style="color:#710">'</span></span>
  fill_in <span style="color:#A60">:comment_body</span>, <span style="color:#A60">:with</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Here is my test comment</span><span style="color:#710">'</span></span> <span style="color:#777"># have to request via ID rather than label because of the span around the optional, making it hard to find</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># webrat_steps.rb</span>
<span style="color:#036;font-weight:bold">When</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^I press "(.*)"$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span> |button|
  click_button(button)
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># comment_steps.rb</span>
<span style="color:#036;font-weight:bold">Then</span> <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^I see my comment on the page$</span><span style="color:#404">/</span></span> <span style="color:#080;font-weight:bold">do</span>
  response.should include_text(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Here is my test comment</span><span style="color:#710">'</span></span>)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note que sobre cada trecho eu tirei em que arquivo ele estava. Sem explicar muito, se vocês lerem a especificação em inglês e depois ler com calma o código Ruby abaixo, verá que cada frase tem um equivalente em Ruby. Esse código equivalente é chamado de “Step Definition” no Cucumber, e pode estar em qualquer arquivo no <tt>load path</tt>.</p>
<p>O objetivo do Cucumber é que essas “User Stories” sejam escrita em inglês em conjunto com o cliente final. E a partir daí elas se tornam “especificações executáveis” em vez de um mero papel que não tem como validar automaticamente. Mas depois precisamos reescrever tudo em Ruby. Por isso muitos dizem que, se você não pretende usar isso com um cliente de verdade, parece um trabalho duplicado.</p>
<p>Finalmente vejamos um teste no antigo Test::Unit (em particular com suporte do Rails):</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Cart</span> &lt; <span style="color:#036;font-weight:bold">ActiveModel</span>::<span style="color:#036;font-weight:bold">TestCase</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">setup</span>
    <span style="color:#33B">@cart</span> = Factory(<span style="color:#A60">:cart_with_two_5_dollar_items</span>)
  <span style="color:#080;font-weight:bold">end</span>
  test <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should calculate subtotal correctly</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
    assert_equal <span style="color:#60E">10.00</span>, <span style="color:#33B">@cart</span>.sub_total
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este eu fiz de propósito. Se você comparar somente no escopo deste micro-teste, tanto a versão em Test::Unit quanto em RSpec não tem praticamente diferença nenhuma. Mas claro que não é só isso e existem dezenas de outras funcionalidades que o RSpec tem sobre o Test::Unit.</p>
<p>Para iniciar em cada uma das ferramentas leia:</p>
<ul>
  <li><a href="https://pragprog.com/titles/achbd/the-rspec-book" title="que cobre Cucumber">Livro RSpec Book</a></li>
  <li><a href="https://guides.rubyonrails.org/testing.html">Documentação Test::Unit para Rails</a></li>
</ul>
<h2>Refletindo sobre a História</h2>
<p>A comunidade Ruby, Agile e outras ao redor se concentraram bastante nos assuntos Test Driven Development e Behavior Driven Development. Mas não se esqueçam que testar software é um assunto <a href="https://en.wikipedia.org/wiki/Software_testing">muito mais amplo</a> do que isso. Muitos outros vieram antes de nós explorando, pesquisando, documentando e refinando esse conhecimento. Resumidamente a história passou já por esses estágios:</p>
<ul>
  <li>Até 1956 – orientado a debugging</li>
  <li>1957-1978 – orientado a demonstração</li>
  <li>1979-1982 – orientado a destrução</li>
  <li>1983-1987 – orientado a avaliação</li>
  <li>1988-2000 – orientado a prevenção</li>
</ul>
<p>O que conhecemos hoje como níveis de testes, que vai de unitário, integrado e de sistema, além de definições, terminologias, classificações, estão todas descritas no Software Engineering Body of Knowledge (<span class="caps">SWEBOK</span>) e você pode ler o capítulo específico sobre <a href="https://www.computer.org/portal/web/swebok/html/contentsch5#ch5">Software Testing</a> na versão gratuita do livro disponível online.</p>
<p>Os exemplos de código que dei acima assumem muita coisa. Assumem que você entende todos os conceitos e terminologias de testes, que entende porque eles são assim. Assumem que você entende qual a diferença entre “Use Cases”, “User Stories” e “Narrative”. Assume que você entende como e porque <span class="caps">TDD</span> existe e também como se evoluiu para <span class="caps">BDD</span>. Se você não entende, leia os links acima nesta seção e também este artigo <a href="https://www.rbcs-us.com/images/documents/User-Stories-and-Test-Driven-Development.pdf">A Story about User Stories and Test-Driven Development</a>.</p>
<p>O Test::Unit que conhecemos hoje do Ruby é herança da idéia original de <span class="caps">TDD</span> do Kent Beck. Foi escrito por <strong>Nathaniel Talbott</strong> originalmente com o nome de <a href="https://lapidary.sourceforge.net/">Lapidary</a> e demonstrado na primeira e lendária RubyConf de 2001. Ele se inspirou na documentação original de Kent Beck, <a href="https://www.xprogramming.com/testfram.htm">Simple Smalltalk Testing With Patterns</a> que é o pai de todos os frameworks de <span class="caps">TDD</span> atuais. O objetivo do Lapidary era o mesmo de todo framework <span class="caps">TDD</span>:</p>
<blockquote>Testes Unitários está crescendo em todo lugar, principalmente pelo fato de ser uma prática essencial do XP. Embora XP seja grande, testes unitários existem há um longo tempo e sempre foi uma boa idéia. Uma das chaves para bons testes unitários, não é somente escrever testes, mas ter testes. Qual a diferença? Bem, se você apenas escreve um teste e joga fora, você não tem garantias que alguma coisa não vai mudar mais tarde e quebrar seu código. Se, por outro lado, você tem testes (obviamente você precisa escrevê-los primeiro), e os executa tão frequentemente quanto possível, você lentamente constrói uma parede de coisas que não podem quebrar sem você imediatamente saber disso. É quanto testes unitários atingem seu pico de utilidade.</blockquote>
<p>Então, em maio de 2002, o Lapidary foi substituído por <a href="https://test-unit.rubyforge.org/">Test::Unit</a>, o pacote oficial de testes unitários que vem pré-instalado junto de todo Ruby – e por isso é particularmente útil em comparação com outros pacotes de programação que não tem um pacote padrão de testes.</p>
<p>Depois de Alistair Cockburn, depois de Kent Beck, depois de <span class="caps">TDD</span> e XP, quem já estava dentro do assunto anos atrás começou a pensar em evolução. Um deles foi Dave Astels que escreveu este artigo <a href="https://techblog.daveastels.com/2005/07/05/a-new-look-at-test-driven-development/">A New Look at Test Driven Development</a>. Ele explica os problemas do <span class="caps">TDD</span> e como se transita para um novo paradigma chamado <span class="caps">BDD</span>. Na mesma época Dan North estava evoluindo o conceito de User Stories do Alistair para o formato canônico que conhecemos hoje, por exemplo, com o famoso artigo <a href="https://dannorth.net/whats-in-a-story/">What’s in a Story</a>, criando as fundações para o Behavior Driven Development, ao mesmo tempo implementando <a href="https://dannorth.net/introducing-bdd/">JBehave</a> para ser usado em vez de JUnit.</p>
<p>O foco passaria a ser centrado em “comportamento” e o Astels explica:</p>
<blockquote>Uma grande diferença é o vocabulário. Em vez de fazer subclasses de <tt>TestCase</tt>, você faz subclasses de <tt>Context</tt>. Em vez de escrever métodos que começam com <tt>test</tt> você começa com <tt>should</tt>, ou preferencialmente você não precisa se preocupar com o padrão de nomenclatura de forma a poder escolher o nome mais apropriado. Em vez de fazer verificação com <tt>assertions</tt> (ex. <tt>assertEquals(expected, actual)</tt>) você especifica pós-condições com algo como <tt>shouldBeEqual(actual, expected)</tt>.</blockquote>
<p>O livro do David Chelimsky, o recém-lançado <a href="https://pragprog.com/titles/achbd/the-rspec-book">The RSpec Book</a> continua a história:</p>
<blockquote>
  <p>RSpec foi criado por Steven Baker em 2005. Steven ouvira falar sobre <span class="caps">BDD</span> a partir do Aslak Hellesøy, que trabalhara em um projeto com Dan North quando a idéia surgiu da primeira vez. Steven já estava interessado na idéia quando Dave Astels sugeriu que com linguagens como Smalltalk e Ruby, nós poderíamos mais facilmente explorar novos frameworks de <span class="caps">TDD</span> que poderiam encorajar o foco em comportamento. E RSpec nasceu.</p>
  <p>Embora os detalhes sintáticos tenham evoluído desde a versão original do RSpec do Steven, a premissa básica permanece. Nós usamos RSpec para escrever exemplos executáveis de comportamento esperado de um pequeno pedaço de código em um contexto controlado.</p>
</blockquote>
<p>Por isso eu insisto tanto em pesquisar novamente definições e história. RSpec, não é nada radicalmente diferente de um Test::Unit. Mas seu foco é tentar <strong>encorajar</strong> os desenvolvedores a pensar na forma de <strong>comportamento</strong> (“Behavior”) e o primeiro pequeno passo é renomear algumas palavras-chaves na forma que definimos testes unitários para tentar guiar nessa direção. Ou seja, se estiver consciente disso, obviamente você pode escrever no estilo <span class="caps">BDD</span> usando a mesma sintaxe do Test::Unit atual (por isso os dois testes que escrevi acima, com Test::Unit e depois com RSpec, não parecem tão diferente, olhando superficialmente).</p>
<p>Vou pegar algumas coisas emprestadas do livro do Chelimsky, a começar pela definição de “Behavior Driven Development”</p>
<blockquote>
  <p>Behavior Driven Development tem como objetivo implementar uma aplicação através da descrição de seu comportamento a partir da perspectiva de seus stakeholders.</p>
</blockquote>
<p>Quando praticamos somente <span class="caps">TDD</span>, sem atenção às outras práticas de XP que certamente cobrem User Stories, repriorização de Backlog, acabamos nos focando apenas na parte técnica. No final temos um excelente sistema, maravilhosamente coberto com testes unitários, testes de integração, porém o objetivo do projeto – o objetivo dos stakeholders que pagam por esse projeto – não foi atingido. Isso é uma coisa difícil de explicar para programadores cabeça-dura: em bom francês, o cliente está c@gando e andando se seu software tem 400% de cobertura de testes unitários se o objetivo dele era lançar 4 meses atrás na metade do custo e ainda está faltando funcionalidade que ele precisava.</p>
<p>A idéia do <span class="caps">BDD</span>, do ponto de vista de implementação é tentar direcionar os programadores em direção à implementação do que realmente interessa ao stakeholder – e não ao seu ego de hacker.</p>
<p>Seguindo esse raciocínio, uma coisa importante num processo Ágil é a definição de <a href="https://agilesoftwaredevelopment.com/2006/05/definition-of-done">Done</a> (Pronto). Sem isso não existe parâmetro para saber se um software está pronto ou não. Para o programador é quando ele “acha” que o código está bom, para o stakeholder é quando ele “acha” que funciona como ele “acha” que queria. Rastrear User Stories ou Use Cases ou o que for, manualmente, é muito trabalhoso.</p>
<p>Novamente retornando ao livro do Chelimsky:</p>
<blockquote>
  <p>Em 2003, Chris Stevenson, que estava trabalho com Aslak na ThoughtWorks na época, criou uma pequena ferramenta em Java chamada <a href="https://agiledox.sourceforge.net/">TestDox</a>. O que ele fazia era simples: lia código fonte em Java com testes em JUnit e produzia documentação textual a partir dele. O seguinte código Java:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
        </td>
        <td class="code"><pre><span style="color:#088;font-weight:bold">public</span> <span style="color:#339;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">AccountDepositTest</span> <span style="color:#088;font-weight:bold">extends</span> TestCase { 
  <span style="color:#088;font-weight:bold">public</span> <span style="color:#339;font-weight:bold">void</span> testAddsTheDepositedAmountToTheBalance() { ... }
}
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>produziria o seguinte texto:</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
        </td>
        <td class="code"><pre>Account Deposit 
  - adds the deposited amount to the balance
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Era uma ferramenta bem simplista, mas teve um efeito profundo nas equipes apresentadas a ele. Eles começaram a publicar relatórios de TestDox para todos verem, encorajando os programadores a escrever sentenças reais em seus testes, ou os relatórios de TestDox pareceriam grego.</p>
  <p>Tendo sentenças reais em seus testes, os programadores começaram a pensar sobre comportamento e o que o código deveria fazer, e a bola de neve do <span class="caps">BDD</span> começou a rolar.</p>
</blockquote>
<p>E especificamente sobre o Cucumber:</p>
<blockquote>
  <p>Mesmo antes de começar a explorar estrutura e sintaxe para RSpec, Dan North estava explorando um modelo completamente diferente para uma ferramenta <span class="caps">BDD</span>.</p>
  <p>Ele queria documentar e dirigir o comportamento em uma linguagem simplificada que poderia facilmente ser entendida pelos clientes, desenvolvedores, testadores, analistas de negócio e assim por diante. O resultado inicial dessa exploração foi a biblioteca JBehave, que ainda está em uso ativo e em desenvolvimento.</p>
  <p>Dan portou o JBehave para Ruby como RBehave, e o mesclou dentro do RSpec como o Story Runner. Ele suportava somente cenários escritos em Ruby no começo, mas depois adicionamos suporte a textos em inglês puro, abrindo todo um novo mundo de expressividade e acesso. Mas à medida que novas possibilidades eram reveladas, também apareciam limitações.</p>
  <p>Na primavera de 2008, Aslak Hellesøy se colocou para reescrever o Story Runner do Rspec com uma gramática real definida com a biblioteca Treetop do Nathan Sobo. Aslak o chamou de Cucumber, em sugestão da sua noiva, Patricia Carrier, imaginando que seria um título temporário até ser mesclado de volta no RSpec. Mas eles nem imaginavam que Cucumber desenvolveria uma vida própria.</p>
</blockquote>
<p style="text-align: center"><a href="https://pragprog.com/titles/achbd/the-rspec-book"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/17/Screen%20shot%202011-04-17%20at%203.23.56%20PM_original.png?1303064641" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/17/Screen%20shot%202011-04-17%20at%203.23.56%20PM_original.png?1303064641 2x" alt=""></a></p>
<p>Cucumber, Rspec, implementando os conceitos de <span class="caps">BDD</span>, se tornam não somente a especificação das User Stories, mas praticamente a própria implementação da definição de “Done”. Se a feature do Cucumber passa, quase poderíamos considerá-la “Done” mesmo.</p>
<h2>Retornando à Controvérsia</h2>
<p>Essa história parece longa, mas no meu artigo eu apenas coloquei um micro-resumo. Se você não conhecia esses episódios, significa que ainda tem muito a aprender sobre esta prática muito específica de Engenharia de Software chamada “Software Testing”. Ela vai muito mais longe do que meros “asserts” ou “shoulds”. Ela trata de um mundo muito mais amplo chamado “Qualidade”, mas esse assunto fica para outro artigo.</p>
<p>Em resumo, a controvérsia Test::Unit vs RSpec/Cucumber é – pra variar – uma questão de discussão sobre <a href="https://en.wikipedia.org/wiki/Aesthetics">estética</a>. E como os sábios já diziam:</p>
<blockquote>A Beleza está nos olhos de quem vê.</blockquote>
<p>Portanto, para muitos, a estrutura sintática da <span class="caps">DSL</span> do RSpec e Cucumber são praticamente a sétima maravilha. E eu não discuto que a sintaxe é muito elegante, até surpreendente para quem nunca viu e começa a enxergar os potenciais de explorar o tema de <a href="https://my.safaribooksonline.com/book/software-engineering-and-development/ide/9780132107549">Domain Specific Languges</a>.</p>
<p>Elas são a solidificação das idéias e conceitos de Dave Astels, Dan North e muitos outros que pesquisaram, exploraram e continuam tentando encontrar novas formas de aumentar a qualidade do software e a satisfação final do cliente – que é o que realmente interessa em qualquer projeto de software.</p>
<p>Porém, as ferramentas são auxílios para a implementação de um conceito. Se você não entende o conceito, não importa que ferramenta use: seu projeto vai fracassar miseravelmente, como sempre fracassou.</p>
<p>O valor é mais óbvio para quem já passou muito tempo antes fazendo testes unitário em ferramentas como o JUnit ou mesmo o Test::Unit do Ruby, porque a mudança de nomenclatura, a saída da execução do teste na forma de relatório legível por seres humanos, vai forçá-lo a repensar a maneira como escreve seus testes – mudando de uma forma mais de sistema para uma forma centrada em comportamento.</p>
<p>Quem nunca fez testes antes, dificilmente vai entender porque estamos discutindo – porque ele não viu como era feito antes e não entende a diferença.</p>
<p>Mas se você já entendeu o que significa <em>Behavior-Driven</em>, então você também é capaz de expressar comportamento da mesma forma usando Test::Unit ou qualquer outra ferramenta mais tradicional de testes. Portanto, usar Test::Unit não dificulta em nada o processo e você será capaz de escrever tranquilamente, implementando conceitos da mesma forma que quem usa RSpec.</p>
<p>Existe uma diferença técnica que faz toda a diferença: Ruby já vem por padrão com Test::Unit e Ruby on Rails suporta por padrão Test::Unit. Pode não parecer muita coisa, mas pense assim: você cria uma nova biblioteca, que usa Ruby puro e sequer tem dependências com outras gems. Agora você decide testar com RSpec. Só por causa disso, todo mundo que quiser colaborar vai ter que baixar e instalar todas as dependências do RSpec – que nada tem a ver com o objetivo da sua biblioteca.</p>
<p>Parece pouco, mas é aquela “pequena coisinha” que inconscientemente pode deixar alguns potenciais colaboradores de nariz virado sem saber porque. E isso porque todo bom programador sabe que deve procurar sempre nunca reinventar a roda, mas por outro lado também desenvolver e depender da menor quantidade de dependências externas quanto possível.</p>
<p>Minha conclusão, é: se você ainda é novato no assunto e está em dúvida, comece com Test::Unit. Você já tem ele na sua máquina, os generators de Rails todos geram templates de Test::Unit por padrão, e basta ler o código-fonte do próprio Rails para encontrar centenas de ótimos exemplos de como usar Test::Unit. Sentiu que está confortável com Test::Unit? Agora compre o livro do Chelismky, baixe RSpec, Cucumber, e comece a entender o ciclo diferente que é <span class="caps">BDD</span>.</p>
<p>Depois de mais algum tempo, se sentiu confortável com RSpec e a forma <span class="caps">BDD</span> de fazer as coisas? Pois bem, eis o desafio: retorne ao Test::Unit e tente desenvolver exatamente da mesma forma como em RSpec. Você vai ver que é praticamente a mesma coisa.</p>
<p>Em paralelo a isso, independente de Test::Unit ou RSpec, não se esqueça que hoje temos um enorme ecossistema próprio somente para testes:</p>
<ul>
  <li><a href="https://test-unit.rubyforge.org/">Test::Unit</a> – o pacote canônico de testes do Ruby</li>
  <li><a href="https://rspec.info/">Rspec</a> – a nova geração de testes unitários com conceitos de <span class="caps">BDD</span></li>
  <li><a href="https://cukes.info/">Cucumber</a> – a famosa ferramenta de <span class="caps">BDD</span></li>
  <li><a href="https://github.com/ianwhite/pickle">Pickle</a> – Cucumber precisa de “steps” para executar as “features” (user stories), este projeto já lhe fornece dezenas de steps reusáveis para facilitar o desenvolvimento</li>
  <li><a href="https://github.com/jnicklas/capybara">Capybara</a> – abstração e simulação do usuário num navegador para testes de aceitação. Se integra com Cucumber, Rspec, Test::Unit, Ruby on Rails, Rack. Tem drivers para Selenium, HtmlUnit (<a href="https://github.com/bernerdschaefer/akephalos">Akephalos</a> – o melhor -, <a href="https://github.com/sobrinho/capybara-celerity">Celerity</a>, <a href="https://github.com/sobrinho/capybara-culerity">Culerity</a>), <a href="https://github.com/smparkes/env-js">env.js</a>, e <a href="https://github.com/thoughtbot/capybara-webkit">WebKit</a>.</li>
  <li><a href="https://github.com/thoughtbot/factory_girl">Factory Girl</a> – para criar dados de teste no banco de dados de forma mais fácil do que usando fixtures</li>
  <li><a href="https://github.com/jnicklas/evergreen">Evergreen</a> – é uma ferramenta para testar seu Javascript – coisa que poucos fazem – mas com este pacote ele fornece os meios de testar Javascript com a mesma facilidade que você testa Ruby, mas num ambiente isolado, headless (sem navegador nativo), simulando um <span class="caps">HTML</span> <span class="caps">DOM</span> (como env.js, por exemplo, ou outros integrados com Capybara)</li>
  <li><a href="https://github.com/jscruggs/metric_fu">Metric-Fu</a> – além de apenas testar cegamente, ferramentas de métricas podem ajudá-lo a encontrar pontos menos testados do que deveriam, complexidade desnecessária no código e assim por diante.</li>
  <li><a href="https://wiki.hudson-ci.org/display/HUDSON/Configuring+a+Rails+build">Hudson</a> – e de nada adianta ter testes se você não os executa constantemente. Fazer isso na sua máquina de desenvolvimento, manualmente o tempo todo, é tedioso. Para isso existem servidores de <a href="https://www.extremeprogramming.org/rules/integrateoften.html">Integração Contínua</a> como o Hudson/Jenkins, que se integra bem com projetos de Ruby on Rails.</li>
</ul>
<p>Como podem ver, o assunto “Testes” é bastante extenso, complexo e com uma longa história que deve ser entendida para que saibamos o que já foi feito e continuarmos a evolução daqui. <span class="caps">TDD</span> e <span class="caps">BDD</span> não são dogmas, não são procedimentos obrigatórios. Você vai encontrar exemplos que deram muito certo e muito errado, ou seja, temos somente <a href="https://en.wikipedia.org/wiki/Empirical_research">dados empíricos</a> que nos levam a crer que esta é uma das melhores formas de se desenvolver software. Porém isto não é uma Teoria geral. Ela deve ser entendida, interpretada, modificada, medida e novas conclusões podem aparecer.</p>
<p>Rspec vs Test::Unit? Isso não é nem uma fração da história toda. Antes de achar que pode discutir a respeito, primeiro desça ao básico: você sabe a <strong>definição</strong> do que é um <a href="https://en.wikipedia.org/wiki/Unit_testing">teste unitário</a>? (Dica: leia o documento <a href="https://s3.amazonaws.com/akitaonrails/files/std1008-1987.pdf"><span class="caps">ANSI</span>/<span class="caps">IEEE</span> Std 1008-1987 – <span class="caps">IEEE</span> Standard for Software Unit Testing</a>).</p>
<p></p>
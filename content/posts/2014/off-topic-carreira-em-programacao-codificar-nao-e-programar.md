---
title: "[Off-Topic] Carreira em Programação - Codificar não é Programar"
date: "2014-05-02T18:57:00.000Z"
tags: ["career", "insights", "carreira"]
years: "2014"
---

<p></p>
<p>Um assunto que sempre discuto é sobre a formação de programadores. A grande maioria (se não todos) os artigos que se encontra na internet hoje em dia lista apenas "técnicas", ou "como ser um montador", "como pegar peças que existem e montá-las". Apesar de existir muito valor nisso, vamos deixar bem claro que isso não constitui toda a carreira de "programação", apenas uma minúscula fração.</p>
<p>Sempre podemos pegar algum conhecimento inicial, por exemplo, web e HTML, juntar alguns frameworks e bibliotecas (Rails, Django, Wordpress) e de fato colocar alguma coisa funcional no ar. Mas isso é pouco, muito pouco.</p>
<p>O fato de ser tão "simples", beirando o trivial, colocar "alguma coisa funcional" no ar, esconde todo o potencial que existe na carreira de programação. Pior do que isso, o imediatismo de se ter um resultado leva à ilusão de que só isso é o suficiente e que qualquer conhecimento mais "avançado" é completamente desnecessário. O reflexo disso é o crescimento dos cursos técnicos de programação e a baixa adesão a cursos de bacharelado de Ciências da Computação. Isso é péssimo porque quanto menos gente tivermos trabalhando nos fundamentos, na origem de tudo, mais sucateado fica o mercado daqui pra frente.</p>
<p>Só porque neste instante você tem um emprego de codificador (recortador de photoshop, montador de HTML, colador de plugins de Wordpress, etc), pare para pensar como sua carreira vai evoluir daqui pra frente. Você vai ser sempre só um montador? Vai pegar o caminho fácil de virar um "gerente" meia-boca de montadores?</p>
<p>Infelizmente, em um único post, é impossível listar e explicar todos os aspectos importantes da Ciência da Computação. Mas quero experimentar listar pelo menos alguns dos assuntos que a maioria acha desnecessário para provocá-los a procurar mais.</p>
<p></p>
<p></p>
<h2>Aprenda a pelo menos "LER" fluentemente em Inglês</h2>
<p>Sinto muito, eu gosto da língua portuguesa, sempre vai ser minha primeira língua. Porém pseudo-patriotismo ou pura preguiça não vai eliminar o fato de que se você não se dedicar desde já a ser fluente na leitura do Inglês, você sempre estará defasado num nível lastimável.</p>
<p>A primeira razão é que no mundo Ocidental (estou excluindo o que acontece no Oriente, porque eu não sei ler Chinês e o mercado lá também é gigantesco) tudo que sai de novo sai primeiro em inglês. Se for esperar alguém se interessar em traduzir, pense no trabalho que isso dá e o tempo que leva. Você vai estar necessariamente vendo material defasado se esperar sair em português. E quando começar a se interessar pelo material pode ser que ele já esteja inclusive obsoleto. Você não vai estar um passo atrás, vai estar centenas de quilômetros atrás.</p>
<p>A segunda razão é que o mundo da internet é globalizado. Não é incomum pegar código feito em outros países para continuar e não é incomum o código que você fizer ter que ser dividido com programadores de outros países. Se faça um favor: não passe vergonha.</p>
<h2>Guerras Religiosas</h2>
<p>Programação não é torcida de futebol, nem numerologia, nem astrologia. Não tem horóscopo, não tem guru. Lembre-se isso se chama <strong>CIÊNCIA</strong> da Computação, não <strong>Astrologia</strong> da Computação.</p>
<p>Todo mundo tem gostos subjetivos, só que é estupidez transformar gosto em dogma. A preguiça de ter que aprender algo novo faz o famoso <em>"Sou bom em Clipper, essa linguagem vai evoluir no futuro e sempre vai existir, basta eu defender com unhas e dentes que não importa o que surgir depois."</em></p>
<p>Substitua "Clipper" por qualquer outra, de Cobol, Basic, Pascal, Algol, Eiffel, Smalltalk, etc até as mais recentes, Java, C#, Javascript, Python, etc. Só porque alguma coisa existe hoje não há absolutamente nenhuma garantia que vai continuar existindo. Pense quão ridículo alguém que disse a frase acima não deve estar se sentindo agora. Não faça esse papel. Em Ciências não somos leais a "times", torcemos sempre para quem está ganhando e trocamos tão logo ele se prove errado. É por isso que Ciência sempre evolui.</p>
<p>E surpresas acontecem. Durante os anos 80 e 90 ninguém deu atenção à Objective-C. Estava fadado ao fracasso. Do nada, em 2007, surge o iPhone que - surpresa, precisa saber Objective-C. De repente ela se torna uma das linguagens de maior sucesso do fim da primeira década do Século XXI. De 10 em 10 anos o mercado se transforma de alguma forma. A <a href="https://en.wikipedia.org/wiki/Bell's_law_of_computer_classes">"Lei de Bell"</a>.</p>
<h2>Aceite: suas soluções hoje são Ruins</h2>
<p>Continuando o tema do <strong>"Ignore as Guerras Religiosas"</strong>, como fazer para entender o que fazer? Atenha-se aos princípios. Jogue fora o que os gurus falam, não idolatre ninguém e nem siga cegamente o que alguém diz, desça às perguntas fundamentais e vai encontrar uma direção mais óbvia.</p>
<p>Quando você sabe como as coisas funcionam, retira o verniz, abre o capô, desmonta o motor, entende a química da combustão, só então vai conseguir dominar a arte. Se você, male-male, lembra pra que diabos serve trocar o óleo, vai ser sempre só um motorista medíocre, no melhor dos casos. Qual é seu objetivo? É ser engenheiro do carro? Porque se for, simplesmente ouvir gurus falando da cor do volante dificilmente vai te levar muito longe.</p>
<p>A Ciência da Computação é normalmente ignorada porque parece que aprender Matemática não só é chato como é inútil.</p>
<p>Vamos dar alguns exemplos. Se eu perguntar a um iniciante como procurar por palavras dentro de um texto, as coisas mais óbvias que devem vir à cabeça são:</p>
<ul>
  <li>usar funções de substring e um loop para vasculhar o texto (solução brute-force)</li>
  <li>usar uma expressão regular ou num banco de dados usar um "LIKE" (solução genérica)</li>
  <li>instalar um SOLR ou Elasticsearch (solução correta em muitos casos, mas "magia negra" no entendimento)</li>
</ul>
<p>A maioria nem pensaria na 3a solução. E se pensar não sabe porque. E se eu disser que - obviamente de forma absolutamente crú e resumida - a solução está em transformar um documento e os termos de pesquisa em vetores e calcular a relevância entre os termos de procura e os documentos por <a href="https://en.wikipedia.org/wiki/Cosine_similarity">similaridade de cosseno</a>? Pois é exatamente isso que significa <a href="https://en.wikipedia.org/wiki/Vector_space_model">Vector Space Model</a> (VSM) que você vai encontrar em diversas engines de procura.</p>
<div class="embed-container"><iframe src="https://www.youtube.com/embed/ZEkO8QSlynY" frameborder="0" allowfullscreen=""></iframe></div>
<p>O conhecimento que leva a isso se chama <a href="https://en.wikipedia.org/wiki/Linear_algebra"><strong>Álgebra Linear</strong></a>. Lembra-se disso do PRIMEIRO ano de Ciência da Computação? Em particular sobre esse assunto recomendo assistir uma palestra que fiz sobre isso chamado <a href="https://www.eventials.com/akitaonrails/como-nao-fazer-pesquisas-usando-like/">"Como não fazer pesquisas usando LIKE"</a>.</p>
<p>E quando você precisa criar um processo para filtrar conteúdo? Para evitar conteúdo impróprio? A maioria das pessoas pensaria no seguinte:</p>
<ul>
  <li>criar um blacklist de palavras e ir adicionando à medida que se lembra de palavras ofensivas. E usar a primeira ou segunda opção do que listei antes para buscar essas palavras.</li>
</ul>
<p>Como você já deve imaginar, a resposta mais "óbvia" ou "simples" (considerando a falta de conhecimento), provavelmente é a errada, e nesse caso de fato essa não é a mais eficiente.</p>
<p>Conheça sobre machine learning e uma das formas mais simples disso chamada <a href="https://en.wikipedia.org/wiki/Naive_Bayes_classifier">Classificador Bayesiano Ingênuo</a>. Alguém pode pensar <em>"puts, mas isso de machine learning é avançado demais pro dia a dia."</em> De maneira alguma. Aliás, qualquer filtro anti-spam vagabundo que você encontra num site de downloads gratuitos usa um classificador.</p>
<p>A idéia é que simplesmente palavras simples não são suficiente para determinar se um conteúdo é impróprio ou não. A forma da construção de frases, o "tom" da forma de se escrever. Tudo isso forma um padrão que pode ser classificado e aprendido. Quanto mais conteúdo impróprio é classificado mais eficiente o algoritmo fica. Se quiser experimentar uma forma simples <a href="https://blog.logankoester.com/bayesian-classification-on-rails">em Ruby veja este blog</a>. Se quiser aprender sobre classificadores mais avançados, veja o projeto <a href="https://mahout.apache.org/">Apache Mahout</a>.</p>
<iframe width="640" height="360" src="//www.youtube.com/embed/DdYSMwEWbd4" frameborder="0" allowfullscreen=""></iframe>
<p>E o que é isso? É uma matéria de <a href="https://www.khanacademy.org/math/probability"><strong>Estatística e Probabilidade</strong></a>. Os fundamentos para entender isso estão de novo no PRIMEIRO ano de Ciência da Computação.</p>
<p><em>"Ah, mas você está falando coisas que ninguém precisa saber. Pra fazer sites web isso é desnecessário."</em></p>
<p>Uma coisa que qualquer bom framework web precisa saber fazer com eficiência hoje em dia é mapear rotas com a programação por baixo (controllers). O Ruby on Rails tem um componente de rotas chamado <a href="https://github.com/rails/journey">Journey</a>, que configuramos via o arquivo "config/routes.rb". Abaixo temos um trecho disso:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">ImageUploadDemo</span>::<span style="color:#036;font-weight:bold">Application</span>.routes.draw <span style="color:#080;font-weight:bold">do</span>
  devise_for <span style="color:#A60">:admin_users</span>, <span style="color:#036;font-weight:bold">ActiveAdmin</span>::<span style="color:#036;font-weight:bold">Devise</span>.config
  resources <span style="color:#A60">:photos</span>
  authenticated <span style="color:#A60">:user</span> <span style="color:#080;font-weight:bold">do</span>
    root <span style="color:#A60">:to</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">photos#index</span><span style="color:#710">'</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  root <span style="color:#A60">:to</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">photos#index</span><span style="color:#710">"</span></span>
  devise_for <span style="color:#A60">:users</span>
  require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">sidekiq/web</span><span style="color:#710">'</span></span>
  mount <span style="color:#036;font-weight:bold">Sidekiq</span>::<span style="color:#036;font-weight:bold">Web</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">/sidekiq</span><span style="color:#710">'</span></span>
  <span style="color:#036;font-weight:bold">ActiveAdmin</span>.routes(<span style="color:#069">self</span>)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quão difícil isso pode ser? O que a maioria poderia imaginar?</p>
<ul>
  <li>Fácil, basta fazer um conjunto de arrays ou um hash (dicionário) e quando chegar a URL basta quebrar os termos via uma regular expression e encontrar o controller passando os parâmetros pra executar.</li>
</ul>
<p>Vamos nos repetir novamente? Sim, isso funciona, para aplicações bem pequenas. Qualquer coisa muito maior do que o exemplo acima já vai dar problemas de performance.</p>
<p>Que tal ver um trecho do código do Journey?</p>
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
<strong><a href="#n40" name="n40">40</a></strong>
<a href="#n41" name="n41">41</a>
<a href="#n42" name="n42">42</a>
<a href="#n43" name="n43">43</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Journey::Parser</span>
token <span style="color:#036;font-weight:bold">SLASH</span> <span style="color:#036;font-weight:bold">LITERAL</span> <span style="color:#036;font-weight:bold">SYMBOL</span> <span style="color:#036;font-weight:bold">LPAREN</span> <span style="color:#036;font-weight:bold">RPAREN</span> <span style="color:#036;font-weight:bold">DOT</span> <span style="color:#036;font-weight:bold">STAR</span> <span style="color:#036;font-weight:bold">OR</span>
rule
  expressions
    : expressions expression  { result = <span style="color:#036;font-weight:bold">Cat</span>.new(val.first, val.last) }
    | expression              { result = val.first }
    | <span style="color:#080;font-weight:bold">or</span>
    ;
  expression
    : terminal
    | group
    | star
    ;
  group
    : <span style="color:#036;font-weight:bold">LPAREN</span> expressions <span style="color:#036;font-weight:bold">RPAREN</span> { result = <span style="color:#036;font-weight:bold">Group</span>.new(val[<span style="color:#00D">1</span>]) }
    ;
  <span style="color:#080;font-weight:bold">or</span>
    : expressions <span style="color:#036;font-weight:bold">OR</span> expression { result = <span style="color:#036;font-weight:bold">Or</span>.new([val.first, val.last]) }
    ;
  star
    : <span style="color:#036;font-weight:bold">STAR</span>       { result = <span style="color:#036;font-weight:bold">Star</span>.new(<span style="color:#036;font-weight:bold">Symbol</span>.new(val.last)) }
    ;
  terminal
    : symbol
    | literal
    | slash
    | dot
    ;
  slash
    : <span style="color:#036;font-weight:bold">SLASH</span>              { result = <span style="color:#036;font-weight:bold">Slash</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">/</span><span style="color:#710">'</span></span>) }
    ;
  symbol
    : <span style="color:#036;font-weight:bold">SYMBOL</span>             { result = <span style="color:#036;font-weight:bold">Symbol</span>.new(val.first) }
    ;
  literal
    : <span style="color:#036;font-weight:bold">LITERAL</span>            { result = <span style="color:#036;font-weight:bold">Literal</span>.new(val.first) }
  dot
    : <span style="color:#036;font-weight:bold">DOT</span>                { result = <span style="color:#036;font-weight:bold">Dot</span>.new(val.first) }
    ;
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em bom português, agora <strong>fodeu</strong>. Parte do Journey se utiliza do <a href="https://github.com/tenderlove/racc">Racc</a> um gerador de parsers.</p>
<p>Se você passou pelo menos pro SEGUNDO ano de Ciências da Computação então passou pelas matérias de <a href="https://en.wikipedia.org/wiki/Algorithms_%2B_Data_Structures_%3D_Programs"><strong>Algoritmos e Estruturas de Dados</strong></a> e Montadores. E se chegou ao TERCEIRO ano deve ter aprendido sobre <a href="https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools"><strong>Compiladores</strong></a> (e visto o famoso livro do Dragão). Racc deve ter te lembrado de Yacc, Flex, Bison.</p>
<iframe width="640" height="360" src="//www.youtube.com/embed/QPCC2sbukeo" frameborder="0" allowfullscreen=""></iframe>
<p>Para arrematar, você deve achar que sabe o que é <a href="https://c2.com/cgi/wiki?NobodyAgreesOnWhatOoIs"><strong>Orientação a Objetos</strong></a>, certo? Certamente acha que sua linguagem favorita (seja Java, C# ou Javascript) são orientados a objetos. Se eu pedir para definir o que isso significa, está na ponta da sua língua:</p>
<ul>
  <li>Minha linguagem suporta Encapsulamento, Herança e Polimorfismo, portanto é orientada a objetos.</li>
</ul>
<p>E se eu lhe disser que linguagens procedurais, imperativas, funcionais também suportam encapsulamento, herança (seja via delegação ou não) e polimorfismo? E se é esse o caso então <a href="https://c2.com/cgi/wiki?NobodyAgreesOnWhatOoIs">o que define orientação a objetos?</a></p>
<p>Alguns que se entreteram no assunto talvez se lembrem de <a href="https://en.wikipedia.org/wiki/Alan_Kay">Alan Kay</a>, que cunhou o termo "orientação a objetos". Mas quantos pararam para pesquisar a linguagem Simula 67? O que o Simula introduziu em 1967? Objetos, classes, herança, subclasses, métodos virtuais, <a href="https://en.wikipedia.org/wiki/Coroutine">corotinas</a>, simulação de eventos discretos, garbage collection.</p>
<p>E quantos já ouviram falar dos criadores do Simula 67, <a href="https://en.wikipedia.org/wiki/Kristen_Nygaard">Kristen Nygaard</a> e <a href="https://en.wikipedia.org/wiki/Ole-Johan_Dahl">Ole-Johan Dahl</a>?</p>
<p>Não sabem quem são? Tenho certeza que não. Bem, eis que lhes apresento os pais da orientação a objetos.</p>
<h2>Sobre os Ombros de Gigantes</h2>
<p>O que mencionei na seção anterior não é nem a ponta do iceberg, é uma gota d'água nessa ponta. O importante é você ganhar consciência de que tudo que você acha que sabe é perto de nada. Quero que você aceite que tudo que você acha que sabe ou está errado ou é totalmente incompleto.</p>
<p>Isso é importante porque qualquer um que ache que já sabe tudo ou perto disso nunca vai aprender nada. Você precisa esvaziar o copo para poder enchê-lo. (by Bruce Lee)</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/406/big_quote-emptiness-the-starting-point-in-order-to-taste-my-cup-of-water-you-must-first-empty-your-cup-bruce-lee-246247.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/406/quote-emptiness-the-starting-point-in-order-to-taste-my-cup-of-water-you-must-first-empty-your-cup-bruce-lee-246247.jpg 2x" alt="Bruce Lee Quote"></p>
<p>Além disso quero que você entenda que você não está sozinho. Antes de você vieram dezenas de grandes mentes. E não estou falando desses gurus superficiais ensinando meramente técnicas e ferramentas. Esqueça-os, todo mundo vai esquecê-los em breve também.</p>
<p>Todo mundo sabe quem é Linus Torvalds, Bill Gates, Steve Jobs, Zuckerberg. Esqueça-os por enquanto. Atenha-se aos imortais. Nomes que realmente fizeram a diferença na história da Ciência da Computação. Alguns exemplos:</p>
<ul>
  <li><a href="https://en.wikipedia.org/wiki/Charles_Babbage">Charles Babbage</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Ada_Lovelace">Ada Lovelace</a></li>
  <li><a href="https://en.wikipedia.org/wiki/George_Boole">George Boole</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Alan_Turing">Alan Turing</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Alonzo_Church">Alonzo Church</a></li>
  <li><a href="https://en.wikipedia.org/wiki/John_von_Neumann">John von Neumann</a></li>
  <li><a href="https://bit.ly/1rN6Kwe">John McCarthy</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Niklaus_Wirth">Niklaus Wirth</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Bertrand_Meyer">Bertrand Meyer</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Dan_Ingalls">Dan Ingals</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Donald_Knuth">Donald Knuth</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Edsger_Dijkstra">Edsger W. Dijkstra</a></li>
</ul>
<p>E isso apenas para listar alguns poucos. Ciência é um campo amplo, onde o trabalho de um cientista complementa o trabalho do anterior. Passo a passo andando sempre para frente. É um trabalho acumulativo de dezenas, centenas de anos. Nossa vantagem? Centenas de pessoas já trilharam esse caminho no passado e podemos nos utilizar do que eles aprenderam e deixaram para nós, em vez de nós mesmos cometermos os mesmos erros até aprendermos.</p>
<iframe width="480" height="360" src="//www.youtube.com/embed/6dME3wgaQpM" frameborder="0" allowfullscreen=""></iframe>
<p>Quase tudo que você vê por aí que se chama <a href="https://startups.ig.com.br/2013/restricoes-sao-libertadoras-menos-e-mais/">"inovação"</a> não é mais do que a redescoberta de coisas que já estão documentadas no passado mas estavam à frente do seu tempo. Foi assim com o mouse: <a href="https://en.wikipedia.org/wiki/Douglas_Engelbart">Douglas Engelbart</a>, que criou o mouse em 1968 precisou esperar até Steve Jobs lançar o Macintosh, 16 anos depois, para ver sua invenção ser popularizada. Pare para pensar: quantas descobertas estão no passado apenas esperando para que nós a desenterremos para finalmente realizá-las?</p>
<p>Quer saber sobre os livros imortais da Ciência da Computação? Vamos a alguns:</p>
<ul>
  <li><a href="https://en.wikipedia.org/wiki/Structure_and_Interpretation_of_Computer_Programs">Structure and Interpretation of Computer Programs (SICP)</a></li>
  <li><a href="https://en.wikipedia.org/wiki/The_C_Programming_Language">The C Programming Language (K&amp;R)</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Algorithms_%2B_Data_Structures_%3D_Programs">Algorithms + Data Structures = Programs</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Compilers:_Principles,_Techniques,_and_Tools">Compilers: Principles, Techniques and Tools</a> - o livro do Dragão</li>
  <li><a href="https://en.wikipedia.org/wiki/Modern_Operating_Systems">Modern Operating Systems</a></li>
  <li><a href="https://en.wikipedia.org/wiki/Computer_network">Computer Networks</a></li>
  <li><a href="https://en.wikipedia.org/wiki/The_Art_of_Computer_Programming">The Art of Computer Programming</a> - nem eu li esses livros, e desconheço quem tenha lido e entendido mas vou deixar aqui pela importância.</li>
</ul>
<p><a href="https://www.akitaonrails.com/2009/04/17/off-topic-devo-fazer-faculdade">Não quer fazer uma faculdade?</a> Não tem problema, tente acompanhar o material disponível online do MIT de <a href="https://ocw.mit.edu/courses/#electrical-engineering-and-computer-science">Electrical Engineering and Computer Science</a>. Se você ainda é completamente amador mesmo no mundo da programação veja este curso introdutório à Ciência da Computação no <a href="https://www.coursera.org/course/cs101">Coursera</a>.</p>
<p>Note que não estou citando neste artigo nenhum dos nomes que muitos poderiam esperar como Martin Fowler, Bruce Eckel, Robert Martin, Michael Feathers, Kent Beck, Steve McConnel, Tom DeMarco, Dave Thomas, etc. Esqueça-os. Se não ver os anteriores, estes farão pouca diferença.</p>
<p>Não coloque o carro na frente dos bois, vá um passo de cada vez.</p>
<h2>Carreira em Programação</h2>
<p>Uma coisa que eu sempre repito é o seguinte:</p>
<blockquote>"Programar não é escrever qualquer código da mesma forma que culinária não é jogar qualquer ingrediente numa panela."</blockquote>
<p>Entenda: é muito simples escrever código, qualquer um que tenha o mínimo de coordenação motora pra não tentar passar uma peça quadrada num buraco circular, ou que minimamente já tenha empilhado uma peça de lego em cima da outra, tem condições de escrever código. Não há absolutamente nenhum mérito nisso.</p>
<p>Baixar um Twitter Bootstrap, usar um gerador do Yeoman, instalar um MySQL no Ubuntu, copiar e colar um trecho de JQuery, qualquer um consegue fazer.</p>
<p>Quando se fala em carreira, o que "qualquer um" consegue fazer significa que é um mero <a href="https://en.wikipedia.org/wiki/Commodity">"commodity"</a>. Ser um commodity significa que o valor que o mercado está disposto a pagar só vai decair, não vai subir. Temporariamente surge alguma novidade para tentar criar uma diferenciação (<em>"veja, Angular JS"</em>, <em>"veja, HTML 5"</em>), mas elas rapidamente se dissolvem na tendência de queda do valor.</p>
<p>O valor não está na montagem. Está na criatividade da solução: conseguir extrair o maior valor pelo menor custo. E criatividade só existe quando você tem domínio sobre todos os elementos ao seu redor. Quando 1 hora para trocar um algoritmo idiota de procura de palavras por um vector space model reduz seu parque de máquinas de 10 para 2, e responde ao seu usuário em 1/5 do tempo. Aí não é força bruta, é de fato conhecimento. E isso tem valor e cresce.</p>
<p>Ter uma caixa de ferramentas cheia só o torna um "faz-tudo com muitas ferramentas", não o torna um engenheiro/arquiteto capaz de construir o próximo World Trade Center/Freedom Tower.</p>
<p>Mas, como todo mundo que quer evoluir, todos começamos como faz-tudo. Não há nada de errado nisso, apenas não se iluda achando que ter uma caixa de ferramentas com mais ferramentas o torna qualquer coisa diferente disso.</p>
<p></p>
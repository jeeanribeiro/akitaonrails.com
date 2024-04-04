---
title: "Web Components é uma Revolução?"
date: "2014-07-06T04:09:00.000Z"
tags: ["javascript", "front-end"]
years: "2014"
---

<p></p>
<p>Existe uma nova celebridade na cidade, e seu nome é <a href="http://webcomponents.org/">"Web Components"</a>. Ultimamente muitos apresentam esta nova tecnologia como o 'Santo Graal' que vai resolver todos os problemas da Web. Este artigo não é um apoio incondicional, não é uma crítica negativa irrefutável, mas meramente uma apresentação de perspectivas com o objetivo de dar clareza. Nenhuma discussão pode funcionar onde os gritos mais altos são simplesmente <em>"Isso vai revolucionar a Web!"</em> (sem explicar porque) ou <em>"O Google e a Mozilla estão por trás então é foda!"</em> (sem comentários).</p>
<p>Do ponto de vista puramente técnico é muito simples entender o que é um "Web Component". Ele é o conjunto de 4 tecnologias de navegadores web.</p>
<ul>
  <li>Custom Elements</li>
  <li>HTML Imports</li>
  <li>Templates</li>
  <li>Shadow DOM</li>
</ul>
<p>Colocando em ordem de importância, eu resumiria da seguinte forma:</p>
<ul>
  <li>Custom Elements - permite criar tags diferente dos canônicos como "body", "input" e evitar o classes-hell ou div-hell onde tudo é um punhado de divs dentro de divs criando os horrendos macarrões de tags. A idéia é encapsular tudo dentro de tags simples e mais fáceis de manusear.</li>
  <li>Shadow DOM - para o fator encapsulamento, precisamos primeiro conseguir eliminar o sangramento de estilos e comportamentos por tudo que existe numa página. Shadow DOM permite criar trechos de nós de elementos de DOM que são independentes e isolados entre si, onde o estilo de um trecho não interfere com outro. Somente o Chrome e Firefox mais novos suportam isso. WebKit/Safari deixou de suportar a implementação incompleta que tinham (mas talvez voltem) e o IE, para variar, nunca nem tentou implementar isso. Para funcionar na maioria dos navegadores existem projetos como o Polymer/Platform e X-Tag para servir como "polyfill" para navegadores legados.</li>
  <li>Templates - como o nome diz, para criar componentes dinâmicos, é importante ter trechos de DOM inertes, diferentes de somente uma string, para conseguir manipular e instanciar conforme necessário. Por exemplo, linhas de uma tabela dinâmica. Existem várias bibliotecas de templates, como Mustache, mas para Web Components funcionar, era importante ter um padrão.</li>
  <li>HTML Imports - e uma vez tendo um trecho de DOM isolado, com estilos e comportamentos independentes de outros componentes, agora precisamos empacotar isso. E para isso servem esses imports que basicamente é um arquivo HTML que declara os arquivos CSS e Javascript que ele depende, e o HTML Import sabe como carregar tudo de uma vez. Aqui fica uma das minhas maiores preocupações - que vou tentar explicar mais para o fim.</li>
</ul>
<p></p>
<p></p>
<p>Existem já dezenas de artigos e documentação de como é um Web Component, como construir um do zero e onde encontrar componentes. Não é foco deste artigo explicar os detalhes técnicos de um Web Component.</p>
<p>Por si só, devo dizer que são tecnologias interessantes que todo bom nerd gosta de brincar. Porém não deveria ser novidade que só porque alguma coisa é tecnicamente interessante, por si só, não garante absolutamente nada. A principal pergunta é: <em>"o que eu ganho com isso?"</em> Antes de responder a essa pergunta, toda tecnologia é somente uma solução procurando um problema.</p>
<p>Infelizmente nem eu, nem ninguém, temos como prever o futuro, então neste artigo quero avaliar qualquer proposta baseado no que temos no presente, relembrar o passado e o que isso pode representar no curto prazo. O longo prazo deixo para os profetas e quem gosta de apostar em loteria. Então vou tentar quebrar alguns dos grandes problemas do desenvolvimento Web que temos hoje.</p>
<h2>O Problema do HTML/CSS macarrônicos</h2>
<p>A forma de desenhar uma página Web mudou bastante nos últimos 20 anos. As tecnologias básicas ainda são as mesmas: HTML 5 para estruturar um documento. CSS 3 para estilizar os elementos nesse documento. Javascript para adicionar comportamento. Acho que a esta altura todos já sabemos que devemos separar estilização/apresentação da estrutura e conteúdo. Também sabemos que não devemos nem usar tabelas para tudo e nem usar divs com float para tudo.</p>
<p>Passamos pela era da <a href="https://semanticweb.org/wiki/Main_Page">Web Semântica</a> e <a href="https://www.smashingmagazine.com/2011/01/12/guidelines-for-responsive-web-design/">Web Responsiva</a>. Quando os navegadores implementaram tables no <a href="https://www.barrypearson.co.uk/articles/layout_tables/history.htm">Netscape Navigator 1.1 e IE 2.0 em 1995 e 1996</a> ainda não se falava em acessibilidade e semântica apareceriam a partir de 1997 com o HTML 3.2. Estávamos criando a Web e usando ao mesmo tempo, como hoje as implementações apareciam antes de se ter uma especificação mais geral. A W3C é lenta não é de hoje.</p>
<p>Acho que a evangelização de Responsive Web também merece um "rant" mas fica para outro artigo.</p>
<p>Mesmo assim ainda somos reféns de códigos como deste exemplo de tabs do framework <a href="https://getbootstrap.com/components/#input-groups">Bootstrap</a>:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;ul</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nav nav-tabs</span><span style="color:#710">"</span></span> <span style="color:#b48">role</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">tablist</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;li</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">active</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Home<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span>
  <span style="color:#070">&lt;li&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Profile<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span>
  <span style="color:#070">&lt;li&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Messages<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span>
<span style="color:#070">&lt;/ul&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E vejamos um trecho para tabs mas usando um web component do novíssimo <a href="https://www.polymer-project.org/components/paper-elements/demo.html#paper-tabs">Polymer/Paper</a>:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;paper-tabs</span> <span style="color:#b48">selected</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">0</span><span style="color:#710">"</span></span> <span style="color:#b48">selectedindex</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">0</span><span style="color:#710">"</span></span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">paper_tabs</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;paper-tab</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">tab_home</span><span style="color:#710">"</span></span> <span style="color:#b48">active</span><span style="color:#070">&gt;</span>Home<span style="color:#070">&lt;/paper-tab&gt;</span>
  <span style="color:#070">&lt;paper-tab</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">tab_profile</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Profile<span style="color:#070">&lt;/paper-tab&gt;</span>
  <span style="color:#070">&lt;paper-tab</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">tab_messages</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Messages<span style="color:#070">&lt;/paper-tab&gt;</span>
<span style="color:#070">&lt;/paper-tabs&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse é o resultado da primeira tecnologia de Web Components: <a href="https://www.html5rocks.com/en/tutorials/webcomponents/customelements/">Custom Elements</a>. De fato isso acrescenta uma clareza enorme. No primeiro exemplo o que temos é:</p>
<blockquote>"Uma lista não ordenada com classes nav e nav-tags e dentro delas itens de lista."</blockquote>
<p>Se você souber o que são as classes "nav" e "nav-tabs" vamos saber que se trata de uma lista de tabs. No caso do exemplo do Paper podemos ler claramente:</p>
<blockquote>"Um conjunto de tabs, implementado com Paper."</blockquote>
<p>Isto é um exemplo pequeno mas imaginando como páginas Web são complexas, tirar a ambiguidade de para que servem cada conjunto de tags numa árvore infinita de tags é muito importante. Perdemos muito tempo em tentativa e erro de retirar pedaços e tentando inserir outros pedaços no meio da árvore de HTML e decifrando nomes de classes CSS.</p>
<p>Na prática, sem ter Custom Elements para tornar as tags mais amigáveis, outra forma é encapsular a inicialização usando um marcador simples numa tag HTML (como uma classe CSS ou ID) e ativar o resto via Javascript. É como todo plugin JQuery funciona. Um exemplo simples é como encapsulamos o Google Maps com o plugin <a href="https://gmap3.net/en/catalog/9-map/map-32">Gmap3</a> do JQuery:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;div</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">my-map</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
<span style="color:#070">&lt;script&gt;</span>
<span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="color:#369;font-weight:bold">$</span>(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#my-map</span><span style="color:#710">"</span></span>).gmap3({
    <span style="color:#606">map</span>:{
      <span style="color:#606">address</span>:<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Cupertino, CA</span><span style="color:#710">"</span></span>,
      <span style="color:#606">options</span>:{
        <span style="color:#606">zoom</span>:<span style="color:#00D">4</span>,
        <span style="color:#606">mapTypeId</span>: google.maps.MapTypeId.SATELLITE,
        <span style="color:#606">mapTypeControl</span>: <span style="color:#069">true</span>,
        <span style="color:#606">mapTypeControlOptions</span>: {
          <span style="color:#606">style</span>: google.maps.MapTypeControlStyle.DROPDOWN_MENU
        },
        <span style="color:#606">navigationControl</span>: <span style="color:#069">true</span>,
        <span style="color:#606">scrollwheel</span>: <span style="color:#069">true</span>,
        <span style="color:#606">streetViewControl</span>: <span style="color:#069">true</span>
      }
    }
  });</span>
<span style="color:#070">&lt;/script&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E outro exemplo com a alternativa com o <a href="https://polymerlabs.github.io/google-map/components/google-map/">Web Component Google-Map</a> (lembrando que esta versão é mais simples do que o plugin Gmap3):</p>
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
      <td class="code"><pre><span style="color:#070">&lt;google-map</span> <span style="color:#b48">latitude</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">37.77493</span><span style="color:#710">"</span></span> <span style="color:#b48">longitude</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">-122.41942</span><span style="color:#710">"</span></span> <span style="color:#b48">fitToMarkers</span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;google-map-marker</span> <span style="color:#b48">latitude</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">37.779</span><span style="color:#710">"</span></span> <span style="color:#b48">longitude</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">-122.3892</span><span style="color:#710">"</span></span>
      <span style="color:#b48">draggable</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">true</span><span style="color:#710">"</span></span> <span style="color:#b48">title</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Go Giants!</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/google-map-marker&gt;</span>
  <span style="color:#070">&lt;google-map-marker</span> <span style="color:#b48">latitude</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">37.777</span><span style="color:#710">"</span></span> <span style="color:#b48">longitude</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">-122.38911</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/google-map-marker&gt;</span>
<span style="color:#070">&lt;/google-map&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Estamos movendo parte do que faríamos via Javascript de volta ao HTML. Mas somente isso não é suficiente e já sabemos disso. A tecnologia de "Cascading Style Sheet versão 3", comumente conhecida como CSS 3 até hoje permanece arcaica. Felizmente inventamos uma forma de tornar os malditos macarrões de CSS gerenciáveis. Agradecimentos são devidos à <a href="https://www.hamptoncatlin.com">Hampton Catlin</a>, um grande rubista que - em <strong>2007</strong> - inventou a <a href="https://sass-lang.com/">linguagem de script SASS</a>, que é um "super-set" de CSS e gera CSS 3, adicionando variáveis, nesting, partials, import, mixins, extensão/herança, operadores.</p>
<p>SASS foi a primeira linguagem de pré-processamento que acelerou a idéia da possibilidade de novas formas de gerenciar assets Web como CSS. Depois dele vieram LESS e toda uma gama de frameworks e bibliotecas como <a href="https://singularity.gs/">Singularity</a>, <a href="https://neat.bourbon.io/">Bourbon Neat</a>, <a href="https://susy.oddbird.net/">Susy</a>, <a href="https://foundation.zurb.com/">Zurb Foundation</a>, <a href="https://compass-style.org/">Compass</a>. Foi uma pena terem escrito o Twitter Bootstrap original em <a href="https://wordsbyf.at/2012/03/08/why-less/">LESS em vez de SASS</a>, mas acho que o projeto <a href="https://libsass.org/">LibSass</a> (SASS escrito em C) ainda não existia. Mas pelo próprio exemplo acima fica claro porque você deveria escolher outro framework em vez de Bootstrap.</p>
<p>Porém SASS não foi a primeira vez que alguém criou um pré-processador para a Web. Provavelmente a primeira foi a <a href="https://en.wikipedia.org/wiki/Wiki_markup">Wiki Markup</a> implementada junto com o primeiro Wiki, o <a href="https://en.wikipedia.org/wiki/WikiWikiWeb">WikiWikiWeb</a> de Ward Cunningham em 1995. Depois disso ainda tivemos o MediaWiki da Wikipedia até chegarmos atualmente a pré-processadores de HTML como Markdown, que praticamente usamos sem pensar em comentários de Github.</p>
<p>No mundo Rails já tentamos melhorar o HTML também, com pré-processadores como o HAML (do próprio Catlin) ou outros mais recentes como <a href="https://slim-lang.com/">Slim</a>. Mas nesse caso ainda não estamos melhorando o HTML tão drasticamente como SASS faz com CSS, por isso ainda não há uma boa alternativa e Custom Elements é o mais próximo de uma boa alternativa neste momento.</p>
<p>Estou trazendo estes pontos porque Web Components não declara nenhum pré-processador de CSS como padrão, por convenção. Assumimos CSS 3 puro. Não é um problema, mas se estamos falando de reuso, atualmente a melhor forma é usando mixins de SASS encapsuladas em bibliotecas como Compass ou Bourbon.</p>
<h2>O Problema do Sangramento de Estilos e Comportamentos</h2>
<p>Este é um dos aspectos mais irritantes de desenvolvimento front-end depois da compatibilidade de navegadores: como organizar as milhares de linhas de CSS? (seja ele puro, escrito em SASS ou LESS).</p>
<p>Antes de continuar, se nunca ouviu falar de <a href="https://markdaggett.com/blog/2011/12/04/css-anti-patterns/">CSS Anti-patterns</a>, leia a respeito antes. E também que todos já pelo menos ouviram falar nas diversas metodologias para organizar CSS (<a href="https://www.smashingmagazine.com/2011/12/12/an-introduction-to-object-oriented-css-oocss/">OOCss</a> , <a href="https://www.smashingmagazine.com/2012/04/20/decoupling-html-from-css/">SMACSS</a>, <a href="https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/">BEM</a>). Eu honestamente não usaria ACSS e me foram dados bons argumentos para preferir BEM.</p>
<p>Essa introdução foi somente porque também não sou ainda um bom desenvolvedor front-end mas até aqui é o mínimo para começar. Vamos assumir que já passamos desses pontos também. Meu raciocínio começa pelo seguinte caso de uso: <em>"quero criar CSS para um elemento visual, composto de diversos tags, e que não deve se deformar aleatoriamente por estilo de fora e nem deformar outros elementos ao redor."</em> Seria o caso de um Widget ou o que poderia ser um "Web Component", ao pé-da-letra.</p>
<p>Passamos anos fazendo <a href="https://codeutopia.net/blog/2012/05/26/best-practices-for-building-embeddable-widgets/">Widgets</a>. As duas grandes formas são usando um iframe com <a href="https://blog.teamtreehouse.com/cross-domain-messaging-with-postmessage">postMessage()</a> ou zerar os estilos de um trecho do DOM com <a href="https://github.com/premasagar/cleanslate">Cleanslate</a> e garantir que você está isolando seu CSS e Javascript usando namespaces e torcendo pra acidentalmente não sobrar nada global no meio do caminho ou outro desenvolvedor sobrescrever o que você fez.</p>
<p>Isso mudou em 2012 quando surgiu a implementação de <a href="https://blog.teamtreehouse.com/working-with-shadow-dom">Shadow DOM</a>. Os novos elementos do HTML 5 como "audio" ou "video" ou "range" foram criados dessa forma em muitos navegadores. Em resumo mencionamos que uma página Web é uma árvore de tags, essa árvore que chamamos de Document Object Model ou "DOM". Imagine se pudéssemos isolar um trecho de nós, uma sub-árvore, que não fosse influenciada pelos estilos externos e cujos estilos internos não "vazassem" para fora. Para isso criamos um novo elemento, um "ShadowRoot" que delimita uma sub-árvore isolada e independente e que, para todos os propósitos, não aparece no DOM principal, mas tem sua própria raíz de DOM isolada. Esse é o conceito.</p>
<p>No <a href="https://caniuse.com/shadowdom">momento deste artigo</a>, somente o Chrome a partir da versão 25 (hoje no 35), o Firefox a partir da versão 31 (hoje no 30) e Ópera versão 15 (hoje no 22) suportam Shadow DOM. A Apple <a href="https://trac.webkit.org/changeset/164131">retirou o suporte do WebKit</a> em fevereiro. A Microsoft sequer <a href="https://connect.microsoft.com/IE/feedback/details/793965/ie11-feature-request-support-for-shadow-dom">considerou começar a implementar</a> ainda.</p>
<p><a href="https://www.html5rocks.com/en/tutorials/webcomponents/shadowdom/">Shadow DOM</a> não é obrigatório para criar Custom Elements, mas é um recurso interessante e importante para atingir o objetivo de componentes Web independentes e isolados que não precisem recorrer a recursos como reiniciar o CSS de uma sub-árvore com artifícios como Cleanslate. De qualquer forma, seja via as convenções listadas acima e outras, ou seja via Shadow DOM, hoje temos como criar um nível razoável de isolamento e facilidade de manutenção. O problema é que isso não é inerente a HTML 5 e CSS 3, mas uma camada acima que não tem um consenso geral ainda.</p>
<h2>O Problema de Reusar Elementos</h2>
<p>Num mundo onde fazíamos praticamente tudo via server-side, esse era um problema praticamente resolvido. Seja com Rails e ERB/HAML/Slim, seja com templates de Django, seja com Blade em Laravel, seja com Razor em Asp.Net. Porém hoje temos aplicações mistas, onde deferimos muita lógica para a camada do navegador usando mais Javascript. Em vez de devolver pedaços prontos de HTML, agora devolvemos dados semi-estruturados em JSON e deixamos o Javascript criar os elementos no DOM.</p>
<p>Significa que no navegador temos um conjunto de dados e precisamos de uma forma de declarar os elementos de DOM onde vamos aplicar esses dados antes de instanciar o trecho no DOM. Do mundo Ruby surgiu uma das formas mais populares, <a href="https://mustache.github.io/">Mustache</a>, criado pelo co-fundador do Github, <a href="https://github.com/defunkt">Chris Wanstrath</a>. Depois outro rubista, <a href="https://github.com/wycats">Yehuda Katz</a>, trouxe outra alternativa com o <a href="https://handlebarsjs.com/">Handlebars</a>. A idéia geral é criar um elemento "script" e dentro dela colocar templates usando a notação do Mustache. Então um Javascript pode pegar o conteúdo string dessa tag script e criar o elemento no DOM depois de mesclar com os dados que quiser.</p>
<p>Está claro que estamos fazendo uma "gambiarra" elegante. A parte não tão elegante é ter que injetar HTML usando "innerHTML", mas funciona muito bem. O outro problema é controlar manualmente coisas como imagens e javascripts que um elemento pode precisar mas antes dele ser usado, ou seja, talvez sem necessidade. Para isso precisamos controlar via Javascript.</p>
<p>Na definição de Web Components foi criado um novo elemento para resolver alguns desses problemas, o <a href="https://www.html5rocks.com/en/tutorials/webcomponents/template/">"template"</a>. Sua definição é bem recente, de fevereiro de 2014. Serve basicamente o mesmo propósito de colocar um template dentro de uma tag "script" mas em vez de ser somente um string injetável ele realmente é uma sub-árvore de DOM "inerte", que podemos manipular os nós via Javascript antes de ativá-lo ao inserir no DOM principal.</p>
<p>Por não ser mais um trecho de texto, perdemos a função do Mustache e do Handlebar de facilmente mesclar dados e inclusive ter alguma lógica como condicionais e loops. Em vez disso precisamos manipular os nós via javascript, fazendo coisas como:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>t.content.querySelector(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">img</span><span style="color:#710">'</span></span>).src = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">logo.png</span><span style="color:#710">'</span></span>;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em vez de ter:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;img</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">{{minha-imagem}}</span><span style="color:#710">"</span></span> <span style="color:#b48">alt</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">great image</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Neste caso de templates eu diria que demos 2 passos pra trás e 1 para frente. Provavelmente dentro de um "HTML template" vamos precisar ter um Mustache para completar o processo? Admito que não acompanho a especificação mas pelo pouco que vi até agora não me parece que a especificação W3C de HTML template resolve o problema que bibliotecas como Mustache, Handlebars ou <a href="https://github.com/tildeio/htmlbars">HTMLBars</a> resolvem hoje.</p>
<p>E não estou nem mencionando sobre Binding. Pelo que entendi isso não está na especificação, mas implementado em projetos como o <a href="https://mdv.googlecode.com/svn/trunk/docs/design_intro.html">Google MDV</a> que agora está integrado ao <a href="https://www.polymer-project.org/docs/polymer/databinding.html">Data Binding e Event Mapping do Polymer</a> como <a href="https://github.com/Polymer/TemplateBinding">TemplateBinding</a>.</p>
<h2>O Problema de Reusar "Componentes"</h2>
<p>Definindo "Web Components" como, um conjunto de HTML, CSS, Javascript que funciona em independência e isolamento, finalmente sobra o problema de "empacotar" esse conjunto. E agora entra a <a href="https://w3c.github.io/webcomponents/spec/imports/">nova especificação de HTML Imports</a> de Julho de 2014.</p>
<p>Na prática, um HTML Import é nada mais do que um arquivo HTML "normal" com links para outros arquivos como stylesheets, imagens, javascripts e outros assets. Novamente, não vou descrever todos os detalhes e para aprender mais leia o artigo <a href="https://www.html5rocks.com/en/tutorials/webcomponents/imports/">Why imports?</a>.</p>
<p>Atualmente, se precisamos usar algum conjunto desses, como um componente de Bootstrap, por exemplo, precisamos manualmente linkar para os stylesheets na ordem correta e fazer algo como:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;head&gt;</span>
  <span style="color:#070">&lt;link</span> <span style="color:#b48">rel</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stylesheet</span><span style="color:#710">"</span></span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bootstrap.css</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;link</span> <span style="color:#b48">rel</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stylesheet</span><span style="color:#710">"</span></span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fonts.css</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  ...
<span style="color:#070">&lt;/head&gt;</span>
<span style="color:#070">&lt;body&gt;</span>
  ...
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">jquery.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bootstrap.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bootstrap-tooltip.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bootstrap-dropdown.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
<span style="color:#070">&lt;/body&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Com HTML Imports podemos fazer simplesmente:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;head&gt;</span>
  <span style="color:#070">&lt;link</span> <span style="color:#b48">rel</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">import</span><span style="color:#710">"</span></span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bootstrap.html</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
<span style="color:#070">&lt;/head&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O problema imediato de algo como Web Components é que qualquer pequena página pode ter rapidamente dezenas de Imports, cada import requerendo outros arquivos e potencialmente triplicando ou mais a quantidade de chamadas pela rede. Quando tivermos algo melhor como HTTP 2.0 ou outro processo de <a href="https://stackoverflow.com/questions/10480122/difference-between-http-pipeling-and-http-multiplexing-with-spdy">pipelining e multiplexing como com o protocolo SPDY</a> talvez não tenhamos que nos preocupar com isso, mas com o HTTP 1.1 que temos hoje precisamos ainda pensar em como economizar ao máximo chamadas de rede para pedir assets.</p>
<p>O mundo Rails trouxe pela primeira vez uma implementação de um processo completo e automatizado para concatenar e minificar stylesheets, javascript e sprites com o <a href="https://github.com/sstephenson/sprockets">Sprockets</a> que <a href="https://github.com/sstephenson">Sam Stephenson</a> - também criador do Prototype - iniciou em fevereiro de 2009 (obviamente os componentes que podem ser usados pelo Sprockets, como compressor, já existiam). Finalmente o Sprockets foi adicionado ao Rails 3.1 lançado em Agosto de 2011 como <a href="https://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">"Asset Pipeline"</a>.</p>
<p>Hoje em dia o Sprockets continua sendo uma das opções mais completas e outros frameworks correram para criar suas próprias versões, como o <a href="https://github.com/d-i/half-pipe">"connect-assets"</a> para Node.js, diversas receitas para Grunt e <a href="https://blog.carbonfive.com/2014/05/05/roll-your-own-asset-pipeline-with-gulp/">Gulp</a>) e opções para <a href="https://grails.org/plugin/asset-pipeline">Grails</a>, <a href="https://getcassette.net/">Cassette/ASP.NET MVC</a>, <a href="https://github.com/cyberdelia/django-pipeline">Pipeline Django</a>.</p>
<p>No mundo de Web Components foi imediatamente criado o projeto <a href="https://www.polymer-project.org/articles/concatenating-web-components.html">Vulcanize</a> ou no caso do mundo Rails podemos adicionar o processo ao próprio Sprockets com o projeto <a href="https://www.akitaonrails.com/2014/06/29/usando-polymer-com-rails">Emcee</a>, que foi o tema do meu post anterior. A idéia é pegar os HTML imports e concatená-los num único arquivo, incluindo tornar os links para stylesheets e javascripts externos como trechos inline num único HTML. Nem o Vulcanize e nem o Emcee atualmente minificam seus conteúdos, no entanto.</p>
<p>Note que imports é apenas uma parte do problema. Nem vamos entrar no problema de gerenciamento de versões (problema que projetos como Bower, NPM, Bundler no Ruby, PHP Composer, NuGet, Gradle, Pip, etc foram criados para resolver). O que acontece com componentes que dependem de versões específicas de outro componente? E bibliotecas internas como JQuery que um componente pode precisar? Ainda não sei o que acontece nesses casos.</p>
<h2>Web Components é uma "Revolução"?</h2>
<p>Tudo isso dito, vamos revisar:</p>
<ul>
  <li>Podemos criar conjuntos de tags isolados com Shadow DOM, com seus próprios estilos e comportamentos que não vazam e não automaticamente herdam estilos e comportamentos do DOM principal, a técnica é usar Shadow DOM (ou uma das formas antigas com Cleanslate, criação de elementos com Javascript, IFrame)</li>
  <li>Podemos definir trechos inertes de HTML que podem ser instanciados via Javascript para dentro do DOM. Com projetos como TemplateBinding recuperamos algo como HTMLBars e podemos mesclar dados com o template. A técnica é usar HTML template e Polymer (ou uma das formas antigas com Mustache, Handlebars, HTMLBars).</li>
  <li>Uma vez definido nosso "widget" ou "componente", podemos encapsulá-lo dentro de uma embalagem mais amigável usando Custom Elements (ou uma das formas antigas como plugins de JQuery fazem com Javascript para encapsular).</li>
  <li>E uma vez montado o Widget/Componente podemos empacotar tudo num único HTML Import para podermos resusar facilmente dentro de outros HTML (em vez da forma antiga de declarar manualmente os arquivos de dependência)</li>
</ul>
<p>Vocês devem ter notado que do ponto de vista de um desenvolvedor que apenas consome tais componentes/widgets, o processo em si é uma melhoria mas não é tão diferente quanto utilizar plugins de JQuery. De fato é uma passo adiante, oficializando o que antes era "gambiarra" em alguma coisa um pouco melhor (Custom Elements em vez de Javascript, Shadow DOM em vez de IFrame, HTML Template em vez de string em tag Script).</p>
<p>E aqui vem o maior desafio ao conjunto de tecnologias de Web Components: ele é definitivamente melhor. Só que não é disruptivo. Ao usuário final, o que ele "vê" e "interage" numa página web no navegador será exatamente idêntico. Significa que o usuário final tem muito pouco a se beneficiar da tecnologia. Portanto ele não é o público-alvo.</p>
<p>O público-alvo é o desenvolvedor front-end que, em vez de buscar um plugin JQuery - por exemplo - vai buscar um Web Component e a forma de utilizá-los não será muito diferente. Como ele não tem a motivação de melhorar muita coisa a seu público-alvo, ele tem muito pouco incentivo para mudar sua forma de trabalho.</p>
<p>O raciocínio é simples: quero colocar um Carrossel na minha página. Existem centenas, <a href="https://www.jssor.com/">Jssor Slider</a>, <a href="https://sorgalla.com/jcarousel/">jCarousel</a>, <a href="https://kenwheeler.github.io/slick/">Slick - the last carousel you'll ever need</a>. E para Web Components? Pelo menos no momento deste artigo só encontrei o <a href="https://github.com/addyosmani/polymer-ui-carousel">Polymer-ui-carousel</a>, que não chega aos pés dos antecessores. Qual você acha que o desenvolvedor front-end vai escolher?</p>
<p>Existem dois repositórios de componentes públicos (aliás, não entendi porque existem dois, um projeto como esse não ganha nada nascendo já fragmentado): o <a href="https://component.kitchen/">Component Kitchen</a> com cerca de 276 componentes e o <a href="https://customelements.io/">Custom Elements</a> com 327 componentes. Como todo repositório inicial, a maioria deles não é de grande serventia. São mais demonstrações e provas de conceito. Sinceramente, alguém se dar ao trabalho para fazer um componente de Pokémon tem que ser só um tech-demo. É inútil. E você pode contar com coisas redundantes e/ou desnecessárias como botões de Facebook, gravatar, botão de Github, coisas que um <a href="https://www.addthis.com/">AddThis</a> já tem resolvido. Claro, não quero ser injusto e dizer que Web Components não tem utilidade só porque a primeira geração de componentes não é interessante. Essas coisas levam tempo para amadurecer, como qualquer tecnologia.</p>
<p>Para que a estratégia funcione ou a tecnologia em si é <string>disruptiva</string> - o que acabamos de ver que não é, é apenas <strong>evolutiva</strong> -, ou é necessário um pacote completo para ser candidato a <a href="https://en.wikipedia.org/wiki/Killer_application">"killer-app"</a>. Voltamos ao que disse antes sobre uma solução procurando um problema. Sem um verdadeiro killer-app-blockbuster é muito difícil conseguir tração e coesão de um ecossistema. No caso do Ruby isso foi o Rails. No caso do Go parece que é o Docker. No caso do Node foi o halo-effect do Google Chrome evoluindo o V8.</p>
<p>Para isso o Google criou o <a href="https://www.polymer-project.org/components/paper-elements/demo.html#core-toolbar">Polymer/Paper</a> que define um conjunto coeso e visualmente integrado (via filosofia gráfica e interativa do <a href="https://www.google.com/design/">Material Design</a> que, assumindo que "pegue", também tem a vantagem de dar ao usuário final um "eye-candy" que justifique sua adoção). É uma proposição "tudo ou nada", embora você possa pegar pedaços dela, a intenção é fazer aplicações/sites usando inteiramente o Polymer.</p>
<p>O projeto <a href="https://www.polymer-project.org/">Polymer</a> é ambicioso e somente uma corporação como o Google poderia fazer algo assim tão rápido (dado que metade das especificações de tecnologia de Web Components como HTML Imports e HTML template são deste ano de 2014). Ao contrário do que deveria parecer, a arquitetura não é simples e com o pouco suporte de navegadores a única estratégia é criar Polyfills, implementações ("quasi"-completas) para tudo que navegadores "legados" mas que muita gente usa como IE abaixo de 10, Safari e Mobile Safari. Para isso serve o <a href="https://www.polymer-project.org/docs/start/platform.html">Polymer/Platform</a>.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/413/polymer-architecture.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/413/polymer-architecture.png 2x" alt="Arquitetura do Polymer"></p>
<p>Só que já passamos do ponto de somente usar plugins JQuery, agora migramos para a era dos one-page-apps via Javascript que consome endpoints REST que retornam JSON. Estamos falando somente do ponto de vista de componentes, mas uma aplicação é maior do que isso. Para quem vem do mundo ASP.NET MVC, Rails, Django, falamos muito sobre o conceito "Web MVC" (Model-View-Controller) ou mais corretamente, <a href="https://en.wikipedia.org/wiki/Model_2">MVC Model-2</a> da Sun, definido para J2EE.</p>
<p>Muitos nem sabem que usam outro modelo, o <a href="https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93presenter">MVP</a> (Model-View-Presenter) presente em ASP.NET (antigo), Window.Forms, <a href="https://www.gwtproject.org/?csw=1">GWT</a> (Google Web Toolkit, lembram? Também do Google!). E, finalmente, também da Microsoft chegamos ao <a href="https://en.wikipedia.org/wiki/Model_View_ViewModel">MVVM</a> (Model View View Model), uma evolução de MVP com MVC2, mais conhecido pelos seus conceitos de Data Binding 2-way de elementos do DOM com models puxados via Javascript. Agora temos a categoria que vocês já devem ter conhecido com <a href="https://knockoutjs.com/">Knockout.js</a>, <a href="https://angularjs.org/">Angular.js</a>, <a href="https://emberjs.com/">Ember</a>. Estamos falando de mais do que o jeito MVP de arrastar componentes a um canvas e adicionar eventos de callback, mas um framework completo que lida com Models, Views, Rotas.</p>
<p>O Yehuda Katz escreveu sobre <a href="https://gist.github.com/wycats/9144666b0c606d1838be">integrar o Ember com Web Components</a> em Maio e ele explicita muitos detalhes que vale a pena ler a respeito. Segundo esta <a href="https://groups.google.com/forum/#!msg/polymer-dev/4RSYaKmbtEk/uYnY3900wpIJ">thread no Google Groups</a>, parece que o projeto Angular 2.0 deve também se integrar com Web Components e Polymer. Quando estes projetos e outros frameworks se unirem ao esforço Polymer provavelmente vamos ver o real valor dos Web Components.</p>
<p>Polymer é o projeto principal. Web Components é o conjunto de mecanismos, o meio para atingir esse objetivo. E é um problema clássico de ovo e galinha: os navegadores diferentes de Chrome precisam se equiparar e seguir a vontade do Google. Os polyfills, via Polymer/Platform e <a href="https://www.x-tags.org/blog">Mozilla X-Tag</a> vão suprir o que falta (Mutation Observers, Shadow DOM, etc) como o JQuery fez no passado. Mas para os navegadores tracionarem nessa direção os desenvolvedores precisam entrar no barco, e para isso somente um pacote completo como Polymer/Paper e, se possível, aliado a frameworks como Ember e Angular podem fazer isso acontecer, e não pequenos componentes-demonstração.</p>
<h2>A História se Repete</h2>
<p>Já vimos essa história acontecer antes. Durante o <a href="https://en.wikipedia.org/wiki/Browser_wars">Browser Wars</a> muitos apenas vão se lembrar que a Microsoft conspirou ativamente para destruir a Netscape, culminando no processo que quase quebrou a Microsoft em 3 no ano 2000 e a consequência final que foi a sobra do amaldiçoado Internet Explorer 6 que, apesar de ter sido um excelente navegador em sua era, ele não deveria nunca ter durado mais de uma década em uso.</p>
<p>Muitos talvez não lembrem que isso também gerou muitas novas tecnologias, para listar algumas:</p>
<ul>
  <li>O Internet Explorer 3.0 foi o primeiro navegador a implementar o CSS 1.</li>
  <li>O Internet Explorer 4.0 foi quem expôs o DOM e criou o DHTML, Dynamic HTML, com Dynamic Styling e manipulação de elementos do DOM via Javascript</li>
  <li>O Internet Explorer 5.0 foi quem trouxe a semente do Ajax com o componente proprietário XMLHTTP e a técnica de buscar conteúdo de forma assíncrona com iframes usada no Outlook Web Access, dando origem ao XMLHttpRequest</li>
</ul>
<p>O período negro pós-2000 da Microsoft culminou no fracasso do Windows Vista e consequente sobrevida à la The Walking Dead tanto do Windows XP quanto do IE 6. O Google pegou o bastão de onde a Microsoft largou. O Core Business do Google é o AdWords. Controlar as plataformas Web faz parte da estratégia e o navegador continua sendo importante, porque ele é o novo sistema operacional desta geração, seja desktop ou mobile. Esqueçam Windows vs OS X vs GNU/Linux.</p>
<p>Outra tecnologia Microsoft que foi esquecida foi a primeira verdadeira tentativa de componentizar a Web. Foi com <a href="https://www.w3.org/TR/NOTE-HTMLComponents">HTML Components</a> do fim de 1998. Nessa época ainda estávamos tentando dominar drag-and-drop de elementos com DHTML e começando a brincar com as possibilidades de fazer requisições sem precisar recarregar a página.</p>
<p>Se olhar esta página de <a href="https://bit.ly/1jV3VpJ">APIs Legadas</a> da Microsoft teremos:</p>
<ul>
  <li>Legacy DOM - substituída, claro, pelo DOM mais moderno</li>
  <li>IE Architecture/Active X - substituído por Silverlight, Flash, ainda Applets e widgets</li>
  <li>Browser Extensions - ainda temos extensions mas nenhum padrão</li>
  <li>DHTML Behaviors e DHTML Data Binding - são os novos Web Components</li>
  <li>Filters and Transitions - que até hoje temos browser-specific com modificadores como -moz ou -webkit, CSS 3</li>
  <li>Vector Markup Language (VML) - que é o atual SVG e HTML 5 Canvas</li>
</ul>
<p>Não estou querendo dizer que é tudo mérito da Microsoft. A intenção é apenas explicar - para quem começou a usar a Internet na era pós-Browser Wars e pós-<a href="https://en.wikipedia.org/wiki/Dot-com_bubble">Crash das Dot-coms</a> que Web Components não surgiu do nada, ela é o próximo passo lógico da evolução dos browsers e arquitetura Web.</p>
<p>Para o próprio Google essa não é a primeira vez. A primeira vez foi com <a href="https://en.wikipedia.org/wiki/Google_Web_Toolkit">GWT</a> (Google Web Toolkit), que nasceu em 2006. Esse foi o auge dos frameworks MVC back-end que facilitavam desenvolvimento de aplicações Web usando Ajax. Foi a era pós-J2EE onde surgiram Rails, Django e outros Rails/Django-like como CakePHP, Grails.</p>
<p>Depois veio a era back-end assíncrono, desenterrando o problema <a href="https://www.kegel.com/c10k.html">C10K de 1999 de Dan Kegel</a>, use case de Web Sockets (chat, APIs) que começa com Scala, vai para Node.js, chega em GoLang, Elixir. Novamente, não veio do nada, foi o próximo passo evolutivo depois do próprio Erlang, Twisted, Tornado, Java NIO/Netty, etc.</p>
<p>Em paralelo o Google investiu no Chrome e para isso precisou investir em Javascript e tornar o V8 algo realmente usável. Milhares de homens-hora e milhões de dólares depois, temos uma engine realmente performática. Com isso o mundo Javascript cresceu exponencialmente. Uma tecnologia que já se imaginava dominada na década de 90 ganhou nova roupagem e uma segunda chance. Com isso a arquitetura MVC2 evoluiu para um híbrido, com frameworks MVVM no client-side.</p>
<p>Portanto é natural evoluir do mindset GWT para Angular.js e eventualmente para Web Components/Polymer. E é onde estamos agora. Note que estamos sempre circulando os conceitos de MVC-clássico, MVC Model-2, MVP e agora MVVM, todos patterns originados do lendário MVC de <a href="https://heim.ifi.uio.no/~trygver/themes/mvc/mvc-index.html">Trygve Reenskaug</a> do Smalltalk-80. Lembrando que já experimentamos programação orientada a componentes antes: foi a década de 90, que imaginou uma revolução ao usar componentes reusáveis para tornar o processo de programação meramente um jogo de arrastar blocos. Isso ficou conhecido como <a href="https://en.wikipedia.org/wiki/Rapid_application_development">RAD</a> (Rapid Application Development), que deu origem a toolkits e IDEs. Foi o conceito que deu origem a PowerBuilder, Visual Basic, Delphi, Swing. E a evolução na direção de ferramentas CASE (Computer Aided Software Engineering). Achávamos que poderíamos criar diagramas (UML) e as ferramentas gerariam o código-fonte para nós. Já ouviu falar disso? Pois é, não deu muito certo. O Visual Studio de hoje <a href="https://msdn.microsoft.com/en-us/library/ff657795.aspx">ainda tem suporte</a> a isso (yikes).</p>
<p>A diferença são as ondas da moda: na década de 90 ainda estávamos definindo o que era possível e, pelo bem ou pelo mal, o que a Microsoft inventou realmente foi revolucionário porque não havia precedente. A era pré-Bolha trouxe o MVC2 para o desenvolvimento Web com Web Objects e J2EE. O advento do Ajax e aplicações dinâmicas trouxe de GWT a Rails. E agora a era da Renascença do Javascript trouxe o MVVM e Web Components.</p>
<p>Não sei o que vem depois daqui, mas depois de organizar a informação histórica espero que mais alguém tenha insights do que vem pela frente. O que acham que Web Components realmente pode trazer que já não vimos com GWT e anteriores?</p>
<p></p>
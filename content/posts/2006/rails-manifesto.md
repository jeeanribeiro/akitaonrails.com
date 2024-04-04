---
title: "Rails Manifesto"
date: "2006-04-11T15:09:00.000Z"
tags: ["rails", "pitch"]
years: "2006"
---

<p></p>
<p>Um desenvolvedor, certa vez, definiu Ruby como duas partes de Perl, uma parte de Python e outra parte de Smalltalk.</p>
<p>Quando <a href="http://www.artima.com/intv/ruby.html">Yukihiro Matsumoto</a> criou o Ruby como substituto ao Perl e ao Python, com inspiração no Smalltalk, em 1993, mal poderia imaginar a dimensão que sua linguagem poderia alcançar fora do Japão.</p>
<p>Mas em meados de 2004, quando <a href="http://www.loudthinking.com/about.html">David Heinemeier Hansson</a> liberou seu framework “Rails” a partir dos produtos que desenvolveu na sua empresa 37signals, acredito que ele já sabia onde queria chegar.</p>
<p></p>
<p></p>
<p>Ruby on Rails é um produto do atual movimento <a href="https://www.blogger.com/post-create.g?blogID=25846821">Web 2.0</a>. Garanto que a maioria ainda não entendeu, mas estamos no ponto de curva de uma nova geração.</p>
<p>É um fato: a Sun errou com J2EE. Uma implementação falha de um conjunto de requerimentos errôneos. Quem acompanhou esta história vai se lembrar do pesadelo que são <span class="caps">EJB</span> 1 e 2, a demora e o suporte ruim a Web Services, mais demora na promessa do <span class="caps">EJB</span> 3 e assim por diante.</p>
<p>Estamos perdendo muito tempo para desenvolver coisas simples. Web Applications não deveriam ser complexos. A Web foi criada para ser simples. Mas J2EE foi criado para resolver 100% dos problemas “Enterprise”. E todos sabemos que ao se tentar consertar tudo acaba-se não consertando nada direito.</p>
<p>Com Rails, finalmente nos tornamos compatíveis com o espírito dinâmico da Web 2.0. Web Services, Ajax nada disso é difícil. E o tradicional: camadas de persistência, controle de versão, <span class="caps">MVC</span>, templates, caching, segurança tornam-se o que sempre deveriam ser: triviais.</p>
<p>Quando alguém quer mudar os requerimentos, torcemos o nariz: é preciso muito esforço para implementar modificações. Afinal, inventamos toda uma família de parafernálias, como <span class="caps">UML</span>, justamente para engessar e dificultar toda e qualquer mudança. Convenhamos: <span class="caps">UML</span> foi criado para consultorias cobrarem mais caro por seus trabalhos.</p>
<p>Com Rails, elas são bem vindas. Rails é a primeira plataforma realmente compatível com o pensamento Agile defendido no <a href="https://agilemanifesto.org/principles.html">Agile Manifesto</a>. J2EE tornou o termo famoso, mas essa promessa nunca chegou para ela.</p>
<p>Para começar meus artigos, acho que é importante deixar claro dois conceitos que o Rails tornou famoso:</p>
<ul>
  <li><em><span class="caps">DRY</span> – Don’t Repeat Yourself</em>. O Rails possui suporte nativo e simples a Helpers, Templates, Engines, Plugins, tudo muito bem integrado de tal maneira que você possa se tornar produtivo sem ser sujo. Copy e paste é ruim, temos que parar com isso e Rails nos dá as ferramentas para isso.</li>
</ul>
<ul>
  <li><em>Convention over Configuration</em>. Em vez de termos que editar dezenas de arquivos <span class="caps">XML</span>, properties, a arquitetura do Rails prefere usar convenções: coloque seu controller com o nome correto, no diretório correto e ele será localizado. Coloque seu model no lugar correto ele será encontrado.</li>
</ul>
<p>Dois conceitos simples, implementados por todo o framework, e que fazem toda a diferença.</p>
<p>E não se deixem levar pelos preconceitos. Já ouvi gente dizendo: <em>“Ruby é uma linguagem não-compilada, portanto deve ser lenta”</em>, <em>“tudo que o Ruby faz posso fazer em Java”</em>, <em>“Ruby não escala bem”</em>, <em>“não preciso aprender outra linguagem”</em>, <em>“Java nunca vai sumir”</em>.</p>
<p>Substitua <em>“Ruby”</em> por <em>“Java”</em> e <em>“Java”</em> por <em>“C”</em> – ou outra linguagem. Parece que estamos ouvindo exatamente as mesmas coisas que 10 anos atrás, quando o Java era uma novidade.</p>
<p>Parece que existe uma tendência em primeiro criticarmos para só depois olharmos para as partes boas e, quando fazemos isso, notamos que chegamos tarde demais à festa.</p>
<p>Que tal fazer diferente desta vez, para variar?</p>
<p></p>
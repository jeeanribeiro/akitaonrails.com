---
title: "Entrevista com Yukihiro Matsumoto: parte IV"
date: "2006-11-22T07:22:00.000Z"
tags: ["matz", "translation"]
years: "2006"
---

<p></p>
<p>Finalmente, chegamos à ultima parte da entrevista de Yukihiro Matsumoto à Artima.com.</p>
<p><strong>Sumário</strong></p>
<blockquote>Yukihiro Matsumoto, o criador da linguagem Ruby conversa com Bill Venners sobre se tornar um programador melhor através da leitura de código, aprendizado de linguagens, focar nos fundamentos, ser preguiçoso e considerar interfaces.</blockquote>
<p></p>
<p></p>
<p>Yukihiro Matsumoto, ou “Matz”, como é conhecido online, é o criador da linguagem de programação Ruby. Ruby é uma linguagem orientada-a-objeto que serve para escrever tanto scripts do dia a dia quanto aplicações de grande escala. Matz começou a trabalhar no Ruby em 1993, porque queria uma linguagem que o fizesse produtivo e ao mesmo tempo fosse divertido de usar. Inicialmente popular no Japão, Ruby tem encontrado seu caminho no coração dos programadores por todo o mundo.</p>
<p>Em 24 de setembro de 2003, Bill Venners se encontrou com Yukihiro Matsumoto na conferência <span class="caps">JAOO</span> em Aarhus, Dinamarca. Nessa entrevista, publicada na Artima.com, Yukihiro Matsumoto discute a filosofia do design do Ruby, suas funcionalidades e como se tornar um programador melhor.</p>
<ol>
  <li>Na <a href="/articles/2006/10/09/entrevista-com-yukihiro-matsumoto-parte-i">Parte I: A Filosofia de Ruby</a>, Matz filosofa sobre imperfeições de design e os perigos da ortogonalidade, garantindo liberdade com direção, o princípio da menor surpresa e a importância do ser humano nas conquistas da computação.</li>
  <li>Na <a href="/articles/2006/10/14/entrevista-com-yukihiro-matsumoto-parte-ii">Parte II: Produtividade Dinâmica com Ruby</a>, Matz discute interfaces mórficas, usando mix-ins e benefícios de produtividade em ser conciso com Ruby.</li>
  <li>Na <a href="/articles/2006/11/07/entrevista-com-yukihiro-matsumoto-parte-iii">Parte <span class="caps">III</span>: Blocos e Fechamentos em Ruby</a>, Matz discute dois tipos de funções anônimas em Ruby, blocos e fechamentos.</li>
  <li>Nesta última parte, Matz fala sobre se tornar um programador melhor através da leitura de código, aprendizado de linguagens, focar nos fundamentos, ser preguiçoso e considerar interfaces.</li>
</ol>
<h4>Lendo Código Fonte</h4>
<p><strong>Bill Venners</strong>: Em uma entrevista com <em><span class="caps">CIPS</span> Connection</em>, você disse, “Eu leio um monte de código fonte de software open source, por exemplo, Perl, Python e muitos sabores de interpretadores Lisp. Eu sei que precisei disso para escrever Ruby”. Que benefícios você imagina que programadores podem derivar por ler códigos fonte?</p>
<p><strong>Yukihiro Matsumoto</strong>: Programadores podem ter muitos benefícios lendo código fonte. Você simplesmente não tem como <em>dizer</em> às pessoas como se tornar bons programadores. Podemos explicar alguns princípios de boa programação. Podemos descrever algumas boas experiências de design. Mas não podemos lhes dar conhecimento real de como ser um bom programador. Escrever código pode certamente ajudar pessoas a melhorarem, mas ler código fonte é muito melhor.</p>
<p><strong>Bill Venners</strong>: Por que?</p>
<p><strong>Yukihiro Matsumoto</strong>: Porque ser um bom programador é uma questão de experiência. Código é uma expressão de pensamentos, atitudes e idéias do programador. Lendo código fonte, não somente se entende que tarefa em particular o programador estava tentando resolver e como foi resolvido, mas também podemos compreender como ele estava pensando. Essa é a razão porque ler código torna os programadores melhores.</p>
<p>E além disso, se quiser saber como resolver alguma coisa em código, podemos abrir um livro de ciência da computação. O livro explicará o algoritmo. Mas se quiser entender esse algoritmo muito rapidamente, ler o código é o melhor caminho. Mais do que isso, podemos executar o código que implementa esse algoritmo. Podemos usar um debugger para ver o código enquanto ele performa o algoritmo. E isso é muito melhor do que apenas ler um livro.</p>
<h4>Aprendizado de Linguagens</h4>
<p><strong>Bill Venners</strong>: Na entrevista para a <em><span class="caps">CIPS</span> Connection</em>, você deu dez dicas para programadores. Uma delas foi “Aprenda mais do que uma linguagem de programação, preferencialmente muitos estilos diferentes, como scripting, orientação-a-objetos, funcional, lógica, etc”. Qual o benefício de aprender múltiplas linguagens de programação?</p>
<p><strong>Yukihiro Matsumoto</strong>: Toda linguagem ou sistema tem sua própria cultura. No pano de fundo de toa linguagem ou sistema existem algumas idéias centrais. A maioria dessas idéias são boas, mas são diferentes. Aprendendo muitas linguagens e sistemas, estamos nos expondo a idéias diferentes – e isso melhora nosso ponto de vista.</p>
<p>Se você não conhece Prolog, por exemplo, pode não conhecer o poder de programação dirigida a objetivos – programar descrevendo o problema a ser resolvido através da especificação de regras a serem aplicadas. Esse é um conceito muito interessante. É uma maneira bem diferente de pensar. E se não conhecer Prolog, ou a lógica predicativa, é muito difícil descobrir essa maneira de pensar sozinho. Conhecer outros sistemas e paradigmas expande o mundo dentro de nossos cérebros. Por isso recomendo aprender múltiplas linguagens.</p>
<h4>Foco nos Fundamentos</h4>
<p><strong>Bill Venners</strong>: Você também disse nas suas dez melhores dicas: “Não foque demais em ferramentas. Ferramentas mudam. Algoritmos e fundamentos básicos não”. O que quis dizer com isso?</p>
<p><strong>Yukihiro Matsumoto</strong>: Isso foi parcialmente sobre focar nos humanos em vez de máquinas. Humanos mudam muito lentamente, mas sistemas mudam rapidamente. 100 anos atrás, as pessoas eram basicamente as mesmas que são hoje. 100 anos atrás não tínhamos computadores. 50 anos atrás tínhamos computadores, mas eram muito primitivos. 20 anos no futuro, não consigo imaginar como serão os computadores. Mas posso imaginar como pessoas de daqui a 20 anos pensarão.</p>
<p>Outro exemplo é matemática. A Matemática tem uma história bem longa. É uma ciência muito madura, mas Ciência da Computação não é. Por isso é uma boa idéia pegar idéias da Matemática.</p>
<p>Ferramentas mudam muito rapidamente com o passar do tempo. Se focarmos demais nas ferramentas de hoje, os esforços trarão apenas retornos de curtíssimo-prazo. Se quisermos benefícios que irão durar, precisamos nos focar mais nos fundamentos. Focar em matemática e psicologia humana. Focar em ciências estabelecidas e maneiras estabelecidas de pensar.</p>
<h4>Sendo Preguiçoso</h4>
<p><strong>Bill Venners</strong>: Você também mencionou nas suas dicas: “Seja preguiçoso. Máquinas devem servir seres humanos. Normalmente programadores servem as máquinas inconscientemente. Faça as máquinas o servirem. Faça todo o necessário para permitir que você seja preguiçoso”. Por que eu deveria tentar ser preguiçoso?</p>
<p><strong>Yukihiro Matsumoto</strong>: Você quer ser preguiçoso. Você quer fazer qualquer coisa para reduzir seu trabalho. Eu trabalho duro para reduzir meu trabalho, para ser preguiçoso.</p>
<p><strong>Bill Venners</strong>: Acredito nisso.</p>
<p><strong>Yukihiro Matsumoto</strong>: Eu trabalho muito para ser preguiçoso.</p>
<h4>Considerando Interfaces</h4>
<p><strong>Bill Venners</strong>: Nas suas dicas você também mencionou: “Seja bom com os outros. Considere a interface primeiro: homem-a-homem, homem-a-máquina e máquina-a-máquina. E novamente lembre-se que o fator humano é importante”. O que você quer dizer com “considere a interface primeiro”?</p>
<p><strong>Yukihiro Matsumoto</strong>: Interface é tudo o que vemos como usuários. Se meu computador está fazendo coisas muito complexas por dentro, mas essa complexidade não se mostra na superfície, eu não ligo. Não ligo se o comutador trabalha muito internamente ou não. Apenas quero os resultados corretos apresentados de uma boa maneira. Então isso significa que a interface é tudo, para um usuário normal de computador, pelo menos, quando estão usando um computador. É por isso que precisamos focar na interface.</p>
<p>Algumas pessoas de software – como de previsão do tempo, os devoradores de números – sentem que o interior importa mais, mas eles são um campo vem limitado de ciência da computação. A maioria dos programadores precisa focar na superfície, na interface, porque essa é a coisa mais importante.</p>
<p><strong>Bill Venners</strong>: Você também mencionou interfaces máquina-a-máquina, então você está falando apenas de interfaces para usuários ou também para máquinas?</p>
<p><strong>Yukihiro Matsumoto</strong>: Não é apenas interfaces de usuários. Quando máquinas estão falando umas com as outras via protocolos, eles não se importam em como o outro foi implementado por dentro. A parte importante é a saída sendo passado corretamente através do protocolo correto. Isso é o que importa.</p>
<p>Se você tiver uma boa interface no seu sistema, e um orçamento de dinheiro e tempo, você pode trabalhar no seu sistema. Se seu sistema tem bugs ou é lento demais, pode melhorá-lo. Mas se seu sistema tiver uma interface ruim, basicamente não temos nada. Não vai interessar se é o trabalho do melhor dos melhores programadores por dentro. Se seu sistema tem uma interface ruim, ninguém irá usá-lo. Então a interface ou superfície do sistema, seja para usuários ou para máquinas, é muito importante.</p>
<p></p>
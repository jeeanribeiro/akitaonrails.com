---
title: "[Tradução] O que faz um bom programador?"
date: "2009-07-23T13:35:00.000Z"
tags: ["career", "translation", "carreira"]
years: "2009"
---

<p></p>
<p>Muita gente já me perguntou como se tornar um bom programador. Normalmente estão mais preocupados em qual linguagem aprender, qual curso fazer, quais livros técnicos ler. Porém, assim como os autores desses dois artigos que vou traduzir, eu diria que existem qualidades mais importantes a se levar em conta.</p>
<p>O primeiro artigo é o <a href="http://www.techfounder.net/2009/07/22/what-makes-a-good-programmer/">What makes a good programmer?</a></p>
<p></p>
<p></p>
<h3>Um pensador analítico</h3>
<p>Programadores precisam ser solucionadores de problemas. O processo de programação requer que nós sistematicamente quebremos problemas complicados, planejemos e implementemos solução e encontremos/eliminemos pequenas inconsistências no código (bugs).</p>
<p>Pensamento analítico também se manifesta na habilidade de seguir e entender lógicas complicadas através de segmentos disparates de código. Isso nos permite alcançar conceitos abstratos como metodologias de Orientação a Objetos e design patterns e implementemos na prática.</p>
<h3>Tem suas prioridades claras</h3>
<p>Se eu lhe pedisse para ordenar os ítens seguintes por prioridade, como você os ordenaria?</p>
<ul>
  <li>Segurança</li>
  <li>Mantenabilidade</li>
  <li>Usabilidade</li>
  <li>Performance</li>
  <li>quantidade de <span class="caps">LOC</span> (lines of code – linhas de código)</li>
</ul>
<p>Pare um momento para pensar a respeito, e então considere:</p>
<ol>
  <li>Se você pegou <strong>quantidade de <span class="caps">LOC</span></strong> primeiro, você falhou completamente pelos meus critérios. De fato, otimização de <span class="caps">LOC</span> pode normalmente ir diretamente contra as outras métricas (como mantenabilidade). Uma contagem baixa de <span class="caps">LOC</span> nunca deve ser o objetivo, somente o resultado da aplicação cuidadosa de uma boa arquitetura.</li>
  <li>Se você pegou <strong>performance</strong> primeiro, você provavelmente é o cara que fica escrevendo artigos sobre porque se deveria usar loop <em>while</em> em vez de <em>for</em> já que ele foi alguns milissegundos mais rápido em seus benchmarks. Você pode sofrer com casos de otimização prematura.<br>
    <br>
    <blockquote>Nós devemos esquecer sobre pequenas ineficiências, digamos, cerca de 97% do tempo: otimização prematura é a raíz de todo mal. – <a href="https://en.wikipedia.org/wiki/Optimization_%28computer_science%29#When_to_optimize">Donald Knuth</a></blockquote>
    <p>Performance deve ser bom o suficiente para satisfazer os requerimentos da aplicação. Fora casos de armadilha bem conhecidos (cmo executar queries em cada interação de um loop longo), otimizações de performance devem ser deixados para o fim e mesmo assim devem ser feitas quando apropriado (medir … medir … medir … otimizar).</p>
    <p>A única exceção a isso é se você está primariamente desenvolvendo aplicações dependentes de performance (como drivers de baixo nível de sistema).</p>
  </li>
  <li><strong>Segurança</strong> está mais ou menos no meio. Dependendo da aplicação e modelo distribuído isso pode ser completamente inútil ou de missão crítica. Está na maior parte no meio, e portanto não pode ser o número 1.</li>
  <li><strong>Mantenabilidade</strong> é definitivamente um dos mais importantes atributos de uma aplicação de software. Alta mantenabilidade permite que você melhore outros atributos (como performance), <em>quando for necessário.</em><br>
    <br>
    Mantenabilidade é o fator mais importante para manter a produtividade em alta e os custos em baixa. Por um longo tempo eu acreditei fortemente que isso era <strong>o</strong> atributo mais importante de design de software. Entretanto …
  </li>
  <li>O atributo mais importante é <strong>usabilidade</strong>. No final, o valor de sua aplicação é o que se entrega ao usuário final.<br>
    <br>
    Devemos sempre lembrar – software não é escrito para servir seus desenvolvedores ou os sistemas em que roda. Eles são escritos para resolver problemas. Se esses problemas não são resolvidos, então o projeto é um fracasso.<br>
    <br>
    Eu escrevi usabilidade aqui como um termo mais geral do que somente efetividade de Interface de Usuário/UX. Mesmo uma aplicação de linha de comando ou um serviço que roda em background tem seus fatores de usabilidade no sentido de quão bem ele responde a uma necessidade específica.
  </li>
</ol>
<h3>Termina as coisas</h3>
<blockquote>Em princípio, você está procurando por pessoas que:<br>
  <ul><br>
    <li>são espertas e,</li>
    <li>que terminam as coisas. </li>
  </ul>
  <p><span style="text-align: right"><a href="https://www.joelonsoftware.com/articles/GuerrillaInterviewing3.html">Joel Spolsky</a></span></p>
</blockquote>
<p></p>
<p>Talvez a coisa mais importante em um desenvolvedor. Você pode ser perfeito em todos os atributos anteriores e ainda ser um programador medíocre se você <strong>não consegue terminar as coisas.</strong> Um desenvolvedor mediano mas produtivo poderia facilmente substituir vários desenvolvedores altamente talentosos mas que se movem devagar, dependendo de suas responsabilidades.</p>
<p>No fim do dia você definitivamente quer desenvolvedores altamente produtivos mais do que aqueles que são grandes em teoria mas não na prática.</p>
<h3>Faz mais do que “apenas suficiente”</h3>
<p>Terminar as coisas é importante. Terminar as coisas “do jeito certo” é ainda mais importante.</p>
<p>Pagar constante seu débito técnico é crucial – se você continuar acumulando débito fazendo “gambiarras” de correções rápidas que funcionam mas não são bons de mantenabilidade, você apenas está criando a aparência de progresso. Na realidade, o custo de se livrar do grande débito técnico poderia se tornar proibitivo antes de você perceber.</p>
<p>Gastar um tempo para constantemente refatorar código para uma forma com mais mantenabilidade é a melhor forma de prevenir a espiral que leva um projeto a desaparecer.</p>
<h3>Responsável</h3>
<p>Uma pessoa poderia ser um programador capaz apenas em habilidades técnicas, entretanto se ele não assume seus próprios erros e não respeita prazos ele poderia se tornar um risco muito rapidamente.</p>
<p>Responsabilidade significa saber onde deixar seu ego para trás para o bem do projeto. Nós normalmente desenvolvemos grandes egos à medida que nos consideramos experts em muitas coisas. Colocar o projeto primeiro é um sinal de um bom desenvolvedor.</p>
<h3>Boas relações humanas</h3>
<p>Outra coisa importante, essa também se aplica a programadores. Existe um estereótipo que programadores são criaturas reclusas, anti-sociais – programadores ainda são pessoas ;-)</p>
<p>Para ser parte de uma equipe ou lidar com clientes, um programador precisa ter habilidades sociais básicas. Rudez, arrogância, paciência curta – não tem espaço em um ambiente de trabalho profissional. Tudo que se precisa é uma maçã podre para arruinar o humor de todos.</p>
<h3>É isso</h3>
<p>Se você respondeu positivamente a tudo acima, você provavelmente é um bom programador.</p>
<p>Você deve notar que não mencionei paixão ou diversidade tecnológica como atributos qualificatórios. Resumindo, eu não acho que sejam muito relevantes para a qualidade de um programador.</p>
<p>Paixão é bom de se ter, entretanto já conheci muitos profissionais e desenvolvedores de alta qualidade que estavam satisfeitos de apenas ir ao trabalho profissionalmente, das 9 às 17 e então ir para casa e ter vidas significativas e completas com a família. Um programador pode ser definitivamente completamente profissional sem ser apaixonado sobre programação.</p>
<p>Diversidade tecnológica é outra coisa boa de se ter mas não é um pré-requisito – enquanto se estiver no controle das tecnologias com que trabalha, uma falta de diversidade não deveria afetá-lo tanto. Tomadores de decisão precisam estar bem atentos para todas as opções antes de começar um projeto, entretanto hoje em dia a escolha de tecnologias simplesmente não é tão importante.</p>
<p>Você pode conseguir bons resultados independente da linguagem de programação e banco de dados entre outras considerações. A maior consideração deve ser o tipo de habilidades disponíveis no seu pessoal.</p>
<h2>[Tradução] Por que Bons Programadores são Preguiçosos e Idiotas</h2>
<p><strong>Fonte:</strong> <a href="https://blogoscoped.com/archive/2005-08-24-n14.html">blogoscoped</a></p>
<p>Eu percebi, paradoxialmente o suficiente, que bons programadores precisam ser tanto <em>preguiçosos</em> quanto <em>idiotas.</em></p>
<p><strong>Preguiçosos</strong>, porque apenas programadores preguiçosos irão querer escrever os tipos de ferramentas que podem substituí-los no final. Preguiçosos, porque somente um programador preguiçoso vai evitar escrever código monótono e repetitivo – assim evitando redundância, o inimigo da mantenabilidade e flexibilidade de software. No mais, as ferramentas e processos que vêm disso, disparados pela <em>preguiça</em>, irão aumentar a produção.</p>
<p>Claro, essa é apenas meia verdade. para um programador preguiço para ser um bom programador, ele (ou ela) também devem ser extremamente <em>não-preguiçosos</em> quando é hora de aprender como ser <em>preguiçoso</em>, ou seja, quais ferramentas de software tornam seu trabalho mais fácil, quais técnicas evitam redundância, e como ele pode fazer seu trabalho ter mais mantenabilidade e ser facilmente refatorado.</p>
<p>Segundo (e vou elaborar mais sobre isso porque acho que esse conceito é menos conhecido que o primeiro) um bom programador precisar ser <strong>idiota.</strong> Por que? Porque se ele é esperto, e ele sabe que é esperto, ele vai:</p>
<ol>
  <li>parar de aprender</li>
  <li>parar de ser crítico a respeito do seu trabalho</li>
</ol>
<p>Ponto a) tornará mais difícil para ele tentar encontrar novas técnicas para permití-lo trabalhar mais rápido. Ponto b) tornará difícl a ele debugar seu próprio trabalho, e refatorá-lo. Na batalha interminável entre um programador e o compilador, é melhor para o programador desistir rápido e admitir que é sempre <em>ele</em> e nunca o compilador o culpado (a menos que seja codificação de caracteres, que é a parte que até mesmo compiladores erram.)</p>
<p>Mas existe um ponto mais crucial de porque bons programadores precisam ser idiotas. Isso porque para ele encontrar as melhores soluções a um problema, precisa manter uma mente aberta e pensar fora da caixa (ou melhor, conhecer seu <em>formato</em> real). De certa forma, isso leva à mentalidade de uma criança; incrivelmente criativa porque ele nunca ouviu “não” como resposta.</p>
<p>O direto oposto não seria muito construtivo; ser conhecedor dos parâmetros à mão e aceitá-los. Porque quem sabe quantos limites você acha que existem, na <em>real</em>? Quanto menos você souber, mais radical serão suas escolhas; melhores as ferramentas que você desenvolve, e melhor o produto que você desenvolve <em>com</em> elas.</p>
<p>Eu conheço do meu trabalho um bom programador, quando confrontado com um problemas da gerência, adotará essa mentalidade de ser <em>idiota</em>; ele começará a perguntar as questões mais simples e infantis. Porque ele não aceita os parâmetros sugeridos a ele que alguém <em>acha</em> que definem o problema. Aqui está uma típica conversa da terra perdida do desenvolvimento web:</p>
<ul>
  <li>“Desde ontem, nosso cliente não consegue ver o logotipo no web site.”</li>
  <li>“Ele reiniciou o browser?”</li>
  <li>“Sim.”</li>
  <li>“Ele reiniciou o computador?”</li>
  <li>“Sim.”</li>
  <li>“Ele limpou seu cache?”</li>
  <li>“Sim.”</li>
  <li>“Ele roda Internet Explorer 6?”</li>
  <li>“Sim.”</li>
  <li>“Ele tem certeza que não consegue ver?”</li>
  <li>“Sim.”</li>
  <li>“Ele olhou para o web site na tela?”</li>
  <li>“O que?”</li>
  <li>“Bem, ele pode ter impresso.”</li>
  <li>“Não, ele estava olhando para a tela.”</li>
  <li>“Ele também não viu outras imagens além do logo?”</li>
  <li>“O que? Bem, vou perguntar a ele.”</li>
</ul>
<p>Apenas para a argumentação (isso foi inteiramente hipotético) vamos dizer que o cliente de fato desligou as imagens do seu browser. Ou seu filho desligou. Seja qual for o caso, essa resposta não seria encontrada se você trabalhasse com um programador em modo<sup class="footnote" id="fnr1"><a href="#fn1">1</a></sup> “esperto”. Nenhuma das perguntas perguntadas pelo programador requerem qualquer habilidade de programação. Não, simplesmente porque o problema é tão estúpido, apenas estupidez pode resolvê-la.</p>
<blockquote><sup class="footnote" id="fnr1"><a href="#fn1">1</a></sup> alguns anos atrás, eu tive uma longa discussão no telefone sobre o web site ter quebrado desde minha última atualização … acabou que a pessoa desabilitou os stylesheets em seu browser. Na época eu teria suspeitado de tudo <strong>menos</strong> numa solução tão simples e fiquei escutando meia hora de reclamações sobre padrões de qualidade, etc. No final, a premissa que minha atualização foi culpada era apenas isso … uma premissa. Melhor você ouvir <strong>apenas os fatos</strong> se começar a debugar, e nunca no que as pessoas <strong>acham</strong> que pode ser a razão.</blockquote>
<p>De forma similar, quando um dos meus colegas programadores me pergunta: “Por que isso não está funcionando?” na maioria das vezes é porque ele está trabalhando no arquivo errado (ex. ele linkou na biblioteca 1, mas alterou na biblioteca 2, e sua revisão não aparece ou simplesmente não linkou na biblioteca.) Quando você pede ajuda a seu colega, particularmente sobre programação, você espera que ele saiba menos sobre o projeto … então ele faz perguntas estúpidas que você evitou perguntar a si mesmo de forma sub-consciente, porque você achava que sabia as respostas, quando de fato não sabia.</p>
<p>Existe outro lado nisso. A pessoa idiota-demais vai somente sair correndo e, sem pensar duas vezes, fazer algo errado. A pessoa esperta-demais vai se sentar e planejar algo certo, sem tomar nenhuma ação. Um programdor pragmático está mais ou menos no meio; ele sabe que tomar a decisão errada 1 vez em 10 não machuca os objetivos tão mal quanto 5 decisões certas de 10, e <em>não decidir nada</em> nas outras 5 vezes.</p>
<p>É como a história da centopéia. A centopéia era muito boa em andar com suas cem pernas. Ela nunca pensou em como conseguia andar. Até que um dia, quando um inseto preto grande perguntou a ela “Como você consegue <em>andar</em> com tantos pés? Não acha difícil coordenar seu ritmo?” O inseto grande preto já tinha ido embora, enquanto a centopéia ainda estava sentada, ponderando <em>como</em> ela conseguia andar, se perguntando e (pela primeira vez na vida) até mesmo se preocupando um pouco. Desse dia em diante, a centopéia não conseguia andar mais.</p>
<p>Então, melhor não pensar demais se quiser conquistar alguma coisa. E, claro, essa é somente meia verdade também …</p>
<p></p>
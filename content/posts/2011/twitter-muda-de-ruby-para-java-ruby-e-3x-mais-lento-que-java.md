---
title: "Twitter muda de Ruby para Java. Ruby é 3x mais lento que Java."
date: "2011-04-16T04:57:00.000Z"
tags: ["java", "scala", "fud"]
years: "2011"
---

<p></p>
<p>Estava esperando ter um tempinho para falar sobre isso. Se você presta atenção já deve ter visto posts de blog, tweets e tudo mais falando sobre um <a href="http://engineering.twitter.com/2011/04/twitter-search-is-now-3x-faster_1656.html">post recente</a> do próprio Twitter explicando sobre a migração dos seus front-ends feitos em Ruby on Rails para uma solução que eles mesmo fizeram, chamada Blender, que é construída com Java. Com isso eles reduziram o tempo de requisição de 800ms para 250ms e conseguiram fazer suas máquinas terem 10 vezes mais capacidade.</p>
<p>Este é o resumo que você vai ler em todas os canais de comunicação que noticiaram o ocorrido. E, claro, os mais atrevidos e sem noção não se inibiram de novamente dizer “Ruby é muito lento, por isso compensa usar Java mesmo”. Como faz algum tempo que não falo sobre o assunto, acho que vale a pena repetir. Sim, todos nós rubistas sabemos que Ruby é uma das linguagens mais lentas que existem em uso hoje. E nenhum de nós faz nenhum esforço para esconder esse fato. Isso não é novidade, nunca foi. E aí eu pergunto: <em>“e daí?”</em> E a resposta continua: <em>“oras, por isso mesmo não compensa usar Ruby e devemos todos continuar com Java, que é muitas vezes mais rápido, afinal se o Twitter disse é porque deve ser verdade.”</em></p>
<p></p>
<p></p>
<p>Como vocês me conhecem, sabem que eu vou desviar do assunto principal para ensinar alguns conceitos que todos já deveriam saber:</p>
<h2>Argumentações Falaciosas</h2>
<p>Sim, novamente textos escritos com conclusões falaciosas (não vou linkar nenhum dos artigos falaciosos que o pessoal tem twitado porque não quero lhes dar tráfego de graça, mas usem o Google e facilmente encontrarão dezenas). Primeiro o bom e velho <a href="https://www.nizkor.org/features/fallacies/hasty-generalization.html">Hasty Generalization</a> ou “Generalização Apressada”. Ela acontece assim:</p>
<ul>
  <li>Uma amostra S, que é muito pequena (às vezes apenas 1 caso), é tirada de uma população bem maior P;</li>
  <li>Uma conclusão C é generalizada à população P baseada em S</li>
</ul>
<p>No nosso caso:</p>
<ul>
  <li>O Twitter trocou de Ruby on Rails para Java;</li>
  <li>Conclusão: Ruby é ruim e todos deveriam trocar para Java.</li>
</ul>
<p>Além disso todos os artigos que falam sobre este assunto cometem quase todos as falácias de <a href="https://en.wikipedia.org/wiki/List_of_cognitive_biases">Cognitive Bias</a> do livro:</p>
<ul>
  <li>Anchoring: a tendência humana comum de depender demais numa “âncora” ou pedaço de informação quando toma decisões. <em>“Esta linguagem é lenta, portanto ela é inútil”</em></li>
  <li>Bandwagon effect: a tendência de fazer (ou acreditar) em coisas porque muitas outras pessoas fazem (ou acreditam) na mesma coisa. <em>“O Twitter trocou Ruby por Java, portanto todo mundo deveria.” ou “Todo mundo diz que Ruby é ruim, portanto deve ser.”</em></li>
  <li>Confirmation Bias: a tendência de procurar por ou interpretar informação de maneira a confirmar seu preconceito. <em>“Eu acho que Ruby deve ser ruim. O Twitter trocou Ruby. Aha, portanto estou certo, Ruby é ruim.”</em></li>
  <li>Negative Bias: a tendência de prestar mais atenção ou dar maior peso a experiências negativas do que positivas. <em>“O Twitter trocou Ruby, portanto Ruby é ruim. O Groupon e centenas de outras startups usam Ruby, mas isso não quer dizer quase nada.”</em></li>
  <li>Status quo Bias: a tendência de gostar que as coisas se mantenham relativamente as mesmas. <em>“Todo mundo sempre usou Java, pra que tentar outra coisa?”</em></li>
</ul>
<p>Tem mais, mas vou parar por aqui porque já deu para demonstrar meu ponto.</p>
<h2>Cum hoc ergo propter hoc e Nirvana</h2>
<p>Meus dois favoritos tipos de falácias são: <a href="https://en.wikipedia.org/wiki/Correlation_does_not_imply_causation">Correlação não implica causa</a> (Cum hoc ergo propter) e <a href="https://en.wikipedia.org/wiki/Perfect_solution_fallacy">Falácia da Solução Perfeita ou Nirvana</a>.</p>
<p>O princípio é que existe algum tipo de Cognitive Bias – como mostrei antes – que gera um preconceito <em>“Ruby tem que ser ruim.”</em></p>
<p>Quem procura sempre acha, já dizia o ditado. E de fato, todos sempre encontrarão correlações, neste caso <em>“O Twitter trocou de Ruby para Java. O Ruby é lento. Portanto é melhor sempre usar Java e nunca usar Ruby. Portanto Ruby é ruim”</em> – ou algo similar.</p>
<p>O aspecto “performance” é sempre usado de maneira acima do peso que merecia (Negative Bias) para justificar que o Ruby inteiro deve ser ruim. O aspecto Twitter ou qualquer outro que teve problemas com Ruby serve de justificativa para demonstrar que Ruby é ruim (Hasty Generalization Fallacy).</p>
<p>E finalmente, a crença de que <em>“existe solução perfeita para hoje e que vai aguentar até o futuro sem problemas.”</em> (Perfect Solution Fallacy).</p>
<p>Pois bem, não existe.</p>
<h2>A Realidade</h2>
<p>Antes de mais nada, vale dizer que o <a href="https://engineering.twitter.com/2011/04/twitter-search-is-now-3x-faster_1656.html">artigo original no blog do Twitter</a> – não as republicações – é muito boa, concordo com ela e recomendo que todos leiam.</p>
<p>O título diz: “Pesquisas no Twitter agora são 3x mais rápidas”. E isso é um fato. Ela não diz: <em>“Twitter determina que Ruby é ruim, troca para Java e fica 3x mais lento.”</em> Essa conclusão nos artigos que republicaram o original são apenas provocações sensacionalistas.</p>
<p>Agora, trechos do artigo traduzido em português:</p>
<blockquote>Para conseguir entender os ganhos de performance, você deve primeiro entender as ineficiências dos nossos servidores de front-end anteriores, que eram em Ruby on Rails (…) Nós sabemos há muito tempo que o <strong>modelo síncrono</strong> de responder requisições de forma usam nossos CPUs de forma ineficiente. Com o tempo, nós também acabamos acumulando um <strong>débito técnico</strong> significativo no nosso código Ruby, tornando muito difícil adicionar novas funcionalidades e melhorar a confiabilidade do nosso engine de pesquisa. Blender [a nova solução feita com tecnologias Java] endereçam esses problemas: criando um serviço de agregação totalmente <strong>assíncrono</strong> (…)</blockquote>
<p>O que o artigo explica é como a <strong>mudança de arquitetura</strong> foi de grande benefício e como o <strong>débito técnico que eles acumularam</strong> facilitou a decisão de jogar o legado em Ruby fora e começar do zero. O resto do artigo explica como o Blender funciona, como eles usaram estruturas de DAGs (<a href="https://en.wikipedia.org/wiki/Directed_acyclic_graph">directed acyclic graphs</a>) para facilitar e otimizar o fluxo de trabalho entre os diferentes serviços dependentes. Como eles também criaram um novo proxy multiplexador de requisições de entrada (ainda não vi ninguém concluindo “O Twitter trocou seus proxies X por código deles mesmo. Portanto X é ruim.”). Finalmente eles descrevem as mudanças no roteamento de requisições no back-end entre os serviços dependentes.</p>
<p>Eu criticaria o fato deles estarem reescrevendo do zero tantos componentes de infraestrutura em vez de usar tecnologias que já existem, em particular o sistema de workflow e de fila, os proxies, etc. Porém, eu não concluiria que isso é errado. O caso do Twitter é uma exceção, não a regra. E a única forma de determinar o que o caso do Twitter necessita é estando no dia-a-dia de operações e desenvolvimento dentro do Twitter. Eu nunca estive por lá, portanto não posso concluir nada.</p>
<p>Mas repita comigo: <em>“eu não sou o Twitter, eu não sou o Twitter, eu não sou o Twitter.”</em> E sinceramente, você dificilmente um dia chegará a uma fração do que é o Twitter. Não é impossível, afinal existe 1 caso de Twitter.</p>
<p>Para ilustrar, veja este gráfico de <span class="caps">CPU</span> semanal do Munin de um aplicativo que minha equipe desenvolveu:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2011/4/16/weekly-CPU_original.png?1302928669" srcset="https://s3.amazonaws.com/akitaonrails/assets/2011/4/16/weekly-CPU_original.png?1302928669 2x" alt=""></p>
<p>Note uma coisa: a maior parte do gráfico é “idle”. Ou seja, a maior parte do tempo este hardware está apenas esperando, sem fazer nenhum processamento. Se esta aplicação fosse, sei lá, 20 vezes mais lento, ainda assim estaria sobrando algum processamento. Pense bem: minha máquina não está sequer saturada. Será que ficar 3x mais rápido vai trazer algum benefício? Acho muito difícil. Porém, se minha equipe fosse 3 vezes menos produtiva, o prazo para entrega desta aplicação simplesmente não teria sido possível para nosso cliente.</p>
<p>Agora, no caso do Twitter, se o gráfico das centenas de máquinas que eles tem fossem parecidas com este, seria um enorme problema. Pense 100 máquinas onde 90% do tempo ele não está fazendo nada. Significa que daria para trocar as 100 máquinas por apenas 1 ou 2 onde menos de 10% do tempo ele não estaria fazendo nada. Ou seja, estaria saturado a maior parte do tempo.</p>
<p>Só que aqui vem outra das cognitive bias: de que performance é a única variável de impacto na solução e de que todos deveriam estar preparados para um dia ter a escala do Twitter. Agora prestem atenção:</p>
<blockquote><strong>Performance</strong> NÃO é a única variável de um problema!</blockquote>
<p>Ruby on Rails sempre se vendeu nos seguintes fatores:</p>
<ul>
  <li>Usar Ruby que é uma das linguagens mais elegantes e prazerosas de trabalhar (embora gosto é algo que não se discute, e tem gente que acha ler assembler algo bonito)</li>
  <li>Ruby on Rails ajuda a aumentar a produtividade (considerando que com boas ferramentas e técnicas adequadas, certos casos de uso, a produtividade poderia aumentar em 5 vezes ou mais) – a premissa aqui é que para a maioria dos projetos (onde a exceção são casos como Twitter, Google) o custo da improdutividade normalmente seria muito mais caro do que meramente alugar mais máquinas. Não é verdade que Ruby on Rails sempre compensará, mas é real que em muitos casos isso é verdade.</li>
  <li>Ruby on Rails faz diversos “trade-offs” que fazem sentido para muitos projetos: de que perder performance para ganhar me produtividade + mantenabilidade + prazer da equipe é uma troca mais do que justa.</li>
  <li>(e para hoje em dia) o Ecossistema cresceu exponencialmente e hoje existem ferramentas incríveis para diversos aspectos do ciclo de desenvolvimento. Especialmente na área de testes com coisas como Capybara, RSpec, Riot, Cucumber, Steak, Akephalos, Factory Girl e muito, muito mais.</li>
</ul>
<p>Encare a realidade: a grande maioria dos desenvolvedores sequer sabe a diferença entre requisições síncronas e assíncronas, sequer sabem o que é um sistema de filas, sequer sabem o que é um Munin! (que gera informações como o histórico de uso do <span class="caps">CPU</span> pelo tempo como na figura anterior).</p>
<p>Inclusive, aprenda a aprender: Ruby on Rails não é a única tecnologia existente no ecossistema Ruby. Está precisando de mais throughput, precisa mudar do modelo síncrono para assíncrono? Existem várias opções, uma delas é o <a href="https://www.igvita.com/2011/03/08/goliath-non-blocking-ruby-19-web-server/">Goliath</a> do Ilya Grigorik e utilizado há tempos em produção pelo <a href="https://www.postrank.com/">PostRank.com</a>.</p>
<h2>Performance é sempre mais importante</h2>
<p>Se nenhum dos argumentos anteriores fez sentido para você, aqui vai uma última. Se para você, performance bruta é o único fator de decisão de uma linguagem + plataforma + ecossistema, Não use Ruby, não use Python, sequer use .<span class="caps">NET</span> ou Java.</p>
<blockquote>Vá direto para C!!</blockquote>
<p>Este é um exemplo usando o framework web para C chamado <a href="https://github.com/DanielWaterworth/raphters">Raphters</a>. E este é um exemplo dele para um micro código à la “hello world”</p>
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
      <td class="code"><pre><span style="color:#579">#include</span> <span style="color:#B44;font-weight:bold">"raphters.h"</span>
START_HANDLER (simple, GET, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">simple</span><span style="color:#710">"</span></span>, res, <span style="color:#00D">0</span>, matches) {
    response_add_header(res, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">content-type</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/html</span><span style="color:#710">"</span></span>);
    response_write(res, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello world</span><span style="color:#710">"</span></span>);
} END_HANDLER
START_HANDLER (default_handler, GET, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>, res, <span style="color:#00D">0</span>, matches) {
    response_add_header(res, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">content-type</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/html</span><span style="color:#710">"</span></span>);
    response_write(res, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">default page</span><span style="color:#710">"</span></span>);
} END_HANDLER
<span style="color:#0a5;font-weight:bold">int</span> main() {
    add_handler(simple);
    add_handler(default_handler);
    serve_forever();
    <span style="color:#080;font-weight:bold">return</span> <span style="color:#00D">0</span>;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Consigo enxergar esse framework sendo usado em algum serviço web muito específico e muito pequeno que é muito crítico, o suficiente para ir para C.</p>
<p>Agora, quero ver quem é o “performance-macho” suficiente (ou se fosse Tropa de Elite 2, quem é o “pica-das-galáxias”) para escrever algo da complexidade dos front-ends do Twitter totalmente usando C ou C++ com perda mínima de produtividade e aumento de custo de desenvolvimento e manutenção por um longo período de tempo (pelo menos 3 anos). Se não for capaz, pra que diabos você está perturbando com conclusões falaciosas?</p>
<p>E sabe por que você usa Java e não C ou C++? Não é por performance, foi por produtividade! Porque escrever sistemas é coisa para C. Mas escrever aplicações funcionais é mais produtivo com Java. E nós estamos dizendo que para um certo nicho de aplicações web, é bem mais produtivo fazer em <span class="caps">PHP</span>, Ruby, Python. Esses são os argumentos corretos.</p>
<p>PS: e sim, esta última parte foi uma <a href="https://pt.wikipedia.org/wiki/Troll_(internet)">#trollagem</a></p>
<p></p>
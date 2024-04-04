---
title: "Tradução: Não sei o que quero, mas sei como conseguir"
date: "2008-02-10T19:18:00.000Z"
tags: ["principles", "agile", "management", "career"]
years: "2008"
---

<p></p>
<div style="float: left; margin: 3px"><img src="http://s3.amazonaws.com/akitaonrails/assets/2008/2/10/patton_headshot_small.jpg" srcset="http://s3.amazonaws.com/akitaonrails/assets/2008/2/10/patton_headshot_small.jpg 2x" alt=""></div>
<p>Este <a href="http://www.agileproductdesign.com/blog/dont_know_what_i_want.html">artigo</a> é muito interessante e me deixou intrigado porque eu – que sou um amador em técnicas Ágeis – pela primeira vez vi um enfoque diferente na explicação de certos termos Ágeis, em particular, “iteração” vs “incremental”.</p>
<p>Segundo o perfil no site do autor: <strong>Jeff Patton</strong> tem focado em técnicas Ágeis desde 2000 e se especializou na aplicação de técnicas de design centradas no usuário para melhorar requirimentos Ágeis, planejamento e produtos. Alguns de seus artigos mais recentes podem ser encontrados na www.AgileProductDesign.com e na Crystal Clear de Alistair Cockburn. Seu próximo livro será lançado pela série de Desenvolvimento Ágil da Addison-Wesley que dará conselhos táticos para quem procura entregar software útil, usável e de valor.</p>
<p>Atualmente ele trabalha como consultor independente, é o fundador e moderador da lista agile-usability no grupo de discussão do Yahoo, um colunista na StickyMinds.com e <span class="caps">IEEE</span> Software, e vencedor do Gordon Park Award 2007 da Agile Alliance por contribuições ao desenvolvimento Ágil.</p>
<p>E aqui vai minha tradução do artigo em questão:</p>
<p></p>
<p></p>
<h2>Não sei o que quero, mas sei como conseguir</h2>
<div style="float: left; margin: 3px"><a href="https://en.wikipedia.org/wiki/John_Lydon"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/johnny_rotten.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/johnny_rotten.jpg 2x" alt=""></a></div>
<p>Tudo começou com um desses estranhos treinamentos de pensamento que vêm a você quando está na metade do caminho entre dormir e acordar. As primeiras linhas da música <a href="https://www.lyricsfreak.com/s/sex+pistols/anarchy+in+the+uk_20123592.html">Anarchy in the UK</a>, do Sex Pistols, estava tocando na minha cabeça. (Isso pode ser uma dica tanto da minha idade, e do tipo e volume da música que ouço). Nessa manhã, <a href="https://www.lyricsfreak.com/s/sex+pistols/anarchy+in+the+uk_20123592.html">Johnny Rotten’s word</a> pareciam particularmente sábias – e pareciam descrever perfeitamente um problema recorrente que tenho sofrido ajudando pessoas a realmente <a href="https://en.wikipedia.org/wiki/Grok">entender</a> desenvolvimento Ágil. Brevemente, depois de se declarar um anti-cristo, Johnny diz:</p>
<p style="text-align: center"><strong>“Não sei o que quero, mas sei como conseguir.”</strong></p>
<p>E, isso é relevante porque eu constantemente caio em alguns problemas que fazem meu <a href="https://en.wikipedia.org/wiki/Spider-Man's_powers_and_equipment#Spider-sense">sentido aranha</a> apitar. Em desenvolvimento de software Já ouviu algo parecido com isso?</p>
<p style="text-align: center"><strong>“Sabemos o que queremos. Poderia estimar quanto tempo vai levar para construir?”</strong></p>
<p>Se sentiu um frio na espinha, isso foi seu sentido aranha apitando. O outro problema é mais ou menos assim:</p>
<p style="text-align: center"><strong>“Precisamos finalizar o detalhamento desses requerimentos antes de começar o desenvolvimento.”</strong></p>
<p>Em resumo, eu caio em situações onde as pessoas do lado de especificação de desenvolvimento de software, “clientes” ou “donos do produto” em termos Ágeis, ou acreditam que sabem o que precisam, ou sentem que precisam saber antes de podermos começar a desenvolver. Mais ainda, eu ainda esbarro em vários ambiente Ágeis com a mesma antiga e chata reclamação sobre “clientes que não sabem o que querem” ou “clientes sempre mudando de idéia”.</p>
<p>Todos esses sentimentos para mim parecem surgir do não saber o que “iteração” significa, e é usada em desenvolvimento Ágil.</p>
<h3>Iterar e Incrementar são idéias separadas.</h3>
<p>Eu costumo ver pessoas em desenvolvimento Ágil usar o termo <strong>iterar</strong>, mas realmente querem dizer <strong>incrementar</strong>.</p>
<p>Por desenvolvimento incremental quero dizer incrementalmente adicionar software de cada vez. Cada incremento adiciona mais software – meio como adicionar tijolos numa parede. Depois de vários incrementos, você tem uma parede grande.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/incrementing.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/incrementing.jpg 2x" alt=""></p>
<p>Por desenvolvimento iterativo quero dizer que construímos alguma coisa, então avaliamos se vai funcionar para nós, então fazemos mudanças. Nós construímos <strong>esperando mudar.</strong> Nunca esperamos fazer certo. Se ficou certo, foi um feliz acidente. Como não esperamos fazer certo, normalmente fazemos o mínimo necessário para validar se foi a coisa certa a se fazer.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/iterating.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/iterating.jpg 2x" alt=""></p>
<p>Usei as duas figuras acima por vários anos para ajudar a ilustrar o conceito. Artistar trabalham iterativamente. Eles normalmente criam rascunhos, decidem criar uma pintura, criar uma sobre-pintura mostrando as cores e formas, então eventualmente começam a terminar de pintar. Eles param quando está “bom o suficiente” ou esgotam o tempo ou interesse.</p>
<div style="float: left; margin: 3px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/rembrandt_paint_by_number.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/rembrandt_paint_by_number.jpg 2x" alt=""></div>
<p>Artistas de pintar-nos-números trabalham incrementalmente. Quando eu era criança fiz algumas ótimas artes de pinturas-nos-números. O problema com pintar-nos-números é que alguns artistas reais tiveram que realmente pintar a coisa, entender quais eram todas as cores, então desenhar todas as linhas e numerar as áreas – o que toma mais tempo do que somente criar a pintura. Usando uma estratégia de <em>somente</em> incrementar significa mais ou menos ter que conseguir fazer certo da primeira vez.</p>
<h3>Nós iteramos por múltiplas razões</h3>
<p>Depois de falar sobre iteração durante a <a href="https://www.xpday.org/">XP Day 2007</a> alguém corretamente apontou a mim que não era tão simples quanto “mudar as coisas” em cada iteração. Ele apontou que:</p>
<ul>
  <li>nós iteramos para <strong>encontrar a solução correta.</strong></li>
</ul>
<ul>
  <li>então, dado um bom candidato a solução, então devemos iterar para <strong>melhorar o candidato a solução.</strong></li>
</ul>
<h3>Nós Incrementamos por múltiplas razões</h3>
<p>Nós adicionamos incrementalmente a software por várias razões também.</p>
<ul>
  <li>Usamos incrementação para <strong>gradualmente construir funcionalidade</strong> então <em>se</em> o desenvolvimento leva mais tempo do que se espera, podemos lançar o que incrementalmente construímos até agora. (“Se” em itálico porque eu honestamente não consigo me lembrar de um projeto onde o desenvolvimento levou menos tempo do que o esperado.)</li>
</ul>
<ul>
  <li>Lançamos incrementalmente para que realmente <strong>consigamos o valor de negócio que estamos buscando</strong>. Porque, realmente não conseguimos retorno de investimento até as pessoas começarem a usar o software que construímos. Até lá, o valor esperado de negócio é apenas uma estimativa. E, se acha que estimativa de desenvolvimento de software é difícil, experimente estimar retorno de investimento.</li>
</ul>
<h3>Nós combinamos iteração e incrementação</h3>
<p>Em desenvolvimento Ágil realmente combinamos as duas táticas. Durante uma “iteração” de desenvolvimento onde construímos vários <a href="https://www.agileproductdesign.com/blog/the_shrinking_story.html">user stories</a> algumas podem estar adicionando novas funcionalidades incrementalmente, outras podem estar iterando para melhorar, mudar ou remover funcionalidades existentes.</p>
<p>Onde as coisas realmente não dão certo em desenvolvimento Ágil é quando ninguém planeja iterar.</p>
<h3>O cliente apreensivo</h3>
<div style="float: left; margin 3px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/gun_shy_customer_small.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/gun_shy_customer_small.jpg 2x" alt=""></div>
<p>Talvez você tenha estado em projetos Ágeis:</p>
<p>Os clientes se encontram com a equipe e escrevem várias user stories com sucesso. Depois de muita conversa entre desenvolvedores e clientes, os desenvolvedores estimam as histórias. Os clientes as priorizam, os de maior valor primeiro, e escolhem as histórias mais importantes para o primeiro lançamento estimado para daqui seis iterações.</p>
<p>O desenvolvimento começa, e as coisas parecem ir muito bem. Num mundo de fantasia essa história poderia ocorrer, todas as estimativas de desenvolvimento estavam precisas. Nas primeira iterações todas as histórias agendadas são finalizadas. Mas, é quando as coisas vão errado.</p>
<p>Depois de olhar para o software o cliente diz “Agora que vejo isso, está faltando algumas coisas. E, embora as coisas que tenha construído batem com os critérios de aceitação, nós, bem .. hum … não estávamos muito certos sobre critérios de aceitação e agora que vemos isso, isso precisa mudar.”</p>
<p>“Sem problema” diz a equipe. “Apenas escreva mais user stories. Mas, vocês terão que retirar algumas das outras deste lançamento para que possamos acabar no tempo.”</p>
<p>O cliente está chocado e nervoso. “O que você está dizendo é que eu preciso ter os requerimentos certos logo de início (‘requirements right up front’)!! Isso cheira a waterfall – exceto que sem o tempo inicial (‘up front time’) que eu precisaria para pelo menos tentar ter os requerimentos certos logo de começo.”</p>
<p>Eu trabalhei com essas equipes e clientes muitas vezes. Conheço muitas organizações onde “Desenvolvimento Ágil” foi etiquetado como um processo que simplesmente não funciona e foi ejetado da organização.</p>
<p>Conheço outros clientes que adaptaram gastando mais e mais tempo em requerimentos. Eles introduziram fases de “Iteração 0” ou “Sprint 0” mais prologadas onde eles de fato escrevem esses grandes requerimentos. Eles trabalham, 1, 2 ou 3 iterações à frente para realmente conseguir os detalhes de suas histórias antes delas serem introduzidas. Eles tentam duro conseguí-las certo. E, quando inevitavelmente eles falham em conseguí-las certo, eles ficam murchos, desiludidos, desapontados – e vários outros “des-” que você pode imaginar.</p>
<p>Não é culpa deles. Eles foram mal direcionados.</p>
<h3>Isso não significa o que você pensa que significa</h3>
<p>Existe uma pequena frase miserável que as pessoas Ágeis usam frequentemente. Eles costumam dizer “ao final de cada iteração você terá software potencialmente entregável.” O <a href="https://www.mountaingoatsoftware.com/scrum">modelo Scrum Snowman</a> comumente usado que todas as dezenas de milhares de Scrum Masters certificados viram, claramente diz isso.</p>
<table>
  <tbody>
    <tr>
      <td><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/scrum_snowman_model.gif" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/scrum_snowman_model.gif 2x" alt=""></td>
      <td><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/potentially_shippable_product.gif" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/potentially_shippable_product.gif 2x" alt=""></td>
    </tr>
  </tbody>
</table>
<p>No filme “Princess Bribe” um dos vilões exclama “Inconcebível!” cada vez que um de seus planos é derrubado pelo herói. Isso acontece com tanta frequência que um de seus parceiros diz “Você sempre fala essa palavra. Eu acho que você não sabe o que isso significa.”</p>
<p style="text-align: center"><img src="https://www.agileproductdesign.com/blog/images/inigo.jpg" srcset="https://www.agileproductdesign.com/blog/images/inigo.jpg 2x" alt=""></p>
<p style="text-align: center"><em>“Entregável”. Você sempre fala essa palavra. <br>Eu não acho que isso significa o que você acha que significa.</em></p>
<p>Para um cliente, alguém que pretende vender ou usar o software, ‘entregável’ significa que eles poderiam de fato vender ou usar o software. Isso significa que o número mínimo de funcionalidades estão todos presentes. O software precisa ser útil para os propósitos intencionados – pelo menos tão útil quanto o software antigo ou processo em papel que ele substitui. O software precisa parecer e se comportar bem – ter alta qualidade de acabamento – particularmente se isso é software comercial e você tem concorrentes baforando no seu cangote.</p>
<p>Entregável significa finalizado. Completamente feito e limpo. Não há necessidade de iterar em algo pronto – realmente pronto e entregável.</p>
<p>Dizer “entregável” para pessoas no papel de clientes significa lhes dizer que é bom que tenham os requerimentos certos porque é dessa forma que desenvolvimento Ágil funciona.</p>
<p>Agora, eu acredito que as pessoas Ágeis tinham outra coisa em mente quando disseram isso. Acho que eles queriam dizer sobre mante a qualidade do código bastante alta. Manter o código suportado com testes unitários e de aceitação. Tomar o cuidado de validar cada uma das user story. Isso diz aos testadores para se manterem envolvidos desde cedo e mais continuamente. Isso diz a desenvolvedores para desenvolver com alta atenção à qualidade. (Aparentemente desenvolvedores construiríam porcaria caso contrário?)</p>
<h3><span class="caps">YAGRI</span>: You Aint Gunna Release It (Você Não Vai Lançar Isso)</h3>
<p>Eu proponho que nós, da comunidade Ágil, sejamos claros sobre o que queremos dizer por iterativo e incremental. Precisamos explicar a esses clientes e donos de produtos que é importante escrever user stories que não tem a intenção de serem lançados. Para escrever histórias que eles intencionam avaliar, aprender, melhorar ou jogar fora como experimentos falhos.</p>
<p>Em conversas com meu amigo Alistair, ele propôs <a href="https://alistair.cockburn.us/index.php/Three_cards_for_user_rights">escrever três cartões de user stories em vez de apenas um</a>. O primeiro cartão tem a história de fato nela. O segundo é um espaço para as inevitáveis mudanças à história depois de a vermos. A terceira para os refinamentos depois de vermos as mudanças.</p>
<p>Esse é um exemplo de planejamento para iterar. Isso poderiar tirar muito stress das mãos trêmulas dos clientes apreensivos preocupados sobre fazer certo porque a história precisa ser “entregável”.</p>
<h3>Você sempre pode ter o que quer, mas é o que você precisa?</h3>
<p>Onde aplicamos lírica do Sex Pistols a desenvolvimento de software, não podemos necessariamente aplicar os Rolling Stones.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/mick_jagger.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/10/mick_jagger.jpg 2x" alt=""></p>
<p style="text-align: center"><em>“Você não pode ter sempre o quer. Mas se algum dia tentar,<br> talvez encontre, terá o que precisa.”</em></p>
<p>Em desenvolvimento de software, infelizmente se você especificar alguma coisa, e todos fizerem seu melhor, terá o que quer – pelo menos o que foi especificado. Mas, é isso que precisa? Você somente saberá depois que olhar para isso e experimentá-lo.</p>
<p>Não escute ao Mick.</p>
<p>De fato, tente muito não ter tanta certeza sobre o que quer. Se alavancar iteração, você a terá mesmo se não souber o que era, para começar. Johnny estava certo.</p>
<p>“Não sei o que quero, mas sei como conseguir.”</p>
<h3>Por favor alavanque a explicação se quiser</h3>
<p>Essa é uma história que contei durante a <a href="https://www.agileproductdesign.com/downloads/patton_embrace_uncertainty_preso_only.zip">palestra de Abrace a Incerteza na XP Day 2007</a>. É raro quando você precisa citar Johnny Rotten, Roger Waters, Paul Simon, Pete Townsend, John Lennon e as Spice Girls na mesma palestra.</p>
<p>Sinta-se livre para <a href="https://www.agileproductdesign.com/downloads/patton_embrace_uncertainty_preso_only.zip">fazer download da palestra</a></p>
<p>Aqui está a palestra com <a href="https://www.agileproductdesign.com/downloads/patton_embrace_uncertainty.zip">os clipes musicais</a>.</p>
<p>Sinta-se livre para usar os exemplos usando a creative commons license. Deixe as pessoas saberem que pegaram emprestado de mim.</p>
<p>Se gostou dos <a href="https://www.agileproductdesign.com/downloads/patton_iterating_and_incrementing.ppt">slides da Monalisa</a>, pode <a href="https://www.agileproductdesign.com/downloads/patton_iterating_and_incrementing.ppt">pegá-las daqui</a>.</p>
<p>As idéias gerais aqui estão escritas em um <a href="https://www.stickyminds.com/sitewide.asp?ObjectId=13178&amp;Function=DETAILBROWSE&amp;ObjectType=COL&amp;sqry=%2AZ%28SM%29%2AJ%28COL%29%2AR%28createdate%29%2AK%28colarchive%29%2AF%28%7E%29%2A&amp;sidx=2&amp;sopp=10&amp;sitewide.asp?sid=1&amp;sqry=%2AZ%28SM%29%2AJ%28COL%29%2AR%28createdate%29%2AK%28colarchive%29%2AF%28%7E%29%2A&amp;sidx=2&amp;sopp=10">artigo na StickyMinds.com</a> com um pouco menos de reclamação. Você pode compartilhar essa versão com seu chefe.</p>
<h3>Fiquem ligados</h3>
<div style="text-align: center"><object width="425" height="373">
    <param name="movie" value="https://www.youtube.com/v/4bM_l443VV4&amp;rel=1&amp;border=1">
    <param name="wmode" value="transparent"><embed src="https://www.youtube.com/v/4bM_l443VV4&amp;rel=1&amp;border=1" type="application/x-shockwave-flash" wmode="transparent" width="425" height="373">
  </object></div>
<p>Se quiserem saber mais sobre estratégias específicas para iterar sensivelmente em desenvolvimento Ágil, por favor me visitem em um tutorial que estarei ensinando em uma conferência. Também prestem atenção a este site e bloguem enquanto ressucito meu antigo livro do purgatório.</p>
<p>Finalmente, se leu este blog no <a href="https://blogs.thoughtworks.com/">ThoughtBlogs</a> (e meu web analytics me diz que muitos de vocês vieram de lá) esta pode ser a última vez que meu blog aparece por lá. Por favor assinem diretamente, ou me procurem na <a href="https://blogs.thoughtworks.com/alumni/">ThoughtWorks alumni blogs</a>. Eu tive uma ótima estadia na ThoughtWorks pelos últimos anos, mas é hora de andar sozinho.</p>
<p>Obrigado por lerem.</p>
<p></p>
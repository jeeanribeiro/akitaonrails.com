---
title: "[Small Bites] Novidades no Garbage Collector do Ruby 2.2.1"
date: "2015-03-27T16:06:00.000Z"
tags: ["ruby"]
years: "2015"
---

<p></p>
<p>O Koichi Sasada <a href="http://www.atdot.net/~ko1/activities/2015_rubyconfph_pub.pdf">palestrou recentemente</a> no evento RubyconfPH sobre as melhorias no garbage collector.</p>
<p>Na prática: o Ruby 2.2.1 tem agora garbage collector com 4 gerações (2 jovens, 1 velho, 1 survival). Na versão 2.1 eram somente 2 gerações (nova e velha, onde objetos novos eram promovidos pra velhos se sobrevivessem a um fase de marking do GC, mas isso levava objetos a serem promovidos prematuramente, usando mais memória do que deveria).</p>
<p>Quem assistiu minha palestra no QConSP ano passado aprendeu em mais detalhes sobre a evolução do garbage collector. Se não assistiu <a href="http://www.infoq.com/br/presentations/entendendo-garbage-collector-ruby">veja a gravação</a>. Recapitulando:</p>
<p></p>
<p></p>
<ul>
  <li>Ruby sempre teve GC Mark &amp; Sweep (uma grande pausa de marcação de objetos - Marking - e outra grande fase de limpeza - Sweep).</li>
  <li>No Ruby 1.9.3 a fase Sweep virou <a href="https://patshaughnessy.net/2012/3/23/why-you-should-be-excited-about-garbage-collection-in-ruby-2-0">Lazy Sweep</a> (dividida em pequenos sweeps em vez de 1 grande de uma vez).</li>
  <li>No Ruby 2.0.0 a fase Marking ganhou bitmap marking (pra facilitar copy-on-write).</li>
  <li>No Ruby 2.1 a fase Marking foi dividida em Major GC e Minor GC com as 2 gerações do <a href="https://tmm1.net/ruby21-rgengc/">RGenGC</a> (Restricted Generational GC).</li>
  <li>No Ruby 2.2. o Major GC foi fatiado em Minors com múltiplas gerações young e agora é incremental, baseado no algoritmo de Tri-Color Marking (marcações em etapas de white, grey e black). Por isso o "Incremental" do nome RIncGC. Então Ruby 2.2 é RGenGC + RIncGC.</li>
</ul>
<p>Então com Tri-Color Bitmap Marking e Lazy Sweep as longas pausas "Stop the World" do GC foram reduzidas ao mínimo.</p>
<p>De curiosidade, 2 dos principais aspectos limitantes do Ruby MRI é que ele expõe suas estruturas de dados às extensions em C, que tem acesso direto ao endereço de memória deles. Isso significa boa performance e baixa flexibilidade, porque não podemos mover essas estruturas de lugar sem quebrar vários ponteiros. Por isso não podemos implementar um Copying Garbage Collector, que evitaria fragmentação, e que move objetos de uma geração para outra.</p>
<p>A vantagem de um Copying Collector é que sabemos exatamente que conjunto de objetos está numa geração ou em outra fisicamente. A desvantagem é a operação de copiar objetos. A vantagem dos objetos do Ruby é que por terem estrutura de tamanho fixo, elas não fragmentam tanto e por serem estáticos não gastam tempo de cópia. No final o que se move no GC do Ruby são bits em mapas (bitmap "rememberset" para objetos desprotegidos, bitmap para objetos marcados, etc).</p>
<p>Objetos no Ruby, portanto, precisam ser "protegidos" por uma barreira de escrita, ou Write Barrier. Um array, por exemplo, pode ser promovido pra geração velha e o GC raramente vai passar por ele. Mas um novo objeto pode ser inserido nesse array e ficar na geração nova. Nesse caso, o Write Barrier vai notificar o GC para passar por esse Array novamente. Daí o conceito de "WB protected" e "WB unprotected" que você vai ver nas palestras do Koichi.</p>
<p>Objetos desprotegidos tecnicamente não podem ir pra geração antiga pois o GC precisa passar por ele o tempo todo. Objetos protegidos novos vão subindo de geração (menos ciclos de Minor GC passam por ele). Daí sempre vai ter poucos objetos novos para serem vasculhados na fase de Minor GC (a grande maioria dos objetos acabam indo pra gerações velhas e não gastam mais tanto tempo do GC, esse é o conceito).</p>
<p>E o "Incremental" de RIncGC é porque ele usa o algoritmo de <a href="https://en.wikipedia.org/wiki/Tracing_garbage_collection">Tricolor Marking</a> para particionar o Major GC em Minor GCs. Pra isso ele começa assumindo todos os objetos como brancos. Objetos que tem raízes mas não foram avaliadas são "cinza" e objetos que sabemos que não referenciam ninguém, são "pretos", candidados às fases de Sweep. Leia o link da Wikipedia pra entender corretamente como isso funciona.</p>
<p>O "Restricted" em RGenGC é justamente porque ele não pode mover qualquer objeto (desprotegidos) e o "Restricted" no RIncGC é porque apesar de diminuir as longas pausas do Major GC, ele ainda pode variar dependendo da quantidade de objetos desprotegidos.</p>
<p>Significa que o Ruby 2.2 usa mais memória que o 2.1 ou 2.0 (pelo que vi, pelo menos na faixa de 30% ou mais por processo) mas o tempo de resposta é mais rápido (porque tem muito menos fases de Major GCs) e mais previsível (sem picos de pausa longa periodicamente). Vale muito a pena migrar, testar suas aplicações e monitorar (liguem seus New Relic). Vejam a diferença:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/486/big_ruby2.1.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/486/ruby2.1.jpg 2x" alt="Ruby 2.1.5"></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/487/big_ruby2.2.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/487/ruby2.2.jpg 2x" alt="Ruby 2.2.1"></p>
<p>A partir de agora o Ruby 2.x tem diversas variáveis de tuning (quantidade de heaps, proporção do espaço da geração velha vs a nova, etc). Se não sabe pra que serve, não mexa neles. Um serviço que ainda está em teste diz conseguir monitorar sua aplicação em produção e lhe dar recomendações de tuning, ela se chama <a href="https://tunemygc.com">TuneMyGC</a>, dê uma olhada.</p>
<p>O próximo passo é avaliar os diferentes perfis de tuning e a consequência pode ser algo que no mundo Java se chama <a href="https://docs.oracle.com/javase/7/docs/technotes/guides/vm/gc-ergonomics.html">Ergonomics</a> onde o GC começa a avaliar os dados enquanto é executado para se auto-tunar e ir reajustando conforme o perfil. Auto-tuning seria a melhor feature pra vir na próxima versão do Ruby MRI.</p>
<p>O assunto é extenso e um pequeno artigo não dá conta de explicar tudo. Assista minha palestra do ano passado e mande perguntas nos comentários para expandirmos a explicação.</p>
<p></p>
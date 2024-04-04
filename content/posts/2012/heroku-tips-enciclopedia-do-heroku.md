---
title: "[Heroku Tips] Enciclopédia do Heroku"
date: "2012-04-20T18:37:00.000Z"
tags: ["beginner", "rails", "heroku"]
years: "2012"
---

<p></p>
<p><strong>Atualização Jul/2016:</strong> Sobre uploads e S3, leia meu post mais recente <a href="http://www.akitaonrails.com/2016/07/28/updating-my-old-posts-on-uploads">Updating my Old Posts on Uploads</a></p>
<p><strong>Atualização 11/9:</strong> Fiz alguns ajustes (troquei Unicorn por Passenger) e também escrevi <a href="http://www.akitaonrails.com/2013/09/11/heroku-tips-problemas-iniciais-com-rails-4-no-heroku#.UjDR-WRgZ3Y">outro post com mais dicas</a>.</p>
<p><strong>Atualização 05/06:</strong> Depois que escrevi este artigo, encontrei um outro muito bom que recomendo a leitura por ter mais detalhes para complementar. O artigo se chama <a href="http://rdegges.com/heroku-isnt-for-idiots">Heroku isn’t for Idiots</a></p>
<p>Se você quer lançar uma aplicação Rails rapidamente, não existe melhor solução do que o Heroku. Para quem não conhece, o Heroku é um Paas (Platform as a Service) que roda sobre o Amazon EC2 (que é um IaaS ou Infrastructure as a Service). O Heroku automatiza a criação de uma nova máquina virtual (volátil! isso é importante) e configura todo o ambiente para rodar Ruby.</p>
<p>O Heroku usa uma unidade de máquina virtual chamada “Dyno”, a grosso modo, considere um Dyno como uma máquina virtual “pequena” com 4 cores e até 512Mb de <span class="caps">RAM</span> sem swap file e sem suporte a persistência de arquivos (não faça uploads diretamente no diretório <tt>public/uploads</tt> ou algo assim, sempre configure para mandar para a Amazon S3, aprenda como <a href="https://devcenter.heroku.com/articles/s3">neste tutorial</a>). Configurar um novo ambiente é simples, o próprio Heroku tem uma <a href="https://devcenter.heroku.com/articles/rails3">boa documentação</a> ensinando como e recomendo ler antes de continuar.</p>
<p>Subir uma única dyno usando um banco de dados compartilhado PostgreSQL é de graça, o que é excelente para testar sua aplicação. Obviamente apenas um único dyno é pouco para qualquer aplicação séria lançada em produção para o público.</p>
<p>O Heroku fornece “stacks” padrão que é o perfil pré-configurado de um dyno para uma determinada plataforma. Para Ruby e Rails a mais atual (na data de publicação deste post) é a <a href="https://devcenter.heroku.com/articles/cedar">Celadon Cedar</a>, a anterior era a <a href="https://devcenter.heroku.com/articles/bamboo">Badious Bamboo</a> portanto se encontrar um tutorial qualquer de Heroku por aí, cheque sobre qual stack estamos falando, só use se for para Cedar.</p>
<p></p>
<p></p>
<h2>Concorrência num Dyno</h2>
<p>A primeira coisa que me chamou a atenção é que a configuração recomendada é executar uma aplicação Ruby usando o servidor <a href="https://code.macournoyer.com/thin/">Thin</a>. Pense no Thin como uma evolução do venerado Mongrel mas que suporta executar Eventmachine internamente. Na prática é um Mongrel melhorado, o que significa que cada Dyno, por padrão, não suporta mais do que 1 única execução concorrente (não confundir com “requisições por segundo”!! Muita gente erra isso. Um único processo com uma única execução concorrente pode executar várias requisições por segundo, basta cada requisição demorar menos de 1 segundo).</p>
<p>Executar múltiplos Thins poderia ser possível mas se queremos mais processos rodando simultaneamente para responder mais requisições ao mesmo tempo, a melhor opção é usar <a href="https://www.phusionpassenger.com/">Phusion Passenger</a>. Leiam a documentação para aprender as peculiaridades do Passenger, na prática pense nele como um controlador de processos Ruby. O melhor tutorial para usar Passenger no Heroku é da própria <a href="https://github.com/phusion/passenger-ruby-heroku-demo">Phusion</a>. Não vou repetir tudo que ele disse, mas as partes importantes são:</p>
<p>Substituir a gem <tt>thin</tt> pela <tt>passenger</tt> na sua Gemfile:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>group <span style="color:#A60">:production</span>, <span style="color:#A60">:staging</span> <span style="color:#080;font-weight:bold">do</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">passenger</span><span style="color:#710">'</span></span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O ideal é entre 3 e 4 processos, dependendo se sua dyno for a padrão <a href="https://blog.heroku.com/archives/2013/4/5/2x-dynos-beta">1X ou 2X</a>. A informação não-oficial que eu tenho é que cada dyno tem até 4 CPUs, o que justifica esse número de processos. Mais do que isso, chequem sempre quanto de memória cada processo consome (ferramentas como <a href="https://newrelic.com/">NewRelic</a> ajudam nisso) pois a somatória precisa ser menor que 512Mb ou você terá problemas.</p>
<p>Finalmente, a stack Cedar permite configurar perfis de dynos num arquivo chamado <tt>Procfile</tt> que fica na raíz do seu projeto. Para que a dyno levante com Unicorn coloque o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>web: bundle exec passenger start -p <span style="color:#d70">$PORT</span> --max-pool-size <span style="color:#00D">3</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Seu projeto precisa obrigatoriamente estar em Git pois isso vai criar um repositório remoto chamado ‘heroku’ no seu arquivo <tt>.git/config</tt>:</p>
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
      <td class="code"><pre>[core]
        repositoryformatversion = 0
        filemode = true
        bare = false
        logallrefupdates = true
        ignorecase = true
[remote "origin"]
        fetch = +refs/heads/*:refs/remotes/origin/*
        url = git@github.com:Codeminer42/test.git
[branch "master"]
        remote = origin
        merge = refs/heads/master
[remote "heroku"]
        url = git@heroku.com:test.git
        fetch = +refs/heads/*:refs/remotes/heroku/*
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Desta forma você faz o normal <tt>git push origin master</tt> para continuar subindo código para seu repositório de desenvolvimento e faz <tt>git push heroku master</tt> para realizar o deployment no Heroku. Isso reinicia sua Dyno, faz ela atualizar gems com <tt>bundle install</tt> executa a rake <tt>assets:precompile</tt>, caso esteja usando Rails 3.1 ou superior. Enfim, tudo que precisa para sua aplicação iniciar limpa.</p>
<h2>Rodando com Ruby 1.9.3 ou Ruby 2.0.0</h2>
<p>Outra peculiaridade da [stack Cedar](https://devcenter.heroku.com/articles/cedar) é que por padrão ele instala Ruby 1.9.2. Muitos novos projetos já usam 1.9.3 e é realmente a melhor versão para utilizar hoje (embora o 2.0.0 para projetos novos já é recomendado e estável o suficiente pra usar em produção). Na prática, ele inicia mais rápido que o 1.9.2, consome muito menos memória e executa mais rápido no geral.</p>
<p>Para escolher basta adicionar a seguinte linha no arquivo Gemfile do seu projeto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>ruby "1.9.3"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Obviamente, garanta que seu projeto em desenvolvimento e produção estão rodando com as mesmas versões!</p>
<h2>Delegando suas tarefas pesadas para Resque (ou Sidekiq)</h2>
<p>Não vou chover no molhado explicando porque coisas como gerar relatórios pesados, enviar emails, consumir APIs externas e outras coisas devem ser separadas em tarefas para rodar em background numa fila. A fila mais simples atualmente para usar num ambiente Rails é o Resque, que utiliza banco de dados NoSQL Redis para organizar as filas.</p>
<p>Como você precisa necessariamente de uma instância de Redis no Heroku, execute o seguinte a partir da raíz do seu projeto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku addons:add redistogo
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pesquise na página de add-ons do Heroku sobre outras opções e planos para entender quanto o pacote padrão de Redis suporta. Importante além de capacidade (que não precisa ser muito), é a quantidade de conexões simultâneas que é a quantidade de processos Ruby web e processos Ruby Resque Workers que você tem ao mesmo tempo.</p>
<p>Agora, adicione as gems que você precisa no arquivo <tt>Gemfile</tt>:</p>
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
      <td class="code"><pre><span style="color:#777"># mínimo:</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque</span><span style="color:#710">'</span></span>, <span style="color:#A60">:require</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque/server</span><span style="color:#710">'</span></span>
<span style="color:#777"># alguns opcionais</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque-scheduler</span><span style="color:#710">'</span></span>, <span style="color:#A60">:require</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque_scheduler</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque-lock</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque_mailer</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Rode o Bundler para atualizar, depois vamos configurar as seguinte tasks Rake num arquivo <tt>lib/tasks/resque.rake</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque/tasks</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque_scheduler/tasks</span><span style="color:#710">'</span></span> <span style="color:#777"># opcional se utilizar resque_scheduler</span>
task <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">resque:setup</span><span style="color:#710">"</span></span> =&gt; <span style="color:#A60">:environment</span> <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">QUEUE</span><span style="color:#710">'</span></span>] = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">*</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">if</span> <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">QUEUE</span><span style="color:#710">'</span></span>].blank?
  require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque</span><span style="color:#710">'</span></span>
  require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque_scheduler</span><span style="color:#710">'</span></span>
  require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque/scheduler</span><span style="color:#710">'</span></span>
  <span style="color:#036;font-weight:bold">Resque</span>.redis = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">REDISTOGO_URL</span><span style="color:#710">"</span></span>]
  <span style="color:#036;font-weight:bold">Resque</span>.schedule = <span style="color:#036;font-weight:bold">YAML</span>.load_file(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">config/scheduler.yml</span><span style="color:#710">'</span></span>) <span style="color:#777"># opcional se utilizar resque_scheduler</span>
  <span style="color:#036;font-weight:bold">Resque</span>::<span style="color:#036;font-weight:bold">Worker</span>.all.each {|w| w.unregister_worker}
  <span style="color:#777"># Fix for handling resque jobs on Heroku cedar</span>
  <span style="color:#777"># https://stackoverflow.com/questions/2611747/rails-resque-workers-fail-with-pgerror-server-closed-the-connection-unexpectedly</span>
  <span style="color:#036;font-weight:bold">Resque</span>.after_fork <span style="color:#080;font-weight:bold">do</span> |job|
    <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.establish_connection
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
desc <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">EC2 instance name changes every time, so run this before a new deployment</span><span style="color:#710">"</span></span>
task <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">resque:clean_workers</span><span style="color:#710">"</span></span> =&gt; <span style="color:#A60">:environment</span> <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#036;font-weight:bold">Resque</span>::<span style="color:#036;font-weight:bold">Worker</span>.all.each {|w| w.unregister_worker}
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O Resque sobe workers realizando fork, cada worker se inicia subindo seu próprio ambiente Rails, incluindo coisas como se conectar com o banco de dados. Mas ao fazer fork, essas conexões precisam ser refeitas, por isso existe o bloco <tt>Resque.after_fork</tt>. Atenção a todo sistema que realiza forks (Passenger é um exemplo).</p>
<p>A gem <a href="https://github.com/simple10/resque-heroku">resque-heroku</a> faz a mesma coisa, mas no caso como no exemplo onde estou configurando muitas outras coisas, não é necessário adicionar essa gem só por causa dessas 3 linhas.</p>
<p>Agora, nos arquivos <tt>config/environments/development.rb</tt>, <tt>config/environments/test.rb</tt> e outras que não são a de produção para o Heroku, adicione no início do arquivo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">REDISTOGO_URL</span><span style="color:#710">"</span></span>] = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">redis://localhost:6379</span><span style="color:#710">'</span></span>
<span style="color:#036;font-weight:bold">TestApp</span>::<span style="color:#036;font-weight:bold">Application</span>.configure <span style="color:#080;font-weight:bold">do</span>
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Também crie um arquivo <tt>config/initializers/resque.rb</tt> com:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Resque</span>.redis = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">REDISTOGO_URL</span><span style="color:#710">"</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se você sabe usar Resque, certamente tem um Redis instalado localmente na sua máquina de desenvolvimento e essa é a <span class="caps">URL</span> padrão. Modifique se precisar.</p>
<p>Finalmente, adicione novas linhas ao arquivo <tt>Procfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>web: bundle exec unicorn -p $PORT -c ./config/unicorn.rb
scheduler: bundle exec rake resque:scheduler
worker: bundle exec rake resque:workers QUEUE=* COUNT=2
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Estes são exemplos onde estou utilizando a gem <a href="https://github.com/bvandenbos/resque-scheduler">resque-scheduler</a>. Se você precisa de uma funcionalidade semelhante a um “crontab”, esta gem serve para isso. Mas está fora do escopo deste artigo falar sobre ela, então simplesmente ignorem quando menciono o scheduler se não precisar dela.</p>
<p>Novamente, quero aproveitar o máximo cada dyno. O arquivo Procfile determina o que cada perfil de dyno vai fazer. No meu exemplo, as dynos chamadas “web” sobem com 4 processos Unicorn como mostrei anteriormente. A chamada “scheduler” se responsabiliza só pelo processo de criar tarefas no Resque. E finalmente as “worker” sobem processos <em>trabalhadores</em> que ficam “ouvindo” as filas do Resque no Redis e executam as tarefas que aparecem lá. No caso dá para subir um único worker por dyno se usar a task rake <tt>resque:worker</tt> ou múltiplos usando a <tt>resque:workers</tt> como está no exemplo. Novamente suas limitações são: a quantidade de memória consumida por worker e o “peso” de execução de cada tarefa. Se as tarefas forem muito pesadas, melhor ter poucos worker por dyno.</p>
<p>Outra dica importante: especialmente se estiver utilizando o scheduler, que vai adicionando novas tarefas baseado num intervalo de tempo. Imagine uma tarefa que leva 1 minuto para ser executada e que o scheduler recoloca no Redis a cada 2 minutos. Se você tiver múltiplos workers em paralelo, somente um deles vai executar e tudo funciona.</p>
<p>Mas imagine se por qualquer razão a tarefa levar 5 minutos. Significa que nesse tempo o scheduler terá colocado pelo menos 2 tarefas iguais no Redis e haverá dois workers executando a mesma tarefa em paralelo! Você corre o risco de duplicar dados, ou qualquer outro efeito colateral de ter a mesma tarefa executando encavalado ao mesmo tempo.</p>
<p>Para isso serve a gem <a href="https://github.com/defunkt/resque-lock">resque-lock</a> que declarei como opcional acima. Somente se existir tarefas que não podem ser executadas em paralelo e você tem a possibilidade disso acontecer. Normalmente você terá classes Ruby no <span class="caps">PATH</span>, por exemplo, em <tt>app/resque/example.rb</tt>:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">resque/plugins/lock</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Example</span>
  extend <span style="color:#036;font-weight:bold">Resque</span>::<span style="color:#036;font-weight:bold">Plugins</span>::<span style="color:#036;font-weight:bold">Lock</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">perform</span>(repo_id)
    <span style="color:#777"># heavy_lifting</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É só o que você precisa fazer para garantir que esta tarefa não terá o perigo de ser executada em paralelo por acidente. Cuidado: nem toda tarefa em paralelo é ruim, por isso avalie cada situação. Agora, precisamos iniciar os dynos, para isso faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku scale web=4 scheduler=1 worker=2
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Neste exemplo, estou subindo 4 dynos perfil “web”, o que significa capacidade para receber até 16 requisições <em>simultaneamente</em> (neste exemplo, se cada requisição leva em média 100ms para responder, esse número de dynos pode responder até 160 requisições simultaneamente, o que é bastante). Em seguida estou subindo uma única instância do controlador de scheduler (novamente, se você não precisa, ignore). E finalmente subindo 2 dynos perfil “worker”, cada um com 2 workers Resque, totalizando 4 trabalhadores escutando a fila do Redis e podendo executar até 4 tarefas em paralelo. Para o Redis, significa que precisamos ter no mínimo capacidade para receber 16 + 1 + 4 = 21 conexões simultâneas. A mesma quantidade de conexões no banco de dados PostgreSQL (lembre-se sempre disso!)</p>
<h2>Assets na Amazon S3</h2>
<p>A <a href="https://devcenter.heroku.com/s3">própria documentação do Heroku</a> explica como você faz seus assets serem servidos por CDNs como CloudFront ou Amazon. Leia atentamente para ter mais detalhes, aqui vou resumir algumas coisas importantes.</p>
<p>Primeiro, obviamente, crie sua conta na <a href="https://aws.amazon.com/">Amazon Web Services</a>, coloque seu cartão de crédito e tenha acesso ao <a href="https://console.aws.amazon.com/console/home">Dashboard</a> que permite controlar os diversos serviços que quer usar. No caso abra o S3 e configure “Buckets” que é como se fossem “diretórios” para seus assets.</p>
<p>Se quiser, pode criá-los diretamente usando as APIs da Amazon, diretamente num console Ruby como <span class="caps">IRB</span> ou Pry, assim:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">aws/s3</span><span style="color:#710">'</span></span>
<span style="color:#036;font-weight:bold">AWS</span>::<span style="color:#036;font-weight:bold">S3</span>::<span style="color:#036;font-weight:bold">Base</span>.establish_connection!(
  <span style="color:#A60">:access_key_id</span>     =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">...</span><span style="color:#710">'</span></span>,
  <span style="color:#A60">:secret_access_key</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">...</span><span style="color:#710">'</span></span>
)
<span style="color:#036;font-weight:bold">AWS</span>::<span style="color:#036;font-weight:bold">S3</span>::<span style="color:#036;font-weight:bold">Bucket</span>.create(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uploads.mysite</span><span style="color:#710">'</span></span>, <span style="color:#A60">:access</span> =&gt; <span style="color:#A60">:public_read</span>)
<span style="color:#036;font-weight:bold">AWS</span>::<span style="color:#036;font-weight:bold">S3</span>::<span style="color:#036;font-weight:bold">Bucket</span>.create(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">assets.mysite</span><span style="color:#710">'</span></span>, <span style="color:#A60">:access</span> =&gt; <span style="color:#A60">:public_read</span>)
<span style="color:#036;font-weight:bold">AWS</span>::<span style="color:#036;font-weight:bold">S3</span>::<span style="color:#036;font-weight:bold">Bucket</span>.create(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">staging.assets.mysite</span><span style="color:#710">'</span></span>, <span style="color:#A60">:access</span> =&gt; <span style="color:#A60">:public_read</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Obviamente, instale primeiro a gem <tt>aws-s3</tt>. E claro, estou criando 3 buckets de exemplo, crie com quaisquer nomes (únicos, <a href="https://support.rightscale.com/06-FAQs/FAQ_0094_-_What_are_valid_S3_bucket_names%3F">válidos e compatíveis com formato de <span class="caps">DNS</span></a>).</p>
<p>Quando você cria sua conta, também ganha um <strong>Access Key ID</strong> e um <strong>Secret Access Key</strong> que sempre usará para ter permissões nos seus buckets. Mas só isso não basta, você precisa – a partir do Dashboard via web – configurar <strong>policies</strong> para seus buckets. Aprenda como a partir <a href="https://s3browser.com/working-with-amazon-s3-bucket-policies.php#amazon-s3-bucket-policies">deste artigo</a>.</p>
<p>Uma policy tem mais ou menos este formato:</p>
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
      <td class="code"><pre>{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": {
        "AWS": "*"
      },
      "Action": [
        "s3:GetObject"
      ],
      "Resource": [
        "arn:aws:s3:::assets.mysite/*"
      ]
    }
  ]
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não mude a “Version” e coloque o nome correto da sua bucket em “Resource”. Isso vai garantir que quando qualquer assets gravado nessas buckets possam ser devidamente acessadas.</p>
<p>Isso foi só para configurar a Amazon. Agora você precisa configurar sua aplicação para que contenha os dados corretos.</p>
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
      <td class="code"><pre># para versões antigas da gem Heroku:
heroku plugins:install https://github.com/heroku/heroku-labs.git
heroku labs:enable user_env_compile -a mysite
# obrigatório
heroku config:add AWS_ACCESS_KEY_ID=...
heroku config:add AWS_SECRET_ACCESS_KEY=...
heroku config:add FOG_DIRECTORY=assets.mysite
heroku config:add FOG_PROVIDER=AWS
# opcional:
heroku config:add FOG_REGION=us-east-1
heroku config:add ASSET_SYNC_GZIP_COMPRESSION=true
heroku config:add ASSET_SYNC_MANIFEST=false
heroku config:add ASSET_SYNC_EXISTING_REMOTE_FILES=keep
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não deve ser difícil entender essas configurações. Agora, precisamos configurar o arquivo <tt>config/production.rb</tt> com o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>config.action_controller.asset_host = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span><span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">FOG_DIRECTORY</span><span style="color:#710">'</span></span>]<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">.s3.amazonaws.com</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aprenda mais sobre o Asset Pipeline no mínimo lendo o <a href="https://guides.rubyonrails.org/asset_pipeline.html">guia oficial</a>. Não me interessa quem gosta ou não gosta do Asset Pipeline (ou que não gosta porque não sabe usar). Mas vou assumir que independente da opinião, todos aqui sabem usar. Por exemplo, sabem que não pode haver tags <span class="caps">HTML</span> com a <span class="caps">URL</span> da imagem escrita manualmente, mas sim usando helpers como <tt>image_tag</tt> e mesmo no <span class="caps">CSS</span>, estar utilizando <a href="https://sass-lang.com/"><span class="caps">SASS</span></a> para ter acesso a helpers como <tt>image-uri</tt>. Não deve existir URLs do aplicativo, apontando para imagens, stylesheets, javascripts ou qualquer coisa, escritas manualmente sem usar esses helpers. Isso é obrigatório porque em desenvolvimento na sua máquina, ele vai apontar para URLs relativas na sua instância, mas em produção ele vai apontar para URLs externas na Amazon S3.</p>
<p>A grande vantagem é justamente porque quando os navegadores dos seus usuários pedirem imagens, stylesheets, isso vai pro S3 e não vai consumir absolutamente nada nos seus dynos, deixando-os livres para executar exclusivamente tarefas dinâmicas.</p>
<p>Queremos que os assets gerados pelo Asset Pipeline sejam sincronizados nos seus buckets na Amazon S3. Começamos adicionando as seguintes gems no <tt>Gemfile</tt>:</p>
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
      <td class="code"><pre>group <span style="color:#A60">:assets</span> <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#777"># obrigatório</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">sass-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">coffee-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uglifier</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">asset_sync</span><span style="color:#710">'</span></span>
  <span style="color:#777"># recomendado para Sass</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">compass</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">compass-rails</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Lembrando que no Rails 4 não precisa do group “assets”. Continuando, precisamos criar um arquivo de configuração em <tt>config/initializers/asset_sync.rb</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> (<span style="color:#036;font-weight:bold">Rails</span>.env.production? || <span style="color:#036;font-weight:bold">Rails</span>.env.staging?) &amp;&amp; <span style="color:#080;font-weight:bold">defined?</span>(<span style="color:#036;font-weight:bold">AssetSync</span>)
  <span style="color:#036;font-weight:bold">AssetSync</span>.configure <span style="color:#080;font-weight:bold">do</span> |config|
    config.fog_provider = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">FOG_PROVIDER</span><span style="color:#710">'</span></span>]
    config.aws_access_key_id = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">AWS_ACCESS_KEY_ID</span><span style="color:#710">'</span></span>]
    config.aws_secret_access_key = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">AWS_SECRET_ACCESS_KEY</span><span style="color:#710">'</span></span>]
    config.fog_directory = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">FOG_DIRECTORY</span><span style="color:#710">'</span></span>]
    <span style="color:#777"># Increase upload performance by configuring your region</span>
    config.fog_region = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">FOG_REGION</span><span style="color:#710">'</span></span>]
    <span style="color:#777">#</span>
    <span style="color:#777"># Don't delete files from the store</span>
    config.existing_remote_files = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">ASSET_SYNC_EXISTING_REMOTE_FILES</span><span style="color:#710">'</span></span>]
    <span style="color:#777">#</span>
    <span style="color:#777"># Automatically replace files with their equivalent gzip compressed version</span>
    config.gzip_compression = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">ASSET_SYNC_GZIP_COMPRESSION</span><span style="color:#710">'</span></span>]
    <span style="color:#777">#</span>
    <span style="color:#777"># Use the Rails generated 'manifest.yml' file to produce the list of files to</span>
    <span style="color:#777"># upload instead of searching the assets directory.</span>
    <span style="color:#777"># config.manifest == ENV['ASSET_SYNC_MANIFEST']</span>
    <span style="color:#777">#</span>
    <span style="color:#777"># Fail silently.  Useful for environments such as Heroku</span>
    config.fail_silently = <span style="color:#069">true</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Entenda cada configuração e veja qual é a melhor para você, mas esta funciona o suficiente para mim. Não esqueça de configurar o arquivo principal <tt>config/application.rb</tt>:</p>
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
      <td class="code"><pre>config.assets.initialize_on_precompile = <span style="color:#069">false</span> <span style="color:#777"># Rails 4 não precisa disso</span>
config.assets.precompile += <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">active_admin.css cross_browser.css active_admin.js</span><span style="color:#710">)</span></span>
config.assets.enabled = <span style="color:#069">true</span>
<span style="color:#777"># if you prefer `.sass` over `.scss`.</span>
config.sass.preferred_syntax = <span style="color:#A60">:sass</span>
config.assets.initialize_on_precompile = <span style="color:#069">false</span>
<span style="color:#777"># Version of your assets, change this if you want to expire all your assets</span>
config.assets.version = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">1.0</span><span style="color:#710">'</span></span>
config.assets.logger = <span style="color:#069">false</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se você usar o Asset Pipeline direito declarando seus assets nos arquivos de manifesto <tt>app/uploads/stylesheets/application.css.sass</tt> e <tt>app/uploads/javascripts/application.js.erb</tt> tudo corre normalmente, mas arquivos fora desses manifestos que você vai precisar (minimize o uso disso) e declare em <tt>config.assets.precompile</tt>.</p>
<p>Agora, toda vez que a task <tt>assets:precompile</tt> for executada na sua máquina, ela vai se comportar como esperado gerando os arquivos estáticos na pasta local <tt>public/uploads</tt> mas quando for feito deploy com <tt>git push heroku master</tt>, a mesma task vai gerar os assets e realizar upload do que foi modificado no seu bucket na Amazon S3.</p>
<h3>Paperclip e upload de arquivos</h3>
<p>Um adendo, é que não basta os assets estáticos da aplicação estarem no S3, também queremos que quaisquer uploads de usuários do site sejam mandados automaticamente para lá. Procurem as documentações oficiais das principais gems como Paperclip ou Carrierwave. Veja a <a href="https://devcenter.heroku.com/articles/s3#uploading_files_in_rails_with_paperclip">documentação oficial</a> do Heroku sobre Paperclip para aprender mais.</p>
<p>No caso do Carrierwave (eu particular não tenho preferência por nenhum, ambos servem adequadamente para mim), uma classe de uploader seria assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">UserBackgroundImageUploader</span> &lt; <span style="color:#036;font-weight:bold">CarrierWave</span>::<span style="color:#036;font-weight:bold">Uploader</span>::<span style="color:#036;font-weight:bold">Base</span>
  <span style="color:#777"># Include RMagick or MiniMagick support:</span>
  include <span style="color:#036;font-weight:bold">CarrierWave</span>::<span style="color:#036;font-weight:bold">RMagick</span>
  <span style="color:#777"># Choose what kind of storage to use for this uploader:</span>
  storage <span style="color:#A60">:fog</span>
  <span style="color:#777"># Override the directory where uploaded files will be stored.</span>
  <span style="color:#777"># This is a sensible default for uploaders that are meant to be mounted:</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">store_dir</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">uploads/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>model.class.to_s.underscore<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>mounted_as<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">/</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>(model.id)<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Depois meu model de exemplo <tt>User</tt> contém:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">User</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  ...
  mount_uploader <span style="color:#A60">:background_image</span>, <span style="color:#036;font-weight:bold">UserBackgroundImageUploader</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E nas views procuro a <span class="caps">URL</span> da imagem assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#33B">@user</span>.background_image_url
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Até aqui, absolutamente nada de novo. A novidade vem criando o arquivo <tt>config/initializer/carrierwave.rb</tt>:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">CarrierWave</span>.configure <span style="color:#080;font-weight:bold">do</span> |config|
  config.fog_credentials = {
    <span style="color:#A60">:provider</span>               =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">AWS</span><span style="color:#710">'</span></span>,
    <span style="color:#A60">:aws_access_key_id</span>      =&gt; <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">AWS_ACCESS_KEY_ID</span><span style="color:#710">'</span></span>],
    <span style="color:#A60">:aws_secret_access_key</span>  =&gt; <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">AWS_SECRET_ACCESS_KEY</span><span style="color:#710">'</span></span>],
  }
  config.fog_directory  = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uploads.mysite</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso utilizará a configuração que você já fez acima, mas mudamos o nome do bucket para não confundir buckets de ‘assets’ de buckets de ‘uploads dos usuários’. Por isso criamos múltiplos buckets de exemplo, lembra? Inclusive, se criar dynos para ambiente de homologação/staging, lembre-se de criar buckets separados e configurá-los corretamente dependendo do ambiente neste arquivo de configuração.</p>
<p>Só isso deve ser suficiente para todos os uploads serem realizados na sua conta do S3 e não mais consumir sua aplicação Rails no Heroku, mesmo porque o Heroku não permite gravar arquivos localmente nos dynos, pois quando eles forem reiniciados, tudo que não estiver no repositório Git (arquivos temporários, uploads), serão perdidos.</p>
<h2>New Relic</h2>
<p>Um pequeno truque se por acaso estiver usando Unicorn em vez de Thin ou Passenger, da mesma forma como precisamos reconectar no banco em caso de fork no Resque, entenda que o serviço New Relic precisa de tratamento especial quando o Unicorn realiza um novo fork de processo Ruby.</p>
<p>Não vou re-explicar o que todo mundo já sabe sobre configurar NewRelic, a dica é apenas criar o seguinte arquivo em <tt>config/initializers/new_relic_unicorn.rb</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">NewRelic</span>::<span style="color:#036;font-weight:bold">Agent</span>.after_fork(<span style="color:#A60">:force_reconnect</span> =&gt; <span style="color:#069">true</span>) <span style="color:#080;font-weight:bold">if</span> <span style="color:#080;font-weight:bold">defined?</span> <span style="color:#036;font-weight:bold">Unicorn</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Finalmentes</h2>
<p>Para ambiente de testes, a versão grátis do Heroku é boa o suficiente, para produção não esqueça de subir múltiplos dynos (suba 3 ou 4 para começar, monitore e suba mais se precisar). Também faça upgrade dos seus serviços como Redis e PostgreSQL de acordo com o tamanho que precisar, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>heroku addons:upgrade redistogo:medium
heroku addons:add heroku-postgresql:fugu
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quando você cria sua nova aplicação no Heroku, ele te dá um nome arbitrário que você mode mudar no dashboard web do Heroku e ele tem o formato <tt>mysite.herokuapp.com</tt>. No seu provedor de <span class="caps">DNS</span> (como Zerigo ou DNSimple) faça seu domínio (ex www.mysiteoficial.com) apontar para a <span class="caps">URL</span> ‘mysite.herokuapp.com’ (não há IPs fixos porque o EC2 não é feito para funcionar assim). Daí você pode configurar sua aplicação no Heroku para responder ao novo domínio assim:</p>
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
      <td class="code"><pre>heroku addons:add custom_domains
heroku domains:add mysiteoficial.com
heroku domains:add mysiteoficial.com.br
heroku domains:add www.mysiteoficial.com
heroku domains:add www.mysiteoficial.com.br
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Registre a maior quantidade de domínios possíveis (dentro e fora do Brasil), nunca esqueça dos subdomínios. Se errar e precisar apagar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku domains:clear # to stop responding to domains
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O Heroku é extremamente eficiente para ambientes onde você ainda não tem como ter um administrador de sistemas sênior (caro e raridade no mercado) e uma equipe 24×7. Você pode começar pequeno e depois criar sua própria infraestrutura customizada em máquinas diretamente na Amazon EC2, Rackspace Cloud ou outro provedor de Cloud Servers. E sua aplicação, diferente de se fosse num Google App Engine, não precisa ser codificada de forma proprietária. A aplicação Rails continua executando normalmente, e sem grandes mudanças além das que você viu neste post, em qualquer outro servidor devidamente configurado.</p>
<p>Uma configuração grande pra maioria dos sites brasileiros com 5 dynos web, 2 dynos workers, mais um PostgreSQL plano “Fugu”, e outros add-ons menores como Memcached, New Relic, etc vai lhe custar cerca de <span class="caps">USD</span> 700. Alguém pode dizer <em>“Nossa, que caro!”</em> Claro que não. Só o salário de um bom sys admin vai ser pelo menos 4 ou 5 vezes isso por mês, e não estou contando nem o custo de infraestrutura. Portanto, é <strong>barato</strong>. A menos, claro, que seu negócio seja tão ruim que não valha no mínimo isso por mês e, nesse caso, melhor não perder tempo para construí-lo.</p>
<p></p>
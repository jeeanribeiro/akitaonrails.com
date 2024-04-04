---
title: "[Heroku] ActiveRecord::ConnectionTimeoutError: Problemas de Max Pool Size, Sidekiq e Octopus"
date: "2015-10-08T18:41:00.000Z"
tags: ["rails", "sidekiq", "heroku", "postgresql"]
years: "2015"
---

<p></p>
<p><strong>TL;DR</strong>: o problema pode estar na sua configuração de Octopus!</p>
<p><strong>TL;DR 2</strong>: tem várias 'contas de padeiro' que fiz pelo artigo e algumas coisas que podem não estar 100%, então se você ver alguma coisa que precise melhorar, não deixe de colocar nos comentários! Esse assunto fica mudando de tempos em tempos.</p>
<p>Você talvez já tenha esbarrado nesta mensagem de erro algumas vezes, especialmente quando sua aplicação está sob alta demanda de tráfego ou rodando workers pesados de Sidekiq:</p>
<blockquote>
  ActiveRecord::ConnectionTimeoutError: could not obtain a database connection within 5 seconds (waited 5.000134325 seconds). The max pool size is currently 5; consider increasing it.
</blockquote>
<p></p>
<p></p>
<p>Antes de mais nada, vale uma pequena explicação. Todo banco de dados tem um limite máximo de número de conexões, num Postgresql que você não fez tuning o default são <a href="https://wiki.postgresql.org/wiki/Tuning_Your_PostgreSQL_Server">100 max_connections</a>.</p>
<p>Apps Ruby on Rails implementam a arquitetura de <a href="https://blog.engineyard.com/2014/scale-everything">"shared-nothing"</a> onde cada processo Web é independente de estado. O estado fica no banco de dados ou outro storage externo.</p>
<p>Cada instância de uma App Rails vai precisar responder a uma requisição Web. Para conseguir concorrência, precisamos de múltiplas instâncias da App. Podemos conseguir isso de 2 maneiras: via threads (como Puma faz) ou via fork de processos (como Unicorn faz). O <a href="https://devcenter.heroku.com/articles/concurrency-and-database-connections">Heroku tem uma excelente documentação</a> de como você deve configurar em um desses casos.</p>
<p>No caso de Unicorn, basicamente o número de Workers será o número de conexões que seu banco precisa aceita, um connection pool não serve de muita coisa. Se usar Puma, com threads, daí dentro do processo você configura o connection pool para compartilhar um número limitado de conexões com as diversas threads. Segure este pensamento para a próxima seção.</p>
<p>Resumindo:</p>
<p>1) Se for usar <a href="https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server">Puma</a>, com Rails 4.1+ ou superior, configure seu <tt>database.yml</tt> assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#606">production</span>:
  <span style="color:#606">url</span>:  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">&lt;%= ENV["DATABASE_URL"] %&gt;</span></span>
  <span style="color:#606">pool</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">&lt;%= ENV["DB_POOL"] || ENV['MAX_THREADS'] || 5 %&gt;</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>2) Se for usar Puma, com Rails inferior a 4.1, adicione o initializer <tt>config/initializers/database_connection.rb</tt>:</p>
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
      <td class="code"><pre><span style="color:#777"># Use config/database.yml method if you are using Rails 4.1+</span>
<span style="color:#036;font-weight:bold">Rails</span>.application.config.after_initialize <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.connection_pool.disconnect!
  <span style="color:#036;font-weight:bold">ActiveSupport</span>.on_load(<span style="color:#A60">:active_record</span>) <span style="color:#080;font-weight:bold">do</span>
    config = <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.configurations[<span style="color:#036;font-weight:bold">Rails</span>.env] ||
                <span style="color:#036;font-weight:bold">Rails</span>.application.config.database_configuration[<span style="color:#036;font-weight:bold">Rails</span>.env]
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">pool</span><span style="color:#710">'</span></span>]              = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">DB_POOL</span><span style="color:#710">'</span></span>]      || <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">MAX_THREADS</span><span style="color:#710">'</span></span>] || <span style="color:#00D">5</span>
    <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.establish_connection(config)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>3) Se for usar <a href="https://devcenter.heroku.com/articles/rails-unicorn">Unicorn</a>, com Rails 4.1+ ou superior, configure o <tt>config/unicorn.rb</tt> adicionando:</p>
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
</pre>
      </td>
      <td class="code"><pre>before_fork <span style="color:#080;font-weight:bold">do</span> |server, worker|
  <span style="color:#777"># other settings</span>
  <span style="color:#080;font-weight:bold">if</span> <span style="color:#080;font-weight:bold">defined?</span>(<span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>)
    <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.connection.disconnect!
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
after_fork <span style="color:#080;font-weight:bold">do</span> |server, worker|
  <span style="color:#777"># other settings</span>
  <span style="color:#080;font-weight:bold">if</span> <span style="color:#080;font-weight:bold">defined?</span>(<span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>)
    <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.establish_connection
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>4) Se for usar Unicorn, com Rails inferior a 4.1+, altere o trecho acima com o seguinte:</p>
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
      <td class="code"><pre>after_fork do |server, worker|
  # other settings
  if defined?(ActiveRecord::Base)
    config = ActiveRecord::Base.configurations[Rails.env] ||
                Rails.application.config.database_configuration[Rails.env]
    config['pool'] = ENV['DB_POOL'] || 5
    ActiveRecord::Base.establish_connection(config)
  end
end
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Preciso usar Sidekiq</h2>
<p>Com Sidekiq a coisa começa a ficar mais complicada porque temos que lidar com configuração de Redis também. Tanto um processo Rails web quanto um worker Sidekiq vão precisar falar com o Redis e com um Banco de Dados (dependendo do que é o worker).</p>
<p>Pior ainda, no caso de um processo Web, a idéia é que a requisição seja executada o mais rápido possível, então ele prende a conexão ao banco pelo menor tempo possível, milissegundos. No caso de um worker Sidekiq a idéia é que ele seja usado justamente para as coisas pesadas como importar arquivos grandes e carregar dados no banco, o que vai pendurar a conexão por muito tempo.</p>
<h2>Quantas conexões vou precisar?</h2>
<p>Um plano Heroku Postgresql Hobby Basic (de USD 9/mês) suporta um máximo de 20 conexões simultâneas.</p>
<p>Na prática, você pode subir 20 workers de Unicorn recebendo até 20 requisições simultâneas. Pode parecer pouco, mas se cada requisição levar 200ms pra processar (que é lento), isso são 5 requisições por segundo por processo. Com 20 processos, isso seriam 100 requisições por segundo ou 360 mil requisições numa hora, que é um número respeitável para qualquer aplicação pequena/média.</p>
<p>Se sua app consumir uns 200mb, isso seriam 2 processos por dyno, ou um máximo de até 10 dynos 1x (de USD 25/mês) para estourar o banco de dados. Essa a conta de padeiro, na prática não é exatamente isso porque penduramos a conexão em tempos diferentes por requisição e não é tão linear assim, mas pra efeitos de ilustração isso deve servir, no geral.</p>
<h2>Como calcular o pool pro Sidekiq</h2>
<p>Com Sidekiq a coisa começa a ficar mais complicada porque temos que lidar com configuração de Redis também. Tanto um processo Rails web quanto um worker Sidekiq vão precisar falar com o Redis e com um Banco de Dados (dependendo do que é o worker).</p>
<p>No caso do Redis, você deve ler <a href="https://github.com/mperham/sidekiq/wiki/Advanced-Options">esta página do Wiki do Sidekiq</a> e usar esta <a href="https://manuel.manuelles.nl/sidekiq-heroku-redis-calc/"><strong>calculadora</strong></a> para saber que tipo de plano de serviços como Redis Cloud você vai precisar (sendo o limitante a quantidade máxima de conexões). De acordo com a calculadora, num cenário de 10 dynos, com 2 web threads, 10 workers de Sidekiq, precisaria configurar concorrência do Sidekiq para 21, e ter 23 conexões do lado do servidor de Sidekiq. Comece configurando o <tt>config/sidekiq.yml</tt> assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#A60">:concurrency</span>: <span style="color:#F00;background-color:#FAA">21</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E o <tt>config/initializers/sidekiq.rb</tt> assim:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">Sidekiq</span>.configure_server <span style="color:#080;font-weight:bold">do</span> |config|
  config.redis = { <span style="color:#606">url</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">redis://redis.example.com:7372/12</span><span style="color:#710">'</span></span>, <span style="color:#606">namespace</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">mynamespace</span><span style="color:#710">'</span></span> }
  database_url = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">DATABASE_URL</span><span style="color:#710">'</span></span>]
  <span style="color:#080;font-weight:bold">if</span> database_url
    <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">DATABASE_URL</span><span style="color:#710">'</span></span>] = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>database_url<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">?pool=25</span><span style="color:#710">"</span></span>
    <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.establish_connection
    <span style="color:#777"># Note that as of Rails 4.1 the `establish_connection` method requires</span>
    <span style="color:#777"># the database_url be passed in as an argument. Like this:</span>
    <span style="color:#777"># ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'])</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O <tt>config.redis[:size]</tt> é calculado automaticamente de acordo com o valor de concorrência no <tt>sidekiq.yml</tt> então não precisa adicionar manualmente.</p>
<p>Agora nosso exercício fica mais complicado porque no caso de um processo Web, a idéia é que a requisição seja executada o mais rápido possível, então ele prende a conexão ao banco pelo menor tempo possível, milissegundos. No caso de um worker Sidekiq a idéia é que ele seja usado justamente para as coisas pesadas como importar arquivos grandes e carregar dados no banco, o que vai pendurar a conexão por muito tempo.</p>
<p>Daí a conta que fizemos anteriormente fica ruim. Porque se eu tiver os 10 workers de Sidekiq processando coisas pesadas ao mesmo tempo, e mexendo no banco de dados ao mesmo tempo, acabei de perder 10 das 20 conexões máximas que eu tinha no plano Hobby Basic. Agora ou eu diminuo o número de Web Dynos de 10 para 5 ou aumento o plano do banco de dados ou otimizo para não precisar usar tantas conexões acima.</p>
<h2>Connection Pool</h2>
<p>Para minimizar esses problemas existem connection pools.</p>
<p>No caso do connection pool do Active Record ele existe dentro de uma instância Rails. No caso do Unicorn não serve pra muita coisa. No caso do Puma, que é multi-thread (com <a href="https://github.com/phusion/passenger/wiki/Puma-vs-Phusion-Passenger">caveats</a>), ajuda um pouco. As threads dentro de um mesmo processo compartilham as conexões nesse pool. Você pode mandar um número de threads maior que o número de conexões no pool, a idéia sendo que dificilmente todas as threads precisam de conexão o tempo todo.</p>
<p>O problema é que cada processo independente de Rails vai ter seu próprio pool. Se usar o padrão de 5 conexões por pool, e tiver 5 Web dynos com Puma, você vai precisar de <em>até</em> 25 conexões ao banco de dados. Isso sem contar o Sidekiq que tem seu próprio connection pool.</p>
<p>Às vezes você não viu que sua configuração ultrapassou o limite do banco porque seu site tem pouco throughput (poucas requisições realmente concorrendo simultaneamente). Mas quando tiver mais concorrência acontecendo, vai começar a sentir os problemas.</p>
<p>Muito rapidamente o problema é que quando você escalar a quantidade de Web ou Worker Dynos vai esbarrar no número máximo de conexões do plano do Postgresql mesmo quando não estiver de fato executando em todas essas conexões, mas elas estão penduradas nos diversos pool, ficando idle, desperdiçando conexões que poderiam estar sendo usadas.</p>
<p>Uma coisa que você pode tentar é adicionar o PgBouncer como a <a href="https://devcenter.heroku.com/articles/concurrency-and-database-connections">própria documentação do Heroku ensina</a>. Pense nela como uma connection pool que é compartilhada por todos os seus processos de Rails, minimizando o desperdício.</p>
<p>Se estiver usando Rails 4.1 configure seu ambiente para desabilitar prepared statements primeiro:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku config:set PGBOUNCER_PREPARED_STATEMENTS=false
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se estiver usando Rails 4.0 nem tente, não vai funcionar.</p>
<p>Se estiver usando Rails 3.2 adicione o arquivo <tt>config/initializers/database_connection.rb</tt>:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">active_record/connection_adapters/postgresql_adapter</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">ActiveRecord::ConnectionAdapters::PostgreSQLAdapter</span>
  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#06B;font-weight:bold">initialize_without_config_boolean_coercion</span> <span style="color:#06B;font-weight:bold">initialize</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(connection, logger, connection_parameters, config)
    <span style="color:#080;font-weight:bold">if</span> config[<span style="color:#A60">:prepared_statements</span>] == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">false</span><span style="color:#710">'</span></span>
      config = config.merge(<span style="color:#606">prepared_statements</span>: <span style="color:#069">false</span>)
    <span style="color:#080;font-weight:bold">end</span>
    initialize_without_config_boolean_coercion(connection, logger, connection_parameters, config)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora para configurar o próprio Heroku execute:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>heroku buildpacks:add https://github.com/heroku/heroku-buildpack-pgbouncer
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-ruby
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E altere o <tt>Procfile</tt> para:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>web: bin/start-pgbouncer-stunnel bundle exec puma -C config/puma.rb
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Sharding e Octopus</h2>
<p>Finalmente, existe outro cenário que eu até recomendo - com prudência. Normalmente quando usamos Sidekiq numa aplicação, eventualmente fazemos Workers pesados para gerar relatórios por exemplo. Um cenário onde você precisa fazer queries pesadas e lentas e você já esgotou todo seu conhecimento de otimização de SQL (criou índices, removeu N+1, denormalizou onde podia, etc).</p>
<p>Quando um worker desses roda, como expliquei antes, a conexão no banco vai ficar travada por muito tempo. Se muitos workers rodarem ao mesmo tempo, você vai engargalar o banco rapidamente, tanto em quantidade de conexões penduradas quanto próprio processamento geral do banco.</p>
<p>Uma solução rápida é criar uma configuração "master-slave" (ou "primary-follower", na nomenclatura mais politicamente correta). No mundo do Heroku isso é feito criando um <a href="https://devcenter.heroku.com/articles/heroku-postgres-follower-databases">banco "Follower"</a> que é <strong>read-only</strong> (somente de leitura) e para onde você vai direcionar apenas as queries pesadas!</p>
<p>Para isso você deve configurar a <a href="https://devcenter.heroku.com/articles/distributing-reads-to-followers-with-octopus">gem Octopus</a> no seu projeto. Em resumo, comece adicionando a gem no seu <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">ar-octopus</span><span style="color:#710">'</span></span>, <span style="color:#606">require</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">octopus</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora <strong>Cuidado</strong> até pouco tempo atrás a documentação no Heroku estava defasada mas você deve criar o arquivo <tt>config/shards.yml</tt> com o exato seguinte conteúdo:</p>
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
<a href="#n44" name="n44">44</a>
<a href="#n45" name="n45">45</a>
<a href="#n46" name="n46">46</a>
<a href="#n47" name="n47">47</a>
<a href="#n48" name="n48">48</a>
<a href="#n49" name="n49">49</a>
<strong><a href="#n50" name="n50">50</a></strong>
<a href="#n51" name="n51">51</a>
<a href="#n52" name="n52">52</a>
<a href="#n53" name="n53">53</a>
<a href="#n54" name="n54">54</a>
<a href="#n55" name="n55">55</a>
<a href="#n56" name="n56">56</a>
<a href="#n57" name="n57">57</a>
<a href="#n58" name="n58">58</a>
<a href="#n59" name="n59">59</a>
<strong><a href="#n60" name="n60">60</a></strong>
<a href="#n61" name="n61">61</a>
<a href="#n62" name="n62">62</a>
<a href="#n63" name="n63">63</a>
<a href="#n64" name="n64">64</a>
<a href="#n65" name="n65">65</a>
<a href="#n66" name="n66">66</a>
<a href="#n67" name="n67">67</a>
<a href="#n68" name="n68">68</a>
<a href="#n69" name="n69">69</a>
<strong><a href="#n70" name="n70">70</a></strong>
<a href="#n71" name="n71">71</a>
<a href="#n72" name="n72">72</a>
<a href="#n73" name="n73">73</a>
<a href="#n74" name="n74">74</a>
<a href="#n75" name="n75">75</a>
<a href="#n76" name="n76">76</a>
<a href="#n77" name="n77">77</a>
<a href="#n78" name="n78">78</a>
<a href="#n79" name="n79">79</a>
<strong><a href="#n80" name="n80">80</a></strong>
<a href="#n81" name="n81">81</a>
<a href="#n82" name="n82">82</a>
<a href="#n83" name="n83">83</a>
<a href="#n84" name="n84">84</a>
</pre>
      </td>
      <td class="code"><pre>&lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%
</span><span style="color:#D20">require 'cgi'</span><span style="color:#710">
</span></span>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uri</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">attribute</span>(name, value, force_string = <span style="color:#069">false</span>)
  <span style="color:#080;font-weight:bold">if</span> value
    value_string =
      <span style="color:#080;font-weight:bold">if</span> force_string
        <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">"</span><span style="color:#710">'</span></span> + value + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">"</span><span style="color:#710">'</span></span>
      <span style="color:#080;font-weight:bold">else</span>
        value
      <span style="color:#080;font-weight:bold">end</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>name<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">: </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>value_string<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">else</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
configs = <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">Rails</span>.env
<span style="color:#080;font-weight:bold">when</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">development</span><span style="color:#710">'</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">test</span><span style="color:#710">'</span></span>
  <span style="color:#777"># use dev and test DB as feaux 'follower'</span>
  <span style="color:#036;font-weight:bold">Array</span>.new(<span style="color:#00D">2</span>){<span style="color:#036;font-weight:bold">YAML</span>::load_file(<span style="color:#036;font-weight:bold">File</span>.open(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">config/database.yml</span><span style="color:#710">"</span></span>))[<span style="color:#036;font-weight:bold">Rails</span>.env]}
<span style="color:#080;font-weight:bold">else</span>
  <span style="color:#777"># staging, production, etc with Heroku config vars for follower DBs</span>
  master_url = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">DATABASE_URL</span><span style="color:#710">'</span></span>]
  slave_keys = <span style="color:#069">ENV</span>.keys.select{|k| k =~ <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">HEROKU_POSTGRESQL_.*_URL</span><span style="color:#404">/</span></span>}
  slave_keys.delete_if{ |k| <span style="color:#069">ENV</span>[k] == master_url }
  slave_keys.map <span style="color:#080;font-weight:bold">do</span> |env_key|
    config = {}
    <span style="color:#080;font-weight:bold">begin</span>
      uri = <span style="color:#036;font-weight:bold">URI</span>.parse(<span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>env_key<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>])
    <span style="color:#080;font-weight:bold">rescue</span> <span style="color:#036;font-weight:bold">URI</span>::<span style="color:#036;font-weight:bold">InvalidURIError</span>
      raise <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Invalid DATABASE_URL</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
    raise <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">No RACK_ENV or RAILS_ENV found</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">unless</span> <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">RAILS_ENV</span><span style="color:#710">"</span></span>] || <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">RACK_ENV</span><span style="color:#710">"</span></span>]
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">color</span><span style="color:#710">'</span></span>] = env_key.match(<span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">HEROKU_POSTGRESQL_(.*)_URL</span><span style="color:#404">/</span></span>)[<span style="color:#00D">1</span>].downcase
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">adapter</span><span style="color:#710">'</span></span>] = uri.scheme
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">adapter</span><span style="color:#710">'</span></span>] = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">postgresql</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">if</span> config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">adapter</span><span style="color:#710">'</span></span>] == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">postgres</span><span style="color:#710">"</span></span>
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">database</span><span style="color:#710">'</span></span>] = (uri.path || <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>).split(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span>)[<span style="color:#00D">1</span>]
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">username</span><span style="color:#710">'</span></span>] = uri.user
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">password</span><span style="color:#710">'</span></span>] = uri.password
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">host</span><span style="color:#710">'</span></span>] = uri.host
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">port</span><span style="color:#710">'</span></span>] = uri.port
    config[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">params</span><span style="color:#710">'</span></span>] = <span style="color:#036;font-weight:bold">CGI</span>.parse(uri.query || <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>)
    config
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
whitelist = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">SLAVE_ENABLED_FOLLOWERS</span><span style="color:#710">'</span></span>].downcase.split(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">, </span><span style="color:#710">'</span></span>) <span style="color:#080;font-weight:bold">rescue</span> <span style="color:#069">nil</span>
blacklist = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">SLAVE_DISABLED_FOLLOWERS</span><span style="color:#710">'</span></span>].downcase.split(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">, </span><span style="color:#710">'</span></span>) <span style="color:#080;font-weight:bold">rescue</span> <span style="color:#069">nil</span>
configs.delete_if <span style="color:#080;font-weight:bold">do</span> |c|
  ( whitelist &amp;&amp; !c[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">color</span><span style="color:#710">'</span></span>].in?(whitelist) ) || ( blacklist &amp;&amp; c[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">color</span><span style="color:#710">'</span></span>].in?(blacklist) )
<span style="color:#080;font-weight:bold">end</span>
<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%&gt;</span><span style="color:#D20">
octopus:
  replicated: true
  fully_replicated: false
  environments:
  &lt;% if configs.present? %</span><span style="color:#710">&gt;</span></span>
    &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%=</span><span style="color:#D20"> "- </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span><span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">RAILS_ENV</span><span style="color:#710">"</span></span>] || <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">RACK_ENV</span><span style="color:#710">"</span></span>] || <span style="color:#036;font-weight:bold">Rails</span>.env<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" %&gt;
  &lt;%</span><span style="color:#710">=</span></span> <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">RAILS_ENV</span><span style="color:#710">"</span></span>] || <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">RACK_ENV</span><span style="color:#710">"</span></span>] || <span style="color:#036;font-weight:bold">Rails</span>.env <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%&gt;</span><span style="color:#D20">:
    &lt;% configs.each_with_index do |c, i| %</span><span style="color:#710">&gt;</span></span>
    &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%=</span><span style="color:#D20"> c.has_key?('color') ? "</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>c[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">color</span><span style="color:#710">'</span></span>]<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">_follower" : "follower_</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>i + <span style="color:#00D">1</span><span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">" %&gt;:
      &lt;%</span><span style="color:#710">=</span></span> attribute <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">adapter</span><span style="color:#710">"</span></span>,  c[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">adapter</span><span style="color:#710">'</span></span>] %&gt;
      &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%=</span><span style="color:#D20"> attribute "database", c['database'] %&gt;
      &lt;%</span><span style="color:#710">=</span></span> attribute <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">username</span><span style="color:#710">"</span></span>, c[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">username</span><span style="color:#710">'</span></span>] %&gt;
      &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%=</span><span style="color:#D20"> attribute "password", c['password'], true %&gt;
      &lt;%</span><span style="color:#710">=</span></span> attribute <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">host</span><span style="color:#710">"</span></span>,     c[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">host</span><span style="color:#710">'</span></span>] %&gt;
      &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%=</span><span style="color:#D20"> attribute "port",     c['port'] %&gt;
      &lt;% (c['params'] || {}).each do |key, value| %&gt;
      &lt;%</span><span style="color:#710">=</span></span> key <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%&gt;</span><span style="color:#D20">: &lt;%= value.first %</span><span style="color:#710">&gt;</span></span>
      &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">% </span><span style="color:#D20">end</span><span style="color:#710"> </span></span>%&gt;
    &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">% </span><span style="color:#D20">end</span><span style="color:#710"> </span></span>%&gt;
  &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">% </span><span style="color:#D20">else</span><span style="color:#710"> </span></span>%&gt;
    - none
  &lt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">% </span><span style="color:#D20">end</span><span style="color:#710"> </span></span>%&gt;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Outra coisa, a documentação defasada instrui a criar um <tt>config/initializers/octopus.rb</tt>. Veja esta <a href="https://github.com/tchandy/octopus/issues/317#issuecomment-129480539">issue no Github</a> para mais detalhes. Em vez disso coloque esta versão simplificada no <tt>config/initializers/octopus.rb</tt> apenas para conseguirmos escolher followers aleatórios (caso tenha mais de 1):</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Octopus</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">shards_in</span>(group=<span style="color:#069">nil</span>)
    config[<span style="color:#036;font-weight:bold">Rails</span>.env].try(<span style="color:#A60">:[]</span>, group.to_s).try(<span style="color:#A60">:keys</span>)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">followers</span>
    shards_in(<span style="color:#A60">:followers</span>)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">random_follower</span>
    followers.sample.to_sym
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">self</span>
    alias_method <span style="color:#A60">:followers_in</span>, <span style="color:#A60">:shards_in</span>
    alias_method <span style="color:#A60">:slaves_in</span>, <span style="color:#A60">:shards_in</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><strong>Pequeno adendo, by Gabriel Sobrinho, um dos mantenedores do projeto Octopus que mandou um feedback a este post:</strong></p>
<blockquote>
  Na verdade a documentação não está defasada, o cara que documentou usou um recurso chamado slave groups mas que é bem específico.
  Slave groups você cria grupos de slaves e na hora de fazer as consultas você especifica qual grupo quer usar, e nessa hora um round-robin é usado para balancear entre os slaves.
  Provavelmente se você tiver mais de um follower e quiser fazer round-robin como tu fez com o initializer, slave groups devem se encaixar melhor.
  Também note que o initializer da documentação quebrava ao ajustar o shards.yml porque ele tentava acessar os slave groups que não existem mais depois do ajuste que sugeri, por isso precisa remover ele.
</blockquote>
<p>Se você não fizer mais nada, todo model ActiveRecord vai, por padrão, continuar lendo e escrevendo do banco primário. Eu não recomendo colocar o método <tt>replicated_model</tt> às cegas como a documentação básica ensina pois isso manda os writes (insert/update/delete) pro banco primário e reads (select) pro banco follower. Isso pode causar efeitos colaterais estranhos, condições de corrida onde você vai tentar ler alguma coisa que acabou de escrever mas ainda não foi replicado pro follower se for rápido demais.</p>
<p>Em vez disso recomendo separar manualmente onde você quer ler do follower, por exemplo, do worker do Sidekiq você faria:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">User</span>.using(<span style="color:#036;font-weight:bold">Octopus</span>.random_follower).find(params[<span style="color:#A60">:user_id</span>])
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso é o equivalente a fazer <tt>User.find(params[:user_id])</tt> no banco primário, mas vai mandar a query pra um dos seus followers. Daí você pode conectar Relations normalmente para fazer queries pesadas (lembre-se de usar <a href="https://api.rubyonrails.org/classes/ActiveRecord/Batches.html">#find_each</a> para queries que retornam objetos demais antes de iterar sobre uma coleção grande demais).</p>
<p>Agora vem o pulo do gato que falei no "TL;DR" acima. Se você usa Sidekiq, pode começar a receber as mensagens de erro que é o título deste post. Você vai notar que o pool padrão de 5 é pequeno pra muitos workers de Sidekiq mas o que fizemos até aqui parece não funcionar, em particular a configuração do <tt>config/sidekiq.rb</tt> que mostramos acima, que sobrescreve a variável padrão <tt>DATABASE_URL</tt> com <tt>?pool=25</tt> (ou outro número, teste sua configuração).</p>
<p>Para passar o valor correto pro connection pool de ActiveRecord do Sidekiq, modifique seu <tt>config/sidekiq.rb</tt> pra ficar assim:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">Sidekiq</span>.configure_client <span style="color:#080;font-weight:bold">do</span> |config|
  config.redis = { <span style="color:#A60">:size</span> =&gt; <span style="color:#00D">1</span> }
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Sidekiq</span>.configure_server <span style="color:#080;font-weight:bold">do</span> |config|
  sidekiq_concurrency = config.options[<span style="color:#A60">:concurrency</span>]
  config = <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.connection.config
  pool_size = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">SIDEKIQ_DB_POOL</span><span style="color:#710">'</span></span>] || sidekiq_concurrency
  <span style="color:#036;font-weight:bold">Octopus</span>.config[<span style="color:#036;font-weight:bold">Rails</span>.env][<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">master</span><span style="color:#710">'</span></span>] = config.merge!(<span style="color:#606">pool</span>: pool_size)
  <span style="color:#036;font-weight:bold">Octopus</span>.config[<span style="color:#036;font-weight:bold">Rails</span>.env].each_key <span style="color:#080;font-weight:bold">do</span> |follower|
    <span style="color:#036;font-weight:bold">Octopus</span>.config[<span style="color:#036;font-weight:bold">Rails</span>.env][follower].merge!(<span style="color:#606">pool</span>: pool_size)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.connection.initialize_shards(<span style="color:#036;font-weight:bold">Octopus</span>.config)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso porque você precisa modificar a configuração do Octopus e não somente do ActiveRecord diretamente. Fazendo isso a configuração correta de pool de banco deve passar corretamente pros workers de Sidekiq e evitar que você fique sem conexões rápido demais por ter um pool muito pequeno. Mas lembre-se do número máximo de conexões do seu banco de dados, quantos Web Dynos e quantos Worker Dynos você tem.</p>
<p>Este é um processo de tentativa e erro em como sempre, depende da sua aplicação. Mas espero que este post tenha o suficiente para deixar você aquecido no assunto para saber onde procurar. Nunca deixe uma aplicação crítica com tráfego pesado num plano como Hobby Basic, o próximo plano que é o Standard-0 já sobe o máximo de conexões de 20 para 120, o Standard-2 já sobe para 400 conexões. Um follower precisa ser do mesmo plano então ao adicionar um banco follower você dobra a quantidade de conexões, daí pode deixar os Web Dynos pendurados no banco primário e os workers pesados de Sidekiq pendurados nos followers. Com a configuração correta de pools, fica menos complexo de gerenciar assim.</p>
<p>Experimente o PgBouncer logo que puder, coloque um banco follower com Octopus e mande seu Sidekiq ficar separado da Web. Já é um bom começo. E nada substitui queries bem feitas (procure gems como o <a href="https://github.com/flyerhzm/bullet">Bullet</a> para ajudar a achar N+1) e não esquecer os índices corretos (tente usar a gem <a href="https://github.com/plentz/lol_dba">lol_dba</a> para achar alguns dos índices faltando - mas cuidado, nem todos são necessários)!</p>
<p>Monitoraramento em produção é essencial! New Relic é obrigatório, <a href="https://devcenter.heroku.com/articles/newrelic#ruby-installation-and-configuration">não deixe de instalar</a> e acompanhar!</p>
<p>Agradecimentos aos meus companheiros Miners Luiz Varela, André Pereira e Carlos Lopes por dividir muito tempo debugando esses problemas comigo.</p>
<p></p>
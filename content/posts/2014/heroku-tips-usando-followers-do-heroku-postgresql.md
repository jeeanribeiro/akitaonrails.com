---
title: "[Heroku Tips] Usando Followers do Heroku Postgresql"
date: "2014-11-10T21:51:00.000Z"
tags: ["rails", "heroku", "postgresql"]
years: "2014"
---

<p></p>
<p>Uma das grandes vantagens de usar o Heroku é poder rapidamente aumentar o tamanho dos dynos para aumentar a capacidade de requisições simultâneas que sua aplicação pode responder. Porém existe um grande problema: você só vai pode aumentar suas dynos até o limite de conexões do seu banco de dados.</p>
<p>Para isso veja direito os planos de <a href="https://addons.heroku.com/heroku-postgresql">Postgresql</a>. Para aplicações médias, você provavelmente vai querer algo do tamanho do plano Standard 2, com até 400 conexões simultâneas e 3.5Gb de RAM. Na teoria, você poderia tranquilamente subir mais de 400 instâncias de Ruby (web e worker), considerando o pool de conexões. Na prática isso não deve acontecer, e isso depende muito do perfil da sua aplicação.</p>
<p>Especialmente considerando aplicações que precisam ou fazer queries muito complexas (relatórios, pré-cálculos que envolvam uma tabela inteira e vários joins) ou então uma aplicação onde escritas (inserts e updates) aconteçam em muito volume (uma aplicação como um Google Spreadsheet ou Twitter-like). Sempre acompanhe o dashboard do Heroku Postgresql para ver quais são os comandos mais lentos. Idealmente cada query deve estar na faixa das dezenas de milissegundos. Quando mais lenta for e quanto mais dados ele precisar carregar em memória, menos dessas você pode fazer concorrentemente no mesmo banco de dados.</p>
<p>Em particular, se você tem muitas tarefas pesadas, então já deveria estar usando workers de <a href="https://github.com/mperham/sidekiq/wiki/Deployment">Sidekiq</a>. Porém se lembre que esses workers estarão usando o mesmo banco que os dynos web também vão usar. Nesse caso se você rodar uma query estupidamente pesada num worker, a experiência do usuário na web vai ser prejudicada.</p>
<p></p>
<p></p>
<p>Uma solução para isso é usar o recurso de <a href="https://devcenter.heroku.com/articles/heroku-postgres-follower-databases">followers</a> que já está bem documentado. Quando você cria uma instância de Heroku Postgresql ele vai criar duas variáveis de ambiente baseado numa cor, por exemplo, HEROKU_POSTGRESQL_RED_URL e DATABASE_URL apontando pro endereço da máquina do Postgresql na Amazon AWS EC2.</p>
<p>Um follower é um banco slave do Postgresql, cujo endereço vai ser apontado numa outra variável de ambiente como, por exemplo, HEROKU_POSTGRESQL_AMBER_URL (digite o comando <tt>heroku config</tt> para ver essas variáveis). Um follower sempre vai estar pelo menos alguns milissegundos atrasado em relação ao banco master. Você sempre precisa se lembrar que nunca deve depender de um dado lido de um follower logo depois de ter feito o comando de Insert/Update.</p>
<p>No conceito básico, toda escrita deve ser feita somente no banco master (e ela sempre será gargalo de escrita, caso você tenha volumes muito estúpidos de escrita - e nesse caso vai ter que cair em outras opções que não é escopo deste post). E as leituras podem ser divididas em múltiplos slaves/followers ("slave" se você for old-school, "follower" se você for politicamente correto).</p>
<p>Porém uma aplicação Rails normal só sabe do banco que está apontado na variável DATABASE_URL, então como fazer para dividir as leituras no follower? Para isso existe a gem <a href="https://github.com/tchandy/octopus">Octopus</a>, criada pelo Thiago Pradi e <a href="https://devcenter.heroku.com/articles/distributing-reads-to-followers-with-octopus">bem documentada</a> pelo próprio Heroku. Resumindo o que já está documentado, comece adicionando a gem no <tt>Gemfile</tt>:</p>
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
<p>Rode o <tt>bundle install</tt> e agora baixe os seguintes arquivos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>curl -L -o config/shards.yml https://gist.github.com/catsby/6923840/raw/0aaf94ccc383951118c43b9b794fc62e427c2e51/shards.yml
curl -L -o config/initializers/octopus.rb https://gist.github.com/catsby/6923632/raw/87b5abba2e22c3acf8ed35d06e0ab9ca1bd9f0d0/octopus.rb
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Com isso feito, em desenvolvimento o master e o follower vão ser o seu banco normal de desenvolvimento. Em produção no Heroku ele vai usar os bancos HEROKU_POSTGRESQL<em>*</em>URL que não são o DATABASE_URL como followers.</p>
<p>Abra o arquivo <tt>config/initializers/octopus.rb</tt> e adicione o seguinte método:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Octopus</span>
  ...
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">random_follower</span>
    followers.sample.to_sym
  <span style="color:#080;font-weight:bold">end</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que acontece é o seguinte, você pode simplesmente adicionar o seguinte método a um model que queira dividir a carga entre escrita no master e leitura no follower:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">User</span>
  replicated_model
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nunca coloque o método acima em <strong>todos</strong> os models indiscriminadamente. Você quer controlar em quais followers quer ler o que. No caso comum basta dividir entre todos os followers, mas caso tenha queries hiper-pesadas e queira dedicar um follower só pra isso, você também pode.</p>
<p>Um caso de uso comum é pegar workers de Sidekiq que façam muitos pré-cálculos, gerem relatórios ou denormalize tabelas grandes e faça o seguinte:</p>
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
      <td class="code"><pre><span style="color:#777"># query pesada normal:</span>
<span style="color:#036;font-weight:bold">ModelPesado</span>.includes(<span style="color:#A60">:abc</span>, <span style="color:#A60">:xyz</span>).scope_pesado.group(<span style="color:#A60">:foo</span>).find_each { |m| m.algo_pesado }
<span style="color:#777"># query modificada pra rodar num follower:</span>
<span style="color:#036;font-weight:bold">ModelPesado</span>.using(<span style="color:#036;font-weight:bold">Octopus</span>.random_follower).includes(<span style="color:#A60">:abc</span>, <span style="color:#A60">:xyz</span>).scope_pesado.group(<span style="color:#A60">:foo</span>).find_each { |m| m.algo_pesado }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sem o método <tt>Octopus.random_follower</tt> você teria que manualmente digitar o nome do follower que quer usar baseado na cor de sua variável de ambiente, por exemplo o HEROKU_POSTGRESQL_AMBER_URL você faria: <tt>.using(:amber_follower)</tt>. Com o método ele vai devolver o único follower que você tem ou aleatoriamente entre a lista de followers que você tem.</p>
<p>Outra forma é o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Octopus</span>.using(<span style="color:#036;font-weight:bold">Octopus</span>.random_follower) <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#036;font-weight:bold">ModelPesado</span>.includes(<span style="color:#A60">:abc</span>, <span style="color:#A60">:xyz</span>).scope_pesado.group(<span style="color:#A60">:foo</span>).find_each { |m| m.algo_pesado }
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Uma coisa que parece necessária, como foi no caso de uma <a href="https://github.com/tchandy/octopus/issues/241">issue do DelayedJob</a> se por algum motivo você precisar rodar um comando como Update dentro de um <tt>find_by_sql</tt>, lembre-se de explicitamente colocá-la no escopo do banco master:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Octopus</span>.using(<span style="color:#A60">:master</span>) <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#036;font-weight:bold">Model</span>.find_by_sql(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">UPDATE ...</span><span style="color:#710">"</span></span>)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como disse antes, isso não é uma solução para que você jogue tudo pro follower. Avalie no próprio dashboard do seu banco de dados quais são as queries pesadas e no New Relic e comece movendo somente essas queries primeiro. Performance não é algo que você codifica sem medir: senão como saber se o que você fez realmente fez alguma diferença? Meça antes e meça depois. E continue nesse ciclo.</p>
<p>A gem Octopus e o recurso de Followers do Heroku Postgresql são excelentes opções para mover queries pesadas e descarregar seu banco master principal, o que vai garantir que sua aplicação possa escalar muito mais com poucas mudanças de código.</p>
<p></p>
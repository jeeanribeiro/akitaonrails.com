---
title: "[Primeiros Passos] Elixir 1.0 + Phoenix Framework 0.13"
date: "2015-06-02T19:14:00.000Z"
tags: ["elixir", "erlang"]
years: "2015"
---

<p></p>
<p>Ainda estou literalmente nos primeiros passos de aprender Elixir corretamente, mas achei interessante fazer um post demonstrando alguma coisa prática.</p>
<p>Para quem ainda não sabia, existe uma linguagem chamada "Erlang" (para "Ericsson Language"), uma linguagem "quase-funcional" com nada menos que 29 anos de idade (lançada em 1986) cujo núcleo é uma virtual machine muito leve, com grande tolerância a falhas e alta concorrência com processos leves e primitivas simples.</p>
<p>Elixir foi criado por ninguém menos que nosso conhecido Railer e Rubista José Valim para ser uma alternativa moderna de linguagem. A linguagem Erlang não é estranha da comunidade Ruby em geral pois Dave Thomas e Andy Hunt evangelizaram muito ela em 2007 pela Pragmatic Programmers. Mas a sintaxe realmente não é agradável para a maioria de nós. Para isso existe o Elixir: para que possamos usar toda a maturidade da VM do Erlang com uma sintaxe agradável com muitos traços de Ruby (embora não seja uma descendência direta).</p>
<p>Depois de alguns anos em desenvolvimento, o Valim fechou a versão 1.0 oficial em Setembro de 2014, então agora é um bom momento para investir tempo em aprender.</p>
<p>Este post não tem como objetivo ser um artigo altamente detalhado, apenas primeira impressões. Para aprender mais vá diretamente à fonte:</p>
<ul>
  <li><a href="http://elixir-lang.org/getting-started/introduction.html">Getting Started</a> - tutorial oficial</li>
  <li><a href="http://elixir-lang.org/learning.html">Learning Resources</a> - livros já publicados</li>
</ul>
<p></p>
<p></p>
<p>Felizmente, <a href="https://elixir-lang.org/install.html">instalar o Elixir</a> hoje é quase tão simples como fazer um simples <tt>brew install elixir</tt> ou <tt>sudo apt-get install elixir</tt>. Veja a documentação oficial para ver como instalar em seu sistema operacional de preferência.</p>
<p>De cara a primeira coisa que você precisa conhecer é a ferramenta <a href="https://elixir-lang.org/docs/v1.0/mix/">Mix</a>. Para rubistas ela é como se fosse uma mistura do nosso Rake com Bundler (já o equivalente Rubygems é o <a href="https://hex.pm">Hex</a>). Ele é responsável por executar tarefas, dentre as quais gerenciar dependências (você vai encontrar um arquivo "<tt>mix.lock</tt>" que é semelhante ao nosso <tt>Gemfile.lock</tt>). Por exemplo, depois de instalar se fizer <tt>mix new phoenix_crud</tt> ele vai criar uma estrutura de diretórios e arquivos padrão com sub-diretórios "config", "lib", "test" (veja o padrão das coisas serem testadas, como na comunidade Ruby), um arquivo "README.md" (veja a preferência por markdown, que é uma tendência), e um arquivo "<tt>mix.exs</tt>" que funciona como uma mistura de um arquivo <tt>Gemfile</tt> e um arquivo Gemspec.</p>
<p>Mas para sermos mais práticos, vamos direto ao assunto: usar o <a href="https://www.phoenixframework.org">web framework Phoenix</a>. Em resumo, o Phoenix parece um Ruby on Rails mais simples. "Mais simples" porque ainda não houve tempo de maturação para ter mais, então cuidado, usar o Phoenix se parece um pouco com usar o Edge Rails (que é o Rails em desenvolvimento atualmente).</p>
<p>Até o momento deste post, o mais "adequado" talvez seja usar diretamente o que está no master do projeto, clonando e rodando diretamente do seu diretório:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>git clone git@github.com:phoenixframework/phoenix.git
cd phoenix/installer
mix phoenix.new /diretorio_de_projetos/phoenix_crud
cd /diretorio_de_projetos/phoenix_crud
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja o uso do comando <tt>mix</tt> com a tarefa <tt>phoenix.new</tt> que é como se existisse no Ruby algo como <tt>rake rails.new</tt> em vez do que fazemos hoje que é <tt>rails new</tt>. No mundo Rails o comando <tt>rails</tt> se sobressaiu ao uso do <tt>rake</tt> mas no mundo Elixir a idéia é manter consistente no comando <tt>mix</tt>.</p>
<p>O resto do artigo assume que você tem PostgreSQL instalado e entende minimamente como configurar roles, e que estamos já dentro do diretório do projeto Phoenix recém-criado.</p>
<p>Veja a estrutura inicial de um projeto Phoenix ("~" significa "semelhante a"):</p>
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
</pre>
      </td>
      <td class="code"><pre>/_build            - provavelmente onde fica os binários compilados
/config            - ~ /config do Rails
  /config.exs      - ~ /config/application.rb
  /dev.exs         - ~ /config/environments/development.rb
  /prod.exs        - ~ /config/environments/production.rb
  /prod.secret.exs - ~ /config/secrets.yml
  /test.exs        - ~ /config/environments/test.rb
/deps              - meio como um RVM gemset e /vendor
/lib
  /phoenix_crud
    /endpoint.ex   - meio como um /config/application.rb
    /repo.ex       - onde configura repositório do Ecto (mais abaixo)
  phoenix_crud.ex  - meio como o /config.ru e /config/boot.rb
/node_modules      - ele vendoriza dependência do Node
/priv
  /repo
    /migration     - incrivelmente igual a /db/migrate
  /static          - quase o mesmo que /public/assets (depois de compilado)
    /css
    /images
    /js
/test              - muito próximo ao nosso /test ou /spec
  /channels
  /controllers
  /models
  /support
  /views
  test_helper.exs  - praticamente o /test/test_helper.rb
/web                        - quase o /app
  /channels                 - para coisas de Web Sockets (futuro equivalente a Action Cable no Rails 5)
  /controllers
    page_controller.ex      
  /models
  /static                   - quase o /app/assets
    /css
      app.scss
    /js
      app.js
    /vendor
      phoenix.js
  /templates
    /layout                 - ~ /app/views/layouts
      application.html.eex
    /page                   - ~ /app/views/pages
      index.html.eex
  /views                    - não é equivalente a /app/views
    error_view.ex           - "acho" que é o que abre acesso a contexto dentro dos templates
    layout_view.ex
    page_view.ex
  router.ex                 - ~ /config/routes.rb
  web.ex                    - cria acesso a contexto dentro de cada classe anterior
brunch-config.js            - Brunch em vez de Sprockets para Asset Pipeline
mix.exs                     - ~ Gemfile
mix.lock                    - ~ Gemfile.lock
package.json                - não existe equivalente ao nosso rails-assets.org
README.md
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como podem ver é incrivelmente próximo ao Rails e fica mais próximo ainda no código. Para começar, precisamos configurar o acesso ao PostgreSQL no arquivo <tt>config/dev.exs</tt> no trecho final:</p>
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
      <td class="code"><pre><span style="color:#777"># Configure your database</span>
config <span style="color:#A60">:phoenix_crud</span>, <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Repo,
  <span style="color:#606">adapter</span>: <span style="color:#036;font-weight:bold">Ecto</span>.Adapters.Postgres,
  <span style="color:#606">username</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">postgres</span><span style="color:#710">"</span></span>,
  <span style="color:#606">password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">postgres</span><span style="color:#710">"</span></span>,
  <span style="color:#606">database</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">phoenix_crud_dev</span><span style="color:#710">"</span></span>,
  <span style="color:#606">size</span>: <span style="color:#00D">10</span> <span style="color:#777"># The amount of database connections in the pool</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se você já configurou um <tt>config/database.yml</tt>, é a mesma coisa. E já que somos meros iniciantes, nada como um bom e velho Scaffold! Como fazer?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>mix phoenix.gen.html User users name:string email:string bio:string age:integer
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Obs: neste instance, o projeto não é compilável. Falta alterar manualmente o arquivo <tt>/web/router.ex</tt>, que vamos fazer mais pra frente.</p>
<p>De qualquer forma, o comando anterior vai criar arquivos como:</p>
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
      <td class="code"><pre><span style="color:#777"># priv/repo/migrations/20150601195745_create_user.exs</span>
defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Repo.Migrations.CreateUser <span style="color:#080;font-weight:bold">do</span>
  use <span style="color:#036;font-weight:bold">Ecto</span>.Migration
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">change</span> <span style="color:#080;font-weight:bold">do</span>
    create table(<span style="color:#A60">:users</span>) <span style="color:#080;font-weight:bold">do</span>
      add <span style="color:#A60">:name</span>, <span style="color:#A60">:string</span>
      add <span style="color:#A60">:email</span>, <span style="color:#A60">:string</span>
      add <span style="color:#A60">:age</span>, <span style="color:#A60">:integer</span>
      timestamps
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sem palavras! É praticamente a mesma DSL de migrations do Rails, o equivalente em Rails seria:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">CreateUser</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Migration</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">change</span>
    create_table <span style="color:#A60">:users</span> <span style="color:#080;font-weight:bold">do</span> |t|
      t.string <span style="color:#A60">:name</span>
      t.string <span style="color:#A60">:email</span>
      t.integer <span style="color:#A60">:age</span>
      t.timestamps
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Um model, por outro lado, é um pouco diferente do ActiveRecord:</p>
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
</pre>
      </td>
      <td class="code"><pre>defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.User <span style="color:#080;font-weight:bold">do</span>
  use <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Web, <span style="color:#A60">:model</span>
  schema <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">users</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
    field <span style="color:#A60">:name</span>, <span style="color:#A60">:string</span>
    field <span style="color:#A60">:email</span>, <span style="color:#A60">:string</span>
    field <span style="color:#A60">:bio</span>, <span style="color:#A60">:string</span>
    field <span style="color:#A60">:number_of_pets</span>, <span style="color:#A60">:integer</span>
    timestamps
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#33B">@required_fields</span> ~w(name email bio number_of_pets)
  <span style="color:#33B">@optional_fields</span> ~w()
  <span style="color:#33B">@doc</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">
  Creates a changeset based on the `model` and `params`.
  If `params` are nil, an invalid changeset is returned
  with no validation performed.
  </span><span style="color:#710">"</span></span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">changeset</span>(model, params <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#A60">:empty</span>) <span style="color:#080;font-weight:bold">do</span>
    model
    |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Diretivas como o <tt>@required_fields</tt> funciona mais ou menos como declarar um <tt>validates :field, presence: true</tt>. A diferença maior é com o <tt>changeset/2</tt> (essa notação quer mais ou menos dizer: função com arity 2, ou seja, aceita 2 argumentos).</p>
<p>E de cara batemos com uma das funcionalidades que chamou mais atenção no Elixir, o operador "pipe" que é o <tt>|&gt;</tt>.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>model |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse trecho é a mesma coisa que:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>cast(model, params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É para os casos onde faríamos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>foo(bar(baz), options)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se entendi direito, faríamos o seguinte com pipes:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>baz |&gt; bar() |&gt; foo(options)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E voltando ao <tt>changeset</tt>, segundo a <a href="https://www.phoenixframework.org/v0.13.1/docs/ecto-models">documentação no site do Phoenix</a> usaríamos desta forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>params = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">name: "Joe Example", email: "joe@example.com", age: 15</span><span style="color:#710">}</span></span>
changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(%<span style="color:#036;font-weight:bold">User</span>{}, params)
changeset.valid?
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Rails, seria mais ou menos o equivalente a:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>params = {<span style="color:#606">name</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Joe Example</span><span style="color:#710">"</span></span>, <span style="color:#606">email</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">joe@example.com</span><span style="color:#710">"</span></span>, <span style="color:#606">age</span>: <span style="color:#00D">15</span>}
user = <span style="color:#036;font-weight:bold">User</span>.new(params)
user.valid?
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para realmente adicionar validações como no ActiveRecord, adicionamos quaisquer transformações ou validações ao pipeline do changeset, o que faz muito sentido:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">changeset</span>(model, params <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#069">nil</span>) <span style="color:#080;font-weight:bold">do</span>
  model
  |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)
  |&gt; validate_length(<span style="color:#A60">:age</span>, <span style="color:#606">min</span>: <span style="color:#00D">18</span>)
  |&gt; validate_length(<span style="color:#A60">:age</span>, <span style="color:#606">max</span>: <span style="color:#00D">80</span>)
  |&gt; validate_format(<span style="color:#A60">:email</span>, ~r/<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">)
end
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Com isso em mente, vejamos o próximo código que foi gerado automaticamente nesse scaffold, o controller:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># web/controllers/user_controller.ex</span>
defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.UserController <span style="color:#080;font-weight:bold">do</span>
  use <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Web, <span style="color:#A60">:controller</span>
  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">PhoenixCrud</span>.User
  plug <span style="color:#A60">:scrub_params</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">user</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">when</span> action <span style="color:#080;font-weight:bold">in</span> [<span style="color:#A60">:create</span>, <span style="color:#A60">:update</span>]
  plug <span style="color:#A60">:action</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span>(conn, _params) <span style="color:#080;font-weight:bold">do</span>
    users = <span style="color:#036;font-weight:bold">Repo</span>.all(<span style="color:#036;font-weight:bold">User</span>)
    render(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">index.html</span><span style="color:#710">"</span></span>, <span style="color:#606">users</span>: users)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">new</span>(conn, _params) <span style="color:#080;font-weight:bold">do</span>
    changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(%<span style="color:#036;font-weight:bold">User</span>{})
    render(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">new.html</span><span style="color:#710">"</span></span>, <span style="color:#606">changeset</span>: changeset)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">"user" =&gt; user_params</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span>
    changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(%<span style="color:#036;font-weight:bold">User</span>{}, user_params)
    <span style="color:#080;font-weight:bold">if</span> changeset.valid? <span style="color:#080;font-weight:bold">do</span>
      <span style="color:#036;font-weight:bold">Repo</span>.insert(changeset)
      conn
      |&gt; put_flash(<span style="color:#A60">:info</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">User created successfully.</span><span style="color:#710">"</span></span>)
      |&gt; redirect(<span style="color:#606">to</span>: user_path(conn, <span style="color:#A60">:index</span>))
    <span style="color:#080;font-weight:bold">else</span>
      render(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">new.html</span><span style="color:#710">"</span></span>, <span style="color:#606">changeset</span>: changeset)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">"id" =&gt; id</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span>
    user = <span style="color:#036;font-weight:bold">Repo</span>.get(<span style="color:#036;font-weight:bold">User</span>, id)
    render(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">show.html</span><span style="color:#710">"</span></span>, <span style="color:#606">user</span>: user)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">edit</span>(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">"id" =&gt; id</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span>
    user = <span style="color:#036;font-weight:bold">Repo</span>.get(<span style="color:#036;font-weight:bold">User</span>, id)
    changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(user)
    render(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">edit.html</span><span style="color:#710">"</span></span>, <span style="color:#606">user</span>: user, <span style="color:#606">changeset</span>: changeset)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">update</span>(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">"id" =&gt; id, "user" =&gt; user_params</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span>
    user = <span style="color:#036;font-weight:bold">Repo</span>.get(<span style="color:#036;font-weight:bold">User</span>, id)
    changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(user, user_params)
    <span style="color:#080;font-weight:bold">if</span> changeset.valid? <span style="color:#080;font-weight:bold">do</span>
      <span style="color:#036;font-weight:bold">Repo</span>.update(changeset)
      conn
      |&gt; put_flash(<span style="color:#A60">:info</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">User updated successfully.</span><span style="color:#710">"</span></span>)
      |&gt; redirect(<span style="color:#606">to</span>: user_path(conn, <span style="color:#A60">:index</span>))
    <span style="color:#080;font-weight:bold">else</span>
      render(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">edit.html</span><span style="color:#710">"</span></span>, <span style="color:#606">user</span>: user, <span style="color:#606">changeset</span>: changeset)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">delete</span>(conn, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">"id" =&gt; id</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span>
    user = <span style="color:#036;font-weight:bold">Repo</span>.get(<span style="color:#036;font-weight:bold">User</span>, id)
    <span style="color:#036;font-weight:bold">Repo</span>.delete(user)
    conn
    |&gt; put_flash(<span style="color:#A60">:info</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">User deleted successfully.</span><span style="color:#710">"</span></span>)
    |&gt; redirect(<span style="color:#606">to</span>: user_path(conn, <span style="color:#A60">:index</span>))
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, de bater o olho é uma estrutura muito semelhante ao nosso conhecido controller restful do Rails. Actions com os mesmos nomes e mesmo o código é muito semelhante. Se tentar ler provavelmente vai entender rapidamente as diferenças em sintaxe.</p>
<p>Dentre as diferenças, imagino que <tt>alias PhoenixCrud.User</tt> é para que possamos usar diretamente dentro dos métodos assim: <tt>user = Repo.get(User, id)</tt> que, se você já entendeu, percebeu que é o equivalente ao nosso conhecido <tt>user = User.find(id)</tt>. A biblioteca Ecto organiza usando o pattern de Repository pelo jeito, que obviamente é diferente do pattern ActiveRecord. Programadores Java vão se sentir mais à vontade, mas não é nada difícil (e não, não comecem um flame se é <a href="https://stackoverflow.com/questions/8550124/what-is-the-difference-between-dao-and-repository-patterns">"Repository do DDD ou mero DAO"</a>!!)</p>
<p>Antes de falar de "plug" vamos mexer no arquivo <tt>router.ex</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre>defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Router <span style="color:#080;font-weight:bold">do</span>
  use <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Web, <span style="color:#A60">:router</span>
  pipeline <span style="color:#A60">:browser</span> <span style="color:#080;font-weight:bold">do</span>
    plug <span style="color:#A60">:accepts</span>, [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">html</span><span style="color:#710">"</span></span>]
    plug <span style="color:#A60">:fetch_session</span>
    plug <span style="color:#A60">:fetch_flash</span>
    plug <span style="color:#A60">:protect_from_forgery</span>
  <span style="color:#080;font-weight:bold">end</span>
  pipeline <span style="color:#A60">:api</span> <span style="color:#080;font-weight:bold">do</span>
    plug <span style="color:#A60">:accepts</span>, [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">json</span><span style="color:#710">"</span></span>]
  <span style="color:#080;font-weight:bold">end</span>
  scope <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">PhoenixCrud</span> <span style="color:#080;font-weight:bold">do</span>
    pipe_through <span style="color:#A60">:browser</span> <span style="color:#777"># Use the default browser stack</span>
    get <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">PageController</span>, <span style="color:#A60">:index</span>
    resources <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/users</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">UserController</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#777"># Other scopes may use custom stacks.</span>
  <span style="color:#777"># scope "/api", PhoenixCrud do</span>
  <span style="color:#777">#   pipe_through :api</span>
  <span style="color:#777"># end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que eu disse quando executamos o scaffold sobre não compilar é porque precisamos adicionar a seguinte linha ao arquivo anterior:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>resources <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/users</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">UserController</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente: parecido com Rails! Mas aqui tem uma coisa que poderia ter no Rails (e eu não ficaria surpreso de ver isso no Rails 5): escopo de middlewares. Plugs são mais ou menos como nossos Rack Middlewares. Um Pipeline de Middlewares ou Plugs funciona encadeando um filtro de request/response atrás do outro. No nosso caso é encadear Racks (por isso o nome "Rack" aliás, literalmente, prateleiras uma em cima ou embaixo da outra).</p>
<p>Lembram do projeto <a href="https://github.com/rails-api/rails-api">Rails-API</a>? Hoje sabemos que ele vai ser incorporado ao Rails 5 mas o Rails-API começa com o próprio Rails 4.2 e desabilitando a maioria das middlewares que não necessárias numa API. Por exemplo, tecnicamente não precisamos processar session ou mensagens flash (mesmo conceito no Phoenix como no Rails) numa API, então a requisição não precisa passar por esses plugs/middlewares.</p>
<p>E de fato, no <tt>router.ex</tt> definimos pipelines separados como escopos, um para <tt>:browser</tt> e outro para <tt>:api</tt> e colocamos nossas rotas específicas para navegação de browser dentro do escopo adequado. Por isso declaramos explicitamente o <tt>resources "/users", UserController</tt> como <tt>pipe_through :browser</tt>. E em particular temos o <tt>plug :scrub_params</tt> no controller definido pras actions "create" e "update" que é onde são necessários. Esperto!</p>
<p>Sem esticar demais este artigo vejamos agora como é uma view. Em vez de ERB (Embedded RuBy) temos EEX (Embedded EliXir). Em particular vamos ver o arquivo gerado automaticamente no scaffold, <tt>web/templates/user/form.html.eex</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#F00;background-color:#FAA">&lt;</span>%= form_for @changeset, @action, fn f -<span style="color:#F00;background-color:#FAA">&gt;</span> %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= if f.errors != [] do %<span style="color:#F00;background-color:#FAA">&gt;</span>
    <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">alert alert-danger</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
      <span style="color:#070">&lt;p&gt;</span>Oops, something went wrong! Please check the errors below:<span style="color:#070">&lt;/p&gt;</span>
      <span style="color:#070">&lt;ul&gt;</span>
        <span style="color:#F00;background-color:#FAA">&lt;</span>%= for {attr, message} <span style="color:#070">&lt;-</span> <span style="color:#b48">f.errors</span> <span style="color:#b48">do</span> <span style="color:#F00;background-color:#FAA">%</span><span style="color:#070">&gt;</span>
          <span style="color:#070">&lt;li&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= humanize(attr) %<span style="color:#F00;background-color:#FAA">&gt;</span> <span style="color:#F00;background-color:#FAA">&lt;</span>%= message %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/li&gt;</span>
        <span style="color:#F00;background-color:#FAA">&lt;</span>% end %<span style="color:#F00;background-color:#FAA">&gt;</span>
      <span style="color:#070">&lt;/ul&gt;</span>
    <span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>% end %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">form-group</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#070">&lt;label&gt;</span>Name<span style="color:#070">&lt;/label&gt;</span>
    <span style="color:#F00;background-color:#FAA">&lt;</span>%= text_input f, :name, class: "form-control" %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
  ...
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">form-group</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#F00;background-color:#FAA">&lt;</span>%= submit "Submit", class: "btn btn-primary" %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>% end %<span style="color:#F00;background-color:#FAA">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Praticamente igual, incluindo o padrão de messages por flash. Correndo o risco de ficar repetitivo: se você já gerou scaffold no Rails algumas vezes, vai notar que é muito parecido mesmo. DSL inspirado fortemente no ActionView com helpers como <tt>form_for</tt>, <tt>humanize</tt>, <tt>text_input</tt>, etc. Ou seja, para desenvolvedores front-end de Rails, estamos praticamente em casa, principalmente porque a idéia é usar diretamente pacotes para Brunch.</p>
<p>Por último, algo que pode ser diferente é o conteúdo do diretório <tt>web/views</tt>, como o arquivo <tt>web/views/user_view.ex</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.UserView <span style="color:#080;font-weight:bold">do</span>
  use <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Web, <span style="color:#A60">:view</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pelo que entendi, ele dá aos templates em EEX o contexto da aplicação, como variáveis criadas no controller. No Rails se definimos um <tt>@users = User.all</tt> a view pode usar como <tt>for user in @users</tt>. No Phoenix explicitamente declaramos isso pela diretiva <tt>use PhoenixCrud.Web, :view</tt>. Esse ":view" está definido no arquivo <tt>web/web.ex</tt> neste trecho:</p>
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
      <td class="code"><pre>defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Web <span style="color:#080;font-weight:bold">do</span>
  ...
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">view</span> <span style="color:#080;font-weight:bold">do</span>
    quote <span style="color:#080;font-weight:bold">do</span>
      use <span style="color:#036;font-weight:bold">Phoenix</span>.View, <span style="color:#606">root</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">web/templates</span><span style="color:#710">"</span></span>
      <span style="color:#777"># Import convenience functions from controllers</span>
      import <span style="color:#036;font-weight:bold">Phoenix</span>.Controller, <span style="color:#606">only</span>: [<span style="color:#606">get_csrf_token</span>: <span style="color:#00D">0</span>, <span style="color:#606">get_flash</span>: <span style="color:#00D">2</span>, <span style="color:#606">view_module</span>: <span style="color:#00D">1</span>]
      <span style="color:#777"># Import URL helpers from the router</span>
      import <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Router.Helpers
      <span style="color:#777"># Use all HTML functionality (forms, tags, etc)</span>
      use <span style="color:#036;font-weight:bold">Phoenix</span>.HTML
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Por isso entendemos que ele declara onde ficam os templates, o contexto do controller, os helpers e funcionalidades de HTML como forms.</p>
<p>Então, com esse código todo, o que podemos fazer?</p>
<p>Primeiro, gostaríamos de ter o equivalente aos nossos <tt>rake db:create</tt> e <tt>rake db:migrate</tt> e de fato:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>mix ecto.create
mix ecto.migrate
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para rodar a aplicação web? Qual o equivalente ao nosso <tt>rails server</tt>?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>mix phoenix.server
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vai subir o servidor Cowboy (o equivalente Puma) na porta 4000 em vez de 3000. Daí teremos telas como estas:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/494/big_Screen_Shot_2015-06-02_at_15.26.26.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/494/Screen_Shot_2015-06-02_at_15.26.26.png 2x" alt="welcome"></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/495/big_Screen_Shot_2015-06-02_at_15.26.34.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/495/Screen_Shot_2015-06-02_at_15.26.34.png 2x" alt="form"></p>
<p>Uma única coisa que faz sentido para um scaffold é que ele já vem pré-configurado para usar Bootstrap. Mas eu recomendo usar com cuidado (sem muito flame, prefira usar algo como um Bourbon com Compass e Susy).</p>
<p>E como está definido em <tt>lib/phoenix_crud/endpoint.ex</tt> sabemos que ele tem suporte a servir arquivos estáticos, live reloading de código, fora o básico como logger, parser, etc. Veja:</p>
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
</pre>
      </td>
      <td class="code"><pre>defmodule <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Endpoint <span style="color:#080;font-weight:bold">do</span>
  use <span style="color:#036;font-weight:bold">Phoenix</span>.Endpoint, <span style="color:#606">otp_app</span>: <span style="color:#A60">:phoenix_crud</span>
  <span style="color:#777"># Serve at "/" the static files from "priv/static" directory.</span>
  <span style="color:#777">#</span>
  <span style="color:#777"># You should set gzip to true if you are running phoenix.digest</span>
  <span style="color:#777"># when deploying your static files in production.</span>
  plug <span style="color:#036;font-weight:bold">Plug</span>.Static,
    <span style="color:#606">at</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span>, <span style="color:#606">from</span>: <span style="color:#A60">:phoenix_crud</span>, <span style="color:#606">gzip</span>: <span style="color:#069">false</span>,
    <span style="color:#606">only</span>: ~w(css images js favicon.ico robots.txt)
  <span style="color:#777"># Code reloading can be explicitly enabled under the</span>
  <span style="color:#777"># :code_reloader configuration of your endpoint.</span>
  <span style="color:#080;font-weight:bold">if</span> code_reloading? <span style="color:#080;font-weight:bold">do</span>
    plug <span style="color:#036;font-weight:bold">Phoenix</span>.LiveReloader
    plug <span style="color:#036;font-weight:bold">Phoenix</span>.CodeReloader
  <span style="color:#080;font-weight:bold">end</span>
  plug <span style="color:#036;font-weight:bold">Plug</span>.Logger
  plug <span style="color:#036;font-weight:bold">Plug</span>.Parsers,
    <span style="color:#606">parsers</span>: [<span style="color:#A60">:urlencoded</span>, <span style="color:#A60">:multipart</span>, <span style="color:#A60">:json</span>],
    <span style="color:#606">pass</span>: [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">*/*</span><span style="color:#710">"</span></span>],
    <span style="color:#606">json_decoder</span>: <span style="color:#036;font-weight:bold">Poison</span>
  plug <span style="color:#036;font-weight:bold">Plug</span>.MethodOverride
  plug <span style="color:#036;font-weight:bold">Plug</span>.Head
  plug <span style="color:#036;font-weight:bold">Plug</span>.Session,
    <span style="color:#606">store</span>: <span style="color:#A60">:cookie</span>,
    <span style="color:#606">key</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">_phoenix_crud_key</span><span style="color:#710">"</span></span>,
    <span style="color:#606">signing_salt</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">JFgnoLpe</span><span style="color:#710">"</span></span>
  plug <span style="color:#A60">:router</span>, <span style="color:#036;font-weight:bold">PhoenixCrud</span>.Router
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Conclusão</h2>
<p>Ainda é cedo para dizer como melhor usar o Phoenix mas de cara vejo uma grande oportunidade para desenvolvedores Ruby conseguirem rapidamente criar "microsserviços" para servir APIs puxando dados de um PostgreSQL. Não cheguei a brincar nem comentar aqui mas na estrutura que mostrei acima existe o diretório <tt>web/channels</tt> para o server-side para Web Sockets e o arquivo vendorizado <tt>web/static/vendor/phoenix.js</tt> que é o client-side Javascript para se conectar nesses channels.</p>
<p>Então para casos de uso como Chats, Push-Notifications ou outras coisas real-time e APIs simples de alta concorrência, talvez seja mais uma excelente opção.</p>
<p>Mas lembrando que embora o Elixir tenha atingido a versão 1.0, o framework Phoenix ainda é bastante jovem (em sua versão 0.13 até o momento deste artigo). Já vi alguns posts de blogs com tutoriais para o Phoenix que mostram código um pouco diferente do que listei neste post e quando forem tentar, talvez já tenha acontecido mais modificações, por isso eu disse que é como acompanhar o Edge Rails.</p>
<p>Não recomendo, claro, fazer uma aplicação para colocar em produção sem ter em mente o comprometimento de que deve precisar fazer manutenções frequentes, para corrigir bugs tanto de funcionamento quanto segurança, que ainda não sabemos se tem ou não (não há nada equivalente a um Brakeman, por exemplo). Mas de qualquer forma, já é possível testar um deployment ao Heroku porque alguém já fez um <a href="https://github.com/HashNuke/heroku-buildpack-elixir">buildpack</a> pra isso.</p>
<p>Apesar das semelhanças com Ruby até aqui, ele não é nem de longe igual aos paradigmas de Ruby. Então a sintaxe serve de incentivo a rubistas para entender mais sobre os paradigmas específicos de Erlang e patterns do OTP. Mas usar o Phoenix como incentivo para aprender mais da linguagem deve servir o mesmo propósito de usar Rails para aprender mais de Ruby.</p>
<p></p>
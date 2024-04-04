---
title: "Internationalização (I18n) Mínima em Rails 3.2 - Parte 2"
date: "2012-07-15T01:44:00.000Z"
tags: ["rails", "i18n", "tutorial"]
years: "2012"
---

<p></p>
<p>Este artigo inicia na <a href="http://akitaonrails.com/2012/07/14/internationalizacao-i18n-minima-em-rails-3-2-parte-1">Parte 1</a>. Leia primeiro antes de continuar.</p>
<p style="text-align: center"><img src="http://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%209.46.44%20PM_original.png?1342313242" srcset="http://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%209.46.44%20PM_original.png?1342313242 2x" alt=""></p>
<p>Se quiser ver como essa aplicação se comporta de verdade, eu subi uma versão numa conta free do Heroku, então <a href="http://i18n-demo.herokuapp.com">clique aqui</a> e veja.</p>
<p></p>
<p></p>
<p>Nesta Parte 2 vamos continuar com as seguinte seções:</p>
<ul>
  <li><a href="#markdown">Seção Bônus: Markdown</a></li>
  <li><a href="#twitterbootstrap">Seção Bônus: Twitter Bootstrap</a></li>
  <li><a href="#activeadminglobalize">ActiveAdmin e Globalize 3</a></li>
  <li><a href="#routes">Rotas Internacionalizadas</a></li>
  <li><a href="#conclusao">Conclusão</a></li>
</ul>
<p><a name="markdown"></a></p>
<h2>Seção Bônus: Markdown</h2>
<p>Outra coisa que quero demonstrar no caso de um aplicativo “estilo” gerenciador de conteúdo (<span class="caps">CMS</span>) é o cache do <span class="caps">HTML</span> que queremos gerar. Neste exemplo defini que o atributo <tt>Article#body</tt> terá texto no formato <a href="https://daringfireball.net/projects/markdown/">Markdown</a>. Poderia ser qualquer outro formato como Textile, Creole, MediaWiki ou o qualquer outro que gere <span class="caps">HTML</span>. É uma forma de simplificar o processo de edição do conteúdo sem precisar de um editor <a href="https://pt.wikipedia.org/wiki/WYSIWYG"><span class="caps">WYSIWYG</span></a> mais complicado como um <a href="https://jhollingworth.github.com/bootstrap-wysihtml5/">bootstrap wysihtml5</a>.</p>
<p>Uma boa engine para converter Markdown em <span class="caps">HTML</span> é o <a href="https://github.com/rtomayko/rdiscount/">RDiscount</a> (olhe também a gem <a href="https://github.com/rtomayko/tilt">Tilt</a>, ambos do Ryan Tomayko). Novamente, apenas adicione a seguinte gem no <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rdiscount</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Usá-lo é muito simples:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">RDiscount</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">texto em **markdown**.</span><span style="color:#710">"</span></span>).to_html <span style="color:#777">#=&gt; &lt;p&gt;&lt;strong&gt;markdown&lt;/strong&gt;&lt;/p&gt;\n</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O erro mais comum é adicionar essa lógica no controller, algo como isso:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">ArticleController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
    <span style="color:#33B">@article</span> = <span style="color:#036;font-weight:bold">Article</span>.find(params[<span style="color:#A60">:id</span>])
    <span style="color:#33B">@html</span> = <span style="color:#036;font-weight:bold">RDiscount</span>.new(<span style="color:#33B">@article</span>.body).to_html
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso acarreta um processamento de conversão para <strong>cada requisição de cada usuários à mesma página</strong>. É exatamente o tipo de cenário que queremos otimizar o quanto antes. A melhor forma, nesse tipo de cenário de conversão, é gravar a versão convertida junto com a original. Por isso na migration do model <tt>Article</tt> já criamos com a coluna <tt>body</tt> e também <tt>body_html</tt>. Então só precisamos adicionar um simples callback no model:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Article</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  attr_accessible <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>, <span style="color:#A60">:slug</span>, <span style="color:#A60">:title</span>, <span style="color:#A60">:locale</span>, <span style="color:#A60">:translations_attributes</span>
  ...
  before_save <span style="color:#A60">:generate_html</span>
  ...
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">translations_attributes=</span>(attributes)
    new_translations = attributes.values.reduce({}) <span style="color:#080;font-weight:bold">do</span> |new_values, translation|
      translation.merge!(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">body_html</span><span style="color:#710">"</span></span> =&gt; <span style="color:#036;font-weight:bold">RDiscount</span>.new(translation[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">body</span><span style="color:#710">"</span></span>] || <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>).to_html )
      new_values.merge! translation.delete(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">locale</span><span style="color:#710">"</span></span>) =&gt; translation
    <span style="color:#080;font-weight:bold">end</span>
    set_translations new_translations
  <span style="color:#080;font-weight:bold">end</span>
private
  ...
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">generate_html</span>
    <span style="color:#069">self</span>.body_html = <span style="color:#036;font-weight:bold">RDiscount</span>.new(<span style="color:#069">self</span>.body).to_html
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso foi simples. Agora não precisa adicionar nada no controller e na view basta chamar diretamente o conteúdo cacheado:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#F00;background-color:#FAA">&lt;</span>%= raw @article.body_html %<span style="color:#F00;background-color:#FAA">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Observe também o método <tt>raw</tt>: como estamos adicionando <span class="caps">HTML</span> vinda de model na view, o Rails, por padrão, vai considerar esse conteúdo “perigoso” e irá escapá-lo. Não é o que queremos, queremos mesmo que o <span class="caps">HTML</span> seja mesclado, para isso precisamos expôr nossa intenção explicitamente dizendo que queremos o <span class="caps">HTML</span> “crú” (raw). Leia mais sobre essa funcionalidade no <a href="https://guides.rubyonrails.org/active_support_core_extensions.html#output-safety">Guia Oficial</a>.</p>
<p>Em particular o método <tt>translations_attributes=</tt> merece atenção. Por causa da forma como o Globalize3 lida com a associação de traduções, ao tentarmos simplesmente adicionar massivamente múltiplas traduções, ele não executa corretamente os <tt>before_filter</tt> para cada linguagem, acaba apagando items que não são a localização configurada atualmente e grava somente um ítem em vez de gravar massivamente múltiplos. Isso particularmente quebra a funcionalidade de ActiveAdmin que vamos discutir mais abaixo.</p>
<p>Para consertar isso, sobrescrevemos o método de assinalação em massa forçando o uso do método <tt>set_translations</tt> do Globalize3. Além disso também já criamos a versão <span class="caps">HTML</span> do campo <tt>body</tt> e gravamos de uma vez, isso porque a versão de cache do <span class="caps">HTML</span> no fundo é uma “tradução” e por isso não vai na tabela principal <tt>articles</tt> mas sim na implícita <tt>article_translations</tt>.</p>
<p><a name="twitterbootstrap"></a></p>
<h2>Seção Bônus: Twitter Bootstrap</h2>
<p>Essa é completamente fora do escopo deste artigo, mas como meu código no Github está utilizando, vou apenas listar como instalei. Para quem não conhece, o Twitter Bootstrap é um conjunto de stylesheets e javascripts para estilizar rapidamente seu site, justamente para casos como este, onde o design não é importante, é basicamente um protótipo e eu queria algo menos feio do que não colocar nada. Existem diversas gems derivadas que utilizam o bootstrap, mas para o básico podemos começar adicionando as seguintes gems no <tt>Gemfile</tt>:</p>
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
      <td class="code"><pre>group <span style="color:#A60">:assets</span> <span style="color:#080;font-weight:bold">do</span>
  ...
  <span style="color:#777"># See https://github.com/sstephenson/execjs#readme for more supported runtimes</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">therubyracer</span><span style="color:#710">'</span></span>, <span style="color:#A60">:platforms</span> =&gt; <span style="color:#A60">:ruby</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">less-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">twitter-bootstrap-rails</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora podemos começar a instalar os arquivos estáticos para a aplicação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails g bootstrap:install application fluid
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E depois podemos adicionar as views estilizadas para cada recurso da sua aplicação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails g bootstrap:themed Articles
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Neste ponto, ele vai criar vários arquivos desnecessários que podemos apagar e precisamos customizar bastante. Não vou copiar todo o fonte das views no arquivo, então faça o clone <a href="https://github.com/akitaonrails/Rails-3-I18n-Demonstration/">deste projeto no Github</a> e aprenda lendo o código que está em <tt>app/uploads</tt> e <tt>app/views</tt>. Compare com os arquivos gerados pelo geradores acima e o que foi modificado.</p>
<p>Um dos pontos importantes a lembrar quando lidamos com plugins de javascript, arquivos <span class="caps">CSS</span>, é não deixar sobrando <tt>require_tree .</tt> sem que você saiba para que serve. Leia meu artigo sobre <a href="https://akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">Assets Pipeline para Iniciantes</a>.</p>
<p>No caso do layout principal note que adicionei bloco de <tt>.navbar</tt> para o menu principal no topo. Adicionei o <tt>yield</tt> onde os outros conteúdos vão se encaixar dentro de um <tt>.container</tt> e temos uma área de botões no rodapé num bloco <tt>.form-actions</tt>. Um cuidado sobre esta gem é que no arquivo que ele cria em <tt>app/uploads/stylesheets/bootstrap_and_overrides.css.less</tt> ele define margens no elemento <tt>body</tt> que são desnecessários, apenas remove essas definições logo no começo do arquivo.</p>
<p>Note também que no meu Github todas as views de Devise que mencionamos anteriormente já estão estilizadas com o bootstrap (por isso que na seção que mencionamos sobre Devise eu faço um <tt>git checkout 0ff207…</tt> para fazer download das views traduzidas mas que ainda não tinham sido estilizadas). Agora você pode voltar ao diretório do meu projeto, fazer <tt>git checkout master</tt> e realizar a mesma cópia dos arquvos para pegar as views estilizadas.</p>
<p>Um lembrete para menus é criar itens que saibam em que controller/action estamos e desabilitar o link da página atual, um exemplo é o que fiz de exemplo nesta aplicação. No arquivo <tt>app/helpers/application_helper.rb</tt> temos:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">ApplicationHelper</span>
  ...
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">navigation_links</span>
    links = []
    options = params[<span style="color:#A60">:controller</span>] == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome</span><span style="color:#710">"</span></span> ? { <span style="color:#080;font-weight:bold">class</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">active</span><span style="color:#710">"</span></span> } : {}
    links &lt;&lt; content_tag(<span style="color:#A60">:li</span>, link_to(t(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello</span><span style="color:#710">"</span></span>), welcome_path), options).html_safe
    options = params[<span style="color:#A60">:controller</span>] == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">articles</span><span style="color:#710">"</span></span> ? { <span style="color:#080;font-weight:bold">class</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">active</span><span style="color:#710">"</span></span> } : {}
    links &lt;&lt; content_tag(<span style="color:#A60">:li</span>, link_to(t(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">articles.title</span><span style="color:#710">"</span></span>), articles_path), options).html_safe
    links &lt;&lt; content_tag(<span style="color:#A60">:li</span>, link_to(t(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">admin.title</span><span style="color:#710">"</span></span>), admin_dashboard_path)).html_safe
    content_tag(<span style="color:#A60">:ul</span>, links.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>).html_safe, <span style="color:#080;font-weight:bold">class</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nav</span><span style="color:#710">"</span></span>)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no layout em <tt>app/views/layouts/application.html.erb</tt> colocamos:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">navbar</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">navbar-inner</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">container</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
      <span style="color:#070">&lt;a</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">brand</span><span style="color:#710">"</span></span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
        <span style="color:#F00;background-color:#FAA">&lt;</span>%= t("site_name") %<span style="color:#F00;background-color:#FAA">&gt;</span>
      <span style="color:#070">&lt;/a&gt;</span>
      <span style="color:#F00;background-color:#FAA">&lt;</span>%= navigation_links %<span style="color:#F00;background-color:#FAA">&gt;</span>
    <span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
<span style="color:#070">&lt;/div&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><a name="activeadminglobalize"></a></p>
<h2>ActiveAdmin e Globalize 3</h2>
<p>O ActiveAdmin é um excelente projeto para termos rapidamente um módulo simples de administração que consegue expôr as operações de <span class="caps">CRUD</span> de um model, incluindo suas validações e até elementos como upload de imagens (caso esteja usando CarrierWave, por exemplo). Por usar por baixo formtastic, customizar seus formulários também não é complicado. Instalar é simples, coloque na <tt>Gemfile</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre>...
group <span style="color:#A60">:assets</span> <span style="color:#080;font-weight:bold">do</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">jquery-ui-rails</span><span style="color:#710">'</span></span>
  ...
<span style="color:#080;font-weight:bold">end</span>
...
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">jquery-rails</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activeadmin</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">ActiveAdmin-Globalize3-inputs</span><span style="color:#710">'</span></span>
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Execute o comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails g active_admin:install
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Uma dica para que o Assets Pipeline não falhe em produção. Precisamos declarar explicitamente os assets do ActiveAdmin. Adicione no <tt>config/application.rb</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>config.assets.precompile += <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">active_admin.js active_admin.css</span><span style="color:#710">)</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora adicione em <tt>app/admin</tt> quaisquer models que precise expor. Leia a <a href="https://activeadmin.info/documentation.html">documentação</a> do ActiveAdmin no site deles mas como exemplo, para customizar a tabela de listagem do model <tt>Article</tt> (<tt>index</tt>) e também a página visualização de um único artigo (<tt>show</tt>), podemos escrever em <tt>app/admin/articles.rb</tt>:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">ActiveAdmin</span>.register <span style="color:#036;font-weight:bold">Article</span> <span style="color:#080;font-weight:bold">do</span>
  index <span style="color:#080;font-weight:bold">do</span>
    column <span style="color:#A60">:id</span>
    column <span style="color:#A60">:slug</span>
    column <span style="color:#A60">:title</span>
    default_actions
  <span style="color:#080;font-weight:bold">end</span>
  show <span style="color:#080;font-weight:bold">do</span> |article|
    attributes_table <span style="color:#080;font-weight:bold">do</span>
      row <span style="color:#A60">:slug</span>
      <span style="color:#036;font-weight:bold">I18n</span>.available_locales.each <span style="color:#080;font-weight:bold">do</span> |locale|
        h3 <span style="color:#036;font-weight:bold">I18n</span>.t(locale, scope: [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">translation</span><span style="color:#710">"</span></span>])
        div <span style="color:#080;font-weight:bold">do</span>
          h4 article.translations.where(locale: locale).first.title
        <span style="color:#080;font-weight:bold">end</span>
        div <span style="color:#080;font-weight:bold">do</span>
          article.translations.where(locale: locale).first.body_html.html_safe
        <span style="color:#080;font-weight:bold">end</span>
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
    active_admin_comments
  <span style="color:#080;font-weight:bold">end</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O bloco <tt>show</tt> é o mais interessante. Aqui estamos usando diretamente a associação <tt>translations</tt> que o Globalize 3 adicionou ao nosso model para buscar explicitamente o conteúdo de uma localização, em vez de puxar o que o model nos der automaticamente baseado na localização. Assim colocamos ambos os conteúdo uma embaixo do outro de uma só vez.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%208.28.56%20PM_original.png?1342308888" srcset="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%208.28.56%20PM_original.png?1342308888 2x" alt=""></p>
<p>Mas e para editar os conteúdos de ambas as localizações? Para isso colocamos além do ActiveAdmin o <a href="https://github.com/mimimi/ActiveAdmin-Globalize3-inputs">ActiveAdmin-Globalize3-inputs</a> e as gems de JQuery (porque vamos precisar do elemento de “Tabs”).</p>
<p>Esse módulo vai utilizar as funcionalidades do ActiveRecord de <a href="https://api.rubyonrails.org/classes/ActiveRecord/NestedAttributes/ClassMethods.html#method-i-accepts_nested_attributes_for">accepts_nested_attributes_for</a> para receber no mesmo formulário <span class="caps">HTML</span> os atributos das associações. Para isso garanta que seu modelo <tt>app/models/article.rb</tt> tem o seguinte:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Article</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  attr_accessible <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>, <span style="color:#A60">:slug</span>, <span style="color:#A60">:title</span>, <span style="color:#A60">:locale</span>, <span style="color:#A60">:translations_attributes</span>
  ...
  translates <span style="color:#A60">:title</span>, <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>
  accepts_nested_attributes_for <span style="color:#A60">:translations</span>
  ...
  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Translation</span>
    attr_accessible <span style="color:#A60">:locale</span>, <span style="color:#A60">:title</span>, <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">translations_attributes=</span>(attributes)
    new_translations = attributes.values.reduce({}) <span style="color:#080;font-weight:bold">do</span> |new_values, translation|
      translation.merge!(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">body_html</span><span style="color:#710">"</span></span> =&gt; <span style="color:#036;font-weight:bold">RDiscount</span>.new(translation[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">body</span><span style="color:#710">"</span></span>] || <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>).to_html )
      new_values.merge! translation.delete(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">locale</span><span style="color:#710">"</span></span>) =&gt; translation
    <span style="color:#080;font-weight:bold">end</span>
    set_translations new_translations
  <span style="color:#080;font-weight:bold">end</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso faz o modelo aceitar <a href="https://guides.rubyonrails.org/security.html#mass-assignment">mass assignment</a> do atributo <tt>translations_attributes</tt>, usamos o <tt>accepts_nested_attributes_for</tt> para que os helpers de formulário saibam como gerar os elementos para os atributos da associação. Uma coisa estranha pode ser o fato de estarmos sobrescrevendo a classe <tt>Article::Translation</tt>. Acredito que é um bug do Globalize 3, e sem essa modificação o <em>mass assignment</em> iria falhar.</p>
<p>Precisamos também adicionar o JQuery UI para o ActiveAdmin. Basta alterar o arquivo <tt>app/uploads/stylesheets/active_admin.css</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>// <span style="color:#339;font-weight:bold">Active</span> <span style="color:#339;font-weight:bold">Admin</span> <span style="color:#339;font-weight:bold">CSS</span> <span style="color:#339;font-weight:bold">Styles</span>
<span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">active_admin/mixins</span><span style="color:#710">"</span></span>;
<span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">active_admin/base</span><span style="color:#710">"</span></span>;
<span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">jquery.ui.tabs</span><span style="color:#710">"</span></span>;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E também o arquivo <tt>app/uploads/javascripts/active_admin.js</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777">//= require active_admin/base</span>
<span style="color:#777">//= require jquery.ui.tabs</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finalmente, precisamos alterar novamente o arquivo de configuração <tt>app/admin/articles.rb</tt> para adicionar o seguinte:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">ActiveAdmin</span>.register <span style="color:#036;font-weight:bold">Article</span> <span style="color:#080;font-weight:bold">do</span>
  ...
  form <span style="color:#080;font-weight:bold">do</span> |f|
    f.input <span style="color:#A60">:slug</span>
    f.globalize_inputs <span style="color:#A60">:translations</span> <span style="color:#080;font-weight:bold">do</span> |lf|
      lf.inputs <span style="color:#080;font-weight:bold">do</span>
        lf.input <span style="color:#A60">:title</span>
        lf.input <span style="color:#A60">:body</span>
        lf.input <span style="color:#A60">:locale</span>, <span style="color:#A60">:as</span> =&gt; <span style="color:#A60">:hidden</span>
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
    f.buttons
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Atributos não internacionalizados como <tt>slug</tt> ficam fora, mas o resto vai dentro do bloco <tt>globalize_inputs</tt> passando o nome da associação, nesse caso <tt>translations</tt>. E dentro de cada sub-formulário precisamos de um campo escondido com a localização desse sub-formulário em particular, para isso temos o campo <tt>locale</tt> como <tt>hidden</tt>.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%208.28.41%20PM_original.png?1342308896" srcset="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%208.28.41%20PM_original.png?1342308896 2x" alt=""></p>
<p>Vale lembrar que o ActiveAdmin suporta internacionalização também. Neste aplicativo escolhi não adicionar esse suporte. É o cenário onde um único administrador controla ambas as linguagens. Mas se você tiver a situação onde cada equipe em cada país cuida da sua própria linguagem, talvez queira adicionar este suporte.</p>
<p>Finalmente, como explicamos na seção sobre Markdown, para que o ActiveAdmin consiga dar <span class="caps">POST</span> de várias traduções ao mesmo tempo, no mesmo formulário, usando a capacidade de assinalamento em massa e <tt>accepts_nested_attributes_for</tt>, temos que sobrescrever o método <tt>translations_attributes=</tt> pois simplesmente inserir os novos registros de tradução na associação não vai funcionar, o Globalize3 vai filtrar essa lista e só vai gravar o registro da localização atual. Mas forçando o uso to método interno do Globalize3, <tt>set_translations</tt>, conseguimos gravar múltiplas traduções ao mesmo tempo.</p>
<p><a name="routes"></a></p>
<h2>Rotas Internacionalizadas</h2>
<p>Deixei por último uma das coisas mais interessantes nesta aplicação. Para efeitos de <span class="caps">SEO</span> também queremos que as URLs sejam traduzidas. Ou seja, queremos que as seguintes URLs todas apontem para o mesmo lugar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>/users/sign_in
/en/users/sign_in
/pt-BR/usuarios/login
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Existem algumas gems que fazem isso, a primeira que esbarrei se chama “i18n_routing”, mas não consegui fazê-la funcionar, acredito que tenha bugs ainda. Se procurar mais vai acabar encontrando a <a href="https://github.com/raul/translate_routes">translate_routes</a> mas ela está obsoleta e dois outros forks passaram a atualizá-la. Uma é a <a href="https://github.com/enriclluelles/route_translator">route_translator</a>, que eu não testei porque parecia ter pouca atividade. A que escolhi usar se chama <a href="https://github.com/francesc/rails-translate-routes">rails-translate-routes</a>. Para adicionar ao projeto, edite seu <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails-translate-routes</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Depois de executar o comando <tt>bundle</tt> precisamos editar o arquivo <tt>config/routes.rb</tt> que controla todas as rotas. Neste estágio, ele deve ter o seguinte conteúdo:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">I18nDemo</span>::<span style="color:#036;font-weight:bold">Application</span>.routes.draw <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#777"># rotas para active admin</span>
  <span style="color:#036;font-weight:bold">ActiveAdmin</span>.routes(<span style="color:#069">self</span>)
  devise_for <span style="color:#A60">:admin_users</span>, <span style="color:#036;font-weight:bold">ActiveAdmin</span>::<span style="color:#036;font-weight:bold">Devise</span>.config
  <span style="color:#777"># rotas de autenticação do Devise</span>
  devise_for <span style="color:#A60">:users</span>
  <span style="color:#777"># rotas pra artigos</span>
  resources <span style="color:#A60">:articles</span>
  <span style="color:#777"># pagina principal</span>
  get <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome/index</span><span style="color:#710">"</span></span>, as: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome</span><span style="color:#710">"</span></span>
  root to: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">welcome#index</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que queremos agora é traduzir todas as rotas públicas, incluindo as do Devise. Porém, como explicado antes, no caso do ActiveAdmin estamos no cenário onde não precisamos de telas de administração traduzidas. Então devemos modificar o arquivo para ficar assim:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">I18nDemo</span>::<span style="color:#036;font-weight:bold">Application</span>.routes.draw <span style="color:#080;font-weight:bold">do</span>
  devise_for <span style="color:#A60">:users</span>
  resources <span style="color:#A60">:articles</span>
  get <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome/index</span><span style="color:#710">"</span></span>, as: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome</span><span style="color:#710">"</span></span>
  root to: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">welcome#index</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">ActionDispatch</span>::<span style="color:#036;font-weight:bold">Routing</span>::<span style="color:#036;font-weight:bold">Translator</span>.translate_from_file(
  <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">config/locales/routes.yml</span><span style="color:#710">'</span></span>, {
    prefix_on_default_locale: <span style="color:#069">true</span>,
    keep_untranslated_routes: <span style="color:#069">true</span> })
<span style="color:#036;font-weight:bold">I18nDemo</span>::<span style="color:#036;font-weight:bold">Application</span>.routes.draw <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#036;font-weight:bold">ActiveAdmin</span>.routes(<span style="color:#069">self</span>)
  devise_for <span style="color:#A60">:admin_users</span>, <span style="color:#036;font-weight:bold">ActiveAdmin</span>::<span style="color:#036;font-weight:bold">Devise</span>.config
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Uma dica é que o bloco de rotas depois do método <tt>#draw</tt> pode ser dividido. Isso é importante porque as rotas definidas antes do método <tt>#translate_from_file</tt> serão traduzidas, e as definidas no bloco abaixo (onde colocamos o ActiveAdmin), não serão.</p>
<p>Este código diz que vamos colocar as traduções no arquivo <tt>config/locales/routes.yml</tt>. Então criamos esse arquivo com o seguinte conteúdo:</p>
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
      <td class="code"><pre><span style="color:#606">en</span>:
  <span style="color:#606">routes</span>:
<span style="color:#606">pt-BR</span>:
  <span style="color:#606">routes</span>:
    <span style="color:#606">welcome</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">bemvindo</span></span>
    <span style="color:#606">new</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">novo</span></span>
    <span style="color:#606">edit</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">editar</span></span>
    <span style="color:#606">destroy</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">destruir</span></span>
    <span style="color:#606">password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">senha</span></span>
    <span style="color:#606">sign_in</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">login</span></span>
    <span style="color:#606">users</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">usuarios</span></span>
    <span style="color:#606">cancel</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">cancelar</span></span>
    <span style="color:#606">article</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">artigo</span></span>
    <span style="color:#606">articles</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">artigos</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O bloco <tt>en.routes</tt> fica vazio porque como nossa aplicação está toda em inglês, por padrão, as rotas são em inglês. Agora no bloco <tt>pt-BR.routes</tt> basta colocarmos as palavras que queremos traduzir, seja ela nome de controller, de action, de resource, e a gem fará o resto. Se executarmos o comando <tt>rake routes</tt> depois de termos isso configurado, teremos:</p>
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
</pre>
      </td>
      <td class="code"><pre>...
article_pt_br GET    /pt-BR/artigos/:id(.:format)    articles#show {:locale=&gt;"pt-BR"}
   article_en GET    /en/articles/:id(.:format)      articles#show {:locale=&gt;"en"}
              GET    /articles/:id(.:format)         articles#show
              PUT    /pt-BR/artigos/:id(.:format)    articles#update {:locale=&gt;"pt-BR"}
              PUT    /en/articles/:id(.:format)      articles#update {:locale=&gt;"en"}
              PUT    /articles/:id(.:format)         articles#update
              DELETE /pt-BR/artigos/:id(.:format)    articles#destroy {:locale=&gt;"pt-BR"}
              DELETE /en/articles/:id(.:format)      articles#destroy {:locale=&gt;"en"}
              DELETE /articles/:id(.:format)         articles#destroy
welcome_pt_br GET    /pt-BR/bemvindo/index(.:format) welcome#index {:locale=&gt;"pt-BR"}
   welcome_en GET    /en/welcome/index(.:format)     welcome#index {:locale=&gt;"en"}
              GET    /welcome/index(.:format)        welcome#index
   root_pt_br        /pt-BR                          welcome#index {:locale=&gt;"pt-BR"}
      root_en        /en                             welcome#index {:locale=&gt;"en"}
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Já se perguntou sobre a necessidade de usar rotas nomeadas como <tt>new_article_path</tt> em vez de digitar direto <tt>/articles/New</tt>? Este é um motivo, a mesma rota nomeada vai levar em consideração o parâmetro implícito de localização e nos dar a <span class="caps">URI</span> traduzida correta sem que você precise alterar mais nada em nenhuma parte da aplicação! Win-win.</p>
<p>Precisamos que a aplicação reconheça o parâmetro <tt>locale</tt> que virá dentro do hash <tt>params</tt> que já conhemos. Vamos colocar um <tt>before_filter</tt> no <tt>/app/controllers/application_controller.rb</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">ApplicationController</span> &lt; <span style="color:#036;font-weight:bold">ActionController</span>::<span style="color:#036;font-weight:bold">Base</span>
  protect_from_forgery
  before_filter <span style="color:#A60">:set_locale</span>
  before_filter <span style="color:#A60">:set_locale_from_url</span>
  private
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">set_locale</span>
    <span style="color:#080;font-weight:bold">if</span> lang = request.env[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">HTTP_ACCEPT_LANGUAGE</span><span style="color:#710">'</span></span>]
      lang = lang[<span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^[a-z]{2}</span><span style="color:#404">/</span></span>]
      lang = <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">pt-BR</span><span style="color:#630">"</span></span> <span style="color:#080;font-weight:bold">if</span> lang == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">pt</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#036;font-weight:bold">I18n</span>.locale = params[<span style="color:#A60">:locale</span>] || lang || <span style="color:#036;font-weight:bold">I18n</span>.default_locale
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora podemos ir em <tt>https://localhost:3000/en/articles</tt> ou <tt>https://localhost:3000/pt-BR/artigos</tt> e vamos chegar no mesmo local. Basta colocarmos na aplicação links para podemos trocar de linguagem em qualquer página que estivermos. Para isso usaremos o helper <tt>url_for</tt> que usará os parâmetros correntes para gerar o link correto da página atual. Precisamos adicionar em <tt>app/helpers/application_helper.rb</tt>:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">ApplicationHelper</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">language_links</span>
    links = []
    <span style="color:#036;font-weight:bold">I18n</span>.available_locales.each <span style="color:#080;font-weight:bold">do</span> |locale|
      locale_key = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">translation.</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>locale<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
      <span style="color:#080;font-weight:bold">if</span> locale == <span style="color:#036;font-weight:bold">I18n</span>.locale
        links &lt;&lt; link_to(<span style="color:#036;font-weight:bold">I18n</span>.t(locale_key), <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">#</span><span style="color:#710">"</span></span>, <span style="color:#080;font-weight:bold">class</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">btn disabled</span><span style="color:#710">"</span></span>)
      <span style="color:#080;font-weight:bold">else</span>
        links &lt;&lt; link_to(<span style="color:#036;font-weight:bold">I18n</span>.t(locale_key), url_for(locale: locale.to_s), <span style="color:#080;font-weight:bold">class</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">btn</span><span style="color:#710">"</span></span>)
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
    links.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>).html_safe
  <span style="color:#080;font-weight:bold">end</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E podemos colocar, neste exemplo, na área de rodapé da aplicação. Então adicionamos ao <tt>app/views/layouts/application.html.erb</tt>:</p>
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
      <td class="code"><pre>...
<span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">form-actions</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= language_links %<span style="color:#F00;background-color:#FAA">&gt;</span>
<span style="color:#070">&lt;/div&gt;</span>
<span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este é o resultado:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%209.26.29%20PM_original.png?1342312042" srcset="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%209.26.29%20PM_original.png?1342312042 2x" alt=""></p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%209.26.01%20PM_original.png?1342312048" srcset="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%209.26.01%20PM_original.png?1342312048 2x" alt=""></p>
<p>Note que neste artigo estou mostrando apenas o exemplo de localização onde a informação vai diretamente na <span class="caps">URL</span>. Mas existem técnicas para manter essa informação em subdomínio, por exemplo, <tt>https://en.dominio.com</tt> e <tt>https://pt.dominio.com</tt>, ou mesmo em Cookie, ou então somente usando a configuração do próprio navegador. De todas eu ainda acho que a mais prática, simples e eficiente é manter na <span class="caps">URL</span>, mas isso é uma opinião que pode não ser suficiente dependendo da sua aplicação. Mas se estiver em dúvida, mantenha desta forma.</p>
<p><a name="conclusao"></a></p>
<h2>Conclusão</h2>
<p>Como podem ver existe muita coisa que podemos fazer em aplicativos internacionalizados. Mesmo que você não esteja iniciando uma aplicação com múltiplas linguagens, não custa sempre fazer o seguinte:</p>
<ul>
  <li>Garanta que todo seu ambiente é UTF8, veja a introdução do artigo novamente. Não é raro encontrar projetos com arquivos misturados entre UTF8 e Latin1 ou pior: banco de dados em Latin1 com templates em UTF8.</li>
  <li>Nunca coloque strings de texto em templates de views, helpers, controllers ou models: sempre separe dentro de arquivos em <tt>config/locales</tt>. Não é difícil, apenas requer disciplina.</li>
  <li>Mesmo que seu model futuramente tenha conteúdo traduzido, não precisa usar o Globalize3 ou semelhante caso não tenha certeza. Olhe na documentação, não é difícil acrescentar o suporte posteriormente.</li>
  <li>Não use funções como <tt>strftime</tt> ou outros formatadores diretamente em templates, separe em métodos helpers ou presenters.</li>
  <li>Quanto a regra de negócio, preste atenção quanto a operações de data e hora (time zones podem variar mesmo no mesmo país) e moeda (conversões)</li>
</ul>
<p></p>
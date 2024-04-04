---
title: "Asset Pipeline para Iniciantes"
date: "2012-07-01T08:34:00.000Z"
tags: ["beginner", "rails", "tutorial", "front-end"]
years: "2012"
---

<p></p>
<p>Este é provavelmente um dos assuntos mais confusos para quem está iniciando com Ruby on Rails. Antigamente, as regras eram simples:</p>
<ul>
  <li>coloque todos os seus <em>assets</em> (imagens, stylesheets e javascripts) organizados nas pastas <tt>public/images</tt>, <tt>public/stylesheets</tt>, <tt>public/javascripts</tt>;</li>
  <li>utilize <em>helpers</em> como <tt>image_tag</tt>, <tt>stylesheet_link_tag</tt> e <tt>javascript_include_tag</tt>;</li>
  <li>configure seu servidor web (Apache, <span class="caps">NGINX</span>) para servir URIs como <tt>/images/rails.png</tt> diretamente de <tt>public/images/rails.png</tt> para não precisar passar pelo Rails;</li>
</ul>
<p>Pronto, está tudo preparado para funcionar. Porém, existiam e ainda existem muitas situações que essa regra não cobria e diversas técnicas, “boas práticas” e gems externas precisaram ser criadas para resolvê-las. Em particular, temos as seguintes situações cotidianas em desenvolvimento web:</p>
<ul>
  <li>quando se tem muitos assets, como javascripts, é considerado boa prática “minificá-los”, ou seja, otimizar ao máximo a quantidade de bytes eliminando supérfluos como espaços em branco e quebras de linha, nomes de variáveis e funções longas, etc. E além disso concatenar a maior quantidade de arquivos num único quanto possível. Em desenvolvimento, precisamos ter todos abertos e individuais para facilitar o debugging, mas em produção o correto é “compilá-los”</li>
  <li>cache precisa ser usado o máximo possível e escrever o caminho a um path manualmente, como <tt>&lt;img src=“/images/rails.png”/&gt;</tt> é ruim, pois se precisarmos mudar o conteúdo dessa imagem, os usuários precisariam limpar seus caches pois o correto é configurarmos os servidores web com diretivas para manter assets no cache local por um longo período de tempo (1 ano ou mais). Helpers como <tt>image_tag</tt> criavam caminhos como <tt>&lt;img src=“/images/rails.png?12345678”/&gt;</tt>, sendo esse número derivado do timestamp de modificação do asset. Assim, se o asset era atualizado esse número mudava. Mas isso não funciona bem com muitos tipos de caches e proxies, que ignoram o que vem depois do “?”</li>
  <li>quando uma página possui dezenas ou às vezes centenas de pequenas imagens e ícones (setas, botões, logotipos de seção, linhas, bordas, etc), o correto é usar a mesma técnica que usamos com stylesheets e javascripts: concatenar muitas imagens em um único arquivo maior e então utilizar <span class="caps">CSS</span> para manipular a posição x e y dentro dessa única imagem grande para posicioná-la corretamente onde precisamos.</li>
  <li>começamos a utilizar vários tipos diferentes de geradores de templates, como <span class="caps">LESS</span> e <span class="caps">SASS</span> para gerar stylesheets, CoffeeScript para gerar Javascript, além do próprio <span class="caps">ERB</span> para adicionar conteúdo dinâmico nos templates.</li>
</ul>
<p>Para resolver essas e outras situações é que foi criado o chamado <a href="http://guides.rubyonrails.org/asset_pipeline.html">Asset Pipeline</a>, que é um conjunto de bibliotecas e convenções para resolver o problema de assets da melhor forma possível. O Asset Pipeline sozinho não resolve tudo, ele é um framework para que seja possível integrar diferentes soluções de forma organizada.</p>
<p>Tudo que será explicado neste artigo vale para o Rails 3.2 e superior, existem diferenças importantes nas versões anteriores que não serão tratadas aqui. Leia o Rails Guides, especialmente os Release Notes de cada versão.</p>
<p></p>
<p></p>
<h2>Iniciando um projeto Rails</h2>
<p>Quando iniciamos um novo projeto com o comando <tt>rails new novo_projeto</tt>, o primeiro arquivo que você vai querer mexer é o <tt>Gemfile</tt>:</p>
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
      <td class="code"><pre><span style="color:#777"># Original</span>
group <span style="color:#A60">:assets</span> <span style="color:#080;font-weight:bold">do</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">sass-rails</span><span style="color:#710">'</span></span>,   <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">~&gt; 3.2.3</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">coffee-rails</span><span style="color:#710">'</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">~&gt; 3.2.1</span><span style="color:#710">'</span></span>
  <span style="color:#777"># See https://github.com/sstephenson/execjs#readme for more supported runtimes</span>
  <span style="color:#777"># gem 'therubyracer', :platforms =&gt; :ruby</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uglifier</span><span style="color:#710">'</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">&gt;= 1.0.3</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#777"># Recomendado para iniciar</span>
group <span style="color:#A60">:assets</span> <span style="color:#080;font-weight:bold">do</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">sass-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">compass-rails</span><span style="color:#710">'</span></span>
  <span style="color:#777"># See https://github.com/sstephenson/execjs#readme for more supported runtimes</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">therubyracer</span><span style="color:#710">'</span></span>, <span style="color:#A60">:platforms</span> =&gt; <span style="color:#A60">:ruby</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uglifier</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não vamos entrar na <a href="https://akitaonrails.com/2011/04/16/a-controversia-coffeescript">controvérsia agora sobre CoffeeScript</a>. Se você está iniciando, esqueça CoffeeScript por enquanto para não complicar ainda mais. Por outro lado, usar o <a href="https://compass-style.org">Compass</a> e particularmente o <a href="https://github.com/Compass/compass-rails/">Compass Rails</a> é algo que nem precisamos discutir já que o Compass provê diversos mixins de Sass muito úteis.</p>
<p>Aliás, se você ainda não conhece <a href="https://sass-lang.com"><span class="caps">SASS</span></a>, faça a você mesmo um favor e aprenda. Se você entende <span class="caps">CSS</span>, não vai ter problemas entendendo Sass, em particular a versão “<span class="caps">SCSS</span>” ou “Sassy <span class="caps">CSS</span>” que não é mais do que um conjunto acima do CSS3. Lembrando que mesmo escolhendo usar <span class="caps">SASS</span> podemos misturar arquivos <tt>.css.scss</tt> e arquivos convencionais <tt>.css</tt> no mesmo projeto.</p>
<p>Ao modificar o arquivo <tt>Gemfile</tt>, lembre-se de executar os seguintes comandos no terminal:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para exercitar, vamos criar um simples controller com uma única página dinâmica para entender o que podemos fazer com isso. De volta ao terminal faça o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>rm public/index.html
bundle exec rails g controller home index
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O resultado será:</p>
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
      <td class="code"><pre>  create  app/controllers/home_controller.rb
   route  get "home/index"
  invoke  erb
  create    app/views/home
  create    app/views/home/index.html.erb
  invoke  test_unit
  create    test/functional/home_controller_test.rb
  invoke  helper
  create    app/helpers/home_helper.rb
  invoke    test_unit
  create      test/unit/helpers/home_helper_test.rb
  invoke  assets
  invoke    js
  create      app/uploads/javascripts/home.js
  invoke    scss
  create      app/uploads/stylesheets/home.css.scss
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para combinar, já que estamos recomendando <span class="caps">SCSS</span>, vamos apagar o arquivo <tt>app/stylesheets/application.css</tt> e criar um novo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>rm app/stylesheets/application.css
touch app/stylesheets/application.css.scss
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E nesse novo arquivo podemos colocar somente:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">compass</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Outra boa prática é ignorar o diretório <tt>public/uploads</tt> do repositório Git (você utilizar <a href="/2012/04/09/screencasts-liberados-gratuitamente">Git</a>, correto?). Faça o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>echo "public/uploads" &gt;&gt; .gitignore
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E agora já podemos iniciar o servidor local de Rails e examinar o que temos até agora:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle exec rails s
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Processo de Pré-Compilação</h2>
<p>Resumidamente, em termos de assets temos os seguintes principais elementos e estrutura:</p>
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
      <td class="code"><pre>app
  assets
    images
      rails.png
    javascripts
      application.js
      home.js
    stylesheets
      application.css.scss
      home.css.scss
  views
    home
      index.html.erb
    layouts
      application.html.erb
config
  application.rb
public
  assets
Gemfile
Gemfile.lock
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O código fonte do layout <tt>app/views/layouts/application.html.erb</tt> contém o seguinte:</p>
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
      <td class="code"><pre><span style="color:#34b">&lt;!DOCTYPE html&gt;</span>
<span style="color:#070">&lt;html&gt;</span>
<span style="color:#070">&lt;head&gt;</span>
  <span style="color:#070">&lt;title&gt;</span>NovoProjeto<span style="color:#070">&lt;/title&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= stylesheet_link_tag    "application", :media =<span style="color:#F00;background-color:#FAA">&gt;</span> "all" %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= javascript_include_tag "application" %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= csrf_meta_tags %<span style="color:#F00;background-color:#FAA">&gt;</span>
<span style="color:#070">&lt;/head&gt;</span>
<span style="color:#070">&lt;body&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>%= yield %<span style="color:#F00;background-color:#FAA">&gt;</span>
<span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se você já tinha visto até o Rails 2.x, um layout padrão <span class="caps">ERB</span> não é tão diferente. Com o servidor de pé, em ambiente de desenvolvimento, vejamos o <span class="caps">HTML</span> gerado ao abrir <tt>https://localhost:3000/home/index</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#34b">&lt;!DOCTYPE html&gt;</span>
<span style="color:#070">&lt;html&gt;</span>
<span style="color:#070">&lt;head&gt;</span>
  <span style="color:#070">&lt;title&gt;</span>NovoProjeto<span style="color:#070">&lt;/title&gt;</span>
  <span style="color:#070">&lt;link</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/application.css</span><span style="color:#710">"</span></span> <span style="color:#b48">media</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">all</span><span style="color:#710">"</span></span> <span style="color:#b48">rel</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stylesheet</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/css</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/jquery.js?body=1</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/jquery_ujs.js?body=1</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/home.js?body=1</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/application.js?body=1</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;meta</span> <span style="color:#b48">content</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">authenticity_token</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">csrf-param</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
  <span style="color:#070">&lt;meta</span> <span style="color:#b48">content</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">OFmZwwtshevVgcs1DUg56WVIQ8NcJZsri/nUubhEJCk=</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">csrf-token</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
<span style="color:#070">&lt;/head&gt;</span>
<span style="color:#070">&lt;body&gt;</span>
<span style="color:#070">&lt;h1&gt;</span>Home#index<span style="color:#070">&lt;/h1&gt;</span>
<span style="color:#070">&lt;p&gt;</span>Find me in app/views/home/index.html.erb<span style="color:#070">&lt;/p&gt;</span>
<span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No <span class="caps">HTML</span> gerado, note que os links para os assets apontam todos para <tt>/uploads</tt>. Além disso note que a chamada <tt>javascript_include_tag(“application”)</tt> expandiu para 4 javascripts diferentes. Para entender isso, precisamos examinar mais de perto o arquivo <tt>app/uploads/javascripts/application.js</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>...
<span style="color:#777">//= require jquery</span>
<span style="color:#777">//= require jquery_ujs</span>
<span style="color:#777">//= require_tree .</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sobre o detalhe do jQuery, todo novo projeto Rails tem declarado <tt>gem ‘jquery-rails’</tt> no <tt>Gemfile</tt>.</p>
<p>Os arquivos <tt>application.∗</tt> podendo “∗” ser “js”, “js.coffee”, “css”, “css.scss”, “css.sass”, “js.erb”, “css.erb”, etc. Eles são conhecidos como “Manifestos”. São arquivos “guarda-chuva” que declaram todos os outros arquivos que eles dependem, em ordem, para serem concatenados em um único arquivo ao serem compilados.</p>
<p>No exemplo padrão, no <tt>application.js</tt> a primeira e segunda linha com <tt>require</tt> declaram o <tt>jquery.js</tt> e depois o <tt>jquery_ujs.js</tt> e a terceira linha com <tt>require_tree .</tt> manda carregar todos os outros arquivos javascripts no mesmo diretório que, por acaso, tem o <tt>home.js</tt> criado pelo gerador de controller que usamos antes. Agora vejam novamente o <span class="caps">HTML</span> gerado e verá que são exatamente os javascripts carregados na ordem que expliquei, sendo o quarto o próprio conteúdo do arquivo <tt>application.js</tt>.</p>
<p>Normalmente usar o <tt>require_tree .</tt> não é exatamente ruim se os javascripts não dependem da ordem de carregamento, mas você provavelmente vai querer declarar explicitamente coisas como plugins de jQuery para garantir que eles estão carregados antes de poder usá-los.</p>
<p>Para explicar como tudo isso funciona é importante pararmos o servidor Rails que subimos antes e reexecutá-lo em modo produçao:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle exec rails s -e production
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, se tentarmos carregar a mesma <span class="caps">URL</span> <tt>https://localhost:3000/home/index</tt> no browser, receberemos um erro 500 com o seguinte backtrace:</p>
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
      <td class="code"><pre>Started GET "/home/index" for 127.0.0.1 at 2012-07-01 03:31:55 -0300
Connecting to database specified by database.yml
Processing by HomeController#index as HTML
  Rendered home/index.html.erb within layouts/application (12.0ms)
Completed 500 Internal Server Error in 155ms
ActionView::Template::Error (application.css isn't precompiled):
    2: &lt;html&gt;
    3: &lt;head&gt;
    4:   &lt;title&gt;NovoProjeto&lt;/title&gt;
    5:   &lt;%= stylesheet_link_tag    "application", :media =&gt; "all" %&gt;
    6:   &lt;%= javascript_include_tag "application" %&gt;
    7:   &lt;%= csrf_meta_tags %&gt;
    8: &lt;/head&gt;
  app/views/layouts/application.html.erb:5:in `_app_views_layouts_application_html_erb__408740569075721590_70099961775620'
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este é o sinal que não realizamos um passo importante que deve ser executado toda vez que você realizar uma atualização em produção: pré-compilar os assets. É o processo que lê os arquivos manifesto e realiza a concatenação dos arquivos declarados e sua minificação (utilizando a gem <a href="https://github.com/lautis/uglifier">Uglifier</a>). Portanto, precisamos executar o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle exec rake assets:precompile
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Lembrando que antes disso o diretório <tt>public/uploads</tt> estava originalmente vazio (e em desenvolvimento, você deve garantir que esse diretório esteja sempre vazio, já explicamos porque). Após executar a a pré-compilação, esse diretório terá os seguintes arquivos:</p>
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
      <td class="code"><pre>application-363316399c9b02b9eb98cd1b13517abd.js
application-363316399c9b02b9eb98cd1b13517abd.js.gz
application-7270767b2a9e9fff880aa5de378ca791.css
application-7270767b2a9e9fff880aa5de378ca791.css.gz
application.css
application.css.gz
application.js
application.js.gz
manifest.yml
rails-be8732dac73d845ac5b142c8fb5f9fb0.png
rails.png
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para entender vejamos o código-fonte do <span class="caps">HTML</span> gerado em produção:</p>
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
      <td class="code"><pre><span style="color:#34b">&lt;!DOCTYPE html&gt;</span>
<span style="color:#070">&lt;html&gt;</span>
<span style="color:#070">&lt;head&gt;</span>
  <span style="color:#070">&lt;title&gt;</span>NovoProjeto<span style="color:#070">&lt;/title&gt;</span>
  <span style="color:#070">&lt;link</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/application-7270767b2a9e9fff880aa5de378ca791.css</span><span style="color:#710">"</span></span> <span style="color:#b48">media</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">all</span><span style="color:#710">"</span></span> <span style="color:#b48">rel</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stylesheet</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/css</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/application-363316399c9b02b9eb98cd1b13517abd.js</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;meta</span> <span style="color:#b48">content</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">authenticity_token</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">csrf-param</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
<span style="color:#070">&lt;meta</span> <span style="color:#b48">content</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">OFmZwwtshevVgcs1DUg56WVIQ8NcJZsri/nUubhEJCk=</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">csrf-token</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
<span style="color:#070">&lt;/head&gt;</span>
<span style="color:#070">&lt;body&gt;</span>
<span style="color:#070">&lt;h1&gt;</span>Home#index<span style="color:#070">&lt;/h1&gt;</span>
<span style="color:#070">&lt;p&gt;</span>Find me in app/views/home/index.html.erb<span style="color:#070">&lt;/p&gt;</span>
<span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Compare este <span class="caps">HTML</span> com o anterior que analisamos gerado em ambiente de desenvolvimento. Em vez de 1 arquivo <span class="caps">CSS</span> e 4 Javascripts, temos apenas 1 <span class="caps">CSS</span> e 1 Javascript.</p>
<p>Para entendermos melhor, vejamos o que tem no arquivo <tt>public/uploads/manifest.yml</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>rails.png: rails-be8732dac73d845ac5b142c8fb5f9fb0.png
application.js: application-363316399c9b02b9eb98cd1b13517abd.js
application.css: application-7270767b2a9e9fff880aa5de378ca791.css
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, o arquivo <tt>application.js</tt> é idêntico ao <tt>application-363316399c9b02b9eb98cd1b13517abd.js</tt>. Se algum dos arquivos declarados no manifesto <tt>app/uploads/javascripts/application.js</tt> mudar, esse número sufixo irá mudar e o <span class="caps">HTML</span> apontará para o novo. Olhando novamente nossa lista de situações que precisam ser solucionadas, que apresentamos no início do arquivo, temos já até aqui a solução de 3 dos pontos:</p>
<ul>
  <li>o ponto 1 explica o problema que é sempre melhor ter apenas um único arquivo de <span class="caps">CSS</span> ou JS do que dezenas deles separados, pois o navegador só precisa ter o peso de pedir um único arquivo (quanto mais arquivos, independente do tamanho, mais tempo vai demorar para a página renderizar). Além disso, graças ao Uglifier teremos esses arquivos “minificados”, ou seja, reescritos de forma a minimizar seu tamanho em bytes sem modificar a lógica da programação. Além disso, o pipeline vai um passo além e tem as versões de todos esses arquivos com extensão “.gz” que significa “gzip”. Se o browser fizer uma requisição dizendo que aceita conteúdo compactado em formato zip, se o web server disser que entende zip, ele pode diretamente enviar a versão do arquivo com extensão “.gz”. No exemplo acima, isso significa enviar um JS de 34kb em vez dos 98kb descomprimidos.</li>
  <li>o ponto 2 explica o problema de quanto assets mudam mas o browser guarda em cache baseado na <span class="caps">URL</span> que ele carregou. Se ele pedisse <tt>https://localhost:3000/uploads/application.js</tt>, mesmo se o JS fosse modificado, o browser não pediria novamente porque a boa prática diz que o web server deveria enviar cabeçalho dizendo para esse tipo de arquivo ficar em cache por 1 ano. Mas como o <span class="caps">HTML</span> na realidade pede por <tt>https://localhost:3000/uploads/application-363316399c9b02b9eb98cd1b13517abd.js</tt>, e se o JS mudar, esse número vai mudar também, não importa mais que esses assets fiquem indefinidamente em cache, pois da próxima vez que precisar dar versão mais nova, o nome do arquivo será completamente diferente do que estava no cache.</li>
  <li>finalmente, o ponto 4 explica sobre os diferente geradores de assets. Implicitamente já podemos ver isso no caso do <span class="caps">SASS</span>, onde arquivos com extensão “.css.scss” são convertidos em “.css”.</li>
</ul>
<p>Para reforçar o ponto 2, vamos adicionar a seguinte função no arquivo <tt>app/uploads/javascripts/application.js</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">function</span> <span style="color:#06B;font-weight:bold">helloWorld</span>() {
  console.log(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>);
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora executamos a pré-compilação novamente:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle exec rake assets:precompile
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que temos no diretório <tt>public/uploads</tt> será:</p>
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
      <td class="code"><pre>application-363316399c9b02b9eb98cd1b13517abd.js
application-363316399c9b02b9eb98cd1b13517abd.js.gz
application-4fee97e9e402a9816ab9b3edf7a4c08b.js
application-4fee97e9e402a9816ab9b3edf7a4c08b.js.gz
application-7270767b2a9e9fff880aa5de378ca791.css
application-7270767b2a9e9fff880aa5de378ca791.css.gz
application.css
application.css.gz
application.js
application.js.gz
manifest.yml
rails-be8732dac73d845ac5b142c8fb5f9fb0.png
rails.png
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como não limpamos o diretório antes, temos a versão antiga e a recente. Compare, a anterior se chamava <tt>application-363316399c9b02b9eb98cd1b13517abd.js</tt> e a nova com a função de demonstração se chama <tt>application-4fee97e9e402a9816ab9b3edf7a4c08b.js</tt>. Reiniciando o servidor Rails no ambiente de produção e vendo o novo <span class="caps">HTML</span> gerado, verá este trecho:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/uploads/application-4fee97e9e402a9816ab9b3edf7a4c08b.js</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Espero que esse detalhamente deixe bem claro o objetivo do pipeline de pré-compilação e as convenções de nomenclatura e quais problemas ele soluciona. Num artigo que escrevi recentemente chamado <a href="https://akitaonrails.com/2012/04/20/heroku-tips-enciclopedia-do-heroku">Enciclopédia do Heroku</a> explico como mover esses assets pré-compilados para uma conta na Amazon S3, com o objetivo de descarregar processamento do seu servidor de aplicação, servindo a partir de um <a href="https://pt.wikipedia.org/wiki/Content_Delivery_Network"><span class="caps">CDN</span></a>, o que deve melhorar a experiência do usuário final ao carregar assets de um servidor mais próximo.</p>
<h2>Parte 2</h2>
<p>O artigo ficou longo, por isso vamos continuar na <a href="https://akitaonrails.com/2012/07/02/asset-pipeline-para-iniciantes-parte-2">Parte 2</a></p>
<p></p>
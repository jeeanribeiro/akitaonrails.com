---
title: "Internationalização (I18n) Mínima em Rails 3.2 - Parte 1"
date: "2012-07-15T01:39:00.000Z"
tags: ["rails", "i18n", "tutorial"]
years: "2012"
---

<p></p>
<p><strong>Aviso:</strong> Não se esqueçam que dias 30 e 31 de Agosto teremos a Rubyconf Brasil 2012! Já garantiu seu ingresso? <a href="http://www.rubyconf.com.br/pt-BR">Compre agora mesmo!</a></p>
<p>Este é um artigo que eu queria escrever há muito tempo, finalmente consegui formatá-lo como queria. Um dos assuntos que até hoje ainda é difícil de explicar para iniciantes é como utilizar o suporte de I18n do Rails. Todos sabem que o Rails possui uma excelente infraestrutura para <a href="http://en.wikipedia.org/wiki/Internationalization_and_localization" title="l10n">internacionalização (i18n) e localização</a>. Porém, a instalação básica do Rails fornece somente a infraestrutura, ou seja, o desenvolvedor é quem deve escolher quais componentes adicionais instalar sobre essa infraestrutura para retirar o máximo que o Rails pode oferecer.</p>
<p>I18n e L10n vai muito mais do que a simples tarefa de substituir strings de texto. Formatação de dados (data, hora, moeda) variam. Codificação dos dados (o padrão sempre tem que ser UTF8!). URLs sensíveis à localização. Modelos sensíveis à localização. Para começar, não pretendo repetir o que todo desenvolvedor Rails já deveria saber, portanto se ainda não leu o <a href="http://guides.rubyonrails.org/i18n.html">Guia Oficial sobre a <span class="caps">API</span> de Internacionalização do Rails</a> sugiro que faça isso antes de continuar lendo este artigo.</p>
<p></p>
<p></p>
<p>Neste guia vou demonstrar o básico de i18n criando uma aplicação mínima, com Devise. Todo os códigos mostrados aqui estão no <a href="https://github.com/akitaonrails/Rails-3-I18n-Demonstration">meu repositório</a> no Github. Se quiser, pule diretamente para a seção que mais lhe interessa:</p>
<ul>
  <li><a href="#bancodados">Banco de Dados e Codificação de Strings</a></li>
  <li><a href="#iniciando">Iniciando uma aplicação Rails</a></li>
  <li><a href="#devise">Devise</a></li>
  <li><a href="#globalize3">Atributos Traduzidos de ActiveRecord com Globalize 3</a></li>
  <li><a href="#friendlyid">Seção Bônus: Friendly Id</a></li>
  <li><a href="https://akitaonrails.com/2012/07/14/internationalizacao-i18n-minima-em-rails-3-2-parte-2">Continuação: Parte 2</a></li>
</ul>
<p><a name="bancodados"></a></p>
<h2>Banco de Dados e Codificação de Strings</h2>
<p>Não pretendo repetir a antiga discussão sobre encodings, UTF8, e o suporte no Ruby 1.9. Se ainda não leu, recomendo que antes de continuar também leia os seguintes artigos do Yehuda Katz:</p>
<ul>
  <li><a href="https://yehudakatz.com/2010/05/05/ruby-1-9-encodings-a-primer-and-the-solution-for-rails/">Ruby 1.9 Encodings: A Primer and the Solution for Rails</a></li>
  <li><a href="https://yehudakatz.com/2010/05/17/encodings-unabridged/">Encodings, Unabridged</a></li>
</ul>
<p>Além disso, uma coisa a se lembrar se você gosta de criar seu banco de dados via linha de comando sem usar o <tt>rake db:create</tt> é adicionar o character set e collate corretos. No MySQL sempre faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>CREATE DATABASE dbname 
  CHARACTER SET utf8 
  COLLATE utf8_general_ci;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no PostgreSQL faça:</p>
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
      <td class="code"><pre>CREATE DATABASE dbname
  WITH OWNER "postgres"
  ENCODING 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8';
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Obviamente, troque <tt>dbname</tt> e <tt>postgres</tt> de acordo com sua aplicação. Não tem coisa que eu abomine mais do que um banco de dados e uma aplicação web desenvolvida em “Latin1” (iso-8859-1) ou pior ainda, em Windows 1252. Apenas para refrescar a memória, até o Ruby 1.8 todo string de texto era nada mais do que uma cadeia de bytes, como em C (justamente mantendo compatibilidade com C). A partir do Ruby 1.9 foi adicionado um complexo sistema para lidar com todo tipo de linguagem, encoding e com isso o suporte a <span class="caps">UTF</span>-8 se tornou bem melhor e deve ser o padrão. Agora um string é uma cadeia de caracteres, que pode se double-byte associado a uma tabela de encoding para garantir que todas as operações de string, incluindo regular expressions, atuem da forma correta sem corromper o texto. O Rails atual também leva isso em consideração e tudo é, por padrão, UTF8. Nunca misture.</p>
<p>Sempre utilize um editor de texto decente que salve arquivos, por padrão, em UTF8. Se estiver em Mac ou Linux isso já é praticamente padrão. Se estiver em Windows, preocupe-se, muitos não gravam em UTF8.</p>
<p>Outra coisa que confunde muitas pessoas, alguns arquivos Ruby recebem um cabeçalho, logo na primeira linha, parecido com as linhas abaixo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># encoding: UTF-8</span>
<span style="color:#777"># coding: UTF-8</span>
<span style="color:#777"># -*- coding: UTF-8 -*-</span>
<span style="color:#777"># -*- coding: utf-8 -*-</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Qualquer uma das opções acima tem o mesmo efeito. A regra é simples: se você tiver somente código Ruby, sem nenhuma string internacionalizada (com acentuações de português, ideogramas em chinês, símbolos) isso não é necessário. Se o arquivo conter texto, daí a checagem do Ruby vai exigir que você explicitamente diga que encoding está no string. Porém, use isso como um <a href="https://en.wikipedia.org/wiki/Code_smell">code smell</a> no caso de uma aplicação web internacionalizada, pois todo texto deveria estar em arquivos de localização (como vamos mostrar). Somente em aplicativos não-internacionalizados, onde o texto às vezes estará misturado ao seu código, isso pode te ajudar.</p>
<p><a name="iniciando"></a></p>
<h2>Iniciando uma aplicação Rails</h2>
<p>Assumindo que estamos usando o Rails 3.2 (3.2.6, para ser mais preciso). Criamos uma aplicação normalmente:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails new i18n_demo
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora vamos fazer algumas mudanças que você deveria fazer em toda aplicação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rm public/index.html
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Adicione as seguintes gems no seu <tt>Gemfile</tt>:</p>
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
      <td class="code"><pre>...
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">devise</span><span style="color:#710">'</span></span>
group <span style="color:#A60">:development</span>, <span style="color:#A60">:test</span> <span style="color:#080;font-weight:bold">do</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rspec-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">pry-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">guard</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">guard-rspec</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">growl</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Modifique seu <tt>config/application.rb</tt>, aproximadamente na linha 28, para ficar como no trecho a seguinte:</p>
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
      <td class="code"><pre><span style="color:#777"># Set Time.zone default to the specified zone and make Active Record auto-convert to this zone.</span>
<span style="color:#777"># Run "rake -D time" for a list of tasks for finding time zone names. Default is UTC.</span>
config.time_zone = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Brasilia</span><span style="color:#710">'</span></span>
<span style="color:#777"># The default locale is :en and all translations from config/locales/*.rb,yml are auto loaded.</span>
<span style="color:#777"># config.i18n.load_path += Dir[Rails.root.join('my', 'locales', '*.{rb,yml}').to_s]</span>
config.i18n.available_locales = [<span style="color:#A60">:en</span>, <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">pt-BR</span><span style="color:#630">"</span></span>]
config.i18n.default_locale = <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">pt-BR</span><span style="color:#630">"</span></span>
<span style="color:#777"># Configure the default encoding used in templates for Ruby 1.9.</span>
config.encoding = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">utf-8</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Neste exemplo considero que estou apenas suportanto Inglês (en) e Português (pt-BR). Por padrão o Rails sempre procurará por arquivos de tradução a partir do diretório <tt>config/locales</tt> e sempre com arquivos no formato <tt>#{locale}.yml</tt> ou <tt>#{locale}rb</tt>, por exemplo, <tt>devise.pt-BR.yml</tt>.</p>
<blockquote>
  <p>Dica: nunca coloque tudo num único arquivo <tt>pt-BR.yml</tt>, separe suas traduções em múltiplos arquivos por assunto, como <tt>rails.pt-BR.yml</tt> para traduções relacionadas aos helpers do Rails e <tt>devise.pt-BR.yml</tt> para traduções específicas da gem Devise.</p>
</blockquote>
<p>Eu particularmente prefiro utilizar arquivos <span class="caps">YAML</span> do que hashes em Ruby. Tecnicamente não faz diferença, mas eu recomendo se manter no <span class="caps">YAML</span>.</p>
<p>Um dos rubistas que há mais tempo vem auxiliando no suporte a i18n no Rails é <a href="https://svenfuchs.com">Sven Fuchs</a>, a grande maioria das técnicas, bibliotecas, e tudo mais que temos de I18n veio inicialmente dele, vale a pena conhecê-lo melhor. Além disso o suporte canônico a arquivos de localização está no seu projeto <a href="https://github.com/svenfuchs/rails-i18n">rails-i18n</a>. Você vai encontrar traduções de praticamente todas as linguagens do mundo que importa. No nosso caso, queremos puxar a localização em Português. Faça assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>curl https://raw.github.com/svenfuchs/rails-i18n/master/rails/locale/pt-BR.yml &gt; config/locales/rails.pt-BR.yml
curl https://raw.github.com/svenfuchs/rails-i18n/master/rails/locale/pt-BR.yml &gt; config/locales/rails.en.yml
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Somente isso já lhe vai traduzir a maioria dos helpers do Rails. Para testar, vamos criar uma página simples:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails g controller welcome index
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Adicione no seu arquivo de rotas:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">I18nDemo</span>::<span style="color:#036;font-weight:bold">Application</span>.routes.draw <span style="color:#080;font-weight:bold">do</span>
  get <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome/index</span><span style="color:#710">"</span></span>, as: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">welcome</span><span style="color:#710">"</span></span>
  root to: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">welcome#index</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E coloque no seu arquivo <tt>app/views/welcome/index.html.erb</tt></p>
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
      <td class="code"><pre>&lt;dl&gt;
  &lt;dt&gt;Number to Currency&lt;/dt&gt;
  &lt;dd&gt;&lt;%= number_to_currency(123.56) %&gt;&lt;/dd&gt;
  &lt;dt&gt;Number to Human&lt;/dt&gt;
  &lt;dd&gt;&lt;%= number_to_human(100_555_123.15) %&gt;&lt;/dd&gt;
  &lt;dt&gt;Date&lt;/dt&gt;
  &lt;dd&gt;&lt;%=l Time.current, format: :long %&gt;&lt;/dd&gt;
  &lt;dt&gt;Time&lt;/dt&gt;
  &lt;dd&gt;&lt;%= distance_of_time_in_words(1.hour + 20.minutes) %&gt;&lt;/dd&gt;
&lt;/dl&gt;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se subir o Webrick com <tt>rails s</tt> e consultar <tt>https://localhost:3000</tt> verá uma página com o seguinte:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%208.35.30%20PM_original.png?1342308971" srcset="https://s3.amazonaws.com/akitaonrails/assets/2012/7/14/Screen%20Shot%202012-07-14%20at%208.35.30%20PM_original.png?1342308971 2x" alt=""></p>
<p>Estará em português porque configuramos a aplicação para que o padrão fosse esse: <tt>config.i18n.default_locale = :“pt-BR”</tt>. Neste momento ainda não temos como mudar a linguagem. Mas não se preocupe, em breve você poderá realizar a mudança. O visual estará diferente da imagem, veremos isso mais para frente.</p>
<p><a name="devise"></a></p>
<h2>Devise</h2>
<p>Praticamente todo aplicativo web precisa de autenticação. Não somente login, mas confirmação de inscrição, email para reiniciar senha, etc. Não pense duas vezes: adicione o Devise. Novamente, não vou repetir o que já foi dito, para aprender mais sobre o assunto, assista o screencast que o Ryan Bates lançou recentemente:</p>
<ul>
  <li><a href="https://railscasts.com/episodes/209-devise-revised" title="revised">Episódio 209: Devise</a></li>
  <li><a href="https://railscasts.com/episodes/210-customizing-devise">Episódio 210: Customizing Devise</a></li>
  <li><a href="https://railscasts.com/episodes/235-devise-and-omniauth-revised" title="revised">Episódio 235: Devise and OmniAuth</a></li>
</ul>
<p>Na prática, dado que já incluímos a gem no <tt>Gemfile</tt> anteriormente e já rodamos <tt>bundle</tt> para instalar as gems, o próximo passo é criar os arquivos que precisamos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>rails g devise:install
rails g devise User
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Da mesma forma como fizemos antes, vamos baixar as traduções que precisamos. O primeiro lugar a procurar é no <a href="https://github.com/plataformatec/devise/wiki/I18n">Wiki oficial do Devise</a> que, atualmente, sugere o projeto do <a href="https://tigrish.com/">Christopher Dell</a> que tenta ser o <a href="https://github.com/tigrish/devise-i18n">repositório centralizado</a> com todas as traduções em todas as linguagens para o Devise.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>curl https://raw.github.com/tigrish/devise-i18n/master/locales/en-US.yml &gt; config/locales/devise.en.yml
curl https://github.com/tigrish/devise-i18n/blob/master/locales/pt-BR.yml &gt; config/locales/devise.pt-BR.yml
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Mas somente isso não é suficiente. Você pode utilizar as views que vem embutidas na Rails Engine do Devise ou pode precisar customizá-las e nesse caso precisa copiar essas views para dentro do seu projeto, desta forma:</p>
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
</pre>
      </td>
      <td class="code"><pre>$ rails g devise:views
  invoke  Devise::Generators::SharedViewsGenerator
  create    app/views/devise/shared
  create    app/views/devise/shared/_links.erb
  invoke  form_for
  create    app/views/devise/confirmations
  create    app/views/devise/confirmations/new.html.erb
  create    app/views/devise/passwords
  create    app/views/devise/passwords/edit.html.erb
  create    app/views/devise/passwords/new.html.erb
  create    app/views/devise/registrations
  create    app/views/devise/registrations/edit.html.erb
  create    app/views/devise/registrations/new.html.erb
  create    app/views/devise/sessions
  create    app/views/devise/sessions/new.html.erb
  create    app/views/devise/unlocks
  create    app/views/devise/unlocks/new.html.erb
  invoke  erb
  create    app/views/devise/mailer
  create    app/views/devise/mailer/confirmation_instructions.html.erb
  create    app/views/devise/mailer/reset_password_instructions.html.erb
  create    app/views/devise/mailer/unlock_instructions.html.erb
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja que ele copia muitos arquivos. Vamos abrir um deles:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;h2&gt;</span>Resend confirmation instructions<span style="color:#070">&lt;/h2&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>%= form_for(resource, :as =<span style="color:#F00;background-color:#FAA">&gt;</span> resource_name, :url =<span style="color:#F00;background-color:#FAA">&gt;</span> confirmation_path(resource_name), :html =<span style="color:#F00;background-color:#FAA">&gt;</span> { :method =<span style="color:#F00;background-color:#FAA">&gt;</span> :post }) do |f| %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= devise_error_messages! %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#070">&lt;div&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= f.label :email %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;br</span> <span style="color:#070">/&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= f.email_field :email %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;div&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= f.submit "Resend confirmation instructions" %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/div&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>% end %<span style="color:#F00;background-color:#FAA">&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>%= render "devise/shared/links" %<span style="color:#F00;background-color:#FAA">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note que todos os textos estão embutidos: exatamente o que eu disse que numa aplicação I18n não devemos fazer. Ou seja, para tornar essas views traduzíveis, precisamos extrair uma a uma. Sim, será bastante trabalho. Ou você pode usar o caminho mais fácil e procurar alguém que já tenha feito isso – como eu fiz neste aplicativo de exemplo.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>wget https://raw.github.com/akitaonrails/Rails-3-I18n-Demonstration/master/config/locales/devise.views.en.yml &gt; config/locales/devise.views.en.yml
wget https://raw.github.com/akitaonrails/Rails-3-I18n-Demonstration/master/config/locales/devise.views.pt-BR.yml &gt; config/locales/devise.views.pt-BR.yml
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vai copiar as traduções que você vai precisar. Agora faça um clone do meu projeto e copie sobre o seu (caso esteja fazendo este exercício enquanto lê o artigo):</p>
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
      <td class="code"><pre>cd ..
git clone git://github.com/akitaonrails/Rails-3-I18n-Demonstration.git akitaonrails-i18n-demo
cd akitaonrails-i18n
git checkout 0ff207ed9ea58a14a16c14fc11272a3991918dab
cd i18n_demo
cp -R ../akitaonrails-i18n_demo/app/views/devise/* app/views/devise/
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso deve sobrescrever as views criadas pelo gerador padrão do Devise pela minha versão já com as strings substituídas. Apenas como dica note que no arquivo de tradução temos trechos como este:</p>
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
      <td class="code"><pre><span style="color:#606">pt-BR</span>:
  <span style="color:#606">devise</span>:
    <span style="color:#606">confirmations</span>:
      <span style="color:#606">new</span>:
        <span style="color:#606">title</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">Reenviar instruções de confirmação</span></span>
        <span style="color:#606">submit</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">Reenviar instruções de confirmação</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para acesssar a tradução podemos fazer assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># I18n.locale = :"pt-BR"</span>
<span style="color:#036;font-weight:bold">I18n</span>.t(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">devise.confirmations.new.title</span><span style="color:#710">"</span></span>)
<span style="color:#036;font-weight:bold">I18n</span>.t(<span style="color:#A60">:title</span>, scope: [<span style="color:#A60">:devise</span>, <span style="color:#A60">:confirmations</span>, <span style="color:#A60">:new</span>])
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Qualquer dessas e outras variações funcionam igual e acham a string correta, mas na view que você baixou do meu projeto, temos o seguinte no arquivo <tt>app/views/devise/confirmations/new.html.erb</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;h1&gt;</span><span style="color:#F00;background-color:#FAA">&lt;</span>%= t(".title") %<span style="color:#F00;background-color:#FAA">&gt;</span><span style="color:#070">&lt;/h1&gt;</span>
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O Rails automaticamente usa a convenção <tt>{namespace}/{controllers}/{action}</tt> para gerar o escopo (<tt>scope</tt>) e então só precisamos complementar com <tt>.title</tt> para achar a chave que queremos. Isso diminui muito a quantidade de digitação para as chaves de tradução, basta seguir as convenções como sempre.</p>
<p>Outra coisa importante é traduzir os nomes dos modelos e seus atributos. Eles são usados pelos helpers de formulários do Rails. No arquivo <tt>config/locales/rails.pt-BR.yml</tt> adicione ao final do arquivo:</p>
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
      <td class="code"><pre><span style="color:#606">activemodel</span>:
  <span style="color:#606">errors</span>:
    <span style="color:#369">&lt;&lt;</span>: <span style="color:#d70">*errors</span>
<span style="color:#606">activerecord</span>:
  <span style="color:#606">errors</span>:
    <span style="color:#369">&lt;&lt;</span>: <span style="color:#d70">*errors</span>
  <span style="color:#606">models</span>:
    <span style="color:#606">user</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Usuário</span><span style="color:#710">"</span></span>
    <span style="color:#606">article</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Artigo</span><span style="color:#710">"</span></span>
  <span style="color:#606">attributes</span>:
    <span style="color:#606">user</span>:
      <span style="color:#606">email</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">E-mail</span><span style="color:#710">"</span></span>
      <span style="color:#606">password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Senha</span><span style="color:#710">"</span></span>
      <span style="color:#606">password_confirmation</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Confirmar Senha</span><span style="color:#710">"</span></span>
      <span style="color:#606">current_password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Senha Atual</span><span style="color:#710">"</span></span>
      <span style="color:#606">remember_me</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Lembre-se de mim</span><span style="color:#710">"</span></span>
    <span style="color:#606">article</span>:
      <span style="color:#606">title</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Título</span><span style="color:#710">"</span></span>
      <span style="color:#606">body</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Conteúdo</span><span style="color:#710">"</span></span>
      <span style="color:#606">body_html</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Conteúdo em HTML</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O modelo <tt>User</tt> já foi criado pelo Devise. Ainda não criamos o modelo <tt>Article</tt> mas já fica aqui para referência. No arquivo <tt>config/locales/rails.en.yml</tt> podemos simplificar porque quando o Rails não encontra a tradução ele usa o próprio nome dos atributos.</p>
<blockquote>Sempre desenvolva todas as suas aplicações em inglês, é uma boa recomendação. E que seja português sempre a segunda linguagem. Usando essa convenção você não deve ter grandes problemas. Mas ao mesmo tempo não inclua no arquivo <tt>config/initializers/inflections.rb</tt> as regras de pluralização em português, pois isso vai causar problemas ao Rails para encontrar nomes de tabelas ao pluralizá-los usando a regra errada em português.</blockquote>
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
      <td class="code"><pre><span style="color:#606">en</span>:
  <span style="color:#606">hello</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello world</span><span style="color:#710">"</span></span>
  <span style="color:#606">site_name</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">I18n Demonstration</span><span style="color:#710">"</span></span>
  <span style="color:#606">translation</span>:
    <span style="color:#606">en</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">English</span></span>
    <span style="color:#606">pt-BR</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">Portuguese</span></span>
  <span style="color:#606">admin</span>:
    <span style="color:#606">title</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Administration</span><span style="color:#710">"</span></span>
  <span style="color:#606">articles</span>:
    <span style="color:#606">title</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Articles</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><a name="globalize3"></a></p>
<h2>Atributos Traduzidos de ActiveRecord com Globalize 3</h2>
<p>O conceito é simples: queremos um suporte que me permita utilizar os mesmos nomes de atributos mas que devolvam valores diferntes dependendo da localização escolhida atualmente. Um código de teste seria assim:</p>
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
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">spec_helper</span><span style="color:#710">'</span></span>
describe <span style="color:#036;font-weight:bold">Article</span> <span style="color:#080;font-weight:bold">do</span>
  before(<span style="color:#A60">:each</span>) <span style="color:#080;font-weight:bold">do</span>
    <span style="color:#036;font-weight:bold">I18n</span>.locale = <span style="color:#A60">:en</span>
    <span style="color:#33B">@article</span> = <span style="color:#036;font-weight:bold">Article</span>.create title: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>, body: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">**Test**</span><span style="color:#710">"</span></span>
    <span style="color:#036;font-weight:bold">I18n</span>.locale = <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">pt-BR</span><span style="color:#630">"</span></span>
    <span style="color:#33B">@article</span>.update_attributes(title: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Ola Mundo</span><span style="color:#710">"</span></span>, body: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">__Teste__</span><span style="color:#710">"</span></span>)
  <span style="color:#080;font-weight:bold">end</span>
  context <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">translations</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
    it <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should read the correct translation</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
      <span style="color:#33B">@article</span> = <span style="color:#036;font-weight:bold">Article</span>.last
      <span style="color:#036;font-weight:bold">I18n</span>.locale = <span style="color:#A60">:en</span>
      <span style="color:#33B">@article</span>.title.should == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>
      <span style="color:#33B">@article</span>.body.should == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">**Test**</span><span style="color:#710">"</span></span>
      <span style="color:#036;font-weight:bold">I18n</span>.locale = <span style="color:#A60"><span style="color:#A60">:</span><span style="color:#630">"</span><span style="color:#A60">pt-BR</span><span style="color:#630">"</span></span>
      <span style="color:#33B">@article</span>.title.should == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Ola Mundo</span><span style="color:#710">"</span></span>
      <span style="color:#33B">@article</span>.body.should == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">__Teste__</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A opção que escolhi foi novamente um projeto do Sven Fuchs, o <a href="https://github.com/svenfuchs/globalize3">Globalize 3</a>. Esse projeto tem um longo histórico que volta desde, claro, <a href="https://github.com/joshmh/globalize2">Globalize 2</a> e <a href="https://github.com/yannlugrin/globalize">Globalize</a>. Obviamente, não use as versões antigas, coloquei os links apenas para referência. Como sempre, adicione ao seu <tt>Gemfile</tt> e execute <tt>bundle</tt> em seguida:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">globalize3</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para demonstrar como funciona, vamos criar um novo model:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails g model Article slug title body:text body_html:text
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Preste atenção no arquivo de migration criado por esse generator. Abra no seu editor e modifique para que ele fique da seguinte forma:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">CreateArticles</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Migration</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">up</span>
    create_table <span style="color:#A60">:articles</span> <span style="color:#080;font-weight:bold">do</span> |t|
      t.string <span style="color:#A60">:slug</span>, null: <span style="color:#069">false</span>
      t.timestamps
    <span style="color:#080;font-weight:bold">end</span>
    add_index <span style="color:#A60">:articles</span>, <span style="color:#A60">:slug</span>, unique: <span style="color:#069">true</span>
    <span style="color:#036;font-weight:bold">Article</span>.create_translation_table! <span style="color:#A60">:title</span> =&gt; <span style="color:#A60">:string</span>, <span style="color:#A60">:body</span> =&gt; <span style="color:#A60">:text</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">down</span>
    drop_table <span style="color:#A60">:articles</span>
    <span style="color:#036;font-weight:bold">Article</span>.drop_translation_table!
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não use o método <tt>change</tt> da migration. Feita a mudança execute <tt>rake db:migrate</tt> para criar as tabelas. Agora, vamos alterar o arquivo <tt>app/model/article.rb</tt>:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Article</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  attr_accessible <span style="color:#A60">:slug</span>, <span style="color:#A60">:title</span>, <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>, <span style="color:#A60">:locale</span>, <span style="color:#A60">:translations_attributes</span>
  translates <span style="color:#A60">:title</span>, <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>
  accepts_nested_attributes_for <span style="color:#A60">:translations</span>
  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Translation</span>
    attr_accessible <span style="color:#A60">:locale</span>, <span style="color:#A60">:title</span>, <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora o model vai se comportar exatamente como descrito na spec acima. O truque é que a migration vai criar uma nova tabela <tt>articles</tt> e também <tt>article_translation</tt> e criará implicitamente por causa do método de classe <tt>translates</tt> uma associação parecida com <tt>has_many :translations, class_name: “article_translation”</tt>. Ele vai alterar o model para que os atributos passem a consultar o <tt>I18n.locale</tt> antes de ler ou gravar novos dados. Cada localização se tornar uma linha na tabela escondida de traduções e consultas no model <tt>Article</tt> procuram na tabela implícita usando o <tt>locale</tt> atual.</p>
<p><a name="friendlyid"></a></p>
<h2>Seção Bônus: Friendly Id</h2>
<p>Vamos fazer um pequeno desvio que não tem nada a ver com I18n para recomendar mais algumas coisas. A primeira é o problema de IDs e Slugs. Se você utilizar o Rails básico, todo Model terá um ID numérico incremental e toda <span class="caps">URL</span> será no formato <tt>/articles/123</tt>. A recomendação é nunca expor o ID único diretamente do banco de dados na sua aplicação. Dependendo do que sua aplicação fizer, o usuário pode começar a experimentar colocar valores numéricos e acabar achando algo que você não queria que ele visse.</p>
<p>Uma das formas de esconder esses IDs numéricos é usar um <a href="https://en.wikipedia.org/wiki/Slug_(web_publishing)">slug</a> e transformar uma informação específica do seu Modelo – de preferência a segunda coisa depois do ID que seja mais único quanto possível – por exemplo, no caso do nosso modelo <tt>Article</tt>, o candidato seria o atributo <tt>title</tt>. Lembram que quando criamos o modelo já adicionei um campo <tt>slug</tt>? É para usá-lo aqui.</p>
<p>A gem que recomendo para gerenciar slugs é a <a href="https://github.com/norman/friendly_id/blob/master/lib/friendly_id/slugged.rb">Friendly Id</a> do Norman Clark. A utilização é muito simples: primeiro garanta ter um campo <tt>slug</tt> no seu model, lembrando de adicionar também um índice que garanta sua unicidade no banco. Olhe novamente a migration anterior e vai encontrar esta linha:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>add_index <span style="color:#A60">:articles</span>, <span style="color:#A60">:slug</span>, unique: <span style="color:#069">true</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Feito isso adicione a gem no <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">friendly_id</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Execute <tt>bundle</tt> para instalar e modifique seu modelo:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Article</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  attr_accessible <span style="color:#A60">:body</span>, <span style="color:#A60">:body_html</span>, <span style="color:#A60">:slug</span>, <span style="color:#A60">:title</span>, <span style="color:#A60">:locale</span>, <span style="color:#A60">:translations_attributes</span>
  extend <span style="color:#036;font-weight:bold">FriendlyId</span>
  friendly_id <span style="color:#A60">:title</span>, use: <span style="color:#A60">:slugged</span>
  ...
  private
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">should_generate_new_friendly_id?</span>
      new_record?
    <span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se fizer tudo corretamente, o comportamento será de acordo com a seguinte spec:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">spec_helper</span><span style="color:#710">'</span></span>
describe <span style="color:#036;font-weight:bold">Article</span> <span style="color:#080;font-weight:bold">do</span>
  before(<span style="color:#A60">:each</span>) <span style="color:#080;font-weight:bold">do</span>
    <span style="color:#036;font-weight:bold">I18n</span>.locale = <span style="color:#A60">:en</span>
    <span style="color:#33B">@article</span> = <span style="color:#036;font-weight:bold">Article</span>.create title: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>, body: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">**Test**</span><span style="color:#710">"</span></span>
    ...
  <span style="color:#080;font-weight:bold">end</span>
  ...
  context <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">slug</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
    it <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">should generate a slug</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
      <span style="color:#33B">@article</span>.slug.should == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello-world</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não só isso mas helpers como <tt>article_path</tt> e mesmo o método <tt>find</tt> do model passam a aceitar tanto a chave primária numérica como o slug para procurar no banco de dados. Essa gem torna essa utilização transparente e você vai usá-la como se estivesse usando uma chave primária normal.</p>
<p>Um detalhe: note o método <tt>should_generate_new_friendly_id?</tt> que sobrescrevemos. No comportamento padrão, a gem vai atualizar o atributo <tt>slug</tt> sempre que atualizarmos o conteúdo do campo <tt>title</tt>. Mas não queremos que isso aconteça, especialmente porque se adicionarmos o conteúdo localizado do mesmo atributo, o slug vai sempre ficar mudando para cada novo título que acrescentarmos. Além disso, se um conteúdo já foi publicado, não convém mudar sua <span class="caps">URL</span> – isso é ruim para <a href="https://en.wikipedia.org/wiki/Search_engine_optimization"><span class="caps">SEO</span></a>. Portanto o gerador de slugs só vai rodar se for um registro novo, não se for uma atualização de um já existente.</p>
<h2>Continua na Parte 2</h2>
<p>Continue lendo este artigo na <a href="https://akitaonrails.com/2012/07/14/internationalizacao-i18n-minima-em-rails-3-2-parte-2">Parte 2</a>.</p>
<p></p>
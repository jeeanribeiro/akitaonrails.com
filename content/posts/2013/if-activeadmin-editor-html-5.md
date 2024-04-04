---
title: "[#IF] ActiveAdmin + Editor HTML 5"
date: "2013-05-13T17:24:00.000Z"
tags: ["rails", "activeadmin"]
years: "2013"
---

<p></p>
<p>Uma das gems que eu mais uso em projetos é o <a href="http://activeadmin.info/documentation.html">ActiveAdmin</a>, de todas as opções de admin para Rails que surgiram até hoje, esta foi a que melhor se adaptou na maioria dos projetos. Longe de ser perfeita, mas o suficiente para atender bem as necessidades de uma simples coleção de CRUDs.</p>
<p>Outra vantagem é que pouco a pouco um pequeno ecossistema surgiu em torno do framework, adicionando funcionalidades como granularidade de permissões com <a href="https://github.com/11factory/activeadmin-cancan">CanCan</a>, e eu já bloguei sobre sua excelente integração com o <a href="http://www.akitaonrails.com/2012/07/23/activeadmin-best-in-place">Best in Place</a>. Desta vez experimentei outra extensão que gostei muito, o <a href="https://github.com/stefanoverna/activeadmin-wysihtml5">ActiveAdmin-WYSIHTML5</a>.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/362/image_screenshot.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/362/image_screenshot.png 2x" alt="ActiveAdmin-Dragonfly"></p>
<p></p>
<p></p>
<p>Essa extensão foi criada pelo italiano <a href="https://github.com/stefanoverna">Stefano Verna</a> que também fez diversas outras extensões, incluindo um com o <a href="https://github.com/stefanoverna/activeadmin-globalize3">Globalize 3</a>, e um para fazer upload de imagens que utiliza uma outra gem chamada <a href="https://github.com/markevans/dragonfly">Dragonfly</a>.</p>
<p>Um parêntese, o Dragonfly é um concorrente de <a href="https://www.akitaonrails.com/2010/06/23/akita-responde-upload-de-arquivos#.UZEeJys6WDQ">Carrierwave e Paperclip</a>. Uma vantagem em relação aos anteriores é que ele herda somente de ActiveModel em vez de ActiveRecord, o que o torna naturalmente compatível com MongoMapper para usar com MongoDB.</p>
<p>Se somar com o Best In Place, CanCan, um versionador como o <a href="https://github.com/airblade/paper_trail">PaperTrail</a>, já é possível fazer um CMS (Content Management System) bastante capaz rapidamente e, melhor, com boa qualidade, bons testes, facilidade de adicionar novas funcionalidades.</p>
<p>Num novo projeto podemos criar um model <tt>Page</tt> que terá o HTML:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rails g model Page title body:text
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora adicionamos o que precisamos no <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activeadmin</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activeadmin-dragonfly</span><span style="color:#710">'</span></span>, github: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">stefanoverna/activeadmin-dragonfly</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activeadmin-wysihtml5</span><span style="color:#710">'</span></span>, github: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">stefanoverna/activeadmin-wysihtml5</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Execute o comando <tt>bundle</tt> para instalar. Agora precisamos criar os arquivos de configuração básicos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>rails generate active_admin:install
rake activeadmin_wysihtml5:install:migrations 
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finalmente, basta criar a configuração normal para o <tt>ActiveAdmin</tt> para expor o model <tt>Page</tt> criando o arquivo <tt>app/admin/page.rb</tt> com o seguinte:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">ActiveAdmin</span>.register <span style="color:#036;font-weight:bold">Page</span> <span style="color:#080;font-weight:bold">do</span>
  form <span style="color:#080;font-weight:bold">do</span> |f|
    f.inputs <span style="color:#080;font-weight:bold">do</span>
      f.input <span style="color:#A60">:title</span>
      f.input <span style="color:#A60">:body</span>, as: <span style="color:#A60">:wysihtml5</span>
    <span style="color:#080;font-weight:bold">end</span>
    f.buttons
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A opção <tt>:wysihtml5</tt> pode ser customizada para definir que tipos de controle o editor vai possuir. Com o Dragonfly ele automaticamente já ganha o modal para galeria de imagem com suporte a uploads (em outro artigo mostro como migrar o Carrierwave para Dragonfly e como configurar para fazer uploads para S3. Dica: leia a documentação e o código fonte do Dragonfly).</p>
<p>Não esqueça de adicionar os assets do ActiveAdmin no seu <tt>config/environments/production.rb</tt> para que a tarefa de pré-compilação do <a href="https://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">Asset Pipeline</a> compile corretamente (muita gente esquece de fazer isso no começo):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>config.assets.precompile += <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">active_admin.js active_admin.css active_admin/print.css</span><span style="color:#710">)</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/361/screenshot.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/361/screenshot.png 2x" alt="ActiveAdmin-WYSIHTML5"></p>
<p>Por causa de opções como essas é que provavelmente não temos um CMS "canônico" no mundo Rails. É mais fácil (e muito mais prático e limpo) incorporar funcionalidades de CMS à sua aplicação do que tentar "estuprar" um CMS limitado para fazer mais do que sua função original.</p>
<p>Em particular, a categoria <a href="https://www.ruby-toolbox.com/categories/rails_admin_interfaces">Rails Admin Interfaces</a> já evoluiu muito nos últimos anos. Uma recomendação: nunca vai existir um Admin que satisfaça tudo e todos. Se tentar fazer algo customizável e dinâmico demais o projeto pode facilmente sair do controle. Já passamos por isso com o ActiveScaffold e mesmo com o atual Rails Admin. O ActiveAdmin é mais "quadrado" nesse sentido mas é mais simples e explícito no que faz. Alguns não gostam porque para customizá-lo você precisa usar <a href="https://github.com/justinfrench/formtastic">Formtastic</a>. Existem facções que gostam, outras que preferem SimpleForms, e outras que preferem não usar nenhum deles, mas novamente é uma questão de preferência já que ambos tem prós e contras.</p>
<p>O objetivo de mostrar esta gem é demonstrar como o ActiveAdmin pode ser estendido para funcionalidades interessantes sem tanto trabalho e/ou necessidade de criar "yet-another-clone" do ActiveAdmin.</p>
<p></p>
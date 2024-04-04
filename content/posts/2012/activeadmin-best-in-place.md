---
title: "ActiveAdmin + Best in Place"
date: "2012-07-23T22:36:00.000Z"
tags: ["rails", "tutorial", "activeadmin"]
years: "2012"
---

<p></p>
<p>Vocês devem ter notado que agora as tags de cada post estão listadas e são clicáveis, levando a uma listagem de todas as posts com a mesma tag. Essa funcionalidade já existia nos outros sistemas de blog que usei, mas desde que comecei o blog eu nunca gerenciei as tags corretamente. Só que hoje eu tenho mais de 860 artigos. Eu preciso olhar uma a uma e reeditar as tags. Mas o fluxo normal de:</p>
<ul>
  <li>abre no admin a listagem de posts;</li>
  <li>navega pela lista paginada;</li>
  <li>encontra um post para editar, clica e abre outra página;</li>
  <li>edita as tags;</li>
  <li>salva, retorna pra listagem;</li>
</ul>
<p>São muitos passos nos admins antigos. Eu queria navegar pela listagem e editar as tags “in place”, mas sempre tive preguiça de implementar :-)</p>
<p></p>
<p></p>
<p>Mas agora eu estou usando o <a href="https://activeadmin.info/">ActiveAdmin</a>, continuo usando a gem <a href="https://github.com/mbleigh/acts-as-taggable-on/">ActsAsTaggableOn</a> que, por sua vez, expõe um atributo virtual chamado <tt>tag_list</tt> que retorna as tags na forma de uma string com palavras separadas por vírgulas e eu posso passar um string no mesmo formato para modificar as tags.</p>
<p>Dada esta informação, encontrei esta a gem <a href="https://github.com/bernat/best_in_place">BestInPlace</a>. Mais ainda, ela funciona no ActiveAdmin, e melhor ainda: de forma bem trivial.</p>
<h2>Passo a Passo</h2>
<p>Adicione ao seu <tt>Gemfile</tt> e rode <tt>bundle install</tt> depois:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">best_in_place</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Dado que você já tem o ActiveAdmin, edite o seu <tt>app/assets/javascripts/active_admin.js</tt> para ficar assim:</p>
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
      <td class="code"><pre><span style="color:#777">//= require jquery</span>
<span style="color:#777">//= require jquery-ui</span>
<span style="color:#777">//= require jquery.purr</span>
<span style="color:#777">//= require best_in_place</span>
<span style="color:#777">//= require active_admin/base</span>
<span style="color:#369;font-weight:bold">$</span>(document).ready(<span style="color:#080;font-weight:bold">function</span>() {
  jQuery(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">.best_in_place</span><span style="color:#710">"</span></span>).best_in_place();
});
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Baixe o <a href="https://code.google.com/p/jquery-purr/">jquery.purr</a> e copie o <tt>jquery.purr.js</tt> para a mesma pasta <tt>app/assets/javascripts</tt>. Não esqueça de alterar seu <tt>config/application.rb</tt> para declarar os JS e <span class="caps">CSS</span> do ActiveAdmin:</p>
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
<p>Agora, no meu caso eu tenho o model <tt>Post</tt> registrado em <tt>app/assets/admin.rb</tt> modificando meu <tt>index</tt> para ficar assim:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">ActiveAdmin</span>.register <span style="color:#036;font-weight:bold">Post</span> <span style="color:#080;font-weight:bold">do</span>
  index <span style="color:#080;font-weight:bold">do</span>
    column <span style="color:#A60">:title</span> <span style="color:#080;font-weight:bold">do</span> |post|
      link_to post.title, post.permalink
    <span style="color:#080;font-weight:bold">end</span>
    column <span style="color:#A60">:tag_list</span> <span style="color:#080;font-weight:bold">do</span> |post|
      best_in_place post, <span style="color:#A60">:tag_list</span>, type: <span style="color:#A60">:input</span>, path: [<span style="color:#A60">:admin</span>, post]
    <span style="color:#080;font-weight:bold">end</span>
    column <span style="color:#A60">:published_at</span> <span style="color:#080;font-weight:bold">do</span> |post|
      <span style="color:#036;font-weight:bold">I18n</span>.l post.published_at, format: <span style="color:#A60">:short</span>
    <span style="color:#080;font-weight:bold">end</span>
    default_actions
  <span style="color:#080;font-weight:bold">end</span>
  ...
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O helper <tt>best_in_place</tt> funciona quase como qualquer outro Helper de Form do Rails: nome do model, nome do campo, tipo, path (lembrando que o Rails vai converter um Array como se fosse uma rota nomeada com namespace, no caso <tt>[:admin, post]</tt> se torna <tt>admin_post_path(post)</tt>, isso é assim desde o Rails 2 se não me engano).</p>
<p>E pronto! Reiniciando meu servidor, e <em>presto</em>!</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/image_asset/image/6/big_best_in_place.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/image_asset/image/6/best_in_place.jpg 2x" alt=""></p>
<p>Agora fica o trabalho (muito trabalho!) de navegar pela listagem e ir atualizando as tags, mas com isso o trabalho será uma ordem de grandeza melhor!</p>
<p></p>
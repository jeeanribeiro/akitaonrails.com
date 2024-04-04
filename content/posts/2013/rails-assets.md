---
title: "Rails Assets"
date: "2013-12-13T21:49:00.000Z"
tags: ["beginner", "rails", "front-end", "javascript"]
years: "2013"
---

<p></p>
<p>Ontem o <a href="https://twitter.com/fgrehm">@Fgrehm</a> mandou no nosso Campfire sobre o projeto <a href="https://rails-assets.org">rails-assets.org</a>. Ele acabou de ser lançado, portanto não pode ser considerado mais que um "beta". Ela pode ser tanto a salvação da lavoura para front-ends em projetos Rails ou não, na prática ainda não sabemos.</p>
<p>O <a href="https://twitter.com/jcemer">@jcemer</a> publicou hoje um <a href="http://jcemer.com/asset-pipeline-rails-assets-or-let-die.html">ótimo post</a> explicando isso do ponto de vista de um front-end full-time, colocando em perspectiva.</p>
<p>Em resumo, o Rails trás um mecanismo fantástico chamado Asset Pipeline. Ele tem diversas funções, em particular otimizar os assets dos projetos Rails, compilando fontes de Sass ou Less para CSS. Depois concatenando todos os CSS, JS em um único arquivo. Depois minificando (com Uglify) para diminuir seu tamanho. Em particular com Sass ele ainda pode concatenar sprites em uma única imagem também. Enfim, o pacote completo para otimizar assets ao máximo.</p>
<p>Se você ainda não conhece sobre esse recurso, não deixe de ler meu <a href="http://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">tutorial</a>.</p>
<p></p>
<p></p>
<p>Só que à medida que um projeto precisa ter várias bibliotecas CSS, JS, etc o processo pode ficar chato. Principalmente porque em alguns casos precisa manualmente modificar os paths dentro de seus fontes.</p>
<p>Um dos problemas é que o Asset Pipeline vai juntar todos os arquivos em um único, colocando timestamp no nome. E aí os paths não vão funcionar a menos que usem o helper <a href="https://api.rubyonrails.org/classes/ActionView/Helpers/AssetUrlHelper.html#method-i-asset_path">asset_path</a> ou <a href="https://api.rubyonrails.org/classes/ActionView/Helpers/AssetUrlHelper.html#method-i-asset_url">asset_url</a>. Por isso acabamos usando rubygems feitas manualmente como o <a href="https://github.com/anjlab/bootstrap-rails">bootstrap-rails</a>.</p>
<p>E isso leva a outro problema: atualizações. Primeiro, os autores originais lançam uma determinada biblioteca Javascript. Podemos manualmente fazer o download dos fontes e "vendorizá-los" no projeto. Ou, se você utilizar o Bower podemos esperar sair esse novo pacote e atualizar com o Bower. Ou, se estivermos usando uma Rubygem, podemos esperar sair a nova gem e atualizar com Bundler.</p>
<p>Então, vamos separar tudo e usar Bower pra gerenciar bibliotecas de front-end e usar Bundler para gerenciar gems de back-end e todo mundo fica feliz? Não é tão fácil assim já que muitas gems - ActiveAdmin como um bom exemplo - já dependem de bibliotecas de front-end encapsuladas em rubygems como temos neste trecho da gemspec:</p>
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
      <td class="code"><pre>...
s.add_dependency <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bourbon</span><span style="color:#710">"</span></span>
s.add_dependency <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">jquery-rails</span><span style="color:#710">"</span></span>
s.add_dependency <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">jquery-ui-rails</span><span style="color:#710">"</span></span>
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Já que temos duas comunidades tendo exatamente o mesmo trabalho: no Bower alguém vai atualizar pacotes de jquery; na Rubygems alguém vai ter que atualizar também. Então, porque não otimizar isso e apenas um deles atualizar. Nesse caso vamos aproveitar - e colaborar - para deixar as do Bower sempre atualizadas.</p>
<p>Será que existe uma forma, então, de converter um pacote Bower para um pacote Rubygems? E este é o problema que o Rails Assets se propõe a tentar resolver. Seguindo exatamente o mesmo exemplo do site deles, colocaremos na Gemfile de nossos projetos Rails desta forma:</p>
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
      <td class="code"><pre>source <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">https://rubygems.org</span><span style="color:#710">'</span></span>
source <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">https://rails-assets.org</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails</span><span style="color:#710">'</span></span>
group <span style="color:#A60">:assets</span> <span style="color:#080;font-weight:bold">do</span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">sass-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">uglifier</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">coffee-rails</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails-assets-bootstrap</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails-assets-angular</span><span style="color:#710">'</span></span>
  gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails-assets-leaflet</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A primeira diferença é um novo source. E isso é importante pois não vai poluir o repositório de Rubygems com gems que são meros 'stubs'.</p>
<p>A segunda diferença são as gems prefixadas seguindo o padrão "rails-assets-[nome do pacote Bower]" que, obviamente, foram feitas desta forma para não conflitarem com as que já existem no Rubygems.org. Se isso funcionar significa que a antiga gem "bootstrap-rails" poderá ser descontinuada e passamos a usar a "rails-assets-bootstrap", e assim por diante.</p>
<p>Se uma determinada gem ainda não existir, o processo vai demorar um pouco porque o Rails Assets vai baixar o pacote do Bower, modificá-la, encapsulá-la como uma Rubygem e publicar no seu repositório. Mas quanto mais gente usar com mais bibliotecas, mais rubygems já estarão prontas para baixar imediatamente.</p>
<p>Para o Asset Pipeline continua a mesma coisa. No mesmo arquivo <tt>app/assets/javascripts/application.js</tt> teríamos igual:</p>
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
      <td class="code"><pre><span style="color:#777">//= require_self</span>
<span style="color:#777">//= require bootstrap</span>
<span style="color:#777">//= require angular</span>
<span style="color:#777">//= require leaflet</span>
<span style="color:#777">//= require_tree .</span>
<span style="color:#777">//= require_tree shared</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no <tt>app/assets/stylesheets/application.css</tt> teríamos também igual:</p>
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
      <td class="code"><pre><span style="color:#777">/*
 *= require_self
 *= require bootstrap
 *= require leaflet
 *= require_tree .
 *= require_tree shared
 */</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As rubygems que encapsulam bibliotecas front-end não são apenas por causa do Asset Pipeline, além disso elas também podem conter generators para facilitar a criação de alguma estrutura de diretórios ou arquivos de configuração específicos. Mas mesmo nesse caso podemos separar em duas coisas: uma sendo só os fontes originais e uma segunda gem que depende da primeira com ferramentas ou outros extras como generators.</p>
<h2>Conclusão</h2>
<p>Para Rubistas a primeira vantagem mais óbvia é o seguinte: não precisamos misturar dois workflows de dependência, uma com Bower (ou manualmente) e outra com Bundler. Podemos continuar apenas com Bundler. Lembrando que se pacotes Bower não forem vendorizados no projeto Rails ainda teríamos que manter esse processo com Bower na integração contínua - adicionando o comando no .travis.yml, por exemplo; e também teríamos que ter no deployment. Idealmente, não deveríamos ter que vendorizar bibliotecas. Isso sem contar que se usar Bower num projeto Rails e usar Heroku, precisa de um outro <a href="https://xseignard.github.io/2013/02/18/use-bower-with-heroku/">buildpack</a> para funcionar. Ou seja, o Bower adiciona muito mais complexidade do que somente ter que rodar mais um comando "install" em desenvolvimento. Ambientes de teste, produção, tudo fica um pouco mais complicado, e desnecessariamente.</p>
<p>Além disso, quem colaborava mantendo a rubygems de um "bootstrap-rails", por exemplo, pode continuar a dedicar seu tempo atualizando diretamente o pacote equivalente do Bower e deixar essa fonte única sempre atualizada, o que pode ser um reforço ao Bower e aos não-rubistas que a utilizam.</p>
<p>E com isso também não precisamos ter gems de stubs poluindo o Rubygems.org. Ou seja, "se" funcionar será uma situação ganha-ganha para todo mundo. Porém nem tudo são flores. Como uma das idéias do Rails Assets é modificar o fonte para adicionar os asset-paths corretos, quer dizer que podem existir situações onde patterns automáticos não peguem, ou existam ambiguidades que precisem ser resolvidos manualmente. Então, das duas uma: ou colaboramos com o Rails Assets para adicionar os patterns que faltam, se for possível; ou criamos um passo no workflow do Rails Assets que permitam modificações manuais. Ainda não sei, precisamos ver quais são esses cenários e como corrigí-los. Mas isso não elimina os pontos positivos descritos anteriormente.</p>
<p>O melhor a fazer: testar e experimentar. O projeto é open source, você pode <a href="https://github.com/rails-assets/rails-assets/">colaborar</a> mandando Pull Requests ou mesmo reportando <a href="https://github.com/rails-assets/rails-assets/issues">Issues</a> e ajudando a evoluir. Se a idéia for furada - o que não me parece - vamos saber rapidamente - e voltamos ao mesmo problema de antes, mas pelo menos esta é uma proposta de solução muito interessante que vale a pena ser explorada mais a fundo.</p>
<p></p>
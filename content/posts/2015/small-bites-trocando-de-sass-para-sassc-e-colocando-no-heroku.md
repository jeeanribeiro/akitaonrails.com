---
title: "[Small Bites] Trocando de SASS para SASSC e colocando no Heroku"
date: "2015-05-15T16:07:00.000Z"
tags: ["rails", "heroku", "front-end"]
years: "2015"
---

<p></p>
<p>Obs: libsass não necessariamente é 100% compatível com Sass-Ruby ainda. Em muitos casos você não deve ter problemas (teste!) Mas fique de olho nesta <a href="http://sass-compatibility.github.io">tabela comparativa de compatibilidade</a>. No instante da publicação o libsass 3.2 está a 98.53% de compatibilidade!</p>
<p>Nada foi mais disruptivo no mundo de desenvolvimento de stylesheets do que o advento do SASS em 2007. Sim, faz 8 anos, e sim, estou exagerando, CSS 3 foi bem mais disruptivo, mas vocês entenderam! A menos que eu esteja enganado foi quando se entendeu também que era possível transformar uma linguagem tosca (CSS 2) em algo bem mais trabalhável, foi o início do uso do conceito de <a href="http://en.wikipedia.org/wiki/Source-to-source_compiler">transpilers</a> para Web.</p>
<p>Por todos esses anos o Sass, escrito em Ruby, serviu seu propósito muito bem, mas sabemos que ele é um dos calcanhares de aquiles quando fazemos deployment de projetos Ruby. Em paralelo se iniciou uma reimplementação em C (<a href="http://libsass.org">libsass</a>) para tornar o Sass não dependente de Ruby (agnóstico de linguagem) e com performance mais adequada.</p>
<p>O pessoal de Node e outras linguagens já usa o libsass em pacotes como o node-sass. É hora do filho pródigo retornar à sua casa. Para usar em projetos Ruby on Rails precisamos fazer o seguinte:</p>
<p></p>
<p></p>
<p>Atualizar o arquivo <tt>Gemfile</tt> e trocar <tt>sass-rails</tt> por <tt>sassc-rails</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">sassc-rails</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Rodar o bom e velho <tt>bundle install</tt> e adicionar um arquivo chamado <tt>.buildpacks</tt> à raiz do seu projeto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>https://github.com/djmattyg007/heroku-buildpack-sassc.git#1.1.0
https://github.com/heroku/heroku-buildpack-ruby.git#v137
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Então execute a seguinte linha de comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku config:add BUILDPACK_URL=https://github.com/ddollar/heroku-buildpack-multi.git
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O conceito é simples: todo container do Heroku é configurado através de uma <a href="https://devcenter.heroku.com/articles/buildpacks">buildpack</a> (que controla os fluxos de compilação e lançamento). O Heroku escolhe o padrão correto para sua aplicação. O que fizemos acima foi substituir por um <a href="https://devcenter.heroku.com/articles/third-party-buildpacks">Custom Buildpack</a>. Uma das alternativas seria fazer um fork do buildpack de Ruby e adicionar o libsass. Por outro lado já existe um buildpack só com o libsass e podemos criar um slug com duas buildpacks usando a buildpack "heroku-buildpack-multi" criada pelo <a href="https://github.com/ddollar">@ddollar</a>.</p>
<p>Ou digamos que gostaríamos de rodar uma aplicação Ruby mas queremos ter dependências de Node ou Python para executar alguma coisa específica durante o deployment, basta adicionar outras buildpacks ao arquivo <tt>.buildpacks</tt>.</p>
<p>Enfim, com isso vamos conseguir reduzir consideravelmente (depende da quantidade de stylesheets que você tem no seu projeto) o tempo de cada deployment.</p>
<p></p>
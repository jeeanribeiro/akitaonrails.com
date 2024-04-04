---
title: "[Iniciante] Configurações de ambiente com Dotenv"
date: "2013-10-19T19:14:00.000Z"
tags: ["beginner", "rails"]
years: "2013"
---

<p></p>
<p>Se você já fez deployments usando Heroku, uma coisa que pode ter parecido estranho no começo e agora já é segunda natureza é colocar configurações específicas de ambiente em variáveis de ambiente ("env").</p>
<p>No caso do Heroku, podemos fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku config:add HELLO_WORLD=true
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E dentro da aplicação podemos pegar esse valor com</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">HELLO_WORLD</span><span style="color:#710">'</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O problema: e quando estamos desenvolvendo? #comofaz?</p>
<p></p>
<p></p>
<p>A forma mais desorganizada é fazer algo como:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>hello_world = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">development test</span><span style="color:#710">)</span></span>.include?(<span style="color:#036;font-weight:bold">Rails</span>.env) ? <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">123</span><span style="color:#710">"</span></span> : <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">HELLO_WORLD</span><span style="color:#710">'</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A forma que se popularizou atualmente é usar a gem <a href="https://github.com/bkeepers/dotenv">dotenv-rails</a></p>
<p>Na sua Gemfile adicione o seguinte ao seu grupo 'development', 'test':</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">dotenv-rails</span><span style="color:#710">'</span></span>, <span style="color:#A60">:groups</span> =&gt; [<span style="color:#A60">:development</span>, <span style="color:#A60">:test</span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Execute o comando 'bundle install' e agora crie um arquivo <strong>.env</strong> na raíz do seu projeto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>HELLO_WORLD=true
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E na sua aplicação faça normalmente:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>hello_world = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">HELLO_WORLD</span><span style="color:#710">'</span></span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não se esqueça de colocar o '.env' no seu '.gitignore' para não colocá-lo no seu repositório e mantenha um '.env.development' como modelo para que o próximo desenvolvedor saiba o que precisa configurar na sua máquina.</p>
<p>Melhor ainda, como todos já deveriam saber a este ponto, uma configuração que o Rails ainda gera por padrão e acabamos colocando no repositório git é o 'config/initializers/secret_token.rb'.</p>
<p>Será algo assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">MyApp</span>::<span style="color:#036;font-weight:bold">Application</span>.config.secret_token = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">bfbb...aadd2</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Com o 'dotenv' faça assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>MyApp::Application.config.secret_token = ENV['SECRET_TOKEN']
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E adicione ao seu novo arquivo '.env' o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>SECRET_TOKEN=bfbb...aadd2
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Lembrando que você sempre pode criar um novo token com o comando 'rake secret'. E não se esqueça de adicionar também ao seu projeto no Heroku (com um novo token diferente do de desenvolvimento, claro):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku config:set SECRET_TOKEN=`rake secret`
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
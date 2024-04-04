---
title: "[Small Bites] Debugando um Controller pelo Console"
date: "2015-08-25T18:48:00.000Z"
tags: ["rails"]
years: "2015"
---

<p></p>
<p></p>
<p>Hoje fui investigar um problema estranho em produção onde um controller não estava reagindo da mesma forma que em staging (aqueles momentos Murphy!) No final o problema era um SQL insert travando e dando timeout em toda request, problema em infraestrutura no Heroku Postgresql, e não da aplicação, mas para isolar o sintoma o seguinte truque ajudou.</p>
<p>Uma coisa que eu costumo fazer nesses casos é ligar o Rails Console (<tt>bundle exec rails c</tt> ou <tt>bin/rails c</tt>), criar a hash <tt>params</tt> com os parâmetros iguais ao que a aplicação está recebendo e manualmente executar as linhas da action pra ver os resultados.</p>
<p>Quando é pouca coisa isso ajuda a dar alguns insights. Porém neste caso a aplicação era grande e tinha uma quantidade enorme de <tt>before_action</tt> sendo executados e pra simular o mesmo ambiente eu precisaria executar tudo um atrás do outro. Em vez disso tem outra forma.</p>
<p>Ao abrir o Rails Console ele lhe dá um objeto que representa sua aplicação. Com ele você pode simular sua aplicação diretamente pelo console.</p>
<p>Por exemplo, para chegar ao ponto onde eu queria testar, primeiro precisa estar autenticado na aplicação. No meu caso basta fazer isso:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>app.get "/users/sign_in"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso carrega o ambiente pro formulário de login, incluindo o token CSRF que podemos visualizar assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>app.session.to_hash
=&gt; {"session_id"=&gt;"8dbf5adfe1738752bc05ce9e6d5ab9fc", "_csrf_token"=&gt;"wp/0bjiEyRWgCfeBtkuFy+yZ2G/IihC0X1uSafn4noQ="}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Basta copiar o <tt>_csrf_token</tt> e usar para submeter o formulário ao controller do Devise:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>app.post "/users/sign_in", {"utf8"=&gt;"✓", "authenticity_token"=&gt;"wp/0bjiEyRWgCfeBtkuFy+yZ2G/IihC0X1uSafn4noQ=", "user"=&gt;{"login"=&gt;"john", "password"=&gt;"test123"} }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finalmente, posso executar a URL que eu preciso para ver exatamente o que está acontecendo no ambiente de produção:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>app.get "/rota/que/quero/testar"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso não é novo, um dos primeiros posts que explica as diversas ferramentas que existem no console é do próprio Signal v Noise, de 2012, <a href="https://signalvnoise.com/posts/3176-three-quick-rails-console-tips">"Three quick Rails console tips"</a>, escrito pelo Nick Quaranto. Para coisas rápidas e insights que podem ajudar a debugar e testar melhor sua app, este é um aliado muito poderoso!</p>
<p></p>
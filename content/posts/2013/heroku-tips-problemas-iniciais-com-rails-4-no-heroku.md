---
title: "[Heroku Tips] Problemas iniciais com Rails 4 no Heroku"
date: "2013-09-11T20:25:00.000Z"
tags: ["rails", "heroku"]
years: "2013"
---

<p></p>
<p>Se ainda não leu, dê uma olhada sobre o que já postei como <a href="http://www.akitaonrails.com/2012/04/20/heroku-tips-enciclopedia-do-heroku">dicas de Heroku</a> e <a href="http://www.akitaonrails.com/2013/05/02/opcoes-de-hospedagem-rails-heroku#.Ui81gWRgZ3Y">minha opinião sobre o serviço</a>.</p>
<p>Recentemente tentei subir um projeto Rails 4 bem simples no Heroku e encontrei problemas logo na primeira tentativa de deploy. O problema é o seguinte: a forma mais aceita de configurar uma aplicação é usar variáveis de ambiente (<a href="https://github.com/bkeepers/dotenv">veja projetos como o dotenv-rails</a>). No primeiro deploy essas variáveis não estão disponíveis, em particular o <tt>DATABASE_URL</tt>. Na task <tt>assets:precompile</tt> não deveria haver nada na inicialização que dependesse de conexão ao banco, mas algumas gems ainda não estão corrigidas dessa forma, em particular duas com esse bug já conhecido são o <a href="https://github.com/gregbell/active_admin/issues/2342#issuecomment-23109359">active_admin</a> e o acts-as-taggable-on.</p>
<p></p>
<p></p>
<p>No final, a forma mais simples para resolver isso por enquanto é fazer o seguinte antes do primeiro deploy:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>heroku labs:enable user-env-compile
heroku config:add DATABASE_URL=$(heroku config | awk '/HEROKU_POSTGRESQL.*:/ {print $2}')
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Leia a documentação dessa funcionalidade <a href="https://devcenter.heroku.com/articles/labs-user-env-compile">user-env-compile</a> entendendo que ela não é a forma mais correta, é apenas um facilitador enquanto todas as gems não estão da forma correta.</p>
<h2>Rails 12 Factor</h2>
<p>Rapidamente para não esquecer, no caso de apps Rails 4 não deixe de acrescentar o seguinte na sua <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails_12factor</span><span style="color:#710">'</span></span>, group: <span style="color:#A60">:production</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em particular é importante para logging correto e servir assets estáticos, veja no <a href="https://github.com/heroku/rails_12factor">Github deles</a> para mais informações.</p>
<h2>Migração de MySQL para PostgreSQL</h2>
<p>Outro assunto que deve ser constante quando se considera mudar pra Heroku é ter que usar o Heroku Postgres (que é uma ótima opção). Mas muitos projetos, principalmente mais antigos, devem ter começado em MySQL.</p>
<p>A primeira coisa a fazer é verificar se você tem muitos SQL exclusivos de MySQL, funções e coisas do tipo. Se você usar ActiveRecord Relations padrão, não deveria ter nenhum problema.</p>
<p>O segundo problema é migrar os dados de um banco para o outro. Eu procurei várias opções mas a maioria é antiga e não funciona direito, a melhorzinha que achei foi uma task Rake. Ela tinha alguns probleminhas de usar API deprecada mas resolvi neste aqui:</p>
<script src="https://gist.github.com/akitaonrails/6529088.js"></script>
<p>Basta alterar seu <tt>config/database.yml</tt> para ter o seguinte:</p>
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
      <td class="code"><pre><span style="color:#606">development</span>:
  <span style="color:#606">adapter</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">postgresql</span></span>
  <span style="color:#606">database</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">legaltorrents_development</span></span>
  <span style="color:#606">username</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">fred</span></span>
  <span style="color:#606">password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">password</span></span>
  <span style="color:#606">host</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">localhost</span></span>
<span style="color:#606">production</span>:
  <span style="color:#606">adapter</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">mysql</span></span>
  <span style="color:#606">database</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">legaltorrents_production</span></span>
  <span style="color:#606">username</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">fred</span></span>
  <span style="color:#606">password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">password</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Coloca o script como <tt>lib/tasks/convert.rake</tt> e executa <tt>rake db:convert:prod2dev</tt>.</p>
<p>Depois disso ainda precisa atualizar as sequences de primary key do PostgreSQL desta forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>ALTER SEQUENCE users_id_seq restart with (select max(id)+1 from users) 
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso deve ser feito para cada tabela que você tem. Se precisar atualizar em produção no Heroku, execute <tt>heroku run rails console</tt> e execute assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.connection.execute(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">ALTER SEQUENCE users_id_seq restart with (select max(id)+1 from users) </span><span style="color:#710">"</span></span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não esqueça que você pode fazer dumps do banco de dados de produção, colocar num banco de dados local para testar e tudo mais e se quiser pode gerar um dump local e restaurar de novo no Heroku. Leia a documentação deles sobre <a href="https://devcenter.heroku.com/articles/heroku-postgres-import-export">PG Backups</a>.</p>
<p>Gerar um dump local é simples:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>pg_dump -Fc --no-acl --no-owner -h localhost -U vagrant my_db &gt; mydb.dump
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E restaurar um dump do Heroku no seu banco local também:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>pg_restore --verbose --clean --no-acl --no-owner -h localhost -U vagrant -d my_db b078.dump
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso deve resolver a maioria dos problemas.</p>
<p></p>
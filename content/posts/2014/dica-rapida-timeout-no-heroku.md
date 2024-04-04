---
title: "[Dica Rápida] Timeout no Heroku"
date: "2014-01-31T23:14:00.000Z"
tags: ["rails", "heroku"]
years: "2014"
---

<p></p>
<p>Ano passado, quando um projeto de cliente entrou em produção, ter esquecido disso me custou várias horas de muita tensão. Graças à ajuda rápida e precisa da equipe de suporte e desenvolvimento do <a href="http://heroku.com">Heroku</a> (thanks <a href="http://twitter.com/ped">@ped</a>) conseguimos contornar a situação.</p>
<p>O Heroku continua sendo minha recomendação a todos os meus clientes. A menos que você tenha uma situação presente muito particular (e lhes garanto, são casos raros), 99% dos casos cabem como uma luva no Heroku. Portanto, na dúvida, vá de Heroku.</p>
<p>Porém, o Heroku tem algumas peculiaridades que você precisa conhecer. Caso ainda não tenha visto, reveja meu artigo <a href="http://www.akitaonrails.com/2012/04/20/heroku-tips-enciclopedia-do-heroku">Enciclopédia do Heroku</a> que publiquei em Abril de 2012.</p>
<p></p>
<p></p>
<p>Uma em particular merece atenção especial porque a maioria sempre esquece disso. O Router do Heroku evoluiu bastante desde o começo e também desde a <a href="https://venturebeat.com/2013/03/02/rap-genius-responds/">controvérsia da RapGenius</a> que estourou no começo de 2013. Mas o artigo não é sobre isso. Alguns já devem ter tentado navegar numa aplicação pesada que colocou no Heroku e receber uma página com um erro genérico roxa do próprio Heroku e não saber o que é. Ou, se você investiu pesado em marketing e começou a receber toneladas de acesso (dezenas ou centenas de requests por minuto), ver seus dynos patinando sem saber porque.</p>
<p>Então aqui vai a dica. Use a gem <a href="https://github.com/kch/rack-timeout">rack-timeout</a> e configure um timeout baixo, igual ou menor que 15 segundos (que, convenhamos, se uma request demora 15 segundos pra ser processada é porque ela é extremamente mal feita. Culpe seu código antes de culpar o Rails, o Heroku ou qualquer outra coisa).</p>
<p>Para instalar é muito fácil. Adicione à sua <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rack-timeout</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Rode <tt>bundle</tt> pra instalar e crie o arquivo <tt>config/initializers/rack_timeout.rb</tt> com o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> <span style="color:#080;font-weight:bold">defined?</span>(<span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Timeout</span>)
  <span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Timeout</span>.timeout = Integer( <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">RACK_TIMEOUT</span><span style="color:#710">'</span></span>] || <span style="color:#00D">12</span> )
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finalmente, configure sua aplicação no Heroku com o timeout que você quer, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>heroku config:set RACK_TIMEOUT=10
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E se você usa Unicorn, configure seu <tt>config/unicorn.rb</tt> com o seguinte:</p>
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
      <td class="code"><pre># Based on https://gist.github.com/1401792
worker_processes 2
timeout 25
preload_app true
before_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.connection.disconnect!
    Rails.logger.info('Disconnected from ActiveRecord')
  end
end
after_fork do |server, worker|
  if defined?(ActiveRecord::Base)
    ActiveRecord::Base.establish_connection
    Rails.logger.info('Connected to ActiveRecord')
  end
end
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Especial atenção à configuração de timeout. O timeout do Router do Heroku, por padrão, será sempre 30 segundos. Configure o timeout do Unicorn pra ser menor que 30 segundos (como no exemplo, 25 segundos), e configure o Rack Timeout pra ser menor ainda do que isso (no exemplo, 10 segundos).</p>
<p>Leia o <a href="https://github.com/kch/rack-timeout/blob/master/README.markdown">README</a> do Rack Timeout para mais detalhes, mas feito isso, se algum processamento levar mais do que 10 segundos para finalizar, ele vai estourar uma exception. E é isso que queremos, caso contrário o Router do Heroku vai cortar após os 30 segundos e não vai lhe dizer onde foi o problema, o gargalo que levou a dar um timeout acima dos 30 segundos.</p>
<p>Agora, você precisa de uma forma de ver o stacktrace gerado e para isso use uma opção simples como <a href="https://github.com/rails/exception_notification">Exception Notification</a> que você configura facilmente primeiro adicionando uma opção de envio de email à sua aplicação no Heroku como Sendgrid ou Mailgun, e então adiciona ao seu arquivo <tt>config/environments/production.rb</tt> algo como:</p>
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
      <td class="code"><pre>config.middleware.use <span style="color:#036;font-weight:bold">ExceptionNotification</span>::<span style="color:#036;font-weight:bold">Rack</span>,
  <span style="color:#A60">:email</span> =&gt; {
    <span style="color:#A60">:email_prefix</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">[Exception - MyApp] </span><span style="color:#710">"</span></span>,
    <span style="color:#A60">:sender_address</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">"no-reply" &lt;no-reply@myapp.com.br&gt;</span><span style="color:#710">}</span></span>,
    <span style="color:#A60">:exception_recipients</span> =&gt; [<span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">EXCEPTION_NOTIFICATION_EMAIL</span><span style="color:#710">'</span></span>]]
  }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou então adiciona algo mais parrudo como <a href="https://www.honeybadger.io">Honeybadger</a>. O importante é você receber esse stacktrace. Com essa informação você pode otimizar sua aplicação. Talvez seja o caso de otimizar uma query muito lenta, talvez faltem índices nas suas tabelas (veja a gem <a href="https://github.com/flyerhzm/bullet">Bullet</a>), talvez seja uma questão de adicionar <a href="https://www.akitaonrails.com/2008/8/21/tutorial-de-rails-caching-parte-1">Caching</a>, talvez você devesse mover um processo demorado como uma tarefa assíncrona via <a href="https://github.com/mperham/sidekiq">Sidekiq</a>. Enfim, existem diversas opções para melhorar o tempo de uma requisição para que ela fique dentro do que eu considero como "bom" (abaixo de 1 segundo) ou "ótimo" (abaixo de 100ms).</p>
<p>E falando em otimização de requests, outra excelente opção ao Unicorn para colocar no Heroku é o Phusion Passenger que, com o novo garbage collector e a implementação de <a href="https://blog.phusion.nl/2014/01/31/phusion-passenger-now-supports-the-new-ruby-2-1-out-of-band-gc/">Out-of-Band Garbage Collector</a>, pode diminuir dramaticamente o tempo das suas requests.</p>
<p>O importante deste artigo: você precisa de informação antes de saber como agir. O timeout default do Router do Heroku não vai lhe dizer, mas o Rack Timeout pode ser o que falta para descobrir seu gargalo, então configure o quanto antes.</p>
<p></p>
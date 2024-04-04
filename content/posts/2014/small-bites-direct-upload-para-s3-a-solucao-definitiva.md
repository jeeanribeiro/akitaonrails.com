---
title: "[Small Bites] Direct Upload para S3: a Solução Definitiva!"
date: "2014-12-18T16:28:00.000Z"
tags: ["rails", "heroku"]
years: "2014"
---

<p></p>
<p><strong>Atualização Jul/2016:</strong> As recomendações mudaram. Leiam este post mas usem o que explico no post mais recente <a href="http://www.akitaonrails.com/2016/07/28/updating-my-old-posts-on-uploads">Updating my Old Posts on Uploads</a>.</p>
<p>Um problema que nos persegue há muito tempo são uploads. À primeira vista é algo simples:</p>
<ol>
  <li>Coloque um form com multipart configura</li>
  <li>Coloque um campo de input tipo "file"</li>
  <li>Dê POST, o upload vai iniciar com o web server</li>
  <li>Quando o upload terminar o web server passa o arquivo pra aplicação, agora é só salvar no disco</li>
</ol>
<p>Mas esse é o jeito ruim. Funciona muito bem pra coisas pequenas, mas tenha muitos usuários fazendo uploads de dezenas de megabytes (que é o tamanho de qualquer foto tirada em smartphones) e de repente seu servidor fica de joelhos. Tenha muitos usuários fazendo uploads em conexões toscas (3G) e de repente seu web server fica travado à merce de conexões lentas. E no caso do Heroku, com timeout fixo em 30 segundos, tudo é cancelado depois de um tempo.</p>
<p>Daí tem o problema de onde colocar os arquivos: se colocar em arquivos no disco do servidor, a hora que você precisar colocar um segundo servidor em load balancing, vai ter problemas. Ainda tem gente que acha uma boa idéia colocar binários em campos BLOB num banco de dados (NUNCA FAÇA ISSO!!!). A única solução decente é jogar em buckets do S3 ou outros storages em cloud, mas sua aplicação fica mais lenta ainda: primeiro esperando o upload do usuário e depois fazendo o upload pro cloud. Tudo parece piorar o problema!</p>
<p>Pensando nisso fiz um artigo explicando em detalhes o problema, chamado <a href="http://www.akitaonrails.com/2014/03/26/heroku-tips-s3-direct-upload-carrierwave-sidekiq">S3 Direct Upload + Carrierwave + Sidekiq</a>. Não é uma forma simples mas funciona. Porém o criador do Carrierwave, <a href="https://github.com/jnicklas">Jonas Nicklas</a> parece que se cansou desse e outros problemas mais inerentes ao Carrierwave e resolveu começar do zero. Ele criou e lançou recentemente a excelente gem <a href="https://github.com/elabs/refile">REFILE</a>.</p>
<p>TL;DR: Esqueça Paperclip, Carrierwave ou Dragonfly. Use Refile! Ele tem dezenas de opções como qual storage você quer usar e muito mais, mas neste post vou me limitar ao caso de uso mais comum: Direct Upload para o S3, sem carregar seu servidor/aplicação. Tão fácil que cabe num Small Bites.</p>
<p></p>
<p></p>
<p>Mas repito: leia a documentação e faça provas de conceito, vou reduzir o exemplo da documentação num passo a passo para o cenário de Direct Upload para S3. Assumindo que você tem um model <tt>User</tt> e quer colocar uma imagem de perfil nela. Comece editando a <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mini_magick</span><span style="color:#710">"</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">refile</span><span style="color:#710">"</span></span>, <span style="color:#606">require</span>: [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">refile/rails</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">refile/image_processing</span><span style="color:#710">"</span></span>]
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">aws-sdk</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora vamos criar a configuração do Refile para o AWS-S3, crie o arquivo <tt>config/initializer/refile.rb</tt>:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">refile/backend/s3</span><span style="color:#710">"</span></span>
aws = {
  <span style="color:#606">access_key_id</span>: <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">S3_ACCESS_KEY</span><span style="color:#710">'</span></span>],
  <span style="color:#606">secret_access_key</span>: <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">S3_SECRET_ACCESS_KEY</span><span style="color:#710">'</span></span>],
  <span style="color:#606">bucket</span>: <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">S3_BUCKET</span><span style="color:#710">'</span></span>],
}
<span style="color:#036;font-weight:bold">Refile</span>.cache = <span style="color:#036;font-weight:bold">Refile</span>::<span style="color:#036;font-weight:bold">Backend</span>::<span style="color:#036;font-weight:bold">S3</span>.new(<span style="color:#606">prefix</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">cache</span><span style="color:#710">"</span></span>, **aws)
<span style="color:#036;font-weight:bold">Refile</span>.store = <span style="color:#036;font-weight:bold">Refile</span>::<span style="color:#036;font-weight:bold">Backend</span>::<span style="color:#036;font-weight:bold">S3</span>.new(<span style="color:#606">prefix</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">store</span><span style="color:#710">"</span></span>, **aws)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como podem ver estou assumindo que você usa corretamente o <a href="https://www.akitaonrails.com/2013/10/19/iniciante-configuracoes-de-ambiente-com-dotenv">dotenv-rails</a> para colocar as configurações de S3. Assumindo também que você saber configurar um bucket, incluindo habilitar a configuração de Cross-Origin Resource Sharing (CORS) onde você vai colocar algo parecido com isso:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;CORSConfiguration&gt;</span>
    <span style="color:#070">&lt;CORSRule&gt;</span>
        <span style="color:#070">&lt;AllowedOrigin&gt;</span>*<span style="color:#070">&lt;/AllowedOrigin&gt;</span>
        <span style="color:#070">&lt;AllowedMethod&gt;</span>GET<span style="color:#070">&lt;/AllowedMethod&gt;</span>
        <span style="color:#070">&lt;AllowedMethod&gt;</span>POST<span style="color:#070">&lt;/AllowedMethod&gt;</span>
        <span style="color:#070">&lt;MaxAgeSeconds&gt;</span>3000<span style="color:#070">&lt;/MaxAgeSeconds&gt;</span>
        <span style="color:#070">&lt;AllowedHeader&gt;</span>Authorization<span style="color:#070">&lt;/AllowedHeader&gt;</span>
        <span style="color:#070">&lt;AllowedHeader&gt;</span>Content-Type<span style="color:#070">&lt;/AllowedHeader&gt;</span>
    <span style="color:#070">&lt;/CORSRule&gt;</span>
<span style="color:#070">&lt;/CORSConfiguration&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora vamos criar o campo na tabela de usuários:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>rails generate migration add_profile_image_to_users profile_image_id:string
rake db:migrate
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Adicione o Refile no seu model <tt>config/model/user.rb</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">User</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>
  attachment <span style="color:#A60">:profile_image</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E edite a view do formulário de edição que, se você criou via scaffold, provavelmente vai ser algo como <tt>app/views/users/_form.html.erb</tt>:</p>
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
      <td class="code"><pre><span style="color:#F00;background-color:#FAA">&lt;</span>%= form_for(@user) do |f| %<span style="color:#F00;background-color:#FAA">&gt;</span>
  ...
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">field</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#F00;background-color:#FAA">&lt;</span>%= f.attachment_field :profile_image, direct: true, presigned: true %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;div</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">actions</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
    <span style="color:#F00;background-color:#FAA">&lt;</span>%= f.submit %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#070">&lt;/div&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>% end %<span style="color:#F00;background-color:#FAA">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note a opção de <tt>direct</tt> que indica que será um Direct Upload, ou seja, seu browser vai fazer o upload diretamente para o S3 e trazer a chave de identificação pra montar a URL depois. No caso o Refile primeiro joga numa chave "cache/" e quando você faz o POST do formulário ele manda o S3 copiar para a pasta "store/" que é o que seu model vai usar. Dessa forma, se você escolher o arquivo no browser, fizer o upload mas desistir de dar POST, não vai poluir a pasta final.</p>
<p>Como o controller vai receber campos novos, precisamos permitir que esses parâmetros cheguem no model, então vamos editar o controller responsável que, nesse exemplo, é o <tt>app/controllers/users_controller.rb</tt>:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">UsersController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span>
  ...
  private
        ...
    <span style="color:#777"># Never trust parameters from the scary internet, only allow the white list through.</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">user_params</span>
      params.require(<span style="color:#A60">:user</span>).permit(<span style="color:#A60">:name</span>, <span style="color:#A60">:email</span>, <span style="color:#A60">:profile_image</span>, <span style="color:#A60">:profile_image_cache_id</span>)
    <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No trecho acima deixei de exemplo possíveis campos como "name" e "email" mas, claro, configure de acordo com os campos que seu formulário realmente envia, o importante são os parâmetros "profile_*". Com isso a aplicação já recebe tudo que precisa, mas como o Direct Upload acontece no browser significa que precisamos de algum Javascript para controlar a chamada Ajax e os eventos associados então vamos adicionar a dependência do Refile editando o arquivo <tt>app/assets/javascripts/application.js</tt>:</p>
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
      <td class="code"><pre>...
<span style="color:#777">//= require jquery</span>
<span style="color:#777">//= require jquery_ujs</span>
<span style="color:#777">//= require turbolinks</span>
<span style="color:#777">//= require refile</span>
<span style="color:#777">//= require_tree .</span>
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse é um exemplo então, novamente, edite conforme o que você tem na sua aplicação. A documentação explica como lidar com os eventos como "upload:start" ou "upload:progress" para que você tenha a opção de mostrar coisas como uma barra de progresso ou outra notificação ao usuário indicando se ele está fazendo o upload e quando terminar. Para este exemplo vamos fazer algo simples: apenas desabilitar o botão de submit e reabilitar quando o upload terminar. Para isso vamos editar o arquivo <tt>app/assets/javascripts/users.js.coffee</tt>:</p>
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
      <td class="code"><pre><span style="color:#369;font-weight:bold">$</span>(document).on <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">upload:start</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">form</span><span style="color:#710">"</span></span>, (e) -&gt;
  <span style="color:#369;font-weight:bold">$</span>(<span style="color:#963">this</span>).find(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">input[type=submit]</span><span style="color:#710">"</span></span>).attr <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">disabled</span><span style="color:#710">"</span></span>, <span style="color:#069">true</span>
<span style="color:#369;font-weight:bold">$</span>(document).on <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">upload:complete</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">form</span><span style="color:#710">"</span></span>, (e) -&gt;
  <span style="color:#369;font-weight:bold">$</span>(<span style="color:#963">this</span>).find(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">input[type=submit]</span><span style="color:#710">"</span></span>).removeAttr <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">disabled</span><span style="color:#710">"</span></span>  unless <span style="color:#369;font-weight:bold">$</span>(<span style="color:#963">this</span>).find(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">input.uploading</span><span style="color:#710">"</span></span>).length
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pronto! Reinicie seu servidor e de agora em diante o upload vai acontecer diretamente do browser para o S3 e quando fizer o POST ele vai guardar a chave de identificação no campo "profile_image_id" e quando for puxar a imagem ele vai passar por um filtro Rack que vai mostrar algo parecido com isso no seu console:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>Started GET "/attachments/store/fill/300/300/365d81a10ba21f2544177580f12110509f57e086bcd49f5336079ca17ea8/profile_image" for 192.168.47.2 at 2014-12-18 15:53:14 +0000
Refile: GET /store/fill/300/300/365d81a10ba21f2544177580f12110509f57e086bcd49f5336079ca17ea8/profile_image
Refile: serving "365d81a10ba21f2544177580f12110509f57e086bcd49f5336079ca17ea8" from store backend which is of type Refile::Backend::S3
[AWS S3 200 3.345285 0 retries] get_object(:bucket_name=&gt;"testing-bucket-akitaonrails",:key=&gt;"store/365d81a10ba21f2544177580f12110509f57e086bcd49f5336079ca17ea8")
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Significa que você pode dar override nisso e colocar coisas como autenticação para acessar certos buckets e assim por diante. Com o tempo você pode querer limpar a pasta de cache e isso você pode configurar diretamente no S3 como <a href="https://github.com/elabs/refile#cache-expiry">ensina a documentação</a>.</p>
<p>Finalmente, o correto é sempre configurar o Amazon Cloudfront na frente do storage que estiver usando (no nosso caso, o S3) e <a href="https://www.happybearsoftware.com/use-cloudfront-and-the-rails-asset-pipeline-to-speed-up-your-app.html">este blog post</a> explica como é simples fazer isso. O conceito é basicamente trocar o domínio e passar a URL para o Cloudfront que, se não tiver a imagem em cache vai pedir pra sua aplicação e a partir daí vai usar do seu próprio cache, deixando a sua aplicação e seu storage mais leves. E para que sua aplicação gere tags de imagens apontando pro CDN, apenas configure o Refile assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Refile</span>.host = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">//your-dist-url.cloudfront.net</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pronto! A solução definitiva para gerenciar seus assets da <strong>FORMA CORRETA</strong>! Servir assets diretamente da sua aplicação está errado. Fazer sua aplicação fazer o upload para storages está errado. Não usar storages separados da sua aplicação está errado!</p>
<p></p>
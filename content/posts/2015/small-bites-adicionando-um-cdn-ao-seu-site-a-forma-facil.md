---
title: "[Small Bites] Adicionando um CDN ao seu site (a forma fácil!)"
date: "2015-08-25T19:37:00.000Z"
tags: ["rails", "heroku"]
years: "2015"
---

<p></p>
<p>Se você desenvolve front-end com Ruby on Rails o excelente <a href="http://guides.rubyonrails.org/asset_pipeline.html">Asset Pipeline</a> faz tudo por você. Praticamente não há configuração que você precisa fazer, nenhum arquivo para scriptar seu próprio pipeline caseiro, nenhuma <a href="http://www.akitaonrails.com/2014/12/02/small-bites-em-defesa-do-asset-pipeline-tudo-que-voce-precisa">discussão</a> sobre como fazer requires.</p>
<p>Para 80% dos casos (ou mais!), tudo que você precisa é conseguir desenvolver seus stylesheets (Sass!) de forma organizada podendo até usar Javascript <a href="https://github.com/TannerRogalsky/sprockets-es6">ES6</a>. No final o framework vai automaticamente concatenar tudo, minificar, adicionar controles corretos de versão (fingerprint/hash) para que ninguém precise se preocupar em expirar caches. E em desenvolvimento, tudo vai funcionar separado para ficar fácil debugar.</p>
<p></p>
<p></p>
<p>Em produção, todos os seus arquivos Javascript, por exemplo, serão pré-compilados e no seu layout ele vai renderizar algo assim em produçao:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/assets/application-92d3fd2d9ebe06a3a45e1ee88109c64f.js</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Eu já escrevi sobre o <a href="https://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">Asset</a> <a href="https://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes-parte-2">Pipeline</a>, como usar o <a href="https://www.akitaonrails.com/2013/12/13/rails-assets">Rails Assets</a> para consumir pacotes Bower sem o Bower. Anos atrás uma última coisa que eu fazia era enviar assets pré-compilados para o AWS S3 usando o Asset Sync, mas atualmente essa é a <strong>forma errada</strong> de fazer isso. Em vez disso vamos colocar tudo num CDN de verdade como o AWS CloudFront.</p>
<p>Um CDN como o CloudFront funciona da seguinte forma. Ao terminar a configuração que vou explicar abaixo, o HTML que carrega o Javascript acima vai ser renderizado da seguinte forma na sua aplicação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#070">&lt;script</span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://d1g6lioiw8beil.cloudfront.net/assets/application-92d3fd2d9ebe06a3a45e1ee88109c64f.js</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text/javascript</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, ele vai pedir para esse subdomínio "d1g6lioiw8beil" no domínio do cloudfront.net. Ao não encontrar ele vai pedir ao domínio que você configurou. No meu caso, ele vai pedir para:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>https://www.akitaonrails.com/assets/application-92d3fd2d9ebe06a3a45e1ee88109c64f.js
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Então ele fará o cache esse arquivo e qualquer nova requisição pelo mesmo arquivo vai devolver do cache do CloudFront e sua aplicação não vai mais receber nenhuma requisição por esse arquivo. O mesmo vai acontecer com todos os demais assets do site, incluindo os stylesheets e imagens.</p>
<p>Quando fizer uma atualização que muda os assets, o fingerprint/hash do arquivo vai mudar. Daí o ciclo reinicia: o CloudFront não vai ter, ele pede pra sua aplicação - que precisa servir o novo arquivo apenas uma vez - e uma vez gravado novamente no cache, sua aplicação não recebe mais nenhuma requisição do mesmo arquivo outra vez.</p>
<p>Se você usou corretamente helpers como <tt>image_tag</tt>, <tt>asset_path</tt> e associados, então já tem tudo que precisa. Sua aplicação já pré-compila os assets corretamente e mostra as URLs corretas com os devidos hashes de cada arquivo concatenado e minificado.</p>
<p>Melhor ainda, tecnicamente o CloudFront vai puxar o arquivo do servidor de cache mais próximo, geograficamente, de onde o usuário que pediu sua página estiver, melhorando a performance geral do seu site do ponto de vista do usuário final.</p>
<h2>Como Configurar e Instalar</h2>
<p>Com sua conta no AWS criado, vá até o console do CloudFront e já pode começar imediatamente criando uma nova distribuição:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/497/AWS_CloudFront_Management_Console.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/497/AWS_CloudFront_Management_Console.png 2x" alt="CloudFront"></p>
<p>Guarde o domain name aleatório e único que ele vai criar pra você sobre "Domain Name", você vai precisar disso depois. Ele é no formato <tt>[id do domínio].cloudfront.net</tt>.</p>
<p>Só tem duas coisas que você precisa configurar. O primeiro é o domínio correto da sua aplicação em produção e um ID qualquer:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/498/Screen_Shot_2015-08-25_at_15.46.44.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/498/Screen_Shot_2015-08-25_at_15.46.44.png 2x" alt="Origin Settings"></p>
<p>A segunda coisa é um único Whitelist Header, adicionando o header "Origin":</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/499/Screen_Shot_2015-08-25_at_16.10.21.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/499/Screen_Shot_2015-08-25_at_16.10.21.png 2x" alt="Whitelist Header"></p>
<p>Pronto, é só isso que você precisa fazer no CloudFront. Você vai perceber que ele vai ficar com um spinner rodando e você precisa esperar ele terminar. Ele está configurando todos os edges.</p>
<p>Só de fazer isso você já pode testar. Basta pegar uma URL de produção de um asset seu e trocar seu domínio (no meu caso, "www.akitaonrails.com") pelo Domain Name com o ID aleatório que falei acima (no meu caso, "d1g6lioiw8beil.cloudfront.net"). Ele vai fazer o processo que expliquei antes: puxar do seu site o arquivo, fazer o cache, e passar a servir do cache.</p>
<p>Se o teste funcionar, basta adicionar a seguinte linha no arquivo <tt>config/environments/production.rb</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>config.action_controller.asset_host = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">https://d1g6lioiw8beil.cloudfront.net</span><span style="color:#710">'</span></span> <span style="color:#777"># trocar esse domain pelo seu</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Obviamente, colocando o Domain Name da sua distribuição do CloudFront. Faça um novo deployment e pronto! O Heroku tem uma <a href="https://devcenter.heroku.com/articles/using-amazon-cloudfront-cdn">documentação com mais detalhes</a>, este meu post é um resumo simples que qualquer site em Rails pode seguir imediatamente.</p>
<p>Por muito tempo, muitos <a href="https://www.akitaonrails.com/2014/12/02/small-bites-em-defesa-do-asset-pipeline-tudo-que-voce-precisa">criticaram o Asset Pipeline</a> por causa dos bugs que as primeiras versões tinham, mas até hoje todos estão tentando resolver um problema que o ecossistema Rails já resolveu desde 2009. E adicionar um CDN ao seu site todo com esforço quase zero, é prova da versatilidade que já temos pré-instalado em toda aplicação Rails moderna.</p>
<p></p>
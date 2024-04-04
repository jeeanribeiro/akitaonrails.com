---
title: "Usando ETAG e Memcached"
date: "2010-07-06T08:43:00.000Z"
tags: ["beginner", "rails"]
years: "2010"
---

<p></p>
<p><strong>Atualização 02/07/2010:</strong> Eu esqueci que o máximo de caracteres de uma chave de memcached é 250. Como estava gerando chaves dos posts usando os permalinks, obviamente em muitos casos vai dar mais de 250. Então o que eu fiz foi gerar as chaves normalmente, criar um digest SHA1 e truncar até 250. Isso deve resolver. Descobri isso porque estou usando o plugin <a href="http://github.com/rails/exception_notification">exception_notifier</a> e hoje comecei a receber dezenas de e-mails com a exception <tt>Memcached::ABadKeyWasProvidedOrCharactersOutOfRange</tt>. Fica a dica :-)</p>
<p>Aproveitando o <a href="http://www.akitaonrails.com/2010/07/05/rubyconf-latin-america-derruba-akitaonrails-com">episódio</a> de ontem da lentidão do meu site, resolvi fazer um pequeno ajuste adicionando memcached à equação.</p>
<p>Recordando, eu estou usando ETAGs para economizar processamento. Leia meu <a href="http://akitaonrails.com/2010/05/25/voce-ja-esta-usando-etags-certo">artigo sobre <span class="caps">ETAG</span></a> para entender do que isso se trata. Basicamente a primeira vez ele vai ao banco, busca os dados, abre o template <span class="caps">ERB</span>, gera o <span class="caps">HTML</span> e envia de volta ao usuário, o caminho padrão. Com <span class="caps">ETAG</span>, na segunda vez ele checa que o dado no banco não mudou e devolve apenas um cabeçalho “304 Not Modified”, evitando o processamento do template <span class="caps">ERB</span> e transporte do <span class="caps">HTML</span>. Só isso dá uma boa acelerada na requisição.</p>
<p>Porém, eu gero o <span class="caps">ETAG</span> usando o campo ‘updated_at’, ou seja, eu preciso acabar indo ao banco e buscar essa informação. Algo parecido com isso:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
  <span style="color:#33B">@post</span> = <span style="color:#036;font-weight:bold">Post</span>.find_by_permalink(*([<span style="color:#A60">:year</span>, <span style="color:#A60">:month</span>, <span style="color:#A60">:day</span>, <span style="color:#A60">:slug</span>].collect {|x| params[x] } &lt;&lt; {<span style="color:#A60">:include</span> =&gt; [<span style="color:#A60">:tags</span>]}))
  etag = <span style="color:#33B">@post</span>.updated_at.to_i
  fresh_when( <span style="color:#A60">:etag</span> =&gt; etag, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span> ) <span style="color:#080;font-weight:bold">unless</span> <span style="color:#036;font-weight:bold">Rails</span>.env.development?
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método <tt>find_by_permalink</tt> é específico do meu blog (veja o código do <a href="http://github.com/xaviershay/enki">Enki</a> para referência). Daí uso o método <tt>fresh_when</tt> para gerar o cabeçalho caso necessário. O ponto é: ele vai executar o <tt>find</tt> ao banco em <strong>todas</strong> as requisições. No caso que aconteceu ontem, com muitas requisições simultâneas, isso pode se tornar um ponto de contenção crítico, mesmo se a query for muito rápida.</p>
<p></p>
<p></p>
<h2>Memcached</h2>
<p>A solução mais simples que eu pensei foi em colocar o memcached na frente disso. Num Ubuntu para instalar o daemon basta fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install memcached libsasl2-dev
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no Mac, se você estiver usando o <a href="https://github.com/mxcl/homebrew">Homebrew</a>, basta fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>brew install memcached
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Daí precisa instalar a gem:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem install memcached
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora no <tt>config/environment.rb</tt> coloque:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>  config.gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">memcached</span><span style="color:#710">'</span></span>
...
<span style="color:#080;font-weight:bold">end</span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">digest/sha1</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no seu <tt>config/environments/production.rb</tt> coloque:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">memcached</span><span style="color:#710">'</span></span>
config.cache_store = <span style="color:#A60">:mem_cache_store</span>, <span style="color:#036;font-weight:bold">Memcached</span>::<span style="color:#036;font-weight:bold">Rails</span>.new
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso habilita o cache via Memcached. Em ambiente de desenvolvimento e teste, ele vai armazenar tudo em memória mesmo, e em produção vai usar o Memcached. Desde o Rails 2.3 o sistema de cache foi abstraído e você pode escolher diversos tipos de armazenadores como memória, arquivo, o próprio memcached e outros. Todos são gerenciados através de uma <span class="caps">API</span> única, a partir de <tt>Rails.cache</tt>.</p>
<p>Agora, basta fazer algo assim no controller:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
  <span style="color:#777"># Parte 1</span>
  cache_key = <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA1</span>.hexdigest(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">post_</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>[<span style="color:#A60">:year</span>, <span style="color:#A60">:month</span>, <span style="color:#A60">:day</span>, <span style="color:#A60">:slug</span>].collect {|x| params[x] }.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">_</span><span style="color:#710">'</span></span>)<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)
  etag = <span style="color:#036;font-weight:bold">Rails</span>.cache.read(cache_key)
  options = { <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span> }
  <span style="color:#080;font-weight:bold">if</span> etag
    fresh_when( <span style="color:#A60">:etag</span> =&gt; etag, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span> ) <span style="color:#080;font-weight:bold">unless</span> <span style="color:#036;font-weight:bold">Rails</span>.env.development?
    options = {}
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#777"># Parte 2</span>
  <span style="color:#080;font-weight:bold">unless</span> request.fresh?(response)
    <span style="color:#33B">@post</span> = <span style="color:#036;font-weight:bold">Post</span>.find_by_permalink(*([<span style="color:#A60">:year</span>, <span style="color:#A60">:month</span>, <span style="color:#A60">:day</span>, <span style="color:#A60">:slug</span>].collect {|x| params[x] } &lt;&lt; {<span style="color:#A60">:include</span> =&gt; [<span style="color:#A60">:tags</span>]}))
    etag = <span style="color:#33B">@post</span>.updated_at.to_i
    <span style="color:#036;font-weight:bold">Rails</span>.cache.write(cache_key, etag, <span style="color:#A60">:expires_in</span> =&gt; <span style="color:#00D">1</span>.day)
    fresh_when( options.merge(<span style="color:#A60">:etag</span> =&gt; etag, <span style="color:#A60">:last_modified</span> =&gt; <span style="color:#33B">@page</span>.updated_at.utc) ) <span style="color:#080;font-weight:bold">unless</span> <span style="color:#036;font-weight:bold">Rails</span>.env.development?
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Existem 2 partes nessa lógica. Na primeira, montamos a chave do cache, que tem que ser única para cada elemento – no caso, um post – que você quer gerenciar. Em especial para meu blog eu monto uma chave baseada nos parâmetros que vem na requisição. Ou seja se o usuário mandar a <span class="caps">URL</span> “/2010/01/01/foo” ele vai montar a chave “post_2010_01_01_foo”. Daí ele faz um <tt>Rails.cache.read</tt> para ver se já existe um <span class="caps">ETAG</span> armazenado no memcached. Se já existir ele vai tentar chamar o <tt>fresh_when</tt> para ver se pode já só enviar o cabeçalho 304.</p>
<p>Na parte 2 ele checa <tt>request.fresh?(response)</tt>. Se voltar falso quer dizer que o navegador do usuário mandou um <span class="caps">ETAG</span> diferente do que temos armazenado no memcached, ou seja, provavelmente o post foi atualizado. Então temos que mandar uma versão nova. Daí ele faz a lógica normal de procurar pelo post, gerar o <span class="caps">ETAG</span>. Daí ele grava o <span class="caps">ETAG</span> novo no cache, pra garantir, e também manda esse novo <span class="caps">ETAG</span> no cabeçalho de volta ao navegador. Da próxima vez, o navegador vai mandar o novo <span class="caps">ETAG</span> e daí vai receber de volta apenas o cabeçalho 304. Além disso também estou configurando o cabeçalho “Last-Modified” para facilitar o cache da página.</p>
<p>Um pequeno detalhe é a hash <tt>options</tt>. Logo na parte 1 notem que eu faço isto:</p>
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
      <td class="code"><pre>options = { <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span> }
<span style="color:#080;font-weight:bold">if</span> etag
  fresh_when( <span style="color:#A60">:etag</span> =&gt; etag, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span> ) <span style="color:#080;font-weight:bold">unless</span> <span style="color:#036;font-weight:bold">Rails</span>.env.development?
  options = {}
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E mais abaixo eu faço isto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>options.merge(:etag =&gt; etag, :last_modified =&gt; @page.updated_at.utc)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso porque na implementação do método <tt>fresh_when</tt> tem um trecho que é assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> options[<span style="color:#A60">:public</span>]
  ...
  cache_control &lt;&lt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">public</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, se eu chamar o método <tt>fresh_when</tt> múltiplas vezes com a opção <tt>:public =&gt; true</tt>, ele vai ficar adicionando na lista <tt>cache_control</tt> e daí no cabeçalho <tt>Cache-Control</tt> vai voltar uma string tipo <tt>public, public</tt>. Então, se o <tt>fresh_when</tt> já foi chamado no começo, na segunda vez eu tomo o cuidado de não passar o <tt>:public</tt> de novo.</p>
<p>Finalmente, no administrador de posts, eu invalido o cache caso eu atualize ou apague um post. Assim:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Admin::PostsController</span> &lt; <span style="color:#036;font-weight:bold">Admin</span>::<span style="color:#036;font-weight:bold">BaseController</span>
  after_filter <span style="color:#A60">:clean_cache</span>, <span style="color:#A60">:only</span> =&gt; [<span style="color:#A60">:create</span>, <span style="color:#A60">:update</span>, <span style="color:#A60">:destroy</span>]
  ...
  protected
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">clean_cache</span>
    <span style="color:#036;font-weight:bold">Rails</span>.cache.delete(<span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA1</span>.hexdigest(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">post_</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span><span style="color:#33B">@post</span>.permalink.gsub(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">_</span><span style="color:#710">"</span></span>)<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>))
    <span style="color:#036;font-weight:bold">Rails</span>.cache.delete(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">recent_posts_etag</span><span style="color:#710">"</span></span>)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No caso faço um <tt>after_filter</tt> que vai rodar só depois dos métodos <tt>create</tt>, <tt>update</tt> e <tt>destroy</tt>. No caso ele apaga o <span class="caps">ETAG</span> do post (método <tt>show</tt> do controller público) que tem aquele formato “post_2010_01_01_foo” (no caso eu criei um método chamado <tt>permalink</tt> no model <tt>Post</tt> que formata isso) e também deleta o <span class="caps">ETAG</span> no caso da página principal (que eu guardo com a chave <tt>recent_posts_etag</tt>), que busca vários posts. Eu assumo que se um post mudar, é melhor recriar a homepage inteira porque não sei se esse post aparece listado lá ou não. Poderia ter uma lógica melhor, mas considerando que eu não fico atualizando ou deletando posts o tempo todo, isso deve bastar.</p>
<p>Meu blog é bem simples, mas se o administrador fosse mais complexo e precisasse invalidar o cache a partir de múltiplos pontos, o melhor é criar um <a href="https://railsbox.org/2008/8/22/usando-o-observer-no-rails">Observer</a> que centraliza a lógica e invalidação do cache de ETAGs.</p>
<h2>Sumarizando</h2>
<p>Não é um processo complicado mas precisa entender direito para que serve um <span class="caps">ETAG</span> e como funciona um cache. O uso do cache em si é bem simples, basicamente você lê (<tt>read</tt>) ou grava (<tt>write</tt>) nele a partir do objeto <tt>Rails.cache</tt>. Agora o importante é saber quando você invalida esse cache.</p>
<p>Logo que o servidor sobe, o cache está vazio, então ele precisa ir ao banco o tempo todo para cada requisição nova. Porém, é só a primeira vez porque a partir de agora ele vai armazenar o <span class="caps">ETAG</span> gerado no memcached e depois de 1 dia ou menos, a maioria dos meus posts já estarão com suas ETAGs no cache. Então o MySQL vai basicamente ficar sentado sem fazer nada – que é o ideal.</p>
<p>Então, minha otimização fez duas coisas: na primeira versão, que só gerava e processava ETAGs, eu economizei o tempo de processamento do <span class="caps">ERB</span> e envio do <span class="caps">HTML</span>. Agora estou economizando comunicação com o banco de dados, o tráfego dos dados entre o banco e o Rails e a geração dos ETAGs em si. Ou seja, o Rails está fazendo muito pouco, praticamente só servindo como um roteador mesmo.</p>
<p>Isso baixou o tempo de processamento médio de uma requisição do meu Rails de uns <strong>50ms</strong>, antes, para algo entre <strong>7ms</strong> e <strong>1ms</strong>!. Somado ao upgrade de memória de 512 para 768 MB de <span class="caps">RAM</span> e de 512 MB para 1 GB de swap, meu blog deve estar preparado para aguentar algumas ordens de grandeza mais tráfego simultâneo.</p>
<p></p>
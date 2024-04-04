---
title: "Você já está usando ETAGs, certo?"
date: "2010-05-25T13:15:00.000Z"
tags: ["beginner", "rails"]
years: "2010"
---

<p></p>
<p><strong>Atualizado 26/05:</strong> Ajustei o artigo de acordo com os comentários do Tapajós :-)</p>
<p>Essa dica é meio velha, mas como muita gente ainda desconhece vamos falar dela. Um recurso que surgiu no <a href="http://guides.rubyonrails.org/2_2_release_notes.html#better-integration-with-http--out-of-the-box-etag-support">Rails 2.2</a> é o suporte a <span class="caps">ETAG</span>. Se você ainda não usa, deveria. Isso porque é super simples, vai melhorar a performance do seu site para seus usuário e sai praticamente de graça, sem efeitos colaterais.</p>
<p></p>
<p></p>
<p>Para entender, vamos ver a estrutura de uma action comum de ActionController:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span>
  <span style="color:#33B">@posts</span> = <span style="color:#036;font-weight:bold">Post</span>.all
  respond_to <span style="color:#080;font-weight:bold">do</span> |format|
    format.html <span style="color:#777"># index.html.erb</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Toda vez que você requisitar esta action, o Rails vai buscar os dados no banco, renderizar o template <span class="caps">ERB</span> e enviar tudo pro cliente, todas as vezes. Você pode colocar uma regra de expires para que o browser do usuário não peça a mesma página por X tempos, mas isso não é eficiente se você efetivamente quer que o conteúdo novo seja enviado assim que for atualizado. Agora veja esta outra forma:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span>
  <span style="color:#33B">@posts</span> = <span style="color:#036;font-weight:bold">Post</span>.all
  <span style="color:#080;font-weight:bold">if</span> stale?(<span style="color:#A60">:etag</span> =&gt; etag(<span style="color:#33B">@posts</span>), <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span>)
    respond_to <span style="color:#080;font-weight:bold">do</span> |format|
      format.html <span style="color:#777"># index.html.erb</span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
private
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">etag</span>(collection)
    collection.inject(<span style="color:#00D">0</span>) { |etag, item| etag += item.updated_at.to_i }
  <span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É só isso. Acontece o seguinte, um <span class="caps">ETAG</span> é um identificador único de um determinado recurso. Pense como um Hash. No caso você pode passar qualquer número ao método “stale?”. Como eu sei que toda vez que um Post é atualizado o campo “updated_at” também muda, significa que basta um Post mudar para que a soma dos “updated_at” gerado no método “etag” que eu criei vai mudar. Agora, para que serve esse número?</p>
<p>Quando o Rails terminar de renderizar o template <span class="caps">ERB</span>, ele vai adicionar o seguinte cabeçalho na resposta ao navegador do usuário:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>ETAG: e2b62c2507dd32e23af8e89f305cd864
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso juntamente com o código de status “200 OK”. Porém, se o usuário pedir a mesma página outra vez, o navegador vai enviar junto com a requisição o seguinte cabeçalho:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>HTTP_IF_NONE_MATCH: e2b62c2507dd32e23af8e89f305cd864
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, ele vai dizer ao servidor: <em>“não me mande nada se o <span class="caps">ETAG</span> do recurso que estou pedindo ainda for o mesmo”</em>. Daí quando isso chegar no Rails, ele vai buscar os posts no banco e quando cair no método “stale?” ele vai notar que o navegador enviou um <span class="caps">ETAG</span> e vai comparar com o <span class="caps">ETAG</span> que ele acabou de computar. Se nenhum post mudou os ETAGs serão iguais. Nesse caso o Rails não vai processar o <span class="caps">ERB</span> e em vez disso vai enviar uma resposta vazia apenas com o código de status “304 Not Modified”, que o navegador saberá interpretar como <em>“beleza, nada mudou, então mantém a mesma página que já tenho”</em></p>
<p>Existe uma variação que é assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
  <span style="color:#33B">@post</span> = <span style="color:#036;font-weight:bold">Post</span>.find(params[<span style="color:#A60">:id</span>])
  fresh_when(<span style="color:#A60">:etag</span> =&gt; <span style="color:#33B">@post</span>.updated_at.to_i, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span>)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método <a href="https://apidock.com/rails/ActionController/Base/fresh_when">fresh_when</a> é chamado por baixo pelo “stale?”. Você usar o fresh_when quando não precisa customizar nada como o “render”. Já com o “stale?”, se vier o “If-None-Match” no cabeçalho <span class="caps">HTTP</span>, ele não vai executar nada que estiver dentro do bloco “if stale?”, daí vem os ganhos de processamento, não só da renderização do template mas de quaisquer outros processamentos. Por exemplo:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
  <span style="color:#33B">@post</span> = <span style="color:#036;font-weight:bold">Post</span>.find(params[<span style="color:#A60">:id</span>])
  <span style="color:#080;font-weight:bold">if</span> stale?(<span style="color:#A60">:etag</span> =&gt; <span style="color:#33B">@post</span>.updated_at.to_i, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span>)
    <span style="color:#33B">@comments</span> = <span style="color:#036;font-weight:bold">Post</span>.comments.all(<span style="color:#A60">:order</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">updated_at DESC</span><span style="color:#710">"</span></span>, <span style="color:#A60">:conditions</span> =&gt; { <span style="color:#A60">:spam</span> =&gt; <span style="color:#069">false</span> })
    <span style="color:#33B">@tags</span> = <span style="color:#036;font-weight:bold">Post</span>.tags.all
    respond_to <span style="color:#080;font-weight:bold">do</span> |format|
      format.html
      format.xml
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Neste exemplo, se vier o <span class="caps">ETAG</span> no “If-None-Match”, vamos economizar buscar os comentários e os tags do Post. Além de evitar gerar o mesmo <span class="caps">HTML</span> de novo também evita mais queries no banco de dados.</p>
<p>Outra coisa é que se você usar o método “fresh_when” precisa tomar cuidado para não cair em exceção de “Double Render Error”. Numa action Rails você não pode ter duas chamadas a “render” ou chamar “render” e “redirect_to” junto, por motivos óbvios. Por isso, esse código abaixo dará problemas:</p>
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
  <span style="color:#33B">@post</span> = <span style="color:#036;font-weight:bold">Post</span>.find(params[<span style="color:#A60">:id</span>])
  fresh_when(<span style="color:#A60">:etag</span> =&gt; <span style="color:#33B">@post</span>.updated_at.to_i, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span>)
  render <span style="color:#A60">:action</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">post</span><span style="color:#710">"</span></span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É necessário fazer uma checagem antes de chamar o “render” do exemplo acima:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">show</span>
  <span style="color:#33B">@post</span> = <span style="color:#036;font-weight:bold">Post</span>.find(params[<span style="color:#A60">:id</span>])
  fresh_when(<span style="color:#A60">:etag</span> =&gt; <span style="color:#33B">@post</span>.updated_at.to_i, <span style="color:#A60">:public</span> =&gt; <span style="color:#069">true</span>)
  <span style="color:#080;font-weight:bold">if</span> response.status == <span style="color:#00D">200</span>
    render <span style="color:#A60">:action</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">post</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O “if” acima resolve porque se o “fresh_when” detectou um <span class="caps">ETAG</span> ele já configurou o “response.status” para ser igual a “304” que é o código de “Not Modified” no cabeçalho de resposta.</p>
<p>E qual é o ganho? Nesse exemplo – ultra-simples – em modo desenvolvimento, no meu notebook, uma requisição normal com meros 5 registros devolveu em 9ms. Com a adição do <span class="caps">ETAG</span> isso caiu para 5ms, um ganho de cerca e <strong>40%</strong> de performance. Claro isso vai variar bastante, mas é claro que o tempo gasto em não processar o template <span class="caps">ERB</span> e em não enviar algumas dezenas de kilobytes do <span class="caps">HTML</span> gerado é uma boa economia tanto de processamento quanto de banda.</p>
<p>Um fator a se lembrar é que neste caso o banco de dados ainda é acessado, para poder computar o <span class="caps">ETAG</span>. E dependendo do método que computa esse valor, o processamento do <span class="caps">ETAG</span> em si pode ser custoso. Obviamente você não vai devolver listas com centenas de registros numa homepage, portanto valem as mesmas boas práticas.</p>
<p>Como exemplo temos este blog mesmo. Antigamente eu utilizava <a href="/2008/08/21/tutorial-de-rails-caching-parte-1">Page Caching</a> no meu blog, ou seja, gerava o <span class="caps">HTML</span> estático para economizar processamento. Mas o controle disso pode ser complicado dependendo do seu site. O <a href="https://twitter.com/tapajos">Marcos Tapajós</a> sugeriu usar <span class="caps">ETAG</span> e ele tinha razão: meu servidor não ficou muito mais pesado do que antes e isso economizou muito código extra pra lidar com expiração dos meus caches estáticos.</p>
<h2>Clientes de Web Services</h2>
<p>Agora um conceito que é igualmente importante: clientes de web services deveriam se comportar da mesma forma na presença de cabeçalhos como “If-Modified-Since”, “If-None-Match”, “Last Modified” e assim por diante. Ou seja, seu servidor, ao enviar o <span class="caps">XML</span>, <span class="caps">JSON</span>, Atom, etc deve enviar de volta informações como <span class="caps">ETAG</span>, Cache-Control e os clientes que consomem essa informação deveriam ser educados (como o <a href="https://twitter.com/guilhermesilveira">Guilherme Silveira</a>) e respeitá-las. Ou seja, devolver o “If-None-Match” na presença de <span class="caps">ETAG</span> e usar seu cache local caso o servidor tenha enviado informações de expiração.</p>
<p>Resolvi testar o próprio ActiveResource do Rails, que dá uma forma simples de criar clientes de web services <em><span class="caps">REST</span>-like</em> como o que o Rails implementa. Porém parece que ele não respeita essas informações. Não tenho 100% de certeza ainda, mas no meu teste eu envio de volta um <span class="caps">ETAG</span> e o cliente ActiveResource não envia o “If-None-Match”, forçando meu servidor a reprocessar a informação.</p>
<p>Se você lida com clientes de web services, lembre-se de implementar essas e outras regras que o <span class="caps">HTTP</span> especifica e torne-se um bom cidadão da internet.</p>
<p></p>
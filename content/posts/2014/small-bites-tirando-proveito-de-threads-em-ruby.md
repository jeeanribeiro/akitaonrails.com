---
title: "[Small Bites] Tirando Proveito de Threads em Ruby"
date: "2014-07-15T17:03:00.000Z"
tags: ["ruby"]
years: "2014"
---

<p></p>
<p>Diferente dos meus longos posts <a href="http://en.wikipedia.org/wiki/Wikipedia:Too_long;_didn't_read">TL;DR</a>, quero experimentar um tamanho mais 'small bites'.</p>
<p>Vocês devem ter notado que em todo post do meu blog tem uma lista ao final organizando todos os links que eu espalho por todo o texto, assim você pode ir direto até lá se quiser se lembrar de um link, em vez de ter que reler o texto todo.</p>
<p>Para fazer isso eu implementei um simples <tt>before_save</tt> no meu model de <tt>Post</tt> onde eu vasculho o texto para buscar todos os links, desta forma:</p>
<p></p>
<p>
</p>
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
</pre>
      </td>
      <td class="code"><pre>html = <span style="color:#069">self</span>.excerpt_html.to_s + <span style="color:#069">self</span>.body_html.to_s
<span style="color:#080;font-weight:bold">return</span> [] <span style="color:#080;font-weight:bold">if</span> html.empty?
doc = <span style="color:#036;font-weight:bold">Nokogiri</span>::<span style="color:#036;font-weight:bold">HTML</span>.parse(html)
links = doc.css(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">a</span><span style="color:#710">'</span></span>).select { |link| link[<span style="color:#A60">:href</span>] !~ <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^#</span><span style="color:#404">/</span></span> }
links = links.reduce([]) <span style="color:#080;font-weight:bold">do</span> |result, link|
  result &lt;&lt; { <span style="color:#A60">:href</span>     =&gt; link[<span style="color:#A60">:href</span>],
              <span style="color:#A60">:title</span>    =&gt; link.try(<span style="color:#A60">:children</span>).try(<span style="color:#A60">:to_s</span>).try(<span style="color:#A60">:strip</span>),
              <span style="color:#A60">:internal</span> =&gt; <span style="color:#069">false</span> }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Com isso tenho todos os links dentro da collection <tt>links</tt>, e agora vou de item a item, para puxar o link e buscar o título em seu conteúdo (que é o método <tt>retrieve_title</tt> no trecho abaixo):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>links.each <span style="color:#080;font-weight:bold">do</span> |link|
  retrieve_title(link)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Dependendo do post, se tiver muitos links (como o gigante recente de <a href="https://www.akitaonrails.com/2014/07/06/web-components-e-uma-revolucao">Web Components</a>), ele pode demorar até quase 20 segundos!!</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>    user     system      total        real
0.310000   0.290000   0.600000 ( 19.968512)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método <tt>retrieve_title</tt> que fiz, internamente chama outro método para puxar o link da internet e ler o título, usando Nokogiri:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">parse_external_link</span>(href)
  <span style="color:#777"># require 'timeout' # precisa requerer isso antes</span>
  <span style="color:#080;font-weight:bold">begin</span>
    <span style="color:#036;font-weight:bold">Timeout</span>::timeout(<span style="color:#00D">3</span>) {
      doc = <span style="color:#036;font-weight:bold">Nokogiri</span>::HTML(open(href,
        ssl_verify_mode: <span style="color:#036;font-weight:bold">OpenSSL</span>::<span style="color:#036;font-weight:bold">SSL</span>::<span style="color:#036;font-weight:bold">VERIFY_NONE</span>,
        allow_redirections: <span style="color:#A60">:all</span>))
      <span style="color:#080;font-weight:bold">return</span> doc.css(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">title</span><span style="color:#710">'</span></span>).first.children.to_s.strip
    }
  <span style="color:#080;font-weight:bold">rescue</span>
    <span style="color:#080;font-weight:bold">return</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E isso vai ser lento mesmo, porque o tempo de espera para fazer a conexão HTTP, esperar baixar os bits - que vai depender da velocidade da sua conexão -, para uma lista grande de links, pode demorar muitos segundos. E quanto mais links, mais vai demorar. No meu exemplo, no pior caso, se tiver 20 links e todos forem lentos, vai levar pelo menos 60 segundos pra terminar o processo (dado que eu coloquei um timeout de 3 segundos, no máximo, por link).</p>
<p>Outra forma é usar Thread. Mas aí a primeira coisa que você pode lembrar é:</p>
<blockquote>"Mas eu sei que threads não funcionam em Ruby por causa do tal GIL - Global Interpreter Lock."</blockquote>
<p>E isso é uma <strong>meia verdade</strong>. De fato, threads em Ruby não funcionam como em Java, por exemplo. Um único processo Ruby, só vai conseguir saturar um único Core do seu CPU. Mas internamente você pode executar tarefas concorrentemente em múltiplas threads <strong>se, e somente se</strong>, ela não bloquear. E no caso, I/O (chamada de rede, arquivo, sockets, etc) não bloqueia!</p>
<p>Sabendo disso, o trecho anterior eu posso escrever assim:</p>
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
      <td class="code"><pre>pool = []
links.each <span style="color:#080;font-weight:bold">do</span> |link|
  pool &lt;&lt; <span style="color:#036;font-weight:bold">Thread</span>.new {
    retrieve_title(link)
  }
<span style="color:#080;font-weight:bold">end</span>
pool.each(&amp;<span style="color:#A60">:join</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note que adiciono e inicio múltiplas threads e adiciono num array e depois dou join em todos eles, o que significa esperar até todos terminarem para prosseguir, mas neste ponto todos estão executando concorrentemente. E se fizer a mesma medição, com a mesma quantidade de links que antes estava dando mais de 19 segundos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>    user     system      total        real
0.200000   0.300000   0.500000 (  1.611597)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Apenas <strong>1.6</strong> segundo! Este trecho em particular ficou <strong>12 vezes</strong> mais rápido com quase nenhum esforço!</p>
<h2>Indo Além</h2>
<p><a href="https://lucaguidi.com/2014/03/27/thread-safety-with-ruby.html">Threads não são triviais, embora simples</a>. Como em qualquer linguagem, devemos tomar cuidado para não escrever no mesmo recurso concorrentemente e cair em <a href="https://blog.carbonfive.com/2011/10/11/a-modern-guide-to-threads/">condições de corrida</a>.</p>
<p>Existem outras formas de executar código em paralelo em Ruby. Uma delas é usar o bom e velho <a href="https://www.ruby-doc.org/core-2.1.2/Process.html#method-c-fork">fork</a>. E para abstrair threads e forks, você pode utilizar gems como o <a href="https://github.com/tra/spawnling">spawnling</a> ou o mais maduro <a href="https://github.com/grosser/parallel">parallel</a>.</p>
<p>Fork de processos tem a vantagem de ser "thread-safe", já que tudo vai rodar em processos isolados. Mas eles obviamente são muito mais pesados que threads. Somente a antiga versão 1.8.7 Phusion Enterprise Edition e agora a mais atual 2.1.2 tem o recurso de "copy-on-write", onde um fork não duplica a quantidade de memória.</p>
<p>Além de threads e processos, a terceira forma - mais na moda - é usar I/O assíncrono, com modelo de Actors. E para isso o melhor no mundo Ruby é o grande <a href="https://celluloid.io">Celluloid</a>, mas aí já é demais para este 'small bite'.</p>
<p></p>
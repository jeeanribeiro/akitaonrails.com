---
title: "Páginas Estáticas no Rails"
date: "2011-11-11T03:38:00.000Z"
tags: ["beginner", "rails"]
years: "2011"
---

<p></p>
<p>Faz tempo que não posto uma dica técnica, vou retornando aos poucos. Hoje uma dica bem simples mas que muitos ainda desconhecem.</p>
<p>Muitos aplicativos Rails tem seções com páginas estáticas, páginas de conteúdo como institucional, instruções, etc. Digamos que para organizar isso você tenha criado um controller chamado “Page”, assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle exec rails g controller Page
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O problema é que eu sempre vejo algo parecido com isto no <tt>config/routes.rb</tt></p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>  match <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page/hello</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page#hello</span><span style="color:#710">"</span></span>
  match <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page/help</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page#help</span><span style="color:#710">"</span></span>
  ...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Daí no <tt>app/controllers/page_controller.rb</tt> encontro:</p>
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
      <td class="code"><pre>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hello</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">help</span>
  <span style="color:#080;font-weight:bold">end</span>
  ...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>Actions vazias de <em>placeholder</em> somente para renderizar páginas estáticas como <tt>app/views/page/hello.html.erb</tt>. E este exemplo tem apenas duas páginas, agora escale isso para algumas dezenas e você verá logo o <em>code smell</em> de um clássico <em>efeito shotgun</em>: múltiplos <tt>match</tt> redundantes no <tt>routes.rb</tt> e múltiplos métodos vazios no controller.</p>
<p>Em vez disso, uma das muitas formas de resolver esse problema é fazer simplesmente isto no arquivo <tt>config/routes.rb</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>  get <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page/:id</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page#index</span><span style="color:#710">"</span></span>, <span style="color:#A60">:as</span> =&gt; <span style="color:#A60">:page</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E no controller “Page” ter uma única action:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span>
    render params[<span style="color:#A60">:id</span>]
  <span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora você pode colocar quantas views quiser em <tt>app/views/page</tt> e quando chamar <tt>https://localhost:3000/page/hello</tt> ele irá automaticamente mapear para <tt>app/views/page/hello.html.erb</tt>.</p>
<p>Eu disse “páginas estáticas” mas na verdade seriam “semi-estáticas” já que normalmente faríamos desta forma porque queremos que a página herde o layout principal e tudo mais. Se for para ser uma página realmente estática, fora do layout padrão do site, etc, você pode simplesmente colocar um html no diretório <tt>public</tt>.</p>
<p>Dá para melhorar mais isso, fazendo algumas checagens óbvias como validar se o template da página existe:</p>
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
      <td class="code"><pre>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">index</span>
    <span style="color:#080;font-weight:bold">if</span> params[<span style="color:#A60">:id</span>] &amp;&amp; template_exists?(params[<span style="color:#A60">:id</span>], [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">page</span><span style="color:#710">"</span></span>])
      render params[<span style="color:#A60">:id</span>]
    <span style="color:#080;font-weight:bold">else</span>
      redirect_to <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">/404.html</span><span style="color:#710">'</span></span>, <span style="color:#A60">:status</span> =&gt; <span style="color:#00D">404</span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A dica é a mesma de sempre: se está parecendo um amontoado de copy &amp; paste em todas as camadas, alguma coisa está definitivamente errada. Como eu disse antes, existem múltiplas maneiras para resolver essa funcionalidade, se tiverem outras melhores, não deixem de comentar.</p>
<p></p>
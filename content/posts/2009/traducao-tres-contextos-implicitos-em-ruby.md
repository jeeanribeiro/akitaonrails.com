---
title: "[Tradução] Três Contextos Implícitos em Ruby"
date: "2009-11-16T17:28:00.000Z"
tags: ["ruby", "translation", "beginner"]
years: "2009"
---

<p></p>
<p>[Tradução] Três Contextos Implícitos em Ruby</p>
<p>A desenvolvedora japonês <strong>@yugui</strong> <a href="http://yugui.jp/articles/846">escreveu um grande complemento</a> ao artigo anterior sobre metaprogramação do Yehuda, que traduzo logo abaixo:</p>
<p>Yehuda Katz escreveu <a href="http://www.akitaonrails.com/2009/11/16/traducao-metaprogramacao-em-ruby-e-tudo-sobre-self">um artigo sobre <code>self</code> e metaclass</a>. Nesse artigo ele disse que <code>Person.instance_eval</code> associa a <strong>metaclass de Person</strong> para <code>self</code> para uma classe <code>Person</code>, mas isso é obviamente errado.</p>
<p></p>
<p></p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Person</span>; <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#036;font-weight:bold">Person</span>.instance_eval{ p <span style="color:#069">self</span> }  <span style="color:#777">#=&gt; Person</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como mencionei em um <a href="https://yugui.jp/articles/558">artigo antigo</a>, embora eu deva me desculpar por estar escrito em japonês, Ruby sempre tem 3 contextos implícitos: self, o chamado ‘klass’ e o ponto constante de definição. Yehuda está confundindo <em>self</em> com ‘klass’.</p>
<h2>self</h2>
<p><code>self</code> é o <code>self</code> que você conhece. É o receptor padrão de invocação de método. Sempre existe um <code>self</code>.</p>
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
      <td class="code"><pre>p <span style="color:#069">self</span>                         <span style="color:#777"># mostra "main"  </span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Foo</span>  
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">bar</span>(a = (p <span style="color:#069">self</span>)) <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>  
foo = <span style="color:#036;font-weight:bold">Foo</span>.new  
foo.bar                        <span style="color:#777"># mostra "#&lt;Foo:0x471004&gt;"  </span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Foo</span>  
  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Baz</span> &lt; (p <span style="color:#069">self</span>; <span style="color:#069">self</span>)   <span style="color:#777"># mostra "Foo"  </span>
  <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No nível superior, uma instância especial de <code>Object</code> chamada “main” é o self. Onde quer que esteja, você pode recuperar o self a partir da pseudovariável <code>self</code>.</p>
<p>Se você invocar um método sem explicitar um receptor, <code>self</code> receberá essa invocação.</p>
<h2>o chamado ‘klass’</h2>
<p>Eu chamei o conceito de ‘klass’ no artigo antigo, mas não sei se é o melhor nome. É a classe padrão sobre o qual o método é definido. Agora gostaria de chamá-lo “definidor padrão”.</p>
<p>Ruby sempre segura a referência a uma classe assim como ao <code>self</code>. Mas não há maneira de recuperá-lo diretamente. É mais implícito que <code>self</code>. Se você definir um método sem dar um receptor específico, em outras palavras, se definir um método com o jeito sintático normal de definir métodos, o definidor padrão terá o método como um método de instância.</p>
<h3>Exemplos:</h3>
<p>No nível superior, <code>Object</code> é a classe. Então funções globais são igualmente métodos de instância na classe <code>Object</code> como você já sabe.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hoge</span>; <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#036;font-weight:bold">Kernel</span>.instance_method(<span style="color:#A60">:hoge</span>)  <span style="color:#777">#=&gt; #&lt;UnboundMethod: Object#hoge&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aliás, “hoge”, “fuga”, “piyo” é japonês para “foo”, “bar”, “baz”.</p>
<p>A sintaxe <code>class</code> muda ambos os <code>self</code> e o definidor padrão para a classe que está agora sendo definida.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">T</span>  
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hoge</span>; <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>  
<span style="color:#036;font-weight:bold">T</span>.instance_method(<span style="color:#A60">:hoge</span>)      <span style="color:#777">#=&gt; #&lt;UnboundMethod: T#hoge&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em um corpo normal de método, <code>self</code> é o receptor de invocação de métodos e o definidor padrão é a classe sintaticamente fora dela, agora ela é <code>T</code>.</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">T</span>  
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hoge</span>  
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">fuga</span>; <span style="color:#080;font-weight:bold">end</span>  
  <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>  
t = <span style="color:#036;font-weight:bold">T</span>.new  
t.hoge  
t.method(<span style="color:#A60">:fuga</span>)               <span style="color:#777">#=&gt; #&lt;Method: T#fuga&gt;  </span>
<span style="color:#036;font-weight:bold">T</span>.instance_method(<span style="color:#A60">:fuga</span>)      <span style="color:#777">#=&gt; #&lt;UnboundMethod: T#fuga&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não confunda isso com <code>def self.fuga</code>, uma definição de método singleton. Quando você dá uma definição de método a um receptor, o método será adicionado à eigenclass do receiver.</p>
<script src="https://gist.github.com/236302.js"></script>
<p>U não tem um método de instância chamado <code>fuga</code> porque <code>fuga</code> é um método singleton de <code>u</code>.</p>
<p>Onde quer que esteja, existe um definidor padrão. Quando executa um valor padrão, o definidor padrão é a classe externa assim como no corpo do método.</p>
<script src="https://gist.github.com/236303.js"></script>
<p>Em outras palavras, a definição <code>class</code> muda o definidor padrão mas não a definição de método.</p>
<h2>família eval</h2>
<p>O que o <code>instance_eval</code> faz é:</p>
<ul>
  <li>mudar o <code>self</code> para o receptor do <code>instance_eval</code></li>
  <li>mudar o definidor padrão para o eigenclass do receptor</li>
  <li>se o receptor não tiver um eigenclass ainda, cria um.</li>
  <li>executa o bloco dado</li>
</ul>
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
      <td class="code"><pre>o = <span style="color:#036;font-weight:bold">Object</span>.new  
o.instance_eval <span style="color:#080;font-weight:bold">do</span>  
  p <span style="color:#069">self</span>                       <span style="color:#777">#=&gt; #&lt;Object:0x454f24&gt;  </span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hoge</span>; <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>  
o.method(<span style="color:#A60">:hoge</span>)                <span style="color:#777">#=&gt; #&lt;Method: #&lt;Object:0x454f24&gt;.hoge&gt;  </span>
<span style="color:#036;font-weight:bold">Object</span>.instance_method(<span style="color:#A60">:hoge</span>)  <span style="color:#777"># raises a NameError "undefined method `hoge' for class `Object'"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vamos lá:</p>
<script src="https://gist.github.com/236305.js"></script>
<p>Como o <code>instance_eval</code> muda o definidor padrão do eigenclass para <code>$o</code>, então <code>fuga</code> e <code>piyo</code> serão métodos singleton de <code>$o</code></p>
<p>Oops, esqueci de mencionar que:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#069">RUBY_VERSION</span>               <span style="color:#777">#=&gt; "1.9.1".  </span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ruby 1.8 age de maneira mais léxica, então você acabará tendo o contrário:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#d70">$o</span>.method(<span style="color:#A60">:fuga</span>)           <span style="color:#777"># raises a NameError  </span>
<span style="color:#d70">$o</span>.method(<span style="color:#A60">:piyo</span>)           <span style="color:#777"># raises a NameError  </span>
<span style="color:#036;font-weight:bold">T</span>.instance_method(<span style="color:#A60">:fuga</span>)   <span style="color:#777">#=&gt; #&lt;UnboundMethod: T#fuga&gt;  </span>
<span style="color:#036;font-weight:bold">T</span>.instance_method(<span style="color:#A60">:piyo</span>)   <span style="color:#777">#=&gt; #&lt;UnboundMethod: T#piyo&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby 1.8, o definidor padrão no corpo do método é baseado lexicamente na definição da classe externa. De qualquer forma, tanto no Ruby 1.8 quanto 1.9, <code>instance_eval</code> muda <code>self</code> para o receptor, o definidor padrão a seu eigenclass.</p>
<p>Finalmente, <code>class_eval</code> muda ambos <code>self</code> e o definidor padrão para o receptor:</p>
<table>
  <tbody>
    <tr>
      <td> </td>
      <td> <strong>self</strong> </td>
      <td> <strong>definidor padrão</strong> </td>
    </tr>
    <tr>
      <td> class_eval </td>
      <td> o receptor </td>
      <td> o receptor </td>
    </tr>
    <tr>
      <td> instance_eval </td>
      <td> o receptor </td>
      <td> eigenclass do receptor </td>
    </tr>
  </tbody>
</table>
<p><br></p>
<p>No meu <a href="https://yugui.jp/articles/558">artigo antigo</a> eu discuti sobre <code>Kernel#eval</code> e <code>instance_eval/class_eval</code> com execução de Strings.</p>
<h2>definição de constantes</h2>
<p>Quando você vê uma variável de instância, ela é uma variável da instância de <code>self</code>. Quando você usa uma variável de classe, ela é uma variável de classe da classe de <code>self</code>; ou o próprio <code>self</code> quando <code>self</code> é uma classe.</p>
<p>Mas constantes se comportam de maneira diferente. É outro contexto implícito de Ruby. O Ruby Core Team chama esse conceito de “cref”.</p>
<p>Discutiremos esse conceito de “cref” em outro artigo.</p>
<p></p>
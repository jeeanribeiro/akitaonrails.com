---
title: "Asset Pipeline para Iniciantes - Parte 2"
date: "2012-07-02T02:35:00.000Z"
tags: ["rails", "tutorial", "front-end"]
years: "2012"
---

<p></p>
<p>Não perca o início deste artigo, na <a href="http://akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">Parte 1</a></p>
<p></p>
<p></p>
<h2>Ambientes de Desenvolvimento e Produção</h2>
<p>Agora entenda uma regra básica:</p>
<ul>
  <li>toda <span class="caps">URL</span> que você passar ao Rails é analisada pelo sistema de roteamento, que você configura em <tt>config/routes.rb</tt></li>
  <li>a exceção é tudo que estiver no diretório <tt>public</tt>, graças ao middleware Rack::Static.</li>
</ul>
<p>Ou seja, se você pedir por <tt>https://localhost:3000/uploads/application.js</tt> isso nem vai passar pelo Rails porque, como vimos na listagem do diretório <tt>public/uploads</tt> acima, esse arquivo existe lá e, portanto, será servido diretamente.</p>
<p>Por isso a recomendação, depois do último exercício com pré-compilação é apagar tudo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rm -Rf public/uploads
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Desta forma, quando você subir o servidor Rails no ambiente padrão de desenvolvimento, a mesma <span class="caps">URL</span> irá passar pelo Rails, pelo Asset Pipeline, e processará o arquivo <tt>app/uploads/javascripts/application.js</tt>. Assim, toda vez que fizer modificações e recarregar a página no navegador, você verá as mudanças imediatamente. Se estivesse précompilado, veria a versão antiga, sem as modificações novas.</p>
<p>A compilação em tempo real só acontece em desenvolvimento pois, obviamente, é um processo lento. Em produção, ninguém em sã consciência vai alterar nenhum arquivo direto em servidor de produção, portanto é importante ter tudo précompilado em <tt>public/uploads</tt> para economizar o aplicativo Rails do trabalho.</p>
<p>Outra coisa importante, os arquivos de assets que se chamam “application”, são automaticamente compilados. Mas digamos que você tem um stylesheet que não vai carregar no layout principal, mas só em algumas outra seções, digamos que se chame <tt>special.css</tt>, ou seja, precisamos encontrá-lo em <tt>https://localhost:3000/uploads/special.css</tt>, criamos nesta estrutura:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>app
  assets
    stylesheets
      special.css
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Porém, se reexecutarmos o rake task <tt>assets:precompile</tt> novamente, verá que esse arquivo não aparece em <tt>public/uploads</tt>. Recapitulando, arquivos “application” são automaticamente usados na précompilação. Todo asset declarado nesses manifestos, será usado dentro dos arquivos minificados “application”. Agora, para adicionar arquivos extras, precisamos declará-los manualmente em <tt>config/application.rb</tt>, adicionado uma linha assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>config.assets.precompile += <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%w(</span><span style="color:#D20">special.css</span><span style="color:#710">)</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Colocar tudo no “application” e carregar esse arquivo no layout principal para que toda página tenha tudo? Ou separar <span class="caps">CSS</span> e <span class="caps">JSS</span> que é necessário seção a seção do site? Não tenho uma regra rígida. Se a aplicação não for tão grande assim, provavelmente centralizar tudo em “application” é a saída mais simples de gerenciar. Porém se a aplicação for ou muito grande, ou se determinada seção é relativamente mais pesada em JS que as demais, por exemplo, talvez valha a pena gerenciar assets em separado, usando a configuração acima.</p>
<p>Agora sim, se executar a task de precompile novamente, teremos algo como:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>special-f7bf76f875ce5c9edd0075eaea3f6140.css
special-f7bf76f875ce5c9edd0075eaea3f6140.css.gz
special.css
special.css.gz
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Compass e <span class="caps">SASS</span></h2>
<p>Agora, por que adicionamos o Compass? Não vou fazer desta seção um tutorial de Compass, mas para que entendem o básico, podemos adicionar o seguinte <span class="caps">CSS</span> de exemplo em <tt>app/uploads/stylesheets/application.css.scss</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">compass</span><span style="color:#710">"</span></span>;
<span style="color:#B06;font-weight:bold">.box</span> {
  <span style="color:#606">font</span> {
    <span style="color:#606">family</span>: <span style="color:#088">Lucida</span> <span style="color:#088">Grande</span>;
    <span style="color:#606">size</span>: <span style="color:#60E">12px</span>;
  }
  <span style="color:#606">width</span>: <span style="color:#60E">400px</span>;
  <span style="color:#606">padding</span>: <span style="color:#60E">15px</span>;
  <span style="color:#606">border</span>: <span style="color:#60E">1px</span> <span style="color:#088">solid</span> <span style="color:#088">black</span>;
  <span style="color:#088;font-weight:bold">@include</span> <span style="color:#F00;background-color:#FAA">t</span><span style="color:#F00;background-color:#FAA">e</span><span style="color:#F00;background-color:#FAA">x</span><span style="color:#F00;background-color:#FAA">t</span><span style="color:#F00;background-color:#FAA">-</span><span style="color:#F00;background-color:#FAA">s</span><span style="color:#F00;background-color:#FAA">h</span><span style="color:#F00;background-color:#FAA">a</span><span style="color:#F00;background-color:#FAA">d</span><span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">w</span>(<span style="color:#60E">1px</span> <span style="color:#60E">0</span> <span style="color:#60E">1px</span> <span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">p</span><span style="color:#F00;background-color:#FAA">a</span><span style="color:#F00;background-color:#FAA">c</span><span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">f</span><span style="color:#F00;background-color:#FAA">y</span>(<span style="color:#0A0">#5c5c5c</span>, <span style="color:#60E">.37</span>));
  <span style="color:#088;font-weight:bold">@include</span> <span style="color:#F00;background-color:#FAA">b</span><span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">x</span><span style="color:#F00;background-color:#FAA">-</span><span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">r</span><span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">e</span><span style="color:#F00;background-color:#FAA">n</span><span style="color:#F00;background-color:#FAA">t</span>(<span style="color:#606">horizontal</span>);
  <span style="color:#088;font-weight:bold">@include</span> <span style="color:#F00;background-color:#FAA">b</span><span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">r</span><span style="color:#F00;background-color:#FAA">d</span><span style="color:#F00;background-color:#FAA">e</span><span style="color:#F00;background-color:#FAA">r</span><span style="color:#F00;background-color:#FAA">-</span><span style="color:#F00;background-color:#FAA">r</span><span style="color:#F00;background-color:#FAA">a</span><span style="color:#F00;background-color:#FAA">d</span><span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">u</span><span style="color:#F00;background-color:#FAA">s</span>(<span style="color:#60E">20px</span>, <span style="color:#60E">20px</span>);
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Na maior parte parece um <span class="caps">CSS</span> normal, mas a diferença maior está nos comandos <tt>@include</tt> do Sass, que serve para carregar “Mixins”. Pense em Mixin no Sass como “funções” que retornam <span class="caps">CSS</span> parametrizável e reusável. O Compass é uma biblioteca de Mixins que encapsulam alguns dos aspectos mais comuns de <span class="caps">CSS</span>. No exemplo, estamos chamando os mixins <tt>text-shadow</tt> e <tt>border-radius</tt>, cuja função deve ser bastante óbvia. Vamos ver o <span class="caps">CSS</span> que isso gera:</p>
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
      <td class="code"><pre><span style="color:#777">/* line 3, ../../app/uploads/stylesheets/application.css.scss */</span>
<span style="color:#B06;font-weight:bold">.box</span> {
  <span style="color:#606">width</span>: <span style="color:#60E">400px</span>;
  <span style="color:#606">padding</span>: <span style="color:#60E">15px</span>;
  <span style="color:#606">border</span>: <span style="color:#60E">1px</span> <span style="color:#088">solid</span> <span style="color:#088">black</span>;
  <span style="color:#606">text-shadow</span>: <span style="color:#60E">1px</span> <span style="color:#60E">0</span> <span style="color:#60E">1px</span> <span style="color:#0A0">#5c5c5c</span>;
  <span style="color:#606">-webkit-box-orient</span>: <span style="color:#088">horizontal</span>;
  <span style="color:#606">-moz-box-orient</span>: <span style="color:#088">horizontal</span>;
  <span style="color:#606">-ms-box-orient</span>: <span style="color:#088">horizontal</span>;
  <span style="color:#606">box-orient</span>: <span style="color:#088">horizontal</span>;
  <span style="color:#606">-webkit-border-radius</span>: <span style="color:#60E">20px</span> <span style="color:#60E">20px</span>;
  <span style="color:#606">-moz-border-radius</span>: <span style="color:#60E">20px</span> / <span style="color:#60E">20px</span>;
  <span style="color:#606">-ms-border-radius</span>: <span style="color:#60E">20px</span> / <span style="color:#60E">20px</span>;
  <span style="color:#606">-o-border-radius</span>: <span style="color:#60E">20px</span> / <span style="color:#60E">20px</span>;
  <span style="color:#606">border-radius</span>: <span style="color:#60E">20px</span> / <span style="color:#60E">20px</span>;
}
<span style="color:#777">/* line 4, ../../app/uploads/stylesheets/application.css.scss */</span>
<span style="color:#B06;font-weight:bold">.box</span> <span style="color:#339;font-weight:bold">font</span> {
  <span style="color:#606">family</span>: <span style="color:#088">Lucida</span> <span style="color:#088">Grande</span>;
  <span style="color:#606">size</span>: <span style="color:#60E">12px</span>;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Fica claro a função de “nesting”, para herdar estilos de um elemento pai, que usamos no elemento “font” para não repetir em blocos separados, como no <span class="caps">CSS</span> final. O “text-shadow” foi simples, mas o “box-orient” e border-radius" automaticamente adicionaram todas as diretivas específicas de cada browser, coisas como “-webkit”, “-moz”, etc.</p>
<p>Veja a documentação de <a href="https://compass-style.org/reference/compass/">referência do Compass</a> para encontrar todos os mixins e exemplos detalhados de como usá-los.</p>
<p>Isso é interessante, mas a principal função, para fechar todas as situações que descrevi na introdução do artigo, é a que se segue.</p>
<p>Primeiro, vamos adicionar duas novas imagens na pasta <tt>app/images/social-icons</tt>:</p>
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
      <td class="code"><pre>app
  images
    social-icons
      facebook.png
      linkedin.png
      twitter.png
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, vamos adicionar o seguinte <span class="caps">HTML</span> em <tt>app/views/home/index.html.erb</tt>:</p>
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
      <td class="code"><pre>...
<span style="color:#070">&lt;ol</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">social</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
  <span style="color:#070">&lt;li</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">twitter</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://www.twitter.com</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Twitter<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span>
  <span style="color:#070">&lt;li</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">facebook</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://www.facebook.com</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Facebook<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span>
  <span style="color:#070">&lt;li</span> <span style="color:#b48">class</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">linkedin</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://www.linkedin.com</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>LinkedIn<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span>
<span style="color:#070">&lt;/ol&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nada demais, apenas o objetivo de adicionar ícones de redes sociais com links a eles. Para estilizá-los, vamos completar nosso <span class="caps">SCSS</span> assim:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">compass</span><span style="color:#710">"</span></span>;
<span style="color:#088;font-weight:bold">@import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">social-icons/*.png</span><span style="color:#710">"</span></span>;
...
<span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> {
  <span style="color:#088;font-weight:bold">@include</span> <span style="color:#606">horizontal-list</span>;
  <span style="color:#088;font-weight:bold">@each</span> <span style="color:#F00;background-color:#FAA">$</span><span style="color:#606">network</span> <span style="color:#606">in</span> <span style="color:#606">twitter</span>, <span style="color:#606">facebook</span>, <span style="color:#606">linkedin</span> {
    <span style="color:#606">li</span>.<span style="color:#F00;background-color:#FAA">#</span>{<span style="color:#F00;background-color:#FAA">$</span><span style="color:#606">network</span>} <span style="color:#606">a</span> {
      <span style="color:#088;font-weight:bold">@include</span> <span style="color:#F00;background-color:#FAA">s</span><span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">c</span><span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">a</span><span style="color:#F00;background-color:#FAA">l</span><span style="color:#F00;background-color:#FAA">-</span><span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">c</span><span style="color:#F00;background-color:#FAA">o</span><span style="color:#F00;background-color:#FAA">n</span><span style="color:#F00;background-color:#FAA">s</span><span style="color:#F00;background-color:#FAA">_</span><span style="color:#F00;background-color:#FAA">s</span><span style="color:#F00;background-color:#FAA">p</span><span style="color:#F00;background-color:#FAA">r</span><span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">t</span><span style="color:#F00;background-color:#FAA">e</span>(<span style="color:#F00;background-color:#FAA">#</span>{<span style="color:#F00;background-color:#FAA">$</span><span style="color:#606">network</span>})
    }
  }
  <span style="color:#606">a</span> {
    <span style="color:#606">height</span>: <span style="color:#60E">32px</span>;
    <span style="color:#606">width</span>: <span style="color:#60E">32px</span>;
    <span style="color:#606">display</span>: <span style="color:#088">block</span>;
    <span style="color:#606">text-indent</span>: <span style="color:#60E">-9000px</span>;
    <span style="color:#606">color</span>: <span style="color:#0A0">#FFF</span>;
  }
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, estude <span class="caps">SASS</span> para entender essa sintaxe e também note que novamente usamos um mixin do Compass chamado <tt>horizontal-list</tt>. Lembre que colocamos 3 novas imagens, listados acima. Agora neste <span class="caps">SCSS</span>, na segunda linha, fazemos um <tt>@import</tt> de todos esses ícones.</p>
<p>Agora localize esta linha: <tt>@include social-icons_sprite(#{$network})</tt>. O nome da pasta, com o sufixo “_sprite” se torna um mixin, que recebe como parâmetro o nome da imagem/sprite. O que significa isso no <span class="caps">CSS</span> gerado ao final? Vejamos:</p>
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
      <td class="code"><pre><span style="color:#777">/* line 58, social-icons/*.png */</span>
<span style="color:#B06;font-weight:bold">.social-icons-sprite</span>, <span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> <span style="color:#339;font-weight:bold">li</span><span style="color:#B06;font-weight:bold">.twitter</span> <span style="color:#339;font-weight:bold">a</span>, <span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> <span style="color:#339;font-weight:bold">li</span><span style="color:#B06;font-weight:bold">.facebook</span> <span style="color:#339;font-weight:bold">a</span>, <span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> <span style="color:#339;font-weight:bold">li</span><span style="color:#B06;font-weight:bold">.linkedin</span> <span style="color:#339;font-weight:bold">a</span> {
  <span style="color:#606">background</span>: <span style="color:#06B;font-weight:bold"><span style="color:black">url(</span><span>/uploads/social-icons-s25bc94da3e.png</span><span style="color:black">)</span></span> <span style="color:#088">no-repeat</span>;
}
...
<span style="color:#777">/* line 20, ../../app/uploads/stylesheets/application.css.scss */</span>
<span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> <span style="color:#339;font-weight:bold">li</span><span style="color:#B06;font-weight:bold">.twitter</span> <span style="color:#339;font-weight:bold">a</span> {
  <span style="color:#606">background-position</span>: <span style="color:#60E">0</span> <span style="color:#60E">-32px</span>;
}
<span style="color:#777">/* line 20, ../../app/uploads/stylesheets/application.css.scss */</span>
<span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> <span style="color:#339;font-weight:bold">li</span><span style="color:#B06;font-weight:bold">.facebook</span> <span style="color:#339;font-weight:bold">a</span> {
  <span style="color:#606">background-position</span>: <span style="color:#60E">0</span> <span style="color:#60E">-64px</span>;
}
<span style="color:#777">/* line 20, ../../app/uploads/stylesheets/application.css.scss */</span>
<span style="color:#339;font-weight:bold">ol</span><span style="color:#B06;font-weight:bold">.social</span> <span style="color:#339;font-weight:bold">li</span><span style="color:#B06;font-weight:bold">.linkedin</span> <span style="color:#339;font-weight:bold">a</span> {
  <span style="color:#606">background-position</span>: <span style="color:#60E">0</span> <span style="color:#60E">0</span>;
}
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui vemos o que aconteceu: as 3 imagens separadas foram concatenadas numa única, declarada no topo do <span class="caps">CSS</span>, chamada neste exemplo de <tt>/uploads/social-icons-s25bc94da3e.png</tt>. Agora, cada uma das classes de rede social que criamos tem um reposicionamento da mesma imagem, como: <tt>background-position: 0 -64px;</tt>.</p>
<p>Isto resolve o ponto 2 da introdução do artigo, que estava pendente: gerenciamento de sprites. Dependendo da quantidade de pequenas imagens que uma única página do seu site tem, somente este truque pode causar um impacto positivo que seus usuários irão notar rapidamente por causa do aumento na velocidade de renderização.</p>
<p>Para complementar, sempre que usarmos chamadas como <tt>background: url(/uploads/social-icons-s25bc94da3e.png)</tt> no <span class="caps">CSS</span>, nunca devemos digitar a <span class="caps">URL</span> absoluta manualmente. Devemos deixar o Asset Pipeline cuidar disso, como ele fez aqui no caso dos sprites.</p>
<p>Vejamos um exemplo mais concreto. Vamos adicionar o seguinte ao nosso <tt>application.css.scss</tt>:</p>
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
      <td class="code"><pre><span style="color:#339;font-weight:bold">h1</span> {
  <span style="color:#606">padding-left</span>: <span style="color:#60E">60px</span>;
  <span style="color:#606">height</span>: <span style="color:#60E">70px</span>;
  <span style="color:#606">background</span>: <span style="color:#06B;font-weight:bold"><span style="color:black">url(</span><span>"/uploads/rails.png"</span><span style="color:black">)</span></span> <span style="color:#088">no-repeat</span>;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que confunde é que isso de fato funciona. Porém, caímos nos problema mencionados no início do artigo: sem o número timestamp, se atualizarmos a imagem, os usuários ficarão travados na versão antiga em cache local. Se quisermos migrar para <span class="caps">CDN</span> vamos ter problemas de mudar todas essas URLs manualmente, etc. Portanto, no caso de <span class="caps">SASS</span> o correto é usar a função <tt>image-url</tt> e fazer desta forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>  <span style="color:#339;font-weight:bold">background</span>: <span style="color:#F00;background-color:#FAA">i</span><span style="color:#F00;background-color:#FAA">m</span><span style="color:#F00;background-color:#FAA">a</span><span style="color:#F00;background-color:#FAA">g</span><span style="color:#F00;background-color:#FAA">e</span><span style="color:#F00;background-color:#FAA">-</span><span style="color:#06B;font-weight:bold"><span style="color:black">url(</span><span>"rails.png"</span><span style="color:black">)</span></span> <span style="color:#339;font-weight:bold">no-repeat</span>;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isto irá gerar a <span class="caps">URL</span> correta. Temos as seguinte variações:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>image-url("rails.png")         # url(/uploads/rails.png)
image-path("rails.png")        # "/uploads/rails.png".
asset-url("rails.png", image)  # url(/uploads/rails.png)
asset-path("rails.png", image) # "/uploads/rails.png"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, se for necessário URLs de assets dentro do Javascript, não há equivalente no <tt>application.js</tt> puro, por isso precisaríamos renomeá-lo para <tt>application.js.erb</tt> e então a mesma regra que usaríamos em views <span class="caps">HTML</span> <span class="caps">ERB</span> normais valem:</p>
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
      <td class="code"><pre>var imagem     = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;%= image_path(</span><span style="color:#710">"</span></span>rails.png<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">) %&gt;</span><span style="color:#710">"</span></span>;
var tag_imagem = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;%= image_tag(</span><span style="color:#710">"</span></span>rails.png<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">) %&gt;</span><span style="color:#710">"</span></span>;
var audio      = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;%= audio_path(</span><span style="color:#710">"</span></span>rails.mp3<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">) %&gt;</span><span style="color:#710">"</span></span>;
var tag_audio  = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;%= image_tag(</span><span style="color:#710">"</span></span>rails.mp3<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">) %&gt;</span><span style="color:#710">"</span></span>;
var video      = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;%= video_path(</span><span style="color:#710">"</span></span>rails.m4v<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">) %&gt;</span><span style="color:#710">"</span></span>;
var tag_video  = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;%= image_tag(</span><span style="color:#710">"</span></span>rails.m4v<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">) %&gt;</span><span style="color:#710">"</span></span>;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vejam a documentação do <a href="https://api.rubyonrails.org/classes/ActionView/Helpers/AssetTagHelper.html">ActionView::Helpers::AssetTagHelper</a> para entender melhor sobre estes helpers, mas o importante é: se estiver escrevendo a <span class="caps">URL</span> de um asset manualmente, como um string, você está fazendo errado.</p>
<h2><span class="caps">NGINX</span></h2>
<p>Não vou entrar em detalhes sobre como configurar um <span class="caps">NGINX</span> completo, mas fica um lembrete para não esquecer de adicionar à configuração do servidor o seguinte trecho:</p>
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
      <td class="code"><pre>location ~ ^/uploads/ {
  expires 1y;
  add_header Cache-Control public;
  add_header Last-Modified "";
  add_header ETag "";
  break;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso garantirá que o browser do usuário guarde todos os assets no seu cache local para não pedir novamente. Com o Asset Pipeline, como explicamos exaustivamente acima, assets atualizados são imunes ao cache local.</p>
<p>E para diminuir ainda mais a quantidade de bits transportado entre o servidor e o browser dos usuários, lembre de checar se o suporte a gzip está ativado:</p>
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
      <td class="code"><pre>##
# Gzip Settings
##
gzip on;
gzip_disable "msie6";
# gzip_vary on;
# gzip_proxied any;
# gzip_comp_level 6;
# gzip_buffers 16 8k;
# gzip_http_version 1.1;
# gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Conclusão</h2>
<p>Como podem ver, o Asset Pipeline é bastante simples para a grande maioria dos casos de uso. As regras são diferentes mas simples:</p>
<ul>
  <li>Assets devem ir todas em <tt>app/uploads</tt></li>
  <li>Em desenvolvimento <tt>public/uploads</tt> deve ficar vazio. Em produção, sempre execute <tt>rake assets:precompile</tt></li>
  <li>Não digite <span class="caps">URL</span> de assets manualmente, use os helpers de <span class="caps">URL</span></li>
</ul>
<p>Isso lhe dará, “de graça”:</p>
<ul>
  <li>concatenação de arquivos de assets, minificação de javascript e stylesheets</li>
  <li>compatibilidade com caches, CDNs e suporte a gzip</li>
  <li>gerenciamento de sprites numa única imagem com posicionamento via <span class="caps">CSS</span></li>
  <li>suporte a diferentes geradores de templates, como <span class="caps">SASS</span></li>
</ul>
<p>Expanda seus conhecimentos, aprenda mais sobre:</p>
<ul>
  <li><a href="https://thoughtbot.com/bourbon/">Bourbon</a></li>
  <li><a href="https://compass-style.org/reference/compass/">Compass</a></li>
  <li><a href="https://guides.rubyonrails.org/asset_pipeline.html">Rails Guides</a></li>
  <li><a href="https://coderberry.me/blog/2012/04/24/asset-pipeline-for-dummies/">Asset Pipeline for Dummies</a></li>
</ul>
<p>Esqueçam rumores, opiniões contrárias, rants e trolls. O Asset Pipeline certamente não é simples. Porém está longe do bicho de sete cabeças que costumam descrever. No início haviam muitos bugs, que já foram corrigidos e, toda vez que alguém falar em “Asset Poopline”, normalmente é problema de de <a href="https://bios.6te.net/"><span class="caps">BIOS</span></a> mais do que de ferramenta. Google e Stackoverflow, for the help.</p>
<p></p>
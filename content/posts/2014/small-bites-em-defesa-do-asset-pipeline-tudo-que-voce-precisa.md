---
title: "[Small-Bites] Em defesa do Asset Pipeline: tudo que você precisa"
date: "2014-12-02T19:26:00.000Z"
tags: ["rails", "javascript", "front-end"]
years: "2014"
---

<p></p>
<p>No atual caos que são as opções no mundo Javascript para gerenciamento de dependências (CommonJS, AMD, ES6-modules), sistemas de build (Grunt, Gulp, Broccoli), pacotes (NPM, Bower) é fácil sermos contaminados com o velho "F.U.D." (Fear, Uncertainty, Doubt).</p>
<p>Asset Management é um problema praticamente todo resolvido no mundo Rails desde Fevereiro de 2009 (nós basicamente criamos o conceito). Mesmo assim, ainda temos que ouvir afirmações sem sentido como "precisamos consertar ou substituir o Asset Pipeline" e então nascem coisas como "requirejs-rails" ou receitas de como desabilitar o Sprockets e usar outras coisas. Em resumo: não faça isso.</p>
<p>Até eu fico sem paciência para participar dessas discussões porque, no final do dia, o que precisamos é da solução mais simples que funciona e podemos confiar. E sem mais delongas eu elejo a combinação ModuleJS e Rails-Assets como as melhores opções.</p>
<p>Antes de continuar vou assumir que você pelo menos leu (ou já conhece) os seguintes assuntos:</p>
<ul>
  <li><a href="http://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">Asset Pipeline para Iniciantes</a></li>
  <li><a href="http://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes-parte-2">Asset Pipeline para Iniciantes - Parte 2</a></li>
  <li><a href="http://www.akitaonrails.com/2013/12/13/rails-assets">Rails Assets</a></li>
</ul>
<p></p>
<p></p>
<p>Para ilustrar a solução vamos direto a um pequeno exemplo. Se for algo pequeno, podemos ficar tentados a colocar tudo no <tt>app/assets/application.js</tt>, como por exemplo:</p>
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
</pre>
      </td>
      <td class="code"><pre>Foo = {
  <span style="color:#06B;font-weight:bold">hello</span>: <span style="color:#080;font-weight:bold">function</span>() {
    <span style="color:#080;font-weight:bold">return</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello</span><span style="color:#710">"</span></span>;
  },
  <span style="color:#06B;font-weight:bold">world</span>: <span style="color:#080;font-weight:bold">function</span>() {
    <span style="color:#080;font-weight:bold">return</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">World</span><span style="color:#710">"</span></span>;
  }
}
Bar = {
  <span style="color:#06B;font-weight:bold">helloWorld</span>: <span style="color:#080;font-weight:bold">function</span>() {
    <span style="color:#080;font-weight:bold">return</span> Foo.hello() + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span> + Foo.world();
  }
}
<span style="color:#369;font-weight:bold">$</span>(<span style="color:#080;font-weight:bold">function</span>() {
  <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">body</span><span style="color:#710">'</span></span>).append(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">&lt;p&gt;</span><span style="color:#710">'</span></span> + Bar.helloWorld() + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">&lt;/p&gt;</span><span style="color:#710">'</span></span>);
})
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vai simplesmente adicionar um parágrafo escrito "Hello World" na página. A idéia é um exemplo bem trivial para que a técnica fique clara, mas obviamente imagine isso em algo mais complicado.</p>
<p>A primeira coisa que gostaríamos de fazer é separar esse código. Talvez quebrar em arquivos como <tt>app/assets/javascripts/foo.js</tt> e <tt>app/assets/javascripts/bar.js</tt>. Então vamos direto ao assunto e adicionar o <a href="https://larsjung.de/modulejs/">ModuleJS</a> diretamenta à nossa <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># Gemfile</span>
source <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">https://rails-assets.org</span><span style="color:#710">'</span></span>
<span style="color:#777"># ...</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails-assets-modulejs</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Depois de instalar com o bom e velho <tt>bundle install</tt>. Modificamos o <tt>app/assets/javascripts/application.js</tt> para carregar a dependência:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777">//= require jquery</span>
<span style="color:#777">//= require jquery_ujs</span>
<span style="color:#777">//= require modulejs</span>
<span style="color:#777">//= require_tree .</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso foi o que eu já expliquei no meu post mais antigo sobre <a href="https://www.akitaonrails.com/2013/12/13/rails-assets">Rails Assets</a>. Se a biblioteca que você quer tem um pacote Bower, ele pode ser automaticamente encapsulado numa gem de Rails Engine como uma gem feita manualmente. E se não tiver como pacote Bower aí não tem jeito: baixe os arquivos e jogue num diretório em <tt>vendor/assets</tt> para mantê-la estática dentro do projeto, mas o ideal é que você <strong>não</strong> deixe bibliotecas javascript vendorizados.</p>
<p>Para começar a refatoração do javascript acima, vamos começar quebrando os objetos 'Foo' e 'Bar' em dois arquivos:</p>
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
      <td class="code"><pre><span style="color:#777">// app/assets/javascripts/foo.js</span>
modulejs.define( <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">foo</span><span style="color:#710">'</span></span>, <span style="color:#080;font-weight:bold">function</span>() {
  <span style="color:#080;font-weight:bold">return</span> {
    <span style="color:#06B;font-weight:bold">hello</span>: <span style="color:#080;font-weight:bold">function</span>() {
      <span style="color:#080;font-weight:bold">return</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello</span><span style="color:#710">"</span></span>;
    },
    <span style="color:#06B;font-weight:bold">world</span>: <span style="color:#080;font-weight:bold">function</span>() {
      <span style="color:#080;font-weight:bold">return</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">World</span><span style="color:#710">"</span></span>;
    }
  }
})
</pre>
      </td>
    </tr>
  </tbody>
</table>
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
      <td class="code"><pre><span style="color:#777">// app/assets/javascripts/bar.js</span>
modulejs.define( <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">bar</span><span style="color:#710">'</span></span>, [ <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">foo</span><span style="color:#710">'</span></span> ], <span style="color:#080;font-weight:bold">function</span>(Foo) {
  <span style="color:#080;font-weight:bold">return</span> {
    <span style="color:#06B;font-weight:bold">helloWorld</span>: <span style="color:#080;font-weight:bold">function</span>() {
      <span style="color:#080;font-weight:bold">return</span> Foo.hello() + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span> + Foo.world();
    }
  }
})
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja que não precisamos mais das constantes 'Foo' e 'Bar', apenas devolver o corpo do hash com as funções. No módulo 'bar', declaramos que precisamos do módulo 'foo' (em um array) e passamos como parâmetro do construtor com o nome antigo da constante 'Foo', daí internamente o código se mantém exatamente o mesmo. E já que estamos modularizando, vamos adicionar um módulo que encapsula a chamada principal:</p>
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
      <td class="code"><pre><span style="color:#777">// app/assets/javascripts/main.js</span>
modulejs.define( <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">main</span><span style="color:#710">'</span></span>, [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">bar</span><span style="color:#710">'</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">jquery</span><span style="color:#710">'</span></span>], <span style="color:#080;font-weight:bold">function</span>(Bar, <span style="color:#369;font-weight:bold">$</span>) {
  <span style="color:#080;font-weight:bold">return</span> {
    <span style="color:#06B;font-weight:bold">start</span>: <span style="color:#080;font-weight:bold">function</span>() {
      <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">body</span><span style="color:#710">'</span></span>).append(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">&lt;p&gt;</span><span style="color:#710">'</span></span> + Bar.helloWorld() + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">&lt;/p&gt;</span><span style="color:#710">'</span></span>);
    }
  }
})
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como pode ver acima, o módulo 'main' vai depender do 'bar' (definido em 'bar.js') e também de um 'jquery' que ainda não existe, então vamos criar um genérico <tt>modules.js</tt> para encapsular o jQuery assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777">// app/assets/javascripts/modules.js</span>
modulejs.define( <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">jquery</span><span style="color:#710">'</span></span>, <span style="color:#080;font-weight:bold">function</span>() {
  <span style="color:#080;font-weight:bold">return</span> jQuery;
});
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja que podemos fazer a mesma coisa para qualquer outra biblioteca. Damos um nome em string, no caso 'jquery', que o ModuleJS vai conseguir encontrar depois e retornamos a classe principal, só isso.</p>
<p>Para finalizar no arquivo original <tt>application.js</tt> chamamos esse novo 'main' assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#369;font-weight:bold">$</span>(<span style="color:#080;font-weight:bold">function</span>() {
  <span style="color:#080;font-weight:bold">var</span> app = modulejs.require(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">main</span><span style="color:#710">'</span></span>);
  app.start();
})
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pronto! Tudo isolado e com as dependências todas controladas. A grande vantagem de fazer desta forma é que no cabeçalho do <tt>application.js</tt> podemos continuar declarando as dependências com o <tt>require_tree .</tt> pois não importa a ordem dos arquivos, apenas a chamada principal do módulo 'main'.</p>
<p>Pronto, não precisamos de RequireJS, podemos continuar usando o Asset Pipeline que vai gerar os arquivos minificados como o Rails sempre fez e com o mínimo de dependências que podem causar conflitos difíceis de rastrear depois. Vá adicionando seus pacotes preferidos de Bower diretamente na <tt>Gemfile</tt> e continue usando apenas um sistema de gerenciamento de dependência que sabemos que funciona: Bundler.</p>
<p></p>
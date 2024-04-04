---
title: "Micro-Tutorial de Ruby - Parte III"
date: "2008-11-10T03:43:00.000Z"
tags: ["beginner", "ruby", "tutorial"]
years: "2008"
---

<p></p>
<p>Vamos continuar de onde paramos. Leia a <a href="/2008/11/10/micro-tutorial-de-ruby-parte-i">Parte I</a> e <a href="/2008/11/10/micro-tutorial-de-ruby-parte-ii">Parte II</a> antes de continuar. E algumas dicas finais:</p>
<p>Eu tenho alguns tutoriais e screencasts disponíveis na seção <a href="/tutorials">Tutorials</a> aqui neste blog mesmo. Muitos me perguntam sobre livros, existem dezenas (procure na <a href="http://rubyurl.com/XgLe">Amazon</a>) mas lembrem-se do seguinte: nenhum livro, em inglês ou português, jamais será capaz de ter tudo atualizado. Projetos open source estão em constante evolução. O Rails 2.1 saiu faz poucos meses e o 2.2 já está para sair daqui poucos dias. É impossível nesse meio tempo ter todos os livros atualizados, muito menos traduzidos. De preferência, use os dois: livros e material online. Isso dito, se você puder comprar apenas 1 livro de Ruby e 1 de Rails escolha <a href="http://rubyurl.com/IXfs">The Ruby Way</a> e <a href="http://rubyurl.com/t8jb">The Rails Way</a>.</p>
<p>O principal: participe. Existe uma comunidade Brasileira em constante expansão. Procure por nós no <a href="http://groups.google.com.br/group/rails-br/">Google Groups</a>. Pesquise antes de perguntar, como disse acima, existem centenas de boas fontes de informação.</p>
<p></p>
<p></p>
<h2>Tipos Básicos</h2>
<p>Continuando com os tipos básicos de Ruby (no artigo anterior já falamos de Arrays e Hashes):</p>
<h3>Strings</h3>
<p>Novamente, nada de muito surpreendente aqui:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; palavra = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla bla</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla bla</span><span style="color:#710">"</span></span>
&gt;&gt; palavra.size
=&gt; <span style="color:#00D">7</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A operação mais comum em string é a concatenação:</p>
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
      <td class="code"><pre>&gt;&gt; nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
&gt;&gt; sobrenome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
&gt;&gt; nome + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span> + sobrenome
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio Akita</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Porém, já vimos em seções anteriores outra maneira de fazer a mesma concatenação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>sobrenome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio Akita</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Tudo que estiver dentro de “#{}” é executado e o resultado convertido em String e concatenado junto com o resto. Isso deve evitar aquele monte de “+” o tempo todo quando queremos concatenar as coisas. Um dos lugares onde mais usamos concatenação é quando queremos strings com quebras de linha. O jeito comum é fazer assim:</p>
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
      <td class="code"><pre>&gt;&gt; nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
&gt;&gt; query = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SELECT * FROM NOMES </span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span> +
<span style="color:#00D">?&gt;</span>     <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">WHERE NOME LIKE '%</span><span style="color:#710">"</span></span> + nome + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">%' </span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span> +
<span style="color:#00D">?&gt;</span>     <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">ORDER BY NOME</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SELECT * FROM NOMES </span><span style="color:#b0b">\n</span><span style="color:#D20">WHERE NOME LIKE '%F%' </span><span style="color:#b0b">\n</span><span style="color:#D20">ORDER BY NOME</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou algo parecido com isso, o que é bem feio e sabemos o quanto isso se torna impossível de dar manutenção no futuro. Mas em Ruby podemos fazer um pouco melhor que isso:</p>
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
      <td class="code"><pre>&gt;&gt; nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
&gt;&gt; query = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">&lt;&lt;-STR</span></span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">
  SELECT * FROM NOMES
  WHERE NOME LIKE '%</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">%'
  ORDER BY NOME</span><span style="color:#710">
STR</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">  SELECT * FROM NOMES</span><span style="color:#b0b">\n</span><span style="color:#D20">  WHERE NOME LIKE '%F%'</span><span style="color:#b0b">\n</span><span style="color:#D20">  ORDER BY NOME</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Onde está “<span class="caps">STR</span>” na realidade pode ser qualquer palavra em letras maiúsculas, tomando o cuidado para não ter espaços em branco nem antes nem depois do “<span class="caps">STR</span>” da última linha. Aproveitando os comentários do Tapajós e do Hugo, existem mais algumas maneiras e fazer isso:</p>
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
      <td class="code"><pre>&gt;&gt; nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
&gt;&gt; query = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%{</span><span style="color:#D20">SELECT * FROM NOMES
  WHERE NOME LIKE '%</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">%'
  ORDER BY NOME</span><span style="color:#710">}</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SELECT * FROM NOMES</span><span style="color:#b0b">\n</span><span style="color:#D20">  WHERE NOME LIKE '%F%'</span><span style="color:#b0b">\n</span><span style="color:#D20">  ORDER BY NOME</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E também desta maneira:</p>
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
      <td class="code"><pre>&gt;&gt; nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
&gt;&gt; query = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%Q(</span><span style="color:#D20">SELECT * FROM NOMES
  WHERE NOME LIKE '%</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>nome<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">%'
  ORDER BY NOME</span><span style="color:#710">)</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SELECT * FROM NOMES</span><span style="color:#b0b">\n</span><span style="color:#D20">  WHERE NOME LIKE '%F%'</span><span style="color:#b0b">\n</span><span style="color:#D20">  ORDER BY NOME</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Todas as maneiras acima são jeitos de se criar strings de múltiplas linhas com a possibilidade de execução e substituição in-place usando “#{}”. Eu particularmente prefiro fazer alguma coisa do tipo:</p>
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
      <td class="code"><pre>&gt;&gt; nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">F</span><span style="color:#710">"</span></span>
&gt;&gt; query = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">%q(</span><span style="color:#D20">SELECT * FROM NOMES
  WHERE NOME LIKE '%[nome]%'
  ORDER BY NOME</span><span style="color:#710">)</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SELECT * FROM NOMES</span><span style="color:#b0b">\n</span><span style="color:#D20">  WHERE NOME LIKE '%[nome]%'</span><span style="color:#b0b">\n</span><span style="color:#D20">  ORDER BY NOME</span><span style="color:#710">"</span></span>
&gt;&gt; query.gsub!(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">[nome]</span><span style="color:#710">'</span></span>, nome)
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SELECT * FROM NOMES</span><span style="color:#b0b">\n</span><span style="color:#D20">  WHERE NOME LIKE '%F%'</span><span style="color:#b0b">\n</span><span style="color:#D20">  ORDER BY NOME</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A sintaxe de “%q()” também permite criar strings de múltiplas linhas mas não suporta a execução de código via “#{}”, por isso coloquei algo que possa encontrar depois (um “placeholder”) como “[nome]” e no final uso o método “gsub” que faz substituição em Strings. Eu disse que “prefiro” mais para separar explicitamente as substituições fora do String. Mas, novamente, existem diversas maneiras de realizar essa mesma tarefa, depende do que você precisa fazer.</p>
<p><strong>Disclaimer:</strong> nunca crie consultas <span class="caps">SQL</span> da forma como mostrei acima. Se você apenas concatenar o valor que foi passado pelo usuário diretamente no comando <span class="caps">SQL</span> que vai executar, seu código estará automaticamente vulnerável à <a href="https://en.wikipedia.org/wiki/SQL_injection"><span class="caps">SQL</span> Injection</a>. Esse é o erro mais comum que todo desenvolvedor Web novato comete. Então cuidado! Para isso servem pacotes como ActiveRecord, que abstraem o <span class="caps">SQL</span> nativo e realizam as checagens mais comuns antes de criar o <span class="caps">SQL</span>.</p>
<h3>Symbols</h3>
<p>Note que na seção sobre Hashes, criamos um pequeno dicionário ligando uma palavra em inglês à sua tradução em português. Para isso usamos objetos String tanto para os valores quanto para as chaves, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>dic1 = { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">perna</span><span style="color:#710">"</span></span> }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Mas você vai notar que em Ruby e principalmente no Rails, não costumamos usar Strings como chaves. Em vez disso usamos Symbols:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>dic2 = { <span style="color:#A60">:leg</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">perna</span><span style="color:#710">"</span></span> }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quero dizer, não é proibido usar Strings, mas se não precisar, prefira usar Symbols. Existem dois motivos para isso: o primeiro é porque symbols são mais legíveis e fáceis de visualizar, a segunda é economia de memória.</p>
<p>Em poucas palavras, um Symbol sempre gera um objeto Singleton imutável. Por exemplo:</p>
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
      <td class="code"><pre>&gt;&gt; a = <span style="color:#A60">:leg</span>
=&gt; <span style="color:#A60">:leg</span>
&gt;&gt; b = <span style="color:#A60">:leg</span>
=&gt; <span style="color:#A60">:leg</span>
&gt;&gt; a.object_id
=&gt; <span style="color:#00D">531778</span>
&gt;&gt; b.object_id
=&gt; <span style="color:#00D">531778</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note como atribuímos :leg às variáveis “a” e “b”. Chamando o método “object_id”, ambas respondem o mesmo ID, denotando que as duas variáveis estão apontando ao mesmo objeto Symbol. Vejamos o mesmo exemplo usando Strings:</p>
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
      <td class="code"><pre>&gt;&gt; a = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span>
&gt;&gt; b = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">leg</span><span style="color:#710">"</span></span>
&gt;&gt; a.object_id
=&gt; <span style="color:#00D">11823830</span>
&gt;&gt; b.object_id
=&gt; <span style="color:#00D">11820130</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note como os dois IDs vieram diferentes. Ou seja, apesar do conteúdo ser o mesmo, as variáveis “a” e “b” estão apontando para objetos String diferentes. A primeira impressão é que são o mesmo objeto, mas na realidade são dois objetos distintos que por acaso tem o mesmo conteúdo. Espero que tenha ficado claro porque Symbols consomem menos memória que Strings.</p>
<p>Existem vários outros objetos singleton em Ruby. Números é um deles, afinal não faz sentido existir mais de um número “1”. O mesmo vale para objetos booleanos. Por exemplo:</p>
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
      <td class="code"><pre>&gt;&gt; a = <span style="color:#00D">1</span>
=&gt; <span style="color:#00D">1</span>
&gt;&gt; b = <span style="color:#00D">1</span>
=&gt; <span style="color:#00D">1</span>
&gt;&gt; c = <span style="color:#069">true</span>
=&gt; <span style="color:#069">true</span>
&gt;&gt; d = <span style="color:#069">true</span>
=&gt; <span style="color:#069">true</span>
&gt;&gt; a.object_id == b.object_id
=&gt; <span style="color:#069">true</span>
&gt;&gt; c.object_id == d.object_id
=&gt; <span style="color:#069">true</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Na prática, sempre use Symbols como chaves de Hash. É onde eles são mais usados. Em Ruby on Rails, o pacote ActiveSupport consegue traduzir Hashes com chaves em String para Symbols, desta forma:</p>
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
      <td class="code"><pre>&gt;&gt; require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rubygems</span><span style="color:#710">'</span></span>
=&gt; []
&gt;&gt; require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activesupport</span><span style="color:#710">'</span></span>
=&gt; []
&gt;&gt; params = { <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nome</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sobrenome</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span> }
=&gt; {<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nome</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sobrenome</span><span style="color:#710">"</span></span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>}
&gt;&gt; params.symbolize_keys!
=&gt; {<span style="color:#A60">:nome</span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="color:#A60">:sobrenome</span>=&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>}
&gt;&gt; params[<span style="color:#A60">:nome</span>]
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
&gt;&gt; params[<span style="color:#A60">:sobrenome</span>]
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Métodos em Ruby</h2>
<p>Depois de tudo isso, podemos ir um pouco além. Em Ruby temos maneiras muito diferentes de se escrever métodos. Em linguagens estáticas, como Java, temos o conceito de <a href="https://en.wikipedia.org/wiki/Method_overloading">overloading</a>. Por exemplo:</p>
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
      <td class="code"><pre><span style="color:#088;font-weight:bold">public</span> <span style="color:#339;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span> {
  <span style="color:#0a5;font-weight:bold">String</span> nome;
  <span style="color:#0a5;font-weight:bold">String</span> email;
  <span style="color:#088;font-weight:bold">public</span> Pessoa(<span style="color:#0a5;font-weight:bold">String</span> nome, <span style="color:#0a5;font-weight:bold">String</span> email) {
    <span style="color:#963">this</span>.nome = nome;
    <span style="color:#963">this</span>.email = email;
  }
  <span style="color:#088;font-weight:bold">public</span> Pessoa(<span style="color:#0a5;font-weight:bold">String</span> nome) {
        <span style="color:#963">this</span>(nome, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>);
  }
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse trecho define a classe “Pessoa” com dois construtores. Dessa forma podemos instanciar uma nova Pessoa da seguinte forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>Pessoa fabio = <span style="color:#080;font-weight:bold">new</span> Pessoa(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabio@foo.com.br</span><span style="color:#710">"</span></span>);
Pessoa akita = <span style="color:#080;font-weight:bold">new</span> Pessoa(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>);
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, o parâmetro “email” é opcional. Dependendo se passamos ou não esse parâmetro, um dos dois construtores será chamado.</p>
<p>Porém, esse tipo de construção pode começar a ficar extremamente tedioso quando temos muitos parâmetros opcionais. Em Ruby temos algumas maneiras diferentes de lidar com isso. Para começar vejamos uma maneira simples:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(nome, email = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>)
    <span style="color:#33B">@nome</span>, <span style="color:#33B">@email</span> = nome, email
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Duas novidades: primeiro que um método suporta valores padrão. Dessa forma, se nada for passado no segundo parâmetro, ele assume o padrão vazio "", conforme descrevemos acima. Segundo, é possível fazer atribuição em massa. Acredito que esteja bastante óbvio entender apenas lendo o trecho acima.</p>
<p>Outra maneira:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(nome, *args)
    <span style="color:#33B">@nome</span> = nome
    <span style="color:#33B">@args</span> = args
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">args</span>
    <span style="color:#33B">@args</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabio@foo.com.br</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">6666-6666</span><span style="color:#710">"</span></span>)
=&gt; <span style="color:#777">#&lt;Pessoa:0x26ee61c @args=["fabio@foo.com.br", "6666-6666"], @nome="Fabio"&gt;</span>
&gt;&gt; fabio.args.first
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">fabio@foo.com.br</span><span style="color:#710">"</span></span>
&gt;&gt; fabio.args.last
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">6666-6666</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O que temos no contrutor acima, o “*”, é o “splat”. Pense nele como um buraco-negro: depois do parâmetro normal “nome”, tudo que vier depois será literalmente sugado para dentro da variável “args”. A resultante disso será um Array. Isso permite um método que tenha capacidade para infinitos argumentos. Outro exemplo de uso é este:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">soma</span>(*args)
  args.inject(<span style="color:#00D">0</span>) { |elem, total| total += elem }
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; soma(<span style="color:#00D">2</span>,<span style="color:#00D">2</span>)
=&gt; <span style="color:#00D">4</span>
&gt;&gt; soma(<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>)
=&gt; <span style="color:#00D">10</span>
&gt;&gt; soma(<span style="color:#00D">100</span>,<span style="color:#00D">200</span>,<span style="color:#00D">300</span>)
=&gt; <span style="color:#00D">600</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Felizmente já explicamos para que serve o “inject”. Resumindo: esse método somará todos os elementos passados como parâmetros, independente de quantos forem. E ainda podemos fazer mais: passar um array expandindo seus elementos para serem parâmetros:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; items = [<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>,<span style="color:#00D">4</span>,<span style="color:#00D">5</span>,<span style="color:#00D">6</span>]
=&gt; [<span style="color:#00D">1</span>, <span style="color:#00D">2</span>, <span style="color:#00D">3</span>, <span style="color:#00D">4</span>, <span style="color:#00D">5</span>, <span style="color:#00D">6</span>]
&gt;&gt; soma *items
=&gt; <span style="color:#00D">21</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se passássemos o array “items” sem o splat para expandí-lo, o array inteiro seria considerado um único elemento do array “args” dentro do método, não dando o efeito esperado, veja:</p>
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
      <td class="code"><pre>&gt;&gt; soma items
<span style="color:#036;font-weight:bold">TypeError</span>: can<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">t convert Fixnum into Array
        from (irb):31:in `+</span><span style="color:#710">'</span></span>
        from (irb):<span style="color:#00D">31</span><span style="color:#A60">:in</span> <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">soma'
        from (irb):40:in </span><span style="color:#161">`</span></span>inject<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">
        from (irb):31:in `each</span><span style="color:#710">'</span></span>
        from (irb):<span style="color:#00D">31</span><span style="color:#A60">:in</span> <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">inject'
        from (irb):31:in </span><span style="color:#161">`</span></span>soma<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">
        from (irb):40
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Outra situação é quando temos métodos com um número muito grande de parâmetros opcionais. No Ruby on Rails temos exemplos como este:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="color:#036;font-weight:bold">Person</span>.find <span style="color:#A60">:first</span>, <span style="color:#A60">:conditions</span> =&gt; { <span style="color:#A60">:nome</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span> }, <span style="color:#A60">:order</span> =&gt; <span style="color:#A60">:nome</span>
=&gt; <span style="color:#036;font-weight:bold">SELECT</span> * <span style="color:#036;font-weight:bold">FROM</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">people</span><span style="color:#710">"</span></span> <span style="color:#036;font-weight:bold">WHERE</span> (<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">people</span><span style="color:#710">"</span></span>.<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">nome</span><span style="color:#710">"</span></span> = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Fabio</span><span style="color:#710">'</span></span>) <span style="color:#036;font-weight:bold">ORDER</span> <span style="color:#036;font-weight:bold">BY</span> nome <span style="color:#036;font-weight:bold">LIMIT</span> <span style="color:#00D">1</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Qualquer um que já tenha lidado com <span class="caps">SQL</span> sabe que montar consultas pode ser bastante complexo. Criar um único método que cuide disso numa linguagem estático é impossível. Se tentar criar um conjunto de métodos via overloading como vimos antes, também será um trabalho homérico e totalmente fútil.</p>
<p>Vejamos como é definido o método “find” da classe “ActiveRecord::Base”</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">find</span>(*args)
  options = args.extract_options!
  validate_find_options(options)
  set_readonly_option!(options)
  <span style="color:#080;font-weight:bold">case</span> args.first
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:first</span> <span style="color:#080;font-weight:bold">then</span> find_initial(options)
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:last</span>  <span style="color:#080;font-weight:bold">then</span> find_last(options)
    <span style="color:#080;font-weight:bold">when</span> <span style="color:#A60">:all</span>   <span style="color:#080;font-weight:bold">then</span> find_every(options)
    <span style="color:#080;font-weight:bold">else</span>             find_from_ids(args, options)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método “find” por si só é somente um envelope que chama outros métodos. Ele recebe nada mais, nada menos que um Array, usando o splat como mostramos antes. Logo na primeira linha ele usa um método interno do Rails para extrair tudo que é considerado “options”, no caso, elementos de um Hash.</p>
<p>Dependendo do primeiro argumento, ele repassa o Hash a métodos como “find_initial”, “find_last”, etc. No caso, o Hash em questão é o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>options = { <span style="color:#A60">:conditions</span> =&gt; { <span style="color:#A60">:nome</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span> }, <span style="color:#A60">:order</span> =&gt; <span style="color:#A60">:nome</span> }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vejamos um exemplo mais simples de um método com um parâmetro obrigatório e uma lista de parâmetros opcionais:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  attr_accessor <span style="color:#A60">:primeiro_nome</span>, <span style="color:#A60">:sobrenome</span>, <span style="color:#A60">:iniciais</span>, <span style="color:#A60">:email</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(primeiro_nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>, options = {})
    <span style="color:#33B">@primeiro_nome</span> = primeiro_nome
    <span style="color:#33B">@sobrenome</span> = options[<span style="color:#A60">:sobrenome</span>]
    <span style="color:#33B">@iniciais</span> = options[<span style="color:#A60">:iniciais</span>]
    <span style="color:#33B">@email</span> = options[<span style="color:#A60">:email</span>]
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="color:#A60">:sobrenome</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>, <span style="color:#A60">:iniciais</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">FMA</span><span style="color:#710">"</span></span>)
=&gt; <span style="color:#777">#&lt;Pessoa:0x26b2c98 @iniciais="FMA", @sobrenome="Akita", @email=nil, @primeiro_nome="Fabio"&gt;</span>
&gt;&gt; fabio.primeiro_nome
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
&gt;&gt; fabio.sobrenome
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>
&gt;&gt; fabio.iniciais
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">FMA</span><span style="color:#710">"</span></span>
&gt;&gt; fabio.email
=&gt; <span style="color:#069">nil</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Caso não saiba, o método “attr_accessor” serve para criar métodos equivalentes a “getters” e “setters” de Java ou C#. Como já falamos em seções anteriores, classes Ruby podem ser modificadas em tempo de execução. Veremos isso depois, por enquanto vejamos o construtor novamente. Depois do primeiro parâmetro, temos o familiar uso do par chave e valor. O que pode parece estranho é que talvez alguém estivesse esperando algo assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, {<span style="color:#A60">:sobrenome</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>, <span style="color:#A60">:iniciais</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">FMA</span><span style="color:#710">"</span></span>})
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, as chaves “{}” são opcionais: os últimos parâmetros, sendo pares com a sintaxe de “rocket” (“=&gt;”) são tratados como elementos do mesmo Hash e todos são “sugados” para o parâmetro “options” no método construtor. Retirando tudo que é opcional, a chamada poderia ficar simplesmente assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>, <span style="color:#A60">:sobrenome</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Akita</span><span style="color:#710">"</span></span>, <span style="color:#A60">:iniciais</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">FMA</span><span style="color:#710">"</span></span> 
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E assim temos algumas maneiras para criar métodos bastante flexíveis. Obviamente, aqui cabe cuidados sobre como planejar seus métodos. Fica muito fácil criar métodos que fazem mais do que deveriam dessa forma. Assim como mostramos acima com o método “find” tente criar métodos enxutos, que delegam a execução a outros métodos mais especializados, por exemplo.</p>
<h2>Métodos Dinâmicos</h2>
<p>Vejamos mais sobre o método “attr_accessor”:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  attr_accessor <span style="color:#A60">:nome</span>, <span style="color:#A60">:email</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new
=&gt; <span style="color:#777">#&lt;Pessoa:0x26a6f24 @iniciais=nil, @sobrenome=nil, @email=nil, @primeiro_nome=""&gt;</span>
&gt;&gt; fabio.nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
&gt;&gt; fabio.nome
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Podemos reimplementar nossa própria versão simplificada de “attr_accessor” desta maneira:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Object</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">my_accessor</span>( *symbols )
    symbols.each <span style="color:#080;font-weight:bold">do</span> |symbol|
      module_eval( <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">def </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>symbol<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">() @</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>symbol<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">; end</span><span style="color:#710">"</span></span> )
      module_eval( <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">def </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>symbol<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">=(val) @</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>symbol<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20"> = val; end</span><span style="color:#710">"</span></span> )
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  my_accessor <span style="color:#A60">:telefone</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new
=&gt; <span style="color:#777">#&lt;Pessoa:0x2690f30 @iniciais=nil, @sobrenome=nil, @email=nil, @primeiro_nome=""&gt;</span>
&gt;&gt; fabio.telefone = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">6666-6666</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">6666-6666</span><span style="color:#710">"</span></span>
&gt;&gt; fabio.telefone
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">6666-6666</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Abrindo a classe Object significa que nosso método “my_accessor” estará disponível a qualquer classe do Ruby, já que todos herdam de Object. Esse método recebe um array de symbols, como já descrevemos antes. Daí usamos “each” para iterar symbol a symbol, e para cada um chamamos “module_eval” que simplesmente executa qualquer String passado a ele, no caso criamos dinamicamente dois métodos, os equivalente a “getter” e “setter”. Para o exemplo :telefone, seria o mesmo que escrevêssemos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">telefone</span>() <span style="color:#33B">@telefone</span>; <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">telefone=</span>(val) <span style="color:#33B">@telefone</span> = val; <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Muita gente confunde “meta-programação” com “reflexão”. Reflexão é apenas perguntar a um objeto o que ele responde. Podemos fazer isso em Ruby de várias maneiras:</p>
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
      <td class="code"><pre>&gt;&gt; a = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">string</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">string</span><span style="color:#710">"</span></span>
&gt;&gt; a.methods
=&gt; [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">chop!</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">constantize</span><span style="color:#710">"</span></span>, ... <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">squish</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;&lt;</span><span style="color:#710">"</span></span>]
&gt;&gt; a.respond_to? <span style="color:#A60">:size</span>
&gt;&gt; p = <span style="color:#036;font-weight:bold">Pessoa</span>.new
=&gt; <span style="color:#777">#&lt;Pessoa:0x261af60 @iniciais=nil, @sobrenome=nil, @email=nil, @primeiro_nome=""&gt;</span>
&gt;&gt; p.telefone
=&gt; <span style="color:#069">nil</span>
&gt;&gt; p.instance_variable_set(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">@telefone</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">3333-4444</span><span style="color:#710">"</span></span>)
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">3333-4444</span><span style="color:#710">"</span></span>
&gt;&gt; p.instance_variable_get(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">@telefone</span><span style="color:#710">"</span></span>)
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">3333-4444</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui vemos como todo objeto Ruby tem um método chamado “methods” que devolve um Array listando todos os métodos que ele responde. Além disso todo objeto Ruby ainda responde ao método “respond_to?” que recebe um symbol como parâmetro e responde se esse objeto responde a essa mensagem.</p>
<p>No exemplo seguinte, com a classe “Pessoa”, podemos ainda manipular diretamente a variável de instância “@telefone” sem sequer precisar de métodos acessores.</p>
<p>Como podemos ver, Reflexão em Ruby é trivial. Já vimos antes como funciona o método “send” para enviar mensagens arbitrárias e também como implementar o método “method_missing” para fazer um objeto responder a mensagens arbitrárias. Mas com exemplos como do “attr_accessor” podemos entender como manipular o comportamento de um objeto em tempo de execução.</p>
<p>Por isso dizemos que Ruby tem capacidades muito poderosas de meta-programação, que é o que o torna particularmente prazeroso de usar, sem precisar contar com sintaxes obscuras ou truques não documentados. Pensar em meta-programação faz parte do dia-a-dia de programação com Ruby.</p>
<h2>Indo além do Nulo</h2>
<p>Como mais um exemplo da flexibilidade do Ruby, vamos analisar o bom o velho “nulo”. Note que nulo é realmente nada. Não é o mesmo que zero. Não é o mesmo que uma string vazia.</p>
<p>Em Ruby, estamos falando do ‘nil’. Porém, como quase tudo em Ruby é um objeto, assim também é ‘nil’:</p>
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
      <td class="code"><pre>&gt;&gt; <span style="color:#069">nil</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; <span style="color:#069">nil</span>.class
=&gt; <span style="color:#036;font-weight:bold">NilClass</span>
&gt;&gt; <span style="color:#069">nil</span>.object_id
=&gt; <span style="color:#00D">4</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, quando um método não devolve nada, ou seja, ‘nil’, ainda assim ele está devolvendo alguma coisa: a instância singleton da classe NilClass.</p>
<p>Não é difícil cair em situações onde queremos chamar um método em um objeto onde ainda não sabemos se o objeto é nil ou não. Por isso costumamos fazer algo assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">unless</span> obj.nil?
  obj.say_hello
<span style="color:#080;font-weight:bold">else</span>
  <span style="color:#069">nil</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui eu propositadamente fiz um código mais longo do que deveria, apenas para aproveitar e demonstrar o “unless”. Pense nele como o oposto de “if”. Em outras linguagens estamos acostumados a fazer algo assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> !obj.nil? ...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, “se não for …”. Mas em vez disso, em Ruby preferimos dizer “a menos que …”. Fica menos poluído do que colocar “!” (“not”) o tempo todo. Além disso chamamos o método “nil?” que checa se o objeto atual é nulo ou não. Esse método “nil?” está presente direto da classe pai “Object”, portanto todos os objetos no Ruby respondem a esse método, em particular, como “nil” também é um objeto, ele também responde a esse método:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="color:#069">nil</span>.nil?
=&gt; <span style="color:#069">true</span>
&gt;&gt; <span style="color:#00D">1</span>.nil?
=&gt; <span style="color:#069">false</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E eu disse que o código acima era mais longo do que o necessário porque sempre podemos usar o operador ternário (que também existe em outras linguagens):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>obj ? obj.say_hello : <span style="color:#069">nil</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, se “obj” devolver “true” (apenas “false” e “nil” respondem como “false” em condicionais), então chame o método “say_hello”, caso contrário, devolva ‘nil’.</p>
<p>Como em qualquer objeto, se tentarmos chamar um método em ‘nil’ que não existe, ele responderá normalmente com uma exceção:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="color:#069">nil</span>.size
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">size' for nil:NilClass
        from (irb):91
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Um outro truque que <a href="https://ozmm.org/posts/try.html">discutiu-se</a> algum tempo atrás é criar um novo método em Object chamado “try”:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Object</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">try</span>(metodo, *args)
    send(metodo, *args) <span style="color:#080;font-weight:bold">if</span> respond_to? metodo
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>.try(<span style="color:#A60">:size</span>)
=&gt; <span style="color:#00D">0</span>
&gt;&gt; <span style="color:#069">nil</span>.try(<span style="color:#A60">:size</span>)
=&gt; <span style="color:#069">nil</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em vez de chamar um método diretamente quando ainda não sabemos se o objeto é nil ou não, podemos chamar o método “try” passando a mensagem (o nome do método) e seus parâmetros. Se o objeto para onde enviamos a mensagem souber responder essa mensagem (respond_to?), então repassamos normalmente, senão devolvemos nil.</p>
<p>Recomendo que teste todos esses exemplos no <span class="caps">IRB</span> para entender o comportamento. Esse tipo de pensamento é crucial na programação Ruby. Não quer dizer, claro, que agora devemos usar coisas como “try” o tempo todo, mas nas situações onde são necessárias, essa pode ser a diferença entre um código extremamente enxuto e expressivo do que um código burocrático e difícil de entender.</p>
<h3>Conclusão</h3>
<p>Até aqui mostramos apenas a ponta do iceberg da programação com Ruby. Existem dezenas de classes que já vêm na biblioteca padrão do Ruby que vocês precisam saber, como Net, File, FileUtils e muitos outros. Use o site <a href="https://apidock.com/">ApiDock</a> sempre que tiver dúvidas quanto à sintaxe de algum método. Lembre-se da questão de parâmetros dinâmicos, o que dificulta a documentação automática. Mas também lembre-se que o código-fonte de bibliotecas Ruby costumam ser muito simples de ler. Portanto recomendo muito que, na dúvida, procure o código-fonte (que já está na sua máquina) e tente ler direto na fonte.</p>
<p>E para ver alguns exemplos muito interessantes de resolução de problemas em Ruby, também recomendo ler o site <a href="https://rubyquiz.com/">Ruby Quiz</a> que contém uma biblioteca enorme de pequenos problemas simples com soluções muito criativas usando os recursos de Ruby.</p>
<p>O mais importante: não tente escrever Ruby da mesma forma como se escreve Java ou C#. <em>“Quando se está em Roma, faça como os romanos.”</em> Portanto, nada de usar “camelCasing” para nomear seus métodos, por exemplo, use “metodos_separados_por_underscore”. Escreva Ruby da forma Ruby.</p>
<p></p>
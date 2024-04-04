---
title: "Micro-Tutorial de Ruby - Parte I"
date: "2008-11-10T03:41:00.000Z"
tags: ["beginner", "ruby", "tutorial"]
years: "2008"
---

<p></p>
<p>Depois de fazer várias palestras nas últimas semanas, uma coisa que notei é que a maioria das pessoas que está iniciando no Ruby, ou só ouviu falar de Rails, fica muito surpreso ao ver algumas das características da linguagem.</p>
<p>Este artigo é destinado aos iniciantes ou a quem começou a se interessar recentemente por Ruby e Rails. Antes de mais nada, quem já sabe um pouco de Ruby e quer alguma documentação sobre Rails, recomendo muito o novo site <a href="http://guides.rails.info">Rails Guides</a>, um esforço que se iniciou com o <strong>Pratik Naik</strong> e deu grandes frutos. Este site é um trabalho em constante evolução mas já concentra toneladas de guias sobre as principais funcionalidades do Rails. O Cassio, da <span class="caps">DRC</span>, também tem um <span class="caps">PDF</span> (e um screencast) disponível em <a href="http://www.devlab.com.br/rails">seu site</a>, que é uma atualização do material criado pelo Ronaldo Ferraz.</p>
<p>Meu objetivo nesta série de artigos é demonstrar algumas das características de Ruby que a tornam diferente de outras linguagens, principalmente as estáticas como Java ou C#.</p>
<p><strong>Disclaimer:</strong> antes de mais nada, vale avisar que usarei alguns trechos de código Java apenas como referência para quem vem de linguagens tradicionais. Não considere isso uma comparação direta (pois os códigos estão propositadamente não otimizados ou simplificados por motivos didáticos).</p>
<p></p>
<p></p>
<h2>O que tem de diferente no Ruby?</h2>
<p>Todos os códigos Ruby mostrados neste artigo podem ser testados no ambiente <span class="caps">IRB</span> (Interpreted Ruby). Com o Ruby já <a href="https://rubyforge.org/frs/download.php/43428/ruby186-27_rc1.exe">instalado</a> em sua máquina, digite o comando ‘irb’ e você estará dentro do ambiente dinâmico do interpretador Ruby. Qualquer código Ruby será executado na hora, o que deve facilitar seus testes. Na realidade eu recomendo que à medida que leiam o artigo, digitem os códigos em Ruby no <span class="caps">IRB</span> e vejam vocês mesmos os resultados. Será bem mais educativo desta forma.</p>
<p>Para começar, vejam este código:</p>
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
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(nome)
    <span style="color:#33B">@nome</span> = nome
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">nome</span>
    <span style="color:#33B">@nome</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">nome=</span>(valor)
    <span style="color:#33B">@nome</span> = valor
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>)  
puts fabio.nome
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Antes de mais nada, algumas explicações: o que outras linguagens chamam de funções ou métodos, em Ruby são definidas com ‘def … end’. Todo bloco de código termina com ‘end’.</p>
<p>Para colocar um método todo na mesma linha você poderia separar cada linha com “;” (ponto-e-vírgula):</p>
<hr>
rubydef nome; @nome; end<table class="CodeRay">
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
<a href="#n22" name="n22">22</a>
<a href="#n23" name="n23">23</a>
</pre>
      </td>
      <td class="code"><pre>
Para que um método retorne um valor, não é necessário usar a palavra 'return' como estamos acostumados. O resultado da última expressão de um método sempre é devolvida no retorno. Por exemplo, o método 'nome' acima tem apenas '@nome', que é o equivalente a fazer 'return @nome'. Use 'return' apenas se quiser sair do fluxo do método antes de chegar à linha final. Finalmente, variáveis de instância (algo como 'this.nome') são denotados com o prefixo '@'.
Para instanciar uma classe, basta chamar o método 'new' dela. Os parâmetros passados a esse método são repassados como argumentos ao método padrão 'initialize'. E 'puts' é apenas algo parecido com 'System.out.println()'. Parênteses são opcionais, só os use para eliminar ambigüidades na hora de chamar um método com parâmetros.
À primeira vista, o código acima não é diferente de algo semelhante em Java:
--- java
class Pessoa {
  String nome;
  public Pessoa(String nome) {
    this.nome = nome;
  }
  public String getNome() {
    return this.nome;
  }
  public void setNome(String nome) {
    this.nome = nome;
  }
}
Pessoa fabio = new Pessoa("Fabio");
System.out.println(fabio.getNome());
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nem mesmo em número de linhas de código temos algum ganho. Olhando apenas dessa forma, para um iniciante, ficaria a pergunta: <em>Onde está a diferença? Apenas por não ter chaves?</em></p>
<p>Bom, vejamos um outro exemplo – da mesma classe Ruby:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">ostruct</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span> &lt; <span style="color:#036;font-weight:bold">OpenStruct</span>; <span style="color:#080;font-weight:bold">end</span>
fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new <span style="color:#A60">:nome</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio</span><span style="color:#710">"</span></span>
puts fabio.nome
fabio.email = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">akitaonrails@mac.com</span><span style="color:#710">'</span></span>
puts fabio.email
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Bom, agora estamos começando a conversar! No caso acima eu confesso, trapaceei um pouco. Fiz a classe ‘Pessoa’ herdar a partir de uma classe padrão do Ruby, a ‘OpenStruct’. Ela permite que os objetos instanciados a partir dessa classe tenham qualquer atributo que for necessário em tempo de execução! Vou voltar neste ponto mais tarde, por enquanto apenas ignore a magia negra e continue.</p>
<p>Ruby suporta herança simples de classes, assim como em Java ou C#. O caracter ‘&lt;’ é o equivalente a ‘extends’ em Java.</p>
<p>Vamos a mais alguns exemplos simples:</p>
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
<a href="#n22" name="n22">22</a>
<a href="#n23" name="n23">23</a>
<a href="#n24" name="n24">24</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">1</span> + <span style="color:#00D">2</span>
=&gt; <span style="color:#00D">3</span>
&gt;&gt; numero = <span style="color:#00D">5</span>
=&gt; <span style="color:#00D">5</span>
&gt;&gt; numero * <span style="color:#00D">3</span>
=&gt; <span style="color:#00D">15</span>
&gt;&gt; contador = <span style="color:#00D">1</span>
=&gt; <span style="color:#00D">1</span>
&gt;&gt; <span style="color:#080;font-weight:bold">while</span> contador &lt; numero
&gt;&gt;   puts contador
&gt;&gt;   contador += <span style="color:#00D">1</span>
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
<span style="color:#00D">1</span>
<span style="color:#00D">2</span>
<span style="color:#00D">3</span>
<span style="color:#00D">4</span>
&gt;&gt; <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hello</span>
&gt;&gt;   <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
&gt;&gt; puts hello
<span style="color:#036;font-weight:bold">Hello</span> <span style="color:#036;font-weight:bold">World</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><strong>Obs:</strong> quando você está no <span class="caps">IRB</span>, “&gt;&gt;” é o “prompt de comando” e “=&gt;” é o resultado do comando que você acabou de executar. Não confunda com o código Ruby propriamente dito.</p>
<p>Na primeira parte algumas operações simples. Em seguida um loop tradicional, com contador. Depois um pequeno método chamado “hello” e sendo executado. Acredito que, independente da linguagem de onde você veio, o que mostrei até agora é bastante familiar. Novamente, fica a pergunta: <em>“onde está a diferença?”</em></p>
<h2>Quase tudo é Objeto</h2>
<p>Ruby foi muito influenciado por <strong>Smalltalk</strong>, a verdadeira linguagem que inspirou quase todas as outras mais modernas de orientação-a-objetos. Não quero aqui começar nenhuma discussão sobre o que é ser <span class="caps">OOP</span> ou não pois argumentos desse tipo são irrelevantes aqui.</p>
<p>O que muitos costumam reclamar em linguagens tradicionais é o seguinte:</p>
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
      <td class="code"><pre><span style="color:#339;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Teste</span> {
  <span style="color:#088;font-weight:bold">public</span> <span style="color:#088;font-weight:bold">static</span> <span style="color:#339;font-weight:bold">void</span> main(<span style="color:#0a5;font-weight:bold">String</span><span style="color:#339;font-weight:bold">[]</span> args) {
    <span style="color:#0a5;font-weight:bold">System</span>.out.println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>);
  }
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Muita coisa para fazer um simples “Hello World”. Agora vejamos o Hello World em Ruby:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><em>“Oras, mas Ruby não é <span class="caps">OOP</span>?? Cadê a classe!!?”</em> Vamos entender o exemplo. Considerando que ainda estamos dentro do ambiente <span class="caps">IRB</span>, faça o seguinte:</p>
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
      <td class="code"><pre>&gt;&gt; puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>
<span style="color:#036;font-weight:bold">Hello</span> <span style="color:#036;font-weight:bold">World</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; <span style="color:#069">self</span>
=&gt; main
&gt;&gt; <span style="color:#069">self</span>.class
=&gt; <span style="color:#036;font-weight:bold">Object</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Ruby, “self” é <em>mais ou menos</em> parecido com a função do “this” em Java ou outras linguagens. Mas como podem ver, nós já estamos <strong>dentro</strong> de um objeto, de uma instância de Object. Nunca estamos num ambiente estático ou não-objeto. Criar um método no <span class="caps">IRB</span> significa adicionar esse método ao objeto ‘main’ que, por sua vez é uma instância da classe Object.</p>
<p>Mas não é apenas isso, veja o seguinte:</p>
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
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">1</span>.class
=&gt; <span style="color:#036;font-weight:bold">Fixnum</span>
&gt;&gt; <span style="color:#069">true</span>.class
=&gt; <span style="color:#036;font-weight:bold">TrueClass</span>
&gt;&gt; <span style="color:#069">false</span>.class
=&gt; <span style="color:#036;font-weight:bold">FalseClass</span>
&gt;&gt; <span style="color:#069">nil</span>.class
=&gt; <span style="color:#036;font-weight:bold">NilClass</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Um número, um booleano (verdadeiro, falso) e até nulo (o “nil”) são objetos. Todos eles respondem a métodos, em especial o método “class” que indica de que classe esse objeto é instância. Note que até o nulo é uma instância da classe chamada “NilClass”.</p>
<h2>Classes Abertas</h2>
<p>Uma coisa que não tem o que se fazer em muitas linguagens estáticas como Java é <strong>mudar de idéia</strong>. Toda a idéia de se ter interfaces e classes fechadas força o programador a decidir da primeira vez e ter que sobreviver às conseqüências de sua decisão, o que normalmente força ter que tomar a decisão certa logo no começo e incentiva o temido <a href="https://en.wikipedia.org/wiki/Big_Design_Up_Front">Big Design Up Front</a>.</p>
<p>Quando precisamos de mais funcionalidades nesses casos, precisamos improvisar. Por exemplo:</p>
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
      <td class="code"><pre><span style="color:#339;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">StringUtils</span> {
  <span style="color:#088;font-weight:bold">public</span> <span style="color:#088;font-weight:bold">static</span> <span style="color:#339;font-weight:bold">boolean</span> isEmpty(<span style="color:#0a5;font-weight:bold">String</span> str) {
    <span style="color:#080;font-weight:bold">return</span> str == <span style="color:#069">null</span> || str.length() == <span style="color:#00D">0</span>;
  }
}
<span style="color:#0a5;font-weight:bold">String</span> nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio Akita</span><span style="color:#710">"</span></span>;
StringUtils.isEmpty(nome);
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método “isEmpty()”, disponível na classe StringUtils do pacote Commons do Jakarta, avalia se o string que ele recebeu como argumento é nulo ou vazio. Na classe original “java.lang.String” não existia o método “isEmpty()”. Isso não é um erro, apenas na época em que essa classe foi criada, não parecia óbvio a ninguém que um método assim poderia ser útil. Mas agora, a classe String é fechada e não pode ser reimplementada. Também não adianta criar uma classe MyString que herda de String porque todas instâncias de String não terão as novas funcionalidades do MyString.</p>
<p>Portanto a solução-gambiarra significa criar uma classe separada “StringUtils”, com vários métodos estáticos, como o “isEmpty()”, o que efetivamente significa programação procedural e não-orientada a objetos. StringUtils é apenas uma estrutura com um punhado de métodos estáticos.</p>
<p>Em Ruby, podemos o mesmo problema resolver desta forma:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">String</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">empty?</span>
    <span style="color:#069">self</span>.nil? || <span style="color:#069">self</span>.size == <span style="color:#00D">0</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
nome = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Fabio Akita</span><span style="color:#710">"</span></span>
nome.empty?
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nesse caso específico nem precisaríamos fazer isso porque o método “empty?” já existe na String de Ruby, mas está aí apenas para ilustrar o problema.</p>
<p>Temos algumas coisas interessantes aqui. Primeiro, o nome do método pode parecer estranho por causa da interrogação no final. Mas não se assustem, em Ruby isso é um caracter válido num nome de método e não tem nenhum efeito colateral, é apenas um caracter a mais que expressa a intenção do método, no caso, de fazer uma pergunta ao objeto.</p>
<p>Mas o mais importante: hoje estamos decidindo que a classe String deveria ter mais métodos do que ele já tem. Felizmente, graças às características da linguagem, não estamos presos a uma classe fechada: podemos reabrí-la, reimplementá-la como quisermos e, automaticamente, toda instância de String (novas e inclusive as que já existiam), passam a responder à nova implementação.</p>
<p>Vejamos outro exemplo de orientação a objetos mesclado com “eye candy”.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">1</span> + <span style="color:#00D">2</span>
=&gt; <span style="color:#00D">3</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vamos lembrar do básico: números, em Ruby, são objetos, mais especificamente instâncias da classe Fixnum. Agora vejamos outra maneira de escrever a mesma coisa em Ruby, sem “eye candy”:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">1</span>.+(<span style="color:#00D">2</span>)
=&gt; <span style="color:#00D">3</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Espero que isso esteja claro: quando somamos dois números, na realidade estamos <em>chamando o método especial</em> “+” do objeto “1” e passando como argumento o objeto “2”. E isso vale para todos os operadores matemáticos que conhecemos como “-”, “/”. Mas o que acontece quando tentamos somar dois objetos incompatíveis?</p>
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
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">1</span> + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">2</span><span style="color:#710">"</span></span>
<span style="color:#036;font-weight:bold">TypeError</span>: <span style="color:#036;font-weight:bold">String</span> can<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">t be coerced into Fixnum
        from (irb):35:in `+</span><span style="color:#710">'</span></span>
        from (irb):<span style="color:#00D">35</span>
&gt;&gt; <span style="color:#00D">1</span>.+(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">s</span><span style="color:#710">"</span></span>)
<span style="color:#036;font-weight:bold">TypeError</span>: <span style="color:#036;font-weight:bold">String</span> can<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">t be coerced into Fixnum
        from (irb):36:in `+</span><span style="color:#710">'</span></span>
        from (irb):<span style="color:#00D">36</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Escrevi as duas maneiras novamente: passar um String como parâmetro ao método “+” de um Fixnum devolve uma exceção “TypeError” indicando que a operação é inválida. Mas digamos que, apenas por motivos didáticos, eu realmente queira que o Ruby reaja como Javascript ou Perl e que “1” seja convertido em String e depois concatenado ao parâmetro “2”, resultando em “12”.</p>
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
      <td class="code"><pre>&gt;&gt; <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Fixnum</span>
&gt;&gt;   <span style="color:#080;font-weight:bold">alias</span> <span style="color:#A60">:soma_velha</span> <span style="color:#A60">:+</span>
<span style="color:#00D">?&gt;</span>   <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">+</span>(valor)
&gt;&gt;     <span style="color:#080;font-weight:bold">return</span> <span style="color:#069">self</span>.to_s + valor <span style="color:#080;font-weight:bold">if</span> valor.is_a? <span style="color:#036;font-weight:bold">String</span>
&gt;&gt;     soma_velha(valor)
&gt;&gt;   <span style="color:#080;font-weight:bold">end</span>
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; <span style="color:#00D">1</span> + <span style="color:#00D">2</span>
=&gt; <span style="color:#00D">3</span>
&gt;&gt; <span style="color:#00D">1</span> + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">2</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">12</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Várias coisas acontecendo aqui. Vejamos os principais pontos: primeiro, estamos reabrindo a classe Fixnum, ou seja, todas as instâncias dessa classe serão afetadas automaticamente pelo que faremos a seguir.</p>
<p>Depois, mais uma novidade: o método ‘alias’. Esse é um método de classe que cria um novo apontamento a um método que já existe. Pense em algo assim: você tem ‘a = foo’ e depois ‘b = a’. Agora, tanto ‘a’ quanto ‘b’ apontam para o mesmo objeto ‘foo’.</p>
<p>Outra coisa: quando uma classe é criada, reaberta ou ‘executada’ os métodos chamados dentro dela são executados. Ou seja, o comando ‘alias’, por exemplo, serve para reapontar um método com outro nome. No exemplo, já existia o método chamado “+” e com “alias” criamos um segundo método chamado “soma_velha” que aponta para a mesma implementação do método original. Ou seja, neste ponto as três chamadas a seguir se equivalem:</p>
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
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">5</span> + <span style="color:#00D">10</span>
=&gt; <span style="color:#00D">15</span>
&gt;&gt; <span style="color:#00D">5</span>.+(<span style="color:#00D">10</span>)
=&gt; <span style="color:#00D">15</span>
&gt;&gt; <span style="color:#00D">5</span>.soma_velha(<span style="color:#00D">10</span>)
=&gt; <span style="color:#00D">15</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Mas fizemos mais: depois de criar o novo apontamento “soma_velha” reimplementamos o método antigo “+”. A idéia é: se o parâmetro for um String, quero transformar o objeto Fixnum num String e depois concatenamos os dois. Veja como usamos o ‘return’ para retornar imediatamente caso este seja o caso. Senão, se o argumento passado não for um String, passamos para o método ‘soma_velha’ fazer a soma do jeito antigo.</p>
<p>Note também que usamos o ‘if’ de uma forma um pouco diferente: no fim da expressão:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">return</span> <span style="color:#069">self</span>.to_s + valor <span style="color:#080;font-weight:bold">if</span> valor.is_a? <span style="color:#036;font-weight:bold">String</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>‘is_a?’ é um método que está sem os parênteses (lembram-se? são opcionais) e serve para verificar o tipo do objeto ‘valor’. Literalmente podemos ler assim: “retorne self.to_s concatenado com ‘valor’ se for do tipo String.” Se você entende inglês verá que a expressão é praticamente uma frase.</p>
<p>E é isso que acontece agora quando tentamos somar um número com um string: ele retorna a concatenação de dois Strings. Note também que esse comportamento passa a valer para todos os objetos numéricos (instâncias de Fixnum).</p>
<p>Esse conceito de reabrir uma classe e implementar uma nova funcionalidade ficou conhecido com o nome de <a href="https://en.wikipedia.org/wiki/Monkey_patch">monkey patching</a>. É um recurso muito poderoso e, como tudo que é poderoso ele pode ser tanto uma grande vantagem como um grande risco se usado da maneira errada. Espera-se, claro, que o programador não abuse disso.</p>
<p>O framework Ruby on Rails faz muito uso desse recurso. Um dos pacotes que compõe o Rails chama-se Active Support e uma de suas utilidades é justamente reabrir diversas classes padrão do Ruby para incorporar mais funcionalidades. Por exemplo:</p>
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
<a href="#n22" name="n22">22</a>
<a href="#n23" name="n23">23</a>
<a href="#n24" name="n24">24</a>
<a href="#n25" name="n25">25</a>
<a href="#n26" name="n26">26</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># carrega o pacote activesupport</span>
&gt;&gt; require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rubygems</span><span style="color:#710">'</span></span>
&gt;&gt; require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activesupport</span><span style="color:#710">'</span></span>
=&gt; <span style="color:#069">true</span>
<span style="color:#777"># horário atual</span>
&gt;&gt; <span style="color:#036;font-weight:bold">Time</span>.now
=&gt; <span style="color:#036;font-weight:bold">Wed</span> <span style="color:#036;font-weight:bold">Oct</span> <span style="color:#00D">29</span> <span style="color:#00D">23</span>:<span style="color:#00D">36</span>:<span style="color:#00D">24</span> -<span style="color:#00D">0200</span> <span style="color:#00D">2008</span>
<span style="color:#777"># fazendo cálculos com datas</span>
&gt;&gt; <span style="color:#036;font-weight:bold">Time</span>.now - <span style="color:#00D">23</span>.days
=&gt; <span style="color:#036;font-weight:bold">Mon</span> <span style="color:#036;font-weight:bold">Oct</span> <span style="color:#00D">06</span> <span style="color:#00D">23</span>:<span style="color:#00D">36</span>:<span style="color:#00D">28</span> -<span style="color:#00D">0300</span> <span style="color:#00D">2008</span>
&gt;&gt; <span style="color:#00D">2</span>.weeks.ago
=&gt; <span style="color:#036;font-weight:bold">Wed</span> <span style="color:#036;font-weight:bold">Oct</span> <span style="color:#00D">15</span> <span style="color:#00D">23</span>:<span style="color:#00D">36</span>:<span style="color:#00D">32</span> -<span style="color:#00D">0200</span> <span style="color:#00D">2008</span>
<span style="color:#777"># fazendo cálculos com unidades de medida</span>
&gt;&gt; (<span style="color:#00D">1</span>.gigabyte - <span style="color:#00D">512</span>.megabytes) / <span style="color:#00D">1</span>.kilobyte
=&gt; <span style="color:#00D">524288</span>
<span style="color:#777"># transformando objetos em XML</span>
&gt;&gt; { <span style="color:#A60">:html</span> =&gt; { <span style="color:#A60">:body</span> =&gt; { <span style="color:#A60">:p</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span> } } }.to_xml
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">&lt;?xml version=</span><span style="color:#710">"</span></span><span style="color:#60E">1.0</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> encoding=</span><span style="color:#710">"</span></span><span style="color:#036;font-weight:bold">UTF</span>-<span style="color:#00D">8</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">?&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">
&lt;hash&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">  &lt;html&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">    &lt;body&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">      
&lt;p&gt;teste&lt;/p&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">    &lt;/body&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">  &lt;/html&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">
&lt;/hash&gt;</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como podem ver, podemos incrementar muito as funcionalidades de tudo que já existe. O Ruby on Rails começa exatamente assim: primeiro incorporando muitas coisas novas ao próprio Ruby e depois construindo sobre ela. Muitos são casos onde simplesmente depender de criar novas sub-classes não adiantaria muita coisa. Outro exemplo: em Java, se quisermos comparar o conteúdo de dois Strings, não devemos fazer isso:</p>
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
      <td class="code"><pre><span style="color:#0a5;font-weight:bold">String</span> a = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>;
<span style="color:#0a5;font-weight:bold">String</span> b = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla</span><span style="color:#710">"</span></span>;
<span style="color:#080;font-weight:bold">if</span> (a == b) {
        <span style="color:#0a5;font-weight:bold">System</span>.out.println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">encontrado!</span><span style="color:#710">"</span></span>);
}
<span style="color:#080;font-weight:bold">if</span> (a &gt; b) {
        <span style="color:#0a5;font-weight:bold">System</span>.out.println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a maior do que b</span><span style="color:#710">"</span></span>);
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O correto seria assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> (a.equals(b)) {
        <span style="color:#0a5;font-weight:bold">System</span>.out.println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">encontrado!</span><span style="color:#710">"</span></span>);
}
<span style="color:#080;font-weight:bold">if</span> (a.compareTo(b) &gt; <span style="color:#00D">0</span>) {
        <span style="color:#0a5;font-weight:bold">System</span>.out.println(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a maior do que b</span><span style="color:#710">"</span></span>);
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Já, em Ruby, fazemos assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>a = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>
b = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla</span><span style="color:#710">"</span></span>
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">encontrado!</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">if</span> a == b
puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a maior do que b</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">if</span> a &gt; b
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Exatamente como imaginaríamos que deveria ser. Isso porque “==” e “&gt;” são ‘operadores’ mas são também nomes de métodos, como explicamos acima. Então fica fácil implementar o comportamento que precisamos da maneira mais clara e expressiva possível.</p>
<h3>Módulos e Organização</h3>
<p>No exemplo do Fixnum, reabrimos diretamente a classe para colocar novas funcionalidades. Mas podemos fazer diferente:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">Fixnum</span>.class_eval <span style="color:#080;font-weight:bold">do</span>
  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#A60">:soma_velha</span> <span style="color:#A60">:+</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">+</span>(valor)
    <span style="color:#080;font-weight:bold">return</span> <span style="color:#069">self</span>.to_s + valor <span style="color:#080;font-weight:bold">if</span> valor.is_a? <span style="color:#036;font-weight:bold">String</span>
    soma_velha(valor)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como a classe “Fixnum” é por si mesmo um objeto, podemos chamar métodos nela. Por exemplo, “new” é um método dessa instância de Class. O que fizemos acima é a mesma coisa que fizemos antes, mas esse código podemos colocar dentro um método, para ser executado somente quando quisermos. Ou seja, podemos alterar o comportamento de uma classe programaticamente. Mas podemos ser ainda mais seletivos:</p>
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
      <td class="code"><pre>&gt;&gt; a = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">teste</span><span style="color:#710">"</span></span>
&gt;&gt; a.instance_eval <span style="color:#080;font-weight:bold">do</span>
<span style="color:#00D">?&gt;</span>   <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hello</span>
&gt;&gt;     <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello from teste</span><span style="color:#710">"</span></span>
&gt;&gt;   <span style="color:#080;font-weight:bold">end</span>
&gt;&gt; <span style="color:#080;font-weight:bold">end</span>
=&gt; <span style="color:#069">nil</span>
&gt;&gt; a.hello
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello from teste</span><span style="color:#710">"</span></span>
&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo</span><span style="color:#710">"</span></span>.hello
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">hello' for "foo":String
        from (irb):17
        from :0
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja agora: criamos um String na variável “a”. Então modificamos essa instância acrescentando um método chamado “hello”, mas somente a essa instância. Quando chamamos “a.hello” ele responde como esperamos, mas quando pegamos uma nova instância de String e tentamos chamar o mesmo método, vemos que não existe. Ou seja, podemos modificar o comportamento de todos os objetos de uma classe, ou somente de um único objeto individual.</p>
<p>Agora vejamos um outro meio de injetar código em classes de maneiras mais organizadas:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">MeusPatches</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">say_hello</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World!</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">say_time</span>
    <span style="color:#036;font-weight:bold">Time</span>.now
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Fixnum</span>
  include <span style="color:#036;font-weight:bold">MeusPatches</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">String</span>
  extend <span style="color:#036;font-weight:bold">MeusPatches</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Módulos são como Classes que não podem ser instanciadas. No exemplo acima, organizamos dois métodos dentro de um módulo chamado “MeusPatches”. Em seguida reabrimos as classes “Fixnum” e “String”. No primeiro incluímos o módulo e no segundo extendemos o módulo. Para entender a diferença vamos usar isso:</p>
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
      <td class="code"><pre>&gt;&gt; <span style="color:#00D">13</span>.say_hello
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World!</span><span style="color:#710">"</span></span>
&gt;&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>.say_hello
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">say_hello' for "":String
        from (irb):19
&gt;&gt; String.say_hello
=&gt; "Hello World!"
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O objeto “13” (que é instância de Fixnum) responde ao método do módulo. A string vazia "" não responde. Eis a diferença entre “include” e “extend”: no segundo quem responde ao método do módulo é a própria classe. Na prática, pense que “include” serve para acrescentar métodos de instância e “extend” para acrescentar “métodos de classe” – esse não é o termo correto mas para a maioria dos casos serve.</p>
<p>No Ruby on Rails esse recurso é muito usado, principalmente para organizar códigos de classes muito longas. Por exemplo, o ActiveRecord tem centenas de funcionalidades. Colocar tudo numa única classe seria muito difícil de manter depois, por isso ele se organiza desta forma:</p>
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
      <td class="code"><pre><span style="color:#777"># </span>
<span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span>.class_eval <span style="color:#080;font-weight:bold">do</span>
  extend <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">QueryCache</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Validations</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Locking</span>::<span style="color:#036;font-weight:bold">Optimistic</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Locking</span>::<span style="color:#036;font-weight:bold">Pessimistic</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">AttributeMethods</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Dirty</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Callbacks</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Observing</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Timestamp</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Associations</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">NamedScope</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">AssociationPreload</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Aggregations</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Transactions</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Reflection</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Calculations</span>
  include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Serialization</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Cada um dos includes acima tem um arquivo separado. Por exemplo ActiveRecord::QueryCache fica no arquivo “active_record/query_cache.rb”. É uma excelente maneira de organizar seus códigos. Mas existem alguns truques importantes de se conhecer. Uma delas é entender que módulos tem “eventos”. Ou seja, podemos instruir o módulo para executar alguma coisa toda vez que for incluso em alguma classe.</p>
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
<a href="#n22" name="n22">22</a>
<a href="#n23" name="n23">23</a>
<a href="#n24" name="n24">24</a>
<a href="#n25" name="n25">25</a>
<a href="#n26" name="n26">26</a>
<a href="#n27" name="n27">27</a>
<a href="#n28" name="n28">28</a>
<a href="#n29" name="n29">29</a>
<strong><a href="#n30" name="n30">30</a></strong>
<a href="#n31" name="n31">31</a>
<a href="#n32" name="n32">32</a>
<a href="#n33" name="n33">33</a>
<a href="#n34" name="n34">34</a>
<a href="#n35" name="n35">35</a>
<a href="#n36" name="n36">36</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">MeusPatches</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">included</span>(base)
    base.send(<span style="color:#A60">:extend</span>, <span style="color:#036;font-weight:bold">ClassMethods</span>)
    puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Module MeusPaches incluso na classe </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>base.name<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">metodo_de_instancia</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de instancia</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">ClassMethods</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">extended</span>(base)
      puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Module MeusPatches::ClassMethods extendido na classe </span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>base.name<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">metodo_de_classe</span>
      <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de classe</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#00D">?&gt;</span>   <span style="color:#036;font-weight:bold">Pessoa</span>.send(<span style="color:#A60">:include</span>, <span style="color:#036;font-weight:bold">MeusPatches</span>)
<span style="color:#036;font-weight:bold">Module</span> <span style="color:#036;font-weight:bold">MeusPatches</span>::<span style="color:#036;font-weight:bold">ClassMethods</span> extendido na classe <span style="color:#036;font-weight:bold">Pessoa</span>
<span style="color:#036;font-weight:bold">Module</span> <span style="color:#036;font-weight:bold">MeusPaches</span> incluso na classe <span style="color:#036;font-weight:bold">Pessoa</span>
=&gt; <span style="color:#036;font-weight:bold">Pessoa</span>
&gt;&gt; 
<span style="color:#00D">?&gt;</span>   fabio = <span style="color:#036;font-weight:bold">Pessoa</span>.new
=&gt; <span style="color:#777">#&lt;Pessoa:0x1789528&gt;</span>
&gt;&gt; fabio.metodo_de_instancia
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de instancia</span><span style="color:#710">"</span></span>
&gt;&gt; 
<span style="color:#00D">?&gt;</span> <span style="color:#036;font-weight:bold">Pessoa</span>.metodo_de_classe
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de classe</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você vai entender o que significa “send” na próxima seção. Apenas entenda a seguinte idéia: criamos um módulo chamado “MeusPatches” e um sub-módulo dentro dele chamado “ClassMethods” (poderia ser outro nome, mas só para padronizar). Os métodos do módulo principal ficam disponíveis às instâncias dos objetos e os métodos do sub-módulo ficam disponíveis como métodos de classe. A sequência é assim:</p>
<ol>
  <li>primeiro definimos o módulo MeusPatches e seu sub-módulo ClassMethods</li>
  <li>definimos a classe Pessoa, uma classe vazia</li>
  <li>incluímos o módulo MeusPatches à classe Pessoa</li>
  <li>o método self.included é ativado que, por sua vez, manda extender o sub-módulo ClassMethods na classe Pessoa (que é passado como o parâmetro “base”)</li>
  <li>agora a classe Pessoa ganhou os métodos de instância e de classe</li>
  <li>criamos a instância “fabio” e chamamos o método “metodo_de_instancia”</li>
  <li>chamamos o método “metodo_de_classe” diretamente da classe Pessoa</li>
</ol>
<p>Se fôssemos reescrever a classe Pessoa sem o recurso de módulos, ela ficaria assim:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">metodo_de_instancia</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de instancia</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#069">self</span>.<span style="color:#06B;font-weight:bold">metodo_de_classe</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de classe</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Criar um método a partir de “self” significa que o método está disponível apenas à classe e não às suas instâncias. Novamente, para ser mais fácil de comparar, pense em métodos estáticos de classe como em Java. Mas entenda que não é a mesma coisa: em Java ou C# as classes são estruturas estáticas, em Ruby a própria classe é um objeto (pois ela é instância da classe “Class”). Outra maneira de escrever a mesma coisa seria:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Pessoa</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">metodo_de_instancia</span>
    <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de instancia</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">class</span> &lt;&lt; <span style="color:#B06;font-weight:bold">self</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">metodo_de_classe</span>
      <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de classe</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A diferença é que em vez de escrever “def self.” o tempo todo, podemos simplesmente reabrir a metaclasse da classe Pessoa e escrever todos os métodos “localmente” ali dentro. Em ambos os casos a classe vai se comportar da seguinte forma:</p>
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
      <td class="code"><pre>&gt;&gt; p = <span style="color:#036;font-weight:bold">Pessoa</span>.new
=&gt; <span style="color:#777">#&lt;Pessoa:0x1775370&gt;</span>
&gt;&gt; p.metodo_de_instancia
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">sou um metodo de instancia</span><span style="color:#710">"</span></span>
&gt;&gt; p.metodo_de_classe
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">metodo_de_classe' for #&lt;Pessoa:0x1775370&gt;
        from (irb):94
&gt;&gt; Pessoa.metodo_de_instancia
NoMethodError: undefined method </span><span style="color:#161">`</span></span>metodo_de_instancia<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20"> for Pessoa:Class
        from (irb):95
&gt;&gt; Pessoa.metodo_de_classe
=&gt; "sou um metodo de classe"
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não perca a Parte II deste artigo para entender o básico da linguagem Ruby. Espero que até aqui tenha ficado bastante claro que não devemos tentar codificar Ruby da mesma forma que codificamos em outras linguagens estáticas. Tirem proveito do dinamismo dessa linguagem, é assim que fazemos o “The Ruby Way”.</p>
<p>Continue lendo a <a href="/2008/11/10/micro-tutorial-de-ruby-parte-ii">Parte II</a></p>
<p></p>
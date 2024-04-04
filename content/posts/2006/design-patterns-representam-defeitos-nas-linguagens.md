---
title: "Design Patterns representam defeitos nas Linguagens"
date: "2006-10-30T11:27:00.000Z"
tags: ["principles"]
years: "2006"
---

<p></p>
<p>Este é um longo artigo postado no blog <a href="http://newbabe.pobox.com/~mjd/blog/2006/09/11/#design-patterns">The Universe of Discourse</a>, por Mark Dominus.</p>
<p>O artigo explica porque a filosofia do que conhecemos hoje como “Movimento de Design Patterns” gasta esforços numa direção equivocada e porque <strong>Ruby on Rails</strong> é uma resposta na direção certa. Também fica mais simples entender porque RoR é comumente chamado de <em>“<span class="caps">DSL</span> de aplicativos Web”</em>, ou seja, uma Linguagem de Domínio Específico (<span class="caps">DSL</span>) voltado a aplicativos Web que seguem o Design Pattern <span class="caps">MVC</span>.</p>
<p>Desde o começo da genealogia das linguagens de programação, saltamos de linguagens de máquina (Assembly), para Fortran, Lisp, Simula, Haskell, Perl, Java, Ruby onde cada nova linguagem melhora deficiências das anteriores. É um pensamento que muitos programadores não entendem, mas deveriam, porque estão à mercê do movimento de Design Patterns, acreditando que eles são a única solução dos problemas, ou seja, que a solução é entender que o problema existe e que, infelizmente, é necessário aprender a conviver com ele, em vez de realmente resolver o problema.</p>
<p></p>
<p></p>
<h4>Design Patterns de 1972</h4>
<p>“Patterns” (padrões) que são recorrentes em uma linguagem podem ser invisíveis ou triviais em outra linguagem.</p>
<h4>Exemplo Extendido: “classe orientada a objeto”</h4>
<p>Programadores de C tem um pattern que poderia ser chamado “classe orientada a objeto”. Nesse pattern, um objeto é uma instância de um struct C.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>struct st_employee_object *emp;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou, dado um typedef apropriado:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">EMPLOYEE</span> emp;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Alguns dos membros da struct são ponteiros de função. Se “emp” é um objeto, então podemos chamar um método do objeto procurando pelo ponteiro de função apropriado e chamando essa função:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>emp-&gt;method(emp, args...);
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Cada struct define uma classe; objetos na mesma classe tem os mesmos dados como membros e suportam os mesmos métodos. Se a definição da struct é declarada em um arquivo header, o layout da estrutura pode mudar; métodos e campos podem ser adicionados e nenhum dos códigos que usam o objeto precisam saber disso.</p>
<p>Existem diversas variações em cima disso. Por exemplo, você pode ter uma implementação opaca definindo dois arquivos header para cada classe. Uma que define a implementação:</p>
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
      <td class="code"><pre>struct st_employee_object {
        unsigned salary;
        struct st_manager_object *boss;
        <span style="color:#036;font-weight:bold">METHOD</span> fire, transfer, competence;
};
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E outra que define a interface:</p>
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
      <td class="code"><pre>struct st_employee_object {
        char __SECRET_MEMBER_DATA_DO_NOT_TOUCH[<span style="color:#00D">4</span>];
        struct st_manager_object *boss;
        <span style="color:#036;font-weight:bold">METHOD</span> fire, transfer, competence;
};
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Então os arquivos incluem um ou outro conforme for apropriado. Aqui “boss” é um dado público mas “salary” é privado.</p>
<p>Você consegue classes abstratas definindo uma função construtora que configura todos os métodos como <span class="caps">NULL</span> ou para:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>void _abstract() { abort(); }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se quiser herança, você faz uma das structs ser o prefixo de outra:</p>
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
      <td class="code"><pre>struct st_manager_object;   <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">* forward declaration *</span><span style="color:#404">/</span></span>
<span style="color:#777">#define EMPLOYEE_FIELDS \</span>
        unsigned salary; \
        struct st_manager_object *boss; \
        <span style="color:#036;font-weight:bold">METHOD</span> fire, transfer, competence;
struct st_employee_object {
        <span style="color:#036;font-weight:bold">EMPLOYEE_FIELDS</span>
};
struct st_manager_object {
        <span style="color:#036;font-weight:bold">EMPLOYEE_FIELDS</span>
        unsigned num_subordinates;
        struct st_employee_object **subordinate;
        <span style="color:#036;font-weight:bold">METHOD</span> delegate_task, send_to_conference;
};
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E se <code>obj</code> é um objeto <code>manager</code>, você ainda pode tratá-lo como um <code>employee</code> e chamar métodos de <code>employee</code> dele.</p>
<p>Isso pode parecer estranho ou limitado, mas a técnica é usada largamente. O padrão C contém garantias que os campos comuns de <code>struct st_manager_object</code> e <code>struct st_employee_object</code> serão colocados na memória de maneira idêntica, especialmente de tal maneira que essa técnica de classe orientada a objetos funcione. O código do sistema X Window tem essa estrutura. O código do toolkit de widgets Athena tem essa estrutura. O código do filesystem na kernel do Linux tem essa estrutura.</p>
<p>Rob Pike, um dos principais arquitetos do sistema operacional Plan 9 (o sucessor do Unix feito pela Bell Labs) e co-autor (with Brian Kernighan) do <em>The Unix Programming Environment</em>, recomenda essa técnica em seu artigo <a href="https://www.lysator.liu.se/c/pikestyle.html">Notes on Programming in C</a></p>
<h4>Isso é um pattern</h4>
<p>Há apenas uma maneira onde essa técnica não se qualifica como um pattern, de acordo com a definição de Gamma, Helm, Johnson e Vlissides. Eles dizem:</p>
<blockquote>Um design pattern sistematicamente nomeia, motiva e explica um design geral que endereça um problama recorrente de design em sistemas orientados a objeto. Ele descreve o problema, a solução, quando aplicar a solução e suas consequências. Ele também dá dicas de implementação e exemplos. A solução é um arranjo geral de objetos e classes que resolvem o problema. A solução é customizada e implementada para resolver o problema em um contexto em particular.</blockquote>
<p>A definição deles arbitrariamente restringe “design patterns” para endereçar problemas recorrentes de design “em sistemas orientados a objeto”, e como sendo arranjos gerais de “objetos e classes”. Se ignorarmos essa restrição arbitrária, o padrão de “classe orientada a objetos” se encaixa perfeitamente nessa definição.</p>
<p>A definição da Wikipedia é:</p>
<blockquote>Em engenharia de software, um design pattern é uma solução geral para um problema comum em design de software. Um design pattern não é um design finalizado que pode ser transformado diretamente em código; é uma descrição ou um template de como resolver um problema que pode ser usado em muitas situações diferentes.</blockquote>
<p>E a solução de “classe orientada a objetos” certamente se qualifica.</p>
<h4>Codificação de patterns</h4>
<p>A apresentação de Peter Norvig sobre <a href="https://www.norvig.com/design-patterns/">Design Patterns em Linguagens Dinâmicas</a> descreve três “níveis de implementação de um pattern” :</p>
<ul>
  <li>Invisível – praticamente uma parte da linguagem, que você nem nota.</li>
  <li>Formal – implementa o pattern propriamente dito dentro da linguagem. instancia-se ou chama-se para cada uso. usualmente implementada com macros.</li>
  <li>Informal – Design Pattern em prosa; referido pelo nome, mas Precisa ser reimplementado do zero para cada uso.</li>
</ul>
<p>Em C, a “classe orientada a objetos” é um pattern informal. Ele precisa ser reimplementado do zero para cada uso. Se você quiser herança, precisa configurá-lo manualmente. Se quiser abstração, precisa configurá-lo manualmente.</p>
<p>O principal motivo para a invenção do C++ foi para codificar esse pattern na linguagem para se tornar “invisível”. Em C++, você não precisa pensar na forma de structs e não precisa se preocupar em manter dados e métodos privados. Você apenas declara a “class” (usando sintaxe que se parece exatamente como a declaração de uma struct) e anota os ítens como “public” ou “private” conforme apropriado.</p>
<p>Mas por baixo dos panos, ele está fazendo a mesma coisa. Os primeiros compiladores C++ simplesmente traduziam código C++ em código C equivalente e chamavam o compilador C. Existe uma razão porque a sintaxe de chamada de método do C++ é <code>object-&gt;method(args...)</code>: é praticamente a mesma coisa do código equivalente em C para implementar esse pattern. A única diferença é que o objeto é passado implicitamente ao método, em vez de explicitamente como o primeiro argumento.</p>
<p>Em C, você precisa tomar uma decisão consciente de usar o estilo OO e implementar cada funcionalidade de seu sistema <span class="caps">OOP</span> enquanto trabalha. Se um programa tem cinquenta módulos, você precisa decidir, cinquenta vezes, se vai fazer o próximo módulo ser no estilo OO. Em C++, não precisa fazer isso e não precisa implementá-lo: já está construído dentro da linguagem.</p>
<h4>Sherman, configura a máquina do tempo para 1957</h4>
<p>Se escavarmos para trás na história, podemos encontrar todo tipo de patterns. Por exemplo:</p>
<blockquote>Problema recorrente: duas ou mais partes de uma linguagem de máquina precisam fazer a mesma operação complexa. Duplicar o código toda vez cria problemas de manutenção quando uma cópia é atualizada e a outra não.<br>
  <br>
  Solução: coloque o código dessa operação no final do programa. Reserve alguma memória extra (um “frame”) para esse uso exclusivo. Quando outro código (o “caller”, “chamador”) quiser executar essa operação, ele deve armazenar os valores correntes dos registradores da máquina, incluindo o contador do programa, no frame, e tranferir controle para a operação. A última coisa que essa operação deve fazer é restaurar os valores dos registradores a partir dos valores gravados no frame e pular de volta (jump) para a instrução exatamente depois do valor PC gravado.
</blockquote>
<p>Essa é uma descrição no estilo de uma pattern que nós conhecemos como “sub-rotina”. Ele endereça um problema recorrente de design. Ela é um arranjo genérico de instruções de máquina para resolver um problema. E a solução é customizada e implementada para resolver o problema em um contexto em particular. Variações: “sub-rotina com passagem de parâmetros”, “chamada de sub-rotina com valor de retorno”, “sub-rotina re-entrante”.</p>
<p>Para programadores de linguagem de máquina dos anos 50 e começo dos anos 60, isso era um pattern, reimplementado do zero para cada uso. Quando os assemblers melhoraram, o pattern se tornou formal, implementado com macros de linguagens assembly. Logo depois disso, o pattern foi absorvido no Fortran e Lisp e seus sucessores, e agora é invisível. Você não precisa pensar mais sobre a implementação: você apenas chama funções.</p>
<h4>Iteradores e model-view-controller</h4>
<p>Na <a href="https://perl.plover.com/yak/design/">última vez</a> que escrevi sobre design patterns, foi para apontar que embora o movimento tenha sido inspirado pelo trabalho de “linguagem de pattern” de Christopher Alexander, não é parecido com nada que Alexander tenha sugerido, e que de fato o que Alexander sugeriu é mais interessante e provavelmente teria sido mais útil para programadores do que o movimento de design pattern escolheu seguir.</p>
<p>Uma das coisas que eu apontei foi essencialmente o que Norvig disse: que muitos patterns não estão realmente endereçando problemas recorrentes de design em programas orientados a objetos. Eles estão, na realidade, endereçando <strong>deficiências</strong> em linguagens de programação orientadas a objetos e que em linguagens melhores, esses problemas simplemente não aparecem ou são resolvidos de maneira tão fácil e trivial que a solução não requer um pattern. Em linguagem assembly, “chamada de sub-rotina” pode ser um pattern; em C, a solução é escrever <code>result = function(args ...)</code>, que é simples demais para se qualificar como pattern. Em uma linguagem como Lisp ou Haskell ou mesmo Perl, com um bom tipo de lista e poderosas primitivas para operar em valores de listas, o pattern “Iterator” (iterador) é aliviado em um grande degrau ou tido como invisível. Henry G. Baker pegou esse ponto em seu artigo <a href="https://home.pipeline.com/~hbaker1/Iterator.html">Iterators: Sinais de Fraqueza em Linguagens Orientadas a Objetos.</a></p>
<p>Recebi muitas mensagens sobre isso, e curiosamente, alguns chegaram à mesma conclusão da mesma forma: eles disseram que embora eu estivesse certo sobre Iterator, era um exemplo pobre porque era um pattern muito simples, mas que era impossível imaginar um pattern mais complexo como Model-View-Controller ser absorvido e se tornar invisível dessa maneira.</p>
<p>Essa observação é chocante por diversas razões. Isso é um exemplo do que talvez seja a maior falácia da filosofia comum: o escritor não pode imaginar alguma coisa, portanto ela só pode ser impossível. Bem, talvez seja mesmo impossível – ou talvez o escritor simplesmente não tenha imaginação. É importante lembrar que Edgar Allan Poe foi motivado a investigar e expôr o fraudulento autômato jogador de xadrez de Johann Maezel. Isso porque ele “sabia” que ele tinha que ser fraudulento porque era <em>inconcebível</em> que uma máquina que jogasse xadrez realmente pudesse existir. Não meramente impossível, mas inconcebível! Poe estava errado, e as pessoas que afirmaram que <span class="caps">MVC</span> não poderia ser absorvido em uma linguagem de programação estavam errados também. Desde que dei minha palestra em 2002, muitos sistemas de programação, como <a href="https://www.rubyonrails.org/">Ruby on Rails</a> e <a href="https://subway.python-hosting.com/">Subway</a> deram um passo à frente na tentativa de codificar e integrar <span class="caps">MVC</span> exatamente da maneira como foi sugerida.</p>
<h4>Progresso em linguagens de programação</h4>
<p>Se o movimento de “Design Patterns” tivesse sido popular nos anos 60, seus objetivos teriam sido de treinar programadores para reconhecer situações onde o pattern de “sub-rotina” poderia ser aplicado e para implementá-lo habitualmente quando necessário. Embora isso pudesse ter sido uma grande melhoria sobre não usar sub-rotinas, ainda teria sido muito inferior ao que realmente aconteceu, que foi ter o pattern de “sub-rotina” codificado e integrado em linguagens subsequentes.</p>
<p>Identificação de patterns é um importante fator de progresso em linguagens de programação. Como em toda programação, a idéia é notar quando uma mesma solução está aparecendo repetidamente em diferentes contextos e entender as partes comuns. Isso é admirável e de muito valor. O problema com o movimento de “Design Patterns” é o uso que o pattern é colocado depois: programadores são treinados a identificar e aplicar os patterns onde for possível. Em vez disso, os patterns deveriam ser usados como marcas de falhas na linguagem de programação. Como em toda programação, a identificação de partes comuns deveria ser seguida de um passo de abstração onde essas partes comuns seriam mescladas em uma única solução.</p>
<p>Múltiplas implementações de uma mesma idéia são quase sempre um erro em programação. O local correto para implementar uma solução comum a um problema recorrente de design é na própria linguagem de programação, se possível.</p>
<p>A visão do movimento de “Design Patterns” dita que de alguma forma é inevitável que programadores tenham que implementar Visitors, Abstract Factories, Decorators e Facades. Mas isso não é mais inevitável do que a necessidade de implementar Chamadas de Sub-Rotinas ou Classes Orientadas a Objetos na fonte da linguagem. Esses patterns deveriam ser vistas como defeitos ou funcionalidades que faltam em Java e C++. A melhor resposta para a identificação desses patterns é perguntar quais defeitos nessas linguagens resultam na necessidade de um pattern, e como a linguagem poderia prover um suporte melhor para resolver esse tipo de problema.</p>
<p>Como Design Patterns como usualmente entendidos, você nunca pára de pensar nos patterns depois de encontrá-los. Toda vez que você escreve uma Chamada de Sub-Rotina, precisa pensar na maneira como os registradores são salvos e como o valor de retorno é comunicado. Toda vez que escreve uma Classe Orientada a Objetos, você precisa pensar sobre implementação de heranças.</p>
<p>As pessoas dizem que está tudo bem que Design Patterns ensinem as pessoas a fazer isso, porque o mundo está cheio de programadores que são forçados a usar C++ e Java, e eles precisam de toda ajuda possível para vencer os defeitos nessas linguagens. Se essas pessoas precisam de ajuda, está tudo certo. O problema é com a filosofia do movimento. Ajudar pobres programadores de C++ e Java é admirável, mas esse não deveria ser o objetivo final. Em vez de pensar que o uso dos Design Patters tem valor e parar nisso, deveria ser largamente reconhecido que cada design pattern é uma expressão de uma falha na fonte da linguagem.</p>
<p>Se o movimento de Design Patterns tivesse sido popular nos anos 80, nós nem teríamos C++ ou Java; nós ainda estaríamos implementando Classes Orientadas a Objetos em C com structs e o argumento seria de que como os programadores são forçados a usar C, de qualquer forma, nós deveríamos ajudá-los o máximo que for possível. Mas a maneira de prover a máxima ajuda não foi de treinar pessoas a se habiturem a implementar Classes Orientadas a Objetos quando necessário; mas sim foi desenvolver linguagens como C++ e Java que tinham o pattern construído dentro de si, de forma que os programadores pudessem se concentrar em usar o estilo <span class="caps">OOP</span> em vez de implementá-lo.</p>
<h4>Sumário</h4>
<p>Patterns são sinais de fraquezas nas linguagens de programação.</p>
<p>Quando identificamos e documentamos uma, este não deve ser o fim da história. Em vez disso, nós devemos ter o objetivo de longo prazo de entender como melhorar a linguagem de tal forma que o pattern se torne invisível ou desnecessário.</p>
<p></p>
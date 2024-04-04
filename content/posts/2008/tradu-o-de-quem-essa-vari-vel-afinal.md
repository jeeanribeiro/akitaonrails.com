---
title: "Tradução: De quem é essa variável, afinal?"
date: "2008-02-11T03:13:00.000Z"
tags: ["ruby", "smalltalk", "java", "beginner"]
years: "2008"
---

<p></p>
<div style="float: left; margin: 2px"><a href="http://talklikeaduck.denhaven2.com/articles/2006/07/29/about-me"><img src="http://s3.amazonaws.com/akitaonrails/assets/2008/2/11/Picture_1.png" srcset="http://s3.amazonaws.com/akitaonrails/assets/2008/2/11/Picture_1.png 2x" alt=""></a></div>
<p>Este <a href="http://talklikeaduck.denhaven2.com/articles/2008/02/08/whose-variable-is-it-anyway">artigo</a> sobre variáveis de instância do <strong>Rick DeNatale</strong> é muito fascinante. Na hora que bati o olho nesse texto já queria traduzí-lo. É um texto bastante longo e talvez um pouco difícil para quem não tem muita base sobre compiladores e arquitetura de computadores, mesmo assim vale a pena para ter uma breve introdução ao mundo dos registradores. Mais interessante é ver como Java, Smalltalk e Ruby implementam variáveis de maneiras diferentes e que efeitos isso tem na prática.</p>
<p>Aqui vai a tradução:</p>
<p></p>
<p></p>
<p>Quanto mais penso sobre Ruby em relação a outras linguagens orientadas a objeto com que já trabalhei, mais percebo que existe um continuum de tipagem estática vs. dinâmica.</p>
<p>Ruby se encaixa em uma das pontas desse continuum. Entender isso pode ajudar a entender como melhor usar a linguagem. Eu recentemente dei uma rápida olhada no novo livro de Russ Olsen, <a href="https://www.amazon.com/gp/product/0321490452?ie=UTF8&amp;tag=denhaven2com-20&amp;linkCode=as2&amp;camp=1789&amp;creative=9325&amp;creativeASIN=0321490452">Design Patterns in Ruby</a> e olhei sua seção sobre o pattern Observer. Eu acabei de postar no ruby-talk sobre esse pattern, como ele foi implementado em Smalltalk, e uma implementação mais Rubista. Chegarei nisso ao fim do artigo, mas primeiro eu sinto urgência em falar sobre variáveis de instância.</p>
<p>Se virmos um tipo como uma interpretação particular de um layout de memória, eu vejo algo como isto:</p>
<table>
  <tbody>
    <tr>
      <td><strong>Linguagem</strong></td>
      <td><strong>Lado de Fora</strong></td>
      <td><strong>Lado de Dentro</strong></td>
    </tr>
    <tr>
      <td>Java</td>
      <td>estático</td>
      <td>estático</td>
    </tr>
    <tr>
      <td>Smalltalk</td>
      <td>encapsulado</td>
      <td>estático</td>
    </tr>
    <tr>
      <td>Ruby</td>
      <td>encapsulado</td>
      <td>dinâmico</td>
    </tr>
  </tbody>
</table>
<p>As duas colunas representam como a parte interna do objeto se “parece” do lado de fora do objeto, e dentro do objeto (i.e. dentro de um método) respectivamente.</p>
<p>Em Java, sujeito a modificadores de acesso, variáveis de instância, também chamadas campos, podem ser diretamente acessadas. Nenhum método de acesso é requerido. Em Smalltalk e Ruby, variáveis de instância de um objeto são apenas acessíveis quando executam um dos métodos do objeto. Embora ambas as linguagem forneçam um mecanismo para ultrapassar isso, instance_variable_get e instance_variable_set para Ruby; instVarAt: e instVarAt:put: para Smalltalk, são usados apenas em “emergências” já que eles quebram o encapsulamento do objeto.</p>
<h3>Ligação de Variável de Instância Estática</h3>
<p>Por estático aqui, quero dizer que o código que acessa a variável de instância usa informação que é estaticamente ligada pelo compilador. Essa é uma sutileza que confunde muito os programadores de hoje <a href="https://steve-yegge.blogspot.com/2007/06/rich-programmer-food.html">que não entendem o que um compilador faz</a> que é pegar código-fonte textual, escrito e legível por humanos e transformar isso em bits e bytes que podem ser executados por alguma forma de computador. Os antigos e sábios podem querer saltar esta seção.</p>
<p>Esse computador pode ser um computador real, como um processador Intel ou um computador virtual na forma de software implementando uma máquina virtual ou interpretador. No caso de uma máquina real ou virtual, existe um conjunto de instruções que dá o repertório da máquina. O programa é executado movendo passo-a-passo, instrução por instrução. Agora, se tivermos uma simples expressão em C como:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#0a5;font-weight:bold">int</span> a = b;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Então a seqüência de instruções para um computador imaginário poderia ser como:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>load  reg2, 20(reg1)
store reg2, 40(reg1)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Que carrega o segundo registrador da máquina a partir de uma palavra que está no endereço 20 bytes depois do endereço contido no registrador 1 da máquina, e então armazena esse valor em outro offset de palavra de 40 bytes a partir do registrador 1. Aqui a e b devem ser variáveis locais temporárias, e eu decidi que meu compilador está usando o registrador 1 para apontar ao quadro de pilha de ativação corrente. Esses números mágicos, 20 e 40 são computados pelo compilador como parte de sua função de mapear variáveis a locais de memória.</p>
<p>A idéia que instruções podem ter diferentes comprimentos é bem comum em desenho de conjuntos de instruções. Usualmente alguns números de bits no começo da instrução é usado para codificar um ‘op code’ como load ou store, add ou substract, etc. Outros bits são usados para determinar a presença e formatar os parâmetros da operação. Diferentes conjuntos de instruções tem diferentes modos de endereçamento, o que permite memória ser endereçada em diversas maneiras, como o modo usado acima que endereça memória como offset de um local contido no registrador. Outros modos de endereçamento podem adicionar outro registrador usado como índice de elementos em um array, por exemplo. A maioria dos conjuntos de instruções reais tem alguma unidade de comprimento de instruções, então para uma dada arquitetura, todas as instruções podem ter um ou mais palavras, ou um ou mais bytes.</p>
<h3>Bytecodes são um formato de Conjunto de Instruções</h3>
<p>O termo “bytecode” é simplesmente uma forma particular de um conjunto de instruções, ou mesmo uma família de formas. A maioria das pessoas associam o tempo com Java, e um conjunto particular de instruções, embora o termo seja de antes de Java, sendo usado por Smalltalk e provavelmente ainda antes. Ele realmente significa que as instruções de ‘código de máquina’ são representadas como uma série de bytes. Muitas instruções são codificadas por um único byte, embora alguns precisem de bytes adicionais para formar uma instrução completa. O termo geral bytecode simplesmente significa que a unidade de comprimento para o conjunto de instruções é de um byte.</p>
<p>Embora as implementações de Java e Smalltalk tipicamente usem conjuntos de instruções de bytecodes para suas máquinas virtuais, o conjunto real de bytecodes diferem, tanto quanto conjuntos de instruções para um Intel Core 2 Duo diferente do conjunto de instruções de um PowerPC G4.</p>
<h3>Ligação de Variável de Instância Clássica, no estilo Smalltalk</h3>
<p>Agora vamos olhar a um código similar em Smalltalk. Nesse artigo, estou usando os bytecodes definidos no “Smalltalk: A Linguagem e suas Implementações”, também conhecido como “O Livro Azul”, outras implementações de Smalltalk podem diferir um pouco.</p>
<p>Digamos que a e b aqui são variáveis de instância. O bytecode para o Smalltalk</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>a := b
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>se pareceriam com algo assim:</p>
<macro:code>
  <p>push_iv_4 # empurra a variável de instância</p>
  <ol>
    <li>nr. 4 para a pilha<br>
      store_and_pop_iv_6 # armazena o topo da pilha na</li>
    <li>variável de instância nr. 6</li>
  </ol>
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
        <td class="code"><pre>Em Smalltalk, esses números de índice mágicos usados para acessar variáveis de instância são determinados quando a definição de classe é salva. Nesse caso "b" acaba sendo a 4a. variável de instância, e "a" a 6a. Bytecodes Smalltalk são otimizados para objetos pequenos, as primeiras 16 variáveis de instância podem ser todas empurradas ou puxadas com uma única instrução de um byte, e se um objeto tem mais do que 16 variáveis de instância então eles precisam ser acessados através de uma instrução push ou store extendidas, que permite acessar até 64 variáveis de instância.
Em Smalltalk, embora variáveis de instância não sejam *tipadas*, elas são *declaradas* em uma mensagem de definição de classe executada quando a definição é salva. Toda vez que uma definição de classe é salva, os índices para as variáveis de instância dessa classe, e de qualquer sub-classe são (re)computadas, e quaisquer métodos na classe e sub-classes são recompilados para ajustar os offsets. As variáveis de instância definidas na classe mais ao topo recebem os primeiros n offsets, cada sub-classe imediata recebem offsets seqüenciais começando com a próxima disponível, e assim por diante.
Isso é porque eu disse acima que dentro de um objeto Smalltalk, ou seja, dentro de seus métodos, o objeto é mapeado estaticamente. Mudar a definição das variáveis de instância requerem recompilação para evitar "erros de tipos" nos métodos.
Note que aqueles métodos "apenas para emergências" instVarAt: e instVarAt:put: mapeiam para bytecodes push_iv e store_and_pop_iv, o primeiro argumento para ambas é o índice da variável de instância. Isso também significa que elas precisam ser usadas com cuidado, já que você precisa saber o offset da variável de instância. Agora, pelo menos Smalltalk pode lhe dizer se tentar acessar um slot de variável de instância que não existe mas ele não pode lhe dizer que está acessando o slot *errado*.
h3. Ligação de Campo de Java
Em Java, offsets não são compilados diretamente nos bytecodes, existe um nível de indireção. Peter Haggar, com quem trabalhei na IBM escreveu um "artigo sobre bytecodes Java":https://www.ibm.com/developerworks/ibm/library/it-haggar_bytecode/ na developerWorks. Espero que ele não se incomode se eu pegar emprestado um de seus exemplos. Aqui vai um simples método de acesso:
--- java
public String employeeName() {
        return name;
}
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>E os bytecodes resultantes. (O 0, 1 e 4 são offsets a partir do começo do método)</p>
  <table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
        </td>
        <td class="code"><pre>Method java.lang.String employeeName()
0 aload_0
1 getfield #5 &lt;Field java.lang.String name&gt;
4 areturn
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>O que esse código faz primeiro é empurrar a referência do objeto corrente <strong>this</strong>, para a pilha. Então a instrução getfield usa seu operando para substituir os dois ítems mais ao topo da pilha com o valor do campo. Então esses dois bytecodes (na realidade 3 bytes no total) são mais ou menos equivalentes ao bytecode push_iv do Smalltalk, com apenas duas diferenças:</p>
  <ol>
    <li>O opcode push_iv do Smalltalk implicitamente usa o receptor do método corrente, ao passo que o opcode getfield precisa de outro argumento referenciando o objeto que tem a variável de instância sendo acessada</li>
    <li>No Smalltalk o argumento identificando a variável é um índice inteiro, mas em Java o argumento é na realidade uma referência a um descritor de campo associado com a classe do objeto cuja variável de instância está sendo referenciada.</li>
  </ol>
  <p>A primeira diferença é porque em Java, ao contrário de Smalltalk, você pode diretamente ler e escrever (get e set) campos públicos fora dos métodos do objeto, então já que o objeto em questão não está implícito, ele precisa ser especificado.</p>
  <p>A segunda diferença é permitir uma compilação separada. A especificação da <span class="caps">JVM</span> não dita como campos são mapeados dentro de objetos, mas a abstração é permitir que esse mapeamento seja ajustado no momento em que classes são carregadas. Se uma sub-classe é compilada separadamente de sua superclasse, ele pode receber uma nova posição de início para seus campos toda vez que é carregada se sua superclasse adicionou ou removeu campos.</p>
  <p>Então, para poder acessar campos em Java, o compilador precisa saber o tipo do objeto contendo o campo. Isso é verdade estando dentro ou fora de um método.</p>
  <h3>Variáveis de Instância, no Jeito Ruby</h3>
  <p>Em Ruby, variáveis de instância não são declaradas, então offsets não podem ser assinaladas estaticamente. Em vez disso, Ruby as procura dinamicamente, usando <strong>nomes</strong> de variáveis de instância em vez de um offset. Novamente isso bate com as mensagens de ‘uso de emergência’. instance_variable_get e instance_variable_set recebem um nome de variável de instância, completo com o sinal de ‘@’, onde os métodos instVarAt: recebem um inteiro.</p>
  <p>Em Ruby 1.8, essa procura é implementada de maneira razoavelmente direta. Com poucas exceções, que não vou detalhar aqui, um objeto Ruby tem um ponteiro nomeado iv_tbl que aponta para uma tabela hash que mapeia os nomes das variáveis de instância a valores. Em Ruby 1.9, a implementação é um pouco mais esperta, mas os efeitos são os mesmos.</p>
  <h3>Então que variáveis São elas afinal?</h3>
  <p>O que nos leva de volta ao título do artigo. Em Java e Smalltalk, cada instância de uma dada classe tem os mesmos conjuntos de variáveis de instância, embora cada qual com seu próprio valor. As variáveis vêm à existência quando são declaradas, e a classe é compilada ou a definição é salva.</p>
  <p>Uma coisa que não mencionei na discussão de Smalltalk é que, por causa da maneira tradicional onde implementações Smalltalk não separam ambiente de desenvolvimento do ambiente de run-time, quando uma definição de classe muda, além de necessitar da recompilação do método para a classe e suas sub-classes, quaisquer variáveis de instância precisam ser mutadas para ou adicionar ou remover as variáveis modificadas.</p>
  <p>Lá atrás, quando ele estava trabalhando na linguagem Self, que tem resolução dinâmica de variáveis de instância como Ruby, Dave Ungar costumava gostar de matar várias implementações de Smalltalk adicionando uma variáveis de instância da classe Object. O problema é que como estamos tentando operar em um sistema vivo, o sistema normalmente tropeça em si mesmo durante esse tipo de operação. Eu tentei isso algumas semanas atrás com Squeak, e embora ele tenha me alertado duas vezes que eu não deveria fazer isso, ele tentou ir em frente depois que cliquei aquele segundo botão “Você tem certeza?”, e ele deu crash rapidamente. Ruby trata isso como uma coisa de curso, já que variáveis de instância são apenas adicionadas a objetos individuais quando são necessárias, e Self dentro de um método realmente é duck-typed, na verdade mais do que duck-typed, já que variáveis de instância necessárias aparecem instantaneamente.</p>
  <h3>Então você menciona o Pattern Observer. O que isso tudo tem a ver com aquilo?</h3>
  <p>Uma das coisas que me deixou pensando sobre isso novamente foi uma conversa no ruby-talk algumas semanas atrás sobre garbage collection no Ruby e algumas das coisas que não deixavam um Object ser considerado lixo e ser coletado. O GC do Ruby tende a ter problemas se você usa finalização e não é <strong>realmente</strong> cuidadoso sobre como define seus finalizadores.</p>
  <p>Um dos truques clássicos em Smalltalk nessa veia é a implementação de dependência de Objects, também chamado de, o Pattern Observer. Smalltalk fornece um mecanismo para adicionar objetos dependentes a qualquer objeto que, quando quer notificar seus dependentes que ele mudou, pode simplesmente uma mensagem de mudança a si mesmo, que por sua vez envia a atualização de mensagem a cada objeto dependente: com o objeto modificado como o argumento.</p>
  <p>Essa é a base para o design de Model View Controller em Smalltalk. Views se registram como dependentes dos Models, e quando um Model muda, quaisquer Views dependentes dele podem reagir. Essa é a gênese do pattern Observer do <a href="https://www.amazon.com/gp/product/0201633612?ie=UTF8&amp;tag=denhaven2com-20&amp;linkCode=as2&amp;camp=1789&amp;creative=9325&amp;creativeASIN=0201633612">bem conhecido livro de Design Patterns da Gang of Four</a> onde Model e View foram generalizados a Subject e Observer, respectivamente.</p>
  <p>Em Smalltalk a habilidade de gerenciar uma lista de dependentes e notificá-los de mudanças é algo que todo objeto pode fazer, mas muito poucos realmente usam essa capacidade. Para evitar ter uma variável de instância em todo objeto Smalltalk referenciar uma coleção de dependentes que está quase vazia, a implementação padrão realmente mantém um hash global que mapeia objetos com dependentes à sua coleção de dependentes.</p>
  <p>O problema com essa implementação padrão é que uma vez que um objeto ganha um dependente, o objeto e seus objetos dependentes estão permanentemente acessíveis e, portanto, inelegíveis para garbage collection, a menos que a dependência seja explicitamente removida. Como resultado disso, as classes da maioria dos objetos que realmente <strong>tem</strong> dependentes reimplementam os métodos padrão para se referir a coleções de dependentes via um valor de instância no objeto com dependentes. Squeak, por exemplo, fornece uma subclasse de objetos chamada Model que fornece esse tipo de implementação amigável a GC.</p>
  <p>O que me leva à implementação do pattern observer em Ruby. Em sua discussão desse pattern em seu livro, Russ Olsen fornece um módulo que pode ser misturado (mixed) em um objeto para permitir que ele tenha dependentes:</p>
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
        <td class="code"><pre><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Subject</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>
    <span style="color:#33B">@observers</span> = []
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">add_observer</span>(&amp;observer)
    <span style="color:#33B">@observers</span> &lt;&lt; observer
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">delete_observer</span>(observer)
    <span style="color:#33B">@observers</span>.delete(observer)
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">notify_observers</span>
    <span style="color:#33B">@observers</span>.each <span style="color:#080;font-weight:bold">do</span> |observer|
      observer.call(<span style="color:#069">self</span>)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Esse é um bom exemplo do pattern em Ruby, onde os Observers podem ser blocos, ou qualquer objeto que responda ao método ‘call’ e que leve o Subject como seu argumento.</p>
  <p>Pouco antes de ver o livro, como resultado da conversa sobre GC, eu escrevi minha própria variação disso, que deixa qualquer objeto ser um subject, abrindo a classe Object:</p>
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
        <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Object</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">add_observer</span>(&amp;observer)
      (<span style="color:#33B">@observers</span> ||= []) &lt;&lt; observer
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">delete_observer</span>(observer)
      observers.delete(observer)
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">notify_observers</span>
      observers.each <span style="color:#080;font-weight:bold">do</span> |observer|
        observer.call(<span style="color:#069">self</span>)
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
    private
    <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">observers</span>
      <span style="color:#33B">@observers</span> || []
    <span style="color:#080;font-weight:bold">end</span> 
<span style="color:#080;font-weight:bold">end</span>
</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Por causa do fato que Ruby apenas adiciona variáveis de instância <em>on the fly</em> quando necessário, ganhamos o benefício de suporte universal a objetos serem Subjects sem requerer uma variável de instância de observers para os objetos que não precisam disso. O único custo é a potencial colisão de namespace para os quatro nomes de métodos.</p>
  <h3>Outro uso de variáveis de instância dinâmicas</h3>
  <p>Recentemente escrevi um <a href="https://www.infoq.com/news/2008/01/rails-resource-controller">artigo para a InfoQ</a> sobre <a href="https://jamesgolick.com/resource_controller">o plugin resource_controller de James Golick para Rails</a> que lhe permite escrever controllers de Rails para recursos Restful que podem automaticamente se adaptar a uso em diferentes contextos de aninhamento de recursos. Esse plugin faz bom uso da natureza dinâmica das variáveis de instância do Ruby, automaticamente definindo diferentes variáveis de instância no controller para corresponder ao recurso final e cada um de seus recursos pais.</p>
  <h3>Ufa!</h3>
  <p>Isso acabou virando um artigo bem longo, que eu queria escrever havia algum tempo. Espero que alguém ache isso útil, ou pelo menos interessante.</p>
  <p></p>
  <h4>tags: <span class="label label-important"><a href="/learning">learning</a></span> <span class="label label-important"><a href="/ruby">ruby</a></span> <span class="label label-important"><a href="/smalltalk">smalltalk</a></span> <span class="label label-important"><a href="/java">java</a></span> <span class="label label-important"><a href="/beginner">beginner</a></span></h4>
</macro:code>
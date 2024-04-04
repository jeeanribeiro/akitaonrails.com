---
title: "[Objective-C] Brincando com Categorias e Blocos"
date: "2010-11-28T20:58:00.000Z"
tags: ["beginner", "apple", "objective-c"]
years: "2010"
---

<p></p>
<p>Continuando meus estudos com Objective-C, existem algumas funcionalidades que me deixam realmente surpreso. Duas delas são Categorias e Blocos.</p>
<p>Para facilitar, vamos ver um código Ruby para dar um exemplo do que quero fazer:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Array</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">each_element</span>
    <span style="color:#080;font-weight:bold">for</span> elem <span style="color:#080;font-weight:bold">in</span> <span style="color:#069">self</span>
      <span style="color:#080;font-weight:bold">yield</span>(elem)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sabemos que em Ruby, todas as classes podem ser abertas e extendidas, incluindo classes padrão da linguagem como Array ou String. Isso permite extender a própria linguagem e é o que o pacote ActiveSupport do Rails faz, ao adicionar métodos como <tt>#days</tt> à classe <tt>Fixnum</tt>, permitindo operações como <tt>2.days – 1.day</tt>, por exemplo.</p>
<p>Em linguagens como Java isso não é possível porque as classes são fechadas, e inclusive muitas delas são <em>finals</em> o que impedem criar sub-classes a partir delas. Por exemplo, não se pode criar uma classe herdando de <tt>String</tt>. Isso acaba dando origem a muitas classes acessórias como <tt><a href="http://commons.apache.org/lang/api-2.5/org/apache/commons/lang/StringUtils.html">StringUtils</a></tt>, o que eu acho particularmente não elegante.</p>
<p>No exemplo acima, reabri a classe padrão <tt>Array</tt> do Ruby e fiz minha própria versão do método <tt>each</tt>, que já existe, chamando-o de <tt>each_element</tt> somente com objetivos didáticos para este artigo. Agora podemos pegar um array normal e chamar esse método nele:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>list = [<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">b</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">c</span><span style="color:#710">"</span></span>]
list.each_element <span style="color:#080;font-weight:bold">do</span> |elem|
  puts elem
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Mais do que extender classes, o Ruby possui outra funcionalidade muito flexível chamada blocos ou closures/fechamentos (eu já escrevi sobre <a href="http://rubylearning.com/blog/2007/11/30/akitaonrails-on-anatomy-of-ruby-blocksclosures/">blocos e closures</a> antes pra RubyLearning. Sugiro ler para entender o conceito)</p>
<p>Essas são duas funcionalidades que muitos poderiam imaginar que só seriam possíveis em linguagens altamente dinâmicas como Ruby, Python ou Smalltalk. Já Objective-C é uma extensão da linguagem C, algo considerado por muitos como tão baixo nível que nem se imaginariam ser possível. Será?</p>
<p></p>
<p></p>
<h2>Categorias</h2>
<p>O Objective-C tem uma funcionalidade chamada <a href="https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjectiveC/Articles/ocCategories.html%23//apple_ref/doc/uid/TP30001163-CH20-SW1">Categories</a>. Essencialmente isso permite “reabrir” classes já existentes e extendê-las com mais métodos.</p>
<p>Na minha interpretação o Obj-C, assim como Ruby, são linguagens orientadas a objeto mas, mais importante, eu diria que elas são <strong>orientadas a protocolo</strong>. Em vez de pensar em interfaces estáticas e “chamar um método” o correto é pensar em “enviar mensagens”. Protocolos definem quais mensagens o objeto sabe responder. A diferença é que você não busca uma coerência em tempo de compilação mas sim em tempo de execução. Você pode mandar mensagens que o objeto não entende se quiser sem receber um erro de compilação.</p>
<p>Uma convenção de nomenclatura que podemos usar é criar o arquivo header e a implementação usando o nome da classe a ser extendida, o símbolo “+”, e o nome da Categoria que queremos implementar. Por exemplo, digamos que eu queira a mesma funcionalidade do método <tt>each</tt> de Array do Ruby no equivalente <tt>NSArray</tt> do Obj-C, podemos fazer assim:</p>
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
      <td class="code"><pre><span style="color:#777">// NSArray+functional.h</span>
<span style="color:#F00;background-color:#FAA">@</span>interface NSArray (functional)
- (<span style="color:#088;font-weight:bold">void</span>) each:(<span style="color:#088;font-weight:bold">void</span> (^) (id))block;
<span style="color:#F00;background-color:#FAA">@</span>end
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E a implementação seria:</p>
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
      <td class="code"><pre><span style="color:#777">// NSArray+functional.m</span>
<span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">NSArray+functional.h</span><span style="color:#710">"</span></span>
<span style="color:#F00;background-color:#FAA">@</span>implementation NSArray (functional)
- (<span style="color:#088;font-weight:bold">void</span>) each:(<span style="color:#088;font-weight:bold">void</span> (^) (id))block {
    <span style="color:#0a5;font-weight:bold">int</span> i;
    <span style="color:#080;font-weight:bold">for</span> (i = <span style="color:#00D">0</span>; i &lt; [self count]; i ++) {
        block([self objectAtIndex:i]);
    }
}
<span style="color:#F00;background-color:#FAA">@</span>end
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A sintaxe é exatamente a mesma se estivéssemos definindo uma nova classe, mas neste caso declaramos o mesmo nome da classe que já existe <tt>NSArray</tt> e entre parênteses colocamos o nome da nossa categoria que, neste caso, chamei arbitrariamente de “functional” para ter diversos métodos funcionais.</p>
<p>Categorias não podem ter variáveis de instância entre chaves na declaração da interface, ela só pode comportar novos métodos, por isso falei que não era não flexível, mas isso já seria o bastante.</p>
<p>Essa funcionalidade pode ser usada principalmente para duas coisas: substituir a necessidade de criar sub-classes e, com isso, evitar usar herança sempre que possível e que fizer sentido; e a outra é quebrar classes com implementações muito grande em múltiplos arquivos de forma a melhor organizar os arquivos do projeto.</p>
<h2>Blocos</h2>
<p>Como vocês devem ter suspeitado, implementar o método <tt>each</tt> semelhante ao Ruby significa que deveríamos poder usar blocos. E o Obj-C também permite blocos, na forma de métodos anônimos (sem nome).</p>
<p>O parâmetro que implementamos é <tt>(void (^) (id))block</tt>. “block” é o nome da variável que vai receber o bloco. Seu tipo é de retorno “void” e parâmetro “id”. O “^” é o “nome” do bloco, no caso, sem nome algum, ou anônimo. Tendo em mãos o bloco podemos executá-la assim: <tt>block([self objectAtIndex:i])</tt>. O tipo <tt>id</tt> em Obj-C é um tipo genérico que denota um objeto arbitrário. Ele é usado por todo o framework Cocoa e seria, mais ou menos, o equivalente a dizer que o método recebe qualquer tipo de objeto.</p>
<p>E como podemos usar essa nova categoria com o novo método? Vejamos:</p>
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
      <td class="code"><pre><span style="color:#579">#import</span> <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">NSArray+functional.h</span><span style="color:#710">"</span></span>
- (IBAction) foo:(id)sender {    
  NSMutableArray *list = [NSMutableArray arrayWithObjects:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">a</span><span style="color:#710">"</span></span>, <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">b</span><span style="color:#710">"</span></span>, <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">c</span><span style="color:#710">"</span></span>, nil ];
  NSString *msg = <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">elemento: %@</span><span style="color:#710">"</span></span>;
  [list each:^(id obj) {
      NSLog(msg, obj); 
  }];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No caso, faça de conta que estamos numa aplicação de iPhone ou Mac, por isso criei um método que retorna <tt>IBAction</tt>. Para quem não sabe, <tt>IBAction</tt> é a mesma coisa que <tt>void</tt>, ou seja, que o método não retorna nada. A diferença é que o Interface Builder reconhece métodos que retornam <tt>IBAction</tt> como métodos que podem ser ligados diretamente a ações de um elemento visual na tela, por exemplo.</p>
<p>No corpo do método começamos criando um <tt>NSMutableArray</tt>. Fiz isso de propósito porque essa classe herda de <tt>NSArray</tt> e, portanto, também herdará o novo método <tt>each</tt> que implementamos.</p>
<p>Agora a parte importante é como chamamos o método nesse objeto: <tt>[list each:^(id obj) { … }]</tt>. Ou seja, estamos enviando a mensagem <tt>each</tt> ao objeto <tt>list</tt> passando como parâmetro um bloco anônimo “^” que tem parâmetro <tt>id obj</tt>. Se você não conhece blocos de Ruby ou de outra linguagem como Lisp, pode ser difícil entender o que está acontecendo, por isso recomendo novamente ler meu artigo sobre <a href="https://rubylearning.com/blog/2007/11/30/akitaonrails-on-anatomy-of-ruby-blocksclosures/">blocos</a> antes.</p>
<p>Note que dentro do bloco o <tt>NSLog</tt> está usando a string <tt>msg</tt> que foi criada fora do bloco, exatamente como eu poderia fazer em Ruby, o bloco tem conhecimento do ambiente ao seu redor e eu posso usar variáveis criadas fora do bloco. Isso é uma das coisas que torna essa funcionalidade de blocos diferente de um simples “delegate” ou simplesmente passar um ponteiro de uma função.</p>
<p>Em Ruby, eu posso capturar um bloco em uma variável, assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>bloco = lambda { |a| puts a }
bloco.call(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla</span><span style="color:#710">"</span></span>)
<span style="color:#777"># =&gt; "bla"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No exemplo acima, criamos um bloco e em seguida executamos esse bloco usando o método <tt>call</tt>. Em Obj-C podemos fazer algo similar assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#088;font-weight:bold">void</span> (^bloco)(NSString*) = ^(NSString* msg) {
  NSLog(msg);
};
bloco(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">bla</span><span style="color:#710">"</span></span>);
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja que é muito parecido só que precisamos declarar os tipos. Na primeira linha definimos uma variável do tipo bloco, com o nome de “bloco” (o nome vem logo depois do “^”). Antes do nome temos o tipo de retorno, <tt>void</tt>, e depois o tipo do parâmetro que ele aceita, ponteiro de <tt>NSString</tt>. Daí criamos o bloco propriamente dito.</p>
<p>Em seguida basta chamar o bloco como se fosse uma função normal de C, usando a notação de passar parâmetros entre parênteses.</p>
<h2>Conclusão</h2>
<p>Categorias e Blocos podem ajudar muito a tornar a programação em Obj-C mais flexível e mais próxima dos conceitos de linguagens mais dinâmicas como Ruby. Como exercício que tal completar a minha Categoria <tt>NSArray+functional.h</tt> e acrescentar métodos como <tt>select</tt>, <tt>map</tt>, <tt>sort</tt>, etc? Coloquem links para <a href="https://gist.github.com">Gist</a> nos comentários com sugestões de implementação.</p>
<p>Para aprender mais sobre blocos, recomendo ler:</p>
<ul>
  <li><a href="https://pragmaticstudio.com/blog/2010/7/28/ios4-blocks-1">Using Blocks in iOS 4: The Basics</a></li>
  <li><a href="https://pragmaticstudio.com/blog/2010/9/15/ios4-blocks-2">Using Blocks in iOS 4: Designing with Blocks</a></li>
</ul>
<p></p>
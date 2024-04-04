---
title: "[Objective-C] Method Missing!"
date: "2010-12-06T04:55:00.000Z"
tags: ["beginner", "apple", "objective-c"]
years: "2010"
---

<p></p>
<p><strong>Obs:</strong> Código disponível no <a href="https://github.com/akitaonrails/ObjC_XmlBuilder">Github</a></p>
<p>Uma das funcionalidades mais interessantes do Ruby é sem dúvida o famoso <tt>method_missing</tt>. Graças a ele podemos enviar mensagens arbitrárias a um objeto e ainda assim fazer com que responda como queremos. Por exemplo, o seguinte código dará uma exceção:</p>
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
      <td class="code"><pre>&gt; obj = <span style="color:#036;font-weight:bold">Object</span>.new
 =&gt; <span style="color:#777">#&lt;Object:0x0000010092ac60&gt; </span>
&gt; obj.foo
<span style="color:#036;font-weight:bold">NoMethodError</span>: undefined method <span style="background-color:hsla(120,100%,50%,0.06)"><span style="color:#161">`</span><span style="color:#2B2">foo' for #&lt;Object:0x0000010092ac60&gt;
        from (irb):2
        from /Users/akitaonrails/.rvm/rubies/ruby-1.9.2-p0/bin/irb:17:in </span><span style="color:#161">`</span></span>&lt;main&gt;<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, podemos redefinir o método <tt>method_missing</tt> do <tt>Object</tt> e veja o que acontece:</p>
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
      <td class="code"><pre>&gt; <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">method_missing</span>(method, *args)
&gt;   <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>method<span style="font-weight:bold;color:#666">}</span></span><span style="color:#D20">:</span><span style="background-color:hsla(0,0%,0%,0.07);color:black"><span style="font-weight:bold;color:#666">#{</span>args.size<span style="font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>
&gt; <span style="color:#080;font-weight:bold">end</span>
&gt; obj.foo
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo:0</span><span style="color:#710">"</span></span>
&gt; obj.foo(<span style="color:#00D">1</span>,<span style="color:#00D">2</span>,<span style="color:#00D">3</span>)
=&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">foo:3</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este foi um resumo rápido, recomendo que se ainda não estiver familiarizado com esse conceito leia meu <a href="/2008/11/10/micro-tutorial-de-ruby-parte-ii">Micro-Tutorial de Ruby – Parte II</a> onde eu explico isso em mais detalhes.</p>
<p>Um exemplo que gosto de usar é a classe Builder::XmlMarkup. Diferente de plataformas que fazem ou concatenação manual de Strings (péssimo) ou manipulação burocrática de nós (<span class="caps">DOM</span>), em Ruby temos essa excelente classe que minimiza a quantidade de código e ao mesmo tempo gera <span class="caps">XML</span> bem formatado e válido. Este é um exemplo:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">builder</span><span style="color:#710">'</span></span>
x = <span style="color:#036;font-weight:bold">Builder</span>::<span style="color:#036;font-weight:bold">XmlMarkup</span>.new(<span style="color:#A60">:target</span> =&gt; <span style="color:#d70">$stdout</span>, <span style="color:#A60">:indent</span> =&gt; <span style="color:#00D">1</span>)
x.html <span style="color:#080;font-weight:bold">do</span> |h|
  h.body <span style="color:#080;font-weight:bold">do</span> |b|
    b.h1 <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>
    b.p <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">This is a paragraph.</span><span style="color:#710">"</span></span>
    b.table <span style="color:#080;font-weight:bold">do</span> |t|
      t.tr <span style="color:#080;font-weight:bold">do</span> |tr|
        tr.td <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">column</span><span style="color:#710">"</span></span>
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse código irá gerar diretamente este <span class="caps">XML</span>:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;html&gt;</span>
 <span style="color:#070">&lt;body&gt;</span>
  <span style="color:#070">&lt;h1&gt;</span>Hello World<span style="color:#070">&lt;/h1&gt;</span>
  <span style="color:#070">&lt;p&gt;</span>This is a paragraph.<span style="color:#070">&lt;/p&gt;</span>
  <span style="color:#070">&lt;table&gt;</span>
   <span style="color:#070">&lt;tr&gt;</span>
    <span style="color:#070">&lt;td&gt;</span>column<span style="color:#070">&lt;/td&gt;</span>
   <span style="color:#070">&lt;/tr&gt;</span>
  <span style="color:#070">&lt;/table&gt;</span>
 <span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se nunca tinha visto isso, pare por um segundo e contemple a beleza desta <span class="caps">API</span>. A partir do objeto XmlMarkup enviamos mensagens como <tt>html</tt> e ele vai acumulando as tags. Usamos blocos exatamente para blocos de <span class="caps">XML</span>, garantindo que eles terão as tags corretas de fechamento.</p>
<p>Pensando nisso, resolvi tentar fazer algo semelhante em Objective-C. A funcionalidade que permite esse tipo de <span class="caps">API</span> no Ruby é o <tt>method_missing</tt>, algo que imaginamos que somente linguagens dinâmicas conseguem ter. Porém, ao final deste artigo, quero fazer este código funcionar:</p>
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
      <td class="code"><pre>XmlBuilder* xml = [[XmlBuilder alloc] init];
[xml htmlBlock:^(XmlBuilder* h) {
    [h bodyBlock:^(XmlBuilder* b) {
        [b h1:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>];
        [b p:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">This is a paragraph.</span><span style="color:#710">"</span></span>];
        [b tableBlock:^(XmlBuilder* t) {
            [t trBlock:^(XmlBuilder* tr) {
                [tr td:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">column</span><span style="color:#710">"</span></span>];
            }];
        }];            
    }];
}];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É bem mais <em>verbose</em> do que Ruby, obviamente, mas ainda assim bem mais interessante do que o jeito de manipular DOMs com métodos como <tt>createElement</tt>, <tt>appendElement</tt>, etc. De uma certa maneira dá pra ficar bastante semelhante à versão em Ruby. Mas como isso é possível?</p>
<p>Antes de continuar, leia meu artigo sobre <a href="/2010/11/28/objective-c-brincando-com-categorias-e-blocos">Categorias e Blocos</a> pois este artigo usará blocos.</p>
<p></p>
<p></p>
<h2>Seletores</h2>
<p>Recapitulando, em Ruby, quando chamamos um método de um objeto, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>obj.foo(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Na realidade podemos dizer que estamos <em>“enviando a mensagem :foo ao objeto ‘obj’”</em> ou seja, seria o mesmo que:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>obj.send(<span style="color:#A60">:foo</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em Obj-C temos algo semelhante. Quando fazemos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>[obj foo:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Seria o equivalente a fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>[obj performSelector:<span style="color:#F00;background-color:#FAA">@</span>selector(foo:) withObject:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A diferença é que em Ruby temos Symbols e em Obj-C temos <a href="https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjectiveC/Articles/ocSelectors.html">Selectors</a>, que é semelhante, uma forma de não desperdiçar espaço com Strings. Porém, selectores são mais do que apenas métodos: eles representam o nome do método e seus atributos que em Obj-C são nomeados. Por exemplo, um método <tt>foo</tt>, com dois argumentos, poderia ser assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>- (<span style="color:#088;font-weight:bold">void</span>) foo:(NSString*)bar value:(NSString*)xyz;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse método seria enviado ao objeto assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>[obj foo:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello</span><span style="color:#710">"</span></span> value:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">World</span><span style="color:#710">"</span></span>];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E seu seletor seria assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>SEL t = <span style="color:#F00;background-color:#FAA">@</span>selector(foo:value:);
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se o método tivesse apenas o primeiro argumento (que não tem nome), o seletor seria assim: <tt>foo:</tt> – note o “:” no final. Se não tiver nenhum argumento, não tem nenhum “:”. Isso é importante não confundir. Alguns erros podem passar em branco pela falta desse “:” na hora de montar o seletor.</p>
<p>Agora, quando se envia uma mensagem a um objeto e o método correspondente não está implementado, o Obj-C fará duas coisas: primeiro vai chamar o método <tt>methodSignatureForSelector:</tt>, que devolve um objeto <tt><a href="https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/NSMethodSignature_Class/Reference/Reference.html%23//apple_ref/doc/c_ref/NSMethodSignature">NSMethodSignature</a></tt>. Em seguida vai criar um objeto <tt><a href="https://developer.apple.com/library/mac/#documentation/Cocoa/Reference/Foundation/Classes/NSInvocation_Class/Reference/Reference.html">NSInvocation</a></tt> a partir disso e passará como argumento ao método <tt>forwardInvocation:</tt>. Este último é quem mais ou menos faz o papel do <tt>method_missing</tt> de Ruby.</p>
<p>Na realidade, em Obj-C essa técnica é chamada de <a href="https://developer.apple.com/library/mac/#documentation/Cocoa/Conceptual/ObjCRuntimeGuide/Articles/ocrtForwarding.html">Message Forwarding</a>. O objetivo na realidade é criar objetos que são Proxy para outros objetos. Nesse caso o framework facilita as coisas para passar mensagens que realmente existem no objeto de destino.</p>
<p>O pseudo-código seria mais ou menos assim:</p>
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
      <td class="code"><pre>- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector {
    <span style="color:#080;font-weight:bold">return</span> [anotherObject methodSignatureForSelector:aSelector];
}
- (<span style="color:#088;font-weight:bold">void</span>)forwardInvocation:(NSInvocation *)anInvocation {
    [anotherObject performSelector:[anInvocation selector]];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Os métodos são chamados nessa sequência mesmo. No primeiro ele consegue a assinatura do método no objeto destino com o método <tt>methodSignatureForSelector</tt>. A assinatura é um array que representa o tipo do valor de retorno e os tipos dos argumentos. Essa assinatura é usada em conjunto com o seletor para criar o <tt>NSInvocation</tt>. Daí no segundo método o seletor é enviado ao objeto de destino, sendo assim executado.</p>
<p>Se precisar criar Proxies ou Adapters, esse é o padrão para fazê-lo.</p>
<h2>Proxy Dinâmico</h2>
<p>O problema é que o padrão anterior pressupõe que o objeto de destino possui os métodos definidos a partir dos quais podemos extrair suas assinaturas. Porém, no nosso caso queremos um objeto que aceite qualquer tipo de mensagem representando tags arbitrários de um <span class="caps">XML</span>.</p>
<p>Para começar, quero definir uma classe chamada <tt>XmlBuilder</tt> e as variáveis internas que vão acumular o <span class="caps">XML</span> e controlar o nível de indentação:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#579">#import</span> &lt;Foundation/Foundation.h&gt;
<span style="color:#F00;background-color:#FAA">@</span>interface XmlBuilder : NSObject
{
    NSMutableString* buffer;
    <span style="color:#0a5;font-weight:bold">int</span> indentationLevel;
}
<span style="color:#F00;background-color:#FAA">@</span>property (retain) NSMutableString* buffer;
<span style="color:#F00;background-color:#FAA">@</span>property (assign) <span style="color:#0a5;font-weight:bold">int</span> indentationLevel;
<span style="color:#F00;background-color:#FAA">@</span>end
<span style="color:#F00;background-color:#FAA">@</span>implementation XmlBuilder
<span style="color:#F00;background-color:#FAA">@</span>synthesize buffer, indentationLevel;
- (id) init {
    self = [super init];
    <span style="color:#080;font-weight:bold">if</span> (self) {
        self.buffer = [[NSMutableString alloc] init];
        self.indentationLevel = <span style="color:#00D">0</span>;
    }
    <span style="color:#080;font-weight:bold">return</span> self;
}
- (<span style="color:#088;font-weight:bold">void</span>) dealloc {
    [buffer release];
    [super dealloc];
}
...
<span style="color:#F00;background-color:#FAA">@</span>end
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Até aqui nada de mais, apenas definição de interface, implementação, propriedades, construtor e destrutor. Coisa padrão.</p>
<p>Agora a coisa começa a esquentar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>- (NSMethodSignature *)methodSignatureForSelector:(SEL)aSelector {
    <span style="color:#777">// não importa o retorno porque não vamos usar essa assinatura</span>
    <span style="color:#080;font-weight:bold">return</span> [NSMethodSignature signatureWithObjCTypes:<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">v@:@</span><span style="color:#710">"</span></span>];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esta primeira versão de implementação não precisa se preocupar com a assinatura. Vamos usar uma convenção para extrair os argumentos e não precisamos de assinaturas, então apenas devolvemos uma genérica qualquer.</p>
<p>Para começar, quero entender mensagens mais ou menos desse tipo:</p>
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
      <td class="code"><pre><span style="color:#777">/*
 Convenção para métodos dinâmicos:
 - (id) entity:(NSString*)value;
 - (id) entityBlock:(id (^)(id))block;
 */</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, mensagens assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>[xml p:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>];
[xml tableBlock:^(XmlBuilder* t) { ... }];
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, vamos definir o método principal:</p>
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
      <td class="code"><pre>- (<span style="color:#088;font-weight:bold">void</span>)forwardInvocation:(NSInvocation *)anInvocation {
    <span style="color:#777">// #1</span>
    NSString* method = NSStringFromSelector([anInvocation selector]);
    <span style="color:#777">// #2</span>
    BOOL hasBlock = [method hasSuffix:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Block:</span><span style="color:#710">"</span></span>];
    method = [method stringByReplacingOccurrencesOfString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Block</span><span style="color:#710">"</span></span> 
                                               withString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>];
    method = [method stringByReplacingOccurrencesOfString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">:</span><span style="color:#710">"</span></span> 
                                               withString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>];
    <span style="color:#777">// #3</span>
    <span style="color:#0a5;font-weight:bold">int</span> tabsLength = self.indentationLevel * <span style="color:#00D">2</span>;
    NSMutableString* tabs = [NSMutableString stringWithCapacity:tabsLength];
    <span style="color:#0a5;font-weight:bold">int</span> i;
    <span style="color:#080;font-weight:bold">for</span> ( i = <span style="color:#00D">0</span> ; i &lt; tabsLength; i ++ ) {
        [tabs appendString:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20"> </span><span style="color:#710">"</span></span>];
    }
    ...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vamos ver até a metade do método:</p>
<ol>
  <li>Primeiro extraímos o nome do seletor em forma de String para conseguirmos manipulá-lo</li>
  <li>Nesta primeira versão, por convenção, assumimos que se seletor terminar com “Block:” significa que receberemos um bloco como argumento. Em seguida limpamos isso no nome do seletor para ficar só o nome da tag. Por exemplo: “htmlBlock:” ficaria “html” apenas. Eu faço isso porque ainda não aprendi a identificar o tipo do argumento recebido, pois se eu puder identificar que recebi um bloco, não preciso da convenção (fica como um <span class="caps">TODO</span>).</li>
  <li>Aqui geramos uma String com espaços em branco representando o nível de identação atual do <span class="caps">XML</span>, para que o resultado final esteja bonito.</li>
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
<a href="#n18" name="n18">18</a>
<a href="#n19" name="n19">19</a>
<strong><a href="#n20" name="n20">20</a></strong>
</pre>
      </td>
      <td class="code"><pre>    ...
    <span style="color:#080;font-weight:bold">if</span> (hasBlock) {
        <span style="color:#777">// #4</span>
        id (^block)(id);
        [anInvocation getArgument:&amp;block atIndex:<span style="color:#00D">2</span>];            
        <span style="color:#777">// #5</span>
        [buffer appendFormat:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">%@&lt;%@&gt;</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>, tabs, method];
        self.indentationLevel = self.indentationLevel + <span style="color:#00D">1</span>;
        block(self);
        self.indentationLevel = self.indentationLevel - <span style="color:#00D">1</span>;
        [buffer appendFormat:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">%@&lt;/%@&gt;</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>, tabs, method];
    } <span style="color:#080;font-weight:bold">else</span> {
        <span style="color:#777">// #6</span>
        NSString* value;
        [anInvocation getArgument:&amp;value atIndex:<span style="color:#00D">2</span>];
        [buffer appendFormat:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">%@&lt;%@&gt;</span><span style="color:#b0b">\n</span><span style="color:#D20">%@%@%@</span><span style="color:#b0b">\n</span><span style="color:#D20">%@&lt;/%@&gt;</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>, 
          tabs, method, tabs, <span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">  </span><span style="color:#710">"</span></span>, value, tabs, method];
    }    
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Continuando a partir da metade do código:</p>
<ol>
  <li>Se a convenção disser que existe um bloco, assumimos que ele foi passado como argumento no 3o ítem do array do <tt>NSInvocation</tt>. Por convenção o primeiro elemento desse array (0) é o self e o segundo (1) o método, portanto o 3o. elemento (2) é o equivalente ao primeiro argumento.</li>
  <li>Agora vem a sequência para criar a tag que abre o bloco, depois aumentamos o nível de identação para o bloco; daí chamamos o bloco passado passando nós mesmos como parâmetro; o bloco é executado e quando retorna podemos diminuir o nível de identação; finalmente criamos a tag que fecha o bloco.</li>
  <li>Caso não tenha sido passado um bloco então é uma tag simples com um valor simples dentro. Agora no 3o. elemento do array, em vez de esperar um bloco podemos esperar um String. Finalmente basta criar a tag com o valor String dentro e acertar a identação de acordo.</li>
</ol>
<p>Fazendo isso, podemos agora fazer chamadas assim:</p>
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
      <td class="code"><pre><span style="color:#0a5;font-weight:bold">int</span> main (<span style="color:#0a5;font-weight:bold">int</span> argc, <span style="color:#088;font-weight:bold">const</span> <span style="color:#0a5;font-weight:bold">char</span> * argv[]) {
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    XmlBuilder* xml = [[XmlBuilder alloc] init];
    [xml htmlBlock:^(XmlBuilder* h) {
        [h bodyBlock:^(XmlBuilder* b) {
            [b h1:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Hello World</span><span style="color:#710">"</span></span>];
            [b p:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">This is a paragraph.</span><span style="color:#710">"</span></span>];
            [b tableBlock:^(XmlBuilder* t) {
                [t trBlock:^(XmlBuilder* tr) {
                    [tr td:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">column</span><span style="color:#710">"</span></span>];
                }];
            }];            
        }];
    }];
    NSLog(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">%@</span><span style="color:#710">"</span></span>, [xml buffer]);
    [pool drain];
    <span style="color:#080;font-weight:bold">return</span> <span style="color:#00D">0</span>;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Impressionantemente, se abrirmos o Console (Shift+Command+R) ao executar teremos exatamente esta saída do comando <tt>NSLog</tt>:</p>
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
      <td class="code"><pre><span style="color:#070">&lt;html&gt;</span>
  <span style="color:#070">&lt;body&gt;</span>
    <span style="color:#070">&lt;h1&gt;</span>
      Hello World
    <span style="color:#070">&lt;/h1&gt;</span>
    <span style="color:#070">&lt;p&gt;</span>
      This is a paragraph.
    <span style="color:#070">&lt;/p&gt;</span>
    <span style="color:#070">&lt;table&gt;</span>
      <span style="color:#070">&lt;tr&gt;</span>
        <span style="color:#070">&lt;td&gt;</span>
          column
        <span style="color:#070">&lt;/td&gt;</span>
      <span style="color:#070">&lt;/tr&gt;</span>
    <span style="color:#070">&lt;/table&gt;</span>
  <span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Que é o que queríamos e é semelhante ao gerado pelo equivalente Builder::XmlMarkup do Ruby. Claro, esta é uma versão hiper-simplificada, mas que pode ser o esqueleto para uma versão completa. O próximo passo é fazer a classe aceitar atributos de tags. E outra coisa é ver se é possível não precisar da convenção de “tableBlock:” para identificar se o argumento passado é um bloco e checar se é possível verificar o tipo do argumento passado em tempo de execução.</p>
<p>De qualquer forma, com isso podemos ver o quanto o Obj-C pode ser dinâmico e flexível mesmo em se tratando de uma linguagem de baixo nível como é C. Com um pouco de criatividade podemos criar bibliotecas que lembram em muito o que usamos em Ruby.</p>
<p></p>
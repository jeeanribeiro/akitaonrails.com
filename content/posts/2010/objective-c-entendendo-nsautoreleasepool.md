---
title: "[Objective-C] Entendendo NSAutoreleasePool"
date: "2010-11-25T03:13:00.000Z"
tags: ["beginner", "apple", "objective-c"]
years: "2010"
---

<p></p>
<p>Ultimamente ando brincando de desenvolvimento iPhone e pra isso caí no Objective-C. Gosto muito da linguagem. Já conhecia um pouco do básico dele mas foi a primeira vez que comecei a codificar de verdade. Alguns podem não gostar da sintaxe ou de algumas das ferramentas (realmente o XCode não é completo nem robusto o suficiente, mas dá pro gasto). Mas no geral acho o fluxo de desenvolvimento bastante agradável.</p>
<p>Logo de cara uma coisa que confunde os que sempre trabalharam com plataformas com Garbage Collector é o gerenciamento manual de memória. Vou me abster da discussão sobre se é melhor ou pior e os trade-offs. Na prática, é simples manter isso manualmente.</p>
<p>Uma coisa que confunde no início é o <tt>NSAutoreleasePool</tt>. Todo projeto Cocoa começa com algo parecido com isto, no <tt>main.m</tt>:</p>
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
      <td class="code"><pre><span style="color:#0a5;font-weight:bold">int</span> main(<span style="color:#0a5;font-weight:bold">int</span> argc, <span style="color:#0a5;font-weight:bold">char</span> *argv[]) {   
    NSAutoreleasePool * pool = [[NSAutoreleasePool alloc] init];
    <span style="color:#0a5;font-weight:bold">int</span> retVal = UIApplicationMain(argc, argv, nil, nil);
    [pool release];
    <span style="color:#080;font-weight:bold">return</span> retVal;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>O Obj-C trabalha com contagem de referência para limpar memória. Toda vez que se chama o método <tt>alloc</tt> ou <tt>new</tt> memória é alocada, um novo objeto é instanciado e seu contador sobe para 1. Toda vez se envia a mensagem <tt>retain</tt> a esse objeto o contador é incrementado, toda vez que se envia a mensagem <tt>release</tt> o contador é decrementado. Quando o contador chega a zero, o sistema pode destruir o objeto (chamando também seu método <tt>dealloc</tt>) e a memória é devolvida ao sistema.</p>
<p>O sistema devolve memória liberado ao sistema ao final de uma execução, mas existe um caso em específico que pode dar picos de consumo de memória antes do sistema ter chance de limpá-la. Veja este trecho:</p>
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
      <td class="code"><pre>- (IBAction) onClick:(id)sender {
  <span style="color:#0a5;font-weight:bold">int</span> i;
  <span style="color:#080;font-weight:bold">for</span> (i = <span style="color:#00D">0</span>; i &lt; <span style="color:#00D">50000</span>; i++) {
      NSString * teste = [NSString stringWithFormat:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Teste %i</span><span style="color:#710">"</span></span>, i];
      NSLog(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">X: %@</span><span style="color:#710">"</span></span>, teste);
  }
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Imagine situações onde você está consumindo um stream de dados como de um arquivo, um web service, um parser, um tweet stream ou coisas assim, com cada ítem sendo processado em loop. Não é difícil sair criando milhares de Strings sem liberá-los.</p>
<p>No caso, estamos criando Strings usando o método <tt>stringWithFormat</tt> que, por convenção, devolve o String criado depois de ter já chamado o método <tt>autorelease</tt>. Explicando, você é responsável por criar e destruir objetos. Porém, quando você repassa um objeto que você criou para outro objeto, quem é o responsável por mandar <tt>release</tt> ao objeto?</p>
<p>Esse é o caso do <tt>stringWithFormat</tt>. Nesse caso não é nem a classe <tt>NSString</tt> nem nosso código que o chamou que vai liberar a memória ocupada por esse String. Quando você tem essa situação, em vez de mandar um <tt>release</tt>, deve enviar <tt>autorelease</tt>. Isso colocará o objeto no último <tt>NSAutoreleasePool</tt> criado. Os pools são empilháveis: os objetos sempre são colocados sob a responsabilidade do último pool criado.</p>
<p>Assim, como no <tt>main.m</tt> criamos um pool, os Strings serão todos colocados lá. Porém, eles serão apenas liberados depois do loop de 50 mil voltas. Por isso teremos um pico de consumo de memória até o término do loop. Dependendo do que está processando, você pode consumir toda a memória do sistema sem saber. Veja quando rodamos esse código num aplicativo via Instruments:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2010/11/25/Screen%20shot%202010-11-25%20at%201.03.24%20AM_original.png?1290654557" srcset="https://s3.amazonaws.com/akitaonrails/assets/2010/11/25/Screen%20shot%202010-11-25%20at%201.03.24%20AM_original.png?1290654557 2x" alt=""></p>
<p>Note quanto de memória está sendo usada somente por <tt>CFString</tt>, mais de 1MB (!) Precisamos melhorar isso. E essa memória vai crescer quanto mais Strings forem criados dentro desse loop.</p>
<p>Esse padrão é fácil de identificar, basta procurar por loops que podem ser muito longos (centenas ou milhares de interações). Para “consertar” isso, podemos fazer o seguinte:</p>
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
      <td class="code"><pre>- (IBAction) onClick:(id)sender {    
    <span style="color:#0a5;font-weight:bold">int</span> i;
    <span style="color:#777">// cria novo pool</span>
    NSAutoreleasePool* pool = [[NSAutoreleasePool alloc] init];
    <span style="color:#080;font-weight:bold">for</span> (i = <span style="color:#00D">0</span>; i &lt; <span style="color:#00D">50000</span>; i++) {
        NSString * teste = [NSString stringWithFormat:<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Teste %i</span><span style="color:#710">"</span></span>, i];
        NSLog(<span style="color:#F00;background-color:#FAA">@</span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">X: %@</span><span style="color:#710">"</span></span>, teste);
        <span style="color:#080;font-weight:bold">if</span> (i % <span style="color:#00D">1000</span> == <span style="color:#00D">0</span>) {
            <span style="color:#777">// limpa o pool a cada mil interações</span>
            [pool release];
            <span style="color:#777">// cria um novo pool vazio</span>
            pool = [[NSAutoreleasePool alloc] init];
        }
    }
    <span style="color:#777">// limpa o último pool criado</span>
    [pool release];
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É o mesmo código, porém criamos um novo <tt>NSAutoreleasePool</tt> especialmente para os objetos criados pelo loop. Dentro do loop limpamos o pool depois de alguma certa quantidade de interações que faça sentido, no exemplo, a cada 1000 interações. Uma vez que o pool é liberado, criamos outro vazio para poder continuar o loop. E no final garantimos que estamos liberando o último pool criado.</p>
<p>Com isso o consumo de memória nunca passará de um certo teto bem mais baixo que o pico causado pelo exemplo anterior. Vejamos rodando esse novo código via Instruments:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2010/11/25/Screen%20shot%202010-11-25%20at%201.05.04%20AM_original.png?1290654550" srcset="https://s3.amazonaws.com/akitaonrails/assets/2010/11/25/Screen%20shot%202010-11-25%20at%201.05.04%20AM_original.png?1290654550 2x" alt=""></p>
<p>Muito melhor! Não muito mais do que 100Kb. E esse consumo é constante e não crescente como antes, o que é mais importante. Mais do que consumir pouca memória é importante conseguir comportamentos onde o consumo não passe de um certo teto.</p>
<p>Esse é apenas um dos aspectos do gerenciamento de memória do Objective-C que é importante que os programadores se atentem. Vou fazer mais artigos sobre esse assunto, aguardem.</p>
<p></p>
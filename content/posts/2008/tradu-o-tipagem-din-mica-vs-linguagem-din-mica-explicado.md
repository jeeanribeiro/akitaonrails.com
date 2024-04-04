---
title: "Tradução: Tipagem Dinâmica vs Linguagem Dinâmica Explicado"
date: "2008-02-22T22:38:00.000Z"
tags: ["beginner", "translation"]
years: "2008"
---

<p></p>
<p>Estou na minha temporada de traduções :-) Felizmente a blogosfera produz muitos artigos interessantes. Desta vez foi <a href="http://groovy.dzone.com/news/dynamic-typing-vs-dynamic-lang">Steven Devijver</a> que fez um artigo explicando sobre as diferenças entre os termos <strong>tipagem</strong> dinâmica e <strong>linguagem</strong> dinâmica.</p>
<p>Vamos à tradução:</p>
<p></p>
<p></p>
<p>Eu acabei de ler <a href="https://pinderkent.blogsavy.com/archives/157">um post muito interessante sobre as virtudes de tipagem estática comparado com tipagem dinâmica</a> (<strong>nota do Akita</strong>: o artigo desse link foi especialmente tecido com a intenção de pegar os despreparados). Levou um tempinho para eu entender os exemplos de código de Ruby, Python, OCaml e Haskell. Mesmo assim consegui concluir algumas coisas desse artigo:</p>
<ul>
  <li>Ruby e Python são linguagens com tipagem dinâmica. Eles não suportam tipagem estática.</li>
</ul>
<ul>
  <li>OCaml e Haskell são linguagems com tipagem estática. Eles não suportam tipagem dinâmica.</li>
</ul>
<p>Entretanto a diferença é clara o suficiente. VB Script (Visual Basic Script) tem tipagem dinâmica e mesmo assim não é uma linguagem dinâmica. O código abaixo é VB Script válido (roda no Windows com cscript.exe):</p>
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
      <td class="code"><pre>dim x
dim y
x = 1
y = 2
x = "ABC"
y = "XYZ"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ruby e Python usam tipagem dinâmica e eles também são linguagens dinâmicas. Aqui vai um trecho de código demonstrando o mecanismo de despacho dinâmico do Ruby:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Dummy</span>  
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">method_missing</span>(m, *args)  
    args[<span style="color:#00D">0</span>] + args[<span style="color:#00D">1</span>]
  <span style="color:#080;font-weight:bold">end</span>  
<span style="color:#080;font-weight:bold">end</span>
raise <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Error</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">unless</span> <span style="color:#036;font-weight:bold">Dummy</span>.new.test(<span style="color:#00D">1</span>, <span style="color:#00D">2</span>) == <span style="color:#00D">3</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O método test() chamado na classe Dummy na última linha é despachado pelo Ruby ao método method_missing(). (<strong>nota do Akita</strong>: note que dizemos “despachado” – dispatched – e não “chamado”. Não ‘chamamos métodos’, mas sim ‘enviamos mensagens’, a diferença é muito grande.) Python e Groovy também suportam Despacho Dinâmico. Em geral, linguagens dinâmicas como Ruby, Python e Groovy tem um Protocolo de Meta-Objeto ou <span class="caps">MOP</span> (Meta-Object Protocol).</p>
<p>De volta ao post que mencionei no começo. O autor tenta provar que tipagem estática é superior à tipagem dinâmica. Para provar isso ele usa este código em Ruby (também há exemplos em Python, OCaml e Haskell):</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">test</span>(a, b)
  a + b
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">main</span>()
  <span style="color:#080;font-weight:bold">if</span> <span style="color:#069">ARGV</span>.length &gt; <span style="color:#00D">3</span>
    test(<span style="color:#00D">1</span>, test)
  <span style="color:#080;font-weight:bold">else</span>
    test(<span style="color:#00D">1</span>, <span style="color:#00D">2</span>)
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
<span style="color:#036;font-weight:bold">Process</span>.exit(main())
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse código funciona bem quando passamos 0, 1, 2 ou 3 argumentos na linha de comando:</p>
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
      <td class="code"><pre>$ ruby -w -W2 t.rb; echo $?
3
$ ruby -w -W2 t.rb 0; echo $?
3
$ ruby -w -W2 t.rb 0 1; echo $?
3
$ ruby -w -W2 t.rb 0 1 2; echo $?
3
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Entretanto, quando passamos 4 argumentos na linha de comando o script Ruby falha:</p>
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
      <td class="code"><pre>$ ruby -w -W2 t.rb 0 1 2 3; echo $?
t.rb:7:in `test': wrong number of arguments (0 for 2) (ArgumentError)
        from t.rb:7:in `main'
        from t.rb:13
1
$
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Baseado nesse script Ruby, o (famigerado) autor chega à seguinte conclusão:</p>
<blockquote>
  <p>Como é esperado de uma linguagem com tipagem dinâmica como Ruby, o erro não foi detectado até o momento de execução (runtime) […] Mesmo se testes unitários tivessem sido utilizados, é bem possível que esse cenário não seria coberto, e um usuário perplexo encararia um erro como o mostrado acima.</p>
</blockquote>
<p>Bem, não podemos argumentar contra isso. Ele vai adiante com as versões de OCaml e Haskell do mesmo script. Na conclusão o autor diz:</p>
<blockquote>
  <p>Como vimos claramente acima, linguagens com tipagem dinâmica como Ruby e Python podem permitir que código estragado seja escrito facilmente. Mas mais perigoso, é possível que esse código rode bem, até que uma certa condição aconteça e aí vai acontecer um erro de runtime. […] Ainda bem que linguagens de tipagem estática fornecem uma maneira muito natural de evitar muitos problemas de runtime, em vez disso pegando-os no momento de compilação.</p>
</blockquote>
<p>E eis quando a confusão se firmou, misturando tipagem dinâmica com linguagem dinâmica. O autor nunca menciona “linguagem dinâmica” em seu post (somente “linguagens de tipagem dinâmica”) e ainda assim ele clama que linguagens de tipagem estática detectam confusão de tipos no momento de compilação, logo são mais seguras para os desenvolvedores usar.</p>
<p>Aqui vai um script tipado estaticamente em Groovy que vai falhar em tempo de compilação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#339;font-weight:bold">int</span> x = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">test</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este é o erro em runtime:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>Caught: org.codehaus.groovy.runtime.typehandling.GroovyCastException: Cannot cast object 'test' with class 'java.lang.String' to class 'java.lang.Integer'
at typesafe.run(typesafe.groovy:1)
at typesafe.main(typesafe.groovy)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Hmm, Groovy sem sombra de dúvida tem tipagem estática (note, entretanto, que não há erro em tempo de compilação). Ainda assim ele também é uma linguagem dinâmica. Aqui vai o script Ruby anterior re-escrito em Groovy:</p>
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
      <td class="code"><pre>def test(<span style="color:#339;font-weight:bold">int</span> a, <span style="color:#339;font-weight:bold">int</span> b) {
    a + b
}
<span style="color:#080;font-weight:bold">if</span> (args.length &gt; <span style="color:#00D">3</span>) {
    println test(<span style="color:#00D">1</span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">test</span><span style="color:#710">"</span></span>)
} <span style="color:#080;font-weight:bold">else</span> {
    println test(<span style="color:#00D">1</span>, <span style="color:#00D">2</span>)
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Veja a declaração do método test() nas primeiras 3 linhas e seus argumentos tipados estaticamente. Esse script vai compilar? Sim. Esse script vai falhar quando 3 ou menos argumentos forem passados na linha de comando? Não. Aqui vão as saídas para 0 até 4 argumentos na linha de comando:</p>
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
      <td class="code"><pre>C:\&gt;groovy type_safe
3
C:\&gt;groovy type_safe 0
3
C:\&gt;groovy type_safe 0 1
3
C:\&gt;groovy type_safe 0 1 2
3
C:\&gt;groovy type_safe 0 1 2 3
Caught: groovy.lang.MissingMethodException: No signature of method: type_safe.test() is applicable for argument types: (java.lang.Integer, java.lang.String) values: {1, "test"}
        at type_safe.run(type_safe.groovy:6)
        at type_safe.main(type_safe.groovy)
C:\&gt;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Por que esse script compila quando o método test() tem argumentos tipados? A chamada a test() na última linha é claramente incorreta!</p>
<p>Groovy é uma linguagem dinâmica com um Protocolo de Meta-Objeto. O compilador Groovy não tem nenhuma maneira de saber como a chamada da última linha acima será despachada. Talvez seja despachada para o método test() declarado nas primeiras 3 linhas. Mas configuração dinâmica em tempo de execução também pode significar que a chamada seja despachada para outro lugar.</p>
<p>Groovy suporta tipagem estática, Ruby e Python não. Como são linguagens dinâmicas seus compiladores ou interpretadores não podem saber como as chamadas de métodos serão despachados (essa informação está disponível apenas em tempo de execução). Suas implementações do Protocolo de Meta-Objeto são o poder dessas linguagens dinâmicas.</p>
<p>Para os designers de Ruby e Python suportar tipagem estática provavelmente não fazia muito sentido já que não pode ser usado para reforçar o tempo de compilação de qualquer forma. Groovy suporta tipagem estática para suportar, por exemplo, overloading de métodos e construtor.</p>
<p>Fazer pouco de Ruby, Python e Groovy porque eles não checam tipos em momento de compilação não leva em conta o poder das linguagens dinâmicas. Eu entendo que linguagens não-dinâmicas são desejáveis por muitas razões, mas assim também é com linguagens dinâmicas.</p>
<p>Da próxima vez que ouvir pessoas reclamando sobre linguagens dinâmicas por sua falta de tipagem estática você estará melhor informado para entender porque eles reclamam. Talvez eles não gostem de linguagens dinâmicas, ou gostem muito de tipagem estática. Mas pelo menos você saberá que existem diferenças entre tipagem dinâmica e linguagens dinâmicas. E também entenderá que eles preferem linguagens não-dinâmicas de tipagem estática.</p>
<p>Feliz codificação!</p>
<p></p>
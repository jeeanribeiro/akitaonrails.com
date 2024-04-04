---
title: "[Primeiros Passos] Brincando de Rust + Ruby/FFI"
date: "2015-06-05T19:05:00.000Z"
tags: ["rust"]
years: "2015"
---

<p></p>
<p>Estou nos meus primeiros dias estudando <a href="http://www.rust-lang.org">Rust</a>, a nova linguagem de sistema criado pela Mozilla. Essa linguagem está no meu radar faz vários meses, principalmente pelo suporte positivo de rubistas influentes como Steve Klabnik e Yehuda Katz.</p>
<p>Meu interesse é simples. Rust é uma linguagem pequena, mais próximo da categoria de C ou Objective-C do que GoLang, ou Elixir. Uma das coisas que sempre podemos fazer para "vitaminar" nosso querido Ruby é criar extensions em C. Mas se você já tentou fazer isso, sabe que nem é tão complicado com pequenas coisas à la "hello world", mas a coisa pode ficar exponencialmente complicada com muitas dependências e complexidades de toolchains. Então minha intenção em aprender Rust é ver se ela pode ser uma boa alternativa para criar extensions nativas performática facilmente consumíveis via <a href="https://github.com/ffi/ffi/wiki/Why-use-FFI">FFI</a> (Foreign Function Interface).</p>
<p>Este artigo é apenas um pequeno exercício que vai além de um simples "hello world", que seria absolutamente trivial. Quero fazer uma pequena biblioteca capaz de ler um arquivo de tamanho arbitrário (portanto não pode carregar tudo em memória) e fazer um parse com regular expressions (algo que fazemos comumente).</p>
<p></p>
<p></p>
<p>Para isso estou usando como teste um arquivo de atores de filmes que baixei do <a href="https://www.imdb.com/interfaces">FTP do IMDB</a>, em particular o arquivo "actors.tgz" que abre como "actors.list". De cara vou dizer que é um dump bem porcaria, cujo texto sequer está em UTF-8. E para os efeitos deste artigo eu fiz uma versão menor com somente as primeira 10 mil linhas dele, que é um mísero arquivo de 515kb (comparado aos 938MB originais). Poderia ser qualquer arquivo, mas aleatoriamente escolhi esse.</p>
<p>Coloquei o projeto <a href="https://github.com/akitaonrails/rust_ruby_exercise_1">no meu Github como exercício</a> (contribuições são bem vindas, pra melhorar o exemplo). Em Ruby, o código é simplesmente algo assim:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">find_actors</span>(filename, skip_lines, target_movie)
  actors = []
  actor = <span style="color:#069">nil</span>
  <span style="color:#036;font-weight:bold">File</span>.foreach(filename).with_index <span style="color:#080;font-weight:bold">do</span> |line, line_num|
    <span style="color:#080;font-weight:bold">next</span> <span style="color:#080;font-weight:bold">if</span> line_num &lt; <span style="color:#00D">239</span>
    line.encode!(line.encoding, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">binary</span><span style="color:#710">'</span></span>, <span style="color:#606">invalid</span>: <span style="color:#A60">:replace</span>, <span style="color:#080;font-weight:bold">undef</span>: <span style="color:#A60">:replace</span>)
    <span style="color:#080;font-weight:bold">if</span> line.strip == <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#710">'</span></span>
      actor = <span style="color:#069">nil</span>
      <span style="color:#080;font-weight:bold">next</span>
    <span style="color:#080;font-weight:bold">end</span>
    slices = line.split(<span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#D20">\t</span><span style="color:#404">/</span></span>)
    actor_buffer = slices.first
    movie        = slices.last
    <span style="color:#080;font-weight:bold">if</span> actor.nil? &amp;&amp; !actor_buffer.nil? &amp;&amp; actor_buffer != <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#710">'</span></span>
      actor = actor_buffer
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">if</span> !movie.nil? &amp;&amp; movie.include?(target_movie)
      actors &lt;&lt; actor <span style="color:#080;font-weight:bold">unless</span> actors.include?(actor)
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
  actors.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Dá pra melhorar isso, mas é o suficiente para nossos propósitos. Rodando contra o arquivo pequeno de exemplo, o resultado vai ser:</p>
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
      <td class="code"><pre>&gt; ruby actors.rb                                                                                                                               running pure Ruby version
145, Lyric
3, Utai
4 Real
4Shore
4Sure
4th Ba5e
4Tune
50 Cent
  0.050000   0.000000   0.050000 (  0.060104)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se você baixar meu código do repositório, primeiro garanta que você tem o Rust instalado. Pra isso basta executar o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>curl -sSf https://static.rust-lang.org/rustup.sh | sh
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quando baixar meu código, vai ver que ele tem os arquivos Cargo.toml e Cargo.lock. Eles são semelhantes ao nosso Gemfile/Rakefile e Gemfile.lock. No Ruby controlamos nossas tarefas com Rake, as gems com Bundler (que lê as versões exatas do Gemfile.lock) e normalmente baixamos dependências que são Rubygems do Rubygems.org.</p>
<p>No caso do Rust, ele controla tanto tarefas (build, teste) e declaração de dependências via o arquivo Cargo.toml (<a href="https://github.com/toml-lang/toml">TOML</a> sendo uma alternativa mais moderna a YAML). Em vez de Rake e Bundler temos <a href="https://doc.crates.io/guide.html">Cargo</a>. Em vez de Rubygems temos Crates. E em vez de Rubygems.org temos <a href="https://crates.io">Crates.io</a>.</p>
<p>Sendo uma linguagem que compila binários nativos, executamos <tt>cargo build</tt> mas se fizermos diretamente <tt>cargo test</tt> (para rodar testes incluídos no código) ou <tt>cargo run</tt> (para rodar o binário executável que fica no diretório <tt>bin/</tt>) ele vai automaticamente fazer a compilação do que precisa. No nosso caso, como estamos gerando uma biblioteca (que poderia ser um "<em>.so" para Linux, ou um "</em>.dylib" pra Mac ou "*.dll" para Windows), ele compila por padrão no diretório <tt>target/debug</tt> (que vai ser mais lento por ter símbolos pra debug e outros suportes). Para gerar a versão final, precisa executar <tt>cargo build --release</tt> e rodar como <tt>cargo run --release</tt> que vai gerar e linkar do binário em <tt>target/release</tt>.</p>
<p>Isso tudo dito, dê uma olhada nos arquivos Cargo.toml, src/main.rs, src/lib.rs. Os arquivos de Ruby estão misturados e são os <tt>actors.rb</tt>, <tt>imdb.rb</tt>. Pra executar a versão Ruby, lembre-se de também rodar <tt>gem install ffi</tt> primeiro (não estou usando Bundler nesse exercício).</p>
<h2>O Código Rust</h2>
<p>Agora vamos olhar o código Rust equivalente ao Ruby anterior:</p>
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
<a href="#n37" name="n37">37</a>
<a href="#n38" name="n38">38</a>
<a href="#n39" name="n39">39</a>
<strong><a href="#n40" name="n40">40</a></strong>
<a href="#n41" name="n41">41</a>
<a href="#n42" name="n42">42</a>
<a href="#n43" name="n43">43</a>
</pre>
      </td>
      <td class="code"><pre>use std::io::prelude::*;
use std::io::<span style="color:#036;font-weight:bold">BufReader</span>;
use std::fs::<span style="color:#036;font-weight:bold">File</span>;
extern crate regex;
use regex::<span style="color:#036;font-weight:bold">Regex</span>;
pub fn find_actors(<span style="color:#606">filename</span>: <span style="color:#036;font-weight:bold">String</span>, <span style="color:#606">skip_lines</span>: usize, <span style="color:#606">target_movie</span>: <span style="color:#036;font-weight:bold">String</span>) -&gt; <span style="color:#036;font-weight:bold">String</span> {
    let file = <span style="color:#036;font-weight:bold">File</span>::open(filename).unwrap();
    let mut reader = <span style="color:#036;font-weight:bold">BufReader</span>::new(&amp;file).lines().skip(skip_lines);
    let mut actor = <span style="color:#036;font-weight:bold">String</span>::new();
    let mut actors : <span style="color:#036;font-weight:bold">Vec</span>&lt;<span style="color:#036;font-weight:bold">String</span>&gt; = <span style="color:#036;font-weight:bold">Vec</span>::new();
    let regex = <span style="color:#036;font-weight:bold">Regex</span>::new(r<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">^(.*?)</span><span style="color:#b0b">\t</span><span style="color:#D20">+(.*?)$</span><span style="color:#710">"</span></span>).unwrap();
    loop {
        let line = match reader.next() {
            Some(line) =&gt; match line {
                Ok(line) =&gt; line,
                Err(_)   =&gt; <span style="color:#036;font-weight:bold">String</span>::new(),
            },
            <span style="color:#036;font-weight:bold">None</span> =&gt; <span style="color:#080;font-weight:bold">break</span>,
        };
        match regex.captures(&amp;line) {
            Some(captures) =&gt; {
                let actor_buffer = captures.at(<span style="color:#00D">1</span>).unwrap();
                let movie        = captures.at(<span style="color:#00D">2</span>).unwrap();
                <span style="color:#080;font-weight:bold">if</span> actor.is_empty() &amp;&amp; !actor_buffer.is_empty() {
                    actor = actor_buffer.to_string();
                }
                <span style="color:#080;font-weight:bold">if</span> !movie.is_empty() &amp;&amp; movie.contains(&amp;target_movie) &amp;&amp; !actors.contains(&amp;actor) {
                    actors.push(actor.to_string());
                }
            },
            <span style="color:#036;font-weight:bold">None</span> =&gt; {
                actor = <span style="color:#036;font-weight:bold">String</span>::new();
            }
        };
    }
    actors.connect(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>)
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Essa função usa coisas do próprio Rust que importamos dos módulos <tt>str::io</tt> e <tt>std::fs</tt> e tem a Crate regex externa. Também exportamos esse módulo com o nome de "imdb" que é o declaramos no Cargo.toml:</p>
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
      <td class="code"><pre>[<span style="color:#F00;background-color:#FAA">package]</span>
<span style="color:#F00;background-color:#FAA">name = "actors"</span>
<span style="color:#F00;background-color:#FAA">version = "0.1.0"</span>
<span style="color:#F00;background-color:#FAA">authors = ["vagrant"]</span>
[<span style="color:#F00;background-color:#FAA">lib]</span>
<span style="color:#F00;background-color:#FAA">name = "imdb"</span>
<span style="color:#F00;background-color:#FAA">path = "src/lib.rs"</span>
<span style="color:#F00;background-color:#FAA">crate-type = ["rlib", "dylib"]</span>
[<span style="color:#F00;background-color:#FAA">dependencies]</span>
<span style="color:#F00;background-color:#FAA">regex = "0.1.8"</span>
<span style="color:#F00;background-color:#FAA">libc = "0.1.8"</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Eu removi um trecho do arquivo que vou explicar na próxima seção, sobre FFI. Por enquanto vamos nos ater a esse código.</p>
<p>A sintaxe em si não deve ser tão assustadora num primeiro momento. As coisas estranhas vão exigir algum estudo.</p>
<ul>
  <li>
    <p>O Rust tem tipos e eles são declarados. O compilador usa inferência de tipos então não precisa declarar tudo o tempo todo como em Java. Ao contrário de Ruby, Rust não é orientado a "objetos". Ele tem structs e funções declaradas pra essas structs. Cada struct pode implementar funções declaradas em <a href="https://doc.rust-lang.org/book/traits.html">Traits</a>, que funcionam mais ou menos como Interfaces ou Protocolos (em Swift/Obj-C). Leia <a href="https://blog.rust-lang.org/2015/05/11/traits.html">outro artigo sobre Trait aqui</a>.</p>
  </li>
  <li>
    <p>Existe o conceito de <a href="https://doc.rust-lang.org/book/generics.html">Generics</a>. Por isso a sintaxe de <tt>Vec<string></string></tt> que declara um <a href="https://doc.rust-lang.org/book/vectors.html">Vetor</a> com cada elemento sendo um String. Vetores são muito usados, então estude a respeito, mas é basicamente um Array de tamanho dinâmico (que pode receber novos elementos, possivelmente uma lista ligada).</p>
  </li>
  <li>
    <p>Falando em Strings, existe a struct <a href="https://doc.rust-lang.org/book/strings.html">String</a> e a primitiva 'str'. Um <tt>"hello world"</tt> é um 'str' que pode virar um String se fizermos <tt>"hello world".to_string()</tt>.</p>
  </li>
  <li>
    <p>Em Rust, todos bindings de variáveis são imutáveis. Para torná-la mutável precisamos declarar explicitamente com <tt>let mut</tt> como no exemplo acima. Leia mais sobre <a href="https://doc.rust-lang.org/book/variable-bindings.html">Variable Binding</a>. Em particular, isso leva aos conceitos de <a href="https://doc.rust-lang.org/book/ownership.html">Ownership/Propriedade</a> de uma variável, <a href="https://doc.rust-lang.org/book/references-and-borrowing.html">Borrowing/Empréstimo</a> de variáveis entre escopos diferentes, como passar para uma função e <a href="https://doc.rust-lang.org/book/lifetimes.html">Lifetime/Tempo de Vida</a> de uma variável. Vou adiantar que esse é um dos conceitos que pode levar mais tempo para se acostumar.</p>
  </li>
</ul>
<p>Rust não tem garbage collector como em Ruby ou Java. Primeiro, porque ele usa primariamente o Stack em vez do Heap. Stack é uma pilha. Toda chamada de função empilha as variáveis que usa em seu espaço. Quando chama uma nova função ele empilha isso acima de si com suas variáveis. Quando a última função retorna, ele pode limpar as variáveis que alocou (que são sua "propriedade"). Se precisamos passar uma variável de uma função para a função seguinte podemos ou "copiar" o valor (normvalmente o que se faz com primitivas como i32 ou f64 - que são inteiros de 32bits ou floats de 64-bits, dentre outros tipos primitivos) ou podemos "mover a propriedade", por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>let x = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello</span><span style="color:#710">"</span></span>.to_string();
let y = x;
println!(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">{}</span><span style="color:#710">"</span></span>, x); <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#404">/</span></span> vai dar pau, porque movemos a propriedade de <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">x</span><span style="color:#710">"</span></span> para o <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">y</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou "emprestar". Empréstimos são declarados com "&amp;" ('e' comercial) e somente podemos emprestar uma única vez como em <tt>let y = &amp;x</tt>. Sim, essa mecânica vai demorar mais pra se entender se você só conhece linguagens como Ruby ou Javascript. Se você aprendeu Objective-C antes do advento do <a href="https://blog.caelum.com.br/gerenciamento-de-memoria-e-o-arc-no-objective-c/">ARC</a>, já teve que parar pra pensar nesse tipo de <a href="https://www.akitaonrails.com/2010/11/25/objective-c-entendendo-nsautoreleasepool">ciclo de vida de retain/copy/release</a>.</p>
<p>Outros artigos <a href="https://nercury.github.io/rust/guide/2015/01/19/ownership.html">como este</a> ou <a href="https://arthurtw.github.io/2014/11/30/rust-borrow-lifetimes.html">este</a> podem ajudar. O objetivo dessa mecânica é para justamente evitar possibilidades de leaks de memória, ter desalocação determinística, usar a menor quantidade de memória quanto possível. Tecnicamente, não deveria haver leaks de memória óbvios em Rust. E não ter a lógica de Garbage Collection elimina uma das maiores complexidades que temos em linguagens mais modernas que contam com uma VM, o que facilita o uso do Rust para mais usos de sistema mais de baixo nível.</p>
<ul>
  <li>Você vai ver várias chamadas a <tt>unwrap()</tt>, isso pode ser estranho. Então veja esta linha em específico:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>let regex = <span style="color:#036;font-weight:bold">Regex</span>::new(r<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">^(.*?)</span><span style="color:#b0b">\t</span><span style="color:#D20">+(.*?)$</span><span style="color:#710">"</span></span>).unwrap()
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso é só um jeito mais curto pra:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>let regex = match <span style="color:#036;font-weight:bold">Regex</span>::new(r<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">^(.*?)</span><span style="color:#b0b">\t</span><span style="color:#D20">+(.*?)$</span><span style="color:#710">"</span></span>) {
    Ok(regex) =&gt; regex,
    Err(_) =&gt; panic!(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">invalid regex</span><span style="color:#710">"</span></span>),
};
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O <tt>match</tt> é a avaliação de um <a href="https://doc.rust-lang.org/book/patterns.html">Pattern Matching</a> sobre um tipo chamado core::result::Result que é a alternativa do Rust de evitar retornar códigos de erro (como em C) ou usar um sistema de exceptions (como em Ruby mesmo). Nesse caso a criação de uma struct de Regex pode dar certo ou errado. Se der certo teremos o resultado voltando como "Ok", se der errado voltará como "Err(e)" e podemos fazer alguma coisa com o erro ou parar tudo como no exemplo, chamando a macro "panic!". O método unwrap implementa exatamente essa lógica se não estamos interessados em tratar o erro.</p>
<p>Em conjunto com o conceito de Result, temos <a href="https://hoverbear.org/2014/08/12/option-monads-in-rust/">Option Monads</a> (implementado como core::option::Option), também conhecidos como tipos "Maybe" que devolvem "Some" (algum valor) ou "None" (nenhum valor), que é a resposta do Rust pra não ter que lidar com Null. Em Ruby, como existe a classe NilClass, podemos criar ferramentas como <a href="https://devblog.avdi.org/2011/05/30/null-objects-and-falsiness/">NullObjects</a> onde um "Maybe" devolve esse NullObject/None ou o valor em si, "Some".</p>
<p>Veja a biblioteca <a href="https://github.com/avdi/naught">Naught</a> pra entender mais do conceito.</p>
<p>Em resumo isso significa que você vai ver muito códigos com "unwrap" e "match" lidando com "Ok/Err" ou "Some/None". Sendo honesto, ainda não estou tão seguro das melhores práticas de quando e como usar isso e definitivamente é um tópico que vou estudar mais.</p>
<p>Veja que tanto no <tt>reader.next()</tt>, que é pegando o próximo elemento o Iterador do Regex quanto o <tt>regex.captures()</tt> que faz o match da Regex contra o string da linha devolvem o tipo "Option" e usamos "match" para saber o que fazer. No primeiro caso, se não houver um próximo elemento no iterador, ele devolve "None" e sabemos que podemos sair (break) do loop. E no segundo caso, se a linha sendo processada não bater com a regex, ele devolve "None" e sabemos que acabou o bloco do ator corrente, então podemos zerá-la antes de começar o próximo ator.</p>
<ul>
  <li>O resto do código depois do "captures()" é a mesma lógica que em Ruby, de checar linha do arquivo, dividir entre nome do ator e seus filmes, acumular o nome do último ator (porque no formato do arquivo um ator tem vários filmes, um em cada linha), e ir acumulando os nomes no Vetor/Array. No final simplemente pegamos todos os nomes e concatenamos com um "\n".</li>
</ul>
<p>Este código não lida com alguns conceitos mais interessantes do Rust como <a href="https://doc.rust-lang.org/book/dining-philosophers.html">Threads</a>. Recomendo, no mínimo, ler toda a documentação oficial no site do Rust para entender esses e mais dos conceitos importantes.</p>
<h2>Exportando para consumo em FFI</h2>
<p>A maioria dos exemplos que achamos primeiro usando o Google, são códigos simples. Estou usando direto a gem FFI em vez de usar a Fiddle, então saibam que existem <a href="https://blog.skylight.io/bending-the-curve-writing-safe-fast-native-gems-with-rust/">duas maneiras</a>.</p>
<p>Sem mais delongas, no mesmo arquivo <tt>src/lib.rs</tt> eu coloquei o seguinte:</p>
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
      <td class="code"><pre>extern crate libc;
use libc::c_char;
use std::ffi::{<span style="color:#036;font-weight:bold">CString</span>, <span style="color:#036;font-weight:bold">CStr</span>};
<span style="color:#777">#[no_mangle]</span>
pub extern <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">C</span><span style="color:#710">"</span></span> fn ffi_find_actors(<span style="color:#606">filename_ptr</span>: *const c_char, <span style="color:#606">skip_lines</span>: i32, <span style="color:#606">target_movie_ptr</span>: *const c_char) -&gt; *const c_char {
    let filename = unsafe {
        <span style="color:#036;font-weight:bold">CStr</span>::from_ptr(filename_ptr)
    };
    let target_movie = unsafe {
        <span style="color:#036;font-weight:bold">CStr</span>::from_ptr(target_movie_ptr)
    };
    let result = find_actors(
        std::str::from_utf8(filename.to_bytes()).unwrap().to_string(),
        skip_lines as usize,
        std::str::from_utf8(target_movie.to_bytes()).unwrap().to_string()
        );
    <span style="color:#036;font-weight:bold">CString</span>::new(result).unwrap().as_ptr()
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, eu fiz uma nova função que consome a que analisamos antes. A que fizemos primeiro recebe structs String e devolve uma String, que são structs de Rust. Não entendi ainda como converter isso automaticamente para ser consumido externamente. Então essa função acima recebe de fora do Rust um ponteiro para uma lista de chars (que é o conceito original de uma "string"/"corrente"), pega o ponteiro, pega os bytes do local onde o ponteiro aponta, e cria uma 'str' UTF-8, e finalmente chama 'to_string()' pra gerar uma String de Rust.</p>
<p>Então ele pega o resultado, que é uma String, cria um CString (que vem do módulo "std::ffi"), ou seja, uma "String de C" e devolve o ponteiro para fora. Note que nos casos onde recebemos ponteiros, declaramos que é um bloco <a href="https://doc.rust-lang.org/book/unsafe.html">"unsafe"</a>.</p>
<p>A diretiva <tt>#[no_mangle]</tt> é para o compilador do Rust manter e não bagunçar o nome da função internamente. E <tt>pub extern</tt> é para declará-la disponível para ser usado publicamente e externamente.</p>
<p>Sinceramente, não sei se essa é a forma correta de se expôr uma função. Provalvemente de um jeito melhor e mais simples, mas ainda não encontrei. Se alguém souber como, não deixe de colocar nos comentários.</p>
<p>Então, do lado do Ruby, consumimos desta forma:</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">ffi</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">RustWorld</span>
  extend <span style="color:#036;font-weight:bold">FFI</span>::<span style="color:#036;font-weight:bold">Library</span>
  ffi_lib <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">target/release/libimdb.so</span><span style="color:#710">'</span></span>
  attach_function <span style="color:#A60">:ffi_find_actors</span>, [<span style="color:#A60">:string</span>, <span style="color:#A60">:int</span>, <span style="color:#A60">:string</span>], <span style="color:#A60">:string</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note que estamos fazendo link com a versão de "release" gerado via <tt>cargo build --release</tt>. E então declaramos a assinatura da função que queremos usar.</p>
<p>Finalmente, podemos usar dentro do Ruby normalmente assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">RustWorld</span>.ffi_find_actors(filename, <span style="color:#00D">239</span>, target_movie)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Comparação de Performance</h2>
<p>Aqui vem uma pequena surpresa. Eu fiz esse código com uma versão em Ruby e outra em Rust, lendo e processando o mesmo arquivo, para obter o mesmo resultado final. O que tive foi o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>RUST=1 ruby actors.rb                                                                                                                         0.070000   0.010000   0.080000 (  0.079534)
ruby actors.rb                                                                                                                                0.060000   0.000000   0.060000 (  0.057541)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, a versão Ruby é um pouco mais rápido que a versão em Rust, por uma margem de 27% (!!). Esses tempos foram marcados internamente dentro do Ruby (consumindo o Rust via FFI) com a biblioteca Benchmark.</p>
<p>E medindo diretamente, calculando o tempo com a função "time":</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>time cargo run --release                                                                                                                    cargo run --release  0.11s user 0.04s system 99% cpu 0.156 total
time ruby actors.rb                                                                                                                         ruby actors.rb  0.28s user 0.03s system 98% cpu 0.311 total
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Aqui vemos o Ruby sendo mais lento. Como o arquivo de testes é muito pequeno, o tempo de subir o Ruby interfere na medição. Então vamos tentar com outro arquivo maior, com 52MB em vez de meros 515k:</p>
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
      <td class="code"><pre>time cargo run --release
cargo run --release  7.04s user 0.11s system 99% cpu 7.184 total
time ruby actors.rb
ruby actors.rb  6.69s user 0.08s system 99% cpu 6.808 total
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, o Ruby ainda é mais rápido que a versão Rust. E aqui podemos ficar confusos: o Rust, sendo muito mais próximo de C do que de Ruby, não deveria ser algumas ordens de grandeza mais rápido?</p>
<p>O código em si é muito simples. O primeiro ponto é que ele depende mais de I/O (ler o arquivo). E nisso o Ruby é muito rápido pois essa lógica é implementada internamente em C.</p>
<p>A segunda parte que eu imagino mais pesada é processar a Regex linha a linha. E nesse caso a engine de Regex do Ruby é bastante rápida, também internamente sendo feita em C - mais do que isso, ela é madura, tendo passado por inúmeras reescritas e refatoramentos nos últimos anos. E a biblioteca Regex do Rust eu imagino que, por ser ainda imatura, tem muito a ser otimizada e isso está segurando os números.</p>
<p>Outra coisa: é um processamento sequencial, linear, do arquivo. Se gastássemos mais tempo em particionar o arquivo e rodar pedaços em paralelo para maximizar o uso da máquina, imagino que o Rust talvez tivesse alguma vantagem, mas mesmo nesse caso usaríamos alguma coisa como a biblioteca <a href="https://github.com/grosser/parallel">Grosser/Parallel</a> do Ruby, como <a href="https://www.akitaonrails.com/2015/05/15/small-bites-brincando-de-crawlers-e-algumas-dicas-uteis#.VXHlGZ9Hlp8">já expliquei em outro artigo</a>, pra conseguir também com Ruby usar todas as CPUs da máquina.</p>
<p>Na verdade, o problema não é o Rust ser "lento" mas subestimarmos o Ruby achando que ele sempre vai ser lento em tudo quando na verdade não é o caso. Faça a lição de casa antes de assumir que algo é lento ou rápido, você vai se surpreender em ver como Ruby é muito - e rápido - em diversos tipos de tarefas que à primeira vista parece que não. E não considerem que "Rust" é ruim por causa deste teste: é um caso de uso específico, que depende mais da forma como a biblioteca de Regex (possivelmente) amadureceu até este ponto.</p>
<p><strong>Obs 05/06/15:</strong> Logo após publicar o post o camarada Jeffry DeGrande mandou um <a href="https://github.com/akitaonrails/rust_ruby_exercise_1/pull/1">Pull Request</a> que troca a lenta crate "regex" pela "pcre" que, como seu nome diz, linka por baixo com a boa e velha biblioteca nativa "libpcre3" (Perl Compatible Regular Expression). Com isso os tempos ficam <strong>Muito</strong> melhores:</p>
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
      <td class="code"><pre>&gt; RUST=1 ruby actors.rb
running Rust/FFI version
  1.600000   0.010000   1.610000 (  1.625171)
&gt; ruby actors.rb
running pure Ruby version
  5.980000   0.050000   6.030000 (  6.046123)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como eu suspeitava, a culpada era mesmo a biblioteca imatura de regex. Trocando pela pcre a implementação em Rust fica na menos que <strong>3.7</strong> vezes mais rápida que a em Ruby, que seria um tempo que deveríamos mesmo esperar de uma linguagem compilada!</p>
<h2>Conclusão</h2>
<p>Rust atingiu sua versão 1.0 em Maio de 2015, ou seja, poucos dias atrás. Significa que muita coisa que você encontrar na Web, blogs, foruns, estarão defasados. Eu tive muita dificuldade em encontrar bons exemplos de código que funcionam na versão 1.0. Algumas structs mudaram de módulo. Alguns métodos estão com assinaturas diferentes e retornando coisas diferentes. A própria documentação oficial está com alguns erros ainda. Então tenha um pouco de paciência pois é a partir de agora com bons materiais vão começar a surgir.</p>
<p>Quem investiu tempo em aprender C/C++ (ou pelo menos Objective-C pré-ARC) não vai estranhar tanto assim o modelo de <a href="https://pcwalton.github.io/blog/2013/03/18/an-overview-of-memory-management-in-rust/">gerenciamento de memória</a> do Rust. A idéia de ownership/borrowing não é tão diferente assim de um retain/release. Só que em vez de contar referências, você só pode "emprestar" uma vez. Além disso os valores são imutáveis, então é um modelo mais simples - embora mais difícil de se adaptar logo de cara. Especialmente importante é entender o modelo de <a href="https://words.steveklabnik.com/a-new-introduction-to-rust">alocar no Stack</a> em vez de na Heap.</p>
<p>Também não há códigos de erro de retorno nem Exceptions. Aprender a lidar com o modelo de Pattern Matching em estruturas de Result/Option é outra mudança na forma de programar. Minha recomendação é abrir códigos fontes de terceiros como o próprio Cargo, para ver como são usados na prática.</p>
<p>Uma das coisas que não toquei neste artigo é seu excelente suporte a concorrência e paralelismo. Leia o exemplo do <a href="https://doc.rust-lang.org/book/dining-philosophers.html">Dining Philosopher</a> e como o Rust resolve esse clássico problema. É bem simples mesmo entender.</p>
<p>Para quem acha que o mundo é orientado a objetos, Rust é mais uma linguagem que - embora tenha alguma semântica de objetos - não é orientado a objetos. Ele tem structs e funções associadas a structs. Entender o modelo de <a href="https://blog.rust-lang.org/2015/05/11/traits.html">Traits</a> é crucial.</p>
<p>Rust é uma linguagem compilada, então toda vez que fizer algum código, existe o ciclo de compilar antes de executar, coisa que esquecemos como é no mundo Ruby ou Javascript. Mas a existência do Cargo facilita completamente esse fluxo e torna a experiência mil vezes mais agradável do que no mundo C, onde iríamos ter que mexer com Makefiles ou coisa similar. A organização padrão de projetos gerados pelo Cargo, empacotamentos em Crates e gerenciamento de dependências largamente inspirado no Bundler (que, aliás, todo mundo copia hoje em dia pois é o melhor modelo), ajuda muito ainda mais no começo.</p>
<p>Acompanhem o repositório no Github chamado <a href="https://github.com/kud1ing/awesome-rust">Awesome Rust</a> que tem diversos links de projetos open source. Outro repositório é o <a href="https://github.com/ctjhoa/rust-learning">Rust Learning</a> com links para várias documentações importantes para aprender. Existe já o rascunho de um <a href="https://aturon.github.io/README.html">"guideline de estilo"</a>.</p>
<p>Finalmente, Rust não é uma linguagem simples, definitivamente nem um pouco perto de algo como Ruby ou mesmo Elixir. Ele é mais baixo nível e vejo aplicações para coisas em nível de sistema. Ferramentas de linha de comando pra Linux. Bibliotecas para processamento de imagens, processamento numérico. Coisas que possam ser consumidas por outras linguagens ou aplicações, como o exemplo de expor funcionalidades como extensions nativas para Rubygems. Nesse sentido ele é mais seguro em termos de gerenciamento de memória, e com performance de processamento comparável a C++. Então é uma boa chance para programadores de linguagens de alto nível como Ruby ou Swift conseguirem descer para o nível de sistema sem precisar perder a cabeça com a complexidade de C/C++.</p>
<p></p>
---
title: "Tradução: Por que você não deve codificar em Português"
date: "2008-07-31T19:41:00.000Z"
tags: ["translation"]
years: "2008"
---

<p></p>
<p>Achei esse artigo interessante, o título original é <a href="http://www.codespanish.com/archives/softwaredevelopment/43">Why you shouldn’t code in Spanish</a>. E como o autor mesmo fala, a parte engraçada é que ele publicou esse artigo no site chamado <a href="http://www.codespanish.com">CodeSpanish</a>. Eu coloquei “Português” no título porque senão ninguém iria ler :-) Mas vou traduzir o artigo original. Seja português, seja espanhol, a noção é a mesma, então lá vai:</p>
<p style="text-align: center; margin: 5px"><a href="http://www.akitaonrails.com/2007/4/14/off-topic-seja-arrogante"><img src="http://s3.amazonaws.com/akitaonrails/files/america-790957.jpg" srcset="http://s3.amazonaws.com/akitaonrails/files/america-790957.jpg 2x" alt=""></a></p>
<p></p>
<p></p>
<h3>Por que você não deve codificar em Espanhol.</h3>
<p>Na realidade eu promovo a tradução de software para Espanhol e outras linguagens. Quando digo que você não deveria codificar em Espanhol quero dizer que não deve usar Espanhol ou qualquer outra língua que não seja Inglês como nomes de variáveis, nomes de arquivos, nomes de funções, etc. Linguagens de Programação, linguagens de script, comandos de sistema operacional, etc, são todos baseados na língua Inglesa. Então, por que você faria diferente no seu código?</p>
<p>Pegue por exemplo este código em <span class="caps">PHP</span> do post <a href="https://www.codespanish.com/archives/softwaredevelopment/30">Construindo um forum em <span class="caps">PHP</span> e MySQL</a></p>
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
      <td class="code"><pre><span style="color:#369;font-weight:bold">require</span>(?funciones.php?);
<span style="color:#963">$id</span> = <span style="color:#369;font-weight:bold">$_GET</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">id</span><span style="color:#710">"</span></span>];
<span style="color:#963">$citar</span> = <span style="color:#369;font-weight:bold">$_GET</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">citar</span><span style="color:#710">"</span></span>];
<span style="color:#963">$row</span> = <span style="color:#369;font-weight:bold">array</span>(?id? =&gt; <span style="color:#963">$id</span>);
<span style="color:#080;font-weight:bold">if</span>(<span style="color:#963">$citar</span>==<span style="color:#00D">1</span>)
{
  <span style="color:#369;font-weight:bold">require</span>(?configuracion.php?);
  <span style="color:#963">$sql</span> = ?<span style="color:#036;font-weight:bold">SELECT</span> titulo, mensaje, identificador <span style="color:#080;font-weight:bold">AS</span> id ?;
  <span style="color:#963">$sql</span>.= ?<span style="color:#036;font-weight:bold">FROM</span> foro <span style="color:#036;font-weight:bold">WHERE</span> id=?<span style="color:#963">$id</span>??;
  <span style="color:#963">$rs</span> = mysql_query(<span style="color:#963">$sql</span>, <span style="color:#963">$con</span>);
  <span style="color:#080;font-weight:bold">if</span>(mysql_num_rows(<span style="color:#963">$rs</span>)==<span style="color:#00D">1</span>) <span style="color:#963">$row</span> = mysql_fetch_assoc(<span style="color:#963">$rs</span>);
  <span style="color:#963">$row</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">titulo</span><span style="color:#710">"</span></span>] = ?<span style="color:#036;font-weight:bold">Re</span>: ?.<span style="color:#963">$row</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">titulo</span><span style="color:#710">"</span></span>];
  <span style="color:#963">$row</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mensaje</span><span style="color:#710">"</span></span>] = ?[citar]?.<span style="color:#963">$row</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">mensaje</span><span style="color:#710">"</span></span>].?[/citar]?;
  <span style="color:#080;font-weight:bold">if</span>(<span style="color:#963">$row</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">id</span><span style="color:#710">"</span></span>]==<span style="color:#00D">0</span>) <span style="color:#963">$row</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">id</span><span style="color:#710">"</span></span>]=<span style="color:#963">$id</span>;
}
<span style="color:#963">$template</span> = <span style="color:#369;font-weight:bold">implode</span>(?<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">, file(?formulario.html?));
include(?header.html?);
mostrarTemplate(</span><span style="color:#963">$template</span><span style="color:#D20">, </span><span style="color:#963">$row</span><span style="color:#D20">);
include(?footer.html?);
</span></span></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Algumas palavras podem ser familiares para pessoas que entendem inglês já que têm pronúncias similares em inglês, por exemplo: <em>configuracion</em> é <em>configuration</em>, mas e <em>mostrarTemplate</em>? Mesmo <em>formulario</em> dará dores de cabeça a mais de um programador que não saiba Espanhol.</p>
<p>Você também tem que considerar que muitos programadores nem mesmo falam Inglês. Eles podem falar línguas que sequer tem raízes em Latin, para eles já é difícil o suficiente interpretar funções em Inglês como require, echo, etc. Você consegue imaginar um desenvolvedor Chinês tentando entender seu código em Espanhol? Escrever seu código em Inglês é crítico quando se quer trabalhar em um projeto Open Source.</p>
<p>Minha visão é que código deve ser escrito em Inglês: nomes de variáveis, nomes de funções, nomes de classe, campos de dados, etc. Quando digo código, também estou falando de bancos de dados. Existem exceções, objetos nomeados em inglês poderiam ser um problema se o usuário final tiver acesso livre para gerar relatórios, exportar dados, etc.</p>
<p>Não é difícil escrever seu código em Inglês. Use dicionários Espanhol/Ingles (<em>Sua Língua</em>/Inglês – eu recomendo <a href="https://www.wordreference.com/">Word Reference</a>). Não entre em pânico, não é para escrever como Shakespeare, gramática não é necessária. Por exemplo, no código acima, <em>mostrarTemplate</em> poderia ser facilmente modificado para <em>showTemplate</em>.</p>
<p>Mesmo que você não tenha intenções de fazer outsourcing, compartilhar ou vender seu código, ter funções em Espanhol misturado com funções nativas de uma linguagem de programação em particular é uma <strong>má prática</strong> que pode levar a confusões e duplicação de código. Por exemplo, alguém poderia escrever uma função <em>obtenerVariable</em> (obtener significa ‘obter’, em Espanhol), quando já existe uma função chamada <em>getVariable</em> incluso na biblioteca padrão. Se tivesse escrito seu código em inglês e duplicado a função <em>getVariable</em> por engano, é bem possível que o compilador ou interpretador o avisasse. Isso não aconteceria se misturar línguas humanas no seu código.</p>
<p>E sobre comentários dentro de seu código? Embora seja desafiador para muitos que não falam inglês, a realidade é que a maioria dos comentários normalmente tem uma ou duas sentenças. Como disse antes, não é sobre escrever Inglês perfeito. Existem diversas ferramentas que podem ajudá-lo a traduzir sentenças simples. <a href="https://freetranslation.com/">Free Translation</a> é um dos meus favoritos. Mas saiba que essas ferramentas não são 100% perfeitas, traduções de línguas humanas ainda não foram vencidas. Se precisar traduzir um manual, o conteúdo de um website ou as mensagens mostradas ao usuários, por favor, contrate um tradutor profissional.</p>
<p>Não me entenda mal, sou um forte defensor da minha língua materna, Espanhol, mas não sou um idiota. No mundo de hoje, uma empresa estrangeira poderia chegar em você para comprar os direitos do seu produto a qualquer momento. Por exemplo, ano passado o Google comprou o <a href="https://www.panoramio.com/">Panoramio</a>, uma empresa fundada pelo Espanhol <a href="https://www.codespanish.com/archives/profiles/34">Eduardo Manchón</a>. Se seu código for ruim para quem não fala Espanhol, será mais difícil de terceirizar sua manutenção (você estará limitado a programadores que falam espanhóis). Esse último ponto poderia ser tópico de discussão com investidores internacionais.</p>
<p>Goste ou não, Inglês é o Esperanto da tecnologia e dos negócios dos tempos modernos. Você deveria escrever seu código em Inglês.</p>
<p><strong>Nota do Akita:</strong> novamente, sou um <a href="https://www.akitaonrails.com/2007/4/14/off-topic-seja-arrogante">antigo defensor</a> da melhoria da educação pessoal de cada profissional. Cada um é responsável por sua própria capacitação, e ninguém mais. Como disse o autor, aprender – e realmente usar – inglês diariamente não é uma opção, é uma obrigação.</p>
<p>Anos atrás, muitos desenvolvedores reclamaram do código fonte do Ruby porque muita coisa estava documentada em Japonês (!) Imagino que isso deva ter sido um dos motivos que dificulta revoluções maiores no interpretador e a busca por novas alternativas.</p>
<p>Outro caso notório é da <span class="caps">SAP</span>, com sua linguagem <span class="caps">ABAP</span>/4. Provavelmente, 30 anos atrás, os alemães não imaginavam que seu software seria usado no mundo todo. Veja este <a href="https://www.abapcode.info/2007/05/purchase-order-history-mass-display.html">pequeno trecho</a> de código <span class="caps">ABAP</span>:</p>
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
      <td class="code"><pre>IF SUDATE = 'X'.
SORT ITAB BY UDATE EKKEY-EBELN CHANGENR EKKEY-EBELP
EKKEY-ETENR.
ELSEIF SNAME = 'X'.
SORT ITAB BY USERNAME EKKEY-EBELN CHANGENR EKKEY-EBELP
EKKEY-ETENR.
ELSE.
SORT ITAB BY EKKEY-EBELN CHANGENR EKKEY-EBELP EKKEY-ETENR.
ENDIF.
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p><span class="caps">EKKEY</span>, <span class="caps">EBELN</span>, <span class="caps">EBELP</span> … consultores <span class="caps">SAP</span> se acostumam depois de algum tempo, mas tudo isso são acrônimos – que já é ruim – de palavras em alemão! Não é pouco: estamos falando de centenas de milhares de acrônimos como esses, para cada tipo de campo, objeto, tabela em cada módulo empresarial de um pacote que atende Fortune 500. Boa sorte lendo um código desses. <span class="caps">ABAP</span> por definição não é a linguagem mais visualmente agradável de se trabalhar, junte a isso diversos nomes de variáveis, tabelas, funções, APIs, tudo em Alemão. Pior: com comentários de código em alemão! Você não precisa compilar nem nada: o código já é naturalmente obfuscado.</p>
<p>Portanto, façam um favor a todos: escrevam nomes em inglês. Não se trata de nacionalismo, idealismo, ou qualquer coisa assim. Isso é puro pragmatismo.</p>
<p></p>
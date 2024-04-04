---
title: "Ruby on SimpleDB"
date: "2007-12-16T12:06:00.000Z"
tags: ["biography", "insights"]
years: "2007"
---

<p></p>
<p>Bancos de Dados não relacionais é um tema alienígena à grande maioria dos web developers. Na realidade a maioria dos programadores sequer sabe que, o que eles chamam de “banco de dados”, é na realidade um “banco de dados relacional”, ou <a href="http://en.wikipedia.org/wiki/Relational_database_management_system"><span class="caps">RDBMS</span></a>.</p>
<p>A Amazon recentemente anunciou seu novo serviço <a href="http://www.amazon.com/b/ref=sc_fe_c_1_3435361_1?ie=UTF8&amp;node=342335011&amp;no=3435361&amp;me=A36L942TSJ2AJA">SimpleDB</a> ou seu <em>database in the cloud</em>. Ele trabalhará em conjunto com o serviço de storage S3 para prover armazenamento e administração de um <strong>banco de dados orientado a documentos</strong> manipulada através de APIs <span class="caps">SOAP</span>. Veja, o SimpleDB não é relacional, não tem schema, portanto não é orientado a colunas.</p>
<p><a href="http://www.chadfowler.com/2007/12/16/open-source-competition">Chad Fowler</a> acabou de reportar que ele procurou no <a href="http://rubyforge.org/">RubyForge</a> se alguém por acaso já não teria criado algum wrapper para as APIs do SimpleDB e, de fato, elas já existem. Temos os projetos <a href="http://rubyforge.org/projects/aws-simpledb/">aws-simpledb</a>, o <a href="http://rubyforge.org/projects/aws-sdb/">aws-sdb</a> e o <a href="http://rubyforge.org/projects/simpledb/">simpledb</a>. E quem quiser estudar em detalhes o funcionamento das APIs do SimpleDB, deve ver a <a href="http://docs.amazonwebservices.com/AmazonSimpleDB/2007-11-07/GettingStartedGuide/">documentação</a>? da própria Amazon.</p>
<p></p>
<p></p>
<h3>CouchDB</h3>
<p>Esse conceito não é novo, os interessados devem conhecer o <a href="https://www.couchdbwiki.com">CouchDB</a>. Essencialmente os conceitos são os mesmos. Coincidentemente ambos foram escritos em <a href="https://www.erlang.org/faq/t1.html">Erlang</a>, claro por causa das características de paralelismo inerentes a essa linguagem.</p>
<p>Não sei quanto ao CouchDB mas o SimpleDB é baseado no framework <a href="https://en.wikipedia.org/wiki/MapReduce">MapReduce</a> do Google, para suportar processamentos absurdamente paralelos de dados em clusters não-confiáveis.</p>
<p>Segundo este <a href="https://www.automatthew.com/2007/12/amazon-simpledb-and-couchdb-compared.html">site</a>, estas são as características em comum das duas:</p>
<ul>
  <li>Bancos de dados não relacionais</li>
  <li>Sem schema</li>
  <li>Suporte a replicação de dados</li>
  <li>acessados via <span class="caps">HTTP</span></li>
</ul>
<p>E agora, onde eles diferem:</p>
<table>
  <tbody>
    <tr>
      <td>SimpleDB</td>
      <td>CouchDB</td>
    </tr>
    <tr>
      <td>APIs em <span class="caps">SOAP</span> e um pseudo-<span class="caps">REST</span></td>
      <td><span class="caps">REST</span></td>
    </tr>
    <tr>
      <td>chamadas <span class="caps">REST</span> usam apenas <span class="caps">GET</span> com parâmetros</td>
      <td>chamadas <span class="caps">REST</span> usam os verbos <span class="caps">GET</span>, <span class="caps">POST</span>, <span class="caps">PUT</span>, <span class="caps">DELETE</span> com as semânticas corretas</td>
    </tr>
    <tr>
      <td>chamadas especificam o banco de dados, registros, atributos, modificadores com parâmetros de query</td>
      <td>chamadas especificam o banco de dados e o registro via <span class="caps">URL</span>, com parâmetros de query para modificadores</td>
    </tr>
    <tr>
      <td>criação, atualização e deleção são atômicas ao nível individual de atributos</td>
      <td>criação, atualização e deleção são atômicas</td>
    </tr>
    <tr>
      <td>todos os dados são considerados strings <span class="caps">UTF</span>-8</td>
      <td>suporta todos os tipos de dados <span class="caps">JSON</span> (string, number, object, array, true, false, null)</td>
    </tr>
    <tr>
      <td>automaticamente indexa dados</td>
      <td>índices estão no controle do usuário, por ‘views’, definidas com funções Javascript, podem ser armazenadas como documentos, podem ser executadas a qualquer momento, como views temporárias</td>
    </tr>
    <tr>
      <td>queries são limitadas a 5 segundos, com timeout, definidas com parâmetros de query <span class="caps">HTTP</span>, compostas de booleanos e conjuntos de operações com alguns operadores óbvios (=, !=, &gt;, etc)</td>
      <td>queries são essencialmente views, com a adição de modificadores (start_key, end_key, count, descending) fornecidas como parâmetros de query <span class="caps">HTTP</span></td>
    </tr>
    <tr>
      <td>como os valores são string <span class="caps">UTF</span>-8, não há opções de ordenação</td>
      <td>ordenação é flexível e arbitrariamente complexa, já que é baseada em tipos de dados <span class="caps">JSON</span> definidas nas views</td>
    </tr>
    <tr>
      <td>respostas são em <span class="caps">XML</span></td>
      <td>respostas são em <span class="caps">JSON</span></td>
    </tr>
  </tbody>
</table>
<p>Se quiser pesquisar um sistema parecido com o serviço SimpleDB, o CouchDB é uma excelente opção. E ela tem bindings para diversas linguagens, incluindo nosso Ruby, através do <a href="https://www.couchdbwiki.com/index.php?title=Getting_Started_with_Ruby">CouchDb-Ruby</a>.</p>
<p>Copiando o exemplo do seu Wiki, eis como se criaria um banco de dados no CouchDb:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>server = <span style="color:#036;font-weight:bold">Couch</span>::<span style="color:#036;font-weight:bold">Server</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">localhost</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">5984</span><span style="color:#710">"</span></span>)
server.put(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/foo/</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#710">"</span></span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Eis como se criaria um documento:</p>
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
      <td class="code"><pre>server = <span style="color:#036;font-weight:bold">Couch</span>::<span style="color:#036;font-weight:bold">Server</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">localhost</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">5984</span><span style="color:#710">"</span></span>)
doc = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">&lt;&lt;-JSON</span></span><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">
{"type":"comment","body":"First Post!"}</span><span style="color:#710">
JSON</span></span>
server.put(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/foo/document_id</span><span style="color:#710">"</span></span>, doc)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E finalmente, como se busca um documento:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>server = <span style="color:#036;font-weight:bold">Couch</span>::<span style="color:#036;font-weight:bold">Server</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">localhost</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">5984</span><span style="color:#710">"</span></span>)
res = server.get(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/foo/document_id</span><span style="color:#710">"</span></span>)
xml = res.body
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Rails utiliza ActiveRecord, mas podemos facilmente substituir o ActiveRecord da mesma forma como já fazemos com ActiveResource, portanto <a href="https://groups.google.com/group/couchdb/browse_thread/thread/e1eac1af681baae3">não vejo</a> porque não poderíamos ter algumas aplicações usando CouchDB ou SimpleDB como back-end. Alguém se habilita? :-)</p>
<h3>Divagando pela História</h3>
<p>Esse assunto me interessa porque diferente da geração atual mais jovem de programadores, eu comecei com banco de dados não relacionais há quase <strong>20 anos</strong>. Conheci programadores que lidaram com o supra-sumo dos bancos de dados. Se você perguntar a qualquer jovem programador quais os melhores bancos de dados do mundo ele dirá: Oracle – e se for um xiita open source, talvez PostgreSQL. Não que esse bancos não sejam bons, pelo contrário. Porém, ainda são bebês na infância se compararmos com os bancos de dados realmente robustos que rodam há <strong>40 anos</strong> ininterruptos como o <a href="https://en.wikipedia.org/wiki/Information_Management_System"><span class="caps">IMS</span></a> da <span class="caps">IBM</span>. Todo mundo já ouviu falar de <span class="caps">COBOL</span>, mas eis o back end com o qual ele lida: um banco de dados hierárquico não-relacional (e não vamos esquecer do <a href="https://en.wikipedia.org/wiki/CICS"><span class="caps">CICS</span></a>, claro, mas gerenciadores transacionais são outro assunto, e o único com que trabalhei foi o <a href="https://en.wikipedia.org/wiki/Tuxedo_(software)">Tuxedo</a>).</p>
<p>Tenho um grande amigo, ex-<span class="caps">IBM</span>, que lidou diretamente com esse tipo de sistema. Ele não vê graça nenhuma no que nós fazemos hoje. O que sempre me dizia: <em>nós já fazíamos essas coisas 20 ou 30 anos atrás.</em> Quer dizer, não sei porque tanta empolgação em conceitos que já são tão velhos. Muita gente não sabe, mas a <span class="caps">IBM</span> dos anos 60 e 70 criou basicamente tudo que conhecemos hoje como “tecnologia moderna”: sistemas distribuídos, sistemas operacionais com compartilhamento de tempo, gerenciadores transacionais, bancos de dados hierárquicos, bancos de dados relacionais, e-mail, etc.</p>
<p>Inovação <strong>científica</strong> (não trivialidades de consumo) necessariamente vem de laboratórios bem estabelecidos e financeiramente fortes. <span class="caps">IBM</span>, AT&amp;T, Bell Labs, universidades como Berkeley, <span class="caps">MIT</span>, vêm à mente. Basicamente a computação moderna saiu desses institutos.</p>
<p>Também conheci muitos consultores de outras tecnologias que ainda existem e se alguém trabalhar em algum grande banco, ou agências governamentais, talvez ainda encontre o bom e velho banco de dados <a href="https://en.wikipedia.org/wiki/Adabas">Adabas</a>. Ele provavelmente foi o primeiro banco de dados comercial, criado em 1970. Mas o nome mais conhecido é a linguagem para manipular seus dados, o <a href="https://en.wikipedia.org/wiki/NATURAL"><span class="caps">NATURAL</span></a>. Já recebi algumas propostas de Natural alguns anos atrás. Esse produto é da Software AG, empresa alemã que fornecia o banco para ninguém menos que a <span class="caps">SAP</span> AG (se não me engano, as duas empresas ficavam em lados opostos da mesma rua). Então, a <span class="caps">SAP</span> adquiriu o Adabas, rebatizando-o de <span class="caps">SAP</span> DB. Até que recentemente esse banco se tornou o <a href="https://www.sdn.sap.com/irj/sdn/maxdb">MaxDB</a>, que hoje faz parte da família <a href="https://www.mysql.com/sap/">MySQL</a>, e este nome sim, garanto que os jovens de hoje reconhecem.</p>
<p>Outra plataforma que poucos ouvem falar mas vira e mexe eu vejo ou recebo proposta de trabalho: o banco de dados orientado a objetos <a href="https://en.wikipedia.org/wiki/Caché_%28software%29">Caché</a>. Sua principal características: dizem que é o banco mais rápido do mundo (até agora), com seu sistema de estruturas de dados hierárquico em arrays multidimensionais. Nunca notei se havia um nicho de mercado que prefere Caché, mas a <a href="https://www.intersystems.com">InterSystem</a> tem outro produto construído sobre o Caché chamado Ensemble. Recentemente participei de um projeto que substitui o Ensemble de uma grande telecom para <span class="caps">SAP</span>.</p>
<p>Num outro nicho, o mercado de saúde, hospitais, além do Ensemble outro produto que fazia sucesso na sua época foi o bom o velho <a href="https://en.wikipedia.org/wiki/MUMPS"><span class="caps">MUMPS</span></a>. Conheci um consultor de <span class="caps">MUMPS</span> uma vez que migrou para <span class="caps">SAP</span>. Pensem assim: <span class="caps">MUMPS</span> veio <strong><span class="caps">ANTES</span></strong> de C, portanto, diferente das linguagens imperativas atuais, ele não é inspirado em C. A sintaxe parece meio alienígena mas é interessante dar uma olhada.</p>
<p>Meu primeiro ‘banco de dados’, obviamente, foi em Basic. Claro, o mais rudimentar de todos os bancos: uma estrutura de dados de tamanho fixo, um arquivo binário, e navegaçao baseada em offset a partir do tamanho da estrutura, mais um pequeno índice para navegar mais rapidamente. Com 11 ou 12 anos, não se pode exigir mais do que isso. E eu não tinha acesso a grandes mainframes, claro, então <span class="caps">IMS</span> era algo que eu só ouviria falar anos depois.</p>
<p>Mas rapidamente migrei para <a href="https://en.wikipedia.org/wiki/DBASE">dBase</a> <span class="caps">III</span>, da <a href="https://en.wikipedia.org/wiki/Ashton-Tate">Ashton_Tate</a>. O pessoal que desenvolveu o dBase, da <a href="https://en.wikipedia.org/wiki/Jet_Propulsion_Laboratory">Jet Propulsion Labs</a> (<span class="caps">NASA</span>) fez por brincadeira, para rodar sobre CP/M e depois vendeu para a Ashton-Tate. Para quem não se lembra, o antigo MS-<span class="caps">DOS</span> é um clone (mal-feito, claro) de CP/M. Naquela época tínhamos vários clones, como PC-<span class="caps">DOS</span> e DR-<span class="caps">DOS</span>. Coisas que gostava dessa época: eu não tinha nem idéia do que eram estrutura relacional, nem estrutura hierárquica. Para mim haviam apenas tabelas (<span class="caps">DBF</span>) e índices (<span class="caps">NDX</span>, <span class="caps">IDX</span>). Sabia existia redes locais, token ring, compartilhamento de arquivos via Netware, <span class="caps">IPX</span>/<span class="caps">SPX</span> e que DBFs tinham locks baseadas em tabela para que várias pessoas pudessem utilizar <em>quase</em> ao mesmo tempo. Também, sabia que essas estrutura tendiam a se corromper com extrema facilidade e me perguntava como elas conseguiam funcionar :-)</p>
<p>Rapidamente migrei para Clipper Autumn 86 (que estava no fim e eu lembro que tinha sérias limitações de memória no linkeditor, o limite de 500kb) e para o Clipper Summer 87, da Nantucket. O <a href="https://en.wikipedia.org/wiki/Clipper_programming_language">Clipper</a> começou como um compilador de dBase <span class="caps">III</span>. Fiz muitos sisteminhas em Clipper e no começo dos anos 90 migrei para <a href="https://www.foxprohistory.org/tableofcontents.htm#how_it_started">FoxPro</a>. Nessa época esse mercado ficou meio conturbado, a Ashton-Tate foi adquirida pela Borland, a Nantucket foi absorvida pela Computer Associates e a Fox foi para as asas da Microsoft. O Windows ainda estava apenas começando a se popularizar, todas elas lançaram algum produto gráfico, como o Visual dBase, CA-Visual Objects e o Visual FoxPro, respectivamente.</p>
<p>Foi quando comecei a largar o mercado baseado em derivados de dBase e foi para Pascal e Delphi. Mas isso é outra história ;-)</p>
<p></p>
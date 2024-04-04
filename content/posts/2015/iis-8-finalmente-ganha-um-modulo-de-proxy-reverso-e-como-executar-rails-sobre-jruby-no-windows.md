---
title: "IIS 8 finalmente ganha um módulo de Proxy-Reverso! E como executar Rails sobre JRuby no Windows!"
date: "2015-02-16T14:29:00.000Z"
tags: ["rails", "windows"]
years: "2015"
---

<p></p>
<p><strong>TL;DR</strong>: se está familiarizado com os problemas de executar Rails no Windows e já sabe o que é o HttpPlatformHandler, porque devemos usar JRuby no Windows, pule direto pra seção <a href="#configuracao">Configurando Rails da forma Correta para Windows</a> mais pra abaixo.</p>
<p>No dia 4/2 a Microsoft <a href="http://azure.microsoft.com/blog/2015/02/04/announcing-the-release-of-the-httpplatformhandler-module-for-iis-8/">anunciou o módulo HttpPlatformHandler</a>. Então, em 9/2, o conhecido blogueiro <a href="http://www.hanselman.com/blog/AnnouncingRunningRubyOnRailsOnIIS8OrAnythingElseReallyWithTheNewHttpPlatformHandler.aspx">Scott Hanselman fez um blog post</a> explicando como poderíamos usar esse módulo para servir uma aplicação Rails atrás do IIS 8. Depois de um comentário que fiz ele atualizou para demonstrar como servir uma aplicação Rails em cima do JRuby.</p>
<p></p>
<p></p>
<p>O HttpPlatformHandler é um módulo que há anos estava faltando no IIS, e não entendo a razão de porque tanta demora. Todo servidor HTTP tinha um módulo desses por padrão (Apache, NGINX, etc), menos o IIS. E esse módulo é importante para poder repassar uma requisição HTTP do IIS para uma aplicação web que responde HTTP atrás dele (basicamente qualquer coisa que não é PHP, de Python/WSGI a Java). Antes disso era necessário usar um módulo desenvolvido por terceiros ou uma combinação de <a href="https://www.gitshah.com/2013/06/how-to-use-iis7-as-front-end-to-java.html">ARR (Application Request Routing, que é um balanceador de carga) e URL Rewrite</a>, que é tudo menos algo "plug-and-play".</p>
<p>Minha "teoria da conspiração" é que a Microsoft obviamente gostaria que o IIS fosse o único servidor de aplicação e qualquer coisa dinâmica deveria rodar dentro do controle de seus Application Pools, o que era verdade para ASP antigo e .NET. O resto ficaria relegado ao antigo (obsoleto) esquema de sub-processo por requisição de CGI/FastCGI (que é extremamente ineficiente).</p>
<p>Na verdade não precisamos do IIS se quisermos rodar uma aplicação Rails, Java ou qualquer outro no Windows: basta desabilitar o IIS (para não ocupar a porta 80) e fazer o JRuby on Rails/Puma ou Java/JBoss/Tomcat/etc subir na porta 80 e pronto. Por outro lado poderíamos querer executar uma aplicação ASP.NET MVC e outra em Java/JSF na mesma máquina, e aí começa a ficar mais complicado.</p>
<p>Um módulo de proxy-reverso é a solução nesses cenários: agora é possível executar aplicações em quaisquer linguagens na mesma máquina, todas coordenadas com o IIS 8, repassando a requisição quando ele mesmo não tiver como responder. Com a proposta do Azure de querer ser uma plataforma para muitas linguagens e projetos open source, esse componente era muito necessário para colocá-lo em pé de igualdade com NGINX e outros servidores web.</p>
<h2>Por que Rails (ou qualquer coisa diferente de .NET) no Windows?</h2>
<p>Na realidade é a mesma resposta de "por que Java/Python/PHP/etc" no Windows. Na prática, eu diria que se você precisar muito se manter na plataforma Windows - e existem dezenas de razões legítimas pra isso - mantenha-se na stack do .NET, use ASP.NET MVC (ou o vNext que é o próximo). Faça web services com WCF, faça aplicações desktop com WPF. Muitas soluções corporativas precisam integrar diversos componentes como BizTalk, Exchange, Sharepoint, conectar exclusivamente com endpoints SOAP ou COM+ e nesses casos o melhor é ficar no nativo.</p>
<p>Usar algo diferente de .NET significa não somente mudar de linguagem, mas mudar de sistema operacional e toda uma forma de trabalhar e desenvolver que são completamente diferentes. Linguagens de script como PHP, Ruby, Python, Perl dependem bastante do sistema operacional por baixo. Algumas se esforçaram para oferecer mais suporte no Windows, mas eles nunca vão se comportar 100% da mesma forma em dois sistemas operacionais diferentes.</p>
<p>O <a href="https://technet.microsoft.com/en-us/library/bb496993.aspx">próprio Technet da Microsoft</a> tem vários artigos detalhando as diferenças (tanto técnicas quanto filosóficas) e se procurar no Google vai achar centenas de artigos (muitos meramente pedantes e trolls, evite-os) detalhando mais sobre essas diferenças, principalmente nos aspectos de <a href="https://www.kernelthread.com/publications/security/uw.html">segurança</a>.</p>
<p>Extensões nativas precisam ser escritas levando em consideração APIs, chamadas de baixo nível de sistema muito diferentes. Windows e Linux/Unix são animais diferentes, gerenciam memória de formas diferentes, lidam com I/O (sistema de arquivos, rede) de formas diferentes. Daí é necessário programar uma "camada intermediária" que tenta abstrair as duas coisas. PHP é de longe o que tem mais "wrappers" prontos para ambos os sistemas, Python vem na sequência. Ruby não tem histórico de uso no Windows por isso tem menos wrappers.</p>
<p>Existem várias ferramentas do mundo Linux que um desenvolvedor no Windows não está acostumado a usar. Coisas que vão desde coisas simples como um simples wget ou curl até coisas mais complexas como GDB ou DTrace. Por isso mesmo não é simples para um programador Windows migrar para qualquer outra plataforma diferente de .NET.</p>
<p>Mesmo assim, pode ser muito útil saber o básico de algumas linguagens pois daí é possível tirar vantagens de instalar um Wordpress (PHP), ou um Plone (Python) e até mesmo no caso de Rails usar aplicações excelentes como Redmine, Discourse, Spree, FatFreeCRM, e várias outras aplicações de código aberto, sem precisa duplicar esforços e refazê-los em .NET. Ou então usar as excelentes ferramentas que temos para criar CRUDs rápidos usando Rails + Devise + ActiveAdmin por exemplo. Existem várias razões para tirar proveito das excelentes ferramentas do ecossistema Rails que não existem no mundo ASP.NET MVC.</p>
<p>Por essas razões, o Ruby no Windows nunca será tão bom quanto o Ruby no Linux/OS X, nem mesmo PHP ou Perl será tão bom no Windows quanto é no Linux, no mesmo hardware. Um exemplo prático mais notável: <a href="https://stackoverflow.com/questions/21732566/linux-fork-function-compared-to-windows-createprocess-what-gets-copied">Windows não tem o conceito e nem a implementação de fork()</a>, algo essencial para nossos servidores de aplicação Ruby como Unicorn, Puma, Thin, etc. Por isso mesmo, rodar Rails usando o servidor padrão, Webrick, não é aceitável em produção. Ele vai ter um único processo e responder a apenas uma requisição de cada vez, sem possibilidade de responder conexões simultâneas.</p>
<p>Isso dito, no caso específico de Ruby, existe uma ótima solução e é <a href="https://jruby.org">JRuby</a>, que permite executar código Ruby dentro da máquina virtual Java. Em resumo, uma aplicação inteira feita em Ruby on Rails, com pequenas modificações (por exemplo, instalando o driver JDBC pra acessar banco de dados), pode ser executado no ambiente Java, com todas as vantagens que ele oferece como melhor performance e capacidade para multithreading real.</p>
<p>O motivo disso é que Java roda sobre a Java Virtual Machine (JVM) que, como o próprio nome diz, é literalmente uma máquina virtual (de um jeito tosco, pense nele como um VirtualBox, com outro sistema operacional rodando virtualmente). A JVM abstrai completamente o sistema operacional por baixo e é como se fosse um micro-sistema operacional próprio. De fato, já houve a tentativa de se fazer um <a href="https://en.wikipedia.org/wiki/JavaOS">Java OS</a> inteiro que não necessitaria de um outro sistema como Linux ou Windows pra executar.</p>
<p>Feito isso, podemos colocar uma aplicação Rails, com boa performance, com boa concorrência, integrado com banco de dados como SQL Server ou Oracle, atrás do IIS, rodando lado a lado com aplicações feitas em .NET.</p>
<p><a name="configuracao"></a></p>
<h2>Configurando Rails da forma Correta para Windows</h2>
<p>A partir daqui vou assumir que você é um desenvolvedor familiarizado com o ambiente Windows e sabe como usar <a href="https://www.microsoft.com/web/downloads/platform.aspx">Web Platform Installer</a>, onde procurar instaladores, não estranha em usar o Command Prompt e sabe como instalar os seguinte componentes básicos:</p>
<ul>
  <li>IIS 8</li>
  <li>SQL Server 2008 R2</li>
  <li>Java 1.8</li>
</ul>
<p>E antes de realmente começar precisamos configurar algumas coisas.</p>
<p>No caso de Java, também precisamos antes instalar o <a href="https://www.oracle.com/technetwork/java/javase/downloads/jce8-download-2133166.html">Java Cryptography Extension (JCE) Unlimited Strength Jurisdiction Policy</a> que é um tosco arquivo zip cujos arquivos precisam ser manualmente copiados no diretório de policies do JRE:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/481/Screen_Shot_2015-02-13_at_14.13.41.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/481/Screen_Shot_2015-02-13_at_14.13.41.png 2x" alt="JCE"></p>
<p>Depois disso precisamos fazer o SQL Server se ligar à porta TCP 1433. Para isso instale e abra o SQL Server Configuration Manager, habilite o TCP/IP e na tela de propriedades apague o que estiver em "TCP Dynamic Ports" e coloque "1433" em TCP Port. Precisa fazer isso em todos os campos.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/482/Screen_Shot_2015-02-13_at_14.18.37.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/482/Screen_Shot_2015-02-13_at_14.18.37.png 2x" alt="SQL Server Configuration Manager"></p>
<p>Agora, baixe <a href="https://github.com/akitaonrails/jruby_windows_demo">meu código do Github</a> em alguma pasta. Se não for diretamente dentro do C:\inetpub\wwwroot precisa adicionar o usuário IIS_IUSRS para ter acesso a todos os subdiretórios:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/483/Screen_Shot_2015-02-13_at_14.16.34.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/483/Screen_Shot_2015-02-13_at_14.16.34.png 2x" alt="Permissões"></p>
<p>A partir de um Command Prompt, entre no diretório do projeto e execute:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>jruby -S bundle install
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso deve instalar todas as dependências que estão listadas no arquivo <tt>Gemfile</tt> cujas partes mais importantes são:</p>
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
      <td class="code"><pre><span style="color:#777"># Bundle edge Rails instead: gem 'rails', github: 'rails/rails'</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rails</span><span style="color:#710">'</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">4.1.9</span><span style="color:#710">'</span></span>
<span style="color:#777"># Use jdbcsqlite3 as the database for Active Record</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">jdbc-mssql-azure</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activerecord-jdbc-adapter</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">activerecord-jdbcmssql-adapter</span><span style="color:#710">'</span></span>
<span style="color:#777"># ...</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">puma</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">jruby-openssl</span><span style="color:#710">'</span></span>, <span style="color:#606">require</span>: <span style="color:#069">false</span>
<span style="color:#777"># ...</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">tzinfo-data</span><span style="color:#710">'</span></span>, <span style="color:#606">platforms</span>: [<span style="color:#A60">:mingw</span>, <span style="color:#A60">:mswin</span>, <span style="color:#A60">:x64_mingw</span>, <span style="color:#A60">:jruby</span>]
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As partes importantes:</p>
<ul>
  <li>Use Rails 4.1 e não 4.2 pois muitas gems ainda não estão totalmente compatíveis até o momento deste post.</li>
  <li>Use <a href="https://github.com/MikeEmery/jdbc-mssql-azure">drivers JDBC</a> pois estaremos rodando dentro da JVM, e para isso funcionar é necessário um <a href="https://github.com/jruby/activerecord-jdbc-adapter/tree/master/activerecord-jdbcmssql-adapter">adapter de activerecord</a>.</li>
  <li>Vamos usar <a href="https://github.com/puma/puma">Puma</a> como servidor Web em vez do padrão Webrick, que é muito melhor por suportar multi-thread na JVM.</li>
  <li>Precisamos adicionar o pacote <a href="https://github.com/jruby/jruby-openssl">jruby-openssl</a> pois o Windows não tem suporte nativo a OpenSSL e também o <a href="https://github.com/tzinfo/tzinfo-data">tzinfo-data</a> pois o Windows também não tem dados de time zones facilmente acessíveis (lembram quando falei das várias coisas diferentes entre sistemas operacionais, estes são exemplos de pacotes pra cobrir buracos desse tipo).</li>
</ul>
<p>Finalmente, configure uma nova aplicação no IIS dentro do Default Web Site, numa sub-pasta chamada "rails":</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/484/Screen_Shot_2015-02-13_at_14.16.13.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/484/Screen_Shot_2015-02-13_at_14.16.13.png 2x" alt="IIS"></p>
<p>Uma aplicação Rails, por padrão, não é feito para funcionar numa sub-pasta, mas este trecho no arquivo <tt>config.ru</tt> garante que isso vai funcionar:</p>
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
      <td class="code"><pre><span style="color:#036;font-weight:bold">Rails</span>.application.config.relative_url_root = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">/rails</span><span style="color:#710">'</span></span>
map <span style="color:#036;font-weight:bold">Rails</span>.application.config.relative_url_root || <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span>
  run <span style="color:#036;font-weight:bold">Rails</span>.application
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você vai precisar criar um banco de dados chamado "jruby_demo" ou outro nome que você pode configurar no arquivo <tt>config/database.yml</tt>. Note que você precisa modificar também o usuário e senha nesse arquivo para conseguir se conectar ao seu banco. Nesse caso significa que precisa usar <a href="https://msdn.microsoft.com/en-us/library/ms144284.aspx">SQL Server Authentication</a> e não o padrão Windows Authentication.</p>
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
      <td class="code"><pre><span style="color:#606">default</span>: <span style="color:#037">&amp;default</span>
  <span style="color:#606">adapter</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">jdbcmssql</span></span>
  <span style="color:#606">driver</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">com.microsoft.sqlserver.jdbc.SQLServerDriver</span></span>
  <span style="color:#606">url</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">'jdbc:sqlserver://localhost;databaseName=jruby_demo'</span></span>
  <span style="color:#606">username</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">sa</span></span>
  <span style="color:#606">password</span>: <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#D20">abcd1234</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se estiver configurado corretamente, agora podemos usar o processo de migrations do ActiveRecord para criar tabelas e subir dados de exemplo, executando o seguinte na linha de comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>jruby -S rake db:migrate db:seed
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para o IIS 8 conseguir carregar corretamente o JRuby, você precisa configurar o arquivo <tt>Web.config</tt>:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#579">&lt;?xml version="1.0" encoding="UTF-8"?&gt;</span>
<span style="color:#070">&lt;configuration&gt;</span>
    <span style="color:#070">&lt;system.webServer&gt;</span>
        <span style="color:#070">&lt;handlers&gt;</span>
            <span style="color:#070">&lt;add</span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">httpplatformhandler</span><span style="color:#710">"</span></span> <span style="color:#b48">path</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">*</span><span style="color:#710">"</span></span> <span style="color:#b48">verb</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">*</span><span style="color:#710">"</span></span> <span style="color:#b48">modules</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">httpPlatformHandler</span><span style="color:#710">"</span></span> <span style="color:#b48">resourceType</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Unspecified</span><span style="color:#710">"</span></span> <span style="color:#b48">requireAccess</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Script</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
        <span style="color:#070">&lt;/handlers&gt;</span>
        <span style="color:#070">&lt;httpPlatform</span> <span style="color:#b48">stdoutLogEnabled</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">true</span><span style="color:#710">"</span></span> <span style="color:#b48">stdoutLogFile</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">rails.log</span><span style="color:#710">"</span></span> <span style="color:#b48">startupTimeLimit</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">60</span><span style="color:#710">"</span></span> <span style="color:#b48">startupRetryCount</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">5</span><span style="color:#710">"</span></span> <span style="color:#b48">processPath</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">c:\jruby-1.7.19\bin\jruby.exe</span><span style="color:#710">"</span></span>
                  <span style="color:#b48">arguments</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">-S puma --env production --dir C:\Users\Fabio\Projects\jruby_demo2 -p %HTTP_PLATFORM_PORT%</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>
            <span style="color:#070">&lt;environmentVariables&gt;</span>
                <span style="color:#070">&lt;environmentVariable</span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">JAVA_HOME</span><span style="color:#710">"</span></span> <span style="color:#b48">value</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">C:\Program Files\Java\jre1.8.0_31</span><span style="color:#710">"</span></span><span style="color:#070">/&gt;</span>
                <span style="color:#070">&lt;environmentVariable</span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">SECRET_KEY_BASE</span><span style="color:#710">"</span></span> <span style="color:#b48">value</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">4a8f4bb5de3637e9fab1f3c8fb6e3a787f60a811d6b36ff8d77a3371a31d19f7a93cfb48597d8263f46748c729b291a0277e6e819a869c4f8edf9445595e5548</span><span style="color:#710">"</span></span><span style="color:#070">/&gt;</span>
            <span style="color:#070">&lt;/environmentVariables&gt;</span>
        <span style="color:#070">&lt;/httpPlatform&gt;</span>
    <span style="color:#070">&lt;/system.webServer&gt;</span>
<span style="color:#070">&lt;/configuration&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Preste atenção aos diretórios no arquivo para refletirem onde estão essas coisas na sua máquina, sem isso estar correto, nada vai carregar.</p>
<p>Feito isso, você já deve conseguir carregar a URL "https://localhost/rails" num navegador. Como é JRuby a primeira requisição vai demorar alguns segundos pra carregar (até a JVM terminar de carregar). Mas depois disso vai ficar tudo rápido.</p>
<p>Uma coisa diferente entre o HttpPlatformHandler e um módulo normal de proxy-reverso é que além de fazer o papel de proxy reverso ele também controla o ciclo de vida da aplicação por trás, no caso o JRuby + Puma. E também controla em que porta a aplicação vai ficar escutando (pela variável de ambiente "HTTP_PLATFORM_PORT").</p>
<p>Sobre aplicações Rails, não se esqueça que todos tem um "SECRET_KEY_BASE" diferente. Sempre gere um novo através da linha de comando <tt>jruby -S rake secret</tt>.</p>
<p>Se tudo foi feito corretamente, você deveria conseguir ver o seguinte no navegador:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/485/Screen_Shot_2015-02-13_at_14.12.18.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/485/Screen_Shot_2015-02-13_at_14.12.18.png 2x" alt="JRuby Demo"></p>
<p>A partir daqui você pode evoluir a aplicação, criar mais models, mais controller, adicionar frameworks CSS como Bourbon (pois o Asset Pipeline vai funcionar corretamente usando o <a href="https://github.com/mozilla/rhino">Rhino</a> como runtime Javascript no lugar do V8).</p>
<p></p>
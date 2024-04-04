---
title: "Quais são algumas das piores práticas para aplicações Ruby on Rails?"
date: "2013-03-24T15:45:00.000Z"
tags: ["rails"]
years: "2013"
---

<p></p>
<p>Alguns dias atrás me pediram para responder no Quora a pergunta <a href="http://qr.ae/TkQ3N">"Ruby on Rails: Quais são algumas das piores práticas para aplicações Ruby on Rails?"</a>. Foi uma resposta que teve muitos votos positivos então resolvi que seria um bom post para meu blog. Segue minha versão extendida.</p>
<p>Existem diversas práticas ruins em desenvolvimento de aplicações em geral e em particular em Ruby on Rails. Eu mesmo já cometi e aprendi sobre várias elas na prática e em particular tive que pegar alguns projetos de resgate onde continuo vendo os mesmos erros acontecendo repetidamente, então vamos tentar resumir as principais que mais me irritam.</p>
<p></p>
<p></p>
<p><strong>1)</strong> Primeiro de tudo é a ausência de testes, ou cobertura muito pequena, ou testes que são muito frágeis. Pessoal, isso é uma coisa básica! Se ainda não fazem isso comecem imediatamente a adicionar os malditos testes! Quanto pior for a qualidade e cobertura dos testes proporcionalmente mais caro fica manter e expandir uma aplicação, ponto final. Codificadores que não escrevem testes demonstram muito pouco respeito pela sua própria prática.</p>
<p>Já discutimos ad nauseaum (dica pra começar: <a href="https://pragprog.com/book/achbd/the-rspec-book">"The RSpec Book"</a>) sobre testes nos últimos anos então o que não falta é material para aprender e as melhores práticas. Não me importo se os testes são feitos "by the book" escrevendo testes antes do código ou se os testes são adicionados depois do código, contanto que no final existam testes que eu possa executar e ter segurança de que não estou criando bugs de regressão, quebrando coisas que não deveria. Não custa quase nada adicionar os testes mínimos, então adicionem.</p>
<p>Ultimamente tivemos diversos problemas de segurança, muita gente simplesmente atualizou suas gems para as mais recentes para pegar as correções. Somente quem tinha bons testes viu que algumas dessas correções <a href="https://blog.bugsnag.com/2013/03/20/rails-3-2-13-performance-regressions-major-bugs/">introduziam regressões</a>. Quem não testou e só atualizou acabou colocando no ar versões com bugs.</p>
<p><strong>2)</strong> Escreva nomes em inglês dentro do seu código. Não me importo se você é brasileiro, italiano, francês ou o que for. Nomes de classes, de variáveis, de métodos, tudo deve ser em inglês. Estamos num mundo globalizado, não é pensar muito longe que amanhã um americano vai mexer no seu código todo em português. Além do problema de consistência: a sintaxe da linguagem, todas as bibliotecas padrão, é tudo em inglês. É uma enorme dissonância cognitiva ter nomes em português no meio. É como você estar lendo uma revista em português com diversos parágrafos em inglês no meio. Não faz nenhum sentido.</p>
<p>E aproveitando outra coisa que muitos não fazem: não é obrigatório usar o sistema de <a href="https://guides.rubyonrails.org/i18n.html">localização do Rails</a>. Porém no primeiro momento onde você se ver adicionando strings de mensagens dentro de models e controllers, pare! Existe local para isso, e é em <tt>config/locales</tt>. Não tem nada pior do que achar dezenas de mensagens espalhadas por todas as classes.</p>
<p><strong>3)</strong> Hoje existem diversos frameworks e bibliotecas para front-end, seja para stylesheet (Bourbon, Bootstrap, Compass), para javascript (jQuery, Ember, Angular, Backbone), e diversas ferramentas (Sass, Coffeescript). Além disso temos toda uma <a href="https://akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">convenção e estruturas</a> em <tt>app/assets</tt> para organizar tudo issso. Parem de colocar styles e javascript inline espalhados pelas views! É sintoma de preguiça, de falta de conhecimento e tentativa de pular passos fazendo gambiarras. Não faça isso!</p>
<p><strong>4)</strong> Não tente ser mais esperto do que seu ORM (Object Relational Model), no caso o ActiveRecord. Na enorme maioria dos casos, se você estiver usando <tt>find_by_sql</tt> por motivos de otimizar "performance", você está fazendo a coisa errada. Pior ainda, em quase todos os casos que já vi essa tentativa de otimizar na mão não só não havia esse ganho como ainda já vi adicionando buracos de segurança, como o famigerado <a href="https://rails-sqli.org">"SQL Injection"</a>. Aliás, esse é um tema frequente: otimização prematura e desnecessária adicionando bugs de segurança.</p>
<p>Talvez 1% dos maiores sites do mundo precisem de SQLs realmente específicos otimizados manualmente depois de muitos testes em produção, com volume de dados e métricas bem definidas para provar a diferença. Mas a maioria de nós está nos 99% que não precisa disso: apenas aprenda a usar o ActiveRecord corretamente.</p>
<p>Por exemplo, o problema fazer N+1 queries desnecessariamente, como está explicado no <a href="https://guides.rubyonrails.org/active_record_querying.html#eager-loading-associations">guia oficial de ActiveRecord</a> e que eu copio aqui:</p>
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
      <td class="code"><pre>clients = <span style="color:#036;font-weight:bold">Client</span>.limit(<span style="color:#00D">10</span>)
clients.each <span style="color:#080;font-weight:bold">do</span> |client|
  puts client.address.postcode
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esse código vai fazer 11 queries no banco. A primeira para buscar 10 clientes e depois no loop para buscar o endereço de cada cliente. Isso é tão óbvio que ninguém deveria estar caindo mais nisso. O correto é fazer:</p>
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
      <td class="code"><pre>clients = <span style="color:#036;font-weight:bold">Client</span>.includes(<span style="color:#A60">:address</span>).limit(<span style="color:#00D">10</span>)
clients.each <span style="color:#080;font-weight:bold">do</span> |client|
  puts client.address.postcode
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nesta versão já estamos puxando os endereços ao mesmo tempo que puxamos os clientes, em apenas 2 queries: uma para puxar os clientes e uma única pra puxar todos os endereços de todos os clientes. Não precisou escrever nenhum SQL na mão, bastou saber usar o ActiveRecord corretamente para cair de 11 para 2 queries.</p>
<p>Complementando e enfatizando: aprendam tudo sobre as as APIs do ActiveRecord e como as queries são montadas. Uma coisa horrorosa que já vi diversas vezes foram tentativas de ser "esperto" e fazer código como este:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Subscription</span>.all.select { |s| s.expired? }.each { |s| s.destroy }
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para ficar claro: isso <strong>NÃO</strong> é "usar as funcionalidades funcionais de Ruby". Isso é ser ignorante quanto bancos de dados e ORMs em geral. Só para ficar absolutamente claro, esse código deveria ser assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#036;font-weight:bold">Subscription</span>.where(expired: <span style="color:#069">true</span>).destroy_all
<span style="color:#036;font-weight:bold">Subscription</span>.destroy_all(expired: <span style="color:#069">true</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Lembrando que <tt>destroy</tt> permite chamar regras de negócio para cada objeto destruído e se usar <tt>delete</tt> é um comando simples SQL para apagar do banco apenas. Depende o que você pretende fazer ao destruir o objeto. Além disso o campo "expired" deveria ser um <a href="https://guides.rubyonrails.org/active_record_querying.html#scopes">escopo</a> dentro do model. Como podem ver, uma simples linha pode ter múltiplas opções dependendo do que se pretende fazer. Novamente não tente ser mais esperto do que o ORM, ele provavelmente já tem tudo que você está imaginando, então não reinvente a roda e leia as APIs.</p>
<p>Outros sintomas básicos que já vi: chamar <tt>save(validate: false)</tt>. Se você está desativando a validação que você ou sua equipe colocou, o que está acontecendo? Existem sim, casos específicos de cargas de dados controlados que talvez possam precisar disso. Na maior parte dos casos não precisa. Na maior parte dos casos é o programador que teve preguiça de entender a aplicação fazendo uma gambiarra pra cumprir sua tarefa de forma "rápida" e largou uma bomba relógio pra trás (falta de testes esconde erros que esse tipo de ação causa).</p>
<p><strong>5)</strong> Não use um banco de dados NoSQL a menos que você tenha uma explicação técnica objetiva com argumentos que justifiquem a qualquer um de forma incontestável o porquê dessa escolha. Digo isso porque a maioria das vezes que alguém me falou em usar um MongoDB a resposta cai nas linhas do "vai que um dia precisamos". E não, a maioria de vocês não precisa de um banco de dados NoSQL. Para começar a maioria sequer entende a diferença entre documentos com schema flexível (MongoDB, CouchDB), estruturas de chave-valor (Redis, Riak), ou estruturas orientadas a coluna (Cassandra).</p>
<p>Primeiro que não sabem que existem esses diferentes tipos, então não sabem qual desses é o que realmente resolve seu problema, finalmente não tem idéia do trabalho que é dar manutenção em produção desse tipo de infraestrutura. Aprendam o seguinte: usem bancos de dados relacionais, de preferência PostgreSQL. Vocês não precisam de mais do que isso. Na maior parte do tempo é a preguiça de entender o modelo entidade-relacional e achar que o modelo NoSQL é "mais fácil".</p>
<p>Na minha experiência, ainda não cruzei com um projeto onde a presença de um banco NoSQL fosse indispensável. Em todos os casos que vi, eles acabavam fazendo o que um PostgreSQL faria com as duas mãos nas costas. <em>"Ah, mas eu preciso fazer operações de geolocalização"</em>. Avaliem o <a href="https://github.com/dazuma/activerecord-postgis-adapter">PostGIS</a>. <em>"Ah, mas eu tenho alguns atritutos dinâmicos que variam, então preciso de uma schema flexível"</em>. Não necessariamente, provavelmente o suporte <a href="https://github.com/engageis/activerecord-postgres-hstore">HStore</a> é tudo que você precisa.</p>
<p>Outros casos básicos: usar o banco de dados de produção pra produzir relatórios pesados. Ou o caso mais básico: ter apenas uma instância de banco para leitura e escrita. Não custa nada fazer o básico: uma instância master que é read-write e outra slave que é read-only. Mande as operações de escrita pra master e queries complicadas que consomem processamente para a slave. Mais do que isso, aprenda que a configuração padrão de todo banco de dados é ruim. Aprenda a fazer o tuning básico.</p>
<p>Em resumo: a maioria dos projetos ruins que peguei demonstravam baixo nível de entendimento tanto de bancos de dados relacionais em geral, baixo conhecimento de SQL (índices pessoal! índices!), e por consequência uso muito pobre do ActiveRecord.</p>
<p><strong>6)</strong> Falando nisso, outra coisa irritante é pegar um projeto que precisa de mais do que um <tt>bundle</tt> e <tt>rake db:migrate</tt> pra começar a funcionar. Seja porque tem um SOLR a ser configurado, um Redis, alguns rake tasks customizados que precisam ser executados, etc. Pessoalmente, existe um arquivo chamado <tt>README</tt> na raíz de todo projeto que não está lá de enfeite! Não vai custar 1 minuto preencher as informações básicas do ambiente nesse arquivo e economizar horas da sua equipe e dos programadores que vão herdar seu sistema no futuro. Ou você mesmo, que vai passar um tempo sem mexer nesse sistema e quando voltar vai ter que se lembrar de todos os detalhes.</p>
<p>Aliás, aprenda o básico de administração de sistemas Unix-like (Linux) antes de sair reclamando que Ruby é lento, que bancos de dados relacionais são lentos, que o framework é inseguro. Como você pode reclamar da segurança do framework se todas as portas dos seus servidores estão abertos publicamente??</p>
<p><strong>7)</strong> E falando em qualidade de código, cobertura de testes e segurança, usem as ferramentas que a comunidade criou e que vão ajudar muito na manutenção dos projetos. O <a href="https://codeclimate.com">CodeClimate</a> vai checar a qualidade geral do seu código e também da segurança. Cheque o tempo todo, qualquer coisa abaixo de nível 3 é ruim. Configurem seu projeto no <a href="https://travis-ci.org">Travis-CI</a> e, finalmente, executem o <a href="https://brakemanscanner.org">Brakeman</a> e atualize essa gem em particular constantemente. Isso vai garantir o mínimo do mínimo do seu projeto.</p>
<p><strong>8)</strong> Eu gosto de usar os gráficos de projetos do Github. Ele conta muito sobre os programadores envolvidos no projeto. E antes que alguém diga, não, não é a comparação de quantidade de linhas de códigos ou quantidade absoluta de commits. É o comportamento individual comparado no tempo. Depois de algumas semanas é possível ver o que seria o "normal" desse programador. Então você começa a ver que a produtividade começa a cair, especialmente nas primeiras semanas, então próximo à entrega vê que dá picos. Normalmente isso é o programador que começou subestimando as tarefas do projeto e perto da entrega se desespera e começa a vomitar código. Comportamento muito ruim porque isso leva a pular passos como pular testes, escrever código sem cuidado, sem segurança e fazendo tudo que eu falei acima que não era pra fazer.</p>
<p>Quando esse comportamento começa a acontecer você vê o sintoma seguinte: programador reclamando do projeto, reclamando que o gerenciamento está ruim, que o cliente é ruim, que o projeto é ruim. São as desculpas mais comuns de péssimos programadores que cometeram erros e jogam seus erros nos outros. Impressionante como esse comportamento tem alta correlação com o tipo de gráfico que mencionei no Github.</p>
<p>Nessa mesma linha vamos combinar: código que está somente na sua máquina não está "pronto". Pronto significa já no repositório, passando todos os testes no Travis-CI, feito deployment em produção e sem gerar bugs de regressão ou bugs de usabilidade que os clientes/usuários descobrem sozinhos na primeira vez que usam a nova versão. Aliás, por que diabos você saiu do escritório sem colocar o código em produção? Não há desculpa para isso. Cansei de ver programadores que "esquecem" de colocar o código em produção. O que você estava esperando? Um convite formal? Programador que demora pra colocar o código no repositório está fazendo as coisas erradas. Já mandei funcionários embora que depois dizem <em>"ah, faltou eu fazer push do código no repositório"</em>. O que é isso? Tentativa amadora de fazer código como refém?</p>
<p>Bullshit!</p>
<p>Essas são algumas más-práticas. Existem mais, quais são as piores que você já viu? Comentem e eu vou incorporar as mais interessantes no artigo também.</p>
<p></p>
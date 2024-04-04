---
title: "[Small Bites] IDEs e Editores, como escolher?"
date: "2014-07-31T22:54:00.000Z"
tags: ["ide"]
years: "2014"
---

<p></p>
<p>Todo ano, em toda lista de discussão, algum iniciante sempre vai perguntar: <em>"Que IDE devo usar?"</em> E isso vai gerar sempre todo tipo de flame war.</p>
<p><a href="http://www.jetbrains.com/ruby/"><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/458/Screen_Shot_2014-08-01_at_15.09.35.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/458/Screen_Shot_2014-08-01_at_15.09.35.png 2x" alt="RubyMine"></a></p>
<p>O TL;DR para este post é o seguinte:</p>
<ul>
  <li>Se quiser 100% open source e old school: Vim com <a href="https://github.com/robbyrussell/oh-my-zsh">Oh-My-Zsh</a> ou <a href="https://github.com/skwp/dotfiles">YADR</a>.</li>
  <li>Se quiser 100% open source e hipster: <a href="https://atom.io">Atom.io</a>, que é o editor feito em Javascript pelo Github.</li>
  <li>Se quiser o melhor moderno, mas comercial: <a href="http://www.sublimetext.com">Sublime Text</a>. Não é barato, a USD 70, mas garanto que vale cada centavo, especialmente aliado ao <a href="https://sublime.wbond.net">Package Control</a></li>
  <li>Se quiser o melhor old school, mas comercial: <a href="http://macromates.com">Textmate</a>, está estagnado há anos desde que se tornou o favorito dos Railers na era 2006-2009, mas a versão 1.5.x (não a 2.0) é muito boa, e eu pessoalmente ainda uso para várias coisas ainda hoje.</li>
  <li>Se quiser uma IDE de verdade, com ferramentas mais avançadas para refactoring e debugging, definitivamente use <a href="http://www.jetbrains.com/ruby/">RubyMine</a>. Custa USD 99 e vale cada centavo, ou se você mantém projetos open source, pode requisitar uma licença gratuita</li>
  <li>Se for somente um montador de front-end, uma opção para Mac que parece interessante é o <a href="https://panic.com/coda/">Coda 2</a>, disponível na App Store.</li>
</ul>
<p>Aliás, para entender uma diferença crucial de filosofias entre Vim e Atom/Sublime/Textmate, leia este ótimo artigo <a href="https://medium.com/@mkozlows/why-atom-cant-replace-vim-433852f4b4d1">"Why Atom Can’t Replace Vim"</a>. Vim, assim como Emacs, tem uma filosofia própria.</p>
<p></p>
<p></p>
<h2>Qual escolher?</h2>
<p>Emacs, assim como Vim, é uma boa opção também, mas como não sou especialista em ELisp, vou deixar passar. Mas pra quem se interessa em se aprofundar em hacking old school, vai fundo! Aliás, o miner Andrew me indicou o pacote <a href="https://github.com/bbatsov/prelude">Prelude</a>, feito pelo <a href="https://github.com/bbatsov">Bozhidar Batsov</a>, o mesmo do Rubocop, ruby-style-guide, etc. Outros que não listei como Dreamweaver, obviamente é o extremo oposto: não use.</p>
<p>Textmate é somente para pessoas como eu, que pegaram Rails entre 2005 e 2009. É difícil largar ele mesmo com novas opções. Se você nunca usou, não vai sentir falta. O Sublime Text veio pra substituí-lo e faz tudo que o Textmate faz, com a vantagem que tem opções pra Windows e Linux. O Atom.io é a mesma coisa que o Sublime, mas um pouco mais lento, por outro lado é grátis, então é uma escolha de custo-benefício. E eu vou dizer que minha sensação é que é mais lento se considerar que estou acostumado com Vim. Se nunca usou Vim ou mesmo Sublime/Textmate, talvez não note.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/444/Screen_Shot_2014-07-31_at_19.32.32.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/444/Screen_Shot_2014-07-31_at_19.32.32.png 2x" alt="Textmate Classic"></p>
<p>O RubyMine é da excelente família de IDEs da JetBrains, que desde os anos 90 se manteve como uma das melhores IDEs Java com o <a href="https://www.jetbrains.com/idea/">IntelliJ</a>, que sempre teve o melhor conjunto de auxílios para refatoramento. Depois da decaída dos fabricantes de IDEs, como Borland, a JetBrains foi quem se manteve firme e forte, implementando qualidade. Eles evoluíram e, se você for desenvolvedor .NET é quase obrigatório instalar o <a href="https://www.jetbrains.com/resharper/">ReSharper</a> para vitaminar o magro Visual Studio. Se você é desenvolvedor Python, vai gostar muito do <a href="https://www.jetbrains.com/pycharm/">PyCharm</a>.</p>
<p>O RubyMine faz tudo que eu considero importante como editor (que é o que vamos listar abaixo) e mais, então vou deixar para um outro post exclusivamente sobre RubyMine. Aguardem!</p>
<p>Voltando ao assunto, um bom editor de textos precisa de poucas coisas pra funcionar decentemente:</p>
<p>Esqueça o Vim-mode onde você "acha" que vai se tornar um programador mais rápido porque sabe deletar 10 linhas pra baixo fazendo a combinação d10j em vez de selecionar as linhas com o mouse e apagar ou selecionar usando shift+setas e apagar. A maioria dos desenvolvedores não escrever uma média maior que 50 linhas de código por dia durante um ano. Tem dias que digita 1000, tem dias que digita 0. Se vai ficar se preocupando se digitou 10 caracteres a mais, ou a menos, faça alguma coisa sobre os dias que ficou procrastinando com Dota 2 ou YouTube. Quantidade de keystrokes, pra granda maioria dos desenvolvedores, é uma desculpa para tentar mostrar que entende mais do que acha que sabe.</p>
<p>Produtividade é uma questão de <strong>FOCO</strong>. Faça uma coisa de cada vez, prioridade no que está fazendo. Se está programando, desligue as notificações do sistema operacional, deixe seus comunicadores em "Away" ou "Busy" e elimine interrupções. Veja Facebook, YouTube e jogue Dota no fim do dia. Só assim você ganha produtividade, não economizando shortcuts de editor de texto. Por mais que você acredite no oposto preste atenção: você não é bom em multitasking, ninguém é. Uma coisa de cada vez, começo até o fim, é o <strong>único</strong> jeito de ser ágil.</p>
<p>Portanto, sim, eu gosto de usar o Vim-mode, mas não 100% do tempo. Eu prefiro usar MacVim porque se eu quiser, posso selecionar coisas com o mouse também e não estou sendo "menos produtivo" por causa disso. O Vim-mode é importante porque quando estou no Vim de Terminal, via SSH num servidor remoto, obviamente não posso usar o mouse. E esse é outro motivo de porque todo mundo tem que saber pelo menos o básico de Vim: para configurar servidores remotos, se necessário (normalmente não deveria ser, pra isso servem deployments automatizados, mas isso é assunto pra outro post).</p>
<p>Outra coisa importante é selecionar não só caracteres, palavras e linhas mas também colunas verticais. O Vim tem o bom e velho Ctrl-V (:help CTRL-V). Sublime Text tem <a href="https://www.sublimetext.com/docs/2/column_selection.html">Column Selection</a> e Atom tem que instalar um pacote como o <a href="https://github.com/bigfive/atom-sublime-select">Sublime Style Column Selection</a>. Mas nem Sublime e nem Atom ainda são melhores que Textmate e Vim nesse departamento. Mas pelo menos todos eles tem o recurso: qualquer editor de texto que não permite selecionar colunas verticais de texto é obsoleto e não presta pra desenvolver. Nada supera o Ctrl-V do Vim, mas o do Atom e Sublime Text são funcionais o suficiente. O Sublime uma coisa extra que é melhor: edição em múltiplas partes do texto, basta selecionar uma variável, usar Command-D para selecionar as mesmas ocorrências e, quando for editar, ele vai editar em múltiplos lugares. É como um Find e Replace "in-place".</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/445/Screen_Shot_2014-07-31_at_19.35.22.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/445/Screen_Shot_2014-07-31_at_19.35.22.png 2x" alt="Sublime Text Column Selection"></p>
<p>Falando em Find e Replace, obviamente a coisa mais importante é suportar Regular Expressions. No Vim é o comando "%s/blabla/foofoo/g". Nos outros editores tem um ícone ".*" que muda de Find de texto para Find usando Regex. Textmate tinha isso e os outros também funciona razoavelmente bem. Extremamente importante!</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/446/Screen_Shot_2014-07-31_at_19.36.59.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/446/Screen_Shot_2014-07-31_at_19.36.59.png 2x" alt="Atom Find com Regex"></p>
<p>Customização de temas e code highlighting corretos são importantes, já que você vai passar o dia todo olhando pra código, é bom que ele seja agradável. Os dois melhores temas, de longe, são os <a href="https://ethanschoonover.com/solarized">Solarized</a> Dark e Light (eu pessoalmente prefiro o Dark). Esse é tema "cientificamente" produzido, a paleta de cores com o melhor balanço de contraste e cor para desenvolvedores. Na dúvida, instale Solarized Dark. Todos os editores listados tem esse tema.</p>
<p>Em particular, meu Textmate usa o tema "Mac Classic", é o melhor tema para screencasts e slides para projetor (em projetor sempre use letras escuras em fundo branco!) Falando nisso, lembre-se que LCD emite luz na sua cara. Branco é luz total. Tema branco é garantia de cansar sua vista muito mais rápido. Por isso algo como o Solarized Dark, para quem fica codificando o dia todo, é sempre o mais recomendado.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/447/Screen_Shot_2014-07-31_at_19.37.59.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/447/Screen_Shot_2014-07-31_at_19.37.59.png 2x" alt="Sublime Text Theme"></p>
<p>Todo bom editor precisa ter um índice de arquivos e uma maneira "fuzzy" de encontrar. O Textmate foi quem imortalizou o hoje ubíquito "Command-T". O pacote YADR para Vim trás o excelente similar, <a href="https://github.com/kien/ctrlp.vim">CtrlP</a>. O Sublime e Atom, ambos tem um similar ativado com a combinação de teclas "Command-T". Isso é essencial para navegar rapidamente pelo seu projeto. Um "Project Pane", com a versão visual em árvore do seu diretório de projetos não é útil para navegar rapidamente, mas sim para encontrar coisas que você não lembra o nome mas tem uma idéia de onde fica na estrutura de sub-diretórios. Todo bom editor tem um Project Pane, o Vim tem o plugin <a href="https://github.com/scrooloose/nerdtree">NerdTree</a>.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/441/Screen_Shot_2014-07-31_at_19.26.29.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/441/Screen_Shot_2014-07-31_at_19.26.29.png 2x" alt="Atom Command T">
  <img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/440/Screen_Shot_2014-07-31_at_19.24.36.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/440/Screen_Shot_2014-07-31_at_19.24.36.png 2x" alt="Sublime Text Command T">
  <img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/442/Screen_Shot_2014-07-31_at_19.28.05.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/442/Screen_Shot_2014-07-31_at_19.28.05.png 2x" alt="Vim CtrlP">
</p>
<p>Finalmente, existem os "Snippets", trechos de código que funcionam como template. Novamente, todos os editores tem pacotes de snippets para cada linguagem. Foi outra coisa que o Textmate tornou famoso, com seus <a href="https://github.com/drnic/ruby-on-rails-tmbundle">"bundles"</a> e agora todo mundo copiou. Não precisamos de muita coisa, apenas o suficiente para coisas como digitar "def", apertar "tab" e poder digitar o nome do método e o editor automaticamente identar e colocar o "end" pra fechar. Não fique muito viciado nisso, eles são úteis mas não devem ser utilizados para trechos grandes demais, senão seu código vira um grude de copy e paste. Para boilerplates, temos os diversos generators de frameworks como Rails e Yeoman para Javascript. Para HTML temos Slim e HAML para "economizar" simplificar burocracia de tags. No Sublime Text e Atom você pode usar o Package Control de cada um para procurar e instalar os bundles pra suas linguagens favoritas. O YADR já trás diversos plugins como o <a href="https://github.com/tpope/vim-rails">Vim Rails</a> que criaram a fama do lendário Tim Pope.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/448/Screen_Shot_2014-07-31_at_19.39.43.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/448/Screen_Shot_2014-07-31_at_19.39.43.png 2x" alt="Sublime Text Snippets"></p>
<p>Todos suportam "tabs" para abrir múltiplos arquivos. Mas se você é um desenvolvedor sério, provavelmente trabalha com <a href="https://www.macdrifter.com/2012/07/sublime-text-working-with-multiple-panes.html">Split Screen ou Multiple Panes</a>, que no Sublime são diversas combinações como Command-Alt-Shift-2 para split horizontal ou o Command-K e seta-pra-baixo no Atom, ou simplesmente ":sp" no Vim (Vim rulez!). É a única feature única que Textmate nunca suportou. É absolutamente essencial para que em um pane fique seu código e no outro pane fique o teste desse código! Lembre-se, TDD ou Test-After, não importa, faça testes! Ou no caso de Front-End, HTML de um lado e CSS do outro. E assim por diante. Neste aspecto, o do Vim e do Atom empatam porque eu posso ficar fazendo splits de cada pane invidualmente em qualquer direçao. O do Sublime Text é funcional mas ele tem layouts pré-definidos e não dá pra splitar além, o que eu não gosto.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/451/Screen_Shot_2014-07-31_at_19.43.42.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/451/Screen_Shot_2014-07-31_at_19.43.42.png 2x" alt="Atom Split">
  <img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/450/Screen_Shot_2014-07-31_at_19.43.17.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/450/Screen_Shot_2014-07-31_at_19.43.17.png 2x" alt="Sublime Grid Layout">
  <img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/449/Screen_Shot_2014-07-31_at_19.42.45.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/449/Screen_Shot_2014-07-31_at_19.42.45.png 2x" alt="Vim Split">
</p>
<p>Outras coisas que facilitam incluem funcionalidades como "Code Folding" para esconder blocos de código, como um método. Textmate tornou isso prático e os outros copiaram o recurso. É útil, mas cuidado para não virar uma "muleta" para arquivos que, na verdade, já deveriam ter sido refatorados em arquivos menores. Ou então métodos gigantes, que já deveriam ter sido refatorados em métodos menores.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/452/Screen_Shot_2014-07-31_at_19.46.24.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/452/Screen_Shot_2014-07-31_at_19.46.24.png 2x" alt="Atom Code Folding"></p>
<p>Praticamente tudo isso também existe nos editores de IDEs como Eclipse ou NetBeans. Mesmo XCode tem boa parte disso. O pior de todos é o editor do Visual Studio (que verdade seja dita, vem evoluindo até que bem nos últimos anos, e fica melhor se adicionar o ReSharper) e outros editores simples de texto de Windows como UltraEdit ou Notepad++. Em Windows, se possível, use Sublime Text ou Atom, ou mesmo gVIM mas aí não vai ter YADR e outras ferramentas de linha de comando, como explico nas seções abaixo.</p>
<p>Finalmente, outra parte extremamente importante de todos esses editores: eles precisam ser rápidos. O suficiente para eu chamar da linha de comando (o Textmate tem o comando "mate .", o Sublime Text tem o "subl .", o Atom tem o "atom ." e o MacVim, obviamente "mvim") e eles abrirem quase instantaneamente. Uma IDE pesada como Eclipse Kepler (com plugins de Spring, etc) abre - no meu Macbook Pro com SSD - em mais de <strong>17 segundos</strong>!! O Atom, que eu considero o mais lento, abre em menos de 3 segundos. Todos os outros abrem em <strong>1 segundo</strong> ou menos. Faz muita diferença em como eu vou trabalhar.</p>
<p>Cada um dos editores tem dezenas de outras funcionalidades que vão te surpreender, então não deixe de ler a documentação de cada um deles. Em particular, no caso do Vim, você pode ler o README que normalmente cada bundle tem (procure a partir do diretório ".vim/bundle"). No caso do Sublime Text você tem o <a href="https://sublime-text-unofficial-documentation.readthedocs.org/en/latest/">Unofficial Documentation</a>. O Atom é a <a href="https://atom.io/docs/latest/">documentação</a> do próprio site. Aliás, note que tem como converter bundles de Textmate para Atom.</p>
<h2>Pesquisa em Múltiplos Arquivos: Grep, Ack, Ag?</h2>
<p>O maior ponto fraco do Textmate é seu Find em múltiplos arquivos que, se esbarrar num log gigante, vai travar tudo. Substitua para usar o Ag. Em Mac, use Homebrew para instalar o <a href="https://github.com/ggreer/the_silver_searcher">the_silver_searcher</a>. Agora você precisa instalar o <a href="https://github.com/ggreer/AckMate">AckMate</a> no Textmate e substituir pelo Ag:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>rm ~/Library/Application Support/TextMate/PlugIns/AckMate.tmplugin/Contents/Resources/ackmate_ack
ln -s /usr/local/bin/ag "~/Library/Application Support/TextMate/PlugIns/AckMate.tmplugin/Contents/Resources/ackmate_ack
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para quem nunca ouviu falar disso, vamos resumir: todo mundo conhece o bom e velho Grep para fazer pesquisas usando regular expressions. Depois dele surgiu o Ack, como uma opção mais eficiente e veloz. E depois dele veio o Ag, como uma opção ainda melhor. O artigo <a href="https://geoff.greer.fm/2011/12/27/the-silver-searcher-better-than-ack/">"The Silver Searcher: Better than Ack"</a> explica um pouco disso, mas resumindo:</p>
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
</pre>
      </td>
      <td class="code"><pre>% du -sh
250M    .
% time grep -r -i SOLR ~/cloudkick/reach | wc -l
     617
11.06s user 0.81s system 96% cpu 12.261 total
% time ack -i SOLR ~/cloudkick/reach | wc -l
     488
2.87s user 0.78s system 97% cpu 3.750 total
% time ag -i SOLR ~/cloudkick/reach | wc -l
     573
1.00s user 0.51s system 95% cpu 1.587 total
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>11 segundos no Grep. Quase 3 segundos no Ack. 1 segundo no Ag. Na dúvida, escolha sempre Ag!</p>
<h2>Windows, porque não usar</h2>
<p>Para quem é de Windows, existe um <a href="https://jaxbot.me/articles/ag_the_silver_searcher_for_windows_6_8_2013">port to the silver searcher</a>. E aqui vem um ponto importante: não use Windows se não for necessário, como máquina de desenvolvimento de qualquer coisa que não seja Java ou .Net. Sim, PHP uma parte funciona. Python, Perl, uma parte funciona. Até <a href="https://rubyinstaller.org">Ruby</a>, uma parte funciona. E sempre vai ser assim: uma parte, nunca 100%.</p>
<p>.NET é óbvio que funciona porque foi feito para Windows. Apesar de existir uma máquina virtual CLR, uma parte significativa são chamadas a subsistemas de baixo nível do sistema operacional usando pontes como PInvoke (Platform Invocation Services, para permitir código gerenciado chamar código não-gerenciado ou não-seguro). No caso de Java, a filosofia era 100% Pure Java, com o tempo surgiram adaptações usando JNI (Java Native Interface, essencialmente algo como PInvoke no .NET), mas no caso de Java preferencialmente tudo é feito para rodar dentro da JVM. Mesmo scripts de linha de comando são sempre chamadas <tt>java -jar xxx.jar</tt> por dentro.</p>
<p>Perl, PHP, Ruby, Python, e outros interpretadores que nasceram no ambiente Unix dependem de APIs <a href="https://stackoverflow.com/questions/1780599/i-never-really-understood-what-is-posix">POSIX</a> por baixo. Ditribuições GNU/Linux e BSD/Darwin (OS X) implementam essa família de padrões e seguem a filosofia UNIX. O Windows, obviamente, não é UNIX e muito menos POSIX. Existe, porém, como ter o sub-sistema POSIX sobre o Windows. É isso que são os projetos <a href="https://www.cygwin.com">Cygwin</a> e <a href="https://www.microsoft.com/en-us/download/details.aspx?id=274">Windows Services for UNIX</a>. Apesar do grande esforço desses projetos em tentar prover as mesmas APIs POSIX, existem hoje diferenças nos ambientes Linux e Darwin que eles não cobrem, e por isso muita coisa ainda vai quebrar. É um trabalho homérico tentar fazer o Windows ficar compatível com um ambiente UNIX inteiro.</p>
<p>Por isso, a melhor forma de desenvolver com plataformas que dependem de UNIX é usar máquinas virtuais como VirtualBox, com a ajuda do bom e velho Vagrant, como falei no <a href="https://www.akitaonrails.com/2014/07/28/small-bites-vagrant-ubuntu-14-04-chef-solo#.U9q91IBdVqc">post anterior</a>.</p>
<p><em>"Mas eu desenvolvo PHP e Python no Windows sem problemas!"</em></p>
<p>É verdade, mas você nunca vai poder usar tudo dessas plataformas, sempre vai precisar existir gambiarras pra fazer uma ferramenta que é simples no UNIX funcionar no Windows. Veja o <a href="https://github.com/composer/windows-setup">PHP Composer Installer</a>, precisa trazer embutido o Git, Msys, Cygwin e tudo mais. Como no caso particular do PHP, uma parcela considerável de todos os desenvolvedores usam Windows, então projetos de Installers como esse ainda funcionam razoavelmente, mas é uma considerável redundância de esforços. Sempre vai ter conflitos de versões mais novas com installers velhos e toda a velha dor de cabeça de sempre. Como instala num Linux? Simples, um comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>curl -sS https://getcomposer.org/installer | php
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vamos instalar o PIP do Python no Windows? Não é necessariamente trivial, como esta <a href="https://stackoverflow.com/questions/4750806/how-to-install-pip-on-windows">thread no StackOverflow</a> indica. E depois você precisa lidar com o <a href="https://stackoverflow.com/questions/3271590/can-i-install-python-windows-packages-into-virtualenvs">Virtualenv</a> no Windows. No Ubuntu?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install python-pip
sudo apt-get install python-virtualenv
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>'nuff said.</p>
<h2>Atalhos, Shortcuts, Cheat sheets</h2>
<p>Se você está acostumado a um conjunto de keybindings, se adaptar a outro é uma dor de cabeça mesmo. Uma coisa que muitos tentam fazer é adaptar o editor às keybindings que estava acostumado, tipo tentar simular <a href="https://github.com/ebi/Sublime-TextMate-Shortcuts">combinações do Textmate no Sublime</a>. Recomendação: não faça isso. Você precisa lembrar de meia dúzia de combinações principais, o resto é secundário e via menu você relembra.</p>
<p>Para ajudar, aqui vão alguns cheatsheets que podem ajudar (principalmente se você está tentando ainda se adaptar a Vim):</p>
<ul>
  <li><a href="https://vim.rtorr.com/">Vim Cheat sheet</a></li>
  <li><a href="https://www.cheatography.com/martinprins/cheat-sheets/sublime-text-3-osx/">Sublime Text 3 Cheat sheet</a></li>
  <li><a href="https://bugsnag.com/blog/atom-editor-cheat-sheet">Atom Cheat sheet</a></li>
  <li><a href="https://g-design.net/textmate.pdf">Textmate Cheat sheet</a></li>
</ul>
<h2>Por que Ruby (ou Python, ou Perl, etc) não precisam de IDE?</h2>
<p><em>"O que é uma IDE?"</em> Tecnicamente "IDE" significa <a href="https://en.wikipedia.org/wiki/Integrated_development_environment">Integrated Development Environment</a>. Significa um editor de textos, automatização de compilação e debugging.</p>
<p>No mundo Ruby não há preocupação sobre compilação porque salvo os raros casos onde você está trabalhando com uma extensão em C, não há "compilação". No mundo Rails, em particular, temos preocupação de deployment. Pra maioria de nós, significa um mero <tt>git push heroku master</tt> e boom.</p>
<p>Debugging é outra tarefa que não nos preocupa muito, ou pelo menos não deveria. Se precisarmos muito, basta adicionar a gem <a href="https://github.com/rweng/pry-rails">pry-rails</a> ao seu projeto e colocar a linha <tt>binding.pry</tt> onde quer debugar. O servidor web vai parar nessa linha no seu console e você pode debugar de lá. Mas como você deveria estar desenvolvendo orientado a testes (Test-First/TDD ou Test-After, não importa, apenas teste!), debugging perde importância. Front-end precisa de debugging visual e todo navegador decente (Safari, Chrome e Firefox) tem excelente debuggers e <a href="https://developer.apple.com/library/mac/documentation/AppleApplications/Conceptual/Safari_Developer_Guide/GettingStarted/GettingStarted.html">web inspectors</a>.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/453/Screen_Shot_2014-07-31_at_19.49.15.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/453/Screen_Shot_2014-07-31_at_19.49.15.png 2x" alt="Terminal oriented development"></p>
<p>Isso nos deixa somente com um aspecto importante: o editor de textos! Por isso que no mundo Rails não falamos em "IDE", e sim em editores de texto. Mas quem vem de uma IDE como Eclipse ou NetBeans para Java, ou mesmo XCode para Objective-C sempre pensa em uma e apenas uma coisa: "auto-complete" e ficam pasmos que no mundo Ruby ou não usamos ou o auto complete é bem simples.</p>
<p>Para entender isso precisamos de perspectiva. Vamos pensar em coleções. Em Ruby, temos Array e Hash. Em Java precisamos escolher entre: Vector, HashTable, List, ArrayList, LinkedList, Queue, ArrayDeque, PriorityQueue, Deque, BlockingQueue, Set, HashSet, LinkedHashSet, TreeSet, HashMap, TreeMap, SortedSet, NavigableSet, Map, LinkedHashMap, NavigableMap. Pelo menos 21 classes (e eu acho que não listei todas!) E se incluirmos o Apache Commons, temos mais: ArrayStack, FastArrayList, BinaryHeap, BoundedFifoBuffer, UnboundedFifoBuffer, BeanMap, DoubleOrderedMap, FastHashMap, MultiHashMap, ReferenceMap, FastTreeMap, ArrayEnumeration, ArrayIterator, BagUtils, BufferUtils, CollectionUtils, CursorableLinkedList, etc (essa é só metade da lista!)</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/454/Screen_Shot_2014-07-31_at_19.50.52.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/454/Screen_Shot_2014-07-31_at_19.50.52.png 2x" alt="Eclipse auto-complete"></p>
<p>Isso deve dar uma perspectiva de porque não precisamos de "auto-complete". Use ferramentas como o <a href="https://kapeli.com/dash">Dash</a> para ter acesso à documentação (e que no caso do Vim, tem integração do tipo selecionar a palavra-chave no seu código, digitar o comando <a href="https://github.com/rizzatti/dash.vim">":Dash"</a> e ele vai abrir diretamente a documentação no Dash! Muito prático). Se não tem Mac e usa uma distro Linux ou até mesmo Windows (!!), talvez o <a href="https://zealdocs.org/">Zeal</a> seja a melhor opção para documentação offline.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/455/Screen_Shot_2014-07-31_at_19.52.12.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/455/Screen_Shot_2014-07-31_at_19.52.12.png 2x" alt="Dash"></p>
<p>E o mundo iOS/OS X com framework Cocoa não é muito diferente. Bem menos opções do que em Java, mas ainda muito mais do que Ruby.</p>
<p>No caso de Objective-C ou o novo Swift, o XCode continua sendo um IDE competente. Ele ainda tem crashes bizarros e é um pouco pesado mas ter acesso a ferramentas como Interface Builder, Instruments, Simulator, etc faz parte do workflow de desenvolvimento de aplicações Desktop ou Mobile. No caso de Windows, fazer aplicações para desktop também exige um Visual Studio. Fazer Swing com Java sem alguns bons plugins e debugging também é complicado, então realmente use Eclipse ou NetBeans.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/456/Screen_Shot_2014-07-31_at_19.54.09.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/456/Screen_Shot_2014-07-31_at_19.54.09.png 2x" alt="Xcode"></p>
<p>Aliás, um Eclipse ou NetBeans demoram porque literalmente rodam sobre uma "máquina virtual" (que é leve, claro), que é a JVM. Nesse conceito, não é um grande salto rodar suas outras ferramentas de desenvolvimento de outra máquina virtual (mais pesada, sim) que é um Linux dentro de um Virtualbox. Ou se sua máquina de desenvolvimento já é Linux, rodar Vagrant com LXC.</p>
<p>O <a href="https://www.jetbrains.com/ruby/">RubyMine</a> assim como outras IDEs, foge da minha opinião deste post de usar a combinação "Bom Editor" + "Terminal" + "Vagrant" como fluxo de trabalho para Web. Mas se quiser muito tentar uma IDE para Ruby, esta é obviamente a melhor opção. Em particular, diferente do Eclipse, ele é consideravelmente mais rápido e responsivo. Ele quase empata com o Atom.io em tempo de abertura, levando perto de 4 segundos. O Atom leva perto de 3 segundos e o Eclipse leva mais de 17 segundos. Quase entra na categoria de editores de texto que você pode abrir rápido. Por isso mesmo é uma boa opção.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/457/Screen_Shot_2014-08-01_at_14.42.27.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/457/Screen_Shot_2014-08-01_at_14.42.27.png 2x" alt="RubyMine"></p>
<p>E aí, quais dicas legais vocês tem para cada um dos editores mostrados? Não deixem de colocar nos comentários!</p>
<p></p>
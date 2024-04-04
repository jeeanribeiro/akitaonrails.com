---
title: "Por que Testar?"
date: "2007-08-25T23:04:00.000Z"
tags: ["tests"]
years: "2007"
---

<p></p>
<p>Pessoalmente eu nunca me vi nem li ninguém fazer uma das perguntas mais óbvias: <em>“Por que testar?”</em>.</p>
<p>O que eu normalmente presencio é que programadores tem consciência de que precisam testar. A reflexão que eu esperaria seria algo na seguinte linha: <em>“Temos super-computadores multi-processados com muitos gigahertz sobrando, porque o computador não é capaz de me dizer se meu programa finaliza ou não?”</em></p>
<p style="text-align: center; margin: 5px"><img src="http://s3.amazonaws.com/akitaonrails/assets/2007/8/25/Usability_Testing.jpg" srcset="http://s3.amazonaws.com/akitaonrails/assets/2007/8/25/Usability_Testing.jpg 2x" alt=""></p>
<p>Infelizmente, não se trata de um dogma: ou poderíamos quebrá-lo. De fato, precisamos cobrir nossos programas com a maior quantidade possível de testes de qualidade, e nenhum sistema será capaz de confirmar, com 100% de certeza, em 100% dos casos, se um determinado programa irá funcionar corretamente. É uma limitação matemática que não pode ser contornada. Como sabemos disso?</p>
<p></p>
<p></p>
<h3>Momento Rails: ZenTest</h3>
<p>Antes de pular para a resposta (mais abaixo), primeiro vou dar uma dica aos Railers de plantão. Como vou falar de testes, gostaria de recomendar uma ferramenta extremamente útil escrita pro Ryan Davis chamado <a href="https://nubyonrails.com/articles/autotest-rails">ZenTest</a>. Para instalar apenas digite:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>sudo gem install <span style="color:#036;font-weight:bold">ZenTest</span> -y
sudo gem install redgreen -y
gem install win32console -y <span style="color:#777"># somente para usuários Windows</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Baixem <a href="https://topfunky.com/clients/blog/autotest-tm.mov">este vídeo</a> gratuito de Geoffrey Grosenbach, que demonstra o autotest em funcionamento. Também comprem os screencast <a href="https://peepcode.com/products/test-first-development">Test-First development for Rails</a>, <a href="https://peepcode.com/products/rspec-basics">rSpec Basics</a> e <a href="https://peepcode.com/products/rspec-mocks-and-models">rSpec Mocks and Models</a> (amostras grátis, <a href="https://topfunky.com/clients/peepcode/previews/peepcode-004-testing-tips.mov">aqui</a>, <a href="https://peepcode.com/system/previews/peepcode-011-rspec-i-preview.mov">aqui</a> e <a href="https://peepcode.com/system/previews/peepcode-013-rspec-ii-preview.mov">aqui</a>) para aprender a fazer bons testes em Rails.</p>
<p>O <a href="https://www.zenspider.com/ZSS/Products/ZenTest/">ZenTest</a> vem com o utilitário ‘autotest’. A partir da raíz do seu projeto Rails, apenas digite:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>autotest -rails
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Fazendo isso, os utilitários do pacote ZenTest ficarão monitorando seu projeto: toda vez que você modificar algum código ele irá rodar os testes. Quando estiver modificando os testes, ele rodará apenas o método de teste que você acabou de modificar. A vantagem: você estará constante monitorando se está tudo correndo bem com seu projeto, não precisará o rodar manualmente o ‘rake’ toda hora.</p>
<p style="text-align: center; margin: 5px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/autotest_red_green.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/autotest_red_green.jpg 2x" alt=""></p>
<p>Existem alguns plugins e técnicas para que o autotest chame uma janela de notificação, para ficar ainda mais fácil visualizar os testes. Este <a href="https://blog.codefront.net/2007/04/01/get-your-testing-results-via-growl-notifications/">link</a> tem receitas para Mac. Eu sei que existe maneira para integrar com Gnome no Linux e no Windows, mas não me recordo da <span class="caps">URL</span> (alguém se lembra?)</p>
<p>Observando o seu console constantemente você terá rapidamente e em primeira mão onde sua modificação pode estar quebrando alguma coisa. Claro, partindo do princípio que você cobriu seu sistema suficientemente de testes. E quanto é suficiente? Como eu sei quanto do meu projeto já está coberto?</p>
<p>Para sabe isso, instale também o <a href="https://eigenclass.org/hiki.rb?rcov">rCov</a> que é o pacote de cobertura de código para Ruby. Basta fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem install rcov
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Depois instale o plugin <a href="https://blog.codahale.com/2006/05/26/rails-plugin-rails_rcov/">rails_rcov</a> no seu projeto assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>./script/plugin install -x http<span style="color:#A60">:/</span>/svn.codahale.com/rails_rcov
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p style="text-align: center; margin: 5px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/hiki.rb.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/hiki.rb.png 2x" alt=""></p>
<p>Com este plugin você ganha os seguintes task rake:</p>
<table style="border:1px solid black;">
  <tbody>
    <tr style="padding:0.1em;">
      <td>doc:plugins:rails_rcov </td>
      <td> Create plugin documentation for ‘rails_rcov’</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:functionals:clobber_rcov </td>
      <td> Remove Rcov reports for functional tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:functionals:rcov </td>
      <td> Run all functional tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:integration:clobber_rcov </td>
      <td> Remove Rcov reports for integration tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:integration:rcov </td>
      <td> Run all integration tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:plugins:all:clobber_rcov </td>
      <td> Remove Rcov reports for plugins:all tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:plugins:all:rcov </td>
      <td> Run all plugins:all tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:plugins:clobber_rcov </td>
      <td> Remove Rcov reports for plugin tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:plugins:functionals:clobber_rcov </td>
      <td> Remove Rcov reports for plugins:functional tests</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:plugins:functionals:rcov </td>
      <td> Run all plugins:functional tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:plugins:integration:clobber_rcov </td>
      <td> Remove Rcov reports for plugins:integration tests</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:plugins:integration:rcov </td>
      <td> Run all plugins:integration tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:plugins:rcov </td>
      <td> Run all plugin tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:plugins:setup_plugin_fixtures:clobber_rcov </td>
      <td> Remove Rcov reports for plugins:setup_plugin_fixture tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:plugins:setup_plugin_fixtures:rcov </td>
      <td> Run all plugins:setup_plugin_fixture tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:plugins:units:clobber_rcov </td>
      <td> Remove Rcov reports for plugins:unit tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:plugins:units:rcov </td>
      <td> Run all plugins:unit tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:recent:clobber_rcov </td>
      <td> Remove Rcov reports for recent tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:recent:rcov </td>
      <td> Run all recent tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:test:clobber_rcov </td>
      <td> Remove Rcov reports for test tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:test:rcov </td>
      <td> Run all test tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:uncommitted:clobber_rcov </td>
      <td> Remove Rcov reports for uncommitted tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:uncommitted:rcov </td>
      <td> Run all uncommitted tests with Rcov to measure coverage</td>
    </tr>
    <tr style="padding:0.1em;background:#ddd;">
      <td>test:units:clobber_rcov </td>
      <td> Remove Rcov reports for unit tests</td>
    </tr>
    <tr style="padding:0.1em;">
      <td>test:units:rcov </td>
      <td> Run all unit tests with Rcov to measure coverage</td>
    </tr>
  </tbody>
</table>
<p>Existem diversas outras ferramentas para ajudá-lo nos testes, como <a href="https://rspec.rubyforge.org/documentation/rails/install.html">rSpec</a>. Mas apenas estas já devem aumentar e muito sua cobertura adequada de testes. Recomendo que todos os Railers leiam a respeito de <a href="https://en.wikipedia.org/wiki/Test-driven_development">Test-Driven Development</a> (que Rails incentiva) e <a href="https://behaviour-driven.org/">Behaviour-Driven Development</a> (que rSpec implementa).</p>
<p>Agora voltamos à pergunta: <em>“Para quê, todo esse trabalho? Por que testar?”</em></p>
<h3>Momento Wikipedia – Halting Dilemma</h3>
<p><a href="https://en.wikipedia.org/wiki/Turing_machine">Turing Machines</a> são dispositivos de manipulação de símbolos abstratos básicos que, apesar de sua simplicidade, podem ser adaptadas para simular lógica de qualquer computador que possivelmente seja construído. Foram descritos em 1936 por <a href="https://en.wikipedia.org/wiki/Alan_Turing">Alan Turing</a>. Todos os nossos micro-processadores são, em essência, Turing Machines.</p>
<div style="float: left; margin: 5px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/church.gif" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/church.gif 2x" alt=""></div>
<p>Uma Turing Machine que é capaz de simular qualquer outra Turine machine é chamada de <a href="https://en.wikipedia.org/wiki/Universal_Turing_machine">Universal Turing Machine</a> (<span class="caps">UTM</span>, ou simplesmente universal machine). Uma definição mais matemática com uma natureza similarmente “universal” foi apresentada por <a href="https://en.wikipedia.org/wiki/Alonzo_Church">Alonzo Church</a>, cujo trabalho em <a href="https://en.wikipedia.org/wiki/Lambda_calculus">lambda calculus</a> cruzou com o de Turing em uma teoria formal da computação conhecida como <a href="https://en.wikipedia.org/wiki/Church-Turing_thesis">Tese Church-Turing</a>. Esta tese afirma que Turing machines de fato capturam a noção informal de método efetivo em lógica e matemática, dada uma definição precisa de um <a href="https://en.wikipedia.org/wiki/Algorithm">algorítmo</a> ou “mecânica procedural”.</p>
<p>Um <a href="https://en.wikipedia.org/wiki/Algorithm">algoritmo</a> é uma lista finita de instruções para a execução de alguma tarefa que, dada uma condição inicial (parâmetros de uma função, por exemplo), irá <a href="https://en.wikipedia.org/wiki/Termination">terminar</a> em um estado final definido. Um programa de computador – do tipo que fazemos – é um algoritmo ou um conjunto de algoritmos.</p>
<p>Algoritmos são extremamente úteis. Matemáticos podem definir problemas matemáticos instruindo computadores a executá-los, por exemplo, para determinar a trilionésima casa decimal do Pi, ou o quadrilionésimo número primo. O problema: se o tamanho do processo não é conhecido em antemão, então “tentar” pode não ser conclusivo, porque se o processo continuar infinitamente – então em nenhum momento do tempo seremos capazes de ter certeza de uma “Resposta” (Minsky 1967:105).</p>
<p>Portanto a resposta é: inconclusivo. Nunca saberemos, nem poderemos analisar de antemão pra descobrir. A análise de algoritmos à procura da possibilidade de terminarem é chamada <a href="https://en.wikipedia.org/wiki/Termination_analysis">Análise de Terminação</a>. Mas existe um problema primordial, conhecido como <a href="https://en.wikipedia.org/wiki/Halting_problem">Halting Problem</a>.</p>
<p>O Halting Problem, ou Problema de Finalização começa com este enunciado: <em>“Dada uma descrição de um programa e parâmetros finitos, decidir se o programa termina de rodar ou se rodará infinitamente.”</em></p>
<div style="float: right; margin: 5px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/cope1.jpg" srcset="https://s3.amazonaws.com/akitaonrails/assets/2007/8/25/cope1.jpg 2x" alt=""></div>
<p>Alan Turing provou em 1936, em estudo paralelo e independente de Alonzo Church, chegando ambos à conclusão que um algoritmo genérico para resolver o Halting Problem para todos os parâmetros possíveis não pode existir. Nós dizemos que o Halting Problem é inconclusivo em Turing machines.</p>
<p>A prova para isso vocês podem ver nos links acima, existe uma demonstração que segue outros teoremas matemáticos chamados <a href="https://en.wikipedia.org/wiki/Gödel%27s_incompleteness_theorem"> Gödel’s incompleteness theorems</a>, onde as provas são similares.</p>
<p>Poderia parecer que <a href="https://en.wikipedia.org/wiki/Human">humanos</a> poderiam resolver o Halting Problem. Afinal, um programador normalmente consegue olhar para um programa e dizer se ele vai ou não vai terminar. É útil entender <strong>porque isso não é verdade</strong>. Para simplicidade, vamos considerar um programa sem parâmetros de entrada, que também é inconclusivo.</p>
<p>“Resolver” o Halting Problem significa ser capaz de olhar para qualquer programa e dizer se ele termina. Não é suficiente ser capaz de olhar para alguns programas e decidir. Humanos podem não se capazes de resolver halting problems por causa do tamanho da entrada (um programa com milhões de linhas de código). Mesmo para programas curtos, não é claro que humanos possam sempre dizer se um programa termina. Por exemplo, poderíamos nos perguntar se o seguinte programa em Ruby (que é um Turing Machine e é <a href="https://en.wikipedia.org/wiki/Turing-complete">Turing Complete</a>), vai terminar:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">procurar_por_numero_impar_perfeito</span>
        n = <span style="color:#00D">1</span> <span style="color:#777"># inteiro de precisão arbitrária</span>
        <span style="color:#080;font-weight:bold">while</span> (<span style="color:#069">true</span>)
                soma_dos_fatores = <span style="color:#00D">0</span>
                (<span style="color:#00D">1</span>..n-<span style="color:#00D">1</span>).each <span style="color:#080;font-weight:bold">do</span> |fator|
                        soma_dos_fatores += fator <span style="color:#080;font-weight:bold">if</span> n % fator == <span style="color:#00D">0</span>
                <span style="color:#080;font-weight:bold">end</span>
                <span style="color:#080;font-weight:bold">break</span> <span style="color:#080;font-weight:bold">if</span> soma_dos_fatores == n
                n += <span style="color:#00D">2</span>
        <span style="color:#080;font-weight:bold">end</span>
        n
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Este programa procura até encontrar um “numéro ímpar perfeito”, e só então terminar (break). Ou seja, ele termina se, e somente se, tal número existe. O problema: sabemos hoje que existem números pares perfeitos. Por exemplo 6 = 1 + 2 + 3. 28 = 1 + 2 + 4 + 7. O próximo número perfeito é 496 e depois é 8218. Porém, ainda não sabemos qual é o primeiro número ímpar perfeito e também não sabemos demonstrar a existência ou ausência de tal número. Portanto: é impossível determinar se o programa acima um dia vai terminar ou se rodará indefinidamente. Mesmo se deixarmos esse programa rodar 100 anos e ele não encontrar um ímpar perfeito, não quer dizer que ela não exista: existem infinitos número, você pode tentar infinitamente sem concluir.</p>
<p>Agora por que tudo isso é importante? Nossos pequenos algoritmos são determinísticos e simples na maior parte dos casos. Bom, pelo menos eles parecem ser. A maioria dos programadores está acostumado a criar um algoritmo e testá-lo para uma ou duas dúzias de casos, se funciona para esses casos eles <em>assumem</em> que funciona para todos os casos. E não é sempre assim.</p>
<p>Um <em>excessivamente bom</em> anti-vírus poderia eventualmente ser capaz de detectar todo e qualquer vírus já feito ou que venha a ser feito, considerando simplificadamente que a definição de um vírus seja <em>software que se auto-replica</em>?</p>
<p>É impossível. E como temos certeza? Porque o algoritmo de anti-vírus pode ser reduzido a um Halting Problem. Se fosse possível criar um anti-virus como o que descrevi, significa que, por <a href="https://en.wikipedia.org/wiki/Reduction_%28complexity%29">redução</a>, também seria possível resolver o Halting Problem. Como já foi provado por Church e Turing que nenhum método pode resolver esse problema, já sabemos de ante-mão que o novo problema (anti-virus) também não pode ser resolvido. É uma das técnicas de determinar se um novo algoritmo é ou não inconclusivo.</p>
<p>Isso significa que jamais poderemos dizer se um programa funciona ou não? Cuidado com a semântica, o Halting Problem afirma apenas que é impossível dizer se <em>todos</em> os programas terminam ou entram em loop infinito. Não que <em>nenhum</em> programa possa ser determinístico. Quando fazemos testes unitários de pequenos trechos de código, conseguimos imaginar de cabeça que aquele trecho é determinístico e possivelmente funciona em todos os casos que queremos.</p>
<p>Quando juntamos dezenas de pedaços diferentes – todos os eles unitariamente testados -, colocamos tudo num programa gigantesco, é muito difícil predizer que este novo programa funcionará corretamente, mesmo tendo testado unitariamente cada pedaço. Por isso mesmo temos testes funcionais. E podemos pegar cada conjunto maior anterior e combiná-lo num programa ainda maior. Para isso mesmo temos testes integrados.</p>
<p>Porém, quanto mais avançamos, mais e mais nossos programas chegam perto de um <a href="https://en.wikipedia.org/wiki/Non-deterministic_Turing_machine">Turing Machine não-determinístico</a> e mais complicado é dizer qual serão os resultados.</p>
<p>A <a href="https://en.wikipedia.org/wiki/Computer_science">Ciência da Computação</a> (bem como o campo de Física e Matemática) é muito rico, muito amplo. Nós, meros programadores não-acadêmicos, mal começamos a raspar a ponta do iceberg. Quem é interessado em criptografia deve conhece o conceito de <a href="https://en.wikipedia.org/wiki/One-way_function">funções de mão-única</a> (one-way function), uma função fácil de executar mas custoso para reverter. Elas dão origem à criptografia assimétrica ou ou <a href="https://en.wikipedia.org/wiki/Public_key_cryptography">Criptografia de Chave Pública</a>. O problema: ainda é uma questão em aberto se one-way functions realmente existem! Ou seja, é uma questão matemática ainda não provada ou desprovada.</p>
<p>Para a grande maioria dos programadores nada disso tem a menor importância. Este artigo é destinado às pessoas que tem <strong>curiosidade</strong> e <strong>vontade</strong> para aprender mais sobre o campo onde atuamos e mostrar que existe muito mais do que nossa visão alcança. A única maneira de sair com soluções criativas e inovadoras é conhecer o que já foi estudado, subir no ombro de gigantes como Church e Turing.</p>
<p></p>
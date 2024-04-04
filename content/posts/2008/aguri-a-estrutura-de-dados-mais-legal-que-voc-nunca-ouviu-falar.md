---
title: "Aguri: A Estrutura de Dados mais Legal que Você Nunca Ouviu Falar"
date: "2008-02-22T01:03:00.000Z"
tags: ["algorithm"]
years: "2008"
---

<p></p>
<p>Fazia <strong>muito</strong> tempo que eu não via um bom artigo sobre Estruturas de Dados. Na verdade, acho que desde o tempo da faculdade eu não lia um texto tão legal. Este achado veio do blog <a href="http://www.matasano.com/log/1009/aguri-coolest-data-structure-youve-never-heard-of/">matasano chargen</a> e resolvi traduzir para que todos possam apreciar a idéia. Mas avisando: um mínimo de ciências da computação é necessário para entender este texto.</p>
<p>O tema é <strong>Binary Radix Trie</strong>. Segue a tradução:</p>
<p></p>
<p></p>
<h1>1</h1>
<p>Um pouco de remédio de ciências da computação para os auditores PCIs na minha audiência.</p>
<p>Eu lhe dou um array com números inteiros aleatórios. Como você pode me dizer se o número 3 está nele?</p>
<p>Bem, aqui vai a maneira óbvia: cheque os números sequencialmente até encontrar o “3” ou terminar o array. Procura Linear. Dados 10 números, você precisa assumir que isso pode levar 10 passos; N números, N passos.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_1.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_1.png 2x" alt=""></p>
<p>Procura linear é ruim. É difícil fazer pior do que linear. Vamos melhorar isso. Ordene o array.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_2.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_2.png 2x" alt=""></p>
<p>Um array ordenado sugere uma estratégia diferente: pule direto para o meio do array e veja se o valor que está procurando é menor (à esquerda) ou maior (à direita). Repita, cortando o array no meio a cada vez, até encontrar o número.</p>
<p>Procura Binária. Dados 10 números, levará não mais do que 3 passos – log 10 (base 2) – para encontrar um deles num array ordenado. Procuras O(log n) são incríveis. Se tiver 65 mil elementos, levará somente 16 passos para encontrar. Dobre o número de elementos, e levará apenas 17 passos.</p>
<p>Mas arrays ordenados são uma porcaria; ordená-los custa mais caro do que procura binária. Então nós não usamos muito procura binária; em vez disso, usamos árvores binárias.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_3.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_3.png 2x" alt=""></p>
<p>Para procurar numa árvore binária, você começa pelo topo, e se pergunta <em>“minha chave é menor (esquerda) ou maior (direita) do que o nó atual”</em> e repete até ok, ok, ok você já sabe. Mas essa árvore é bonita, não é?</p>
<p>Procura com uma árvore binária (balanceada) é O(log n), como procura binária, variando com o número de elementos na árvore. Árvores Binárias são incríveis: você consegue navega rapidamente de maneira ordenada, uma coisa que não se consegue de uma tabela Hash. Árvores Binárias são uma implementação default para tabelas melhor do que tabelas Hash.</p>
<h1>2</h1>
<p>Mas Árvored Binárias não é o único mecanismo de procura em estrutura de árvore. ‘Binary Radix <a href="https://en.wikipedia.org/wiki/Trie">Tries</a>’, também chamados árvores <span class="caps">PATRICIA</span>, trabalham como árvores binárias com uma diferença fundamental. Em vez de comparar maior/menor em cada nó, você checa para ver se um bit está configurado, indo para a direita se estiver, ou para a esquerda se não estiver.</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_4.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_4.png 2x" alt=""></p>
<p>Estou deixando fora muita coisa sobre como binary radix tries trabalham. É uma vergonha, porque radix tries são notoriamente mal documentadas – <a href="https://en.wikipedia.org/wiki/Robert_Sedgewick_%28computer_scientist%29">Sedgewick</a> os destruiu em “Algorithms”, e a <a href="https://en.wikipedia.org/wiki/Radix_tree">página na Wikipedia</a> também é uma droga. As pessoas ainda argumentam sobre como chamá-los! Em vez de uma explicação de backlinks e cantos etiquetados com posição de bits, <a href="https://www.matasano.com/log/basic-uncommented-crappy-binary-radix-trie/">aqui vai uma pequena implementação em Ruby</a></p>
<p>Eis porque radix tries são legais:</p>
<ul>
  <li>A performance de procura varia com o <em>tamanho da chave</em>, não o número de elementos na árvore. Com chaves de 16-bits, você garantidamente tem 16 passos independente do número de elementos na árvore, sem balanceamento.</li>
</ul>
<ul>
  <li>Mais importante, radix tries lhe dá <em>igualdade lexicográfica</em>, que é uma maneira de dizer “procura com wildcards” ou “procura parecida com auto-complete de linha de comando”. Em um radix tree, você pode rapidamente procurar por “ro*” e conseguir “rome” e “romulous” e “roswell”.</li>
</ul>
<h1>3</h1>
<p>Eu o perdi.</p>
<p>Vamos colocar isso em contexto. Tries são uma estrutura de dados crucial para roteamento de Internet. O problema de roteamento é mais ou menos assim:</p>
<ul>
  <li>Você tem uma tabela de roteamento com entradas para “10.0.1.20/32 → a” e “10.0.0.0/16 → b”</li>
</ul>
<ul>
  <li>Você precisa que pacotes para 10.0.1.20 vão para “a”</li>
</ul>
<ul>
  <li>Você precisa que pacotes para 10.0.1.21 vão para “b”</li>
</ul>
<p>Esse é um problema difícil de resolver com uma árvore binária básica, mas com uma radix trie, você está apenas perguntando por “1010.0000.0000.0000.0000.0001.0100” (para 10.0.1.20) e “1010”. (para 10.0.0.0). Procura Lexicográfica lhe dá o “melhor acerto” para roteamento. Você pode tentar no código Ruby acima; adicione *"10.0.0.0".to_ip na trie, e procure por “10.0.0.1”.to_ip.</p>
<p>A correspondência entre roteamento e radix tries é tão forte que a mais popular biblioteca de uso geral de radix trie (aquele da <span class="caps">CPAN</span>) é na realidade roubado da GateD. É uma bagunça, aliás, não use isso.</p>
<p>Se você entende como um trie funciona, você entende como regular expressions trabalham. Tries são um caso especial de autômato finito determinístico (DFAs), onde galhos são baseados exclusivamente em comparações de bits e sempre se divide para frente. Um bom engine de regex apenas manipula DFAs com mais “funcionalidades”. Se minha figura faz sentido para você, as imagens nesse <a href="https://swtch.com/~rsc/regexp/regexp1.html">excelente artigo</a> sobre o algoritmo de redução <span class="caps">NFA</span>-<span class="caps">DFA</span> de Thompson também vai, e esse artigo o fará mais esperto.</p>
<h1>4</h1>
<p>Você é um operador de rede no backbone de um provedor. Seu mundo consiste em boa parte de “prefixos” – pares de IPs de rede/netmasks. Os netmasks nesses prefixos são muito importantes para você. Por exemplo, 121/8 <a href="https://www.okean.com/koreacidr.txt">pertence à Coréia</a>; 121.128/10 pertence à Korea Telecom, 121.128.10/24 pertence à um cliente da KT, e 121.128.10.53 é um computador desse cliente. Se estive rastreando um botnet ou uma operação de spam or propagação de worm, o número de netmask é bem importante para você.</p>
<p>Infelizmente, mesmo sendo importantes, em nenhum lugar no pacote IP está estampado um “netmask” – netmasks são completamente um detalhe de configuração. Então, quando você está olhando tráfego, você essencialmente tem esss dados para trabalhar:</p>
<p style="text-align: center"><a href="https://www.matasano.com/data.html"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/ips.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/ips.png 2x" alt=""></a></p>
<p>Surpreendentemente, dados pacotes o suficiente para olhar, isso é informação suficiente para adivinhar netmasks. Quando trabalhava na Sony, <a href="https://www.sonycsl.co.jp/~kjc/">Kenjiro Cho</a> veio com uma maneira realmente elegante para isso, baseado em tries. Eis como:</p>
<p>Pegue uma binary radix trie básica, como os usados por roteadores em software. Mas fixe o número de nós na árvore, digamos, 10 mil. Em um link de backbone, gravando endereços de cabeçalhos de IP, você vai encher 10 mil nós em um instante.</p>
<p>Armazene a lista de nós em uma lista, ordenada em ordem <span class="caps">LRU</span>. Em outras palavras, quando bater um endereço IP com um nó, “toque” o nó, colocando-o no topo da lista. Gradualmente, frequentemente vendo endereços borbulhando para o topo, e infrequentemente vendo nós afundando para baixo.</p>
<p style="text-align: center"><a href="https://www.matasano.com/log/wp-content/uploads/2008/01/Picture_8.png"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_6.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_6.png 2x" alt=""></a></p>
<p>Agora o truque. Quando acabarem os nós e precisar de uma nova, reclame de baixo da lista. Mas quando fizer isso, role os dados do nó para cima passando pelo seu pai, desta maneira:</p>
<p style="text-align: center"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_5.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/2/22/Picture_5.png 2x" alt=""></p>
<p>10.0.1.2 e 10.0.1.3 são irmãos /32s, as duas metades de 10.0.1.2/31. Para reclamá-los, misture-os em 10.0.1.2/31. Se precisar reclamar 10.0.1.2/31, você pode misturá-la com 10.0.1.0/31 para formar 10.0.1.0/30.</p>
<p>Faça isso por, digamos, um minuto, e as fontes mais fortes vão defender suas posições na árvore ficando no topo da lista <span class="caps">LRU</span>, enquanto barulhos ambientes /32 borbulham para /0. Para a lista crua de IP’s acima, com 100 nós, você tem <a href="https://www.matasano.com/data.aguri.txt">isso</a></p>
<p>Cho chama essa heurística de Aguri.</p>
<h1>5</h1>
<p>Aguri tem licença <span class="caps">BSD</span>. Você <a href="https://www.sonycsl.co.jp/~kjc/software.html">pode fazer download dele</a> e um programa driver que observa pacotes via pcap, da antiga homepage de Cho.</p>
<h1>6</h1>
<p>Eu vou a algum lugar com isso, mas estou com mais de 1.300 palavras nesse post agora, e se você for uma pessoa de algoritmos, já deve estar cansado de mim agora, e se não for, já deve estar cansado de mim agora. Então, deixe o Aguri afundar, e eu lhe darei alguma coisa legal e inútil para fazer com isso na semana que vem.</p>
<p></p>
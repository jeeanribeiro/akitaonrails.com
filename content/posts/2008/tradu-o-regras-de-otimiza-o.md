---
title: "Tradução: Regras de Otimização"
date: "2008-07-21T22:25:00.000Z"
tags: ["translation"]
years: "2008"
---

<p></p>
<div style="float: right; margin: 5px"><a href="http://www.aboutus.org/Ward_Cunningham"><img src="http://s3.amazonaws.com/akitaonrails/assets/2008/7/21/240px-Ward_Cunningham.jpg" srcset="http://s3.amazonaws.com/akitaonrails/assets/2008/7/21/240px-Ward_Cunningham.jpg 2x" alt=""></a></div>
<p>Estava lendo um artigo do <a href="http://gc.blog.br/">GC</a> e por acaso esbarrei com um link de um site que não entro faz algum tempo: <a href="http://c2.com/cgi/wiki?RulesOfOptimization">Rules of Optimization</a>. Para colocar em contexto, <a href="http://c2.com/">C2.com</a> significa <strong>“Cunningham &amp; Cunningham”</strong>.</p>
<p>Estamos falando de ninguém menos que <a href="http://en.wikipedia.org/wiki/Ward_Cunningham">Ward Cunningham</a>. Dentre outras coisas ele inventou o conceito de <a href="http://en.wikipedia.org/wiki/WikiWikiWeb">Wiki</a>. Além disso atualmente é <span class="caps">CTO</span> da <a href="http://www.aboutus.org/Ward_Cunningham">AboutUs.org</a> que, segundo o <a href="http://rails100.pbwiki.com/Alexa+Rankings">Alexa Ranking</a> é o 7<sup>o</sup> site mais famoso feito em Ruby on Rails. Ele foi recentemente entrevistado pelo Randall Schwartz e Leo Laporte para o podcast <a href="http://twit.tv/floss27"><span class="caps">FLOSS</span> Weekly</a> e recomendo muito que ouçam.</p>
<p>Mas estou divagando, este artigo que vou traduzir, em particular não é autoria dele :-) Enfim, aqui vai a tradução do artigo em questão:</p>
<p></p>
<p></p>
<h3><a href="https://c2.com/cgi/wiki?RulesOfOptimization">Rules of Optimization</a></h3>
<p>As “regras” de otimização são dispositivos retóricos feitos com a intenção de desencorajar programadores novatos de encher seus programas com tentativas inúteis de escrever código otimizado. Eles são:</p>
<ol>
  <li>Primeira Regra da Otimização: <strong>Não faça</strong></li>
  <li>Segunda Regra da Otimização: <strong>Não faça .. ainda</strong></li>
  <li><a href="/2008/7/21/tradu-o-regras-de-otimiza-o#meca_antes_de_otimizar">Meça Antes de Otimizar</a></li>
</ol>
<p>É incerto até o presente momento, se dispositivos simpáticos como esses mudam, ou se algum dia mudarão quaisquer atitudes.</p>
<p><strong>Fonte:</strong></p>
<p><a href="https://c2.com/cgi/wiki?MichaelJackson">Michael Jackson</a> (não o cantor!) costumava dizer (quando questionado sobre otimização):</p>
<ol>
  <li>Não faça</li>
  <li>Não faça ainda (apenas para especialistas)</li>
</ol>
<p>Isso foi republicado em <a href="https://c2.com/cgi/wiki?ProgrammingPearls">Programming Pearls</a> de <a href="https://c2.com/cgi/wiki?JonBentley">Jon Bentley</a>.</p>
<p>E não nos esqueçamos dessas citações famosas:</p>
<blockquote><em>“O melhor é o inimigo do bom.”</em> – <a href="https://c2.com/cgi/wiki?MrVoltaire">Voltaire</a></blockquote>
<blockquote><em>“Mais pecados de computação são cometidos em nome da eficiência (sem necessariamente atingí-la) do que por qualquer outra razão – incluindo estupidez cega”</em> – W.A. Wulf</blockquote>
<blockquote><em>“Não devemos pensar em pequenas eficiência, digamos por 97% do tempo; <a href="https://c2.com/cgi/wiki?PrematureOptimization">Otimização Prematura</a> é a raíz de todo mal.”</em> – <a href="https://c2.com/cgi/wiki?DonKnuth">Don Knuth</a>, que atribui a observação a <a href="https://c2.com/cgi/wiki?CarHoare">Car Hoare</a></blockquote>
<p><a name="meca_antes_de_otimizar"></a><br>
  h3. Meça Antes de Otimizar</p>
<p>Todas as outras coisas sendo iguais, todos querem que seu código rode o mais rápido possível.</p>
<p>Uma tentação que nunca acaba é “otimizar enquanto se vai”, escrevendo coisas a um nível mais baixo do que realmente deveria (ex. acessando diretamente arrays, usando referências a uma variável de instância em um método que pode ser sobrescrito em vez de usar um método getter, etc.) ou adicionando muitos atalhos de execução para casos especiais.</p>
<p><strong>Isso quase nunca funciona.</strong></p>
<p>Seres humanos, mesmo programadores experientes, são muito ruins em prever (chutar) onde uma computação vai engasgar.</p>
<p><strong>Portanto:</strong></p>
<p>Escreva código de acordo com restrições além de performance (claridade, flexibilidade, brevidade). Então, depois que o código já está escrito:</p>
<ol>
  <li>Veja se realmente precisa acelerá-lo</li>
  <li>Meça o código para checar exatamente onde ele está gastando tempo</li>
  <li>Foque apenas nas poucas áreas de maior custo e deixe o resto em paz</li>
</ol>
<p>Existem várias maneiras de melhorar performance uma vez que você sabe onde: usar uma estrutura de dados que melhor se encaixa às suas necessidades (muitas inserções vs. muitas deleções, muito espaço vs. muito tempo, etc.), tornar seu algoritmo mais esperto (cache de resultados, tirar vantagem da ordenação, caminhar somente onde se precisa, etc), mudar para uma linguagem mais baixo nível ou mesmo implementar a área de maior custo em hardware.</p>
<p>Mas se começar de qualquer jeito tentando otimizar antes de saber onde as coisas estão mais lentas, é garantido que estará tornando a eficiência de seu desenvolvimento mais pessimista.</p>
<p>Quando chega a hora de otimizar um pedaço de software, sempre consiga informações métricas antes, de forma que você possa dizer onde precisa gastar seu tempo fazendo melhorias. Sem dados métricos, não existe maneira de saber com certeza se qualquer “melhoria” de fato melhorou o código (muito similar a usar <a href="https://c2.com/cgi/wiki?UnitTest">Testes Unitários</a>) para determinar quando um projeto acabou).</p>
<p>Normalmente, “medir” significa conseguir medir o tempo gasto em várias rotinas ou sub-sistemas. Isso permite otimizar para velocidade. Otimizar para espaço [de memória], ou erros de cache, ou coisa assim pode ser feito, embora alguns usem um pouco de bruxaria para conseguir um bom perfil de dados.</p>
<p>Otimizações não precisam ser pequenos ajustes, também. Podem ser substituições no atacado de um algoritmo O(N<sup>3</sup>) por um O(N<sup>2</sup>) ou a eliminação total nos casos mais extremos.</p>
<p>Veja o <a href="https://c2.com/cgi/wiki?ProfileBeforeOptimizing">artigo original</a> para acompanhar a discussão.</p>
<h3><a href="https://c2.com/cgi/wiki?OptimizeLater">Otimize Mais Tarde</a></h3>
<p><a href="https://c2.com/cgi/wiki?YouArentGonnaNeedIt" title="YAGNI">Você Não Vai Precisar Disso</a> aplicado a Otimização – <a href="https://c2.com/cgi/wiki?FalkBruegmann">Falk Bruegmann</a></p>
<p>Em outras palavras, você provavelmente não saberá logo de cara se uma otimização trará algum benefício real. Apenas escreva o código da maneira mais simples (<strong>nota do Akita:</strong> não confundir <em>“maneira mais simples”</em> com <em>“maneira mais suja”</em>, ninguém disse que rápido <strong>tem</strong> que ser sujo). Se, eventualmente depois de medir você descobrir um gargalo otimize isso.</p>
<p>Leiam também este artigo de duas páginas de Martin Fowler: <a href="https://martinfowler.com/ieeeSoftware/yetOptimization.pdf">Yet Another Optimization Article</a></p>
<p><strong>Codifique e depois Otimize</strong></p>
<p>Código escrito em Assembler ou C são quase impossíveis de manter. Código escrito em linguagens de script são lentos. Mas se você combinar os dois, e puder medir os scripts lentos para saber onde os gargalos estão.</p>
<p><strong>Portanto,</strong></p>
<p>Não codifique para performance. Não use uma linguagem “rápida”. Codifique visando mantenabilidade e use uma linguagem que melhore essa mantenabilidade. Então meça seu código, encontre os gargalos e substitua <strong>apenas</strong> esses pedacinhos com código-performático em linguagens-rápidas. O resultado é que seu código efetivamente executará tão rápido quanto se você tivesse otimizado ele inteirinho, mas ele será amplamente mais fácil de manter. <a href="https://c2.com/cgi/wiki?AlternateHardAndSoftLayers">AlternateHardAndSoftLayers</a></p>
<ul>
  <li>Faça funcionar,<br>
    <ul><br>
      <li>faça correto,<br>
        <ul><br>
          <li>faça rápido, <br>
            <ul><br>
              <li>faça barato.</li>
              <p></p>
            </ul>
          </li>
          <p></p>
          <p></p>
        </ul>
      </li>
      <p></p>
      <p></p>
    </ul>
  </li>
  <p></p>
</ul>
<p>- (atribuído a) <a href="https://c2.com/cgi/wiki?AlanKay">Alan Kay</a></p>
<p></p>
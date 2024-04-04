---
title: "Micro Tutorial de Git"
date: "2008-04-03T02:57:00.000Z"
tags: ["tutorial"]
years: "2008"
---

<p></p>
<p>Como <a href="http://www.akitaonrails.com/2008/4/3/finalmente-rails-mudando-de-svn-para-git">acabei de postar</a>, todo o repositório do Ruby on Rails vai migrar do antiquado Subversion para Git, em particular ficará no excelente serviço <a href="http://github.com/">Github</a>. O David recomenda ler o tutorial <a href="http://git.or.cz/course/svn.html">Git – <span class="caps">SVN</span> Crash Course</a> que é um guia para quem é usuário de <span class="caps">SVN</span> se acostumar com os comandos de Git. Mas eu resolvi fazer o meu próprio para tentar convencê-los de porque Git é importante.</p>
<p></p>
<p></p>
<h1>Clone do Github</h1>
<p>Pra começar, o Github é quase um ‘social networking para programadores’. Ele torna fazer forks e contribuir para projetos algo trivial. Porém, ele ainda está fechado em Beta e é preciso convite para se cadastrar.</p>
<p>Mas isso não significa que você precise disso. Para começar, a <span class="caps">URL</span> do repositório Git de cada projeto está acessível para quem quiser. Você precisa, sim, se quiser contribuir patches de volta para o repositório original de forma automatizada. Senão, mãos-à-obra:</p>
<p>Não vou reexplicar como se <a href="https://git.or.cz/gitwiki/WindowsInstall">instala Git</a>. Por favor abram o <a href="https://www.google.com/search?client=safari&amp;rls=en-us&amp;q=how+install+git+windows&amp;ie=UTF-8&amp;oe=UTF-8">Google</a> e procurem as dezenas de receitas que já existem. Para usuários de Windows, uma dica, prefiram o método que usa Cygwin. Sem isso vocês não terão a outra excelente razão para se usar Git: o git-svn que permite usar Git com repositórios Subversion.</p>
<p>Por exemplo, digamos que você goste do projeto Merb. Mas quer fazer modificações pessoais que só servem para você.</p>
<p>O código do Merb fica no Github também, nesta <span class="caps">URL</span>:</p>
<macro:code>https://github.com/wycats/merb-core/tree/master<table class="CodeRay">
    <tbody>
      <tr>
        <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
        </td>
        <td class="code"><pre>Em cada projeto lá, você encontra o "Clone URL" que é tudo que você precisa. Com o git instalado, vá ao seu diretório de desenvolvimento e faça:
&lt;macro:code&gt;git clone git://github.com/wycats/merb-core.git merb-core</pre>
        </td>
      </tr>
    </tbody>
  </table>
  <p>Pronto, quando ele terminar você terá um clone do repositório original. Literalmente: porque de brinde você ainda ganha todo o histórico desde o primeiro commit! Esse é o equivalente a se fazer um ‘svn checkout’.</p>
  <p>Feito isso, entre no diretório ‘merb-core’. Digite:</p>
  <macro:code>&gt;&gt; git branch -a<br>
    <br>
    * master<br>
    origin/<span class="caps">HEAD</span><br>
    origin/master<table class="CodeRay">
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
          <td class="code"><pre>O asterisco indica em qual branch você está. Os outros branches eu não mexeria se fosse você, eles servem para puxar novas atualizações do repositório original.
h1. Manipulando Branches Locais
A primeira coisa que recomendo é criar um novo branch. Pode ser qualquer nome, no meu caso eu sempre crio um chamado 'working'.
&lt;macro:code&gt;&gt;&gt; git checkout -b working
Switched to a new branch "working"
&gt;&gt; git branch
  master
* working
</pre>
          </td>
        </tr>
      </tbody>
    </table>
    <p>Esse comando cria o novo branch e já te muda para lá. Note como o asterisco mudou de branch. Agora você pode fazer as loucuras que quiser. Por exemplo, vou editar alguns arquivos aleatoriamente. Como sei o que mudou? Simples:</p>
    <macro:code>&gt;&gt; git status<br>
      # On branch working<br>
      # Changed but not updated:<br>
      # (use “git add <file>…” to update what will be committed)<br>
        #<br>
        # modified: <span class="caps">CONFIG</span><br>
        # modified: <span class="caps">README</span><br>
        # modified: <span class="caps">TODO</span><br>
        #<br>
        # Untracked files:<br>
        # (use “git add <file>…” to include in what will be committed)<br>
          #<br>
          # akita.txt<br>
          no changes added to commit (use “git add” and/or “git commit -a”)<table class="CodeRay">
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
                <td class="code"><pre>Os arquivos que já existiam no repositório e que você mexeu, aparecem como 'modified', ou 'deleted'. Se você criou alguma arquivo novo, ele aparece em 'Untracked files'.
Você precisa adicionar ele ao repositório antes de dar commit. Da mesma forma como você precisaria fazer 'svn add'.
&lt;macro:code&gt;&gt;&gt; git add akita.txt </pre>
                </td>
              </tr>
            </tbody>
          </table>
          <p>Outra forma, caso você tenha vários novos arquivos é usar a seguinte linha:</p>
          <macro:code>&gt;&gt; git add -i<br>
            staged unstaged path<br>
            1: unchanged +3/-1 <span class="caps">CONFIG</span><br>
            2: unchanged +2/-0 <span class="caps">README</span><br>
            3: unchanged +1/-0 <span class="caps">TODO</span><br>
            <br>
            <b>* Commands *</b><br>
            1: status 2: update 3: revert 4: add untracked<br>
            5: patch 6: diff 7: quit 8: help<br>
            What now&gt;<table class="CodeRay">
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
                  <td class="code"><pre>A opção "-i" significa 'interativo'. Ele abre um sisteminha onde você pode digitar a opção "4". Daí ele mostrará uma lista de arquivos cada um com um número na frente. Para adicioná-lo, digite o número de cada arquivo que quiser. No final dê enter sem digitar nada e ele volta para o menu acima. Quando acabar digite '7' para voltar ao shell.
&lt;macro:code&gt;What now&gt; 4
  1: akita.txt
Add untracked&gt;&gt; 1
* 1: akita.txt
Add untracked&gt;&gt; 
added one path
</pre>
                  </td>
                </tr>
              </tbody>
            </table>
            <p>Pronto. Com os arquivos adicionados, basta fazer o commit:</p>
            <macro:code>&gt;&gt; git commit <del>a -m “meu primeiro commit”<br>
                Created commit 457f597: meu primeiro commit<br>
                4 files changed, 7 insertions(+), 1 deletions(</del>)<br>
              create mode 100644 akita.txt<table class="CodeRay">
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
                    <td class="code"><pre>O git commit funciona parecido com svn commit, mas você tem o -a para que ele adicione automaticamente todo arquivo que foi modificado. O -m é como no svn, para colocar mensagens de commit.
Vejamos como isso se parece:
&lt;p style="text-align: center; margin: 3px"&gt;!https://s3.amazonaws.com/akitaonrails/assets/2008/4/3/Picture_3.png!&lt;/p&gt;
Note como o branch master ficou para trás e o nosso 'working' subiu: isso porque agora ele tem modificações que não existem no master.
Vamos brincar mais um pouco. Digamos que você descubra um bug no master que precisa corrigir rapidamente e colocar em produção mas não quer colocar também o que você acabou de fazer no 'working' porque ainda não está pronto. O que fazer?? Não se preocupe, é aqui que o Git começa a brilhar:
&lt;macro:code&gt;&gt;&gt; git checkout master
Switched to branch "master"
&gt;&gt; git checkout -b meufix
Switched to branch "meufix"
&gt;&gt; ls akita.txt
ls: akita.txt: No such file or directory
</pre>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p>Vamos lá! Na primeira linha eu voltei ao branch master. De lá vou criar meu novo branch, com git checkout novamente, como já fizemos antes. Nesse ponto, o branch ‘meufix’ virou uma cópia exata do master, sem o código que eu estava trabalhando, que ficou no branch separado ‘working’. Como disse antes, o git checkout -b cria o novo branch e já me coloca nele.</p>
              <p>O último comando é um ‘ls’ (o equivalente de ‘dir’, para quem é de Windows). Lembram que no branch ‘working’ eu criei um arquivinho ‘akita.txt’? Como esse arquivo só existe no branch ‘working’, quando criei o branch ‘meufix’ a partir do ‘master’ ele não veio, claro. Estou com uma cópia exata do branch principal.</p>
              <p>Agora, vou fazer as correções que preciso.</p>
              <macro:code>&gt;&gt; git commit <del>a -m “minha correcao”<br>
                  Created commit 760873a: minha correcao<br>
                  3 files changed, 6 insertions(+), 1 deletions(</del>)<table class="CodeRay">
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
</pre>
                      </td>
                      <td class="code"><pre>Pronto! Fiz minhas correções, fiz o commit e agora posso jogar em produção. Meu chefe me deixa em paz e eu posso voltar ao que estava fazendo antes.
h1. Merges Triviais
Espere um instante, e agora? Em que situação estou. Vamos ver:
&lt;p style="text-align: center; margin: 3px"&gt;!https://s3.amazonaws.com/akitaonrails/assets/2008/4/3/Picture_4.png!&lt;/p&gt;
Que bagunça! Agora eu tenho o branch 'master', que ainda é a cópia exata do repositório no Github. Tenho o branch 'working' onde eu acrescentei meu código novo. E tenho o branch 'meufix' com a correção sobre o master.
Ambos 'working' e 'master' tem um ancestral em comum, o 'master'. O que vou fazer agora não é o comum, mas faça de conta que você tenha permissão de escrita no repositório central do Github e quer jogar essa correção que fizemos para lá. Ou seja, preciso pegar a correção, jogar no master e dali empurrar para o servidor online:
&lt;macro:code&gt;&gt;&gt; git branch
  master
* meufix
  working
&gt;&gt; git checkout master
Switched to branch "master"
&gt;&gt; git merge meufix
Updating a83054c..dee9e1f
Fast forward
 CHANGELOG |    1 +
 CONFIG    |    3 ++-
 TODO      |    1 +
 3 files changed, 4 insertions(+), 1 deletions(-)
&gt;&gt; git branch -d meufix
Deleted branch meufix.
</pre>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <p>Apenas para ter certeza, na primeira linha usamos o comando git branch para ver quais branches existem e em qual estou. Feito isso, mudo de volta para o branch master.</p>
                <p>O comando git merge faz o que esperamos: traz as correções que fizemos no branch ‘meufix’ de volta para o master. Finalmente o último comando, git branch -d apaga o branch ‘meufix’, já que não vamos mais precisar dele. Veja como é tudo muito rápido!! E sem precisa mexer em mais nada.</p>
                <p>Bom, vamos voltar para nosso branch ‘working’ e continuar trabalhando nele.</p>
                <macro:code>&gt;&gt; git status<br>
                  # On branch working<br>
                  # Changed but not updated:<br>
                  # (use “git add <file>…” to update what will be committed)<br>
                    #<br>
                    # modified: <span class="caps">LICENSE</span><br>
                    # modified: akita.txt<br>
                    #<br>
                    no changes added to commit (use “git add” and/or “git commit -a”)<table class="CodeRay">
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
                          <td class="code"><pre>Pronto, estamos em 'working' e continuamos trabalhando. Veja como eu mexi em dois arquivos. Eis que me dou conta: _"As correções que acabei de dar merge no master!!"_ Pois é, eu preciso trazer as correções do master para o working. Mas agora estou no meio de uma codificação e ainda não estou a fim de fazer commit. O que fazer? Eis a resposta:
&lt;macro:code&gt;&gt;&gt; git stash
Saved "WIP on working: 457f597... meu primeiro commit"
HEAD is now at 457f597... meu primeiro commit
</pre>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <p>Pense em ‘stash’ como uma pilha temporária de coisas. Eu não quis fazer commit dos dois arquivos me mexi acima, então simplesmente joguei para o stash e ele vai ficar lá por um momento. Agora vamos pegar as correções que estão no master:</p>
                    <macro:code>&gt;&gt; git rebase master<br>
                      First, rewinding head to replay your work on top of it…<br>
                      <span class="caps">HEAD</span> is now at dee9e1f… minha correcao<br>
                      <br>
                      Applying meu primeiro commit<br>
                      <br>
                      error: patch failed: <span class="caps">CONFIG</span>:1<br>
                      error: <span class="caps">CONFIG</span>: patch does not apply<br>
                      error: patch failed: <span class="caps">TODO</span>:0<br>
                      error: <span class="caps">TODO</span>: patch does not apply<br>
                      Using index info to reconstruct a base tree…<br>
                      Falling back to patching base and 3-way merge…<br>
                      Auto-merged <span class="caps">CONFIG</span><br>
                      <span class="caps">CONFLICT</span> (content): Merge conflict in <span class="caps">CONFIG</span><br>
                      Auto-merged <span class="caps">TODO</span><br>
                      <span class="caps">CONFLICT</span> (content): Merge conflict in <span class="caps">TODO</span><br>
                      Failed to merge in the changes.<br>
                      Patch failed at 0001.<br>
                      <br>
                      When you have resolved this problem run “git rebase —continue”.<br>
                      If you would prefer to skip this patch, instead run “git rebase —skip”.<br>
                      To restore the original branch and stop rebasing run “git rebase —abort”.<table class="CodeRay">
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
                            <td class="code"><pre>Uau! Quanta coisa! Dois conflitos! _"Droga, mas não disseram que o Git faz merges inteligentes?"_ Exatamente, ele fará o melhor merge possível. Já explico isso melhor. Mas de qualquer forma, ocasionalmente sempre haverá o caso onde o Git não tem como decidir, por exemplo, quando dois desenvolvedores modificam exatamente a mesma linha: qual dos dois tem prioridade? Então, vamos corrigir os erros na mão. Você pode usar qualquer ferramenta GUI que manipula Diffs, é a mesma coisa:
&lt;macro:code&gt;teste
&lt;&lt;&lt;&lt;&lt;&lt;&lt; HEAD:CONFIG
=======
&gt;&gt;&gt;&gt;&gt;&gt;&gt; meu primeiro commit:CONFIG
</pre>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      <p>No primeiro arquivo, <span class="caps">CONFIG</span>, felizmente era apenas uma linha branca a mais. Então vamos apenas retirar as marcações do diff de lá e salvar.</p>
                      <macro:code>&lt;&lt;&lt;&lt;&lt;&lt;&lt; <span class="caps">HEAD</span>:<span class="caps">TODO</span><br>
                        <span class="caps">TESTE</span><br>
                        ===<br>
                        outra modificacao<br>
                        &gt;&gt;&gt;&gt;&gt;&gt;&gt; meu primeiro commit:<span class="caps">TODO</span>
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
</pre>
                              </td>
                              <td class="code"><pre>O segundo arquivo, TODO, tinha dois conteúdos diferentes para a mesma linha. Vou escolher a primeira e tirar as marcações de diff, e salvar o arquivo.
&lt;macro:code&gt;git status
# On branch working
# Changes to be committed:
#   (use "git reset HEAD &lt;file&gt;..." to unstage)
#
#        modified:   README
#        new file:   akita.txt
#
# Changed but not updated:
#   (use "git add &lt;file&gt;..." to update what will be committed)
#
#        unmerged:   CONFIG
#        modified:   CONFIG
#        unmerged:   TODO
#        modified:   TODO
#
# Untracked files:
#   (use "git add &lt;file&gt;..." to include in what will be committed)
#
#        .dotest/
</pre>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        <p>Pronto. Os dois arquivos conflitados aparecem na lista ‘Changed but not updated’. Para continuar, precisamos usar git add para indicar ao Git que já resolvemos os conflitos:</p>
                        <macro:code>&gt;&gt; git add <span class="caps">CONFIG</span> <br>
                          &gt;&gt; git add <span class="caps">TODO</span><br>
                          &gt;&gt; git rebase —continue<br>
                          <br>
                          Applying meu primeiro commit<br>
                          <br>
                          Wrote tree ba231cbcbb1c61e67b4871e09be67b744559d28d<br>
                          Committed: d5d5def2e451acc55fbcceeb634efffb0164b431<table class="CodeRay">
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
</pre>
                                </td>
                                <td class="code"><pre>Agora sim, terminou sem nenhum erro! O que ele fez? Ele continuou a operação de 'rebase' que começamos lá em cima e foi até o fim. Quando os conflitos apareceram vocês devem ter notado que no git status que dei antes apareceu um cara estranho chamado .dotest/. Ele guardou o que faltava aplicar no nosso branch e o comando git rebase --continue segue a partir de onde parou usando o que ficou gravado em .dotest/. Agora que o rebase terminou, esse diretório também some.
h1. Merge vs Rebase
E por que antes eu fiz 'merge' e agora eu usei esse tal de 'rebase'?
Isso é importante! Prestem atenção. Rebase é o seguinte: ele dará rollback até o commit onde eu fiz o branch. Ou seja, o primeiro commit que eu fiz no começo do artigo será guardado e o branch voltará ao estado inicial. Sobre ele, ele pegará os commits novos que apareceram no branch original, o 'master', e o aplicará sobre meu branch 'working'.
Dessa forma o 'working' ficará sincronizado com o principal. Agora, sobre isso, ele reaplicará todos os commits que eu fiz exclusivamente dentro do branch 'working'. 
Agora, o merge é o contrário: você trabalhou no branch e agora quer trazer as modificações de volta ao 'master', então você faz merge. Eu decorei assim: do master para meu branch, rebase. Do meu branch para o master, merge.
Fazendo isso, você normalmente terá mais conflitos quando fizer o rebase no seu branch temporário, mas resolvendo os conflitos ali, quando fizer o merge para o master, ele será automático e sem erros.
Agora, faltou uma coisa: o stash!! Lembram dos dois arquivos que eu guardei no stash, que eu ainda não havia feito commit? Vamos buscá-lo:
&lt;macro:code&gt;&gt;&gt; git stash apply
# On branch working
# Changed but not updated:
#   (use "git add &lt;file&gt;..." to update what will be committed)
#
#        modified:   LICENSE
#        modified:   akita.txt
#
no changes added to commit (use "git add" and/or "git commit -a")
&gt;&gt; git stash clear
</pre>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p>Pronto. O comando git stash apply trará nossas modificações de volta. Também poderia haver conflitos, o procedimento é o mesmo de antes. O último comando é para limpar o espaço do stash, é bom fazer isso sempre que aplicar as modificações de volta. O stash é muito útil e você pode ter quantos stashes quantos quiser, inclusive pode dar nome a eles.</p>
                          <p style="text-align: center; margin: 3px"><img src="https://s3.amazonaws.com/akitaonrails/assets/2008/4/3/Picture_6.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2008/4/3/Picture_6.png 2x" alt=""></p>
                          <p>Vejamos mais sobre o rebase na prática. Antes disso, vamos fazer o commit desses 2 arquivos que recuperamos do stash:</p>
                          <macro:code>&gt;&gt; git add . <br>
                            &gt;&gt; git commit <del>a -m “mais um commit”<br>
                              Created commit 69bc9a8: mais um commit<br>
                              2 files changed, 3 insertions(+), 1 deletions(</del>)<table class="CodeRay">
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
                                  <td class="code"><pre>O git add . (ponto) significa _"adicione todo novo arquivo que apareceu agora e que não estava no repositório antes."_ O segundo comando vocês já conhecem. Cuidado ao adicionar tudo de uma vez só, você pode acabar adicionando arquivos que não queria como logs e outras sujeiras. Use git status para se certificar do que está adicionando.
h1. Rebaseando seu Branch
&lt;macro:code&gt;&gt;&gt; git checkout master
Switched to branch "master"
&gt;&gt; git pull       
Merge made by recursive.
 lib/merb-core/bootloader.rb                        |   18 +++++--
 lib/merb-core/controller/abstract_controller.rb    |   10 +-</pre>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            lib/merb-core/controller/exceptions.rb | 8 ++—
                            lib/merb-core/controller/mixins/controller.rb | 10 ++—
                            lib/merb-core/controller/mixins/render.rb | 49 ++++++++++++++++++—
                            lib/merb-core/core_ext/string.rb | 11 ++++-
                            lib/merb-core/dispatch/router/route.rb | 2 +-
                            lib/merb-core/rack/handler/mongrel.rb | 2 +-
                            …/abstract_controller/controllers/render.rb | 12 +++++
                            spec/public/abstract_controller/render_spec.rb | 12 +++++
                            10 files changed, 105 insertions(+), 29 deletions(-)<table class="CodeRay">
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
</pre>
                                  </td>
                                  <td class="code"><pre>Na primeira linha, voltamos ao branch master. Acho que não precisa, mas eu prefiro seguir esse fluxo. Em seguida damos simplesmente git pull, que irá buscar novidades no repositório online do Github. Veja que vieram novas modificações! 
Como eu ainda não terminei minha nova funcionalidade no branch 'working', quero que essas novidades estejam lá também para que eu possa testar contra meu código. Vamos repetir o que eu expliquei acima:
&lt;macro:code&gt;&gt;&gt; git checkout working
Switched to branch "working"
&gt;&gt; git rebase master
First, rewinding head to replay your work on top of it...
HEAD is now at 76969b2... Merge branch 'master' of git://github.com/wycats/merb-core
Applying meu primeiro commit
Wrote tree 0f9f0e2b72f45f14a7b941b8e064de8dba678566
Committed: 9c35dc1cead3f50c8b96494b01cf2b7a29fdb2fa
Applying mais um commit
Wrote tree 104dd17852e815cfc4e23345ae123ea390c997e3
Committed: c9a4f27905d47d57798ee2b3239eec1e162cb452</pre>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <p>Pronto. Agora meu branch ‘working’ está sincronizado com o ‘master’.</p>
                            <h1>Reusando e Resincronizando seus Repositórios</h1>
                            <p>Façamos de conta que eu acabei o código que estava trabalhando no ‘working’. Agora gostaria de utilizá-lo em outro projeto meu. Ou seja, em vez de usar o Merb original, quero usar o meu Merb customizado. Como fazer isso?</p>
                            <p>Antes de mais nada, ‘working’ não é um nome legal, quero mudar de nome para refletir o código que acabei de terminar. Para isso faça:</p>
                            <macro:code>&gt;&gt; git branch -m working meu_merb<br>
                              <br>
                              &gt;&gt; git branch<br>
                              master<br>
                              * meu_merb<table class="CodeRay">
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
                                    <td class="code"><pre>Veja, como o branch 'working' sumiu e apareceu o 'meu_merb'. Esse comando é mais ou menos um rename simples.
Agora, vou sair desse diretório, porque quero reusar esse branch de outro lugar, em outro projeto meu:
&lt;macro:code&gt;&gt;&gt; cd ..
&gt;&gt; git clone merb-core projeto-merb
Initialized empty Git repository in /Users/akitaonrails/rails/sandbox/merb/projeto-merb/.git/
</pre>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <p>Então, primeiro dou um cd .. para voltar para meu diretório-raíz. De lá faço o clone do <em>branch atual onde eu estava, no caso meu_merb</em>.</p>
                              <macro:code>&gt;&gt; cd projeto-merb<br>
                                <br>
                                &gt;&gt; git branch <br>
                                * meu_merb<table class="CodeRay">
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
</pre>
                                      </td>
                                      <td class="code"><pre>Agora, entro novamente em meu projeto. Veja como só temos o branch meu_merb lá, com todas as customizações que eu tinha feito.
Vamos modificar e fazer um commit nesse novo projeto:
&lt;macro:code&gt;&gt;&gt; vi README
&gt;&gt; git status
# On branch meu_merb
# Changed but not updated:
#   (use "git add &lt;file&gt;..." to update what will be committed)
#
#        modified:   README
#
no changes added to commit (use "git add" and/or "git commit -a")
&gt;&gt; git commit -a -m "modificacao no projeto"
Created commit a730a96: modificacao no projeto
 1 files changed, 1 insertions(+), 1 deletions(-)
&gt;&gt; git push
updating 'refs/heads/meu_merb'
  from c9a4f27905d47d57798ee2b3239eec1e162cb452
  to   a730a9698905fd6f9a933feca6777198bde2eb9e
 Also local refs/remotes/origin/meu_merb
Generating pack...
Done counting 3 objects.
Deltifying 3 objects...
 100% (3/3) done
Writing 3 objects...
 100% (3/3) done
Total 3 (delta 0), reused 0 (delta 0)
Unpacking 3 objects...
 100% (3/3) done
refs/heads/meu_merb: c9a4f27905d47d57798ee2b3239eec1e162cb452 -&gt; a730a9698905fd6f9a933feca6777198bde2eb9e
</pre>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                                <p>Ok, até o git commit todo mundo deve ter entendido. Mas e esse git push? Bom, se git pull trás tudo do repositório original, git push empurra as modificações de volta, se você tiver permissão de escrita nele, claro. Vamos voltar ao projeto original e checar isso:</p>
                                <macro:code>&gt;&gt; cd ../merb-core/<table class="CodeRay">
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
</pre>
                                        </td>
                                        <td class="code"><pre>&lt;p style="text-align: center; margin: 3px"&gt;!https://s3.amazonaws.com/akitaonrails/assets/2008/4/3/Picture_7.png!&lt;/p&gt;
Está vendo? Veja a descrição do commit que eu fiz fora do projeto e que agora está no meu branch! 
Sabe o que isso significa? Digamos que você gosta de algum projeto open source, como Merb, Mephisto, Rubinius e qualquer outro que está em Git. Agora digamos que você quer mudar ele para melhor servir suas necessidades pessoais, ou seja, coisas que não é interessante contribuir de volta porque só serve para você.
Antigamente você tinha um problema: você fazia um svn checkout mas não tinha como fazer commits para lugar algum. Pior, toda vez que viesse uma mudança a partir do servidor original, era aquela bagunça.
Agora não só você pode fazer modificações num branch separado, fazer commits, merges e rebases locais, como também ainda fazer um clone do seu clone!! E tudo funciona perfeitamente.
h1. Limpando a Casa
Finalmente, mais algumas dicas. Digamos que me arrependi de tudo que fiz! Quero que meu projeto Merb volte a ser como era antes. Bom, sempre podemos apagar o diretório original e fazer um clone do servidor online de novo, mas isso não seria esperto, façamos do jeito certo:
&lt;macro:code&gt;&gt;&gt; git checkout master
Already on branch "master"
&gt;&gt; git branch -d meu_merb
error: The branch 'meu_merb' is not a strict subset of your current HEAD.
If you are sure you want to delete it, run 'git branch -D meu_merb'.
&gt;&gt; git branch -D meu_merb
Deleted branch meu_merb.
&gt;&gt; git reset --hard HEAD^1
HEAD is now at dee9e1f... minha correcao
&gt;&gt; git reset --hard HEAD^1
HEAD is now at a83054c... Added Time#to_json to Core Extensions, making the default JSON formatted output for Time objects ISO 8601 compatible.
</pre>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <p>Vamos entender. Primeiro, eu me certifico que estou no branch ‘master’. Em seguida tento apagar o branch ‘meu_merb’. Ele se recusa porque eu fiz modificações nele que ainda não joguei de volta ao master, mas eu quero mesmo perder tudo então forço com a opção -D (“D” maiúsculo).</p>
                                  <p>Agora, um comando novo, git reset —hard <span class="caps">HEAD</span>^1. <span class="caps">HEAD</span> é o topo da lista de commits. <span class="caps">HEAD</span>^1 significa, um commit para trás. <span class="caps">HEAD</span>^2 significa dois commits para trás, e assim por diante. Você também pode usar o nome do commit (que é um identificador <span class="caps">SHA</span>-1 meio longo). Cada vez que você dá reset para apagar um commit que você fez, ele mostra a descrição do commit que virou o novo <span class="caps">HEAD</span>. Eu fiz uma vez, e na segunda vez ele mostrou que o <span class="caps">HEAD</span> é um commit que não fui eu quem fez. É onde eu páro.</p>
                                  <p>Esse comando serve para outra coisa também, digamos que fiz várias coisas bizarras como apagar o que não devia e tal. Se você se der conta disso antes de fazer um commit, basta digitar somente git reset —hard. Assim ele vai retornar tudo o que você fez até o último commit.</p>
                                  <p>Prestem atenção! Ele vai desfazer <strong>tudo</strong> que você fez! Inclusive, se você apagou diretórios e renomeou um monte de coisas, ele vai recuperar <strong>tudo</strong> para você. E isso sem precisar ir online uma única vez!</p>
                                  <h1>Golpe de Mestre!!</h1>
                                  <p>Agora, apenas para demonstrar algumas das inteligências do Git, vou criar um novo branch a partir do master e fazer uma alteração que o Subversion provavelmente choraria:</p>
                                  <macro:code>&gt;&gt; git checkout -b working<br>
                                    Switched to a new branch “working”<br>
                                    <br>
                                    &gt;&gt; vi <span class="caps">LICENSE</span> <br>
                                    &gt;&gt; mv <span class="caps">LICENSE</span> licenca.txt<br>
                                    <br>
                                    &gt;&gt; git status<br>
                                    # On branch working<br>
                                    # Changed but not updated:<br>
                                    # (use “git add/rm <file>…” to update what will be committed)<br>
                                      #<br>
                                      # deleted: <span class="caps">LICENSE</span><br>
                                      #<br>
                                      # Untracked files:<br>
                                      # (use “git add <file>…” to include in what will be committed)<br>
                                        #<br>
                                        # licenca.txt<br>
                                        no changes added to commit (use “git add” and/or “git commit -a”)<table class="CodeRay">
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
                                              <td class="code"><pre>Vejam: eu alterei o conteúdo do arquivo LICENSE e ainda por cima renomeei para licenca.txt. No git status ele viu que eu *apaguei* o LICENSE e que apareceu um novo arquivo licenca.txt. Só de curiosidade, eis o trecho que adicionei no topo do arquivo, agora licenca.txt:
&lt;macro:code&gt;Fabio Akita
www.akitaonrails.com
Copyright (c) 2008 Ezra Zygmuntowicz
...
</pre>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                        <p>Vou fazer o commit (não esquecer da opção -a !):</p>
                                        <macro:code>&gt;&gt; git add licenca.txt<br>
                                          <br>
                                          &gt;&gt; git commit <del>a -m “Novo arquivo”<br>
                                            Created commit a2e52ec: Novo arquivo<br>
                                            2 files changed, 23 insertions(+), 20 deletions(</del>)<br>
                                          delete mode 100644 <span class="caps">LICENSE</span><br>
                                          create mode 100644 licenca.txt<table class="CodeRay">
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
                                                <td class="code"><pre>Agora o golpe de misericórdia. Vou retornar ao branch master e modificar o *mesmo arquivo* LICENSE em um lugar diferente - faça de conta que outro desenvolvedor fez modificações e eu dei git pull para trazê-las para o master.
&lt;macro:code&gt;&gt;&gt; git checkout master
Switched to branch "master"
&gt;&gt; vi LICENSE 
&gt;&gt; git commit -a -m "modificando LICENSE"
Created commit 6c74941: modificando LICENSE
 1 files changed, 2 insertions(+), 8 deletions(-)
</pre>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                          <p>O que aconteceu aqui? Vamos recordar: no branch ‘working’ eu modifiquei o conteúdo de <span class="caps">LICENSE</span> e renomei para licenca.txt. No branch ‘master’ eu apenas modifiquei o conteúdo de <span class="caps">LICENSE</span> e, de curiosidade eis o que eu fiz:</p>
                                          <macro:code>Copyright © 2008 Ezra Zygmuntowicz<br>
                                            <br>
                                            Artigo sobre Git<br>
                                            <br>
                                            The above copyright notice and this permission notice shall be<br>
                                            included in all copies or substantial portions of the Software.<br>
                                            …<table class="CodeRay">
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
                                                  <td class="code"><pre>Eu acrescentei uma linha e apaguei um parágrafo. Agora é a hora da verdade. Farei o merge do branch 'working' sobre o 'master'. Se fosse o Subversion aconteceria o seguinte: o arquivo LICENSE do master ia continuar lá e apareceria um novo arquivo licenca.txt, mas os dois conteúdos não seria misturados, que é o que gostaríamos que acontecesse. _"Lógico, nenhum sistema pode saber isso!"_ é o que alguém diria. Tolinho:
&lt;macro:code&gt;&gt;&gt; git merge working
Renamed LICENSE =&gt; licenca.txt
Auto-merged licenca.txt
Merge made by recursive.
 LICENSE =&gt; licenca.txt |    3 +++
 1 files changed, 3 insertions(+), 0 deletions(-)
 rename LICENSE =&gt; licenca.txt (94%)
</pre>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                            <p>Prestem atenção ao que o comando git merge disse. Primeiro, vejamos se o arquivo <span class="caps">LICENSE</span> ainda existe:</p>
                                            <macro:code>&gt;&gt; ls <span class="caps">LICENSE</span><br>
                                              ls: <span class="caps">LICENSE</span>: No such file or directory<table class="CodeRay">
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
                                                    <td class="code"><pre>Agora, vejamos o que tem no arquvo licenca.txt.
&lt;macro:code&gt;Fabio Akita
www.akitaonrails.com
Copyright (c) 2008 Ezra Zygmuntowicz
Artigo sobre Git
The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.
...
</pre>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <p>Estou vendo cara de espanto de alguém aí na platéia?? Entenderam o que aconteceu? Eu não fiz um svn delete nem um svn rename, nem dei nenhuma dica ao Git sobre o que eu fiz, mas ele entendeu que o conteúdo de licenca.txt tem como antecessor o <span class="caps">LICENSE</span>, e ele entendeu que alguém mexeu no <span class="caps">LICENSE</span> em outro branch, portanto, ambos deveriam ser mesclados e, claro, ele inteligentemente fez isso!!</p>
                                              <p>Estão vendo? São coisas como essas que fazem o Git tão popular.</p>
                                              <h1>Conclusão Arrebatadora</h1>
                                              <p>Percebam outra coisa: eu criei branches, apaguei commits, apaguei os branches e tudo isso sem sair do mesmo diretório. Nada de sub-diretórios bagunçando tudo. Posso trabalhar em branches paralelos sem nenhum problema. Mais do que isso: tudo muito rápido! Posso até apagar as coisas e recuperar com um reset ou de outro branch sem precisar tocar a minha rede! Está tudo dentro do único diretório de sistema que ele precisa, chamado .git.</p>
                                              <p>Melhor ainda, nada de .cvs ou .svn em <strong>todo</strong> sub-diretório do meu projeto. Apenas um pequeníssimo .git na raíz e mais nada. Querem ver quão pequeno isso é?</p>
                                              <p>Lembrem-se que o .git guarda <strong><span class="caps">TODO</span></strong> o histórico do projeto desde o primeiro commit. Bom, com o .git dentro o projeto merb-core tem 2.7Mb.</p>
                                              <p>Se retirar o .git, o projeto fica com 1.5Mb. Novamente <strong><span class="caps">TODO</span></strong> o histórico do repositório. 800kb, pouco mais da metade do código-fonte, contendo todas as modificações feitas por todos os desenvolvedores do projeto desde o primeiro dia, e tudo off-line na sua máquina. Por isso que mesmo o clone inicial, que buscou tudo do repositório Github, é tão rápido.</p>
                                              <p>Espero que isso tenha dado uma luz sobre como usar o Git no dia a dia. Em <a href="/2008/2/4/akitaonrails-on-mephisto-0-8-on-git">outro artigo</a> eu demonstrei como fazer um clone de um repositório Subversion em vez de Git. Uma vez feito isso, localmente são todos os mesmos fluxos que mostrei acima.</p>
                                              <p>Branches são instantâneos, merges são instantâneos, clones são muitos rápidos, clones locais são instantâneos. É tudo absurdamente rápido. E não é porque mexi em poucos arquivos, o Linus Torvalds faz mais de 20 mil merges de arquivos por dia, tudo com velocidade – e ele é exigente, vocês sabem disso.</p>
                                              <p>Agora com o Edge Rails migrando para Github, qualquer um pode fazer um clone de lá, criar uma versão customizada para seus projetos, e continuar sincronizando com o repositório original, mantendo seu repositório local sempre em dia, coisa que era impossível de fazer com Subversion sem fazer muito malabarismo.</p>
                                              <p>Eu escrevi esse artigo ao mesmo tempo em que ia digitando os exemplos acima, não travei um único minuto preso em algum beco sem saída. O Git é absurdamente flexível e performático (pois é escrito em C, não dá para ser mais rápido do que isso). Definitivamente o <span class="caps">SCM</span> da nova geração.</p>
                                              <p>Como aprender mais? Procure <a href="https://www.google.com/search?hl=en&amp;client=safari&amp;rls=en-us&amp;q=site%3Awww.akitaonrails.com+git&amp;btnG=Search">no meu site</a> os artigos que falei sobre Git (são vários!). Compre o <a href="/2007/10/26/aprenda-git-pelo-peepcode">screencast do Peepcode</a> ensinando Git, é a forma mais rápida! E procure os vários artigos e tutoriais pela internet, tem muito material.</p>
                                              <p></p>
                                              <h4>tags: <span class="label label-important"><a href="/git">git</a></span> <span class="label label-important"><a href="/tutorial">tutorial</a></span></h4>
                                            </macro:code>
                                          </macro:code>
                                        </macro:code>
                                      </file>
                                    </file>
                                  </macro:code>
                                </macro:code>
                              </macro:code>
                            </macro:code>
                          </macro:code>
                        </macro:code>
                      </macro:code>
                    </macro:code>
                  </file>
                </macro:code>
              </macro:code>
            </macro:code>
          </macro:code>
        </file>
      </file>
    </macro:code>
  </macro:code>
</macro:code>
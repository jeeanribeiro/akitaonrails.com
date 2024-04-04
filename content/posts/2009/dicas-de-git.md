---
title: "Dicas de Git"
date: "2009-07-05T17:56:00.000Z"
tags: ["beginner", "git"]
years: "2009"
---

<p></p>
<p>Se você ainda não aprendeu Git, um bom lugar para começar é meu <a href="/2008/4/3/micro-tutorial-de-git">Micro Tutorial de Git</a>. Para complementar, existem algumas dicas úteis para usar no dia-a-dia que vou explicar agora. Mesmo assim, Git é um mundo rico e complexo, existem infinitas possibilidades e você nunca vai se cansar de aprender coisas novas com ele. Recomendo também acompanhar o site <a href="http://www.gitready.com/">GitReady</a> para continuar aprendendo truques novos.</p>
<p>Para começar, vamos criar um novo repositório para exemplo:</p>
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
      <td class="code"><pre>rails teste
cd teste
git init
git add .
git commit -m "initial commit"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora vamos falar sobre como desfazer modificações, manipular commits, e muito mais.</p>
<p></p>
<p></p>
<h3>Undo</h3>
<p>Uma coisa que muitos perguntam e podem se confundir devido a comandos do git como ‘reset’ e ‘revert’. Por exemplo, digamos que você editou alguns arquivos e quer retornar apenas um deles ao estado original do último commit:</p>
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
      <td class="code"><pre>(master) $ git status
# On branch master
# Changed but not updated:
#   (use "git add &lt;file&gt;..." to update what will be committed)
#   (use "git checkout -- &lt;file&gt;..." to discard changes in working directory)
#
#       modified:   README
#       modified:   Rakefile
#
no changes added to commit (use "git add" and/or "git commit -a")
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>No exemplo, modificamos os arquivos ‘<span class="caps">README</span>’ e ‘Rakefile’. Agora digamos que você desistiu das mudanças no arquivo Rakefile e quer que ele volte ao estado original. Para isso apenas faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git checkout Rakefile
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Porém, digamos que você queira realmente desfazer todas as modificações que você fez, nesse caso você faz:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git reset --hard
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso retornará todos os arquivos modificados de volta ao estado original do último commit. Porém esse comando apenas afeta arquivos que já fazem parte do repositório. Se você criou diversos arquivos novos e que se livrar deles também, faça isto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git clean -d -f
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Adicionando arquivos ao repositório</h3>
<p>Uma coisa que muitos aprendem, decoram e fazem da forma errada é este comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git commit -a -m "mensagem do commit"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A opção “-a” essencialmente significa o equivalente a fazer o seguinte: ‘adicione todos os arquivos modificados ao próximo commit’. Normalmente é isso mesmo que queremos fazer, mas nem sempre. Por exemplo, isso não adiciona arquivos que já não estavam no repositório, para esses você precisa adicionar manualmente antes de fazer o commit, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git add novo_arquivo.txt
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Digamos que você tem esta situação:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>./script/generate scaffold Post title:string
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso nos dá o seguinte:</p>
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
</pre>
      </td>
      <td class="code"><pre>(master) $ git status
# On branch master
# Changed but not updated:
#   (use "git add &lt;file&gt;..." to update what will be committed)
#   (use "git checkout -- &lt;file&gt;..." to discard changes in working directory)
#
#       modified:   config/routes.rb
#
# Untracked files:
#   (use "git add &lt;file&gt;..." to include in what will be committed)
#
#       app/controllers/posts_controller.rb
#       app/helpers/posts_helper.rb
#       app/models/
#       app/views/
#       db/
#       public/stylesheets/
#       test/fixtures/
#       test/functional/
#       test/unit/
no changes added to commit (use "git add" and/or "git commit -a")
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Preste sempre atenção – as pessoas se acostumam a “não ler” as coisas. Vejam que temos dois grupos de modificações:</p>
<ul>
  <li>Changed but not updated – significa arquivos que já estavam no repositório e foram modificados</li>
  <li>Untracked files – significa arquivos novos, que ainda não foram adicionados ao repositório</li>
</ul>
<p>Agora, façamos algumas operações:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>git add app/models/
git add config/routes.rb
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vejam o resultado:</p>
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
      <td class="code"><pre>(master) $ git status
# On branch master
# Changes to be committed:
#   (use "git reset HEAD &lt;file&gt;..." to unstage)
#
#       new file:   app/models/post.rb
#       modified:   config/routes.rb
#
# Untracked files:
#   (use "git add &lt;file&gt;..." to include in what will be committed)
#
#       app/controllers/posts_controller.rb
#       app/helpers/posts_helper.rb
#       app/views/
#       db/
#       public/stylesheets/
#       test/fixtures/
#       test/functional/
#       test/unit/
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora eu tenho um novo grupo de arquivos:</p>
<ul>
  <li>Changes to be committed – estes são arquivos modificados, que eu manualmente indiquei que serão inclusos no próximo commit, ou seja, eles estão numa região chamada “index”. Somente arquivos marcados no “index” entram no commit. Por exemplo:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>$ git commit -m "teste"
[master bd69909] teste
 2 files changed, 4 insertions(+), 0 deletions(-)
 create mode 100644 app/models/post.rb
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notem que eu não precisei usar a opção “-a”. Na verdade, eu recomendaria não usar essa opção a menos que você saiba exatamente o que ela faz. Nesse último commit, apenas os dois arquivos que estavam no index entraram.</p>
<p>Como exemplo, digamos que esse último commit foi um engano, justamente porque “esquecemos” de adicionar os outros arquivos que estavam como “Untracked files”. Podemos desfazer um commit, sem perder as modificações que ela carrega fazendo isto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git reset --soft HEAD~1
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note a opção “—soft”, ela está indicando para desfazer o commit anterior (<span class="caps">HEAD</span>~1) mas sem perder seu conteúdo. Veja:</p>
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
</pre>
      </td>
      <td class="code"><pre>(master) $ git status
# On branch master
# Changes to be committed:
#   (use "git reset HEAD &lt;file&gt;..." to unstage)
#
#       new file:   app/models/post.rb
#       modified:   config/routes.rb
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, como adicionar os “Untracked files”? Uma forma que eu acabo fazendo é simplesmente copiando os paths indicados para um editor de texto, adicionar ‘git add’ e simplesmente colar os comandos no terminal. Outra forma é adicionar arquivo a arquivo de forma interativa, assim:</p>
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
</pre>
      </td>
      <td class="code"><pre>$ git add -i
           staged     unstaged path
  1:        +2/-0      nothing app/models/post.rb
  2:        +2/-0      nothing config/routes.rb
*** Commands ***
  1: [s]tatus     2: [u]pdate     3: [r]evert     4: [a]dd untracked
  5: [p]atch      6: [d]iff       7: [q]uit       8: [h]elp
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ele nos dá um menu de comandos. Você pode usar a opção “4” para adicionar os novos arquivos. Ele nos levará à seguinte tela:</p>
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
      <td class="code"><pre>What now&gt; 4
  1: app/controllers/posts_controller.rb
  2: app/helpers/posts_helper.rb
  3: app/views/layouts/posts.html.erb
  4: app/views/posts/edit.html.erb
  5: app/views/posts/index.html.erb
  6: app/views/posts/new.html.erb
  7: app/views/posts/show.html.erb
  8: db/migrate/20090705175333_create_posts.rb
  9: public/stylesheets/scaffold.css
 10: test/fixtures/posts.yml
 11: test/functional/posts_controller_test.rb
 12: test/unit/helpers/posts_helper_test.rb
 13: test/unit/post_test.rb
Add untracked&gt;&gt;
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora você pode digitar o número do arquivo que quer adicionar e pressionar ‘enter’. Por exemplo, para adicionar o arquivo ‘test/unit/post_test.rb’ apenas digite ‘13[enter]’. Para adicionar vários de uma só vez, você pode usar um ‘range’ ou seja, se digitar “1-13” ele adicionará do arquivo 1 ao 13. Arquivos adicionados ficam marcados com “*” do lado.</p>
<p>Isso terminado, digite apenas ‘enter’ para retornar ao menu anterior e digite ‘q’ para sair do modo interativo. Agora, com os arquivos novos adicionados, temos isto:</p>
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
</pre>
      </td>
      <td class="code"><pre>$ git status
# On branch master
# Changes to be committed:
#   (use "git reset HEAD &lt;file&gt;..." to unstage)
#
#       new file:   app/controllers/posts_controller.rb
#       new file:   app/helpers/posts_helper.rb
#       new file:   app/models/post.rb
#       new file:   app/views/layouts/posts.html.erb
#       new file:   app/views/posts/edit.html.erb
#       new file:   app/views/posts/index.html.erb
#       new file:   app/views/posts/new.html.erb
#       new file:   app/views/posts/show.html.erb
#       modified:   config/routes.rb
#       new file:   db/migrate/20090705175333_create_posts.rb
#       new file:   public/stylesheets/scaffold.css
#       new file:   test/fixtures/posts.yml
#       new file:   test/functional/posts_controller_test.rb
#       new file:   test/unit/helpers/posts_helper_test.rb
#       new file:   test/unit/post_test.rb
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pronto, agora todos os arquivos que queremos estão no “index”, marcados como “Changes to be committed”. A descrição é bastante explicativa: arquivos marcados como “new file” são os arquivos novos que adicionamos, e os “modified” são aqueles que já estavam no repositório e colocamos no index. Basta fazer o commit agora:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git commit -m "adicionando scaffold de Post"
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Revertendo commits</h3>
<p>No <a href="/2008/4/3/micro-tutorial-de-git">Micro Tutorial de Git</a> expliquei sobre repositórios locais e remotos. Neste exemplo estamos apenas no repositório local. Se tivéssemos um remoto usaríamos ‘git remote’ para adicioná-lo e usaríamos os comandos ‘git push’ para enviar os commits locais para o repositório e ‘git pull’ para trazer os commits do repositório remoto para o local.</p>
<p>A regra básica é a seguinte:</p>
<blockquote>Commits que você já enviou ao repositório remoto, ou commits que recebeu de lá, nunca devem ser modificados.</blockquote>
<p>Ou seja, não use comandos como ‘git reset —hard <span class="caps">HEAD</span>~1’ para apagar um commit, ou faça ‘rebase’ em cima de um branch que já exista no lado remoto. Se precisarmos reverter o que foi feito em um commit podemos primeiro fazer:</p>
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
      <td class="code"><pre>$ git log
commit 89b53e7d0bfc4fdb4b5c389f5481dab5ddb2b83d
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 15:06:44 2009 -0300
    adicionando scaffold de Post
commit d394bee7ec01b2d90f00f20fc698364e9d943352
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 14:41:39 2009 -0300
    initial commit
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Vamos reverter o commit mais recente. Para isso tomamos nota do seu identificados SHA1 e podemos executar este comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git revert --no-edit 89b53e7d0bfc4fdb4b5c389f5481dab5ddb2b83d
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora teremos o seguinte log:</p>
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
</pre>
      </td>
      <td class="code"><pre>$ git log
commit 15bb972393f7794892dbf5d6a3097c533a68fbea
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 15:13:03 2009 -0300
    Revert "adicionando scaffold de Post"
    This reverts commit 89b53e7d0bfc4fdb4b5c389f5481dab5ddb2b83d.
commit 89b53e7d0bfc4fdb4b5c389f5481dab5ddb2b83d
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 15:06:44 2009 -0300
    adicionando scaffold de Post
commit d394bee7ec01b2d90f00f20fc698364e9d943352
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 14:41:39 2009 -0300
    initial commit
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Entendeu? Isso criou um novo commit com a reversão do que fizemos antes. Por exemplo, se no commit original nós criamos um arquivo, neste novo commit esse arquivo será deletado, e assim por diante. Essa é a forma correta de reverter modificações que já estão no repositório local. Mas se você quiser reverter commits locais que ainda não enviou ao servidor, o ‘git reset —soft’ é uma das opções.</p>
<h3>Forçando modificações remotas</h3>
<p>Dissemos que commits remotos não devem ser modificados. Porém, digamos que você está numa situação onde precisa reorganizar seus commits. Existem algumas razões excepcionais, você saberá quando cair nelas :-) Estou sem um bom exemplo. Mas digamos que você precisou destruir ou reescrever commits e precisa modificar isso no servidor.</p>
<p>Antes de mais nada, considere o cenário de um repositório remoto controlado, onde você conhece todas as pessoas da equipe envolvidas nela. Ou seja, não é um projeto open source no Github. Nesse caso faça as modificações locais que precisa e no final faça isto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git push --force
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A opção “—force” irá reescrever os commits no repositório remoto para refletir o que você fez localmente. Agora o truque: avise todos os membros da sua equipe para baixar as modificações da seguinte forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git pull --rebase
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isto irá reescrever o histórico local de cada um dos membros da equipe. Não é uma operação que você quer fazer o tempo todo, por isso faça somente quando realmente precisar, simule isso em repositórios de teste para se sentir confortável antes de fazer isso no repositório do seu projeto, garanta que seus backups estão em dia. Reescrever o histórico no Git não é problemático, fazer sem saber o que está fazendo, é.</p>
<h3>Undelete</h3>
<p>Depois de tanto manipular commits, digamos que você tenha feito alguma besteira. Vamos simular uma “besteira”, digamos que você tenha apagado um commit que não queria, por exemplo:</p>
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
      <td class="code"><pre> $ git log
commit 15bb972393f7794892dbf5d6a3097c533a68fbea
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 15:13:03 2009 -0300
    Revert "adicionando scaffold de Post"
    This reverts commit 89b53e7d0bfc4fdb4b5c389f5481dab5ddb2b83d.
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para apagar “por engano” este commit mais recente, digamos que você “acidentalmente” tenha feito:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git reset --hard HEAD~1
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora seu log ficará assim:</p>
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
      <td class="code"><pre>$ git log
commit 89b53e7d0bfc4fdb4b5c389f5481dab5ddb2b83d
Author: AkitaOnRails &lt;fabioakita@gmail.com&gt;
Date:   Sun Jul 5 15:06:44 2009 -0300
    adicionando scaffold de Post
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pronto, besteira feita, e agora? Faça de conta que esse commit representa todo o trabalho que você fez durante o dia todo. Será que agora você terá que fazer tudo de novo? Claro que não, o Git prevê esse tipo de coisa. Para começar, o ideal é que você tente recuperar um erro imediatamente quando o fez, não deixe para depois. Agora faça assim:</p>
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
</pre>
      </td>
      <td class="code"><pre>$ git reflog
89b53e7 HEAD@{0}: HEAD~1: updating HEAD
15bb972 HEAD@{1}: commit: Revert "adicionando scaffold de Post"
89b53e7 HEAD@{2}: HEAD~1: updating HEAD
4a41f10 HEAD@{3}: commit: Revert "adicionando scaffold de Post"
89b53e7 HEAD@{4}: commit: adicionando scaffold de Post
d394bee HEAD@{5}: HEAD~1: updating HEAD
bd69909 HEAD@{6}: commit: teste
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O comando ‘git reflog’ listará os commits inacessíveis. Podemos ver na segunda linha o commit que acabamos de ‘apagar’. Para recuperá-lo, faça o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git merge 15bb972
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pronto, isso trás o commit perdido de volta ao histórico oficial e será como se nada tivesse acontecido. Qualquer coisa que já está no repositório pode ser recuperado, porém se você apagou algum novo arquivo que ainda não estava no commit daí não há o que fazer. Por isso mesmo sempre recomendamos que se faça commits o tempo todo.</p>
<h3>Branches no passado</h3>
<p>Toda vez que queremos um novo branch usamos o seguinte comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git checkout -b novo_branch
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso indica que criaremos o ‘novo_branch’ tendo como pai o branch onde estamos neste momento. Porém, digamos que queremos criar um branch a partir de um commit no passado. Podemos fazer desta forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git checkout -b novo_branch d394bee7ec01b2d90f00f20fc698364e9d943352
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Use o comando ‘git log’ para identificar o SHA1 do commit que quer. Visualmente ficaremos com o seguinte:</p>
<p><img src="https://s3.amazonaws.com/akitaonrails/assets/2009/7/5/Picture_2_original.png" srcset="https://s3.amazonaws.com/akitaonrails/assets/2009/7/5/Picture_2_original.png 2x" alt=""></p>
<h3>Quem mexeu no meu Queixo?</h3>
<p>Às vezes queremos saber quem mexeu em determinado trecho de um arquivo, às vezes porque faltou algum comentário e queremos perguntar a quem fez a modificação para saber se podemos mexer, refatorar ou coisa parecida.</p>
<p>Isso é simples, use o seguinte comando:</p>
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
      <td class="code"><pre>$ git blame base.rb 
...
^db045db (David Heinemeier ... 2004-11-24 ... 15) module ActiveRecord #:nodoc:
98dc5827 (Pratik Naik      ... 2008-05-25 ... 16)   # Generic Active Record ex
73673256 (Jeremy Kemper    ... 2007-12-10 ... 17)   class ActiveRecordError &lt; 
^db045db (David Heinemeier ... 2004-11-24 ... 18)   end                       
73673256 (Jeremy Kemper    ... 2007-12-10 ... 19)                             
0432d151 (Pratik Naik      ... 2008-07-16 ... 20)   # Raised when the single-t 
73673256 (Jeremy Kemper    ... 2007-12-10 ... 21)   # (for example due to impr 
605bc775 (David Heinemeier ... 2004-12-14 ... 22)   class SubclassNotFound &lt; A
605bc775 (David Heinemeier ... 2004-12-14 ... 23)   end
...
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(O trecho acima está encurtado)</p>
<p>Com isso podemos saber quem mexeu em cada linha, quando mexeu e em que commit está essa modificação. Assim podemos inclusive rastrear o commit que contém a modificação.</p>
<h3>Reescrevendo a última mensagem de commit</h3>
<p>Quantas vezes não fazemos um commit e nos damos conta que escrevemos a mensagem de commit com algum erro ortográfico, ou mesmo esquecemos de detalhar alguma coisa importante? Mas o Git nos ajuda nisso também. Em vez de desfazer o commit e refazê-lo, podemos usar este comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git commit --amend
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso abrirá seu editor padrão (ex. Vim) e lhe dará a oportunidade de editar a mensagem de commit.</p>
<h3>Obtendo mais ajuda</h3>
<p>Não se esqueça, para conhecer alguns dos principais comandos do Git use este comando:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git --help
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para obter detalhes e instruções sobre como usar cada comando, faça assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>git help commit
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vale para todos os comandos. É a melhor forma de explorar e aprender a usar os comandos.</p>
<h3>Aprendendo mais</h3>
<p>Por hoje acho que isso já é suficiente. Continue sempre explorando mais e mais as possibilidades do Git. Acompanhe o trabalho do Scott Chacon, do Github, para saber mais. Outro site interessante é o <a href="https://book.git-scm.com/">Git Community Book</a> com mais documentação. Se quiser um livro impresso, recomendo o <a href="https://www.amazon.com/Pro-Git-Scott-Chacon/dp/1430218339">Pro Git</a>.</p>
<p>E, finalmente, não deixe de ajudar a tradução do site <a href="https://pt-br.gitready.com/">GitReady</a> para português seguindo as instruções no post do <a href="https://www.tailorfontela.com.br/2009/03/07/gitready/">Tailor Fontela</a>. Esse site tem mais dicas importantes para sua rotina com Git.</p>
<p></p>
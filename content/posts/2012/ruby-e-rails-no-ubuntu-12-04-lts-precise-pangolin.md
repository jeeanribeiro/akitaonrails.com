---
title: "Ruby e Rails no Ubuntu 12.04 LTS Precise Pangolin"
date: "2012-08-14T00:28:00.000Z"
tags: ["linux", "tutorial"]
years: "2012"
---

<p></p>
<p><strong>Atualização 27/01/2015:</strong> Fiz um novo artigo com o Ubuntu 14.04 LTS. Prossiga para o <a href="http://www.akitaonrails.com/2015/01/28/ruby-e-rails-no-ubuntu-14-04-lts-trusty-tahr">novo artigo aqui</a>.</p>
<p>Um ano atrás eu gravei um screencast sobre <a href="http://akitaonrails.com/2010/07/12/screencast-instalando-um-ambiente-ruby">Instalando um Ambiente Ruby</a> onde mostro como instalar e configurar um ambiente em Linux/Ubuntu, Mac e Windows 7.</p>
<p>Por curiosidade, resolvi dar uma olhada no Ubuntu mais recente o 12.04 LTS Precise Pangolin. Já explorei sobre <a href="http://akitaonrails.com/2012/07/06/mudando-de-rvm-para-rbenv">Rbenv</a> recentemente mas continuo preferindo usar RVM. A partir de um Ubuntu 12.04 recém-instalado entre no site do <a href="http://rvm.io">RVM</a> e siga as instruções, como vou mostrar neste artigo.</p>
<p></p>
<p></p>
<p>Para VPS pequenos, eu particularmente não me incomodo de usar RVM em single-user mode com Nginx+Passenger. Para instalar faça o seguinte no terminal:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install curl
curl -L https://get.rvm.io | bash -s stable
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Em single-user mode, o RVM será instalado na pasta <tt>~/.rvm</tt>, para carregar o ambiente, execute a seguir:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>source ~/.rvm/scripts/rvm
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para que o RVM sempre carregue ao iniciar o Terminal (com Bash), adicione a seguinte linha no final do seu <tt>~/.bash_profile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>[[ -s $HOME/.rvm/scripts/rvm ]] &amp;&amp; source $HOME/.rvm/scripts/rvm
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O próximo passo é instalar pacotes que o RVM precisa para instalar novos Rubies. Lembre-se que existe o seguinte comando que lhe dirá o que fazer:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rvm requirements
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como estamos interessados no Ruby MRI mais recente, basta copiar a linha com o <tt>apt-get</tt> e executar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install build-essential openssl libreadline6 libreadline6-dev curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt-dev autoconf libc6-dev ncurses-dev automake libtool bison subversion
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso já é suficiente para instalar o Ruby, para ver a lista de Rubies disponiveis basta executar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rvm list known
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sabendo o nome exato com a versão que queremos, podemos executar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rvm install ruby-1.9.3-p194
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E terminada a instalação podemos definir que este seja o Ruby padrão:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>rvm 1.9.3-p194 --default
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso já é suficiente para instalarmos o Rails mais recente e iniciar a programar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem install rails
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Pacotes Importantes</h2>
<p>O que acabamos de instalar é o básico. Mas uma aplicação de verdade precisa de um pouco mais como bancos de dados e outros componentes. A maioria das aplicações Rails utilizar PostgreSQL, MySQL, MongoDB ou Redis (ou uma combinação de alguns deles). Além disso é recomendado aprender a utilizar Memcache.</p>
<p>Lembrando que precisamos instalar tanto os pacotes binários quanto os códigos-fonte/headers para as Rubygems conseguirem compilar suas extensões nativas. Vou dividir as instruções dos diferentes serviços que você pode querer e as Rubygems que as utilizam, ou seja, apesar dos comandos <tt>apt-get install</tt> e <tt>gem install</tt> estarem agrupadas, não significa que você precisa executá-las dessa forma.</p>
<p>Para instalar o MySQL faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install mysql-server mysql-client libmysqlclient-dev
gem install mysql2
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não deixe de configurar o locale do seu sistema para UTF-8. Inicie adicionando as seguintes linhas ao seu <tt>/etc/bash.bashrc</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>    export LANGUAGE=en_US.UTF-8
    export LANG=en_US.UTF-8
    export LC_ALL=en_US.UTF-8
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Então execute os seguintes comandos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo locale-gen en_US.UTF-8
sudo dpkg-reconfigure locales
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Execute os passos anteriores antes de instalar. O Ubuntu 12.04 vem por padrão para instalar o Postgresql 9.1 mas para usar funcionalidades mais novas como HSTORE, você vai querer instalar a versão 9.3. Para isso comece assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>wget -O - https://apt.postgresql.org/pub/repos/apt/ACCC4CF8.asc | sudo apt-key add -
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Edite o arquivo de sources com <tt>sudo vim /etc/apt/sources.list</tt> e adicione na última linha:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>deb https://apt.postgresql.org/pub/repos/apt/ precise-pgdg main
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Crie o arquivo PGDG com <tt>sudo vim /etc/apt/preferences/pgdg.pref</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>Package: *
Pin: release o=apt.postgresql.org
Pin-Priority: 500
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora atualize o apt:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get update
sudo apt-get install pgdg-keyring
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remova qualquer Postgres mais antigo que tenha instalado:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get remove --purge postgresql-9.2 postgresql-9.1 postgresql-contrib
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E finalmente podemos instalar o Postgres:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install postgresql postgresql-contrib
gem install pg
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como estamos falando de uma máquina de desenvolvimento, vamos criar um superuser:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo su postgres
createuser -P -s -e vagrant
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você deve editar o arquivo pg_hba.conf com <tt>sudo vim /etc/postgresql/9.3/main/pg_hba.conf</tt> e faça o final dele estar assim:</p>
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
</pre>
      </td>
      <td class="code"><pre># Database administrative login by Unix domain socket
local   all             postgres                                trust
# TYPE  DATABASE        USER            ADDRESS                 METHOD
# "local" is for Unix domain socket connections only
local   all             all                                     trust
# IPv4 local connections:
host    all             all             127.0.0.1/32            trust
# IPv6 local connections:
host    all             all             ::1/128                 trust
# Allow replication connections from localhost, by a user with the
# replication privilege.
#local   replication     postgres                                peer
#host    replication     postgres        127.0.0.1/32            md5
#host    replication     postgres        ::1/128                 md5
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Pode ser que você precise ainda alterar o Template1 do postgresql assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo su postgresql
psql
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora dentro do Postgresql execute os seguinte comandos:</p>
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
      <td class="code"><pre>update pg_database set datistemplate=false where datname='template1';
drop database Template1;
create database template1 with owner=postgres encoding='UTF-8'
  lc_collate='en_US.utf8' lc_ctype='en_US.utf8' template template0;
update pg_database set datistemplate=true where datname='template1';
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para instalar o MongoDB faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install mongodb mongodb-dev
gem install mongo
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para instalar o Redis faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install redis-server libhiredis-dev
gem install hiredis
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para instalar o Memcache faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install memcached libmemcached-dev
gem install dalli
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para instalar o Imagemagick faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install imagemagick libmagickwand-dev
gem install rmagick mini_magick
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Instalando Vim</h2>
<p>E um bom ambiente não estaria completo sem um bom editor de textos para começar a trabalhar. Existem muitas opções como o Sublime Text 2, mas minha preferência pessoal ainda é o Vim. Para quem nunca usou Vim, não deixe de assistir meu screencast <a href="https://akitaonrails.com/2010/07/19/screencast-comecando-com-vim">Começando com Vim</a>. Para instalar neste novo Ubuntu é muito simples:</p>
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
      <td class="code"><pre>sudo apt-get install vim vim-gnome exuberant-ctags ncurses-term ack
cd ~
git clone git://github.com/akitaonrails/vimfiles.git .vim
cd .vim
git submodule update --init
echo "filetype on" &gt; ~/.vimrc
echo "source ~/.vim/vimrc" &gt;&gt; ~/.vimrc
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso deve instalar todos os submódulos para tornar seu Vim um editor bastante avançado. Assista ao screencast para aprender mais e visite a página do projeto no Github. Muitas coisas mudaram desde que gravei o screencast, por exemplo, em vez do módulo Command-T agora uso o módulo Ctrl-P, dentre outras mudanças.</p>
<p>Se no meio da execução do comando <tt>git submodule</tt> ele parar por alguma razão, sem terminar, não tem problema apenas reexecute o mesmo comando. A partir do terminal, no diretório do seu projeto, execute <tt>gvim</tt> para iniciar o Vim integrado ao ambiente gráfico Gnome (há quem prefira usar dentro do Terminal, mas isso seria mais preferência pessoal mesmo).</p>
<h2>Finalização do Ambiente</h2>
<p>Se ainda não instalou, existem mais algumas ferramentas que você vai precisar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install git git-svn gitk ssh libssh-dev
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, se não sabe usar Git, assista meu screencast <a href="https://akitaonrails.com/2010/08/17/screencast-comecando-com-git">Começando com Git</a> pois é absolutamente obrigatório conhecer Git para programar no ecossistema Ruby e Rails. E para finalizar sua instalação, eu pessoalmente gosto de customizar meu <tt>~/.bashrc</tt> com o seguinte:</p>
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
<a href="#n24" name="n24">24</a>
<a href="#n25" name="n25">25</a>
<a href="#n26" name="n26">26</a>
<a href="#n27" name="n27">27</a>
<a href="#n28" name="n28">28</a>
<a href="#n29" name="n29">29</a>
<strong><a href="#n30" name="n30">30</a></strong>
</pre>
      </td>
      <td class="code"><pre>...
[[ -s $HOME/.rvm/scripts/rvm ]] &amp;&amp; source $HOME/.rvm/scripts/rvm
ESC="\033" # This is the escape sequence
NO_COLOR="$ESC[0m"
IRED="$ESC[1;31m" # ANSI color code for intense/bold red
IGRN="$ESC[1;32m" # ANSI color code for intense/bold green
# From https://railstips.org/blog/archives/2009/02/02/bedazzle-your-bash-prompt-with-git-info/
# I had to change 'git-symbolic-ref' to 'git symbolic-ref'
function parse_git_branch {
  ref=$(git symbolic-ref HEAD 2&gt; /dev/null) || return
  echo " ["${ref#refs/heads/}"]" # I wanted my branch wrapped in [], use () or &lt;&gt; or whatever
}
# from https://ariejan.net/2010/04/25/ruby-version-and-gemset-in-your-bash-prompt-yes-sir
function rvm_version {
  local gemset=$(echo $GEM_HOME | awk -F'@' '{print $2}')
  [ "$gemset" != "" ] &amp;&amp; gemset="@$gemset"
  local version=$(echo $MY_RUBY_HOME | awk -F'-' '{print $2}')
  [ "$version" != "" ] &amp;&amp; version="$version"
  local full="$version$gemset"
  [ "$full" != "" ] &amp;&amp; echo "${full}:" # the colon at the end is a delimiter, you could use a space instead
}
#PS1="\h:\W \u\$" # For reference, here's the default OS X prompt
#export PS1="\$(rvm_version)\W \$(parse_git_branch)\$ " # Without the colors
# I had to put the \[ and \] down here, as opposed to $IRED, to avoid wrapping funkiness.
export PS1="\[$IRED\]\$(rvm_version)\[$NO_COLOR\]\W\[$IGRN\]\$(parse_git_branch)\[$NO_COLOR\]\n \$ "
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Instalando Phusion Passenger</h2>
<p>Com tudo instalado, podemos instalar o último componente: NGINX + Passenger:</p>
<p>Para instalar o Passenger com Nginx faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>sudo apt-get install libcurl4-openssl-dev
gem install passenger
sudo chown -R `whoami` /opt
passenger-install-nginx-module --auto-download --auto
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quando ele terminar de instalar, você lembre-se que no arquivo <tt>/opt/nginx/conf/nginx.conf</tt> haverá o seguinte:</p>
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
      <td class="code"><pre>http {
    ...
    passenger_root /home/akitaonrails/.rvm/gems/ruby-2.0.0-p245/gems/passenger-4.0.17;
    passenger_ruby /home/akitaonrails/.rvm/wrappers/ruby-2.0.0-p245/ruby;
    ...
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sempre que atualizar o passenger, atualize este trecho com a versão mais recente. Além disso, para configurar novas aplicações Rails, no mesmo arquivo configure da seguinte forma:</p>
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
      <td class="code"><pre>server {
   listen 80;
   server_name www.yourhost.com;
   root /somewhere/public;   # &lt;--- be sure to point to 'public'!
   passenger_enabled on;
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Onde <tt>/somewhere</tt> é onde está o código da aplicação Rails, sempre completando com <tt>/public</tt> para o Passenger saber o que fazer.</p>
<p>Na instalação eu trapeceei um pouco: como instalei o RVM em single-mode não dá para instalar o nginx usando o script do Passenger via <tt>sudo</tt>. Por isso mudei o dono do diretório <tt>/opt</tt>. Precisamos mudar de volta:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>sudo chown -R root /opt
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora queremos que o NGINX inicie automaticamente sempre que o servidor reiniciar, para isso podemos usar da ajuda do script de inicialização feito pelo Linode:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>wget -O init-deb.sh https://library.linode.com/assets/660-init-deb.sh
sudo mv init-deb.sh /etc/init.d/nginx
sudo chmod +x /etc/init.d/nginx
sudo /usr/sbin/update-rc.d -f nginx defaults
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>obs: dica retirada <a href="https://excid3.com/blog/setting-up-ubuntu-12-04-with-ruby-1-9-3-nginx-passenger-and-postgresql-or-mysql/">deste blog post</a></p>
<p>Inicie ou pare o NGINX como qualquer outro serviço no Ubuntu:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre>sudo service nginx start
sudo service nginx stop
sudo service nginx restart
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ambiente configurado, bom aprendizado!</p>
<p></p>
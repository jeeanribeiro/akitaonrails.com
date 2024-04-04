---
title: "Ruby e Rails no Ubuntu 14.04 LTS Trusty Tahr"
date: "2015-01-28T19:04:00.000Z"
tags: ["rails", "linux"]
years: "2015"
---

<p></p>
<p>Quase 2 anos atrás fiz um artigo que teve muitos leitores sobre <a href="http://www.akitaonrails.com/2012/08/13/ruby-e-rails-no-ubuntu-12-04-lts-precise-pangolin">instalar Ruby no Ubuntu 12.04 LTS</a>. Inclusive era o que eu estava usando até agora como ambiente de desenvolvimento no Vagrant. O bom é que dá pra desenvolver tudo sem problema algum nesse ambiente e é bem estável, mas resolvi atualizar o mesmo artigo para instalar no último Long Term Support do Ubuntu, o <a href="http://releases.ubuntu.com/14.04/">14.04 LTS Trusty Tahr</a>.</p>
<p>Para VPS pequenos, eu particularmente não me incomodo de usar RVM em single-user mode com Nginx+Passenger. Em particular eu instalo esse ambiente num Vagrant, então se for esse o caso, depois de <a href="https://www.vagrantup.com/downloads.html">instalar o Vagrant</a>, faça assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">vagrant init phusion/ubuntu-14.04-amd64<tt>
</tt>vagrant up<tt>
</tt>vagrant ssh<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>Isso deve instalar o Ubuntu 14.04. Veja a documentação para configurar o que você precisa. Em particular, no meu caso, antes de dar <tt>vagrant up</tt> eu edito o <tt>Vagrantfile</tt> pra ter o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># -*- mode: ruby -*-</span><tt>
</tt><span style="color:#888"># vi: set ft=ruby :</span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Vagrant</span>.configure(<span style="color:#00D;font-weight:bold">2</span>) <span style="color:#080;font-weight:bold">do</span> |config|<tt>
</tt>  config.vm.box = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">phusion/ubuntu-14.04-amd64</span><span style="color:#710">"</span></span><tt>
</tt>  config.vm.synced_folder <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/vagrant</span><span style="color:#710">"</span></span>, <span style="color:#A60">:nfs</span> =&gt; <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">80</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">8080</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">3000</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">3000</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">3001</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">3001</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">3790</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">3790</span><tt>
</tt>  config.vm.network <span style="color:#A60">:private_network</span>, <span style="color:#808">ip</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">10.0.0.100</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt>  config.vm.provider <span style="color:#A60">:vmware_fusion</span> <span style="color:#080;font-weight:bold">do</span> |v|<tt>
</tt>    v.vmx[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">memsize</span><span style="color:#710">"</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1024</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Eu uso o <a href="https://www.vagrantup.com/vmware">plugin de VMWare Fusion</a> (que é ordens de grandeza mais estável e performático que o Virtualbox). Mas qualquer um funciona bem o suficiente pra desenvolver.</p>
<p>Depois de fazer <tt>vagrant ssh</tt> você vai estar dentro do Ubuntu já e a partir daí siga o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install curl build-essential openssl libreadline6 libreadline6-dev curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt-dev libgmp-dev autoconf libc6-dev ncurses-dev automake libtool bison subversion<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>São os pacotes básicos que você sempre vai precisar. Feito isso, eu gosto de instalar o RVM mesmo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl -L https://get.rvm.io | bash -s stable<tt>
</tt>source ~/.rvm/scripts/rvm<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O próximo passo é instalar pacotes que o RVM precisa para instalar novos Rubies. O próprio RVM toma conta disso fazendo o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rvm requirements<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso já é suficiente para instalar o Ruby, para ver a lista de Rubies disponiveis basta executar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rvm list known # para ver todos os rubies disponíveis<tt>
</tt>rvm install 2.2.0 # para instalar o mais recente até a data deste artigo<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso já é suficiente para instalarmos o Rails mais recente e iniciar a programar:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gem install rails<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Não deixe de configurar o locale do seu sistema para UTF-8. Inicie adicionando as seguintes linhas ao seu <tt>/etc/bash.bashrc</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">export LANGUAGE=en_US.UTF-8<tt>
</tt>export LANG=en_US.UTF-8<tt>
</tt>export LC_ALL=en_US.UTF-8<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Então execute os seguintes comandos:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo locale-gen en_US.UTF-8<tt>
</tt>sudo dpkg-reconfigure locales<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Serviços Básicos Importantes</h2>
<p>O que acabamos de instalar é o básico. Mas uma aplicação de verdade precisa de um pouco mais como bancos de dados e outros componentes. A maioria das aplicações Rails utilizar PostgreSQL, MySQL ou Redis (ou uma combinação de alguns deles). Além disso é recomendado aprender a utilizar Memcache.</p>
<p>Lembrando que precisamos instalar tanto os pacotes binários quanto os códigos-fonte/headers para as Rubygems conseguirem compilar suas extensões nativas.</p>
<p>Para começar, o melhor banco de dados relacional que você precisa instalar é o PostgreSQL:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install postgresql postgresql-contrib postgresql-server-dev-9.3<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Como estamos falando de uma máquina de desenvolvimento, vamos criar um superuser:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo su postgres<tt>
</tt>createuser -P -s -e vagrant<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você deve editar o arquivo pg_hba.conf com <tt>sudo vim /etc/postgresql/9.3/main/pg_hba.conf</tt> e faça o final dele estar assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># Database administrative login by Unix domain socket<tt>
</tt>local   all             postgres                                trust<tt>
</tt><tt>
</tt># TYPE  DATABASE        USER            ADDRESS                 METHOD<tt>
</tt><tt>
</tt># "local" is for Unix domain socket connections only<tt>
</tt>local   all             all                                     trust<tt>
</tt># IPv4 local connections:<tt>
</tt>host    all             all             127.0.0.1/32            trust<tt>
</tt># IPv6 local connections:<tt>
</tt>host    all             all             ::1/128                 trust<tt>
</tt># Allow replication connections from localhost, by a user with the<tt>
</tt># replication privilege.<tt>
</tt>#local   replication     postgres                                peer<tt>
</tt>#host    replication     postgres        127.0.0.1/32            md5<tt>
</tt>#host    replication     postgres        ::1/128                 md5<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se vai desenvolver Rails eventualmente você vai precisar do Sidekiq ou Resque, e eles precisam do banco de dados Redis, então instale assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install redis-server libhiredis-dev<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você pode tirar muita vantagem de um bom cache em suas aplicações, então já deixe o Memcache preparado assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install memcached libmemcached-dev<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Muitas aplicações precisam manipular imagens, e para isso você vai precisar do Imagemagick, então instale assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install imagemagick libmagickwand-dev<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Instalando Vim</h2>
<p>E um bom ambiente não estaria completo sem um bom editor de textos para começar a trabalhar. Existem muitas opções como o Sublime Text 2, mas minha preferência pessoal ainda é o Vim. Para quem nunca usou Vim, não deixe de assistir meu screencast <a href="https://akitaonrails.com/2010/07/19/screencast-comecando-com-vim">Começando com Vim</a> e para a discussão sobre qual melhor editor para você, não deixe de ler meu artigo <a href="https://www.akitaonrails.com/2014/07/31/small-bites-ides-e-editores-como-escolher">IDEs e Editores, como escolher?</a>. Para instalar neste novo Ubuntu é muito simples:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install zsh vim vim-gnome exuberant-ctags ncurses-term ack-grep<tt>
</tt>sudo dpkg-divert --local --divert /usr/bin/ack --rename --add /usr/bin/ack-grep<tt>
</tt><tt>
</tt>sh -c "`curl -fsSL https://raw.githubusercontent.com/skwp/dotfiles/master/install.sh`"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vai instalar o excelente conjunto de dotfiles que configura ZSH e Vim pra ficarem perfeitos, o <a href="https://github.com/skwp/dotfiles">YADR</a>. Pode ser que o ZSH não tenha sido instalado então para garantir faça o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">chsh -s $(which zsh)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Toda vez que quiser atualizar o YADR, faça assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cd ~/.yadr<tt>
</tt>git pull --rebase<tt>
</tt>rake update<tt>
</tt></pre>
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
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install git git-svn gitk ssh libssh-dev<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Novamente, se não sabe usar Git, assista meu screencast <a href="https://akitaonrails.com/2010/08/17/screencast-comecando-com-git">Começando com Git</a> pois é absolutamente obrigatório conhecer Git para programar no ecossistema Ruby e Rails.</p>
<h2>Instalando Phusion Passenger</h2>
<p>Com tudo instalado, podemos instalar o último componente: NGINX + Passenger:</p>
<p>Para instalar o Passenger com Nginx faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install libcurl4-openssl-dev<tt>
</tt>gem install passenger<tt>
</tt>sudo chown -R `whoami` /opt<tt>
</tt>passenger-install-nginx-module --auto-download --auto<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quando ele terminar de instalar, você lembre-se que no arquivo <tt>/opt/nginx/conf/nginx.conf</tt> haverá o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">http {<tt>
</tt>    ...<tt>
</tt>    passenger_root /home/akitaonrails/.rvm/gems/ruby-2.2.0/gems/passenger-4.0.58;<tt>
</tt>    passenger_ruby /home/akitaonrails/.rvm/wrappers/ruby-2.2.2.0/ruby;<tt>
</tt>    ...<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sempre que atualizar o passenger, atualize este trecho com a versão mais recente. Além disso, para configurar novas aplicações Rails, no mesmo arquivo configure da seguinte forma:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">server {<tt>
</tt>   listen 80;<tt>
</tt>   server_name www.yourhost.com;<tt>
</tt>   root /somewhere/public;   # &lt;--- be sure to point to 'public'!<tt>
</tt>   passenger_enabled on;<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Onde <tt>/somewhere</tt> é onde está o código da aplicação Rails, sempre completando com <tt>/public</tt> para o Passenger saber o que fazer.</p>
<p>Na instalação eu trapeceei um pouco: como instalei o RVM em single-mode não dá para instalar o nginx usando o script do Passenger via <tt>sudo</tt>. Por isso mudei o dono do diretório <tt>/opt</tt>. Precisamos mudar de volta:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo chown -R root /opt<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora queremos que o NGINX inicie automaticamente sempre que o servidor reiniciar, para isso podemos usar da ajuda do script de inicialização feito pelo Linode:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">wget -O init-deb.sh https://library.linode.com/assets/660-init-deb.sh<tt>
</tt>sudo mv init-deb.sh /etc/init.d/nginx<tt>
</tt>sudo chmod +x /etc/init.d/nginx<tt>
</tt>sudo /usr/sbin/update-rc.d -f nginx defaults<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>obs: dica retirada <a href="https://excid3.com/blog/setting-up-ubuntu-12-04-with-ruby-1-9-3-nginx-passenger-and-postgresql-or-mysql/">deste blog post</a></p>
<p>Inicie ou pare o NGINX como qualquer outro serviço no Ubuntu:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo service nginx start<tt>
</tt>sudo service nginx stop<tt>
</tt>sudo service nginx restart<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ambiente configurado, bom aprendizado!</p>
<p></p>
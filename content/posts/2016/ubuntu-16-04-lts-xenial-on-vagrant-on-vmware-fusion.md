---
title: "Ubuntu 16.04 LTS Xenial on Vagrant on Vmware Fusion"
date: "2016-09-21T21:08:00.000Z"
tags: ["install", "learning", "elixir", "crystal", "clojure", "ruby on rails", "postgresql"]
years: "2016"
---

<p></p>
<p>I'm old school. I know the cool kids are all playing around with Docker nowadays, but I like to have a full blown linux environment with all dependencies in one place. I will leave volatile boxes for the cloud.</p>
<p>I like to keep a Vagrant box around, because no matter how messy an OS upgrade can go (looking at ya macOS), I know my development box will just work.</p>
<p>But even with everything virtualized and isolated, things can still go wrong. I am currently using <a href="https://www.vagrantup.com/downloads.html">Vagrant 1.8.5</a>, with the <a href="https://www.vagrantup.com/vmware/">vagrant-vmware-fusion plugin 4.0.11</a> and Vmware Fusion 8.5 on El Capitan (even though macOS Sierra just launched, I will wait at least 1 month before upgrading, there is nothing there that is worth the risk).</p>
<p></p>
<p></p>
<p>If you're installing a brand new box for the first time, this is the bare-bone <code>Vagrantfile</code> configuration I am using:</p>
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
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt>21<tt>
</tt>22<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># -*- mode: ruby -*-</span><tt>
</tt><span style="color:#888"># vi: set ft=ruby :</span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Vagrant</span>.configure(<span style="color:#00D;font-weight:bold">2</span>) <span style="color:#080;font-weight:bold">do</span> |config|<tt>
</tt>  config.vm.box = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">bento/ubuntu-16.04</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">8080</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">8080</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">3000</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">3000</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">3001</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">3001</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">4000</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">4000</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">5555</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">5555</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">5556</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">5556</span><tt>
</tt>  config.vm.network <span style="color:#A60">:forwarded_port</span>, <span style="color:#808">guest</span>: <span style="color:#00D;font-weight:bold">3808</span>, <span style="color:#808">host</span>: <span style="color:#00D;font-weight:bold">3808</span><tt>
</tt><tt>
</tt>  config.vm.network <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">private_network</span><span style="color:#710">"</span></span>, <span style="color:#808">ip</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">192.168.0.100</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt>  config.vm.synced_folder <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/Users/akitaonrails/Sites</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/vagrant</span><span style="color:#710">"</span></span>, <span style="color:#808">nfs</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>  config.vm.provider <span style="color:#A60">:vmware_fusion</span> <span style="color:#080;font-weight:bold">do</span> |v|<tt>
</tt>    v.vmx[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">memsize</span><span style="color:#710">"</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">2048</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I usually go in the Vmware settings for the virtual machine and enable an extra processor (as my Macbook has 8 virtual cores to share) and enable hypervisor (support for Intel's VT-x/EPT).</p>
<p>As a rule of thumb, the very first thing I always do is set the locale to en_US.UTF-8:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo locale-gen "en_US.UTF-8"<tt>
</tt>sudo dpkg-reconfigure locales<tt>
</tt>sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And just to make sure, add the following to <code>/etc/environment</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">LC_ALL=en_US.UTF-8<tt>
</tt>LANG=en_US.UTF-8<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You must set UTF-8 before you install packages such as Postgresql.</p>
<p>Then I upgrade packages and install the basic:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get update &amp;&amp; sudo apt-get upgrade<tt>
</tt>sudo apt-get install open-vm-tools build-essential libssl-dev exuberant-ctags ncurses-term ack-grep silversearcher-ag fontconfig imagemagick libmagickwand-dev python-software-properties redis-server libhiredis-dev memcached libmemcached-dev<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This will install important tools such as Imagemagick, Memcached and Redis for us.</p>
<p>Now, to <a href="https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04">install Postgresql</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install postgresql-9.5 postgresql-contrib postgresql-server-dev-9.5<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Create the superuser for vagrant:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo -i -u postgres<tt>
</tt>createuser --interactive<tt>
</tt><tt>
</tt>Enter name of role to add: vagrant<tt>
</tt>Shall the new role be a superuser? (y/n) y<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And <strong>only for the development environment</strong> edit <code>/etc/postgresql/9.5/main/pg_hba.conf</code> and change the following:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># "local" is for Unix domain socket connections only<tt>
</tt>local   all             all                                     trust<tt>
</tt># IPv4 local connections:<tt>
</tt>host    all             all             127.0.0.1/32            trust<tt>
</tt># IPv6 local connections:<tt>
</tt>host    all             all             ::1/128                 trust<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is to make your life easier while programming. If you did everything right until now, you will have your PG with proper unicode encoding and without bothering with password when you do <code>bin/rails db:create</code>. If you didn't configure your locale properly before, you can follow <a href="https://gist.github.com/turboladen/6790847">this gist</a> to manually set PG's locale to UTF-8.</p>
<p>Installing <a href="https://rvm.io/rvm/install">Ruby</a> is still better done through RVM:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3<tt>
</tt>\curl -sSL https://get.rvm.io | bash<tt>
</tt>source $HOME/.rvm/scripts/rvm<tt>
</tt>rvm install 2.3.1<tt>
</tt>rvm use 2.3.1 --default<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And I prefer using <a href="https://github.com/skwp/dotfiles">YADR</a> as my default dotfiles, replacing Bash for ZSH. And comparing to other dotfiles, I like this one because I usually don't have to tweak it, at all. I won't even configure anything about RVM after installing because YADR takes care of that already.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sh -c "`curl -fsSL https://raw.githubusercontent.com/skwp/dotfiles/master/install.sh `"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>To update it (or resume in case it breaks for some reason):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cd .yadr<tt>
</tt>rake update<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The only 2 tweaks I have to do is change my <a href="https://github.com/altercation/solarized/tree/master/iterm2-colors-solarized">iTerm2</a> profile to use <a href="https://ethanschoonover.com/solarized">Solarized</a>, and I have to add the following 2 lines to the top of the <code>.vimrc</code> file:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">scriptencoding utf-8<tt>
</tt>set encoding=utf-8<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Next step, <a href="https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04">install NodeJS</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -<tt>
</tt>sudo apt-get install nodejs<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Next step, <a href="https://www.digitalocean.com/community/tutorials/how-to-install-java-with-apt-get-on-ubuntu-16-04">install Java</a>. You can choose Oracle's installer, but I believe the openjdk should be enough:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install default-jdk<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We will need Java for <a href="https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-elasticsearch-on-ubuntu-16-04">Elasticsearch</a> 2.4.0:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">wget https://download.elastic.co/elasticsearch/release/org/elasticsearch/distribution/deb/elasticsearch/2.4.0/elasticsearch-2.4.0.deb &amp;&amp; sudo dpkg -i elasticsearch-2.4.0.deb<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you can start it manually with <code>sudo /etc/init.d/elasticsearch start</code>, and you want to leave it that way because it consumes a lot of RAM, so you should only start it when you really need it.</p>
<p>With Java in place, we can also install <a href="https://leiningen.org/">Leiningen</a> to have Clojure ready.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">echo "PATH=$PATH:~/bin" &gt;&gt; ~/.zsh.after/bin.zsh<tt>
</tt>mkdir ~/bin &amp;&amp; cd ~/bin<tt>
</tt>wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein<tt>
</tt>chmod a+x lein<tt>
</tt>lein<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Leiningen will install it's dependencies and you can follow its <a href="https://github.com/technomancy/leiningen/blob/stable/doc/TUTORIAL.md">tutorial</a> to get started.</p>
<p>Installing <a href="https://www.rust-lang.org/en-US/downloads.html">Rust</a> is as easy:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl -sSf https://static.rust-lang.org/rustup.sh | sh<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Installing <a href="https://crystal-lang.org/docs/installation/on_debian_and_ubuntu.html">Crystal</a>, also easy:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl https://dist.crystal-lang.org/apt/setup.sh | sudo bash<tt>
</tt>sudo apt-get install crystal<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Installing <a href="https://www.digitalocean.com/community/tutorials/how-to-install-go-1-6-on-ubuntu-16-04">Go</a> is not difficult, but more manual:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">wget https://storage.googleapis.com/golang/go1.7.1.linux-amd64.tar.gz<tt>
</tt>tar xvfz go1.7.1.linux-amd64.tar.gz<tt>
</tt>chown -R root:root .go<tt>
</tt>sudo mv go /usr/local<tt>
</tt>touch ~/.zsh.after/go.zsh<tt>
</tt>echo "export GOPATH=$HOME/go" &gt;&gt; ~/.zsh.after/go.zsh<tt>
</tt>echo "export PATH=$PATH:/usr/local/go/bin:$GOPATH/bin" &gt;&gt; ~/.zsh.after/go.zsh<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Once you install go and set it's work path, we can install some useful tools such as <a href="https://github.com/ddollar/forego">forego</a> and <a href="https://github.com/alco/goon#goon">goon</a> (that Elixir's Hex can optionally use):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">go get -u github.com/ddollar/forego<tt>
</tt>go get -u github.com/alco/goon<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And speaking of <a href="https://elixir-lang.org/install.html">Elixir</a>, we saved the best for last:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb &amp;&amp; sudo dpkg -i erlang-solutions_1.0_all.deb<tt>
</tt>sudo apt-get update<tt>
</tt>sudo apt-get install esl-erlang elixir<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is it, a very straightforward tutorial to have a modern development environment ready to go. These are the basic software development tools that I believe should be in everybody's toolbelts for the following years.</p>
<p>Honestly, I am not so much into Clojure and Go as I think I should. And I didn't give .NET Core a lot of time yet, but I will explore those in more detail in the future.</p>
<p></p>
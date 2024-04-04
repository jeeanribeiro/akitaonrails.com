---
title: "Customizing Fedora 25 for Developers"
date: "2017-01-06T19:11:00.000Z"
tags: ["fedora"]
years: "2017"
---

<p></p>
<p><strong>Update 01/18/2017:</strong> Right after trying out Fedora for a few days, I decided to <a href="http://www.akitaonrails.com/2017/01/10/arch-linux-best-distro-ever">try Arch Linux</a> and I couldn't be happier. I recommend you try Arch too, it will probably surprise you. You may be also interested about <a href="http://www.akitaonrails.com/2017/01/17/optimizing-linux-for-slow-computers">advanced Linux tuning for better responsiveness</a> on the desktop.</p>
<p>I've been a long time Ubuntu user. Whenever I need to setup a Linux box I go to straight to the latest LTS. Muscle memory, can't avoid it.</p>
<p>But to replace my macOS, Unity is damn ugly, honest. I tried to customize Cinnamon and I almost liked it, and don't even get me started on KDE or XFCE.</p>
<p><a href="https://www.gnome.org/news/2016/09/gnome-3-22-released-the-future-is-now/">GNOME 3.22</a>, on the other hand, is very handsome. I don't need to tweak it or hack it to make it look good. The default set of global shortcuts are spot on if you're a long term macOS user. I like almost everything about it.</p>
<p>I've been curious about all the fuss surrounding the phase out of X.org into Wayland so I wanted to check it out.</p>
<p>The best distro I could find with those in mind is good old Fedora. RedHat (4) was the second Linux distro I tried after Slackware 1 back in the mid-90's. I come back and leave every couple of years. It's a good time to try it again.</p>
<p>The TL;DR is that I am quite delighted with <a href="https://getfedora.org/en/workstation/download/">Fedora 25</a>. It does almost everything I need very right out of the box.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/578/big_Screenshot_from_2017-01-06_16-58-17.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/578/Screenshot_from_2017-01-06_16-58-17.png 2x" alt="Fedora 25"></p>
<p></p>
<p></p>
<p>I dusted off a 4 years old Lenovo ThinkCentre Edge 71z Tower desktop and Lenovo IdeaPad G400s notebook. They are, respectivelly, a 2nd generation Core i5 SandyBridge 2.5Ghz and Core i3 2.4Ghz, with 8GB of RAM in the Tower and 4GB of RAM in the notebook. For a developer's routine, they are quite good enough. A better CPU wouldn't do a whole lot.</p>
<p>I was very happy to see that this old tower has an old Intel graphics card with a DVI port. Fortunatelly I had an old DVI-to-HDMI cable around and I was able to hook it up to my ultrawide LG monitor 21:9 (2560x180) and it properly scaled everything (macOS Sierra had a regression that required a hack to make it work!)</p>
<p>What hurts a lot are the super slow mechanical hard drives (7200rpm and 5400rpm). I just ordered a RAM upgrade and 2 Crucial MX300 compatible SSD drives. When those arrive, I will have the snappiness I need.</p>
<p>That being said, when you have a fresh Fedora 25 install, what to do next?</p>
<h3>for Ubuntu users</h3>
<p>Just remember this: instead of <code>apt-get</code> you get <code>dnf</code>. Fedora prior to version 22 used to have <code>yum</code>, but <code>dnf</code> supercedes it with basically the same command options.</p>
<p>You don't have the equivalent of <code>apt-get update</code> because it auto-updates. The rest is pretty much the same: <code>dnf install package</code> instead of <code>apt-get install package</code>, <code>dnf search package</code> instead of <code>apt-cache search package</code>, and so on. For a global upgrade, do <code>dnf upgrade</code> instead of <code>apt-get update &amp;&amp; apt-get upgrade</code>.</p>
<p>For services, instead of doing <code>sudo service restart memcached</code> you can do <code>sudo systemctl restart memcached</code>.</p>
<p>That's pretty much it for the most part. Read this <a href="https://fedoraproject.org/wiki/Differences_to_Ubuntu">wiki page</a> for more command differences.</p>
<h3>Crystal Language support</h3>
<p>Let's say you want to learn this brand new language called "Crystal": Ruby-like familiar syntax and standard libraries but Go-like native binary generation, with fast concurrency primitives and all the benefits of an LLVM optimized binary.</p>
<p>You should follow <a href="https://crystal-lang.org/docs/installation/on_redhat_and_centos.html">their wiki</a> <a href="https://github.com/crystal-lang/crystal/wiki/All-required-libraries#fedora">page</a> but this is what you need:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install \<tt>
</tt>  gmp-devel \<tt>
</tt>  libbsd-devel \<tt>
</tt>  libedit-devel \<tt>
</tt>  libevent-devel \<tt>
</tt>  libxml2-devel \<tt>
</tt>  libyaml-devel \<tt>
</tt>  llvm-static \<tt>
</tt>  openssl-devel \<tt>
</tt>  readline-devel<tt>
</tt><tt>
</tt>sudo dnf -y install fedora-repos-rawhide<tt>
</tt>sudo dnf -y install gc gc-devel # get all dependencies from Fedora 25<tt>
</tt>sudo dnf -y install gc gc-devel --enablerepo=rawhide --best --allowerasing<tt>
</tt><tt>
</tt>sudo dnf -y install crystal<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's it, a lot of dependencies but as it's pre-1.0 I believe they will improve this in the future.</p>
<h3>Ruby and Node.js support</h3>
<p>Rubyists have a number of Rubies version control, but I personally like RVM. First, we need to install some <a href="https://www.socialquesting.com/blog/octopress-installation-fedora-25/">other requirements</a> and go on with it:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install patch autoconf gcc-c++ patch libffi-devel automake libtool bison sqlite-devel ImageMagick-devel nodejs git gitg<tt>
</tt>curl -sSL https://rvm.io/mpapis.asc | gpg2 --import<tt>
</tt>curl -L https://get.rvm.io | bash -s stable --ruby<tt>
</tt><tt>
</tt>sudo npm -g install brunch phantomjs<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There you go, you should have the lastest stable Ruby, Node, Npm and useful tools such as Brunch (required if you want to build Elixir-Phoenix web apps) and PhantomJS for automated acceptance tests in many languages</p>
<p>Notice that we're installing Git, the optional <a href="https://git.gnome.org//browse/gitg">GitG</a> which is a fantastic companion to your Git routine.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/583/big_Screenshot_from_2017-01-06_16-59-05.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/583/Screenshot_from_2017-01-06_16-59-05.png 2x" alt="GitG"></p>
<h3>Postgresql, Redis, Memcached support</h3>
<p>What's a web app without proper databases and cache services? Let's install them:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install postgresql-server postgresql-contrib postgresql-devel memcached redis<tt>
</tt><tt>
</tt>sudo postgresql-setup --initdb<tt>
</tt>sudo sed -i.bak 's/ident/trust/' /var/lib/pgsql/data/pg_hba.conf # NEVER do this in production servers<tt>
</tt>sudo systemctl start postgresql<tt>
</tt><tt>
</tt>sudo su - postgres<tt>
</tt>createuser youruser -p<tt>
</tt>createdb youruser --owner=youruser<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Change <code>youruser</code> for the username of your current user account, of course.</p>
<h3>Java support</h3>
<p>This is easy, let's install the lastest <a href="https://www.2daygeek.com/install-java-openjdk-6-7-8-on-ubuntu-centos-debian-fedora-mint-rhel-opensuse-manjaro-archlinux/#">OpenJDK 8</a> and web browser plugins.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install java-1.8.0-openjdk icedtea-web<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Go Support</h3>
<p>Even easier:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install go<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Do not forget to edit your profile, such as <code>$HOME/.profile</code> and add the proper environment variables:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">export GOROOT=$HOME/go<tt>
</tt>export PATH=$PATH:$GOROOT/bin<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Elixir Support</h3>
<p>There is an easy way, and a more complicated and time consuming one. Let's start with <a href="https://elixir-lang.org/install.html#unix-and-unix-like">the easy one</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install erlang elixir<tt>
</tt>mix local.hex<tt>
</tt>mix local.rebar<tt>
</tt>mix archive.install https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The problem is that packages for distros such as Fedora can take time to come out. For example, Elixir 1.4 has been out for a couple of days, but no upgrades for Fedora yet.</p>
<p>Another problem if you're professionally developing Elixir projects is that you will need an Elixir version control, because you will end up getting client projects in different Elixir versions and you need to setup your environment accordingly. That's where <a href="https://github.com/asdf-vm/asdf">asdf</a> comes in. You can follow <a href="https://gist.github.com/rubencaro/6a28138a40e629b06470">this gist</a> but I will paste the important bits here:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install make automake gcc gcc-c++ kernel-devel git wget openssl-devel ncurses-devel wxBase3 wxGTK3-devel m4<tt>
</tt><tt>
</tt>git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.2.1<tt>
</tt><tt>
</tt># For Ubuntu or other linux distros<tt>
</tt>echo '. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.bashrc<tt>
</tt>echo '. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.bashrc<tt>
</tt><tt>
</tt># restart your terminal or source the file above:<tt>
</tt>source ~/.bashrc<tt>
</tt><tt>
</tt>asdf plugin-add erlang https://github.com/asdf-vm/asdf-erlang.git<tt>
</tt>asdf plugin-add elixir https://github.com/asdf-vm/asdf-elixir.git<tt>
</tt><tt>
</tt>asdf install erlang 19.0<tt>
</tt>asdf install elixir 1.4.0<tt>
</tt><tt>
</tt>asdf global erlang 19.0<tt>
</tt>asdf global elixir 1.4.0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Compiling Erlang from source will take a humongous ammount of time, specially if you're using old CPUs like me. But this is how you both have access to the latest and greatest Elixir while also having the ability to choose older versions for client projects.</p>
<p>By the way, you can install additional asdf plugins to version control other platforms such as Go, Rust, Node, Julia and many others. Check out <a href="https://github.com/asdf-vm/asdf">their project page</a> for more details.</p>
<h3>Docker Support</h3>
<p>You will probably want to have access to Docker as well, so <a href="https://docs.docker.com/engine/installation/linux/fedora/">let's do this</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install docker docker-compose<tt>
</tt><tt>
</tt># you can test if everything went ok with the infamous hello world<tt>
</tt>sudo docker run --rm hello-world<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Desktop Apps</h2>
<p>Once you have everything in place, let's configure the non-terminal aspects for a better experience.</p>
<h3>Terminator (and Terminix)</h3>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/579/Screenshot_from_2017-01-06_16-59-53.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/579/Screenshot_from_2017-01-06_16-59-53.png 2x" alt="Terminator"></p>
<p>Speaking of terminals, you will want to install <a href="https://gnometerminator.blogspot.com.br/p/introduction.html">Terminator</a>. I really don't like using screen or tmux in my local machine (I can't get around those key bindings). I am more used to iTerm2 on macOS and Terminator is pretty much the same thing with similar key bindings. You definitelly need to replace the default terminal for this one.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install terminator<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You will also want to edit <code>~/.config/terminator/config</code> and add the following to make it better:</p>
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
</tt>23<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[global_config]<tt>
</tt>  title_transmit_bg_color = "#d30102"<tt>
</tt>  focus = system<tt>
</tt>[keybindings]<tt>
</tt>[layouts]<tt>
</tt>  [[default]]<tt>
</tt>    [[[child1]]]<tt>
</tt>      parent = window0<tt>
</tt>      type = Terminal<tt>
</tt>      profile = default<tt>
</tt>    [[[window0]]]<tt>
</tt>      parent = ""<tt>
</tt>      type = Window<tt>
</tt>[plugins]<tt>
</tt>[profiles]<tt>
</tt>  [[default]]<tt>
</tt>    use_system_font = false<tt>
</tt>    font = Hack 12<tt>
</tt>    scrollback_lines = 2000<tt>
</tt>    palette = "#073642:#dc322f:#859900:#b58900:#268bd2:#d33682:#2aa198:#eee8d5:#586e75:#cb4b16:#586e75:#657b83:#839496:#6c71c4:#93a1a1:#fdf6e3"<tt>
</tt>    foreground_color = "#eee8d5"<tt>
</tt>    background_color = "#002b36"<tt>
</tt>    cursor_color = "#eee8d5"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Another great options that was recommended to me is <a href="https://copr.fedorainfracloud.org/coprs/heikoada/terminix/">Terminix</a>. This is how you install it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf copr enable heikoada/terminix<tt>
</tt>sudo dnf -y install terminix<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Hack font</h3>
<p>You will want to have a nicer font such as <a href="https://github.com/chrissimpkins/Hack">Hack</a> around as well:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">dnf -y install dnf-plugins-core<tt>
</tt>dnf copr enable heliocastro/hack-fonts<tt>
</tt>dnf -y install hack-fonts<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Gnome Tweak Tool</h3>
<p>Now you will want to install <strong>Gnome Tweak Tool</strong> to be able to setup Hack as the default monospace font:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install gnome-tweak-tool<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Vim, Zsh, Yadr</h3>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/582/big_Screenshot_from_2017-01-06_16-59-36.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/582/Screenshot_from_2017-01-06_16-59-36.png 2x" alt="Vim gruvbox"></p>
<p>I really like to use Vim so you can install it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install vim-enhanced vim-X11<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And I really like to use <a href="https://github.com/Codeminer42/dotfiles">YADR</a> to customize all aspects of my ZSH and Vim:</p>
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
<p>I recommend you have Zsh, Vim, Ruby pre-installed before running the script above. Once you finish, I had to tweak the settings a bit:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sed 's/gtk2/gtk3' ~/.vim/settings/yadr-appearance.vim<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You'd want to tweak that file as well, to add new fonts such as Hack, and right now I am more in the mood of "gruvbox" instead of "solarized" as Vim theme.</p>
<h3>GIMP Photoshop</h3>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/580/big_Screenshot_from_2017-01-06_17-07-14.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/580/Screenshot_from_2017-01-06_17-07-14.png 2x" alt="Gimp with Photoshop Theme"></p>
<p>If you're a web developer you will have to edit a couple of images sometimes. And if you're like me, Gimp is a freaking usability nightmare. But <a href="https://www.omgubuntu.co.uk/2016/08/make-gimp-look-like-photoshop-easy">there are ways</a> to make it a bit <a href="https://github.com/doctormo/GimpPs">more palatable</a>.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo dnf -y install gimp<tt>
</tt>sh -c "$(curl -fsSL https://raw.githubusercontent.com/doctormo/GimpPs/master/tools/install.sh)"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There you go, a Photoshop-like theme for Gimp to make it less ugly.</p>
<h3>Spotify</h3>
<p>What would we, developers, be without music to concentrate?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">dnf config-manager --add-repo=https://negativo17.org/repos/fedora-spotify.repo<tt>
</tt>dnf -y install spotify-client<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>CoreBird</h3>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/581/big_Screenshot_from_2017-01-06_17-08-43.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/581/Screenshot_from_2017-01-06_17-08-43.png 2x" alt="CoreBird"></p>
<p>I am so glad that someone built a very competent and elegant Twitter client for Linux. Install CoreBird:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">dnf -y install corebird<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's probably even better than the official Mac version.</p>
<h3>Tweaking the title bar</h3>
<p>I found <a href="https://blog.samalik.com/make-your-gnome-title-bars-smaller/">this hack</a> to try to make the Gnome title bars a bit less fat, which is about the only complaint I have for the look-and-feel so far:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">tee ~/.config/gtk-3.0/gtk.css &lt;&lt;-EOF<tt>
</tt>.header-bar.default-decoration {<tt>
</tt> padding-top: 3px;<tt>
</tt> padding-bottom: 3px;<tt>
</tt> font-size: 0.8em;<tt>
</tt>}<tt>
</tt><tt>
</tt>.header-bar.default-decoration .button.titlebutton {<tt>
</tt> padding: 0px;<tt>
</tt>}<tt>
</tt>EOF<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Conclusion</h3>
<p>Most of everything you need is web based, so Gmail, Slack, all work just fine. Fire up Chromium, Firefox or install <a href="https://meetfranz.com/">Franz</a> or <a href="https://thomas101.github.io/wmail/">WMail</a> if you have to. Unfortunatelly everything that is web based consumes a lot of RAM, and this is really bad. I do miss good old, slim, native apps. Web-based apps are a huge hassle.</p>
<p>They "work", but I'd rather have a good native app. On the other hand, Dropbox and Skype have really terrible client apps. They are very poorly maintained, full of bugs, and terrible support. I'd rather not have them.</p>
<p>I was trying to get used to Thunderbird while on Ubuntu. Geary is still not good enough. But I was surprised when I tried Evolution again. It has the only thing I really want from any email client: a damn shortcut to move emails to folders: Ctrl-Shift-V (!!) How hard can that be??</p>
<p>Gnome 3 has a global Online Accounts repository in the Settings where you can register social networks such as Facebook and Google, but the Google support is <a href="https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=820913">buggy</a>. It expires everytime, so don't use Evolution with it. Add the Imap/Smtp information manually instead. Email and Calendar data is properly synced that way.</p>
<p>You should have all your password in a LastPass account by now. Authy is a Chrome extension, so your multi-factor authentication should also just work.</p>
<p>My personal bank and investment companies, with their ugly Java applets, work just fine with Chromium and IcedTea, so I'm ok there too.</p>
<p>I just have to figure out the easiest backup strategy to have everything really secure. On the installation process, do not forget to choose the encrypted partition option - and if you do, definitelly backup your data regularly as I've heard of bugs during upgrades that made the encrypted partitions inaccessible. Be secure and also be careful.</p>
<p>As usual, from my macOS the only 2 things I will really miss is Apple Keynote (it's really amazing as no one was able to make a slick and fast presentation tool as good as Keynote) and iMovie for quick video editing (although <a href="https://kdenlive.org/">Kdenlive</a> is a very good alternative).</p>
<p>You even have built-in <a href="https://wiki.gnome.org/Gnome3CheatSheet">shortcuts</a> to screen capture a window or an area and <a href="https://fedoramagazine.org/taking-screencast-fedora/">record a screencast</a>!</p>
<p>Compared to my Ubuntu configuration, this Fedora 25 is really a pleasure to use. A competent macOS replacement. I highly recommend it!</p>
<p>And as I said at the update in the beginning of the post. Do check out <a href="https://www.akitaonrails.com/2017/01/10/arch-linux-best-distro-ever">Arch Linux</a> and how to <a href="https://www.akitaonrails.com/2017/01/17/optimizing-linux-for-slow-computers">optimize your distro to be more responsiveness</a>, particularly on old hardware.</p>
<p></p>
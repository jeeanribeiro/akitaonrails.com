---
title: "Arch Linux - Best distro ever?"
date: "2017-01-10T16:25:00.000Z"
tags: ["archlinux", "pacman", "pacaur", "asdf"]
years: "2017"
---

<p></p>
<p><strong>Update 01/18/2017:</strong> If you're on old hardware like me, you may want to optimize your installation to be way more responsiveness, <a href="http://www.akitaonrails.com/2017/01/17/optimizing-linux-for-slow-computers">read all about it here</a>.</p>
<p>Since I decided to move back from macOS to Linux, I didn't want to just return to old Ubuntu (yes, I get bored of doing the same things for too long). So I tried out Fedora 25 and I was delighted by how Gnome 3.22 evolved nicely.</p>
<p>Compared to Ubuntu, Fedora's defaults felt nicer. In practice, you can force any distro to become whatever you want, but I'd rather not fight the defaults. Ubuntu is heavily customized for Unity and I really, really dislike it. It feels more like a toy than a serious environment to do work.</p>
<p>Fedora 25 looks good with Gnome 3, but it still gave me a few headaches. One thing that didn't work at all was <a href="https://wiki.gnome.org/Projects/GnomeOnlineAccounts">Gnome's Online Accounts</a>. GOA collects authentication tokens after you sign in to your social services like Google. Then compatible apps like Evolution and the built-in Calendar can pick them up. But the tokens were getting expired all the time, so the integration was useless. And manually configuring Evolution for Google wasn't pleasant.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/584/Screenshot_from_2017-01-10_14-15-41.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/584/Screenshot_from_2017-01-10_14-15-41.png 2x" alt="Arch Linux"></p>
<p>Now the surprise: on Arch Linux, I chose Gnome 3.22 as my desktop and manually installed the <a href="https://www.archlinux.org/packages/extra/i686/gnome-online-accounts/">gnome-online-account</a> package. I signed in to my Google accounts and I am delighted to report that it's not expiring and it "Just Works"! This is the kind of polish I expect from a major distro, not the fiasco that's labeled as "stable" in Fedora.</p>
<p></p>
<p></p>
<h3>Why Arch Linux?</h3>
<p>Most major distros are divided between "stable" (but with very old packages) and "unstable" (but with the cutting-edge goodness). If you install the Long-Term Support (LTS) versions, you're doomed to have only old packages from a couple of years ago. If you install the unstable repositories, you're doomed to have stuff exploding in your face without explanation and losing hours browsing through Stackoverflow.</p>
<p>Now, it seems that Arch figured out the exactly "right" level of confidence between stable and cutting-edge. It keeps pushing the most recent version of software without breaking everything else all the time. So, in Ubuntu 16.04 and Fedora 25, if I want to install Postgresql, I am locked in to 9.4 or 9.5, but in Arch I can access 9.6 from the main Pacman repositories. (By the way, "Pac"kage "Man"ager is the most obvious name ever).</p>
<p>You can easily <code>pacman -Sy postgresql</code> and you're in business.</p>
<p>And if you're on Ubuntu 14.04 and now you want 16.04, good luck on <code>dist-upgrade</code> your way. It's easier to start from scratch.</p>
<p>So, it seems that the philosophy of Arch is to have the real most recent version of all software that won't break your system. There is no such thing as a big bang upgrade every 6 months that breaks everything. Instead, you have a constantly <strong>rolling</strong> upgrade system, where you're always on the latest version, without having to wait another year for the next big LTS.</p>
<p>Every major distro has "unsupported" repositories for proprietary binaries (codecs for example) or 3rd-party software. Then, there is Arch User Repository (AUR): a collection of small Git repositories from users maintaining simple <code>PKGBUILD</code> text files.</p>
<p>AUR is clever. If you're from macOS and familiar with Homebrew, you will understand it: it feels like Casks and Formulas. A <code>PKGBUILD</code> file can describe a recipe to download an available DEB package or tarball, disassemble it and rebuild it as a Pacman compatible package. It can describe the necessary dependencies and make the installation process super smooth.</p>
<p>For example, Sublime Text only has an option to download a DEB package or a tarball with the binaries. Same goes for Spotify, Franz, etc. Sometimes you can register Personal Package Archives (PPAs) and then <code>apt-get</code> your way in installing them. But you still need someone to build, maintain and distribute those packages properly. It's a lot of work.</p>
<p>Now, maintaining a simple Git repository with a simple PKGBUILD text file is far easier. <code>makepkg</code> does the hard work of build the package you need, in your machine, and then <code>pacman</code> can handle installing it like any other package. No more <code>wget</code>-ing tarballs and configuring everything manually!</p>
<p>Maybe I can finally just do <code>pacman -Syu</code> and have everything "really" upgraded without having to worry about the next big LTS that will eventually force me to reinstall everything from scratch.</p>
<h3>Arch Linux is perfect for "Beginners"</h3>
<p>I've been hearing about Arch for a long while and their users are very enthusiastic in trying to convince other people to join. Whenever you see such a heavily loyal fanbase there must be something interesting hidden under the hoods. Rolling upgrades, Pacman, AUR are really valuable reasons.</p>
<p>After just one day using it, I've come to realize that Arch is good for advanced users, but also for <strong>beginners</strong>. But not because it is easy. On the contrary: it's because it is hard in the right way.</p>
<p>Most "Linux users" nowadays just get a trivial-to-install distro, such as Ubuntu or Elementary, and they have no idea what goes on underneath. Blindlessly clicking "next" in the graphical installers.</p>
<p>Most people have no idea what TTYs are. That you can probe USB devices with command line tools such as <code>lsusb</code> or that you must use tools such as <code>fdisk</code> to partition and then <code>mkfs.ext4</code> to format them. That memory swap files are partitions with a special format. They are not aware of LVM options for flexible partitioning, or even that LVM exists at all. That the "thing" you choose your kernel from in the boot menu is called Grub and that you can tweak it.</p>
<p>There is a lot going on in assembling a fully functional Linux-based distribution. But graphical installers hide most of it. Arch Linux forces you to go step by step and really feel like you "own" your machine, not the other way around.</p>
<p>If you're a "beginner", I really urge you to install a distro like Arch a few times, in different configurations of machines, to really understand what an operating system really looks like.</p>
<p>The <a href="https://wiki.archlinux.org/">Arch Wiki</a> is a very comprehensive and detailed repository of information for everything you ever need to know about installing and maintaining every component of a proper Linux system. You will learn a lot in the process.</p>
<p>But if you're like me, and you've been doing that through all the mid 90's and early 2000's (heck, I had to learn my way through Slackware 1.0, I still remember having to use boot and root floppy disks and screwing up my hard-drives not understanding cylinders and sectors through fdisk), you can skip it. For you, advanced/experienced users, I'd recommend you go with <a href="https://arch-anywhere.org/">Arch Linux Anywhere</a>.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/586/big_20170109_150742.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/586/20170109_150742.jpg 2x" alt="Arch Anywhere"></p>
<p>It will custom install Arch but will provide you with enough automation to not waste much time in bringing a properly configured Arch installation up and running, without bloatware.</p>
<h3>Pacaur - best way to deal with AUR</h3>
<p>Arch users are quick to praise Pacman. For the most part, you can basically do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -S chromium<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's it. And then you can <code>sudo pacman -Syu</code> to upgrade installed packages. This is the basics you need to know.</p>
<p>If you're a developer I also recommend you to install the basic development packages:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Sy --needed base-devel<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, you can manually install AUR packages. You can go to their website and <a href="https://aur.archlinux.org/packages/?O=0&amp;K=terminix">search for "terminix"</a> (a very nice Terminal replacement, similar to Mac's iTerm2) for example. You will end up in <a href="https://aur.archlinux.org/packages/terminix/">this page</a> and you will have to manually do the following:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git clone https://github.com/gnunn1/terminix.git<tt>
</tt>cd terminix<tt>
</tt>makepkg -si<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Feels simple, but you can do better by installing <a href="https://github.com/rmarquis/pacaur">Pacaur</a>, a wrapper on top of Pacman. If you're using a graphical terminal such as Terminal or Terminix DO NOT FORGET to edit the profile to "Run command as login shell", otherwise there will be a PATH problem and Cower will fail to install
  .</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -S expac yajl --noconfirm<tt>
</tt>gpg --recv-keys --keyserver hkp://pgp.mit.edu 1EB2638FF56C0C53<tt>
</tt>git clone https://aur.archlinux.org/cower.git<tt>
</tt>cd cower<tt>
</tt>makepkg -si<tt>
</tt>cd ..<tt>
</tt>git clone https://aur.archlinux.org/pacaur.git<tt>
</tt>cd pacaur<tt>
</tt>makepkg -si<tt>
</tt>cd ..<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In summary, Pacaur can be used not only as a complement to install AUR packages, but also if you want to use a single tool to manage both AUR and official Pacman packages. All commands <code>-S</code> will be Pacman commands. So instead of doing <code>sudo pacman -Syu</code> to upgrade all packages, you can replace it for <code>pacaur -Syu</code>. Everything else mostly "just works".</p>
<p>When you try to install a package with <code>-S</code> it will first look into the official repos, if not found then it tries AUR. There's even a nice GUI if you want:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pacaur -S pamac-pacaur<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, to install the same Terminix, you can do just this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pacaur -Sy terminix<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It will ask you simple yes/no questions such as "Do you want to edit the build file?" You can answer "n" to those and confirm "y" when it asks you if you want to install the dependencies or the generated package.</p>
<p>And that's it! You can search the AUR repositories with:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pacaur -s spotify<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It will give you a lot of options, for example:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ pacaur -s spotify<tt>
</tt>aur/spotify 1.0.47.13-1 (1037, 36.09) [installed]<tt>
</tt>    A proprietary music streaming service<tt>
</tt>aur/playerctl 0.5.0-1 (127, 11.33)<tt>
</tt>    mpris media player controller and lib for spotify, vlc, audacious, bmp, xmms2, and others.<tt>
</tt>aur/blockify 3.6.3-3 (106, 5.61)<tt>
</tt>    Mutes Spotify advertisements.<tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Common sense, my friends. Read, interpret, choose. Arch requires you to be a <strong>smart</strong> person, and by "smart" I mean: knowing how to read! Most people skip reading things and just click stuff like moron.</p>
<p>Now that you know the exact name of the package you want, just install it normally like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pacaur -S spotify<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/604/Screenshot_from_2017-01-16_14-21-49.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/604/Screenshot_from_2017-01-16_14-21-49.png 2x" alt="Pacaur"></p>
<p>Pacaur is one of many <a href="https://wiki.archlinux.org/index.php/AUR_helpers">AUR Helpers</a>. I was initially drawn into Yaourt, but after research, you figure out that you should only try out aurutils, bauerbill or pacaur. I prefer the latter because it's easier to spell out.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pacaur -Syua<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should keep your system up to date, both the official and AUR packages.</p>
<h3>Asdf - the last languages version manager you'll ever need</h3>
<p>If you're a Rubyist, you're familiar with RVM, rbenv, chruby. If you're from Node.js you know the RVM-inspired NVM to manage your different versions of Node. Each new language nowadays needs a version manager as they're evolving quickly and because if you work with client projects you will eventually need to use an old version to deal with legacy software.</p>
<p>So even though you can install the current stable Ruby 2.3.3 by just doing <code>pacman -S ruby</code> or <code>pacaur -S ruby</code> you will eventually need to switch back to Ruby 2.1 or older for a client project, for example.</p>
<p>Should you install RVM? Or rbenv? And how do you deal with different versions of Clojure, Go, Rust, Elixir?</p>
<p>That sounds like yet another maintenance nightmare to deal with. But someone decided to actually solve this problem in an elegant way. Enter <a href="https://github.com/asdf-vm/asdf">asdf</a> - and if you happen to know <a href="https://github.com/HashNuke">Akash Manohar</a> give him a big hug.</p>
<p>Let's install it (from the project's README):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.2.1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then edit your shell config files:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># For Ubuntu or other linux distros<tt>
</tt>echo -e '\n. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.bashrc<tt>
</tt>echo -e '\n. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.bashrc<tt>
</tt><tt>
</tt># OR for Mac OSX<tt>
</tt>echo -e '\n. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.bash_profile<tt>
</tt>echo -e '\n. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.bash_profile<tt>
</tt><tt>
</tt># For the Fish shell<tt>
</tt>echo 'source ~/.asdf/asdf.fish' &gt;&gt; ~/.config/fish/config.fish<tt>
</tt>mkdir -p ~/.config/fish/completions; and cp ~/.asdf/completions/asdf.fish ~/.config/fish/completions<tt>
</tt><tt>
</tt># If, like me, you like ZSH with YADR (you have to install YADR before this)<tt>
</tt>touch ~/.zsh.after/asdf.zsh<tt>
</tt>echo -e '\n. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.zsh.after/asdf.zsh<tt>
</tt>echo -e '\n. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.zsh.after/asdf.zsh<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This tool is very self explanatory. Let's start by installing a bunch of plugins (full table of links in the README file):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf plugin-add clojure https://github.com/vic/asdf-clojure.git<tt>
</tt>asdf plugin-add elixir https://github.com/asdf-vm/asdf-elixir.git<tt>
</tt>asdf plugin-add erlang https://github.com/asdf-vm/asdf-erlang.git<tt>
</tt>asdf plugin-add golang https://github.com/kennyp/asdf-golang.git<tt>
</tt>asdf plugin-add ruby https://github.com/asdf-vm/asdf-ruby.git<tt>
</tt>asdf plugin-add rust https://github.com/code-lever/asdf-rust.git<tt>
</tt>asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you're like me, you must be <strong>super excited</strong> because you already know what we will do next:</p>
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
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt>29<tt>
</tt><strong>30</strong><tt>
</tt>31<tt>
</tt>32<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Sy jdk8-openjdk # you need Java for Clojure<tt>
</tt><tt>
</tt>asdf install clojure 1.8.0<tt>
</tt>asdf global clojure 1.8.0<tt>
</tt>mkdir ~/bin<tt>
</tt>wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein -O ~/bin/lein<tt>
</tt>chmod +x ~/bin/lein<tt>
</tt>export PATH=$PATH:~/bin<tt>
</tt># echo "PATH=$PATH" &gt; ~/.zsh.after/binpath.zsh # if you use YADR+ZSH<tt>
</tt>lein<tt>
</tt><tt>
</tt>asdf install erlang 19.0<tt>
</tt>asdf global erlang 19.0<tt>
</tt><tt>
</tt>asdf install elixir 1.4.0<tt>
</tt>asdf global elixir 1.4.0<tt>
</tt>mix local.hex<tt>
</tt>mix local.rebar<tt>
</tt><tt>
</tt>asdf install golang 1.7.4<tt>
</tt>asdf global golang 1.7.4<tt>
</tt><tt>
</tt>asdf install ruby 2.4.0<tt>
</tt>asdf global ruby 2.4.0<tt>
</tt>gem install bundler<tt>
</tt><tt>
</tt>asdf install rust 1.14.0<tt>
</tt>asdf global rust 1.14.0<tt>
</tt><tt>
</tt>asdf install nodejs 7.4.0<tt>
</tt>asdf global nodejs 7.4.0<tt>
</tt>npm -g install brunch phantomjs<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That's it! We now have every language we need installed and ready to use! What if I need Ruby 2.3.1 for a client project?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf install ruby 2.3.1<tt>
</tt>asdf local ruby 2.3.1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now I have 2.3.1 locally (I can change it to be the system default using <code>global</code>).</p>
<p>Most of the maintenance effort summarizes to this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf plugin-update --all # update the individual plugins<tt>
</tt>asdf list-all [language] # to list all available versions<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that's basically it! You have almost everything you need to develop software.</p>
<h3>Useful Software to Install</h3>
<p>Now, as usual, let me recommend some software:</p>
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
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt>29<tt>
</tt><strong>30</strong><tt>
</tt>31<tt>
</tt>32<tt>
</tt>33<tt>
</tt>34<tt>
</tt>35<tt>
</tt>36<tt>
</tt>37<tt>
</tt>38<tt>
</tt>39<tt>
</tt><strong>40</strong><tt>
</tt>41<tt>
</tt>42<tt>
</tt>43<tt>
</tt>44<tt>
</tt>45<tt>
</tt>46<tt>
</tt>47<tt>
</tt>48<tt>
</tt>49<tt>
</tt><strong>50</strong><tt>
</tt>51<tt>
</tt>52<tt>
</tt>53<tt>
</tt>54<tt>
</tt>55<tt>
</tt>56<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># make sure you're up to date<tt>
</tt>sudo pacman -Syu<tt>
</tt><tt>
</tt># install multimedia codecs<tt>
</tt>sudo pacman -Sy gstreamer0.10-plugins<tt>
</tt>sudo pacman -Sy exfat-utils fuse-exfat a52dec faac faad2 flac jasper lame libdca libdv gst-libav libmad libmpeg2 libtheora libvorbis libxv wavpack x264 xvidcore gstreamer0.10-plugins flashplugin libdvdcss libdvdread libdvdnav gecko-mediaplayer dvd+rw-tools dvdauthor dvgrab pulseaudio-equalizer-<tt>
</tt><tt>
</tt># if you need japanese fonts like me<tt>
</tt>sudo pacman -Sy adobe-source-han-sans-otc-fonts otf-ipafont<tt>
</tt><tt>
</tt># some components that you will need<tt>
</tt>sudo pacman -Sy fuse-exfat <tt>
</tt><tt>
</tt># I personally like the Numix theme and Breeze Icons, change them with the Tweak Tool<tt>
</tt>sudo pacman -Sy numix-themes breeze-icons <tt>
</tt><tt>
</tt># Ifnstall more good looking fonts<tt>
</tt>sudo pacman -Sy ttf-dejavu <tt>
</tt>pacaur -S ttf-ms-fonts ttf-vista-fonts ttf-liberation adobe-source-sans-pro-fonts ttf-ubuntu-font-family<tt>
</tt><tt>
</tt># Firefox and Java plugin<tt>
</tt>sudo pacman -Sy icedtea-web firefox<tt>
</tt><tt>
</tt># for devs<tt>
</tt>sudo pacman -Sy zsh the_silver_searcher gvim imagemagick htop<tt>
</tt>pacaur -Sy ttf-hack<tt>
</tt><tt>
</tt># Native wrapper for Web apps such as Slack, Hangout, etc<tt>
</tt>pacaur -Sy franz-bin<tt>
</tt><tt>
</tt># Best native Twitter client for Linux<tt>
</tt>pacaur -Sy corebird<tt>
</tt><tt>
</tt># No need to explain<tt>
</tt>pacaur -Sy spotify<tt>
</tt>pacaur -Sy sublime-text-dev # install these plugins https://www.hongkiat.com/blog/sublime-text-plugins/<tt>
</tt><tt>
</tt># If you like to read RSS<tt>
</tt>pacaur -Sy feedreader-beta<tt>
</tt><tt>
</tt># if you need Office-like support<tt>
</tt>sudo pacman -Sy libreoffice-fresh<tt>
</tt><tt>
</tt># if you need Photoshop-like support<tt>
</tt>sudo pacman -Sy gimp<tt>
</tt>sh -c "$(curl -fsSL https://raw.githubusercontent.com/doctormo/GimpPs/master/tools/install.sh)"<tt>
</tt><tt>
</tt># if you want a really good video editor<tt>
</tt>sudo pacman -Sy frei0r-plugins dvdauthor vlc<tt>
</tt>pacaur -Sy kdenlive<tt>
</tt><tt>
</tt># this can make CPU-intensive software to behave better and guarantee better user experience<tt>
</tt>pacaur -Sy ananicy-git<tt>
</tt><tt>
</tt># dropbox is the most horrible piece of software, but you may need it:<tt>
</tt>pacaur -Sy dropbox dropbox-cli nautilus-dropbox<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As usual, I like to replace Bash for Zsh and configure Vim with YADR:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sh -c "`curl -fsSL https://raw.githubusercontent.com/skwp/dotfiles/master/install.sh`"<tt>
</tt>touch ~/.vimrc.before<tt>
</tt>touch ~/.vimrc.after<tt>
</tt>echo "let g:yadr_using_unsolarized_terminal = 1" &gt;&gt; ~/.vimrc.before<tt>
</tt>echo "let g:yadr_disable_solarized_enhancements = 1" &gt;&gt; ~/.vimrc.after<tt>
</tt>echo "colorscheme gruvbox" &gt;&gt; ~/.vimrc.after<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>To install and configure Postgresql 9.6:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Sy postgresql<tt>
</tt>sudo -u postgres -i<tt>
</tt>initdb --locale $LANG -E UTF8 -D '/var/lib/postgres/data'<tt>
</tt>exit<tt>
</tt><tt>
</tt># do not do this in Production machines<tt>
</tt>sudo sed -i.bak 's/ident/trust/' /var/lib/postgres/data/pg_hba.conf<tt>
</tt>sudo systemctl start postgresql<tt>
</tt>sudo systemctl enable postgresql<tt>
</tt><tt>
</tt>sudo -u postgres -i<tt>
</tt>createuser --interactive # create with your username and superuser role<tt>
</tt>createdb youruser<tt>
</tt>exit<tt>
</tt>sudo systemctl restart postgresql<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you want to install Docker:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Sy docker<tt>
</tt>sudo usermod -aG docker $USER<tt>
</tt>sudo systemctl start docker<tt>
</tt>sudo systemctl enable docker<tt>
</tt>logout<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We always need Redis, Memcached, so let's install them:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Sy redis memcached<tt>
</tt>sudo systemctl start redis<tt>
</tt>sudo systemctl enable redis<tt>
</tt>sudo systemctl start memcached<tt>
</tt>sudo systemctl enable memcached<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>After you install and remove a lot of software, you may end up with unnecessary packages eating up disk space. You can clean it up with:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Rns $(pacman -Qtdq)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And as I said before, the Arch Wiki is super useful for you to keep tweaking your system, so make sure you read articles such as <a href="https://wiki.archlinux.org/index.php/Improving_performance">this "Improving Performance" page</a>.</p>
<h3>Desktop Kernels</h3>
<p>One thing to keep in mind about most Linux distros is that the kernel is usually compiled to be better optimized for Servers.</p>
<p>Modern hardware, especially with lots of RAM and equipped with an SSD "should" work well enough. But not always, you may experience some "stutters" or even total unresponsiveness.</p>
<p>There are many reasons why, but the 2 main culprits are application memory being paged out to disk swap and the I/O scheduler of the Linux kernel.</p>
<p>In a server scenario, you want processes to have a fair share of resources, which is why a process scheduler such as CFS - Completely Fair Scheduler - and CFQ - Complete Fairness Queueing - for I/O, are fantastic.</p>
<p>But in the Desktop the story is totally different. You are willing to trade-off high throughput for lower latency in order to have responsiveness. No one wants to have their UI and mouse pointer frozen while copying large files to USB drives, or while waiting for that nasty <code>make -j9</code> to finish compiling your also nasty gcc-gcj. You may end up with a frozen UI for hours! This is just unacceptable!</p>
<p>What you want for Desktop usage, with dozens of random processes doing random operations, is almost "soft real time" configuration. A more aggressive preemption where the Kernel gives some control back to the UI so you can do other stuff - albeit slower. Low latency is the key to have a smooth user experience.</p>
<p>To increase responsiveness, the most important first thing you want to do is configure this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo tee -a /etc/sysctl.d/99-sysctl.conf &lt;&lt;-EOF<tt>
</tt>vm.swappiness=1<tt>
</tt>vm.vfs_cache_pressure=50<tt>
</tt>vm.dirty_background_bytes=16777216<tt>
</tt>vm.dirty_bytes=50331648<tt>
</tt>EOF<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reboot. If you want to know what those settings are, <a href="https://rudd-o.com/linux-and-free-software/tales-from-responsivenessland-why-linux-feels-slow-and-how-to-fix-that">read this</a>.</p>
<p>And you may want to install a customized Kernel with a different Scheduler. There are 3 options nowadays: <a href="https://aur.archlinux.org/packages/linux-zen-git/">Zen</a>, <a href="https://liquorix.net/">Liquorix</a> and <a href="https://aur.archlinux.org/packages/linux-ck/">CK</a>.</p>
<p>I am still not 100% sure which one is the best, they have a few maintenance concerns.</p>
<p>Out of the 3, you will want to stick to Zen (which is <a href="https://github.com/zen-kernel/zen-kernel/issues/30#issuecomment-142787936">basically Liquorix</a>), as it's maintained in the official repositories in binary format (believe me, you don't want to wait for a custom kernel to compile, it takes forever).</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Sy linux-zen<tt>
</tt>sudo grub-mkconfig -o /boot/grub/grub.cfg<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reboot.</p>
<p>The main change is probably the I/O Scheduler, upgrading from the standard CFQ to BFQ. If you're using a mechanical hard drive you will want to use the better BFQ (which Zen enables by default). If you're using an SSD you will want 'deadline' instead.</p>
<p>DO NOT INSTALL THOSE KERNELS IN PRODUCTION SERVERS! They are intended for desktop usages only!</p>
<p>For the most part, Zen may have the better balance between stability and tweak set. You may want to use it, especially in older hardware. Modern hardware, as I said, may not notice too much difference.</p>
<h3>Conclusion</h3>
<p>I am not sure if it is the Arch maintainers that are doing a super job or if it's RedHat and Canonical that are screwing up their distros so badly in comparison.</p>
<p>I mean, Ubuntu, Fedora, OpenSuse, Elementary, are all fair and nice distros that, most of the time, "just works".</p>
<p>But for a distro that many consider targetted to "advanced users", Arch is way more polished. I can't figure out why.</p>
<p>In the same hardware, the Gnome 3 experience under Arch is noticeably better than the same Gnome 3 over Fedora. Compared to Unity on Ubuntu, it's miles ahead. It's fast, fluid, good looking, the defaults all work out nicely.</p>
<p>And all of a sudden I realize that I don't have to worry about major upgrades. Rolling upgrades to the latest continuously brings me another layer of confidence.</p>
<p>Arch makes me feel like I am in control again without requiring me to waste hours tweaking things to my liking. The defaults are rock solid and I can small improvements over it whenever I need to.</p>
<p>Kudos to the Arch maintainers, this is the finest Linux distro I've ever had the pleasure to play with. I hope this feeling goes on as I keep using this as my daily driver. But so far I am convinced that this is the right choice.</p>
<p></p>
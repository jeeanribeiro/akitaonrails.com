---
title: "Running Arch Linux over Windows 10!"
date: "2018-04-30T01:06:00.000Z"
tags: ["wsl", "asdf", "microsoft", "windows", "vmware"]
years: "2018"
---

<p></p>
<p>Ok, anyone that has been reading my blog for the past year or two knows how I <a href="http://www.akitaonrails.com/archlinux">enjoy Arch Linux</a> (in particular Manjaro Gnome).</p>
<p>I am also still very much intrigued by the idea of Windows Subsystem for Linux (or WSL) which properly debuted in the <a href="http://www.akitaonrails.com/2016/07/26/the-year-of-linux-on-the-desktop-it-s-usable">Windows 10 Anniversary Edition</a> back in mid-2016.</p>
<p>It's been almost 2 years and we're expecting some significant updates to WSL compatibility and performance for the next <a href="https://winaero.com/blog/command-line-wsl-improvements-windows-10-version-1803/">Spring Creators Update</a> (or version 1803) scheduled to arrive on April 30, 2018. This brings it closer to make WSL actually usable for professional programmers. Just to give you an idea, right now you will have orders of magnitude better performance if you run your favorite Linux distro inside Virtualbox or VMWare Workstation.</p>
<p></p>
<p></p>
<p>Moreover, out of the box the "Bash for Windows" proper only officially supports Ubuntu, Fedora, and OpenSuse I guess. Most people will just install Ubuntu. And it works ok. For a toy and cool demonstration purposes, it works. But it really frustrates me that I can do so much but I can't actually use it as my daily driver. It's like being able to carry the fully built prototype of the next iPhone but no 4G support yet. So it's just a toy.</p>
<p>Bear with me here, if you want to just see how is the performance compared to my VMWare setup, go straight to the end of the article.</p>
<p>Anyway, in the case of distros. Serious Linux users would prefer better alternatives. Enter this GitHub repository:</p>
<p><a href="https://github.com/yuk7/ArchWSL"><img src="https://raw.githubusercontent.com/wiki/yuk7/WSL-DistroLauncher/img/Arch_Alpine_Ubuntu.png" srcset="https://raw.githubusercontent.com/wiki/yuk7/WSL-DistroLauncher/img/Arch_Alpine_Ubuntu.png 2x" alt="screenfetch of arch"></a></p>
<p>You just download <a href="https://github.com/yuk7/ArchWSL/releases/latest">this zip file</a>, unzip it and run the included <code>Arch.exe</code>. And that's about it!</p>
<p>Now, you can go ahead and open the Windows version of "Bash" and we can bootstrap the rest of the installation setup from there.</p>
<p>We must get Pacman and some AUR manager. To start Pacman, we must do this:</p>
<pre><code>pacman-key --init
pacman-key --populate
pacman -Syu
</code></pre>
<p>Hell yeah, Pacman running natively on Windows!! Who would've known??</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/674/big_IMG_20180429_174518.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/674/IMG_20180429_174518.jpg 2x" alt="pacman on windows"></p>
<p>This will bring everything up to date. Next up, we must create a non-root user:</p>
<pre><code>useradd -m your_user
passwd your_user
EDITOR=nano visudo
</code></pre>
<p>Look for the line that says <code>root   ALL=(ALL) ALL</code> and add your user right on the next line like this:</p>
<pre><code>your_user   ALL=(ALL) ALL
</code></pre>
<p>Finally, we should login as this user:</p>
<pre><code>su your_user
</code></pre>
<p>Next up, let's install Yaourt so we can use it to install Pacaur (this is a personal preference, you can just use Yaourt. I think Yaourt prompts too much, that's why I prefer Pacaur).</p>
<p>Start by editing your <code>/etc/pacman.conf</code> file with your favorite editors like vim or nano.</p>
<p>Just add the following section to the very bottom of the file:</p>
<pre><code>[archlinuxfr]
SigLevel = Never
Server = https://repo.archlinux.fr/$arch
</code></pre>
<p>Before we can proceed, we have one small problem. WSL still has no support for SYSV IPC. This is required for <a href="https://unix.stackexchange.com/questions/9714/what-is-the-need-for-fakeroot-command-in-linux">fakeroot</a>, which is required by <code>makepkg</code> (which cannot run as root).</p>
<p>To overcome this problem, this is what we'll have to do:</p>
<pre><code>wget https://github.com/yuk7/arch-prebuilt/releases/download/17121600/fakeroot-tcp-1.22-1-x86_64.pkg.tar.xz
sudo pacman -U fakeroot-tcp-1.22-1-x86_64.pkg.tar.xz
</code></pre>
<p>And that's it for now! Until WSL add proper support for SYSV IPC, we can use this. Yaourt itself will probably prompt you to install <code>fakeroot-tcp</code> on top of it, just let it.</p>
<p>As I said, Yaourt is quite verbose in its many prompts for confirmations. Rule of thumb, whenever it prompts if you want to edit anything, just say "N"(o). Whenever it prompts you if you want to build or install something, just say "Y"(es). If you got annoyed with me, do this:</p>
<pre><code>yaourt -S pacaur
</code></pre>
<p>From now on, I will assume you have Pacaur.</p>
<h3>Graphical User Interface Support</h3>
<p>Now, let's install some of the basics for a development environment:</p>
<pre><code>sudo pacman -S base base-devel gvim git
</code></pre>
<p>It will prompt you sometimes "default: all", just install everything. Hard disk space should not be a concern in 2018.</p>
<p>I prefer to have a full-on GNOME 3 environment, so I just do:</p>
<pre><code>sudo pacman -S gnome
</code></pre>
<p>Again, let it install everything it wants. Everybody has a different taste when it comes to GUIs, some prefer KDE5, other prefer XFCE4. Some even go as far as using the tile-based GUI <a href="https://i3wm.org/">i3</a>.</p>
<p>That requires some serious adapting. It's for people that like to do stuff like using a tenkeyless keyboard with nothing written in the keycaps and using an alien layout like DVORAK or <a href="https://colemak.com/">Colemak</a> (yikes!). Taste is taste. And I dare you to become a touch typist using <a href="https://www.maltron.com/the-maltron-letter-layout-advantage.html">Maltron</a>, I double dare ya! :-D</p>
<p>But, I digress. Now, you can add this to your <code>/etc/.bashrc</code> file or the global <code>/etc/environment</code> file:</p>
<pre><code>echo "export LIBGL_ALWAYS_INDIRECT=1" &gt;&gt; /etc/.bashrc
echo "export DISPLAY=:0" &gt;&gt; /etc/.bashrc
</code></pre>
<p>Export those to your current shell, or just close and reopen Bash.</p>
<p>We can have a full GUI environment by installing a local X Server. You have 2 options, Xming and VcXSrv. I am having trouble resizing windows in Xming, so I am recommending <a href="https://sourceforge.net/projects/vcxsrv/">VcXSrv</a> instead. Just download and install it as you would with any Windows application and start it up. It will add a Desktop shortcut named "XLaunch", just fire it up.</p>
<p>And finally, we can install a <strong>PROPER</strong> usable terminal instead of that poor contraption derived from old cmd.exe that WSL provides you out of the box.</p>
<pre><code>pacaur -S tilix-bin
tilix
</code></pre>
<p>If you've been a Mac user, you probably know iTerm2, which is possibly the best Terminal emulator I've ever used. There is nothing else that comes close. Nothing, except possibly <a href="https://gnunn1.github.io/tilix-web/">Tilix</a> (previously known as Terminix).</p>
<p>Just for having "Ctrl-Alt-D" to split the terminal horizontally down and "Ctrl-Alt-R" to split it vertically to the right, and using "Alt-1", "Alt-2", and so on to switch between the terminals, it's great for me. It also comes pre-installed with very nice themes such as the now classic Solarized Dark or my current favorite Monokai Dark.</p>
<p>Don't curse me, I know. Some will prefer the default terminal app and just add TMUX. Again, taste (it's more useful if I were working on a remote server).</p>
<p>Add the Hack monotype font to make everything more pleasing to the eye:</p>
<pre><code>sudo pacman -S ttf-hack
</code></pre>
<h3>Programming Languages</h3>
<p>Let's see if the most important languages out there install correctly. As I always say, look no further than ASDF for that task.</p>
<pre><code>git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.4.3
echo -e '\n. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.bashrc
echo -e '\n. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.bashrc
</code></pre>
<p>Restart your terminal and continue:</p>
<pre><code>asdf plugin-add nodejs
addf plugin-add ruby
</code></pre>
<p>For Node.js you must add the proper GPG keys and only then you can install:</p>
<pre><code>bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring
asdf install nodejs 10.0.0
asdf global nodejs 10.0.0
</code></pre>
<p>Ruby benefits with jemalloc to allocate less system memory. I have no idea if it impacts WSL but let's do it anyway:</p>
<pre><code>sudo pacman -S jemalloc
RUBY_EXTRA_CONFIGURE_OPTIONS="--with-jemalloc" asdf install ruby 2.5.1
asdf global ruby 2.5.1
gem install bundler
</code></pre>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/675/big_IMG_20180429_193432.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/675/IMG_20180429_193432.jpg 2x" alt="ruby compiles"></p>
<p>So far so good, if you need to install an old Ruby (&lt; 2.4) for legacy projects, you must do:</p>
<pre><code>pacaur -S openssl-1.0
PKG_CONFIG_PATH=/usr/lib/openssl-1.0/pkgconfig RUBY_EXTRA_CONFIGURE_OPTIONS="--with-openssl-dir=/usr/lib/openssl-1.0" asdf install ruby 2.3.3
</code></pre>
<p>Unfortunately it needs a version of OpenSSL that you should not be using due to security problems. We all moved on to 1.1. But Ruby 2.3.x reached its EOL (end of line). So it's at your own risk to keep using it.</p>
<p>Well, so far so good. Can we install Go as well? Let's see:</p>
<pre><code>asdf plugin-add golang
asdf install golang 1.9.5
asdf global goland 1.9.5
</code></pre>
<p>We can keep going, but I think you got the idea. It just works!</p>
<h3>Background Jobs</h3>
<p>Again, another current limitation of WSL (that we expect to see fixed on the Spring Creators Update) is the ability to start and keep running background jobs (daemons).</p>
<p>Just doing <code>sudo systemctl enable postgresql</code> and restarting won't automatically start Postgresql in the background as it should. This Arch.exe thing we're using won't even have systemd.</p>
<p>Fortunately, servers such as Postgresql or Redis do work normally, they can be started as user-level processes, and they do properly bind to their respective TCP ports. But, you will have to manually start them in every session. Close your Bash terminal and they are all killed off.</p>
<p>For example, Postgresql:</p>
<pre><code>[your_user]# sudo pacman -S postgresql
[your_user]# sudo mkdir -p /run/postgresql
[your_user]# sudo chown -R postgres:postgres /run/postgresql
[your_user]# sudo -u postgres -i
[postgresql]# initdb --locale $LANG -E UTF8 -D '/var/lib/postgres/data'
[postgresql]# pg_ctl -D /var/lib/postgres/data start
waiting for server to start....2018-04-29 23:30:35.483 UTC [1064] LOG:  listening on IPv4 address "127.0.0.1", port 5432
2018-04-29 23:30:35.505 UTC [1064] LOG:  listening on Unix socket "/run/postgresql/.s.PGSQL.5432"
2018-04-29 23:30:35.583 UTC [1065] LOG:  database system was shut down at 2018-04-29 23:23:48 UTC
2018-04-29 23:30:35.660 UTC [1064] LOG:  database system is ready to accept connections
[postgresql]# createuser --interactive
Enter name of role to add: your_user
Shall the new role be a superuser? (y/n) y
[postgresql]# exit
[your_user]#
</code></pre>
<p>See what I did here? There is a small problem in the install under WSL where the <code>/run/postgresql</code> is not created with the correct permissions. Fixing that we can start the server. We can exit out of the <code>su</code> session and the postgresql server will keep running. But when we close the first Bash window/session, it will die.</p>
<p>And another very annoying thing? The <code>mkdir</code> and <code>chown</code> fixes above? I have to do it every single time I close the Bash for Windows app and start it again!! Super duper annoying if you ask me!</p>
<p>But, we can live with it for now. Hopefully, this will be fixed tomorrow (April 30) or in an upcoming upgrade.</p>
<p>In a Rails development environment, we can take advantage of <a href="https://github.com/theforeman/foreman">Foreman</a> to help us out. Just edit some <code>Procfile.dev</code> file:</p>
<pre><code>web: bundle exec puma -C config/puma.rb -p 3000
db: su postgres -c 'pg_ctl start -D /var/lib/postgres/data'
redis: redis-server /usr/local/etc/redis.conf
mailcatcher: mailcatcher -f
</code></pre>
<p>Now we can do: <code>foreman start -f Procfile.dev</code> and all services will start properly at once.</p>
<h3>Real World Performance</h3>
<p>My daily driver is Manjaro GNOME under VMWare Workstation Pro on my Surface Book 2. I give it 6 threads out of the 8 and a hefty 12GB of RAM out of the total 16GB (damn Microsoft, we need more RAM nowadays that the cool kids deploy stupid ass Apps with heavy JS/CSS coating that eats up all available RAM).</p>
<p>In the project I am currently working, my full RSpec suite is a bit on the slow side. For this comparison, I am skipping all my feature specs as I am in no mood to tweak chrome-driver to work in WSL (probably runs, but let's have it another day).</p>
<pre><code>Finished in 12 minutes 8 seconds (files took 14.58 seconds to load)
1493 examples, 0 failures, 35 pending
531,34s user 127,56s system 88% cpu 12:24,99 total
</code></pre>
<p>In this comparable WSL environment, I have just installed, I am running the exact same RSpec suite, and this is what I get:</p>
<pre><code>Finished in 13 minutes 43 seconds (files took 3 minutes 16.8 seconds to load)
1474 examples, 0 failures, 35 pending
455.80s user 399.14s system 83% cpu 17:04.96 total
</code></pre>
<p>For some reason, my WSL environment is skipping a few examples (seems more like an RSpec counter bug of some sort though), but I think this shouldn't pose too much of a difference in the grand scheme of things here. WSL is losing even if the counter is correct and it's running fewer examples.</p>
<p>When we start to really exercise the WSL a whole lot of issues start to show up. For example, PostgreSQL goes crazy and keeps stdout'ing "could not flush dirty data: Function not implemented", which is due to <a href="https://github.com/Microsoft/WSL/issues/645">this documented issue</a> from the WSL! So what ends up happening is that sometimes the RSpec runner just pauses while PG tries to figure out what to do.</p>
<p>You can clearly see that under VMWare files took less than 15 seconds to load. On WSL they took over 3 minutes just on file I/O! It's orders of magnitude slower. This is the bad part. When it's just CPU vs CPU, they are pretty comparable actually.</p>
<p>On paper, the total time is actually quite close. And CPU-wise I think WSL has an edge, which is why it's able to recover in the totals even though the I/O is clearly sluggish.</p>
<p>In practice what happens in a normal programming situation is that you fire up Vim, or any other text editor of your choice. Any programmer has to keep opening files and going back and forth between a lot of files. Now, I/O being super slow, every file you try to open pauses your action for a split second. And this adds up.</p>
<p>Within VMWare, Vim is super responsive, whenever I need to open a file, it's almost instantaneous.</p>
<p>The benchmark may be hard to account for this situation. But in a normal scenario, you will end up annoyed. Moreover, running a GUI over X (VcXsrv in my case) slows things down a bit as well. From within VMWare, the normal Xorg can take advantage of being GPU accelerated. So the entire rasterization pipeline is faster.</p>
<p>You "can" use WSL as your daily driver. But if I can have a smoother experience from within VMWare, that's where I will be for now.</p>
<h3>Conclusion</h3>
<p>I will actually hold my conclusions until tomorrow (April 30) or later this week, because if the Spring Creators Update actually fixes some performance issues. Then I can see myself using this instead of my VMWare Workstation install of Manjaro GNOME.</p>
<p>It may not come in this big update, but I have word that they are working on the outstanding I/O performance issues. So it's right around the corner.</p>
<p>Everything I need just works. Tilix, Vim, Git, Zsh, Ruby, Node.js. Everything installs as expected from Pacman and AUR. Pure Arch Linux glory! So sad the bad performance spoils it.</p>
<p>It's close, it's very close! For the first time in almost 15 years, I can almost see myself returning to 100% Windows (with no VMWare support) and still be able to be fully productive with real, professional, open source tools that "Just Works".</p>
<p>Keep an eye on this blog post for updates this week!</p>
<p></p>
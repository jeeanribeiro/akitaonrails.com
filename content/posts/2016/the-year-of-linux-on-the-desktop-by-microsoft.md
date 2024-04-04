---
title: "The Year of Linux on the Desktop, by Microsoft ??"
date: "2016-04-12T21:33:00.000Z"
tags: ["microsoft", "ubuntu"]
years: "2016"
---

<p></p>
<p>So, it's finally here. I wrote about the announcement at the Build event a few days ago <a href="http://www.akitaonrails.com/2016/03/31/war-is-over-or-is-it-a-new-dawn-for-microsoft">here</a>. Now Microsoft is teasing us a bit more by <a href="http://thehackernews.com/2016/04/how-to-run-ubuntu-on-windows-10.html">releasing the first Insider Build Preview</a>. It is labeled "Build 14316.rs1_release.160402-2217" to be exact, be sure to have this one.</p>
<p>To get it, you must have the following requirements:</p>
<ul>
  <li>Have an activated Windows 10 64-bits</li>
  <li>Sign up for the <a href="https://insider.windows.com/">Windows Insider</a> Program. If it's your first time it can take up to 24 hours to activate</li>
  <li>In your Windows Update Settings, Advanced Options, you must choose to "Get Started" in the Inside option and also choose the "Fast" Ring option. Now, when you Check for Updates, the Preview 14316 should show up. If not, wait until your account is refreshed by Microsoft.</li>
</ul>
<p><a href="https://akitaonrails.s3.amazonaws.com/assets/image_asset/image/538/windows_update_settings.jpg"><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/538/big_windows_update_settings.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/538/windows_update_settings.jpg 2x" alt="windows update settings"></a></p>
<p></p>
<p></p>
<p>You must have, at the very least, 10GB of available space in your main partition, so keep that in mind. Another caveat, if you're like me and you're testing under Virtualbox, also bear in mind that to resize a virtual drive you must delete your snapshots, and the merging process can take a ridiculously long time.</p>
<p>Once it's installed, you must go to the Developer options in the "Update &amp; Security" Control Panel and change your profile to "Developer Mode". This "Bash on Windows" feature will show up under the Windows Features list. It's intended for <strong>developers only</strong> not to be used in production servers.</p>
<p>Once you have the Preview installed you must be able to fire up the old cmd.exe console (or any other better console such as <a href="https://conemu.github.io/">ConEmu</a>) and type in "bash", it will prompt you to now install the userland Canonical packaged for Ubuntu. Takes another while. The whole process take a lot of time, by the way, so make sure you reserve half a day at least. Don't do it at work :-)</p>
<p>One problem I stumbled upon right away is that networking was not working properly. Someone <a href="https://github.com/Microsoft/BashOnWindows/issues/35">narrowed it down</a> to DNS not being added to <tt>/etc/resolv.conf</tt> so you must add it manually. Just add the Google DNS (8.8.8.8 and 8.8.4.4) to the resolv.conf file and you're up.</p>
<p>Finally, you should be inside bash, as a root user. So, if you're a Windows user, you must know right now that it's insecure and an anti-practice to run as root, so don't do it.</p>
<p>The very first thing you <strong>must</strong> do is manually create an unprivileged Linux user and add it to the sudo group as Andrew Malton <a href="https://blog.greenarrow.me/elixir-with-ubuntu-for-windows/">blogged</a> first:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">useradd new_username -m -s /bin/bash <tt>
</tt>passwd new_username<tt>
</tt>usermod -aG sudo new_username<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then you can log into this user shell with <tt>su - [your user]</tt> everytime!</p>
<p>From here, we can assume it's a plain Ubuntu 14.04 and you should be able to follow <a href="https://www.akitaonrails.com/2015/01/28/ruby-e-rails-no-ubuntu-14-04-lts-trusty-tahr">my very old post</a> on how to setup a developer Ubuntu environment, or any other tutorial you can find over Google. These basic development packages that I always install first all run:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install curl build-essential openssl libcurl4-openssl-dev libreadline6 libreadline6-dev curl git-core zlib1g zlib1g-dev libssl-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt-dev libgmp-dev autoconf libc6-dev ncurses-dev automake libtool bison subversion redis-server libhiredis-dev memcached libmemcached-dev imagemagick libmagickwand-dev exuberant-ctags ncurses-term ack-grep git git-svn gitk ssh libssh-dev<tt>
</tt><tt>
</tt>sudo dpkg-divert --local --divert /usr/bin/ack --rename --add /usr/bin/ack-grep<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should give you all compilation toolchain essentials as well as some well known command line tools such as ack (way better than grep). It also adds Redis and Memcached. They all run.</p>
<p>As good practice you should add the following to your <tt>/etc/bash.bashrc</tt> configuration file:</p>
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
<p>And after that you should also configure locale to UTF-8:</p>
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
<p>Just to warm up a little bit, we can start with one of the things that were impossible in Windows: get a stable Ruby installation. For that, RVM is said to not work (as ZSH is also not working for /dev/pts and symlink problems in this preview, see more below). But RBENV is working! You must <a href="https://github.com/rbenv/rbenv">install it</a> first and they the <a href="https://github.com/rbenv/ruby-build#readme">ruby-build</a> plugin:</p>
<p><a href="https://akitaonrails.s3.amazonaws.com/assets/image_asset/image/536/installing_ruby.png"><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/536/big_installing_ruby.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/536/installing_ruby.png 2x" alt="installing ruby through rbenv"></a></p>
<p>Interestingly, it takes a lot of time to complete and during the process CPU usage goes to the roof. Installing Go is even longer! Something is still unstable underneath as it shouldn't take the CPU to 100% for so long.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/537/big_resources.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/537/resources.jpg 2x" alt="CPU through the roof"></p>
<p>If I check how much memory I have in the system it's more clear:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">root@localhost:/mnt/c/Users/fabio# free -h<tt>
</tt>             total       used       free     shared    buffers     cached<tt>
</tt>Mem:          1.0G       342M       664M         0B         0B         0B<tt>
</tt>-/+ buffers/cache:       342M       664M<tt>
</tt>Swap:           0B         0B         0B<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am not sure if this is somehow just a "hard-coded" value for memory as many people are reporting the same "664M" free regardless of what we are running. But something is incomplete here. Swap is also zero and you can't add any as far as I can tell. Swapon, fallocate, none of those work yet.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">root@localhost:/mnt/c/Users/fabio# swapon -s<tt>
</tt>swapon: /proc/swaps: open failed: No such file or directory<tt>
</tt><tt>
</tt>root@localhost:/mnt/c/Users/fabio# fallocate -l 4G swapfile<tt>
</tt>fallocate: swapfile: fallocate failed: Invalid argument<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I actually tried to <a href="https://www.digitalocean.com/community/tutorials/how-to-add-swap-on-ubuntu-14-04">create a swap file</a> using <tt>dd</tt> instead of <tt>fallocate</tt> and add it to the <tt>/etc/fstab</tt> but it didn't work:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">root@localhost:/mnt/c/Users/fabio# free -m<tt>
</tt>             total       used       free     shared    buffers     cached<tt>
</tt>Mem:          1006        342        664          0          0          0<tt>
</tt>-/+ buffers/cache:        342        664<tt>
</tt>Swap:            0          0          0<tt>
</tt><tt>
</tt>root@localhost:/mnt/c/Users/fabio# cat /etc/fstab<tt>
</tt>LABEL=cloudimg-rootfs   /        ext4   defaults        0 0<tt>
</tt>/swapfile       none    swap    sw      0 0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So it sounds like memory is "hard-coded". Follow <a href="https://github.com/Microsoft/BashOnWindows/issues/92">this issue #92</a> if you want to know how it develops out.</p>
<p>But worse than that, shared memory has very low limits and strange behavior. Postgresql will install but won't start up at all:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">root@localhost:/mnt/c/Users/fabio# pg_createcluster 9.3 main --start<tt>
</tt>Creating new cluster 9.3/main ...<tt>
</tt>  config /etc/postgresql/9.3/main<tt>
</tt>  data   /var/lib/postgresql/9.3/main<tt>
</tt>  locale en_US.UTF-8<tt>
</tt>FATAL:  could not create shared memory segment: Invalid argument<tt>
</tt>DETAIL:  Failed system call was shmget(key=1, size=48, 03600).<tt>
</tt>HINT:  This error usually means that PostgreSQL's request for a shared memory segment exceeded your kernel's SHMMAX parameter, or possibly that it is less than your kernel's SHMMIN parameter.<tt>
</tt>        The PostgreSQL documentation contains more information about shared memory configuration.<tt>
</tt>child process exited with exit code 1<tt>
</tt>initdb: removing contents of data directory "/var/lib/postgresql/9.3/main"<tt>
</tt>Error: initdb failed<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And if we try to expand the SHMMAX limit this is what we get:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">root@localhost:/mnt/c/Users/fabio# sysctl -w kernel.shmmax=134217728<tt>
</tt>sysctl: cannot stat /proc/sys/kernel/shmmax: No such file or directory<tt>
</tt><tt>
</tt>root@localhost:/mnt/c/Users/fabio# echo 134217728 &gt;/proc/sys/kernel/shmmax<tt>
</tt>bash: /proc/sys/kernel/shmmax: Operation not permitted<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So, no Postgresql for the time being. Some people were able to complete the Go Lang installation (I gave up after a very very long time waiting for apt-get to finish) complained that Go also crashed on shared memory requirements. Follow the <a href="https://github.com/Microsoft/BashOnWindows/issues/32">Issue #32</a> and <a href="https://github.com/Microsoft/BashOnWindows/issues/146">Issue #146</a> to see if anyone can make it work.</p>
<p>I also tried to install Node.js. No lucky with package installs:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -<tt>
</tt>...<tt>
</tt>E: dpkg was interrupted, you must manually run 'sudo dpkg --configure -a' to correct the problem.<tt>
</tt>Error executing command, exiting<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>NVM installs, sort of, with many errors in git:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>error: unable to create file test/slow/nvm run/Running "nvm run 0.x" should work (No such file or directory)<tt>
</tt>error: unable to create file test/slow/nvm run/Running "nvm run" should pick up .nvmrc version (No such file or directory)<tt>
</tt>error: unable to create file test/slow/nvm use/Running "nvm use iojs" uses latest io.js version (No such file or directory)<tt>
</tt>error: unable to create file test/slow/nvm use/Running "nvm use node" uses latest stable node version (No such file or directory)<tt>
</tt>error: unable to create file test/slow/nvm use/Running "nvm use v1.0.0" uses iojs-v1.0.0 iojs version (No such file or directory)<tt>
</tt>error: unable to create file test/slow/nvm use/Running "nvm use" calls "nvm_die_on_prefix" (No such file or directory)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is what happens if I try to install the most recent version:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">akitaonrails@localhost:~/.nvm$ nvm install 5.10.1<tt>
</tt>Downloading https://nodejs.org/dist/v5.10.1/node-v5.10.1-linux-x64.tar.xz...<tt>
</tt>######################################################################## 100.0%<tt>
</tt>tar: bin/npm: Cannot create symlink to ‘../lib/node_modules/npm/bin/npm-cli.js’: Invalid argument<tt>
</tt>tar: Exiting with failure status due to previous errors<tt>
</tt>Binary download failed, trying source.<tt>
</tt>######################################################################## 100.0%<tt>
</tt>Checksums empty<tt>
</tt>tar: bin/npm: Cannot create symlink to ‘../lib/node_modules/npm/bin/npm-cli.js’: Invalid argument<tt>
</tt>tar: Exiting with failure status due to previous errors<tt>
</tt>Binary download failed, trying source.<tt>
</tt>Detected that you have 1 CPU thread(s)<tt>
</tt>Number of CPU thread(s) less or equal to 2 will have only one job a time for 'make'<tt>
</tt>Installing node v1.0 and greater from source is not currently supported<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p><a href="https://github.com/Microsoft/BashOnWindows/issues/9">Issue #9</a> points to non-implemented symlink support.</p>
<p>Another very annoying thing is the lack of Pseudo-Terminals (/dev/pts), this is possibly one of the reasons ZSH won't work. Follow <a href="https://github.com/Microsoft/BashOnWindows/issues/80">Issue #80</a>.</p>
<p>You should also be able to copy over your SSH private keys to ".ssh" and start git cloning from Github or git push-ing to Heroku in no time.</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">akitaonrails@localhost:~$ ssh-keygen  -t rsa<tt>
</tt>Generating public/private rsa key pair.<tt>
</tt>Created directory '/home/akitaonrails/.ssh'.kitaonrails/.ssh/id_rsa):<tt>
</tt>Enter passphrase (empty for no passphrase):<tt>
</tt>Enter same passphrase again:<tt>
</tt>Your identification has been saved in /home/akitaonrails/.ssh/id_rsa.<tt>
</tt>Your public key has been saved in /home/akitaonrails/.ssh/id_rsa.pub.<tt>
</tt>The key fingerprint is:<tt>
</tt>f8:16:b1:be:85:31:0c:71:f8:c2:d3:72:ab:48:42:9a akitaonrails@localhost<tt>
</tt>The key's randomart image is:<tt>
</tt>+--[ RSA 2048]----+<tt>
</tt>|      ...        |<tt>
</tt>|      .o         |<tt>
</tt>|     ..o.        |<tt>
</tt>|  .   =++o       |<tt>
</tt>| +    .=S.       |<tt>
</tt>|E . .  o.=       |<tt>
</tt>|   o . .= .      |<tt>
</tt>|    . .. o       |<tt>
</tt>|        .        |<tt>
</tt>+-----------------+<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>At least, Elixir does seem to work:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">akitaonrails@localhost:~$ iex<tt>
</tt>Erlang/OTP 18 [erts-7.3] [source-d2a6d81] [64-bit] [async-threads:10] [hipe] [kernel-poll:false]<tt>
</tt><tt>
</tt>Interactive Elixir (1.2.3) - press Ctrl+C to exit (type h() ENTER for help)<tt>
</tt>iex(1)&gt; defmodule HelloWorld do; def say(name) do; IO.puts("Hello #{name}"); end; end<tt>
</tt>iex:1: warning: redefining module HelloWorld<tt>
</tt>{:module, HelloWorld,<tt>
</tt> &lt;&lt;70, 79, 82, 49, 0, 0, 5, 240, 66, 69, 65, 77, 69, 120, 68, 99, 0, 0, 0, 147, 131, 104, 2, 100, 0, 14, 101, 108, 105, 120, 105, 114, 95, 100, 111, 99, 115, 95, 118, 49, 108, 0, 0, 0, 4, 104, 2, ...&gt;&gt;,<tt>
</tt> {:say, 1}}<tt>
</tt>iex(2)&gt; HelloWorld.say("Fabio")<tt>
</tt>Hello Fabio<tt>
</tt>:ok<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Not so fast ...</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">akitaonrails@localhost:~$ mix new ex_test<tt>
</tt>** (ErlangError) erlang error: :terminated<tt>
</tt>    (stdlib) :io.put_chars(#PID&lt;0.25.0&gt;, :unicode, [[[[[[[] | "\e[32m"], "* creating "] | "\e[0m"], ".gitignore"] | "\e[0m"], 10])<tt>
</tt>    (mix) lib/mix/generator.ex:26: Mix.Generator.create_file/3<tt>
</tt>    (mix) lib/mix/tasks/new.ex:76: Mix.Tasks.New.do_generate/4<tt>
</tt>    (elixir) lib/file.ex:1138: File.cd!/2<tt>
</tt>    (mix) lib/mix/cli.ex:58: Mix.CLI.run_task/2<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You will find more information on the pseudo-project Microsoft opened over Github to keep track of <a href="https://github.com/Microsoft/BashOnWindows/issues?q=is%3Aissue+is%3Aclosed">Issues</a> from testers like me. You can follow the list of opened and closed issues there. You will see many things that work, but also many other things that won't work until a new release is available to fix everything I mentioned here.</p>
<h3>Conclusion</h3>
<p>So, is "Bash on Windows" a good development environment for Linux users to have over Windows?</p>
<p>As far as Preview 14316, not yet. The keyword here is "yet". It's shaping up nicely, if they can actually fix all the issues opened so far, it will be very usable very fast.</p>
<p>We need proper memory controls, a well implemented pseudo-terminal support, proper shared memory controls, proper symlinks, proper upstart from Ubuntu so the installed services suchs as Redis or Memcached (which I installed and run) can be properly restarted when I boot the environment (they don't come up if I boot the machine, for example).</p>
<p><a href="https://www.neowin.net/news/bash-plus-windows-10-equals-linux-gui-apps-on-the-windows-desktop">Some people</a> went as far as being able to trick X11 and run GUI apps such as Firefox and even XFCE over this environment already, so it's really promising. This idea does work.</p>
<p>Once those issues are ironed out, yes, I believe we are closer than ever to finally use Windows as a viable and full featured development environment. Let's see if by the Windows 10 Anniversary Release in June we will have a stable Ubuntu installation.</p>
<p>One thing that I think they did very wrong was to tie the Linux Subsystem to the Windows 10 installation. It should've been a separated installer, so the team can release build updates without having to bundle it all together with the entire Windows OS.</p>
<p>If you were intending to move to Windows for your Linux-based developments, not yet. Hold your horses a bit longer.</p>
<p></p>
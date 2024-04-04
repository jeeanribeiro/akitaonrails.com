---
title: "Replacing RVM/Rbenv/Nvm/etc for ASDF"
date: "2017-10-24T16:19:00.000Z"
tags: ["rbenv", "nvm", "ruby", "nodejs", "elixir"]
years: "2017"
---

<p></p>
<p>Many people are using Docker as the means to have different Ruby versions or for any other language. I still think the added overhead both in resources usage and usability friction is simply not worth it. I highly recommend against it. Docker is great as the basis for automated infrastrucutres, but I prefer to have them in servers only.</p>
<p>I've been using <a href="https://github.com/asdf-vm/asdf">asdf</a> as my main Ruby version manager for a long while now and I am confident that I can recommend it in place of the more well recognized RVM or Rbenv.</p>
<p>Moreover, it not only can manage Ruby versions, but it can manage almost all languages you might want. With just one command set. So you don't even need virtualenv for Python or NVM for Node.js. Just use ASDF.</p>
<p>Installing it couldn't be easier. Just follow the <a href="https://github.com/asdf-vm/asdf/blob/master/README.md">README</a> from the project page.</p>
<p></p>
<p></p>
<p>Don't forget to install the base development tools for your environment. You can follow <a href="https://github.com/rbenv/ruby-build/wiki">ruby-build's wiki page</a> for example:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">## For OS X<tt>
</tt># optional, but recommended:<tt>
</tt>brew install openssl libyaml libffi<tt>
</tt><tt>
</tt># required for building Ruby &lt;= 1.9.3-p0:<tt>
</tt>brew tap homebrew/dupes &amp;&amp; brew install apple-gcc42<tt>
</tt><tt>
</tt>## For Ubuntu<tt>
</tt>sudo apt-get install gcc-6 autoconf bison build-essential libssl-dev libyaml-dev libreadline6-dev zlib1g-dev libncurses5-dev libffi-dev libgdbm3 libgdbm-dev<tt>
</tt><tt>
</tt>## For Arch<tt>
</tt>sudo pacman -S --needed gcc5 base-devel libffi libyaml openssl zlib<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then you can install ASDF itself:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.4.0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then add the proper environment configuration for Path and auto-completion.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># For Ubuntu or other linux distros<tt>
</tt>echo -e '\n. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.bashrc<tt>
</tt>echo -e '\n. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.bashrc<tt>
</tt><tt>
</tt># OR for Mac OSX<tt>
</tt>echo -e '\n. $HOME/.asdf/asdf.sh' &gt;&gt; ~/.bash_profile<tt>
</tt>echo -e '\n. $HOME/.asdf/completions/asdf.bash' &gt;&gt; ~/.bash_profile<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, you must install one of the dozens of <a href="https://github.com/asdf-vm/asdf-plugins">plugins</a>. In my case, I have these installed:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf plugin-add clojure https://github.com/vic/asdf-clojure.git<tt>
</tt>asdf plugin-add elixir https://github.com/asdf-vm/asdf-elixir.git<tt>
</tt>asdf plugin-add erlang https://github.com/asdf-vm/asdf-erlang.git<tt>
</tt>asdf plugin-add golang https://github.com/kennyp/asdf-golang.git<tt>
</tt>asdf plugin-add python https://github.com/tuvistavie/asdf-python.git<tt>
</tt>asdf plugin-add ruby https://github.com/asdf-vm/asdf-ruby.git<tt>
</tt><tt>
</tt># Imports Node.js release team's OpenPGP keys to main keyring<tt>
</tt>bash ~/.asdf/plugins/nodejs/bin/import-release-team-keyring<tt>
</tt><tt>
</tt>asdf plugin-add nodejs https://github.com/asdf-vm/asdf-nodejs.git<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can update the plugins all at once with this simple command:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf plugin-update --all<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can see what versions are available for a particular language like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf list-all ruby<tt>
</tt>asdf list-all clojure<tt>
</tt>asdf list-all python<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then you can install any version you need like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf install ruby 2.4.2<tt>
</tt>asdf install nodejs 8.7.0<tt>
</tt>asdf install erlang 20.1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>After you install a particular language version, I always set one as the system default like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf global ruby 2.4.2<tt>
</tt>asdf global elixir 1.5.2<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And in a particular project directory, I can set it to use any other version, just for that project:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf local ruby 2.3.4<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The command above will write a <code>.tool-versions</code> file to the directory you're at when you ran it. It will contain the language and version you chose, so whenever you go back to that directory ASDF will set the correct version for the language you need. The previous <code>asdf global &lt;language&gt;</code> command is actually writing a <code>.tool-versions</code> file to your home directory. The local config override the home directory version.</p>
<p>Another important thing to remember, whenever you install libraries which have executable scripts that need to be in the PATH, you must <strong>reshim</strong> them. For example:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">npm install -g phantomjs # will install phantomjs<tt>
</tt>asdf reshim nodejs # will put the shim for the phantomjs executable in the PATH<tt>
</tt>phantomjs # will properly execute it<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you try to install Ruby versions prior to 2.4 you will find <a href="https://github.com/asdf-vm/asdf-ruby/wiki/Ruby-Installation-Problems">compilation problems</a> as it depends on gcc5 and openssl-1.0. So you should use the following command (assuming you have already installed the obsolete openssl-1.0 and gcc5):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">CC=gcc-5 PKG_CONFIG_PATH=/usr/lib/openssl-1.0/pkgconfig \<tt>
</tt>RUBY_EXTRA_CONFIGURE_OPTIONS="--with-openssl-dir=/usr/lib/openssl-1.0" \<tt>
</tt>asdf install ruby 2.3.4<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sometimes, if a dependency is missing and an install fails, you must manually remove it before attempting to reinstall, so you have to do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf remove &lt;language&gt; &lt;version&gt;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, if you're used to add something to your bash or zsh files to show the current language version in the command line, you're probably using something like <code>rvm-prompt</code>. In the case of ASDF you will need something a bit longer like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">asdf current ruby | awk -F' ' '{print $1}'<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This will get only the version (the <code>asdf current</code> command states which <code>.tool-versions</code> file it is using, so this is a longer result).</p>
<p>Other than that, you're all set. One version manager to rule them all. No more RVM, no more Virtualenv, no more NVM, etc. You can live happily ever after!</p>
<p></p>
---
title: "The Year of Linux on the Desktop - It's Usable!"
date: "2016-07-26T17:13:00.000Z"
tags: ["off-topic"]
years: "2016"
---

<p></p>
<p>07/23/16: coincidentally I posted this review a day before of the final release :-) So the final build is 14393 and <a href="http://arstechnica.com/information-technology/2016/07/windows-10-anniversary-update-is-ready-to-go-and-free-for-just-a-few-more-days/">it's available</a> for free right now!</p>
<p>It's been 3 months since I posted <a href="http://www.akitaonrails.com/2016/04/12/the-year-of-linux-on-the-desktop-by-microsoft">my initial impressions</a> on Windows 10 Anniversary Edition most important feature: Bash on Windows. My conclusion at the time was that it was not ready for prime time yet.</p>
<p>My conclusion as of right now, on July 26th is that it's finally usable enough for web developers, particularly for Ruby developers who always suffered through lack of Windows support.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/543/big_Screen_Shot_2016-07-26_at_13.28.48.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/543/Screen_Shot_2016-07-26_at_13.28.48.png 2x" alt="It's alive!"></p>
<p></p>
<p></p>
<p>Installation process is the same. You must be signed up to the <a href="https://www.howtogeek.com/249966/how-to-install-and-use-the-linux-bash-shell-on-windows-10/">Windows Insider</a> program, wait at least one day if this is your first time. Enable the <strong>Fast ring</strong> of updates, install the Preview edition from normal Windows Update and then turn on the "Windows Subsystem for Linux (Beta)" feature.</p>
<blockquote>
  <p>Last time I was testing Windows 10 over Virtualbox over Ubuntu 14.04 on a Dell Inspiron notebook (8 cores i7 with 16GB of RAM). It was super slow, I don't recommend at all. Now I am back on my trustworthy Macbook Pro 2013 with 16GB of RAM and SSD running VMWare Fusion, and Windows 10 flies here. Super recommended.</p>
</blockquote>
<p>Once you do all that, you can start the "Bash on Ubuntu on Windows" (a mouth full). The first good surprise is that it prompts you to register a new username instead of just falling back to Root. As I said in my previous post, it's good practice to create a new user and add it to the sudoers group, and this is what it does. So you can install packages using "sudo apt-get install".</p>
<p>You should follow my <a href="https://www.akitaonrails.com/2016/04/12/the-year-of-linux-on-the-desktop-by-microsoft">previous post</a> for all the packages and configurations I normally do in a development Linux box.</p>
<p>RVM now works! I was able to install Ruby 2.3.1 through RVM without any problems whatsoever.</p>
<p>I was able to <code>git clone</code> a small Rails project and properly <code>bundle install</code>. All gems were downloaded, native extensions compiled without any flaws.</p>
<p>Somethings still don't work. For example, you won't be able to finish the Postgresql 9.3 installation. It will download and install but the cluster setup fails as you can follow through <a href="https://github.com/Microsoft/BashOnWindows/issues/61">this issue</a> thread.</p>
<p>But you don't need to have <strong>everything</strong> installed under Ubuntu, you can just fallback to the native <a href="https://www.postgresql.org/download/windows/">Postgresql for Windows</a> and edit your <code>config/database.yml</code> to point to server <code>127.0.0.1</code> and port <code>5432</code>. On the Ubuntu side you just need to install <code>libpq-dev</code> so the <code>pg</code> gem can compile its native extensions and that's it.</p>
<p>Smaller services such as Memcached or Redis install properly with <code>apt-get</code> but they won't auto-start through Upstart. But you can start them up manually and use something as <a href="https://github.com/ddollar/foreman">Foreman</a> to control the processes. They both start and work good enough, so you can test caching in your Rails projects and also test Sidekiq workers.</p>
<p>I know that this is still a Preview, so there are bug fixes and possibly some new features that might be included in the final release in August. One nitpick I have is that every command I run with <code>sudo</code> takes a few seconds to start, so it's annoying, but it works in the end.</p>
<p>Node.js 6.3.1 successfully installs and runs. I was able to <code>npm i</code> and <code>node server.js</code> on Openshift's Node <a href="https://github.com/openshift/nodejs-ex">example repository</a>.</p>
<p>Crystal 0.18.7 successfully installs and it was able to properly compile my <a href="https://github.com/akitaonrails/cr_manga_downloadr">Manga Downloader</a> project. It executed my built-in performance test in 15 minutes. Not lightning fast performance but it runs correctly until the end. (And so, yes, Crystal runs on Windows as well now!).</p>
<p>Go 1.6 works. I just did a <code>go get</code> to install Martini and just ran the simple "Hello World" server. Compiles, starts and executes very fast as expected.</p>
<p>Unfortunatelly, Elixir 1.3.1 crashes, I don't know why yet.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ iex<tt>
</tt>Crash dump is being written to: erl_crash.dump...done<tt>
</tt>erl_child_setup closed<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Actually, Erlang itself crashes by just trying to run <code>erl</code>. None of the Elixir tools work as a result. No iex, no mix. The funny thing is that it was working in the initial Preview. So either it's something in the new Preview or something in the newest Erlang releases. There are <a href="https://github.com/Microsoft/BashOnWindows/issues?utf8=%E2%9C%93&amp;q=is%3Aissue%20elixir">open issues</a> regarding this problem, so let's hope it gets fixed soon.</p>
<p><a name="best-windows-dev-env"></a></p>
<h3>"The Best Environment for Rails on Windows"</h3>
<p>I have <a href="https://www.akitaonrails.com/2009/1/13/the-best-environment-for-rails-on-windows">this very old 2009 post</a> to guide developers that are locked on Windows to implement Rails projects. The first advice is to avoid Ruby for Windows. I really commend the efforts of great developers such as Luis Lavena, who invested a lot of time to make it work well enough. But unfortunately the reality is that Ruby is made for Linux environments, it binds to native extensions in C that has lots of dependencies that are not easy to make available on Windows.</p>
<p>So the best option up until now was to install Vagrant (through Virtualbox or, even better, VMWare) as the runtime and use Windows-available editors such as Sublime Text 3 or Atom.</p>
<p>Now you can avoid the Vagrant/virtualization part and directly use "Bash on Ubuntu on Windows". It's so complete that I can even use ZSH and install complex dotfiles such as YADR. You can run Postgresql for Windows and connect to localhost:5432 in your Rails application or any web application that requires Postgresql for example.</p>
<p>You can install ConEmu as a better terminal emulator than the stupidly bad cmd.exe default console. Follow <a href="https://conemu.github.io/en/BashOnWindows.html">this article</a> to get news on its support of Bash on Windows. Right now you have to edit the "Ctrl-V" hotkey to something else ("Ctrl-Shift-V"), arrow keys don't work well om Vim, and you can add a Default Task for Bash like this: <code>%windir%\system32\bash.exe ~ -cur_console:p</code></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/544/big_Screen_Shot_2016-07-28_at_14.13.36.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/544/Screen_Shot_2016-07-28_at_14.13.36.png 2x" alt="Developing Rails on Windows"></p>
<h3>Conclusion</h3>
<p>So, yes, at least from this version I tested (installed on July 25th) this is a <strong>usable</strong> "Bash on Ubuntu on Windows" and web developers from Ruby to Javascript to Crystal to Go can really start testing and trying to make Windows 10 Anniversary their primary platform for serious Linux-based development.</p>
<p>Add Sublime Text or Atom (or Visual Studio, if that's your thing) and you should be good to go. I expect the next releases to fix some of the bugs and performance issues, but compared to what we saw in April, it's a huge improvement.</p>
<p>Kudos to Microsoft for that!</p>
<p>And if you want to know more hardcore details on how the Windows Subsystem for Linux is actually implemented, I recommend this series of blog posts from MSDN itself:</p>
<ul>
  <li><a href="https://blogs.msdn.microsoft.com/wsl/2016/04/22/windows-subsystem-for-linux-overview/">Windows Subsystem for Linux Overview</a></li>
  <li><a href="https://blogs.msdn.microsoft.com/wsl/2016/05/23/pico-process-overview/">Pico Process Overview</a></li>
  <li><a href="https://blogs.msdn.microsoft.com/wsl/2016/06/08/wsl-system-calls/">WSL System Calls</a></li>
  <li><a href="https://blogs.msdn.microsoft.com/wsl/2016/06/15/wsl-file-system-support/">WSL File System Support</a></li>
</ul>
<p></p>
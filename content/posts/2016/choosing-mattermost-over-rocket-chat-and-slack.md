---
title: "Choosing MatterMost over Rocket.chat and Slack"
date: "2016-08-14T01:41:00.000Z"
tags: ["docker", "golang", "rocket.chat", "slack"]
years: "2016"
---

<p></p>
<p>I am a technologist, basically a nerd. So when I obsess over technical stuff, no matter how small, I just can't sleep calmly until I find reasonable closure.</p>
<p>My team, my clients, we've been happily using Slack for more than 2 years, as I believe was true for many teams around the world. Although no one ever complained, I was always annoyed by the small things. First of all, as everything of value, it costs. Either I pay USD 6.67/month/user or I live with the restrictions of the free plan. And as most other teams, I lived with the restrictions for as long as I could.</p>
<p>For example, to get rid of the warnings to upgrade because we hit the upload limits, I created a small tool called <a href="https://github.com/akitaonrails/slack_cleanup">slack_cleanup</a> (first in Elixir, and then in <a href="https://github.com/akitaonrails/cr_slack_cleanup">Crystal</a> just for exercise). This helped for a while.</p>
<p>Our team kept growing, steadily, frequently, as well as clients. The more users we add, the more conversations, the faster we hit the restrictions. History gets lost more frequently, we need to clean up uploads more often. It gets old very fast.</p>
<p>One thing I value above everything is knowledge. As an small example, I myself keep multiple backups for all my emails, all my projects, all my assets that I produced in the last 20 years. Heck, I have a 6 TB, Raid-5, Drobo system right in my home desk and 3 extra 1TB external drives for backup. I've lost very little over the years.</p>
<p>It really annoys me when I lose information.</p>
<ul>
  <li>
    <p>Gmail Business, DropBox, AWS S3 buckets, being external services, don't worry me because I keep copies of everything offline. So if those accounts get busted all of a sudden, I have multiple copies.</p>
  </li>
  <li>
    <p>GitHub annoyed me a bit because although I have multiple copies of the repositories, I would lose all the Pull Request, Issues history. That's one reason I moved to my own GitLab and helped tweak the import process to grab those Pull Request history.</p>
  </li>
  <li>
    <p>Slack annoys me a lot for the aforementioned reasons, which is why last week we tried both MatterMost first, and then we deployed Rocket.chat.</p>
  </li>
</ul>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/558/big_8_13_16__22_20.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/558/8_13_16__22_20.png 2x" alt="Mattermost"></p>
<p></p>
<p></p>
<h3>There, and Back Again</h3>
<p>We moved from Slack to Rocket.chat and a couple of days latter we are moving again, now to Mattermost.</p>
<p>Yes, this was cumbersome. My team was not very happy for leaving Slack. Slack really is slick, full-featured, good-looking, well-rounded, a proper web product for this generation. Any alternative should be at least almost as good-looking, and at least have bug-free features, including webhooks.</p>
<p>Mattermost fits the bill almost perfectly but the open sourced Team Edition lacked one important feature for me: the ability to disallow normal members to rename and/or delete private groups. Yes, we expect grown-ups to behave, but when you have remote teams, remote clients, external users with no commitment to the company, it's a hassle.</p>
<p>Yes, I could and I probably should use the payed Enterprise Edition. But for just that small feature, it felt too expensive. So that triggered me to let it go and install Rocket.chat instead. I moved my entire team there (almost 50 people, because I didn't move the clients yet). That would be the end of the story.</p>
<p>But Rocket.chat has both a complex infrastructure to deal with (you must have at the very least 3 boxes or pay extra for a proper Mongodb SaaS). Actually, <a href="https://www.akitaonrails.com/2016/08/09/moving-away-from-slack-into-rocket-chat-good-enough">in my previous post</a> I explained why you MEAN guys should not be careless dealing with Mongodb. In a nutshell: Mongodb was not meant to run in a single instance, you must have a replica set. If you have a single instance Mongodb, you're doing it wrong.</p>
<p>And the most problematic: the client-side is just too heavy. It frequently spikes out the CPU in not so powerful machines. It's noticeably and measurably slower to navigate in its UI, compared to Slack. MatterMost UI was much faster and way more responsive.</p>
<p>I was almost willing to overlook the lack of a proper test suite. I was willing to try to live with Meteor and CoffeeScript. I was willing to deal with the complex MongoDB maintenance.</p>
<p>But slow responsiviness across many of the members of my team is a no-go, a big show-stopper. We turned the beta videochat feature off (as it always triggers CPU spikes across all users), but many members still had a bad experience with a UI that was too slow and a resource hog.</p>
<p>The React-based, ES6-written, properly structured - with good enough client-side test suites - MatterMost was a more suitable candidate. So I decided to really think about the original problem and I came about with a simple solution: <a href="https://www.akitaonrails.com/2016/08/12/hacking-mattermost-team-edition">add a simple PLPGSQL function</a> to be triggered whenever someone tried to delete a channel. Sure enough, it worked. And that prompted me to call my team again and propose this new change: I believe everybody was on-board as MatterMost was way faster on their machines.</p>
<p>I know I am sounding really harsh towards Rocket.chat, and it's really not my intention. If we didn't have any other options, we would still move to Rocket.chat. But as Mattermost proved to be the better choice, it was a no-brainer.</p>
<h3>MatterMost Install</h3>
<p>As always, I will not bore you with instructions that are already available online. If you want to install everything manually, follow <a href="https://docs.mattermost.com/install/prod-ubuntu.html">this tutorial</a>, but a better option would be <a href="https://docs.mattermost.com/install/prod-docker.html">the Docker-based deployment</a>. You can even install/upgrade it <a href="https://docs.gitlab.com/omnibus/gitlab-mattermost/">together with GitLab</a>.</p>
<p>Make sure you have NGINX in front of the server and that you have both a properly registered domain or sub-domain, and that you have SSL - use Let's Encrypt.</p>
<p>Because I want to keep tweaking and experimenting with the codebase in a live installation, I installed everything manually and I have this directory structure:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">-rw-r--r--  1 mattermost mattermost     6504 Aug 13 20:11 config.json<tt>
</tt>drwxrwxr-x  5 mattermost mattermost     4096 Aug 13 20:30 data<tt>
</tt>lrwxrwxrwx  1 mattermost mattermost       33 Aug 13 20:13 mattermost -&gt; mattermost-team-3.3.0-linux-amd64<tt>
</tt>drwxr-xr-x  9 mattermost mattermost     4096 Aug 13 20:28 mattermost-team-3.2.0-linux-amd64<tt>
</tt>-rw-rw-r--  1 mattermost mattermost 19968308 Jul 14 16:37 mattermost-team-3.2.0-linux-amd64.tar.gz<tt>
</tt>drwxr-xr-x 11 mattermost mattermost     4096 Aug 13 20:28 mattermost-team-3.3.0-linux-amd64<tt>
</tt>-rw-rw-r--  1 mattermost mattermost 20241448 Aug 12 20:41 mattermost-team-3.3.0-linux-amd64.tar.gz<tt>
</tt>drwxrwxr-x  3 mattermost mattermost     4096 Aug 13 20:23 platform-dev-3.3.0<tt>
</tt>-rw-r--r--  1 mattermost mattermost 18060203 Aug 13 20:22 platform-dev.tar.gz<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So I have a restricted, sudo user <code>mattermost</code> and I have a main <code>mattermost</code> directory pointing to the binary packages you will find in the <a href="https://www.mattermost.org/download/">official download page</a>.</p>
<p>Notice that I have a copy of <code>mattermost/config/config.json</code> in the home directory. I leave it there so every time I download a new version and redo the symlink to <code>mattermost</code>, I can just do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rm -Rf ~/mattermost/config/config.json<tt>
</tt>cd ~/mattermost/config<tt>
</tt>ln -s ~/mattermost/config.json<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Also make sure you change at least the following in the config:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>"FileSettings": {<tt>
</tt>    "MaxFileSize": 83886080,<tt>
</tt>    "DriverName": "local",<tt>
</tt>    "Directory": "/home/mattermost/data",<tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you want, you can set file uploads to go to some S3 bucket you have, and just fill in the AWS details. But if you choose to have them locally, change the directory to somewhere outside of the <code>mattermost</code> folder, as in every upgrade you will change the folder. With both AWS EC2 or Digital Ocean you can always choose to add a secondary volume that can outlive the virtual boxes, so even if you get to a point where you have hundreds of concurrent users and you want to scale horizontally, you can have all your boxes pointing to a shared volume (AWS EFS, for example).</p>
<p>Speaking of which, in this configuration, upgrading would be like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo service mattermost stop<tt>
</tt>wget https://releases.mattermost.com/x.y.z/mattermost-team-x.y.z-linux-amd64.tar.gz<tt>
</tt>tar xvfz mattermost-team-x.y.z-linux-amd64.tar.gz<tt>
</tt>mv mattermost mattermost-team-x.y.z-linux-amd64<tt>
</tt>ln -s mattermost-team-x.y.z-linux-amd64 mattermost<tt>
</tt>rm -Rf mattermost/config/config.json<tt>
</tt>rm -Rf mattermost/data<tt>
</tt>cd mattermost/config<tt>
</tt>ln -s ~/config.json<tt>
</tt>cd ..<tt>
</tt>ln -s ~/data<tt>
</tt>sudo service mattermost start<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The reason I wanted to have it this way is because I can tweak the code and manually push the changes.</p>
<p>For your development machine you should follow <a href="https://docs.mattermost.com/developer/developer-setup.html">this instruction</a>. If you're in OS X and you choose to use Docker Toolbox, remember that you don't need VirtualBox anymore as it will use OS X's native hypervisor now. In my machine, I had to add <code>dockerhost</code> manually in my <code>/etc/hosts</code> because <code>boot2docker</code> was failing to get my ip address.</p>
<p>Then you can just clone the code from Github:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mkdir mattermost<tt>
</tt>cd mattermost<tt>
</tt>git clone https://github.com/mattermost/platform<tt>
</tt>git checkout -b v3.3.0 v3.3.0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remember to always checkout the correct stable version (v3.3.0 as of the time when I originally posted this article) that you have installed in your server. Again, I will not bore you with what's already documented in the links above, but you must have Go 1.6(.3), Docker, Docker-Composer, Docker-Machine all installed already.</p>
<p>You can execute <code>make run</code> and after it finishes (and as usual, npm will make sure it takes a very long time) you can open <code>https://localhost:8065</code> to play with it locally.</p>
<p>Most importantly: you can tweak the React JSX components from <code>platform/webapp/components</code>, for example, the <code>channel_header.jsx</code> and add stuff like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#F00;background-color:#FAA">#</span> line <span style="color:#00D;font-weight:bold">493</span> from v3<span style="color:#60E;font-weight:bold">.3</span><span style="color:#60E;font-weight:bold">.0</span><tt>
</tt><span style="color:#080;font-weight:bold">if</span>(isAdmin || isSystemAdmin) {<tt>
</tt>    dropdownContents.push(<tt>
</tt>        <span style="color:#070">&lt;li</span><tt>
</tt>            <span style="color:#007">key</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rename_channel</span><span style="color:#710">'</span></span><tt>
</tt>            <span style="color:#007">role</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">presentation</span><span style="color:#710">'</span></span><tt>
</tt>        <span style="color:#070">&gt;</span><tt>
</tt>            <span style="color:#070">&lt;a</span><tt>
</tt>                <span style="color:#007">role</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">menuitem</span><span style="color:#710">'</span></span><tt>
</tt>                <span style="color:#007">href</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">#</span><span style="color:#710">'</span></span><tt>
</tt>                <span style="color:#007">onClick</span>=<span style="color:#F00;background-color:#FAA">{</span><span style="color:#700">this.showRenameChannelModal</span><span style="color:#F00;background-color:#FAA">}</span><tt>
</tt>            <span style="color:#070">&gt;</span><tt>
</tt>                <span style="color:#070">&lt;FormattedMessage</span><tt>
</tt>                    <span style="color:#007">id</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">channel_header.rename</span><span style="color:#710">'</span></span><tt>
</tt>                    <span style="color:#007">defaultMessage</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">Rename {term}...</span><span style="color:#710">'</span></span><tt>
</tt>                    <span style="color:#007">values</span>=<span style="color:#F00;background-color:#FAA">{</span><span style="color:#F00;background-color:#FAA">{</span><tt>
</tt>                        <span style="color:#700">term:</span> <span style="color:#F00;background-color:#FAA">(</span><span style="color:#007">channelTerm</span><span style="color:#F00;background-color:#FAA">)</span><tt>
</tt>                    <span style="color:#F00;background-color:#FAA">}</span><span style="color:#F00;background-color:#FAA">}</span><tt>
</tt>                <span style="color:#070">/&gt;</span><tt>
</tt>            <span style="color:#070">&lt;/a&gt;</span><tt>
</tt>        <span style="color:#070">&lt;/li&gt;</span><tt>
</tt>    );<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> (!ChannelStore.isDefault(channel)) {<tt>
</tt>        dropdownContents.push(deleteOption);<tt>
</tt>    }<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you know what this will do? Remove the "Rename Group" and "Delete Group" options from the channel menu if the user is not a system admin. Now how do you put this in your server?</p>
<p>First of all, you have to edit the <code>Makefile</code> at this section:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">@# Make osx package<tt>
</tt>@# Copy binary<tt>
</tt>cp $(GOPATH)/bin/darwin_amd64/platform $(DIST_PATH)/bin<tt>
</tt>@# Package<tt>
</tt>tar -C dist -czf $(DIST_PATH)-$(BUILD_TYPE_NAME)-osx-amd64.tar.gz mattermost<tt>
</tt>@# Cleanup<tt>
</tt>rm -f $(DIST_PATH)/bin/platform<tt>
</tt><tt>
</tt>@# Make windows package<tt>
</tt>@# Copy binary<tt>
</tt>cp $(GOPATH)/bin/windows_amd64/platform.exe $(DIST_PATH)/bin<tt>
</tt>@# Package<tt>
</tt>tar -C dist -czf $(DIST_PATH)-$(BUILD_TYPE_NAME)-windows-amd64.tar.gz mattermost<tt>
</tt>@# Cleanup<tt>
</tt>rm -f $(DIST_PATH)/bin/platform.exe<tt>
</tt><tt>
</tt>@# Make linux package<tt>
</tt>@# Copy binary<tt>
</tt>cp $(GOPATH)/bin/platform $(DIST_PATH)/bin<tt>
</tt>@# Package<tt>
</tt>tar -C dist -czf $(DIST_PATH)-$(BUILD_TYPE_NAME)-linux-amd64.tar.gz mattermost<tt>
</tt>@# Don't cleanup linux package so dev machines will have an unziped linux package avalilable<tt>
</tt>@#rm -f $(DIST_PATH)/bin/platform<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice that the developer that made this file is probably using Linux. That's because this file build the Linux-ELF binary as <code>bin/platform</code>, while the OS X Mach-O binary will be at <code>bin/darwin_amd64/platform</code>. Now, if like me you're on OS X, you have to inverse this and make the Linux version point to <code>bin/linux_amd64/platform</code>, otherwise the packages will have the wrong binary.</p>
<p>Then you will notice that there is this section right at the bottom:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">setup-mac:<tt>
</tt>    echo $$(boot2docker ip 2&gt; /dev/null) dockerhost | sudo tee -a /etc/hosts<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you're on the newest versions of Docker-Toolbox, you don't need boot2docker anymore, it will use docker-machine instead. So this line doesn't work and the easiest way to make <code>make test</code> run is to change the <code>dockerhost</code> to <code>localhost</code> in the <code>config/config.json</code>'s PostgreSQL configuration.</p>
<p>If the tests are all passing, you can now run <code>make package</code> to make all packages, then you can send the <code>dist/mattermost-team-edition-linux-amd64.tar.gz</code> to your server and uncompress to the correct location.</p>
<p>As a sidenote for Go noobies like myself, I had my <code>GOPATH</code> pointed to <code>/Users/akitaonrails/.go</code> and my project was at <code>/Users/akitaonrails/codeminer42/mattermost/platform</code>. I was told that this is incorrect and the source of my many hours of frustration. The project MUST BE INSIDE THE GOPATH.</p>
<p>So I changed my <code>GOPATH</code> to <code>/Users/akitaonrails/Sites/go</code> and the project to <code>/Users/akitaonrails/Sites/go/src/github.com/mattermost/platform</code> and now it works. I would probably had symlinked the project path to be inside the GOPATH as well. But now everything compiles and runs just fine.</p>
<p>This is how I will keep experimenting for the time being, until I feel that I am comfortable enough to automate the whole process later. This should work just fine for my team for the time being.</p>
<p>Of course, the snippet above is nothing but a <strong>dirty hack</strong>, don't try to contribute like this. A proper implementation would require me to at least create a new setting into the <code>config.json</code>, for example <code>TeamSettings.MembersCanManageChannel</code> to <code>false</code>, and change the <code>api/context.go</code> around line 347 to be something like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">func (c *<span style="color:#036;font-weight:bold">Context</span>) HasPermissionsToTeam(teamId string, where string) bool {<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> c.IsSystemAdmin() {<tt>
</tt>        <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">true</span><tt>
</tt>    }<tt>
</tt><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> !utils.cfg.<span style="color:#036;font-weight:bold">TeamSettings</span>.<span style="color:#036;font-weight:bold">MembersCanManageChannel</span> {<tt>
</tt>        <span style="color:#080;font-weight:bold">return</span> <span style="color:#038;font-weight:bold">false</span><tt>
</tt>    }<tt>
</tt>    ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then change the <code>webapp/channel_header.jsx</code> component in the React front-end (as well as a proper unit tests to <code>webapp/tests/client_channel.test.jsx</code>), make sure the <code>make test</code> passes, and then finally create a feature request to the core team.</p>
<p>But the idea here was just to show that it was not so difficult to solve the show-stopper for my particular scenario, both using the <a href="https://www.akitaonrails.com/2016/08/12/hacking-mattermost-team-edition">SQL trigger</a> to safeguard the database and the hack to fix the Web UI.</p>
<h3>Conclusion</h3>
<p>But what about the most important feature of all? RightGIF support? There is nothing as simple as a rightgif slack command just yet. Fortunately you can compensate most missing niceties like this by installing a <a href="https://www.npmjs.com/package/hubot-mattermost">Hubot server</a>, and linking it to a user so you can chat with the bot and make it do things for you (set an alarm, fetch a gif, translate text, etc). As a caveat, the hubot adapter requires the use of the <a href="https://github.com/loafoe/mattermost-client">mattermost-client</a> which must be synced with the server platform version releases to work properly, so be careful when you're upgrading.</p>
<p>Overall, Mattermost is a great choice. It's not for amateurs as well, the development environment requires you to know your Docker stuff. It requires you to know proper Go-lang configuration. It requires you to follow <a href="https://docs.mattermost.com/developer/contribution-guide.html">proper procedures to contribute</a>, as they should. The project itself is a single codebase divided into roughly 2 applications, a Go-based HTTP API and a React-based front-end to consume the APIs. Everything about the project is automated through the proper usage of Docker images (for mysql, postgresql, openldap instances) and Makefiles to run the test suite, create packages, etc.</p>
<p>And it has some conveniences from Slack that Rocket.chat doesn't have yet such as a simple shortcut to switch channels (Cmd-K), the ability to reply messages and organize them as threads, proper and more complete Markdown support. Overall, the features are well-rounded, and not half-baked. What is there is solid and works, it's always bad to have half-finished features.</p>
<p>With these hacks in mind I can strongly recommend that you use Mattermost. And as I said in previous posts, it's not just a matter of cost. If you're a small team, without internal developers or someone that can maintain your own installation, you should definitely pay Mattermost for the Enterprise support, it's affordable and way cheaper than Slack.</p>
<p>For now, it's the better choice, both in terms of overall fit-and-finish, well-rounded features, simple and responsive UI, good code quality and overall care on the engineering.</p>
<p></p>
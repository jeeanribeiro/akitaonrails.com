---
title: "Moving away from Slack into Rocket.chat. Good Enough."
date: "2016-08-09T19:21:00.000Z"
tags: ["rocket.chat", "group chats"]
years: "2016"
---

<p></p>
<p>In my quest to create my own private infrastructure I've already moved away from Pivotal Tracker (saving this for a future post), Bitbucket, Github, Travis and into GitLab and GitLab Runner. There are more services I will move away from in the future, so expect more posts like this.</p>
<p>In <a href="http://www.akitaonrails.com/2016/08/03/moving-to-gitlab-yes-it-s-worth-it">my previous post</a> I forgot to mention minimal firewall and SSL configuration, but you can check it here.</p>
<p>One of the most difficult pieces to move away from is Slack. Don't get me wrong, it's a great tool and it gets the job done. The free-tier is really competent but I really want some of the payed features such as history of all conversations with search capabilities and uploads without limit.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/555/big_Franz.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/555/Franz.png 2x" alt="Codeminer Rocket"></p>
<p></p>
<p></p>
<h2>The Cost Conundrum</h2>
<p>But then you have to commit to pay USD 8/month per user (USD 6.67 if you pay ahead of time). If you're a small team (around a dozen people) it's well worth it and you should definitely pay and get over with.</p>
<p>If you have more than 20 people then it starts to become a conundrum. On my GitLab cost calculations, some people argued that saving USD 15k yearly is not such a big deal, and they're not wrong.</p>
<p>If you're from outside of the US coastal cities, specially from countries in South America, Asia where currency can be more than 3 times devalued, than it quickly starts to become a big deal.</p>
<p>Apart from that, we are currently offloading a whole lot of out IPs and knowledge into the care of companies we don't really know and where we don't hold any real stakes.</p>
<p>If you're a medium to big company it really starts to make sense to want to have more control over your own property. Of course, it costs some work and maintenance, so it's not for everybody.</p>
<p>What I will argue is that if you have <strong>150 people</strong> or more, and you're still growing, it's not such a big burden to jump into your own infrastructure.</p>
<blockquote>
  <p>You avoid paying around <a href="https://codeminer42.slack.com/pricing"><strong>USD 12,000 a year</strong></a> or more, and instead you will pay <strong>USD 960 a year</strong> in Digital Ocean boxes and MMS plus a few hours every month in basic maintenance. That's 12 times cheaper.</p>
</blockquote>
<p>Again, you shouldn't do it just for the cost savings as the maintenance burden can easily not be worth it if you or your team are not devops savvy and you don't have anyone to keep monitoring it. For most companies, the conversation history is not so important and even the free-tier will be more than enough.</p>
<p>Cost is less relevant depending on your context, and there are many different uses for group chats. For example, if you're an <a href="https://news.ycombinator.com/item?id=9754626">open source community</a>, you would try <a href="https://gitter.im">Gitter</a> instead.</p>
<p>There are also <a href="https://www.google.com/search?q=slack+alternatives">many other alternatives</a> that you may want to try.</p>
<p>For the sake of this article, let's assume you're a small to medium company, in need of private rooms, many external users (for example, your clients), with at least 50 people. Then this can start to make sense. Any other scenario and we have to analyze it differently.</p>
<h2>Why I chose Rocket.chat</h2>
<p>With the cost reasoning out of the way, then it's a matter of choosing which alternative to use.</p>
<p>I tried <a href="https://www.mattermost.org/">MatterMost</a> first and I really wanted to like it. It has a very similar feature set to Slack and most importantly, it's written in Go. So it's both lightweight, very fast, and not so difficult to contribute. It uses MySQL or PostgreSQL which I like.</p>
<p>Unfortunatelly, it has an important <strong>show-stopper</strong> for my needs. You can create both public channels or private groups, but anyone can delete a private group. If you want permission control for that you must use their <a href="https://about.mattermost.com/pricing/">"Enterprise" offering</a> and pay <strong>USD 20/year per user</strong>.</p>
<blockquote>
  <p>It's still at least <strong>3 times cheaper</strong> than Slack, so it may be a good option for you.</p>
</blockquote>
<p>I really want to have full-control, not just make it cheaper. I could pay Slack already if I didn't care, so I would not just pay an alternative and not have full-control (including the ability to tweak and improve the entire code base).</p>
<p>Then, it took me back to <a href="https://rocket.chat/">Rocket.chat</a>. It's feature set also rivals Slack, it's good looking enough. But, it's made in Meteor. Now, I don't have anything against Meteor and I really think a Slack-clone is exactly the kind of use case where you could use Meteor to its full potential.</p>
<p>Technically I really think it's a downside to be forced to use Mongodb (Meteor requires Mongo). For small installations I really prefer to have PostgreSQL. MongoDB is competent, but for medium to big installations, and I will show you why below.</p>
<p>I <strong>strongly dislike</strong> the <a href="https://medium.com/friendship-dot-js/i-peeked-into-my-node-modules-directory-and-you-wont-believe-what-happened-next-b89f63d21558#.8jd3z3n6u">culture of writing software without <em>minimal care</em></a> such as having a reasonably complete test suite. You browse through the many packages that comprise Rocket.chat and several of them have no tests whatsoever. Some packages do have jasmine tests, but the majority is lacking.</p>
<p>This is <a href="https://github.com/RocketChat/Rocket.Chat/blob/a5cb22bb0017f4c39654bf1e2895ae64acb0339b/packages/rocketchat-katex/tests/jasmine/client/unit/katex.spec.coffee">one example</a> I picked randomly, out of the few test files I found:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">describe <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rocketchat:katex Client</span><span style="color:#710">'</span></span>, -&gt;<tt>
</tt><tt>
</tt>  it <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">should exist</span><span style="color:#710">'</span></span>, -&gt;<tt>
</tt>    expect(RocketChat.katex).toBeDefined()<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is sad, sorry to say that, but it is. Not surprisingly I've seen katex issues while using the interface. And if you think this was just a poor choice, I picked <a href="https://github.com/RocketChat/Rocket.Chat/blob/a5cb22bb0017f4c39654bf1e2895ae64acb0339b/packages/rocketchat-markdown/tests/jasmine/client/unit/markdown.spec.coffee">another test file</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">describe <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rocketchat:markdown Client</span><span style="color:#710">'</span></span>, -&gt;<tt>
</tt><tt>
</tt>  it <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">should exist</span><span style="color:#710">'</span></span>, -&gt;<tt>
</tt>    expect(RocketChat.Markdown).toBeDefined()<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Really?</p>
<p>So, the code itself is not so pretty, you have to keep this in mind. I'd much rather use Mattermost (which is much better structured and with enough tests), but it's not entirely free, so it's not an option to me. For my scenario, I'd rather have sloppy code (that minimally "works") that I can tweak than code I can't see, for this particular venture. Many inexperienced developers may argue about the necessity of having automated tests, but not having them also impacts this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/552/big_Contributors_to_RocketChat_Rocket_Chat.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/552/Contributors_to_RocketChat_Rocket_Chat.png 2x" alt="Rocket.chat contribution graph"></p>
<p>If we see how the project is evolving over time, we can see that interest is diminishing. The lack of good automated tests also make it more difficult for new people to contribute without adding regressions, make contribution reviews more difficult and time consuming.</p>
<p>On the other hand the feature set is good enough as it is. There is only so much you can add to a Slack-clone. The upside is that if the code doesn't change too much, I can tweak it more without having many things breaking all the time. It's the complete opposite from the impressive contribution boost over at GitLab, for example.</p>
<p>Doing a few days of testing through the administration settings, user interface, having dozens of users doing real conversation, convinced me that even though the code quality is bad, the feature set is indeed there. I think I can live with that. Your mileage may vary though.</p>
<p>I am using <a href="https://meetfranz.com">Franz</a> to open Slack, Rocket.chat, Hangouts, Messenger and any number of other communicators in one single app, which is great. And Rocket.chat does provide <a href="https://itunes.apple.com/us/app/rocket.chat/id1028869439?mt=8">mobile</a> <a href="https://play.google.com/store/apps/details?id=com.konecty.rocket.chat&amp;hl=en">apps</a> based off PhoneGap. Again, it's good, not great.</p>
<p>Many people have heavy bots or integrations into their Slack configuration. The alternatives such as Rocket.chat do support incoming and outgoing webhooks and most of the integrations should be possible (with some tweaking and hacking such as this <a href="https://github.com/FinndropStudios/GifRocket">Giphy example</a>), so make a list of all important integrations and do a Google research on that before continuing.</p>
<h2>Planning the Infrastructure</h2>
<p>All that having being said, I'd recommend you try Rocket.chat's <a href="https://demo.rocket.chat">demo server</a> first to see if it has the minimal features you need. And also that you install a dry-run in a small Digital Ocean box with the intention to blow it off later.</p>
<p>For a single-instance, stand-alone installation, temporary dry-run, I recommend you start by installing the <a href="https://www.digitalocean.com/community/tutorials/how-to-use-the-mongodb-one-click-application">MongoDB One-Click Application</a> and follow <a href="https://www.digitalocean.com/community/tutorials/how-to-install-configure-and-deploy-rocket-chat-on-ubuntu-14-04">this instruction</a> to install everything in one machine.</p>
<p>This is the worst possible production environment, which is why I am being so repetitive into saying that you should destroy this box after you do your testing.</p>
<p>As I've said before, I am assuming a scenario where you have 50 or more people, with real clients, important communication going on. You don't want to keep a simple installation like this for production usage.</p>
<p>For a <strong>minimal production installation</strong> you will need at the very least 4 boxes with 1 GB of RAM each. Now, why 4?</p>
<p>This is an important section for most of the beginner Javascript programmers out there playing with the so called "MEAN" stack (MongoDB, Express, Angularjs, Node.js). I've seen people deploy single-instance, stand-alone "MEAN" apps for production usage. And this is super bad.</p>
<blockquote>
  <p><strong>MongoDB is NOT MEANT to function with just one single instance!</strong></p>
</blockquote>
<p>More than that:</p>
<blockquote>
  <p><strong>DO NOT start an even number of MongoDB nodes, or at least install an Arbiter</strong></p>
</blockquote>
<p>So, the minimal setup for MongoDB is a <a href="https://docs.mongodb.com/manual/core/replica-set-architecture-three-members/">Three-member Replica Set</a>, no less!</p>
<p>The article <a href="https://www.rainforestqa.com/blog/2012-11-05-mongodb-gotchas-and-how-to-avoid-them/">"MongoDB Gotchas &amp; How To Avoid Them"</a> is a little bit old but you should be aware of several of the documented gotchas, including adding replica sets and avoid waiting too long to start sharding you data.</p>
<p>The most important part of making Rocket.chat reliable is to make your MongoDB minimally reliable, and this is a hidden cost you must consider.</p>
<h4>Installing a Three-Member Replica Set</h4>
<p>For the sake of this article I will assume that you created 3 (three) MongoDB One-Click Applications on Digital Ocean's at the very least 1 GB RAM boxes (2 GB RAM machines are a good choice if you're in doubt, but never the 512 Mb) and another bare Ubuntu 14.04 box to be the web server. Create all machines in the same sub-region, all of them with private networking and backup enabled.</p>
<p>Take note of the public IPs and private IPs, for the sake of this article let's say you have this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Public IP     Private IP    Hostname<tt>
</tt><tt>
</tt>192.160.10.1  10.0.0.1      mongo1.yourdomain.com<tt>
</tt>192.160.10.2  10.0.0.2      mongo2.yourdomain.com<tt>
</tt>192.160.10.3  10.0.0.3      mongo3.yourdomain.com<tt>
</tt>192.160.10.4  10.0.0.4      yourdomain.com<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In the commands and code snippets below, make sure to replace the fake IPs for your own private IPs.</p>
<p>As I said in <a href="https://www.akitaonrails.com/2016/08/03/moving-to-gitlab-yes-it-s-worth-it?">my GitLab post</a>, create a swap file, configure the locale, set it up for automatic security updates, and do upgrade the Ubuntu packages.</p>
<p>The next first thing: configure the firewall in all machines (assuming <code>ufw</code> package is already installed):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo ufw reset<tt>
</tt>sudo ufw default deny incoming<tt>
</tt>sudo ufw default allow outgoing<tt>
</tt>sudo ufw allow https<tt>
</tt>sudo ufw allow ssh<tt>
</tt>sudo ufw allow in on eth1 to any port 27017<tt>
</tt>sudo ufw enable<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We are allowing MongoDB's 27017 port only for machines in the same private networking (through eth1, the public IP go through eth0). We're also allowing port 22 for SSH and although I am not listing it here in this article you should also consider installing and configuring <a href="https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-14-04">fail2ban</a>. Digital Ocean also has a <a href="https://www.digitalocean.com/community/tutorials/how-to-set-up-a-firewall-with-ufw-on-ubuntu-14-04">good post on UFW</a> for more details.</p>
<p>Next thing to do on the MongoDB machines is to <a href="https://docs.mongodb.com/manual/tutorial/transparent-huge-pages/">Disable Transparent Huge Pages (THP)</a>. For that create a file <code>/etc/init.d/disable-transparent-hugepages</code>, with this content:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">#!/bin/sh<tt>
</tt>### BEGIN INIT INFO<tt>
</tt># Provides:          disable-transparent-hugepages<tt>
</tt># Required-Start:    $local_fs<tt>
</tt># Required-Stop:<tt>
</tt># X-Start-Before:    mongod mongodb-mms-automation-agent<tt>
</tt># Default-Start:     2 3 4 5<tt>
</tt># Default-Stop:      0 1 6<tt>
</tt># Short-Description: Disable Linux transparent huge pages<tt>
</tt># Description:       Disable Linux transparent huge pages, to improve<tt>
</tt>#                    database performance.<tt>
</tt>### END INIT INFO<tt>
</tt><tt>
</tt>case $1 in<tt>
</tt>  start)<tt>
</tt>    if [ -d /sys/kernel/mm/transparent_hugepage ]; then<tt>
</tt>      thp_path=/sys/kernel/mm/transparent_hugepage<tt>
</tt>    elif [ -d /sys/kernel/mm/redhat_transparent_hugepage ]; then<tt>
</tt>      thp_path=/sys/kernel/mm/redhat_transparent_hugepage<tt>
</tt>    else<tt>
</tt>      return 0<tt>
</tt>    fi<tt>
</tt><tt>
</tt>    echo 'never' &gt; ${thp_path}/enabled<tt>
</tt>    echo 'never' &gt; ${thp_path}/defrag<tt>
</tt><tt>
</tt>    unset thp_path<tt>
</tt>    ;;<tt>
</tt>esac<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you can register it as a service:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo chmod 755 /etc/init.d/disable-transparent-hugepages<tt>
</tt>sudo update-rc.d disable-transparent-hugepages defaults<tt>
</tt>sudo /etc/init.d/disable-transparent-hugepages start<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Stop MongoDB in all 3 machines:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo service mongod stop<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now comes a complicated procedure that you should not do wrong. It's only complicated because you have to do it in all 4 machines minding their correct private IP addresses. If you already have your own DNS server, you can skip this, otherwise follow through carefully.</p>
<p>You will have to edit both <code>/etc/hostname</code> and <code>/etc/hosts</code>. Each machine will have a particular name and they should be able to find the other machines by name. Let's start by editing the <code>/etc/hostname</code> on each machine. Use the table in the beginning of this section, for example, in the machine with public IP <code>192.160.10.1</code> you must edit it's hostname to be <code>mongo1.yourdomain.com</code>, and so on for all the machines.</p>
<p>Once you have it done, you have to replace the line <code>127.0.0.1 localhost</code> in the <code>/etc/hosts</code> in each of them for the following:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">127.0.0.1 localhost mongo1.yourdomain.com<tt>
</tt>10.0.0.1 mongo1.yourdomain.com<tt>
</tt>10.0.0.2 mongo2.yourdomain.com<tt>
</tt>10.0.0.3 mongo3.yourdomain.com<tt>
</tt>10.0.0.4 yourdomain.com<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This snippet assumes you're in the machine with private IP <code>10.0.0.1</code>, of course. Make sure you change <code>mongo1.yourdomain.com</code> in the first line for the hostname of the machine you're in. If this is too difficult for you, you definitely should not try to maintain your own infrastructure, so beware.</p>
<p>Finally, let's edit the <code>/etc/mongod.conf</code> with these changes:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">storage:<tt>
</tt>  dbPath: /mongodb-data<tt>
</tt>...<tt>
</tt>net:<tt>
</tt>  port: 27017<tt>
</tt>  bindIp: 0.0.0.0<tt>
</tt>...<tt>
</tt>replication:<tt>
</tt>  replSetName: rs0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should be exactly the same in all machines. And you must create this <code>/mongodb-data</code> directory like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo mkdir /mongodb-data<tt>
</tt>sudo chown -R mongodb:mongodb /mongodb-data<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now go ahead on machine <code>mongo1.yourdomain.com</code>, start up with <code>sudo service mongod start</code> and fire up the <code>mongo</code> command, and you should see something like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># mongo<tt>
</tt>MongoDB shell version: 3.2.8<tt>
</tt>connecting to: test<tt>
</tt>&gt;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Let's now configure the replica set by issuing this command in the MongoDB command-line interface:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rs.initiate()<tt>
</tt>rs.add('mongo2.yourdomain.com')<tt>
</tt>rs.add('mongo3.yourdomain.com')<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you can now log in to the secondary machines and <code>sudo service mongod start</code> in all of them. They should all start joining the replica set and syncing.</p>
<p>You can check the status of the replication like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">&gt; rs.conf()<tt>
</tt><tt>
</tt>{<tt>
</tt>  "set" : "rs0",<tt>
</tt>  "date" : ISODate("2016-08-09T17:33:10.466Z"),<tt>
</tt>  "myState" : 1,<tt>
</tt>  "term" : NumberLong(-1),<tt>
</tt>  "heartbeatIntervalMillis" : NumberLong(2000),<tt>
</tt>  "members" : [<tt>
</tt>    {<tt>
</tt>      "_id" : 1,<tt>
</tt>      "name" : "mongo1.yourdomain.com:27017",<tt>
</tt>      "health" : 1,<tt>
</tt>      "state" : 1,<tt>
</tt>      "stateStr" : "PRIMARY",<tt>
</tt>      "uptime" : 11727,<tt>
</tt>      "optime" : Timestamp(1470763990, 3),<tt>
</tt>      "optimeDate" : ISODate("2016-08-09T17:33:10Z"),<tt>
</tt>      "electionTime" : Timestamp(1470752553, 1),<tt>
</tt>      "electionDate" : ISODate("2016-08-09T14:22:33Z"),<tt>
</tt>      "configVersion" : 6,<tt>
</tt>      "self" : true<tt>
</tt>    },<tt>
</tt>    {<tt>
</tt>      "_id" : 2,<tt>
</tt>      "name" : "mongo2.yourdomain.com:27017",<tt>
</tt>      "health" : 1,<tt>
</tt>      "state" : 2,<tt>
</tt>      "stateStr" : "SECONDARY",<tt>
</tt>      "uptime" : 11693,<tt>
</tt>      "optime" : Timestamp(1470763988, 4),<tt>
</tt>      "optimeDate" : ISODate("2016-08-09T17:33:08Z"),<tt>
</tt>      "lastHeartbeat" : ISODate("2016-08-09T17:33:10.026Z"),<tt>
</tt>      "lastHeartbeatRecv" : ISODate("2016-08-09T17:33:08.887Z"),<tt>
</tt>      "pingMs" : NumberLong(0),<tt>
</tt>      "syncingTo" : "mongo3.yourdomain.com:27017",<tt>
</tt>      "configVersion" : 6<tt>
</tt>    },<tt>
</tt>    {<tt>
</tt>      "_id" : 3,<tt>
</tt>      "name" : "mongo3.yourdomain.com:27017",<tt>
</tt>      "health" : 1,<tt>
</tt>      "state" : 2,<tt>
</tt>      "stateStr" : "SECONDARY",<tt>
</tt>      "uptime" : 11693,<tt>
</tt>      "optime" : Timestamp(1470763988, 4),<tt>
</tt>      "optimeDate" : ISODate("2016-08-09T17:33:08Z"),<tt>
</tt>      "lastHeartbeat" : ISODate("2016-08-09T17:33:09.994Z"),<tt>
</tt>      "lastHeartbeatRecv" : ISODate("2016-08-09T17:33:08.655Z"),<tt>
</tt>      "pingMs" : NumberLong(0),<tt>
</tt>      "syncingTo" : "mongo1.yourdomain.com:27017",<tt>
</tt>      "configVersion" : 6<tt>
</tt>    }<tt>
</tt>  ],<tt>
</tt>  "ok" : 1<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Each box should be syncing data to another box, one of them will be marked "PRIMARY" and the others will be "SECONDARY". If one of them "dies" for some reason, one of the others will be elected as PRIMARY until you add a replacement box. Read more details on this procedure in <a href="https://www.digitalocean.com/community/tutorials/how-to-implement-replication-sets-in-mongodb-on-an-ubuntu-vps">Digital Ocean's post about implementing replication sets</a>.</p>
<h4>Adding your MongoDB environment to MMS</h4>
<p>Another thing beginners will not realise is that it's a good idea to monitor your services. At the very least you should install MongoDB Cloud Manager agents into your servers. Just set up an account at <a href="https://www.mongodb.com/cloud">MongoDB Atlas</a>.</p>
<p>It's beyond the point of this article to explain Atlas, but you should have no trouble installing the agents with the Group ID and API Key provided. Then install the monitoring agent and have the Manager figure out your existing deployment and replica set.</p>
<p>The basic subscription for monitoring will cost you an extra USD 39 a month, but believe me when I say it's worth to add all your MongoDB deployments under MMS.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/553/big_Deployment___Cloud_Manager__MongoDB_Cloud_Manager.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/553/Deployment___Cloud_Manager__MongoDB_Cloud_Manager.png 2x" alt="MMS"></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/554/big_Host___Cloud_Manager__MongoDB_Cloud_Manager.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/554/Host___Cloud_Manager__MongoDB_Cloud_Manager.png 2x" alt="Replica Set Graphs"></p>
<h4>Installing a multi-instance Node.js service</h4>
<p>Another mistake beginners in the MEAN stack do is to start up a single Node.js instance. Yes, Node.js asynchronous I/O nature makes it "concurrent enough" in 1 single thread. But you do want to maximize the rented machine so you should spin up at least one Node.js instance for each CPU core. A 1 GB RAM machine has just 1 core, but you can spin up at least 2 instances.</p>
<p>First of all, we must set up the <code>yourdomain.com</code> (<code>192.160.10.4</code> or <code>10.0.0.4</code> in the example) to support Node.js, let's do it:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install -y npm curl graphicsmagick nginx git bc<tt>
</tt>sudo npm install -g n<tt>
</tt>sudo npm install -g forever<tt>
</tt>sudo npm install -g forever-service<tt>
</tt>sudo n 0.10.40<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you haven't already, <a href="https://www.digitalocean.com/community/tutorials/how-to-create-a-sudo-user-on-ubuntu-quickstart">create a more restricted sudo user</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">adduser rocket # add a password when asked<tt>
</tt>usermod -aG sudo rocket<tt>
</tt>su - rocket # and always ssh in with `ssh rocket@yourdomain.com`<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Within rocket's home directory let's install the Rocket.chat codebase:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cd /home/rocket<tt>
</tt>curl -L https://rocket.chat/releases/latest/download -o rocket.chat.tgz<tt>
</tt>tar zxvf rocket.chat.tgz<tt>
</tt>mv bundle Rocket.Chat<tt>
</tt>cd Rocket.Chat/programs/server<tt>
</tt>npm install<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now let's add a way for the machine to start the Rocket.chat whenever it reboots:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">cd ~/Rocket.Chat<tt>
</tt>sudo forever-service install -s main.js -e "ROOT_URL=https://rocketchat42.com/ MONGO_URL=mongodb://mongo1.yourdomain.com:27017/rocketchat MONGO_OPLOG_URL=mongodb://mongo1.yourdomain.com:27017/local PORT=3001" rocketchat1<tt>
</tt>sudo forever-service install -s main.js -e "ROOT_URL=https://rocketchat42.com/ MONGO_URL=mongodb://mongo1.yourdomain.com:27017/rocketchat MONGO_OPLOG_URL=mongodb://mongo1.yourdomain.com:27017/local PORT=3002" rocketchat2<tt>
</tt><tt>
</tt>sudo start rocketchat1<tt>
</tt>sudo start rocketchat2<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Let's also create SSL certificates (and for that you must have a properly registered domain, of course). Again, <a href="https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04">Digital Ocean's documentation on Let's Encrypt</a> is very good. In summary, all you have to do is:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo git clone https://github.com/letsencrypt/letsencrypt /opt/letsencrypt<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now edit the <code>/etc/nginx/sites-available/default</code> and add this inside the server block:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">server {<tt>
</tt>  ...<tt>
</tt>  location ~ /.well-known {<tt>
</tt>          allow all;<tt>
</tt>  }<tt>
</tt>  ...<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you can:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo service nginx reload<tt>
</tt><tt>
</tt>sudo openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048<tt>
</tt><tt>
</tt>cd /opt/letsencrypt<tt>
</tt>./letsencrypt-auto certonly -a webroot --webroot-path=/usr/share/nginx/html -d yourdomain.com -d www.yourdomain.com<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, replace <code>yourdomain.com</code> with your own registered domain, of course. The <code>letsencrypt</code> command will prompt you to enter your e-mail address and accept terms of service.</p>
<p><a href="https://letsencrypt.org/">Let's Encrypt</a> is a fantastic free SSL provider. Their certificates are short lived and are meant to expire in 90 days, so you must set up auto-renewal. Start <code>sudo crontab -e</code> and add the following lines:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">30 2 * * 1 /opt/letsencrypt/letsencrypt-auto renew &gt;&gt; /var/log/le-renew.log<tt>
</tt>35 2 * * 1 /etc/init.d/nginx reload<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should take care of SSL. Now you can edit your <code>/etc/nginx/sites-available/default</code> and replace it with this template:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># Upstreams<tt>
</tt>upstream backend {<tt>
</tt>    server 127.0.0.1:3001;<tt>
</tt>    server 127.0.0.1:3002;<tt>
</tt>}<tt>
</tt><tt>
</tt>server {<tt>
</tt>  listen 443 ssl;<tt>
</tt><tt>
</tt>  server_name yourdomain.com;<tt>
</tt><tt>
</tt>  ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;<tt>
</tt>  ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;<tt>
</tt><tt>
</tt>  ssl_protocols TLSv1 TLSv1.1 TLSv1.2;<tt>
</tt>  ssl_prefer_server_ciphers on;<tt>
</tt>  ssl_dhparam /etc/ssl/certs/dhparam.pem;<tt>
</tt>  ssl_ciphers 'ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA';<tt>
</tt>  ssl_session_timeout 1d;<tt>
</tt>  ssl_session_cache shared:SSL:50m;<tt>
</tt>  ssl_stapling on;<tt>
</tt>  ssl_stapling_verify on;<tt>
</tt>  add_header Strict-Transport-Security max-age=15768000;<tt>
</tt><tt>
</tt>  location / {<tt>
</tt>    proxy_pass https://backend;<tt>
</tt>    proxy_http_version 1.1;<tt>
</tt>    proxy_set_header Upgrade $http_upgrade;<tt>
</tt>    proxy_set_header Connection "upgrade";<tt>
</tt>    proxy_set_header Host $http_host;<tt>
</tt><tt>
</tt>    proxy_set_header X-Real-IP $remote_addr;<tt>
</tt>    proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;<tt>
</tt>    proxy_set_header X-Forward-Proto http;<tt>
</tt>    proxy_set_header X-Nginx-Proxy true;<tt>
</tt><tt>
</tt>    proxy_redirect off;<tt>
</tt>  }<tt>
</tt><tt>
</tt>}<tt>
</tt><tt>
</tt>server {<tt>
</tt>  listen 80;<tt>
</tt>  server_name yourdomain.com www.yourdomain.com;<tt>
</tt>  return 301 https://$host$request_uri;<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Just for the sake of completeness, again: replace <code>yourdomain.com</code> for your domain. Usually the <code>/etc/nginx/sites-enabled/default</code> is a symlink to <code>/etc/nginx/sites-available/default</code>, just check that as well. This configuration will load balance between the 2 node.js instances we configured and started before. And you can add as many as you want following the same <code>forever-install</code> procedure and adding the new instances to the <code>upstream</code> section in the nginx configuration above.</p>
<p>If everything is correct, you can restart nginx again: <code>sudo service nginx restart</code>.</p>
<p>And now you should have <code>https://yourdomain.com</code> already up and running. The first user that sign up will be the site administrator and from there you can customize Rocket.chat internally.</p>
<h2>Conclusion</h2>
<p>As you can see, this is not a simple procedure to follow and I am assuming you have experience managing your own infrastructure. If you don't you definitely should NOT do this by yourself.</p>
<p>If you do it correctly, you should have a functional Slack-clone with minimal reliability (thanks in large part to Digital Ocean) and minimal cost (USD 80/month in the configuration I described that should be enough for more than a 100 users). Rocket.chat also offer more <a href="https://rocket.chat/docs/installation/">documentation</a> for other environments including Docker configurations you might want to try. But the procedure above is sufficient for my needs.</p>
<p>I said it already but it's better to repeat it: don't fall for the trap of installing everything in a single box, with single instance MongoDB, and without proper monitoring. It's asking for trouble.</p>
<p>For now I am in the middle of the roll out. All developers in my company are already in the new deployment and soon half of the clients should also migrate (some will not be able to leave Slack just yet), but with Franz and the ability of full history and searchability this shoudn't be a concern even if a developer stays offline for some period of time.</p>
<p>I also don't advocate that everybody should be online and responding in real-time. It's unfeasible, unproductive, creates unnecessary tension. People should participate when they have free time, and they should be able to concentrate without worrying that they are missing something. That's why they should opt-out of being notified in the more busy channels and just enable notification on the private groups that matter.</p>
<p>Coincidentally Jason Fried just posted about concerns over group chats at <a href="https://m.signalvnoise.com/is-group-chat-making-you-sweat-744659addf7d#.3qxe09una">Signal v. Noise</a>, but the gist is that group chat should be purposeful not yet another tool to create tension. People should definitelly get offline when they need to fully concentrate in their work and have the opportunity to catch up with interesting conversations later. And really important communication should go through e-mail or other tradicional ways, a simple <code>@all</code> don't cut it for company-wide announcements for example.</p>
<p>I hope this exercise gives you more perspective on what you can have and also raise awareness on the need for companies to regain more control over their own data, particularly knowledge. Erase your communication channels and you're losing years-worth of knowledge that can be invaluable.</p>
<p></p>
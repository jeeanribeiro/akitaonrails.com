---
title: "[Discussion] Can we protect our work from DNS providers suffering DDoS attacks?"
date: "2016-10-31T17:00:00.000Z"
tags: ["ddos", "devops", "whitehat"]
years: "2016"
---

<p></p>
<p>A few days ago we witnessed a coordinated <a href="https://dyn.com/blog/dyn-statement-on-10212016-ddos-attack/">DNS amplification attack</a> against Dyn DNS. There are many problems along the way, a lot of <a href="https://threatpost.com/mirai-fueled-iot-botnet-behind-ddos-attacks-on-dns-providers/121475/">blaming</a>, and lot of <a href="http://dyn.com/blog/ddos-attacks-bcp38-internet-security-cloudflare-downtime-managed-dns-open-recursives/">possible solutions</a>.</p>
<p>Bottomline is that attacks like this will probably <a href="https://github.com/emc-advanced-dev/unik/wiki/Worried-about-IoT-DDoS%3F-Think-Unikernels">happen again, more often</a>. The more poorly managed online devices (IoT) we add to the network, the more open recursive DNS servers around, and the more blackhat hackers learn how easy it is to run attacks like this, the worse it will become.</p>
<p>Now, how does one mitigate this kind of problem?</p>
<p></p>
<p></p>
<p>What I will suggest now is not the be-all and end-all sollution. As a disclaimer, I am neither a whitehat hacker nor fully experienced systems administrator. If you are, please by all means let me know in the comments section below if what I am saying is total busted or if it actually works the way I am describing.</p>
<p>I have a small company where up to a 100 people work everyday, either as software developers or performing administrative back-office work. We need access to a number of services such as GitHub, CodeClimate, Google Apps, Dropbox, and a number of internal services such as GitLab, Mattermost and so on.</p>
<p>When the DynDNS attack happened, we had some problems for a few hours. We didn't went total dark, though.</p>
<p>Some of the internal services we use were not affected because the authoritative DNS was not DynDNS. So our internal chat app, Mattermost, for example, remained responsive and online. The same for GitLab. So we didn't stop all our work duties. But some of our projects in GitHub and deployments over Heroku became compromised.</p>
<p>So this is the mitigation plan I am testing: installing my own DNS recursive/forwarder server. I want to forward all DNS queries to some public recursive DNS such as Google (8.8.8.8) or OpenDNS (208.69.38.170) and cache the results for more time than the TTL that returns from the query.</p>
<p>If you're not aware, every time you perform a DNS lookup, it returns the IP address for a given name (for example, 50.19.85.154, 50.19.85.156, and 50.19.85.132 for heroku.com) and a <strong>Time To Live</strong> (for example, 28 seconds when I ran <code>dig</code> against heroku.com).</p>
<p>It means that for that window of 28 seconds any other DNS lookup can rely on the IP addresses provided without having to run the queries against the DNS servers again (caching).</p>
<p>After the TTL expires, I should query again to see if the IP addresses did change. TTLs are usually small so the administrators of the services can freely move and decomission servers at least after a certain small window (TTL) and be sure that almost everybody will see new IP addresses when the TTL expires. On the other hand, the small the TTL, the more DNS traffic we all need to keep re-checking addresses all the time.</p>
<p>In practice I belive most services are stable enough to not be changing servers all the time. They do, eventually, for maintenance or even scalability purposes, but I believe it's "rare".</p>
<p>Actually, I believe that if I had my own DNS server, caching DNS results and overriding the TTLs from 60 seconds/15 minutes to a larger extent (let's say, 1 full day) before expiring and requiring a new query, we would have passed through that DDoS episode without noticing it.</p>
<p>In fact, I manually inserted GitHub web address in my local <code>/etc/hosts</code> file and I was able to browse through GitHub in the midst of the DDoS attacks.</p>
<p>For most people, that whole apocalyptic episode felt like "the internet fell", but in reality only the authoritative DynDNS servers went down and every other recursive DNS, obeying the TTLs also failed to get responses.</p>
<p>The cascading effect was that we were just unable to translate domain name queries such as spotify.com or heroku.com into their static IP addresses. But if we had those addresses in local caches, we wouldn't feel it because Spotify's, ZenDesk's, Heroku's servers were all online and fine.</p>
<p>It's different than when <a href="https://www.theregister.co.uk/2016/06/05/aws_oz_downed_by_weather/">AWS's Sydney data center suffered an outage</a>. That's way more rare and I've seen it happen just once every couple of years.</p>
<h3>Unbound</h3>
<p>I was going to install BIND9 in an AWS EC2 t2.micro machine. But I've read that it's probably overkill if I am not interested in setting up an authoritative server. Whatsmore, I can't set a minimum TTL in BIND if I am not mistaken.</p>
<p>So the other simpler option is <a href="https://unbound.net/index.html">Unbound</a>. It's a simple <code>apt-get install unbound</code> away.</p>
<p>Configuration is super easy as well, I just added this:</p>
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
</tt>57<tt>
</tt>58<tt>
</tt>59<tt>
</tt><strong>60</strong><tt>
</tt>61<tt>
</tt>62<tt>
</tt>63<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">server:<tt>
</tt>  interface: 0.0.0.0<tt>
</tt>  do-ip4: yes<tt>
</tt>  do-ip6: yes<tt>
</tt>  do-udp: yes<tt>
</tt>  do-tcp: yes<tt>
</tt>  do-daemonize: yes<tt>
</tt>  # access-control: 0.0.0.0/0 allow<tt>
</tt>  access-control: &lt;your public IP&gt;/8 allow<tt>
</tt>  access-control: &lt;your public IP&gt;/8 allow<tt>
</tt><tt>
</tt>  # Use all threads (roughly the same number of available cores)<tt>
</tt>  num-threads: 4<tt>
</tt><tt>
</tt>  # 2^{number_of_threads}<tt>
</tt>  msg-cache-slabs: 16<tt>
</tt>  rrset-cache-slabs: 16<tt>
</tt>  infra-cache-slabs: 16<tt>
</tt>  key-cache-slabs: 16<tt>
</tt><tt>
</tt>  # More cache memory (this is per thread, if I am not mistaken)<tt>
</tt>  rrset-cache-size: 150m<tt>
</tt>  msg-cache-size: 75m<tt>
</tt><tt>
</tt>  # More outgoing connections<tt>
</tt>  # Depends on number of threads<tt>
</tt>  outgoing-range: 206 # &lt;(1024/threads)-50&gt;<tt>
</tt>  num-queries-per-thread: 128 # &lt;(1024/threads)/2&gt;<tt>
</tt><tt>
</tt>  # Larger socket buffer<tt>
</tt>  so-rcvbuf: 4m<tt>
</tt>  so-sndbuf: 4m<tt>
</tt><tt>
</tt>  # Faster UDP with multithreading (only on Linux)<tt>
</tt>  so-reuseport: yes<tt>
</tt><tt>
</tt>  # cache for at least 1 day<tt>
</tt>  cache-min-ttl: 172800<tt>
</tt><tt>
</tt>  # cache for at most 1.5 day<tt>
</tt>  cache-max-ttl: 259200<tt>
</tt><tt>
</tt>  # security<tt>
</tt>  hide-identity: yes<tt>
</tt>  hide-version: yes<tt>
</tt>  harden-short-bufsize: yes<tt>
</tt>  harden-large-queries: yes<tt>
</tt>  harden-glue: yes<tt>
</tt>  harden-dnssec-stripped: yes<tt>
</tt>  harden-below-nxdomain: yes<tt>
</tt>  harden-referral-path: yes<tt>
</tt>  use-caps-for-id: yes<tt>
</tt><tt>
</tt>  use-syslog: yes<tt>
</tt><tt>
</tt>  python:<tt>
</tt>    remote-control:<tt>
</tt>            control-enable: no<tt>
</tt><tt>
</tt>  forward-zone:<tt>
</tt>    name: "."<tt>
</tt>    forward-addr: 8.8.8.8<tt>
</tt>    forward-addr: 8.8.4.4<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Replace the <code>&lt;your public IP&gt;</code> for whatever IP you get when you Google for "what's my IP", it's better to whitelist every IP you want to enable access to query this server.</p>
<p>Unbound comes pre-configured for DNSSEC and it seems to work out of the box (or at least this is what <a href="https://dnssec.vs.uni-due.de/">this test</a> says).</p>
<p>In my "enterprise" ISP account I have a static IP address and I can set my Airport Extreme and add my new DNS server IP address and all clients connecting there receives the new DNS automatically.</p>
<p>In my inexpensive backup ISP account (your usual DSL or Cable internet service), it doesn't have a static IP so I have to use the ISP's DHCP and NAT and enable "Bridge Mode" on the router. In that case I can't have a secondary DHCP turned on to set up the DNS automatically on the clients, so I have to add it manually in my notebook's network configuraton.</p>
<p>Anyway, one immediate advantage of setting up my own DNS server is that response times are much faster as I chose a data center very close to me, geographically. So instead of the usual 60ms from Google'S DNS I get less than 30ms in average now (not a dramatic improvement, but somewhat noticeable in web browsing).</p>
<p>The disadvantage is that a recursive DNS should obey the protocol and use the authoritative TTL, never overriding. But as I am using it only for whitelisted IPs within my own organization, I belive that with an occasional manual flush, I should be ok most of the time.</p>
<p>This is not a 100% guarantee that we will not suffer anything in case of another DDoS episode like we had, because not all domain names will be cached in this local DNS server. But the ones we use the most probably will be, particularly essential services such as access to GitHub or Heroku or ZenDesk.</p>
<p>With this new DNS "caching" system all my queries will return and be cached with a larger TTL, for example:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ dig heroku.com<tt>
</tt><tt>
</tt>; &lt;&lt;&gt;&gt; DiG 9.8.3-P1 &lt;&lt;&gt;&gt; heroku.com<tt>
</tt>;; global options: +cmd<tt>
</tt>;; Got answer:<tt>
</tt>;; -&gt;&gt;HEADER&lt;&lt;- opcode: QUERY, status: NOERROR, id: 34732<tt>
</tt>;; flags: qr rd ra; QUERY: 1, ANSWER: 3, AUTHORITY: 0, ADDITIONAL: 0<tt>
</tt><tt>
</tt>;; QUESTION SECTION:<tt>
</tt>;heroku.com.      IN  A<tt>
</tt><tt>
</tt>;; ANSWER SECTION:<tt>
</tt>heroku.com.   172800  IN  A 50.19.85.156<tt>
</tt>heroku.com.   172800  IN  A 50.19.85.132<tt>
</tt>heroku.com.   172800  IN  A 50.19.85.154<tt>
</tt><tt>
</tt>;; Query time: 357 msec<tt>
</tt>;; SERVER: xx.xx.xx.xx#53(xx.xx.xx.xx)<tt>
</tt>;; WHEN: Mon Oct 31 15:07:37 2016<tt>
</tt>;; MSG SIZE  rcvd: 76<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I'm obfuscating my DNS IP, of course. The important bit is that you can see that my DNS is returning a TTL of <strong>172800 seconds</strong> now. My local notebook cache should keep it that long now as well.</p>
<p>And now my organization should (possibly) be protected against another DNS DDoS attack like we had with Dyn DNS. Zerigo already went through that. SimpleDNS already went through that. Who knows which one will suffer next, maybe all of them again.</p>
<p>As I said before, I am not 100% sure this is a good mitigation. We will see if it works on the next Mirai attack. And a final <strong>BIG DISCLAIMER</strong>:</p>
<blockquote>
  <p>EVERY DNS recursive server MUST obey the authoritative TTL!! TTLs exist for many important reasons, so if you manage a publicly available DNS server, you MUST NOT override the TTL with a minimum cache time like I did. Make sure you know what you're doing!</p>
</blockquote>
<p>Are you an experienced whitehat hacker? Let me know if there's something easier/more secure. The goal is not to fix the internet, just to protect the productivity of my tiny organization.</p>
<p></p>
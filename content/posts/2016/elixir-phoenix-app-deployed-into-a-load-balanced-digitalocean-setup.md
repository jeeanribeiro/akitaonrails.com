---
title: "Elixir Phoenix App deployed into a Load Balanced DigitalOcean setup"
date: "2016-12-23T17:07:00.000Z"
tags: ["phoenix", "deployment", "edeliver", "digitalocean", "websockets"]
years: "2016"
---

<p></p>
<p>One of the main advantages of building a Websockets enabled web application using Phoenix is how "easy" it is for Erlang to connect itself into a cluster.</p>
<p>For starters, Erlang does not need multiple processes like Ruby (which is limited to one connection per process, or per thread if you're using a threaded-server like Puma). One single Erlang process will take over the entire machine, if you need to. Internally it will keep one real thread per machine-core. And each thread will have its own Scheduler to manage as many micro-processes as you need. You can read all about it in my post titled <a href="http://www.akitaonrails.com/2015/11/25/yocto-services-and-my-first-month-with-elixir">"Yocto Services"</a>.</p>
<p>Moreover, Erlang has built-in capabilities to form a cluster, where each Erlang instance acts as a peer-to-peer Node, without the need for a centralized coordinator. You can read all about it in my post about <a href="http://www.akitaonrails.com/2015/11/25/exmessenger-exercise-understanding-nodes-in-elixir">Nodes</a>. The power of Erlang is in how "easy" it is to form reliable distributed systems.</p>
<p>You can fire up many Phoenix instances and from one of the instances, it can broadcast messages to Users subscribed in Channels even if their sockets are connected to different instances. It's seamless and you don't need to do anything special in your code. Phoenix, Elixir and Erlang are doing all the heavy lifting for you behind the scenes.</p>
<p></p>
<p></p>
<h3>No Heroku for You :-(</h3>
<p>Because you want to take advantage of this scalability and high availability feature for distributed systems (in the small example of a real-time chat system) you will need to have more control over your infrastructure. This requirement rules out the majority of Platform as a Service (PaaS) offerings out there, such as Heroku. Heroku's model revolves around single, volatile processes in isolated containers. Those jailed processes (dynos) are not aware of other processes or the internal networking, so you can't fire up Dynos and have them form a cluster because they won't be able to find each other.</p>
<p>If you already know how to configure Linux related stuff: Postgresql, HAproxy, etc, go ahead directly to the <a href="#phoenix-setup">Phoenix-specific section</a>.</p>
<h3>IaaS (DigitalOcean) to the rescue!</h3>
<p>You want long lived processes in network reachable servers (either through private networking, VPN, or plain simple - insecure! - public networks).</p>
<p>In this example I want to walk you through a very simple deployment using DigitalOcean (you can choose any IaaS, such as AWS, Google Cloud, Azure or whatever you feel more comfortable with).</p>
<p>I have created 4 droplets (all using the smallest size of 512Mb of RAM):</p>
<ul>
  <li>1 Postgresql database (single point of failure: it's not the focus of this article to build a highly available, replicated database setup);</li>
  <li>1 HAProxy server (single point of failure: again, it's not the focus to create a highly available load balancing scheme);</li>
  <li>2 Phoenix servers - one in the NYC datacenter and another in the London datacenter, to demonstrate how easy it is for Erlang to form clusters even with geographically separated boxes.</li>
</ul>
<h3>Basic Ubuntu 16.04 configuration</h3>
<ul>
  <li>Goals: configure locale, assure unattended updates are up, upgrade packages, install and configure Elixir and Node.</li>
  <li>You should also do: change SSH to another port and install [fail2ban](https://www.digitalocean.com/community/tutorials/how-to-protect-ssh-with-fail2ban-on-ubuntu-14-04, disallow login through password.</li>
</ul>
<p>You will want to read my post about <a href="https://www.akitaonrails.com/2016/09/21/ubuntu-16-04-lts-xenial-on-vagrant-on-vmware-fusion">configuring Ubuntu 16.04</a>. To summarize, start by configuring proper UTF-8:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo locale-gen "en_US.UTF-8"<tt>
</tt>sudo dpkg-reconfigure locales<tt>
</tt>sudo update-locale LC_ALL=en_US.UTF-8 LANG=en_US.UTF-8<tt>
</tt>echo 'LC_ALL=en_US.UTF-8' | sudo tee -a /etc/environment<tt>
</tt>echo 'LANG=en_US.UTF-8' | sudo tee -a /etc/environment<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Make sure you add a proper user into the sudo group and from now on do not use the root user. I will create a user named <code>pusher</code> and I will explain in another post why. You should create a username that suits your application.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">adduser pusher<tt>
</tt>usermod -aG sudo pusher<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now log out and log in again through this user. <code>ssh pusher@server-ip-address</code>. If you're on a Mac copy the public key of your SSH certificate like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">ssh-copy-id -i ~/.ssh/id_ed25519.pub pusher@server-ip-address<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It creates the <code>.ssh/authorized_keys</code> if it doesn't exist, sets the correct permission bits and appends your public key. You can do it manually, of course.</p>
<p>DigitalOcean's droplets start without a swap file and I'd recomend adding one, specially if you want to start with the smaller boxes with less than 1GB of RAM:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo fallocate -l 2G /swapfile<tt>
</tt>sudo chmod 600 /swapfile<tt>
</tt>sudo mkswap /swapfile<tt>
</tt>sudo swapon /swapfile<tt>
</tt>sudo cp /etc/fstab /etc/fstab.bak<tt>
</tt>echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab<tt>
</tt>sudo sysctl vm.swappiness=10<tt>
</tt>sudo sysctl vm.vfs_cache_pressure=50<tt>
</tt>echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf<tt>
</tt>echo 'vm.vfs_cache_pressure=50' | sudo tee -a /etc/sysctl.conf<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Make sure you have unattended upgrades configured. You will want at least to have security updates automatically installed when available.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt install unattended-upgrades<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, let's install Elixir and Node (Phoenix needs Node.js):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb &amp;&amp; sudo dpkg -i erlang-solutions_1.0_all.deb<tt>
</tt>curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -<tt>
</tt>sudo apt-get update<tt>
</tt>sudo apt-get upgrade<tt>
</tt>sudo apt-get install build-essential nodejs esl-erlang elixir erlang-eunit erlang-base-hipe<tt>
</tt>sudo npm install -g brunch<tt>
</tt>mix local.hex<tt>
</tt>mix archive.install https://github.com/phoenixframework/archives/raw/master/phoenix_new.ez # this is optional, install if you want to manually test phoenix in your box<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now you have an Elixir capable machine ready. Create a image snapshot over DigitalOcean, move it regions you want to create your other droplets and use this image to create as many droplets as you need.</p>
<p>For this example, I created a second droplet in the London region, a third droplet for postgresql in the NYC1 region and a fourth droplet in the NYC3 region for HAProxy.</p>
<p>I will refer to their public IP addresses as <strong>"nyc-ip-address"</strong>, <strong>"lon-ip-address"</strong>, <strong>"pg-ip-address"</strong>, and <strong>"ha-ip-address"</strong>.</p>
<h3>Basic PostgreSQL configuration</h3>
<ul>
  <li>Goal: basic configuration of Postgresql to allow the Phoenix servers to connect.</li>
  <li>To do: create a secondary role just to connect to the application database and another superuser role to create the database and migrate the schema. Also lock down the machine and configure SSH tunnels or another secure way, at least a private networking, than allowing plain 5432 TCP port connections from the public Internet.</li>
</ul>
<p>Now you can connect to <code>ssh pusher@pg-ip-address</code> and follow this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install postgresql postgresql-contrib<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You should create a new role with the same name of the user you added above ("pusher" in our example):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ sudo -u postgres createuser --interactive<tt>
</tt><tt>
</tt>Enter name of role to add: pusher<tt>
</tt>Shall the new role be a superuser? (y/n) y<tt>
</tt><tt>
</tt>$ sudo -u postgres createdb pusher<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Postgresql expects to find a database with the same name as the role and the role should have the same name as the Linux user. Now you can use <code>psql</code> to set a password for this new role:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ sudo -u postgres psql<tt>
</tt>\password pusher<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Register a secure password, take note and let's move on.</p>
<p>Postgresql comes locked down to external connections. One way to connect from the outside is to configure your servers to create an <a href="https://www.postgresql.org/docs/9.1/static/ssh-tunnels.html">SSH tunnel</a> to the database server and keep external TCP connections through port 5432 disavowed.</p>
<p>But for this example, we will just allow connections from the public Internet to the 5432 TCP port. <strong>Warning:</strong> this is VERY insecure!</p>
<p>Edit the <code>/etc/postgresql/9.5/main/postgresql.conf</code> and find the <code>listen_addresses</code> configuration line and allow it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">listen_addresses = '*'    # what IP address(es) to listen on;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This should bind the server to the TCP port. Now edit <code>/etc/postgresql/9.5/main/pg_hba.conf</code> and edit it at the end to looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># IPv4 local connections:<tt>
</tt>host    all             all             127.0.0.1/32            trust<tt>
</tt>host    all             all             your-local-machine-ip-address/24        trust<tt>
</tt>host    all             all             nyc-ip-address/24       trust<tt>
</tt>host    all             all             lon-ip-address/24       trust<tt>
</tt># IPv6 local connections:<tt>
</tt>host    all             all             ::1/128                 trust<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Save the configuration file and restart the server:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo service postgresql restart<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>See what I did there? I only allowed connections coming from the public IPs of the Phoenix servers. This does not make the the server secure, just a little bit less vulnerable. If you're behind a DHCP/NAT based network, just Google for "what's my IP" to see your public facing IP address - which is probably shared by many other users, remember you're allowing connections from an insecure IP to your database server! Once you make initial tests, create your new schema, then you should remove that <code>your-local-machine-ip-address/24</code> line from the configuration.</p>
<p>From your Phoenix application, you can edit you local <code>config/prod.secret.exs</code> file to look like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># Configure your database</span><tt>
</tt>config <span style="color:#A60">:your_app_name</span>, <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Repo</span>,<tt>
</tt>  <span style="color:#808">adapter</span>: <span style="color:#036;font-weight:bold">Ecto</span>.<span style="color:#036;font-weight:bold">Adapters</span>.<span style="color:#036;font-weight:bold">Postgres</span>,<tt>
</tt>  <span style="color:#808">username</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">password</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">your-super-secure-pg-password</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">database</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">your-app-database-name</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">hostname</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pg-ip-address</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">pool_size</span>: <span style="color:#00D;font-weight:bold">20</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Replace the information for your server and database and now you can test it out like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">MIX_ENV=prod iex -S mix phoenix.server<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you see a <code>:econnrefused</code> message from postgrex, then you're in trouble. Re-check your configuration, restart the server and try again. If everything connects, you can run <code>MIX_ENV=prod mix do ecto.create, ecto.migrate</code> to prepare your database.</p>
<p>Finally, you will want to lock down the rest of your server with UFW, at the very least. UFW should come pre-installed in Ubuntu 16, so you can just do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">ufw allow 5432<tt>
</tt>ufw allow ssh<tt>
</tt>ufw enable<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That's it. And again, this does not make your server secure, it just makes it less insecure. There is a huge difference!</p>
<p>And by the way, if you're a Docket fan:</p>
<blockquote>
  <p>DO NOT INSTALL A DATABASE INSIDE A DOCKER CONTAINER!</p>
</blockquote>
<p><a href="https://patrobinson.github.io/2016/11/07/thou-shalt-not-run-a-database-inside-a-container/">You have been warned</a>!</p>
<h3>Basic HAProxy configuration</h3>
<ul>
  <li>Goals: Provide a simple solution to load balance between our 2 Phoenix servers.</li>
  <li>To do: There is something wrong with session checking or something like that as sometimes I have to refresh my browser so I am not sent back to the login from in my application. Phoenix uses cookie-based sessions so I don't think it is missing sessions.</li>
</ul>
<p>Now let's <code>ssh pusher@ha-ip-address</code>. This one is easy, let's just install HAProxy:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo apt-get install haproxy<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Edit <code>/etc/haproxy/haproxy.cfg</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>listen your-app-name<tt>
</tt>  bind 0.0.0.0:80<tt>
</tt>  mode http<tt>
</tt>  stats enable<tt>
</tt>  stats uri /haproxy?stats<tt>
</tt>  stats realm Strictly\ Private<tt>
</tt>  stats auth admin:some-secure-password-for-admin<tt>
</tt>  option forwardfor<tt>
</tt>  option http-server-close<tt>
</tt>  option httpclose<tt>
</tt>  balance roundrobin<tt>
</tt>  cookie SERVERID insert indirect nocache<tt>
</tt>  server us your_us_server_IP:8080 check cookie us1<tt>
</tt>  server uk your_uk_server_IP:8080 check cookie uk1<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can avoid the <code>stats</code> lines if you have other means of monitoring, otherwise set a secure password for the <code>admin</code> user. One very important part is the <code>option http-server-close</code> as explained in <a href="https://blog.silverbucket.net/post/31927044856/3-ways-to-configure-haproxy-for-websockets">this other blog post</a>, otherwise you may have trouble with Websockets.</p>
<p>For some reason I am having some trouble with my application after I login and it sets the session, sometimes I have to refresh to be sent to the correct page, not sure why yet and I believe it's something in the HAProxy configuration. If anyone knows what it is, let me know in the comments section below. For now, I am just relying to Sticky sessions (server affinity) by making HAProxy write back a cookie with the server.</p>
<p>Now you can restart the server and enable UFW as well:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo service haproxy restart<tt>
</tt>sudo ufw allow http<tt>
</tt>sudo ufw allow https<tt>
</tt>sudo ufw allow ssh<tt>
</tt>sudo ufw enable<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can easily add SSL support to your application by configure HAProxy (and not the Phoenix nodes). The <a href="https://www.digitalocean.com/community/tutorials/how-to-secure-haproxy-with-let-s-encrypt-on-ubuntu-14-04">DigitalOcean documentation</a> is comprehensive, so just follow it. At the end, my <code>haproxy.cfg</code> looks like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">global<tt>
</tt>   log /dev/log    local0<tt>
</tt>   log /dev/log    local1 notice<tt>
</tt>   chroot /var/lib/haproxy<tt>
</tt>   stats socket /run/haproxy/admin.sock mode 660 level admin<tt>
</tt>   stats timeout 30s<tt>
</tt>   user haproxy<tt>
</tt>   group haproxy<tt>
</tt>   daemon<tt>
</tt>   maxconn 2048<tt>
</tt>   tune.ssl.default-dh-param 2048<tt>
</tt><tt>
</tt>defaults<tt>
</tt>   log global<tt>
</tt>   mode http<tt>
</tt>   option httplog<tt>
</tt>   option dontlognull<tt>
</tt>   option redispatch<tt>
</tt>   option forwardfor<tt>
</tt>   option http-server-close<tt>
</tt>   timeout connect 5000<tt>
</tt>   timeout client  50000<tt>
</tt>   timeout server  50000<tt>
</tt><tt>
</tt>frontend www-http<tt>
</tt>   bind your_ha_proxy_IP:80<tt>
</tt>   reqadd X-Forwarded-Proto:\ http<tt>
</tt>   default_backend www-backend<tt>
</tt><tt>
</tt>frontend www-https<tt>
</tt>   bind your_ha_proxy_IP:443 ssl crt /etc/haproxy/certs/your_domain.pem<tt>
</tt>   reqadd X-Forwarded-Proto:\ https<tt>
</tt>   acl letsencrypt-acl path_beg /.well-known/acme-challenge/<tt>
</tt>   use_backend letsencrypt-backend if letsencrypt-acl<tt>
</tt>   default_backend www-backend<tt>
</tt><tt>
</tt>backend www-backend<tt>
</tt>   redirect scheme https if !{ ssl_fc }<tt>
</tt>   # setting session stickiness<tt>
</tt>   cookie SERVERID insert indirect nocache<tt>
</tt>   server us your_us_server_IP:8080 check cookie us1<tt>
</tt>   server uk your_uk_server_IP:8080 check cookie uk1<tt>
</tt><tt>
</tt>backend letsencrypt-backend<tt>
</tt>   server letsencrypt 127.0.0.1:54321<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, I will assume you have a DNS server/service somewhere where you can register the IP of this HAproxy server as an A record so you can access it by a full name such as "your-app-name.mydomain.com".</p>
<p><a name="phoenix-setup"></a></p>
<h3>Basic Phoenix Configuration</h3>
<ul>
  <li>Goal: configure the Phoenix app to be deployable. Configure the servers to have the necessary configuration files.</li>
  <li>To do: find out a way to cut down the super slow deployment times.</li>
</ul>
<p>Finally, we have almost everything in place.</p>
<p>I will assume that you have a working Phoenix application already in place, otherwise create one from the many number of tutorials out there.</p>
<p>I have assembled this information from <a href="https://medium.com/@diamondgfx/deploying-phoenix-applications-with-exrm-97a3867ebd04#.7qyuplncx">posts</a> such as <a href="https://engineering.pivotal.io/post/how-to-set-up-an-elixir-cluster-on-amazon-ec2/">this very helpful one</a> from Pivotal about an AWS-based deployment. In summary you must do a number of changes to your configuration.</p>
<p>When you're developing your application, you will notice that whenever you run it, it delta-compiles what changed. The binary bits are in the <code>_build/dev</code> or <code>_build/test</code> in the form of <code>.beam</code> binaries (similar to what <code>.class</code> are for Java).</p>
<p>Different from Ruby or Python or PHP, you are not deploying source-code to production servers. It's more akin to Java, where you must have everything compiled into binary bits and packaged into what's called a <strong>release</strong>. It's like a ".war" or ".ear" if you're from Java.</p>
<p>To create this package people usually use "exrm", but it's being replaced by <a href="https://github.com/bitwalker/distillery">"distillery"</a>, so we will use it.</p>
<p>Then, if you're from Ruby you're familiar with Capistrano. Or if you're from Python, you know Capistrano's clone, Fabric. Elixir has a similar tool (much simpler at this point), called <a href="https://github.com/boldpoker/edeliver">"edeliver"</a>. It's your basic SSH automation tool.</p>
<p>You add them to <code>mix.exs</code> just like any other dependency:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">application</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  [<span style="color:#808">mod</span>: {<span style="color:#036;font-weight:bold">ExPusherLite</span>, []},<tt>
</tt>   <span style="color:#808">applications</span>: [..., <span style="color:#A60">:edeliver</span>]]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>defp deps <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  [...,<tt>
</tt>   {<span style="color:#A60">:edeliver</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.4.0</span><span style="color:#710">"</span></span>},<tt>
</tt>   {<span style="color:#A60">:distillery</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 1.0</span><span style="color:#710">"</span></span>}]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>From the Pivotal blog post, the important thing to not forget is to edit this part in the <code>config/prod.exs</code> file:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">http</span>: [<span style="color:#808">port</span>: <span style="color:#00D;font-weight:bold">8080</span>],<tt>
</tt><span style="color:#808">url</span>: [<span style="color:#808">host</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">your-app-name.yourdomain.com</span><span style="color:#710">"</span></span>, <span style="color:#808">port</span>: <span style="color:#00D;font-weight:bold">80</span>],<tt>
</tt>...<tt>
</tt>config <span style="color:#A60">:phoenix</span>, <span style="color:#A60">:serve_endpoints</span>, <span style="color:#038;font-weight:bold">true</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You MUST hardcode the default PORT of the Phoenix web server and the allowed domain (remember the domain name you associated to your HAProxy server above? That one). And you MUST uncomment the <code>:serve_endpoints, true</code> line!</p>
<p>For edeliver to work you have to create a <code>.deliver/config</code> file like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">USING_DISTILLERY=true<tt>
</tt><tt>
</tt># change this to your app name:<tt>
</tt>APP="your-app-name"<tt>
</tt><tt>
</tt># change this to your own servers IP and add as many as you want<tt>
</tt>US="nyc-ip-address"<tt>
</tt>UK="lon-ip-address"<tt>
</tt><tt>
</tt># the user you created in your Ubuntu machines above<tt>
</tt>USER="pusher"<tt>
</tt><tt>
</tt># which server do you want to build the first release?<tt>
</tt>BUILD_HOST=$US<tt>
</tt>BUILD_USER=$USER<tt>
</tt>BUILD_AT="/tmp/edeliver/$APP/builds"<tt>
</tt><tt>
</tt># list the production servers declared above:<tt>
</tt>PRODUCTION_HOSTS="$US $UK"<tt>
</tt>PRODUCTION_USER=$USER<tt>
</tt>DELIVER_TO="/home/$USER"<tt>
</tt><tt>
</tt># do not change here<tt>
</tt><tt>
</tt>LINK_VM_ARGS="/home/$USER/vm.args"<tt>
</tt><tt>
</tt># For *Phoenix* projects, symlink prod.secret.exs to our tmp source<tt>
</tt>pre_erlang_get_and_update_deps() {<tt>
</tt>  local _prod_secret_path="/home/$USER/prod.secret.exs"<tt>
</tt>  if [ "$TARGET_MIX_ENV" = "prod" ]; then<tt>
</tt>    __sync_remote "<tt>
</tt>      ln -sfn '$_prod_secret_path' '$BUILD_AT/config/prod.secret.exs'<tt>
</tt><tt>
</tt>      cd '$BUILD_AT'<tt>
</tt><tt>
</tt>      mkdir -p priv/static<tt>
</tt><tt>
</tt>      mix deps.get<tt>
</tt><tt>
</tt>      npm install<tt>
</tt><tt>
</tt>      brunch build --production<tt>
</tt><tt>
</tt>      APP='$APP' MIX_ENV='$TARGET_MIX_ENV' $MIX_CMD phoenix.digest $SILENCE<tt>
</tt>    "<tt>
</tt>  fi<tt>
</tt>}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remember the information we've been gathering since the beginning of this long recipe? These are the options you MUST change to your own. Just follow the comments in the file content above and add it to your git repository. By the way, your project is in a proper GIT repository, RIGHT??</p>
<p>If you like to use passphrase protected SSH private keys, then it's going to be a huge pain to deploy because for each command, edeliver will issue an SSH command that will keep asking for you passphrase, a dozen times through everything. You've been warned! If you still don't mind that, and you're in a Mac you will have an extra trouble because the Terminal will not be able to create a prompt for you to input your passphrase. You must create an <code>/usr/local/bin/ssh-askpass</code> <a href="https://github.com/markcarver/mac-ssh-askpass">script</a>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">#!/bin/bash<tt>
</tt># Script: ssh-askpass<tt>
</tt># Author: Mark Carver<tt>
</tt># Created: 2011-09-14<tt>
</tt># Licensed under GPL 3.0<tt>
</tt><tt>
</tt># A ssh-askpass command for Mac OS X<tt>
</tt># Based from author: Joseph Mocker, Sun Microsystems<tt>
</tt># https://blogs.oracle.com/mock/entry/and_now_chicken_of_the<tt>
</tt><tt>
</tt># To use this script:<tt>
</tt>#   Install this script running INSTALL as root<tt>
</tt>#<tt>
</tt># If you plan on manually installing this script, please note that you will have<tt>
</tt># to set the following variable for SSH to recognize where the script is located:<tt>
</tt>#   export SSH_ASKPASS="/path/to/ssh-askpass"<tt>
</tt><tt>
</tt>TITLE="${SSH_ASKPASS_TITLE:-SSH}";<tt>
</tt>TEXT="$(whoami)'s password:";<tt>
</tt>IFS=$(printf "\n");<tt>
</tt>CODE=("on GetCurrentApp()");<tt>
</tt>CODE=(${CODE[*]} "tell application \"System Events\" to get short name of first process whose frontmost is true");<tt>
</tt>CODE=(${CODE[*]} "end GetCurrentApp");<tt>
</tt>CODE=(${CODE[*]} "tell application GetCurrentApp()");<tt>
</tt>CODE=(${CODE[*]} "activate");<tt>
</tt>CODE=(${CODE[*]} "display dialog \"${@:-$TEXT}\" default answer \"\" with title \"${TITLE}\" with icon caution with hidden answer");<tt>
</tt>CODE=(${CODE[*]} "text returned of result");<tt>
</tt>CODE=(${CODE[*]} "end tell");<tt>
</tt>SCRIPT="/usr/bin/osascript"<tt>
</tt>for LINE in ${CODE[*]}; do<tt>
</tt>      SCRIPT="${SCRIPT} -e $(printf "%q" "${LINE}")";<tt>
</tt>done;<tt>
</tt>eval "${SCRIPT}";<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now do this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo chmod +x /usr/local/bin/ssh-askpass<tt>
</tt>sudo ln -s /usr/local/bin/ssh-askpass /usr/X11R6/bin/ssh-askpass<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remember, Macs only. And now everytime you try to deploy you will receive a number of graphical prompt windows asking for the SSH private key passphrase. It's freaking annoying! And you must have <a href="https://www.xquartz.org/">XQuartz</a> installed, by the way.</p>
<p>Now you must manually create 3 files in all Phoenix servers. Start with the <code>your-app-name/vm.args</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">-name us@nyc-ip-address<tt>
</tt>-setcookie @bCd&amp;fG<tt>
</tt>-kernel inet_dist_listen_min 9100 inet_dist_listen_max 9155<tt>
</tt>-config /home/pusher/your-app-name.config<tt>
</tt>-smp auto<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <code>/home/pusher/your-app-name</code> is the directory where the release will be uncompressed after edeliver deploys the release tarball.</p>
<p>You must create this file in all Phoenix machines, by the way, changing the <code>-name</code> bit for the same name you declared in the <code>.deliver/config</code> file. The <code>-setcookie</code> should be any name, as long as it's the same in all servers.</p>
<p>See the <code>-config /home/pusher/your-app-name.config</code>? Create that file with the following:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[{kernel,<tt>
</tt>  [<tt>
</tt>    {sync_nodes_optional, ['uk@lon-ip-address']},<tt>
</tt>    {sync_nodes_timeout, 30000}<tt>
</tt>  ]}<tt>
</tt>].<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is an Erlang source-code. On the NYC machine you must declare the London name, and vice-versa. If you have several machines, all of them but the one you're in right now. Get it?</p>
<p>Finally, for the Phoenix app itself, you always have a <code>config/prod.secret.exs</code> that should never be <code>git add</code>ed to the repository, remember? This is where you put the Postgresql server information and random secret key to sign the session cookies:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">use Mix.Config<tt>
</tt><tt>
</tt>config :your_app_name, YourAppName.Endpoint,<tt>
</tt>  secret_key_base: "..."<tt>
</tt><tt>
</tt># Configure your database<tt>
</tt>config :your_app_name, YourAppName.Repo,<tt>
</tt>  adapter: Ecto.Adapters.Postgres,<tt>
</tt>  username: "pusher",<tt>
</tt>  password: "your-super-secure-pg-password",<tt>
</tt>  database: "your-app-database-name",<tt>
</tt>  hostname: "pg-ip-address",<tt>
</tt>  pool_size: 20<tt>
</tt><tt>
</tt># if you have Guardian, for example:<tt>
</tt>config :guardian, Guardian,<tt>
</tt>  secret_key: "..."<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>How do you create a new random secret key? From your development machine just run: <code>mix phoenix.gen.secret</code> and copy the generated string into the file above.</p>
<p>So now you must have those 3 files in each Phoenix server, in the <code>/home/pusher</code> home folder:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">~/your-app-name/vm.args<tt>
</tt>~/prod.secret.exs<tt>
</tt>~/your-app-name.config<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As per <a href="https://hexdocs.pm/distillery/runtime-configuration.html#vm-args">distillery</a> documentation, you have to set an environment variable to let it know about the <code>vm.args</code> file, and this is <strong>SUPER</strong> important otherwise it will generate a default one that doesn't set the proper name and cookie, so the nodes will not find each other after booting up.</p>
<p>Using <code>sudo</code>, edit the <code>/etc/environment</code> and add the line:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">RELEASE_CONFIG_DIR=/home/pusher/your-app-name<tt>
</tt>VMARGS_PATH=/home/pusher/your-app-name/vm.args<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You have to do it in all the phoenix servers.</p>
<p>In your local development directory you still have to run this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix release.init<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It will generate a standard <code>rel/config.exs</code> file that you must add to your git repository with the following changes do the bottom:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>environment <span style="color:#A60">:prod</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  plugin <span style="color:#036;font-weight:bold">Releases</span>.<span style="color:#036;font-weight:bold">Plugin</span>.<span style="color:#036;font-weight:bold">LinkConfig</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>release <span style="color:#A60">:your_app_name</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  set <span style="color:#808">version</span>: current_version(<span style="color:#A60">:your_app_name</span>)<tt>
</tt><tt>
</tt>  set <span style="color:#808">applications</span>: [<tt>
</tt>    <span style="color:#808">your_app_name</span>: <span style="color:#A60">:permanent</span><tt>
</tt>  ]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The plugin should enable the release to find the local <code>vm.args</code> file in the server (this is super important, otherwise the remote commands such as start, stop, ping, etc will not work and the nodes will not load the correct information to boot up and form a cluster).</p>
<p>Finally, all set, you can issue this command:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ mix edeliver build release production --skip-mix-clean --verbose<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If it finishes without errors you will have a message like the following in the end:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>==&gt; Release successfully built!<tt>
</tt>    You can run it in one of the following ways:<tt>
</tt>      Interactive: _build/prod/rel/your-app-name/bin/your-app-name console<tt>
</tt>      Foreground: _build/prod/rel/your-app-name/bin/your-app-name foreground<tt>
</tt>      Daemon: _build/prod/rel/your-app-name/bin/your-app-name start<tt>
</tt>--&gt; Copying release 0.0.1 to local release store<tt>
</tt>--&gt; Copying your-app-name.tar.gz to release store<tt>
</tt><tt>
</tt>RELEASE BUILD OF YOUR-APP-NAME WAS SUCCESSFUL!<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, this will take an absurdly long time to deploy. That's because it will git clone the source code of your app, fetch all Elixir dependencies (every time!), it will have to compile everything, then it will run the super slow <code>npm install</code> (every time!), brunch your assets, create the so-called "release", tar and gzip it, download it and SCP it to the other machines you configured.</p>
<p>In the <code>.deliver/config</code> file you set a <code>BUILD_HOST</code> option. This is the machine where all this process takes place, so you will want to have at least this machine be beefier than the others. As I am using small 512Mb droplets, the process takes forever.</p>
<p>The last command will download the generated tarball. It has to do it to make sure you have the <a href="https://erlang.org/doc/tutorial/nif.html">NIFs</a> compiled in the native environment where it run, because if you use a Mac, binaries from Macs won't run on Linux.</p>
<p>Now we must upload and decompress this tarball in each server with the following command:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix edeliver deploy release to production<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The slower your network, the longer this will take, as it's uploading a big tarfile across the public internet, so make sure you're in a fast connection. And when it finishes, we can restart the servers (if you already had instances running):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix edeliver stop production<tt>
</tt>mix edeliver start production<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you do everything right, the edeliver process finishes without any error and it leaves a daemon running in your server, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">/home/pusher/your-app-name/erts-8.2/bin/beam -- -root /home/pusher/your-app-name -progname home/pusher/your-app-name/releases/0.0.1/your-app-name.sh -- -home /home/pusher -- -boot /home/pusher/your-app-name/releases/0.0.1/your-app-name -config /home/pusher/your-app-name/running-config/sys.config -boot_var ERTS_LIB_DIR /home/pusher/your-app-name/erts-8.2/../lib -pa /home/pusher/your-app-name/lib/your-app-name-0.0.1/consolidated -name us@nyc-ip-address -setcookie ex-push&amp;r-l!te -kernel inet_dist_listen_min 9100 inet_dist_listen_max 9155 -config /home/pusher/your-app-name.config -mode embedded -user Elixir.IEx.CLI -extra --no-halt +iex -- console<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It will still take a long time, but it should be easier. So this is a pro-tip for you, Linux users. Follow <a href="https://gist.github.com/mattweldon/2e8ecb953216438ad168">this Gist</a> for more details, you must emulate what's run from the <code>.deliver/config</code> file's bottom half.</p>
<p>Also notice that I ran the migrations manually, but you can do it using <code>mix edeliver migrate</code>.</p>
<p>Read their documentation for more commands and configurations.</p>
<p>Also, do not forget to enable UFW:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo ufw allow ssh<tt>
</tt>sudo ufw allow 8080<tt>
</tt>sudo ufw allow 4369<tt>
</tt>sudo ufw allow proto tcp from any to any port 9100:9155<tt>
</tt>sudo ufw default allow outgoing<tt>
</tt>sudo ufw enable<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Debugging Production bugs</h3>
<p>Right after I deployed, obviously it failed. And the problem is that the <code>/home/pusher/your-app-name/log/erlang.log</code> files (they are automatically rotated so you may find several files ending in a number), you won't see much.</p>
<p>What I recommend you to do is to change the <code>config/prod.exs</code> file ONLY in your development machine and change the log setting to <code>config :logger, level: :debug</code>, use the same <code>prod.secret.exs</code> you edited in the servers above and run it locally with <code>MIX_ENV=prod iex -S mix phoenix.server</code>.</p>
<p>For example, in development mode I had a code in the controller that was checking the existence of an optional query string parameter like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">if</span> params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">some_parameter</span><span style="color:#710">"</span></span>] <span style="color:#080;font-weight:bold">do</span><tt>
</tt> ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That was working fine in development but crashing in production, so I had to change it to:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">Map</span>.has_key?(params, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">some_parameter</span><span style="color:#710">"</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt> ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Another thing was that Guardian was working normally in development, but in production I had to declare its application in the <code>mix.exs</code> like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">application</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  [<span style="color:#808">mod</span>: {<span style="color:#036;font-weight:bold">ExPusherLite</span>, []},<tt>
</tt>   <span style="color:#808">applications</span>: [..., <span style="color:#A60">:guardian</span>, <span style="color:#A60">:edeliver</span>]]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I was getting <code>:econnrefused</code> errors because I forgot to run <code>MIX_ENV=prod mix do ecto.create, ecto.migrate</code> as I instructed above. Once I figured those out, my application was up and running through the <code>https://your-app-name.yourdomain.com</code>, HAProxy was correctly forwarding to the 8080 port in the servers and everything runs fine, including the WebSocket connections.</p>
<h3>Conclusion</h3>
<p>As I mentioned above, this kind of procedure makes me really miss an easy to deploy solution such as Heroku.</p>
<p>The only problem I am facing right now is that when I log in through Coherence's sign in page, I am not redirected to the correct URI I am trying ("/admin" in my case), sometimes reloading after sign in works, sometimes it doesn't. Sometimes I am inside a "/admin" page but when I click one of the links it sends me back to the sign in page even though I am already signed in. I am not sure if it's a but in Coherence, ExAdmin, Phoenix itself or an HAProxy misconfiguration. I will update this post if I find out.</p>
<p>Edeliver also takes an obscene amount of time to deploy. Even waiting for sprockets to process in a <code>git push heroku master</code> deploy feels way faster in comparison. And this is for a very bare-bone Phoenix app. Having to fetch everything (because Hex doesn't keep a local global cache, all dependencies are statically vendored in the project directory). Having to run the super slow npm doesn't help either.</p>
<p>I still need to research if there are faster options, but for now what I have "works".</p>
<p>And more importantly, now I have a scalable cluster for real-time bi-directional WebSockets, which is the main reason one might want to use Phoenix in the first place.</p>
<p>If you want to build a "normal" website, keep it simple and do it in Rails, Django, Express or whatever is your web framework of choice. If you want real-time communications the easy way, I might have a better solution. Keep an eye on my blog for news to come soon! ;-)</p>
<p></p>
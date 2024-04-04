---
title: "The New Kid on the Block for Ruby Servers: Raptor!"
date: "2014-10-19T17:00:00.000Z"
tags: ["passenger"]
years: "2014"
---

<p></p>
<p><em>Update (25/11/2014):</em> We can finally confirm that yes, the awesome Raptor project is the codename for the next release of Phusion Passenger itself! Read the <a href="http://blog.phusion.nl/2014/11/25/introducing-phusion-passenger-5-beta-1-codename-raptor/">announcement</a></p>
<p>If you're a seasoned Ruby web developer you're probably familiar and comfortable using the usual suspects to deploy your applications. You're either deploying something simple through good old Thin, or you're orchestrating several Ruby processes through Unicorn workers, or you're trying out JRuby and want better concurrency and thread management, and therefore you're using either Puma or Torquebox.</p>
<p>And even though it feels like we are already at the peak of what's possible with Ruby, we do want more. Ruby 2.1.3 was just released, 3.0 is in development. But until then it should be possible to squeeze some more performance out of your boxes.</p>
<p>In fact, a new contender, with some new approaches just showed up. I have little details so far, but it's a brand new product - not derived from the others - from an unknown team. This product is named <a href="http://www.rubyraptor.org">"Raptor"</a> and they claim that it can squeeze the extra juice out of our boxes.</p>
<p>And this is their claim:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/475/chart-1.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/475/chart-1.png 2x" alt="Raptor Chart"></p>
<p></p>
<p></p>
<p>Fortunately, I had the chance to experiment it's beta release in a controlled Vagrant environment and check those claim! Bear in mind that those are synthetic benchmarks and real world throughput of real applications should give us different behavior. With that having being said, let's see how the main Ruby servers perform a very simple Rack app returning a simple HTTP 200 with "Hello World":</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
<a href="#n8" name="n8">8</a>
<a href="#n9" name="n9">9</a>
<strong><a href="#n10" name="n10">10</a></strong>
<a href="#n11" name="n11">11</a>
<a href="#n12" name="n12">12</a>
<a href="#n13" name="n13">13</a>
<a href="#n14" name="n14">14</a>
<a href="#n15" name="n15">15</a>
<a href="#n16" name="n16">16</a>
<a href="#n17" name="n17">17</a>
<a href="#n18" name="n18">18</a>
<a href="#n19" name="n19">19</a>
<strong><a href="#n20" name="n20">20</a></strong>
<a href="#n21" name="n21">21</a>
<a href="#n22" name="n22">22</a>
</pre>
      </td>
      <td class="code"><pre> ==&gt; Benchmark parameters:
     Application         : hello_app
     Operating system    : Ubuntu 14.04 LTS (x86_64)
     Virtual CPU cores   : 4
     MRI Ruby            : ruby 2.1.3p242 (2014-09-19 revision 45877) [x86_64-linux-gnu]
     JRuby               : jruby 1.7.13 (1.9.3p392) 2014-06-24 43f133c on OpenJDK 64-Bit Server VM 1.7.0_65-b32 [linux-amd64]
     Unicorn workers     : 8
     Puma workers (MRI)  : 8 (16 threads each)
     Puma workers (JRuby): 1 (32 threads each)
     Torquebox threads   : 32
     Raptor workers      : 8
     Concurrent clients  : 16
 ==&gt; Benchmark summary:
     Unicorn (MRI Ruby)         : 23015.36 req/sec
     Puma (MRI Ruby)            : 32538.62 req/sec
     Puma (JRuby)               : 399.14 req/sec
     Torquebox (JRuby)          : 29773.21 req/sec
     Raptor (MRI Ruby)          : 95309.35 req/sec
     Raptor (JRuby)             : 87523.65 req/sec
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, this sounds very impressive indeed! And what about a more complex example: a simple Rails 4.1.6 application rendering a default scaffold index page with a model fetching 20 rows from MySQL:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
</pre>
      </td>
      <td class="code"><pre>==&gt; Benchmark summary:
    Unicorn (MRI Ruby)         : 326.49 req/sec
    Puma (MRI Ruby)            : 327.36 req/sec
    Puma (JRuby)               : 221.78 req/sec
    Torquebox (JRuby)          : 226.57 req/sec
    Raptor (MRI Ruby)          : 79617.78 req/sec
    Raptor (JRuby)             : 73948.59 req/sec
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, <strong>super</strong> impressive. My first impression when reading these numbers is that Raptor must have builtin response caching (which is great!). So I tweaked the example to make it much heavier than what's considered "normal" for a small cache, rendering a table of 100 rows from the database in the index page, and the results are still competitive:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
<a href="#n7" name="n7">7</a>
</pre>
      </td>
      <td class="code"><pre>==&gt; Benchmark summary:
    Unicorn (MRI Ruby)         : 85.98 req/sec
    Puma (MRI Ruby)            : 89.93 req/sec
    Puma (JRuby)               : 79.42 req/sec
    Torquebox (JRuby)          : 77.98 req/sec
    Raptor (MRI Ruby)          : 82.63 req/sec
    Raptor (JRuby)             : 88.92 req/sec
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This could mean that at the best case scenario, you could get almost <strong>4 times</strong> the throughput from your application, and in the worst case scenario, you're still getting similar throughputs. This means that Raptor is adaptable and reasonably "smart". So overall it's a win-win situation!</p>
<p>The way they are able to achieve these superior numbers can be explained by the way they approached the implementation. This is the breakdown that they have released so far:</p>
<ul>
  <li><strong>Protection against slow clients</strong>: Slow clients on the Internet can block your app, like people standing still in front of your door. Unicorn only has a single small door, so it <a href="https://unicorn.bogomips.org/PHILOSOPHY.html">requires</a> you to attach a buffering reverse proxy in front of it, like Nginx. Puma has as many small doors as you configure threads, so you still need to attach Nginx in front to be safe. But Raptor has a door that's almost infinitely wide, and fully protects your app against slow clients without additional software.</li>
  <li><strong>Optional integration with Nginx</strong>. Nginx is a great web server and provides useful features like compression, security, etc. But using Puma and Unicorn with Nginx requires you to configure Puma/Unicorn separately, to configure Nginx separately, to configure monitoring separately, and to manage each component separately. Doesn't it make sense to consolidate all these moving parts into a single package? Enter Raptor's optional Nginx integration mode: configuration, management and daemon monitoring all directly from Nginx.</li>
  <li><strong>Multitenancy</strong>. If you run multiple apps on a same server, then managing all those Puma and Unicorn instances quickly becomes tedious. Raptor's Nginx integration mode allows you to manage all your apps from a single Nginx instance.</li>
  <li><strong>Security</strong>. Improve your server's security by easily running multiple apps under multiple user accounts. This way, a vulnerability in one app won't affect all your other apps.</li>
  <li><strong>JRuby support</strong>. Like Puma (and unlike Unicorn), Raptor has great JRuby support.</li>
</ul>
<p>So it's not only a different implementation but also features for the future, supporting transparently handling slow clients without causing bottlenecks to your application and avoiding having extra layers of protection. And everything in an easy to use package (according to their release: you will be able to replace your current server in the Gemfile and bundle install it!)</p>
<p>Raptor is about to be released, so keep tuned for more news and when it's available for everybody to test their applications with. From what we have seen so far, this one looks like a winner!</p>
<p>Go to <a href="https://www.rubyraptor.org">their website</a> to know more about it and if you're like me and feel like this is the real deal, <a href="https://www.thunderclap.it/projects/17748-raptor-fast-ruby-web-server">Thunderclap it!</a></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/473/raptor_square.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/473/raptor_square.png 2x" alt="Raptor"></p>
<p></p>
---
title: "How Fast is Elixir/Phoenix?"
date: "2015-10-27T18:23:00.000Z"
tags: ["beginner", "elixir", "english"]
years: "2015"
---

<p></p>
<p>I like to know what my tools are capable of, because that says how and where I can use them. I will not bore you by stating how awesome Elixir and Erlang are. You've heard/read it before.</p>
<p>I will also not bore you with "15 minute blog" tutorials as there are <a href="https://medium.com/@diamondgfx/introduction-fe138ac6079d#.iemenrs71">many</a> out there already.</p>
<p>Instead, I'd like to show what Phoenix - the Rails-like web framework written in Elixir - is capable of.</p>
<p>You can make the same simulation as I did by repeating the following steps:</p>
<ol>
  <li><a href="http://www.phoenixframework.org/docs/installation">Install</a> Elixir and Phoenix</li>
  <li>Generate a skeleton Phoenix app with a simple Post model</li>
  <li>Create a Heroku app and add the <a href="http://www.phoenixframework.org/docs/heroku">necessary buildpacks</a></li>
  <li>Deploy the app to Heroku and run the migration</li>
  <li>Open a remote console to Heroku and run the following to load the database with sample data:</li>
</ol>
<p></p>
<p>
</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">(<span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">1000</span>) <tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn (n) -&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">title: "title </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>n<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">", body: to_string(n)</span><span style="color:#710">}</span></span> <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.map(fn (params) -&gt; <span style="color:#036;font-weight:bold">Blog</span>.<span style="color:#036;font-weight:bold">Post</span>.changeset(%<span style="color:#036;font-weight:bold">Blog</span>.<span style="color:#036;font-weight:bold">Post</span>{}, params) <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt>  |&gt; <span style="color:#036;font-weight:bold">Enum</span>.each(fn (changeset) -&gt; <span style="color:#036;font-weight:bold">Blog</span>.<span style="color:#036;font-weight:bold">Repo</span>.insert(changeset) <span style="color:#080;font-weight:bold">end</span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Feeling strange? Read the <a href="https://pragprog.com/book/elixir/programming-elixir">Programming Elixir</a> book as soon as possible!</p>
<p>If you're a Rails developer, this is the equivalent of doing:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">(<span style="color:#00D;font-weight:bold">1</span>..<span style="color:#00D;font-weight:bold">1000</span>).each { |n| <span style="color:#036;font-weight:bold">Post</span>.create <span style="color:#808">title</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">title </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>n<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>, <span style="color:#808">body</span>: n }<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Before anyone starts, No: Ruby is not better or Elixir is not worse because of this particular difference in lines of code, do not let this illusion fool you here or in any other language comparison.</p>
<p>Now we can fire up Blitz.io (load testing tool). The default settings of the free plan will simulate increasing the number of concurrent users from 1 all the way to 250. Blitz's default timeout is 1 second which is not a lot for web applications under heavy load, you can increase it up to 20 seconds just to be safe.</p>
<p>We will test the "/posts" endpoint, which will fetch 1,000 rows from the database (and it will suffer from bottlenecks in query processing time and the restricted amount of concurrent connections that the free Postgresql plan allows).</p>
<p>I ran this simulation several times and this is the result:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/521/Screen_Shot_2015-10-27_at_15.57.30.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/521/Screen_Shot_2015-10-27_at_15.57.30.png 2x" alt="Blitz /posts"></p>
<p>Through the console a single request, rendering those 1,000 rows, is taking around 150ms end to end (fast!):</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"> [info] GET /posts<tt>
</tt> [info] Sent 200 in 152ms<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But when we put it under heavy traffic the response time go all the way up to 15 seconds. The app keeps up and responds all requests without dropping any of them. It takes more and more time because of the length of the request queue and aforementioned database bottlenecks.</p>
<p>This is expected because we are running on the slowest possible options on Heroku: the free tiers. The web dynos run in shared machines with possible heavy neighbors and the free database does not give any guarantees. So the Phoenix app is having to really struggle to deal with the ridiculous amount of traffic without a lot of resources to back it up. The free Postgresql database is probably the cause of most of the bottlenecks and increase in response time.</p>
<p>For example, if we remove the database from the equation and just return the default homepage (which I tweaked to render an additional random number, in order to know that it's not cached in any way) gives a very different result:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/522/Screen_Shot_2015-10-27_at_16.08.07.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/522/Screen_Shot_2015-10-27_at_16.08.07.png 2x" alt="Blitz homepage"></p>
<p>It's still on the same free small web dyno, and it's rendering and returning a very simple 2.2kb HTML, compared to the previous 560 kb posts page.</p>
<p>It averages out to around 17ms for the entire roundtrip but the actual processing time of the page inside the dyno, as stated by the logs, is this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"> [info] GET /<tt>
</tt> [info] Sent 200 in 389µs<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is <strong>microseconds</strong>, a fraction of a milisecond, which is crazy fast. Response times still bump up a bit and goes all the way to 25ms, which is still very fast. Many things may be responsible for the bumps but I would bet it is heavier neighbors in the same machine making our tests dirty. We can't avoid it in a cloud environment but it's not bad.</p>
<p>Of course, in real world applications I would be careful to not ever have stupid endpoins returning half a megabyte worth of HTML and holding the database waiting for hundreds of rows that could be easily cached in-memory or even in memcached. This is a synthetic, very naive test just to see how far it can go. We just saw 2 extremes: an almost-static tiny page rendering and a stupid heavy rendering. A custom app, correctly done, will fall in between those.</p>
<p>This is speed that can't be ignored. It feels strange in the beginning, but Elixir quickly reminds you of the joys of programming in Ruby for the first time. Combined with the heavyweight industrial strength of Erlang's OTP underpinnings, and the above results, I can easily recommend Phoenix for any number of microservices. It's the best place to start testing in production as soon as possible and check how productive it can be.</p>
<p>I'm very interested in exploring OTP more, so you can expect me writing somemore about it in the future.</p>
<p></p>
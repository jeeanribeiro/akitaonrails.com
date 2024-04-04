---
title: "Coherence and ExAdmin - Devise and ActiveAdmin for Phoenix"
date: "2016-12-06T20:18:00.000Z"
tags: ["phoenix", "activeadmin", "devise"]
years: "2016"
---

<p></p>
<p>This is intended for Rubyists researching the possibility of replacing some of Ruby and Rails with Elixir and Phoenix.</p>
<p>Cutting straight to the chase, many small Rails apps that I build start with 2 very simple add-ons: Devise for authentication and ActiveAdmin for basic database management. Then I build up from there.</p>
<p>Both Elixir and Phoenix are fast moving targets right now, which makes it difficult for a stable set of libraries to solidify properly, but I think that we're finally getting past the early adopters curve already.</p>
<p>One big point of contention has been user authentication. Many purists will argue that you need to build your own from scratch or by using low level libraries such as <a href="https://github.com/ueberauth/guardian">Guardian</a>.</p>
<p>If you're building an application that just exposes API endpoints, that's probably fine. But for a full-featured web app meant for humans to use, this is hardly a good choice. I will not entertain the discussion today, as it's beyond the point.</p>
<p>I am assuming that you at least followed both <a href="http://elixir-lang.org/getting-started/introduction.html">Elixir</a> and <a href="http://www.phoenixframework.org/docs/installation">Phoenix</a> tutorials by now. If you didn't go ahead and do it, it will take you one or two days to learn the very basics if you're already an experienced rubyist. Then come back and read <a href="/elixir">my posts on Elixir</a> to understand where it stands out compared to everything else.</p>
<p>That being said, let's get started.</p>
<p></p>
<p></p>
<h3>Coherence (Devise alternative)</h3>
<p>Finally, I found this project that's been under heavy development for the past 6 months called <a href="https://github.com/smpallen99/coherence">Coherence</a>. For all intents and purposes, it successfully mimics Devise in almost every way. And this is a very good thing for a lot of scenarios.</p>
<p>Their <a href="https://github.com/smpallen99/coherence/blob/master/README.md">README</a> is well explained enough so I will not copy and paste it here, just read it there to get up and running. But if you want to try out all of their features you can tweak their procedure with this set of options in the installation Mix task:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix coherence.install --full --rememberable --invitable --trackable<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Run <code>mix help coherence.install</code> to see a description for all the options.</p>
<p>And if you're not tweaking the front-end, you can just add the proper sign up, sign in, sign out links by adding the following snippet to the <code>web/templates/layout/app.html.eex</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#070">&lt;header</span> <span style="color:#007">class</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">header</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>  <span style="color:#070">&lt;nav</span> <span style="color:#007">role</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">navigation</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>    <span style="color:#070">&lt;ul</span> <span style="color:#007">class</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">nav nav-pills pull-right</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>      <span style="color:#888">&lt;%= if Coherence.current_user(@conn) do %&gt;</span><tt>
</tt>        <span style="color:#888">&lt;%= if @conn.assigns[:remembered] do %&gt;</span><tt>
</tt>          <span style="color:#070">&lt;li</span> <span style="color:#007">style</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">color: red;</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>!!<span style="color:#070">&lt;/li&gt;</span><tt>
</tt>        <span style="color:#888">&lt;% end %&gt;</span><tt>
</tt>      <span style="color:#888">&lt;% end %&gt;</span><tt>
</tt>      <span style="color:#888">&lt;%= YourApp.Coherence.ViewHelpers.coherence_links(@conn, :layout) %&gt;</span><tt>
</tt>      <span style="color:#070">&lt;li&gt;</span><span style="color:#070">&lt;a</span> <span style="color:#007">href</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://www.phoenixframework.org/docs</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span>Get Started<span style="color:#070">&lt;/a&gt;</span><span style="color:#070">&lt;/li&gt;</span><tt>
</tt>    <span style="color:#070">&lt;/ul&gt;</span><tt>
</tt>  <span style="color:#070">&lt;/nav&gt;</span><tt>
</tt>  <span style="color:#070">&lt;span</span> <span style="color:#007">class</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">logo</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/span&gt;</span><tt>
</tt><span style="color:#070">&lt;/header&gt;</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>(By the way, whenever you see <code>YourApp</code> in the code snippets, you must change for your app's module name.)</p>
<p>If you get lost in their documentation you can check out their <a href="https://github.com/smpallen99/coherence_demo">Coherence Demo</a> repository for an example of a basic Phoenix app with Coherence already configured and working. You will mostly have to take care of <code>web/router.ex</code> to create a <code>:protected</code> pipeline and set the scopes accordingly.</p>
<p>If you do it correctly, this is what you will see:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/572/Screen_Shot_2016-12-06_at_17.45.47.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/572/Screen_Shot_2016-12-06_at_17.45.47.png 2x" alt="Coherence Navigation Links"></p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/573/Screen_Shot_2016-12-06_at_17.45.52.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/573/Screen_Shot_2016-12-06_at_17.45.52.png 2x" alt="Coherence Sign In Form"></p>
<p>It's been a long while since I got excited by a simple sign in page!</p>
<h3>Ex Admin (ActiveAdmin alternative)</h3>
<p>Then, the next step I usually like to do is to add a simple Administration interface. To that end I found the <a href="https://github.com/smpallen99/ex_admin">Ex Admin</a>, that's been under heavy development since at least May of 2015. It's so damn close to ActiveAdmin that it's old theme will make you forget you're not in a Rails application.</p>
<p>Again, it's pretty straightforward to set it up by just following their <a href="https://github.com/smpallen99/ex_admin">README</a> instructions.</p>
<p>Once you have it installed and configure, you can very quickly expose the User model into the Admin interface like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix admin.gen.resource User<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we can edit the <code>web/admin/user.ex</code> with the following:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">ExAdmin</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExAdmin</span>.<span style="color:#036;font-weight:bold">Register</span><tt>
</tt><tt>
</tt>  register_resource <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    index <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      selectable_column<tt>
</tt><tt>
</tt>      column <span style="color:#A60">:id</span><tt>
</tt>      column <span style="color:#A60">:name</span><tt>
</tt>      column <span style="color:#A60">:email</span><tt>
</tt>      column <span style="color:#A60">:last_sign_in_at</span><tt>
</tt>      column <span style="color:#A60">:last_sign_in_ip</span><tt>
</tt>      column <span style="color:#A60">:sign_in_count</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    show _user <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      attributes_table <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        row <span style="color:#A60">:id</span><tt>
</tt>        row <span style="color:#A60">:name</span><tt>
</tt>        row <span style="color:#A60">:email</span><tt>
</tt>        row <span style="color:#A60">:reset_password_token</span><tt>
</tt>        row <span style="color:#A60">:reset_password_sent_at</span><tt>
</tt>        row <span style="color:#A60">:locked_at</span><tt>
</tt>        row <span style="color:#A60">:unlock_token</span><tt>
</tt>        row <span style="color:#A60">:sign_in_count</span><tt>
</tt>        row <span style="color:#A60">:current_sign_in_at</span><tt>
</tt>        row <span style="color:#A60">:last_sign_in_at</span><tt>
</tt>        row <span style="color:#A60">:current_sign_in_ip</span><tt>
</tt>        row <span style="color:#A60">:last_sign_in_ip</span><tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    form user <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      inputs <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        input user, <span style="color:#A60">:name</span><tt>
</tt>        input user, <span style="color:#A60">:email</span><tt>
</tt>        input user, <span style="color:#A60">:password</span>, <span style="color:#808">type</span>: <span style="color:#A60">:password</span><tt>
</tt>        input user, <span style="color:#A60">:password_confirmation</span>, <span style="color:#808">type</span>: <span style="color:#A60">:password</span><tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Yes, this is eerily similar to the ActiveAdmin DSL. Thumbs up for the team responsible, and it really shows how Elixir is well suited for Domain Specific Languages, if you're into that.</p>
<p>If you followed the Coherence instructions, it asks you to add a <code>:protected</code> pipeline (a set of plugs) for your protected routes. For now you can add the <code>/admin</code> route to go through that pipeline. And for the uninitiated, a "plug" is similar in concept to a Rack app, or more specifically, a Rails middleware. But in Rails we only have one pipeline of middlewares. In Phoenix we can configure multiple pipelines for different set of routes (browser and api, for example).</p>
<p>So we can add the following to <code>web/router.ex</code>:</p>
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
</tt>scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/admin</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">ExAdmin</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pipe_through <span style="color:#A60">:protected</span><tt>
</tt>  admin_routes<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>With those simple contraptions in place, you will end up with something like this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/574/Screen_Shot_2016-12-06_at_17.56.17.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/574/Screen_Shot_2016-12-06_at_17.56.17.png 2x" alt="Ex Admin"></p>
<p>And if you're still not conviced, how about changing to their old theme?</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/575/Screen_Shot_2016-12-06_at_17.56.25.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/575/Screen_Shot_2016-12-06_at_17.56.25.png 2x" alt="ActiveAdmin knockoff"></p>
<p>Hell yeah! Makes me feel right at home, although I really prefer the new theme. But you could replace your ActiveAdmin-based app for this one and your users would hardly notice the small differences in the interface. The behavior is basically the same.</p>
<p>If you still have questions on how to properly configure ExAdmin, check out their <a href="https://github.com/smpallen99/contact_demo">Contact Demo</a> project, where you can find a real example.</p>
<h3>Stitching a simple Admin role</h3>
<p>Obviously, we don't want to let all authenticated user to access the Admin section.</p>
<p>So we can add a simple boolean field in the users table to indicate whether a user is an admin or not. You can change your migration to resemble this:</p>
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
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">change</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  create table(<span style="color:#A60">:users</span>, <span style="color:#808">primary_key</span>: <span style="color:#038;font-weight:bold">false</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt><tt>
</tt>    add <span style="color:#A60">:name</span>, <span style="color:#A60">:string</span><tt>
</tt>    add <span style="color:#A60">:email</span>, <span style="color:#A60">:string</span><tt>
</tt>    ...<tt>
</tt>    add <span style="color:#A60">:admin</span>, <span style="color:#A60">:boolean</span>, <span style="color:#808">default</span>: <span style="color:#038;font-weight:bold">false</span><tt>
</tt>    ...<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And you can configure the <code>priv/repos/seeds.exs</code> file to create 2 users, one admin and one guest:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">Repo</span>.delete_all <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">User</span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">User</span>.changeset(%<span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">User</span>{}, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">name: "Administrator", email: "admin@example.org", password: "password", password_confirmation: "password", admin: true</span><span style="color:#710">}</span></span>)<tt>
</tt>|&gt; <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">Repo</span>.insert!<tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">User</span>.changeset(%<span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">User</span>{}, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">name: "Guest", email: "guest@example.org", password: "password", password_confirmation: "password", admin: false</span><span style="color:#710">}</span></span>)<tt>
</tt>|&gt; <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">Repo</span>.insert!<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As this is just an exercise, you can drop the database and recreate it, like this: <code>mix do ecto.drop, ecto.setup</code>.</p>
<p>Coherence takes care of <strong>authentication</strong>, but we need to take care of <strong>authorization</strong>. You will find many examples online to something that resembles Rails' Pundit, such as <a href="https://github.com/schrockwell/bodyguard">Bodyguard</a>. But for this post I will stick to a simple Plug and create a new Router pipeline.</p>
<p>We need to create <code>lib/your_app/plugs/authorized.ex</code> and add the following:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">Plugs</span>.<span style="color:#036;font-weight:bold">Authorized</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#33B">@behaviour</span> <span style="color:#036;font-weight:bold">Plug</span><tt>
</tt><tt>
</tt>  import <span style="color:#036;font-weight:bold">Plug</span>.<span style="color:#036;font-weight:bold">Conn</span><tt>
</tt>  import <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">Controller</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>(default), <span style="color:#808">do</span>: default<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">call</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">assigns: %</span><span style="color:#710">{</span><span style="">current_user: current_user</span><span style="color:#710">}</span><span style="color:#710">}</span></span> = conn, _) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> current_user.admin <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      conn<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      conn<tt>
</tt>        |&gt; flash_and_redirect<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">call</span>(conn, _) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    conn<tt>
</tt>      |&gt; flash_and_redirect<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp flash_and_redirect(conn) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    conn<tt>
</tt>      |&gt; put_flash(<span style="color:#A60">:error</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">You do not have the proper authorization to do that</span><span style="color:#710">"</span></span>)<tt>
</tt>      |&gt; redirect(<span style="color:#808">to</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>)<tt>
</tt>      |&gt; halt<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Once a user signs in, Coherence puts the structure of the authenticated user into the <code>conn</code> (a Plug.Conn structure), so we can pattern match from it.</p>
<p>Now we need to create the router pipeline in the <code>web/router.ex</code> like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt>pipeline <span style="color:#A60">:protected_admin</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  plug <span style="color:#A60">:accepts</span>, [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">html</span><span style="color:#710">"</span></span>]<tt>
</tt>  plug <span style="color:#A60">:fetch_session</span><tt>
</tt>  plug <span style="color:#A60">:fetch_flash</span><tt>
</tt>  plug <span style="color:#A60">:protect_from_forgery</span><tt>
</tt>  plug <span style="color:#A60">:put_secure_browser_headers</span><tt>
</tt>  plug <span style="color:#036;font-weight:bold">Coherence</span>.<span style="color:#036;font-weight:bold">Authentication</span>.<span style="color:#036;font-weight:bold">Session</span>, <span style="color:#808">protected</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt>  plug <span style="color:#036;font-weight:bold">YourApp</span>.<span style="color:#036;font-weight:bold">Plugs</span>.<span style="color:#036;font-weight:bold">Authorized</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt>scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pipe_through <span style="color:#A60">:protected_admin</span><tt>
</tt>  coherence_routes <span style="color:#A60">:protected_admin</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt>scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/admin</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">ExAdmin</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pipe_through <span style="color:#A60">:protected_admin</span><tt>
</tt>  admin_routes<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <code>:protected_admin</code> pipeline is exactly the same as <code>:protected</code> but we add the newly created <code>YourApp.Plugs.Authorized</code> plug at the end. And then we change the <code>/admin</code> scope to go through this new pipeline.</p>
<p>And that's it. If you log in with the <code>guest@example.org</code> user, it will be kicked out to the homepage with a message saying that it's not authorized. If you log in with the <code>admin@example.org</code> it will be able to access the ExAdmin interface in <code>/admin</code>.</p>
<h3>Wrapping Up</h3>
<p>Even though it's now super simple to add Authentication, Administration and basic Authorization, don't be fooled, the learning curve is still steep, even if you've been a Rails developer for a while.</p>
<p>Because of what's underneath, the OTP architecture, the concepts of Applications, Supervisors, Workers, etc, it's not immediatelly simple to wrap your head around what's <strong>really</strong> going on. If you're not careful, libraries such as Coherence or ExAdmin will make you feel like it's just as simple as Rails.</p>
<p>And it's not like that. Elixir is a completely different beast. And I mean it in a bad way, on the contrary. It's meant for highly reliable and distributed systems and it demands way more knowledge, patience and training from the programmer.</p>
<p>On the other hand, exactly because libraries such as Coherence makes it a lot easier to get started, you may become more motivated to put something up and running and then investing more time really <strong>understanding</strong> what's going on underneath. So the recommendation is: get your hands dirty, get some quick instant gratification of seeing something running, and then go on and refine your knowledge. It will be way more rewarding if you do so.</p>
<p>I don't see Phoenix meant to just be a Rails replacement. This would be too easy. I see it more as another piece to make Elixir the best suited set of technologies to build <strong>highly scalable, highly reliable, highly distributed systems</strong>. Stopping at simple web applications would not fulfill Elixir's potential.</p>
<p></p>
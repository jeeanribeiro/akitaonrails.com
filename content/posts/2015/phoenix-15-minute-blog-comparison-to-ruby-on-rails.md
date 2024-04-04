---
title: "Phoenix \"15 Minute Blog\" comparison to Ruby on Rails"
date: "2015-11-20T19:52:00.000Z"
tags: []
years: "2015"
---

<p></p>
<p><em>Update 11/23/15:</em> Chris McCord, Phoenix creator, just posted an article explaining why <a href="https://dockyard.com/blog/2015/11/18/phoenix-is-not-rails">"Phoenix is not Rails"</a> It goes in detail in many things I described in this article and I highly recommend you read it too.</p>
<p>If you've been following the Elixir blogosphere, chances are that you stumbled upon <a href="https://medium.com/@diamondgfx">Brandon Richey's</a> take on the classic "15 minute blog". If you didn't you must read at least <a href="https://medium.com/@diamondgfx/introduction-fe138ac6079d#.ffl48saew">Part 1</a> and <a href="https://t.co/DjGDek1ZOk">Part 2</a>. It's a very detailed tutorial that will make it easier to get your fingers wet with Phoenix goodness.</p>
<p>This post is intended for Rails programmers wanting to know how the Phoenix Framework compare. It's not a completely fair comparison as this is just the good old nested resources "hello world" exercise. This will only scratch the surface but should serve as a good introduction.</p>
<p>For better or for worse, many still consider Ruby on Rails to be the best DSL for a web application. Rails was successful in creating a very recognizable vocabulary to describe each component of a web project. And I will argue that one of Phoenix's strenghts is to successfully borrow the same metaphor. This definitely makes the learning curve much smoother.</p>
<p>If you just want to clone the exercises and jump right into the code itself, I have the original <a href="https://github.com/akitaonrails/pxblog_phoenix_exercise">Pxblog in Phoenix</a> and the comparison <a href="https://github.com/akitaonrails/pxblog_rails_exercise">Pxblog in Rails</a>.</p>
<p></p>
<p></p>
<h3>Getting Started: command line and folder structure</h3>
<p>Without further ado, let's start comparing the basic console commands:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rails new pxblog<tt>
</tt>rails g scaffold Post title:string body:string<tt>
</tt>rails g scaffold User username:string email:string password_digest:string<tt>
</tt>rake db:create<tt>
</tt>rake db:migrate<tt>
</tt>rails g migration AddUserIdToPosts<tt>
</tt>rails server<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix phoenix.new pxblog<tt>
</tt>mix phoenix.gen.html Post posts title:string body:string<tt>
</tt>mix phoenix.gen.html User users username:string email:string password_digest:string<tt>
</tt>mix ecto.create<tt>
</tt>mix ecto.migrate<tt>
</tt>mix ecto.gen.migration add_user_id_to_posts<tt>
</tt>mix phoenix.server<tt>
</tt># iex -S mix phoenix.server to start within IEx and be able to IEx.pry<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Right off the bat we feel at home. In the Rails world we have both the <tt>rails</tt> command competing with traditional <tt>rake</tt> task managers. At the Phoenix side, they fortunatelly concentrated everything under the Elixir built-in <tt>mix</tt> command. There seems to be discussions for the Rails command tasks to be moved to Rake where they belong, but it's not coming soon.</p>
<p>As it is all under Mix territory, you can list Phoenix related tasks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ mix help | grep -i phoenix<tt>
</tt><tt>
</tt>mix phoenix.digest      # Digests and compress static files<tt>
</tt>mix phoenix.gen.channel # Generates a Phoenix channel<tt>
</tt>mix phoenix.gen.html    # Generates controller, model and views for an HTML based resource<tt>
</tt>mix phoenix.gen.json    # Generates a controller and model for a JSON based resource<tt>
</tt>mix phoenix.gen.model   # Generates an Ecto model<tt>
</tt>mix phoenix.gen.secret  # Generates a secret<tt>
</tt>mix phoenix.new         # Create a new Phoenix v1.0.3 application<tt>
</tt>mix phoenix.routes      # Prints all routes<tt>
</tt>mix phoenix.server      # Starts applications and their servers<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The directory structure that <tt>phoenix.new</tt> generates is slightly different from Rails though:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">/_build              # binary stuff mix compiles (ignore)<tt>
</tt>/config<tt>
</tt>- config.exs         # think Rails' /config/application.rb<tt>
</tt>- dev.exs            # think Rails' /config/environments/development.rb<tt>
</tt>- prod.exs           # think Rails' /config/environments/production.rb<tt>
</tt>- prod.secret.exs    # think Rails' /config/secrets.yml<tt>
</tt>- test.exs           # think Rails' /config/environments/test.rb<tt>
</tt>/deps                # where mix deps.get put dependencies<tt>
</tt>/lib<tt>
</tt>  /pxblog<tt>
</tt>    - endpoint.ex    # a bit like config.ru and application.rb<tt>
</tt>    - repo.ex        # setup for Ecto<tt>
</tt>  - pxblog.ex        # where you can setup OTP apps supervision tree <tt>
</tt>/node_modules        # Phoenix integrates with Node.js<tt>
</tt>/priv<tt>
</tt>  /repo<tt>
</tt>    /migrations      # think Rails' /db/migrate<tt>
</tt>    - seeds.exs      # think Rails' /db/seeds.rb<tt>
</tt>  /static            # think Rails' /public<tt>
</tt>    /css<tt>
</tt>    /images<tt>
</tt>    /js<tt>
</tt>/test                # think Rails' /test<tt>
</tt>  /channels<tt>
</tt>  /controllers<tt>
</tt>  /models<tt>
</tt>  /support<tt>
</tt>  /views<tt>
</tt>  - test_helper.exs  # think Rails' /test/test_helper.rb<tt>
</tt>/web                 # think Rails' /app<tt>
</tt>  /channels          # think Rails 5's ActionCable channels<tt>
</tt>  /controllers<tt>
</tt>  /models<tt>
</tt>  /static            # think Rails' /app/assets<tt>
</tt>    /assets<tt>
</tt>      /images<tt>
</tt>      /css<tt>
</tt>      /js<tt>
</tt>      /vendor<tt>
</tt>  /templates         # think Rails' /app/views<tt>
</tt>    /layout<tt>
</tt>  /views             # think Rails' /app/helpers but with Presenters<tt>
</tt>    - layout_view.ex<tt>
</tt>  - router.ex        # think Rails' /config/routes.rb<tt>
</tt>  - web.ex           # macros to configure each MVC component<tt>
</tt>- .gitignore<tt>
</tt>- README.md<tt>
</tt>- brunch-config.js  # front-end dev reloading is controlled with Brunch<tt>
</tt>- mix.exs           # think Ruby's Gemfile (with extras)<tt>
</tt>- package.json      # Node.js dependencies<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In Rails, the starting point is the <tt>config.ru</tt> Rackup application (as Rails became a Rack app since 3.0). It then load the <tt>config/environment.rb</tt>, then <tt>config/application.rb</tt>, then <tt>config/boot.rb</tt> which loads the gems declared in the <tt>Gemfile</tt>, together with <tt>config/initializers/*.rb</tt> and each file in <tt>config/environments</tt> we setup the Rails::Application and plug in configuration, the pipeline of Rack Middlewares.</p>
<p>In Phoenix, the starting point - as in any Elixir app -- is the <tt>mix.exs</tt> file. In this case it points to the "Pxblog" OTP/Phoenix app defined in <tt>lib/pxblog/pxblog.ex</tt>. In turn it starts up and supervises the "Pxblog.Endpoint" and "Pxblog.Repo" apps, which are defined in <tt>lib/pxblog/endpoint.ex</tt> and <tt>lib/pxblog/repo.ex</tt>, respectivelly.</p>
<p>If you build other OTP apps, this is where you can add to the OTP Supervisor Tree. I could say that it could be something akin of a Rails Engine, although technically it is not the same thing, but possibly this metaphor will do.</p>
<p>One main aspect of Rails is how it divides development, test, and production configuration in different files. Phoenix has the same thing at <tt>dev.exs</tt>, <tt>test.exs</tt>, and <tt>prod.exs</tt>. This is actually a <a href="https://elixir-lang.org/getting-started/mix-otp/introduction-to-mix.html#environments">Mix feature</a>. Mix is a more accomplished version of Rake, and it makes sense as José Valim also tried to push Thor to replace Rake, althought it never picked up steam in the Ruby community (Rake being so ingrained everywhere). Web frameworks that don't enforce separation of environments by default, at this day and age, are useless. The cool thing is that every Elixir app generated through Mix get this same useful feature.</p>
<p>Instead of having a <tt>database.yml</tt>, the database configuration is spread through the environment configuration files and the production settings are in a separated <tt>prod.secret.exs</tt> file, which is obviously ignored in <tt>.gitignore</tt>, like Rails' <tt>secrets.yml</tt> file.</p>
<h3>MVC structure</h3>
<p>You will see that each element of the MVC app in Phoenix start like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/page_controller.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">PageController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888"># web/models/post.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Post</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:model</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888"># web/views/post_view.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">PostView</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:view</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#888"># web/router.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Router</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:router</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This <tt>Pxblog.Web</tt> module is defined in the <tt>web/web.ex</tt> like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/web.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">model</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      use <span style="color:#036;font-weight:bold">Ecto</span>.<span style="color:#036;font-weight:bold">Model</span><tt>
</tt><tt>
</tt>      import <span style="color:#036;font-weight:bold">Ecto</span>.<span style="color:#036;font-weight:bold">Changeset</span><tt>
</tt>      import <span style="color:#036;font-weight:bold">Ecto</span>.<span style="color:#036;font-weight:bold">Query</span>, <span style="color:#808">only</span>: [<span style="color:#808">from</span>: <span style="color:#00D;font-weight:bold">1</span>, <span style="color:#808">from</span>: <span style="color:#00D;font-weight:bold">2</span>]<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">controller</span> <span style="color:#080;font-weight:bold">do</span> ...<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">view</span> <span style="color:#080;font-weight:bold">do</span> ...<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">router</span> <span style="color:#080;font-weight:bold">do</span> ...<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">channel</span> <span style="color:#080;font-weight:bold">do</span> ...<tt>
</tt><tt>
</tt>  <span style="color:#33B">@doc</span> <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style=""><tt>
</tt>  When used, dispatch to the appropriate controller/view/etc.<tt>
</tt>  </span><span style="color:#710">"</span></span><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span><tt>
</tt>  defmacro __using__(which) <span style="color:#080;font-weight:bold">when</span> is_atom(which) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    apply(__MODULE__, which, [])<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you haven't yet, this is a good time to learn about <a href="https://elixir-lang.org/getting-started/meta/macros.html">Elixir Macros</a>. Think of the code in the <tt>quote</tt> block as being "injected" in each module that calls <tt>use Pxblog.Web</tt>. When you <tt>use</tt> a module it calls the <tt><strong>using</strong></tt> macro. Think of it like a Ruby Module Mixin calling the <tt>included</tt> callback and executing a <tt>class_eval</tt>. As there is no concept of Classes and subclasses, we include mixins in each class to acquire the desired behaviours.</p>
<h3>MVC Router</h3>
<p>Different from Rails <tt>config/routes.rb</tt> which defines routes, the <tt>web/router.ex</tt> defines not only the routes themselves but also transformation pipelines and routing strategies:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/router.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Router</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:router</span><tt>
</tt><tt>
</tt>  pipeline <span style="color:#A60">:browser</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    plug <span style="color:#A60">:accepts</span>, [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">html</span><span style="color:#710">"</span></span>]<tt>
</tt>    plug <span style="color:#A60">:fetch_session</span><tt>
</tt>    plug <span style="color:#A60">:fetch_flash</span><tt>
</tt>    plug <span style="color:#A60">:protect_from_forgery</span><tt>
</tt>    plug <span style="color:#A60">:put_secure_browser_headers</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  pipeline <span style="color:#A60">:api</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    plug <span style="color:#A60">:accepts</span>, [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">json</span><span style="color:#710">"</span></span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">Pxblog</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    pipe_through <span style="color:#A60">:browser</span> <span style="color:#888"># Use the default browser stack</span><tt>
</tt><tt>
</tt>    get <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">PageController</span>, <span style="color:#A60">:index</span><tt>
</tt>    resources <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/users</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">UserController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      resources <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/posts</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">PostController</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    resources <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/sessions</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">SessionController</span>, <span style="color:#808">only</span>: [<span style="color:#A60">:new</span>, <span style="color:#A60">:create</span>, <span style="color:#A60">:delete</span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#888"># Other scopes may use custom stacks.</span><tt>
</tt>  <span style="color:#888"># scope "/api", Pxblog do</span><tt>
</tt>  <span style="color:#888">#   pipe_through :api</span><tt>
</tt>  <span style="color:#888"># end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You have to read it like this:</p>
<p>The <tt>pipeline</tt> block plugs "filters". They are similar to Rack middlewares that we define in <tt>config/application.rb</tt> in Rails. This is very clever because one key different between vanilla Ruby on Rails and the <a href="https://github.com/rails-api/rails-api">Rails-API project</a> is the removal of unneeded Rack middlewares that API endpoints don't need.</p>
<p>In Phoenix we can define one pipeline for web browsers and another for API clients, and you see that the difference is the removal of Plugs.</p>
<p>Then we define the scopes based on the root paths. There is one scope "/" which connectes to the <tt>:browser</tt> pipeline and an optional (commented out) scope "/api" which pipes through the <tt>:api</tt> pipeline.</p>
<p>Inside the scope block, it's very similar to the Restful DSL to define routes, which again is a good adaptation from Rails Routes. <a href="https://www.phoenixframework.org/docs/routing">Read the documentation</a> to know the details.</p>
<p>Also similar to Rails Routes, it generates proper URL helpers that become available in Controllers, Views and Templates. Let's start seeing some Rails URL helpers in code:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/posts/edit.html.erb --&gt;</span><tt>
</tt><span style="color:#888">&lt;%= link_to 'Show', [@user, post] %&gt;</span><tt>
</tt><span style="color:#888">&lt;%= link_to 'Edit', edit_user_post_path(@user, post) %&gt;</span><tt>
</tt><span style="color:#888">&lt;%= link_to 'Destroy', [@user, post], method: :delete, data: { confirm: 'Are you sure?' } %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And in Phoenix:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- web/templates/post/edit.html.eex --&gt;</span><tt>
</tt><span style="color:#888">&lt;%= link "Show", to: user_post_path(@conn, :show, @user, post) %&gt;</span><tt>
</tt><span style="color:#888">&lt;%= link "Edit", to: user_post_path(@conn, :edit, @user, post) %&gt;</span><tt>
</tt><span style="color:#888">&lt;%= link "Delete", to: user_post_path(@conn, :delete, @user, post), method: :delete, data: [confirm: "Are you sure?"] %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The main URL helper in Rails is able to get an Array such as <tt>[@user, post]</tt> and execute it the same way as if we wrote <tt>user_post_path(@user, post)</tt>. One difference from Rails is that instead of creating one helper for each HTTP verb you have just one helper per resource that accepts an extra parameter to indicate the verb. So we have <tt>post_path(@conn, :edit, post)</tt> instead of the Rails way of <tt>edit_post_path(post)</tt>.</p>
<p>As with Rails middlewares, a pipeline receives the request connection and pipes it through transforming it's metadata so it cleaned up and usable within our controllers.</p>
<h3>MVC Controller</h3>
<p>In Phoenix we start a controller like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/post_controller.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">PostController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt>  <tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Post</span><tt>
</tt>  <tt>
</tt>  plug <span style="color:#A60">:scrub_params</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">post</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">when</span> action <span style="color:#080;font-weight:bold">in</span> [<span style="color:#A60">:create</span>, <span style="color:#A60">:update</span>]<tt>
</tt>  plug <span style="color:#A60">:assign_user</span><tt>
</tt>  plug <span style="color:#A60">:authorize_user</span> <span style="color:#080;font-weight:bold">when</span> action <span style="color:#080;font-weight:bold">in</span> [<span style="color:#A60">:new</span>, <span style="color:#A60">:create</span>, <span style="color:#A60">:update</span>, <span style="color:#A60">:edit</span>, <span style="color:#A60">:delete</span>]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It's similar to this Rails controller setup:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/controllers/posts_controller.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PostsController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  before_action <span style="color:#A60">:assign_user</span><tt>
</tt>  before_action <span style="color:#A60">:authorize_user</span>, <span style="color:#808">only</span>: [<span style="color:#A60">:new</span>, <span style="color:#A60">:create</span>, <span style="color:#A60">:update</span>, <span style="color:#A60">:edit</span>, <span style="color:#A60">:destroy</span>]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As you may have concluded, a <tt>plug</tt> call works a bit like a <tt>before_action</tt> pipeline. The <tt>scrub_params</tt> I believe is similar Rails' <tt>ActionDispatch::ParamParser</tt>, but I'm not sure, I know it clears out empty string values into nils so you don't update your models unnecessarily.</p>
<p>But different from Rails where a call to <tt>redirect_to</tt> halts the pipeline, we need to explicitly halt the pipeline like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defp assign_user(conn, _) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"user_id" =&gt; user_id</span><span style="color:#710">}</span></span> = conn.params<tt>
</tt>  <span style="color:#080;font-weight:bold">if</span> user = <span style="color:#036;font-weight:bold">Repo</span>.get(<span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span>, user_id) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    assign(conn, <span style="color:#A60">:user</span>, user)<tt>
</tt>  <span style="color:#080;font-weight:bold">else</span><tt>
</tt>    conn<tt>
</tt>    |&gt; put_flash(<span style="color:#A60">:error</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Invalid user!</span><span style="color:#710">"</span></span>)<tt>
</tt>    |&gt; redirect(<span style="color:#808">to</span>: page_path(conn, <span style="color:#A60">:index</span>))<tt>
</tt>    |&gt; halt()<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In Phoenix, everything revolves around a request connection transformation pipeline that you can start configuring in the Router Plugs, Controller Plugs and Controller actions. All of them receive the connection from the previous step and returns a transformed connection to the next step until it becomes a proper HTTP response. Unlike Rails, this path is much more explicit and you know that you will get this connection and you should pipe transformations through it until you render the final HTML or send back some error header.</p>
<p>To see how explicit, let's start with a normal Rails controller action:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">destroy</span><tt>
</tt>  <span style="color:#33B">@user</span> = <span style="color:#036;font-weight:bold">User</span>.find(params[<span style="color:#A60">:id</span>])<tt>
</tt>  <span style="color:#33B">@user</span>.destroy<tt>
</tt>  respond_to <span style="color:#080;font-weight:bold">do</span> |format|<tt>
</tt>    format.html { redirect_to users_url, <span style="color:#808">notice</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">User was successfully destroyed.</span><span style="color:#710">'</span></span> }<tt>
</tt>    format.json { head <span style="color:#A60">:no_content</span> }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Once upon a time, setting the flash notice message and redirecting were 2 different methods, new versions merged them together for convenience. Rails also has the concept of Responders, which Phoenix doesn't have yet (#OpportunityToContribute!).</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">delete</span>(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"id" =&gt; id</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  user = <span style="color:#036;font-weight:bold">Repo</span>.get!(<span style="color:#036;font-weight:bold">User</span>, id)<tt>
</tt>  <span style="color:#036;font-weight:bold">Repo</span>.delete!(user)<tt>
</tt>  conn<tt>
</tt>  |&gt; put_flash(<span style="color:#A60">:info</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">User deleted successfully.</span><span style="color:#710">"</span></span>)<tt>
</tt>  |&gt; redirect(<span style="color:#808">to</span>: user_path(conn, <span style="color:#A60">:index</span>))<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can see that, Responsers aside, the Phoenix version is <strong>remarkably</strong> similar. And it goes like this for all Restful actions of the controller. But more similar to the deceased Merb, each Phoenix Controller action has a proper function signature declaring the parameters it expect to receive instead of having a global <tt>params</tt> hash that needs to go through the <a href="https://github.com/rails/strong_parameters">Strong Parameters</a>.</p>
<p>For different variations of the same parameters, you can declare multiple functions with the same name but different arguments to pattern match, like in the <tt>SessionController</tt> example:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/session_controller.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">SessionController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"user" =&gt; %</span><span style="color:#710">{</span><span style="">"username" =&gt; username, "password" =&gt; password</span><span style="color:#710">}</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">when</span> <span style="color:#080;font-weight:bold">not</span> is_nil(username) <span style="color:#080;font-weight:bold">and</span> <span style="color:#080;font-weight:bold">not</span> is_nil(password) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    user = <span style="color:#036;font-weight:bold">Repo</span>.get_by(<span style="color:#036;font-weight:bold">User</span>, <span style="color:#808">username</span>: username)<tt>
</tt>    sign_in(user, password, conn)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, _) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    failed_login(conn)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Here we have the same <tt>create/2</tt> function with pattern matching and guards. The second version receives anything, in case the first version fails to pattern match against the incoming parameters. Phoenix expects roughly the same structure of parameters as Rails, so it's very intuitive to follow.</p>
<h3>MVC Models</h3>
<p>Instead of the good old ActiveRecord (ActiveModel), in Phoenix we have to deal with <a href="https://www.phoenixframework.org/docs/ecto-models">Ecto Models</a>. It already supports Postgresql, MySQL, Sqlite3, MongoDB, so you're good to go for 99% of the cases.</p>
<p>Ecto separates Model Logic from Model Persistence Management. Instead of using the Active Record design pattern, it favors the Data Mapper pattern. This is an old discussion among Railers. Many people dislike that persistence logic is kept together with business logic and the many magic metaprogramming that can make ActiveRecord both very easy to get started but very difficult to properly master.</p>
<p>You should read José Valim's post about <a href="https://blog.plataformatec.com.br/2015/08/working-with-ecto-associations-and-embeds/">Ecto Associations</a> to get started. But for now, let's compare a simple Rails and Ecto models:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/models/user.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">User</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span><tt>
</tt>  has_secure_password<tt>
</tt><tt>
</tt>  has_many <span style="color:#A60">:posts</span><tt>
</tt><tt>
</tt>  validates <span style="color:#A60">:username</span>, <span style="color:#808">presence</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt>  validates <span style="color:#A60">:email</span>, <span style="color:#808">presence</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In Rails we have the <a href="https://api.rubyonrails.org/classes/ActiveModel/SecurePassword/ClassMethods.html"><tt>ActiveSupport#has_secure_password</tt></a> which uses BCrypt underneath to generate a proper password digest. If you're building authentication from scratch you <strong>must</strong> use this construct.</p>
<p>Phoenix does not have the same feature yet (#OpportunityToContribute!) so its version is a bit more verbose to account for the BCrypt digest logic using the <a href="https://github.com/elixircnx/comeonin">Comeonin</a> password hashing library. Let's go on in small steps:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/models/user.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:model</span><tt>
</tt>  import <span style="color:#036;font-weight:bold">Comeonin</span>.<span style="color:#036;font-weight:bold">Bcrypt</span>, <span style="color:#808">only</span>: [<span style="color:#808">hashpwsalt</span>: <span style="color:#00D;font-weight:bold">1</span>]<tt>
</tt><tt>
</tt>  schema <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">users</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    field <span style="color:#A60">:username</span>, <span style="color:#A60">:string</span><tt>
</tt>    field <span style="color:#A60">:email</span>, <span style="color:#A60">:string</span><tt>
</tt>    field <span style="color:#A60">:password_digest</span>, <span style="color:#A60">:string</span><tt>
</tt><tt>
</tt>    timestamps<tt>
</tt><tt>
</tt>    <span style="color:#888"># Virtual Fields</span><tt>
</tt>    field <span style="color:#A60">:password</span>, <span style="color:#A60">:string</span>, <span style="color:#808">virtual</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt>    field <span style="color:#A60">:password_confirmation</span>, <span style="color:#A60">:string</span>, <span style="color:#808">virtual</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>    has_many <span style="color:#A60">:posts</span>, <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Post</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The first part of Ecto Models declare the database fields, virtual fields and associations. Rails ActiveRecord prefer the approach of asking the database to send the table metadata and use metaprogramming to create all the fields later in runtime. Many people dislike this approach and this is the alternative: explicit declaration.</p>
<p>We are mapping the <tt>User</tt> module with the <tt>'users'</tt> database table in the <tt>schema "users" do</tt> statement instead of resorting to pluralization conventions.</p>
<p>The last line has our well known <tt>has_many</tt> association.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#33B">@required_fields</span> ~w(username email password password_confirmation)<tt>
</tt>  <span style="color:#33B">@optional_fields</span> ~w()<tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Here we have declare required fields, this is just a variable with a list of fields not the validations themselves. This will be used in the next step to accomplish something similar to <tt>validates :username, presence: true</tt>.</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">changeset</span>(model, params <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#A60">:empty</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    model<tt>
</tt>    |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)<tt>
</tt>    |&gt; hash_password<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Instead of doing something like <tt>Post.create(params)</tt> we first create a changeset and then pass it to the Ecto main Repository. The Repository is then responsible for the persistence part. The Ecto Model is responsible for validating and cleaning up the changeset that the Repository receives.</p>
<p>The <tt>changeset/2</tt> returns an <a href="https://elixir-lang.org/getting-started/structs.html">Elixir Struct</a> for us to work with before passing it to the Repository application for persistence.</p>
<p>In this function we can declare a pipeline of validations, constraints and other attribute transformations. For example, we plug a <tt>hash_password/2</tt> function that will get the value in <tt>password</tt> and use Comeonin.<tt>hashpwsalt/1</tt> to transform the password string in a bcrypt digest and store it in the password_digest attribute:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  defp hash_password(changeset) <span style="color:#080;font-weight:bold">do</span> ...<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> password = get_change(changeset, <span style="color:#A60">:password</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      changeset<tt>
</tt>      |&gt; put_change(<span style="color:#A60">:password_digest</span>, hashpwsalt(password))<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      changeset<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we return the transformed changeset so the pipeline can pick it up and pass to other plugs, such as validations. If we wanted to add more validations we could do it like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">changeset</span>(model, params <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#A60">:empty</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    model<tt>
</tt>    |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)<tt>
</tt>    |&gt; validate_length(<span style="color:#A60">:password</span>, <span style="color:#808">min</span>: <span style="color:#00D;font-weight:bold">3</span>, <span style="color:#808">max</span>: <span style="color:#00D;font-weight:bold">100</span>)<tt>
</tt>    |&gt; validate_length(<span style="color:#A60">:username</span>, <span style="color:#808">min</span>: <span style="color:#00D;font-weight:bold">5</span>, <span style="color:#808">max</span>: <span style="color:#00D;font-weight:bold">50</span>)<tt>
</tt>    |&gt; validate_confirmation(<span style="color:#A60">:password</span>)<tt>
</tt>    |&gt; unique_constraint(<span style="color:#A60">:username</span>)<tt>
</tt>    |&gt; hash_password<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>There you go. And in the controller, the <tt>update/2</tt> function, for example, will use the changeset like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">update</span>(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"id" =&gt; id, "user" =&gt; user_params</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  user = <span style="color:#036;font-weight:bold">Repo</span>.get!(<span style="color:#036;font-weight:bold">User</span>, id)<tt>
</tt>  changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(user, user_params)<tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">Repo</span>.update(changeset) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In the second line we use the Repository to query the 'users' schema as declared in the <tt>User</tt> model.</p>
<p>Then, we transform the <tt>user</tt> struct with the <tt>user_params</tt> map that we received from the Router pipeline, as defined in the first line.</p>
<p>The transformation returns a changeset, which will contain error messages. Then we pass the changeset to the Repository again so it updates the record in the table.</p>
<h3>MVC View and Templates</h3>
<p>In the case of the <tt>edit/2</tt> function we call the <tt>render/3</tt> function like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/views/user_view.ex</span><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">edit</span>(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"id" =&gt; id</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  user = <span style="color:#036;font-weight:bold">Repo</span>.get!(<span style="color:#036;font-weight:bold">User</span>, id)<tt>
</tt>  changeset = <span style="color:#036;font-weight:bold">User</span>.changeset(user)<tt>
</tt>  render(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">edit.html</span><span style="color:#710">"</span></span>, <span style="color:#808">user</span>: user, <span style="color:#808">changeset</span>: changeset)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This first calls the <tt>web/views/user.ex</tt> which import stuff like helpers, transforms the <tt>user</tt> and <tt>changeset</tt> variables into <a href="https://elixir-lang.org/getting-started/module-attributes.html">module attributes</a> (the ones starting with "@" if you've been wondering what those are). And the View knows to find the <tt>edit.html</tt> template at <tt>web/templates/user/edit.html.eex</tt> because it says so in <tt>web/web.ex</tt>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/web.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  ...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">view</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    quote <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      use <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">View</span>, <span style="color:#808">root</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">web/templates</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt>      <span style="color:#888"># Import convenience functions from controllers</span><tt>
</tt>      import <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">Controller</span>, <span style="color:#808">only</span>: [<span style="color:#808">get_csrf_token</span>: <span style="color:#00D;font-weight:bold">0</span>, <span style="color:#808">get_flash</span>: <span style="color:#00D;font-weight:bold">2</span>, <span style="color:#808">view_module</span>: <span style="color:#00D;font-weight:bold">1</span>]<tt>
</tt><tt>
</tt>      <span style="color:#888"># Use all HTML functionality (forms, tags, etc)</span><tt>
</tt>      use <span style="color:#036;font-weight:bold">Phoenix</span>.<span style="color:#036;font-weight:bold">HTML</span><tt>
</tt><tt>
</tt>      import <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Router</span>.<span style="color:#036;font-weight:bold">Helpers</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I did not copy and paste all the other macros in <tt>web/web.ex</tt> but check them out to see what models, controllers, router, channel import in each module you create.</p>
<p>In Rails we have the default ERB for "Embedded Ruby" and in Phoenix we have "EEX" for "Embedded Elixir", it's essencially the same thing: an HTML template that accepts snippets of Elixir code enclosed between <tt>&lt;%= ... %&gt;</tt>. So, the <tt>edit.html.eex</tt> template looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/users/edit.html.erb --&gt;</span><tt>
</tt><span style="color:#070">&lt;h2&gt;</span>Edit user<span style="color:#070">&lt;/h2&gt;</span><tt>
</tt><tt>
</tt><span style="color:#888">&lt;%= render "form.html", changeset: @changeset,<tt>
</tt>                        action: user_path(@conn, :update, @user) %&gt;</span><tt>
</tt><tt>
</tt><span style="color:#888">&lt;%= link 'Back', to: user_path(@conn, :show, @user) %&gt;</span> |<tt>
</tt><span style="color:#888">&lt;%= link "Back", to: user_path(@conn, :index) %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Which is very similar to the equivalent <tt>edit.html.erb</tt> in Rails:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- web/templates/user/edit.html.eex --&gt;</span><tt>
</tt><span style="color:#070">&lt;h1&gt;</span>Editing User<span style="color:#070">&lt;/h1&gt;</span><tt>
</tt><tt>
</tt><span style="color:#888">&lt;%= render 'form' %&gt;</span><tt>
</tt><tt>
</tt><span style="color:#888">&lt;%= link_to 'Show', @user %&gt;</span> |<tt>
</tt><span style="color:#888">&lt;%= link_to 'Back', users_path %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The Phoenix version is slightly more verbose in order to not hide too much as Rails does. One can argue if more or less magic makes it more productive or not, but the Phoenix version being more explicit leaves a trail of breadcrumbs that is easier to follow, specially if you're just getting started. Here we have no concept of "partials", every template can render any other template, we just need to pass through the necessary variable for the template to function. But instead of passing a model instance we are passing a changeset.</p>
<p>The "form.html" template is also very similar, let's check out the Phoenix version first:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- web/templates/user/edit.html.eex --&gt;</span><tt>
</tt><span style="color:#888">&lt;%= form_for @changeset, @action, fn f -&gt; %&gt;</span><tt>
</tt>  <span style="color:#888">&lt;%= if @changeset.action do %&gt;</span><tt>
</tt>    <span style="color:#070">&lt;div</span> <span style="color:#007">class</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">alert alert-danger</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>      <span style="color:#070">&lt;p&gt;</span>Oops, something went wrong! Please check the errors below:<span style="color:#070">&lt;/p&gt;</span><tt>
</tt>      <span style="color:#070">&lt;ul&gt;</span><tt>
</tt>        <span style="color:#888">&lt;%= for {attr, message} &lt;- f.errors do %&gt;</span><tt>
</tt>          <span style="color:#070">&lt;li&gt;</span><span style="color:#888">&lt;%= humanize(attr) %&gt;</span> <span style="color:#888">&lt;%= message %&gt;</span><span style="color:#070">&lt;/li&gt;</span><tt>
</tt>        <span style="color:#888">&lt;% end %&gt;</span><tt>
</tt>      <span style="color:#070">&lt;/ul&gt;</span><tt>
</tt>    <span style="color:#070">&lt;/div&gt;</span><tt>
</tt>  <span style="color:#888">&lt;% end %&gt;</span><tt>
</tt><tt>
</tt>  <span style="color:#070">&lt;div</span> <span style="color:#007">class</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">form-group</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= label f, :username, "Username", class: "control-label" %&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= text_input f, :username, class: "form-control" %&gt;</span><tt>
</tt>  <span style="color:#070">&lt;/div&gt;</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now the Rails ERB version:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/users/_form.html.erb --&gt;</span><tt>
</tt><span style="color:#888">&lt;%= form_for(@user) do |f| %&gt;</span><tt>
</tt>  <span style="color:#888">&lt;% if @user.errors.any? %&gt;</span><tt>
</tt>    <span style="color:#070">&lt;div</span> <span style="color:#007">id</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">error_explanation</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>      <span style="color:#070">&lt;h2&gt;</span><span style="color:#888">&lt;%= pluralize(@user.errors.count, "error") %&gt;</span> prohibited this user from being saved:<span style="color:#070">&lt;/h2&gt;</span><tt>
</tt><tt>
</tt>      <span style="color:#070">&lt;ul&gt;</span><tt>
</tt>      <span style="color:#888">&lt;% @user.errors.full_messages.each do |message| %&gt;</span><tt>
</tt>        <span style="color:#070">&lt;li&gt;</span><span style="color:#888">&lt;%= message %&gt;</span><span style="color:#070">&lt;/li&gt;</span><tt>
</tt>      <span style="color:#888">&lt;% end %&gt;</span><tt>
</tt>      <span style="color:#070">&lt;/ul&gt;</span><tt>
</tt>    <span style="color:#070">&lt;/div&gt;</span><tt>
</tt>  <span style="color:#888">&lt;% end %&gt;</span><tt>
</tt><tt>
</tt>  <span style="color:#070">&lt;div</span> <span style="color:#007">class</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">field</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= f.label :username %&gt;</span><span style="color:#070">&lt;br&gt;</span><tt>
</tt>    <span style="color:#888">&lt;%= f.text_field :username %&gt;</span><tt>
</tt>  <span style="color:#070">&lt;/div&gt;</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remarkably similar. There are language specific stuff like having <tt>label(f, :username)</tt> instead of <tt>f.label :username</tt>. Because in Elixir the parenthesis are also optional and because Phoenix implements helpers that are very similar to the Rails version, like "form_for", we feel very comfortable very fast.</p>
<p>Rails has a default layout at <tt>app/views/layouts/application.html.erb</tt> and Phoenix has a default layout at <tt>web/templates/layout/app.html.eex</tt>. The rest is pretty much the same.</p>
<p>The <tt>mix phoenix.gen.html</tt> creates a template structure that is similar to <tt>rails generate scaffold</tt> command.</p>
<p>What Phoenix calls "views" is more similar to what Rails calls "helpers". We can use them similarly, for example, to access the current user session, we do like this in Phoenix <tt>web/views/layout_view.ex</tt>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/views/layout_view.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">LayoutView</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:view</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">current_user</span>(conn) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Plug</span>.<span style="color:#036;font-weight:bold">Conn</span>.get_session(conn, <span style="color:#A60">:current_user</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Which is almost the same as <tt>app/helpers/application.rb</tt> in Rails:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/helpers/application.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">ApplicationHelper</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">current_user</span><tt>
</tt>    session[<span style="color:#A60">:current_user</span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, Phoenix default scaffolding already brings in Bootstrap so it looks much nicer than the 10 years old "scaffold.css" that Rails generates by default. There are many gems that override that though.</p>
<h3>Tests</h3>
<p>The last thing is the testing system. Rails uses Minitest, Elixir uses ExUnit. Again, the helpers are so similar that you can translate almost directly from Phoenix to Rails and vice versa.</p>
<p>As a caveat, Rails tests evolved a lot in the past decade. Even without adding extra features such as Factory Girl, the standard Fixtures still don't have equivalent in Phoenix (#OpportunityToContribute!).</p>
<p>Let's start seeing a small model test in Phoenix:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># test/models/post_test.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">PostTest</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">ModelCase</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">Post</span><tt>
</tt><tt>
</tt>  <span style="color:#33B">@valid_attrs</span> %{<span style="color:#808">body</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">some content</span><span style="color:#710">"</span></span>, <span style="color:#808">title</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">some content</span><span style="color:#710">"</span></span>}<tt>
</tt>  <span style="color:#33B">@invalid_attrs</span> %{}<tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">changeset with valid attributes</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    changeset = <span style="color:#036;font-weight:bold">Post</span>.changeset(%<span style="color:#036;font-weight:bold">Post</span>{}, <span style="color:#33B">@valid_attrs</span>)<tt>
</tt>    assert changeset.valid?<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">changeset with invalid attributes</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    changeset = <span style="color:#036;font-weight:bold">Post</span>.changeset(%<span style="color:#036;font-weight:bold">Post</span>{}, <span style="color:#33B">@invalid_attrs</span>)<tt>
</tt>    refute changeset.valid?<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And the same unit tests in Rails:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># test/models/post_test.rb</span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">test_helper</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PostTest</span> &lt; <span style="color:#036;font-weight:bold">ActiveSupport</span>::<span style="color:#036;font-weight:bold">TestCase</span><tt>
</tt>  setup <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#33B">@valid_attr</span> = {<span style="color:#808">body</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">some content</span><span style="color:#710">"</span></span>, <span style="color:#808">title</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">some content</span><span style="color:#710">"</span></span>}<tt>
</tt>    <span style="color:#33B">@invalid_attr</span> = {}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">with valid attributes</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    post = <span style="color:#036;font-weight:bold">Post</span>.new(<span style="color:#33B">@valid_attr</span>)<tt>
</tt>    assert post.valid?<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">with invalida attributes</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    post = <span style="color:#036;font-weight:bold">Post</span>.new(<span style="color:#33B">@invalid_attr</span>)<tt>
</tt>    refute post.valid?<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span> <tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remarkably similar. For the test data, in Phoenix we are using simple Elixir's module attributes, in Rails we put in the setup step to create instance variables. They are not the same thing, but the result is similar. Again, in Rails we test the model, in Phoenix we test the changeset.</p>
<p>Now let's see some bits of a controller test. As I said before, because Phoenix does not have a Fixtures or Factory feature in place (although the nice guys at Thoughtbot just released a Factory Girl-like library for Phoenix called <a href="https://robots.thoughtbot.com/announcing-ex-machina">ExMachina</a>) we have to do a bit more setup:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># test/controllers/session_controller.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">SessionControllerTest</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">ConnCase</span><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">Pxblog</span>.<span style="color:#036;font-weight:bold">User</span><tt>
</tt><tt>
</tt>  setup <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#036;font-weight:bold">User</span>.changeset(%<span style="color:#036;font-weight:bold">User</span>{}, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">username: "test", password: "test", password_confirmation: "test", email: "test@test.com"</span><span style="color:#710">}</span></span>)<tt>
</tt>    |&gt; <span style="color:#036;font-weight:bold">Repo</span>.insert<tt>
</tt>    conn = conn()<tt>
</tt>    {<span style="color:#A60">:ok</span>, <span style="color:#808">conn</span>: conn}<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">shows the login form</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">conn: conn</span><span style="color:#710">}</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    conn = get conn, session_path(conn, <span style="color:#A60">:new</span>)<tt>
</tt>    assert html_response(conn, <span style="color:#00D;font-weight:bold">200</span>) =~ <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Login</span><span style="color:#710">"</span></span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">creates a new user session for a valid user</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">conn: conn</span><span style="color:#710">}</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    conn = post conn, session_path(conn, <span style="color:#A60">:create</span>), <span style="color:#808">user</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">username: "test", password: "test"</span><span style="color:#710">}</span></span><tt>
</tt>    assert get_session(conn, <span style="color:#A60">:current_user</span>)<tt>
</tt>    assert get_flash(conn, <span style="color:#A60">:info</span>) == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Sign in successful!</span><span style="color:#710">"</span></span><tt>
</tt>    assert redirected_to(conn) == page_path(conn, <span style="color:#A60">:index</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The Rails controller test is getting the data from a Fixture, that's why the setup is shorter:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># test/controllers/session_controller.rb</span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">test_helper</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">SessionsControllerTest</span> &lt; <span style="color:#036;font-weight:bold">ActionController</span>::<span style="color:#036;font-weight:bold">TestCase</span><tt>
</tt>  setup <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#33B">@user</span> = users(<span style="color:#A60">:user_one</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">shows the login form</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    get <span style="color:#A60">:new</span><tt>
</tt>    assert_response <span style="color:#A60">:success</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  test <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">creates a new user session for a valid user</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    post <span style="color:#A60">:create</span>, <span style="color:#808">user</span>: {<span style="color:#808">username</span>: <span style="color:#33B">@user</span>.username, <span style="color:#808">password</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">password</span><span style="color:#710">"</span></span>}<tt>
</tt>    assert session[<span style="color:#A60">:current_user</span>]<tt>
</tt>    assert flash[<span style="color:#A60">:notice</span>] == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Sign in successful!</span><span style="color:#710">"</span></span><tt>
</tt>    assert_redirected_to user_posts_path(<span style="color:#33B">@user</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But as I said before, Phoenix implements similar helpers, so it's very straight forward to port from Rails to Phoenix here.</p>
<p>You execute the test runner in Rails with <tt>rake test</tt> and in Phoenix with <tt>mix test</tt>. Not a lot to see here. Tests load very fast, I believe they run in parallel, and it's very fast, which is a good departure from when you have a really large Rails app where a test suite can take minutes to finish.</p>
<h3>Conclusions</h3>
<p>If you came this far, you may be interested in following Brandon's tutorial and then building your own Rails copy or you can just clone from my Github repositories. <a href="https://github.com/akitaonrails/pxblog_phoenix_exercise">This is the Phoenix exercise</a> and <a href="https://github.com/akitaonrails/pxblog_rails_exercise">this is the Rails exercise</a>.</p>
<p>What you can conclude thus far is that Phoenix is already a very full featured web framework. And this is not even touching on what I think is its crown achievement: its remarkable Websockets support that recently tested and benchmarked with real machines from Digital Ocean and achieve a peak performance of <a href="https://www.akitaonrails.com/2015/10/29/phoenix-experiment-holding-2-million-websocket-clients"><strong>2 million concurrent connections</strong></a>.</p>
<p>I think this is the real use case for Phoenix: microservices to deliver on Erlang OTP's promise of hiper reliability and hiper concurrency. For that goal it's already production ready and you can use it right now. There is still much to be learned regarging proper tuning, proper monitoring, proper production environment troubleshooting, and so on, but it's getting there.</p>
<p>As a complete Ruby on Rails replacement, it is not on par yet. But it's unfair to say that because a new framework can't compete with 10 years of an entire ecosystem creating all sorts of features, tools and techniques for it. Rails is power house and it will continue to be so.</p>
<p>In this contrived example we already got one small feature we still don't have in Phoenix: the equivalent of <tt>ActiveSupport#has_secure_password</tt>. But this is not all, we still don't have the equivalents for Devise, Simple Forms, Active Admin or Rails Admin, Refile, Koala, Spree, etc. But we can have those, as the ecosystem starts to fill in the blanks (#OpportunityToContribute!) in this brand new Phoenix ecosystem. And I urge people to do so, as Thoughtbot already delivered their ExMachina so those who like Factory Girl can jump right in.</p>
<p>As it stands right now, it feels like the time when Rails 1.2 was just released, many libraries were just too young, we still didn't have mature tools. But the upper hand of Phoenix and Elixir is the decades old and battle tested Erlang core. This is something no one else has and the best way to capitalize it is to go beyond what tools like Node.js had accomplished: a truly <strong>enjoyable</strong> programming environment, with a language that was truly well designed and targets programmer happiness, with a really mature core to boot.</p>
<p>Programmers shouldn't have to be fight for small stuff. Task management? Done, use Mix. Package Management? Done, use Hex. Promises? Don't need. Require semantics? Don't need. You get the gist.</p>
<p>If you're a Rails programmer and you want to find a companion platform to increment your existing Rails solutions with highly reliable and highly concurrent microservices, Phoenix is an option ready to production right now. Jump right into it!</p>
<p></p>
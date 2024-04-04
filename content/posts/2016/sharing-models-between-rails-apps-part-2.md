---
title: "Sharing models between Rails Apps - Part 2"
date: "2016-10-03T18:57:00.000Z"
tags: ["database"]
years: "2016"
---

<p></p>
<p>Let's continue from where I left off in <a href="http://www.akitaonrails.com/2016/10/03/sharing-models-between-rails-apps-part-1">Part 1</a> where I quickly described how you can extract reusable model logic from a Rails app into a testable Rubygem.</p>
<p>If I were building a secondary Rails app connecting directly to the same database as the first, I could just add the dependency to the extracted gem:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">central-support</span><span style="color:#710">'</span></span>, <span style="color:#808">github</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">Codeminer42/cm42-central-support</span><span style="color:#710">'</span></span>, <span style="color:#808">branch</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">master</span><span style="color:#710">'</span></span>, <span style="color:#808">require</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">central/support</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>Then recreate the models including the same Concerns, and make sure I remove the ability to <code>bin/rails db:migrate</code> from the secondary app (by creating empty db tasks with the same name, for example).</p>
<p>By the way, this is one big caveat that I didn't address in Part 1: up to this point, the schema was <strong>frozen</strong> in the <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/spec/support/rails_app/db/schema.rb">central-support gem</a>.</p>
<p>From now on, you must control the evolution of the tables mapped in the gem from within the gem. The best approach is to use the <code>spec/support/rails_app</code> and normally create new migration with <code>bin/rails g migration</code> from there. Then you must move the migration to the <code>lib/generators/central/templates/migrations</code> folder.</p>
<p>The <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/lib/generators/central/install_generator.rb"><code>lib/generators/central/install_generator.rb</code></a> will take care of making a <code>central:install</code> task available that will dutifully put new migrations into your application's <code>db/migrate</code> folder as usual. You just have to <code>bundle update central-support</code> to get the newest changes, run <code>bin/rails g central:install</code> to create the new migrations (it will automatically skip existing ones) and run the normal <code>bin/rails db:migrate</code>. A migration generator code is very simple, you can do it like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">securerandom</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/generators</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/generators/base</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/generators/active_record</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Central</span><tt>
</tt>  <span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Generators</span><tt>
</tt>    <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">InstallGenerator</span> &lt; <span style="color:#036;font-weight:bold">Rails</span>::<span style="color:#036;font-weight:bold">Generators</span>::<span style="color:#036;font-weight:bold">Base</span><tt>
</tt>      include <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Generators</span>::<span style="color:#036;font-weight:bold">Migration</span><tt>
</tt><tt>
</tt>      source_root <span style="color:#036;font-weight:bold">File</span>.expand_path(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">../templates</span><span style="color:#710">"</span></span>, <span style="color:#038;font-weight:bold">__FILE__</span>)<tt>
</tt><tt>
</tt>      <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create_migrations</span><tt>
</tt>        <span style="color:#036;font-weight:bold">Dir</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#038;font-weight:bold">self</span>.class.source_root<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/migrations/*.rb</span><span style="color:#710">"</span></span>].sort.each <span style="color:#080;font-weight:bold">do</span> |filepath|<tt>
</tt>          name = <span style="color:#036;font-weight:bold">File</span>.basename(filepath)<tt>
</tt>          migration_template <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">migrations/</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>name<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db/migrate/</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>name<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>, <span style="color:#808">skip</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt>          sleep <span style="color:#00D;font-weight:bold">1</span><tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <code>migration_template</code> will take care of adding the proper timestamp to the migration file, so you don't have to add it manually and the template file name can something plain such as <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/lib/generators/central/templates/migrations/add_role_field_to_users.rb"><code>migrations/add_role_field_to_user.rb</code></a>.</p>
<p>All that having being said, there is a second challenge I added to my internal secondary app: I wanted it to have it's own main database and use Central's database as a secondary read-only source.</p>
<p>So migrations in the secondary app (let's just call it Central-2) will run against it's own main database, not against the main Central's database. This add the following problem: the test suite must be able to create and migrate both test databases, in isolation from Central. Only in production should Central-2 connect to Central's database.</p>
<p>Every Rails application has a <code>config/database.yml.sample</code> and a <code>db/schema.rb</code>, so I started by creating a <code>config/database_central.yml.sample</code> and a <code>db_central/schema.rb</code>.</p>
<p>The <code>config/database_central.yml.sample</code> is already interesting:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">development</span>:<tt>
</tt>  <span style="color:#808">adapter</span>: <span style="background-color:#fff0f0;color:#D20">postgresql</span><tt>
</tt>  <span style="color:#808">encoding</span>: <span style="background-color:#fff0f0;color:#D20">unicode</span><tt>
</tt>  <span style="color:#808">timeout</span>: <span style="background-color:#fff0f0;color:#D20">5000</span><tt>
</tt>  <span style="color:#808">database</span>: <span style="background-color:#fff0f0;color:#D20">fulcrum_development</span><tt>
</tt>  <span style="color:#808">pool</span>: <span style="background-color:#fff0f0;color:#D20">5</span><tt>
</tt><tt>
</tt><span style="color:#888"># Warning: The database defined as "test" will be erased and</span><tt>
</tt><span style="color:#888"># re-generated from your development database when you run "rake".</span><tt>
</tt><span style="color:#888"># Do not set this db to the same as development or production.</span><tt>
</tt><span style="color:#808">test</span>:<tt>
</tt>  <span style="color:#808">adapter</span>: <span style="background-color:#fff0f0;color:#D20">postgresql</span><tt>
</tt>  <span style="color:#808">encoding</span>: <span style="background-color:#fff0f0;color:#D20">unicode</span><tt>
</tt>  <span style="color:#808">timeout</span>: <span style="background-color:#fff0f0;color:#D20">5000</span><tt>
</tt>  <span style="color:#F00;background-color:#FAA">&lt;% if ENV['DATABASE_CENTRAL_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">url</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['DATABASE_CENTRAL_URL'] %&gt;</span><tt>
</tt>  <span style="color:#F00;background-color:#FAA">&lt;% else %&gt;</span><tt>
</tt>  <span style="color:#808">database</span>: <span style="background-color:#fff0f0;color:#D20">central_test</span><tt>
</tt>  <span style="color:#F00;background-color:#FAA">&lt;% end %&gt;</span><tt>
</tt>  <span style="color:#808">pool</span>: <span style="background-color:#fff0f0;color:#D20">5</span><tt>
</tt><tt>
</tt><span style="color:#808">production</span>:<tt>
</tt>  <span style="color:#808">adapter</span>: <span style="background-color:#fff0f0;color:#D20">postgresql</span><tt>
</tt>  <span style="color:#808">encoding</span>: <span style="background-color:#fff0f0;color:#D20">unicode</span><tt>
</tt>  <span style="color:#808">timeout</span>: <span style="background-color:#fff0f0;color:#D20">5000</span><tt>
</tt>  <span style="color:#808">url</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['DATABASE_CENTRAL_URL'] %&gt;</span><tt>
</tt>  <span style="color:#808">pool</span>: <span style="background-color:#fff0f0;color:#D20">&lt;%= ENV['DB_POOL'] || 5 %&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In production, it will use the <code>DATABASE_CENTRAL_URL</code> environment variable to connect to Central's main database.</p>
<p>When running tests locally, it will simply connect to a local database named <code>central_test</code>.</p>
<p>Now, while running tests at Gitlab-CI (or any other CI for that matter), I have to configure the <code>DATABASE_CENTRAL_URL</code> to point to a secondary Postgresql test database.</p>
<p>For Gitlab, this is how I configure the build script:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#808">image</span>: <span style="background-color:#fff0f0;color:#D20">codeminer42/ci-ruby:2.3</span><tt>
</tt><tt>
</tt><span style="color:#808">services</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">postgres:latest</span><tt>
</tt><tt>
</tt><span style="color:#808">cache</span>:<tt>
</tt>  <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20">central-bot</span><tt>
</tt>  <span style="color:#808">untracked</span>: <span style="background-color:#fff0f0;color:#D20">true</span><tt>
</tt>  <span style="color:#808">paths</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">.ci_cache/</span><tt>
</tt><tt>
</tt><span style="color:#808">variables</span>:<tt>
</tt>  <span style="color:#808">RAILS_ENV</span>: <span style="background-color:#fff0f0;color:#D20">test</span><tt>
</tt>  <span style="color:#808">DATABASE_URL</span>: <span style="background-color:#fff0f0;color:#D20">postgresql://postgres:@postgres</span><tt>
</tt>  <span style="color:#808">DATABASE_CENTRAL_URL</span>: <span style="background-color:#fff0f0;color:#D20">postgresql://postgres:@postgres/central_test</span><tt>
</tt><tt>
</tt><span style="color:#808">before_script</span>:<tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">bundle install --without development production -j $(nproc) --path .ci_cache</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">cp config/database.yml.sample config/database.yml</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">cp config/database_central.yml.sample config/database_central.yml</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">bin/rails --trace central:db:create central:db:schema:load</span><tt>
</tt>  - <span style="background-color:#fff0f0;color:#D20">bin/rails --trace db:create db:schema:load</span><tt>
</tt><tt>
</tt><span style="color:#808">test</span>:<tt>
</tt>  <span style="color:#808">script</span>:<tt>
</tt>    - <span style="background-color:#fff0f0;color:#D20">bundle exec rspec</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Notice how I copy the ".sample" config files to make sure they exist. And then how I run tasks you know such as <code>db:create db:schema:load</code> to create the normal test database, but tasks you don't know such as <code>central:db:create central:db:schema:load</code>.</p>
<p>I defined those tasks in <code>lib/tasks/db_central.rake</code> like this:</p>
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
</tt>64<tt>
</tt>65<tt>
</tt>66<tt>
</tt>67<tt>
</tt>68<tt>
</tt>69<tt>
</tt><strong>70</strong><tt>
</tt>71<tt>
</tt>72<tt>
</tt>73<tt>
</tt>74<tt>
</tt>75<tt>
</tt>76<tt>
</tt>77<tt>
</tt>78<tt>
</tt>79<tt>
</tt><strong>80</strong><tt>
</tt>81<tt>
</tt>82<tt>
</tt>83<tt>
</tt>84<tt>
</tt>85<tt>
</tt>86<tt>
</tt>87<tt>
</tt>88<tt>
</tt>89<tt>
</tt><strong>90</strong><tt>
</tt>91<tt>
</tt>92<tt>
</tt>93<tt>
</tt>94<tt>
</tt>95<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">task <span style="color:#808">spec</span>: [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">central:db:test:prepare</span><span style="color:#710">"</span></span>]<tt>
</tt><tt>
</tt>namespace <span style="color:#A60">:central</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt><tt>
</tt>  namespace <span style="color:#A60">:db</span> <span style="color:#080;font-weight:bold">do</span> |ns|<tt>
</tt><tt>
</tt>    task <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">environment:set</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:environment:set</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:drop</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:drop</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:create</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:create</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:setup</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:setup</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:reset</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:reset</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:migrate</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:migrate</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:rollback</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:rollback</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:seed</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:seed</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    task <span style="color:#A60">:version</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:version</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    namespace <span style="color:#A60">:schema</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      task <span style="color:#A60">:load</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:schema:load</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>      task <span style="color:#A60">:dump</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:schema:dump</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    namespace <span style="color:#A60">:test</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      task <span style="color:#A60">:prepare</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db:test:prepare</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    <span style="color:#888"># append and prepend proper tasks to all the tasks defined here above</span><tt>
</tt>    ns.tasks.each <span style="color:#080;font-weight:bold">do</span> |task|<tt>
</tt>      task.enhance [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">central:set_custom_config</span><span style="color:#710">"</span></span>] <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        <span style="color:#036;font-weight:bold">Rake</span>::<span style="color:#036;font-weight:bold">Task</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">central:revert_to_original_config</span><span style="color:#710">"</span></span>].invoke<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  task <span style="color:#A60">:set_custom_config</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#888"># save current vars</span><tt>
</tt>    <span style="color:#33B">@original_config</span> = {<tt>
</tt>      <span style="color:#808">env_schema</span>: <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">SCHEMA</span><span style="color:#710">'</span></span>],<tt>
</tt>      <span style="color:#808">config</span>: <span style="color:#036;font-weight:bold">Rails</span>.application.config.dup<tt>
</tt>    }<tt>
</tt><tt>
</tt>    <span style="color:#888"># set config variables for custom database</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">SCHEMA</span><span style="color:#710">'</span></span>] = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db_central/schema.rb</span><span style="color:#710">"</span></span><tt>
</tt>    <span style="color:#036;font-weight:bold">Rails</span>.application.config.paths[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">db</span><span style="color:#710">'</span></span>] = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db_central</span><span style="color:#710">"</span></span>]<tt>
</tt>    <span style="color:#036;font-weight:bold">Rails</span>.application.config.paths[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">db/migrate</span><span style="color:#710">'</span></span>] = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db_central/migrate</span><span style="color:#710">"</span></span>]<tt>
</tt>    <span style="color:#036;font-weight:bold">Rails</span>.application.config.paths[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">db/seeds</span><span style="color:#710">'</span></span>] = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">db_central/seeds.rb</span><span style="color:#710">"</span></span>]<tt>
</tt>    <span style="color:#036;font-weight:bold">Rails</span>.application.config.paths[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">config/database</span><span style="color:#710">'</span></span>] = [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">config/database_central.yml</span><span style="color:#710">"</span></span>]<tt>
</tt><tt>
</tt>    <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Tasks</span>::<span style="color:#036;font-weight:bold">DatabaseTasks</span>.database_configuration = CM(<span style="color:#036;font-weight:bold">Rails</span>.root)<tt>
</tt>      .join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">config</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">database_central.yml</span><span style="color:#710">"</span></span>)<tt>
</tt>      .<span style="color:#036;font-weight:bold">File</span>.read<tt>
</tt>      .<span style="color:#036;font-weight:bold">ERB</span>.new<tt>
</tt>      .result<tt>
</tt>      .<span style="color:#036;font-weight:bold">YAML</span>.load<tt>
</tt>      .unwrap.freeze<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  task <span style="color:#A60">:revert_to_original_config</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#888"># reset config variables to original values</span><tt>
</tt>    <span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">SCHEMA</span><span style="color:#710">'</span></span>] = <span style="color:#33B">@original_config</span>[<span style="color:#A60">:env_schema</span>]<tt>
</tt>    <span style="color:#036;font-weight:bold">Rails</span>.application.config = <span style="color:#33B">@original_config</span>[<span style="color:#A60">:config</span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how I define a namespace of Rake tasks that start with <code>central:</code>, and every one of those connect to the secondary database as described in <code>database_central.yml</code>. The weird syntax in line 81 is from my <a href="https://github.com/akitaonrails/chainable_methods"><code>chainable_methods</code></a>, don't mind it too much.</p>
<p>The <code>db_central/schema.rb</code> is basically a copy of the <code>spec/support/rails_app/db/schema.rb</code> from the central-support gem, with the same tables. The spec runner of both the gem and this secondary app will just load the schema into the test database.</p>
<p>Now that we have the basic underpinnings for specs in place, we can focus on how the application itself can consume those external models.</p>
<p>We start by adding an initializer like <code>config/initializer/db_central.rb</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">DB_CENTRAL</span> = CM(<span style="color:#036;font-weight:bold">Rails</span>.root)<tt>
</tt>  .join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">config</span><span style="color:#710">"</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">database_central.yml.sample</span><span style="color:#710">"</span></span>)<tt>
</tt>  .<span style="color:#036;font-weight:bold">File</span>.read<tt>
</tt>  .<span style="color:#036;font-weight:bold">ERB</span>.new<tt>
</tt>  .result<tt>
</tt>  .<span style="color:#036;font-weight:bold">YAML</span>.load<tt>
</tt>  .unwrap.freeze<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In this case I am reading from the sample file because different from the CI build, when I deploy to Heroku I don't have a script to copy the sample to the final yaml file. This will populate the constant <code>DB_CENTRAL</code> with the database URL stored in the <code>DATABASE_CENTRAL_URL</code> environment variable that I have to set.</p>
<p>Then I create a new file called <code>app/models/remote_application_record.rb</code> that looks like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">RemoteApplicationRecord</span> &lt; <span style="color:#036;font-weight:bold">ApplicationRecord</span><tt>
</tt>  establish_connection <span style="color:#036;font-weight:bold">DB_CENTRAL</span>[<span style="color:#036;font-weight:bold">Rails</span>.env]<tt>
</tt>  <span style="color:#038;font-weight:bold">self</span>.abstract_class = <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">unless</span> <span style="color:#036;font-weight:bold">Rails</span>.env.test?<tt>
</tt>    default_scope -&gt; { readonly }<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how you create a new connection pool for the secondary database configuration. You must only have this <code>establish_connection</code> in one place and have the models inherit from here. The <code>abstract_class = true</code> will make ActiveRecord not try to load from a table of the same name as this class.</p>
<p>Then we have a <code>default_scope</code> locking down the model as <code>readonly</code>. We don't want that in the test environment because I still want to have Factory Girl populate the test database with fake data for the specs. But it's good idea to have it in the production environment just to make sure.</p>
<p>Finally, I can create all the models I need, such as <code>app/models/central/team.rb</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">Central</span><tt>
</tt>  <span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Team</span> &lt; <span style="color:#036;font-weight:bold">RemoteApplicationRecord</span><tt>
</tt>    <span style="color:#038;font-weight:bold">self</span>.table_name = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">teams</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>    include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Associations</span><tt>
</tt>    include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Validations</span><tt>
</tt>    include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Scopes</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>From here I can just call normal Arel queries such as <code>Central::Team.not_archived.limit(5)</code>.</p>
<h3>Conclusions</h3>
<p>If you didn't already, refer to <a href="https://www.akitaonrails.com/2016/10/03/sharing-models-between-rails-apps-part-1">Part 1</a> for more details.</p>
<p>This is a simple recipe to share model logic between a main read-write Rails app and a secondary read-only Rails app. They share most (not all) of the same models, they share the same logic (through some of the Concerns), and they share the same database.</p>
<p>In this particular case, the recommended approach is to create a <a href="https://devcenter.heroku.com/articles/heroku-postgres-follower-databases">Follower database</a>, which is how Heroku calls a secondary replicated database and make my secondary application connect to that (as it only needs a read-only source).</p>
<p>For more complicated scenarios, you will need a more complicated solution such as an HTTP API layer to make sure only one App manages model migrations and such. But the Rubygem approach should be "good enough" for many cases.</p>
<p>If I really need to go that way, it won't be too difficult to transform this small gem into a full blown Rails API app. If you can't even separate the logic as a Concern, you won't be able to separate them as APIs either, so consider this a quick exercise, a first step towards creating an <a href="https://programmers.stackexchange.com/questions/184464/what-is-an-anti-corruption-layer-and-how-is-it-used">Anti Corruption Layer</a>.</p>
<p>And as a bonus, consider contributing to the <a href="https://github.com/Codeminer42/cm42-central">Central</a> and <a href="https://github.com/Codeminer42/cm42-central-support">central-support</a> open source projects. I intend to build a competitive Pivotal Tracker/Trello alternative and we are getting there!</p>
<p></p>
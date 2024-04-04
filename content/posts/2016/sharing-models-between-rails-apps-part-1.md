---
title: "Sharing models between Rails Apps - Part 1"
date: "2016-10-03T18:00:00.000Z"
tags: ["database"]
years: "2016"
---

<p></p>
<p><em>"Build a microservice and expose an API."</em></p>
<p>That would be the quick answer if you ask any developer how to share business logic between applications.</p>
<p>Although it makes sense in many number of situations, it's not a good answer all the time.</p>
<p>My TL;DR for some situations is that you can organize your models logic as <a href="http://api.rubyonrails.org/classes/ActiveSupport/Concern.html">ActiveSupport::Concerns</a> (or plain Ruby Modules if you will) and move them out to a Rubygem that your applications can consume.</p>
<p></p>
<p></p>
<p>Notice that I am only speaking of Models, not Controllers or Views. To share those you would need a full blown Rails Engine instead. But many cases I've seen wanted to just share the business logic between applications while having separated front-end logic.</p>
<p>A small example of this scenario is the open sourced project I've been working on in the last few weeks. <a href="https://github.com/Codeminer42/cm42-central">Central</a>, which is a Pivotal Tracker/Trello alternative - if you're interested.</p>
<p>A few days ago I started a new project (for internal use only) that would query the same models as Central. I didn't want to implement HTTP APIs at this point, and the new application would itself have models with relationships to the models in Central (while treating them as read-only).</p>
<p>After a few refactorings, most of Central's models look like this one:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Team</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Associations</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Validations</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Scopes</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">DomainValidator</span><tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And I have this dependency in the <code>Gemfile</code>:</p>
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
<p>Whenever I change the concerns, I do a <code>bundle update central-support</code> in the projects (this is the one caveat to have in mind to avoid dealing with outdated models).</p>
<p>This was possible because most of those models were mature and stable and I will not be changing them often. I don't recommend exposing unstable dependencies (as gems or APIs, it doesn't matter), because this is a recipe for huge headaches of cascading breaking changes due to outdated dependencies that are changing too often.</p>
<blockquote>
  <p>You should ONLY expose business logic that is reasonably stable (changes only every week or so).</p>
</blockquote>
<p>The whole endeavor was to build a certain Rubygems structure, organize the original models into Concerns (which breaks no behavior), make sure specs are still passing, and them move the content (models and specs) over to the new Rubygems and make sure the specs pass there.</p>
<p>That's how I built a secondary open source dependency for Central, called <a href="https://github.com/Codeminer42/cm42-central-support">Central Support</a>. As many gems, it's main file <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/lib/central/support.rb">lib/central/support.rb</a> is nothing but a bunch of 'require's to load all the dependencies.</p>
<p>So I methodically organized logic as concerns, such as <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/lib/central/support/concerns/team_concern/associations.rb">lib/central/support/concerns/team_concern/association.rb</a>, which is just the extraction of the Active Record associations from the 'Team' model.</p>
<p>Cut from Central, Paste into Support. When all relevant logic has been moved, I could move the entire Team model spec, mostly without any changes, and make it run. Every time I moved a bit, I <code>bundle update</code>d the gem and ran the main spec suite to make sure nothing broke.</p>
<p>And this is the difficult part: make a sandbox where those concerns could run and be tested.</p>
<p>To begin, I needed to build a minimal Rails app inside the spec folder, at <code>spec/support/rails_app</code>. And there I could put fake models that include the concerns I had just extracted from Central.</p>
<p>There is scarse documentation on how to do that, but I think you can just do <code>rails new</code> and start from there, or copy my <code>rails_app</code> folder for the bare minimum. My case is simpler because this gem is not to be general purpose, so I don't need to run it against different Rails versions, for example.</p>
<p>This internal test app must have a carefully crafted <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/spec/support/rails_app/Gemfile"><code>Gemfile</code></a>:</p>
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
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">central-support</span><span style="color:#710">'</span></span>, <span style="color:#808">path</span>: <span style="color:#036;font-weight:bold">File</span>.expand_path(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">../../../..</span><span style="color:#710">"</span></span>, <span style="color:#038;font-weight:bold">__FILE__</span>)<tt>
</tt><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">devise</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">pg</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">friendly_id</span><span style="color:#710">'</span></span><tt>
</tt>gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">foreigner</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>group <span style="color:#A60">:test</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">test-unit</span><span style="color:#710">'</span></span><tt>
</tt>  gem <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rspec-rails</span><span style="color:#710">'</span></span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You don't have to add the gems from the main <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/central-support.gemspec">gemspec</a>. But you can remove the development dependencies that you would put in the gemspec and keep them in the test app Gemfile.</p>
<p>Now, from the <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/Gemfile">main <code>Gemfile</code></a> you can do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">source <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">https://rubygems.org</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>eval_gemfile <span style="color:#036;font-weight:bold">File</span>.join(<span style="color:#036;font-weight:bold">File</span>.dirname(<span style="color:#038;font-weight:bold">__FILE__</span>), <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">spec/support/rails_app/Gemfile</span><span style="color:#710">"</span></span>)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Most tutorials to build a Rubygem will add a line to load dependencies from the gemspec, but here we are replacing it for the test app's Gemfile. This is the manifest that will be loaded when we run <code>bundle exec rspec</code>, for example.</p>
<p>Speaking of which, this is the <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/spec/rails_helper.rb"><code>spec/rails_helper.rb</code></a>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">ENV</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">RAILS_ENV</span><span style="color:#710">'</span></span>] ||= <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">test</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails/all</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">factory_girl</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">factory_girl_rails</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rspec/rails</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">shoulda/matchers</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="background-color:#f0fff0;color:#2B2"><span style="color:#161">`</span><span style="">cd spec/support/rails_app ; bin/rails db:drop db:create db:schema:load RAILS_ENV=test</span><span style="color:#161">`</span></span><tt>
</tt><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">support/rails_app/config/environment</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">support/database_cleaner</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">support/factory_girl</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">support/factories</span><span style="color:#710">'</span></span><tt>
</tt>require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">spec_helper</span><span style="color:#710">'</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>To wrap your head around it:</p>
<ul>
  <li><code>bundle exec rspec</code> will load the main <code>Gemfile</code></li>
  <li>the main <code>Gemfile</code> will load from the internal test app's <code>Gemfile</code></li>
  <li>that internal test app's <code>Gemfile</code> will require the gemspec from <code>../../../..</code> and the development and test groups of gems (including Rspec, Factory Girl, etc)</li>
  <li>the gemspec will require the runtime dependencies such as "activesupport", "enumerize", etc</li>
  <li>finally, the <code>rails_helper.rb</code> listed above will load.</li>
</ul>
<p>There at line 11, the runner will execute a command to <code>cd</code> into the internal test app's root folder and run the <code>db:schema:load</code>, therefore you need a <code>db/schema.rb</code> ready to load, as well as <code>config/database.yml</code>.</p>
<p>The <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/spec/spec_helper.rb"><code>spec/spec_helper.rb</code></a> is more standard, with optional configurations for test coverage, etc.</p>
<p>The models inside the internal test app are the important parts, because they are the means to include the extracted concerns into a runnable format. The <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/spec/support/rails_app/app/models/team.rb">'spec/support/rails_app/app/models/team.rb'</a> is such an example:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Team</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Base</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Associations</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Validations</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">Scopes</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">Central</span>::<span style="color:#036;font-weight:bold">Support</span>::<span style="color:#036;font-weight:bold">TeamConcern</span>::<span style="color:#036;font-weight:bold">DomainValidator</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And with that, I could move the unmodified specs directly from the main project (Central), such as <a href="https://github.com/Codeminer42/cm42-central-support/blob/master/spec/central/support/team_spec.rb"><code>spec/central/support/team_spec.rb</code></a>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rails_helper</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt>describe <span style="color:#036;font-weight:bold">Team</span>, <span style="color:#808">type</span>: <span style="color:#A60">:model</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  it { is_expected.to validate_presence_of <span style="color:#A60">:name</span> }<tt>
</tt>  it { is_expected.to have_many <span style="color:#A60">:enrollments</span> }<tt>
</tt>  it { is_expected.to have_many <span style="color:#A60">:users</span> }<tt>
</tt>  it { is_expected.to have_many <span style="color:#A60">:ownerships</span> }<tt>
</tt>  it { is_expected.to have_many <span style="color:#A60">:projects</span> }<tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you go back in the Central project, some commits back, you will find the very same file as <a href="https://github.com/Codeminer42/cm42-central/blob/a80eefadf233f4a8c5f88829836c872b199798cd/spec/models/team_spec.rb"><code>spec/models/team_spec.rb</code></a>. And the main advantage of this approach is exactly being able to move most of the code out of the main project, together with their specs, into a dependency gem, without having to "rewrite" anything.</p>
<p>If I had to rewrite all or a big chunk of the code, it would've been a more expensive choice and I would probably have deferred it to another time and focus on more valuable features first.</p>
<p>This approach is not perfect but it was super cheap. I could move all the relevant business logic out of the main project without having to rewrite anything but a few wiring code. The new dependency gem received all the relevant bits and specs, and everything just runs.</p>
<p>So, if you have 2 or more Rails apps that could share the same models, this is how you can start it. Of course, there are always a lot of caveats to keep in mind.</p>
<p>In my case, the Central project is the one that can read-and-write to the database. My internal secondary app is just using the models as read-only. When 2 different apps write to the same database, you may have a number of conflicts to deal with.</p>
<p>This approach is useful if your secondary application is akin of an Administration dashboard, for example. You need to have some of the same associations, scopes, even validations for eventual editing, but it's limited to a few, controlled users.</p>
<p>This is also useful if you're doing data analysis, and again you can use the same associations, scopes, to build reports and dashboards. Essentially, if you need read-only access, this is a no-brainer.</p>
<p>In the <a href="https://www.akitaonrails.com/2016/10/03/sharing-models-between-rails-apps-part-2">next article</a> I will explain how I wired a secondary application, using the central-support gem and dealing with 2 different databases at the same time.</p>
<p></p>
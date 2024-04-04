---
title: "[Beginner] Trying out Rails 5.1.x"
date: "2017-10-24T18:29:00.000Z"
tags: ["rubyonrails", "rails51", "nodejs", "webpack", "reactjs"]
years: "2017"
---

<p></p>
<p>One thing that is not so great about having to deal with client projects is that most of them take their time before doing a full framework upgrade. And you can't blame them, as many of the dependencies in the ecosystem take their sweet, sweet time to upgrade either.</p>
<p><a href="http://weblog.rubyonrails.org/2017/9/29/this-week-in-rails-getting-closer-to-rails-5-2-beta/">Rails 5.2 Beta</a> is almost upon us, and I would bet that most of the Rails projects out there are in the 4.2 version, still thinking about doing the jump to 5.0 (which is not so bad an upgrade).</p>
<p></p>
<p></p>
<p>By the way, in case you didn't know, the official Rails Guides website has a section dedicated to upgrades. It's called <a href="https://guides.rubyonrails.org/upgrading_ruby_on_rails.html">A Guide for Upgrading Ruby on Rails</a>. The process of upgrading is not actually so difficult <strong>if, and only if</strong>:</p>
<ul>
  <li>
    <p>You have a fairly good test coverage. You should have, at the very least, feature specs for the most important parts of your system.</p>
  </li>
  <li>
    <p>You should upgrade to just one subsequent version at a time, never going straight to the most recent one. For example, If you're in Rails 4.1, you must first upgrade to 4.2, make sure everything works. Then go to 5.0. And only then go to 5.1. Each version has <strong>many</strong> deprecations, changes in behavior, changes in default boilerplate configuration, added new features. You must attend to each very carefully.</p>
  </li>
</ul>
<p>So, what are you missing if you're still in Rails 4.2?</p>
<p>Again, in case you didn't know, the official Rails Guides website also compiles detailed and easy to read Release Notes for each new version. The most recent are the <a href="https://guides.rubyonrails.org/5_1_release_notes.html">Ruby on Rails 5.1 Release Notes</a>.</p>
<h2>Starting a new project</h2>
<p>The <code>rails new</code> command has a lot of new flags. And I think these are the ones most people will use:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">rails new --skip-action-mailer --skip-coffee --webpack=react my_fancy_new_project<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You can disable features you don't need such as ActionMailer or actionable. You can disable CoffeeScript. It was cool for a while but now that ES6 exists we should just use it.</p>
<p>Rails 5.1 comes with the support for webpack. But until Rails 5.2 comes up, we need to use the <code>webpack-dev-server</code> manually in development mode so we can hot reload assets. For that end, I recommend installing good old <a href="https://github.com/ddollar/foreman">Foreman</a>. Install it like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gem install foreman<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And add a <code>Procfile.dev</code> file to your project with the following content:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">web: ./bin/rails s -b 0.0.0.0 -p 3000<tt>
</tt>webpack: ./bin/webpack-dev-server<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And now you can start up your development server like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">foreman start -f Procfile.dev<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In production, you don't need the <code>webpack-dev-server</code> as the <code>bin/rails assets:precompile</code> task should be able to compile all the assets you need as static, timestamped files in <code>public/assets</code>.</p>
<h2>Front-end Specific Changes</h2>
<p>Now, you can rejoice with Yarn, Webpack, and no more jQuery pre-installed. Samuel Muller has a <a href="https://samuelmullen.com/articles/embracing-change-rails51-adopts-yarn-webpack-and-the-js-ecosystem/">nice article</a> that summarizes most of these changes in more detail.</p>
<p>Now Ruby on Rails officially supports every bells and whistle from the Javascript ecosystem. There is nothing left behind that you might miss.</p>
<p>No more manually vendoring JS assets in <code>vendor/assets/javascripts</code> directory. No more need to use <a href="https://rails-assets.org/">Rails Assets</a>, which was a secondary RubyGems source specific to package JS libraries into RubyGems.</p>
<p>Let's say that, for some reason, you want jQuery back. You can now just do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">yarn add jquery<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And, as usual, you can simply add it to your <code>app/assets/javascripts/application.js</code> manifest file:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">// app/assets/javascripts/application.js<tt>
</tt>...<tt>
</tt>//= require jquery<tt>
</tt>...<tt>
</tt>//= require_tree .<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The so-called <a href="https://github.com/rails/rails/pull/26836">"support for Yarn in Rails 5.1"</a> boils down to a few wrappers and boilerplate. So you can run <code>rails yarn:install</code> and have the dependencies installed, but you can just as easily type <code>yarn</code> and it will install everything you need that is declared in the <code>package.json</code> file, as with any other Javascript-only project.</p>
<p>Now, the whole magic of the integration comes from the inclusion of the <a href="https://github.com/rails/webpacker">Webpacker</a> gem. It adds a bunch of boilerplate configuration for webpack. And, <strong>bonus fact</strong> you can include it today in your current Rails 4.2+ projects as well. Just start by adding the webpacker gem to your <code>Gemfile</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># Gemfile<tt>
</tt>gem 'webpacker', '~&gt; 3.0'<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then <code>bundle install</code> as usual and run:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">bundle exec rake webpacker:install<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If you didn't use the <code>--webpack=react</code> flag to the <code>rails new</code> command, you can add it later. Or you can add Angular as well:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">bundle exec rake webpacker:install:angular<tt>
</tt>bundle exec rake webpacker:install:react <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You should replace <code>bundle exec rake</code> for <code>bin/rails</code> if you're in Rails 5.1.</p>
<p>Adding proper React components is a bit more than the command above though. And the details are more than I want to cover in this post.</p>
<p>Andy Barnov has a <a href="https://x-team.com/blog/get-in-full-stack-shape-with-rails-5-1-webpacker-and-reactjs/">good post</a> on how to follow the Rails 5.1 packs convention to add your React components in the pipeline. As he recommends, don't fight the conventions and you should be golden.</p>
<p>Oddly enough, even though I used the <code>--webpack-react</code> flag to the <code>rails new</code> I still had to run the following command to bootstrap the webpack and react supports:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">./bin/rails webpacker:install:react<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>But once you do, you will get a new place to add React components, and that's in a proper <code>app/javascripts/packs</code>. And in the views, instead of the usual <code>javascript_include_tag</code> you will use the brand new <code>javascript_pack_tag</code>. I believe you can figure out the rest from the example component <code>hello_react.jsx</code> that it generates for you.</p>
<h2>Final Thoughts</h2>
<p>You now have a whole lot more options for Javascript, as Rails 5.1 fully embraces the current standards.</p>
<p>Once upon a time, no one properly knew how to streamline an <a href="https://guides.rubyonrails.org/asset_pipeline.html">Asset Pipeline</a>. It was very messy to compile all your assets in a single file with proper cache busting timestamps, but the <strong>Sprockets</strong> gem did it.</p>
<p>Once upon a time, Javascript 5 was a damn mess. Libraries such as JQuery actually "fixed" most of the browsers DOM situation, and CoffeeScript normalized the language in a way that made it enjoyable. ES6 came to take over the reigns but it's very unfair to criticize JQuery and Coffee as neither ES6 nor HTML5 were there to solve the situation almost 10 years ago. JQuery and Coffee were there, and they solved it.</p>
<p>When Angular, Ember, React was starting, we already had a good enough solution javascript heavy website with <a href="https://github.com/turbolinks/turbolinks">Turbolinks</a>. This is still a very good solution that you should consider using instead of adding a full-blown (and sometimes unnecessary) React/Redux solution at once.</p>
<p>CSS is another matter entirely. The Rails community also created Sass (which then Twitter envied and copied to Less for the Bootstrap framework).</p>
<p>It's easy to see the current landscape and just repeat that Coffee is bad or Sprockets is bad. But for the past 10 years, those tools were the best of breed in a time where people didn't have Yarn, Webpack, React and all the tools that popped up in the past 3 years or so.</p>
<p>Rails 5.1 is a very good release to marry the best of Rails with the best that kinda stabilized today in the Javascript mad arena. And I highly recommend that any new, greenfield project, start with Rails 5.1 in mind.</p>
<p>One thing that led me to write this post is to highlight that many people ask questions that are mostly answered in the official <a href="https://guides.rubyonrails.org/">Rails Guides</a>. Not only on how to install and use the many components of the framework but also how to upgrade and what the new features of each release are. So you should definitely take a better look there.</p>
<p></p>
---
title: "[Beginner] Long live PhantomJS, let's use Chrome Headless now"
date: "2017-10-31T21:48:00.000Z"
tags: ["rubyonrails", "rails51", "nodejs", "selenium", "phantomjs", "chromium", "chromedriver"]
years: "2017"
---

<p></p>
<p>If you do Feature Specs, the act of loading up a real app server and then a real headless browser to do real user feature testing, then you know <a href="https://github.com/teamcapybara/capybara/issues/1860">Capybara</a> and one of its most well-known drivers, <a href="https://github.com/teampoltergeist/poltergeist/issues/882">Poltergeist</a>. Poltergeist wraps up PhantomJS, which is a well known WebKit-based headless browser.</p>
<p>But WebKit is known for being <strong>very</strong> complicated to deal with. So I can only imagine the nightmare to maintain PhantomJS, which is akin to main a full-blown web browser like Chrome or Safari.</p>
<p>So it's no wonder that when the Chrome team announced the availability of the <a href="https://developers.google.com/web/updates/2017/04/headless-chrome">Chrome Driver</a>, then the maintainer of PhantomJS <a href="https://github.com/teampoltergeist/poltergeist/issues/882">decided to step down</a>.</p>
<p>If you know the contributors of PhantomJS, say thank you, as it helped as build more solid user features.</p>
<p></p>
<p></p>
<p>That being said, fear not. You can easily replace Poltergeist/PhantomJS for Selenium WebDriver/Chrome Driver in your RSpec/Capybara setup.</p>
<p>My friend <a href="https://www.lucascaton.com.br/2017/06/22/how-to-run-your-feature-specs-using-capybara-and-headless-chrome/">Lucas Caton</a> wrote about it in June this year. Follow his blog as well.</p>
<p>If you're using Linux with the Chromium browser, you don't need to install anything, as the Chrome Driver comes with Chromium. Otherwise, you need to install the proper packages for your operating system. For example, <code>brew install chromedriver</code> for OS X or <code>pacaur -S chromedriver</code> on Arch if you don't like to have Chromium around. You may need to <a href="https://askubuntu.com/questions/539498/where-does-chromedriver-install-to">tweak your PATH on Ubuntu</a> though.</p>
<p>Rule of thumb: install Chromium.</p>
<p>In my case, this is what had to change:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888" class="line"># Gemfile</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span> gem "poltergeist"</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> gem "selenium-webdriver"</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> gem "rspec-retry"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then in the Capybara setup:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888" class="line">Capybara.server = :puma # Until your setup is working</span><tt>
</tt><span style="color:#888" class="line">Capybara.server = :puma, { Silent: true } # To clean up your test output</span><tt>
</tt><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span> Capybara.register_driver :poltergeist do |app|</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>   options = {</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>     timeout: 3.minutes,</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>     phantomjs_options: [</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>       '--proxy-type=none',</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>       '--load-images=no',</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>       '--ignore-ssl-errors=yes',</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>       '--ssl-protocol=any',</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>       '--web-security=false'</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>     ]</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>   }</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span>   Capybara::Poltergeist::Driver.new(app, options)</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span> end</span><tt>
</tt><span style="background:#faa" class="line"><span style="color:#800;font-weight:bold">-</span> Capybara.javascript_driver = :poltergeist</span><tt>
</tt><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> Capybara.register_driver :chrome do |app|</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>   capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>     chromeOptions: {</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>       args: %w[ no-sandbox headless disable-popup-blocking disable-gpu window-size=1280,1024]</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>     }</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>   )</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> </span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>   Capybara::Selenium::Driver.new(app, browser: :chrome, desired_capabilities: capabilities)</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> end</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> </span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> Capybara::Screenshot.register_driver :chrome do |driver, path|</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span>   driver.save_screenshot(path)</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> end</span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> </span><tt>
</tt><span style="background:#afa" class="line"><span style="color:#080;font-weight:bold">+</span> Capybara.javascript_driver = :chrome</span><tt>
</tt><tt>
</tt><span style="color:#888" class="line">Capybara.default_max_wait_time = 5 # you may want to increase this timeout if your app is heavy to load</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In feature specs, sometimes either Rails itself takes a long while to load up, compile assets, etc and the first features spec may timeout. To avoid a failure in the test run, it's recommended to add the <code>rspec-retry</code> gem, as I did above, and add the following to your <code>spec/rails_helper.rb</code>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">rspec/retry</span><span style="color:#710">'</span></span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">RSpec</span>.configure <span style="color:#080;font-weight:bold">do</span> |config|<tt>
</tt>  ...<tt>
</tt>  <span style="color:#888"># show retry status in spec process</span><tt>
</tt>  config.verbose_retry = <span style="color:#038;font-weight:bold">true</span><tt>
</tt>  <span style="color:#888"># Try twice (retry once)</span><tt>
</tt>  config.default_retry_count = <span style="color:#00D;font-weight:bold">2</span><tt>
</tt>  <span style="color:#888"># Only retry when Selenium raises Net::ReadTimeout</span><tt>
</tt>  config.exceptions_to_retry = [<span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">ReadTimeout</span>]<tt>
</tt>  ...<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And that should be it. I didn't have to touch any of my feature specs and they all ran beautifully. So kudos to the respective teams that maintain Capybara, Selenium-WebDriver for supporting this.</p>
<p>If you're a Node.js developer as well, you probably used something like Casper, which is said to support Chrome Headless as well. But while we're at it, you should check out <a href="https://github.com/GoogleChrome/puppeteer">Puppeteer</a> as well, from the Google team itself. It is a promise based library where you can code like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">const puppeteer = require(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">puppeteer</span><span style="color:#710">'</span></span>);<tt>
</tt><tt>
</tt>(async () =&gt; {<tt>
</tt>  const browser = await puppeteer.launch();<tt>
</tt>  const page = await browser.newPage();<tt>
</tt>  await page.<span style="color:#080;font-weight:bold">goto</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">https://example.com</span><span style="color:#710">'</span></span>);<tt>
</tt>  await page.screenshot({<span style="color:#808">path</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">example.png</span><span style="color:#710">'</span></span>});<tt>
</tt><tt>
</tt>  await browser.close();<tt>
</tt>})();<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So yeah, Chrome Headless seems like a very good option as most users actually use the Chrome browser, so it means we should have more reliable feature specs and also web crawling tools.</p>
<p></p>
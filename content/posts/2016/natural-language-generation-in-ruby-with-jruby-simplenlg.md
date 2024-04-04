---
title: "Natural Language Generation in Ruby (with JRuby + SimpleNLG)"
date: "2016-10-28T19:53:00.000Z"
tags: []
years: "2016"
---

<p></p>
<p>I am building a project which needs to generate proper English sentences. The first version I built used the super naive way of just creating a string template and doing simple sub-string replacements or concatenations.</p>
<p>But you can imagine that it quickly becomes cumbersome when you have to deal with pluralization, inflection, and it starts to become something like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">There </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#33B">@users</span>.size == <span style="color:#00D;font-weight:bold">1</span> ? <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">is</span><span style="color:#710">'</span></span> : <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">are</span><span style="color:#710">'</span></span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> </span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#33B">@users</span>.size<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style=""> user</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">s</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">unless</span> <span style="color:#33B">@users</span>.size == <span style="color:#00D;font-weight:bold">1</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">.</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or use Rails I18n support like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">I18n</span>.backend.store_translations <span style="color:#A60">:en</span>, <span style="color:#A60">:user_msg</span> =&gt; {<tt>
</tt>  <span style="color:#A60">:one</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">There is 1 user</span><span style="color:#710">'</span></span>,<tt>
</tt>  <span style="color:#A60">:other</span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">There are %{count} users</span><span style="color:#710">'</span></span><tt>
</tt>}<tt>
</tt><span style="color:#036;font-weight:bold">I18n</span>.translate <span style="color:#A60">:user_msg</span>, <span style="color:#A60">:count</span> =&gt; <span style="color:#00D;font-weight:bold">2</span><tt>
</tt><span style="color:#888"># =&gt; 'There are 2 users'</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>For simple transactional phrases (such as flash messages), this is more than enough.</p>
<p>But if you want to generate an entire article in plain English from data structures, then the logic becomes very convoluted very fast.</p>
<p>I looked around and found a few Ruby projects that could help, for example:</p>
<ul>
  <li><a href="https://github.com/chorn/nameable">"nameable"</a> which can do useful stuff like this:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Nameable</span>::<span style="color:#036;font-weight:bold">Latin</span>.new(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">Chris</span><span style="color:#710">'</span></span>).gender<tt>
</tt><span style="color:#888">#=&gt; :male</span><tt>
</tt><span style="color:#036;font-weight:bold">Nameable</span>::<span style="color:#036;font-weight:bold">Latin</span>.new(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">Janine</span><span style="color:#710">'</span></span>).female?<tt>
</tt><span style="color:#888">#=&gt; true</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<ul>
  <li><a href="https://github.com/maetl/calyx">"calyx"</a> which can be used to generate simple phrases like this:</li>
</ul>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">GreenBottle</span> &lt; <span style="color:#036;font-weight:bold">Calyx</span>::<span style="color:#036;font-weight:bold">Grammar</span><tt>
</tt>  mapping <span style="color:#A60">:pluralize</span>, <span style="background-color:#fff0ff"><span style="color:#404">/</span><span style="color:#808">(.+)</span><span style="color:#404">/</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="color:#b0b">\\</span><span style="">1s</span><span style="color:#710">'</span></span><tt>
</tt>  start <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">One green {bottle}.</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">Two green {bottle.pluralize}.</span><span style="color:#710">'</span></span><tt>
</tt>  bottle <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">bottle</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#888"># =&gt; "One green bottle."</span><tt>
</tt><span style="color:#888"># =&gt; "Two green bottles."</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Nice and dandy, but still useless for the more complex needs I have in mind.</p>
<p>So I decided to dig a bit deeper, into the dark world of NLG, or <strong>Natural Language Generation</strong> (not to be confused with NLP, which stands for Natural Language Processing, which is the opposite of what I want. NLP gets plain English text and returns a parsed data structure).</p>
<p>For <strong>NLP</strong> (parsing, tokenization, etc) I'd highly recommend <a href="https://stanfordnlp.github.io/CoreNLP/">"Stanford CoreNLP"</a>. It seems to be one of the most robust and comprehensive out there (come on, it's from Stanford). Again a Java project, and a big download (more than 300MB!). Those linguistics projects are super heavy because they have to download entire dictionaries and lexicon databases.</p>
<p>But focusing on my problem at hand, <strong>NLG</strong>, there are <a href="https://aclweb.org/aclwiki/index.php?title=Downloadable_NLG_systems">several options</a> out there. In all honesty, I did not do a very extensive research so if you are aware of which is the most robust and also well maintained and with an easy to use interface, let me know in the comments section below.</p>
<p>My choice was <a href="https://github.com/simplenlg/simplenlg">SimpleNLG</a>. From it's GitHub page we can see that it seems to be quite well maintained to this day, it's a simple Java library and it is one of the "simpler" alternatives. <a href="https://www.fb10.uni-bremen.de/anglistik/langpro/kpml/README.html">KPML</a> is on the opposite spectrum: it seems to be one of the oldest (since the 80's!) and most robust one. But seriously, it feels like you need a ph.D to even get started.</p>
<p>Reading the SimpleNLG Java source code was boring but easy enough. Give yourself one full day of study to get used to the code and you're in business.</p>
<p>The main problem is that it's written in Java and I am not intending to write anything in Java (or any derivative) for now. For a short while I considered the endeavour or rewriting the damn thing in something more portable such as Rust, which I could load anywhere through FFI.</p>
<p>But even though SimpleNLG has "Simple" in it's name it has a few hairy dependencies to load the lexicon database. And the database itself is an HSQLDB dump, which is a Java-written database. And then, there would be the issue of maintaining a fork.</p>
<p>I quickly gave up on that idea and instead I worked around this by wrapping the library under a simple <a href="https://github.com/rails-api/rails-api">Rails-API</a> endpoint. I had a few issues because I had Git LFS tracking jar files in my system and Heroku doesn't support it and I ended up with a corrupted deployment (beware of those quircks, by the way!)</p>
<p>Finally, I was able to deploy a working JRuby + Rails-API project embedding SimpleNLG at Heroku. You can deploy your own copy by cloning my <a href="https://github.com/Codeminer42/nlg_service">nlg_service</a>. It works fine with the latest JRuby 9.1.5.0. You should pay for at least a Hobby tier over Heroku. Java takes a ridiculous amount of time to start up and more time to warm up. Heroku's free tier shuts down your dyno if it sits idle and a subsequent web request will definitelly time out or take an absurd amount of time to return.</p>
<p>Once deployed it starts up Rails, then loads <a href="https://github.com/Codeminer42/nlg_service/blob/master/config/initializers/simple_nlg.rb">this initializer</a>:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">java</span><span style="color:#710">'</span></span><tt>
</tt><span style="color:#036;font-weight:bold">Java</span>::<span style="color:#036;font-weight:bold">JavaLang</span>::<span style="color:#036;font-weight:bold">System</span>.set_property <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">file.encoding</span><span style="color:#710">"</span></span>,<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">UTF-8</span><span style="color:#710">"</span></span><tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">SIMPLE_NLG_DEFAULT_LEXICON_PATH</span> = <span style="color:#036;font-weight:bold">Rails</span>.root.join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">lib/SimpleNLG/resources/default-lexicon.xml</span><span style="color:#710">"</span></span>).to_s.freeze<tt>
</tt><span style="color:#036;font-weight:bold">SIMPLE_NLG_PATH</span>                 = <span style="color:#036;font-weight:bold">Rails</span>.root.join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">lib/SimpleNLG</span><span style="color:#710">"</span></span>).to_s.freeze<tt>
</tt><tt>
</tt><span style="color:#036;font-weight:bold">Dir</span>[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">SIMPLE_NLG_PATH</span><span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/*.jar</span><span style="color:#710">"</span></span>].each { |jar| require jar }<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And then I map the classes <a href="https://github.com/Codeminer42/nlg_service/blob/master/app/models/simple_nlg.rb">like this</a>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">SimpleNLG</span><tt>
</tt>  <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%w(</span><span style=""><tt>
</tt>    simplenlg.aggregation<tt>
</tt>    simplenlg.features<tt>
</tt>    simplenlg.format.english<tt>
</tt>    simplenlg.framework<tt>
</tt>    simplenlg.lexicon<tt>
</tt>    simplenlg.morphology.english<tt>
</tt>    simplenlg.orthography.english<tt>
</tt>    simplenlg.phrasespec<tt>
</tt>    simplenlg.realiser.english<tt>
</tt>    simplenlg.syntax.english<tt>
</tt>    simplenlg.xmlrealiser<tt>
</tt>    simplenlg.xmlrealiser.wrapper<tt>
</tt>  </span><span style="color:#710">)</span></span>.each { |package| include_package package }<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, I have a simple endpoint mapped to a <a href="https://github.com/Codeminer42/nlg_service/blob/master/app/controllers/api/realisers_controller.rb">controller</a> action:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Api::RealisersController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span><tt>
</tt>    reader = java::io::<span style="color:#036;font-weight:bold">StringReader</span>.new(params[<span style="color:#A60">:xml</span>])<tt>
</tt>    <span style="color:#080;font-weight:bold">begin</span><tt>
</tt>      records = <span style="color:#036;font-weight:bold">SimpleNLG</span>::<span style="color:#036;font-weight:bold">XMLRealiser</span>.getRecording(reader)<tt>
</tt>      output = records.getRecord.map <span style="color:#080;font-weight:bold">do</span> |record|<tt>
</tt>        <span style="color:#036;font-weight:bold">SimpleNLG</span>::<span style="color:#036;font-weight:bold">XMLRealiser</span>.realise(record&amp;.getDocument)<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      <span style="color:#33B">@realisation</span> = output.join(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>).strip<tt>
</tt>      render <span style="color:#808">plain</span>: <span style="color:#33B">@realisation</span><tt>
</tt>    <span style="color:#080;font-weight:bold">ensure</span><tt>
</tt>      reader.close<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The process of generating the final English text is called <strong>"realisation"</strong>. SimpleNLG has a comprehensive Java API but it also exposes it as a simpler XML format. The full <a href="https://github.com/simplenlg/simplenlg/blob/master/src/main/resources/xml/RealizerSchema.xsd">XML Realiser Schema</a> is available as an XSD.</p>
<p>If I want to write this sentence:</p>
<blockquote>
  <p>"There are some finished and delivered stories that may not have been tested."</p>
</blockquote>
<p>This is the XML that I need to assemble:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#579">&lt;?xml version="1.0"?&gt;</span><tt>
</tt><span style="color:#070">&lt;NLGSpec</span> <span style="color:#007">xmlns</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://simplenlg.googlecode.com/svn/trunk/res/xml</span><span style="color:#710">"</span></span> <span style="color:#007">xmlns:xsd</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://www.w3.org/2001/XMLSchema</span><span style="color:#710">"</span></span> <span style="color:#007">xmlns:xsi</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://www.w3.org/2001/XMLSchema-instance</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>  <span style="color:#070">&lt;Recording&gt;</span><tt>
</tt>    <span style="color:#070">&lt;Record&gt;</span><tt>
</tt>      <span style="color:#070">&lt;Document</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PARAGRAPH</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>        <span style="color:#070">&lt;child</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">SPhraseSpec</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>          <span style="color:#070">&lt;subj</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">NPPhraseSpec</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>            <span style="color:#070">&lt;head</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ADVERB</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>              <span style="color:#070">&lt;base&gt;</span>there<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>            <span style="color:#070">&lt;/head&gt;</span><tt>
</tt>          <span style="color:#070">&lt;/subj&gt;</span><tt>
</tt>          <span style="color:#070">&lt;vp</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VPPhraseSpec</span><span style="color:#710">"</span></span> <span style="color:#007">PERSON</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">THIRD</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>            <span style="color:#070">&lt;head</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VERB</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>              <span style="color:#070">&lt;base&gt;</span>be<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>            <span style="color:#070">&lt;/head&gt;</span><tt>
</tt>            <span style="color:#070">&lt;compl</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">NPPhraseSpec</span><span style="color:#710">"</span></span> <span style="color:#007">NUMBER</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PLURAL</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>              <span style="color:#070">&lt;head</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">NOUN</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                <span style="color:#070">&lt;base&gt;</span>story<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>              <span style="color:#070">&lt;/head&gt;</span><tt>
</tt>              <span style="color:#070">&lt;spec</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">WordElement</span><span style="color:#710">"</span></span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">DETERMINER</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                <span style="color:#070">&lt;base&gt;</span>a<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>              <span style="color:#070">&lt;/spec&gt;</span><tt>
</tt>              <span style="color:#070">&lt;preMod</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">CoordinatedPhraseElement</span><span style="color:#710">"</span></span> <span style="color:#007">conj</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">and</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                <span style="color:#070">&lt;coord</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VPPhraseSpec</span><span style="color:#710">"</span></span> <span style="color:#007">TENSE</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PAST</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                  <span style="color:#070">&lt;head</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VERB</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                    <span style="color:#070">&lt;base&gt;</span>finish<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>                  <span style="color:#070">&lt;/head&gt;</span><tt>
</tt>                <span style="color:#070">&lt;/coord&gt;</span><tt>
</tt>                <span style="color:#070">&lt;coord</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VPPhraseSpec</span><span style="color:#710">"</span></span> <span style="color:#007">TENSE</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PAST</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                  <span style="color:#070">&lt;head</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VERB</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                    <span style="color:#070">&lt;base&gt;</span>deliver<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>                  <span style="color:#070">&lt;/head&gt;</span><tt>
</tt>                <span style="color:#070">&lt;/coord&gt;</span><tt>
</tt>              <span style="color:#070">&lt;/preMod&gt;</span><tt>
</tt>              <span style="color:#070">&lt;compl</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">SPhraseSpec</span><span style="color:#710">"</span></span> <span style="color:#007">MODAL</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">may</span><span style="color:#710">"</span></span> <span style="color:#007">PASSIVE</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">true</span><span style="color:#710">"</span></span> <span style="color:#007">TENSE</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PAST</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                <span style="color:#070">&lt;vp</span> <span style="color:#007">xsi:type</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VPPhraseSpec</span><span style="color:#710">"</span></span> <span style="color:#007">TENSE</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PAST</span><span style="color:#710">"</span></span> <span style="color:#007">NEGATED</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">true</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                  <span style="color:#070">&lt;head</span> <span style="color:#007">cat</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">VERB</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><tt>
</tt>                    <span style="color:#070">&lt;base&gt;</span>test<span style="color:#070">&lt;/base&gt;</span><tt>
</tt>                  <span style="color:#070">&lt;/head&gt;</span><tt>
</tt>                <span style="color:#070">&lt;/vp&gt;</span><tt>
</tt>              <span style="color:#070">&lt;/compl&gt;</span><tt>
</tt>            <span style="color:#070">&lt;/compl&gt;</span><tt>
</tt>          <span style="color:#070">&lt;/vp&gt;</span><tt>
</tt>        <span style="color:#070">&lt;/child&gt;</span><tt>
</tt>      <span style="color:#070">&lt;/Document&gt;</span><tt>
</tt>    <span style="color:#070">&lt;/Record&gt;</span><tt>
</tt>  <span style="color:#070">&lt;/Recording&gt;</span><tt>
</tt><span style="color:#070">&lt;/NLGSpec&gt;</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ok, this is preposterous, I know.</p>
<p>Which is why I decided to go ahead and use one of Ruby's most recognized strengths: creating <strong>DSLs</strong> or <strong>Domain Specific Languages</strong>.</p>
<p>The result of my initial endeavor to simplify this process is the <a href="https://github.com/Codeminer42/nlg_xml_realiser_builder">nlg_xml_realiser_builder</a> ruby gem. Simply add the following to your <code>Gemfile</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">gem 'nlg_xml_realiser_builder'<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And the humongous XML above becomes something more manageable like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">dsl = <span style="color:#036;font-weight:bold">NlgXmlRealiserBuilder</span>::<span style="color:#036;font-weight:bold">DSL</span>.new<tt>
</tt>dsl.builder(<span style="color:#038;font-weight:bold">true</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  sp <span style="color:#A60">:child</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    subj <span style="color:#A60">:np</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">there</span><span style="color:#710">'</span></span>, <span style="color:#808">cat</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">ADVERB</span><span style="color:#710">'</span></span><tt>
</tt>    verb <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">be</span><span style="color:#710">'</span></span>, <span style="color:#808">PERSON</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">THIRD</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      compl <span style="color:#A60">:np</span>, [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">a</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">story</span><span style="color:#710">'</span></span>], <span style="color:#808">NUMBER</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PLURAL</span><span style="color:#710">'</span></span>  <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        preMod <span style="color:#A60">:cp</span>, <span style="color:#808">conj</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">and</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>          coord <span style="color:#A60">:vp</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">finish</span><span style="color:#710">'</span></span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span><tt>
</tt>          coord <span style="color:#A60">:vp</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">deliver</span><span style="color:#710">'</span></span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span><tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>        compl <span style="color:#A60">:sp</span>, <span style="color:#808">MODAL</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">may</span><span style="color:#710">'</span></span>, <span style="color:#808">PASSIVE</span>: <span style="color:#038;font-weight:bold">true</span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>          verb <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">test</span><span style="color:#710">'</span></span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span>, <span style="color:#808">NEGATED</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span>.to_xml<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Understanding the intricasies of an <code>NPPhraseSpec</code> vs a <code>VPPhraseSpec</code> or the difference between a <code>WordElement</code> or <code>StringElement</code> are beyond this blog post. But most of the original XSD has been mapped through <a href="https://github.com/Codeminer42/nlg_xml_realiser_builder/blob/master/lib/nlg_xml_realiser_builder/consts.rb">this constants file</a>.</p>
<p>I have a <a href="https://github.com/Codeminer42/nlg_xml_realiser_builder/blob/master/spec/nlg_xml_realiser_builder_spec.rb">few acceptance specs</a> that are generating XMLs like the above, posting to my live online NLG Web Service and fetching the resulting English sentences. I will change this process in the future but you can test it our yourself.</p>
<p>The advantages start here. Now let's check out the previous example more closely. Again, it renders this phrase:</p>
<blockquote>
  <p>"There are some finished and delivered stories that may not have been tested."</p>
</blockquote>
<p>Now, it's in plural form because I am talking about 'stories', but what if I want a singular version?</p>
<p>Below is the new version where I just wrap it around a method and make the attribute 'NUMBER' accept both 'PLURAL' or 'SINGULAR':</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">example</span>(plural = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PLURAL</span><span style="color:#710">'</span></span>)<tt>
</tt>  dsl = <span style="color:#036;font-weight:bold">NlgXmlRealiserBuilder</span>::<span style="color:#036;font-weight:bold">DSL</span>.new<tt>
</tt>  dsl.builder(<span style="color:#038;font-weight:bold">true</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    sp <span style="color:#A60">:child</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      subj <span style="color:#A60">:np</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">there</span><span style="color:#710">'</span></span>, <span style="color:#808">cat</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">ADVERB</span><span style="color:#710">'</span></span><tt>
</tt>      verb <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">be</span><span style="color:#710">'</span></span>, <span style="color:#808">PERSON</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">THIRD</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        compl <span style="color:#A60">:np</span>, [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">a</span><span style="color:#710">'</span></span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">story</span><span style="color:#710">'</span></span>], <span style="color:#808">NUMBER</span>: plural  <span style="color:#080;font-weight:bold">do</span><tt>
</tt>          preMod <span style="color:#A60">:cp</span>, <span style="color:#808">conj</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">and</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>            coord <span style="color:#A60">:vp</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">finish</span><span style="color:#710">'</span></span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span><tt>
</tt>            coord <span style="color:#A60">:vp</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">deliver</span><span style="color:#710">'</span></span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span><tt>
</tt>          <span style="color:#080;font-weight:bold">end</span><tt>
</tt>          compl <span style="color:#A60">:sp</span>, <span style="color:#808">MODAL</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">may</span><span style="color:#710">'</span></span>, <span style="color:#808">PASSIVE</span>: <span style="color:#038;font-weight:bold">true</span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>            verb <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">test</span><span style="color:#710">'</span></span>, <span style="color:#808">TENSE</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">PAST</span><span style="color:#710">'</span></span>, <span style="color:#808">NEGATED</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt>          <span style="color:#080;font-weight:bold">end</span><tt>
</tt>        <span style="color:#080;font-weight:bold">end</span><tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span>.to_xml<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And I can run the singular version like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">puts example('SINGULAR')<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is the resulting phrase:</p>
<blockquote>
  <p>"There is a finished and delivered story that may not have been tested."</p>
</blockquote>
<p>Check out how it changed the verb from "are" to "is" and the noun determiner from "some" to "a" on its own! And of course, this is a contrived example. Now imagine an entire customizable article, full of paragraphs and sentences that I can customize depending on several variable I have.</p>
<p>While I was studying and writing this DSL I got a good enough grasp of the SimpleNLG structure, but if you have more examples for more complex phrase structures, please let me know in the comments section down below.</p>
<p>Most of the specs were copied from the XML Realiser tests from the original Java project to make sure I am covering most cases.</p>
<p>It will be interesting to see if this DSL makes it easier for more people to experiment with NLG. As usual, send your Pull Requests, ideas and suggestions on my GitHub public repositories:</p>
<ul>
  <li><a href="https://github.com/Codeminer42/nlg_service">nlg_service</a></li>
  <li><a href="https://github.com/Codeminer42/nlg_xml_realiser_builder">nlg_xml_realiser_builder</a></li>
</ul>
<p>And if you're interested in the subject of NLP and NLG I found <a href="https://github.com/diasks2/ruby-nlp">this list</a> of Ruby related open source projects as well.</p>
<p></p>
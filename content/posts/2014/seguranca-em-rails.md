---
title: "Segurança em Rails"
date: "2014-05-22T14:39:00.000Z"
tags: ["beginner", "rails", "security"]
years: "2014"
---

<p></p>
<p>O assunto segurança é bem complicado, este post não tem a intenção de ser a fonte completa de tudo relacionado a segurança no mundo Ruby on Rails mas apenas listar algumas informações e ferramentas úteis. Antes de começar alguns links importantes que, se você ainda não conhecia, precisa ter nos seus favoritos:</p>
<ul>
  <li>
    <p><a href="http://guides.rubyonrails.org/security.html">Ruby on Rails Security Guide</a> - este é o guia oficial básico sobre as diversas brechas de segurança que o Rails, por padrão, já previne mas que você pode desativar acidentalmente. É o "Hello World" da segurança, como Session Hijacking, CSRF, SQL Injection, XSS, etc.</p>
  </li>
  <li>
    <p><a href="https://groups.google.com/forum/#!forum/rubyonrails-security">Ruby on Rails Security Group</a> - este é o grupo oficial de segurança. Toda vez que uma nova vulnerabilidade é corrigida é aqui que primeiro aparece seu anúncio e você pode avaliar os detalhes para saber se precisa atualizar sua aplicação imediatamente ou não.</p>
  </li>
  <li>
    <p><a href="http://brakemanscanner.org/">Brakeman</a> - como disse antes, você pode se descuidar e deixar passar um string com interpolação que pode causar um SQL Injection, por exemplo. Para evitar isso execute este scanner de tempos em tempos. O Code Climate implementa o Brakeman para dar as mesmas métricas de brechas de segurança.</p>
  </li>
  <li>
    <p><a href="http://www.rubysec.com/">RubySec</a> - mantém um banco de dados de vulnerabilidades não só do framework Ruby on Rails mas de diversas Rubygems que usamos todos os dias. E daqui vem uma das ferramentas que vou sugerir neste artigo.</p>
  </li>
</ul>
<p>Aliás, um comentário sobre o termo. Nunca se pode dizer <em>"minha aplicação está segura"</em>, o máximo que podemos dizer é <em>"minha aplicação parece não ter nenhuma vulnerabilidade conhecida."</em> Só porque você não conhece, não significa que as vulnerabilidades não existam, e as chances são que existam e você simplesmente a ignora. O único tipo de aplicação "segura" é aquela que está completamente off-line numa localização geográfica desconhecida em um bunker anti-nuclear. Tirando isso, qualquer outra coisa é "quebrável".</p>
<p></p>
<p></p>
<h2>Bundler Audit</h2>
<p>Como disse antes, não é fácil manter um projeto. Depois de algum tempo as gems são atualizadas e você não fica sabendo disso. Quando são apenas adições de algumas novas funcionalidades, não há com o que se preocupar, mas como você fica sabendo se uma das dezenas de gems que sua aplicação utiliza recebeu atualizações de segurança.</p>
<p>Para isso o pessoal do RubySec mantém um banco de dados, o <a href="https://github.com/rubysec/ruby-advisory-db/">Ruby Advisory DB</a> que concentra e organiza os diversos security advisories. Você pode contribuir se tiver gems de código aberto que receberam contribuições para fechar vulnerabilidades.</p>
<p>E para quem quer automatizar o processo de encontrar esses advisories, o RubySec também tem o <a href="https://github.com/rubysec/bundler-audit">Bundler Audit</a>. Ele funciona usando o Advisory DB e cruzando com as versões específicas de gems que estão listadas no <tt>Gemfile.lock</tt> do seu projeto.</p>
<p>Apenas instale a gem com</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem install bundler-install
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E execute a partir da raíz do seu projeto:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle-audit
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ele vai lhe dar uma saída parecida com esta:</p>
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
</pre>
      </td>
      <td class="code"><pre>Insecure Source URI found: git://github.com/Codeminer42/axlsx.git
Name: actionpack
Version: 3.2.16
Advisory: OSVDB-103440
Criticality: Unknown
URL: https://osvdb.org/show/osvdb/103440
Title: Denial of Service Vulnerability in Action View when using render :text
Solution: upgrade to &gt;= 3.2.17
Name: actionpack
Version: 3.2.16
Advisory: OSVDB-103439
Criticality: Unknown
URL: https://osvdb.org/show/osvdb/103439
Title: XSS Vulnerability in number_to_currency, number_to_percentage and number_to_human
Solution: upgrade to ~&gt; 3.2.17, ~&gt; 4.0.3, &gt;= 4.1.0.beta2
Name: mini_magick
Version: 3.5.0
Advisory: OSVDB-91231
Criticality: High
URL: https://osvdb.org/show/osvdb/91231
Title: MiniMagick Gem for Ruby URI Handling Arbitrary Command Injection
Solution: upgrade to &gt;= 3.6.0
Name: nokogiri
Version: 1.5.10
Advisory: OSVDB-101458
Criticality: Unknown
URL: https://www.osvdb.org/show/osvdb/101458
Title: Nokogiri Gem for Ruby External Entity (XXE) Expansion Remote DoS
Solution: upgrade to ~&gt; 1.5.11, &gt;= 1.6.1
Name: nokogiri
Version: 1.5.10
Advisory: OSVDB-101179
Criticality: Unknown
URL: https://www.osvdb.org/show/osvdb/101179
Title: Nokogiri Gem for JRuby Crafted XML Document Handling Infinite Loop Remote DoS
Solution: upgrade to ~&gt; 1.5.11, &gt;= 1.6.1
Unpatched versions found!
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Seguindo o exemplo acima, precisaríamos fazer o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle update nokogiri mini_magick rails
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você pode precisar alterar o arquivo <tt>Gemfile</tt> se a versão específica estiver declarada antes de realizar o <tt>update</tt>. E depois rode o <tt>bundle-audit</tt> novamente para ter certeza que está tudo bem. Apenas cuidado com os casos onde você aponta diretamente para um repositório do Github em vez do Rubygems.org, pois ele não tem como checar se o que você está puxando do Github tem vulnerabilidades conhecidas ou não.</p>
<p>Para atualizar seu bundler-audit antes de realizar um novo scan, faça:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>bundle-audit update
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h2>Bônus: Rack-Attack</h2>
<p>Além da análise estática de código para avaliar segurança, uma adição que pode ser interessante dependendo do tipo de site que você usa é o <a href="https://github.com/kickstarter/rack-attack">Rack-Attack</a>.</p>
<p>Digamos que avaliando seus logs você perceba que seu site está sendo muito consumido por web scrappers, robôs do tipo que ficam capturando seu conteúdo. Se for robôs de motores de busca como Google, Bing, tudo bem, mas você vai encontrar mais do que isso.</p>
<p>Imagine que além de scrappers consumindo demais, você tenha tentativa de ataques de força-bruta, como scripts automatizados tentando diversas combinações de usuários e senhas até conseguir acertar um.</p>
<p>Ou imagine simplesmente que você quer ou criar uma lista de IPs que você quer permitir (se seu site estiver em beta fechado, por exemplo) ou uma lista negra que você já sabe que quer bloquear.</p>
<p>Tudo isso pode ser feito diretamente no web server ou balanceador de carga. Mas se você estiver fazendo deployment em ambientes fechados como Heroku, não vai ter acesso à essa configuração.</p>
<p>Para isso existe o Rack::Attack, que é um middleware Rack que você instala de modo simples diretamente na sua aplicação Rails e pode customizá-lo de diferentes formas. A instalação básica é simples. Apenas acrescente à sua <tt>Gemfile</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rack-attack</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E adicione ao arquivo <tt>config.ru</tt>, antes da linha do comando <tt>run</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>use <span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Attack</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E se quiser customizar, comece adicionando o arquivo <tt>config/initializers/rack-attack.rb</tt> com o seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Rack::Attack</span>
  <span style="color:#036;font-weight:bold">Rack</span>::<span style="color:#036;font-weight:bold">Attack</span>.cache.store = <span style="color:#036;font-weight:bold">ActiveSupport</span>::<span style="color:#036;font-weight:bold">Cache</span>::<span style="color:#036;font-weight:bold">MemoryStore</span>.new <span style="color:#777"># defaults to Rails.cache</span>
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A <a href="https://github.com/kickstarter/rack-attack">documentação</a> no Github tem muito mais detalhes. Nos aspectos de detectar padrões de invasão por força bruta ele se inspira no famoso <a href="https://www.fail2ban.org/wiki/index.php/MANUAL_0_8#Jail_Options">fail2ban</a> (que você pode usar para proteger, por exemplo, o <a href="https://www.digitalocean.com/community/articles/how-to-protect-ssh-with-fail2ban-on-ubuntu-12-04">SSH</a> de seu servidor).</p>
<p>Vale a pensa aprender mais sobre esse assunto.</p>
<p></p>
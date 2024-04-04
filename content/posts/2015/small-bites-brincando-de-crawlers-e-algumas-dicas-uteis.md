---
title: "[Small Bites] Brincando de Crawlers e algumas Dicas Úteis"
date: "2015-05-15T12:10:00.000Z"
tags: ["ruby"]
years: "2015"
---

<p></p>
<p>Eu queria fazer uma limpeza geral na minha conta do Slack (que já tinha mais do que o suficiente de imagens-memes entupindo o limite de armazenamento), o problema é que ele não tem um "marcar tudo" e "deletar tudo" na interface de administração, mas felizmente ele tem APIs!</p>
<p>Então eu escrevi <a href="https://gist.github.com/akitaonrails/38cbbc2c37a7c646fe27">este pequeno script em Ruby</a> que tem <strong>4 dicas</strong> que vale a pena compartilhar:</p>
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
<strong><a href="#n50" name="n50">50</a></strong>
<a href="#n51" name="n51">51</a>
<a href="#n52" name="n52">52</a>
<a href="#n53" name="n53">53</a>
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rubygems</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">bundler/setup</span><span style="color:#710">'</span></span>
<span style="color:#036;font-weight:bold">Bundler</span>.require(<span style="color:#A60">:default</span>)
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">typhoeus/adapters/faraday</span><span style="color:#710">'</span></span>
<span style="color:#777"># documentations:</span>
<span style="color:#777"># https://api.slack.com/methods/files.list</span>
<span style="color:#777"># https://api.slack.com/methods/files.delete</span>
api_token = <span style="color:#069">ENV</span>[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">SLACK_API_TOKEN</span><span style="color:#710">'</span></span>] <span style="color:#080;font-weight:bold">or</span> abort <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">no api token</span><span style="color:#710">"</span></span>
per_page = <span style="color:#00D">500</span>
uri = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/api/files.list?token=%s&amp;ts_from=0&amp;ts_to=now&amp;types=all&amp;count=%s&amp;page=%s</span><span style="color:#710">"</span></span>
conn = <span style="color:#036;font-weight:bold">Faraday</span>.new(<span style="color:#A60">:url</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">https://slack.com/</span><span style="color:#710">'</span></span>) <span style="color:#080;font-weight:bold">do</span> |faraday|
  faraday.request  <span style="color:#A60">:url_encoded</span>             <span style="color:#777"># form-encode POST params</span>
  faraday.response <span style="color:#A60">:logger</span>                  <span style="color:#777"># log requests to STDOUT</span>
  faraday.adapter  <span style="color:#A60">:typhoeus</span>
<span style="color:#080;font-weight:bold">end</span>
response = conn.get( uri % [api_token, per_page, <span style="color:#00D">1</span>] )
json = <span style="color:#036;font-weight:bold">Oj</span>.load(response.body)
total_pages = json[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">paging</span><span style="color:#710">"</span></span>][<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">pages</span><span style="color:#710">"</span></span>].to_i
responses = []
conn.in_parallel <span style="color:#080;font-weight:bold">do</span>
  (<span style="color:#00D">1</span>..total_pages).each <span style="color:#080;font-weight:bold">do</span> |page|
    responses &lt;&lt; conn.get( uri % [api_token, per_page, page] )
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
files_ids = []
errors = []
<span style="color:#036;font-weight:bold">Parallel</span>.each(responses, <span style="color:#606">in_threads</span>: <span style="color:#00D">10</span>) <span style="color:#080;font-weight:bold">do</span> |response|
  <span style="color:#080;font-weight:bold">begin</span>
    json = <span style="color:#036;font-weight:bold">Oj</span>.load(response.body)
    <span style="color:#036;font-weight:bold">Parallel</span>.each(json[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">files</span><span style="color:#710">"</span></span>], <span style="color:#606">in_threads</span>: <span style="color:#00D">10</span>) <span style="color:#080;font-weight:bold">do</span> |file|
      files_ids &lt;&lt; file[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">id</span><span style="color:#710">"</span></span>]
    <span style="color:#080;font-weight:bold">end</span>
  <span style="color:#080;font-weight:bold">rescue</span> =&gt; e
    errors &lt;&lt; e
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
uri_delete = <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">https://slack.com/api/files.delete?token=%s&amp;file=%s</span><span style="color:#710">"</span></span>
conn.in_parallel <span style="color:#080;font-weight:bold">do</span>
  files_ids.each <span style="color:#080;font-weight:bold">do</span> |file_id|
    responses &lt;&lt; conn.get( uri_delete % [api_token, file_id] )
  <span style="color:#080;font-weight:bold">end</span>
<span style="color:#080;font-weight:bold">end</span>
puts responses.map <span style="color:#080;font-weight:bold">do</span> |response|
  <span style="color:#036;font-weight:bold">Oj</span>.load(response.body)[<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">ok</span><span style="color:#710">"</span></span>]
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<h3>Dica 1</h3>
<p>Mesmo em pequenos scripts, use <a href="https://bundler.io/bundler_setup.html">Bundler</a>!</p>
<h3>Dica 2</h3>
<p>Para acessar páginas Web, use a gem <a href="https://github.com/lostisland/faraday">"Faraday"</a> junto com a gem <a href="https://github.com/typhoeus/typhoeus">"Typhoeus"</a>.</p>
<p>Por que Faraday?</p>
<p>Porque ela abstrai diversos clientes HTTP. Você pode mudar entre Net::HTTP ou Excon ou Typhoeus com mínimo esforço e pode ser útil para diferenciar cenários de produção com um adapter e testes com outro adapter, por exemplo.</p>
<p>Por que Typhoeus?</p>
<p>Porque ela é capaz de realizar diversas requisições em paralelo e o que mais queremos num crawler é paralelizar o máximo possível (vide linhas 25..29 e 45..48 para exemplos). O único cuidado é não puxar coisa demais e estourar o acumulador de retornos (no exemplo, o array <tt>responses</tt>).</p>
<p>Para evitar estourar memória em vez de acumular internamente num array como no exemplo, já use a gem "Dalli" e vá acumulando num Memcached ou acumule num Redis ou MongoDB ou qualquer outro sistema de armazenamento que suporte inserções assíncronas (não bloqueantes, como um RDBMS normal).</p>
<h3>Dica 3</h3>
<p>Se estiver recebendo respostas JSON, use um parser rápido como a gem <a href="https://github.com/ohler55/oj">"Oj"</a>. Em conjunto com a gem <a href="https://github.com/ohler55/oj_mimic_json">"oj_mimic_json"</a> - que você deve colocar junto na Gemfile se for um projeto Rails - ela substitui a padrão gem JSON que o ActiveSupport usa. A Oj é de 2 a 4 vezes mais rápido do que a gem JSON por isso vale a pena usá-la. Claro, ela é rápida assim porque possui uma extension feita em C, ou seja não funciona com JRuby, apenas com MRI.</p>
<h3>Dica 4</h3>
<p>Uma vez que recebemos dezenas de respostas, queremos processá-las o mais rápido possível e fazer um mesmo <tt>responses.each { |response| ... }</tt> é lento porque é linear.</p>
<p>Para resolver isso podemos recorrer à gem <a href="https://github.com/grosser/parallel">"Parallel"</a> (vide exemplos nas linhas 33..42). Ela vai iterar pela coleção paralelamente usando threads.</p>
<p>Em Ruby MRI, lembrar que temos o Global Interpreter Lock (GIL) que bloqueia a execução paralela porque a mudança de estados em código C sem mutexes e outras proteções poderia corromper a execução. Então não precisamos nos preocupar com estado global compartilhado sendo alterado em paralelo por múltiplas threads mas por outro lado não temos multithreading real o tempo todo.</p>
<p>Mas temos como usar threads em operações bloqueantes, I/O bound, ou que tem muita espera (operações com arquivos ou rede). Nesse caso, quando uma thread bloquear esperando a resposta de algum I/O, outra thread pode de fato executar em paralelo. E daí o valor de usar threads no caso de crawlers ou scripts que façam import/export em banco de dados, etc.</p>
<p>Para o caso de I/O bound, usar threads. Mas se o caso for algo CPU-bound, de processamento de dados, cálculos, mais pesados, threads não vão ajudar. Para isso em vez da opção <tt>:in_threads</tt> você usa a opção <tt>:in_processes</tt> que vai fazer um <tt>fork()</tt> do seu processo e vai rodar realmente em paralelo em processos independentes e isolados, sem estado compartilhado.</p>
<p>Como desde o Ruby 2.0 ele suporta <a href="https://blog.engineyard.com/2013/ruby-2-0-under-the-hood#copy-on-write">"Copy on Write"</a> (ou "COW") de tal forma que mesmo duplicando um processo Ruby, ele não vai duplicar a memória, eles vão compartilhar a memória que não muda e cada processo isola somente a memória que ele mudar. Isso torna rodar processos em paralelo não tão caros em termos de consumo de memória e muito mais fáceis de escrever (sem precisar se preocupar com mutexes e semáforos, já que tudo rodará garantidamente isolado).</p>
<p>Ou seja, para casos justamente como um crawler ou um ETL, a gem "Parallel" pode ser uma mão na roda. Mas sempre meça para saber se as coisas estão realmente paralelas ou se você não está bloqueando suas threads e caindo no caso de execução linear sem saber.</p>
<p></p>
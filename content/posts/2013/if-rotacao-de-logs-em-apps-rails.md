---
title: "[#IF] Rotação de Logs em Apps Rails"
date: "2013-06-28T17:57:00.000Z"
tags: ["rails"]
years: "2013"
---

<p></p>
<p></p>
<p>Quem tem aplicações em produção já deve ter passado por isso. Depois de meses com seu servidor de pé de repente ver que seu espaço em disco está acabando rápido. E quando procurar o culpado, encontrá-lo no arquivo <tt>log/production.log</tt>, com algumas centenas de gigabytes ocupados. O que fazer?</p>
<p>No mundo UNIX existe uma solução padrão para isso, o serviço <a href="https://syntaxionist.rogerhub.com/rotate-rails-logs-with-logrotate.html">logrotate</a>. Isso vale não só para Rails mas para qualquer tipo de log.</p>
<p>Porém, no Rails 3 o próprio Logger sabe como se auto-rotacionar, sem precisar depender do logrotate do sistema. Abra seu arquivo <tt>config/environments/production.rb</tt> e adicione a seguinte linha:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>config.logger = <span style="color:#036;font-weight:bold">Logger</span>.new(<span style="color:#036;font-weight:bold">Rails</span>.root.join(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">log</span><span style="color:#710">"</span></span>,<span style="color:#036;font-weight:bold">Rails</span>.env + <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">.log</span><span style="color:#710">"</span></span>), <span style="color:#00D">5</span>, <span style="color:#00D">100</span>*<span style="color:#00D">1024</span>*<span style="color:#00D">1024</span>)
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>O construtor aceita 3 parâmetros:</p>
<ul>
  <li>caminho do arquivo de log - e aqui no caso está genérico para que você possa colocá-lo em ambientes de outros nomes</li>
  <li>quantidade de arquivos de log que quer manter</li>
  <li>tamanho máximo de cada arquivo de log, em bytes</li>
</ul>
<p>No exemplo você terá no máximo 5 arquivos de 100 megabytes, quando o 6o arquivo se completar, o primeiro mais antigo é apagado e assim por diante, rotacionando sem consumir todo o espaço do seu disco. A partir daí você vai ter arquivos com nomes de <tt>production.log</tt> (o atual), depois <tt>production.log.0</tt>, <tt>production.log.1</tt>, etc.</p>
<p>Não tem todas as funcionalidades do serviço nativo de logrotate (como gzipar os arquivos antigos, rotacionar por período de tempo, etc), mas para a maioria dos casos deve ser mais que suficiente.</p>
<p></p>
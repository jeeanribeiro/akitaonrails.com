---
title: "[Screencast] Começando com Git"
date: "2010-08-17T03:21:00.000Z"
tags: ["beginner", "git", "screencast"]
years: "2010"
---

<p></p>
<p><strong>Atualização 09/04/12:</strong> Este screencast foi liberado para visualização gratuita. Acesse este <a href="http://akitaonrails.com/2012/04/09/screencasts-liberados-gratuitamente">post</a></p>
<p><strong>Atualização 17/08:</strong> Tem uma pequena correção para quem usa Windows que não coloquei no screencast. Veja no fim do artigo.</p>
<p>Como prometido, continuo com minha iniciativa de publicar screencasts, vídeo-aulas completas para que você possa aprender sobre as novas tecnologias.</p>
<p>Todos devem saber que Git cresceu muito em popularidade desde 2007, quando publiquei meu <a href="http://www.akitaonrails.com/2007/09/22/jogar-pedra-em-gato-morto-por-que-subversion-no-presta">primeiro artigo evangelizando Git</a>. Depois disso publiquei outros artigos incluindo o famoso <a href="http://www.akitaonrails.com/2008/04/02/micro-tutorial-de-git">Micro Tutorial de Git</a></p>
<p>Graças ao <a href="http://www.github.com">Github</a> todo bom desenvolvedor que se preza tem o Git na sua caixa de ferramentas. Você, sua equipe e sua empresa só tem a ganhar aprendendo esta ferramenta.</p>
<ul>
  <li>Nível: Iniciante, Intermediário</li>
  <li>Tema: Começando a usar a ferramenta de controle de versionamento de código, Git</li>
  <li>Duração: <strong>3:17h</strong></li>
  <li>Formatos:
    <ul>
      <li><a href="http://bit.ly/Iv8XfH">Maior</a> 800×600 – 510Mb (zip, Quicktime/H.264)</li>
      <li><a href="http://bit.ly/1b7CwLc">iPhone</a> 480×360 – 471Mb (zip, Quicktime/H.264)</li>
    </ul>
  </li>
  <li>Plataformas: Linux (Ubuntu), Mac OS X, Windows 7</li>
  <li>Acompanha <span class="caps">PDF</span> com os slides usados na apresentação</li>
  <li>Tem organização em Capítulos</li>
</ul>
<p></p>
<p></p>
<p>E assistam na íntegra aqui:</p>
<div id="playeroDNgUNqQleSa"></div>
<script type="text/javascript">
  jwplayer('playeroDNgUNqQleSa').setup({
    file: 'https://s3.amazonaws.com/screencasts-akitaonrails/Comecando_com_Git/Come%C3%A7ando%20com%20Git.flv',
    image: 'https://s3.amazonaws.com/akitaonrails/assets/2010/8/16/Screen%20shot%202010-08-15%20at%208.33.57%20PM_original.png',
    title: 'Começando com Git (2010)',
    width: '100%',
    aspectratio: '4:3'
  });
</script>
<p>Faça <a href="https://s3.amazonaws.com/screencasts-akitaonrails/Comecando_com_Git/Come%C3%A7ando%20com%20Git.flv">download</a></p>
<p>E se está interessado em aprender mais, leia todos os meus artigos já publicados neste blog sobre Git:</p>
<ul>
  <li><a href="/2010/03/14/git-com-smart-http-transport">Git com Smart <span class="caps">HTTP</span> Transport</a></li>
  <li><a href="/2010/02/13/deploy-com-git-push">Deploy com Git Push</a></li>
  <li><a href="/2009/09/04/a-controv-rsia-do-ticket-2033-ruby-on-git">A Controvérsia do Ticket #2033 – Ruby on Git</a></li>
  <li><a href="/2009/07/05/dicas-de-git">Dicas de Git</a></li>
  <li><a href="/2009/02/23/pequena-dica-de-git-para-windows">Pequena dica de Git para Windows</a></li>
  <li><a href="/2008/12/02/tradu-o-por-que-git-melhor-que-x">Por que Git é melhor que X</a></li>
  <li><a href="/2008/10/02/entendendo-git-e-instalando-gitorious-git-via-web">Entendendo Git e Instalando Gitorious – Git via Web</a></li>
  <li><a href="/2008/09/21/colaborando-no-github">Colaborando no Github</a></li>
  <li><a href="/2008/04/03/git-com-sake">Git com Sake</a></li>
  <li><a href="/2008/04/02/finalmente-rails-mudando-de-svn-para-git">Finalmente, Rails mudando de <span class="caps">SVN</span> para Git</a></li>
  <li><a href="/2008/04/02/micro-tutorial-de-git">Micro-Tutorial de Git</a></li>
  <li><a href="/2008/02/13/git-on-cygwin-on-windows">Git on Cygwin on Windows</a></li>
  <li><a href="/2008/02/12/git-para-cientistas-da-computa-o">Git para Cientistas da Computação</a></li>
  <li><a href="/2008/02/04/ruby-on-git">Ruby on Git</a></li>
  <li><a href="/2007/10/26/aprenda-git-pelo-peepcode">Aprenda Git pelo Peepcode</a></li>
  <li><a href="/2007/09/22/git-muito-promissor">Git, muito Promissor</a></li>
  <li><a href="/2007/09/22/jogar-pedra-em-gato-morto-por-que-subversion-no-presta">Jogar Pedra em Gato Morto: Por que Subversion não Presta</a></li>
</ul>
<h2>Atualização: Git – Cloning e pushing via https no Windows</h2>
<p>Li este post do <a href="https://www.vogella.de/blog/2010/08/09/git-https/">Lars Vogel</a> hoje com uma dica para quem usa Windows. Vou traduzir para facilitar. Isto é quando você quiser fazer clone ou push para repositórios Git via <span class="caps">HTTPS</span> (como o Github passou a suportar recentemente), por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git clone https://vogella@github.com/vogella/de.vogella.rcp.example.git<tt>
</tt>...<tt>
</tt>git push https://vogella@github.com/vogella/de.vogella.rcp.example.git<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Você pode receber este erro no Windows:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">error: error setting certificate verify locations:<tt>
</tt>CAfile: /bin/curl-ca-bundle.crt<tt>
</tt>CApath: none<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se ver este erro para resolver é só desabilitar a verificação de <span class="caps">SSL</span>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git config --global http.sslverify "false"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Depois desta configuração, clone e push via https vai funcionar no Windows.</p>
<p>Outra alternativa que o Vogel não testou é a seguinte:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mkdir c:\bin\<tt>
</tt>copy "C:\Program Files\Git\bin\curl-ca-bundle.crt" c:\bin\curl-ca-bundle.crt<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Ou:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git config --system http.sslcainfo \bin/curl-ca-bundle.crt<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>A discussão completa sobre esse problema do msysGit pode ser encontrada <a href="https://github.com/blog/642-smart-http-support">aqui</a>.</p>
<p>E se estiver atrás de um proxy <span class="caps">HTTP</span> você pode configurar assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git config --global http.proxy https://proxy:8080<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para checar a configuração:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">git config --get http.proxy<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
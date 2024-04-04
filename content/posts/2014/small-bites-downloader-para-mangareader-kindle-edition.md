---
title: "[Small Bites] Downloader para MangaReader (Kindle Edition)"
date: "2014-12-17T23:24:00.000Z"
tags: []
years: "2014"
---

<p></p>
<p>Acho que esta vai ser realmente a primeira small bite versão miniatura mesmo! :-)</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/476/IMG_20141216_162841251.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/476/IMG_20141216_162841251.jpg 2x" alt="Kindle Paperwhite + Manga = Diversão"></p>
<p></p>
<p></p>
<p>Quem acompanha o blog faz tempo sabe que curto muito mangas/animes (me perguntem qualquer coisa, especialmente se for das décadas de 60 a 90). 4 anos atrás eu fiz um <a href="https://www.akitaonrails.com/2010/07/31/downloader-para-onemanga-com#.VJIOdcZHnxg">downloader</a> para o antigo site OneManga (que fechou).</p>
<p>Recentemente resolvi adquirir um Kindle Paperwhite (que aliás, é excepcional, principalmente se comparado ao último Kindle 2 que eu tive). E além de tudo é o formato perfeito para mangas (que são preto-e-branco por natureza).</p>
<p>Procurei ferramentas e achei vários horríveis, pra Windows. Então, por que não desenferrujar um pouco e fazer um pacote completo que baixa sua coleção completa de mangas e já gera um PDF otimizado pro tamanho do Kindle?</p>
<p>Aproveitei pra abusar um pouco do <a href="https://github.com/typhoeus/typhoeus">Typhoeus</a> que usa a libcurl por baixo e permite fazer downloads paralelos. A única coisa que vai limitar o processo é a velocidade de banda do seu provedor de internet.</p>
<p>Sem enrolar mais, o código-fonte <a href="https://github.com/akitaonrails/manga-downloadr">está no Github</a> ou instale diretamente a <a href="https://rubygems.org/gems/manga-downloadr">gem</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem install manga-downloadr
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E para usar, navegue no site do <a href="https://www.mangareader.net">MangaReader.net</a> escolha o manga que quiser e faça assim:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>manga-downloadr -n monster -u https://www.mangareader.net/99/monster.html -d /Users/akitaonrails/Documents/MangaReader
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E pronto! Se acontecer alguma interrupção (a internet cair ou coisa parecida) só execute novamente o mesmo comando e ele vai continuar de onde parou. Boa diversão!</p>
<p>PS: Não preciso dizer que não funciona em Windows ;-)</p>
<p></p>
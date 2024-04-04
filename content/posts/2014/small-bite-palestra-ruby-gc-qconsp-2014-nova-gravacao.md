---
title: "[Small Bite] Palestra \"Ruby & GC\" - QConSP 2014 (Nova Gravação!)"
date: "2014-08-01T23:50:00.000Z"
tags: ["ruby"]
years: "2014"
---

<p></p>
<p>O pessoal da QConSP soltou hoje a <a href="http://www.infoq.com/br/presentations/entendendo-garbage-collector-ruby">gravação</a> da minha palestra. Agradecimentos à organização e imagino o trabalho que minha palestra deve ter dado :-) Infelizmente o formato que eles usam é gravar o rosto do palestrante e sincronizar os slides disponibilizados em PDF.</p>
<p>O problema é que minha palestra não dá pra entender se a sincronização dos slides não estiver perfeita, não tiver as animações de transição e ainda por cima no PDF não vai os vídeos que eu gravei. Então, se assistir dessa forma, não vai dar pra entender esse assunto que já não é fácil.</p>
<p>Pensando nisso decidi fazer o seguinte: baixei o MP3 deles, abri o Keynote original e gravei usando <a href="http://www.telestream.net/screenflow/overview.htm">ScreenFlow</a>. Ficou quase sincronizado perfeito e deve estar <strong>muito</strong> melhor pra assistir. Acabei de subir no YouTube, então aproveitem!</p>
<p></p>
<p></p>
<div class="embed-container"><iframe src="https://www.youtube.com/embed/4JiPGHSKuTY" frameborder="0" allowfullscreen=""></iframe></div>
<p>O assunto Garbage Collection não é simples, e uma palestra só não dá pra explicar todos os detalhes, mas a idéia é usar a evolução do Ruby, que saltou de Mark &amp; Sweep, para Bitmap Marking &amp; Lazy Sweep, para Restricted Generational GC e está próximo de evoluir pra Restricted Three Gen GC (possivelmente no 2.2).</p>
<p>Quando fiz a palestra ela estava na versão 2.1.1. Já saiu a 2.1.2 que resolve o bug que eu descrevo no fim da palestra e eu atualizei os slides quando apresentei a mesma palestra na VI SECOT na UFScar Sorocaba:</p>
<div class="embed-container"><iframe src="//www.slideshare.net/slideshow/embed_code/34722473?rel=0" width="427" height="356" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen=""> </iframe>
  <div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/akitaonrails/ruby-gcs-verso-212-vi-secot-ufscar-sorocaba" title="Ruby &amp; GCs (versão 2.1.2) - VI Secot UFScar Sorocaba" target="_blank">Ruby &amp; GCs (versão 2.1.2) - VI Secot UFScar Sorocaba</a> </strong> from <strong><a href="https://www.slideshare.net/akitaonrails" target="_blank">Fabio Akita</a></strong> </div>
</div>
<p>Mesmo se você não for de Ruby, todos os conceitos são os mesmos que servem para discutir Garbage Collectors de Java, por exemplo, e vai melhorar sua compreensão desse assunto que, muitos acham que já entendem, mas poucos conseguem realmente compreender.</p>
<p></p>
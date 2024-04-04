---
title: "[Criptografia] Não use TripleDES/ECB - e uma curiosidade sobre Cipher Key do .Net"
date: "2014-01-13T15:01:00.000Z"
tags: ["beginner", "security"]
years: "2014"
---

<p></p>
<p>Recentemente num de nossos projetos tivemos que lidar com uma integração de dados vindo de um sistema feito em C#. Até aqui nenhum problema. O código que tivemos que usar como referência, vindo de um parceiro de nosso cliente, foi basicamente este:</p>
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
</pre>
      </td>
      <td class="code"><pre>using System;
using System.Security.Cryptography;
using System.Text;
class Program
{
        public <span style="color:#088;font-weight:bold">static</span> <span style="color:#088;font-weight:bold">void</span> Main(String[] args) {
                Console.WriteLine(EncryptData(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello world</span><span style="color:#710">"</span></span>));
        }
        public <span style="color:#088;font-weight:bold">static</span> string EncryptData(string Message)
        {
            byte[] Results;
            System.Text.UTF8Encoding UTF8 = new System.Text.UTF8Encoding();
            MD5CryptoServiceProvider HashProvider = new MD5CryptoServiceProvider();
            byte[] TDESKey = HashProvider.ComputeHash(UTF8.GetBytes(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">abc123</span><span style="color:#710">"</span></span>));
            TripleDESCryptoServiceProvider TDESAlgorithm = new TripleDESCryptoServiceProvider();
            TDESAlgorithm.Key = TDESKey;
            TDESAlgorithm.Mode = CipherMode.ECB;
            TDESAlgorithm.Padding = PaddingMode.PKCS7;
            byte[] DataToEncrypt = UTF8.GetBytes(Message);
            try
            {
                ICryptoTransform Encryptor = TDESAlgorithm.CreateEncryptor();
                Results = Encryptor.TransformFinalBlock(DataToEncrypt, <span style="color:#00D">0</span>, DataToEncrypt.Length);
            }
            finally
            {                
                TDESAlgorithm.Clear();
                HashProvider.Clear();
            }
            <span style="color:#080;font-weight:bold">return</span> Convert.ToBase64String(Results);
        }
}
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>Não estou quebrando confidencialidade simplesmente porque este é um código publicamente conhecido disponível no site <a href="https://www.codeproject.com/Tips/306620/Encryption-Decryption-Function-in-Net-using-MD5Cry">CodeProject</a>, sob licença. <a href="https://www.codeproject.com/info/cpol10.aspx">CPOL</a>. O que eu vi foi uma cópia exata disso. Mas cuidado: grandes empresas, em grandes sistemas usados por milhões de pessoas usam código exatamente como este. (#MEDO)</p>
<p>O ponto de atenção é que este exemplo tenta ser o mais simples possível. Por isso ele escolhe <a href="https://en.wikipedia.org/wiki/Triple_DES">TripleDES</a> - que é o DES aplicado 3 vezes pra cada bloco de dados -, um dos algoritmos mais antigos e mais simples, em vez de usar algo mais moderno como Rijndael/AES. Pior ainda, TripleDES não seria tão ruim se fosse usado no modo CBC em vez do modo ECB.</p>
<p>Falando em termos de leigo, a diferença é que o modo CBC (Cipher Block Chaining) exige o uso de um <a href="https://bit.ly/1m2TCjI">Initialization Vector (IV)</a> além da chave de encriptação. Diferente da chave - que deve ser "secreta" - o IV pode ser público e transmitido remotamente. O modo CBC vai usar esses dois componentes para fazer transformações em cadeia nos dados, adicionando uma camada extra de segurança.</p>
<p>No modo ECB (Electronic Code Book) você só precisa da chave - e por isso todo mundo usa TripleDES em modo ECB para exemplos e tutoriais: porque é mais simples - e aqui vai uma crítica para tutoriais que simplificam demais sem explicar as implicações, especialmente de segurança (!). O modo ECB é considerado inseguro.</p>
<p>Não sou um especialista em segurança, mas em termos leigos o mesmo dado passado pelo TripleDES com a mesma chave gera a mesma saída encriptada. Portanto se eu souber a entrada e saída de alguns dados, posso encontrar padrões que ajudem a decriptar outros dados, e impede o uso de <a href="https://en.wikipedia.org/wiki/Dictionary_attack">ataques baseados em dicionários</a> e <a href="https://en.wikipedia.org/wiki/Rainbow_table">rainbow tables</a>. Como um IV novo é gerado para cada vez que encripto no modo CBC (<em>importante:</em> sempre gere um novo IV aleatoriamente - tem métodos pra isso, não reuse IVs), o mesmo dado de entrada não gera duas saída iguais, dificultando muito encontrar padrões que ajudem a quebrar outros dados. É a mesma razão de porque usamos <a href="https://bit.ly/JV5KHv">"salts"</a> ao gerar digests de senhas antes de armazenar numa tabela de banco de dados. Esta resposta no <a href="https://security.stackexchange.com/questions/6058/is-real-salt-the-same-as-initialization-vectors">StackExchange</a> descreve melhor.</p>
<p>Portanto, se possível, use um algoritmo decente como AES-256, como <a href="https://www.codeproject.com/Articles/662187/FIPS-Encryption-Algorithms-and-Implementation-of-A">neste exemplo</a>. E se for usar TripleDES, pelo menos evite ECB e vá para CBC, mesmo com o trabalho extra de precisar de um IV.</p>
<p>Aliás, se puder também evite MD5 ou SHA1 para gerar digests de senhas. Eles são algoritmos "rápidos", quebráveis com rainbow tables e força bruta. Por isso hoje usamos algoritmos que são computacionalmente "caros" (demorados) como <a href="https://www.warmenhoven.co/2012/03/06/do-not-use-md5-or-sha1-to-simply-hash-db-passwords/">bcrypt</a>. MD5 e SHA1 são bons pra checar integridade de um download, por exemplo, e isso tem que ser rápido. Mas para evitar força bruta, use um demorado para o digest de senhas.</p>
<h2>A Curiosidade: MD5 da Cipher Key (passphrase)</h2>
<p>Como disse antes, independente da qualidade do código original, precisávamos fazer um em Ruby que gerasse o mesmo resultado. A "tradução" do código C# anterior em Ruby seria assim (versão simplificada):</p>
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
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rubygems</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">openssl</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">digest/md5</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">base64</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">encrypt_data</span>(passphrase, message)
  cipher = <span style="color:#036;font-weight:bold">OpenSSL</span>::<span style="color:#036;font-weight:bold">Cipher</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">des-ede3</span><span style="color:#710">'</span></span>)
  cipher.encrypt
  cipher.key = <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">MD5</span>.digest(passphrase)
  <span style="color:#036;font-weight:bold">Base64</span>.encode64(cipher.update(message) + cipher.final)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>É só isso mesmo. Vamos por partes.</p>
<ul>
  <li>Não deixe de ler a <a href="https://ruby-doc.org/stdlib-2.1.0/libdoc/openssl/rdoc/OpenSSL.html">documentação do OpenSSL</a>, ele explica bem as coisas que vou dizer a seguir.</li>
  <li>Pra escolher TripleDES em modo ECB basta instanciar com "des-ede3", pra ser CBC seria "des-ede3-cbc" ou apenas "des3" (alias)</li>
  <li>Por padrão o padding é <a href="https://ruby-doc.org/stdlib-2.1.0/libdoc/openssl/rdoc/OpenSSL/PKCS7.html">PKCS7</a>, então não precisa especificar.</li>
  <li>Sempre chame o método <tt>#encrypt</tt> antes de configurar a chave.</li>
  <li>Para pegar o resultado precisa chamar o método <tt>#update</tt> antes e concatenar com <tt>#final</tt>.</li>
  <li>Passamos o resultado por Base64 porque ele é binário, se quisermos uma string precisa converter.</li>
</ul>
<p>Se tentar rodar este método ele vai dar o seguinte problema:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre>&gt; encrypt_data("abc123", "hello world")
OpenSSL::Cipher::CipherError: key length too short
        from (irb):17:in `key='
        from (irb):17:in `encrypt_data'
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Se passar a mesma cipher key e mensagem pra versão .Net ele vai funcionar. Esta é a curiosidade:</p>
<ul>
  <li>Tanto a implementação .Net quanto Ruby esperam por padrão uma chave de 24-bytes (192-bits)</li>
  <li>Todo digest MD5 tem 16-bytes de tamanho (128-bits)</li>
</ul>
<p>No caso do Ruby, como estou passando uma chave menor que o padrão, ele estoura com o erro acima. Já o .Net faz outra coisa: ele acrescenta os 8-bytes que faltam. O problema é com o que.</p>
<p>Especificamente no .Net ele complementa os 8-bytes restantes com os 8-bytes iniciais do que é passado. Se fosse plain-text, por exemplo, e a chave passada fosse "1111111122222222", internamente ele converteria para "111111112222222211111111". Isso é dependente de implementação, no caso de PHP, se não estou enganado, ele complementa os 8-bytes restantes com nulo ou zero.</p>
<p>Por isso, pro método em Ruby ficar correto, precisamos fazer assim:</p>
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
</pre>
      </td>
      <td class="code"><pre>require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">rubygems</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">openssl</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">digest/md5</span><span style="color:#710">'</span></span>
require <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">base64</span><span style="color:#710">'</span></span>
<span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">encrypt_data</span>(passphrase, message)
  digest = <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">MD5</span>.digest(passphrase)
  cipher = <span style="color:#036;font-weight:bold">OpenSSL</span>::<span style="color:#036;font-weight:bold">Cipher</span>.new(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">des-ede3</span><span style="color:#710">'</span></span>)
  cipher.encrypt
  cipher.key = digest + digest[<span style="color:#00D">0</span>..<span style="color:#00D">7</span>] <span style="color:#777"># &lt;= eis o truque</span>
  <span style="color:#036;font-weight:bold">Base64</span>.encode64(cipher.update(message) + cipher.final)
<span style="color:#080;font-weight:bold">end</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Feito isso, o resultado agora será o mesmo do código em C#:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>&gt; encrypt_data(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">abc123</span><span style="color:#710">"</span></span>, <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">hello world</span><span style="color:#710">"</span></span>)
 =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">90v60JwFNH+VuIKJgSVWUw==</span><span style="color:#b0b">\n</span><span style="color:#710">"</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Para comparar, basta compilar e executar na sua máquina (se por acaso for um dev Windows) ou, se não for, ir no site <a href="https://www.compileonline.com/compile_csharp_online.php">Compile Online</a> que permite compilar e executar código em diversas linguagens diferentes diretamente na Web (dica do <a href="https://twitter.com/_carloslopes">@_carloslopes</a>).</p>
<p>Em resumo:</p>
<ul>
  <li>Só porque está encriptado não quer dizer "seguro";</li>
  <li>Entenda o que está copiando, não apenas copie;</li>
  <li>Não use TripleDES, prefira AES;</li>
  <li>Se for usar TripleDES, prefira CBC sobre ECB;</li>
  <li>NÃO USE MD5, ou mesmo SHA1 para hashing de senhas, use bcrypt ou outra coisa mais moderna;</li>
  <li>O módulo OpenSSL do Ruby vai conseguir replicar praticamente todo código criptografia de outras linguagens, facilitando integrações, mas existem pequenas diferenças a tomar cuidado.</li>
</ul>
<p></p>
---
title: "Indo de Ruby 1.8 e Rails 2.3 para Ruby 2.0 e Rails 3.2"
date: "2013-05-13T20:37:00.000Z"
tags: ["rails"]
years: "2013"
---

<p></p>
<p>Caso ainda não saiba, o bom e velho Ruby 1.8 desempenhou seu papel muito bem nos últimos anos e chegou a <a href="https://blog.engineyard.com/2012/ruby-1-8-7-and-ree-end-of-life">hora de aposentá-lo</a>. Ele não receberá mais manutenção ou mesmo correções de segurança a partir de Junho deste ano (2013). Significa que seu irmão-gêmeo, o venerado <a href="http://www.rubyenterpriseedition.com/">Ruby Enterprise Edition 1.8.7</a>, que nos apresentou a funcionalidade de <a href="http://www.akitaonrails.com/2008/4/19/o-que-ruby-enterprise-edition#.UZEj0Ss6WDQ">Copy-on-Write</a> e a possibilidade de refinar os parâmetros do garbage collector, também ser tornará obsoleto em breve.</p>
<p>O que acontece hoje é que existem muitos aplicativos ainda rodando em Ruby MRI ou REE 1.8.7, desenvolvido em Ruby on Rails 2.3, em produção, que ninguém sabe o que deve fazer. A resposta mais comum, caso pergunte aleatoriamente a um desenvolvedor, será "reescrever" em <a href="http://www.slideshare.net/akitaonrails/o-que-tem-de-novo-no-ruby-20">Ruby 2</a> e Ruby on Rails 3.2 (ou já arriscando para o <a href="http://www.slideshare.net/akitaonrails/whats-new-in-rails-4">Rails 4.0</a> que sairá em breve).</p>
<p>Minha resposta é diferente: se seu aplicativo está hoje em produção, com usuários acessando, minha primeira opção sempre será explorar a possibilidade de realizar o que chamamos de "migração técnica". Uma migração técnica:</p>
<ul>
  <li>não envolve mudar funcionalidades ou criar novas;</li>
  <li>no máximo retirar funcionalidades desnecessárias;</li>
  <li>e apenas realizar a atualização para as versões mais recentes de Ruby e Rails.</li>
</ul>
<p></p>
<p></p>
<p>Reescrever sempre é mais arriscado e - normalmente - representa um custo/benefício inferior. Isso porque reescrever significa:</p>
<ul>
  <li>precisar atingir "paridade de funcionalidades", ou seja, ter no mínimo as mesmas funcionalidades principais do seu aplicativo atual;</li>
  <li>se conseguir fazer isso (e a maioria não consegue), haverá um momento com dois aplicativos rodando em produção onde você precisará tentar uma migração dos dados (com regras de negócio possivelmente diferentes) para uma nova base e "virar a chave";</li>
  <li>haverá um bom período de "estabilização". Um aplicativo reescrito significa retornar à versão 1.0, com muito mais bugs do que o antigo, e até ele se estabilizar - com uma base de usuários ativa - vai demorar;</li>
  <li>durante todo esse período você provavelmente não vai conseguir lançar novas funcionalidades - pois significaria implementar duas vezes, no antigo e no novo - isso pode causar sérios problemas de competitividade de mercado (onde outros menores podem começar a lançar o que você já deveria ter lançado, na sua frente).</li>
</ul>
<p>Portanto a resposta automática nunca deverá ser reescrever. Analise os impactos que mencionei e diversos outros que dependem do seu negócio. Isso tudo dito, porque a maioria dos desenvolvedores respondem automaticamente "reescrever"?</p>
<ul>
  <li>porque ninguém gosta de assumir código de outro programador, especialmente código "velho", que não é esteticamente atualizado. Em diferentes níveis, todo programador sofre da síndrome de NIH (Not Invented Here);</li>
  <li>porque o código tem pouco ou nenhum teste automatizado, e portanto o risco de mudar código é alto e poucos programadores se sentem confortáveis em assumir a responsabilidade de um código desconhecido.</li>
</ul>
<p>Se for resumir, a raíz do problema costuma ser dois sentimentos que se contradizem: Ego e Insegurança. Se contradizem porque Ego pressupõe uma confiança nas próprias habilidades de conseguir fazer melhor que o anterior, e Inssegurança pressupõe falta de confiança nas próprias habilidades de conseguir fazer melhor que o anterior. Se você é programador, reflita sobre isso.</p>
<p>Por outro lado eu considero que um programador que tem pouco Ego e muita Segurança é sempre o que tem mais chances de poder se chamar um sênior de verdade. Afinal o que parece mais "fácil" qualquer um sabe fazer, no mundo do "difícil" existe pouca concorrência, pois poucos sobrevivem.</p>
<p>Muitos já me consultaram sobre o que fazer para atualizar um aplicativo Ruby 1.8 com Rails 2.3 para as versões mais novas.</p>
<p>Minha resposta é sempre a mesma:</p>
<h2>"Um Passo de Cada Vez"</h2>
<p>O primeiro erro básico que <strong>TODOS</strong> os desenvolvedores de todos os níveis cometem logo de cara é tentar atualizar diretamente do Ruby 1.8 para 1.9 ou 2.0 e do Rails 2.3 para 3.2 ou 4.0. Está errado, isso é um passo maior do que você vai conseguir administrar.</p>
<p>Eu pessoalmente participei na atualização de uma aplicação antiga exatamente nessas condições e fui bem sucedido. O aplicativo não era super complicado mas estava longe de ser trivial. Ao mesmo tempo que subimos de Ruby 1.8 para Ruby 2.0 e de Rails 2.3 para Rails 3.2; subimos a cobertura de teste de zero para mais de 50% (e isso sem ignorar as diversas configurações de ActiveAdmin no <tt>app/admin</tt> que conta como arquivo Ruby não coberto por teste).</p>
<p>Além disso, em paralelo, otimizamos a performance da aplicação, da infraestrutura, e conseguimos um ganho de performance ridículo onde as requisições mais pesadas, que antes faziam o usuário esperar até 15 segundos (!!), agora não ultrapassam 400ms (segundos para milissegundos, exatamente isso). E veja que qualquer coisa acima de 200ms eu ainda não considero rápido o suficiente. No mundo perfeito, total abaixo de 100ms por requisição é o ideal. "Tempo total" é o tempo de processamento mais o overhead da infraestrutura e internet.</p>
<p>Isso foi um processo que, não trabalhando tempo integral me custou pouco menos de <strong>3 semanas</strong> de trabalho. Obviamente seu tempo vai variar dependendo da complexidade da sua aplicação e da estratégia da sua empresa (que deve ser levada em consideração o tempo todo).</p>
<p>Antes de mais nada, se você nunca usou os Rails mais atuais do que 2.3, pelo menos tenha uma noção lendo os <strong>Release Notes</strong> que está no Guia oficial:</p>
<ul>
  <li><a href="https://guides.rubyonrails.org/2_3_release_notes.html">Ruby on Rails 2.3 Release Notes</a></li>
  <li><a href="https://guides.rubyonrails.org/3_0_release_notes.html">Ruby on Rails 3.0 Release Notes</a></li>
  <li><a href="https://guides.rubyonrails.org/3_1_release_notes.html">Ruby on Rails 3.1 Release Notes</a></li>
  <li><a href="https://guides.rubyonrails.org/3_2_release_notes.html">Ruby on Rails 3.2 Release Notes</a></li>
  <li><a href="https://edgeguides.rubyonrails.org/4_0_release_notes.html">Edge - Ruby on Rails 4.0 Release Notes</a></li>
</ul>
<p>Todos os Rails, da versão 2.3 até a 3.2 suportam Ruby 1.8.7, portanto você pode escolher mudar o Ruby só no final. Por outro lado se quiser arriscar a série 1.9, até o Rails 3.1 use apenas até o Ruby 1.9.2. Só mude para Ruby 1.9.3 no Rails 3.2.</p>
<p>Em particular, neste momento (Maio de 2013) recomendo ficar no Ruby 1.9.3 com Rails 3.2. Se chegar até esse ponto, você vai, no mínimo, ter uma sobrevida até 2014. Só depois que tiver certeza que está tudo estável nessas versões, mude para Rails 4.0.</p>
<h2>Rails 2.3 para Rails 3.0</h2>
<p>Nesta primeira etapa você praticamente não vai precisar alterar nada pois o Rails 3.0 mantém um alto nível de compatibilidade com o anterior. Coisas como as APIs novas de Routing, ActiveRelation, nada disso é obrigatório. O resto é o mesmo: views ERB vai funcionar igual, seus assets no <tt>/public</tt> funcionam normalmente.</p>
<p>O maior impacto para quem nunca foi para a versão 3.0 é aprender a usar o <a href="https://gembundler.com/v1.3/rails23.html">Bundler</a> que inclusive você já pode adicionar a um projeto 2.3 antes de tentar migrar para 3.0.</p>
<p>Um dica válida para toda atualização significativa de Rails: crie um projeto novo na versão para onde está mudando e compare todos os arquivos da pasta <tt>/config</tt>, todos. Muitos dos erros que aparecem é por falta das novas configurações.</p>
<p>Sobre configurações ainda, antigamente existiam as gems chamadas "mysql" e "postgres", elas devem ser atualizadas para as gems <a href="https://rubygems.org/gems/mysql2">mysql2</a> e <a href="https://rubygems.org/gems/pg">pg</a>, respectivamente. Elas são o que chamamos de <em>drop-in replacements</em>, ou seja, apenas troque e tudo deve continuar funcionando sem que você precise mudar nada.</p>
<p>Para quem não se lembra, o Ruby on Rails 3.0 foi o primeiro (e felizmente bem sucedido) "HUMONGOUS REWRITE" do framework. Isso foi amplamente divulgado, centenas de blog posts foram escritos, muita polêmica foi levantada, quase 2 anos foram gastos nesse assunto. Até o Rails 2.3 foi uma evolução do antigo código que o próprio David Hansson escreveu em 2004. As versões atuais são derivadas da nova arquitetura que nasceu no Rails 3.0. Em resumo, não estaríamos hoje falando de Rails se a versão 3.0 tivesse fracassado.</p>
<p>Isso justifica porque migrar do Rails 2.3 para o 3.0 exige um volume de esforço não tão grande. Você só terá problemas se escreveu código extremamente mal feito ainda na versão 2.3, fugindo completamente das convenções aceitas até então. Exemplo disso são monkey-patches feitos diretamente sobre o framework. Como no 3.0 as APIs internas mudaram, gambiarras vão necessariamente quebrar. Se você tem consciência que fez muita gambiarra e brigou contra o framework, agora o preço será devidamente cobrado, e com juros.</p>
<p>As principais APIs que você precisará saber que mudou (mas que a versão antiga ainda funciona no 3.0), em ordem do mais simples até o mais complicado de mudar:</p>
<ul>
  <li>
    <p><a href="https://lindsaar.net/2010/1/26/new-actionmailer-api-in-rails-3">Novo Mailer</a>. Na maior parte será apenas um caso de alterar nomes de métodos. Aproveite para adicionar specs. Será uma atualização razoavelmente mecânica de uma API para outra.</p>
  </li>
  <li>
    <p><a href="https://www.railsdispatch.com/posts/rails-routing">Novo Router</a>. Novamente, na maior parte será uma modificação praticamente toda mecânica de uma API para outra. Onde haverá mais complicações será em rotas com <em>constraints</em>. Um passo <strong>muito importante</strong> é obrigatoriamente fazer pelo menos um <a href="https://github.com/rspec/rspec-rails#routing-specs">Routing Spec</a> que cobre suas rotas atuais. Seja cuidadoso, cubra todas as rotas e só depois que tiver essa cobertura comece mudar para a nova API.</p>
  </li>
  <li>
    <p>ActiveRecord - esta foi outra parte que mudou muito: as APIs que abstraem o banco de dados. Novamente, a sintaxe antiga continuará funcionando, mas é outra parte que você precisará dedicar muito tempo para entender cada nuance. A regra é a mesma: se seu código seguia as convenções haverá poucos pontos onde a mudança será difícil. Estude todo material sobre <a href="https://www.railsdispatch.com/posts/activerelation">ActiveRelation</a> que puder.</p>
  </li>
  <li>
    <p>Rails RJS - se sua aplicação foi feita com muito Ajax e usando as antigas helpers RJS em vez de usar Javascript não-obtrusivo, certamente essa pode ser a parte onde você terá mais trabalho para migrar. Eu já escrevi um <a href="https://www.akitaonrails.com/2010/05/10/rails-3-introducao-a-javascript-nao-obstrusivo-e-responders">artigo sobre isso 3 anos atrás</a>. Para começar helpers como <tt>link_to_remote</tt> não funcionam mais. Para facilitar a migração neste ponto você ainda pode carregar as seguinte gems antigas no Gemfile:</p>
  </li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># gem 'jquery'</span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">prototype</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">prototype-ujs</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">prototype_legacy_helper</span><span style="color:#710">'</span></span>, <span style="color:#A60">:git</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">git://github.com/rails/prototype_legacy_helper.git</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vai fazer tudo funcionar como era antes. Mas não se engane, se sua aplicação tiver um volume grande de RJS você terá realmente que reescrever praticamente metade da sua aplicação na parte mais visível para o usuário: as telas. Vale a pena gastar um tempo avaliando esse aspecto.</p>
<p>No geral, o procedimento é o mesmo: crie specs para a parte do código que usa a API 2.3 <strong>ANTES</strong> de migrar o código para a API 3.0. Não faça todas as specs do projeto todo de uma vez só: como eu disse antes, faça um passo de cada vez. Faça uma spec, mude a API, repita o ciclo. Passo a passo será muito mais rápido e o risco será muito menor.</p>
<p>A mudança do Rails 2.3 para 3.0, do ponto de vista técnico, não é complicado. Seu maior trabalho num primeiro momento será começar a entender a nova arquitetura, entender o Bundler, ver se a maioria das dependências externas ainda funcionam. Em particular vasculhe cuidadosamente seu diretório <tt>vendor/plugins</tt>, faça o possível para retirar <strong>TODOS</strong> os plugins e encontrar suas versões em Rubygems para acrescentá-las na <tt>Gemfile</tt>.</p>
<p>Substitua um plugin de cada vez: ache a gem, declare no <tt>Gemfile</tt>, rode o comando <tt>bundle</tt> para ver se nada quebra na instalação, execute a aplicação, veja se o comportamento ainda é o mesmo, e repita. Novamente, adivinhe onde dará problemas? Adivinhou: se alguém alterou o código do plugin depois de adicionar no projeto e você não sabe disso.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/363/Screen_Shot_2013-05-13_at_4.35.18_PM.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/363/Screen_Shot_2013-05-13_at_4.35.18_PM.png 2x" alt="Upgrading plugins"></p>
<p>Uma forma de garantir que o plugin não foi "estuprado" indevidamente: ache o Github do projeto, faça um clone na sua máquina (de preferência dando checkout num commit da época em que o plugin foi instalado no seu projeto). Agora pegue o código do plugin que está no seu projeto e copie os arquivos por cima do clone. Agora use o comando <tt>git status</tt>, <tt>git diff</tt> para ver onde eles diferem.</p>
<p>Na época o pessoal do Peepcode lançou um <a href="https://peepcode.com/blog/2010/live-coding-rails-3-upgrade">eBook e screencast</a> que ainda vale a pena dar uma olhada.</p>
<h2>Rails 3.0 para 3.1</h2>
<p>A imagem a seguir resume esta etapa:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/364/Screen_Shot_2013-05-13_at_4.37.53_PM.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/364/Screen_Shot_2013-05-13_at_4.37.53_PM.png 2x" alt="Asset Pipeline"></p>
<p>Relembrando, antigamente todos os seus assets ficavam no diretório <tt>/public</tt>. Era caos. Agora fica tudo em <tt>/app/assets</tt> e passa pelo <strong>Asset Pipeline</strong> que foi inaugurado no Rails 3.1. E até você aprender as nuances desta funcionalidade você irá odiá-la. Confiem em mim: depois da primeira dor (que vocês vão passar), será bem mais fácil.</p>
<p>Lembram o que eu disse sobre RJS na seção anterior? Agora é a hora de começar a trocar os helpers antigos pelos novos. Na prática não é muito complicado, por exemplo:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># Rails 2.3</span>
link_to_remote <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Delete this post</span><span style="color:#710">"</span></span>, <span style="color:#A60">:update</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">posts</span><span style="color:#710">"</span></span>,
    <span style="color:#A60">:url</span> =&gt; { <span style="color:#A60">:action</span> =&gt; <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">destroy</span><span style="color:#710">"</span></span>, <span style="color:#A60">:id</span> =&gt; post.id }
<span style="color:#777"># Rails 3.x</span>
link_to <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">Delete this post</span><span style="color:#710">"</span></span>, post_path(post), <span style="color:#A60">:method</span> =&gt; <span style="color:#A60">:destroy</span>, <span style="color:#A60">:remote</span> =&gt; <span style="color:#069">true</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Leiam com muito cuidado meu tutorial sobre como usar Asset Pipeline, <a href="https://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes">Parte 1</a> e <a href="https://www.akitaonrails.com/2012/07/01/asset-pipeline-para-iniciantes-parte-2">Parte 2</a>. Assumindo que você já leu, praticou e entendeu o básico, os passos são "simples" embora sejam manualmente trabalhosos e exijam atenção e concentração para não se perder:</p>
<ul>
  <li>mova tudo da pasta <tt>/public</tt> para as respectivas pastas em <tt>/app/assets</tt>;</li>
  <li>crie os arquivos <tt>/app/assets/javascripts/application.js</tt> e <tt>/app/assets/javascripts/application.css</tt> para declarar as dependências - retire tudo que você carregava individualmente no <tt>/app/views/layouts/application.html.erb</tt>;</li>
  <li>garanta que seu <tt>Gemfile</tt> tem as bibliotecas <tt>jquery-rails</tt>. Se por acaso você usava Prototype para mais do que o Ajax padrão do Rails antigo, vai precisar do <tt>protototype-rails</tt>, e nesse caso seu <tt>application.js</tt> deverá ter:</li>
</ul>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
<a href="#n3" name="n3">3</a>
<a href="#n4" name="n4">4</a>
<a href="#n5" name="n5">5</a>
<a href="#n6" name="n6">6</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777">//= require prototype</span>
<span style="color:#777">//= require prototype_ujs</span>
<span style="color:#777">//= require effects</span>
<span style="color:#777">//= require dragdrop</span>
<span style="color:#777">//= require controls</span>
<span style="color:#777">//= require menu</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<ul>
  <li>agora modifique toda URL que não é gerada por helpers e que tem caminhos como <tt>/images</tt> para <tt>/assets</tt>;</li>
  <li>para facilitar renomeie todos os stylesheets para serem <tt>.css.scss</tt> e agora substitua toda URL para assets como <tt>url("../images/glyphicons.png")</tt> para <tt>image-url("glyphicons.png")</tt> e o SASS fará o resto por você;</li>
  <li>os helpers de ActionView que são blocos precisam explicitamente ter "=" no ERB, troque em todas as views. Ou seja:</li>
</ul>
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
      <td class="code"><pre><span style="color:#777">&lt;!-- Rails 2.3 --&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>% form_for :contato do |f| %<span style="color:#F00;background-color:#FAA">&gt;</span>
...
<span style="color:#777">&lt;!-- Rails 3.x --&gt;</span>
<span style="color:#F00;background-color:#FAA">&lt;</span>%= form_for :contato do |f| %<span style="color:#F00;background-color:#FAA">&gt;</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Existem muito mais passos, por isso a recomendação é realmente entender os princípios por atrás do Asset Pipeline. No meu caso ainda tive que retirar do código antigo uma coisa que poderia ser chamado de "primeira tentativa de um Asset Pipeline" que foi o Bundle-fu. No final minha sequência ficou assim:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/365/Screen_Shot_2013-05-13_at_4.49.15_PM.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/365/Screen_Shot_2013-05-13_at_4.49.15_PM.png 2x" alt="Upgrade Asset Pipeline"></p>
<p>A boa notícia é que esta será possivelmente a parte mais dolorida da migração, se conseguir passar por esta etapa as próximas tendem a doer menos. E eu digo que vai doer porque tudo que mexe no front-end dói muito pois estamos mexendo em javascript, em helpers, em tudo que pode quebrar drasticamente a usabilidade da sua aplicação. Se não tiver testes automatizados como com Selenium, recomendo colocar uma pessoa responsável por realizar o Q&amp;A (Quality Assurance) da aplicação antes de colocar em produção.</p>
<p>Além disso algumas das gems que você ainda pôde manter até agora precisam ir embora, especialmente se você investigar o repositório no Github e ver que elas não tem atualizações há alguns meses. Eis um exemplo que você talvez tenha:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/366/Screen_Shot_2013-05-13_at_5.05.02_PM.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/366/Screen_Shot_2013-05-13_at_5.05.02_PM.png 2x" alt="Restful Authentication"></p>
<p>Isso vai dar um pouco de trabalho, felizmente mudar para Devise não é complicado (embora trabalhoso, mas neste ponto você já deve estar acostumado) só que em particular esta gem não é compatível com Rails 3.1 então precisa ser atualizada já que o projeto original ficou parado. E lembre-se que existem diversas <a href="https://www.ruby-toolbox.com/categories/rails_authentication">alternativas de autenticação</a>. Devise é um dos mais conhecidos mas não é a única opção e dependendo da sua aplicação talvez nem seja a melhor, por isso pelo menos dê uma lida na página dos 5 mais usados.</p>
<p>No seu <tt>Gemfile</tt> você vai precisar das seguintes gems:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">devise</span><span style="color:#710">'</span></span>
gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">devise-encryptable</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Leia a <a href="https://github.com/plataformatec/devise/wiki/How-To:-Migrate-from-restful_authentication-to-Devise">documentação do Devise</a> mas além das gems, transportar as views, os mailers, nos controllers você vai trocar as rotas e a API antiga pela nova:</p>
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
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># Restful Authentication</span>
before_filter <span style="color:#A60">:login_required</span>
<span style="color:#777"># Devise</span>
before_filter <span style="color:#A60">:authenticate_user!</span>
<span style="color:#777"># Restful Authentication</span>
before_filter <span style="color:#A60">:login_required</span>
<span style="color:#777"># Devise</span>
before_filter <span style="color:#A60">:authenticate_user!</span>
<span style="color:#777"># Restful Authentication</span>
<span style="color:#080;font-weight:bold">if</span> logged_in?
<span style="color:#777"># Devise</span>
<span style="color:#080;font-weight:bold">if</span> signed_in?
<span style="color:#777"># Restful Authentication</span>
redirect_back_or_default(<span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">"</span><span style="color:#D20">/</span><span style="color:#710">"</span></span>)
<span style="color:#777"># Devise</span>
redirect_to root_url
<span style="color:#777"># Restful Authentication</span>
include <span style="color:#036;font-weight:bold">Authentication</span>
include <span style="color:#036;font-weight:bold">Authentication</span>::<span style="color:#036;font-weight:bold">ByPassword</span>
include <span style="color:#036;font-weight:bold">Authentication</span>::<span style="color:#036;font-weight:bold">ByCookieToken</span>
<span style="color:#777"># Devise</span>
devise <span style="color:#A60">:database_authenticatable</span>, <span style="color:#A60">:registerable</span>,
       <span style="color:#A60">:recoverable</span>, <span style="color:#A60">:rememberable</span>, <span style="color:#A60">:confirmable</span>, <span style="color:#A60">:validatable</span>, 
       <span style="color:#A60">:encryptable</span>, <span style="color:#A60">:encryptor</span> =&gt; <span style="color:#A60">:restful_authentication_sha1</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Esses são alguns exemplos. A vantagem nessa migração é que o Devise é compatível com o esquema de SHA1 que o Restful Authentication usava e por isso você não vai precisar mudar a senha dos seus usuários. Tecnicamente tudo deve funcionar sem problemas. O que vai mudar são as rotas antigas.</p>
<h1>Rails 3.1 para 3.2</h1>
<p>Agora é a hora e realizar o que era opcional na migração técnica para 3.0. Mudar as APIs de mailers, routes e, principalmente, focar na <a href="https://m.onkey.org/active-record-query-interface">Query Interface do ActiveRelation</a>. Aproveite para ver esta <a href="https://blog.mitchcrowe.com/blog/2012/04/14/10-most-underused-activerecord-relation-methods/">lista dos 10 métodos menos conhecidos, e menos usados, do ActiveRecord::Relation</a>.</p>
<p>Se você fez passo a passo, como disse antes, neste ponto o projeto já deve estar bem mais organizado, com gems mais novas, com mais specs cobrindo o que você foi mudando.</p>
<p>Um teste que você pode fazer é trocar para Ruby 1.9.3, executar <tt>bundle</tt> e rodar as specs que criou até agora. Teoricamente, se isso passar você deve estar muito próximo de poder retirar o Ruby 1.8.7. Quando uma gem velha dá problema ou se seu código possui algum trecho incompatível o comando <tt>rake spec</tt> ou mesmo <tt>rails s</tt> para subir o servidor vai falhar imediatamente por erros de sintaxe. Já é um bom sinal se minimamente executar. Caso contrário <strong>LEIA AS MENSAGENS DE ERRO</strong>, elas dizem claramente o que está dando errado.</p>
<blockquote>
  <p>Cansei de receber emails e mensagens me perguntando porque alguma coisa estava dando errado. Bastava copiar a mensagem de erro no Google e a resposta sempre aparece. Aprenda: o erro que você está tendo dificilmente é inédito e já existem soluções documentadas. Se você não encontrou a possibilidade mais óbvia é que você não soube procurar direito. Portanto procure antes de perguntar, não tenha preguiça.</p>
</blockquote>
<p>Neste ponto você deve estar ainda corrigindo bugs relacionados à migração técnica. Não se preocupe: até você cobrir o aplicativo todo com specs, vai continuar recebendo reclamações de coisas que funcionavam antes e pararam de funcionar. Mas se foi esperto, a cada passo dado até aqui você foi adicionando specs.</p>
<p>Sobre o Rails 3.2 fica uma dica: neste momento (Maio de 2013) use o Rails versão <strong>3.2.12</strong> ou acima da 3.2.13 mas não use a 3.2.13. O post já está longo mas fica o link para entender os <a href="https://blog.bugsnag.com/2013/03/20/rails-3-2-13-performance-regressions-major-bugs/">problemas que essa versão causou</a>.</p>
<p>Se você fez a migração como recomendado para a versão 3.1 agora com a 3.2 terá um bônus. Adicione o seguinte na sua <tt>Gemfile</tt>, no grupo <tt>:assets</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
</pre>
      </td>
      <td class="code"><pre>gem <span style="background-color:hsla(0,100%,50%,0.05)"><span style="color:#710">'</span><span style="color:#D20">turbo-sprockets-rails3</span><span style="color:#710">'</span></span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Isso vai acelerar muito a pré-compilação dos seus assets (coisa que provavelmente já estava te deixando irritado até agora).</p>
<p>Na versão 3.2 você tem a opção de tornar <a href="https://guides.rubyonrails.org/security.html#mass-assignment">Mass Assignment</a> mais rígido adicionando o seguinte em todos os arquivos de ambiente em <tt>/config/environments/</tt>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line-numbers" title="double click to toggle" ondblclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre><a href="#n1" name="n1">1</a>
<a href="#n2" name="n2">2</a>
</pre>
      </td>
      <td class="code"><pre><span style="color:#777"># Raise exception on mass assignment protection for Active Record models</span>
config.active_record.mass_assignment_sanitizer = <span style="color:#A60">:strict</span>
</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>E apesar de ter sido opcional até agora, você <strong>DEVE</strong> ligar essa restrição e tratar de adicionar <tt>attr_accessible</tt> em todos os seus models. Coloque na lista apenas os campos que efetivamente precisam ser populados via hash no construtor da classe. Caso contrário mantenha escondida. Esse é um erro de segurança muito comum que deve ser consertado o quanto antes.</p>
<p>Se segurança nunca foi sua preocupação, este é o melhor momento para considerar isso. Durante a vida da série 3.2 diversos bugs de segurança foram expostos. Leia o <a href="https://guides.rubyonrails.org/security.html">Guia Oficial de Segurança</a>. Conheça a gem <a href="https://brakemanscanner.org/">Brakeman</a>, conhecido como o Rails Security Scanner, para avaliar seu código por buracos conhecidos de segurança. Lembre-se: se são buracos conhecidos e você não se preocupou com isso, alguém vai eventualmente entrar no seu sistema. Depois disso não importa mais o que fizer, segurança é uma coisa que uma vez estourada não se recupera se forma trivial.</p>
<h2>Para o Futuro: Ruby 2.0 e Rails 4</h2>
<p>Se você seguiu até aqui, trocar para Ruby 2.0 não deve ser um problema. Existem várias novas funcionalidades nele que você não precisa implementar agora. Ele é "quase" um drop-in replacement para o Ruby 1.9.3 então não deve dar dores de cabeça. Existem dezenas de artigos na internet sobre Ruby 2.0 mas para uma introdução segue os slides de uma palestra que dei a respeito:</p>
<div class="embed-container">
  <iframe src="https://www.slideshare.net/slideshow/embed_code/18406459?rel=0" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""> </iframe>
</div>
<div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/akitaonrails/o-que-tem-de-novo-no-ruby-20" title="O que tem de novo no Ruby 2.0?" target="_blank">O que tem de novo no Ruby 2.0?</a> </strong> from <strong><a href="https://www.slideshare.net/akitaonrails" target="_blank">Fabio Akita</a></strong> </div>
<p>Já o Rails 4 ainda não é versão final, está em <a href="https://weblog.rubyonrails.org/2013/5/1/Rails-4-0-release-candidate-1/">Release Candidate 1</a> e isso ainda vai dar dores de cabeça num futuro próximo até que todas as principais gems do ecossistema se atualizem. Muitas já foram como o <a href="https://blog.plataformatec.com.br/2013/05/devise-and-rails-4/">Devise</a>. Ano passado palestrei em Israel sobre o Rails 4, eis os slides:</p>
<div class="embed-container">
  <iframe src="https://www.slideshare.net/slideshow/embed_code/14797832?rel=0" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC;border-width:1px 1px 0;margin-bottom:5px" allowfullscreen="" webkitallowfullscreen="" mozallowfullscreen=""> </iframe>
</div>
<div style="margin-bottom:5px"> <strong> <a href="https://www.slideshare.net/akitaonrails/whats-new-in-rails-4" title="What's new in Rails 4" target="_blank">What's new in Rails 4</a> </strong> from <strong><a href="https://www.slideshare.net/akitaonrails" target="_blank">Fabio Akita</a></strong> </div>
<p>Agora no Rails 4 preparem-se para o seguinte: tudo aquilo que você veio trazendo do Rails 2.3 porque ainda era compativel se tornará incompatível no Rails 4. Um exemplo são as APIs de rotas ou o ActiveRelation. Nem pense em instalar a nova versão até ter migrado tudo para as APIs novas. Veja as mensagens de "deprecation" que vão aparecer no Rails 3.2 e migre aos poucos.</p>
<p>Meu conselho é simples: se você está perguntando a alguém <em>"Posso usar Rails 4?"</em> então significa que você não deve usar. Mantenha-se no Rails 3.2 com tudo atualizado, adicione mais specs para cobrir a maior parte da sua aplicação. A chave para uma migração tranquila é ter uma boa suíte de specs prontas. Se fizer isso o processo tende a ser razoavelmente indolor, muito menos do que o que resumi neste artigo.</p>
<p></p>
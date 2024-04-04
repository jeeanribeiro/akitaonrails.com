---
title: "Aprendendo Ruby e Rails, Livros e Guias"
date: "2014-07-13T18:18:00.000Z"
tags: ["beginner", "ruby", "rails", "book"]
years: "2014"
---

<p></p>
<p>Um dos mais conhecidos rubistas de nossa comunidade brasileira, Eustáquio Rangel acabou de lançar um bom ebook direcionado para quem quer começar com Rails. <a href="https://leanpub.com/conhecendo-rails">Conhecendo Rails</a>. E por apenas USD 15, deixe-me dizer, é uma pechincha.</p>
<p>A intenção deste post é fazer um pequeno review deste livro e aproveitar para linkar mais material que vai te ajudar a ir adiante neste aprendizado.</p>
<p>Por acaso, o livro do Taq tem o mesmo perfil do <a href="http://pragprog.com/book/rails4/agile-web-development-with-rails-4">Agile Web Development with Rails</a> pois ele usa o desenvolvimento de um pequeno aplicativo de loja virtual como base. Obviamente, não será uma loja virtual completa e complexa para ser substituto de um Magento ou <a href="https://github.com/spree/spree">Spree Commerce</a> mas serve para exercitar os principais conceitos do framework.</p>
<p>Uma coisa que gosto da linha do Taq é que ele se ateve ao stack básico do Rails. Por exemplo, todos os exemplos de código usam exclusivamente o Test/Unit do próprio Rails em vez de ir direto pra Rspec, incluindo funcionalidades como Fixtures em vez de ir pra FactoryGirl. Eu acredito que o melhor é usar o que vem já no Rails e depois evoluir pra <a href="http://betterspecs.org">RSpec</a>, <a href="https://github.com/thoughtbot/factory_girl">FactoryGirl</a> ou <a href="http://www.fabricationgem.org">Fabrication</a>.</p>
<p>O livro começa explicando os conceitos mais copiados do Rails como "Don't Repeat Yourself" e o famoso "Convention over Configuration", que são as bases de um bom framework produtivo hoje em dia. Logo em seguida começa criando a estrutura da aplicação e indo para conceitos como Migrations, Asset Pipeline, Testes, ActiveSupport. Dali em diante ele expande sobre a aplicação apresentando funcionalidades como Rotas Restful, Views e Layouts, Associação de models do ActiveRecord. Finalmente, avança para conceitos um pouco mais complicados para quem está iniciando como Upload de Arquivos, Caching, Deploy. E no fim do livro ele lista outras coisas fora do framework que usamos nos projetos como Minitest, Guard, Capybara, FactoryGirl, Papertrail, e outros.</p>
<p>Para quem nunca viu o framework, o livro é excelente por apresentar as principais funcionalidades e dar exemplos dos aspectos essenciais.</p>
<p></p>
<p></p>
<h2>Críticas</h2>
<p>Não considerem minhas críticas como algo negativo ao livro. Enviei esta seção ao Taq para avaliação (ele provavelmente vai continuar evoluindo o livro), mas o que segue são minhas impressões iniciais.</p>
<p>A primeira é que o livro é baseado em Rails 4.0. Lembrem-se de que o Rails já está na 4.1. Leia o <a href="https://guides.rubyonrails.org/4_1_release_notes.html">Release Notes</a> para aprender sobre funcionalidades como Spring (em vez do Guard apresentado no livro), config/secrets.txt (ou mesmo <a href="https://www.akitaonrails.com/2013/10/19/iniciante-configuracoes-de-ambiente-com-dotenv">dotenv-rails</a> que não é falado no capítulo de Deploy). Mesmo da versão 4.0 senti falta de uma explicação sobre Turbolinks. E no capítulo de Caching ele explica sobre caches_page e caches_action, porém eles já não existem mais no Rails 4.1. O Taq menciona isso no livro mas precisa das gems <a href="https://github.com/rails/actionpack-page_caching">actionpack-page_caching</a> e <a href="https://github.com/rails/actionpack-action_caching">actionpack-action_caching</a>, mas isso não é mais recomendado. Em vez disso, o livro já menciona a alternativa que é o Russian Doll Caching ou mesmo primeiro ir para <a href="https://github.com/rtomayko/rack-cache">rack-cache</a> e uso de <a href="https://api.rubyonrails.org/classes/ActionController/ConditionalGet.html">etag/conditional get</a>. Só isso já dá uma ordem de grandeza de performance e são simples de implementar.</p>
<p>Senti um pouco de falta de mais detalhes sobre ActiveRecord e Arel em particular. Muita gente que está iniciando não sabe que existem as Relations e como elas funcionam. Erros comuns como carregar tudo em memória em vez de usar <a href="https://api.rubyonrails.org/classes/ActiveRecord/Batches.html">ActiveRecord::Batches</a> ou não usar a <a href="https://jpospisil.com/2014/06/16/the-definitive-guide-to-arel-the-sql-manager-for-ruby.html">sintaxe do Arel</a> e colocar tudo com strings. O ActiveRecord, por si só, daria outro livro inteiro de patterns, anti-patterns e truques. Mas mencionar esses aspectos já ajudaria.</p>
<p>O capítulo de Views e Layouts apresenta HAML. Não tenho nada contra o HAML, mas no conceito do livro de usar o stack padrão do Rails, talvez fosse mais importante manter o ERB para ficar coeso (e o resto do livro mescla HAML e partials com ERB) e deixar HAML e SLIM para os apêndices. Já o SASS é apresentado somente no final do livro, mas o SASS vem integrado por padrão no Rails e é uma das coisas mais importantes para produtividade front-end. É extremamente comum fazer qualquer aplicação Rails de front-end decente usando pacotes como <a href="https://compass-style.org">Compass</a> e <a href="https://bourbon.io">Bourbon</a> e frameworks de grid como <a href="https://susy.oddbird.net">Susy</a> e <a href="https://neat.bourbon.io">Neat</a>.</p>
<p>Em particular, o livro também tem uma seção sobre Bootstrap, mas eu dificilmente recomendaria como primeira opção. Ele se tornou famoso porque veio do Twitter mas é um conjunto de anti-patterns de front-end. Faça-se um favor e fique longe dele. Em vez disso vá direto ou pra algo bem experimental e ainda em evolução como o <a href="https://www.akitaonrails.com/2014/06/29/usando-polymer-com-rails">Polymer Paper</a> ou para soluções mais tradicionais como o Compass Susy e Bourbon Neat que mencionei antes.</p>
<p>Quando entra no assunto de tarefas assíncronas, o Taq começa pelo Delayed Job - imagino porque não precisa instalar nada extra, já que ele usa o banco de dados para as filas. Porém, é mais do que normal usar diretamente <a href="https://sidekiq.org">Sidekiq</a> (ou mesmo Resque, que ele substitui). Usar tabelas de banco como filas é um <a href="https://mikehadlow.blogspot.com.br/2012/04/database-as-queue-anti-pattern.html">anti-pattern</a> e por isso o Delayed já não é mais usado.</p>
<p>Sobre Deploy senti falta de mencionar assuntos de Cloud como o <a href="https://12factor.net/">12 Factors</a> do Heroku, separar a configuração da aplicação em variáveis de ambiente com dotenv-rails. O Taq inclusive fala de Capistrano mas até porque as APIs dele sempre foram meio instáveis, ele resolveu fazer um próprio chamado Traq. Novamente, nada contra, foi o que levou a outros conhecidos como Vlad (não usado mais) ou Mina (ainda usado). Mas para um livro de iniciante eu tentaria manter o Capistrano como o básico porque muitos ainda usam e algo como <a href="https://github.com/ansible/ansible/">Ansible</a> como mais avançado, e mencionaria gigantes como Chef ou Puppet e opções como AWS Opsworks. Faltou também mencionar as opções mais populares hoje como DigitalOcean (por ser tão barato) e soluções como usar <a href="https://www.digitalocean.com/community/tutorials/how-to-use-the-dokku-one-click-digitalocean-image-to-run-a-ruby-on-rails-app">Dokku</a> para ter um Heroku-like na DigitalOcean. Este é um assunto enorme, que daria um livro inteiro separado.</p>
<p>O Taq me explicou que o livro foi compilado a partir de material que ele vem usando em treinamentos faz alguns anos, por isso tem alguns aspectos que pode parecer "antigo". Exemplos disso são o Delayed Job que mencionei acima ou explicar sobre Paperclip para upload de arquivos quando hoje em dia a maioria usa diretamente Carrierwave (ou mesmo Dragonfly). Acredito que ele continue evoluindo o material, então continue acompanhando.</p>
<h2>Além do Livro - Categoria Iniciante</h2>
<p>Como disse antes, vou aproveitar o gancho deste review para adicionar mais material. Em particular veja o que a Casa do Código tem a oferecer, em particular:</p>
<ul>
  <li>
    <p><a href="https://www.casadocodigo.com.br/products/livro-ruby-on-rails">Ruby on Rails</a> - que foi escrito pelo grande <a href="https://twitter.com/vinibaggio">Vini Baggio</a>, hoje trabalhando na Medium.com. Ele tem uma estrutura semelhante ao livro do Taq com uma forma um pouco diferente no seu conteúdo. Acho que ambos se complementam em muitos aspectos para quem está iniciando.</p>
  </li>
  <li>
    <p><a href="https://www.casadocodigo.com.br/products/livro-tdd-ruby">TDD - Teste e Design no mundo real com Ruby</a> - que foi escrito pelo Hugo Corbucci e <a href="https://www.twitter.com/mauricioaniche">Maurício Aniche</a>. O livro do Taq demonstra códigos de testes diversas vezes durante o desenvolvimento do aplicativo mas é importante entender que testar é um "Processo". Uma das formas de implementar esse processo é por Test-Driven Development ou TDD e este livro vai ensinar como aplicar isso na prática, em Ruby.</p>
  </li>
  <li>
    <p><a href="https://www.casadocodigo.com.br/products/livro-cucumber-rspec-tdd-bdd">Cucumber e RSpec</a> - que foi escrito pelo <a href="https://www.twitter.com/hugobarauna">Hugo Baraúna</a>. Como disse antes, primeiro aprenda o básico de testes. Depois disso pule para RSpec para ver a diferença. Cucumber, em particular, não usamos mais tanto, mas os conceitos de Behavior-Driven Development (BDD) ainda são relevantes.</p>
  </li>
  <li>
    <p><a href="https://www.casadocodigo.com.br/products/livro-ruby">Ruby: Aprenda a programar na linguagem mais divertida</a> - escrito pelo <a href="https://www.twitter.com/lucasas">Lucas Souza</a>. Muitos se perguntam se deve aprender Ruby ou Rails primeiro. Eu acho que se você está iniciando deve primeiro aprender o básico de Rails. Isso vai dar a motivação para logo em paralelo começar a explorar a linguagem Ruby em mais detalhes. Esse livro e o próprio <a href="https://eustaquiorangel.com/livro-ruby">Conhecendo Ruby</a> são boas maneiras de começar.</p>
  </li>
</ul>
<p>Estes livros devem ser suficientes para que todos comecem tanto no framework Rails quanto na linguagem Ruby. Mas além disso existem os cursos online como da <a href="https://www.alura.com.br/cursos-online-php-ruby-on-rails">Alura</a> onde eles oferecem 48 horas de curso de Rails que segue em parte o que o livro do Taq apresenta em texto. Depois disso recomendo ir para os cursos online da <a href="https://www.codeschool.com/paths/ruby">Code School</a>, diferente da Alura me parece que o material deles é para quem já iniciou um pouco antes e ir do zero pode ser mais difícil.</p>
<h2>Além do Livro - Categoria "Iniciante para Médio"</h2>
<p>Além da Casa do Código, a editora The Pragmatic Bookshelf tem uma <a href="https://pragprog.com/categories/ruby_and_rails">trilha de livros de Rails</a> muito bons, em particular recomendo:</p>
<ul>
  <li>
    <p><a href="https://ruby.learncodethehardway.org/">Learn Ruby The Hard Way</a> - apesar de toda a controvérsia, é inegável que Zed Shaw é um excelente programador e também um ótimo escritor. Se você quiser escolher um único livro para iniciar em Ruby, eu recomendaria este. Ele é realmente para iniciantes, explica o básico, mas explica de forma sólida. Você pode ler a versão <a href="https://ruby.learncodethehardway.org/book/">HTML online</a> ou esperar a <a href="https://www.amazon.com/Learn-Ruby-Hard-Shaws-Series/dp/032188499X/">versão impressa</a> que ainda não saiu.</p>
  </li>
  <li>
    <p><a href="https://www.amazon.com/Ultimate-Guide-Ruby-Programming-ebook/dp/B0062X2I68/">The Ultimate Guide to Ruby Programming</a> - é um livro muito fácil de entender para iniciantes. E se tem um educador que tem muita experiência ensinando Ruby, ele é realmente Satish Talim, do curso gratuito online <a href="https://rubylearning.org/classes/">RubyLearning.org</a>. Está longe de ser o "ultimate" que declara em seu título. Mas antes de ingressar num curso como da Alura ou Code School, este material já se provou essencial para facilitar o começo do aprendizado. Eu diria que este ou o do Zed Shaw devem ser os primeiros antes de um curso online.</p>
  </li>
  <li>
    <p><a href="https://pragprog.com/book/agcr/confident-ruby">Confident Ruby</a> - do grande Avdi Grimm e Sandi Metz, que publica os screencasts do <a href="https://www.rubytapas.com/">Ruby Tapas</a>. A maioria dos livros ensinando Ruby vai começar no básico, onde o mais diferente é quando se explica Metaprogramação. Mas a linguagem Ruby tem muito mais a oferecer que vai ter deixar muito surpreso e o Avdi destilou muito disso neste livro e nos seus screencasts. Você já precisa saber o básico de Ruby para ler este.</p>
  </li>
  <li>
    <p><a href="https://pragprog.com/book/ager/exceptional-ruby">Exceptional Ruby</a> - de novo, de Avdi Grimm, este livro complementa o anterior explicando um assunto negligenciado pela maioria dos livros de qualquer linguagem: os padrões e boas práticas de como lidar com exceções no seu código. Novamente, Avdi consegue surpreender quem achava que já conhecia a linguagem com coisas que você provavelmente nunca nem ouviu falar.</p>
  </li>
  <li>
    <p><a href="https://www.amazon.com/Eloquent-Ruby-Addison-Wesley-Professional-Series/dp/0321584104/">Eloquent Ruby</a> - de Russ Olsen complementa os anteriores do Avdi Grimm e vai além dos livros básicos que explicam a sintaxe da linguagem Ruby. São livros que eu gosto porque não são apenas para iniciantes: muitos rubistas, que programam há anos, vão encontrar muitas novas técnicas que nem sabiam que existiam.</p>
  </li>
  <li>
    <p><a href="https://www.amazon.com/Practical-Object-Oriented-Design-Ruby-Addison-Wesley-ebook/dp/B0096BYG7C/">Practical Object-Oriented Design in Ruby: An Agile Primer</a> - escrito pela Sandi Metz trás as principais boas práticas de como de fato organizar um código orientado a objetos, de fácil manutenção, em Ruby. Não basta jogar tudo dentro de uma classe e começar a herdar classes, isso não é OOP. Não basta jogar tudo dentro de módulos e fazer composição sem critério, isso não é OOP. Então leia este livro para se adequar ao que conhecemos com reais boas práticas.</p>
  </li>
  <li>
    <p><a href="https://pragprog.com/book/jvrails2/crafting-rails-4-applications">Crafting Rails 4 Applications</a> - por ninguém menos que José Valim, um dos grandes responsáveis pelo sucesso do Rails 3, neste livro explica mais sobre como o Rails funciona por dentro e como tirar proveito disso para criar aplicações modulares, indo de assuntos como template handlers, internacionalização, responders e muito mais. É um livro mais avançado.</p>
  </li>
  <li>
    <p><a href="https://pragprog.com/book/cbdepra/deploying-rails">Deploying Rails</a> - como disse antes, o assunto Deploy daria um livro inteiro. Estava errado: daria mais de um livro. Este do Anthony Burns e Tom Copeland explica muita coisa importante para qualquer um que queira se tornar responsável por uma infraestrutura de produção de verdade, mas ainda não é completo. Eles entram nos assuntos de Vagrant, Puppet, Capistrano, Nagios, Ganglia. Mas ainda precisaria falar de Chef, Ansible, assuntos como load balancing, configuração de subnets, segurança e monitoramento, gerenciamento de logs com ferramentas como GreyLog e muito mais.</p>
  </li>
  <li>
    <p><a href="https://pragprog.com/book/nrtest/rails-test-prescriptions">Rails Test Prescriptions</a> - se tem um assunto que todo rubista já ouviu ad-nauseum é sobre testes. Significa que nós somos dos melhores para elaborar o assunto, sem sombra de dúvidas, e este livro do Noel Rappin trás mais da realidade de testes em muitos projetos Rails, explorando Rspec, Factory Girl, Rcov, e técnicas para garantir que seus testes não fiquem no seu caminho.</p>
  </li>
  <li>
    <p><a href="https://www.amazon.com/Metaprogramming-Ruby-Program-Like-Pros/dp/1941222129/">Metaprogramming Ruby 2: Program Like the Ruby Pros</a> - se tem um assunto que realmente atrai outros programadores ao Ruby é metaprogramação. E mesmo para quem já usa Ruby no seu dia-a-dia, muitos de seus aspectos ainda são obscuros ou desconhecidos. Este livro do Paolo Perrotta deve ajudar a organizar seu conhecimento sobre este assunto que, uma vez entendido, torna-se trivial e parte importante das suas técnicas em projetos.</p>
  </li>
  <li>
    <p><a href="https://www.amazon.com/Ruby-Under-Microscope-Illustrated-Internals/dp/1593275277/">Ruby Under a Microscope: An Illustrated Guide to Ruby Internals</a> - escrito por Pat Shaughnessy e eu diria que é o único livro realmente <strong>avançado</strong> desta lista e fora de qualquer categoria. O Pat foi literalmente bem a fundo, diretamente no código fonte do Ruby MRI e nos destilou um livro fácil de entender sobre como funcionam as menores engrenagens do motor do Ruby. Recomendo muito sua leitura se você já é um programador Ruby.</p>
  </li>
</ul>
<h2>Conclusão</h2>
<p>Muita gente gosta de ler livros técnicos, mas atenha-se a estes princípios:</p>
<ul>
  <li>
    <p>livros demoram para ser escritos, revisados, publicados e distribuídos. Quando você comprar um livro, ele necessariamente estará um pouco defasado com o que você vai encontrar online, especialmente em projetos open source. O livro do Taq, por exemplo, usa Rails 4.0 mas já estamos no Rails 4.1. E isso é normal, só se lembre disso.</p>
  </li>
  <li>
    <p>muitos desses livros tem conteúdo redundante, explicam as mesmas ferramentas mais de uma vez. Ignore a redundância se já conhece bem o assunto, claro, mas às vezes, ler sobre o mesmo assunto sobre a ótica de diferentes autores pode ajudar a dar mais clareza ao seu entendimento.</p>
  </li>
  <li>
    <p>nunca tente ler um livro técnico intermediário ou avançado do começo ao fim, de capa a capa. No caso dos livros para iniciantes talvez isso seja o melhor, mas depois de ler dois ou três dessa forma, use os outros com livros de referência: pegue um capítulo mais à frente, depois volte um capítulo. A maioria não requer leitura numa única direção.</p>
  </li>
  <li>
    <p>sempre acompanhe os autores, siga-os no Twitter, blogs, redes sociais. Seus livros sempre estão em atualização, novos livros podem estar sendo escritos. Livros, principalmente eBooks, são dinâmicos e como software também recebem atualizações que podem te ajudar e corrigir bugs.</p>
  </li>
  <li>
    <p>livros não são caros. O do Taq, a USD 15, é uma verdadeira pechincha. O eBook do livro do José Valim custa USD 24 (aproximadamente R$ 57). Se for comprar todos os livros que mencionei neste artigo, significa um investimento que pode ser mais de R$ 600, se somar com cursos online, facilmente você vai investir R$ 1.000. Entenda: isso é absolutamente barato. Primeiro porque você não vai gastar tudo isso de uma só vez. Segundo porque investir R$ 1,000 em material (mais horas do seu tempo) para amanhã ter compensações que podem ser de R$ 1.500 até mais de R$ 5.000 por mês (se chegar no avançado, com experiência), mais do que compensa esse investimento.</p>
  </li>
</ul>
<p>Falando em investimento, lembre-se: <strong>seu conhecimento é sua responsabilidade</strong>! Nenhuma empresa ou instituição tem obrigações com sua atualização profissional. Se você não tiver interesse, ou achar que os outros é que deveriam investir em você, devo dizer que você está redondamente errado. Seu conhecimento, aprendizado e experiência são as únicas coisas que ninguém jamais pode tirar ou roubar de você. Cuide bem deles!</p>
<p>E além dos livros acima, quais outros vocês que já leram muito recomendam a quem está começando? Deixe suas recomendações e dicas na seção de comentários abaixo.</p>
<p></p>
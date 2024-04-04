---
title: "MOD_RAILS LANÇADO!!"
date: "2008-04-11T18:59:00.000Z"
tags: []
years: "2008"
---

<p></p>
<p></p>
<p>Mais um lançamento <strong>muito</strong> esperado! Um <a href="https://www.modrails.com/">mod_rails</a> que parece que funciona mesmo.</p>
<p>O nome do projeto é Phusion Passenger (alguém andou se inspirando em nomenclatura de Ubuntu). Enfim, o code-nome ‘mod_rails’ deve pegar mais rápido.</p>
<p>Segundo eles prometem, deployment de aplicações simples deve ser tão fácil quanto um mod_php. E pelo visto, assim como o pessoal do Github, eles foram atrás das ‘celebridades’ do mundo Rails: até o Ryan Bates (do famoso RailsCasts) já fez um screencast. Eis o <a href="https://www.modrails.com/videos/phusion_passenger_screencast.mov.torrent">link para o torrent</a> do vídeo.</p>
<p>Estava lendo a documentação e outra coisa que eu gostei: um dos problemas antigos de mod_* é que ele roda sob as mesmas autorizações do processo do Apache (eu sei, eu sei, estou simplificando). De qualquer forma, o mod_rails irá subir sua aplicação como o usuário assinalado no arquivo config/environment.rb de sua aplicação, dessa forma diferentes usuários com diferentes aplicações não poderão ver um ao outro. E em nenhum caso será permitido a uma aplicação Rails subir como <em>root</em>, o que é excelente para quem precisa de um shared hosting.</p>
<p>Eles inclusive tem um produto ‘Enterprise’ que ainda não tem detalhes onde alegam que conseguem diminuir em até 33% o uso de memória da sua aplicação Rails (!) Vamos ver!!</p>
<p></p>
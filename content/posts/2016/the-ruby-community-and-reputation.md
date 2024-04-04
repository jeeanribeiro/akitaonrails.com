---
title: "The Ruby Community and Reputation"
date: "2016-08-19T14:02:00.000Z"
tags: ["rails", "ruby", "ranting"]
years: "2016"
---

<p></p>
<p>I've just read the posts from <a href="http://hawkins.io/2015/05/the-ruby-community-the-next-version/">Adam Hawkins</a> and the support from <a href="http://www.alanbradburne.com/Rubys-reputation">Alan Bradburne</a> over Ruby Weekly.</p>
<p>As a disclaimer, I don't know them, and I respect their points of view, it's not supposed to start a flame war, just to paint an alternative point of view.</p>
<p>Both articles represent the point of view of many veteran Ruby developers in this community. Some of whom already left to other technologies or stopped public appearances.</p>
<p>I already made my stand very clear in the <a href="http://www.akitaonrails.com/2016/05/23/rails-has-won-the-elephant-in-the-room">"Rails has Won: The Elephant in the Room"</a>. But let me simplify here.</p>
<p></p>
<p></p>
<p>There is a clearly a faction being formed. Apart from great developers like Solnic (dry-rb), Nick (Trailblazer), Luca (Hanami), most people are complaining that Rails and some of the most close pieces of the ecosystem around it don't conform to their newly-found vision of what "good" should be.</p>
<p>In their view of the world, a "better" Rails should be way simpler, way more explicit, composed of super small libraries, super explicit external APIs, super composability to take it apart back and forth.</p>
<p>And here lies my problem: if DHH complied and took that direction, that would be "Ruby OFF the Rails". The whole point of "Ruby <strong>ON</strong> Rails" is exactly because it is defined by being a coherent, opinionated full-stack. With coarse grained libraries that are meant to work together in tandem.</p>
<p>Let me present the true Elephant in the Room:</p>
<ul>
  <li>
    <p>Discussions like this are just inflammatory, link baits. They serve no point but create a cloud of animosity against something, without actually presenting an objective good alternative. Writing bullet points are easy, writing complete solutions and maintaining them are not.</p>
  </li>
  <li>
    <p>There are indeed good alternatives popping up already, the aforementioned Trailblazer, Hanami and the dry-rb collection of libraries, just to name a few. Now, the complaint is that they don't have as much traction right now. What's the solution? Bad mouthing Rails? Writing ranting articles of how life is unjust? Or actually writing more tutorials on how to use Trailblazer? Recording screencasts on how to use Hanami? Going to a conference and presenting more talks on how to import dry-rb into your projects?</p>
  </li>
  <li>
    <p>Ruby on Rails was meant for programmers that were tired of super composability, super configuration, super explicit, super fine grained libraries. It was meant for Java programmers coming out straight from the nightmare that was J2EE 1.x in 2004, remember that? Now, the "proposal", is to go back to that? Waste enormous amounts of time fine tuning your tailor-made mini-stack? We have that already, it's called Javascript. And let me tell you: configuring the current breed of <code>package.json</code> brings me back really bad memories from <code>pom.xml</code>, <code>hibernate.cfg.xml</code> to <code>struts-config.xml</code>.</p>
  </li>
  <li>
    <p>Beginners are not interested in fine grained solutions. Most people forget how it was to be a beginner. Actually I'd argue that 80% of the world's developers benefit greatly from a Rails-like approach. It's no coincidence that after it proved its point, many platforms conformed to an opinionated, convention-over-configuration approach.</p>
  </li>
</ul>
<p>The fact that people are complaining against Rails makes it feel like it is Rails fault somehow. Actually not, it's just a reflection of the frustration of the very people that <strong>failed</strong> (and are failing) to pitch the alternatives. Everybody wants the free lunch.</p>
<p>Let me tell you a short story.</p>
<p>Back in 2005 I was the only Rails developer I knew in my country (Brazil). I googled around and found perhaps half a dozen other hobbyists doing Ruby for fun, a couple doing it professionally already.</p>
<p>Everywhere I looked, people would make fun of us because they thought we were just crazy. <em>"Of course J2EE is the way to go." "Of course every project should conform to Eric Evan's DDD approach." "Of course every project should conform to all of the Gang of Four's Design Patterns, the more, the marrier." "Of course we should have very isolated, deployment packages with very explicit API boundaries between them, no matter how it makes the productivity go down."</em></p>
<p>We've been there before. I already had more then 10 years of experience in professional programming back in 2004.</p>
<p>It took me another 10 years of pilgrimage. 9 years organizing my own conference. More than 1,000 blog posts. Almost 200 talks, several of them where I payed from my own pocket, to buy bus tickets, airplane tickets. I put my money where my mouth was.</p>
<p>The promise was replacing all the complexity, all the bureaucracy, for an opinionated stack, where most of the basic decisions were already made, and it would be out of our way so we could focus on the most important part: the business.</p>
<div id="playeroDNgUNqQleSaZy"></div>
<script type="text/javascript">
  jwplayer('playeroDNgUNqQleSaZy').setup({
    file: 'https://s3.amazonaws.com/uploads-akitaonrails/Java_is_not_evil.mp4',
    title: 'Java is not Evil',
    width: '100%',
    aspectratio: '4:3'
  });
</script>
<p>Every single talk I did pitching Rails since 2006 had the above section. And with every single person that ever watched any of my talks as my witnesses, I always said:</p>
<blockquote>
  <p>"Many of you heard that Java is bad because it's so complex and so bureaucratic. And many will try to pitch their alternatives at the expense of Java. Not us. We embrace what Java has to offer. Solr, Elasticsearch, Hadoop, all made with Java, and what will we do? Rewrite everything in Ruby? Of course not. For Rails to Win, Java doesn't have to Lose." (and I put the "evil edition" image on fire, on stage).</p>
</blockquote>
<p>I wrote an article (in pt-BR, sorry) in October of 2007 titled <a href="https://www.akitaonrails.com/2007/10/23/para-eu-ganhar-o-outro-precisa-perder">"For me to win, the other has to lose ..."</a> where I explained why this way of thinking is so lame. And I took inspiration by the famous 1998 Macworld talk by Steve Jobs, where he called in Bill Gates on stage, on the big screen to announce their collaboration. The Apple fans went nuts, they were horrified by that sight, it was like sleeping with Satan.</p>
<p>Almost 20 years later, Apple is one of the most valuable companies in the world. Because it didn't matter. Jobs left pure ideology behind and became a pragmatic. They needed Microsoft's endorsement, they got it, and they proved their points by results: they spent the 90's masturbating over why classic OS 7 to 9 were better than Windows 3.1 up to NT 4. But it took them 10 years to actually prove the worth of OS X over the first decade of the 21st century. One step at a time, one release after the other, frequently delivering instead of spending years closed in the labs until the "perfect" solution arised. Baby steps. It culminated when they were able to squeeze OS X into iOS in 2007.</p>
<p>That's how you prove a point: by sheer pain and sweat, by putting it out there in the streets and pitching it, selling it, creating true value one small release at a time.</p>
<p>And then this happened:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/559/big_mac-school.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/559/mac-school.jpg 2x" alt="Macbooks everywhere"></p>
<p>Remember when Apple took over the world? One entire decade to come back from <a href="https://money.cnn.com/1998/10/14/technology/apple/">bleeding 1 billion a year</a> up until becoming the <a href="https://fortune.com/2016/02/03/apple-facebook-amazon-google/">most valuable company in the world</a>, whose effects are still going on 5 years after Jobs' passing.</p>
<p>Some of us understand that engineers want to masturbate over irrelevant things.</p>
<blockquote>
  <p>"- My algorithm runs 0.1 milliseconds faster that yours".</p>
  <p>"- Ha, but my design has fewer dependency points than yours!"</p>
</blockquote>
<p>Rails did to Ruby what Apple did to Unix and what Canonical kind of did to Linux-based distros. People complaining about Rails reminds me of people trying to argue why Archlinux is way superior to OS X or Ubuntu, but it's just that people in general are stupid not to perceive that value.</p>
<p>And for some, it's not exactly flattering to be in the same league as Apple or Canonical, but the results are undeniable.</p>
<p>Remember what the legendary "15 minute blog" was all about? Why it surprised us so much in 2005? It was not what Rails could do, it was all the work we didn't need to do. And Rails kept true to that until now.</p>
<p>If you're a beginner programmer, Rails still has plenty to teach and you can learn the details later.</p>
<p>If you're the average programmer, Rails' ecosystem will take you from point A to point B much faster, with better productivity and better maintainability.</p>
<p>If you're the tech star programmer, funded by a unicorn, why are you complaining?</p>
<p>Programmers ranting are not following one of our own old favorite quotes: "Premature Optimization is the Root of All Evil". And as the "UNIX way" already had:</p>
<blockquote>
  <p>The strategy is definitely:</p>
  <p>Make it work,</p>
  <p>Then make it right,</p>
  <p>and, finally, make it fast.</p>
</blockquote>
<p>There is nothing wrong in having alternatives to Rails, but the Rails bashing is getting very old, very fast. It's difficult to pitch alternatives, I know, I've spent many show soles in the last 10 years advocating Ruby, so I really know it.</p>
<p>I never believed in free lunch, I believe in targeted, hard work. That's been my last 25 years in programming.</p>
<p></p>
---
title: "Matches, Rankings, The Social Network, League of Legends, and Ruby?"
date: "2016-11-01T12:20:00.000Z"
tags: ["elo", "algorithm"]
years: "2016"
---

<p></p>
<p>There is a segment in a series of talks that I have been presenting in Brazil for the last 3 years or so that I never blogged about. Yesterday I just <a href="http://www.akitaonrails.com/2016/10/31/ruby-on-rails-implementation-of-a-proper-ranking-popularity-system">posted about the proper way to rank content by "popularity"</a> so I thought I should revisit the theme.</p>
<p>To begin, I believe by now most people already watched the movie "The Social Network". It's interesting that I heard many people saying how this movie influenced them to begin their own startups. So I was thinking, "what does this movie actually teach?"</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/567/pasted-image-765.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/567/pasted-image-765.jpg 2x" alt="The Social Network Casting"></p>
<p>Well, from the movie we learn that David Fincher is an fantastic director, that Aaron Sorkin write very sharp dialogue that is very compelling, that Justin Timberlake does a better Sean Parker than the real deal, that Andrew Garfield does an ok Eduardo Saverin, and that Jesse Eisenberg will forever be Mark Zuckerberg.</p>
<p>And that's it, we can't learn anything else from the movie.</p>
<p>Or can we?</p>
<p></p>
<p></p>
<h3>Facemesh</h3>
<p>One of my favorite scenes from the movie is when Zuckerberg/Eisenberg is pissed by the Erica Albright split up and he starts scrapping women photos from the Harvard websites and organizing them into a troll web site called "Facemesh" where he puts them to compete. People can vote on which photo they prefer and it sorts them out in a ranking of popularity.</p>
<p>When Eduardo Saverin/Andrew Garfield shows up, Zuckerberg asks him:</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/BzZRr4KV59I" frameborder="0" allowfullscreen=""></iframe>
<blockquote>
  <p>"Wardo, I need you (...) I need the algorithm used to rank chess players"</p>
</blockquote>
<p>And he goes ahead and write the following in the dorm room window:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/569/pasted-image-759.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/569/pasted-image-759.jpg 2x" alt="Through the Looking Glass"></p>
<p>Here most people would just think:</p>
<blockquote>
  <p>"pff, another gibberish formula just to show off that they are little geniuses, but most certainly this formula doesn't even exist"</p>
</blockquote>
<p>Except it does. And this is the one scene in the movie that stuck up in my head as I saw it before. To help you out, let's reverse the mirrored image:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/568/pasted-image-761.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/568/pasted-image-761.jpg 2x" alt="The Algorithm"></p>
<p>And this is the "algorithm".</p>
<p>As I said in my previous article, most developers would create a Facemesh-like website adding integer fields in the table of contestants with the count of upvotes, downvotes and they would do something silly such as:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">score = upvotes - downvotes<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Or even sillier:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">score = upvotes / (upvotes + downvotes)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And it doesn't work that way, you will get very wrong rankings.</p>
<h3>The Demonstration</h3>
<p>To show you how wrong, I created a simple demonstration project called <a href="https://github.com/akitaonrails/elo_demo">elo_demo</a> which you can git clone and run yourself.</p>
<p>It will create 2,000 random matches against 10 players. This will be the sorted results if we use the wrong methods of subtracting losses from wins and order through that result:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Losses Points (wins - losses)<tt>
</tt> 1 Kong          217   117    100     17<tt>
</tt> 2 Samus         211   110    101      9<tt>
</tt> 3 Wario         197   102     95      7<tt>
</tt> 4 Luigi         186    95     91      4<tt>
</tt> 5 Zelda         160    81     79      2<tt>
</tt> 6 Pikachu       209   105    104      1<tt>
</tt> 7 Yoshi         223   112    111      1<tt>
</tt> 8 Mario         203   101    102     -1<tt>
</tt> 9 Fox           208    95    113    -18<tt>
</tt>10 Bowser        186    82    104    -22<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, let's make the 2nd place Samus win 10 times in a row against the 3rd place Wario, this is the new ranking:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Losses Points<tt>
</tt> 1 Samus         221   120    101     19<tt>
</tt> 2 Kong          217   117    100     17<tt>
</tt> 3 Luigi         186    95     91      4<tt>
</tt> 4 Zelda         160    81     79      2<tt>
</tt> 5 Pikachu       209   105    104      1<tt>
</tt> 6 Yoshi         223   112    111      1<tt>
</tt> 7 Mario         203   101    102     -1<tt>
</tt> 8 Wario         207   102    105     -3<tt>
</tt> 9 Fox           208    95    113    -18<tt>
</tt>10 Bowser        186    82    104    -22<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Sounds fair, Samus jumps to 1st place and Wario goes down to the 8th place.</p>
<p>Now, what if we make the weaker 10th place Bowser win 10 times against the current 2nd place Kong?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Losses Points<tt>
</tt> 1 Samus         221   120    101     19<tt>
</tt> 2 Kong          227   117    110      7<tt>
</tt> 3 Luigi         186    95     91      4<tt>
</tt> 4 Zelda         160    81     79      2<tt>
</tt> 5 Pikachu       209   105    104      1<tt>
</tt> 6 Yoshi         223   112    111      1<tt>
</tt> 7 Mario         203   101    102     -1<tt>
</tt> 8 Wario         207   102    105     -3<tt>
</tt> 9 Bowser        196    92    104    -12<tt>
</tt>10 Fox           208    95    113    -18<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is where you see how <strong>wrong</strong> this method is. Even though he lost 10 times against the weakest player, Kong still reigns supreme at 2nd place. And poor Bowser, in spite of all his hard work and effort, levels up just 1 meager position from 10th to 9th.</p>
<p>This is very frustrating and if it feels unfair, it's because it is. This kind of calculation is <strong>wrong</strong>.</p>
<h3>From Chess to League of Legends</h3>
<p>If you ever played League of Legends you are probably familiar with something called "ELO Boosts".</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/570/Screen_Shot_2016-11-01_at_10.19.42.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/570/Screen_Shot_2016-11-01_at_10.19.42.png 2x" alt="Elo Boost"></p>
<p>This is a way to level up your account for money. I'd strongly recommend against it if you intend to compete professionally as it's against the rules stipulated by Riot.</p>
<p>Anyway, I wonder if you ever wondered why it's called "ELO".</p>
<p>This is for Austro-Hungarian professor <strong>Arpad Emmerich Elo</strong>. He is best known for his system of rating chess players. Quoting from Wikipedia:</p>
<blockquote>
  <p>The original chess rating system was developed in 1950 by Kenneth Harkness (...). By 1960, using the data developed through the Harkness Rating System, Elo developed his own formula which had a <strong>sound statistical basis</strong> and constituted an improvement on the Harkness System. The new rating system was approved and passed at a meeting of the United States Chess Federation in St. Louis in 1960.</p>
  <p>In 1970, FIDE, the World Chess Federation, agreed to adopt the Elo Rating System. From then on until the mid-1980s, Elo himself made the rating calculations. At the time, the computational task was relatively easy because fewer than 2000 players were rated by FIDE.</p>
</blockquote>
<p>His system has been refined and evolved to make tournment leaderbords actually fair and competitive. One such evolution is in the form of Microsoft's <a href="https://www.microsoft.com/en-us/research/project/trueskill-ranking-system/">TrueSkill Ranking System</a> used in all Xbox Live games.</p>
<p>That "algorithm" that Eduardo Saverin writes in the window of Harvard's dorm room? It's the <strong>ELO Rating System</strong>!!</p>
<p>I don't know if Zuckerberg actually implemented the ELO rating system equations. If he did, it was the <strong>correct</strong> choice. But the whole Eduardo writing the equations in the window probably didn't happen that way as it would be way easier to Google for it :-)</p>
<h3>ELO Rating System Demonstration</h3>
<p>My pet demonstration project also calculates that exact ELO score. The calculations are done by the <a href="https://github.com/iain/elo">elo</a> rubygem.</p>
<p>The idea is to calculate the probability that one player has to win over the other player. So if a strong player plays against a weak player, he is expected to win, and if this is the outcome, he will not score a lot and the losing player will not fall a lot either. But if the unexpected happens and the strong one loses than it's expected for him to fall down a lot and for the "weaker" player to jump up a lot.</p>
<p>That will make the tournments more competitive and make the new players more motivated to play against the strongest and also make the strongest play harder to hold their positions.</p>
<p>From the elo gem documentation, this is how you use it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt>12<tt>
</tt>13<tt>
</tt>14<tt>
</tt>15<tt>
</tt>16<tt>
</tt>17<tt>
</tt>18<tt>
</tt>19<tt>
</tt><strong>20</strong><tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kong  = <span style="color:#036;font-weight:bold">Elo</span>::<span style="color:#036;font-weight:bold">Player</span>.new<tt>
</tt>bowser = <span style="color:#036;font-weight:bold">Elo</span>::<span style="color:#036;font-weight:bold">Player</span>.new(<span style="color:#A60">:rating</span> =&gt; <span style="color:#00D;font-weight:bold">1500</span>)<tt>
</tt><tt>
</tt>game1 = kong.wins_from(bowser)<tt>
</tt>game2 = kong.loses_from(bowser)<tt>
</tt>game3 = kong.plays_draw(bowser)<tt>
</tt><tt>
</tt>game4 = kong.versus(bowser)<tt>
</tt>game4.winner = bowser<tt>
</tt><tt>
</tt>game5 = kong.versus(bowser)<tt>
</tt>game5.loser = bowser<tt>
</tt><tt>
</tt>game6 = kong.versus(bowser)<tt>
</tt>game6.draw<tt>
</tt><tt>
</tt>game7 = kong.versus(bowser)<tt>
</tt>game7.result = <span style="color:#00D;font-weight:bold">1</span> <span style="color:#888"># result is in perspective of kong, so kong wins</span><tt>
</tt><tt>
</tt>game8 = kong.versus(bowser, <span style="color:#A60">:result</span> =&gt; <span style="color:#00D;font-weight:bold">0</span>) <span style="color:#888"># bowser wins</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is how you assess the results:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">kong.rating       <span style="color:#888"># =&gt; 1080</span><tt>
</tt>kong.pro?         <span style="color:#888"># =&gt; false</span><tt>
</tt>kong.starter?     <span style="color:#888"># =&gt; true</span><tt>
</tt>kong.games_played <span style="color:#888"># =&gt; 8</span><tt>
</tt>kong.games        <span style="color:#888"># =&gt; [ game1, game2, ... game8 ]</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The gem has more tuning besides that original algorithm, such as the K-factor to reward new players. Those kinds of tunings are what makes matches more competitive today and how you evolve it to TrueSkill levels, but it's beside the point of this article.</p>
<p>Let's see the wrong ranking again:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Losses Points (wins - losses)<tt>
</tt> 1 Kong          217   117    100     17<tt>
</tt> 2 Samus         211   110    101      9<tt>
</tt> 3 Wario         197   102     95      7<tt>
</tt> 4 Luigi         186    95     91      4<tt>
</tt> 5 Zelda         160    81     79      2<tt>
</tt> 6 Pikachu       209   105    104      1<tt>
</tt> 7 Yoshi         223   112    111      1<tt>
</tt> 8 Mario         203   101    102     -1<tt>
</tt> 9 Fox           208    95    113    -18<tt>
</tt>10 Bowser        186    82    104    -22<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now let's see how the <strong>correct</strong> ranking is by calculating the Elo score using the exact same 2,000 matches:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Losses Points  Elo Rating<tt>
</tt> 1 Pikachu       209   105    104      1         851<tt>
</tt> 2 Zelda         160    81     79      2         847<tt>
</tt> 3 Samus         211   110    101      9         842<tt>
</tt> 4 Luigi         186    95     91      4         841<tt>
</tt> 5 Wario         197   102     95      7         824<tt>
</tt> 6 Mario         203   101    102     -1         820<tt>
</tt> 7 Yoshi         223   112    111      1         803<tt>
</tt> 8 Kong          217   117    100     17         802<tt>
</tt> 9 Bowser        186    82    104    -22         785<tt>
</tt>10 Fox           208    95    113    -18         754<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>See how different it is? In the wrong ranking, Kong is considered the strongest, but in the Elo ranking he is just 8th place. And reason is that even though he is the one that won most matches (217) he also lost a heck of a lot (117). Someone with less wins such as Zelda in 2nd place (160 wins) lost a heck of a lot less (81), which is why she is higher in the ranking.</p>
<p>Now, if we make her win 10 matches in a row against 3rd place Samus, this is the new ranking:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Loses  Points  Elo Rating<tt>
</tt> 1 Zelda         170    91     79     12         904<tt>
</tt> 2 Pikachu       209   105    104      1         851<tt>
</tt> 3 Luigi         186    95     91      4         841<tt>
</tt> 4 Wario         197   102     95      7         824<tt>
</tt> 5 Mario         203   101    102     -1         820<tt>
</tt> 6 Yoshi         223   112    111      1         803<tt>
</tt> 7 Kong          217   117    100     17         802<tt>
</tt> 8 Bowser        186    82    104    -22         785<tt>
</tt> 9 Samus         221   110    111     -1         775<tt>
</tt>10 Fox           208    95    113    -18         754<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, Zelda jumps up from 2nd to 1st place and Samus fall down from 3rd to 9th. So far so good. But what about the scenario where we make strong 2nd place Pikachu against a much weaker 10th place Fox McCloud?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt>7<tt>
</tt>8<tt>
</tt>9<tt>
</tt><strong>10</strong><tt>
</tt>11<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">   Name        Games  Wins  Loses  Points  Elo Rating<tt>
</tt> 1 Zelda         170    91     79     12         904<tt>
</tt> 2 Luigi         186    95     91      4         841<tt>
</tt> 3 Fox           218   105    113     -8         829<tt>
</tt> 4 Wario         197   102     95      7         824<tt>
</tt> 5 Mario         203   101    102     -1         820<tt>
</tt> 6 Yoshi         223   112    111      1         803<tt>
</tt> 7 Kong          217   117    100     17         802<tt>
</tt> 8 Bowser        186    82    104    -22         785<tt>
</tt> 9 Samus         221   110    111     -1         775<tt>
</tt>10 Pikachu       219   105    114     -9         766<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, this is fairness: Pikachu should have won, but losing 10 times in a row against someone considered much weaker makes him fall down from 2nd place all the way to the last place. And noobie Fox, having won 10 times against a much stronger opponent deserves jumping up all the way to 3rd place.</p>
<p>This is the kind of dynamic that can make matches and games competitive, which is exactly why every online leaderboard and professional tournment use those kinds of algorithms.</p>
<p>And it all began in chess, using math that is known since the late 40's!!</p>
<blockquote>
  <p>This is the point of this post and my previous one: <strong>the math is not new</strong>.</p>
</blockquote>
<p>Developers waste a great amount of time in stupid pissing contests over which language or tool is "shinier", but they ignore the proper math and deliver wrong results. But the math has been around for decades, in some cases, more than a full century already!</p>
<p>We should strive to earn the title of Computer <em>Scientists</em>. There is a lot of <strong>science</strong> lacking from computing nowadays. Pissing contests do not make a programmer any good.</p>
<p></p>
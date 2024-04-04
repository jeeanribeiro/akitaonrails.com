---
title: "Ruby on Rails implementation of a (proper) Ranking/Popularity system"
date: "2016-10-31T18:51:00.000Z"
tags: ["ranking", "algorithm"]
years: "2016"
---

<p></p>
<p>I was reading a blog post published recently titled <a href="http://naturaily.com/blog/post/ruby-on-rails-implementation-of-a-ranking-system-using-postgresql-window-functions">"Ruby on Rails implementation of a ranking system using PostgreSQL window functions"</a> and to be fair the purpose of the post was to introduce <a href="https://www.postgresql.org/docs/8.4/static/functions-window.html">PostgreSQL's "ntile" window function</a>.</p>
<p>But in the process, the author made the same mistake I've seen time and time again.</p>
<p>Let's assume you have a project with resources that you want to list by "popularity". It can be a Reddit-like site where people like or dislike posts or comments. It can be an e-commerce where people like or dislike products.</p>
<p>It can be anything where people like or dislike something.</p>
<p>The biggest error people make is to consider a simple score like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">popularity = positive_votes - negative_votes<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>There is an old article titled <a href="https://www.evanmiller.org/how-not-to-sort-by-average-rating.html">"How Not To Sort By Average Rating"</a> and I quote:</p>
<blockquote>
  <p>"<em>Why it is wrong:</em> Suppose one item has 600 positive ratings and 400 negative ratings: 60% positive. Suppose item two has 5,500 positive ratings and 4,500 negative ratings: 55% positive. This algorithm puts item two (score = 1000, but only 55% positive) above item one (score = 200, and 60% positive). WRONG."</p>
</blockquote>
<p>Then you may think, I know how to fix it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Score</span> = average_rating = positive_votes / total_votes<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, this is wrong, and again I quote:</p>
<blockquote>
  <p>"<em>Why it is wrong:</em> Average rating works fine if you always have a ton of ratings, but suppose item 1 has 2 positive ratings and 0 negative ratings. Suppose item 2 has 100 positive ratings and 1 negative rating. This algorithm puts item two (tons of positive ratings) below item one (very few positive ratings). WRONG."</p>
</blockquote>
<h3>Correct Solution: Lower Bound of Wilson Score Confidence Interval for a Bernoulli</h3>
<p>And I quote again:</p>
<blockquote>
  <p>"<em>Say what:</em> We need to balance the proportion of positive ratings with the uncertainty of a small number of observations. Fortunately, the math for this was worked out in 1927 by Edwin B. Wilson. What we want to ask is: Given the ratings I have, there is a 95% chance that the "real" fraction of positive ratings is at least what? Wilson gives the answer. Considering only positive and negative ratings (i.e. not a 5-star scale), the lower bound on the proportion of positive ratings is given by:"</p>
</blockquote>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/565/rating-equation.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/565/rating-equation.png 2x" alt="Lower Bound Bernoulli equation"></p>
<p>I recommend you read the <a href="https://www.evanmiller.org/how-not-to-sort-by-average-rating.html">original article</a> but let's cut to the chase. If we follow the original post I linked in the beginning, I have a simple blog post Rails app, but instead of a <code>visits_count</code> field I need to add a <code>positive:integer</code> and <code>negative:integer</code> fields and user interface to post votes.</p>
<p>And I will replace the <code>PostWithPopularityQuery</code> class with the following:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PostWithPopularityQuery</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">call</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Post</span>.find_by_sql [<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">SELECT id, title, body, positive, negative,<tt>
</tt>        ((positive + 1.9208) / (positive + negative) -<tt>
</tt>        1.96 * SQRT((positive * negative) / (positive + negative) + 0.9604) /<tt>
</tt>        (positive + negative)) / (1 + 3.8416 / (positive + negative))<tt>
</tt>        AS ci_lower_bound<tt>
</tt>      FROM posts <tt>
</tt>      WHERE positive + negative &gt; 0<tt>
</tt>      ORDER BY ci_lower_bound DESC</span><span style="color:#710">'</span></span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is what I expect to see in a simple scaffold <code>index.html.erb</code>:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/564/Screen_Shot_2016-10-31_at_16.43.50.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/564/Screen_Shot_2016-10-31_at_16.43.50.png 2x" alt="Post index page"></p>
<p>I would even go as far as recommending the <code>ci_lower_bound</code> to be a float field in the table and to have an asynchronous ActiveJob to update it in some larger interval of time (every 5 minutes, for example) and then the <code>PostsController#index</code> action would perform a straight forward <code>SELECT</code> query ordering directly against a real indexed field <code>ci_lower_bound DESC</code> without performing the calculations on <strong>every</strong> query.</p>
<p>Now <strong>THIS</strong> is the correct way to implement a simple, naive popularity ranking system that actually works correctly.</p>
<p>And this is not the only way to do it. There are dozens of good discussions of algorithms online. Every service that depends on content popularity have been refining algorithms like this for years. Facebook used to have an algorithm called "EdgeRank" which relied on variables such as Affinity, Weight, Time Decay, and it seems to have evolved so much that it now calculates popularity against more than <a href="https://marketingland.com/edgerank-is-dead-facebooks-news-feed-algorithm-now-has-close-to-100k-weight-factors-55908">100 thousand variables</a>!!</p>
<p>But regardless of the online service, I can assure you that <strong>none</strong> sorts by simple visits count or simple average votes count. That would downright wrong.</p>
<p></p>
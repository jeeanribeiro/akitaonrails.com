---
title: "[Off-Topic] Learning Statistics"
date: "2016-11-01T19:03:00.000Z"
tags: ["statistics", "r", "carreira"]
years: "2016"
---

<p></p>
<p>I always talk bits and pieces about statistics and as a heavy <a href="http://www.akitaonrails.com/science">skeptic myself</a>, I believe I can think beyond the "common sense" that most people rely on. I'm very familiar with biases, skewed data, wrong questions leading to wrong answers.</p>
<p>I can probably pinpoint why a certain argument is wrong. But I am very incompetent the other way around: given a proper data collection, how to do proper exploratory data analysis? What are the correct methodologies for any given scenario? And of course, all the math involved.</p>
<p>For example, I just posted 2 articles to try to shed some light on exactly that: most developers "common sense" on dealing with data is to do primitive aggregations such sums, averages. Start talking about "standard deviation" and you lost half of the developer’s population. Start talking about binomial or poisson distributions and you lost the remaining half. Now get into linear regression, bayesian statistics and almost everybody left the room already.</p>
<p>We live in 21st century. At <a href="http://www.smartinsights.com/internet-marketing-statistics/happens-online-60-seconds/">every 60 seconds</a> and Facebook receives an extra 3.3 million new posts; YouTube receives 400 hours of videos; Instagram receives 55,555 uploaded photos; WhatsApp exchanges 44.4 million messages; even e-mail, more than 206 millions of them are being sent. By the time you finish reading this post, you can multiply that amount by 5 to 10!</p>
<blockquote>
  <p>“We are drowning in information,</p>
  <p>but we are starved for knowledge”</p>
  <p>– Various authors, original probably John Naisbitt</p>
</blockquote>
<p>I will spend a few weeks diving into <a href="https://www.r-project.org/">R</a>. Yes, many people will talk about Julia, but we can't deny the amazing body of knowledge, the experience, and the robust and extensive set of packages available for R, including learning material. There's a great tool <a href="https://blog.rstudio.org/2016/11/01/announcing-rstudio-v1-0/">RStudio</a> which just saw it's 1.0 release.</p>
<p>And within the many materials I gathered, one stood out just for its introduction (I am still to review the book as whole). It's called <a href="http://health.adelaide.edu.au/psychology/ccs/teaching/lsr/">"Learning Statistics with R"</a>, by Daniel Navarro from the University of Adelaide, Australia. I find it interesting because it's a psychology professor teaching proper statistics through the basics of R, which is exactly what I wanted. You can purchase a hardcopy or download the free PDF.</p>
<p>I like the introduction so much that I wanted to share a few paragraphs to motivate you to join me in learning better statistics. So let's dive right into it:</p>
<p></p>
<p></p>
<h3>The cautionary tale of Simpson’s paradox</h3>
<p>The following is a true story. In 1973, the University of California, Berkeley got into some trouble over its admissions of students into postgraduate courses. Specifically, the thing that caused the problem was that the gender breakdown of their admissions looked like this ...</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">         Number of applicants     Percent admitted<tt>
</tt>Males           8442                    44%<tt>
</tt>Females         4321                    35%<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>... and they <strong>got sued</strong>. Given that there were nearly 13,000 applicants, a difference of 9% in admission rates between males and females is just way too big to be a coincidence. Pretty compelling data, right? And if I were to say to you that these data actually reflect a weak bias in favor of females, you’d probably think that I was either crazy or sexist.</p>
<p>Oddly, it’s actually sort of true ... after Berkeley got sued, people started looking very carefully at the admissions data (Bickel, Hammel, &amp; O’Connell, 1975). And remarkably, when they looked at it on a department by department basis, it turned out that most of the departments actually had a slightly higher success rate for female applicants than for male applicants. The table below shows the admission figures for the six largest departments (with the names of the departments removed for privacy reasons):</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">                      Males                          Females<tt>
</tt>Department   Applicants   Percent admitted   Applicants   Percent admitted<tt>
</tt>A                825             62%            108              82%<tt>
</tt>B                560             63%             25              68%<tt>
</tt>C                325             37%            593              34%<tt>
</tt>D                417             33%            375              35%<tt>
</tt>E                191             28%            393              24%<tt>
</tt>F                272              6%            341               7%<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remarkably, most departments had a <em>higher</em> rate of admissions for females than for males! Yet the overall rate of admission across the university for females was <em>lower</em> than for males. How can this be? How can both of these statements be true at the same time?</p>
<p>Here’s what’s going on. Firstly, notice that the departments are not equal to one another in terms of their admission percentages: some departments (e.g., engineering, chemistry) tended to admit a high percentage of the qualified applicants, whereas others (e.g., English) tended to reject most of the candidates, even if they were high quality.</p>
<p>So, among the six departments shown above, notice that department A is the most generous, followed by B, C, D, E and F in that order. Next, notice that males and females tended to apply to different departments. If we rank the departments in terms of the total number of male applicants, we get <strong>A</strong> &gt; <strong>B</strong> &gt; D &gt; C &gt; F &gt; E (the “easy” departments are in bold).</p>
<p>On the whole, males tended to apply to the departments that had high admission rates. Now compare this to how the female applicants distributed themselves. Ranking the departments in terms of the total number of female applicants produces a quite different ordering C &gt; E &gt; D &gt; F &gt; <strong>A &gt; </strong>B.</p>
<p>In other words, what these data seem to be suggesting is that the female applicants tended to apply to “harder” departments.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/571/Screen_Shot_2016-11-01_at_16.58.47.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/571/Screen_Shot_2016-11-01_at_16.58.47.png 2x" alt="Figure 1"></p>
<p>And in fact, if we look at all Figure 1.1 we see that this trend is systematic, and quite striking. This effect is known as <strong>Simpson’s paradox</strong>. It’s not common, but it does happen in real life, and most people are very surprised by it when they first encounter it, and many people refuse to even believe that it’s real. It is very real. And while there are lots of very subtle statistical lessons buried in there, I want to use it to make a much more important point . . . doing research is hard, and there are lots of subtle, counterintuitive traps lying in wait for the unwary. That’s reason #2 why scientists love statistics, and why we teach research methods. Because science is hard, and the truth is sometimes cunningly hidden in the nooks and crannies of complicated data.</p>
<p>Before leaving this topic entirely, I want to point out something else really critical that is often overlooked in a research methods class. Statistics only solves part of the problem. Remember that we started all this with the concern that Berkeley’s admissions processes might be unfairly biased against female applicants. When we looked at the “aggregated” data, it did seem like the university was discriminating against women, but when we “disaggregate” and looked at the individual behavior of all the departments, it turned out that the actual departments were, if anything, slightly biased in favor of women.</p>
<p>The gender bias in total admissions was caused by the fact that women tended to self-select for harder departments. From a purely legal perspective, that puts the university in the clear. Postgraduate admissions are determined at the level of the individual department (and there are very good reasons to do that), and at the level of individual departments, the decisions are more or less unbiased (the weak bias in favor of females at that level is small, and not consistent across departments). Since the university can’t dictate which departments people choose to apply to, and the decision making takes place at the level of the department it can hardly be held accountable for any biases that those choices produce.</p>
<p>That was the basis for my somewhat glib remarks earlier, but that’s not exactly the whole story, is it? After all, if we’re interested in this from a more sociological and psychological perspective, we might want to ask why there are such strong gender differences in applications. Why do males tend to apply to engineering more often than females, and why is this reversed for the English department? And why is it the case that the departments that tend to have a female-application bias tend to have lower overall admission rates than those departments that have a male-application bias? Might this not still reflect a gender bias, even though every single department is itself unbiased? It might.</p>
<p>Suppose, hypothetically, that males preferred to apply to “hard sciences” and females prefer “humanities”. And suppose further that the reason for why the humanities departments have low admission rates is because the government doesn’t want to fund the humanities (Ph.D. places, for instance, are often tied to government funded research projects). Does that constitute a gender bias? Or just an unenlightened view of the value of the humanities? What if someone at a high level in the government cut the humanities funds because they felt that the humanities are “useless chick stuff”. That seems pretty blatantly gender biased. None of this falls within the purview of statistics, but it matters to the research project.</p>
<p>If you’re interested in the overall structural effects of subtle gender biases, then you probably want to look at both the aggregated and disaggregated data. If you’re interested in the decision making process at Berkeley itself then you’re probably only interested in the disaggregated data.</p>
<p>In short there are a lot of critical questions that you can’t answer with statistics, but the answers to those questions will have a huge impact on how you analyze and interpret data. And this is the reason why you should always think of statistics as a tool to help you learn about your data, no more and no less. It’s a powerful tool to that end, but there’s no substitute for careful thought.</p>
<h3>Download the Book</h3>
<p>Did you get intrigued? So <a href="https://health.adelaide.edu.au/psychology/ccs/teaching/lsr/">download the book</a> and let's study some statistics beyond the mere basics. I am not saying this is the best book, just one that seems interesting, and if you happen to know a good book teaching statistics for novices through the use of R without any prior knowledge, let me know in the comments section below.</p>
<p></p>
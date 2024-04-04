---
title: "Moving away from Pivotal Tracker to Fulcrum. Good Enough."
date: "2016-08-10T21:30:00.000Z"
tags: ["pivotaltracker", "fulcrum", "projects"]
years: "2016"
---

<p></p>
<p>I've been blogging about how I am building my own internal infrastructure. Already reported on how I moved from <a href="http://www.akitaonrails.com/2016/08/03/moving-to-gitlab-yes-it-s-worth-it">GitHub and Travis to GitLab</a>, then how we moved from <a href="http://www.akitaonrails.com/2016/08/09/moving-away-from-slack-into-rocket-chat-good-enough">Slack to Rocket.chat</a>, but the original first move is the subject of this article.</p>
<p>I've been using Pivotal Tracker since 2010 up to 2015 and this is because I believe it is far superior than Trello and other <a href="http://www.akitaonrails.com/2009/12/16/off-topic-cuidado-com-o-kanban-butt">glorified to-do lists</a> out there.</p>
<p><a href="https://github.com/Codeminer42/cm42-central"><img src="https://raw.githubusercontent.com/Codeminer42/cm42-central/master/doc/cm42-central-screenshot.png" srcset="https://raw.githubusercontent.com/Codeminer42/cm42-central/master/doc/cm42-central-screenshot.png 2x" alt="Cm42-Central"></a></p>
<p></p>
<p></p>
<h3>The Cost Conundrum</h3>
<p>As with all the other reports, let me start with the cost argument. Pivotal Tracker is <a href="https://www.pivotaltracker.com/why-tracker/pricing/">priced</a> based on amount of users.</p>
<p>If you have a small team and not many outside clients, a basic 10 users plan would be enough, and you will pay just USD 420 a year. Just pay it already.</p>
<p>If you have up to 25 users, it's stil not so expensive, and you will pay USD 1,800 a year. Well worth it.</p>
<p>Even if you have 50, the maximum plan, you will pay USD 3,600 a year. More than that and you have to contact them directly.</p>
<p>The cost is not prohibitive and if you can pay, I advise you to do so.</p>
<p>In my case, the strategy is to get full control over our data and knowledge, which is why I'd rather have ownership of the service.</p>
<p>And because Fulcrum was "almost" good enough, I decided to try it out and see if we could evolve it over time. And I think that even though we are still very far from the full-featured Tracker, what we have is enough for most of our projects.</p>
<p>Let me say it again: you most probably won't benefit if you're a small team. Pivotal Tracker is, to this day, the best project management tool for software development teams, and you should definitely try it out first, get used to it's workflow (as I will explain below), and then decide if you want to take control and install the open source alternative instead.</p>
<p>There is the factor of cost, but it's not the driving incentive for this move.</p>
<h3>The Important Features</h3>
<p>Doing some research I found the Fulcrum project. It's a very simple, very bare-bone Rails project that mimics Tracker's most important features.</p>
<p>Any competent project management tool <strong>must</strong> have at the very least 4 pillars:</p>
<ul>
  <li>Stories (with discussion threads, assets uploading, tags, Epics organization, and searchability)</li>
  <li>Proper numeric estimation (story points, proportional size for stories)</li>
  <li>Time-boxed Sprints (short, fixed periods of time)</li>
  <li>Velocity (the actual productivity of a particular team in a particular project)</li>
</ul>
<p>Any tool that has all of the above are useful</p>
<p>Fulcrum itself has almost everything. We made an internal fork of the project and we started adding some of the missing features. We've been using it for around 1 year already and it's been good enough for our routine. There are still a few bugs and missing features that we intend to add.</p>
<p>If you're interested, I am making this fork <a href="https://github.com/Codeminer42/cm42-central">publicly available</a> to conform to the Aphero GPL license.</p>
<p>Any contribution is welcome.</p>
<h3>On Proper Agile Management</h3>
<p>Now sidetraking a bit, I'd like to explain why this kind of tool (Tracker-like) is the best compared to what I called "glorified to-do lists".</p>
<p>The principles are very simple:</p>
<ul>
  <li>Every project must start with the most complete backlog possible (uncertainty is at its highest in the beginning, and details will be missing, but it's important to have a vision of what "minimally complete" means and the order of importance of each story, a proper "priority").
    <ul>
      <li>It doesn't matter the level of details. A story must have enough information that any developer in the team can implement the required tasks. Otherwise it must be tagged "blocked" so the Product Owner knows that (s)he has to add more details and no developer will touch it until the tag is removed.</li>
    </ul>
  </li>
  <li>All stories <strong>must be estimated</strong> (more on that on the next section). It really doesn't matter the unit. You can think in hours, in fractions of a day or for what it really is: a proportion. A story sized "2" should be roughly half the complexity of a Story sized "4". That's it. Even "blocked" stories should receive sizes.</li>
  <li>Projects must be divided in time-boxed, fixed-sized Sprints, so the team has the opportunity to reassess frequently. This is where estimation can be refined, where more levels of detail in the stories should be required.</li>
  <li>Bugs can't have any numeric estimation. They will serve to slow down the team's velocity and its an indication of poorly made deliveries.</li>
  <li>Velocity is the actual amount of story points delivered by the end of a Sprint.
    <ul>
      <li>The total amount of story points of all stories in the project backlog divided by the team's velocity will give a roughly estimated "End Date". This is important, because this is how you know when certain groups of features will be delivered over time, and this is what the Product Owner needs to know to prioritize stories, simplify stories or even cut down unnecessary features.</li>
      <li>The Product Owner sole responsability is to be accountable for the Return on Investment of the implemented features. And the only way to measure cost-benefit is to know "how much" a feature will "cost" in terms of story points divided by velocity.</li>
    </ul>
  </li>
</ul>
<p>What the tool will expose:</p>
<ul>
  <li>If a backlog has a lot of "blocked" stories or if it has many stories delivered without acceptance, it's a symptom of a Product Owner not doing the work.</li>
  <li>If the velocity varies too much between sprints, it's a symptom of either poorly written stories (and therefore developers having a hard time understanding what to do), or developers not concentrating in their work and delivering inconsistent results.</li>
  <li>Inconsistent velocities with many bugs in each sprint is the symptom of developers not doing code with proper quality (automated tests to avoid regressions for example).</li>
  <li>A "bug" is not the same thing as the Product Owner changing (s)he's mind on a story and rejecting. The team must not implement undocumented changes. Acceptance is tied to what the story says. The Product Owner must change his mind before the story is implemented or create a new story to add the change (and therefore add more cost to the project, there is no free lunch).</li>
  <li>Stories in the "Chilly Bean" (in Fulcrum, or "Ice Box" in Tracker) are "wish-lists" and they will never be implemented until the Product Owner moves the story to the backlog.</li>
  <li>Velocity should be roughly the same between sprints. Peaks or valleys in the velocity are symptoms of a problem that needs to be addressed by the next sprint. This is how a project evolve for the better over time.</li>
</ul>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/557/big_Cm-Fulcrum_-_CM42_Central.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/557/Cm-Fulcrum_-_CM42_Central.png 2x" alt="Velocity"></p>
<h3>On Estimation</h3>
<p>Many people worry too much about "proper estimation" to the point of creating so much tension that developers start screaming about <a href="https://www.akitaonrails.com/2013/10/07/off-topic-noestimates-debunked">"no estimates"</a>. This is nuts. This is why "estimation" is a different word than "prediction", one is uncertain, a ballpark, the other is exact.</p>
<blockquote>
  <p>There is no such thing as a "correct" estimation.</p>
</blockquote>
<p>I would argue that in many projects if the stories are minimally described (meaning that a developer is able to implement what is written), we could estimate all of them to be size "1" and forget about it.</p>
<p>We run 2 or 3 sprints (usually one sprint should be one work-week - 5 days of at most 8 hours, no more, no less) and measure how many stories were delivered. And this is the velocity.</p>
<p>Now we can see how many stories we have until the end of the project and divide by this velocity. And this is how many weeks it will take to finish the project.</p>
<blockquote>
  <p>There is no need for consensus based estimation.</p>
</blockquote>
<p>Consensus on estimation is usually a waste of time. Estimation is merely the realization that it's difficult to write down every story to be the exact same size, so we add proportions to them (A story size 2 is half the size of a story size 4).</p>
<p>But if a project is 3 months or larger, the less the proportions will matter (unless you do the anti-practice of having heavily disproportionate stories, some size 1 and many sized 5, 8 or even 10, for example). But if you stay closer to less than size 5 for every story, then the larger the project, the less the individual estimates matter. Velocity will average out the differences over time.</p>
<p>Then the task of the Project Manager, Product Owner, the team in general, is to keep an eye on the total amount of points divided by this velocity, which derives the estimated end date of the project. And everybody can negotiate, beforehand, which stories can be done, which cannot, and change priorities, remove stories or simplify stories.</p>
<blockquote>
  <p>Don't waste time trying to create formulas to derive estimation consensus.</p>
</blockquote>
<p>If you manage the Velocity then you can manage the entire project. This is the core of all proper Agile methodologies. Everything else is an accessory to that end.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/556/big_Heroleads_-_CM42_Central.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/556/Heroleads_-_CM42_Central.png 2x" alt="Velocity"></p>
<p>Trying to artificially increase velocity is one of the many sins. You can't. It's better to invest time in adding more details to a story, or to simplify a story or to decide that some stories are just not needed to deliver a proper product in the end.</p>
<p>Monte Carlo simulations, Six Sigma techniques, Kanban concepts, none of them matter. All traditional industry techniques are meant for production lines in factories, where the time of each task is well defined and you manage the variance, the exception. It's Gaussian, Normal world.</p>
<p>In software projects, or any craft and research, you manage expectations on results based on milestones and cutting excesses and uncertainties. It's a Paretto world, one where there is no such thing as an "average", there is no medium, no variance.</p>
<p>In a <strong>Paretto</strong> world everything is interconnected, not statistically independent (a requirement for Gaussians). It's therefore 80/20: where 20% of the project will yield 80% of the results, where 20% of the scope can be cut down.</p>
<p>Anything that is not <strong>"statistically independent"</strong> (like tossing a coin) can't be averaged out, can't fit in a Normal distribution. It's most possibly a Paretto, Power Law, Zipf, Exponential, or even a Poisson, not a Gaussian. Software parts are all intertwined in a network, they are not independent events, they can't be randomly rearranged, they are not easily interchangeable.</p>
<h2>Conclusion</h2>
<p>This article is very short and I can expand each bullet point above into its own, very long, article. Let me know in the comments section if I should, and which points raise more questions.</p>
<p>I've been refining those techniques for the <a href="https://www.akitaonrails.com/agile">past 10 years</a>, and at least 5 within the constraints of a tool such as Tracker. And I believe I was able to come up with the minimal set of principles that lead to proper management, not superstition, fantasy or delusion you see everywhere nowadays.</p>
<p>Projects suffer when the recommendations above are not followed:</p>
<ul>
  <li>Product Owners don't perform their responsabilities: they fail to add details to stories, they neglect delivered features and don't test them properly, they don't participate.</li>
  <li>Backlogs are incomplete, lacking detail, lacking estimation, lacking prioritization.</li>
  <li>Developers don't properly start and finish their tasks with proper code quality.</li>
  <li>Time is wasted in bikeshedding instead of delivery.</li>
</ul>
<p>Our fork of Fulcrum, called <a href="https://github.com/Codeminer42/cm42-central">"Central"</a>, is not perfect by any means, but it works well enough and gives us enough control to keep adding features that make our routine more comfortable, and we are just getting started.</p>
<p>I hope this technique and tool is valuable to more teams and I'd love to hear feedback from anyone.</p>
<p></p>
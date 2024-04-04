---
title: "Hacking Mattermost Team Edition"
date: "2016-08-12T17:43:00.000Z"
tags: ["postgresql", "rocket.chat", "slack"]
years: "2016"
---

<p></p>
<p>In <a href="http://www.akitaonrails.com/2016/08/09/moving-away-from-slack-into-rocket-chat-good-enough">my previous post</a> I was reporting on my move from Slack to Rocket.chat. But I also mentioned that before Rocket.chat I would rather use Mattermost. First and foremost because it's written in Go (lightweight, highly concurrent, super stable), and because the code base shows much more quality than Rocket.chat (which feels super fragile, with almost no automated tests at all).</p>
<p>But my major complaint with MatterMost is because the free, open source, Team Edition, lacks a super important feature: not allowing users to delete private groups.</p>
<p></p>
<p></p>
<p><a href="https://www.akitaonrails.com/2016/08/09/moving-away-from-slack-into-rocket-chat-good-enough#comment-2832915684">@iantien commented</a> that the private groups are never actually "deleted", they are just marked as deleted, audited, but all data is still in the database. Just the UI has no way to hide the "delete" option from users and there is no Administration UI to unarchive the delete groups.</p>
<p>In fact, you can open a <code>psql</code> session in your PostgreSQL database and just do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">update channels set deleteat = 0;<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This will unarchive and restore all delete channels. But you can see how this is a hassle.</p>
<p>I strongly disagree when he says that only "10,000 users enterprises" would need such a feature. Even in a small team, any grumpy user can just archive a channel out of the blue and disrupt the entire team communication in private groups. Sure, the "Town Square" and other public channels will still function, but if you have just one external user participating in projects, for example, you want to use private groups to isolate your internal communication from external users.</p>
<p>So, not having the option for very basic permissions (such as disallowing members to delete channels or private groups) is a very big show stopper even for small teams. And sure, the USD 20/user/year fee is not expensive, but as Mattermost still has less features than Rocket.chat, it becomes a very hard to sell proposition.</p>
<p>Also, hacking the code itself and adding a flag to disallow this option, in Go, is actually quite easy, but you would have to maintain your own fork (as I think Mattermost would not accept a pull request from a feature that already is in their payed, Enterprise offering)</p>
<p>But after @iantien commented that nothing is deleted and it's all audited, I quickly realized that I could use the audit metadata and devise a way to automatically restore the channels (unless it's the system admin doing it). All without altering the source code.</p>
<p>One can use the many tools available in PostgreSQL itself, namely: <strong>TRIGGERS</strong>. So, without further ado, just run this in your Mattermost database:</p>
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
</tt>21<tt>
</tt>22<tt>
</tt>23<tt>
</tt>24<tt>
</tt>25<tt>
</tt>26<tt>
</tt>27<tt>
</tt>28<tt>
</tt>29<tt>
</tt><strong>30</strong><tt>
</tt>31<tt>
</tt>32<tt>
</tt>33<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">CREATE</span> <span style="color:#080;font-weight:bold">OR</span> <span style="color:#080;font-weight:bold">REPLACE</span> FUNCTION undelete_channel() RETURNS <span style="color:#080;font-weight:bold">trigger</span> <span style="color:#080;font-weight:bold">AS</span> <span style="color:#F00;background-color:#FAA">$</span><span style="color:#F00;background-color:#FAA">$</span><tt>
</tt>    DECLARE<tt>
</tt>        user_counter <span style="color:#074;font-weight:bold">integer</span>;<tt>
</tt>        channel_id character varying(<span style="color:#00D;font-weight:bold">26</span>);<tt>
</tt>    <span style="color:#080;font-weight:bold">BEGIN</span><tt>
</tt>        <span style="color:#888">-- Only for channel delete operations</span><tt>
</tt>        <span style="color:#080;font-weight:bold">IF</span> NEW.action <span style="color:#080;font-weight:bold">NOT</span> <span style="color:#080;font-weight:bold">LIKE</span> <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">%/channels/%/delete</span><span style="color:#710">'</span></span> <span style="color:#080;font-weight:bold">THEN</span><tt>
</tt>            RETURN NEW;<tt>
</tt>        <span style="color:#080;font-weight:bold">END</span> <span style="color:#080;font-weight:bold">IF</span>;<tt>
</tt><tt>
</tt>        <span style="color:#888">-- Check if it is the system_admin</span><tt>
</tt>        <span style="color:#080;font-weight:bold">SELECT</span> <span style="color:#369;font-weight:bold">count</span>(*) <span style="color:#080;font-weight:bold">INTO</span> user_counter<tt>
</tt>        <span style="color:#080;font-weight:bold">FROM</span> users<tt>
</tt>        <span style="color:#080;font-weight:bold">WHERE</span> id = NEW.userid<tt>
</tt>        <span style="color:#080;font-weight:bold">AND</span> roles = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">system_admin</span><span style="color:#710">'</span></span>;<tt>
</tt><tt>
</tt>        <span style="color:#080;font-weight:bold">IF</span> user_counter &gt; <span style="color:#00D;font-weight:bold">0</span> <span style="color:#080;font-weight:bold">THEN</span><tt>
</tt>            RETURN NEW;<tt>
</tt>        <span style="color:#080;font-weight:bold">END</span> <span style="color:#080;font-weight:bold">IF</span>;<tt>
</tt><tt>
</tt>        channel_id = split_part(NEW.action, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">'</span><span style="">/</span><span style="color:#710">'</span></span>, <span style="color:#00D;font-weight:bold">7</span>);<tt>
</tt><tt>
</tt>        <span style="color:#080;font-weight:bold">UPDATE</span> channels<tt>
</tt>        <span style="color:#080;font-weight:bold">SET</span> deleteat = <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>        <span style="color:#080;font-weight:bold">WHERE</span> id = channel_id;<tt>
</tt><tt>
</tt>        RETURN NEW;<tt>
</tt>    <span style="color:#080;font-weight:bold">END</span>;<tt>
</tt><span style="color:#F00;background-color:#FAA">$</span><span style="color:#F00;background-color:#FAA">$</span> LANGUAGE plpgsql;<tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">DROP</span> <span style="color:#080;font-weight:bold">TRIGGER</span> <span style="color:#080;font-weight:bold">IF</span> <span style="color:#080;font-weight:bold">EXISTS</span> undelete_channel <span style="color:#080;font-weight:bold">ON</span> audits;<tt>
</tt><span style="color:#080;font-weight:bold">CREATE</span> <span style="color:#080;font-weight:bold">TRIGGER</span> undelete_channel AFTER <span style="color:#080;font-weight:bold">INSERT</span> <span style="color:#080;font-weight:bold">ON</span> audits<tt>
</tt>    FOR EACH ROW EXECUTE PROCEDURE undelete_channel();<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That's it, it will listen to audits new inserts, check if it is a "channel delete" action, check if it is not a 'system_admin', and if so it will automatically grab the channel id from the action REST URL and do the proper UPDATE to get it back.</p>
<p>I tested it already and in my UI users don't even realize something happened. Not even the offending user sees the channel go away, it instantly comes back.</p>
<p>So, if this was the only thing stopping you to use the free-of-charge, on-premise Team Edition, there you go. And with this you can derive functions to also avoid renaming channels, but I will leave it as an exercise for you (please share in the comments section below if you do it).</p>
<p>Happy Hacking!</p>
<p></p>
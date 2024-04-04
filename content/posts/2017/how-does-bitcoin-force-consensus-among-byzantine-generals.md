---
title: "How does Bitcoin force consensus among Byzantine generals?"
date: "2017-11-01T16:02:00.000Z"
tags: ["blockchain", "cryptocurrency", "bitcoin"]
years: "2017"
---

<p></p>
<p><em>"Is it possible to break the blockchain?"</em></p>
<p>Now, this is a fair question. If you know anything about the blockchain architecture, you instinctively conclude that "no", it's quite improbable that anyone will break it. In practice, it's basically impossible.</p>
<p>It's quite amazing that most of my peer programmers have a very difficult time overcoming the prejudice against cryptocurrencies. I have no idea where this prejudice comes from, but I know very smart people that can solve the most difficult web scalability problems, but that never once glanced over Satoshi Nakamoto extremely short original paper describing the blockchain.</p>
<p>Seriously, the <a href="https://bitcoin.org/bitcoin.pdf">Bitcoin: A Peer-to-Peer Electronic Cash System</a> paper is so ridiculously small and easy to understand that most computer science students should be able to understand it. So all the smart programmers I know should be able to grasp it in a coffee break. Any average programmer should be able to read and understand this paper in 30 minutes or so.</p>
<p></p>
<p></p>
<p>You can simplify a mental model of it as a Linked List, each node of the List is what we call a Block. Each Block is a stupid struct with the usual previous/next pointers and a body comprised of a tree-like structure (a <a href="https://brilliant.org/wiki/merkle-tree/">Merkle Tree</a>, to be more exact).</p>
<p>The catch is that each block has the hash signature of the previous block, thus creating a secure "chain". Hence "block-chain".</p>
<p>Yes, in computer science terms, we're dealing with undergraduate levels of data structures here. If you understand a Linked List and a stupid Binary Tree, plus the easiest crypto thing to understand, a stupid Digest Hash such as SHA256, and boom, you understand the basic backbone of the blockchain database.</p>
<p>Yes, it is just a database. A distributed-database to be more exact. Or a very crude and simple distributed database for that matter. It is not very efficient, and it pales in comparison to more serious NoSQL distributed databases such as Redis or Cassandra. So the query-abilities are basically non-existent beyond finding a block by its identity.</p>
<p>Of course, the Bitcoin source-code is more sophisticated than that but the basics are really so ridiculous that you don't need more than 20 lines of Ruby code to replicate it. Check out this example implementation from <a href="https://github.com/openblockchains/awesome-blockchains/tree/master/blockchain.rb">Gerald Bauer</a>.</p>
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
</tt>34<tt>
</tt>35<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">require <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">digest</span><span style="color:#710">"</span></span>    <span style="color:#888"># for hash checksum digest function SHA256</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">Block</span><tt>
</tt><tt>
</tt>  attr_reader <span style="color:#A60">:index</span><tt>
</tt>  attr_reader <span style="color:#A60">:timestamp</span><tt>
</tt>  attr_reader <span style="color:#A60">:data</span><tt>
</tt>  attr_reader <span style="color:#A60">:previous_hash</span><tt>
</tt>  attr_reader <span style="color:#A60">:hash</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">initialize</span>(index, data, previous_hash)<tt>
</tt>    <span style="color:#33B">@index</span>         = index<tt>
</tt>    <span style="color:#33B">@timestamp</span>     = <span style="color:#036;font-weight:bold">Time</span>.now<tt>
</tt>    <span style="color:#33B">@data</span>          = data<tt>
</tt>    <span style="color:#33B">@previous_hash</span> = previous_hash<tt>
</tt>    <span style="color:#33B">@hash</span>          = calc_hash<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calc_hash</span><tt>
</tt>    sha = <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA256</span>.new<tt>
</tt>    sha.update( <span style="color:#33B">@index</span>.to_s + <span style="color:#33B">@timestamp</span>.to_s + <span style="color:#33B">@data</span> + <span style="color:#33B">@previous_hash</span> )<tt>
</tt>    sha.hexdigest<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">first</span>( data=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Genesis</span><span style="color:#710">"</span></span> )    <span style="color:#888"># create genesis (big bang! first) block</span><tt>
</tt>    <span style="color:#888">## uses index zero (0) and arbitrary previous_hash ("0")</span><tt>
</tt>    <span style="color:#036;font-weight:bold">Block</span>.new( <span style="color:#00D;font-weight:bold">0</span>, data, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">0</span><span style="color:#710">"</span></span> )<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">next</span>( previous, data=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Transaction Data...</span><span style="color:#710">"</span></span> )<tt>
</tt>    <span style="color:#036;font-weight:bold">Block</span>.new( previous.index+<span style="color:#00D;font-weight:bold">1</span>, data, previous.hash )<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I know, right!?</p>
<p>One question remains: how does this stupid structure become a "distributed" database.</p>
<p>Now, either you need to have a centralized "master-copy" out of which all other copies replicate from. Or you need some form of "consensus" between the different copies.</p>
<p>How do you reach consensus between rogue, random node spread across the globe? This is the problem that is called <a href="https://pmg.csail.mit.edu/papers/osdi99.pdf">"Byzantine Fault Tolerance"</a>, masterfully explained and solved by Barbara Liskov and Miguel Castro, from MIT, in 1999.</p>
<p>In a nutshell, imagine that you have Byzantine generals, each with their own armies, surrounding a hostile city. Now, you can either attack or retreat. But all generals must either do one or the other, in consensus. How do you reach consensus when you don't have direct communication with all the generals and, worse, when some of the generals may be traitors or double-agents?</p>
<p>That's the kind of problem we face here. Anyone on the internet can download a copy of the blockchain, and they can check that the blocks are valid and unadulterated by recomputing the digest hashes for each block.</p>
<p>But how do you add new blocks and make the other nodes accept your new block?</p>
<p>That's why Satoshi added the so-called "Proof of Work" to the equation. Remember that I said that each block is chained together to the previous by containing the hash of the previous block? Computing a digest hash is quite trivial these days.</p>
<p>In Ruby if you do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA256</span>.hexdigest(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">abcd</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#888"># =&gt; "88d4266fd4e6338d13b845fcf289579d209c897823b9217da3e161936f031589"</span><tt>
</tt><span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA256</span>.hexdigest(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">123</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#888"># =&gt; "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It takes a <strong>fraction of millisecond</strong> to run.</p>
<p>Now, what if I ask you to find the hash that starts with a certain amount of "zeroes" in the beginning of the hash?</p>
<p>For example:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># I want to find 4 zeros ("0000") in the hash:</span><tt>
</tt><span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA256</span>.hexdigest(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">79026</span><span style="color:#710">"</span></span> + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">123</span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#888"># =&gt; "0000559fb4a55f135c7db3d83405b86b4b63cd035993873a5b676bae08b64334"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>How do I know that I had to prepend "79026"? I don't, I have to start from 0 and incrementing one by one until I find the hash with the format I want.</p>
<p>If we check from <a href="https://github.com/openblockchains/awesome-blockchains/blob/master/blockchain.rb/blockchain_with_proof_of_work.rb#L29-L45">Gerald' example</a> we would implement this lookup like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">compute_hash_with_proof_of_work</span>( difficulty=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">00</span><span style="color:#710">"</span></span> )<tt>
</tt>  nonce = <span style="color:#00D;font-weight:bold">0</span><tt>
</tt>  loop <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    hash = calc_hash_with_nonce( nonce )<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> hash.start_with?( difficulty )<tt>
</tt>      <span style="color:#080;font-weight:bold">return</span> [nonce,hash]    <span style="color:#888">## bingo! proof of work if hash starts with leading zeros (00)</span><tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      nonce += <span style="color:#00D;font-weight:bold">1</span>             <span style="color:#888">## keep trying (and trying and trying)</span><tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">calc_hash_with_nonce</span>( nonce=<span style="color:#00D;font-weight:bold">0</span> )<tt>
</tt>  sha = <span style="color:#036;font-weight:bold">Digest</span>::<span style="color:#036;font-weight:bold">SHA256</span>.new<tt>
</tt>  sha.update( nonce.to_s + <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">123</span><span style="color:#710">"</span></span> )<tt>
</tt>  sha.hexdigest<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Just a simple SHA256 takes somewhere between 0.000010 to 0.000020 seconds (remember: fractions of milliseconds). Now how long does it take to find that "79026" (which we call a "nonce")?</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">&gt; puts Benchmark.measure { compute_hash_with_proof_of_work("0000") }<tt>
</tt>  0.190000   0.000000   0.190000 (  0.189615)<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Yep, considerably more, now it takes 0.18 seconds instead of 0.000020. We can increase the "difficult" variable to make it even more laborious to find the nonce. And that's exactly how Bitcoin is implemented: each block adjusts the difficult so the fastest one can take to find the hash for the next block is around 10 minutes.</p>
<p>And this, my friends, is what we call <strong>"MINING"</strong>. What a miner does is compute a loop, incrementing nonces, over the block digest to find the correct nonce.</p>
<p>Once a nonce is found, the miner can add the block to the blockchain and broadcast it to other nodes. The other nodes can then double-check (and now it's just the 0.000020 seconds procedure again, super fast).</p>
<p>When the nodes double-check and confirm the nonce, they all add the block to the top of the blockchain. And usually, when the other miners keep adding other blocks on top of that, that block becomes "solidified". The most recent block on the top of the blockchain is usually unstable, but once you have more blocks on top of it, it is said to be more "guaranteed". Which is why most exchanges and other services that accept bitcoin wait for the so-called "6 blocks" confirmation.</p>
<p>And because the difficulty is such that the fastest node takes around "10 minutes" to find that nonce, a block is said to be "secure" when around 1-hour passes and 6 blocks are added after it.</p>
<h2>Can we break this?</h2>
<p>Now, you will understand why we talk about "hash power" when we talk about mining.</p>
<p>Mining is the act of signing and confirming blocks to the blockchain. It's a maintenance service, which is why you reward miners with "transaction fees" and a couple of "satoshis" (fractions of 1 Bitcoin), for their work. And also why you call this "Proof of Work" because when someone finds a nonce, we know it had to go through a lot of hash computation to reach it.</p>
<p>And also why we talk about CPUs or GPUs that miners use to have "hash rates". You need to have an absurd capacity to be able to mine Bitcoins nowadays. No one will use a home-built rig to do it. One must build special hardware, such as the famous <a href="https://www.cryptocompare.com/mining/bitmain/antminer-s9-miner/">AntMiners</a>. A USD 1,500 AntMiner S9 is able to compute around 14 TH.</p>
<p>Each crypto-currency different from Bitcoin calculates hashes differently so the hashrate differs from coin to coin.</p>
<p>The current Hash Power of the entire Bitcoin consensus network is almost reaching 14 EH (exa-hashes or millions of tera-hashes).</p>
<p>So, let's say that I am a billionaire and I want to troll the Bitcoin community by adding enough hash power to surpass the entire hash power of the network. I'd have to buy 1 million AntMiner s9, or an investment of around USD 1.5 billion! And this is without adding the energy required to boot and run those machines, of course.</p>
<p>But even then, do you know what happens? Remember that difficult variable I mentioned above? It will adjust again, to make sure the next block takes 10 minutes to compute again!</p>
<p>Then, no, even if you're willing to put USD 1.5 billion to waste, you won't break it. And that's how Bitcoin deals with Byzantine generals in this consensus network.</p>
<p></p>
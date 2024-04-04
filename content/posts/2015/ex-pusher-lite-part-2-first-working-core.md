---
title: "Ex Pusher Lite - Part 2 - First Working Core!"
date: "2015-12-14T17:04:00.000Z"
tags: ["phoenix", "pusher", "expusherlite", "english"]
years: "2015"
---

<p></p>
<p>In <a href="http://www.akitaonrails.com/2015/12/09/ex-pusher-lite-part-1-phoenix-channels-and-rails-apps">Part 1</a> I basically started with <a href="https://labs.opendoor.com/phoenix-on-rails-for-client-push-notifications">Daniel Neighman's</a> tutorial.</p>
<p>In Part 2 I will add the proper mechanisms to make a minimal core that is actually useful and deploy it to Heroku. In order to do that I need to implement the following:</p>
<ul>
  <li>a simple Administration authentication (a hardcoded admin_username and admin_password will do for now)</li>
  <li>an admin restricted <strong>"/api/admin/apps"</strong> endpoint to manage new Applications. Each Application should have a randomly generated key and secret.</li>
  <li>the existing "/events" endpoint from Part 1 should be moved to <strong>"/api/apps/:app_id/events"</strong> and have access restricted to the authentication of the key and secret of the Application identified as "app_id".</li>
  <li>for now, the Event will just broadcast to the appropriate topic. We want to be able to broadcast to everyone from an Application as well to specific topics within the Application scope.</li>
</ul>
<p>As usual, the code for this section will be tagged as <strong>v0.2</strong> in both the <a href="https://github.com/akitaonrails/pusher_lite_demo/tree/v0.2">client demo</a> and <a href="https://github.com/akitaonrails/ex_pusher_lite/tree/v0.2">server-side</a> Github repositories.</p>
<p></p>
<p></p>
<h3>The App Resource</h3>
<p>If this project of ours is to behave like Pusher.com, we need a way to create new "Applications". Each client connecting to this service will be bound to this Application. Events should be restricted to the Application boundary. This is how we will isolate different clients connecting to the same server. So you can have one core serving several different web applications.</p>
<p>Once a new application is created, the client/consumer web app will have the pair of key and secret tokens that it will use to connect both the server-side triggers as well as the client-side Websocket listeners.</p>
<p>As a disclaimer, at this stage of development I will not implement any sophisticated authentication system such as OAuth2 or JWT. I will save this for posts to follow. For now I will use the Application's key and secret just as simple username and password in an HTTP Basic Auth. This should be good enough for our purposes for the time being.</p>
<p>So, the very first step is to create such an "Application" resource and we can resort to Phoenix's built-in JSON scaffold generator:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix phoenix.gen.json App apps name:string slug:string key:string secret:string active:boolean<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Most tutorials will show you the "<tt>phoenix.gen.html</tt>" generator, which behaves like Rails's "scaffold", generating HTML templates for each of the CRUD verbs. This is similar but it skips HTML and assumes this is going to be a JSON CRUD API.</p>
<p>We need to manually update the "<tt>web/router.ex</tt>" file like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/router.ex</span><tt>
</tt>scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/api</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">ExPusherLite</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  pipe_through <span style="color:#A60">:api</span><tt>
</tt>  post <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/apps/:app_slug/events</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">EventsController</span>, <span style="color:#A60">:create</span><tt>
</tt>  scope <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/admin</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    resources <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">/apps</span><span style="color:#710">"</span></span>, <span style="color:#036;font-weight:bold">AppController</span>, <span style="color:#808">except</span>: [<span style="color:#A60">:new</span>, <span style="color:#A60">:edit</span>]<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The "<tt>EventsController</tt>" is the one we implemented in Part 1 and that we will overhaul during this Part 2.</p>
<p>The generator gave us this new "<tt>AppController</tt>", and similarly to Rails' routes, the DSL is remarkably similar here. If you're a Railer I bet you can instantly recognize the routes this DSL is generating.</p>
<p>The generator also created a proper migration for us:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># priv/repo/migrations/20151210131528_create_app.exs</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Repo</span>.<span style="color:#036;font-weight:bold">Migrations</span>.<span style="color:#036;font-weight:bold">CreateApp</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">Ecto</span>.<span style="color:#036;font-weight:bold">Migration</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">change</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    create table(<span style="color:#A60">:apps</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      add <span style="color:#A60">:name</span>, <span style="color:#A60">:string</span><tt>
</tt>      add <span style="color:#A60">:slug</span>, <span style="color:#A60">:string</span><tt>
</tt>      add <span style="color:#A60">:key</span>, <span style="color:#A60">:string</span><tt>
</tt>      add <span style="color:#A60">:secret</span>, <span style="color:#A60">:string</span><tt>
</tt>      add <span style="color:#A60">:active</span>, <span style="color:#A60">:boolean</span>, <span style="color:#808">default</span>: <span style="color:#038;font-weight:bold">false</span><tt>
</tt><tt>
</tt>      timestamps<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>    create index(<span style="color:#A60">:apps</span>, [<span style="color:#A60">:name</span>], <span style="color:#808">unique</span>: <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt>    create index(<span style="color:#A60">:apps</span>, [<span style="color:#A60">:slug</span>], <span style="color:#808">unique</span>: <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, remarkably similar to ActiveRecord's Migration DSL. Migrations behave as you expect. You must run:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix ecto.create # if you haven't already<tt>
</tt>mix ecto.migrate<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This App resource will need the ability to create slugs out of the names (which we will use as "app_id") and also generate random key and secret values. So we must add these dependencies to the "<tt>mix.exs</tt>" file:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># mix.exs</span><tt>
</tt>defp deps <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  [...,<tt>
</tt>   {<span style="color:#A60">:secure_random</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 0.2.0</span><span style="color:#710">"</span></span>},<tt>
</tt>   {<span style="color:#A60">:slugger</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">~&gt; 0.0.1</span><span style="color:#710">"</span></span>}]<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The <a href="https://github.com/akitaonrails/ex_pusher_lite/blob/v0.2/web/models/app.ex">final App model</a> is quite long, so I will break it down for you:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/models/app.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">App</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:model</span><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Repo</span><tt>
</tt><tt>
</tt>  schema <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">apps</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    field <span style="color:#A60">:name</span>, <span style="color:#A60">:string</span><tt>
</tt>    field <span style="color:#A60">:slug</span>, <span style="color:#A60">:string</span><tt>
</tt>    field <span style="color:#A60">:key</span>, <span style="color:#A60">:string</span><tt>
</tt>    field <span style="color:#A60">:secret</span>, <span style="color:#A60">:string</span><tt>
</tt>    field <span style="color:#A60">:active</span>, <span style="color:#A60">:boolean</span>, <span style="color:#808">default</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>    timestamps<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  <span style="color:#33B">@required_fields</span> ~w(name)<tt>
</tt>  <span style="color:#33B">@optional_fields</span> ~w()<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This block declares the model Schema. Be careful if you generate a migration and then change its fields settings: you must remember to update the schema in the model. In my first attempt I didn't include the "slug" field, so I rolled back the database migration (with "<tt>mix ecto.rollback</tt>"), changed the migration to add the "slug" field and re-ran the "<tt>ecto.migrate</tt>" task.</p>
<p>I was puzzled with the model not picking up the new field; after some time I remembered that Ecto models don't attempt to fetch the real database schema and generate accessors dynamically, instead it relies on the explicitly declared schema block as shown above. After I added the new "slug" field in the schema block, then the model would properly use the new field.</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/models/app.ex</span><tt>
</tt>...<tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">get_by_slug</span>(slug) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Repo</span>.get_by!(__MODULE__, <span style="color:#808">slug</span>: slug, <span style="color:#808">active</span>: <span style="color:#038;font-weight:bold">true</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">hashed_secret</span>(model) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  <span style="color:#036;font-weight:bold">Base</span>.encode64(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>model.key<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">:</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>model.secret<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>These are just helper functions to use in the AppController. The odd bit might be "<strong>MODULE</strong>" but this is just a shortcut for the atom representation of the current module, which is "<tt>ExPusherLite.App</tt>". This is how you make a simple query to the model, it resembles Rails' "<tt>App.get_by(slug: slug, active: true)</tt>".</p>
<p>In Elixir convention, Ecto has functions with and without bangs ("<tt>get_by!</tt>" and "<tt>get_by</tt>"). If you want to catch an error you use the version without bangs and it will return either a "<tt>{:ok, result}</tt>" tuple or a "<tt>{:error, result}</tt>" and you can pattern match them. Or you can use the bang version and it will raise an exception. Depends on what you want to do.</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/models/app.ex</span><tt>
</tt>...<tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">changeset</span>(model, params <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#A60">:empty</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  model<tt>
</tt>  |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)<tt>
</tt>  |&gt; validate_length(<span style="color:#A60">:name</span>, <span style="color:#808">min</span>: <span style="color:#00D;font-weight:bold">5</span>, <span style="color:#808">max</span>: <span style="color:#00D;font-weight:bold">255</span>)<tt>
</tt>  |&gt; unique_constraint(<span style="color:#A60">:name</span>)<tt>
</tt>  |&gt; generate_key<tt>
</tt>  |&gt; generate_secret<tt>
</tt>  |&gt; slugify<tt>
</tt>  |&gt; unique_constraint(<span style="color:#A60">:slug</span>)<tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Second only to the Schema block I mentioned above, this "<tt>changeset/2</tt>" function is the most important part of a Model.</p>
<p>In Rails you just have the concept of a "Model" which is considered "Fat" because it deals with database operations, business logic and framework hooks all in the same place. In Phoenix you have to deal with at least 3 different concepts:</p>
<ul>
  <li>You have a <strong>Repo</strong>, which receives a Changeset and uses it to insert or update the designated rows in the database table. You will see "<tt>Repo.get</tt>" or "<tt>Repo.insert</tt>", not "<tt>App.find</tt>" or "<tt>App.save</tt>".</li>
  <li>Then you have the <strong>Changeset</strong> which are just Elixir Maps (the ones with the syntax "%<tt>{key =&gt; value}</tt>"). It's just a Hash, a Dictionary, a collection of key-value pairs. A Repo accepts Maps for its operations.</li>
  <li>Finally, you have the <strong>Model</strong> which actually give meaning and context to the raw Changesets. And the function "<tt>changeset/2</tt>" above is the one responsible for receiving a raw Map, piping it through a validation and transformation chain and return a valid Changeset for the Repo to use.</li>
</ul>
<p>So, in a controller you will usually find code like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/app_controller.ex</span><tt>
</tt>...<tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"app" =&gt; app_params</span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  changeset = <span style="color:#036;font-weight:bold">App</span>.changeset(%<span style="color:#036;font-weight:bold">App</span>{}, app_params)<tt>
</tt>  <tt>
</tt>  <span style="color:#080;font-weight:bold">case</span> <span style="color:#036;font-weight:bold">Repo</span>.insert(changeset) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    {<span style="color:#A60">:ok</span>, app} -&gt;<tt>
</tt>      conn<tt>
</tt>      |&gt; ...<tt>
</tt>    {<span style="color:#A60">:error</span>, changeset} -&gt;<tt>
</tt>      conn<tt>
</tt>      |&gt; ...<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how you create a new, validated, changeset and then pass it to the Repo, treating the results in a pattern match block. Just compare the above changeset line with the beginning of the "changeset/2" function:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">...<tt>
</tt><span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">changeset</span>(model, params <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> <span style="color:#A60">:empty</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  model<tt>
</tt>  |&gt; cast(params, <span style="color:#33B">@required_fields</span>, <span style="color:#33B">@optional_fields</span>)<tt>
</tt>  |&gt; validate_length(<span style="color:#A60">:name</span>, <span style="color:#808">min</span>: <span style="color:#00D;font-weight:bold">5</span>, <span style="color:#808">max</span>: <span style="color:#00D;font-weight:bold">255</span>)<tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>It maps the "<tt>%App{}</tt>" empty record to the "model" argument and the "app_params" that comes from the request (a map of the format "<tt>%{name =&gt; 'foo', active: =&gt; 'true'}</tt>") to the argument "params". Then it pipes the model and params to the "<tt>cast/4</tt>" function which will copy the values from the params map to the model map/changeset. And it keep passing the resulting changeset to the following functions, such as "<tt>validated_length/3</tt>" below, and so on. If the chain ends with no exceptions, you end up with a clean, validated changeset that you can just pass to the Repo to blindly insert to the database.</p>
<p>In the above implementation we are chaining filters to generate the key, secret and slug, and this is the implementation as private functions:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/models/app.ex</span><tt>
</tt>...<tt>
</tt>  defp generate_key(model) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> get_field(model, <span style="color:#A60">:key</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      model<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      model<tt>
</tt>      |&gt; put_change(<span style="color:#A60">:key</span>, <span style="color:#036;font-weight:bold">SecureRandom</span>.uuid)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp generate_secret(model) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> get_field(model, <span style="color:#A60">:secret</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      model<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      model<tt>
</tt>      |&gt; put_change(<span style="color:#A60">:secret</span>, <span style="color:#036;font-weight:bold">SecureRandom</span>.uuid)<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>  defp slugify(model) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> name = get_change(model, <span style="color:#A60">:name</span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      model<tt>
</tt>      |&gt; put_change(<span style="color:#A60">:slug</span>, <span style="color:#036;font-weight:bold">Slugger</span>.slugify_downcase(name))<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      model<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The logic is set so new key/secret are generated only if the fields are empty and a new slug is generated only if the name has changes. And this is it, I told you the model code would be a bit large. You can see how to use the Slugger and SecureRandom libraries we added in the "mix.exs" before.</p>
<p>I also want to add the equivalent of a Rails seed file to create a test application so it's easier for new comers to know what to do. Phoenix has seeds and you can implement it like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># priv/repo/seeds.exs</span><tt>
</tt><tt>
</tt><span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">App</span><tt>
</tt><span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Repo</span><tt>
</tt><tt>
</tt><span style="color:#888"># not using the App.changeset should just avoid all validations and generations</span><tt>
</tt><span style="color:#036;font-weight:bold">Repo</span>.insert! %<span style="color:#036;font-weight:bold">App</span>{ <span style="color:#808">slug</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">test-app</span><span style="color:#710">"</span></span>, <span style="color:#808">name</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Test App</span><span style="color:#710">"</span></span>, <span style="color:#808">key</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">test-app-fake-key</span><span style="color:#710">"</span></span>, <span style="color:#808">secret</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">test-app-fake-secret</span><span style="color:#710">"</span></span>, <span style="color:#808">active</span>: <span style="color:#038;font-weight:bold">true</span> }<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Remember how I detailed the role of the "changeset/2" function in creating a clean and validated changeset, which is just a Map? You can skip that function altogether and hand craft your own final Map and pass it to the Repo. The Repo doesn't care if this is a valid Map or not it will just try to insert it into the database regardless. And in this case the App Model avoids us to hardcode keys and secrets, so this is how we do it in a seed file.</p>
<p>We can just run it directly like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">mix run priv/repo/seeds.exs<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The AppController just need 2 changes. The first is to search the App through the slug field instead of the default 'id' field. This is simple enough, we just replace all calls to "<tt>app = Repo.get!(App, id)</tt>" to "<tt>app = App.get_by_slug(id)</tt>", which is why we implemented this function in the model above.</p>
<p>The second thing is Authentication.</p>
<h3>Adding Authentication</h3>
<p>Now that we have an App model that can generate secure random UUIDs for key and secret, I will add a second level of authentication for administrators to be able to create such Apps.</p>
<p>For that I will just hard-code a secret in the config file of the application itself to serve as a development default. Like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/config.exs</span><tt>
</tt>...<tt>
</tt>config <span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#A60">:admin_authentication</span>,<tt>
</tt>  <span style="color:#808">username</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_admin_username</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">password</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_admin_password</span><span style="color:#710">"</span></span><tt>
</tt>...<tt>
</tt>import_config <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span><span style="color:#036;font-weight:bold">Mix</span>.env<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">.exs</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>You must add this block before the "<tt>import_config</tt>" function. Then you can override those values in the "config/prod.secret.exs" file, for example, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/prod.secret.exs</span><tt>
</tt>...<tt>
</tt>config <span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#A60">:admin_authentication</span>,<tt>
</tt>  <span style="color:#808">username</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">14e86e5fee3335fa88b0</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">password</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">2b94ff0f07ce9769567f</span><span style="color:#710">"</span></span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Of course, generate your own pair of secure username and password and replace it in the production environment if you intend to actually use this. For Heroku, we will still have to tweak this further, so keep this in mind.</p>
<p>Just to make the process easier, I also added the following helper function:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># lib/ex_pusher_lite.ex</span><tt>
</tt>...<tt>
</tt>  <span style="color:#888"># Return this applicaton administration Basic HTTP Auth hash</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">admin_secret</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    admin_username = <span style="color:#036;font-weight:bold">Application</span>.get_env(<span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#A60">:admin_authentication</span>)[<span style="color:#A60">:username</span>]<tt>
</tt>    admin_password = <span style="color:#036;font-weight:bold">Application</span>.get_env(<span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#A60">:admin_authentication</span>)[<span style="color:#A60">:password</span>]<tt>
</tt>    secret = <span style="color:#036;font-weight:bold">Base</span>.encode64(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>admin_username<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">:</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>admin_password<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is how you fetch the configuration values. I am generating a simple Base64 encoded string out of the username concatenated with the password with a comma, which is what Basic HTTP Auth requires. I will use this admin hash for the "AppController" and each client must provide the key/secret in its own App instance to be able to trigger the "EventsController".</p>
<p>For both controllers I will create a single Authentication Plug, like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># lib/ex_pusher_lite/authentication.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Authentication</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  import <span style="color:#036;font-weight:bold">Plug</span>.<span style="color:#036;font-weight:bold">Conn</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">App</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">init</span>(assigns <span style="color:#F00;background-color:#FAA">\</span><span style="color:#F00;background-color:#FAA">\</span> [<span style="color:#808">admin</span>: <span style="color:#038;font-weight:bold">false</span>]), <span style="color:#808">do</span>: assigns<tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">call</span>(conn, assigns) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>    token =<tt>
</tt>      <span style="color:#080;font-weight:bold">if</span> assigns[<span style="color:#A60">:admin</span>] <span style="color:#080;font-weight:bold">do</span><tt>
</tt>        <span style="color:#036;font-weight:bold">ExPusherLite</span>.admin_secret<tt>
</tt>      <span style="color:#080;font-weight:bold">else</span><tt>
</tt>        params = fetch_query_params(conn).params<tt>
</tt>        params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">app_slug</span><span style="color:#710">"</span></span>] |&gt; <span style="color:#036;font-weight:bold">App</span>.get_by_slug |&gt; <span style="color:#036;font-weight:bold">App</span>.hashed_secret<tt>
</tt>      <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Basic </span><span style="color:#710">"</span></span> &lt;&gt; auth_token = hd(get_req_header(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">authorization</span><span style="color:#710">"</span></span>))<tt>
</tt>    <span style="color:#080;font-weight:bold">if</span> <span style="color:#036;font-weight:bold">Plug</span>.<span style="color:#036;font-weight:bold">Crypto</span>.secure_compare(auth_token, token) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>      conn<tt>
</tt>    <span style="color:#080;font-weight:bold">else</span><tt>
</tt>      conn |&gt; send_resp(<span style="color:#00D;font-weight:bold">401</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="color:#710">"</span></span>) |&gt; halt<tt>
</tt>    <span style="color:#080;font-weight:bold">end</span><tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span> <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As I explained in previous articles, a Plug is like a chainable Rails Middleware or even a Rack application. It must have a single "<tt>call/2</tt>" that receives a Plug.Conn structure and returns it back, allowing to form a chain/pipeline of Plugs.</p>
<p>We check if we want to compare with the Admin token or the App token and then retrieve the Basic HTTP authorization token that's in the HTTP request connection structure (we retrive individual header values through the "<tt>get_req_header/2</tt>" function). Finally we make a secure compare between the tokens.</p>
<p>To enable this plug in the controllers we just add it like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/app_controller.ex</span><tt>
</tt>defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">AppController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>  use <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">alias</span> <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">App</span><tt>
</tt>  plug <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Authentication</span>, [<span style="color:#808">admin</span>: <span style="color:#038;font-weight:bold">true</span>]<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"> defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">EventsController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>   use <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt><tt>
</tt>-  plug <span style="color:#A60">:authenticate</span><tt>
</tt>+  plug <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Authentication</span><tt>
</tt>   ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>In Part 1 we had a simpler "<tt>plug :authenticate</tt>" in the EventsController. We can remove it and also the "<tt>authenticate/2</tt>" function. We just refactored it into a better function that also serves administration authentication now, but the idea is the same.</p>
<p>This is it: the basics for API authentication. Again, this is not the best solution as the username/password pair goes in the URL and it's open to man-in-the-middle attacks. SSL only encrypts the HTTP body but the URL is still open.</p>
<p>For example, if an administrator wants to create a new application, he must do the following:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl --data "app[name]=foo-app" https://pusher_admin_username:pusher_admin_password@localhost:4000/api/admin/apps<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this would be one example of the resulting JSON representation of the new app:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">{"data":{"slug":"foo-app","secret":"8ef69064-0d7e-c9ef-ac14-b6b1db303e7a","name":"foo-app","key":"9400ad21-eed8-117a-bce5-845262e0a09e","id":5,"active":true}}%<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>With this new key and secret in hand, we can update our client demo to make use of the new app.</p>
<h3>Configuring the Client Demo</h3>
<p>We must start by adding the proper Application details in the "<tt>.env</tt>" file:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">PUSHER_URL: "localhost:4000"<tt>
</tt>PUSHER_APP_ID: "foo-app"<tt>
</tt>PUSHER_KEY: "9400ad21-eed8-117a-bce5-845262e0a09e"<tt>
</tt>PUSHER_SECRET: "8ef69064-0d7e-c9ef-ac14-b6b1db303e7a"<tt>
</tt>PUSHER_CHANNEL: "foo-topic"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>We must also tweak the "<tt>config/secrets.yml</tt>" to reflect the new metadata (development, test, and production must follow this):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">development:<tt>
</tt>  secret_key_base: ded7c4a2a298c1b620e462b50c9ca6ccb60130e27968357e76cab73de9858f14556a26df885c8aa5004d0a7ca79c0438e618557275bdb28ba67a0ffb0c268056<tt>
</tt>  pusher_url: &lt;%= ENV['PUSHER_URL'] %&gt;<tt>
</tt>  pusher_app_id: &lt;%= ENV['PUSHER_APP_ID'] %&gt;<tt>
</tt>  pusher_key: &lt;%= ENV['PUSHER_KEY'] %&gt;<tt>
</tt>  pusher_secret: &lt;%= ENV['PUSHER_SECRET'] %&gt;<tt>
</tt>  pusher_channel: &lt;%= ENV['PUSHER_CHANNEL'] %&gt;<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And we can create an initializer to make it easier to use this metadata properly:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># config/initializers/pusher_lite.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">module</span> <span style="color:#B06;font-weight:bold">PusherLite</span><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#038;font-weight:bold">self</span>.<span style="color:#06B;font-weight:bold">uri</span><tt>
</tt>    key    = <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_key<tt>
</tt>    secret = <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_secret<tt>
</tt>    app_id = <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_app_id<tt>
</tt>    url    = <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_url<tt>
</tt><tt>
</tt>    uri = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https://</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>key<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">:</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>secret<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">@</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>url<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/api/apps/</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>app_id<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">/events</span><span style="color:#710">"</span></span><tt>
</tt>    <span style="color:#036;font-weight:bold">URI</span>.parse(uri)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span> <tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, the Rails app will trigger the ExPusherLite server using the Basic HTTP Auth. Do not be fooled into thinking this is "secure", it just "feels a bit secure through obscurity". You have been warned, wait for the next articles on this subject. But this is usable in controlled environments.</p>
<p>To finalize the upgrades, we must change the client-side access to the new metadata, first changing the application layout:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/layouts/application.html.erb --&gt;</span><tt>
</tt>...<tt>
</tt>+  <span style="color:#070">&lt;meta</span> <span style="color:#007">name</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_host</span><span style="color:#710">"</span></span> <span style="color:#007">content</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;%= Rails.application.secrets.pusher_url %</span></span><span style="color:#F00;background-color:#FAA">&gt;</span>"<span style="color:#F00;background-color:#FAA">&gt;</span><tt>
</tt>-  <span style="color:#070">&lt;meta</span> <span style="color:#007">name</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_key</span><span style="color:#710">"</span></span> <span style="color:#007">content</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;%= Rails.application.secrets.pusher_key %</span></span><span style="color:#F00;background-color:#FAA">&gt;</span>"<span style="color:#F00;background-color:#FAA">&gt;</span><tt>
</tt>+  <span style="color:#070">&lt;meta</span> <span style="color:#007">name</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_app_id</span><span style="color:#710">"</span></span> <span style="color:#007">content</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;%= Rails.application.secrets.pusher_app_id %</span></span><span style="color:#F00;background-color:#FAA">&gt;</span>"<span style="color:#F00;background-color:#FAA">&gt;</span><tt>
</tt>   <span style="color:#070">&lt;meta</span> <span style="color:#007">name</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">pusher_channel</span><span style="color:#710">"</span></span> <span style="color:#007">content</span>=<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">&lt;%= Rails.application.secrets.pusher_channel %</span></span><span style="color:#F00;background-color:#FAA">&gt;</span>"<span style="color:#F00;background-color:#FAA">&gt;</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The javascript "<tt>index.es6</tt>" fetches from this meta headers, so we must change them there:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#F00;background-color:#FAA">#</span> app/assets/javascripts/application/pages/home/index.es6<tt>
</tt>...<tt>
</tt>     let guardianToken = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=guardian-token]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt>     let csrfToken     = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=guardian-csrf]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt> <tt>
</tt>+    let pusherHost    = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_host]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt>-    let pusherKey     = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_key]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt>+    let pusherApp     = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_app_id]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt>     let pusherChannel = <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">meta[name=pusher_channel]</span><span style="color:#710">"</span></span>).attr(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">content</span><span style="color:#710">"</span></span>)<tt>
</tt> <tt>
</tt>-    let socket = <span style="color:#080;font-weight:bold">new</span> Socket(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ws://localhost:4000/socket</span><span style="color:#710">"</span></span>, {<tt>
</tt>+    let socket = <span style="color:#080;font-weight:bold">new</span> Socket(<span style="color:#F00;background-color:#FAA">`</span>ws:<span style="color:#888">//${pusherHost}/socket`, {</span><tt>
</tt>       params: { <span style="color:#808">guardian_token</span>: guardianToken, <span style="color:#808">csrf_token</span>: csrfToken }<tt>
</tt>     })<tt>
</tt>     socket.connect()<tt>
</tt> <tt>
</tt>     <span style="color:#888">// Now that you are connected, you can join channels with a topic:</span><tt>
</tt>-    let channel = socket.channel(pusherChannel, {})<tt>
</tt>+    let channel = socket.channel(<span style="color:#F00;background-color:#FAA">`</span><span style="color:#080;font-weight:bold">public</span>:<span style="color:#369;font-weight:bold">$</span>{pusherApp}<span style="color:#F00;background-color:#FAA">`</span>, {})<tt>
</tt>     channel.join()<tt>
</tt>       .receive(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">ok</span><span style="color:#710">"</span></span>, resp =&gt; { console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Joined successfully</span><span style="color:#710">"</span></span>, resp) })<tt>
</tt>       .receive(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">error</span><span style="color:#710">"</span></span>, resp =&gt; { console.log(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">Unable to join</span><span style="color:#710">"</span></span>, resp) })<tt>
</tt> <tt>
</tt>-    channel.on(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, data =&gt; {<tt>
</tt>+    channel.on(<span style="color:#F00;background-color:#FAA">`</span><span style="color:#369;font-weight:bold">$</span>{pusherChannel}:msg<span style="color:#F00;background-color:#FAA">`</span>, data =&gt; {<tt>
</tt>       let new_line = <span style="color:#F00;background-color:#FAA">`</span><span style="color:#070">&lt;p&gt;</span><span style="color:#070">&lt;strong&gt;</span>${data.name}<span style="color:#070">&lt;strong&gt;</span>: ${data.message}<span style="color:#070">&lt;/p&gt;</span><span style="color:#F00;background-color:#FAA">`</span><tt>
</tt>       <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.message-receiver</span><span style="color:#710">"</span></span>).append(new_line)<tt>
</tt>     })<tt>
</tt>+<tt>
</tt>+    channel.on(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, data =&gt; {<tt>
</tt>+      let new_line = <span style="color:#F00;background-color:#FAA">`</span><span style="color:#070">&lt;p&gt;</span><span style="color:#070">&lt;strong&gt;</span>Broadcast to all channels<span style="color:#070">&lt;/strong&gt;</span>: ${data.message}<span style="color:#070">&lt;/p&gt;</span><span style="color:#F00;background-color:#FAA">`</span><tt>
</tt>+      <span style="color:#369;font-weight:bold">$</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">.message-receiver</span><span style="color:#710">"</span></span>).append(new_line)<tt>
</tt>+    })<tt>
</tt>   }<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>One important modification from Part 1 is that the WebSocket host was hardcoded to "localhost" and here we are making it configurable through the meta tags. Right now, for localhost tests, we are using the plain "ws://" protocol but when we deploy to Heroku we will change it to "wss://" for SSL. Same thing for the "PusherLite" initializer. Keep that in mind.</p>
<p>Now it's subscribing to a different format of topic/channel. In Part 1 it would be something like: "<tt>public:test_channel</tt>" now we are listening to "<tt>public:foo-app</tt>", so the application is the Websocket subscription "topic".</p>
<p>Then we are changing the socket listener to listen for 2 different events. The first one is in the format "<tt>test_channel:msg</tt>". So this is how we must now send messages to an specific "channel" within an "app/topic".</p>
<p>And last we still listen to the old "msg" event, but this serves as a "broadcast" event for all connected clients subscribed to this particular "foo-app" Application. Now web clients can listen to specific "channels" within the "app" but also receive system wide "broadcast" messages. This is a big improvement and it didn't require much on the Javascript side.</p>
<p>But what more does it take to make this <strong>"channel-only and broadcast"</strong> system work? First, we start changing the web form to allow a user to choose between sending a channel-only message or a broadcast, like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888">&lt;!-- app/views/home/index.html.erb --&gt;</span><tt>
</tt>...<tt>
</tt>     <span style="color:#888">&lt;%= f.text_field :name, placeholder: "Name" %&gt;</span><tt>
</tt>     <span style="color:#888">&lt;%= f.text_field :message, placeholder: "Message" %&gt;</span><tt>
</tt>+    <span style="color:#888">&lt;%= f.check_box :broadcast %&gt;</span><tt>
</tt>     <span style="color:#888">&lt;%= f.submit "Send message", class: "pure-button pure-button-primary" %&gt;</span><tt>
</tt>   <span style="color:#070">&lt;/fieldset&gt;</span><tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now the EventsController must accept this new parameter:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt>5<tt>
</tt>6<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/controllers/events_controller.rb</span><tt>
</tt>...<tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">event_params</span><tt>
</tt>    params.require(<span style="color:#A60">:pusher_event</span>).permit(<span style="color:#A60">:name</span>, <span style="color:#A60">:message</span>, <span style="color:#A60">:broadcast</span>)<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Finally, the Model must use this new information before posting to the ExPusherLite server:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># app/models/pusher_event.rb</span><tt>
</tt><span style="color:#080;font-weight:bold">class</span> <span style="color:#B06;font-weight:bold">PusherEvent</span><tt>
</tt>  include <span style="color:#036;font-weight:bold">ActiveModel</span>::<span style="color:#036;font-weight:bold">Model</span><tt>
</tt><tt>
</tt>  attr_accessor <span style="color:#A60">:name</span>, <span style="color:#A60">:message</span>, <span style="color:#A60">:broadcast</span><tt>
</tt>  validates <span style="color:#A60">:name</span>, <span style="color:#A60">:message</span>, <span style="color:#808">presence</span>: <span style="color:#038;font-weight:bold">true</span><tt>
</tt><tt>
</tt>  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">save</span><tt>
</tt>    topic = <span style="color:#080;font-weight:bold">if</span> broadcast == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">1</span><span style="color:#710">"</span></span><tt>
</tt>              <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#general</span><span style="color:#710">"</span></span><tt>
</tt>            <span style="color:#080;font-weight:bold">else</span><tt>
</tt>              <span style="color:#036;font-weight:bold">Rails</span>.application.secrets.pusher_channel<tt>
</tt>            <span style="color:#080;font-weight:bold">end</span><tt>
</tt><tt>
</tt>    <span style="color:#036;font-weight:bold">Net</span>::<span style="color:#036;font-weight:bold">HTTP</span>.post_form(<span style="color:#036;font-weight:bold">PusherLite</span>.uri, {<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">topic</span><span style="color:#710">"</span></span> =&gt; topic,<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">event</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>,<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">scope</span><span style="color:#710">"</span></span> =&gt; <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">public</span><span style="color:#710">"</span></span>,<tt>
</tt>      <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">payload</span><span style="color:#710">"</span></span> =&gt; {<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">name</span><span style="color:#710">"</span></span> =&gt; name, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">message</span><span style="color:#710">"</span></span> =&gt; message}.to_json<tt>
</tt>    })<tt>
</tt>  <span style="color:#080;font-weight:bold">end</span><tt>
</tt><span style="color:#080;font-weight:bold">end</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am just assuming a hard-coded "<tt>#general</tt>" string to serve as the broadcast trigger for the server. Now we must make the server accept this new protocol schema, so let's go back to Elixir.</p>
<p>First we must start with the counterpart for the previous POST trigger, <tt>ExPusherLite.EventsController</tt>:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/controllers/events_controller.ex</span><tt>
</tt> defmodule <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">EventsController</span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>   use <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Web</span>, <span style="color:#A60">:controller</span><tt>
</tt> <tt>
</tt>-  plug <span style="color:#A60">:authenticate</span><tt>
</tt>+  plug <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Authentication</span><tt>
</tt> <tt>
</tt>-  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, params) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>-    topic = params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">topic</span><span style="color:#710">"</span></span>]<tt>
</tt>-    event = params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">event</span><span style="color:#710">"</span></span>]<tt>
</tt>+  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">create</span>(conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="">"app_slug" =&gt; app_slug, "event" =&gt; event, "topic" =&gt; topic, "scope" =&gt; scope</span><span style="color:#710">}</span></span> = params) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>     message = (params[<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">payload</span><span style="color:#710">"</span></span>] || <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">{}</span><span style="color:#710">"</span></span>) |&gt; <span style="color:#036;font-weight:bold">Poison</span>.decode!<tt>
</tt>-    <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Endpoint</span>.broadcast! topic, event, message<tt>
</tt>+    topic_event =<tt>
</tt>+      <span style="color:#080;font-weight:bold">if</span> topic == <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">#general</span><span style="color:#710">"</span></span> <span style="color:#080;font-weight:bold">do</span><tt>
</tt>+        event<tt>
</tt>+      <span style="color:#080;font-weight:bold">else</span><tt>
</tt>+        <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>topic<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">:</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>event<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span><tt>
</tt>+      <span style="color:#080;font-weight:bold">end</span><tt>
</tt>+    <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Endpoint</span>.broadcast! <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>scope<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="">:</span><span style="background:#ddd;color:black"><span style="background:#ddd;font-weight:bold;color:#666">#{</span>app_slug<span style="background:#ddd;font-weight:bold;color:#666">}</span></span><span style="color:#710">"</span></span>, topic_event, message<tt>
</tt>     json conn, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style="color:#710">}</span></span><tt>
</tt>   <span style="color:#080;font-weight:bold">end</span><tt>
</tt>   ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>The first difference is that I am pattern matching from the arguments directly to the "topic" and "event" variables. This function is also aware of the "<tt>#general</tt>" string the client can send to indicate an app-wide broadcast. And the new topic is the concatenation of "topic" and "event" to allow for "channel-only" messages.</p>
<p>To connect this all to the WebSocket handler, we must make the following changes:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"><span style="color:#888"># web/channels/room_channel.ex</span><tt>
</tt>-  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_in</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload, socket = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style=""> topic: "public:" &lt;&gt; _ </span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>-    broadcast socket, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload<tt>
</tt>+  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_in</span>(topic_event, payload, socket = <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">%{</span><span style=""> topic: "public:" &lt;&gt; _ </span><span style="color:#710">}</span></span>) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>+    broadcast socket, topic_event, payload<tt>
</tt>     { <span style="color:#A60">:noreply</span>, socket }<tt>
</tt>   <span style="color:#080;font-weight:bold">end</span><tt>
</tt> <tt>
</tt>-  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_in</span>(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload, socket) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>+  <span style="color:#080;font-weight:bold">def</span> <span style="color:#06B;font-weight:bold">handle_in</span>(topic_event, payload, socket) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>     claims = <span style="color:#036;font-weight:bold">Guardian</span>.<span style="color:#036;font-weight:bold">Channel</span>.claims(socket)<tt>
</tt>     <span style="color:#080;font-weight:bold">if</span> permitted_topic?(claims[<span style="color:#A60">:publish</span>], socket.topic) <span style="color:#080;font-weight:bold">do</span><tt>
</tt>-      broadcast socket, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">msg</span><span style="color:#710">"</span></span>, payload<tt>
</tt>+      broadcast socket, topic_event, payload<tt>
</tt>       { <span style="color:#A60">:noreply</span>, socket }<tt>
</tt>   ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, the Channel does not pattern match on a specific event, it let it through without further validation, trusting that the EventsController is doing the right thing. I will come back to this piece for improvements in the future, possibly.</p>
<h3>Deploying our first Phoenix app to Heroku!</h3>
<p>In this section we will just follow the <a href="https://www.phoenixframework.org/docs/heroku">official documentation</a>, so read it if you want more details.</p>
<p>Let's get started:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">heroku apps:create your-expusherlite --buildpack "https://github.com/HashNuke/heroku-buildpack-elixir.git"<tt>
</tt>heroku buildpacks:add https://github.com/gjaldon/heroku-buildpack-phoenix-static.git<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am naming the application "your-expusherlite" but you should change it to your own name, of course. And the rest of the configuration data are all examples that you must change for you own needs.</p>
<p>Heroku relies on environment variables. So we start by erasing "<tt>config/prod.secret.exs</tt>" and change "<tt>config/prod.exs</tt>" to look like this:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">config <span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Endpoint</span>,<tt>
</tt>  <span style="color:#808">http</span>: [<span style="color:#808">port</span>: {<span style="color:#A60">:system</span>, <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PORT</span><span style="color:#710">"</span></span>}],<tt>
</tt>  <span style="color:#808">url</span>: [<span style="color:#808">scheme</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">https</span><span style="color:#710">"</span></span>, <span style="color:#808">host</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">your-expusherlite.herokuapp.com</span><span style="color:#710">"</span></span>, <span style="color:#808">port</span>: <span style="color:#00D;font-weight:bold">443</span>], <span style="color:#808">force_ssl</span>: [<span style="color:#808">rewrite_on</span>: [<span style="color:#A60">:x_forwarded_proto</span>]],<tt>
</tt>  <span style="color:#808">cache_static_manifest</span>: <span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">priv/static/manifest.json</span><span style="color:#710">"</span></span>,<tt>
</tt>  <span style="color:#808">secret_key_base</span>: <span style="color:#036;font-weight:bold">System</span>.get_env(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">SECRET_KEY_BASE</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt><span style="color:#888"># Configure your database</span><tt>
</tt>config <span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#036;font-weight:bold">ExPusherLite</span>.<span style="color:#036;font-weight:bold">Repo</span>,<tt>
</tt>  <span style="color:#808">adapter</span>: <span style="color:#036;font-weight:bold">Ecto</span>.<span style="color:#036;font-weight:bold">Adapters</span>.<span style="color:#036;font-weight:bold">Postgres</span>,<tt>
</tt>  <span style="color:#808">url</span>: <span style="color:#036;font-weight:bold">System</span>.get_env(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">DATABASE_URL</span><span style="color:#710">"</span></span>),<tt>
</tt>  <span style="color:#808">pool_size</span>: <span style="color:#00D;font-weight:bold">20</span><tt>
</tt><tt>
</tt>config <span style="color:#A60">:ex_pusher_lite</span>, <span style="color:#A60">:admin_authentication</span>,<tt>
</tt>  <span style="color:#808">username</span>: <span style="color:#036;font-weight:bold">System</span>.get_env(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PUSHER_ADMIN_USERNAME</span><span style="color:#710">"</span></span>),<tt>
</tt>  <span style="color:#808">password</span>: <span style="color:#036;font-weight:bold">System</span>.get_env(<span style="background-color:#fff0f0;color:#D20"><span style="color:#710">"</span><span style="">PUSHER_ADMIN_PASSWORD</span><span style="color:#710">"</span></span>)<tt>
</tt><tt>
</tt><span style="color:#888"># remove this line:</span><tt>
</tt><span style="color:#888"># import_config "prod.secret.exs"</span><tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now we must configure the environment variavles "SECRET_KEY_BASE", "PUSHER_ADMIN_USERNAME" and "PUSHER_ADMIN_PASSWORD". Use the included "<tt>mix phoenix.gen.secret</tt>" to generate those.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">heroku config:set SECRET_KEY_BASE="`mix phoenix.gen.secret`"<tt>
</tt>heroku config:set PUSHER_ADMIN_USERNAME="FPO0QUkqbAP6EGjElqBzDQuMs8bhFS3"<tt>
</tt>heroku config:set PUSHER_ADMIN_PASSWORD="n78DPGmK3DBQy8YAVyshiGqcXjjSXSD"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then it's just a matter of waiting for the good old "<tt>git push heroku master</tt>" to finish compiling everything in the first time. And because this is the first deploy you should not forget to run "<tt>heroku run mix ecto.migrate</tt>" to create the database table.</p>
<p>Now, if I did everything right, as an Administrator that knows the above hardcoded secrets I should be able to create a new Application like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">curl --data "app[name]=shiny-new-app" https://FPO0QUkqbAP6EGjElqBzDQuMs8bhFS3:n78DPGmK3DBQy8YAVyshiGqcXjjSXSD@your-expusherlite.herokuapp.com/api/admin/apps<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is the result I got!</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">{"data":{"slug":"shiny-new-app","secret":"42560373-0fe1-506e-28ca-35ab5221fb3d","name":"shiny-new-app","key":"958c16e7-ab93-dac0-0fc6-6cb864e26358","id":1,"active":true}}<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Great, now that we have a valid Application key and secret we can configure our Rails Client Demo and deploy it to Heroku as well.</p>
<h3>Deploying the Rails Client to Heroku</h3>
<p>This is a simple Rails application, we can just create the app and deploy right away:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">heroku create your-expusherlite-client<tt>
</tt>heroku config:set PUSHER_URL=your-expusherlite.herokuapp.com<tt>
</tt>heroku config:set PUSHER_APP_ID=shiny-new-app<tt>
</tt>heroku config:set PUSHER_KEY=958c16e7-ab93-dac0-0fc6-6cb864e26358<tt>
</tt>heroku config:set PUSHER_SECRET=42560373-0fe1-506e-28ca-35ab5221fb3d<tt>
</tt>heroku config:set PUSHER_CHANNEL=shiny-new-topic<tt>
</tt>git push heroku master<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I'm assuming the readers of this post already know how to configure a Rails app properly for Heroku. Just to mention it, I configure this app with the 12 factor and Puma gems and added a proper Procfile. Another very small change was changing the "pusher_lite.rb" initializer to create a URI with "https" because the ExPusherLite we deployed to production requires SSL by default.</p>
<p>There is one more caveat. Being led by experienced web programmers, they made sure that, unlike this bare bone exercise here, the Phoenix framework itself is secure. One such example is to disallow Websocket connections from different hosts.</p>
<p>Out of the box, the "phoenix.js" Socket will fail connection when we try to connect from the "your-expusherlite-client.herokuapp.com" Rails app host to the Phoenix app in "your-expusherlite.herokuapp.com" with the following error:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">WebSocket connection to 'wss://your-expusherlite.herokuapp.com/socket/websocket?guardian_token=N_YCG6hGK7…iOlsicHVibGljOioiXX0._j6s2LiaKde9rBhnTMxDkm0XV5u89pNh1AdLFY6Rlt8&amp;vsn=1.0.0' failed: Error during WebSocket handshake: Unexpected response code: 403<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And in the Phoenix log we will see this very helpful message:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[error] Could not check origin for Phoenix.Socket transport.<tt>
</tt><tt>
</tt>This happens when you are attempting a socket connection to<tt>
</tt>a different host than the one configured in your config/<tt>
</tt>files. For example, in development the host is configured<tt>
</tt>to "localhost" but you may be trying to access it from<tt>
</tt>"127.0.0.1". To fix this issue, you may either:<tt>
</tt><tt>
</tt>  1. update [url: [host: ...]] to your actual host in the<tt>
</tt>     config file for your current environment (recommended)<tt>
</tt><tt>
</tt>  2. pass the :check_origin option when configuring your<tt>
</tt>     endpoint or when configuring the transport in your<tt>
</tt>     UserSocket module, explicitly outlining which origins<tt>
</tt>     are allowed:<tt>
</tt><tt>
</tt>        check_origin: ["https://example.com",<tt>
</tt>                       "//another.com:888", "//other.com"]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Unless you know what a <a href="https://www.christian-schneider.net/CrossSiteWebSocketHijacking.html">Cross-Site Web Socket Hijacking</a> you will prefer to keep the default settings as they are. In a green-field Phoenix app, the Web part will connect to the Web Socket in the same app and, therefore, in the same host, so this is not an issue.</p>
<p>In this case I am making a separated micro-service to mimick Pusher.com behavior so it should be able to accept Web Socket connections from different hosts.</p>
<p>If you control the applications being created, you will likely prefer to make the "<tt>check_origin</tt>" setting read from your database for the exact hosts. As a feature for next time I could add a "host" field in the "App" model and use it to validate connections in the transport configuration. For the time being I will just make it accept any hosts:</p>
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
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># web/channels/user_socket.ex<tt>
</tt>defmodule ExPusherLite.UserSocket do<tt>
</tt>  use Phoenix.Socket<tt>
</tt><tt>
</tt>  ## Channels<tt>
</tt>  channel "*", ExPusherLite.RoomChannel<tt>
</tt><tt>
</tt>  ## Transports<tt>
</tt>  transport :websocket, Phoenix.Transports.WebSocket, check_origin: false<tt>
</tt>  ...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And this is it! Now the Rails app should be able to connect and send messages! And you should be able to create any number of new apps and connect all of them to this same service.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/534/big_Screenshot_from_2015-12-14_14_58_22.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/534/Screenshot_from_2015-12-14_14_58_22.png 2x" alt="Final Heroku Client"></p>
<h3>Conclusion</h3>
<p>Right now, we have a functional, albeit bare-bone, Pusher.com clone that will work for any number of use cases where Pusher.com would be used.</p>
<p>As I warned many times before, the security part is still flaky and needs working. I will still extend on what Daniel began with Guardian to authenticate Web Socket users to private channels as well. And the core should also receive auditing and reporting capabilities (to be able to report usage, number of active connections, throughput of events, keep at least a short history of events so new connections can retrieve the last sent messages, and so on).</p>
<p>But from here it's a matter of adding features to an already working core. And this is nothing more than Phoenix out-of-the-box without too much added on top of it! It says a lot of the current state of maturity of this very capable framework.</p>
<p>In terms of performance, for this very simple example, I spinned up 1 free Heroku dyno for each app.</p>
<p>The Rails app is able to respond to the front-end user interface in around 2ms. And the Sucker Punch job - which does the heavy HTTP POST to ExPusherLite - takes in the order of 30ms or less.</p>
<p>The Phoenix server receives the HTTP POST and performs the broadcast in around less than 6ms. Also quite fast. The times will vary a lot because I believe the free dyno is not only slow but also stays in highly shared metal boxes, getting impact from other neighbor apps running in the same box.</p>
<p>Because we already have an administrative API to create and manage apps (create new ones, delete, update, etc) we can already create a separated application in any other framework to make a dashboard for admins or for a self-serving front-end for developers to register new apps and receive key/secret pair to add in their own applications.</p>
<p>Both the ExPusherLite server and the demo client are deployed in Heroku and you can test the client right now <a href="https://expusherlite-client.herokuapp.com/">clicking here</a>. The admin keys are different from what I showed in this post, of course, so you won't be able to create new apps, but you can deploy it yourself to your own environment.</p>
<p></p>
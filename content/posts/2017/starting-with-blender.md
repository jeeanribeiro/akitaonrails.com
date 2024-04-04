---
title: "Starting with Blender"
date: "2017-06-21T20:32:00.000Z"
tags: ["blender"]
years: "2017"
---

<p></p>
<p>Blender is a beast. A true marvel of open source technology achievement, you should applaud everyone that have been involved in making this thing work as well as it does. It rivals the most expensive commercial options out there, from Maya to the venerable Pixar's Renderman.</p>
<p>The Blender community is so passionate and committed that they frequently produce high quality, almost hollywood grade, <a href="http://archive.blender.org/features-gallery/movies/">short movies</a> within Blender in order to stress test the tool, fix bottlenecks and usability issues in a real world workflow.</p>
<p>This is primarily a post intended for "future me" to be able to jump back into a single resource list. As being a 3D modeler is not my full time job, I will have large hiatus between Blender sessions and I know I will regret if I don't dump by brain into a post while still fresh :-)</p>
<p></p>
<p></p>
<h3>Beginner First Steps</h3>
<p>First things first. If you're in this blog, you're probably a programmer. And let me tell you that the Graphics folks have things very different from what we, programmers, usually think of as "usability". The sheer ammount of customization, options, shortcuts and combinations will rival even Vim and Emacs users out there.</p>
<p>Oh, by the way, you're required to have a proper 3-button mouse. Touchpads are useless with Blender. The Mac mouse is terrible with Blender. <a href="https://www.dell.com/br/mouse">Any cheap PC mouse will do.</a> And out of the box, the main button is the right-sided one, not our usual left-sided button! You should change that in the <a href="https://docs.blender.org/manual/en/dev/preferences/input.html">user preferences</a> to select with Left. Now, things start to work. While on that, you should also enable the Numpad emulation. Oh yeah, you should get a keyboard with a numpad or even a separated numpad for extra smoothness. You can use the number row on top of your normal keyboard, but Blender was built with both an inverted 3-button mouse and</p>
<p><a href="https://docs.blender.org/manual/en/dev/preferences/input.html"><img src="https://docs.blender.org/manual/en/dev/_images/preferences_input_tab.png" srcset="https://docs.blender.org/manual/en/dev/_images/preferences_input_tab.png 2x" alt="Input User Preferences"></a></p>
<p>If you have never studied Blender before, you will not figure things out just by randomly exploring the UI. The UI is useless until someone teaches you the ins and outs. There are hundreds of terms you just have no idea what they mean, such as Meshes, Edges, Seams, Nodes, Viewport, Subsurface, Modifiers, etc.</p>
<p>The main thing you MUST do before proceding is watching this entire 9 part series from Blender Guru, called <a href="https://www.youtube.com/watch?v=VT5oZndzj68&amp;list=PLjEaoINr3zgHs8uzT3yqe4iHGfkCmMJ0P">Blender Beginner Tutorial Series</a>. Optionally you can slowly do the <a href="https://www.youtube.com/watch?v=Mwzz-Y6t-v8&amp;list=PLjEaoINr3zgEgoyYWE0Yit-cVoZ60WGtt">Intermediate Blender Tutorials</a> later.</p>
<p>The Beginner Series will teach you enough so you will finally start feeling confident with the UI and tools. And don't forget to print and hang this useful <a href="https://www.blenderguru.com/articles/free-blender-keyboard-shortcut-pdf">"cheat sheet"</a>, you won't believe how easier your life becomes once you get used to the most important keyboard shortcuts.</p>
<h3>Better Defaults</h3>
<p>For historical reasons, somethings are not how they should be. Knowledge in the 3D rendering field is evolving very fast.</p>
<p>The very first thing to do: <a href="https://wiki.blender.org/index.php/Doc:2.6/Tutorials/Rendering/Cycles">change</a> the default render engine from Blender Render to the Cycles Raytracing Engine.</p>
<p>Then, color grading. The default sRGB EOTF is basically wrong. You must download Sobotka's <a href="https://sobotka.github.io/filmic-blender/">filmic-blender</a> configuration. If you're in Arch Linux you can basically do:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">pacaur -S filmic-blender-git<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I created a script at <code>~/bin/filmic-blender</code> with this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">env OCIO=/usr/share/blender/2.78/datafiles/filmic-blender/config.ocio blender<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And I always start Blender from the terminal like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">optirun ~/bin/filmic-blender<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This does 2 things: first pre-configure the OpenColorIO to use the Filmic replacement. Second it enabled the external GPU of my notebook to be availble to Blender. Read my post on <a href="https://www.akitaonrails.com/2017/03/14/enabling-optimus-nvidia-gpu-on-the-dell-xps-15-with-linux-even-on-battery">"Enabling Optimus NVIDIA GPU on the Dell XPS 15 with Linux, even on Battery"</a> for more details. On Windows or Mac, this is not necessary but you will still need to load the filmic configuration though.</p>
<p>Then, on the Scene tab you must reconfigure "Color Management" to be like this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/636/Screenshot_from_2017-06-21_16-31-05.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/636/Screenshot_from_2017-06-21_16-31-05.png 2x" alt="Color Management"></p>
<p>Then you need to configure Cycles. If you're on Linux and Optimus is correctly installed as I explained before, you should have the CUDA option enabled in the User Preferences:</p>
<p><a href="https://docs.blender.org/manual/en/dev/preferences/system.html"><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/637/Screenshot_from_2017-06-21_16-43-29.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/637/Screenshot_from_2017-06-21_16-43-29.png 2x" alt="System preferences"></a></p>
<p>In the Render tab, you should have something like this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/638/Screenshot_from_2017-06-21_16-45-32.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/638/Screenshot_from_2017-06-21_16-45-32.png 2x" alt="Render configuration"></p>
<p>In the Dimensions section, you will notice that it has the Full HD (1920x1080 px) size but only 50% (so it will only render half the size). Increase it to 100%. If you want a 4K shot, increase the dimensions to 3840x2160 px. 4K makes it 4 times slower to render than 1080p, obviously.</p>
<p>In the Performance section you will see 2 input fields for "Tile size". Blender will slice your full image into tiles. Each tile will render in parallel in a available CPU or GPU core. My notebook has 8 CPU cores. 64 is a good size because it will render 8 tiles of 64 pixels each in parallel. The less cores you have, the larger you should make the tile sizes. For my NVIDIA GPU, I only have 2 available cores (and not a lot of video memory as well!), you should increase both fields to 512. On the GPU it will only render 2 tiles at once, so increasing it will optimize the render.</p>
<p>As you probably guessed, Blender Guru has a very useful <a href="https://www.youtube.com/watch?v=8gSyEpt4-60&amp;t=204s">"18 ways to speed up Cycles Rendering"</a> tutorial.</p>
<p>These should cover the basic defaults.</p>
<h3>You must think as a Photographer!</h3>
<p>You will want to watch A LOT of online tutorials, because it's really not obvious how to best use the tools. Another channel I really like is <a href="https://www.youtube.com/watch?v=lY6KPrc4uMw&amp;list=PLda3VoSoc_TR7X7wfblBGiRz-bvhKpGkS">BornCG</a> and <a href="https://www.youtube.com/channel/UCCxay0KiyLlawfgoZ2mVnNQ">CG Masters</a>. Pick a few of his videos to have a more in-depth view on specific tools, modeling techniques and so on.</p>
<p>And really, you must exercise as much as possible while also studying a lot along the way. One important area is Photography. This is what you see when you select the Camera tab:</p>
<p><a href="https://docs.blender.org/manual/en/dev/render/blender_render/camera/object_data.html"><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/639/Screenshot_from_2017-06-21_16-55-09.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/639/Screenshot_from_2017-06-21_16-55-09.png 2x" alt="Camera settings"></a></p>
<p>There is a lot of customization you can do here, but for example. Focal length: 35.00. This is what photographers know as a 35mm lens. It's a good default choice. But you can use really wide angle such as 200mm or 300mm. Indoor shots, in small rooms, could use a 24mm or even 18mm lens. This article <a href="https://www.cambridgeincolour.com/tutorials/camera-lenses.htm">"Understanding Color Lenses"</a> should give you the basics.</p>
<p>Then, you must understand "Depth of Field". This can be done at this configuration before rendering, or you can simulate it after rendering (if you chose to separate the render in layers), in the <a href="https://wiki.blender.org/index.php/Doc:2.6/Tutorials/Composite_Nodes/Setups/Depth_Of_Field">Compositor</a>.</p>
<p>Speaking of which, another way to control Depth of Field is reconfiguring "f-stop", which is the measurement of exposure, or aperture. The default is "128.0" which is "f/128". As a reference, your iPhone 7s camera has a f/2.2 aperture. Again, let's study more about this starting with the article <a href="https://www.bhphotovideo.com/explora/photography/tips-and-solutions/what%E2%80%99s-best-f-stop">"What's the Best F-Stop?"</a></p>
<p>Taking a photo (or rendering a still, in our case) is a whole lot more than just point-and-click. You also have to worry about proper composition techniques such as the <a href="https://www.photographymad.com/pages/view/rule-of-thirds">Rule of Thirds</a>, the <a href="https://www.makeuseof.com/tag/golden-ratio-photography/">golden ratio</a>, and so on. You can change that in the "Composition Guides" combo box as shown above.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/641/3911f4657078a19b4f3677a304e7451d.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/641/3911f4657078a19b4f3677a304e7451d.jpg 2x" alt="Golden Ratio Composition"></p>
<p>You really should dive deep into the field of Photography to improve the final result of the renders. I am an amateur and it's really exciting to be able to apply real world techniques into 3D rendering.</p>
<h3>Material Design and Physically-Based Render (PBR)</h3>
<p>The golden standard in 3D modeling and rendering is certainly <a href="https://renderman.pixar.com/view/renderman">Disney/Pixar RenderMan</a>. Every award winning Pixar movie was made with it.</p>
<p>But Blender learns fast. Every Pixar paper eventually becomes part of Blender itself. For example, material design is one aspect that has been quite cumbersome in Blender. I did some of the tutorials myself and to create the materials with the proper real world characteristics such as proper Fresnel, proper dialectric x metallic, etc was a challenge.</p>
<p>If you subscribed to Blender Guru's channel you should really watch the tutorials <a href="https://www.youtube.com/watch?v=V3wghbZ-Vh4&amp;t=2668s">"How to Make Photorealistic PBR Materials - Part 1"</a> and <a href="https://www.youtube.com/watch?v=m1PkSViBi-M">"Part 2"</a>. And you will end up with this complicated Nodes configuration for PBR materials:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/640/Screenshot_from_2017-06-21_17-25-46.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/640/Screenshot_from_2017-06-21_17-25-46.png 2x" alt="PBR Materials - Node Editor"></p>
<p>And Blender Guru just posted a new video introducing a new feature for the upcoming Blender 2.79 (currently at 2.78), the implementation of <a href="https://disney-animation.s3.amazonaws.com/library/s2012_pbs_disney_brdf_notes_v2.pdf">"Physically-Based Shader at Disney"</a> paper as a proper and optimized new Blender Shader named "Principled Shader". It's quite literally the <a href="https://www.youtube.com/watch?v=4H5W6C_Mbck">Ultimate Shader</a> as it makes creating and customizing realistic materials <strong>very</strong> easy, and compatible with Renderman and Substance.</p>
<h3>Conclusion</h3>
<p>I am still a beginner at Blender, there is a very long road to walk here. But it's a very exciting environment and I am learning tons of new and useful stuff all the time. Anyone should try it!</p>
<p>Over time I hope I find the time to integrate the Blender workflow with other tools such as Unreal Engine or Unity3D to create interactive stuff as well.</p>
<p>This is by no means a complete tutorial or reference. The idea was to highlight a few things that are not immediatelly obvious when you start with Blender and that can give you a broader sense of what Blender can do.</p>
<p>If you want to go really in-depth in the customization, watch this CG Master setup video:</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/-_BZasG_UDA" frameborder="0" allowfullscreen=""></iframe>
<p></p>
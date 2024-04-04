---
title: "From the Macbook Pro to the Dell XPS. Arch Linux for Creative Pro Users"
date: "2017-01-31T20:26:00.000Z"
tags: ["archlinux", "nvidia", "blender", "darktable", "bumblebee"]
years: "2017"
---

<p></p>
<p>As I've been reporting many posts ago, I'm switching to Linux full-time. In this article I'd like to show how to configure Arch Linux so it's suitable for Creative <strong>Pro</strong> Users, where the access to the secondary GPU is very important.</p>
<p>If you're a Creative Pro User, you can't really run Final Cut Pro X (with Motion, Compressor), Logic Pro, Adobe's Photoshop and other apps. So you will have to change your workflow if you want to be in the Linux ecossystem. Fortunatelly, for many workflows Linux apps have matured quite nicely and you don't need to settle for low quality, "hack-ish" software.</p>
<p>Software developers don't ever need more than the cheap Intel integrated graphics, unless you want to install <a href="https://wiki.archlinux.org/index.php/Steam/Wine">Steam through Wine</a> to play some demanding games.</p>
<p>After a lot of research (a.k.a. <a href="https://www.youtube.com/results?search_query=Dell+XPS+15+9550+review">YouTube!</a>) I've settled for the Dell XPS 15" (9550 model). It's an almost 1 year old SkyLake architecture using the NVIDIA Optimus Hybrid Intel + GTX960M.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/612/20170127_133009.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/612/20170127_133009.jpg 2x" alt="Dell XPS 15&quot; 9550"></p>
<p></p>
<p></p>
<p>To this day, nothing can beat the software+hardware cohesiveness of Apple. This can't be underestimated. The PC/Windows world is a lot better it's still plagued with unstable BIOS, unstable drivers, etc. If you're on Linux, it's even worse.</p>
<p>Here's the first <strong>protip</strong>: avoid super brand new models, most of them won't have stable drivers even for Windows 10, let alone Linux. Let the Windows guys suffer the first couple of months; give Dell, <a href="https://windowsreport.com/nvidia-driver-crash-windows-10/">NVIDIA</a> and Intel time to fix the mess releasing more stable BIOS firmware and drivers. If you really want to buy one of the 2017 brand new Kaby Lake models, you're in a russian roulette situation. Even first generation Macbook models usually <a href="https://www.digitaltrends.com/computing/apple-releases-macos-sierra-10123-update/">present trouble</a>. As a rule of thumb, do not buy on day 1, wait at the very least 3 months. You are warned.</p>
<p>Out of all the early-2016 machines that most Linux distros can support reasonably well, I believe the <a href="https://www.anandtech.com/show/10116/the-dell-xps-15-9550-review">Dell XPS</a> series, <a href="https://www.anandtech.com/show/10697/the-lenovo-thinkpad-x1-yoga-review">Lenovo Thinkpad X1 Yoga</a>, and possibly <a href="https://www.digitaltrends.com/computing/dell-xps-15-vs-asus-zenbook-pro-ux501-battle-of-the-plus-sized-premiums/">Asus Zenbook Pro</a> and <a href="https://laptopmedia.com/review/hp-probook-450-g3-455-g3-review-what-a-budget-business-notebook-should-look-like/">HP ProBook</a> are quite good nowadays.</p>
<p>But in most categories, the XPS series is the one to beat. Dell really did a pretty good job this time around.</p>
<p>The keyboard, as with most PCs, is mediocre, plastic-y, a little bit wobbly, with good enough travel but with a sudden hard click without enough resistence. For 99% of the people I believe it's fairly good, but not so much for really fast touch-typists.</p>
<p>The touchpad is one of the best in any PC notebook, but then again, most PC touchpads are shamelessly bad, specially with gestures more complicated than a 2 finger scroll. This is another area where the Mac is still untouched. That said, the Dell one is serviceable and should work well enough, with a few undetected palm rejection that will annoy you now and then.</p>
<p>Display monitor is a different story: the XPS 15's gorgeous 4K IPS display is superb, far surpassing the Macbook's Retina Displays. Samsung PCIe NVMe M.2 SSDs is also the best in it's class. The aluminum enclosure is simple but well machined, and the carbon fiber finish is a welcome addition to make a machine that you can really enjoy and be proud to carry around.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/613/20170124_211855.jpg" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/613/20170124_211855.jpg 2x" alt="Dell XPS Display"></p>
<p>If you don't want to tinker with the hardware configuration too much, usually the safest bet is installing Ubuntu and even then <a href="https://ubuntuforums.org/showthread.php?t=2317843">it's not</a> going to be perfect.</p>
<p>Specially with HiDPI displays (over Full-HD) Linux is still lagging behind. GNOME, KDE kinda support it, but other desktop environments have mixed results, and old applications are still not supporting it as they should. If you're using LTS distros with old packages, you will find a few applications doing HiDPI wrong. <a href="https://bugs.documentfoundation.org/show_bug.cgi?id=99508">Libreoffice</a> and <a href="https://community.spotify.com/t5/Desktop-Linux-Windows-Web-Player/Linux-client-barely-usable-on-HiDPI-displays/td-p/1067272">Spotify</a> to name a few. And if you're like me, using a multi monitor with different DPIs, you're out of luck. Either you're using the notebook with the lid closed (so you only have one external monitor to worry about) or you will have the texts all super small in the HiDPI primary monitor in order to have the correct DPI in the second external monitor. One fallback is to configure the 4K display to downscale to Full-HD (1080p). And then again, what's the point of having a 4K display if you can't use it properly? So, do not buy the 4K unless you understand this.</p>
<p>Both MacOS and Windows handle this situation far better. And in MacOS I never experienced any HiDPI problem. Not once. Apple was much better pushing a higher standard than the rest of the industry, and this cohesiveness and no need to tinker drivers and configuration is super valuable. With Macs, you can really just boot and use. With Windows, you're probably mostly ok unless there are driver issues. And with Linux, you must expect a fair amount of tinkering to have the basis covered.</p>
<p>New PC notebooks are also coming with several weird configurations that makes sense for Windows, but that makes Linux distros struggle a bit. Every time you must start by configuring the BIOS to disable stuff like Secure Boot, changint to AHCI issues, etc. So let's dive right into it.</p>
<h3>BIOS Setup</h3>
<p>The very first thing you must do is change BIOS settings. F2 your way into the setup when the Dell logo shows up and make the following changes:</p>
<ul>
  <li>General - Advanced Boot Options - Enable Legacy Option ROMs</li>
  <li>General - Boot Sequence - Legacy (UEFI is the default)</li>
  <li>System Configuration - SATA Operation - AHCI (default is RAID On)</li>
  <li>System Configuration - Touchscreen (disable, as it's mostly unnecessary and it eats up more battery)</li>
  <li>Security - Secure Boot - Secure Boot Enable - Disabled</li>
  <li>POST Behavior - Fastboot - Through (default is minimal)</li>
</ul>
<p>By doing these changes, the pre-installed Windows 10 will not boot anymore, so make sure you don't need it before doing this.</p>
<h3>Kernel Tweaks</h3>
<p>You should follow the <a href="https://bit.ly/2jzVAxE">Dell XPS (9550) Wiki</a> Page.</p>
<p>The 4K Display may flicker a bit, and to avoid it you must edit Grub configuration file <code>/boot/grub/grub.cfg</code> and append the following line with the specific flags:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">GRUB_CMDLINE_LINUX_DEFAULT="... i915.edp_vswing=2 i915.preliminary_hw_support=1 intel_idle.max_cstate=1 acpi_backlight=vendor acpi_osi=Linux"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>That line already exists with some flags, don't erase them, just append the additional configuration and don't forget to run the following:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo grub-mkconfig -o /boot/grub/grub.cfg<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>For the most part, all the rest will work just fine, but just to be safe I installed the <a href="https://wiki.archlinux.org/index.php/Powertop">Powertop</a> and acpid packages as well.</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -S powertop acpid<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am happy to report that I can close the notebook's lid and the OS will properly suspend, and when I open it up it comes back from sleep, saving battery and saving me the trouble of having to reboot every day.</p>
<h3>Arch Distros - Manjaro to the rescue</h3>
<p>I am becoming an Arch enthusiast myself, but to tweak it to work on a modern notebook is just too much work. I don't recommend trying if you're in a hurry. I tried <a href="https://arch-anywhere.org/">Arch Anywhere</a>, but it can't even go through the disk partitioning stage (it doesn't like the SSD or SATA setup). I tried <a href="https://antergos.com/">Antergos</a> but for some reason Gnome Online Accounts didn't work properly there, even if I try to reinstall it. Finally I settled for <a href="https://manjaro.org/">Manjaro</a>, which installed and worked without any major issues.</p>
<p>There are several distros based on Arch. Arch Anywhere and Antergos are mostly Arch "installers" where the main repository sources are still vanilla Arch and they try to make the install process easier than you having to find your way through a bare bone command line shell.</p>
<p>Manjaro is more of an independent distro, where the main sources point to Manjaro first, so they can test the most recent packages and hold on to them for a bit longer so rogue packages don't break your system too often. But you still have raw access to AUR packages. The main selling point being a <strong>much</strong> better installer with a more sofisticated auto-partitioning software than Arch Anywhere and their own Hardware Detection software <a href="https://wiki.manjaro.org/index.php?title=Manjaro_Hardware_Detection_Overview">MHWD</a>.</p>
<p>For the most part it did work properly although I still had to tweak the Graphics configuration as it opts for the open source Nouveau drivers first. Trust me: opt for the proprietary binaries.</p>
<p>If you're also a software developer, you will want to read my <a href="https://www.akitaonrails.com/2017/01/10/arch-linux-best-distro-ever">previous post on Arch</a>.</p>
<h3>Optimus Hybrid Graphics</h3>
<p>The Dell XPS model 9550 uses the <strong>Optimus</strong> Hybrid architecture. <strong>Prime</strong> drivers are for standalone NVIDIA GPUs. But most notebooks work with the integrated Intel Graphics card as the primary and only card (particularly lightweight ultrabooks) and the more "Pro" models bridge it out to a secondary NVIDIA GTX 960M.</p>
<p>If you have only a simple, single Intel graphics, most distros will do the right thing out of the box and install the proper drivers and configuration.</p>
<p>Now, if you have a high-end machine like this XPS 9550 or 9560 (Kaby Lake), you will need more configuring. First you need to understand the terminology:</p>
<ul>
  <li>You need to install Bumblebee. This is a daemon that enables access to the secondary GPU. Just installing Bumblebee solves most problems.</li>
  <li>Then you need to install Primusrun which is a back-end for Bumblebee and you use it to run programs such as Steam in order for it to have access to the secondary GPU.</li>
  <li>Sometimes you will see about Optirun, which nowadays seems to default to Primusrun (otherwise it originally uses a secondary X framebuffer, adding extra overhead).</li>
</ul>
<p>After you have it all installed, it's usually a matter of doing:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">primusrun kdenlive<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>For example, to load the video editor Kdenlive to use OpenGL through the Nvidia GPU. Or to run <a href="https://forum.manjaro.org/t/newbie-questions-about-hybrid-nvidia-and-intel-gpu-drives-tutorial/2974/26">Steam through Wine</a>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">primusrun wine ~/.wine/drive_c/Program\ Files\ (x86)/Steam/Steam.exe<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>As I mentioned before, Manjaro will probably install the Nouveau driver, which is the open source driver. You should install the proprietary binaries, like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo mhwd -a pci nonfree 0300<tt>
</tt>sudo mhwd -r pci video-hybrid-intel-nouveau-bumblebee<tt>
</tt>sudo mhwd -i pci video-hybrid-intel-nvidia-bumblebee<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Again, I am considering the XPS 9550 which has the Intel-Nvidia Optimus/hybrid configuration. Read Manjaro's <a href="https://wiki.manjaro.org/index.php/Configure_Graphics_Cards">Configuring Graphics</a> page on the subject.</p>
<p>I did however stumbled upon a strange problem. I am using <strong>Linux 4.9</strong> kernel:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ uname -a<tt>
</tt>Linux arch42 4.9.6-1-MANJARO #1 SMP PREEMPT Thu Jan 26 12:29:20 UTC 2017 x86_64 GNU/Linux<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This is supposedly the <code>core/linux49 4.9.6-1</code> package. But for some reason the <code>mhwd -i</code> command was installing the <code>linux44-nvidia</code> drivers.</p>
<p>So the Nvidia GPU modules were never being loaded until I manually removed it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -R linux44-nvidia<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And then I manually installed the correct version:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -S linux49-nvidia<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Just to be safe, I uninstalled the <code>linux44</code> package and any other <code>linux44-*</code> package:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -Ss linux44 | grep installed<tt>
</tt># sudo pacman -R linux44-(name of the package)<tt>
</tt>-</pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now I have this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ sudo pacman -Ss linux4 | grep installed<tt>
</tt>core/linux49 4.9.6-1 [installed]<tt>
</tt>extra/linux49-bbswitch 0.8-6 (linux49-extramodules) [installed]<tt>
</tt>extra/linux49-ndiswrapper 1.61-4 (linux49-extramodules) [installed]<tt>
</tt>extra/linux49-nvidia 1:375.26-6 (linux49-extramodules) [installed]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And in the <code>/etc/bumblebee/bumblebee.conf</code> I make sure it explicitly loads the proper <code>nvidia</code> driver (the aforementioned <code>linux49-nvidia</code>), otherwise you have to <code>sudo vim</code> and edit it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ cat /etc/bumblebee/bumblebee.conf | grep Driver<tt>
</tt># The Driver used by Bumblebee server. If this value is not set (or empty),<tt>
</tt>Driver=nvidia<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>At the end, if you load Manjaro Settings Manager, you should see something like this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/614/Screenshot_from_2017-01-31_18-24-34.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/614/Screenshot_from_2017-01-31_18-24-34.png 2x" alt="Settings Manager"></p>
<h3>Professional 3D and Video Editing</h3>
<p>To test out this setup, I started out by installing <a href="https://wiki.archlinux.org/index.php/Blender">Blender</a> (one of the best 3D editing tools in the industry). Then I downloaded a free 3D model and animation, and tried to render cycles through GPU Compute. Just to be safe, I also installed the Cuda package:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -S blender cuda<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If the proper drivers are installed, Blender should detect it and enable usage of its CUDA cores:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/608/Screenshot_from_2017-01-31_17-04-58.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/608/Screenshot_from_2017-01-31_17-04-58.png 2x" alt="CUDA GPU Compute"></p>
<p>You can monitor the Nvidia card with the <code>nvidia-smi</code> command and it will show something like this:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/609/Screenshot_from_2017-01-31_16-43-46.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/609/Screenshot_from_2017-01-31_16-43-46.png 2x" alt="nvidia-smi monitoring"></p>
<p>This should cover Pro 3D modelling if you need.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/615/Screenshot_from_2017-01-31_17-11-18.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/615/Screenshot_from_2017-01-31_17-11-18.png 2x" alt="Blender"></p>
<p>Possibly the best video editing tool available for Linux is <a href="https://kdenlive.org/">Kdenlive</a>. It's the closest you will find to Adobe Premiere or Apple Final Cut Pro.</p>
<p>This is how you must install it:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -S kdenlive ladspa movit sox ffmpeg frei0r-plugins breeze-icons<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And for faster real-time previews, it can be started through Primusrun in a Terminal like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ primusrun kdenlive<tt>
</tt>OpenGL vendor:  "NVIDIA Corporation"<tt>
</tt>OpenGL renderer:  "GeForce GTX 960M/PCIe/SSE2"<tt>
</tt>OpenGL Threaded:  true<tt>
</tt>OpenGL ARG_SYNC:  true<tt>
</tt>OpenGL OpenGLES:  false<tt>
</tt>OpenGL vendor:  "NVIDIA Corporation"<tt>
</tt>OpenGL renderer:  "GeForce GTX 960M/PCIe/SSE2"<tt>
</tt>OpenGL Threaded:  true<tt>
</tt>OpenGL ARG_SYNC:  true<tt>
</tt>OpenGL OpenGLES:  false<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>If I start it without Primerun, it will first detect the Intel graphics:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ kdenlive<tt>
</tt>OpenGL vendor:  "Intel Open Source Technology Center"<tt>
</tt>OpenGL renderer:  "Mesa DRI Intel(R) HD Graphics 530 (Skylake GT2) "<tt>
</tt>OpenGL Threaded:  false<tt>
</tt>OpenGL ARG_SYNC:  true<tt>
</tt>OpenGL OpenGLES:  false<tt>
</tt>OpenGL vendor:  "Intel Open Source Technology Center"<tt>
</tt>OpenGL renderer:  "Mesa DRI Intel(R) HD Graphics 530 (Skylake GT2) "<tt>
</tt>OpenGL Threaded:  false<tt>
</tt>OpenGL ARG_SYNC:  true<tt>
</tt>OpenGL OpenGLES:  false<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>I am not entirely sure, but I believe Kdenlive uses OpenGL to show you real-time previews of the effects you're applying to the video tracks, and that can probably be syphoned through primus into the secondary Nvidia card as well.</p>
<p>Actually Kdenlive, like it's competitor OpenShot, both use the <a href="https://www.mltframework.org/">MLT Multimedia Framework</a> - the engine for non-linear video editing. Finally, MLT uses <a href="https://movit.sesse.net/">movit</a>, which is a high-performance, high-quality video filters for the GPU. The <code>pacman</code> install command I mentioned before takes care of installing those optional packages.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/616/Screenshot_from_2017-01-31_18-29-38.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/616/Screenshot_from_2017-01-31_18-29-38.png 2x" alt="Kdenlive"></p>
<p>And if you want to leverage the Nvidia GPU for even GIMP, there is an ongoing effort to port filters to use <a href="https://wiki.gimp.org/wiki/Hacking:Porting_filters_to_GEGL">GEGL/OpenCL</a>. You can enable GEGL by starting Gimp from the Terminal like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">GEGL_USE_OPENCL=yes gimp<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then, you can use the ported plugins through the <code>Tools - GEGL Operation</code>:</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/610/Screenshot_from_2017-01-31_17-49-30.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/610/Screenshot_from_2017-01-31_17-49-30.png 2x" alt="GEGL Operation"></p>
<p>And if you're a professional photographer, you will want to install <a href="https://www.darktable.org/">Darktable</a>, which is the closest you will get to Apple Aperture or Adobe Lightroom. It's actually quite nice looking and you will be able to properly retouch your photos.</p>
<p>Darktable automatically detects the Nvidia driver and you don't need to run it through Primerun or using any special flag.</p>
<p><img src="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/617/Screenshot_from_2017-01-31_18-31-04.png" srcset="https://d7v6meks67904.cloudfront.net/assets/image_asset/image/617/Screenshot_from_2017-01-31_18-31-04.png 2x" alt="Darktable"></p>
<h3>Final Notes</h3>
<p>You can check if the application is using the GPU by monitoring it with <code>nvidia-smi</code>:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">watch -n 0.5 nvidia-smi<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This will keep monitoring the GPU every half second. And the application will show up in the processes list with a proper PID and you can see the memory usage (my GPU has 2GB of dedicated DRAM), processing usage, temperature (it can get hot at almost 70 degrees Celsius when I was rendering through Blender).</p>
<p>I think this is the most you can get out of your hardware with Pro-level multimedia applications. I am not a professional using Blender, Kdenlive, Darktable, or Gimp, but it's good to know I can use them for my small needs. Pro users will be able to take more advantage of this machine with this configuration.</p>
<p>As I said in the beginning, if you're really a Pro User, always on the move and in need to quickly make changes to you multimedia projects on-the-go, you will probably be better off with Apple's stack, a Macbook Pro with Final Cut Pro. Don't forget that Final Cut Pro and the other Apple Pro software are super optimized for the Mac hardware, being able to export videos orders of magnitude faster than Premiere, for example.</p>
<p>But you may be a Creative Pro User in the Games industry, or even Mobile development, 3D Video Animation or Post Production, or working in a mixed team with software engineers. And having the ability to build your multimedia assets on a Linux platform can make it interesting for future integration workflows.</p>
<p>Even if you're in the Mac or PC world, you will probably want to use software as Blender, which is a respectable competitor or even complement next to award winning tools such as Maya.</p>
<p>So, even though you have to go through some rough edges in the initial installation and configuration, once it's done it should work just fine.</p>
<p></p>
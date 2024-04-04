---
title: "Enabling Optimus NVIDIA GPU on the Dell XPS 15 with Linux, even on Battery"
date: "2017-03-14T17:21:00.000Z"
tags: []
years: "2017"
---

<p></p>
<p>It's been more than a month since my <a href="http://www.akitaonrails.com/2017/01/31/from-the-macbook-pro-to-the-dell-xps-arch-linux-for-creative-pro-users">last post</a> on tuning Manjaro for the Dell XPS 15.</p>
<p>Manjaro released it's newest release <a href="https://manjaro.org/2017/03/07/manjaro-gnome-17-0-released/">version 17</a> and the kernel released 4.10. The upgrade from Manjaro 16 and kernel 4.9 went smoothly.</p>
<p>These are the currently installed, kernel specific packages:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ pacman -Ss 410 | grep installed<tt>
</tt>core/linux410 4.10.1-1 [installed]<tt>
</tt>core/linux410-headers 4.10.1-1 [installed]<tt>
</tt>extra/linux410-acpi_call 1.1.0-0.7 (linux410-extramodules) [installed]<tt>
</tt>extra/linux410-bbswitch 0.8-0.7 (linux410-extramodules) [installed]<tt>
</tt>extra/linux410-ndiswrapper 1.61-0.7 (linux410-extramodules) [installed]<tt>
</tt>extra/linux410-nvidia 1:375.39-0.7 (linux410-extramodules) [installed]<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And to make sure everything is ok, I removed the old 4.9 related packages:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">sudo pacman -R linux49 linux49-headers linux49-acpi_call linux49-bbswitch linux49-ndiswrapper linux49-nvidia<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p></p>
<p></p>
<p>I also upgraded the system BIOS to the <a href="https://dell.to/2mWmWDg">latest 1.2.19</a> (although many said to stay at 1.2.18 for now, but I didn't downgrade). The BIOS upgrade is quite easy as you just need to have a FAT formatted USB drive and copy the "XPS_9550_1.2.19.exe" file. On boot, you can press F12 and choose the option to upgrade directly from there.</p>
<p>One thing that stopped working was the function keys to control screen brightness. I wasn't able to tweak it back but I can still control the brighness manually from the Terminal using commands like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">xbacklight -inc 20 # to increment<tt>
</tt>xbacklight -dec 20 # to decrement<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then, the most annoying part: the NVIDIA Optimus card.</p>
<p>Suspending the OS works flawlessly most of the time. I can just close the lid, open the other day and the battery stays reasonably at the same level. Kudos to the kernel team for supporting it.</p>
<p>But the power management system turns off the NVIDIA GPU and I can't re-enable it after the machine wakes up, even if I reconnect to a power source. Whenever I try to run something through <code>optirun</code> (which forces the rendering through the NVIDIA GPU instead of the primary integrated Intel GPU) it errors out with this message:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">Could not enable discrete graphics card<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>And the only way to have it running was to connect the power cord and reboot the machine. Then I could use the NVIDIA GPU normally. Rebooting all the time is not slow (thanks to the fast SSD) but it's still annoying to have to reopen every single application every time.</p>
<p>Finally, after a lot of research, I found out how to be able to have the NVIDIA GPU enabled even on battery and after suspend. First, you need to know the PCI ID for the card:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ lspci | grep "NVIDIA" | cut -b -8<tt>
</tt>01:00.0<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Then you need to edit <code>/etc/default/tlp</code> and add that PCI ID to be blacklisted from power management:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt>3<tt>
</tt>4<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }"># Exclude PCI(e) device adresses the following list from Runtime PM<tt>
</tt># (separate with spaces). Use lspci to get the adresses (1st column).<tt>
</tt>#RUNTIME_PM_BLACKLIST="bb:dd.f 11:22.3 44:55.6"<tt>
</tt>RUNTIME_PM_BLACKLIST="01:00.0"<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Reboot, and this is it! Now I can run applications through the NVIDIA card even without being connected to the power cord.</p>
<p>It seems that <a href="https://github.com/linrunner/TLP/issues/244">there is a conflict</a> between TLP and Bumblebee. The solution was listed in <a href="https://www.reddit.com/r/archlinux/comments/5m78zz/bumblebee_nvidia_error_on_optimus_laptop/">this 2 months old reddit thread</a> and <a href="https://forum.manjaro.org/t/bumblebee-could-not-enable-discrete-graphics-card/16728/12">this 2 weeks old Manjaro forum thread</a> if you're interested in the discussion around it.</p>
<p>The most difficult part on using NVIDIA on Linux is understanding all the many terminologies around it. I'm not even sure that I got it all already.</p>
<p>This is what I figured out so far:</p>
<ul>
  <li><a href="https://wiki.archlinux.org/index.php/NVIDIA_Optimus">Optimus</a> is the hybrid graphics card technology, which enables a low power Intel GPU as the primary card that you can bridge to the secondary, power demanding, NVIDIA GPU, just when you really need it.</li>
  <li><code>optirun</code> is the command you use to make this bridge.</li>
  <li>"NVIDIA" is what we call the official proprietary binaries. On Arch it's available on package "linux410-nvidia".</li>
  <li>"Nouveau" is the open source driver, it uses Primus to make the bridge instead of <code>optirun</code>. I understand that you should avoid this driver for now if you need full performance and full compliance from the GPU.</li>
  <li><a href="https://wiki.archlinux.org/index.php/Bumblebee#Power_management">"Bumblebee"</a> is a daemon used to enable and disable the NVIDIA GPU. You don't want it enabled all the time, specially when running on battery, to avoid draining it too fast.</li>
  <li><a href="https://github.com/Bumblebee-Project/bbswitch">"bbswitch"</a> is the kernel module that does the low level ACPI calls to control the power state of the NVIDIA GPU card.</li>
  <li><a href="https://github.com/linrunner/TLP">"TLP"</a> is the general Linux power management system, which controls every aspect of the machine's hardware, including the PCI devices (one of which is the NVIDIA card).</li>
</ul>
<p>The way I understand it, you don't want TLP to kick in and shut off the card, because if it does, then Bumblebee can't enable it back on when needed (through bbswitch). So you have to blacklist it's PCI device on TLP and let Bumblebee do it's job.</p>
<p>If everything is working fine, then the NVIDIA GPU is turned off by default. You can check that it is off through bbswitch:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ cat /proc/acpi/bbswitch<tt>
</tt>0000:01:00.0 OFF<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>Now, let's say you want to force something to use the card, so you do it like this:</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ optirun -vv glxgears<tt>
</tt>[ 1817.200384] [DEBUG]Reading file: /etc/bumblebee/bumblebee.conf<tt>
</tt>[ 1817.200519] [INFO]Configured driver: nvidia<tt>
</tt>[ 1817.200579] [DEBUG]optirun version 3.2.1-2017-02-27-Format:%h$ starting...<tt>
</tt>[ 1817.200584] [DEBUG]Active configuration:<tt>
</tt>[ 1817.200588] [DEBUG] bumblebeed config file: /etc/bumblebee/bumblebee.conf<tt>
</tt>[ 1817.200592] [DEBUG] X display: :8<tt>
</tt>[ 1817.200595] [DEBUG] LD_LIBRARY_PATH: /usr/lib/nvidia:/usr/lib32/nvidia<tt>
</tt>[ 1817.200599] [DEBUG] Socket path: /var/run/bumblebee.socket<tt>
</tt>[ 1817.200603] [DEBUG] Accel/display bridge: auto<tt>
</tt>[ 1817.200607] [DEBUG] VGL Compression: proxy<tt>
</tt>[ 1817.200611] [DEBUG] VGLrun extra options: <tt>
</tt>[ 1817.200615] [DEBUG] Primus LD Path: /usr/lib/primus:/usr/lib32/primus<tt>
</tt>[ 1817.200645] [DEBUG]Using auto-detected bridge virtualgl<tt>
</tt>[ 1818.163747] [INFO]Response: Yes. X is active.<tt>
</tt><tt>
</tt>[ 1818.163757] [INFO]Running application using virtualgl.<tt>
</tt>[ 1818.163843] [DEBUG]Process vglrun started, PID 9770.<tt>
</tt>10419 frames in 5.0 seconds = 2083.766 FPS<tt>
</tt>10671 frames in 5.0 seconds = 2134.041 FPS<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>This will run <code>glxgears</code> (a simple app to test the card) through the Optimus bridge (in verbose mode, which is why you have all this extra information). And if <code>glxgears</code> was able to use the NVIDIA GPU it should report FPS (frames per second) higher than 1,000.</p>
<p>And you can check with <code>bbswitch</code> like this:</p>
<table class="CodeRay">
  <tbody>
    <tr>
      <td class="line_numbers" title="click to toggle" onclick="with (this.firstChild.style) { display = (display == '') ? 'none' : '' }"><pre>1<tt>
</tt>2<tt>
</tt></pre>
      </td>
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">$ cat /proc/acpi/bbswitch<tt>
</tt>0000:01:00.0 ON<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>When you <code>Ctrl-C</code> out of <code>glxgears</code> it should report as <code>OFF</code> again.</p>
<p>Just to make sure, it's important to guarantee that <code>/etc/bumblebee/bumblebee.conf</code> is customized like this (only important keys are shown below):</p>
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
      <td class="code"><pre ondblclick="with (this.style) { overflow = (overflow == 'auto' || overflow == '') ? 'visible' : 'auto' }">[bumblebeed]<tt>
</tt>Driver=nvidia<tt>
</tt>...<tt>
</tt>[optirun]<tt>
</tt>Bridge=auto<tt>
</tt>...<tt>
</tt>[driver-nvidia]<tt>
</tt>KernelDriver=nvidia<tt>
</tt>PMMethod=bbswitch<tt>
</tt>...<tt>
</tt></pre>
      </td>
    </tr>
  </tbody>
</table>
<p>So far, the only small issues I still have are these:</p>
<ul>
  <li>Function keys don't change screen brightness</li>
  <li>Bose bluetooth headset connects flawlessly but won't become primary sound output without manually changing to it under the Sound settings (but hardware function keys for volume and media control all work without problems).</li>
  <li>I had to install Manjaro using the old BIOS boot and MBR partition scheme instead of GPT over UEFI. Not sure how to move to GPT/UEFI now (using a LUKS encrypted partition scheme)</li>
</ul>
<p>But after fixing the NVIDIA GPU after a suspend or power disconnect, the other issues are just very minor annoyances.</p>
<p>So far, I am very happy to be using Manjaro over the Dell XPS. I am using a dual monitor setup, and everything is working quite smoothly. If you want to try it out, I recommend you stick to the 9560 (mid 2016 version) Sandy Bridge version, do not go to the new Kaby Lake versions yet as you will find buggy BIOS firmware and many aspects of the hardware won't be properly supported or documented yet.</p>
<p>And if you're new to Arch, I highly recommend you start with Manjaro GNOME. It's by far the best and most usable Linux desktop I've tried.</p>
<p></p>
/* Theme toggle */
(function(){var K='theme-v2',r=document.documentElement;
function set(t,save){r.setAttribute('data-theme',t);if(save){try{localStorage.setItem(K,t)}catch(e){}}
var b=document.getElementById('theme-toggle');if(b){b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' mode');b.setAttribute('aria-pressed',String(t==='dark'))}}
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('theme-toggle');
set(r.getAttribute('data-theme')||'dark',false);
if(b)b.addEventListener('click',function(){r.classList.add('theme-anim');set(r.getAttribute('data-theme')==='dark'?'light':'dark',true);
clearTimeout(window.__themeT);window.__themeT=setTimeout(function(){r.classList.remove('theme-anim')},400)})});})();
/* Scroll reveal: sections, grids, cards, timeline items */
(function(){var els=[].slice.call(document.querySelectorAll('.reveal-section'));
var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in-view')});return}
var o=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in-view');o.unobserve(en.target)}})},{threshold:.1,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(e){o.observe(e)});})();
/* Intake form */
(function(){var f=document.getElementById('intake');if(!f)return;
var steps=[].slice.call(f.querySelectorAll('.step')),last=steps.length-1,i=0,msg=document.getElementById('msg'),back=document.getElementById('back'),next=document.getElementById('next'),sub=document.getElementById('sub'),lab=document.getElementById('stepLabel'),bar=document.getElementById('bar'),sending=false;
function stepOk(s){var r=s.getAttribute('data-need');if(r==='choice')return !!s.querySelector('input:checked');if(r==='fields'){var a=s.querySelectorAll('[required]');for(var k=0;k<a.length;k++){var v=a[k].value.trim();if(!v||(a[k].type==='email'&&!/^\S+@\S+\.\S+$/.test(v)))return false}}return true}
function allOk(){return steps.every(stepOk)}
function sync(){var fin=i===last,ready=fin&&allOk();next.hidden=fin;sub.hidden=!ready;sub.disabled=!ready||sending;if(!sending)msg.textContent=(fin&&!ready)?'Add your name and a valid email to show the Send inquiry button.':''}
function show(n){i=n;steps.forEach(function(s,k){s.classList.toggle('active',k===n)});back.hidden=n===0;lab.textContent='Step '+(n+1)+' of '+steps.length;bar.style.width=((n+1)/steps.length*100)+'%';sync()}
next.addEventListener('click',function(){if(!stepOk(steps[i])){msg.textContent='Please complete this step to continue.';return}show(i+1)});
back.addEventListener('click',function(){show(i-1)});
f.addEventListener('input',sync);f.addEventListener('change',sync);
f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName!=='TEXTAREA'){e.preventDefault();if(i<last)next.click()}});
var map={'pre-construction-admin':'Document Control','bid-procurement':'RFI/Submittal Logs','schedule-compliance':'Schedule Look-aheads','budget-vendor':'Budget/Invoice Admin','cost-estimating':'Cost Estimating'};
var sv=map[new URLSearchParams(location.search).get('service')];
if(sv){var c=f.querySelector('input[value="'+sv+'"]');if(c)c.checked=true}
f.addEventListener('submit',function(e){e.preventDefault();
if(i!==last||!allOk()){for(var k=0;k<steps.length;k++){if(!stepOk(steps[k])){show(k);msg.textContent='Please complete this step before sending.';return}}return}
if(sending)return;sending=true;sub.disabled=true;msg.textContent='Sending...';
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){
if(!r.ok)throw 0;var cal=f.getAttribute('data-cal');
f.parentNode.innerHTML='<h2>Thank you</h2><p>Your inquiry is in. A confirmation is on its way to your inbox, and I will follow up with next steps shortly.</p><p><a class="btn primary" href="'+cal+'">Book an intro call</a></p>';
}).catch(function(){sending=false;sync();msg.textContent='Something went wrong. Please try again or use the email link in the footer.'})});
show(0)})();

/* Parallax (--py) and eager calendar load on booking links */
(function(){var r=document.documentElement,t=0;if(!matchMedia('(prefers-reduced-motion: reduce)').matches)addEventListener('scroll',function(){if(t)return;t=requestAnimationFrame(function(){r.style.setProperty('--py',Math.min(scrollY,900));t=0})},{passive:true});
[].forEach.call(document.querySelectorAll('a[href$="#schedule"]'),function(a){a.addEventListener('click',function(){[].forEach.call(document.querySelectorAll('.calendar-frame iframe'),function(f){f.loading='eager'})})})})();

/* ===== v6: burger menu (<768px) ===== */
(function(){var b=document.querySelector('.nav-burger'),m=document.getElementById('nav-links');if(!b||!m)return;
function set(o){m.classList.toggle('open',o);b.setAttribute('aria-expanded',String(o));b.setAttribute('aria-label',o?'Close menu':'Open menu')}
b.addEventListener('click',function(e){e.stopPropagation();set(!m.classList.contains('open'))});
m.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
document.addEventListener('click',function(e){if(!m.contains(e.target)&&!b.contains(e.target))set(false)});
document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
addEventListener('resize',function(){if(innerWidth>1000)set(false)})})();

/* ===== v6: track record entrance + count-up ===== */
(function(){var g=document.querySelector('.stats4');if(!g)return;
var cards=[].slice.call(g.querySelectorAll('.mbadge')),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var items=cards.map(function(c,i){c.style.setProperty('--i',i);var b=c.querySelector('b'),m=b&&b.textContent.match(/^(\D*)([\d,.]+)(.*)$/);
return m?{el:b,pre:m[1],n:parseFloat(m[2].replace(/,/g,'')),suf:m[3],full:b.textContent}:null});
function fmt(it,v){return it.pre+Math.round(v).toLocaleString('en-US')+it.suf}
function run(){g.classList.add('go');
items.forEach(function(it,i){if(!it)return;var t0=null,dur=1500,delay=250+i*130;
function step(ts){if(t0===null)t0=ts+delay;var p=Math.min(Math.max((ts-t0)/dur,0),1),e=1-Math.pow(1-p,3);it.el.textContent=fmt(it,it.n*e);if(p<1)requestAnimationFrame(step);else it.el.textContent=it.full}
requestAnimationFrame(step)});
setTimeout(function(){g.classList.add('settled')},2300)}
if(reduce||!('IntersectionObserver' in window)){g.classList.add('go','settled');return}
items.forEach(function(it){if(it)it.el.textContent=fmt(it,0)});
var o=new IntersectionObserver(function(es){if(es[0].isIntersecting){o.disconnect();run()}},{threshold:.3});o.observe(g)})();

/* ===== v6: swipe dots under mobile card tracks ===== */
(function(){var sel='.grid,.tight,.editorial,.stagger3,.timeline,.vals,.stats4,.scope,.feature-list,.metrics';
[].forEach.call(document.querySelectorAll(sel),function(t){
if(t.children.length<2)return;
var d=document.createElement('div');d.className='track-dots';d.setAttribute('aria-hidden','true');
for(var i=0;i<t.children.length;i++)d.appendChild(document.createElement('i'));
t.parentNode.insertBefore(d,t.nextSibling);var dots=d.children,tick=0;
function upd(){tick=0;var k=t.children,max=t.scrollWidth-t.clientWidth,idx=0;
if(max>2&&t.scrollLeft>=max-4)idx=k.length-1;else{var best=1e9;for(var i=0;i<k.length;i++){var dd=Math.abs(k[i].offsetLeft-t.offsetLeft-16-t.scrollLeft);if(dd<best){best=dd;idx=i}}}
for(var j=0;j<dots.length;j++)dots[j].classList.toggle('on',j===idx)}
t.addEventListener('scroll',function(){if(!tick)tick=requestAnimationFrame(upd)},{passive:true});upd()})})();

/* ===== v8: calendar pop-up modal (site-wide) ===== */
/* EMBED = the frameable Google appointment-schedule URL; OFFICIAL = the public booking link shown as the fallback and used if JS or <dialog> is unavailable */
(function(){
var OFFICIAL='https://calendar.google.com/calendar/appointments/schedules/AcZssZ0R7e9bEZQBKGwibB-TA2SWhPY16qDOVbvIdM0oYaYrLKdC_HWUvAiIFNtdsRCpkkbNfFTyvWqR?gv=true',
EMBED='https://calendar.google.com/calendar/appointments/schedules/AcZssZ0R7e9bEZQBKGwibB-TA2SWhPY16qDOVbvIdM0oYaYrLKdC_HWUvAiIFNtdsRCpkkbNfFTyvWqR?gv=true';
var SEL='a[href*="calendar.app.google"],a[href*="calendar.google.com/calendar/appointments"],[data-gcal],[data-cal-open]',dlg,opener;
if(typeof HTMLDialogElement==='undefined')return;
function build(){
dlg=document.createElement('dialog');dlg.className='calendar-modal';dlg.setAttribute('aria-labelledby','cm-title');
dlg.innerHTML='<div class="cm-head"><h3 id="cm-title">Book a discovery call</h3><a class="cm-open" href="'+OFFICIAL+'" target="_blank" rel="noopener">Open in new tab &#8599;</a><button type="button" class="cm-close" aria-label="Close booking calendar">&times;</button></div>'+
'<div class="calendar-container has-embed"><div class="calendar-frame"><iframe title="Book a discovery call" width="100%" referrerpolicy="no-referrer-when-downgrade"></iframe></div>'+
'<div class="calendar-fallback"><p class="cf-small">Calendar not loading? <a href="'+OFFICIAL+'" target="_blank" rel="noopener">Open the booking page</a>.</p></div></div>';
document.body.appendChild(dlg);
dlg.querySelector('.cm-close').addEventListener('click',function(){dlg.close()});
dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
dlg.addEventListener('close',function(){document.documentElement.classList.remove('cal-open');if(opener&&opener.focus)opener.focus()})}
document.addEventListener('click',function(e){
var a=e.target.closest&&e.target.closest(SEL);
if(!a||a.closest('.calendar-modal,.calendar-container')||e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey)return;
e.preventDefault();opener=a;if(!dlg)build();
var f=dlg.querySelector('iframe');if(!f.getAttribute('src'))f.setAttribute('src',EMBED);
document.documentElement.classList.add('cal-open');
if(!dlg.open)dlg.showModal();dlg.scrollTop=0});
})();

/* ===== v8: showcase video (hero loop + workflow reel) ===== */
(function(){
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches||(navigator.connection&&navigator.connection.saveData);
[].forEach.call(document.querySelectorAll('[data-video]'),function(w){
var v=w.querySelector('video');if(!v)return;
var pb=w.querySelector('[data-v-play]'),mb=w.querySelector('[data-v-mute]'),bar=w.querySelector('.reel-bar'),fill=bar&&bar.firstElementChild,
chs=[].slice.call(w.querySelectorAll('[data-t]')),userPaused=false;
function ui(){if(pb){var p=v.paused;pb.classList.toggle('paused',p);pb.setAttribute('aria-label',p?'Play video':'Pause video')}
if(mb){var on=!v.muted;mb.classList.toggle('on',on);mb.setAttribute('aria-label',on?'Mute video':'Turn sound on');mb.setAttribute('aria-pressed',String(on))}}
function play(){var p=v.play();if(p&&p.catch)p.catch(function(){});}
if(reduce){v.removeAttribute('autoplay');v.pause();userPaused=true}
if(pb)pb.addEventListener('click',function(){if(v.paused){userPaused=false;play()}else{userPaused=true;v.pause()}});
if(mb)mb.addEventListener('click',function(){v.muted=!v.muted;ui()});
v.addEventListener('play',ui);v.addEventListener('pause',ui);v.addEventListener('volumechange',ui);
if(fill){v.addEventListener('timeupdate',function(){var d=v.duration||1;fill.style.width=(v.currentTime/d*100)+'%';
if(chs.length){var t=v.currentTime,k=0;chs.forEach(function(c,i){if(t>=parseFloat(c.getAttribute('data-t')))k=i});chs.forEach(function(c,i){c.classList.toggle('on',i===k)})}});
bar.addEventListener('click',function(e){var r=bar.getBoundingClientRect();v.currentTime=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*(v.duration||0)})}
chs.forEach(function(c){c.addEventListener('click',function(){v.currentTime=parseFloat(c.getAttribute('data-t'));userPaused=false;play()})});
if('IntersectionObserver' in window)new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){if(!userPaused&&v.paused)play()}else if(!v.paused)v.pause()})},{threshold:.2}).observe(w);
ui()})})();

/* ===== v14: feature rows scroll reveal ===== */
(function(){var rows=[].slice.call(document.querySelectorAll('.fr-row'));if(!rows.length)return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches||!('IntersectionObserver' in window)){rows.forEach(function(r){r.classList.add('in')});return}
document.documentElement.classList.add('fr-ready');
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
rows.forEach(function(r){io.observe(r)})})();


/* ===== v28: Tally "Get Started" modal (site-wide) ===== */
/* Any [data-tally-open] link opens the Tally form in a pop-up. Its href (intake.html) is the fallback if JS or <dialog> is unavailable. */
(function(){
var FORM='woO0Kx',OFFICIAL='https://tally.so/r/'+FORM,
EMBED='https://tally.so/embed/'+FORM+'?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1',
SEL='[data-tally-open]',dlg,opener,frame;
if(typeof HTMLDialogElement==='undefined')return;
function embedJs(cb){
 if(window.Tally&&window.Tally.loadEmbeds){cb();return}
 var s=document.createElement('script');s.src='https://tally.so/widgets/embed.js';s.async=true;s.onload=cb;s.onerror=cb;document.body.appendChild(s)}
function build(){
 dlg=document.createElement('dialog');dlg.className='tally-modal';dlg.setAttribute('aria-labelledby','tm-title');
 dlg.innerHTML='<div class="cm-head"><h3 id="tm-title">Get Started</h3><a class="cm-open" href="'+OFFICIAL+'" target="_blank" rel="noopener">Open in new tab &#8599;</a><button type="button" class="cm-close" aria-label="Close form">&times;</button></div>'+
 '<div class="tm-body"><iframe data-tally-src="'+EMBED+'" loading="lazy" width="100%" height="500" frameborder="0" marginheight="0" marginwidth="0" title="Get Started"></iframe></div>';
 document.body.appendChild(dlg);frame=dlg.querySelector('iframe');
 dlg.querySelector('.cm-close').addEventListener('click',function(){dlg.close()});
 dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
 dlg.addEventListener('close',function(){document.documentElement.classList.remove('cal-open');if(opener&&opener.focus)opener.focus()})}
function load(service){
 var src=EMBED+(service?'&service='+encodeURIComponent(service):'');
 if(frame.getAttribute('data-tally-src')!==src){frame.setAttribute('data-tally-src',src);frame.removeAttribute('src')}
 if(frame.getAttribute('src'))return;
 embedJs(function(){
  if(window.Tally&&window.Tally.loadEmbeds)window.Tally.loadEmbeds();
  setTimeout(function(){if(!frame.getAttribute('src'))frame.setAttribute('src',frame.getAttribute('data-tally-src'))},400)})}
document.addEventListener('click',function(e){
 var a=e.target.closest&&e.target.closest(SEL);
 if(!a||a.closest('.tally-modal')||e.defaultPrevented||e.button>0||e.metaKey||e.ctrlKey||e.shiftKey)return;
 e.preventDefault();opener=a;if(!dlg)build();
 load(a.getAttribute('data-service'));
 document.documentElement.classList.add('cal-open');
 if(!dlg.open)dlg.showModal();dlg.scrollTop=0});
})();

/* ===== v28: newsletter signup (about page profile card) ===== */
(function(){var f=document.querySelector('[data-newsletter]');if(!f)return;
var st=f.parentNode.querySelector('.nl-status'),em=f.querySelector('input[type=email]'),btn=f.querySelector('.nl-btn'),mail=f.getAttribute('data-mailto'),busy=false;
function say(m,ok){st.textContent=m;st.className='nl-status '+(ok?'ok':'err')}
f.addEventListener('submit',function(e){e.preventDefault();if(busy)return;
 var trap=f.querySelector('[name=_gotcha]');if(trap&&trap.value)return;
 var v=em.value.trim();if(!/^\S+@\S+\.\S+$/.test(v)){say('Please enter a valid email address.',false);em.focus();return}
 busy=true;btn.disabled=true;say('Signing you up...',true);
 fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){
  if(!r.ok)throw 0;f.reset();say('Thanks, you are on the list.',true)
 }).catch(function(){say('Could not sign you up just now. Please email '+mail+' and I will add you.',false)
 }).then(function(){busy=false;btn.disabled=false})})})();

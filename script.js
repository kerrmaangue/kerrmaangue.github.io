/* Theme toggle */
(function(){var K='theme',r=document.documentElement;
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
/* Calendar: paste the Google appointment-schedule embed URL below (https://calendar.google.com/...) */
(function(){var CAL_EMBED='https://calendar.google.com/calendar/appointments/schedules/AcZssZ3it_VkPKrxvsED4t0x5Pf07ydVxVqoLuqXjPIUukcu_rU-KY_zUWlemgOP_sPTm85hLgXLFMBo?gv=true';
[].forEach.call(document.querySelectorAll('.calendar-container'),function(c){
var u=(c.getAttribute('data-embed')||CAL_EMBED).trim();if(!/^https:\/\/calendar\.google\.com\//.test(u))return;
var fr=c.querySelector('.calendar-frame'),f=document.createElement('iframe');f.src=u;f.title='Book a discovery call';f.loading='lazy';fr.appendChild(f);c.classList.add('has-embed')})})();
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

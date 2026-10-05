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
addEventListener('resize',function(){if(innerWidth>767)set(false)})})();

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

/* ===== v6: Google Calendar popup on home-page booking buttons ===== */
(function(){[].forEach.call(document.querySelectorAll('[data-gcal]'),function(a){a.addEventListener('click',function(e){
var h=document.getElementById('gcal-host'),b=h&&h.querySelector('button,[role="button"]');
if(b){e.preventDefault();b.click()}})})})();

/* ===== v7: Excel preview dialog ===== */
(function(){var d=document.getElementById('xl-dialog');if(!d)return;
[].forEach.call(document.querySelectorAll('[data-xl-open]'),function(b){b.addEventListener('click',function(){if(d.showModal)d.showModal();else d.setAttribute('open','')})});
d.querySelector('[data-xl-close]').addEventListener('click',function(){d.close()});
d.addEventListener('click',function(e){if(e.target===d)d.close()});
[].forEach.call(d.querySelectorAll('[data-xl-tab]'),function(t){t.addEventListener('click',function(){var n=t.getAttribute('data-xl-tab');
[].forEach.call(d.querySelectorAll('[data-xl-tab]'),function(x){x.setAttribute('aria-selected',String(x===t))});
[].forEach.call(d.querySelectorAll('[data-xl-pane]'),function(p){p.hidden=p.getAttribute('data-xl-pane')!==n})})})})();

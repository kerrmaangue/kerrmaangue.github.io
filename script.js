(function(){var K='theme',r=document.documentElement;
function set(t){r.setAttribute('data-theme',t);try{localStorage.setItem(K,t)}catch(e){}
var b=document.getElementById('theme-toggle');if(b)b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' mode')}
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('theme-toggle');
set(r.getAttribute('data-theme')||'dark');
if(b)b.addEventListener('click',function(){set(r.getAttribute('data-theme')==='dark'?'light':'dark')})});})();
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.reveal');
  if(reduce || !('IntersectionObserver' in window)){
    els.forEach(function(e){e.classList.add('in-view');});
  } else {
    var o = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in-view'); o.unobserve(en.target);} });
    },{threshold:0.12});
    els.forEach(function(e){o.observe(e);});
  }
  var counters = document.querySelectorAll('[data-count]');
  if(!reduce && 'IntersectionObserver' in window){
    counters.forEach(function(c){ c.textContent = '0'; });
    var co = new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){ run(en.target); co.unobserve(en.target);} });
    },{threshold:0.5});
    counters.forEach(function(c){co.observe(c);});
  }
  function run(el){
    var t = el.getAttribute('data-count'), m = t.match(/[\d.]+/);
    if(!m){ el.textContent = t; return; }
    var n = parseFloat(m[0]), suffix = t.slice(m.index + m[0].length), s = performance.now();
    (function tick(now){
      var p = Math.min((now - s)/900, 1), e = 1 - Math.pow(1-p, 3);
      el.textContent = Math.round(n*e) + suffix;
      if(p < 1) requestAnimationFrame(tick); else el.textContent = t;
    })(s);
  }
})();
(function(){var f=document.getElementById('intake');if(!f)return;
var steps=[].slice.call(f.querySelectorAll('.step')),i=0,msg=document.getElementById('msg'),back=document.getElementById('back'),next=document.getElementById('next'),sub=document.getElementById('sub'),lab=document.getElementById('stepLabel'),bar=document.getElementById('bar');
function show(n){i=n;steps.forEach(function(s,k){s.classList.toggle('active',k===n)});back.hidden=n===0;next.hidden=n===steps.length-1;sub.hidden=n!==steps.length-1;lab.textContent='Step '+(n+1)+' of '+steps.length;bar.style.width=((n+1)/steps.length*100)+'%';msg.textContent=''}
function ok(){var s=steps[i],r=s.getAttribute('data-need');if(r==='choice')return !!s.querySelector('input:checked');if(r==='fields'){var a=s.querySelectorAll('[required]');for(var k=0;k<a.length;k++){var v=a[k].value.trim();if(!v||(a[k].type==='email'&&!/^\S+@\S+\.\S+$/.test(v)))return false}}return true}
next.addEventListener('click',function(){if(!ok()){msg.textContent='Please complete this step to continue.';return}show(i+1)});
back.addEventListener('click',function(){show(i-1)});
var map={'pre-construction-admin':'Document Control','bid-procurement':'RFI/Submittal Logs','schedule-compliance':'Schedule Look-aheads','budget-vendor':'Budget/Invoice Admin'};
var sv=map[new URLSearchParams(location.search).get('service')];
if(sv){var c=f.querySelector('input[value="'+sv+'"]');if(c)c.checked=true}
f.addEventListener('submit',function(e){e.preventDefault();if(!ok()){msg.textContent='Please add your name and a valid email.';return}
if(f.action.indexOf('YOUR_FORM_ID')>-1){msg.textContent='The form is not connected yet. Please use the email link in the footer.';return}
sub.disabled=true;msg.textContent='Sending...';
fetch(f.action,{method:'POST',body:new FormData(f),headers:{Accept:'application/json'}}).then(function(r){
if(!r.ok)throw 0;var cal=f.getAttribute('data-cal');
f.parentNode.innerHTML='<h2>Thank you</h2><p>Your inquiry is in. A confirmation is on its way to your inbox, and I will follow up with next steps shortly.</p><p><a class="btn primary" href="'+cal+'">Book an intro call</a></p>';
}).catch(function(){sub.disabled=false;msg.textContent='Something went wrong. Please try again or use the email link in the footer.'})});
show(0)})();

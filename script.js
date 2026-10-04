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
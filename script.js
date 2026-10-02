
function applyTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  var btn = document.getElementById('themeToggle');
  if (btn) btn.setAttribute('aria-label', t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
}
function toggleTheme(){
  var current = document.documentElement.getAttribute('data-theme') || 'light';
  var next = current === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('theme', next); } catch (e) {}
  applyTheme(next);
}
(function(){
  var saved = 'light';
  try { saved = localStorage.getItem('theme') || 'light'; } catch (e) {}
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ applyTheme(saved); });
  } else {
    applyTheme(saved);
  }
})();

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

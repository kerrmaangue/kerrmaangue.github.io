(function(){var K='theme',r=document.documentElement;
function set(t){r.setAttribute('data-theme',t);try{localStorage.setItem(K,t)}catch(e){}
var b=document.getElementById('theme-toggle');if(b)b.setAttribute('aria-label','Switch to '+(t==='dark'?'light':'dark')+' mode')}
document.addEventListener('DOMContentLoaded',function(){var b=document.getElementById('theme-toggle');
set(r.getAttribute('data-theme')||'dark');
if(b)b.addEventListener('click',function(){set(r.getAttribute('data-theme')==='dark'?'light':'dark')})});})();
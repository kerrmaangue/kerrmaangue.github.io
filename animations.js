document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var revealEls = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  } else {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { obs.observe(el); });
  }

  var counters = document.querySelectorAll('[data-count]');
  function setFinal(el) { el.textContent = el.getAttribute('data-count'); }

  if (reduceMotion) {
    counters.forEach(setFinal);
  } else {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { countObs.observe(c); });
  }

  function animateCount(el) {
    var target = el.getAttribute('data-count');
    var match = target.match(/[\d.]+/);
    if (!match) { setFinal(el); return; }
    var num = parseFloat(match[0]);
    var suffix = target.slice(match.index + match[0].length);
    var duration = 900;
    var start = performance.now();
    function tick(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(num * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else setFinal(el);
    }
    requestAnimationFrame(tick);
  }
});

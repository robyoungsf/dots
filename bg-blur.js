// Location pages: blur the pinned final gallery slide as the footer scrolls up
// over it. The hero/backdrop no longer blurs — the page opens on the default
// beige background and scrolls normally; only the last photo blurs out.
(function () {
  var footerSlide = document.querySelector('.footer-slide');
  var footerEl = document.querySelector('.site-footer');
  if (!footerSlide || !footerEl) return;

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Respect reduced-motion: show the footer slide statically blurred.
  if (reduce) {
    root.style.setProperty('--footer-blur', '1');
    return;
  }

  var ticking = false;

  function apply() {
    ticking = false;
    // The pinned last slide blurs as the footer scrolls up over it, driven by
    // how far the footer has entered the viewport: 0 (sharp) when the footer is
    // just appearing at the bottom, 1 (fully blurred) by the time it's ~80% in
    // — so the slide is completely blurred once the footer is fully in view.
    var vh = window.innerHeight || 1;
    var top = footerEl.getBoundingClientRect().top;
    var fb = (vh - top) / (vh * 0.8);
    fb = fb < 0 ? 0 : fb > 1 ? 1 : fb;
    root.style.setProperty('--footer-blur', String(fb));
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(apply);
  }

  apply();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
})();

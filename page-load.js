/* Page load choreography — one source of truth for every page.
 *
 * Usage: in <head>, before the stylesheet, so the class lands before paint:
 *
 *   <script src="page-load.js"></script>       (root pages)
 *   <script src="../page-load.js"></script>    (location pages)
 *
 * Two jobs, both about arriving gently instead of snapping in:
 *
 *   1. Hold the page at opacity 0 (via .js-fade on <html>, which styles.css
 *      acts on) until the webfont has settled, then fade it in as one piece.
 *      Otherwise the text paints in Courier New, then jumps as Courier Prime
 *      swaps over it, and the JS-injected nav and footer pop in after that.
 *   2. Fade each photo in as it decodes, rather than letting a multi-megabyte
 *      JPEG slam into place the instant it lands.
 *
 * Everything here is additive: with JS off, neither class is ever set and the
 * page renders exactly as it did before. Under prefers-reduced-motion the
 * fades are skipped entirely.
 */
(function () {
  var root = document.documentElement;
  var reduce =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduce) return;

  root.classList.add("js-fade");

  /* Reveal the page once the webfont is in, so the fade and the font swap are
     the same moment instead of two. The timeout is the backstop that matters
     most: a slow, blocked, or offline Google Fonts must never leave someone
     staring at a blank page. */
  var FONT_TIMEOUT = 1200;
  var revealed = false;

  function reveal() {
    if (revealed) return;
    revealed = true;
    /* Two frames, so the browser has actually painted the page at opacity 0
       before the class flips. Set it any sooner — which a warm cache does,
       since the font resolves almost instantly — and there are no two states
       to interpolate between, so the transition is skipped and the page snaps
       in. The wait is what makes the fade deliberate rather than incidental. */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        root.classList.add("is-ready");
      });
    });
  }

  setTimeout(reveal, FONT_TIMEOUT);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () {
      /* Next frame, so the swapped font is painted by the same pass that
         starts the fade — no flash of the fallback mid-transition. */
      requestAnimationFrame(reveal);
    });
  } else {
    /* No Font Loading API: fall back to the parsed document, still capped by
       the timeout above. */
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", reveal);
    } else {
      reveal();
    }
  }

  /* Photos fade in individually as they decode. Cached images are already
     complete by the time this runs, so they skip straight to visible and the
     fade only ever shows on images that genuinely had to travel. */
  function watch(img) {
    if (img.complete && img.naturalWidth > 0) {
      img.classList.add("is-loaded");
      return;
    }
    img.addEventListener(
      "load",
      function () {
        img.classList.add("is-loaded");
      },
      { once: true }
    );
    /* A broken image should not stay invisible behind the fade. */
    img.addEventListener(
      "error",
      function () {
        img.classList.add("is-loaded");
      },
      { once: true }
    );
  }

  function watchAll() {
    var photos = document.querySelectorAll(
      ".location-image, .installment-button, .gallery-slide img, .footer-slide img"
    );
    for (var i = 0; i < photos.length; i++) watch(photos[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchAll);
  } else {
    watchAll();
  }
})();

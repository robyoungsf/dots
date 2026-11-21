/* Site-wide announcement banner — a full-width strip above everything else,
 * for holiday hours and the like.
 *
 * Usage: as the very first thing in <body>, before the nav mount:
 *
 *   <script src="banner.js"></script>       (root pages)
 *   <script src="../banner.js"></script>    (pages one folder down)
 *
 * It runs where it sits rather than on DOMContentLoaded, so the strip is in
 * place before the first paint and the page never jumps down to make room.
 *
 * To change it, edit BANNER below. `until` is when it takes itself down, in
 * Chicago time; past that it renders nothing, so a stale notice can't linger
 * if nobody remembers to remove it. Set BANNER to null to turn it off now.
 *
 * The strip is sticky, so it stays pinned to the top of the screen. The nav,
 * wordmark and scrim are position: fixed and can't be pushed down by it the
 * way the page content is, so this publishes the strip's height as --banner-h
 * and styles.css adds it to --nav-top, keeping the band just under the strip.
 */
(function () {
  var BANNER = {
    text: "We will be closed Thanksgiving Day",
    until: "2026-11-27T00:00:00-06:00",
  };

  if (!BANNER || !BANNER.text) return;
  if (BANNER.until && Date.now() >= new Date(BANNER.until).getTime()) return;

  var script = document.currentScript;
  if (!script || !script.parentNode) return;

  var strip = document.createElement("div");
  strip.className = "site-banner";
  strip.setAttribute("role", "region");
  strip.setAttribute("aria-label", "Announcement");
  var p = document.createElement("p");
  p.textContent = BANNER.text;
  strip.appendChild(p);
  script.parentNode.insertBefore(strip, script);

  var docEl = document.documentElement;
  function publish() {
    docEl.style.setProperty("--banner-h", strip.offsetHeight + "px");
  }
  publish();
  /* The text can wrap to two lines on a narrow phone, and web fonts arriving
     late can change the line height, so re-measure rather than trusting the
     first reading. */
  window.addEventListener("resize", publish);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(publish);
})();

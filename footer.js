/* Shared site footer — one source of truth for every location page.
 *
 * Usage: near the end of <body>, add a mount point and this script:
 *
 *   <div data-site-footer></div>
 *   <script src="footer.js" data-root="."></script>      (root pages)
 *   <script src="../footer.js" data-root=".."></script>  (location pages)
 *
 * The email link is an absolute URL, so the footer works from any depth.
 * `data-root` is retained for callers but no longer used for footer links.
 */
(function () {
  var html =
    '<div class="footer-inner">' +
    '<div class="footer-info">' +
    '<div class="footer-cols">' +
    '<div class="footer-col">' +
    '<p class="tagline"><b class="footer-col-title">Say hello</b>' +
    '<a href="mailto:hello@dots-cafe.com">hello@dots-cafe.com</a></p>' +
    "</div>" +
    '<div class="footer-col">' +
    '<p class="tagline"><b class="footer-col-title">Roscoe Village</b>2000 Addison St<br>Chicago, IL 60618<br>7a&ndash;7p every day</p>' +
    "</div>" +
    '<div class="footer-col">' +
    '<p class="tagline"><b class="footer-col-title">Dot\'s Fulton Market at Estereo</b>' +
    '1001 W Fulton Market<br>Chicago, IL 60607<br>7a&ndash;1p Mon&ndash;Fri</p>' +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML = html;

  var mount = document.querySelector("[data-site-footer]");
  if (mount) {
    mount.replaceWith(footer);
  } else {
    document.body.appendChild(footer);
  }

  // If a pinned .footer-slide backs the footer (location pages with a gallery),
  // the footer is a transparent panel over that slide. Otherwise, mirror the
  // page's backdrop photo into the footer as a frosted (CSS-blurred) copy.
  if (document.querySelector(".footer-slide")) {
    footer.classList.add("has-footer-slide");
  } else {
    var pageBg = document.querySelector(".page-bg");
    if (pageBg) {
      var img = window.getComputedStyle(pageBg).backgroundImage;
      if (img && img !== "none") {
        footer.style.setProperty("--footer-bg", img);
      }
    }
  }
})();

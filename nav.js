/* Shared global nav — one source of truth for every page.
 *
 * Usage: near the start of <body>, add a mount point and this script:
 *
 *   <div data-site-nav></div>
 *   <script src="nav.js" data-root="."></script>       (root pages)
 *   <script src="../nav.js" data-root=".."></script>   (location pages)
 *
 * `data-root` is the path back to the site root; it's used for the
 * Locations dropdown and Artist Series links. Gift Cards is an absolute
 * URL, so it works from any depth.
 */
(function () {
  var script = document.currentScript;
  var root = (script && script.dataset.root) || ".";

  var GIFT_CARDS =
    "https://order.toasttab.com/egiftcards/dots-2000-west-addison-street";

  var INSTAGRAM = "http://www.instagram.com/_dotscafe";

  /* One source of truth for the locations listed in the dropdown. */
  var LOCATIONS = [
    { name: "Roscoe Village", href: root + "/addison/index.html" },
    { name: "Fulton Market at Estereo", href: root + "/fulton/index.html" },
  ];

  var locationItems = LOCATIONS.map(function (loc) {
    if (loc.inactive) {
      return (
        '<span class="site-nav-menu-link site-nav-menu-link--inactive" aria-disabled="true">' +
        loc.name +
        "</span>"
      );
    }
    return (
      '<a class="site-nav-menu-link" href="' + loc.href + '">' + loc.name + "</a>"
    );
  }).join("");

  var linksHtml =
    '<div class="site-nav-item">' +
    '<button type="button" class="site-nav-link site-nav-toggle" aria-expanded="false" aria-haspopup="true">Locations</button>' +
    '<div class="site-nav-menu">' +
    locationItems +
    "</div>" +
    "</div>" +
    '<a class="site-nav-link" href="' +
    root +
    '/artist-series/index.html">Artist Series</a>' +
    '<a class="site-nav-link" href="' +
    GIFT_CARDS +
    '" target="_blank" rel="noopener noreferrer">Gift Cards</a>' +
    '<a class="site-nav-link site-nav-ig" href="' +
    INSTAGRAM +
    '" target="_blank" rel="noopener noreferrer" aria-label="Instagram">' +
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>' +
    '<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>' +
    '<line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>' +
    "</svg></a>";

  /* Hamburger toggle (mobile only, hidden on desktop via CSS) + the links,
     wrapped so the whole set can collapse into a dropdown panel on small
     screens. */
  var html =
    '<button type="button" class="site-nav-burger" aria-label="Menu" aria-expanded="false" aria-controls="site-nav-links">' +
    '<span class="burger-box" aria-hidden="true">' +
    '<span class="burger-line"></span>' +
    '<span class="burger-line"></span>' +
    '<span class="burger-line"></span>' +
    "</span></button>" +
    '<div class="site-nav-links" id="site-nav-links">' +
    linksHtml +
    "</div>";

  var nav = document.createElement("nav");
  nav.className = "site-nav";
  nav.setAttribute("aria-label", "Primary");
  nav.innerHTML = html;

  var mount = document.querySelector("[data-site-nav]");
  if (mount) {
    mount.replaceWith(nav);
  } else {
    document.body.appendChild(nav);
  }

  /* Hamburger: collapses the nav links into a dropdown panel on small screens.
     Purely additive — on desktop the burger is hidden and the links show
     inline, so this listener just toggles a class that only CSS acts on below
     the mobile breakpoint. */
  var burger = nav.querySelector(".site-nav-burger");
  if (burger) {
    var closeNav = function () {
      nav.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    };

    burger.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    /* Tapping a link or outside the nav closes the panel. */
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeNav();
    });
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* Locations dropdown: open on hover (desktop), and toggle on click/tap so
     touch users and keyboard users can reach it too. */
  var item = nav.querySelector(".site-nav-item");
  var toggle = nav.querySelector(".site-nav-toggle");
  if (item && toggle) {
    var open = function () {
      item.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
    };
    var close = function () {
      item.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", function (e) {
      e.stopPropagation();
      if (item.classList.contains("open")) {
        close();
      } else {
        open();
      }
    });

    document.addEventListener("click", function (e) {
      if (!item.contains(e.target)) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* Mini logo: once the big home-page logo scrolls out of view, drop a small
     logo into the top-left corner that leads back to the home page. Only set
     up on pages that actually have the big logo (the home page). */
  function setupMiniLogo() {
    var mainLogo = document.querySelector(".logo");
    if (!mainLogo) return;

    var link = document.createElement("a");
    link.className = "site-nav-home";
    link.href = root + "/index.html";
    link.setAttribute("aria-label", "Dot's Cafe — home");

    var svg = mainLogo.cloneNode(true);
    svg.removeAttribute("width");
    svg.removeAttribute("height");
    svg.classList.remove("logo");
    svg.classList.add("site-nav-home-logo");
    link.appendChild(svg);
    document.body.appendChild(link);

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        document.body.classList.toggle("logo-hidden", !entries[0].isIntersecting);
      });
      io.observe(mainLogo);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupMiniLogo);
  } else {
    setupMiniLogo();
  }

  /* Legibility over full-bleed photos: a gradient scrim fades in and the nav
     text turns white whenever the fixed nav band sits over the photo gallery. */
  var scrim = document.createElement("div");
  scrim.className = "top-scrim";
  document.body.appendChild(scrim);

  /* The band starts level with the page's bottom margin and rides up with the
     scroll until it pins. styles.css owns both positions and does the clamping
     in a max(); all this has to publish is how far the page has scrolled, which
     keeps the breakpoints' differing insets working without repeating them
     here. */
  function publishScroll() {
    var docEl = document.documentElement;
    var y = window.pageYOffset || docEl.scrollTop || 0;
    docEl.style.setProperty("--scroll-y", y + "px");
  }

  function update() {
    // Full-bleed photo regions: the location pages' gallery, and the home
    // page's featured-drink hero and location split.
    var regions = document.querySelectorAll(
      ".gallery, .home-hero, .locations-split"
    );
    /* Measure the nav rather than assuming a fixed offset — it no longer sits
       at a constant height, so the line being tested has to follow it. */
    var band = nav.getBoundingClientRect();
    var navY = band.height ? band.top + band.height / 2 : 40;
    var over = false;
    for (var i = 0; i < regions.length; i++) {
      var r = regions[i].getBoundingClientRect();
      // Only go "over photos" when a photo actually covers the nav's line —
      // not when the region merely ends there (which happens as the beige
      // footer scrolls into view).
      if (r.top <= navY && r.bottom > navY) {
        over = true;
        break;
      }
    }
    document.body.classList.toggle("over-photos", over);
  }

  /* One rAF-batched pass per frame: the scroll offset has to land before the
     nav's position is measured, or navY lags a frame behind the band. */
  var queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () {
      queued = false;
      publishScroll();
      update();
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  /* Straight away, not just on first scroll: a reload can restore a scroll
     position, and the band would otherwise open at full offset and jump. */
  publishScroll();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
})();

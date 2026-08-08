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

  function update() {
    var gallery = document.querySelector(".gallery");
    var over = false;
    if (gallery) {
      var r = gallery.getBoundingClientRect();
      // The nav text sits ~40px down the viewport. Only go "over photos" when
      // a photo actually covers that line — not when the gallery merely ends
      // there (which happens as the beige footer scrolls into view).
      var NAV_Y = 40;
      over = r.top <= NAV_Y && r.bottom > NAV_Y;
    }
    document.body.classList.toggle("over-photos", over);
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", update);
  } else {
    update();
  }
})();

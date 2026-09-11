/* Featured drinks — the full-bleed slideshow at the top of the home page.
 *
 * Usage: as the first thing in <body>, after the nav mount:
 *
 *   <div data-featured-hero></div>
 *   <script src="featured.js" data-root="."></script>
 *
 * To change what the hero shows, edit FEATURED below — everything else (slide
 * count, dots, whether it animates at all) follows from the length of that
 * array. One entry is a valid hero: it renders as a still, with no dots and
 * nothing advancing.
 *
 * Keyboard: Left/Right step through the set and Home/End jump to its ends,
 * both when a dot has focus and when nothing in the carousel does (as long as
 * the hero is on screen). Focusing a dot also pauses the sweep, so arrowing
 * through at your own pace does not fight the timer.
 *
 * Timing lives in the CSS: the active dot stretches into a progress bar whose
 * fill sweeps over INTERVAL, and the slide advances on that animation's end.
 * So there is no JS timer to keep in step with the bar, and under
 * prefers-reduced-motion the media query removes the animation, which leaves
 * the hero on its first slide with the dots as the way through.
 *
 *   photo   path to the image, relative to the site root. Put a web-sized
 *           copy in assets/featured/ rather than pointing at the press
 *           original in assets/gallery/ — those are ~3400px and 6MB each,
 *           and this is the first thing every visitor downloads. 2000px wide
 *           at quality ~68 lands under 500KB:
 *             sips -Z 2000 -s format jpeg -s formatOptions 68 SRC --out DST
 *   name    the drink, as it reads on the menu
 *   blurb   one line under the name
 *   alt     describes the photo for screen readers and when it fails to load
 *   special true adds the "Current special" chip; leave it off for a drink
 *           that is simply on the menu rather than limited
 */
(function () {
  var script = document.currentScript;
  var root = (script && script.dataset.root) || ".";

  var FEATURED = [
    {
      photo: "assets/featured/cherry-coke-float.jpg",
      name: "Cherry Coke Float with Espresso Whipped Cream",
      blurb:
        "Mexican Coke or Coke Zero over ice with cherry syrup, topped off " +
        "with espresso-infused vanilla whipped cream and a maraschino cherry.",
      alt:
        "A cherry Coke float in a glass, topped with espresso whipped cream " +
        "and a maraschino cherry, on a marble ledge in sunlight",
      special: true,
    },
    {
      photo: "assets/featured/caramel-apple-cold-brew-matcha.jpg",
      name: "Caramel Apple Cold Brew or Matcha",
      blurb:
        "Housemade apple basil caramel syrup in a cold brew or matcha latte, " +
        "with cardamom vanilla cold foam, an apple chip and nutmeg.",
      alt:
        "A caramel apple matcha and a caramel apple cold brew seen from above " +
        "on a green table, each capped with cold foam, an apple chip and nutmeg",
      special: true,
    },
    {
      photo: "assets/featured/smoky-rose-cardamom-latte.jpg",
      name: "Smoky Rose Cardamom Latte",
      blurb: "Espresso and steamed milk with housemade cardamom syrup.",
      alt: "A Smoky Rose Cardamom Latte on the counter at Dot's",
      special: true,
    },
    {
      photo: "assets/featured/iced-latte-raspberry-cold-foam.jpg",
      name: "Iced Latte with Raspberry Cold Foam",
      blurb: "Iced espresso under a cap of raspberry cold foam.",
      alt: "An iced latte topped with raspberry cold foam",
      special: true,
    },
  ];

  /* How long each slide holds before the next one fades in. */
  var INTERVAL = 6000;

  var mount = document.querySelector("[data-featured-hero]");
  if (!mount || !FEATURED.length) return;


  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  var slides = FEATURED.map(function (d, i) {
    return (
      '<figure class="hero-slide' + (i === 0 ? " is-active" : "") + '"' +
      (i === 0 ? "" : ' aria-hidden="true"') +
      ">" +
      /* The first photo is the page's largest above-the-fold asset, so it
         loads eagerly and decodes off the main thread; the rest can wait. */
      '<img src="' + root + "/" + esc(d.photo) + '" alt="' + esc(d.alt || "") +
      '" loading="' + (i === 0 ? "eager" : "lazy") + '" decoding="async">' +
      '<figcaption class="hero-caption">' +
      (d.special ? '<span class="badge">Current special</span>' : "") +
      '<h2 class="hero-name">' + esc(d.name) + "</h2>" +
      (d.blurb ? '<p class="hero-blurb">' + esc(d.blurb) + "</p>" : "") +
      "</figcaption>" +
      "</figure>"
    );
  }).join("");

  /* Dots double as the only visible progress cue, so they are worth having
     whenever there is more than one slide — including under reduced motion,
     where they become the sole way through the set. */
  var dots = "";
  if (FEATURED.length > 1) {
    dots =
      '<div class="hero-dots" role="tablist" aria-label="Featured drinks">' +
      FEATURED.map(function (d, i) {
        return (
          '<button type="button" role="tab" class="hero-dot' +
          (i === 0 ? " is-active" : "") +
          '" data-index="' + i + '"' +
          ' aria-selected="' + (i === 0 ? "true" : "false") + '"' +
          /* Roving tabindex: the set is one stop in the tab order and the
             arrow keys move within it, rather than every dot being its own
             stop. */
          ' tabindex="' + (i === 0 ? "0" : "-1") + '"' +
          ' aria-label="' + esc(d.name) + '">' +
          /* The active dot stretches into a bar and this fill sweeps across it
             as the slide's time runs down. */
          '<span class="hero-dot-fill"></span>' +
          "</button>"
        );
      }).join("") +
      "</div>";
  }

  var section = document.createElement("section");
  section.className = "home-hero";
  section.setAttribute("aria-roledescription", "carousel");
  section.setAttribute("aria-label", "Featured drinks");
  section.innerHTML = slides + dots;
  mount.replaceWith(section);

  /* One source of truth for the duration: the CSS animation reads it from this
     property, and the slide advances when that animation ends. Driving the two
     from separate clocks would let them drift apart the moment the progress bar
     is paused mid-sweep. */
  section.style.setProperty("--hero-interval", INTERVAL + "ms");

  var figures = section.querySelectorAll(".hero-slide");
  var buttons = section.querySelectorAll(".hero-dot");
  var current = 0;

  function show(next) {
    if (next === current) return;
    figures[current].classList.remove("is-active");
    figures[current].setAttribute("aria-hidden", "true");
    figures[next].classList.add("is-active");
    figures[next].removeAttribute("aria-hidden");
    if (buttons.length) {
      buttons[current].classList.remove("is-active");
      buttons[current].setAttribute("aria-selected", "false");
      buttons[current].setAttribute("tabindex", "-1");
      buttons[next].classList.add("is-active");
      buttons[next].setAttribute("aria-selected", "true");
      buttons[next].setAttribute("tabindex", "0");
    }
    current = next;
  }

  function advance() {
    show((current + 1) % FEATURED.length);
  }

  /* Pausing is a class: it maps to animation-play-state, which freezes the bar
     exactly where it is and resumes from there — the remaining time survives a
     hover instead of being rounded up to a fresh full interval. */
  function stop() {
    section.classList.add("is-paused");
  }

  function start() {
    section.classList.remove("is-paused");
  }

  /* Each slide change moves .is-active to another dot, which cancels the old
     fill's animation and starts the new one from zero — so a manual jump gets
     a full turn on screen without any clock to reset by hand. */
  section.addEventListener("animationend", function (e) {
    if (e && e.animationName === "hero-dot-progress") advance();
  });

  for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      show(Number(this.dataset.index));
    });
  }

  function step(delta) {
    show((current + delta + FEATURED.length) % FEATURED.length);
  }

  /* Left/Right step, Home/End jump to the ends — the tablist keys, since the
     dots are a tablist. Returns whether it consumed the key. */
  function handleKey(e) {
    if (FEATURED.length < 2) return false;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return false;
    if (e.key === "ArrowLeft") step(-1);
    else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Home") show(0);
    else if (e.key === "End") show(FEATURED.length - 1);
    else return false;
    if (e.preventDefault) e.preventDefault();
    return true;
  }

  /* Focus is inside the carousel: move it along with the selection, so the
     roving tabindex and the focus ring stay on the selected dot. */
  section.addEventListener("keydown", function (e) {
    if (handleKey(e) && buttons.length && buttons[current].focus) {
      buttons[current].focus();
    }
  });

  /* Nothing in the carousel focused: the arrows still work, so the slideshow
     is reachable without tabbing to a dot first. Guarded two ways — keys that
     originate inside the section are already handled above, and the hero has
     to actually be on screen, so arrows do not silently shuffle a slideshow
     the reader has scrolled past. Vertical arrows are left alone; they scroll
     the page. */
  document.addEventListener("keydown", function (e) {
    if (section.contains && section.contains(e.target)) return;
    var r = section.getBoundingClientRect
      ? section.getBoundingClientRect()
      : null;
    var vh = window.innerHeight || 0;
    if (r && vh && (r.bottom < vh * 0.5 || r.top > vh * 0.5)) return;
    handleKey(e);
  });

  /* Hold on hover, so a caption is not yanked away mid-sentence — but only
     over the caption and the dots, NOT the section.

     The section is the whole viewport. Listening there meant a pointer resting
     anywhere on the page froze the slideshow indefinitely, and because the nav
     and wordmark are siblings painted on top rather than descendants, crossing
     them fired mouseleave then mouseenter — pausing and resuming as the
     pointer moved. That is the stop-start.

     Gated on a real pointer besides: on touch a tap fires mouseenter with no
     mouseleave to follow, which would park it for good. */
  var hoverable =
    window.matchMedia && window.matchMedia("(hover: hover)").matches;
  if (hoverable) {
    var zones = [];
    var captions = section.querySelectorAll(".hero-caption");
    var dotWrap = section.querySelectorAll(".hero-dots");
    var z;
    for (z = 0; z < captions.length; z++) zones.push(captions[z]);
    for (z = 0; z < dotWrap.length; z++) zones.push(dotWrap[z]);
    for (z = 0; z < zones.length; z++) {
      zones[z].addEventListener("mouseenter", stop);
      zones[z].addEventListener("mouseleave", start);
    }
  }
  section.addEventListener("focusin", stop);
  section.addEventListener("focusout", start);

  /* Nothing to animate in a background tab. Browsers throttle animations there
     anyway; pausing outright means the bar reflects real elapsed time rather
     than resuming mid-sweep against a slide that never moved. */
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) stop();
    else start();
  });

  if (document.hidden) stop();
})();

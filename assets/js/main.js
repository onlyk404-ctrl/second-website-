/* =========================================================================
   HARSH — Portfolio · main.js
   Vanilla JS. No dependencies.
   Modules:
     01. Helpers
     02. Preloader
     03. Reveal on scroll
     04. Split text + scroll-linked word lighting
     05. Parallax
     06. Scroll-linked marquee
     07. Pinned horizontal gallery
     08. Infinite tickers
     09. Testimonial background words
     10. Custom cursor
     11. Case-study hover preview
     12. Copy to clipboard
     13. Mobile menu
     14. Active dock link (scrollspy)
     15. Archive filters + lightbox
     16. Misc (year, scroll lock)
   ========================================================================= */
(function () {
  "use strict";

  /* ------------------------------------------------------------ 01. HELPERS */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const clamp = (v, min = 0, max = 1) => Math.min(max, Math.max(min, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const vh = () => window.innerHeight;

  /* ------------------------------------------------------- 01b. DOM REFS */
  const gallery = $(".gallery");
  const track = $("[data-track]");
  const galleryIndex = $("[data-gallery-index]");

  /* ----------------------------------------------------------- 02. PRELOADER */
  const loader = $("#loader");
  const loaderBar = $("#loaderBar");
  const loaderCount = $("#loaderCount");

  function runLoader() {
    if (!loader) return finishLoad();

    let progress = 0;
    let assetsReady = document.readyState === "complete";
    window.addEventListener("load", () => { assetsReady = true; }, { once: true });

    const finish = () => {
      loader.classList.add("is-done");
      finishLoad();
    };

    const tick = () => {
      // ease the bar towards 100%, but never past 94% until assets are in
      progress += Math.random() * 14 + 5;
      const ceiling = assetsReady ? 100 : 94;
      const p = Math.min(progress, ceiling);
      if (loaderBar) loaderBar.style.width = p + "%";
      if (loaderCount) loaderCount.textContent = String(Math.floor(p)).padStart(2, "0");

      if (p >= 100) {
        setTimeout(finish, 300);
      } else {
        setTimeout(tick, assetsReady || p < 90 ? 90 + Math.random() * 110 : 140);
      }
    };

    setTimeout(tick, 160);

    // safety net: never hold the visitor hostage
    setTimeout(() => {
      if (loader && !loader.classList.contains("is-done")) finish();
    }, 4500);
  }

  let hasFinished = false;
  function finishLoad() {
    if (hasFinished) return;
    hasFinished = true;
    document.body.classList.remove("is-loading");
    document.body.classList.add("is-ready");
    setupReveals();
    requestAnimationFrame(() => measure());
  }

  /* ----------------------------------------------------- 03. REVEAL ON SCROLL */
  // blocks that don't need data-attributes in the markup
  $$(".quote, .case, .tile, .archive__head > *").forEach((el) => el.classList.add("reveal"));

  /**
   * Reveal-on-scroll.
   * Deliberately not IntersectionObserver-only: if the visitor jump-scrolls past
   * a block (dock links, hash links, restored scroll position) the block must
   * still end up visible. Every pending item is checked against the viewport
   * bottom and revealed the moment it is at or above that line — which also
   * covers items that were skipped entirely.
   */
  let pendingReveals = [];
  let revealThrottle = 0;

  function setupReveals() {
    pendingReveals = $$(".reveal").filter((el) => !el.classList.contains("is-in"));
    if (reduceMotion) {
      pendingReveals.forEach((el) => el.classList.add("is-in"));
      pendingReveals = [];
      if (gallery) gallery.classList.add("is-in");
      return;
    }
    updateReveals(true);
  }

  function updateReveals(force) {
    if (revealThrottle++ % 3 !== 0 && !force) return;

    if (pendingReveals.length) {
      const line = vh() * 0.92;
      const batch = [];
      pendingReveals = pendingReveals.filter((el) => {
        if (el.getBoundingClientRect().top < line) {
          batch.push(el);
          return false;
        }
        return true;
      });
      batch.forEach((el, i) => {
        if (i < 8) el.style.transitionDelay = (i * 0.07).toFixed(2) + "s";
        el.classList.add("is-in");
      });
    }

    if (gallery && !gallery.classList.contains("is-in")) {
      const r = gallery.getBoundingClientRect();
      if (r.top < vh() * 0.9 && r.bottom > 0) gallery.classList.add("is-in");
    }
  }

  /* --------------------------------------------- 04. SPLIT TEXT + WORD LIGHT */
  const splitTargets = $$('[data-split="words"]');
  splitTargets.forEach((el) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const words = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          words.forEach((w) => {
            if (/^\s+$/.test(w)) {
              frag.appendChild(document.createTextNode(" "));
            } else if (w.length) {
              const span = document.createElement("span");
              span.className = "word";
              span.textContent = w;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1 && child.tagName !== "BR") {
          walk(child);
        }
      });
    };
    walk(el);
  });

  function updateWords() {
    for (let s = 0; s < splitTargets.length; s++) {
      const el = splitTargets[s];
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh() + 200) continue;
      const total = r.height + vh() * 0.35;
      const p = clamp((vh() * 0.86 - r.top) / total);
      if (!el._words) el._words = Array.from(el.querySelectorAll(".word"));
      const words = el._words;
      const lit = Math.round(p * words.length * 1.12);
      for (let i = 0; i < words.length; i++) {
        const on = i < lit;
        if (on !== words[i].classList.contains("is-lit")) words[i].classList.toggle("is-lit", on);
      }
    }
  }

  /* ------------------------------------------------------------ 05. PARALLAX */
  const parallaxItems = $$("[data-parallax]");

  /* ------------------------------------------------- 06. SCROLL MARQUEE */
  const marqueeRows = $$("[data-marquee-scroll]");

  /* -------------------------------------------------- 09. QUOTES BG WORDS */
  const quoteWords = $$("[data-quotes-word]");

  /* ---------------------------------------------------- 07. GALLERY MEASURE */
  let galleryDistance = 0;
  let cards = [];

  function measure() {
    if (gallery && track && window.innerWidth > 980) {
      cards = $$(".pcard", track);
      galleryDistance = Math.max(0, track.scrollWidth - window.innerWidth + 40);
      gallery.style.height = vh() + galleryDistance + "px";
    } else if (gallery) {
      gallery.style.height = "";
      if (track) track.style.transform = "";
    }
    measureTickers();
  }

  /* ---------------------------------------------------- 08. INFINITE TICKERS */
  function buildTicker(el) {
    if (el.dataset.tickerReady === "1") return;
    const original = el.innerHTML;
    let k = 2;
    el.innerHTML = original.repeat(k);
    let guard = 0;
    while (el.scrollWidth < window.innerWidth * 2.1 && guard < 8) {
      k += 2;
      el.innerHTML = original.repeat(k);
      guard++;
    }
    el.dataset.tickerReady = "1";
  }
  function measureTickers() {
    $$("[data-ticker]").forEach(buildTicker);
  }

  /* ------------------------------------------------------ 10. CUSTOM CURSOR */
  let cursor, cursorRing;
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  function initCursor() {
    cursor = $("#cursor");
    if (!cursor || !canHover || reduceMotion) return;
    cursorRing = $(".cursor__ring", cursor);

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
      },
      { passive: true }
    );

    const hoverTargets = "a, button, .tile, .case__link, .filters button";
    document.addEventListener("mouseover", (e) => {
      const hit = e.target.closest(hoverTargets);
      cursor.classList.toggle("is-hover", !!hit);
      cursor.classList.toggle("is-label", !!e.target.closest('[data-cursor="view"]'));
    });
    document.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) cursor.classList.remove("is-hover");
    });
  }

  /* --------------------------------------------- 11. CASE HOVER PREVIEW */
  const previewList = $("[data-preview-list]");
  let previewX = 0,
    previewY = 0,
    activeCase = null;

  if (previewList && canHover) {
    previewList.addEventListener("mousemove", (e) => {
      const li = e.target.closest(".case");
      if (li !== activeCase) {
        if (activeCase) activeCase.classList.remove("is-previewing");
        activeCase = li;
        if (activeCase) activeCase.classList.add("is-previewing");
      }
      previewX = e.clientX;
      previewY = e.clientY;
    });
    previewList.addEventListener("mouseleave", () => {
      if (activeCase) activeCase.classList.remove("is-previewing");
      activeCase = null;
    });
  }

  /* ----------------------------------------------------- 12. COPY EMAIL/PHONE */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      const original = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        const ta = document.createElement("textarea");
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); } catch (e) {}
        document.body.removeChild(ta);
      }
      btn.classList.add("is-copied");
      btn.innerHTML = "Copied!";
      setTimeout(() => {
        btn.classList.remove("is-copied");
        btn.innerHTML = original;
      }, 1600);
    });
  });

  /* --------------------------------------------------------- 13. MOBILE MENU */
  const menuBtn = $("#menuBtn");
  const menu = $("#menu");
  function closeMenu() {
    if (!menu || !menuBtn) return;
    menu.hidden = true;
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", () => {
      const open = menu.hidden;
      menu.hidden = !open;
      menuBtn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    $$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  /* ------------------------------------------------------ 14. SCROLLSPY DOCK */
  const spyLinks = $$("[data-spy]");
  const spySections = spyLinks
    .map((a) => document.getElementById(a.getAttribute("data-spy")))
    .filter(Boolean);

  function updateSpy() {
    if (!spySections.length) return;
    let current = null;
    spySections.forEach((sec) => {
      const r = sec.getBoundingClientRect();
      if (r.top <= vh() * 0.45 && r.bottom >= vh() * 0.35) current = sec.id;
    });
    spyLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("data-spy") === current));
  }

  /* --------------------------------------------- 15. ARCHIVE FILTERS + LIGHTBOX */
  const filterBar = $(".filters");
  if (filterBar) {
    const tiles = $$(".tile");
    filterBar.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      $$("button", filterBar).forEach((b) => b.classList.toggle("is-active", b === btn));
      const filter = btn.getAttribute("data-filter");
      tiles.forEach((t) => {
        const show = filter === "all" || (t.getAttribute("data-cat") || "").includes(filter);
        t.style.display = show ? "" : "none";
      });
    });
  }

  const lightbox = $("#lightbox");
  if (lightbox) {
    const lbImg = $("img", lightbox);
    const lbTitle = $("[data-lb-title]", lightbox);
    const lbCat = $("[data-lb-cat]", lightbox);
    $$(".tile").forEach((tile) => {
      if (!tile.querySelector("img")) return;
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("role", "button");
      tile.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          tile.click();
        }
      });
      tile.addEventListener("click", () => {
        const img = $("img", tile);
        if (img) lbImg.src = img.src;
        if (lbTitle) lbTitle.textContent = tile.getAttribute("data-title") || "";
        if (lbCat) lbCat.textContent = tile.getAttribute("data-cat") || "";
        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
      });
    });
    const close = () => {
      lightbox.hidden = true;
      document.body.style.overflow = "";
    };
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.closest(".lightbox__close")) close();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.hidden) close();
    });
  }

  /* --------------------------------------------------------------- 16. MISC */
  const yearEl = $("[data-year]");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ------------------------------------------------------ SCROLL LOOP (rAF) */
  let loopQueued = false;
  function onScroll() {
    if (loopQueued) return;
    loopQueued = true;
    requestAnimationFrame(loop);
  }

  function loop() {
    loopQueued = false;

    // reveal-on-scroll (also rescues blocks skipped by jump scrolls)
    updateReveals();

    // word lighting
    updateWords();

    // parallax
    parallaxItems.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      const r = el.getBoundingClientRect();
      if (r.bottom < -300 || r.top > vh() + 300) return;
      const offset = (r.top + r.height / 2 - vh() / 2) * -speed;
      el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
    });

    // scroll-linked marquee
    marqueeRows.forEach((row) => {
      const section = row.closest(".marquee") || row;
      const r = section.getBoundingClientRect();
      const total = r.height + vh();
      const p = clamp((vh() - r.top) / total);
      const dist = Math.max(0, row.scrollWidth - window.innerWidth);
      row.style.transform = `translate3d(${(-p * dist).toFixed(1)}px, 0, 0)`;
    });

    // pinned gallery
    if (gallery && track && galleryDistance > 0 && window.innerWidth > 980) {
      const r = gallery.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - vh()));
      track.style.transform = `translate3d(${(-p * galleryDistance).toFixed(1)}px, 0, 0)`;
      if (galleryIndex && cards.length) {
        const i = Math.min(cards.length - 1, Math.round(p * (cards.length - 1)));
        galleryIndex.textContent = String(i + 1).padStart(2, "0");
      }
    }

    // quotes background words
    if (quoteWords.length) {
      quoteWords.forEach((w, i) => {
        const r = w.getBoundingClientRect();
        const p = (r.top + r.height / 2 - vh() / 2) / vh();
        const dir = i % 2 === 0 ? 1 : -1;
        w.style.transform = `translate3d(${(p * 60 * dir).toFixed(1)}px, 0, 0)`;
      });
    }

    // case preview follow
    if (activeCase) {
      const thumb = $(".case__thumb", activeCase);
      if (thumb) {
        previewX = lerp(previewX, mouseX, 0.16);
        previewY = lerp(previewY, mouseY, 0.16);
        thumb.style.left = previewX + "px";
        thumb.style.top = previewY + "px";
      }
    }

    // cursor
    if (cursorRing) {
      ringX = lerp(ringX, mouseX, 0.18);
      ringY = lerp(ringY, mouseY, 0.18);
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      cursorRing.style.left = ringX - mouseX + "px";
      cursorRing.style.top = ringY - mouseY + "px";
    }

    updateSpy();
  }

  /* ------------------------------------------------------------- BOOTSTRAP */
  function start() {
    initCursor();
    measure();
    measureTickers();
    onScroll();
    runLoader();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measure();
    onScroll();
  });
  window.addEventListener("load", measure);

  if (document.readyState === "complete") {
    start();
  } else {
    document.addEventListener("DOMContentLoaded", start);
  }

  // keep the loop alive while idle as well (smooth cursor / previews)
  (function raf() {
    loop();
    requestAnimationFrame(raf);
  })();
})();

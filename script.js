/* =============================================================
   ICT SHSM site interactions
   Each block is independent — one failing selector won't break
   the rest of the page.
============================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initFlipCards();
  initWheel();
  initCapstoneTabs();
  initPathTabs();
  initAccordion();
  initBadgeReveal();
  initStatCounters();
  initJourneyReveal();
  initHeroParallax();
});

/* ---------- Mobile nav ---------- */
function initNavToggle() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("primaryNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.classList.toggle("open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- "What is it" flip cards ---------- */
function initFlipCards() {
  document.querySelectorAll("[data-flip]").forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("flipped");
    });
  });
}

/* ---------- 5 Components wheel ---------- */
function initWheel() {
  const buttons = document.querySelectorAll(".wheel-btn");
  const panels = document.querySelectorAll(".wheel-panel");
  if (!buttons.length) return;

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.component;

      buttons.forEach((b) => {
        b.classList.toggle("active", b === btn);
        b.setAttribute("aria-selected", String(b === btn));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `panel-${target}`);
      });
    });
  });
}

/* ---------- Capstone project chooser ---------- */
function initCapstoneTabs() {
  const tabs = document.querySelectorAll(".capstone-tab");
  const panels = document.querySelectorAll(".capstone-panel");
  const shotIcon = document.getElementById("capShotIcon");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const type = tab.dataset.cap;

      tabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("active", panel.id === `cap-${type}`);
      });

      if (shotIcon) {
        const iconMap = {
          app: "#icon-code",
          website: "#icon-network",
          game: "#icon-media",
          media: "#icon-palette",
          hardware: "#icon-chip",
        };
        shotIcon.setAttribute("href", iconMap[type] || "#icon-code");
      }
    });
  });
}

/* ---------- Choose Your Path selector ---------- */
function initPathTabs() {
  const tabs = document.querySelectorAll(".path-tab");
  const cards = document.querySelectorAll(".path-card");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.path;

      tabs.forEach((t) => {
        t.classList.toggle("active", t === tab);
        t.setAttribute("aria-selected", String(t === tab));
      });

      cards.forEach((card) => {
        card.classList.toggle("active", card.id === `path-${target}`);
      });
    });
  });
}

/* ---------- FAQ accordion ---------- */
function initAccordion() {
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    const panel = trigger.nextElementSibling;
    if (!panel) return;

    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";

      // Close any other open item for a clean single-open accordion.
      document.querySelectorAll(".accordion-trigger").forEach((other) => {
        if (other !== trigger) {
          other.setAttribute("aria-expanded", "false");
          other.nextElementSibling.style.maxHeight = null;
        }
      });

      trigger.setAttribute("aria-expanded", String(!isOpen));
      panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
    });
  });
}

/* ---------- Milestone badge reveal ---------- */
function initBadgeReveal() {
  document.querySelectorAll("[data-badge]").forEach((badge) => {
    badge.addEventListener("click", () => {
      badge.classList.toggle("open");
    });
  });
}

/* ---------- Animated stat counters ---------- */
function initStatCounters() {
  const stats = document.querySelectorAll(".stat-number");
  if (!stats.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  stats.forEach((stat) => observer.observe(stat));
}

/* ---------- Journey scroll story ---------- */
function initJourneyReveal() {
  const steps = document.querySelectorAll(".journey-step");
  if (!steps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 }
  );

  steps.forEach((step) => observer.observe(step));
}

/* ---------- Subtle hero "tech signals" parallax ---------- */
function initHeroParallax() {
  const layer = document.getElementById("heroSignals");
  const hero = document.getElementById("hero");
  if (!layer || !hero) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      // Only move the grid while the hero is actually on screen.
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        const shift = rect.top * 0.06;
        layer.style.transform = `translateY(${shift}px)`;
      }
      ticking = false;
    });
  });
}

/* =============================================================
   ICT SHSM site interactions
   Each block is independent — one failing selector won't break
   the rest of the page.
============================================================= */



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

/* ---------- Site-wide background signal grid ----------
   Purely decorative: pointer-events is set in CSS and it sits
   behind everything with a negative z-index, so it can never
   intercept a click or break layout. It only ever reads scroll
   position — it never listens for clicks/taps itself. */
function initSiteSignals() {
  const layer = document.getElementById("siteSignals");
  if (!layer) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  let ticking = false;

  window.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;

    requestAnimationFrame(() => {
      const shift = window.scrollY * 0.04;
      layer.style.backgroundPosition = `0 ${-shift}px, 0 ${-shift}px`;
      ticking = false;
    });
  });
}

/* ---------- Capstone preview modal ----------
   Empty container for now — real screenshots/video get dropped
   into #previewModalBody later. Closes via X, backdrop, or Escape. */
function initPreviewModal() {
  const modal = document.getElementById("previewModal");
  if (!modal) return;

  const titleEl = document.getElementById("previewModalTitle");
  const bodyEl = document.getElementById("previewModalBody");
  let lastTrigger = null;

  const typeLabels = {
    app: "App preview",
    website: "Website preview",
    game: "Game preview",
    media: "Media project preview",
    hardware: "Hardware project preview",
  };

  function openModal(type, triggerEl) {
    lastTrigger = triggerEl || null;
    titleEl.textContent = typeLabels[type] || "Project preview";
    bodyEl.innerHTML = ""; // No content yet — wire in real media here later.
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modal.querySelector(".preview-modal-close").focus();
  }

  function closeModal() {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (lastTrigger) lastTrigger.focus();
  }

  document.querySelectorAll("[data-preview-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const activeTab = document.querySelector(".capstone-tab.active");
      const type = activeTab ? activeTab.dataset.cap : "app";
      openModal(type, trigger);
    });
  });

  modal.querySelectorAll("[data-modal-close]").forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
  });
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

/* ---------- Showcase Image Carousel ---------- */
function initShowcaseCarousel() {
  const imgEl = document.getElementById("showcaseImg");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");

  if (!imgEl || !prevBtn || !nextBtn) return;

  // List all your image URLs or file paths here; use width 16:height 9
  const images = [
    "https://u.cubeupload.com/219847/looknohands.png",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBomjdYkbdba6DBmhUiOKcDItPJKCryGGgeCyKt3NVvw&s=10" // Put your second image path or URL here
  ];

  let currentIndex = 0;

  function updateImage(index) {
    currentIndex = (index + images.length) % images.length;
    imgEl.src = images[currentIndex];
  }

  prevBtn.addEventListener("click", () => updateImage(currentIndex - 1));
  nextBtn.addEventListener("click", () => updateImage(currentIndex + 1));
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", initShowcaseCarousel);
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
  initSiteSignals();
  initPreviewModal();
  initUniversityCarousel(); // <-- add this line
});


/* ---------- University recognition marquee ----------
   To add a university, just add another { name, logo, url } object.
   The list is rendered twice back-to-back so the CSS animation
   (translateX(-50%)) can loop seamlessly forever. */
const universityPartners = [
  { name: "University of Toronto", logo: "https://example.com/logos/uoft.png", url: "https://www.utoronto.ca/" },
  { name: "York University", logo: "https://example.com/logos/york.png", url: "https://www.yorku.ca/" },
  { name: "Toronto Metropolitan University", logo: "https://example.com/logos/tmu.png", url: "https://www.torontomu.ca/" },
  { name: "University of Waterloo", logo: "https://example.com/logos/waterloo.png", url: "https://uwaterloo.ca/" },
  { name: "Seneca Polytechnic", logo: "https://example.com/logos/seneca.png", url: "https://www.senecapolytechnic.ca/" },
];

function initUniversityCarousel() {
  const track = document.getElementById("uniTrack");
  if (!track) return;

  const logoHtml = (u) => `
    <a class="uni-logo" href="${u.url}" target="_blank" rel="noopener noreferrer" aria-label="${u.name} — opens in a new tab">
      <img src="${u.logo}" alt="${u.name} logo" loading="lazy" />
    </a>`;

  // Duplicate the whole list once so translateX(-50%) loops seamlessly.
  track.innerHTML = universityPartners.map(logoHtml).join("") + universityPartners.map(logoHtml).join("");
}

const body = document.body;
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
const imageDimensions = window.PORTFOLIO_IMAGE_DIMENSIONS || {};
const backstageImages = Array.isArray(window.PORTFOLIO_BACKSTAGE_IMAGES) ? window.PORTFOLIO_BACKSTAGE_IMAGES : [];
const selectedContainer = document.querySelector("#selected-projects");
const archiveContainer = document.querySelector("#archive-projects");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const heroName = document.querySelector(".hero-name");
const heroNameSpans = heroName ? Array.from(heroName.querySelectorAll("span")) : [];

function fitHeroName() {
  if (!heroName || !heroNameSpans.length) return;

  heroName.style.removeProperty("--hero-fit-size");
  const style = window.getComputedStyle(heroName);
  const availableWidth = heroName.clientWidth
    - Number.parseFloat(style.paddingLeft)
    - Number.parseFloat(style.paddingRight);
  const widestWord = Math.max(...heroNameSpans.map((span) => span.scrollWidth));

  if (widestWord > availableWidth) {
    const currentSize = Number.parseFloat(style.fontSize);
    const fittedSize = Math.max(1, Math.floor(currentSize * availableWidth / widestWord));
    heroName.style.setProperty("--hero-fit-size", `${fittedSize}px`);
  }
}

let heroFitFrame = 0;
function scheduleHeroFit() {
  window.cancelAnimationFrame(heroFitFrame);
  heroFitFrame = window.requestAnimationFrame(fitHeroName);
}

if (heroName) {
  scheduleHeroFit();
  window.addEventListener("resize", scheduleHeroFit, { passive: true });
  window.addEventListener("orientationchange", scheduleHeroFit, { passive: true });
  document.fonts?.ready.then(scheduleHeroFit);
}

function projectCard(project, index) {
  const article = document.createElement("article");
  article.className = `project-card ${project.selected ? "project-card--featured" : "project-card--archive"}`;
  article.id = `project-${project.slug}`;
  const href = `projects/${project.slug}.html`;
  const path = project.featured[0];
  const dimensions = imageDimensions[path];

  article.innerHTML = `
    <a class="project-card-link" href="${href}" aria-label="View ${project.title} project">
      <figure class="project-card-media">
        <img alt="${project.title} fashion production" decoding="async">
        <figcaption class="project-card-caption">
          <span class="project-card-number">${String(project.order).padStart(2, "0")}</span>
          <h3 class="project-card-title">${project.title}</h3>
          <span class="project-card-action" aria-hidden="true">VIEW PROJECT ↗</span>
        </figcaption>
      </figure>
    </a>`;

  const image = article.querySelector("img");
  image.src = path;
  image.loading = project.selected && index < 2 ? "eager" : "lazy";
  if (project.selected && index === 0) image.fetchPriority = "high";
  if (dimensions) {
    image.width = dimensions.width;
    image.height = dimensions.height;
  }
  image.addEventListener("error", () => article.classList.add("image-error"), { once: true });
  return article;
}

projects.forEach((project, index) => {
  const target = project.selected ? selectedContainer : archiveContainer;
  target?.append(projectCard(project, index));
});

const horizontalShowcase = document.querySelector("#selected-showcase");
const horizontalViewport = horizontalShowcase?.querySelector(".horizontal-showcase-viewport");
const horizontalTrack = horizontalShowcase?.querySelector(".horizontal-showcase-track");
const desktopShowcase = window.matchMedia("(min-width: 901px)");
let showcaseDistance = 0;
let showcaseFrame = 0;

function measureShowcase() {
  if (!horizontalShowcase || !horizontalViewport || !horizontalTrack) return;

  horizontalTrack.style.removeProperty("transform");
  if (!desktopShowcase.matches || prefersReducedMotion.matches) {
    horizontalShowcase.style.removeProperty("height");
    showcaseDistance = 0;
    return;
  }

  showcaseDistance = Math.max(0, horizontalTrack.scrollWidth - horizontalViewport.clientWidth);
  horizontalShowcase.style.height = `${window.innerHeight + showcaseDistance}px`;
  updateShowcase();
}

function updateShowcase() {
  showcaseFrame = 0;
  if (!horizontalShowcase || !horizontalTrack || !desktopShowcase.matches || prefersReducedMotion.matches) return;
  const scrollRange = Math.max(1, horizontalShowcase.offsetHeight - window.innerHeight);
  const progress = Math.min(1, Math.max(0, -horizontalShowcase.getBoundingClientRect().top / scrollRange));
  horizontalTrack.style.transform = `translate3d(${-showcaseDistance * progress}px, 0, 0)`;
}

function scheduleShowcaseUpdate() {
  if (!showcaseFrame) showcaseFrame = window.requestAnimationFrame(updateShowcase);
}

if (horizontalShowcase && horizontalViewport && horizontalTrack) {
  measureShowcase();
  window.addEventListener("scroll", scheduleShowcaseUpdate, { passive: true });
  window.addEventListener("resize", measureShowcase, { passive: true });
  window.addEventListener("orientationchange", measureShowcase, { passive: true });
  desktopShowcase.addEventListener("change", measureShowcase);
  prefersReducedMotion.addEventListener("change", measureShowcase);
  document.fonts?.ready.then(measureShowcase);
  if ("ResizeObserver" in window) new ResizeObserver(measureShowcase).observe(horizontalTrack);
}

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileClose = document.querySelector(".mobile-menu-close");

function openMenu() {
  mobileMenu?.classList.add("is-open");
  mobileMenu?.setAttribute("aria-hidden", "false");
  menuButton?.setAttribute("aria-expanded", "true");
  body.classList.add("menu-open");
}

function closeMenu() {
  mobileMenu?.classList.remove("is-open");
  mobileMenu?.setAttribute("aria-hidden", "true");
  menuButton?.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
}

menuButton?.addEventListener("click", openMenu);
mobileClose?.addEventListener("click", closeMenu);
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

const siteHeader = document.querySelector(".site-header");
let anchorNavigationToken = 0;

function anchorOffset() {
  return Math.ceil(siteHeader?.getBoundingClientRect().height || 0) + 8;
}

function alignToAnchor(target, behavior = "auto") {
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - anchorOffset());
  window.scrollTo({ top, behavior });
}

function alignHashWhenStable(hash, behavior = "auto") {
  const targetId = decodeURIComponent(hash.replace(/^#/, ""));
  const target = document.getElementById(targetId);
  if (!target) return;

  const token = ++anchorNavigationToken;
  const realign = (nextBehavior = "auto") => {
    if (token !== anchorNavigationToken) return;
    alignToAnchor(target, nextBehavior);
  };

  requestAnimationFrame(() => requestAnimationFrame(() => realign(behavior)));
  document.fonts?.ready.then(() => realign());
  window.setTimeout(() => realign(), 250);
  window.setTimeout(() => realign(), 900);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = decodeURIComponent(link.hash.slice(1));
    const target = document.getElementById(targetId);
    if (!target) return;

    event.preventDefault();
    closeMenu();
    const smooth = !prefersReducedMotion.matches;
    window.history.pushState(null, "", `#${encodeURIComponent(targetId)}`);
    alignHashWhenStable(`#${encodeURIComponent(targetId)}`, smooth ? "smooth" : "auto");
  });
});

window.addEventListener("hashchange", () => alignHashWhenStable(window.location.hash));
window.addEventListener("pageshow", () => {
  if (window.location.hash) alignHashWhenStable(window.location.hash);
});

if (window.location.hash) alignHashWhenStable(window.location.hash);

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const aboutSlideshow = document.querySelector("#about-slideshow");
const aboutSlideshowCount = document.querySelector("#about-slideshow-count");

if (aboutSlideshow && backstageImages.length) {
  const slides = backstageImages.map((path, index) => {
    const image = document.createElement("img");
    const dimensions = imageDimensions[path];
    image.className = `about-slide${index === 0 ? " is-active" : ""}`;
    image.src = path;
    image.alt = `Behind the scenes of Lola Davila's visual production — image ${index + 1}`;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    if (dimensions) {
      image.width = dimensions.width;
      image.height = dimensions.height;
    }
    aboutSlideshow.append(image);
    return image;
  });

  let activeSlide = 0;
  const updateCounter = () => {
    if (aboutSlideshowCount) {
      aboutSlideshowCount.textContent = `${String(activeSlide + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
    }
  };
  updateCounter();

  if (slides.length > 1 && !prefersReducedMotion.matches) {
    window.setInterval(() => {
      slides[activeSlide].classList.remove("is-active");
      activeSlide = (activeSlide + 1) % slides.length;
      slides[activeSlide].classList.add("is-active");
      updateCounter();
    }, 3600);
  }
}

const heroImage = document.querySelector("#hero-main-image");
if (heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY * .018, 10);
    heroImage.style.transform = `scale(1.025) translate3d(0, ${y}px, 0)`;
  }, { passive: true });
}

const revealTargets = document.querySelectorAll(
  ".section-heading, .project-card, .about-grid, .contact-section > *"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .06 });

  revealTargets.forEach((target) => {
    target.classList.add("reveal");
    observer.observe(target);
  });
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

const cursor = document.querySelector(".cursor");
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });
  document.querySelectorAll("a, button, figure").forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
} else if (cursor) {
  cursor.hidden = true;
}
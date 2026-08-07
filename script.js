const body = document.body;
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
const imageDimensions = window.PORTFOLIO_IMAGE_DIMENSIONS || {};
const backstageImages = Array.isArray(window.PORTFOLIO_BACKSTAGE_IMAGES) ? window.PORTFOLIO_BACKSTAGE_IMAGES : [];
const selectedContainer = document.querySelector("#selected-projects");
const archiveContainer = document.querySelector("#archive-projects");
const layoutPattern = ["layout-large-left", "layout-small-right", "layout-small-left", "layout-large-right"];

function imageFigure(project, path, index, root = "") {
  const figure = document.createElement("figure");
  const dimensions = imageDimensions[path];
  const ratio = dimensions ? dimensions.width / dimensions.height : 1;
  figure.className = ratio >= 1.15 ? "layout-wide" : layoutPattern[index % layoutPattern.length];

  const image = document.createElement("img");
  image.alt = `${project.title} — image ${index + 1}`;
  image.loading = "lazy";
  image.decoding = "async";
  if (dimensions) {
    image.width = dimensions.width;
    image.height = dimensions.height;
  }
  image.src = `${root}${path}`;

  image.addEventListener("error", () => figure.classList.add("image-error"), { once: true });
  figure.append(image);
  return figure;
}

function projectCard(project) {
  const article = document.createElement("article");
  article.className = "project-card";
  article.id = `project-${project.slug}`;
  const href = `projects/${project.slug}.html`;
  const countLabel = `${project.images.length} ${project.images.length === 1 ? "IMAGE" : "IMAGES"}`;

  article.innerHTML = `
    <header class="project-head">
      <span class="project-number">${String(project.order).padStart(2, "0")}</span>
      <h3 class="project-title">
        <a class="project-title-link" href="${href}" aria-label="Open the full ${project.title} project">
          <span>${project.title}</span><span class="arrow" aria-hidden="true">↗</span>
        </a>
      </h3>
      <div class="project-summary">
        <p class="project-description">${project.description}</p>
        <a class="project-action" href="${href}" aria-label="View the full ${project.title} project with ${project.images.length} images">
          VIEW FULL PROJECT — ${countLabel} <span class="arrow" aria-hidden="true">↗</span>
        </a>
      </div>
    </header>
    <div class="project-gallery" aria-label="Selected images from ${project.title}"></div>`;

  const gallery = article.querySelector(".project-gallery");
  project.featured.forEach((path, index) => gallery.append(imageFigure(project, path, index)));
  return article;
}

projects.forEach((project) => {
  const target = project.selected ? selectedContainer : archiveContainer;
  target?.append(projectCard(project));
});

const projectIndex = document.querySelector(".project-index");
const projectIndexLinks = document.querySelector("#project-index-links");
const projectIndexCount = document.querySelector("#project-index-count");

if (projectIndexCount) {
  projectIndexCount.textContent = `${projects.length} PROJECTS`;
}

projects.forEach((project) => {
  if (!projectIndexLinks) return;
  const link = document.createElement("a");
  link.href = `#project-${project.slug}`;
  link.innerHTML = `<span class="project-index-number">${String(project.order).padStart(2, "0")}</span><span class="project-index-name">${project.title}</span>`;
  link.setAttribute("aria-label", `Go to ${project.title}`);
  link.addEventListener("click", () => projectIndex?.removeAttribute("open"));
  projectIndexLinks.append(link);
});

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

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
    projectIndex?.removeAttribute("open");

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
  ".section-heading, .project-head, .project-gallery figure, .about-grid, .contact-section > *"
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

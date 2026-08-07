const body = document.body;
const projects = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
const selectedContainer = document.querySelector("#selected-projects");
const archiveContainer = document.querySelector("#archive-projects");
const layoutPattern = ["layout-large-left", "layout-small-right", "layout-small-left", "layout-large-right"];

function imageFigure(project, path, index, root = "") {
  const figure = document.createElement("figure");
  figure.className = layoutPattern[index % layoutPattern.length];

  const image = document.createElement("img");
  image.src = `${root}${path}`;
  image.alt = `${project.title} — image ${index + 1}`;
  image.loading = "lazy";
  image.decoding = "async";

  const assignLayout = () => {
    const ratio = image.naturalWidth && image.naturalHeight
      ? image.naturalWidth / image.naturalHeight
      : 1;
    figure.classList.remove("layout-wide", ...layoutPattern);
    figure.classList.add(ratio >= 1.15 ? "layout-wide" : layoutPattern[index % layoutPattern.length]);
  };

  image.addEventListener("load", assignLayout, { once: true });
  image.addEventListener("error", () => figure.classList.add("image-error"), { once: true });
  if (image.complete) assignLayout();
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
let stopActiveAnchorAlignment = null;

function anchorOffset() {
  return Math.ceil(siteHeader?.getBoundingClientRect().height || 0) + 8;
}

function alignToAnchor(target, behavior = "auto") {
  const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - anchorOffset());
  window.scrollTo({ top, behavior });
}

function keepAnchorAligned(target, initialDelay = 0) {
  stopActiveAnchorAlignment?.();

  let stopped = false;
  let ready = initialDelay === 0;
  let frameId = 0;
  let remainingImages = 0;
  let resizeObserver = null;
  let settleTimer = 0;

  const userEvents = ["wheel", "touchstart", "pointerdown", "keydown"];

  const realign = () => {
    if (stopped || !ready) return;
    cancelAnimationFrame(frameId);
    frameId = requestAnimationFrame(() => alignToAnchor(target));
  };

  const stop = () => {
    if (stopped) return;
    stopped = true;
    cancelAnimationFrame(frameId);
    clearTimeout(settleTimer);
    resizeObserver?.disconnect();
    userEvents.forEach((eventName) => window.removeEventListener(eventName, stop));
    if (stopActiveAnchorAlignment === stop) stopActiveAnchorAlignment = null;
  };

  stopActiveAnchorAlignment = stop;
  userEvents.forEach((eventName) => window.addEventListener(eventName, stop, { passive: true }));

  const pendingImages = Array.from(document.images).filter((image) => {
    const imageIsBeforeTarget = Boolean(
      image.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING
    );
    return imageIsBeforeTarget && !image.complete;
  });

  remainingImages = pendingImages.length;

  const imageSettled = () => {
    remainingImages -= 1;
    realign();
    if (remainingImages <= 0) {
      clearTimeout(settleTimer);
      settleTimer = window.setTimeout(stop, 500);
    }
  };

  pendingImages.forEach((image) => {
    image.loading = "eager";
    image.addEventListener("load", imageSettled, { once: true });
    image.addEventListener("error", imageSettled, { once: true });
  });

  if ("ResizeObserver" in window) {
    resizeObserver = new ResizeObserver(realign);
    resizeObserver.observe(document.body);
  }

  window.setTimeout(() => {
    ready = true;
    realign();
    if (remainingImages === 0) settleTimer = window.setTimeout(stop, 500);
  }, initialDelay);

  document.fonts?.ready.then(realign);
  window.setTimeout(stop, 15000);
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
    requestAnimationFrame(() => {
      alignToAnchor(target, smooth ? "smooth" : "auto");
      window.history.pushState(null, "", `#${encodeURIComponent(targetId)}`);
      keepAnchorAligned(target, smooth ? 500 : 0);
    });
  });
});

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

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

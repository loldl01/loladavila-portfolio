const body = document.body;
const cursor = document.querySelector(".cursor");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileClose = document.querySelector(".mobile-menu-close");
const mobileLinks = document.querySelectorAll(".mobile-menu a");
const name = document.querySelector(".v20-name");
const heroImage = document.querySelector("#hero-main-image");
const year = document.querySelector("#year");

if (year) year.textContent = new Date().getFullYear();

/* Mobile menu */
function openMenu() {
  if (!mobileMenu || !menuButton) return;
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  body.style.overflow = "hidden";
}

function closeMenu() {
  if (!mobileMenu || !menuButton) return;
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  body.style.overflow = "";
}

menuButton?.addEventListener("click", openMenu);
mobileClose?.addEventListener("click", closeMenu);
mobileLinks.forEach((link) => link.addEventListener("click", closeMenu));

/* Red custom cursor — desktop only */
if (cursor && window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
  });

  document.querySelectorAll("a, button, figure").forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
} else if (cursor) {
  cursor.style.display = "none";
}

/* LOLA and DAVILA move independently through CSS. */

/* Editorial gallery order and composition */
const folderWork = document.querySelector(".folder-work");

if (folderWork) {
  const endingProjects = [
    document.querySelector("#folder-backstage"),
    document.querySelector("#folder-hoja-de-contacto")
  ];

  endingProjects.forEach((project) => {
    if (project) folderWork.appendChild(project);
  });

  folderWork.querySelectorAll(".folder-project").forEach((project, index) => {
    const projectNumber = project.querySelector(".folder-project-head > span");
    if (projectNumber) projectNumber.textContent = String(index + 1).padStart(2, "0");
  });
}

function imageShape(image) {
  const ratio = image.naturalWidth && image.naturalHeight
    ? image.naturalWidth / image.naturalHeight
    : 1;

  if (ratio >= 1.15) return "landscape";
  if (ratio <= 0.85) return "portrait";
  return "square";
}

function editorialOrder(figures) {
  const pattern = [0, 2, 1, 4, 3];
  const ordered = [];

  for (let index = 0; index < figures.length; index += pattern.length) {
    const group = figures.slice(index, index + pattern.length);
    pattern.forEach((position) => {
      if (group[position]) ordered.push(group[position]);
    });
  }

  return ordered;
}

document.querySelectorAll(".folder-gallery").forEach((gallery) => {
  const figures = Array.from(gallery.querySelectorAll("figure"));
  const ordered = editorialOrder(figures);
  const uprightLayouts = [
    "editorial-large-left",
    "editorial-small-right",
    "editorial-small-left",
    "editorial-large-right"
  ];
  const projectName = gallery
    .closest(".folder-project")
    ?.querySelector("h2")
    ?.textContent.trim()
    .replaceAll("_", " ");

  ordered.forEach((figure, index) => {
    const image = figure.querySelector("img");
    const uprightLayout = uprightLayouts[index % uprightLayouts.length];
    const setImageLayout = () => {
      const shape = imageShape(image);
      figure.classList.remove("editorial-wide", ...uprightLayouts);
      figure.classList.add(`editorial-${shape}`);
      figure.classList.add(shape === "landscape" ? "editorial-wide" : uprightLayout);
    };

    figure.classList.add(uprightLayout);
    image.alt = `${projectName || "Production"} — image ${index + 1}`;
    gallery.appendChild(figure);

    if (image.complete) {
      setImageLayout();
    } else {
      image.addEventListener("load", setImageLayout, { once: true });
      image.addEventListener("error", setImageLayout, { once: true });
    }
  });

  gallery.classList.add("is-editorial");
});

/* Very subtle hero drift */
if (heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY * 0.018, 10);
    heroImage.style.transform = `scale(1.025) translate3d(0, ${y}px, 0)`;
  }, { passive: true });
}

/* Reveal */
const revealTargets = document.querySelectorAll(
  ".folder-project-head, .folder-gallery figure, .v24-about-grid, .clean-contact"
);

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  revealTargets.forEach((el) => {
    el.classList.add("clean-reveal");
    observer.observe(el);
  });
} else {
  revealTargets.forEach((el) => el.classList.add("is-visible"));
}

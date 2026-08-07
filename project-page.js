const projectBody = document.body;
const projectList = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
const slug = projectBody.dataset.project;
const currentIndex = projectList.findIndex((item) => item.slug === slug);
const project = projectList[currentIndex];
const main = document.querySelector("#project-content");
const projectLayouts = ["layout-large-left", "layout-small-right", "layout-small-left", "layout-large-right"];

function projectImage(path, index) {
  const figure = document.createElement("figure");
  figure.className = projectLayouts[index % projectLayouts.length];

  const image = document.createElement("img");
  image.src = `../${path}`;
  image.alt = `${project.title} — image ${index + 1}`;
  image.loading = index < 2 ? "eager" : "lazy";
  image.decoding = "async";

  const caption = document.createElement("figcaption");
  caption.textContent = `${String(index + 1).padStart(2, "0")} / ${String(project.images.length).padStart(2, "0")}`;

  const setLayout = () => {
    const ratio = image.naturalWidth && image.naturalHeight
      ? image.naturalWidth / image.naturalHeight
      : 1;
    figure.classList.remove("layout-wide", ...projectLayouts);
    figure.classList.add(ratio >= 1.15 ? "layout-wide" : projectLayouts[index % projectLayouts.length]);
  };

  image.addEventListener("load", setLayout, { once: true });
  image.addEventListener("error", () => figure.classList.add("image-error"), { once: true });
  if (image.complete) setLayout();
  figure.append(image, caption);
  return figure;
}

if (!project || !main) {
  document.title = "Project not found — Lola Davila";
  if (main) main.innerHTML = '<p class="project-page-description">PROJECT NOT FOUND. <a class="back-link" href="../index.html#work">RETURN TO SELECTED WORK</a></p>';
} else {
  document.title = `${project.title} — Lola Davila`;
  const previous = projectList[(currentIndex - 1 + projectList.length) % projectList.length];
  const next = projectList[(currentIndex + 1) % projectList.length];
  const returnHash = project.selected ? "work" : "archive";

  main.innerHTML = `
    <header class="project-page-header">
      <span class="project-number">${String(project.order).padStart(2, "0")}</span>
      <div>
        <p class="project-page-kicker">PROJECT / VISUAL STUDY</p>
        <h1 class="project-page-title">${project.title}</h1>
      </div>
      <div>
        <p class="project-page-description">${project.description}</p>
        <div class="project-meta"><span>${project.images.length} IMAGES</span><span>FULL PROJECT</span></div>
      </div>
    </header>
    <div class="project-page-gallery" aria-label="Full ${project.title} project"></div>
    <nav class="project-nav" aria-label="Project navigation">
      <a href="${previous.slug}.html">← PREVIOUS / ${previous.title}</a>
      <a class="back-projects back-link" href="../index.html#${returnHash}">BACK TO ${project.selected ? "SELECTED WORK" : "ARCHIVE"}</a>
      <a class="next" href="${next.slug}.html">NEXT / ${next.title} →</a>
    </nav>`;

  const gallery = main.querySelector(".project-page-gallery");
  project.images.forEach((path, index) => gallery.append(projectImage(path, index)));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileClose = document.querySelector(".mobile-menu-close");

function closeProjectMenu() {
  mobileMenu?.classList.remove("is-open");
  mobileMenu?.setAttribute("aria-hidden", "true");
  menuButton?.setAttribute("aria-expanded", "false");
  projectBody.classList.remove("menu-open");
}

menuButton?.addEventListener("click", () => {
  mobileMenu?.classList.add("is-open");
  mobileMenu?.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  projectBody.classList.add("menu-open");
});
mobileClose?.addEventListener("click", closeProjectMenu);
mobileMenu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeProjectMenu));

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

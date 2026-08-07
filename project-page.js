const projectBody = document.body;
const projectList = Array.isArray(window.PORTFOLIO_PROJECTS) ? window.PORTFOLIO_PROJECTS : [];
const projectImageDimensions = window.PORTFOLIO_IMAGE_DIMENSIONS || {};
const slug = projectBody.dataset.project;
const currentIndex = projectList.findIndex((item) => item.slug === slug);
const project = projectList[currentIndex];
const main = document.querySelector("#project-content");
const projectLayouts = ["layout-large-left", "layout-small-right", "layout-small-left", "layout-large-right"];

function projectImage(path, index) {
  const figure = document.createElement("figure");
  const dimensions = projectImageDimensions[path];
  const ratio = dimensions ? dimensions.width / dimensions.height : 1;
  figure.className = ratio >= 1.15 ? "layout-wide" : projectLayouts[index % projectLayouts.length];

  const image = document.createElement("img");
  image.alt = `${project.title} — image ${index + 1}`;
  image.loading = index < 2 ? "eager" : "lazy";
  image.decoding = "async";
  if (dimensions) {
    image.width = dimensions.width;
    image.height = dimensions.height;
  }
  const imageUrl = `/${path.split("/").map(encodeURIComponent).join("/")}`;
  image.src = imageUrl;

  const caption = document.createElement("figcaption");
  caption.textContent = `${String(index + 1).padStart(2, "0")} / ${String(project.images.length).padStart(2, "0")}`;

  let retryCount = 0;
  image.addEventListener("error", () => {
    if (retryCount === 0) {
      retryCount += 1;
      image.removeAttribute("src");
      window.requestAnimationFrame(() => {
        image.src = `${imageUrl}?retry=1`;
      });
      return;
    }

    figure.classList.add("image-error");
    figure.hidden = true;
  });
  figure.append(image, caption);
  return figure;
}

if (!project || !main) {
  document.title = "Project not found — Lola Davila";
  if (main) main.innerHTML = '<p class="project-page-description">PROJECT NOT FOUND. <a class="back-link" href="/#work">RETURN TO SELECTED WORK</a></p>';
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
    <section class="project-credits" aria-label="Professional contribution">
      <div>
        <p class="project-credit-label">ROLE</p>
        <p>${project.role}</p>
      </div>
      <div>
        <p class="project-credit-label">RESPONSIBILITIES</p>
        <p>${project.responsibilities}</p>
      </div>
      ${project.year ? `<div><p class="project-credit-label">YEAR</p><p>${project.year}</p></div>` : ""}
    </section>
    <div class="project-page-gallery" aria-label="Full ${project.title} project"></div>
    <nav class="project-nav" aria-label="Project navigation">
      <a href="${previous.slug}.html">← PREVIOUS / ${previous.title}</a>
      <a class="back-projects back-link" href="/#${returnHash}">BACK TO ${project.selected ? "SELECTED WORK" : "ARCHIVE"}</a>
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

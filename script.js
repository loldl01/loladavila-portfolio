const projects = [...window.PORTFOLIO_PROJECTS].sort((a, b) => a.order - b.order);

const body = document.body;
const hero = document.querySelector(".hero");
const heroWords = document.querySelectorAll(".hero-word");
const projectCanvas = document.getElementById("project-canvas");
const projectViewer = document.getElementById("project-viewer");
const viewerContent = document.getElementById("viewer-content");
const viewerClose = document.querySelector(".viewer-close");
const cursor = document.querySelector(".cursor");
const menuButton = document.querySelector(".menu-button");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

document.getElementById("work-count").textContent = String(projects.length).padStart(2, "0");
document.getElementById("mobile-work-count").textContent = String(projects.length).padStart(2, "0");
document.getElementById("year").textContent = new Date().getFullYear();

function renderProjects() {
  projectCanvas.innerHTML = projects.map((project, index) => `
    <article
      class="project-item"
      tabindex="0"
      role="button"
      data-project-id="${project.id}"
      aria-label="Abrir proyecto ${project.title}"
    >
      <div class="project-visual" style="--project-color: ${project.color}; --project-image: url('${project.image}')"></div>

      <span class="project-number">${String(index + 1).padStart(2, "0")}</span>

      <div class="project-title">
        <h3>${project.title}</h3>
        <p>${project.category}<br>${project.year}</p>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".project-item").forEach((item) => {
    item.addEventListener("click", () => openProject(item.dataset.projectId));

    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(item.dataset.projectId);
      }
    });
  });

  bindCursorTargets();
}

function openProject(id) {
  const project = projects.find((item) => item.id === id);
  if (!project) return;

  const titleWords = project.title.split(" ");
  const titleMarkup =
    titleWords.length > 1
      ? `${titleWords.slice(0, -1).join(" ")} <span class="viewer-serif">${titleWords.at(-1)}</span>`
      : project.title;

  viewerContent.innerHTML = `
    <div class="viewer-header">
      <h2>${titleMarkup}</h2>

      <div>
        <p>${project.description}</p>
        <p>${project.category} · ${project.year}<br>${project.client}</p>
      </div>
    </div>

    <div class="viewer-gallery">
      ${project.galleryColors.map((color, index) => `
        <div class="viewer-image" style="--image-color: ${color}">
          IMAGE ${String(index + 1).padStart(2, "0")}
        </div>
      `).join("")}
    </div>

    <div class="viewer-credits">
      <span>Styling — Lola Davila</span>
      <span>Client — ${project.client}</span>
      <span>Year — ${project.year}</span>
    </div>
  `;

  projectViewer.classList.add("is-open");
  projectViewer.setAttribute("aria-hidden", "false");
  body.classList.add("viewer-open");
  projectViewer.scrollTop = 0;
}

function closeProject() {
  projectViewer.classList.remove("is-open");
  projectViewer.setAttribute("aria-hidden", "true");
  body.classList.remove("viewer-open");
}

viewerClose.addEventListener("click", closeProject);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeProject();
    closeMenu();
  }
});

document.querySelectorAll(".hero-navigation a").forEach((link) => {
  const preview = link.dataset.preview;

  link.addEventListener("mouseenter", () => {
    hero.dataset.activePreview = preview;
  });

  link.addEventListener("mouseleave", () => {
    hero.removeAttribute("data-active-preview");
  });
});

window.addEventListener("scroll", () => {
  const scrollY = Math.min(window.scrollY, window.innerHeight);
  const progress = scrollY / window.innerHeight;

  heroWords[0].style.transform = `translate3d(${-progress * 10}vw, ${-progress * 8}vh, 0)`;
  heroWords[1].style.transform = `translate3d(${progress * 12}vw, ${progress * 3}vh, 0)`;
});

function openMenu() {
  mobileMenu.classList.add("is-open");
  mobileMenu.setAttribute("aria-hidden", "false");
  menuButton.setAttribute("aria-expanded", "true");
  body.classList.add("menu-open");
}

function closeMenu() {
  mobileMenu.classList.remove("is-open");
  mobileMenu.setAttribute("aria-hidden", "true");
  menuButton.setAttribute("aria-expanded", "false");
  body.classList.remove("menu-open");
}

menuButton.addEventListener("click", openMenu);
mobileMenuClose.addEventListener("click", closeMenu);
mobileMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

function bindCursorTargets() {
  if (!window.matchMedia("(pointer: fine)").matches || !cursor) return;

  document.querySelectorAll("a, button, .project-item").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

if (window.matchMedia("(pointer: fine)").matches && cursor) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
}

renderProjects();
bindCursorTargets();

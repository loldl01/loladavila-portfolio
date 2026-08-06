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
const archiveStrip = document.querySelector(".archive-strip");

document.getElementById("work-count").textContent = String(projects.length).padStart(2, "0");
document.getElementById("mobile-work-count").textContent = String(projects.length).padStart(2, "0");
document.getElementById("project-total").textContent = `${String(projects.length).padStart(2, "0")} Proyectos`;
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Render projects ---------- */

const CANVAS_BREAKS = {
  2: `ESTILO / <span>FORMA</span> / CARÁCTER`,
  3: `<span>Trabajo</span> Seleccionado`
};

const CANVAS_BREAK_ECHO = {
  2: "ESTILO / FORMA / CARÁCTER",
  3: "TRABAJO SELECCIONADO"
};

function renderProjects() {
  const items = projects.map((project, index) => `
    <article
      class="project-item"
      tabindex="0"
      role="button"
      data-project-id="${project.id}"
      aria-label="Abrir proyecto ${project.title}"
    >
      <p class="project-kicker">Proyecto ${String(index + 1).padStart(2, "0")} — ${project.category}</p>

      <div class="project-frame">
        <div class="project-visual" style="--project-color: ${project.color}; --project-image: url('${project.image}')"></div>
        <span class="project-number">${String(index + 1).padStart(2, "0")}</span>
        <span class="project-edge-label">${project.client} · ${project.year}</span>
      </div>

      <div class="project-caption">
        <h3>${project.title}</h3>
        <p>${project.category}<br>${project.year}</p>
      </div>
    </article>
  `);

  let markup = "";

  for (let i = 0; i < items.length; i += 2) {
    const pair = items.slice(i, i + 2).join("");
    markup += `<div class="project-spread">${pair}</div>`;

    const breakIndex = i / 2 + 1;
    if (CANVAS_BREAKS[breakIndex]) {
      markup += `<div class="canvas-break" data-echo="${CANVAS_BREAK_ECHO[breakIndex]}">${CANVAS_BREAKS[breakIndex]}</div>`;
    }
  }

  projectCanvas.innerHTML = markup;

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

/* ---------- Project viewer ---------- */

function openProject(id) {
  const projectIndex = projects.findIndex((item) => item.id === id);
  const project = projects[projectIndex];
  if (!project) return;

  const titleWords = project.title.split(" ");
  const lastWord = titleWords.pop();
  const firstWords = titleWords.join(" ");

  const gallery = Array.isArray(project.gallery) && project.gallery.length
    ? project.gallery
    : [project.image];

  const keywords = Array.isArray(project.keywords) && project.keywords.length
    ? project.keywords
    : ["Imagen", "Carácter", "Movimiento"];

  const nextProject = projects[(projectIndex + 1) % projects.length];

  const galleryMarkup = gallery.map((src, index) => `
    <figure class="v2-shot v2-shot-${(index % 5) + 1}">
      <div class="v2-shot-frame">
        <img src="${src}" alt="${project.title} — imagen ${index + 1}" loading="${index === 0 ? "eager" : "lazy"}">
      </div>
      <figcaption>${String(index + 1).padStart(2, "0")} / ${String(gallery.length).padStart(2, "0")}</figcaption>
    </figure>
  `).join("");

  viewerContent.innerHTML = `
    <article class="v2-project">
      <header class="v2-hero">
        <p class="v2-project-number">PROJECT ${String(projectIndex + 1).padStart(2, "0")}</p>

        <h2>
          ${firstWords ? `<span class="v2-title-sans">${firstWords}</span>` : ""}
          <span class="v2-title-serif">${lastWord}</span>
        </h2>

        <div class="v2-meta">
          <span>${project.category}</span>
          <span>${project.client}</span>
          <span>${project.year}</span>
        </div>
      </header>

      <section class="v2-cover">
        <img src="${project.image}" alt="${project.title}" loading="eager">
      </section>

      <section class="v2-intro">
        <p>${project.description}</p>

        <div class="v2-keywords">
          ${keywords.map((word) => `<span>${word}</span>`).join("")}
        </div>
      </section>

      <section class="v2-story">
        ${galleryMarkup}
      </section>

      <section class="v2-credits">
        <div><span>Rol</span><strong>${project.category}</strong></div>
        <div><span>Cliente</span><strong>${project.client}</strong></div>
        <div><span>Año</span><strong>${project.year}</strong></div>
        <div><span>Styling</span><strong>Lola Davila</strong></div>
      </section>

      <button class="v2-next" type="button" data-next-project="${nextProject.id}">
        <span>Siguiente proyecto</span>
        <strong>${nextProject.title}</strong>
        <span aria-hidden="true">↘</span>
      </button>
    </article>
  `;

  const nextButton = viewerContent.querySelector(".v2-next");
  nextButton?.addEventListener("click", () => openProject(nextButton.dataset.nextProject));

  document.getElementById("viewer-current").textContent =
    String(projectIndex + 1).padStart(2, "0");
  document.getElementById("viewer-total").textContent =
    String(projects.length).padStart(2, "0");

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

/* ---------- Hero preview + parallax ---------- */

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
}, { passive: true });


/* ---------- V2 project depth ---------- */

projectViewer.addEventListener("scroll", () => {
  projectViewer.querySelectorAll(".v2-shot img").forEach((image) => {
    const frame = image.parentElement;
    const rect = frame.getBoundingClientRect();
    const center = rect.top + rect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const offset = (center - viewportCenter) * -0.025;

    image.style.transform = `translate3d(0, ${offset}px, 0) scale(1.05)`;
  });
}, { passive: true });

/* ---------- Mobile menu ---------- */

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

/* ---------- Custom cursor (with inertia) ---------- */

function bindCursorTargets() {
  if (!window.matchMedia("(pointer: fine)").matches || !cursor) return;

  document.querySelectorAll("a, button, .project-item").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("is-active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("is-active"));
  });
}

if (window.matchMedia("(pointer: fine)").matches && cursor) {
  const pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const trail = { x: pointer.x, y: pointer.y };

  window.addEventListener("mousemove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  });

  function followCursor() {
    trail.x += (pointer.x - trail.x) * 0.18;
    trail.y += (pointer.y - trail.y) * 0.18;

    cursor.style.left = `${trail.x}px`;
    cursor.style.top = `${trail.y}px`;

    requestAnimationFrame(followCursor);
  }

  requestAnimationFrame(followCursor);
}

/* ---------- Scroll reveal ---------- */

const revealTargets = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealTargets.length) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: "0px 0px -60px 0px" });

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

/* ---------- Draggable archive strip ---------- */

function bindArchiveDrag() {
  if (!archiveStrip) return;

  let isDown = false;
  let startX = 0;
  let scrollStart = 0;

  archiveStrip.addEventListener("mousedown", (event) => {
    isDown = true;
    archiveStrip.classList.add("is-dragging");
    startX = event.pageX;
    scrollStart = archiveStrip.scrollLeft;
  });

  window.addEventListener("mouseup", () => {
    isDown = false;
    archiveStrip.classList.remove("is-dragging");
  });

  window.addEventListener("mousemove", (event) => {
    if (!isDown) return;
    event.preventDefault();
    archiveStrip.scrollLeft = scrollStart - (event.pageX - startX);
  });

  archiveStrip.addEventListener(
    "wheel",
    (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      archiveStrip.scrollLeft += event.deltaY;
    },
    { passive: false }
  );
}

bindArchiveDrag();

renderProjects();
bindCursorTargets();

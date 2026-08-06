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

/* ---------- Render projects as editorial chapters ---------- */

const CHAPTER_LABELS = [
  "Editorial",
  "Campaign",
  "Personal",
  "Commercial",
  "E-commerce",
  "Archive"
];


const HANDWRITTEN_NOTES = [
  "RAW IMAGE SYSTEM",
  "NO SAFE MODE",
  "",
  "VISUAL SIGNAL / 03",
  "",
  "STYLE IS RESISTANCE",
  "",
  "RECODE THE IMAGE"
];

function formatChapterTitle(title, index) {
  const words = title.trim().split(/\s+/);

  if (words.length === 1) {
    return `<span class="title-glitch" data-text="${words[0]}">${words[0]}</span>`;
  }

  const first = words.slice(0, -1).join(" ");
  const last = words.at(-1);

  if (index % 4 === 0) {
    return `
      <span class="title-sans">${first}</span>
      <span class="title-glitch" data-text="${last}">${last}</span>
    `;
  }

  if (index % 4 === 1) {
    return `
      <span class="title-outline">${first}</span>
      <span class="title-sans">${last}</span>
    `;
  }

  if (index % 4 === 2) {
    return `
      <span class="title-sans">${first}</span>
      <span class="title-mono">/${last}</span>
    `;
  }

  return `
    <span class="title-glitch" data-text="${first}">${first}</span>
    <span class="title-serif">${last}</span>
  `;
}

function renderProjects() {
  projectCanvas.innerHTML = projects.map((project, index) => {
    const chapter = CHAPTER_LABELS[index % CHAPTER_LABELS.length];
    const number = String(index + 1).padStart(2, "0");
    const layout = `chapter-layout-${(index % 4) + 1}`;
    const titleMarkup = formatChapterTitle(project.title, index);
    const handwrittenNote = HANDWRITTEN_NOTES[index] || "";

    return `
      <article
        class="project-chapter ${layout}"
        tabindex="0"
        role="button"
        data-project-id="${project.id}"
        aria-label="Abrir proyecto ${project.title}"
      >
        <header class="chapter-header">
          <div class="chapter-number">PROJECT ${number}</div>

          <div class="chapter-heading">
            <p class="chapter-label">${chapter}</p>
            <h3 class="chapter-title">${titleMarkup}</h3>
          </div>

          <div class="chapter-meta">
            <span>${project.category}</span>
            <span>${project.client}</span>
            <span>${project.year}</span>
          </div>
        </header>

        <div class="chapter-stage">
          <div class="chapter-image chapter-image-main">
            <div
              class="chapter-visual"
              style="--project-color: ${project.color}; --project-image: url('${project.image}')"
            ></div>
          </div>

          <div class="chapter-image chapter-image-secondary">
            <div
              class="chapter-visual chapter-visual-secondary"
              style="--project-color: ${project.color}; --project-image: url('${project.image}')"
            ></div>
          </div>

          <div class="chapter-quote">
            <span>${project.description}</span>
          </div>

          ${handwrittenNote ? `
            <div class="chapter-handwriting" aria-hidden="true">
              ${handwrittenNote}
            </div>
          ` : ""}

          <div class="chapter-system-label" aria-hidden="true">
            <span>IMG_SYS_${String(index + 1).padStart(2, "0")}</span>
            <span>STATUS: ACTIVE</span>
          </div>
        </div>

        <footer class="chapter-footer">
          <span>Ver proyecto completo</span>
          <span>↗</span>
        </footer>
      </article>
    `;
  }).join("");

  document.querySelectorAll(".project-chapter").forEach((item) => {
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
          IMAGEN ${String(index + 1).padStart(2, "0")}
        </div>
      `).join("")}
    </div>

    <div class="viewer-credits">
      <span>Estilismo — Lola Davila</span>
      <span>Cliente — ${project.client}</span>
      <span>Año — ${project.year}</span>
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

  document.querySelectorAll("a, button, .project-chapter").forEach((element) => {
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

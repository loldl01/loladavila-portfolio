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

/* Continuous LOLA DAVILA movement */
if (name && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  let t = 0;

  function animateName() {
    t += 0.004;
    const x = Math.sin(t) * 10;
    const y = Math.cos(t * 0.7) * 4;
    name.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(animateName);
  }

  requestAnimationFrame(animateName);
}

/* Very subtle hero drift */
if (heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    const y = Math.min(window.scrollY * 0.018, 10);
    heroImage.style.transform = `scale(1.025) translate3d(0, ${y}px, 0)`;
  }, { passive: true });
}

/* Reveal */
const revealTargets = document.querySelectorAll(
  ".v26-project-head, .v26-gallery figure, .v24-about-grid, .clean-contact"
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

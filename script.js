const body = document.body;
const styleButtons = document.querySelectorAll("[data-set-style]");
const cursor = document.querySelector(".cursor");
const menuToggle = document.querySelector(".menu-toggle");
const fullMenu = document.querySelector(".full-menu");
const closeMenu = document.querySelector(".close-menu");

styleButtons.forEach((button) => {
  button.addEventListener("click", () => {
    body.dataset.style = button.dataset.setStyle;
    styleButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
  });
});

if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("mousemove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });

  document.querySelectorAll("a, button, .project").forEach((element) => {
    element.addEventListener("mouseenter", () => cursor.classList.add("active"));
    element.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
}

menuToggle.addEventListener("click", () => {
  fullMenu.classList.add("open");
  fullMenu.setAttribute("aria-hidden", "false");
});

closeMenu.addEventListener("click", () => {
  fullMenu.classList.remove("open");
  fullMenu.setAttribute("aria-hidden", "true");
});

document.querySelectorAll(".full-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    fullMenu.classList.remove("open");
    fullMenu.setAttribute("aria-hidden", "true");
  });
});

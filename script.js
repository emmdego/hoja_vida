/* ==========================================================
   CONTACT DETAILS: fill these in.
   A link stays hidden until its value is provided.
   ========================================================== */
const CONTACT = {
  email: "",    // e.g. "name@example.com"
  github: "",   // e.g. "https://github.com/your-username"
  linkedin: "https://www.linkedin.com/in/emmanuel-escudero/",
};

document.documentElement.classList.add("js");

/* Apply contact details to every element marked with data-contact */
function applyContact() {
  Object.entries(CONTACT).forEach(([key, value]) => {
    const clean = value.trim();
    const links = document.querySelectorAll(`[data-contact="${key}"]`);
    const items = document.querySelectorAll(`[data-contact-item="${key}"]`);

    if (!clean) {
      links.forEach((el) => { el.hidden = true; });
      items.forEach((el) => { el.hidden = true; });
      return;
    }

    const href = key === "email" ? `mailto:${clean}` : clean;
    links.forEach((el) => {
      el.href = href;
      el.hidden = false;
      // Contact-list links show the value itself as text
      if (el.classList.contains("contact__link")) {
        el.textContent = key === "email" ? clean : clean.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
      }
    });
    items.forEach((el) => { el.hidden = false; });
  });
}

/* Mobile menu: toggle button, Escape to close, close after choosing a link */
function setupMenu() {
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
      setOpen(false);
      toggle.focus();
    }
  });
}

/* Highlight the nav link of the section currently in view */
function setupActiveLink() {
  const links = [...document.querySelectorAll(".nav__list a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (!("IntersectionObserver" in window) || !sections.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          if (active) link.setAttribute("aria-current", "true");
          else link.removeAttribute("aria-current");
        });
      });
    },
    // Narrow band near the top of the viewport decides the active section
    { rootMargin: "-40% 0px -55% 0px" }
  );
  sections.forEach((section) => observer.observe(section));
}

document.addEventListener("DOMContentLoaded", () => {
  applyContact();
  setupMenu();
  setupActiveLink();
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

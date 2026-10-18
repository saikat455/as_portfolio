/* =========================================================
   Portfolio scripts (vanilla JS, no libraries)
   ========================================================= */

/* EDIT: Roles shown in the typewriter effect */
const ROLES = ["Software Engineer", ".NET Developer", "Backend Developer"];

/** Hide the preloader once everything has loaded. */
function initPreloader() {
  window.addEventListener("load", () => {
    document.getElementById("preloader").classList.add("hidden");
  });
}

/** Load saved theme from localStorage and wire the toggle button. */
function initTheme() {
  const root = document.documentElement;
  const btn = document.getElementById("themeToggle");
  const icon = btn.querySelector("i");

  const apply = (theme) => {
    root.setAttribute("data-theme", theme);
    icon.className = theme === "dark" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  };

  apply(localStorage.getItem("theme") || "dark");

  btn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    apply(next);
  });
}

/** Mobile hamburger menu: open/close and close when a link is clicked. */
function initMobileMenu() {
  const burger = document.getElementById("hamburger");
  const menu = document.getElementById("navMenu");

  const toggle = (force) => {
    const open = menu.classList.toggle("open", force);
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", open);
  };

  burger.addEventListener("click", () => toggle());
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggle(false)));
}

/** Everything that reacts to scrolling: navbar style, progress bar, back-to-top. */
function initScrollEffects() {
  const navbar = document.getElementById("navbar");
  const progress = document.getElementById("progressBar");
  const backToTop = document.getElementById("backToTop");

  const onScroll = () => {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;

    navbar.classList.toggle("scrolled", y > 50);
    progress.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
    backToTop.classList.toggle("show", y > 300);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  onScroll();
}

/** Highlight the nav link of the section currently in view. */
function initActiveLinks() {
  const links = document.querySelectorAll(".navbar__link");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${entry.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  document.querySelectorAll("main section[id]").forEach((s) => observer.observe(s));
}

/** Typewriter effect that types and deletes each role in turn. */
function initTypewriter() {
  const el = document.getElementById("typewriter");
  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  const tick = () => {
    const word = ROLES[roleIndex];
    charIndex += deleting ? -1 : 1;
    el.textContent = word.slice(0, charIndex);

    let delay = deleting ? 50 : 100;
    if (!deleting && charIndex === word.length) {
      delay = 1800; // pause at full word
      deleting = true;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % ROLES.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  };
  tick();
}

/** Fade elements in on scroll and animate skill bars. */
function initRevealAnimations() {
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");

        // Animate any skill bars inside this element
        entry.target.querySelectorAll(".skill__fill").forEach((bar) => {
          bar.style.width = `${bar.dataset.level}%`;
        });
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
}

/** Filter project cards by their data-category. */
function initProjectFilter() {
  const buttons = document.querySelectorAll(".filters__btn");
  const cards = document.querySelectorAll(".project-card");

  buttons.forEach((btn) =>
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.dataset.filter;
      cards.forEach((card) => {
        const show = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("hide", !show);
        if (show) card.classList.add("visible");
      });
    })
  );
}

/** Client-side form validation with a fake success message. */
function initContactForm() {
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const rules = {
    name: (v) => (v.length >= 2 ? "" : "Please enter your name."),
    email: (v) => (emailPattern.test(v) ? "" : "Please enter a valid email."),
    subject: (v) => (v.length >= 3 ? "" : "Subject must be at least 3 characters."),
    message: (v) => (v.length >= 10 ? "" : "Message must be at least 10 characters."),
  };

  /** Validate one field and show its error. Returns true when valid. */
  const validate = (field) => {
    const msg = rules[field.name](field.value.trim());
    const group = field.closest(".form__group");
    group.classList.toggle("error", !!msg);
    group.querySelector(".form__error").textContent = msg;
    return !msg;
  };

  Object.keys(rules).forEach((name) =>
    form.elements[name].addEventListener("input", (e) => validate(e.target))
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const allValid = Object.keys(rules).map((n) => validate(form.elements[n])).every(Boolean);
    if (!allValid) return;

    // Demo only — connect to a service like Formspree for real emails.
    success.textContent = "✅ Thanks! Your message has been sent.";
    form.reset();
    setTimeout(() => (success.textContent = ""), 5000);
  });
}

/** Put the current year in the footer. */
function initYear() {
  document.getElementById("year").textContent = new Date().getFullYear();
}

/* ---------- Boot ---------- */
initPreloader();
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initMobileMenu();
  initScrollEffects();
  initActiveLinks();
  initTypewriter();
  initRevealAnimations();
  initProjectFilter();
  initProjectDetails();
  initContactForm();
  initYear();
});


/** Show project details in a native, keyboard-accessible dialog. */
function initProjectDetails() {
  const dialog = document.getElementById("projectDialog");
  if (!dialog) return;

    const projects = {
  launchnote: {
    title: "LaunchNote — Changelog, Roadmap & Feedback Platform",
    description:
      "A multi-tenant SaaS for product teams. Teams write and schedule changelog posts, collect feedback that visitors upvote without an account, and share a drag-and-drop public roadmap. It also includes an embeddable 'What's new' widget, privacy-friendly analytics, and role-based access for owners, admins and members.",
    tech: ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "Tailwind CSS"],
    github: "https://github.com/saikat455/launchnote"
  },
  
    erpmini: {
      title: "ErpMini \u2014 Multi-Tenant ERP System",
      description: "A multi-tenant ERP system with HR, Leave, Payroll, Procurement, and Accounts modules. Each company gets its own isolated data, and users only see what their role allows. Built using Clean Architecture so the code stays organized as it grows.",
      tech: [".NET Core (MVC)", "PostgreSQL", "Clean Architecture"],
      github: "https://github.com/saikat455/erpmini",
    },
    retailflow: {
      title: "RetailFlow \u2014 POS & Inventory System",
      description: "A shop management system for handling sales, stock, and invoices in one place. It has login with different user roles, and a dashboard where the shop owner can check inventory levels and see sales reports.",
      tech: [".NET 9", "React", "PostgreSQL"],
      github: "https://github.com/saikat455/retailflow",
    },
    learnhub: {
      title: "LearnHub \u2014 Online Course Platform",
      description: "A Udemy-style website where users can browse courses, enroll, and track their progress. It has login, reviews, and a discussion section. The frontend and backend talk to each other through secure APIs.",
      tech: ["React", "Node.js", "PostgreSQL"],
      github: "https://github.com/saikat455/learnhub",
    },
  };
  const openProject = (card) => {
    const project = projects[card.dataset.project];
    if (!project) return;
    document.getElementById("dialogTitle").textContent = project.title;
    document.getElementById("dialogDescription").textContent = project.description;
    const tech = document.getElementById("dialogTech");
    tech.replaceChildren(...project.tech.map((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      return item;
    }));
    document.getElementById("dialogGithub").href = project.github;
    dialog.showModal();
  };
  document.querySelectorAll(".project-card[data-project]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openProject(card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProject(card);
      }
    });
  });
  dialog.querySelector(".project-dialog__close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
}

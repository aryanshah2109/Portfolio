const body = document.body;
const loader = document.querySelector(".loader");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const revealEls = document.querySelectorAll(".reveal");
const backToTop = document.querySelector(".back-to-top");
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector(".form-status");
const typingText = document.querySelector(".typing-text");
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

body.classList.add("is-loading");

window.addEventListener("load", () => {
  setTimeout(() => {
    loader.classList.add("is-hidden");
    body.classList.remove("is-loading");
  }, 650);
});

document.querySelector("#year").textContent = new Date().getFullYear();

// Smooth mobile navigation.
navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("is-open");
    navToggle.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

// Typing animation for the hero title.
const typingPhrases = ["AI/ML Engineer", "RAG Builder", "MLOps Learner", "FastAPI Developer"];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeHeroText() {
  const phrase = typingPhrases[phraseIndex];
  typingText.textContent = phrase.slice(0, charIndex);

  if (!isDeleting && charIndex < phrase.length) {
    charIndex += 1;
    setTimeout(typeHeroText, 75);
    return;
  }

  if (!isDeleting && charIndex === phrase.length) {
    isDeleting = true;
    setTimeout(typeHeroText, 1200);
    return;
  }

  if (isDeleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeHeroText, 42);
    return;
  }

  isDeleting = false;
  phraseIndex = (phraseIndex + 1) % typingPhrases.length;
  setTimeout(typeHeroText, 260);
}

typeHeroText();

// Scroll progress, header state, and back-to-top visibility.
function updateScrollUI() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progress.style.width = `${percent}%`;
  header.classList.toggle("is-scrolled", scrollTop > 20);
  backToTop.classList.toggle("is-visible", scrollTop > 540);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Reveal animations as sections enter the viewport.
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealEls.forEach((el) => revealObserver.observe(el));

// Active navigation state while scrolling.
const sections = [...document.querySelectorAll("main section[id]")];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navLinks.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-45% 0px -48% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// Project filtering with a small animation delay.
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    const filter = button.dataset.filter;
    projectCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(16px)";

      setTimeout(() => {
        const shouldShow = filter === "all" || card.dataset.category === filter;
        card.classList.toggle("is-hidden", !shouldShow);

        if (shouldShow) {
          requestAnimationFrame(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          });
        }
      }, 180);
    });
  });
});

// Contact form submission. The Node backend sends the email via SMTP.
contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const submitButton = contactForm.querySelector("button[type='submit']");
  const formData = new FormData(contactForm);
  const payload = {
    name: String(formData.get("name") || "").trim(),
    email: String(formData.get("email") || "").trim(),
    message: String(formData.get("message") || "").trim()
  };

  formStatus.textContent = "Sending your message...";
  submitButton.disabled = true;

  try {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Unable to send message right now.");
    }

    formStatus.textContent = "Message sent. Thanks for reaching out.";
    contactForm.reset();
  } catch (error) {
    formStatus.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

// Subtle custom cursor for pointer devices.
const canUseCursor = window.matchMedia("(pointer: fine)").matches;

if (canUseCursor) {
  window.addEventListener("mousemove", (event) => {
    const { clientX, clientY } = event;
    cursorDot.style.transform = `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)`;
    cursorOutline.animate(
      { transform: `translate(${clientX}px, ${clientY}px) translate(-50%, -50%)` },
      { duration: 420, fill: "forwards" }
    );
  });

  document.querySelectorAll("a, button, input, textarea").forEach((item) => {
    item.addEventListener("mouseenter", () => cursorOutline.classList.add("is-hovering"));
    item.addEventListener("mouseleave", () => cursorOutline.classList.remove("is-hovering"));
  });
}

// Lightweight animated particle background drawn on canvas.
const canvas = document.querySelector("#particle-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
const particleCount = 72;
let canvasWidth = 0;
let canvasHeight = 0;

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticles() {
  particles.length = 0;
  for (let i = 0; i < particleCount; i += 1) {
    particles.push({
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      radius: Math.random() * 1.8 + 0.7,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.55 + 0.18
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  particles.forEach((particle, index) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;

    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(54, 215, 255, ${particle.alpha})`;
    ctx.fill();

    for (let j = index + 1; j < particles.length; j += 1) {
      const other = particles[j];
      const dx = particle.x - other.x;
      const dy = particle.y - other.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.strokeStyle = `rgba(101, 244, 189, ${(1 - distance / 120) * 0.11})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

resizeCanvas();
createParticles();
drawParticles();

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

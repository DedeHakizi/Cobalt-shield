// ===== YEAR ===== 
document.getElementById("year").textContent = new Date().getFullYear();

// ===== MOBILE NAV TOGGLE =====
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");

burger.addEventListener("click", () => {
  const expanded = burger.getAttribute("aria-expanded") === "true";
  burger.setAttribute("aria-expanded", (!expanded).toString());
  navLinks.classList.toggle("open");
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    burger.setAttribute("aria-expanded", "false");
    navLinks.classList.remove("open");
  });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll("section[id]");
const navItems = navLinks.querySelectorAll("a[href^='#']");

window.addEventListener("scroll", () => {
  let current = "";
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollY >= sectionTop - 200) {
      current = section.getAttribute("id");
    }
  });

  navItems.forEach(item => {
    item.classList.remove("active");
    if (item.getAttribute("href") === `#${current}`) {
      item.classList.add("active");
    }
  });
});

// ===== CONTACT FORM VALIDATION & SUBMISSION =====
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

contactForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const org = document.getElementById("org").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Clear previous status
  formStatus.textContent = "";
  formStatus.className = "form-status";

  // Validation
  if (!org || !email || !message) {
    formStatus.textContent = "Please fill in all fields.";
    formStatus.classList.add("error");
    return;
  }

  if (!emailRegex.test(email)) {
    formStatus.textContent = "Please enter a valid email address.";
    formStatus.classList.add("error");
    return;
  }

  // Show loading state
  const submitBtn = contactForm.querySelector("button[type='submit']");
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";
  submitBtn.disabled = true;

  try {
    // Using Formspree (free service - no backend needed)
    // Replace YOUR_FORM_ID with your actual Formspree ID from https://formspree.io
    const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        org,
        email,
        message,
      }),
    });

    if (response.ok) {
      formStatus.textContent = "✓ Thank you! Your message has been sent. We'll reply within 24-48 hours.";
      formStatus.classList.add("success");
      contactForm.reset();
    } else {
      throw new Error("Form submission failed");
    }
  } catch (error) {
    console.error("Error:", error);
    formStatus.textContent = "⚠ Something went wrong. Please try again or email us directly.";
    formStatus.classList.add("error");
  } finally {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
  }
});

// ===== SMOOTH SCROLL FALLBACK (for older browsers) =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#" && href !== "#top") {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
});

/* script.js — central JS for menu, smooth scroll, reveal, FAQ toggle */

/* Wait for DOM */
document.addEventListener('DOMContentLoaded', function () {

  /* NAV: Add active class based on current path (simple) */
  try {
    const navLinks = document.querySelectorAll('.nav-link, .navbar-nav .nav-link, .nav a');
    const current = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(current)) {
        a.classList.add('active');
      }
    });
  } catch (e) { /* ignore */ }

  /* MOBILE: Toggle nav visibility (Bootstrap's collapse will handle if using bootstrap) */
  // If using non-Bootstrap nav toggles on custom header, you can add code here.

  /* SMOOTH SCROLL for anchor links */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* REVEAL ON SCROLL — IntersectionObserver */
  const ioOptions = { threshold: 0.15 };
  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, ioOptions);

  document.querySelectorAll('.reveal, .ht-card').forEach(el => revealObserver.observe(el));

  /* HEALTH TIPS: also observe .ht-card for staggered animation (adds visible) */
  const htCards = document.querySelectorAll('.ht-card');
  htCards.forEach((card, i) => {
    revealObserver.observe(card);
  });

  /* FAQ accordion indicator (if using bootstrap collapse on faq page) */
  const faqHeaders = document.querySelectorAll('.accordion-button');
  faqHeaders.forEach(btn => {
    btn.addEventListener('click', function () {
      // Toggle icon rotation (Bootstrap already toggles collapsed state)
      const icon = this.querySelector('i.fa-chevron-down, i.fa-chevron-up');
      // nothing necessary; let Bootstrap handle collapse classes
    });
  });

});
// Lazy Reveal Animation
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade-up");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach(el => observer.observe(el));
});

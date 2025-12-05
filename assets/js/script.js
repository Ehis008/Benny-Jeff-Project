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
      // Placeholder for future custom icon toggles if needed.
    });
  });

  /* FAQ: Search / filter logic (applies only if #faq-search exists) */
  (function initFaqSearch() {
    const searchInput = document.getElementById('faq-search');
    if (!searchInput) return;

    // Gather all accordion items (within this page)
    const accordionItems = Array.from(document.querySelectorAll('.accordion-item'));

    function normalize(text) {
      return (text || '').toString().toLowerCase().replace(/[^a-z0-9\s]/gi,'');
    }

    function filterFaq(query) {
      const q = normalize(query.trim());
      // Show all if empty
      if (!q) {
        accordionItems.forEach(item => {
          item.style.display = '';
        });
        return;
      }
      accordionItems.forEach(item => {
        const titleEl = item.querySelector('.accordion-button');
        const bodyEl = item.querySelector('.accordion-body');
        const titleText = titleEl ? titleEl.textContent : '';
        const bodyText = bodyEl ? bodyEl.textContent : '';
        const text = normalize(titleText + ' ' + bodyText);
        if (text.indexOf(q) !== -1) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
          // collapse if open (uses Bootstrap Collapse)
          const collapseEl = item.querySelector('.accordion-collapse');
          if (collapseEl && collapseEl.classList.contains('show')) {
            const bsCollapse = bootstrap.Collapse.getInstance(collapseEl);
            if (bsCollapse) bsCollapse.hide();
          }
        }
      });
    }

    searchInput.addEventListener('input', (e) => {
      filterFaq(e.target.value);
    });

    // Enter focuses first visible button for accessibility
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const first = document.querySelector('.accordion-item:not([style*="display: none"]) .accordion-button');
        if (first) first.focus();
      }
    });
  })();

}); // end DOMContentLoaded

// Lazy Reveal Animation (separate listener to ensure it runs regardless of earlier code)
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


document.addEventListener('DOMContentLoaded', () => {

  // ===== Disable past dates in date picker =====
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // ===== Fade-up reveal for appointment form and FAQ teaser =====
  const fadeElements = document.querySelectorAll('.appointment-form, .faq-teaser');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeElements.forEach(el => fadeObserver.observe(el));

});
document.addEventListener('DOMContentLoaded', () => {

  // ===== Fade-up reveal for contact form, info cards, map, FAQ teaser =====
  const fadeElementsContact = document.querySelectorAll('.contact-form, .cards-grid .card-modern, .faq-teaser, iframe');
  const fadeObserverContact = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        fadeObserverContact.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fadeElementsContact.forEach(el => fadeObserverContact.observe(el));

});
// Appointment form submission confirmation
const appointmentForm = document.querySelector(".appointment-form");

if (appointmentForm) {
  appointmentForm.addEventListener("submit", function () {
    setTimeout(() => {
      alert("Your appointment request has been submitted successfully!");
    }, 500);
  });
}

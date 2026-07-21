/* script.js — central JS for menu, smooth scroll, reveal animations, and forms */
/* Revamped: consolidated into a single DOMContentLoaded listener and a single
   IntersectionObserver for all scroll-reveal elements. Previously .reveal/.ht-card
   added a "visible" class that had no matching CSS (no visual effect) — they now
   share the same working .fade-up/.show animation. Removed the FAQ search code
   since the standalone FAQ page was scrapped in favor of the homepage accordion.
   Fixed the appointment confirmation message so it no longer races the form's
   navigation to Formspree. */

document.addEventListener('DOMContentLoaded', function () {

  /* ============================
     FOOTER: auto-update the copyright year so it never goes stale.
     Expects a <span id="year"></span> inside the footer's copyright text.
  ============================= */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ============================
     NAV: active link highlighting
     (Most pages already hardcode class="nav-link active" on the current
     page's link in the HTML. This just double-checks it based on the URL,
     in case a page is missing it.)
  ============================= */
  try {
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const current = location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href === current) {
        a.classList.add('active');
      }
    });
  } catch (e) { /* ignore */ }

  /* ============================
     SMOOTH SCROLL for in-page anchor links (e.g. faq teaser -> #homeFAQ)
  ============================= */
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

  /* ============================
     SCROLL REVEAL — one observer for every animated element on every page.
     All of these now use the same .show toggle, which matches the working
     .fade-up.show animation defined in style.css.
  ============================= */
  const revealSelectors = [
    '.reveal',
    '.ht-card',
    '.fade-up',
    '.appointment-form',
    '.faq-teaser',
    '.contact-form',
    '.cards-grid .card-modern',
    'iframe'
  ].join(', ');

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll(revealSelectors).forEach(el => revealObserver.observe(el));

  /* ============================
     BOOKING PAGE: prevent selecting a past date
  ============================= */
  const dateInput = document.getElementById('date');
  let todayStr = '';
  if (dateInput) {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    todayStr = `${yyyy}-${mm}-${dd}`;
    dateInput.min = todayStr;
  }

  /* ============================
     APPOINTMENT FORM: submit via fetch so the confirmation message
     actually has time to show, instead of racing a page navigation.
  ============================= */
  const appointmentForm = document.querySelector('.appointment-form');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = appointmentForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      fetch(appointmentForm.action, {
        method: 'POST',
        body: new FormData(appointmentForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            alert('Your appointment request has been submitted successfully!');
            appointmentForm.reset();
            if (dateInput && todayStr) dateInput.min = todayStr;
          } else {
            alert('Something went wrong sending your request. Please try again or call us directly.');
          }
        })
        .catch(() => {
          alert('Something went wrong sending your request. Please check your connection and try again.');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        });
    });
  }

  /* ============================
     CONTACT FORM: same fetch-based approach for a consistent experience.
  ============================= */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending...';
      }

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      })
        .then(response => {
          if (response.ok) {
            alert('Your message has been sent — we will get back to you shortly!');
            contactForm.reset();
          } else {
            alert('Something went wrong sending your message. Please try again or call us directly.');
          }
        })
        .catch(() => {
          alert('Something went wrong sending your message. Please check your connection and try again.');
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
          }
        });
    });
  }

}); // end DOMContentLoaded
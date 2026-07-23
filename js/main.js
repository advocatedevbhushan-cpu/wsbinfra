/**
 * WSB INFRA & CRAFTS — Main Application
 * Modules: Preloader | Nav | Scroll Bar | Dark Mode | Back to Top
 * Animations | Counters | Portfolio | Form | Cookie | LazyLoad | FAQ | Parallax
 */
(function () {
  'use strict';

  /* ---- UTILITIES ---- */
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => [...(c || document).querySelectorAll(s)];
  const LS = { get: (k) => localStorage.getItem(k), set: (k, v) => localStorage.setItem(k, v) };

  /* =============================================================
     1.  PRELOADER
     ============================================================= */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('preloader--hidden');
      setTimeout(() => preloader.remove(), 500);
    });
    setTimeout(() => {
      if (!preloader.classList.contains('preloader--hidden')) {
        preloader.classList.add('preloader--hidden');
        setTimeout(() => preloader.remove(), 500);
      }
    }, 3000);
  }

  /* =============================================================
     2.  DYNAMIC YEAR
     ============================================================= */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* =============================================================
     3.  NAVIGATION
     ============================================================= */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navLinks');
  const navLinks = $$('.nav-links > a, .dropdown__toggle');

  /* Highlight active page using full URL match to avoid cross-directory conflicts */
  var currentUrl = window.location.href.replace(/\/$/, '');
  navLinks.forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href === '#') return;
    var resolvedUrl = new URL(href, currentUrl).href.replace(/\/$/, '');
    if (resolvedUrl === currentUrl) { a.classList.add('active'); }
  });
  /* Directory-based highlighting for sub-pages */
  var currentPath = window.location.pathname;
  if (currentPath.indexOf('/products/') !== -1) {
    var prodToggle = document.querySelector('.dropdown > .dropdown__toggle');
    if (prodToggle && !prodToggle.classList.contains('active')) prodToggle.classList.add('active');
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
      document.body.classList.toggle('no-scroll');
    });

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navbar')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  /* Dropdown toggle for mobile */
  $$('.dropdown__toggle').forEach(function (toggle) {
    toggle.addEventListener('click', function (e) {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        var dd = toggle.closest('.dropdown');
        var isOpen = dd.classList.contains('dropdown--open');
        $$('.dropdown--open').forEach(function (o) { o.classList.remove('dropdown--open'); });
        if (!isOpen) dd.classList.add('dropdown--open');
      }
    });
  });
  /* Close dropdowns when clicking outside */
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.dropdown')) {
      $$('.dropdown--open').forEach(function (o) { o.classList.remove('dropdown--open'); });
    }
  });

  /* Navbar shrink on scroll */
  var tickingScroll = false;
  var navbar = $('.navbar');
  window.addEventListener('scroll', function () {
    if (!tickingScroll) {
      requestAnimationFrame(function () {
        if (navbar) {
          if (window.scrollY > 80) navbar.classList.add('navbar--scrolled');
          else navbar.classList.remove('navbar--scrolled');
        }
        tickingScroll = false;
      });
      tickingScroll = true;
    }
  }, { passive: true });

  /* =============================================================
     4.  SCROLL PROGRESS BAR
     ============================================================= */
  var progressBar = document.getElementById('scrollProgress');
  if (!progressBar) {
    progressBar = document.createElement('div');
    progressBar.id = 'scrollProgress';
    document.body.appendChild(progressBar);
  }
  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  /* =============================================================
     5.  BACK TO TOP
     ============================================================= */
  var backToTop = document.getElementById('backToTop');
  if (!backToTop) {
    backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.setAttribute('aria-label', 'Back to top');
    backToTop.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 4l-8 8h16z" fill="currentColor"/></svg>';
    document.body.appendChild(backToTop);
  }
  window.addEventListener('scroll', function () {
    backToTop.classList.toggle('btt--visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* =============================================================
     7.  SCROLL ANIMATIONS (Intersection Observer)
     ============================================================= */
  var animObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  $$('.anim-up, .anim-left, .anim-right, .anim-scale, .anim-fade').forEach(function (el) {
    animObserver.observe(el);
  });

  /* Stagger children */
  $$('[data-stagger]').forEach(function (parent) {
    var kids = parent.children;
    var delay = parseFloat(parent.getAttribute('data-stagger')) || 0.1;
    Array.from(kids).forEach(function (child, i) {
      child.style.setProperty('--delay', i * delay + 's');
      child.classList.add('anim-up');
      animObserver.observe(child);
    });
  });

  /* =============================================================
     8.  COUNTER ANIMATION
     ============================================================= */
  var counterObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'));
        animateCounter(el, target);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  $$('.stat-number[data-count]').forEach(function (el) { counterObserver.observe(el); });

  function animateCounter(el, target) {
    var current = 0;
    var duration = 1500;
    var startTime = performance.now();
    var suffix = el.getAttribute('data-suffix') || (target >= 98 ? '%' : '+');

    function step(ts) {
      var elapsed = ts - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* =============================================================
     9.  PORTFOLIO FILTER
     ============================================================= */
  var filterBtns = $$('.filter-btn');
  var portfolioItems = $$('.portfolio-item');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      portfolioItems.forEach(function (item) {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.classList.remove('hide');
        } else {
          item.classList.add('hide');
        }
      });
    });
  });

  /* =============================================================
     10. CONTACT FORM — Formspree integration
     ============================================================= */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var FORMSPREE_URL = 'https://formspree.io/f/YOUR_FORM_ID';
    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      var formData = new FormData(contactForm);
      var data = Object.fromEntries(formData);

      if (!data.name || !data.email || !data.message) {
        showFormMsg('Please fill in all required fields.', 'error');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        showFormMsg('Please enter a valid email address.', 'error');
        return;
      }

      var submitBtn = contactForm.querySelector('button[type="submit"]');
      var original = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      submitBtn.disabled = true;

      try {
        var resp = await fetch(FORMSPREE_URL, {
          method: 'POST', body: formData, headers: { Accept: 'application/json' }
        });
        if (resp.ok) {
          showFormMsg('Thank you! We\'ll get back to you within 24 hours.', 'success');
          contactForm.reset();
        } else {
          showFormMsg('Something went wrong. Please try again or email us directly.', 'error');
        }
      } catch (_e) {
        showFormMsg('Network error. Please check your connection.', 'error');
      } finally {
        submitBtn.innerHTML = original;
        submitBtn.disabled = false;
      }
    });
  }

  function showFormMsg(msg, type) {
    var existing = $('.form-message');
    if (existing) existing.remove();
    var div = document.createElement('div');
    div.className = 'form-message form-message--' + type;
    div.textContent = msg;
    var form = contactForm || $('.contact-form');
    if (form) form.appendChild(div);
  }

  /* =============================================================
     11. WHATSAPP FLOATING BUTTON
     ============================================================= */
  var waBtn = document.getElementById('whatsappBtn');
  if (!waBtn) {
    waBtn = document.createElement('a');
    waBtn.id = 'whatsappBtn';
    waBtn.className = 'whatsapp-btn';
    waBtn.href = 'https://wa.me/918707552183?text=Hi%20WSB%20Infra%2C%20I%27d%20like%20to%20discuss%20a%20project.';
    waBtn.target = '_blank';
    waBtn.rel = 'noopener';
    waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
    waBtn.innerHTML = '<i class="fab fa-whatsapp"></i>';
    document.body.appendChild(waBtn);
  }

  /* =============================================================
     12. COOKIE CONSENT
     ============================================================= */
  if (!LS.get('cookieConsent')) {
    var banner = document.createElement('div');
    banner.id = 'cookieBanner';
    banner.className = 'cookie-banner';
    banner.innerHTML =
      '<p>We use cookies to improve your experience. By using our site, you accept our <a href="#">Privacy Policy</a>.</p>' +
      '<div class="cookie-banner__actions">' +
      '<button class="btn btn-sm btn-outline" id="cookieDecline">Decline</button>' +
      '<button class="btn btn-sm btn-primary" id="cookieAccept">Accept</button></div>';
    document.body.appendChild(banner);

    document.getElementById('cookieAccept').addEventListener('click', function () {
      LS.set('cookieConsent', 'accepted');
      banner.remove();
    });
    document.getElementById('cookieDecline').addEventListener('click', function () {
      LS.set('cookieConsent', 'declined');
      banner.remove();
    });
  }

  /* =============================================================
     12. LAZY LOADING (native with blur-up fallback)
     ============================================================= */
  $$('img[data-src]').forEach(function (img) {
    img.src = img.getAttribute('data-src');
    img.removeAttribute('data-src');
  });

  if ('loading' in HTMLImageElement.prototype) {
    $$('img[loading="lazy"]').forEach(function (img) { img.loading = 'lazy'; });
  }

  /* =============================================================
     13. SMOOTH SCROLL for anchor links
     ============================================================= */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (href === '#' || href === '') return;
      e.preventDefault();
      var target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* =============================================================
     14. FAQ ACCORDION
     ============================================================= */
  $$('.faq-question').forEach(function (q) {
    q.addEventListener('click', function () {
      var item = q.closest('.faq-item');
      if (!item) return;
      var isOpen = item.classList.contains('faq-item--open');
      /* close all others */
      $$('.faq-item--open').forEach(function (o) { o.classList.remove('faq-item--open'); });
      if (!isOpen) item.classList.add('faq-item--open');
    });
  });

  /* =============================================================
     15. PARALLAX hero backgrounds
     ============================================================= */
  var parallaxEls = $$('[data-parallax]');
  if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', function () {
      var st = window.scrollY;
      requestAnimationFrame(function () {
        parallaxEls.forEach(function (el) {
          var rate = parseFloat(el.getAttribute('data-parallax')) || 0.3;
          var rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.style.transform = 'translateY(' + (st * rate) + 'px)';
          }
        });
      });
    }, { passive: true });
  }

  /* =============================================================
     16. DYNAMIC STYLES
     ============================================================= */
  var style = document.createElement('style');
  style.textContent =
    '.no-scroll{overflow:hidden}' +
    '.form-message{animation:fadeIn 0.3s ease;padding:12px 18px;border-radius:8px;font-size:.9rem;font-weight:500;margin-top:16px}' +
    '.form-message--success{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}' +
    '.form-message--error{background:#fef2f2;color:#b91c1c;border:1px solid #fecaca}' +
    '@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}' +
    '@keyframes spin{to{transform:rotate(360deg)}}' +
    '@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}';
  document.head.appendChild(style);

})();

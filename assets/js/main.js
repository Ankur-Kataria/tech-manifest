/* ============================================
   TECH MANIFEST — Main JavaScript
   Animations, Interactions & Functionality
   ============================================ */

(function () {
  'use strict';

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.classList.add('loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 500);
    });
    // Fallback: hide preloader after 3s even if load event doesn't fire
    setTimeout(() => {
      if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        setTimeout(() => { preloader.style.display = 'none'; }, 500);
      }
    }, 3000);
  }

  /* ---------- Header Scroll Effect ---------- */
  const header = document.getElementById('header');
  let lastScroll = 0;

  function handleHeaderScroll() {
    const currentScroll = window.scrollY;
    if (!header) return;

    if (currentScroll > 60) {
      header.classList.add('scrolled');
    } else {
      // Only remove scrolled class on homepage (pages with hero)
      const isHomepage = document.querySelector('.hero');
      if (isHomepage) {
        header.classList.remove('scrolled');
      }
    }
    lastScroll = currentScroll;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ---------- Mobile Navigation ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navOverlay = document.getElementById('navOverlay');

  function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    const inner = document.createElement('div');
    outer.appendChild(inner);
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return scrollbarWidth;
  }

  function openMobileNav() {
    if (!nav || !menuToggle) return;
    nav.classList.add('open');
    menuToggle.classList.add('active');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (navOverlay) navOverlay.classList.add('active');
    const scrollbarWidth = getScrollbarWidth();
    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = scrollbarWidth + 'px';
    }
  }

  function closeMobileNav() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  }

  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      if (nav.classList.contains('open')) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileNav);
  }

  // Close mobile nav on link click
  document.querySelectorAll('.nav-link, .dropdown-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        closeMobileNav();
      }
    });
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      closeMobileNav();
    }
  });

  /* ---------- Mobile Dropdown Toggle ---------- */
  document.querySelectorAll('.nav-item').forEach(item => {
    const link = item.querySelector('.nav-link');
    const dropdown = item.querySelector('.dropdown');

    if (link && dropdown) {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          item.classList.toggle('dropdown-open');
        }
      });
    }
  });

  /* ---------- Scroll Reveal Animations ---------- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  /* ---------- Counter Animation ---------- */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  /* ---------- Hero Particles ---------- */
  const heroParticles = document.getElementById('heroParticles');
  if (heroParticles) {
    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (4 + Math.random() * 4) + 's';
      particle.style.width = (2 + Math.random() * 3) + 'px';
      particle.style.height = particle.style.width;
      heroParticles.appendChild(particle);
    }
  }

  /* ---------- Smooth Scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Scroll to Top ---------- */
  const scrollTopBtn = document.getElementById('scrollTop');

  function handleScrollTop() {
    if (!scrollTopBtn) return;
    if (window.scrollY > 400) {
      scrollTopBtn.classList.add('visible');
    } else {
      scrollTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTop, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Portfolio Filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      portfolioCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* ---------- Contact Form Validation ---------- */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    const formSuccess = document.getElementById('formSuccess');
    const submitText = document.getElementById('submitText');
    const submitIcon = document.getElementById('submitIcon');
    const submitSpinner = document.getElementById('submitSpinner');

    // Simple email regex for basic validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function showError(fieldId, message) {
      const errorEl = document.getElementById(fieldId + 'Error');
      const inputEl = document.getElementById(fieldId);
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.color = 'var(--accent)';
        errorEl.style.fontSize = '0.8rem';
        errorEl.style.marginTop = '4px';
        errorEl.style.display = 'block';
      }
      if (inputEl) {
        inputEl.style.borderColor = 'var(--accent)';
      }
    }

    function clearError(fieldId) {
      const errorEl = document.getElementById(fieldId + 'Error');
      const inputEl = document.getElementById(fieldId);
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
      if (inputEl) {
        inputEl.style.borderColor = 'transparent';
      }
    }

    function clearAllErrors() {
      ['firstName', 'lastName', 'email', 'service', 'message'].forEach(clearError);
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      clearAllErrors();

      let isValid = true;

      const firstName = document.getElementById('firstName').value.trim();
      const lastName = document.getElementById('lastName').value.trim();
      const email = document.getElementById('email').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      if (!firstName) {
        showError('firstName', 'First name is required');
        isValid = false;
      }
      if (!lastName) {
        showError('lastName', 'Last name is required');
        isValid = false;
      }
      if (!email) {
        showError('email', 'Email is required');
        isValid = false;
      } else if (!emailRegex.test(email)) {
        showError('email', 'Please enter a valid email address');
        isValid = false;
      }
      if (!service) {
        showError('service', 'Please select a service');
        isValid = false;
      }
      if (!message) {
        showError('message', 'Message is required');
        isValid = false;
      } else if (message.length < 10) {
        showError('message', 'Message must be at least 10 characters');
        isValid = false;
      }

      if (isValid) {
        // Simulate form submission
        if (submitText) submitText.textContent = 'Sending...';
        if (submitIcon) submitIcon.style.display = 'none';
        if (submitSpinner) submitSpinner.style.display = 'inline';

        setTimeout(() => {
          contactForm.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
        }, 1500);
      }
    });

    // Real-time validation (clear errors on input)
    ['firstName', 'lastName', 'email', 'service', 'message'].forEach(fieldId => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.addEventListener('input', () => clearError(fieldId));
        el.addEventListener('change', () => clearError(fieldId));
      }
    });
  }

  /* ---------- Active Navigation Link ---------- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else if (link.classList.contains('active') && href !== currentPage) {
      // Don't remove active from pre-set active links
    }
  });

  /* ---------- Typing Effect (Hero) ---------- */
  const heroHighlight = document.querySelector('.hero h1 .highlight');
  if (heroHighlight) {
    const text = heroHighlight.textContent;
    heroHighlight.textContent = '';
    heroHighlight.style.borderRight = '2px solid var(--accent)';

    let charIndex = 0;
    function typeChar() {
      if (charIndex < text.length) {
        heroHighlight.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 60);
      } else {
        // Remove cursor after typing
        setTimeout(() => {
          heroHighlight.style.borderRight = 'none';
        }, 1000);
      }
    }

    // Start typing after reveal animation
    setTimeout(typeChar, 800);
  }

  /* ---------- Parallax on Hero Blobs ---------- */
  const blobs = document.querySelectorAll('.hero-mesh .blob');
  if (blobs.length > 0) {
    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      blobs.forEach((blob, i) => {
        const speed = (i + 1) * 10;
        blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    }, { passive: true });
  }

  /* ---------- Intersection Observer for Nav Items on inner pages ---------- */
  // Highlight corresponding nav sections as they scroll into view (services page)
  const sections = document.querySelectorAll('section[id]');
  if (sections.length > 0) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          const correspondingLink = document.querySelector(`.dropdown-link[href="#${id}"]`);
          if (correspondingLink) {
            document.querySelectorAll('.dropdown-link').forEach(l => l.style.color = '');
            correspondingLink.style.color = 'var(--primary)';
          }
        }
      });
    }, { threshold: 0.3 });

    sections.forEach(section => sectionObserver.observe(section));
  }

  /* ---------- CSS Animation KeyFrame for Portfolio Filter ---------- */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);

  /* ---------- Form Select Styling ---------- */
  document.querySelectorAll('.form-group select').forEach(select => {
    if (!select.value) {
      select.style.color = 'var(--gray-400)';
    }
    select.addEventListener('change', function () {
      this.style.color = this.value ? 'var(--dark)' : 'var(--gray-400)';
    });
  });

  /* ---------- Newsletter Form ---------- */
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const input = this.querySelector('input');
      const button = this.querySelector('button');
      const email = input.value.trim();
      if (input && email) {
        const storedEmails = JSON.parse(localStorage.getItem('newsletterEmails') || '[]');
        if (!storedEmails.includes(email)) {
          storedEmails.push(email);
          localStorage.setItem('newsletterEmails', JSON.stringify(storedEmails));
        }
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.style.background = '#22c55e';
        input.value = '';
        setTimeout(() => {
          button.innerHTML = '<i class="fas fa-paper-plane"></i>';
          button.style.background = '';
        }, 2000);
      }
    });
  });

})();

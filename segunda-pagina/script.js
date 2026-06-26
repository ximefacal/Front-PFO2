/* =============================================================
   LA GUARIDA DEL DRAGÓN — script.js
   Vanilla JS · No dependencies
   ============================================================= */

(function () {
  'use strict';

  /* ── Smooth anchor scroll ─────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile menu if open
      closeMobileMenu();
    });
  });

  /* ── Sticky header shadow ─────────────────────────────────── */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    header.style.boxShadow = window.scrollY > 20
      ? '0 4px 32px rgba(0,0,0,0.8), 0 1px 0 rgba(249,115,22,0.08)'
      : '0 4px 24px rgba(0,0,0,0.6)';
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── Mobile hamburger menu ────────────────────────────────── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');

  function closeMobileMenu() {
    if (!hamburger || !mobileNav) return;
    hamburger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    mobileNav.classList.remove('open');
  }

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      mobileNav.setAttribute('aria-hidden', String(isOpen));
      mobileNav.classList.toggle('open', !isOpen);
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) closeMobileMenu();
    });
  }

  /* ── Catalog filters ──────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Update active state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Show/hide cards
      productCards.forEach(card => {
        if (filter === 'all') {
          card.classList.remove('hidden');
        } else {
          const cats = (card.dataset.categories || '').split(' ');
          card.classList.toggle('hidden', !cats.includes(filter));
        }
      });
    });
  });

  /* ── Product "Consultar" buttons ──────────────────────────── */
  let toastTimer = null;
  const toast = document.getElementById('product-toast');

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3200);
  }

  document.querySelectorAll('.btn-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = btn.dataset.product || 'este juego';
      showToast(`⚔ "${product}" añadido a tu lista de consulta. ¡Escribinos!`);
    });
  });

  /* ── Contact form simulation ──────────────────────────────── */
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form && formSuccess) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name = form.querySelector('#contact-name').value.trim();
      const email = form.querySelector('#contact-email').value.trim();

      // Basic validation
      if (!name || !email) {
        showToast('⚠ Completá al menos tu nombre y email, aventurero.');
        return;
      }
      if (!email.includes('@')) {
        showToast('⚠ El email no parece válido. Revisalo.');
        return;
      }

      // Simulate submission
      const submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Enviando…';
      submitBtn.disabled = true;

      setTimeout(() => {
        form.hidden = true;
        formSuccess.removeAttribute('hidden');
        formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 900);
    });
  }

  /* ── Scroll-reveal animation (Intersection Observer) ─────── */
  if ('IntersectionObserver' in window) {
    const revealEls = document.querySelectorAll(
      '.about-card, .product-card, .testimonial-card'
    );

    // Add initial styles via JS so CSS stays clean
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

})();

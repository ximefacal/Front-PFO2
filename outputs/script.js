const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const filterButtons = document.querySelectorAll('.filter');
const productCards = document.querySelectorAll('.product-card');
const addButtons = document.querySelectorAll('.add-button');
const toast = document.querySelector('#toast');
const toastProduct = document.querySelector('#toast-product');
const contactForm = document.querySelector('#contact-form');
const successMessage = document.querySelector('.form-success');

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  navMenu.classList.toggle('is-open', !isOpen);
  menuToggle.querySelector('.sr-only').textContent = isOpen ? 'Abrir menú' : 'Cerrar menú';
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    menuToggle.querySelector('.sr-only').textContent = 'Abrir menú';
  });
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const selected = button.dataset.filter;

    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle('is-active', isActive);
      filterButton.setAttribute('aria-pressed', String(isActive));
    });

    productCards.forEach((card) => {
      const categories = card.dataset.category.split(' ');
      const shouldShow = selected === 'all' || categories.includes(selected);
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});

let toastTimer;
addButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const product = button.dataset.product;
    toastProduct.textContent = `${product} fue agregado a la lista de consulta.`;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3600);
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  successMessage.hidden = false;
  contactForm.reset();
  successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, revealObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px' });

  document.querySelectorAll('.reveal').forEach((element, index) => {
    element.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
    observer.observe(element);
  });
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

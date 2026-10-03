const menuButton = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('#primary-nav');

function closeMenu() {
  if (!menuButton || !primaryNav) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation menu');
  primaryNav.classList.remove('is-open');
}

if (menuButton && primaryNav) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    primaryNav.classList.toggle('is-open', !isOpen);
  });

  primaryNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const copyButton = document.querySelector('[data-copy-email]');
const emailLink = document.querySelector('#email-link');
if (copyButton && emailLink) {
  copyButton.addEventListener('click', async () => {
    const email = emailLink.textContent.replace('↗', '').trim();
    const originalLabel = 'Copy email';
    try {
      await navigator.clipboard.writeText(email);
      copyButton.innerHTML = 'Copied <span aria-hidden="true">✓</span>';
    } catch {
      window.location.href = emailLink.href;
      copyButton.textContent = 'Opening email…';
    }
    window.setTimeout(() => {
      copyButton.innerHTML = `${originalLabel} <span aria-hidden="true">⧉</span>`;
    }, 1800);
  });
}

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
}

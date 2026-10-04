/* ============ Mobile menu ============ */
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
    if (event.key === 'Escape') {
      closeMenu();
      closeModal();
    }
  });
}

/* ============ Footer year ============ */
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

/* ============ Typing roles ============ */
const roles = [
  'modern websites 🌐',
  'mobile apps 📱',
  'AI chatbots & agents 🤖',
  'fast APIs & backends ⚙️',
  'ideas into products 🚀',
];
const typedEl = document.querySelector('#typed-role');
if (typedEl) {
  let roleIndex = 0;
  let charIndex = roles[0].length;
  let deleting = true;
  const typeSpeed = 45;
  const deleteSpeed = 22;
  const holdTime = 1600;

  function tick() {
    const current = roles[roleIndex];
    if (!deleting) {
      charIndex++;
      typedEl.textContent = current.slice(0, charIndex);
      if (charIndex >= current.length) {
        deleting = true;
        setTimeout(tick, holdTime);
        return;
      }
      setTimeout(tick, typeSpeed);
    } else {
      charIndex--;
      typedEl.textContent = current.slice(0, Math.max(charIndex, 0));
      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, deleteSpeed);
    }
  }
  setTimeout(tick, holdTime);
}

/* ============ Copy email ============ */
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

/* ============ Reveal on scroll + skill bars + counters ============ */
function animateCount(el) {
  const target = parseInt(el.getAttribute('data-count') || '0', 10);
  if (!target || el.dataset.done) return;
  el.dataset.done = '1';
  const duration = 1400;
  const start = performance.now();
  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(target * eased).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(animateCount);
        if (entry.target.hasAttribute('data-count')) animateCount(entry.target);
        // Skill bars: set width from data-level
        entry.target.querySelectorAll?.('.skill-fill').forEach((bar) => {
          bar.style.setProperty('--level', (bar.getAttribute('data-level') || '80') + '%');
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));
  // Observe counters outside reveal blocks too
  document.querySelectorAll('[data-count]').forEach((el) => {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(el); obs.disconnect(); }
      });
    }, { threshold: 0.4 });
    counterObserver.observe(el);
  });
} else {
  document.querySelectorAll('[data-count]').forEach((el) => {
    el.textContent = (el.getAttribute('data-count') || '0');
  });
  document.querySelectorAll('.skill-fill').forEach((bar) => {
    bar.style.width = (bar.getAttribute('data-level') || '80') + '%';
  });
}

/* ============ Project filtering ============ */
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const filter = btn.getAttribute('data-filter');
    projectCards.forEach((card) => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;
      card.classList.toggle('is-hidden', !show);
      if (show) card.classList.add('is-visible');
    });
  });
});

/* ============ Project modal ============ */
const projectData = {
  novakart: {
    kicker: 'WEB / E-COMMERCE · NEXT.JS',
    title: 'NovaKart — sell anything, fast',
    desc: 'A complete online store: product pages, cart, UPI + card payments, order tracking and an admin dashboard with sales analytics. Loads in under 1 second and ranks well on Google.',
    features: ['⚡ Next.js storefront with 95+ PageSpeed score', '💳 Razorpay + Stripe payments & order emails', '📊 Admin dashboard with sales charts', '🤖 AI-powered product search & recommendations'],
    tags: ['Next.js', 'Stripe', 'MongoDB', 'Tailwind'],
  },
  fitpulse: {
    kicker: 'APP / FITNESS · FLUTTER',
    title: 'FitPulse — your pocket coach',
    desc: 'A fitness app for Android & iOS with workout plans, streak tracking, progress photos and reminders. Built with one codebase, published on both stores.',
    features: ['📱 One codebase for Android + iOS', '🔥 Streaks, badges & push reminders', '📈 Progress charts with Health API sync', '☁️ Firebase auth, database & cloud backup'],
    tags: ['Flutter', 'Firebase', 'Health API', 'RevenueCat'],
  },
  promptship: {
    kicker: 'AI / SAAS · OPENAI + LANGCHAIN',
    title: 'PromptShip — AI agents for business',
    desc: 'A platform where businesses connect their website/docs and get a smart AI agent that answers customer questions 24×7 on WhatsApp, websites and Instagram.',
    features: ['🤖 Custom agents trained on your own data (RAG)', '💬 WhatsApp, website & Instagram integrations', '📊 Analytics: resolved chats, CSAT, handoffs', '🧠 GPT-4 + embeddings with guardrails'],
    tags: ['Python', 'OpenAI', 'LangChain', 'React', 'Pinecone'],
  },
  foodiego: {
    kicker: 'WEB + APP / FOOD DELIVERY',
    title: 'FoodieGo — cravings, delivered',
    desc: 'Food ordering platform with restaurant listings, live rider tracking on maps, coupons and UPI checkout — plus a partner app for restaurants.',
    features: ['🗺️ Live order tracking with Maps API', '💸 Coupons, wallet & UPI payments', '🏪 Restaurant partner dashboard', '🔔 Real-time status via WebSockets'],
    tags: ['React', 'Node.js', 'MongoDB', 'Maps API'],
  },
  visionlens: {
    kicker: 'AI / COMPUTER VISION · PYTHON',
    title: 'VisionLens — AI that sees',
    desc: 'Upload any photo and get instant object detection, auto-captions and smart tags. Exposed as both a web app and a simple API for developers.',
    features: ['👁️ YOLO-based detection in under 0.5s', '🏷️ Auto-captions & searchable tags', '🔌 Developer-friendly REST API + docs', '☁️ Deployed with GPU inference on cloud'],
    tags: ['Python', 'YOLO', 'FastAPI', 'React'],
  },
  eduspark: {
    kicker: 'APP + AI / EDTECH · FLUTTER',
    title: 'EduSpark — learn with AI',
    desc: 'A learning app with quizzes, smart notes and a 24×7 AI tutor that explains any topic simply, in English or Hindi. Loved by 2,000+ students.',
    features: ['🧠 AI tutor with voice + text explanations', '📝 Auto-generated quizzes from any chapter', '🌐 English + Hindi support', '🏆 Leaderboards, XP & daily goals'],
    tags: ['Flutter', 'OpenAI', 'Firebase', 'TTS'],
  },
};

const modal = document.querySelector('#modal');
const modalKicker = document.querySelector('#modal-kicker');
const modalTitle = document.querySelector('#modal-title');
const modalDesc = document.querySelector('#modal-desc');
const modalFeatures = document.querySelector('#modal-features');
const modalTags = document.querySelector('#modal-tags');
const modalClose = document.querySelector('#modal-close');
const modalContact = document.querySelector('#modal-contact');

function openModal(key) {
  const data = projectData[key];
  if (!data || !modal) return;
  modalKicker.textContent = data.kicker;
  modalTitle.textContent = data.title;
  modalDesc.textContent = data.desc;
  modalFeatures.innerHTML = '';
  data.features.forEach((f) => {
    const li = document.createElement('li');
    li.textContent = f;
    modalFeatures.appendChild(li);
  });
  modalTags.innerHTML = '';
  data.tags.forEach((t) => {
    const s = document.createElement('span');
    s.textContent = t;
    modalTags.appendChild(s);
  });
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  modalClose?.focus();
}

function closeModal() {
  if (!modal || !modal.classList.contains('is-open')) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('[data-open-modal]').forEach((el) => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    openModal(el.getAttribute('data-open-modal'));
  });
});
modalClose?.addEventListener('click', closeModal);
modal?.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
modalContact?.addEventListener('click', closeModal);

/* ============ Testimonial slider ============ */
const slides = document.querySelectorAll('.slide');
const dotsWrap = document.querySelector('#slider-dots');
const prevBtn = document.querySelector('#slide-prev');
const nextBtn = document.querySelector('#slide-next');
let slideIndex = 0;
let slideTimer = null;

function showSlide(i) {
  if (!slides.length) return;
  slideIndex = (i + slides.length) % slides.length;
  slides.forEach((s, idx) => s.classList.toggle('is-active', idx === slideIndex));
  dotsWrap?.querySelectorAll('button').forEach((d, idx) => {
    d.classList.toggle('is-active', idx === slideIndex);
  });
}
function restartAutoSlide() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = setInterval(() => showSlide(slideIndex + 1), 6000);
}
if (slides.length && dotsWrap) {
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', 'Show testimonial ' + (idx + 1));
    if (idx === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => { showSlide(idx); restartAutoSlide(); });
    dotsWrap.appendChild(dot);
  });
  prevBtn?.addEventListener('click', () => { showSlide(slideIndex - 1); restartAutoSlide(); });
  nextBtn?.addEventListener('click', () => { showSlide(slideIndex + 1); restartAutoSlide(); });
  restartAutoSlide();
}

/* ============ Active nav highlight ============ */
const navLinks = document.querySelectorAll('.primary-nav > a[href^="#"]');
const sections = [...navLinks]
  .map((a) => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach((s) => navObserver.observe(s));
}

/* ============ Floating back-to-top ============ */
const toTop = document.querySelector('#to-top');
window.addEventListener('scroll', () => {
  toTop?.classList.toggle('show', window.scrollY > 600);
}, { passive: true });
toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============ Résumé download ============ */
const resumeBtn = document.querySelector('#resume-btn');
if (resumeBtn) {
  resumeBtn.addEventListener('click', () => {
    const resume = [
      '==============================================',
      '  HARSH — Websites, Apps & AI Developer',
      '  Email: hello@harsh.dev | India (Remote 🌍)',
      '  GitHub: github.com/harsh-dev',
      '==============================================',
      '',
      'ABOUT',
      '  Developer building fast websites, smooth mobile',
      '  apps and intelligent AI products.',
      '',
      'SKILLS',
      '  Web: HTML, CSS, JavaScript, React, Next.js',
      '  Apps: Flutter, React Native, Firebase',
      '  AI: Python, OpenAI, LangChain, RAG, Agents',
      '  Backend: Node.js, MongoDB, SQL, Git, Docker',
      '',
      'PROJECTS',
      '  1. NovaKart — E-commerce website (Next.js)',
      '  2. FitPulse — Fitness app (Flutter)',
      '  3. PromptShip — AI agents SaaS (OpenAI)',
      '  4. FoodieGo — Food delivery web + app',
      '  5. VisionLens — AI image recognition',
      '  6. EduSpark — AI learning app',
      '',
      'SERVICES',
      '  Websites from Rs.9,999 | Apps from Rs.24,999',
      '  AI solutions from Rs.19,999',
      '',
      'CONTACT',
      '  Email hello@harsh.dev — replies within 24 hrs!',
      '==============================================',
    ].join('\n');
    const blob = new Blob([resume], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Harsh-Resume.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    resumeBtn.innerHTML = 'Downloaded ✓ <span aria-hidden="true">⭳</span>';
    setTimeout(() => {
      resumeBtn.innerHTML = 'Download résumé <span aria-hidden="true">⭳</span>';
    }, 2000);
  });
}

/* ============ Contact form ============ */
const form = document.querySelector('#contact-form');
const formError = document.querySelector('#form-error');
const formSuccess = document.querySelector('#form-success');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formError?.classList.remove('show');
    formSuccess?.classList.remove('show');
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const type = String(data.get('type') || '').trim();
    const budget = String(data.get('budget') || '').trim();
    const message = String(data.get('message') || '').trim();

    let error = '';
    if (name.length < 2) error = 'Please tell me your name 🙂';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error = 'Hmm, that email doesn\'t look right 📧';
    else if (!type) error = 'Please choose a project type 🌐📱🤖';
    else if (message.length < 10) error = 'Tell me a little more about your project (10+ characters) ✍️';

    if (error) {
      if (formError) { formError.textContent = '⚠️ ' + error; formError.classList.add('show'); }
      return;
    }

    // Open the visitor's email app with everything pre-filled
    const subject = encodeURIComponent(`New ${type} project from ${name}`);
    const body = encodeURIComponent(`Hi Harsh!\n\nMy name: ${name}\nEmail: ${email}\nProject type: ${type}\nBudget: ${budget || 'Not specified'}\n\nAbout my project:\n${message}\n`);
    window.location.href = `mailto:hello@harsh.dev?subject=${subject}&body=${body}`;

    if (formSuccess) {
      formSuccess.textContent = `Thanks ${name}! 🎉 Your email app should open now — just hit send and I'll reply within 24 hours.`;
      formSuccess.classList.add('show');
    }
    form.reset();
  });
}

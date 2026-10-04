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

/* ============ 3D tilt on profile photo ============ */
const profileCard = document.querySelector('#profile-card');
const profileFrame = profileCard?.querySelector('.profile-frame');
if (profileCard && profileFrame && window.matchMedia('(pointer: fine)').matches) {
  profileCard.addEventListener('mousemove', (e) => {
    const rect = profileCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    profileFrame.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg) scale(1.02)`;
  });
  profileCard.addEventListener('mouseleave', () => {
    profileFrame.style.transform = 'rotateY(0deg) rotateX(0deg) scale(1)';
  });
}

/* ============ Cursor glow follower ============ */
const glowFollower = document.querySelector('#glow-follower');
if (glowFollower && window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let gx = -500, gy = -500, tx = -500, ty = -500;
  document.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    glowFollower.classList.add('on');
  });
  document.addEventListener('mouseleave', () => glowFollower.classList.remove('on'));
  (function glowLoop() {
    gx += (tx - gx) * 0.08;
    gy += (ty - gy) * 0.08;
    glowFollower.style.transform = `translate(${gx}px, ${gy}px)`;
    requestAnimationFrame(glowLoop);
  })();
}

/* ============ Matrix rain canvas ============ */
const matrixCanvas = document.querySelector('#matrix');
const terminalWindow = document.querySelector('.terminal-window');
let matrixOn = false;
let matrixRAF = null;
if (matrixCanvas && terminalWindow) {
  const mctx = matrixCanvas.getContext('2d');
  const glyphs = '01アイタチツテトナニヌネノHARSH<>/\\{}[]$#@!?*+='.split('');
  let drops = [];
  function sizeMatrix() {
    const r = terminalWindow.getBoundingClientRect();
    matrixCanvas.width = Math.max(r.width, 300);
    matrixCanvas.height = Math.max(r.height, 300);
    const cols = Math.floor(matrixCanvas.width / 16);
    drops = Array.from({ length: cols }, () => Math.random() * -40);
  }
  function drawMatrix() {
    if (!matrixOn) { matrixRAF = null; return; }
    mctx.fillStyle = 'rgba(8, 10, 8, 0.12)';
    mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    mctx.font = '14px monospace';
    drops.forEach((y, i) => {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      mctx.fillStyle = Math.random() > 0.97 ? '#eaffb0' : '#7fae2e';
      mctx.fillText(ch, i * 16, y * 16);
      drops[i] = y * 16 > matrixCanvas.height && Math.random() > 0.976 ? 0 : y + 0.6;
    });
    matrixRAF = requestAnimationFrame(drawMatrix);
  }
  window.toggleMatrix = function (force) {
    matrixOn = typeof force === 'boolean' ? force : !matrixOn;
    terminalWindow.classList.toggle('matrix-on', matrixOn);
    if (matrixOn) {
      sizeMatrix();
      if (!matrixRAF) drawMatrix();
    }
  };
  window.addEventListener('resize', () => { if (matrixOn) sizeMatrix(); });
}

/* ============ Interactive terminal ============ */
const termOutput = document.querySelector('#terminal-output');
const termForm = document.querySelector('#terminal-form');
const termInput = document.querySelector('#terminal-input');
const termBody = document.querySelector('#terminal-body');

function termScroll() {
  if (termBody) termBody.scrollTop = termBody.scrollHeight;
}
function termPrint(html, cls = '') {
  if (!termOutput) return;
  const div = document.createElement('div');
  div.className = 'term-line ' + cls;
  div.innerHTML = html;
  termOutput.appendChild(div);
  termScroll();
}
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

const ASCII = `<pre class="term-ascii">  _   _   ___   ___   ___   _   _
 | | | | / _ \\ |_ _| / _ \\ | | | |
 | |_| || | | | | | | | | || |_| |
 |  _  || |_| | | | | |_| | \\___/
 |_| |_| \\___/ |___| \\___/  v2.0</pre>`;

const COMMANDS = {
  help() {
    return `<span class="term-ok">Available commands:</span>
  <span class="term-ok">whoami</span>    — who are you?
  <span class="term-ok">harsh</span>     — who is Harsh?
  <span class="term-ok">skills</span>    — the tech stack
  <span class="term-ok">projects</span>  — what I've shipped
  <span class="term-ok">contact</span>   — how to reach me
  <span class="term-ok">socials</span>   — find me online
  <span class="term-ok">matrix</span>    — toggle the matrix 🕶️
  <span class="term-ok">hire</span>      — start the hiring sequence 🚀
  <span class="term-ok">joke</span>      — a dev joke, obviously
  <span class="term-ok">clear</span>     — wipe the terminal`;
  },
  whoami() {
    return `You are <span class="term-ok">visitor #${Math.floor(1000 + Math.random() * 9000)}</span> — a person of excellent taste, currently exploring Harsh's portfolio. 😎`;
  },
  harsh() {
    return `Harsh — developer from India 🇮🇳
  🌐 builds <span class="term-ok">websites</span> that load in a blink
  📱 ships <span class="term-ok">mobile apps</span> people actually keep
  🤖 crafts <span class="term-ok">AI products</span> that feel like magic
  ☕ powered by chai. hire him.`;
  },
  about() { return COMMANDS.harsh(); },
  skills() {
    return `<span class="term-ok">stack --list:</span>
  frontend ▓▓▓▓▓▓▓▓▓░ React · Next.js · Tailwind
  mobile   ▓▓▓▓▓▓▓▓░░ Flutter · React Native
  ai       ▓▓▓▓▓▓▓▓░░ OpenAI · LangChain · Python
  backend  ▓▓▓▓▓▓▓▓░░ Node.js · MongoDB · Firebase`;
  },
  projects() {
    return `<span class="term-ok">shipped --recent:</span>
  1. NovaKart    🌐 e-commerce website (Next.js)
  2. FitPulse    📱 fitness app (Flutter)
  3. PromptShip  🤖 AI agents SaaS (OpenAI)
  4. FoodieGo    🍔 food delivery web + app
  5. VisionLens  👁️ AI image recognition
  6. EduSpark    🎓 AI learning app
  <span class="term-dim">tip: scroll up to #work for the pretty version ↓… I mean ↑</span>`;
  },
  contact() {
    return `📧 email → <a class="term-link" href="mailto:hello@harsh.dev">hello@harsh.dev</a>
  ⚡ replies within 24 hours. or scroll down to the form 👇`;
  },
  socials() {
    return `find me everywhere:
  🐙 <a class="term-link" href="https://github.com/harsh-dev" target="_blank" rel="noreferrer">github.com/harsh-dev</a>
  💼 <a class="term-link" href="https://www.linkedin.com/in/harsh-dev" target="_blank" rel="noreferrer">linkedin.com/in/harsh-dev</a>
  🐦 <a class="term-link" href="https://x.com/harsh_dev" target="_blank" rel="noreferrer">x.com/harsh_dev</a>
  📸 <a class="term-link" href="https://www.instagram.com/harsh.dev" target="_blank" rel="noreferrer">instagram.com/harsh.dev</a>`;
  },
  matrix() {
    window.toggleMatrix?.();
    return matrixOn ? '🕶️ <span class="term-ok">Welcome to the Matrix.</span> (type matrix again to exit)' : '<span class="term-dim">Matrix disabled. Back to reality. Boring, I know.</span>';
  },
  hire() {
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
    return `🚀 <span class="term-ok">Excellent choice!</span> Initiating hiring sequence…
  ▓▓▓▓▓▓▓▓▓▓ 100% — taking you to the contact form…`;
  },
  joke() {
    const jokes = [
      'Why do programmers prefer dark mode? Because light attracts bugs. 🪲',
      'I told my computer I needed a break… now it won\'t stop sending me KitKat ads. 🍫',
      'Why did the developer go broke? He used up all his cache. 💸',
      'There are only 10 kinds of people: those who understand binary and those who don\'t. 01',
      'My code doesn\'t have bugs, it has… undocumented features. ✨',
    ];
    return '😄 ' + jokes[Math.floor(Math.random() * jokes.length)] + ' <span class="term-dim">(type joke for another)</span>';
  },
  sudo() { return '<span class="term-warn">nice try 😏 — but only Harsh has sudo access here.</span>'; },
  hello() { return '👋 Hello! Type <span class="term-ok">help</span> to see what I can do.'; },
  hi() { return COMMANDS.hello(); },
  date() { return '📅 ' + new Date().toString(); },
  echo(args) { return escapeHtml(args.join(' ')) || '<span class="term-dim">(nothing to echo)</span>'; },
};

function runCommand(raw) {
  const input = raw.trim();
  termPrint(`<span class="prompt">visitor@harsh:~$</span> <span class="cmd-echo">${escapeHtml(input) || ''}</span>`);
  if (!input) return;
  const [cmd, ...args] = input.toLowerCase().split(/\s+/);
  if (cmd === 'clear') {
    termOutput.innerHTML = '';
    return;
  }
  if (COMMANDS[cmd]) {
    termPrint(COMMANDS[cmd](args));
  } else {
    termPrint(`<span class="term-warn">command not found: ${escapeHtml(cmd)}</span> — try <span class="term-ok">help</span> 🤔`);
  }
}

if (termOutput && termForm && termInput) {
  // Boot message
  termPrint(ASCII);
  termPrint(`Welcome to <span class="term-ok">harsh.exe</span> — the interactive portfolio terminal.`);
  termPrint(`Type <span class="term-ok">help</span> to begin. Go on, break something. 😈`);
  termPrint(`<span class="term-dim">─────────────────────────────────────</span>`);

  termForm.addEventListener('submit', (e) => {
    e.preventDefault();
    runCommand(termInput.value);
    termInput.value = '';
    termInput.focus();
  });

  // Clicking anywhere in terminal focuses input
  termBody?.addEventListener('click', () => termInput.focus());

  // Hint buttons run commands
  document.querySelectorAll('[data-cmd]').forEach((btn) => {
    btn.addEventListener('click', () => {
      runCommand(btn.getAttribute('data-cmd') || '');
      termInput.focus();
    });
  });
}

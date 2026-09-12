/* ==========================================================================
  1. MOBILE NAVIGATION
========================================================================== */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu whenever a link inside it is tapped
document.querySelectorAll('[data-nav-mobile]').forEach(link => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

/* ==========================================================================
  2. ACTIVE NAV-LINK INDICATOR (scrollspy via IntersectionObserver)
========================================================================== */
const sections = document.querySelectorAll('section[id]');
const navLinkMap = new Map();
document.querySelectorAll('[data-nav], [data-nav-mobile]').forEach(link => {
  const id = link.getAttribute('href').slice(1);
  if (!navLinkMap.has(id)) navLinkMap.set(id, []);
  navLinkMap.get(id).push(link);
});

const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Clear all active states, then activate the links matching this section
      navLinkMap.forEach(links => links.forEach(l => l.classList.remove('active')));
      const links = navLinkMap.get(entry.target.id);
      if (links) links.forEach(l => l.classList.add('active'));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

sections.forEach(sec => spyObserver.observe(sec));

/* ==========================================================================
  3. SCROLL-REVEAL ANIMATIONS
========================================================================== */
const revealTargets = document.querySelectorAll('.reveal, .reveal-stagger');
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Skill bars animate their width only once they're visible
      if (entry.target.id === 'skillsGrid') animateSkillBars();
      obs.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => revealObserver.observe(el));

function animateSkillBars(){
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const target = bar.getAttribute('data-width') || 0;
    requestAnimationFrame(() => { bar.style.width = target + '%'; });
  });
}

/* ==========================================================================
  4. HERO TYPEWRITER EFFECT
========================================================================== */
const typedTextEl = document.getElementById('typedText');
const typePhrases = [
  "console.log('Hello, World!');",
  "Building things that (mostly) work.",
  "Currently debugging life.",
  "Learning something new every sprint."
];
let phraseIndex = 0, charIndex = 0, deleting = false;

function typeLoop(){
  const current = typePhrases[phraseIndex];
  if (!deleting) {
    charIndex++;
    typedTextEl.textContent = current.slice(0, charIndex);
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1600);
      return;
    }
  } else {
    charIndex--;
    typedTextEl.textContent = current.slice(0, charIndex);
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % typePhrases.length;
    }
  }
  setTimeout(typeLoop, deleting ? 35 : 55);
}
typeLoop();

/* ==========================================================================
  5. DARK / LIGHT MODE TOGGLE
   Note: theme choice is kept in memory only (no localStorage), so this file
   behaves consistently whether opened directly or previewed in a sandboxed
   viewer. It defaults to dark mode on every load.
========================================================================== */
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const sunPath = '<path d="M12 4V2M12 22v-2M4 12H2M22 12h-2M5 5l-1.4-1.4M19 19l-1.4-1.4M5 19l-1.4 1.4M19 5l-1.4 1.4"/><circle cx="12" cy="12" r="5"/>';
const moonPath = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    themeIcon.innerHTML = moonPath;
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.innerHTML = sunPath;
  }
});

/* ==========================================================================
  6. BACK-TO-TOP BUTTON
========================================================================== */
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > 600);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ==========================================================================
  7. CONTACT FORM VALIDATION (client-side only — no backend to send to)
========================================================================== */
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

function setFieldError(inputId, errorId, message){
  document.getElementById(errorId).textContent = message;
  document.getElementById(inputId).style.borderColor = message ? 'var(--accent-red)' : 'var(--border)';
}

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name = document.getElementById('nameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  const message = document.getElementById('messageInput').value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (name.length < 2) {
    setFieldError('nameInput', 'nameError', 'Please enter your name.');
    valid = false;
  } else {
    setFieldError('nameInput', 'nameError', '');
  }

  if (!emailPattern.test(email)) {
    setFieldError('emailInput', 'emailError', 'Please enter a valid email address.');
    valid = false;
  } else {
    setFieldError('emailInput', 'emailError', '');
  }

  if (message.length < 10) {
    setFieldError('messageInput', 'messageError', 'Message should be at least 10 characters.');
    valid = false;
  } else {
    setFieldError('messageInput', 'messageError', '');
  }

  formStatus.classList.remove('show', 'ok', 'err');
  if (!valid) {
    formStatus.textContent = '> Error: please fix the fields above.';
    formStatus.classList.add('show', 'err');
    return;
  }

  // No backend is wired up — this simulates a successful send for demo purposes.
  formStatus.textContent = '> Message queued for delivery. (Demo only — connect a backend or form service to actually send this.)';
  formStatus.classList.add('show', 'ok');
  contactForm.reset();
});

/* ==========================================================================
  8. FOOTER YEAR
========================================================================== */
document.getElementById('year').textContent = new Date().getFullYear();

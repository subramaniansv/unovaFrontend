/* ═══════════════════════════════════════════════════════════════
   UNOVA – Interactive Behaviour
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Navbar scroll effect ──────────────────────────────────────── */
const navbar = document.getElementById('navbar');

const handleNavScroll = () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* ─── Mobile hamburger menu ─────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  // prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

/* ─── Back to top button ────────────────────────────────────────── */
const backToTopBtn = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── Intersection Observer – animate on scroll ─────────────────── */
const aosObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        aosObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('[data-aos]').forEach(el => aosObserver.observe(el));

/* ─── Portfolio filter ──────────────────────────────────────────── */
const filterBtns     = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    portfolioCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.style.display = '';
        // trigger re-animation
        card.classList.remove('aos-animate');
        requestAnimationFrame(() => card.classList.add('aos-animate'));
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* ─── Contact form validation & submission ──────────────────────── */
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');

const validators = {
  name:    { el: document.getElementById('name'),    errEl: document.getElementById('nameError'),    check: v => v.trim().length >= 2 ? '' : 'Please enter your full name.' },
  email:   { el: document.getElementById('email'),   errEl: document.getElementById('emailError'),   check: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.' },
  service: { el: document.getElementById('service'), errEl: document.getElementById('serviceError'), check: v => v ? '' : 'Please select a service.' },
  message: { el: document.getElementById('message'), errEl: document.getElementById('messageError'), check: v => v.trim().length >= 10 ? '' : 'Please describe your project (min 10 characters).' },
};

// Live validation on blur
Object.values(validators).forEach(({ el, errEl, check }) => {
  el.addEventListener('blur', () => {
    const msg = check(el.value);
    errEl.textContent = msg;
    errEl.classList.toggle('visible', !!msg);
    el.style.borderColor = msg ? '#f87171' : '';
  });

  el.addEventListener('input', () => {
    if (errEl.classList.contains('visible')) {
      const msg = check(el.value);
      errEl.textContent = msg;
      errEl.classList.toggle('visible', !!msg);
      el.style.borderColor = msg ? '#f87171' : '';
    }
  });
});

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validate all fields
  let isValid = true;
  Object.values(validators).forEach(({ el, errEl, check }) => {
    const msg = check(el.value);
    errEl.textContent = msg;
    errEl.classList.toggle('visible', !!msg);
    el.style.borderColor = msg ? '#f87171' : '';
    if (msg) isValid = false;
  });

  if (!isValid) return;

  // Simulate submission (replace with actual fetch/API call)
  const btnText   = submitBtn.querySelector('.btn-text');
  const btnLoader = submitBtn.querySelector('.btn-loader');

  submitBtn.disabled = true;
  btnText.hidden   = true;
  btnLoader.hidden = false;

  setTimeout(() => {
    submitBtn.disabled = false;
    btnText.hidden   = false;
    btnLoader.hidden = true;
    formSuccess.hidden = false;
    contactForm.reset();
    // scroll success into view
    formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    // hide success after 5s
    setTimeout(() => { formSuccess.hidden = true; }, 5000);
  }, 1800);
});

/* ─── Active nav link highlight on scroll ───────────────────────── */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-links a').forEach(a => {
          a.classList.toggle('active-nav', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(sec => navObserver.observe(sec));

// Style for active nav link
const style = document.createElement('style');
style.textContent = '.nav-links a.active-nav { color: var(--text-primary); background: rgba(255,255,255,.06); }';
document.head.appendChild(style);

/* ─── Footer year ───────────────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── Smooth scroll for all anchor links ───────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80; // navbar height
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── Animated counter for hero stats ──────────────────────────── */
const animateCounter = (el, target, suffix = '') => {
  const duration = 2000;
  const startTime = performance.now();
  const isNumeric = !isNaN(parseInt(target));
  const end = parseInt(target);

  if (!isNumeric) return; // skip "Custom"

  const tick = (currentTime) => {
    const elapsed   = currentTime - startTime;
    const progress  = Math.min(elapsed / duration, 1);
    const eased     = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current   = Math.floor(eased * end);
    el.textContent  = current + suffix;
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target + suffix;
  };
  requestAnimationFrame(tick);
};

const heroObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.stat-num').forEach(el => {
          const raw = el.textContent.trim();
          const num = raw.replace(/\D/g, '');
          const suffix = raw.replace(/[0-9]/g, '');
          animateCounter(el, num, suffix);
        });
        heroObserver.disconnect();
      }
    });
  },
  { threshold: 0.5 }
);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

/* ─── Tilt effect on service & pricing cards (desktop only) ─────── */
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.service-card, .pricing-card, .testimonial-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

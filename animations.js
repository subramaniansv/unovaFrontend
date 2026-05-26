/* ════════════════════════════════════════════════════════════════
   UNOVA — Advanced Animations & Interactions
   Powered by GSAP 3 + ScrollTrigger
   ════════════════════════════════════════════════════════════════ */
'use strict';

(() => {

/* ── Register GSAP plugins ──────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── Helpers ─────────────────────────────────────────────────────── */
const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const FINE = window.matchMedia('(pointer: fine)').matches;

/* ════════════════════════════════════════════════════════════════
   INJECT — Cursor + Progress Bar + Canvas via JS
   (keeps HTML clean, no hard dependencies)
════════════════════════════════════════════════════════════════ */
document.body.insertAdjacentHTML('beforeend',
  `<div class="cx-dot"  id="cxDot"></div>
   <div class="cx-ring" id="cxRing"></div>
   <div class="scroll-prog" id="scrollProg"></div>`
);

const heroEl = q('.hero');
if (heroEl) {
  const cvs = document.createElement('canvas');
  cvs.id = 'heroCanvas';
  cvs.setAttribute('aria-hidden', 'true');
  heroEl.prepend(cvs);
}

/* ════════════════════════════════════════════════════════════════
   1. SCROLL PROGRESS BAR
════════════════════════════════════════════════════════════════ */
const progBar = q('#scrollProg');
const updateProg = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max > 0) progBar.style.width = (window.scrollY / max * 100).toFixed(2) + '%';
};
window.addEventListener('scroll', updateProg, { passive: true });
updateProg();

/* ════════════════════════════════════════════════════════════════
   2. CUSTOM CURSOR  (fine-pointer / desktop only)
════════════════════════════════════════════════════════════════ */
if (FINE) {
  document.body.classList.add('custom-cursor');

  const dot  = q('#cxDot');
  const ring = q('#cxRing');
  let mx = -300, my = -300;
  let rx = -300, ry = -300;

  /* Dot — instant */
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  /* Ring — LERP smoothing */
  (function lerpRing() {
    rx += (mx - rx) * 0.115;
    ry += (my - ry) * 0.115;
    ring.style.left = rx.toFixed(2) + 'px';
    ring.style.top  = ry.toFixed(2) + 'px';
    requestAnimationFrame(lerpRing);
  })();

  /* Hover state — ring expands, dot shrinks */
  const hoverEls = qa('a, button, .service-card, .portfolio-card, .pricing-card, .testimonial-card, input, select, textarea, .filter-btn, label');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cx-hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cx-hovering'));
  });

  /* Click pulse on ring */
  document.addEventListener('mousedown', () => ring.classList.add('cx-click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('cx-click'));

  /* Hide when cursor leaves window */
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ════════════════════════════════════════════════════════════════
   3. HERO CANVAS PARTICLES
════════════════════════════════════════════════════════════════ */
const cvs = q('#heroCanvas');
if (cvs && heroEl) {
  const ctx = cvs.getContext('2d');

  const resizeCvs = () => {
    cvs.width  = heroEl.offsetWidth;
    cvs.height = heroEl.offsetHeight;
  };
  resizeCvs();
  new ResizeObserver(resizeCvs).observe(heroEl);

  function makeParticle() {
    return {
      x: Math.random() * cvs.width,
      y: cvs.height * (0.2 + Math.random() * 0.8),
      r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -(Math.random() * 0.32 + 0.06),
      alpha: Math.random() * 0.35 + 0.06,
      life: 0,
      maxLife: Math.random() * 420 + 180
    };
  }

  const pts = Array.from({ length: 80 }, () => {
    const p = makeParticle();
    p.life = Math.random() * p.maxLife; // stagger start
    return p;
  });

  (function drawLoop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.life++;
      if (p.life >= p.maxLife) {
        const fresh = makeParticle();
        fresh.y = cvs.height + 5;
        Object.assign(p, fresh);
      }
      const fade = p.alpha * Math.sin(Math.PI * p.life / p.maxLife);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${fade.toFixed(3)})`;
      ctx.fill();
    });
    requestAnimationFrame(drawLoop);
  })();
}

/* ════════════════════════════════════════════════════════════════
   4. HERO ENTRANCE — GSAP STAGGERED TIMELINE
════════════════════════════════════════════════════════════════ */
gsap.timeline({ delay: 0.1 })
  .fromTo('.hero-badge',
    { autoAlpha: 0, y: 22 },
    { autoAlpha: 1, y: 0, duration: 0.75, ease: 'power3.out' })
  .fromTo('.h1-line span',
    { y: '108%' },
    { y: '0%', stagger: 0.16, duration: 0.9, ease: 'power4.out' },
    '-=0.35')
  .fromTo('.hero-subtext',
    { autoAlpha: 0, y: 22 },
    { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' },
    '-=0.5')
  .fromTo('.hero-actions .btn',
    { autoAlpha: 0, y: 18 },
    { autoAlpha: 1, y: 0, stagger: 0.12, duration: 0.65, ease: 'power3.out' },
    '-=0.5')
  .fromTo('.hero-stats .stat, .hero-stats .stat-divider',
    { autoAlpha: 0, y: 16 },
    { autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power3.out' },
    '-=0.45')
  .fromTo('.hero-scroll-indicator',
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: 0.9 },
    '-=0.25');

/* ════════════════════════════════════════════════════════════════
   5. HERO MOUSE PARALLAX — Orbs follow cursor
════════════════════════════════════════════════════════════════ */
if (heroEl && FINE) {
  heroEl.addEventListener('mousemove', e => {
    const cx = e.clientX / window.innerWidth  - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    gsap.to('.orb-1',        { x: cx * 48,  y: cy * 48,  duration: 2.0, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.orb-2',        { x: -cx * 32, y: -cy * 32, duration: 2.5, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.orb-3',        { x: cx * 18,  y: cy * 18,  duration: 1.5, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.hero-bg-grid', { x: cx * 10,  y: cy * 10,  duration: 3.0, ease: 'power2.out', overwrite: 'auto' });
  });
  heroEl.addEventListener('mouseleave', () => {
    gsap.to('.orb-1, .orb-2, .orb-3, .hero-bg-grid', {
      x: 0, y: 0, duration: 1.8, ease: 'power2.inOut', overwrite: 'auto'
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   6. ROTATING HERO PHRASES
════════════════════════════════════════════════════════════════ */
const rotPhrase = q('#rotPhrase');
if (rotPhrase) {
  const phrases = [
    'That Drive Results',
    'That Convert Visitors',
    'That Scale Fast',
    'That Win Markets'
  ];
  let pIdx = 0;

  setInterval(() => {
    pIdx = (pIdx + 1) % phrases.length;
    gsap.to(rotPhrase, {
      y: -22, autoAlpha: 0, duration: 0.38, ease: 'power2.in',
      onComplete() {
        rotPhrase.textContent = phrases[pIdx];
        gsap.fromTo(rotPhrase,
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.48, ease: 'power3.out' }
        );
      }
    });
  }, 3600);
}

/* ════════════════════════════════════════════════════════════════
   7. SCROLL TRIGGER — SECTION HEADER REVEALS
   (elements without data-aos)
════════════════════════════════════════════════════════════════ */

/* Section headers — child stagger up */
qa('.section-header').forEach(hdr => {
  gsap.fromTo([...hdr.children],
    { y: 35, autoAlpha: 0 },
    {
      y: 0, autoAlpha: 1, stagger: 0.15, duration: 0.82, ease: 'power3.out',
      scrollTrigger: { trigger: hdr, start: 'top 84%' }
    }
  );
});

/* Section tag — horizontal clip reveal */
qa('.section-tag').forEach(tag => {
  gsap.fromTo(tag,
    { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
    {
      clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: tag, start: 'top 88%' }
    }
  );
});

/* Process steps — alternating left/right */
qa('.process-step').forEach((step, i) => {
  gsap.fromTo(step,
    { x: i % 2 === 0 ? -65 : 65, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, duration: 0.85, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 84%' }
    }
  );
});

/* Process connectors — draw in */
qa('.process-connector').forEach(c => {
  gsap.fromTo(c,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1, duration: 0.55, ease: 'power2.inOut',
      scrollTrigger: { trigger: c, start: 'top 88%' }
    }
  );
});

/* Why section — text from left, pillars from right */
if (q('.why-grid')) {
  gsap.fromTo('.why-text > *',
    { x: -55, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, stagger: 0.12, duration: 0.82, ease: 'power3.out',
      scrollTrigger: { trigger: '.why-grid', start: 'top 80%' }
    }
  );
  gsap.fromTo('.pillar',
    { x: 52, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: '.why-pillars', start: 'top 80%' }
    }
  );
}

/* Contact — form from left, info from right */
if (q('.contact-layout')) {
  gsap.fromTo('.contact-form-wrap',
    { x: -52, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-layout', start: 'top 80%' }
    }
  );
  gsap.fromTo('.contact-info-wrap',
    { x: 52, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-layout', start: 'top 80%' }
    }
  );
}

/* Footer brand — fade up */
if (q('.footer-brand')) {
  gsap.fromTo('.footer-brand, .footer-links-group',
    { y: 28, autoAlpha: 0 },
    {
      y: 0, autoAlpha: 1, stagger: 0.12, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-inner', start: 'top 90%' }
    }
  );
}

/* ════════════════════════════════════════════════════════════════
   8. SCRUB PARALLAX on hero headline (depth as you scroll)
════════════════════════════════════════════════════════════════ */
if (heroEl) {
  gsap.to('.hero-content', {
    y: 80, ease: 'none',
    scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true }
  });
  gsap.to('.hero-bg-grid', {
    y: 50, ease: 'none',
    scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: true }
  });
}

/* ════════════════════════════════════════════════════════════════
   9. ENHANCED 3D CARD TILT + CURSOR-FOLLOWING SHINE
   Replaces the basic tilt in script.js
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const tiltTargets = qa(
    '.service-card, .pricing-card, .testimonial-card, .portfolio-card'
  );

  tiltTargets.forEach(card => {
    /* Inject radial shine overlay */
    const shine = document.createElement('div');
    shine.className = 'card-shine';
    card.style.overflow = 'hidden';
    card.appendChild(shine);

    card.addEventListener('mousemove', e => {
      const r    = card.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width;
      const yPct = (e.clientY - r.top)  / r.height;
      const rotX = (xPct - 0.5) * 16;   // tilt intensity
      const rotY = (yPct - 0.5) * 16;

      gsap.to(card, {
        rotateY: rotX, rotateX: -rotY,
        transformPerspective: 900,
        translateZ: 8,
        duration: 0.45, ease: 'power2.out', overwrite: 'auto'
      });
      shine.style.background =
        `radial-gradient(circle at ${(xPct * 100).toFixed(1)}% ${(yPct * 100).toFixed(1)}%, rgba(255,255,255,.14) 0%, transparent 58%)`;
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0, translateZ: 0,
        duration: 0.75, ease: 'elastic.out(1, 0.55)', overwrite: 'auto'
      });
      gsap.to(shine, {
        autoAlpha: 0, duration: 0.4,
        onComplete: () => { shine.style.background = ''; gsap.set(shine, { autoAlpha: 1 }); }
      });
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   10. MAGNETIC BUTTONS  — CTA buttons attract the cursor
════════════════════════════════════════════════════════════════ */
if (FINE) {
  qa('.btn.btn-primary, .btn.btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.38;
      const y = (e.clientY - r.top  - r.height / 2) * 0.38;
      gsap.to(btn, { x, y, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.72, ease: 'elastic.out(1, 0.42)', overwrite: 'auto' });
    });
    btn.addEventListener('mousedown', () => gsap.to(btn, { scale: 0.94, duration: 0.1, overwrite: 'auto' }));
    btn.addEventListener('mouseup',   () => gsap.to(btn, { scale: 1,    duration: 0.45, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' }));
  });
}

/* ════════════════════════════════════════════════════════════════
   11. PORTFOLIO GRID — Group hover dimming effect
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const pgrid = q('.portfolio-grid');
  if (pgrid) {
    pgrid.addEventListener('mousemove', e => {
      qa('.portfolio-card').forEach(card => {
        const r   = card.getBoundingClientRect();
        const hit = e.clientX >= r.left && e.clientX <= r.right &&
                    e.clientY >= r.top  && e.clientY <= r.bottom;
        gsap.to(card, {
          scale: hit ? 1.025 : 0.97,
          filter: hit ? 'brightness(1.05)' : 'brightness(0.82)',
          duration: 0.3, ease: 'power2.out', overwrite: 'auto'
        });
      });
    });
    pgrid.addEventListener('mouseleave', () => {
      qa('.portfolio-card').forEach(card => {
        gsap.to(card, {
          scale: 1, filter: 'brightness(1)',
          duration: 0.45, ease: 'power2.out', overwrite: 'auto'
        });
      });
    });
  }
}

/* ════════════════════════════════════════════════════════════════
   12. SERVICE ICON — Pulse + color shift on card hover
════════════════════════════════════════════════════════════════ */
qa('.service-card').forEach(card => {
  const icon = card.querySelector('.service-icon-wrap');
  if (!icon) return;
  card.addEventListener('mouseenter', () => {
    gsap.to(icon, { scale: 1.18, rotation: 8, duration: 0.35, ease: 'back.out(2)' });
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(icon, { scale: 1, rotation: 0, duration: 0.55, ease: 'elastic.out(1, 0.5)' });
  });
});

/* ════════════════════════════════════════════════════════════════
   13. MARQUEE — Pause on hover, speed up on initial load
════════════════════════════════════════════════════════════════ */
const mqBar = q('.marquee-bar');
const mqTrack = q('.marquee-track');
if (mqBar && mqTrack) {
  mqBar.addEventListener('mouseenter', () => mqTrack.style.animationPlayState = 'paused');
  mqBar.addEventListener('mouseleave', () => mqTrack.style.animationPlayState = 'running');
}

/* ════════════════════════════════════════════════════════════════
   14. BACK-TO-TOP BUTTON — Animated entrance
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const btt = q('#backToTop');
  if (btt) {
    btt.addEventListener('mouseenter', () => gsap.to(btt, { y: -4, scale: 1.1, duration: 0.3, ease: 'power2.out' }));
    btt.addEventListener('mouseleave', () => gsap.to(btt, { y:  0, scale: 1.0, duration: 0.5, ease: 'elastic.out(1, 0.5)' }));
  }
}

/* ════════════════════════════════════════════════════════════════
   15. PRICING CARD — Featured card pulse glow
════════════════════════════════════════════════════════════════ */
const featCard = q('.pricing-card.featured');
if (featCard) {
  gsap.to(featCard, {
    boxShadow: '0 0 60px rgba(99,102,241,.45), 0 8px 40px rgba(0,0,0,.6)',
    duration: 1.6, yoyo: true, repeat: -1, ease: 'sine.inOut'
  });
}

/* ════════════════════════════════════════════════════════════════
   16. STAT NUMBERS — Animated counter on scroll
════════════════════════════════════════════════════════════════ */
function runCounter(el) {
  const raw    = el.textContent.trim();
  const num    = parseInt(raw.replace(/\D/g, ''), 10);
  const suffix = raw.replace(/[0-9]/g, '');
  if (isNaN(num)) return;

  gsap.fromTo({ v: 0 }, { v: num },
    {
      duration: 2.2, ease: 'power2.out',
      onUpdate() { el.textContent = Math.round(this.targets()[0].v) + suffix; },
      onComplete() { el.textContent = raw; }
    }
  );
}

/* Hero stats counter  (fires once on scroll into view) */
const heroStats = q('.hero-stats');
if (heroStats) {
  ScrollTrigger.create({
    trigger: heroStats,
    start: 'top 85%',
    once: true,
    onEnter: () => qa('.hero-stats .stat-num').forEach(runCounter)
  });
}

/* Why-section metrics counter */
const whyMetrics = q('.why-metrics');
if (whyMetrics) {
  ScrollTrigger.create({
    trigger: whyMetrics,
    start: 'top 85%',
    once: true,
    onEnter: () => qa('.metric-value').forEach(runCounter)
  });
}

/* ════════════════════════════════════════════════════════════════
   17. NAVBAR — Active link smooth indicator
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const navLinks = qa('.nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      gsap.to(link, { y: -2, duration: 0.22, ease: 'power2.out', overwrite: 'auto' });
    });
    link.addEventListener('mouseleave', () => {
      gsap.to(link, { y:  0, duration: 0.4, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   18. SCROLL-TRIGGER — Reveal filter buttons with stagger
════════════════════════════════════════════════════════════════ */
const filterWrap = q('.portfolio-filter');
if (filterWrap) {
  gsap.fromTo('.filter-btn',
    { autoAlpha: 0, y: 20 },
    {
      autoAlpha: 1, y: 0, stagger: 0.08, duration: 0.55, ease: 'power3.out',
      scrollTrigger: { trigger: filterWrap, start: 'top 88%' }
    }
  );
}

})(); // end IIFE

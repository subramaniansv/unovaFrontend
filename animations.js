/* ════════════════════════════════════════════════════════════════
   UNOVA — Optimised Animations v2
   Powered by GSAP 3 + ScrollTrigger
   Fixes: performance/lag, service card expand-reveal, smooth nav,
          click-ripple before redirect, rAF-throttled mousemove
   ════════════════════════════════════════════════════════════════ */
'use strict';

(() => {

/* ── GSAP performance config ────────────────────────────────────── */
gsap.config({ force3D: true, autoSleep: 60, nullTargetWarn: false });
gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ fastScrollEnd: true, ignoreMobileResize: true });

/* ── Helpers ─────────────────────────────────────────────────────── */
const q  = s => document.querySelector(s);
const qa = s => [...document.querySelectorAll(s)];
const FINE = window.matchMedia('(pointer: fine)').matches;

/* ── rAF throttle — prevents firing GSAP on every pixel ────────── */
function rafThrottle(fn) {
  let ticking = false;
  return function (...args) {
    if (!ticking) {
      requestAnimationFrame(() => { fn.apply(this, args); ticking = false; });
      ticking = true;
    }
  };
}

/* ════════════════════════════════════════════════════════════════
   INJECT — Cursor + Progress Bar + Canvas + Nav-flash overlay
════════════════════════════════════════════════════════════════ */
document.body.insertAdjacentHTML('beforeend',
  `<div class="cx-dot"  id="cxDot"></div>
   <div class="cx-ring" id="cxRing"></div>
   <div class="scroll-prog" id="scrollProg"></div>
   <div class="nav-flash"   id="navFlash"></div>`
);

const heroEl = q('.hero');
if (heroEl) {
  /* Canvas for particles */
  const cvs = document.createElement('canvas');
  cvs.id = 'heroCanvas';
  cvs.setAttribute('aria-hidden', 'true');
  heroEl.prepend(cvs);

  /* Pulse rings — constant ambient glow emanating from hero centre */
  heroEl.insertAdjacentHTML('afterbegin',
    `<div class="hero-ring ring-1" aria-hidden="true" style="width:500px;height:500px"></div>
     <div class="hero-ring ring-2" aria-hidden="true" style="width:900px;height:900px"></div>
     <div class="hero-ring ring-3" aria-hidden="true" style="width:1300px;height:1300px"></div>`
  );
}

/* ════════════════════════════════════════════════════════════════
   1. SCROLL PROGRESS BAR — rAF-throttled update
════════════════════════════════════════════════════════════════ */
const progBar = q('#scrollProg');
const updateProg = rafThrottle(() => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (max > 0) progBar.style.width = (window.scrollY / max * 100).toFixed(1) + '%';
});
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
  }, { passive: true });

  /* Ring — LERP smoothing */
  (function lerpRing() {
    rx += (mx - rx) * 0.115;
    ry += (my - ry) * 0.115;
    ring.style.left = rx.toFixed(1) + 'px';
    ring.style.top  = ry.toFixed(1) + 'px';
    requestAnimationFrame(lerpRing);
  })();

  /* Hover state — ring expands, dot shrinks */
  const hoverEls = qa('a, button, .service-card, .portfolio-card, .pricing-card, .testimonial-card, input, textarea, .filter-btn');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cx-hovering'),    { passive: true });
    el.addEventListener('mouseleave', () => document.body.classList.remove('cx-hovering'), { passive: true });
  });

  /* Click pulse on ring */
  document.addEventListener('mousedown', () => ring.classList.add('cx-click'));
  document.addEventListener('mouseup',   () => ring.classList.remove('cx-click'));

  /* Hide when cursor leaves window */
  document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
}

/* ════════════════════════════════════════════════════════════════
   3. HERO NETWORK CANVAS — travelling white lines + nodes + signals
      White edges (rgba 255,255,255) give the "lines travelling" look.
      IntersectionObserver pauses loop when hero is off-screen.
════════════════════════════════════════════════════════════════ */
const cvs = q('#heroCanvas');
if (cvs && heroEl) {
  const ctx = cvs.getContext('2d', { alpha: true });
  let animating = true;

  const resize = () => { cvs.width = heroEl.offsetWidth; cvs.height = heroEl.offsetHeight; };
  resize();
  new ResizeObserver(resize).observe(heroEl);
  new IntersectionObserver(([e]) => { animating = e.isIntersecting; }, { threshold: 0 }).observe(heroEl);

  const N          = 55;     // node count — sweet spot of density vs GPU
  const LINK_DIST  = 145;    // px: max distance for drawing an edge
  const LINK_DIST2 = LINK_DIST * LINK_DIST;
  const MOUSE_R    = 110;    // repulsion radius

  let mx = -9999, my = -9999;  // mouse relative to canvas

  /* Track mouse inside hero for repulsion effect */
  heroEl.addEventListener('mousemove', e => {
    const r = cvs.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  }, { passive: true });
  heroEl.addEventListener('mouseleave', () => { mx = -9999; my = -9999; });

  /* Build nodes */
  function makeNode() {
    return {
      x:  Math.random() * cvs.width,
      y:  Math.random() * cvs.height,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      r:  Math.random() * 1.5 + 0.7,
      accent: Math.random() < 0.22   // ~22% render as indigo accent dots
    };
  }
  const nodes = Array.from({ length: N }, makeNode);

  /* Signals — bright dots that travel along a randomly selected edge */
  const sigs = [];
  function spawnSig() {
    const a = nodes[Math.floor(Math.random() * N)];
    const b = nodes[Math.floor(Math.random() * N)];
    if (a === b) return;
    const d2 = (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
    if (d2 < LINK_DIST2) sigs.push({ a, b, t: 0 });
  }
  /* Initial burst then periodic */
  for (let i = 0; i < 10; i++) setTimeout(spawnSig, i * 110);
  const sigTimer = setInterval(() => { spawnSig(); spawnSig(); }, 650);

  /* Main draw loop */
  (function drawLoop() {
    if (!animating) { requestAnimationFrame(drawLoop); return; }
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    /* ── Move nodes ── */
    for (let i = 0; i < N; i++) {
      const n = nodes[i];

      /* Mouse repulsion */
      const dx = mx - n.x, dy = my - n.y;
      const d2m = dx * dx + dy * dy;
      if (d2m < MOUSE_R * MOUSE_R && d2m > 0) {
        const dm = Math.sqrt(d2m);
        const f  = (MOUSE_R - dm) / MOUSE_R * 0.018;
        n.vx -= (dx / dm) * f;
        n.vy -= (dy / dm) * f;
      }

      /* Speed cap */
      const spd = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (spd > 0.65) { n.vx = n.vx / spd * 0.65; n.vy = n.vy / spd * 0.65; }

      n.x += n.vx; n.y += n.vy;
      if (n.x < 0)          { n.x = 0;          n.vx *= -1; }
      if (n.x > cvs.width)  { n.x = cvs.width;  n.vx *= -1; }
      if (n.y < 0)          { n.y = 0;          n.vy *= -1; }
      if (n.y > cvs.height) { n.y = cvs.height; n.vy *= -1; }
    }

    /* ── Draw edges (white lines) ── */
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK_DIST2) {
          const d     = Math.sqrt(d2);
          const alpha = (1 - d / LINK_DIST) * 0.13;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }
    }

    /* ── Draw nodes ── */
    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.accent ? 'rgba(99,102,241,0.75)' : 'rgba(255,255,255,0.28)';
      ctx.fill();
    }

    /* ── Draw travelling signals ── */
    for (let i = sigs.length - 1; i >= 0; i--) {
      const s = sigs[i];
      s.t += 0.013;
      if (s.t >= 1) { sigs.splice(i, 1); continue; }
      const glow = Math.sin(Math.PI * s.t);
      const sx   = s.a.x + (s.b.x - s.a.x) * s.t;
      const sy   = s.a.y + (s.b.y - s.a.y) * s.t;
      /* Core bright dot */
      ctx.beginPath();
      ctx.arc(sx, sy, 2.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${(glow * 0.95).toFixed(2)})`;
      ctx.fill();
      /* Soft halo */
      ctx.beginPath();
      ctx.arc(sx, sy, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(139,92,246,${(glow * 0.2).toFixed(2)})`;
      ctx.fill();
    }

    requestAnimationFrame(drawLoop);
  })();
}

/* ════════════════════════════════════════════════════════════════
   4. HERO ENTRANCE — GSAP STAGGERED TIMELINE
      Uses gsap.set for initial state to avoid flash-of-visible-content
════════════════════════════════════════════════════════════════ */
gsap.set('.hero-badge, .hero-subtext, .hero-actions .btn, .hero-stats .stat, .hero-stats .stat-divider, .hero-scroll-indicator', { autoAlpha: 0 });
gsap.set('.h1-line span', { y: '108%' });

gsap.timeline({ delay: 0.12 })
  .to('.hero-badge',
    { autoAlpha: 1, y: 0, duration: 0.65, ease: 'power3.out' })
  .to('.h1-line span',
    { y: '0%', stagger: 0.14, duration: 0.85, ease: 'power4.out' },
    '-=0.3')
  .to('.hero-subtext',
    { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' },
    '-=0.45')
  .to('.hero-actions .btn',
    { autoAlpha: 1, y: 0, stagger: 0.1, duration: 0.55, ease: 'power3.out' },
    '-=0.4')
  .to('.hero-stats .stat, .hero-stats .stat-divider',
    { autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out' },
    '-=0.38')
  .to('.hero-scroll-indicator',
    { autoAlpha: 1, duration: 0.7 },
    '-=0.2');

/* ════════════════════════════════════════════════════════════════
   5. HERO MOUSE PARALLAX — rAF-throttled, reduced distances
      Pauses CSS orb idle animation during mouse interaction
════════════════════════════════════════════════════════════════ */
if (heroEl && FINE) {
  const orbs = qa('.hero-orb');

  const onHeroMove = rafThrottle(e => {
    const cx = e.clientX / window.innerWidth  - 0.5;
    const cy = e.clientY / window.innerHeight - 0.5;
    gsap.to('.orb-1',        { x: cx * 38,  y: cy * 38,  duration: 1.8, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.orb-2',        { x: -cx * 26, y: -cy * 26, duration: 2.2, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.orb-3',        { x: cx * 15,  y: cy * 15,  duration: 1.4, ease: 'power2.out', overwrite: 'auto' });
    gsap.to('.hero-bg-grid', { x: cx * 8,   y: cy * 8,   duration: 2.6, ease: 'power2.out', overwrite: 'auto' });
  });

  heroEl.addEventListener('mouseenter', () => {
    /* Pause CSS idle animation while GSAP handles position */
    orbs.forEach(o => { o.style.animationPlayState = 'paused'; });
  }, { passive: true });

  heroEl.addEventListener('mousemove', onHeroMove, { passive: true });

  heroEl.addEventListener('mouseleave', () => {
    gsap.to('.orb-1, .orb-2, .orb-3, .hero-bg-grid', {
      x: 0, y: 0, duration: 1.5, ease: 'power2.inOut', overwrite: 'auto',
      onComplete: () => {
        /* Resume CSS idle animation after spring-back */
        orbs.forEach(o => { o.style.animationPlayState = 'running'; });
      }
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
   All triggers use once:true to free memory after they fire
════════════════════════════════════════════════════════════════ */

/* Section headers — child stagger up */
qa('.section-header').forEach(hdr => {
  gsap.fromTo([...hdr.children],
    { y: 30, autoAlpha: 0 },
    {
      y: 0, autoAlpha: 1, stagger: 0.13, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: hdr, start: 'top 84%', once: true }
    }
  );
});

/* Section tag — horizontal clip reveal */
qa('.section-tag').forEach(tag => {
  gsap.fromTo(tag,
    { clipPath: 'inset(0 100% 0 0)', autoAlpha: 0 },
    {
      clipPath: 'inset(0 0% 0 0)', autoAlpha: 1, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: tag, start: 'top 88%', once: true }
    }
  );
});

/* Process steps — alternating left/right */
qa('.process-step').forEach((step, i) => {
  gsap.fromTo(step,
    { x: i % 2 === 0 ? -55 : 55, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, duration: 0.78, ease: 'power3.out',
      scrollTrigger: { trigger: step, start: 'top 84%', once: true }
    }
  );
});

/* Process connectors — draw in */
qa('.process-connector').forEach(c => {
  gsap.fromTo(c,
    { scaleX: 0, transformOrigin: 'left center' },
    {
      scaleX: 1, duration: 0.5, ease: 'power2.inOut',
      scrollTrigger: { trigger: c, start: 'top 88%', once: true }
    }
  );
});

/* Why section — text from left, pillars from right */
if (q('.why-grid')) {
  gsap.fromTo('.why-text > *',
    { x: -48, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, stagger: 0.1, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: '.why-grid', start: 'top 80%', once: true }
    }
  );
  gsap.fromTo('.pillar',
    { x: 46, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, stagger: 0.09, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.why-pillars', start: 'top 80%', once: true }
    }
  );
}

/* Contact — form from left, info from right */
if (q('.contact-layout')) {
  gsap.fromTo('.contact-form-wrap',
    { x: -46, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, duration: 0.82, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-layout', start: 'top 80%', once: true }
    }
  );
  gsap.fromTo('.contact-info-wrap',
    { x: 46, autoAlpha: 0 },
    {
      x: 0, autoAlpha: 1, duration: 0.82, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-layout', start: 'top 80%', once: true }
    }
  );
}

/* Footer brand — fade up */
if (q('.footer-brand')) {
  gsap.fromTo('.footer-brand, .footer-links-group',
    { y: 24, autoAlpha: 0 },
    {
      y: 0, autoAlpha: 1, stagger: 0.1, duration: 0.65, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer-inner', start: 'top 90%', once: true }
    }
  );
}

/* ════════════════════════════════════════════════════════════════
   8. SCRUB PARALLAX — scrub:1 smooths fast-scroll jank
════════════════════════════════════════════════════════════════ */
if (heroEl) {
  gsap.to('.hero-content', {
    y: 70, ease: 'none',
    scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1 }
  });
  gsap.to('.hero-bg-grid', {
    y: 40, ease: 'none',
    scrollTrigger: { trigger: heroEl, start: 'top top', end: 'bottom top', scrub: 1 }
  });
}

/* ════════════════════════════════════════════════════════════════
   9. SERVICE CARDS — Expand + Reveal CTA on hover
   Replaces 3D tilt for service cards; tilt on portfolio/pricing only
════════════════════════════════════════════════════════════════ */
qa('.service-card').forEach(card => {
  /* Inject a hidden CTA reveal area */
  const reveal = document.createElement('div');
  reveal.className = 'sc-reveal';
  reveal.innerHTML = `<a href="#contact" class="sc-cta">Start This Service <span class="sc-arrow">→</span></a>`;
  card.appendChild(reveal);
  gsap.set(reveal, { autoAlpha: 0, y: 10 });

  const icon = card.querySelector('.service-icon-wrap');

  card.addEventListener('mouseenter', () => {
    gsap.to(card,   { y: -8, scale: 1.028, duration: 0.32, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(reveal, { autoAlpha: 1, y: 0,  duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    if (icon) gsap.to(icon, { scale: 1.15, rotation: 6, duration: 0.3, ease: 'back.out(2)', overwrite: 'auto' });
  }, { passive: true });

  card.addEventListener('mouseleave', () => {
    gsap.to(card,   { y: 0, scale: 1, duration: 0.5, ease: 'power3.out', overwrite: 'auto' });
    gsap.to(reveal, { autoAlpha: 0, y: 8, duration: 0.22, ease: 'power2.in', overwrite: 'auto' });
    if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
  }, { passive: true });
});

/* ════════════════════════════════════════════════════════════════
   10. 3D CARD TILT — Portfolio, Pricing, Testimonial cards only
       No shine overlay — keeps cards clean and vivid
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const tiltTargets = qa('.pricing-card, .testimonial-card, .portfolio-card');

  tiltTargets.forEach(card => {
    // no shine div injected — removed per UX review

    const onMove = rafThrottle(e => {
      const r    = card.getBoundingClientRect();
      const xPct = (e.clientX - r.left) / r.width;
      const yPct = (e.clientY - r.top)  / r.height;
      const rotX = (xPct - 0.5) * 14;
      const rotY = (yPct - 0.5) * 14;
      gsap.to(card, {
        rotateY: rotX, rotateX: -rotY,
        transformPerspective: 900, translateZ: 7,
        duration: 0.38, ease: 'power2.out', overwrite: 'auto'
      });
    });

    card.addEventListener('mousemove',  onMove, { passive: true });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateY: 0, rotateX: 0, translateZ: 0,
        duration: 0.6, ease: 'back.out(1.4)', overwrite: 'auto'
      });
    });
  });
}

/* ════════════════════════════════════════════════════════════════
   11. PORTFOLIO CARDS — Per-card enter/leave (no mousemove on grid)
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const pcards = qa('.portfolio-card');
  pcards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.03, duration: 0.26, ease: 'power2.out', overwrite: 'auto' });
      pcards.forEach(c => {
        if (c !== card)
          gsap.to(c, { scale: 0.97, filter: 'brightness(0.78)', duration: 0.26, ease: 'power2.out', overwrite: 'auto' });
      });
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      pcards.forEach(c =>
        gsap.to(c, { scale: 1, filter: 'brightness(1)', duration: 0.36, ease: 'power2.out', overwrite: 'auto' })
      );
    }, { passive: true });
  });
}

/* ════════════════════════════════════════════════════════════════
   12. MAGNETIC BUTTONS — rAF-throttled; back.out replaces elastic
════════════════════════════════════════════════════════════════ */
if (FINE) {
  qa('.btn.btn-primary, .btn.btn-ghost').forEach(btn => {
    const onMove = rafThrottle(e => {
      const r = btn.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width  / 2) * 0.34;
      const y = (e.clientY - r.top  - r.height / 2) * 0.34;
      gsap.to(btn, { x, y, duration: 0.28, ease: 'power2.out', overwrite: 'auto' });
    });
    btn.addEventListener('mousemove',  onMove, { passive: true });
    btn.addEventListener('mouseleave', () => gsap.to(btn, { x: 0, y: 0, duration: 0.55, ease: 'back.out(2)', overwrite: 'auto' }));
    btn.addEventListener('mousedown',  () => gsap.to(btn, { scale: 0.94, duration: 0.1, overwrite: 'auto' }));
    btn.addEventListener('mouseup',    () => gsap.to(btn, { scale: 1,    duration: 0.32, ease: 'back.out(2)', overwrite: 'auto' }));
  });
}

/* ════════════════════════════════════════════════════════════════
   13. SMOOTH ANCHOR NAVIGATION
   Intercepts same-page #hash links: adds brief button pulse,
   section flash, then programmatic smooth scroll with navbar offset
════════════════════════════════════════════════════════════════ */
const navFlash = q('#navFlash');

qa('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const targetEl = q(targetId);
    if (!targetEl) return;

    e.preventDefault();

    /* Brief pulse on the clicked element */
    gsap.fromTo(link, { scale: 0.95 }, { scale: 1, duration: 0.28, ease: 'back.out(3)', overwrite: 'auto' });

    /* Subtle full-page flash */
    if (navFlash) {
      gsap.fromTo(navFlash,
        { autoAlpha: 0 },
        {
          autoAlpha: 0.05, duration: 0.15,
          onComplete: () => gsap.to(navFlash, { autoAlpha: 0, duration: 0.35 })
        }
      );
    }

    /* Scroll with navbar offset so section isn't hidden under fixed header */
    const navH = (q('.navbar') || { offsetHeight: 72 }).offsetHeight;
    const top  = targetEl.getBoundingClientRect().top + window.scrollY - navH - 10;
    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
  });
});

/* ════════════════════════════════════════════════════════════════
   14. EXTERNAL / DEMO LINK CLICKS — ripple then navigate
   Portfolio "View Demo" same-window links get a brief glow pulse
════════════════════════════════════════════════════════════════ */
qa('.portfolio-link, .btn.btn-sm').forEach(link => {
  link.addEventListener('click', e => {
    /* Allow new-tab links to proceed instantly */
    if (link.getAttribute('target') === '_blank') return;
    const href = link.href;
    if (!href || href.includes('#')) return;
    e.preventDefault();
    gsap.fromTo(link,
      { scale: 1 },
      {
        scale: 0.93, duration: 0.14, ease: 'power2.in', yoyo: true, repeat: 1,
        onComplete: () => { window.location.href = href; }
      }
    );
  });
});

/* ════════════════════════════════════════════════════════════════
   15. MARQUEE — Pause on hover
════════════════════════════════════════════════════════════════ */
const mqBar   = q('.marquee-bar');
const mqTrack = q('.marquee-track');
if (mqBar && mqTrack) {
  mqBar.addEventListener('mouseenter', () => mqTrack.style.animationPlayState = 'paused',  { passive: true });
  mqBar.addEventListener('mouseleave', () => mqTrack.style.animationPlayState = 'running', { passive: true });
}

/* ════════════════════════════════════════════════════════════════
   16. BACK-TO-TOP
════════════════════════════════════════════════════════════════ */
if (FINE) {
  const btt = q('#backToTop');
  if (btt) {
    btt.addEventListener('mouseenter', () => gsap.to(btt, { y: -4, scale: 1.1, duration: 0.26, ease: 'power2.out' }));
    btt.addEventListener('mouseleave', () => gsap.to(btt, { y:  0, scale: 1.0, duration: 0.42, ease: 'back.out(2)' }));
  }
}

/* ════════════════════════════════════════════════════════════════
   17. PRICING CARD — Featured pulse glow
════════════════════════════════════════════════════════════════ */
const featCard = q('.pricing-card.featured');
if (featCard) {
  gsap.to(featCard, {
    boxShadow: '0 0 55px rgba(99,102,241,.42), 0 8px 40px rgba(0,0,0,.6)',
    duration: 1.8, yoyo: true, repeat: -1, ease: 'sine.inOut'
  });
}

/* ════════════════════════════════════════════════════════════════
   18. STAT COUNTERS — fires once per trigger
════════════════════════════════════════════════════════════════ */
function runCounter(el) {
  const raw    = el.textContent.trim();
  const num    = parseInt(raw.replace(/\D/g, ''), 10);
  const suffix = raw.replace(/[0-9]/g, '');
  if (isNaN(num)) return;
  gsap.fromTo({ v: 0 }, { v: num }, {
    duration: 2.0, ease: 'power2.out',
    onUpdate()  { el.textContent = Math.round(this.targets()[0].v) + suffix; },
    onComplete() { el.textContent = raw; }
  });
}

const heroStats = q('.hero-stats');
if (heroStats) {
  ScrollTrigger.create({
    trigger: heroStats, start: 'top 85%', once: true,
    onEnter: () => qa('.hero-stats .stat-num').forEach(runCounter)
  });
}
const whyMetrics = q('.why-metrics');
if (whyMetrics) {
  ScrollTrigger.create({
    trigger: whyMetrics, start: 'top 85%', once: true,
    onEnter: () => qa('.metric-value').forEach(runCounter)
  });
}

/* ════════════════════════════════════════════════════════════════
   19. NAVBAR LINKS — Hover float (back.out instead of elastic.out)
════════════════════════════════════════════════════════════════ */
if (FINE) {
  qa('.nav-links a').forEach(link => {
    link.addEventListener('mouseenter', () => gsap.to(link, { y: -2, duration: 0.2, ease: 'power2.out', overwrite: 'auto' }));
    link.addEventListener('mouseleave', () => gsap.to(link, { y:  0, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' }));
  });
}

/* ════════════════════════════════════════════════════════════════
   20. FILTER BUTTONS — Stagger reveal on scroll
════════════════════════════════════════════════════════════════ */
const filterWrap = q('.portfolio-filter');
if (filterWrap) {
  gsap.fromTo('.filter-btn',
    { autoAlpha: 0, y: 18 },
    {
      autoAlpha: 1, y: 0, stagger: 0.07, duration: 0.5, ease: 'power3.out',
      scrollTrigger: { trigger: filterWrap, start: 'top 88%', once: true }
    }
  );
}

})(); // end IIFE

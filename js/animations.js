/* ============================================
   SCROLL ANIMATIONS & INTERSECTION OBSERVER
   ============================================ */

(function () {
  /* ---------- Intersection Observer for Reveal ---------- */
  const revealElements = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .stagger-children'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.delay) || 0;
          setTimeout(() => {
            el.classList.add('visible');
          }, delay * 1000);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* ---------- Section Observer for Nav Dots ---------- */
  const sections = document.querySelectorAll('.section');
  const navDots = document.querySelectorAll('.nav-dot');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          navDots.forEach((dot) => {
            dot.classList.toggle('active', dot.dataset.section === sectionId);
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  /* Nav dot clicks */
  navDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.section);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- Hero Section Auto-trigger ---------- */
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    heroSection.classList.add('in-view');
  }

  /* ---------- Cursor Glow ---------- */
  const cursorGlow = document.getElementById('cursor-glow');
  if (cursorGlow) {
    let mouseX = 0, mouseY = 0;
    let glowX = 0, glowY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      glowX += (mouseX - glowX) * 0.08;
      glowY += (mouseY - glowY) * 0.08;
      cursorGlow.style.left = glowX + 'px';
      cursorGlow.style.top = glowY + 'px';
      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    /* Hide on touch devices */
    if ('ontouchstart' in window) {
      cursorGlow.style.display = 'none';
    }
  }

  /* ---------- Parallax on Gradient Orbs ---------- */
  const orbs = document.querySelectorAll('.hero-gradient-orb');
  if (orbs.length && !('ontouchstart' in window)) {
    document.addEventListener('mousemove', (e) => {
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${cx * speed}px, ${cy * speed}px)`;
      });
    });
  }

  /* ---------- Smooth Anchor Scrolling ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- Sparkle Trail on Click ---------- */
  document.addEventListener('click', (e) => {
    for (let i = 0; i < 6; i++) {
      createSparkle(e.clientX, e.clientY);
    }
  });

  function createSparkle(x, y) {
    const sparkle = document.createElement('div');
    sparkle.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: 6px;
      height: 6px;
      background: var(--color-primary);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      box-shadow: 0 0 8px rgba(212, 165, 116, 0.6);
    `;
    document.body.appendChild(sparkle);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 60 + 20;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    sparkle.animate(
      [
        { transform: 'scale(1) translate(0, 0)', opacity: 1 },
        { transform: `scale(0) translate(${dx}px, ${dy}px)`, opacity: 0 },
      ],
      { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
    ).onfinish = () => sparkle.remove();
  }

  /* ---------- Tilt Effect on Cards ---------- */
  const tiltCards = document.querySelectorAll('.card-glass, .venue-glass, .countdown-glass');
  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${cx * 8}deg) rotateX(${-cy * 8}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateY(0)';
      card.style.transition = 'transform 0.5s var(--ease-out-expo)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none';
    });
  });
})();

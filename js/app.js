/* ============================================
   MAIN APP — Preloader & Music
   ============================================ */

(function () {
  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      if (preloader) preloader.classList.add('hidden');
    }, 2800);
  });

  /* Fallback: hide preloader after 4s even if load fires early */
  setTimeout(() => {
    if (preloader && !preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
    }
  }, 4000);

  /* ---------- Music Toggle ---------- */
  const musicToggle = document.getElementById('music-toggle');
  if (musicToggle) {
    let isPlaying = true;
    musicToggle.addEventListener('click', () => {
      isPlaying = !isPlaying;
      musicToggle.classList.toggle('paused', !isPlaying);
    });
  }

  /* ---------- Scroll-based background tint ---------- */
  const body = document.body;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / docHeight, 1);

    /* Subtle hue shift as user scrolls */
    const hue = Math.round(progress * 15);
    body.style.filter = `hue-rotate(${hue}deg)`;
  }, { passive: true });

  /* ---------- Confetti Burst on CTA Click ---------- */
  const ctaBtn = document.querySelector('.cta-button');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', (e) => {
      burstConfetti(e.clientX, e.clientY);
    });
  }

  function burstConfetti(x, y) {
    const colors = ['#d4a574', '#c2185b', '#e8b4b8', '#b8860b', '#f5e6e8', '#8b1a4a'];
    for (let i = 0; i < 25; i++) {
      const confetti = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = Math.random() * 8 + 4;
      const isCircle = Math.random() > 0.5;

      confetti.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: ${size}px;
        height: ${isCircle ? size : size * 1.5}px;
        background: ${color};
        border-radius: ${isCircle ? '50%' : '2px'};
        pointer-events: none;
        z-index: 9999;
      `;
      document.body.appendChild(confetti);

      const angle = (Math.PI * 2 * i) / 25 + Math.random() * 0.5;
      const velocity = Math.random() * 120 + 60;
      const dx = Math.cos(angle) * velocity;
      const dy = Math.sin(angle) * velocity - 80;
      const rotation = Math.random() * 720 - 360;

      confetti.animate(
        [
          {
            transform: 'translate(0, 0) rotate(0deg) scale(1)',
            opacity: 1,
          },
          {
            transform: `translate(${dx}px, ${dy + 200}px) rotate(${rotation}deg) scale(0)`,
            opacity: 0,
          },
        ],
        {
          duration: 1000 + Math.random() * 500,
          easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }
      ).onfinish = () => confetti.remove();
    }
  }

  /* ---------- Keyboard Navigation ---------- */
  let currentSectionIndex = 0;
  const sectionIds = ['hero', 'save-the-date', 'couple', 'venue', 'footer'];

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === ' ') {
      e.preventDefault();
      currentSectionIndex = Math.min(currentSectionIndex + 1, sectionIds.length - 1);
      document.getElementById(sectionIds[currentSectionIndex])?.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
      document.getElementById(sectionIds[currentSectionIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  /* Update current section index on scroll */
  const allSections = sectionIds.map((id) => document.getElementById(id));
  const indexObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = sectionIds.indexOf(entry.target.id);
          if (idx !== -1) currentSectionIndex = idx;
        }
      });
    },
    { threshold: 0.5 }
  );
  allSections.forEach((s) => { if (s) indexObserver.observe(s); });
})();

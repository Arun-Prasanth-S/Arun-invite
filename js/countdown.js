/* ============================================
   COUNTDOWN TIMER
   ============================================ */

(function () {
  /* Wedding date: Monday, 24th August 2026, 11:00 AM IST (UTC+5:30) */
  const WEDDING_DATE = new Date('2026-08-24T11:00:00+05:30').getTime();

  const daysEl = document.getElementById('countdown-days');
  const hoursEl = document.getElementById('countdown-hours');
  const minutesEl = document.getElementById('countdown-minutes');
  const secondsEl = document.getElementById('countdown-seconds');

  if (!daysEl) return;

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function animateNumber(el, newValue) {
    const current = el.textContent;
    const padded = pad(newValue);
    if (current === padded) return;

    el.style.transition = 'none';
    el.style.transform = 'translateY(0)';
    el.style.opacity = '1';

    requestAnimationFrame(() => {
      el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s';
      el.style.transform = 'translateY(-10px)';
      el.style.opacity = '0';

      setTimeout(() => {
        el.textContent = padded;
        el.style.transition = 'none';
        el.style.transform = 'translateY(10px)';
        el.style.opacity = '0';

        requestAnimationFrame(() => {
          el.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s';
          el.style.transform = 'translateY(0)';
          el.style.opacity = '1';
        });
      }, 200);
    });
  }

  function updateCountdown() {
    const now = Date.now();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    animateNumber(daysEl, days);
    animateNumber(hoursEl, hours);
    animateNumber(minutesEl, minutes);
    animateNumber(secondsEl, seconds);
  }

  /* Initial update */
  updateCountdown();

  /* Update every second */
  setInterval(updateCountdown, 1000);
})();

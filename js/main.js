/* ==============================================
   CINEMATIC V3 — MOTION GRAPHICS ENGINE
   ============================================== */
(function () {
  'use strict';

  /* ===== INTRO ===== */
  var intro = document.getElementById('intro');
  var mainEl = document.getElementById('main');

  setTimeout(function () {
    if (intro) intro.classList.add('done');
    if (mainEl) { mainEl.classList.remove('hidden'); mainEl.classList.add('visible'); }
  }, 3200);

  /* ===== INTERSECTION OBSERVER — scroll reveals ===== */
  var anims = document.querySelectorAll('.anim');

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      var delay = parseFloat(el.dataset.d) || 0;

      setTimeout(function () {
        el.classList.add('show');

        // Character stagger
        var chars = el.querySelectorAll('.char');
        if (chars.length) {
          chars.forEach(function (ch, i) {
            ch.style.animationDelay = (delay + i * 0.04) + 's';
          });
        }
      }, delay * 1000);

      observer.unobserve(el);
    });
  }, { threshold: 0.12 });

  anims.forEach(function (el) { observer.observe(el); });

  /* ===== COUNTDOWN ===== */
  var WED = new Date('2026-08-24T11:00:00+05:30').getTime();
  var dE = document.getElementById('cd-d');
  var hE = document.getElementById('cd-h');
  var mE = document.getElementById('cd-m');
  var sE = document.getElementById('cd-s');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function setNum(el, v) {
    if (!el) return;
    var str = pad(v);
    if (el.textContent === str) return;
    el.style.transition = 'none';
    el.style.transform = 'translateY(-6px) scale(.95)';
    el.style.opacity = '0';
    el.style.filter = 'blur(2px)';
    setTimeout(function () {
      el.textContent = str;
      el.style.transition = 'all .35s cubic-bezier(.16,1,.3,1)';
      el.style.transform = 'translateY(0) scale(1)';
      el.style.opacity = '1';
      el.style.filter = 'blur(0)';
    }, 140);
  }

  function tick() {
    var diff = Math.max(0, WED - Date.now());
    setNum(dE, Math.floor(diff / 864e5));
    setNum(hE, Math.floor(diff / 36e5) % 24);
    setNum(mE, Math.floor(diff / 6e4) % 60);
    setNum(sE, Math.floor(diff / 1e3) % 60);
  }
  tick();
  setInterval(tick, 1000);

  /* ===== PARTICLE CANVAS — luminous orbs + petals ===== */
  var cvs = document.getElementById('cvs');
  if (!cvs) return;
  var ctx = cvs.getContext('2d');
  var W, H;

  function resize() {
    W = cvs.width = window.innerWidth;
    H = cvs.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var particles = [];
  var TOTAL = 40;

  var palette = [
    { r: 212, g: 168, b: 92 },   // gold
    { r: 194, g: 24,  b: 91 },   // rose
    { r: 230, g: 82,  b: 138 },  // pink
    { r: 240, g: 212, b: 138 },  // light gold
    { r: 250, g: 243, b: 232 },  // cream
  ];

  function Particle() { this.reset(); }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.type = Math.random() > 0.65 ? 'orb' : 'petal';
    var c = palette[Math.floor(Math.random() * palette.length)];
    this.r = c.r; this.g = c.g; this.b = c.b;

    if (this.type === 'orb') {
      this.sz = Math.random() * 3 + 1;
      this.o = Math.random() * 0.15 + 0.03;
      this.vy = (Math.random() - 0.5) * 0.15;
      this.vx = (Math.random() - 0.5) * 0.15;
      this.pulse = Math.random() * Math.PI * 2;
      this.ps = Math.random() * 0.02 + 0.008;
      this.blur = Math.random() * 8 + 4;
    } else {
      this.sz = Math.random() * 5 + 2;
      this.o = Math.random() * 0.08 + 0.02;
      this.vy = Math.random() * 0.3 + 0.1;
      this.vx = Math.random() * 0.2 - 0.1;
      this.rot = Math.random() * Math.PI * 2;
      this.rs = (Math.random() - 0.5) * 0.012;
      this.wob = Math.random() * Math.PI * 2;
      this.ws = Math.random() * 0.012 + 0.004;
    }
  };

  Particle.prototype.update = function () {
    if (this.type === 'orb') {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += this.ps;
      if (this.x < -20 || this.x > W + 20 || this.y < -20 || this.y > H + 20) this.reset();
    } else {
      this.y += this.vy;
      this.wob += this.ws;
      this.x += this.vx + Math.sin(this.wob) * 0.06;
      this.rot += this.rs;
      if (this.y > H + 20) { this.reset(); this.y = -20; }
    }
  };

  Particle.prototype.draw = function () {
    if (this.type === 'orb') {
      var glow = 1 + Math.sin(this.pulse) * 0.5;
      ctx.save();
      ctx.globalAlpha = this.o * glow;
      ctx.shadowBlur = this.blur;
      ctx.shadowColor = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.sz * glow, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',1)';
      ctx.fill();
      ctx.restore();
    } else {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.o;
      ctx.beginPath();
      ctx.moveTo(0, -this.sz);
      ctx.bezierCurveTo(this.sz * .7, -this.sz * .4, this.sz * .7, this.sz * .4, 0, this.sz);
      ctx.bezierCurveTo(-this.sz * .7, this.sz * .4, -this.sz * .7, -this.sz * .4, 0, -this.sz);
      ctx.fillStyle = 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',1)';
      ctx.fill();
      ctx.restore();
    }
  };

  for (var i = 0; i < TOTAL; i++) particles.push(new Particle());

  (function loop() {
    ctx.clearRect(0, 0, W, H);
    for (var j = 0; j < particles.length; j++) {
      particles[j].update();
      particles[j].draw();
    }
    requestAnimationFrame(loop);
  })();

  /* ===== TOUCH / CLICK SPARKLE BURST ===== */
  document.addEventListener('click', function (e) {
    for (var k = 0; k < 8; k++) sparkle(e.clientX, e.clientY);
  });

  function sparkle(x, y) {
    var el = document.createElement('div');
    var sz = Math.random() * 4 + 2;
    var isGold = Math.random() > 0.4;
    var color = isGold ? 'rgba(212,168,92,1)' : 'rgba(194,24,91,1)';
    var glow = isGold ? 'rgba(212,168,92,.5)' : 'rgba(194,24,91,.5)';
    el.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + sz + 'px;height:' + sz +
      'px;background:' + color + ';border-radius:50%;pointer-events:none;z-index:9999;' +
      'box-shadow:0 0 8px ' + glow + ',0 0 15px ' + glow + ';';
    document.body.appendChild(el);

    var angle = Math.random() * Math.PI * 2;
    var dist = Math.random() * 60 + 20;
    var dx = Math.cos(angle) * dist;
    var dy = Math.sin(angle) * dist;

    el.animate([
      { transform: 'scale(1) translate(0,0)', opacity: 1 },
      { transform: 'scale(0) translate(' + dx + 'px,' + dy + 'px)', opacity: 0 }
    ], { duration: 600 + Math.random() * 400, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = function () { el.remove(); };
  }
})();

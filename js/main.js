/* ==============================================
   CINEMATIC WEDDING — ALL-IN-ONE JS
   ============================================== */

(function () {
  'use strict';

  /* ---- Preloader ---- */
  var pre = document.getElementById('preloader');
  setTimeout(function () { if (pre) pre.classList.add('done'); }, 2400);

  /* ---- Scroll-triggered Animations (IntersectionObserver) ---- */
  var anims = document.querySelectorAll('.anim');
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var d = parseFloat(e.target.dataset.d) || 0;
        setTimeout(function () { e.target.classList.add('show'); }, d * 1000);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  anims.forEach(function (el) { observer.observe(el); });

  /* ---- Countdown Timer ---- */
  var WED = new Date('2026-08-24T11:00:00+05:30').getTime();
  var dE = document.getElementById('cd-d');
  var hE = document.getElementById('cd-h');
  var mE = document.getElementById('cd-m');
  var sE = document.getElementById('cd-s');

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var diff = WED - Date.now();
    if (diff < 0) diff = 0;
    var d = Math.floor(diff / 864e5);
    var h = Math.floor(diff / 36e5) % 24;
    var m = Math.floor(diff / 6e4) % 60;
    var s = Math.floor(diff / 1e3) % 60;

    setNum(dE, d); setNum(hE, h); setNum(mE, m); setNum(sE, s);
  }

  function setNum(el, v) {
    if (!el) return;
    var p = pad(v);
    if (el.textContent !== p) {
      el.style.transition = 'none';
      el.style.transform = 'translateY(-8px)';
      el.style.opacity = '0';
      setTimeout(function () {
        el.textContent = p;
        el.style.transition = 'transform .25s cubic-bezier(.16,1,.3,1), opacity .2s';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
      }, 120);
    }
  }

  tick();
  setInterval(tick, 1000);

  /* ---- Floating Petals (Canvas) ---- */
  var cvs = document.getElementById('petals');
  if (cvs) {
    var ctx = cvs.getContext('2d');
    var W, H;
    var petals = [];
    var PETAL_COUNT = 25;
    var colors = [
      [201,169,110],
      [184,74,107],
      [214,106,138],
      [232,201,142],
      [245,237,224],
    ];

    function resize() { W = cvs.width = window.innerWidth; H = cvs.height = window.innerHeight; }
    window.addEventListener('resize', resize);
    resize();

    function Petal() { this.init(); }
    Petal.prototype.init = function () {
      this.x = Math.random() * W;
      this.y = Math.random() * H - H;
      this.sz = Math.random() * 5 + 2;
      this.vy = Math.random() * 0.4 + 0.15;
      this.vx = Math.random() * 0.3 - 0.15;
      this.rot = Math.random() * Math.PI * 2;
      this.rs = (Math.random() - 0.5) * 0.015;
      this.o = Math.random() * 0.12 + 0.03;
      this.wob = Math.random() * Math.PI * 2;
      this.ws = Math.random() * 0.015 + 0.005;
      this.c = colors[Math.floor(Math.random() * colors.length)];
    };
    Petal.prototype.update = function () {
      this.y += this.vy;
      this.wob += this.ws;
      this.x += this.vx + Math.sin(this.wob) * 0.08;
      this.rot += this.rs;
      if (this.y > H + 15) { this.init(); this.y = -15; }
      if (this.x < -15) this.x = W + 15;
      if (this.x > W + 15) this.x = -15;
    };
    Petal.prototype.draw = function () {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      ctx.globalAlpha = this.o;
      ctx.beginPath();
      ctx.moveTo(0, -this.sz);
      ctx.bezierCurveTo(this.sz * 0.7, -this.sz * 0.4, this.sz * 0.7, this.sz * 0.4, 0, this.sz);
      ctx.bezierCurveTo(-this.sz * 0.7, this.sz * 0.4, -this.sz * 0.7, -this.sz * 0.4, 0, -this.sz);
      ctx.fillStyle = 'rgba(' + this.c[0] + ',' + this.c[1] + ',' + this.c[2] + ',1)';
      ctx.fill();
      ctx.restore();
    };

    for (var i = 0; i < PETAL_COUNT; i++) petals.push(new Petal());

    (function loop() {
      ctx.clearRect(0, 0, W, H);
      for (var j = 0; j < petals.length; j++) { petals[j].update(); petals[j].draw(); }
      requestAnimationFrame(loop);
    })();
  }

  /* ---- Click sparkle ---- */
  document.addEventListener('click', function (e) {
    for (var k = 0; k < 5; k++) burst(e.clientX, e.clientY);
  });

  function burst(x, y) {
    var sp = document.createElement('div');
    var sz = Math.random() * 5 + 3;
    sp.style.cssText = 'position:fixed;left:' + x + 'px;top:' + y + 'px;width:' + sz + 'px;height:' + sz +
      'px;background:var(--gold);border-radius:50%;pointer-events:none;z-index:9999;box-shadow:0 0 6px rgba(201,169,110,.5);';
    document.body.appendChild(sp);
    var a = Math.random() * Math.PI * 2;
    var dist = Math.random() * 50 + 15;
    var dx = Math.cos(a) * dist;
    var dy = Math.sin(a) * dist;
    sp.animate([
      { transform: 'scale(1) translate(0,0)', opacity: 1 },
      { transform: 'scale(0) translate(' + dx + 'px,' + dy + 'px)', opacity: 0 }
    ], { duration: 500 + Math.random() * 300, easing: 'cubic-bezier(.16,1,.3,1)' }).onfinish = function () { sp.remove(); };
  }
})();

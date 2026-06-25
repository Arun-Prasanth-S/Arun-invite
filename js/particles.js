/* ============================================
   FLOATING PARTICLES — Rose Petals & Sparkles
   ============================================ */

(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 35;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Petal {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height - height;
      this.size = Math.random() * 6 + 3;
      this.speedY = Math.random() * 0.5 + 0.2;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.02;
      this.opacity = Math.random() * 0.15 + 0.05;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.01;
      this.wobbleAmount = Math.random() * 1.5 + 0.5;

      /* Pick a petal color */
      const colors = [
        [212, 165, 116],  /* gold */
        [194, 24, 91],    /* pink */
        [232, 180, 184],  /* rose */
        [139, 26, 74],    /* burgundy */
        [245, 230, 232],  /* blush */
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmount * 0.1;
      this.rotation += this.rotationSpeed;

      if (this.y > height + 20) {
        this.reset();
        this.y = -20;
      }
      if (this.x < -20) this.x = width + 20;
      if (this.x > width + 20) this.x = -20;
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.globalAlpha = this.opacity;

      /* Draw a petal shape */
      ctx.beginPath();
      ctx.moveTo(0, -this.size);
      ctx.bezierCurveTo(
        this.size * 0.8, -this.size * 0.5,
        this.size * 0.8, this.size * 0.5,
        0, this.size
      );
      ctx.bezierCurveTo(
        -this.size * 0.8, this.size * 0.5,
        -this.size * 0.8, -this.size * 0.5,
        0, -this.size
      );
      ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, 1)`;
      ctx.fill();
      ctx.restore();
    }
  }

  class Sparkle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.size = Math.random() * 2 + 0.5;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      this.opacity = 0;
    }

    update() {
      this.life++;
      const progress = this.life / this.maxLife;
      this.opacity = progress < 0.5
        ? progress * 2 * 0.3
        : (1 - progress) * 2 * 0.3;

      if (this.life >= this.maxLife) {
        this.reset();
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = '#d4a574';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#d4a574';

      /* 4-pointed star */
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const outerX = this.x + Math.cos(angle) * this.size * 2;
        const outerY = this.y + Math.sin(angle) * this.size * 2;
        const innerAngle = angle + Math.PI / 4;
        const innerX = this.x + Math.cos(innerAngle) * this.size * 0.5;
        const innerY = this.y + Math.sin(innerAngle) * this.size * 0.5;

        if (i === 0) ctx.moveTo(outerX, outerY);
        else ctx.lineTo(outerX, outerY);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  /* Initialize particles */
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Petal());
  }
  for (let i = 0; i < 15; i++) {
    particles.push(new Sparkle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.update();
      p.draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
})();

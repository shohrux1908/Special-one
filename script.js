const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let fireworks = [];

function randomColor() {
  const colors = ['#ff4d6d', '#ffe066', '#74c0fc', '#b197fc', '#f783ac', '#f06595', '#d0bfff'];
  return colors[Math.floor(Math.random() * colors.length)];
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = canvas.height;
    this.tx = x;
    this.ty = y;
    this.dy = (this.ty - this.y) / 25;
    this.phase = "launch";
    this.particles = [];
    this.color = randomColor();
  }

  update() {
    if (this.phase === "launch") {
      this.y += this.dy;
      if (this.y <= this.ty) {
        this.phase = "explode";
        for (let i = 0; i < 80; i++) {
          const angle = Math.random() * 2 * Math.PI;
          const speed = Math.random() * 6 + 1;
          this.particles.push({
            x: this.x,
            y: this.y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: 60 + Math.random() * 20,
            alpha: 1.0
          });
        }
      }
    } else {
      this.particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;
        p.dy += 0.05; // gravity
        p.alpha -= 0.015;
        p.life--;
        if (p.life <= 0 || p.alpha <= 0) this.particles.splice(i, 1);
      });
    }
  }

  draw(ctx) {
    if (this.phase === "launch") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 20;
      ctx.shadowColor = this.color;
      ctx.fill();
    } else {
      this.particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(${hexToRGB(this.color)},${p.alpha})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = this.color;
        ctx.fill();
      });
    }
  }
}

function hexToRGB(hex) {
  hex = hex.replace('#', '');
  let bigint = parseInt(hex, 16);
  return [
    (bigint >> 16) & 255,
    (bigint >> 8) & 255,
    bigint & 255
  ].join(',');
}

function animate() {
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  fireworks.forEach((fw, i) => {
    fw.update();
    fw.draw(ctx);
    if (fw.phase === "explode" && fw.particles.length === 0) fireworks.splice(i, 1);
  });
  requestAnimationFrame(animate);
}

setInterval(() => {
  const x = Math.random() * canvas.width * 0.9 + canvas.width * 0.05;
  const y = Math.random() * canvas.height * 0.5 + canvas.height * 0.1;
  fireworks.push(new Firework(x, y));
}, 1400);

animate();

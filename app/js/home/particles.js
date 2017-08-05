// Averages multiple random values to simulate gaussian distribution. Higher values of n result in
// a tighter focus.
function gaussRand(samples = 6) {
  let rand = 0;
  for (let i = 0; i < samples; i += 1) rand += Math.random();
  return rand / samples;
}

function randrange(low, high, floor = true, gauss = false, gaussSamples = 6) {
  const randFunc = gauss ? gaussRand : Math.random;
  const out = (randFunc(gaussSamples) * (high - low)) + low;
  return floor ? Math.floor(out) : out;
}


class Particle {
  constructor(anim) {
    this.anim = anim;
    // Position and movement

    this.progress = Math.random() * (Math.PI * 2);
    this.speed = randrange(5, 25, false);
    this.frequency = 1;
    // Amplitude is anywhere from 10% of screen width to 25%
    this.amplitude = randrange(-0.10, 0.25, false, true, 6);
    this.verticalShift = randrange(-0.25, 0.25, false, true, 6);
    // Appearance

    this.radius = randrange(1, 7);
    this.opacity = randrange(0.25, 0.75, false);
  }

  // x and y are decimals where (0, something) is the top left of the canvas and (2pi, something).
  // I say "something" because it's complicated and I'm not sure
  get x() { return this.progress; }
  get y() { return (this.amplitude * Math.sin(this.frequency * this.x)) + this.verticalShift; }

  step() {
    this.progress += (this.speed / this.anim.canvas.width);
    this.progress %= (Math.PI * 2);
  }
}


// Animation class


class SineParticles {
  constructor(canvas, count = 2500) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.fps = 30;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    setTimeout(() => this.resize(), 500);

    // Create particles
    for (let i = 0; i < count; i += 1) this.particles.push(new Particle(this));

    this.start();
  }

  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    if (window.devicePixelRatio === 2) {
      this.canvas.width = this.canvas.offsetWidth * 2;
      this.canvas.height = this.canvas.offsetHeight * 2;
    }
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => {
      const x = (p.x / (2 * Math.PI)) * this.canvas.width;
      const y = (p.y * this.canvas.width) + (this.canvas.height / 2);
      // Draw circle
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.radius, 0, 2 * Math.PI, false);
      this.ctx.fill();
    });
  }

  step() { this.particles.forEach(p => p.step()); }

  renderLoop() {
    this.draw();
    setTimeout(() => this.renderLoop(), 1000 / 60);
  }

  stepLoop() {
    this.step();
    setTimeout(() => this.stepLoop(), 1000 / 60);
  }

  start() {
    this.stepLoop();
    this.renderLoop();
  }
}


// Only if we're in a browser
if (typeof window !== 'undefined') {
  window.SineParticles = SineParticles;
  document.addEventListener('DOMContentLoaded', () => {
    window.particles = new SineParticles(document.getElementById('particles'), 500);
  });
} else {
  module.exports.SineParticles = SineParticles;
}

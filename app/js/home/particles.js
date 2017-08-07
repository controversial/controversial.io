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

    this.progress = randrange(this.anim.minProgress, this.anim.maxProgress, false);
    this.speed = randrange(1, 4, false);
    this.frequency = 5;
    this.amplitude = randrange(-0.5, 0.5, false, true, 4);
    this.shift = randrange(-Math.PI, Math.PI, false, true, 7);
    // Appearance

    this.dotRadius = randrange(1, 8);
    this.baseOpacity = randrange(0.25, 0.75, false);
  }

  get opacity() {
    // If there is a cutoff, particles fade as they approach it (the final 0.1 progress)
    const fadePeriod = 0.1;
    if (this.progress > this.anim.maxProgress - fadePeriod) {
      const distanceToMax = (this.anim.maxProgress - this.progress);
      return this.baseOpacity * (1 / fadePeriod) * distanceToMax;
    } else if (this.progress < this.anim.minProgress + fadePeriod) {
      const distanceToMin = (this.progress - this.anim.minProgress);
      return this.baseOpacity * (1 / fadePeriod) * distanceToMin;
    }
    return this.baseOpacity;
  }
  // Polar coordinates are used in calculation of x and y

  get theta() { return this.progress * Math.PI; }
  // Tight sine path along a circle
  get radius() {
    return 1 + (this.amplitude * Math.sin(this.frequency * (this.theta + this.shift)));
  }

  // x and y are decimals where (-1, -1) is the top left of the canvas and (1, 1) is the bottom
  // right. These are simply generated by converting polar coordinates to cartesian coordinates.

  get x() { return this.radius * Math.cos(this.theta); }
  get y() { return this.radius * Math.sin(this.theta); }

  step() {
    this.progress += (this.speed / this.anim.canvas.width);
    this.progress %= 1;
  }
}


// Animation class


class SineParticles {
  constructor(canvas, count = 1000) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.fps = 30;
    this.trailLength = 10;
    this.minProgress = 0;
    this.maxProgress = 1;

    this.resize();
    window.addEventListener('resize', () => this.resize());

    // Create particles
    for (let i = 0; i < count; i += 1) this.particles.push(new Particle(this));

    this.start();
  }

  resize() {
    const factor = window.devicePixelRatio || 1;
    this.canvas.width = this.canvas.offsetWidth * factor;
    this.canvas.height = this.canvas.offsetHeight * factor;
    this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
    this.draw();
  }

  draw() {
    if (this.trailLength <= 1) {
      this.ctx.clearRect(
        -this.canvas.width / 2, -this.canvas.height / 2,
        this.canvas.width, this.canvas.height
      );
    } else {
      this.ctx.globalCompositeOperation = 'copy';
      this.ctx.globalAlpha = 1 - (1 / this.trailLength);
      this.ctx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);
      this.ctx.globalAlpha = 1;
      this.ctx.globalCompositeOperation = 'source-over';
    }
    this.particles.forEach((p) => {
      const factor = window.devicePixelRatio || 1;
      const x = p.x * (window.innerWidth / 2) * factor;
      const y = p.y * (window.innerHeight / 2) * factor;
      // Draw circle
      this.ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      this.ctx.beginPath();
      this.ctx.arc(x, y, p.dotRadius, 0, 2 * Math.PI, false);
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

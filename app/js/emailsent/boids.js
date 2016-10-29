/* Boids flocking simulation (TODO) */

class Boid {
  constructor(x, y) {
    this.x = x || window.flock.canvas.getAttribute('width') / 2;
    this.y = y || window.flock.canvas.getAttribute('height') / 2;
  }
}


document.addEventListener('DOMContentLoaded', () => {
  window.flock = {


    // BASIC ATTRIBUTES =======================================================

    boids: [new Boid(0, 0)],
    canvas: document.getElementById('boids'),
    ctx: document.getElementById('boids').getContext('2d'),

    fps: 15,


    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser


    // Called to update the canvas coordinate system if the canvas size changes
    sizeChanged() {
      const width = window.flock.canvas.offsetWidth;
      const height = window.flock.canvas.offsetHeight;
      window.flock.canvas.setAttribute('width', width);
      window.flock.canvas.setAttribute('height', height);
    },


    // Render the simulation on the canvas
    redraw() {

    },


    // SIMULATION LOGIC =======================================================


    // Advance the simulation by one step
    step() {

    },


    // USER INTERACTION =======================================================

    interacted(e) {
      // Position of the mouse in the viewport
      const absx = e.clientX;
      const absy = e.clientY;
      return [absx, absy];
    },


    // CONTROL FUNCTIONS ======================================================

    randomize() {

    },

    // Begin the loop

    start() {
      window.flock.step();
      window.flock.redraw();
      setTimeout(() => {
        requestAnimationFrame(window.flock.start);
      }, 1000 / window.flock.fps);
    },


    // Initialize and begin

    init() {
      this.sizeChanged(); // Calculate sizes
      this.randomize();
      this.start();
    },
  };


  window.addEventListener('resize', window.flock.sizeChanged);
  document.addEventListener('mousemove', window.flock.interacted);
  window.flock.init();
});

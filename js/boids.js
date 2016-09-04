/* Boids flocking simulation */

function Boid (x, y, direction, velocity) {
  this.x = 0;
}


document.addEventListener("DOMContentLoaded", function () {
  window.boids = {


    // BASIC ATTRIBUTES =======================================================

    flock: [],
    canvas: document.getElementById("boids"),
    ctx: document.getElementById("boids").getContext("2d"),

    fps: 15,


    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser


    // Called to update the canvas coordinate system if the canvas size changes
    sizeChanged: function() {
      var width = boids.canvas.offsetWidth,
          height = boids.canvas.offsetHeight;
      boids.canvas.setAttribute("width", width);
      boids.canvas.setAttribute("height", height);
    },


    // Render the simulation on the canvas
    redraw: function() {

    },


    // SIMULATION LOGIC =======================================================


    // Advance the simulation by one step
    step: function() {

    },


    // USER INTERACTION =======================================================

    interacted: function(e) {
      // Position of the mouse in the viewport
      var absx = e.clientX, absy=e.clientY;
    },


    // CONTROL FUNCTIONS ======================================================

    randomize: function () {

    },

    // Begin the loop

    start: function() {
      boids.step();
      boids.redraw();
      setTimeout(function() {
        requestAnimationFrame(boids.start);
      }, 1000 / boids.fps);
    },


    // Initialize and begin

    init: function() {
      this.sizeChanged(); // Calculate sizes
      this.randomize();
      this.start();
    }
  };




  window.addEventListener("resize", boids.sizeChanged);
  document.addEventListener("mousemove", boids.interacted);
  boids.init();

});

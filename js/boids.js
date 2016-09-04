/* Boids flocking simulation */

function Boid () {

}


document.addEventListener("DOMContentLoaded", function () {
  window.flock = {


    // BASIC ATTRIBUTES =======================================================

    boids: [],
    canvas: document.getElementById("boids"),
    ctx: document.getElementById("boids").getContext("2d"),

    fps: 15,


    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser


    // Called to update the canvas coordinate system if the canvas size changes
    sizeChanged: function() {
      var width = flock.canvas.offsetWidth,
          height = flock.canvas.offsetHeight;
      flock.canvas.setAttribute("width", width);
      flock.canvas.setAttribute("height", height);
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
      flock.step();
      flock.redraw();
      setTimeout(function() {
        requestAnimationFrame(flock.start);
      }, 1000 / flock.fps);
    },


    // Initialize and begin

    init: function() {
      this.sizeChanged(); // Calculate sizes
      this.randomize();
      this.start();
    }
  };




  window.addEventListener("resize", flock.sizeChanged);
  document.addEventListener("mousemove", flock.interacted);
  flock.init();

});

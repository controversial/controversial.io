/* Boids flocking simulation */

function Boid () {

}


document.addEventListener("DOMContentLoaded", function () {
  window.boidsSim = {


    // BASIC ATTRIBUTES =======================================================

    boids: [],
    canvas: document.getElementById("boids"),
    ctx: document.getElementById("boids").getContext("2d"),

    fps: 15,


    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser


    // Called to update the canvas coordinate system if the canvas size changes
    sizeChanged: function() {
      var width = boidsSim.canvas.offsetWidth,
          height = boidsSim.canvas.offsetHeight;
      boidsSim.canvas.setAttribute("width", width);
      boidsSim.canvas.setAttribute("height", height);
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
      boidsSim.step();
      boidsSim.redraw();
      setTimeout(function() {
        requestAnimationFrame(boidsSim.start);
      }, 1000 / boidsSim.fps);
    },


    // Initialize and begin

    init: function() {
      this.sizeChanged(); // Calculate sizes
      this.randomize();
      this.start();
    }
  };




  window.addEventListener("resize", boidsSim.sizeChanged);
  document.addEventListener("mousemove", boidsSim.interacted);
  boidsSim.init();

});

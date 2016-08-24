/* Conway's Game of Life */

document.addEventListener("DOMContentLoaded", function () {
  window.gol = {
    canvas: document.getElementById("gol"),
    ctx: document.getElementById("gol").getContext("2d"),

    fps: 10,

    idealCellSize: 20,
    cellSize: [20, 20], // This gets updated dynamically.

    // Called to update the canvas when the window resizes.
    sizeChanged: function() {

    },

    step: function() {

    },

    start: function() {
      gol.step();
      setTimeout(gol.start, 1000/gol.fps);
    }
  };

  gol.sizeChanged();
  window.addEventListener("resize", gol.sizeChanged);
  gol.start();
});

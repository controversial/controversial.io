/* Conway's Game of Life */

document.addEventListener("DOMContentLoaded", function () {
  window.gol = {
    canvas: document.getElementById("gol"),
    ctx: document.getElementById("gol").getContext("2d"),

    fps: 10,

    idealCellSize: 20,
    cellSize: [20, 20], // This gets updated dynamically.

    cells: [
      [true, false],
      [false, true]
    ],

    // Called to update the canvas when the window resizes.
    sizeChanged: function() {
      var width = gol.canvas.offsetWidth,
          height = gol.canvas.offsetHeight;
      // Update canvas coordinate system
      gol.canvas.setAttribute("width", width);
      gol.canvas.setAttribute("height", height);

      // Update tile size by finding a width that will evenly fill the canvas
      // and is closest to the idealCellSize, then doing the same thing for
      // height.
      gol.cellSize = [
        width / Math.round(width / gol.idealCellSize),
        height / Math.round(height / gol.idealCellSize)
      ];
    },

    step: function() {
      var width = this.canvas.getAttribute("width"),
          height = this.canvas.getAttribute("height");
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.fillStyle = "#41555e"; // $background-blue-lighter in Sass
      for (var x=0; x<this.cells.length; x++) {
        for (var y=0; y<this.cells[x].length; y++) {
          if (this.cells[x][y]) {
            this.ctx.fillRect(
              this.cellSize[0] * x,
              this.cellSize[1] * y,
              this.cellSize[0],
              this.cellSize[1]
            );
          }
        }
      }
    },

    start: function() {
      gol.step();
      setTimeout(gol.start, 1000 / gol.fps);
    }
  };

  gol.sizeChanged();
  window.addEventListener("resize", gol.sizeChanged);
  gol.start();
});

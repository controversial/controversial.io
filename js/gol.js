/* Conway's Game of Life */

document.addEventListener("DOMContentLoaded", function () {
  window.gol = {


    // BASIC ATTRIBUTES =======================================================


    canvas: document.getElementById("gol"),
    ctx: document.getElementById("gol").getContext("2d"),

    fps: 10,

    idealCellSize: 20,
    cellSize: [20, 20], // This gets updated dynamically.

    boardSize: [10, 10],

    cells: undefined,


    // HELPER FUNCTIONS =======================================================


    _getBlankBoard: function() {
      var array = [];
      for (var i=0; i<this.boardSize[0]; i++) {
        array.push(
          new Array(this.boardSize[1]).fill(false)
        );
      }
      return array;
    },


    // MAIN FUNCTIONS =========================================================


    // Called to update the game if the canvas size
    // changes.

    sizeChanged: function() {
      var width = gol.canvas.offsetWidth,
          height = gol.canvas.offsetHeight;
      // Update canvas coordinate system
      gol.canvas.setAttribute("width", width);
      gol.canvas.setAttribute("height", height);

      // Update tile size by finding a width that will
      // evenly fill the canvas and is closest to the
      // idealCellSize, then doing the same thing for
      // height.
      gol.cellSize = [
        width / Math.round(width / gol.idealCellSize),
        height / Math.round(height / gol.idealCellSize)
      ];

      // TODO: Change board size on resize. Kill cells
      // that are cut off on resize, leave new cells blank.
    },


    // Randomize the game state

    randomize: function() {
      var width = this.boardSize[0],
          height = this.boardSize[1];

      var cells = [];

      for (var x=0; x<width; x++) {
        cells.push([]);
        for (var y=0; y<height; y++) {
          cells[x].push(Math.random() < 0.125);
        }
      }
      this.cells = cells;
    },


    // Render changes to the cells

    redraw: function() {
      var width = this.canvas.getAttribute("width"),
          height = this.canvas.getAttribute("height");
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.fillStyle = "#41555e"; // $background-blue-lighter

      // Render cells
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


    step: function() {
      // TODO: Advance the simulation
    },

    // Begin the loop

    start: function() {
      gol.step();
      gol.redraw();
      setTimeout(gol.start, 1000 / gol.fps);
    },


    // Initialize and begin

    init: function() {
      // Calculate sizes
      this.sizeChanged();
      // Initialize board
      this.cells = this._getBlankBoard();
      console.log(this.cells);
      this.randomize();
      this.start();
    }
  };

  window.addEventListener("resize", gol.sizeChanged);
  gol.init();

});

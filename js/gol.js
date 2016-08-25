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

    board: undefined,


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

      // When board size changes, kill cells that are
      // cut off and randomize new terrain.

      var oldBoardSize = gol.boardSize;  // Store old size
      gol.boardSize = [  // Adjust size
        Math.round(width / gol.cellSize[0]),
        Math.round(height / gol.cellSize[1])
      ];
      var diff = [  // Calculate size difference
        gol.boardSize[0] - oldBoardSize[0],
        gol.boardSize[1] - oldBoardSize[1]
      ];

      // Kill dead cells

      if (diff[0] < 0) {
        gol.board = gol.board.slice(0, gol.boardSize[0]);
      }
      if (diff[1] < 0) {
        for (var i=0; i<gol.board.length; i++) {
          gol.board[i] = gol.board[i].slice(0, gol.boardSize[1]);
        }
      }

      // Populate new cells

      if (diff[0] > 0) {
        console.log("x grew by " + diff[0]);
      }
      if (diff[1] > 0) {
        console.log("y grew by " + diff[1]);
      }

      gol.redraw();
    },


    // Randomize the game state

    randomize: function() {
      var width = this.boardSize[0],
          height = this.boardSize[1];

      for (var x=0; x<width; x++) {
        for (var y=0; y<height; y++) {
          this.board[x][y] = Math.random() < 0.125;
        }
      }
    },


    // Render the board on the canvas

    redraw: function() {
      var width = this.canvas.getAttribute("width"),
          height = this.canvas.getAttribute("height");
      this.ctx.clearRect(0, 0, width, height);
      this.ctx.fillStyle = "#37474f"; // $background-blue

      // Render board
      for (var x=0; x<this.board.length; x++) {
        for (var y=0; y<this.board[x].length; y++) {
          if (this.board[x][y]) {
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
      setTimeout(function() {
        requestAnimationFrame(gol.start);
      }, 1000 / gol.fps);
    },


    // Initialize and begin

    init: function() {
      // Temporary board
      this.board = this._getBlankBoard();
      // Calculate sizes
      this.sizeChanged();
      // Initialize board
      this.board = this._getBlankBoard();
      this.randomize();
      this.start();
    }
  };

  window.addEventListener("resize", gol.sizeChanged);
  gol.init();

});

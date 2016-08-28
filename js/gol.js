/* Conway's Game of Life */

document.addEventListener("DOMContentLoaded", function () {
  window.gol = {


    // BASIC ATTRIBUTES =======================================================

    cellColor: "#37474f",
    canvas: document.getElementById("gol"),
    ctx: document.getElementById("gol").getContext("2d"),

    fps: 15,

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


    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser


    // Called to update the game if the canvas size
    // changes.

    sizeChanged: function() {
      var i, k,  // Spare loop variables
          // Use window sizes so that the canvas shrinks (doesn't crop) on scroll.
          width = window.innerWidth,
          height = window.innerHeight;

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
        for (i=0; i<gol.board.length; i++) {
          gol.board[i] = gol.board[i].slice(0, gol.boardSize[1]);
        }
      }

      // Populate new cells

      for (i=0; i<diff[0]; i++) {
        newRow = new Array(gol.boardSize[0]).fill(false);
        for (k=0; k<newRow.length; k++) {
          newRow[k] = Math.random() < 0.125;
        }
        gol.board.push(newRow);
      }
      for (i=0; i<diff[1]; i++) {
        for (k=0; k<gol.board.length; k++) {
          gol.board[k].push(Math.random() < 0.125);
        }
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
      this.ctx.fillStyle = this.cellColor;
      // Render board
      for (var x=0; x<this.boardSize[0]; x++) {
        for (var y=0; y<this.boardSize[1]; y++) {
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


    // GAME LOGIC =============================================================


    countLiveNeighbors: function(x, y) {
      total = 0;

      // Is there room in directions of:
      //   - negative x
      //   - negative y
      //   - positive x
      //   - positive y
      xroomneg = x > 0;
      yroomneg = y > 0;
      xroompos = x < this.boardSize[0] - 1;
      yroompos = y < this.boardSize[1] - 1;

      neighbors = [
        // above
        yroomneg && this.board[x][y-1],
        // above right
        xroompos && yroomneg && this.board[x+1][y-1],
        // right
        xroompos && this.board[x+1][y],
        // below right
        xroompos && yroompos && this.board[x+1][y+1],
        // below
        yroompos && this.board[x][y+1],
        // below left
        xroomneg && yroompos && this.board[x-1][y+1],
        // left
        xroomneg && this.board[x-1][y],
        // above and left
        xroomneg && yroompos && this.board[x-1][y-1]
      ];
      for (var i=0; i<neighbors.length; i++) {
        total += neighbors[i];
      }
      return total;
    },

    judgeFate: function(isLive, liveNeighbors) {
      if (isLive) {
        // Any live cell with fewer than 2 live neighbors
        // dies of underpopulation; any live cell with more
        // than three dies of overpopulation.
        return (liveNeighbors === 2 || liveNeighbors === 3);
      } else {
        // Any dead cell with exactly 3 neighbors is born
        return liveNeighbors === 3;
      }
    },

    step: function() {
      newState = this._getBlankBoard();

      for (var x=0; x<this.boardSize[0]; x++) {
        for (var y=0; y<this.boardSize[1]; y++) {
          newState[x][y] = this.judgeFate(
            this.board[x][y],
            this.countLiveNeighbors(x, y)
          );
        }
      }

      this.board = newState;
    },


    // USER INTERACTION =======================================================


    // On a desktop computer, cells are born
    // when moused over. On a mobile device
    // it's wherever a touch occurs or is dragged.
    interacted: function(e) {
      var absx = e.clientX, absy=e.clientY;
      // Position of the cell in the board
      var cellpos = [
        Math.floor(absx / gol.cellSize[0]),
        Math.floor(absy / gol.cellSize[1])
      ];
      gol.board[cellpos[0]][cellpos[1]] = true;
    },


    // CONTROL FUNCTIONS ======================================================


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
  document.addEventListener("mousemove", gol.interacted);
  gol.init();

});

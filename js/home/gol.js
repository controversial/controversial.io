/* Conway's Game of Life */

document.addEventListener('DOMContentLoaded', () => {
  window.gol = {

    // BASIC ATTRIBUTES =======================================================

    cellColor: '#37474f',
    canvas: document.getElementById('gol'),
    ctx: document.getElementById('gol').getContext('2d'),

    fps: 15,

    idealCellSize: 20,
    cellSize: [20, 20], // This gets updated dynamically.

    boardSize: [10, 10],

    board: undefined,

    // HELPER FUNCTIONS =======================================================

    _getBlankBoard() {
      return new Array(this.boardSize[0]).fill(0).map(
        () => new Array(this.boardSize[1]).fill(false)
      );
    },

    _getRandomRow() {
      return new Array(window.gol.boardSize[0]).fill(0).map(() => Math.random() < 0.125);
    },

    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser

    // Called to update the game if the canvas size
    // changes.
    sizeChanged() {
      // Spare loop variables
      let i;

      const width = window.gol.canvas.offsetWidth;
      const height = window.gol.canvas.offsetHeight;

      // Update canvas coordinate system
      window.gol.canvas.setAttribute('width', width);
      window.gol.canvas.setAttribute('height', height);

      // Update tile size by finding a width that will
      // evenly fill the canvas and is closest to the
      // idealCellSize, then doing the same thing for
      // height.

      window.gol.cellSize = [
        width / Math.round(width / window.gol.idealCellSize),
        height / Math.round(height / window.gol.idealCellSize),
      ];

      // When board size changes, kill cells that are
      // cut off and randomize new terrain.

      const oldBoardSize = window.gol.boardSize;  // Store old size
      window.gol.boardSize = [  // Adjust size
        Math.round(width / window.gol.cellSize[0]),
        Math.round(height / window.gol.cellSize[1]),
      ];
      const diff = [  // Calculate size difference
        window.gol.boardSize[0] - oldBoardSize[0],
        window.gol.boardSize[1] - oldBoardSize[1],
      ];

      // Kill dead cells

      if (diff[0] < 0) {
        window.gol.board = window.gol.board.slice(0, window.gol.boardSize[0]);
      }
      if (diff[1] < 0) {
        window.gol.board = window.gol.board.map(row => row.slice(0, window.gol.boardSize[1]));
      }

      // Populate new cells

      // Add new rows filled with random cells
      for (i = 0; i < diff[0]; i += 1) {
        window.gol.board.push(window.gol._getRandomRow());
      }
      // Add new random cells to existing rows (new columns)
      for (i = 0; i < diff[1]; i += 1) {
        for (let k = 0; k < window.gol.board.length; k += 1) {
          window.gol.board[k].push(Math.random() < 0.125);
        }
      }

      window.gol.redraw();
    },

    // Randomize the game state

    randomize() {
      this.board = this._getBlankBoard().map(() => this._getRandomRow());
    },

    // Render the board on the canvas

    redraw() {
      const width = this.canvas.getAttribute('width');
      const height = this.canvas.getAttribute('height');

      this.ctx.clearRect(0, 0, width, height);
      this.ctx.fillStyle = this.cellColor;
      // Render board
      for (let x = 0; x < this.boardSize[0]; x += 1) {
        for (let y = 0; y < this.boardSize[1]; y += 1) {
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

    countLiveNeighbors(x, y) {
      // Is there room in directions of:
      //   - negative x
      //   - negative y
      //   - positive x
      //   - positive y
      const xroomneg = x > 0;
      const yroomneg = y > 0;
      const xroompos = x < this.boardSize[0] - 1;
      const yroompos = y < this.boardSize[1] - 1;

      const neighbors = [
        // above
        yroomneg && this.board[x][y - 1],
        // above right
        xroompos && yroomneg && this.board[x + 1][y - 1],
        // right
        xroompos && this.board[x + 1][y],
        // below right
        xroompos && yroompos && this.board[x + 1][y + 1],
        // below
        yroompos && this.board[x][y + 1],
        // below left
        xroomneg && yroompos && this.board[x - 1][y + 1],
        // left
        xroomneg && this.board[x - 1][y],
        // above and left
        xroomneg && yroompos && this.board[x - 1][y - 1]
      ];

      // Number of true values in neighbors array
      return neighbors.filter(n => n).length;
    },

    judgeFate(isLive, liveNeighbors) {
      if (isLive) {
        // Any live cell with fewer than 2 live neighbors
        // dies of underpopulation; any live cell with more
        // than three dies of overpopulation.
        return (liveNeighbors === 2 || liveNeighbors === 3);
      }

      // Any dead cell with exactly 3 neighbors is born
      return liveNeighbors === 3;
    },

    step() {
      const newState = this._getBlankBoard();

      for (let x = 0; x < this.boardSize[0]; x++) {
        for (let y = 0; y < this.boardSize[1]; y++) {
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
    interacted(e) {
      // Position of the canvas in the viewport
      const bbox = window.gol.canvas.getBoundingClientRect();
      // Position of the mouse in the viewport
      const absx = e.clientX;
      const absy = e.clientY;

      // If these two positions intersect:
      if (absx > bbox.left &&
          absy > bbox.top &&
          absx < bbox.right &&
          absy < bbox.bottom
      ) {
        // Calculate mouse position relative to canvas
        const relx = absx - bbox.left;
        const rely = absy - bbox.top;
        // Calculate cell position
        const cellx = Math.floor(relx / window.gol.cellSize[0]);
        const celly = Math.floor(rely / window.gol.cellSize[1]);

        window.gol.board[cellx][celly] = true;
      }
    },

    // CONTROL FUNCTIONS ======================================================

    // Begin the loop

    start() {
      window.gol.step();
      window.gol.redraw();
      setTimeout(() => {
        requestAnimationFrame(window.gol.start);
      }, 1000 / window.gol.fps);
    },

    // Initialize and begin

    init() {
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

  window.addEventListener('resize', window.gol.sizeChanged);
  document.addEventListener('mousemove', window.gol.interacted);
  window.gol.init();
});

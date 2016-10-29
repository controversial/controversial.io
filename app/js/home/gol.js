/* Conway's Game of Life */

// [].fill polyfill (by me).
// Does not include start / end parameters because I'm not using that here.
if (!Array.prototype.fill) {
  /* eslint-disable no-extend-native */
  Array.prototype.fill = function fill2(value) {
    /* eslint-enable no-extend-native */
    for (let i = 0; i < this.length; i += 1) {
      this[i] = value;
    }
    return this;
  };
}


// CONTROLS GAME LOGIC =============================================================================


class Game {
  constructor(width, height) {
    this.board = [[]];
    this.changeSize(width, height);
  }

  // HELPER FUNCTIONS

  getBlankBoard() {
    return new Array(this.boardSize[0]).fill(0).map(
      () => new Array(this.boardSize[1]).fill(false)
    );
  }

  getRandomRow() {
    return new Array(this.boardSize[0]).fill(0).map(() => Math.random() < 0.125);
  }

  get boardSize() {
    return [this.board.length, this.board[0].length];
  }

  // GAME MANIPULATION

  clear() {
    this.board = this.getBlankBoard();
    return this;
  }

  randomize() {
    this.board = this.getBlankBoard().map(() => this.getRandomRow());
    return this;
  }

  turnOn(x, y) {
    this.board[x][y] = true;
    return this;
  }

  turnOff(x, y) {
    this.board[x][y] = false;
    return this;
  }

  setState(x, y, state) {
    this.board[x][y] = state;
    return this;
  }

  // GAME LOGIC

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
      xroomneg && yroompos && this.board[x - 1][y - 1],
    ];

    // Number of true values in neighbors array
    return neighbors.filter(n => n).length;
  }

  static judgeFate(isLive, liveNeighbors) {
    if (isLive) {
      // Any live cell with fewer than 2 live neighbors
      // dies of underpopulation; any live cell with more
      // than three dies of overpopulation.
      return (liveNeighbors === 2 || liveNeighbors === 3);
    }
    // Any dead cell with exactly 3 neighbors is born
    return liveNeighbors === 3;
  }

  // GAME CONTROLS

  step() {
    const newState = this.getBlankBoard();

    for (let x = 0; x < this.boardSize[0]; x += 1) {
      for (let y = 0; y < this.boardSize[1]; y += 1) {
        newState[x][y] = Game.judgeFate(
          this.board[x][y],
          this.countLiveNeighbors(x, y)
        );
      }
    }

    this.board = newState;
    return this;
  }

  changeSize(width, height) {
    // Store old board size
    const oldBoardSize = this.boardSize;
    const newBoardSize = [width, height];
    // Calculate size difference
    const diff = [
      newBoardSize[0] - oldBoardSize[0],
      newBoardSize[1] - oldBoardSize[1],
    ];

    // Kill dead cells

    if (diff[0] < 0) { // if x shrinks
      this.board = this.board.slice(0, newBoardSize[0]);
    }
    if (diff[1] < 0) { // if y shrinks
      this.board = this.board.map(row => row.slice(0, newBoardSize[1]));
    }

    // Populate new cells

    // Add new rows filled with random cells
    for (let i = 0; i < diff[0]; i += 1) {
      this.board.push(this.getRandomRow());
    }
    // Add new random cells to existing rows (new columns)
    for (let i = 0; i < diff[1]; i += 1) {
      for (let k = 0; k < this.board.length; k += 1) {
        this.board[k].push(Math.random() < 0.125);
      }
    }

    return this;
  }

  // GAME DEBUG FUNCTIONS

  toString() {
    function boolToAscii(n) { return n ? '*' : ' '; }
    return this.board.map(row => row.map(boolToAscii).join('')).join('\n');
  }

  print() {
    /* eslint-disable no-console */
    console.log(this.toString());
    /* eslint-enable no-console */
  }
}


// BINDS `Game` OBJECT TO A CANVAS =================================================================


class GameRenderer {
  constructor(selector) {
    this.elem = document.querySelector(selector);
    if (!(this.elem instanceof window.HTMLCanvasElement)) {
      throw new Error('Selector passed to GameRenderer must match a canvas element');
    }
    this.context = this.elem.getContext('2d');
  }
}


document.addEventListener('DOMContentLoaded', () => {
  window.gol = {

    // BASIC ATTRIBUTES =======================================================

    cellColor: '#37474f',
    canvas: document.getElementById('gol'),
    ctx: document.getElementById('gol').getContext('2d'),

    fps: 15,

    idealCellSize: 20,
    cellSize: [20, 20], // This gets updated dynamically.

    game: new Game(),

    // RENDERING FUNCTIONS

    // These functions connect the simulation to the browser

    // Called to update the game if the canvas size
    // changes.
    sizeChanged() {
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

      window.gol.game.changeSize(
        Math.round(width / window.gol.cellSize[0]),
        Math.round(height / window.gol.cellSize[1]),
      );

      window.gol.redraw();
    },

    redraw() {
      const width = this.canvas.getAttribute('width');
      const height = this.canvas.getAttribute('height');

      this.ctx.clearRect(0, 0, width, height);
      this.ctx.fillStyle = this.cellColor;
      // Render board
      for (let x = 0; x < this.game.board.length; x += 1) {
        for (let y = 0; y < this.game.board[0].length; y += 1) {
          if (this.game.board[x][y]) {
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


    // USER INTERACTION

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

        window.gol.game.turnOn(cellx, celly);
      }
    },

    // CONTROL FUNCTIONS

    // Begin the loop

    start() {
      window.gol.game.step();
      window.gol.redraw();
      setTimeout(() => {
        requestAnimationFrame(window.gol.start);
      }, 1000 / window.gol.fps);
    },

    // Initialize and begin

    init() {
      this.sizeChanged();
      this.game.randomize();
      this.start();
    },
  };

  window.addEventListener('resize', window.gol.sizeChanged);
  document.addEventListener('mousemove', window.gol.interacted);
  window.gol.init();
});

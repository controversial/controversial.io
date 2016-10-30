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

  setState(x, y, value) {
    if (!(typeof value === 'boolean')) {
      throw new Error('Board values are always boolean');
    }
    if (typeof x === 'number' && typeof y === 'number') {
      // A single coordinate pair was passed
      this.board[x][y] = value;
    } else if (typeof x === 'object' && typeof x[0][0] === 'number') {
      // A list of coordinate pairs was passed
      x.forEach((coords) => {
        this.board[coords[0]][coords[1]] = value;
      });
    }
  }

  turnOn(x, y) {
    return this.setState(x, y, true);
  }

  turnOff(x, y) {
    return this.setState(x, y, false);
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
    function boolToAscii(n) { return n ? 'o' : '.'; }
    return this.board.map(row => row.map(boolToAscii).join('')).join('\n');
  }

  print() {
    /* eslint-disable no-console */
    console.log(`${this.toString()}\n`);
    /* eslint-enable no-console */
  }
}


// BINDS `Game` OBJECT TO A CANVAS =================================================================


class GameRenderer {
  constructor(selector, fps, cellSize, cellColor) {
    this.game = new Game();

    this.elem = document.querySelector(selector);
    if (!(this.elem instanceof window.HTMLCanvasElement)) {
      throw new Error('Selector passed to GameRenderer must match a canvas element');
    }
    this.context = this.elem.getContext('2d');

    // Store options
    this.fps = fps || 15;
    this.idealCellSize = cellSize || 20;
    this.cellSize = [this.idealCellSize, this.idealCellSize]; // Updated to fit game to canvas
    this.cellColor = cellColor || '#37474f';

    this.sizeChanged(this.elem.offsetWidth, this.elem.offsetHeight);
    this.game.randomize();

    document.addEventListener('mousemove', e => this.mouse(e.clientX, e.clientY));
  }


  // RENDERING FUNCTIONS
  //   These functions connect the simulation to the browser


  sizeChanged(width, height) {
    // Update canvas coordinate system
    this.elem.setAttribute('width', width);
    this.elem.setAttribute('height', height);

    // Update tile size by finding the dimensions that will both evenly fill
    // the canvas and be close closest to the idealCellSize.
    this.cellSize = [
      width / Math.round(width / this.idealCellSize),
      height / Math.round(height / this.idealCellSize),
    ];

    this.game.changeSize(
      Math.round(width / this.cellSize[0]),
      Math.round(height / this.cellSize[1])
    );

    this.draw();
  }

  draw() {
    requestAnimationFrame(() => {
      const width = this.elem.getAttribute('width');
      const height = this.elem.getAttribute('height');

      this.context.clearRect(0, 0, width, height);
      this.context.fillStyle = this.cellColor;
      // Render board
      for (let x = 0; x < this.game.boardSize[0]; x += 1) {
        for (let y = 0; y < this.game.boardSize[1]; y += 1) {
          if (this.game.board[x][y]) {
            this.context.fillRect(
              this.cellSize[0] * x,
              this.cellSize[1] * y,
              this.cellSize[0],
              this.cellSize[1]
            );
          }
        }
      }
    });
  }


  // USER INTERACTION


  // Turn a cell on or off based on a given mouse position (clientX and clientY)
  mouse(mousex, mousey) {
    // Position of the canvas in the viewport
    const bbox = this.elem.getBoundingClientRect();

    // If the mosue is over the canvas
    if (mousex > bbox.left &&
        mousey > bbox.top &&
        mousex < bbox.right &&
        mousey < bbox.bottom
    ) {
      // Calculate mouse position relative to canvas
      const relx = mousex - bbox.left;
      const rely = mousey - bbox.top;
      // Calculate cell position
      const cellx = Math.floor(relx / this.cellSize[0]);
      const celly = Math.floor(rely / this.cellSize[1]);

      this.game.turnOn(cellx, celly);
    }
  }


  // CONTROL FUNCTIONS

  step() {
    this.game.step();
    this.draw();
  }

  start() {
    this.draw();
    setTimeout(() => {  // TODO: allow stopping
      this.step();
      this.start();
    }, 1000 / this.fps);
  }
}


// Only if we're in a browser
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    window.gol = new GameRenderer('#gol');
    window.gol.start();
    // Update canvas when resized (behavior may not apply to all situations, so this isn't default
    // behavior)
    window.addEventListener(
      'resize',
      () => window.gol.sizeChanged(window.gol.elem.offsetWidth, window.gol.elem.offsetHeight)
    );
  });
} else {
  module.exports.Game = Game;
}

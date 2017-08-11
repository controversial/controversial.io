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


/** Controls the logic for a Game of Life simulation. */
class Game {
  /**
   * Create a new Game of Life simulation.
   * @param {number} width - the width (in cells) of the game board
   * @param {number} height - the height (in cells) of the game board
   */
  constructor(width, height) {
    this.board = [[]];
    this.changeSize(width, height);
    this.clear();
  }

  // HELPER FUNCTIONS

  /**
   * Get a 2d array with the width and height of the game board.
   * @return {Array} a 2D array filled with false values
   */
  getBlankBoard() {
    return new Array(this.boardSize[0]).fill(0).map(
      () => new Array(this.boardSize[1]).fill(false)
    );
  }

  /**
   * Get a randomized board row.
   * @return {Array} an array with the width of the board containing random boolean values.
   */
  getRandomRow() {
    return new Array(this.boardSize[0]).fill(0).map(() => Math.random() < 0.125);
  }

  /**
   * Get the size of the simultion in cells.
   * @return {Array} an array in the form [width, height].
   */
  get boardSize() {
    return [this.board.length, this.board[0].length];
  }

  // GAME MANIPULATION

  /**
   * Set all cells in the board to blank.
   * @return {Game} the current game (to allow chaining).
   */
  clear() {
    this.board = this.getBlankBoard();
    return this;
  }

  /**
   * Set all cells in the game to random values.
   * There's a 1 in 8 chance that a cell will be true, most cells will be false.
   */
  randomize() {
    const oldBoard = this.board;
    while (JSON.stringify(this.board) === JSON.stringify(oldBoard)) {
      this.board = this.getBlankBoard().map(() => this.getRandomRow());
    }
    return this;
  }

  /**
   * Set the state of one or more cells to be true or false.
   * @param {number} x - the X position of the cell to change.
   * @param {number} y - the Y position of the cell to change.
   * @param {boolean} value - the boolean value to assign to the given cell(s).
   * @return {Game} the current game (to allow chaining).
   */
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
    return this;
  }

  /**
   * Turn on a cell.
   * @param {number} x - the X position of the cell to turn on.
   * @param {number} y - the Y position of the cell to turn on.
   * @return {Game} the current game (to allow chaining).
   */
  turnOn(x, y) {
    return this.setState(x, y, true);
  }

  /**
   * Turn off a cell.
   * @param {number} x - the X position of the cell to turn off.
   * @param {number} y - the Y position of the cell to turn off.
   * @return {Game} the current game (to allow chaining).
   */
  turnOff(x, y) {
    return this.setState(x, y, false);
  }

  // GAME LOGIC

  /**
   * Find the number of live cells in a given cell's neighborhood.
   * @param {number} x - the X position of the cell to check.
   * @param {number} y - the Y position of the cell to check.
   * @return {number} the number of live cells in the eight-cell neighborhood
   */
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

  /**
   * Determine if a cell should live or die based on its number of live neighbors.
   * @param {boolean} isLive - whether the cell in question is currently alive
   * @param {number} liveNeighbors - the number of live neighbors in an eight-cell neighborhood (as
   * returned from countLiveNeighbors)
   * @return {boolean} whether the cell should live or die
   */
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

  /**
   * Advance the simulation one step.
   * @return {Game} the current game (to allow chaining).
   */
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

  /**
   * Change the size of the board. If either dimension shrinks, cells will be
   * deleted from the bottom or right of the board. If either dimension grows,
   * either blank or random cells will be added in the new territory.
   * @param {number} width - the updated width of the board
   * @param {number} height - the updated height of the board
   * @param {boolean} shouldRandomize - whether any new territory should be filled with random cells
   * or left blank.
   * @return {Game} the current game (to allow chaining).
   */
  changeSize(width, height, shouldRandomize) {
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

    // Add new rows
    for (let i = 0; i < diff[0]; i += 1) {
      this.board.push(
        shouldRandomize ? this.getRandomRow() : new Array(this.boardSize[0]).fill(false)
      );
    }
    // Add new cells to existing rows (new columns)
    for (let i = 0; i < diff[1]; i += 1) {
      for (let k = 0; k < this.board.length; k += 1) {
        this.board[k].push(shouldRandomize ? Math.random() < 0.125 : false);
      }
    }

    return this;
  }

  // GAME DEBUG FUNCTIONS

  /**
   * Get a string representing the game (sort of ascii art-esque). Example:
   * .......
   * .......
   * ....o..
   * .....o.
   * ...ooo.
   * .......
   * @return {String} string representation of the simulation state.
   */
  toString() {
    function boolToAscii(n) { return n ? 'o' : '.'; }
    return this.board.map(row => row.map(boolToAscii).join('')).join('\n');
  }

  /**
   * Print the game to the console.
   */
  print() {
    /* eslint-disable no-console */
    console.log(`${this.toString()}\n`);
    /* eslint-enable no-console */
  }
}


// BINDS `Game` OBJECT TO A CANVAS =================================================================


/** Binds a Game instance to a canvas to display it to a user. */
class GameRenderer {
  /**
   * Bind a Game to a canvas. Initiaizatin requires DOM.
   * @param {string} selector - a selector for the canvas element to bind to.
   * @param {number} fps - the frames per second at which the animation should try to run.
   * @param {number} cellSize - the optimal size (in pixels) for game cells which the renderer
   * should strive to use. This will be stretched slightly in order to completely fill the canvas.
   * @param {string} cellColor - a hex string for the color that should be used to draw cells
   * @param {boolean} randomize - whether the board is randomized (as in the header of my site) or
   * controlled manually. If true, the game will be initally randomized and all new territory will
   * be randomized as well.
   */
  constructor(selector, fps, cellSize, cellColor, randomize) {
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
    this.isRandom = typeof randomize === 'undefined' ? true : randomize;

    this.needsSizeUpdate = true;
    if (this.isRandom) this.game.randomize();

    document.addEventListener('mousemove', e => this.mouse(e.clientX, e.clientY));
  }


  // RENDERING FUNCTIONS
  //   These functions connect the simulation to the browser


  /**
   * Called when the size of the canvas changes in order to readjust the cells to fit the canvas.
   * The canvas's coordinate systems will be updated, and the cells will be redrawn to match the
   * ideal cell size provided.
   */
  updateSize() {
    // Update canvas coordinate system
    const rect = this.elem.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Update tile size by finding the dimensions that will both evenly fill
    // the canvas and be close closest to the idealCellSize.
    this.cellSize = [
      width / Math.round(width / this.idealCellSize),
      height / Math.round(height / this.idealCellSize),
    ];

    this.game.changeSize(
      Math.round(width / this.cellSize[0]),
      Math.round(height / this.cellSize[1]),
      this.isRandom
    );

    this.elem.setAttribute('width', width);
    this.elem.setAttribute('height', height);

    this.draw();
  }

  /**
   * Render the cells onto the canvas.
   * This method will draw each cell (with the given color) onto the canvas.
   */
  draw() {
    requestAnimationFrame(() => {
      // Update canvas coordinates if needed
      if (this.needsSizeUpdate) {
        this.needsSizeUpdate = false;
        this.updateSize();
      }

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


  /**
   * Turn a cell on or off based on a given mouse position. This implements the logic for the
   * mapping of screen coordinates to coordinates on the game board.
   * @param {number} mousex - the X coordinate of the mouse, as stored in the clientX property of
   * a mousemove event.
   * @param {number} mousey - the Y coordinate of the mouse, as stored in the clientY property of
   * a mousemove event.
   */
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
      this.draw();
    }
  }


  // CONTROL FUNCTIONS

  /** Step and redraw. */
  step() {
    this.game.step();
    this.draw();
  }

  /** Begin advancing the simulation in a timed loop. */
  start() {
    this.draw();
    this.timeout = setTimeout(() => {
      this.step();
      this.start();
    }, 1000 / this.fps);
  }

  /** Stop the advancement of the simulation. */
  stop() {
    if (typeof this.timeout !== 'undefined') {
      clearTimeout(this.timeout);
    }
  }
}


// Only if we're in a browser
if (typeof window !== 'undefined') {
  window.setupGol = () => {
    window.gol = new GameRenderer('#gol');
    window.gol.start();
    // Update canvas when resized (this isn't the default behavior because not all uses involve
    // canvases whose size changes when the window is resized)
    window.addEventListener('resize', () => { window.gol.needsSizeUpdate = true; });
  };
} else {
  module.exports.Game = Game;
}

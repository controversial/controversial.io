/* Boids flocking simulation (TODO) */

function Boid (x, y) {
  this.x = x || flock.canvas.getAttribute("width") / 2;
  this.y = y || flock.canvas.getAttribute("height") / 2;
}


document.addEventListener("DOMContentLoaded", function () {
  window.flock = {


    // BASIC ATTRIBUTES =======================================================

    boids: [],
    canvas: document.getElementById("boids"),
    ctx: document.getElementById("boids").getContext("2d"),

    fps: 15,


    // RENDERING FUNCTIONS ====================================================
    // These functions connect the simulation to the browser


    // Called to update the canvas coordinate system if the canvas size changes
    sizeChanged: function() {
      var width = flock.canvas.offsetWidth,
          height = flock.canvas.offsetHeight;
      flock.canvas.setAttribute("width", width);
      flock.canvas.setAttribute("height", height);
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
      flock.step();
      flock.redraw();
      setTimeout(function() {
        requestAnimationFrame(flock.start);
      }, 1000 / flock.fps);
    },


    // Initialize and begin

    init: function() {
      this.sizeChanged(); // Calculate sizes
      this.randomize();
      this.start();
    }
  };




  window.addEventListener("resize", flock.sizeChanged);
  document.addEventListener("mousemove", flock.interacted);
  flock.init();

});

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
          width = gol.canvas.offsetWidth,
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
      // Position of the canvas in the viewport
      var bbox = gol.canvas.getBoundingClientRect(),
      // Position of the mouse in the viewport
          absx = e.clientX, absy=e.clientY;

      // If these two positions intersect:
      if (absx > bbox.left  &&
          absy > bbox.top   &&
          absx < bbox.right &&
          absy < bbox.bottom
      ) {
        // Calculate mouse position relative to canvas
        var relx = absx - bbox.left,
            rely = absy - bbox.top;
        // Calculate cell position
        var cellx = Math.floor(relx / gol.cellSize[0]),
            celly = Math.floor(rely / gol.cellSize[1]);

        gol.board[cellx][celly] = true;
      }
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

// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.


var elem = {
  body: document.body,

  header: document.getElementsByTagName("header")[0],
  headerTitle: document.getElementsByTagName("h1")[0],
  downIndicator: document.getElementsByClassName("down-indicator")[0],

  laptop: document.getElementsByClassName("laptop")[0],
  laptopContent: document.getElementsByClassName("laptop-content")[0],
  laptopBase: document.getElementsByClassName("laptop-base")[0]
};


// HEADER TRANSITION LOGIC ====================================================


function setHeaderElementsPinned(fixed) {
  var elements = [elem.headerTitle, elem.laptop];
  for (var i=0; i<elements.length; i++) {
    elements[i].style.position = fixed ? "fixed" : "absolute";
    elements[i].style.top = fixed ? "50vh" : window.innerHeight + "px";
  }
}

function updateHeaderElements(progress) {

  function tween(a, b) {
    return a + (b - a) * progress;
  }

  // FIT MAIN HEADER TO LAPTOP SCREEN

  whRatio = elem.laptopContent.offsetWidth / elem.laptopContent.offsetHeight;
  elem.header.style.width = tween(
    100,
    (100 * elem.laptopContent.offsetWidth / window.innerWidth)
  ) + "vw";
  elem.header.style.height = tween(
    100 * (window.innerHeight / window.innerWidth),
    (100 * elem.laptopContent.offsetWidth / window.innerWidth) / whRatio
  ) + "vw";
  elem.header.style.top = (progress < 1 ?
    tween(window.innerHeight / 2, window.innerHeight / 2 - elem.laptopBase.offsetHeight / 2) :
    window.innerHeight - elem.laptopBase.offsetHeight / 2) +
  "px";
  elem.header.style.position = progress < 1 ? "fixed" : "absolute";

  // DEAL WITH ASSOCIATED TIDBITS

  elem.downIndicator.style.opacity = 1 - progress;  // Fade out down indicator
  elem.headerTitle.style.fontSize = tween(5, 4) + "vw";  // Shrink header

  // ADJUST CANVAS SETTINGS

  // Mean of X scale difference and Y scale difference
  var canvasScale = (gol.canvas.offsetWidth / window.innerWidth + gol.canvas.offsetHeight / window.innerHeight) / 2;
  gol.idealCellSize = 20 * canvasScale;
  gol.sizeChanged();
}



// SCROLL LISTENER ============================================================



document.addEventListener("scroll", function(e) {
  var scroll = window.scrollY;

  // Header

  var headerProgress = scroll / (window.innerHeight / 2);

  switch(true) {
    case (scroll < 5):
      setHeaderElementsPinned(true);
      updateHeaderElements(0);
      break;

    case (scroll < window.innerHeight / 2):
      setHeaderElementsPinned(true);
      updateHeaderElements(headerProgress);
      break;

    default:
      setHeaderElementsPinned(false);
      updateHeaderElements(1);
  }
});

/* Typewriter text animation */

document.addEventListener("DOMContentLoaded", function () {

  window.typewriter = {
    element: document.getElementById("typewriter"),
    contents: [
      "I write code.\xa0",
      "I write software.\xa0",
      "I write websites.",
      "I write apps.\xa0",
      "I write libraries.\xa0",
      "I write simulations.\xa0",
      "I design experiences.\xa0",
      "I design interfaces.\xa0",
    ],
    contentIndex: 0,

    // A random delay in ms will be chosen from this range. The resulting delay
    // is multiplied for typing, so this isn't exact.
    typingDelay: [50, 100],

    /* Find common words that two strings start with. */
    _commonStart: function (a, b) {
      var aWords = a.split(" ");
      var bWords = b.split(" ");

      var commonWords = [];
      for (var i=0; i<aWords.length; i++) {
        if (aWords[i] === bWords[i]) {
          commonWords.push(aWords[i]);
        } else {
          return commonWords.join(" ");
        }
      }
    },

    /* Get instructions for transforming between two strings in the form of
     * number of characters to delete and characters to add.
     */
    _transitionDescription: function(a, b) {
      var common = this._commonStart(a, b);
      var numCharactersToDelete = a.length - common.length;
      var charactersToAdd = b.slice(common.length);
      return {
        del: numCharactersToDelete,
        add: charactersToAdd
      };
    },

    _getTypingDelay: function() {
      return Math.floor(Math.random() * (this.typingDelay[1] - this.typingDelay[0]) + this.typingDelay[0]);
    },

    /* Animate bacspacing by a given number of characters */
    backspace: function(num, callback) {
      var content, toGo = num;
      callback = callback || function() {};
      this._backspace1 = function() {
        if (toGo === 0) {
          callback();
        } else {
          content = this.element.textContent;
          this.element.textContent = content.slice(0, content.length - 1);
          toGo--;
          setTimeout(function(){typewriter._backspace1();}, this._getTypingDelay());
        }
      };
      this._backspace1();
    },

    /* Animate inserting a given string at the end of the text */
    type: function(text, callback) {
      var i = 0;
      callback = callback || function() {};
      this._type1 = function() {
        if (i === text.length) {
          callback();
        } else {
          this.element.textContent += text[i];
          i++;
          setTimeout(function(){typewriter._type1();}, this._getTypingDelay() * 1.5);
        }
      };
      this._type1();
    },

    /* Animate advancing to the next phrase */
    next: function(callback) {
      this.contentIndex++;
      // Loop back
      if (this.contentIndex === this.contents.length) {
        this.contentIndex = 0;
      }
      // Make changes
      var changesNeeded = this._transitionDescription(
        this.element.textContent,
        this.contents[this.contentIndex]
      );
      this.backspace(changesNeeded.del, function() {
        setTimeout(function(){typewriter.type(changesNeeded.add, callback);}, 200);
      });
    },

    /* Fill the element with the first phrase (non-animated) and set up other
     * miscellaneous details.
     */
    init: function() {
      this.element.textContent = this.contents[0];
      this._startOnScroll = function() {
        if (
          window.scrollY + window.innerHeight >
          this.element.offsetTop + this.element.offsetHeight / 2
        ) {
          setTimeout(function(){typewriter.play();}, 1000);
          window.removeEventListener("scroll", scrollFunc);
        }
      };
      function scrollFunc() {
        typewriter._startOnScroll();
      }
      window.addEventListener("scroll", scrollFunc);
    },

    /* Recursively continue advancing */
    play: function() {
      this.next(function() {
        setTimeout(function() {
          typewriter.play();
        }, 3000);
      });
    }

  };

  typewriter.init();

});

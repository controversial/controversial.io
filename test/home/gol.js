// Test the game of life script

const test = require('ava');
const jsdom = require('jsdom').jsdom;

const mainScript = require.resolve('../../app/js/home/gol.js');


// SET UP JSDOM ===============================================================

const document = jsdom(`
<html>
  <body>
    <!-- Simulation will be spawned on this canvas -->
    <canvas id="gol"></canvas>

    <!-- The Game of Life script -->
    <script src="${mainScript}">
  </body>
</html>
`);
const window = document.defaultView;
// Patch canvas.getContext() with fake canvas functions
window.HTMLCanvasElement.prototype.getContext = () => ({
  clearRect: () => {},
  fillRect: () => {},
});


// TESTS ======================================================================

test('properly initializes game of life', (t) => {
  t.true(typeof window.gol === 'object');
});

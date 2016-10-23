// Test the game of life script

const test = require('ava');
const jsdom = require('jsdom').jsdom;

const mainScript = require.resolve('../../app/js/home/gol.js');


// TESTS ======================================================================

const document = jsdom(`
<html>
  <body>
    <canvas id="gol"></canvas>
    <script src="${mainScript}">
  </body>
</html>
`);
const window = document.defaultView;


test('properly initializes game of life', (t) => {
  t.true(typeof window.gol === 'object');
});

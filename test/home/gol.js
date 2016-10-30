// Test the game of life script

const test = require('ava');
const gol = require('../../app/js/home/gol.js');

test('properly initializes game of life', (t) => {
  const g = new gol.Game();
  t.true(g instanceof gol.Game);
});

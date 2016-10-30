// Test the game of life script

const test = require('ava');
const gol = require('../../app/js/home/gol.js');

test('Properly initializes game of life', (t) => {
  const g = new gol.Game(15, 15);
  t.true(g instanceof gol.Game);
  t.is(g.board.length, 15);
  t.is(g.board[0].length, 15);
});

test('Game of life boardSize works', (t) => {
  const g = new gol.Game(15, 15);
  t.deepEqual(g.boardSize, [15, 15]);
  g.board.push(new Array(15).fill(false));
  t.deepEqual(g.boardSize, [16, 15]);
  for (let i = 0; i < g.boardSize[0]; i += 1) {
    g.board[i].push(false);
  }
  t.deepEqual(g.boardSize, [16, 16]);
});

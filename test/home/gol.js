// Test the game of life script

/* eslint-disable no-console */

import { Game } from '../../app/main/home/gol';

const test = require('ava');

test('Game of life is properly initialized', (t) => {
  const g = new Game(15, 15);
  t.true(g instanceof Game);
  t.is(g.board.length, 15);
  t.is(g.board[0].length, 15);
});

test('Game of life boardSize works', (t) => {
  const g = new Game(15, 15);
  // Check basic boardSize
  t.deepEqual(g.boardSize, [15, 15]);
  // Check that boardSize changes when a new row is added
  g.board.push(new Array(15).fill(false));
  t.deepEqual(g.boardSize, [16, 15]);
  // Check that boardSize changes when a new column is added
  for (let i = 0; i < g.boardSize[0]; i += 1) {
    g.board[i].push(false);
  }
  t.deepEqual(g.boardSize, [16, 16]);
});


test('Game of life logic works', (t) => {
  // Test game of life with a glider
  const g = new Game(6, 7);
  // Create a glider
  g.turnOn([
            [2, 1],
                    [3, 2],
    [1, 3], [2, 3], [3, 3],
  ]);
  // Advance the glider 6 steps
  g.print();
  for (let i = 0; i < 6; i += 1) g.step().print();

  t.deepEqual(
    g.board,
    [[false, false, false, false, false, false, false],
     [false, false, false, false, false, false, false],
     [false, false, false, false, true, false, false],
     [false, false, false, false, false, true, false],
     [false, false, false, true, true, true, false],
     [false, false, false, false, false, false, false]]
  );
});

test('Game of life helper methods work', (t) => {
  const g = new Game(2, 2);
  // test getBlankBoard
  t.deepEqual(g.getBlankBoard(), [[false, false], [false, false]]);
  // test getRandomRow
  t.true(typeof g.getRandomRow() === 'object');
  t.is(g.getRandomRow().length, 2);
  // boardSize is already tested
});

test('Game of life manipulation methods work', (t) => {
  const g = new Game(3, 3);
  // test turnOn
  g.turnOn(1, 1);
  t.deepEqual(g.board, [[false, false, false], [false, true, false], [false, false, false]]);
  // test turnOff
  g.turnOff(1, 1);
  t.deepEqual(g.board, [[false, false, false], [false, false, false], [false, false, false]]);
  // test clear
  g.turnOn(1, 1).clear();
  t.deepEqual(g.board, [[false, false, false], [false, false, false], [false, false, false]]);
  // test randomize
  const board1 = g.randomize().board;
  const board2 = g.randomize().board;
  t.notDeepEqual(board1, board2);
});

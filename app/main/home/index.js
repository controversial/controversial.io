import { GameRenderer } from './gol';

export default function init() {
  // Set up game of life
  window.gol = new GameRenderer('#gol');
  window.gol.start();
  window.addEventListener('resize', () => { window.gol.needsSizeUpdate = true; });
}

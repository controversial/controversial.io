import { GameRenderer } from './gol';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.browserCheck, 1000);

  // Set up game of life
  window.gol = new GameRenderer('#gol');
  window.gol.start();
  window.addEventListener('resize', () => { window.gol.needsSizeUpdate = true; });

  window.navUpdate(true);
  window.setupLaptops();

  window.navTransitionUpdate(0);

  // Configure navigation trigger clicked
  document.getElementById('navigation-trigger').addEventListener('click', window.navToggle);
});

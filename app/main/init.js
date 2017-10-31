import { GameRenderer } from './gol';
import { Laptop, LaptopCarousel } from './projects';
import { navBarUpdate } from './navigation';
import { update as navTransitionUpdate, navToggle } from './navigation-anim';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.browserCheck, 1000);

  // Set up game of life
  window.gol = new GameRenderer('#gol');
  window.gol.start();
  window.addEventListener('resize', () => { window.gol.needsSizeUpdate = true; });

  navBarUpdate(true);
  window.addEventListener('hashchange', navBarUpdate);
  navTransitionUpdate(0);
  window.addEventListener('resize', () => navTransitionUpdate(window.navShown ? 1 : 0));

  // Set up laptops
  // Convert all elements with the class 'laptop3d' into laptops
  const laptopsContainer = document.getElementsByClassName('laptops-container')[0];
  const laptopElems = [...laptopsContainer.getElementsByClassName('laptop3d')];
  const laptops = laptopElems.map((l, i) => new Laptop(l, i - 1));
  // Create laptop carousel
  window.carousel = new LaptopCarousel(laptopsContainer, laptops);

  // Configure navigation trigger clicked
  document.getElementById('navigation-trigger').addEventListener('click', navToggle);
});

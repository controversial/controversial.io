import browserCheck from './browsercheck';
import homeInit from './home';
import { Laptop, LaptopCarousel } from './navigation/projects';
import { navBarUpdate } from './navigation/navigation';
import { update as navTransitionUpdate, navToggle } from './navigation/navigation-anim';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(browserCheck, 1000);

  homeInit();

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

import { Laptop, LaptopCarousel } from './projects';
import { update as navTransitionUpdate, navToggle } from './navigation-anim';

export function navigate(hash) {
  console.log(hash);
}

export function navBarUpdate(initial = false) {
  const hash = window.location.hash.startsWith('#')
                 ? window.location.hash.substring(1)
                 : window.location.hash;

  const linkToHere = document.getElementById('navigation').querySelector(`a[href='#${hash}']`);

  document.getElementById('navigation').querySelectorAll('a').forEach(a => a.classList.remove('selected'));
  linkToHere.classList.add('selected');

  // No navigation animation necessary on page load
  if (initial !== true) navigate(hash);
}


export default function init() {
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
}

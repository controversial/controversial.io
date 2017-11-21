import { Laptop, LaptopCarousel } from './laptops';
import { update as navTransitionUpdate, navToggle } from './anim';

// Subclasses of NavigationAnimationBase
import HomeAnim from '../home/nav-shrink';
import AboutAnim from '../about/nav-shrink';
import WorkAnim from '../work/nav-shrink';

const os = window.ease.outSin;


/** Coordinates navigation */
class Navigation {
  constructor(carousel, ...pages) {
    this.carousel = carousel;
    this.pages = Array.from(pages);

    this.shown = false;

    this.navTransitionDuration = 300;
  }


  /** Switch to a new page */
  async navigate(hash) {
    const laptop = this.carousel.getLaptopWithHash(hash);

    await this.open();
    await laptop.centerSelf();
  }


  /** Show navigation */
  open() {
    return new Promise((resolve) => {
      // Only needs to happen if it's not already open
      if (!this.open) {
        // Set up each animation frame for its correct time
        for (let i = 0; i < 1; i += (1 / 60)) {
          setTimeout(
            () => this.update(os(i)),       // Update to proper progress
            i * this.navTransitionDuration  // at proper time
          );
        }
        // When we're finished
        setTimeout(
          () => { this.update(1); resolve(); },
          this.navTransitionDuration
        );
        window.navShown = true;
      // If it's already open, resolve immediately
      } else {
        resolve();
      }
    });
  }


  /** Hide navigation */
  close() {
    return new Promise((resolve) => {
      // Only needs to happen if it's not already open
      if (!this.open) {
        // Set up each animation frame for its correct time
        for (let i = 0; i < 1; i += (1 / 60)) {
          setTimeout(
            () => this.update(1 - os(i)),   // Update to proper progress
            i * this.navTransitionDuration  // at proper time
          );
        }
        // When we're finished
        setTimeout(
          () => { this.update(0); resolve(); },
          this.navTransitionDuration
        );
        window.navShown = false;
      // If it's already open, resolve immediately
      } else {
        resolve();
      }
    });
  }


  /** Toggle navigation */
  toggle() {
    if (this.open) return this.close();
    return this.open();
  }

}

window.nav = new Navigation(
  window.carousel,
  new HomeAnim(),
  new AboutAnim(),
  new WorkAnim()
);


//


export async function navigate(hash, animated = true) {
  const laptop = window.carousel.getLaptopWithHash(hash);
  if (!window.navShown) await navToggle();
  laptop.centerSelf();
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

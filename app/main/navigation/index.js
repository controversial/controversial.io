import { Laptop, LaptopCarousel } from './laptops';

// Subclasses of NavigationAnimationBase
import HomeAnim from '../home/nav-shrink';
import AboutAnim from '../about/nav-shrink';
import WorkAnim from '../work/nav-shrink';

const os = window.ease.outSin;


/** Coordinates navigation */
export class Navigation {


  constructor(carousel, ...pages) {
    this.carousel = carousel;
    this.pages = Array.from(pages);

    this.shown = false;
    this.navTransitionDuration = 300;

    Navigation.navBarUpdate();
    window.addEventListener('hashchange', Navigation.navBarUpdate);
    // Navigate on top bar clicked
    Array.from(document.getElementById('navigation').getElementsByTagName('a')).forEach((e) => {
      e.addEventListener('click', () => this.navigateTo(e.getAttribute('href').substring(1)));
    });

    this.transitionUpdate(0);
    // Jump to either open or closed on resize
    window.addEventListener('resize', () => this.transitionUpdate(this.shown)); // this.shown is 1 if shown, 0 if not

    // Set up laptops
    // Convert all elements with the class 'laptop3d' into laptops
    const laptopsContainer = document.getElementsByClassName('laptops-container')[0];
    const laptopElems = [...laptopsContainer.getElementsByClassName('laptop3d')];
    const laptops = laptopElems.map((l, i) => new Laptop(l, i - 1));
    // Create laptop carousel
    this.carousel = new LaptopCarousel(laptopsContainer, laptops);

    // Configure navigation trigger clicked
    document.getElementById('navigation-trigger').addEventListener('click', () => this.toggle());
  }


  /** Get the current page hash without the # */
  static get hash() {
    return window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
  }


  /** Switch to a new page */
  async navigateTo(hash) {
    const laptop = this.carousel.getLaptopWithHash(hash);

    await this.open();
    await laptop.centerSelf();
  }


  /** Move to a specific point in the shrink animation */
  transitionUpdate(progress) {
    // Page shrinking into laptop
    requestAnimationFrame(() => this.pages[this.carousel.position + 1].update(progress));
    // Update navigation bar opacity
    document.getElementById('navigation').style.opacity = (progress * 0.75) + 0.25;
    // Update navigation trigger opacity in the opposite direction
    document.getElementById('navigation-trigger').style.opacity = Math.max(0.25, 1 - (progress * 0.75));
  }


  /** Show navigation */
  open() {
    return new Promise((resolve) => {
      // Only needs to happen if it's not already open
      if (!this.shown) {
        // Set up each animation frame for its correct time
        for (let i = 0; i < 1; i += (1 / 60)) {
          setTimeout(
            () => this.transitionUpdate(os(i)),       // Update to proper progress
            i * this.navTransitionDuration  // at proper time
          );
        }
        // When we're finished
        setTimeout(
          () => { this.transitionUpdate(1); resolve(); },
          this.navTransitionDuration
        );
        this.shown = true;
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
      if (this.shown) {
        // Set up each animation frame for its correct time
        for (let i = 0; i < 1; i += (1 / 60)) {
          setTimeout(
            () => this.transitionUpdate(1 - os(i)),   // Update to proper progress
            i * this.navTransitionDuration  // at proper time
          );
        }
        // When we're finished
        setTimeout(
          () => { this.transitionUpdate(0); resolve(); },
          this.navTransitionDuration
        );
        this.shown = false;
      // If it's already open, resolve immediately
      } else {
        resolve();
      }
    });
  }

  /** Toggle navigation */
  toggle() {
    if (this.shown) return this.close();
    return this.open();
  }


  /** Update the top nav bar to reflect the currently active page */
  static navBarUpdate() {
    const linkToHere = document.getElementById('navigation').querySelector(`a[href='#${Navigation.hash}']`);
    // un-highlight all the links
    document.getElementById('navigation').querySelectorAll('a').forEach(a => a.classList.remove('selected'));
    // re-highlight the right one
    linkToHere.classList.add('selected');
  }

}


export default function init() {
  window.nav = window.navigation = new Navigation(
    window.carousel,
    new AboutAnim(),
    new HomeAnim(),
    new WorkAnim()
  );
}

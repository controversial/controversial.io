import { Laptop, LaptopCarousel } from './laptops';

// Subclasses of NavigationAnimationBase
import HomeAnim from '../home/nav-shrink';
import AboutAnim from '../about/nav-shrink';
import WorkAnim from '../work/nav-shrink';

import { ease } from '../helpers';

const os = ease.outSin;

/** Coordinates navigation */
export class Navigation {


  constructor(...pages) {
    this.pages = Array.from(pages);

    this.shown = false;
    this.navTransitionDuration = 300;
    this.forbidPush = false;

    window.addEventListener('popstate', () => { this.forbidPush = true; });
    window.addEventListener('hashchange', () => this.navigateTo(Navigation.hash));

    // Navigation bar

    Navigation.navBarUpdate();
    // Configure navigation trigger clicked
    document.getElementById('navigation-trigger').addEventListener('click', () => this.toggle());

    // Set up laptops

    // Convert all elements with the class 'laptop3d' into laptops
    const laptopsContainer = document.getElementsByClassName('laptops-container')[0];
    const laptopElems = [...laptopsContainer.getElementsByClassName('laptop3d')];
    const laptops = laptopElems.map((l, i) => new Laptop(l, i - 1));
    // Create laptop carousel
    this.carousel = new LaptopCarousel(laptopsContainer, laptops, this);

    // Shrink other pages
    const otherpages = this.pages.filter(n => n !== this.currentPage);
    otherpages.forEach(page => page.update(1.0));
    // Make sure current page is correctly scaled, and that all other navigation UI is proper
    this.transitionUpdate(0);

    // Key bindings

    this.keyBind();
  }

  keyBind() {
    window.addEventListener('keydown', (e) => {
      // Open navigation when down is pressed
      if (e.key === 'ArrowDown') this.open();
      // Close navigation when escape, up, or enter is pressed
      if (e.key === 'Escape' || e.key === 'ArrowUp' || e.key === 'Enter') this.close();
      // Toggle navigation when space is pressed
      if (e.key === ' ') this.toggle();
      // Carousel left/right when navigation shown
      if (this.shown) {
        if (e.key === 'ArrowRight') this.carousel.right();
        if (e.key === 'ArrowLeft') this.carousel.left();
      }
    });
  }


  /** Sets up promise to be resolved */
  animationStarted() {
    if (typeof this.safeToAnimate === 'undefined') {
      // This promise will be resolved when an animation completes.
      // This promise can be awaited to prevent animation overlap
      this.safeToAnimate = new Promise((resolve) => {
        this.animationFinished = () => {
          resolve();
          this.safeToAnimate = undefined;
        };
      });
    } else {
      console.warn('Tried to start new animation before previous was finished');
    }
  }


  /** Get the current page hash without the # */
  static get hash() {
    return window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
  }


  get currentPage() {
    return this.pages[this.carousel.position + 1];
  }


  /** Switch to a new page */
  navigateTo(hash) {
    return new Promise(async (resolve) => {
      await this.open();
      await this.carousel.getLaptopWithHash(hash).centerSelf();
      await this.close();
      resolve();
    });
  }


  /** Move to a specific point in the shrink animation */
  transitionUpdate(progress) {
    return new Promise((resolve) => {
      // Update navigation bar opacity
      document.getElementById('navigation').style.opacity = (progress * 0.75) + 0.25;
      // Update navigation trigger opacity in the opposite direction
      document.getElementById('navigation-trigger').style.opacity = Math.max(0.25, 1 - (progress * 0.75));
      // Page shrinking into laptop
      requestAnimationFrame(() => {
        this.currentPage.update(progress);
        resolve();
      });
    });
  }


  /** Show navigation */
  async open() {
    await this.safeToAnimate;

    // Navigation should be pushed onto the history stack for the first navigation of every visit to
    // the navigation screen, UNLESS we got there by using the back/forward buttons or with the top
    // navigation bar
    if (!this.forbidPush) this.carousel.shouldPushState = true;
    else this.forbidPush = false;

    return new Promise((resolve) => {
      // Only needs to happen if it's not already open
      if (!this.shown) {
        this.animationStarted();
        // Set up each animation frame for its correct time
        for (let i = 0; i < 1; i += (1 / 60)) {
          setTimeout(
            () => this.transitionUpdate(os(i)),       // Update to proper progress
            i * this.navTransitionDuration  // at proper time
          );
        }
        // When we're finished
        setTimeout(
          async () => { await this.transitionUpdate(1); this.animationFinished(); resolve(); },
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
  async close() {
    await this.safeToAnimate;
    return new Promise((resolve) => {
      // Only needs to happen if it's not already open
      if (this.shown) {
        this.animationStarted();
        // Set up each animation frame for its correct time
        for (let i = 0; i < 1; i += (1 / 60)) {
          setTimeout(
            () => this.transitionUpdate(1 - os(i)),   // Update to proper progress
            i * this.navTransitionDuration  // at proper time
          );
        }
        // When we're finished
        setTimeout(
          async () => { await this.transitionUpdate(0); this.animationFinished(); resolve(); },
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
    new AboutAnim(),
    new HomeAnim(),
    new WorkAnim()
  );
}

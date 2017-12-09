/** @module Navigation */

import { Laptop, LaptopCarousel } from './laptops';

// Subclasses of NavigationAnimationBase
import HomeAnim from '../home/nav-shrink';
import AboutAnim from '../about/nav-shrink';
import WorkAnim from '../work/nav-shrink';

import { ease, sleep } from '../helpers';

const os = ease.outSin;

/** Coordinates navigation */
export class Navigation {

  /**
   * Initialize
   * @param {...NavigationAnimationBase} pages - the pages to include in this Navigation
   */
  constructor(...pages) {
    this.pages = Array.from(pages);

    this.shown = false;
    this.navTransitionDuration = 300;
    this.forbidPush = false;

    // Shouldn't push new state if state was arrived at by back button
    window.addEventListener('popstate', () => { this.forbidPush = true; });
    // Navigate whenever hash changes
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

  /** Set up miscellaneous key/scroll bindings for controlling navigation easily */
  keyBind() {
    // Key controls

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

    // Trackpad/scroll controls

    window.addEventListener('wheel', (e) => {
      // Vertical scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        if (e.deltaY > 2) this.open();
        if (e.deltaY < -2) this.close();
      }

      e.preventDefault();
      return false;
    });
  }


  /**
   * Returns a Promise that will resolve when it's safe to animate. Only the first animation to
   * await safeToAnimate should get back a functional Promise. If multiple animations awaited
   * safeToAnimate and each was given a functional Promise, each animation would execute at the
   * same time when the Promise resolved. Instead, we return new Promise(() => {}) to all but the
   * first function to access safeToAnimate, which will never return, ensuring that only the first
   * animation to await safeToAnimate ever gets played, preventing overlap while also preventing
   * long chains of built-up animations playing in sequence in a queue.
   */
  get safeToAnimate() {
    if (this._safeToAnimate) {
      const promise = this._safeToAnimate;
      this._safeToAnimate = new Promise(() => {});
      return promise;
    }
    return undefined;
  }
  /**
   * Registers that an animation is in progress and that others should wait (by storing
   * safeToAnimate promise)
   */
  animationStarted() {
    if (typeof this._safeToAnimate === 'undefined') {
      // This promise will be resolved when an animation completes.
      // This promise can be awaited to prevent animation overlap
      this._safeToAnimate = new Promise((resolve) => {
        this.animationFinished = () => {
          resolve();
          this._safeToAnimate = undefined;
        };
      });
    } else {
      console.warn('Tried to start new animation before previous was finished');
    }
  }


  /** Returns the current URL hash without the # */
  static get hash() {
    return window.location.hash.startsWith('#')
      ? window.location.hash.substring(1)
      : window.location.hash;
  }


  /**
   * Gets the active page (the page centered on this.carousel)
   * @return {NavigationAnimationBase} the NavigationAnimationBase subclass that corresponds to the
   * page currently centered on the carousel.
   */
  get currentPage() {
    return this.pages[this.carousel.position + 1];
  }


  /**
   * Switch to a different page
   * @param {String} hash - the hash (without a leading #) to navigate to
   */
  navigateTo(hash) {
    return new Promise(async (resolve) => {
      await this.open();
      await sleep(150);
      await this.carousel.getLaptopWithHash(hash).centerSelf();
      await sleep(150);
      await this.close();
      resolve();
    });
  }


  /**
   * Move to a specific point in the shrink animation
   * @param {number} progress - progress in animation (0 being full size, 1 being fully shrunk)
   */
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


  /**
   * Show navigation
   * @return {Promise} a promise that will resolve when the opening animation has finished.
   */
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

  /**
   * Hide navigation
   * @return {Promise} a promise that will resolve when the closing animation has finished.
   */
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

  /**
   * Toggle navigation
   * @return {Promise} the promise returned by this.open or this.close
   */
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

/** @module AboutNavigationAnimation */

import NavigationBase from '../navigation/anim-base';

/**
 * A class implementing scale behavior for the About page
 * @extends NavigationAnimationBase
 */
export default class AboutNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    this.hash = 'about';
    // Add objects to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('about-wrapper'),
      background: document.querySelector('#about-wrapper .background'),
      infoWrapper: document.querySelector('#about-wrapper .info-wrapper'),
      info: document.querySelector('#about-wrapper .info'),
    });
  }


  scale(laptopScreenCoordinates, progress) {
    super.scale(laptopScreenCoordinates, progress);

    if (window.parallax) {
      window.parallax.rotmax = (1 - progress) * 10;
      window.parallax.rotate();
    }
  }

  putInLaptop() {
    super.putInLaptop();

    // Turn off parallax effect
    if (window.parallax) window.parallax.disable();
  }


  removeFromLaptop() {
    super.removeFromLaptop();

    // Re-enable parallax effect
    if (window.parallax) window.parallax.enable();
  }
}

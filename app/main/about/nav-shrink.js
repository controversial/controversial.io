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
      monogram: document.querySelector('#about-wrapper .monogram'),
      content: document.querySelector('#about-wrapper .content'),
      border: document.querySelector('#about-wrapper .border'),
    });

    this.fontSize = {
      content: 'calc(13px + .75vw)',
      monogram: '4vw',
    };
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
    // Calculate appropriate font size scale
    const scaleX = this.elem.background.getBoundingClientRect().width / window.innerWidth;
    // Scale font sizes using CSS `calc`
    Object.entries(this.fontSize).forEach((pair) => {
      const [key, value] = pair;
      this.elem[key].style.fontSize = `calc(${value} * ${scaleX})`;
    });
    // Adjust border width so that it doesn't jump to thicker when 'transform: scale' is removed
    // Has a lower bound of 1px to ensure border still renders
    this.elem.border.style.borderWidth = `${Math.max(3 * scaleX, 1)}px`;
    // Turn off parallax effect
    if (window.parallax) window.parallax.disable();
  }


  removeFromLaptop() {
    super.removeFromLaptop();
    // Remove adjusted font sizes
    Array.from(Object.keys(this.fontSize)).forEach((n) => {
      this.elem[n].style.fontSize = '';
    });
    // Remove adjusted border width
    this.elem.border.style.borderWidth = '';
    // Re-enable parallax effect
    if (window.parallax) window.parallax.enable();
  }
}

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
    const scaleInfo = super.scale(laptopScreenCoordinates, progress);
    const translationNeeded = scaleInfo[0];

    const windowAspect = window.innerWidth / window.innerHeight;
    const laptopAspect = laptopScreenCoordinates.width / laptopScreenCoordinates.height;
    let scaleNeeded;
    if (windowAspect >= laptopAspect) { // window aspect is wider than laptop; have to fit to width
      scaleNeeded = laptopScreenCoordinates.width / window.innerWidth;
    } else {                           // window aspect is taller than laptop; have to fit to height
      scaleNeeded = laptopScreenCoordinates.height / window.innerHeight;
    }
    const translate = NavigationBase.tween(0, translationNeeded.y, progress);
    const scale = NavigationBase.tween(1, scaleNeeded, progress);
    // Store as attributes for use later
    this.elem.infoWrapper.dataset.translate = translate;
    this.elem.infoWrapper.dataset.scale = scale;

    this.elem.infoWrapper.style.transform = `translateY(${translate}px) scale(${scale})`;

    if (window.parallax) {
      window.parallax.rotmax = (1 - progress) * 10;
      window.parallax.rotate();
    }
  }

  putInLaptop() {
    super.putInLaptop();

    this.elem.infoWrapper.style.transform = `scale(${this.elem.infoWrapper.dataset.scale})`;
    this.elem.laptopContent('about').appendChild(this.elem.infoWrapper);

    // Turn off parallax effect
    if (window.parallax) window.parallax.disable();
  }


  removeFromLaptop() {
    super.removeFromLaptop();

    this.elem.wrapper.appendChild(this.elem.infoWrapper);

    // Re-enable parallax effect
    if (window.parallax) window.parallax.enable();
  }
}

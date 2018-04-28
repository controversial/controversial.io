/** @module NavigationAnimationBase */

// Base class for each page to implement custom scaling behavior
export default class NavigationAnimationBase {
  // Helper methods

  /**
   * Interpolation of a value given a start, an end, and progress
   * @param {number} a - the start value
   * @param {number} b - the end value
   * @param {number} progress - how far between the start and end
   */
  static tween(a, b, progress) {
    return a + ((b - a) * progress);
  }

  /**
   * Returns the center of an object that resembles a DOMRect object
   * @param {DomRect} rect - the rectangle to find the center of
   * @return {object} - an object `{ x: x, y: y }` representing the center
   */
  static getCenter(rect) {
    return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
  }


  constructor() {
    // Elements that need to be referenced
    this.elem = {
      laptop(hash) {
        const h = hash === 'home' ? '' : hash; // 'home' -> ''
        return document.querySelector(`.laptop3d[data-laptop3d-hash='${h}']`);
      },
      laptopContent(hash) {
        return this.laptop(hash).getElementsByClassName('screen')[0];
      },
    };
    // Tracks position in DOM
    this.inLaptop = false;
    // Useful perhaps
    this.currentProgress = 0;
  }


  /**
   * Make all changes necessary to go to a specific progress value, including scaling and addition/
   * removal from laptop.
   * @param {number} progress - progress in animation (0 being full size, 1 being fully shrunk)
   */
  update(progress) {
    // Adjust scale
    this.scale(
      this.elem.laptopContent(this.hash).getBoundingClientRect(),
      progress
    );
    // Change position in DOM when appropriate
    if (progress < 1 && this.inLaptop) {
      this.removeFromLaptop();
    } else if (progress >= 1 && !this.inLaptop) {
      this.putInLaptop();
    }
  }


  // These methods should be implemented by all subclasses

  /**
   * Adjust scale of page
   * @param {DomRect} laptopScreenCoordinates - the coordinates of the laptop screen into which
   * we're scaling
   * @param {number} progress - progress in animation (0 being full size, 1 being fully shrunk)
   */
  scale(laptopScreenCoordinates, progress) {
    // 1. Fit background to laptop screen

    // Establish starting and ending positions for page
    const w = window.innerWidth; const h = window.innerHeight;
    const posA = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
    const posB = laptopScreenCoordinates;

    // Calculate translation needed
    // (Center is used for calculating translation because element is scaled about the center)
    const centerA = NavigationAnimationBase.getCenter(posA);
    const centerB = NavigationAnimationBase.getCenter(posB);
    const translationNeeded = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
    // Calculate scale
    const scaleNeeded = { x: posB.width / posA.width, y: posB.height / posA.height };
    // Apply transformations
    this.elem.background.style.transform = [
      // Translate
      `translateX(${NavigationAnimationBase.tween(0, translationNeeded.x, progress)}px)`,
      `translateY(${NavigationAnimationBase.tween(0, translationNeeded.y, progress)}px)`,
      // Scale
      `scaleX(${NavigationAnimationBase.tween(1, scaleNeeded.x, progress)})`,
      `scaleY(${NavigationAnimationBase.tween(1, scaleNeeded.y, progress)})`,
    ].join(' ');

    this.currentProgress = progress;

    return [translationNeeded, scaleNeeded];
  }

  /**
   * Move the page in DOM from its wrapper to the laptop screen.
   */
  putInLaptop() {
    this.elem.background.style.position = 'absolute';
    this.elem.background.style.transform = '';
    // This should be easy but Blink insists on rendering .front behind .back if I give
    // position: relative to .screen, so .background has to be manually positioned relative to
    // .front
    const screenBezel = window.sassHeightVariable * 0.85;
    this.elem.background.style.top = this.elem.background.style.left = `${screenBezel}vw`;
    this.elem.background.style.width = `${window.sassLengthVariable - (2 * screenBezel) - 0.6}vw`; // 0.6 is border width
    this.elem.background.style.height = `${window.sassWidthVariable - (2.5 * screenBezel) - 0.6}vw`; // 2.5 because bottom bezel is bigger
    this.elem.laptopContent(this.hash).appendChild(this.elem.background);

    this.inLaptop = true;
  }

  /**
   * Move the page in DOM from the laptop screen to its wrapper.
   */
  removeFromLaptop() {
    this.elem.background.style.position = 'fixed';
    this.elem.background.style.top = this.elem.background.style.left = 0;
    this.elem.background.style.width = '100vw';
    this.elem.background.style.height = '100vh';
    this.elem.wrapper.appendChild(this.elem.background);

    this.inLaptop = false;
  }
}

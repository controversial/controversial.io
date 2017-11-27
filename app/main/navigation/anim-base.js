// Base class for each page to implement custom scaling behavior
export default class NavigationAnimationBase {
  // Helper methods

  static tween(a, b, progress) {
    return a + ((b - a) * progress);
  }

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

  scale(laptopScreenCoordinates, progress) {
    // 1. Fit container to laptop screen

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
    this.elem.container.style.transform = [
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

  putInLaptop() {
    this.elem.container.style.position = 'absolute';
    this.elem.container.style.transform = '';
    // This should be easy but Blink insists on rendering .front behind .back if I give
    // position: relative to .screen, so .container has to be manually positioned relative to .front
    const screenBezel = window.sassHeightVariable * 0.85;
    this.elem.container.style.top = this.elem.container.style.left = `${screenBezel}vw`;
    this.elem.container.style.width = `${window.sassLengthVariable - (2 * screenBezel) - 0.6}vw`; // 0.6 is border width
    this.elem.container.style.height = `${window.sassWidthVariable - (2.5 * screenBezel) - 0.6}vw`; // 2.5 because bottom bezel is bigger
    this.elem.laptopContent(this.hash).appendChild(this.elem.container);

    this.inLaptop = true;
  }

  removeFromLaptop() {
    this.elem.container.style.position = 'fixed';
    this.elem.container.style.top = this.elem.container.style.left = 0;
    this.elem.container.style.width = '100vw';
    this.elem.container.style.height = '100vh';
    this.elem.wrapper.appendChild(this.elem.container);

    this.inLaptop = false;
  }
}

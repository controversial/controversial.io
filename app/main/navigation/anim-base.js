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
    this.currentProgress = progress;
  }

  putInLaptop() {
    this.inLaptop = true;
  }

  removeFromLaptop() {
    this.inLaptop = false;
  }
}

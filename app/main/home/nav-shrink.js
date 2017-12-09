// Behavior for the 'shrink into laptop' animation for the home page
import NavigationBase from '../navigation/anim-base';

/**
 * A class implementing scale behavior for the Home page
 * @extends NavigationAnimationBase
 */
export default class HomeNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    this.hash = 'home';
    // Add elements to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('home-wrapper'),
      container: document.querySelector('#home-wrapper .container'),
      canvas: document.getElementById('gol'),
      get title() {
        // Override after first call to ensure it consistently refers to the same element
        Object.defineProperty(this, 'title', { value: this.wrapper.getElementsByTagName('h1')[0] });
        return this.title;
      },
    });
  }

  scale(laptopScreenCoordinates, progress) {
    // 1. Fit container to laptop screen

    const w = window.innerWidth; const h = window.innerHeight;
    const translationNeeded = super.scale(laptopScreenCoordinates, progress)[0];

    // 2. Fit name to laptop screen

    this.elem.title.style.transform = [
      'translate(-50%, -50%)',
      `translateX(${NavigationBase.tween(0, translationNeeded.x, progress)}px)`,
      `translateY(${NavigationBase.tween(0, translationNeeded.y, progress)}px)`,
      `scale(${NavigationBase.tween(1, 0.5, progress)})`,
    ].join(' ');

    // 3. Adjust canvas settings

    const canvasRect = this.elem.canvas.getBoundingClientRect();
    // How much canvas has been downscaled overall? Averages X and Y scale factors to get a holistic
    // scale factor
    const horizontalScaleFactor = (canvasRect.width / w);
    const verticalScaleFactor = (canvasRect.height / h);
    const averageScaleFactor = (horizontalScaleFactor + verticalScaleFactor) / 2;
    window.gol.idealCellSize = 20 * averageScaleFactor;
    window.gol.needsSizeUpdate = true;

    super.scale(laptopScreenCoordinates, progress);
  }

  putInLaptop() {
    super.putInLaptop();

    this.elem.title.style.position = 'absolute';
    this.elem.title.style.transform = 'translate(-50%, -50%) scale(0.5)';
    this.elem.title.style.animation = 'none';
    this.elem.laptopContent('home').appendChild(this.elem.title);
  }

  removeFromLaptop() {
    super.removeFromLaptop();

    this.elem.title.style.position = 'fixed';
    this.elem.wrapper.appendChild(this.elem.title);
  }
}

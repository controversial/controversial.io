// Behavior for the 'shrink into laptop' animation for the home page
import NavigationBase from '../navigation/navigation-animation-base';


export default class HomeNavigationAnimation extends NavigationBase {
  constructor() {
    super();
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

    // Establish starting and ending positions for page
    const w = window.innerWidth; const h = window.innerHeight;
    const posA = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
    const posB = laptopScreenCoordinates;
    // Calculate translation needed
    // (Center is used for calculating translation because element is scaled about the center)
    const centerA = NavigationBase.getCenter(posA);
    const centerB = NavigationBase.getCenter(posB);
    const translationNeeded = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
    // Calculate scale
    const scaleNeeded = { x: posB.width / posA.width, y: posB.height / posA.height };
    // Apply transformations
    this.elem.container.style.transform = [
      // Translate
      `translateX(${NavigationBase.tween(0, translationNeeded.x, progress)}px)`,
      `translateY(${NavigationBase.tween(0, translationNeeded.y, progress)}px)`,
      // Scale
      `scaleX(${NavigationBase.tween(1, scaleNeeded.x, progress)})`,
      `scaleY(${NavigationBase.tween(1, scaleNeeded.y, progress)})`,
    ].join(' ');

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
    this.elem.container.style.position = 'absolute';
    this.elem.container.style.transform = '';
    // This should be easy but Blink insists on rendering .front behind .back if I give
    // position: relative to .screen, so .container has to be manually positioned relative to .front
    const screenBezel = window.sassHeightVariable * 0.85;
    this.elem.container.style.top = this.elem.container.style.left = `${screenBezel}vw`;
    this.elem.container.style.width = `${window.sassLengthVariable - (2 * screenBezel) - 0.6}vw`; // 0.6 is border width
    this.elem.container.style.height = `${window.sassWidthVariable - (2.5 * screenBezel) - 0.6}vw`; // 2.5 because bottom bezel is bigger
    this.elem.laptopContent('home').appendChild(this.elem.container);

    this.elem.title.style.position = 'absolute';
    this.elem.title.style.transform = 'translate(-50%, -50%) scale(0.5)';
    this.elem.title.style.animation = 'none';
    this.elem.laptopContent('home').appendChild(this.elem.title);

    super.putInLaptop();
  }

  removeFromLaptop() {
    this.elem.container.style.position = 'fixed';
    this.elem.container.style.top = this.elem.container.style.left = 0;
    this.elem.container.style.width = '100vw';
    this.elem.container.style.height = '100vh';
    this.elem.wrapper.appendChild(this.elem.container);

    this.elem.title.style.position = 'fixed';
    this.elem.wrapper.appendChild(this.elem.title);

    super.removeFromLaptop();
  }

}

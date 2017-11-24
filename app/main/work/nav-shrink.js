import NavigationBase from '../navigation/anim-base';

export default class WorkNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    // Add objects to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('work-wrapper'),
      container: document.querySelector('#work-wrapper .container'),
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
    this.elem.laptopContent('work').appendChild(this.elem.container);

    super.putInLaptop();
  }

  removeFromLaptop() {
    this.elem.container.style.position = 'fixed';
    this.elem.container.style.top = this.elem.container.style.left = 0;
    this.elem.container.style.width = '100vw';
    this.elem.container.style.height = '100vh';
    this.elem.wrapper.appendChild(this.elem.container);

    super.removeFromLaptop();
  }
}

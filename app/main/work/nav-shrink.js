import NavigationBase from '../navigation/anim-base';

export default class WorkNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    this.hash = 'work';
    // Add objects to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('work-wrapper'),
      container: document.querySelector('#work-wrapper .container'),
      get text() {
        // Override after first call to ensure it consistently refers to the same element
        Object.defineProperty(this, 'text', { value: this.wrapper.getElementsByTagName('h1')[0] });
        return this.text;
      },
    });
  }

  scale(laptopScreenCoordinates, progress) {
    const translationNeeded = super.scale(laptopScreenCoordinates, progress)[0];

    this.elem.text.style.transform = [
      'translate(-50%, -50%)',
      `translateX(${NavigationBase.tween(0, translationNeeded.x, progress)}px)`,
      `translateY(${NavigationBase.tween(0, translationNeeded.y, progress)}px)`,
      `scale(${NavigationBase.tween(1, 0.5, progress)})`,
    ].join(' ');
  }

  putInLaptop() {
    super.putInLaptop();

    this.elem.text.style.position = 'absolute';
    this.elem.text.style.transform = 'translate(-50%, -50%) scale(0.5)';
    this.elem.text.style.animation = 'none';
    this.elem.laptopContent('work').appendChild(this.elem.text);
  }

  removeFromLaptop() {
    super.removeFromLaptop();

    this.elem.text.style.position = 'fixed';
    this.elem.wrapper.appendChild(this.elem.text);
  }
}

import NavigationBase from '../navigation/anim-base';

export default class AboutNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    this.hash = 'about';
    // Add objects to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('about-wrapper'),
      container: document.querySelector('#about-wrapper .container'),
    });
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
    this.elem.laptopContent('about').appendChild(this.elem.container);

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

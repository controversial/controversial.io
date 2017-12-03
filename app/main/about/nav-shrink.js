import NavigationBase from '../navigation/anim-base';

export default class AboutNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    this.hash = 'about';
    // Add objects to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('about-wrapper'),
      container: document.querySelector('#about-wrapper .container'),
      info: document.querySelector('#about-wrapper .info'),
      content: document.querySelector('#about-wrapper .content'),
    });

    this.fontSize = {
      content: 'calc(13px + .75vw)',
      info: '4vw',
    };
  }


  putInLaptop() {
    super.putInLaptop();
    // Calculate appropriate font size scale
    this.scaleX = this.elem.container.getBoundingClientRect().width / window.innerWidth;
    // Scale font sizes using CSS `calc`
    Object.entries(this.fontSize).forEach((pair) => {
      const [key, value] = pair;
      this.elem[key].style.fontSize = `calc(${value} * ${this.scaleX})`;
    });
  }


  removeFromLaptop() {
    super.removeFromLaptop();
    // Remove adjusted font sizes
    Array.from(Object.keys(this.fontSize)).forEach((n) => {
      this.elem[n].style.fontSize = '';
    });
  }
}

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
    super.putInLaptop();
  }


  removeFromLaptop() {
    super.removeFromLaptop();
  }
}

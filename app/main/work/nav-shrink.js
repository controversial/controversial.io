import NavigationBase from '../navigation/anim-base';

export default class WorkNavigationAnimation extends NavigationBase {
  constructor() {
    super();
    this.hash = 'work';
    // Add objects to this.elem
    Object.assign(this.elem, {
      wrapper: document.getElementById('work-wrapper'),
      container: document.querySelector('#work-wrapper .container'),
    });
  }

  putInLaptop() {
    super.putInLaptop();
  }

  removeFromLaptop() {
    super.removeFromLaptop();
  }
}

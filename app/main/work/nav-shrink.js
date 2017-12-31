/** @module WorkNavigationAnimation */

import NavigationBase from '../navigation/anim-base';

/**
 * A class implementing scale behavior for the Work page
 * @extends NavigationAnimationBase
 */
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
}

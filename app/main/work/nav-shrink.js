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
      background: document.querySelector('#work-wrapper .background'),
      tags: document.querySelector('#work-wrapper .tags'),
    });
  }

  scale(laptopScreenCoordinates, progress) {
    const scaleInfo = super.scale(laptopScreenCoordinates, progress);
    const [, scaleNeeded] = scaleInfo;

    const tagsScale = laptopScreenCoordinates.width / window.innerWidth;
    const targetTop = laptopScreenCoordinates.top + (scaleNeeded.y * this.elem.tags.offsetTop);
    const tagsTranslate = targetTop - this.elem.tags.offsetTop;


    const translate = NavigationBase.tween(0, tagsTranslate, progress);
    const scale = NavigationBase.tween(1, tagsScale, progress);
    // Store as attributes for use later
    this.elem.tags.dataset.translate = translate;
    this.elem.tags.dataset.scale = scale;
    this.elem.tags.style.transform = `translateX(-50%) translateY(${translate}px) scale(${scale})`;
  }

  putInLaptop() {
    super.putInLaptop();

    this.elem.tags.style.transform = `translateX(-50%) scale(${this.elem.tags.dataset.scale})`;
    this.elem.laptopContent('work').appendChild(this.elem.tags);

    document.getElementById('social-container').classList.remove('hidden');
  }

  removeFromLaptop() {
    super.removeFromLaptop();

    this.elem.wrapper.appendChild(this.elem.tags);

    document.getElementById('social-container').classList.add('hidden');
  }
}

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
      carousel: document.querySelector('#work-wrapper .projects-container'),
    });
  }

  scale(laptopScreenCoordinates, progress) {
    const scaleInfo = super.scale(laptopScreenCoordinates, progress);
    const [, scaleNeeded] = scaleInfo;

    const targetScale = laptopScreenCoordinates.width / window.innerWidth;
    const scale = NavigationBase.tween(1, targetScale, progress);

    const targetTagsTop = laptopScreenCoordinates.top + (scaleNeeded.y * this.elem.tags.offsetTop);
    const targetTagsTranslate = targetTagsTop - this.elem.tags.offsetTop;
    const tagsTranslate = NavigationBase.tween(0, targetTagsTranslate, progress);
    // Store as attributes for use later
    this.elem.tags.dataset.translate = tagsTranslate;
    this.elem.tags.dataset.scale = scale;
    this.elem.tags.style.transform = `translateX(-50%) translateY(${tagsTranslate}px) scale(${scale})`;

    const targetCarouselY = laptopScreenCoordinates.top + (laptopScreenCoordinates.height / 2);
    const targetCarouselTranslate = targetCarouselY - (window.innerHeight / 2);
    const carouselTranslate = NavigationBase.tween(0, targetCarouselTranslate, progress);
    this.elem.carousel.dataset.translate = carouselTranslate;
    this.elem.carousel.dataset.scale = scale;
    this.elem.carousel.style.transform = `translateY(${carouselTranslate}px) scale(${scale})`;
  }

  putInLaptop() {
    super.putInLaptop();

    this.elem.tags.style.transform = `translateX(-50%) scale(${this.elem.tags.dataset.scale})`;
    this.elem.laptopContent('work').appendChild(this.elem.tags);

    this.elem.carousel.style.transform = `scale(${this.elem.carousel.dataset.scale})`;
    this.elem.carousel.style.transformOrigin = '0 0';
    this.elem.carousel.style.left = this.elem.background.style.left;
    this.elem.laptopContent('work').appendChild(this.elem.carousel);
  }

  removeFromLaptop() {
    super.removeFromLaptop();

    this.elem.wrapper.appendChild(this.elem.tags);
    this.elem.carousel.style.transformOrigin = 'initial';
    this.elem.carousel.style.left = 0;
    this.elem.wrapper.appendChild(this.elem.carousel);
  }
}

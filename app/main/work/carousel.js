/** Represents a single project in the work carousel */
import Parallax3D from '../parallax';

export class CarouselCard {
  constructor(elem, tags) {
    this.elem = elem;
    this.elem.classList.add('carousel-card');
    // Move elem into a wrapper div
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'carousel-card-wrapper';
    this.elem.parentNode.insertBefore(this.wrapper, this.elem);
    this.wrapper.appendChild(this.elem);

    this.tags = tags || elem.dataset.tags.split(',').map(t => t.trim());
    this.title = elem.getElementsByTagName('h1')[0];

    this.parallax = new Parallax3D(this.elem);
  }
}

/** Collects and orchestrates multiple CarouselCards */
export class Carousel {
  constructor(cards) {
    this.cards = cards;
    this._position = 0;
  }

  get position() { return this._position; }
  set position(pos) {
    // Move
    this._position = pos;
  }
}

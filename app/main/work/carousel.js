/** Represents a single project in the work carousel */
export class CarouselCard {
  constructor(elem, tags) {
    this.elem = elem;
    this.tags = tags || elem.dataset.tags.split(',').map(t => t.trim());

    this.elem.classList.add('carousel-card');
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

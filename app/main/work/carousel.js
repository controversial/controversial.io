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
    this.titleElem = elem.getElementsByTagName('h1')[0];

    this.parallax = new Parallax3D(this.elem);


    // Title manipulation interface

    const _this2 = this;
    /**
     * Interface for updating styles on the title.
     * Examples:
     *   this.title.translate = '-10px'
     *   this.title.opacity = 0.5
     */
    this.title = {
      _apply() {
        _this2.titleElem.style.transform = `translateZ(25px) translateX(${this._translate})`;
        _this2.titleElem.style.opacity = this._opacity;
      },
      get translate() { return this._translate; },
      set translate(t) { this._translate = t; this._apply(); },
      get opacity() { return this._opacity; },
      set opacity(o) { this._opacity = o; this._apply(); },
    };
  }

  /**
   * Update the card wrapper's CSS in order to reflect changes that were made to its JS
   * representation.
   */
  _applyTransform() {
    this.wrapper.style.transform = [
      'translate(-50%, -50%)',
      `translateX(${this._translate})`,
    ].join(' ');
  }

  // Translation

  get translate() { return this._translate; }
  set translate(val) { this._translate = val; this._applyTransform(); }

  // Transition time

  get transitionTime() { return this._transitionTime; }
  set transitionTime(secs) {
    this._transitionTime = secs;
    this.wrapper.style.transition = `transform ${secs}s`;
    this.titleElem.style.transition = `transform ${secs}s, opacity ${secs}s`;
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

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

    this.carousel = undefined; // Will be set when added to a carousel
    this.transitionTime = this.baseTransitionTime = 0.5;
    this.parallax = new Parallax3D(this.elem);

    this.elem.addEventListener('click', () => {
      if (this.carousel) this.centerSelf();
    });


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

  setEnabled(enable = true) {
    const totalTime = this.transitionTime * 1000;
    const startTime = new Date();

    // Recursively adjust using setAnimationFrame until transitionTime is reached
    function step(parallax) {
      const timeElapsed = new Date() - startTime;
      // Still going
      if (timeElapsed < totalTime) {
        const progress = (timeElapsed / totalTime);
        if (enable) parallax.rotmax = progress * 10;
        else parallax.rotmax = (1 - progress) * 10;
        parallax.rotate();
        requestAnimationFrame(() => step(parallax));
      } else {
        parallax.rotmax = enable ? 10 : 0;
      }
    }
    step(this.parallax);
  }
  disable() { this.setEnabled(false); }
  enable() { this.setEnabled(true); }


  // Move the carousel so that this card is in the center
  centerSelf() {
    const thisIndex = this.carousel.cards.indexOf(this);
    if (this.carousel.position !== thisIndex) this.carousel.position = thisIndex;
  }
}

/** Collects and orchestrates multiple CarouselCards */
export class Carousel {
  constructor(cards) {
    this.cards = cards;
    this.cards.forEach((c) => { c.carousel = this; });
    this._position = 0;
    // Trigger immediate layout of cards
    this.position = this._position;

    window.addEventListener('keydown', (e) => {
      // Carousel left/right with arrow keys, but only if carousel is expanded.
      // Carousel is expanded when the parent is #work-wrapper, the parent is .screen if it's not
      const projectsContainer = document.getElementsByClassName('projects-container')[0];
      if (projectsContainer.parentNode.id === 'work-wrapper') {
        if (e.key === 'ArrowRight') this.right();
        if (e.key === 'ArrowLeft') this.left();
      }
    });
  }

  // Transition time logic

  get baseTransitionTime() {
    const answer = this.cards[0].baseTransitionTime;
    // Warn if not every card has the same baseTransitionTime
    if (!this.cards.every(card => card.baseTransitionTime === answer)) console.warn('Carousel.baseTransitionTime called but baseTransitionTime of cards is inconsistent');
    return answer;
  }
  get transitionTime() {
    const answer = this.cards[0].transitionTime;
    // Warn if not every card has the same transitionTime
    if (!this.cards.every(card => card.transitionTime === answer)) console.warn('Carousel.transitionTime called but transitionTime of cards is inconsistent');
    return answer;
  }
  set transitionTime(secs) {
    this.cards.forEach((c) => { c.transitionTime = secs; });
  }

  // Rearrange

  get position() { return this._position; }
  set position(pos) {
    const delta = Math.abs(this._position - pos);
    // mx + b
    this.transitionTime = ((0.5 * this.baseTransitionTime) * (delta - 1)) + this.baseTransitionTime;

    this.cards.forEach((card, index) => {
      const cardPosition = index - pos;
      const cardTranslation = `${48 * cardPosition}vw`;
      card.translate = cardTranslation;
      // Center card
      if (cardPosition === 0) {
        card.title.opacity = 1;
        card.title.translate = 0;
        card.enable();
      // Not center card
      } else {
        card.title.opacity = 0;
        card.title.translate = (pos > this._position) ? '5vw' : '-5vw';
        card.disable();
      }
    });

    this._position = pos;
  }

  get minIndex() { return 0; } // eslint-disable-line class-methods-use-this
  get maxIndex() { return this.cards.length - 1; }

  left() {
    if (this.position > this.minIndex) this.position -= 1;
  }
  right() {
    if (this.position < this.maxIndex) this.position += 1;
  }
}

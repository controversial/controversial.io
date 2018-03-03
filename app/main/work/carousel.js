/** Represents a single project in the work carousel */
import Parallax3D from '../parallax';


export class CarouselTag {
  constructor(elem) {
    this.elem = elem;
    this.name = elem.textContent;
    this.carousel = undefined; // Will be set when added to a carousel

    this.elem.addEventListener('click', () => this.select());
  }

  select() { if (this.carousel) this.carousel.filter(this); }
}


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
      if (this.carousel) {
        const thisIndex = this.carousel.cards.indexOf(this);
        if (this.carousel.position !== thisIndex) this.centerSelf();
        else this.toggleExpand();
      } else {
        this.toggleExpand();
      }
    });
    this.wrapper.addEventListener('scroll', () => this.scrollHandler());


    // Title manipulation interface

    const _this2 = this;
    /**
     * Interface for updating styles on the title.
     * Examples:
     *   this.title.translate = '-10px'
     *   this.title.opacity = 0.5
     */
    this.title = {
      _elem: _this2.titleElem,
      fadeInLeft() { this._elem.style.animationName = 'fadeInLeft'; },
      fadeInRight() { this._elem.style.animationName = 'fadeInRight'; },
      fadeOutLeft() { this._elem.style.animationName = 'fadeOutLeft'; },
      fadeOutRight() { this._elem.style.animationName = 'fadeOutRight'; },
    };
  }

  /**
   * Update the card wrapper's CSS in order to reflect changes that were made to its JS
   * representation.
   */
  _applyTransform() {
    this.wrapper.style.transform = [
      'translateX(-50%)',
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
    this.carousel.position = thisIndex;
  }

  // Bigger!
  expand() {
    // Prevents incorrect result when expanding and collapsing rapidly. Ensures that a pre-existing
    // timeout won't remove the expanded-x class after it's been added by this method.
    clearInterval(this._expansionTimeout);

    this.elem.classList.add('expanded-x');
    this.titleElem.style.animationName = 'down';
    this.disable();
    this._expansionTimeout = setTimeout(() => {
      this.elem.classList.add('expanded-y');
      this._expansionTimeout = setTimeout(() => { this.elem.style.maxHeight = 'none'; this.elem.classList.remove('expanded-y'); }, 500);
      document.getElementById('email').classList.add('hidden');
      window.nav.disableScrollBinding = true;
    }, 500);

    this.expanded = true;
    if (this.carousel) this.carousel.expanded(this);
  }
  collapse() {
    clearInterval(this._expansionTimeout);

    this.elem.style.maxHeight = '';
    this.elem.classList.add('expanded-y');
    setTimeout(() => this.elem.classList.remove('expanded-y'), 10);
    document.getElementById('email').classList.remove('hidden');
    window.nav.disableScrollBinding = false;

    this._expansionTimeout = setTimeout(() => {
      this.elem.classList.remove('expanded-x');
      this.titleElem.style.animationName = 'up';
      this.enable();
    }, 500);

    this.expanded = false;
    if (this.carousel) this.carousel.collapsed(this);
  }
  toggleExpand() {
    this[this.expanded ? 'collapse' : 'expand']();
  }

  fade() { this.elem.style.opacity = 0.5; }
  opacify() { this.elem.style.opacity = 1; }

  scrollHandler() {
    const transitionDistance = window.innerHeight / 10;
    const progress = Math.min(this.wrapper.scrollTop / transitionDistance, 1);

    const nav = document.getElementById('navigation');
    const tags = document.querySelector('.tags');
    nav.style.opacity = 0.5 * (1 - progress);
    tags.style.opacity = 1 - progress;
  }
}


/** Collects and orchestrates multiple CarouselCards */
export class Carousel {
  constructor(cards, tags) {
    this.tags = tags;
    this.tags.forEach((t) => { t.carousel = this; });
    this.cards = cards;
    this.cards.forEach((c) => { c.carousel = this; });

    this._position = 0;
    this.cards[this._position].title._elem.style.animationName = 'in';
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
    (async () => {
      const delta = Math.abs(this._position - pos);

      // Adjust transition time based on how many cards we're jumping
      const btt = this.baseTransitionTime;
      this.transitionTime = ((0.5 * btt) * ((delta || 1) - 1)) + btt;

      // If any card is open, collapse it and wait
      if (delta > 0 && typeof this.expandedIndex !== 'undefined') {
        this.cards[this.expandedIndex].collapse();
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Apply certain changes to each card
      this.cards.forEach((card, index) => {
        const cardPosition = index - pos;
        const oldPosition = index - this._position;
        // Calculate an offset based on position relative to any expanded card
        let cardOffset = 0;
        if (index > this.expandedIndex) cardOffset = 12.5;
        if (index < this.expandedIndex) cardOffset = -12.5;
        // Set translation
        const cardTranslation = `${(48 * cardPosition) + cardOffset}vw`;
        card.translate = cardTranslation;

        // Expand / disable cards based on whether they're centered
        if (cardPosition === 0 && !card.expanded) card.enable();
        else card.disable(); // Not center card

        // Apply animations to titles
        if (cardPosition === 0) { // Center card
          if (oldPosition < 0) card.title.fadeInLeft(); // coming from left
          if (oldPosition > 0) card.title.fadeInRight(); // coming from right
        } else if (oldPosition === 0) {
          if (cardPosition < 0) card.title.fadeOutLeft(); // going left
          if (cardPosition > 0) card.title.fadeOutRight(); // going right
        }
      });
      // Update internally-stored position tracker
      this._position = pos;
    })();
  }

  expanded(card) {
    this.expandedIndex = this.cards.indexOf(card);
    this.position = this.position; // Re-layout
    this.cards.forEach((c) => {
      if (c !== card) c.fade();
    });
  }
  collapsed() {
    this.expandedIndex = undefined;
    setTimeout(() => {
      this.position = this.position; // Re-layout
      this.cards.forEach(c => c.opacify());
    }, 500);
  }

  get minIndex() { return 0; } // eslint-disable-line class-methods-use-this
  get maxIndex() { return this.cards.length - 1; }

  left() {
    if (this.position > this.minIndex) this.position -= 1;
  }
  right() {
    if (this.position < this.maxIndex) this.position += 1;
  }

  filter(tag) {
    const cards = this.cards.filter(c => c.tags.includes(tag.name));
    console.log(cards);
  }
}

/** Represents a single project in the work carousel */
import Parallax3D from '../parallax';

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

export class CarouselTag {
  constructor(elem) {
    this.elem = elem;
    this.name = elem.textContent;
    this.carousel = undefined; // Will be set when added to a carousel
    this.selected = false;

    this.elem.addEventListener('click', () => this.toggle());
  }

  select() {
    this.selected = true;
    if (this.carousel) this.carousel.filter(this);
  }
  deselect() {
    if (this.selected) {
      this.selected = false;
      if (this.carousel) this.carousel.clearFilter();
    }
  }
  toggle() {
    this[this.selected ? 'deselect' : 'select']();
  }

  fade() { this.elem.classList.add('faded'); }
  opacify() { this.elem.classList.remove('faded'); }
}


export class CarouselCard {
  constructor(elem, tagNames) {
    this.elem = elem;
    this.elem.classList.add('carousel-card');
    // Move elem into a wrapper div
    this.wrapper = document.createElement('div');
    this.wrapper.className = 'carousel-card-wrapper';
    this.elem.parentNode.insertBefore(this.wrapper, this.elem);
    this.wrapper.appendChild(this.elem);

    this.tagNames = tagNames || elem.dataset.tags.split(',').map(t => t.trim());
    this.titleElem = elem.getElementsByTagName('h1')[0];

    this.carousel = undefined; // Will be set when added to a carousel
    this.hidden = false;
    this.transitionTime = this.baseTransitionTime = 0.5;
    this.parallax = new Parallax3D(this.elem);

    this.elem.addEventListener('click', () => this.clickHandler());
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
      display() { this._elem.className = 'in-initial'; },
      fadeIn() { this._elem.className = 'fade-in'; },
      fadeOut() { this._elem.className = 'fade-out'; },
      fadeInLeft() { this._elem.className = 'in-from-left'; },
      fadeInRight() { this._elem.className = 'in-from-right'; },
      fadeOutLeft() { this._elem.className = 'out-to-left'; },
      fadeOutRight() { this._elem.className = 'out-to-right'; },
      fadeOutTop() { this._elem.className = 'out-to-top'; },
      moveDown() { this._elem.className = 'down'; },
      moveUp() { this._elem.className = 'up'; },
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

    const existingRot = this.parallax.rotmax;
    const goal = enable ? 10 : 0;
    const changeNeeded = goal - existingRot;

    // Recursively adjust using setAnimationFrame until transitionTime is reached
    function step(parallax) {
      const timeElapsed = new Date() - startTime;
      // Still going
      if (timeElapsed < totalTime) {
        const progress = (timeElapsed / totalTime);
        parallax.rotmax = existingRot + (progress * changeNeeded);
        parallax.rotate();
        requestAnimationFrame(() => step(parallax));
      } else parallax.rotmax = goal;
    }
    step(this.parallax); // Start
  }
  disable() { this.setEnabled(false); }
  enable() { this.setEnabled(true); }

  hide() {
    this.hidden = true;
    this.elem.classList.add('hidden');
    // If this is centered
    const thisIndex = this.carousel.cards.indexOf(this);
    if (this.carousel.position === this.carousel.adjustIndex(thisIndex)) this.title.fadeOutTop();
  }
  show() {
    this.hidden = false;
    this.elem.classList.remove('hidden');
  }


  // Move the carousel so that this card is in the center
  centerSelf() {
    const thisIndex = this.carousel.cards.indexOf(this);
    this.carousel.position = this.carousel.adjustIndex(thisIndex);
  }

  // Bigger!
  expand() {
    // Prevents incorrect result when expanding and collapsing rapidly. Ensures that a pre-existing
    // timeout won't remove the expanded-x class after it's been added by this method.
    clearInterval(this._expansionTimeout);

    this.elem.classList.add('expanded-x');
    this.title.moveDown();
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
      this.title.moveUp();
      this.enable();
    }, 500);

    this.expanded = false;
    if (this.carousel) this.carousel.collapsed(this);
  }
  toggleExpand() {
    this[this.expanded ? 'collapse' : 'expand']();
  }

  fade() { if (!this.hidden) this.elem.style.opacity = 0.5; }
  opacify() { this.elem.style.opacity = ''; }

  clickHandler() {
    if (this.carousel && !this.hidden) {
      const i1 = this.carousel.cards.indexOf(this);
      const i2 = this.carousel.adjustIndex(i1);
      if (this.carousel.position !== i2) this.centerSelf();
      else this.toggleExpand();
    } else if (!this.hidden) {
      this.toggleExpand();
    }
  }

  scrollHandler() {
    const transitionDistance = window.innerHeight / 10;
    const progress = Math.min(this.wrapper.scrollTop / transitionDistance, 1);

    const nav = document.getElementById('navigation');
    const tags = document.querySelector('.tags');
    nav.style.opacity = 0.5 * (1 - progress);
    tags.style.opacity = 1 - progress;

    // Turn off pointer events when halfway faded
    nav.style.pointerEvents = tags.style.pointerEvents = progress < 0.5 ? '' : 'none';
  }
}


/** Collects and orchestrates multiple CarouselCards */
export class Carousel {
  constructor(cards, tags, emptyElem) {
    this.tags = tags;
    this.tags.forEach((t) => { t.carousel = this; });
    this.cards = cards;
    this.cards.forEach((c) => { c.carousel = this; });
    this.emptyElem = emptyElem;
    this.hiddenIndices = [];

    this._position = 0;
    this.cards[this._position].title.display();
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

  // Adjust an index based on the number of hidden cards that come before it
  adjustIndex(index) {
    return index - this.hiddenIndices.filter(i => i < index).length;
  }

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
        await delay(1000);
      }

      // Apply certain changes to each card
      this.cards.forEach((card, index) => {
        const adj = i => this.adjustIndex(i);
        // Calculate position we're going to, and parse old position from old transform
        const cardPosition = adj(index) - pos;
        const oldTranslation = (card.translate || `${index * 48}vw`).slice(0, -2);
        const oldPosition = [
          oldTranslation / 48, // Could be in its normal location
          (oldTranslation - 12.5) / 48, // Could be to the right of an expanded card
          (oldTranslation + 12.5) / 48, // Could be to the left of an expanded card
        ].find(i => Math.floor(i) === i); // Whichever case yields an integer solution for position
        // Calculate an offset based on position relative to any expanded card
        let cardOffset = 0;
        if (adj(index) > adj(this.expandedIndex)) cardOffset = 12.5;
        if (adj(index) < adj(this.expandedIndex)) cardOffset = -12.5;
        // Set new translation
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
  get maxIndex() { return Math.max(this.cards.length - this.hiddenIndices.length - 1, 0); }

  left() {
    if (this.position > this.minIndex) this.position -= 1;
  }
  right() {
    if (this.position < this.maxIndex) this.position += 1;
  }

  async filter(tag) {
    tag.opacify();
    this.tags.filter(t => t !== tag).forEach((t) => { t.selected = false; t.fade(); });
    const cardsToRemove = this.cards.filter(c => !c.tagNames.includes(tag.name));
    // If the expanded card needs to be hidden, collapse it first
    if (typeof this.expandedIndex !== 'undefined') {
      this.cards[this.expandedIndex].collapse();
      await delay(1000);
    }
    // Make sure the empty indicator isn't displayed if it shouldn't be
    if (cardsToRemove.length < this.cards.length) this.emptyElem.classList.remove('displayed');

    const selectedCard = this.cards.filter(c => !c.hidden)[this.position];
    // Hide cards
    cardsToRemove.forEach(c => c.hide()); // Play removed animation on affected cards
    if (cardsToRemove.length) await delay(1000);
    // Minimal movement (first non-hidden card after previously selected card)
    const newCard = this.cards.slice(this.cards.indexOf(selectedCard)).find(c => !c.hidden);
    // Re-layout
    this.hiddenIndices = cardsToRemove.map(c => this.cards.indexOf(c));
    this.position = this.adjustIndex(Math.max(this.cards.indexOf(newCard), 0));
    // Show message if no cards are displayed
    if (this.hiddenIndices.length === this.cards.length) this.emptyElem.classList.add('displayed');
    // Show non-hidden cards
    await delay(500);
    this.cards.filter(c => !cardsToRemove.includes(c)).forEach(c => c.show());
  }

  async clearFilter() {
    this.tags.forEach(t => t.opacify());
    if (this.hiddenIndices.length) {
      // Collapse all cards
      if (typeof this.expandedIndex !== 'undefined') {
        this.cards[this.expandedIndex].collapse();
        await delay(1000);
      }
      // Adjust position to prevent shift when showing cards, unless EVERY card is hidden
      let newPos;
      if (this.hiddenIndices.length !== this.cards.length) {
        newPos = this.position + this.hiddenIndices.filter(i => i <= this.position).length;
      } else {
        newPos = this.position;
      }
      // Hide 'No projects found' message
      this.emptyElem.classList.remove('displayed');
      // Re-layout assuming no cards are hidden
      this.hiddenIndices = [];
      this.position = newPos;
      await delay(500);
      // Actually visually reveal the previously hidden cards
      this.cards.forEach(c => c.show());
    }
  }
}

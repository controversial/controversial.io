// Convert an element into a 3D laptop, moving its contents into the screen.

window.sassLengthVariable = 30;
window.sassWidthVariable = (window.sassLengthVariable / 3) * 2;

class Laptop {
  static get defaultLidAngle() { return 100; }

  constructor(elem, index, dummy = false) {
    this.elem = elem;
    this.index = index;
    this.dummy = dummy;

    this._translateX = this._translateY = this._translateZ = 0;
    this._rotateX = this._rotateY = this._rotateZ = 0;
    this._lidAngle = Laptop.defaultLidAngle;
    this._transitionTime = 0;

    this.elem.classList.add('laptop3d');
    if (this.dummy) this.elem.classList.add('dummy');
    if (typeof this.index !== 'undefined') this.elem.setAttribute('data-laptop3d-index', this.index);

    const children = [...this.elem.childNodes];
    this.elem.innerHTML = `
      <div class="wrapper">
        <div class="base"><div class="front"></div></div>
        <div class="lid">
          <div class="front">
            <div class="screen"></div>
          </div>
          <div class="back"></div>
        </div>
      </div>
    `;
    // Record some common elements as properties
    ['wrapper', 'base', 'lid', 'screen'].forEach((name) => {
      this[name] = this.elem.getElementsByClassName(name)[0];
    });
    // Add all former children to the new screen element
    children.forEach(child => this.screen.appendChild(child));

    if (!this.dummy) {
      // Lift up a bit on hover
      const performWithTransitionTime = (func, time) => {
        const oldTime = this.transitionTime; this.transitionTime = time;
        func();
        setTimeout(() => { this.transitionTime = oldTime; }, this.transitionTime);
      };
      this.wrapper.addEventListener('mouseenter', () => performWithTransitionTime(() => { this.translateZ = '1vw'; }, 0.25));
      this.wrapper.addEventListener('mouseleave', () => performWithTransitionTime(() => { this.translateZ = 0; }, 0.25));

      // Center self on click
      this.wrapper.addEventListener('click', () => this.centerSelf());
    }

    this._applyTransform();
  }

  centerSelf() {
    if (this.carousel) {
      const largerScreenDimension = Math.max(window.innerWidth, window.innerHeight);
      const start = document.getElementsByClassName('laptops-stretcher')[0].offsetTop;
      const end = start + (largerScreenDimension * 1.5);
      /*
        This equation found by solving equation in scroll.js for 'scroll'

        Initial equation from scroll.js for calculating position based on scroll:
                 scroll - start
          pos = ————————————————  *  carousel.maxIndex
                  end - start

        Rearranged equation for solving for scroll based on position:
          scroll = pos ÷ carousel.maxIndex * (end - start) + start
      */
      const scroll = ((this.index / this.carousel.maxIndex) * (end - start)) + start;
      window.scrollTo({ top: scroll, behavior: 'smooth' });
    }
  }

  _applyTransform() {
    this.wrapper.style.transform = [
      `rotateX(${this._rotateX})`,
      `rotateY(${this._rotateY})`,
      `rotateZ(${this._rotateZ})`,
      `translateX(${this._translateX})`,
      `translateY(${this._translateY})`,
      `translateZ(${this._translateZ})`,
    ].join(' ');
    this.lid.style.transform = `translateY(-${window.sassWidthVariable * 2}vw) rotateX(${-180 + this._lidAngle}deg)`;
  }


  // Translation

  get translateX() { return this._translateX; }
  get translateY() { return this._translateY; }
  get translateZ() { return this._translateZ; }

  set translateX(val) { this._translateX = val; this._applyTransform(); }
  set translateY(val) { this._translateY = val; this._applyTransform(); }
  set translateZ(val) { this._translateZ = val; this._applyTransform(); }

  // Rotation
  get rotateX() { return this._rotateX; }
  get rotateY() { return this._rotateY; }
  get rotateZ() { return this._rotateZ; }

  _setRotate(axis, val) {
    if (!['X', 'Y', 'Z'].includes(axis)) throw new Error('Axis must be one of X Y or Z'); // val must be XYZ
    const prop = `_rotate${axis}`; // Property that we're setting
    if (typeof val === 'string' && val.endsWith('deg')) this[prop] = val; // Don't change if the value is already a string ending in 'deg'
    else this[prop] = `${val}deg`; // Otherwise add the 'deg' suffix
    this._applyTransform();
  }
  set rotateX(val) { this._setRotate('X', val); }
  set rotateY(val) { this._setRotate('Y', val); }
  set rotateZ(val) { this._setRotate('Z', val); }

  // Lid
  get lidAngle() { return this._lidAngle; }
  set lidAngle(val) { this._lidAngle = val; this._applyTransform(); }

  // Transition time
  get transitionTime() { return this._transitionTime; }
  set transitionTime(secs) {
    this._transitionTime = secs;
    this.wrapper.style.transition = `transform ${secs}s`;
    this.lid.style.transition = `transform ${secs}s`;
  }
}


class LaptopCarousel {
  static get rotLimit() { return 75; }

  constructor(container, laptops) {
    this.container = container;
    this.laptops = laptops;
    // Sort by index
    this.laptops.sort((a, b) => a.index - b.index);
    // Check that there are no overlapping indices
    const indices = this.laptops.map(l => l.index);
    if (indices.length !== new Set(indices).size) throw new Error('LaptopCarousel indices must be unique');
    // Record this as the carousel for each laptop
    laptops.forEach((l) => { l.carousel = this; });
    // Build map of laptops by index
    this.laptopsByIndex = {};
    laptops.forEach((l) => { this.laptopsByIndex[l.index] = l; });

    this.position = 0;
  }

  // All indices represented
  get indices() { return this.laptops.map(l => l.index); }
  // Minimum index represented
  get minIndex() { return Math.min(...this.indices); }
  // Maximum index represented
  get maxIndex() { return Math.max(...this.indices); }

  // Force a number to be inside (-rotLimit, rotLimit)
  static boundRotation(rot) {
    const sign = Math.sign(rot);
    return sign * Math.min(Math.abs(rot), LaptopCarousel.rotLimit);
  }

  // Each 1 position value represents centering the next laptop. Position x will result in the
  // the laptop with index x being centered
  get position() { return this._position; }
  set position(pos) {
    const offsetAngle = 30; // Laptops are 30 degrees from eachother
    this._position = pos;
    // Sometimes laptops accidentally still have transitions on from a hover. This causes them to
    // lag behind while other laptops move normally, which looks horrible.
    this.setTransitionTime(0);
    this.laptops.forEach((laptop) => {
      const initialRot = laptop.index * -offsetAngle; // Basic laptop rotation
      // Adjust laptop rotation given carousel position
      const finalRot = initialRot + (this.position * offsetAngle);
      laptop.rotateZ = LaptopCarousel.boundRotation(finalRot);
      // Adjust lid closed given carousel position. Lid starts closing when position is 0.5 away
      // from the center and becomes fully closed when position is 1.5 away from the center.
      const distFromCenter = Math.abs(laptop.index - this.position);
      const closedAmount = Math.max(Math.min(distFromCenter - 0.25, 1), 0);
      laptop.lidAngle = (1 - closedAmount) * 100;
    });
  }

  setTransitionTime(secs) {
    this.laptops.forEach((l) => { l.transitionTime = secs; });
  }
}

window.Laptop = Laptop;
window.LaptopCarousel = LaptopCarousel;

// Set up laptop scene
window.setupLaptops = () => {
  // Convert all elements with the class 'laptop3d' into laptops
  const laptopsContainer = document.getElementsByClassName('laptops-container')[0];
  const laptopElems = [...laptopsContainer.getElementsByClassName('laptop3d')];
  const laptops = laptopElems.map((l, i) => new Laptop(l, i));

  window.carousel = new LaptopCarousel(laptopsContainer, laptops);
};

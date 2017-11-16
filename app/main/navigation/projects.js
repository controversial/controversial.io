// Convert an element into a 3D laptop, moving its contents into the screen.

window.sassLengthVariable = 30;
window.sassWidthVariable = (window.sassLengthVariable / 3) * 2;
window.sassHeightVariable = (window.sassLengthVariable / 50);

export class Laptop {
  static get defaultLidAngle() { return 100; }

  constructor(elem, index) {
    this.elem = elem;
    this.index = index;
    this.hash = this.elem.getAttribute('data-laptop3d-hash');

    this._translateX = this._translateY = this._translateZ = 0;
    this._rotateX = this._rotateY = this._rotateZ = 0;
    this._lidAngle = Laptop.defaultLidAngle;
    this._transitionTime = 0.25;

    this.elem.classList.add('laptop3d');
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

    // Lift up a bit on hover
    this.wrapper.addEventListener('mouseenter', () => { this.translateZ = '1vw'; }, 0.25);
    this.wrapper.addEventListener('mouseleave', () => { this.translateZ = 0; }, 0.25);

    // Center self on click
    this.wrapper.addEventListener('click', () => this.centerSelf());

    this._applyTransform();
  }

  centerSelf() {
    if (this.carousel) this.carousel.position = this.index;
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


export class LaptopCarousel {
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
    // Set up keybindings
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.right();
      if (e.key === 'ArrowLeft') this.left();
    });

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

  left() {
    if (this.position > this.minIndex) this.position -= 1;
  }
  right() {
    if (this.position < this.maxIndex) this.position += 1;
  }

  setTransitionTime(secs) {
    this.laptops.forEach((l) => { l.transitionTime = secs; });
  }

  addLaptop(laptop) {
    // Prevent index overlap
    if (this.indices.includes(laptop.index)) throw new Error(`A laptop with index ${laptop.index} is already present`);
    // Add to laptops array and re-sort
    this.laptops.push(laptop);
    this.laptops.sort((a, b) => a.index - b.index);
    // Record in laptopsByIndex object
    this.laptopsByIndex[laptop.index] = laptop;
  }

  removeLaptop(laptop) {
    // Remove from laptopsByIndex
    this.laptopsByIndex[laptop.index] = undefined;
    // Remove from laptops array. Array will still be sorted after removal
    if (this.laptops.indexOf(laptop) !== -1) this.laptops.splice(this.laptops.indexOf(laptop), 1);
  }
}
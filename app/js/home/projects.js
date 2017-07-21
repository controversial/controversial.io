// Convert an element into a 3D laptop, moving its contents into the screen.


class Laptop {
  constructor(elem, index, dummy = false) {
    this.elem = elem;
    this.index = index;
    this.dummy = dummy;

    this._translateX = this._translateY = this._translateZ = 0;
    this._rotateX = this._rotateY = this._rotateZ = 0;
    this._lidAngle = 90;

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

    // Transform
    this.elem.style.transform = `translateX(50vw) translateX(-50%) rotateX(80deg) rotateZ(45deg) translateX(${30 * this.index}vw)`;

    // Lift up a bit on hover
    if (!this.dummy) {
      this.elem.addEventListener('mouseenter', () => { this.rotateZ = -90; });
      this.elem.addEventListener('mouseleave', () => { this.rotateZ = 0; });
    }

    this._applyTransform();
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
    this.lid.style.transform = `translateY(-33.333333vw) rotateX(${-180 + this._lidAngle}deg)`;
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

}


class LaptopCarousel {
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
  }

  // All indices represented
  get indices() { return this.laptops.map(l => l.index); }
  // Minimum index represented
  get minIndex() { return Math.min(...this.indices); }
  // Maximum index represented
  get maxIndex() { return Math.max(...this.indices); }

  scroll(progress) {
    this.progress = progress;
  }
}

// Set up laptop scene
document.addEventListener('DOMContentLoaded', () => {
  // Convert all elements with the class 'laptop3d' into laptops
  const laptopsContainer = document.getElementsByClassName('laptops-container')[0];
  const laptopElems = [...laptopsContainer.getElementsByClassName('laptop3d')];
  const laptops = laptopElems.map((l, i) => new Laptop(l, i));
  // Add 10 dummy laptops to the beginning
  const dummyLaptops = new Array(10)
    .fill(0)
    .map(() => document.createElement('div'))
    .map(l => laptopsContainer.appendChild(l))
    .map((l, i) => new Laptop(l, -(i + 1), true));

  window.carousel = new LaptopCarousel(laptopsContainer, laptops.concat(dummyLaptops));
});

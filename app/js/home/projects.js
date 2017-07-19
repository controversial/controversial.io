// Convert an element into a 3D laptop, moving its contents into the screen.


class Laptop {
  constructor(elem, index, dummy = false) {
    this.elem = elem;
    this.index = index;
    this.dummy = dummy;

    this._translateX = this._translateY = this._translateZ = 0;
    this._rotateX = '80deg'; this._rotateY = 0; this._rotateZ = '45deg';

    this.elem.classList.add('laptop3d');
    if (this.dummy) this.elem.classList.add('dummy');
    if (this.index) this.elem.setAttribute('data-laptop3d-index', this.index);

    const children = [...this.elem.childNodes];
    this.elem.innerHTML = `
      <div class="base"></div>
      <div class="lid">
        <div class="front">
          <div class="screen"></div>
        </div>
        <div class="back"></div>
      </div>
    `;
    // Record some common elements as properties
    ['base', 'lid', 'screen'].forEach((name) => {
      this[name] = this.elem.getElementsByClassName(name)[0];
    });
    // Add all former children to the new screen element
    children.forEach(child => this.screen.appendChild(child));

    // Transform
    this._translateX = `${30 * this.index}vw`;

    // Lift up a bit on hover
    if (!this.dummy) {
      this.elem.addEventListener('mouseenter', () => { this.translateZ = '1vw'; });
      this.elem.addEventListener('mouseleave', () => { this.translateZ = 0; });
    }

    this._applyTransform();
  }

  // Allow getting and setting transformation properties individually
  _applyTransform() {
    this.elem.style.transform = [
      `rotateX(${this._rotateX})`,
      `rotateY(${this._rotateY})`,
      `rotateZ(${this._rotateZ})`,
      `translateX(${this._translateX})`,
      `translateY(${this._translateY})`,
      `translateZ(${this._translateZ})`,
    ].join(' ');
  }

  get translateX() { return this._translateX; }
  get translateY() { return this._translateY; }
  get translateZ() { return this._translateZ; }
  get rotateX() { return this._rotateX; }
  get rotateY() { return this._rotateY; }
  get rotateZ() { return this._rotateZ; }

  set translateX(val) { this._translateX = val; this._applyTransform(); }
  set translateY(val) { this._translateY = val; this._applyTransform(); }
  set translateZ(val) { this._translateZ = val; this._applyTransform(); }

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
});

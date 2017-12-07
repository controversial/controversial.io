// Convert an element into a 3D laptop, moving its contents into the screen.

import { sneakyHashChange } from '../helpers';
import { Navigation } from '.';

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
    this._transitionTime = 0.3;

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
    this.wrapper.addEventListener('mouseenter', () => { this.translateZ = '1vw'; });
    this.wrapper.addEventListener('mouseleave', () => { this.translateZ = 0; });

    // Center self or close navigation on click
    this.wrapper.addEventListener('click', () => {
      if (this.carousel) {
        if (this.index !== this.carousel.position) this.centerSelf();
        else if (this.carousel.navigation) this.carousel.navigation.close();
      }
    });

    this._applyTransform();
  }

  centerSelf() {
    return new Promise((resolve) => {
      if (this.carousel && this.index !== this.carousel.position) {
        this.carousel.position = this.index;
        setTimeout(resolve, this.transitionTime * 1000);
      } else resolve();
    });
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
  // Promise versions
  _setRotatePromise(axis, val) {
    return new Promise((resolve) => {
      this._setRotate(axis, val);
      setTimeout(resolve, this.transitionTime * 1000);
    });
  }
  setRotateX(val) { return this._setRotatePromise('X', val); }
  setRotateY(val) { return this._setRotatePromise('Y', val); }
  setRotateZ(val) { return this._setRotatePromise('Z', val); }


  // Lid

  get lidAngle() { return this._lidAngle; }
  set lidAngle(val) { this._lidAngle = val; this._applyTransform(); }
  setLidAngle(val) { // promise version
    return new Promise((resolve) => {
      this.lidAngle = val;
      setTimeout(resolve, this.transitionTime * 1000);
    });
  }


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

  constructor(container, laptops, navigation) {
    this.container = container;
    this.laptops = laptops;
    this.navigation = navigation; // passing a Navigation instance is optional
    this.offsetAngle = 30; // Laptops are 30 degrees from eachother
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

    if (this.navigation) this._position = this.getLaptopWithHash(Navigation.hash).index;
    else this._position = 0;
    // Trigger immediate layout of laptops
    this.position = this._position;

    this.shouldPushState = false;
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
    (async () => {
      // Wait for safe to animate if this is part of a Navigation
      if (this.navigation) {
        await this.navigation.safeToAnimate; // Wait for it to be safe to animate
        this.navigation.animationStarted(); // Register that an animation is in progress
      }

      this.laptops.forEach((laptop) => { laptop.translateZ = 0; });
      // Close laptops
      const lidsClosed = this.laptops.map(laptop => laptop.setLidAngle(0));
      await Promise.all(lidsClosed); // Wait for all to close

      // Update internal position value
      const delta = Math.abs(this._position - pos);
      this._position = pos;

      // Navigation things
      sneakyHashChange(this.laptopsByIndex[pos].hash, this.shouldPushState); // change URL hash
      Navigation.navBarUpdate(); // Change top bar appearance
      // Reset shouldPushState (should only push once until explicitly set to push again)
      if (this.shouldPushState) this.shouldPushState = false;

      // Rotate laptops
      const oldTransitionTime = this.laptops[0].transitionTime;
      const rotations = this.laptops.map((laptop) => {
        const baseRot = laptop.index * -this.offsetAngle; // laptop rotation when position is 0
        const finalRot = baseRot + (this.position * this.offsetAngle); // Adjust for position
        laptop.transitionTime = (1 + ((delta - 1) * 0.5)) * oldTransitionTime;
        return laptop.setRotateZ(LaptopCarousel.boundRotation(finalRot)); // Set rotation
      });
      await Promise.all(rotations); // Wait for all to rotate
      this.laptops.forEach((laptop) => { laptop.transitionTime = oldTransitionTime; });

      if (this.position in this.laptopsByIndex) {
        await this.laptopsByIndex[this.position].setLidAngle(100);
      }

      this.navigation.animationFinished();
    })();
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

  getLaptopWithHash(hash) {
    return this.laptops.filter(n => n.hash === hash)[0];
  }
}

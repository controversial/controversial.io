/** @module Parallax3D */

/** An effect that will rotate a scene in 3D based on mouse position, using CSS transforms */
export default class Parallax3D {
  /**
   * Initialize
   * @param {HTMLElement} element - the element to be rotated. This should contain children with
   * varying 3D transformations so that a 3D parallax effect is created.
   * @param {String} initialTransform - the CSS transformations to be preserved on the object when
   * 3D transformation is adjusted.
   */
  constructor(element, initialTransform = '', rotmax = 10) {
    this.elem = element;
    this.initialTransform = initialTransform;
    this.rotmax = rotmax;

    this.mousePos = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => { this.mouse(e); this.rotate(); });
  }


  /**
   * Update internal storage of mouse position based on a mouse event. Mouse position is stored as
   * an object `{ x: xpos, y: ypos }` where xpos and ypos are both values in the range [-1, 1] and
   * (0, 0) is the center of the screen.
   * @param {MouseEvent} e - passed from the event listener
   */
  mouse(e) {
    const w = window.innerWidth; const h = window.innerHeight;
    const halfw = w / 2; const halfh = h / 2;
    const x = e.clientX; const y = e.clientY;
    const finalx = (x - halfw) / halfw; const finaly = (y - halfh) / halfh;
    [this.mousePos.x, this.mousePos.y] = [finalx, finaly];
  }


  get rotation() {
    return [
      `rotateX(${this.mousePos.y * this.rotmax}deg)`,
      `rotateY(${this.mousePos.x * this.rotmax}deg)`,
    ];
  }

  /** Adjust 3D rotation based on the values stored in `this.mousePos` */
  rotate() {
    if (!this.disabled) {
      this.elem.style.transform = [
        this.initialTransform,
        ...this.rotation,
      ].join(' ');
    }
  }


  /** Interrupt changes to rotation */
  disable() {
    this.disabled = true;
  }
  /** Resume changes to rotation */
  enable() {
    this.disabled = false;
  }
}

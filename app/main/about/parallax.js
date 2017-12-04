export default class Parallax3D {

  constructor(element, initialTransform) {
    this.elem = element;
    this.initialTransform = initialTransform;
    this.rotmax = 10;

    window.addEventListener('mousemove', e => this.update(e));
  }


  /** Get mouse coordinates on the screen in range [-1, 1] */
  static getMouse(e) {
    const w = window.innerWidth; const h = window.innerHeight;
    const halfw = w / 2; const halfh = h / 2;
    const x = e.clientX; const y = e.clientY;
    const finalx = (x - halfw) / halfw; const finaly = (y - halfh) / halfh;
    return [finalx, finaly];
  }


  /** Adjust rotation based on values from -1 to 1 */
  rotate(rotx, roty) {
    this.elem.style.transform = [
      this.initialTransform,
      `rotateX(${rotx * this.rotmax}deg)`,
      `rotateY(${roty * this.rotmax}deg)`,
    ].join(' ');
  }


  /** Update rotation from a mouse event */
  update(e) {
    // Flip mouse position and rotate by that amount
    this.rotate(...Parallax3D.getMouse(e).map(n => -n).reverse());
  }
}

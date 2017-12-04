export default class Parallax3D {

  constructor(element, initialTransform) {
    this.elem = element;
    this.initialTransform = initialTransform;
    this.rotmax = 10;

    this.mousePos = { x: 0, y: 0 };
    window.addEventListener('mousemove', (e) => { this.mouse(e); this.rotate(); });
  }


  mouse(e) {
    const w = window.innerWidth; const h = window.innerHeight;
    const halfw = w / 2; const halfh = h / 2;
    const x = e.clientX; const y = e.clientY;
    const finalx = (x - halfw) / halfw; const finaly = (y - halfh) / halfh;
    [this.mousePos.x, this.mousePos.y] = [finalx, finaly];
  }


  /** Adjust rotation based on values from -1 to 1 */
  rotate() {
    if (!this.disabled) {
      this.elem.style.transform = [
        this.initialTransform,
        `rotateX(${-this.mousePos.y * this.rotmax}deg)`,
        `rotateY(${-this.mousePos.x * this.rotmax}deg)`,
      ].join(' ');
    }
  }


  disable() {
    this.disabled = true;
  }
  enable() {
    this.disabled = false;
  }
}

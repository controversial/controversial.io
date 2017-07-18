// Convert an element into a 3D laptop, moving its contents into the screen.


class Laptop {
  constructor(elem, index, dummy = false) {
    this.elem = elem;
    this.index = index;
    this.dummy = dummy;

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
    console.log(`${getComputedStyle(this.elem).transform} translateX(${30 * this.index})vw`);
    this.elem.style.transform = `${getComputedStyle(this.elem).transform} translateX(${30 * this.index}vw)`;

    // Lift up a bit on hover
    if (!this.dummy) {
      this.elem.addEventListener('mouseenter', () => {
        elem.style.transform += ' translateZ(1vw)';
      });

      this.elem.addEventListener('mouseleave', () => {
        elem.style.transform = elem.style.transform.replace(' translateZ(1vw)', '');
      });
    }
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
});

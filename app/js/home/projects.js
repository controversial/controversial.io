// Convert an element into a 3D laptop, moving its contents into the screen.

function laptopify(elem, index) {
  elem.classList.add('laptop3d'); // All the elements on which this is run already have this class, but this adds flexibility to use the method on other elements
  elem.setAttribute('data-laptop3d-index', index);
  const children = [...elem.childNodes];
  elem.innerHTML = `
    <div class="base"></div>
    <div class="lid">
      <div class="front">
        <div class="screen"></div>
      </div>
      <div class="back"></div>
    </div>
  `;
  const screen = elem.getElementsByClassName('screen')[0];
  for (let i = 0; i < children.length; i += 1) {
    screen.appendChild(children[i]);
  }
  // Add offset (translateX)
  elem.style.transform = `${getComputedStyle(elem).transform} translateX(${30 * index}vw)`;

  // Lift up a bit on hover
  elem.addEventListener('mouseenter', () => {
    elem.style.transform += ' translateZ(1vw)';
  });
  elem.addEventListener('mouseleave', () => {
    elem.style.transform = elem.style.transform.replace(' translateZ(1vw)', '');
  });
}


// Convert all elements with the class 'laptop3d' into laptops
document.addEventListener('DOMContentLoaded', () => {
  const laptops = document.getElementsByClassName('laptop3d');
  for (let i = 0; i < laptops.length; i += 1) {
    laptopify(laptops[i], i);
  }
});

// Convert an element into a 3D laptop, moving its contents into the screen.

function laptopify(elem) {
  elem.classList.add('laptop3d');
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
}


// Convert all elements with the class 'laptop3d' into laptops
document.addEventListener('DOMContentLoaded', () => {
  const laptops = document.getElementsByClassName('laptop3d');
  for (let i = 0; i < laptops.length; i += 1) {
    laptopify(laptops[i]);
  }
});

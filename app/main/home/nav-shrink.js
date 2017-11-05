// Behavior for the 'shrink into laptop' animation for the home page
import { tween, getCenter, elem as elem2 } from '../navigation-anim';

const elem = {
  wrapper: document.getElementById('home-wrapper'),
  container: document.querySelector('#home-wrapper .container'),
  // This property is computed based on a previously-defined property, so it has to be in a getter,
  // but for stability it is made into a normal property after its first call, so the getter is only
  // run once.
  get title() {
    // Override after first call to ensure it consistently refers to the same element
    Object.defineProperty(this, 'title', { value: this.wrapper.getElementsByTagName('h1')[0] });
    return this.title;
  },
  get canvas() { return window.gol.elem; },
};


export function scale(laptopScreenCoordinates, progress) {
  // 1. Fit container to laptop screen

  // Establish starting and ending positions for page
  const w = window.innerWidth; const h = window.innerHeight;
  const posA = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
  const posB = laptopScreenCoordinates;
  // Calculate translation needed
  // (Center is used for calculating translation because element is scaled about the center)
  const centerA = getCenter(posA);
  const centerB = getCenter(posB);
  const translationNeeded = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
  // Calculate scale
  const scaleNeeded = { x: posB.width / posA.width, y: posB.height / posA.height };
  // Apply transformations
  elem.container.style.transform = [
    // Translate
    `translateX(${tween(0, translationNeeded.x, progress)}px)`,
    `translateY(${tween(0, translationNeeded.y, progress)}px)`,
    // Scale
    `scaleX(${tween(1, scaleNeeded.x, progress)})`,
    `scaleY(${tween(1, scaleNeeded.y, progress)})`,
  ].join(' ');

  // 2. Fit name to laptop screen

  elem.title.style.transform = [
    'translate(-50%, -50%)',
    `translateX(${tween(0, translationNeeded.x, progress)}px)`,
    `translateY(${tween(0, translationNeeded.y, progress)}px)`,
    `scale(${tween(1, 0.5, progress)})`,
  ].join(' ');

  // 3. Adjust canvas settings

  const canvasRect = elem.canvas.getBoundingClientRect();
  // How much canvas has been downscaled overall? Averages X and Y scale factors to get a holistic
  // scale factor
  const horizontalScaleFactor = (canvasRect.width / w);
  const verticalScaleFactor = (canvasRect.height / h);
  const averageScaleFactor = (horizontalScaleFactor + verticalScaleFactor) / 2;
  window.gol.idealCellSize = 20 * averageScaleFactor;
  window.gol.needsSizeUpdate = true;
}


export function putInLaptop() {
  elem.container.style.position = 'absolute';
  elem.container.style.transform = '';
  // This should be easy but Blink insists on rendering .front behind .back if I give
  // position: relative to .screen, so .container has to be manually positioned relative to .front
  const screenBezel = window.sassHeightVariable * 0.85;
  elem.container.style.top = elem.container.style.left = `${screenBezel}vw`;
  elem.container.style.width = `${window.sassLengthVariable - (2 * screenBezel) - 0.6}vw`; // 0.6 is border width
  elem.container.style.height = `${window.sassWidthVariable - (2.5 * screenBezel) - 0.6}vw`; // 2.5 because bottom bezel is bigger
  elem2.laptopContent('home').appendChild(elem.container);

  elem.title.style.position = 'absolute';
  elem.title.style.transform = 'translate(-50%, -50%) scale(0.5)';
  elem.title.style.animation = 'none';
  elem2.laptopContent('home').appendChild(elem.title);
}

export function removeFromLaptop() {
  elem.container.style.position = 'fixed';
  elem.container.style.top = elem.container.style.left = 0;
  elem.container.style.width = '100vw';
  elem.container.style.height = '100vh';
  elem.wrapper.appendChild(elem.container);

  elem.title.style.position = 'fixed';
  elem.wrapper.appendChild(elem.title);
}

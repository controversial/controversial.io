// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.

const elem = {
  headerWrapper: document.getElementById('header-wrapper'),
  header: document.getElementsByTagName('header')[0],
  headerTitle: document.getElementsByTagName('h1')[0],
  downIndicator: document.getElementsByClassName('down-indicator')[0],

  laptop(hash) {
    // 'home' -> ''
    const h = hash === 'home' ? '' : hash;
    return document.querySelector(`.laptop3d[data-laptop-hash='${h}']`);
  },
  laptopContent(hash) { return this.laptop(hash).getElementsByClassName('screen')[0]; },

  laptopsContainer: document.getElementsByClassName('laptops-container')[0],
  laptopsStretcher: document.getElementsByClassName('laptops-stretcher')[0],
};

// HEADER TRANSITION LOGIC =========================================================================

let headerIsInLaptop = false;
let textIsInLaptop = false;

function updateHeaderElements(progress) {
  // Blends two values based on "progress" made between them.
  function tween(a, b) {
    return a + ((b - a) * progress);
  }
  // Returns the center of a passed ClientRect object (or similar)
  function getCenter(rect) {
    return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
  }

  // FIT MAIN HEADER TO LAPTOP SCREEN

  if (progress < 1) {
    if (headerIsInLaptop) {
      elem.header.style.position = 'fixed';
      elem.header.style.top = elem.header.style.left = 0;
      elem.header.style.width = '100vw'; elem.header.style.height = '100vh';
      elem.headerWrapper.appendChild(elem.header);
      elem.downIndicator.style.display = '';
      headerIsInLaptop = false;
    }
    // Beginning and end positions
    const w = window.innerWidth; const h = window.innerHeight;
    const posA = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
    const posB = elem.laptopContent('home').getBoundingClientRect();
    // Calculate translation
    // Center is used for calculating translation because element is scaled about the center)
    const centerA = getCenter(posA); const centerB = getCenter(posB);
    const translationNeeded = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
    // Calculate scale
    const scaleNeeded = { x: posB.width / posA.width, y: posB.height / posA.height };
    // Apply transformations
    elem.header.style.transform = [
      // Translate
      `translateX(${tween(0, translationNeeded.x)}px)`,
      `translateY(${tween(0, translationNeeded.y)}px)`,
      // Scale
      `scaleX(${tween(1, scaleNeeded.x)})`,
      `scaleY(${tween(1, scaleNeeded.y)})`,
    ].join(' ');
  } else if (!headerIsInLaptop) {
    elem.header.style.position = 'absolute';
    elem.header.style.transform = '';
    // This should be easy but Blink insists on rendering .front behind .back if I give
    // position: relative to .screen, so .header has to be manually positioned relative to .front
    const screenBezel = window.sassHeightVariable * 0.85;
    elem.header.style.top = elem.header.style.left = `${screenBezel}vw`;
    elem.header.style.width = `${window.sassLengthVariable - (2 * screenBezel) - 0.6}vw`; // 0.6 is border width
    elem.header.style.height = `${window.sassWidthVariable - (2.5 * screenBezel) - 0.6}vw`; // 2.5 because bottom bezel is bigger
    elem.laptopContent('home').appendChild(elem.header);
    elem.downIndicator.style.display = 'none';
    headerIsInLaptop = true;
  }

  // FIT NAME TO LAPTOP SCREEN

  if (progress < 1) {
    if (textIsInLaptop) {
      elem.headerTitle.style.position = 'fixed';
      elem.headerWrapper.appendChild(elem.headerTitle);
      textIsInLaptop = false;
    }
    const centerA = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const centerB = getCenter(elem.laptopContent('home').getBoundingClientRect());
    const translationNeeded = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
    elem.headerTitle.style.transform = [
      'translate(-50%, -50%)',
      `translateX(${tween(0, translationNeeded.x)}px)`,
      `translateY(${tween(0, translationNeeded.y)}px)`,
      `scale(${tween(1, 0.5)})`,
    ].join(' ');
  } else if (!textIsInLaptop) {
    elem.headerTitle.style.position = 'absolute';
    elem.headerTitle.style.transform = 'translate(-50%, -50%) scale(0.5)';
    // CSS animations replay on every appendChild. It only needs to play once (when the page loads),
    // so we just remove it before it has a chance to play again the first time it's appended
    elem.headerTitle.style.animation = 'none';
    elem.laptopContent('home').appendChild(elem.headerTitle);
    textIsInLaptop = true;
  }

  // MISCELLANEOUS

  // Update opacity of down indicator
  elem.downIndicator.style.opacity = 1 - progress;

  // ADJUST CANVAS SETTINGS

  const canvasRect = window.gol.elem.getBoundingClientRect();
  // How much canvas has been downscaled overall? Averages X and Y scale factors to get a holistic
  // scale factor
  const horizontalScaleFactor = (canvasRect.width / window.innerWidth);
  const verticalScaleFactor = (canvasRect.height / window.innerHeight);
  const averageScaleFactor = (horizontalScaleFactor + verticalScaleFactor) / 2;
  window.gol.idealCellSize = 20 * averageScaleFactor;
  window.gol.needsSizeUpdate = true;
}


// SCROLL LISTENER =================================================================================


function onscroll() {
  const scroll = window.scrollY;

  // Header

  const headerProgress = scroll / (window.innerHeight / 2);
  if (scroll < 5) requestAnimationFrame(() => updateHeaderElements(0));
  else if (scroll > window.innerHeight / 2) requestAnimationFrame(() => updateHeaderElements(1));
  else requestAnimationFrame(() => updateHeaderElements(window.ease.outSin(headerProgress)));

  // Carousel

  const largerScreenDimension = Math.max(window.innerWidth, window.innerHeight);

  // Adjust carousel position
  const start = elem.laptopsStretcher.offsetTop;
  const end = start + (largerScreenDimension * 1.5);

  const carouselProgress = (scroll - start) / (end - start);
  requestAnimationFrame(() => {
    // window.carousel.position = carouselProgress * window.carousel.maxIndex;
  });
}


window.onscroll = onscroll;

document.addEventListener('scroll', onscroll);
window.addEventListener('resize', onscroll);

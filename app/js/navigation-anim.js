// Navigation animation code
// JS-powered animation for shrinking pages into laptop screens

const elem = {
  homeWrapper: document.getElementById('home-wrapper'),
  homeContainer: document.querySelector('#home-wrapper .container'),
  // These properties are computed based on properties previously defined, so they have to be in
  // getters, but they still become static properties after their first call because of
  // Object.defineProperty
  get homeTitle() {
    // Override after first call to ensure it consistently refers to the same element
    Object.defineProperty(this, 'homeTitle', { value: this.homeWrapper.getElementsByTagName('h1')[0] });
    return this.homeTitle;
  },

  laptop(hash) {
    // 'home' -> ''
    const h = hash === 'home' ? '' : hash;
    return document.querySelector(`.laptop3d[data-laptop-hash='${h}']`);
  },
  laptopContent(hash) { return this.laptop(hash).getElementsByClassName('screen')[0]; },

  laptopsContainer: document.getElementsByClassName('laptops-container')[0],
  laptopsStretcher: document.getElementsByClassName('laptops-stretcher')[0],
};


// HOME TRANSITION LOGIC =========================================================================


let homePageIsInLaptop = false;
let textIsInLaptop = false;
function updatePageShrink(progress) {
  // Blends two values based on "progress" made between them.
  function tween(a, b) {
    return a + ((b - a) * progress);
  }
  // Returns the center of a passed ClientRect object (or similar)
  function getCenter(rect) {
    return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
  }

  // FIT HOME PAGE TO LAPTOP SCREEN

  if (progress < 1) {
    if (homePageIsInLaptop) {
      elem.homeContainer.style.position = 'fixed';
      elem.homeContainer.style.top = elem.homeContainer.style.left = 0;
      elem.homeContainer.style.width = '100vw'; elem.homeContainer.style.height = '100vh';
      elem.homeWrapper.appendChild(elem.homeContainer);
      homePageIsInLaptop = false;
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
    elem.homeContainer.style.transform = [
      // Translate
      `translateX(${tween(0, translationNeeded.x)}px)`,
      `translateY(${tween(0, translationNeeded.y)}px)`,
      // Scale
      `scaleX(${tween(1, scaleNeeded.x)})`,
      `scaleY(${tween(1, scaleNeeded.y)})`,
    ].join(' ');
  } else if (!homePageIsInLaptop) {
    elem.homeContainer.style.position = 'absolute';
    elem.homeContainer.style.transform = '';
    // This should be easy but Blink insists on rendering .front behind .back if I give
    // position: relative to .screen, so .container has to be manually positioned relative to .front
    const screenBezel = window.sassHeightVariable * 0.85;
    elem.homeContainer.style.top = elem.homeContainer.style.left = `${screenBezel}vw`;
    elem.homeContainer.style.width = `${window.sassLengthVariable - (2 * screenBezel) - 0.6}vw`; // 0.6 is border width
    elem.homeContainer.style.height = `${window.sassWidthVariable - (2.5 * screenBezel) - 0.6}vw`; // 2.5 because bottom bezel is bigger
    elem.laptopContent('home').appendChild(elem.homeContainer);
    homePageIsInLaptop = true;
  }

  // FIT NAME TO LAPTOP SCREEN

  if (progress < 1) {
    if (textIsInLaptop) {
      elem.homeTitle.style.position = 'fixed';
      elem.homeWrapper.appendChild(elem.homeTitle);
      textIsInLaptop = false;
    }
    const centerA = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const centerB = getCenter(elem.laptopContent('home').getBoundingClientRect());
    const translationNeeded = { x: centerB.x - centerA.x, y: centerB.y - centerA.y };
    elem.homeTitle.style.transform = [
      'translate(-50%, -50%)',
      `translateX(${tween(0, translationNeeded.x)}px)`,
      `translateY(${tween(0, translationNeeded.y)}px)`,
      `scale(${tween(1, 0.5)})`,
    ].join(' ');
  } else if (!textIsInLaptop) {
    elem.homeTitle.style.position = 'absolute';
    elem.homeTitle.style.transform = 'translate(-50%, -50%) scale(0.5)';
    // CSS animations replay on every appendChild. It only needs to play once (when the page loads),
    // so we just remove it before it has a chance to play again the first time it's appended
    elem.homeTitle.style.animation = 'none';
    elem.laptopContent('home').appendChild(elem.homeTitle);
    textIsInLaptop = true;
  }

  // MISCELLANEOUS

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


// MAIN ============================================================================================


function update(progress) {
  // Page shrinking into laptop
  requestAnimationFrame(() => updatePageShrink(progress));
  // Update navigation bar opacity
  document.getElementById('navigation').style.opacity = (progress * 0.75) + 0.25;
  // Update navigation trigger opacity in the opposite direction
  document.getElementById('navigation-trigger').style.opacity = Math.max(0.25, 1 - (progress * 0.75));
}

function navToggle() {
  const duration = 300;
  const os = window.ease.outSin;

  // Open
  if (!window.navShown) {
    for (let i = 0; i < 1; i += (1 / 60)) setTimeout(() => update(os(i)), i * duration);
    setTimeout(() => update(1), duration);
  // Close
  } else {
    for (let i = 0; i < 1; i += (1 / 60)) setTimeout(() => update(1 - os(i)), i * duration);
    setTimeout(() => update(0), duration);
  }

  window.navShown = !window.navShown;
}

window.navTransitionUpdate = update;
window.navToggle = navToggle;
window.addEventListener('resize', update);

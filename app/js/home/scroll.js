// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.

const elem = {
  body: document.body,

  headerWrapper: document.getElementById('header-wrapper'),
  header: document.getElementsByTagName('header')[0],
  headerTitle: document.getElementsByTagName('h1')[0],
  downIndicator: document.getElementsByClassName('down-indicator')[0],

  laptop: document.getElementsByClassName('laptop3d')[0].parentNode,
  // Won't be initialized by the time elem is evaluated so we use a getter
  get laptopContent() { return this.laptop.getElementsByClassName('screen')[0]; },

  laptopsContainer: document.getElementsByClassName('laptops-container')[0],
  laptopsStretcher: document.getElementsByClassName('laptops-stretcher')[0],
};

let headerIsInLaptop = false;

// HEADER TRANSITION LOGIC =========================================================================


function setHeaderElementsPinned(fixed) {
  // Switch between fixed and absolute, pinning elements in the appropriate place
  [elem.headerTitle, elem.laptop].forEach((element) => {
    /* eslint-disable no-param-reassign */
    element.style.position = fixed ? 'fixed' : 'absolute';
    element.style.top = fixed ? '50vh' : `${window.innerHeight}px`;
    /* eslint-enable no-param-reassign */
  });
}

function updateHeaderElements(progress) {
  // Blends two values based on "progress" made between them.
  function tween(a, b) {
    return a + ((b - a) * progress);
  }

  // FIT MAIN HEADER TO LAPTOP SCREEN

  if (progress < 1) {
    if (headerIsInLaptop) {
      elem.header.style.position = 'fixed';
      elem.headerWrapper.appendChild(elem.header);
      headerIsInLaptop = false;
    }
    // Beginning and end positions
    const w = window.innerWidth; const h = window.innerHeight;
    const posA = { left: 0, top: 0, right: w, bottom: h, width: w, height: h };
    const posB = elem.laptopContent.getBoundingClientRect();
    // Calculate translation
    // Center is used for calculating translation because element is scaled about the center)
    const centerA = { x: (posA.left + posA.right) / 2, y: (posA.top + posA.bottom) / 2 };
    const centerB = { x: (posB.left + posB.right) / 2, y: (posB.top + posB.bottom) / 2 };
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
    elem.laptopContent.appendChild(elem.header);
    headerIsInLaptop = true;
  }

  // MISCELLANEOUS

  // Update opacity of down indicator
  elem.downIndicator.style.opacity = 1 - progress;
  // Reduce font size of my name
  elem.headerTitle.style.transform = `translate(-50%, -50%) scale(${tween(1, 0.7)})`;


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


// BACKGROUND TRANSITION LOGIC =====================================================================


function updateBackgroundColor(progress) {
  const grad1A = window.parseColor('#5EFCE8');
  const grad1B = window.parseColor('#736EFE');

  const grad2A = window.parseColor('#16222A');
  const grad2B = window.parseColor('#4A5070');

  const interpolate = (a, b, amount) => ({
    r: Math.floor((a.r * (1 - progress)) + (b.r * amount)),
    g: Math.floor((a.g * (1 - progress)) + (b.g * amount)),
    b: Math.floor((a.b * (1 - progress)) + (b.b * amount)),
  });

  const getCssGradString = (a, b, deg = 135) =>
    `linear-gradient(${deg}deg, rgb(${a.r}, ${a.g}, ${a.b}), rgb(${b.r}, ${b.g}, ${b.b}))`;

  const calcA = interpolate(grad1A, grad2A, progress);
  const calcB = interpolate(grad1B, grad2B, progress);
  elem.body.style.backgroundImage = getCssGradString(calcA, calcB);
}


// SCROLL LISTENER =================================================================================


function onscroll() {
  const scroll = window.scrollY;

  // Header

  switch (true) {
    case (scroll < 5): {
      setHeaderElementsPinned(true);
      requestAnimationFrame(() => updateHeaderElements(0));
      break;
    }

    case (scroll < window.innerHeight / 2): {
      setHeaderElementsPinned(true);
      const headerProgress = scroll / (window.innerHeight / 2);
      requestAnimationFrame(() => updateHeaderElements(headerProgress));
      break;
    }

    default: {
      setHeaderElementsPinned(false);
      requestAnimationFrame(() => updateHeaderElements(1));
    }
  }

  // Background

  switch (true) {
    case (scroll < window.innerHeight * 0.75): {
      updateBackgroundColor(0);
      break;
    }

    case (scroll > window.innerHeight * 1.25): {
      updateBackgroundColor(1);
      break;
    }

    default: {
      const bgProgress = (scroll - (window.innerHeight * 0.75)) / (window.innerHeight * 0.5);
      updateBackgroundColor(bgProgress);
    }
  }

  // Carousel

  const largerScreenDimension = Math.max(window.innerWidth, window.innerHeight);

  // Adjust carousel position
  const start = elem.laptopsStretcher.offsetTop;
  const end = start + (largerScreenDimension * 1.5);

  const carouselProgress = (scroll - start) / (end - start);
  requestAnimationFrame(() => {
    window.carousel.position = carouselProgress * window.carousel.maxIndex;
  });
}


window.onscroll = onscroll;

document.addEventListener('scroll', onscroll);
window.addEventListener('resize', onscroll);

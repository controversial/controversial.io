// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.

const elem = {
  body: document.body,

  header: document.getElementsByTagName('header')[0],
  headerTitle: document.getElementsByTagName('h1')[0],
  downIndicator: document.getElementsByClassName('down-indicator')[0],

  laptop: document.getElementsByClassName('laptop')[0],
  laptopContent: document.getElementsByClassName('laptop-content')[0],
  laptopBase: document.getElementsByClassName('laptop-base')[0],
};


// HEADER TRANSITION LOGIC ====================================================


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


  // Values for tweening. [x, y, w, h]. All values are viewport-relative.

  const initialPos = [50, 50, 100, 100]; // The starting position (fixed)
  const destinationPos = [               // The shrunk position (still fixed)
    50, 50,
    (100 * elem.laptopContent.offsetWidth) / window.innerWidth,
    (100 * elem.laptopContent.offsetHeight) / window.innerHeight,
  ];
  const restingPos = [                   // The shrunk position (absolute now)
    50,
    100,
    (100 * elem.laptopContent.offsetWidth) / window.innerWidth,
    destinationPos[3],
  ];

  // NOTE: Left is ignored since it's constant

  const fixedTop = tween(initialPos[1], destinationPos[1]);
  const top = progress < 1 ? fixedTop : restingPos[1];
  elem.header.style.top = `${top}vh`;

  const width = tween(initialPos[2], destinationPos[2]);
  elem.header.style.width = `${width}vw`;

  const height = tween(initialPos[3], destinationPos[3]);
  elem.header.style.height = `${height}vh`;

  elem.header.style.position = progress < 1 ? 'fixed' : 'absolute';


  // MISCELLANEOUS


  // Update opacity of down indicator
  elem.downIndicator.style.opacity = 1 - progress;
  // Reduce font size of my name
  elem.headerTitle.style.fontSize = `${tween(5, 3.5)}vw`;


  // ADJUST CANVAS SETTINGS


  const canvasScale = ( // Mean of X scale difference and Y scale difference
    (window.gol.canvas.offsetWidth / window.innerWidth) +
    (window.gol.canvas.offsetHeight / window.innerHeight)
  ) / 2;
  window.gol.idealCellSize = 20 * canvasScale;
  window.gol.sizeChanged();
}


// SCROLL LISTENER ============================================================


document.addEventListener('scroll', () => {
  const scroll = window.scrollY;

  // Header

  const headerProgress = scroll / (window.innerHeight / 2);

  switch (true) {
    case (scroll < 5):
      setHeaderElementsPinned(true);
      updateHeaderElements(0);
      break;

    case (scroll < window.innerHeight / 2):
      setHeaderElementsPinned(true);
      updateHeaderElements(headerProgress);
      break;

    default:
      setHeaderElementsPinned(false);
      updateHeaderElements(1);
  }
});

// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.

const elem = {
  body: document.body,

  header: document.getElementsByTagName("header")[0],
  headerTitle: document.getElementsByTagName("h1")[0],
  downIndicator: document.getElementsByClassName("down-indicator")[0],

  laptop: document.getElementsByClassName("laptop")[0],
  laptopContent: document.getElementsByClassName("laptop-content")[0],
  laptopBase: document.getElementsByClassName("laptop-base")[0]
};

// HEADER TRANSITION LOGIC ====================================================

const setHeaderElementsPinned = fixed => {
  const elements = [elem.headerTitle, elem.laptop];
  // Switch between fixed and absolute, pinning elements in the appropriate place
  for (let i = 0; i < elements.length; i++) {
    elements[i].style.position = fixed ? "fixed" : "absolute";
    elements[i].style.top = fixed ? "50vh" : window.innerHeight + "px";
  }
};

const updateHeaderElements = progress => {
  // Blends two values based on "progress" made between them.
  const tween = (a, b) => {
    return a + ((b - a) * progress);
  };

  // FIT MAIN HEADER TO LAPTOP SCREEN

  const whRatio = elem.laptopContent.offsetWidth / elem.laptopContent.offsetHeight;
  elem.header.style.width = tween(
    100,
    (100 * elem.laptopContent.offsetWidth / window.innerWidth)
  ) + "vw";
  elem.header.style.height = tween(
    100 * (window.innerHeight / window.innerWidth),
    (100 * elem.laptopContent.offsetWidth / window.innerWidth) / whRatio
  ) + "vw";
  elem.header.style.top = (progress < 1 ?
    tween(window.innerHeight / 2, (window.innerHeight / 2) - (elem.laptopBase.offsetHeight / 2)) :
    window.innerHeight - (elem.laptopBase.offsetHeight / 2)) +
  "px";
  elem.header.style.position = progress < 1 ? "fixed" : "absolute";

  // DEAL WITH ASSOCIATED TIDBITS

  elem.downIndicator.style.opacity = 1 - progress;  // Fade out down indicator
  elem.headerTitle.style.fontSize = tween(5, 6) + "vw";  // Shrink header

  // ADJUST CANVAS SETTINGS

  // Mean of X scale difference and Y scale difference
  const canvasScale = ((window.gol.canvas.offsetWidth / window.innerWidth) + (window.gol.canvas.offsetHeight / window.innerHeight)) / 2;
  window.gol.idealCellSize = 20 * canvasScale;
  window.gol.sizeChanged();
};

// SCROLL LISTENER ============================================================

document.addEventListener("scroll", () => {
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

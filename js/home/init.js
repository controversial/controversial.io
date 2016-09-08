// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.


var elem = {
  body: document.body,

  header: document.getElementsByTagName("header")[0],
  headerTitle: document.getElementsByTagName("h1")[0],
  downIndicator: document.getElementsByClassName("down-indicator")[0],

  laptop: document.getElementsByClassName("laptop")[0],
  laptopContent: document.getElementsByClassName("laptop-content")[0],
  laptopBase: document.getElementsByClassName("laptop-base")[0]
};


// HEADER TRANSITION LOGIC ====================================================


function setHeaderElementsPinned(fixed) {
  var elements = [elem.headerTitle, elem.laptop];
  for (var i=0; i<elements.length; i++) {
    elements[i].style.position = fixed ? "fixed" : "absolute";
    elements[i].style.top = fixed ? "50vh" : window.innerHeight + "px";
  }
}

function updateHeaderElements(progress) {

  function tween(a, b) {
    return a + (b - a) * progress;
  }

  // FIT MAIN HEADER TO LAPTOP SCREEN

  whRatio = elem.laptopContent.offsetWidth / elem.laptopContent.offsetHeight;
  elem.header.style.width = tween(
    100,
    (100 * elem.laptopContent.offsetWidth / window.innerWidth)
  ) + "vw";
  elem.header.style.height = tween(
    100 * (window.innerHeight / window.innerWidth),
    (100 * elem.laptopContent.offsetWidth / window.innerWidth) / whRatio
  ) + "vw";
  elem.header.style.top = (progress < 1 ?
    tween(window.innerHeight / 2, window.innerHeight / 2 - elem.laptopBase.offsetHeight / 2) :
    window.innerHeight - elem.laptopBase.offsetHeight / 2) +
  "px";
  elem.header.style.position = progress < 1 ? "fixed" : "absolute";

  // DEAL WITH ASSOCIATED TIDBITS

  elem.downIndicator.style.opacity = 1 - progress;  // Fade out down indicator
  elem.headerTitle.style.fontSize = tween(5, 4) + "vw";  // Shrink header

  // ADJUST CANVAS SETTINGS

  // Mean of X scale difference and Y scale difference
  var canvasScale = (gol.canvas.offsetWidth / window.innerWidth + gol.canvas.offsetHeight / window.innerHeight) / 2;
  gol.idealCellSize = 20 * canvasScale;
  gol.sizeChanged();
}



// SCROLL LISTENER ============================================================



document.addEventListener("scroll", function(e) {
  var scroll = window.scrollY;

  // Header

  var headerProgress = scroll / (window.innerHeight / 2);

  switch(true) {
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

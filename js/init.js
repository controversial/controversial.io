// Magic scroll things.
// This binds cool animations to the scroll level in such a way that the
// animations' progress can be controlled by scrolling. This does what
// ScrollMagic does except without the bugs.


var backgroundScale = new chroma.scale(["#2d3940", "#fff"]).mode("lab");

var elem = {
  header: document.getElementsByTagName("header")[0],
  headerTitle: document.getElementsByTagName("h1")[0],
  laptop: document.getElementsByClassName("laptop")[0],
  downIndicator: document.getElementsByClassName("down-indicator")[0],
  laptopContent: document.getElementsByClassName("laptop-content")[0],
  body: document.body
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

  elem.header.style.width = tween(
    100,
    (100 * elem.laptopContent.offsetWidth / window.innerWidth)
  ) + "vw";
  elem.header.style.height = tween(
    100,
    (100 * elem.laptopContent.offsetHeight / window.innerHeight)
  ) + "vh";

  elem.header.style.top = tween(
    window.innerHeight / 2,  // 50vh
    elem.laptopContent.offsetTop + elem.laptopContent.offsetHeight
  ) + "px";

  if (progress === 1) {
    elem.header.style.top = elem.header.offsetTop + window.innerHeight / 2 + "px";
    elem.header.style.position = "absolute";
  } else {
    elem.header.style.position = "fixed";
  }
  elem.downIndicator.style.opacity = 1 - progress;
  elem.body.style.backgroundColor = backgroundScale(progress).hex();

  // TODO: Update canvas pixel size
}



// SCROLL LISTENER

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

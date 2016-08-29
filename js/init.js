var backgroundScale = new chroma.scale(["#2d3940", "#fff"]).mode("lab");

document.addEventListener("scroll", function(e) {
  var scroll = window.scrollY;

  /****** STAGE 1 ******
   * HEADER SHRINK AND *
   * DOWN ICON OPACITY *
   *********************/
  var header = document.getElementsByTagName("header")[0];
  var headerTitle = document.getElementsByTagName("h1")[0];
  var laptop = document.getElementsByClassName("laptop")[0];
  var downIndicator = document.getElementsByClassName("down-indicator")[0];

  var headerProgress = scroll / (window.innerHeight / 2);

  function setHeaderElementsPinned(fixed) {
    elements = [header, headerTitle, laptop];
    for (var i=0; i<elements.length; i++) {
      elements[i].style.position = fixed ? "fixed" : "absolute";
      elements[i].style.top = fixed ? "50vh" : window.innerHeight + "px";
    }
  }

  function updateHeaderElements(progress) {
    header.style.width = (1 - progress) * 50 + 50 + "vw";
    header.style.height = (1 - progress) * 50 + 50 + "vh";
    downIndicator.style.opacity = 1 - progress;
    document.body.style.backgroundColor = backgroundScale(headerProgress).hex();

    // TODO: Update canvas pixel size
  }

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

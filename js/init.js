var backgroundScale = new chroma.scale(["#2d3940", "#fff"]).mode("lab");

document.addEventListener("scroll", function(e) {
  var scroll = window.scrollY;

  /****** STAGE 1 ******
   * HEADER SHRINK AND *
   * DOWN ICON OPACITY *
   *********************/
  var header = document.getElementsByTagName("header")[0];
  var headerTitle = document.getElementsByTagName("h1")[0];
  var downIndicator = document.getElementsByClassName("down-indicator")[0];

  var headerProgress = scroll / (window.innerHeight / 2);

  function setFixedElements(fixed) {
    position = fixed ? "fixed": "absolute";
    header.style.position = position;
    headerTitle.style.position = position;
  }

  function updateHeaderElements(progress) {
    header.style.width = (1 - progress) * 50 + 50 + "vw";
    header.style.height = (1 - progress) * 50 + 50 + "vh";
    downIndicator.style.opacity = 1 - progress;
    document.body.style.backgroundColor = backgroundScale(headerProgress).hex();
  }

  // Starting phase
  if (scroll < 5) {
    setFixedElements(true); // Ensure header elements are fixed
    updateHeaderElements(0);
  // Intermediate phases
  } else if (scroll < window.innerHeight / 2) {
    setFixedElements(true); // Pin header elements
    header.style.top = "50vh";
    headerTitle.style.top = "50vh";
    updateHeaderElements(headerProgress);
  // End phase
  } else {
    setFixedElements(false); // Unpin header elements
    header.style.top = window.innerHeight + "px";
    headerTitle.style.top = window.innerHeight + "px";
    updateHeaderElements(1);
  }
});

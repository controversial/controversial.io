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
  // Starting phase
  if (scroll < 5) {
    header.style.width = "100vw";
    header.style.height = "100vh";
    downIndicator.style.opacity = 1;
    document.body.style.backgroundColor = backgroundScale(0).hex();
  // Intermediate phases
  } else if (scroll < window.innerHeight / 2) {
    header.style.top = "50vh";
    headerTitle.style.top = "50vh";
    header.style.position = "fixed";
    headerTitle.style.position = "fixed";

    header.style.width = ((1 - headerProgress) * 50 + 50).toString() + "vw";
    header.style.height = ((1 - headerProgress) * 50 + 50).toString() + "vh";
    downIndicator.style.opacity = 1 - headerProgress;
    document.body.style.backgroundColor = backgroundScale(headerProgress).hex();
  // End phase
  } else {
    header.style.top = window.innerHeight + "px";
    headerTitle.style.top = window.innerHeight + "px";
    header.style.position = "absolute";
    headerTitle.style.position = "absolute";
    header.style.width = "50vw";
    header.style.height = "50vh";
    downIndicator.style.opacity = 0;
    document.body.style.backgroundColor = backgroundScale(1).hex();
  }
});

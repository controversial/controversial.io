function updateCanvasSize() {
  var canvas = document.getElementById("gol");
  canvas.setAttribute("width", canvas.offsetWidth);
  canvas.setAttribute("height", canvas.offsetHeight);
}

document.addEventListener("DOMContentLoaded", updateCanvasSize);
window.addEventListener("resize", updateCanvasSize);

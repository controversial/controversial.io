function updateCanvasSize() {
  var canvas = document.getElementById("gol");
  canvas.setAttribute("width", canvas.offsetWidth);
  canvas.setAttribute("height", canvas.offsetHeight);

  console.log("Size:", canvas.getAttribute("width"), canvas.getAttribute("height"));
}

document.addEventListener("DOMContentLoaded", updateCanvasSize);
window.addEventListener("resize", updateCanvasSize);

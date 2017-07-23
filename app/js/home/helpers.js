// Parse a color by letting CSS parse it
window.parseColor = function parseColor(color) {
  // Make a div, assign a color, and see what CSS parses it as. The div must temporarily be added to
  // the DOM sothat getComputedStyle works.
  const elem = document.createElement('div');
  elem.style.color = color;
  document.body.appendChild(elem);
  const rgbColor = getComputedStyle(elem).color;
  document.body.removeChild(elem);

  // Parse the rgb(r, g, b) color that getComputedStyle returns
  const rgb = rgbColor.split('(')[1].split(')')[0].split(',');
  return { r: +rgb[0], g: +rgb[1], b: +rgb[2] };
};

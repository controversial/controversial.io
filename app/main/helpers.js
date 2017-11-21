// Parse a color by letting CSS parse it
export function parseColor(color) {
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
}


// Easing functions return eased values of x for the range [0, 1] => [0, 1]
export const ease = {
  linear: x => x,
  // Quadratic easing
  in: x => x ** 2,
  out: x => 1 - window.ease.in(1 - x),
  // Sinusoidal easing
  inSin: x => 1 - Math.cos(0.5 * Math.PI * x),
  outSin: x => Math.sin(0.5 * Math.PI * x),
};


// Sleep for async functions
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

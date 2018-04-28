/**
 * @typedef {Object} Color
 * @property {number} r - the red component of the color (out of 255)
 * @property {number} g - the green component of the color (out of 255)
 * @property {number} b - the blue component of the color (out of 255)
 */
/**
 * Parse a color by letting CSS parse it
 * @param {string} color - any color description that CSS understands
 * @return {Color} the result of parsing the input color
 */
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

/**
 * @namespace
 * @property {Function} linear - linear interpolation returns the input value
 * @property {Function} in - easeIn interpolation accelerates following a quadratic curve
 * @property {Function} out - easeOut interpolation decelerates following a quadratic curve
 * @property {Function} inSin - easeInSin interpolation accelerates following a sinusoidal curve
 * @property {Function} outSin - easeOutSin interpolation decelerates following a sinusoidal curve
 * Easing functions return eased values of x for the range [0, 1] => [0, 1]
 */
export const ease = {
  linear: x => x,
  // Quadratic easing
  in: x => x ** 2,
  out: x => 1 - window.ease.in(1 - x),
  // Sinusoidal easing
  inSin: x => 1 - Math.cos(0.5 * Math.PI * x),
  outSin: x => Math.sin(0.5 * Math.PI * x),
};


/**
 * Sleep for async functions (intended to be used like `await sleep(1000)`)
 * @param {number} ms - number of milliseconds to sleep for
 * @return {Promise} - A promise that will resolve after `ms` milliseconds, intended to be awaited
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


/**
 * Change hash without firing hashchange.
 * @param {string} newHash - the hash (with or whithout a leading #) that we want to change to
 * @param {boolean} push - If push is true, this change will be pushed to, rather than replaced on,
 * the history stack.
 */
export function sneakyHashChange(newHash, push = false) {
  const hash = newHash.startsWith('#') ? newHash : `#${newHash}`;
  window.history[push ? 'pushState' : 'replaceState']({}, '', hash);
}

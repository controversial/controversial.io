// Adapted from http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
// (found on web.archive.org) to be compliant with the style guide. r, g, b should be between 0 and
// 255. The returned h is between 0 and 360, the returned s and l are decimals between 0 and 1

window.rgbToHsl = (r, g, b) => {
  const r2 = r / 255;
  const g2 = g / 255;
  const b2 = b / 255;
  const max = Math.max(r2, g2, b2);
  const min = Math.min(r2, g2, b2);
  let h;
  let s;
  let l;
  h = s = l = (max + min) / 2;
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r2: h = ((g2 - b2) / d) + (g2 < b2 ? 6 : 0); break;
      case g2: h = ((b2 - r2) / d) + 2; break;
      case b2: h = ((r2 - g2) / d) + 4; break;
      default:
    }
    h /= 6;
  }

  return [h * 360, s, l];
};

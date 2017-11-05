// Navigation animation code
// JS-powered animation for shrinking pages into laptop screens
import * as home from './home/nav-shrink';

export const elem = {
  laptop(hash) {
    // 'home' -> ''
    const h = hash === 'home' ? '' : hash;
    return document.querySelector(`.laptop3d[data-laptop3d-hash='${h}']`);
  },
  laptopContent(hash) { return this.laptop(hash).getElementsByClassName('screen')[0]; },
};


// Blends two values based on "progress" made between them.
export function tween(a, b, progress) {
  return a + ((b - a) * progress);
}
// Returns the center of a passed ClientRect object (or similar)
export function getCenter(rect) {
  return { x: (rect.left + rect.right) / 2, y: (rect.top + rect.bottom) / 2 };
}

let homePageIsInLaptop = false;
function updatePageShrink(progress) {
  if (progress < 1) {
    if (homePageIsInLaptop) {
      home.removeFromLaptop();
      homePageIsInLaptop = false;
    }
    home.scale(elem.laptopContent('home').getBoundingClientRect(), progress);
  } else if (!homePageIsInLaptop) {
    home.putInLaptop();
    homePageIsInLaptop = true;
  }
}


// MAIN ============================================================================================


export function update(progress) {
  // Page shrinking into laptop
  requestAnimationFrame(() => updatePageShrink(progress));
  // Update navigation bar opacity
  document.getElementById('navigation').style.opacity = (progress * 0.75) + 0.25;
  // Update navigation trigger opacity in the opposite direction
  document.getElementById('navigation-trigger').style.opacity = Math.max(0.25, 1 - (progress * 0.75));
}

export function navToggle() {
  const duration = 300;
  const os = window.ease.outSin;

  // Open
  if (!window.navShown) {
    for (let i = 0; i < 1; i += (1 / 60)) setTimeout(() => update(os(i)), i * duration);
    setTimeout(() => update(1), duration);
  // Close
  } else {
    for (let i = 0; i < 1; i += (1 / 60)) setTimeout(() => update(1 - os(i)), i * duration);
    setTimeout(() => update(0), duration);
  }

  window.navShown = !window.navShown;
}

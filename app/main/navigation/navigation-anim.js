// Navigation animation code
// JS-powered animation for shrinking pages into laptop screens
import Home from '../home/nav-shrink';

const home = new Home();

export function update(progress) {
  // Page shrinking into laptop
  requestAnimationFrame(() => home.update(progress));
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

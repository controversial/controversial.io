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

Object.defineProperty(window, 'isChromium', {
  get() { return !!window.chrome; },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(window, 'isSafari', {
  get() { return navigator.userAgent.includes('Safari'); },
  enumerable: true,
  configurable: true,
});

Object.defineProperty(window, 'isFirefox', {
  get() { return navigator.userAgent.includes('Firefox'); },
  enumerable: true,
  configurable: true,
});

function browserCheck() {
  if (!window.isChromium) {
    if (window.isSafari || window.isFirefox) {
      const popup = document.getElementById('browser-partially-supported');
      // Show gentle popup
      popup.classList.add('visible');
      // Enable dismiss button
      popup.getElementsByTagName('button')[0].addEventListener('click', () => popup.classList.remove('visible'));
    } else {
      // Show serious popup
      document.getElementById('browser-unsupported').classList.add('visible');
    }
  }
}
window.browserCheck = browserCheck;

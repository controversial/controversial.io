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
      // Show gentle popup
      document.getElementById('browser-partially-supported').classList.add('visible');
    } else {
      // Show serious popup
      document.getElementById('browser-unsupported').classList.add('visible');
    }
  }
}
window.browserCheck = browserCheck;

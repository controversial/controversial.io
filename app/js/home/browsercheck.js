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
    } else {
      // Show serious popup
    }
  }
}
window.browserCheck = browserCheck;

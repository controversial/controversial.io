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
    const willWork = window.isSafari || window.isFirefox;
    const popup = document.getElementById(willWork ? 'browser-partially-supported' : 'browser-unsupported');
    if (willWork) {
      popup.getElementsByTagName('button')[0].addEventListener('click', () => {
        popup.style.transform = 'translateY(100%)';
        setTimeout(() => { popup.style.display = 'none'; }, 400);
      });
    }
    // Show popup
    popup.style.display = 'block';
    setTimeout(() => popup.classList.add('visible'));
  }
}
window.browserCheck = browserCheck;

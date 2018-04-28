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

export default function browserCheck() {
  if (!window.isChromium) {
    const willWork = window.isSafari || window.isFirefox;
    // Different popups if the browser is partially supported or entirely unsupported
    const popup = document.getElementById(willWork ? 'browser-partially-supported' : 'browser-unsupported');
    // Only the "partially supported" popup can be dismissed
    if (willWork) {
      popup.getElementsByTagName('button')[0].addEventListener('click', () => {
        popup.style.transform = 'translateY(100%)';
        // Wait for animation to finish before derendering
        setTimeout(() => { popup.style.display = 'none'; }, 400);
      });
    }
    // Show popup (animation will automatically play when element is displayed)
    popup.style.display = 'block';
  }
}

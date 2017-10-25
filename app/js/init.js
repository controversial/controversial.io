document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.browserCheck, 1000);

  window.setupGol();
  window.navUpdate(true);
  window.setupLaptops();

  window.onscroll();

  // Configure scrolling when navigation trigger clicked
  document.getElementById('navigation-trigger').addEventListener('click', () => {
    // Scroll to top if user is scrolled more than 10 pixels, otherwise scroll to open navigation
    const scrollDest = window.scrollY < 10 ? window.innerHeight / 2 : 0;
    window.scrollTo({ top: scrollDest, behavior: 'smooth' });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.browserCheck, 1000);

  window.setupGol();
  window.navUpdate(true);
  window.setupLaptops();

  window.onscroll();

  // Configure scrolling when navigation trigger clicked
  document.getElementById('navigation-trigger').addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.browserCheck, 1000);

  window.setupGol();
  window.navUpdate(true);
  window.setupLaptops();
  // Initialize the top laptop
  window.headerLaptop = new window.Laptop(document.getElementById('header-wrapper').getElementsByClassName('laptop3d')[0], -1);

  window.onscroll();

  // Configure scrolling when down indicator clicked
  document.getElementsByClassName('down-indicator')[0].addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
  });
});

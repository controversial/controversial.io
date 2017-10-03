document.addEventListener('DOMContentLoaded', () => {
  window.setupGol();
  window.setupLaptops();
  // Initialize the top laptop
  window.headerLaptop = new window.Laptop(document.getElementById('header-wrapper').getElementsByClassName('laptop3d')[0], -1);

  window.onscroll();

  setTimeout(window.browserCheck, 1000);

  // Configure scrolling when down indicator clicked
  document.getElementsByClassName('down-indicator')[0].addEventListener('click', () => {
    window.scrollTo({ top: window.innerHeight / 2, behavior: 'smooth' });
  });
});

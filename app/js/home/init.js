document.addEventListener('DOMContentLoaded', () => {
  window.setupGol();
  window.setupLaptops();
  window.headerLaptop = new window.Laptop(document.getElementById('header-wrapper').getElementsByClassName('laptop3d')[0], -1);

  window.onscroll();

  setTimeout(window.browserCheck, 1000);
});

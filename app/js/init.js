document.addEventListener('DOMContentLoaded', () => {
  setTimeout(window.browserCheck, 1000);

  window.setupGol();
  window.navUpdate(true);
  window.setupLaptops();

  window.navTransitionUpdate(0);

  // Configure navigation trigger clicked
  document.getElementById('navigation-trigger').addEventListener('click', window.navToggle);
});

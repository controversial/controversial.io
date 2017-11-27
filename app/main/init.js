import browserCheck from './browsercheck';
import homeInit from './home';
import navInit from './navigation';
import aboutInit from './about';

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(browserCheck, 1000);

  homeInit();
  navInit();
  aboutInit();
});

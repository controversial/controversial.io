import AgeRenderer from './age';
import Parallax3D from '../parallax';
import { Navigation } from '../navigation';

export default function init() {
  // .info
  const elem = (
   Navigation.hash === 'about'
   ? document.getElementById('about-wrapper')
   : window.navigation.carousel.getLaptopWithHash('about').screen
  ).getElementsByClassName('info')[0];

  // Create Parallax
  window.parallax = new Parallax3D(elem, 'translate(-50%, -50%)');
  // Disable if not shown
  if (Navigation.hash !== 'about') window.parallax.disable();
  // Set up age renderer
  new AgeRenderer(document.getElementById('age'), Date.parse('11/03/2001 17:23')).loop();

  // Set up flipping
  ['social-trigger', 'social-close'].forEach(
    id => document.getElementById(id).addEventListener('click', () => {
      elem.classList.toggle('flipped');
      document.getElementById('social-container').classList.toggle('hidden');
      document.getElementById('email').classList.toggle('hidden');
    }),
  );
}

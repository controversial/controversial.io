import AgeRenderer from './age';
import Parallax3D from './parallax';

export default function init() {
  window.parallax = new Parallax3D(
    document
      .getElementById('about-wrapper')
      .getElementsByClassName('info')[0],
    'translate(-50%, -50%)',
  );
  new AgeRenderer(document.getElementById('age'), '11/03/2001 17:23').loop();
}

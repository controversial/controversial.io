import AgeRenderer from './age';
import Parallax3D from './parallax';

export default function init() {
  window.parallax = new Parallax3D();
  new AgeRenderer(document.getElementById('age'), '11/03/2001 17:23').loop();
}

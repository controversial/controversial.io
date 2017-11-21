import NavigationBase from '../navigation/anim-base';

export default class WorkNavigationAnimation extends NavigationBase {
  scale(laptopScreenCoordinates, progress) {
    super.scale(laptopScreenCoordinates, progress);
    console.log(`Work scaled to ${progress}`);
  }

  putInLaptop() {
    super.putInLaptop();
    console.log('Work in laptop');
  }

  removeFromLaptop() {
    super.removeFromLaptop();
    console.log('Work removed from laptop');
  }
}

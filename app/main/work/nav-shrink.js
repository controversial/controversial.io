import NavigationBase from '../navigation/anim-base';

export default class WorkNavigationAnimation extends NavigationBase {
  scale(laptopScreenCoordinates, progress) {
    super.scale(laptopScreenCoordinates, progress);
    if (progress === 0) console.log('work grew');
    else if (progress === 1) console.log('work shrunk');
  }

  putInLaptop() {
    super.putInLaptop();
  }

  removeFromLaptop() {
    super.removeFromLaptop();
  }
}

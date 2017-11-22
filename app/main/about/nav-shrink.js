import NavigationBase from '../navigation/anim-base';

export default class AboutNavigationAnimation extends NavigationBase {
  scale(laptopScreenCoordinates, progress) {
    super.scale(laptopScreenCoordinates, progress);
    if (progress === 0) console.log('about grew');
    else if (progress === 1) console.log('about shrunk');
  }

  putInLaptop() {
    super.putInLaptop();
  }

  removeFromLaptop() {
    super.removeFromLaptop();
  }
}

import NavigationBase from '../navigation/anim-base';

export default class AboutNavigationAnimation extends NavigationBase {
  scale(laptopScreenCoordinates, progress) {
    super.scale(laptopScreenCoordinates, progress);
    console.log(`About scaled to ${progress}`);
  }

  putInLaptop() {
    super.putInLaptop();
    console.log('About in laptop');
  }

  removeFromLaptop() {
    super.removeFromLaptop();
    console.log('About removed from laptop');
  }
}

export default class AgeRenderer {
  constructor(elem, date, accuracy = 9) {
    this.elem = elem;
    this.date = date;
    this.accuracy = accuracy;
  }

  getMs() {
    return (new Date() - Date.parse(this.date));
  }

  getSeconds() {
    return this.getMs() / 1000;
  }

  getMinutes() {
    return this.getSeconds() / 60;
  }

  getHours() {
    return this.getMinutes() / 60;
  }

  getDays() {
    return this.getHours() / 24;
  }

  getYears() {
    return this.getDays() / 365;
  }

  render() {
    this.elem.innerText = this.getYears().toFixed(this.accuracy);
  }

  loop() {
    setInterval(() => this.render(), 30);
  }
}

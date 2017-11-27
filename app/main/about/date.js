export default class DateRenderer {
  constructor(elem, date) {
    this.date = date;
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
}

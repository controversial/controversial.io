/** Displays an age in years in an HTML element */
export default class AgeRenderer {
  /**
   * @param {HTMLElement} elem - the element in which the age should be written
   * @param {Date} date - the date from which the age should be measured
   * @param {number} accuracy - the number of decimal places to include
   */
  constructor(elem, date, accuracy = 9) {
    this.elem = elem;
    this.date = date;
    this.accuracy = accuracy;
  }

  /**
   * Milliseconds since the date
   * @return {number} - the number of milliseconds that have passed since the specified date.
   */
  getMs() {
    return (new Date() - this.date);
  }

  /**
   * Seconds since the date
   * @return {number} - the decimal number of seconds that have passed since the specified date.
   */
  getSeconds() {
    return this.getMs() / 1000;
  }

  /**
   * Minutes since the date
   * @return {number} - the decimal number of minutes that have passed since the specified date.
   */
  getMinutes() {
    return this.getSeconds() / 60;
  }

  /**
   * Hours since the date
   * @return {number} - the decimal number of hours that have passed since the specified date.
   */
  getHours() {
    return this.getMinutes() / 60;
  }

  /**
   * Days since the date
   * @return {number} - the decimal number of days that have passed since the specified date.
   */
  getDays() {
    return this.getHours() / 24;
  }

  /**
   * Years since the date
   * @return {number} - the decimal number of years that have passed since the specified date.
   */
  getYears() {
    return this.getDays() / 365;
  }

  /** Write the number of years (to `accuracy` decimal places) in `this.elem`*/
  render() {
    this.elem.innerText = this.getYears().toFixed(this.accuracy);
  }

  /** Start a loop updating the element every 30ms */
  loop() {
    setInterval(() => this.render(), 30);
  }
}

import DateRenderer from './date';

export default function init() {
  console.log(new DateRenderer(undefined, '11/03/2001 17:23').getYears());
}

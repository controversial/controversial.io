// Cool looking parts of cities around the world.
// Each is represented as map bounds, and a zoom level.

// Some cities are represented twice, showing different views of the city.

var places = {
  rome: {
    lat: 41.89659124583866,
    lng: 12.505531311035156,
    zoom: 15,
    readableName: "Rome"
  },
  rome2: {
    lat: 41.89659124583866,
    lng: 12.505531311035156,
    zoom: 13,
    readableName: "Rome"
  },

  seoul: {
    lat: 37.53361991979847,
    lng: 127.02117919921874,
    zoom: 13,
    readableName: "Seoul"
  },

  new_york: {
    lat: 40.752832623340844,
    lng: -73.95455360412598,
    zoom: 15,
    readableName: "New York"
  },

  dubai: {
    lat: 25.259057280844345,
    lng: 55.404396057128906,
    zoom: 13,
    readableName: "Dubai"
  },

  london: {
    lat: 51.50227810647596,
    lng: -0.11003494262695311,
    zoom: 13,
    readableName: "London"
  },

  washington: {
    lat: 38.87292620720992,
    lng: -77.01553344726562,
    zoom: 13,
    readableName: "Washington"
  },
  washington2: {
    lat: 38.863887875122494,
    lng: -77.06003665924072,
    zoom: 15
  },

  paris: {
    lat: 48.85663993129474,
    lng: 2.345409393310547,
    zoom: 13,
    readableName: "Paris"
  },

  chicago: {
    lat: 41.89433914769623,
    lng: -87.66501903533936,
    zoom: 15,
    readableName: "Chicago"
  },

  munich: {
    lat: 48.131703904900526,
    lng: 11.576026529073715,
    zoom: 15,
    readableName: "Munich"
  },

  tokyo: {
    lat: 35.65631989614476,
    lng: 139.80274200439453,
    zoom: 12,
    readableName: "Tokyo"
  },

  sao_paulo: {
    lat: -23.5484875099175,
    lng: -406.66271209716797,
    zoom: 13,
    readableName: "São Paulo"
  },

  lima: {
    lat: -12.079694014442872,
    lng: -77.04008102416992,
    zoom: 13,
    readableName: "Lima"
  },

  cape_town: {
    lat: -33.93673769121762,
    lng: 18.457374572753906,
    zoom: 13,
    readableName: "Cape Town",
  },

  cairo: {
    lat: 30.058025662812675,
    lng: -328.7342834472656,
    zoom: 13,
    readableName: "Cairo"
  },

  istanbul: {
    lat: 41.032686477579496,
    lng: -330.98527908325195,
    zoom: 13,
    readableName: "Istanbul"
  },

  moscow: {
    lat: 55.75263431805921,
    lng: -322.37380027770996,
    zoom: 15,
    readableName: "Moscow"
  },

  montreal: {
    lat: 45.48726020866349,
    lng: -73.58247756958008,
    zoom: 15,
    readableName: "Montreal"
  },

  mexico_city: {
    lat: 19.396577648488794,
    lng: -819.0681838989258,
    zoom: 13,
    readableName: "Mexico City"
  },

  karachi: {
    lat: 24.844462411567203,
    lng: -652.9821968078613,
    zoom: 13,
    readableName: "Karachi"
  },

  new_orleans: {
    lat: 29.942514770914915,
    lng: -810.1344108581543,
    zoom: 13,
    readableName: "New Orleans"
  },
  new_orleans2: {
    lat: 29.943500229171526,
    lng: -810.1004219055176,
    zoom: 15,
    readableName: "New Orleans"
  },

  los_angeles: {
    lat: 33.69313789270753,
    lng: -117.77257919311523,
    zoom: 13,
    readableName: "Los Angeles"
  },

  baarle_nassau_baarle_hertog: {
    lat: 51.443669809372885,
    lng: -355.0686836242676,
    zoom: 15,
    readableName: "Baarle Nassau and Baarle Hertog"
  },

  mexican_american_border: {
    lat: 32.66979809274563,
    lng: -475.46957015991205,
    zoom: 13,
    readableName: "Mexican/American border"
  }
};

// 404 page using mapbox to show cities around the world.

// Helper to generate the kind of coordinate pairs I'm using to store cities

/* global L, scenes */ // These come from other scripts

L.mapbox.accessToken = 'pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJjaXMwaXEwYjUwM2l6MnpwOHdodTh6Y24xIn0.JOD0uX_n_KXqhJ7ERnK0Lg';
const map = L.mapbox.map('map', 'mapbox.pencil', {
  // Disable zooming by all methods
  zoomControl: false,
  touchZoom: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
});

/* eslint-disable no-unused-vars */
function coords() {
  /* eslint-enable no-unused-vars */
  const center = map.getCenter();
  return { lat: center.lat, lng: center.lng, zoom: map.getZoom() };
}

function go(area) {
  const areas = Object.keys(scenes);
  const place = area || areas[Math.floor(Math.random() * areas.length)];
  const scene = scenes[place];
  /* eslint-disable no-console */
  console.log(`Permalink here: https://controversial.io/404?${place}`);
  /* eslint-enable no-console */
  map.setView(
    [scene.lat, scene.lng],
    scene.zoom
  );
}


document.addEventListener('DOMContentLoaded', () => {
  if (scenes[window.location.search.substring(1)]) {
    go(window.location.search.substring(1));
  } else {
    go();
  }

  document.addEventListener('mousewheel', e => map.panBy([e.deltaX, e.deltaY], { animate: false }));
});

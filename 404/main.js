// 404 page using mapbox to show cities around the world.

// Helper to generate the kind of coordinate pairs I'm using to store cities
function coords() {
  var center = map.getCenter();
  return {lat: center.lat, lng: center.lng, zoom: map.getZoom()};
}


L.mapbox.accessToken = "pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJjaXMwaXEwYjUwM2l6MnpwOHdodTh6Y24xIn0.JOD0uX_n_KXqhJ7ERnK0Lg";
var map = L.mapbox.map("map", "mapbox.pencil", {zoomControl: false});

function go(city) {
  var placenames = Object.keys(places);
  city = city || placenames[Math.floor(Math.random() * placenames.length)];
  var pos = places[city];
  map.setView(
    [pos.lat, pos.lng],
    pos.zoom
  );
}

if (places[window.location.search.substring(1)]) {
  go(window.location.search.substring(1));
} else {
  go();
}

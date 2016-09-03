// 404 page using mapbox to show cities around the world.

// Helper to generate the kind of coordinate pairs I'm using to store cities
function bounds() {
  var mapbounds = map.getBounds();
  return [
    [mapbounds._northEast.lat, mapbounds._northEast.lng],
    [mapbounds._southWest.lat, mapbounds._southWest.lng],
    map.getZoom()
  ];
}


L.mapbox.accessToken = "pk.eyJ1IjoiY29udHJvdmVyc2lhbCIsImEiOiJjaXMwaXEwYjUwM2l6MnpwOHdodTh6Y24xIn0.JOD0uX_n_KXqhJ7ERnK0Lg";
var map = L.mapbox.map("map", "mapbox.pencil", {zoomControl: false});

function go(index) {
  var placenames = Object.keys(places);
  index = typeof index === "undefined" ? Math.floor(Math.random() * placenames.length) : index;
  var coords = places[placenames[index]];
  map.fitBounds(coords.slice(0, 2));
  map.setZoom(coords[2]);
}

go();

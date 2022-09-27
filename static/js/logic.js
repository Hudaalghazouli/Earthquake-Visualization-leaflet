var newYorkCoords = [40.73, -74.0059];
var mapZoomLevel = 12;

// Create the createMap function.
function createMap(earthLayer) {
  // Create the tile layer that will be the background of our map.
  var streetmap = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  );
  // Create a baseMaps object to hold the lightmap layer.
  var baseMaps = {
    "Street Map": streetmap,
  };
  // Create an overlayMaps object to hold the bikeStations layer.
  var overlayMaps = {
    "Earth quakes": earthLayer,
  };
  // Create the map object with options.
  var map = L.map("map", {
    center: newYorkCoords,
    zoom: mapZoomLevel,
    layers: [streetmap, earthLayer],
  });
  // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
  L.control
    .layers(baseMaps, overlayMaps, {
      collapsed: false,
    })
    .addTo(map);
}

// Create the createMarkers function.
function createMarkers(data) {
  console.log(data);

  // Pull the "stations" property from response.data.
  var features = data.features;
  // Initialize an array to hold the bike markers.
  var earthquakesMarkers = [];
  // Loop through the stations array.
  for (var i = 0; i < features.length; i++) {
    // For each station, create a marker, and bind a popup with the station's name.
    var earthquakes = L.marker([
      features[i].geometry.coordinates[0],
      features[i].geometry.coordinates[1],
    ]).bindPopup(
      `<h2>ID: ${
        (features[i].geometry.coordinates[0],
        features[i].geometry.coordinates[1])
      } </h2><hr><b>Capacity: </b> ${features[i].properties.place}`
    );
    // Add the marker to the bikeMarkers array.
    earthquakesMarkers.push(earthquakes);
  }
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  var earthLayer = L.layerGroup(earthquakes);
  createMap(earthLayer);
}

// Perform an API call to the Citi Bike API to get the station information. Call createMarkers when it completes.
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then(createMarkers);

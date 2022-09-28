var AmericaCoords = [39.7392, -104.9903];
var mapZoomLevel = 5;

// Create the createMap function.
function createMap(
  mag1Layer,
  mag2Layer,
  mag3Layer,
  mag4Layer,
  mag5Layer,
  mag6Layer
) {
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
    "Magnitude < 2.5": mag1Layer,
    "Magnitude < 5.4 > 2.5": mag2Layer,
    "Magnitude < 6.0 > 5.4": mag3Layer,
    "Magnitude < 6.9 > 6.0": mag4Layer,
    "Magnitude < 7.9 > 6.9": mag5Layer,
    "Magnitude > 7.9": mag6Layer,
  };
  // Create the map object with options.
  var map = L.map("map", {
    center: AmericaCoords,
    zoom: mapZoomLevel,
    layers: [
      streetmap,
      mag1Layer,
      mag2Layer,
      mag3Layer,
      mag4Layer,
      mag5Layer,
      mag6Layer,
    ],
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
  var features = data.features;
  // Initialize an array to hold the markers.
  var earthquakesMarkers = [];
  var mag1 = []; // over 40
  var mag2 = []; // 25-40
  var mag3 = [];
  var mag4 = [];
  var mag5 = [];
  var mag6 = [];
  // Loop through the stations array.
  for (var i = 0; i < features.length; i++) {
    //console.log(features[i].properties.mag);
    //create a marker, and bind a popup.
    var earthquakes = L.marker([
      features[i].geometry.coordinates[1],
      features[i].geometry.coordinates[0],
    ])
      .bindPopup(`<h2>Place: ${features[i].properties.place}</h2><hr><b>Coordinates: </b> 
    ${features[i].geometry.coordinates[1]} ${features[i].geometry.coordinates[0]}<hr><b>Depth: </b> ${features[i].geometry.coordinates[2]} <hr><b>Magnitudes: ${features[i].properties.mag}`);
    // Add the marker to the earthquakesMarkers array.
    earthquakesMarkers.push(earthquakes);

    if (features[i].properties.mag < 2.5) mag1.push(earthquakes);
    else if (
      features[i].properties.mag > 2.5 &&
      features[i].properties.mag < 5.4
    )
      mag2.push(earthquakes);
    else if (
      features[i].properties.mag > 5.4 &&
      features[i].properties.mag < 6.0
    )
      mag3.push(earthquakes);
    else if (
      features[i].properties.mag > 6.0 &&
      features[i].properties.mag < 6.9
    )
      mag4.push(earthquakes);
    else if (
      features[i].properties.mag > 6.9 &&
      features[i].properties.mag < 7.9
    )
      mag5.push(earthquakes);
    else mag6.push(earthquakes);
  }
  // Create a layer group, and pass it to the createMap function.
  var mag1Layer = L.layerGroup(mag1);
  var mag2Layer = L.layerGroup(mag2);
  var mag3Layer = L.layerGroup(mag3);
  var mag4Layer = L.layerGroup(mag4);
  var mag5Layer = L.layerGroup(mag5);
  var mag6Layer = L.layerGroup(mag6);
  // Create a layer group that's made from the bike markers array, and pass it to the createMap function.
  // var bikeLayer = L.layerGroup(bikeMarkers);
  createMap(mag1Layer, mag2Layer, mag3Layer, mag4Layer, mag5Layer, mag6Layer);
}

// Perform an API call. Call createMarkers when it completes.
d3.json(
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
).then(createMarkers);

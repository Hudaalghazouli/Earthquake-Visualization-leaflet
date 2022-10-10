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
  var legend = L.control({
    position: "bottomright",
  });
  // add the prpporties for the legend
  legend.onAdd = function () {
    // create a div for the legend

    var div = L.DomUtil.create("div", "info legend");
    console.log(div);

    var intervals = [-10, 10, 30, 50, 70, 90];
    var colors = [
      "green",
      "YellowGreen",
      "Yellow",
      "orange",
      "darkOrange",
      "red",
    ];

    for (var i = 0; i < intervals.length; i++) {
      div.innerHTML +=
        "<i style='background: " +
        colors[i] +
        "'></i>" +
        intervals[i] +
        " to " +
        (intervals[i + 1] ? +intervals[i + 1] + "<br>" : " +"); // br to make them vertical
    }

    return div;
  };
  // add the legend to the map
  legend.addTo(map);
}

// Create the createMarkers function.
function createMarkers(data) {
  console.log(data);
  var features = data.features;
  // Initialize an array to hold the markers.
  var earthquakesMarkers = [];
  var mag1 = []; // <2.5
  var mag2 = []; // 2.5 to 5.4
  var mag3 = []; // 5.4 to 6
  var mag4 = []; // 6.1 to 6.9
  var mag5 = []; // 7 to 7.9
  var mag6 = []; // > 7.9

  for (var i = 0; i < features.length; i++) {
    //console.log(features[i].properties.mag);
    //create a marker, and bind a popup.
    //creating circles based on the magnitude
    //coloing the circles based on the depth
    var markerRadius = features[i].properties.mag * 15000;
    var markerColor;

    if (
      features[i].geometry.coordinates[2] >= -10 &&
      features[i].geometry.coordinates[2] < 10
    )
      markerColor = "green";
    else if (
      features[i].geometry.coordinates[2] >= 10 &&
      features[i].geometry.coordinates[2] < 30
    )
      markerColor = "YellowGreen";
    else if (
      features[i].geometry.coordinates[2] >= 30 &&
      features[i].geometry.coordinates[2] < 50
    )
      markerColor = "yellow";
    else if (
      features[i].geometry.coordinates[2] >= 50 &&
      features[i].geometry.coordinates[2] < 70
    )
      markerColor = "orange";
    else if (
      features[i].geometry.coordinates[2] >= 70 &&
      features[i].geometry.coordinates[2] < 90
    )
      markerColor = "darkOrange";
    else markerColor = "red";
    var earthquakes = L.circle(
      [
        features[i].geometry.coordinates[1],
        features[i].geometry.coordinates[0],
      ],
      {
        fillOPacity: 0.3,
        color: markerColor,
        fillerColor: markerColor,
        radius: markerRadius,
        weight: 1,
      }
    )
      .bindPopup(`<h2>Place: ${features[i].properties.place}</h2><hr><b>Coordinates: </b> 
    ${features[i].geometry.coordinates[1]} ${features[i].geometry.coordinates[0]}<hr><b>Depth: </b> ${features[i].geometry.coordinates[2]} <hr><b>Magnitudes: ${features[i].properties.mag}`);
    // Add the marker to the earthquakesMarkers array.
    earthquakesMarkers.push(earthquakes);

    if (features[i].properties.mag <= 2.5) mag1.push(earthquakes);
    else if (
      features[i].properties.mag > 2.5 &&
      features[i].properties.mag <= 5.4
    )
      mag2.push(earthquakes);
    else if (
      features[i].properties.mag > 5.4 &&
      features[i].properties.mag <= 6.0
    )
      mag3.push(earthquakes);
    else if (
      features[i].properties.mag > 6.0 &&
      features[i].properties.mag <= 6.9
    )
      mag4.push(earthquakes);
    else if (
      features[i].properties.mag > 6.9 &&
      features[i].properties.mag <= 7.9
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

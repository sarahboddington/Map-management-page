// Initialise the map
var map1 = L.map('map', {
    zoomControl: false,
    scrollWheelZoom: false,
    smoothWheelZoom: true,
    smoothSensitivity: 3, 
  }).setView([-41.29012931030752, 174.76792012621496], 5);

  var currentMarker;

  //Adding marker on click
  function addMarkeronClick(e) {
    if(currentMarker != null) {
    map1.removeLayer(currentMarker) //Removes last marker
    }

    coords = e.latlng;
    currentMarker = new L.Marker(coords, {draggable:true});
    map1.addLayer(currentMarker);
  }
  
  map1.on('click', addMarkeronClick);
  
  // Retrieve coordinates from search
  var geocoder = L.Control.geocoder({
    defaultMarkGeocode: false
  })
    .on('markgeocode', function(e) {
      if(currentMarker != null) {
        map1.removeLayer(currentMarker) //Removes last marker
      }
      coords = e.geocode.center;
      const newMarker = L.marker(coords, {draggable:true});
      map1.addLayer(newMarker);
      currentMarker = newMarker;
      map1.setView(coords, 14);
      
    })
    .addTo(map1);
  
  var locations = {};
    // initialise lists of markers for clusters
  
  L.control.zoom({
    position: 'topright'
  }).addTo(map1);
  
  // Add the tiles (image of the maps)
  var lyr_streets = L.tileLayer('http://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      minZoom: 2,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  });
  
  lyr_streets.addTo(map1);
  
  // Fetch the JSON from local file, parse through
  fetch('https://tong-jt.github.io/map-test/locations.json')
  .then(response => response.json())
  .then(data => {

    // Parsing through each individual entry and extract info
    data.features.forEach(function(feature) {
      var id = feature.properties.id;
      var title = feature.properties.name;
      var category = feature.properties.category;
      var coordinates = feature.geometry.coordinates;
      

      locations[id] = {
        properties: feature.properties,
        coordinates: [coordinates[1], coordinates[0]] 
      };
      
      // Append the dynamic content (title and category) to the selectiondiv
      $(".selectiondiv").append('<div id="' + id + '" class="locationdiv"><strong>' + title + '</strong><br>' + category + '</div>');

      const locationSection = document.getElementById(id);
      
      locationSection.addEventListener('click', function() {
        console.log(id);
        openForm(locations[id]);
      });

      
    });

  })
  .catch(error => console.error('Error loading GeoJSON:', error));

  function openForm(feature) {
    var id = feature.properties.id;
    var title = feature.properties.name;
    var category = feature.properties.category;
    var description = feature.properties.description;
    var coordinates = feature.coordinates;

    $(locationname).val(title);
    $(locationtype).val(category);
    $(descriptionfield).val(description);
    var marker = L.marker(coordinates).addTo(map1);
  }
  
  
  
  
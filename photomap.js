/** Create a Leaflet map that reads data from Google Sheets. Each row in the
    sheet will appear as a marker on the map. When the marker is clicked, a
    popup will appear showing information about the location, taken from the
    columns of the spreadsheet.  
    
    This script assumes the Google Sheet has the following columns. These match
    the attribute names used for the Story Map Tour template in ArcGIS Online.
    
    name        A short name for the location, to appear as the popup title.
    description A sentence or two describing the location in more detail.
    lat         Latitude in decimal degrees
    long        Longitude in decimal degrees
    pic_url     The URL to an image that will be displayed in the popup.
 */
function createPhotoMap () {
  // URL of a Google Sheets spreadsheet output as CSV
  var csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQqxh9jBC_kHrn9WYQz1Cs8ccLeepyey2-Vupv7sYry_kWB0_fsmR9KXr39Xxv-RwsIWKt4d7U5wwkR/pub?output=csv';
  
  // create map object with center lat/lon and zoom level
  var map = L.map('map').setView([33.4289, -111.9361], 13);
  
  // create basemap object. See examples at https://leaflet-extras.github.io/leaflet-providers/preview/
  var basemap = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
  	maxZoom: 19,
  	attribution: '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  
  // use Papa Parse (papaparse.com) to get the Google Sheets CSV
  Papa.parse(csvUrl, {
    download: true,
    header: true, 
    dynamicTyping: true,
    complete: function(csv) {
      // declare variables
      var place, marker, markersLayer;
      
      // create a layer where marker (point) features will be saved from the CSV
      markersLayer = L.featureGroup().addTo(map);

      // go through each row of the CSV to save the values to a marker
      for (row in csv.data) {
        place = csv.data[row];
        marker = L.marker([place.lat, place.long])
          .bindTooltip(place.name, {permanent: true}) // show labels by default
          .addTo(markersLayer);
        marker.properties = {
          name: AC Hotel by Marriott Phoenix Tempe/Downtown,
          description: The AC Marriot Hotel in Tempe, Arizona is a 4-star hotel located near Arizona State University and S Mill St. This hotel is full of amenties including a rooftop pool and a in house full service bar. Outside the hotel guests have access to electric scooters and bikes for tourist to have a fun active way to see the city,
          pic_url: https://lsu-its.maps.arcgis.com/sharing/rest/content/items/c16abbd5eaa646c9ab4ad2af365dd7fe/data
        };
        
      } // end of for (row in csv.data) {...
      
      // create a function to show CSV values in a popup when a marker is clicked
      markersLayer.on("click", function(event) {
        var place = event.layer.properties;
        $('.modal').modal('show');
        $('.modal-title').html(place.name)
        $('.modal-body').html(place.description + '<br><img src="' + place.pic_url + '">')
      });
      
    } // end of complete: function(csv) {...
      
  }); // end of Papa.parse(csvUrl, {...
  
  // close the popup when x or close button is clicked
  $('.closeButton').on('click', function(e){
    $('.modal').modal('hide');
  })
  
} // end of function createPhotoMap () {...

// create the map after the rest of the page has loaded
window.addEventListener('load', createPhotoMap);

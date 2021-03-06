/**
* The CenterControl adds a control to the map that recenters the map on
* Chicago.
* This constructor takes the control DIV as an argument.
* @constructor
*/
function CenterControl(controlDiv, map) {

// Set CSS for the control border.
var controlUI = document.createElement('div');
controlUI.style.backgroundColor = '#fff';
controlUI.style.border = '2px solid #fff';
controlUI.style.borderRadius = '3px';
controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
controlUI.style.cursor = 'pointer';
controlUI.style.marginBottom = '22px';
controlUI.style.textAlign = 'center';
controlUI.title = 'Click to recenter the map';
controlDiv.appendChild(controlUI);

// Set CSS for the control interior.
var controlText = document.createElement('div');
controlText.style.color = 'rgb(25,25,25)';
controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
controlText.style.fontSize = '16px';
controlText.style.lineHeight = '38px';
controlText.style.paddingLeft = '5px';
controlText.style.paddingRight = '5px';
controlText.innerHTML = 'Center Map';
controlUI.appendChild(controlText);

// Setup the click event listeners: simply set the map to Chicago.
controlUI.addEventListener('click', function() {
  map.setCenter({lat: 41.441, lng: -72.777});
});

}

function initMap() {
  const origin = {lat: 41.441, lng: -72.777};

  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 14,
    center: origin
  });

  const clickHandler = new ClickEventHandler(map);

  // Create the DIV to hold the control and call the CenterControl()
  // constructor passing in this DIV.
  const centerControlDiv = document.createElement('div');
  const centerControl = new CenterControl(centerControlDiv, map);

  centerControlDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);
};

/**
 * @constructor
 */
const ClickEventHandler = function(map) {
  this.map = map;
  this.directionsService = new google.maps.DirectionsService;
  this.directionsDisplay = new google.maps.DirectionsRenderer;
  this.directionsDisplay.setMap(map);
  // this.infowindow = new google.maps.InfoWindow;
  // this.infowindowContent = document.getElementById('infowindow-content');
  // this.infowindow.setContent(this.infowindowContent);

  // Listen for clicks on the map.
  this.map.addListener('click', this.handleClick.bind(this));

  // Create an array to store each click-event coordinate
  this.coordinates = [];
  };

ClickEventHandler.prototype.handleClick = function(event) {
  console.log('You clicked on: ' + event.latLng);

  // store each coordinate as an object so it can later be used as a waypoint
  this.coordinates.push({
    location: event.latLng,
    stopover: true,
  });

  if (this.coordinates.length > 1) {
    this.calculateAndDisplayRoute();
  }
};

ClickEventHandler.prototype.calculateAndDisplayRoute = function() {
  const lastCoord = this.coordinates.length - 1;
  const me = this;
  this.directionsService.route({
    origin: this.coordinates[0].location,
    waypoints: this.coordinates.slice(1, lastCoord),
    destination: this.coordinates[lastCoord].location,
    travelMode: 'BICYCLING'
  }, function(response, status) {
    if (status === 'OK') {
      const polyLine = response.routes[0].overview_polyline;

      me.directionsDisplay.setOptions({ preserveViewport: true });
      me.directionsDisplay.setDirections(response);
      console.log('New polyline:', polyLine);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
};

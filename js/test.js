	 var map;
	 var markers = [];
	 var polygon = null;
	 var placeMarkers = [];
	 var locations = [
	   { title: 'Monterey Bay Aquarium', location: { lat: 36.618253, lng: -121.901481 } },
	   { title: 'Point Lobos', location: { lat: 36.5216283, lng: -121.9527333 } }
	 ];
	 var styles = [{
	   featureType: 'administrative',
	   elementType: 'labels.text.stroke',
	   stylers: [{ color: '#ffffff' }, { weight: 6 }]
	 }, {
	   featureType: 'administrative',
	   elementType: 'labels.text.fill',
	   stylers: [{ color: '#e85113' }]
	 }, {
	   featureType: 'road.highway',
	   elementType: 'geometry.stroke',
	   stylers: [{ color: '#efe9e4' }, { lightness: -40 }]
	 }, {
	   featureType: 'transit.station',
	   stylers: [{ weight: 9 }, { hue: '#e85113' }]
	 }, {
	   featureType: 'road.highway',
	   elementType: 'labels.icon',
	   stylers: [{ visibility: 'off' }]
	 }, {
	   featureType: 'water',
	   elementType: 'labels.text.stroke',
	   stylers: [{ lightness: 100 }]
	 }, {
	   featureType: 'water',
	   elementType: 'labels.text.fill',
	   stylers: [{ lightness: -100 }]
	 }, {
	   featureType: 'poi',
	   elementType: 'geometry',
	   stylers: [{ visibility: 'on' }, { color: '#f0e4d3' }]
	 }, {
	   featureType: 'road.highway',
	   elementType: 'geometry.fill',
	   stylers: [{ color: '#efe9e4' }, { lightness: -25 }]
	 }];

	 function initMap() {
	   map = new google.maps.Map(document.getElementById('map'), {
	     center: { lat: 36.603954, lng: -121.898460 },
	     zoom: 13,
	     styles: styles,
	     mapTypeControl: false
	   });
	  var largeInfowindow = new google.maps.InfoWindow();

        // The following group uses the location array to create an array of markers on initialize.
        for (var i = 0; i < locations.length; i++) {
          // Get the position from the location array.
          var position = locations[i].location;
          var title = locations[i].title;
          // Create a marker per location, and put into markers array.
           var marker = new google.maps.Marker({
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
          });
          // Push the marker to our array of markers.
          markers.push(marker);
          // Create an onclick event to open an infowindow at each marker.
          marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
          });
        }
        //document.getElementById('show-listings').addEventListener('click', showListings);
        //document.getElementById('hide-listings').addEventListener('click', hideListings);
      }

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      }

      // This function will loop through the markers array and display them all.
      function showListings() {
        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
        }
        map.fitBounds(bounds);
      }

      // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }
    

	 var ViewModel = function() {
	   this.searchTerm = ko.observable();
	   initMap();
	   this.showPlaces = function() {
	     showListings();
	   }
	   this.hidePlaces = function() {
	     hideListings();
	   }
	   this.doSearch = function() {
	     var valueEntered = this.searchTerm();
	     var geocoder = new google.maps.Geocoder();
	     var autocomplete = new google.maps.places.SearchBox(valueEntered);
	     autocomplete.bindTo('bounds', map);
	     if (valueEntered == "") {
	       window.alert('You must enter an area, or address.');
	     }
	     else {
	       //textSearchPlaces(valueEntered);
	     }
	   }
	 };

function startApp() {
	ko.applyBindings(new ViewModel());
}
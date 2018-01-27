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
	 }
	 function textSearchPlaces() {
        var bounds = map.getBounds(searchForTerm);
        hideMarkers(placeMarkers);
        var placesService = new google.maps.places.PlacesService(map);
        placesService.textSearch({
          query: searchForTerm,
          bounds: bounds
        }, function(results, status) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            createMarkersForPlaces(results);
          }
        });
      }
  function createMarkersForPlaces(places) {
        var bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < places.length; i++) {
          var place = places[i];
          var icon = {
            url: place.icon,
            size: new google.maps.Size(35, 35),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(15, 34),
            scaledSize: new google.maps.Size(25, 25)
          };
          var marker = new google.maps.Marker({
            map: map,
            icon: icon,
            title: place.name,
            position: place.geometry.location,
            id: place.place_id
          });
          var placeInfoWindow = new google.maps.InfoWindow();
          marker.addListener('click', function() {
            if (placeInfoWindow.marker == this) {
              console.log("This infowindow already is on this marker!");
            } else {
              getPlacesDetails(this, placeInfoWindow);
            }
          });
          placeMarkers.push(marker);
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        }
        map.fitBounds(bounds);
      }
      function getPlacesDetails(marker, infowindow) {
      var service = new google.maps.places.PlacesService(map);
      service.getDetails({
        placeId: marker.id
      }, function(place, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          infowindow.marker = marker;
          var innerHTML = '<div>';
          if (place.name) {
            innerHTML += '<strong>' + place.name + '</strong>';
          }
          if (place.formatted_address) {
            innerHTML += '<br>' + place.formatted_address;
          }
          if (place.formatted_phone_number) {
            innerHTML += '<br>' + place.formatted_phone_number;
          }
          if (place.opening_hours) {
            innerHTML += '<br><br><strong>Hours:</strong><br>' +
                place.opening_hours.weekday_text[0] + '<br>' +
                place.opening_hours.weekday_text[1] + '<br>' +
                place.opening_hours.weekday_text[2] + '<br>' +
                place.opening_hours.weekday_text[3] + '<br>' +
                place.opening_hours.weekday_text[4] + '<br>' +
                place.opening_hours.weekday_text[5] + '<br>' +
                place.opening_hours.weekday_text[6];
          }
          if (place.photos) {
            innerHTML += '<br><br><img src="' + place.photos[0].getUrl(
                {maxHeight: 100, maxWidth: 200}) + '">';
          }
          innerHTML += '</div>';
          infowindow.setContent(innerHTML);
          infowindow.open(map, marker);
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
        }
      });
    }
    function hideMarkers(markers) {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
      }

	 var ViewModel = function() {
	   this.searchTerm = ko.observable();
	   initMap();
	   this.doSearch = function() {
	     var valueEntered = this.searchTerm();
	     var geocoder = new google.maps.Geocoder();
	     var autocomplete = new google.maps.places.SearchBox(valueEntered);
	     autocomplete.bindTo('bounds', map);
	     if (valueEntered == "") {
	       window.alert('You must enter an area, or address.');
	     }
	     else {
	       textSearchPlaces(valueEntered);
	     }
	   }
	 };

function startApp() {
	ko.applyBindings(new ViewModel());
}
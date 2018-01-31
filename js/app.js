//Global variable to use throughout program
var map;
var markers = [];
var polygon = null;
var placeMarkers = [];
var locations = [
  {
    title: 'Monterey Bay Aquarium',
    location: {
      lat: 36.618253,
      lng: -121.901481
    }
  },
  {
    title: 'Point Lobos',
    location: {
      lat: 36.5216283,
      lng: -121.9527333
    }
  },
  {
    title: 'CSU Monterey Bay',
    location: {
      lat: 36.6547159,
      lng: -121.7968211
    }
  },
  {
    title: 'Fisherman\'s Wharf',
    location: {
      lat: 36.6047,
      lng: -121.8925
    }
  },
  {
    title: 'Cannary Row',
    location: {
      lat: 36.613293,
      lng: -121.897732
    }
  }
];

// Function to create listner on makers for info windows within the initMap Function
function funInitAddListner(marker, largeInfowindow) {
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });
}
// Function to initiate map, and create a new map and markers
function initMap() {
  // Constructor for the new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 36.603954,
      lng: -121.898460
    },
    zoom: 13,
    mapTypeControl: false
  });
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();

  // Use location array to create markers and push them to the map
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: i
    });

    markers.push(marker);
    /*marker.addListener('click', function() {
    	populateInfoWindow(this, largeInfowindow);
    });*/
    funInitAddListner(marker, largeInfowindow);
    bounds.extend(markers[i].position);
  }

  map.fitBounds(bounds);
}

// Function that connects to "show places" button
function showListings() {
  // Clears all of the markers before showing all markers on map
  hideMarkers(placeMarkers);
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
    bounds.extend(markers[i].position);
  }
  map.fitBounds(bounds);
}

// Function sets panorama for streetview when marker clicked
//var panorama;
function getStreetView(infowindow, marker) {
  //Adds title in info window
  infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
  var panoramaOptions = {
    position: marker.position,
    pov: {
      heading: 100,
      pitch: 15
    }
  };
  //Creates the streetview panorama using the above options
  var panorama = new google.maps.StreetViewPanorama(
    document.getElementById('pano'), panoramaOptions);
}
// Function that populate the info window of clicked markers
// Only one marker will be open at a time
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.setMarker = null;
    });

    //Gets the street view and sets panorama
    getStreetView(infowindow, marker);
    // Opens for the correct marker
    infowindow.open(map, marker);
  }
}

// Hides the markers for the "hide places" button and when filtering
function hideMarkers(markers) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
}

//When user filters the places, gets the details for the place when marker clicked
function getPlacesDetails(marker, infowindow) {
  var service = new google.maps.places.PlacesService(map);
  service.getDetails({
    placeId: marker.id
  }, function(place, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // Set the marker property on this infowindow so it isn't created again.
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
        innerHTML += '<br><br><img src="' + place.photos[0].getUrl({
            maxHeight: 100,
            maxWidth: 200
          }) + '">';
      }
      innerHTML += '</div>';
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    }
  });
}
// Function to add the event lisnters for the createMakersForPlaces function
function createMarkersListner(marker, placeInfoWindow) {
  marker.addListener('click', function() {
    if (placeInfoWindow.marker == this) {
      console.log("This infowindow already is on this marker!");
    } else {
      getPlacesDetails(this, placeInfoWindow);
    }
  });
}
// This function creates markers for each place found in filtering
// However, does zoom into the first location on the filtering list
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
    // Create a marker for each place.
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location,
      id: place.place_id
    });
    // Create a single infowindow to be used with the place details information
    // so that only one is open at once.
    var placeInfoWindow = new google.maps.InfoWindow();
    // If a marker is clicked, do a place details search on it in the next function.
    createMarkersListner(marker, placeInfoWindow);
    placeMarkers.push(marker);
    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
  }
  map.fitBounds(bounds);
}

// Function to add special markers when users filter the list of places
function placeServiceListner(placesService, title, bounds) {
  placesService.textSearch({
    query: title,
    bounds: bounds
  }, function(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      // If status OK, then creates special marker
      createMarkersForPlaces(results);
    }
  });
}
// This is the viewModel and controls the functionality of program
var ViewModel = function() {
  // Variables for controlling the filtering and list
  this.searchTerm = ko.observable("");
  this.locationsList = ko.observableArray([]);
  // Will call the function to initate the map
  initMap();

  // Loads all of the locations into the list
  for (var i = 0; i < locations.length; i++) {
    var title = locations[i].title;
    this.locationsList.push(title);
  }

  //When "Show Places" button clicked this function called
  this.showPlaces = function() {
    // Clears and resets list
    this.locationsList.removeAll();

    for (var i = 0; i < locations.length; i++) {
      var title = locations[i].title;
      this.locationsList.push(title);
    }
    // Calls above function to show all places and markers
    showListings();
  };

  //When "Hide Places" button clicked this function called
  this.hidePlaces = function() {
    // Clears and resets list
    this.locationsList.removeAll();

    for (var i = 0; i < locations.length; i++) {
      var title = locations[i].title;
      this.locationsList.push(title);
    }

    // Calls function to hide special markers from filtering
    hideMarkers(placeMarkers);
    // Calls function to hide all normal markers
    hideMarkers(markers);
  };

  // After user presses submit for filtering, calls this
  this.doSearch = function() {
    // Grabs user input and test that it's not empty
    var search = this.searchTerm();
    if (search === "") {
      window.alert('You must enter an area, or address.');
      return;
    } else {
      // Clears out locations list and updates with places that match users input
      this.locationsList.removeAll();
      for (var i in markers) {
        markers[i].setMap(null);
      }

      // For locations that match the users filtering
      for (var x in locations) {
        var title = locations[x].title;
        if (locations[x].title.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
          // Adds to the list
          this.locationsList.push(title);
          var bounds = map.getBounds();
          // Hides all markers
          hideMarkers(placeMarkers);
          // Searches for each of the matching locations
          var placesService = new google.maps.places.PlacesService(map);
          placeServiceListner(placesService, title, bounds);
        }
      }
    }
  };
};

// Once website is ran, will run this function
function startApp() {
  // Creates new instance of the ViewModel
  ko.applyBindings(new ViewModel());
}
// Function that handels error when loading Google
function googleError() {
  window.alert("failed to get google map resources");
}
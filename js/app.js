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
// Function that will manage the markers colors and styling on the map
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}
// Function to create listner on makers for info windows within the initMap Function
function funInitAddListner(marker, largeInfowindow) {
  marker.addListener('click', function() {
    populateInfoWindow(this, largeInfowindow);
  });
  //Create the listners and colors for marker animation
  var defaultIcon = makeMarkerIcon('0091ff');
  var highlightedIcon = makeMarkerIcon('FFFF24');
  marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });
  marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
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
  var defaultIcon = makeMarkerIcon('0091ff');
  for (var i = 0; i < locations.length; i++) {
    var position = locations[i].location;
    var title = locations[i].title;
    var marker = new google.maps.Marker({
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });

    markers.push(marker);
    funInitAddListner(marker, largeInfowindow);
    bounds.extend(markers[i].position);
  }
  showListings();
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

//Get wiki articles
function getWiki(infowindow, marker) {
  //Adds title in info window
  infowindow.setContent('<div>' + marker.title + '</div><div id="pano">');
  // Wikipedia AJAX request (Cross-site Request - JSONP )
  var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
  //If request times out, says "failed to load resources"
  var wikiRequestTimeout = setTimeout(function() {
    infowindow.setContent(infowindow.getContent() + "<br> Failed to get Wikipedia resources");
  }, 8000);
  $.ajax({
    url: wikiUrl,
    dataType: "jsonp",
    //jsonp: "callback",
    success: function(response) {
      var articleList = response[1];
      for (var i = 0; i < articleList.length; i++) {
        var articleStr = articleList[i];
        var url = 'http://en.wikipedia.org/wiki/' + articleStr;
        infowindow.setContent(infowindow.getContent() + '<li><a href="' + url + '">' + articleStr + '</a></li>');
      }
      infowindow.setContent(infowindow.getContent() + '</div>');

      clearTimeout(wikiRequestTimeout);
    }
  });
}

//When user filters the places, gets the wiki pages for the place when marker clicked
function getPlacesDetails(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    infowindow.setContent('<div>' + marker.title + '</div>');
    infowindow.open(map, marker);
    infowindow.addListener('closeclick', function() {
      infowindow.setMarker = null;
    });

    //Gets the wikipedia articles
    getWiki(infowindow, marker);
    // Opens for the correct marker
    infowindow.open(map, marker);
  }
}
// Function to add the event lisnters for the createMakersForPlaces function
function createMarkersListner(marker, placeInfoWindow) {
  marker.addListener('click', function() {
    if (placeInfoWindow.marker == marker) {
      console.log("This infowindow already is on this marker!");
    } else {
      getPlacesDetails(marker, placeInfoWindow);
    }
  });
}

//Create marker for filtering and calls function to init window and wiki
function filterSearch(place, i) {
  var largeInfowindow = new google.maps.InfoWindow();
  var bounds = new google.maps.LatLngBounds();
  var flag = false;
  for (var i = 0; i < markers.length; i++) {
    //Filter for place
    if (markers[i].title == place.title) {
      var marker = markers[i];
      flag = true;
      //Call listner and add markers to map
      createMarkersListner(marker, largeInfowindow);
      marker.setMap(map);
      bounds.extend(place.location);
      map.fitBounds(bounds);
    }
  }
  // If place not found, alert user
  if (!flag) {
    window.alert("Place not found");
  }
}

// This is the viewModel and controls the functionality of program
var ViewModel = function() {
  // Variables for controlling the filtering and list
  this.searchTerm = ko.observable("");
  this.locationsList = ko.observableArray([]);
  // Will call the function to initate the map and show all markers
  initMap();

  // Loads all of the locations into the list
  for (var i = 0; i < locations.length; i++) {
    var title = locations[i].title;
    this.locationsList.push(title);
  }

  //When clicked: Show side menu
  this.showOptions = function() {
    var options = document.getElementById("optionsBox");
    var container = document.getElementById("containerBox");
    var maps = document.getElementById("map");
    if (options.style.display === "none") {
      options.style.display = "block";
      container.style.display = "block";
      maps.style.left = "362px";
    } else {
      options.style.display = "none";
      container.style.display = "none";
      maps.style.left = "0px";
    }
  };

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
  var self = this;
  //When "<location name>" button clicked or filtering entered this function called
  this.showLocation = function() {
    // Clears out locations list and updates with places that match users input
    self.locationsList.removeAll();
    var search = this;
    for (var i in markers) {
      markers[i].setMap(null);
    }
    // Calls function to hide special markers from filtering
    hideMarkers(placeMarkers);
    // Calls function to hide all normal markers
    hideMarkers(markers);

    // For locations that match the users filtering
    for (var x in locations) {
      var title = locations[x].title;
      if (locations[x].title.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
        // Adds to the list
        self.locationsList.push(title);

        //Add markers to places
        filterSearch(locations[x], x);
      }
    }
  };
  this.doSearch = function() {
    // Grabs user input and test that it's not empty
    var search = this.searchTerm();
    if (search === "") {
      window.alert('You must enter an area, or address.');
      return;
    } else {
      // Clears out locations list and updates with places that match users input
      self.locationsList.removeAll();
      // Calls function to hide special markers from filtering
      hideMarkers(placeMarkers);
      // Calls function to hide all normal markers
      hideMarkers(markers);

      // For locations that match the users filtering
      for (var x in locations) {
        var title = locations[x].title;
        if (locations[x].title.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
          // Adds to the list
          self.locationsList.push(title);

          // Add markers to places
          filterSearch(locations[x], x);
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
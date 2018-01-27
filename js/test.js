	 var map;
	 var markers = [];
	 var polygon = null;
	 var placeMarkers = [];
	 var locations = [
	 	{ title: 'Monterey Bay Aquarium', location: { lat: 36.618253, lng: -121.901481 } },
	 	{ title: 'Point Lobos', location: { lat: 36.5216283, lng: -121.9527333 } },
	 	{ title: 'CSU Monterey Bay', location: { lat: 36.650945, lng: -121.790773 } },
	 	{ title: 'Fisherman\'s Wharf', location: { lat: 36.6047, lng: -121.8925 } },
	 	{ title: 'Cannary Row', location: { lat: 36.613293, lng: -121.897732 } }
	 ];

	 function initMap() {
	 	map = new google.maps.Map(document.getElementById('map'), {
	 		center: { lat: 36.603954, lng: -121.898460 },
	 		zoom: 13,
	 		mapTypeControl: false
	 	});
	 	var largeInfowindow = new google.maps.InfoWindow();
	 	var bounds = new google.maps.LatLngBounds();
	 	var drawingManager = new google.maps.drawing.DrawingManager({
	 		drawingMode: google.maps.drawing.OverlayType.POLYGON,
	 		drawingControl: true,
	 		drawingControlOptions: {
	 			position: google.maps.ControlPosition.TOP_LEFT,
	 			drawingModes: [
	 				google.maps.drawing.OverlayType.POLYGON
	 			]
	 		}
	 	});

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
	 		marker.addListener('click', function() {
	 			populateInfoWindow(this, largeInfowindow);
	 		});
	 		bounds.extend(markers[i].position);
	 	}

	 	map.fitBounds(bounds);
	 }

	 function showListings() {
	 	var bounds = new google.maps.LatLngBounds();
	 	for (var i = 0; i < markers.length; i++) {
	 		markers[i].setMap(map);
	 		bounds.extend(markers[i].position);
	 	}
	 	map.fitBounds(bounds);
	 }

	 function populateInfoWindow(marker, infowindow) {
	 	if (infowindow.marker != marker) {
	 		infowindow.marker = marker;
	 		infowindow.setContent('<div>' + marker.title + '</div>');
	 		infowindow.open(map, marker);
	 		infowindow.addListener('closeclick', function() {
	 			infowindow.setMarker = null;
	 		});
	 		var streetViewService = new google.maps.StreetViewService();
	 		var radius = 50;

	 		function getStreetView(data, status) {
	 			if (status == google.maps.StreetViewStatus.OK) {
	 				var nearStreetViewLocation = data.location.latLng;
	 				var heading = google.maps.geometry.spherical.computeHeading(
	 					nearStreetViewLocation, marker.position);
	 				infowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
	 				var panoramaOptions = {
	 					position: nearStreetViewLocation,
	 					pov: {
	 						heading: heading,
	 						pitch: 15
	 					}
	 				};
	 				var panorama = new google.maps.StreetViewPanorama(
	 					document.getElementById('pano'), panoramaOptions);
	 			}
	 			else {
	 				infowindow.setContent('<div>' + marker.title + '</div>' +
	 					'<div>No Street View Found</div>');
	 			}
	 		}
	 		streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
	 		infowindow.open(map, marker);
	 	}
	 }

	 function hideMarkers(markers) {
	 	for (var i = 0; i < markers.length; i++) {
	 		markers[i].setMap(null);
	 	}
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
	 				innerHTML += '<br><br><img src="' + place.photos[0].getUrl({ maxHeight: 100, maxWidth: 200 }) + '">';
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
	 			}
	 			else {
	 				getPlacesDetails(this, placeInfoWindow);
	 			}
	 		});
	 		placeMarkers.push(marker);
	 		if (place.geometry.viewport) {
	 			bounds.union(place.geometry.viewport);
	 		}
	 		else {
	 			bounds.extend(place.geometry.location);
	 		}
	 	}
	 	map.fitBounds(bounds);
	 }
	 // Will filter the users searches of places on map
	 function textSearchPlaces(search) {
	 	var bounds = map.getBounds();
	 	hideMarkers(placeMarkers);
	 }


	 var ViewModel = function() {
	 	this.searchTerm = ko.observable("");
	 	initMap();
	 	this.locationsList = ko.observableArray([]);

	 	for (var i = 0; i < locations.length; i++) {
	 		var title = locations[i].title;
	 		this.locationsList.push(title);
	 	}
	 	this.showPlaces = function() {
	 		this.locationsList.removeAll();

	 		for (var i = 0; i < locations.length; i++) {
	 			var title = locations[i].title;
	 			this.locationsList.push(title);
	 		}
	 		showListings();
	 	}
	 	this.hidePlaces = function() {
	 		hideMarkers(markers);
	 	}
	 	this.doSearch = function() {
	 		var search = this.searchTerm();
	 		if (search == "") {
	 			window.alert('You must enter an area, or address.');
	 			return;
	 		}
	 		else {
	 			alert(search);
	 			/*var geocoder = new google.maps.Geocoder();
	 			var searchBox = new google.maps.places.SearchBox(search);
	 			searchBox.setBounds(map.getBounds());
	 			textSearchPlaces(search);*/
	 			this.locationsList.removeAll();
	 			for (var i in markers) {
	 				markers[i].setMap(null);
	 			}

	 			for (var x in locations) {
	 				var title = locations[x].title;
	 				if (locations[x].title.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
	 					this.locationsList.push(title);
	 					var bounds = map.getBounds();
	 					hideMarkers(placeMarkers);
	 					var placesService = new google.maps.places.PlacesService(map);
	 					placesService.textSearch({
	 						query: title,
	 						bounds: bounds
	 					}, function(results, status) {
	 						if (status === google.maps.places.PlacesServiceStatus.OK) {
	 							createMarkersForPlaces(results);
	 						}
	 					});
	 				}
	 			}
	 		}
	 	}
	 	//this.searchTerm.subscribe(this.doSearch);
	 }

	 function startApp() {
	 	ko.applyBindings(new ViewModel());
	 }
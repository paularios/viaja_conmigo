var originCoords = {};
var dentinationCoords = {};
var originMarker;
var destinationMarker;
var gmap;
var map;
var address;

initMap = function () {
  navigator.geolocation.getCurrentPosition(
    function (position){
      originCoords =  {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      obtainAddressFromLatLng(originCoords, function(address){
    	  document.getElementById("origin").value = address;
      });
      gmap = GMaps({
                  div: '#map',
                  zoom: 13,
                  lat: originCoords.lat,
                  lng: originCoords.lng
                });
      map = gmap.map;
      originMarker = new google.maps.Marker({
        map: map,
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        position: new google.maps.LatLng(originCoords.lat,originCoords.lng)
      });
    },function(error){console.log(error);});
}

function addMarker(coords, color) {
	var marker;
	marker = new google.maps.Marker({
        map: map,
        icon: "https://maps.google.com/mapfiles/ms/icons/"+color+"-dot.png",
        position: new google.maps.LatLng(originCoords.lat,originCoords.lng)
    });
	return marker;
}

function obtainLatLngFromAddress() {
	var address = document.getElementById('destination').value;
	var geocoder = new google.maps.Geocoder();
	geocoder.geocode({'address': address}, function(results, status){
		if (status == 'OK'){
			destinationCoords = {
				lat: results[0].geometry.location.lat(),
				lng: results[0].geometry.location.lng()
			}
			destinationMarker = new google.maps.Marker({
				map: map,
				draggable: false,
		        icon: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
		        animation: google.maps.Animation.DROP,
		        position: new google.maps.LatLng(destinationCoords.lat, destinationCoords.lng)
		    });
			defineRoute(originCoords, destinationCoords);
		}
	});
}

function getLatLng(address, callback){
	var geocoder = new google.maps.Geocoder();
	var coords = {};
	geocoder.geocode({'address': address}, function(results, status){
		if (status == 'OK'){
			coords = {
				lat: results[0].geometry.location.lat(),
				lng: results[0].geometry.location.lng()
			}
			console.log(coords);
			callback(coords);
		}
	});
}

function obtainAddressFromLatLng(coords, callback) {
	var latlng = new google.maps.LatLng(coords.lat, coords.lng);
	var geocoder = new google.maps.Geocoder();
	var address;
	geocoder.geocode({
		'latLng': latlng
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			address = results[0].formatted_address;
			callback(address);
		}else{
			alert('Geocode no tuvo éxito por la siguiente razón: ' + status);
		}
	});
}

function defineRoute(originCoords, destinationCoords) {
	gmap.drawRoute({
        origin: [originCoords.lat, originCoords.lng],
        destination: [destinationCoords.lat, destinationCoords.lng],
        travelMode: 'driving',
        strokeColor: '#105FD0',
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
}

function obtainMultipleCoordsOverAroute(originCoords, destinationCoords) {
	var coordsLat =[];
  	var coordsLng = [];
  	var ponisLatLng = {}
  	gmap.travelRoute({
    	origin: [originCoords.lat, originCoords.lng],
    	destination: [destinationCoords.lat, destinationCoords.lng],
    	travelMode: 'driving',
    	strokeColor: '#105FD0',
    	strokeOpacity: 0.6,
    	strokeWeight: 6,
    	step: function(e) {
      		for(var i = 0; i<e.lat_lngs.length; i++){
      			coordsLat.push(e.lat_lngs[i].lat());
      			coordsLng.push(e.lat_lngs[i].lng());
      		}
    	}
  	});
  	coordsLatLng = {"lat": coordsLat, "lng": coordsLng}
  	return coordsLatLng;
}

function passengerJoinCoords(passengerOriginCoords, driverOriginCoords, driverDestinationCoords, coordsLat, coordsLng, callback) {
	var originDistance;
	var shortestDistance;
  	var distances = [];
  	var index;
  	var joinCoords = {};
  	var joinCoordsLng;
  	var joinCoordsLat;
	//console.log(coordsLat);
	//console.log(coordsLng);
  	setTimeout(function(){
		for (var i=0; i<coordsLat.length; i++) {
    		originDistance = mui.util.distanceLatLng(passengerOriginCoords.lat, passengerOriginCoords.lng, coordsLat[i], coordsLng[i], "kilometros");
        	distances.push(originDistance);
    	}
		shortestDistance = distances[0];
    	for (var i=0; i<distances.length; i++) {
    		if (distances[i] < shortestDistance) {
    			shortestDistance = distances[i];
    		}
    	}
    	//console.log(distances)
    	//console.log(shortestDistance)
    	index = distances.indexOf(shortestDistance);
      	//console.log(index);
  		joinCoordsLat = coordsLat[parseInt(index)];
  		//console.log(joinCoordsLat);
  		joinCoordsLng = coordsLng[parseInt(index)];
  		//console.log(joinCoordsLng);
    	joinCoords = {
            lat: joinCoordsLat,
            lng: joinCoordsLng
        }
      	callback(joinCoords);
	}, 7000);
}

function showDriverForm() {
	document.getElementById("driver-form").style.display = "block";
}
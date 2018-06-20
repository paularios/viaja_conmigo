var originCoords = {};
var dentinationCoords = {};
var originMarker;
var destinationMarker;
var gmap;
var map;

// ******** DRIVER FUNCTIONS ********

initMap = function () {
  navigator.geolocation.getCurrentPosition(
    function (position){
      originCoords =  {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
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
      setMap(originCoords, map, gmap); 
    },function(error){console.log(error);});
}

function setMap(originCoords, map, gmap){
	destinationMarker = new google.maps.Marker({
		map: map,
		draggable: true,
        icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        animation: google.maps.Animation.DROP,
        position: new google.maps.LatLng(originCoords.lat, originCoords.lng)
    });
	destinationMarker.addListener('click', toggleBounce);
	destinationMarker.addListener( 'dragend', function (event) {
        destinationCoords = {
          lat: this.getPosition().lat(),
          lng: this.getPosition().lng()
        }
        defineRoute(originCoords, destinationCoords, gmap);
        passengerOriginCoords = {
        		lat: -34.901086,
        		lng: -56.176461
        }
        passengerOriginMarker = new google.maps.Marker({
    		map: map,
    		draggable: true,
            icon: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
            animation: google.maps.Animation.DROP,
            position: new google.maps.LatLng(passengerOriginCoords.lat, passengerOriginCoords.lng)
        });
        passengerJoinCoords = passengerJoinCoords(passengerOriginCoords, originCoords, destinationCoords, gmap)
        //console.log(passengerJoinCoords);
        //passengerJoinMarker = new google.maps.Marker({
    	//	map: map,
    	//	draggable: true,
        //    icon: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
        //    animation: google.maps.Animation.DROP,
        //    position: new google.maps.LatLng(passengerJoinCoords.lat, passengerJoinCoords.lng)
        //});
	});
}

function toggleBounce() {
	if (destinationMarker.getAnimation() !== null) {
		destinationMarker.setAnimation(null);
	} else {
        destinationMarker.setAnimation(google.maps.Animation.BOUNCE);
    }
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
			destinationMarker.setIcon("https://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
			destinationMarker.setPosition(results[0].geometry.location);
		}
	});
}

function defineRoute(originCoords, destinationCoords, gmap) {
	gmap.drawRoute({
        origin: [originCoords.lat, originCoords.lng],
        destination: [destinationCoords.lat, destinationCoords.lng],
        travelMode: 'driving',
        strokeColor: '#105FD0',
        strokeOpacity: 0.6,
        strokeWeight: 6
    });
}

// ******** PASSENGER FUNCTIONS ********

function obtainMultipleCoordsOverAroute(originCoords, destinationCoords, gmap) {
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

function passengerJoinCoords(passengerOriginCoords, driverOriginCoords, driverDestinationCoords, gmap) {
	coordsOverAroute = obtainMultipleCoordsOverAroute(driverOriginCoords, driverDestinationCoords, gmap);
	var originDistance;
	var shortestDistance;
  	var distances = [];
	var coordsLat = [];
	var coordsLng = [];
  	var index;
  	var joinCoords = {};
  	var joinCoordsLng;
  	var joinCoordsLat;
	setTimeout(function(){
		coordsLat = coordsOverAroute.lat
    	coordsLng = coordsOverAroute.lng
		for (var i=0; i<coordsLat.length; i++) {
    		for (var j=0; j<coordsLng.length; j++){
        		originDistance = mui.util.distanceLatLng(passengerOriginCoords.lat, passengerOriginCoords.lng, coordsLat[i], coordsLng[j], "kilometros");
            	distances.push(originDistance);
    		}
    	}
		shortestDistance = distances[0];
    	for (var i=0; i<distances.length; i++) {
    		if (distances[i] < shortestDistance) {
    			shortestDistance = distances[i];
    		}
    	}
    	console.log(distances)
    	console.log(shortestDistance)
    	index = distances.indexOf(shortestDistance);
      	console.log(index);
    	setTimeout(function(){
    		console.log(coordsLat[parseInt(index)]);
      		joinCoordsLat = coordsLat[parseInt(index)];
      		console.log(joinCoordsLat);
      	}, 5000);
    	setTimeout(function(){
      		joinCoordsLng = coordsLng[parseInt(index)];
      		console.log(joinCoordsLng);
      	}, 5000);
    	joinCoords = {
            lat: joinCoordsLat,
            lng: joinCoordsLng
        }
        console.log(joinCoords);
	}, 5000);
  	return joinCoords;
}
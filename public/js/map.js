var map;
var geocoder;
var marker;
var currLocation;
var polygons = [];

function initialize() {

	// initialize map
    var mapOptions = {
        center: new google.maps.LatLng(38.6, -96),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // set-up and bind autocomplete
    var input = document.getElementById("address-field");
	var acOptions = {
		componentRestrictions: {country: 'us'}
	};
	var autocomplete = new google.maps.places.Autocomplete(input, acOptions);
	autocomplete.bindTo('bounds', map);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		acSearch(autocomplete.getPlace());
	});

	// instantiate geocoder for reverse geo-coding
	geocoder = new google.maps.Geocoder( {region: 'us'} );

	// instantiate map marker
	marker = new google.maps.Marker({
		map: map
	});
};

function acSearch(place) {
	map.setCenter(place.geometry.location);
	selectBoundary(place.geometry.location);
	marker.setPosition(place.geometry.location);
	currLocation = place.geometry.location;
}

function search(e) {
	e.preventDefault();
	codeAddress();
}

function codeAddress() {
	var address = $('#address-field').val();

	geocoder.geocode({ 'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			if (results[0]);
			map.setCenter(results[0].geometry.location);
			selectBoundary(results[0].geometry.location);
			marker.setPosition(results[0].geometry.location);
			currLocation = results[0].geometry.location;
		}
	});
}

function selectBoundary(location) {
	if (!location) return;

	var level = $('.active').parent()[0].getAttribute('id');
	var lat = location.lat();
	var lng = location.lng();

	var url = ['https://www.googleapis.com/fusiontables/v1/query?'];
	
	if (level == 'senate') {
		url.push('sql=SELECT name, geometry FROM 17aT9Ud-YnGiXdXEJUyycH2ocUqreOeKGbzCkUw WHERE ST_INTERSECTS(geometry, CIRCLE(LATLNG(' + lat + ', ' + lng + '), 1))');
	} else if (level == 'congress') {
		url.push('sql=SELECT C_STATE, geometry FROM 1QlQxBF17RR-89NCYeBmw4kFzOT3mLENp60xXAJM WHERE ST_INTERSECTS(geometry, CIRCLE(LATLNG(' + lat + ', ' + lng + '), 1))');//C_STATE = \''+ district +'\'');
	} else if (level == 'state') {
		
	} else if (level == 'local') {
		
	}

	url.push('&key=AIzaSyAhFx62OwhoZwTjr8ThcmikAmgNyTiPx_Y');

	$.ajax({
		url: url.join(''),
		dataType: 'json',
		success: function (data) {
			drawBoundary(data);
		}

	});
}

function drawBoundary(data) {
	var rows = data['rows'];

	clearPolygons();

	if (rows[0][1]['geometry']) {
		var coordArr = rows[0][1]['geometry']['coordinates'][0];
		var coords = extractCoords(coordArr);

		drawPolygon(coords);

	} else {
		var geometries = rows[0][1]['geometries'];
		for (var i in geometries) {
			var coordArr = rows[0][1]['geometries'][i]['coordinates'][0];
			var coords = extractCoords(coordArr);

			drawPolygon(coords);
		}
	}

	centerAndZoom();
}

function extractCoords(arr) {
	var coords = [];
	for (var i in arr) {
		coords.push(new google.maps.LatLng(arr[i][1], arr[i][0]));
	}

	return coords;
}

function drawPolygon(coords) {
	var polygon = new google.maps.Polygon({
		paths: coords,
		strokeColor: '#EF503B',
		strokeOpacity: 0.8,
		strokeWeight: 2,
		fillColor: '#EF503B',
		fillOpacity: 0.2
	});

	polygons.push(polygon);
	polygon.setMap(map);
}

function clearPolygons() {
	if (polygons.length > 0) {
		for (var i in polygons) {
			polygons[i].setMap(null);
		}

		polygons.length = 0;
	}
}

function centerAndZoom() {
	var latlngbounds = new google.maps.LatLngBounds();
	
	for (var i in polygons) {
		polygons[i].getPath().forEach(function(ele, idx) {
			latlngbounds.extend(ele);
		});
	}

	map.setCenter(latlngbounds.getCenter());
	map.setZoom(getZoomByBounds(map, latlngbounds));
}


function getZoomByBounds(map, bounds){
  var MAX_ZOOM = map.mapTypes.get( map.getMapTypeId() ).maxZoom || 21 ;
  var MIN_ZOOM = map.mapTypes.get( map.getMapTypeId() ).minZoom || 0 ;

  var ne= map.getProjection().fromLatLngToPoint( bounds.getNorthEast() );
  var sw= map.getProjection().fromLatLngToPoint( bounds.getSouthWest() ); 

  var worldCoordWidth = Math.abs(ne.x-sw.x);
  var worldCoordHeight = Math.abs(ne.y-sw.y);

  //Fit padding in pixels 
  var FIT_PAD = 40;

  for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){ 
      if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).width() && 
          worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).height() )
          return zoom;
  }
  return 0;
}

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function() {
	$('#search-submit').click(search);
	$('.level a').click(function(e) {
		$('.level a').removeClass('active');
		$(this).addClass('active');

		selectBoundary(currLocation);
	});
});
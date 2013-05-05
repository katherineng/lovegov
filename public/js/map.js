var map; // map on which query results are drawn
var geocoder; // Geocoder object used for reverse geocoding
var marker; // map marker icon
var repFinder;

function initialize() {

	// initialize map
    var mapOptions = {
        center: new google.maps.LatLng(38.6, -96),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    repFinder = new RepFinder(map, 'AIzaSyAhFx62OwhoZwTjr8ThcmikAmgNyTiPx_Y', setReps);

    // set-up and bind autocomplete
    var input = document.getElementById('address-field');
	var acOptions = {
		componentRestrictions: {country: 'us'}
	};
	var autocomplete = new google.maps.places.Autocomplete(input, acOptions);
	autocomplete.bindTo('bounds', map);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {
		if (autocomplete.getPlace().geometry != undefined) {
			updateMap(autocomplete.getPlace().geometry.location, true);
		} else {
			addressSearch();
		}
	});

	// instantiate geocoder for reverse geo-coding
	geocoder = new google.maps.Geocoder( {region: 'us'} );

	// instantiate map marker and bind drag event listener
	marker = new google.maps.Marker({
		map: map,
		draggable: true,
		animation: google.maps.Animation.DROP
	});

	google.maps.event.addListener(marker, 'dragend', function(e) {
		var level = $('.active').parent()[0].getAttribute('id');
		if (level !== 'senate') {
			$('#loading').show();
		}
		repFinder.setMap(marker.position, level, false, function() {
			if (level !== 'senate') {
				$('#loading').hide();
			}
		});
		$('#address-field').val(marker.position);
	});

	// add context menu that appears on right click
	contextMenuSetup();
};

// Creates context menu, adds menu items, adds events listeners
function contextMenuSetup() {
	var contextMenuOptions = {};
	contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };

	var menuItems = [];
	menuItems.push({ className: 'context_menu_item', eventName: 'set_marker_click', id: 'setMarkerItem', label: 'Set marker' });
	menuItems.push({}); // separator
	menuItems.push({className:'context_menu_item', eventName:'zoom_in_click', label:'Zoom in'});
	menuItems.push({className:'context_menu_item', eventName:'zoom_out_click', label:'Zoom out'});
	menuItems.push({}); // separator
	menuItems.push({className:'context_menu_item', eventName:'center_map_click', label:'Center map here'});
	contextMenuOptions.menuItems = menuItems;

	var contextMenu = new ContextMenu(map, contextMenuOptions);
	google.maps.event.addListener(map, 'rightclick', function(e) {
		contextMenu.show(e.latLng);
	});

	google.maps.event.addListener(contextMenu, 'menu_item_selected', function(latLng, eventName){
		switch(eventName) {
			case 'set_marker_click':
				updateMap(latLng, false);
				break;
			case 'zoom_in_click':
				map.setZoom(map.getZoom() + 1);
				break;
			case 'zoom_out_click':
				map.setZoom(map.getZoom() - 1);
				break;
			case 'center_map_click':
				map.panTo(latLng);
				break;
		}
	});
}

// Performs reverse geocoding to find a LatLng given a text query
function addressSearch() {
	var address = $('#address-field').val();

	geocoder.geocode({ 'address': address }, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			updateMap(results[0].geometry.location, true);
		}
	});
}

function updateMap(latLng, reset) {
	var level = $('.active').parent()[0].getAttribute('id');
	if (level !== 'senate') {
		$('#loading').show();
	}
	repFinder.setMap(latLng, level, reset, function() {
		if (level !== 'senate') {
			$('#loading').hide();
		}
	});
	marker.setPosition(latLng);
}

function setReps(data, level) {
	$('#reps').html('');

	if (level === 'senate') {
		var numReps = data['rows'].length;
		for (var i = 0; i < numReps; i++) {
			var repDiv = '<div class="rep">' + 
						'<a href="' + data['rows'][i][6] + '" target="_blank">' +
						'<img class="repPic" src="' + data['rows'][i][3] + '" /></a><br>' +
						data['rows'][i][0] + ' [<span class="'+ data['rows'][i][2] +'">' + data['rows'][i][2] + '</span>]' +
						'</div>';

			$('#reps').append(repDiv);
		}
	} else if (level === 'congress') {

	} else if (level === 'state') {

	}
}

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function() {
	$('#search-submit').click(function(e) {
		e.preventDefault();
		addressSearch();
	});
	$('.level a').click(function(e) {
		$('.level a').removeClass('active');
		$(this).addClass('active');

		var level = $('.active').parent()[0].getAttribute('id');
		if (level !== 'senate') {
			$('#loading').show();
		}
		repFinder.setMap(marker.position, level, true, function() {
			if (level !== 'senate') {
				$('#loading').hide();
			}
		});
	});
});



// var map; // map on which query results are drawn
// var geocoder; // Geocoder object used for reverse geocoding
// var marker; // map marker icon
// var currLocation; // LatLng object of the current location
// var currDistrict; // ID of the selected district
// var polygons = []; // keeps track of polygon objects for removal

// function initialize() {

// 	// initialize map
//     var mapOptions = {
//         center: new google.maps.LatLng(38.6, -96),
//         zoom: 4,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//     map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

//     // set-up and bind autocomplete
//     var input = document.getElementById('address-field');
// 	var acOptions = {
// 		componentRestrictions: {country: 'us'}
// 	};
// 	var autocomplete = new google.maps.places.Autocomplete(input, acOptions);
// 	autocomplete.bindTo('bounds', map);

// 	google.maps.event.addListener(autocomplete, 'place_changed', function() {
// 		if (autocomplete.getPlace().geometry != undefined) {
// 			setMap(autocomplete.getPlace().geometry.location, true);
// 		} else {
// 			addressSearch();
// 		}
// 	});

// 	// instantiate geocoder for reverse geo-coding
// 	geocoder = new google.maps.Geocoder( {region: 'us'} );

// 	// instantiate map marker and bind drag event listener
// 	marker = new google.maps.Marker({
// 		map: map,
// 		draggable: true,
// 		animation: google.maps.Animation.DROP
// 	});

// 	google.maps.event.addListener(marker, 'dragend', function(e) {
// 		setMap(marker.position, false);
// 		$('#address-field').val(marker.position);
// 	});

// 	// add context menu that appears on right click
// 	contextMenuSetup();
// };

// // Creates context menu, adds menu items, adds events listeners
// function contextMenuSetup() {
// 	var contextMenuOptions = {};
// 	contextMenuOptions.classNames = { menu: 'context_menu', menuSeparator: 'context_menu_separator' };

// 	var menuItems = [];
// 	menuItems.push({ className: 'context_menu_item', eventName: 'set_marker_click', id: 'setMarkerItem', label: 'Set marker' });
// 	menuItems.push({}); // separator
// 	menuItems.push({className:'context_menu_item', eventName:'zoom_in_click', label:'Zoom in'});
// 	menuItems.push({className:'context_menu_item', eventName:'zoom_out_click', label:'Zoom out'});
// 	menuItems.push({}); // separator
// 	menuItems.push({className:'context_menu_item', eventName:'center_map_click', label:'Center map here'});
// 	contextMenuOptions.menuItems = menuItems;

// 	var contextMenu = new ContextMenu(map, contextMenuOptions);
// 	google.maps.event.addListener(map, 'rightclick', function(e) {
// 		contextMenu.show(e.latLng);
// 	});

// 	google.maps.event.addListener(contextMenu, 'menu_item_selected', function(latLng, eventName){
// 		switch(eventName) {
// 			case 'set_marker_click':
// 				setMap(latLng, false);
// 				break;
// 			case 'zoom_in_click':
// 				map.setZoom(map.getZoom() + 1);
// 				break;
// 			case 'zoom_out_click':
// 				map.setZoom(map.getZoom() - 1);
// 				break;
// 			case 'center_map_click':
// 				map.panTo(latLng);
// 				break;
// 		}
// 	});
// }

// // Performs reverse geocoding to find a LatLng given a text query
// function addressSearch() {
// 	var address = $('#address-field').val();

// 	geocoder.geocode({ 'address': address }, function(results, status) {
// 		if (status == google.maps.GeocoderStatus.OK) {
// 			setMap(results[0].geometry.location, true);
// 		}
// 	});
// }

// // Given a position, updates the current location, boundaries, and marker position
// // If reset boolean is set to true, resets zoom level to fit boundaries
// function setMap(latlng, reset) {
// 	currLocation = latlng;
// 	selectBoundary(reset);
// 	marker.setPosition(latlng);
// }

// // Makes a SQL query depending on desired level of representation
// function selectBoundary(reset) {
// 	if (!currLocation) return;

// 	var level = $('.active').parent()[0].getAttribute('id');
// 	var lat = currLocation.lat();
// 	var lng = currLocation.lng();

// 	var url = ['https://www.googleapis.com/fusiontables/v1/query?'];
	
// 	if (level == 'senate') {
// 		url.push('sql=SELECT id, geometry FROM 17aT9Ud-YnGiXdXEJUyycH2ocUqreOeKGbzCkUw WHERE ST_INTERSECTS(geometry, CIRCLE(LATLNG(' + lat + ', ' + lng + '), 1))');
// 	} else if (level == 'congress') {
// 		url.push('sql=SELECT * FROM 1QlQxBF17RR-89NCYeBmw4kFzOT3mLENp60xXAJM WHERE ST_INTERSECTS(geometry, CIRCLE(LATLNG(' + lat + ', ' + lng + '), 1))');//C_STATE = \''+ district +'\'');
// 	} else if (level == 'state') {
		
// 	} else if (level == 'local') {
		
// 	}

// 	url.push('&key=AIzaSyAhFx62OwhoZwTjr8ThcmikAmgNyTiPx_Y');

// 	$.ajax({
// 		url: url.join(''),
// 		dataType: 'json',
// 		success: function (data) {
// 			clearPolygons();

// 			var rows = data['rows'];
// 			if (rows !== undefined) {
// 				drawBoundary(rows, level, reset);
// 				getReps(data, level);
// 			}
// 		}

// 	});
// }

// // Given the result of a SQL query and the level of representation, draws the district boundaries
// function drawBoundary(rows, level, reset) {
// 	var geometry;
// 	var geometries;

// 	if (level === 'senate') {
// 		if (rows[0][1]['geometry'] != undefined) {
// 			geometry = rows[0][1]['geometry'];
// 		} else {
// 			geometries = rows[0][1]['geometries'];
// 		}

// 	} else if (level === 'congress') {
// 		if (rows[0][5]['geometry'] != undefined) {
// 			geometry = rows[0][5]['geometry'];
// 		} else {
// 			geometries = rows[0][5]['geometries']
// 		}
// 	}

// 	if (geometry) {
// 		var coordArr = geometry['coordinates'][0];
// 		var coords = extractCoords(coordArr);
// 		drawPolygon(coords);
// 	} else {
// 		for (var i in geometries) {
// 			var coordArr = geometries[i]['coordinates'][0];
// 			var coords = extractCoords(coordArr);

// 			drawPolygon(coords);
// 		}
// 	}

// 	if (reset) {
// 		centerAndZoom();
// 	}
// }

// // Given an array of coordinates, returns an array of coordinates as LatLngs
// function extractCoords(arr) {
// 	var coords = [];
// 	for (var i in arr) {
// 		coords.push(new google.maps.LatLng(arr[i][1], arr[i][0]));
// 	}

// 	return coords;
// }

// // Given an array of LatLng coordinates, creates and draws polygons on map
// function drawPolygon(coords) {
// 	var polygon = new google.maps.Polygon({
// 		paths: coords,
// 		strokeColor: '#005468',
// 		strokeOpacity: 0.7,
// 		strokeWeight: 3,
// 		fillColor: '#005468',
// 		fillOpacity: 0.15,
// 		clickable: false
// 	});

// 	polygons.push(polygon); // keep track of new polygons
// 	polygon.setMap(map);
// }

// // Removes and deletes the polygon overlays
// function clearPolygons() {
// 	if (polygons.length > 0) {
// 		for (var i in polygons) {
// 			polygons[i].setMap(null);
// 		}

// 		polygons.length = 0;
// 	}
// }

// // Uses the polygon boundaries to find the appropriate center and zoom level
// function centerAndZoom() {
// 	var latlngbounds = new google.maps.LatLngBounds();
	
// 	for (var i in polygons) {
// 		polygons[i].getPath().forEach(function(ele, idx) {
// 			latlngbounds.extend(ele);
// 		});
// 	}

// 	map.setCenter(latlngbounds.getCenter());
// 	map.setZoom(getZoomByBounds(latlngbounds));
// }

// // Given the bounds, finds the highest zoom level that fits the entire polygon
// function getZoomByBounds(bounds){
//   var MAX_ZOOM = map.mapTypes.get( map.getMapTypeId() ).maxZoom || 21 ;
//   var MIN_ZOOM = map.mapTypes.get( map.getMapTypeId() ).minZoom || 0 ;

//   var ne= map.getProjection().fromLatLngToPoint( bounds.getNorthEast() );
//   var sw= map.getProjection().fromLatLngToPoint( bounds.getSouthWest() ); 

//   var worldCoordWidth = Math.abs(ne.x-sw.x);
//   var worldCoordHeight = Math.abs(ne.y-sw.y);

//   //Fit padding in pixels 
//   var FIT_PAD = 40;

//   for( var zoom = MAX_ZOOM; zoom >= MIN_ZOOM; --zoom ){ 
//       if( worldCoordWidth*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).width() && 
//           worldCoordHeight*(1<<zoom)+2*FIT_PAD < $(map.getDiv()).height() )
//           return zoom;
//   }
//   return 0;
// }

// function getReps(data, level) {

// 	$('#reps').html('');

// 	if (level == 'senate') {
// 		currDistrict = data['rows'][0][0];

// 		$('#reps').append('<img class="rep" src="public/reps/sheldonwhitehouse.png" />');
// 		$('#reps').append('<img class="rep" src="public/reps/johnreed.png" />');
// 	} else if (level == 'congress') {
// 		currDistrict = data['rows'][0][1] + '-' + data['rows'][0][0];

// 		$('#reps').append('<img class="rep" src="public/reps/davidcicilline.png" />');
// 	}

// }

// google.maps.event.addDomListener(window, 'load', initialize);


// $(document).ready(function() {
// 	$('#search-submit').click(function(e) {
// 		e.preventDefault();
// 		addressSearch();
// 	});
// 	$('.level a').click(function(e) {
// 		$('.level a').removeClass('active');
// 		$(this).addClass('active');

// 		selectBoundary();
// 	});
// });
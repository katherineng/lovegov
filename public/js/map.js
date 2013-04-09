function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(38.6, -96),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

    // autocomplete
    var input = document.getElementById("address-field");
	var acOptions = {
		componentRestrictions: {country: 'us'}
	};
	var autocomplete = new google.maps.places.Autocomplete(input, acOptions);
	autocomplete.bindTo('bounds', map);

	google.maps.event.addListener(autocomplete, 'place_changed', callback);
};

function callback() {
	var results = $('#places-autocomplete ul');

	if (status != google.maps.places.PlacesServiceStatus.OK) {
		return;
	}

	for (var i = 0, prediction; prediction = predictions[i]; i++) {
		results.innerHTML += '<li>' + prediction.description + '</li>';
		console.log(prediction.description);
	}
};


google.maps.event.addDomListener(window, 'load', initialize);


// $(document).ready(function() {

// 	$('#address-field').keyup(function() {

// 		if ($('#address-field').val() === '') {
// 			$('#places-autocomplete').hide();
// 		} else {
// 			$('#places-autocomplete').show();
// 		}
// 	});
// });
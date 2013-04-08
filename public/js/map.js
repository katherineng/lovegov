function initialize() {
    var mapOptions = {
        center: new google.maps.LatLng(38.6, -98),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);


$(document).ready(function() {

});
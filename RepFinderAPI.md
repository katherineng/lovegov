lovegov
=======

RepFinder 1.0 API
-------------

RepFinder is a way to visualize geopolitical data for Google Maps API v3.

RepFinder creates overlays using google.maps.Polygon objects.

<table>
    <tr>
        <td colspan=3><strong>RepFinder object</strong></td>
    </tr>
    <tr>
        <td><strong>Constructor</strong></td>
        <td colspan=2><strong>Description</strong></td>
    </tr>
    <tr>
        <td>RepFinder(map: google.maps.Map, key: string)</td>
        <td colspan=2>Creates a RepFinder for the given map</td>
    </tr>
    <tr>
        <td>Method</td>
        <td>Return Value</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>setMap()</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>getReps()</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>drawBoundary(rows: jSON object, level: string literal, reset: boolean, opts: OverlayOptions)</td>
        <td></td>
        <td></td>        
    </tr>
    <tr>
        <td>drawPolygon(coords: google.maps.LatLng, opts: OverlayOptions)</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>clearPolygons()</td>
        <td></td>
        <td></td>
    </tr>
    <tr>
        <td>centerAndZoom()</td>
        <td></td>
        <td></td>
    </tr>
</table>

<table>
    <tr><td colspan=3><strong>OverlayOptions object<strong></td><tr>
    <tr><td colspan=3>OverlayOptions has no constructor, it is implemented as an object literal</td></tr>
    <tr>
        <td><strong>Property</strong></td>
        <td><strong>Type</strong></td>
        <td><strong>Description</strong></td>
    </tr>
    <tr>
        <td>strokeColor</td>
        <td>object literal</td>
        <td>Optional. Represents the color of the polygon stroke. May be a hex code, a color name, or rgb object</td>
    </tr>
    <tr>
        <td>strokeOpacity</td>
        <td>string literal</td>
        <td>Optional. Represents the opacity of the polygon outline.</td>
    </tr>
    <tr>
        <td>fillColor</td>
        <td>string literal</td>
        <td>Optional. Represents the color of the polygon fill</td>
    </tr>
    <tr>
        <td>fillOpacity</td>
        <td>string literal</td>
        <td>Optional. Represents the opacity of the polygon fill</td>
    </tr>
</table>

### Example

    function initialize() {

        // initialize map
        var mapOptions = {
            center: new google.maps.LatLng(38.6, -96),
            zoom: 4,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        repFinder = new RepFinder(map, 'YOUR_API_KEY');

    };

    

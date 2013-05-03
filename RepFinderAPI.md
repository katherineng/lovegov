lovegov
=======

RepFinder API
-------------

RepFinder is a way to visualize geopolitical data for Google Maps API v3.
RepFinder creates overlays using google.maps.Polygon objects.

<table>
    <tr>RepFinder object</tr>
    <tr>
        <td>Constructor</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>RepFinder(map: google.maps.Map, key: string)</td>
        <td>Creates a RepFinder for the given map</td>
    </tr>
    <tr>
        <td>Method</td>
        <td>Return Value</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>setMap()</td>
    </tr>
    <tr>
        <td>getReps()</td>
    </tr>
    <tr>
        <td>drawBoundary(rows: jSON object, level: string literal, reset: boolean, opts: OverlayOptions)</td>
    </tr>
    <tr>
        <td>drawPolygon(coords: google.maps.LatLng, opts: OverlayOptions)</td>
    </tr>
    <tr>
        <td>clearPolygons()</td>
    </tr>
    <tr>
        <td>centerAndZoom()</td>
    </tr>
</table>

<table>
    <tr>OverlayOptions object<tr>
    <tr>OverlayOptions has no constructor, it is implemented as an object literal</tr>
    <tr>
        <td>Property</td>
        <td>Type</td>
        <td>Description</td>
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

    code();

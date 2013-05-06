lovegov
=======

https://github.com/katherineng/lovegov

To install packages before running server:
```
npm install
```

To run the server on port 8080:
```
node server.js
```

__NOTE__ State legislature data is currently only available for Rhode Island in the demo. U.S. Senate and House data is available for all states

RepFinder 1.0 API
-------------

RepFinder is a way to visualize geopolitical data for Google Maps API v3.

RepFinder creates overlays using [google.maps.Polygon](https://developers.google.com/maps/documentation/javascript/overlays#Polygons) objects.

<table>
    <tr>
        <td colspan=3><strong>RepFinder object</strong></td>
    </tr>
    <tr>
        <td><strong>Constructor</strong></td>
        <td colspan=2><strong>Description</strong></td>
    </tr>
    <tr>
        <td>RepFinder(map: google.maps.Map, key: string, setReps: function)</td>
        <td colspan=2>Creates a RepFinder for the given map. Uses the setReps function to update the containing page with the representative data</td>
    </tr>
    <tr>
        <td>Method</td>
        <td>Return Value</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>setMap(latlng: google.maps.LatLng, level: string literal, reset: boolean, callback: function, opts: OverlayOptions)</td>
        <td>void</td>
        <td>Redraws the map overlay to the geopolitical boundaries for the given LatLng position and level of representation. Recenters and zooms to the new overlay of reset arg is set to true. OverlayOptions can be used to set overlay appearance</td>
    </tr>
    <tr>
        <td>getReps(data: jSON object, level: string literal)</td>
        <td>object literal</td>
        <td>Returns a jSON object of representatives given the data from a SQL query to the lovegov servers and the level of representation</td>
    </tr>
    <tr>
        <td>drawBoundary(rows: jSON object, level: string literal, reset: boolean, opts: OverlayOptions)</td>
        <td>void</td>
        <td>Analogous to setMap(), but takes in a jSON object of boundary data rather than a location</td>        
    </tr>
    <tr>
        <td>drawPolygon(coords: google.maps.LatLng[], opts: OverlayOptions)</td>
        <td>void</td>
        <td>Given an array of boundar coordinates, draws a polygon on the map</td>
    </tr>
    <tr>
        <td>clearPolygons()</td>
        <td>void</td>
        <td>Clears all overlays on the map</td>
    </tr>
    <tr>
        <td>centerAndZoom()</td>
        <td>void</td>
        <td>Centers and zooms the map to fit the current boundary overlays drawn on the map</td>
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
```javascript
function initialize() {

    // initialize map
    var mapOptions = {
        center: new google.maps.LatLng(38.6, -96),
        zoom: 4,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var repFinder = new RepFinder(map, 'YOUR_API_KEY');
    ...
};
```


Context Menu Plugin:
http://code.martinpearman.co.uk/googlemapsapi/contextmenu/


We used sqlite3 for our political database, accessed through Python, and google fusion tables for our geospatial database.
We had orginally planned to use GeoDjango for our spatial database but we were unable to successfully set up the frameworks
needed to use the service.

Rather than entering the data for each state's politicians by hand, we wrote a web scraper gets the relevant information 
for every politician at the national and state level and inserts it into a sqlite database. This will allow for future
users of our program to easily update and obtain this political data

To create the spatial database, we downloaded shape files for every state, state congressional district and state legislative
district and converted them to .kml files using GQIS. We then uplaoded these kml files to google fusion tables.

We run spatial queries on the tables created for each layer of geopolitical region (state, congressional, legislative) with
SQL commands, specifically ST_INTERSECTS.

We originally uploaded all the geopolitical data into a single fusion table however spatial queries took too long. We will
be creating separate fusion tables for each state's congressional districts and legislative districts. 


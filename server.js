var express = require('express');
var engines = require('consolidate');
var app = express();

var anyDB = require('any-db');
var conn = anyDB.createConnection('sqlite3://congress.db');

app.use(express.bodyParser());
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.favicon(__dirname + '/public/favicon.ico', { maxAge: 2592000000 }));
app.use(express.logger('dev'));

app.get('/boundaries.json', function(req, res) {

});

/*app.get('/:state/fedReps.json', function(req, res) {
	var sql = 'SELECT name, gender, birthday, start, state, party, type FROM congress where name=\"Sheldon Whitehouse\"';
    var reps = [];

	conn.query(sql)
	.on('row', function(row){
		console.log('hello');
    	reps.push({name: row.name, gender: row.gender, dob: row.birthday, start: row.start, state: row.state, party: row.party});
	})
	.on('end', function() {
    	res.json(reps);
	});
});*/

app.get('/:state/:district/stateReps.json', function(req, res) {
	var sql = 'SELECT name, district, party, position, website FROM $1 WHERE district=$2';
    var reps = [];

	conn.query(sql, [request.params.state, request.params.district])
	.on('row', function(row){
    	reps.push({name: row.name, party: row.party, position: row.position, website: row.website});
	})
	.on('end', function() {
    	response.json(reps);
	});
});

/*app.get('/:repName', function(req, res) {
	console.log('wtf');
	var repName = request.params.repName;
	if (repName !== 'favicon.ico') {
    		response.render('rep.html', {repName: request.params.repName});
	}
});*/

app.get('/', function(request, response){
	response.render('index.html');
});


app.listen(8080, function() {
    console.log('- Server listening on port 8080');
});


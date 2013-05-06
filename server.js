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

app.get('/:state/:district/legislature.json', function(req, res) {
	var sql = 'SELECT * FROM ' + req.params.state + ' WHERE district=$1';
    var reps = [];


	conn.query(sql, [req.params.district])
	.on('row', function(row){
		if (req.params.state !== 'Nebraska') {
    		reps.push({name: row.name, district: row.district, party: row.party, position: row.position, website: row.website});
    	} else {
    		reps.push({name: row.name, district: row.district, position: row.position, website: row.website});
    	}
	})
	.on('end', function() {
    	res.json(reps);
	});
});

app.get('/:state/:district/reps.json', function(req, res) {
	var sql = 'SELECT * FROM Representatives WHERE state=$1 AND district=$2';
    var reps = [];

	conn.query(sql, [req.params.state, req.params.district])
	.on('row', function(row){
    	reps.push({name: row.name, gender: row.gender, dob: row.birthday, start: row.start, state: row.state, party: row.party});
	})
	.on('end', function() {
    	res.json(reps);
	});
});

app.get('/', function(request, response){
	response.render('index.html');
});


app.listen(8080, function() {
    console.log('- Server listening on port 8080');
});


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

app.get('/:district/congress.json', function(req, res) {
	var sql = 'SELECT COUNT(*) FROM Representatives';
    var reps = [];


	conn.query(sql)
	.on('row', function(row){
    	reps.push({name: row.name, gender: row.gender, dob: row.birthday, start: row.start, state: row.state, party: row.party});
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


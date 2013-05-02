var express = require('express');
var engines = require('consolidate');
var app = express();

var anyDB = require('any-db');
var conn = anyDB.createConnection();

app.use(express.bodyParser());
app.engine('html', engines.hogan);
app.set('views', __dirname + '/templates');
app.use('/public', express.static(__dirname + '/public'));
app.use(express.logger('dev'));

app.get('/boundaries.json', function(req, res) {

});

app.get('/reps.json', function(req, res) {

});

app.get('/:repName', function(req, res) {
	var repName = request.params.repName;
	if (repName !== 'favicon.ico') {
    		response.render('rep.html', {repName: request.params.repName});
	}
});

app.get('/', function(request, response){
	response.render('index.html');
});


app.listen(8080, function() {
    console.log('- Server listening on port 8080');
});


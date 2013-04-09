var express = require('express');
var engines = require('consolidate');
var app = express();

var anyDB = require('any-db');
var conn = anyDB.createConnection();

app.use(express.bodyParser());
app.use('/public', express.static(__dirname + '/public'));
app.use(express.logger('dev'));

app.listen(8080, function() {
    console.log('- Server listening on port 8080');
});


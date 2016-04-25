"use strict";

require('colors');

var express 	= require('express'),
	bodyParser  = require('body-parser'),
	http        = require('http'),
  api 				= require('./routes/api');

var app = express();
var server = http.createServer(app);

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get('/', function (req, res) {
	res.render('index');
}),

// JSON API
app.get('/movies', api.fetchMovies);
app.get('/movies/:id', api.fetchMovie);
app.get('/movies/:id/actors', api.fetchActorsOfMovie);
app.post('/movies', api.addMovie);
app.put('/movies', api.updateMovie);
app.delete('/movies/:id', api.deleteMovie);


server.listen(app.get('port'), function() {
	console.log('✔︎︎ Express server listening on http://localhost:%d/'.green, app.get('port'));
});

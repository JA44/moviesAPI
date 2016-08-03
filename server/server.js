"use strict";

require('colors');

var express 	= require('express'),
	bodyParser  = require('body-parser'),
	http        = require('http'),
	jwt 				= require('jsonwebtoken'),
	passport 		= require('passport'),
	JwtStrategy = require('passport-jwt').Strategy,
	ExtractJwt 	= require('passport-jwt').ExtractJwt,
  api 				= require('./routes/api');

var app = express();
var server = http.createServer(app);

var requireAuth = passport.authenticate('jwt', { session: false });

app.set('port', process.env.PORT || 3002);
app.use(bodyParser.json());
app.use(passport.initialize());

passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeader(),
    secretOrKey: 'secret'
  }, function(jwt_payload, done) {
	if(api.isLogged()) {
		done(null, api.getCurrentUser());
	} else {
		done(null, false);
	}
 }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function (req, res) {
	res.render('index');
}),

// JSON API
app.all('/movies*', requireAuth)
app.get('/movies', api.fetchMovies);
app.get('/movies/:id', api.fetchMovie);
app.get('/movies/:id/actors', api.fetchActorsOfMovie);
app.post('/movies', api.addMovie);
app.put('/movies/:id', api.updateMovie);
app.delete('/movies/:id', api.deleteMovie);
app.get('/user/:id', api.me);
app.post('/sessions', api.login);
app.delete('/sessions', api.logout);



server.listen(app.get('port'), function() {
	console.log('✔︎︎ Express server listening on http://localhost:%d/'.green, app.get('port'));
});

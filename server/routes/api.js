"use strict";


var _ = require('lodash'),
		jwt = require('jsonwebtoken'),
		_blacklistToken = [],
	_user = {
		speudo: '',
		id: '',
		profile: ''
	},
	MOVIES = require('./data/movies').movies;

/**
 * variable to act as a generated id
 * @type {number}
 */
var ID = 9;

/**
 * Fetch all movies
 * If category query is provided, fetch movies filtered by category
 */
exports.fetchMovies = function (req, res) {
	console.log('fetchMovies');
    var movies = [];
    if(req.query.category){
        movies = MOVIES.filter(function(movie){
            return movie.category === req.query.category;
        });
    } else {
        movies = MOVIES;
    }
    return res.status(200).json(movies);

};


/**
 * Fetch a movie by id
 */
exports.fetchMovie = function (req, res){
    var id = req.params.id,

	movie = _.find(MOVIES, function (movie) {
		return movie.id == id;
	});

	if (movie) {
		return res.status(200).json(movie);
	} else {
		return res.status(404).end();
	}
};

/**
 * Fetch actors of a movie
 */
exports.fetchActorsOfMovie = function(req, res){
    var id = req.params.id,

	movie = _.find(MOVIES, function (movie) {
		return movie.id == id;
	});

	if (movie.length !== 0) {
		return res.status(200).json(movie.actors);
	} else {
		return res.status(404).end();
	}
}

/**
 * Create a movie
 */
exports.addMovie = function (req, res) {
    var movieToAdd = req.body;

	var existingMovie = _.find(MOVIES, function (movie) {
		return movieToAdd.title == movie.title;
	});

	if (existingMovie) {
		return res.status(400).json({ error: 'Le film ' + existingMovie.title + ' a déjà été ajouté.' });
	} else {
		ID ++;
		movieToAdd.id = ID;
		MOVIES.push(movieToAdd);
		return res.status(201).json(movieToAdd);
	}
};


/**
 * Update a movie
 */
exports.updateMovie = function(req, res) {
    var id = req.params.id,
				movieToUpdate = req.body;

	_.forEach(MOVIES, function (movie, index) {
		if (movie.id == id) {
			MOVIES[index] = movieToUpdate;
			return res.status(200).end();
		}
	});

	return res.status(304).end();
};


/**
 * Delete a movie
 */
exports.deleteMovie = function (req, res) {
    var id = req.params.id,

	removedMovies = _.remove(MOVIES, function (movie) {
		return movie.id == id;
	});

	if (_.isEmpty(removedMovies)) {
		return res.status(304).end();
	} else {
		return res.status(200).end();
	}

};


/**
 * Return the current user
 */

exports.me = function me(req, res) {
	return res.status(200).json(_user);
}


 /**
  * Login an user
  */

exports.login = function login(req, res) {
	_user = {
		speudo: 'JA',
		id: 10,
		profile: 'ADMIN'
	}

	var token = jwt.sign(_user, 'secret', {
              expiresIn: 10080 // in seconds
            });
	res.status(200).json({ success: true, token: 'JWT ' + token });
}

	/**
	 * Logout an user
	 */

	 exports.logout = function logout(req, res) {
	 	_user = {
	 		speudo: '',
	 		id: '',
	 		profile: ''
	 	}

		//addBlacklistToken();

	 	return res.status(200).json(_user);
	 }

exports.getCurrentUser = function getCurrentUser() {
	return _user;
}

exports.isLogged = function isLogged() {
	return !_user.speudo;
}

exports.addBlacklistToken = function addBlacklistToken(token) {
	_blacklistToken.push(token);
}

exports.tokenIsBlacklisted = function tokenIsBlacklisted(token) {
	return _blacklistToken.indexOf(token) !== -1;
}

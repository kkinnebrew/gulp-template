var cookieParser = require('cookie-parser');
var express = require('express');
var path = require('path');
var logger = require('morgan');

var routes = require('./config/routes.json');

var app = express();

app.use(logger('dev'));
app.use(cookieParser());

for (var route in routes) {
	(function() {
		var filepath = routes[route];
		app.get(route, function(req, res) {
			res.sendfile('dist/' + filepath);
		});
	}());
}

app.use('/css', express.static(path.join(__dirname, 'dist/css')));
app.use('/js', express.static(path.join(__dirname, 'dist/js')));
app.use('/img', express.static(path.join(__dirname, 'dist/img')));

/// catch 404 and forward to error handler

app.use(function(req, res, next) {
    res.status(404).send('Not found');
});

module.exports = app;

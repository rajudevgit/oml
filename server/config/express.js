const express = require('express'),
    router = require('./route'),
    env = require('./env'),
	glob = require('glob'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	compress = require('compression'),
	//multer = require('multer'),
	//upload = multer(),
	methodOverride = require('method-override');

module.exports = function(app, config) {
	//const env = process.env.NODE_ENV || 'development';
	//app.locals.ENV = env;
	//app.locals.ENV_DEVELOPMENT = env == 'development';

	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');
	// app.use(favicon(config.root + '/public/img/favicon.ico'));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	//app.use(multer({dest: config.root + '/public/upload/'}).single('file'));
	// parse an HTML body into a string 
	//app.use(bodyParser.text({ type: 'text/html' }));
	//app.use(upload.array()); 
	app.use(cookieParser());
	app.use(compress());
	app.use(express.static(config.root + '/public'));
	app.use(methodOverride());
	app.use('/', router);
	return app;
};
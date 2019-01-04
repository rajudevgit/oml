'use strict';
const express = require('express'),
	config = require('./config/config'),
	db = require(__dirname + '/config/sequelize'),
	bodyParser = require('body-parser');

const app = express();

global.__base = __dirname + '/';

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));

// Add headers
app.use(function (req, res, next) {
	
	// Website you wish to allow to connect
	var allowedOrigins = [config.allow_origin_url];
	var origin = req.headers.origin;
	if(allowedOrigins.indexOf(origin) > -1){
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true);

	// Pass to next layer of middleware
	next();
});

module.exports = require('./config/express')(app, config);

try{
	app.listen(config.port, function () {
		console.log('Express server listening on port ' + config.port);
	});
}catch(e){
	console.log(e);
}
const path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';
    
const config = {
	development: {
		root: rootPath,
		app: {
		  name: 'oml-server'
		},
		port: process.env.PORT || 3008,
		base_url: "http://localhost:3007/",
		allow_origin_url: "http://localhost:4200",
		mysql: {
			"dbHost": "127.0.0.1",
			"dbName": "oml",
			"dbUser": "root",
			"dbPass": "",
			"timezone": "Asia/Kolkata"
		},
		sendgrid_api_key: '',
		logging: console.log
	},
	production: {
		root: rootPath,
		app: {
			name: 'oml-server'
		},
		port: process.env.PORT || 50071,
		base_url: "http://api.oml.com/",
		allow_origin_url: "http://www.oml.com",
		mysql: {
			"dbHost": "localhost",
			"dbName": "thetrident_easefly",
			"dbUser": "thetrident",
			"dbPass": "7Mrt0d5@",
			"timeout": 100000,
			"timezone": "Asia/Kolkata"
		},
		sendgrid_api_key: '',
		logging: console.log
	}
};

module.exports = config[env];

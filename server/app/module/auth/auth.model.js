'use strict';

const models = require(__base + 'config/sequelize'),
	errorCodes = require(__base + 'config/error'),
	env = require(__base + 'config/config'),
	//Load helper
	validate = require(__base + 'app/helpers/validation');

//login user
const loginUser = function(req, cb) {
    try {
		models.User.findOne({
			attributes: ['id', 'email', 'cnt_no', 'address', 'user_type', 'permission', 'is_activated'],
			where: {'email':req.email, 'pwd':req.pwd}
		}).then(function (userData) {
			if(userData)
				return !!cb(null, userData);
			else
				return !!cb('Invalid email or password.', null);
        }).catch(function(e) {
            console.log(e);
            cb(errorCodes['-32011'], null);
        });
    } catch (e) {
        console.log(e);
        cb(errorCodes['-32000'], null);
    }
};

//check user
const checkForgotUser = function(req, cb) {
    try {
		models.User.findOne({
			attributes: ['id', 'email', 'otp', 'address', 'user_type', 'is_activated'],
			where: {'email':req.email}
		}).then(function (userData) {
			if(userData)
				return !!cb(null, userData);
			else
				return !!cb('Invalid email.', null);
        }).catch(function(e) {
            console.log(e);
            cb(errorCodes['-32011'], null);
        });
    } catch (e) {
        console.log(e);
        cb(errorCodes['-32000'], null);
    }
};

//sendToken
const sendToken = function(req, cb) {
    return models.User.update( {otp: req.otp}, {where: {email: req.email} }).then(function(rows) {
		const sgMail = require('@sendgrid/mail');
		sgMail.setApiKey(env.sendgrid_api_key);
		const msg = {
			to: req.email,
			from: 'OML <no-reply@oml.com>',
			subject: 'OTP for reset password',
			//text: '',
			html: '<strong>Your account verification OTP is : '+req.otp+' </strong>',
		};
		sgMail.send(msg);
		cb(null, req);
	}, function(err) {
		console.log(err);
		if (err.message === 'Validation error') {
			cb(errorCodes['-32014'], null);
		} else {
			cb(errorCodes['-32011'], null);
		}
	});
};

//updatePassword
const updatePassword = function(req, cb) {
    return models.User.update( {otp: '', pwd: req.pwd}, {where: {email: req.email, otp: req.otp} }).then(function(rows) {
		cb(null, rows);
	}, function(err) {
		console.log(err);
		if (err.message === 'Validation error') {
			cb(errorCodes['-32014'], null);
		} else {
			cb(errorCodes['-32011'], null);
		}
	});
};

//check exists user with email
const checkUser = function(req, cb) {
    try {
		models.User.findOne({
			attributes: ['id', 'email'],
			where: {'email':req.email, 'is_activated':'Y'}
		}).then(function (userData) {
			return !!cb(null, userData);
        }).catch(function(e) {
            console.log(e);
            cb(errorCodes['-32011'], null);
        });
    } catch (e) {
        console.log(e);
        cb(errorCodes['-32000'], null);
    }
};

//add user
const joinUser = function(values, condition, callback) {
    try {
		return models.User
		.findOne({ where: condition })
		.then(function(obj) {
			if(obj) { // update
				obj.update(values).then(function(rows) {
					const reslt = {'token': rows.token};
					callback(null, reslt);
				}, function(err) {
					console.log(err);
					if (err.message === 'Validation error') {
						callback(errorCodes['-32014'], null);
					} else {
						callback(errorCodes['-32011'], null);
					}
				});
			} else { // insert
				models.User.create(values).then(function(rows) {
					const resltt = {'token': rows.token};
					callback(null, resltt);
				}, function(err) {
					console.log(err);
					if (err.message === 'Validation error') {
						callback(errorCodes['-32014'], null);
					} else {
						callback(errorCodes['-32011'], null);
					}
				});
			}
		})
    } catch (e) {
        console.log(e);
        cb(errorCodes['-32000'], null);
    }
};

//verify user
const verifyUser = function(values, condition, cb) {
    try {
		return models.User
		.findOne({ where: condition })
		.then(function(obj) {
			if(obj) { // update
				obj.update(values).then(function(rows) {
					cb(null);
				}, function(err) {
					console.log(err);
					if (err.message === 'Validation error') {
						cb(errorCodes['-32014'], null);
					} else {
						cb(errorCodes['-32011'], null);
					}
				});
			}
			else {
				cb(errorCodes['-32011'], null);
			}
		})
	} catch (e) {
        console.log(e);
        cb(errorCodes['-32000'], null);
    }
};

module.exports = {
    loginUser,
    joinUser,
	checkUser,
	checkForgotUser,
	sendToken,
	updatePassword,
	verifyUser
}
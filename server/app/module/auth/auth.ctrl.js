'use strict';

//Load model
const AuthModel = require('./auth.model'),
	env = require(__base + 'config/config'),
	errorCodes = require(__base + 'config/error'),
	//Load helper
	uscore = require('underscore'),
	fs = require('fs'),
	multer = require('multer'),
	moment = require('moment'),
	async = require("async");
	
const login = function(req, res) {
    const params = req.body || {};
    const reqData = {
		email: params.email,
		pwd: Buffer.from(params.pwd).toString('base64')
    };
    let response = {
        jsonrpc: '1.0',
		status: false
    };
	//login
    const loginUser = function(callback) {
        AuthModel.loginUser(reqData, callback);
    };

    const checkActivation = function(usrDta, callback) {
        if(usrDta.is_activated == 'N'){
        	callback('Account not activtated yet!', null);
        } else {
        	callback(null, usrDta);
        }
    };
	
    async.waterfall([loginUser, checkActivation], function(err, result) {
        try {
            //Final Result After Executing Tasks
            if (err !== null || result === null) {
                //console.log(err);
                response.error = err;
            } else {
                response.status = true;
                response.result = result;
                //console.log(result);
            }
        } catch (e) {
            //console.log(e);
            response.error = errorCodes['-32000'];
        }
        res.send(response);

    });
};

const sendOtp = function(req, res) {
    const params = req.body || {};
    const reqData = {
		email: params.email
    };
    let response = {
        jsonrpc: '1.0',
		status: false
    };
	//checkUser
    const checkUser = function(callback) {
        AuthModel.checkForgotUser(reqData, callback);
    };

    const checkActivation = function(usrDta, callback) {
        if(usrDta.is_activated == 'N'){
        	callback('Account not activtated yet!', null);
        } else {
        	callback(null, usrDta);
        }
    };
	
    const sendToken = function(usrDta, callback) {
		usrDta.otp = Math.floor(100000 + Math.random() * 900000);
        AuthModel.sendToken(usrDta, callback);
    };
	
    async.waterfall([checkUser, checkActivation, sendToken], function(err, result) {
        try {
            //Final Result After Executing Tasks
            if (err !== null || result === null) {
                //console.log(err);
                response.error = err;
            } else {
                response.status = true;
                response.result = result;
                //console.log(result);
            }
        } catch (e) {
            //console.log(e);
            response.error = errorCodes['-32000'];
        }
        res.send(response);

    });
};

const resetPassword = function(req, res) {
    const params = req.body || {};
	
    const reqData = {
		email: params.email,
		otp: params.otp,
		pwd: params.pwd
    };
    let response = {
        jsonrpc: '1.0',
		status: false
    };
	//checkUser
    const checkUser = function(callback) {
        AuthModel.checkForgotUser(reqData, callback);
    };

    const checkActivation = function(usrDta, callback) {
        if(usrDta.otp != reqData.otp){
        	callback('Invalid OTP!', null);
        } else {
        	callback(null, usrDta);
        }
    };
	
    const updatePassword = function(usrDta, callback) {
		if(params.password && params.password != ''){
			usrDta.pwd = Buffer.from(params.password).toString('base64');
			AuthModel.updatePassword(usrDta, callback);
		} else {
			callback('Password can not be blank!', null);
		}
    };
	
    async.waterfall([checkUser, checkActivation, updatePassword], function(err, result) {
        try {
            //Final Result After Executing Tasks
            if (err !== null || result === null) {
                //console.log(err);
                response.error = err;
            } else {
                response.status = true;
                response.result = result;
                //console.log(result);
            }
        } catch (e) {
            //console.log(e);
            response.error = errorCodes['-32000'];
        }
        res.send(response);

    });
};

const verifyEmail = function(req, res) {
    const params = req.body || {};
    const reqData = {
		token: params.token,
		otp: params.otp
    };
    let response = {
        jsonrpc: '2.0'
    };
	//check token and otp
    const verifyUser = function(callback) {
		const values = {otp: '', token: '', is_activated: 'Y'},
			condition = {token: reqData.token, otp: reqData.otp};
        AuthModel.verifyUser(values, condition, callback);
	};
	
    async.waterfall([verifyUser], function(err, result) {
        try {
            //Final Result After Executing Tasks
            if (err !== null) {
                //  console.log(err);
                response.status = false;
                response.error = err;
            } else {
                response.status = true;
                response.result = result;
                //console.log(result);
            }
        } catch (e) {
            //console.log(e);
            response.error = errorCodes['-32000'];
        }
        res.send(response);

    });
};

const join = function(req, res) {
	try {
		let response = {
			jsonrpc: '1.0'
		};
		const params = req.body || {};
		response.status = false;

		uscore.each(params, function(param){
			if(param == ''){
				response.error = 'All fields are required to complete registration process!';
				res.send(response);
			}
		});

		let reqData = {
			email: params.email,
			pwd: Buffer.from(params.pwd).toString('base64'),
			cnt_no: params.cntNo,
			address: params.address,
			city: params.city,
			state: params.state,
			country: params.country,
			pin: params.pin,
			//otp: '7777',
			otp: Math.floor(100000 + Math.random() * 900000),
			token: Math.random().toString(36).slice(2),
			is_activated: 'Y', //replace with 'N' when email verification needed 
			created_at: moment().tz("Asia/Kolkata").format('YYYY-MM-DD hh:mm:ss')
		};
		
		//check
		const checkUser = function(callback) {
			AuthModel.checkUser(reqData, callback);
		};

		//add
		const addUser = function(usrData, callback) {
			if(usrData){
				response.status = false;
				response.error = 'Email id already exists!';
				callback(null);
			} else {
				if(req.files){
					const pic = req.files.pic ? req.files.pic[0] : undefined;
					if(pic){
		                let fileExt = '.png';
		                if(pic.originalname){
		                    const exnArr = pic.originalname.split('.');
		                    fileExt = '.'+exnArr[1];
		                }
		                fs.readFile(pic.path, function (err, data){
		                    const dirname = "public/uploads/profile/",
		                        newPath = dirname + pic.filename+fileExt;
		                    fs.writeFile(newPath, data, function (err) {
		                        if(err) {
									console.log('e1', err);
		                            response.error = errorCodes['-32000'];
		                            callback(null);
		                        }
		                    })
		                });
		                //reqData.profile_pic = pic.filename+fileExt; //file upload
		            }
				}
				//add otp send code here
				
				response.status = true;
				const condition = {email: reqData.email, is_activated: 'N'};
				AuthModel.joinUser(reqData, condition, callback);
			}
		};
		
		async.waterfall([checkUser, addUser], function(err, result) {
			try {
				//Final Result After Executing Tasks
				if (err !== null) {
					console.log("err : ",err);
					response.status = false;
					response.error = err;
				} else {
					response.result = result;
					//console.log(result);
				}
			} catch (e) {
				console.log('e c :',e);
				response.error = errorCodes['-32000'];
			}
			res.send(response);
		});
		
	} catch (e) {
		console.log('e :',e);
		response.error = errorCodes['-32000'];
		res.send(response);
	}
};

module.exports = {
    login,
    join,
    sendOtp,
	resetPassword,
	verifyEmail
};
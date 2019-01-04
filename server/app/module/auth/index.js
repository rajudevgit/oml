'use strict';

const router = require('express').Router(),
	multer = require('multer'),
	upload = multer({ dest: 'public/uploads/tmp/' }),
	authCtrl = require('./auth.ctrl'),
    authorization = require(__base + 'app/libraries/auth.lib');

router.post('/join', upload.fields([{
           name: 'pic', maxCount: 1
         }]), authCtrl.join);
router.post('/login', authCtrl.login);
router.post('/verify-email', authCtrl.verifyEmail);
router.post('/send-otp', authCtrl.sendOtp);
router.post('/reset-password', authCtrl.resetPassword);

module.exports = router;
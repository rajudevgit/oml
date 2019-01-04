'use strict';

const router = require('express').Router(),
    //auth module
    auth = require('./auth');

//Routing
//auth module
router.use('/auth', auth);

module.exports = router;
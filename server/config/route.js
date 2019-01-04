'use strict';
const router = require('express').Router(),
    apiRoute = require(__base + 'app/module');
	
router.use('/api', apiRoute);

router.get('/about/:name', function (req, res) {
	res.send('hello ' + req.params.name + '!');
});

router.get('/*', function(req, res) {
    res.render('index', {
		title: 'Generator-Express MVC',
		comment:'This is for Ease2fly'
    });
});

module.exports = router;
"use strict"

var express = require('express'),
	router = express.Router();

router
	.get('/:resource', function(req,res) {
		res.send('Get a resource');
	})
	.get('/:resource/:action', function(req,res) {
		res.send('Perform action');
	});

module.exports = router;
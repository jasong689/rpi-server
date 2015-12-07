"use strict"

var express = require('express'),
	router = express.Router(),
	system = require('../mods/mod-system'),
	framework = require('../framework/app');

router
	.get('/:resource', function(req,res) {
		var response = system.execAction('system', 'get' + framework.uppercaseFirst(req.params.resource));
		response.then(function(stdout) {
			res.send(stdout);
		},
		function(err) {
			res.send(err);
		});
	})
	.get('/:resource/:action', function(req,res) {
		var response = system.execAction('system', 'set' + framework.uppercaseFirst(req.params.resource) + framework.uppercaseFirst(req.params.action));
		response.then(function(stdout) {
			res.send(stdout);
		},
		function(err) {
			res.send(err);
		});
	});

module.exports = router;
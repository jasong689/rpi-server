"use strict"

var express = require('express'),
	router = express.Router(),
	mopidy = require('../mods/mod-mopidy'),
	framework = require('../framework/app');

router
	.get('/', function(req,res) {
		mopidy.execAction('mopidy','getStatus')
			.then(function(stdout) {
				res.json(stdout.replace('\n'));
			},
			function(err) {
				res.json({ err: err });
			});
	})
	.get('/:resource/:action', function(req,res) {
		mopidy.execAction('mopidy','get' + framework.uppercaseFirst(req.params.action), req.query)
			.then(function(resp) {
				res.json(resp);
			});
	})
	.post('/:resource/:action', function(req,res) {
		var response = mopidy.execAction('mopidy', 'set' + framework.uppercaseFirst(req.params.action), req.body);
		response.then(function(stdout) {
			res.json(stdout);
		},
		function(err) {
			res.json({ err: err });
		});
	});

module.exports = router;
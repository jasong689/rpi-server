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
	.get('/player/status', function(req,res) {
		mopidy.execAction('mopidy','getPlayerstatus')
			.then(function(resp) {
				res.json(resp);
			});
	})
	.get('/:action', function(req,res) {
		var response = mopidy.execAction('mopidy', 'set' + framework.uppercaseFirst(req.params.action));
		response.then(function(stdout) {
			res.json(stdout);
		},
		function(err) {
			res.json({ err: err });
		});
	});

module.exports = router;
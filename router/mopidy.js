"use strict"

var express = require('express'),
	router = express.Router(),
	mopidy = require('../mods/mod-mopidy'),
	framework = require('../framework/app');

router
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
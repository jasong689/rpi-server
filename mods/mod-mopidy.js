"use strict"

var System = require('../framework/mod'),
	sys = new System('mopidy'),
	Mopidy = require('../libs/mopidy'),
	mpd = new Mopidy();

sys.getPlayerstatus = function getPlayerstatus() {
	var def = Promise.deferred(),
		so = mpd.getInstance();
	so.send('status\n',def);

	return def;
};

sys.getPlayerstats = function getPlayerstats() {
	var def = Promise.deferred(),
		so = mpd.getInstance();
	so.send('stats\n',def);

	return def;
};

sys.getStatus = function getStatus() {
	return this.exec('service mopidy status')
		.then(function(stdout) {
			return { resp: stdout };
		},
		function(err) {
			return { resp: 'mopidy is not running' };
		});
};

sys.setRestart = function setRestart() {
	return this.exec('service mopidy restart').then(function(stdout) {
		return { resp: stdout };
	});
};

sys.setStart = function setStart() {
	return this.exec('service mopidy start').then(function(stdout) {
		return { resp: stdout };
	});
};

sys.setStop = function setStop() {
	return this.exec('service mopidy stop').then(function(stdout) {
		return { resp: stdout };
	});
}

module.exports = sys;
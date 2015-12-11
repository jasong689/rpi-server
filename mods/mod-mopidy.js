"use strict"

var System = require('../framework/mod'),
	sys = new System('mopidy'),
	net = require('net'),
	app = require('../framework/app'),
	encoding = 'UTF8',
	Promise = app.Promise;

// create a net singleton which will handle sending tcp
// messages to mpd server
var mpd = (function() {
	var _instance = null,
		_port = '6680';

	function getInstance() {
		if (_instance === null) {
			_instance = new net.Socket();
			socket.connect({port:port});
		}
		return _instance;
	}
	
	return {
		getInstance: getInstance
	};
})();

sys.getPlayerstatus = function getPlayerstatus() {
	var def = Promise.deferred(),
		so = mpd.getInstance();

	so.write('status',encoding,function(data) {
		def.resolve({ resp: data });
	});

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
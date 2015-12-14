"use strict"

var System = require('../framework/mod'),
	sys = new System('mopidy'),
	Mopidy = require('../libs/mopidy'),
	mpd = new Mopidy();

sys.getPlayerStatus = function getPlayerstatus() {
	return mpd.getStatus();
};

sys.getPlayerStats = function getPlayerstats() {
	return mpd.getStats();
};

sys.setPlayerStatus = function setPlayerStatus(req) {
	return mpd.setPlayerStatus(parseInt(req.status));
};

sys.getPlaylists = function getPlaylists() {
	return mpd.getPlaylists();
};

sys.getPlaylist = function getPlaylist(req) {
	var name = req.name;
	return mpd.getPlaylist(name);
};

sys.setPlayerPlaylist = function setPlayerPlaylist(req) {
	var name = req.name;
	return mpd.loadPlaylist(name);
};

sys.getGmusic = function getGmusic() {
	return mpd.getGmusic();
};

sys.getDirectory = function getDirectory(req) {
	return mpd.getDirectory(req.uri);
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
"use strict"

var System = require('../framework/mod'),
	sys = new System('system');

function parseAudio(r) {
	var out = r.split(':'),
		message = out[0],
		result = out[1].replace(/\s|\u005cn/gi,'').split('=');

	return { value: result[1] };
}

sys.getAudio = function getAudio() {
	return this.exec('amixer cget numid=3').then(function(stdout) {
		return parseAudio(stdout);
	});
};

sys.setAudioHdmi = function setAudioHdmi() {
	return this.exec('amixer cset numid=3 2').then(function(stdout) {
		return parseAudio(stdout);
	});
};

sys.setAudioAnalog = function setAudioAnalog() {
	return this.exec('amixer cset numid=3 1').then(function(stdout) {
		return parseAudio(stdout);
	});
};

sys.setAudioAuto = function setAudioAuto() {
	return this.exec('amixer cset numid=3 0').then(function(stdout) {
		return parseAudio(stdout);
	});
}

module.exports = sys;
"use strict"

var child_process = require('child_process'),
	Promise = require('promise');

function exec(command) {
	var res,
		rej,
		promise = new Promise(function(resolve,reject) {
			res = resolve;
			rej = reject;
		});
	console.log('Executing [' + command + ']');
	child_process.exec(command, function(err,stdout,stderr) {
		if (err || stderr) {
			rej(err || stderr);
		} else {
			res(stdout);
		}
	});

	return promise;
}

function System() {
	var resource = 'system';

	this.execAction = function(type, action, req) {
		var response = new Promise(function(res,rej) { rej('Cannot find command [' + action + ']'); });

		if (resource === type && typeof this[action] === 'function') {
			var command = this[action].call(this);
			response = exec(command);
		}
		return response;
	};
}

System.prototype.getAudio = function getAudio() {
	return 'amixer cget numid=3';
};

System.prototype.setAudioHdmi = function setAudioHdmi() {
	return 'amixer cset numid=3 2';
};

System.prototype.setAudioAnalog = function setAudioAnalog() {
	return 'amixer cset numid=3 1';
};

System.prototype.setAudioAuto = function setAudioAuto() {
	return 'amixer cset numid=3 0';
}

module.exports = new System();
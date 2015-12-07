"use strict"

var child_process = require('child_process'),
	Promise = require('promise');

function System(sys) {
	var resource = sys;

	this.execAction = function(type, action, req) {
		var response = new Promise(function(res,rej) { rej('Cannot find command [' + action + ']'); });

		console.log(this[action]);

		if (resource === type && typeof this[action] === 'function') {
			response = this[action].call(this);
		}
		return response;
	};
}

System.prototype.exec = function exec(command) {
	var res,
		rej,
		promise = new Promise(function(resolve,reject) {
			res = resolve;
			rej = reject;
		}),
		out = '';
	console.log('Executing [' + command + ']');
	
	var child = child_process.exec(command, function(err,stdout,stderr) {
		if (err || stderr) {
			rej(err || stderr);
		}
	});
	child.stdout.pipe(out);
	child.on('exit', function() {
		res(out);
	});

	//TESTING
	//res('numid=3,iface=MIXER,name=\'PCM Playback Route\' ; type=INTEGER,access=rw------,values=1,min=0,max=2,step=0 : values=2');

	return promise;
};

module.exports = System;
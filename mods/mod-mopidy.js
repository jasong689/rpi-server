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
		_port = '6680',
		// stored here for now
		// move to db
		_password = '',
		_ready = false,
		_commands = [],
		_public = {};

	function getInstance() {
		if (_instance === null) {
			// checks our array for any new/pending messages
			var write = function() {
				var first = _commands.first();
				if (first.status === 'pending') {
					return false;
				} else if (first.status == 'new') {
					inst.write(message);
					first.status = 'pending';
				}
			};

			_instance = net.createConnection({port:_port});
			_instance.setEncoding(encoding);
			_instance.write('password ' + _password + '\n');
			// once a response is received we can resolve its
			// promise with the data and proceed with the next message
			_instance.once('data', function(data) {
				_ready = true;
				_instance.on('data', function(data) {
					var command = commands.shift();
					command.promise.resolve(data);
					write();
				});
			});

			// add a new message to commands
			// and see if we can write it
			var send = function(message,p) {
				if  (!_ready) return false;
				var command = { 
					command: message,
					status: 'new',
					promise: p
				};
				_commands.push(command);
				write()
			};

			_public.send = send;
		}
		return _public;
	}
	
	return {
		getInstance: getInstance
	};
})();

sys.getPlayerstatus = function getPlayerstatus() {
	var def = Promise.deferred(),
		so = mpd.getInstance();

	so.send('status\n',def);

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

function buildCommand(command) {
	return 'command_list_begin\n' + command + 'command_list_end\n';
}

module.exports = sys;
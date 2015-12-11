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
		_port = '6600',
		// stored here for now
		// move to db
		_password = '',
		_ready = false,
		_commands = [],
		_public = {};

	function _write() {
		var first = _commands.length > 0 ? _commands[0] : {};
		if(!_ready) return;
		if (first.status === 'pending') {
			return false;
		} else if (first.status === 'new') {
			console.log('I am ready:' + _ready);
			console.log('Sending message: [' + first.command +']');
			_instance.write(first.command);
			first.status = 'pending';
		}
	}

	// add a new message to commands
	// and see if we can write it
	function _send(message,p) {
		var command = { 
			command: message,
			status: 'new',
			promise: p
		};
		_commands.push(command);
		console.log('Send called: [' + JSON.stringify(command) + ']');
		_write()
	};

	function getInstance() {
		if (_instance === null) {
			_instance = net.createConnection({port:_port,host:'192.168.1.239'});
			_instance.setEncoding(encoding);
			// once a response is received we can resolve its
			// promise with the data and proceed with the next message
			_instance.on('data', function(data) {
				if (data.toString().indexOf('OK MPD') >= 0) {
					return;
				}
				_ready = true;
				console.log('Ready: [' + data + ']');
				// remove the password listener
				// and add our normal listener
				_instance
					.removeAllListeners(['data'])
					.on('data', function(data) {
						console.log(_commands);
						var command = _commands.shift();
						console.log('Data received: [' + data.toString() + ']');
						command.promise.resolve(data.toString());
						_write();
					});

				_write();
			});
			_instance.write('password ' + _password + '\n');

			_instance.on('end', function(err) {
				console.log(err);
			});

			_public.send = _send;
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

function buildCommand(command) {
	return 'command_list_begin\n' + command + 'command_list_end\n';
}

module.exports = sys;
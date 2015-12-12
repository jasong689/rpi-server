var net = require('net'),
	app = require('../framework/app'),
	encoding = 'UTF8',
	Promise = app.Promise

// create a net singleton which will handle sending tcp
// messages to mpd server
var mpd = (function() {
	var _instance = null,
		_port = '6600',
		_host = '',
		// stored here for now
		// move to db
		_password = '',
		_ready = false,
		_commands = [],
		_public = {},
		_open = false;

	function _write() {
		var first = _commands.length > 0 ? _commands[0] : { command: '' };
		if (!_ready && first.command.indexOf('password') < 0) return;
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
			promise: p,
			response: ''
		};
		_commands.push(command);
		console.log('Send called: [' + JSON.stringify(command) + ']');
		_write()
	}

	function _openConnection() {
		var options = {
			port: _port,
			host: _host
		};
		_instance.connect(options);
		_instance.setEncoding(encoding);
		_instance.setTimeout(10000);
		_open = true;
		console.log('Connection opened');
		_sendPassword();
	}

	function _isVersion(response) {
		return response.indexOf('OK MPD') >= 0;
	}

	function _sendPassword() {
		var passwordPromise = Promise.deferred();
		_send('password ' + _password + '\n',passwordPromise);
		passwordPromise.then(function() {
			console.log('Ready');
			_ready = true;
			_write();
		});
	}

	function _parseResponse(response) {
		var response = response.replace(/^\n/,'').replace(/\n$/,''),
			r = response.split('\n');
		return r;
	}

	function getInstance() {
		if (_instance === null) {
			_instance = new net.Socket();
			// once a response is received we can resolve its
			// promise with the data and proceed with the next message
			_instance.on('data', function(data) {
				if (_isVersion(data.toString())) return;
				console.log(_commands);
				var command,
					response = _parseResponse(data.toString());
				if (/OK|ACK/.test(response[response.length - 1])) {
					command = _commands.shift();
					command.response += data.toString();
					console.log('Data received: [\n' + command.response + '\n]');
					command.promise.resolve(command.response);
				} else {
					command = _commands[0];
					command.response += data.toString();
				}
				_write();
			});
			_openConnection();
			// if the connection is ended, remove listeners
			// they'll be set up again when getInstance is called
			_instance.on('end', function(err) {
				console.log('Ended');
				_open = false;
				_ready = false;

			});

			_instance.on('error', function(err) {
				console.log('Errored');
				var command = _commands.shift();
				command.promise.reject(err);
				_write();
			});

			_public.send = _send;
		}
		if (!_open) _openConnection();
		return _public;
	}
	
	return {
		getInstance: getInstance
	};
})();

module.exports = mpd;
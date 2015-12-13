var mpd = require('mpd'),
	app = require('../framework/app'),
	Promise = app.Promise;

var Mopidy = (
	// some private properties
	var _playerStatus = Object.defineProperties({}, {
			'PLAYING': { value: 1, writable: false },
			'STOPPED': { value: 2, writable: false },
			'PAUSED': { value: 3, writable: false }
		}),
		currentStatus = _playerStatus.STOPPED;

	function Mopidy() {}

	Mopidy.prototype.getStatus = function() {
		var def = Promise.deferred(),
			m = mpd.getInstance();

		m.send(buildCommand(['status']),def);
		return def;
	};

	Mopidy.prototype.getStats = function() {
		var def = Promise.deferred(),
			m = mpd.getInstance();

		m.send(buildCommand(['stats']),def);
		return def;
	};

	Mopdidy.prototype.getPlaylist = function(name) {
		var command = !!name ? buildWithParams({command:'listplaylistinfo',params: [name]}]) : buildCommand(['playlistinfo']),
			m = mpd.getInstance(),
			def = Promise.deferred();

		m.send(command,def);
		return def;
	};

	Mopidy.prototype.getPlaylists = function() {
		var def = Promise.deferred(),
			m = mpd.getInstance();
		m.send(buildCommand(['listplaylists']),def);
		return def;
	};

	Mopidy.prototype.getGmusic = function() {
		var def = Promise.deferred(),
			m = mpd.getInstance();
		m.send(buildPathCommand("Google Music"),def);
		return def;
	};

	Mopidy.prototype.play = function(pos) {
		var command,
			def = Promise.deferred(),
			m = mpd.getInstance();
		if (!pos) command = buildWithParams([{command:'pause', params: [0]}]);
		command = buildWithParams([{command:'play', params: [pos]}]);

		m.send(command,def);
		return def;
	};

	Mopidy.prototype.playId = function(id) {
		var def = Promise.deferred(),
			m = mpd.getInstance();
		if (!id) return def.reject();

		m.send(buildWithParams([{command:'playid',params:[id]}]),def);
		return def;
	};

	Mopidy.prototype.pause = function () {
		// we can only pause if currently playing
		var def = Promise.deferred(),
			m = mpd.getInstance();
		if (currentStatus == _playerStatus.PLAYING) {
			return m.send(buildWithParams([{command:'pause',params:[1]}]),def);
		}
		return def.reject();
	};

	Mopidy.prototype.stop = function() {
		// we can only stop if the current status is not stopped
		var def = Promise.deferred(),
			m = mpd.getInstance();
		if (currentStatus != _playerStatus.STOPPED) {
			return m.send(buildCommand(['stop']),def);
		}
		return def.reject();
	};

	Mopidy.prototype.seek = function(time) {
		var def = Promise.deferred(),
			m = mpd.getInstance();
		// we'll only allow seeking to an integer second
		if (Number.isInteger(time)) {
			return m.send(buildWithParams([{command:'seekcur',params:[time]}]),def);
		}
		return def.reject();
	};

	Mopidy.prototype.seekPos = function(pos,time) {
		var def = Promise.deferred(),
			m = mpd.getInstance(),
			position = pos || 1;
		if (Number.isInteger(time)) {
			return m.send(buildWithParams([{command:'seek',params:[position,time]}]),def)
		}
		return def.reject();
	};

	Mopdiy.prototype.buildPathCommand = function(uri) {
		return buildWithParams([{command:'lsinfo',params:[uri]}]);
	};

	Mopidy.prototype.loadPlaylist = function(playlist,startEnd) {
		var def = Promise.deferred(),
			m = mpd.getInstance(),
			command;

		if (isArrayAndFilled(startEnd) && Number.isInteger(startEnd[0]) && Number.isInteger(startEnd[1])) {
			command = buildWithParams([{command:'load',params:[playlist,startEnd[0],startEnd[1]]}]);
		} else {
			command = buildWithParams([{command:'load',params:[playlist]}]);
		}
		m.send(command,def);
		return def;
	};

	Object.defineProperty(Mopidy.prototype, 'PLAYER_STATUS', {
		writable: false,
		value: _playerStatus
	});

	return Mopidy;
)();

function buildWithParams(commands) {
	if (!isArrayAndFilled(commands)) return '';
	var arr = commands.map(function(c) {
		var command,
			params;
		if (c.hasOwnProperty('command') && c.hasOwnProperty('params')) {
			command = c.command;
			params = c.params;
			if (isArrayAndFilled(c.params)) {
				command = command + " " + params.map(function(p) {eturn '\"' + p + '\"';}).join(' ');
			}
			return command;
		}
	});
	return buildCommand(arr);
}

function buildCommand(commands) {
	if (!isArrayAndFilled(commands)) return '';

	var command = commands.length > 1 ? commands.join('\n') : commands[0];
	return 'command_list_begin\n' + command + 'command_list_end';
}

function isArrayAndFilled(arr) {
	return Array.isArray(arr) && arr.length > 0;
}

module.exports = Mopidy;
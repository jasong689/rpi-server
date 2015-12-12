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
		currentStatus = 2;

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
			command,
			m = mpd.getInstance();
		if (!id) return def.reject();

		m.send(buildWithParams([{command:'playid',params:[id]}]),def);
		return def;
	};

	Mopidy.prototype.pause = function () {

	};

	Mopidy.prototype.stop = function() {

	};

	Mopidy.prototype.seek = function(time) {

	};

	Mopidy.prototype.seekPos = function(pos,time) {

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
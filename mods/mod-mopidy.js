var System = require('../framework/mod'),
	sys = new System('mopidy');

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
var Promise = require('promise');

Promise.deferred = function deferred() {
	var resolve,
		reject,
		p = new Promise(function(res,rej) {
			resolve = res;
			reject = rej;
		});
	p.resolve = resolve;
	p.reject = reject;
	return p;
}

function uppercaseFirst(str) {
	return str? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

module.exports = {
	uppercaseFirst: uppercaseFirst,
	Promise: Promise
};
function uppercaseFirst(str) {
	return str? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

module.exports = {
	uppercaseFirst: uppercaseFirst
};
"use strict"

var express = require("express"),
	app = express();

app.use(express.json());
app.use('/api/system',require('./router/system'));
app.use('/api/kodi', require('./router/kodi'));
app.use('/api/mopidy', require('./router/mopidy'));
app.get('/', function(req,res) {
	res.send('Hello World');
});

var server = app.listen(3000);
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const databaseURI = 'mongodb://localhost/url-shortener-real';
const connectOptions = {
	keepAlive: true,
	reconnectTries: Number.MAX_VALUE,
};


// connect to database
mongoose.connect(databaseURI, connectOptions, (error, db) => {
	if (error) {
		console.log('Error', error);
	}
	console.log('Connected to MongoDB');
});
mongoose.Promise = global.Promise;
// url schema
require('./models/UrlShortened');

app.use(bodyParser.json());
require('./routes/UrlShorten')(app);

app.use(express.static('dist'));
const server = app.listen(8080, () => console.log('Listening on port 8080'));

module.exports = server;


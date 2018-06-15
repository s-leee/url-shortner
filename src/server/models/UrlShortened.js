const mongoose = require('mongoose');

const { Schema } = mongoose;

const urlShortenedSchema = new Schema({
	originalUrl: String,
	urlCode: String,
	shortenedUrl: String,
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

mongoose.model('UrlShortened', urlShortenedSchema);

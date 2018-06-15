const mongoose = require('mongoose');
const shortId = require('shortid');

const UrlShortened = mongoose.model('UrlShortened');
const API_VERSION = 'v1';
const ERROR_URL = 'http://localhost/error';

module.exports = (app) => {
	// redirect shortened url to the original one
	app.get('/:urlCode', async (req, res, next) => {
		const { urlCode } = req.params;
		if (urlCode === 'bundle.js') {
			next();
		} else {
			const urlItem = await UrlShortened.findOne({ urlCode });
			if (urlItem) {
				let redirectUrl = urlItem.originalUrl;
				if (!redirectUrl.includes('http')) {
					redirectUrl = `http://${redirectUrl}`;
				}
				return res.redirect(redirectUrl);
			}
			return res.redirect(ERROR_URL);
		}
	});

	// retrieve all shortened urls from database
	app.get(`/api/${API_VERSION}/getShortenedUrlList`, async (req, res) => {
		const urlList = await UrlShortened.find({});

		if (urlList) {
			res.status(200).json({
				result: urlList,
			});
		} else {
			res.status(500).json({
				errorCode: 500,
				errorText: 'Something went wrong regarding database',
			});
		}
	});

	// create and store shortened url
	app.post(`/api/${API_VERSION}/setShortenedUrl`, async (req, res) => {
		const { originalUrl, baseUrl } = req.body;

		if (!originalUrl || !baseUrl) {
			res.status(412).json({
				errorCode: 412,
				errorText: 'Missing a required parameter',
			});
		}

		try {
			const urlItem = await UrlShortened.findOne({ originalUrl });
			if (urlItem) {
				res.status(200).json(urlItem);
			} else {
				const urlCode = shortId.generate();
				const shortenedUrl = `${baseUrl.includes('localhost') ? `http://${baseUrl}` : baseUrl}/${urlCode}`;
				const updatedAt = new Date();
				const item = new UrlShortened({
					originalUrl,
					shortenedUrl,
					urlCode,
					updatedAt,
				});
				await item.save();
				res.status(200).json({
					originalUrl,
					shortenedUrl,
					urlCode,
					updatedAt,
				});
			}
		} catch (err) {
			res.status(500).json({
				errorCode: 500,
				errorText: 'Something went wrong regarding database',
			});
		}
	});
};

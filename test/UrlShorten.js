const mongoose = require('mongoose');
require('../src/server/models/UrlShortened');

const UrlShortened = mongoose.model('UrlShortened');

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server/index');

const should = chai.should();
chai.use(chaiHttp);

describe('URL Shorten', () => {
	beforeEach((done) => {
		UrlShortened.remove({}, (err) => {
			done();
		});
	});

	describe('/GET getShortenedUrlList', () => {
		it('it should return an empty list', (done) => {
			chai.request(server)
				.get('/api/v1/getShortenedUrlList')
				.end((err, res) => {
					res.should.have.status(200);
					res.body.result.should.be.a('array');
					res.body.result.length.should.be.eql(0);
					done();
				});
		});
		it('it should return one shortened URL', (done) => {
			const bodyObj = {
				originalUrl: 'https://www.google.com',
				baseUrl: 'http://localhost:3000',
			};
			chai.request(server)
				.post('/api/v1/setShortenedUrl')
				.send(bodyObj)
				.end((err, res) => {
					chai.request(server)
						.get('/api/v1/getShortenedUrlList')
						.end((err, res) => {
							res.should.have.status(200);
							res.body.result.should.be.a('array');
							res.body.result.length.should.be.eql(1);
							done();
						});
				});
		});
	});

	describe('/POST setShortenedUrl', () => {
		it('it should create a shortened url for original url', (done) => {
			const bodyObj = {
				originalUrl: 'https://www.google.com',
				baseUrl: 'http://localhost:3000',
			};
			chai.request(server)
				.post('/api/v1/setShortenedUrl')
				.send(bodyObj)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.be.a('object');
					res.body.should.have.property('originalUrl');
					res.body.should.have.property('shortenedUrl');
					res.body.should.have.property('urlCode');
					res.body.should.have.property('updatedAt');
					res.body.originalUrl.should.be.eql('https://www.google.com');
					res.body.shortenedUrl.should.be.a('string');
					res.body.urlCode.should.be.a('string');
					res.body.updatedAt.should.be.a('string');
					done();
				});
		});
		it('it should get an error for missing a required parameter', (done) => {
			const bodyObj = {
				originalUrl: 'https://www.google.com',
			};
			chai.request(server)
				.post('/api/v1/setShortenedUrl')
				.send(bodyObj)
				.end((err, res) => {
					res.should.have.status(401);
					done();
				});
		});
	});

	describe('/GET :urlCode', () => {
		it('it should redirect to the original URL', (done) => {
			const bodyObj = {
				originalUrl: 'https://www.google.com',
				baseUrl: 'http://localhost:3000',
			};
			chai.request(server)
				.post('/api/v1/setShortenedUrl')
				.send(bodyObj)
				.end((err, res) => {
					const { urlCode } = res.body;
					chai.request(server)
						.get(`/${urlCode}`)
						.end((err, res) => {
							res.redirects[0].should.be.eql('https://www.google.com/');
							done();
						});
				});
		});
		it('it should redirect to the error URL', (done) => {
			chai.request(server)
				.get('/abcd')
				.end((err, res) => {
					console.log(err);
					res.redirects[0].should.be.eql('http://localhost/error');
					done();
				});
		});
	});
});

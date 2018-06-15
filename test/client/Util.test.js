import Util from '../../src/client/utils/Util';

describe('isValidUrl', () => {
	test('returns true when valid url is provided', () => {
		expect(Util.isValidUrl('https://www.google.com')).toEqual('https://www.google.com');
		expect(Util.isValidUrl('http://www.naver.com')).toEqual('http://www.naver.com');
	});

	test('returns false when invalid url is provided', () => {
		expect(Util.isValidUrl('1http://bob')).toBeFalsy();
		expect(Util.isValidUrl('google')).toBeFalsy();
	});
});

import ValidUrl from 'valid-url';

const isValidUrl = (url) => {
	return ValidUrl.isUri(url);
};

export default {
	isValidUrl,
};

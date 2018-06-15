const API_VERSION = 'v1';
const API_PREFIX = `/api/${API_VERSION}`;

export default {
	GET_SHORTENED_URL_LIST: { url: `${API_PREFIX}/getShortenedUrlList`, method: 'GET' },
	SET_SHORTENED_URL: { url: `${API_PREFIX}/setShortenedUrl`, method: 'POST' },
};

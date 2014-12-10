var Promise = require('bluebird');
var request = Promise.promisify(require('request'));
var _ = require('lodash');

var global = {
	strictSSL: false,
	headers: {
		'content-type': 'text/xml'
	}
};

function makeRequest (method, url, body) {
	var options = _.extend(global, {
		method: method,
		url: url,
		body: body
	});

	return request(options).then(function (response) {
		return Promise.resolve(response[0].body);
	});
}

module.exports = {
	makeRequest: makeRequest
};
var transport = require('./utils/transport');
var parseXmlBody = require('./utils/xml-body').parse;
var Promise = require('bluebird');
var _ = require('lodash');

function sendRequest (method, url, body) {
	return transport.makeRequest(method, url, body);
}

function handleResponse (response) {
	return new Promise(function (resolve, reject) {
		var res = parseXmlBody(response);
		var error = (res.ApiResponse && res.ApiResponse.ErrorMessage) ? res.ApiResponse.ErrorMessage : null;
		if (error) {
			return reject(error.Message);
		}
		resolve();
	});
}

module.exports = function (method, url, body) {
	return sendRequest(method, url, body).then(handleResponse);
};

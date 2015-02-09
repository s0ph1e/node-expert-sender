var _ = require('lodash');
var url = require('url');
var Promise = require('bluebird');
var transport = require('./utils/transport');
var options = require('./prepare-options');
var createBody = require('./utils/xml-body').create;
var parseBody = require('./utils/xml-body').parse;

function call (f) {
	return function (data) {
		var methodOptions = f(data);

		var methodBody = createBody({
			key: this.key,
			type: methodOptions.type,
			data: methodOptions.data
		});

		var methodUrl = url.resolve(this.url, methodOptions.endpoint);
		var method = methodOptions.method;

		return sendRequest(method, methodUrl, methodBody).then(handleResponse);
	}
}

function sendRequest (method, url, body) {
	return transport.makeRequest(method, url, body);
}

function handleResponse (response) {
	var res = parseBody(response);
	var error = (res.ApiResponse && res.ApiResponse.ErrorMessage) ? res.ApiResponse.ErrorMessage : null;
	if (error) {
		return Promise.reject(new Error(error.Message));
	}
	return Promise.resolve();
}

function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;
}

_.forIn(options, function (method, name) {
	ExpertSender.prototype[name] = call(method);
});

module.exports = ExpertSender;

var _ = require('lodash');
var url = require('url');
var Promise = require('bluebird');
var transport = require('./utils/transport');
var options = require('./prepare-options');
var createBody = require('./utils/xml-body').create;
var parseBody = require('./utils/xml-body').parse;
var adaptParams = require('./utils/adapt').adaptParams;
var adaptResult = require('./utils/adapt').adaptResult;

function call (f) {
	return function (data) {
		var methodOptions = f(data, this.key);
		var methodBody;

		if (methodOptions.type && methodOptions.data) {
			methodBody = createBody({
				key: this.key,
				type: methodOptions.type,
				data: adaptParams(methodOptions.data)
			});
		}

		var methodUrl = url.resolve(this.url, methodOptions.endpoint);
		var method = methodOptions.method;

		return sendRequest(method, methodUrl, methodBody)
			.then(handleResponse)
			.then(adaptResult);
	}
}

function sendRequest (method, url, body) {
	return transport.makeRequest(method, url, body);
}

function handleResponse (response) {
	var res = parseBody(response);
	if (res.error) {
		return Promise.reject(new Error(res.error.Message));
	}
	return Promise.resolve(res.data);
}

function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;
}

_.forIn(options, function (method, name) {
	ExpertSender.prototype[name] = call(method);
});

module.exports = ExpertSender;

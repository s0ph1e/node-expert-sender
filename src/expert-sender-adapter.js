var _ = require('lodash');
var url = require('url');
var Promise = require('bluebird');

var ExpertSender = require('./expert-sender-api');
var prepareBody = require('./utils/prepare-body');
var transport = require('./utils/transport');

function capitalizeFirstChar (str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function sendRequest (params) {
	var endpoint = url.resolve(this.url, params.endpoint);
	var bodyData = params.data;
	var body = '';

	if (params.method === this.methods.get) {
		endpoint += '?apiKey=' +  this.key;
	} else {
		bodyData.Key = this.key;
		body = prepareBody(bodyData);
	}

	return transport.makeRequest(params.method, endpoint, body);
}

function adaptParams (params) {
	if (_.isEmpty(_.keys(params))) {
		return params;
	}

	var adaptedParams = _.isArray(params) ? [] : {};

	_.forOwn(params, function (value, key) {
		var adaptedKey = capitalizeFirstChar(key);
		adaptedParams[adaptedKey] = adaptParams(value);
	});

	return adaptedParams;
}

function adaptMethod (method) {
	return function adaptedMethod (params) {
		var self = this;
		var adaptedParams = adaptParams(params);
		return method.call(self, adaptedParams).then(function afterGetMethodParams (params) {
			return sendRequest.call(self, params).then(function responseReceived (response) {
				return response;
			});
		});
	};
}

function adaptService (service) {
	_.forOwn(service.prototype, function (method, methodName) {
		service.prototype[methodName] = adaptMethod(method);
	});
	return service;
}

module.exports = (function () {
	return adaptService(ExpertSender);
})();
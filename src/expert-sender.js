var _ = require('lodash');
var url = require('url');
var Promise = require('bluebird');

var ExpertSender = require('./expert-sender-api-methods');
var prepareBody = require('./utils/prepare-body');
var transport = require('./utils/transport');

function capitalizeFirstChar (str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
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
		var adaptedParams = adaptParams(params);
		return method.call(this, adaptedParams).then(function afterGetMethodParams (params) {
			var body = prepareBody(params.body);
			return Promise.resolve(body);
			//return transport.makeRequest(params.method, params.url, body);
		});
	};
}

function adaptService (service) {
	_.each(service.prototype, function (method, methodName) {
		service.prototype[methodName] = adaptMethod(method);
	});
	return service;
}

module.exports = (function () {
	return adaptService(ExpertSender);
})();
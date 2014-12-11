var _ = require('lodash');

var ExpertSender = require('./expert-sender');
var capitalizeFirstChar = require('./utils/utils').capitalizeFirstChar;

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
		return method.call(this, adaptedParams);
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
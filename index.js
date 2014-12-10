var ExpertSender = require('./src/expert-sender');
var _ = require('lodash');

function capitalizeFirstChar (str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function adaptParams (params) {
	return _.reduce(params, function(result, value, key) {
		var adaptedKey = capitalizeFirstChar(key);
		result[adaptedKey] = value;
		return result;
	}, {});
}

function adaptMethod (method) {
	return function adaptedMethod (params) {
		var adaptedParams = adaptParams(params);
		return method.call(this, adaptedParams);
	};
}

function adaptService (service) {
	for (var method in service.prototype) {
		service.prototype[method] = adaptMethod(service.prototype[method]);
	}
	return service;
}

module.exports = (function() {
	return adaptService(ExpertSender);
})();
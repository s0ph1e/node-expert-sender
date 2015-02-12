var _ = require('lodash');

function firstCharToUpperCase (str) {
	return str.substr(0, 1).toUpperCase() + str.substr(1);
}

function firstCharToLowerCase (str) {
	return str.substr(0, 1).toLowerCase() + str.substr(1);
}

function transformObject (obj, func) {
	if (_.isEmpty(_.keys(obj))) {
		return obj;
	}

	var transformedObj = _.isArray(obj) ? [] : {};
	_.forOwn(obj, function (value, key) {
		var transformedKey = func(key);
		transformedObj[transformedKey] = transformObject(value, func);
	});
	return transformedObj;
}

function adaptParams (params) {
	return transformObject(params, firstCharToUpperCase);
}

function adaptResult (res) {
	return transformObject(res, firstCharToLowerCase);
}

function adaptMethod (method) {
	return function adaptedMethod (params) {
		var adaptedParams = adaptParams(params);
		return method.call(this, adaptedParams).then(adaptResult);
	};
}

function adaptService (service) {
	_.each(service.prototype, function (method, methodName) {
		service.prototype[methodName] = adaptMethod(method);
	});
	return service;
}

module.exports = adaptService;

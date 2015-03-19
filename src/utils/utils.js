var _ = require('lodash');
var types = require('../enums/types');
var config = require('../config/config');

// TODO: think about date & dateTime?
function getTypeByValue (value) {
	var typeOf = typeof value;
	var type;
	switch (typeOf) {
		case 'boolean':
			type = types.boolean;
			break;
		case 'string':
			type = types.string;
			break;
		case 'number':
			if (_.isFinite(value) && Math.floor(value) === value) {
				type = types.int;
			} else {
				type = types.string;
			}
			break;
		default:
			type = types.string;
	}
	return type;
}

function addTypeAttribute (obj, type) {
	var objWithType = _.clone(obj);
	objWithType[config.attributeKey] = {};
	objWithType[config.attributeKey][config.typeAttributeName] = type;
	return objWithType;
}

function composeQueryString(data) {
	var qs = Object.keys(data).map(function(key) {
		return [key, data[key]].map(encodeURIComponent).join('=');
	}).join('&');
	return '?' + qs;
}

module.exports = {
	getTypeByValue: getTypeByValue,
	addTypeAttribute: addTypeAttribute,
	composeQueryString: composeQueryString
};

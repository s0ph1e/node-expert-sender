var Promise = require('bluebird');
var _ = require('lodash');
var url = require('url');

var getTypeByValue = require('./utils/utils').getTypeByValue;
var config = require('./config/config');

// Enums
var endpoints = require('./enums/endpoints');
var methods = require('./enums/methods');
var dataTypes = require('./enums/dataTypes');
var modes = require('./enums/modes');
var types = require('./enums/types');

var attributeKey = '_attr';
var typeAttribute = 'xsi:type';

function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;

	this.modes = modes;
	this.dataTypes = dataTypes;
	this.endpoints = endpoints;
	this.methods = methods;
	this.types = types;
}

function addType (data, type) {
	var withType = _.clone(data);
	withType[attributeKey] = {};
	withType[attributeKey][typeAttribute] = type;
	return withType;
}

ExpertSender.prototype.addUserToList = function addUserToList (data) {
	var bodyData = _.clone(data);

	_.forOwn(bodyData.Properties, function(property, key) {
		var propId = { Id: property.Id };
		var propValue = addType({ Value: property.Value }, getTypeByValue(property.value));

		bodyData.Properties[key] = {
			Property: [propId, propValue]
		}
	});

	var body = {
		key: this.key,
		data: addType({ Data: bodyData }, this.dataTypes.subscriber)
	};

	var params = {
		url: url.resolve(this.url, this.endpoints.subscribers),
		method: this.methods.post,
		body: body
	};

	return Promise.resolve(params);
};

module.exports = ExpertSender;
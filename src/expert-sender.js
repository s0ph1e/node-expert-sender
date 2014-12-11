var Promise = require('bluebird');
var _ = require('lodash');
var url = require('url');
var transport = require('./utils/transport');
var prepareBody = require('./utils/prepare-body');

var getTypeByValue = require('./utils/utils').getTypeByValue;
var addType = require('./utils/utils').addTypeAttribute;

// Enums
var endpoints = require('./enums/endpoints');
var methods = require('./enums/methods');
var dataTypes = require('./enums/dataTypes');
var modes = require('./enums/modes');
var types = require('./enums/types');


function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;

	this.modes = modes;
	this.dataTypes = dataTypes;
	this.endpoints = endpoints;
	this.methods = methods;
	this.types = types;

	this.createBodyOptions = function createBodyOptions (data, type) {
		var bodyApiKey = { ApiKey: this.key };
		var bodyData = addType({ Data: data }, type);
		return [ bodyApiKey, bodyData ];
	}
}

ExpertSender.prototype.addUserToList = function addUserToList (data) {
	var bodyData = _.clone(data, true);

	// Transform Properties
	_.forOwn(bodyData.Properties, function(property, key) {
		var propId = { Id: property.Id };
		var propValue = { Value: property.Value };
		propValue = addType(propValue, getTypeByValue(property.value));

		bodyData.Properties[key] = {
			Property: [propId, propValue]
		}
	});

	var bodyOptions = this.createBodyOptions(bodyData, this.dataTypes.subscriber);

	var params = {
		url: url.resolve(this.url, this.endpoints.subscribers),
		method: this.methods.post,
		body: prepareBody(bodyOptions)
	};

	return Promise.resolve(params.body);
	//return transport.makeRequest(params.method, params.url, params.body);

};

module.exports = ExpertSender;
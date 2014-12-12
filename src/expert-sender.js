var _ = require('lodash');
var url = require('url');
var createBody = require('./utils/xml-body').create;
var sendRequest = require('./send-request');
var getTypeByValue = require('./utils/utils').getTypeByValue;
var addType = require('./utils/utils').addTypeAttribute;

// Enums
var endpoints = require('./enums/endpoints');
var dataTypes = require('./enums/dataTypes');
var modes = require('./enums/modes');

function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;
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

	var body = createBody({
		key: this.key,
		type: dataTypes.subscriber,
		data: bodyData
	});

	var endpoint = url.resolve(this.url, endpoints.subscribers);
	var method = 'POST';

	return sendRequest(method, endpoint, body);
};

module.exports = ExpertSender;
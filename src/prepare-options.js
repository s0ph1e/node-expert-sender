var _ = require('lodash');
var getTypeByValue = require('./utils/utils').getTypeByValue;
var addType = require('./utils/utils').addTypeAttribute;

// Enums
var endpoints = require('./enums/endpoints');
var dataTypes = require('./enums/dataTypes');

function composeQueryString(data) {
	var qs = Object.keys(data).map(function(key) {
		return [key, data[key]].map(encodeURIComponent).join('=');
	}).join('&');
	return '?' + qs;
}

var options = {
	addUserToList: function addUserToList(data) {
		var bodyData = _.clone(data, true);

		// Transform properties
		_.forOwn(bodyData.properties, function(property, key) {
			var propId = { id: property.id };
			var propValue = { value: property.value };
			propValue = addType(propValue, getTypeByValue(property.value));

			bodyData.properties[key] = {
				property: [propId, propValue]
			}
		});

		return {
			method: 'POST',
			endpoint: endpoints.subscribers,
			type: dataTypes.subscriber,
			data: bodyData
		}
	},

	getUser: function getUser(data, key) {
		var queryData = _.extend(data, { apiKey: key });

		return {
			method: 'GET',
			endpoint: endpoints.subscribers + composeQueryString(queryData)
		}
	},

	getLists: function getLists(data, key) {
		var queryData = _.extend(data, { apiKey: key });

		return {
			method: 'GET',
			endpoint: endpoints.lists + composeQueryString(queryData)
		}
	}
};

module.exports = options;

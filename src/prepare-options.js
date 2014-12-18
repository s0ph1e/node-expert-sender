var _ = require('lodash');
var getTypeByValue = require('./utils/utils').getTypeByValue;
var addType = require('./utils/utils').addTypeAttribute;

// Enums
var endpoints = require('./enums/endpoints');
var dataTypes = require('./enums/dataTypes');

var options = {
	addUserToList: function addUserToList(data) {
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

		return {
			method: 'POST',
			endpoint: endpoints.subscribers,
			type: dataTypes.subscriber,
			data: bodyData
		}
	}
};

module.exports = options;

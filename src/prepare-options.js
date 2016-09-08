var _ = require('lodash');

var utils = require('./utils/utils');
var getTypeByValue = utils.getTypeByValue;
var addType = utils.addTypeAttribute;
var composeQueryString = utils.composeQueryString;

// Enums
var endpoints = require('./enums/endpoints');
var dataTypes = require('./enums/dataTypes');

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
	},

	createNewsletter: function(data, key) {
		var bodyData = _.clone(data, true);
		var listsTypes = ['subscriberLists', 'subscriberSegments', 'seedLists', 'suppressionLists'];

		bodyData.recipients = _.pick(bodyData.recipients, listsTypes);

		if (bodyData.recipients) {
			_.forOwn(bodyData.recipients, function(recipientsListArray, recipientsListName) {
				// singularize, get name for list item
				var listName = recipientsListName.substring(0, recipientsListName.length - 1);

				_.forOwn(recipientsListArray, function(recipientsListItem, key) {
					var list = {};
					list[listName] = recipientsListItem;
					recipientsListArray[key] = list;
				});
			})
		}

		return {
			method: 'POST',
			endpoint: endpoints.newsletters,
			data: bodyData
		}
	},

	sendTransactional: function (data) {
		var bodyData = _.clone(_.pick(data, ['returnGuid', 'receiver', 'snippets', 'attachments']), true);
		var transactionId = data.transactionId;

		['snippets', 'attachments'].forEach(function (propsName) {
			if (bodyData[propsName]) {
				var propName = propsName.substring(0, propsName.length - 1);
				bodyData[propsName] = bodyData[propsName].map(function (prop) {
					var output = {};
					output[propName] = prop;
					return output;
				});
			}
		});

		return {
			method: 'POST',
			endpoint: endpoints.transactionals + '/' + transactionId,
			data: bodyData
		};
	}
};

module.exports = options;

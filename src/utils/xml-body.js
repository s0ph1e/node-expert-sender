var _ = require('lodash');
var jsonToXml = require('json2xml');
var xmlToJson = require('xml2json').toJson;
var config = require('../config/config');
var addType = require('./utils').addTypeAttribute;

function create (jsonData) {
	var body = {
		_attr: {
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xmlns:xs': "http://www.w3.org/2001/XMLSchema"
		},

		ApiRequest: []
	};

	var bodyKey = { ApiKey: jsonData.key };
	var bodyData = { Data: jsonData.data };

	if (jsonData.type) {
		bodyData = addType(bodyData, jsonData.type);
	}

	body.ApiRequest.push(bodyKey, bodyData);

	return jsonToXml(body, { attributes_key: config.attributeKey });
}

function parse (xmlBody) {
	var json = xmlToJson(xmlBody, { object: true });
	var error, data;

	if (!xmlBody) { // If no body in response - everything is ok
		error = null;
	} else if (json.ApiResponse) {
		error = json.ApiResponse.ErrorMessage || null;
		data = transformData(json.ApiResponse.Data);
	} else {
		error = { Message: 'Unknown error' };
	}

	return {
		error: error,
		data: data
	};
}

/* xml2json parses

	<Items>
		<Item>....</Item>
		<Item>....</Item>
		<Item>....</Item>
	</Items>

	into json like this

	{ Items: {
		Item: [{...}, {...}, {...}]
	}

	This function transforms json to get

	{ Items: [{...}, {...}, {...}]}
*/
function transformData (responseJsonData) {
	if (!responseJsonData || !_.isObject(responseJsonData)) {
		return null;
	}

	for (var key in responseJsonData) {
		if (_.isObject(responseJsonData[key]) && _.keys(responseJsonData[key]).length == 1) {
			for (var childKey in responseJsonData[key]) {
				if (childKey + 's' === key && _.isArray(responseJsonData[key][childKey])) {
					responseJsonData[key] = responseJsonData[key][childKey];
				}
			}
		}
	}
	return responseJsonData;
}

module.exports = {
	create: create,
	parse: parse
};

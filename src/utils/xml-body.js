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
	bodyData = addType(bodyData, jsonData.type);

	body.ApiRequest.push(bodyKey, bodyData);

	return jsonToXml(body, { attributes_key: config.attributeKey });
}

function parse (xmlBody) {
	return xmlToJson(xmlBody, { object: true });
}

module.exports = {
	create: create,
	parse: parse
};

var xml = require('json2xml');
var _ = require('lodash');
var config = require('../config/config');

function prepareBody (data) {
	var body = {
		_attr: {
			'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
			'xmlns:xs': "http://www.w3.org/2001/XMLSchema"
		},

		ApiRequest: [
			{
				ApiKey: data.key
			}, data.data
		]
	};

	return xml(body, { attributes_key: config.attributeKey });
}

module.exports = prepareBody;

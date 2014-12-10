var xml = require('xml');

function prepareBody (data) {
	var body = {
		ApiRequest: [
			{
				_attr: {
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					'xmlns:xs': "http://www.w3.org/2001/XMLSchema"
				}
			}, {
				ApiKey: data.Key
			}, {
				Data: [
					{
						_attr: {
							'xsi:type': data._type
						}
					}
				]
			}
		]
	};

	for (var property in data) {
		var key = property;
		var newOption = {};
		newOption[key] = data[key];
		body.ApiRequest[2].Data.push(newOption);
	}

	return xml(body, true);
}

module.exports = prepareBody;

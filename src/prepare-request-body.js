var xml = require('xml');

function prepareRequestBody (data) {
	var Key = data.key;
	var Type = data.type;
	var Data = data.data;

	var body = {
		ApiRequest: [
			{
				_attr: {
					'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
					'xmlns:xs': "http://www.w3.org/2001/XMLSchema"
				}
			}, {
				ApiKey: Key
			}, {
				Data: [
					{
						_attr: {
							'xsi:type': Type
						}
					}
				]
			}
		]
	};

	for (var property in Data) {
		var key = property;
		var newOption = {};
		newOption[key] = Data[key];
		body.ApiRequest[2].Data.push(newOption);
	}

	return xml(body, true);
}

module.exports = prepareRequestBody;

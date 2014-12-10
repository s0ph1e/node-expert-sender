var url = require('url');
var prepareRequestBody = require('./prepare-request-body');
var endpoints = require('./enums/endpoints');
var types = require('./enums/types');
var modes = require('./enums/modes');
var transport = require('./transport');

function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;
}

ExpertSender.prototype.getModes = function getModes () {
	return modes;
};

ExpertSender.prototype.addUserToList = function addUserToList (data) {
	var params = {
		key: this.key,
		type: types.subscriber,
		data: data
	};

	var body = prepareRequestBody(params);
	var endpoint = url.resolve(this.url, endpoints.subscribers);

	return transport.post(endpoint, body);
};

module.exports = ExpertSender;
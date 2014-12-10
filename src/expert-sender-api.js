var Promise = require('bluebird');
var _ = require('lodash');
var endpoints = require('./enums/endpoints');
var methods = require('./enums/methods');
var types = require('./enums/types');
var modes = require('./enums/modes');

function ExpertSender (config) {
	this.url = config.url;
	this.key = config.key;

	this.modes = modes;
	this.types = types;
	this.endpoints = endpoints;
	this.methods = methods;
}

ExpertSender.prototype.addUserToList = function addUserToList (data) {
	data._type = this.types.subscriber;
	var params = {
		endpoint: this.endpoints.subscribers,
		method: this.methods.post,
		data: data
	};
	return Promise.resolve(params);
};

module.exports = ExpertSender;
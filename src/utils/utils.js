var types = require('../enums/types');

// TODO: think about date & dateTime?
function getType (value) {
	var typeOf = typeof value;
	var type;
	switch (typeOf) {
		case 'boolean':
			type = types.boolean;
			break;
		case 'string':
			type = types.string;
			break;
		case 'number':
			if (_.isFinite(value) && Math.floor(value) === value) {
				type = types.int;
			} else {
				type = types.string;
			}
			break;
		default:
			type = types.string;
	}
	return type;
}

module.exports = {
	getTypeByValue: getType
};
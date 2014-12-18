node-expert-sender
==================

Install
--------
    npm install expert-sender

  
Usage
-----

```javascript
var ExpertSender = require('expert-sender');
var expertSender = new ExpertSender({
	url: 'https://api.esv2.com/',
	key: 'yourKey'
});

expertSender.addUserToList({
	email: 'test@example.com',
	listId: 1,
}).then(function (res) {
	console.log('success');
}).catch(function (err){
	console.log(err);
});
```

Methods
-------

###addUserToList(options)
Add subscriber to list
####Parameters
`options` may contain next properties:
* `email` - subscriber's email *(required)*
* `listId` - id of list *(required)*
* `id` - user id (if you want to change subscriber's email)
* `firstName` - subscriber's first name
* `lastName` - subscriber's last name
* `name` - subscriber's full name (first name + last name)
* `trackingCode` - id of source (form, web-site, etc.)
* `vendor` - id/name of traffic type
* `ip` - subscriber's IP
* `properties` - array of extra properties *(see example below)*

####Example
```javascript
expertSender.addUserToList({
	email: 'test@example.com',
	listId: 1,
	name: 'User',
	ip: '127.0.0.1',
	properties: [
		{ id: 1, value: 'qwerty' },
		{ id: 100, value: 123 }
	]
});
```


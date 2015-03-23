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

### addUserToList(options)
Add subscriber to list
#### Parameters
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

#### Example
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
---------------

### getLists(options)
#### Parameters
`options` contains:
* `seedLists` - boolean, if `true` - test subscriber lists will be returned, defaults to false

#### Example
```javascript
expertSender.getLists({
	seedLists: true
});
```
---------------

### getUser(options)
Receive short, long, fully information about user or event history
#### Parameters
`options` contains:
* `email` - subscriber's email *(required)*
* `options` - one of `Short`, `Long`, `Full`, `EventHistory`

#### Example
```javascript
expertSender.getUser({
	email: 'test@example.com',
	options: 'Full'
});
```
---------------

### createNewsletter(options)
Send email to specified recipients
#### Parameters
`options` contains:
* `recipients` - object with lists for sending mailings. Must contain at least one of `seedLists`, `subscriberLists` or `subscriberSegments` *(required, see example below)* 
* `content` - object with next properties
	- `fromName` - string displaying in `from` email field *(required)*
	- `fromEmail` - email displaying in `from` email field *(required)*
	- `subject` - subject of email *(required)*
	- `html` - html body *(required `html` or `plain`)*
	- `plain` - plain text body *(required `html` or `plain`)*
	- `replyToName` - string displaying in `reply-to` email field 
	- `replyToEmail` - email displaying in `reply-to` email field
	- `header` - header template id
	- `footer` - footer template id

#### Example
```javascript
expertSender.createNewsletter({
	recipients: {
		seedLists: [39, 25],
		subscriberLists: [2, 3, 5, 8]
	},
	content: {
		fromName: 'Test',
		fromEmail: 'test@example.com',
		subject: 'Hello',
		html: '<h1 style="color:#ff0000;">Hello world!</h1>'
	}
});
```
---------------

## Note
ExpertSender API documentation is [here](http://manual.expertsender.ru/api).

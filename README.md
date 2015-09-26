# QC.js
Wrapper for the HP ALM/Quality Center REST API


## Here's how I think it'll work

``` javascript
var qcApi = require('qcApi');

var qcApiConsumer = {};

qcApiConsumer.printTests = function(){
	
	// Any url is accepted
	qcApi.get('/tests/', {
			fields: ['id', 'name'],
			pageSize: 'max'
		}, 
		function(err, tests){

			if(err)
				console.log(err);
			else
			{
				// If response is list of entities, parses it as such
				tests.forEach(function(t){
						console.log("Found test: %j", t);
					});
			}
		});
	};

qcApiConsumer.postTest = function(){

	// Any entity given will be converted to xml entity, camel case properties will be converted to dashed names
	qcApi.post('/tests/', {
			entity: {
				name: 'new test',
				subTypeId: 'XP-VAPI'
			}
		}, 
		function(err, res){
			if(err)
				console.log("Failed to post test: %s", err.message);
			else
				console.log("Successfully saved test with id: %s", res.id); // Parses any entity returned to json
		});

};

qcApiConsumer.run = function(){

	this.printTests();
	this.postTest();
	
};

qcApiConsumer.start = function(){

	var qcApi.login({
		username: 'me',
		password: 'utterly secret',
		server: 'http://myserver:8080/qcbin',
		domain: 'DEFAULT',
		project: 'my_project'
	}, function(err, result){
		if(err)
			throw err;

		run();

	}.bind(this));
	
}



```
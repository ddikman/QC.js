var assert = require("assert");
var util = require('util');
var logger = require('mocha-logger');
var qcApi = require("../qcApi.js").create();


var connInfo;
try{
	connInfo = require('./conn_info.json');
}
catch(e){
	logger.log("Failed to get conn_info.json, skipping tests. Please copy conn_info_example.json and replace with viable ALM instance details to run live integration tests.");
	return;
}


describe('using a real live service', function(){


	it('should be able to return a list of defects', function(done){

		qcApi.login(connInfo)
			.then(function(res){

				qcApi.get('/defects/', { pageSize: '10' })
				.then(function(defects){
					assert.equal(10, defects.length);
				}).then(done, done);

			}, done);

	})

});
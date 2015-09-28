var chai = require('chai');
var qcApi = require('../qcApi');
var assert = chai.assert;
var api;

describe("with qcApi", function(){
	
	before(function(){

		qcApi.httpService = {

		};

	});

	describe("when getting and not being logged in", function(){

		beforeEach(function(){
			api = qcApi.create();
			api.isAuthenticated = false;
		});

		it("should throw an exception", function(done){

			api.get('/tests/', {} , function(err, tests){

				assert.isNotNull(err, null);
				assert.equal(err.message, "Not yet logged in, please call login to authenticate.");
				done();

			});

		});

	});


	describe("when getting", function(){

		beforeEach(function(){
			api.isAuthenticated = true;
		});

		describe("tests without id", function(){

			it("should return all tests", function(done){

				api.client = {

					get: function(url, callback){
						callback([1,2,3,4,5], { statusCode: 200 });
					}

				};

				var tests = api.get('/tests/', { fields: ['id', 'name'] }, function(err, tests){

					if(err != null)
						throw err;

					assert.isNotNull(tests)
					assert.lengthOf(tests, 5);
					done();

				});


			});

		});

	});

});
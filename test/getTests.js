var chai = require('chai');
var qcApi = require('../qcApi');

var assert = chai.assert;

describe("with qcApi", function(){
	
	before(function(){

		qcApi.httpService = {

		};

	});

	describe("when getting and not being logged in", function(){

		it("should throw an exception", function(done){

			qcApi.getTests(function(err, tests){

				assert.isNotNull(err, null);
				assert.equal(err.message, "Not yet logged in, please call login to authenticate.");
				done();

			});

		});

	});


	describe("when getting", function(){

		beforeEach(function(){
			qcApi.isAuthenticated = true;
		});

		describe("tests without id", function(){

			it("should return all tests", function(done){

				var tests = qcApi.getTests(function(err, tests){

					assert.isNull(err);
					assert.isNotNull(tests)
					assert.lengthOf(tests, 5);
					done();

				});


			});

		});

	});

});
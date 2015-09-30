var chai = require('chai');

var qcApi = require("../qcApi.js").create();
var data = require('./example_data.js');

var assert = chai.assert;


describe('given the qcApi service', function(){

	describe('when converting entity results', function(){

		it('should return entities where fields placed are on the actual object', function(){

			var tests = qcApi.convertResult(data.testsResponse);
			assert.equal(1, tests.length);
			var test = tests[0];

			assert.equal("SAP GUI - Scanned SAP Button", test.name);
			assert.equal(2, test.id);
			assert.equal('test', test.type);
		});

		it('should return zero result when no entities exists', function(){

			var results = qcApi.convertResult(data.zeroEntities);
			assert.equal(0, results.length);
			assert.equal(0, results.totalResults);

		});

	});

});
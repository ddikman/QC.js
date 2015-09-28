var chai = require('chai');

var qcApi = require("../qcApi.js").create();
var data = require('./integrationtestData.js');

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

	});

});
var chai = require('chai');

var qcApi = require("../qcApi.js").create();

var assert = chai.assert;

describe('on a newly created api instance', function(){

	it('should remove end and start slash on trimSlash', function(){

		assert.equal("startingSlash", qcApi.trimSlash('/startingSlash'))
		assert.equal("endingSlash", qcApi.trimSlash('endingSlash/'))
		assert.equal("endingAndStartingSlash", qcApi.trimSlash('/endingAndStartingSlash/'))
		assert.equal("noSlashes", qcApi.trimSlash('noSlashes'))

	});

	it('should prepend slash if not existing', function(){

		assert.equal('/didntHavePrependedSlash', qcApi.prependSlash('didntHavePrependedSlash'));
		assert.equal('/hadPrependedSlash', qcApi.prependSlash('/hadPrependedSlash'))

	});

});
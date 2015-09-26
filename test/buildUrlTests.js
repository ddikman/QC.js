var chai = require('chai');

var qcApi = require("../qcApi.js");

var assert = chai.assert;


describe('given the qcApi service', function(){


	describe('when building a url', function(){

		it('should append with ampersand if query parameters already exists in url', function(){

			qcApi.rootUrl = "root";
			var url = qcApi.buildUrl('/tests/?page-size=max', { fields: ['id'] });
			assert.equal(url, 'root/tests/?page-size=max&fields=id');

		});

		it('should append with question mark if no query parameters are used', function(){

			qcApi.rootUrl = "root";
			var url = qcApi.buildUrl('/tests/', { fields: ['id', 'name'] });
			assert.equal(url, 'root/tests/?fields=id,name');

		});

		it('should append page size if given', function(){

			qcApi.rootUrl = "root";
			var url = qcApi.buildUrl('/tests/', { pageSize: '10' });
			assert.equal(url, 'root/tests/?page-size=10');

		});

		it('should raise exception if options is something unexpected', function(){

			assert.throws(function(){
				qcApi.buildUrl('url', 'options');
			}, 'Expected parameter options to be an object but got string');

		});

	});


});
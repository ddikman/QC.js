var chai = require('chai');

var qcApi = require("../qcApi.js").create();

var assert = chai.assert;


describe('given the qcApi service', function(){

	beforeEach(function(){
		qcApi.rootUrl = 'root';
	})


	describe('when building a url with domain and project', function(){

		beforeEach(function(){
			qcApi.project = "project";
			qcApi.domain = "domain";
		});

		it('should append with ampersand if query parameters already exists in url', function(){

			var url = qcApi.buildUrl('/tests/?page-size=max', { fields: ['id'] });
			assert.equal(url, 'root/rest/domains/domain/projects/project/tests/?page-size=max&fields=id');

		});

		it('should append with question mark if no query parameters are used', function(){

			var url = qcApi.buildUrl('/tests/', { fields: ['id', 'name'] });
			assert.equal(url, 'root/rest/domains/domain/projects/project/tests/?fields=id,name');

		});

		it('should append page size if given', function(){

			var url = qcApi.buildUrl('/tests/', { pageSize: '10' });
			assert.equal(url, 'root/rest/domains/domain/projects/project/tests/?page-size=10');

		});

		it('should raise exception if options is something unexpected', function(){

			assert.throws(function(){
				qcApi.buildUrl('url', 'options');
			}, 'Expected parameter options to be an object but got string');

		});

	});

	describe("when building a url without being connected to project", function(){

		it('should have the rest root url as base', function(){

			qcApi.domain = qcApi.project = null;
			assert.equal(qcApi.buildUrl('/domains/'), 'root/rest/domains/');
		})


	});

});
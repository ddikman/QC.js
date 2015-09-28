var chai = require('chai');
var qcApi = require("../qcApi.js");
var assert = chai.assert;
var api;
var mockedClient;

function MockedClient() { 
	this.setArgs = function(args) {
		this.args = args;	
	}.bind(this);
};

describe('given a mocked service', function(){

	beforeEach(function(){

		mockedClient = new MockedClient({});
		api = qcApi.create();
		api.getClient = function(args){
			mockedClient.setArgs(args);
			return mockedClient;
		};

	});

	describe('when requesting authentication', function(){

		it("should set the response cookie when successful", function(done){

			mockedClient.get = function(url, callback){

				assert.equal("testuser", mockedClient.args.user);
				assert.equal("bigsecret", mockedClient.args.password);
				assert.equal("testserver/authentication-point/authenticate", url);

				callback("successful data", { 
					headers: {
						'set-cookie': [
							'test_cookie_name=test_cookie_value'
						]
					},
					statusCode: 200
				});

			};

			api.login({ server: "testserver", user: "testuser", password: "bigsecret"}, function(err, res){

				if(err != null)
					throw err;

				assert.isTrue(res);
				assert.deepEqual({"test_cookie_name": "test_cookie_value"}, api.authCookie);
				done();

			});

		});

		it("should callback with an auth error on invalid credentials", function(done){

			mockedClient.get = function(url, callback) {
				callback("failed data", { statusCode: 401 });
			};

			api.login({ server: "testserver", user: "testuser", password: "bigsecret"}, function(err, res){

				assert.isNull(res);
				assert.isNotNull(err);
				assert.equal(err.message, "Failed to authenticate 'testuser' against testserver, please verify username and password are correct");
				done();

			});

		});

		it("should callback with a general error on any other error", function(done){
			
			mockedClient.get = function(url, callback) {
				callback("failed data", { statusCode: 500 });
			};

			api.login({ server: "testserver", user: "testuser", password: "bigsecret"}, function(err, res){

				assert.isNull(res);
				assert.isNotNull(err);
				assert.equal(err.message, "Failed to authenticate 'testuser' against testserver: status code 500")
				done();

			});

		});

	});


});
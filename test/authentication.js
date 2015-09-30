var chai = require('chai');

var qcApi = require("../qcApi.js");

var assert = chai.assert;
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
							'1st_cookie=1st_cookie_value'
						]
					},
					statusCode: 200
				});

			};

			mockedClient.post = function(url, args, callback){

				assert.equal("1st_cookie=1st_cookie_value", args.headers.cookie);
				assert.equal("testserver/rest/site-session", url);

				callback("successful data", { 
					headers: {
						'set-cookie': [
							'2nd_cookie=2nd_cookie_value'
						]
					},
					statusCode: 201
				});

			};

			api.login({ server: "testserver", user: "testuser", password: "bigsecret"})
				.then(function(res){
					assert.isTrue(res);
					assert.equal("1st_cookie=1st_cookie_value;2nd_cookie=2nd_cookie_value", api.authCookie);
				})
				.then(done, done);

		});

		it("should callback with an auth error on invalid credentials", function(done){

			mockedClient.get = function(url, callback) {
				callback("failed data", { statusCode: 401 });
			};

			api.login({ server: "testserver", user: "testuser", password: "bigsecret"})
				.then(function(err) { throw 'Should result in error' })
				.catch(function(err){
					assert.isNotNull(err);
					assert.equal(err.message, "Failed to authenticate 'testuser' against testserver, please verify username and password are correct");
				}).then(done, done);

		});

		it("should callback with a general error on any other error", function(done){
			
			mockedClient.get = function(url, callback) {
				callback("failed data", { statusCode: 500 });
			};

			api.login({ server: "testserver", user: "testuser", password: "bigsecret"})
				.then(function(err) { throw 'Should result in error' })
				.catch(function(err){			
					assert.isNotNull(err);
					assert.equal(err.message, "Failed to authenticate 'testuser' against testserver: status code 500")
				}).then(done, done);
		});

	});


});
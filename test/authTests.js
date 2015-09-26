var chai = require('chai');

var qcApi = require("../qcApi.js");

var assert = chai.assert;


describe('given a mocked service', function(){

	describe('when requesting authentication', function(){

		it("should set the response cookie when successful", function(done){

			qcApi.getClient = function(args){

				return {

					get: function(url, callback){

						assert.equal("testuser", args.user);
						assert.equal("bigsecret", args.password);
						assert.equal("testserver/authentication-point/authenticate", url);

						callback("successful data", { 
							headers: {
								'set-cookie': [
									'test_cookie_name=test_cookie_value'
								]
							},
							statusCode: 200
						});

					}

				};

			};

			qcApi.login({ server: "testserver", user: "testuser", password: "bigsecret"}, function(err, res){

				if(err != null)
					throw err;

				assert.isTrue(res);
				assert.deepEqual({"test_cookie_name": "test_cookie_value"}, qcApi.authCookie);
				done();

			});

		});

		it("should callback with an auth error on invalid credentials", function(done){

			throw "fail";

		});

		it("should callback with a general error on any other error", function(done){
			
			throw "fail";

		});

	});


});
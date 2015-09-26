var assert = require("assert");
var util = require('util');
var cookie = require('cookie');
var Client = new require('node-rest-client').Client;
var logger = require('mocha-logger');
var data = require("./integrationTestData.js");
var expectedResponses = require("./expectedResponses.js");

var connInfo = data.connectionInfo;
var restUrl = util.format("%s/rest/", connInfo.server);
var projectUrl = util.format('%sdomains/%s/projects/%s/', restUrl, connInfo.domain, connInfo.project);

var client;

describe('with a quality center instance', function() {

	describe("when requesting anything without connection cookie", function() {

		beforeEach(function(){
			client = new Client();
		});

		it("should return an xml response telling us we're not connected", function(done){

			client.get(projectUrl + "tests", function(data, res){
				
				assert.equal(401, res.statusCode)
				done();
			});

		});

	});

	describe("when authenticating", function(){

		it("should return a cookie when authenticated and using that can log out", function(done){

			client = new Client( { user: connInfo.user, password: connInfo.password } );

			client.get(connInfo.server + "/authentication-point/authenticate", function(data, res){
				
				assert.equal(200, res.statusCode);
				var cookies = cookie.parse(res.headers['set-cookie'][0]);

				var args = {
					cookies: cookies
				};

				client.get(connInfo.server + "/authentication-point/logout", args, function(data, res){
				
					assert.equal(200, res.statusCode)
					done();
				});
			});

		});

		it("should return some error text on invalid authentication", function(done){

			client = new Client( { user: connInfo.user, password: "invalid" } );

			client.get(connInfo.server + "/authentication-point/authenticate", function(data, res){
				assert.equal(401, res.statusCode)
				done();
			});

		});

	});

});
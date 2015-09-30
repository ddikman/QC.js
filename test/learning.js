var assert = require("chai").assert;
var Promise = require('promise');
var util = require('util');
var cookie = require('cookie');
var Client = new require('node-rest-client').Client;
var logger = require('mocha-logger');

var connInfo;
try{
	connInfo = require('./conn_info.json');
}
catch(e){
	logger.log("Failed to get conn_info.json, skipping tests. Please copy conn_info_example.json and replace with viable ALM instance details to run learning test.");
	return;
}

var restUrl = util.format("%s/rest/", connInfo.server);
var projectUrl = util.format('%sdomains/%s/projects/%s/', restUrl, connInfo.domain, connInfo.project);

console.log("conn info = " + process.argv.join(";"));

var client;

describe('when running actual calls to a live ALM project', function() {

	describe("and requesting anything without connection cookie", function() {

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

	describe("and authenticating", function(){

		it("should return a cookie when authenticated and using that can log out", function(done){

			client = new Client( { user: connInfo.user, password: connInfo.password } );

			client.get(connInfo.server + "/authentication-point/authenticate", function(data, res){
				
				assert.equal(200, res.statusCode);

				assert.equal(true, res.headers['set-cookie'][0].indexOf('LWSSO') > -1)

				var args = {
					headers: {
						cookie: res.headers['set-cookie'][0]
					}
				}

				client.get(connInfo.server + "/authentication-point/logout", function(data, res){
				
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

	describe("and being authenticated", function(){

		it("can get test entities as json", function(done){

			client = new Client( { user: connInfo.user, password: connInfo.password } );

			client.get(connInfo.server + "/authentication-point/authenticate", function(data, res){
				
				assert.equal(200, res.statusCode);

				var cookies = res.headers['set-cookie'].join(";");

				var args = {
					headers: {
						cookie: cookies
					}
				};

				client.post(connInfo.server + "/rest/site-session", args, function(data, res){

					if(res.statusCode != 201)
						console.log(data.toString());

					cookies += ";" + res.headers['set-cookie'].join(';');
					args.headers.cookie = cookies;

					var testsUrl = util.format('%s/rest/domains/%s/projects/%s/tests/?page-size=1&fields=name,id', connInfo.server, connInfo.domain, connInfo.project);
					client.get(testsUrl, args, function(tests, res){


						if(res.statusCode != 200)
							console.log("response = " + tests.toString('utf8'));

						assert.equal(200, res.statusCode);
						assert.equal(tests.Entities.Entity.length, 1);
						assert.isNotNull(tests.Entities.Entity[0].Fields[0].Field[0].Value[0]);

						client.get(connInfo.server + "/authentication-point/logout", args, function(data, res){
					
							assert.equal(200, res.statusCode)
							done();
						});

					});


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
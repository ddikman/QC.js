var assert = require("assert");
var util = require('util');
var logger = require('mocha-logger');
var qcApi = require("../qcApi.js").create();


describe('using a real live service', function(){


	it('should be able to return a list of defects', function(done){

		function runCall(err, successful){
			
			if(err)
			{
				logger.log(util.format("failed to login: %j", err));
				return;
			}

			qcApi.get('/defects/', { pageSize: 'max' }, function(err, defects){

				if(err)
				{
					logger.log(util.format("failed to get defects: %j", err));
					return;
				}

				console.log("Found %s defects", defects.length);
				defects.forEach(function(defect){
					console.log(defect.name);
				});

				done();

			});

		};

		qcApi.login({
			server: "http://192.168.25.185:8080/qcbin",
			domain: "USEMANGO",
			project: "FLIT_CURRENT",
			user: "testuser1",
			password: "tests"
		}, runCall);

	})

});
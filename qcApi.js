var verifyCallback = require('verify-callback');
var cookies = require('cookie');
var util = require('util');
var Client = new require('node-rest-client').Client;

InvalidAuthenticationException = function(msg){
	this.message = msg;
	this.name = "InvalidAuthenticationException";
}

var qcApi = {
	isAuthenticated: false
};

qcApi.getClient = function(args){
	return new Client(args);
};

qcApi.handleAuthResponse = function(data, res, callback) {

};

qcApi.login = function(connInfo, callback){

	var client = this.getClient({user: connInfo.user, password: connInfo.password});

	client.get(connInfo.server + "/authentication-point/authenticate", function handleAuthResponse(data, res){

		if(res.statusCode == 200)
		{
			this.isAuthenticated = true;
			this.authCookie = cookies.parse(res.headers['set-cookie'][0]);
			callback(null, true);
		}
		else
		{
			this.isAuthenticated = false;
			callback(new InvalidAuthenticationException(util.format("Failed to authenticate '%s' against %s", connInfo.user, connInfo.server), null));
		}

	}.bind(this));

};

qcApi.verifyAuthenticated = function(){
	if(!this.isAuthenticated)
		throw new InvalidAuthenticationException("Not yet logged in, please call login to authenticate.");
}

qcApi.getTests = function(callback) {

	try
	{
		verifyCallback(callback);
		this.verifyAuthenticated();

		callback(null, [1,2,3,4,5]);
	}
	catch(err){
		callback(err, null);
	}

};



module.exports = qcApi;
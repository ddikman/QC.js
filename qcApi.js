var verifyCallback = require('verify-callback');
var cookies = require('cookie');
var util = require('util');
var Client = new require('node-rest-client').Client;

InvalidAuthenticationException = function(msg){
	this.message = msg;
	this.name = "InvalidAuthenticationException";
};

FailedRequestException = function(msg, statusCode, response, url){
	this.message = msg;
	this.response = response;
	this.statusCode = statusCode;
	this.url = url;
	this.name = "FailedRequestException";
};

var qcApi = {
	isAuthenticated: false
};

qcApi.getClient = function(args){
	return new Client(args);
};

qcApi.trimSlash = function(url){

	if(url)
	{
		if(typeof(url) != 'string')
			throw 'Url is not string: ' + url;

		if(url.length > 0 && url[url.length - 1] == '/')
			url = url.substr(0, url.length - 1);
		if(url.length > 0 && url[0] == '/')
			url = url.substr(1, url.length);		
	}

	return url;
};

qcApi.prependSlash = function(url){
	return url[0] == '/' ? url : "/" + url;
}

qcApi.login = function(connInfo, callback){

	this.rootUrl = this.trimSlash(connInfo.server);

	this.client = this.getClient({user: connInfo.user, password: connInfo.password});

	this.client.get(connInfo.server + "/authentication-point/authenticate", function handleAuthResponse(data, res){

		if(res.statusCode == 200)
		{
			this.isAuthenticated = true;
			this.authCookie = cookies.parse(res.headers['set-cookie'][0]);
			callback(null, true);
		}
		else if(res.statusCode == 401)
		{
			this.isAuthenticated = false;
			callback(new InvalidAuthenticationException(util.format("Failed to authenticate '%s' against %s, please verify username and password are correct", connInfo.user, connInfo.server)), null);
		}
		else
		{
			this.isAuthenticated = false;
			callback(new InvalidAuthenticationException(util.format("Failed to authenticate '%s' against %s: status code %s", connInfo.user, connInfo.server, res.statusCode)), null);
		}

	}.bind(this));

};

qcApi.verifyAuthenticated = function(){
	if(!this.isAuthenticated)
		throw new InvalidAuthenticationException("Not yet logged in, please call login to authenticate.");
}

/**
* If the REST call response is an entity, some processing is performed on the resulting javascript object, such as putting each field as a property
* on the object instead of an object in the entities property list
* @param {obj} Should be a javascript object returned from the node-rest-client, parsed from a REST call xml or json response
*/
qcApi.convertResult = function(obj){
	return obj;
};

qcApi.buildUrl = function(url, options){

	url = this.rootUrl + this.prependSlash(url);

	if(options)
	{
		if(typeof(options) != 'object')
			throw 'Expected parameter options to be an object but got ' + typeof(options);

		var queryString = [];
		if(options.pageSize)
			queryString.push('page-size=' + options.pageSize);

		if(options.fields && options.fields.length != undefined)
			queryString.push('fields=' + options.fields.join(','));

		if(queryString.length > 0)
		{
			var appendCharacter = url.indexOf('?') >= 0 ? '&' : '?';
			url = url + appendCharacter + queryString.join('&');
		}
	}

	return url;

};

qcApi.get = function(url, options, callback) {

	try
	{
		verifyCallback(callback);
		this.verifyAuthenticated();

		url = this.buildUrl(url, options);

		this.client.get(url, function handleGetResponse(data, res){

			if(res.statusCode != 200)
				callback(new FailedRequestException("Failed to process url", res.statusCode, data.toString('utf8'), url));			
			else
				callback(null, this.convertResult(data));

		}.bind(this));
	}
	catch(err){
		callback(err, null);
	}

};



module.exports = qcApi;
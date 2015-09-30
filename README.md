# QC.js
Wrapper for the HP ALM/Quality Center REST API

## What does it do?
My goal was to build a simple API wrapper around the connecting and getting resources from HP's Quality Center/Application Lifecycle Management Server.

It will wrap connecting, creating sessions and converting rest responses into JS objects for you.

## How do I use it?

The API is fully asyncronous and uses Promises to avoid callback hell, see [promise](https://www.npmjs.com/package/promise) for more information.

1. First up install it to your node project, I've yet to create a public NPM project for it
``` shell
npm install git+https://github.com/ddikman/QC.js.git
```

2. Require and create an instance of the API
Each instance will create its own session on login.

``` javascript
var qcApi = require('qcApi').create();
```

3. Login
``` javascript
qcApi.login({
	"server": "http://myInstance:8080/qcbin"
	"domain": "DEFAULT",
	"project": "My_Project", //
	"user": "testuser",
	"password": "password"
}).then(
function(){
	console.log("successfully logged in!");
}, function(err){
	console.log("oh shit, something went awry!")
});
```
4. Get something
``` javascript
qcApi.get('/tests/', {pageSize: '10'})
.then(function(tests){
	console.log("got " + tests.length + " tests");
}, 
function(err) { console.log("something failed: " + err) });
```
## Function reference

### qcApi.login(connectionInfo)
Returns a promise, the success method will be called without an argument.
Takes an object containing connection information:
``` javascript
var connInfo = {
	// Full server url including protocol and port, ending with /qcbin
	"server": "http://myInstance/qcbin",

	// The ALM domain the project to connect to resides in (optional)
	"domain": "DEFAULT",

	// The ALM project (optional)
	"project": "My_Project",

	"user": "testuser",
	"password": "password"
};
```

#### Usage
``` javascript
qcApi.login(connectionInfo).then(
function(){
	console.log("successfully logged in!");
}, function(err){
	console.log("oh shit, something went awry!")
});
```
#### Remarks
If no domain or project is given in the connection settings, when doing calls to the API these will not be prepended to the url meaning domains and projects can be listed:
``` javascript
qcApi.get('/domains/mydomain/projects/').then(...)
```

### qcApi.get(url, args)
Returns a promise, the success method argument will be a list of entities (see below) parsed from the service response (if the API could parse the result).

Takes a url, either relative to the *qcbin/rest/* url or relative to the *qcbin/rest/domains/**userdomain**/projects/**userproject/* url if a domain and project was given on login.
#### args
###### pageSize
*[integer/string]* How many items to retrieve or 'max' to get as many as allowed by the ALM instance (can be configured in site administration interface).
###### page
*Not yet implemeted*
###### fields
*[Array]* Which fields to retrieve, using this can greatly improve API speed. Skipping description fields etc lessens the size of the response body.
###### filter
*Not yet implemented*

#### Usage
``` javascript
qcApi.get('/tests/', {pageSize: 'max'})
.then(function(tests){
	console.log("got $s tests", tests.length);
}, function(err){
	console.log("error occured: %s", err)
});
````

### Entity result list
Most resources in ALM are returned as a list of entities containing name:value fields. When such a result is returned from the service the API will parse this into
a list object and return the results. The object is a simple array so all array methods are available, it will also have a *totalResults* property with the total number
of entities of the given type in the project. This can be used in conjunction with the *pageSize* property.

### Entity result object
The entity result list will contain a list of objects. Each object will contain a property directly mapped to the entity type returned from ALM.
Example defect:
``` json
{
  "type": "defect",
  "user-05": null,
  "user-04": "",
  "user-03": "",
  "user-02": null,
  "has-change": "",
  "user-01": "959",
  "planned-closing-ver": "1.2",
  "test-reference": null,
  "subject": null,
  "reproducible": "Y",
  "request-id": null,
  "request-server": "",
  "id": "1",
  "ver-stamp": "22",
  "has-others-linkage": "N",
  "description": "lots of html",
  "creation-time": "2013-06-21",
  "to-mail": "",
  "request-note": "",
  "closing-version": "",
  "cycle-id": null,
  "detection-version": "",
  "last-modified": "2014-07-14 10:28:19",
  "status": "Closed",
  "closing-date": "2013-11-29",
  "detected-in-rcyc": {
    "_": "1002",
    "$": {
      "ReferenceValue": "Cycle A"
    }
  },
  "detected-in-rel": {
    "_": "1002",
    "$": {
      "ReferenceValue": "Sprint_009"
    }
  },
  "severity": "5-Low",
  "attachment": "Y",
  "extended-reference": "",
  "estimated-fix-time": null,
  "project": "UseMango",
  "target-rel": "",
  "detected-by": "roconnor",
  "step-reference": null,
  "owner": "",
  "target-rcyc": "",
  "actual-fix-time": "162",
  "request-type": ""
}
```


## Testing
When forking the project, you can test it by:
``` shell
npm test
```

However, if you want to run the integration or learning tests you'll need to provide connection information to your own ALM instance.
Do this by copying the [test/conn_info_example.json](https://github.com/ddikman/QC.js/blob/master/test/conn_info_example.json) and saving it in the same folder but named *conn_info.json*.

The tests will then pick up the connection info from there and the tests can be run, of course they might fail if your project looks different.
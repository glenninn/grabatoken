//------------------------------------
// POST javascript module
//  3/9/2017, g1
//    encapsulate an asynchronous HTTP post function for making API calls
//

var http = require("http");
var https = require("https");

var authToken = "";
var _debug = false;

const debug = (df) => _debug=df;

const jss = (o)=> JSON.stringify(o,null,2);


var post = function(host,path,body){
	var postPromise = new Promise(function(resolve,reject){
		var postContent = JSON.stringify(body);
		if( (authToken != "") ){
			path += (path.indexOf("?">0)) ? "&" : "?";
			path += "access_token=" + authToken;
		}
		
		var opt = {
			hostname : host,
			port : 443,
			path : path,
			method: "POST",
			headers : {
				'content-type' : 'application/json',
				'accept' : 'application/json',
				'content-length' : Buffer.byteLength(postContent)
			    }
		    };
			
		if(_debug){
			console.log(`HTTP parameters:\n${jss(opt)}`);
			console.log(`Body: ${jss(postContent)}`);
		}
			
			
		var req = https.request(opt, function (res) {
			var respBody = "";
			res.setEncoding('utf8');
			res.on('data',function(chunk){
				respBody += chunk;
			});
			res.on('end',function(){
				if(res.statusCode===200){
					resolve(JSON.parse(respBody));
				} else {
					reject(respBody);
				}
			});
		});

		req.on('error', function(e){
			reject(e.message);
		});
		req.write(postContent);
		req.end();
	});
	return postPromise;	
}


var get = function(host,path){
	var getPromise = new Promise(function(resolve,reject){
		if( (authToken != "") ){
			path += (path.indexOf("?">0)) ? "&" : "?";
			path += "access_token=" + authToken;
		}

		var opt = {
			hostname : host,
			port : 443,
			path : path,
			method: "GET",
		    };
			
		if(_debug){
			console.log(`HTTP parameters:\n${jss(opt2)}`);
			console.log(`Body: ${jss(postContent)}`);
		}
			
		
		var req = https.request(opt, function (res) {
			var respBody = "";
			res.setEncoding('utf8');
			res.on('data',function(chunk){
				respBody += chunk;
			});
			res.on('end',function(){
				if(res.statusCode===200){
					resolve(JSON.parse(respBody));
				} else {
					reject(respBody);
				}
			});
		});

		req.on('error', function(e){
			reject(e.message);
		});
		req.end();
	});
	return getPromise;	
}

authorize = function(token){
	authToken = token;
}


module.exports.debug = debug;
module.exports.post = post;
module.exports.get = get;
module.exports.authorize = authorize;


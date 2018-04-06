var express=require("express");
var auth = require("./auth.js");
var fs = require("fs");

var fn = "config.json";
var oauthRec = {};
var uri = "api.bluejeans.com";
var authPath = "/oauth2/token";


fs.readFile(fn, (err,data)=> {
	if(err) {
		console.log("Error reading file: " + fn +"\n"+err);
		process.exit();
	}
	var sd = data.toString();
	oauthRec = JSON.parse(sd);

	auth.post( uri, authPath,oauthRec).then(function(results){
	  console.log("   ** A C C E S S   T O K E N  **");
	  console.log("\n    " + results.access_token);
	  console.log("");
	  // console.log("results:\n" + JSON.stringify(results,null,2));
	},function(errors){
		var emsg = errors.replace(/\n/g,"\n  ");
		console.log("Error when trying to create access token:\n  " + emsg);
		process.exit();
	});

})
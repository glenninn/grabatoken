var express=require("express");
var auth = require("./auth.js");
var fs = require("fs");
var path = require("path");

var fn = "config.json";
var oauthRec = {};
var uri = "api.bluejeans.com";
var authPath = "/oauth2/token";

var jssrc = path.dirname(process.argv[1]);
console.log("Directory: " + jssrc+"\\"+fn);


fs.readFile(jssrc + "\\" + fn, (err,data)=> {
	if(err) {
		console.log("Error reading file: " + fn +"\n"+err);
		process.exit();
	}
	var sd = data.toString();
	oauthRec = JSON.parse(sd);

	auth.post( uri, authPath,oauthRec).then(function(results){
	  console.log("\n   ** A C C E S S   T O K E N  **");
	  console.log("\n    " + results.access_token);
	  console.log("");
	  console.log("Grant type: " + oauthRec.grant_type);
	  if(oauthRec.grant_type == "password"){
		  console.log("User name:  " + oauthRec.username);
	  } else if(oauthRec.grant_type == "client_credentials"){
		  console.log("Client Key: " + oauthRec.client_id);
	  }
	  // console.log("results:\n" + JSON.stringify(results,null,2));
	},function(errors){
		var emsg = errors.replace(/\n/g,"\n  ");
		console.log("Error when trying to create access token:\n  " + emsg);
		process.exit();
	});

})
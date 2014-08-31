#!/usr/bin/env node
//http://www.spacjer.com/blog/2014/02/10/defining-node-dot-js-task-for-heroku-scheduler/

var fs = require('fs');
var util = require('util');
var logStream = fs.createWriteStream('../output/FetchParseGitHubArchive.log', {flags: 'a'});
console.log = function(d) { 
  logStream.write(util.format(d) + '\n');
};

var archive = require('./mikeal-githubarchive.js');
var path = require('path');
var assert = require('assert');
var underscore = require('underscore');
var moment = require('moment');
var TimeNow = moment().format("YYYY-MM-DD HH:MM:SS");
var TimeAgo = moment().subtract(2, 'hours').format("YYYY-MM-DD-HH");

//Testing
//TimeAgo ="2014-08-28-10"  
URL = "http://data.githubarchive.org/" + TimeAgo + ".json.gz";
console.log (TimeNow + " processing " + URL);

//Fetch GitHub Archives & Generate JSON file with 'PushEvent' event notifications
var a = archive(URL, {gzip:true});
var com = a.MyParser(function (err, commits) {
  //console.log(JSON.stringify(com.commits));
  fs.writeFile("../data/PushEvent.json", JSON.stringify(com.commits), function (err) {
	  if (err) return console.log(err);
	});
  if (err) return console.log(err);
})

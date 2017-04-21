/**
* In the tradeoff between more I/O operations and comsuming more memory, this code chooses the latter. So there is a single point of writing to the disk
* Also, this code uses globals liberally. Though not ideal, it makes sense for a small program like this.
* Use of ECMAScript6 is minimum.
*/

var request = require('request');
var cheerio = require('cheerio');
var async = require('async');
var fs = require('fs');
var baseUrl = 'https://medium.com';
var outputFile = 'out.txt';

/**
* Parses the body to get anchor tags and stores them in an array
* @param {string} body - The HTML that needs to be parsed.
*/
var scrapeLinks = function (body) {
	let $ = cheerio.load (body);
	let urlsPrevLength = urls.length;
	$('a').each (function (index, element) {
		if (href[0] == '/') href = baseUrl + href;
		if (urls.indexOf (href) == -1) {
			urls.push (href);
		}
	});
	if (openConnections == 4 || toScrape == urlsPrevLength) {
		wrapper();
	}
}

/**
* Writes all links occurring at a URL to a file
* @param {string} url - The url to be crawled recursively
*/
var getLinks = function (callback) {
	openConnections +=1;
	let url = urls[toScrape];
	if (/https?:\/\/medium.com.*/.test (url)) {
		request(url, function (error, response, body) {
			if (error) {
				return callback (error);
			}
			else {
				scrapeLinks (body); 

			}
		});
	}
	return callback(null);
}
var notAllCrawled = function () {
	return openConnections <5 && ++toScrape < urls.length;
}
var done = function (error) {
	if (error) console.log (error);
	else {
		if (true) {
			fs.writeFile (outputFile, urls.join (','), function (err) {
				if (err) console.log (err);
			});
		}
	}
}
var urls = [baseUrl], toScrape = 0, openConnections =1;

var wrapper = function () {
	async.doWhilst (getLinks, notAllCrawled, done);
}
wrapper();


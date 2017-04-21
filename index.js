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
var flag = 0;
/**
* Parses the body to get anchor tags and stores them in an array
* @param {string} body - The HTML that needs to be parsed.
*/
var scrapeLinks = function (body) {
	let $ = cheerio.load (body);
	let urlsPrevLength = urls.length;
	$('a').each (function (index, element) {
		let href = element.attribs['href'];
		if (href[0] == '/') href = baseUrl + href;
		if (urls.indexOf (href) == -1) {
			urls.push (href);
		}
	});
	if ((openConnections == 4 && flag ==1) ||toScrape == urlsPrevLength) {
		wrapper();
	}
}

/**
* Fetches web pages
* @param {function} callback - Passed a single error object to halt iteration or null otherwise
*/
var getLinks = function (callback) {
	if (openConnections < 5) {
		let url = urls[toScrape++];
		if (/https?:\/\/medium.com.*/.test (url)) {
			openConnections +=1;
			request(url, function (error, response, body) {
				openConnections -= 1;
				if (error) {
					console.log(error);
				}
				else {
					scrapeLinks (body);
				}
			});
		}
		return callback(null);
	}
	else {
		flag=1;
		return callback({openConnections : 5});
	}
}

/**
* Test condition for async.whilst
*/
var notAllCrawled = function () {
	return toScrape < urls.length;
}

/**
* Final callback called after the test function has failed
* @param {object} [error]
*/
var done = function (error) {
	if (error && error.openConnections == 5 ) return;
	else if (openConnections == 0) {
		fs.writeFile (outputFile, urls.join (','), function (err) {
			if (err) console.log (err);
		});
	}
}

var urls = [baseUrl], toScrape = 0, openConnections =0;

var wrapper = function () {
	async.whilst (notAllCrawled, getLinks, done);
}
wrapper();
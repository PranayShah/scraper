/**
 * In the tradeoff between more I/O operations and comsuming more memory, this code chooses the latter. So there is a single point of writing to the disk
 * Also, this code uses globals liberally. Though not ideal, it makes sense for a small program like this.
 * Use of ECMAScript6 is minimum.
 */

var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var baseUrl = 'https://medium.com';
var outputFile = 'out.txt';

/**
 * Parses the body to get anchor tags and stores them in an array
 * @param {string} body - The HTML that needs to be parsed.
 */
var scrapeLinks = function (body) {
	let $ = cheerio.load (body);
	$('a').each (function (index, element) {
		let href = element.attribs['href'];
		if (href[0] == '/') href = baseUrl + href;
		if (urls.indexOf (href) == -1 && urls.indexOf (href + '/') == -1) {
			urls.push (href);
		}
	});	
}

 /**
 * Writes all links occurring at a URL to a file
 * @param {string} url - The url to be crawled recursively
 */
var getLinks = function (url) {
	request(url, function (error, response, body) {
		if (error) {
			console.log (error);
		}
		else {
			openConnections -= 1;
			scrapeLinks (body);
			while (openConnections <5 && ++toScrape < urls.length) {
				openConnections +=1;
				if (/https?:\/\/medium.com.*/.test (urls[toScrape])) {
					getLinks (urls[toScrape]);
				}
				else {
					continue;
				}
			}
			if (toScrape == urls.length) {
				fs.writeFile (outputFile, urls.join (','), function (err) {
					if (err) console.log (err);
					else console.log ("Written to ", outputFile, " at ", new Date().toLocaleDateString());
				});
			}
		}
	});
}

var urls = [baseUrl], toScrape = 0, openConnections =1;
getLinks (urls[toScrape]);
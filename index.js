var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');
var baseUrl = 'https://medium.com';
var outputFile = 'out.txt';
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
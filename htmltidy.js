var fs = require('fs');
var htmltidy = require('htmltidy2');

// Read HTML from stdin.
var html = fs.readFileSync('/dev/stdin').toString();

// Parse HTML and output to console.
htmltidy.tidy(html, function(err, htmltidied) {
	console.log(htmltidied);
});

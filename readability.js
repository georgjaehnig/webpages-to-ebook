var readability = require('node-readability');
var fs = require('fs');

var processContent = function(content) {
  content = content.replace(/(<img .*?)>/g, '$1/>');
  content = content.replace(/<br>/g, '<br/>');
  return content;
}

// Read HTML from stdin.
var html = fs.readFileSync('/dev/stdin').toString();

// Parse HTML and output to console.
readability(html, function(err, article, meta) {
	var title =  article.title;
	var content = article.content;
	content = processContent(content);
	var md = '<h1>' + title + "</h1>" + content;
	console.log(md);
});

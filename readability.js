var readability = require('node-readability');
var fs = require('fs');
var Twig = require('twig');

var processContent = function(content) {
  content = content.replace(/(<img .*?)>/g, '$1/>');
  content = content.replace(/<br>/g, '<br/>');
  return content;
}

// Read HTML from stdin.
var html = fs.readFileSync('/dev/stdin').toString();

// Parse HTML and output to console.
readability(html, function(err, article, meta) {

  article.content = processContent(article.content);

  var twig = fs.readFileSync('./templates/article.html.twig').toString();
  var template = Twig.twig({ data: twig });
  var html_processed = template.render(article);
  
  console.log(html_processed);
});

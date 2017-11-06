var fs = require('fs');
var yaml = require('js-yaml');
var md5 = require('md5');
var Twig = require('twig');

var readability = require('node-readability');

var processContent = function(content) {
  content = content.replace(/(<img .*?)>/g, '$1/>');
  content = content.replace(/<br>/g, '<br/>');
  return content;
}

const child_process = require( 'child_process' );

// Parse arguments.
if (process.argv.length < 3) {
  console.log('Usage:');
  console.log(process.argv[1] + ' settings.yml');
  process.exit();
}

// Read definition.
var ymlPath = process.argv[2];
var yml = fs.readFileSync(ymlPath, 'utf-8');
var book = yaml.load(yml)


var count = book.content.length;

for (let url of book.content) {
  let url_md5 = md5(url);
  console.log("Process " + url_md5 + ' ' + url);
  // TODO: I deprecated.
  fs.exists('./output/html/' + url_md5 + '.html', function(exists) {
    if (!exists) {
      console.log("\t download.");
      let wget = child_process.spawn( 'wget', [ '-O', './output/html/' + url_md5 + '.html', '--convert-links', url ] ); 
      wget.on('close', (code) => {
        parseFile(url_md5);
      });
    }
    else {
      console.log('Already downloaded: ' + url_md5);
      parseFile(url_md5);
    }
  });
}

function parseFile(url_md5) {

  fs.readFile('./output/html/' + url_md5 + '.html', (err, data) => {
    let html = data.toString();

    readability(html, function(err, article, meta) {
    
      article.content = processContent(article.content);
    
      // TODO:
      // Call this only once.
      var twig = fs.readFileSync('./templates/article.html.twig').toString();
      var template = Twig.twig({ data: twig });
      var html_processed = template.render(article);
  
      console.log('Parse ' + url_md5);
  		fs.writeFileSync('./output/html.processed/' + url_md5 + '.html', html_processed);

      count--;

      // When parsed all files.
      if (count == 0) {
        createEpub();
      }
    });
  });
}

function createEpub() {

  // Set metadata.
  var twig = fs.readFileSync('./templates/epub-metadata.xml.twig').toString();
  var template = Twig.twig({ data: twig });
  var xml = template.render(book);
  fs.writeFileSync('./output/meta/' + book.shortname + '.xml', xml)
  
  var filepaths = [];
  for (url of book.content) {
    var url_md5 = md5(url);
    filepaths.push('./output/html.processed/' + url_md5 + '.html');
  }

  // Create EPUB.
  console.log('Create EPUB.')
  console.log(filepaths);
  child_process.spawnSync( 'pandoc', [ '--from', 'html', '-o', './output/epub/' + book.shortname + '.epub', '--epub-metadata', './output/meta/' + book.shortname + '.xml' ].concat(filepaths) );
  // TODO:
  // Output exit status.
}

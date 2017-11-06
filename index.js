const fs = require('fs');
const yaml = require('js-yaml');
const md5 = require('md5');
const Twig = require('twig');
const child_process = require( 'child_process' );
const readability = require('node-readability');

var processContent = function(content) {
  content = content.replace(/(<img .*?)>/g, '$1/>');
  content = content.replace(/<br>/g, '<br/>');
  return content;
}


// Parse arguments.
if (process.argv.length < 3) {
  console.log('Usage:');
  console.log(process.argv[1] + ' definition.yml');
  process.exit();
}

var book = readDefinitions();

// Get template.
let twig = fs.readFileSync('./templates/article.html.twig').toString();
var template = Twig.twig({ data: twig });

var count = book.content.length;

for (let url of book.content) {
  let url_md5 = md5(url);
  console.log(url_md5 + ': processing, URL: ' + url);
  // TODO: Deprecated.
  if (!fs.existsSync('./output/html/' + url_md5 + '.html')) {
    console.log(url_md5 + ': downloading.');
    let wget = child_process.spawn( 'wget', [ '-O', './output/html/' + url_md5 + '.html', '--convert-links', url ] ); 
    wget.on('close', (code) => {
      console.log(url_md5 + ': downloaded.');
      parseFile(url_md5);
    });
  }
  else {
    console.log(url_md5 + ': already downloaded.');
    parseFile(url_md5);
  }
}

function readDefinitions() {
  let ymlPath = process.argv[2];
  let yml = fs.readFileSync(ymlPath, 'utf-8');
  let book = yaml.load(yml)
  return book;
}

function parseFile(url_md5) {

  fs.readFile('./output/html/' + url_md5 + '.html', (err, data) => {
    let html = data.toString();
    if (fs.existsSync('./output/html.processed/' + url_md5 + '.html')) {
      decreaseCount();
      return;
    }

    readability(html, function(err, article, meta) {
      article.content = processContent(article.content);
      let html_processed = template.render(article);
      console.log(url_md5 + ': extracting content.');
      fs.writeFileSync('./output/html.processed/' + url_md5 + '.html', html_processed);
      decreaseCount();
    });
  });
}

function decreaseCount() {
  count--;
  // When parsed all files.
  if (count == 0) {
    createEpub();
  }
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
  console.log('Creating EPUB...')
  child_process.spawnSync( 'pandoc', [ '--from', 'html', '-o', './output/epub/' + book.shortname + '.epub', '--epub-metadata', './output/meta/' + book.shortname + '.xml' ].concat(filepaths) );
  // TODO:
  // Output exit status.
  console.log('Done.')
}

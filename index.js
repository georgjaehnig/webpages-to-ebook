const fs = require('fs');
const yaml = require('js-yaml');
const md5 = require('md5');
const Twig = require('twig');
const child_process = require( 'child_process' );
const readability = require('node-readability');
const deepmerge = require('deepmerge');


// Parse arguments.
if (process.argv.length < 3) {
  console.log('Usage:');
  console.log(process.argv[1] + ' definition.yml [definition2.yml]');
  console.log('(The rightmost will override all previous.)');
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
  ensureRawFile(url, url_md5);
  parseFile(url_md5);
}

function readDefinitions() {
  let ymlPaths = process.argv.slice(2);
  let book = {};

  while (ymlPaths.length > 0) {
    let ymlPath = ymlPaths.shift();
    let yml = fs.readFileSync(ymlPath, 'utf-8');
    let currentBook = yaml.load(yml);
    book = deepmerge(book, currentBook);

  }
  return book;
}

function ensureRawFile(url, url_md5) {
  // TODO: Deprecated.
  if (!fs.existsSync('./output/html/' + url_md5 + '.html')) {
    console.log(url_md5 + ': downloading.');
    child_process.spawnSync( 'wget', [ '-O', './output/html/' + url_md5 + '.html', '--convert-links', url ] ); 
    console.log(url_md5 + ': downloaded.');
  }
  else {
    console.log(url_md5 + ': already downloaded.');
  }
}

function parseFile(url_md5) {

  fs.readFile('./output/html/' + url_md5 + '.html', (err, data) => {
    let html = data.toString();
    if (fs.existsSync('./output/html.processed/' + url_md5 + '.html')) {
      decreaseCount();
      return;
    }
    if (err) {
      console.log('Error reading ' . url_md5); 
    }

    readability(html, function(err, article, meta) {
      article.content = modifyContent(article.content);
      let html_processed = template.render(article);
      console.log(url_md5 + ': extracting content.');
      fs.writeFileSync('./output/html.processed/' + url_md5 + '.html', html_processed);
      decreaseCount();
    });
  });
}

function modifyContent(content) {
  if (typeof book.modify === 'undefined') {
    return content; 
  }
  if (typeof book.modify.content === 'undefined') {
    return content; 
  }
  for (let modify of book.modify.content) {
    let searchRegExp = new RegExp(modify.search);
    content = content.replace(searchRegExp, modify.replace);
  }
  return content;
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

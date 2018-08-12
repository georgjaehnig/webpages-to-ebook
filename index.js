const fs = require('fs');
const yaml = require('js-yaml');
const md5 = require('md5');
const Twig = require('twig');
const child_process = require( 'child_process' );
const readability = require('node-readability');
const deepmerge = require('deepmerge');

var book;
var count;
var template;

main();

function main() {

  // Parse arguments.
  if (process.argv.length < 3) {
    console.log('Usage:');
    console.log(process.argv[1] + ' definition.yml [definition2.yml]');
    console.log('(The rightmost will override all previous.)');
    return;
  }
  
  book = readDefinitions();
  
  // Get template.
  let twig = fs.readFileSync('./templates/article.html.twig').toString();
  template = Twig.twig({ data: twig });
  
  count = book.content.length;
  
  for (let item of book.content) {
    
    let content = {};

    // If a string:
    // assume it's a URL.
    if (typeof(item) == 'string') {
      content['url'] = item;
    }
    else {
      content = item;
    }

    if (content['url']) {
      content['hash'] = md5(content['url']);
      console.log(content['hash'] + "\t" + 'processing'+ "\t" + content['url']);
      ensureRawFile(content['url'], content['hash']);
      parseFile(content['hash']);
    }
    else {
      count--;
    }
  }
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
    console.log(url_md5 + "\t" + 'downloading');
    child_process.spawnSync( 'wget', [ '-O', './output/html/' + url_md5 + '.html', '--convert-links', url ] ); 
    console.log(url_md5 + "\t" + 'downloaded');
  }
  else {
    console.log(url_md5 + "\t" + 'already downloaded');
  }
}

function parseFile(url_md5) {

  fs.readFile('./output/html/' + url_md5 + '.html', (err, data) => {
    let html = data.toString();
    if (fs.existsSync('./output/html.processed/' + url_md5 + '.html')) {
      console.log(url_md5 + "\t" + 'already extracted content');
      decreaseCount();
      return;
    }
    if (err) {
      console.log(url_md5 + "\t" + 'read error'); 
    }

    readability(html, function(err, article, meta) {
      if (err) {
        console.log(url_md5 + ': Error on parsing. Skipping file.');
        fs.writeFileSync('./output/html.processed/' + url_md5 + '.html', '');
        decreaseCount();
        return;
      }
      let articleCopy = {};
      articleCopy.title = article.title;
      articleCopy.content = article.content;
      modify(articleCopy);
      let html_processed = template.render(articleCopy);
      console.log(url_md5 + "\t" + 'extracting content');
      fs.writeFileSync('./output/html.processed/' + url_md5 + '.html', html_processed);
      decreaseCount();
    });
  });
}

function modify(article) {

  if (typeof book.modify === 'undefined') {
    return; 
  }
  for (key in book.modify) {
    for (let modify of book.modify[key]) {
      let searchRegExp = new RegExp(modify.search, modify.flags || '' );
      article[key] = article[key].replace(searchRegExp, modify.replace);
    }
  }

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

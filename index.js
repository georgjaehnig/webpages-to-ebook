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
var hashes = [];

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
      let hash = md5(content['url']);
      console.log(hash + "\t" + 'processing'+ "\t" + content['url']);
      hashes.push(hash);
      ensureRawFile(content['url'], hash);
      parseFile(content['url'], hash);
    }
    else if (content['raw']) {
      let hash = md5(content['raw']);
      console.log(hash + "\t" + 'writing raw content to file');
      hashes.push(hash);
      fs.writeFileSync('./output/html.processed/' + hash + '.html', content['raw']);
      decreaseCount();
    }
    else {
      decreaseCount();
    }
  }
}

function readDefinitions() {
  
  let ymlPaths = process.argv.slice(2);
  
  // Defaults.
  ymlPaths.unshift(__dirname + '/definitions/defaults.yml');

  let book = {};

  while (ymlPaths.length > 0) {
    let ymlPath = ymlPaths.shift();
    let yml = fs.readFileSync(ymlPath, 'utf-8');
    let currentBook = yaml.load(yml);
    book = deepmerge(book, currentBook);

  }
  return book;
}

function ensureRawFile(url, hash) {
  // TODO: Deprecated.
  if (!fs.existsSync('./output/html/' + hash + '.html')) {
    console.log(hash + "\t" + 'downloading');
    child_process.spawnSync( 'wget', [ '-O', './output/html/' + hash + '.html', '--convert-links', url ] ); 
    console.log(hash + "\t" + 'downloaded');
  }
  else {
    console.log(hash + "\t" + 'already downloaded');
  }
}

function parseFile(url, hash) {

  fs.readFile('./output/html/' + hash + '.html', (err, data) => {
    let html = data.toString();
    if (fs.existsSync('./output/html.processed/' + hash + '.html')) {
      console.log(hash + "\t" + 'already extracted content');
      decreaseCount();
      return;
    }
    if (err) {
      console.log(hash + "\t" + 'read error'); 
    }

    readability(html, function(err, article, meta) {
      if (err) {
        console.log(hash + ': Error on parsing. Skipping file.');
        fs.writeFileSync('./output/html.processed/' + hash + '.html', '');
        decreaseCount();
        return;
      }
      let context = {};
      context.title = article.title;
      context.content = article.content;
      context.url = url;
      context.tags = book.tags;
      modify(context);
      let html_processed = template.render(context);
      console.log(hash + "\t" + 'extracting content');
      fs.writeFileSync('./output/html.processed/' + hash + '.html', html_processed);
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
  for (let hash of hashes) {
    filepaths.push('./output/html.processed/' + hash + '.html');
  }

  // Create EPUB.
  console.log('Creating EPUB...')
  child_process.spawnSync( 'pandoc', [ '--from', 'html', '-o', './output/epub/' + book.shortname + '.epub', '--epub-metadata', './output/meta/' + book.shortname + '.xml' ].concat(filepaths) );
  // TODO:
  // Output exit status.
  console.log('Done.')
}

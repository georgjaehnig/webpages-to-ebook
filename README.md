# Webpages to eBook

Create an EPUB from a list of URLs. Standing on the shoulders of 

> [Wget](https://www.gnu.org/software/wget/) → [Readability](https://github.com/mozilla/readability) → [Pandoc](https://pandoc.org/)

## Create your own ebooks

### Requirements

- Node.js
- NPM
- [Wget](https://www.gnu.org/software/wget/): `wget` has to be in `PATH`.
- [Pandoc](https://pandoc.org/): `pandoc` has to be in `PATH`.

### Install

    git clone https://github.com/georgjaehnig/webpages-to-ebook.git
    cd webpages-to-ebook
    npm install

### Usage

1. Create a definition, like the examples in `definitions/`.
2. `node index.js your-created-definition.yml [optional-definition-to-be-merged-with-the-first.yml]`
3. Find your EPUB in `output/epub/`.

### Documentation

- https://github.com/georgjaehnig/webpages-to-ebook/wiki/docs

## Examples
- [`slatestarcodex.year.2020.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2020.yml)
- [`slatestarcodex.year.2019.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2019.yml)
- [`slatestarcodex.year.2018.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2018.yml)
- [`slatestarcodex.year.2017.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2017.yml)
- [`slatestarcodex.year.2016.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2016.yml)
- [`slatestarcodex.year.2015.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2015.yml)
- [`slatestarcodex.year.2014.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2014.yml)
- [`slatestarcodex.year.2013.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.year.2013.yml)
- [`slatestarcodex.top.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.top.yml)
- [`slatestarcodex.top.more.epub`](https://drive.google.com/drive/folders/1jsppeA2gkkXQ2SQTIbDa9ieY6sh_ZuaA?usp=sharing), [source](definitions/slatestarcodex.top.more.yml)

Also some structuring with raw HTML is possible, check 
[`definitions/library_of_scott_alexandria.yml`](definitions/library_of_scott_alexandria.yml) and in there `raw:` and `tags:/title:`.

# Webpages to eBook

Create an EPUB from a list of URLs. Standing on the shoulders of 

> [Wget](https://www.gnu.org/software/wget/) → [Readability](https://github.com/mozilla/readability) → [Pandoc](https://pandoc.org/)


## Examples
- [`slatestarcodex.year.2017.epub`](https://drive.google.com/open?id=0B73-tppgbUreVy05TXlOcm5DczQ), created from [`definitions/slatestarcodex.year.2017.yml`](definitions/slatestarcodex.year.2017.yml)
- [`slatestarcodex.year.2016.epub`](https://drive.google.com/open?id=0B73-tppgbUreNE94UEdFTnNDTHM), created from [`definitions/slatestarcodex.year.2016.yml`](definitions/slatestarcodex.year.2016.yml)
- [`slatestarcodex.year.2015.epub`](https://drive.google.com/open?id=0B73-tppgbUreZlU1N1h3TUFHM1k), created from [`definitions/slatestarcodex.year.2015.yml`](definitions/slatestarcodex.year.2015.yml)
- [`slatestarcodex.year.2014.epub`](https://drive.google.com/open?id=0B73-tppgbUreZExTZ1hOdHdWMjg), created from [`definitions/slatestarcodex.year.2014.yml`](definitions/slatestarcodex.year.2014.yml)
- [`slatestarcodex.year.2013.epub`](https://drive.google.com/open?id=0B73-tppgbUredzNjY0xPbmNOVms), created from [`definitions/slatestarcodex.year.2013.yml`](definitions/slatestarcodex.year.2013.yml)
- [`slatestarcodex.top.epub`](https://drive.google.com/open?id=0B73-tppgbUreZkxqU0ZQcjhzQ1E), created from [`definitions/slatestarcodex.top.yml`](definitions/slatestarcodex.top.yml)
- [`slatestarcodex.top.more.epub`](https://drive.google.com/open?id=12JMJOpV_SazxNPhrCptk0hydJPrrJH4M), created from [`definitions/slatestarcodex.top.more.yml`](definitions/slatestarcodex.top.more.yml)



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

# Webpages to eBook

Create an EPUB from a list of URLs. Standing on the shoulders of 

> [Wget](https://www.gnu.org/software/wget/) → [Readability](https://github.com/mozilla/readability) → [Pandoc](https://pandoc.org/)


## Examples
- [SlateStarCodex all articles 2017](https://drive.google.com/open?id=0B73-tppgbUreVy05TXlOcm5DczQ), created from [`definitions/slatestarcodex.year.2017.yml`](definitions/slatestarcodex.year.2017.yml)
- [SlateStarCodex all articles 2016](https://drive.google.com/open?id=0B73-tppgbUreNE94UEdFTnNDTHM), created from [`definitions/slatestarcodex.year.2016.yml`](definitions/slatestarcodex.year.2016.yml)
- [SlateStarCodex all articles 2015](https://drive.google.com/open?id=0B73-tppgbUreZlU1N1h3TUFHM1k), created from [`definitions/slatestarcodex.year.2015.yml`](definitions/slatestarcodex.year.2015.yml)
- [SlateStarCodex all articles 2014](https://drive.google.com/open?id=0B73-tppgbUreZExTZ1hOdHdWMjg), created from [`definitions/slatestarcodex.year.2014.yml`](definitions/slatestarcodex.year.2014.yml)
- [SlateStarCodex all articles 2013](https://drive.google.com/open?id=0B73-tppgbUredzNjY0xPbmNOVms), created from [`definitions/slatestarcodex.year.2013.yml`](definitions/slatestarcodex.year.2013.yml)
- [SlateStarCodex top articles](https://drive.google.com/open?id=0B73-tppgbUreZkxqU0ZQcjhzQ1E), created from [`definitions/slatestarcodex.top.yml`](definitions/slatestarcodex.top.yml)


## Requirements

- Node.js
- NPM
- [Wget](https://www.gnu.org/software/wget/) 
- [Pandoc](https://pandoc.org/)

## Install

    git clone https://github.com/georgjaehnig/webpages-to-ebook.git
    npm install

## Usage

1. Create a definition, like the examples in `definitions/`.
2. `node index.js your-created-definition.yml`
3. Find your EPUB in `output/epub/`.

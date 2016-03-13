# Urban Dictionary Data Collector

Script used to download the entire Urban Dictionary dataset. Actual dataset is pretty large, so I've split it into four Google Fusion Tables:

* [Part One][part1]
* [Part Two][part2]
* [Part Three][part3]
* [Part Four][part4]

## Downloading the Data Yourself
If you want to collect your own sample from urban dictionary, this repo includes a few scripts that can help you do just that.

### `download.js`
Main entry downloader. Requires a word list to download entries for. [Try grabbing the one from here][word_list]. 

```bash
$ npm install

# Pass in a word list file
$ node download.js data/a.txt
```

This will attempt to download the first 10 definitions for each word in the list into a file `data/a.txt`. Data is stored in [NeDB databases][nedb], but you should be able to easily update `download.js` to output whatever format you need.


### `gen_csv.py`
Simple python script used to turn NeDB dataset from `download.js` into CSV:

```bash
$ python3 gen_csv.py data.db out.csv
```

### `gen_md.js`
Simple Javascript script used to generate markdown for entries. Used for character level machine learning of urban dictionary entries.

```bash
$ node gen_md.js data.db urban.md
```


## Notes
This is for research purposes. I'm not affiliated with Urban Dictionary.


[nedb]: https://github.com/louischatriot/nedb

[word_list]: https://github.com/mattbierner/urban-dictionary-word-list



[part1]: https://www.google.com/fusiontables/DataSource?docid=1icBg7W83c7skjaUnGkQy26nre032_dLlIkekNTsy
[part2]: https://www.google.com/fusiontables/DataSource?docid=1SFfRIi8yWNt0Ah_QtcAa15rJxyoDcKjFKy5u2aBe 
[part3]: https://www.google.com/fusiontables/DataSource?docid=1xrq6sYCbhhEa0xSber_4yo-H8OxWegFXTeGxNvag
[part4]: https://www.google.com/fusiontables/DataSource?docid=1fuGPggoae6_j9wxA7rVJHU30nqtENJyXZLv3XHxp


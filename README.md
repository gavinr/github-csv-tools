# github-csv-tools [![Build Status](https://travis-ci.org/gavinr/github-csv-tools.svg?branch=master)](https://travis-ci.org/gavinr/github-csv-tools)
Tools for importing GitHub Issues via CSV. (Exporting to come soon?)

Currently imports title, description, labels, and milestones.

## Usage

 1. `npm install -g github-csv-tools`
 2. `githubCsvTools myFile.csv`

`githubCsvTools --help` for info on how to use the command line tool

## Development

1. Clone the repo.
2. Browse to repo, then run `npm install -g`

## Changelog

See [CHANGELOG.md](https://github.com/gavinr/github-csv-tools/blob/master/CHANGELOG.md)

## Thanks

- [github package](https://www.npmjs.com/package/github)
- [nodeCSV](https://www.npmjs.com/package/csv)
- [commander](https://www.npmjs.com/package/commander)
- [co](https://www.npmjs.com/package/co)
- [Tim Patterson's Post on Atlassian.com](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)

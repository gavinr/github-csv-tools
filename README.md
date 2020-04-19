# github-csv-tools [![Build Status](https://travis-ci.org/gavinr/github-csv-tools.svg?branch=master)](https://travis-ci.org/gavinr/github-csv-tools)
Tools for importing GitHub Issues via CSV. (Exporting to come soon?)

Currently imports title, description, labels, and milestones.

## Usage

`githubCsvTools --help` for info on how to use the command line tool. 

First run `npm install -g github-csv-tools` to install. Then:

### To Import Issues

`githubCsvTools myFile.csv`

### To Export Issues

`githubCsvTools`

### Tokens

For all actions, you'll need a GitHub token:

1. Go to https://github.com/settings/tokens
2. Click "Generate New Token"
3. Check on `repo`
4. Copy the token provided - this tool will ask for it.

## Development

1. Clone the repo.
2. Browse to repo, then run `npm install -g`

## Changelog

See [CHANGELOG.md](https://github.com/gavinr/github-csv-tools/blob/master/CHANGELOG.md)

## Thanks

- [octokit/rest.js](https://octokit.github.io/rest.js/)
- [nodeCSV](https://www.npmjs.com/package/csv)
- [commander](https://www.npmjs.com/package/commander)
- [co](https://www.npmjs.com/package/co)
- [Tim Patterson's Post on Atlassian.com](https://developer.atlassian.com/blog/2015/11/scripting-with-node/)

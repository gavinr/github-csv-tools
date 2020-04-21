# GitHub CSV Tools [![Build Status](https://travis-ci.org/gavinr/github-csv-tools.svg?branch=master)](https://travis-ci.org/gavinr/github-csv-tools)
Import and export GitHub issues via CSV

## Usage


Prerequisite: [Install Node.js](https://nodejs.org/en/), then run this to install:

```
npm install -g github-csv-tools
```

After install, `githubCsvTools --help` for info on how to use, or see below.

Instructions for exporting or importing:

### To Import Issues

Currently imports title, description, labels, status (closed or open) and milestones.

```
githubCsvTools myFile.csv
```

### To Export Issues

```
githubCsvTools
```

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

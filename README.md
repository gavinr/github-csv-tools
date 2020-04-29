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

| Option                 | Default                                                                                     | Notes                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| -f, --exportFileName   | YYYY-MM-DD-hh-mm-ss-issues.csv                                                              | The name of the CSV you'd like to export to.                  |
| -a, --exportAttributes | number,title,labels,state,assignees,milestone,comments,created_at,updated_at,closed_at,body | Comma-separated list of attributes (columns) in the export**. |
| -c, --exportComments   | n/a                                                                                         | Include comments in the export.                               |

** List of all possible options for `exportAttributes`: `url`, `repository_url`, `labels_url`, `comments_url`, `events_url`, `html_url`, `id`, `node_id`, `number`, `title`, `user`, `labels`, `state`, `locked`, `assignee`, `assignees`, `milestone`, `comments`, `created_at`, `updated_at`, `closed_at`, `author_association`, `body` ([more info](https://developer.github.com/v3/issues/#get-an-issue))

### Tokens

For all actions, the tool will ask you to input a GitHub token. To obtain this token:

1. Go to https://github.com/settings/tokens
2. Click "Generate New Token"
3. Check on `repo`
4. Copy/paste the token provided when the tool asks for it.

## Other Options

| Option                  | Notes                                                |
| ----------------------- | ---------------------------------------------------- |
| -V, --version           | output the version number                            |
| -g, --github_enterprise | Your GitHub Enterprise URL.                          |
| -t, --token             | The GitHub token. https://github.com/settings/tokens |
| -h, --help              | See all the options and help.                        |

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

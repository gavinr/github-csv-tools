# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [0.4.0] - 2020-04-18

## Changed
- Updated to `octokit/rest.js` v17
  - `pathPrefix` no longer supported
  - Send full URL in for `github_enterprise` (if not sent, will use `https://api.github.com` by default)
- `bottleneck` package is no longer used in favor of `@octokit/plugin-throttling`

## [0.3.0] - 2017-12-22
### Changed
- Re-publishing to NPM with `LF` line endings instead of `CRLF`


## [0.2.0] - 2017-07-19
### Added
- Support for Hosted Github (See `--github_enterprise` commandline switch)
- Ability to create issues that are already closed (`state` csv column)
- Assignee (`assignee` csv column)
- "Bottleneck" to limit frequency of requests to the GitHub API.
- Milestone support (`milestone` csv column)


### Thanks
- @kwhite for Bottleneck and milestone features
- @ojacques for Hosted Github, state, and assignee features

## 0.1.0 - 2016-07-04
### Added
- Basic CSV import functionality.
- A few basic tests

[Unreleased]: https://github.com/gavinr/github-csv-tools/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/gavinr/github-csv-tools/compare/v0.3.0...0.4.0
[0.3.0]: https://github.com/gavinr/github-csv-tools/compare/v0.2.0...0.3.0
[0.2.0]: https://github.com/gavinr/github-csv-tools/compare/v0.1.0...0.2.0

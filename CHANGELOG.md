# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]

## [1.0.2] - 2020-04-28

## Added

- `exportAttributes` option ([#15](https://github.com/gavinr/github-csv-tools/pull/15))

## Changed

- `body` (initial issue text) is now included in the export by default ([#14](https://github.com/gavinr/github-csv-tools/issues/14))
- Update dependencies (9ab2b1e47a7c7fa40149a36af03625d80738f887)

## [1.0.1] - 2020-04-21

- Metadata and README - no functionality changes.

## [1.0.0] - 2020-04-18

## Added
- Exporting issues is now supported. Just call `githubCsvTools` with no file input. See `githubCsvTools --help` for more info.

## [0.4.0] - 2020-04-18

## Changed
- Updated to `octokit/rest.js` v17
  - `pathPrefix` no longer supported
  - Send full URL in for `github_enterprise` (if not sent, will use `https://api.github.com` by default)
- `bottleneck` package is no longer used in favor of `@octokit/plugin-throttling`
- Supporting current and LTS versions of Node.js.

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

[Unreleased]: https://github.com/gavinr/github-csv-tools/compare/v1.0.2...HEAD
[1.0.2]: https://github.com/gavinr/github-csv-tools/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/gavinr/github-csv-tools/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/gavinr/github-csv-tools/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/gavinr/github-csv-tools/compare/V0.3.0...v0.4.0
[0.3.0]: https://github.com/gavinr/github-csv-tools/compare/v0.2.0...V0.3.0
[0.2.0]: https://github.com/gavinr/github-csv-tools/compare/v0.1.0...v0.2.0

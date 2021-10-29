## [3.1.3](https://github.com/gavinr/github-csv-tools/compare/v3.1.2...v3.1.3) (2021-10-29)


### Bug Fixes

* **version:** show proper version number in cli ([f89db20](https://github.com/gavinr/github-csv-tools/commit/f89db208c9bad2fbf555ceac0ab695b4174f77f2))

## [3.1.2](https://github.com/gavinr/github-csv-tools/compare/v3.1.1...v3.1.2) (2021-02-17)


### Bug Fixes

* **package:** Security updates for deps ([b29c664](https://github.com/gavinr/github-csv-tools/commit/b29c66476f2eb8f025be8aba11cd5e4c92525e67))

## [3.1.1](https://github.com/gavinr/github-csv-tools/compare/v3.1.0...v3.1.1) (2021-02-08)


### Bug Fixes

* **semantic-release:** re-run release to fix github release ([0d352df](https://github.com/gavinr/github-csv-tools/commit/0d352dfe2e8b57ddc8ccfb25c6984d164ba9d5f4))

## [3.1.0](https://github.com/gavinr/github-csv-tools/compare/v3.0.0...v3.1.0) (2021-02-08)


### Features

* **ci:** re-running release via semantic-release ([80cb482](https://github.com/gavinr/github-csv-tools/commit/80cb482b886747fd672c9373340fc678997731df))

## [3.0.0](https://github.com/gavinr/github-csv-tools/compare/v2.1.0...v3.0.0) (2021-02-08)


### Features

* **export:** Import with "body" instead of "description" ([e1f5126](https://github.com/gavinr/github-csv-tools/commit/e1f512694832833a792c05e5dd0c851001cc3b1f))


### BREAKING CHANGES

* **export:** Import with "body" instead of "description"

## [2.1.0] - 2020-11-08

## Added

- Importing: Columns will work if not all lowercase. Thank you @typememo ! [#33](https://github.com/gavinr/github-csv-tools/pull/33)

## Changed

- Updated dependencies

## [2.0.0] - 2020-08-23

## Added

- Additional options `exportAll` to export all possible issue attributes.
- Optionally pass organization (or username) via commandline option, `--organization`.
- Optionally pass repository name via commandline option, `--repository`.

## Changed

- Default fields include milestone title. 

## [1.0.3] - 2020-05-03

## Changed

- Fixed month number in export ([#16](https://github.com/gavinr/github-csv-tools/pull/16))

## [1.0.2] - 2020-04-28

## Added

- `exportAttributes` option ([#15](https://github.com/gavinr/github-csv-tools/pull/15))

## Changed

- `body` (initial issue text) is now included in the export by default ([#14](https://github.com/gavinr/github-csv-tools/issues/14))
- [Update dependencies](https://github.com/gavinr/github-csv-tools/commit/9ab2b1e47a7c7fa40149a36af03625d80738f887)

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

[Unreleased]: https://github.com/gavinr/github-csv-tools/compare/v2.1.0...HEAD
[2.1.0]: https://github.com/gavinr/github-csv-tools/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/gavinr/github-csv-tools/compare/v1.0.3...v2.0.0
[1.0.3]: https://github.com/gavinr/github-csv-tools/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/gavinr/github-csv-tools/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/gavinr/github-csv-tools/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/gavinr/github-csv-tools/compare/v0.4.0...v1.0.0
[0.4.0]: https://github.com/gavinr/github-csv-tools/compare/V0.3.0...v0.4.0
[0.3.0]: https://github.com/gavinr/github-csv-tools/compare/v0.2.0...V0.3.0
[0.2.0]: https://github.com/gavinr/github-csv-tools/compare/v0.1.0...v0.2.0

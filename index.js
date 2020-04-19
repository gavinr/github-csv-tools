#!/usr/bin/env node
/* jshint esversion: 6 */

const program = require("commander");
const co = require("co");
const prompt = require("co-prompt");
const { Octokit } = require("@octokit/rest");
const { throttling } = require("@octokit/plugin-throttling");

const { importFile } = require("./import.js");
const { exportIssues } = require("./export.js");

program
  .version("1.0.0")
  .arguments("[file]")
  .option(
    "-g, --github_enterprise [https://api.github.my-company.com]",
    "Your GitHub Enterprise URL."
  )
  .option(
    "-t, --token [token]",
    "The GitHub token. https://github.com/settings/tokens"
  )
  .option(
    "-f, --exportFileName [export.csv]",
    "The name of the CSV you'd like to export to."
  )
  .option("-c, --exportComments", "Include comments in the export.")
  .action(function (file, options) {
    co(function* () {
      var retObject = {};
      retObject.githubUrl =
        options.github_enterprise || "https://api.github.com";
      retObject.token = options.token || "";
      if (retObject.token === "") {
        retObject.token = yield prompt(
          "token (get from https://github.com/settings/tokens): "
        );
      }
      retObject.exportFileName = options.exportFileName || false;
      retObject.exportComments = options.exportComments || false;
      retObject.userOrOrganization = yield prompt("user or organization: ");
      retObject.repo = yield prompt("repo: ");
      return retObject;
    }).then(
      function (values) {
        const ThrottledOctokit = Octokit.plugin(throttling);
        const octokit = new ThrottledOctokit({
          auth: values.token,
          userAgent: "github-csv-tools",
          baseUrl: values.githubUrl,
          throttle: {
            onRateLimit: (retryAfter, options) => {
              console.warn(
                `Request quota exhausted for request ${options.method} ${options.url}`
              );

              if (options.request.retryCount === 0) {
                // only retries once
                console.log(`Retrying after ${retryAfter} seconds!`);
                return true;
              }
            },
            onAbuseLimit: (retryAfter, options) => {
              // does not retry, only logs a warning
              console.warn(
                `Abuse detected for request ${options.method} ${options.url}`
              );
            },
          },
        });

        if (file) {
          // This is an import!
          importFile(octokit, file, values);
        } else {
          // this is an export!
          exportIssues(octokit, values);
        }
      },
      function (err) {
        console.error("ERROR", err);
      }
    );
  })
  .parse(process.argv);

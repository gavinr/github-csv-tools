#!/usr/bin/env node
/* jshint esversion: 6 */

const program = require("commander");
const co = require("co");
const prompt = require("co-prompt");
const { Octokit } = require("@octokit/rest");
const { throttling } = require("@octokit/plugin-throttling");

const { createIssue } = require("./helpers.js");

const csv = require("csv");
const fs = require("fs");

program
  .version("0.4.0")
  .arguments("<file>")
  .option(
    "--github_enterprise [https://api.github.my-company.com]",
    "Your GitHub Enterprise URL."
  )
  .option(
    "--token [token]",
    "The GitHub token. https://github.com/settings/tokens"
  )
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

        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            console.error("Error reading file.");
            process.exit(1);
          }
          csv.parse(
            data,
            {
              trim: true,
            },
            (err, csvRows) => {
              if (err) throw err;
              var cols = csvRows[0];
              csvRows.shift();

              // get indexes of the fields we need
              var titleIndex = cols.indexOf("title");
              var bodyIndex = cols.indexOf("description");
              var labelsIndex = cols.indexOf("labels");
              var milestoneIndex = cols.indexOf("milestone");
              var assigneeIndex = cols.indexOf("assignee");
              var stateIndex = cols.indexOf("state");

              if (titleIndex === -1) {
                console.error(
                  "Title required by GitHub, but not found in CSV."
                );
                process.exit(1);
              }
              const createPromises = csvRows.map((row) => {
                var sendObj = {
                  owner: values.userOrOrganization,
                  repo: values.repo,
                  title: row[titleIndex],
                };

                // if we have a body column, pass that.
                if (bodyIndex > -1) {
                  sendObj.body = row[bodyIndex];
                }

                // if we have a labels column, pass that.
                if (labelsIndex > -1 && row[labelsIndex] !== "") {
                  sendObj.labels = row[labelsIndex].split(",");
                }

                // if we have a milestone column, pass that.
                if (milestoneIndex > -1 && row[milestoneIndex] !== "") {
                  sendObj.milestone = row[milestoneIndex];
                }

                // if we have an assignee column, pass that.
                if (assigneeIndex > -1 && row[assigneeIndex] !== "") {
                  sendObj.assignees = row[assigneeIndex]
                    .replace(/ /g, "")
                    .split(",");
                }

                // console.log("sendObj", sendObj);
                let state = false;
                if (stateIndex > -1 && row[stateIndex] === "closed") {
                  state = row[stateIndex];
                }
                return createIssue(octokit, sendObj, state);
              });

              Promise.all(createPromises).then(
                (res) => {
                  const successes = res.filter((cr) => {
                    return cr.status === 200 || cr.status === 201;
                  });
                  const fails = res.filter((cr) => {
                    return cr.status !== 200 && cr.status !== 201;
                  });

                  console.log(
                    `Created ${successes.length} issues, and had ${fails.length} failures.`
                  );
                  console.log(
                    "❤ ❗ If this project has provided you value, please ⭐ star the repo to show your support: ➡ https://github.com/gavinr/github-csv-tools"
                  );

                  if (fails.length > 0) {
                    console.log(fails);
                  }

                  process.exit(0);
                },
                (err) => {
                  console.error("Error");
                  console.error(err);
                  process.exit(0);
                }
              );
            }
          );
        });
      },
      function (err) {
        console.error("ERROR", err);
      }
    );
  })
  .parse(process.argv);

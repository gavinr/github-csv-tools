const csv = require("csv");
const fs = require("fs");

const { createIssue } = require("./helpers.js");

const importFile = (octokit, file, values) => {
  fs.readFile(file, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file.");
      process.exit(1);
    }
    csv.parse(
      data,
      {
        trim: true,
        bom: true,
        delimiter: values.csvDelimiter,
      },
      (err, csvRows) => {
        if (err) throw err;
        const cols = csvRows[0].map((col) => col.toLowerCase());
        csvRows.shift();

        // get indexes of the fields we need
        const titleIndex = cols.indexOf("title");
        const bodyIndex = cols.indexOf("body");
        const labelsIndex = cols.indexOf("labels");
        const milestoneIndex = cols.indexOf("milestone");
        const assigneeIndex = cols.indexOf("assignee");
        const stateIndex = cols.indexOf("state");

        if (titleIndex === -1) {
          console.error("Title required by GitHub, but not found in CSV.");
          process.exit(1);
        }
        const createPromises = csvRows.map((row) => {
          const sendObj = {
            issue: {},
          };

          sendObj.issue.title = row[titleIndex];

          // if we have a body column, pass that.
          if (bodyIndex > -1 && row[bodyIndex] !== "") {
            sendObj.issue.body = row[bodyIndex];
          }

          // if we have a labels column, pass that.
          if (labelsIndex > -1 && row[labelsIndex] !== "") {
            sendObj.issue.labels = row[labelsIndex].split(",");
          }

          // if we have a milestone column, pass that.
          if (milestoneIndex > -1 && row[milestoneIndex] !== "") {
            sendObj.issue.milestone = Number(row[milestoneIndex]);
          }

          // if we have an assignee column, pass that.
          if (assigneeIndex > -1 && row[assigneeIndex] !== "") {
            sendObj.issue.assignee = row[assigneeIndex];
          }

          if (stateIndex > -1 && row[stateIndex].toLowerCase() === "closed") {
            sendObj.issue.closed = true;
          }
          return createIssue(
            octokit,
            sendObj,
            values.userOrOrganization,
            values.repo
          );
        });

        Promise.all(createPromises).then(
          (res) => {
            const successes = res.filter((cr) => {
              return (
                cr.status === 200 || cr.status === 201 || cr.status === 202
              );
            });
            const fails = res.filter((cr) => {
              return (
                cr.status !== 200 && cr.status !== 201 && cr.status !== 202
              );
            });

            console.log(
              `Created ${successes.length} issues, and had ${fails.length} failures.`
            );
            console.log(
              "❤ ❗ If this project has provided you value, please ⭐ star the repo to show your support: ➡ https://github.com/gavinr/github-csv-tools"
            );

            if (fails.length > 0) {
              console.error("ERROR - some of the imports have failed");
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
};

module.exports = { importFile };

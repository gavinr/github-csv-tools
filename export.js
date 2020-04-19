// const csv = require("csv");
const fs = require("fs");
const converter = require("json-2-csv");

// Gets a single comment
const getComment = async (octokit, values, issueNumber) => {
  return new Promise((resolve, reject) => {
    const issueOptions = octokit.issues.listComments.endpoint.merge({
      owner: values.userOrOrganization,
      repo: values.repo,
      issue_number: issueNumber,
    });
    octokit.paginate(issueOptions).then(
      (commentsData) => {
        resolve(commentsData);
      },
      (err) => {
        console.error(err);
        reject(err);
      }
    );
  });
};

// Given the full list of issues, returns back an array of all comments,
// each with the issue data also included.
const getFullCommentData = async (octokit, values, data) => {
  const fullComments = [];
  for (let i = 0; i < data.length; i++) {
    const issueObject = data[i];
    fullComments.push({
      issue: issueObject,
    });
    const commentsData = await getComment(octokit, values, issueObject.number);
    commentsData.forEach((comment) => {
      fullComments.push({
        issue: issueObject,
        comment: {
          user: comment.user.login,
          created_at: comment.created_at,
          updated_at: comment.updated_at,
          body: comment.body,
        },
      });
    });
  }
  return fullComments;
};

const twoPadNumber = (number) => {
  return String(number).padStart(2, "0");
};

const exportIssues = (octokit, values, includeComments = false) => {
  // Getting all the issues:
  const options = octokit.issues.listForRepo.endpoint.merge({
    owner: values.userOrOrganization,
    repo: values.repo,
    state: "all",
  });
  octokit.paginate(options).then(
    async (data) => {
      // Customized columns:
      data.forEach(async (issueObject) => {
        if (issueObject.user) {
          issueObject.user = issueObject.user.login;
        }
        if (issueObject.assignee) {
          issueObject.assignee = issueObject.assignee.login;
        }
        if (issueObject.labels) {
          issueObject.labels = issueObject.labels
            .map((labelObject) => {
              return labelObject.name;
            })
            .join(",");
        }
        if (issueObject.assignees) {
          issueObject.assignees = issueObject.assignees
            .map((assigneeObject) => {
              return assigneeObject.login;
            })
            .join(",");
        }
      });

      // Data from the API that we're removing:
      const columnsToRemove = [
        "url",
        "repository_url",
        "labels_url",
        "comments_url",
        "events_url",
        "html_url",
        "id",
        "node_id",
        // "number",
        // "title",

        // "labels",
        // "state",
        "locked",
        "assignee",
        // "assignees",
        // "milestone",
        // "comments",
        // "created_at",
        // "updated_at",
        // "closed_at",
        "author_association",
        "body",
        "pull_request",
        "milestone",
      ];
      data.forEach((issueObject) => {
        columnsToRemove.forEach((param) => {
          delete issueObject[param];
        });
      });

      let csvData = data;
      if (values.exportComments === true) {
        // If we want comments, replace the data that will get pushed into
        // the CSV with our full comments data:
        csvData = await getFullCommentData(octokit, values, data);
      }

      converter.json2csv(csvData, (err, csvString) => {
        if (err) {
          console.error("error converting!");
          process.exit(0);
        }
        // console.log("csvString:", csvString);
        const now = new Date();
        let fileName = `${now.getFullYear()}-${twoPadNumber(
          now.getMonth()
        )}-${twoPadNumber(now.getDate())}-${twoPadNumber(
          now.getHours()
        )}-${twoPadNumber(now.getMinutes())}-${twoPadNumber(
          now.getSeconds()
        )}-issues.csv`;
        if (values.exportFileName) {
          fileName = values.exportFileName;
        }
        fs.writeFile(fileName, csvString, "utf8", function (err) {
          if (err) {
            console.error("error writing csv!");
            process.exit(0);
          } else {
            console.log(`Success! check ${fileName}`);
            console.log(
              "❤ ❗ If this project has provided you value, please ⭐ star the repo to show your support: ➡ https://github.com/gavinr/github-csv-tools"
            );
            process.exit(0);
          }
        });
      });
    },
    (err) => {
      console.log("error", err);
      process.exit(0);
    }
  );
};

module.exports = { exportIssues };

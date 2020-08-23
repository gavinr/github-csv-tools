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

const writeFile = async (data, fileName = false) => {
  return new Promise((resolve, reject) => {
    converter.json2csv(data, (err, csvString) => {
      if (err) {
        reject(new Error("error converting!"));
      }

      if (!fileName) {
        const now = new Date();
        fileName = `${now.getFullYear()}-${twoPadNumber(
          now.getMonth() + 1
        )}-${twoPadNumber(now.getDate())}-${twoPadNumber(
          now.getHours()
        )}-${twoPadNumber(now.getMinutes())}-${twoPadNumber(
          now.getSeconds()
        )}-issues.csv`;
      }
      fs.writeFile(fileName, csvString, "utf8", function (err) {
        if (err) {
          reject(new Error("error converting!"));
        } else {
          resolve(fileName);
        }
      });
    });
  });
};

const twoPadNumber = (number) => {
  return String(number).padStart(2, "0");
};

const exportIssues = (octokit, values) => {
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
      const defaultColumns = values.exportAttributes || [
        "number",
        "title",
        "labels",
        "state",
        "assignees",
        "milestone",
        "comments",
        "created_at",
        "updated_at",
        "closed_at",
        "body",
      ];
      const filteredData = data.map((issueObject) => {
        const tempObject = {};
        defaultColumns.forEach((propertyName) => {
          tempObject[propertyName] = issueObject[propertyName];
        });
        return tempObject;
      });

      let csvData = filteredData;
      if (values.exportComments === true) {
        // If we want comments, replace the data that will get pushed into
        // the CSV with our full comments data:
        csvData = await getFullCommentData(octokit, values, data);
      }

      writeFile(csvData, values.exportFileName).then(
        (fileName) => {
          console.log(`Success! check ${fileName}`);
          console.log(
            "❤ ❗ If this project has provided you value, please ⭐ star the repo to show your support: ➡ https://github.com/gavinr/github-csv-tools"
          );
          process.exit(0);
        },
        (err) => {
          console.log("Error writing the file. Please try again.");
          console.error(err);
          process.exit(0);
        }
      );
    },
    (err) => {
      console.log("error", err);
      process.exit(0);
    }
  );
};

module.exports = { exportIssues };

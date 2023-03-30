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
const getFullCommentData = async (octokit, values, data, verbose = false) => {
  const fullComments = [];
  for (let i = 0; i < data.length; i++) {
    const issueObject = data[i];
    fullComments.push({
      issue: issueObject,
    });

    if (verbose === true) {
      console.log("getting comments for issue #: ", issueObject.number);
    }
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
    converter
      .json2csv(data, {
        emptyFieldValue: "",
      })
      .then(
        (csvString) => {
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
              reject(new Error("Error writing the file."));
            } else {
              resolve(fileName);
            }
          });
        },
        () => {
          reject(new Error("Invalid!"));
        }
      );
  });
};

const twoPadNumber = (number) => {
  return String(number).padStart(2, "0");
};

const defaultExportColumns = (data) => {
  return data.map((issueObject) => {
    const ret = {
      number: issueObject.number,
      title: issueObject.title,
      state: issueObject.state,
      labels: "", // will be filled in below, if it exists
      milestone: "", // will be filled in below, if it exists
      user: "", // will be filled in below, if it exists
      assignee: "", // will be filled in below, if it exists
      assignees: "", // will be filled in below, if it exists
      created_at: issueObject.created_at,
      updated_at: issueObject.updated_at,
      closed_at: issueObject.closed_at !== null ? issueObject.closed_at : "",
      body: issueObject.body,
    };
    if (issueObject.user) {
      ret.user = issueObject.user.login;
    }
    if (issueObject.labels) {
      ret.labels = issueObject.labels
        .map((labelObject) => {
          return labelObject.name;
        })
        .join(",");
    }
    if (issueObject.assignee && issueObject.assignee.login) {
      ret.assignee = issueObject.assignee.login;
    }
    if (issueObject.assignees && issueObject.assignees.length > 0) {
      ret.assignees = issueObject.assignees
        .map((assigneeObject) => {
          return assigneeObject.login;
        })
        .join(",");
    }
    if (issueObject.milestone && issueObject.milestone.title) {
      ret.milestone = issueObject.milestone.title;
    }
    return ret;
  });
};

const getDataAttribute = (issueObject, attribute) => {
  if (attribute.indexOf(".") > 0) {
    const parts = attribute.split(".");
    let currentObject = issueObject;
    parts.forEach((part) => {
      if (
        currentObject &&
        currentObject !== "" &&
        Object.prototype.hasOwnProperty.call(currentObject, part)
      ) {
        currentObject = currentObject[part];
      } else {
        currentObject = "";
      }
    });
    return currentObject;
  } else {
    return issueObject[attribute];
  }
};

const specificAttributeColumns = (data, attributes) => {
  return data.map((issueObject) => {
    const ret = {};
    attributes.forEach((attribute) => {
      ret[attribute] = getDataAttribute(issueObject, attribute);
    });
    return ret;
  });
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
      // default export - columns that are compatible to be imported into GitHub
      let filteredData = defaultExportColumns(data);
      if (values.exportAll) {
        // Just pass "data", it will flatten the JSON object we got from the API and use that (lots of data!)
        filteredData = data;
      } else if (values.exportAttributes) {
        filteredData = specificAttributeColumns(data, values.exportAttributes);
      }

      // Add on comments, if requested.
      let csvData = filteredData;
      if (values.exportComments === true) {
        if (values.exportComments === true) {
          // If we want comments, replace the data that will get pushed into
          // the CSV with our full comments data:
          if (
            csvData[0] &&
            Object.prototype.hasOwnProperty.call(csvData[0], "number")
          ) {
            csvData = await getFullCommentData(
              octokit,
              values,
              csvData,
              values.verbose
            );
          } else {
            console.error(
              "Error: Must include issue number when exporting comments."
            );
            csvData = false;
          }
        }
      }

      // write the data out to file.
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

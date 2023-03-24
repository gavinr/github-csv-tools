const createIssue = (octokit, issueInfo, organization, repository) => {
  return new Promise((resolve, reject) => {
    octokit
      .request(
        "POST /repos/" + organization + "/" + repository + "/import/issues",
        issueInfo
      )
      .then(
        (res) => {
          // console.log("res", res);
          if (res.status === 202) {
            console.log(`Imported issue: ${issueInfo.issue.title}`);
            resolve(res);
          } else {
            // error creating the issue
            reject(res);
          }
        },
        (err) => {
          reject(err);
        }
      );
  });
};

module.exports = { createIssue };

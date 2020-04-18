const createIssue = (octokit, issueInfo, state = false) => {
  return new Promise((resolve, reject) => {
    octokit.issues.create(issueInfo).then(
      (res) => {
        // console.log("res", res);
        if (res.status === 201) {
          if (state === false) {
            // Success creating the issue and we do not have to close the issue, so we're done.
            resolve(res);
          } else {
            // need to close the issue!
            const issueNumber = res.data.number;
            octokit.issues
              .update({
                owner: issueInfo.owner,
                repo: issueInfo.repo,
                issue_number: issueNumber,
                state,
              })
              .then(
                (editRes) => {
                  resolve(editRes);
                },
                (err) => {
                  reject(err);
                }
              );
          }
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

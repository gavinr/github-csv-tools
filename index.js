#!/usr/bin/env node

const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const GitHubApi = require('github');
const csv = require('csv');
const fs = require('fs');

program
    .version('0.1.0')
    .arguments('<file>')
    .option('-t, --token <token>', 'The GitHub token. https://github.com/settings/tokens')
    .action(function(file) {
        co(function*() {
            var retObject = {};
            retObject.token = yield prompt('token (get from https://github.com/settings/tokens): ');
            retObject.userOrOrganization = yield prompt('user or organization: ');
            retObject.repo = yield prompt('repo: ');
            return retObject;
        }).then(function(values) {
            var github = new GitHubApi({
                // required
                version: '3.0.0',
                // optional
                debug: true,
                protocol: 'https',
                host: 'api.github.com',
                timeout: 5000,
                headers: {
                    'user-agent': 'My-Cool-GitHub-App' // GitHub is happy with a unique user agent
                }
            });
            // OAuth2
            github.authenticate({
                type: "oauth",
                token: values.token
            });

            fs.readFile(file, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file.');
                    process.exit(1);
                }
                csv.parse(data, {
                    trim: true
                }, (err, csvRows) => {
                    if (err) throw err;
                    var cols = csvRows[0];
                    csvRows.shift();

                    // get indexes of the fields we need
                    var titleIndex = cols.indexOf('title');
                    var bodyIndex = cols.indexOf('description');
                    var labelsIndex = cols.indexOf('labels');

                    if (titleIndex === -1) {
                        console.error('Title required by GitHub, but not found in CSV.');
                        process.exit(1);
                    }
                    csvRows.forEach((row) => {
                        var sendObj = {
                            user: values.userOrOrganization,
                            repo: values.repo,
                            title: row[titleIndex]
                        };

                        // if we have a body column, pass that.
                        if (bodyIndex > -1) {
                            sendObj.body = row[bodyIndex];
                        }

                        // if we have a labels column, pass that.
                        if (labelsIndex > -1) {
                            sendObj.labels = row[labelsIndex].split(',');
                        }

                        github.issues.create(sendObj, function(err, res)
                        {
                            // debugging: console.log(JSON.stringify(res));
                            process.exit(0);
                        });
                    });
                });
            });

        }, function(err) {
            console.error('ERROR', err);
        });
    })
    .parse(process.argv);

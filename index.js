#!/usr/bin/env node
/* jshint esversion: 6 */

const program = require('commander');
const co = require('co');
const prompt = require('co-prompt');
const GitHubApi = require('github');
const csv = require('csv');
const fs = require('fs');
const Bottleneck = require('bottleneck');

program
    .version('0.1.0')
    .arguments('<file>')
    .option('--github_enterprise [github.my-company.com]', 'Your GitHub Enterprise URL.')
    .option('--token [token]', 'The GitHub token. https://github.com/settings/tokens')
    .action(function(file, options) {
        co(function*() {
            var retObject = {};
            retObject.githubUrl = options.github_enterprise || 'api.github.com';
            if (retObject.githubUrl != 'api.github.com') {
              retObject.pathPrefix = '/api/v3'
            }
            retObject.token = options.token || '';
            if (retObject.token == '') {
              retObject.token = yield prompt('token (get from https://' + retObject.githubUrl + '/settings/tokens): ');
            };
            retObject.userOrOrganization = yield prompt('user or organization: ');
            retObject.repo = yield prompt('repo: ');
            return retObject;
        }).then(function(values) {
            var github = new GitHubApi({
                // required
                version: '3.0.0',
                // optional
                pathPrefix: values.pathPrefix, 
                debug: true,
                protocol: 'https',
                host: values.githubUrl,
                timeout: 5000,
                headers: {
                    'user-agent': 'My-Cool-GitHub-App' // GitHub is happy with a unique user agent
                }
            });

            // abuse rate limits apply for concurrent content creation
            // requests by a single GitHub user.
            var limiter = new Bottleneck(5,500);
            
            // OAuth2
            github.authenticate({
                type: 'oauth',
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
                    var milestoneIndex = cols.indexOf('milestone');
                    var assigneeIndex = cols.indexOf('assignee');
                    var stateIndex = cols.indexOf('state');
                    var issueNumber = 0;

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
                        if (labelsIndex > -1 && row[labelsIndex] !== '') {
                              sendObj.labels = row[labelsIndex].split(',');
                        }

                        // if we have a milestone column, pass that.
                        if (milestoneIndex > -1 && row[milestoneIndex] !== '') {
                            sendObj.milestone = row[milestoneIndex];
                        }
                        
                        // if we have an assignee column, pass that.
                        if (assigneeIndex > -1 && row[assigneeIndex] !== '') {
                            sendObj.assignee = row[assigneeIndex];
                        }
                        
                        limiter.submit(github.issues.create,sendObj, function(err, res) {
                            // Debugging console.log(JSON.stringify(res));
                            if (err) {console.error('ERROR', err)} else {
                              console.log('===> Created issue #'  + res.number)
                              // if we have a state column and state=closed, close the issue
                              if (stateIndex > -1 && row[stateIndex] == 'closed') {
                                console.log('===> Closing issue #' + res.number);
                                var updateIssue = {
                                    user: values.userOrOrganization,
                                    repo: values.repo,
                                    number: res.number,
                                    state: row[stateIndex]
                                };
                                limiter.submit(github.issues.edit, updateIssue, function(err,res) {
                                  // Debugging console.log(JSON.stringify(res));
                                  if (err) {console.error('ERROR', err)};
                                  if (limiter.nbQueued() === 0 && limiter.nbRunning() === 0) {
                                    process.exit(0);
                                  }
                                });
                              } else {
                                if (limiter.nbQueued() === 0 && limiter.nbRunning() === 0) {
                                  process.exit(0);
                                }
                              }
                            }
                        });
                    });
                });
            });

        }, function(err) {
            console.error('ERROR', err);
        });
    })
    .parse(process.argv);

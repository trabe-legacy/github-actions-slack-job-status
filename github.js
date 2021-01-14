const github = require("@actions/github");

const org = "Trabe";

const octokit = (token) => {
  const client = github.getOctokit(token);

  async function getPR(repo, pull_number) {
    const object = await client.pulls.get({
      owner: org,
      repo: repo,
      pull_number: pull_number,
    });
    return object.data;
  }

  return {
    getPR,
  };
};

exports.octokit = octokit;

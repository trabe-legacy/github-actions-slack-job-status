const { Octokit } = require("@octokit/rest");
const { version } = require("./package.json");

const org = "Trabe";

const octokit = (token) => {
  const client = new Octokit({
    auth: token,
    userAgent: `Trabenet ${version}`,

    timeZone: "Europe/Madrid",

    baseUrl: "https://api.github.com",

    log: {
      debug: (msg) => console.debug(msg),
      info: () => {},
      warn: (warn) => console.warn(warn),
      error: (error) => console.warn(error),
    },
    request: {
      agent: undefined,
      fetch: undefined,
      timeout: 50000,
    },
  });

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

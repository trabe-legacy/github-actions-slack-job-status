const core = require("@actions/core");
const github = require("@actions/github");
const { octokit } = require("./github.js");
const fetch = require("node-fetch");

const getPullRequest = async (password, repo, pull_number) => {
  const github = octokit(password);

  const pr = await github.getPR(repo, pull_number);

  return pr;
};

(async () => {
  try {
    const status = core.getInput("job-status");
    let state =
      status === "success"
        ? "SUCCESS"
        : status === "failure"
        ? "FAILURE"
        : "CANCELLED";
    let color =
      status === "success"
        ? "#2e993e"
        : status === "failure"
        ? "#bd0f26"
        : "#d29d0c";

    let branch = github.context.ref.split("/").splice(-1)[0];
    let runDetails = `Run details: <https://github.com/${github.context.repo.owner}/${github.context.repo.repo}/actions/runs/${github.context.runId} | ${github.context.runId} run details> \n`;
    let workflow = github.context.workflow
      .split("/")
      .splice(-1)[0]
      .replace(".yml", "");
    let eventInfo = core.getInput("event");
    const jobName = github.context.job;

    let content;
    switch (github.context.eventName) {
      case "push":
        if (github.context.ref.includes("tags")) {
          content = `New tag: *${github.context.ref.split("/").splice(-1)[0]}*`;
        } else {
          content = `Push on *${branch}*. \n Commit: ${
            JSON.parse(eventInfo).head_commit.url
          }`;
        }
        break;
      case "pull_request":
        let pr = await getPullRequest(
          core.getInput("repo-token"),
          github.context.repo.repo,
          github.context.payload.pull_request.number
        );
        content = `Pull Request #${
          github.context.payload.pull_request.number
        }: ${pr.title} \n *${core.getInput("head_ref")}* -> *${core.getInput(
          "base_ref"
        )}* \n ${github.context.payload.pull_request.html_url}`;
        break;
      case "workflow_dispatch":
        content = `Manual trigger`;
        break;
      default:
        content = `On *${branch}* branch \n Commit: ${
          JSON.parse(eventInfo).head_commit.url
        }`;
    }

    const postData = JSON.stringify({
      channel: `${core.getInput("channel")}`,
      attachments: [
        {
          color: color,
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `Github Action *${workflow}*:*${jobName}* *${state}*`,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "image",
                  image_url:
                    "https://avatars0.githubusercontent.com/u/9919?s=280&v=4",
                  alt_text: "images",
                },
                {
                  type: "mrkdwn",
                  text: `<https://github.com/${github.context.repo.owner}/${github.context.repo.repo}| ${github.context.repo.owner}/${github.context.repo.repo}>`,
                },
              ],
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `${runDetails}${content}`,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "image",
                  image_url: `https://github.com/${github.context.actor}.png`,
                  alt_text: "images",
                },
                {
                  type: "mrkdwn",
                  text: `*Author:* ${github.context.actor}`,
                },
              ],
            },
          ],
        },
      ],
    });

    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      body: postData,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Length": postData.length,
        Authorization: `Bearer ${core.getInput("slack-bot-token")}`,
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`Server error ${res.status}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();

const core = require("@actions/core");
const github = require("@actions/github");
const https = require("https");

try {
  let title = core.getInput("job-status") === "success" ? "SUCCESS" : "FAILURE";
  let color = core.getInput("job-status") === "success" ? "#00FF00" : "#FF0000";

  const postData = JSON.stringify({
    channel: `${core.getInput("channel")}`,
    attachments: [
      {
        title: title + ` : [ ${github.context.repo.repo} ] : [ ${github.context.eventName} ]`,
        text: `https://github.com/${github.context.actor}/${github.context.repo.repo}/actions/runs/${github.context.runId}`,
        author_name: github.context.actor,
        color: color,
      },
    ],
  });

  let options = {
    hostname: "slack.com",
    port: 443,
    path: "/api/chat.postMessage",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": postData.length,
      Authorization: `Bearer ${core.getInput("slack-bot-token")}`,
      Accept: "application/json",
    },
  };

  let req = https.request(options, (res) => {
    res.setEncoding("utf8");
  });

  req.write(postData);
  req.end();
} catch (error) {
  core.setFailed(error.message);
}

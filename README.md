# Slack message action

This action send a message to a specific Slack channel.

## Inputs

| param            | required | purpose                                       |
|:-----------------|:---------|-----------------------------------------------|
|`job-status`      | ✓        | Specifies the final job state                 |
|`slack-bot-token` | ✓        | Bot token chosen to "write" in the channel    |
|`channel`         | ✓        | Channel where the message will be sended      |

## Usage

```
- name: Some action
  uses: trabe/github-actions-slack-job-status@v1
  id: post-to-slack
  with:
    job-status: ${{ job.status }}
    slack-bot-token: ${{ secrets.AHO_SLACK_TOKEN }}
    channel: trabenet-notifications
```

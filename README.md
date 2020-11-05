# Slack message action

This action send a message to a specific Slack channel.

## Inputs

| param            | required | purpose                                       |
|:-----------------|:---------|-----------------------------------------------|
|`repo-token`      | ✓        | Token to access Github API                    |
|`event`           | ✓        | event to notify                               |
|`head_ref`        | ✓        | Head branch                                   |
|`base_ref`        | ✓        | Base branch                                   |
|`job-status`      | ✓        | Specifies the final job state                 |
|`slack-bot-token` | ✓        | Bot token chosen to "write" in the channel    |
|`channel`         | ✓        | Channel where the message will be sended      |

## Usage

```
- name: Some action
  uses: trabe/github-actions-slack-job-status@v1
  id: post-to-slack
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
    event: ${{ toJson(github.event) }}
    head_ref: ${{ github.head_ref }}
    base_ref: ${{ github.base_ref }}
    job-status: ${{ job.status }}
    slack-bot-token: ${{ secrets.AHO_SLACK_TOKEN }}
    channel: trabenet-notifications
```

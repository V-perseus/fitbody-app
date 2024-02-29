# Branching strategy

This project uses the GitFlow branching strategy:

![][gitflow]

## Development

### Starting a feature

All development is done is a feature branch. The feature branch should be named after the Jira ticket, with a `feature/` prefix:

```shell
git checkout -b feature/FB-xxx
```

After creating your feature branch, create the merge request for it straight away. This will give the team a place to monitor progress, comment on code changes, and provide feedback during development.

Make sure that during development, but at least before submitting a PR, you are up to date with the latest changes in the `develop` branch, by regularly rebasing your feature branch:

```shell
git checkout develop && git pull && git checkout - && git rebase develop
```
This will make merging your changes into the `develop` branch easier and more predictable. Gitlab is configured to _only_ allow merge requests that can be fast-forwarded, so this is an important step.

[gitflow]: ./assets/gitflow-diagram.png

### Working on a feature

[TODO] Use conventional commits standard for commits

### Finishing a feature

When a feature is finished, create a merge request for it. Use the Asana issue title, in the following format: `FB-xxx [issue title]`. Put a link to the issue in the description. If you use the GitFlow tooling, do not use the `finish` command, because this will merge your changes without a merge request!

## Release management

[TODO]


More information: https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow
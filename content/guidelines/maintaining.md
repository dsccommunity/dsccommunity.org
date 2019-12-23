---
title: "Maintaining"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 3
---

### Breaking Changes

See [Breaking Changes](/guidelines/contributing#breaking-changes)

### Prerelease

Not written.

### Release

Not written.

### Labels

Labels are being used in the issue and pull request workflows to show the
current state.

These are the labels currently used by the resource modules in DSC Community
Kit. Some of these labels are meant to be used with future automation.

>The script
>[DscResourceKit-Labels](https://gist.github.com/johlju/f83f99787029a6b5d65cfd6844cf9449)
>that is provided by the community can be used to update the labels in a
>repository.

Label | Description | Color Hex | Area of usage
--- | --- | --- | --- |
abandoned | The pull request has been abandoned. | #ffffff White | PR
blocking release | The issue or pull request is blocking the next release. Higher priority than label 'High priority'. | #800000 Dark red | Issue, PR
breaking change | When used on an issue, the issue has been found to be a breaking change. | #ff9900 Orange | Issue, PR
bug | The issue is a bug. | #ee0701 Red | Issue
by design | The issue is describing an expect behavior.  | #ffffff White | Issue
closed by author | The issue or pull request was closed by the author. | #ffffff White | Issue, PR
discussion | The issue is a discussion. | #993399 Purple | Issue
documentation | The issue is related to documentation only. | #c5def5 Lighter blue | Issue
duplicate | The issue or PR is the duplicate of another. | #ffffff White | Issue, PR
good first issue | The issue should be easier to fix and can be taken up by a beginner to learn to contribute on GitHub | #5319e7 Purple | Issue
enhancement | The issue is an enhancement request. | #84b6eb Light blue | Issue
external | The issue cannot be resolved within the DSC Resource Kit. | #ffffff White | Issue
help wanted | The issue is up for grabs for anyone in the community. | #128A0C Green | Issue
high priority | The issue or PR should be resolved first. It is of less priority than the label 'Blocking Release'. | #ffcc99 Light orange | Issue, PR
in progress | The issue is being actively worked on by someone. | #99ffcc Turquoise | Issue
needs investigation | The issue needs to be investigated by the maintainers or/and the community. | #ffff99 Yellow | Issue
needs more information | The issue needs more information from the author or the community. | #ffff99 Yellow | Issue
needs review | The pull request needs a code review. | #99ff33 Lime green | PR
new module submission | A request that the community evaluate a resource module for submission into the DSC Resource Kit. | #207de5 Dark blue | Issue
not fixed | The issue was closed without being fixed. | #ffffff White | Issue
on hold | The issue or pull request has been put on hold by a maintainer. | #1e1e7b Dark blue | Issue, PR
question | The issue is a question. | #cc317c Dark pink | Issue
ready for merge | The pull request was approved by the community and is ready to be merged by a maintainer. | #215e82 Dark cyan | PR
resource proposal | The issue is proposing a new resource in the resource module. | #fbca04 Dark yellow | Issue
stale | The issue was marked as stale because there has not been activity from the community. | #cccccc Grey | Issues
tests | The issue or pull request is about tests only. | #c5def5 Lighter blue | Issue, PR
updated by author | The author last updated the pull request. | #e3f1dA Lighter Green | PR
waiting for author response | The pull request is waiting for the author to respond to comments in the pull request. | #ffff99 Yellow | PR
waiting for CLA pass | The contributor has not yet signed the CLA so that pull request check is not successful. | #ee0701 Red | PR
waiting for code fix | A review left open comments, and the pull request is waiting for changes to be pushed by the author. | #ffff99 Yellow | PR
resolved in dev | A fix has been merged into the dev-branch but issue is still open and awaits next release. | #215e82 Dark cyan | Issue

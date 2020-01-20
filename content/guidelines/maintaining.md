---
title: "Maintaining"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 3
---

### Security

To be maintainer you must have 2FA enabled on accounts that give you
access to DSC Community resources, for example your GitHub account and
the account that access DSC Community Azure DevOps organization.

### Breaking Changes

See [Breaking Changes](/guidelines/contributing#breaking-changes)

### Review

Not yet written.

### Merging code

Only merge code that passes status checks, have been reviewed, and where
all the review comments have be resolved and approved.

As a maintainer you are allowed to review and merge your own code, but
then only after 24 hours so the community has a chance to comment on
the changes. Any pull request that fixes issues in CI pipeline or unblocks 
release can be merged faster to unblock other pull requests.

#### Skip CI on merge

It is possible to skip running the CI pipeline when merging a patch change,
e.g. updating the CHANGELOG.md after a release. When merging the pull
request just enter `[skip ci]` preferably in the commit description, but
also works in the commit message.

Read more in [Skipping CI for individual commits](https://docs.microsoft.com/en-us/azure/devops/pipelines/build/triggers?view=azure-devops&tabs=yaml#skipping-ci-for-individual-commits).

>Do not add `[skip ci]` to a PR title, then the status checks will not
>run.

### Prerelease

For each merge to the branch `master` there will be a prerelease
automatically released (continuous delivery).

The version is automatically calculated in the CI pipeline based on the
commit history since the previous release. The calculation is done by
[GitVersion](https://gitversion.net/docs/) and each repository has a file
`GitVersion.yml` that controls how this calculation is performed.

The CI pipeline will create a tag in the format vX.Y.Z-previewXXXX, e.g
`v5.0.0-preview0001`, and the prerelease to the PowerShell Gallery will have
the format X.Y.Z-previewXXXX, e.g. `5.0.0-preview0001`. Any consequent
merges to master will make a new preview release which will be named for
example `5.0.0-preview0002` and so on.

>**NOTE:** There are an issue with module ModuleBuilder v1.0.0 and higher
>when using semantic version preview strings that uses a dash, e.g. `fix0008-9`.
>The string is compliant with SemVer 2.0 but there is a  bug in
>`Publish-Module` that prevents the module to be released.

### Release

Once the next full version should be deployed, do these steps to push
a new release version tag. Important to have the correct format `vX.Y.Z`,
e.g. `v1.14.1`.

Assuming 'origin' is the remote name pointing the upstream repository, if
not then change appropriately.

```bash
# Make sure to get the latest history, use rebase to retain the linear
# commit history.
git checkout master
git fetch origin master
git rebase origin/master

git fetch origin --tags # Fetch all tags from upstream master branch
git describe --tags # To see the the latest tag, e.g. vX.Y.Z-preview0002
git tag vX.Y.Z # Creates the new version tag locally.
git push origin --tags # Push the new tag that was created locally
```

*Avoid using `git pull --tags` as it also will merge (not rebase) any*
*changes from upstream (unless already rebased). Using `git pull` will*
*not retain the linear commit history.*

>**NOTE:** You could also tag a specific commit if not all commits should
>be released.

#### Update the list of resource modules

After a new resource module have been released or deprecated, please update
the list of resource modules to include it on the site https://dsccommunity.org.

See the section [Resource modules](https://github.com/dsccommunity/dsccommunity.org#resource-modules)
how to update the list of resource modules.

### Running the task `pack` locally

If the task `pack´ is run locally, e.g. ´.\build.ps1 -Task pack`, then
`nuget.exe` must be updated so that it is not outdated. If it is outdated
you can run into the issue [PowerShell/PowerShellGet#295](https://github.com/PowerShell/PowerShellGet/issues/295).

To update run the following:

```bash
# Non-admin
Invoke-WebRequest -Uri https://aka.ms/psget-nugetexe -OutFile "$env:LOCALAPPDATA\Microsoft\Windows\PowerShell\PowerShellGet\NuGet.exe"

# Admin
Invoke-WebRequest -Uri https://aka.ms/psget-nugetexe -OutFile "$env:ProgramData\Microsoft\Windows\PowerShell\PowerShellGet\NuGet.exe"
```

### Labels

Labels are used in the issue and pull request workflows to show the
current state.

These are the labels currently used by the resource modules in DSC Community. 
Some of these labels are meant to be used with future automation.

>The script
>[DscResourceKit-Labels](https://gist.github.com/johlju/f83f99787029a6b5d65cfd6844cf9449)
>that is provided by the community can be used to update the labels in a
>repository.

These are also set as the [default organization labels](https://github.com/organizations/dsccommunity/settings/labels)
so that new repositories that are created they will automatically get these labels.

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
not fixed | The issue was closed without being fixed. | #ffffff White | Issue
on hold | The issue or pull request has been put on hold by a maintainer. | #1e1e7b Dark blue | Issue, PR
question | The issue is a question. | #cc317c Dark pink | Issue
ready for merge | The pull request was approved by the community and is ready to be merged by a maintainer. | #215e82 Dark cyan | PR
resolved in dev | A fix has been merged into the dev-branch but the issue is still open and awaits next release. | #215e82 Dark cyan | Issue
resource proposal | The issue is proposing a new resource in the resource module. | #fbca04 Dark yellow | Issue
stale | The issue was marked as stale because there has not been activity from the community. | #cccccc Grey | Issues
tests | The issue or pull request is about tests only. | #c5def5 Lighter blue | Issue, PR
updated by author | The author last updated the pull request. | #e3f1dA Lighter Green | PR
waiting for author response | The pull request is waiting for the author to respond to comments in the pull request. | #ffff99 Yellow | PR
waiting for code fix | A review left open comments, and the pull request is waiting for changes to be pushed by the author. | #ffff99 Yellow | PR
Linux | This targets Linux platform-family. | #221A3e Heavy Blue Dark | Issue, PR
macOS | This targets macOS platform-family. | #221A3e Heavy Blue Dark | Issue, PR
Windows | This targets Windows platform-family. | #221A3e Heavy Blue Dark | Issue, PR

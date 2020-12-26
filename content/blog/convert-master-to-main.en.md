---
title: "Steps to rename master branch to main for a DSC Community resource"
date: 2020-12-260T12:52:00+01:00
type: "post"
draft: false
author: dscottraynsford
---

You are welcome to share any comments or issues you having around this
process in the [Discord or Slack #DSC channel](https://dsccommunity.org/community/contact/).

On the 1st of October 2020, [GitHub announced](https://github.blog/changelog/2020-10-01-the-default-branch-for-newly-created-repositories-is-now-main/)
that the default branch name for new repositories was changing from `master`
to `main`.

This post describes the process required to rename `master` branch to `main`
for a DSC community resource module. It is up to individual maintainers if they
wish to rename `master` to `main` on their repositories

## Prerequisites

It is assumed that the DSC module repository is already using
the DSC module Plaster template in the [Sampler](https://github.com/gaelcolas/Sampler)
project, or has been converted to use the new CI pipeline using the steps
mentioned in [Steps to convert a module for continuous delivery](/blog/convert-a-module-for-continuous-delivery/).

This blog post focuses on resources hosted in the [dsccommunity.org](https://github.com/dsccommunity),
GitHub organization, so many of the steps will refer to this location. However,
this process may still work with resources that are not located in this GitHub
organization.

## Requirements

To perform the rename of a `master` branch to `main` for a DSC community
resource the following are required:

1. GitHub `Admin` access to the repository in [dsccommunity.org](https://github.com/dsccommunity).
1. Azure DevOps `administrator` access to the [DSC Community CI pipeline](https://dev.azure.com/dsccommunity/)
   for the repository being converted.
1. You have a fork of the upstream DSC Community repository in your
   GitHub account.
1. You have cloned your fork of the upstream DSC Community repository to
   a local folder on your machine.
1. **Your local clone should have two remotes:**
   - `origin` refers to the upstream DSC Community repository.
   - `my` refers to _your fork_ of the DSC community repository.

## Summary

The following is a summary of the steps that needs to occur to rename master
to main:

1. Update _your fork_ of the repository from the upstream origin.
1. Rename the `master` branch to `main` in _your fork_.
1. Update the GitHub Default branch in _your fork_ to `main`.
1. Optional: Delete the old `master` branch in _your fork_.
1. Update the pipeline files in the `main` branch of _your fork_.
1. Optional: If you have an Azure DevOps pipeline connected to _your fork_
   update it to refer to `main`.
1. Optional: Validate that the pipeline works correctly.
1. Submit a pull request from `main` in _your fork_ to `master` in the _upstream
   DSC Community repository_.
1. Merge the pull request to `master`, **even though the CI will fail**.
1. Rename the `master` branch to `main` in the _upstream DSC Community
   repository_.
1. Update the GitHub Default branch in the _upstream DSC Community
   repository_ to `main`.
1. Update the Azure DevOps pipeline connected to _upstream DSC Community
   repository_ to `main`.
1. Validate that the pipeline works correctly.
1. Delete the GitHub `master` branch policy in the _upstream DSC Community
   repository_.
1. Create the GitHub `main` branch policy in the _upstream DSC Community
   repository_.
1. Optional: Delete the old `master` branch in the _upstream DSC Community
   repository_.

## Steps

### Step 1 - Update your fork of the repository from the upstream origin

Update your fork from the upstream origin repository master branch by running
the following commands:

```powershell
# Move to the local repo
cd c:\source\{repositoryFolder}

# Make sure you have the remote names to upstream and fork.
# origin should refer to the upstream DSC Community repository.
# my should refer to the
git remote -v

# Get latest changes so we get all commits that the tags uses
git checkout master
git fetch origin master # origin is the remote pointing to upstream DSC Community repository.
git rebase origin/master
git push my master --force # my is the remote pointing to fork
```

### Step 2 - Rename the master branch to main in your fork

Rename the master branch to main in your fork by running the following
commands:

```powershell
git branch -m master main
git push -u my main
```

### Step 3 - Update the GitHub Default branch in your fork to main

In your web browser:

1. Open [GitHub](https://github.com/).
1. Navigate to _your fork_ of the DSC repository.
1. Select the `Settings` tab.
1. Select `Branches`.
1. Change Default Branch to `main`.
1. Click `Update`.
1. Confirm the update to the default branch.

### Step 4 - Optional: Delete the old master branch in your fork

This step is optional and will delete your old `master` branch. You
can leave your old `master` branch if you wish.

You can now delete the old master branch by running the following command:

```powershell
git push my :master
```

### Step 5 - Update the pipeline files in the main branch of your fork

> Note: If you have an Azure DevOps pipeline linked to your fork of the
> repository then you should be able to validate these changes work.

At this point in the process the Azure DevOps pipeline will start
failing. To fix this, some of the pipeline files in the main branch will
need to be updated. To update these files:

#### Update: CHANGELOG.md

Add a new entry to the `### Changed` section under `## [Unreleased]` in
the CHANGELOG.md:

```txt
- Renamed `master` branch to `main` - Fixes [Issue #82](https://github.com/dsccommunity/{repository}/issues/{issue number}).
```

#### Update: GitVersion.yml

Replace the `branches` section in the `GitVersion.yml` file with:

```yml
branches:
  master:
    tag: preview
    regex: ^master$|^main$
  pull-request:
    tag: PR
  feature:
    tag: useBranchName
    increment: Minor
    regex: f(eature(s)?)?[\/-]
    source-branches: ['main']
  hotfix:
    tag: fix
    increment: Patch
    regex: (hot)?fix(es)?[\/-]
    source-branches: ['main']
```

#### Update: README.md

Replace the `master` with `main` in the build badges:

```txt
[![Build Status](https://dev.azure.com/dsccommunity/WsManDsc/_apis/build/status/dsccommunity.WSManDsc?branchName=main)](https://dev.azure.com/dsccommunity/WsManDsc/_build/latest?definitionId=6&branchName=main)
![Code Coverage](https://img.shields.io/azure-devops/coverage/dsccommunity/WSManDsc/6/main)
[![Azure DevOps tests](https://img.shields.io/azure-devops/tests/dsccommunity/WSManDsc/6/main)](https://dsccommunity.visualstudio.com/WSManDsc/_test/analytics?definitionId=6&contextType=build)

```

#### Update: azure-pipelines.yml

1. Update the `trigger\branches\include` section to be `main`

```yml
trigger:
  branches:
    include:
    - main
```

1. Add the following environment variables to the `env` section of the `publish_release`
   and the `send_changelog_PR` tasks of the `Deploy` stage.

```yml
ReleaseBranch: main
MainGitBranch: main
```

For example, this is what the `publish_release` and `send_changelog_PR` tasks
should look like:

```yml
          - task: PowerShell@2
            name: publish_release
            displayName: 'Publish Release'
            inputs:
              filePath: './build.ps1'
              arguments: '-tasks publish'
              pwsh: true
            env:
              GitHubToken: $(GitHubToken)
              GalleryApiToken: $(GalleryApiToken)
              ReleaseBranch: main
              MainGitBranch: main

          - task: PowerShell@2
            name: send_changelog_PR
            displayName: 'Send CHANGELOG PR'
            inputs:
              filePath: './build.ps1'
              arguments: '-tasks Create_ChangeLog_GitHub_PR'
              pwsh: true
            env:
              GitHubToken: $(GitHubToken)
              ReleaseBranch: main
              MainGitBranch: main
```

#### Update: build.yml

In the `build.yml` file in the `DscTest` section add the line:

```yml
MainGitBranch: main
```

#### Update: source/*.psd1

Update the `master` to `main` in the license URI in the module manifest:

```txt
LicenseUri   = 'https://github.com/dsccommunity/WSManDsc/blob/main/LICENSE'
```

#### Update: source/wikiSource/Home.md

If the module is configured with automated generation of wiki documentation then
update any references for `master` to `main`.

#### Commit and push the updated pipeline files

Run the following git commands to commit your changes:

```powershell
git add .
git commit -m 'Updated pipeline files to support change of master to main'
```

### Step 6 - Update the pipeline files in the main branch of your fork


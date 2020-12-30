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
1. Submit a pull request from `main` in _your fork_ to `master` in the
   _upstream DSC Community repository_.
1. Merge the pull request to `master`, **even though the CI will fail**.
1. Create the new `main` branch in the _upstream DSC Community_ repository.
1. Re-target any open pull requests to `main`.
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
# 'origin' should refer to the upstream DSC Community repository.
# 'my' should refer to your fork of the repository.
git remote -v

# Get latest changes so we get all commits and tags
git checkout master
git fetch origin master # origin is the remote pointing to upstream DSC Community repository.
git rebase origin/master
git fetch origin --tags # get any (new) tags from origin/master
git push my master --force # my is the remote pointing to fork
git push my --tags # push any (new) tags to my/master
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
> repository then you should be able to validate that these changes work.

At this point in the process the Azure DevOps pipeline will start
failing. To fix this, some of the pipeline files in the main branch will
need to be updated. To update these files:

#### Update: CHANGELOG.md

Add a new entry to the `### Changed` section under `## [Unreleased]` in
the CHANGELOG.md:

```txt
- Renamed `master` branch to `main` - Fixes [Issue #{issue number}](https://github.com/dsccommunity/{repository}/issues/{issue number}).
```

#### Update: GitVersion.yml

Replace the `branches` section in the `GitVersion.yml` file with:

```yml
branches:
  master:
    tag: preview
    regex: ^main$
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

Replace the `master` with `main` in the build badges and anywhere else
that refers to the `master` branch in this repository.

```txt
[![Build Status](https://dev.azure.com/dsccommunity/WsManDsc/_apis/build/status/dsccommunity.WSManDsc?branchName=main)](https://dev.azure.com/dsccommunity/WsManDsc/_build/latest?definitionId=6&branchName=main)
![Code Coverage](https://img.shields.io/azure-devops/coverage/dsccommunity/WSManDsc/6/main)
[![Azure DevOps tests](https://img.shields.io/azure-devops/tests/dsccommunity/WSManDsc/6/main)](https://dsccommunity.visualstudio.com/WSManDsc/_test/analytics?definitionId=6&contextType=build)

```

> Note: Care should be taken to not change URLs that refer to files
> in the master branch of other respositories that have not been updated
> to use `main`.

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

> Important: It is possible that there will be additional tasks that require
> these values to be set. If that is the case then it is also likely that
> adjustments will also need to be made to [Sampler](https://github.com/gaelcolas/Sampler).
> Please [raise an issue over in the Sampler repository](https://github.com/gaelcolas/Sampler/issues)
> if you have a Sampler task that needs to be notified of the change to the
> name of `master` branch.

1. Update the `deploy` stage `condition` by changing the
   `refs/heads/master` to `refs/heads/main`:

```yml
  - stage: Deploy
    dependsOn: Test
    condition: |
      and(
        succeeded(),
        or(
          eq(variables['Build.SourceBranch'], 'refs/heads/main'),
          startsWith(variables['Build.SourceBranch'], 'refs/tags/')
        ),
        contains(variables['System.TeamFoundationCollectionUri'], 'dsccommunity')
      )
```

#### Update: build.yml

In the `build.yml` file in the `DscTest` section add the line:

```yml
MainGitBranch: main
```

#### Update: source/\*.psd1

Update the `master` to `main` in the license URI in the module manifest:

```txt
LicenseUri   = 'https://github.com/dsccommunity/WSManDsc/blob/main/LICENSE'
```

#### Update (Optional): source/Examples/Resources/**/*.ps1

If the module is configured with automated generation of wiki documentation then
update any references for `master` to `main` in the examples:

```txt
.LICENSEURI https://github.com/dsccommunity/WSManDsc/blob/main/LICENSE
```

#### Update (Optional): source/wikiSource/Home.md

If the module is configured with automated generation of wiki documentation then
update any references for `master` to `main`.

#### Update (Optional): codecov.yml

If the module is configured to send code coverage results to [codecov.io](https://codecov.io)
then you should also update the `codecov` `branch:` in `codecov.yml` file to
`main`:

```yml
codecov:
  # main should be the baseline for reporting
  branch: main
```

#### Commit and push the updated pipeline files

Run the following git commands to commit your changes:

```powershell
git add .
git commit -m 'Updated pipeline files to support change of master to main'
git push my main
```

### Step 6 - Optional: Update Azure DevOps pipeline connected to your fork

If you have an Azure DevOps pipeline connected to _your fork_ you
should update the 'Default branch for manual and scheduled builds' setting
from `master` to `main`:

1. Open Azure DevOps and navigate to the Pipeline.
   <img src="../../images/convert-master-to-main/azure-devops-pipeline.png" alt="Azure DevOps Pipeline" style="width:425px;" />
1. Click `Edit` to edit the pipeline.
1. Select `Triggers` from the elipsis menu.
   <img src="../../images/convert-master-to-main/azure-devops-pipeline-edit-triggers.png" alt="Azure DevOps Pipeline Edit Triggers" style="width:425px;" />
1. Select the `YAML` tab.
1. Click `Get Sources`.
1. Change the `Default branch for manual and scheduled builds` to `main`.
   <img src="../../images/convert-master-to-main/azure-devops-pipeline-set-default-branch.png" alt="Azure DevOps Pipeline set Default branch for manual and scheduled builds" style="width:425px;" />
1. Click the `Save & Queue` button.

### Step 7 - Optional: Validate that the pipeline works correctly

If you have an Azure DevOps pipeline connected to _your fork_ the pipeline
should have automatically run in Step 5 and/or step 6. However, if it did not
then you can run the pipeline manually to validate that it works correctly.

<img src="../../images/convert-master-to-main/azure-devops-pipeline-run-success.png" alt="Azure DevOps Pipeline run pipeline success" style="width:425px;" />

### Step 8 - Submit a pull request from main in your fork to master in the upstream DSC Community repository

The updated pipeline changes need to be submitted to the upstream
DSC Community repository `master` branch via a Pull Request.

In your web browser:

1. Open [GitHub](https://github.com/).
1. Navigate to _your fork_ of the DSC repository.
1. Select the `Pull requests` tab.
1. Click `New pull request`.
1. Ensure the `base repository` is set to the _upstream DSC Community_
   repository `master` branch.
1. Ensure the `head repository` is set to _your fork_ repository `main`
   branch.
   <img src="../../images/convert-master-to-main/github-create-pull-request.png" alt="GitHub create pull request" style="width:425px;" />
1. Click `Create pull request`.
1. Complete the details of the pull request.
1. Click `Create pull request`.

### Step 9 - Merge the pull request to master

The pull request should be reviewed by a maintainer or other community
member.

<img src="../../images/convert-master-to-main/github-merge-pull-request.png" alt="GitHub merge pull request" style="width:425px;" />

> Important: The Azure DevOps CI pipeline will fail for this pull request.
> The failures will usually occur in the 'Run HQRM Test' task in the 'HQRM'
> stage. This is expected behavior and is unavoidable at this point. This
> pull request will need to be merged in the next step regardless of the
> build failures which will be fixed in subsequent steps.

A maintainer with admin privileges will need to merge this pull request:

<img src="../../images/convert-master-to-main/github-merge-pull-request-use-admin-privs.png" alt="GitHub merge pull request using administrator privileges" style="width:425px;" />

> Note: Using a merge commit or rebase merge are both acceptable. A
> squash merge is not required.

### Step 10 - Create the new main branch in the upstream DSC Community repository

> Important: This step can only be performed by a maintainer with admin
> privileges on the _upstream DSC Community_ repository.

Create a new `main` branch from `master` in the _upstream DSC Community_
repository by running the following commands:

```powershell
# Must be in this local branch
git checkout main

# Get and rebase changes from fork
git fetch my/main
git rebase my/main

# Get and rebase changes from upstream
git fetch origin/master
git rebase origin/master

# Overwrite fork with all commits from upstream
git push my main --force

# Push your fork main branch as main branch
git push -u origin main
```

### Step 11 - Re-target any open pull requests to main

If the _upstream DSC Community_ repository has any open pull requests
that target `master`, these will need to be updated to `main`:

<img src="../../images/convert-master-to-main/github-update-pull-request-target.png" alt="GitHub re-target pull request" style="width:425px;" />

#### Step 12 - Update the GitHub Default branch in upstream DSC Community repository to main

In your web browser:

1. Open [GitHub](https://github.com/).
1. Navigate to _upstream DSC Community_ repository.
1. Select the `Settings` tab.
1. Select `Branches`.
1. Change Default Branch to `main`.
1. Click `Update`.
1. Confirm the update to the default branch.

<img src="../../images/convert-master-to-main/github-update-default-branch.png" alt="GitHub update default branch" style="width:425px;" />

### Step 13 - Update the Azure DevOps pipeline connected to upstream DSC Community repository to main

Update the 'Default branch for manual and scheduled builds' setting
from `master` to `main`:

1. Open Azure DevOps and navigate to the Pipeline.
   <img src="../../images/convert-master-to-main/azure-devops-pipeline-community.png" alt="Azure DevOps Pipeline" style="width:425px;" />
1. Click `Edit` to edit the pipeline.
1. Select `Triggers` from the elipsis menu.
   <img src="../../images/convert-master-to-main/azure-devops-pipeline-edit-triggers.png" alt="Azure DevOps Pipeline Edit Triggers" style="width:425px;" />
1. Select the `YAML` tab.
1. Click `Get Sources`.
1. Change the `Default branch for manual and scheduled builds` to `main`.
   <img src="../../images/convert-master-to-main/azure-devops-pipeline-set-default-branch-community.png" alt="Azure DevOps Pipeline set Default branch for manual and scheduled builds" style="width:425px;" />
1. Click the `Save & Queue` button.

### Step 14 - Validate that the pipeline works correctly

The Azure DevOps pipeline should have been run by Step 13. Validate that
it has completed successfully:

<img src="../../images/convert-master-to-main/azure-devops-pipeline-run-success.png" alt="Azure DevOps Pipeline run pipeline success" style="width:425px;" />

### Step 15 - Delete the GitHub master branch policy in the upstream DSC Community repository

In your web browser:

1. Open [GitHub](https://github.com/).
1. Navigate to _upstream DSC Community_ repository.
1. Select the `Settings` tab.
1. Select `Branches`.
1. Click the `Delete` button next to the `master` branch policy

   <img src="../../images/convert-master-to-main/github-delete-master-branch-policy.png" alt="GitHub delete master branch policy" style="width:425px;" />

1. Enter your GitHub password, if required.

### Step 16 - Create the GitHub main branch policy in the upstream DSC Community repository

In your web browser:

1. Open [GitHub](https://github.com/).
1. Navigate to _upstream DSC Community_ repository.
1. Select the `Settings` tab.
1. Select `Branches`.
1. Click the `Add rule` button.
1. Enter 'main' in the `Branch name pattern` field.
1. Tick `Require pull request reviews before merging`.
1. Tick `Require status checks to pass before merging`.
1. Tick `Require branches to be up to date before merging`.
1. Tick the status checks that are required to pass.
1. Tick `Restrict who can push to matching branches`.

   <img src="../../images/convert-master-to-main/github-create-branch-policy.png" alt="GitHub create main branch policy" style="width:425px;" />

1. Click the `Create` button.

### Step 17 - Optional: Delete the old master branch in the upstream DSC Community repository

Delete the old `master` branch from the _upstream DSC community_ repository by
running:

```powershell
git push origin :master
```

## Rename Complete

Once all steps are complete then the repository `master` branch has been
successfully renamed to `main`.

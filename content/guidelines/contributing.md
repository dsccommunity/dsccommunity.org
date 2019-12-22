---
title: "Contributing"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 2
---

Thank you for your interest of contributing to the DSC Community.

There are several ways you can contribute. You can submit an issue to
report a bug or to request an improvement. You can take part in an
discussions around an issue or pull request. You may review
pull requests, or send in a pull request yourself to improve the DSC
modules by adding more DSC resource, fixing issues in existing DSC
resources, improve the CI pipeline, or updating documentation around
the DSC modules.

If want to contribute my making changes to code or documentation but
are new to contributing and GitHub, then please read the
[Getting Started as a Contributor](/guidelines/getting-started/) guideline.

You may also [join the conversation](/community/contact/) and ask for
help or share your knowledge in direct communication with others.

If you need any help along the way, don't be afraid to ask. We are here
for each other.

Her you can read more around the different contributions you can make:

- [Submit an issue](#submit-an-issue)
- [Discuss an issue or pull request (PR)](#discuss-an-issue-or-pull-request-pr)
- [Create or update a pull request (PR)](#create-or-update-a-pull-request-pr)
- [Review a pull request (PR)](#review-a-pull-request-pr)
- [Resolve an issue](#resolve-an-issue)
- [Write documentation](#write-documentation)
- [Understand the coding workflow](#understand-the-coding-workflow)
- [Resolve merge conflicts](#resolve-merge-conflicts)
- [How to continue working on a pull request (PR) when an author (contributor) is unable to complete it](#how-to-continue-working-on-a-pull-request-pr-when-an-author-contributor-is-unable-to-complete-it)

### Submit an issue

Submitting an issue to a repository the DSC Community is easy! An issue
can for example be a problem, a solution, or a question.

1. Find the correct repository to submit your issue to. See and search a
   [list of  all repositories in DSC Community](https://github.com/dsccommunity).
1. Search open issues to make sure the issue you having have not been
   submitted by someone else.
1. Open a new issue. *If the repository have different issue templates*
   *choose the template that best suits the issue you are experiencing.*
1. Fill in a short but descriptive issue title.
1. Fill in the issue description. *If you choose a issue template, follow*
   *the guidance in the template text.*
1. Submit the issue.

You may also [join the conversation](/community/contact/) and ask for
help in direct communication with others.

#### Open a new issue

Let us pretend we have a problem with the ComputerManagementDsc
module that we need to report to the community.

##### Find the repository

Browse to the [list of  all repositories in DSC Community](https://github.com/dsccommunity)
and in the search field type 'comp' and the GitHub should automatically
filter the results.

<img src="../../images/contributing/github_search_repository.png" alt="GitHub Search Repository" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

Click on the repository name _**ComputerManagementDsc**_ to open up the repository.

##### Search existing issues

Search the issues to see that there are no issue already submitted for the
problem you are having. If someone has already opened a similar issue, please
leave a comment or add a GitHub reaction on the issue description to express
your interest. You can also offer help and use the issue to coordinate your
efforts in fixing the issue.

If you cannot find an issue that matches the problem you are having, then
you are welcome to submit a new issue.

##### Create a new issue

Click on the *Issue* tab.

<img src="../../images/contributing/github_issues_tab.png" alt="GitHub Issues Tab" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:425px;" />

Click on the *New issue* button. At this point you must sign in to GitHub.

<img src="../../images/contributing/github_new_issue_button.png" alt="GitHub New Issue Button" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

At this point we are shown the issue templates if the repository have
implemented those, otherwise this will step will be skipped.

But since we are pretending to have a problem, choose the template
*Problem with a resource* since it best matches the issue we want to
submit.

<img src="../../images/contributing/github_choose_issue_template.png" alt="GitHub Choose Issue Template" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

Please read the template text in the description field. The template
text is there to help you provide as much information as possible so it
is easier for the community to help you with your issue.

Write a short but descriptive issue title. The issue title should be a
brief summary of your issue in one sentence. While you write you will get
suggestions on previous issues that can be related to that issue. *Please*
*verify so that no issue that are suggest covers the issue you are having.*

If you would like to submit an issue that would include a breaking change,
please also refer to our [Breaking Changes](#breaking-changes) section below.

<img src="../../images/contributing/github_issue_title.png" alt="GitHub Write Issue Title" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

The issue description should contain a **detailed** report of the issue
you are submitting. If you are submitting a bug, please include any error
messages or stack traces caused by the problem.

Please reference any related issues or pull requests by a pound sign followed by
the issue or pull request number (e.g. #11, #72). GitHub will automatically link
the number to the corresponding issue or pull request. You can also link to pull
requests and issues in other repositories by including the repository owner and
name before the issue number.

Please also tag any GitHub users you would like to notice this issue. You can
tag someone on GitHub with the `@` symbol followed by their GitHub account name,
e.g. `@johlju`.

Fill in each section in the template as necessary. The more details
you provide, the easier will it be for the community to help you with your
issue.

*This example is not providing much context, but for the sake of length*
*it has been deliberate shortened.*

```plaintext
    #### Details of the scenario you tried and the problem that is occurring
    It cannot find the power plan when I...
    The issue #11, #72, and PowerShell/xPSDesiredStateConfiguration#160
    is related

    #### Verbose logs showing the problem
    ```
    VERBOSE: [APPVYR-WIN]: LCM:  [ Start  Set      ]
    VERBOSE: [APPVYR-WIN]: LCM:  [ Start  Resource ]  [[PowerPlan]SetPowerPlan]
    ...
    Verbose log showing the actual error
    ...
    VERBOSE: [APPVYR-WIN]: LCM:  [ End    Resource ]  [[PowerPlan]SetPowerPlan]
    VERBOSE: [APPVYR-WIN]: LCM:  [ End    Set      ]
    ```
    #### Suggested solution to the issue
    None.

    #### The DSC configuration that is used to reproduce the issue (as detailed as possible)
    ```powershell
    PowerPlan SetPlanHighPerformance
    {
        IsSingleInstance = 'Yes'
        Name             = 'MyPowerPlan'
    }
    ```

    #### The operating system the target node is running
    ```
    OsName               : Microsoft Windows Server 2019 Datacenter
    ```

    #### Version and build of PowerShell the target node is running
    ```
    Name                           Value
    ----                           -----
    PSVersion                      5.1.17763.592
    ```

    #### Version of the DSC module that was used ('dev' if using current dev branch)
    6.4.0
```

### Breaking Changes

Breaking changes should first be proposed by opening an issue on the resource and
outlining the needed work. This allows the community to discuss the change before
the work is done and scopes the breaking changes to just the needed areas.

An issue that is deemed to be a breaking changed should be label `breaking change`
and the issue title should be prefixed with `BREAKING CHANGE:`.

Breaking changes may include:

- Adding a new mandatory parameter
- Changing an existing parameter
- Removing an existing parameter
- Fundamentally changing an existing functionality of a resource

A pull request (PR) that introduces a breaking change should prefix at
least one entry in the change log with `BREAKING CHANGE:`. The entry
should clearly explain what the breaking change is and how it will affect
users.

### Discuss an issue or pull request (PR)

### Create or update a pull request (PR)

Now you should be able to see your branch in your fork on GitHub

![GitHub-Select-Branch.png](Images/GitHub-Select-Branch.png)

You can create a new pull request on the same page

![GitHub-Create-PR.png](Images/GitHub-Create-PR.png)

Follow instructions from
[Submit a Pull Request](CONTRIBUTING.md#submit-a-pull-request)
to finish Pull request creating.

To update Pull Request, simply push more commits to the same branch in your
GitHub fork, that you use to create the pull request.

```plaintext
git commit -a -m "Update my awesome feature with code review feedback"
git push my awesome_feature
```

GitHub would automatically update the pull request.

### Review a pull request (PR)

### Resolve an issue

### Write documentation

### Understand the coding workflow

The normal workflow is as follows

1. Resolve

#### Resolve dependencies

This does only need to be run once, but must also be run each time changes
are made to the file `RequiredModules.psd1`, or if there are new releases
of external modules listed in the file `RequiredModules.psd1`.

Running this command will make sure the dependencies are resolved and to
prepare the build and test environment.

```powershell
.\build.ps1 -ResolveDependency -Tasks noop
```

>**NOTE:** This does not install anything, it downloads the prerequisites
>into the `output` folder.

#### Build module

This builds the module after which for example tests can be run on the built
module. The built module will look the same as the one that is release.
`GitVersion` is used to determine the next version if it is installed.

**This must be run each time changes have been made to files in the source**
**folder.**

```powershell
.\build.ps1 -Tasks build
```

#### Test module

See [Testing Guidelines](/guidelines/testing-guideline/) for more
information on how to run tests.

#### Attach your fork to a free Azure DevOps organization

This is an optional step.

Adding your fork to a free Azure DevOps organization means that when you
push a working branch to your fork and it will be tested the same way as
when you send in a PR.

>This is similar to what the upstream repository is using to run CI pipeline,
>it is using the https://dev.azure.com/dsccommunity organization.

This is can be used to test that everything works  as expected before sending
in a PR. It can also be used to start a test run that takes a long time without
having the development environment powered on. Just commit and push the changes
and the Azure Pipelines will run the CI for you.

1. At this point push the working branch to your fork if you have not done
   so already. We will need it for the next step.
1. Create a free Azure DevOps organization at https://azure.microsoft.com/services/devops/
1. Install the GitVersion task
   1. Go to the https://dev.azure.com/{organization}/_settings/extensions and
      from there browse the marketplace and search for *GitVersion*.
1. Create a new project with the same name as the *GitHub repository name**,
   make sure to set visibility to **public**.
1. In the new project under Pipelines, create a new pipeline and choose
   GitHub as where the source resides, choose the the fork of the repository,
   e.g. johlju/SqlServerDsc. You will need to authenticate Azure DevOps
   with GitHub, and when it asks to install the Azure Pipelines GitHub app
   you can choose to install it for all and future repositories or just
   specific ones.
1. Once back in Azure Pipelines choose *Existing Azure Pipelines YAML file*
   and then to choose an azure-pipelines.yml by browsing the branch you
   recently pushed above. Then on the box that says *Run*, instead just
   choose *Save* in the drop-down list.
1. Overrides the continuous integration trigger by clicking on 'Edit' where
   you see the YAML file. Then click on the three dots to get the sub-menu
   and to get the menu item 'Triggers'.
   1. Once in Triggers pane, under *Continuous Integration* click the checkbox
      *Override the YAML continuous integration trigger from here*, and then
      change the *Branch specification* to `*` (asterisk).
   1. Under *Save & queue* in the drop-down menu choose *Save*.

Next time you push a commit to a branch in your fork the Azure Pipeline
will trigger on that and start a run.

>**NOTE:** Even if we choose a specific YAML file that will not be used,
>instead the YAML file from the branch being pushed will be used, so any
>changes to the file `azure-pipelines.yml` will be reflected.

### Resolve merge conflicts

If another pull request is merged while yours is in review, you will need to add
those new changes into your working branch before your pull request is allowed
to merge. To do this we will 'rebase' the branch.
This means that the changes you made in your working branch for your pull request
will be 'replayed' on top of the changes that were recently merged into dev, as
though you originally created your branch/fork from the current point that the
dev branch is at.

_Note: Since it's replayed you might get conflicts several times during the
rebase process (for the first `rebase` command, and for each following
`rebase --continue`)._

Here are the steps to rebase your branch:

**_Note: These steps assumes that you have added the remote as described above.
Run `git remote -v` to verify that you have the remote name `my` pointing to your
fork repository, and remote name `origin` pointing to the original (upstream)
repository. If your remote names are pointing differently, then change the remote
names below accordingly._**

1. Rebase the local dev branch from the base dev branch.
1. Resolve merge conflicts.
1. Rebase your working branch.
1. Resolve merge conflicts.
1. Update your pull request.

#### 1. Rebase the local dev branch from the base dev branch

- In a PowerShell prompt, you need to do the following.

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\xActiveDirectory
git checkout dev                    # Checkout (move) to your local dev branch.
git fetch origin dev                # Get all changes from origin/dev (and branch information).
git rebase origin/dev               # Rebase changes from origin/dev into your local dev branch.
```

>**Note:** If you used the **dev branch as your working branch**, then at this point
>you will probably get merge conflicts that need to be resolved. Search for the
>word 'CONFLICT' in the output. If you used dev as your working branch, you can
>skip to step 3 to learn how to resolve the merge conflicts.

Force push to your fork's dev branch to your forked repository.
_Make sure there were no conflicts before running this command._

```plaintext
git push my dev --force
```

#### 2. Rebase your working branch

- In a PowerShell prompt, you need to do the following.

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\xActiveDirectory.
git checkout <your PR branch>       # Checkout (move) to your working branch, i.e git checkout awesome_feature.
git rebase my/dev                   # This will rebase your working branch from your forks dev branch.
```

**NOTE! At this point you will most likely get merge conflicts that need to be
resolved before you continue with the next step. Search for the word 'CONFLICT'
in the output. See step 3 to learn how to resolve the merge conflicts.**

#### 3. Resolve merge conflicts

If you get a message saying something like below, then you have merge conflicts
that must be manually resolved.
Below there is a conflict between the dev branch and your pull request branch
for the file `README.md`.
You can read more about how to resolve a merge conflict on the
[GitHub help page](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/).

```plaintext
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
error: Failed to merge in the changes.
```

To fix this you need to manually open the file in an editor of your choosing and
find the conflict. You find the conflict by searching for seven equals
sign: `=======`. Below is an example of how it could look like.

```plaintext
...
### Unreleased
<<<<<<< HEAD
* Added tests for resources
  - xSQLServerPermission
* Fixes in xSQLServerAvailabilityGroupListener
  - In one case the Get-method did not report that DHCP was configured.
=======
* Added resources
  - xSQLServerReplication
>>>>>>> my/dev

### 1.8.0.0
...
```

- Above the equal characters `========` is what is currently in the `README.md`.
- Below the equal characters `========` is the incoming change from the current
  commit being replayed.

To resolve this we have to manually change this section. The file can be changed
in any way you need to solve the conflict.
_Note: You must remove the lines `<<<<<<< HEAD`, `========` and `>>>>>>> origin/dev`._

After resolving the conflict, `README.md` could look like this:

```plaintext
...
### Unreleased
* Added resources
  - xSQLServerReplication
* Added tests for resources
  - xSQLServerPermission
* Fixes in xSQLServerAvailabilityGroupListener
  - In one case the Get-method did not report that DHCP was configured.

### 1.8.0.0
...
```

When you are happy with the file, save it and continue with the next file, if
there was more merge conflicts.
**Only when all the merge conflicts are resolved can you continue with the rebase.**

- To continue with the rebase. In the same PowerShell prompt as you started the
  rebase, you need to do the following.
  _Note: If not using the same PowerShell prompt, make sure you are in the local
  repository folder._

```plaintext
git status          # (optional) If you unsure of the name, you can use this to see the files that was in conflict.
git add <file>      # Do this for each file that you fixed merged conflicts in. I.e 'git add README.md'. This stages the file for commit. You could also use 'git add *' to stage all files at once.
git rebase --continue
```

**You can now get more merge conflicts.** If so, then you have to resolve those
again. Do the same procedure as before for these new conflicts.
**You might need to do this step several times.**

Continue to step 4 only when you no longer have any merge conflicts you need to
resolve (and no longer need to run the command `rebase --continue`).

#### 4. Update your pull request

Force push to your branch in your forked repository. The pull request will then
be updated automatically by GitHub.
*Force push "overwrites" the branch in the fork, and is always needed after rebase.*

```plaintext
git push my <pull request branch> --force     # I.e git push my awesome_feature --force
```

### How to continue working on a pull request (PR) when an author (contributor) is unable to complete it

Anyone in the community is allowed to continue the work on pull requests (PR's)
if either of these are true.

- If the original contributor is unable to continue the work on a pull request
  _and_ the original author signed the CLA.
- If the pull request have been labeled with the *abandoned* label (which also
  implies that the CLA was signed - otherwise the abandoned label should not have
  been set).

It is polite to tell the original author of the PR that you will be continuing
the work, by commenting on the original PR.

You can continue the work by getting the changes from the original contributors
branch to a new working branch in your fork. Once you have create a new working
branch with the original contributors changes,
then you can create a new pull request into the original repository.
It's important that when you create a new pull request from someone elses work,
that you mention the original pull request, and also acknowledge the original
author and mention the work it is based on.
For example mention the original author in the descriptive field when you create
the new pull request.

So, to continue working on a pull request, first you should rebase the changes
in the original pull request branch onto your new working branch. This is pretty
much the same as when you have to resolve merge conflicts.

In a PowerShell prompt, you need to do the following.

1. Create a new working branch in your fork.

   ```plaintext
   cd <path to cloned repository>
   git checkout -b changes-from-PR#<number>  # Change to the PR number, i.e. git checkout -b changes-from-PR#34
   ```

1. Add a remote to the original contributors fork. _In this example we use the users name as the remotes name._

   ```plaintext
   git remote add <username> <url>           # I.e git remote add johlju https://github.com/johlju/xSQLServer.git
   ```

1. Rebase your working branch using the fork and branch from the original contributor.

   ```plaintext
   git fetch <username>
   git rebase <username>/<branch>
   ```

1. Fix conflicts and when all conflicts are resolved stage all files and continue
   with the rebase.
   _This step might have to be done several times until all conflicts are resolved_

   ```plaintext
   git add <file>                            # i.e git add README.md
   git rebase --continue
   ```

1. Push changes to your forked repository

   ```plaintext
   git push my changes-from-PR#<number> --force  # Change to the PR number, i.e. git push my changes-from-PR#34 --force
   ```

1. Now we rebase again, this time against my/dev (which should already be rebased
   against origin/dev, see section Resolving merge conflicts on how to do that).

   ```plaintext
   git rebase my/dev
   ```

1. Again, fix conflicts and when all conflicts are resolved stage all files and
   continue with the rebase.
   _This step might have to be done several times until all conflicts are resolved_

   ```plaintext
   git add <file>                            # i.e git add README.md
   git rebase --continue
   ```

1. Push to your forked repository again

   ```plaintext
   git push my changes-from-PR#<number> --force  # Change to the PR number, i.e. git push my changes-from-PR#34 --force
   ```

1. Now, go to you forked repository on GitHub and create the pull request the
  normal way.

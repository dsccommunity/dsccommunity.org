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
- [Breaking changes](#breaking-changes)
- [Discuss an issue or pull request (PR)](#discuss-an-issue-or-pull-request-pr)
- [Resolve an issue](#resolve-an-issue)
- [Create or update a pull request (PR)](#create-or-update-a-pull-request-pr)
- [Continuous integration (CI) pipeline](#continuous-integration-CI-pipeline)
- [Review a pull request (PR)](#review-a-pull-request-pr)
- [Write documentation](#write-documentation)
- [Submitting an new DSC resource](#submitting-a-new-DSC-resource)
- [Submitting a new resource module](#submitting-a-new-resource-module)
- [Understand the coding workflow](#understand-the-coding-workflow)
- [Attach your fork to a free Azure DevOps organization](#attach-your-fork-to-a-free-azure-devops-organization)
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
please also refer to our [Breaking changes](#breaking-changes) section below.

<img src="../../images/contributing/github_issue_title.png" alt="GitHub Write Issue Title" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

The issue description should contain a **detailed** report of the issue
you are submitting. If you are submitting a bug, please include any error
messages or stack traces caused by the problem.

Please reference any related issues or pull requests by a pound sign followed by
the issue or pull request number (e.g. #11, #72). GitHub will automatically link
the number to the corresponding issue or pull request. You can also link to pull
requests and issues in other repositories by including the repository owner and
name before the issue number.

Please also tag any GitHub users you would like to notice this issue (if any).
You can tag someone on GitHub with the `@` symbol followed by their GitHub
account name, e.g. `@johlju`.

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

    #### Version of the DSC module that was used.
    6.4.0
```

### Breaking changes

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

Your experience as an IT professional is needed to make the DSC resources
better. Regardless of your knowledge in DSC you can help make the
DSC resource the best possible. In the end DSC is installing and configuring
the products you can use in production, so by discussing issues and
changes in PR's you help make the DSC resources even better.

Always keep in mind the [Code of Conduct](/code_of_conduct).

### Resolve an issue

You may work on any issue. Issued labeled with `good first issue` has been
deemed easy to resolve, although the level of easy can vary from
issue to issue.

>If you are new to contributing, then you might want to start with an issue
>labeled with `good first issue` since they are meant for you as new contributor
>to have something easy from where to start learning the process and workflow.

If you find an issue you like to resolve then please comment on that issue
that you are working on it. This helps other in the community to know that
this is being worked on, and keeps other contributors from working on the
same issue.

After you have [created a pull request (PR)](#create-or-update-a-pull-request-pr)
the PR will be reviewed by the community.

_It is rare, but issues can be labeled `on hold` by the maintainer_
_and these issues should normally not be worked on. The reason why it has_
_been put on hold should have been mentioned as a comment on the issue._

### Create or update a pull request (PR)

If you are new to contributing in general then please read the
[Getting Started as a Contributor](/guidelines/getting-started) which
will help you set up an environment for developing.

Make sure there are an issue that describes you problem, if there are
no issue then please create an issue prior to sending in a PR so that
others in the community can discuss. You may create the issue and then
directly send in a PR.

If you are making a breaking change, please make sure to read the
[Breaking changes](#breaking-changes) section.

Here is the general process of sending in a PR:

1. Pick out the issue you'd like to work on, see [Fixing an issue](#fixing-an-issue).
1. Create a new working branch based on branch `master`. See
   [Making changes and pushing them to the fork](/guidelines/getting-started/#making-changes-and-pushing-them-to-the-fork).
1. Write tests that will ensure that the issue in the code is fixed.
   See [Testing Guidelines](/guidelines/testing-guideline).
1. Make changes in your working branch to solve the issue.
1. Update the **Unreleased** section of the repository changelog (file
   `CHANGELOG.md`) in accordance to the type of changes in [keep a changelog](https://keepachangelog.com/en/1.0.0/).
1. Submit a PR targeting the branch `master` of the upstream repository.
1. Make sure all tests are passing in the CI pipeline for your PR
   (see the [PR status checks](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks)).
1. Make sure your code does not contain merge conflicts.
1. Address any comments brought up by the reviewers.

#### Follow the style guideline

When writing code for any of the modules in the DSC Community, please follow
the [Style Guidelines](/styleguidelines).

These guidelines are specific to the DSC Community and may not always reflect
the same PowerShell style as other projects. Code reviewers will expect you
to follow these guidelines and may ask you to change your code for consistency.

When using Visual Studio Code there are also custom [Script Analyzer](https://github.com/PowerShell/PSScriptAnalyzer)
rules that will give visual help (e.g. squiggly lines) when the code are not
following the style guideline. *This does not currently support every*
*guideline in the style guidelines.*

#### Write tests

For code changes to be accepted you should have written tests, some
repositories requires both unit and integration tests.

You are required to provide adequate test coverage for the code you change.

See [Testing Guidelines](/guidelines/testing-guideline) for more information.

>Not all resources currently have tests. This does not mean that you do not
>have to write tests for your changes. But you do not have to write the full
>set of tests for the resource. You only need to test the changes that you
>made to the resource.

#### Update the changelog

Each repository has a changelog (`CHANGELOG.md`) that is required to be
updated. For each change an entry should be added to the changelog. The
entry should in the **past** tense explain what changed, and how it
affects users (if applicable). Also reference any issues that have been
resolved.

For breaking changes see [Breaking changes](#breaking-changes) section.

The types of changes that can be used (as per [keep a changelog](https://keepachangelog.com/en/1.0.0/))
are:

- `### Added` - for new features.
- `### Changed` - for changes in existing functionality.
- `### Deprecated` - for soon-to-be removed features.
- `### Removed` - for now removed features.
- `### Fixed` - for any bug fixes.
- `### Security` - in case of vulnerabilities.

Example of the _Unreleased_ section of the file `CHANGELOG.md`.

```markdown
## [Unreleased]

### Added

- ActiveDirectoryDsc
  - Added DSC resource ADOptionalFeature that will enable the Active
    Directory Optional Feature of choice for the target forest
    ([issue #162](https://github.com/dsccommunity/ActiveDirectoryDsc/issues/162)).

### Removed

- ADRecycleBin
  - BREAKING CHANGE: The DSC resource was replaced by the DSC resource
    ADOptionalFeature ([issue #162](https://github.com/dsccommunity/ActiveDirectoryDsc/issues/162))..

### Changed

- ADDomain
  - The property DomainName was changed to always return the same value
    as was passed in as the parameter. For the fully qualified domain
    name (FQDN) of the domain see the new read-only property `DnsRoot`.
```

#### Open a Pull Request

A [pull request](https://help.github.com/articles/using-pull-requests/)
(PR) allows you to submit the changes you made in your working branch of
you fork to the upstream repository.
There are different ways of starting the opening of a pull request,
but this shows two ways.

##### New pull request from working branch

First browse to you fork, e.g. https://github.com/johlju/ComputerManagementDsc

If you just pushed a working branch to you fork GitHub will know that and
suggest to send in a pull request, Just click on the button *Compare & pull request*.

<img src="../../images/contributing/github_compare_and_pull_request.png" alt="GitHub Compare & Pull Request" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

If that is not shown, another way of submit a PR is to choose the working
branch in the list of branches of your fork, let the page refresh, and then
click the button *New pull request*.

<img src="../../images/contributing/github_choose_branch_and_pull_request.png" alt="GitHub Choose Branch & Pull Request" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:300px;" />

Once you used either option to get to the *Open a pull request* page you
should make sure you are comparing the right branches. If you used either
of the above methods to get to the page the compare should already be
correct.

The *base* is the repository and branch the pull request will be targeting
(or merged) **into**. Normally this should be the upstream repository,
and normally the branch should be `master`.

The *head repository* is the repository where the working branch exist and
the *compare* is the branch being compared to the *base* branch (`master`).

>If GitHub tells you that your branches cannot automatically be merged,
>then you probably have merge conflicts. You can resolve that before or
>after sending in a pull request. The merge conflicts must be resolved
>before the pull request can be merged, and a reviewer might ask you to
>resolve them before a review can be done.
>
>For help fixing merge conflicts see the section [Resolve merge conflicts](#resolve-merge-conflicts)

<img src="../../images/contributing/github_pull_request_target.png" alt="GitHub Pull Request Target" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

##### Pull Request Title

Next up need to write a short but descriptive PR title. The PR title should
be a brief summary of the PR in one sentence. Simply putting the issue number
that the PR fixes is not acceptable. Prefix the title with the DSC resource
name, or the repository name if the change is not specific to one DSC resource.
*A suggestion is to build the title from the entries you made in the changelog*.

For breaking changes see [Breaking changes](#breaking-changes) section.

##### Pull Request Description

The PR description field is populated with the pull request template
to easier fill in the needed informaiton.

- **Pull request (PR) description** - A detailed report of all the changes
  you made. A suggestion is to use the same information that was added
  to the changelog which would cover this.
- **This pull request (PR) fixes the following issues** - List all issues
  that this PR resolves in the form `- Fixes #123` (this will allow GitHub
  to auto-close the issues once this PR is merged).
- **Task list** - Fill in each entry that are true for your PR. *This is*
  *a list to help contributors and maintainers to get all needed steps done.*

Please also tag any GitHub users you would like to notice this PR (if any).
You can tag someone on GitHub with the `@` symbol followed by their GitHub
account name, e.g. `@johlju`.
If you have a specific contributor/maintainer you want to review your code,
be sure to tag them in your pull request.

This is an example how a PR can look like before submitting.

<img src="../../images/contributing/github_pull_request_description.png" alt="GitHub Pull Request Description" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

##### Create Pull Request

When you are done simple click *Create pull request* and the pull request
will be created in the upstream repository.

You will then need to wait for the PR to be reviewed. You cannot review
your own code. Only maintainers can merge your code, and they do that
only after a review has been made.

#### Update pull request of yours

Please see [Make changes to an existing pull request of yours](/guidelines/getting-started/#make-changes-to-an-existing-pull-request-of-yours)

#### Continuous integration (CI) pipeline

For each commit that is sent in to a pull request (PR) the CI pipeline will
build and test the DSC module. It is the same pipeline that is used in the
[coding workflow](/guidelines/contributing#understand-the-coding-workflow).

Status of the runs can be seen in the status checks of the pull request.

<img src="../../images/contributing/github_status_checks.png" alt="GitHub Pull Status Checks" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

And more details can be seen on the *Checks* pane.

<img src="../../images/contributing/github_status_checks_detailed.png" alt="GitHub Pull Status Checks Detaild" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

>A maintainer will **not** merge your PR if any tests are failing,
>even if they have nothing to do with your changes. If test failures are
>occurring that do not relate to the changes you made those issue must
>be resolved before the PR can be merged. If you don't know how to resolve
>them then please contact the maintainer of the repository.

### Review a pull request (PR)

Anyone are allowed to review pull requests (PR). You are strongly encourage
you to help review since you probably have some experience of the product
the DSC resource are used for. The more voices on a PR the better the DSC
resource will get, so we can help see impacts further down the road, like
avoiding future breaking changes.

By reviewing a PR you help the maintainer. Please also note that it is not
necessary that the maintainer has the knowledge of the area a PR is targeting,
or have time to review PR's in the near future, but hopes that help comes
from the community.

Only maintainers can merge your code, and a maintainer only merges after
the PR has been approved in a review.

**Only maintainers are allowed to review and merge their own code, but**
**then only after 24 hours so the community have a chance to comment on**
**the changes.**

>We don't currently have dedicated maintainers for most modules, so it may
>take a while for a general maintainer to get around to your pull request.
>Please be patient.
>If you want to become a maintainer, please see [Maintainers](/community/maintainers).

### Write documentation

All documentation is done in markdown.

Updating documentation is done through sending in a pull request (PR).
The same principle as sending in a PR, that an issue should be created
first.

>**NOTE:** The Wiki is updated from the pipeline so it cannot be updated
>manually. Any manually changes to the Wiki will be lost on next release.

### Submitting a new DSC resource

If you would like to add a new DSC resource, please open an issue in the
repository you think the new resource should be in. This will help to
coordinate your work with other contributors. The repositories have a
template *New resource proposal* that can help you provide the needed
information.

Once the issue is open, you may begin working on the new DSC resource.
Like normal you send in a pull request with the proposed DSC resource.
Keep an eye on the issue and any discussion around the new DSC resource
proposal.

Be sure to include unit and integration tests for the new DSC resource,
and document it like other DSC resources.

#### DSC resource naming

Any test or example files for the resource should be named to match the
files for the same resource. For example, if the main resource file is
named `DSC_Resource.psm1`, then the unit test file should be named
`MSFT_Resource.Tests.ps1`. Consistent naming helps the review process.

##### MOF-based DSC resource

All mof-based resource should have `DSC_` prefixed before the resource name
in the schema file and on files (e.g. ``DSC_Resource.schema.mof`, `DSC_Resource.psm1`).
This is per a convention that the name (or abbreviated name) of the
company that provides the resource be included in the name of mof-based
resource files. The friendly name of the resource that is defined in the
`.mof` file should not have the `DSC_` prefix.

##### Composite DSC resource

Composite resource with a configuration and a `.psd1` file must have the
exact same name as the resource or they will not be able to be imported.
Hence, composite resource files should not have the `DSC_` prefix, e.g.
Resource.psm1.

### Submitting a new resource module

You are welcome to transfer your DSC module to the DSC Community GitHub
organization, or we happily create a new DSC module. You will then be
made a maintainer with administrator privileges on that repository.

The module must use the Plaster template that is generated by the
[Sampler](https://github.com/gaelcolas/Sampler) project to correctly
use the CI pipeline needed.

Please contact a [committee member](/community/committee) preferably
on the [Slack #DSC channel](http://localhost:1313/community/contact/) if
you need a new empty repository, or if you want to transfer an existing
repository.

### Understand the coding workflow

The normal workflow is as follows

1. [Resolve dependencies](#resolve-dependencies)
1. [Build module](#build-module)
1. [Test module](#test-module)

#### Resolve dependencies

Pay attention to any new code merged into the `master` branch of the official repository.
If this occurs, you will need to pick-up these changes in your fork using the rebase
instructions in our [guide to getting started with GitHub](GettingStartedWithGitHub.md).

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

### Attach your fork to a free Azure DevOps organization

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

If another pull request is merged while yours is in review, you will need
to ad those new changes into your working branch before your pull request
is allowed to merge. To do this we will 'rebase' the branch. This means that
the changes you made in your working branch for your pull request will be
'replayed' on top of the changes that were recently merged into `master`, as
though you originally created your branch/fork from the current point that
the `master` branch is at.

_Note: Since it's replayed you might get conflicts several times during the_
_rebase process (for the first `rebase` command, and for each following_
_`rebase --continue`)._

Here are the steps to rebase your branch:

1. Rebase the local `master` branch from the base `master` branch.
1. Resolve merge conflicts.
1. Rebase your working branch.
1. Resolve merge conflicts.
1. Update your pull request.

>Note: These steps assumes that you have added the remote as described above.
>Run `git remote -v` to verify that you have the remote name `my` pointing to your
>fork repository, and remote name `origin` pointing to the upstream repository.
>If your remote names are pointing differently, then change the remote names
>below accordingly.

#### 1. Rebase the local branch `master` from the base branch `master`

- In a PowerShell prompt, you need to do the following.

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\ComputerManagementDsc
git checkout master                 # Checkout (move) to your local master branch.
git fetch origin master             # Get all changes from origin/master (and branch information).
git rebase origin/master            # Rebase changes from origin/master into your local master branch.
```

>**Note:** If you used the **master branch as your working branch**, then at
>this point you will probably get merge conflicts that need to be resolved.
>Search for the word 'CONFLICT' in the output. If you used `master` as your working
>branch, you can skip to step 3 to learn how to resolve the merge conflicts.

Force push to your fork's `master` branch to your forked repository.
_Make sure there were no conflicts before running this command._

```plaintext
git push my master --force
```

#### 2. Rebase your working branch

- In a PowerShell prompt, you need to do the following.

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\ComputerManagementDsc.
git checkout <your PR branch>       # Checkout (move) to your working branch, i.e git checkout awesome_feature.
git rebase my/master                # This will rebase your working branch from your forks master branch.
```

**NOTE! At this point you will most likely get merge conflicts that need to be
resolved before you continue with the next step. Search for the word 'CONFLICT'
in the output. See step 3 to learn how to resolve the merge conflicts.**

#### 3. Resolve merge conflicts

If you get a message saying something like below, then you have merge conflicts
that must be manually resolved.
Below there is a conflict between the `master` branch and your pull request branch
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
>>>>>>> my/master

### 1.8.0.0
...
```

- Above the equal characters `========` is what is currently in the `README.md`.
- Below the equal characters `========` is the incoming change from the current
  commit being replayed.

To resolve this we have to manually change this section. The file can be changed
in any way you need to solve the conflict.
_Note: You must remove the lines `<<<<<<< HEAD`, `========` and `>>>>>>> origin/master`._

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
git status            # (optional) If you unsure of the name, you can use this to see the files that was in conflict.
git add <file>        # Do this for each file that you fixed merged conflicts in. I.e 'git add README.md'. This stages the file for commit. You could also use 'git add *' to stage all files at once.
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

- If the original contributor is unable to continue the work on a pull request.
- If the pull request have been labeled with the *abandoned* label.

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

1. Now we rebase again, this time against `my/master` (which should already be rebased
   against `origin/master`, see section Resolving merge conflicts on how to do that).

   ```plaintext
   git rebase `my/master`
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

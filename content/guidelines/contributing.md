---
title: "Contributing"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "Johan Ljunggren"
weight: 2
---

Thank you for your interest in contributing to the DSC Community.

There are several ways you can contribute.

- You can submit an issue to report a bug or to request an improvement.
- You are encouraged to take part in discussions about an issue or
  pull request.
- You may review pull requests.
- You may send in a pull request to improve the DSC modules by adding a
  new DSC resource, fixing issues in existing DSC resources, improve the
  CI pipeline, or updating documentation around the DSC modules.
- You are welcome to transfer a DSC module over to the DSC Community.
- You may create an entire new DSC module if there is need for it (you
  will become a maintainer of a new empty repository in DSC Community).

If you want to contribute my making changes to code or documentation but
are new to contributing and GitHub, then please read the
[Getting Started as a Contributor](/guidelines/getting-started/) guideline.

You may also [join the conversation](/community/contact/) and ask for
help or share your knowledge in direct communication with other members
of the community.

If you need any help along the way, don't be afraid to ask. We are here
for each other.

You can read more about the different contributions here:

- [Submit an issue](#submit-an-issue)
  - [Open a new issue](#open-a-new-issue)
    - [Find the repository](#find-the-repository)
    - [Search existing issues](#search-existing-issues)
    - [Create a new issue](#create-a-new-issue)
- [Breaking changes](#breaking-changes)
- [Discuss an issue or pull request (PR)](#discuss-an-issue-or-pull-request-pr)
- [Resolve an issue](#resolve-an-issue)
- [Create or update a pull request (PR)](#create-or-update-a-pull-request-pr)
  - [Follow the style guideline](#follow-the-style-guideline)
  - [Write tests](#write-tests)
  - [Update the changelog](#update-the-changelog)
  - [Open a Pull Request](#open-a-pull-request)
    - [New pull request from working branch](#new-pull-request-from-working-branch)
    - [Pull Request Title](#pull-request-title)
    - [Pull Request Description](#pull-request-description)
    - [Create Pull Request](#create-pull-request)
  - [Update pull request of yours](#update-pull-request-of-yours)
  - [Continuous integration (CI) pipeline](#continuous-integration-ci-pipeline)
- [Review a pull request (PR)](#review-a-pull-request-pr)
- [Write documentation](#write-documentation)
- [Submitting a new DSC resource](#submitting-a-new-dsc-resource)
  - [DSC resource naming](#dsc-resource-naming)
    - [MOF-based DSC resource](#mof-based-dsc-resource)
    - [Composite DSC resource](#composite-dsc-resource)
- [Submitting a new resource module](#submitting-a-new-resource-module)
- [Understand the coding workflow](#understand-the-coding-workflow)
  - [Remove old dependencies](#remove-old-dependencies)
  - [Resolve dependencies](#resolve-dependencies)
  - [Build module](#build-module)
  - [Test module](#test-module)
  - [Knowledge base](#knowledge-base)
    - [Error `cannot find "s.psd1"`](#error-cannot-find-spsd1)
      - [Cause 1](#cause-1)
      - [Cause 2](#cause-2)
    - [Error `Missing property 'ProjectName'`](#error-missing-property-projectname)
    - [Error `Cannot process argument transformation on parameter 'ProjectName'`](#error-cannot-process-argument-transformation-on-parameter-projectname)
    - [Issue with preview strings containing a dash](#issue-with-preview-strings-containing-a-dash)
- [Attach your fork to a free Azure DevOps organization](#attach-your-fork-to-a-free-azure-devops-organization)
- [Resolve merge conflicts](#resolve-merge-conflicts)
  - [1. Rebase the local branch `main` from the base branch `main`](#1-rebase-the-local-branch-main-from-the-base-branch-main)
  - [2. Rebase your working branch](#2-rebase-your-working-branch)
  - [3. Resolve merge conflicts](#3-resolve-merge-conflicts)
  - [4. Update your pull request](#4-update-your-pull-request)
- [How to continue working on a pull request (PR) when an author (contributor) is unable to complete it](#how-to-continue-working-on-a-pull-request-pr-when-an-author-contributor-is-unable-to-complete-it)

### Submit an issue

Submitting an issue to a repository in the DSC Community is easy! An
issue can be a problem, a solution, or a question.

1. Find the correct repository to submit your issue to. See and search a
   [list of all repositories in DSC Community](https://github.com/dsccommunity).
2. Search open issues to make sure the issue you're having have not been
   submitted by someone else.
3. Open a new issue. *If the repository has different issue templates*
   *choose the template that best suits the issue you are experiencing.*
4. Fill in a short but descriptive issue title.
5. Fill in the issue description. *If you chose an issue template, follow*
   *the guidance in the template text.*
6. Submit the issue.

You may also [join the conversation](/community/contact/) and ask for
help from other members of the community.

#### Open a new issue

For example, let us pretend we have a problem with the ComputerManagementDsc
module that we need to report to the community.

##### Find the repository

Browse to the [list of all repositories in DSC Community](https://github.com/dsccommunity)
and in the search field type 'comp'. GitHub should automatically filter
the results and show the repositories that match what you typed.

<img src="../../images/contributing/github_search_repository.png" alt="GitHub Search Repository" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

Click on the repository name _**ComputerManagementDsc**_ to open up the repository.

##### Search existing issues

Search the issues to check that there are no issues already submitted for the
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

Please read the template text in the description field. The template text is there to help you provide as much information as possible, so it becomes easier for the community to help you with your issue.

Write a short but descriptive issue title. The issue title should be a
brief summary of your issue in one sentence. While you write you will get
suggestions on previous issues that can be related to that issue. *Please*
*verify so that no issue that are suggest covers the issue you are having.*

If you would like to submit an issue that would include a breaking change,
please also refer to our [Breaking changes](#breaking-changes) section below.

<img src="../../images/contributing/github_issue_title.png" alt="GitHub Write Issue Title" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

The issue description should contain a **detailed** report of the issue
you are submitting. If you are submitting a bug, please include any error
messages or stack traces caused by the problem. The verbose log can also
be very helpful and are often requested by the issue template. You can read
more about how to get the verbose log in the article [How to use DSC logging](https://dsccommunity.org/blog/how-to-use-dsc-logging#deployment-process).

Please reference any related issues or pull requests by a pound sign followed by
the issue or pull request number (e.g. #11, #72). GitHub will automatically link
the number to the corresponding issue or pull request. You can also link to pull
requests and issues in other repositories by including the repository owner and
name before the issue number.

Please also tag any GitHub users you would like to be notified of this issue
(if any). You can tag someone on GitHub with the `@` symbol followed by their
GitHub account name, e.g. `@johlju`.

Fill in each section in the template as necessary. The more detail
you provide, the easier it will be for the community to help you with your
issue.

*This example does not provide much context. It has also been shortened*
*for the sake of brevity.*

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
outlining the work needed. This allows the community to discuss the change before
the work is done and scopes the breaking changes to just the needed areas.

An issue that is deemed to be a breaking changed should be labelled `breaking change`
and the issue title should be prefixed with `BREAKING CHANGE:`.

Breaking changes may include:

- Adding a new mandatory parameter
- Changing an existing parameter
- Removing an existing parameter
- Fundamentally changing existing functionality of a resource

A pull request (PR) that introduces a breaking change should prefix at
least one entry in the change log with `BREAKING CHANGE:`. The entry
should clearly explain what the breaking change is and how it will affect
users.

### Discuss an issue or pull request (PR)

Your experience as an IT professional is needed to make the DSC resources
better. Regardless of your knowledge in DSC you can help make the
DSC resource the best possible. In the end, DSC is installing and configuring
the applications and components you use, so by discussing issues and
changes in PR's you help make the DSC resources even better.

Always keep in mind the [Code of Conduct](/code_of_conduct).

### Resolve an issue

You may work on any issue. Issued labeled with `good first issue` has been
deemed easy to resolve, although the level of ease can vary from
issue to issue.

>If you are new to contributing, then you might want to start with an issue
>labeled with `good first issue` since they are meant for you as new contributor
>to have something easy from where to start learning the process and workflow.

If you find an issue you would like to resolve then please comment on that
issue that you are working on it. This helps others in the community to know
that this is being worked on, and keeps other contributors from working on
the same issue.

After you have [created a pull request (PR)](#create-or-update-a-pull-request-pr)
the PR will be reviewed by the community.

_It is rare, but issues can be labeled `on hold` by the maintainer_
_and these issues should normally not be worked on. The reason why it has_
_been put on hold should have been mentioned as a comment on the issue._

### Create or update a pull request (PR)

If you are new to contributing in general then please read the
[Getting Started as a Contributor](/guidelines/getting-started) which
will help you set up an environment for developing.

Make sure there is an issue that describes your problem. If there is
no issue then please create an issue prior to sending in a PR so that
others in the community can discuss. You may create the issue and then
directly submit in a PR.

If you are making a breaking change, please make sure to read the
[Breaking changes](#breaking-changes) section.

Here is the general process of submitting a PR:

1. Pick out the issue you'd like to work on, see [Fixing an issue](#fixing-an-issue).
1. Post a comment on the issue that you are working on resolving the issue.
1. Create a new working branch based on branch `main`. See
   [Making changes and pushing them to the fork](/guidelines/getting-started/#making-changes-and-pushing-them-to-the-fork).
1. Write tests that will ensure that the issue in the code is fixed.
   See [Testing Guidelines](/guidelines/testing-guidelines).
1. Make changes in your working branch to solve the issue.
1. Update the **Unreleased** section of the repository changelog (file
   `CHANGELOG.md`) in accordance to the type of changes in [keep a changelog](https://keepachangelog.com/en/1.0.0/).
1. Submit a PR targeting the branch `main` of the upstream repository.
1. Make sure all tests are passing in the CI pipeline for your PR
   (see the [PR status checks](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/about-status-checks)).
1. Make sure your code does not contain merge conflicts.
1. Address any comments brought up by the reviewers by either discussing
   them or resolve them by pushing changes to your working branch (to
   the same branch from which the PR was submitted).

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

See [Testing Guidelines](/guidelines/testing-guidelines) for more information.

>Not all resources currently have tests. This does not mean that you do not
>have to write tests for your changes. But you do not have to write the full
>set of tests for the resource. You only need to test the changes that you
>made to the resource. But adding unit tests for uncovered code that you
>have not altered is welcomed.

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
There are many ways of opening a pull request, but this document covers
two common methods.

##### New pull request from working branch

First browse to your fork, e.g. https://github.com/johlju/ComputerManagementDsc

If you just pushed a working branch to you fork GitHub will know that and
suggest sending in a pull request, Just click on the button *Compare & pull request*.

<img src="../../images/contributing/github_compare_and_pull_request.png" alt="GitHub Compare & Pull Request" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

If that is not shown, another way to open a PR is to choose the working
branch in the list of branches of your fork, let the page refresh, and then
click the button *New pull request*.

<img src="../../images/contributing/github_choose_branch_and_pull_request.png" alt="GitHub Choose Branch & Pull Request" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:300px;" />

Once you have used either option to get to the *Open a pull request* page
you should make sure you are comparing the right branches. If you used
either of the above methods to get to the page the compare should already
be correct.

The *base* is the repository and branch the pull request will be targeting
(or merged) **into**. Normally this should be the upstream repository,
and normally the branch should be `main`.

The *head repository* is the repository where the working branch exists and
the *compare* is the branch being compared to the *base* branch (`main`).

>If GitHub tells you that your branches cannot automatically be merged,
>then you probably have merge conflicts. You can resolve these before or
>after sending in a pull request. The merge conflicts must be resolved
>before the pull request can be merged, and a reviewer might ask you to
>resolve them before a review can be done.
>
>For help fixing merge conflicts see the section [Resolve merge conflicts](#resolve-merge-conflicts)

<img src="../../images/contributing/github_pull_request_target.png" alt="GitHub Pull Request Target" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

##### Pull Request Title

Next, you need to write a short but descriptive PR title. The PR title should
be a brief summary of the PR in one sentence. Simply putting the issue number
that the PR fixes is not acceptable. Prefix the title with the DSC resource
name, or the repository name if the change is not specific to one DSC resource.
*A suggestion is to build the title from the entries you made in the changelog*.

For breaking changes see [Breaking changes](#breaking-changes) section.

##### Pull Request Description

The PR description field is populated with the pull request template
to easier fill in the needed information.

- **Pull request (PR) description** - A detailed report of all the changes
  you made. A suggestion is to use the same information that was added
  to the changelog which would cover this.
- **This pull request (PR) fixes the following issues** - List all issues
  that this PR resolves in the form `- Fixes #123` (this will allow GitHub
  to auto-close the issues once this PR is merged).
- **Task list** - Fill in each entry that are true for your PR. *This is*
  *a list to help contributors and maintainers to get all needed steps done.*

Please also tag any GitHub users you would like to be notified of this PR
(if any). You can tag someone on GitHub with the `@` symbol followed by
their GitHub account name, e.g. `@johlju`.
If you have a specific contributor/maintainer you want to review your code,
be sure to tag them in your pull request.

This is an example how a PR can look before submitting.

<img src="../../images/contributing/github_pull_request_description.png" alt="GitHub Pull Request Description" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

##### Create Pull Request

When you are done, simply click *Create pull request* and the pull request
will be created in the upstream repository.

You will then need to wait for the PR to be reviewed. You cannot review
your own code. Only maintainers can merge your code, and they do that
only after a review has been completed, and all review comments have been
addressed and approved.

#### Update pull request of yours

Please see [make changes to an existing pull request of yours](/guidelines/getting-started/#make-changes-to-an-existing-pull-request-of-yours).

#### Continuous integration (CI) pipeline

For each commit that is sent in to a pull request (PR) the CI pipeline will
build and test the DSC module. It is the same pipeline that is used in the
[coding workflow](/guidelines/contributing#understand-the-coding-workflow).

Status of the runs can be seen in the status checks of the pull request.

<img src="../../images/contributing/github_status_checks.png" alt="GitHub Pull Status Checks" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

More details can be seen on the *Checks* pane.

<img src="../../images/contributing/github_status_checks_detailed.png" alt="GitHub Pull Status Checks Detaild" style="box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);width:725px;" />

>A maintainer will **not** merge your PR if any tests are failing,
>even if they have nothing to do with your changes. If test failures are
>occurring that do not relate to the changes you made those issue must
>be resolved before the PR can be merged. If you don't know how to resolve
>them then please contact the maintainer of the repository.

### Review a pull request (PR)

Anyone is allowed to review pull requests (PR). You are strongly encouraged
to help review since you probably have some experience of the application
or component the DSC resource is used for. The more minds on a PR the
better the DSC resource will get, so we can help see impacts further down
the road, like avoiding future breaking changes.

Please also consider that maintainers may not have expert knowledge in an
area that a PR is targeting. Maintainers may also not be able to review PR's
in a timely fashion due to other commitments. However, it is hoped that
help and support will come from community members such as yourself.

Only maintainers can merge your code, and a maintainer only merges after
the PR has been approved in a review.

**Only maintainers are allowed to review and merge their own code, but**
**then only after 24 hours so the community has a chance to comment on**
**the changes.**

>We don't currently have dedicated maintainers for most modules, so it may
>take a while for a general maintainer to get around to your pull request.
>Please be patient.
>If you want to become a maintainer, please see [Maintainers](/community/maintainers).
>
>If you have an urgent issue that needs to be reviewed in a repository that
>does not have a maintainer, or you haven't heard from the repository
>maintainer for a period of time. Then it is possible to ask for reviews from
>the other community members or general maintainers via [Slack #DSC channel](/community/contact/).

### Write documentation

All documentation is done in Markdown.

Updating documentation is done by sending in a pull request (PR).
The same principles as fixing an issue or submitting a feature apply here:
An issue should be created first.

_Note: The wiki is updated through a DevOps pipeline. Updates cannot be applied manually._


### Submitting a new DSC resource

If you would like to add a new DSC resource, please open an issue in the
repository you think the new resource should be in. This will help to
coordinate your work with other contributors. The repositories have a
template *New resource proposal* that can help you provide the needed
information, for example providing a proposed schema for the community
to discuss, and make sure it adopts DSC resource standard patterns.
Keep an eye on the issue and any discussion around the new DSC resource
proposal.

>A suggestion is to wait for acknowledgement from the community (or maintainer)
>to include the resource before you start working on the new DSC resource.
>For example if the proposed schema must be extended or changed in some
>way you might have to build the logic differently.

Once the issue is open, you may begin working on the new DSC resource.
Just like submitting a pull request to fix an issue, a pull request
containing the proposed DSC resource should be submitted.

Be sure to include unit and integration tests for the new DSC resource,
and document it like other DSC resources.

#### DSC resource naming

Any test or example files for the resource should be named to match the
files for the same resource. For example, if the main resource file is
named `DSC_Resource.psm1`, then the unit test file should be named
`MSFT_Resource.Tests.ps1`. Consistent naming helps the review process.

##### MOF-based DSC resource

All MOF-based resources should have `DSC_` prefixed before the resource name
in the schema file and on files (e.g. ``DSC_Resource.schema.mof`, `DSC_Resource.psm1`).
This is per a convention that the name (or abbreviated name) of the
company that provides the resource be included in the name of MOF-based
resource files. The friendly name of the resource that is defined in the
`.mof` file should not have the `DSC_` prefix.

##### Composite DSC resource

Composite resources with a configuration and a `.psd1` file must have the
exact same name as the resource, or they will not be able to be imported.
Hence, composite resource files should not have the `DSC_` prefix, e.g.
Resource.psm1.

### Submitting a new resource module

You are welcome to transfer your DSC module to the DSC Community GitHub
organization, or we will happily create a repository for your new DSC
resource module. You will then be made a maintainer with administrator
privileges on that repository.

The module must use the Plaster template that is generated by the
[Sampler](https://github.com/gaelcolas/Sampler) project to correctly
use the CI pipeline needed.

Please contact a [committee member](/community/committee), preferably
on the [Slack #DSC channel](http://localhost:1313/community/contact/), if
you need a new empty repository or if you want to transfer an existing
repository.

### Understand the coding workflow

The normal workflow is as follows:

1. [Remove old dependencies](#remove-old-dependencies)
1. [Resolve dependencies](#resolve-dependencies)
1. [Build module](#build-module)
1. [Test module](#test-module)

#### Remove old dependencies

This is only for you that have previously contributed to a repository
and might have a previous local repository folder.

The file `.gitignore` included an entry `DscResource.Tests` which means
that there might be a folder in your local repository folder with that
name. That folder is no longer used and will give you trouble if it is
still present.

1. Remove the folder `DscResource.Tests` inside your local repository
   folder.

#### Resolve dependencies

Pay attention to any new code merged into the `main` branch of an official repository.
If this occurs, you will need to pick up these changes in your fork using the rebase
instructions in our [guide to getting started with GitHub](GettingStartedWithGitHub.md).

This needs to be repeated each time changes are made to the file
`RequiredModules.psd1`, or if there are new releases of external modules
listed in the file `RequiredModules.psd1`.

>**NOTE:** If script execution is restricted this needs to be run before
>resolving dependencies. It changes execution policy to allow scripts to run.
>```
>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
>```

Running the command below will make sure the dependencies are resolved and to
prepare the build and test environment. All dependencies are downloaded and
saved in the project's `output` folder. There are normally no changes to
the contributors machine with one exception. If the NuGet package
provider is not installed, required by the _PowerShellGet_ module, it will
be installed. The only way to avoid this is to manually install the package
provider (for example by downloading any package from _PowerShell Gallery_)
prior to running this command. If the Nuget package provider is not installed
it will be installed in the current user's scope when the following command
is run.

```powershell
.\build.ps1 -ResolveDependency -Tasks noop
```

>**KNOWN ISSUE 1:** If the project is dependent on pre-releases and the error
>`Find-Module: A parameter cannot be found that matches parameter name
>'AllowPrereleaseVersions'` is thrown, restart the _Windows PowerShell_
>session and run the command again. This is due to the old version of
>module _PackageManagement_ still being imported into the session (even when
>we remove it) so _PowerShellGet_ calls the wrong version of the command
>`Find-Package`.

>**KNOWN ISSUE 2:** There is currently a known issue with this task when
>moving between local DSC repositories in the same PowerShell session. If
>you have resolved dependencies in one repository, then move to a second
>repository and resolve dependencies all dependencies do not download
>(for example the module PowerShell-Yaml). This is because the module is
>already imported into the session. The workaround is to open each local
>DSC repository folder in separate PowerShell sessions.

#### Build module

This builds the module after which tests can be run on the built
module. The built module will have the same structure as the one that is
released.

**This must be run each time changes have been made to files in the source**
**folder.**

```powershell
.\build.ps1 -Tasks build
```

>The application GitVersion is used in the pipeline to determine
>the next version if it is installed. If `gitversion` is not installed
>then the build version will always be reported as `0.0.1`.
>To install GitVersion see [install GitVersion](/guidelines/getting-started#install-gitversion)

#### Test module

See [Testing Guidelines](/guidelines/testing-guidelines/) for more
information on how to run tests.

#### Knowledge base

##### Error `cannot find "s.psd1"`

###### Cause 1

This has been known to happen in the CI build pipeline when running in
Azure DevOps. This is because the build pipeline cannot find or resolve
the correct module manifest, so it tries to be smart and trying to resolve
the module name based on the root project folder path which is `s`.

Make sure the module manifest is in the correct location, can be imported.

###### Cause 2

This can also happen when the module *ModuleBuilder* is not pinned to
version `1.0.0` in the file `RequiredModules.psd1`.

##### Error `Missing property 'ProjectName'`

Verify that the module manifest resolves with the cmdlet `Test-ModuleManifest`
and does not return any errors. Make sure it resolves correctly **in both**
**Windows PowerShell and PowerShell Core**. The build is running on Linux
in the ci pipeline.

##### Error `Cannot process argument transformation on parameter 'ProjectName'`

If the old test framework folder `DscResource.Tests` is present in the local
repository folder then the build will fail with this error. The reason is that
build pipeline searches for `*.psd1` files and want to use the first module
manifest it finds which when the folder `DscResource.Tests` is present is the
wrong one.

##### Issue with preview strings containing a dash

There are a issue with ModuleBuilder using preview strings
using dash, e.g. `fix0008-9`. The string is compliant with SemVer 2.0
but there is a bug in `Publish-Module` that prevents the module to be
released.

Make sure to pin the ModuleBuilder to version `1.0.0` in the file
`RequiredModules.psd1`.

### Attach your fork to a free Azure DevOps organization

We are moving to Azure DevOps because Azure Pipelines gives us better
services on a free plan that can be created by all contributors for open
source projects. For example, it gives us longer run time per job (currently
6 hours) plus the ability to run parallel jobs.

Adding your fork to a free Azure DevOps organization means that when you
push a working branch to your fork, and it will be tested the same way as
when you send in a PR.

>This is similar to what the upstream repository is using to run CI pipeline,
>it is using the https://dev.azure.com/dsccommunity organization.

This can be used to test that everything works as expected before sending
in a PR. It can also be used to start a test run that takes a long time without
having the development environment powered on. Just commit and push the changes
and the Azure Pipelines will run the CI for you.

1. Push the working branch to your fork if you have not done so already.
   We will need it for the next step.
1. Create a free Azure DevOps organization at https://azure.microsoft.com/services/devops/
1. Install the GitVersion task
   1. Go to the https://dev.azure.com/{organization}/_settings/extensions and
      browse the marketplace and search for *GitVersion*.
1. Create a new project with the same name as the *GitHub repository name**,
   make sure to set visibility to **public**.
1. In the new project under Pipelines, create a new pipeline and choose
   GitHub as where the source resides, choose the fork of the repository,
   e.g. johlju/SqlServerDsc. You will need to authenticate Azure DevOps
   with GitHub, and when it asks to install the Azure Pipelines GitHub app
   you can choose to install it for all and future repositories or just
   specific ones.
2. Once back in Azure Pipelines choose *Existing Azure Pipelines YAML file*
   and then select `azure-pipelines.yml` by browsing the branch you
   recently pushed above.
3. On the box that says *Run*, instead just choose *Save* in the drop-down list.
4. Overrides the continuous integration trigger by clicking on 'Edit' where
   you see the YAML file.
5. Click on the three dots to get the sub-menu and to show the menu item 'Triggers'.
   1. Once in Triggers pane, under *Continuous Integration* click the checkbox
      *Override the YAML continuous integration trigger from here*, and then
      change the *Branch specification* to `*` (asterisk).
   2. Under *Save & queue* in the drop-down menu choose *Save*.
6. Go back to the new pipeline and on the pane *Runs* click *Run pipeline*.
   1. For the *Branch/tag* choose the branch you just pushed, and leave
      *Commit* blank (to run the last the commit).
   2. Click on *Run*.

Next time you push a commit to a branch in your fork, the Azure Pipeline
will trigger on that and start a run.

>**NOTE:** Even if we chose the `azure-pipelines.yml` file from the working
>branch in the previous steps that specific `azure-pipelines.yml` file
>will not always be used, instead the `azure-pipelines.yml` file from the
>branch (or the commit) being run in the pipeline will be used. So if you
>make changes to the file `azure-pipelines.yml` those changes will be
>reflected when you run the pipeline.

### Resolve merge conflicts

If another pull request is merged while yours is in review, you will need
to add those new changes into your working branch before your pull request
is allowed to merge. To do this we will 'rebase' the branch. This means that
the changes you made in your working branch for your pull request will be
'replayed' on top of the changes that were recently merged into `main`, as
though you originally created your branch/fork from the current point that
the `main` branch is at.

_Note: Since it's replayed you might get conflicts several times during the_
_rebase process (for the first `rebase` command, and for each following_
_`rebase --continue`)._

Here are the steps to rebase your branch:

1. Rebase the local `main` branch from the base `main` branch.
1. Resolve merge conflicts.
1. Rebase your working branch.
1. Resolve merge conflicts.
1. Update your pull request.

>Note: These steps assumes that you have added the remote as described above.
>Run `git remote -v` to verify that you have the remote name `my` pointing to your
>fork repository, and remote name `origin` pointing to the upstream repository.
>If your remotes are named differently, then change the remote names
>accordingly.

#### 1. Rebase the local branch `main` from the base branch `main`

In a PowerShell prompt, you need to do the following:

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\ComputerManagementDsc
git checkout main                 # Checkout (move) to your local main branch.
git fetch origin main             # Get all changes from origin/main (and branch information).
git rebase origin/main            # Rebase changes from origin/main into your local main branch.
```

>**Note:** If you used the **main branch as your working branch**, then at
>this point you will probably get merge conflicts that need to be resolved.
>Search for the word 'CONFLICT' in the output. If you used `main` as your working
>branch, you can skip to step 3 to learn how to resolve the merge conflicts.

Force push to your fork's `main` branch to your forked repository.
_Make sure there were no conflicts before running this command._

```plaintext
git push my main --force
```

#### 2. Rebase your working branch

In a PowerShell prompt, you need to do the following:

```plaintext
cd <path to cloned repository>      # This is the path to your cloned repository. I.e. cd C:\Source\ComputerManagementDsc.
git checkout <your PR branch>       # Checkout (move) to your working branch, i.e git checkout awesome_feature.
git rebase my/main                # This will rebase your working branch from your forks main branch.
```

**NOTE! At this point you will most likely get merge conflicts that need to be
resolved before you continue with the next step. Search for the word 'CONFLICT'
in the output. See step 3 to learn how to resolve the merge conflicts.**

#### 3. Resolve merge conflicts

If you get the following message:

```plaintext
Auto-merging README.md
CONFLICT (content): Merge conflict in README.md
error: Failed to merge in the changes.
```

Then you have encountered a merge conflict. To resolve merge conflicts, take a look at the following articles:

- [Resolve a merge conflict from the command line](https://help.github.com/articles/resolving-a-merge-conflict-from-the-command-line/)
- [Beginners guide to GitHub merging a pull request](https://github.blog/developer-skills/github-education/beginners-guide-to-github-merging-a-pull-request/)

In the following example, there is a merge conflict in the `README.md` file:

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
>>>>>>> my/main

### 1.8.0.0
...
```

To fix the issue, you need to manually open the file in your favorite editor. In the above example, you can clearly see the seven equals signs what is incoming:

- Above the equal characters `========` is what is currently in the `README.md`.
- Below the equal characters `========` is the incoming change from the current commit being replayed.

To resolve this we have to manually change this section. The file can be changed
in any way you need to solve the conflict.

_Note: You must remove the lines `<<<<<<< HEAD`, `========` and `>>>>>>> origin/main`._

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

When you are happy with the file, save it. If there are more merge conflicts, resolve them in the same way.

_Note: Only when all merge conflicts are resolved, rebase can be performed_

To continue with the rebase. In the same PowerShell prompt as you started the
rebase, you need to do the following:

```plaintext
git status            # (optional) If you unsure of the name, you can use this to see the files that was in conflict.
git add <file>        # Do this for each file that you fixed merged conflicts in. I.e 'git add README.md'. This stages the file for commit. You could also use 'git add *' to stage all files at once.
git rebase --continue
```

**You may now get more merge conflicts.** If so, then you have to resolve those
again. Repeat the same procedure as before for these new conflicts.
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
branch to a new working branch in your fork. Once you have created a new working
branch with the original contributors changes,
then you can create a new pull request into the original repository.
It's important that when you create a new pull request from someone else's work,
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

1. Now we rebase again, this time against `my/main` (which should already be rebased
   against `origin/main`, see section Resolving merge conflicts on how to do that).

   ```plaintext
   git rebase `my/main`
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

1. Now, go to your forked repository on GitHub and create the pull request the
  normal way.

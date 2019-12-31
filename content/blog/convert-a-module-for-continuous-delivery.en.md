---
title: "Steps to convert a module for continuous delivery"
date: 2019-12-30T12:52:00+01:00
type: "post"
draft: false
author: johlju
---

Any comments around this blog entry are welcomed and to be submitted on
the [Gist](https://gist.github.com/johlju/2ad77aa574aa07d3e9953fe86007731c).

>**NOTE:** The build is running on Linux in the CI pipeline to be able to
>support cross-platform DSC resources, so that makes all paths case-sensitive!
>Have that in mind when updating paths and folders in the configuration
>files. Make sure they match the repository, or change the repository file
>and folder names).

We are moving away from AppVeyor to Azure DevOps because Azure Pipelines
gives us longer run time per job plus parallel jobs on a free account (for
open source projects).

Also, we are no longer requiring signing of CLA since the modules are
now part of DSC Community.

## Prepare repository for automatic releases

This will prepare the old releases to look like the new automatic releases
that will be done once a repository has been converted. For example the
tags will help `GitVersion`  to determine the next version, and the
GitHub Releases is to connect each tag with a GitHub Release and update
the release notes for that release.

### Re-create all old tags

You can use the script [Convert-GitTagForDsc.ps1](https://gist.github.com/PlagueHO/40d80a7f3747c18594e63584f7745cbc)
to re-create all existing tags. You run it with the following.

```powershell
# Move to the local repo
cd c:\source\{repositoryFolder}

# Make sure you have the remote names to upstream and fork.
git remote -v

# Get latest changes so we get all commits that the tags uses
git checkout master
git fetch origin master # origin is the remote pointing to upstream DSC Community repository.
git rebase origin/master
git push my master --force # my is the remote pointing to fork

<#
    Remote - remote name to your fork
    Upstream - remote name to the upstream DSC Community repository.
    DeleteOldTags - will remove the old tags.

    You can run it with parameter WhatIf to see what it will do.
#>
Convert-GitTagForDsc -DeleteOldTags -Remote 'my' -Upstream 'origin' -Verbose
```

### Make sure all previous releases has tags

Make sure all the previous releases to PowerShell Gallery has tags.
If there are any tags missing then create those tags.

>**NOTE:** At least the latest (newest) release **MUST** have a tag in the
>new format, otherwise GitVersion will not evaluate the versions correctly.
>
>If there are no missing tags, then you **MUST** re-create the
>last tag so that it is using semantic versioning and the correct format for
>the tag. See article [How To Delete Local and Remote Tags on Git](https://devconnected.com/>how-to-delete-local-and-remote-tags-on-git/).
>If you ran the script in the previous section this have probably been
>resolved already.

1. **Make sure to have updated the repository with the latest changes and**
   **pulled latest tags, see previous section for the rebasing.**
1. Run `git tag`. Compare the tags reported by `git tag` and the actual
   releases in the change log and or the PowerShell Gallery.
1. Run the following **on master branch** `git log --pretty=oneline`
   and search up the SHA for each release commit (the description could be
   something like `Merge pull request #xxxx from PowerShell/dev`).
1. For each SHA run the following (in release ascending order). The
   following shows how to tag `v13.1.0` on the specific
   commit and adding a descriptive text on the tag.
   ```bash
   git tag -a v13.1.0 596ff25a61099b312a6f9e2eb2c6dccc9597ac28 -m "Release of version 13.1.0.0 of {RepositoryName}"
   ```
1. Running `git tag` should list the new tags, and running `git show v13.1.0`
   would show a specific tag.
1. Push the new tags to the upstream repository by running.
   ```bash
   git push origin --tags # origin is the remote pointing to upstream
   git push my --tags # my is the remote pointing to fork
   ```

### (Optional) Create GitHub Releases for all releases

For each tag in GitHub create a GitHub release by copying the corresponding
change log entries to the release notes of the GitHub release.

1. Browse to the tags on GitHub, e.g. https://github.com/dsccommunity/SqlServerDsc/tags
1. Browse to the _oldest_ tag.
1. Start creating GitHub Releases in ascending order. Easiest it to click
   on a tag in GitHub releases section, then click 'Edit tag'. For 'Release title'
   write the version number, e.g. `v13.2.0` and in the description block
   paste in the change log entries.

## Install prerequisites

>**NOTE:** You must be an elevated administrator to install this.

1. Install GitVersion using Chocolatey by running the below. Read more
   about GitVersion on the their website https://gitversion.readthedocs.io/en/latest/
   *NOTE: You must have Chocolatey installed prior to running this command,*
   *see https://chocolatey.org/install on how to install Chocolatey.*
   ```bash
   choco install GitVersion.Portable
   ```

## Create a new working branch

Create a new working branch based on dev branch.

```bash
cd c:\source\{respoistoryName}
git checkout dev
git fetch origin dev # origin is the remote pointing to upstream
git rebase origin/dev
git push my dev --force # my is the remote pointing to fork
git checkout -b add-new-ci
```

Suggest adding commits to this working branch as necessary when changing
files in each section.

## Change repository folder structure

We must change the folder structure because that is a prerequisites for
the build and automatic release.

>**NOTE:** The source folder could also have the same name as the module
>name, e.g. `SqlServerDsc`, or named `src` or `source`. We choose to use
>'source' to clearly show that it is the source code, and easier to
>understand when mentioning the *source folder* in conversations.
>We also use lower-case to in the root folders to be compatible with
>future cross-plattform DSC modules or DSC resource in the DSC module.

1. Create a folder in the root of the repo with the (lower-case) name
   `source`. This new folder will from now be referenced to as the
   *source folder*.
1. Move the following folders into the source folder (if they exist).
   - DSCResources
   - Examples
   - Modules
1. Rename the folder `Tests` to lower-case `tests`.
   ```bash
   git mv Tests tests2
   git mv tests2 tests
   ```
1. Remove DscResource.Tests from the local repository if it was previously
   cloned.
1. Move the module manifest, e.g. `SqlServerDsc.psd1` into the source
   folder. Overwrite any current file.
1. Remove the file `.codecov.yml`.
1. Remove the file `appveyor.yml`. **Please make a note of anything specific**
   **in this file meant to help run tests, like installation of features**
   **etcetera. You need to add it to the new pipeline later.**

## Add CI pipeline configuration files

1. Run the following to get a base files that we use to covert the module.
   Change the destination path to something suitable. Make sure to choose
   the full template, and to use `source` as the source folder.
   The folder that is created will be referenced as the *base folder* .
   ```powershell
   install-Module sampler -Scope CurrentUser
   $sampler = Import-Module -Name Sampler -PassThru
   Invoke-Plaster -TemplatePath (Join-Path $Sampler.ModuleBase 'Templates/Sampler') -Destination C:\Temp\TemplateModule
   ```
1. Copy the following files from the base folder to the root of the repository.
   - `.markdownlint.json`
   - `build.ps1`
   - `build.yaml`
   - `Resolve-Dependency.ps1`
   - `Resolve-Dependency.psd1`
   - `RequiredModules.psd1`
   - `GitVersion.yml`
   - `azure-pipelines.yml`
   - `CODE_OF_CONDUCT.md`
1. Copy the following file from the base folder `./source/build.psd1`
   into the source folder. *This file will not be needed once the*
   *ModuleBuilder module resolves a pending issue.*
1. Copy the following folder from the base folder `./source/en-US`
   into the source folder.

## Update repository and module files

### File `.gitignore`

1. Remove and entry of `DscResource.Tests` and `node_modules` from the
   file `.gitignore`
1. Add `output/` to the .gitignore file.

### Module manifest

Change the module manifest in the source folder, e.g. `SqlServerDsc.psd1`.

1. Remove the release notes from the module manifest by changing the
   release notes property to `ReleaseNotes = ''`.
1. Replace the module version in the module manifest to make it more clear
   that the module version is just updated by the CI pipeline. Set the
   module version to `0.0.1`. *The module version is controlled by GitVersion*
   *and the GitVersion.yml that we get back to later.*
1. Add the property `Prerelease` with an empty string value to the `PSData`
   section. *Note: This must be done so that the pipeline will be able to*
   *release preview builds.*
   ```powershell
   PrivateData = @{
       PSData = @{
           # Set to a prerelease string value if the release should be a prerelease.
           Prerelease = ''

           ...
       }
   }
   ```
1. Change author to `DSC Community`
1. Change company name to `DSC Community`
1. Change copyright notice to `Copyright the DSC Community contributors. All rights reserved.`
1. Having the export properties set to `'*'` is not optimal. Update or
   add the export properties to optimize discovery. *If any of these are*
   *already exporting objects then leave that export property as is.*
   ```powershell
   # Functions to export from this module
   FunctionsToExport = @()

   # Cmdlets to export from this module
   CmdletsToExport = @()

   # Variables to export from this module
   VariablesToExport = @()

   # Aliases to export from this module
   AliasesToExport = @()
   ```
1. (Optional) Add the property `DscResourcesToExport` with an array of all the resources
   in the module. *Having this removes a warning from the cmdlet `Publish-Module`*.
   ```powershell
   DscResourcesToExport = @(
       'Resource1'
       'Resource2'
       'Resource3'
   )
   ```
1. Add DSC Community logo as an icon to the module manifest
   ```powershell
   PrivateData = @{
       PSData = @{
          IconUri = 'https://dsccommunity.org/images/DSC_Logo_300p.png'

          ...
       }
   }
   ```
1. Update the property `LicensUri` and `ProjectUri` replacing `\PowerShell\`
   with `\dsccommunity\`. E.g.
   ```powershell
   PrivateData = @{
       PSData = @{
        ...
        LicenseUri = 'https://github.com/dsccommunity/SqlServerDsc/blob/master/LICENSE'

        ProjectUri = 'https://github.com/dsccommunity/SqlServerDsc'
        ...
       }
   }
   ```

### File `README.md`

1. Remove the entire `Branches` section of the file `README.md` (if it exists).
1. Add the status badges to the top of the README.md, just under the
   module name section.
   >**Note:** To get the definition id, browse to the pipeline in
   >the DSC Community Azure DevOps organization and look in the URL, e.g.
   >https://dev.azure.com/dsccommunity/xFailOverCluster/_build?definitionId=5&_a=summary
   >**You have to get back to this once the pipeline is configured!**
   ```markdown
   ## SqlServerDsc

   [![Build Status](https://dev.azure.com/dsccommunity/{repositoryName}/_apis/build/status/dsccommunity.{repositoryName}?branchName=master)](https://dev.azure.com/dsccommunity/{repositoryName}/_build/latest?definitionId={definitionId}&branchName=master)
   ![Azure DevOps coverage (branch)](https://img.shields.io/azure-devops/coverage/dsccommunity/{repositoryName}/{definitionId}/master)
   [![Azure DevOps tests](https://img.shields.io/azure-devops/tests/dsccommunity/{repositoryName}/{definitionId}/master)](https://dsccommunity.visualstudio.com/{repositoryName}/_test/analytics?definitionId={definitionId}&contextType=build)
   [![PowerShell Gallery (with prereleases)](https://img.shields.io/powershellgallery/vpre/{repositoryName}?label={repositoryName}%20Preview)](https://www.powershellgallery.com/packages/{repositoryName}/)
   [![PowerShell Gallery](https://img.shields.io/powershellgallery/v/{repositoryName}?label={repositoryName})](https://www.powershellgallery.com/packages/{repositoryName}/)
   ```
1. Replace the text referencing the code of conduct with this new section
   instead.
   ```markdown
   ## Code of Conduct

   This project has adopted this [Code of Conduct](CODE_OF_CONDUCT.md).
   ```
1. Add a *Releases* section after the *Code of Conduct* section.
   ```markdown
   ## Releases

   For each merge to the branch `master` a preview release will be
   deployed to [PowerShell Gallery](https://www.powershellgallery.com/).
   Periodically a release version tag will be pushed which will deploy a
   full release to [PowerShell Gallery](https://www.powershellgallery.com/).
   ```
1. Update the *Contributing* section to. Add the section under the *Releases*
   if it does not exist.
   ```
   ## Contributing

   Please check out common DSC Community [contributing guidelines](https://dsccommunity.org/guidelines/contributing).
   ```
1. Change any URLs pointing to examples (`[...](/Examples/Resources/...)`) to the
   correct path `[...](/source/Examples/Resources/...)`
1. Change any URLs pointing to `https://github.com/PowerShell/...` to
   `https://github.com/dsccommunity/...`.

### File `CHANGELOG.md`

>**NOTE:** Build pipeline uses the format of [keep a changelog](https://keepachangelog.com/en/1.0.0/)
>so we need to change the changelog accordingly.

1. Update the Unreleased section of the CHANGELOG.md to use the new format,
   or copy the CHANGELOG.md from the base folder if the old change log does
   not need to be retained. *The example change log below is somewhat*
   *changed from the CHANGELOG.md in base folder.
   ```markdown
   # Change log for SqlServerDsc

   The format is based on and uses the types of changes according to [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
   and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

   ## [Unreleased]

   ### Added

   - SqlServerDsc
     - Added automatic release with a new CI pipeline.

   ### Changed

   - SqlServerDsc
     - Add .gitattributes file to checkout file correctly with CRLF.
     - Updated .vscode/analyzersettings.psd1 file to correct use PSSA rules
       and custom rules in VS Code.
     - Fix hashtables to align with style guideline ([issue #1437](https://github.com/dsccommunity/SqlServerDsc/issues/1437)).
   - SqlServerMaxDop
     - Fix line endings in code which did not use the correct format.

   ### Deprecated

   - None

   ### Removed

   - None

   ### Fixed

   - None

   ### Security

   - None
   ```
1. (Optional) Update old entires in the change log to match the new
   change log format, see example in the Sampled repository
   https://github.com/gaelcolas/Sampler/blob/master/CHANGELOG.md.
   You can get the date for each tag (release) by running this, or
   check releases in the PowerShell Gallery.
   ```bash
   git log --tags --simplify-by-decoration --pretty="format:%ai %d"
   ```
   Example of log entry
   ```markdown
   ## [13.2.0.0] - 2019-09-18

   ### Changed

   - Changes to SqlServerDsc
     - Fix keywords to lower-case to align with guideline.
     - Fix keywords to have space before a parenthesis to align with guideline.
     - Fix typo in SqlSetup strings ([issue #1419](https://github.com/dsccommunity/SqlServerDsc/issues/1419)).
   ```
1. **IMPORTANT!** The release notes in the PowerShell Module manifest cannot
   exceed 10000 characters. Due to a bug in the CI deploy pipeline this is
   not yet handled automatically. One solution is to temporary move older
   entries to another file, e.g. `HISTORIC_CHANGELOG.md` to keep the
   change log shortened.
   ```markdown
   # Historic change log for SqlServerDsc

   The release notes in the PowerShell Module manifest cannot exceed 10000
   characters. Due to a bug in the CI deploy pipeline this is not handled.
   This file is to temporary move the older change log history to keep the
   change log short.

   ## [1.13.0.0] - 2019-09-19
   ...
   ```

### File `.github/PULL_REQUEST_TEMPLATE.md`

Make sure this file is updated to reflect having a CHANGELOG.md. The
following is a proposed file but can changed to reflected other needs.

```markdown
<!--
    Thanks for submitting a Pull Request (PR) to this project.
    Your contribution to this project is greatly appreciated!

    Please prefix the PR title with the resource name,
    e.g. 'ResourceName: My short description'.
    If this is a breaking change, then also prefix the PR title
    with 'BREAKING CHANGE:',
    e.g. 'BREAKING CHANGE: ResourceName: My short description'.

    You may remove this comment block, and the other comment blocks, but please
    keep the headers and the task list.
-->
#### Pull Request (PR) description
<!--
    Replace this comment block with a description of your PR.
    Also, make sure you have updated the CHANGELOG.md, see the
    task list below. An entry in the CHANGELOG.md is mandatory
    for all PRs.
-->

#### This Pull Request (PR) fixes the following issues
<!--
    If this PR does not fix an open issue, replace this comment block with None.
    If this PR resolves one or more open issues, replace this comment block with
    a list of the issues using a GitHub closing keyword, e.g.:

- Fixes #123
- Fixes #124
-->

#### Task list
<!--
    To aid community reviewers in reviewing and merging your PR, please take
    the time to run through the below checklist and make sure your PR has
    everything updated as required.

    Change to [x] for each task in the task list that applies to your PR.
    For those task that don't apply to you PR, leave those as is.
-->
- [ ] Added an entry to the change log under the Unreleased section of the
      file CHANGELOG.md. Entry should say what was changed and how that
      affects users (if applicable), and reference the issue being resolved
      (if applicable).
- [ ] Resource documentation added/updated in README.md.
- [ ] Resource parameter descriptions added/updated in README.md, schema.mof
      and comment-based help.
- [ ] Comment-based help added/updated.
- [ ] Localization strings added/updated in all localization files as appropriate.
- [ ] Examples appropriately added/updated.
- [ ] Unit tests added/updated. See [DSC Community Testing Guidelines](https://dsccommunity.org/guidelines/testing-guidelines).
- [ ] Integration tests added/updated (where possible). See [DSC Community Testing Guidelines](https://dsccommunity.org/guidelines/testing-guidelines).
- [ ] New/changed code adheres to [DSC Community Style Guidelines](https://dsccommunity.org/styleguidelines).
```

### File `.github/ISSUE_TEMPLATE/Problem_with_resource.md`

Change the last line to the following, removing the sentence within the
parenthesis.

```markdown
#### Version of the DSC module that was used
```

### File `CONTRIBUTING.md`

If this file does not exist, please create it as GitHub uses it in various
locations. Change the contents of the file to the following.

```markdwon
# Contributing

Please check out common DSC Community [contributing guidelines](https://dsccommunity.org/guidelines/contributing).
```

### Other repository files

1. Remove the file `.MetaTestOptIn.json` since it is no longer used.
   *We opt-in to everything by default, to opt-out see the section on*
   *testing.*
1. Change the copyright notice in the LICENSE file to
   `Copyright (c) DSC Community contributors.`
1. Update the contents of the conceptual help file under `./source/en-US`
   to describe the module. Change as necessary, like module name. E.g.
    ```plaintext
    TOPIC
        about_{RepositoryName}

    SHORT DESCRIPTION
        DSC resources for deployment and configuration of {Product Name}.

    LONG DESCRIPTION
        This module contains DSC resources for deployment and configuration of {Product Name}.

    EXAMPLES
        PS C:\> Get-DscResource -Module {RepositoryName}

    NOTE:
        Thank you to the DSC Community contributors who contributed to this module by
        writing code, sharing opinions, and provided feedback.

    TROUBLESHOOTING NOTE:
        Go to the Github repository for read about issues, submit a new issue, and read
        about new releases. https://github.com/dsccommunity/{RepositoryName}

    SEE ALSO
    - https://github.com/dsccommunity/{RepositoryName}

    KEYWORDS
        DSC, DscResource, {productTag}
    ```

## Configure CI build pipeline

### File `build.yaml`

1. Uncomment the folder `Modules` if the folder exist under the source folder,
   or if there are any helper modules (which need to be moved to the `Modules`
   folder).
   ```yaml
   CopyDirectories:
     - Modules
   ```
1. (Optional) Clear out any commented rows *(they can always be found in the*
   *template if they are needed in the future)*.

### File `RequiredModules.psd1`

1. If there are any prerequisites modules needed for examples or integration
   tests (not counting the actual module being tested) those need to be
   added to the file `RequiredModules.psd1`. **We need to pin the version**
   **we should use for both an example and an integration tests.**
   >**NOTE:** We must pin the version due to how the DSC resource modules
   >are detected when configuration files are compiled. If we do not pin
   >versions the CI pipeline will se duplicate modules due to the folder
   >structure the CI pipeline is using when building the pipeline.
   >E.g. paths used `\output\;\output\RequiredModules`.
   ```powershell
   # Prerequisites modules needed for examples and integration tests of
   # the SqlServerDsc module.
   PSDscResources = '2.12.0.0'
   StorageDsc     = '4.9.0.0'
   NetworkingDsc  = '7.4.0.0'
   ```

### File `GitVersion.yml`

1. Update the key `next-version` to the next minor version (using semantic
   versioning). This version is from where `gitversion` tries to evaluate
   version. For example if the latest release was `13.2.0` (or `13.2.0.0`)
   then set `next-version` to `13.3.0`.

>**BE AWARE:** If the last version released was `13.2.0` and you want to
>raise the major version to `14.0.0` you **cannot** set `next-version` to
>`14.0.0`. If you want next released version to be `14.0.0` then set
>`next-version` to `13.3.0` and then add a commit with the word `breaking`
>or `major` in the commit message.

## Update helper modules

If there are any helper modules then move those to the `Modules` folder
under the source folder (and change the code accordingly). Then for each
helper module these steps should be done.

1. Remove the `Export-ModuleMember` cmdlet from the module script file.
1. Any helper module is required to have a module manifest.
   Create one using `New-ModuleManifest`, e.g.
   ```powershell
   # Need the full path to work with WriteAllText().
   $manifestFile = 'C:\source\{repositoryFolder}\source\Modules\{ModuleName}\{ModuleName}.psd1'

   New-ModuleManifest -Path $manifestFile `
       -Author 'DSC Community' `
       -CompanyName 'Dsc Community' `
       -Copyright 'Copyright the DSC Community contributors. All rights reserved.' `
       -Description 'Functions used by the DSC resources in SqlServerDsc.'

   # Converts the file to UTF-8 (without BOM)
   $content = Get-Content -Path $manifestFile -Encoding 'Unicode' -Raw
   [System.IO.File]::WriteAllText($manifestFile, $content, [System.Text.Encoding]::ASCII)
   ```
1. Change the manifest to add this. **Make sure to export the**
   **functions from the helper module, and that it DOES NOT export `'*'`!**
   ```powershell
   @{
       RootModule = '{ModuleName}.psm1'

       # Semantic version number of this module.
       ModuleVersion     = '1.0.0'

       FunctionsToExport = @(
           'New-InvalidArgumentException',
           'New-InvalidOperationException',
           'New-ObjectNotFoundException',
           'New-InvalidResultException',
           'Get-LocalizedData'
       )

       CmdletsToExport = @()

       VariablesToExport = @()

       AliasesToExport = @()
   }
   ```

## Update examples

If an example uses an external module in the configuration then that module
must use a pinned version. The pinned version must be the same version that
was pinned in the file `RequiredModules.psd1` (or make sure to pin the same
version there too). Example of pinning a version in the configuration file.

```powershell
Import-DscResource -ModuleName 'PSDscResources' -ModuleVersion '2.12.0.0'
Import-DscResource -ModuleName 'StorageDsc' -ModuleVersion '4.9.0.0'
```

## Resolve build dependencies

This requires that all steps above have been done. Running this command
will make sure the dependencies are resolved and prepare the build
environment.

This must be run each time changes are made to the file `RequiredModules.psd1`,
or if there are new releases of external modules listed in the file
`RequiredModules.psd1`.

>**NOTE:** This does not install anything, it downloads the prerequisites
>into the `output` folder.

```powershell
.\build.ps1 -ResolveDependency -Tasks noop
```

## Run a build

This builds the module after which for example tests can be run on the built
module. The built module will look the same as the one that is release.
`GitVersion` is used to determine the next version if it is installed.

**This must be run each time changes have been made to files in the source**
**folder.**

```powershell
.\build.ps1 -Tasks build
```

## Examples files (if publishing to Gallery)

For examples that are published to the Gallery the *Script File Information*
section need to be changed. This script must be run after the build task
have been run because it needs to resolve the modules in a `$PSModulePath`.

**Update parameter `Version` as needed.**

>**NOTE:** The cmdlet `Update-ScriptFileInfo` needs to be able to resolve
>modules. If an example is dependent on other modules, e.g. PSDscResources,
>they need to be present in a `$PSModulePath`. If not you will get a parse
>error. Dependent modules should have already been pinned in the file
>`RequiredModules.psd1` and in each example file.

```powershell
$moduleName = '<repositoryName>'
Get-ChildItem -Path '.\source\Examples' -Filter '*.ps1' -Recurse | % {
    Update-ScriptFileInfo -Path $_.FullName `
        -Version '1.0.1' `
        -Author 'DSC Community' `
        -CompanyName 'DSC Community' `
        -Copyright 'DSC Community contributors. All rights reserved.' `
        -LicenseUri "https://github.com/dsccommunity/$moduleName/blob/master/LICENSE" `
        -ProjectUri "https://github.com/dsccommunity/$moduleName" `
        -ReleaseNotes 'Updated author, copyright notice, and URLs.' `
        -IconUri 'https://dsccommunity.org/images/DSC_Logo_300p.png'
}
```

## Prepare the module to use the CI test pipeline

### File `build.yaml`

1. From the `test:` task, remove the activity `hqrmtest`.
1. Under the key `Pester` update the key `Script` to this.
   ```yaml
   Script:
     - tests/Unit
   ```
1. Under the key `Pester` remove all the items from the key `ExcludeTag`.
   Remove these:
   ```markdown
   - helpQuality
   - FunctionalQuality
   - TestQuality
   ```

### Update unit tests

From all unit tests remove the header that was part
of the previous test framework. Everything between and including
`#region HEADER` and `#endregion HEADER`. Replace it with the following
code, add the code inside the function `Invoke-TestSetup`. Also update
the function `Invoke-TestCleanup`. Make sure the `Invoke-TestSetup` is
called outside the `try`-block.

```powershell
function Invoke-TestSetup
{
    try
    {
        Import-Module -Name DscResource.Test -Force
    }
    catch [System.IO.FileNotFoundException]
    {
        throw 'DscResource.Test module dependency not found. Please run ".\build.ps1 -Tasks build" first.'
    }

    $script:testEnvironment = Initialize-TestEnvironment `
        -DSCModuleName $script:dscModuleName `
        -DSCResourceName $script:dscResourceName `
        -ResourceType 'Mof' `
        -TestType 'Unit'
}

function Invoke-TestCleanup
{
    Restore-TestEnvironment -TestEnvironment $script:testEnvironment
}

Invoke-TestSetup

try
{
    InModuleScope $script:dscResourceName {
        # All tests goes here
    }
}
finally
{
    Invoke-TestCleanup
}
```

### Update integration tests

From all integration tests remove the header that was part
of the previous test framework. Everything between and including
`#region HEADER` and `#endregion HEADER`. Replace it with the following
code. Make sure to change the parameter of the cmdlet `Restore-TestEnvironment`
at the end of the file too.

```powershell
try
{
    Import-Module -Name DscResource.Test -Force
}
catch [System.IO.FileNotFoundException]
{
    throw 'DscResource.Test module dependency not found. Please run ".\build.ps1 -Tasks build" first.'
}

$script:testEnvironment = Initialize-TestEnvironment `
    -DSCModuleName $script:dscModuleName `
    -DSCResourceName $script:dscResourceName `
    -ResourceType 'Mof' `
    -TestType 'Integration'
```

Change the parameter of the cmdlet `Restore-TestEnvironment` at the end
of the file.

```powershell
finally
{
    Restore-TestEnvironment -TestEnvironment $script:testEnvironment
}
```

If an integration tests uses an external module in the configuration then
that module must use a pinned version. The pinned version must be the same
version that was pinned in the file `RequiredModules.psd1` (or make sure to
pin the same version there too). Example of pinning a version in the
configuration file.

```powershell
Import-DscResource -ModuleName 'PSDscResources' -ModuleVersion '2.12.0.0'
Import-DscResource -ModuleName 'StorageDsc' -ModuleVersion '4.9.0.0'
```

### Unit tests for helper modules

For any helper modules, add this to each unit test (and remove any
other code that imported the helper module previously).

```powershell
#region HEADER
$script:projectPath = "$PSScriptRoot\..\.." | Convert-Path
$script:projectName = (Get-ChildItem -Path "$script:projectPath\*\*.psd1" | Where-Object -FilterScript {
        ($_.Directory.Name -match 'source|src' -or $_.Directory.Name -eq $_.BaseName) -and
        $(try { Test-ModuleManifest -Path $_.FullName -ErrorAction Stop } catch { $false })
    }).BaseName

$script:parentModule = Get-Module -Name $script:projectName -ListAvailable | Select-Object -First 1
$script:subModulesFolder = Join-Path -Path $script:parentModule.ModuleBase -ChildPath 'Modules'
Remove-Module -Name $script:parentModule -Force -ErrorAction 'SilentlyContinue'

$script:subModuleName = (Split-Path -Path $PSCommandPath -Leaf) -replace '\.Tests.ps1'
$script:subModuleFile = Join-Path -Path $script:subModulesFolder -ChildPath "$($script:subModuleName)"

Import-Module $script:subModuleFile -Force -ErrorAction Stop
#endregion HEADER

InModuleScope $script:subModuleName {
    # The unit tests
}
```

## Run tests locally

Make sure all tests have been updated as mentioned previously.
This runs all the unit tests for the module. *It runs the tests that are*
*configured under the key `Script` (under the key `Pester`) in the file*
*`build.yaml`.*

**Remember to run the build task if any file has been changed in the source**
**folder.**

```powershell
.\build.ps1 -Tasks test
```

>To run the integration tests you will need to add the parameter `PesterScript`,
>e.g.
>```powershell
>.\build.ps1 -Tasks test -PesterScript 'tests/Integration'.
>```
>**Only do this in a lab environment or CI environment.**

## Configure CI test pipeline

### File `azure-pipelines.yml`

1. Replace the string `Build_artefact` with `Build` (in two locations).
1. Replace the entire stage `test_module` with the following.
   ```yaml
   - stage: Test
     dependsOn: Build
     jobs:
       - job: Test_HQRM
         pool:
           vmImage: 'win1803'
         timeoutInMinutes: 0
         steps:
           - task: DownloadBuildArtifacts@0
             inputs:
               buildType: 'current'
               downloadType: 'single'
               artifactName: 'output'
               downloadPath: '$(Build.SourcesDirectory)'
           - task: PowerShell@2
             name: Test
             inputs:
               filePath: './build.ps1'
               arguments: '-Tasks hqrmtest'
               pwsh: false
           - task: PublishTestResults@2
             condition: succeededOrFailed()
             inputs:
               testResultsFormat: 'NUnit'
               testResultsFiles: 'output/testResults/NUnit*.xml'
               testRunTitle: 'HQRM'

       - job: Test_Unit
         pool:
           vmImage: 'win1803'
         timeoutInMinutes: 0
         steps:
           - powershell: |
               $repositoryOwner,$repositoryName = $env:BUILD_REPOSITORY_NAME -split '/'
               echo "##vso[task.setvariable variable=RepositoryOwner;isOutput=true]$repositoryOwner"
               echo "##vso[task.setvariable variable=RepositoryName;isOutput=true]$repositoryName"
             name: DscBuildVariable
           - task: DownloadBuildArtifacts@0
             inputs:
               buildType: 'current'
               downloadType: 'single'
               artifactName: 'output'
               downloadPath: '$(Build.SourcesDirectory)'
           - task: PowerShell@2
             name: Test
             inputs:
               filePath: './build.ps1'
               arguments: "-Tasks test -PesterScript 'tests/Unit'"
               pwsh: false
           - task: PublishTestResults@2
             condition: succeededOrFailed()
             inputs:
               testResultsFormat: 'NUnit'
               testResultsFiles: 'output/testResults/NUnit*.xml'
               testRunTitle: 'Unit (Windows Server Core)'
           - task: PublishCodeCoverageResults@1
             condition: succeededOrFailed()
             inputs:
               codeCoverageTool: 'JaCoCo'
               summaryFileLocation: 'output/testResults/CodeCov*.xml'
               pathToSources: '$(Build.SourcesDirectory)/output/$(DscBuildVariable.RepositoryName)'

       - job: Test_Integration
         pool:
           vmImage: 'win1803'
         timeoutInMinutes: 0
         steps:
           - task: DownloadBuildArtifacts@0
             inputs:
               buildType: 'current'
               downloadType: 'single'
               artifactName: 'output'
               downloadPath: '$(Build.SourcesDirectory)'
           - task: PowerShell@2
             name: ConfigureWinRM
             inputs:
               targetType: 'inline'
               script: 'winrm quickconfig -quiet'
               pwsh: false
           - task: PowerShell@2
             name: Test
             inputs:
               filePath: './build.ps1'
               arguments: "-Tasks test -PesterScript 'tests/Integration' -CodeCoverageThreshold 0"
               pwsh: false
           - task: PublishTestResults@2
             condition: succeededOrFailed()
             inputs:
               testResultsFormat: 'NUnit'
               testResultsFiles: 'output/testResults/NUnit*.xml'
               testRunTitle: 'Integration (Windows Server Core)'
   ```
1. On the stage `Deploy` change the key `dependsOn` replace `test_module` to `Test`.
1. If the repository _cannot run_ integration tests then the job `Test_Integration`
   can be removed. If there are no integration tests yet the job can still
   be present so that once an integration tests is added it will be tested.
   The job will pass if no integration tests are found (it will even pass if
   no `Integration` folder exist).
1. (Optional) If the module does not support running unit test or integration
   tests on **Windows Server Core** for each relevant job, change the
   key `vmImage` to a supported image listed in the section
   [Use a Microsoft-hosted agent](https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent).
1. (Optional) If needed, add anything that was specific to running tests that was
   part of the `appveyor.yml`. For example to install a feature, add this
   before the task `Test` in the job `Test_Integration`.
   ```yaml
   - powershell: |
       Install-WindowsFeature -IncludeAllSubFeature -IncludeManagementTools -Name 'Web-Server'
     name: InstallWebServerFeature
   ```
1. (Optional) If there are need to run integration tests in order (or
   prioritize specific tests) then specify the order in which the tests
   should run. **This does not work if you call the pipeline using the**
   **parameter `PesterScript`, e.g. `./build.ps1 -Tasks test -PesterScript 'tests/Integration'`.**
   ```yaml
   Pester:
     # Run the script in order. First all of unit tests in no particular order,
     # and then all the integration tests in a specific group order.
     - tests/Unit
     # Group 1
     - tests/Integration/MSFT_SqlSetup.Integration.Tests.ps1
     # Group 2
     - tests/Integration/MSFT_SqlAgentAlert.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlServerNetwork.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlServerLogin.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlServerEndPoint.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlServerDatabaseMail.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlRSSetup.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlDatabaseDefaultLocation.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlDatabase.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlAlwaysOnService.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlAgentOperator.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlServiceAccount.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlAgentFailsafe.Integration.Tests.ps1
     # Group 3
     - tests/Integration/MSFT_SqlServerRole.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlRS.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlDatabaseUser.Integration.Tests.ps1
     # Group 4
     - tests/Integration/MSFT_SqlScript.Integration.Tests.ps1
     # Group 5
     - tests/Integration/MSFT_SqlServerSecureConnection.Integration.Tests.ps1
     - tests/Integration/MSFT_SqlScriptQuery.Integration.Tests.ps1
   ```

## Attach your fork to a free Azure DevOps organization

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

1. Push the working branch to your fork if you have not done so already.
   We will need it for the next step.
1. Create a free Azure DevOps organization at https://azure.microsoft.com/services/devops/
1. Install the GitVersion task
   1. Go to the https://dev.azure.com/{organization}/_settings/extensions and
      browse the marketplace and search for *GitVersion*.
1. Create a new project with the same name as the *GitHub repository name**,
   make sure to set visibility to **public**.
1. In the new project under Pipelines, create a new pipeline and choose
   GitHub as where the source resides, choose the the fork of the repository,
   e.g. johlju/SqlServerDsc. You will need to authenticate Azure DevOps
   with GitHub, and when it asks to install the Azure Pipelines GitHub app
   you can choose to install it for all and future repositories or just
   specific ones.
1. Once back in Azure Pipelines choose *Existing Azure Pipelines YAML file*
   and then select `azure-pipelines.yml` by browsing the branch you
   recently pushed above.
1. On the box that says *Run*, instead just choose *Save* in the drop-down list.
1. Overrides the continuous integration trigger by clicking on 'Edit' where
   you see the YAML file.
1. Click on the three dots to get the sub-menu and to show the menu item 'Triggers'.
   1. Once in Triggers pane, under *Continuous Integration* click the checkbox
      *Override the YAML continuous integration trigger from here*, and then
      change the *Branch specification* to `*` (asterisk).
   1. Under *Save & queue* in the drop-down menu choose *Save*.
1. Go back to the new pipeline and on the pane *Runs* click *Run pipeline*.
   1. For the *Branch/tag* choose the branch you just pushed, and leave
      *Commit* blank (to run the last the commit).
   1. Click on *Run*.

Next time you push a commit to a branch in your fork the Azure Pipeline
will trigger on that and start a run.

>**NOTE:** Even if we choose a specific YAML file that will not be used,
>instead the YAML file from the branch being pushed will be used, so any
>changes to the file `azure-pipelines.yml` will be reflected.

## Modify upstream repository

Once all the tests are passing (preferably verified in you own Azure DevOps
organization) it time to update the upstream repository on the DscCommunity
GitHub account.

**If you don't have access to execute one or more of these steps then send**
**a message to @johlju, @PlagueHO, or @gaelcolas privately or in the**
**[DSC Slack channel](https://dsccommunity.org/community/contact/).**

### Remove WebHooks

Remove old webhooks that no longer will be used.

1. Browse the repository webooks at https://github.com/dsccommunity/{repository}/settings/hooks.
1. Remove the AppVeyor webhook (`ci.appveyor.com`).
1. Remove the Waffle webhook (`hooks.waffle.io`). *If it exists.*
1. Remove the Microsoft CLA bot (`cla.microsoft.com`). *If it exists.*

### Remove AppVeyor CI

1. Delete the repository AppVeyor project from the DSC Community AppVeyor
   account at https://ci.appveyor.com/account/dsccommunity/projects.

### Push working branch to upstream repository

1. Send in the working branch to the upstream repository, e.g.
   `git push --set-upstream origin add-new-ci`.

### Attach DSC Community Azure DevOps organization

>**NOTE:** This needs to be done by one that has admin rights on the DSC
>Community Azure DevOps organization. If you don't have admin rights then
>contact @gaelcolas on the [Slack #DSC channel](https://dsccommunity.org/community/contact/)
>and provide the e-mail address you want to access the Azure DevOps
>organization with. He will create the Azure DevOps project for the
>repository. He will also invite you as a stakeholder to the DSC Community
>Azure DevOps organization and give you permission in the Azure DevOps
>project.

Prior to doing this, make sure that the working branch was pushed to
the upstream repository since we need to have access to the file
`azure-pipelines.yml` in the next step.

1. Create a new project at https://dev.azure.com/dsccommunity/ with the
   same name as the *GitHub repository name**, make sure to set visibility
   to **public**.
1. In the new project under Pipelines, create a new pipeline and choose
   GitHub as where the source resides
   1. Under *My repositories* in the drop-down choose *All repositories*.
   1. Choose the the upstream repository, e.g. dsccommunity/SqlServerDsc.
      ~~You will need to authenticate Azure DevOps with GitHub, and when it~~
      ~~asks to install the Azure Pipelines GitHub app you can choose to~~
      ~~install it for all and future repositories or just specific ones.~~
1. Once back in Azure Pipelines choose *Existing Azure Pipelines YAML file*
   and then to choose the file `azure-pipelines.yml` by browsing the branch
   you just pushed above. Then on the box that says *Run*, instead just
   choose *Save* in the drop-down list.
1. When viewing the YAML file, click on *Variables* and add two variables.
   Contact @gaelcolas to set these values.
   - `GitHubToken` - This should have the value of the GitHub Personal
     Access Token (PAT) for the specific repository (created from the DSC
     Community GitHub account)
   - `GalleryApiToken` - This should have the value of the PowerShell
     Gallery API key
1. Update the README.md status badges with the correct definition ID. You
   find the definition ID in the URL when you browse to the new pipeline.

### Remove repository branch protection rules

Browse to the repository settings page and change the branch protection
rules for both branch `dev` and branch `master` to remove the status check
for **AppVeyor** and **CLA**. See branch protection rules at
https://github.com/dsccommunity/{repository}/settings/branches.

### Update dev branch

1. Send in a PR of your working branch (that was pushed to the upstream
   repository) targeting the `dev` branch.
1. Review and merge the PR.
1. Delete the working branch, e.g. `add-new-ci`, from the upstream repository.

### Change default branch

In the repository, change the default branch to `master` at
https://github.com/dsccommunity/{repository}/settings/branches.

>**NOTE:** GitHub will say "Changing the default branch can have unintended
>consequences that can affect new pull requests and clones.". We have to
>help contributors so solve any consequences so just ignore ignore it and
>continue.

### Set new repository branch protection rules

Browse to the repository settings page and set the branch protection
rules for branch `master` to add the status check for Azure Pipelines.
See branch protection rules at https://github.com/dsccommunity/{repository}/settings/branches.

Branch protection rules:

- Require status check to pass before merging
- Require branches to be up to date before merging

Status check to set (will only show once the CI has been run):

- `dsccommunity.{repositoryName} (Build BuildModuleJob)`
- `dsccommunity.{repositoryName} (Test Test_HQRM)`
- `dsccommunity.{repositoryName} (Test Test_Integration)`
- `dsccommunity.{repositoryName} (Test Test_Unit)`

Plus any other test status checks you have cofngiured for other platforms
etc.

>**NOTE:** Names can differ depending on what the jobs were named
>in the file `azure-pipelines.yml`.

### Transfer PowerShell Gallery package

~~Ask @gaelcolas to transfer the package for the repository over to the~~
~~DSC Community. **This must be done prior to merging changes into the**~~
~~**`master` branch**.~~

All modules have been transferred to the DSC Community PowerShell Gallery
account.

### Update master branch

1. Change branch protection rules for the branch `dev` to *Allow force push*
   at https://github.com/dsccommunity/{repository}/settings/branches.
1. Get the linear commit history of upstream branch `master` into the upstream
   branch `dev`. *This must be done to keep the commits that us used by the*
   *tags.*
   ```bash
   git checkout dev
   git fetch origin master
   git rebase origin/master
   git push --set-upstream origin dev --force
   ```
1. Send in a PR of your `dev` branch targeting the `master` branch.
1. Review and merge the PR. **Merge the PR using *Merge pull request*, and**
   **not *squash* to keep the commit history**.

This will publish a preview version.

### Publish the next full version

Once the next full version should be deployed, do these steps to push
a new release version tag. Important to have the correct format `vX.Y.Z`,
e.g. `v1.14.1`.

```bash
git checkout master
git pull --tags # Pull all tags from upstream master branch
git describe --tags # To see the the latest tag, e.g. vX.Y.Z-preview0002
git tag vX.Y.Z # Creates the full version tag locally
git push --tags # Push the new tag that was created locally
```

>**NOTE:** You could also tag a specific commit if not all commits should
>be released.

### Remove branch `dev` from upstream repository

**BE AWARE OF AFFECTED PULL REQUESTS.**

1. Re-target any PR's to the new default branch `master`.
1. Remove the branch `dev` by running `git push origin :dev` (or by manually
   deleting it through GitHub). *You might need to remove it as a protected*
   *branch first in https://github.com/dsccommunity/{repositoryName}/settings/branches.*

## Modify the *forked* repository

This is to updated the forked repository. All these steps are optional.

1. Remove the repository AppVeyor project for the _forked_
   repository at https://ci.appveyor.com/projects.
1. Change the default branch to `master` in the *forked* repository.
1. Remove branch `dev` from the *forked* repository.
1. Update the branch `master` in the *forked* repository.
   ```bash
   git checkout master
   git fetch origin master
   git rebase origin/master
   git push my --force
   ```

## Re-connect Reviewable

When the repository was moved Reviewable might have been disconnected
which means that the Reviewable button might or might not show up on a
PR *(depends on if or how the contributor have configured Reviewable)*.

If there are a Reviewable button showing up on a PR, then click on that
button as usual. If there are no reviewable button, then browse to reviewable
using `https://reviewable.io/reviews/dsccommunity/{repositoryName}/{PRnumber}`
that you build from the repository name and the PR number, e.g.
`https://reviewable.io/reviews/dsccommunity/xExchange/439`. When doing this
the Reviewable button should reappear on the PR,

Once on the Reviewable page, look at the bottom of the page for a warning
popup message saying "This review will only sync with the PR on demand
because the repo is not connected". Click on the green button that says
**CONNECT DSCCOMMUNITY/{repositoryName}**.

Reviewable should now have been re-connected.

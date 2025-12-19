---
title: "Add Code Coverage Support to Repository"
date: 2020-02-03T19:17:35+01:00
type: "post"
draft: false
author: johlju
---

Code coverage metrics help ensure your DSC resources are well-tested. This guide explains how to configure Codecov.io integration for your DSC Community repository to track and report code coverage in your CI pipeline using Pester's JaCoCo output.

_This assumes the repository is using the pattern from the [Sampler](https://github.com/gaelcolas/Sampler)
project. Also make sure you have updated the repository to the latest pipeline._

## Table of Contents

- [Introduction](#introduction)
- [Not building module, just copying files](#not-building-module-just-copying-files)
- [Building whole or part of module](#building-whole-or-part-of-module)
- [Code coverage for multiple jobs](#code-coverage-for-multiple-jobs)

## Introduction

With the release of [Pester v4.10](https://www.powershellgallery.com/packages/Pester/4.10.0)
it is now possible to upload the Pester generated JoCoCo file.
The same file is used to upload code coverage to both Azure Pipelines and
to [Codecov.io](https://codecov.io).

The DSC Community GitHub organization has already added the Codecov GitHub
App on all existing repositories in the organization so that existing and
any new repository will have the Codecov GitHub App added automatically.
There is nothing that needs to be added to use code coverage in Azure Pipelines.

>**Information:** Due to how Pester generates the JaCoCo code coverage file Azure
>Pipelines code coverage will not find source files in certain circumstances.
>When a repository is using the pattern from the [Sampler](https://github.com/gaelcolas/Sampler)
>project then sometimes the paths are just copied (not built) from source by
>ModuleBuilder. For example MOF-resources do show coverage for the entire file,
>but not on individual code lines since the source file can not be found by the
>task _PublishCodeCoverageResults@1_. Azure Pipelines code coverage expects the
>full relative path to be in the `<sourcefile>` element, relative from the
>path specified in argument `pathToSources` of the pipeline task
>_PublishCodeCoverageResults@1_. Pester does not do this. Codecov.io is
>smarter in that sense and builds the relative path from both the `<package>`
>and `<sourcefile>` element, and Codecov.io expects the `<package>` and
>`<sourcefile>` element to together match the source folder structure in
>the GitHub repository (at the commit). Azure Pipelines code coverage
>generate source files form the code that are available in the pipeline,
>and it can only be a single path, and that single path does not support
>pattern matching.

To upload code coverage we need to:

- change the `build.yaml`
- add a `codecov.yml` (if Codecov.io should be used)
- change the stage `Test` in the file `azure-pipelines.yml` by modifying
  the existing unit test job
- add a new job that uploads the coverage.

There are additional steps if code coverage should be gathered from multiple
jobs, see section [Code coverage for multiple jobs](#code-coverage-for-multiple-jobs).

## Not building module, just copying files

If the repository is not building any part of the module, that is _not_
using the _ModuleBuilder_ pattern of `Private`, `Public`, `Classes` and or
`Enum`. E.g. the repository is only using MOF-based resources that are
copied by _ModuleBuilder_.

### Modify `build.yaml`

Because [Codecov.io](https://codecov.io) expects the file that is uploaded
to be prefixed with `JaCoCo` we have to change the filename of the JaCoCo
test results file that Pester is creating. The file must also be created
with the encoding `UTF8` (_without BOM_) so that Codecov.io can accept it,
so we make sure to change the encoding to `ascii`.

Under the key `Pester`, add the keyword `CodeCoverageThreshold`. `CodeCoverageOutputFile`,
and `CodeCoverageOutputFileEncoding`. They keyword `CodeCoverageThreshold`
must be set to a value between `1` and `100`. Normally the value `80` (80%)
is a good value if the repository have enough coverage, lower the value if
it doesn't.

It can look something like this:

```yaml
Pester:
  OutputFormat: NUnitXML
  ExcludeFromCodeCoverage:
    - Modules/DscResource.Common
  Script:
    - tests/Unit
  ExcludeTag:
  Tag:
  CodeCoverageThreshold: 80
  CodeCoverageOutputFile: JaCoCo_coverage.xml
  CodeCoverageOutputFileEncoding: ascii
```

>*NOTE:* the filename can be anything after the prefix `JaCoCo`, for example
>it is possible to use `JaCoCo_$OsShortName.xml` which results in
>the filename `JaCoCO_macOs.xml` when the test task is run on macOS.

### Modify `azure-pipelines.yml`

From the job `Test_Unit` we can remove the task `Set Environment Variables`
and the task `Publish Code Coverage`. Those two task will be moved to the
new job. Instead we add the task `Publish Test Artifact` which uploads
the test result files that ended up in the folder `output/testResults`.

#### Add global variables

At the top of the file, at the same level as the key `trigger` add the
following.

```yaml
variables:
  buildFolderName: output
  buildArtifactName: output
  testResultFolderName: testResults
  testArtifactName: testResults
  sourceFolderName: source
```

It should look something like this:

```yaml
trigger:
  branches:
    include:
    - main
  paths:
    include:
    - source/*
  tags:
    include:
    - "v*"
    exclude:
    - "*-*"

variables:
  buildFolderName: output
  buildArtifactName: output
  testResultFolderName: testResults
  testArtifactName: testResults
  sourceFolderName: source
```

#### Update job `Test_Unit`

The main tasks of this job must be:

- Download the build artifact using task `DownloadPipelineArtifact@2` (or
  use the same task that `Build` stage used)
- Run the unit tests which generates the JaCoCo XML file in the folder
  `output/testResults` (make sure `CodeCoverageThreshold` has a value
  higher than `0`)
- Uploads the `output/testResults` folder to the artifact `testResults`
  using the task `PublishPipelineArtifact@1`.

Most important here is the task _Publish Test Artifact_ is updated to
use `PublishPipelineArtifact@1`, which is expected to be able to download
the artifact in the code coverage job (see next section). The
_Publish Test Artifact_ must be run after the test task.

The arguments for the task _Run Unit Test_ can differ depending on repository.
But most important is if the `CodeCoverageThreshold` argument is used to
override the value in `build.yaml` then the value for `CodeCoverageThreshold`
may not be set to `0`. The value `0` means that no coverage is gathered.

This is how it can look like:

```yaml
      - job: Test_Unit
        displayName: 'Unit'
        pool:
          vmImage: 'windows-2019'
        timeoutInMinutes: 0
        steps:
          - task: DownloadPipelineArtifact@2 # Must be present for build task to work.
            displayName: 'Download Pipeline Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(buildArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildArtifactName)'
          - task: PowerShell@2 # Runs the tests, and generates code coverage.
            name: test
            displayName: 'Run Unit Test'
            inputs:
              filePath: './build.ps1'
              arguments: "-Tasks test -PesterScript 'tests/Unit'" # <--- Arguments can differ depending on repository.
              pwsh: false
          - task: PublishTestResults@2 # <--- Task optional, not necessary for code coverage.
            displayName: 'Publish Test Results'
            condition: succeededOrFailed()
            inputs:
              testResultsFormat: 'NUnit'
              testResultsFiles: '$(buildFolderName)/$(testResultFolderName)/NUnit*.xml'
              testRunTitle: 'Unit'
          - task: PublishPipelineArtifact@1  # <--- This task is most important.
            displayName: 'Publish Test Artifact'
            inputs:
              targetPath: '$(buildFolderName)/$(testResultFolderName)/'
              artifactName: $(testArtifactName)
              parallel: true
```

#### Update job `CodeCoverage`

Add a new job that depends on the job `Test_Unit` (see previous section)
since we must wait for the JaCoCo XML file to exist. The reason for having
a separate job is that we need (or at least it is easiest) to run the
[Codecov.io](https://codecov.io) upload task in a Linux build worker.

The tasks of this job must be:

- Set environment variables (needed for the upload of Azure Pipelines code
  coverage)
- Download the build artifact using task `DownloadPipelineArtifact@2` (or
  use the same task that `Build` stage used)
- Download the test artifact (`testResults` that was upload by the job
  in the previous section)
- Upload coverage to one or both services:
  - Publish code coverage to Azure Pipelines (Azure DevOps)
  - Publish code coverage to Codecov.io

```yaml
      - job: Code_Coverage
        displayName: 'Publish Code Coverage'
        dependsOn: Test_Unit
        pool:
          vmImage: 'ubuntu 16.04'
        timeoutInMinutes: 0
        steps:
          - task: DownloadPipelineArtifact@2
            displayName: 'Download Pipeline Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(buildArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildArtifactName)'
          - task: DownloadPipelineArtifact@2
            displayName: 'Download Test Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(testArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)'
          - task: PublishCodeCoverageResults@1
            displayName: 'Publish Code Coverage to Azure DevOps'
            inputs:
              codeCoverageTool: 'JaCoCo'
              summaryFileLocation: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)/JaCoCo_coverage.xml'
              pathToSources: '$(Build.SourcesDirectory)/$(sourceFolderName)/'
          - script: |
              bash <(curl -s https://codecov.io/bash) -f "./$(buildFolderName)/$(testResultFolderName)/JaCoCo_coverage.xml"
            displayName: 'Publish Code Coverage to Codecov.io'
```

### Add `codecov.yml`

This file is not necessary if Codecov.io is not used.

>**NOTE:** Make sure to update the default branch name in the Codecov.io
>project site if the default branch name is renamed.

>**NOTE:** If this file exist and starts with a full stop `.`, e.g. `.codecov.yml`,
>then please rename it to `codecov.yml`. See this FAQ for more information
>https://docs.codecov.io/docs/codecov-yaml#section-can-i-name-the-file-codecov-yml

These settings can be set as desired, but the values below are what are used
by default in the DSC Community repositories.

The important part is the key `fixes`. [Codecov.io](https://codecov.io)
is expecting the paths in the JaCoCo file to match the folder structure in
the GitHub repository. Make sure to change the part `::source` to the name
of the source folder in the repository. Normally this is `source`, but the
repository can also use `src` or a folder name with the same name as the
module name.

Since the [Sampler](https://github.com/gaelcolas/Sampler) project runs
tests against the built module in the `output` folder, the paths do not
match those of the repository. The key `fixes` converts the paths in
the JaCoCo XML file to the correct paths that [Codecov.io](https://codecov.io)
expects.

>See the [codecov.yml Reference](https://docs.codecov.io/docs/codecovyml-reference)
>for more information about these settings.

```yaml
codecov:
  require_ci_to_pass: no
  # main should be the baseline for reporting
  branch: main

comment:
  layout: "reach, diff, flags, files"
  behavior: default

coverage:
  range: 50..80
  round: down
  precision: 0

  status:
    project:
      default:
        # Set the overall project code coverage requirement to 70%
        target: 70
    patch:
      default:
        # Set the pull request requirement to not regress overall coverage by more than 5%
        # and let codecov.io set the goal for the code changed in the patch.
        target: auto
        threshold: 5

fixes:
  - '^\d+\.\d+\.\d+::source'  # move path "X.Y.Z" => "source"
```

### Add status badge to `README.md`

Finally we should add the status badges to the README.md. Replace
`{repositoryName}` with the actual repository name, e.g. `ComputerManagementDsc`.
Also replace `{defaultbranch}` to the name of the default branch, e.g. `main`.

```markdown
[![codecov](https://codecov.io/gh/dsccommunity/{repositoryName}/branch/{defaultbranch}/graph/badge.svg)](https://codecov.io/gh/dsccommunity/{repositoryName})
![Azure DevOps coverage (branch)](https://img.shields.io/azure-devops/coverage/dsccommunity/{repositoryName}/14/{defaultbranch})
```

## Building whole or part of module

If the repository is building all or just part of the module using the ModuleBuilder's
pattern of `Private`, `Public`, `Classes` and/or `Enum`. E.g. combination of
class-based and MOF-based resources, and/or public/private functions.

### Modify `build.yaml`

1. Update `build.yml` the same way as in the section [Modify build.yaml](#modify-build.yaml)
in [Not building module, just copies files](#not-building-module-just-copies-files).

2. Add the task _Convert\_Pester\_Coverage_ to the build
task `test`. This task will convert the line numbers from the built module
to the correlating line in the specific source file. The task will generate
a new coverage file that is then merged with the original file that Pester
generated.

```yaml
  test:
    - Pester_Tests_Stop_On_Fail
    - Convert_Pester_Coverage
    - Pester_if_Code_Coverage_Under_Threshold
```

### Modify `azure-pipelines.yml`

Update `azure-pipelines.yml` exactly the same way as in the section [Modify azure-pipelines.yml](#modify-azure-pipelines.yml)
in [Not building module, just copies files](#not-building-module-just-copies-files).

### Add `codecov.yml`

Read more about this file in the section [Add codecov.yml](#add-codecov.yml)
in [Not building module, just copies files](#not-building-module-just-copies-files).

This file is not necessary if Codecov.io is not used.

The build task _Convert\_Pester\_Coverage_ will update the coverage file with
the correct name of the source folder. So when using build task _Convert\_Pester\_Coverage_
the `covecov.yml` should look like below. Note that the main difference
(from [Not building module, just copying files](#not-building-module-just-copying-files))
is that it is not using `fixes` keyword as the task _Convert\_Pester\_Coverage_
will do that for us.

```yaml
codecov:
  require_ci_to_pass: no
  # main should be the baseline for reporting
  branch: main

comment:
  layout: "reach, diff, flags, files"
  behavior: default

coverage:
  range: 50..80
  round: down
  precision: 0

  status:
    project:
      default:
        # Set the overall project code coverage requirement to 70%
        target: 70
    patch:
      default:
        # Set the pull request requirement to not regress overall coverage by more than 5%
        # and let codecov.io set the goal for the code changed in the patch.
        target: auto
        threshold: 5
```

### Add status badge to `README.md`

Update `README.md` exactly the same way as in the section [Add status badge to `README.md`](#add-status-badge-to-README.md)
in [Not building module, just copies files](#not-building-module-just-copies-files).

## Code coverage for multiple jobs

If a repository needs to gather code coverage from more than one job,
the code coverage files need to be merged before publishing them to either
or both services Azure DevOps or Codecov.io.

For example, unit tests or integration tests are run on multiple operating
systems and/or target multiple versions of an application. It might be that
some functions can only be tested on a certain version/operating system
while other functions can only be tested on a different version/operating
system.

Start of by implementing the steps in either [Not building module, just copying files](#not-building-module-just-copying-files)
or [Building whole or part of module](#building-whole-or-part-of-module)
depending on the repository's need.

### Modify `build.yaml`

The filename `JaCoCo_coverage.xml` that has been used in the previous section
cannot be used for Pester when we need to gather coverage from multiple jobs.
There are two options:

- either remove they keyword `CodeCoverageOutputFile` entirely so that the
  default value is used. The default value names the files using the PowerShell
  version and operating system (Linux, macOS, Windows) and with the prefix `Codecov_`
  (short for 'Code Coverage').
- or add a different specific filename, which will be used for all jobs,
  for example, 'JaCoCo_Merge.xml'.

Depending on your choice, the code coverage job in Azure Pipelines needs to
take account for it. More on that later.

If you choose to use a specific filename the `Pester` section can look like
this:

>*NOTE:* the filename can be anything after the prefix `JaCoCo`, for example
>it is possible to use `JaCoCo_$OsShortName.xml` which results in
>the filename `JaCoCO_macOs.xml` when the test task is run on macOS.

```yaml
Pester:
  OutputFormat: NUnitXML
  ExcludeFromCodeCoverage:
    - Modules/DscResource.Common
  Script:
    - tests/Unit
  ExcludeTag:
  Tag:
  CodeCoverageThreshold: 80
  CodeCoverageOutputFile: JaCoCo_Merge.xml
  CodeCoverageOutputFileEncoding: ascii
```

If you choose to remove `CodeCoverageOutputFile` keyword, the `Pester` section
can look like this:

```yaml
Pester:
  OutputFormat: NUnitXML
  ExcludeFromCodeCoverage:
    - Modules/DscResource.Common
  Script:
    - tests/Unit
  ExcludeTag:
  Tag:
  CodeCoverageThreshold: 80
  CodeCoverageOutputFileEncoding: ascii
```

We also need to add a new build task that we call `merge` that will run
the task _Merge\_CodeCoverage\_Files_. This task should be added under the
keyword `BuildWorkflow:`.

It can look something like this:

```
BuildWorkflow:
  '.':
    - build
    - test

  merge:
    - Merge_CodeCoverage_Files
```

The task _Merge\_CodeCoverage\_Files_ also needs to have the keyword
`CodeCoverageMergedOutputFile` and `CodeCoverageFilePattern` settings
defined in the build.yaml file.

The keyword `CodeCoverageMergedOutputFile` should be set to the filename
that the task _Merge\_CodeCoverage\_Files_ will generate and is the file
that will be uploaded to the code coverage services.

>**NOTE:** For the service Codecov.io the filename must be prefixed with
>'JaCoCo'.

The keyword `CodeCoverageFilePattern` is the pattern to recursively look
for under the `output/testResults` folder. It should use a pattern that
can recognize the JaCoCo files that the test jobs generate.

If using the default filenames it can look something like this:

```yaml
CodeCoverage:
  CodeCoverageMergedOutputFile: JaCoCo_coverage.xml
  CodeCoverageFilePattern: Codecov*.xml
```

If a specific filename was used it can look something like this:

```yaml
CodeCoverage:
  CodeCoverageMergedOutputFile: JaCoCo_coverage.xml
  CodeCoverageFilePattern: JaCoCo_Merge.xml
```


### Modify `azure-pipelines.yml`

From the job `Test_Unit` we can remove the task `Set Environment Variables`
and the task `Publish Code Coverage`. Those two tasks will be moved to the
new job. Instead we add the task `Publish Test Artifact` which uploads
the test result files that ended up in the folder `output/testResults`.

#### Remove global variable

We can remove the global variable `testArtifactName` since it will not be used.

After removing the global variable it should look something like this:

```yaml
trigger:
  branches:
    include:
    - main
  paths:
    include:
    - source/*
  tags:
    include:
    - "v*"
    exclude:
    - "*-*"

variables:
  buildFolderName: output
  buildArtifactName: output
  testResultFolderName: testResults
  sourceFolderName: source
```

#### Update test tasks

At least two test tasks must be used. The main tasks for each job must be:

- Download the build artifact using task `DownloadPipelineArtifact@2` (or
  use the same task that `Build` stage used)
- Run the unit tests which generates the JaCoCo XML file in the folder
  `output/testResults` (make sure `CodeCoverageThreshold` has a value
  higher than `0`)
- Uploads the `output/testResults` folder to a, for each job, unique artifact
  name using the task `PublishPipelineArtifact@1`.

Most important here is the task _Publish Test Artifact_ is updated to
use `PublishPipelineArtifact@1`, which is expected to be able to download
the artifact in the code coverage job (see next section). The
_Publish Test Artifact_ must be run after the test task. The artifact name
must be unique for each test job.

The arguments for the task _Run Unit Test_ can differ depending on repository.
But most important is if the `CodeCoverageThreshold` argument is used to
override the value in `build.yaml` then the value for `CodeCoverageThreshold`
may not be set to `0`. The value `0` means that no coverage is gathered.

This is how it can look like:

```yaml
      - job: test_windows_core # Run tests in PowerShell 7 on Windows
        displayName: 'Windows (PowerShell Core)'
        timeoutInMinutes: 0
        pool:
          vmImage: 'windows-2019'
        steps:
          - task: DownloadPipelineArtifact@2 # Download build artifact.
            displayName: 'Download Pipeline Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(buildArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildArtifactName)'
          - task: PowerShell@2 # Run tests and gather code coverage.
            name: test
            displayName: 'Run Tests'
            inputs:
              filePath: './build.ps1'
              arguments: '-tasks test'
              pwsh: true
          - task: PublishTestResults@2 # Optional. Publish test results.
            displayName: 'Publish Test Results'
            condition: succeededOrFailed()
            inputs:
              testResultsFormat: 'NUnit'
              testResultsFiles: '$(buildFolderName)/$(testResultFolderName)/NUnit*.xml'
              testRunTitle: 'Windows Server Core (PowerShell Core)'
          - task: PublishPipelineArtifact@1 # Publish test artifact with unique name for this job.
            displayName: 'Publish Test Artifact'
            inputs:
              targetPath: '$(buildFolderName)/$(testResultFolderName)/'
              artifactName: 'CodeCoverageWinPS7' # An unique artifact name.
              parallel: true

      - job: test_linux # Run tests in PowerShell 7 on Linux
        displayName: 'Linux'
        timeoutInMinutes: 0
        pool:
          vmImage: 'ubuntu 16.04'
        steps:
          - task: DownloadPipelineArtifact@2 # Download build artifact.
            displayName: 'Download Pipeline Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(buildArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildArtifactName)'
          - task: PowerShell@2 # Run tests and gather code coverage.
            name: test
            displayName: 'Run Tests'
            inputs:
              filePath: './build.ps1'
              arguments: '-tasks test'
          - task: PublishTestResults@2 # Optional. Publish test results.
            displayName: 'Publish Test Results'
            condition: succeededOrFailed()
            inputs:
              testResultsFormat: 'NUnit'
              testResultsFiles: '$(buildFolderName)/$(testResultFolderName)/NUnit*.xml'
              testRunTitle: 'Linux'
          - task: PublishPipelineArtifact@1 # Publish test artifact with unique name for this job.
            displayName: 'Publish Test Artifact'
            inputs:
              targetPath: '$(buildFolderName)/$(testResultFolderName)/'
              artifactName: 'CodeCoverageLinux' # An unique artifact name.
              parallel: true

```

#### Update job `CodeCoverage`

Add a new job that depends on all the test jobs (see previous section) since
we must wait for all of the JaCoCo XML files to exist.

The tasks of this job must be:

- Set environment variables (needed for the upload of Azure Pipelines code
  coverage)
- Download the build artifact using task `DownloadPipelineArtifact@2` (or
  use the same task that `Build` stage used)
- Download each of the unique test artifacts (that was upload by the test
  jobs in the previous section)
- Run the build task to merge all the code coverage files.
- Upload coverage to one or both services:
  - Publish code coverage to Azure Pipelines (Azure DevOps)
  - Publish code coverage to Codecov.io

If each test job is using that same filename (specified in the `build.yaml`),
or that there is a risk that the default filename might not be unique, then
we need to specify specific folders where the test artifacts are downloaded.

The publishing tasks must specify the filename that was specified in the
keyword `CodeCoverageMergedOutputFile` in the `build.yaml` file.

```yaml
      - job: Code_Coverage
        displayName: 'Publish Code Coverage'
        dependsOn:
          - test_windows_core
          - test_linux
        pool:
          vmImage: 'ubuntu 16.04'
        timeoutInMinutes: 0
        steps:
          - task: DownloadPipelineArtifact@2
            displayName: 'Download Pipeline Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(buildArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildArtifactName)'
          - task: DownloadPipelineArtifact@2 # Downloads the artifact 'CodeCoverageLinux'.
            displayName: 'Download Test Artifact Linux'
            inputs:
              buildType: 'current'
              artifactName: 'CodeCoverageLinux'
              targetPath: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)'
          - task: DownloadPipelineArtifact@2 # Downloads the artifact 'CodeCoverageWinPS7'.
            displayName: 'Download Test Artifact Windows (PS7)'
            inputs:
              buildType: 'current'
              artifactName: 'CodeCoverageWinPS7'
              targetPath: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)'
          - task: PowerShell@2 # Merge the code coverage files.
            name: merge
            displayName: 'Merge Code Coverage files'
            inputs:
              filePath: './build.ps1'
              arguments: '-tasks merge'
              pwsh: true
          - task: PublishCodeCoverageResults@1 # Must specify the file specified in the `CodeCoverageMergedOutputFile`
            displayName: 'Publish Code Coverage to Azure DevOps'
            inputs:
              codeCoverageTool: 'JaCoCo'
              summaryFileLocation: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)/JaCoCo_coverage.xml'
              pathToSources: '$(Build.SourcesDirectory)/$(sourceFolderName)/'
          - script: | # Must specify the file specified in the `CodeCoverageMergedOutputFile`
              bash <(curl -s https://codecov.io/bash) -f "./$(buildFolderName)/$(testResultFolderName)/JaCoCo_coverage.xml"
            displayName: 'Publish Code Coverage to Codecov.io'
```

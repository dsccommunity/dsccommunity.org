---
title: "Add Code Coverage Support to Repository"
date: 2020-02-03T19:17:35+01:00
type: "post"
draft: false
author: johlju
---

_This assumes the repository is using the pattern from the [Sampler](https://github.com/gaelcolas/Sampler)_
_project. Also make sure to have update the repository to the latest pipeline_
_files._

## Table of Contents

- [Introduction](#introduction)
- [Not building module, just copies files](#not-building-module-just-copies-files)
- [Building whole or part of module](#building-whole-or-part-of-module)

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
>project then paths that is copied (not built) from source by ModuleBuilder.
>For example MOF-resources do show coverage for the entire file, but not on
>individual code lines since the source file is not found by the task
>_PublishCodeCoverageResults@1_. Azure Pipelines code coverage expects the
>full relative path to be in the `<sourcefile>` element, relative from the
>path specified in argument `pathToSources` of the pipeline task
>_PublishCodeCoverageResults@1_. Pester does not do this. Codecov.io is
>smarter in that sense and builds the relative path from both the `<package>`
>and `<sourcefile>` element, and Codecov.io expects the `<package>` and
>`<sourcefile>` element to together match the source folder structure in
>the GitHub repository (at the commit). Azure Pipelines code coverage
>copies source files that are available in the pipeline, and it can only be a
>single path, and that single path does not support pattern matching.

To upload code coverage we need to change the `build.yaml`, add a `codecov.yml`
(if Codecov.io should be used), and change the stage `Test` in the file
`azure-pipelines.yml` by modifying the existing unit test job and adding a
new job that uploads the coverage. There are additional steps if code coverage
should be gathered from multiple jobs.

## Not building module, just copies files

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

Under the key `Pester` add the following keys.

```yaml
Pester:
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

#### Update job `Test_Unit`

The tasks of this job are:

- Download the build artifact (`output` that was uploaded by the `Build`
  stage)
- Run the unit tests (which generates the JaCoCo XML file in the folder
  `output/testResults`)
- Uploads the `output/testResults` folder to the artifact `testResults`.

```yaml
      - job: Test_Unit
        displayName: 'Unit'
        pool:
          vmImage: 'windows-2019'
        timeoutInMinutes: 0
        steps:
          - task: DownloadBuildArtifacts@0
            displayName: 'Download Build Artifact'
            inputs:
              buildType: 'current'
              downloadType: 'single'
              artifactName: $(buildArtifactName)
              downloadPath: '$(Build.SourcesDirectory)'
          - task: PowerShell@2
            name: test
            displayName: 'Run Unit Test'
            inputs:
              filePath: './build.ps1'
              arguments: "-Tasks test -PesterScript 'tests/Unit'"
              pwsh: false
          - task: PublishTestResults@2
            displayName: 'Publish Test Results'
            condition: succeededOrFailed()
            inputs:
              testResultsFormat: 'NUnit'
              testResultsFiles: '$(buildFolderName)/$(testResultFolderName)/NUnit*.xml'
              testRunTitle: 'Unit (Windows Server Core)'
          - task: PublishPipelineArtifact@1
            displayName: 'Publish Test Artifact'
            inputs:
              targetPath: '$(buildFolderName)/$(testResultFolderName)/'
              artifactName: $(testArtifactName)
              parallel: true
```

#### Update job `CodeCoverage`

Then we add a new job that depends on the job `Test_Unit` since we must
wait for the JaCoCo XML file to exist. The reason for having a separate job
is that we need (or at least it is easiest) to run the [Codecov.io](https://codecov.io)
upload task in a Linux build worker.

The tasks of this job are:

- Set environment variables (needed for the upload of Azure Pipelines code
  coverage)
- Download the build artifact (`output` that was uploaded by the `Build`
  stage)
- Download the test artifact (`testResults` that was upload by the job
  `Test_Unit`)
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
          - pwsh: |
              $repositoryOwner,$repositoryName = $env:BUILD_REPOSITORY_NAME -split '/'
              echo "##vso[task.setvariable variable=RepositoryOwner;isOutput=true]$repositoryOwner"
              echo "##vso[task.setvariable variable=RepositoryName;isOutput=true]$repositoryName"
            name: dscBuildVariable
            displayName: 'Set Environment Variables'
          - task: DownloadBuildArtifacts@0
            displayName: 'Download Build Artifact'
            inputs:
              buildType: 'current'
              downloadType: 'single'
              artifactName: $(buildArtifactName)
              downloadPath: '$(Build.SourcesDirectory)'
          - task: DownloadPipelineArtifact@2
            displayName: 'Download Test Artifact'
            inputs:
              buildType: 'current'
              artifactName: $(testArtifactName)
              targetPath: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)'
          - task: PublishCodeCoverageResults@1
            displayName: 'Publish Azure Code Coverage'
            inputs:
              codeCoverageTool: 'JaCoCo'
              summaryFileLocation: '$(Build.SourcesDirectory)/$(buildFolderName)/$(testResultFolderName)/JaCoCo_coverage.xml'
              pathToSources: '$(Build.SourcesDirectory)/$(sourceFolderName)/'
          - script: |
              bash <(curl -s https://codecov.io/bash) -f "./$(buildFolderName)/$(testResultFolderName)/JaCoCo_coverage.xml"
            displayName: 'Upload to Codecov.io'
```

### Add `codecov.yml`

This file is not necessary if Codecov.io is not used.

>**NOTE:** Make sure to update the default branch name in the Codecov.io
>project site if the default branch name is renamed.

>**NOTE:** If this file exist and starts with a full stop `.`, e.g. `.codecov.yml`,
>then please rename it to `codecov.yml`. See this FAQ for more information
>https://docs.codecov.io/docs/codecov-yaml#section-can-i-name-the-file-codecov-yml

These settings can be set as wanted, but the below is the default values
that we have used in the DSC Community repositories.

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

If the repository is building whole or part of the module using the ModuleBuilder
pattern of `Private`, `Public`, `Classes` and or `Enum`. E.g. combination of
class-based and MOF-based resources, and or public/private functions.

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
the `covecov.yml` should look like this (not using `fixes`):

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

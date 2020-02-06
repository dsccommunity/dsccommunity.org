---
title: "Add Codecov Support to Repository"
date: 2020-02-03T19:17:35+01:00
type: "post"
draft: false
author: johlju
---

_This assumes the repository is using the pattern from the [Sampler](https://github.com/gaelcolas/Sampler)_
_project._

With the release of [Pester v4.10](https://www.powershellgallery.com/packages/Pester/4.10.0)
it is now possible to upload the Pester generated JoCoCo file to [Codecov.io](https://codecov.io).
This is the same file that is used to upload code coverage to Azure Pipelines.
Codecov.io needed missing attributes to be part of the JaCoCo XML file.
Those attributes that were missing were ignored by Azure Pipelines.

To upload code coverage to Codecov.io we need to change the `build.yaml`,
add a `codecov.yml`, and change the stage `Test` in the file `azure-pipelines.yml`
by modifying the existing unit test job and adding a new job that uploads
the coverage.

## Modify `build.yaml`

Because [Codecov.io](https://codecov.io) expects the file that is uploaded
to be prefixed with `JaCoCo` we have to change the filename of the JaCoCo
test results file that Pester is creating. The file cannot be created
with the encoding `UTF8 with BOM` which is the default on Windows, so
we make sure to change the encoding to `ascii` that [Codecov.io](https://codecov.io)
accepts.

Under the key `Pester` add the following keys.

```yaml
Pester:
  CodeCoverageOutputFile: JaCoCo_coverage.xml
  CodeCoverageOutputFileEncoding: ascii
```

>*NOTE:* the filename can be anything after the prefix `JaCoCo`, for example
>it is possible to use this `JaCoCo_$OsShortName.xml` which results in
>the filename `JaCoCO_MacOs.xml` when the test task is run on macOS.

## Modify `azure-pipelines.yml`

From the job `Test_Unit` we can remove the task `Set Environment Variables`
and the task `Publish Code Coverage`. Those two task will be moved to the
new job. Instead we add the task `Publish Test Artifact` which uploads
the test result files that ended up in the folder `output/testResults`.
The new job `Test_Unit` should look like this.

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
              artifactName: 'output'
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
              testResultsFiles: 'output/testResults/NUnit*.xml'
              testRunTitle: 'Unit (Windows Server Core)'
          - task: PublishBuildArtifacts@1
            displayName: 'Publish Test Artifact'
            inputs:
              pathToPublish: 'output/testResults/'
              artifactName: 'testResults'
              publishLocation: 'Container'
```

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
              artifactName: 'output'
              downloadPath: '$(Build.SourcesDirectory)'
          - task: DownloadBuildArtifacts@0
            displayName: 'Download Test Artifact'
            inputs:
              buildType: 'current'
              downloadType: 'single'
              artifactName: 'testResults'
              downloadPath: '$(Build.SourcesDirectory)/output'
          - task: PublishCodeCoverageResults@1
            displayName: 'Publish Code Coverage'
            condition: succeededOrFailed()
            inputs:
              codeCoverageTool: 'JaCoCo'
              summaryFileLocation: 'output/testResults/JaCoCo_coverage.xml'
              pathToSources: '$(Build.SourcesDirectory)/output/$(dscBuildVariable.RepositoryName)'
          - script: |
              bash <(curl -s https://codecov.io/bash) -f "./output/testResults/JaCoCo_coverage.xml"
            displayName: 'Upload to Codecov.io'
            condition: succeededOrFailed()
```

## Add `codecov.yml`

>**NOTE:** If this file exist and starts with a full stop `.`, e.g. `.codecov.yml`,
>then please rename it to `codecov.yml`. See this FAQ for more information
>https://docs.codecov.io/docs/codecov-yaml#section-can-i-name-the-file-codecov-yml

These settings can be set as wanted, but the below is the default values
that we have used in the DSC modules.

The important part is the key `fixes`. [Codecov.io](https://codecov.io)
is expecting the paths in the JaCoCo file to match the folder structure in
the GitHub repository. Since the [Sampler](https://github.com/gaelcolas/Sampler)
project runs tests against the built module in the `output` folder, the paths
do not match those of the repository. The key `fixes` converts the paths in
the JaCoCo XML file to the correct paths that [Codecov.io](https://codecov.io)
expects.

See the [codecov.yml Reference](https://docs.codecov.io/docs/codecovyml-reference)
for more information about these settings.

```yaml
codecov:
  require_ci_to_pass: no
  # master should be the baseline for reporting
  branch: master

comment:
  layout: "reach, diff"
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
  - "\d+\.\d+\.\d+\/::source/"  # move path "X.Y.Z/" => "source/"
```

## Add status badge to `README.md`

Finally we should add the status badge to the README.md. Replace
`{repositoryName}` with the actual repository name, e.g. `ComputerManagementDsc`.

```markdown
[![codecov](https://codecov.io/gh/dsccommunity/{repositoryName}/branch/master/graph/badge.svg)](https://codecov.io/gh/dsccommunity/{repositoryName})
```

---
title: "Updating repo with Sampler.GitHubTasks"
date: 2020-03-09
draft: false
author: gaelcolas
---

A lot of improvements have been made to the Sampler module and templates in the last couple 
of weeks, and it's a (small) breaking change that needs a manual update to your repos.

We knew for a long time that Sampler was needed some refactor to make it more testable and
maintainable. A while ago, we took some shortcuts we knew we'd have to refactor
at some point, and we finally did it!

In the last few updates we've re-organised the templates, moved some helper functions into Private/Public folders, and extracted into a new module the tasks that publish releases to
GitHub and create Pull requests with the updated changelog after a release.

One of the benefit is that the tasks now uses the PowerShellForGitHub module produced by
Microsoft instead of some modified fork we had to maintain, and it's decoupled from the core
of Sampler so that if you use Sampler in something else than GitHub, you don't have to pull those dependencies.

As you may know, Sampler has stayed in [development phase](https://semver.org/#spec-item-4) 
until now (v0.x.x) because we knew those refactor and breaking changes would come.

That big milestone being done, we'll soon be promoting the release to `v1.x.x`.

## What has changed

In short, the GitHub tasks are now packaged in the `Sampler.GitHubTasks` module which depends upon the [PowerShellForGitHub](https://github.com/microsoft/PowerShellForGitHub/) module.

To be able to use them in your pipeline, you know have to:
- Declare `Sampler.GitHubTasks` as a Required Module in your `RequiredModules.psd1`.
- Tell `build.yaml` to Import the tasks from this module (on top of importing those from sampler).
- Tell your BuildWorkflow in `build.yaml` to use the `Publish_Release_To_GitHub`
 for your `publish` task if it's not already present.

### RequiredModules

The `RequiredModules.psd1` needs to have `Sampler.GitHubTasks` added like this:
```powershell
@{
    PSDependOptions             = @{
        AddToPath  = $true
        Target     = 'output\RequiredModules'
        Parameters = @{}
    }

    InvokeBuild                 = 'latest'
    PSScriptAnalyzer            = '1.19.0'
    Pester                      = '4.10.1'
    Plaster                     = 'latest'
    Sampler                     = 'latest'

    'Sampler.GitHubTasks'       = 'latest'

    ModuleBuilder               = 'latest'
    MarkdownLinkCheck           = 'latest'
    ChangelogManagement         = 'latest'
    PowerShellForGitHub         = 'latest'
    'DscResource.Test'          = 'latest'
    'DscResource.AnalyzerRules' = 'latest'
    xDscResourceDesigner        = 'latest'
}

```

This will instruct `PSDepend` to pull this module and its dependencies.
As `PowerShellForGitHub` is listed in `Sampler.GitHubTasks`'s RequiredModules,
PSDepend will automatically pull this dependency for your build.

If you want to update your local cache for this repository, remember to call
`build.ps1 -ResolveDependency` once after changing the `RequiredModules.psd1`.

### Build.yaml

In your `Build.yaml` file, you need to tell the build pipeline to load the tasks from
this `Sampler.GitHubTasks` module.  
This can be done by making sure the key `ModuleBuildTasks:` has the following subkey:

```yaml
ModuleBuildTasks:
  Sampler.GitHubTasks:
    - '*.ib.tasks'
```

Also, make sure the `BuildWorkflow:` key has the right tasks
defined for `publish` (but it should already be correct).

```yaml
BuildWorkflow:
# [...]
  publish:
    #- publish_nupkg_to_gallery  # Deploy using Nuget
    - publish_module_to_gallery # Deploy using cmdlet Publish-Module
    - Publish_release_to_GitHub
```

Alternatively, if you don't want to use the GitHub integration, you now know what to remove.

As always, if you need help, come in the [PowerShell Slack](https://aka.ms/PSSLACK), `#dsc` channel and ask for help!
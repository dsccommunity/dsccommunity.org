---
title: "DscResource.Common functions in a DSC module"
date: 2020-01-11T15:45:00+01:00
type: "post"
draft: false
author: johlju
---

### What

This article will explain the steps needed to use a version of the
[DscResource.Common](https://github.com/dsccommunity/DscResource.Common)
module that has been released to the [PowerShell Gallery](https://www.powershellgallery.com/packages/DscResource.Common).

The module DscResource.Common currently has [7 cmdlets](https://github.com/dsccommunity/DscResource.Common#cmdlet).

- `Get-LocalizedData`
- `New-InvalidArgumentException`
- `New-InvalidOperationException`
- `New-NotImplementedException`
- `New-InvalidResultException`
- `New-ObjectNotFoundException`
- `Test-DscParameterState`

### Why

Historically, these functions have been duplicated into many DSC resource
modules. This has resulted in duplication of effort in maintaining them as
well as drift in the code base and feature set with some fixes not being
included. or the same changes. Instead of re-invent the wheel for these
functions, the community can contribute to these functions in one location
that then can be reused by all DSC module repositories.

### How

#### Prerequisites

It is assumed that the DSC module repository is already using
the DSC module Plaster template in the [Sampler](https://github.com/gaelcolas/Sampler)
project, or has been converted to use the new CI pipeline using the steps
mentioned in [Steps to convert a module for continuous delivery](/blog/convert-a-module-for-continuous-delivery/)

#### Update file `RequiredModuled.psd1`

Add a new entry to the file `RequiredModuled.psd1` letting the CI pipeline
know which module and version to download. You should pin the version here
so that breaking changes in the upstream does not affect you.

```powershell
@{
    # ...Previous required modules...

    # Build dependent modules
    'DscResource.Common' = '0.2.0'
}
```

Then resolve CI pipeline dependencies.

```powershell
./build.ps1 -ResolveDependency -task noop
```

#### Update file `Build.yaml`

##### Add a nested module

You should add a nested module configuration to the file `build.yaml`
so that the module is copied from the folder `output/RequiredModules`
at build time. Important to note here that we are not adding it as a
nested module in the module manifest, it will just copy the module to
the folder `Modules` (which is the default for [ModuleBuilder](https://github.com/PoshCode/ModuleBuilder)).

```yaml
####################################################
#   ModuleBuilder Dependent Modules Configuration  #
####################################################

NestedModule:
  DscResource.Common:
    CopyOnly: true
    Path: ./output/RequiredModules/DscResource.Common
    AddToManifest: false
    Exclude: PSGetModuleInfo.xml
```

##### Exclude nested module from tests

Next, you need to exclude this module from the CI pipeline tests phase.
The module has already been tested in its own CI pipeline so no need
for you to test that again. It might also be that the repository has
different quality assurances that DscResource.Common does not (like
naming files differently).

Under the key `Pester:` add an exclude from code coverage.

```yaml
Pester:
  ExcludeFromCodeCoverage:
    - Modules/DscResource.Common
```

Under the key `DscTest:` add an exclude to not run HQRM tests on the module
files.

```yaml
DscTest:
  ExcludeModuleFile:
    - Modules/DscResource.Common
```

#### Update DSC resource module file

For each DSC resource module file that should use a helper function in
the module DscResource.Common you must import the module.

You import the module's folder, not the file `.psd1` or `.psm1`.
The built in functionality of `Import-Module` is used to find the module
manifest. The module is copied using the version number folder
structure, and adding a absolut path to it here would break when you update
to a newer version of the module `DscResource.Common`.

```powershell
$script:resourceHelperModulePath = Join-Path -Path $PSScriptRoot -ChildPath '..\..\Modules\DscResource.Common'

Import-Module -Name $script:resourceHelperModulePath
```

#### Use the common functions

An example of using the common functions is to import localized strings
using `Get-LocalizedData`.

To import the localized strings for the resource add the code below.

```powershell
$script:localizedData = Get-LocalizedData -DefaultUICulture 'en-US'
```

To further see how to use localization see the
[Localization section of the style guidelines](/styleguidelines/localization/)
and to see how to use the common functions see the documentation in the
[DscResource.Common repository](https://github.com/dsccommunity/DscResource.Common).

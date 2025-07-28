---
title: "Your first class-based Microsoft DSC v3 resource"
date: 2025-07-28T00:00:00+01:00
type: "post"
draft: false
author: johlju
---

Microsoft Desired State Configuration (DSC) v3 represents the next generation of configuration management with cross-platform support. By creating class-based resources, you can build reusable components that work across both modern DSC v3 and legacy PSDSC engines. This tutorial walks you through creating your first DSC resource from scratch.

In this tutorial, you learn how to:

- Design class-based DSC resources that support Microsoft DSC v3 capabilities.
- Implement the required lifecycle methods.
- Test your resource locally.
- Run your resource with DSC v3 configuration documents.

## Prerequisites

- PowerShell 7.2 or later installed on Windows, macOS, or Linux
- Basic knowledge of PowerShell scripting and Pester syntax
- A text editor or IDE (Visual Studio Code recommended)

## What is a DSC resource?

A DSC (Desired State Configuration) resource is a building block that tells the engine how to **reach** and **maintain** a desired state. Think of it as a PowerShell class with four lifecycle methods:

| Method     | Purpose                 | Returns                               | Compatibility |
|:-----------|:------------------------|:--------------------------------------|:-------------|
| `Get()`    | Retrieves current state | Hashtable with current values         | All           |
| `Test()`   | Validates desired state | `$true` if compliant, `$false` if not | All           |
| `Set()`    | Applies desired state   | Nothing (void)                        | All           |
| `Export()` | Exports configuration   | Array of resource instances           | V3 only       |

## Why use class-based resources?

Class-based DSC resources offer a modern, object-oriented approach to configuration management in PowerShell. Benefits include:

- **Broad compatibility**: Works with both DSC v3 and legacy PSDSC engines
- **Cleaner code**: Encapsulates logic in a structured, maintainable way
- **Cross-platform support**: Runs on Windows, Linux, and macOS with proper implementation

### Are class-based resources the future of DSC?

While class-based resources are currently the recommended pattern for PowerShell DSC resource authoring, DSC v3 supports multiple languages and resource types. You can author resources in [Go][00], C#, Python and other languages. Class-based resources remain well-supported but may not be the only model in the future.

For example, if your organization migrates from Windows-only infrastructure to a mix of Windows and Linux, or adopts newer versions of PowerShell, class-based resources help ensure your automation investments remain valid and portable across both the new Microsoft DSC v3 engine and the older PSDSC engine.

In the next section, you will learn to set up a project structure with a class-based DSC resource named `DemoDscClass`.

## Step 1: Create the project structure

Create a new folder for your DSC resource module:

  ```bash
  # Create and navigate to project folder
  mkdir DemoDscClass
  cd DemoDscClass
  ```

Your project structure should look like this:

  ```plaintext
  DemoDscClass/
  ├── DemoDscClass.psd1    # Module manifest
  └── DemoDscClass.psm1    # Resource implementation
  ```

> [!IMPORTANT]
> Your module manifest filename must match the project folder name. For example, if your folder is named `DemoDscClass`, your manifest must be `DemoDscClass.psd1`.

## Step 2: Create the module manifest

### Use PowerShell to generate the manifest

  ```powershell
  $manifestParams = @{
      Path                  = '.\DemoDscClass.psd1'
      RootModule            = 'DemoDscClass.psm1'
      DscResourcesToExport  = 'DemoDscClass'
      ModuleVersion         = '0.0.1'
      CompatiblePSEditions  = @('Desktop', 'Core')
      PowerShellVersion     = '5.1'
  }

  New-ModuleManifest @manifestParams
  ```

### Or create manually

You can also create `DemoDscClass.psd1` using any text editor:

  ```powershell
  @{
      RootModule = 'DemoDscClass.psm1'
      ModuleVersion = '0.0.1'
      CompatiblePSEditions = 'Desktop', 'Core'
      GUID = '03ac4e95-e504-468d-add4-f099e2368239' # Change the GUID using New-Guid command
      Author = 'username'
      CompanyName = 'Unknown'
      Copyright = '(c) developer. All rights reserved.'
      PowerShellVersion = '5.1'
      FunctionsToExport = '*'
      CmdletsToExport = '*'
      VariablesToExport = '*'
      AliasesToExport = '*'
      DscResourcesToExport = 'DemoDscClass'
      PrivateData = @{
          PSData = @{
          }
      }
  }
  ```

> [!NOTE]
> More properties are available to set. For more information, read the article [about_Module_Manifest][01]

## Step 3: Implement the resource class

### Define the class structure

Create `DemoDscClass.psm1` and add the basic class definition:

  ```powershell
  [DscResource()]                   # Marks this class as a DSC resource for discovery
  class DemoDscClass {
      [DscProperty(Key)]            # Key property (uniquely identifies resource)
      [System.String] $Key

      [DscProperty()]               # Optional property
      [System.String] $OptionalProperty

      DemoDscClass() {              # Constructor (optional)
        # initialization logic here
      }
  }
  ```

### Add the Get() method

The `Get()` method retrieves the current state:

  ```powershell
      [DemoDscClass] Get() {
          Write-Verbose -Message 'Get called'

          $currentState = @{
            Key = $this.Key
          }

          return $currentState
      }
  ```

### Add the Test() method

The `Test()` method checks if the current state matches the desired state:

```powershell
    [System.Boolean] Test() {
        Write-Verbose -Message 'Test called - always returns $false to demo Set()'

        return $false             # Always returns false for demo
    }
```

### Add the Set() method

The `Set()` method applies the desired state:

```powershell
    [void] Set() {
        Write-Verbose -Message 'Set called - no changes are applied for demo'
    }
```

### Add the Export() method

The `Export()` method exports every instance of a set of resources in Microsoft DSC v3.

```powershell
    static [DemoDscClass[]] Export() {
        Write-Verbose -Message 'Export called - returning three demo instances'

        $resultList = [System.Collections.Generic.List[DemoDscClass]]::new()

        1..3 | ForEach-Object -Process {
            $obj = New-Object DemoDscClass
            $obj.Key = 'Demo{0}' -f $_
            $obj.OptionalProperty = 'Value of OptionalProperty for Demo{0}' -f $_

            $resultList.Add($obj)
        }

        return $resultList.ToArray()
    }
```

You can only call the `Export()` method by instantiating the class. Prior DSC versions can't directly invoke the capability. Also remember, not all classes should implement `Export()`. Always ask two questions:

1. Does it make sense to implement `Export()`?
2. Is it a cheap operation to perform?

> [!INFO]
> For example, exporting all Windows services from a machine makes sense and is relatily cheap. Exporting the whole registry _might_ make sense, but isn't a cheap operation to perform.

### Complete class implementation

Here's the complete `DemoDscClass.psm1` file:

  ```powershell
  [DscResource()] # Attribute marking class as DSC resource
  class DemoDscClass {
      [DscProperty(Key)] # Declares a key property (must uniquely identify the resource instance), at least one key property is required for all DSC resources
      [System.String] $Key

      [DscProperty()]
      [System.String] $OptionalProperty # Optional DSC property

      DemoDscClass() {
        # init logic here
      }

      [DemoDscClass] Get() { # Returns the current state as a hashtable (DSC accepts either a class instance or a hashtable)
          Write-Verbose -Message 'Get called'

          $currentState = @{
            Key = $this.Key
          }

          return $currentState
      }

      [System.Boolean] Test() {
        # Checks if the current state matches the desired state        Write-Verbose -Message 'Test called - always returns $false to demo Set()'
        return $false # Always returns false to force Set() for demo
      }

      [void] Set() { # Applies the desired state (no-op in this demo)
          Write-Verbose -Message 'Set called - no changes are applied for demo'
      }

      static [DemoDscClass[]] Export() { # New capability in Microsoft DSC v3
          Write-Verbose -Message 'Export called - returning three demo instances'

          $resultList = [System.Collections.Generic.List[DemoDscClass]]::new()

          1..3 | ForEach-Object -Process { # In a real resource, return an array of actual resource instances
              $obj = New-Object DemoDscClass
              $obj.Key = 'Demo{0}' -f $_
              $obj.OptionalProperty = 'Value of OptionalProperty for Demo{0}' -f $_

              $resultList.Add($obj)
          }

          return $resultList.ToArray()
      }
  }
  ```

It's time to install Microsoft DSC v3 and test out the class using `dsc`.

## Step 4: Install Microsoft DSC v3

To easily install the `dsc` executable, you can use the [PSDSC][02] PowerShell community module.

> [!INFO]
> The community module only works on PowerShell 7.

### Install using PowerShell

```powershell
Install-PSResource PSDSC -TrustRepository -Quiet
Install-DscExe -IncludePrerelease -Force
dsc --version
```

> [!NOTE]
> The command also works on other platforms. You can also grab the asset on [GitHub][03] for the platform you're working on.

## Step 5: Test your resource

### Make PowerShell find your resource

Add your project folder to the module path:

```powershell
$env:PSModulePath += [System.IO.Path]::PathSeparator + (Split-Path -Path (Get-Location) -Parent)
```

This commands adds your current directory to be searchable. PowerShell can now find your DSC resource when you list or invoke capabilities against it.

### List available resources

```powershell
dsc resource list --adapter Microsoft.DSC/PowerShell
```

If you want to find the `DemoDscClass`, you can filter on it:

```powershell
dsc resource list --adapter Microsoft.DSC/PowerShell DemoDscClass*
```

You should see `DemoDscClass` in the list.

### Test lifecycle operations

```powershell
$desiredParameters = @{ Key = 'Demo' } | ConvertTo-Json -Compress

# Get current state
dsc resource get --resource DemoDscClass/DemoDscClass --input $desiredParameters

# Test compliance
dsc resource test --resource DemoDscClass/DemoDscClass --input $desiredParameters

# Apply configuration
dsc resource set --resource DemoDscClass/DemoDscClass --input $desiredParameters

# Export instances
dsc resource export --resource DemoDscClass/DemoDscClass
```

> [!TIP]
> To see detailed trace logs, add the `--trace-level trace` parameter to any DSC command. DSC's default output is YAML if nothing is piped. If you want the raw JSON, you can add the `--output-format json` option.

## Step 6: Use configuration documents

You can also define a configuration document, allowing you to define multiple resource instances. The next section illustrates how you can create such a configuration document.

### Create a configuration document

Create `demo.dsc.config.yaml`:

```yaml
$schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
resources:
  - name: Demo Dsc Class
    type: Microsoft.DSC/PowerShell
    properties:
      resources:
        - name: Demo Dsc Class 1
          type: DemoDscClass/DemoDscClass
          properties:
            Key: Demo
```

### Run configuration commands

```sh
# Get current state
dsc config get --file demo.dsc.config.yaml

# Test compliance
dsc config test --file demo.dsc.config.yaml

# Apply configuration
dsc config set --file demo.dsc.config.yaml

# Export configuration
dsc config export --file demo.dsc.config.yaml
```

### Use implicit syntax (optional)

Microsoft DSC v3 allows you to implicitly call the DSC class-based resource. Create `demo-implicit.dsc.config.yaml` for a simpler approach:

```yaml
$schema: https://aka.ms/dsc/schemas/v3/bundled/config/document.json
resources:
  - name: Demo Dsc Class 1
    type: DemoDscClass/DemoDscClass
    properties:
      Key: Demo
```

You can now run the configuration file with the same commands ran earlier.

> [!WARNING]
> Using implicit syntax comes at a performance cost. Each adapter runs through the DSC engine to find the relative DSC resource. If you run this command for the first time, it can take a while as no caching has taken place.

## Step 7: Write tests with Pester

### Install Pester

```powershell
Install-PSResource -Name Pester
```

### Create test file

Create `DemoDscClass.tests.ps1`:

```powershell
BeforeAll {
    $modulePath = $PSScriptRoot
    Import-Module "$modulePath/DemoDscClass.psd1" -Force
}

Describe 'DemoDscClass' {
    Context 'Get() method' {
        It 'Returns the same Key in Get()' {
            $desiredParameters = @{ Key = 'X' } | ConvertTo-Json -Compress
            $out = dsc resource get --resource DemoDscClass/DemoDscClass --input $desiredParameters | ConvertFrom-Json
            $out.actualState.Key | Should -Be 'X'
        }
    }

    Context 'Export() method' {
        It 'Returns multiple instances in Export()' {
            $outArray = dsc resource export --resource DemoDscClass/DemoDscClass | ConvertFrom-Json
            $outArray.resources | Should -HaveCount 3
            $outArray.resources[0].properties.Key | Should -BeLike 'Demo*'
        }
    }
}
```

### Run tests

```powershell
Invoke-Pester -Script ./DemoDscClass.tests.ps1 -Output Detailed
```

> [!WARNING]
> PowerShell cannot reload class definitions in the current session. After modifying a class, you must restart PowerShell for changes to take effect.

## Troubleshooting

### DSC executable not found

If you receive an error when running `dsc`, verify the installation:

```powershell
# Check if dsc is in PATH
Get-Command dsc -ErrorAction SilentlyContinue

# If not found, add to PATH for current session (Windows only)
$env:PATH += [System.IO.Path]::PathSeparator + (Join-Path -Path $env:LOCALAPPDATA -ChildPath 'dsc')
```

### JSON parsing errors

If you encounter the following error:

  ```plaintext
  ERROR Operation: Failed to parse JSON from 'get': executable = 'pwsh' stdout = 'VERBOSE: Get called
  {"result":[{"name":"DemoDscClass/DemoDscClass","type":"DemoDscClass/DemoDscClass","properties":{"Key":"Demo"}}]}
  ' stderr = '' -> expected value at line 1 column 1
  ```

You should remove any output that clutters the STDIN:

```powershell
# Remove these from your methods:
Write-Verbose "message"  # Causes JSON parsing issues
Write-Warning "message"  # Causes JSON parsing issues
Write-Debug "message" # Causes JSON parsing issues
```

> [!INFO]
> The issue is currently open on [GitHub](https://github.com/PowerShell/DSC/issues/833).

## Publish your resource (optional)

To share your resource on PowerShell Gallery:

```powershell
Publish-PSResource -Path .\ -Repository PSGallery -ApiKey <YOUR-API-KEY>
```

## Review and next steps

Congratulations – you have built, tested, and executed your very first class-based DSC v3 resource!

By following this guide, you have learned how to:

1. Create a project folder and module manifest.
2. Author a PowerShell class with Get(), Test(), Set(), and Export() methods.
3. Perform smoke tests using the DSC executable.
4. Define configuration files in YAML and run them.
5. Write Pester tests to verify resource behavior.

### Next steps

Now that you've created your first DSC class-based resource, explore these advanced topics:

- Extend `DemoDscClass` with additional properties and real-world logic, such as file or registry management.
- Implement more checks in `Test()` to detect actual configuration drift.
- Practice packaging and publishing your module to the PowerShell Gallery.
- Engage with the PowerShell DSC community through blogs, forums, and GitHub.

## Related content

- [DSC resources](https://learn.microsoft.com/en-us/powershell/dsc/concepts/resources/overview?view=dsc-3.0)
- [Add unit tests with Pester](https://pester.dev/docs/quick-start)
- [Implement cross-platform support](https://learn.microsoft.com/powershell/dsc/concepts/cross-platform)
- [The DSC V3 Handbook](https://leanpub.com/thedscv3handbook/)
- [Publish to PowerShell Gallery](https://learn.microsoft.com/powershell/gallery/how-to/publishing-packages/publishing-a-package)
- [DSC v3 overview](https://learn.microsoft.com/powershell/dsc/overview)
- [Class-based DSC resources](https://learn.microsoft.com/powershell/dsc/concepts/class-based-resources)
- [DSC configuration documents](https://learn.microsoft.com/powershell/dsc/concepts/configurations)
- [Writing a custom DSC resource with PowerShell classes](https://learn.microsoft.com/powershell/dsc/resources/authoringresourceclass?view=dsc-1.1)
- [DSC v3 Samples on GitHub](https://github.com/PowerShell/DSC-Samples)

<!-- Link reference definitions -->
[00]: https://powershell.github.io/DSC-Samples/languages/go/first-resource/
[01]: https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_module_manifests
[02]: https://www.powershellgallery.com/packages/PSDSC/
[03]: https://github.com/PowerShell/Dsc?tab=readme-ov-file#installing-dscv3

---
title: "General Best Practices"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 7
---

Although adopting the _best practices_ is optional, doing so will help improve the
quality of the DSC resource module.

Note: Modules that aim to meet the [High Quality Resource Module](HighQualityModuleGuidelines.md)
standards must also implement the _best practices_ wherever possible.

## Avoid Using ard coded Computer Name

Using hard coded computer names exposes sensitive information on your machine.
Use a parameter or environment variable instead if a computer name is necessary.
This comes from [this](https://github.com/PowerShell/PSScriptAnalyzer/blob/development/RuleDocumentation/AvoidUsingComputerNameHardcoded.md)
PS Script Analyzer rule.

**Bad:**

```powershell
Invoke-Command -Port 0 -ComputerName 'hardcodedName'
```

**Good:**

```powershell
Invoke-Command -Port 0 -ComputerName $env:computerName
```

## Avoid Empty Catch Blocks

Empty catch blocks are not necessary.
Most errors should be thrown or at least acted upon in some way.
If you really don't want an error to be thrown or logged at all, use the ErrorAction
parameter with the SilentlyContinue value instead.

**Bad:**

```powershell
try
{
    Get-Command -Name Invoke-NotACommand
}
catch {}
```

**Good:**

```powershell
Get-Command -Name Invoke-NotACommand -ErrorAction SilentlyContinue
```

## Ensure Null is on Left Side of Comparisons

When comparing a value to ```$null```, ```$null``` should be on the left side of
the comparison.
This is due to an issue in PowerShell.
If ```$null``` is on the right side of the comparison and the value you are comparing
it against happens to be a collection, PowerShell will return true if the collection
*contains* ```$null``` rather than if the entire collection actually *is* ```$null```.
Even if you are sure your variable will never be a collection, for consistency,
please ensure that ```$null``` is on the left side of all comparisons.

**Bad:**

```powershell
if ($myArray -eq $null)
{
    Remove-AllItems
}
```

**Good:**

```powershell
if ($null -eq $myArray)
{
    Remove-AllItems
}
```

## Avoid Global Variables

Avoid using global variables whenever possible.
These variables can be edited by any other script that ran before your script or
is running at the same time as your script.
Use them only with extreme caution, and try to use parameters or script/local
variables instead.

This rule has a few exceptions:

- The use of ```$global:DSCMachineStatus``` is still recommended to restart a
  machine from a DSC resource.

**Bad:**

```powershell
$global:configurationName = 'MyConfigurationName'
...
Set-MyConfiguration -ConfigurationName $global:configurationName
```

**Good:**

```powershell
$script:configurationName = 'MyConfigurationName'
...
Set-MyConfiguration -ConfigurationName $script:configurationName
```

## Use Declared Local and Script Variables More Than Once

Don't declare a local or script variable if you're not going to use it.
This creates excess code that isn't needed

## Use PSCredential for All Credentials

PSCredentials are more secure than using plaintext username and passwords.

**Bad:**

```powershell
function Get-Settings
{
    param
    (
        [String]
        $Username

        [String]
        $Password
    )
    ...
}
```

**Good:**

```powershell
function Get-Settings
{
    param
    (
        [PSCredential]
        [Credential()]
        $UserCredential
    )
}
```

## Use Variables Rather Than Extensive Piping

This is a script not a console. Code should be easy to follow. There should be no
more than 1 pipe in a line. This rule is specific to the DSC Resource Kit - other
PowerShell best practices may say differently, but this is our preferred format
for readability.

**Bad:**

```powershell
Get-Objects | Where-Object { $_.Propery -ieq 'Valid' } | Set-ObjectValue `
    -Value 'Invalid' | Foreach-Object { Write-Output $_ }
```

**Good:**

```powershell
$validPropertyObjects = Get-Objects | Where-Object { $_.Property -ieq 'Valid' }

foreach ($validPropertyObject in $validPropertyObjects)
{
    $propertySetResult = Set-ObjectValue $validPropertyObject -Value 'Invalid'
    Write-Output $propertySetResult
}
```

## Avoid Unnecessary Type Declarations

If it is clear what type a variable is then it is not necessary to explicitly
declare its type. Extra type declarations can clutter the code.

**Bad:**

```powershell
[String] $myString = 'My String'
```

**Bad:**

```powershell
[System.Boolean] $myBoolean = $true
```

**Good:**

```powershell
$myString = 'My String'
```

**Good:**

```powershell
$myBoolean = $true
```

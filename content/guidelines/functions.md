---
title: "Functions"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 4
---

## Function Names Use Pascal Case

Function names must use PascalCase.  This means that each concatenated word is capitalized.

**Bad:**

```powershell
function get-targetresource
{
    # ...
}
```

**Good:**

```powershell
function Get-TargetResource
{
    # ...
}
```

## Function Names Use Verb-Noun Format

All function names must follow the standard PowerShell Verb-Noun format.

**Bad:**

```powershell
function TargetResourceGetter
{
    # ...
}
```

**Good:**

```powershell
function Get-TargetResource
{
    # ...
}
```

## Function Names Use Approved Verbs

All function names must use [approved verbs](https://msdn.microsoft.com/en-us/library/ms714428(v=vs.85).aspx).

**Bad:**

```powershell
function Normalize-String
{
    # ...
}
```

**Good:**

```powershell
function ConvertTo-NormalizedString
{
    # ...
}
```

## Functions Have Comment-Based Help

All functions should have comment-based help with the correct syntax directly
above the function. Comment-help should include at least the SYNOPSIS section and
a PARAMETER section for each parameter.

**Bad:**

```powershell
# Creates an event
function New-Event
{
    param
    (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [String]
        $Message,

        [Parameter()]
        [ValidateSet('operational', 'debug', 'analytic')]
        [String]
        $Channel = 'operational'
    )
    # Implementation...
}
```

**Good:**

```powershell
<#
    .SYNOPSIS
        Creates an event

    .PARAMETER Message
        Message to write

    .PARAMETER Channel
        Channel where message should be stored

    .EXAMPLE
        New-Event -Message 'Attempting to connect to server' -Channel 'debug'
#>
function New-Event
{
    param
    (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [String]
        $Message,

        [Parameter()]
        [ValidateSet('operational', 'debug', 'analytic')]
        [String]
        $Channel = 'operational'
    )
    # Implementation
}
```

## Parameter Block at Top of Function

There must be a parameter block declared for every function.
The parameter block must be at the top of the function and not declared next to
the function name. Functions with no parameters should still display an empty
parameter block.

**Bad:**

```powershell
function Write-Text([Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][String]$Text)
{
    Write-Verbose -Message $Text
}
```

**Bad:**

```powershell
function Write-Nothing
{
    Write-Verbose -Message 'Nothing'
}
```

**Good:**

```powershell
function Write-Text
{
    param
    (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [String]
        $Text
    )

    Write-Verbose -Message $Text
}
```

**Good:**

```powershell
function Write-Nothing
{
    param ()

    Write-Verbose -Message 'Nothing'
}
```

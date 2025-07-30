---
title: "Parameters"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 5
---

## Correct Format for Parameter Block

- An empty parameter block should be displayed on its own line like this:
  `param ()`.
- A non-empty parameter block should have the opening and closing parentheses on
  their own line.
- All text inside the parameter block should be indented once.
- Every parameter should include the `[Parameter()]` attribute, regardless of
  whether the attribute requires decoration or not.
- A parameter that is mandatory should contain this decoration:
  `[Parameter(Mandatory = $true)]`.
- A parameter that is not mandatory should _not_ contain a `Mandatory` decoration
  in the `[Parameter()]`.

**Bad:**

```powershell
function Write-Nothing
{
    param
    (

    )

    Write-Verbose -Message 'Nothing'
}
```

**Bad:**

```powershell
function Write-Text
{
    param([Parameter(Mandatory = $true)]
[ValidateNotNullOrEmpty()]
                    [String] $Text )

    Write-Verbose -Message $Text
}
```

**Bad:**

```powershell
function Write-Text
{
    param
    (
        [Parameter(Mandatory)]
        [ValidateNotNullOrEmpty()]
        [String]
        $Text

        [Parameter(Mandatory = $false)]
        [ValidateNotNullOrEmpty()]
        [String]
        $PrefixText

        [Boolean]
        $AsWarning = $false
    )

    if ($AsWarning)
    {
        Write-Warning -Message "$PrefixText - $Text"
    }
    else
    {
        Write-Verbose -Message "$PrefixText - $Text"
    }
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
function Write-Text
{
    param
    (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [String]
        $Text

        [Parameter()]
        [ValidateNotNullOrEmpty()]
        [String]
        $PrefixText

        [Parameter()]
        [Boolean]
        $AsWarning = $false
    )

    if ($AsWarning)
    {
        Write-Warning -Message "$PrefixText - $Text"
    }
    else
    {
        Write-Verbose -Message "$PrefixText - $Text"
    }
}
```

## Parameter Names Use Pascal Case

All parameters must use PascalCase.  This means that each concatenated word is capitalized.

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param
    (
        $SOURCEPATH
    )
}
```

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param
    (
        $sourcepath
    )
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param
    (
        [Parameter()]
        $SourcePath
    )
}
```

## Parameters Separated by One Line

Parameters must be separated by a single, blank line.

**Bad:**

```powershell
function New-Event
{
    param
    (
        [Parameter(Mandatory = $true)]
        [ValidateNotNullOrEmpty()]
        [String]
        $Message,
        [ValidateSet('operational', 'debug', 'analytic')]
        [String]
        $Channel = 'operational'
    )
}
```

**Good:**

```powershell
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
}
```

## Parameter Type on Line Above

The parameter type must be on its own line above the parameter name.
If an attribute needs to follow the type, it should also have its own line between
the parameter type and the parameter name.

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param
    (
        [String] $SourcePath = 'c:\'
    )
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param
    (
        [Parameter()]
        [String]
        $SourcePath = 'c:\'
    )
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param
    (
        [Parameter()]
        [PSCredential]
        [Credential()]
        $MyCredential
    )
}
```

**Good:**

```powershell
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
}
```

## Parameter Attributes on Separate Lines

Parameter attributes should each have their own line.
All attributes should go above the parameter type, except those that *must* be
between the type and the name.

**Bad:**

```powershell
function New-Event
{
    param
    (
        [Parameter(Mandatory = $true)][ValidateNotNullOrEmpty()][String]
        $Message,

        [ValidateSet('operational', 'debug', 'analytic')][String]
        $Channel = 'operational'
    )
}
```

**Good:**

```powershell
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
}
```

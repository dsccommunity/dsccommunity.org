---
title: "Whitespace"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 3
---

## Indentation

For all indentation, use **4** spaces instead of tabs.
There should be no tab characters in the file unless they are in a here-string.

## No Trailing Whitespace After Backticks

Backticks should always be directly followed by a newline

## Newline at End of File

All files must end with a newline, see [StackOverflow.](http://stackoverflow.com/questions/5813311/no-newline-at-end-of-file)

## Newline Character Encoding

Save [newlines](http://en.wikipedia.org/wiki/Newline) using CR+LF instead of CR.
For interoperability reasons, we recommend that you follow [these instructions](GettingStartedWithGitHub.md#setup-git)
when installing Git on Windows so that newlines saved to GitHub are simply CRs.

## No More Than Two Consecutive Newlines

Code should not contain more than two consecutive newlines unless they are contained
in a here-string.

**Bad:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'


    return $MyValue
}
```

**Bad:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'
    return $MyValue
}

function Write-Log
{
    Write-Verbose -Message 'Logging...'
}
```

**Good:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'
    return $MyValue
}
```

**Good:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'
    return $MyValue
}

function Write-Log
{
    Write-Verbose -Message 'Logging...'
}
```

## One Newline Before Braces

Each curly brace should be preceded by a newline unless assigning to a variable.

**Bad:**

```powershell
if ($booleanValue) {
    Write-Verbose -Message "Boolean is $booleanValue"
}
```

**Good:**

```powershell
if ($booleanValue)
{
    Write-Verbose -Message "Boolean is $booleanValue"
}
```

When assigning to a variable, opening curly braces should be on the same line as
the assignment operator.

**Bad:**

```powershell
$scriptBlockVariable =
{
    Write-Verbose -Message 'Executing script block'
}
```

**Bad:**

```powershell
$hashtableVariable =
@{
    Key1 = 'Value1'
    Key2 = 'Value2'
}
```

**Good:**

```powershell
$scriptBlockVariable = {
    Write-Verbose -Message 'Executing script block'
}
```

**Good:**

```powershell
$hashtableVariable = @{
    Key1 = 'Value1'
    Key2 = 'Value2'
}
```

## One Newline After Opening Brace

Each opening curly brace should be followed by only one newline.

**Bad:**

```powershell
function Get-MyValue
{

    Write-Verbose -Message 'Getting MyValue'

    return $MyValue
}
```

**Bad:**

```powershell
function Get-MyValue
{ Write-Verbose -Message 'Getting MyValue'

    return $MyValue
}
```

**Good:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'
    return $MyValue
}
```

## Two Newlines After Closing Brace

Each closing curly brace **ending** a function, conditional block, loop, etc.
should be followed by exactly two newlines unless it is directly followed by another
closing brace. If the closing brace is followed by another closing brace or continues
a conditional or switch block, there should be only one newline after the closing
brace.

**Bad:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'
    return $MyValue
} Get-MyValue
```

**Bad:**

```powershell
function Get-MyValue
{ Write-Verbose -Message 'Getting MyValue'

    if ($myBoolean)
    {
        return $MyValue
    }

    else
    {
        return 0
    }

}
Get-MyValue
```

**Good:**

```powershell
function Get-MyValue
{
    Write-Verbose -Message 'Getting MyValue'

    if ($myBoolean)
    {
        return $MyValue
    }
    else
    {
        return 0
    }
}

Get-MyValue
```

## One Space Between Type and Variable Name

If you must declare a variable type, type declarations should be separated from
the variable name by a single space.

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    [Int]$number = 2
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    [Int] $number = 2
}
```

## One Space on Either Side of Operators

There should be one blank space on either side of all operators.

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    $number=2+4-5*9/6
}
```

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    if ('example'-eq'example'-or'magic')
    {
        Write-Verbose -Message 'Example found.'
    }
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    $number = 2 + 4 - 5 * 9 / 6
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    if ('example' -eq 'example' -or 'magic')
    {
        Write-Verbose -Message 'Example found.'
    }
}
```

## One Space Between Keyword and Parenthesis

If a keyword is followed by a parenthesis, there should be single space between
the keyword and the parenthesis.

**Bad:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    if('example' -eq 'example' -or 'magic')
    {
        Write-Verbose -Message 'Example found.'
    }

    foreach($example in $examples)
    {
        Write-Verbose -Message $example
    }
}
```

**Good:**

```powershell
function Get-TargetResource
{
    [CmdletBinding()]
    param ()

    if ('example' -eq 'example' -or 'magic')
    {
        Write-Verbose -Message 'Example found.'
    }

    foreach ($example in $examples)
    {
        Write-Verbose -Message $example
    }
}
```

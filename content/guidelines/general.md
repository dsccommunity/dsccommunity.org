---
title: "General"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 2
---

## Correct File Encoding

Make sure all files are encoded using UTF-8 (not UTF-8 with BOM), except mof files
which should be encoded using ASCII.
You can use ```ConvertTo-UTF8``` and ```ConvertTo-ASCII``` to convert a file to
UTF-8 or ASCII.

## Descriptive Names

Use descriptive, clear, and full names for all variables, parameters, and functions.
All names must be at least more than **2** characters.
No abbreviations should be used.

**Bad:**

```powershell
$r = Get-RdsHost
```

**Bad:**

```powershell
$frtytw = 42
```

**Bad:**

```powershell
function Get-Thing
{
    ...
}
```

**Bad:**

```powershell
function Set-ServerName
{
    param
    (
        $mySTU
    )
    ...
}
```

**Good:**

```powershell
$remoteDesktopSessionHost = Get-RemoteDesktopSessionHost
```

**Good:**

```powershell
$fileCharacterLimit = 42
```

**Good:**

```powershell
function Get-ArchiveFileHandle
{
    ...
}
```

**Good:**

```powershell
function Set-ServerName
{
    param
    (
        [Parameter()]
        $myServerToUse
    )
    ...
}
```

## Correct Parameter Usage in Function and Cmdlet Calls

Use named parameters for function and cmdlet calls rather than positional parameters.
Named parameters help other developers who are unfamiliar with your code to better
understand it.

When calling a function with many long parameters, use parameter splatting. If
splatting is used, then all the parameters should be in the splat.
More help on splatting can be found in the article
[About Splatting](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_splatting).

Make sure hashtable parameters are still properly formatted with multiple lines
and the proper indentation.

**Bad:**

Not using named parameters.

```powershell
Get-ChildItem C:\Documents *.md
```

**Bad:**

The call is very long and will wrap a lot in the review tool when the code is
viewed by the reviewer during the review process of the PR.

```powershell
$mySuperLongHashtableParameter = @{
    MySuperLongKey1 = 'MySuperLongValue1'
    MySuperLongKey2 = 'MySuperLongValue2'
}

$superLongVariableName = Get-MySuperLongVariablePlease -MySuperLongHashtableParameter  $mySuperLongHashtableParameter -MySuperLongStringParameter '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' -Verbose
```

**Bad:**

Hashtable is not following [Correct Format for Hashtables or Objects](https://github.com/PowerShell/DscResources/blob/master/StyleGuidelines.md#correct-format-for-hashtables-or-objects).

```powershell
$superLongVariableName = Get-MySuperLongVariablePlease -MySuperLongHashtableParameter @{ MySuperLongKey1 = 'MySuperLongValue1'; MySuperLongKey2 = 'MySuperLongValue2' } -MySuperLongStringParameter '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' -Verbose
```

**Bad:**

Hashtable is not following [Correct Format for Hashtables or Objects](https://github.com/PowerShell/DscResources/blob/master/StyleGuidelines.md#correct-format-for-hashtables-or-objects).

```powershell
$superLongVariableName = Get-MySuperLongVariablePlease -MySuperLongHashtableParameter @{ MySuperLongKey1 = 'MySuperLongValue1'; MySuperLongKey2 = 'MySuperLongValue2' } `
                                                       -MySuperLongStringParameter '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' `
                                                       -Verbose
```

**Bad:**

Hashtable is not following [Correct Format for Hashtables or Objects](https://github.com/PowerShell/DscResources/blob/master/StyleGuidelines.md#correct-format-for-hashtables-or-objects).

```powershell
$superLongVariableName = Get-MySuperLongVariablePlease `
    -MySuperLongHashtableParameter @{ MySuperLongKey1 = 'MySuperLongValue1'; MySuperLongKey2 = 'MySuperLongValue2' } `
    -MySuperLongStringParameter '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' `
    -Verbose
```

**Bad:**

Passing parameter (`Verbose`) outside of the splat.

```powershell
$getMySuperLongVariablePleaseParameters = @{
    MySuperLongHashtableParameter = @{
        MySuperLongKey1 = 'MySuperLongValue1'
        MySuperLongKey2 = 'MySuperLongValue2'
    }
    MySuperLongStringParameter = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
}

$superLongVariableName = Get-MySuperLongVariablePlease @getMySuperLongVariablePleaseParameters -Verbose
```

**Good:**

```powershell
Get-ChildItem -Path C:\Documents -Filter *.md
```

**Good:**

```powershell
$superLongVariableName = Get-MyVariablePlease -MyStringParameter '123456789012349012345678901234567890' -Verbose
```

**Good:**

```powershell
$superLongVariableName = Get-MyVariablePlease -MyString1 '1234567890' -MyString2 '1234567890' -MyString3 '1234567890' -Verbose
```

**Good:**

```powershell
$mySuperLongHashtableParameter = @{
    MySuperLongKey1 = 'MySuperLongValue1'
    MySuperLongKey2 = 'MySuperLongValue2'
}

$superLongVariableName = Get-MySuperLongVariablePlease -MySuperLongHashtableParameter $mySuperLongHashtableParameter -Verbose
```

**Good:**

Splatting all parameters.

```powershell
$getMySuperLongVariablePleaseParameters = @{
    MySuperLongHashtableParameter = @{
        MySuperLongKey1 = 'MySuperLongValue1'
        MySuperLongKey2 = 'MySuperLongValue2'
    }
    MySuperLongStringParameter = '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890'
    Verbose = $true
}

$superLongVariableName = Get-MySuperLongVariablePlease @getMySuperLongVariablePleaseParameters
```

**Good:**

```powershell
$superLongVariableName = Get-MySuperLongVariablePlease `
    -MySuperLongHashtableParameter @{
        MySuperLongKey1 = 'MySuperLongValue1'
        MySuperLongKey2 = 'MySuperLongValue2'
    } `
    -MySuperLongStringParameter '123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890' `
    -Verbose
```

## Correct Format for Arrays

Arrays should be written in one of the following formats.

If an array is declared on a single line, then there should be a single space
between each element in the array. If arrays written on a single line tend to be
long, please consider using one of the alternative ways of writing the array.

**Bad:**

Array elements are not format consistently.

```powershell
$array = @( 'one', `
'two', `
'three'
)
```

**Bad:**

There are no single space beetween the elements in the array.

```powershell
$array = @('one','two','three')
```

**Bad:**

There are multiple array elements on the same row.

```powershell
$array = @(
    'one', 'two', `
    'my long string example', `
    'three', 'four'
)
```

**Bad:**

Hashtable is not following [Correct Format for Hashtables or Objects](https://github.com/PowerShell/DscResources/blob/master/StyleGuidelines.md#correct-format-for-hashtables-or-objects).

```powershell
$array = @(
    'one',
    @{MyKey = 'MyValue'},
    'three'
)
```

**Bad:**

Hashtables are not following [Correct Format for Hashtables or Objects](https://github.com/PowerShell/DscResources/blob/master/StyleGuidelines.md#correct-format-for-hashtables-or-objects).

```powershell
$myArray = @(
    @{Key1 = Value1;Key2 = Value2},
    @{Key1 = Value1;Key2 = Value2}
)
```

**Good:**

```powershell
$array = @('one', 'two', 'three')
```

**Good:**

```powershell
$array = @(
    'one',
    'two',
    'three'
)
```

**Good:**

```powershell
$array = @(
    'one'
    'two'
    'three'
)
```

**Good:**

```powershell
$hashtable = @{
    Key = "Value"
}

$array = @( 'one', 'two', 'three', $hashtable )
```

**Good:**

```powershell
$hashtable = @{
    Key = "Value"
}

$array = @(
    'one',
    'two',
    'three',
    $hashtable
)
```

**Good:**

```powershell
$myArray = @(
    @{
        Key1 = Value1
        Key2 = Value2
    },
    @{
        Key1 = Value1
        Key2 = Value2
    }
)
```

## Correct Format for Hashtables or Objects

Hashtables and Objects should be written in the following format.
Each property should be on its own line indented once.

**Bad:**

```powershell
$hashtable = @{Key1 = 'Value1';Key2 = 2;Key3 = '3'}
```

**Bad:**

```powershell
$hashtable = @{ Key1 = 'Value1'
Key2 = 2
Key3 = '3' }
```

**Good:**

```powershell
$hashtable = @{
    Key1 = 'Value1'
    Key2 = 2
    Key3 = '3'
}
```

**Good:**

```powershell
$hashtable = @{
    Key1 = 'Value1'
    Key2 = 2
    Key3 = @{
        Key3Key1 = 'ExampleText'
        Key3Key2 = 42
    }
}
```

## Correct use of single- and double quotes

Single quotes should always be used to delimit string literals wherever possible.
Double quoted string literals may only be used when it contains ($) expressions
that need to be evaluated.

**Bad:**

```powershell
$string = "String that do not evaluate variable"
```

**Bad:**

```powershell
$string = "String that evaluate variable {0}" -f $SomeObject.SomeProperty
```

**Good:**

```powershell
$string = 'String that do not evaluate variable'
```

**Good:**

```powershell
$string = 'String that evaluate variable {0}' -f $SomeObject.SomeProperty
```

**Good:**

```powershell
$string = "String that evaluate variable $($SomeObject.SomeProperty)"
```

**Good:**

```powershell
$string = 'String that evaluate variable ''{0}''' -f $SomeObject.SomeProperty
```

**Good:**

```powershell
$string = "String that evaluate variable '{0}'" -f $SomeObject.SomeProperty
```

## Correct Format for Comments

There should not be any commented-out code in checked-in files.
The first letter of the comment should be capitalized.

Single line comments should be on their own line and start with a single pound-sign
followed by a single space. The comment should be indented the same amount as the
following line of code.

Comments that are more than one line should use the ```<# #>``` format rather
than the single pound-sign. The opening and closing brackets should be on their
own lines. The comment inside the brackets should be indented once more than the
brackets. The brackets should be indented the same amount as the following line
of code.

Formatting help-comments for functions has a few more specific rules that can be
found [here](#all-functions-must-have-comment-based-help).

**Bad:**

```powershell
function Get-MyVariable
{#this is a bad comment
    [CmdletBinding()]
    param ()
#this is a bad comment
    foreach ($example in $examples)
    {
        Write-Verbose -Message $example #this is a bad comment
    }
}
```

**Bad:**

```powershell
function Get-MyVariable
{
    [CmdletBinding()]
    param ()

    # this is a bad comment
    # On multiple lines
    foreach ($example in $examples)
    {
        # No commented-out code!
        # Write-Verbose -Message $example
    }
}
```

**Good:**

```powershell
function Get-MyVariable
{
    # This is a good comment
    [CmdletBinding()]
    param ()

    # This is a good comment
    foreach ($example in $examples)
    {
        # This is a good comment
        Write-Verbose -Message $example
    }
}
```

**Good:**

```powershell
function Get-MyVariable
{
    [CmdletBinding()]
    param ()

    <#
        This is a good comment
        on multiple lines
    #>
    foreach ($example in $examples)
    {
        Write-Verbose -Message $example
    }
}
```

## Correct Format for Keywords

PowerShell reserved Keywords should be in all lower case and should
be immediately followed by a space if there is non-whitespace characters
following (for example, an open brace).

Some reserved Keywords may also be followed by an open curly brace, for
example the `catch` keyword. These keywords that are followed by a
curly brace should also follow the [One Newline Before Braces](#one-newline-before-braces)
guideline.

The following is the current list of PowerShell reserved keywords in
PowerShell 5.1:

```powershell
begin, break, catch, class, continue, data, define do, dynamicparam, else,
elseif, end, enum, exit, filter, finally, for, foreach, from, function
hidden, if, in, inlinescript, param, process, return, static, switch,
throw, trap, try, until, using, var, while
```

This list may change in newer versions of PowerShell.

The latest list of PowerShell reserved keywords can also be found
on [this page](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_language_keywords?view=powershell-5.1).

**Bad:**

```powershell
# Missing space after keyword and before open bracket
foreach($item in $list)
```

**Bad:**

```powershell
# Capital letters in keyword
BEGIN
```

**Bad:**

```powershell
# Violates 'One Newline Before Braces' guideline
begin {
    # Do some work
}
```

**Bad:**

```powershell
# Capital letters in 'in' and 'foreach' keyword
ForEach ($item In $list)
```

**Good:**

```powershell
foreach ($item in $list)
```

**Good:**

```powershell
begin
{
    # Do some work
}
```

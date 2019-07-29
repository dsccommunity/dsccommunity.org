---
title: "Writing Functions"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 9
---

## Avoid Default Values for Mandatory Parameters

Default values for mandatory parameters will always be overwritten, thus they are
never used and can cause confusion.

**Bad:**

```powershell
function Get-Something
{
    param
    (
        [Parameter(Mandatory = $true)]
        [String]
        $Name = 'My Name'
    )

    ...
}
```

**Good:**

```powershell
function Get-Something
{
    param
    (
        [Parameter(Mandatory = $true)]
        [String]
        $Name
    )

    ...
}
```

## Avoid Default Values for Switch Parameters

Switch parameters have 2 values - there or not there.
The default value is automatically $false so it doesn't need to be declared.
If you are tempted to set the default value to $true - don't - refactor your code
instead.

**Bad:**

```powershell
function Get-Something
{
    param
    (
        [Switch]
        $MySwitch = $true
    )

    ...
}
```

**Good:**

```powershell
function Get-Something
{
    param
    (
        [Switch]
        $MySwitch
    )

    ...
}
```

## Include the Force Parameter in Functions with the ShouldContinue Attribute

**Bad:**

```powershell

```

**Good:**

```powershell

```

### Use ShouldProcess if the ShouldProcess Attribute is Defined

**Bad:**

```powershell

```

**Good:**

```powershell

```

## Define the ShouldProcess Attribute if the Function Calls ShouldProcess

**Bad:**

```powershell

```

**Good:**

```powershell

```

## Avoid Redefining Reserved Parameters

[Reserved Parameters](https://msdn.microsoft.com/en-us/library/dd901844(v=vs.85).aspx)
such as Verbose, Debug, etc. are already added to the function at runtime so don't
redefine them. Add the CmdletBinding attribute to include the reserved parameters
in your function.

## Use the CmdletBinding Attribute on Every Function

The CmdletBinding attribute adds the reserved parameters to your function which is
always preferable.

**Bad:**

```powershell
function Get-Property
{
    param
    (
        ...
    )
    ...
}
```

**Good:**

```powershell
function Get-Property
{
    [CmdletBinding()]
    param
    (
        ...
    )
    ...
}
```

## Define the OutputType Attribute for All Functions With Output

The OutputType attribute should be declared if the function has output so that
the correct error messages get displayed if the function ever produces an incorrect
output type.

**Bad:**

```powershell
function Get-MyBoolean
{
    [OutputType([Boolean])]
    param ()

    ...

    return $myBoolean
}
```

**Good:**

```powershell
function Get-MyBoolean
{
    [CmdletBinding()]
    [OutputType([Boolean])]
    param ()

    ...

    return $myBoolean
}
```

## Return Only One Object From Each Function

**Bad:**

```powershell

```

**Good:**

```powershell

```

---
title: "Calling Functions"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 8
---

## Avoid Cmdlet Aliases

When calling a function use the full command not an alias.
You can get the full command an alias represents by calling ```Get-Alias```.

**Bad:**

```powershell
ls -File $root -Recurse | ? { @('.gitignore', '.mof') -contains $_.Extension }
```

**Good:**

```Powershell
Get-ChildItem -File $root -Recurse | Where-Object -FilterScript {
    @('.gitignore', '.mof') -contains $_.Extension
}
```

### Avoid Invoke-Expression

Invoke-Expression is vulnerable to string injection attacks.
It should not be used in any DSC resources.

**Bad:**

```powershell
Invoke-Expression -Command "Test-$DSCResourceName"
```

**Good:**

```powershell
& "Test-$DSCResourceName"
```

## Use the Force Parameter with Calls to ShouldContinue

**Bad:**

```powershell

```

**Good:**

```powershell

```

## Avoid the WMI Cmdlets

The WMI cmdlets can all be replaced by CIM cmdlets.
Use the CIM cmdlets instead because they align with industry standards.

**Bad:**

```powershell
Get-WMIInstance -ClassName Win32_Process
```

**Good:**

```powershell
Get-CIMInstance -ClassName Win32_Process
```

## Avoid Write-Host

[Write-Host is harmful](http://www.jsnover.com/blog/2013/12/07/write-host-considered-harmful/).
Use alternatives such as Write-Verbose, Write-Output, Write-Debug, etc.

**Bad:**

```powershell
Write-Host 'Setting the variable to a value.'
```

**Good:**

```powershell
Write-Verbose -Message 'Setting the variable to a value.'
```

## Avoid ConvertTo-SecureString with AsPlainText

SecureStrings should be encrypted. When using ConvertTo-SecureString with the
`AsPlainText` parameter specified the SecureString text is not encrypted and thus
not secure. This is allowed in tests/examples when needed, but never in the actual
resources.

**Bad:**

```powershell
ConvertTo-SecureString -String 'mySecret' -AsPlainText -Force
```

## Assign Function Results to Variables Rather Than Extensive Inline Calls

**Bad:**

```powershell
Set-Background -Color (Get-Color -Name ((Get-Settings -User (Get-CurrentUser)).ColorName))
```

**Good:**

```powershell
$currentUser = Get-CurrentUser
$userSettings = Get-Settings -User $currentUser
$backgroundColor = Get-Color -Name $userSettings.ColorName

Set-Background -Color $backgroundColor
```

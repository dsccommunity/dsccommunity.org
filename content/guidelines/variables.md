---
title: "Variables"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 6
---

## Variable Names Use Camel Case

Variable names should use camelCase.

**Bad:**

```powershell
function Write-Log
{
    $VerboseMessage = 'New log message'
    Write-Verbose $VerboseMessage
}
```

**Bad:**

```powershell
function Write-Log
{
    $verbosemessage = 'New log message'
    Write-Verbose $verbosemessage
}
```

**Good:**

```powershell
function Write-Log
{
    $verboseMessage = 'New log message'
    Write-Verbose $verboseMessage
}
```

## Script, Environment and Global Variable Names Include Scope

Script, environment, and global variables must always include their scope in the
variable name unless the 'using' scope is needed. The script and global scope
specifications should be all in lowercase. Script and global variable names following
the scope should use camelCase.

**Bad:**

```powershell
$fileCount = 0
$GLOBAL:MYRESOURCENAME = 'MyResource'

function New-File
{
    $fileCount++
    Write-Verbose -Message "Adding file to $MYRESOURCENAME to $ENV:COMPUTERNAME."
}
```

**Good:**

```powershell
$script:fileCount = 0
$global:myResourceName = 'MyResource'

function New-File
{
    $script:fileCount++
    Write-Verbose -Message "Adding file to $global:myResourceName to $env:computerName."
}
```

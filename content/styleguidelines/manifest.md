---
title: "Manifest"
date: 2019-01-28T11:02:05+06:00
type: "post"
author: "PlagueHO"
weight: 11
---

## Avoid Using Deprecated Manifest Fields

**Bad:**

```powershell

```

**Good:**

```powershell

```

## Ensure Manifest Contains Correct Fields

**Bad:**

```powershell

```

**Good:**

```powershell

```

## Do not use NestedModules to export shared commands

Since we don't use the `RootModule` key in the module manifest, we should not
use the `NestedModules` key to add modules that export commands that are shared
between resource modules.

Normally, a single list in the `RootModule` key, can restrict what is
exported using the cmdlet `Export-ModuleMember`. Since we don't use the `RootModule`
key we can't restrict what is exported, so every nested module will export all the
commands (or all the commands restricted by `Export-ModuleMember` in that
individual nested module). If two resource modules were to use the `NestedModules`
method, it would result in one of them being unable to install since they have
conflicting exported commands.

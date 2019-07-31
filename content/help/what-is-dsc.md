---
title: "What is Desired State Configuration"
date: 2019-07-30T10:56:10+02:00
weight: 1
author: "gaelcolas"
---

As per [the official documentation](https://docs.microsoft.com/en-us/powershell/dsc/overview/overview),
 Desired State Configuration (DSC) is a management platform in PowerShell.

It is built around different components:

- **DSC DSL**: The **Domain Specific Language** of DSC with the `Configuration` keyword.
- **DSC LCM**: The **Local Configuration Manager (LCM)**, that can be seen as the
 agent enacting the configurations on the managed nodes.
- **DSC Resources**: A rich ecosystem of modules exposing a declarative and
 idempotent interface to imperative code configuring resources.
- **DSC Pull Server**: External component implementing the [MS-DSCPM protocol](https://docs.microsoft.com/en-us/openspecs/windows_protocols/ms-dscpm/ea744c01-51a2-4000-9ef2-312711dcc8c9)
 to register nodes, offer configuration, gather reporting from the LCM

## Platform not solution

Since its apparition with Windows 2012 R2, DSC has been announced as a platform
not a solution, but what does that mean?

DSC was created to provide the different bricks required to help create
 Infrastructure as Code solutions, based on PowerShell.

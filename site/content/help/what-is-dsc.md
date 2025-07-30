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

The **DSL** is what allows us to use the Declarative Syntax within PowerShell
to define the configuration policy of your systems, and compiles (or serialize)
into MOF Documents.
The **LCM** is the agent what enacts those MOF documents, whether on demand or
periodically when using the Pull model.

The **pull server** is a glorified File server that implements the MS-DSCPM protocol
to talk to the LCM. The **Report server** is a data collector aggregating the
results of each DSC runs in its database.

The **DSC resources** are some sorts of interfaces enabling idempotent
characteristics to scripts configuring atomic resources, or a composition
of different resources. The most populars are written for the Windows LCM
supporting PowerShell 5.1, but some exists for Linux and can be written in Python
or pretty much any language.

## What is it used for

DSC is a platform enabling **idempotent** and **declarative** configuration,
that helps managing complexity of an infrastructure when
used within a [**Release Pipeline**](https://aka.ms/TRPM).

It is best used for **Policy-Driven infrastructure**, where version-controlled
**documents** describing the unique source of human intent, drive and deliver
the configuration of the infrastructure components, automatically.

In essence, it's [Infrastructure _from_ code](https://devopscollective.org/maybe-infrastructure-as-code-isnt-the-right-way/),
whatever the code is, including YAML, and whatever the automation is in the
pipeline, including Chef, Puppet, a DIY DSC solution or
other Configuration Management solutions.

It is those concepts—and many more—that the industry often refer to when
talking about **Infrastructure As Code** (and
[the book from Kief Morris is a great read](https://info.thoughtworks.com/Infrastructure-as-Code-Kief-Morris.html)).

## Platform not solution

Since its apparition with Windows 2012 R2, DSC has been announced as a platform
not a solution, but what does that mean?

DSC was created to provide the bricks you need to help create
Infrastructure as Code solutions for Windows, based on
PowerShell (and later, cross platform, and with other languages).
It's aimed at you, individuals and organizations building a Do-it-yourself
solution, or other solutions to integrate and tap into the PowerShell and
DSC community and ecosystem.

The solutions, such as Microsoft's Azure Automation DSC now Azure State
Configuration, can leverage any and all of those components, and enhance them.
Others, like Puppet or Chef, might only integrate the resources
and execute them from their agent.

So when you look solely at DSC and documentation, you'll see many missing bits
and pieces you would expect if you think about turn-key solutions: Visualization,
Reporting, certificate management, Configuration Data management...
Some of those have been solved by the community, or are available in those solutions.

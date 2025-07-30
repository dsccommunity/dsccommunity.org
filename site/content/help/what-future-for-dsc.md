---
title: "What Future for Dsc"
date: 2019-07-30T11:35:49+02:00
weight: 2
author: "gaelcolas"
---

Despite the few "[DSC Planning Updates](https://devblogs.microsoft.com/powershell/?s=DSC+Planning&submit=%EE%9C%A1)"
written by Michael Greene (Program Manager for DSC, and DSC Community Committee
member), there are still misunderstandings by the community with regards to the
directions Microsoft is taking for DSC and its ecosystem.

Here, we'll try to explain what **we** understand from the DSC Community.

## Former plans & realignment

Microsoft's DSC Team, about a year and an half ago, was working
on a new version of the LCM component of the DSC Platform.

They were thinking they would open-source it shortly after, as you can judge
from the DSC Planning update of the time, or sessions delivered ar events
by the teams. They labelled, confusingly, the work a _new DSC_, or DSC _Core_,
before rectifying some of this communication.

Anyway, around June 2018, the medium-term strategy changed, and their work
was to be used and developed further for new Azure Services. It'd be a
great mistake to be oblivious of Microsoft's focus to deliver a great
cloud where customers are successful.

This new commitments, and having the new Native LCM in production in Azure, meant
the teams would not have the resource to commit to open sourcing the engine,
a lesson learnt from the DSC Resource Kit and PowerShell team.

Moreover, the solution they developed was primarily focused on audits,
as required by the enabled services: Change Tracking, Inventory, Guest Configuration,
and Update Management, so not a potential replacement for DSC until it
implements the `Set` functionality (from DSC's `Get`, `Test`, `Set`).

So in terms of planning, which now usually spans across a 6 months window,
open sourcing the work now would be premature. The engine would not be doing
enough for the DSC community, and managing a public project while having to
support the Azure solutions would stretch thin the time working on for further improvements.

The plan is clear, the focus for now is to focus on delivering the `Set` and making
sure the quality is up to the task of managing cloud-scale environments,
as required by the demanding Azure services.

Doing it this way, on Azure first, has some great value.

It:

- is far less _theoretical_ than attempting to build a generic framework/agent.
- supports an untethered release and feedback cadence within Microsoft Azure.
- enable iterative solution development that uses the components as they're
developed, and develop them as they are needed.
- enables the team to have their code running on millions of machines,
benefiting from telemetry, and huge scale to solve modern use cases:
a short and very valuable feedback loop.
- Make sure it solves actual problem, early in its life, even before the `Set`
is implemented.

## No plan for DSCvNext

With this said, let's be clear.

There are **no plans for DSCv2, DSC vNext or DSC Core**.

Plans are only made for a 6 months window (roughly), and its not in there,
as far as I know.

Now that's said loud and clear, there's definitely a team working on DSC
and investments are made on the technology.
Azure Policy Guest Configuration **relies on DSC**, for its DSL, Resources
and principle to audit Virtual Machines in Azure, or as long as
they're managed in Azure (Hybrid)...

The team do wish the DSC community will continue to grow, and that there will
be increasing usage and demand for open sourcing the LCM they're working on.
They hope the demand will mostly align with Microsoft's mission to make
companies more successful by transitioning towards a cloud **model**.

## The Future

The future is bright, and will see **changes happening on different time frames**.

Investment has been, and is still being made, and we're just starting to see
the results.

Azure Guest Configuration supports custom content, using the DSC DSL to create
custom audits (now `Public Preview`).
It's a clear sign that leveraging the DSC ecosystem is still a reality for new services.

The DSC Team is investing in this DSC Community, supporting its growth, and
help with its evolution.
They're actively supporting more openness, transparency, and community
involvement in the DSC Resource Kit to find a more sustainable path that helps
the users (`released now`).

The [PowerShell and DSC team are planning](https://github.com/PowerShell/PowerShell-RFC/pull/214)
to release a cross platform `Invoke-DscResource` command that would allow to
leverage PowerShell DSC Resources within scripts, running in current context,
without the burden and limitations of running through the LCM as found in
WMF5.1 (`in the next few months`).

And in the slightly longer term, the DSC team aims to implemented the `Set` for
their new LCM, and start using it in some Azure services (`~6 months+`).

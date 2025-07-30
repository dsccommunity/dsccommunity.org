---
title: "Origin Story"
date: 2019-07-30T15:36:48+02:00
weight: 1
---

## The DSC Resource Kit

A lot has changed since the [creation of the **DSC Resource Kit**](https://devblogs.microsoft.com/powershell/holiday-gift-desired-state-configuration-dsc-resource-kit-wave-1/)
back in 2013—the PowerShell/DSC Team initiative was created to seed the DSC
Ecosystem.

The intention then was to illustrate the capabilities of DSC,
and solve realistic configuration scenarios to build a community of users.
The team had been developing the resources and publishing them as the
PowerShell Team in TechNet Gallery, long before the PowerShell Gallery
existed.

Over the years, more and more modules were created, with most of these becomming
open sourced on GitHub and seeing **increasing community contributions**.

So much so, that the community contributions have outgrown the DSC Team's capacity
to single-handedly manage the DSC Resources and do their day job.

As the DSC Team realized the limitations of the operating model being used
to support the DSC Resource Kit, they
[started to take action to stop the increase of the effort required](https://github.com/PowerShell/DscResources/blob/master/NewResourceModuleSubmissions.md)
to maintain the Resource Kit: **No more modules would be owned and managed
by Microsoft**, and the DSC Resource Kit would only **list them for
discoverability**.

As the DSC team took on extra work internally (later known as Azure Policy Guest
Configuration), they contracted Johan, to help manage the DSC Resources &
community.

## Origin Story

Johan massively helped moving the DSC Resources forward by working closely with
the community—especially with Daniel, one of the top community
contributors—improving the quality of the code, the test coverage, functionality
and resources within the DSC Resource Kit.

As Johan only had a limited time available for the contract, his time fulfilling
this role ended, but his contributions to the DSC Resource Kit redoubled during
his personal time.
With Johan and Daniel being very active, they built a strong trust relationship
with Katie (DSC Team Member, owner of the DSC Resource Kit) and Michael
(Principal Program Manager for DSC), and together became the more or less formal
"leaders" or "Guardians of the DSC Resource Kit".

After a few months, with neither Johan or Daniel available for contract,
the DSC team was trying to find a way to scale the DSC Resource Kit without
increasing the time spent on resources (to focus their efforts on vNext).

This is where they contracted me, Gael, to help with the DSC Resource Kit to see
what could be done to make sure the DSC Team was not "in the way" of the community
contributions and growth.

Although not a DSC Resource Kit contributor, I have been using DSC since its release,
and sharing my understanding and opinions in the community for years, and
knew some of the DSC and PowerShell team members, including Michael.

From talking to many contributors, maintainers, and people who've tried to contribute
it became clear that having the DSC Resource Kit under the PowerShell GitHub
organization was a key friction point between for community contributions.
The [GitHub permission scheme](https://help.github.com/en/articles/repository-permission-levels-for-an-organization),
coupled with the need for security of the [PowerShell GitHub Organization](https://github.com/PowerShell/),
meant that only employees of the DSC or PowerShell Team could have
the permissions required to properly manage the DSC Resource Kit and its repositories.

Many permissions required for GitHub third party apps, creating/renaming repositories,
and assigning new permissions, could only be delegated to members of the Organization.
Although the community would already be doing the time consuming reviews,
helping answering issues, and fixing bugs, they would still be waiting on someone
from the DSC Team, most likely Katie, to action any decisions.

To delegate that responsibility to trusted contributors who could enforce the
same standard of quality, while making the process more transparent and open to
the community, only one solution seemed available: **create an independent
GitHub Organization** and appoint a committee that would share this responsibility,
enforce security and quality, and help the community mature and self-organize
over time.

## DSC Community Organization & Committee

When it emerged that the community required greater permissions, and
after sharing the constraints of the PowerShell GitHub organization management,
it became clear to everyone that something more independent from Microsoft
would be the best approach, similar to [Chef](https://www.chef.io/)'s [Sous-Chefs](https://sous-chefs.org),
[Puppet](https://puppet.com/)'s [Vox Pupuli](https://voxpupuli.org),
and maybe other similar approaches by other vendors.

While I'm here, I'd like to thank the people—Glenn, Mike, James, Stuart, Andrew,
Joel, Ben, Steven and many more—who helped us along the way, and still do!

We then worked with the DSC Team to ensure the consumers and the community's best
interests would be kept safe, and suggested creating the
[DSC Community GitHub organization](https://github.com/dsccommunity/) and
transfer the Open-Source and community-driven DSC resource modules there.
This has enabled us to formalize a DSC Community **Committee** of trusted members,
who can ensure continuity to the DSC Resource Kit's effort of quality and security,
while giving them the permissions needed to do so quickly and with less friction.

More on the [committee here](../committee/).

After bringing those ideas in front of the MVP community, and contacting the
maintainers, we are announcing this during the DSC Community Call, this July 2019,
and starting the transition!

That's it for the origin, make sure you contribute and help build the future!

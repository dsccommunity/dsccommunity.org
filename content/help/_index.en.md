---
title: "Help"
date: 2018-12-28T11:02:05+06:00
description: "Where to find Help with DSC"
bgcolor: '#00CC6A'
---

## What is Desired State Configuration

As per [the official documentation](https://docs.microsoft.com/en-us/powershell/dsc/overview/overview), DSC is a management Platform in PowerShell.

It is built around different components:

- **DSC DSL**: The **Domain Specific Language** of DSC with the `Configuration` keyword
- **DSC LCM**: The **Local Configuration Manager**, that can be seen as the agent enacting the configurations on the managed nodes
- **DSC Resources**: A rich ecosystem of modules exposing declarative and idempotent interface to imperative code configuring resources
- **DSC Pull Server**: External component implementing the MS-DSCPM protocol to register nodes, offer configuration, gather reporting from the LCM

## Where to find Help

DSC being a framework, a basic structure for configuration management, finding answers to your problem might be difficult if you only rely on the official documentation.

Here's a quick run down of the best source of information we know of.

<hr />

### Official DSC Documentation

<a href="https://docs.microsoft.com/en-us/powershell/dsc/overview/overview" target="_blank"><img src="https://github.com/dend/docs-graphics/blob/master/assets/docs-logo-ms.png?raw=true" alt="docs-msft" style="width:100px; display:block; float: left; margin: auto; padding: 10px; border-radius:50%" /></a>

When talking about DSC, we usually refer to [PowerShell DSC](https://docs.microsoft.com/en-us/powershell/dsc/overview/overview), the [cross platform](https://docs.microsoft.com/en-us/powershell/dsc/getting-started/lnxgettingstarted) framework that is leveraged by other solutions such as [Azure Automation State Configuration](https://docs.microsoft.com/en-us/azure/automation/automation-dsc-overview), [Azure Policy Guest Configuration](https://docs.microsoft.com/en-us/azure/governance/policy/concepts/guest-configuration), [Chef](https://docs.chef.io/resource_dsc_resource.html), [Puppet](https://forge.puppet.com/puppetlabs/dsc_lite) (or [this other module](https://forge.puppet.com/puppetlabs/dsc)), [Ansible](https://docs.ansible.com/ansible/latest/user_guide/windows_dsc.html), [AWS Systems Manager](https://aws.amazon.com/blogs/mt/run-compliance-enforcement-and-view-compliant-and-non-compliant-instances-using-aws-systems-manager-and-powershell-dsc/) or DIY (Do It Yourself) solutions people have built to solve their infrastructure management needs.

The [official documentation](https://docs.microsoft.com/en-us/powershell/dsc/overview/overview) is available with other [Microsoft docs](https://docs.microsoft.com/en-us/), and if you need to learn how the framework works, that's probably the best place to start!
<hr />

### PowerShell.org and its [DSC Forum](https://powershell.org/forums/forum/dsc-desired-state-configuration/)

<a href="https://powershell.org/forums/forum/dsc-desired-state-configuration/" target="_blank"><img src="https://pbs.twimg.com/profile_images/1056972376951476229/sR84-VP4_400x400.jpg" alt="PowerShell.org" style="width:100px; display:block; float: right; margin-left: auto;margin-right:auto; padding-right: 15px; border-radius:0%" /></a>

The PowerShell.org community has always been a great source of information for DSC, whether in their articles, from their PowerShell Summit sessions, and also for their active [DSC forum](https://powershell.org/forums/forum/dsc-desired-state-configuration/)!

Make sure you check those resources and post your question on the forum if you can't find your answer elsewhere!

<hr />

### DSC Slack & Discord Instant Messaging

<a href="http://slack.poshcode.org/" target="_blank"><img src="../images/appIcon_desktop.png" alt="Slack" style="width:100px; display:block; float: left; margin-left: auto;margin-right:auto; padding-right: 15px; border-radius:0%" /></a>

Some members of the community are very active in the DSC channel, of the PowerShell Slack.
Join the conversation here if you want to meet the community, and ask questions.

It's great for some real-time guidance, but tough questions are probably better detailed on the PowerShell.org forums, and maybe linked in the chat for people to answer. That way the answers are searchable and discoverable for the next person.

You can chose to join either in Slack or Discord, as both services are bridged together via a bot. If you don't know which one to pick, maybe give discord a chance, as it does not have the history limit that Slack has on free plans.
<hr />

### DSC Community Twitter Account

<a href="https://twitter.com/dsccommunity" target="_blank"><img src="../images/Twitter_Social_Icon_Square_Color.png" alt="Slack" style="width:100px; display:block; float: right; margin-left: auto;margin:auto; padding: 0px; border-radius:50%" /></a>

We've recently created a [@dsccommunity](https://twitter.com/dsccommunity) twitter account so that we could share news, announcement, and information around what is happening in the DSC Community.

We want to tweet about anything DSC and Configuration Management. Give us a Follow, and help us share the content you like.

<hr />

### PowerShell Team Twitter Account

<a href="http://twitter.com/PowerShell_Team" target="_blank"><img src="https://pbs.twimg.com/profile_images/855495866664140800/t96UQmF__400x400.jpg" alt="Slack" style="width:100px; display:block; float: left; margin-left: auto;margin:auto; padding: 0px; border-radius:50%" /></a>

Maybe not best place for help, but a good resource for news and worth to mention.

Although the DSC Team and the PowerShell Team are distinct, they still work closely together, and the DSC Team does not have its own twitter account. Most communication about DSC is still released through the PowerShell team's account.

<hr />

### Other references

[The DSC Book](https://leanpub.com/the-dsc-book), by Don Jones & Missy Januszko

[Pro PowerShell Desired State Configuration](https://www.amazon.com/PowerShell-Desired-State-Configuration-Depth-ebook/dp/B07CNQD3M9), by Ravikanth Chaganti

[Getting Started with PS DSC](https://channel9.msdn.com/Series/Getting-Started-with-PowerShell-Desired-State-Configuration-DSC), MVA Videos - Jason Helmick & Jeffrey Snover

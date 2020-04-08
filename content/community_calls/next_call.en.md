---
title: "Next Community Call 2020-04-08"
weight: 1
type: "post"
date: 2020-01-24
---
Next call will be on Wednesday, April 8th, at 12 PM PST

Want to submit a question to discuss during the call? Just [submit a Pull request to this file](https://github.com/dsccommunity/dsccommunity.org/edit/master/content/community_calls/next_call.en.md)!

### Agenda

1. Quick update on activity
2. Presentation by Raimund Andre: Less code in resource with Test-DscParameterState

- Migration to Continuous Delivery Process:
  - Completed since last call
    - OfficeOnlineServerDsc
    - xDhcpServer
    - xHyper-V
    - xDnsServer

  - Completed
    - xSystemSecurity
    - ComputerManagementDsc
    - ActiveDirectoryDsc
    - NetworkingDsc
    - SharePointDsc
    - SQLServerDsc
    - WSManDsc
    - xFailOverCluster
    - xPSDesiredStateConfiguration
    - xWebAdministration
    - GPRegistryPolicyDsc
    - UpdateServicesDsc
    - ActiveDirectoryCSDsc
    - xExchange
    - OfficeOnlineServerDsc

  - In progress:
    - 
    - Others?

- These repositories have moved under DSC Community.
  - https://github.com/dsccommunity/DscWorkshop
  - https://github.com/dsccommunity/CommonTasks

- Raimund Andree presents: Test-DsvcParameterState
  - Some resources have a huge overlap in Test() and Get() which is a pain for maintenance and testing. The SharePointDsc resource was the first that started with a generic way to compare the current with the desired state. This pattern has been extended and covers almost any type now: string, int, scriptblock, hashtable, CimInstance and PSCredential. Want to do a reverse check as well or handle sorting? Then let’s have a look at Test-DscParameterState.

- Feel free to [send a PR to this file](https://github.com/dsccommunity/dsccommunity.org/blob/master/content/community_calls/next_call.en.md)
  if there's something you'd like to be added to the agenda (or just ask
  during the call)

#### Resources that have been released recently


### Discussions

Topics or questions from the community (welcome at any point during the call)

Talk to us on **Virtual PowerShell User Group** _#DSC_ channel.
For information on how to join, see https://dsccommunity.org/community/contact/

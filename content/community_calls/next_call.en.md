---
title: "Next Community Call 2020-08-12"
weight: 1
type: "post"
date: 2020-08-01
---

Next call will be on Wednesday, August 12th, at 12 PM PST

### Join the call

[Join using the Microsoft Teams app](https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTc2YThjZGQtNWE4Yi00NDQyLTk5NTktYWIwYjdhMGZjNDRl%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%222fd83437-7fe6-4ee4-a109-828a19cb7bff%22%7d)

[Or click here to browse the list of available dial-in numbers to find one that is local to your region](https://dialin.teams.microsoft.com/8551f4c1-bea3-441a-8738-69aa517a91c5?id=50343176)

Conference ID:
503 431 76#

### Discussions

Topics or questions from the community (welcome at any point during the call)

Talk to us on **Virtual PowerShell User Group** _#DSC_ channel.
For information on how to join, see https://dsccommunity.org/community/contact/

Want to submit a question to discuss during the call so other can prepare? Just [submit a Pull request to this file](https://github.com/dsccommunity/dsccommunity.org/edit/master/content/community_calls/next_call.en.md)!

### Agenda

1. Quick update on activity:
   - Migration to Continuous Delivery Process ([GitHub Board](https://github.com/orgs/dsccommunity/projects/1)):
     - Completed since last call
       - FSRMDsc
       - JeaDsc
     - In progress
       - _None_
     - New modules
       - _None_
     - WIP modules
       - AzureDevOpsDsc _(maintainer [Ryan Yates](https://github.com/kilasuit))_
       - GitHubEnterpriseDsc _(maintainer [Ryan Yates](https://github.com/kilasuit))_
     - Modules not yet converted but with fairly recent activity (seen in AppVeyor)
       - DscResource.Analysis
       - xBitlocker
     - Completed
       - DfsDsc
       - FileContentDsc
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
       - FileSystemDsc
1. Resources that have been released recently
   - Releases
   - Preview release
   - Modules

1. Next Community Call (September)
   1. [Steve Lee](https://github.com/SteveL-MSFT) makes a guest appearance to
      discuss the proposal regarding [changes to DSC resource platform](https://github.com/PowerShell/PowerShell/issues/13359).
      Highlights below:
      - Proposing to move to JSON instead of MOF (considered for PowerShell 7.1)
      - Windows PowerShell LCM is unchanged (will only support MOF).
      - Resource will need both a mof and json schema to work cross-PowerShell-versions.

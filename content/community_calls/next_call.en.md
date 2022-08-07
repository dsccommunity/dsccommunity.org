---
title: "Next Community Call 2022-09-07"
weight: 1
type: "post"
date: 2022-05-10
---

Next call will be on Wednesday, September 7th, at 12 PM PST

### Join the call

[Join using the Microsoft Teams app](https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTc2YThjZGQtNWE4Yi00NDQyLTk5NTktYWIwYjdhMGZjNDRl%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%222fd83437-7fe6-4ee4-a109-828a19cb7bff%22%7d)

[Or click here to browse the list of available dial-in numbers to find one that is local to your region](https://dialin.teams.microsoft.com/8551f4c1-bea3-441a-8738-69aa517a91c5?id=50343176)

Conference ID:
503 431 76#

### Discussions

Topics or questions from the community (welcome at any point during the call)

We are also available on the **Virtual PowerShell User Group** _#DSC_ channel.
For information on how to join, see https://dsccommunity.org/community/contact/

Want to submit a question to discuss during the call so others can prepare?
Just [submit a Pull request to this file](https://github.com/dsccommunity/dsccommunity.org/edit/master/content/community_calls/next_call.en.md)!

### Agenda

#### Community Presentation

- [Constantin Hager](https://twitter.com/chagerCOC) presents Azure Automation
  DSC & Azure VM extension. How do they work together?

#### Quick update on activity

- [PowerShell Conference Europe 2022](https://psconf.eu/) on June 19th 2022.
- Nicolas Baudin, maintainer for UpdateServicesDSC
- Any activity update from the community?

#### DSC resource modules that have been released recently

- Releases
  - xHyper-V v3.18.0 (deprecated - move to HyperVDsc)
  - xWebAdministration v3.3.0 (deprecated - move to WebAdministrationDsc)
  - NetworkingDsc v9.0.0
  - xFailOverCluster v1.16.1 (deprecated - move to FailoverClusterDsc)
  - FailoverClusterDsc v2.1.0
  - SChannelDsc v1.4.0
  - SharePointDsc v5.2.0
  - xDhcpServer v3.1.0
  - ActiveDirectoryDsc v6.2.0
  - xRemoteDesktopSessionHost v2.1.0
- Preview releases
  - UpdateServicesDsc v1.3.0-preview0002
  - HyperVDsc v4.0.0-preview0004
  - FailoverClusterDsc v2.0.1-preview0003
  - SqlServerDsc v16.0.0-preview0010 (now using Pester 5 in the pipeline)
  - ComputerManagementDsc v8.6.0-preview0002
  - ActiveDirectoryDsc v6.3.0-preview0002
  - xExchange v1.33.1-preview0001
  - JeaDsc v4.0.0-preview0003
  - ConfigMgrCBDsc v3.0.1-preview0001
  - FailoverClusterDsc v2.1.1-preview0001

#### Tooling modules that have been released recently

- Releases
  - Sampler v0.115.0 (First full release in a while)
    - New tasks for creating git tag, and creating changelog branch
  - Sampler.AzureDevOpsTasks v0.1.1
    - Task for creating a PR from a source branch (for Azure Repos)
  - DscResource.DocGenerator v0.11.0
    - Various bug fixes, and most notable it is now possible to use property
      `BuiltModuleSubdirectory` with the Sampler pipeline (it was the last
      one that needed to be fixed).
  - DscResource.Test v0.16.1
    - Fix so that if Pester 5 testing fails on discovery, pipeline fails.
  - DscResource.Common v0.11.0
- Preview releases
  - Sampler v0.116.0-preview0003
  - Sampler.GitHubTasks v0.3.5-preview0002
  - Sampler.DscPipeline v0.2.0-preview0002
  - DscResource.DocGenerator v0.11.1-preview0001
  - DscResource.Test v0.16.2-preview0001

#### Community questions

_Submit your questions, or raise them directly in the call._

#### Next Community Call

Next community call is on the 4th of May.
Suggestions for talks are welcomed, we have [Call for speakers](https://sessionize.com/dsc-community)
open.

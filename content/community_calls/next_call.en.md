---
title: "Next Community Call 2021-01-27"
weight: 1
type: "post"
date: 2021-01-21
---

Next call will be on Wednesday, January 27th, at 12 PM PST

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

#### Quick update on activity

##### Move to new pipeline

Currently active repositories have moved to the new pipeline. Holding off
on the rest of the repositories, migrating as needed.

##### Rename default branch

Work in progress to rename default branch to `main`. See blog post
[Steps to rename `master` branch to `main` for a DSC Community resource](https://dsccommunity.org/blog/convert-master-to-main/)
how to update the pipeline to support the rename.

Finished so far:

- SqlServerDsc
- FileSystemDsc
- xFailOverCluster
- xWebAdministration
- ActiveDirectoryDsc
- FSRMDsc
- iSCSIDsc
- DFSDsc
- FileContentDsc
- StorageDsc
- WSManDsc
- xPSDesiredStateConfiguration
- CertificateDsc
- ActiveDirectoryCSDsc
- DscResource.Common
- DscResource.DocGenerator

##### Moving repositories

Moving last repositories (including deprecated) from PowerShell Team
GitHub organization to DSC Community GitHub organization.

- PowerShell/SystemLocaleDsc
- PowerShell/WmiNamespaceSecurityDsc
- PowerShell/xAzureStorage
- PowerShell/xDefender
- PowerShell/xJea
- PowerShell/xPendingReboot
- PowerShell/xPowershellExecutionPolicy
- PowerShell/xRemoteDesktopAdmin
- PowerShell/xSmbShare
- PowerShell/xSqlPs
- PowerShell/xTimezone
- PowerShell/xWinEventlog

#### DSC resource modules that have been released recently

- Releases
  - SqlServerDsc v15.0.1
- Preview releases (many due to renaming the default branch)
  - NetworkingDsc v8.2.1-preview0001
  - SqlServerDsc v15.0.2-preview0002
  - xFailOverCluster v1.15.0-preview0003
  - DFSDsc v4.4.0-preview0002
  - FileContentDsc v2.0.0-preview0003
  - WSManDsc v3.2.0-preview0003
  - xPSDesiredStateConfiguration v9.2.0-preview0002
  - StorageDsc v5.0.2-preview0001
  - ActiveDirectoryCSDsc v5.0.1-preview0002
  - FileSystemDsc v1.2.0-preview0001
  - CertificateDsc v5.0.1-preview0001
  - xWebAdministration v3.2.1-preview0002
  - ConfigMgrCBDsc v0.2.0-preview0034
  - iSCSIDsc v2.0.0-preview0003
  - FSRMDsc 2.5.1-preview0002

#### Tooling modules that have been released recently

Make sure to update to the new pipeline files in the new Sampler release
if not done so for a long while. It is required to rename the default branch.

- Releases
  - DscResource.DocGenerator v0.7.2
  - DscResource.Test v0.14.3
  - DscResource.Common v0.10.1
  - Sampler v0.109.2 (_update repos to new pipeline files!_)
- Preview releases
  - DscResource.DocGenerator v0.7.3-preview0001
  - DscResource.Common v0.10.2-preview0001

#### Next Community Call

Next community call is on the 10th of February.
Suggestions for talks are welcomed.

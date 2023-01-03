---
title: "Next Community Call 2022-01-11"
weight: 1
type: "post"
date: 2023-01-01
---

Next call will be on Wednesday, January 11th, at 12 PM PST

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

#### Community presentation

- Yorick Kuijs: "Microsoft365DSC is a DSC module like any other, or is it?"

How is [Microsoft365DSC](https://www.powershellgallery.com/packages/Microsoft365DSC)
different compared to "normal" DSC modules? What challenges did we have to overcome?
And how we made it even more awesome!

#### DSC resource modules that have been released recently

- Releases
  - WebAdministrationDsc v4.1.0
- Preview
  - SqlServerDsc v16.1.0-preview0008 - A lot of cleanup of existing code since last time, been in preview since last Community Call, we should release
  - CertificateDsc v6.0.0-preview0001 - BREAKING CHANGE in CertReq, FriendlyName is now mandatory (Thanks to @uw-dc)
  - ComputerManagementDsc v9.0.0-preview001 - BREAKING CHANGE: Requires WMF 5.0 since we added first class-based resource `PSResourceRepository` (Thanks to @nickgw)
  - xRemoteDesktopSessionHost v2.1.1-preview0001 - New resource `xRDConnectionBrokerHAMode` that is used to configure HA mode on connection broker (Thanks to @nyanhp)

#### Tooling modules that have been released recently

- Releases
  - DscResource.DocGenerator v0.11.2 - Fixes a edge case bug for class-based resources.
  - DscResource.Base v1.0.0 - Helps in (an opinionated way) development of class-based resources (used by SqlServerDsc, and hopefully soon ComputerManagementDsc)
  - DscResource.Common v0.14.0 - Added various new commands that can be used for class-based DSC resources (used by ComputerManagementDsc and SqlServerDsc)
- Preview
  - None.

#### Community questions

_Submit your questions, or raise them directly in the call._

#### Next Community Call

Next community call is on the 22nd of February.
Suggestions for talks are welcomed, we have [Call for speakers](https://sessionize.com/dsc-community)
open.

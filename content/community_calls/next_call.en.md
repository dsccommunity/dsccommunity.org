---
title: "Next Community Call 2022-01-11"
weight: 1
type: "post"
date: 2023-01-01
---

Next call will be on Wednesday, January 11th, at 12 PM PST

### Join the call

We will have the DSC Community Call at the HerShell Pub in PSWorld (a digital space using [Gather](https://www.gather.town)). Join PSWorld and start mingle at the pub before the event, join PSWorld here: https://app.gather.town/events/hWF235u-R3CYCOFYJfQT

Also, see below for [other events](#other-events-in-psworld) that happens in PSWorld, on the same day as the DSC Community Call!

When it is time for the DSC Community call go to track 3 (the door to the right, between the British flags) and take a seat.
Presenters go to the podium on the stage. Once at the podium the presenter will automatically broadcast to everyone. 

Can't find your way in PSWorld? See [how to find the Pub](#how-to-find-hershell-pub).

<!-- 
[Join using the Microsoft Teams app](https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTc2YThjZGQtNWE4Yi00NDQyLTk5NTktYWIwYjdhMGZjNDRl%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%222fd83437-7fe6-4ee4-a109-828a19cb7bff%22%7d)

[Or click here to browse the list of available dial-in numbers to find one that is local to your region](https://dialin.teams.microsoft.com/8551f4c1-bea3-441a-8738-69aa517a91c5?id=50343176)

Conference ID:
503 431 76# 
-->

### Agenda

#### Community presentation 

**"Microsoft365DSC is a DSC module like any other, or is it?"** presented by Yorick Kuijs. 

How is [Microsoft365DSC](https://www.powershellgallery.com/packages/Microsoft365DSC)
different compared to "normal" DSC modules? What challenges did we have to overcome?
And how we made it even more awesome!

#### Community questions

_Submit your questions, or raise them directly in the call._

Topics or questions from the community (welcome at any point during the call).
During the Community Call in the presentation area you can ask questions by moving
you avatar to the Q & A area.

Want to submit a question to discuss during the call so others can prepare?
Just [submit a Pull request to this file](https://github.com/dsccommunity/dsccommunity.org/edit/master/content/community_calls/next_call.en.md)!

#### Discussions

In PSWorld, outside the presentation area, you can move your avatar close to any other attendee(s)
and talk to them.

We are also available on the **Virtual PowerShell User Group** _#DSC_ channel.
For information on how to join, see https://dsccommunity.org/community/contact/

### DSC resource modules that have been released recently

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

### Next Community Call

Next community call is on the 22nd of February.
Suggestions for talks are welcomed, we have [Call for speakers](https://sessionize.com/dsc-community)
open.

### Other events in PSWorld

These event happen on the same day as the DSC Community Call. 

 | 
--- | ---
{{< figure src="/images/CommunityCall-2023-01/Swiss-PowerShell-User-Group-Meetup-Januari-2023.png" link="https://www.meetup.com/swiss-powershell-user-group/events/290694009/">}} | {{< figure src="/images/CommunityCall-2023-01/PowerShell-London-UK-Meetup-January-2023.png" link="https://www.meetup.com/powershell-london-uk/events/289840557/">}}

### How to find HerShell Pub

In PSWorld, walk (take your avatar) to the HerShell Pub. The pub is in the middle of the map (you can use the mouse scroll-wheel to see the whole map).

{{< figure src="/images/psworld/PSWorld-HerShell-Pub.png" height="17" width="16">}}

Inside the pub, mingle. When it is time for the DSC Community call go to track 3 (the door to the right, between the British flags) and take a seat. 
Presenters go to the podium on the stage. Once at the podium the presenter will automatically broadcast to everyone. 

{{< figure src="/images/psworld/PSWorld-Presentation-Hall.png" height="17" width="16">}}

If your avatar spawn in the PSConf EU MiniCon, then go outside (move down on the map). Once outside exit through the grey door so you get out of the construction area, now you are in PSWorld.

{{< figure src="/images/psworld/PSWorld-MiniConConstructionArea.png" height="17" width="16">}}

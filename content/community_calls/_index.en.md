---
title: "Community Calls"
date: 2019-07-28
weight: 6
icon: "ti-headphone-alt"
description: "Agenda for the next community call and meeting notes"
type : "pages"
bgcolor: '#FFB900'
---

### Community Calls

The DSC Community calls are schedule and you can add them to your calender
using the [ICS file](https://github.com/PowerShell/DscResources/blob/master/CommunityCalls/DSC%20Resource%20Kit%20Community%20Call%20ICS.zip).

#### How to Join

The calls are open for everyone in the community.

##### Microsoft Teams

Join through the [Microsoft Teams Meeting](https://teams.microsoft.com/l/meetup-join/19%3ameeting_OTc2YThjZGQtNWE4Yi00NDQyLTk5NTktYWIwYjdhMGZjNDRl%40thread.v2/0?context=%7b%22Tid%22%3a%2272f988bf-86f1-41af-91ab-2d7cd011db47%22%2c%22Oid%22%3a%222fd83437-7fe6-4ee4-a109-828a19cb7bff%22%7d)

##### Phone

+1 323-849-4874 United States, Los Angeles (Toll),
or [Local numbers](https://dialin.teams.microsoft.com/8551f4c1-bea3-441a-8738-69aa517a91c5?id=50343176).

Conference ID: 503 431 76#

Participants using the Join by Phone option must dial the full number for call access.

### Community Call Agenda

To the left you will find the agenda for the next community call and the
notes for the previous community calls.
Please feel free to send in PR's to add items you feel need to be discussed
in the next community call in the agenda.

>The file to update for new agenda items is [`content/community_calls/next_call.en.md`](https://github.com/dsccommunity/dsccommunity.org/blob/master/content/community_calls/next_call.en.md)

### Add next community call agenda and update notes to the web site

Make sure after the call that the agenda (next_call.en.md) is renamed
appropriately, and the `weight: 99x` decremented from the last notes.

Then run the command below to create a new file under `content/community_calls`.

```bash
hugo new community_calls/next_call.en.md
```

### Agenda Presentation Template

A [PowerPoint presentation](../../pptx/dsc_community_call_agenda.pptx) for
displaying the agenda for the call is available.

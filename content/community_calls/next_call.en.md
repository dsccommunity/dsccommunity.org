---
title: "Next Community Call 2021-10-06"
weight: 1
type: "post"
date: 2021-10-05
---

Next call will be on Wednesday, October 6th, at 12 PM PST

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

- Steve and Andrew from the PowerShell team join us to discuss the recent
  changes to PowerShell DSC.

#### Quick update on activity

- xPSDesiredStateConfiguration has now be moved to auto documentation,
  using GitHub Repository Wiki. _(though need another merge for it to publish)_
- xExchange
  - We unblocked contributors in xExchange.
  - Working on fixing the pipeline that blocking releases (PR is in review)
  - **Since Mike no longer have time to maintain xExchange the community need a
    new maintainer for that repository. Please reach out in #dsc channel
    if you are interested!**
- SqlServerDsc
  - Review PR's to unblock contributors.
  - Still working on the Pester 5 tests for this repo.
- Codecov.io has deprecated their bash uploader. The bash uploader recently
  broke. It can no longer publish coverage since the bash uploader does not
  detect the "repository information" when run in Azure Pipelines.
  - All repos that uses Codecov.io need to be moved to new uploader.
    See https://community.codecov.com/t/public-repositories-can-no-longer-upload-coverage-with-error-unable-to-locate-build-via-azure-api/3242/2

Do the community have any other activity updates?

#### DSC resource modules that have been released recently

- Releases
  - SharePointDsc 4.8.0
  - SqlServerDsc 15.2.0
  - ComputerManagementDsc 8.5.0
- Preview releases
  - ConfigMgrCBDsc 2.1.0-preview0007
  - xPSDesiredStateConfiguration 9.2.0-preview0007
  - SharePointDSC 4.8.1-preview0001

#### Tooling modules that have been released recently

- Releases
  - Sampler 0.112.0
  - DscResource.Test 0.16.0
- Preview releases
  - Sampler 0.112.1-preview0001
  - DscResource.Common 0.11.0-preview0001

#### Community questions

_Submit your questions, or raise them directly in the call._

#### Next Community Call

Next community call is on the 6th of October.
Suggestions for talks are welcomed.

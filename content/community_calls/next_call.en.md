---
title: "Next Community Call 2021-03-10"
weight: 1
type: "post"
date: 2021-03-01
---

Next call will be on Wednesday, March 10th, at 12 PM PST

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

##### Rename default branch

Work in progress to rename default branch to `main`. See blog post
[Steps to rename `master` branch to `main` for a DSC Community resource](https://dsccommunity.org/blog/convert-master-to-main/)
how to update the pipeline to support the rename.

#### DSC resource modules that have been released recently

- Releases
  - SharePointDsc v4.5.1
  - SqlServerDsc v15.1.1
  - xFailOverCluster v1.15.0
- Preview releases (many due to renaming the default branch)
  - ActiveDirectoryDsc v6.2.0-preview0001
  - SqlServerDsc v16.0.0-preview0001 (**This release will soon be unlisted as it wrongly bumped major version, and re-release with correct versioning**)
  - ComputerManagementDsc v8.4.1-preview0003
  - CertificateDsc v5.1.0-preview0002
  - xDnsServer v2.0.0-preview0008
  - FileSystemDsc v1.2.0-preview0002
  - NetworkingDsc v8.3.0-preview0001
  - ConfigMgrCBDsc v0.2.0-preview0035

#### Tooling modules that have been released recently

Make sure to update to the new pipeline files in the new Sampler release
if not done so for a long while. It is required to rename the default branch.

- Releases
  - DscResource.DocGenerator v0.8.0
  - DscResource.Test v0.15.0
  - Sampler v0.109.4
  - Sampler.GitHubTasks v0.2.2
- Preview releases
  - DscResource.Test v0.15.1-preview0001
  - Sampler v0.109.5-preview0001


### Support for Pester 5

We're working in making the pipeline and tools (such as `DscResource.Test`)
to work with Pester 4 AND 5.

If you want to convert one repo, give us a heads up and we can show you how to get started. We'd appreciate feedback and bug reports if any!

#### Showing Sampler in action

As a fair bit of work has happened on the Sampler module, let's talk about it.
Today, Gael will present how the DSC Community templates and build pipeline work,
and how you can use it for your personal or public project.

We'll show how to use it for DSC Resources, and explain some of its feature and
capabilities.

We'll see:
- How to contribute to an existing Module.
- How to create a New module for the DSC Community following the standards.
- How to Add elements to an existing Sampler project.
- How to update files in your repository when we ask you to.
- How to re-use or build nested Modules in your Module.

The talk will go very quickly through the basics to advanced feature so that
you know what's there.
A basic to intermediate understanding of how PowerShell Module works is recommended (exported functions, dot sourcing, Required Modules, scope).

#### Next Community Call

Next community call is on the 21th of April.
Suggestions for talks are welcomed.

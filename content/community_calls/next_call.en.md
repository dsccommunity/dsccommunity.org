---
title: "Next Community Call 2019-09-11"
weight: 1
type: "post"
date: 2019-08-01
---

[How to join](..)

### Agenda

- Feel free to send a PR to this file if there's something you'd like
  to add to the agenda

#### Resources to be released

- ActiveDirectoryDsc
- ComputerManagementDsc (BREAKING CHANGE - ScheduleTask)
- DFSDsc (Fix to get the examples to be published)
- NetworkingDsc
- SharePointDsc (might not be released)
- StorageDsc
- WmiNamespaceSecurityDsc (former WmiNamespaceSecurity)
- xDnsServer
- xFailOverCluster
- xHyper-V
- xPSDesiredStateConfiguration
- xRemoteDesktopSessionHost
- xSCSMA
- xWebAdministration

##### Deprecated

- xRemoteDesktopAdmin (moved to ComputerManagementDsc) (No PR to deprecate yet)
- xPendingReboot (moved to ComputerManagementDsc)

#### Should leaving unsupported OS be treated as breaking change

For example Windows Server 2008 R2 is leaving extended support.

#### Gallery account for DSC Community

We should setup a gallery account so we can release repos.


### Discussions

Topics or questions from the community (welcome at any point during the call)

Talk to us on **Virtual PowerShell User Group** _#DSC_ channel.
For information on how to join, see https://dsccommunity.org/community/contact/

#### Releasing vNext

Goal is to have a scripted pipeline that works identically on your local machine, on appVeyor and Azure (DevOps) Pipelines.

- Create a Module template to Create, build & Release module (the template should be able to just come on top of existing module, and suggesting to remove/edit some code)
  The build/release process should, on merge to Master:
  * Download the Required Modules needed for the Build, test, release process
  * Build the module (update PSD1, changelog, version & all)
  * Validate the compiled module against Style Guidelines (& PSSA)
  * Validate the compiled modules against Unit & Integration tests
  * Validate the compiled module against Quality Standards (test Coverage, help & Documentation)
  * Validate the compiled module against Release Standards (Changelog, version)
  * [sign package, eventually]
  * [Create GitHub Release]
  * Publish the compiled module to the Gallery as a Pre-release
  * Save the Test results as Artefacts

  
- When we tag a pre-released version, we should release the pre-released package as Full Release:
  * Download the Required Modules needed for the Build, test, release process
  * Extract the module
  * Update the Module Manifest (remove pre-release, update Changelog)
  * Re-test the newly compiled package
  * [re-sign package, eventually]
  * [Create GitHub Release]
  * Release to gallery
  * Save the Test results as Artefacts
 
Normal release (from Tag), could be initiated by a DSC Committee member to improve trust.
We need to make sure the release process can be trusted, we'll detail and ask for comment soon.
We're considering moving to AzDO (but mainly having most of the pipeline scripted so it works on both AppVeyor & AzDO)
 
To do so we should change:
- How SubModules are used:

  * DscResource.Common (which can be common to all DSC Resource Modules) should be a module released idependently, 'nested' at build time (but not added to nestedModules manifest)
  * We should version modules using SemVer, via the nuget-compliant string (that means {major}.{minor}.{patch} and pre-release tags & metadata) Maybe using GitVersion to track that consistently for us (means no extra effort)
  
- How we do test:

  * Decouple DscResource.tests & PSSA custom rules from other parts
  * Release DscResource.Tests as module released/versioned idependently. It should be saved/installed and run tests against compiled module (no more git clone on the fly)
  * [eventually do more integration testing]
  

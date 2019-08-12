---
title: "Realizing maintenance windows with DSC"
date: 2019-08-08T18:11:05+02:00
type: "post"
draft: false
---

## Author
Raimund Andree is a Premier Field Engineer working for Microsoft in Germany. His work is mainly about DevOps in the Microsoft space using Azure DevOps, DSC and PowerShell. He is sharing the experience gained at PowerShell conferences, community days and while working on the projects [AutomatedLab](https://github.com/AutomatedLab/AutomatedLab) and [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop).

- Twitter: @raimundandree
- GitHub: https://github.com/raandree/
- LinkedIn: https://linkedin.com/in/raimund-andree-69a78871

## Introduction

Since 2017 I was involved in a number of DSC projects in medium to very large enterprises. It has not been easy to implement DSC for a number of reasons. For some companies, the reason why DSC was not an option is the lack of support for maintenance windows. DSC runs whenever an internal timer expires. This is fine for some enterprises but not for all.  
This article summarizes the ideas and their technical implementation I have worked on with two large enterprises. Both of them have a very time-sensitive business, they don’t accept downtimes, and both wanted to have DSC running in the "ApplyAndAutoCorrenct" mode.

The way how maintenance windows have been implemented leaves room for improvement but should cover most of the requirements. You can define a start time and a time frame and if desired also a day of week.

## Technical summary

There is no fancy way of changing the behavior of the LCM shipped with Windows Management Framework 5.1. This LCM simply does not support maintenance windows and always runs according to the given interval. The only way to control it is a combination of two scheduled tasks. Yes, scheduled tasks are not always nice and tend to be hard to maintain, but: If you can configure the scheduled tasks along with your maintenance windows and along with all your other configuration using DSC, they create almost zero overhead. And thanks to DSC you know that at least these two scheduled tasks are always configured as they should be. So please, don’t stop reading just because this whole thing is based upon scheduled tasks. Scheduled tasks are the only built-in tool we have here.

One task is postponing the LCM so it will never be triggered by its default triggers. This pretty much disables the LCM. The second scheduled task serves as an external trigger for the LCM. It looks for the last time the LCM did run, the interval and the maintenance windows and triggers the LCM if all conditions are met. If this sounds like something you could use, please read on.

## Technical requirements

The only technical requirements this solution depends on are scheduled tasks and DSC. The actual implementation of the idea is realized with some principles, patterns and tools that are lifting DSC to a completely new level. While it makes the solution more complex at first, it pays off quickly. The things I have used here are:

- [Datum](https://github.com/gaelcolas/Datum)): Without it, flexible and scalable config management is pretty much impossible.
- [DSC Composite Resources](https://docs.microsoft.com/en-us/powershell/dsc/resources/authoringresourcecomposite): You want to be able to split up DSC configurations into manageable pieces, like you want to split up code into functions. With Datum this gets quite powerful as you can assign these composite resources to roles.

## A detour to configuration management 

> NOTE: It helps having looked or even better played with the DscWorkshop project. Implementing maintenance windows within the demo provided was quite an easy task, as many things are already covered. You will find a lot of other cool principals and patterns around DSC, Policy-Driven Infrastructure and config management.

Before covering the maintenance windows, we have to take a little detour to make ourselves familiar with roles and configurations. This detour is very scenic and worth every minute. And finally, it saves you a lot of time in any future DSC project.

In the [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop) project we use [Datum](https://github.com/gaelcolas/Datum) to handle the configuration data. With Datum we can apply a pattern similar to [Puppet’s Roles and Profiles](https://puppet.com/docs/pe/2017.2/r_n_p_intro.html). The DscWorkshop uses configurations defined in the [CommonTasks](https://github.com/AutomatedLab/CommonTasks) repository. This repository is named CommonTasks as it provides simple access to a few common configurations that most of you might need when configuring servers. For example, let’s suppose you want to configure a web server with DSC. This could be the list of configurations you want to assign to a web server:

- NetworkIpConfiguration: Let’s make sure the server has the correct network settings
- WindowsFeatures: You want to make sure the OS knows how to host a web site
- FilesAndFolders: Your web content should be copied from somewhere
- WebSite: There should be a separate web site for our stuff

These four configurations are [DSC composite resources](https://docs.microsoft.com/en-us/powershell/dsc/resources/authoringresourcecomposite). If a DSC configuration gets too large, you should split it up in portions that are called composite resources. Composite resources are like functions. You can add some logic to it to meet your / your businesses’ requirements, like done in the [SecurityBase]( https://github.com/AutomatedLab/CommonTasks/blob/dev/CommonTasks/DscResources/SecurityBase/SecurityBase.schema.psm1) configuration.
We gain efficiency, flexibility and scalability by converting all common requirements into configurations (DSC composite resources). Your next task may be configuring file servers with DSC as the web server thing went great. File servers should be even simpler, and you can reuse the NetworkIpConfiguration, WindowsFeature and FilesAndFolders configuration and you are almost done. Adding configuration data should be quick now.

> Note: There will be some further articles describing the [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop) project. These ones will give an introduction into configuration management data for DSC and how to build an infrastructure release pipeline.

## Technical implementation and details

Now let’s get back to maintenance windows. Maintenance windows should be configured on every business-critical server. DSC should only do changes to a computer if in maintenance window. It makes sense to provide maintenance windows and the "new LCM behavior" as configurations, so one can assign them to a role like this:

``` yaml
Configurations:
  - DscLcmController
  - DscLcmMaintenanceWindows

DscLcmMaintenanceWindows:
  MaintenanceWindow:
    - Name: WednesdayNight
      DayOfWeek: Wednesday
      StartTime: 00:30:00
      Timespan: 02:00:00
    - Name: Sunday
      DayOfWeek: Sunday
      StartTime: 00:00:00
      Timespan: 24:00:00

DscLcmController:
  ConsistencyCheckInterval: 02:00:00
  ConsistencyCheckIntervalOverride: false
  RefreshInterval: 04:00:00
  RefreshIntervalOverride: false
  ControllerInterval: 00:15:00
  MaintenanceWindowOverride: false
  WriteTranscripts: true
```

This YAML is taken from the file [DscBaseline.yml]( https://github.com/AutomatedLab/DscWorkshop/blob/dev/DscSample/DSC_ConfigData/Roles/DscBaseline.yml) part of the DscWorkshop’s configuration data. The configurations section defines that a node having the DscBaseline role assigned, applies the configuration DscLcmController and DscLcmMaintenanceWindows. The rest of the YAML are the parameters to these configurations. There will be an extra post about the config management in the DscWorkshop project.

### DscLcmMaintenanceWindows configuration

The configuration "DscLcmMaintenanceWindows" only writes some registry keys according to the configuration data (the parameters) you hand over to it. In the previous YAML there are 2 maintenance windows defined, and this is what we can find in the registry after DSC has applied the config:

``` none
PS C:\> dir -Path HKLM:\SOFTWARE\DscLcmController\MaintenanceWindows\

    Hive: HKEY_LOCAL_MACHINE\SOFTWARE\DscLcmController\MaintenanceWindows

Name                           Property
----                           --------
SundayAllDay                   StartTime : 00:00:00
                               Timespan  : 24:00:00
                               DayOfWeek : Sunday
WednesdayNight                 StartTime : 00:30:00
                               Timespan  : 02:00:00
                               DayOfWeek : Wednesday
```

### DscLcmController configuration

The configuration "DscLcmController" does a bit more. It writes some registry keys as well. These settings are replacing some of the default settings controlling the LCM that you usually set with "Set-DscLocalConfigurationManager". These new settings are controlling the external trigger of the LCM. The LCM will be triggered for a consistency check every 2 hours and for updating the configuration from the pull server every 4 hours. But the LCM will only be triggered if the node is in one of the maintenance windows configured above (MaintenanceWindowOverride == 0).

This is what the DscLcmController configuration writes to the registry:

``` none
PS C:\> dir -Path HKLM:\SOFTWARE\ | Where-Object Name -like *LcmController

    Hive: HKEY_LOCAL_MACHINE\SOFTWARE

Name               Property
----               --------
DscLcmController   ConsistencyCheckInterval         : 02:00:00
                   ConsistencyCheckIntervalOverride : 0
                   RefreshInterval                  : 04:00:00
                   RefreshIntervalOverride          : 0
                   ControllerInterval               : 00:15:00
                   MaintenanceWindowOverride        : 0
                   WriteTranscripts                 : 1
                   LastRefresh                      : 08/04/2019 23:32:51
                   LastConsistencyCheck             : 08/04/2019 22:42:13
```

> Note: Last two registry values are not written by the DSC configuration but the scheduled task "DscLcmController".

- ConsistencyCheckInterval: This is the new interval for a consistency check. The default setting "ConfigurationModeFrequencyMins" does no longer apply. 
- ConsistencyCheckIntervalOverride: If set to true, the LCM consistency check will be triggered whenever the scheduled task "DscLcmController" runs. Maintenance windows still apply.
- RefreshInterval: This is the new interval for an update check with the pull server. The default setting "RefreshMode" does no longer apply.
- RefreshIntervalOverride: If set to true, the LCM update check will be triggered whenever the scheduled task "DscLcmController" runs. Maintenance windows still apply.
- ControllerInterval: Controls when the scheduled task runs. This interval is configured on the two scheduled tasks’ triggers.
- MaintenanceWindowOverride: If set to 1, maintenance windows do no longer apply.
- WriteTranscripts: Writes the scheduled tasks’ output to "C:\ProgramData\Dsc\LcmController".
- LastConsistencyCheck: This value is written by the DscLcmController scheduled task to remember when the last consistency check was triggered.
- LastRefresh: This value is written by the DscLcmController scheduled task to remember when the last update check was triggered.

The actual work is done by these 2 scheduled tasks that are also created and controlled by the DscLcmController configuration:

``` none
PS C:\> Get-ScheduledTask -TaskPath \DscController\

TaskPath         TaskName                          State
--------         --------                          -----
\DscController\  DscLcmController                  Ready
\DscController\  DscLcmPostpone                    Ready
```

#### LCM Postpone task

The first important step is to disable the LCM default trigger. The LCM does not offer a switch to do that, so we have to find a workaround. The workaround is a scheduled task that runs regularly and sets the LCM's ConfigurationModeFrequencyMins to the max value (31 days or 44640 minutes) using Set-DscLocalConfigurationManager. The next time the job runs it set the ConfigurationModeFrequencyMins to the max value -1 minute. This ensures that the LCM never starts automatically if there is no external trigger.
This code snippet is part of one scheduled job that the [DscLcmController]( https://github.com/AutomatedLab/CommonTasks/blob/dev/CommonTasks/DscResources/DscLcmController/DscLcmController.schema.psm1) configuration is creating.

``` PowerShell
$maxConsistencyCheckInterval = if ($currentLcmSettings.ConfigurationModeFrequencyMins -eq 30) { #44640)
    44639 #value must be changed in order to reset the LCM timer
}
else {
    44640 #minutes for 31 days
}
```

#### LCM Controller / new LCM trigger
Now that the LCM does not run at all another schedule job is required that serves as an external trigger. This one is also created by the DscLcmContoller configuration and is the more interesting one.

The LCM controller script reads the registry values created by the DscLcmContoller configuration first. Based upon that information, it decides whether the machine is in a maintenance window. Multiple maintenance windows are supported.

It then checks if enough time has passed since the last time the LCM did run (ConsistencyCheckInterval and LastConsistencyCheck).

##### Specific scenario

Let’s assume it is Monday, August 8, 2019 around 2000h. The registry values printed above exclude this day completely from maintenance. The LCM will not do any work today.
Let’s jump to August 10, 2019. This is a Wednesday and it is 0100 in the morning. This time is in the maintenance window "WednesdayNight" so the DscLcmContoller script will move forward. It then checks the timestamp stored in "LastConsistencyCheck". Let’s assume the value is "08/04/2019 22:42:13" which makes sense, as August 4 was a Sunday and the server was in maintenance the whole day. The "ConsistencyCheckInterval" is set to 2 hours. As much more time than 2 hours has passed since the last run of the LCM, the DscLcmContoller script will trigger the LCM. This will happen just once on Wednesday as the maintenance window on Wednesday night is only 1,5 hours and the "ConsistencyCheckInterval" is 2 hours. The LCM will not be triggered until Sunday August 11.

### Logging

For troubleshooting purposes, the maintenance window implementation writes a couple of very small logs in the directory "C:\ProgramData\Dsc\LcmController".

``` none
PS C:\ProgramData\Dsc\LcmController> dir

    Directory: C:\ProgramData\Dsc\LcmController

Mode                LastWriteTime         Length Name
----                -------------         ------ ----
d-----         8/5/2019   5:38 PM                MetaMof
-a----         8/5/2019   5:26 PM           8919 LcmController.ps1
-a----         8/5/2019   8:23 PM          61755 LcmController.log
-a----         8/5/2019   8:23 PM           2808 LcmControlSummery.txt
-a----         8/5/2019   5:26 PM           1564 LcmPostpone.ps1
-a----         8/5/2019   8:23 PM            444 LcmPostponeSummery.log
```

#### MetaMof folder

This folder stores the meta mof that the LcmPostpone scheduled task applies with the maximum "ConfigurationModeFrequencyMins". This prevents the LCM from running without external triggers.

#### LcmController.ps1

This script is invoked by the DscLcmController scheduled task as the external trigger for the LCM. This script looks for maintenance windows and other settings described previously. The script’s content is controlled by the "DscLcmController" configuration / DSC composite resource. Any change to it will be overwritten by DSC.

#### LcmController.log

This log file is only written, if the registry value "WriteTranscripts" is set to 1. This setting is controlled by the "DscLcmController" configuration / DSC composite resource. Thanks to the hierarchical configuration data, you can turn on this setting for all nodes, for a role or just a specific node.

> Note: Depending on the interval of the DscLcmController scheduled task, this log can grow over time. Only enable "WriteTranscripts" for debugging.

#### LcmControlSummery.txt

This file shows the decision matrix the DscLcmContoller script has done. It stores the data as CSV for human readability:

``` none
PS C:\ProgramData\Dsc\LcmController> Import-Csv -Path .\LcmControlSummery.txt | Format-Table -Property *

CurrentTime         InMaintenanceWindow DoConsistencyCheck DoRefresh LastConsistencyCheck ConsistencyCheckInterval ConsistencyCheckIntervalOverride ConsistencyCheckErrors LastRefresh          RefreshInterval RefreshIntervalOverride RefreshErrors
-----------         ------------------- ------------------ --------- -------------------- ------------------------ -------------------------------- ---------------------- -----------          --------------- ----------------------- -------------
8/5/2019 5:32:31 PM 0                   0                  0         1/1/0001 12:00:00 AM 02:00:00                 0                                False                  1/1/0001 12:00:00 AM 04:00:00        0                       False
8/5/2019 5:32:51 PM 1                   1                  1         1/1/0001 12:00:00 AM 02:00:00                                                  False                  1/1/0001 12:00:00 AM 04:00:00                                False
8/5/2019 5:35:36 PM 0                   0                  0         8/5/2019 5:32:48 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:35:40 PM 0                   0                  0         8/5/2019 5:32:48 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:35:59 PM 1                   0                  0         8/5/2019 5:32:48 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:36:58 PM 1                   1                  0         1/1/0001 12:00:00 AM 02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:38:49 PM 0                   0                  0         8/5/2019 5:36:58 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:42:26 PM 0                   0                  0         8/5/2019 5:36:58 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:42:50 PM 1                   1                  0         8/4/2019 5:36:58 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 5:53:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 6:08:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 6:23:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 6:38:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 6:53:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 7:08:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 7:23:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 7:38:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 7:53:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 8:08:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 8:23:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
8/5/2019 8:38:48 PM 0                   0                  0         8/5/2019 5:42:50 PM  02:00:00                 0                                False                  8/5/2019 5:32:51 PM  04:00:00        0                       False
```

#### LcmPostpone.ps1
The script uses the MOF file stored in the folder "MetaMof" to disable the internal trigger of the LCM. This script is invoked by the scheduled task "DscLcmPostpone". The script’s content is controlled by the "DscLcmController" configuration / DSC composite resource. Any change to it will be overwritten by DSC.

#### LcmPostponeSummery.log
Each time the LCM is postponed, one line is written to this log file.

## Summary
If you have a running DSC implementation or if you are planning to do things with DSC on Windows Management Framework 5.1 there is no standard way to add maintenance window support. The method described here may require you to change your current design as depends on the implementation shown in the [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop
). However in doing so you get a lot of added value and a really robust and flexible way of dealing with configuration data.

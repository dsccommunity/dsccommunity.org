---
title: "Realizing maintenance windows with DSC"
date: 2019-08-08T18:11:05+02:00
type: "post"
draft: false
author: "raandree"
---

## Introduction

Since 2017 I have been involved in a number of DSC projects in medium to very large enterprises. It has not been easy to implement DSC for a number of reasons. For some companies, the reason why DSC was not an option is the lack of support for maintenance windows. DSC runs whenever an internal timer expires. This is fine for some enterprises but not for all.
This article summarizes the ideas and technical implementation I have worked on with two large enterprises. Both of them have a very time-sensitive business, they don’t accept downtimes, and both wanted to have DSC running in the "ApplyAndAutoCorrenct" mode.

The way how maintenance windows have been implemented leaves room for improvement but should cover most of the requirements. You can define a start time and a time frame and if desired also a day of week.

## Technical summary

There is no fancy way of changing the behavior of the LCM shipped with Windows Management Framework 5.1. This LCM simply does not support maintenance windows and always runs according to the given interval. The only way to control it is a combination of two scheduled tasks. Yes, scheduled tasks are not always nice and tend to be hard to maintain, but: If you can configure the scheduled tasks along with your maintenance windows and along with all your other configuration using DSC, they create almost zero overhead. And thanks to DSC you know that at least these two scheduled tasks are always configured as they should be. So please, don’t stop reading just because this whole thing is based upon scheduled tasks. Scheduled tasks are the only built-in tool we have here.

One thing to be done is postponing the LCM so it will never be triggered by its default triggers. This pretty much disables the LCM. The second scheduled task serves as an external trigger for the LCM. It looks for the last time the LCM did run, the interval and the maintenance windows and triggers the LCM accordingly. If this sounds like something you could use, please read on.

## Technical requirements

The only technical requirements this solution depends on is a scheduled tasks and DSC. The actual implementation of the idea is realized with some principles, patterns and tools that are lifting DSC to a completely new level. While it makes the solution more complex at first, it pays off quickly. The things I have used here are:

- [Datum](https://github.com/gaelcolas/Datum)): Without it, flexible and scalable config management is pretty much impossible.
- [DSC Composite Resources](https://docs.microsoft.com/en-us/powershell/dsc/resources/authoringresourcecomposite): You want to be able to split up DSC configurations into manageable pieces, like you want to split up code into functions. With Datum this gets quite powerful as you can assign these composite resources to roles.

## A detour to configuration management

> NOTE: It helps having looked or even better played with the DscWorkshop project. Implementing maintenance windows within the demo provided was quite an easy task, as many things are already covered. You will find a lot of other cool principals and patterns around DSC, Policy-Driven Infrastructure and config management.

Before covering the maintenance windows, we have to take a little detour to make ourselves familiar with roles and configurations. This detour is very scenic and worth every minute. And finally, it saves you a lot of time in any future DSC project.

In the [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop) project we use [Datum](https://github.com/gaelcolas/Datum) to handle the configuration data. With Datum we can apply a pattern similar to [Puppet’s Roles and Profiles](https://puppet.com/docs/pe/2017.2/r_n_p_intro.html). The DscWorkshop uses configurations defined in the [CommonTasks](https://github.com/AutomatedLab/CommonTasks) repository. This repository is named CommonTasks as it provides simple access to a few common configurations that most of you might need when configuring servers. For example, let’s suppose you want to configure a web server with DSC. This could be the list of configurations you want to assign to a web server:

- `NetworkIpConfiguration`: Let’s make sure the server has the correct network settings
- `WindowsFeatures`: You want to make sure the OS knows how to host a web site
- `FilesAndFolders`: Your web content should be copied from somewhere
- `WebSite`: There should be a separate web site for our stuff

These four configurations are [DSC composite resources](https://docs.microsoft.com/en-us/powershell/dsc/resources/authoringresourcecomposite). If a DSC configuration gets too large, you should split it up in portions that are called composite resources. Composite resources are like functions. You can add some logic to it to meet your / your businesses’ requirements, like done in the [SecurityBase]( https://github.com/AutomatedLab/CommonTasks/blob/dev/CommonTasks/DscResources/SecurityBase/SecurityBase.schema.psm1) configuration.
We gain efficiency, flexibility and scalability by converting all common requirements into configurations (DSC composite resources). Your next task may be configuring file servers with DSC as the web server thing went great. File servers should be even simpler, and you can reuse the NetworkIpConfiguration, WindowsFeature and FilesAndFolders configuration and you are almost done. Adding configuration data should be quick now.

> Note: There will be some further articles describing the [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop) project. These ones will give an introduction into configuration management data for DSC and how to build an infrastructure release pipeline.

## Technical implementation and details

Now let’s get back to maintenance windows. Maintenance windows should be configured on every business-critical server. DSC should only do changes to a computer if in maintenance window. However monitoring the computer should be done all the time. It makes sense to provide maintenance windows and the "new LCM behavior" as configurations, so one can assign them to a role like this:

``` yaml
Configurations:
  - DscLcmController
  - DscLcmMaintenanceWindows

DscLcmMaintenanceWindows:
  MaintenanceWindow:
    - Name: FirstWednesdayNight
      DayOfWeek: Wednesday
      StartTime: 00:30:00
      Timespan: 02:00:00
      On: 1st
    - Name: SundayAllDay
      DayOfWeek: Sunday
      StartTime: 00:00:00
      Timespan: 24:00:00

DscLcmController:
  MaintenanceWindowMode: AutoCorrect # the other option is 'Monitor'
  MonitorInterval: 00:05:00
  AutoCorrectInterval: 00:10:00
  AutoCorrectIntervalOverride: false
  RefreshInterval: 00:20:00
  RefreshIntervalOverride: false
  ControllerInterval: 00:01:00
  MaintenanceWindowOverride: false
  WriteTranscripts: true
```

> Note: The extremly short intervals used here are mainly for testing and demonstration purposes and not recommended in production.

This YAML is taken from the file [DscBaseline.yml]( https://github.com/AutomatedLab/DscWorkshop/blob/dev/DscSample/DSC_ConfigData/Roles/DscBaseline.yml) part of the DscWorkshop’s configuration data. The configurations section defines that a node having the DscBaseline role assigned, applies the configuration DscLcmController and DscLcmMaintenanceWindows. The rest of the YAML are the parameters to these configurations. There will be an extra post about the config management in the DscWorkshop project.

### DscLcmMaintenanceWindows configuration

The configuration "DscLcmMaintenanceWindows" only writes some registry keys according to the configuration data (the parameters) you hand over to it. In the previous YAML there are 2 maintenance windows defined, and this is what we can find in the registry after DSC has applied the config:

``` none
PS C:\> dir -Path HKLM:\SOFTWARE\DscLcmController\MaintenanceWindows\

    Hive: HKEY_LOCAL_MACHINE\SOFTWARE\DscLcmController\MaintenanceWindows

Name                           Property
----                           --------
FirstWednesdayNight            StartTime : 00:30:00
                               Timespan  : 02:00:00
                               DayOfWeek : Wednesday
                               On        : 1st
SundayAllDay                   StartTime : 00:00:00
                               Timespan  : 24:00:00
                               DayOfWeek : Sunday
                               On        :
```

### DscLcmController configuration

The configuration "DscLcmController" does a bit more. It writes some registry keys as well. These settings are replacing most of the default settings controlling the LCM that you usually set with "Set-DscLocalConfigurationManager". These new settings are controlling the external trigger of the LCM. There is no 'ConfigurationModeFrequencyMins' anymore. Instead there are two new values, 'AutoCorrectInterval' and 'MonitorInterval'.

- **MonitorInterval:** This interval invoked the LCM in the 'ApplyAndMonitor' mode. No changes will be done to the node. The interval is not effected by the maintanence window.
- **AutoCorrectInterval:** This interval invoked the LCM in the 'ApplyAndAutoCorrect' mode. It does only apply if the node is in a maintenance window.

In the case described aboove, changes will only be applied on each first Wednesday from 00:30 to 02:30 and on Sunday the whole day. If in maintenance windows, the LCM will be invoked every 10 minutes to apply the configuration in case there is a drift. If not in a maintenance window, each 5 minutes the configuration is monitored and a report sent to the pull server.

This is what the DscLcmController configuration writes to the registry:

``` none
PS C:\> dir -Path HKLM:\SOFTWARE\ | Where-Object Name -like *LcmController

    Hive: HKEY_LOCAL_MACHINE\SOFTWARE

Name               Property
----               --------
DscLcmController               MaintenanceWindowMode       : AutoCorrect
                               MonitorInterval             : 01:00:00
                               AutoCorrectInterval         : 02:00:00
                               AutoCorrectIntervalOverride : 0
                               RefreshInterval             : 04:00:00
                               RefreshIntervalOverride     : 0
                               ControllerInterval          : 00:05:00
                               MaintenanceWindowOverride   : 0
                               WriteTranscripts            : 1
                               LastLcmPostpone             : 08/27/2019 09:55:45
                               LastAutoCorrect             : 08/27/2019 20:40:17
                               LastRefresh                 : 08/27/2019 10:58:28
                               LastMonitor                 : 08/27/2019 20:46:22
```

> Note: Last three registry values are not written by the DSC configuration but the scheduled task "DscLcmController".

- `MaintenanceWindowMode`: This should be set to 'AutoCorrect'. If set to 'Montitor' the maintenance window functionality is disabled.
- `MonitorInterval`: If this interval applies, the LcmController script puts the LCM to the 'ApplyAndMonitor' mode and triggers a conisitency check.
- `AutoCorrectInterval`: If this interval applies, the LcmController script puts the LCM to the 'ApplyAndAutoCorrect' mode and triggers a conisitency check. This interval applies only if in maintenance window.
- `AutoCorrectIntervalOverride`: If enabled the 'AutoCorrectInterval' is no longer considered. This is mainly for troubleshooting. Maintenance windows still apply.
- `RefreshInterval`: If this interval applies, the LcmController script triggers the LCM to do an update with the pull server. This interval applies only if in maintenance window.
- `RefreshIntervalOverride`: If enabled the 'RefreshInterval' is no longer considered. This is mainly for troubleshooting. Maintenance windows still apply.
- `ControllerInterval`: Controls when the scheduled task runs. This interval is configured on the scheduled task’s (\DscController\DscLcmController) trigger.
- `MaintenanceWindowOverride`: If set to 1, maintenance windows do no longer apply. This is mainly for troubleshooting.
- `WriteTranscripts`: Writes the scheduled tasks’ output to "C:\ProgramData\Dsc\LcmController".
- `LastLcmPostpone`: A timestamp written by the LcmController script indicating when the LCM was postone the last time.
- `LastAutoCorrect`: This value is written by the DscLcmController scheduled task to remember when the last AutoCorrect was triggered.
- `LastRefresh`: This value is written by the DscLcmController scheduled task to remember when the last update check was triggered.
- `LastMonitor`: This value is written by the DscLcmController scheduled task to remember when the last Monitor was triggered.


The actual work is done by a single scheduled task that is also created and controlled by the DscLcmController configuration:

``` none
PS C:\> Get-ScheduledTask -TaskPath \DscController\

TaskPath         TaskName                          State
--------         --------                          -----
\DscController\  DscLcmController                  Ready
```

#### LCM Controller / new LCM trigger

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

Now that the LCM does not run at all another schedule job is required that serves as an external trigger. This one is also created by the DscLcmContoller configuration and is the more interesting one.

The LCM controller script reads the registry values created by the DscLcmContoller configuration first. Based upon that information, it decides whether the machine is in a maintenance window. Multiple maintenance windows are supported.

It then checks if enough time has passed since the last time the LCM did run (AutoCorrectInterval, RefreshInterval and MonitorInterval).

##### Specific scenario

Let’s assume it is Monday, August 8, 2019 around 20:00. The registry values printed above exclude this day completely from maintenance. The LCM will not do any work today.
Let’s jump to August 10, 2019. This is a Wednesday and it is 01:00 in the morning. This time is in the maintenance window "WednesdayNight" so the DscLcmContoller script will move forward. It then checks the timestamp stored in "LastAutoCorrect". Let’s assume the value is "08/04/2019 22:42:13" which makes sense, as August 4 was a Sunday and the server was in maintenance the whole day. The "AutoCorrectInterval" is set to 2 hours. As much more time than 2 hours has passed since the last run of the LCM, the DscLcmContoller script will trigger the LCM. This will happen just once on Wednesday as the maintenance window on Wednesday night is only 1,5 hours and the "AutoCorrectInterval" is 2 hours. The LCM will not be triggered until Sunday August 11.

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
-a----         8/5/2019   8:23 PM            444 LcmPostponeSummery.log
```

#### MetaMof folder

This folder stores the meta mof that the LcmPostpone scheduled task applies with the maximum "ConfigurationModeFrequencyMins". This prevents the LCM from running without external triggers.

#### LcmController.ps1

This script is invoked by the DscLcmController scheduled task as the external trigger for the LCM. This script looks for maintenance windows and other settings described previously. The script’s content is controlled by the "DscLcmController" configuration / DSC composite resource. Any change to it will be overwritten by DSC.

The script also disables the LCM internal timers. It uses the MOF file stored in the folder "MetaMof" to disable the internal trigger of the LCM. This script is invoked by the scheduled task "DscLcmPostpone". The script’s content is controlled by the "DscLcmController" configuration / DSC composite resource. Any change to it will be overwritten by DSC.

#### LcmController.log

This log file is only written, if the registry value "WriteTranscripts" is set to 1. This setting is controlled by the "DscLcmController" configuration / DSC composite resource. Thanks to the hierarchical configuration data, you can turn on this setting for all nodes, for a role or just a specific node.

> Note: Depending on the interval of the DscLcmController scheduled task, this log can grow over time. Only enable "WriteTranscripts" for debugging.

#### LcmControlSummery.txt

This file shows the decision matrix the DscLcmContoller script has done. It stores the data as CSV for human readability:

``` none
PS C:\ProgramData\Dsc\LcmController> Import-Csv -Path .\LcmControllerSummery.txt | Format-Table -Property *


CurrentTime           InMaintenanceWindow DoAutoCorrect DoMonitor DoRefresh LastAutoCorrect       LastMonitor
-----------           ------------------- ------------- --------- --------- ---------------       -----------
8/30/2019 7:10:26 PM  1                   1             0         1         1/1/0001 12:00:00 AM  1/1/0001 12:00:00 AM
8/30/2019 7:11:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  1/1/0001 12:00:00 AM
8/30/2019 7:12:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  1/1/0001 12:00:00 AM
8/30/2019 7:13:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  1/1/0001 12:00:00 AM
8/30/2019 7:14:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  1/1/0001 12:00:00 AM
8/30/2019 7:15:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  1/1/0001 12:00:00 AM
8/30/2019 7:16:24 PM  1                   0             1         0         8/30/2019 7:10:26 PM  1/1/0001 12:00:00 AM
8/30/2019 7:17:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  8/30/2019 7:16:24 PM
8/30/2019 7:18:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  8/30/2019 7:16:24 PM
8/30/2019 7:19:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  8/30/2019 7:16:24 PM
8/30/2019 7:20:23 PM  1                   0             0         0         8/30/2019 7:10:26 PM  8/30/2019 7:16:24 PM
8/30/2019 7:21:25 PM  1                   1             0         0         8/30/2019 7:10:26 PM  8/30/2019 7:16:24 PM
8/30/2019 7:22:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:16:24 PM
8/30/2019 7:23:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:16:24 PM
8/30/2019 7:24:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:16:24 PM
8/30/2019 7:25:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:16:24 PM
8/30/2019 7:26:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:16:24 PM
8/30/2019 7:27:25 PM  1                   0             1         0         8/30/2019 7:21:25 PM  8/30/2019 7:16:24 PM
8/30/2019 7:28:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:27:25 PM
8/30/2019 7:29:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:27:25 PM
8/30/2019 7:30:23 PM  1                   0             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:27:25 PM
8/30/2019 7:31:25 PM  1                   0             0         1         8/30/2019 7:21:25 PM  8/30/2019 7:27:25 PM
8/30/2019 7:32:24 PM  1                   1             0         0         8/30/2019 7:21:25 PM  8/30/2019 7:27:25 PM
8/30/2019 7:33:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:27:25 PM
8/30/2019 7:34:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:27:25 PM
8/30/2019 7:35:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:27:25 PM
8/30/2019 7:36:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:27:25 PM
8/30/2019 7:37:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:27:25 PM
8/30/2019 7:38:24 PM  1                   0             1         0         8/30/2019 7:32:24 PM  8/30/2019 7:27:25 PM
8/30/2019 7:39:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:38:24 PM
8/30/2019 7:40:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:38:24 PM
8/30/2019 7:41:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:38:24 PM
8/30/2019 7:42:23 PM  1                   0             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:38:24 PM
8/30/2019 7:43:25 PM  1                   1             0         0         8/30/2019 7:32:24 PM  8/30/2019 7:38:24 PM
```

#### LcmPostponeSummery.log
Each time the LCM is postponed, one line is written to this log file.

## Summary
If you have a running DSC implementation or if you are planning to do things with DSC on Windows Management Framework 5.1 there is no standard way to add maintenance window support. The method described here may require you to change your current design as depends on the implementation shown in the [DscWorkshop](https://github.com/AutomatedLab/DscWorkshop
). However in doing so you get a lot of added value and a really robust and flexible way of dealing with configuration data.

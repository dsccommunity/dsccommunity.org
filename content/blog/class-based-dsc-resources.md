---
title: "Class Based DSC Resource only proposal"
date: 2020-10-02T10:00:00+02:00
type: "post"
draft: false
author: gaelcolas
---

Recently, the PowerShell team announced [plans to create a new JSON-based schema](https://github.com/PowerShell/PowerShell/issues/13359) so that _eventually_ PowerShell Desired State Configuration (DSC) could get rid of its MOF/CIM dependencies, and the PowerShell code base could remove its deprecated Management Interface (MI) implementation (`Microsoft.Management.Infrastructure.CimProperty`, `Microsoft.Management.Infrastructure.CimInstance` and so on...).

The suggested change was only for DSC Resources schema, and no changes to MOF compilations was announced for now. Removing the CIM/MI/MOF code and dependency is definitely an overarching goal for PowerShell, but it won't happen overnight.

Let's add that when we mention change to PowerShell, it only affects the version 7.2 and up. **Windows PowerShell 5.1 will (mostly) be untouched and unaffected**.

After discussing the matter with the community via the GitHub issues, Twitter, and the DSC Community Call, the Powershell team published a change of direction: they intend to [start with supporting DSC Class based resources only](https://github.com/PowerShell/PowerShell/issues/13731) (but are still open for discussion).

{{< youtube toTwph350zY >}}

# Opinion

Now that I've explained the context for those just joining-in, I'll explain why I think it's a good move and one I've advocated for.
This is my opinion, and may not be shared by other DSC community members, maintainers, or within Microsoft.

People use DSC in many ways. It can be done via the LCM in a push mode or via a pull server, calling `Invoke-DscResource` in scripts, Azure Policy Guest Configuration, Azure Automation DSC, or using other third party such as Puppet, Ansible, Chef, Salt and so on...

DSC is a loaded term with multiple components, but here we're focusing on the PowerShell DSC Resources (those written in PowerShell), the most atomic component specific to DSC, that all consumption _models_ leverage.

We're excluding the ones witten in Native code, Python, or other languages.

## Backward Compatibility

To understand why it impacts backward compatibility, it's good to review how we got there.

### Why MOF and CIM, to begin with?

Although I don't know the details behind that choice, it was a good idea at the time (at least the PS Team thought).
Bear in mind that was more than 7 years ago, as WMF 4.0 was [released in October 2013](https://devblogs.microsoft.com/powershell/windows-management-framework-4-0-is-now-available/).

MOF allowed serialization and deserialization of objects, using existing Microsoft (and I think DMTF) standard at the time: an agent could use that communication format, and I assume that there was a good understanding of the technology, it was supported, and helped avoid writing a new technology stack and libraries specific to DSC.

The DSC resource construct, in its concept, has always been similar to a class, where it can have [a single instance](https://docs.microsoft.com/en-us/powershell/scripting/dsc/resources/singleinstance?view=powershell-7) (addressed by its key properties), and [some properties are read-only](https://docs.microsoft.com/en-us/powershell/scripting/dsc/resources/authoringresourceclass?view=powershell-7#declare-properties).

But with PowerShell 4 in WMF 4.0 Classes did not exist yet, so the metadata needed to be added somewhere, and the MOF schema was created.

The role of that MOF file is to add the metadata about the properties, and describe how those objects should be serialized and deserialized (think about Credential objects for instance), for CIM. CIM has no knowledge or understanding of PowerShell.

Mapping PowerShell Object to CIM using MOF wasn't great for non scalar types, and that's why we ended up with with things like `EmbeddedInstance("MSFT_Credential")` in the MOFs or `[Microsoft.Management.Infrastructure.CimInstance[]]` in your PowerShell code to represent a dictionary, that you [then had to convert to a hashtable](https://powershell.org/forums/topic/hashtable-as-parameter-for-custom-dsc-resource/).

See Dave Wyatt's answer below (note, this one is not recursive, for brevity):

```PowerShell
function Convert-CimInstancesToHashtable([Microsoft.Management.Infrastructure.CimInstance[]] $Pairs)
{
    $hash = @{}
    foreach ($pair in $Pairs)
    {
        $hash[$pair.Key] = $pair.Value
    }
 
    return $hash
}
```

You may also have came across DSC Resources that use `New-CimInstance` to [create an object that is added to the hashtable returned by the resource](https://github.com/dsccommunity/xHyper-V/blob/aff660f3a76edb6f60e243e7a8bc450b56340cc0/source/DSCResources/MSFT_xVhdFileDirectory/MSFT_xVhdFileDirectory.psm1#L78-L81).


```PowerShell
New-CimInstance -ClassName MSFT_FileDirectoryConfiguration -Property @{
                DestinationPath = $finalPath
                Ensure = 'Absent'
            } -Namespace 'root/microsoft/windows/desiredstateconfiguration' -ClientOnly
```

Let me add that this is not trivial for people new to DSC, and moving away from CIM/MOF means we have a chance to _eventually_ use the actual PowerShell types end to end, as we would not be limited by type mapping between CIM and PowerShell via MOF.

This is particularly a problem for resources on Linux as the `CIM Cmdlets` do not exist there. Also the PowerShell team would like to clean up the CIM libraries in PowerShell, so [there would be no workaround like this](https://github.com/dsccommunity/DscResource.Common/blob/master/source/Public/ConvertTo-CimInstance.ps1#L26).

Class-based DSC Resources do not need the MOF definition for the extra metadata, as we use the `[DscResource()]` and `[DscProperty()]` attributes for them, and property types can use Enum or a custom Class.

```PowerShell
[DscResource()]
class ClassRsrcWithSubType2 {

    [DscProperty(Mandatory)]
    [Ensure] $Ensure

    [DscProperty(Key)]
    [string]$Name

    [DscProperty()]
    [ClassSubType2] $SubTypeProperty
# ...
```

That said, some limitations are similar because under the hood, the conversion still occurs from PowerShell to CIM, and back to PowerShell.

But if we have a slightly different way to **return** the data between PS5.1 and PS7.2+, we can easily update the resource with an `if {} else {}` statement:

```PowerShell
if ($PSVersionTable.PSVersion.Major -ge 7) {
    [MSFT_FileDirectoryConfiguration]@{
      Ensure = 'Absent'
      DestinationPath = $finalPath
    }
}
else {
  New-CimInstance -ClassName MSFT_FileDirectoryConfiguration -Property @{
                DestinationPath = $finalPath
                Ensure = 'Absent'
            } -Namespace 'root/microsoft/windows/desiredstateconfiguration' -ClientOnly
}
```

Fine when your resource returns data, but when you want to invoke with an embedded type (aka sub-type, nested type), you can't always change the code invoking it (say the LCM). Bear in mind PS 5.1 is set in stone, so it won't get updated.

And that leads us to **the major flaw**, in my opinion, for [the former JSON-based DSC resource proposal](https://github.com/PowerShell/PowerShell/issues/13359): We'd have to replace the `[Microsoft.Management.Infrastructure.CimInstance[]]` with `[PSObject]`.

> With this change, embedded objects passed to Get/Set/Test will be PSObjects instead of CimInstances. Unless the script is explicitly checking that it is a CimInstance, existing code should work with PSObject.

Doing so would **break compatibility between PS 5.1 and PS 7+** for any resource using such subtypes / embedded objects.

Using class-based DSC resource, and the `if {} else {}` workaround I mentioned above, would support greater backward compatibilities.  

Obviously, there's still a lot of differences between PS5.1 and PS7 which means for some resources it may not be possible to be used in PS7 anyway  
The most common example could be because the supporting module is _still_ a snap-in (looking at you, SharePoint), and/or some modules don't support PowerShell Core yet.

And from there, there are some more legitimate questions to consider, keep reading.

## DSC Community does not use class-based resources

This is true, but it's somewhat accidental.

Microsoft and the DSC community came up with the High Quality Resource Module (HQRM) guidelines a while ago, and at that time it was 

## Unit Testing classes and Class-Based DSC Resources is hard

## Classes are more complex for non-dev

### Harder to pick up

### JSON is easier

## Reduce number of (potential) contributors



## 


Class are more complex
Unit Testing
Integration Testing




 which these days usually starts with a GitHub issue, is shared on Twitter then sometimes followed by a post on the PowerShell blog.

I'm completely for this move, and MOF-based DSC Resources also have their limitations, and a JSON based DSC resource schema would not have easily fixed but could have made worse (for instance, not supporting the same Parameter type making some resource working for **either** **JSON** or **MOF**, not both.

Before being in favour of Class-only DSC Resources, and while working on the PS7 RFC for Invoke-DscResource, I had to dig a bit deeper into the different type of DSC Resource works, and the problems we have with them such as testing, discovery, and different ways to implement them.

I agree that PowerShell Classes have some limitations and sometimes annoying behaviour, and like many PowerShell users I'd like improvement in that area.
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

# Opinions

Now that I've explained the context for those just joining-in, I'll explain why I think it's a good move and one I've advocated for.
This is my opinion, and may not be shared by other DSC community members, maintainers, or within Microsoft.

People use DSC in many ways. It can be done via the LCM in a push mode or via a pull server, calling `Invoke-DscResource` in scripts, Azure Policy Guest Configuration, Azure Automation DSC, or using other third party such as Puppet, Ansible, Chef, Salt and so on...

DSC is a loaded term with multiple components, but here we're focusing on the PowerShell DSC Resources (those written in PowerShell), the most atomic component specific to DSC, that all consumption _models_ leverage.

We're excluding the ones witten in Native code, Python, or other languages.

## Backward Compatibility

To understand why it impacts backward compatibility, it's good to review how we got there. Hang tight..

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

That said, some limitations are similar because under the hood, the conversion still occurs from PowerShell to CIM, and back to PowerShell when the LCM is involved.

But if we have a slightly different way to **return** the data between PS5.1 and PS7.2+, we can easily update the resources with an `if {} else {}` statement:

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

Fine when your resource returns data, but when you want to invoke with an embedded type (aka sub-type, nested type), you can't always change the code invoking it (say the LCM).  
Bear in mind PS 5.1 is set in stone, so it won't get updated.

And that leads us to **the major flaw**, in my opinion, for [the former JSON-based DSC resource proposal](https://github.com/PowerShell/PowerShell/issues/13359): We'd have to replace the `[Microsoft.Management.Infrastructure.CimInstance[]]` with `[PSObject]`.

> With this change, embedded objects passed to Get/Set/Test will be PSObjects instead of CimInstances. Unless the script is explicitly checking that it is a CimInstance, existing code should work with PSObject.

Doing so would **break compatibility between PS 5.1 and PS 7+** for any resource using such subtypes / embedded objects.

Using class-based DSC resource, and the `if {} else {}` workaround I mentioned above, would support greater backward compatibility scenarios.  

Obviously, there's still a lot of differences between PS5.1 and PS7 which means for some resources it may not be possible to be used in PS7 anyway  
The most common example could be because the supporting module is _still_ a snap-in (looking at you, SharePoint), and/or some modules don't support PowerShell Core yet.

And from there, there are some more legitimate questions to consider, keep reading.

## DSC Community does not use class-based resources

This is true, but it's somewhat accidental.

Microsoft and the DSC community came up with the High Quality Resource Module (HQRM) guidelines years ago, and at that time it was important to support WMF 4.0 (aka DSCv1).

Another argument was the difficulty to do Unit testing of PowerShell classes, which I'll cover further down. 

The DSC Community has re-evaluated its position (in the community calls) and concluded they do not see a strong case to spend time supporting Windows Server 2012 R2 and, even less, WMF 4.0.
Older versions of the resource modules are still available in the gallery if needed.

Now in the past few months we have discussed several times the pros and cons to moving to class based resources, and we agreed that there's a few sticky points:

- We value quality and consistency across our many repositories.
- We need to make it easy for contributors to use class based DSC Resources and testing it.
- Several ways exists for doing Class resource, only one is valid, and needs to be documented.
- We can only move all resource modules to Class resource when our tooling supports it (DscResource.Test, Sampler, DscResource.AnalyzerRules...).
- We needed more (community) experience.

Since then we had a DSC Community call were Bartek Bielawski ([@bielawb](https://twitter.com/bielawb?lang=en) on Twitter) came to [present on the class resources](https://youtu.be/r-eKNZ7iEfw?t=172) that he's been using in production for a while (along with Daniel Both [@poshboth](https://twitter.com/poshboth)).  
We also got more experience with Class-based resource with [`JeaDsc`](https://github.com/dsccommunity/JeaDsc/tree/master/source/DSCClassResources), although it's not the approach I would _recommend_ today. Great experience nonetheless, and great work.

We've made several changes to our pipeline automation, and getting to a point (soon) where adding DSC Class Resource should be easier.

{{< youtube bbpFBsl8K9k >}}

I also had to dig a lot deeper when I worked on the `Invoke-DscResource` RFC with the PowerShell team for PowerShell 7.

During this experimentation, and also following the [great work done by Michael Lombardi at Puppet](https://puppetlabs.github.io/iac/news/roadmap/2020/09/21/dsc-release.html) to "Puppetize" DSC Resource modules, we identified some challenges in getting type information for DSC resources, and that Classes could make this easier.

I also found that converting a MOF schema to a PowerShell Class, and then adding the content from the PSM1 of those Get/Set/Test functions to the created class, could be automated using AST.

That's definitely a tool the DSC community would like to invest time on, as a matter of priority.

So even if the DSC Community is not widely using Class-based resources, people in the community have been using them in production for quite some time already, with no extra issues over MOF based ones, as long as you do it a certain way, which I'll document another day (in short make the class parts of your main module's PSM1, no nested-module or DSCClassBasedResources nonsense ;) ).

We've also identified what we need to do, and we're working on it already, even before the PowerShell team made those plans.

## Unit Testing classes and Class-Based DSC Resources is hard

Yes, but no. Ok, maybe...

When they came out, that was one of the original blocker, along with supporting WMF4.
They were new, we had little experience with them, and [the "traditional" way to mock them was not working](https://github.com/pester/Pester/issues/706).

Now, the way DSC uses PowerShell Classes is relatively _simple_ and you can achieve something close to mocking by using different techniques, such as using script Method on your object.  
This was well documented by Ben Gelens ([@bgelens](https://twitter.com/bgelens)) back in his [DockerDsc module](https://github.com/bgelens/DockerDsc/blob/Dev/Tests/Unit/DockerService.Tests.ps1#L84).

```PowerShell
$dockerDsc = [DockerService]::new()
$dockerDsc.Ensure = [Ensure]::Present
$dockerDsc = $dockerDsc | Add-Member -MemberType ScriptMethod `
  -Name ResolveDockerDPath `
  -Value { return 'TestDrive:\dockerd.exe' } `
  -Force `
  -PassThru

Mock -CommandName Get-Service -MockWith {[pscustomobject]@{Name='Docker'}}
```

Worth noting, Jakub Jares ([@nohwnd](https://twitter.com/nohwnd), the maintainer of Pester) is [suggesting to build this in Pester 5](https://twitter.com/nohwnd/status/1308715571756912640?s=20) (go upvote now, please).

> [_@nowhnd:_](https://twitter.com/nohwnd/status/1308752521142435842?s=20) The api would probably look like this:  Mock -Type ([DateTime]) -Property Now -Get <the value> But imho the final form is not that important. It does work on PowerShell  classes. In the end you should be able to use this to replace almost any method and property.

Again, that's definitely something that we will work on and document, but I don't see this as a major obstacle.  
We could also mock by inheriting the class and overridding that method.

Now, I'd like to slide-in another opinion, which might be unpopular, but your DSC Resource PSM1 or Class should not be thousands of lines long.  
This subject is worth its own article (one day), but the DSC Resource is **only** an interface to PowerShell **scripts** (in a broad sense), where we think in terms of **Resource** (duh), and ensure **idempotency** (always converging to the same state regardless of initial application).

That means, and that is what the brilliant [ToolMaking in a Month of Lunches](https://www.manning.com/books/learn-powershell-toolmaking-in-a-month-of-lunches) by Don Jones ([@concentrateddon](https://twitter.com/concentrateddon)) and Jeff Hicks ([@JeffHicks](https://twitter.com/JeffHicks)) preach: if you build re-usable tools (hint, you should), then you should make re-usable components (functions / modules). And by extrapolating, the DSC Resource is just another interface to that, serving the purpose of adding idempotency and forcing the management of an atomic resource.

The DSC sugar-coating is really for what's specific to thinking resource and idempotency, but the functionality should be available through a different interface, and in PowerShell world, that's a function.  
And mocking function works.

Yes I know that's not always (rarely?) the case in the DSC Community Resource modules, but we've made good progress to make it easier to supplement a module of functions, with a specialised module focusing on the DSC interface, by [embedding the module of functions](https://dsccommunity.org/blog/use-dscresource-common-functions-in-module/).  
Another article worth to write...

## Classes are more complex for non-dev

Ah, that's a common argument and not totally unfounded.
I'll try to go through different angles without getting stuck too much in the easy/hard argument, because it is subjective.

### Harder to pick up

Classes are, as a concept of object oriented programming, harder to understand than procedural programming and functions, I give you that.

That said, DSC Resource is in itself a concept harder than just functions, and if you mix-in the MOF format, the specific way you need to craft your MOF schema, how your functions parameters need to match that, and how you need consistency between different functions... it's a bit of a mess.

The DSC Resource concept being so close to a concept of a class, and does not need extra associated files when part of your main module PSM1 (which I recommend), it has less moving parts.

The intellisense experience is better in your IDE, it's easier to make edits, and you don't need to use tools such as the xDscResourceDesigner.

### JSON is easier

Than MOF? Yes, totally.
I actually hope we'll eventually get a JSON compilation of DSC configurations in JSON instead of MOF, but that's not on the table yet.

But when you're working with PowerShell, why would you need a separate schema anyway, whether JSON, MOF or other?

The `[DscResource()]` and `[DscProperty()]` attributes could be re-used for the functions' parameters, and all your metadata would then be accessible via AST (no separate moving parts).

But that would not be backward compatible with PS 5.1, nor would a JSON schema, as I've explained earlier.

### Reduce number of (potential) contributors

By using Classes, and making it slightly harder to comprehend, we're reducing the number of contributors, or potential contributors

That is a great point, and something we're all very cautious about.

In our experience, looking at the existing contributors of the DSC Community, I don't think that would have any sensible impact (after we've done the transition).

Making the transition is a big job (mainly refactoring the Unit tests), but the _good_ news is that we've just done that with the switch to our new CI/CD pipeline model.  
Tests are key, and it was good but painful to refactor them and pay back some of that debt we accumulated over the years.

I think the main issues we're having is with less advanced contributors or potential contributors, but the main limiting facorsare the lack of content, examples and how-tos.

Making the module template easier to use, creating video to show its usage, documenting our approaches, simplifying the DOCs should yield the best results to lower the bar to entry and get more contributors.  
As a first milestone, in this context, I think that's another great reason to focus on classes for now.

Obviously, ensuring DSC is felt as a safe investment, and having the PowerShell team focused in creating a great experience is also key to gaining new contributors.

# Conclusion

I'm really happy with the current plan, and how the consultation was executed by the PowerShell team.  
I'm lucky to be working closely with them through my work with the Guest Configuration team, and I'm grateful for that priviledge.

In the GitHub issue Steve Lee clarifies that it's the initial intention, but if we (the community) feel that we're missing out or this initial plan is not enough, they can always re-consider adding the JSON schema to DSC Resources.

This is a good (re)start and the DSC Community will do it's part to make the transition smoother.
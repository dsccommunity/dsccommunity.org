---
title: "Convert tests to Pester 5 for a DSC Community repository"
date: 2020-12-28T00:00:00+02:00
draft: false
author: johlju
---

This blog post will guide you on how to convert existing tests in a
DSC Community DSC resource module repository using a new pattern that is
better suited for Pester 5.

You are welcome to share any comments or issues you having around this
process in the [Discord or Slack #DSC channel](https://dsccommunity.org/community/contact/).

This previous blog post [Converting tests to Pester 5](https://dsccommunity.org/blog/converting-tests-to-pester5/)
covered an early version of Pester 5 and the patterns that should be used
have been improved (and are still being improved).

## Table of Contents

- [Before we start, a note about self-contained tests](#before-we-start-a-note-about-self-contained-tests)
- [Guideline for converting tests in a DSC Community repository](#guideline-for-converting-tests-in-a-dsc-community-repository)
  - [Requirements](#requirements)
  - [Rules](#rules)
  - [Fixture setup and teardown](#fixture-setup-and-teardown)
    - [MOF DSC Resource](#mof-dsc-resource)
    - [DSC Resource Common Module](#dsc-resource-common-module)
  - [Using stub PowerShell module](#using-stub-powershell-module)
    - [How to use stub module in tests](#how-to-use-stub-module-in-tests)
  - [Mocking](#mocking)
  - [Calling function to be tested](#calling-function-to-be-tested)
  - [Using variables](#using-variables)
    - [Setting variables in the module's scope](#setting-variables-in-the-modules-scope)
    - [Passing variables into the module's scope](#passing-variables-into-the-modules-scope)
  - [Asserting](#asserting)
    - [Assert result from called function](#assert-result-from-called-function)
      - [Assert result in the `It`-block](#assert-result-in-the-it-block)
      - [Assert result in the `AfterEach`-block](#assert-result-in-the-aftereach-block)
      - [Assert result in the `AfterAll`-block](#assert-result-in-the-afterall-block)
    - [Assert called mocks](#assert-called-mocks)
      - [Assert called mocks in the `It`-block](#assert-called-mocks-in-the-it-block)
      - [Assert called mocks in the `AfterEach`-block](#assert-called-mocks-in-the-aftereach-block)
      - [Assert called mocks in the `AfterAll`-block](#assert-called-mocks-in-the-afterall-block)
    - [Asserting verifiable mocks](#asserting-verifiable-mocks)
      - [Verifiable mock in `BeforeAll`-block](#verifiable-mock-in-beforeall-block)
      - [Verifiable mock in `BeforeEach`-block or `It`-block](#verifiable-mock-in-beforeeach-block-or-it-block)
    - [Assert thrown exception messages](#assert-thrown-exception-messages)
      - [Assert thrown exception messages for private functions](#assert-thrown-exception-messages-for-private-functions)
      - [Assert thrown exception messages for public functions](#assert-thrown-exception-messages-for-public-functions)
    - [Using `Because` in assert](#using-because-in-assert)

## Before we start, a note about self-contained tests

We developers have a number one rule that it is bad to duplicate code and
instead code should be reused (the [DRY principle](https://www.digitalocean.com/community/tutorials/what-is-dry-development)).
It is normally good to reuse code, but when it comes to writing Pester tests
this can be bad thing. Reusing code leads to tests not being self-contained
and tests can become very complex for even seasoned contributors to contribute
to (I know, I been there myself).

I have seen the need, both as a contributor and maintainer helping contributors
with Pester tests, to simplify the tests. Both so that contributors
themselves can update tests, secondly so that maintainers can more
easily give pointers to contributors on how tests can be improved.

**In my experience the number one reason for pull request to be abandoned**
**is because tests are too hard to learn to write, which leads us to the other**
**challenge... bandwidth for both contributor and maintainer.**

So what is a self-contained test? I would like to describe it as where
the mocks, the call to the function being tested, and the asserts of the
result are contained in a self-contained atomic code block, usually a
`Context`-block. This will help new contributors to read the test code
without needing to scroll up and down in the code. It will be easy for
contributors to find the right test to modify for the change they are
making by just reading one or two pages of code. This means not being
afraid to duplicate code! You may think that the code will be slower to
run if there is more code, but in reality it can be faster than having a
very complex test that reuses code. Pester does not really care (speed
wise) if the test is 1000 rows or 2000 rows. It doesn't even compare to
the effectiveness of enabling contributors to more easily write tests.

Take for example the following two tests. The code for the mock of
`Get-ServerProtocolObject` could be easily moved out from each test and
moved into a separate `BeforeAll`-block in a parent `Context`-block. This
is what developers instinctively want to do. But what happens if we
do that? Say a contributor contributes a change that needs a new test. The
contributor must then browse the code to make sure how it works, secondly
the contributor must scroll through the test to see if there are other
mocks that might mess up the change to the test the contributor is trying
to make. Consider if we have reused code similar throughout the tests in
that file (which could end up being 5000 rows long), that is a lot of code
for the contributor to read just to make a small change.

>**NOTE:** There are still complex tests in SqlServerDsc today that are
>_very_ slow due to old bad practices. There are also examples of where
>these _very_ slow tests have been rewritten to be self-contained (which
>duplicates code) and become _extremely_ fast in comparison!

By having self-contained test the contributor now only needs to find a
`Context`-block similar to what their change needs, duplicate that and
modify the mocks and asserts accordingly. They do not need to worry about
code in parent blocks messes up their new test.

```powershell
Describe 'SqlProtocol\Set-TargetResource' -Tag 'Set' {
    Context 'When the system is not in the desired state' {
        Context 'When the desired protocol is TCP/IP' {
            Context 'When enabling and setting all the protocol properties' {
                BeforeAll {
                    InModuleScope -ScriptBlock {
                        $script:mockInstanceName = 'DSCTEST'
                    }

                    Mock -CommandName Restart-SqlService
                    Mock -CommandName Compare-TargetResourceState -MockWith {
                        return @(
                            @{
                                ParameterName  = 'Enabled'
                                Actual         = $false
                                Expected       = $true
                                InDesiredState = $false
                            }
                            @{
                                ParameterName  = 'ListenOnAllIpAddresses'
                                Actual         = $false
                                Expected       = $true
                                InDesiredState = $false
                            }
                            @{
                                ParameterName  = 'KeepAlive'
                                Actual         = 30000
                                Expected       = 50000
                                InDesiredState = $false
                            }
                        )
                    }

                    Mock -CommandName Get-ServerProtocolObject -MockWith {
                        return New-Object -TypeName PSObject |
                            Add-Member -MemberType NoteProperty -Name 'IsEnabled' -Value $false -PassThru |
                            Add-Member -MemberType ScriptProperty -Name 'ProtocolProperties' -Value {
                                return @{
                                    ListenOnAllIPs = New-Object -TypeName PSObject |
                                        Add-Member -MemberType NoteProperty -Name 'Value' -Value $false -PassThru -Force
                                        KeepAlive  = New-Object -TypeName PSObject |
                                            Add-Member -MemberType NoteProperty -Name 'Value' -Value 30000 -PassThru -Force
                                        }
                                    } -PassThru |
                                    Add-Member -MemberType ScriptMethod -Name 'Alter' -Value {
                                        # This is used to verify so that method Alter() is actually called or not.
                                        InModuleScope -ScriptBlock {
                                            $script:wasMethodAlterCalled = $true
                                        }
                                    } -PassThru -Force
                    }
                }

                It 'Should set the desired values and restart the SQL Server service' {
                    InModuleScope -ScriptBlock {
                        Set-StrictMode -Version 1.0

                        $script:wasMethodAlterCalled = $false

                        $setTargetResourceParameters = @{
                            InstanceName           = $mockInstanceName
                            ProtocolName           = 'TcpIp'
                            ListenOnAllIpAddresses = $true
                            KeepAlive              = 50000
                            Enabled                = $true
                        }

                        { Set-TargetResource @setTargetResourceParameters } | Should -Not -Throw

                        $script:wasMethodAlterCalled | Should -BeTrue
                    }

                    Should -Invoke -CommandName Restart-SqlService -Exactly -Times 1 -Scope It
                }
            }

            Context 'When enabling the protocol and leaving the rest of the properties set to their default value' {
                BeforeAll {
                    InModuleScope -ScriptBlock {
                        $script:mockInstanceName = 'DSCTEST'
                    }

                    Mock -CommandName Restart-SqlService
                    Mock -CommandName Compare-TargetResourceState -MockWith {
                        return @(
                            @{
                                ParameterName  = 'Enabled'
                                Actual         = $false
                                Expected       = $true
                                InDesiredState = $false
                            }
                        )
                    }

                    Mock -CommandName Get-ServerProtocolObject -MockWith {
                        return New-Object -TypeName PSObject |
                            Add-Member -MemberType NoteProperty -Name 'IsEnabled' -Value $false -PassThru |
                            Add-Member -MemberType ScriptProperty -Name 'ProtocolProperties' -Value {
                                return @{
                                    ListenOnAllIPs = New-Object -TypeName PSObject |
                                        Add-Member -MemberType NoteProperty -Name 'Value' -Value $false -PassThru -Force
                                        KeepAlive  = New-Object -TypeName PSObject |
                                            Add-Member -MemberType NoteProperty -Name 'Value' -Value 30000 -PassThru -Force
                                        }
                                    } -PassThru |
                                    Add-Member -MemberType ScriptMethod -Name 'Alter' -Value {
                                        # This is used to verify so that method Alter() is actually called or not.
                                        InModuleScope -ScriptBlock {
                                            $script:wasMethodAlterCalled = $true
                                        }
                                    } -PassThru -Force
                    }
                }

                It 'Should set the desired values and restart the SQL Server service' {
                    InModuleScope -ScriptBlock {
                        Set-StrictMode -Version 1.0

                        $script:wasMethodAlterCalled = $false

                        $setTargetResourceParameters = @{
                            InstanceName = $mockInstanceName
                            ProtocolName = 'TcpIp'
                            Enabled      = $true
                        }

                        { Set-TargetResource @setTargetResourceParameters } | Should -Not -Throw

                        $script:wasMethodAlterCalled | Should -BeTrue
                    }

                    Should -Invoke -CommandName Restart-SqlService -Exactly -Times 1 -Scope It
                }
            }
        }
    }
}
```

## Guideline for converting tests in a DSC Community repository

### Requirements

For the pattern explained here to work, the `Export-ModuleMember` must be
removed from the DSC resource code. This is an old pattern that is no
longer needed for MOF DSC resources. Removing the `Export-ModuleMember`
will enable Pester 5 to see all exposed helper functions when using
`InModuleScope`. It will expose the private helper functions that are
defined in the module, but also the helper functions that the resource
imports into the DSC resource's own module scope.

>**NOTE:** The exposed helper functions will not be available in the
>PowerShell session were Pester runs, only through Pesters command
>`InModuleScope`. It is not the same as the helper functions would be
>exported through the module manifest.

### Rules

Let us go over some rules that we should try to obey. These rules are to
help us follow the pattern set by Pester 5 and will also help us move
away from patterns used in earlier versions of Pester. These rules are
meant to optimize what in Pester terms is called _Discovery_ and _Run_.
It also helps the tests be more intuitive and easier to read.

There might be circumstances where there will be a need to break one rule
or more, but for most tests these should be followed. If a rule needs to
be broken then this should be clearly documented in the test code.

- Code that setup mocks (`Mock`) must only be inside an `It`-block,
  or inside a `BeforeAll`- or `BeforeEach`-block.
- Code that is calling the function being tested must only be inside an
  `It`-block.
- Code that asserts the result (`Should`) must only be inside an `It`-block,
  or inside a `AfterAll` or `AfterEach`-block.
- When testing a DSC resource module's functions `Get-TargetResource`,
  `Set-TargetResource`, `Test-TargetResource`, or other private functions
  the code inside the `It`-block must be wrapped inside an `InModuleScope`-block.
- When testing a DSC resource common module (module for general helper
  functions) then `InModuleScope` should only be used to test private
  functions, never when testing public functions.
- `foreach` or `ForEach-Object` must not be used. Instead use parameter `ForEach`
  on `Context`- and `It`-blocks.
- `try`-`catch`-`finally`-block must not be used outside of an `It`-block.
  The exception is in the script level `BeforeAll`- or `AfterAll`-block.
- Test fixture setup and teardown must always be done in a `BeforeAll`- and
  `AfterAll`-block at the script level. For example importing and removing
  the module being tested.
- The module being tested or helper modules that are imported in the script
  level `BeforeAll`-block must always be removed in the script level
  `AfterAll`-block. This is to prevent spill-over to other tests that
  are run.
- Tests that uses stub C# classes must load those in the script level
  `BeforeAll`-block so it is clear they are imported into the session
  and will spill-over to other tests. _If possible tests that loads stub_
  _C# classes should be run last (after other tests) to minimize spill-over_.
- Only mock cmdlets (functions) in the first level of the code being tested.

>**NOTE:** Spill-over to another test means that things that were made
>available for one test can spill-over to the next test and make it work
>(or not work) when run together, but not when run individually.

### Fixture setup and teardown

At the top of the test file there should a `BeforeAll`-block that sets up
everything needed to be able to run test. Also there should be a
`AfterAll`-block that tears down everything that was imported into the
session in the `BeforeAll`-block to prevent spill-over to next test that
is run.

#### MOF DSC Resource

The script level `BeforeAll`-block setups:

- the test environment and imports the DSC resource module into the session
- the local helper module _CommonTestHelper_ by importing it into the session
  (the module contains generic functions to help write tests)
- the default parameter `ModuleName` for the `InModuleScope`-blocks

>**NOTE:** The functions in the helper module _CommonTestHelper_ would be
>better suited to be moved into a generic module like _DscResource.Test_
>in the future.

```powershell
BeforeAll {
    # Define the DSC module and DSC resource being tested.
    $script:dscModuleName = 'SqlServerDsc'
    $script:dscResourceName = 'DSC_SqlProtocol'

    # Import the test pipeline code.
    try
    {
        Import-Module -Name DscResource.Test -Force -ErrorAction 'Stop'
    }
    catch [System.IO.FileNotFoundException]
    {
        throw 'DscResource.Test module dependency not found. Please run ".\build.ps1 -Tasks build" first.'
    }

    # Setup test environment and imports the DSC resource being tested.
    $script:testEnvironment = Initialize-TestEnvironment `
        -DSCModuleName $script:dscModuleName `
        -DSCResourceName $script:dscResourceName `
        -ResourceType 'Mof' `
        -TestType 'Unit'

    # Import the test helper module.
    Import-Module -Name (Join-Path -Path $PSScriptRoot -ChildPath '..\TestHelpers\CommonTestHelper.psm1')

    # Sets the default value for parameter ModuleName for the InModuleScope-blocks
    $PSDefaultParameterValues['InModuleScope:ModuleName'] = $script:dscResourceName
}
```

The script level `AfterAll`-block teardown:

- the default parameter `ModuleName` for the `InModuleScope`-blocks.
- the test environment
- the DSC resource module from the session
- the local helper module _CommonTestHelper_

```powershell
AfterAll {
    # Remove default parameter value.
    $PSDefaultParameterValues.Remove('InModuleScope:ModuleName')

    # Teardown test environment.
    Restore-TestEnvironment -TestEnvironment $script:testEnvironment

    # Unload the module being tested so that it doesn't impact any other tests.
    Get-Module -Name $script:dscResourceName -All | Remove-Module -Force

    # Remove module common test helper.
    Get-Module -Name 'CommonTestHelper' -All | Remove-Module -Force
}
```

#### DSC Resource Common Module

The script level `BeforeAll`-block setups:

- the common module by importing it into the session
- the local helper module _CommonTestHelper_ by importing it into the session
  (the module contains generic functions to help write tests)
- (optionally) loads the C# class stubs into the session.
- the default parameter `ModuleName` for the `InModuleScope`-blocks

```powershell
BeforeAll {
    # Define the DSC module and common module being tested.
    $script:dscModuleName = 'SqlServerDsc'
    $script:subModuleName = 'SqlServerDsc.Common'

    $script:parentModule = Get-Module -Name $script:dscModuleName -ListAvailable | Select-Object -First 1
    $script:subModulesFolder = Join-Path -Path $script:parentModule.ModuleBase -ChildPath 'Modules'
    $script:subModulePath = Join-Path -Path $script:subModulesFolder -ChildPath $script:subModuleName

    <#
        Import the common module into the session. The path $script:subModulePath
        points to the folder of the common module so that the module manifest is
        used when importing the module. This is so done to test that the functions
        are exported as expected.
    #>
    Import-Module -Name $script:subModulePath -Force -ErrorAction 'Stop'

    # Import the test helper module.
    Import-Module -Name (Join-Path -Path $PSScriptRoot -ChildPath '..\TestHelpers\CommonTestHelper.psm1')

    # Loading SMO (SQL Server Management Object) C# class stubs.
    if (-not ('Microsoft.SqlServer.Management.Smo.Server' -as [Type]))
    {
        Add-Type -Path (Join-Path -Path (Join-Path -Path $PSScriptRoot -ChildPath 'Stubs') -ChildPath 'SMO.cs')
    }

    # Sets the default value for parameter ModuleName for the InModuleScope-blocks
    $PSDefaultParameterValues['InModuleScope:ModuleName'] = $script:subModuleName
}
```

The script level `AfterAll`-block teardown:

- the default parameter `ModuleName` for the `InModuleScope`-blocks.
- the common module from the session
- the local helper module _CommonTestHelper_

>**NOTE:** In the above example the SMO (SQL Server Management Object) C#
>class stubs were loaded into the session. Since assemblies cannot be
>unloaded yet in this example this test file should be run last to avoid
>spill-over.

```powershell
AfterAll {
    $PSDefaultParameterValues.Remove('InModuleScope:ModuleName')

    # Unload the module being tested so that it doesn't impact any other tests.
    Get-Module -Name $script:subModuleName -All | Remove-Module -Force

    # Remove module common test helper.
    Get-Module -Name 'CommonTestHelper' -All | Remove-Module -Force
}
```

### Using stub PowerShell module

To be able to run unit tests on a development machine that does not have
a certain component installed it is good to use stub PowerShell module.
For example the DSC resource module _SqlServerDsc_ is using a stub module
to mimic the PowerShell module _SqlServer_ and _SQLPS_ when running unit
tests.

A stub PowerShell module is a module that has stubs of the actual cmdlets
to mimic the name of the cmdlets and their parameters.
This is an example of a stub function in the stub module `SqlServerStub`.

```powershell
function Convert-UrnToPath {
    [CmdletBinding()]
    param
    (
        [Parameter(Mandatory=$true, Position=1, ValueFromPipeline=$true, ValueFromPipelineByPropertyName=$true)]
        [ValidateNotNullOrEmpty()]
        [System.String]
        ${Urn}
   )

    throw '{0}: StubNotImplemented' -f $MyInvocation.MyCommand
}
```

>**NOTE:** A more advanced version of stub modules that use classes
>for the types and how to create it can be found in the DSC resource module
>[_ActiveDirectoryDsc_ Stubs folder](https://github.com/dsccommunity/ActiveDirectoryDsc/tree/master/tests/Unit/Stubs).

#### How to use stub module in tests

Preferably, the stub module should only be imported when it is needed and
then be directly removed to minimize spill-over to other tests. The stub
module should be imported in an `BeforeAll`-block and removed in an
`AfterAll`-block.

```powershell
Context 'When Invoke-SqlScript is invoked with credentials' {
    BeforeAll {
        # Import PowerShell module SqlServer stub cmdlets.
        Import-Module -Name '.\Stubs\SqlServerStubs.psm1'

        Mock -CommandName Invoke-Sqlcmd
    }

    AfterAll {
        # Remove PowerShell module SqlServer stub cmdlets.
        Get-Module -Name 'SqlServerStubs' -All | Remove-Module -Force
    }

    It 'Should call Invoke-SqlScript without throwing' {
        { Invoke-SqlScript @invokeScriptFileParameters } | Should -Not -Throw

        Should -Invoke -CommandName Invoke-Sqlcmd -Times 1 -Exactly -Scope It
    }
}
```

### Mocking

Mocking must only be inside an `It`-block, or inside a `BeforeAll`- or
`BeforeEach`-block. Preferably the mock is made in a `BeforeAll`- or
`BeforeEach`-block to separate those from calling the function and the
asserts.

The `Mock` should not be wrapped inside an `InModuleScope`-block.

When mocking try to make the mock in a `BeforeAll`- or `BeforeEach`-block
that is as close to the `It`-block as possible. The test should preferably
be wrapped in a `Context`-block to separate the test and make it
self-contained. Only mock what is necessary for the individual test to
work.

It is a good rule to try to simplify tests by mocking just the calls to
the other functions within the function under test. Let say the function
under test is `Test-TargetResource`. Assume the function `Test-TargetResource`
calls `Get-TargetResource` which in turn call the cmdlet `Get-Something`,
then the mock should be for `Get-TargetResource`, not `Get-Something`.

```plaintext
Test-TargetResource -> Get-TargetResource -> Get-Something
      ↑                         ↑
      |--- If testing this      |--- Mock this
```

>Mocking too deeply slowed down Pester 4. I'm not sure if it is a problem in
>Pester 5, but it is a good rule to simplify tests.

It is possible to mock cmdlets from the common modules without scoping them
to the module's scope since they are imported by the module that is being
tested. This only works if there are no `Export-ModuleMember` in the DSC
resource code that limits what is seen by Pester.

```powershell
Context 'When ... a code path does something...' {
    BeforeAll {
        Mock -CommandName Get-Something
        Mock -CommandName Test-Something -MockWith {
            return @(
                'Value1'
            )
        }
    }

    It 'Should ...do this...' {
        InModuleScope -ScriptBlock {
            # Call the function test and assert.
        }
    }
}
```

It is possible to use the parameter `Verifiable` on mocks, but special
consideration must be made when asserting verifiable mocks. More on that
in the section [Asserting](#asserting).

### Calling function to be tested

When testing the DSC resources functions `Get-TargetResource`, `Test-TargetResource`,
`Set-TargetResource`, and other private functions in a DSC resource or
a common module, the `InModuleScope` must be used. When testing public
functions in a common module the `InModuleScope` must be omitted to
correctly test that the public functions are exported.

The `InModuleScope` is used for `Get-TargetResource`, `Test-TargetResource`,
and `Set-TargetResource` to explicitly define what functions are tested
if several DSC resources have been (wrongly) imported into the session.
All those DSC resources will have the same exported function names (`Get-TargetResource`,
`Test-TargetResource`, and `Set-TargetResource`).

Below we also use `Set-StrictMode -Version 1.0`. This can optionally be
used to test that functions align with a certain strict mode, when that
is not something that should be enforced during runtime in a user environment.
This enables strict mode in the module's scope when the specific `It`-block
runs.

Since we are in the DSC resource module's scope it is also possible to
use the helper functions in the test. For example below the cmdlet
`Get-ComputerName` is used from _DscResource.Common_ to return the current
computer name instead of using `$env:COMPUTERNAME` which is not available
cross-plattform.

```powershell
Context 'When the system is not in the desired state' {
    Context 'When something does not exist' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                # ServerName is not set, the default value is used within the resource.
                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                }

                $getTargetResourceResult = Get-TargetResource @getTargetResourceParameters

                $getTargetResourceResult.InstanceName | Should -Be 'TEST'
                $getTargetResourceResult.SuppressRestart | Should -BeFalse
                $getTargetResourceResult.RestartTimeout | Should -Be 120

                # Use the helper function from inside the module (DscResource.Common).
                $getTargetResourceResult.ServerName | Should -Be (Get-ComputerName)
            }
        }
    }
}
```

### Using variables

#### Setting variables in the module's scope

When using reusable variables in the module scope they must be declared
using the `$script`-scope, they must also be prefixed or suffixed
with something unique so the declaration does not override a real variable
inside any of the module's functions. In this case the variable is prefixed
with 'mock', e.g. `$script:mockInstanceName`.

Below the variable `$mockInstanceName` is passed in the `BeforeAll`-block
using `InModuleScope` and declared using `$script`-scope. This makes it
available when the hashtable `$getTargetResourceParameters` is declared.
It also used to assert that the `Get-TargetResource` returns the correct
value. Note that there is no need to use `$script`-scope when using the
value of the variable.

```powershell
Context 'When the system is not in the desired state' {
    Context 'When something does not exist' {
        BeforeAll {
            InModuleScope -ScriptBlock {
                $script:mockInstanceName = 'DSCTEST'
            }
        }

        It 'Should return the same value as passed for InstanceName' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = $mockInstanceName
                }

                $getTargetResourceResult = Get-TargetResource @getTargetResourceParameters

                $getTargetResourceResult.InstanceName | Should -Be $mockInstanceName
            }
        }
    }
}
```

#### Passing variables into the module's scope

If the test has variables that need to be used both for the mocks and
in the test when calling the function being tested or asserting a value,
it is possible to pass parameters into the `InModuleScope`-block.

Below the variable `$mockPipeName` in the test's scope is passed into the
module's scope using the parameter `Parameters` of the `InModuleScope`.
The value of parameter `Parameters` must be a hashtable, and each key
in the hashtable must have a corresponding parameter inside the
`InModuleScope`. Note that the parameter is using upper-case 'M' on the
word 'Mock' (`$MockPipeName`) to match the hashtable.

>Currently it is not possible to used advanced parameters (`[Parameter()]`)
>in the `param`-block. To simplify these parameters it is (for now) easiest
>to write them as a simple parameter with no type.
>The need to specify a `param`-block inside the `InModuleScope` will
>hopefully be removed in a future version of Pester.

```powershell
Context 'When the desired protocol is Named Pipes' {
    BeforeAll {
        $mockPipeName = '\\.\pipe\$$\TESTCLU01A\MSSQL$SQL2014\sql\query'

        Mock -CommandName Get-PipeName -MockWith {
            return $mockPipeName
        }
    }

    It 'Should return the correct values' {
        $inModuleScopeParameters = @{
            MockPipeName = $mockPipeName
        }

        InModuleScope -Parameters $inModuleScopeParameters -ScriptBlock {
            # The need for this will hopefully be removed in a future version of Pester.
            param
            (
                $MockPipeName
            )

            Set-StrictMode -Version 1.0

            $getTargetResourceResult = Get-TargetResource -ProtocolName 'NamedPipes'

            $getTargetResourceResult.PipeName | Should -Be $MockPipeName
        }
    }
}
```

### Asserting

#### Assert result from called function

The result from the called function should be asserted (using `Should`)
inside an `InModuleScope`-block which is inside either an `It`-block or
a `AfterAll`- or `AfterEach`-block. The assert needs to be written differently
depending on where the assert happens. The exception is when testing public
functions in a common module, then `InModuleScope` should not be used.

When testing a public function in a common module, then `InModuleScope`
should not be used.

##### Assert result in the `It`-block

The most straight forward way is to assert (using `Should`) directly inside an
`InModuleScope`-block inside the `It`-block.

```powershell
Context 'When the system is in the desired state' {
    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'TcpIp'
                }

                $getTargetResourceResult = Get-TargetResource @getTargetResourceParameters

                $getTargetResourceResult.InstanceName | Should -Be 'TEST'
            }
        }
    }
}
```

##### Assert result in the `AfterEach`-block

Contrary to an `AfterAll`-block, asserting (using `Should`) in an
`AfterEach`-block is more widely used. It can be used for example when
there are several `It`-blocks that should assert the same property. Still,
keep in mind to try to make the test self-contained and avoid doing such
assert to far away from the actual test.

To be able to assert in the `AfterEach`-block the variable that holds the
result must be declared in the script scope using `$script:`, e.g.
`$script:getTargetResourceResult`. Then it possible to assert the value
in the variable in an `AfterEach`-block. There is no need to reference
the variable using the `script:` scope. But to make the test more readable
it is worth to explicitly say that it is the value of the variable in the
script scope we are asserting.

```powershell
Context 'When the system is in the desired state' {
    AfterEach {
        InModuleScope -ScriptBlock {
            $script:getTargetResourceResult.InstanceName | Should -Be 'TEST'
        }
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'TcpIp'
                }

                $script:getTargetResourceResult = Get-TargetResource @getTargetResourceParameters

                $script:getTargetResourceResult.ProtocolName | Should -Be 'TcpIp'
            }
        }
    }

    Context 'When the desired protocol is Named Pipes' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'NamedPipes'
                }

                $script:getTargetResourceResult = Get-TargetResource @getTargetResourceParameters

                $script:getTargetResourceResult.ProtocolName | Should -Be 'NamedPipes'
            }
        }
    }
}
```

##### Assert result in the `AfterAll`-block

It is really an edge case to assert the result (using `Should`) in an
`AfterAll`-block. If it has ever been used, it is used extremely rarely.
More likely is that it is used to assert called mocks. More on that in
another section.

There could be a reason to assert in an `AfterAll`-block, for example if
there a several `It`-blocks inside the same `Context`-block that return
different results and they should for some reason be asserted at the same
time. But as mentioned before, this is really an edge case.

To be able to assert in the `AfterAll`-block the variable that holds the
result must be declared in the script scope using `$script:`, e.g.
`$script:getTargetResourceResult`. Then it is possible to assert the value
in the variable in an `AfterAll`-block. There is no need to reference
the variable using the `script:` scope. But to make the test more readable
it is worth explicitly declaring the value of the variable in the
script scope we are asserting.

```powershell
Context 'When the system is in the desired state' {
    BeforeAll {
        Mock -CommandName Get-ServerProtocolObject
    }

    AfterAll {
        InModuleScope -ScriptBlock {
            $script:getTargetResourceResult1.InstanceName | Should -Be 'TEST1'
            $script:getTargetResourceResult2.InstanceName | Should -Be 'TEST2'
        }
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST1'
                    ProtocolName = 'TcpIp'
                }

                $script:getTargetResourceResult1 = Get-TargetResource @getTargetResourceParameters

                $script:getTargetResourceResult1.ProtocolName | Should -Be 'TcpIp'
            }
        }
    }

    Context 'When the desired protocol is Named Pipes' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST2'
                    ProtocolName = 'NamedPipes'
                }

                $script:getTargetResourceResult2 = Get-TargetResource @getTargetResourceParameters

                $script:getTargetResourceResult2.ProtocolName | Should -Be 'NamedPipes'
            }
        }
    }
}
```

#### Assert called mocks

##### Assert called mocks in the `It`-block

When asserting if a mock was called in an `It`-block the
`Should -Invoke` must use the value `It` for the parameter `Scope`.

The `Should -Invoke` should not be wrapped inside an `InModuleScope`-block,
but be called after the `InModuleScope`-block.

```powershell
Context 'When the system is in the desired state' {
    BeforeAll {
        Mock -CommandName Get-ServerProtocolObject
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'TcpIp'
                }

                { Get-TargetResource @getTargetResourceParameters } | Should -Not -Throw
            }

            Should -Invoke -CommandName Get-ServerProtocolObject -Exactly -Times 1 -Scope It
        }
    }
}
```

##### Assert called mocks in the `AfterEach`-block

When asserting if a mock was called in an `AfterEach`-block the
`Should -Invoke` must use the value `It` for the parameter `Scope`.

The `Should -Invoke` should not be wrapped inside an `InModuleScope`-block.

```powershell
Context 'When the system is in the desired state' {
    BeforeAll {
        Mock -CommandName Get-ServerProtocolObject
    }

    AfterEach {
        Should -Invoke -CommandName Get-ServerProtocolObject -Exactly -Times 1 -Scope It
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'TcpIp'
                }

                { Get-TargetResource @getTargetResourceParameters } | Should -Not -Throw
            }
        }
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'NamedPipes'
                }

                { Get-TargetResource @getTargetResourceParameters } | Should -Not -Throw
            }
        }
    }
}
```

##### Assert called mocks in the `AfterAll`-block

Asserting called mocks in an `AfterAll`-block should be used sparingly
since the scope the assert happens in can lead to a mock being hit
countless times. Consider using `AfterEach`-block instead.

We should use the parameter `Exactly` together with the
parameter `Times` of the `Should -Invoke`. But even so when having the
parameter `Times` set to `8` doesn't really say if it was the correct
amount of calls or not. We want to be precise to what the actual number
of calls should be. Let's assume we have 3 `It`-blocks and the number of
calls is set to `8`, then there is no way to tell if that is the correct
number of calls throughout all the `It`-blocks. Was it 8 calls from one
`It`-block or was it 2 calls from two `It`-blocks, and is one
`It`-block doing 3 calls. Why is that if the other ones don't, is that
correct? Any value other than `1` could be misleading to what the actual
number of expected number of hits should be. Use this wisely, and make use
of the parameter `ParameterFilter` where possible to split up the asserts.
If that is not possible consider adding an unique helper function for each
call that could be better asserted or as mentioned before, consider using
`AfterEach`-block instead.

When asserting if a mock was called in an `AfterAll`-block the
`Should -Invoke` must use the value `Context` for the parameter `Scope`.

The `Should -Invoke` should not be wrapped inside an `InModuleScope`-block.

>**NOTE:** It is possible to use the `AfterAll`-block at the `Describe`-level
>but that should be avoided since the mocks also must be at the `Describe`-level.
>When asserting if a mock was called in an `AfterAll`-block use it inside
>a `Context`-block.

```powershell
Context 'When the system is in the desired state' {
    BeforeAll {
        Mock -CommandName Get-ServerProtocolObject
    }

    AfterAll {
        Should -Invoke -CommandName Get-ServerProtocolObject -Exactly -Times 2 -Scope Context
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'TcpIp'
                }

                { Get-TargetResource @getTargetResourceParameters } | Should -Not -Throw
            }
        }
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'NamedPipes'
                }

                { Get-TargetResource @getTargetResourceParameters } | Should -Not -Throw
            }
        }
    }
}
```

#### Asserting verifiable mocks

A verifiable mock can be used to assert that the mock must be hit at least
once. For a mock to be verifiable the `Mock` must use the parameter `Verifiable`.

When asserting if a verifiable mock was called it is important where to
assert the verifiable mocks. The call to `Should -InvokeVerifiable` must
be at the same level as the mocks being verified. It is not possible to
add `Should -InvokeVerifiable` at the end of the `Describe`-block which
is shown below.

>**NOTE:** With the current implementation of `Should -InvokeVerifiable`
>it sees verifiable mocks in parent `Context`-blocks as well, so take care
>how mocks are used and where you put `Should -InvokeVerifiable`.

In this example there are two `Should -InvokeVerifiable`. One at the
`Context`-level and the other at the `Describe`-level.

```powershell
Describe 'VerifiableMocks' {
    Context 'When some code path is executed' {
        BeforeAll {
            Mock -CommandName Get-Process -Verifiable
        }

        It 'Should call all verifiable mocks' {
            Should -InvokeVerifiable
        }
    }

    It 'Should call all verifiable mocks' {
        Should -InvokeVerifiable
    }
}
```

In the result below we can see that the `Should -InvokeVerifiable` at the
`Context`-level is returning that the mock was not called, but the other
at the `Describe`-level passes even though the mock was never called which
gives a false positive.

```plaintext
Describing VerifiableMocks
 Context When some code path is executed
   [-] Should call all verifiable mocks 5ms (2ms|2ms)
     Expected Get-Process to be called with
    at Should -InvokeVerifiable, C:\Users\johan.ljunggren\Desktop\VerifiableMocks.ps1:8
    at <ScriptBlock>, C:\Users\johan.ljunggren\Desktop\VerifiableMocks.ps1:8
  [+] Should call all verifiable mocks 2ms (1ms|1ms)
Tests completed in 263ms
Tests Passed: 1, Failed: 1, Skipped: 0 NotRun: 0
```

##### Verifiable mock in `BeforeAll`-block

The `Should -InvokeVerifiable` must be inside an `It`-block, but should
not be wrapped inside an `InModuleScope`-block.

```powershell
Context 'When the system is in the desired state' {
    BeforeAll {
        Mock -CommandName Get-ServerProtocolObject -Verifiable
    }

    Context 'When the desired protocol is TCP/IP' {
        It 'Should return the correct values' {
            InModuleScope -ScriptBlock {
                Set-StrictMode -Version 1.0

                $getTargetResourceParameters = @{
                    InstanceName = 'TEST'
                    ProtocolName = 'TcpIp'
                }

                { Get-TargetResource @getTargetResourceParameters } | Should -Not -Throw
            }
        }
    }

    It 'Should call all verifiable mocks' {
        Should -InvokeVerifiable
    }
}
```

##### Verifiable mock in `BeforeEach`-block or `It`-block

If the mock is setup in a `BeforeEach`-block or an `It`-block then the
`Should -InvokeVerifiable` must be inside the `It`-block that is calling
the function being tested.

```powershell
Describe 'VerifiableMocks' {
    Context 'When some code path is executed' {
        BeforeEach {
            Mock -CommandName Get-Process -Verifiable
        }

        It 'Should call all verifiable mocks' {
            { Get-Process } | Should -Not -Throw

            Should -InvokeVerifiable
        }
    }
}
```

#### Assert thrown exception messages

To assert an exception message it is important to actually assert the correct
(expected) exception message. It is not enough to just assert that an exception
occurred, because the exception that was thrown can be due to any other
reason than what we expected. To assert the correct error message we should
use the localized message string from the function being tested. This will
also make the test pass when the resource is run in other languages.

To help achieve this there are two helper functions `Get-InvalidOperationRecord`
and `Get-InvalidResultRecord`. There is also an alias `Get-ObjectNotFoundRecord`
which is an alias for the function `Get-InvalidResultRecord`. These together
will help create error records for the three most used exceptions.

- ObjectNotFound
- InvalidOperation
- InvalidResult

>**NOTE:** New test helper functions might be added to the module
>_DscResource.Test_, or be available in the individual DSC resource modules.
>Most test helper functions will be available in the module _DscResource.Test_
>(but it is a work in progress).

In addition to the helper functions, to get the expected exception message
that the code is throwing the variable `$script:localizedData` in the
module's scope should be used.

>**NOTE:** Normally it is enough to just assert that the localized string
>exception message was thrown, but if there is a need to assert the inner
>exceptions then different logic need to be added in-place of using the
>test helper functions.

##### Assert thrown exception messages for private functions

For the functions `Get-TargetResource`, `Test-TargetResource`,
`Set-TargetResource`, and other private functions the assertion of thrown
exceptions should be done in the module's scope. In the module's scope we
have the variable `$script:localizedData` available.

This shows how to assert the correct (expected) exception message by using
the test helper function `Get-InvalidOperationRecord`. The helper function
`Get-InvalidOperationRecord` returns an error record similar to the one that
is thrown by, in this example, the function `Set-TargetResource`. Then we
assert that the expected message is what is thrown. The wildcard character
`*` is added due to that Pester 5 does a `-like` comparison on the text
string as opposed to Pester 4 that did a `-contains`. The reason we need
to add the wildcard character is because the inner exceptions (stack trace)
are not the same between the helper functions and the error record that is
thrown.

```powershell
It 'Should throw the correct error' {
    InModuleScope -ScriptBlock {
        Set-StrictMode -Version 1.0

        $mockErrorRecord = Get-InvalidOperationRecord -Message (
            $script:localizedData.FailedToGetSqlServerProtocol -f 'Variable1', 'Variable2'
        )

        $setTargetResourceParameters = @{
            InstanceName = 'TEST'
        }

        { Set-TargetResource @setTargetResourceParameters } |
            Should -Throw -ExpectedMessage ($mockErrorRecord.Exception.Message + '*')
    }
}
```

##### Assert thrown exception messages for public functions

For the public functions we should use `$script:localizedData` to get the
expected localized exception message. In the module's scope we have the
variable `$script:localizedData` available.

This shows how to assert the correct (expected) exception message by using
the test helper function `Get-InvalidOperationRecord`. First we need to
reach into the module's scope to return the localized string and assign
it to a local variable in the test's scope. Then we use that local variable
to build the error record similar to what is thrown by using the helper
function `Get-InvalidOperationRecord`. Lastly we assert that the expected
message is what is thrown. The wildcard character `*` is added due to that
Pester 5 does a `-like` comparison on the text string as opposed to
Pester 4 that did a `-contains`. The reason we need to add the wildcard
character is because the inner exceptions (stack trace) are not the same
between the helper functions and the error record that is thrown.

```powershell
It 'Should throw the correct error message' {
    $mockGetServerProtocolObjectParameters = @{
        Instance     = 'TEST'
    }

    $mockLocalizedString = InModuleScope -ScriptBlock {
        $script:localizedData.FailedToObtainServerInstance
    }

    $mockErrorRecord = Get-InvalidOperationRecord -Message (
        $mockLocalizedString -f $mockGetServerProtocolObjectParameters.Instance
    )

    { Get-ServerProtocolObject @mockGetServerProtocolObjectParameters } |
        Should -Throw -ExpectedMessage ($mockErrorRecord.Exception.Message + '*')
}
```

#### Using `Because` in assert

When using the parameter `Because` in the assert it should give more information
than what the `It`-block description already gives, it should add more
value. Also, when using parameter `Because` the text should be phrased so
it reads correctly in the Pester output.

For example if the `It`-block description would be the following
"_Should not throw and return the correct values for the properties_" then
the following would not really add more value.

```powershell
It 'Should not throw and return the correct values for the properties' {
    $result | Should -Be 'MyAlertName2' -Because 'the correct alert name must be returned'
}
```

In this case, the parameter `Because` should be used to add more information
to why the value must be correct. An example would be:

```powershell
It 'Should not throw and return the correct values for the properties' {
    $result | Should -Be 'MyAlertName2' -Because 'the correct alert name must be returned when the alert does not exist so user knows what alert failed'
}
```

It would result in the following output from Pester:

```plaintext
[-] Should not throw and return the correct values for the properties 9ms (7ms|2ms)
 Expected strings to be the same, because the correct alert name must be returned when the alert does not exist so user knows what alert failed, but they were different.
 Expected length: 12
 Actual length:   11
 Strings differ at index 11.
 Expected: 'MyAlertName2'
 But was:  'MyAlertName'
```

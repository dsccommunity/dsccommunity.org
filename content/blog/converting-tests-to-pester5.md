---
title: "Converting tests to Pester 5"
date: 2020-05-17T05:00:00+01:00
type: "post"
draft: false
author: johlju
---

If you have any questions or suggestions around this blog post then please
reach out to `@johlju` in the Virtual PowerShell User Group [#DSC channel](https://dsccommunity.org/community/contact/).

## Pester

[Pester](https://github.com/pester), the famous DSL and module in the
PowerShell community, is used throughout the DSC modules and their common
modules to ensure we maintain quality for all new contributions by testing
any addition and verify they work with the rest of the code to avoid
regression.

A new major version of Pester is about to be released, bringing improvements
in some areas along with breaking changes compared to the previous v4
versions. In this post I will explain what may be needed to convert your
existing tests from v4 to v5. See the release note under [Pester Releases](https://github.com/pester/Pester/releases)
where for example the RC6 release notes contain documentation needed
for converting.

Pester is primarily maintained and developed by [Jakub Jareš](https://github.com/nohwnd).
Pester 5 was made possible thanks to Jakub's hard work during many weekends,
outside of his day job. If you have the means then consider [sponsoring Jakub](https://github.com/sponsors/nohwnd)
or [sponsoring Pester](https://opencollective.com/pester) to show your
appreciation for Jakub's dedication to the community and improving this
OSS tool.

## Tests

I thought I'd start with the module _SqlServerDsc.Common_ that contains
helper functions for the DSC resources in the SqlServerDsc module. I knew
it used a lot of different techniques and also had older tests from before
Pester 4. But after I started looking at the tests I realized that they
have been refactor over the years to use modern Pester techniques such as
having most setup and teardown done in `Before*`- and `After*`-blocks. So
for these tests I needed to refactor just a few tests to use the `Before`-
and `After`-block way.

Even though the tests is doing setup and teardown in `Before*`- and
`After*`-blocks, don't expect the tests to just run under Pester 5.
It took me still over 8 hours to convert 175 test for 3000 lines of code.
If the tests had not used the `Before*`- and `After*`-blocks as much as
they did the conversion would have taken considerably longer.

## Converting

It took, and will take some time, to learn new practices around how Pester
does _**Discovery**_ and _**Run**_ which is new to Pester 5, especially around
`InModuleScope`-block.

Pester 5 is mostly backward compatible with the syntax used in Pester v4,
but it is recommended to use the new cmdlets name as backward compatibility
is achieved with aliases in v5.

What took most time was to understand the error messages that was
outputted when running test that was not "Pester 5 compatible". When the
tests was wrongly written for Pester 5 it took some time to understand if
the error was from Pester, bug in tests, or bug in the code being tested.
99.9% of the time it was just the tests that needed to be slightly modified
to accommodate Pester's new way of working.

> Converting to Pester 5 did help found a bug in the tests that we had
> missed with Pester 4. There was a need for mocking a line in the code
> that messed up the PowerShell session. That needed a change in the code
> being testing.

After writing Pester tests in Pester 3 and 4 I was used to some error
messages returned by Pester when messing up tests, the same will happen
for Pester 5, eventually.

I also had tremendous help from the community in the Virtual PowerShell
User Group [#testing channel](http://poshcode.org/) when doing this conversion.
It is the same place where the [#DSC channel](https://dsccommunity.org/community/contact/)
is located.

From the conversion there was changes to the unit tests that still worked
in Pester 4. Those changes was merged into master, and the changes can be
seen here:
https://github.com/dsccommunity/SqlServerDsc/pull/1548/files#diff-05195506e4856646b3925b7788341a92

And here is the PR so you can see the actually difference for the tests
for them to run in Pester 5 (linking to reviewable since it has a better
diff engine than GitHub):
https://reviewable.io/reviews/dsccommunity/sqlserverdsc/1550

Here you can find the resulting tests that passing in Pester 5:
https://github.com/dsccommunity/SqlServerDsc/blob/9aff05501051e77e64b9a0081d2d16dabd562052/tests/Unit/SqlServerDsc.Common.Tests.ps1

### Things found during conversion

Please note that some of these might not actually be an issue or should
be solved in some other way.

- Code inside a `Describe`- or `Context`-block should be inside a `It`-,
  `Before*`-, or `After*`-block. The exception to this is variables that
  contain test cases, those variables should be placed inside the
  `Describe`-block and before the `It`-block, but outside of the
  `Before*`-blocks.
  they must be outside Before*-blocks and It-blocks, but inside Describe-
  or Context-blocks.
- `Should -Throw 'error message'` has a breaking change. It no longer
  uses `-contains` but instead `-like` which breaks some tests that depend
  on this when comparing error message strings. It possible to add wildcard
  to the error string to workaround this, e.g. `'error message*'`.
  - When using for example `New-InvalidOperationException` the expected
    message no longer compares correctly since the error message contain
    `'System.InvalidOperationException: error message'`. It can be solved
    by using wildcard as previously mentioned, but it can also be solved
    by adding the test helper function [`Get-InvalidOperationRecord`](https://github.com/dsccommunity/SqlServerDsc/blob/7f14116514f2cfbe103d85d509ba0f74780fbe80/tests/TestHelpers/CommonTestHelper.psm1#L421-L468).
    Using this helper function will return the the same error message
    and no wildcard is needed.
- `Assert-MockCalled` is alias to `Should -Invoke` and uses the same
  parameters (backward compatible) so there is no need to replace
  `Assert-MockCalled` initially. But a suggestion is replace this as it
  is easy with a search and replace.
- If using `InModuleScope`-block outside of an It-block then the module
  _must_ be loaded into the session outside the top `BeforeAll`-block.
  Read more about this in issue [pester/Pester#1543](https://github.com/pester/Pester/issues/1543).
  We use `InModuleScope`-block to reach the variable in the
  module scope that contain the localized strings (`$script:localizedData`).
- `Should -Throw` should preferably be updated to `Should -Throw -ExpectedMessage`
  to use named parameters. But is is not a requirement for running the tests.
- `Should -Throw $null` will pass even if the code being tested actually
  threw an exception. So if we get the expected error message from a localized
  string and that for some reason resultet in a $null value instead of the
  correct string the test will pass even if the code being test throw the
  wrong error message. To handle this the expected error message variable
  should be assert to contain a value.
  ```powershell
    $errorMessage = $script:localizedString.LocalizedErrorMessage
    $errorMessage | Should -Not -BeNullOrEmpty
    { Set-Something } | Should -Throw $errorMessage
  ```
- `BeforeEach` behaves differently (better) than Pester 4. In Pester 4
  if a mock was declared in a previous `BeforeAll`- or `BeforeEach`-block
  the `BeforeEach` block override the previous mock. That is not happening
  in Pester 5 meaning that the wrong mock could be called.
  It is more important to make `Context`-blocks self-sustaining and avoid
  inheriting test setup and or teardown.
- Mocks that uses a `param`-block inside a `-MockWith` should be removed.
  Se more information in issue [pester/Pester#1554](https://github.com/pester/Pester/issues/1554).
- The `foreach`-blocks that was used did not work since it didn't see the
  variable from the `foreach()` inside the `It`-block because the
  `foreach`-block was outside the `Before*`- and `It`-block.
  The `foreach`-blocks was removed and replaced with test cases.
- If the tests haven't moved from the Pester 3 syntax, e.g. `Should Be`
  and `Should Throw` (without dash), the tests are failing with the error
  message:
  ```plaintext
  ParameterBindingException: Parameter set cannot be resolved using the specified named parameters.
  One or more parameters issued cannot be used together or an insufficient number of parameters were provided.
  ```
- If using test cases and have defined a parameter block and decorated the
  parameters with `[Parameter()]` the test will fail. Remove the decoration
  `[Parameter()]` and the tests work with both Pester 4 and 5. In Pester 5
  it is possible to remove the entire param-block, which is preferably but
  then there is not backward compatibility with Pester 4.
  ```powershell
  It 'Should...if value is <ParameterValue>' -TestCase @( ... ) {
        param
        (
            [System.String]
            $ParameterValue
        )

        Get-Something | Should -Be $ParameterValue
  }
  ```
- In Pester 5 it is possible to use `Should -Invoke` (or alias `Assert-MockCalled`)
  without having declared a mock for the command. Then `Should -Invoke` is
  just ignored without any error that there was no mock declared as Pester 4
  did.
- There is a bug when using `$PSBoundParameters` in a `-ParameterFiler`
  for a `Should -Invoke`. This is being tracked in issue [pester/Pester#1542](https://github.com/pester/Pester/issues/1542)
  and won't be fixed before 5.0.0 GA.
- If `Mock`'s are outside the `Before*`- or `It`-blocks then things are
  _not mocked_ so make sure prior running the tests that all code is
  correctly placed! There is no check that you incorrectly placed a `Mock`
  where it serves no purpose.

### Pester 5 Test scaffolding

A Pester 5 test should basically look like this. All test code must be
be inside `Before*`-, `After*`-, and `It`-blocks. There are an exception
to the rule when it comes to test cases.

_**Note**: This is just an example from me which may change in the future_
_when new practices are learned and old habits are improved or replaced._

```powershell
<#
    Import module if using InModuleScope. There are other possible solution for
    this, see issue https://github.com/pester/Pester/issues/1543.
#>
Import-Module -Name '.\output\SqlServerDsc\14.0.0\Modules\SqlServerDsc.Common'

BeforeAll {
    # More initialization code like loading stub cmdlets or stub classes
}

Describe 'SqlServerDsc.Common\Set-Something' {
    Context 'When...' {
        BeforeAll {
            # Test setup. Mock and mock variables as needed.
        }

        BeforeEach {
            # Test setup per It-block. Mock and mock variable setup.
        }

        AfterAll {
            # Test teardown.
        }

        AfterEach {
            # Test teardown per It-block.
        }

        It 'Should...' {
            { Set-Something } | Should -Not -Throw

            Should -Invoke -CommandName Get-Something -Exactly -Times 1 -Scope It
        }
    }

    Context 'When...' {
        # Test cases can be added directly to the It-block.
        It 'Should...' -TestCases @(
            {
                MockVersion = '11'
            }
            {
                MockVersion = '12'
            }
        ) {
            { Set-Something -Version $MockVersion } | Should -Not -Throw

            Should -Invoke -CommandName Get-Something -Exactly -Times 1 -Scope It
        }

        <#
            If test cases are defined in a variable then the variable
            is not allowed to be inside a Before*-block because then
            it is not executed during Discovery when the test cases are
            evaluated. Correct placement of these variables are inside
            the Describe-block and before the It-block, but outside of
            the Before*-blocks.
        #>
        $testCases = @(
            {
                MockVersion = '11'
            }
            {
                MockVersion = '12'
            }
        )

        # Test cases can be added directly like this to the It-block-
        It 'Should...' -TestCases $testCases {
            { Set-Something -Version $MockVersion } | Should -Not -Throw

            Should -Invoke -CommandName Get-Something -Exactly -Times 1 -Scope It
        }

    }

    <#
        Write tests so you only need to have InModuleScope around as little
        code as possible, preferably only inside the It-block. But if the
        It-block needs variables in the test setup then that is not possible
        since those will not be able in the module scope.
        See issue https://github.com/pester/Pester/issues/1543.
    #>
    InModuleScope $script:subModuleName {
        Context 'When...' {
            BeforeAll {
                # Test setup. Mock and mock variables as needed.
            }

            BeforeEach {
                # Test setup per It-block. Mock and mock variable setup.
            }

            AfterAll {
                # Test teardown.
            }

            AfterEach {
                # Test teardown per It-block.
            }

            It 'Should throw the correct error message' {
                # The variable $localizedData is coming from the module being tested.
                $mockErrorMessage = $localizedData.LocalizedErrorMessage

                # Assert that the localized string was fetched.
                $mockErrorMessage.Exception.Message | Should -Not -BeNullOrEmpty

                # Assert that the correct error message was thrown.
                {
                    Set-Something
                } | Should -Throw -ExpectedMessage $mockErrorMessage
            }
        }
    }
}
```

#Requires -Module @{ ModuleName = 'PowerShellGet'; ModuleVersion = '2.1.3' }

function Get-DscResourceKitInfo
{
    [CmdletBinding()]
    param
    (
        [Parameter(
            ValueFromPipeline,
            ValueFromPipelineByPropertyName
        )]
        [System.String[]]
        $ResourceModule = (Get-Content -Raw -Path (Join-Path -Path $PSScriptRoot -ChildPath '\data\resources.json') | ConvertFrom-Json).Resources,

        [Parameter()]
        [System.String]
        $ExportTo
    )

    begin
    {
        <#
            Using [ordered] to make sure the modules are written to disk in
            alphabetical order (see sorting further down). This is so that
            it is easier to review.
        #>
        $allResources = [ordered] @{ }
    }

    process
    {
        # Sorting the resource modules so the resulting file is easier to review.
        foreach ($resourceName in ($ResourceModule | Sort-Object))
        {
            try
            {
                Write-Verbose -Message ('Get information about module {0}.' -f $resourceName)

                $moduleResourceInfo = Find-Module -Name $resourceName -ErrorAction 'Stop'

                if ($ModuleResourceInfo)
                {
                    $allResources.Add($resourceName, $moduleResourceInfo)
                }
            }
            catch
            {
                Write-Warning -Message ('Could not get information about resource module {0}. Error: {1}' -f $resourceName, $_.Exception.Message)
            }
        }
    }

    end
    {
        $moduleInformation = $allResources | ConvertTo-Json -Depth 12

        if ($PSBoundParameters.ContainsKey('ExportTo'))
        {
            $utf8NoBomEncoding = New-Object -TypeName System.Text.UTF8Encoding -ArgumentList $false

            [System.IO.File]::WriteAllLines($ExportTo, $moduleInformation, $utf8NoBomEncoding)
        }
        else
        {
            $moduleInformation
        }
    }
}

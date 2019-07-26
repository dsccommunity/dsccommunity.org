function Get-DscResourceKitInfo
{
    param (
        [Parameter(
            ValueFromPipeline,
            ValueFromPipelineByPropertyName
        )]
        $ResourceModule = (Get-Content -Raw -Path (Join-Path -Path $PSScriptRoot -ChildPath '\data\resources.json') | ConvertFrom-Json).Resources,

        [string]
        $ExportTo
    )

    begin
    {
        $allResources = @{ }
    }

    process
    {
        foreach ($resourceName in $ResourceModule)
        {
            $moduleResourceInfo = Find-Module -Name $ResourceName

            if ($ModuleResourceInfo)
            {
                $allResources.Add($resourceName, $moduleResourceInfo)
            }
        }
    }

    end
    {
        $string = $allResources | ConvertTo-Json -Depth 12

        if ($PSBoundParameters.ContainsKey('ExportTo'))
        {
            $utf8NoBomEncoding = New-Object -TypeName System.Text.UTF8Encoding -ArgumentList $false
            [System.IO.File]::WriteAllLines($ExportTo, $string, $utf8NoBomEncoding)
        }
        else
        {
            $string
        }
    }
}

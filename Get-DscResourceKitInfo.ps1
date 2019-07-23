function Get-DscResourceKitInfo {
    Param(
        [Parameter(
            ValueFromPipeline,
            ValueFromPipelineByPropertyName
        )]
        $ResourceModule = (Get-Content -Raw -Path '.\data\resources.json' | ConvertFrom-Json).Resources,

        [string]
        $ExportTo
    )

    begin {
        $AllResources = @{}
    }

    process {
        foreach ($ResourceName in $ResourceModule) {
            $ModuleResourceInfo = Find-Module -Name $ResourceName
            if ($ModuleResourceInfo) {
                $AllResources.Add($ResourceName,$ModuleResourceInfo)
            }
        }
    }

    end {
        $String = $AllResources | ConvertTo-Json -Depth 10
        if ($PSBoundParameters.ContainsKey('ExportTo')) {
            $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
            [System.IO.File]::WriteAllLines($ExportTo, $String, $Utf8NoBomEncoding)
        }
        else {
            $String
        }
    }
}

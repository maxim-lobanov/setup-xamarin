param (
    [string]$MonoVersion,
    [string]$XamarinIOSVersion,
    [string]$XamarinMacVersion,
    [string]$XamarinAndroidVersion
)

function Test-ToolVersion {
    param (
        [string]$ToolName,
        [string]$ExpectedVersion
    )

    if ([string]::IsNullOrEmpty($ExpectedVersion)) {
        return
    }

    Write-Host "Check $ToolName Version..."

    $versionFilePath = "/Library/Frameworks/$ToolName.framework/Versions/Current/Version"
    $actualVersion = Get-Content $versionFilePath
    if (!$actualVersion.StartsWith($ExpectedVersion)) {
        Write-Error("Incorrect $ToolName version: $actualVersion")
        exit 1
    }

    Write-Host "Correct $ToolName version: $ExpectedVersion"
}

if (![string]::IsNullOrEmpty($MonoVersion)) {
    Write-Host "Check Mono Version..."
    $actualVersion = & mono --version
    if (!$actualVersion[0].StartsWith("Mono JIT compiler version $MonoVersion")) {
        Write-Error("Incorrect Mono version: $actualVersion")
        exit 1
    }
}

Test-ToolVersion -ToolName "Mono" -ExpectedVersion $MonoVersion
Test-ToolVersion -ToolName "Xamarin.IOS" -ExpectedVersion $XamarinIOSVersion
Test-ToolVersion -ToolName "Xamarin.Mac" -ExpectedVersion $XamarinMacVersion
Test-ToolVersion -ToolName "Xamarin.Android" -ExpectedVersion $XamarinAndroidVersion